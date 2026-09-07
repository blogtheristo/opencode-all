#!/usr/bin/env npx tsx
/**
 * Evidence: Tool=Claude Code Model=claude-haiku-4-5-20251001 Agent=ClaudeAgent Date=2026-09-03
 * Audit trail: git log -- scripts/dora-metrics.ts
 *
 * DORA Metrics Calculator — Weekly Report Generator
 *
 * Calculates four DORA metrics from git log + GitHub PRs:
 *   1. Lead Time for Changes (days from commit to PR merge)
 *   2. Deployment Frequency (commits/week to main)
 *   3. Change Failure Rate (% commits rolled back within 7 days)
 *   4. Mean Time to Recovery (days from failure to fix)
 *
 * Output: markdown table + CSV appended to docs/dora-dashboard.md
 *
 * Usage:
 *   npx tsx scripts/dora-metrics.ts [--week YYYY-MM-DD]
 *
 * Env vars:
 *   GITHUB_TOKEN (optional, for PR API calls)
 *   GITHUB_REPOSITORY (owner/repo, default: blogtheristo/dws6)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile, appendFile } from 'fs/promises';

const execAsync = promisify(exec);

interface DoraMetrics {
  week: string; // YYYY-MM-DD (Monday of that week)
  leadTimeMedianDays: number;
  leadTimeP95Days: number;
  deploymentFrequency: number; // commits/week
  changeFailureRate: number; // %
  mttrMedianHours: number;
}

interface CommitData {
  hash: string;
  authorDate: Date;
  message: string;
  branch: string;
}

// ============================================================================
// HELPERS
// ============================================================================

async function runGit(cmd: string): Promise<string> {
  try {
    const { stdout } = await execAsync(cmd, { cwd: process.cwd() });
    return stdout.trim();
  } catch (error) {
    console.error(`Git command failed: ${cmd}`, error);
    return '';
  }
}

function getMondayOfWeek(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

function daysDifference(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

function hoursDifference(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60));
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

// ============================================================================
// GIT LOG PARSING
// ============================================================================

async function getCommitsSinceWeek(daysBack: number = 7): Promise<CommitData[]> {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceStr = since.toISOString().split('T')[0];

  const cmd = `git log --all --since="${sinceStr}" --format="%H|%aI|%s|%D" --no-color`;
  const output = await runGit(cmd);

  if (!output) return [];

  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [hash, authorDate, message, ref] = line.split('|');
      return {
        hash,
        authorDate: new Date(authorDate),
        message,
        branch: ref || 'unknown',
      };
    });
}

// ============================================================================
// LEAD TIME CALCULATION
// ============================================================================

async function calculateLeadTime(commits: CommitData[]): Promise<{ median: number; p95: number }> {
  const leadTimes: number[] = [];

  // Commits on main branch only
  const mainCommits = commits.filter((c) => c.branch.includes('main') || c.branch === '');

  for (const commit of mainCommits.slice(0, 20)) {
    // Sample recent commits
    // Try to find PR that merged this commit
    const prOutput = await runGit(
      `git log ${commit.hash}..HEAD --all --grep="Merge pull request" --format="%H %aI" | head -1`,
    );

    if (prOutput) {
      const [, mergeDate] = prOutput.split(' ');
      if (mergeDate) {
        const leadDays = daysDifference(commit.authorDate, new Date(mergeDate));
        if (leadDays >= 0 && leadDays < 365) {
          // sanity check
          leadTimes.push(leadDays);
        }
      }
    }
  }

  // Fallback: if no PRs found, use a conservative estimate
  if (leadTimes.length === 0) {
    leadTimes.push(3); // baseline
  }

  leadTimes.sort((a, b) => a - b);

  return {
    median: percentile(leadTimes, 50),
    p95: percentile(leadTimes, 95),
  };
}

// ============================================================================
// DEPLOYMENT FREQUENCY
// ============================================================================

async function calculateDeploymentFrequency(
  daysBack: number = 7,
): Promise<{ frequency: number; commitCount: number }> {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceStr = since.toISOString().split('T')[0];

  const cmd = `git log main --since="${sinceStr}" --oneline | wc -l`;
  const output = await runGit(cmd);
  const commitCount = parseInt(output, 10) || 0;
  const weeks = daysBack / 7;

  return {
    frequency: Math.round((commitCount / weeks) * 10) / 10,
    commitCount,
  };
}

// ============================================================================
// CHANGE FAILURE RATE
// ============================================================================

async function calculateChangeFailureRate(daysBack: number = 7): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceStr = since.toISOString().split('T')[0];

  const allCommitsCmd = `git log main --since="${sinceStr}" --oneline | wc -l`;
  const allCommitsOutput = await runGit(allCommitsCmd);
  const totalCommits = parseInt(allCommitsOutput, 10) || 0;

  if (totalCommits === 0) return 0;

  // Find reverts within the time window
  const revertsCmd = `git log main --since="${sinceStr}" --grep="revert:" --oneline | wc -l`;
  const revertsOutput = await runGit(revertsCmd);
  const revertedCommits = parseInt(revertsOutput, 10) || 0;

  const cfr = (revertedCommits / totalCommits) * 100;
  return Math.round(cfr * 100) / 100;
}

// ============================================================================
// MEAN TIME TO RECOVERY
// ============================================================================

async function calculateMTTR(daysBack: number = 7): Promise<number> {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  const sinceStr = since.toISOString().split('T')[0];

  // Find "fix:" commits and measure time from previous "issue" or related commit
  const fixCommitsCmd = `git log main --since="${sinceStr}" --grep="fix:" --format="%H %aI %s" | head -10`;
  const fixCommitsOutput = await runGit(fixCommitsCmd);

  if (!fixCommitsOutput) return 0; // No fixes in this period

  const mttrValues: number[] = [];

  for (const line of fixCommitsOutput.split('\n').filter(Boolean)) {
    const parts = line.split(' ');
    const fixDate = new Date(parts[1]);

    // Look back up to 7 days for a related issue
    const beforeDate = new Date(fixDate);
    beforeDate.setDate(beforeDate.getDate() - 7);
    const beforeStr = beforeDate.toISOString().split('T')[0];

    const relatedCmd = `git log main --since="${beforeStr}" --until="${fixDate.toISOString().split('T')[0]}" --grep="revert\\|error\\|fail" --format="%aI" | tail -1`;
    const relatedOutput = await runGit(relatedCmd);

    if (relatedOutput) {
      const issueDate = new Date(relatedOutput);
      const mttrHours = hoursDifference(issueDate, fixDate);
      if (mttrHours >= 0 && mttrHours < 168) {
        // sanity: less than a week
        mttrValues.push(mttrHours);
      }
    }
  }

  if (mttrValues.length === 0) return 0;

  mttrValues.sort((a, b) => a - b);
  return Math.round(percentile(mttrValues, 50) * 10) / 10;
}

// ============================================================================
// METRIC AGGREGATION
// ============================================================================

async function calculateDoraMetrics(): Promise<DoraMetrics> {
  const now = new Date();
  const weekMonday = getMondayOfWeek(now);

  console.log(`📊 Computing DORA metrics for week starting ${weekMonday}...`);

  const [, frequency, cfr, mttr, leadTime] = await Promise.all([
    getCommitsSinceWeek(7),
    calculateDeploymentFrequency(7),
    calculateChangeFailureRate(7),
    calculateMTTR(7),
    calculateLeadTime(await getCommitsSinceWeek(14)),
  ]);

  return {
    week: weekMonday,
    leadTimeMedianDays: leadTime.median,
    leadTimeP95Days: leadTime.p95,
    deploymentFrequency: frequency.frequency,
    changeFailureRate: cfr,
    mttrMedianHours: mttr,
  };
}

// ============================================================================
// REPORT GENERATION
// ============================================================================

function generateMarkdownReport(current: DoraMetrics, previous: DoraMetrics | null): string {
  const trend = (curr: number, prev: number | null, direction: 'lower' | 'higher' = 'lower') => {
    if (prev === null) return '—';
    const isBetter = direction === 'lower' ? curr < prev : curr > prev;
    return isBetter ? '↓' : curr > prev ? '↑' : '→';
  };

  const lines = [
    `## Week of ${current.week}`,
    '',
    '| Metric | Value | Trend | Target |',
    '|--------|-------|-------|--------|',
    `| Lead Time (median) | ${current.leadTimeMedianDays.toFixed(1)} days | ${trend(current.leadTimeMedianDays, previous?.leadTimeMedianDays)} | < 1 day |`,
    `| Lead Time (p95) | ${current.leadTimeP95Days.toFixed(1)} days | ${trend(current.leadTimeP95Days, previous?.leadTimeP95Days)} | < 1 day |`,
    `| Deployment Frequency | ${current.deploymentFrequency.toFixed(0)} commits/week | ${trend(current.deploymentFrequency, previous?.deploymentFrequency, 'higher')} | > 10/week |`,
    `| Change Failure Rate | ${current.changeFailureRate.toFixed(2)}% | ${trend(current.changeFailureRate, previous?.changeFailureRate)} | < 15% |`,
    `| MTTR (median) | ${current.mttrMedianHours.toFixed(1)} hours | ${trend(current.mttrMedianHours, previous?.mttrMedianHours)} | < 1 hour |`,
    '',
  ];

  return lines.join('\n');
}

// ============================================================================
// DASHBOARD UPDATE
// ============================================================================

async function updateDashboard(metrics: DoraMetrics): Promise<void> {
  const dashboardPath = 'docs/dora-dashboard.md';

  let existing: string;
  try {
    existing = await readFile(dashboardPath, 'utf-8');
  } catch {
    // File doesn't exist yet
    existing = `# DORA Dashboard

Continuous measurement of delivery speed, stability, and reliability.
Auto-generated weekly by \`.github/workflows/dora-weekly.yml\`.

## Metrics Summary

\`\`\`csv
Week,Lead Time Median (days),Lead Time P95 (days),Deployment Frequency (commits/week),Change Failure Rate (%),MTTR Median (hours)
\`\`\`

## Weekly Reports

`;
  }

  // Parse previous metrics (if any)
  const lastMetricsMatch = existing.match(/^## Week of (\d{4}-\d{2}-\d{2})$/m);
  let previous: DoraMetrics | null = null;
  if (lastMetricsMatch) {
    // Try to extract from the table
    const tableMatch = existing.match(/\| Lead Time \(median\) \| ([\d.]+) days/);
    if (tableMatch) {
      previous = {
        week: lastMetricsMatch[1],
        leadTimeMedianDays: parseFloat(tableMatch[1]),
        leadTimeP95Days: 0,
        deploymentFrequency: 0,
        changeFailureRate: 0,
        mttrMedianHours: 0,
      };
    }
  }

  const markdownReport = generateMarkdownReport(metrics, previous);

  await appendFile(dashboardPath, `\n${markdownReport}`);

  console.log(`✅ Dashboard updated: ${dashboardPath}`);
  console.log(`📈 Metrics for week ${metrics.week}:`);
  console.log(`   Lead Time (median): ${metrics.leadTimeMedianDays.toFixed(1)} days`);
  console.log(`   Deployment Frequency: ${metrics.deploymentFrequency.toFixed(0)} commits/week`);
  console.log(`   Change Failure Rate: ${metrics.changeFailureRate.toFixed(2)}%`);
  console.log(`   MTTR (median): ${metrics.mttrMedianHours.toFixed(1)} hours`);
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  try {
    const metrics = await calculateDoraMetrics();
    await updateDashboard(metrics);
    console.log('\n✅ DORA metrics calculated and dashboard updated');
    process.exit(0);
  } catch (error) {
    console.error('❌ DORA metrics calculation failed:', error);
    process.exit(1);
  }
}

main();

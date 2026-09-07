#!/usr/bin/env node
/**
 * analyze-decision-log.ts — Weekly decision-pattern audit for Rule 5 compliance
 *
 * Reads .claude/hooks/audit/decision-log.json (JSONL format, gitignored)
 * Groups by category, flags anomalies, generates weekly report.
 *
 * Categories:
 *   judgment   — classification, drafting, summary, extraction (model decides: good)
 *   transform  — parsing, formatting (code decides: good)
 *   routing    — conditional logic (code decides: good)
 *   routine    — inspection, read-only (neutral)
 *   unknown    — uncategorized (review needed)
 *
 * Anomalies flagged:
 *   - High-volume "judgment" in Bash (should be model-driven, not shelled out)
 *   - High-volume "routing" (should be code logic, not repeated retry patterns)
 *   - Unknown categorization (may indicate new pattern)
 *
 * Output:
 *   1. stdout: summary statistics
 *   2. docs/decision-log-weekly-<date>.md: full report
 *
 * Usage:
 *   npm run analyze:decision-log [--dry-run]
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');

// Detect repo root
const repoRoot = (() => {
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf-8' }).trim();
  } catch {
    process.stderr.write('Error: not in a git repository\n');
    process.exit(1);
  }
})();

const logPath = path.join(repoRoot, '.claude/hooks/audit/decision-log.json');
const reportDir = path.join(repoRoot, 'docs/decision-log-reports');
const today = new Date().toISOString().split('T')[0];
const reportPath = path.join(reportDir, `weekly-${today}.md`);

// Read and parse JSONL log
const readLog = (): Array<{
  ts: string;
  tool: string;
  cmd_sample: string;
  category: string;
  context_hash: string;
}> => {
  if (!fs.existsSync(logPath)) {
    return [];
  }

  const content = fs.readFileSync(logPath, 'utf-8');
  return content
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((entry) => entry !== null) as typeof undefined;
};

// Group entries by category
const groupByCategory = (
  entries: Array<{
    ts: string;
    tool: string;
    cmd_sample: string;
    category: string;
    context_hash: string;
  }>,
) => {
  const groups: Record<string, typeof entries> = {};
  for (const entry of entries) {
    if (!groups[entry.category]) groups[entry.category] = [];
    groups[entry.category].push(entry);
  }
  return groups;
};

// Detect anomalies
interface Anomaly {
  severity: 'high' | 'medium' | 'low';
  message: string;
  evidence: string[];
}

const detectAnomalies = (
  entries: Array<{
    ts: string;
    tool: string;
    cmd_sample: string;
    category: string;
    context_hash: string;
  }>,
): Anomaly[] => {
  const anomalies: Anomaly[] = [];
  const groups = groupByCategory(entries);

  // Anomaly 1: judgment-category entries (should be rare in Bash; model should decide)
  const judgmentCount = (groups['judgment'] || []).length;
  if (judgmentCount > 5) {
    const samples = (groups['judgment'] || []).slice(0, 3).map((e) => `\`${e.cmd_sample}\``);
    anomalies.push({
      severity: 'high',
      message: `${judgmentCount} judgment decisions delegated to Bash (should be model-driven). Rule 5 violation.`,
      evidence: samples,
    });
  }

  // Anomaly 2: high routing count (indicates retry loops or excessive branching)
  const routingCount = (groups['routing'] || []).length;
  if (routingCount > 20) {
    const samples = (groups['routing'] || []).slice(0, 3).map((e) => `\`${e.cmd_sample}\``);
    anomalies.push({
      severity: 'medium',
      message: `${routingCount} routing decisions (conditional logic) in Bash. Verify none are retry loops that should be code-handled.`,
      evidence: samples,
    });
  }

  // Anomaly 3: high unknown count
  const unknownCount = (groups['unknown'] || []).length;
  if (unknownCount > 10) {
    const samples = (groups['unknown'] || []).slice(0, 3).map((e) => `\`${e.cmd_sample}\``);
    anomalies.push({
      severity: 'low',
      message: `${unknownCount} uncategorized commands. Analyzer may need pattern updates.`,
      evidence: samples,
    });
  }

  return anomalies;
};

// Generate report
const generateReport = (
  entries: Array<{
    ts: string;
    tool: string;
    cmd_sample: string;
    category: string;
    context_hash: string;
  }>,
  anomalies: Anomaly[],
) => {
  const groups = groupByCategory(entries);
  const totalCount = entries.length;

  let report = `# Decision Log Weekly Report — ${today}\n\n`;
  report += `**Report Date:** ${today}  \n`;
  report += `**Total Entries:** ${totalCount}  \n\n`;

  // Summary table
  report += `## Summary\n\n| Category | Count | Pct |\n| --- | --- | --- |\n`;
  for (const category of ['judgment', 'transform', 'routing', 'routine', 'unknown']) {
    const count = (groups[category] || []).length;
    const pct = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0.0';
    report += `| ${category} | ${count} | ${pct}% |\n`;
  }
  report += '\n';

  // Anomalies
  if (anomalies.length > 0) {
    report += `## Anomalies Detected\n\n`;
    for (const anomaly of anomalies) {
      const severityEmoji = { high: '🔴', medium: '🟡', low: '🟢' }[anomaly.severity];
      report += `### ${severityEmoji} ${anomaly.severity.toUpperCase()}: ${anomaly.message}\n\n`;
      if (anomaly.evidence.length > 0) {
        report += `**Examples:**\n`;
        for (const ex of anomaly.evidence) {
          report += `- ${ex}\n`;
        }
        report += '\n';
      }
    }
  } else {
    report += `## No Anomalies\n\nDecision patterns are within expected bounds.\n\n`;
  }

  // Top 5 by category
  report += `## Top Activity\n\n`;
  for (const category of ['judgment', 'transform', 'routing']) {
    const categoryEntries = groups[category] || [];
    if (categoryEntries.length === 0) continue;
    report += `### ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
    for (const entry of categoryEntries.slice(0, 5)) {
      report += `- \`${entry.cmd_sample}\` (${entry.context_hash})\n`;
    }
    report += '\n';
  }

  report += `---\n\n`;
  report += `**Next Steps:**\n`;
  if (anomalies.filter((a) => a.severity === 'high').length > 0) {
    report += `1. Review high-severity anomalies for Rule 5 compliance\n`;
    report += `2. Consider moving judgment logic to model-driven code paths\n`;
  }
  report += `- Weekly anomaly review enables backlog refinement (Gap 5)\n`;
  report += `- Archive logs monthly for trend analysis\n\n`;

  return report;
};

// Main
const main = async () => {
  const entries = readLog();

  if (entries.length === 0) {
    process.stdout.write('No decision log entries found. First session data will appear here.\n');
    return;
  }

  const anomalies = detectAnomalies(entries);
  const report = generateReport(entries, anomalies);

  // Output to stdout
  process.stdout.write(report);

  // Save report file
  if (!dryRun) {
    fs.mkdirSync(reportDir, { recursive: true });
    fs.writeFileSync(reportPath, report, 'utf-8');
    process.stdout.write(`\nReport saved to: ${reportPath}\n`);
  } else {
    process.stdout.write(`\n[DRY-RUN] Report would be saved to: ${reportPath}\n`);
  }
};

main().catch((err) => {
  process.stderr.write(`Error: ${err.message}\n`);
  process.exit(1);
});

#!/usr/bin/env node

/**
 * DWS PR Throughput Report
 *
 * Analyzes merged PR data from GitHub using `gh` CLI to calculate:
 * - PRs per day
 * - PRs per author
 * - Average time-to-merge
 *
 * Usage:
 *   node scripts/pr-throughput.mjs               # Human-readable, last 30 days
 *   node scripts/pr-throughput.mjs --days 14     # Last 14 days
 *   node scripts/pr-throughput.mjs --json        # JSON output
 *   node scripts/pr-throughput.mjs --json --days 7
 *
 * Gracefully handles missing `gh` CLI (prints message, exits 0).
 */

import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');

// Parse --days N
let days = 30;
const daysIdx = args.indexOf('--days');
if (daysIdx !== -1 && args[daysIdx + 1]) {
  const parsed = parseInt(args[daysIdx + 1], 10);
  if (!isNaN(parsed) && parsed > 0) {
    days = parsed;
  }
}

/**
 * Check if `gh` CLI is available.
 */
function isGhAvailable() {
  try {
    execSync('gh --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetch merged PRs using gh CLI.
 */
function fetchMergedPRs() {
  const cmd = [
    'gh', 'pr', 'list',
    '--state', 'merged',
    '--json', 'number,title,author,createdAt,mergedAt',
    '--limit', '100',
  ].join(' ');

  const output = execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  return JSON.parse(output);
}

/**
 * Calculate time-to-merge in hours.
 */
function hoursToMerge(createdAt, mergedAt) {
  const created = new Date(createdAt);
  const merged = new Date(mergedAt);
  return (merged - created) / (1000 * 60 * 60);
}

/**
 * Format hours as human-readable duration.
 */
function formatDuration(hours) {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  }
  if (hours < 24) {
    return `${hours.toFixed(1)}h`;
  }
  const d = Math.floor(hours / 24);
  const h = Math.round(hours % 24);
  return `${d}d ${h}h`;
}

function main() {
  if (!isGhAvailable()) {
    const msg = 'gh CLI is not available. Install it from https://cli.github.com/ to use this script.';
    if (jsonMode) {
      console.log(JSON.stringify({ error: msg }));
    } else {
      console.log(msg);
    }
    process.exit(0);
  }

  let prs;
  try {
    prs = fetchMergedPRs();
  } catch (err) {
    const msg = `Failed to fetch PRs: ${err.message}`;
    if (jsonMode) {
      console.log(JSON.stringify({ error: msg }));
    } else {
      console.error(msg);
    }
    process.exit(0);
  }

  // Filter to the requested time window
  const now = new Date();
  const cutoff = new Date(now - days * 24 * 60 * 60 * 1000);

  const filtered = prs.filter((pr) => {
    const mergedAt = new Date(pr.mergedAt);
    return mergedAt >= cutoff;
  });

  if (filtered.length === 0) {
    const msg = `No merged PRs found in the last ${days} days.`;
    if (jsonMode) {
      console.log(JSON.stringify({
        generated: now.toISOString(),
        days,
        totalPRs: 0,
        prsPerDay: 0,
        averageTimeToMergeHours: null,
        byAuthor: {},
      }));
    } else {
      console.log(msg);
    }
    process.exit(0);
  }

  // Calculate metrics
  const prsPerDay = filtered.length / days;

  const mergeTimes = filtered.map((pr) => hoursToMerge(pr.createdAt, pr.mergedAt));
  const avgMergeHours = mergeTimes.reduce((a, b) => a + b, 0) / mergeTimes.length;
  const minMergeHours = Math.min(...mergeTimes);
  const maxMergeHours = Math.max(...mergeTimes);

  // PRs by author
  const byAuthor = {};
  for (const pr of filtered) {
    const login = pr.author?.login || 'unknown';
    if (!byAuthor[login]) {
      byAuthor[login] = { count: 0, totalMergeHours: 0 };
    }
    byAuthor[login].count++;
    byAuthor[login].totalMergeHours += hoursToMerge(pr.createdAt, pr.mergedAt);
  }

  // Calculate average merge time per author
  const authorStats = {};
  for (const [login, data] of Object.entries(byAuthor)) {
    authorStats[login] = {
      count: data.count,
      avgMergeHours: data.totalMergeHours / data.count,
    };
  }

  if (jsonMode) {
    const output = {
      generated: now.toISOString(),
      days,
      totalPRs: filtered.length,
      prsPerDay: Math.round(prsPerDay * 100) / 100,
      averageTimeToMergeHours: Math.round(avgMergeHours * 100) / 100,
      minTimeToMergeHours: Math.round(minMergeHours * 100) / 100,
      maxTimeToMergeHours: Math.round(maxMergeHours * 100) / 100,
      byAuthor: authorStats,
      prs: filtered.map((pr) => ({
        number: pr.number,
        title: pr.title,
        author: pr.author?.login || 'unknown',
        createdAt: pr.createdAt,
        mergedAt: pr.mergedAt,
        timeToMergeHours: Math.round(hoursToMerge(pr.createdAt, pr.mergedAt) * 100) / 100,
      })),
    };
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log('=== DWS PR Throughput Report ===');
    console.log(`Period: Last ${days} days (since ${cutoff.toISOString().split('T')[0]})`);
    console.log(`Generated: ${now.toISOString().split('T')[0]}`);
    console.log('');

    console.log('--- Overview ---');
    console.log(`Total merged PRs: ${filtered.length}`);
    console.log(`PRs per day: ${prsPerDay.toFixed(2)}`);
    console.log(`Avg time-to-merge: ${formatDuration(avgMergeHours)}`);
    console.log(`Fastest merge: ${formatDuration(minMergeHours)}`);
    console.log(`Slowest merge: ${formatDuration(maxMergeHours)}`);
    console.log('');

    console.log('--- By Author ---');
    const sortedAuthors = Object.entries(authorStats).sort((a, b) => b[1].count - a[1].count);
    for (const [login, stats] of sortedAuthors) {
      console.log(`  ${login}: ${stats.count} PRs (avg merge: ${formatDuration(stats.avgMergeHours)})`);
    }
    console.log('');

    console.log('--- Recent PRs ---');
    const recent = filtered
      .sort((a, b) => new Date(b.mergedAt) - new Date(a.mergedAt))
      .slice(0, 10);
    for (const pr of recent) {
      const mergeTime = formatDuration(hoursToMerge(pr.createdAt, pr.mergedAt));
      console.log(`  #${pr.number} ${pr.title}`);
      console.log(`    by ${pr.author?.login || 'unknown'} | merged in ${mergeTime}`);
    }
  }
}

main();

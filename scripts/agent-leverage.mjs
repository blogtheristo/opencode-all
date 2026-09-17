#!/usr/bin/env node

/**
 * Agent Leverage Metric  (Playbook Stage 9: "Track and scale Agent Leverage %")
 *
 * Measures what share of the repo's recent work was authored by AI agents vs.
 * typed by humans, paired with a defect-rate proxy so we can watch the playbook's
 * core constraint: leverage UP without defects UP. This is the measurable form of
 * Ryan Lopopolo's "your performance review is how well you direct your interns" —
 * and the missing Stage-9 instrument in DWS6 (see docs/AGENT_DRIVEN_SDLC_PLAYBOOK.md).
 *
 * Attribution signal hierarchy (main squashes every PR to one human committer, so
 * author identity alone is useless — we lean on trailers and branch hints instead):
 *   1. commit body trailer matching  claude.ai/code/session_   (the harness footer)
 *   2. Co-authored-by: ... claude / codex / agent
 *   3. squash subject "(#NNNN)" merged from a claude/* head branch
 *   4. fallback -> "unknown" (counted separately, never inflated into agent share)
 *
 * Defect proxy (heuristic, documented as a proxy — not a bug tracker):
 *   - fix commits: subject matches revert|hotfix|oops|fixup|fix typo|regression
 *   - unstable files: same path touched >= 3 times inside the window
 *
 * Usage:
 *   node scripts/agent-leverage.mjs                      # last 7 days, write + summary
 *   node scripts/agent-leverage.mjs --since "30 days ago"
 *   node scripts/agent-leverage.mjs --json               # machine output only
 *   node scripts/agent-leverage.mjs --no-write           # don't touch docs/metrics
 *
 * Output (Agent Productization Rule: CLI path + structured JSON):
 *   docs/metrics/agent-leverage.json                 (latest)
 *   docs/metrics/agent-leverage/<YYYY-MM-DD>.json    (dated snapshot)
 */

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = join(__dirname, '..');
const METRICS_DIR = join(REPO_ROOT, 'docs', 'metrics');
const LATEST_FILE = join(METRICS_DIR, 'agent-leverage.json');
const SNAPSHOT_DIR = join(METRICS_DIR, 'agent-leverage');

const US = '\x1f'; // unit separator (between fields)
const RS = '\x1e'; // record separator (between commits)

const AGENT_TRAILER = /claude\.ai\/code\/session_/i;
const AGENT_COAUTHOR = /co-authored-by:.*(claude|codex|agent)/i;
const AGENT_BRANCH_SUBJECT = /\bclaude\//i;
const FIX_SUBJECT = /\b(revert|hotfix|oops|fixup|fix\s+typo|regression)\b/i;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) { args[key] = next; i++; }
      else { args[key] = true; }
    }
  }
  return args;
}

function git(gitArgs) {
  try {
    return execFileSync('git', gitArgs, { cwd: REPO_ROOT, encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 });
  } catch (err) {
    console.error('git failed:', gitArgs.join(' '), '\n', err.message);
    process.exit(1);
  }
}

function currentBranch() {
  return git(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
}

/** Classify a commit. Returns { kind: 'agent'|'human'|'unknown', signal }. */
function classify(subject, body) {
  const blob = `${subject}\n${body}`;
  if (AGENT_TRAILER.test(blob)) return { kind: 'agent', signal: 'trailer' };
  if (AGENT_COAUTHOR.test(blob)) return { kind: 'agent', signal: 'coauthor' };
  if (AGENT_BRANCH_SUBJECT.test(subject)) return { kind: 'agent', signal: 'branch' };
  // Heuristic: empty-body squash merges with a PR number are the repo's human-merged
  // default; we cannot prove agency, so they are "unknown" rather than "human".
  if (/\(#\d+\)\s*$/.test(subject.trim()) && !body.trim()) return { kind: 'unknown', signal: 'squash-no-trailer' };
  return { kind: 'human', signal: 'none' };
}

function collect(since) {
  // Pass A: metadata + full body, record-separated.
  const fmt = ['%H', '%an', '%ae', '%ad', '%s', '%B'].join(US) + RS;
  const rawMeta = git(['log', `--since=${since}`, '--no-merges', '--date=short', `--pretty=format:${fmt}`]);

  const commits = new Map();
  for (const rec of rawMeta.split(RS)) {
    const r = rec.replace(/^\n+/, '');
    if (!r.trim()) continue;
    const [hash, an, ae, ad, subject, ...bodyParts] = r.split(US);
    if (!hash) continue;
    const body = bodyParts.join(US);
    const { kind, signal } = classify(subject || '', body || '');
    commits.set(hash, {
      hash, author: an, email: ae, date: ad, subject: subject || '',
      kind, signal, isFix: FIX_SUBJECT.test(subject || ''),
      additions: 0, deletions: 0, files: [],
    });
  }

  // Pass B: numstat per commit, keyed by hash.
  const rawStat = git(['log', `--since=${since}`, '--no-merges', `--pretty=format:${RS}%H`, '--numstat']);
  let cur = null;
  for (const line of rawStat.split('\n')) {
    if (line.startsWith(RS)) { cur = commits.get(line.slice(1).trim()) || null; continue; }
    if (!cur || !line.trim()) continue;
    const m = line.split('\t');
    if (m.length < 3) continue;
    const add = m[0] === '-' ? 0 : parseInt(m[0], 10) || 0;
    const del = m[1] === '-' ? 0 : parseInt(m[1], 10) || 0;
    cur.additions += add;
    cur.deletions += del;
    cur.files.push(m.slice(2).join('\t'));
  }

  return [...commits.values()];
}

function pct(n, d) { return d === 0 ? 0 : Math.round((n / d) * 1000) / 10; }

function build(since) {
  const commits = collect(since);
  const total = commits.length;

  const agent = commits.filter(c => c.kind === 'agent');
  const human = commits.filter(c => c.kind === 'human');
  const unknown = commits.filter(c => c.kind === 'unknown');

  const lines = c => c.additions + c.deletions;
  const totalLines = commits.reduce((s, c) => s + lines(c), 0);
  const agentLines = agent.reduce((s, c) => s + lines(c), 0);

  // Defect proxy.
  const fixCommits = commits.filter(c => c.isFix);
  const fileCounts = new Map();
  for (const c of commits) for (const f of c.files) fileCounts.set(f, (fileCounts.get(f) || 0) + 1);
  const unstable = [...fileCounts.entries()]
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  const leverageByCommits = pct(agent.length, total);
  const leverageByLines = pct(agentLines, totalLines);
  const defectRate = pct(fixCommits.length, total);

  // Verdict bands — the playbook constraint: leverage up WITHOUT defects up.
  let verdict;
  if (total === 0) verdict = 'No commits in window — nothing to measure.';
  else if (leverageByCommits >= 50 && defectRate <= 10) verdict = `Healthy: ${leverageByCommits}% agent-authored at ${defectRate}% defect rate — leverage is compounding.`;
  else if (leverageByCommits >= 50 && defectRate > 20) verdict = `Watch: high leverage (${leverageByCommits}%) but defect rate ${defectRate}% is elevated — tighten guardrails before scaling further.`;
  else if (leverageByCommits < 25) verdict = `Early: only ${leverageByCommits}% agent-authored — humans are still the bottleneck (or attribution signals are missing trailers).`;
  else verdict = `Building: ${leverageByCommits}% agent-authored at ${defectRate}% defect rate.`;

  const signalBreakdown = { trailer: 0, coauthor: 0, branch: 0, none: 0, 'squash-no-trailer': 0 };
  for (const c of commits) signalBreakdown[c.signal] = (signalBreakdown[c.signal] || 0) + 1;

  return {
    generated_at: new Date().toISOString(),
    window: { since, until: 'now', branch: currentBranch() },
    totals: {
      commits: total,
      agent_commits: agent.length,
      human_commits: human.length,
      unknown_commits: unknown.length,
      lines_changed: totalLines,
      agent_lines: agentLines,
    },
    leverage: { by_commits_pct: leverageByCommits, by_lines_pct: leverageByLines },
    defects: { fix_commits: fixCommits.length, defect_rate_pct: defectRate, unstable_files: unstable },
    attribution: { agent_signal_breakdown: signalBreakdown },
    verdict,
    notes: 'Heuristic. main squashes PRs to one committer, so agent share leans on the claude.ai/code session trailer + claude/* branch hints. PR-accurate enrichment available via GitHub MCP list_pull_requests (head branch + additions/deletions).',
  };
}

function printSummary(rep) {
  const r = rep;
  console.log('AGENT LEVERAGE  (' + r.window.since + ' -> now, ' + r.window.branch + ')');
  console.log('============================================================');
  console.log(`  Commits:        ${r.totals.commits}  (agent ${r.totals.agent_commits} / human ${r.totals.human_commits} / unknown ${r.totals.unknown_commits})`);
  console.log(`  Lines changed:  ${r.totals.lines_changed}  (agent ${r.totals.agent_lines})`);
  console.log(`  Leverage:       ${r.leverage.by_commits_pct}% by commits | ${r.leverage.by_lines_pct}% by lines`);
  console.log(`  Defect rate:    ${r.defects.defect_rate_pct}%  (${r.defects.fix_commits} fix commits)`);
  if (r.defects.unstable_files.length) {
    console.log('  Unstable files (>=3 touches):');
    for (const f of r.defects.unstable_files) console.log(`    ${f.count}x  ${f.path}`);
  }
  console.log('  Signals:        ' + JSON.stringify(r.attribution.agent_signal_breakdown));
  console.log('------------------------------------------------------------');
  console.log('  VERDICT: ' + r.verdict);
  console.log('============================================================');
}

function writeOutputs(rep) {
  if (!existsSync(METRICS_DIR)) mkdirSync(METRICS_DIR, { recursive: true });
  if (!existsSync(SNAPSHOT_DIR)) mkdirSync(SNAPSHOT_DIR, { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const json = JSON.stringify(rep, null, 2) + '\n';
  writeFileSync(LATEST_FILE, json, 'utf-8');
  writeFileSync(join(SNAPSHOT_DIR, `${today}.json`), json, 'utf-8');
}

// --- Main ---
const args = parseArgs(process.argv.slice(2));
const since = typeof args.since === 'string' ? args.since : '7 days ago';
const report = build(since);

if (args.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printSummary(report);
}

if (!args['no-write']) {
  writeOutputs(report);
  if (!args.json) console.log('Wrote docs/metrics/agent-leverage.json + dated snapshot.');
}

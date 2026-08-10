/**
 * DWS Cron Runner — DGX Spark Primary Scheduler
 *
 * Mirrors ALL GitHub Actions cron schedules locally on DGX Spark.
 * GitHub Actions workflows become failover-only when this runner is alive.
 *
 * Architecture:
 *   DGX Spark (primary, 24/7) → runs all cron jobs
 *   GitHub Actions (failover)  → checks heartbeat, runs only if DGX Spark is down
 *
 * Code-Version: 1.0.0
 * Branch: claude/dgx-spark-setup-UN9WR
 * Date: 2026-03-29
 * Owner: Lifetime Oy
 */

import cron from 'node-cron';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_DIR = process.env.STATE_DIR || '/app/state';
const LOG_DIR = process.env.LOG_DIR || '/app/logs';
const BACKEND_URL = process.env.DWS_BACKEND_URL || 'http://dws-backend:8080';
const HEARTBEAT_URL = process.env.HEARTBEAT_URL || '';

// ---------------------------------------------------------------------------
// Job Registry — mirrors .github/workflows/*.yml cron schedules
// ---------------------------------------------------------------------------
interface CronJob {
  name: string;
  schedule: string; // cron expression (UTC)
  workflow: string; // corresponding GitHub Actions workflow
  command: CronCommand; // what to execute
  enabled: boolean;
  lastRun?: Date;
  lastStatus?: 'success' | 'failure';
}

type AllowedExecutable = 'bash' | 'node' | 'npx' | 'npm' | 'python3';

interface CronCommand {
  executable: AllowedExecutable;
  args: readonly string[];
  outputFile?: string;
}

const jobs: CronJob[] = [
  // --- DAILY ---
  // daily-site-backup: HOST-ONLY. Needs the actual site folders (dws6.com,
  // dws10.com, onelifetime.world, landing-pages/...) which are not COPY'd into
  // the cron container. Run via host systemd timer or GitHub Actions instead.
  {
    name: 'daily-site-backup',
    schedule: '0 2 * * *',
    workflow: 'daily-site-backup.yml',
    command: { executable: 'bash', args: ['scripts/backup-sites.sh'] },
    enabled: false,
  },
  // daily-db-backup: HOST-ONLY. Needs pg_dump, gpg, scp — none of which exist
  // in node:22-slim. Originally designed to run on Acer Veriton host directly.
  {
    name: 'daily-db-backup',
    schedule: '30 2 * * *',
    workflow: 'daily-db-backup.yml',
    command: { executable: 'bash', args: ['scripts/db-daily-backup.sh'] },
    enabled: false,
  },
  {
    name: 'campaign-daily-posts',
    schedule: '0 3 * * *',
    workflow: 'campaign-daily-posts.yml',
    command: { executable: 'npx', args: ['tsx', 'scripts/generate-campaign-post.ts'] },
    enabled: true,
  },
  {
    // Runs 30 min before the morning brief so the brief sees the post-park state.
    // Parks threads with maxed-out nudges or next_action_date older than 30d.
    name: 'park-stale-threads',
    schedule: '30 3 * * 1-6',
    workflow: 'park-stale-threads.yml',
    command: { executable: 'npx', args: ['tsx', 'scripts/daily/park-stale-threads.ts'] },
    enabled: true,
  },
  {
    name: 'morning-brief-v2',
    schedule: '0 4 * * 1-6',
    workflow: 'morning-briefing.yml',
    command: { executable: 'npx', args: ['tsx', 'scripts/send-morning-brief-v2.ts'] },
    enabled: true,
  },
  {
    name: 'construction-leads',
    schedule: '0 4 * * 1-6',
    workflow: 'construction-leads.yml',
    command: { executable: 'node', args: ['-e', `fetch('${BACKEND_URL}/api/construction-leads/fetch', {method:'POST'}).then(r=>console.log(r.status))`] },
    enabled: true,
  },
  {
    name: 'outreach-digest',
    schedule: '5 4 * * 1-6',
    workflow: 'outreach-digest.yml',
    command: { executable: 'node', args: ['-e', `fetch('${BACKEND_URL}/api/outreach/digest', {method:'POST'}).then(r=>console.log(r.status))`] },
    enabled: true,
  },
  {
    name: 'social-scheduler',
    schedule: '0 6 * * 1-5',
    workflow: 'social-scheduler.yml',
    command: { executable: 'npx', args: ['tsx', 'src/social-scheduler/post-library.ts'] },
    enabled: true,
  },
  {
    name: 'captain-briefing',
    schedule: '30 5 * * 1-5',
    workflow: 'captain-briefing.yml',
    command: { executable: 'node', args: ['-e', `fetch('${BACKEND_URL}/api/captain/briefing', {method:'POST'}).then(r=>console.log(r.status))`] },
    enabled: true,
  },
  {
    name: 'regulation-monitor',
    schedule: '30 3 * * 1-5',
    workflow: 'regulation-monitor.yml',
    command: { executable: 'npx', args: ['tsx', 'scripts/send-regulation-digest.ts'] },
    enabled: true,
  },
  // daily-claude-backup: GHA-only (backs up .claude sessions to git commit)
  // daily-backup: GHA-only (creates git archive of intellectual assets)

  // --- WEEKLY ---
  {
    name: 'weekly-report',
    schedule: '0 9 * * 1',
    workflow: 'weekly-report.yml',
    command: { executable: 'npx', args: ['tsx', 'scripts/send-weekly-report-email.ts'] },
    enabled: true,
  },
  {
    name: 'campaign-newsletter',
    schedule: '0 5 * * 5',
    workflow: 'campaign-newsletter.yml',
    command: { executable: 'npx', args: ['tsx', 'scripts/send-campaign-newsletter.ts'] },
    enabled: true,
  },
  // market-research-weekly: HOST-ONLY. node:22-slim has no python3.
  // Run via host systemd timer or GitHub Actions instead.
  {
    name: 'market-research-weekly',
    schedule: '0 7 * * 1',
    workflow: 'market-research-weekly.yml',
    command: { executable: 'python3', args: ['scripts/collect_market_research.py'] },
    enabled: false,
  },
  // daily-mvp-audit: feature parity check across RC1–RC5 + infra metrics.
  // Mirrored from .github/workflows/daily-mvp-audit.yml. day-runner.sh
  // already enforces once-per-day semantics; no Helsinki time guard needed.
  {
    name: 'daily-mvp-audit',
    schedule: '0 2 * * *',
    workflow: 'daily-mvp-audit.yml',
    command: { executable: 'bash', args: ['scripts/daily/mvp-audit.sh'] },
    enabled: true,
  },
  // ted-pipeline: daily TED tender fetch + optional SES outreach.
  // Mirrored from .github/workflows/ted-pipeline.yml (06:00 UTC).
  // Script is also auto-discovered by day-runner.sh under scripts/daily/.
  {
    name: 'ted-pipeline',
    schedule: '0 6 * * *',
    workflow: 'ted-pipeline.yml',
    command: { executable: 'bash', args: ['scripts/daily/ted-pipeline.sh'] },
    enabled: true,
  },
  {
    name: 'ted-followup',
    schedule: '30 7 * * *',
    workflow: 'ted-followup.yml',
    command: { executable: 'bash', args: ['scripts/daily/ted-followup.sh'] },
    enabled: true,
  },
  {
    name: 'ted-learning-weekly',
    schedule: '15 8 * * 1',
    workflow: 'ted-learning-weekly.yml',
    command: { executable: 'bash', args: ['scripts/weekly/ted-learning.sh'] },
    enabled: true,
  },
  // housekeeping-weekly: weekly housekeeping audit per HOUSEKEEPING_POLICY.md.
  // Mirrored from .github/workflows/housekeeping-weekly.yml (Sun 03:00 UTC).
  // Requires `gh` CLI on DGX for issue creation.
  {
    name: 'housekeeping-weekly',
    schedule: '0 3 * * 0',
    workflow: 'housekeeping-weekly.yml',
    command: { executable: 'bash', args: ['scripts/weekly/housekeeping-audit.sh'] },
    enabled: true,
  },
  // roadmap-weekly-tracker: GHA-only (creates GitHub issue with roadmap summary)
  {
    name: 'agents-md-freshness',
    schedule: '0 6 * * 1',
    workflow: 'agents-md-freshness.yml',
    command: { executable: 'node', args: ['scripts/verify-agents-md.mjs', '--json'] },
    enabled: true,
  },
  {
    name: 'golden-principle-scan',
    schedule: '30 6 * * 1',
    workflow: 'golden-principle-scan.yml',
    command: { executable: 'node', args: ['scripts/golden-principle-check.mjs', '--json'] },
    enabled: true,
  },
  // housekeeping-weekly: GHA-only (inline shell checks in workflow)
  {
    name: 'security-audit-enhanced',
    schedule: '0 2 * * 1',
    workflow: 'security-audit-enhanced.yml',
    command: { executable: 'npm', args: ['audit', '--json'], outputFile: '/app/logs/npm-audit.json' },
    enabled: true,
  },
  {
    name: 'dependency-review',
    schedule: '0 0 * * 0',
    workflow: 'dependency_review.yml',
    command: { executable: 'npm', args: ['audit', '--json'], outputFile: '/app/logs/dependency-review.json' },
    enabled: true,
  },

  // --- BIWEEKLY / MONTHLY ---
  // security-scan-biweekly: disabled here (node:22-slim container has no python3).
  // Superseded 2026-07-03: scripts/weekly/security-audit.sh now runs
  // scan_critical_bugs.py --full weekly via day-runner.sh's shell-script host
  // (which does have python3) — a shorter interval than this job ever ran at,
  // so leaving this disabled is correct rather than a gap.
  {
    name: 'security-scan-biweekly',
    schedule: '30 2 1 * *',
    workflow: 'security-scan-biweekly.yml',
    command: { executable: 'python3', args: ['scripts/scan_critical_bugs.py', '--full', '--output', '/app/logs/critical-bugs-report.md'] },
    enabled: false,
  },
  // biweekly-auth-security-audit: not in this heartbeat-mirror list because its
  // GHA workflow never had a DGX-failover check step — but scripts/weekly/auth-security-audit.sh
  // DOES exist and runs via day-runner.sh's folder convention (1st/15th of month), independent
  // of this file. "No standalone script" was stale/incorrect as of 2026-07-03.
  // monthly-security-audit-enhanced: genuinely GHA-only, no DGX script exists — and should
  // NOT be given one without first fixing scripts/security_audit.py, which is a hardcoded
  // placeholder (always reports "85/100") rather than a real audit. See scripts/weekly/security-audit.sh
  // header for detail.
];

// ---------------------------------------------------------------------------
// Execution engine
// ---------------------------------------------------------------------------
function logExecution(job: CronJob, status: 'success' | 'failure', output: string): void {
  const entry = {
    job: job.name,
    workflow: job.workflow,
    status,
    timestamp: new Date().toISOString(),
    output: output.slice(0, 2000),
  };
  const logFile = path.join(LOG_DIR, 'cron-executions.jsonl');
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
}

function saveState(): void {
  const state = jobs.map((j) => ({
    name: j.name,
    lastRun: j.lastRun?.toISOString() || null,
    lastStatus: j.lastStatus || null,
  }));
  fs.writeFileSync(path.join(STATE_DIR, 'cron-state.json'), JSON.stringify(state, null, 2));
}

// Echo captured stdout/stderr to docker logs (line-prefixed) so operators can
// see what each job actually printed, without tailing /app/logs/cron-executions.jsonl.
// Each line capped to keep docker logs manageable; full output still goes to JSONL.
function echoOutput(jobName: string, stream: string, text: string): void {
  if (!text) return;
  const lines = text.split('\n').filter((l) => l.length > 0);
  const max = 40;
  const shown = lines.slice(-max);
  for (const line of shown) {
    console.log(`[${jobName}:${stream}] ${line.slice(0, 500)}`);
  }
  if (lines.length > max) {
    console.log(`[${jobName}:${stream}] ... (${lines.length - max} earlier lines truncated)`);
  }
}

function runJob(job: CronJob): void {
  console.log(`[CRON] Running: ${job.name} (${job.workflow})`);

  // Structured executable and argument arrays avoid shell injection.
  execFile(
    job.command.executable,
    [...job.command.args],
    { timeout: 300_000, cwd: '/app', maxBuffer: 10 * 1024 * 1024 },
    (err, stdout, stderr) => {
      const output = stdout + (stderr ? `\nSTDERR: ${stderr}` : '');
      if (job.command.outputFile) {
        fs.writeFileSync(job.command.outputFile, stdout);
      }
      echoOutput(job.name, 'out', stdout);
      echoOutput(job.name, 'err', stderr);
      if (err) {
        console.error(`[CRON] FAILED: ${job.name} — ${err.message}`);
        job.lastStatus = 'failure';
        logExecution(job, 'failure', `${err.message}\n${output}`);
      } else {
        console.log(`[CRON] OK: ${job.name}`);
        job.lastStatus = 'success';
        logExecution(job, 'success', output);
      }
      job.lastRun = new Date();
      saveState();
    },
  );
}

// ---------------------------------------------------------------------------
// Register all cron jobs
// ---------------------------------------------------------------------------
let activeTasks = 0;

for (const job of jobs) {
  if (!job.enabled) continue;
  if (!cron.validate(job.schedule)) {
    console.error(`[CRON] Invalid schedule for ${job.name}: ${job.schedule}`);
    continue;
  }
  cron.schedule(job.schedule, () => runJob(job), { timezone: 'UTC' });
  activeTasks++;
  console.log(`[CRON] Registered: ${job.name} — ${job.schedule} (${job.workflow})`);
}

console.log(`[CRON] ${activeTasks}/${jobs.length} jobs registered on DGX Spark`);

// ---------------------------------------------------------------------------
// Health endpoint (port 8081)
// ---------------------------------------------------------------------------
const PORT = Number(process.env.CRON_PORT || 8081);

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ok',
        service: 'dws-cron',
        host: 'dgx-spark',
        activeTasks,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }

  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        jobs: jobs.map((j) => ({
          name: j.name,
          schedule: j.schedule,
          workflow: j.workflow,
          enabled: j.enabled,
          lastRun: j.lastRun?.toISOString() || null,
          lastStatus: j.lastStatus || null,
        })),
      }),
    );
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`[CRON] Health endpoint on :${PORT}/health`);
  console.log(`[CRON] Status endpoint on :${PORT}/status`);
});

// ---------------------------------------------------------------------------
// Heartbeat — ping backend every 60s so GitHub Actions knows we're alive
// ---------------------------------------------------------------------------
if (HEARTBEAT_URL) {
  setInterval(() => {
    fetch(HEARTBEAT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: 'dws-cron',
        host: 'dgx-spark',
        activeTasks,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {
      /* backend may be restarting */
    });
  }, 60_000);
}

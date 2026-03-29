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
  schedule: string;           // cron expression (UTC)
  workflow: string;           // corresponding GitHub Actions workflow
  command: string;            // what to execute
  enabled: boolean;
  lastRun?: Date;
  lastStatus?: 'success' | 'failure';
}

const jobs: CronJob[] = [
  // --- DAILY ---
  {
    name: 'daily-site-backup',
    schedule: '0 2 * * *',
    workflow: 'daily-site-backup.yml',
    command: 'npx tsx scripts/daily-site-backup.ts',
    enabled: true,
  },
  {
    name: 'daily-db-backup',
    schedule: '30 2 * * *',
    workflow: 'daily-db-backup.yml',
    command: 'npx tsx scripts/daily-db-backup.ts',
    enabled: true,
  },
  {
    name: 'campaign-daily-posts',
    schedule: '0 3 * * *',
    workflow: 'campaign-daily-posts.yml',
    command: 'npx tsx scripts/generate-campaign-post.ts',
    enabled: true,
  },
  {
    name: 'morning-briefing',
    schedule: '0 4 * * 1-6',
    workflow: 'morning-briefing.yml',
    command: `node -e "fetch('${BACKEND_URL}/api/captain/briefing', {method:'POST'}).then(r=>console.log(r.status))"`,
    enabled: true,
  },
  {
    name: 'construction-leads',
    schedule: '0 4 * * 1-6',
    workflow: 'construction-leads.yml',
    command: `node -e "fetch('${BACKEND_URL}/api/construction-leads/fetch', {method:'POST'}).then(r=>console.log(r.status))"`,
    enabled: true,
  },
  {
    name: 'outreach-digest',
    schedule: '5 4 * * 1-6',
    workflow: 'outreach-digest.yml',
    command: `node -e "fetch('${BACKEND_URL}/api/outreach/digest', {method:'POST'}).then(r=>console.log(r.status))"`,
    enabled: true,
  },
  {
    name: 'social-scheduler',
    schedule: '0 6 * * 1-5',
    workflow: 'social-scheduler.yml',
    command: 'npx tsx src/social-scheduler/post-library.ts',
    enabled: true,
  },
  {
    name: 'captain-briefing',
    schedule: '30 5 * * 1-5',
    workflow: 'captain-briefing.yml',
    command: `node -e "fetch('${BACKEND_URL}/api/captain/briefing', {method:'POST'}).then(r=>console.log(r.status))"`,
    enabled: true,
  },
  {
    name: 'regulation-monitor',
    schedule: '30 3 * * 1-5',
    workflow: 'regulation-monitor.yml',
    command: 'npx tsx scripts/regulation-monitor.ts',
    enabled: true,
  },
  {
    name: 'daily-claude-backup',
    schedule: '0 6 * * *',
    workflow: 'daily-claude-backup.yml',
    command: 'npx tsx scripts/daily-claude-backup.ts',
    enabled: true,
  },
  {
    name: 'daily-backup',
    schedule: '55 23 * * *',
    workflow: 'daily-backup.yml',
    command: 'npx tsx scripts/daily-backup.ts',
    enabled: true,
  },

  // --- WEEKLY ---
  {
    name: 'weekly-report',
    schedule: '0 9 * * 1',
    workflow: 'weekly-report.yml',
    command: 'npx tsx scripts/weekly-report.ts',
    enabled: true,
  },
  {
    name: 'campaign-newsletter',
    schedule: '0 5 * * 5',
    workflow: 'campaign-newsletter.yml',
    command: 'npx tsx scripts/campaign-newsletter.ts',
    enabled: true,
  },
  {
    name: 'market-research-weekly',
    schedule: '0 7 * * 1',
    workflow: 'market-research-weekly.yml',
    command: 'npx tsx scripts/market-research-weekly.ts',
    enabled: true,
  },
  {
    name: 'roadmap-weekly-tracker',
    schedule: '0 8 * * 1',
    workflow: 'roadmap-weekly-tracker.yml',
    command: 'npx tsx scripts/roadmap-weekly-tracker.ts',
    enabled: true,
  },
  {
    name: 'agents-md-freshness',
    schedule: '0 6 * * 1',
    workflow: 'agents-md-freshness.yml',
    command: 'npx tsx scripts/agents-md-freshness.ts',
    enabled: true,
  },
  {
    name: 'golden-principle-scan',
    schedule: '30 6 * * 1',
    workflow: 'golden-principle-scan.yml',
    command: 'npx tsx scripts/golden-principle-scan.ts',
    enabled: true,
  },
  {
    name: 'housekeeping-weekly',
    schedule: '0 3 * * 0',
    workflow: 'housekeeping-weekly.yml',
    command: 'npx tsx scripts/housekeeping-weekly.ts',
    enabled: true,
  },
  {
    name: 'security-audit-enhanced',
    schedule: '0 2 * * 1',
    workflow: 'security-audit-enhanced.yml',
    command: 'npm audit --json > /app/logs/npm-audit.json 2>&1',
    enabled: true,
  },
  {
    name: 'security-scan-weekly',
    schedule: '0 21 * * 0',
    workflow: 'security-scan-weekly.yml',
    command: 'npx tsx scripts/security-scan.ts',
    enabled: true,
  },
  {
    name: 'dependency-review',
    schedule: '0 0 * * 0',
    workflow: 'dependency_review.yml',
    command: 'npm audit --json > /app/logs/dependency-review.json 2>&1',
    enabled: true,
  },

  // --- BIWEEKLY / MONTHLY ---
  {
    name: 'biweekly-auth-security-audit',
    schedule: '0 2 1,15 * *',
    workflow: 'biweekly-auth-security-audit.yml',
    command: 'npx tsx scripts/auth-security-audit.ts',
    enabled: true,
  },
  {
    name: 'security-scan-biweekly',
    schedule: '30 2 1 * *',
    workflow: 'security-scan-biweekly.yml',
    command: 'npx tsx scripts/security-scan-biweekly.ts',
    enabled: true,
  },
  {
    name: 'monthly-security-audit-enhanced',
    schedule: '0 0 1 * *',
    workflow: 'monthly-security-audit-enhanced.yml',
    command: 'npx tsx scripts/monthly-security-audit.ts',
    enabled: true,
  },
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
  const state = jobs.map(j => ({
    name: j.name,
    lastRun: j.lastRun?.toISOString() || null,
    lastStatus: j.lastStatus || null,
  }));
  fs.writeFileSync(
    path.join(STATE_DIR, 'cron-state.json'),
    JSON.stringify(state, null, 2)
  );
}

function runJob(job: CronJob): void {
  const [cmd, ...args] = job.command.split(' ');
  console.log(`[CRON] Running: ${job.name} (${job.workflow})`);

  execFile(cmd, args, { timeout: 300_000, cwd: '/app' }, (err, stdout, stderr) => {
    const output = stdout + (stderr ? `\nSTDERR: ${stderr}` : '');
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
  });
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
    res.end(JSON.stringify({
      status: 'ok',
      service: 'dws-cron',
      host: 'dgx-spark',
      activeTasks,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  if (req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      jobs: jobs.map(j => ({
        name: j.name,
        schedule: j.schedule,
        workflow: j.workflow,
        enabled: j.enabled,
        lastRun: j.lastRun?.toISOString() || null,
        lastStatus: j.lastStatus || null,
      })),
    }));
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
    }).catch(() => { /* backend may be restarting */ });
  }, 60_000);
}

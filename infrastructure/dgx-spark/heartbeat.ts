/**
 * DGX Spark Heartbeat Service
 *
 * Lightweight health aggregator. GitHub Actions workflows check this
 * endpoint before running — if DGX Spark is alive, GHA skips (failover mode).
 *
 * Endpoints:
 *   GET /           → full status JSON (for Cursor / CC Mobile dashboards)
 *   GET /health     → simple alive check
 *   GET /ping       → "pong" (minimal latency check)
 *
 * Code-Version: 1.1.0
 * Date: 2026-06-05
 */

import http from 'http';
import { pathToFileURL } from 'node:url';

const PORT = Number(process.env.PORT || 9999);
const CHECK_BACKEND = process.env.CHECK_BACKEND || 'http://dws-backend:8080/health';
const CHECK_CRON = process.env.CHECK_CRON || 'http://dws-cron:8081/health';
const CHECK_OLLAMA = process.env.CHECK_OLLAMA || 'http://host.docker.internal:11434/api/tags';
const CHECK_NEMOCLAW = process.env.CHECK_NEMOCLAW || 'http://nemoclaw:8090/health';
const CHECK_ASPIRE = process.env.CHECK_ASPIRE || 'http://aspire-dashboard:18888/health';
const CHECK_RUNNER = process.env.CHECK_RUNNER || 'http://host.docker.internal:9800/healthz';
const CHECK_STATE_OBSERVER =
  process.env.CHECK_STATE_OBSERVER || 'http://state-observer:9801/health';
const CHECK_MCP_GATEWAY = process.env.CHECK_MCP_GATEWAY || 'http://mcp-gateway:8080/health';
const STATUS_TOKEN = process.env.HEARTBEAT_STATUS_TOKEN || '';

// Services that MUST be up for DGX Spark to count as "handling jobs". The
// /health endpoint (the GitHub Actions failover signal) returns 200 only when
// all of these are up; any one down → 503 so GHA takes over the schedules.
//
// Why this exists: the old /health returned 200 whenever ANY of the 7 monitored
// services was up ("degraded"). So if the cron container died but Ollama/Aspire
// were still up, GHA saw 200, treated DGX as alive, and SKIPPED every scheduled
// job — the jobs then ran nowhere. Failover must key off the services that
// actually run the work (cron scheduler + backend), not observability extras
// (aspire, state-observer, github-runner, openclaw). Override via env.
const CRITICAL_SERVICES = (process.env.HEARTBEAT_CRITICAL_SERVICES || 'backend,cron')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

// LAN-only CIDR check (192.168.x.x, 10.x.x.x, 172.16-31.x.x, ::1, 127.x.x.x)
function isLanClient(req: http.IncomingMessage): boolean {
  const ip = req.socket.remoteAddress || '';
  return (
    /^(::ffff:)?(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.|127\.)/.test(ip) ||
    ip === '::1' ||
    ip === '::ffff:127.0.0.1'
  );
}

interface ServiceStatus {
  name: string;
  url: string;
  status: 'up' | 'down';
  latencyMs: number;
  lastCheck: string;
  detail?: string;
}

const SERVICE_CHECKS = [
  { name: 'backend', url: CHECK_BACKEND },
  { name: 'cron', url: CHECK_CRON },
  { name: 'ollama', url: CHECK_OLLAMA },
  { name: 'nemoclaw', url: CHECK_NEMOCLAW },
  { name: 'aspire', url: CHECK_ASPIRE },
  { name: 'github-runner', url: CHECK_RUNNER },
  { name: 'state-observer', url: CHECK_STATE_OBSERVER },
  { name: 'mcp-gateway', url: CHECK_MCP_GATEWAY },
] as const;

const services: ServiceStatus[] = [];
let systemStatus: 'healthy' | 'degraded' | 'down' = 'down';

// ---------------------------------------------------------------------------
// Pure decision helpers (exported for unit tests — no side effects)
// ---------------------------------------------------------------------------

/** Dashboard-facing rollup across ALL monitored services. */
export function computeSystemStatus(
  svc: ReadonlyArray<{ status: 'up' | 'down' }>,
): 'healthy' | 'degraded' | 'down' {
  if (svc.length === 0) return 'down';
  const up = svc.filter((s) => s.status === 'up').length;
  if (up === svc.length) return 'healthy';
  if (up > 0) return 'degraded';
  return 'down';
}

export interface FailoverDecision {
  /** true → DGX is running the schedules, GHA should skip (200). */
  handling: boolean;
  /** Critical services that are down or not yet reporting. */
  down: string[];
}

/**
 * Decide whether DGX Spark is handling scheduled jobs. A critical service that
 * is missing from the report (e.g. before the first check completes) counts as
 * down — fail safe toward letting GHA take over rather than dropping jobs.
 */
export function evaluateFailover(
  svc: ReadonlyArray<{ name: string; status: 'up' | 'down' }>,
  critical: ReadonlyArray<string>,
): FailoverDecision {
  const down = critical.filter((name) => {
    const s = svc.find((x) => x.name === name);
    return !s || s.status === 'down';
  });
  return { handling: down.length === 0, down };
}

async function checkService(name: string, url: string): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return {
      name,
      url,
      status: res.ok ? 'up' : 'down',
      latencyMs: Date.now() - start,
      lastCheck: new Date().toISOString(),
    };
  } catch (e) {
    return {
      name,
      url,
      status: 'down',
      latencyMs: Date.now() - start,
      lastCheck: new Date().toISOString(),
      detail: (e as Error).message,
    };
  }
}

async function runChecks(): Promise<void> {
  const results = await Promise.all(SERVICE_CHECKS.map(({ name, url }) => checkService(name, url)));

  services.length = 0;
  services.push(...results);

  systemStatus = computeSystemStatus(results);
}

const server = http.createServer(async (req, res) => {
  // Public endpoints (/ping, /health) — no CORS restriction, minimal info
  // Private endpoints (/status, /api/*) — LAN-only OR token-gated

  // GET /ping — minimal latency check (public, safe)
  if (req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
    return;
  }

  // GET /health — GitHub Actions failover signal (public, safe).
  // 200 → DGX is running the schedules, GHA skips. 503 → a critical service
  // (cron/backend) is down, GHA takes over. Keyed off CRITICAL_SERVICES, NOT
  // the all-or-nothing rollup, so a dead cron container can never read as 200.
  if (req.url === '/health') {
    const failover = evaluateFailover(services, CRITICAL_SERVICES);
    const code = failover.handling ? 200 : 503;
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: systemStatus,
        handling: failover.handling,
        criticalServices: CRITICAL_SERVICES,
        criticalDown: failover.down,
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }

  // --- Private endpoints below: LAN-only or token-gated ---
  const lan = isLanClient(req);
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const hasToken = STATUS_TOKEN && url.searchParams.get('token') === STATUS_TOKEN;

  if (!lan && !hasToken) {
    res.writeHead(403, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'forbidden', hint: 'LAN-only or ?token= required' }));
    return;
  }

  // GET / or /status — full dashboard (LAN or token-gated)
  if (req.url === '/' || url.pathname === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        host: 'dgx-spark',
        hardware: 'Acer Veriton GN100 — NVIDIA Grace Blackwell GB10 — 128GB',
        system: systemStatus,
        uptime: process.uptime(),
        services,
        models: {
          primary: 'nemotron-3-super (Ollama, local, MoE 120B/12.7B active)',
          fast: 'qwen3-coder:30b (Ollama, local)',
          cloud: 'claude-opus-4-6 (Anthropic API)',
          fallback: 'groq/llama-3.3-70b-versatile',
        },
        failover: 'GitHub Actions (checks /health every 5min)',
        timestamp: new Date().toISOString(),
      }),
    );
    return;
  }

  // GET /api/models/approve?token=dws-model-YYYYMMDD — HIL approves model pull
  if (url.pathname === '/api/models/approve') {
    const modelToken = url.searchParams.get('token');
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const expectedToken = `dws-model-${today}`;

    if (modelToken !== expectedToken) {
      res.writeHead(403, { 'Content-Type': 'text/html' });
      res.end(
        "<h1>Token expired</h1><p>Model approval tokens are valid for one day only. Check tomorrow's email.</p>",
      );
      return;
    }

    // Write approval state for the daily model check script to pick up
    const fs = await import('fs');
    const approveState = JSON.stringify({
      approved: true,
      date: new Date().toISOString().slice(0, 10),
      approvedAt: new Date().toISOString(),
    });
    fs.writeFileSync('/home/admin100/dws6/logs/model-approve-state.json', approveState);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <h1>Approved</h1>
      <p>Model update approved at ${new Date().toISOString()}.</p>
      <p>DGX Spark will pull missing models on the next day-runner cycle (within 5 minutes).</p>
      <p><a href="/">View system status</a></p>
    `);
    console.log(`[HEARTBEAT] Model update APPROVED by HIL at ${new Date().toISOString()}`);
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

// Only start the service when run directly (e.g. `tsx heartbeat.ts`), not when
// imported by a test. Keeps the pure helpers above unit-testable.
const isMain = process.argv[1] ? import.meta.url === pathToFileURL(process.argv[1]).href : false;

if (isMain) {
  // Kick off the first check immediately, then poll every 30s.
  runChecks();
  setInterval(runChecks, 30_000);

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[HEARTBEAT] DGX Spark heartbeat on :${PORT}`);
    console.log(`[HEARTBEAT] Dashboard: http://localhost:${PORT}/`);
    console.log(`[HEARTBEAT] Health:    http://localhost:${PORT}/health`);
    console.log(`[HEARTBEAT] Ping:      http://localhost:${PORT}/ping`);
    console.log(`[HEARTBEAT] Failover critical services: ${CRITICAL_SERVICES.join(', ')}`);
  });
}

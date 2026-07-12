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
 * Code-Version: 1.0.1
 * Date: 2026-05-22
 */

import http from 'http';

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

  const upCount = results.filter((s) => s.status === 'up').length;
  if (upCount === results.length) systemStatus = 'healthy';
  else if (upCount > 0) systemStatus = 'degraded';
  else systemStatus = 'down';
}

// Check every 30s
setInterval(runChecks, 30_000);
runChecks();

const server = http.createServer(async (req, res) => {
  // Public endpoints (/ping, /health) — no CORS restriction, minimal info
  // Private endpoints (/status, /api/*) — LAN-only OR token-gated

  // GET /ping — minimal latency check (public, safe)
  if (req.url === '/ping') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('pong');
    return;
  }

  // GET /health — simple alive check for GitHub Actions failover (public, safe)
  if (req.url === '/health') {
    const code = systemStatus === 'down' ? 503 : 200;
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: systemStatus,
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

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[HEARTBEAT] DGX Spark heartbeat on :${PORT}`);
  console.log(`[HEARTBEAT] Dashboard: http://localhost:${PORT}/`);
  console.log(`[HEARTBEAT] Health:    http://localhost:${PORT}/health`);
  console.log(`[HEARTBEAT] Ping:      http://localhost:${PORT}/ping`);
});

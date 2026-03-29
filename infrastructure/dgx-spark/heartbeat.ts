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
 * Code-Version: 1.0.0
 * Date: 2026-03-29
 */

import http from 'http';

const PORT = Number(process.env.PORT || 9999);
const CHECK_BACKEND = process.env.CHECK_BACKEND || 'http://dws-backend:8080/health';
const CHECK_CRON = process.env.CHECK_CRON || 'http://dws-cron:8081/health';
const CHECK_OLLAMA = process.env.CHECK_OLLAMA || 'http://host.docker.internal:11434/api/tags';

interface ServiceStatus {
  name: string;
  url: string;
  status: 'up' | 'down';
  latencyMs: number;
  lastCheck: string;
  detail?: string;
}

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
  const results = await Promise.all([
    checkService('backend', CHECK_BACKEND),
    checkService('cron', CHECK_CRON),
    checkService('ollama', CHECK_OLLAMA),
  ]);

  services.length = 0;
  services.push(...results);

  const upCount = results.filter(s => s.status === 'up').length;
  if (upCount === results.length) systemStatus = 'healthy';
  else if (upCount > 0) systemStatus = 'degraded';
  else systemStatus = 'down';
}

// Check every 30s
setInterval(runChecks, 30_000);
runChecks();

const server = http.createServer((req, res) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
  };

  // GET /ping — minimal
  if (req.url === '/ping') {
    res.writeHead(200, { ...cors, 'Content-Type': 'text/plain' });
    res.end('pong');
    return;
  }

  // GET /health — simple alive check for GitHub Actions failover
  if (req.url === '/health') {
    const code = systemStatus === 'down' ? 503 : 200;
    res.writeHead(code, { ...cors, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: systemStatus,
      host: 'dgx-spark',
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // GET / — full dashboard status (for Cursor / CC Mobile)
  if (req.url === '/' || req.url === '/status') {
    res.writeHead(200, { ...cors, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      host: 'dgx-spark',
      hardware: 'Acer Veriton GN100 — NVIDIA Grace Blackwell GB10 — 128GB',
      system: systemStatus,
      uptime: process.uptime(),
      services,
      models: {
        primary: 'llama3.3:70b (Ollama, local)',
        fast: 'qwen2.5-coder:32b (Ollama, local)',
        cloud: 'claude-opus-4-6 (Anthropic API)',
        fallback: 'groq/llama-3.3-70b-versatile',
      },
      failover: 'GitHub Actions (checks /health every 5min)',
      timestamp: new Date().toISOString(),
    }));
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

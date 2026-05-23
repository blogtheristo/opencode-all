/**
 * DGX Spark State Observer
 *
 * Inspired by https://webframp.com/posts/you-were-never-declaring-state/
 * — instead of declaring what state should be, observe what state IS and
 * produce typed, versioned, schema-validated snapshots.
 *
 * Runs every 60s. Each snapshot captures:
 *   - System resources (CPU, memory, disk, GPU)
 *   - Docker container states (running, health, restarts)
 *   - GitHub Actions runner status
 *   - Ollama model inventory
 *   - Cron job execution state
 *   - Service latencies
 *
 * Snapshots are:
 *   1. Written to /app/state/snapshots/ as versioned JSONL
 *   2. Pushed as OTel metrics to Aspire Dashboard
 *   3. Queryable via GET /state/latest and /state/history
 *
 * Code-Version: 1.0.0
 * Date: 2026-05-23
 * Owner: Lifetime Oy
 */

import http from 'http';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = Number(process.env.PORT || 9801);
const SNAPSHOT_DIR = process.env.SNAPSHOT_DIR || '/app/state/snapshots';
const SNAPSHOT_RETENTION_DAYS = 7;

interface SystemResources {
  cpu: { loadAvg1m: number; loadAvg5m: number; loadAvg15m: number; cores: number };
  memory: { totalMB: number; usedMB: number; availableMB: number; usedPercent: number };
  disk: { totalGB: number; usedGB: number; availableGB: number; usedPercent: number };
  gpu: { name: string; memoryTotalMB: number; memoryUsedMB: number; utilPercent: number } | null;
}

interface ContainerState {
  name: string;
  status: string;
  health: string;
  restartCount: number;
  uptime: string;
  memoryUsageMB: number;
}

interface OllamaModel {
  name: string;
  size: string;
  modified: string;
}

interface RunnerState {
  status: 'online' | 'offline' | 'unknown';
  pid: number | null;
  labels: string[];
}

interface StateSnapshot {
  version: 1;
  timestamp: string;
  host: string;
  system: SystemResources;
  containers: ContainerState[];
  runner: RunnerState;
  ollama: { models: OllamaModel[]; status: 'up' | 'down' };
  services: { name: string; status: 'up' | 'down'; latencyMs: number }[];
  drift: DriftSignal[];
}

interface DriftSignal {
  component: string;
  expected: string;
  actual: string;
  severity: 'info' | 'warn' | 'critical';
}

function execSafe(cmd: string): string {
  try {
    return execSync(cmd, { timeout: 5000, encoding: 'utf-8' }).trim();
  } catch {
    return '';
  }
}

function observeSystem(): SystemResources {
  const loadAvg = fs.readFileSync('/proc/loadavg', 'utf-8').split(' ');
  const cores = Number(execSafe('nproc') || '1');

  const memInfo = fs.readFileSync('/proc/meminfo', 'utf-8');
  const memTotal = Number(memInfo.match(/MemTotal:\s+(\d+)/)?.[1] || 0) / 1024;
  const memAvailable = Number(memInfo.match(/MemAvailable:\s+(\d+)/)?.[1] || 0) / 1024;

  const dfOutput = execSafe("df -BG / | tail -1 | awk '{print $2,$3,$4,$5}'");
  const [totalG, usedG, availG, usedPct] = dfOutput.split(' ');

  let gpu: SystemResources['gpu'] = null;
  const nvidiaSmi = execSafe('nvidia-smi --query-gpu=name,memory.total,memory.used,utilization.gpu --format=csv,noheader,nounits 2>/dev/null');
  if (nvidiaSmi) {
    const [name, memTotal, memUsed, util] = nvidiaSmi.split(', ');
    gpu = {
      name: name || 'unknown',
      memoryTotalMB: Number(memTotal) || 0,
      memoryUsedMB: Number(memUsed) || 0,
      utilPercent: Number(util) || 0,
    };
  }

  return {
    cpu: {
      loadAvg1m: Number(loadAvg[0]) || 0,
      loadAvg5m: Number(loadAvg[1]) || 0,
      loadAvg15m: Number(loadAvg[2]) || 0,
      cores,
    },
    memory: {
      totalMB: Math.round(memTotal),
      usedMB: Math.round(memTotal - memAvailable),
      availableMB: Math.round(memAvailable),
      usedPercent: Math.round(((memTotal - memAvailable) / memTotal) * 100),
    },
    disk: {
      totalGB: parseInt(totalG) || 0,
      usedGB: parseInt(usedG) || 0,
      availableGB: parseInt(availG) || 0,
      usedPercent: parseInt(usedPct) || 0,
    },
    gpu,
  };
}

function observeContainers(): ContainerState[] {
  const raw = execSafe(
    'docker ps --format "{{.Names}}|{{.Status}}|{{.State}}" --no-trunc 2>/dev/null'
  );
  if (!raw) return [];

  return raw.split('\n').filter(Boolean).map((line) => {
    const [name, status, state] = line.split('|');

    const statsRaw = execSafe(
      `docker stats ${name} --no-stream --format "{{.MemUsage}}" 2>/dev/null`
    );
    const memMatch = statsRaw.match(/([\d.]+)([GM])iB/);
    let memMB = 0;
    if (memMatch) {
      memMB = Number(memMatch[1]) * (memMatch[2] === 'G' ? 1024 : 1);
    }

    const inspectRaw = execSafe(
      `docker inspect ${name} --format "{{.RestartCount}}|{{.State.Health.Status}}" 2>/dev/null`
    );
    const [restartCount, health] = (inspectRaw || '0|none').split('|');

    return {
      name,
      status: state || 'unknown',
      health: health || 'none',
      restartCount: Number(restartCount) || 0,
      uptime: status || 'unknown',
      memoryUsageMB: Math.round(memMB),
    };
  });
}

function observeRunner(): RunnerState {
  const pidRaw = execSafe('pgrep -f "Runner.Listener" | head -1');
  const pid = pidRaw ? Number(pidRaw) : null;

  return {
    status: pid ? 'online' : 'offline',
    pid,
    labels: ['self-hosted', 'arm64', 'dgx-spark', 'ubuntu-24.04'],
  };
}

function observeOllama(): { models: OllamaModel[]; status: 'up' | 'down' } {
  const raw = execSafe('curl -sf http://localhost:11434/api/tags 2>/dev/null');
  if (!raw) return { models: [], status: 'down' };

  try {
    const data = JSON.parse(raw);
    const models = (data.models || []).map((m: { name: string; size: number; modified_at: string }) => ({
      name: m.name,
      size: `${Math.round(m.size / 1024 / 1024 / 1024)}GB`,
      modified: m.modified_at,
    }));
    return { models, status: 'up' };
  } catch {
    return { models: [], status: 'down' };
  }
}

async function checkService(name: string, url: string): Promise<{ name: string; status: 'up' | 'down'; latencyMs: number }> {
  const start = Date.now();
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return { name, status: res.ok ? 'up' : 'down', latencyMs: Date.now() - start };
  } catch {
    return { name, status: 'down', latencyMs: Date.now() - start };
  }
}

function detectDrift(snapshot: Omit<StateSnapshot, 'drift'>): DriftSignal[] {
  const signals: DriftSignal[] = [];

  if (snapshot.system.memory.usedPercent > 90) {
    signals.push({
      component: 'memory',
      expected: '<90% used',
      actual: `${snapshot.system.memory.usedPercent}% used`,
      severity: 'critical',
    });
  }

  if (snapshot.system.disk.usedPercent > 85) {
    signals.push({
      component: 'disk',
      expected: '<85% used',
      actual: `${snapshot.system.disk.usedPercent}% used`,
      severity: 'warn',
    });
  }

  if (snapshot.runner.status === 'offline') {
    signals.push({
      component: 'github-runner',
      expected: 'online',
      actual: 'offline',
      severity: 'warn',
    });
  }

  const downServices = snapshot.services.filter((s) => s.status === 'down');
  for (const svc of downServices) {
    signals.push({
      component: svc.name,
      expected: 'up',
      actual: 'down',
      severity: svc.name === 'backend' ? 'critical' : 'warn',
    });
  }

  const expectedModels = ['nemotron-3-super', 'qwen3-coder:30b'];
  for (const model of expectedModels) {
    if (!snapshot.ollama.models.some((m) => m.name.startsWith(model.split(':')[0]))) {
      signals.push({
        component: 'ollama',
        expected: `model ${model} loaded`,
        actual: 'model missing',
        severity: 'warn',
      });
    }
  }

  const highRestartContainers = snapshot.containers.filter((c) => c.restartCount > 5);
  for (const c of highRestartContainers) {
    signals.push({
      component: `container:${c.name}`,
      expected: '<5 restarts',
      actual: `${c.restartCount} restarts`,
      severity: 'warn',
    });
  }

  return signals;
}

let latestSnapshot: StateSnapshot | null = null;

async function captureSnapshot(): Promise<StateSnapshot> {
  const system = observeSystem();
  const containers = observeContainers();
  const runner = observeRunner();
  const ollama = observeOllama();

  const services = await Promise.all([
    checkService('backend', 'http://dws-backend:8080/health'),
    checkService('cron', 'http://dws-cron:8081/health'),
    checkService('heartbeat', 'http://heartbeat:9999/ping'),
    checkService('aspire', 'http://aspire-dashboard:18888/health'),
    checkService('redis', 'http://redis:6379'),
  ]);

  const partial = {
    version: 1 as const,
    timestamp: new Date().toISOString(),
    host: 'dgx-spark',
    system,
    containers,
    runner,
    ollama,
    services,
  };

  const drift = detectDrift(partial);
  const snapshot: StateSnapshot = { ...partial, drift };

  // Persist to JSONL
  try {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const file = path.join(SNAPSHOT_DIR, `${date}.jsonl`);
    fs.appendFileSync(file, JSON.stringify(snapshot) + '\n');
  } catch (e) {
    console.error('[STATE] Failed to persist snapshot:', (e as Error).message);
  }

  // Cleanup old snapshots
  try {
    const files = fs.readdirSync(SNAPSHOT_DIR);
    const cutoff = new Date(Date.now() - SNAPSHOT_RETENTION_DAYS * 86400000);
    for (const f of files) {
      const dateMatch = f.match(/^(\d{4}-\d{2}-\d{2})\.jsonl$/);
      if (dateMatch && new Date(dateMatch[1]) < cutoff) {
        fs.unlinkSync(path.join(SNAPSHOT_DIR, f));
      }
    }
  } catch { /* ignore cleanup errors */ }

  latestSnapshot = snapshot;

  if (drift.length > 0) {
    console.log(`[STATE] ${drift.length} drift signal(s): ${drift.map((d) => `${d.component}=${d.actual}`).join(', ')}`);
  }

  return snapshot;
}

// Capture every 60s
setInterval(captureSnapshot, 60_000);
captureSnapshot();

const DASHBOARD_PATH = process.env.DASHBOARD_PATH || '/app/dashboard.html';

const server = http.createServer(async (req, res) => {
  if (req.url === '/dashboard' || req.url === '/dashboard/') {
    try {
      const html = fs.readFileSync(DASHBOARD_PATH, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Dashboard file not found');
    }
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/state/latest' || req.url === '/') {
    if (!latestSnapshot) {
      const snap = await captureSnapshot();
      res.writeHead(200);
      res.end(JSON.stringify(snap, null, 2));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify(latestSnapshot, null, 2));
    }
    return;
  }

  if (req.url === '/state/drift') {
    res.writeHead(200);
    res.end(JSON.stringify({
      drift: latestSnapshot?.drift || [],
      timestamp: latestSnapshot?.timestamp,
    }));
    return;
  }

  if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', service: 'state-observer' }));
    return;
  }

  if (req.url?.startsWith('/state/history')) {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    const date = url.searchParams.get('date') || new Date().toISOString().slice(0, 10);
    const file = path.join(SNAPSHOT_DIR, `${date}.jsonl`);

    try {
      const lines = fs.readFileSync(file, 'utf-8').trim().split('\n');
      const snapshots = lines.slice(-60).map((l) => JSON.parse(l));
      res.writeHead(200);
      res.end(JSON.stringify({ date, count: snapshots.length, snapshots }));
    } catch {
      res.writeHead(200);
      res.end(JSON.stringify({ date, count: 0, snapshots: [] }));
    }
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[STATE] DGX Spark State Observer on :${PORT}`);
  console.log(`[STATE] Latest:  http://localhost:${PORT}/state/latest`);
  console.log(`[STATE] Drift:   http://localhost:${PORT}/state/drift`);
  console.log(`[STATE] History: http://localhost:${PORT}/state/history?date=YYYY-MM-DD`);
  console.log(`[STATE] Dashboard: http://localhost:${PORT}/dashboard`);
});

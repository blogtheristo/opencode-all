#!/usr/bin/env node
// Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- scripts/opencode-batch-worker.mjs + .workflows/opencode-all/queue.jsonl
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const REPO = process.cwd();
const QUEUE_DIR = join(REPO, '.workflows', 'opencode-all');
const QUEUE_FILE = join(QUEUE_DIR, 'queue.jsonl');
const HANDOFF_DIR = join(REPO, '.claude', 'handoffs', 'opencode-batch');

const args = process.argv.slice(2);
const opt = {
  batch: 3,
  once: false,
  loop: false,
  dryRun: false,
  intervalMin: 15,
  timeoutMin: 20,
  lifetimeDays: Number(process.env.OPENCODE_ALL_LIFETIME_DAYS ?? 30),
};
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--batch') opt.batch = Number(args[++i]);
  else if (args[i] === '--loop') opt.loop = true;
  else if (args[i] === '--dry-run') opt.dryRun = true;
  else if (args[i] === '--interval') opt.intervalMin = Number(args[++i]);
  else if (args[i] === '--timeout') opt.timeoutMin = Number(args[++i]);
  else if (args[i] === '--lifetime-days') opt.lifetimeDays = Number(args[++i]);
}

const CLEANUP_PROMPT = `You are resuming a HALTED session as part of an automated batch cleanup (opencode-all).

Steps:
1. Review this session's transcript above. Identify unfinished work.
2. If remaining work is GREEN-zone safe (read/edit/lint/test/build/git on a feature branch), finish it minimally. Do NOT start new scope. Do NOT commit to main. Do NOT publish or send anything.
3. Write a handoff file at .claude/handoffs/opencode-batch/<this-session-id>.md with exactly these sections:

# Batch Cleanup Handoff — <original title>
- Session: <session id>
- Status: COMPLETED | NEEDS-HUMAN | BLOCKED
- Work finished this run: <one line>
- Next-session prompt:
\`\`\`
<copy-paste prompt for a fresh session if anything remains, otherwise "nothing remains">
\`\`\`

4. End your turn with one line stating which Status you wrote.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class AcpClient {
  constructor() {
    this.proc = spawn('opencode', ['acp'], { cwd: REPO, stdio: ['pipe', 'pipe', 'pipe'] });
    this.nextId = 1;
    this.pending = new Map();
    this.buf = '';
    this.proc.stdout.on('data', (d) => this.#onData(d));
    this.proc.stderr.on('data', () => {});
  }

  #onData(d) {
    this.buf += d.toString();
    let idx;
    while ((idx = this.buf.indexOf('\n')) >= 0) {
      const line = this.buf.slice(0, idx).trim();
      this.buf = this.buf.slice(idx + 1);
      if (!line) continue;
      let msg;
      try {
        msg = JSON.parse(line);
      } catch {
        continue;
      }
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    }
  }

  request(method, params) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
    }).catch((e) => {
      this.pending.delete(id);
      throw e;
    });
  }

  async close() {
    this.proc.kill();
    await sleep(200);
  }
}

const readQueue = () =>
  existsSync(QUEUE_FILE)
    ? readFileSync(QUEUE_FILE, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
    : [];

const writeQueue = (entries) => {
  mkdirSync(QUEUE_DIR, { recursive: true });
  writeFileSync(QUEUE_FILE, entries.map((e) => JSON.stringify(e)).join('\n') + '\n');
};

function detectNeedsContinue() {
  const out = execFileSync('opencode', ['session', 'list', '--format', 'json'], { maxBuffer: 64 * 1024 * 1024 });
  const sessions = JSON.parse(out);
  const found = [];
  for (const s of sessions) {
    try {
      const exp = execFileSync('opencode', ['export', s.id], { maxBuffer: 256 * 1024 * 1024 });
      const data = JSON.parse(exp);
      const msgs = data.messages ?? [];
      if (msgs.length < 2) continue;
      const lastRole = msgs[msgs.length - 1]?.info?.role;
      if (lastRole !== 'assistant') continue;
      found.push({ id: s.id, title: s.title, source: 'detect' });
    } catch {}
  }
  return found;
}

function cmdEnqueue() {
  const existing = new Map(readQueue().map((e) => [e.id, e]));
  const detected = detectNeedsContinueSync();
  let added = 0;
  for (const d of detected) {
    const prev = existing.get(d.id);
    if (prev && ['done', 'skipped'].includes(prev.status)) continue;
    if (!prev) {
      existing.set(d.id, { ...d, status: 'pending', attempts: 0, lastRun: null, stopReason: null });
      added++;
    }
  }
  writeQueue([...existing.values()]);
  console.log(`queue: ${added} added, ${[...existing.values()].filter((e) => e.status === 'pending').length} pending total`);
}

const detectNeedsContinueSync = detectNeedsContinue;
async function processOne(client, entry) {
  const loaded = await client.request('session/load', {
    cwd: REPO,
    mcpServers: [],
    sessionId: entry.id,
  });
  const sid = loaded?.sessionId ?? entry.id;
  const result = await client.request('session/prompt', {
    sessionId: sid,
    prompt: [{ type: 'text', text: CLEANUP_PROMPT }],
  });
  return result?.stopReason ?? 'unknown';
}

function cmdStatus() {
  const q = readQueue();
  const by = {};
  for (const e of q) by[e.status] = (by[e.status] ?? 0) + 1;
  console.log(`queue total: ${q.length}`);
  for (const [k, v] of Object.entries(by)) console.log(`  ${k}: ${v}`);
  for (const e of q.filter((x) => x.status !== 'done').slice(0, 10))
    console.log(`  [${e.status}] ${e.id} ${e.title?.slice(0, 50) ?? ''} attempts=${e.attempts}`);
}

const LIFECYCLE_LOG = join(QUEUE_DIR, 'lifecycle.jsonl');

// Living-engine states: rest | in-use | updating | fixing
// rest     -> session complete or handoff COMPLETED; no work pending
// in-use   -> activity within the last ACTIVE_HOURS
// updating -> queued for batch cleanup / currently processed
// fixing   -> errored run, awaiting repair attempt
function lifecycleState(entry) {
  if (entry.status === 'error' && entry.attempts > 0) return 'fixing';
  if (entry.status === 'pending') return 'updating';
  if (entry.status === 'done') {
    const hf = join(HANDOFF_DIR, `${entry.id}.md`);
    if (existsSync(hf) && /Status:\s*COMPLETED/.test(readFileSync(hf, 'utf8'))) return 'rest';
    return entry.state ?? 'rest';
  }
  const ageH = (Date.now() - Number(entry.updated ?? 0)) / 3_600_000;
  return ageH < 24 ? 'in-use' : 'rest';
}

function cmdLifecycle() {
  const q = readQueue();
  const transitions = [];
  const out = q.map((e) => {
    const next = lifecycleState(e);
    if (e.state !== next) {
      transitions.push(`[OPENCODE-ALL]:${next.toUpperCase()}:${e.id}:${new Date().toISOString()}`);
      return { ...e, state: next };
    }
    return e;
  });
  writeQueue(out);
  if (transitions.length) {
    appendFileSync(LIFECYCLE_LOG, transitions.join('\n') + '\n');
  }
  const counts = {};
  for (const e of out) counts[e.state] = (counts[e.state] ?? 0) + 1;
  console.log('living-engine lifecycle:');
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: ${v}`);
  if (transitions.length) console.log(`${transitions.length} transition(s) logged -> .workflows/opencode-all/lifecycle.jsonl`);
}

async function ensureHandoff(entry) {
  const hf = join(HANDOFF_DIR, `${entry.id}.md`);
  if (existsSync(hf)) return 'agent-written';
  let lastText = '';
  try {
    const { execFileSync } = await import('node:child_process');
    const data = JSON.parse(execFileSync('opencode', ['export', entry.id], { maxBuffer: 256 * 1024 * 1024 }));
    const msgs = data.messages ?? [];
    for (let i = msgs.length - 1; i >= 0; i--) {
      const t = (msgs[i].parts ?? [])
        .filter((p) => p.type === 'text')
        .map((p) => p.text)
        .join('\n')
        .trim();
      if (t && msgs[i].info?.role === 'assistant') {
        lastText = t;
        break;
      }
    }
  } catch {}
  const status = /Status:\s*(COMPLETED|NEEDS-HUMAN|BLOCKED)/m.exec(lastText)?.[1] ?? 'NEEDS-HUMAN';
  writeFileSync(
    hf,
    `# Batch Cleanup Handoff — ${entry.title ?? entry.id}\n- Session: ${entry.id}\n- Status: ${status}\n- Work finished this run: batch worker closed out this halted session; see last assistant message below.\n\n## Last assistant message\n\n${lastText || '(none captured)'}\n`
  );
  return `worker-fallback (${status})`;
}

async function runBatches() {
  mkdirSync(HANDOFF_DIR, { recursive: true });
  const ENGINE_FILE = join(QUEUE_DIR, 'engine.json');
  let started;
  if (existsSync(ENGINE_FILE)) {
    started = JSON.parse(readFileSync(ENGINE_FILE, 'utf8')).started;
  } else {
    mkdirSync(QUEUE_DIR, { recursive: true });
    started = new Date().toISOString();
    writeFileSync(ENGINE_FILE, JSON.stringify({ started, lifetimeDays: opt.lifetimeDays }));
  }
  const deadline = Date.parse(started) + opt.lifetimeDays * 86_400_000;
  do {
    if (Date.now() >= deadline) {
      console.log(new Date().toISOString(), `engine lifetime (${opt.lifetimeDays}d from ${started}) reached — stopping`);
      break;
    }
    const q = readQueue();
    const pending = q.filter((e) => e.status === 'pending' || (e.status === 'error' && e.attempts < 3));
    if (pending.length === 0) {
      console.log(new Date().toISOString(), 'no pending work');
    } else {
      const batch = pending.slice(0, opt.batch);
      if (opt.dryRun) {
        console.log(`dry-run would process ${batch.length}:`);
        for (const e of batch) console.log(`  ${e.id} ${e.title?.slice(0, 60)}`);
        return;
      }
      const client = new AcpClient();
      await client.request('initialize', {
        protocolVersion: 1,
        clientCapabilities: { fs: { readTextFile: false, writeTextFile: false }, terminal: false },
      });
      for (const entry of batch) {
        const all = readQueue();
        const cur = all.find((e) => e.id === entry.id);
        console.log(new Date().toISOString(), `processing ${entry.id} (${entry.title?.slice(0, 50)})`);
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), opt.timeoutMin * 60_000);
          const stopReason = await Promise.race([
            processOne(client, entry),
            controller.signal.addEventListener('abort', () => {
              throw new Error(`timeout after ${opt.timeoutMin}min`);
            }),
          ]);
          clearTimeout(timer);
          const how = await ensureHandoff(entry);
          cur.status = 'done';
          cur.stopReason = String(stopReason);
          console.log(`  done, stopReason=${stopReason}, handoff=${how} -> ${HANDOFF_DIR}/${entry.id}.md`);
        } catch (err) {
          cur.status = 'error';
          cur.attempts += 1;
          cur.stopReason = String(err.message).slice(0, 200);
          console.error(`  ERROR: ${cur.stopReason}`);
        }
        cur.lastRun = new Date().toISOString();
        writeQueue(all);
      }
      await client.close();
    }
    if (!opt.loop) break;
    console.log(`sleeping ${opt.intervalMin}min`);
    await sleep(opt.intervalMin * 60_000);
  } while (opt.loop);
}

(async () => {
  const cmd = args.find((a) => !a.startsWith('--')) ?? 'run';
  if (cmd === 'enqueue') cmdEnqueue();
  else if (cmd === 'status') cmdStatus();
  else if (cmd === 'lifecycle') cmdLifecycle();
  else if (cmd === 'run') await runBatches();
  else {
    console.log('usage: opencode-batch-worker.mjs <enqueue|run|status> [--batch N] [--loop] [--dry-run] [--timeout MIN] [--interval MIN]');
    process.exit(1);
  }
})();

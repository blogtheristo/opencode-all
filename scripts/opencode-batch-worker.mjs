#!/usr/bin/env node
// Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- scripts/opencode-batch-worker.mjs + .workflows/opencode-all/queue.jsonl
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

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

// State machine: QUEUED -> RUNNING -> HANDOFF_READY -> VALIDATION -> MERGE_READY -> DONE / FAILED / GONE
const STATES = ['QUEUED', 'RUNNING', 'HANDOFF_READY', 'VALIDATION', 'MERGE_READY', 'DONE', 'FAILED', 'GONE'];
const STOP_REASONS = ['completed', 'gone', 'failed', 'blocked', 'needs-human'];
const TERMINAL_STATES = ['DONE', 'FAILED', 'GONE'];

// status is DERIVED from state — never stored as a second source of truth.
function derivedStatus(state) {
  if (state === 'DONE') return 'done';
  if (state === 'FAILED') return 'error';
  if (state === 'GONE') return 'skipped';
  return 'pending';
}

// Reject any terminal write whose stopReason is not an allowed value (Rule 12: fail loud).
function assertTerminalMetadata(entry) {
  if (TERMINAL_STATES.includes(entry.state) && !STOP_REASONS.includes(entry.stopReason)) {
    return `terminal write rejected for ${entry.id}: state=${entry.state} stopReason=${JSON.stringify(entry.stopReason)}`;
  }
  return null;
}

async function makeIdempotencyKey(sessionId, taskDescription = '') {
  const { createHash } = await import('node:crypto');
  return createHash('sha256').update(`${sessionId}|${taskDescription}`).digest('hex').slice(0, 16);
}

const CLEANUP_PROMPT = `You are resuming a HALTED session as part of an automated batch cleanup (opencode-all).

Steps:
1. Review this session's transcript above. Identify unfinished work.
2. If remaining work is GREEN-zone safe (read/edit/lint/test/build/git on a feature branch), finish it minimally. Do NOT start new scope. Do NOT commit to main. Do NOT publish or send anything.
3. Write a handoff file at .claude/handoffs/opencode-batch/<this-session-id>.md with exactly these sections:

# Batch Cleanup Handoff — <original title>
- Session: <session id>
- Changed files: <explicit list, or "none">
- Tests run: <named commands executed> -> <pass/fail result>
- Unresolved risks: <list, or "none">
- Next-session prompt:
\`\`\`
<copy-paste prompt for a fresh session if anything remains, otherwise "nothing remains">
\`\`\`
- Status: GREEN | NEEDS-HUMAN | FAILED

A handoff file proves existence only — it is not proof of correct completion.
4. End your turn with one line stating which Status you wrote.`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// OTLP/HTTP log emitter (no SDK deps) -> Aspire dashboard, API-key gated.
const varint = (v) => { const o = []; do { let b = v & 127; v >>>= 7; if (v) b |= 128; o.push(b); } while (v); return Buffer.from(o); };
const tag = (f, w) => Buffer.from([(f << 3) | w]);
const strB = (v) => { const b = Buffer.from(v); return Buffer.concat([varint(b.length), b]); };
const lenD = (f, p) => Buffer.concat([tag(f, 2), varint(p.length), p]);
const i32 = (f, v) => Buffer.concat([tag(f, 0), varint(v)]);
const otlpKey = () => {
  const h = process.env.OTEL_EXPORTER_OTLP_HEADERS ?? '';
  const m = /x-otlp-api-key=([^\s;]+)/.exec(h);
  return m?.[1];
};

async function emitOtlpLog(message, severity = 9) {
  const endpoint = process.env.OTEL_LOG_ENDPOINT;
  const key = otlpKey();
  if (!endpoint || !key) return;
  try {
    const t = Buffer.alloc(8); t.writeBigUInt64LE(BigInt(Date.now()) * 1_000_000n);
    const anyValue = lenD(1, strB(message));
    const lr = Buffer.concat([tag(1, 1), t, i32(2, severity), lenD(3, strB('INFO')), lenD(5, anyValue)]);
    const scope = Buffer.concat([lenD(1, strB('opencode-all-worker')), lenD(2, strB('1.0.0'))]);
    const scopeLogs = Buffer.concat([lenD(1, scope), lenD(2, lr)]);
    const serviceAttr = Buffer.concat([lenD(1, strB('service.name')), lenD(2, lenD(1, strB('opencode-all')))]);
    const request = lenD(1, Buffer.concat([lenD(1, lenD(1, serviceAttr)), lenD(2, scopeLogs)]));
    await fetch(`${endpoint}/v1/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-protobuf', 'x-otlp-api-key': key },
      body: request,
    });
  } catch {}
}

class AcpClient {
  // Optional AbortSignal: on abort, SIGKILL the subprocess immediately and
  // reject all in-flight requests. Normal close() uses SIGTERM and is idempotent.
  constructor(cwd = REPO, signal = null) {
    this.proc = spawn('opencode', ['acp'], { cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    this.nextId = 1;
    this.pending = new Map();
    this.buf = '';
    this.closed = false;
    this.cancelled = false;
    this.exited = false;
    this.signal = signal;
    this.exitDone = new Promise((resolve) => this.proc.once('exit', () => { this.exited = true; resolve(); }));
    this.proc.stdout.on('data', (d) => this.#onData(d));
    this.proc.stderr.on('data', () => {});
    // If the subprocess dies on its own, nothing pending may hang on a reply.
    this.proc.once('exit', () => this.#rejectAll(new Error('ACP subprocess exited')));
    if (signal) {
      this.#onAbort = () => {
        if (this.closed || this.cancelled) return;
        this.cancelled = true;
        this.#rejectAll(new Error('ACP client cancelled (abort signal)'));
        this.proc.kill('SIGKILL'); // hard kill reserved for abort
      };
      if (signal.aborted) queueMicrotask(() => this.#onAbort());
      else signal.addEventListener('abort', this.#onAbort, { once: true });
    }
  }

  #onAbort = null;

  #rejectAll(err) {
    for (const { reject } of this.pending.values()) reject(err);
    this.pending.clear();
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
      try {
        this.proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
      } catch (e) {
        this.pending.delete(id);
        return reject(e);
      }
    }).catch((e) => {
      this.pending.delete(id);
      throw e;
    });
  }

  async close() {
    if (this.closed) return; // idempotent
    this.closed = true;
    if (this.signal && this.#onAbort) {
      this.signal.removeEventListener('abort', this.#onAbort);
      this.#onAbort = null;
    }
    // Reject pending BEFORE waiting so no caller can hang on a dead pipe.
    this.#rejectAll(new Error('ACP client closed'));
    if (!this.cancelled && !this.exited) {
      this.proc.kill(); // one graceful SIGTERM for normal shutdown
    }
    await Promise.race([this.exitDone, sleep(1000)]);
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

async function cmdEnqueue() {
  const existing = new Map(readQueue().map((e) => [e.id, e]));
  const detected = detectNeedsContinueSync();
  let added = 0;
  for (const d of detected) {
    const prev = existing.get(d.id);
    if (prev && ['DONE', 'GONE', 'FAILED'].includes(prev.state)) continue;
    if (!prev) {
      const idempotencyKey = await makeIdempotencyKey(d.id, d.title);
      existing.set(d.id, {
        ...d,
        idempotencyKey,
        state: 'QUEUED',
        status: 'pending',
        attempts: 0,
        lastRun: null,
        stopReason: null,
        handoffPath: null,
        validation: null,
        createdAt: new Date().toISOString()
      });
      added++;
    }
  }
  writeQueue([...existing.values()]);
  console.log(`queue: ${added} added, ${[...existing.values()].filter((e) => e.state === 'QUEUED').length} queued total`);
}

const detectNeedsContinueSync = detectNeedsContinue;
async function runValidationGate(entry, worktreePath = REPO) {
  const results = {
    build: false,
    lint: false,
    test: false,
    typecheck: false,
    cleanTree: false,
    unexpectedChanges: [],
    errors: []
  };
  const wt = { cwd: worktreePath };

  // Baseline is pinned on the queue entry (stable across retries).
  let baseline = entry.baselineCommit;

  console.log(`  [validation] running build (${worktreePath === REPO ? 'REPO' : 'worktree'})...`);
  try {
    execFileSync('npm', ['run', 'build'], { ...wt, maxBuffer: 64 * 1024 * 1024, timeout: 120_000 });
    results.build = true;
  } catch (e) {
    results.errors.push(`build: ${e.message}`);
  }

  console.log(`  [validation] running lint...`);
  try {
    execFileSync('npm', ['run', 'lint'], { ...wt, maxBuffer: 64 * 1024 * 1024, timeout: 60_000 });
    results.lint = true;
  } catch (e) {
    results.errors.push(`lint: ${e.message}`);
  }

  console.log(`  [validation] running typecheck...`);
  try {
    execFileSync('npm', ['run', 'typecheck'], { ...wt, maxBuffer: 64 * 1024 * 1024, timeout: 60_000 });
    results.typecheck = true;
  } catch (e) {
    results.errors.push(`typecheck: ${e.message}`);
  }

  console.log(`  [validation] running tests...`);
  try {
    // Serialized (2026-08-25 incident control): never run two validation
    // suites against the shared object database at the same time.
    execFileSync('flock', ['-w', '900', '/tmp/opencode/dws6-validation.lock', 'npm', 'test'], { ...wt, maxBuffer: 64 * 1024 * 1024, timeout: 180_000 });
    results.test = true;
  } catch (e) {
    results.errors.push(`test: ${e.message}`);
  }

  console.log(`  [validation] checking git changes vs baseline (${baseline?.slice(0,8) ?? 'unknown'})...`);
  try {
    let changed = [];
    if (baseline) {
      // Tracked changes (worktree-relative)
      const diff = execFileSync('git', ['diff', '--name-only', baseline], { ...wt, encoding: 'utf8' }).trim();
      if (diff) changed.push(...diff.split('\n').filter(Boolean));
      // Untracked files (new files)
      const status = execFileSync('git', ['status', '--porcelain'], { ...wt, encoding: 'utf8' }).trim();
      if (status) {
        for (const line of status.split('\n')) {
          const file = line.slice(3).trim(); // Remove "?? " or " M " prefix
          if (line.startsWith('??') && !changed.includes(file)) {
            changed.push(file);
          }
        }
      }
    } else {
      const status = execFileSync('git', ['status', '--porcelain'], { cwd: REPO, encoding: 'utf8' }).trim();
      if (status) {
        for (const line of status.split('\n')) {
          const file = line.slice(3).trim();
          changed.push(file);
        }
      }
    }
    // Expected changes from handoff
    const expected = Array.isArray(entry.expectedChanges) ? entry.expectedChanges : [];
    const unexpected = changed.filter(f => !expected.includes(f) && !f.startsWith('.claude/handoffs/'));
    results.unexpectedChanges = unexpected;
    results.cleanTree = unexpected.length === 0;
    if (unexpected.length) results.errors.push(`unexpected changes: ${unexpected.slice(0, 5).join('; ')}`);
    results.changedFiles = changed;
  } catch (e) {
    results.errors.push(`git diff: ${e.message}`);
  }

  const passed = results.build && results.lint && results.typecheck && results.test && results.cleanTree;
  console.log(`  [validation] ${passed ? 'PASSED' : 'FAILED'} — build:${results.build} lint:${results.lint} typecheck:${results.typecheck} test:${results.test} clean:${results.cleanTree}`);
  return { passed, results };
}

async function processOne(client, entry, worktreePath = REPO) {
  const all = readQueue();
  const cur = all.find((e) => e.id === entry.id);
  if (!cur) return 'not-found';

  // Transition: QUEUED -> RUNNING. Clear any placeholder metadata.
  cur.state = 'RUNNING';
  cur.stopReason = null;
  cur.baselineCommit = cur.baselineCommit ?? null;
  writeQueue(all);

  // Pin baseline once so change comparison is stable across retries.
  if (!cur.baselineCommit) {
    try {
      cur.baselineCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: worktreePath, encoding: 'utf8' }).trim();
    } catch {}
  }

  const loaded = await client.request('session/load', {
    cwd: worktreePath,
    mcpServers: [],
    sessionId: entry.id,
  });
  const sid = loaded?.sessionId ?? entry.id;
  const result = await client.request('session/prompt', {
    sessionId: sid,
    prompt: [{ type: 'text', text: CLEANUP_PROMPT }],
  });
  const stopReason = result?.stopReason ?? 'unknown';

  // Determine stopReason based on result and handoff
  let finalStopReason = 'unknown';
  if (stopReason && stopReason !== 'unknown') {
    finalStopReason = stopReason;
  } else {
    // Fallback: derive from handoff status
    const hf = join(HANDOFF_DIR, `${entry.id}.md`);
    if (existsSync(hf)) {
      const content = readFileSync(hf, 'utf8');
      if (/Status:\s*GREEN|Status:\s*COMPLETED/.test(content)) finalStopReason = 'completed';
      else if (/Status:\s*NEEDS-HUMAN|Status:\s*BLOCKED/.test(content)) finalStopReason = 'needs-human';
      else if (/Status:\s*FAILED/.test(content)) finalStopReason = 'failed';
      else finalStopReason = 'needs-human';
    } else {
      finalStopReason = 'blocked'; // No handoff written
    }
  }

  // Map to allowed stop reasons
  if (!STOP_REASONS.includes(finalStopReason)) {
    finalStopReason = 'needs-human';
  }

  // Transition: RUNNING -> HANDOFF_READY
  cur.state = 'HANDOFF_READY';
  cur.stopReason = finalStopReason;
  writeQueue(all);

  const how = await ensureHandoff(entry, finalStopReason, worktreePath);
  cur.handoffPath = `${HANDOFF_DIR}/${entry.id}.md`;

  // Transition: HANDOFF_READY -> VALIDATION
  cur.state = 'VALIDATION';
  writeQueue(all);

  const validation = await runValidationGate(entry, worktreePath);
  cur.validation = validation;

  if (validation.passed) {
    // MERGE_READY keeps stopReason as-is and KEEPS the worktree for HIC review.
    cur.state = 'MERGE_READY';
    cur.worktreeState = 'kept-for-review';
  } else {
    cur.state = 'FAILED';
    cur.attempts += 1;
    cur.stopReason = 'failed';
    cur.failureCode = 'validation-gate';
    cleanupWorktreeAfterFailure(cur);
  }

  // Guard every write: terminal states must carry an allowed stopReason.
  const violation = assertTerminalMetadata(cur) ?? (STOP_REASONS.includes(cur.stopReason) ? null : `non-terminal ${cur.id} carries invalid stopReason`);
  if (violation) {
    console.error(`  [invariant] ${violation} — coercing to needs-human/failed`);
    if (!TERMINAL_STATES.includes(cur.state)) cur.state = 'FAILED';
    if (!STOP_REASONS.includes(cur.stopReason)) cur.stopReason = cur.state === 'DONE' ? 'needs-human' : 'failed';
  }

  cur.lastRun = new Date().toISOString();
  writeQueue(all);

  console.log(`  ${cur.state}, stopReason=${cur.stopReason}, validation=${validation.passed ? 'PASS' : 'FAIL'}, handoff=${how}, worktree=${cur.worktreeState}`);
  return cur.stopReason;
}

function cmdStatus() {
  const q = readQueue();
  const byState = {};
  const byStatus = {};
  for (const e of q) {
    const st = e.state ?? 'unknown';
    byState[st] = (byState[st] ?? 0) + 1;
    const s = derivedStatus(st); // status derived from state — no second source of truth
    byStatus[s] = (byStatus[s] ?? 0) + 1;
  }
  console.log(`queue total: ${q.length}`);
  console.log('  by state:');
  for (const [k, v] of Object.entries(byState)) console.log(`    ${k}: ${v}`);
  console.log('  by status (derived):');
  for (const [k, v] of Object.entries(byStatus)) console.log(`    ${k}: ${v}`);
  for (const e of q.filter((x) => x.state !== 'DONE' && x.state !== 'GONE').slice(0, 15)) {
    let next = '—';
    if (e.state === 'QUEUED') next = 'awaiting worker';
    else if (e.state === 'MERGE_READY') next = 'human review → git merge';
    else if (e.state === 'FAILED') next = 'investigate handoff → retry or cleanup';
    else if (e.state === 'RUNNING') next = 'worker processing';
    else if (e.state === 'updating') next = 'legacy state → run reconcile';
    console.log(`  [${e.state}] ${e.id} ${e.title?.slice(0, 40) ?? ''} attempts=${e.attempts} next=${next}`);
  }
}

function cmdReconcile() {
  const q = readQueue();
  let migrated = 0;
  const violations = [];
  const out = q.map((e) => {
    // Migrate legacy entries (old lowercase state machine + done status)
    if (e.state === 'updating' && e.status === 'done') {
      const hf = join(HANDOFF_DIR, `${e.id}.md`);
      let stopReason = 'completed';
      let state = 'DONE';
      if (existsSync(hf)) {
        const content = readFileSync(hf, 'utf8');
        if (/Status:\s*NEEDS-HUMAN|Status:\s*BLOCKED/.test(content)) stopReason = 'needs-human';
        else if (/Status:\s*FAILED/.test(content)) { stopReason = 'failed'; state = 'FAILED'; }
        else if (/Status:\s*GREEN|Status:\s*COMPLETED/.test(content)) stopReason = 'completed';
        else { stopReason = 'needs-human'; }
      } else {
        stopReason = 'needs-human'; // no handoff = needs human
      }
      migrated++;
      return { ...e, state, stopReason, status: undefined, legacy: true, reconciledAt: new Date().toISOString() };
    }
    // Fail loudly on any non-terminal entry with missing/undefined metadata (Rule 12)
    if (!TERMINAL_STATES.includes(e.state)) {
      const problems = [];
      if (!STATES.includes(e.state)) problems.push(`unknown state=${JSON.stringify(e.state)}`);
      if (e.stopReason === undefined) problems.push('stopReason=undefined');
      else if (e.stopReason !== null && !STOP_REASONS.includes(e.stopReason)) problems.push(`stopReason=${JSON.stringify(e.stopReason)} not allowed pre-terminal`);
      if (problems.length) violations.push(`${e.id} [${e.title?.slice(0, 40) ?? ''}]: ${problems.join('; ')}`);
    } else {
      const v = assertTerminalMetadata(e);
      if (v) violations.push(v);
    }
    return e;
  });
  writeQueue(out);
  console.log(`reconcile: ${migrated} legacy entries migrated to explicit terminal states`);

  // Orphan-branch hygiene (DDM-v1 §10 self-healing retry): terminal FAILED
  // entries whose worktree is gone but whose generated branch lingers block
  // every retry ("branch already exists without worktree").
  //
  // HIC decision 2026-08-24: reconcile NEVER deletes by default. The approval
  // flag (--clean) flows from this call site INTO removeOrphanBranch —
  // deletion is impossible without it, even inside the helper. Default run
  // is a report-only dry pass with zero git mutation.
  const cleanupOrphans = args.includes('--clean');
  let orphansCleaned = 0;
  const orphanReported = [];
  const orphanKept = [];
  for (const e of out) {
    if (e.state !== 'FAILED' || !e.branch) continue;
    if (!e.baselineCommit) continue; // no baseline = cannot prove emptiness, skip
    const wtPath = join(REPO, '.worktrees', 'opencode-all', e.id);
    if (existsSync(wtPath)) continue; // worktree alive — not an orphan
    const outcome = removeOrphanBranch(REPO, e.branch, e.baselineCommit, cleanupOrphans);
    if (outcome === 'deleted') {
      orphansCleaned++;
      console.log(`reconcile: cleaned empty orphan branch ${e.branch} (${e.id})`);
    } else if (outcome === 'kept-has-commits') {
      orphanKept.push(`${e.branch} (${e.id}) has commits beyond baseline — NEEDS-HUMAN`);
    } else if (outcome === 'empty-reported') {
      orphanReported.push(`${e.branch} (${e.id}) is empty, cleanup not approved`);
    }
  }
  console.log(`reconcile: ${orphansCleaned} empty orphan branch(es) cleaned, ${orphanReported.length} reported, ${orphanKept.length} preserved with commits`);
  for (const r of orphanReported) console.log(`reconcile: REPORT ${r}`);
  for (const k of orphanKept) console.error(`reconcile: PRESERVED ${k}`);

  if (violations.length) {
    console.error(`reconcile: ${violations.length} QUEUE HYGIENE VIOLATION(S):`);
    for (const v of violations) console.error(`  - ${v}`);
    process.exitCode = 1;
  } else {
    console.log('reconcile: no metadata violations found');
  }
  cmdStatus();
}

const LIFECYCLE_LOG = join(QUEUE_DIR, 'lifecycle.jsonl');

// Living-engine states (extended): rest | in-use | updating | fixing | queued | running | handoff_ready | validation | merge_ready | done | failed | gone
function lifecycleState(entry) {
  const state = entry.state?.toLowerCase();
  if (state === 'failed' || (entry.status === 'error' && entry.attempts > 0)) return 'fixing';
  if (state === 'queued') return 'updating';
  if (state === 'running') return 'updating';
  if (state === 'handoff_ready') return 'updating';
  if (state === 'validation') return 'updating';
  if (state === 'merge_ready') return 'in-use';
  if (state === 'done') {
    const hf = join(HANDOFF_DIR, `${entry.id}.md`);
    if (existsSync(hf) && /Status:\s*COMPLETED/.test(readFileSync(hf, 'utf8'))) return 'rest';
    return 'rest';
  }
  if (state === 'gone') return 'gone';
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

async function ensureHandoff(entry, stopReason, worktreePath = REPO) {
  const hf = join(HANDOFF_DIR, `${entry.id}.md`);
  if (existsSync(hf)) return 'agent-written';

  let lastText = '';
  let changedFiles = [];
  let testsRun = '';
  let unresolvedRisks = '';
  let nextPrompt = 'nothing remains';

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

  // Extract structured fields from last message
  const statusMatch = /Status:\s*(GREEN|COMPLETED|NEEDS-HUMAN|FAILED|BLOCKED)/m.exec(lastText);
  const status = statusMatch?.[1];
  const normalized = status === 'COMPLETED' ? 'GREEN' : status === 'BLOCKED' ? 'NEEDS-HUMAN' : status ?? 'NEEDS-HUMAN';

  const filesMatch = /Changed files:\s*([^\n]+)/i.exec(lastText);
  if (filesMatch) changedFiles = filesMatch[1].split(',').map(f => f.trim()).filter(Boolean);

  const testsMatch = /Tests run:\s*([^\n]+)/i.exec(lastText);
  if (testsMatch) testsRun = testsMatch[1].trim();

  const risksMatch = /Unresolved risks:\s*([^\n]+)/i.exec(lastText);
  if (risksMatch) unresolvedRisks = risksMatch[1].trim();

  const nextMatch = /Next-session prompt:[\s\S]*?```([\s\S]*?)```/i.exec(lastText);
  if (nextMatch) nextPrompt = nextMatch[1].trim();

  // Get git diff for changed files if not in handoff
  if (changedFiles.length === 0) {
    try {
      const diff = execFileSync('git', ['diff', '--name-only'], { cwd: REPO, encoding: 'utf8' }).trim();
      if (diff) changedFiles = diff.split('\n');
    } catch {}
  }

  const confidence = normalized === 'GREEN' ? 0.9 : normalized === 'NEEDS-HUMAN' ? 0.5 : 0.2;
  const taskType = entry.title?.includes('session') ? 'continuation' : 'cleanup';

  const handoff = {
    session: entry.id,
    idempotencyKey: entry.idempotencyKey,
    title: entry.title ?? entry.id,
    taskType,
    state: normalized,
    stopReason,
    changedFiles: changedFiles.length ? changedFiles : ['none'],
    testsRun: testsRun || 'none captured',
    unresolvedRisks: unresolvedRisks || 'none',
    nextPrompt,
    confidence,
    createdAt: new Date().toISOString(),
    workerVersion: '1.0.0',
    validation: entry.validation ?? null
  };

  const yaml = [
    '---',
    ...Object.entries(handoff).map(([k, v]) => `${k}: ${JSON.stringify(v)}`),
    '---',
    '',
    '# Batch Cleanup Handoff — ' + (entry.title ?? entry.id),
    '',
    '## Summary',
    '',
    `- **Session**: ${entry.id}`,
    `- **Task**: ${taskType}`,
    `- **Status**: ${normalized}`,
    `- **Stop Reason**: ${stopReason}`,
    `- **Confidence**: ${(confidence * 100).toFixed(0)}%`,
    '',
    '## Changes',
    '',
    changedFiles.length ? changedFiles.map(f => `- ${f}`).join('\n') : 'No files changed',
    '',
    '## Tests',
    '',
    testsRun || 'No tests captured',
    '',
    '## Risks',
    '',
    unresolvedRisks || 'No unresolved risks',
    '',
    '## Next Session Prompt',
    '',
    '```',
    nextPrompt,
    '```',
    '',
    '## Validation',
    '',
    entry.validation ? (
      `- Build: ${entry.validation.results?.build ? '✓' : '✗'}` + '\n' +
      `- Lint: ${entry.validation.results?.lint ? '✓' : '✗'}` + '\n' +
      `- Typecheck: ${entry.validation.results?.typecheck ? '✓' : '✗'}` + '\n' +
      `- Test: ${entry.validation.results?.test ? '✓' : '✗'}` + '\n' +
      `- Clean Tree: ${entry.validation.results?.cleanTree ? '✓' : '✗'}`
    ) : 'Not yet validated',
    ''
  ].join('\n');

  writeFileSync(hf, yaml);
  return `worker-structured (${normalized})`;
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
    writeFileSync(
      ENGINE_FILE,
      JSON.stringify(
        {
          started,
          lifetimeDays: opt.lifetimeDays,
          owner: 'Risto Anton Päärni (HIC)',
          reason: 'Containment control: bounded autonomous cleanup window per HIC instruction 2026-08-24',
          renewalCriteria: 'HIC explicit approval + new LD entry before deadline',
          killCriteria: 'model auth failure unresolvable by fallback, queue empty for 7 consecutive days, or HIC kill command',
        },
        null,
        2
      )
    );
  }
  const deadline = Date.parse(started) + opt.lifetimeDays * 86_400_000;
  do {
    if (Date.now() >= deadline) {
      console.log(new Date().toISOString(), `engine lifetime (${opt.lifetimeDays}d from ${started}) reached — stopping`);
      break;
    }

    // Watchdog: check for stale RUNNING sessions
    const all = readQueue();
    const staleThreshold = 30 * 60_000; // 30 minutes
    for (const e of all) {
      if (e.state === 'RUNNING' && e.lastRun) {
        const age = Date.now() - new Date(e.lastRun).getTime();
        if (age > staleThreshold) {
          console.log(`  [watchdog] STALE RUNNING: ${e.id} (${Math.round(age/60000)}min) — marking FAILED`);
          e.state = 'FAILED';
          e.stopReason = 'failed';
          e.failureCode = 'stale-timeout';
          e.failureDetail = `stale running ${Math.round(age/60000)}min since lastRun`;
          e.attempts += 1;
        }
      }
    }
    writeQueue(all);

    const q = readQueue();
    const pending = q.filter((e) => e.state === 'QUEUED' || (e.state === 'FAILED' && e.attempts < 3));
    if (pending.length === 0) {
      console.log(new Date().toISOString(), 'no pending work');
    } else {
      const batch = pending.slice(0, opt.batch);
      if (opt.dryRun) {
        console.log(`dry-run would process ${batch.length}:`);
        for (const e of batch) console.log(`  ${e.id} ${e.title?.slice(0, 60)}`);
        return;
      }
      for (const entry of batch) {
        const all = readQueue();
        const cur = all.find((e) => e.id === entry.id);
        console.log(new Date().toISOString(), `processing ${entry.id} (${entry.title?.slice(0, 50)})`);

        // Create per-session worktree. Metadata is written to the queue BEFORE
        // ACP starts so a crash leaves resumable isolation state behind.
        let wt;
        try {
          wt = await createWorktree(entry);
        } catch (err) {
          cur.state = 'FAILED';
          cur.attempts += 1;
          cur.stopReason = 'failed';
          cur.failureDetail = `worktree: ${String(err.message).slice(0, 150)}`;
          cur.lastRun = new Date().toISOString();
          writeQueue(all);
          continue;
        }
        cur.worktreePath = wt.path;
        cur.branch = wt.branch;
        cur.baselineCommit = wt.baseline;
        cur.worktreeResumed = wt.resumed;
        writeQueue(all);

        // Timer + abort listener are lifecycle-bound: created per entry,
        // cleared/removed in finally on success, failure, and timeout alike.
        const controller = new AbortController();
        let raceReject;
        const abortPromise = new Promise((_, reject) => { raceReject = reject; });
        const abortListener = () => raceReject(new Error(`timeout after ${opt.timeoutMin}min`));
        controller.signal.addEventListener('abort', abortListener, { once: true });
        const timer = setTimeout(() => controller.abort(), opt.timeoutMin * 60_000);
        try {
          await Promise.race([processOneInWorktree(wt, entry, controller.signal), abortPromise]);
        } catch (err) {
          cur.state = 'FAILED';
          cur.attempts += 1;
          cur.stopReason = 'failed';
          cur.failureCode = String(err.message).startsWith('timeout after') ? 'timeout' : 'run-error';
          cur.failureDetail = String(err.message).slice(0, 200);
          cleanupWorktreeAfterFailure(cur, wt.resumed);
          console.error(`  ERROR (${cur.failureCode}): ${cur.failureDetail}`);
        } finally {
          clearTimeout(timer);
          controller.signal.removeEventListener('abort', abortListener);
          raceReject = null; // drop the only reference; no dangling rejection path
        }
        cur.lastRun = new Date().toISOString();
        writeQueue(all);
      }
    }
    if (!opt.loop) break;
    console.log(`sleeping ${opt.intervalMin}min`);
    await sleep(opt.intervalMin * 60_000);
  } while (opt.loop);
}

// Per-session isolation: detached worktree at a deterministic path, then a
// named branch inside it. Refuses to clobber an existing worktree/branch unless
// the queue entry explicitly resumes it (idempotency). ACP never runs in REPO.

// ctx injection point for regression tests: tests run the real logic against
// a temporary git repository instead of the live checkout.
function worktreeRootFor(ctx) {
  return join(ctx?.repo ?? REPO, '.worktrees', 'opencode-all');
}

async function createWorktree(entry, ctx = {}) {
  const repo = ctx.repo ?? REPO;
  const baseline = entry.baselineCommit || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }).trim();
  const worktreePath = join(worktreeRootFor(ctx), entry.id);
  const branch = `opencode/${entry.id}`;
  let created = false;

  try {
    mkdirSync(worktreeRootFor(ctx), { recursive: true });

    if (existsSync(worktreePath)) {
      // Resume only if the queue entry explicitly points at this exact worktree
      const currentBranch = execFileSync('git', ['-C', worktreePath, 'branch', '--show-current'], { cwd: repo, encoding: 'utf8' }).trim();
      if (entry.worktreePath === worktreePath && currentBranch === branch) {
        console.log(`  [worktree] resuming existing: ${worktreePath} (${branch})`);
        return { path: worktreePath, branch, baseline: entry.baselineCommit ?? baseline, resumed: true };
      }
      throw new Error(`worktree exists and cannot be resumed: ${worktreePath}`);
    }

    if (execFileSync('git', ['branch', '--list', branch], { cwd: repo, encoding: 'utf8' }).trim()) {
      throw new Error(`branch already exists without worktree: ${branch} — delete it or reuse`);
    }

    execFileSync('git', ['worktree', 'add', '--detach', worktreePath, baseline], { cwd: repo, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    created = true;
    // Named branch is part of the isolation contract — no detached fallback.
    execFileSync('git', ['-C', worktreePath, 'switch', '-c', branch], { cwd: repo, encoding: 'utf8' });

    // Minimal env for tooling: secrets/config copied per WORKTREE_POLICY conventions
    for (const f of ['.env', '.mcp.json']) {
      const src = join(repo, f);
      if (existsSync(src)) {
        const { copyFileSync } = await import('node:fs');
        copyFileSync(src, join(worktreePath, f));
      }
    }

    console.log(`  [worktree] created: ${worktreePath} @ ${baseline.slice(0, 8)} (${branch})`);
    return { path: worktreePath, branch, baseline, resumed: false };
  } catch (error) {
    console.error(`  [worktree] FAILED for ${entry.id}: ${error.message}`);
    // Only remove partial worktrees created during THIS attempt — never a resumed one.
    if (created) removeWorktreePath(worktreePath, ctx);
    throw error;
  }
}

function removeWorktreePath(worktreePath, ctx = {}) {
  // Returns true when the path is gone afterwards (or never existed);
  // callers must treat false as "removal failed" and stop deleting anything.
  if (!worktreePath || !existsSync(worktreePath)) return true;
  try {
    execFileSync('git', ['worktree', 'remove', '--force', worktreePath], { cwd: ctx.repo ?? REPO });
    console.log(`  [worktree] removed: ${worktreePath}`);
    return !existsSync(worktreePath);
  } catch (e) {
    console.error(`  [worktree] remove FAILED (left in place): ${e.message}`);
    return false;
  }
}

function removeWorktree(entry, ctx = {}) {
  removeWorktreePath(entry.worktreePath, ctx);
}

// A failed session still deserves review if it produced any change.
function worktreeHasDiff(worktreePath, baseline) {
  try {
    const tracked = execFileSync('git', ['diff', '--name-only', baseline ?? 'HEAD'], { cwd: worktreePath, encoding: 'utf8' }).trim();
    const untracked = execFileSync('git', ['status', '--porcelain'], { cwd: worktreePath, encoding: 'utf8' }).trim();
    return Boolean(tracked || untracked);
  } catch {
    return false;
  }
}

// Removal policy: remove ONLY when setup failed or nothing is reviewable.
// Self-healing retry path (DDM-v1 §10): a removed no-diff worktree must not
// leave its generated branch behind — an orphan `opencode/<id>` branch makes
// every retry fail at createWorktree before ACP starts. The branch is deleted
// only when it carries ZERO commits beyond baseline; any commits preserve it
// and escalate to NEEDS-HUMAN (fail loud, never delete work silently).
function cleanupWorktreeAfterFailure(cur, resumed = false, ctx = {}) {
  if (!cur.worktreePath || !existsSync(cur.worktreePath)) return 'no-worktree';
  if (resumed || cur.worktreeResumed) {
    cur.worktreeState = 'kept-resumed';
    return 'kept-resumed';
  }
  if (worktreeHasDiff(cur.worktreePath, cur.baselineCommit)) {
    cur.worktreeState = 'kept-for-review';
    console.log(`  [worktree] preserved for review (has diff): ${cur.worktreePath}`);
    return 'kept-for-review';
  }
  const worktreeRemoved = removeWorktreePath(cur.worktreePath, ctx);
  if (!worktreeRemoved) {
    // Removal failed: the worktree is still there — do not touch the branch.
    cur.worktreeState = 'kept-removal-failed';
    cur.stopReason = 'needs-human';
    console.log(`  [worktree] kept (removal failed), NEEDS-HUMAN: ${cur.worktreePath}`);
    return 'kept-removal-failed';
  }
  const branch = cur.branch ?? `opencode/${cur.id}`;
  // allowDelete=true here is the self-healing core of this fix: this path
  // just verified a zero-diff tree and successfully removed its OWN freshly
  // created worktree. Batch cleanup of OLD orphans never takes this route —
  // that goes through reconcile, where deletion needs --clean.
  const outcome = removeOrphanBranch(ctx.repo ?? REPO, branch, cur.baselineCommit, true);
  if (outcome === 'kept-has-commits') {
    // Paradox guard: working tree showed no diff but the branch has commits.
    // Preserve the branch and escalate — do not retry over live work.
    cur.worktreeState = 'kept-has-commits';
    cur.stopReason = 'needs-human';
    console.log(`  [worktree] branch preserved (has commits), NEEDS-HUMAN: ${branch}`);
    return 'kept-has-commits';
  }
  cur.worktreeState = 'removed-no-diff';
  console.log(`  [worktree] orphan branch cleaned (${outcome}): ${branch}`);
  return 'removed-no-diff';
}

// Count commits on branch beyond baseline; -1 if the rev-list fails (branch
// unreadable — treated as "has unknown work", never auto-deleted).
function branchCommitCount(repo, branch, baseline) {
  try {
    const out = execFileSync('git', ['rev-list', '--count', `${baseline}..${branch}`], { cwd: repo, encoding: 'utf8' });
    return parseInt(out.trim(), 10);
  } catch {
    return -1;
  }
}

function removeOrphanBranch(repo, branch, baseline, allowDelete = false) {
  let listing;
  try {
    listing = execFileSync('git', ['branch', '--list', branch], { cwd: repo, encoding: 'utf8' }).trim();
  } catch {
    return 'absent';
  }
  if (!listing) return 'absent';
  const count = branchCommitCount(repo, branch, baseline);
  if (count !== 0) return 'kept-has-commits'; // includes -1 unknown: never delete on doubt
  if (!allowDelete) return 'empty-reported'; // report-only mode: cleanup not approved
  execFileSync('git', ['branch', '-D', branch], { cwd: repo });
  return 'deleted';
}

async function processOneInWorktree(worktreeInfo, entry, signal = null) {
  // ACP runs with cwd set to the worktree — never REPO. Signal gives the
  // caller (timeout) a hard kill path into the subprocess.
  const client = new AcpClient(worktreeInfo.path, signal);
  await client.request('initialize', {
    protocolVersion: 1,
    clientCapabilities: { fs: { readTextFile: false, writeTextFile: false }, terminal: false },
  });
  try {
    return await processOne(client, entry, worktreeInfo.path);
  } finally {
    await client.close();
  }
}

// CLI entry only when invoked directly — importing the module (tests) must
// not trigger batch runs.
const invokedDirectly = Boolean(process.argv[1]) && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  (async () => {
    const cmd = args.find((a) => !a.startsWith('--')) ?? 'run';
    if (cmd === 'enqueue') cmdEnqueue();
    else if (cmd === 'status') cmdStatus();
    else if (cmd === 'lifecycle') cmdLifecycle();
    else if (cmd === 'reconcile') cmdReconcile();
    else if (cmd === 'run') await runBatches();
    else {
      console.log('usage: opencode-batch-worker.mjs <enqueue|run|status|lifecycle|reconcile> [--batch N] [--loop] [--dry-run] [--timeout MIN] [--interval MIN] [--clean: reconcile only — remove provably-empty orphan branches after human review]');
      process.exit(1);
    }
  })();
}

export { AcpClient, createWorktree, cleanupWorktreeAfterFailure, removeOrphanBranch };

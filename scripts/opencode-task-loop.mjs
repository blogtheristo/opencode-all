#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic Agent=opencode-task-loop Date=2026-09-28
// Audit trail: git log -- scripts/opencode-task-loop.mjs
/**
 * opencode-task-loop — run OpenCode unattended from task to task, with no HIC between sessions.
 *
 * A task is one file, .claude/done/<branch>.json in the primary checkout (~/dws6, on main):
 *   {
 *     "task":   "one-line title",
 *     "prompt": "what to build — the instruction OpenCode gets",
 *     "checks": [ { "name": "…", "run": "<bash, exit 0 = pass>" } ],   // acceptance, see agent-done-gate
 *     "order": 10, "base": "main", "model": "ollama-local/qwen3-coder-next:latest",
 *     "maxRounds": 4, "enabled": true                                   // all optional
 *   }
 * Files without "prompt" are acceptance-only specs and are not run by the loop.
 *
 * For each enabled task, in `order`:
 *   1. find the branch's worktree, or create one (~/.opencode-worktrees/<repo>/<branch-slug>);
 *   2. run scripts/agent-done-gate.mjs --full — DONE → next task;
 *   3. otherwise start a FRESH `opencode run` in the worktree with the task prompt plus the
 *      gate's current FAILs (fresh sessions: small models drift in long contexts; the repo and
 *      the gate carry the state, not the chat);
 *   4. gate again. Repeat up to maxRounds. Two rounds with no new commit and the same FAILs
 *      = stalled. Stalled or out of rounds → BLOCKED, alert, move on.
 * A BLOCKED task is retried automatically once its spec file changes (the HIC's lever).
 * Nothing is merged: DONE means the branch is pushed and passes its gate; merging stays with the HIC.
 *
 * Usage (DGX, in tmux):
 *   node scripts/opencode-task-loop.mjs                run until the queue is empty, then poll
 *   node scripts/opencode-task-loop.mjs --once         one pass over the queue
 *   node scripts/opencode-task-loop.mjs --status       show task states
 *   node scripts/opencode-task-loop.mjs --dry-run      show what would run
 *   node scripts/opencode-task-loop.mjs --task <branch> only this task
 * Env: OPENCODE_LOOP_MODEL (default model), OPENCODE_LOOP_ROUND_MIN (round timeout, default 90),
 *      OPENCODE_LOOP_POLL_MIN (idle poll, default 10).
 * State + logs: ~/.local/state/opencode-task-loop/ (state.json, alerts.log, <branch-slug>.log)
 */
import { execFileSync, spawnSync } from 'node:child_process';
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { basename, dirname, join, relative } from 'node:path';

const argv = process.argv.slice(2);
const flag = (f) => argv.includes(f);
const optVal = (f) => (argv.includes(f) ? argv[argv.indexOf(f) + 1] : null);
const ONCE = flag('--once');
const DRY = flag('--dry-run');
const ONLY = optVal('--task');
const ROUND_MIN = Number(process.env.OPENCODE_LOOP_ROUND_MIN ?? 90);
const POLL_MIN = Number(process.env.OPENCODE_LOOP_POLL_MIN ?? 10);
const DEFAULT_MODEL = process.env.OPENCODE_LOOP_MODEL ?? 'ollama-local/qwen3-coder-next:latest';

const git = (cwd, ...a) =>
  execFileSync('git', a, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const tryGit = (cwd, ...a) => {
  try {
    return git(cwd, ...a);
  } catch {
    return null;
  }
};

// Primary checkout = parent of the shared .git dir, wherever this is started from.
const PRIMARY = dirname(
  git(process.cwd(), 'rev-parse', '--path-format=absolute', '--git-common-dir'),
);
const SPEC_DIR = join(PRIMARY, '.claude', 'done');
const GATE = join(PRIMARY, 'scripts', 'agent-done-gate.mjs');
const WT_ROOT = join(homedir(), '.opencode-worktrees', basename(PRIMARY));
const STATE_DIR = join(homedir(), '.local', 'state', 'opencode-task-loop');
const STATE_FILE = join(STATE_DIR, 'state.json');
const LOCK = join(STATE_DIR, 'loop.lock');
mkdirSync(STATE_DIR, { recursive: true });

const now = () => new Date().toISOString();
const slug = (branch) => branch.replace(/[^A-Za-z0-9._-]+/g, '-');
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 12);
const loadState = () =>
  existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, 'utf8')) : {};
const saveState = (s) => writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));
function alert(msg) {
  const line = `${now()} ${msg}`;
  console.log(`[loop] ${msg}`);
  appendFileSync(join(STATE_DIR, 'alerts.log'), `${line}\n`);
}

function listSpecs() {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.json')) out.push(p);
    }
  };
  if (existsSync(SPEC_DIR)) walk(SPEC_DIR);
  return out
    .map((file) => {
      let spec;
      try {
        spec = JSON.parse(readFileSync(file, 'utf8'));
      } catch (e) {
        alert(`invalid spec ${relative(PRIMARY, file)}: ${e.message}`);
        return null;
      }
      const branch = relative(SPEC_DIR, file).replace(/\.json$/, '');
      return { file, branch, spec, specHash: hash(readFileSync(file, 'utf8')) };
    })
    .filter((t) => t && t.spec.prompt && t.spec.enabled !== false && (!ONLY || t.branch === ONLY))
    .sort(
      (a, b) => (a.spec.order ?? 100) - (b.spec.order ?? 100) || a.branch.localeCompare(b.branch),
    );
}

function worktreeFor(branch) {
  const list = git(PRIMARY, 'worktree', 'list', '--porcelain').split('\n\n');
  for (const block of list) {
    const path = block.match(/^worktree (.+)$/m)?.[1];
    if (
      block.includes(`branch refs/heads/${branch}\n`) ||
      block.endsWith(`branch refs/heads/${branch}`)
    )
      if (path !== PRIMARY) return path;
  }
  return null;
}

function ensureWorktree(t) {
  const existing = worktreeFor(t.branch);
  if (existing) return existing;
  const path = join(WT_ROOT, slug(t.branch));
  if (existsSync(path)) throw new Error(`${path} exists but is not a worktree of ${t.branch}`);
  mkdirSync(WT_ROOT, { recursive: true });
  tryGit(PRIMARY, 'fetch', '-q', 'origin');
  if (tryGit(PRIMARY, 'rev-parse', '--verify', '--quiet', `refs/heads/${t.branch}`))
    git(PRIMARY, 'worktree', 'add', path, t.branch);
  else if (tryGit(PRIMARY, 'rev-parse', '--verify', '--quiet', `refs/remotes/origin/${t.branch}`))
    git(PRIMARY, 'worktree', 'add', '--track', '-b', t.branch, path, `origin/${t.branch}`);
  else
    git(
      PRIMARY,
      'worktree',
      'add',
      '--no-track',
      '-b',
      t.branch,
      path,
      `origin/${t.spec.base ?? 'main'}`,
    );
  // Same shared deps as new-opencode-worktree.sh --link-deps; symlinks excluded from git.
  const exclude = join(
    git(PRIMARY, 'rev-parse', '--path-format=absolute', '--git-common-dir'),
    'info',
    'exclude',
  );
  const excluded = existsSync(exclude) ? readFileSync(exclude, 'utf8') : '';
  for (const d of ['node_modules', '.venv', 'venv']) {
    if (existsSync(join(PRIMARY, d)) && !existsSync(join(path, d)))
      symlinkSync(join(PRIMARY, d), join(path, d));
    if (!excluded.split('\n').includes(`/${d}`)) appendFileSync(exclude, `/${d}\n`);
  }
  alert(`${t.branch}: worktree created at ${path}`);
  return path;
}

function runGate(wt, since) {
  const r = spawnSync('node', [GATE, '--full', ...(since ? ['--since', since] : [])], {
    cwd: wt,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    timeout: 30 * 60 * 1000,
  });
  return { done: r.status === 0, out: `${r.stdout ?? ''}${r.stderr ?? ''}`.trim() };
}

function roundPrompt(t, gateOut, round, max) {
  return [
    `Task: ${t.spec.task ?? t.branch}`,
    `Branch: ${t.branch} — you are in its worktree. Work, commit and push only here.`,
    '',
    t.spec.prompt,
    '',
    `Round ${round}/${max}. This is a fresh session: read \`git log --oneline -10\`, \`git status\` and`,
    `.claude/handoffs/${t.branch}.md (if it exists) before editing. The acceptance checks are in`,
    `.claude/done/${t.branch}.json (in ~/dws6 if not in this worktree).`,
    '',
    'Current done-gate result (the ONLY definition of done):',
    '```',
    gateOut,
    '```',
    '',
    'Rules: fix every FAIL above; do not edit the acceptance checks; keep changes scoped to the task;',
    `commit with a clear message and \`git push -u origin ${t.branch}\`; update the handoff file with what`,
    'is left. Finish by running `node ~/dws6/scripts/agent-done-gate.mjs --full` and ending your answer',
    'with its raw output. If something needs a human decision, write it in the handoff and stop.',
  ].join('\n');
}

function runOpencode(t, wt, prompt, round) {
  const log = join(STATE_DIR, `${slug(t.branch)}.log`);
  appendFileSync(log, `\n===== ${now()} round ${round} =====\n${prompt}\n----- opencode -----\n`);
  const env = {
    ...process.env,
    DWS_DONE_GATE: '0', // the loop gates every round itself
    // CLAUDE.md Tool Git Identity Rule; GH007-safe (not a private address on the account).
    GIT_AUTHOR_NAME: process.env.GIT_AUTHOR_NAME ?? 'Risto Anton Päärni (opencode)',
    GIT_AUTHOR_EMAIL: process.env.GIT_AUTHOR_EMAIL ?? 'opencode@lifetime.fi',
    GIT_COMMITTER_NAME: process.env.GIT_COMMITTER_NAME ?? 'Risto Anton Päärni (opencode)',
    GIT_COMMITTER_EMAIL: process.env.GIT_COMMITTER_EMAIL ?? 'opencode@lifetime.fi',
  };
  const r = spawnSync(
    'opencode',
    [
      'run',
      '--auto',
      '--title',
      `loop ${t.branch} r${round}`,
      '-m',
      t.spec.model ?? DEFAULT_MODEL,
      prompt,
    ],
    {
      cwd: wt,
      env,
      encoding: 'utf8',
      maxBuffer: 256 * 1024 * 1024,
      timeout: ROUND_MIN * 60 * 1000,
    },
  );
  appendFileSync(
    log,
    `${r.stdout ?? ''}${r.stderr ?? ''}\n----- exit ${r.status}${r.error ? ` (${r.error.message})` : ''} -----\n`,
  );
  return r.status === 0;
}

function workTask(t, state) {
  const st = (state[t.branch] ??= { status: 'pending', rounds: 0 });
  if (st.status === 'done' && st.specHash === t.specHash) return;
  if (st.status === 'blocked' && st.specHash === t.specHash) return;
  if (st.specHash !== t.specHash)
    Object.assign(st, { status: 'pending', rounds: 0, stalls: 0, startHead: undefined });
  st.specHash = t.specHash;
  const max = t.spec.maxRounds ?? 4;

  const wt = ensureWorktree(t);
  // Judge the loop's own work from where this task (spec version) started, not from main.
  st.startHead ??= tryGit(wt, 'rev-parse', 'HEAD');
  let gate = runGate(wt, st.startHead);
  while (!gate.done && st.rounds < max) {
    st.rounds += 1;
    Object.assign(st, { status: 'running', worktree: wt, updatedAt: now() });
    saveState(state);
    const before = {
      head: tryGit(wt, 'rev-parse', 'HEAD'),
      fails: hash(gate.out.replace(/— \w+ /, '')),
    };
    alert(`${t.branch}: round ${st.rounds}/${max} started`);
    const ok = runOpencode(t, wt, roundPrompt(t, gate.out, st.rounds, max), st.rounds);
    gate = runGate(wt, st.startHead);
    const after = {
      head: tryGit(wt, 'rev-parse', 'HEAD'),
      fails: hash(gate.out.replace(/— \w+ /, '')),
    };
    st.stalls =
      before.head === after.head && before.fails === after.fails ? (st.stalls ?? 0) + 1 : 0;
    st.lastGate = gate.out
      .split('\n')
      .filter((l) => /FAIL|DONE/.test(l))
      .join(' | ');
    alert(
      `${t.branch}: round ${st.rounds} ${ok ? 'finished' : 'exited non-zero/timeout'} → ${gate.done ? 'DONE' : st.lastGate}`,
    );
    if (st.stalls >= 2) break;
  }
  st.status = gate.done ? 'done' : 'blocked';
  st.updatedAt = now();
  saveState(state);
  alert(
    gate.done
      ? `${t.branch}: DONE — pushed and passing its gate; ready for HIC review/merge`
      : `${t.branch}: BLOCKED after ${st.rounds} round(s)${st.stalls >= 2 ? ' (stalled)' : ''} — edit ${relative(PRIMARY, t.file)} or the handoff to retry`,
  );
}

function status() {
  const state = loadState();
  const tasks = listSpecs();
  if (!tasks.length) return console.log(`no runnable tasks in ${SPEC_DIR} (specs need a "prompt")`);
  for (const t of tasks) {
    const st = state[t.branch] ?? { status: 'pending', rounds: 0 };
    const stale = st.specHash && st.specHash !== t.specHash ? ' (spec changed → will rerun)' : '';
    console.log(
      `${String(st.status).padEnd(8)} r${st.rounds ?? 0}  ${t.branch}${stale}${st.lastGate ? `\n          ${st.lastGate}` : ''}`,
    );
  }
}

if (flag('--status')) {
  status();
  process.exit(0);
}
if (DRY) {
  for (const t of listSpecs())
    console.log(
      `would run: ${t.branch} (order ${t.spec.order ?? 100}, ${t.spec.model ?? DEFAULT_MODEL})`,
    );
  process.exit(0);
}

// One loop per machine.
if (existsSync(LOCK)) {
  const pid = Number(readFileSync(LOCK, 'utf8'));
  let alive = false;
  try {
    process.kill(pid, 0);
    alive = true;
  } catch {
    /* stale lock */
  }
  if (alive) {
    console.error(`opencode-task-loop already running (pid ${pid}); --status to inspect`);
    process.exit(1);
  }
}
writeFileSync(LOCK, String(process.pid));
const release = () => existsSync(LOCK) && statSync(LOCK) && unlinkSync(LOCK);
process.on('exit', release);
process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));

alert(`started (pid ${process.pid}, model ${DEFAULT_MODEL}, round timeout ${ROUND_MIN}m)`);
for (;;) {
  tryGit(PRIMARY, 'pull', '-q', '--ff-only', 'origin', 'main'); // new specs arrive via main
  const state = loadState();
  const tasks = listSpecs();
  for (const t of tasks) {
    try {
      workTask(t, state);
    } catch (e) {
      (state[t.branch] ??= {}).status = 'blocked';
      state[t.branch].specHash = t.specHash;
      saveState(state);
      alert(`${t.branch}: BLOCKED — ${e.message.split('\n')[0]}`);
    }
  }
  if (ONCE) break;
  const pending = listSpecs().filter((t) => {
    const st = loadState()[t.branch];
    return !st || st.specHash !== t.specHash;
  });
  if (!pending.length) await new Promise((r) => setTimeout(r, POLL_MIN * 60 * 1000));
}
alert('pass complete');

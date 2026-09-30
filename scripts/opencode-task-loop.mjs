#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=opencode-task-loop Date=2026-09-30
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
 * SETTLED: skipped because its PR is merged or closed, or its checks already pass on main —
 * follow-up work on a merged task needs a new branch and spec.
 * DONE = branch pushed, passes its gate, and a PR is open (or the compare URL if gh fails).
 * Nothing is merged; merging stays with the HIC.
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
  let done = r.status === 0;
  let out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim();
  // The loop judges every branch with ~/dws6's gate. A branch that edits the gate itself would
  // then never have its own copy run: #2266 was reported DONE while its gate crashed on start
  // (30.09.2026). Run the branch copy too and fail when it does not produce a verdict.
  const own = join(wt, 'scripts', 'agent-done-gate.mjs');
  const touched = tryGit(
    wt,
    'diff',
    '--name-only',
    'origin/main...HEAD',
    '--',
    'scripts/agent-done-gate.mjs',
  );
  if (touched && existsSync(own)) {
    const b = spawnSync('node', [own, '--json', '--allow-unpushed'], {
      cwd: wt,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      timeout: 30 * 60 * 1000,
    });
    let verdict = null;
    try {
      verdict = JSON.parse(b.stdout ?? '');
    } catch {
      /* no verdict */
    }
    if (!verdict || typeof verdict.done !== 'boolean') {
      done = false;
      const err = `${b.stderr ?? ''}`.trim().split('\n').slice(-6).join('\n');
      out += `\n  FAIL  branch gate: this branch's scripts/agent-done-gate.mjs gives no verdict\n${err.replace(/^/gm, '        ')}`;
    } else
      out += "\n  PASS  branch gate: this branch's agent-done-gate.mjs runs and returns a verdict";
  }
  return { done, out };
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
    'Rules: fix every FAIL above; do not edit the acceptance checks; keep changes scoped to the task',
    '(do not reformat, reorder imports in, or rewrite files the task does not name);',
    'never make a check pass by weakening it: a test or step that could not run is SKIPPED or FAIL,',
    'never PASS;',
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
    // OpenCode takes its session directory from PWD, not cwd: without this every round
    // edits and commits in the primary checkout instead of the task worktree (29.09.2026).
    PWD: wt,
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

// Checkpoint: a round that crashed, timed out or ran into a DGX reboot leaves its edits
// uncommitted or unpushed in the worktree. Commit and push them with a loop-written handoff so
// the work survives the machine and the next round (or the HIC) can pick it up. WIP only —
// the done gate still judges the branch. Runs before every round and after every round.
function checkpoint(t, wt, label, gateOut) {
  const dirty = tryGit(wt, 'status', '--porcelain') ?? '';
  const upstream = tryGit(wt, 'rev-parse', '--abbrev-ref', '@{u}');
  // No upstream yet: only commits beyond the base count, so a fresh task is not pushed empty.
  const since = upstream ?? `origin/${t.spec.base ?? 'main'}`;
  const unpushed = Number(tryGit(wt, 'rev-list', '--count', `${since}..HEAD`) ?? 0);
  if (!dirty && !unpushed) return;
  const handoff = join(wt, '.claude', 'handoffs', `${t.branch}.md`);
  mkdirSync(dirname(handoff), { recursive: true });
  const fails = (gateOut ?? '')
    .split(/\n| \| /)
    .filter((l) => /^\s*FAIL/.test(l))
    .map((l) => `- ${l.trim()}`);
  appendFileSync(
    handoff,
    [
      '',
      `## Loop checkpoint — ${now()} — ${label}`,
      '',
      `Uncommitted or unpushed work was saved by opencode-task-loop. Gate before this round:`,
      ...(fails.length ? fails : ['- (no FAIL lines recorded)']),
      '',
    ].join('\n'),
  );
  tryGit(wt, 'add', '-A');
  // --no-verify: WIP must be saved even when it does not typecheck; the pre-push guards and
  // the done gate still apply.
  tryGit(wt, 'commit', '-q', '--no-verify', '-m', `chore(loop): checkpoint ${t.branch} — ${label}`);
  const push = spawnSync('git', ['push', '-q', '-u', 'origin', t.branch], {
    cwd: wt,
    encoding: 'utf8',
    env: { ...process.env, SKIP_LOCAL_CI: '1' },
    timeout: 10 * 60 * 1000,
  });
  alert(
    `${t.branch}: checkpoint (${label}) ${push.status === 0 ? 'pushed' : `saved locally, push failed: ${(push.stderr || '').trim().split('\n')[0]}`}`,
  );
}

// A task is settled when its work has already reached main or its PR is gone. Re-running it
// only produces a duplicate PR: on 29-30.09.2026 a spec edit re-queued five merged tasks and
// the loop opened #2262, #2264, #2265, #2215 and #2259 for work main already had.
const ghJson = (cwd, ...a) => {
  const r = spawnSync('gh', a, { cwd, encoding: 'utf8', timeout: 60 * 1000 });
  if (r.status !== 0) return null;
  try {
    return JSON.parse(r.stdout);
  } catch {
    return null;
  }
};
function settled(t, st) {
  const prs = ghJson(
    PRIMARY,
    'pr',
    'list',
    '--head',
    t.branch,
    '--state',
    'all',
    '--json',
    'number,state',
  );
  if (prs === null) return null; // gh unavailable: do not guess
  if (prs.some((p) => p.state === 'OPEN')) return null;
  const mine = t.spec.pr ? prs.find((p) => p.number === t.spec.pr) : null;
  if (t.spec.pr && (mine?.state ?? 'CLOSED') !== 'OPEN')
    return `PR #${t.spec.pr} is ${(mine?.state ?? 'not open').toLowerCase()}`;
  const merged = prs.find((p) => p.state === 'MERGED');
  if (merged) return `PR #${merged.number} for this branch is merged`;
  // Acceptance already true on main (loop-task.mjs requires every check to fail on the code of
  // its day, so passing now means the work landed some other way). Only judged in a primary
  // checkout that equals origin/main; cached per spec version and main commit.
  if (t.spec.pr || !t.spec.checks?.length) return null;
  tryGit(PRIMARY, 'fetch', '-q', 'origin', 'main');
  const mainSha = tryGit(PRIMARY, 'rev-parse', 'origin/main');
  if (!mainSha || tryGit(PRIMARY, 'rev-parse', 'HEAD') !== mainSha) return null;
  if (tryGit(PRIMARY, 'status', '--porcelain', '--untracked-files=no')) return null;
  const key = `${t.specHash}@${mainSha}`;
  if (st.mainCheck?.key !== key) {
    const pass = t.spec.checks.every(
      (c) =>
        spawnSync('bash', ['-c', c.run], {
          cwd: PRIMARY,
          encoding: 'utf8',
          timeout: 15 * 60 * 1000,
          maxBuffer: 64 * 1024 * 1024,
        }).status === 0,
    );
    st.mainCheck = { key, pass };
  }
  return st.mainCheck.pass ? 'every acceptance check already passes on origin/main' : null;
}

function workTask(t, state) {
  const st = (state[t.branch] ??= { status: 'pending', rounds: 0 });
  if (st.status !== 'running' || st.specHash !== t.specHash) {
    const why = settled(t, st);
    if (why) {
      if (st.status !== 'settled' || st.specHash !== t.specHash)
        alert(`${t.branch}: SETTLED — ${why}; not run (a new task needs a new branch)`);
      Object.assign(st, {
        status: 'settled',
        specHash: t.specHash,
        lastGate: why,
        updatedAt: now(),
      });
      saveState(state);
      return;
    }
    if (st.status === 'settled')
      Object.assign(st, { status: 'pending', rounds: 0, stalls: 0, startHead: undefined });
  }
  // A finished PR task goes stale when its base moves (another PR was merged): reopen it so
  // the branch gets the new base merged in and is re-gated, instead of rotting behind main.
  if (st.status === 'done' && st.specHash === t.specHash && t.spec.pr && st.worktree) {
    const base = t.spec.base ?? 'main';
    tryGit(st.worktree, 'fetch', '-q', 'origin', base);
    const behind =
      tryGit(st.worktree, 'merge-base', '--is-ancestor', `origin/${base}`, 'HEAD') === null;
    const open = spawnSync(
      'gh',
      ['pr', 'view', String(t.spec.pr), '--json', 'state', '-q', '.state'],
      {
        cwd: st.worktree,
        encoding: 'utf8',
        timeout: 60 * 1000,
      },
    ).stdout?.trim();
    if (behind && open === 'OPEN') {
      Object.assign(st, { status: 'pending', rounds: 0, stalls: 0, startHead: undefined });
      alert(`${t.branch}: ${base} moved — reopened to merge it in again`);
    }
  }
  if (st.status === 'done' && st.specHash === t.specHash) return;
  if (st.status === 'blocked' && st.specHash === t.specHash) return;
  if (st.specHash !== t.specHash)
    Object.assign(st, { status: 'pending', rounds: 0, stalls: 0, startHead: undefined });
  st.specHash = t.specHash;
  const max = t.spec.maxRounds ?? 4;

  const wt = ensureWorktree(t);
  // Judge the loop's own work from where this task (spec version) started, not from main.
  checkpoint(t, wt, 'left over from an interrupted run', st.lastGate);
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
    checkpoint(
      t,
      wt,
      `round ${st.rounds} ${ok ? 'finished' : 'exited non-zero/timeout'}`,
      gate.out,
    );
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
  if (gate.done) st.pr = openPr(t, wt, gate.out);
  saveState(state);
  alert(
    gate.done
      ? `${t.branch}: DONE — passing its gate; ${st.pr ?? 'no PR'} — ready for HIC review/merge`
      : `${t.branch}: BLOCKED after ${st.rounds} round(s)${st.stalls >= 2 ? ' (stalled)' : ''} — edit ${relative(PRIMARY, t.file)} or the handoff to retry`,
  );
}

// Like opencode-all: a finished task ends as a PR for the HIC. Reuses an open PR for the branch;
// never merges. Without a working gh the compare URL is the fallback.
function openPr(t, wt, gateOut) {
  const base = t.spec.base ?? 'main';
  const gh = (...a) => spawnSync('gh', a, { cwd: wt, encoding: 'utf8', timeout: 60 * 1000 });
  const existing = gh(
    'pr',
    'view',
    t.branch,
    '--json',
    'url,state',
    '-q',
    'select(.state=="OPEN") | .url',
  );
  if (existing.status === 0 && existing.stdout.trim()) return existing.stdout.trim();
  // A task whose checks already pass on the base has nothing to review; gh would only fail.
  tryGit(wt, 'fetch', '-q', 'origin', base);
  if (tryGit(wt, 'rev-list', '--count', `origin/${base}..HEAD`)?.trim() === '0')
    return `no PR — no commits beyond origin/${base} (already satisfied on ${base})`;
  const body = [
    `Task: ${t.spec.task ?? t.branch} — run unattended by \`scripts/opencode-task-loop.mjs\`.`,
    `Acceptance spec: \`.claude/done/${t.branch}.json\`.`,
    '',
    'Done-gate evidence (`agent-done-gate.mjs --full`):',
    '```',
    gateOut,
    '```',
    '',
    'HIC review required before merge.',
  ].join('\n');
  const r = gh(
    'pr',
    'create',
    '--base',
    base,
    '--head',
    t.branch,
    '--title',
    `loop: ${t.spec.task ?? t.branch}`,
    '--body',
    body,
  );
  const url = r.stdout?.trim().split('\n').pop();
  if (r.status === 0 && url) return url;
  const remote = tryGit(wt, 'remote', 'get-url', 'origin')
    ?.replace(/\.git$/, '')
    .replace(/^git@github\.com:/, 'https://github.com/');
  alert(
    `${t.branch}: gh pr create failed (${(r.stderr || r.error?.message || '').trim().split('\n')[0]})`,
  );
  return remote ? `${remote}/compare/${base}...${t.branch}` : null;
}

function status() {
  const state = loadState();
  const tasks = listSpecs();
  if (!tasks.length) return console.log(`no runnable tasks in ${SPEC_DIR} (specs need a "prompt")`);
  for (const t of tasks) {
    const st = state[t.branch] ?? { status: 'pending', rounds: 0 };
    const stale = st.specHash && st.specHash !== t.specHash ? ' (spec changed → will rerun)' : '';
    console.log(
      `${String(st.status).padEnd(8)} r${st.rounds ?? 0}  ${t.branch}${stale}${st.pr ? `\n          ${st.pr}` : ''}${st.lastGate ? `\n          ${st.lastGate}` : ''}`,
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

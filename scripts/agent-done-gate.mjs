#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic Agent=agent-done-gate Date=2026-09-30
// Audit trail: git log -- scripts/agent-done-gate.mjs
/**
 * agent-done-gate — decides "done" from repository facts, not from an agent's summary.
 *
 * Why: local OpenCode models (28.09.2026, epic-turing REVAL_LEASH) repeatedly reported
 * "gap fixed, all tests pass" while the commit was unpushed, production never called the
 * new code, and the gap's it.todo was still in place. A claim is only as good as the
 * check behind it; this script is the check.
 *
 * Usage (run inside the worktree whose work is being claimed):
 *   node scripts/agent-done-gate.mjs            fast checks (git state, format, todo count, task spec)
 *   node scripts/agent-done-gate.mjs --full     + typecheck and vitest on changed files
 *   node scripts/agent-done-gate.mjs --json     machine-readable result
 *   node scripts/agent-done-gate.mjs --allow-unpushed   unpushed = WARN (local-only runners)
 *   node scripts/agent-done-gate.mjs --since <ref>   judge only the work after <ref>
 *        (the OpenCode done-gate plugin passes the commit the session started from, so a
 *        session is not blamed for what the branch already contained). Default: merge base
 *        with origin/main.
 *
 * Checks:
 *   committed   no modified tracked files left behind
 *   pushed      HEAD is on its upstream
 *   format      prettier --check on changed files; a file already unformatted at the base is not counted
 *   todo        it.todo / test.todo count did not grow vs. --since (fail) or the merge base (warn)
 *   whitespace  lines changed only in whitespace (warning — usually a model rewriting unrelated lines)
 *   typecheck   tsc --noEmit when .ts changed (--full)
 *   lint        eslint errors on changed src/ files, as CI's lint-check (--full)
 *   tests       vitest related --run on changed source (--full)
 *   spec        every check in .claude/done/<branch>.json exits 0 — the task's own acceptance
 *   spec-lock   the branch did not modify, delete or rename any task spec that existed at its
 *               merge base with origin/main (--allow-spec-edit = WARN, for HIC-side spec PRs)
 *
 * Task spec (.claude/done/<branch>.json): read from origin/main when it is there, else from the
 * primary checkout, else from this checkout. The acceptance checks are set by whoever wrote the
 * spec, not by the task being judged: on 29.09.2026 three loop branches loosened their own
 * checks in their worktree copy of the spec and then passed them.
 *   { "task": "…", "checks": [ { "name": "…", "run": "<bash command, exit 0 = pass>" } ] }
 *
 * Exit 0 = done, 1 = not done, 2 = gate could not run.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const argv = process.argv.slice(2);
const args = new Set(argv);
const FULL = args.has('--full');
// Local-only runners (opencode-all batch worker) keep work in a worktree for HIC review and
// never push: for them an unpushed branch is expected, so it is reported, not failed.
const ALLOW_UNPUSHED = args.has('--allow-unpushed');
const JSON_OUT = args.has('--json');
const ALLOW_SPEC_EDIT = args.has('--allow-spec-edit');
const sinceIdx = argv.indexOf('--since');
const SINCE = sinceIdx >= 0 ? argv[sinceIdx + 1] : null;

function git(...a) {
  return execFileSync('git', a, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
function tryGit(...a) {
  try {
    return git(...a);
  } catch {
    return null;
  }
}
function run(cmd, argv, opts = {}) {
  const r = spawnSync(cmd, argv, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...opts });
  const out = `${r.stdout || ''}${r.stderr || ''}`.trim();
  return { ok: r.status === 0, out, status: r.status };
}
function tail(text, n = 15) {
  return text.split('\n').slice(-n).join('\n');
}

const top = tryGit('rev-parse', '--show-toplevel');
if (!top) {
  console.error('agent-done-gate: not inside a git repository');
  process.exit(2);
}
process.chdir(top);

const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
tryGit('fetch', '-q', 'origin', 'main');
const sinceSha = SINCE ? tryGit('rev-parse', '--verify', '--quiet', `${SINCE}^{commit}`) : null;
if (SINCE && !sinceSha)
  console.error(`agent-done-gate: --since ${SINCE} is not a commit; using merge base`);
const base =
  sinceSha || tryGit('merge-base', 'HEAD', 'origin/main') || tryGit('merge-base', 'HEAD', 'main');
const changed = base
  ? git('diff', '--name-only', '--diff-filter=ACMR', base, 'HEAD').split('\n').filter(Boolean)
  : [];

const results = [];
const add = (name, status, detail = '') => results.push({ name, status, detail });

// committed
const dirty = git('status', '--porcelain', '--untracked-files=no').split('\n').filter(Boolean);
add('committed', dirty.length ? 'fail' : 'pass', dirty.length ? dirty.join('\n') : 'clean');

// pushed
const upstream = tryGit('rev-parse', '--abbrev-ref', '@{u}');
if (!upstream)
  add('pushed', ALLOW_UNPUSHED ? 'warn' : 'fail', `${branch} has no upstream — never pushed`);
else {
  const ahead = Number(git('rev-list', '--count', `${upstream}..HEAD`));
  add(
    'pushed',
    ahead ? (ALLOW_UNPUSHED ? 'warn' : 'fail') : 'pass',
    ahead ? `${ahead} commit(s) not on ${upstream}` : `on ${upstream}`,
  );
}

// format
const fmtFiles = changed.filter((f) => /\.(m?[jt]sx?|json|md|css|html)$/.test(f) && existsSync(f));
if (fmtFiles.length) {
  const r = run('npx', ['--no-install', 'prettier', '--check', ...fmtFiles]);
  const failing = r.ok ? [] : fmtFiles.filter((f) => r.out.includes(`] ${f}`));
  // A file that was already unformatted at the base is inherited, not this work's doing.
  const introduced = failing.filter((f) => {
    const old = base ? tryGit('show', `${base}:${f}`) : null;
    if (old === null) return true;
    const fmt = run('npx', ['--no-install', 'prettier', '--stdin-filepath', f], {
      input: old + '\n',
    });
    return fmt.ok && fmt.out === old.trim();
  });
  const inherited = failing.length - introduced.length;
  add(
    'format',
    introduced.length ? 'fail' : 'pass',
    introduced.length
      ? `unformatted by this work (run prettier --write):\n${introduced.join('\n')}`
      : `${fmtFiles.length} file(s)${inherited ? `; ${inherited} already unformatted at base` : ''}`,
  );
}

// todo count
if (base) {
  const re = /\b(?:it|test)\.todo\(/g;
  const count = (text) => (text.match(re) || []).length;
  const testFiles = changed.filter((f) => /\.(test|spec)\.m?[jt]sx?$/.test(f));
  let before = 0;
  let after = 0;
  for (const f of testFiles) {
    before += count(tryGit('show', `${base}:${f}`) || '');
    after += existsSync(f) ? count(readFileSync(f, 'utf8')) : 0;
  }
  if (testFiles.length) {
    // Against a session start (--since) new todos mean deferred work; against main they are
    // often the branch's own planned gaps (e.g. a Fail-Loud suite), so only warn there.
    const grew = after > before ? (sinceSha ? 'fail' : 'warn') : 'pass';
    add('todo', grew, `it.todo in changed tests: ${before} → ${after}`);
  }
}

// whitespace-only line changes
if (base && changed.length) {
  const numstat = (extra) =>
    Object.fromEntries(
      git('diff', '--numstat', ...extra, base, 'HEAD')
        .split('\n')
        .filter(Boolean)
        .map((l) => {
          const [a, , f] = l.split('\t');
          return [f, Number(a) || 0];
        }),
    );
  const all = numstat([]);
  const ignoringWs = numstat(['-w']);
  const ws = Object.keys(all)
    .map((f) => [f, all[f] - (ignoringWs[f] || 0)])
    .filter(([, n]) => n > 0)
    .map(([f, n]) => `${f}: ${n} line(s) differ only in whitespace`);
  if (ws.length) add('whitespace', 'warn', ws.join('\n'));
}

// typecheck + tests
if (FULL) {
  const ts = changed.filter((f) => /\.tsx?$/.test(f));
  if (ts.length) {
    const r = run('npx', ['--no-install', 'tsc', '--noEmit', '-p', 'tsconfig.json']);
    add('typecheck', r.ok ? 'pass' : 'fail', r.ok ? 'tsc clean' : tail(r.out));
  }
  // CI's lint-check runs `eslint src` and fails on errors; the loop's first two PRs passed this
  // gate and went red there (unused test vars, import() type annotations).
  const lintable = changed.filter((f) => /^src\/.*\.m?[jt]sx?$/.test(f) && existsSync(f));
  if (lintable.length) {
    const r = run('npx', ['--no-install', 'eslint', '--quiet', ...lintable]);
    add('lint', r.ok ? 'pass' : 'fail', r.ok ? 'eslint clean' : tail(r.out));
  }
  const src = changed.filter((f) => /\.m?[jt]sx?$/.test(f) && existsSync(f));
  if (src.length) {
    const r = run('npx', [
      '--no-install',
      'vitest',
      'related',
      '--run',
      '--passWithNoTests',
      ...src,
    ]);
    const summary = r.out.split('\n').filter((l) => /Test Files|Tests |FAIL/.test(l));
    add('tests', r.ok ? 'pass' : 'fail', (r.ok ? summary : [...summary, tail(r.out)]).join('\n'));
  }
}

// spec lock — judged from the merge base, not --since, so an edit made in an earlier round counts
const lockBase = tryGit('merge-base', 'HEAD', 'origin/main') || base;
const specEdits = lockBase
  ? git('diff', '--name-status', '--diff-filter=MDR', lockBase, 'HEAD', '--', '.claude/done/')
      .split('\n')
      .filter(Boolean)
  : [];
if (specEdits.length)
  add(
    'spec-lock',
    ALLOW_SPEC_EDIT ? 'warn' : 'fail',
    `task specs are the HIC's acceptance, not the task's — revert these:\n${specEdits.join('\n')}`,
  );
else add('spec-lock', 'pass', 'no existing task spec changed');

// task spec
const commonDir = git('rev-parse', '--path-format=absolute', '--git-common-dir');
const primary = dirname(commonDir);
const specRel = `.claude/done/${branch}.json`;
const mainSpec = tryGit('show', `origin/main:${specRel}`);
const localSpec = [join(primary, specRel), join(top, specRel)].find((p) => existsSync(p));
const specPath = mainSpec !== null ? `origin/main:${specRel}` : localSpec;
if (specPath) {
  let spec;
  try {
    spec = JSON.parse(mainSpec !== null ? mainSpec : readFileSync(localSpec, 'utf8'));
  } catch (e) {
    add('spec', 'fail', `${specPath}: invalid JSON (${e.message})`);
  }
  for (const c of spec?.checks || []) {
    const r = run('bash', ['-c', c.run], { cwd: top, timeout: 15 * 60 * 1000 });
    add(`spec: ${c.name}`, r.ok ? 'pass' : 'fail', r.ok ? '' : tail(r.out || `exit ${r.status}`));
  }
} else {
  add('spec', 'warn', `no task spec at ${specRel} — only generic checks ran`);
}

const done = !results.some((r) => r.status === 'fail');
const head = `${git('rev-parse', '--short', 'HEAD')} ${branch}`;

if (JSON_OUT) {
  console.log(JSON.stringify({ done, head, spec: specPath || null, results }, null, 2));
} else {
  const icon = { pass: 'PASS', fail: 'FAIL', warn: 'WARN' };
  console.log(`agent-done-gate — ${head}${FULL ? ' (full)' : ''}`);
  for (const r of results) {
    console.log(`  ${icon[r.status]}  ${r.name}`);
    if (r.detail && r.status !== 'pass') console.log(r.detail.replace(/^/gm, '        '));
  }
  console.log(
    done ? 'DONE — every check passed.' : 'NOT DONE — fix every FAIL above before reporting.',
  );
}
process.exit(done ? 0 : 1);

// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-25
// Audit trail: git log -- scripts/poisoned-tree-fixture-guard.mjs
// INCIDENT GUARD (2026-08-25 bare-flip investigation).
// Every fixture git call MUST go through here. Guarantees:
//   1. Leaked GIT_* environment -> refuse BEFORE any git invocation.
//   2. Spawned git processes get a scrubbed environment (no GIT_* inheritance).
//   3. Every call targets a registered sandbox root or the read-only canary.
//   4. A sandbox root is only ever a CANONICAL /tmp/ptg-* directory that this
//      process created itself: exists, empty at registration, not a symlink,
//      and not the live repo's or any linked worktree's git directory.
import { execFileSync } from 'node:child_process';
import { lstatSync, readdirSync, realpathSync, statSync } from 'node:fs';

const GIT_ENV_KEYS = ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_CONFIG_GLOBAL', 'GIT_CONFIG_SYSTEM', 'GIT_CONFIG_COUNT', 'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES'];

// Scrubbed env for every spawned git process — never inherit GIT_* state.
export const CLEAN_GIT_ENV = Object.fromEntries(
  Object.entries(process.env).filter(([k]) => !k.startsWith('GIT_'))
);

export function findLeakedGitEnv(env = process.env) {
  return GIT_ENV_KEYS.filter((k) => env[k] !== undefined);
}

// Throws before any git call when the ambient environment leaks git state.
export function assertCleanGitEnv(env = process.env) {
  const leaked = findLeakedGitEnv(env);
  if (leaked.length) {
    const detail = leaked.map((k) => `${k}=${JSON.stringify(env[k])}`).join(' ');
    throw new Error(`FATAL: leaked git environment refuses fixture execution: ${detail} — unset these or fix the caller`);
  }
}

function liveGitDirs() {
  // Resolve the live repository's shared git dir + every linked worktree's
  // gitdir from the CURRENT checkout. Registration refuses all of them.
  const out = new Set();
  try {
    const common = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { env: CLEAN_GIT_ENV, encoding: 'utf8' }).trim();
    out.add(realpathSync(common));
    const wtDir = join(common, 'worktrees');
    for (const name of readdirSync(wtDir)) out.add(realpathSync(join(wtDir, name)));
  } catch {
    // outside a repo (unit tests): nothing extra to deny
  }
  return out;
}

let sandboxRoots = []; // canonical /tmp/ptg-* dirs THIS process created (rw)
let readOnlyRoots = []; // canary repos: allowed target, never written by fixtures

export function registerSandboxRoot(rootPath) {
  if (!rootPath || typeof rootPath !== 'string') {
    throw new Error(`FATAL: sandbox root must be a non-empty absolute string, got ${JSON.stringify(rootPath)}`);
  }
  let real;
  try {
    real = realpathSync(rootPath);
  } catch {
    throw new Error(`FATAL: sandbox root does not exist: ${rootPath}`);
  }
  // Canonical form only: a real /tmp/ptg-* directory — no symlink aliases,
  // no prefix tricks, no other locations.
  if (lstatSync(real).isSymbolicLink()) {
    throw new Error(`FATAL: sandbox root must not be a symlink: ${real}`);
  }
  if (!(real.startsWith('/tmp/ptg-') && statSync(real).isDirectory())) {
    throw new Error(`FATAL: sandbox root is not a canonical /tmp/ptg-* directory: ${real}`);
  }
  if (readdirSync(real).length > 0) {
    throw new Error(`FATAL: sandbox root must be empty at registration (freshly created): ${real}`);
  }
  for (const gitDir of liveGitDirs()) {
    if (real === gitDir || real.startsWith(gitDir + '/') || gitDir.startsWith(real + '/')) {
      throw new Error(`FATAL: sandbox root collides with a live git directory (${gitDir}): ${real}`);
    }
  }
  sandboxRoots.push(real);
  return real;
}

export function registerReadOnlyRoot(rootPath) {
  readOnlyRoots.push(realpathSync(rootPath));
}

// Refuses relative paths, empty paths, missing paths, symlinks, and anything
// outside the registered roots. Must run before every git invocation.
export function guardCwd(cwd) {
  if (!cwd || typeof cwd !== 'string' || !cwd.startsWith('/')) {
    throw new Error(`FATAL: refusing non-absolute/empty git cwd: ${JSON.stringify(cwd)}`);
  }
  let real;
  try {
    real = realpathSync(cwd);
  } catch {
    throw new Error(`FATAL: refusing git call with unresolvable cwd: ${cwd}`);
  }
  const ok =
    sandboxRoots.some((r) => real === r || real.startsWith(r + '/')) ||
    readOnlyRoots.some((r) => real === r || real.startsWith(r + '/'));
  if (!ok) {
    throw new Error(`FATAL: refusing git call outside fixture sandbox: ${cwd} -> ${real}`);
  }
  return real;
}

// Test-only: reset registrations between negative-test cases.
export function _resetRegistrations() {
  sandboxRoots = [];
  readOnlyRoots = [];
}

// The only sanctioned way for fixtures to run git.
export function gx(cwd, ...args) {
  guardCwd(cwd);
  return execFileSync('git', args, { cwd, env: CLEAN_GIT_ENV, encoding: 'utf8' }).trim();
}

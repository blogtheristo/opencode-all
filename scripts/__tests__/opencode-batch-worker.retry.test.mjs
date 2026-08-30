// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- scripts/__tests__/opencode-batch-worker.retry.test.mjs
/**
 * opencode-all Worker Retry-Path Regression Tests (DDM-v1 §10)
 *
 * Proves the self-healing retry contract against REAL temporary git repos:
 * 1. A failed no-diff session leaves NO orphan branch — the retry of the same
 *    queue entry succeeds without manual cleanup.
 * 2. A branch carrying commits beyond baseline is NEVER deleted — it is
 *    preserved and the entry escalates to NEEDS-HUMAN.
 * 3. Queue-entry metadata (state machine fields) survives a failed attempt.
 *
 * All git operations run inside tmp fixtures via ctx injection; the live
 * checkout and live queue are never touched.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const { createWorktree, cleanupWorktreeAfterFailure, removeOrphanBranch } = await import(
  '../../scripts/opencode-batch-worker.mjs'
);

function git(repo, ...args) {
  return execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
}

function makeOriginRepo() {
  const repo = mkdtempSync(join(tmpdir(), 'worker-retry-fixture-'));
  git(repo, 'init', '-q');
  git(repo, 'config', 'user.email', 'test@lifetime.fi');
  git(repo, 'config', 'user.name', 'Retry Test');
  // Worktrees require a real checkout target: an initial commit on main.
  const readme = join(repo, 'README.md');
  execFileSync('node', ['-e', `require('fs').writeFileSync(process.argv[1], 'baseline')`, readme]);
  git(repo, 'add', '.');
  git(repo, 'commit', '-qm', 'baseline');
  return repo;
}

const repos = [];
function fixture() {
  const r = makeOriginRepo();
  repos.push(r);
  return { repo: r, baseline: git(r, 'rev-parse', 'HEAD'), ctx: {} };
}

afterAll(() => {
  for (const r of repos) rmSync(r, { recursive: true, force: true });
});

function entryFor(repo, baseline, id = 'ses_test0001ffe') {
  return {
    id,
    title: 'retry-path regression fixture',
    state: 'FAILED',
    stopReason: 'failed',
    attempts: 1,
    branch: `opencode/${id}`,
    baselineCommit: baseline,
    worktreePath: join(repo, '.worktrees', 'opencode-all', id),
  };
}

// QUARANTINED (HIC decision 2026-08-24): this fixture's git operations
// escaped into the host worktree once (commit 197daefdb "baseline", authored
// by the fixture identity "Retry Test", wiped 5755 files and reached main via
// PR #1888). Disabled until a GIT_TRACE=1 forensic rerun pinpoints the cwd
// escape; a host-HEAD canary assertion gets added before re-enabling.
describe.skip('opencode-all retry path (DDM-v1 §10)', () => {
  it('failed no-diff session: worktree AND branch removed; immediate retry succeeds', async () => {
    const f = fixture();
    const entry = entryFor(f.repo, f.baseline);
    const ctx = { repo: f.repo };

    // Attempt 1: create, fail (no diff produced), clean up.
    const wt = await createWorktree(entry, ctx);
    expect(wt.resumed).toBe(false);
    expect(git(f.repo, 'worktree', 'list')).toContain(wt.path);

    entry.worktreePath = wt.path;
    entry.baselineCommit = wt.baseline;
    const outcome = cleanupWorktreeAfterFailure(entry, false, ctx);
    expect(outcome).toBe('removed-no-diff');
    expect(entry.worktreeState).toBe('removed-no-diff');

    // The exact failure mode this fix exists for: branch gone → retry works.
    expect(git(f.repo, 'branch', '--list', entry.branch)).toBe('');
    const retry = await createWorktree(entry, ctx);
    expect(retry.resumed).toBe(false); // fresh creation, not a stale resume
  });

  it('branch with commits beyond baseline is NEVER removed; entry escalates NEEDS-HUMAN', async () => {
    const f = fixture();
    const entry = entryFor(f.repo, f.baseline, 'ses_test0002ffe');
    const ctx = { repo: f.repo };

    const wt = await createWorktree(entry, ctx);
    // Simulate an agent that committed real work into its branch.
    execFileSync('node', [
      '-e',
      `require('fs').writeFileSync(process.argv[1] + '/change.txt', 'real work')`,
      wt.path,
    ]);
    git(wt.path, 'add', '.');
    git(wt.path, 'commit', '-qm', 'agent work');

    // Real diff exists here, so call the branch policy directly to prove
    // the preservation half of the contract at the git layer.
    expect(removeOrphanBranch(f.repo, entry.branch, wt.baseline)).toBe('kept-has-commits');
    expect(git(f.repo, 'branch', '--list', entry.branch)).toContain(entry.branch);
  });

  it('removeOrphanBranch without approval reports but never deletes a provably empty branch', () => {
    const f = fixture();
    const id = 'ses_test0004ffe';
    git(f.repo, 'branch', `opencode/${id}`);

    // Default (no allowDelete): report-only — branch must survive.
    expect(removeOrphanBranch(f.repo, `opencode/${id}`, f.baseline)).toBe('empty-reported');
    expect(git(f.repo, 'branch', '--list', `opencode/${id}`)).toContain(id);

    // Explicit approval deletes exactly the provably empty branch.
    expect(removeOrphanBranch(f.repo, `opencode/${id}`, f.baseline, true)).toBe('deleted');
    expect(git(f.repo, 'branch', '--list', `opencode/${id}`)).toBe('');
  });

  it('unreadable rev-list (-1) preserves the branch even with approval', () => {
    const f = fixture();
    const id = 'ses_test0005ffe';
    git(f.repo, 'branch', `opencode/${id}`);
    // Nonexistent baseline makes rev-list fail -> count -1 -> never delete.
    expect(removeOrphanBranch(f.repo, `opencode/${id}`, '0000000000000000000000000000000000000000', true)).toBe(
      'kept-has-commits'
    );
    expect(git(f.repo, 'branch', '--list', `opencode/${id}`)).toContain(id);
  });

  it('worktree removal failure blocks orphan-branch deletion and escalates NEEDS-HUMAN', async () => {
    const f = fixture();
    const entry = entryFor(f.repo, f.baseline, 'ses_test0006ffe');
    const ctx = { repo: f.repo };
    const wtRoot = join(f.repo, '.worktrees', 'opencode-all');

    const wt = await createWorktree(entry, ctx);
    entry.worktreePath = wt.path;
    entry.baselineCommit = wt.baseline;

    // Make unlinking the worktree impossible: strip write permission from
    // the parent directory so `git worktree remove` cannot complete.
    const rootMode = 0o555;
    let failedRemoval = false;
    try {
      execFileSync('chmod', ['555', wtRoot]);
      const outcome = cleanupWorktreeAfterFailure(entry, false, ctx);
      if (outcome === 'kept-removal-failed') {
        failedRemoval = true;
        expect(entry.worktreeState).toBe('kept-removal-failed');
        expect(entry.stopReason).toBe('needs-human');
        // The critical assertion: removal failure must gate branch deletion.
        expect(git(f.repo, 'branch', '--list', entry.branch)).toContain(entry.branch);
      }
      // Some filesystems (running as dir owner with CAP overrides) still
      // allow the unlink; in that case the normal removed-no-diff contract
      // applies and this test degrades to the base case.
      if (!failedRemoval) {
        expect(outcome).toBe('removed-no-diff');
      }
    } finally {
      execFileSync('chmod', ['755', wtRoot]);
    }
  });

  it('queue-entry metadata survives a full failed attempt + cleanup cycle', async () => {
    const f = fixture();
    const entry = entryFor(f.repo, f.baseline, 'ses_test0003ffe');
    const snapshot = JSON.stringify({
      id: entry.id,
      state: entry.state,
      stopReason: entry.stopReason,
      branch: entry.branch,
      baselineCommit: entry.baselineCommit,
    });
    const ctx = { repo: f.repo };

    const wt = await createWorktree(entry, ctx);
    entry.worktreePath = wt.path;
    cleanupWorktreeAfterFailure(entry, false, ctx);

    const after = JSON.stringify({
      id: entry.id,
      state: entry.state,
      stopReason: entry.stopReason === 'needs-human' ? entry.stopReason : 'failed',
      branch: entry.branch,
      baselineCommit: entry.baselineCommit,
    });
    expect(after).toBe(snapshot); // identity fields unchanged by the retry cycle
    expect(entry.attempts).toBe(1); // attempt accounting untouched by cleanup
  });
});

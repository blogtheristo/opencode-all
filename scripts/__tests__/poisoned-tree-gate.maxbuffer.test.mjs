// Evidence: Tool=Claude Code Model=undisclosed-in-source (see commit trailer) Agent=claude Date=2026-09-10
// Audit trail: git log -- scripts/__tests__/poisoned-tree-gate.maxbuffer.test.mjs
/**
 * P0 must not mistake a large repository for a corrupt one.
 *
 * `execFileSync` caps stdout at 1 MiB by default and throws ENOBUFS past it.
 * P0 ran `git rev-list --objects <sha>` through the shared `gx` helper, which
 * silently ignored the third argument — so P0's own `{maxBuffer: 64 MiB}` never
 * took effect. On any repo whose object walk outgrew 1 MiB, a perfectly
 * readable commit was reported as:
 *
 *     P0 object graph unreadable at <sha>
 *
 * which is a BLOCK. It first surfaced on PR #1991, the change that made the
 * gate execute at all: the dws6 checkout is ~7,150 tracked files and full
 * history clears 1 MiB comfortably. It could not be reproduced against a
 * shallow clone, where the walk stops early and stays just under the cap.
 *
 * The fixture below is sized so `rev-list --objects` exceeds 1 MiB, and asserts
 * both halves: the old buffered call really does throw here, and P0 passes.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertCleanGitEnv, gx, registerSandboxRoot } from '../poisoned-tree-fixture-guard.mjs';

assertCleanGitEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const { validateCommit, listTree } = await import(join(__dirname, '..', 'poisoned-tree-gate.mjs'));

// 7,000 files with ~110-char paths puts `rev-list --objects` just over 1 MiB —
// the same order of magnitude as the real repo, and cheap to build (~1s).
const FILE_COUNT = 7000;
const PAD = 'x'.repeat(100);

let repo;
let sha;

beforeAll(() => {
  repo = mkdtempSync(join(tmpdir(), 'ptg-maxbuf-'));
  registerSandboxRoot(repo);
  gx(repo, 'init', '-q', '-b', 'main');
  gx(repo, 'config', 'user.email', 'dev@lifetime.fi');
  gx(repo, 'config', 'user.name', 'MaxBuffer Fixture');
  mkdirSync(join(repo, 'd'), { recursive: true });
  for (let i = 0; i < FILE_COUNT; i++) {
    writeFileSync(join(repo, 'd', `${String(i).padStart(6, '0')}-${PAD}.txt`), String(i));
  }
  gx(repo, 'add', '-A');
  gx(repo, 'commit', '-qm', 'base');
  sha = gx(repo, 'rev-parse', 'HEAD');
}, 120_000);

afterAll(() => rmSync(repo, { recursive: true, force: true }));

describe('P0 on a repository larger than execFileSync default buffer', () => {
  it('the fixture really does overflow the 1 MiB default (guards the guard)', () => {
    expect(() =>
      execFileSync('git', ['rev-list', '--objects', sha], { cwd: repo, encoding: 'utf8' }),
    ).toThrow(/ENOBUFS|maxBuffer/i);
  });

  it('validateCommit passes — a large object graph is not an unreadable one', () => {
    expect(validateCommit(repo, sha)).toBeNull();
  });

  it('listTree reads every entry of a large tree', () => {
    expect(listTree(repo, sha)).toHaveLength(FILE_COUNT);
  });

  it('still fails closed on a genuinely absent commit', () => {
    expect(validateCommit(repo, 'd'.repeat(40))).toMatch(/unreadable/);
  });
});

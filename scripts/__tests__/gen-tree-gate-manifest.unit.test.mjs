// Evidence: Tool=Claude Code Model=undisclosed-in-source (see commit trailer) Agent=claude Date=2026-09-10
// Audit trail: git log -- scripts/__tests__/gen-tree-gate-manifest.unit.test.mjs
/**
 * P4 manifest generator tests.
 *
 * The gate's P4 manifest is bound to the base commit, so it must be generated
 * per evaluation rather than committed. The property that makes that safe is
 * that the ROSTER is read from the BASE TREE: a pull request must not be able
 * to widen or empty its own critical-file allowlist. These tests pin that, plus
 * the fail-closed branches — a malformed roster must never silently degrade to
 * "no critical files".
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertCleanGitEnv, gx, registerSandboxRoot } from '../poisoned-tree-fixture-guard.mjs';

assertCleanGitEnv(); // refuse before any git call if the env leaks git state

const __dirname = dirname(fileURLToPath(import.meta.url));
const { generate, loadRoster } = await import(join(__dirname, '..', 'gen-tree-gate-manifest.mjs'));
const { loadManifest } = await import(join(__dirname, '..', 'poisoned-tree-gate.mjs'));

const ROSTER = '.githooks/critical-files.roster.json';

/** Repo with a base commit; `roster` (if given) is committed at the base. */
function makeRepo(roster) {
  const repo = mkdtempSync(join(tmpdir(), 'ptg-genman-'));
  registerSandboxRoot(repo);
  gx(repo, 'init', '-q', '-b', 'main');
  gx(repo, 'config', 'user.email', 'dev@lifetime.fi');
  gx(repo, 'config', 'user.name', 'Manifest Fixture');
  mkdirSync(join(repo, '.githooks'), { recursive: true });
  writeFileSync(join(repo, 'keep.txt'), 'keep\n');
  writeFileSync(join(repo, 'guarded.txt'), 'original\n');
  if (roster !== undefined) writeFileSync(join(repo, ROSTER), JSON.stringify(roster));
  gx(repo, 'add', '.');
  gx(repo, 'commit', '-qm', 'base');
  return { repo, base: gx(repo, 'rev-parse', 'HEAD') };
}

let roots = [];
beforeAll(() => {
  roots = [];
});
afterAll(() => roots.forEach((r) => rmSync(r, { recursive: true, force: true })));

describe('loadRoster', () => {
  it('treats an absent roster as an empty allowlist, not an error', () => {
    const { repo, base } = makeRepo(undefined);
    roots.push(repo);
    expect(loadRoster(repo, base)).toEqual({ paths: [] });
  });

  it('fails closed on a roster that is not valid JSON', () => {
    const { repo, base } = makeRepo();
    roots.push(repo);
    writeFileSync(join(repo, ROSTER), '{ not json');
    gx(repo, 'add', '.');
    gx(repo, 'commit', '-qm', 'bad roster');
    const res = loadRoster(repo, gx(repo, 'rev-parse', 'HEAD'));
    expect(res.error).toMatch(/not valid JSON/);
    expect(res.paths).toBeUndefined();
    void base;
  });

  it('fails closed on a roster with the wrong schema', () => {
    const { repo, base } = makeRepo({ files: ['a.txt'] });
    roots.push(repo);
    expect(loadRoster(repo, base).error).toMatch(/schema invalid/);
  });

  it('fails closed on an unsorted roster', () => {
    const { repo, base } = makeRepo({ paths: ['keep.txt', 'guarded.txt'] });
    roots.push(repo);
    expect(loadRoster(repo, base).error).toMatch(/not deterministically ordered/);
  });
});

describe('generate', () => {
  it('emits a manifest the gate accepts at that base', () => {
    const { repo, base } = makeRepo({ paths: ['guarded.txt'] });
    roots.push(repo);
    const { manifest } = generate(repo, base);
    expect(manifest.version).toBe(1);
    expect(manifest.baseline).toBe(base);
    expect(manifest.files).toHaveLength(1);

    const out = join(repo, 'generated.manifest');
    writeFileSync(out, JSON.stringify(manifest));
    const loaded = loadManifest(repo, out, base);
    expect(loaded.error).toBeUndefined();
    expect(loaded.entries[0].path).toBe('guarded.txt');
  });

  it('reads the roster from the base tree, so a later commit cannot empty it', () => {
    const { repo, base } = makeRepo({ paths: ['guarded.txt'] });
    roots.push(repo);
    // Simulate a PR that empties its own allowlist in the working tree/head.
    writeFileSync(join(repo, ROSTER), JSON.stringify({ paths: [] }));
    gx(repo, 'add', '.');
    gx(repo, 'commit', '-qm', 'attempt to empty the allowlist');

    // Generated against the BASE, the guarded path is still enforced.
    const { manifest } = generate(repo, base);
    expect(manifest.files.map((f) => f.path)).toEqual(['guarded.txt']);
  });

  it('fails closed when a rostered path is absent from the base tree', () => {
    const { repo, base } = makeRepo({ paths: ['never-existed.txt'] });
    roots.push(repo);
    expect(generate(repo, base).error).toMatch(/missing from base tree/);
  });

  it('fails closed when a rostered path is a directory rather than a file', () => {
    const { repo, base } = makeRepo({ paths: ['.githooks'] });
    roots.push(repo);
    expect(generate(repo, base).error).toMatch(/not a regular file/);
  });
});

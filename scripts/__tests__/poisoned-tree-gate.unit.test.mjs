// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- scripts/__tests__/poisoned-tree-gate.unit.test.mjs
/**
 * Poisoned-Tree Gate — boundary unit tests (v3, sandbox-only).
 *
 * Covers the ambiguous edges before the broad matrix:
 * malformed stdin, multi-ref pushes, delete-ref skip, non-FF default block,
 * manifest baseline binding, signer-to-approver identity binding.
 * Every ambiguous case resolves to a BLOCK decision — never an exception.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
// INCIDENT GUARD (2026-08-25 bare-flip): this spec's unguarded git calls once
// committed to the host worktree as "Unit Fixture" (commits A/B/C in the
// push-gate worktree reflog). All git access now goes through the sandbox
// guard — leaked-env refusal, canonical /tmp/ptg-* roots, env scrubbing.
import {
  CLEAN_GIT_ENV,
  assertCleanGitEnv,
  guardCwd,
  gx,
  registerSandboxRoot,
} from '../poisoned-tree-fixture-guard.mjs';

assertCleanGitEnv(); // refuse before any git call if the env leaks git state

const __dirname = dirname(fileURLToPath(import.meta.url));
const GATE = join(__dirname, '..', 'poisoned-tree-gate.mjs');
const {
  evaluate,
  runPrePushLines,
  makeKeyPair,
  signArtifact,
  canonicalBytes,
  exportKeyPem,
  keyIdFromPem,
} = await import(GATE);

const ZERO = '0'.repeat(40);
let root;
beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'ptg-unit-'));
  registerSandboxRoot(root);
});
afterAll(() => rmSync(root, { recursive: true, force: true }));

/** One repo: main@A; branch dev adds C; main advances to B (divergence). */
function makeDivergent() {
  const repo = mkdtempSync(join(tmpdir(), 'ptg-div-'));
  registerSandboxRoot(repo);
  gx(repo, 'init', '-q', '-b', 'main');
  gx(repo, 'config', 'user.email', 'dev@lifetime.fi');
  gx(repo, 'config', 'user.name', 'Unit Fixture');
  writeFileSync(join(repo, 'a.txt'), 'A\n');
  gx(repo, 'add', '.');
  gx(repo, 'commit', '-qm', 'A');
  const A = gx(repo, 'rev-parse', 'HEAD');
  gx(repo, 'switch', '-c', 'dev');
  writeFileSync(join(repo, 'c.txt'), 'C\n');
  gx(repo, 'add', '.');
  gx(repo, 'commit', '-qm', 'C');
  const C = gx(repo, 'rev-parse', 'HEAD');
  gx(repo, 'switch', 'main');
  writeFileSync(join(repo, 'b.txt'), 'B\n');
  gx(repo, 'add', '.');
  gx(repo, 'commit', '-qm', 'B');
  const B = gx(repo, 'rev-parse', 'HEAD');
  return { repo, A, B, C };
}

function emitManifestAt(repo, sha, paths) {
  const files = paths.map((p) => {
    const line = gx(repo, 'ls-tree', sha, '--', p);
    if (!line) return null;
    const [meta] = line.split('\t');
    const [mode, , oid] = meta.split(/\s+/);
    return { path: p, type: 'blob', mode, size: parseInt(gx(repo, 'cat-file', '-s', oid), 10), oid };
  }).filter(Boolean);
  files.sort((a, b) => (a.path < b.path ? -1 : 1));
  return { version: 1, baseline: sha, files };
}

describe('poisoned-tree gate — boundary units', () => {
  it('malformed stdin lines resolve to BLOCK with no exception', () => {
    for (const bad of ['nonsense', 'a b c', 'refs/heads/x nothex refs/heads/y 0'.replace('0', ZERO.slice(0, 3))]) {
      const r = runPrePushLines([bad], { repo: root });
      expect(r).toHaveLength(1);
      expect(r[0].decision).toBe('block');
      expect(r[0].reasons[0]).toMatch(/malformed stdin line/);
    }
  });

  it('multi-ref push evaluates each line and aggregates decisions', () => {
    const { repo } = makeDivergent();
    const good = emitManifestAt(repo, 'HEAD', ['a.txt']);
    const mPath = join(root, `m-${Math.random().toString(36).slice(2, 7)}.json`);
    writeFileSync(mPath, JSON.stringify(good));
    const cfg = { repo, manifestPath: mPath };
    const head = gx(repo, 'rev-parse', 'HEAD');
    const lines = [
      `refs/heads/main ${head} refs/heads/main ${ZERO}`, // new branch w/o baseline -> would block
      `refs/heads/x ${ZERO} refs/heads/gone ${ZERO}`, // deletion line: skipped
      'garbage line',
    ];
    const r = runPrePushLines(lines, cfg);
    expect(r).toHaveLength(2); // deletion skipped, garbage caught
    expect(r.every((x) => x.decision === 'block')).toBe(true); // ambiguous => exit-1 semantics
  });

  it('delete-ref (zero local sha) is skipped entirely by this gate', () => {
    const r = runPrePushLines([`refs/heads/x ${ZERO} refs/heads/x ${ZERO}`], { repo: root });
    expect(r).toHaveLength(0);
  });

  it('non-fast-forward blocks by default; approved-baseline path is explicit', () => {
    const { repo, A, B, C } = makeDivergent();
    // Push dev(C) against main(B): merge-base A != B -> non-FF -> BLOCK.
    const blocked = evaluate({ repo, localSha: C, remoteRef: 'refs/heads/main', remoteSha: B });
    expect(blocked.decision).toBe('block');
    expect(blocked.reasons.join(' ')).toMatch(/non-fast-forward/);

    // Explicitly approved baseline (the merge-base) is the only way through.
    const mPath = join(root, `m-ff-${Math.random().toString(36).slice(2, 7)}.json`);
    writeFileSync(mPath, JSON.stringify(emitManifestAt(repo, A, ['a.txt'])));
    const allowed = evaluate({
      repo, localSha: C, remoteRef: 'refs/heads/main', remoteSha: B, manifestBaseline: A,
      manifestPath: mPath,
    });
    expect(allowed.decision).toBe('allow');
  });

  it('manifest is bound to the resolved base sha — wrong baseline fails closed', () => {
    const { repo, A, B } = makeDivergent();
    // Manifest generated at B, but pushed history resolves base A.
    const mPath = join(root, `m-bind-${Math.random().toString(36).slice(2, 7)}.json`);
    writeFileSync(mPath, JSON.stringify(emitManifestAt(repo, B, ['b.txt'])));
    const res = evaluate({
      repo, localSha: A, remoteRef: 'refs/heads/new', remoteSha: ZERO,
      manifestBaseline: A, manifestPath: mPath,
    });
    expect(res.decision).toBe('block');
    expect(res.reasons.join(' ')).toMatch(/baseline .* does not match resolved base/);
  });

  it('signer key must belong to the claimed approver via registry binding', () => {
    const reviewer = makeKeyPair();
    const reviewerId = keyIdFromPem(exportKeyPem(reviewer.publicKey));
    const oldSha = 'a'.repeat(40);
    const newSha = 'b'.repeat(40);
    const ref = 'refs/heads/main';

    // Each case gets its OWN approvals dir: a leftover valid artifact must
    // never satisfy a different negative case.
    function mkCase({ registryApprover, artifactApprover, signerPriv }) {
      const keysDir = join(root, `keys-${Math.random().toString(36).slice(2, 7)}`);
      const approvalsDir = join(root, `appr-${Math.random().toString(36).slice(2, 7)}`);
      mkdirSyncFix(keysDir);
      mkdirSyncFix(approvalsDir);
      writeFileSync(join(keysDir, `${reviewerId}.pub`), exportKeyPem(reviewer.publicKey));
      // Registry binds the key-id to EXACTLY one approver identity.
      writeFileSync(join(keysDir, 'registry.json'), JSON.stringify({ [reviewerId]: registryApprover }));
      const art = {
        oldSha, newSha, ref, reason: 'r', approver: artifactApprover,
        expiry: '2027-01-01T00:00:00Z', keyId: reviewerId,
      };
      const bytes = canonicalBytes(art);
      writeFileSync(join(approvalsDir, 'artifact.json'), bytes);
      writeFileSync(join(approvalsDir, 'artifact.json.sig'), signArtifact(signerPriv ?? reviewer.privateKey, bytes) + '\n');
      return { keysDir, approvalsDir };
    }

    // Case A (positive): key registered to reviewer, artifact claims reviewer.
    const a = mkCase({ registryApprover: 'reviewer@lifetime.fi', artifactApprover: 'reviewer@lifetime.fi' });
    const ok = evalFind(a.keysDir, a.approvalsDir, oldSha, newSha, ref, 'dev@lifetime.fi');
    expect(ok.ok).toBe(true);
    expect(ok.approvedBy).toBe('reviewer@lifetime.fi');

    // Case B: valid trusted signature, but artifact claims a DIFFERENT
    // approver than the key's registered owner -> identity binding fails.
    const b = mkCase({ registryApprover: 'reviewer@lifetime.fi', artifactApprover: 'someone.else@lifetime.fi' });
    const mismatch = evalFind(b.keysDir, b.approvalsDir, oldSha, newSha, ref, 'dev@lifetime.fi');
    expect(mismatch.ok).toBe(false);

    // Case C: pusher owns the signing key identity -> structural self-approval rejection.
    const c = mkCase({ registryApprover: 'dev@lifetime.fi', artifactApprover: 'dev@lifetime.fi' });
    const self = evalFind(c.keysDir, c.approvalsDir, oldSha, newSha, ref, 'dev@lifetime.fi');
    expect(self.ok).toBe(false);
    expect(self.reason).toMatch(/registered to the pusher/);
  });

  function evalFind(keysDir, approvalsDir, oldSha, newSha, ref, pusher) {
    const { findApproval } = gateModule;
    return findApproval({ approvalsDir, trustedKeysDir: keysDir, oldSha, newSha, ref, pusherIdentity: pusher });
  }

  function mkdirSyncFix(p) {
    mkdirSync(p, { recursive: true }); // guard: no unscoped process spawns in specs
  }
});

// Shared import handle for helpers used inside describe callbacks above.
const gateModule = await import(GATE);

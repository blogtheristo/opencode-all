// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- scripts/__tests__/poisoned-tree-gate.fixture.test.mjs
/**
 * Poisoned-Tree Gate — sandbox fixture matrix (v3 design, HIC-approved).
 *
 * INDEPENDENCE CONTRACT: every test builds its OWN fixture (bare origin +
 * throwaway clone) and asserts only on that fixture. No test reads state
 * left behind by another. Zero contact with any real remote or real main.
 *
 * What this proves (scoped): catastrophic tree collapse is detected and
 * blocked without approval; the approval path rejects self-approval, wrong
 * signers and ambiguous baselines; gate and fixtures leave the host
 * worktree, HEAD, unrelated refs and live origin untouched.
 * What it does NOT claim: that all corruption is impossible.
 */

import { afterAll, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
// INCIDENT GUARD (2026-08-25 bare-flip investigation): all git access goes
// through the sandbox guard — leaked env refusal, absolute-path assertion,
// GIT_* scrubbing. See scripts/poisoned-tree-fixture-guard.mjs.
import {
  CLEAN_GIT_ENV,
  assertCleanGitEnv,
  findLeakedGitEnv,
  guardCwd,
  gx,
  registerSandboxRoot,
  registerReadOnlyRoot,
} from '../poisoned-tree-fixture-guard.mjs';

assertCleanGitEnv(); // refuse BEFORE any git call if the env leaks git state

const __dirname = dirname(fileURLToPath(import.meta.url));
const GATE = join(__dirname, '..', 'poisoned-tree-gate.mjs');
const {
  evaluate,
  makeKeyPair,
  signArtifact,
  canonicalBytes,
  exportKeyPem,
  keyIdFromPem,
  ZERO_SHA,
} = await import(GATE);

let root;
const hostRepo = '/tmp/opencode/recovery'; // canary target: must never be touched
const hostSnapshot = {
  head: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: hostRepo, env: CLEAN_GIT_ENV, encoding: 'utf8' }).trim(),
  branch: execFileSync('git', ['branch', '--show-current'], { cwd: hostRepo, env: CLEAN_GIT_ENV, encoding: 'utf8' }).trim(),
};
registerReadOnlyRoot(hostRepo); // read-only canary is an allowed gx target
const evidence = { origins: {} }; // origin main shas recorded at creation
const cleanupDirs = [];

function cleanupLater(dir) {
  rmSync(dir, { recursive: true, force: true });
}

afterAll(() => {
  // Finally-path cleanup: runs even if tests failed mid-way. Never throws.
  try {
    for (const d of cleanupDirs) rmSync(d, { recursive: true, force: true });
    if (root) rmSync(root, { recursive: true, force: true });
  } catch (err) {
    console.error('fixture cleanup warning:', err?.message ?? err);
  } finally {
    cleanupDirs.length = 0;
    root = null;
  }
});

/** Independent fixture: bare origin + clone with worker/src/docs/roster. */
function makeFixture({ docs = 40 } = {}) {
  if (!root) {
    root = mkdtempSync(join(tmpdir(), 'ptg-fixture-'));
    registerSandboxRoot(root); // guard: only this subtree may see git calls
  }
  const id = Math.random().toString(36).slice(2, 9);
  const origin = join(root, `origin-${id}.git`);
  const dev = join(root, `dev-${id}`);
  cleanupDirs.push(origin, dev);
  mkdirSync(origin, { recursive: true });
  gx(origin, 'init', '-q', '--bare', '--initial-branch=main');
  evidence.origins[origin] = null;

  const seed = join(root, `seed-${id}`);
  mkdirSync(seed);
  gx(seed, 'init', '-q', '-b', 'main');
  gx(seed, 'config', 'user.email', 'dev@lifetime.fi');
  gx(seed, 'config', 'user.name', 'Dev Fixture');
  mkdirSync(join(seed, 'scripts'), { recursive: true });
  mkdirSync(join(seed, 'src'), { recursive: true });
  mkdirSync(join(seed, 'docs'), { recursive: true });
  mkdirSync(join(seed, '.githooks'), { recursive: true });
  mkdirSync(join(seed, 'protected-dir'), { recursive: true });
  writeFileSync(join(seed, 'package.json'), '{"name":"fixture"}\n');
  writeFileSync(join(seed, 'scripts/opencode-batch-worker.mjs'), '// worker\nexport {};\n');
  writeFileSync(join(seed, 'src/app.ts'), 'export const app = 1;\n');
  writeFileSync(join(seed, 'protected-dir/keep.txt'), 'protected content\n');
  writeFileSync(join(seed, '.githooks/protected-dirs.json'), JSON.stringify({ version: 1, dirs: ['protected-dir'] }));
  for (let i = 0; i < docs; i++) writeFileSync(join(seed, `docs/file-${i}.md`), `doc ${i}\n`);
  gx(seed, 'add', '.');
  gx(seed, 'commit', '-qm', 'base');
  gx(seed, 'remote', 'add', 'origin', origin);
  gx(seed, 'push', '-q', 'origin', 'main');

  guardCwd(root);
  execFileSync('git', ['clone', '-q', origin, dev], { cwd: root, env: CLEAN_GIT_ENV, encoding: 'utf8' });
  gx(dev, 'config', 'user.email', 'dev@lifetime.fi');
  gx(dev, 'config', 'user.name', 'Dev Fixture');

  const baseSha = gx(dev, 'rev-parse', 'HEAD');
  evidence.origins[origin] = gx(origin, 'rev-parse', 'main');
  rmSync(seed, { recursive: true, force: true });

  return {
    id, origin, dev, baseSha,
    manifestAt(paths, sha = baseSha) {
      const p = join(root, `m-${id}-${Math.random().toString(36).slice(2, 7)}.json`);
      writeFileSync(p, JSON.stringify(emitManifestIn(dev, sha, paths)));
      return p;
    },
  };
}

/** Manifest bound to an explicit base sha, read from any repo. */
function emitManifestIn(repo, sha, paths) {
  const files = paths.map((p) => {
    const line = gx(repo, 'ls-tree', sha, '--', p);
    if (!line) throw new Error(`emitManifest: path not in tree: ${p}`);
    const [meta] = line.split('\t');
    const [mode, , oid] = meta.split(/\s+/);
    return { path: p, type: 'blob', mode, size: parseInt(gx(repo, 'cat-file', '-s', oid), 10), oid };
  });
  files.sort((a, b) => (a.path < b.path ? -1 : 1));
  return { version: 1, baseline: sha, files };
}

describe('poisoned-tree gate fixture matrix', () => {
  it('allows a normal fast-forward push (green path)', () => {
    const fx = makeFixture();
    writeFileSync(join(fx.dev, 'docs/note.md'), 'small change\n');
    gx(fx.dev, 'add', '.');
    gx(fx.dev, 'commit', '-qm', 'small change');
    const local = gx(fx.dev, 'rev-parse', 'HEAD');
    const res = evaluate({
      repo: fx.dev, localSha: local, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
      manifestPath: fx.manifestAt(['scripts/opencode-batch-worker.mjs']), maxDeletions: 500,
    });
    expect(res.decision).toBe('allow');
    expect(res.reasons).toHaveLength(0);
  });

  it('blocks parametric tree-collapse (#1888 shape): 100 -> 1; boundary at exactly 10%', () => {
    const mk = (n) => {
      // n = TOTAL tracked blobs: README + (n-1) docs, so the tripwire
      // boundary arithmetic is exact ("10 of 100" really is 10.0%).
      const repo = mkdtempSync(join(tmpdir(), `ptg-n${n}-`));
      registerSandboxRoot(repo); // own temp root — guard-registered like `root`
      gx(repo, 'init', '-q', '-b', 'main');
      gx(repo, 'config', 'user.email', 'dev@lifetime.fi');
      gx(repo, 'config', 'user.name', 'Dev Fixture');
      mkdirSync(join(repo, 'docs'), { recursive: true });
      writeFileSync(join(repo, 'README.md'), 'keep\n');
      for (let i = 0; i < n - 1; i++) writeFileSync(join(repo, `docs/f-${i}.md`), `${i}\n`);
      gx(repo, 'add', '.');
      gx(repo, 'commit', '-qm', 'base');
      return { repo, base: gx(repo, 'rev-parse', 'HEAD') };
    };

    // Collapse 100 -> 1 (models #1888's 6797 -> 1; rule is scale-free)
    const big = mk(100);
    const mBig = join(big.repo, 'm.json');
    writeFileSync(mBig, JSON.stringify(emitManifestIn(big.repo, big.base, ['README.md'])));
    gx(big.repo, 'rm', '-rq', 'docs');
    gx(big.repo, 'commit', '-qam', 'collapse');
    const wiped = gx(big.repo, 'rev-parse', 'HEAD');
    const collapsed = evaluate({
      repo: big.repo, localSha: wiped, remoteRef: 'refs/heads/main', remoteSha: big.base,
      manifestPath: mBig,
    });
    expect(collapsed.decision).toBe('block');
    expect(collapsed.reasons.join(' ')).toMatch(/P2 deletion ratio/);

    // Boundary: deleting exactly 10 of 100 = 10.0% -> tripwire fires (>=)
    const b10 = mk(100);
    const m10 = join(b10.repo, 'm.json');
    writeFileSync(m10, JSON.stringify(emitManifestIn(b10.repo, b10.base, ['README.md'])));
    for (let i = 0; i < 10; i++) gx(b10.repo, 'rm', `-q`, `docs/f-${i}.md`);
    gx(b10.repo, 'commit', '-qam', 'drop ten');
    const atTen = evaluate({
      repo: b10.repo, localSha: gx(b10.repo, 'rev-parse', 'HEAD'), remoteRef: 'refs/heads/main',
      remoteSha: b10.base, manifestPath: m10,
    });
    expect(atTen.decision).toBe('block');
    expect(atTen.reasons.join(' ')).toMatch(/P2/);

    // 9 of 100 = 9% -> tripwire silent (no other violation) -> honest pass
    const b9 = mk(100);
    const m9 = join(b9.repo, 'm.json');
    writeFileSync(m9, JSON.stringify(emitManifestIn(b9.repo, b9.base, ['README.md'])));
    for (let i = 0; i < 9; i++) gx(b9.repo, 'rm', `-q`, `docs/f-${i}.md`);
    gx(b9.repo, 'commit', '-qam', 'drop nine');
    const under = evaluate({
      repo: b9.repo, localSha: gx(b9.repo, 'rev-parse', 'HEAD'), remoteRef: 'refs/heads/main',
      remoteSha: b9.base, manifestPath: m9,
    });
    expect(under.decision).toBe('allow');
  });

  it('mass deletion blocks without approval; valid trusted non-pusher signature allows', () => {
    const fx = makeFixture();
    const mBase = fx.manifestAt(['scripts/opencode-batch-worker.mjs']);
    gx(fx.dev, 'rm', '-rq', 'docs');
    gx(fx.dev, 'commit', '-qam', 'remove docs');
    const wiped = gx(fx.dev, 'rev-parse', 'HEAD');

    const noApproval = evaluate({
      repo: fx.dev, localSha: wiped, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
      manifestPath: mBase, maxDeletions: 10,
    });
    expect(noApproval.decision).toBe('block');
    expect(noApproval.reasons.some((r) => r.startsWith('P2') || r.startsWith('P3'))).toBe(true);

    // Signed artifact from a trusted key registered to a non-pusher reviewer.
    const reviewer = makeKeyPair();
    const reviewerId = keyIdFromPem(exportKeyPem(reviewer.publicKey));
    const keysDir = join(root, `keys-${fx.id}`);
    const approvals = join(root, `appr-${fx.id}`);
    mkdirSync(keysDir, { recursive: true });
    mkdirSync(approvals, { recursive: true });
    writeFileSync(join(keysDir, `${reviewerId}.pub`), exportKeyPem(reviewer.publicKey));
    writeFileSync(join(keysDir, 'registry.json'), JSON.stringify({ [reviewerId]: 'reviewer@lifetime.fi' }));
    const art = {
      oldSha: fx.baseSha, newSha: wiped, ref: 'refs/heads/main',
      reason: 'intentional docs removal', approver: 'reviewer@lifetime.fi',
      expiry: '2027-01-01T00:00:00Z', keyId: reviewerId,
    };
    const bytes = canonicalBytes(art);
    writeFileSync(join(approvals, 'artifact.json'), bytes);
    writeFileSync(join(approvals, 'artifact.json.sig'), signArtifact(reviewer.privateKey, bytes) + '\n');

    const approved = evaluate({
      repo: fx.dev, localSha: wiped, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
      manifestPath: mBase, maxDeletions: 10,
      approvalsDir: approvals, trustedKeysDir: keysDir, pusherIdentity: 'dev@lifetime.fi',
    });
    expect(approved.decision).toBe('allow');
    expect(approved.approvedBy).toBe('reviewer@lifetime.fi');
  });

  it('protected-roster removal: unsigned blocks, trusted non-pusher signature allows', () => {
    const fx = makeFixture();
    const reviewer = makeKeyPair();
    const reviewerId = keyIdFromPem(exportKeyPem(reviewer.publicKey));
    const keysDir = join(root, `keys-${fx.id}-pr`);
    const approvals = join(root, `appr-${fx.id}-pr`);
    mkdirSync(keysDir, { recursive: true });
    mkdirSync(approvals, { recursive: true });
    writeFileSync(join(keysDir, `${reviewerId}.pub`), exportKeyPem(reviewer.publicKey));
    writeFileSync(join(keysDir, 'registry.json'), JSON.stringify({ [reviewerId]: 'reviewer@lifetime.fi' }));

    gx(fx.dev, 'rm', '-rq', 'protected-dir');
    gx(fx.dev, 'commit', '-qam', 'remove protected-dir');
    const afterRemove = gx(fx.dev, 'rev-parse', 'HEAD');

    // Unsigned artifact -> block (P5)
    writeFileSync(
      join(approvals, 'unsigned.json'),
      JSON.stringify({ oldSha: fx.baseSha, newSha: afterRemove, ref: 'refs/heads/main', reason: 'r', approver: 'reviewer@lifetime.fi', expiry: '2027-01-01T00:00:00Z', keyId: reviewerId }),
    );
    const unsigned = evaluate({
      repo: fx.dev, localSha: afterRemove, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
      approvalsDir: approvals, trustedKeysDir: keysDir, pusherIdentity: 'dev@lifetime.fi',
      manifestPath: fx.manifestAt(['scripts/opencode-batch-worker.mjs']),
    });
    expect(unsigned.decision).toBe('block');
    expect(unsigned.reasons.join(' ')).toMatch(/P5|approval/);

    // Signed by trusted non-pusher -> allow
    const artBytes = canonicalBytes(JSON.parse(readFileSync(join(approvals, 'unsigned.json'), 'utf8')));
    writeFileSync(join(approvals, 'unsigned.json.sig'), signArtifact(reviewer.privateKey, artBytes) + '\n');
    const signed = evaluate({
      repo: fx.dev, localSha: afterRemove, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
      approvalsDir: approvals, trustedKeysDir: keysDir, pusherIdentity: 'dev@lifetime.fi',
      manifestPath: fx.manifestAt(['scripts/opencode-batch-worker.mjs']),
    });
    expect(signed.decision).toBe('allow');
    expect(signed.approvedBy).toBe('reviewer@lifetime.fi');
  });

  it('critical-file violations block regardless of ratio: delete, mode flip, type swap', () => {
    const fx = makeFixture();
    const mPath = fx.manifestAt(['scripts/opencode-batch-worker.mjs', 'src/app.ts']);
    const run = () =>
      evaluate({
        repo: fx.dev, localSha: gx(fx.dev, 'rev-parse', 'HEAD'), remoteRef: 'refs/heads/main',
        remoteSha: fx.baseSha, manifestPath: mPath, maxDeletions: 500,
      });

    // Delete critical file (tiny diff — ratio tripwire will NOT fire)
    gx(fx.dev, 'rm', '-q', 'src/app.ts');
    gx(fx.dev, 'commit', '-qam', 'drop app.ts');
    const del = run();
    expect(del.decision).toBe('block');
    expect(del.reasons.join(' ')).toMatch(/missing from pushed tree/);

    // Mode flip on allowlisted file (restored first — previous step deleted it)
    gx(fx.dev, 'checkout', 'HEAD~1', '--', 'src/app.ts');
    chmodSync(join(fx.dev, 'src/app.ts'), 0o755);
    gx(fx.dev, 'add', '.');
    gx(fx.dev, 'commit', '-qm', 'flip mode');
    const modeFlip = run();
    expect(modeFlip.decision).toBe('block');
    expect(modeFlip.reasons.join(' ')).toMatch(/mode changed/);

    // Type swap: replace file with directory of same name
    // (git rm prunes the now-empty src/, so recreate it recursively)
    gx(fx.dev, 'rm', '-qf', 'src/app.ts');
    mkdirSync(join(fx.dev, 'src/app.ts'), { recursive: true });
    writeFileSync(join(fx.dev, 'src/app.ts/inner.txt'), 'now a dir\n');
    gx(fx.dev, 'add', '.');
    gx(fx.dev, 'commit', '-qm', 'type swap');
    const swap = run();
    expect(swap.decision).toBe('block');
    expect(swap.reasons.join(' ')).toMatch(/type changed|missing/);
  });

  it('malformed/truncated manifest fails closed; non-commit sha fails P0', () => {
    const fx = makeFixture();
    const badPath = join(fx.dev, 'bad.manifest');
    writeFileSync(badPath, '{ "files": [ {"path": "scripts/opencode');
    const res = evaluate({
      repo: fx.dev, localSha: fx.baseSha, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
      manifestPath: badPath,
    });
    expect(res.decision).toBe('block');
    expect(res.reasons.join(' ')).toMatch(/truncated or invalid JSON/);

    const blobSha = gx(fx.dev, 'rev-parse', 'HEAD:package.json');
    const p0 = evaluate({
      repo: fx.dev, localSha: blobSha, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
    });
    expect(p0.decision).toBe('block');
    expect(p0.reasons[0]).toMatch(/P0 .*not a commit/);
  });

  it('old-sha contradiction blocks; new branch requires reachable cycle-manifest baseline', () => {
    const fx = makeFixture();
    // TOCTOU-scoped detection: stdin old sha contradicts locally recorded value
    const contradiction = evaluate({
      repo: fx.dev, localSha: fx.baseSha, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
      expectedOldSha: '1'.repeat(40),
    });
    expect(contradiction.decision).toBe('block');
    expect(contradiction.reasons.join(' ')).toMatch(/contradicts locally recorded/);

    const noBaseline = evaluate({
      repo: fx.dev, localSha: fx.baseSha, remoteRef: 'refs/heads/new-branch', remoteSha: ZERO_SHA,
    });
    expect(noBaseline.decision).toBe('block');
    expect(noBaseline.reasons.join(' ')).toMatch(/cycle-manifest baseline/);

    const withBaseline = evaluate({
      repo: fx.dev, localSha: fx.baseSha, remoteRef: 'refs/heads/new-branch', remoteSha: ZERO_SHA,
      manifestBaseline: fx.baseSha,
      manifestPath: fx.manifestAt(['scripts/opencode-batch-worker.mjs']),
    });
    expect(withBaseline.decision).toBe('allow');
  });

  it('CLI wrapper: stdin pre-push contract, exit 0 on allow / 1 on block', () => {
    const fx = makeFixture();
    const cfgPath = join(root, `cli-${fx.id}.json`);
    writeFileSync(cfgPath, JSON.stringify({
      localSha: fx.baseSha, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
      manifestPath: fx.manifestAt(['scripts/opencode-batch-worker.mjs']),
    }));
    const stdinLine = `refs/heads/main ${fx.baseSha} refs/heads/main ${fx.baseSha}\n`;
    let out = '';
    try {
      out = execFileSync('node', [GATE, '--config', cfgPath], {
        cwd: fx.dev, encoding: 'utf8', input: stdinLine,
      }).trim();
    } catch (e) {
      out = String(e.stdout ?? '');
      expect(e.status).toBe(1);
    }
    expect(out).toContain('"decision":"allow"');
  });

  it('sub-threshold deletion (1 doc) passes the tripwire — no full-safety claim', () => {
    // docs=15 → 21 tracked blobs; deleting 1 is ~4.8%, safely under the 10% tripwire.
    const fx = makeFixture({ docs: 15 });
    const mBase = fx.manifestAt(['scripts/opencode-batch-worker.mjs']);
    gx(fx.dev, 'rm', '-q', 'docs/file-0.md');
    gx(fx.dev, 'commit', '-qam', 'drop one doc');
    const res = evaluate({
      repo: fx.dev, localSha: gx(fx.dev, 'rev-parse', 'HEAD'), remoteRef: 'refs/heads/main',
      remoteSha: fx.baseSha, manifestPath: mBase, maxDeletions: 500,
    });
    expect(res.decision).toBe('allow');
    expect(res.reasons).toHaveLength(0);
  });

  it('corrupt/unreadable object graph fails closed', () => {
    const fx = makeFixture();
    const treeOid = gx(fx.dev, 'rev-parse', 'HEAD^{tree}');
    const objPath = join(fx.dev, '.git', 'objects', treeOid.slice(0, 2), treeOid.slice(2));
    chmodSync(objPath, 0o644); // loose objects are read-only by default
    writeFileSync(objPath, 'CORRUPTED');
    const res = evaluate({
      repo: fx.dev, localSha: fx.baseSha, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
    });
    expect(res.decision).toBe('block');
  });

  it('shallow clone cannot relate to older base -> explicit BLOCK (documented safe result)', () => {
    const fx = makeFixture();
    const shallow = join(root, `shallow-${fx.id}`);
    guardCwd(root);
    execFileSync('git', ['clone', '-q', '--depth', '1', `file://${fx.origin}`, shallow], { cwd: root, env: CLEAN_GIT_ENV, encoding: 'utf8' });
    const head = gx(shallow, 'rev-parse', 'HEAD');
    const res = evaluate({
      repo: shallow, localSha: head, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
    });
    expect(res.decision).toBe('block');
    rmSync(shallow, { recursive: true, force: true });
  });

  it('detached HEAD caller: stdin-based run works with zero working-tree assumptions', () => {
    const fx = makeFixture();
    const cfgPath = join(root, `cli-detach-${fx.id}.json`);
    writeFileSync(cfgPath, JSON.stringify({
      localSha: fx.baseSha, remoteRef: 'refs/heads/main', remoteSha: fx.baseSha,
      manifestPath: fx.manifestAt(['scripts/opencode-batch-worker.mjs']),
    }));
    gx(fx.dev, 'checkout', '-q', '--detach', fx.baseSha);
    let exit = 0;
    let stdout = '';
    try {
      stdout = execFileSync('node', [GATE, '--config', cfgPath], {
        cwd: fx.dev, encoding: 'utf8',
        input: `refs/heads/main ${fx.baseSha} refs/heads/main ${fx.baseSha}\n`,
      }).trim();
    } catch (e) {
      exit = e.status ?? -1;
      stdout = String(e.stdout ?? '');
    }
    expect(exit).toBe(0);
    expect(stdout).toContain('"decision":"allow"');
  });
  // Host canary as its OWN test: fixture isolation and host inviolability
  // are proven separately, not tangled into the fixture lifecycle.
  it('canary: host worktree HEAD/branch and all live origins remain untouched', () => {
    expect(gx(hostRepo, 'rev-parse', 'HEAD')).toBe(hostSnapshot.head);
    expect(gx(hostRepo, 'branch', '--show-current')).toBe(hostSnapshot.branch);
    for (const [origin, sha] of Object.entries(evidence.origins)) {
      expect(gx(origin, 'rev-parse', 'main')).toBe(sha);
    }
  });
});

// ─── INCIDENT GUARD negative matrix (2026-08-25) ─────────────────────────────
// Every case MUST refuse BEFORE any real git invocation and leave the shared
// repository config untouched. These prove the containment boundary itself.
describe('poisoned-tree guard refuses dangerous git contexts before any git call', () => {
  it('leaked GIT_DIR / GIT_WORK_TREE / GIT_INDEX_FILE is detected', () => {
    for (const key of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE']) {
      const fake = { ...process.env, [key]: '/home/admin100/dws6/.git' };
      expect(findLeakedGitEnv(fake)).toContain(key);
      expect(() => assertCleanGitEnv(fake)).toThrow(/leaked git environment/);
    }
  });

  it('relative, empty, undefined and unresolvable cwd are refused', () => {
    expect(() => guardCwd('')).toThrow(/non-absolute\/empty/);
    expect(() => guardCwd(undefined)).toThrow(/non-absolute\/empty/);
    expect(() => guardCwd('relative/path')).toThrow(/non-absolute\/empty/);
    expect(() => guardCwd('/tmp/opencode/does-not-exist-xyz')).toThrow(/unresolvable cwd/);
  });

  it('primary checkout, linked worktrees and paths under them are refused', () => {
    // The live repo and its linked worktrees are never registered sandbox roots.
    expect(() => guardCwd('/home/admin100/dws6')).toThrow(/outside fixture sandbox/);
    expect(() => guardCwd('/home/admin100/dws6/.git')).toThrow(/outside fixture sandbox/);
    expect(() => guardCwd('/home/admin100/dws6/.git/config')).toThrow(/outside fixture sandbox/);
    expect(() => guardCwd('/home/admin100/dws6/.worktrees/opencode-all/ses_probe')).toThrow(/outside fixture sandbox|unresolvable cwd/);
  });

  it('gx refuses out-of-sandbox targets without spawning git', () => {
    expect(() => gx('/home/admin100/dws6', 'status')).toThrow(/outside fixture sandbox|non-absolute\/empty/);
    expect(() => gx('', 'init', '-q', '--bare')).toThrow(/non-absolute\/empty/);
  });
});

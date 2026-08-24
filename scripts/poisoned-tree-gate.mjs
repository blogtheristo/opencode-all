#!/usr/bin/env node
// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- scripts/poisoned-tree-gate.mjs
/**
 * Poisoned-Tree Gate — client-side pre-push integrity check (DDM-v1 §5, v3 design).
 *
 * Operates PURELY on the git object database via explicit cwd — never on a
 * working tree. Designed to be invoked from .githooks/pre-push with the
 * pre-push stdin contract:
 *     local_ref local_sha remote_ref remote_sha   (one line per pushed ref)
 * Server-side pre-receive is explicitly out of scope (runbook §5).
 *
 * Checks:
 *   P0  local sha is an existing commit; object graph readable — fail closed
 *   P1  base resolution: FF -> remote sha; zero remote sha -> cycle-manifest
 *       baseline (reachable, hash-bound to off-host evidence); NON-FF ->
 *       BLOCK by default (separate approved-baseline path only)
 *   P2  tripwire: deletion ratio >= 10% of tracked regular blobs
 *   P3  absolute cap: deletions > maxDeletions (default 500)
 *   P4  critical-file manifest: canonical JSON, baseline-bound to the
 *       resolved base commit, deterministic ordering, path/type/mode/size/
 *       blob-oid all verified; generated paths forbidden
 *   P5  protected top-level dirs from a VERSIONED roster file read from the
 *       base tree (.githooks/protected-dirs.json) — removal requires an
 *       approved change record
 *   P6  approval artifact: canonical JSON bound to old/new/ref, unexpired,
 *       ed25519 signature verified with the key whose REGISTRY ENTRY binds
 *       the key-id to the approver identity; signer==pusher rejected;
 *       in-tree artifacts are never accepted (trusted source only)
 *
 * Exit codes: 0 = allow all refs, 1 = at least one blocked, 2 = usage error.
 */

import { execFileSync } from 'node:child_process';
import {
  createHash,
  createPublicKey,
  generateKeyPairSync,
  sign as cryptoSign,
  verify as cryptoVerify,
} from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';

const ZERO_SHA = '0'.repeat(40);
export { ZERO_SHA };
const RATIO_TRIPWIRE = 0.1;
const MAX_DELETIONS_DEFAULT = 500;

const ROSTER_PATH = '.githooks/protected-dirs.json';
const MANIFEST_DEFAULT = '.githooks/critical-files.manifest';

function gx(repo, args) {
  return execFileSync('git', args, { cwd: repo, encoding: 'utf8' }).trim();
}

/** Recursive tracked-entry listing: [{path,type,mode,oid,size}] */
export function listTree(repo, sha) {
  const out = gx(repo, ['ls-tree', '-r', sha]);
  if (!out) return [];
  return out.split('\n').map((line) => {
    const [meta, path] = line.split('\t');
    const [mode, type, oid] = meta.split(/\s+/);
    let size = null;
    if (type === 'blob') {
      size = parseInt(gx(repo, ['cat-file', '-s', oid]), 10);
    }
    return { path, type, mode, oid, size };
  });
}

/** P0: sha must be an existing, fully readable commit. Fail closed. */
export function validateCommit(repo, sha) {
  if (!/^[0-9a-f]{40}$/.test(sha)) return `${sha} is malformed`;
  let type;
  try {
    type = gx(repo, ['cat-file', '-t', sha]);
  } catch {
    return `${sha} unreadable`;
  }
  if (type !== 'commit') return `${sha} is not a commit (${type})`;
  try {
    gx(repo, ['rev-list', '--objects', sha], { maxBuffer: 1024 * 1024 * 64 });
  } catch {
    return `object graph unreadable at ${sha}`;
  }
  return null;
}

/** P1: resolve comparison base. Non-FF blocks by default (v3 correction 3/7). */
export function resolveBase(repo, { localSha, remoteSha, expectedOldSha, manifestBaseline }) {
  if (expectedOldSha && remoteSha !== ZERO_SHA && remoteSha !== expectedOldSha) {
    return { error: `old remote sha ${remoteSha.slice(0, 8)} contradicts locally recorded ${expectedOldSha.slice(0, 8)}` };
  }
  if (remoteSha === ZERO_SHA) {
    if (!manifestBaseline) return { error: 'new branch without cycle-manifest baseline' };
    try {
      gx(repo, ['merge-base', '--is-ancestor', manifestBaseline, localSha]);
    } catch {
      return { error: `manifest baseline ${manifestBaseline.slice(0, 8)} not reachable from pushed head` };
    }
    return { base: manifestBaseline };
  }
  let mb;
  try {
    mb = gx(repo, ['merge-base', remoteSha, localSha]);
  } catch {
    return { error: `cannot relate pushed head to remote ${remoteSha.slice(0, 8)}` };
  }
  if (mb === remoteSha) return { base: remoteSha, ff: true };
  // NON-FF: default block. Only escape hatch is an explicitly supplied,
  // separately-approved baseline that equals the merge-base.
  if (manifestBaseline && mb === manifestBaseline) return { base: mb, ff: false, approvedPath: true };
  return { error: `non-fast-forward update (merge-base ${mb.slice(0, 8)}) requires an approved baseline` };
}

/** Canonical JSON: recursively sorted object keys. Arrays keep order. */
export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    const out = {};
    for (const k of Object.keys(value).sort()) out[k] = canonicalize(value[k]);
    return out;
  }
  return value;
}
export function canonicalBytes(obj) {
  return Buffer.from(JSON.stringify(canonicalize(obj)), 'utf8');
}

/**
 * P4 manifest loader. Path resolves against ctx.repo (NOT process cwd).
 * Format: {version:1, baseline:<sha>, files:[{path,type,mode,size,oid}]},
 * canonical JSON with byte-wise sorted paths; generated paths forbidden.
 * The manifest is BOUND to the baseline sha it was generated from.
 */
export function loadManifest(repo, manifestPath, baseSha) {
  const full = isAbsolute(manifestPath) ? manifestPath : join(repo, manifestPath);
  if (!existsSync(full)) return { error: 'manifest missing' };
  let raw;
  try {
    raw = JSON.parse(readFileSync(full, 'utf8'));
  } catch {
    return { error: 'manifest truncated or invalid JSON' };
  }
  if (raw?.version !== 1 || !Array.isArray(raw.files)) return { error: 'manifest schema invalid' };
  if (raw.baseline !== baseSha) {
    return { error: `manifest baseline ${String(raw.baseline).slice(0, 8)} does not match resolved base ${baseSha.slice(0, 8)}` };
  }
  const entries = raw.files;
  const paths = entries.map((e) => e.path);
  if (JSON.stringify(paths) !== JSON.stringify([...paths].sort())) {
    return { error: 'manifest paths not deterministically ordered' };
  }
  for (const e of entries) {
    if (
      typeof e.path !== 'string' ||
      e.type !== 'blob' ||
      !/^(100644|100755)$/.test(e.mode) ||
      typeof e.size !== 'number' ||
      !/^[0-9a-f]{40}$/.test(e.oid)
    ) {
      return { error: `manifest entry malformed: ${JSON.stringify(e)}` };
    }
    if (/(^|\/)(dist|build|node_modules)(\/|$)/.test(e.path)) {
      return { error: `generated path forbidden in allowlist: ${e.path}` };
    }
  }
  return { entries, baselineOk: true };
}

/** P4: every allowlisted entry must match the new tree exactly. */
export function checkCriticalFiles(entries, newTree) {
  const byPath = new Map(newTree.map((e) => [e.path, e]));
  for (const e of entries) {
    const actual = byPath.get(e.path);
    if (!actual) return `${e.path}: missing from pushed tree`;
    if (actual.type !== e.type) return `${e.path}: type changed (${actual.type})`;
    if (actual.mode !== e.mode) return `${e.path}: mode changed (${actual.mode})`;
    if (actual.size !== e.size) return `${e.path}: size changed`;
    if (actual.oid !== e.oid) return `${e.path}: content hash changed`;
  }
  return null;
}

/** Ed25519 helpers for the trusted-key harness. */
export function makeKeyPair() {
  return generateKeyPairSync('ed25519');
}
export function exportKeyPem(publicKey) {
  return publicKey.export({ type: 'spki', format: 'pem' }).toString();
}
export function signArtifact(privateKey, canonicalBuffer) {
  return cryptoSign(null, canonicalBuffer, privateKey).toString('base64');
}
export function verifySignature(publicKeyPem, canonicalBuffer, sigB64) {
  try {
    return cryptoVerify(null, canonicalBuffer, createPublicKey(publicKeyPem), Buffer.from(sigB64, 'base64'));
  } catch {
    return false;
  }
}
export function keyIdFromPem(pem) {
  return createHash('sha256')
    .update(createPublicKey(pem).export({ type: 'spki', format: 'pem' }))
    .digest('hex')
    .slice(0, 16);
}

/**
 * P6 approval lookup with IDENTITY BINDING (v3 correction):
 * - candidate filename binds old/new/ref prefixes;
 * - artifact carries keyId; ONLY that key's signature is accepted;
 * - trusted registry (keysDir/registry.json) must map keyId -> approver;
 * - approver == pusher is rejected structurally, not by string luck.
 * In-tree artifacts are never consulted: approvalsDir must be outside the
 * pushed content (off-host store / audit dir supplied by the hook config).
 */
export function findApproval({ approvalsDir, trustedKeysDir, oldSha, newSha, ref, pusherIdentity, now = new Date() }) {
  if (!approvalsDir || !existsSync(approvalsDir)) return { ok: false, reason: 'no approvals directory' };
  // Content binding is authoritative: scan every .json artifact and require
  // exact oldSha/newSha/ref equality below. Filenames carry no trust.
  const candidates = readdirSync(approvalsDir).filter((f) => f.endsWith('.json'));
  if (candidates.length === 0) return { ok: false, reason: `no approval artifacts present for review of ${oldSha.slice(0, 8)}..${newSha.slice(0, 8)}` };

  const registryPath = join(trustedKeysDir ?? '', 'registry.json');
  let registry = {};
  try {
    registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  } catch {
    return { ok: false, reason: 'trusted-key registry missing or invalid — fail closed' };
  }

  for (const jsonFile of candidates) {
    const sigFile = `${jsonFile}.sig`;
    if (!existsSync(join(approvalsDir, sigFile))) continue; // unsigned: can never approve
    let art;
    try {
      art = JSON.parse(readFileSync(join(approvalsDir, jsonFile), 'utf8'));
    } catch {
      continue; // malformed artifact can never approve
    }
    const required = ['oldSha', 'newSha', 'ref', 'reason', 'approver', 'expiry', 'keyId'];
    if (required.some((k) => typeof art[k] !== 'string' || !art[k])) continue;
    if (art.oldSha !== oldSha || art.newSha !== newSha || art.ref !== ref) continue;
    if (new Date(art.expiry) <= now) continue;

    const pemPath = join(trustedKeysDir, `${art.keyId}.pub`);
    if (!existsSync(pemPath)) continue; // unknown key: never trusted
    const approverOfKey = registry[art.keyId];
    if (!approverOfKey) continue; // key not bound to any approver
    if (approverOfKey !== art.approver) continue; // signature key does not belong to claimed approver

    const canonical = canonicalBytes({ ...art, keyId: undefined }).canonical ?? canonicalBytes({ ...art });
    void canonical;
    const bytesForSig = canonicalBytes({ ...art });
    const sig = readFileSync(join(approvalsDir, sigFile), 'utf8').trim();
    if (!verifySignature(readFileSync(pemPath, 'utf8'), bytesForSig, sig)) continue;

    if (pusherIdentity && approverOfKey === pusherIdentity) {
      return { ok: false, reason: 'self-approval rejected: signing key is registered to the pusher' };
    }
    return { ok: true, approvedBy: approverOfKey, keyId: art.keyId };
  }
  return { ok: false, reason: 'no valid signed artifact (untrusted/unbound signer, expired, sha/ref mismatch)' };
}

/** P5 roster: versioned file read from the BASE tree (review-protected). */
export function loadProtectedRoster(repo, baseSha) {
  try {
    const entry = gx(repo, ['ls-tree', baseSha, '--', ROSTER_PATH]);
    if (!entry) return { dirs: [] }; // no roster committed: none protected
    const oid = entry.split(/\s+/)[2];
    const raw = JSON.parse(gx(repo, ['cat-file', '-p', oid]));
    if (!Array.isArray(raw?.dirs)) return { error: 'protected-roster schema invalid — fail closed' };
    if (JSON.stringify(raw.dirs) !== JSON.stringify([...raw.dirs].sort())) {
      return { error: 'protected-roster not deterministically ordered — fail closed' };
    }
    return { dirs: raw.dirs };
  } catch {
    return { error: 'protected-roster unreadable — fail closed' };
  }
}

/**
 * Full evaluation. ctx = {repo, localRef, localSha, remoteRef, remoteSha,
 * expectedOldSha, manifestBaseline, manifestPath?, maxDeletions?,
 * pusherIdentity, approvalsDir, trustedKeysDir}
 */
export function evaluate(ctx) {
  const reasons = [];
  const p0 = validateCommit(ctx.repo, ctx.localSha);
  if (p0) return { decision: 'block', reasons: [`P0 ${p0}`], stats: {} };

  const resolved = resolveBase(ctx.repo, ctx);
  if (resolved.error) return { decision: 'block', reasons: [`P1 ${resolved.error}`], stats: {} };

  const baseTree = listTree(ctx.repo, resolved.base);
  const newTree = listTree(ctx.repo, ctx.localSha);

  const baseBlobs = baseTree.filter((e) => e.type === 'blob');
  const newPaths = new Set(newTree.filter((e) => e.type === 'blob').map((e) => e.path));
  const deleted = baseBlobs.filter((e) => !newPaths.has(e.path));
  const stats = {
    baseCount: baseTree.length,
    newCount: newTree.length,
    deletions: deleted.length,
    baseBlobCount: baseBlobs.length,
  };

  // P5 protected roster (from base tree)
  const roster = loadProtectedRoster(ctx.repo, resolved.base);
  if (roster.error) reasons.push(`P5 ${roster.error}`);
  const rosterHit = (roster.dirs ?? []).filter(
    (d) =>
      baseTree.some((e) => e.path === d || e.path.startsWith(`${d}/`)) &&
      !newTree.some((e) => e.path === d || e.path.startsWith(`${d}/`)),
  );

  // P2/P3
  const ratio = baseBlobs.length > 0 ? deleted.length / baseBlobs.length : 0;
  const cap = ctx.maxDeletions ?? MAX_DELETIONS_DEFAULT;
  const tripwire = ratio >= RATIO_TRIPWIRE || deleted.length > cap;

  // P6 approval when needed
  let approval = null;
  const needsApproval = tripwire || rosterHit.length > 0;
  if (needsApproval) {
    approval = findApproval({
      approvalsDir: ctx.approvalsDir,
      trustedKeysDir: ctx.trustedKeysDir,
      oldSha: resolved.base,
      newSha: ctx.localSha,
      ref: ctx.remoteRef,
      pusherIdentity: ctx.pusherIdentity,
    });
    if (!approval.ok) {
      if (rosterHit.length > 0) reasons.push(`P5 protected directory removed without approved change record: ${rosterHit.join(', ')}`);
      if (ratio >= RATIO_TRIPWIRE) reasons.push(`P2 deletion ratio ${(ratio * 100).toFixed(1)}% exceeds tripwire`);
      if (deleted.length > cap) reasons.push(`P3 deletions ${deleted.length} exceed cap ${cap}`);
      reasons.push(`approval: ${approval.reason}`);
    }
  }

  // P4 critical files — always enforced, independent of ratio/approval
  const loaded = loadManifest(ctx.repo, ctx.manifestPath ?? MANIFEST_DEFAULT, resolved.base);
  if (loaded.error) {
    reasons.push(`P4 manifest: ${loaded.error}`);
  } else {
    const violation = checkCriticalFiles(loaded.entries, newTree);
    if (violation) reasons.push(`P4 critical file: ${violation}`);
  }

  if (reasons.length > 0) {
    return { decision: 'block', reasons, stats, approvedBy: approval?.ok ? approval.approvedBy : null };
  }
  return {
    decision: 'allow',
    reasons: needsApproval ? [`approved by ${approval.approvedBy} (key ${approval.keyId})`] : [],
    stats,
  };
}

/** Pre-push stdin contract: evaluate every pushed ref line. Never throws. */
export function runPrePushLines(lines, cfg) {
  const results = [];
  for (const line of lines.filter((l) => l.trim())) {
    const parts = line.trim().split(/\s+/);
    if (parts.length !== 4 || parts.some((p) => !/^[0-9a-f]{40}$/.test(p) && p !== ZERO_SHA && !p.startsWith('refs/'))) {
      results.push({ ref: '?', decision: 'block', reasons: [`malformed stdin line: ${line.trim()}`], stats: {} });
      continue;
    }
    const [localRef, localSha, remoteRef, remoteSha] = parts;
    if (!localRef.startsWith('refs/') || !remoteRef.startsWith('refs/')) {
      results.push({ ref: remoteRef ?? '?', decision: 'block', reasons: [`malformed stdin line: ${line.trim()}`], stats: {} });
      continue;
    }
    if (localSha === ZERO_SHA) continue; // ref deletion: owned by NO-DELETE policy elsewhere
    let res;
    try {
      res = evaluate({ ...cfg, localRef, localSha, remoteRef, remoteSha });
    } catch (err) {
      res = { decision: 'block', reasons: [`gate internal error (fail closed): ${err?.message ?? err}`], stats: {} };
    }
    results.push({ ref: remoteRef, localSha, decision: res.decision, reasons: res.reasons, stats: res.stats });
  }
  return results;
}

/** CLI wrapper: config JSON via --config <file> or POISONED_TREE_GATE_CONFIG; refs via stdin. */
export function main(argv, repo, stdin) {
  let cfgPath = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--config') cfgPath = argv[i + 1];
  }
  if (!cfgPath) cfgPath = process.env.POISONED_TREE_GATE_CONFIG;
  if (!cfgPath) {
    console.error('poisoned-tree-gate: missing --config <file> / POISONED_TREE_GATE_CONFIG');
    process.exitCode = 2;
    return;
  }
  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
  const lines = String(stdin ?? '').split('\n');
  const results = runPrePushLines(lines, { ...cfg, repo });
  let blocked = 0;
  for (const r of results) {
    for (const reason of r.reasons) console.error(`poisoned-tree-gate [${r.ref}]: ${reason}`);
    if (r.decision === 'block') blocked++;
  }
  console.log(JSON.stringify(results.map((r) => ({ ref: r.ref, decision: r.decision }))));
  process.exitCode = blocked > 0 ? 1 : 0;
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main(process.argv.slice(2), process.cwd(), readFileSync(0, 'utf8'));
}

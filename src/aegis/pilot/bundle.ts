// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-30
// Audit trail: git log -- src/aegis/pilot/bundle.ts
/**
 * Aegis Pilot — auditor evidence bundle: export and offline verification
 * (readiness plan A2, gates G7 and G10).
 *
 * First version by the DGX loop (#2256); rewritten in the Claude Code takeover
 * (30.09.2026). The bundle is what a customer's auditor verifies years later on
 * a machine that never held the state directory, with no DWS access. It mirrors
 * the state layout, so the same verifiers run on it:
 *
 *   ledger/article12.jsonl                 active segment
 *   ledger/segments/NNNNNN.{jsonl,seal.json} sealed segments and their seals
 *   site/site.json                         site public key (never site.key)
 *   acceptance/*.json                      signed acceptance records
 *   credentials/*.json                     issued credentials (public parts)
 *   command-bodies/<sha256>.json           signed operator command bodies (erasable sidecar)
 *   manifest.json + manifest.sig           every file's sha256, signed by the site key
 *
 * verifyBundle checks: the manifest's shape and paths; the key id computed from
 * the bundled public key (the pin is compared with that, never with a claimed
 * id); the manifest signature; that the files on disk are exactly the manifest
 * (no missing, extra or non-regular files); the whole segment chain
 * (verifySegments: seals, links, hashes, retention); the ledger head; and that
 * every acceptance record is signed by the site key and was recorded in the
 * ledger under its digest; and that every stop and decision carries the operator's
 * own signed command, bound field by field to the event (operator-evidence.ts).
 * The bundle format is frozen in docs/aegis/EVIDENCE_FORMAT_v1.md.
 */

import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { z } from 'zod';
import { canonicalJSON, keyId, publicKeyFromPem, sha256, verifyPayload } from './crypto.js';
import { type Credential, SiteAuthority, type SiteManifest, statePaths } from './identity.js';
import { type LedgerEvent, readLedgerEvents } from './evidence-ledger.js';
import { segmentPaths, verifySegments } from './ledger-segments.js';
import {
  commandBodiesDir,
  readCommandBodies,
  redactedDigests,
  referencedDigests,
  type SegmentEvents,
  verifyOperatorEvidence,
} from './operator-evidence.js';
import { type OperatorCopiesResult, verifyOperatorCopies } from './operator-copies.js';
import { docVersion, KIT_ROOT, PROVENANCE_SOURCES, versionAtLeast } from './provenance.js';

/** The auditor guide shipped in every bundle (C6). */
export const AUDITOR_GUIDE = 'AUDITOR_GUIDE.md';

/** Paths a bundle may hold (relative, forward slashes). */
const BUNDLE_PATH =
  /^(AUDITOR_GUIDE\.md|ledger\/article12\.jsonl|ledger\/segments\/\d{6}\.(jsonl|seal\.json)|site\/site\.json|acceptance\/[A-Za-z0-9._-]{1,128}\.json|credentials\/[A-Za-z0-9._-]{1,128}\.json|command-bodies\/[0-9a-f]{64}\.json)$/;

const ManifestSchema = z
  .object({
    v: z.literal(1),
    siteId: z.string().min(1).max(63),
    keyId: z.string().min(1).max(128),
    createdAt: z.string().datetime(),
    ledgerHead: z.object({ count: z.number().int().nonnegative(), hash: z.string() }).strict(),
    lastSealDigest: z.string().nullable(),
    files: z.array(
      z
        .object({
          path: z.string().regex(BUNDLE_PATH),
          sha256: z.string().regex(/^[0-9a-f]{64}$/),
          bytes: z.number().int().nonnegative(),
        })
        .strict(),
    ),
  })
  .strict();

export type BundleManifest = z.infer<typeof ManifestSchema>;

export interface VerifyResult {
  ok: boolean;
  failures: string[];
  /** Key id computed from the bundled public key (what the pin is compared with). */
  keyId: string | null;
  /** With `operatorCopies`: what the operator-held copies showed. */
  operatorCopies?: OperatorCopiesResult;
}

const toPosix = (p: string) => p.split(sep).join('/');

/** Regular files under `root`, relative; links and other types are refused, never followed. */
function walk(root: string, onOther: (rel: string) => void): string[] {
  const out: string[] = [];
  const visit = (d: string) => {
    for (const name of readdirSync(d).sort()) {
      const p = join(d, name);
      const st = lstatSync(p);
      if (st.isDirectory()) visit(p);
      else if (st.isFile()) out.push(toPosix(relative(root, p)));
      else onOther(toPosix(relative(root, p)));
    }
  };
  if (existsSync(root)) visit(root);
  return out;
}

/** Events of every present sealed segment and the active segment, labelled. */
function chainSegments(root: string, chain: ReturnType<typeof verifySegments>): SegmentEvents[] {
  const out: Array<{ label: string; events: LedgerEvent[] }> = [];
  for (const s of chain.segments) {
    const file = segmentPaths(root).file(s.index);
    if (s.present && existsSync(file))
      out.push({
        label: `segment ${String(s.index).padStart(6, '0')}`,
        events: readLedgerEvents(file),
      });
  }
  if (existsSync(statePaths(root).ledger))
    out.push({ label: 'active', events: readLedgerEvents(statePaths(root).ledger) });
  return out;
}

/** State-directory files that belong in a bundle. */
function evidenceFiles(stateDir: string, referencedBodies: ReadonlySet<string>): string[] {
  const p = statePaths(stateDir);
  const picks: Array<[string, string, RegExp]> = [
    [dirname(p.ledger), 'ledger', /^article12\.jsonl$/],
    [segmentPaths(stateDir).dir, 'ledger/segments', /^\d{6}\.(jsonl|seal\.json)$/],
    [p.siteDir, 'site', /^site\.json$/],
    [p.acceptance, 'acceptance', /\.json$/],
    [p.credentials, 'credentials', /\.json$/],
    [commandBodiesDir(stateDir), 'command-bodies', /^[0-9a-f]{64}\.json$/],
  ];
  const files: string[] = [];
  for (const [dir, prefix, pattern] of picks) {
    if (!existsSync(dir)) continue;
    for (const name of readdirSync(dir).sort()) {
      if (!pattern.test(name)) continue;
      // Only bodies an event references: a leftover from a crash before its event is not evidence.
      if (prefix === 'command-bodies' && !referencedBodies.has(name.slice(0, 64))) continue;
      const rel = `${prefix}/${name}`;
      if (!lstatSync(join(dir, name)).isFile())
        throw new Error(`refusing to export ${rel}: not a regular file`);
      if (!BUNDLE_PATH.test(rel)) throw new Error(`refusing to export ${rel}: unexpected name`);
      files.push(rel);
    }
  }
  return files;
}

export function exportBundle(stateDir: string, outDir: string, now = new Date()): BundleManifest {
  const state = resolve(stateDir);
  const outPath = resolve(outDir);
  if (existsSync(outPath) && readdirSync(outPath).length > 0)
    throw new Error(`output directory exists and is non-empty: ${outPath}`);
  const site = SiteAuthority.load(state);
  // A bundle vouches for its contents with the site signature: never sign a broken chain.
  const chain = verifySegments(state, site, now);
  if (!chain.valid) throw new Error(`evidence chain does not verify: ${chain.reason}`);

  const files = evidenceFiles(state, referencedDigests(chainSegments(state, chain))).map((rel) => {
    const raw = readFileSync(join(state, rel));
    return { path: rel, sha256: sha256(raw), bytes: raw.length };
  });
  // The reading path travels with the evidence (C6): the guide from the kit checkout.
  const guideSrc = join(KIT_ROOT, PROVENANCE_SOURCES.auditorGuide);
  if (!existsSync(guideSrc) || !docVersion(guideSrc))
    throw new Error(`auditor guide missing or unversioned: ${guideSrc}`);
  const guideRaw = readFileSync(guideSrc);
  files.push({ path: AUDITOR_GUIDE, sha256: sha256(guideRaw), bytes: guideRaw.length });
  const source = (rel: string) => (rel === AUDITOR_GUIDE ? guideSrc : join(state, rel));
  mkdirSync(outPath, { recursive: true, mode: 0o755 });
  for (const f of files) {
    const dest = join(outPath, f.path);
    mkdirSync(dirname(dest), { recursive: true, mode: 0o755 });
    copyFileSync(source(f.path), dest);
    // Copied bytes must be the hashed bytes (a writer could change the file in between).
    if (sha256(readFileSync(dest)) !== f.sha256)
      throw new Error(`${f.path} changed during export; export again`);
  }
  const manifest: BundleManifest = {
    v: 1,
    siteId: site.manifest.siteId,
    keyId: site.manifest.keyId,
    createdAt: now.toISOString(),
    ledgerHead: { count: chain.active.count, hash: chain.active.headHash },
    lastSealDigest: chain.lastSealDigest,
    files,
  };
  writeFileSync(join(outPath, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(join(outPath, 'manifest.sig'), site.sign(manifest));
  return manifest;
}

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function verifyBundle(
  bundleDir: string,
  expectKeyId?: string,
  now = new Date(),
  opts: {
    /** Directory of operator command copies / WORM records (EVIDENCE_FORMAT_v1.md §7). */
    operatorCopies?: string;
  } = {},
): VerifyResult {
  const root = resolve(bundleDir);
  const failures: string[] = [];
  let operatorCopies: OperatorCopiesResult | undefined;
  const done = (computed: string | null): VerifyResult => ({
    ok: failures.length === 0,
    failures,
    keyId: computed,
    ...(operatorCopies ? { operatorCopies } : {}),
  });

  let manifest: BundleManifest;
  let signature: string;
  try {
    const parsed = ManifestSchema.safeParse(readJson(join(root, 'manifest.json')));
    if (!parsed.success) {
      failures.push(`manifest.json malformed: ${parsed.error.issues[0]?.message ?? 'invalid'}`);
      return done(null);
    }
    manifest = parsed.data;
    signature = readFileSync(join(root, 'manifest.sig'), 'utf8').trim();
  } catch (e) {
    failures.push(`manifest missing or unreadable: ${(e as Error).message}`);
    return done(null);
  }

  // The site key: identity comes from the key itself, never from a claimed id.
  let siteManifest: SiteManifest;
  let computed: string;
  try {
    siteManifest = readJson(join(root, 'site', 'site.json')) as SiteManifest;
    computed = keyId(siteManifest.publicKeyPem);
    publicKeyFromPem(siteManifest.publicKeyPem);
  } catch {
    failures.push('site/site.json missing or not a site public key');
    return done(null);
  }
  const publicKey = publicKeyFromPem(siteManifest.publicKeyPem);
  if (siteManifest.keyId !== computed || manifest.keyId !== computed)
    failures.push(`key id does not match the bundled public key (computed ${computed})`);
  if (expectKeyId !== undefined && expectKeyId !== computed)
    failures.push(`key id mismatch: expected=${expectKeyId}, actual=${computed}`);
  if (manifest.siteId !== siteManifest.siteId)
    failures.push('manifest siteId differs from site.json');
  if (!verifyPayload(manifest, signature, publicKey))
    failures.push('manifest signature does not verify against the bundled site key');

  // Exactly the manifest's files, byte for byte.
  const listed = new Map(manifest.files.map((f) => [f.path, f]));
  const onDisk = walk(root, (rel) => failures.push(`not a regular file: ${rel}`)).filter(
    (rel) => rel !== 'manifest.json' && rel !== 'manifest.sig',
  );
  for (const rel of onDisk) {
    const f = listed.get(rel);
    if (!f) {
      failures.push(`file not in manifest: ${rel}`);
      continue;
    }
    const raw = readFileSync(join(root, rel));
    if (sha256(raw) !== f.sha256 || raw.length !== f.bytes)
      failures.push(`file hash mismatch: ${rel}`);
  }
  const present = new Set(onDisk);
  for (const rel of listed.keys())
    if (!present.has(rel)) failures.push(`file missing from bundle: ${rel}`);
  if (!listed.has('ledger/article12.jsonl')) failures.push('bundle holds no ledger');

  // The whole chain: sealed segments, seals and the active segment (same checks as on site).
  const chain = verifySegments(root, { publicKey, manifest: siteManifest }, now);
  if (!chain.valid) failures.push(`ledger chain does not verify: ${chain.reason}`);
  if (
    chain.active.headHash !== manifest.ledgerHead.hash ||
    chain.active.count !== manifest.ledgerHead.count
  )
    failures.push('ledger head differs from the signed manifest');
  if (chain.lastSealDigest !== manifest.lastSealDigest)
    failures.push('newest seal differs from the signed manifest');

  // Acceptance records: signed by this site and recorded in the ledger under their digest.
  const recorded = new Map<string, string>();
  const bySegment = chainSegments(root, chain);
  const events = bySegment.flatMap((s) => s.events);

  // Operator evidence: every stop and decision re-verified with the operator's own key and
  // bound to its event (EVIDENCE_FORMAT_v1.md §5). Credentials come from the bundle only.
  const credentials = new Map<string, Credential>();
  for (const rel of onDisk.filter((r) => r.startsWith('credentials/'))) {
    try {
      credentials.set(
        rel.slice('credentials/'.length, -'.json'.length),
        readJson(join(root, rel)) as Credential,
      );
    } catch {
      failures.push(`credential ${rel} unreadable`);
    }
  }
  const bodies = readCommandBodies(
    root,
    onDisk.filter((r) => r.startsWith('command-bodies/')),
    failures,
  );
  const operatorCtx = {
    site: siteManifest,
    credentials,
    bodies,
    redacted: redactedDigests(bySegment),
  };
  failures.push(...verifyOperatorEvidence(bySegment, operatorCtx));
  if (opts.operatorCopies !== undefined) {
    operatorCopies = verifyOperatorCopies(resolve(opts.operatorCopies), bySegment, operatorCtx, {
      anyPruned: chain.segments.some((s) => s.pruned),
    });
    failures.push(...operatorCopies.failures);
  }
  for (const e of events)
    if (
      e.event_type === 'acceptance.record' &&
      typeof e.detail?.record_id === 'string' &&
      e.output_digest
    )
      recorded.set(e.detail.record_id, e.output_digest);
  const guideVersion = present.has(AUDITOR_GUIDE) ? docVersion(join(root, AUDITOR_GUIDE)) : null;
  if (!guideVersion) failures.push(`${AUDITOR_GUIDE} missing from the bundle or unversioned`);
  for (const rel of onDisk.filter((r) => r.startsWith('acceptance/'))) {
    try {
      const signed = readJson(join(root, rel)) as {
        record?: { recordId?: unknown };
        signature?: unknown;
      };
      if (!signed.record || typeof signed.signature !== 'string') {
        failures.push(`acceptance record ${rel} carries no signature`);
        continue;
      }
      if (!verifyPayload(signed.record, signed.signature, publicKey))
        failures.push(`acceptance record ${rel}: signature does not verify`);
      // A v2 record names the guide it was signed against; an older bundled guide is stale.
      const wanted = (signed.record as { provenance?: { documents?: { auditorGuide?: unknown } } })
        .provenance?.documents?.auditorGuide;
      if (typeof wanted === 'string' && guideVersion && !versionAtLeast(guideVersion, wanted))
        failures.push(
          `auditor guide ${guideVersion} is older than ${wanted}, which ${rel} was signed against`,
        );
      const id = String(signed.record.recordId);
      if (recorded.get(id) !== sha256(canonicalJSON(signed.record)))
        failures.push(`acceptance record ${rel} is not recorded in the ledger under its digest`);
    } catch (e) {
      failures.push(`acceptance record ${rel} unreadable: ${(e as Error).message}`);
    }
  }
  return done(computed);
}

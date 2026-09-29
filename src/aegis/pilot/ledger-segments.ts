// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- src/aegis/pilot/ledger-segments.ts
/**
 * Aegis Pilot — ledger segments and retention (AEGIS_PILOT_95_READINESS_PLAN.md, item C2).
 *
 * A single ever-growing JSONL file cannot honour retention: deleting its head
 * breaks the hash chain, and keeping everything forever keeps personal operator
 * data longer than DWS_ARTICLE_12_LOGGING_STANDARD.md §4 allows. So the active
 * ledger is sealed and rolled:
 *
 *   ledger/article12.jsonl            active segment (unchanged path; every writer keeps working)
 *   ledger/segments/NNNNNN.jsonl      sealed segment, byte-for-byte the rolled file
 *   ledger/segments/NNNNNN.seal.json  signed seal: file hash, head hash, retention, link to previous seal
 *
 * Chaining across segments:
 *   - the last event of a sealed segment is `system.segment_seal`;
 *   - the genesis event of the next segment carries `prev_segment`
 *     {index, head_hash, seal_digest} — hashed and site-signed like any event;
 *   - each seal carries `prevSeal`, the digest of the previous seal, so the seal
 *     chain still verifies after a segment file has been pruned.
 *
 * Retention (§4): each event type has a class; a segment is kept until its last
 * event plus the longest class it contains. Unknown event types get the long
 * class — over-retaining is the recoverable mistake, under-retaining is not.
 * Pruning is never automatic: it needs the confirm token of the listed
 * segments, refuses a chain that does not verify or a clock behind the ledger,
 * keeps the seal, and records itself as a ledger event before deleting.
 *
 * Crash safety: the seal is written to a temp file, fsynced and renamed; the
 * sealed segment is a hard link of the active file; the next segment replaces
 * the active path in one rename. The active path is never absent, and a roll
 * interrupted at any point is detected by `verifySegments` and completed by the
 * next `sealActiveSegment`.
 *
 * Residual (Rule 12): without the site key nobody can forge history, but a
 * state-dir writer can roll the newest segments back (delete them and copy an
 * older one over the active file). Only an anchor held outside the state
 * directory catches that: copy the `anchor` that `seal` prints to the
 * customer's records and verify with `expectSealDigest`.
 */

import {
  closeSync,
  existsSync,
  fsyncSync,
  linkSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { canonicalJSON, sha256, verifyPayload } from './crypto.js';
import {
  EvidenceLedger,
  type LedgerEvent,
  type LedgerVerification,
  verifyLedger,
} from './evidence-ledger.js';
import { type SiteAuthority, statePaths } from './identity.js';

export type RetentionClass = 'risk-6m' | 'identity-5y';

/** §4 "risk-relevant events (default)": 6 months, Art. 26(6). */
const SHORT_RETENTION: ReadonlySet<string> = new Set([
  'agent.decide',
  'tool.invoke',
  'system.genesis',
  'system.heartbeat',
  'system.uplink_probe',
  'system.degraded',
  'system.reconcile',
  'system.segment_seal',
  'workflow.start',
  'workflow.complete',
  'workflow.failed',
]);

/**
 * Stops, terminations, acceptance records, incidents and prune records are kept
 * 5 years (§4 identity events, KYA leash snaps). Anything not listed as short,
 * including event types added later, falls here.
 */
export function retentionClassOf(eventType: string): RetentionClass {
  return SHORT_RETENTION.has(eventType) ? 'risk-6m' : 'identity-5y';
}

const RETENTION_MONTHS: Record<RetentionClass, number> = { 'risk-6m': 6, 'identity-5y': 60 };

function addMonthsUtc(iso: string, months: number): string {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString();
}

export interface SegmentSealBody {
  v: 1;
  format: 'aegis-pilot-segment/1';
  siteId: string;
  keyId: string;
  index: number;
  file: string;
  sha256: string;
  bytes: number;
  count: number;
  firstTimestamp: string;
  lastTimestamp: string;
  headHash: string;
  sealedAt: string;
  reason: string;
  /** Digest of the previous seal body; null for segment 0. */
  prevSeal: string | null;
  retention: { classes: Partial<Record<RetentionClass, number>>; retainUntil: string };
}

export interface SegmentSeal extends SegmentSealBody {
  sig: string;
}

export function sealDigest(seal: SegmentSealBody | SegmentSeal): string {
  const { sig: _sig, ...body } = seal as SegmentSeal;
  return sha256(canonicalJSON(body));
}

export function segmentPaths(stateDir: string) {
  const dir = join(dirname(statePaths(stateDir).ledger), 'segments');
  const name = (i: number) => {
    if (!Number.isSafeInteger(i) || i < 0) throw new Error(`invalid segment index ${i}`);
    return String(i).padStart(6, '0');
  };
  return {
    dir,
    file: (i: number) => join(dir, `${name(i)}.jsonl`),
    seal: (i: number) => join(dir, `${name(i)}.seal.json`),
  };
}

/** One seal file. `index` comes from the file name, never from the (unverified) content. */
export interface SealFile {
  index: number;
  seal: SegmentSeal | null;
  error: string | null;
}

export function readSealFiles(stateDir: string): SealFile[] {
  const { dir } = segmentPaths(stateDir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /^\d{6}\.seal\.json$/.test(f))
    .sort()
    .map((f) => {
      const index = Number.parseInt(f.slice(0, 6), 10);
      try {
        return { index, seal: JSON.parse(readFileSync(join(dir, f), 'utf8')), error: null };
      } catch (err) {
        return { index, seal: null, error: `unreadable seal ${f}: ${(err as Error).message}` };
      }
    });
}

/** Seals in order. Throws on an unreadable seal (use verifySegments for a report). */
export function readSeals(stateDir: string): SegmentSeal[] {
  return readSealFiles(stateDir).map((s) => {
    if (!s.seal) throw new Error(s.error ?? 'unreadable seal');
    return s.seal;
  });
}

function readEvents(path: string): LedgerEvent[] {
  return readFileSync(path, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as LedgerEvent);
}

function fsyncPath(path: string): void {
  const fd = openSync(path, 'r');
  try {
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

/** Temp file, fsync, rename, fsync the directory: the target is either absent or complete. */
function writeDurable(path: string, content: string): void {
  const tmp = join(dirname(path), `.tmp-${randomUUID()}`);
  writeFileSync(tmp, content, { mode: 0o600, flag: 'wx' });
  fsyncPath(tmp);
  renameSync(tmp, path);
  fsyncPath(dirname(path));
}

function linkOf(e: LedgerEvent | undefined): Record<string, unknown> | null {
  const link = e?.event_type === 'system.genesis' ? e.detail.prev_segment : undefined;
  return link && typeof link === 'object' ? (link as Record<string, unknown>) : null;
}

function linkMatches(link: Record<string, unknown> | null, prev: SegmentSeal): boolean {
  return (
    link !== null &&
    link.index === prev.index &&
    link.head_hash === prev.headHash &&
    link.seal_digest === sealDigest(prev)
  );
}

/** A roll that stopped after the seal was written: the active file is still the sealed content. */
function interruptedRoll(stateDir: string, last: SegmentSeal | undefined): boolean {
  const active = statePaths(stateDir).ledger;
  return !!last && existsSync(active) && sha256(readFileSync(active)) === last.sha256;
}

export interface SealOptions {
  stateDir: string;
  site: SiteAuthority;
  /** Roll when the active segment is at least this many bytes. */
  maxBytes?: number;
  /** Roll when the active segment's first event is at least this old. */
  maxAgeDays?: number;
  /** Seal regardless of size and age. */
  force?: boolean;
  now?: () => Date;
}

export interface SealAnchor {
  index: number;
  headHash: string;
  sealDigest: string;
}

export type SealResult =
  | { sealed: false; reason: string; bytes: number; firstTimestamp: string | null }
  | {
      sealed: true;
      /** True when this call completed a roll an earlier call was interrupted in. */
      recovered: boolean;
      seal: SegmentSeal;
      sealPath: string;
      /** Copy to the customer's records; verify later with expectSealDigest. */
      anchor: SealAnchor;
      activeHead: { seq: number; hash: string };
    };

export const DEFAULT_MAX_SEGMENT_BYTES = 64 * 1024 * 1024;
export const DEFAULT_MAX_SEGMENT_AGE_DAYS = 30;

type LedgerOpenOptions = Parameters<typeof EvidenceLedger.open>[1];

/**
 * Seal the active segment and start the next one, if a size or age limit is
 * reached (or `force`). Takes the single-writer lock first and holds it to the
 * end, so it refuses while a run is writing and two sealers exclude each other.
 * Refuses a chain that does not verify (EvidenceLedger.open) and completes an
 * interrupted roll before anything else.
 */
export function sealActiveSegment(opts: SealOptions): SealResult {
  const now = opts.now ?? (() => new Date());
  for (const [name, v] of [
    ['maxBytes', opts.maxBytes],
    ['maxAgeDays', opts.maxAgeDays],
  ] as const) {
    if (v !== undefined && !(Number.isFinite(v) && v > 0)) {
      throw new Error(`${name} must be a positive number`);
    }
  }
  const active = statePaths(opts.stateDir).ledger;
  if (!existsSync(active)) throw new Error(`no active ledger at ${active}`);
  const seg = segmentPaths(opts.stateDir);
  mkdirSync(seg.dir, { recursive: true, mode: 0o700 });
  const firstEvent = readEvents(active)[0];
  const siteId = opts.site.manifest.siteId;
  const ledgerOpts: LedgerOpenOptions = {
    siteId,
    orgId: String(firstEvent?.detail.org_id ?? firstEvent?.org_id ?? siteId),
    signer: (h: string) => opts.site.sign(h),
    publicKey: opts.site.publicKey,
    now,
  };
  const result = (
    recovered: boolean,
    seal: SegmentSeal,
    activeHead: { seq: number; hash: string },
  ): SealResult => ({
    sealed: true,
    recovered,
    seal,
    sealPath: seg.seal(seal.index),
    anchor: { index: seal.index, headHash: seal.headHash, sealDigest: sealDigest(seal) },
    activeHead,
  });

  // Lock first; everything below reads state under it.
  const ledger = EvidenceLedger.open(active, ledgerOpts);
  let release: (() => void) | null = null;
  try {
    for (const f of readdirSync(seg.dir)) {
      // Our own crash leftovers only; quarantined files stay for the investigation.
      if (/^\.(tmp-|next-)/.test(f)) rmSync(join(seg.dir, f), { force: true });
    }
    // No seal is trusted before it verifies: the site key must never sign a
    // genesis that links to a planted seal. Only an interrupted roll may proceed.
    const pre = verifySegments(opts.stateDir, opts.site, now());
    if (!pre.valid && !pre.reason?.startsWith('interrupted roll')) {
      throw new Error(`ledger segments do not verify (${pre.reason}); refusing to seal`);
    }
    const seals = readSeals(opts.stateDir);
    const last = seals.at(-1);

    if (last && interruptedRoll(opts.stateDir, last)) {
      release = ledger.closeHoldingLock();
      // Recorded in the signed genesis, not only in CLI output: a recovery is also
      // what a rollback of the active tail looks like (runbook §8).
      return result(
        true,
        last,
        rollTo(opts.stateDir, last, ledgerOpts, { recovered_roll: last.index }),
      );
    }

    const bytes = statSync(active).size;
    const firstTimestamp = readEvents(active)[0]?.timestamp ?? null;
    const maxBytes = opts.maxBytes ?? DEFAULT_MAX_SEGMENT_BYTES;
    const maxAgeMs = (opts.maxAgeDays ?? DEFAULT_MAX_SEGMENT_AGE_DAYS) * 86_400_000;
    const ageMs = firstTimestamp ? now().getTime() - Date.parse(firstTimestamp) : 0;
    let reason: string;
    if (opts.force) reason = 'forced';
    else if (bytes >= maxBytes) reason = `size ${bytes} >= ${maxBytes} bytes`;
    else if (ageMs >= maxAgeMs) reason = `age ${Math.floor(ageMs / 86_400_000)} d`;
    else return { sealed: false, reason: 'below size and age limits', bytes, firstTimestamp };

    const index = seals.length;
    ledger.append({
      event_type: 'system.segment_seal',
      trace_id: randomUUID(),
      detail: { segment_index: index, reason },
    });
    release = ledger.closeHoldingLock();

    const check = verifyLedger(active, { publicKey: opts.site.publicKey });
    if (!check.valid || check.unsigned > 0) {
      throw new Error(`active segment does not verify before sealing: ${check.reason}`);
    }
    const classes: Partial<Record<RetentionClass, number>> = {};
    for (const e of readEvents(active)) {
      const c = retentionClassOf(e.event_type);
      classes[c] = (classes[c] ?? 0) + 1;
    }
    const longest = Math.max(
      ...Object.keys(classes).map((c) => RETENTION_MONTHS[c as RetentionClass]),
    );
    const raw = readFileSync(active);
    const body: SegmentSealBody = {
      v: 1,
      format: 'aegis-pilot-segment/1',
      siteId,
      keyId: opts.site.manifest.keyId,
      index,
      file: `${String(index).padStart(6, '0')}.jsonl`,
      sha256: sha256(raw),
      bytes: raw.length,
      count: check.count,
      firstTimestamp: check.firstTimestamp ?? '',
      lastTimestamp: check.lastTimestamp ?? '',
      headHash: check.headHash,
      sealedAt: now().toISOString(),
      reason,
      prevSeal: last ? sealDigest(last) : null,
      retention: { classes, retainUntil: addMonthsUtc(check.lastTimestamp ?? '', longest) },
    };
    const seal: SegmentSeal = { ...body, sig: opts.site.sign(body) };
    writeDurable(seg.seal(index), `${JSON.stringify(seal, null, 2)}\n`);
    // From here a crash leaves an interrupted roll, which the next call completes.
    return result(false, seal, rollTo(opts.stateDir, seal, ledgerOpts));
  } finally {
    if (release) release();
    else ledger.close();
  }
}

/**
 * Second half of a roll, idempotent: hard-link the active file as the sealed
 * segment (if not yet), build the next genesis in a fresh staging file, and
 * replace the active path with it in one rename. The caller holds the lock.
 */
function rollTo(
  stateDir: string,
  seal: SegmentSeal,
  ledgerOpts: LedgerOpenOptions,
  extra: Record<string, unknown> = {},
): { seq: number; hash: string } {
  const active = statePaths(stateDir).ledger;
  const seg = segmentPaths(stateDir);
  const file = seg.file(seal.index);
  const detail: Record<string, unknown> = { ...extra };
  // The active file matches the seal here, so a differing file at the segment path
  // is not ours. Move it aside (never delete it) and record that in the genesis.
  if (existsSync(file) && sha256(readFileSync(file)) !== seal.sha256) {
    const aside = `quarantine-${basename(file)}-${randomUUID()}`;
    renameSync(file, join(seg.dir, aside));
    detail.quarantined = aside;
  }
  if (!existsSync(file)) linkSync(active, file);
  if (sha256(readFileSync(file)) !== seal.sha256) {
    throw new Error(`segment ${seal.index} does not match its seal; refusing to roll`);
  }
  const staging = join(seg.dir, `.next-${randomUUID()}.jsonl`);
  writeFileSync(staging, '', { mode: 0o600, flag: 'wx' }); // O_EXCL: never an existing file or link
  try {
    const next = EvidenceLedger.open(staging, {
      ...ledgerOpts,
      genesisDetail: {
        ...detail,
        prev_segment: {
          index: seal.index,
          head_hash: seal.headHash,
          seal_digest: sealDigest(seal),
        },
      },
    });
    const head = next.head;
    next.close();
    fsyncPath(staging);
    renameSync(staging, active);
    fsyncPath(seg.dir);
    fsyncPath(dirname(active));
    return head;
  } finally {
    rmSync(staging, { force: true });
  }
}

export interface SegmentCheck {
  index: number;
  present: boolean;
  pruned: boolean;
  valid: boolean;
  reason: string | null;
  retainUntil: string | null;
}

export interface SegmentsVerification {
  valid: boolean;
  reason: string | null;
  segments: SegmentCheck[];
  active: LedgerVerification;
  /** Digest of the newest seal: compare with the anchor held outside the state directory. */
  lastSealDigest: string | null;
}

/**
 * Verify every sealed segment, the seal chain, the links between segments and
 * the active segment. A missing segment file is valid only after its retention
 * has expired (it was pruned); before that it is evidence loss. With
 * `expectSealDigest` (an anchor copied from `seal` output), a rollback of the
 * newest segments is also caught.
 */
export function verifySegments(
  stateDir: string,
  site: Pick<SiteAuthority, 'publicKey' | 'manifest'>,
  now: Date = new Date(),
  opts: { expectSealDigest?: string } = {},
): SegmentsVerification {
  const seg = segmentPaths(stateDir);
  const files = readSealFiles(stateDir);
  const seals: SegmentSeal[] = [];
  const segments: SegmentCheck[] = [];

  files.forEach((f, i) => {
    const check: SegmentCheck = {
      index: f.index,
      present: existsSync(seg.file(f.index)),
      pruned: false,
      valid: true,
      reason: null,
      retainUntil: null,
    };
    segments.push(check);
    const fail = (reason: string) => {
      check.valid = false;
      check.reason ??= reason;
    };
    if (f.index !== i) return fail(`seal sequence break: expected ${i}, found ${f.index}`);
    const s = f.seal;
    if (!s) return fail(f.error ?? 'unreadable seal');
    const prev = seals.at(-1);
    seals.push(s);
    check.retainUntil = s.retention?.retainUntil ?? null;
    const { sig, ...body } = s;
    if (s.index !== f.index) fail('seal index differs from its file name');
    if (s.keyId !== site.manifest.keyId) fail('seal signed by a different site key');
    if (typeof sig !== 'string' || !verifyPayload(body, sig, site.publicKey)) {
      fail('seal signature invalid');
    }
    if (s.prevSeal !== (prev ? sealDigest(prev) : null)) {
      fail('seal does not link to the previous seal');
    }
    if (i === files.length - 1 && interruptedRoll(stateDir, s)) {
      fail(`interrupted roll of segment ${s.index}: run "seal" to complete it`);
    } else if (check.present) {
      const file = seg.file(f.index);
      const raw = readFileSync(file);
      if (sha256(raw) !== s.sha256 || raw.length !== s.bytes) fail('segment file hash mismatch');
      const v = verifyLedger(file, { publicKey: site.publicKey });
      if (!v.valid) fail(`segment chain invalid: ${v.reason}`);
      else if (v.unsigned > 0) fail('segment holds unsigned events');
      else if (v.headHash !== s.headHash || v.count !== s.count) {
        fail('segment head differs from its seal');
      }
      const events = readEvents(file);
      if (events.at(-1)?.event_type !== 'system.segment_seal') {
        fail('segment does not end in its seal event');
      }
      if (prev && !linkMatches(linkOf(events[0]), prev)) {
        fail('segment genesis does not link to the previous segment');
      }
    } else if (!(Date.parse(check.retainUntil ?? '') <= now.getTime())) {
      fail(`segment file missing before its retention ends (${check.retainUntil})`);
    } else {
      check.pruned = true;
    }
  });

  const activePath = statePaths(stateDir).ledger;
  const active = verifyLedger(activePath, { publicKey: site.publicKey });
  const last = seals.length === files.length ? seals.at(-1) : undefined;
  const lastSealDigest = last ? sealDigest(last) : null;
  let reason = segments.find((c) => !c.valid)?.reason ?? null;
  if (!reason && interruptedRoll(stateDir, last)) {
    reason = `interrupted roll of segment ${last?.index}: run "seal" to complete it`;
  }
  if (!reason && !active.valid) reason = `active segment invalid: ${active.reason}`;
  if (!reason && active.unsigned > 0) reason = 'active segment holds unsigned events';
  if (!reason) {
    // Both directions: an active segment that links to a seal must find it (deleting
    // every seal and segment is caught), and one that links to none must have none.
    const link = linkOf(existsSync(activePath) ? readEvents(activePath)[0] : undefined);
    if (last && !linkMatches(link, last)) {
      reason = 'active segment genesis does not link to the last sealed segment';
    } else if (!last && link) {
      reason = `active segment links to sealed segment ${String(link.index)}, but no seals exist`;
    }
  }
  if (
    !reason &&
    opts.expectSealDigest &&
    !seals.some((s) => sealDigest(s) === opts.expectSealDigest)
  ) {
    reason = 'anchored seal not found: segments were rolled back or removed';
  }
  return { valid: reason === null, reason, segments, active, lastSealDigest };
}

export interface PruneResult {
  confirmed: boolean;
  /** Evaluation time; check it before confirming (a wrong clock deletes early). */
  now: string;
  /** Segments whose retention has ended (deleted when confirmed). */
  expired: Array<{ index: number; retainUntil: string; sha256: string }>;
  /** Pass back as `confirm` to delete exactly this list. Null when nothing expired. */
  confirmToken: string | null;
  /** After a confirmed prune: the segments still verify. */
  verifiedAfter?: boolean;
}

/**
 * Delete sealed segment files whose retention has ended. Without the matching
 * `confirm` token it only lists them, so a deletion is always of a list the
 * operator has seen. Refuses a chain that does not verify and a clock behind
 * the ledger. The seal stays, and every deletion is recorded (fsynced) in the
 * active segment before any file is removed.
 */
export function pruneExpiredSegments(opts: {
  stateDir: string;
  site: SiteAuthority;
  confirm?: string;
  now?: () => Date;
}): PruneResult {
  const now = opts.now ?? (() => new Date());
  const at = now();
  const check = verifySegments(opts.stateDir, opts.site, at);
  if (!check.valid) {
    throw new Error(`ledger segments do not verify (${check.reason}); refusing to prune`);
  }
  if (check.active.lastTimestamp && at.getTime() < Date.parse(check.active.lastTimestamp)) {
    throw new Error('clock is behind the newest ledger event; refusing to prune');
  }
  const seg = segmentPaths(opts.stateDir);
  const expired = readSeals(opts.stateDir)
    .filter((s) => existsSync(seg.file(s.index)))
    .filter((s) => Date.parse(s.retention.retainUntil) <= at.getTime())
    .map((s) => ({ index: s.index, retainUntil: s.retention.retainUntil, sha256: s.sha256 }));
  const confirmToken = expired.length ? sha256(canonicalJSON(expired)).slice(0, 12) : null;
  const base = { now: at.toISOString(), expired, confirmToken };
  if (!opts.confirm || !confirmToken) return { confirmed: false, ...base };
  if (opts.confirm !== confirmToken) {
    throw new Error('confirm token does not match the current list of expired segments');
  }

  const first = readEvents(statePaths(opts.stateDir).ledger)[0];
  const ledger = EvidenceLedger.open(statePaths(opts.stateDir).ledger, {
    siteId: opts.site.manifest.siteId,
    orgId: String(first?.detail.org_id ?? first?.org_id ?? opts.site.manifest.siteId),
    signer: (h) => opts.site.sign(h),
    publicKey: opts.site.publicKey,
    now,
  });
  try {
    // Record every deletion first: a crash after the records leaves expired files on
    // disk, which is harmless and pruned next time.
    for (const e of expired) {
      ledger.append({
        event_type: 'system.segment_pruned',
        trace_id: randomUUID(),
        detail: { segment_index: e.index, sha256: e.sha256, retain_until: e.retainUntil },
      });
    }
    for (const e of expired) unlinkSync(seg.file(e.index));
    fsyncPath(seg.dir);
  } finally {
    ledger.close();
  }
  const after = verifySegments(opts.stateDir, opts.site, at);
  return { confirmed: true, ...base, verifiedAfter: after.valid };
}

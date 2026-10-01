// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
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
 *
 * Scheduled seal and anchor export (EVIDENCE_FORMAT_v1.md §8–§9, HIC 01.10.2026):
 * `sealDue` says when the active segment must be sealed — after any human.override or
 * configuration change, on a shift change, and at least daily — and `runScheduledSeal`
 * seals it. After every seal the anchor {siteId, index, head_hash, seal_digest,
 * sealedAt} is queued (persisted, in order) and `anchorExport` sends it to the
 * customer-owned sinks: an append-only file for SIEM pickup and RFC 5424 syslog over
 * TCP/TLS. A failed export never blocks a seal: it is an incident, the queue is kept and
 * backfilled in order when the link returns, and the gap is reported.
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
  writeSync,
} from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { connect as netConnect, type Socket } from 'node:net';
import { connect as tlsConnect } from 'node:tls';
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
  /** With `force`: the reason recorded in the seal (e.g. the schedule trigger). */
  reason?: string;
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
  const r = sealActiveSegmentLocked(opts);
  // Queue the anchor for export. Never blocks the seal: anchorExport rebuilds a missing
  // queue entry from the seal files before it exports.
  if (r.sealed) {
    try {
      enqueueAnchors(opts.stateDir, opts.site.manifest.siteId);
    } catch {
      // recovered by the next anchorExport
    }
  }
  return r;
}

function sealActiveSegmentLocked(opts: SealOptions): SealResult {
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
    if (opts.force) reason = (opts.reason ?? 'forced').slice(0, 200);
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
// ---------------------------------------------------------------------------
// Scheduled seal (EVIDENCE_FORMAT_v1.md §8)
// ---------------------------------------------------------------------------

/** A seal older than max age plus this grace is overdue: an alert and an incident. */
export const SEAL_OVERDUE_GRACE_MS = 60 * 60 * 1000;

/** Configuration change events: each makes a seal due. */
export const CONFIG_CHANGE_EVENTS: ReadonlySet<string> = new Set([
  'authority.grant',
  'authority.revoke',
]);

export interface SealSchedule {
  /** Shift changes, UTC "HH:MM". */
  shiftChanges: readonly string[];
  /** At least daily: at most 1. */
  maxAgeDays: number;
}

export interface SealDue {
  due: boolean;
  reasons: string[];
  /** sealedAt of the newest seal; null before the first seal. */
  lastSealAt: string | null;
  /** What the age is measured from: the newest seal, else the active segment's first event. */
  since: string | null;
  ageMs: number;
  maxAgeMs: number;
  /** Older than max age plus SEAL_OVERDUE_GRACE_MS. */
  overdue: boolean;
}

/** The newest shift change in (fromMs, toMs], as "HH:MM", or null. */
function shiftCrossed(fromMs: number, toMs: number, shifts: readonly string[]): string | null {
  let best: { t: number; s: string } | null = null;
  const day = 86_400_000;
  for (let d = Math.floor(fromMs / day) * day; d <= toMs; d += day) {
    for (const s of shifts) {
      const [h, m] = s.split(':').map(Number);
      const t = d + (h * 60 + m) * 60_000;
      if (t > fromMs && t <= toMs && (!best || t > best.t)) best = { t, s };
    }
  }
  return best?.s ?? null;
}

export function sealDue(stateDir: string, schedule: SealSchedule, now: Date = new Date()): SealDue {
  if (!(schedule.maxAgeDays > 0 && schedule.maxAgeDays <= 1)) {
    throw new Error('seal schedule maxAgeDays must be in (0, 1]: at least daily');
  }
  const last = readSealFiles(stateDir)
    .map((f) => f.seal)
    .filter((x): x is SegmentSeal => !!x)
    .at(-1);
  const active = statePaths(stateDir).ledger;
  const events = existsSync(active) ? readEvents(active) : [];
  const lastSealAt = last?.sealedAt ?? null;
  const since = lastSealAt ?? events[0]?.timestamp ?? null;
  const t = now.getTime();
  const sinceMs = since ? Date.parse(since) : t;
  const ageMs = Math.max(0, t - sinceMs);
  const maxAgeMs = schedule.maxAgeDays * 86_400_000;
  const reasons: string[] = [];
  if (events.some((e) => e.event_type === 'human.override'))
    reasons.push('human.override since the last seal');
  if (events.some((e) => CONFIG_CHANGE_EVENTS.has(e.event_type)))
    reasons.push('configuration change since the last seal');
  const shift = shiftCrossed(sinceMs, t, schedule.shiftChanges);
  if (shift) reasons.push(`shift change ${shift} UTC`);
  if (ageMs >= maxAgeMs) reasons.push(`max age ${schedule.maxAgeDays} d`);
  return {
    due: reasons.length > 0,
    reasons,
    lastSealAt,
    since,
    ageMs,
    maxAgeMs,
    overdue: ageMs > maxAgeMs + SEAL_OVERDUE_GRACE_MS,
  };
}

const LEDGER_BUSY = /locked by running process|already open in this process/;

/** Open the active ledger for one append outside a run (keeps the genesis org id). */
function withActiveLedger<T>(
  stateDir: string,
  site: SiteAuthority,
  now: () => Date,
  fn: (l: EvidenceLedger) => T,
): T {
  const path = statePaths(stateDir).ledger;
  const first = existsSync(path) ? readEvents(path)[0] : undefined;
  const ledger = EvidenceLedger.open(path, {
    siteId: site.manifest.siteId,
    orgId: String(first?.detail.org_id ?? first?.org_id ?? site.manifest.siteId),
    signer: (h) => site.sign(h),
    publicKey: site.publicKey,
    now,
  });
  try {
    return fn(ledger);
  } finally {
    ledger.close();
  }
}

/**
 * Record an overdue seal as an incident, once per overdue period (not on every check).
 * 'written', 'already-recorded', or 'ledger-busy' when a run holds the ledger.
 */
export function recordSealOverdue(
  stateDir: string,
  site: SiteAuthority,
  due: SealDue,
  now: () => Date = () => new Date(),
): 'written' | 'already-recorded' | 'ledger-busy' {
  const active = statePaths(stateDir).ledger;
  if (
    existsSync(active) &&
    readEvents(active).some((e) => e.event_type === 'incident' && e.detail.kind === 'seal-overdue')
  )
    return 'already-recorded';
  try {
    withActiveLedger(stateDir, site, now, (l) =>
      l.append({
        event_type: 'incident',
        trace_id: randomUUID(),
        detail: {
          kind: 'seal-overdue',
          last_seal_at: due.lastSealAt,
          age_ms: due.ageMs,
          max_age_ms: due.maxAgeMs,
        },
      }),
    );
    return 'written';
  } catch (err) {
    if (LEDGER_BUSY.test((err as Error).message)) return 'ledger-busy';
    throw err;
  }
}

export interface ScheduledSealResult {
  due: SealDue;
  seal: SealResult | null;
  /** Set when a seal was due but a run holds the ledger; the next tick retries. */
  busy: string | null;
  /** Overdue after this tick (alert). */
  overdue: boolean;
  overdueIncident: 'written' | 'already-recorded' | 'ledger-busy' | null;
  anchor: AnchorExportResult;
}

/**
 * One tick of the seal schedule (cron/systemd timer: `aegis-pilot seal --scheduled`).
 * Seals when due, records an overdue seal as an incident, then exports every queued anchor.
 */
export async function runScheduledSeal(opts: {
  stateDir: string;
  site: SiteAuthority;
  schedule: SealSchedule;
  sinks: AnchorSinks;
  now?: () => Date;
}): Promise<ScheduledSealResult> {
  const now = opts.now ?? (() => new Date());
  const due = sealDue(opts.stateDir, opts.schedule, now());
  let seal: SealResult | null = null;
  let busy: string | null = null;
  if (due.due) {
    try {
      seal = sealActiveSegment({
        stateDir: opts.stateDir,
        site: opts.site,
        force: true,
        reason: `scheduled: ${due.reasons.join('; ')}`,
        now,
      });
    } catch (err) {
      const message = (err as Error).message;
      if (!LEDGER_BUSY.test(message)) throw err;
      busy = message;
    }
  }
  const after = seal?.sealed ? sealDue(opts.stateDir, opts.schedule, now()) : due;
  const overdueIncident = after.overdue
    ? recordSealOverdue(opts.stateDir, opts.site, after, now)
    : null;
  const anchor = await anchorExport({
    stateDir: opts.stateDir,
    site: opts.site,
    sinks: opts.sinks,
    now,
  });
  return { due, seal, busy, overdue: after.overdue, overdueIncident, anchor };
}

// ---------------------------------------------------------------------------
// Anchor export (EVIDENCE_FORMAT_v1.md §9)
// ---------------------------------------------------------------------------

/** What leaves the box after every seal. No personal data: ids, hashes, a time. */
export interface AnchorRecord {
  siteId: string;
  index: number;
  head_hash: string;
  seal_digest: string;
  sealedAt: string;
}

export interface AnchorSinks {
  /** Append-only local file for SIEM pickup. */
  file?: string | null;
  /** RFC 5424 over TCP (octet-counted framing, RFC 6587), TLS per RFC 5425. */
  syslog?: {
    host: string;
    port: number;
    tls: boolean;
    caFile?: string;
    servername?: string;
    timeoutMs?: number;
  } | null;
}

export type AnchorSinkName = 'file' | 'syslog';

interface SinkState {
  /** Queue entries exported to this sink (a prefix of the queue). */
  exported: number;
  lastSuccessAt: string | null;
  lastError: string | null;
  /** First failed export of the current outage; null when the sink is healthy. */
  failingSince: string | null;
}

export interface AnchorGap {
  sink: AnchorSinkName;
  firstFailedAt: string;
  firstSuccessAt: string;
  /** Records sent in order when the link returned. */
  backfilled: number;
}

interface AnchorState {
  v: 1;
  sinks: Partial<Record<AnchorSinkName, SinkState>>;
  gaps: AnchorGap[];
  /** Incidents that could not be written yet (a run held the ledger). */
  pendingIncidents: Array<Record<string, unknown>>;
}

export interface AnchorSinkStatus extends SinkState {
  sink: AnchorSinkName;
  pending: number;
}

export interface AnchorExportResult {
  queued: number;
  exportedNow: number;
  sinks: AnchorSinkStatus[];
  /** Closed gaps: first failed and first successful export time, per sink. */
  gaps: AnchorGap[];
  /** Sinks failing now. */
  failing: AnchorSinkName[];
  pendingIncidents: number;
}

export function anchorPaths(stateDir: string) {
  const dir = join(stateDir, 'anchor');
  return {
    dir,
    queue: join(dir, 'queue.jsonl'),
    state: join(dir, 'state.json'),
  };
}

export function readAnchorQueue(stateDir: string): AnchorRecord[] {
  const { queue } = anchorPaths(stateDir);
  return existsSync(queue) ? (readEvents(queue) as unknown as AnchorRecord[]) : [];
}

function readAnchorState(stateDir: string): AnchorState {
  const { state } = anchorPaths(stateDir);
  if (!existsSync(state)) return { v: 1, sinks: {}, gaps: [], pendingIncidents: [] };
  return JSON.parse(readFileSync(state, 'utf8')) as AnchorState;
}

const emptySink = (): SinkState => ({
  exported: 0,
  lastSuccessAt: null,
  lastError: null,
  failingSince: null,
});

/** Append every seal not yet queued, in index order. Idempotent. */
export function enqueueAnchors(stateDir: string, siteId: string): AnchorRecord[] {
  const { dir, queue } = anchorPaths(stateDir);
  const have = new Set(readAnchorQueue(stateDir).map((r) => r.index));
  const add: AnchorRecord[] = readSeals(stateDir)
    .filter((s) => !have.has(s.index))
    .map((s) => ({
      siteId,
      index: s.index,
      head_hash: s.headHash,
      seal_digest: sealDigest(s),
      sealedAt: s.sealedAt,
    }));
  if (add.length) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    appendLines(queue, add, 0o600);
  }
  return readAnchorQueue(stateDir);
}

function appendLines(path: string, records: readonly AnchorRecord[], mode: number): void {
  const fd = openSync(path, 'a', mode);
  try {
    for (const r of records) writeSync(fd, `${canonicalJSON(r)}\n`);
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
}

const BOM = '\uFEFF';

/** RFC 5424 message with RFC 6587 octet-counting framing. MSG is UTF-8 with BOM. */
export function syslogFrame(record: AnchorRecord, at: Date): string {
  const msg = `<133>1 ${at.toISOString()} ${record.siteId} aegis-pilot - SEAL_ANCHOR - ${BOM}${canonicalJSON(record)}`;
  return `${Buffer.byteLength(msg, 'utf8')} ${msg}`;
}

function sendSyslog(cfg: NonNullable<AnchorSinks['syslog']>, payload: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const sock: Socket = cfg.tls
      ? tlsConnect({
          host: cfg.host,
          port: cfg.port,
          servername: cfg.servername ?? cfg.host,
          ca: cfg.caFile ? readFileSync(cfg.caFile) : undefined,
        })
      : netConnect({ host: cfg.host, port: cfg.port });
    const timer = setTimeout(() => {
      sock.destroy();
      finish(new Error(`syslog ${cfg.host}:${cfg.port}: timeout`));
    }, cfg.timeoutMs ?? 10_000);
    function finish(err?: Error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (err) reject(err);
      else resolve();
    }
    sock.once(cfg.tls ? 'secureConnect' : 'connect', () => sock.end(payload));
    sock.once('error', (err) => finish(err));
    // Delivered when the receiver closed its side after reading everything we sent.
    sock.once('close', (hadError) => {
      if (!hadError) finish();
    });
  });
}

/**
 * Export every queued anchor not yet delivered, per sink, in queue order. A failure is
 * recorded as an incident (once per outage) and kept in the queue; the recovery closes
 * the gap and is recorded too. Never throws on a sink failure.
 */
export async function anchorExport(opts: {
  stateDir: string;
  site?: SiteAuthority;
  sinks: AnchorSinks;
  now?: () => Date;
  /** Record an incident; defaults to appending to the active ledger with the site key. */
  recordIncident?: (detail: Record<string, unknown>) => void;
}): Promise<AnchorExportResult> {
  const now = opts.now ?? (() => new Date());
  const siteId =
    opts.site?.manifest.siteId ?? readAnchorQueue(opts.stateDir)[0]?.siteId ?? 'unknown';
  const queue = enqueueAnchors(opts.stateDir, siteId);
  const state = readAnchorState(opts.stateDir);
  const site = opts.site;
  const record =
    opts.recordIncident ??
    (site
      ? (detail: Record<string, unknown>) =>
          withActiveLedger(opts.stateDir, site, now, (l) =>
            l.append({
              event_type: 'incident',
              trace_id: randomUUID(),
              detail,
            }),
          )
      : null);

  let exportedNow = 0;
  const sinks: AnchorSinkStatus[] = [];
  const configured: Array<[AnchorSinkName, (rs: AnchorRecord[]) => Promise<void>]> = [];
  const filePath = opts.sinks.file;
  if (filePath)
    configured.push([
      'file',
      async (rs) => {
        mkdirSync(dirname(filePath), { recursive: true });
        appendLines(filePath, rs, 0o644);
      },
    ]);
  const syslog = opts.sinks.syslog;
  if (syslog)
    configured.push([
      'syslog',
      (rs) => sendSyslog(syslog, rs.map((r) => syslogFrame(r, now())).join('')),
    ]);
  for (const [name, send] of configured) {
    const st = state.sinks[name] ?? emptySink();
    const pending = queue.slice(st.exported);
    if (pending.length) {
      try {
        await send(pending);
        st.exported = queue.length;
        exportedNow += pending.length;
        st.lastSuccessAt = now().toISOString();
        if (st.failingSince) {
          const gap: AnchorGap = {
            sink: name,
            firstFailedAt: st.failingSince,
            firstSuccessAt: st.lastSuccessAt,
            backfilled: pending.length,
          };
          state.gaps.push(gap);
          state.pendingIncidents.push({
            kind: 'anchor-export-recovered',
            sink: name,
            first_failed_at: gap.firstFailedAt,
            first_success_at: gap.firstSuccessAt,
            backfilled: gap.backfilled,
          });
        }
        st.failingSince = null;
        st.lastError = null;
      } catch (err) {
        st.lastError = String((err as Error)?.message ?? err).slice(0, 200);
        if (!st.failingSince) {
          st.failingSince = now().toISOString();
          state.pendingIncidents.push({
            kind: 'anchor-export-failed',
            sink: name,
            error: st.lastError,
            pending: pending.length,
          });
        }
      }
    }
    state.sinks[name] = st;
    sinks.push({ sink: name, ...st, pending: queue.length - st.exported });
  }
  // Incidents in order; one that cannot be written (a run holds the ledger) waits.
  if (record) {
    while (state.pendingIncidents.length) {
      try {
        record(state.pendingIncidents[0]);
      } catch {
        break;
      }
      state.pendingIncidents.shift();
    }
  }
  const { dir, state: statePath } = anchorPaths(opts.stateDir);
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  writeDurable(statePath, `${JSON.stringify(state, null, 2)}\n`);
  return {
    queued: queue.length,
    exportedNow,
    sinks,
    gaps: state.gaps,
    failing: sinks.filter((s) => s.failingSince).map((s) => s.sink),
    pendingIncidents: state.pendingIncidents.length,
  };
}

/** Read-only anchor export status (seal-status, doctor). */
export function anchorStatus(stateDir: string, sinks: AnchorSinks): AnchorExportResult {
  const queue = readAnchorQueue(stateDir);
  const sealed = readSealFiles(stateDir).length;
  const state = readAnchorState(stateDir);
  // Seals not yet queued (a crash between seal and enqueue) are pending too.
  const total = Math.max(queue.length, sealed);
  const names: AnchorSinkName[] = [];
  if (sinks.file) names.push('file');
  if (sinks.syslog) names.push('syslog');
  const status = names.map((sink) => {
    const st = state.sinks[sink] ?? emptySink();
    return { sink, ...st, pending: total - st.exported };
  });
  return {
    queued: total,
    exportedNow: 0,
    sinks: status,
    gaps: state.gaps,
    failing: status.filter((s) => s.failingSince).map((s) => s.sink),
    pendingIncidents: state.pendingIncidents.length,
  };
}

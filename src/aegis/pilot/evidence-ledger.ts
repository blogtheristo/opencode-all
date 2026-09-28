// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/evidence-ledger.ts
/**
 * Aegis Pilot — local Article 12 evidence ledger (PRODUCT_AEGIS_PILOT.md, requirement 1).
 *
 * The existing Article12Logger writes to Postgres and throws without
 * INTERNAL_DB_URL; AegisDurableStore degrades to process memory. Neither can
 * satisfy acceptance condition (ii) — "the Article 12 record was written
 * locally throughout, with no gap" — on a site whose database is a network
 * hop away. This ledger can: an append-only JSONL file on local disk, one
 * fsync per event, hash-chained per DWS_ARTICLE_12_LOGGING_STANDARD.md §3
 * (event_hash = sha256(prev_hash + canonical_event_json)), each hash signed
 * with the site Ed25519 key.
 *
 * Integrity rules (Rule 12, fail loud):
 *   - Opening a ledger whose chain does not verify is refused. Appending to a
 *     tampered chain would bury the tampering under fresh valid entries.
 *   - A torn final line (power loss mid-write) is refused unless the caller
 *     opts into repair, which truncates the partial line and records an
 *     `incident` event naming the bytes discarded.
 *   - One writer per ledger file, enforced with an O_EXCL lock file.
 *
 * Record content: digests, identifiers and short operational detail only.
 * Raw inputs and outputs are never written (Aegis tier mandates tokenisation).
 */

import {
  closeSync,
  existsSync,
  fsyncSync,
  ftruncateSync,
  mkdirSync,
  openSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
  writeSync,
} from 'node:fs';
import { dirname } from 'node:path';
import { type KeyObject, randomUUID } from 'node:crypto';
import { canonicalJSON, sha256, verifyPayload } from './crypto.js';

export const GENESIS_HASH = '0'.repeat(64);

export type LedgerEventType =
  // DWS_ARTICLE_12_LOGGING_STANDARD.md §3 enum
  | 'agent.decide'
  | 'tool.invoke'
  | 'human.override'
  | 'incident'
  // Pilot operational events (proposed §3 extension — see field note 2026-09-28)
  | 'system.genesis'
  | 'system.heartbeat'
  | 'system.uplink_probe'
  | 'system.degraded'
  | 'system.reconcile'
  | 'system.agent_terminated'
  | 'workflow.start'
  | 'workflow.complete'
  | 'workflow.failed'
  | 'acceptance.record'
  | 'authority.grant'
  | 'authority.revoke';

export interface LedgerEventInput {
  event_type: LedgerEventType;
  trace_id: string;
  agent_id?: string | null;
  operator_id?: string | null;
  capability_manifest_hash?: string | null;
  model_version?: string | null;
  input_digest?: string | null;
  output_digest?: string | null;
  confidence?: number | null;
  /** Small, non-personal operational detail. Never raw inputs/outputs. */
  detail?: Record<string, unknown>;
}

export interface LedgerEvent {
  seq: number;
  event_id: string;
  event_type: LedgerEventType;
  timestamp: string;
  site_id: string;
  org_id: string;
  trace_id: string;
  agent_id: string | null;
  operator_id: string | null;
  capability_manifest_hash: string | null;
  model_version: string | null;
  input_digest: string | null;
  output_digest: string | null;
  confidence: number | null;
  detail: Record<string, unknown>;
  prev_hash: string;
  event_hash: string;
  /** Ed25519 signature (base64url) over event_hash by the site key; null only if no signer. */
  sig: string | null;
}

export interface LedgerOptions {
  siteId: string;
  orgId: string;
  /** Signs an event hash. Pass SiteAuthority.sign; omit only in unit tests. */
  signer?: (eventHash: string) => string;
  now?: () => Date;
  /** Site public key: when given, signatures are verified on open, not only at acceptance time. */
  publicKey?: KeyObject;
  /** Truncate a torn final line (crash mid-write) and log it as an incident instead of refusing. */
  repairTornTail?: boolean;
}

export interface LedgerVerification {
  valid: boolean;
  count: number;
  brokenAtSeq: number | null;
  reason: string | null;
  headHash: string;
  firstTimestamp: string | null;
  lastTimestamp: string | null;
  unsigned: number;
  /** Intervals between consecutive events longer than maxGapMs, inside the window. */
  gaps: Array<{ afterSeq: number; gapMs: number }>;
  tornTail: boolean;
}

function hashOf(event: Omit<LedgerEvent, 'event_hash' | 'sig'>): string {
  return sha256(event.prev_hash + canonicalJSON(event));
}

interface ParsedLedger {
  events: LedgerEvent[];
  tornTail: boolean;
  /** Byte length of the fully-written prefix (everything before a torn tail). */
  goodBytes: number;
}

function parseLedger(path: string): ParsedLedger {
  if (!existsSync(path)) return { events: [], tornTail: false, goodBytes: 0 };
  const raw = readFileSync(path, 'utf8');
  const events: LedgerEvent[] = [];
  let offset = 0;
  let tornTail = false;
  while (offset < raw.length) {
    const nl = raw.indexOf('\n', offset);
    if (nl === -1) {
      tornTail = true;
      break;
    }
    const line = raw.slice(offset, nl);
    if (line.trim()) events.push(JSON.parse(line) as LedgerEvent);
    offset = nl + 1;
  }
  return { events, tornTail, goodBytes: Buffer.byteLength(raw.slice(0, offset), 'utf8') };
}

/**
 * Verify a ledger file. Pure read; safe to run while a writer is active.
 * Window bounds (`from`/`to`) restrict gap detection to an acceptance window.
 */
export function verifyLedger(
  path: string,
  opts: { publicKey?: KeyObject; maxGapMs?: number; from?: Date; to?: Date } = {},
): LedgerVerification {
  const { events, tornTail } = parseLedger(path);
  const result: LedgerVerification = {
    valid: true,
    count: events.length,
    brokenAtSeq: null,
    reason: null,
    headHash: GENESIS_HASH,
    firstTimestamp: events[0]?.timestamp ?? null,
    lastTimestamp: events.at(-1)?.timestamp ?? null,
    unsigned: 0,
    gaps: [],
    tornTail,
  };
  const fail = (seq: number, reason: string) => {
    result.valid = false;
    result.brokenAtSeq = seq;
    result.reason = reason;
    return result;
  };

  let prev = GENESIS_HASH;
  let prevTs: number | null = null;
  const from = opts.from?.getTime() ?? -Infinity;
  const to = opts.to?.getTime() ?? Infinity;

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (e.seq !== i) return fail(i, `sequence break: expected ${i}, found ${e.seq}`);
    if (e.prev_hash !== prev) return fail(e.seq, 'prev_hash does not link to previous event');
    const { event_hash, sig, ...body } = e;
    if (hashOf(body) !== event_hash) return fail(e.seq, 'event_hash does not match event content');
    if (sig === null) {
      result.unsigned++;
    } else if (opts.publicKey && !verifyPayload(event_hash, sig, opts.publicKey)) {
      return fail(e.seq, 'site signature invalid');
    }
    const ts = Date.parse(e.timestamp);
    if (Number.isNaN(ts)) return fail(e.seq, 'unparseable timestamp');
    if (prevTs !== null) {
      if (ts < prevTs) return fail(e.seq, 'timestamp moved backwards');
      if (
        opts.maxGapMs !== undefined &&
        ts >= from &&
        prevTs <= to &&
        ts - prevTs > opts.maxGapMs
      ) {
        result.gaps.push({ afterSeq: e.seq - 1, gapMs: ts - prevTs });
      }
    }
    prevTs = ts;
    prev = event_hash;
  }
  result.headHash = prev;
  if (tornTail) {
    result.valid = false;
    result.reason ??= 'torn final line (incomplete write)';
    result.brokenAtSeq ??= events.length;
  }
  return result;
}

export class EvidenceLedger {
  private fd: number;
  private seq: number;
  private prevHash: string;
  private closed = false;
  private readonly lockPath: string;
  private readonly now: () => Date;

  private constructor(
    readonly path: string,
    private readonly opts: LedgerOptions,
    state: { fd: number; seq: number; prevHash: string; lockPath: string },
  ) {
    this.fd = state.fd;
    this.seq = state.seq;
    this.prevHash = state.prevHash;
    this.lockPath = state.lockPath;
    this.now = opts.now ?? (() => new Date());
  }

  static open(path: string, opts: LedgerOptions): EvidenceLedger {
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    const lockPath = `${path}.lock`;
    acquireLock(lockPath);
    try {
      const parsed = parseLedger(path);
      let tornBytes = 0;
      if (parsed.tornTail) {
        if (!opts.repairTornTail) {
          throw new Error(
            `ledger ${path} ends in a torn line (incomplete write). Re-open with repairTornTail to truncate it and record an incident.`,
          );
        }
        tornBytes = statSync(path).size - parsed.goodBytes;
        const tfd = openSync(path, 'r+');
        ftruncateSync(tfd, parsed.goodBytes);
        fsyncSync(tfd);
        closeSync(tfd);
      }
      const check = verifyLedger(path, { publicKey: opts.publicKey });
      if (check.valid && opts.publicKey && check.unsigned > 0) {
        throw new Error(
          `ledger ${path} holds ${check.unsigned} unsigned event(s) but a site key is configured. Refusing to append to an unauthenticated chain.`,
        );
      }
      if (!check.valid) {
        throw new Error(
          `ledger ${path} failed verification at seq ${check.brokenAtSeq}: ${check.reason}. Refusing to append to a broken chain.`,
        );
      }
      const fd = openSync(path, 'a', 0o600);
      const ledger = new EvidenceLedger(path, opts, {
        fd,
        seq: check.count,
        prevHash: check.headHash,
        lockPath,
      });
      if (check.count === 0) {
        ledger.append({
          event_type: 'system.genesis',
          trace_id: randomUUID(),
          detail: { site_id: opts.siteId, org_id: opts.orgId, format: 'aegis-pilot-ledger/1' },
        });
      }
      if (tornBytes > 0) {
        ledger.append({
          event_type: 'incident',
          trace_id: randomUUID(),
          detail: { kind: 'torn-tail-repaired', bytes_discarded: tornBytes },
        });
      }
      return ledger;
    } catch (err) {
      releaseLock(lockPath);
      throw err;
    }
  }

  get head(): { seq: number; hash: string } {
    return { seq: this.seq - 1, hash: this.prevHash };
  }

  /** Append one event: write, fsync, then advance the chain. Synchronous by design. */
  append(input: LedgerEventInput): LedgerEvent {
    if (this.closed) throw new Error('ledger is closed');
    const body: Omit<LedgerEvent, 'event_hash' | 'sig'> = {
      seq: this.seq,
      event_id: randomUUID(),
      event_type: input.event_type,
      timestamp: this.now().toISOString(),
      site_id: this.opts.siteId,
      org_id: this.opts.orgId,
      trace_id: input.trace_id,
      agent_id: input.agent_id ?? null,
      operator_id: input.operator_id ?? null,
      capability_manifest_hash: input.capability_manifest_hash ?? null,
      model_version: input.model_version ?? null,
      input_digest: input.input_digest ?? null,
      output_digest: input.output_digest ?? null,
      confidence: input.confidence ?? null,
      detail: input.detail ?? {},
      prev_hash: this.prevHash,
    };
    const event_hash = hashOf(body);
    const event: LedgerEvent = {
      ...body,
      event_hash,
      sig: this.opts.signer ? this.opts.signer(event_hash) : null,
    };
    writeSync(this.fd, `${JSON.stringify(event)}\n`);
    fsyncSync(this.fd);
    this.seq++;
    this.prevHash = event_hash;
    return event;
  }

  /** Periodic heartbeat so "no gap" is measurable, not inferred. Returns a stop function. */
  startHeartbeat(intervalMs: number, traceId: string): () => void {
    const timer = setInterval(() => {
      if (!this.closed) this.append({ event_type: 'system.heartbeat', trace_id: traceId });
    }, intervalMs);
    timer.unref?.();
    return () => clearInterval(timer);
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    closeSync(this.fd);
    releaseLock(this.lockPath);
  }
}

function pidAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    return (err as NodeJS.ErrnoException).code === 'EPERM';
  }
}

function acquireLock(lockPath: string): void {
  try {
    writeFileSync(lockPath, String(process.pid), { flag: 'wx', mode: 0o600 });
    return;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'EEXIST') throw err;
  }
  const holder = Number.parseInt(readFileSync(lockPath, 'utf8'), 10);
  if (Number.isFinite(holder) && holder !== process.pid && pidAlive(holder)) {
    throw new Error(`ledger is locked by running process ${holder} (${lockPath})`);
  }
  if (holder === process.pid) {
    throw new Error(`ledger already open in this process (${lockPath})`);
  }
  // Stale lock from a dead process: take it over.
  unlinkSync(lockPath);
  writeFileSync(lockPath, String(process.pid), { flag: 'wx', mode: 0o600 });
}

function releaseLock(lockPath: string): void {
  try {
    unlinkSync(lockPath);
  } catch {
    // already gone
  }
}

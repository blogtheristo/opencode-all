/**
 * Aegis Durable Store — replay/nonce dedup + hash-chained audit trail
 *
 * Closes RELEASE-READINESS.md BLOCKED item 1: the prior implementation kept
 * both structures in a process-local `Set`/`Array` on `AegisAgent`, lost on
 * restart and not shared across horizontally scaled instances.
 *
 * Backing store: Postgres via the shared `internal-db.ts` pool
 * (`aegis_audit_chain`, infrastructure/dgx-spark/migrations/023_aegis_audit_chain.sql).
 *
 * Why Postgres and not Redis, even though this repo already uses ioredis
 * elsewhere (src/services/redis-rate-limiter.service.ts,
 * redis-token-blacklist.service.ts): those existing Redis usages are all
 * ephemeral, TTL'd data (rate-limit counters, revoked-token markers) where
 * losing a key on eviction is an acceptable, expected outcome. An
 * EU AI Act Article 12 hash-chained audit trail needs the opposite property
 * — permanent, ordered, never-evicted rows — which is exactly what this
 * repo's existing durable-audit convention already uses Postgres for
 * (article12_audit_log, command_audit_log). Rule 7 (surface conflicts,
 * don't average): this is a deliberate choice to reuse the audit-log
 * convention, not an oversight of the Redis option.
 *
 * Hash-chain algorithm is UNCHANGED from the prior in-memory implementation
 * (see the SQL migration header) — only the persistence layer moved.
 *
 * Two-phase API (reserve / finalize), mirroring the original synchronous
 * ordering in aegis.agent.ts: replay must be detected and rejected BEFORE
 * sub-agents run (so a replayed request never re-executes side-effecting
 * work), but the entry's hash covers `resultSummary`, which is only known
 * AFTER sub-agents run. `reserve()` performs the atomic replay-check +
 * fingerprint-claim (a Postgres UNIQUE constraint on request_fingerprint
 * under an advisory lock — or, in degraded mode, the same in-memory Set the
 * old implementation used); `finalize()` computes and persists the real
 * hash once the result summary is known.
 *
 * Degraded mode: if the pool is unavailable at call time (INTERNAL_DB_URL
 * unset, or a mid-operation connection failure), both phases fall back to
 * an in-memory buffer — the exact behavior AegisAgent had before this
 * change — and callers are told via `durable: false` on the returned entry /
 * verification result. Nothing is silently dropped (Rule 12, Fail Loud).
 */

import { createHash } from 'node:crypto';
import type { Pool, PoolClient } from 'pg';
import { getInternalDbPool } from '../config/internal-db.js';
import logger from '../utils/logger.js';

export interface AegisAuditEntry {
  seq: number;
  timestamp: string;
  sessionId: string;
  action: string;
  /** sha256(sessionId + action + JSON(subInput)) — also the replay-protection key */
  requestFingerprint: string;
  /** sha256 of this entry's own fields (excluding entryHash) chained to prevHash */
  entryHash: string;
  prevHash: string;
  resultSummary: string;
  /** false when this entry lives only in the in-process fallback buffer (degraded mode) */
  durable: boolean;
}

export interface ChainVerification {
  valid: boolean;
  brokenAtSeq: number | null;
  /** true if verification covered durably-stored rows; false if it fell back to the in-memory buffer */
  durable: boolean;
}

/** Opaque handle returned by reserve(), passed to finalize(). */
export interface ReservationHandle {
  seq: number;
  timestamp: string;
  sessionId: string;
  action: string;
  requestFingerprint: string;
  /**
   * Fallback-mode only: prevHash is already known at reserve() time because
   * the in-memory buffer is inherently single-threaded. Durable reservations
   * leave this null — finalize() resolves prevHash itself, under the
   * advisory lock, from the last *completed* (finalized) row, not the last
   * *reserved* one. Two concurrent reservations racing ahead of their
   * finalizes would otherwise both compute a prevHash pointing at the same
   * not-yet-finalized (still-empty-hash) row and fork the chain.
   */
  prevHash: string | null;
  durable: boolean;
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

const GENESIS_HASH = '0'.repeat(64);

/** Recompute this entry's hash from its own fields — same formula on both sides of the store. */
function computeEntryHash(
  seq: number,
  timestamp: string,
  sessionId: string,
  action: string,
  requestFingerprint: string,
  prevHash: string,
  resultSummary: string,
): string {
  return sha256(
    `${seq}|${timestamp}|${sessionId}|${action}|${requestFingerprint}|${prevHash}|${resultSummary}`,
  );
}

/** Advisory-lock key so two Aegis instances reserving concurrently against the same
 * Postgres backend never fork the chain (same intent as command_audit_log's trigger). */
const CHAIN_LOCK_KEY = "hashtext('aegis_audit_chain')";

interface FallbackSlot {
  seq: number;
  timestamp: string;
  sessionId: string;
  action: string;
  requestFingerprint: string;
  prevHash: string;
  resultSummary: string | null;
  entryHash: string | null;
  readonly durable: false;
}

export class AegisDurableStore {
  // In-memory fallback — only ever populated in degraded mode (no DB, or a
  // mid-operation DB failure). Per-process, matches the pre-durability
  // behavior exactly so degraded mode never regresses below the old baseline.
  private fallbackChain: FallbackSlot[] = [];
  private fallbackFingerprints = new Set<string>();

  /**
   * Optional injected pool (same convention as CommandAuditLogger's
   * `constructor(pool?: Pool)` — src/mcp/command-audit-logger.ts): defaults
   * to the shared internal-ops singleton, but tests can pass a pool pointed
   * at a specific database, or swap it at runtime via `setPoolForTests()`
   * to exercise reconnection without fighting getInternalDbPool()'s
   * module-level pool cache.
   */
  constructor(private injectedPool?: Pool | null) {}

  /** Test-only: point this store at a different pool (or null) without constructing a new instance. */
  setPoolForTests(pool: Pool | null): void {
    this.injectedPool = pool;
  }

  private getPool(): Pool | null {
    return this.injectedPool !== undefined ? this.injectedPool : getInternalDbPool();
  }

  /** Test-only reset. Production processes never need to clear this. */
  resetForTests(): void {
    this.fallbackChain = [];
    this.fallbackFingerprints = new Set();
  }

  /**
   * Phase 1: atomically check-and-claim a request fingerprint, before any
   * side-effecting work runs. Returns `{ replay: true }` if this
   * fingerprint was already claimed (durably or in the fallback buffer).
   */
  async reserve(
    sessionId: string,
    action: string,
    requestFingerprint: string,
  ): Promise<{ replay: true } | { replay: false; handle: ReservationHandle }> {
    const pool = this.getPool();
    if (!pool) return this.reserveFallback(sessionId, action, requestFingerprint);

    let client: PoolClient;
    try {
      client = await pool.connect();
    } catch (err) {
      logger.warn('Aegis: durable store connect failed — falling back to in-memory chain', {
        error: err instanceof Error ? err.message : String(err),
      });
      return this.reserveFallback(sessionId, action, requestFingerprint);
    }

    try {
      await client.query('BEGIN');
      await client.query(`SELECT pg_advisory_xact_lock(${CHAIN_LOCK_KEY})`);

      const existing = await client.query(
        'SELECT 1 FROM aegis_audit_chain WHERE request_fingerprint = $1',
        [requestFingerprint],
      );
      if ((existing.rowCount ?? 0) > 0) {
        await client.query('COMMIT');
        return { replay: true };
      }

      // prev_hash is intentionally left NULL here — resolved by finalize()
      // under the same advisory lock, from the last row that has actually
      // completed (entry_hash IS NOT NULL). See ReservationHandle.prevHash.
      const timestamp = new Date().toISOString();
      const inserted = await client.query(
        `INSERT INTO aegis_audit_chain
           (entry_timestamp, session_id, action, request_fingerprint, prev_hash, entry_hash, result_summary)
         VALUES ($1,$2,$3,$4,NULL,NULL,NULL)
         RETURNING seq`,
        [timestamp, sessionId, action, requestFingerprint],
      );
      const seq = Number(inserted.rows[0].seq);
      await client.query('COMMIT');

      return {
        replay: false,
        handle: {
          seq,
          timestamp,
          sessionId,
          action,
          requestFingerprint,
          prevHash: null,
          durable: true,
        },
      };
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      logger.warn(
        'Aegis: durable store reserve failed mid-operation — falling back to in-memory chain',
        {
          error: err instanceof Error ? err.message : String(err),
        },
      );
      return this.reserveFallback(sessionId, action, requestFingerprint);
    } finally {
      client.release();
    }
  }

  private reserveFallback(
    sessionId: string,
    action: string,
    requestFingerprint: string,
  ): { replay: true } | { replay: false; handle: ReservationHandle } {
    if (this.fallbackFingerprints.has(requestFingerprint)) {
      return { replay: true };
    }
    this.fallbackFingerprints.add(requestFingerprint);

    const prevHash =
      this.fallbackChain.length > 0
        ? (this.fallbackChain[this.fallbackChain.length - 1].entryHash ?? GENESIS_HASH)
        : GENESIS_HASH;
    const seq = this.fallbackChain.length + 1;
    const timestamp = new Date().toISOString();
    this.fallbackChain.push({
      seq,
      timestamp,
      sessionId,
      action,
      requestFingerprint,
      prevHash,
      resultSummary: null,
      entryHash: null,
      durable: false,
    });
    return {
      replay: false,
      handle: { seq, timestamp, sessionId, action, requestFingerprint, prevHash, durable: false },
    };
  }

  /**
   * Phase 2: resolve prevHash from the last *completed* row (durable path
   * only — fallback already knows its prevHash from reserve()), compute the
   * real hash now that resultSummary is known, and persist it.
   * `handle.durable` says which backing this reservation used; finalize
   * always writes back to that same backing, even if the DB came back
   * online (or went offline) between reserve() and finalize() — see the
   * mid-operation-failure test for what happens when it goes offline here.
   */
  async finalize(handle: ReservationHandle, resultSummary: string): Promise<AegisAuditEntry> {
    if (!handle.durable) {
      // Fallback reservations already carry a resolved prevHash (the
      // in-memory buffer is single-threaded — no concurrent-finalize race).
      const prevHash = handle.prevHash ?? GENESIS_HASH;
      const entryHash = computeEntryHash(
        handle.seq,
        handle.timestamp,
        handle.sessionId,
        handle.action,
        handle.requestFingerprint,
        prevHash,
        resultSummary,
      );
      const slot = this.fallbackChain.find((s) => s.seq === handle.seq);
      if (slot) {
        slot.resultSummary = resultSummary;
        slot.entryHash = entryHash;
      }
      return { ...handle, prevHash, resultSummary, entryHash, durable: false };
    }

    const pool = this.getPool();
    if (!pool) {
      // DB reachable at reserve() time but gone by finalize(): the
      // fingerprint claim is durable (replay protection still holds — the
      // bare row exists with entry_hash NULL) but the hash-chain completion
      // itself did not persist. Report a best-effort entry (never drop it —
      // Rule 12) but mark durable:false so the caller surfaces this exactly
      // like any other degraded-mode entry: it is NOT yet a verifiable part
      // of the durable chain. An operator can find these via
      // `SELECT * FROM aegis_audit_chain WHERE entry_hash IS NULL` and
      // decide whether to re-finalize or accept the gap.
      logger.warn(
        'Aegis: durable store finalize could not reach pool — row reserved durably but completion write skipped',
        { seq: handle.seq },
      );
      const entryHash = computeEntryHash(
        handle.seq,
        handle.timestamp,
        handle.sessionId,
        handle.action,
        handle.requestFingerprint,
        GENESIS_HASH,
        resultSummary,
      );
      return { ...handle, prevHash: GENESIS_HASH, resultSummary, entryHash, durable: false };
    }

    let client: PoolClient;
    try {
      client = await pool.connect();
    } catch (err) {
      logger.warn(
        'Aegis: durable store finalize connect failed — row reserved durably but completion write failed; entry still reported (not dropped)',
        { error: err instanceof Error ? err.message : String(err), seq: handle.seq },
      );
      const entryHash = computeEntryHash(
        handle.seq,
        handle.timestamp,
        handle.sessionId,
        handle.action,
        handle.requestFingerprint,
        GENESIS_HASH,
        resultSummary,
      );
      return { ...handle, prevHash: GENESIS_HASH, resultSummary, entryHash, durable: false };
    }

    try {
      await client.query('BEGIN');
      await client.query(`SELECT pg_advisory_xact_lock(${CHAIN_LOCK_KEY})`);

      const last = await client.query(
        'SELECT entry_hash FROM aegis_audit_chain WHERE entry_hash IS NOT NULL AND seq <> $1 ORDER BY seq DESC LIMIT 1',
        [handle.seq],
      );
      const prevHash: string = last.rows[0]?.entry_hash ?? GENESIS_HASH;
      const entryHash = computeEntryHash(
        handle.seq,
        handle.timestamp,
        handle.sessionId,
        handle.action,
        handle.requestFingerprint,
        prevHash,
        resultSummary,
      );

      await client.query(
        'UPDATE aegis_audit_chain SET prev_hash = $1, entry_hash = $2, result_summary = $3 WHERE seq = $4',
        [prevHash, entryHash, resultSummary, handle.seq],
      );
      await client.query('COMMIT');

      return { ...handle, prevHash, resultSummary, entryHash, durable: true };
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      logger.warn(
        'Aegis: durable store finalize write failed — row reserved durably but completion write failed; entry still reported (not dropped)',
        { error: err instanceof Error ? err.message : String(err), seq: handle.seq },
      );
      const entryHash = computeEntryHash(
        handle.seq,
        handle.timestamp,
        handle.sessionId,
        handle.action,
        handle.requestFingerprint,
        GENESIS_HASH,
        resultSummary,
      );
      return { ...handle, prevHash: GENESIS_HASH, resultSummary, entryHash, durable: false };
    } finally {
      client.release();
    }
  }

  /** Read-only accessor — the full chain, durable rows preferred, falling back to the in-memory buffer. */
  async getChain(): Promise<readonly AegisAuditEntry[]> {
    const pool = this.getPool();
    if (!pool) return this.fallbackAsEntries();

    try {
      // entry_hash IS NOT NULL excludes rows still mid-flight between
      // reserve() and finalize() (or abandoned there by a crash) — they are
      // not yet valid chain entries. A restarted process re-reserving the
      // same fingerprint would hit the UNIQUE constraint (replay: true)
      // rather than silently orphaning these; operationally rare and safe
      // to leave for manual reconciliation (visible via entry_hash IS NULL).
      const result = await pool.query(
        'SELECT seq, entry_timestamp, session_id, action, request_fingerprint, prev_hash, entry_hash, result_summary FROM aegis_audit_chain WHERE entry_hash IS NOT NULL ORDER BY seq ASC',
      );
      return result.rows.map((row) => ({
        seq: Number(row.seq),
        timestamp: new Date(row.entry_timestamp).toISOString(),
        sessionId: row.session_id,
        action: row.action,
        requestFingerprint: row.request_fingerprint,
        entryHash: row.entry_hash,
        prevHash: row.prev_hash,
        resultSummary: row.result_summary,
        durable: true,
      }));
    } catch (err) {
      logger.warn('Aegis: durable store read failed — returning in-memory chain', {
        error: err instanceof Error ? err.message : String(err),
      });
      return this.fallbackAsEntries();
    }
  }

  /**
   * Returns direct references into fallbackChain (not copies) — intentional:
   * degraded mode has no external store to re-read from, so the in-memory
   * slot IS the record. This also lets tests exercise tamper-detection
   * against the fallback buffer the same way an operator would inspect it.
   */
  private fallbackAsEntries(): AegisAuditEntry[] {
    return this.fallbackChain.filter(
      (s): s is FallbackSlot & { resultSummary: string; entryHash: string } =>
        s.resultSummary !== null && s.entryHash !== null,
    );
  }

  /** Verify the chain read via getChain() has not been altered out of band. */
  async verifyChain(): Promise<ChainVerification> {
    const chain = await this.getChain();
    const durable = chain.length === 0 || chain[0].durable;

    let prevHash = GENESIS_HASH;
    for (const entry of chain) {
      if (entry.prevHash !== prevHash) {
        return { valid: false, brokenAtSeq: entry.seq, durable };
      }
      const recomputed = computeEntryHash(
        entry.seq,
        entry.timestamp,
        entry.sessionId,
        entry.action,
        entry.requestFingerprint,
        entry.prevHash,
        entry.resultSummary,
      );
      if (recomputed !== entry.entryHash) {
        return { valid: false, brokenAtSeq: entry.seq, durable };
      }
      prevHash = entry.entryHash;
    }
    return { valid: true, brokenAtSeq: null, durable };
  }
}

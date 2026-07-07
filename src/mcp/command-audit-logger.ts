/**
 * Command Audit Logger — EU AI Act Article 12 command-execution trail
 *
 * Writes append-only, hash-chained audit events to command_audit_log (self-hosted
 * Postgres on DGX Spark — dws-postgres) for every command/skill routed through the
 * OpenClaw and NemoClaw bridges. Implements the `command.invoke` / `command.result`
 * event types of the
 * §3 mandatory schema in DWS_ARTICLE_12_LOGGING_STANDARD.md.
 *
 * Two events per command, sharing a trace_id:
 *   logInvocation() — written BEFORE execution. This is the compliance gate:
 *                     bridges call it fail-closed (no record -> command is blocked).
 *   logResult()     — written AFTER execution. Best-effort: the command already ran
 *                     and the invoke event is already persisted, so a failure here
 *                     is logged loudly but does not crash the response.
 *
 * Raw params and outputs NEVER enter the ledger — only SHA-256 digests plus a PII
 * manifest. The prev_hash/event_hash chain is computed in-DB (trigger), not here.
 */

import { createHash, randomUUID } from 'node:crypto';
import { type Pool } from 'pg';
import { scrubObject, type PIIType } from '../agents/pii-scrubber.js';
import { getInternalDbPool } from '../config/internal-db.js';
import logger from '../utils/logger.js';

// ─── Types ──────────────────────────────────────────────────────────────────

export type BridgeName = 'openclaw' | 'nemoclaw';
export type CommandDecision = 'allowed' | 'denied';
export type RiskClassification = 'high' | 'limited' | 'minimal';

export interface CommandInvocation {
  bridge: BridgeName;
  /** Caller agent making the request */
  agentId: string;
  /** KYC-verified human behind the session (Art. 14(5)) */
  operatorId?: string | null;
  orgId?: string | null;
  kyaSessionId?: string | null;
  /** Command / skill name being invoked */
  skill: string;
  /** Raw params — scrubbed + hashed here, never stored raw */
  params: Record<string, unknown>;
  callerAts?: number | null;
  minimumAts?: number | null;
  /** Whether the gate allowed the command to run */
  decision: CommandDecision;
  deniedReason?: string | null;
  modelVersion?: string | null;
  riskClassification?: RiskClassification;
}

export interface CommandResult {
  traceId: string;
  /** Carried from the invoke event so each row is self-describing for audit export */
  bridge: BridgeName;
  agentId: string;
  skill: string;
  success: boolean;
  /** Raw result — hashed here for output lineage, never stored raw */
  output?: unknown;
  durationMs?: number;
  errorText?: string | null;
}

/**
 * The sink the bridges depend on. The Supabase implementation is below; tests
 * inject a fake so command logging can be verified without a live database.
 */
export interface CommandAuditSink {
  /** Fail-closed: throws if the invoke event cannot be persisted. */
  logInvocation(entry: CommandInvocation): Promise<{ traceId: string }>;
  /** Best-effort: never throws. */
  logResult(entry: CommandResult): Promise<void>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Canonical serialization: object keys sorted recursively, and every value
 * JSON-encoded (never bypassed) so types don't collide. Two semantically-equal
 * inputs always produce the same string; `1` and `'1'` produce different ones.
 */
function canonicalize(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    // JSON.stringify(undefined) === undefined → normalise to 'null'
    return JSON.stringify(value) ?? 'null';
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }
  const obj = value as Record<string, unknown>;
  const body = Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonicalize(obj[k])}`)
    .join(',');
  return `{${body}}`;
}

/** SHA-256 hex digest of any value (canonical, order- and type-stable). Used for lineage. */
export function digestOf(value: unknown): string {
  return createHash('sha256').update(canonicalize(value)).digest('hex');
}

// ─── Internal Postgres implementation ───────────────────────────────────────

export class CommandAuditLogger implements CommandAuditSink {
  private pool: Pool;

  constructor(pool?: Pool) {
    // Reuse the shared internal-ops pool so env-var resolution (INTERNAL_DB_URL)
    // and the Vitest gating (disabled in tests unless ENABLE_INTERNAL_DB_IN_TESTS=true)
    // stay in one place.
    const p = pool ?? getInternalDbPool();
    if (!p) {
      throw new Error(
        'CommandAuditLogger: internal Postgres pool unavailable (set INTERNAL_DB_URL)',
      );
    }
    this.pool = p;
  }

  /**
   * Returns a logger only when the internal Postgres pool is available,
   * otherwise null. Lets the NemoClaw bridge wire Article 12 logging in
   * production without forcing a DB dependency on unit tests (getInternalDbPool
   * returns null under Vitest unless ENABLE_INTERNAL_DB_IN_TESTS=true).
   */
  static fromEnvOrNull(): CommandAuditLogger | null {
    const pool = getInternalDbPool();
    return pool ? new CommandAuditLogger(pool) : null;
  }

  async logInvocation(entry: CommandInvocation): Promise<{ traceId: string }> {
    const traceId = randomUUID();
    // Digest the SCRUBBED params: matches the documented contract and avoids
    // storing dictionary-attackable hashes of raw PII (e.g. emails).
    const { scrubbed, manifest } = scrubObject(entry.params);

    try {
      await this.pool.query(
        `INSERT INTO command_audit_log (
           event_type, bridge, trace_id, agent_id, operator_id, org_id,
           kya_session_id, skill, caller_ats, minimum_ats, input_digest,
           decision, denied_reason, pii_types_found, pii_replacement_count,
           model_version, risk_classification
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          'command.invoke',
          entry.bridge,
          traceId,
          entry.agentId,
          entry.operatorId ?? null,
          entry.orgId ?? null,
          entry.kyaSessionId ?? null,
          entry.skill,
          entry.callerAts ?? null,
          entry.minimumAts ?? null,
          digestOf(scrubbed),
          entry.decision,
          entry.deniedReason ?? null,
          manifest.typesFound as PIIType[],
          manifest.replacementCount,
          entry.modelVersion ?? null,
          entry.riskClassification ?? 'high',
        ],
      );
    } catch (err) {
      // Fail-closed: surface to the caller so the command is blocked.
      throw new Error(`CommandAuditLogger.logInvocation failed: ${(err as Error).message}`);
    }
    return { traceId };
  }

  async logResult(entry: CommandResult): Promise<void> {
    try {
      await this.pool.query(
        `INSERT INTO command_audit_log (
           event_type, bridge, agent_id, skill, trace_id, output_digest,
           success, error_text, duration_ms
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          'command.result',
          entry.bridge,
          entry.agentId,
          entry.skill,
          entry.traceId,
          entry.output === undefined ? null : digestOf(entry.output),
          entry.success,
          entry.errorText ?? null,
          entry.durationMs ?? null,
        ],
      );
    } catch (err) {
      // Best-effort: the command already executed and the invoke event is
      // persisted. Fail loud (Rule 12) but do not crash the response.
      logger.error('CommandAuditLogger.logResult failed', {
        traceId: entry.traceId,
        error: (err as Error).message,
      });
    }
  }
}

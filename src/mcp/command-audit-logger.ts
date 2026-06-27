/**
 * Command Audit Logger — EU AI Act Article 12 command-execution trail
 *
 * Writes append-only, hash-chained audit events to command_audit_log (Supabase,
 * europe-north1) for every command/skill routed through the OpenClaw and NemoClaw
 * bridges. Implements the `command.invoke` / `command.result` event types of the
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
import { type SupabaseClient } from '@supabase/supabase-js';
import { scrubObject, type PIIType } from '../agents/pii-scrubber.js';
import { getSupabaseClient } from '../config/supabase.js';
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

// ─── Supabase implementation ────────────────────────────────────────────────

export class CommandAuditLogger implements CommandAuditSink {
  private supabase: SupabaseClient;

  constructor(supabase?: SupabaseClient) {
    // Reuse the shared service-role client so env-var resolution
    // (SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_ROLE_KEY) and the Vitest gating
    // (disabled in tests unless ENABLE_SUPABASE_IN_TESTS=true) stay in one place.
    const client = supabase ?? getSupabaseClient();
    if (!client) {
      throw new Error(
        'CommandAuditLogger: Supabase service-role client unavailable ' +
          '(set SUPABASE_URL + SUPABASE_SERVICE_KEY)',
      );
    }
    this.supabase = client;
  }

  /**
   * Returns a logger only when a Supabase service-role client is available,
   * otherwise null. Lets the NemoClaw bridge wire Article 12 logging in
   * production without forcing a DB dependency on unit tests (getSupabaseClient
   * returns null under Vitest unless ENABLE_SUPABASE_IN_TESTS=true).
   */
  static fromEnvOrNull(): CommandAuditLogger | null {
    const client = getSupabaseClient();
    return client ? new CommandAuditLogger(client) : null;
  }

  async logInvocation(entry: CommandInvocation): Promise<{ traceId: string }> {
    const traceId = randomUUID();
    // Digest the SCRUBBED params: matches the documented contract and avoids
    // storing dictionary-attackable hashes of raw PII (e.g. emails).
    const { scrubbed, manifest } = scrubObject(entry.params);

    const row = {
      event_type: 'command.invoke',
      bridge: entry.bridge,
      trace_id: traceId,
      agent_id: entry.agentId,
      operator_id: entry.operatorId ?? null,
      org_id: entry.orgId ?? null,
      kya_session_id: entry.kyaSessionId ?? null,
      skill: entry.skill,
      caller_ats: entry.callerAts ?? null,
      minimum_ats: entry.minimumAts ?? null,
      input_digest: digestOf(scrubbed),
      decision: entry.decision,
      denied_reason: entry.deniedReason ?? null,
      pii_types_found: manifest.typesFound as PIIType[],
      pii_replacement_count: manifest.replacementCount,
      model_version: entry.modelVersion ?? null,
      risk_classification: entry.riskClassification ?? 'high',
    };

    const { error } = await this.supabase.from('command_audit_log').insert(row);
    if (error) {
      // Fail-closed: surface to the caller so the command is blocked.
      throw new Error(`CommandAuditLogger.logInvocation failed: ${error.message}`);
    }
    return { traceId };
  }

  async logResult(entry: CommandResult): Promise<void> {
    const row = {
      event_type: 'command.result',
      // Identity carried from the invoke event so each row is self-describing.
      bridge: entry.bridge,
      agent_id: entry.agentId,
      skill: entry.skill,
      trace_id: entry.traceId,
      output_digest: entry.output === undefined ? null : digestOf(entry.output),
      success: entry.success,
      error_text: entry.errorText ?? null,
      duration_ms: entry.durationMs ?? null,
    };

    const { error } = await this.supabase.from('command_audit_log').insert(row);

    if (error) {
      // Best-effort: the command already executed and the invoke event is
      // persisted. Fail loud (Rule 12) but do not crash the response.
      logger.error('CommandAuditLogger.logResult failed', {
        traceId: entry.traceId,
        error: error.message,
      });
    }
  }
}

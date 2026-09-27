/**
 * KYA §14.5 — Mandate evidence-chain writer.
 *
 * Appends mandate lifecycle events (issue / present / execute / revoke /
 * attest) to `kya_mandate_events` (migrations 074 + 079, live). The table is
 * append-only and hash-chained: `prev_hash` / `event_hash` are computed by an
 * in-DB BEFORE INSERT trigger under an advisory lock — the application NEVER
 * sets them (mirrors command_audit_log). Every event is keyed by
 * session_id + mandate_vc_id (§14.5).
 *
 * Modeled on src/mcp/command-audit-logger.ts: a sink interface so callers and
 * tests inject a fake, and a Supabase implementation reusing the shared
 * service-role client (INSERT is granted to service_role only).
 *
 * @see Legal/KYA_STANDARD_v1.md §14.5
 * @see supabase/migrations/074_kya_mandate_evidence_chain.sql
 */

import { type SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseClient } from '../config/supabase.js';
import type { MandateType, PermissionLevel, ProtocolRail } from './types.js';

const TABLE = 'kya_mandate_events';

export type MandateEventType =
  | 'mandate.issue'
  | 'mandate.present'
  | 'mandate.execute'
  | 'mandate.revoke'
  | 'mandate.attest';

/** A single mandate lifecycle event to append to the evidence chain (§14.5). */
export interface MandateEvent {
  eventType: MandateEventType;
  sessionId: string;
  mandateVcId: string;
  subagentId: string;
  hic: string;
  orgId?: string | null;
  protocol: ProtocolRail;
  mandateType: MandateType;
  amount?: number | null;
  currency?: string | null;
  merchantCategory?: string | null;
  humanPresent?: boolean | null;
  kyaScoreAtSign?: number | null;
  atsPermissionLevel?: PermissionLevel | null;
  gateDecision: 'allowed' | 'denied';
  requiresHumanConfirmation?: boolean;
  kyaViolation?: boolean;
  decisionReason?: string | null;
  article12TraceId?: string | null;
  firehorseEventId?: string | null;
}

/** The evidence-chain sink callers depend on; tests inject a fake. */
export interface MandateEventSink {
  /** Append one event. Returns the new row id. Throws on failure (fail-closed). */
  log(event: MandateEvent): Promise<{ id: string }>;
}

/** Map an event onto the table columns. prev_hash/event_hash are trigger-set — omitted. */
function toRow(event: MandateEvent): Record<string, unknown> {
  return {
    event_type: event.eventType,
    session_id: event.sessionId,
    mandate_vc_id: event.mandateVcId,
    subagent_id: event.subagentId,
    hic: event.hic,
    org_id: event.orgId ?? null,
    protocol: event.protocol,
    mandate_type: event.mandateType,
    amount: event.amount ?? null,
    currency: event.currency ?? null,
    merchant_category: event.merchantCategory ?? null,
    human_present: event.humanPresent ?? null,
    kya_score_at_sign: event.kyaScoreAtSign ?? null,
    ats_permission_level: event.atsPermissionLevel ?? null,
    gate_decision: event.gateDecision,
    requires_human_confirmation: event.requiresHumanConfirmation ?? false,
    kya_violation: event.kyaViolation ?? false,
    decision_reason: event.decisionReason ?? null,
    article12_trace_id: event.article12TraceId ?? null,
    firehorse_event_id: event.firehorseEventId ?? null,
  };
}

export class MandateEventLogger implements MandateEventSink {
  private supabase: SupabaseClient;

  constructor(supabase?: SupabaseClient) {
    const client = supabase ?? getSupabaseClient();
    if (!client) {
      throw new Error(
        'MandateEventLogger: Supabase service-role client unavailable ' +
          '(set SUPABASE_URL + SUPABASE_SERVICE_KEY)',
      );
    }
    this.supabase = client;
  }

  /** Returns a logger only when a service-role client is available, else null. */
  static fromEnvOrNull(): MandateEventLogger | null {
    const client = getSupabaseClient();
    return client ? new MandateEventLogger(client) : null;
  }

  async log(event: MandateEvent): Promise<{ id: string }> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .insert(toRow(event))
      .select('id')
      .single();
    if (error) {
      throw new Error(`MandateEventLogger.log failed: ${error.message}`);
    }
    return { id: (data as { id: string }).id };
  }
}

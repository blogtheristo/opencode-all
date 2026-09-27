/**
 * Compliance Proof — turns the append-only audit tables into queryable
 * compliance state instead of logs an auditor has to grep by hand.
 *
 * Sources (see supabase/migrations/071, 074, 038):
 *   - command_audit_log   — hash-chained (prev_hash -> event_hash)
 *   - kya_mandate_events  — hash-chained (prev_hash -> event_hash)
 *   - article12_audit_log — NOT hash-chained (no prev_hash/event_hash
 *     columns in migration 038) and has no org_id column, so its section
 *     of the certificate is platform-wide, not per-tenant, and its
 *     integrity cannot be chain-verified. Both are named gaps, not
 *     silently smoothed over — see docs/field-notes for the follow-ups.
 *
 * Compute is pure (verifyChain / buildComplianceProof) so it is testable
 * without a database, mirroring the fetch/compute split in
 * scripts/compute-mgd.mjs. fetchComplianceProof does the I/O.
 */

import { createHash } from 'node:crypto';

export interface HashChainRow {
  id: string;
  created_at: string;
  prev_hash: string;
  event_hash: string;
}

export interface CommandAuditRow extends HashChainRow {
  decision: 'allowed' | 'denied';
  org_id: string | null;
}

export interface KyaMandateRow extends HashChainRow {
  gate_decision: 'allowed' | 'denied';
  kya_violation: boolean;
  org_id: string | null;
}

export interface Article12Row {
  id: string;
  created_at: string;
  inference_in_eu: boolean;
  pii_scrub_location: string;
  inference_location: string;
}

export interface ChainVerification {
  hashChained: boolean;
  intact: boolean;
  rowsChecked: number;
  brokenAtRowId: string | null;
}

export interface ComplianceProofCertificate {
  orgId: string | null;
  window: { from: string; to: string };
  generatedAt: string;
  access: {
    allowed: number;
    denied: number;
    deniedSamples: Array<{ id: string; created_at: string }>;
  };
  mandateGating: {
    total: number;
    violations: number;
    denied: number;
  };
  dataResidency: {
    scope: 'platform-wide';
    sampleCount: number;
    allInEu: boolean;
    locations: { inference: string[]; piiScrub: string[] };
  };
  chainIntegrity: {
    commandLog: ChainVerification;
    kyaMandateEvents: ChainVerification;
    article12Log: ChainVerification;
  };
  certificateHash: string;
}

/** Verifies row[i].prev_hash === row[i-1].event_hash for the given window (ordered by created_at, id). */
export function verifyChain(rows: HashChainRow[]): ChainVerification {
  if (rows.length === 0) {
    return { hashChained: true, intact: true, rowsChecked: 0, brokenAtRowId: null };
  }
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].prev_hash !== rows[i - 1].event_hash) {
      return {
        hashChained: true,
        intact: false,
        rowsChecked: rows.length,
        brokenAtRowId: rows[i].id,
      };
    }
  }
  return { hashChained: true, intact: true, rowsChecked: rows.length, brokenAtRowId: null };
}

function unchained(rowCount: number): ChainVerification {
  return { hashChained: false, intact: true, rowsChecked: rowCount, brokenAtRowId: null };
}

export interface BuildProofParams {
  orgId: string | null;
  from: string;
  to: string;
  commandLogRows: CommandAuditRow[];
  kyaEventRows: KyaMandateRow[];
  article12Rows: Article12Row[];
}

export function buildComplianceProof(params: BuildProofParams): ComplianceProofCertificate {
  const { orgId, from, to, commandLogRows, kyaEventRows, article12Rows } = params;

  const allowed = commandLogRows.filter((r) => r.decision === 'allowed').length;
  const denied = commandLogRows.filter((r) => r.decision === 'denied');

  const violations = kyaEventRows.filter((r) => r.kya_violation).length;
  const mandateDenied = kyaEventRows.filter((r) => r.gate_decision === 'denied').length;

  const allInEu = article12Rows.length > 0 && article12Rows.every((r) => r.inference_in_eu);
  const inferenceLocations = [...new Set(article12Rows.map((r) => r.inference_location))].sort();
  const piiScrubLocations = [...new Set(article12Rows.map((r) => r.pii_scrub_location))].sort();

  const certificate: Omit<ComplianceProofCertificate, 'certificateHash'> = {
    orgId,
    window: { from, to },
    generatedAt: new Date().toISOString(),
    access: {
      allowed,
      denied: denied.length,
      deniedSamples: denied.slice(0, 20).map((r) => ({ id: r.id, created_at: r.created_at })),
    },
    mandateGating: {
      total: kyaEventRows.length,
      violations,
      denied: mandateDenied,
    },
    dataResidency: {
      scope: 'platform-wide',
      sampleCount: article12Rows.length,
      allInEu,
      locations: { inference: inferenceLocations, piiScrub: piiScrubLocations },
    },
    chainIntegrity: {
      commandLog: verifyChain(commandLogRows),
      kyaMandateEvents: verifyChain(kyaEventRows),
      article12Log: unchained(article12Rows.length),
    },
  };

  const certificateHash = createHash('sha256')
    .update(JSON.stringify(certificate, Object.keys(certificate).sort()))
    .digest('hex');

  return { ...certificate, certificateHash };
}

type AuditQueryResult = { data: unknown[] | null; error: unknown };

/**
 * Minimal shape of the Supabase query builder this module needs — each
 * method returns a builder (chainable in any order, like the real
 * supabase-js PostgrestFilterBuilder) and the builder itself is awaitable.
 */
export interface AuditQueryBuilder extends PromiseLike<AuditQueryResult> {
  eq(column: string, value: string): AuditQueryBuilder;
  gte(column: string, value: string): AuditQueryBuilder;
  lte(column: string, value: string): AuditQueryBuilder;
  order(column: string): AuditQueryBuilder;
}

export interface AuditQueryClient {
  from(table: string): { select(columns: string): AuditQueryBuilder };
}

/**
 * Fetches the three audit sources for the window and builds the certificate.
 * org_id filtering applies only to command_audit_log and kya_mandate_events —
 * article12_audit_log has no org_id column (see module doc comment).
 */
export async function fetchComplianceProof(
  supabase: AuditQueryClient,
  params: { orgId: string | null; from: string; to: string },
): Promise<ComplianceProofCertificate> {
  const { orgId, from, to } = params;

  let commandLogQuery = supabase
    .from('command_audit_log')
    .select('id, created_at, prev_hash, event_hash, decision, org_id')
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at');
  if (orgId) commandLogQuery = commandLogQuery.eq('org_id', orgId);

  let kyaEventsQuery = supabase
    .from('kya_mandate_events')
    .select('id, created_at, prev_hash, event_hash, gate_decision, kya_violation, org_id')
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at');
  if (orgId) kyaEventsQuery = kyaEventsQuery.eq('org_id', orgId);

  const article12Query = supabase
    .from('article12_audit_log')
    .select('id, created_at, inference_in_eu, pii_scrub_location, inference_location')
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at');

  const [commandLogResult, kyaEventsResult, article12Result] = await Promise.all([
    commandLogQuery,
    kyaEventsQuery,
    article12Query,
  ]);

  if (commandLogResult.error) throw commandLogResult.error;
  if (kyaEventsResult.error) throw kyaEventsResult.error;
  if (article12Result.error) throw article12Result.error;

  return buildComplianceProof({
    orgId,
    from,
    to,
    commandLogRows: (commandLogResult.data ?? []) as CommandAuditRow[],
    kyaEventRows: (kyaEventsResult.data ?? []) as KyaMandateRow[],
    article12Rows: (article12Result.data ?? []) as Article12Row[],
  });
}

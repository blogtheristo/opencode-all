/**
 * KYA §14.7 — Verified-Done Attestation store & proof_status transitions.
 *
 * Persists issued credentials to `kya_verified_done_attestations` (migration
 * 079, live) and manages the `unsigned → signed → revoked` proof_status
 * lifecycle. All writes go through the service-role client — the table's RLS
 * grants INSERT/UPDATE to service_role only; authenticated can only read
 * (§14.7). Revocation is a status transition, never a row deletion (the table
 * denies DELETE to every role).
 *
 * Modeled on src/mcp/command-audit-logger.ts: a sink interface so callers and
 * tests can inject a fake, and a Supabase implementation that reuses the shared
 * service-role client (getSupabaseClient) with its Vitest gating.
 *
 * @see Legal/KYA_STANDARD_v1.md §14.7, §14.7.1
 * @see supabase/migrations/079_kya_verified_done_attestation.sql
 */

import { type SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseClient } from '../config/supabase.js';
import logger from '../utils/logger.js';
import { signVerifiedDoneAttestation, type AttestationSigner } from './attestation-signing.js';
import { MANDATE_SUBJECT_URN_PREFIX } from './ats-engine.js';
import type { IssuedAttestation, VerifiedDoneAttestation } from './types.js';

const TABLE = 'kya_verified_done_attestations';

/** The persistence contract callers depend on; tests inject a fake. */
export interface VerifiedDoneAttestationSink {
  /** INSERT an issued credential (unsigned or signed). Returns the new row id. */
  persist(issued: IssuedAttestation): Promise<{ id: string }>;
  /** Transition an unsigned row to signed: sign its credential and UPDATE in place. */
  sign(id: string, signer: AttestationSigner): Promise<void>;
  /** Transition a row to revoked (never deletes). */
  revoke(id: string): Promise<void>;
}

/** Recover the bare mandate_vc_id from the credentialSubject urn (§14.5 key). */
function mandateVcIdOf(credential: VerifiedDoneAttestation): string {
  const id = credential.credentialSubject.id;
  return id.startsWith(MANDATE_SUBJECT_URN_PREFIX)
    ? id.slice(MANDATE_SUBJECT_URN_PREFIX.length)
    : id;
}

/** Map an issued credential onto the table's columns (mirrors migration 079). */
function toRow(issued: IssuedAttestation): Record<string, unknown> {
  const { credential, proofStatus } = issued;
  const s = credential.credentialSubject;
  return {
    session_id: s.sessionId,
    mandate_vc_id: mandateVcIdOf(credential),
    subagent_id: s.subagentId,
    hic: s.hic,
    issuer: credential.issuer,
    protocol: s.protocol,
    mandate_type: s.mandateType,
    amount: s.amount ?? null,
    currency: s.currency ?? null,
    ats_at_execution: s.atsAtExecution ?? null,
    kya_verified: s.kyaVerified,
    credential,
    proof_status: proofStatus,
    article12_trace_id: s.article12TraceId ?? null,
    valid_from: credential.validFrom,
  };
}

export class VerifiedDoneAttestationStore implements VerifiedDoneAttestationSink {
  private supabase: SupabaseClient;

  constructor(supabase?: SupabaseClient) {
    // Reuse the shared service-role client so env resolution and Vitest gating
    // (disabled in tests unless ENABLE_SUPABASE_IN_TESTS=true) live in one place.
    const client = supabase ?? getSupabaseClient();
    if (!client) {
      throw new Error(
        'VerifiedDoneAttestationStore: Supabase service-role client unavailable ' +
          '(set SUPABASE_URL + SUPABASE_SERVICE_KEY)',
      );
    }
    this.supabase = client;
  }

  /** Returns a store only when a service-role client is available, else null. */
  static fromEnvOrNull(): VerifiedDoneAttestationStore | null {
    const client = getSupabaseClient();
    return client ? new VerifiedDoneAttestationStore(client) : null;
  }

  async persist(issued: IssuedAttestation): Promise<{ id: string }> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .insert(toRow(issued))
      .select('id')
      .single();
    if (error) {
      throw new Error(`VerifiedDoneAttestationStore.persist failed: ${error.message}`);
    }
    return { id: (data as { id: string }).id };
  }

  async sign(id: string, signer: AttestationSigner): Promise<void> {
    const { data, error } = await this.supabase
      .from(TABLE)
      .select('credential, proof_status')
      .eq('id', id)
      .single();
    if (error) {
      throw new Error(`VerifiedDoneAttestationStore.sign: load failed: ${error.message}`);
    }
    const row = data as { credential: VerifiedDoneAttestation; proof_status: string };
    // Only an unsigned row may transition to signed — signing a revoked or
    // already-signed credential is a caller error, surfaced loudly (Rule 12).
    if (row.proof_status !== 'unsigned') {
      throw new Error(
        `VerifiedDoneAttestationStore.sign: cannot sign a '${row.proof_status}' attestation (KYA §14.7)`,
      );
    }

    const signed = signVerifiedDoneAttestation(
      { credential: row.credential, proofStatus: 'unsigned' },
      signer,
    );

    const { error: updateError } = await this.supabase
      .from(TABLE)
      .update({ credential: signed.credential, proof_status: 'signed' })
      .eq('id', id);
    if (updateError) {
      throw new Error(`VerifiedDoneAttestationStore.sign: update failed: ${updateError.message}`);
    }
  }

  async revoke(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(TABLE)
      .update({ proof_status: 'revoked' })
      .eq('id', id);
    if (error) {
      throw new Error(`VerifiedDoneAttestationStore.revoke failed: ${error.message}`);
    }
    logger.info('Verified-done attestation revoked', { id });
  }
}

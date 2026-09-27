/**
 * KYA §14.7 — Verified-Done Attestation issuance orchestration.
 *
 * The reusable seam a mandate-execution path calls once a mandate completes:
 *   issue → sign (if a signer is configured, else unsigned) → persist the
 *   credential → append a `mandate.attest` event to the §14.5 evidence chain.
 *
 * Deps are injected (store, event sink, optional signer) so this composes the
 * lower layers without owning a DB client or a key — the call site wires
 * `VerifiedDoneAttestationStore.fromEnvOrNull()`,
 * `MandateEventLogger.fromEnvOrNull()`, and `loadIssuerSignerFromEnv()`.
 *
 * Deny-by-default carries all the way through: `issueVerifiedDoneAttestation`
 * throws on a mandate the gate did not allow or a missing HIC, so nothing is
 * persisted or logged for a denied/anonymous mandate.
 *
 * @see Legal/KYA_STANDARD_v1.md §14.7, §14.5
 */

import { signVerifiedDoneAttestation, type AttestationSigner } from './attestation-signing.js';
import type { VerifiedDoneAttestationSink } from './attestation-store.js';
import { issueVerifiedDoneAttestation } from './ats-engine.js';
import type { MandateEventSink } from './mandate-event-logger.js';
import type { AttestationInput, IssuedAttestation } from './types.js';

export interface AttestationIssuanceDeps {
  store: VerifiedDoneAttestationSink;
  events: MandateEventSink;
  /** Present → credential is signed; absent/null → minted unsigned (§14.7.1). */
  signer?: AttestationSigner | null;
}

export interface AttestationIssuanceResult {
  attestation: IssuedAttestation;
  /** Row id in kya_verified_done_attestations. */
  attestationId: string;
  /** Row id of the mandate.attest event on the §14.5 evidence chain. */
  eventId: string;
}

/**
 * Attest a completed mandate. Order matters: persist the credential BEFORE
 * logging the evidence event, so a `mandate.attest` event never points at a
 * credential that was not stored.
 */
export async function attestMandateExecution(
  deps: AttestationIssuanceDeps,
  input: AttestationInput,
  context: { orgId?: string | null } = {},
): Promise<AttestationIssuanceResult> {
  // Issue (throws on a denied/anonymous mandate — deny-by-default, §14.7).
  let attestation = issueVerifiedDoneAttestation(input);

  // Sign only when a signer is configured; otherwise the unsigned credential
  // is still a valid record (proofStatus:'unsigned'), signable later (§14.7.1).
  if (deps.signer) {
    attestation = signVerifiedDoneAttestation(attestation, deps.signer);
  }

  const { id: attestationId } = await deps.store.persist(attestation);

  const { id: eventId } = await deps.events.log({
    eventType: 'mandate.attest',
    sessionId: input.sessionId,
    mandateVcId: input.mandateVcId,
    subagentId: input.subagentId,
    hic: input.hic,
    orgId: context.orgId ?? null,
    protocol: input.protocol,
    mandateType: input.mandateType,
    amount: input.amount,
    currency: input.currency,
    kyaScoreAtSign: input.atsAtExecution,
    // Only an allowed mandate reaches attestation (the issuer enforces it).
    gateDecision: 'allowed',
    article12TraceId: input.article12TraceId ?? null,
  });

  return { attestation, attestationId, eventId };
}

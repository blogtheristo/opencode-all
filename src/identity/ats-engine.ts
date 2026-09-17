/**
 * Agent Trust Score (ATS) Calculation Engine
 *
 * Calculates a real-time "Go/No-Go" score for subagent sessions.
 * The ATS is evaluated BEFORE any external IDV call (e.g., Shufti Pro),
 * saving API cost by killing low-trust sessions early.
 *
 * Score ranges (normalized 0.0–1.0 → mapped to KYA 0–100):
 *   >= 0.80 (KYA >= 80) → Full sandbox (GO)
 *   0.50–0.79 (KYA 50–79) → Restricted sandbox (GO with limits)
 *   < 0.50 (KYA < 50) → Suspended (NO_GO)
 *   = 0.00 (KYA = 0) → Frozen (NO_GO, immediate termination)
 *
 * @section DWS_SECURITY_STANDARD §18.3
 * @see Legal/KYA_SECURITY_v1.2.md §3 (ATS base formula)
 * @see Legal/KYA_S1.md §6.2 TRS-1 (IDV state is a required scoring input)
 * @see Legal/KYA_OPTIMIZATION_v1.4.md §3 (canonical ATS: ATS_Final = ATS_Base × (1 + A),
 *      A capped at 0.25, A = 0 when V > 0). This engine computes ATS_Base ONLY — the A
 *      factor is applied by the autoresearch orchestrator, never inside the security
 *      baseline, so optimization performance can never inflate a security score.
 * @see Legal/KYA_STANDARD_v1.md §14 (Agentic Commerce Mandate Gating — evaluateMandateGate)
 */

import { z } from 'zod';
import type {
  ATSBreakdown,
  ATSResult,
  AttestationInput,
  CapabilityManifest,
  IdvState,
  IdvStatus,
  IssuedAttestation,
  MandateGateDecision,
  MandateGateRequest,
  PermissionLevel,
  TelemetryEntry,
  TenantGatingProfile,
  VerifiedDoneAttestation,
} from './types.js';

// ============ CONSTANTS ============

/** Points deducted per KYA_VIOLATION event */
const VIOLATION_PENALTY = 0.25;

/** Points deducted per DENIED path access attempt */
const OVERREACH_PENALTY = 0.05;


/** KYA score threshold for GO decision (normalized) */
const GO_THRESHOLD = 0.5;

// ============ ATS CALCULATOR ============

/**
 * Calculates the Agent Trust Score for a subagent session.
 *
 * Pull from Firehorse telemetry logs to compute a weighted score
 * incorporating violations, manifest integrity, and permission overreach.
 *
 * Latency is deliberately NOT a scoring input: a slow agent is not an
 * untrustworthy one, and routing infrastructure degradation through the
 * authorization value hides it (KYA audit P1-1). Latency is measured and
 * reported as telemetry only — see `avgLatency` in the returned breakdown.
 *
 * @param manifest - Signed Capability Manifest for the session
 * @param telemetry - Firehorse telemetry log entries for the session
 * @param idv - Verification state of the human principal bound to the session.
 *              Required, not optional: an omitted IDV signal must fail closed,
 *              and an optional parameter would let callers silently opt out of
 *              the very control this input exists to provide (TRS-5).
 * @returns ATSResult with score, breakdown, and GO/NO_GO decision
 */
export function calculateATS(
  manifest: CapabilityManifest,
  telemetry: TelemetryEntry[],
  idv: IdvState,
): ATSResult {
  const now = new Date().toISOString();

  // Hard kill: unsigned or expired manifest
  const manifestExpired =
    Date.now() > new Date(manifest.signedAt).getTime() + manifest.ttlSeconds * 1000;

  const manifestValid = manifest.signature.verified && !manifestExpired;

  // Hard kill: the human principal is not verified, or the attestation is stale.
  //
  // This is the IDV limb of TRS-1. Without it the score expresses only the
  // agent's own conduct, so revoking the human's authorization would leave it
  // untouched — the chain would appear to break in the diagram while continuing
  // to authorize action in fact. `unknown` fails closed by construction: an
  // absent or unusable IDV signal is never read as permission (TRS-5).
  const idvFresh =
    isFiniteTimestamp(idv.verifiedAt) &&
    idv.ttlSeconds > 0 &&
    Date.now() <= new Date(idv.verifiedAt).getTime() + idv.ttlSeconds * 1000;

  const idvValid = idv.status === 'verified' && idvFresh;

  // Report 'expired' when the only defect is staleness, so telemetry
  // distinguishes a lapsed re-attestation (IDV-3) from a revocation (IDV-4).
  const idvStatus: IdvStatus = idv.status === 'verified' && !idvFresh ? 'expired' : idv.status;

  if (!manifestValid || !idvValid) {
    return buildResult(
      0.0,
      {
        baseScore: 1.0,
        violationPenalty: 0,
        latencyPenalty: 0,
        overreachPenalty: 0,
        manifestValid,
        violationCount: 0,
        deniedAttemptCount: 0,
        avgLatencyMs: 0,
        idvValid,
        idvStatus,
        humanPrincipalId: idv.humanPrincipalId,
      },
      now,
    );
  }

  let score = 1.0;

  // 1. KYA Violation penalty (critical — 4 violations = zero trust)
  const violations = telemetry.filter((l) => l.event === 'KYA_VIOLATION');
  const violationPenalty = violations.length * VIOLATION_PENALTY;
  score -= violationPenalty;

  // 2. Latency/SLA health (Observability only - latency penalty removed for compatibility)
  let avgLatency = 0;
  const latencyPenalty = 0;
  if (telemetry.length > 0) {
    avgLatency = telemetry.reduce((sum, l) => sum + l.latency, 0) / telemetry.length;
  }

  // 3. Permission overreach (denied path access attempts)
  const deniedAttempts = telemetry.filter((l) => l.status === 'DENIED');
  const overreachPenalty = deniedAttempts.length * OVERREACH_PENALTY;
  score -= overreachPenalty;

  // Floor at 0
  score = Math.max(0, score);

  return buildResult(
    score,
    {
      baseScore: 1.0,
      violationPenalty,
      latencyPenalty,
      overreachPenalty,
      manifestValid: true,
      violationCount: violations.length,
      deniedAttemptCount: deniedAttempts.length,
      avgLatencyMs: Math.round(avgLatency),
      idvValid: true,
      idvStatus: 'verified',
      humanPrincipalId: idv.humanPrincipalId,
    },
    now,
  );
}

/** True when `value` parses to a real instant — guards against malformed IDV timestamps. */
function isFiniteTimestamp(value: string): boolean {
  return Number.isFinite(new Date(value).getTime());
}

// ============ HELPERS ============

function buildResult(score: number, breakdown: ATSBreakdown, calculatedAt: string): ATSResult {
  const kyaScore = Math.round(score * 100);
  return {
    score,
    kyaScore,
    permissionLevel: mapPermissionLevel(kyaScore),
    breakdown,
    calculatedAt,
    decision: score >= GO_THRESHOLD ? 'GO' : 'NO_GO',
  };
}

function mapPermissionLevel(kyaScore: number): PermissionLevel {
  if (kyaScore >= 80) return 'full';
  if (kyaScore >= 50) return 'restricted';
  if (kyaScore > 0) return 'suspended';
  return 'frozen';
}

// ============ MANIFEST VALIDATION ============

/**
 * Validates a path access against the Capability Manifest.
 * Returns true if access is permitted, false if denied.
 */
export function isPathPermitted(manifest: CapabilityManifest, requestedPath: string): boolean {
  // Denied paths take precedence
  for (const denied of manifest.deniedPaths) {
    if (requestedPath.startsWith(denied)) return false;
  }
  // Must match at least one permitted path
  for (const permitted of manifest.permittedPaths) {
    if (requestedPath.startsWith(permitted)) return true;
  }
  // Default deny (zero-trust)
  return false;
}

// ============ MANDATE GATE (KYA §14, v1.9) ============

/** Platform floor: no mandates of any type below this ATS (KYA §14.2.1 floor 1) */
const MANDATE_FLOOR_ATS = 0.5;

/** Band from which the agent may sign a Payment Mandate itself (§14.2) */
const PAYMENT_BAND_ATS = 0.8;

/** Platform floor for Human Not Present: raisable per tenant, never lowerable (§14.2.1 floor 2) */
const HNP_FLOOR_ATS = 0.9;

/**
 * Tenant gating profile validator (KYA §14.2.1).
 * Encodes the tighten-only rule: a profile that attempts to loosen a
 * platform floor fails validation — floors are never trusted from input.
 */
export const tenantGatingProfileSchema = z.object({
  profileVersion: z.string().min(1),
  tenantId: z.string().min(1),
  industryDefault: z.string().optional(),
  hnpMinAts: z
    .number()
    .min(
      HNP_FLOOR_ATS,
      `hnpMinAts below platform floor ${HNP_FLOOR_ATS} — profiles may only tighten (KYA §14.2.1)`,
    )
    .max(1.0),
  confirmAbove: z.number().positive().optional(),
  hnpEnabled: z.boolean(),
});

/**
 * Validates a tenant gating profile against the tighten-only rule.
 * Throws ZodError on a loosening or malformed profile.
 */
export function validateTenantGatingProfile(profile: unknown): TenantGatingProfile {
  return tenantGatingProfileSchema.parse(profile);
}

/**
 * Evaluates a mandate request against the ATS band, the manifest's
 * spend_authority block, and the tenant gating profile
 * (KYA §14.2 / §14.2.1 / §14.3).
 *
 * Runs at the same pre-execution point as path access — BEFORE any mandate
 * signature. Deny-by-default throughout: no spend_authority block, no HIC
 * binding, ATS below floor, out-of-scope type/protocol/currency/category,
 * or ceiling breach all deny. Denials caused by acting outside the band or
 * above a ceiling carry kyaViolation=true — the caller must then run the
 * §9.2 enforcement sequence plus revocation of live session mandates.
 */
export function evaluateMandateGate(
  manifest: CapabilityManifest,
  ats: ATSResult,
  request: MandateGateRequest,
  profile?: TenantGatingProfile,
): MandateGateDecision {
  const evaluatedAt = new Date().toISOString();
  const deny = (reason: string, kyaViolation = false): MandateGateDecision => ({
    allowed: false,
    requiresHumanConfirmation: false,
    kyaViolation,
    reason,
    evaluatedAt,
  });

  // A profile must pass the tighten-only validator before it may influence the gate
  if (profile !== undefined) {
    const parsed = tenantGatingProfileSchema.safeParse(profile);
    if (!parsed.success) {
      return deny(
        `tenant gating profile rejected: ${parsed.error.issues[0]?.message ?? 'invalid profile'}`,
      );
    }
  }

  // Deny-by-default: no spend_authority block = zero spend authority (§14.3)
  const authority = manifest.spendAuthority;
  if (!authority) {
    return deny('no spend_authority block on manifest — deny-by-default (KYA §14.3)');
  }

  // No anonymous spend authority, ever (§14.3)
  if (!authority.hic || authority.hic.trim() === '') {
    return deny(
      'spend_authority has no HIC binding — anonymous spend authority is prohibited (KYA §14.3)',
    );
  }

  // Immovable floor 1: the NO_GO band holds no mandates under any profile (§14.2.1)
  if (ats.decision === 'NO_GO' || ats.score < MANDATE_FLOOR_ATS) {
    return deny(
      `ATS ${ats.score.toFixed(2)} below mandate floor ${MANDATE_FLOOR_ATS} — NO_GO (KYA §14.2)`,
      true,
    );
  }

  // Authority scope checks — acting outside signed authority is a violation (§14.2)
  if (!authority.mandateTypesAllowed.includes(request.mandateType)) {
    return deny(
      `mandate type '${request.mandateType}' not in spend_authority.mandate_types_allowed`,
      true,
    );
  }
  if (!authority.protocols.includes(request.protocol)) {
    return deny(`protocol '${request.protocol}' not in spend_authority.protocols`, true);
  }
  if (request.currency !== authority.currency) {
    return deny(
      `currency '${request.currency}' does not match spend_authority currency '${authority.currency}'`,
      true,
    );
  }
  if (!authority.allowedMerchantCategories.includes(request.merchantCategory)) {
    return deny(`merchant category '${request.merchantCategory}' not allowed`, true);
  }

  // Ceilings — a spend attempt above a manifest ceiling is a violation (§14.2)
  if (request.amount > authority.perTaskCeiling) {
    return deny(
      `amount ${request.amount} exceeds per_task_ceiling ${authority.perTaskCeiling}`,
      true,
    );
  }
  if (request.spentTodayTotal + request.amount > authority.perDayCeiling) {
    return deny(
      `amount ${request.amount} would exceed per_day_ceiling ${authority.perDayCeiling} (spent today: ${request.spentTodayTotal})`,
      true,
    );
  }

  // Below the 0.80 band the agent may only assemble Intent/Cart —
  // a human signs the Payment Mandate (§14.2)
  if (request.mandateType === 'payment' && ats.score < PAYMENT_BAND_ATS) {
    return deny(
      `ATS ${ats.score.toFixed(2)} in 0.50–0.79 band — Intent + Cart only; a human signs the Payment Mandate (KYA §14.2)`,
    );
  }

  // Human Not Present gating (§14.2 + §14.2.1)
  if (!request.humanPresent) {
    if (profile !== undefined && !profile.hnpEnabled) {
      return deny('Human Not Present disabled by tenant gating profile (KYA §14.2.1)');
    }
    if (!authority.humanNotPresent) {
      return deny('Human Not Present not granted by spend_authority (KYA §14.3)');
    }
    const hnpMin = Math.max(HNP_FLOOR_ATS, profile?.hnpMinAts ?? HNP_FLOOR_ATS);
    if (ats.score < hnpMin) {
      return deny(
        `ATS ${ats.score.toFixed(2)} below Human Not Present minimum ${hnpMin} (KYA §14.2)`,
      );
    }
  }

  // Below the HNP band, a tenant confirmation threshold requires a human
  // sign-off above the configured amount (§14.2 GO-confirmed row)
  const requiresHumanConfirmation =
    ats.score < HNP_FLOOR_ATS &&
    profile?.confirmAbove !== undefined &&
    request.amount > profile.confirmAbove;

  return {
    allowed: true,
    requiresHumanConfirmation,
    kyaViolation: false,
    reason: 'within ATS band, spend_authority scope, and tenant profile',
    evaluatedAt,
  };
}

// ============ VERIFIED-DONE ATTESTATION (KYA §14.7, v1.10) ============

/** JSON-LD contexts for a KYA Verified-Done credential (VC data model 2.0). */
const VERIFIED_DONE_CONTEXTS = [
  'https://www.w3.org/ns/credentials/v2',
  'https://standards.dws.eu/kya/v1',
];

/** Credential types for a KYA Verified-Done credential. */
const VERIFIED_DONE_TYPES = ['VerifiableCredential', 'KYAVerifiedDoneCredential'];

/**
 * Issues a Verified-Done Attestation for an executed mandate (KYA §14.7).
 *
 * This is the terminal link of the §14.4 trust chain (verified human → signed
 * manifest → signed mandate → verified-done attestation): it packages the
 * facts of a completed mandate into a portable W3C Verifiable Credential a
 * counterparty can check, instead of trusting the agent blind.
 *
 * Deny-by-default carries through from the gate: a mandate the gate did NOT
 * allow cannot be attested "done" (throws), and there is no anonymous
 * attestation — the HIC binding from §14.3 is required (throws on empty HIC).
 *
 * SIGNING IS DEFERRED. This stub returns the credential UNSIGNED
 * (proofStatus:'unsigned', no `proof` block). Cryptographic signing
 * (Ed25519 / Data Integrity) waits on the KYA v2.0 key-management decision —
 * which DID method, and where the issuer key lives. Issuance time and issuer
 * are caller-supplied so the credential is deterministic and the engine holds
 * no clock or key authority for a portable artifact.
 *
 * The returned credential should be logged to `kya_verified_done_attestations`
 * and recorded as a `mandate.attest` event on the §14.5 evidence chain
 * (migration 079).
 */
export function issueVerifiedDoneAttestation(input: AttestationInput): IssuedAttestation {
  if (!input.gateDecision.allowed) {
    throw new Error(
      'cannot attest a mandate the gate did not allow — deny-by-default carries through (KYA §14.7)',
    );
  }
  if (!input.hic || input.hic.trim() === '') {
    throw new Error(
      'verified-done attestation requires a HIC binding — never anonymous (KYA §14.3)',
    );
  }

  const credential: VerifiedDoneAttestation = {
    '@context': [...VERIFIED_DONE_CONTEXTS],
    type: [...VERIFIED_DONE_TYPES],
    issuer: input.issuer,
    validFrom: input.issuedAt,
    credentialSubject: {
      id: `urn:kya:mandate:${input.mandateVcId}`,
      sessionId: input.sessionId,
      subagentId: input.subagentId,
      hic: input.hic,
      protocol: input.protocol,
      mandateType: input.mandateType,
      amount: input.amount,
      currency: input.currency,
      atsAtExecution: input.atsAtExecution,
      kyaVerified: true,
      gateReason: input.gateDecision.reason,
      article12TraceId: input.article12TraceId,
    },
  };

  // Unsigned until KYA v2.0 wires real signing — no `proof` block yet.
  return { credential, proofStatus: 'unsigned' };
}

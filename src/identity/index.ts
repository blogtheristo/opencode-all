// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/identity/index.ts

/**
 * KYA Identity Module
 *
 * Agent Trust Score calculation, Capability Manifest validation,
 * and Fault Attribution types for the KYA Standard.
 *
 * @see Legal/KYA_SECURITY_v1.2.md (Know Your Agent — security foundation)
 * @see Legal/KYA_OPTIMIZATION_v1.4.md (Know Your Architecture — autoresearch extensions)
 * @see DWS_SECURITY_STANDARD.md §18
 */

export {
  calculateATS,
  evaluateMandateGate,
  issueVerifiedDoneAttestation,
  isPathPermitted,
  MANDATE_SUBJECT_URN_PREFIX,
  tenantGatingProfileSchema,
  validateTenantGatingProfile,
} from './ats-engine.js';
export {
  generateIssuerKeyPair,
  loadIssuerSignerFromEnv,
  signVerifiedDoneAttestation,
  verifyVerifiedDoneAttestation,
} from './attestation-signing.js';
export type { AttestationSigner } from './attestation-signing.js';
export { VerifiedDoneAttestationStore } from './attestation-store.js';
export type {
  AtomicVerifiedDoneAttestationSink,
  VerifiedDoneAttestationSink,
} from './attestation-store.js';
export { MandateEventLogger } from './mandate-event-logger.js';
export type { MandateEvent, MandateEventSink, MandateEventType } from './mandate-event-logger.js';
export { attestMandateExecution } from './attestation-issuance.js';
export type { AttestationIssuanceDeps, AttestationIssuanceResult } from './attestation-issuance.js';
export { evaluateSignal, executeDecision, terminateChain } from './kya-engine.js';
export type {
  ShuftiWebhookPayload,
  PolicyAction,
  PolicyDecision,
  ChainTerminationResult,
} from './kya-engine.js';
export type {
  CapabilityManifest,
  ManifestSignature,
  TelemetryEntry,
  TelemetryEvent,
  ATSResult,
  ATSBreakdown,
  IdvState,
  IdvStatus,
  PermissionLevel,
  FaultClass,
  FaultSeverity,
  FaultRecord,
  MandateType,
  ProtocolRail,
  SpendAuthority,
  TenantGatingProfile,
  MandateGateRequest,
  MandateGateDecision,
  AttestationProof,
  ProofStatus,
  VerifiedDoneSubject,
  VerifiedDoneAttestation,
  AttestationInput,
  IssuedAttestation,
} from './types.js';

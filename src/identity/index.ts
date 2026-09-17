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
  isPathPermitted,
  tenantGatingProfileSchema,
  validateTenantGatingProfile,
} from './ats-engine.js';
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
} from './types.js';

/**
 * KYA Identity Module
 *
 * Agent Trust Score calculation, Capability Manifest validation,
 * and Fault Attribution types for the KYA Standard v1.1.
 *
 * @see Legal/KYA_STANDARD_v1.md
 * @see DWS_SECURITY_STANDARD.md §18
 */

export { calculateATS, isPathPermitted } from './ats-engine.js';
export {
  evaluateSignal,
  executeDecision,
  terminateChain,
} from './kya-engine.js';
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
  PermissionLevel,
  FaultClass,
  FaultSeverity,
  FaultRecord,
} from './types.js';

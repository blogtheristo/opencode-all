/**
 * KYA (Know Your Agent) Identity Types
 *
 * Core interfaces for the Agent Trust Score engine,
 * Capability Manifests, and Fault Attribution.
 *
 * @see Legal/KYA_SECURITY_v1.2.md §9 (Subagent Registry, Manifest v1.1, Fault Attribution)
 * @see Legal/KYA_OPTIMIZATION_v1.4.md §4 (Manifest v1.2 autoresearch extensions)
 * @see DWS_SECURITY_STANDARD.md (§18)
 */

// ============ CAPABILITY MANIFEST ============

/** Signed manifest declaring an agent's permitted/denied resource paths */
export interface CapabilityManifest {
  manifestVersion: string;
  subagentId: string;
  sessionId: string;
  signedAt: string; // ISO-8601
  permittedPaths: string[];
  deniedPaths: string[];
  ttlSeconds: number;
  kyaScoreAtSign: number;
  signature: ManifestSignature;
  /** Manifest v1.3 spend-authority block (KYA §14.3). Absent = zero spend authority. */
  spendAuthority?: SpendAuthority;
}

export interface ManifestSignature {
  verified: boolean;
  algorithm: string;
  signedBy: string; // operator identity
}

// ============ TELEMETRY ============

/** Single Firehorse telemetry log entry */
export interface TelemetryEntry {
  timestamp: string; // ISO-8601
  sessionId: string;
  subagentId: string;
  event: TelemetryEvent;
  path?: string;
  status: 'ALLOWED' | 'DENIED' | 'TRAPPED';
  latency: number; // milliseconds
  metadata?: Record<string, unknown>;
}

export type TelemetryEvent =
  | 'KYA_VIOLATION'
  | 'PATH_ACCESS'
  | 'MCP_TOOL_CALL'
  | 'EGRESS_REQUEST'
  | 'SYSCALL'
  | 'SESSION_START'
  | 'SESSION_END';

// ============ AGENT TRUST SCORE ============

/** Result of an ATS calculation */
export interface ATSResult {
  score: number; // 0.0 – 1.0 (normalized)
  kyaScore: number; // 0 – 100 (mapped to KYA Trust Score ranges)
  permissionLevel: PermissionLevel;
  breakdown: ATSBreakdown;
  calculatedAt: string; // ISO-8601
  decision: 'GO' | 'NO_GO';
}

export interface ATSBreakdown {
  baseScore: number;
  violationPenalty: number;
  latencyPenalty: number;
  overreachPenalty: number;
  manifestValid: boolean;
  violationCount: number;
  deniedAttemptCount: number;
  avgLatencyMs: number;
}

export type PermissionLevel = 'full' | 'restricted' | 'suspended' | 'frozen';

// ============ SPEND AUTHORITY & MANDATE GATING (KYA §14, v1.9) ============

export type MandateType = 'intent' | 'cart' | 'payment';

export type ProtocolRail = 'ap2' | 'ucp' | 'acp';

/**
 * Spend-authority block of Capability Manifest v1.3 (KYA §14.3).
 * Absent block on a manifest = zero spend authority (deny-by-default).
 */
export interface SpendAuthority {
  currency: string; // ISO-4217
  perTaskCeiling: number;
  perDayCeiling: number;
  allowedMerchantCategories: string[];
  mandateTypesAllowed: MandateType[];
  humanNotPresent: boolean;
  protocols: ProtocolRail[];
  /** Verified human accountable for this authority — never anonymous (KYA §14.3) */
  hic: string;
}

/**
 * Per-tenant mandate gating profile (KYA §14.2.1).
 * May only tighten the platform baseline — floors are enforced by
 * validateTenantGatingProfile, never by trusting the caller.
 */
export interface TenantGatingProfile {
  profileVersion: string;
  tenantId: string;
  industryDefault?: string;
  /** Minimum ATS for Human Not Present; floor 0.90, raisable only */
  hnpMinAts: number;
  /** Per-band amount above which a human must confirm (0.80–0.89 band) */
  confirmAbove?: number;
  hnpEnabled: boolean;
}

/** A single mandate request presented to the gate before signature */
export interface MandateGateRequest {
  mandateType: MandateType;
  protocol: ProtocolRail;
  amount: number;
  currency: string;
  merchantCategory: string;
  humanPresent: boolean;
  /** Amount already spent against perDayCeiling in this session's day window */
  spentTodayTotal: number;
}

/** Gate decision for a mandate request (KYA §14.2) */
export interface MandateGateDecision {
  allowed: boolean;
  /** True when allowed only with explicit human confirmation (0.80–0.89 band above ceiling) */
  requiresHumanConfirmation: boolean;
  /** True when the attempt is a KYA Violation (outside band / above ceiling), per §14.2 */
  kyaViolation: boolean;
  reason: string;
  evaluatedAt: string; // ISO-8601
}

// ============ FAULT ATTRIBUTION ============

export type FaultClass = 'LOGIC_FAULT' | 'INTEGRATION_FAULT' | 'MANIFEST_FAULT' | 'OPERATOR_FAULT';

export type FaultSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/** Fault attribution record (stored in Supabase kya_fault_attribution) */
export interface FaultRecord {
  id?: string;
  sessionId: string;
  subagentId: string;
  faultClass: FaultClass;
  severity: FaultSeverity;
  description: string;
  evidence: Record<string, unknown>;
  kyaScoreImpact: number;
  resolved: boolean;
  resolvedBy?: string;
  createdAt?: string;
  resolvedAt?: string;
}

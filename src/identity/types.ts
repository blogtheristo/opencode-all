/**
 * KYA (Know Your Agent) Identity Types
 *
 * Core interfaces for the Agent Trust Score engine,
 * Capability Manifests, and Fault Attribution.
 *
 * @see Legal/KYA_STANDARD_v1.md (§8)
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

// ============ FAULT ATTRIBUTION ============

export type FaultClass =
  | 'LOGIC_FAULT'
  | 'INTEGRATION_FAULT'
  | 'MANIFEST_FAULT'
  | 'OPERATOR_FAULT';

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

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
 * @see Legal/KYA_STANDARD_v1.md (§2.2 Capability Gating)
 */

import type {
  CapabilityManifest,
  TelemetryEntry,
  ATSResult,
  ATSBreakdown,
  PermissionLevel,
} from './types.js';

// ============ CONSTANTS ============

/** Points deducted per KYA_VIOLATION event */
const VIOLATION_PENALTY = 0.25;

/** Points deducted per DENIED path access attempt */
const OVERREACH_PENALTY = 0.05;

/** Latency threshold (ms) above which a penalty is applied */
const LATENCY_THRESHOLD_MS = 500;

/** Penalty for avg latency exceeding threshold */
const LATENCY_PENALTY = 0.10;

/** KYA score threshold for GO decision (normalized) */
const GO_THRESHOLD = 0.50;

// ============ ATS CALCULATOR ============

/**
 * Calculates the Agent Trust Score for a subagent session.
 *
 * Pull from Firehorse telemetry logs to compute a weighted score
 * incorporating violations, latency, manifest integrity, and
 * permission overreach.
 *
 * @param manifest - Signed Capability Manifest for the session
 * @param telemetry - Firehorse telemetry log entries for the session
 * @returns ATSResult with score, breakdown, and GO/NO_GO decision
 */
export function calculateATS(
  manifest: CapabilityManifest,
  telemetry: TelemetryEntry[],
): ATSResult {
  const now = new Date().toISOString();

  // Hard kill: unsigned or expired manifest
  const manifestExpired =
    Date.now() > new Date(manifest.signedAt).getTime() + manifest.ttlSeconds * 1000;

  if (!manifest.signature.verified || manifestExpired) {
    return buildResult(0.0, {
      baseScore: 1.0,
      violationPenalty: 0,
      latencyPenalty: 0,
      overreachPenalty: 0,
      manifestValid: false,
      violationCount: 0,
      deniedAttemptCount: 0,
      avgLatencyMs: 0,
    }, now);
  }

  let score = 1.0;

  // 1. KYA Violation penalty (critical — 4 violations = zero trust)
  const violations = telemetry.filter(l => l.event === 'KYA_VIOLATION');
  const violationPenalty = violations.length * VIOLATION_PENALTY;
  score -= violationPenalty;

  // 2. Latency/SLA health
  let avgLatency = 0;
  let latencyPenalty = 0;
  if (telemetry.length > 0) {
    avgLatency = telemetry.reduce((sum, l) => sum + l.latency, 0) / telemetry.length;
    if (avgLatency > LATENCY_THRESHOLD_MS) {
      latencyPenalty = LATENCY_PENALTY;
      score -= latencyPenalty;
    }
  }

  // 3. Permission overreach (denied path access attempts)
  const deniedAttempts = telemetry.filter(l => l.status === 'DENIED');
  const overreachPenalty = deniedAttempts.length * OVERREACH_PENALTY;
  score -= overreachPenalty;

  // Floor at 0
  score = Math.max(0, score);

  return buildResult(score, {
    baseScore: 1.0,
    violationPenalty,
    latencyPenalty,
    overreachPenalty,
    manifestValid: true,
    violationCount: violations.length,
    deniedAttemptCount: deniedAttempts.length,
    avgLatencyMs: Math.round(avgLatency),
  }, now);
}

// ============ HELPERS ============

function buildResult(
  score: number,
  breakdown: ATSBreakdown,
  calculatedAt: string,
): ATSResult {
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
export function isPathPermitted(
  manifest: CapabilityManifest,
  requestedPath: string,
): boolean {
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

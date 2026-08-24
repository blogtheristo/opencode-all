/**
 * Firehorse Audit Trail Schema — KYA v1.4 Agent Governance
 *
 * Immutable JSONL audit trail for Fleet Admiral demo.
 * Every agent optimization decision is logged here.
 *
 * Storage: /mnt/firehorse-dms/logs/ (Acer Veriton GN100, 1TB partition)
 * Remote: Supabase (europe-north1) for EU data residency
 *
 * EU AI Act Article 12 compliant — full logging, transparency, human oversight.
 */

// ============================================================================
// KYA DECISION TYPES
// ============================================================================

export type KyaDecision = 'AUTO_DEPLOY' | 'PENDING' | 'ROLLBACK';

export type OptimizationScope =
  | 'routing'
  | 'scheduling'
  | 'resource_allocation'
  | 'demand_prediction'
  | 'fleet_coordination';

export type AuditEventType =
  | 'optimization_decision'
  | 'kill_switch_triggered'
  | 'human_review_requested'
  | 'human_review_completed'
  | 'agent_spawned'
  | 'agent_terminated'
  | 'fleet_emergency_stop'
  | 'efficiency_law_violation';

// ============================================================================
// CORE AUDIT EVENT
// ============================================================================

export interface FirehorseAuditEvent {
  /** Unique event ID: kya-{type}-{iso_timestamp}-{agent_id} */
  event_id: string;

  /** UTC timestamp, millisecond precision */
  timestamp: string;

  /** Event classification */
  event_type: AuditEventType;

  /** Agent that generated this event */
  agent_id: string;

  /** Firecracker MicroVM instance ID */
  microvm_id: string;

  /** SHA-256 attestation hash of the MicroVM state */
  attestation_hash: string;

  /** KYA standard version governing this event */
  kya_version: '1.0' | '1.1' | '1.2' | '1.3' | '1.4';

  /** EU AI Act Article 12 logging flag */
  eu_ai_act_article_12: true;

  /** Absolute path to the JSONL log file */
  firehorse_log_path: string;
}

// ============================================================================
// OPTIMIZATION DECISION EVENT
// ============================================================================

export interface OptimizationMetrics {
  /** What was optimized */
  scope: OptimizationScope;

  /** Metric name (e.g., fleet_latency_p95_ms, routing_efficiency_pct) */
  metric_name: string;

  /** Value before optimization */
  before_value: number;

  /** Value after optimization */
  after_value: number;

  /** Percentage change: (before - after) / before * 100 */
  delta_percent: number;

  /** KYA decision based on 11% Efficiency Law */
  decision: KyaDecision;

  /** Human-readable reason for the decision */
  reason: string;
}

export interface OptimizationDecisionEvent extends FirehorseAuditEvent {
  event_type: 'optimization_decision';

  /** The optimization metrics and decision */
  optimization: OptimizationMetrics;

  /** 11% Efficiency Law threshold (0.11) */
  efficiency_law_threshold: number;

  /** Human review record (null if auto-deployed) */
  human_review: HumanReviewRecord | null;
}

// ============================================================================
// KILL SWITCH EVENT
// ============================================================================

export interface KillSwitchEvent extends FirehorseAuditEvent {
  event_type: 'kill_switch_triggered';

  /** Reason for kill */
  trigger_reason: string;

  /** Time from trigger to confirmed kill (ms) */
  kill_latency_ms: number;

  /** Whether the <5ms SLA was met */
  sla_met: boolean;

  /** Agent state at time of kill */
  agent_state_snapshot: Record<string, unknown>;
}

// ============================================================================
// HUMAN REVIEW
// ============================================================================

export interface HumanReviewRecord {
  /** Who reviewed */
  reviewer_id: string;

  /** When review was requested */
  requested_at: string;

  /** When review was completed (null if pending) */
  completed_at: string | null;

  /** Approved, rejected, or modified */
  decision: 'approved' | 'rejected' | 'modified';

  /** Free-text notes from reviewer */
  notes: string;
}

// ============================================================================
// FLEET EMERGENCY STOP
// ============================================================================

export interface FleetEmergencyStopEvent extends FirehorseAuditEvent {
  event_type: 'fleet_emergency_stop';

  /** Number of agents stopped */
  agents_stopped: number;

  /** Total fleet-wide stop latency (target: <50ms) */
  fleet_stop_latency_ms: number;

  /** Who initiated (human ID or "automatic") */
  initiated_by: string;

  /** Reason for fleet-wide stop */
  reason: string;
}

// ============================================================================
// 11% EFFICIENCY LAW EVALUATOR
// ============================================================================

/**
 * Evaluate an optimization against the KYA v1.4 11% Efficiency Law.
 *
 * Thresholds:
 *   0-11%  → AUTO_DEPLOY (safe, log and proceed)
 *   11-25% → PENDING (human review required)
 *   >25%   → ROLLBACK (logic drift, automatic rollback)
 *
 * @param prevMetric - Previous metric value (e.g., latency in ms)
 * @param newMetric - New metric value after optimization
 * @returns Decision tuple: [KyaDecision, reason string]
 */
export function evaluateOptimization(
  prevMetric: number,
  newMetric: number,
): [KyaDecision, string] {
  if (prevMetric === 0) {
    return ['ROLLBACK', 'Division by zero: previous metric is 0'];
  }

  const delta = (prevMetric - newMetric) / prevMetric;

  if (delta > 0.25) {
    return [
      'ROLLBACK',
      `Logic Drift: ${(delta * 100).toFixed(1)}% gain exceeds 25% safety threshold`,
    ];
  }

  if (delta > 0.11) {
    return [
      'PENDING',
      `Human Gate Required: ${(delta * 100).toFixed(1)}% gain exceeds 11% Efficiency Law`,
    ];
  }

  return [
    'AUTO_DEPLOY',
    `Valid Additive Gain: ${(delta * 100).toFixed(1)}%`,
  ];
}

// ============================================================================
// AUDIT EVENT FACTORY
// ============================================================================

/**
 * Create an optimization decision audit event.
 */
export function createOptimizationEvent(params: {
  agentId: string;
  microvmId: string;
  attestationHash: string;
  scope: OptimizationScope;
  metricName: string;
  beforeValue: number;
  afterValue: number;
  logBasePath?: string;
}): OptimizationDecisionEvent {
  const delta =
    params.beforeValue === 0
      ? 0
      : ((params.beforeValue - params.afterValue) / params.beforeValue) * 100;

  const [decision, reason] = evaluateOptimization(
    params.beforeValue,
    params.afterValue,
  );

  const now = new Date().toISOString();
  const dateDir = now.slice(0, 10); // 2026-03-10
  const basePath = params.logBasePath ?? '/mnt/firehorse-dms/logs';

  return {
    event_id: `kya-opt-${now}-${params.agentId}`,
    timestamp: now,
    event_type: 'optimization_decision',
    agent_id: params.agentId,
    microvm_id: params.microvmId,
    attestation_hash: params.attestationHash,
    kya_version: '1.4',
    eu_ai_act_article_12: true,
    firehorse_log_path: `${basePath}/${dateDir}/${params.agentId}.jsonl`,
    optimization: {
      scope: params.scope,
      metric_name: params.metricName,
      before_value: params.beforeValue,
      after_value: params.afterValue,
      delta_percent: Number(delta.toFixed(2)),
      decision,
      reason,
    },
    efficiency_law_threshold: 0.11,
    human_review: null,
  };
}

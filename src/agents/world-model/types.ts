/**
 * Lifetime World Model V1 — Shared Types
 *
 * Reference implementation of the three-piece control-room loop described in
 * `docs/FIELD_NOTE_WORLD_MODEL_V1_LOOP_2026.md`:
 *
 *   Perception (anchor)  → governed StateVector from raw telemetry
 *   Imagination (sandbox) → Simulator scores each candidate action's consequence
 *   Action (loop engineer) → HIL-gated ActionProposal (never auto-applied)
 *   Reward learning        → operator override = negative reward, adjusts ranking
 *
 * This is VISION/ARCHITECTURE made runnable for one control room. It does NOT
 * integrate NVIDIA Cosmos, Tesla E2E sensors, or any live deploy path — those
 * are named in the field note as technology archetypes, not partnerships. The
 * simulator here is a deterministic reference model, and reward learning is an
 * inspectable preference-weighting (not neural backprop).
 */

/** A single raw telemetry reading from one sensor channel. */
export interface TelemetryReading {
  /** Channel key, e.g. 'temperature', 'vibration', 'wind_speed'. */
  channel: string;
  /** Raw numeric value as reported by the sensor. */
  value: number;
  /** Unit string, e.g. '°C', 'mm/s', 'm/s'. */
  unit: string;
  /** Optional source/provenance id (sensor id, feed name). */
  source?: string;
}

/** A normalized signal inside the governed state vector. */
export interface StateSignal {
  channel: string;
  value: number;
  unit: string;
  /** Source/provenance — defaults to 'unknown' when not provided. */
  source: string;
  /**
   * Deterministic severity 0..1 derived from value vs. the channel's nominal
   * band. Used by the simulator and never by an LLM (12-Rule #5).
   */
  severity: number;
}

/**
 * Governed snapshot of the world the control room is responsible for.
 * Continuous, typed, provenance-tagged — the "anchor" of the loop.
 */
export interface StateVector {
  /** ISO timestamp the snapshot was produced. */
  capturedAt: string;
  /** Normalized signals keyed by channel. */
  signals: Record<string, StateSignal>;
  /** Highest severity across all signals (0..1). Drives anomaly detection. */
  maxSeverity: number;
  /** Channels whose severity crossed the anomaly threshold. */
  anomalies: string[];
}

/** A candidate control-room action the loop may propose. */
export interface CandidateAction {
  /** Stable id for this candidate. */
  id: string;
  /** Action type used as the reward-learning key, e.g. 'throttle', 'reroute'. */
  type: string;
  /** Human-readable description. */
  description: string;
  /** Channels this action is intended to affect. */
  targets: string[];
  /**
   * Whether executing this action mutates the live running system. Any true
   * here forces a human-in-the-loop gate — it is never auto-applied.
   */
  mutatesLiveSystem: boolean;
}

/** The simulator's projection of one candidate action's consequence. */
export interface SimResult {
  actionId: string;
  /**
   * Projected benefit 0..1 — how much the action is expected to reduce
   * max severity in the simulated future. Higher is better.
   */
  projectedBenefit: number;
  /** Projected risk 0..1 introduced by taking the action. Lower is better. */
  projectedRisk: number;
  /** Deterministic base score = projectedBenefit - projectedRisk, clamped 0..1. */
  baseScore: number;
  /** Human-readable note on the projection. */
  note: string;
}

/** A simulator result after reward-weighting has been applied. */
export interface RankedAction extends SimResult {
  actionType: string;
  /** Current reward weight for this action type (0..1, default 1). */
  rewardWeight: number;
  /** Final rank score = baseScore * rewardWeight. */
  rankScore: number;
}

/**
 * The loop's output for the selected action. Crucially this is a PROPOSAL:
 * `requiresHumanApproval` is always true for live mutations and `applied` is
 * never set true by this module — a human/KYA gate owns that decision.
 */
export interface ActionProposal {
  action: CandidateAction;
  rankScore: number;
  requiresHumanApproval: boolean;
  /** Always false here; present so callers cannot mistake a proposal for a deploy. */
  applied: false;
  rationale: string;
}

/** Operator feedback fed back into reward learning. */
export interface OperatorFeedback {
  actionType: string;
  /** 'override' = negative reward, 'accept' = positive reward. */
  verdict: 'override' | 'accept';
}

/** Record of a single reward-weight change. */
export interface RewardEvent {
  actionType: string;
  verdict: 'override' | 'accept';
  weightBefore: number;
  weightAfter: number;
}

/** Input accepted by WorldModelLoopAgent.execute(). */
export interface WorldModelInput {
  /** Raw multi-modal telemetry readings (the perception feed). */
  telemetry: TelemetryReading[];
  /** Candidate actions to simulate and rank. */
  candidateActions?: CandidateAction[];
  /** Optional operator feedback from a prior cycle (drives reward learning). */
  operatorFeedback?: OperatorFeedback[];
  /** Optional override of the anomaly severity threshold (default 0.6). */
  anomalyThreshold?: number;
}

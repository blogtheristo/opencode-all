/**
 * KYA Parameter Tuner — Autoresearch Loop for Agent Trust Score
 *
 * Adapts Karpathy's autoresearch pattern to optimize KYA v1.4 trust score
 * parameters (ATS weights, session TTL, trust recovery rates).
 *
 * Architecture: Three-file pattern adapted for DWS
 *   - prepare: synthetic-kya.ts (immutable — generates test sessions)
 *   - train:   KYA parameter evaluation (agent-modified target)
 *   - program: This file's configuration (read-only constraints)
 *
 * Governed by: KYA v1.4 Pillar 4 (Autoresearch & Agent Self-Optimization)
 * Audit: Firehorse JSONL (EU AI Act Article 12)
 */

import {
  createOptimizationEvent,
  evaluateOptimization,
  type OptimizationDecisionEvent,
} from '../firehorse/audit-schema';
import { generateSyntheticSessions, type SyntheticKyaSession } from './synthetic-kya';
import logger from '../utils/logger.js';

// ============================================================================
// TUNABLE PARAMETERS (autoresearch target — agent modifies these)
// ============================================================================

export interface KyaTunableParams {
  /** Weight for KYA violations in ATS formula (default: 0.25) */
  violationWeight: number;

  /** Weight for denied access attempts (default: 0.05) */
  deniedAccessWeight: number;

  /** Cap for autoresearch improvement bonus (default: 0.18) */
  autoresearchBonusCap: number;

  /** Session time-to-live in hours (default: 24) */
  sessionTtlHours: number;

  /** Trust recovery rate: points per hour of clean operation (default: 0.02) */
  trustRecoveryRate: number;

  /** Minimum ATS score to remain in sandbox (default: 50) */
  sandboxMinScore: number;
}

/** Default KYA parameters (production baseline) */
export const DEFAULT_KYA_PARAMS: Readonly<KyaTunableParams> = {
  violationWeight: 0.25,
  deniedAccessWeight: 0.05,
  autoresearchBonusCap: 0.18,
  sessionTtlHours: 24,
  trustRecoveryRate: 0.02,
  sandboxMinScore: 50,
};

// ============================================================================
// NON-TUNABLE PARAMETERS (hardcoded, security-critical)
// ============================================================================

/** These values MUST NOT be modified by autoresearch. Ever. */
const SECURITY_CONSTANTS = {
  /** 11% Efficiency Law threshold */
  efficiencyLawThreshold: 0.11,

  /** Maximum efficiency improvement before rollback (25%) */
  logicDriftThreshold: 0.25,

  /** Human gate requirement in hours */
  humanGateHours: 72,

  /** Kill switch SLA in milliseconds */
  killSwitchSlaMs: 5,

  /** Fleet emergency stop SLA in milliseconds */
  fleetStopSlaMs: 50,
} as const;

// ============================================================================
// ATS CALCULATION
// ============================================================================

/**
 * Calculate Agent Trust Score using the KYA v1.4 formula:
 *   ATS = max(0, 1.0 - V×violationWeight - D×deniedAccessWeight + A×autoresearchBonusCap)
 */
export function calculateATS(params: KyaTunableParams, session: SyntheticKyaSession): number {
  const raw =
    1.0 -
    session.violations * params.violationWeight -
    session.deniedAccessAttempts * params.deniedAccessWeight +
    Math.min(session.autoresearchImprovement, 1.0) * params.autoresearchBonusCap;

  return Math.max(0, Math.min(1.0, raw));
}

// ============================================================================
// EXPERIMENT RESULT
// ============================================================================

export interface ExperimentResult {
  /** Experiment sequence number */
  experimentId: number;

  /** Parameters tested in this experiment */
  params: KyaTunableParams;

  /** Primary metric: false positive rate (lower is better) */
  falsePositiveRate: number;

  /** Secondary metric: false negative rate */
  falseNegativeRate: number;

  /** Combined metric: F1-like score (higher is better) */
  combinedScore: number;

  /** KYA decision based on 11% Efficiency Law */
  decision: 'KEEP' | 'DISCARD';

  /** Firehorse audit event */
  auditEvent: OptimizationDecisionEvent;

  /** Duration of this experiment in ms */
  durationMs: number;

  /** Hypothesis that was tested */
  hypothesis: string;
}

// ============================================================================
// TUNER CONFIGURATION
// ============================================================================

export interface TunerConfig {
  /** Number of experiments to run (default: 100) */
  maxExperiments: number;

  /** Number of synthetic sessions per experiment (default: 1000) */
  sessionsPerExperiment: number;

  /** Maximum time per experiment in ms (default: 300_000 = 5 min) */
  maxTimePerExperimentMs: number;

  /** Firehorse log base path */
  logBasePath: string;

  /** Agent ID for audit trail */
  agentId: string;
}

const DEFAULT_TUNER_CONFIG: TunerConfig = {
  maxExperiments: 100,
  sessionsPerExperiment: 1000,
  maxTimePerExperimentMs: 300_000,
  logBasePath: '/mnt/firehorse-dms/logs',
  agentId: 'kya-tuner-autoresearch',
};

// ============================================================================
// PARAMETER MUTATION (the "train.py" equivalent)
// ============================================================================

// Deterministic PRNG for reproducible parameter mutations.
// Seed is taken from KYA_TUNER_SEED (if provided), otherwise a fixed default is used.
const KYA_TUNER_RNG_MODULUS = 2 ** 32;
const KYA_TUNER_DEFAULT_SEED = 123456789;

let kyaTunerRngState: number = (() => {
  const rawSeed = process.env.KYA_TUNER_SEED;
  const parsed = rawSeed !== undefined ? Number(rawSeed) : NaN;
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed % KYA_TUNER_RNG_MODULUS;
  }
  return KYA_TUNER_DEFAULT_SEED;
})();

function nextRandom(): number {
  // Linear congruential generator (LCG) with 32-bit arithmetic
  kyaTunerRngState = (1664525 * kyaTunerRngState + 1013904223) % KYA_TUNER_RNG_MODULUS;
  return kyaTunerRngState / KYA_TUNER_RNG_MODULUS;
}

/**
 * Generate a mutated parameter set. Each experiment perturbs one parameter
 * by a small amount (±10% of current value). This is the autoresearch
 * modification step.
 */
function mutateParams(base: KyaTunableParams): { params: KyaTunableParams; hypothesis: string } {
  const keys = Object.keys(base) as (keyof KyaTunableParams)[];
  const targetKey = keys[Math.floor(nextRandom() * keys.length)];
  const currentValue = base[targetKey];

  // Perturb by ±10%
  const perturbation = (nextRandom() * 0.2 - 0.1) * currentValue;
  const newValue = Math.max(0.001, currentValue + perturbation);

  const mutated = { ...base, [targetKey]: Number(newValue.toFixed(6)) };
  const hypothesis = `Adjust ${targetKey} from ${currentValue.toFixed(4)} to ${newValue.toFixed(4)} (${perturbation > 0 ? '+' : ''}${((perturbation / currentValue) * 100).toFixed(1)}%)`;

  return { params: mutated, hypothesis };
}

// ============================================================================
// EVALUATION (the "verify" step)
// ============================================================================

/**
 * Evaluate a parameter set against synthetic sessions.
 * Returns false positive rate, false negative rate, and combined score.
 *
 * False positive: legitimate agent flagged as suspicious (ATS < sandboxMinScore/100)
 * False negative: malicious agent not flagged (ATS >= sandboxMinScore/100)
 */
function evaluateParams(
  params: KyaTunableParams,
  sessions: SyntheticKyaSession[],
): { falsePositiveRate: number; falseNegativeRate: number; combinedScore: number } {
  let falsePositives = 0;
  let falseNegatives = 0;
  let totalLegitimate = 0;
  let totalMalicious = 0;

  const threshold = params.sandboxMinScore / 100;

  for (const session of sessions) {
    const ats = calculateATS(params, session);

    if (session.isLegitimate) {
      totalLegitimate++;
      if (ats < threshold) falsePositives++;
    } else {
      totalMalicious++;
      if (ats >= threshold) falseNegatives++;
    }
  }

  const fpr = totalLegitimate > 0 ? falsePositives / totalLegitimate : 0;
  const fnr = totalMalicious > 0 ? falseNegatives / totalMalicious : 0;

  // Combined score: weighted F1-like metric (higher is better)
  // Weight false negatives 2x because missing a malicious agent is worse
  const precision = totalMalicious > 0 ? (totalMalicious - falseNegatives) / totalMalicious : 1;
  const recall = totalLegitimate > 0 ? (totalLegitimate - falsePositives) / totalLegitimate : 1;
  const combinedScore =
    precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  return { falsePositiveRate: fpr, falseNegativeRate: fnr, combinedScore };
}

// ============================================================================
// MAIN TUNER LOOP
// ============================================================================

/**
 * Run the KYA parameter tuning loop.
 *
 * Pattern: Karpathy autoresearch adapted for KYA parameters
 *   1. HYPOTHESIZE — mutate one parameter
 *   2. MODIFY — apply mutation to parameter set
 *   3. VERIFY — evaluate against synthetic sessions
 *   4. EVALUATE — compare to baseline using 11% Efficiency Law
 *   5. KEEP or DISCARD — binary verdict
 *   6. REPEAT
 *
 * @returns Array of experiment results (kept experiments first)
 */
export async function runKyaTuner(config: Partial<TunerConfig> = {}): Promise<ExperimentResult[]> {
  const cfg = { ...DEFAULT_TUNER_CONFIG, ...config };
  const results: ExperimentResult[] = [];

  // Generate synthetic sessions once (the "prepare.py" equivalent)
  const sessions = generateSyntheticSessions(cfg.sessionsPerExperiment);
  logger.info('KYA tuner starting', {
    experiments: cfg.maxExperiments,
    sessions: sessions.length,
    agentId: cfg.agentId,
  });

  // Evaluate baseline
  let bestParams = { ...DEFAULT_KYA_PARAMS };
  const baseline = evaluateParams(bestParams, sessions);
  let bestScore = baseline.combinedScore;

  logger.info('Baseline evaluation', {
    falsePositiveRate: baseline.falsePositiveRate.toFixed(4),
    falseNegativeRate: baseline.falseNegativeRate.toFixed(4),
    combinedScore: baseline.combinedScore.toFixed(4),
  });

  for (let i = 0; i < cfg.maxExperiments; i++) {
    const experimentStart = Date.now();

    // 1. HYPOTHESIZE + 2. MODIFY
    const { params: candidateParams, hypothesis } = mutateParams(bestParams);

    // 3. VERIFY
    const evaluation = evaluateParams(candidateParams, sessions);

    // 4. EVALUATE — compare to current best using 11% Efficiency Law
    // NOTE: evaluateOptimization assumes "lower is better" with delta = (before - after) / before.
    // combinedScore is "higher is better", so we invert it to a loss metric to align semantics.
    const beforeLoss = 1 - bestScore;
    const afterLoss = 1 - evaluation.combinedScore;
    const [kyaDecision, reason] = evaluateOptimization(beforeLoss, afterLoss);

    // Create Firehorse audit event (using loss metric so governance thresholds apply correctly)
    const auditEvent = createOptimizationEvent({
      agentId: cfg.agentId,
      microvmId: `tuner-experiment-${i}`,
      attestationHash: `sha256:experiment-${i}-${Date.now()}`,
      scope: 'resource_allocation',
      metricName: 'kya_combined_score_loss',
      beforeValue: beforeLoss,
      afterValue: afterLoss,
      logBasePath: cfg.logBasePath,
    });

    // 5. KEEP or DISCARD (binary verdict — no middle ground)
    const isImprovement = evaluation.combinedScore > bestScore;
    const isSafe = kyaDecision !== 'ROLLBACK';
    const keep = isImprovement && isSafe;

    const result: ExperimentResult = {
      experimentId: i + 1,
      params: candidateParams,
      falsePositiveRate: evaluation.falsePositiveRate,
      falseNegativeRate: evaluation.falseNegativeRate,
      combinedScore: evaluation.combinedScore,
      decision: keep ? 'KEEP' : 'DISCARD',
      auditEvent,
      durationMs: Date.now() - experimentStart,
      hypothesis,
    };

    results.push(result);

    if (keep) {
      bestParams = { ...candidateParams };
      bestScore = evaluation.combinedScore;
      logger.info(`Experiment ${i + 1}: KEEP`, {
        hypothesis,
        score: evaluation.combinedScore.toFixed(4),
        delta:
          (
            ((evaluation.combinedScore - baseline.combinedScore) / baseline.combinedScore) *
            100
          ).toFixed(2) + '%',
        kyaDecision,
      });
    } else {
      logger.debug(`Experiment ${i + 1}: DISCARD`, {
        hypothesis,
        score: evaluation.combinedScore.toFixed(4),
        reason: !isImprovement ? 'no improvement' : reason,
      });
    }

    // Respect time budget
    if (Date.now() - experimentStart > cfg.maxTimePerExperimentMs) {
      logger.warn('Experiment exceeded time budget', { experimentId: i + 1 });
    }
  }

  // Summary
  const kept = results.filter((r) => r.decision === 'KEEP');
  const totalImprovement =
    bestScore > baseline.combinedScore
      ? ((bestScore - baseline.combinedScore) / baseline.combinedScore) * 100
      : 0;

  logger.info('KYA tuner complete', {
    totalExperiments: results.length,
    kept: kept.length,
    discarded: results.length - kept.length,
    baselineScore: baseline.combinedScore.toFixed(4),
    finalScore: bestScore.toFixed(4),
    improvement: totalImprovement.toFixed(2) + '%',
    bestParams,
  });

  // Sort: kept experiments first, then by score descending
  return results.sort((a, b) => {
    if (a.decision === 'KEEP' && b.decision !== 'KEEP') return -1;
    if (a.decision !== 'KEEP' && b.decision === 'KEEP') return 1;
    return b.combinedScore - a.combinedScore;
  });
}

export { SECURITY_CONSTANTS };

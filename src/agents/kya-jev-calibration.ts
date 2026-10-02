// Evidence: Tool=Claude Code 2.1.283 Agent=claude-code Date=2026-09-27
// Audit trail: git log -- src/agents/kya-jev-calibration.ts
import type { TypedDecisionResult } from './kya-jev.js';

export interface LabeledDecision {
  /** kya-jev self-reported confidence for the decision it made. */
  confidence: number;
  /** Whether a human label agreed with that decision. */
  correct: boolean;
}

export interface CalibrationOptions {
  /** Accuracy the accepted band must reach on the labeled set. */
  targetAccuracy?: number;
  /** Fewer labels than this and no threshold is fitted. */
  minExamples?: number;
}

export type Calibration =
  | {
      status: 'fitted';
      threshold: number;
      acceptedAccuracy: number;
      coverage: number;
      confidentHalfAccuracy: number;
      n: number;
    }
  | { status: 'insufficient-labels' | 'target-unreachable'; n: number };

export const DEFAULT_TARGET_ACCURACY = 0.9;
export const DEFAULT_MIN_EXAMPLES = 10;

/**
 * Fit an accept threshold on labeled kya-jev decisions: the lowest confidence
 * cut whose accepted band still meets targetAccuracy, which maximises coverage.
 * Everything below the threshold is meant to escalate to a heavier model or HIC.
 */
export function fitCalibration(
  examples: LabeledDecision[],
  options: CalibrationOptions = {},
): Calibration {
  const target = options.targetAccuracy ?? DEFAULT_TARGET_ACCURACY;
  const minExamples = options.minExamples ?? DEFAULT_MIN_EXAMPLES;
  const valid = examples.filter(
    (e) => Number.isFinite(e.confidence) && e.confidence >= 0 && e.confidence <= 1,
  );
  const n = valid.length;
  if (n < minExamples) return { status: 'insufficient-labels', n };

  const sorted = [...valid].sort((a, b) => b.confidence - a.confidence);
  const half = sorted.slice(0, Math.ceil(n / 2));
  const confidentHalfAccuracy = half.filter((e) => e.correct).length / half.length;

  let best: { threshold: number; accuracy: number; accepted: number } | null = null;
  let correctSoFar = 0;
  for (let i = 0; i < sorted.length; i++) {
    correctSoFar += sorted[i].correct ? 1 : 0;
    // Only cut between distinct confidences so ties are never split.
    if (i + 1 < sorted.length && sorted[i + 1].confidence === sorted[i].confidence) continue;
    const accepted = i + 1;
    const accuracy = correctSoFar / accepted;
    if (accuracy >= target) best = { threshold: sorted[i].confidence, accuracy, accepted };
  }

  if (!best) return { status: 'target-unreachable', n };
  return {
    status: 'fitted',
    threshold: best.threshold,
    acceptedAccuracy: best.accuracy,
    coverage: best.accepted / n,
    confidentHalfAccuracy,
    n,
  };
}

/** Accept only a non-abstained decision at or above a fitted threshold; escalate the rest. */
export function routeDecision(
  result: TypedDecisionResult,
  calibration: Calibration,
): 'accept' | 'escalate' {
  if (calibration.status !== 'fitted' || result.abstained) return 'escalate';
  return result.confidence >= calibration.threshold ? 'accept' : 'escalate';
}

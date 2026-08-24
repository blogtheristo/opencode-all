/**
 * Imagination layer — "The Sandbox".
 *
 * Projects the consequence of each candidate action BEFORE it executes. The
 * `Simulator` interface is the seam where a real physics-aware world model
 * (e.g. an NVIDIA Cosmos-class adapter) could later plug in. Shipped here is a
 * `ReferenceSimulator`: a deterministic heuristic forward model. It is honest
 * about what it is — a reference, not Cosmos.
 */

import type { CandidateAction, SimResult, StateVector } from './types.js';

/** Pluggable forward model. Real adapters implement the same contract. */
export interface Simulator {
  /** Project the consequence of one action against the current state. */
  project(state: StateVector, action: CandidateAction): SimResult;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/**
 * Deterministic reference simulator.
 *
 * Benefit: how much severity the action could relieve on the channels it
 * targets (sum of targeted severities, normalized). Risk: a fixed structural
 * risk for touching the live system plus a small risk that scales with how
 * many channels the action perturbs. baseScore = benefit - risk, clamped.
 *
 * Pure and deterministic: identical (state, action) always yields the same
 * SimResult, which is what makes the loop auditable.
 */
export class ReferenceSimulator implements Simulator {
  /** Structural risk added whenever an action mutates the live system. */
  private readonly liveMutationRisk: number;
  /** Per-target perturbation risk. */
  private readonly perTargetRisk: number;

  constructor(opts: { liveMutationRisk?: number; perTargetRisk?: number } = {}) {
    this.liveMutationRisk = opts.liveMutationRisk ?? 0.2;
    this.perTargetRisk = opts.perTargetRisk ?? 0.05;
  }

  project(state: StateVector, action: CandidateAction): SimResult {
    const targets = action.targets.length > 0 ? action.targets : Object.keys(state.signals);

    let relievedSeverity = 0;
    let matchedTargets = 0;
    for (const channel of targets) {
      const signal = state.signals[channel];
      if (signal) {
        relievedSeverity += signal.severity;
        matchedTargets++;
      }
    }

    // Normalize benefit by the matched targets so a broad action is not rewarded
    // merely for touching many channels.
    const projectedBenefit = matchedTargets > 0 ? clamp01(relievedSeverity / matchedTargets) : 0;

    const projectedRisk = clamp01(
      (action.mutatesLiveSystem ? this.liveMutationRisk : 0) + this.perTargetRisk * targets.length,
    );

    const baseScore = clamp01(projectedBenefit - projectedRisk);

    const note =
      matchedTargets === 0
        ? 'Action targets no live signal — projected benefit is zero.'
        : `Projected to relieve ${(projectedBenefit * 100).toFixed(0)}% mean severity on ` +
          `${matchedTargets} channel(s) at ${(projectedRisk * 100).toFixed(0)}% risk.`;

    return {
      actionId: action.id,
      projectedBenefit,
      projectedRisk,
      baseScore,
      note,
    };
  }
}

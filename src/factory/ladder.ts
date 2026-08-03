/**
 * The routing ladder: how detector evidence becomes a stable routing action.
 *
 * Decisions run in two stages. Stage one is a binary gate — is this agent failing badly
 * enough to intervene at all? Most checkpoints end there. Stage two runs only when the
 * gate fires and asks which of the four actions to take. Both stages are transparent
 * local heuristics over the SignalReport; there is no network call and no external
 * decision service (HIC decision 2026-08-03 — the Levanto Sage dependency was the
 * reason SageRoute itself was rejected).
 *
 * Guardrails, in order of authority:
 *  - Budget stop before anything: spend limits are policy, never delegated to a model.
 *  - Capability before retry: a restart hands the same task back to the same weak
 *    model, which helps only when the context is polluted — never when the model
 *    simply cannot do the work.
 *  - Asymmetric hysteresis: the first cheap→strong hop is the cheapest, most
 *    reversible move on the ladder, so it fires on one bad checkpoint; restarts and
 *    human escalation are disruptive and need repeated agreement.
 *  - One-way ladder: cheap → strong → restart → human. Never demote.
 *
 * Adapted from codejunkie99/sageroute (MIT): src/core/policy.ts + the offline decision
 * heuristics from src/core/sage.ts, folded into one synchronous module.
 */

import type { SignalReport } from './detectors.js';
import {
  isFactoryAction,
  type FactoryAction,
  type FactoryRouterConfig,
  type LadderState,
  type Verdict,
} from './types.js';

/**
 * Stage one: P(this agent needs intervention). Transparent additive heuristic — each
 * detector contributes a fixed weight, so any verdict can be explained from the report.
 */
export function interventionProbability(report: SignalReport): number {
  const failed = report.consecutiveFailedVerifications;
  const healthy = report.lastVerificationPassed === true && failed === 0 && !report.loopDetected;
  if (healthy) return 0.05;

  let probability = 0.1;
  probability += Math.min(failed, 4) * 0.15;
  probability += Math.min(report.rewriteRetestCycles, 4) * 0.08;
  probability += report.loopDetected ? 0.32 : 0;
  probability += report.recentErrorRate >= 0.5 ? 0.25 : 0;
  probability += report.stepsSinceProgress >= 3 ? 0.15 : 0;
  return Math.max(0, Math.min(0.99, probability));
}

/** Stage two: given that intervention is warranted, score the four actions. */
export function actionProbabilities(report: SignalReport): Record<FactoryAction, number> {
  const scores: Record<FactoryAction, number> = {
    continue: 0.05,
    switch_model: 0.05,
    restart_clean: 0.05,
    escalate_human: 0.05,
  };

  // Budget is deliberately absent here: spend policy is decide()'s hard stop,
  // driven by config.budgetEscalateFraction — never a magic number in scoring.
  const verified = report.lastVerificationPassed === true;
  if (verified && report.recentErrorRate < 0.4) scores.continue = 0.93;
  else if (report.loopDetected && report.switchesUsed >= 1) scores.restart_clean = 0.78;
  else if (report.recentErrorRate >= 0.5 || report.loopDetected || report.stepsSinceProgress >= 3)
    scores.switch_model = 0.82;
  else scores.continue = 0.71;

  return scores;
}

function verdict(partial: Partial<Verdict> & Pick<Verdict, 'action' | 'reason'>): Verdict {
  return {
    confidence: 0,
    probabilities: {},
    interventionProbability: 0,
    ...partial,
  };
}

/**
 * Turn the current evidence into a routing action, wrapped in the guardrails a
 * production router needs. `state` is mutated to record consumed switches/restarts and
 * hysteresis progress — hold it per session.
 */
export function decide(
  config: FactoryRouterConfig,
  report: SignalReport,
  state: LadderState,
): Verdict {
  // Local hard stop first: an exhausted budget cannot spend more.
  if (config.budgetUsd > 0 && report.budgetBurn >= config.budgetEscalateFraction) {
    return verdict({
      action: 'escalate_human',
      confidence: 1,
      reason:
        `budget burn ${(report.budgetBurn * 100).toFixed(0)}% >= ` +
        `${(config.budgetEscalateFraction * 100).toFixed(0)}%`,
    });
  }

  const onStrong = report.tier === 'strong';

  // Stage 1: is intervention warranted at all?
  const gate = interventionProbability(report);
  if (gate < config.interventionThreshold) {
    state.consecutiveBad = 0;
    return verdict({
      action: 'continue',
      confidence: gate,
      reason:
        `trajectory healthy (P(intervene)=${gate.toFixed(2)} < ` +
        `${config.interventionThreshold.toFixed(2)})`,
      interventionProbability: gate,
    });
  }

  // Stage 2: intervention is warranted, so pick the action.
  const probabilities = actionProbabilities(report);
  let proposed: FactoryAction = 'continue';
  for (const [name, value] of Object.entries(probabilities)) {
    if (isFactoryAction(name) && value > probabilities[proposed]) proposed = name;
  }

  // The gate already established something is wrong. If the scorer still says
  // `continue`, take the next-best action rather than ignoring the gate outright.
  if (proposed === 'continue') {
    const ranked = (Object.entries(probabilities) as Array<[FactoryAction, number]>)
      .filter(([name]) => name !== 'continue')
      .sort((a, b) => b[1] - a[1]);
    proposed = ranked.length > 0 ? ranked[0]![0] : 'switch_model';
  }

  const out = verdict({
    action: proposed,
    confidence: probabilities[proposed],
    reason: 'detector verdict',
    probabilities,
    interventionProbability: gate,
  });

  // Capability before retry: while still on the cheap tier with a switch available,
  // climb first.
  if (proposed === 'restart_clean' && !onStrong && state.switchesUsed < config.maxSwitches) {
    proposed = 'switch_model';
    out.action = proposed;
    out.reason = 'restart requested on cheap tier; upgrading capability first';
  }

  // Asymmetric hysteresis: first cheap→strong hop fires on one bad checkpoint.
  let required = config.consecutiveBadRequired;
  if (proposed === 'switch_model' && !onStrong && state.switchesUsed === 0) required = 1;

  state.consecutiveBad += 1;
  if (state.consecutiveBad < required) {
    return verdict({
      action: 'continue',
      confidence: out.confidence,
      reason: `bad checkpoint ${state.consecutiveBad}/${required}, holding`,
      probabilities: out.probabilities,
      interventionProbability: gate,
    });
  }

  if (proposed === 'switch_model') {
    if (onStrong) {
      // Already at the top of the ladder: the next rung is a restart, never a demotion.
      if (state.restartsUsed < config.maxRestarts) {
        out.action = 'restart_clean';
        out.reason = 'already on strong model; restarting clean instead';
        state.restartsUsed += 1;
      } else {
        out.action = 'escalate_human';
        out.reason = 'strong model still failing and restarts exhausted';
      }
      state.consecutiveBad = 0;
      return out;
    }
    if (state.switchesUsed >= config.maxSwitches) {
      out.action = 'escalate_human';
      out.reason = 'switch budget exhausted';
      state.consecutiveBad = 0;
      return out;
    }
    state.switchesUsed += 1;
    out.reason = 'agent struggling on cheap model; escalating capability';
    state.consecutiveBad = 0;
    return out;
  }

  if (proposed === 'restart_clean') {
    if (state.restartsUsed >= config.maxRestarts) {
      out.action = 'escalate_human';
      out.reason = 'restart budget exhausted';
    } else {
      state.restartsUsed += 1;
      out.reason = 'trajectory polluted; restarting from clean context';
    }
    state.consecutiveBad = 0;
    return out;
  }

  state.consecutiveBad = 0;
  out.action = 'escalate_human';
  out.reason = 'detectors escalated to human review';
  return out;
}

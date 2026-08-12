/**
 * DWS Factory Router — shared types.
 *
 * Evidence-based cheap→strong model escalation for agent runs. The router watches what
 * an agent actually did (tool calls, error classes, loops, stalls, budget burn) and
 * climbs a one-way ladder only when the evidence demands it:
 *
 *   continue → switch_model → restart_clean → escalate_human
 *
 * All decisions are computed locally from deterministic detectors plus a transparent
 * heuristic — nothing leaves the machine (HIC decision 2026-08-03, field note
 * docs/field-notes/2026-08-03-agent-factory-sageroute-audit.md).
 *
 * Adapted from codejunkie99/sageroute (MIT), with the external Sage API dependency and
 * subscription OAuth removed.
 */

export const FACTORY_ACTIONS = [
  "continue",
  "switch_model",
  "restart_clean",
  "escalate_human",
] as const;

export type FactoryAction = (typeof FACTORY_ACTIONS)[number];

export function isFactoryAction(value: string): value is FactoryAction {
  return (FACTORY_ACTIONS as readonly string[]).includes(value);
}

export type ModelTier = "cheap" | "strong";

export interface FactoryRouterConfig {
  /** Gate: minimum P(intervene) before the four-way action decision runs. */
  interventionThreshold: number;
  /** Bad checkpoints required before a disruptive action fires (hysteresis). */
  consecutiveBadRequired: number;
  /** Cheap→strong switches allowed per session. */
  maxSwitches: number;
  /** Clean restarts allowed per session. */
  maxRestarts: number;
  /** Session budget in USD; 0 disables budget policing. */
  budgetUsd: number;
  /** Fraction of budget burned that forces escalate_human before any other logic. */
  budgetEscalateFraction: number;
}

export const DEFAULT_FACTORY_CONFIG: FactoryRouterConfig = {
  interventionThreshold: 0.6,
  consecutiveBadRequired: 2,
  maxSwitches: 1,
  maxRestarts: 1,
  budgetUsd: 0,
  budgetEscalateFraction: 0.85,
};

export interface LadderState {
  switchesUsed: number;
  restartsUsed: number;
  consecutiveBad: number;
}

export function freshLadderState(): LadderState {
  return { switchesUsed: 0, restartsUsed: 0, consecutiveBad: 0 };
}

export interface Verdict {
  action: FactoryAction;
  confidence: number;
  reason: string;
  probabilities: Record<string, number>;
  /** Stage-one gate output: P(this agent needs intervention). */
  interventionProbability: number;
}

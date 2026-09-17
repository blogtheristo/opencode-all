/**
 * Autonomy Phase Helpers — DWS IQ 6/7
 *
 * Small, dependency-free helpers for comparing KYA autonomy phases.
 * Kept separate from types.ts so the type module stays declaration-only.
 *
 * Phase ladder (silent_pilot < advisor < autonomous) gates proactive action:
 * an agent must be at least 'advisor' before it may send a proactive nudge.
 */

import type { AutonomyPhase, NotifyConfig } from './types.js';

/** Numeric rank used for phase comparisons */
export const AUTONOMY_PHASE_RANK: Record<AutonomyPhase, number> = {
  silent_pilot: 1,
  advisor: 2,
  autonomous: 3,
};

/** Default notify limits when an agent is promoted without explicit config */
export const DEFAULT_NOTIFY_CONFIG: NotifyConfig = {
  channels: ['email', 'in_app'],
  maxPerHour: 5,
  maxPerDay: 20,
};

/** True when `phase` is at least `min` on the autonomy ladder. */
export function isPhaseAtLeast(phase: AutonomyPhase | undefined, min: AutonomyPhase): boolean {
  return AUTONOMY_PHASE_RANK[phase ?? 'silent_pilot'] >= AUTONOMY_PHASE_RANK[min];
}

/**
 * Follow-up Cadence Configuration
 *
 * Pipeline-specific nudge schedules and templates.
 * Business days = Mon-Fri. Holidays ignored (good enough for single founder).
 *
 * Cadence per pipeline (days between nudges):
 *   investor: 3, 5, 2  (aggressive — VCs expect follow-up)
 *   customer: 5, 7, 3  (balanced — enterprises are slow)
 *   partner:  7, 10, 5 (patient — partnerships simmer)
 *
 * Max nudges before auto-park:
 *   investor: 3
 *   customer: 3
 *   partner:  2
 */

import type { OutreachPipeline } from './types.js';

export interface CadenceConfig {
  /** Days between nudges (business days, Mon-Fri) */
  intervals: number[];
  /** Max nudges before thread gets parked */
  maxNudges: number;
}

export const CADENCE: Record<OutreachPipeline, CadenceConfig> = {
  investor: { intervals: [3, 5, 2], maxNudges: 3 },
  customer: { intervals: [5, 7, 3], maxNudges: 3 },
  partner: { intervals: [7, 10, 5], maxNudges: 2 },
};

/**
 * Nudge templates per pipeline.
 * Each array index corresponds to nudge_count (0 = first nudge, 1 = second, etc).
 * Falls back to last template if nudge_count exceeds array length.
 */
export const NUDGE_TEMPLATES: Record<OutreachPipeline, string[]> = {
  investor: [
    'Follow up on intro — short note reiterating fit and asking for 15min call',
    'Gentle bump with one new data point (traction, customer, partnership)',
    'Final check-in — "completely understand if timing isn\'t right, door is open"',
  ],
  customer: [
    'Follow up with value prop — specific pain point for their industry',
    'Share relevant case study or compliance deadline reminder',
    'Final outreach — offer free compliance gap assessment',
  ],
  partner: [
    'Follow up on collaboration idea — reference shared ecosystem',
    'Suggest concrete next step (joint demo, shared customer intro)',
  ],
};

/**
 * Get the nudge template for a given pipeline and nudge count.
 */
export function getNudgeTemplate(pipeline: OutreachPipeline, nudgeCount: number): string {
  const templates = NUDGE_TEMPLATES[pipeline];
  const idx = Math.min(nudgeCount, templates.length - 1);
  return templates[idx];
}

/**
 * Get the interval (business days) until next nudge.
 */
export function getNextNudgeInterval(pipeline: OutreachPipeline, nudgeCount: number): number {
  const { intervals } = CADENCE[pipeline];
  const idx = Math.min(nudgeCount, intervals.length - 1);
  return intervals[idx];
}

/**
 * Check if a thread has exceeded max nudges for its pipeline.
 */
export function isMaxedOut(pipeline: OutreachPipeline, nudgeCount: number): boolean {
  return nudgeCount >= CADENCE[pipeline].maxNudges;
}

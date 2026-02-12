/**
 * Morning Briefing Module — CEO Cockpit
 *
 * 5-minute daily briefing at 06:00 Helsinki, Mon-Sat.
 *
 * Sections:
 *   1. 3 Changes (pipeline, product, delivery)
 *   2. Today's 3 Bets
 *   3. Top Risk + next action
 *   4. Captain Momentum (who to ping + artifact)
 *   5. Metrics Strip (MRR, active convos, commits, MVP ETA)
 *   6. Send List (3-5 contacts for manual outreach)
 */

export { morningBriefingScheduler, MorningBriefingScheduler } from './scheduler.js';
export { collectCockpitData } from './data-collectors.js';
export { buildCockpitHtml, buildCockpitPlainText } from './briefing-template.js';
export type {
  CockpitData,
  ThreeChanges,
  SendListItem,
  CaptainMomentum,
  TopRisk,
  MetricsStrip,
} from './data-collectors.js';

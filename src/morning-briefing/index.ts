/**
 * Morning Briefing Module — CEO Cockpit
 *
 * 5-minute daily briefing at 06:00 Helsinki, Mon-Sat.
 * Delivered via GitHub Actions (.github/workflows/morning-briefing.yml).
 */

export { sendBriefingNow, sendSalesBriefNow } from './scheduler.js';
export { collectCockpitData } from './data-collectors.js';
export {
  buildCockpitHtml,
  buildCockpitPlainText,
  buildSalesBriefHtml,
  buildSalesBriefPlainText,
} from './briefing-template.js';
export type {
  CockpitData,
  ThreeChanges,
  SendListItem,
  CaptainMomentum,
  TopRisk,
  MetricsStrip,
  WorkflowData,
  ConstructionLeadsData,
} from './data-collectors.js';

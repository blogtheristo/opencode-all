/**
 * Captain Pre-Briefing Module
 *
 * Prepares the CEO before captain calls with thread history,
 * talking points, and suggested actions from Supabase data.
 */

export { collectCaptainBriefingData } from './data-collectors.js';
export {
  buildCaptainBriefingHtml,
  buildCaptainBriefingPlainText,
} from './briefing-template.js';
export type {
  CaptainBriefingData,
  CaptainThread,
  CaptainPerson,
  CaptainOrg,
  OutreachActivity,
  ProposalInfo,
  MeetingInfo,
} from './data-collectors.js';

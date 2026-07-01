/**
 * Outreach Module
 *
 * Three parallel pipelines:
 *   1. Investors — Climate seed VCs, angels, grants
 *   2. Customers — CSRD buyers (250+ employees)
 *   3. Partners — IFS Cloud, One Click LCA, SAP, Big 4
 *
 * Schema: outreach_orgs + persons + outreach_threads + outreach_activities + inbound_emails
 * Daily digest: one email to risto@lifetime.fi, Mon-Fri 06:00 Helsinki
 * Reply-to-email: user replies with "T:TOKEN status responded" to update threads
 *
 * Thread fields for digest (no activity scanning):
 *   - thread_token → stable 10-char reply token (T:XXXXXXXX)
 *   - next_action + next_action_type + next_action_date → OVERDUE / TODAY
 *   - waiting_since → "waiting Xd" display
 *   - last_outbound_at → cadence timing
 *   - nudge_count → auto-park after max nudges
 */

export { outreachScheduler } from './scheduler.js';
export { generateDailyDigest, sendDailyDigestEmail } from './daily-digest.js';
export { generateProspectEmail } from './prospect-email-templates.js';
export type { EmailType, ProspectContext } from './prospect-email-templates.js';
export {
  CADENCE,
  NUDGE_TEMPLATES,
  getNudgeTemplate,
  getNextNudgeInterval,
  isMaxedOut,
} from './cadence.js';
export { parseReplyText, generateThreadToken, isAuthorizedSender } from './reply-parser.js';
export type { UpdateCommand, ParseResult, ApplyResult } from './reply-parser.js';
export type {
  Organization,
  Person,
  PersonEmail,
  OutreachThread,
  OutreachActivity,
  OutreachPipeline,
  OutreachDailyTask,
  DailyDigest,
  PipelineSummary,
  EnrichedThread,
  StatusBucket,
  DigestThread,
  DigestPipelineSection,
} from './types.js';

/**
 * Outreach Module
 *
 * Three parallel pipelines:
 *   1. Investors — Climate seed VCs, angels, grants
 *   2. Customers — CSRD buyers (250+ employees)
 *   3. Partners — IFS Cloud, One Click LCA, SAP, Big 4
 *
 * Schema: organizations (domain key) + persons (LinkedIn URL key) + outreach_threads + outreach_activities
 * Daily digest: 3 tasks emailed to risto@lifetime.fi, Mon-Fri 07:00 Helsinki
 */

export { outreachScheduler } from './scheduler.js';
export { generateDailyDigest, sendDailyDigestEmail } from './daily-digest.js';
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
} from './types.js';

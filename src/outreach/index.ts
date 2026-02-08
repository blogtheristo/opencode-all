/**
 * Outreach Module
 *
 * Three parallel pipelines:
 *   1. Investors — Climate seed VCs, angels, grants
 *   2. Customers — CSRD buyers (250+ employees)
 *   3. Partners — IFS Cloud, One Click LCA, SAP, Big 4
 *
 * Daily digest: 3 tasks emailed to risto@lifetime.fi, Mon-Fri 07:00 Helsinki
 */

export { outreachScheduler } from './scheduler.js';
export { generateDailyDigest, sendDailyDigestEmail } from './daily-digest.js';
export type {
  OutreachContact,
  OutreachPipeline,
  OutreachDailyTask,
  DailyDigest,
  PipelineSummary,
} from './types.js';

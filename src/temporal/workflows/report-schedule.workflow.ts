/**
 * Temporal Workflow — Firehorse Report Schedule (Use case #4)
 *
 * One workflow execution per due schedule row, started by a Temporal
 * Schedule that fires hourly (replaces the node-cron poll loop). Claim →
 * generate → email is now one durable sequence: if the worker crashes
 * after claim but before email, Temporal replays from history and retries
 * the email Activity — it does not silently move on the way the old
 * node-cron loop did on a send failure.
 */
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/reports.activities.js';

const { claimReportScheduleActivity, generateReportActivity, emailReportActivity } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '2 minutes',
    retry: { initialInterval: '15 seconds', maximumAttempts: 5 },
  });

export interface ReportScheduleWorkflowInput {
  schedule: activities.ReportScheduleRow;
}

export interface ReportScheduleWorkflowResult {
  claimed: boolean;
  delivered: boolean;
}

export async function reportScheduleWorkflow(
  input: ReportScheduleWorkflowInput,
): Promise<ReportScheduleWorkflowResult> {
  const claimed = await claimReportScheduleActivity(input.schedule);
  if (!claimed) {
    // Another execution already claimed this period — not an error.
    return { claimed: false, delivered: false };
  }

  const report = await generateReportActivity(input.schedule);
  await emailReportActivity({ schedule: input.schedule, report });

  return { claimed: true, delivered: true };
}

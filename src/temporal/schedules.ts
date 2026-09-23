/**
 * Temporal Schedules (Use case #8)
 *
 * Server-side cron equivalent — replaces the node-cron hourly poll in
 * src/firehorse/report-scheduler.ts with one Temporal Schedule per due-row
 * check. Only jobs whose failure needs retry/observability move here; pure
 * housekeeping cron (backups, log rotation) stays on DGX Spark/GHA cron
 * per the initial use-case survey (docs/dws-use-cases.md §8).
 */
import { ScheduleOverlapPolicy } from '@temporalio/client';
import { getTemporalClient } from './client.js';
import { TASK_QUEUES } from './task-queues.js';

const REPORT_SCHEDULE_POLL_ID = 'dws-report-schedule-poll';

/**
 * Creates (idempotently) the hourly Schedule that triggers the report-schedule
 * poll. The poll itself (fetching due rows and starting one
 * reportScheduleWorkflow per row) is a small script, not a Workflow, since it
 * only needs to run once an hour and fan out — see scripts/temporal-report-poll.ts.
 */
export async function ensureReportSchedulePoll(): Promise<void> {
  const client = await getTemporalClient();

  const existing = client.schedule.getHandle(REPORT_SCHEDULE_POLL_ID);
  const exists = await existing.describe().catch(() => null);
  if (exists) return;

  await client.schedule.create({
    scheduleId: REPORT_SCHEDULE_POLL_ID,
    spec: { cronExpressions: ['0 * * * *'] }, // every hour at :00, matches the old node-cron spec
    action: {
      type: 'startWorkflow',
      workflowType: 'reportSchedulePollWorkflow',
      taskQueue: TASK_QUEUES.REPORTS,
      args: [],
    },
    policies: { overlap: ScheduleOverlapPolicy.SKIP },
  });
}

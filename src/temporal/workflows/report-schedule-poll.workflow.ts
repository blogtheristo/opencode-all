/**
 * Temporal Workflow — Report Schedule Poll (Use case #8 + #4)
 *
 * Triggered hourly by the Temporal Schedule in schedules.ts. Fetches due
 * rows, then runs one child reportScheduleWorkflow per row sequentially —
 * this is the direct replacement for the node-cron loop body in
 * src/firehorse/report-scheduler.ts's runDueSchedulesInternal().
 */
import { executeChild, proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/reports.activities.js';
import { reportScheduleWorkflow } from './report-schedule.workflow.js';
import { ticketId } from '../ticket-id.js';

const { fetchDueReportSchedulesActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
  retry: { initialInterval: '5 seconds', maximumAttempts: 3 },
});

export interface ReportSchedulePollWorkflowResult {
  processed: number;
  delivered: number;
}

export async function reportSchedulePollWorkflow(): Promise<ReportSchedulePollWorkflowResult> {
  const due = await fetchDueReportSchedulesActivity();

  let delivered = 0;
  for (const schedule of due) {
    const result = await executeChild(reportScheduleWorkflow, {
      args: [{ schedule }],
      workflowId: ticketId('report-schedule', `${schedule.id}-${schedule.next_run_at}`),
    });
    if (result.delivered) delivered += 1;
  }

  return { processed: due.length, delivered };
}

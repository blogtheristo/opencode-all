/**
 * Standalone Activity starter — TED Notice Ingestion (Use case #2)
 *
 * Replaces the earlier tedBatchIngestWorkflow: each notice is its own
 * durable job (Activity ID = the TED notice number), so a re-poll that
 * re-sees the same notice joins the existing job (USE_EXISTING) instead of
 * a Workflow having to track per-notice failure isolation itself — Temporal
 * already isolates each Standalone Activity's outcome from the others.
 */
import type { TedNotice } from '../../construction-leads/types.js';
import { submitStandaloneActivity } from '../standalone.js';
import { TASK_QUEUES } from '../task-queues.js';

export async function startTedNoticeIngestJob(notice: TedNotice): Promise<{ activityId: string }> {
  return submitStandaloneActivity({
    activity: 'ingestTedNoticeActivity',
    taskQueue: TASK_QUEUES.TED,
    id: `ted-${notice.ND}`,
    args: [notice],
    startToCloseTimeout: '30 seconds',
    retry: { initialInterval: '5 seconds', maximumAttempts: 4 },
  });
}

/** Submits one job per notice; does not wait for any of them to complete. */
export async function startTedBatchIngestJobs(
  notices: TedNotice[],
): Promise<Array<{ activityId: string }>> {
  return Promise.all(notices.map(startTedNoticeIngestJob));
}

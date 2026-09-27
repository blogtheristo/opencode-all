/**
 * SUPERSEDED — kept as _OLD per CLAUDE.md Rule 6 (rename over delete), not
 * wired into src/temporal/workflows/index.ts. Replaced by
 * src/temporal/starters/ted.starter.ts: each notice is its own Standalone
 * Activity job (Activity ID = notice number), so Temporal itself isolates
 * one bad notice from the rest of the batch — no Workflow loop needed to
 * get that isolation. See docs/dws-use-cases.md use case #2.
 *
 * Temporal Workflow — TED Batch Ingest (Use case #2)
 *
 * Fans out one Activity per notice so a single malformed notice can't stall
 * (or, under the old single-fetch code path, crash) the rest of the batch —
 * Promise.allSettled semantics via individual awaited calls, each covered
 * by its own retry policy.
 */
import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/ted.activities.js';
import type { TedNotice } from '../../construction-leads/types.js';

const { ingestTedNoticeActivity } = proxyActivities<typeof activities>({
  startToCloseTimeout: '30 seconds',
  retry: { initialInterval: '5 seconds', maximumAttempts: 4 },
});

export interface TedBatchIngestWorkflowInput {
  notices: TedNotice[];
}

export interface TedBatchIngestWorkflowResult {
  totalNotices: number;
  totalStored: number;
  failedNoticeIds: string[];
}

export async function tedBatchIngestWorkflow(
  input: TedBatchIngestWorkflowInput,
): Promise<TedBatchIngestWorkflowResult> {
  let totalStored = 0;
  const failedNoticeIds: string[] = [];

  for (const notice of input.notices) {
    try {
      const result = await ingestTedNoticeActivity(notice);
      totalStored += result.stored;
    } catch {
      failedNoticeIds.push(notice.ND);
    }
  }

  return { totalNotices: input.notices.length, totalStored, failedNoticeIds };
}

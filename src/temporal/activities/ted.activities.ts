/**
 * Temporal Activity — TED Notice Ingestion (Use case #2)
 *
 * One Activity per TED notice, keyed by Workflow ID = notice ID (see
 * ted-batch-ingest.workflow.ts) so Temporal dedupes a re-delivered notice
 * instead of the batch silently re-inserting it — storeLeads()'s own
 * (company_name, tender_id) upsert is a second, defense-in-depth layer.
 */
import { ApplicationFailure } from '@temporalio/activity';
import {
  noticeToLead,
  storeLeads,
  tedEnrichLead,
} from '../../construction-leads/lead-processor.js';
import type { TedNotice } from '../../construction-leads/types.js';
import logger from '../../utils/logger.js';

export interface IngestTedNoticeResult {
  stored: number;
}

export async function ingestTedNoticeActivity(notice: TedNotice): Promise<IngestTedNoticeResult> {
  let lead;
  try {
    lead = tedEnrichLead(notice, noticeToLead(notice));
  } catch (err) {
    throw ApplicationFailure.create({
      message: `Failed to transform TED notice into a lead: ${(err as Error).message}`,
      type: 'NoticeTransformError',
      nonRetryable: true,
    });
  }

  const stored = await storeLeads([lead]);
  logger.info('TED notice ingested via Temporal activity', { noticeId: notice.ND, stored });
  return { stored };
}

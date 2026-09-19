/**
 * CODE VERSIONING NOTE
 * Code-Version: 1.0.0
 * Introduced-In: PR-2038
 * Branch: cursor/sales-outreach-ted-grok-pack-a455
 * Date: 2026-09-18
 * Owner: DWS Platform / Cursor Agent
 * Env-Schema: env-v1.0
 * Mission Control Sales queue items from TED.
 *
 * Live path talks to the public TED API (no Google, no Grok, no ADMIN_API_KEY).
 * Stored path uses the service role. Dashboard requireHicAuth is unchanged.
 *
 * Evidence: Tool=Cursor Grok 4.6 Model=cursor-grok-4.6 Agent=Cursor Agent Date=2026-09-18
 * Audit trail: git log -- src/construction-leads/sales-queue.ts
 */

import { cpvToIndustry } from '../agents/data/industry-cpv.js';
import { listNewLeadsForSalesQueue, noticeToLead } from './lead-processor.js';
import { DEFAULT_QUERY_CONFIG, searchConstructionTenders } from './ted-api.js';
import type { StoredSalesLeadRow, TedNotice } from './types.js';

export const SALES_CENTRE_NOUX = 'Trial Centre | Customer Support';
export const SALES_CENTRE_REPO = 'sales-rooms/03-trial-centre/';

export type SalesOutreachTedItem = {
  id: string;
  centre: 'sales';
  title: string;
  status: 'ted_lead';
  nextAction: string;
  nouxRoom: string;
  repoPath: string;
  noDemoEnv: true;
  priority: 2;
  source: 'ted';
  tedUrl: string | null;
  cpv: string | null;
  country: string | null;
};

export type SalesQueueSource = 'live' | 'stored';

export function toSalesOutreachTedItem(input: {
  id: string;
  title: string;
  buyerName: string | null;
  industryName?: string | null;
  tedUrl: string | null;
  cpv: string | null;
  country: string | null;
}): SalesOutreachTedItem {
  const buyer = input.buyerName || 'TED buyer';
  return {
    id: `ted:${input.id}`,
    centre: 'sales',
    title: input.industryName ? `${buyer} · ${input.industryName}` : buyer,
    status: 'ted_lead',
    nextAction: input.title || input.id,
    nouxRoom: SALES_CENTRE_NOUX,
    repoPath: SALES_CENTRE_REPO,
    noDemoEnv: true,
    priority: 2,
    source: 'ted',
    tedUrl: input.tedUrl,
    cpv: input.cpv,
    country: input.country,
  };
}

export function noticeToSalesOutreachItem(notice: TedNotice): SalesOutreachTedItem {
  const lead = noticeToLead(notice);
  const industry = cpvToIndustry(notice.CPV);
  return toSalesOutreachTedItem({
    id: lead.ted_notice_id,
    title: lead.title,
    buyerName: lead.buyer_name,
    industryName: industry?.name ?? null,
    tedUrl: lead.ted_url,
    cpv: lead.cpv_code,
    country: lead.country_code,
  });
}

export function storedRowToSalesOutreachItem(row: StoredSalesLeadRow): SalesOutreachTedItem {
  const raw = row.raw_data;
  const industryName =
    (raw && typeof raw.industryName === 'string' && raw.industryName) ||
    (raw && typeof raw.industry_name === 'string' && raw.industry_name) ||
    null;
  return toSalesOutreachTedItem({
    id: row.id,
    title: row.title || row.id,
    buyerName: row.buyer_name,
    industryName,
    tedUrl: row.ted_url,
    cpv: row.cpv_code,
    country: row.country_code,
  });
}

export async function listLiveTedSalesQueue(limit = 25): Promise<SalesOutreachTedItem[]> {
  const capped = Math.min(Math.max(Math.trunc(limit), 1), 50);
  const notices = await searchConstructionTenders({
    ...DEFAULT_QUERY_CONFIG,
    maxResults: capped,
  });
  return notices.map(noticeToSalesOutreachItem);
}

export async function listStoredTedSalesQueue(limit = 25): Promise<SalesOutreachTedItem[]> {
  const rows = await listNewLeadsForSalesQueue(limit);
  return rows.map(storedRowToSalesOutreachItem);
}

export async function listTedSalesQueue(
  source: SalesQueueSource,
  limit = 25,
): Promise<SalesOutreachTedItem[]> {
  switch (source) {
    case 'live':
      return listLiveTedSalesQueue(limit);
    case 'stored':
      return listStoredTedSalesQueue(limit);
    default: {
      const _exhaustive: never = source;
      return _exhaustive;
    }
  }
}

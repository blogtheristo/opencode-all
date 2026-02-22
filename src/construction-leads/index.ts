/**
 * Construction Leads Module
 *
 * Automated EU construction tender lead generation from TED (Tenders Electronic Daily).
 *
 * Pipeline: TED API → lead processing → Supabase → morning briefing
 *
 * Sources:
 *   - TED Search API (https://api.ted.europa.eu) — free, anonymous
 *   - CPV 45000000 (Construction Work) + sub-codes
 *   - Nordic + DACH countries priority
 *
 * Schedule: Mon-Fri 05:30 Helsinki (30min before CEO Cockpit)
 */

export { constructionLeadsScheduler } from './scheduler.js';
export {
  fetchAndProcessLeads,
  getLeadsSummary,
  getNewLeads,
  getUpcomingDeadlines,
  storeLeads,
  createBuyerOrgs,
  calculateRelevance,
  noticeToLead,
} from './lead-processor.js';
export {
  searchConstructionTenders,
  buildExpertQuery,
  buildNoticeUrl,
  DEFAULT_QUERY_CONFIG,
} from './ted-api.js';
export type {
  TedNotice,
  TedSearchResponse,
  TedQueryConfig,
  ConstructionLead,
  ConstructionLeadRow,
  ConstructionLeadsSummary,
  ConstructionLeadDeadline,
  ConstructionLeadNew,
  ConstructionLeadStatus,
} from './types.js';

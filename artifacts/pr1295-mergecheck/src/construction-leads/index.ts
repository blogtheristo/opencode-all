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
  tedEnrichLead,
  normalizeCompanyNameForDedup,
} from './lead-processor.js';
export { resolveErpForBuyer } from './company-erp-resolver.js';
export type { ResolvedErp } from './company-erp-resolver.js';
export { matchComplianceKeywords, passesComplianceFilter } from './compliance-keywords.js';
export {
  runTedOutreachInitialBatch,
  runTedOutreachFollowUps,
  runWeeklyTedLearning,
  inferOutreachLang,
} from './ted-outreach.js';
export {
  searchConstructionTenders,
  buildExpertQuery,
  buildNoticeUrl,
  DEFAULT_QUERY_CONFIG,
} from './ted-api.js';
export {
  LEAD_SOURCES,
  getActiveSources,
  getPlannedSources,
  getSourcesSummary,
  getSourceCounts,
} from './lead-sources.js';
export type {
  LeadSource,
  LeadSourceStatus,
  LeadSourceAccess,
  LeadSourceCoverage,
} from './lead-sources.js';
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

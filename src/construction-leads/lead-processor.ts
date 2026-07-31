/**
 * Construction Lead Processor
 *
 * Processes raw TED notices into construction leads, calculates relevance scores,
 * stores in Supabase, and optionally creates outreach_orgs for high-value buyers.
 */

import logger from '../utils/logger.js';
import {
  buildNoticeUrl,
  DEFAULT_QUERY_CONFIG,
  parseContractType,
  parseNoticeType,
  parseValue,
  searchConstructionTenders,
} from './ted-api.js';
import type {
  ConstructionLead,
  ConstructionLeadDeadline,
  ConstructionLeadNew,
  ConstructionLeadRow,
  ConstructionLeadsSummary,
  TedNotice,
  TedQueryConfig,
} from './types.js';
import { matchComplianceKeywords, passesComplianceFilter } from './compliance-keywords.js';
import { resolveErpForBuyer } from './company-erp-resolver.js';

// ============================================================================
// SUPABASE HELPER (same pattern as outreach/daily-digest.ts)
// ============================================================================

async function supabaseFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY required');
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=representation',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}

/** Best-effort Supabase fetch (returns null on failure instead of throwing) */
async function supabaseFetchSafe<T>(path: string): Promise<T | null> {
  try {
    return await supabaseFetch<T>(path);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn('Construction leads: Supabase fetch failed (non-critical)', { path, error: msg });
    return null;
  }
}

// ============================================================================
// RELEVANCE SCORING
// ============================================================================

/** Priority countries for DWS (higher score) */
const PRIORITY_COUNTRIES: Record<string, number> = {
  FI: 30,   // Finland — home market
  SE: 25,   // Sweden — NCC, Skanska
  NO: 20,   // Norway — Nordic
  DK: 20,   // Denmark — Nordic
  DE: 15,   // Germany — HOCHTIEF, STRABAG
  AT: 15,   // Austria — PORR
  EE: 10,   // Estonia — regional
  LV: 10,
  LT: 10,
};

/** Target construction CPV sub-codes (higher relevance) */
const PRIORITY_CPV_PREFIXES = [
  '45210',   // Building construction work
  '45211',   // Multi-dwelling and individual housing
  '45213',   // Commercial/industrial buildings
  '45220',   // Engineering + construction
  '45230',   // Roads, railways, airfields, sport facilities
  '45240',   // Hydraulic engineering
  '45250',   // Factory/mining/oil construction
  '45310',   // Electrical wiring and fittings
  '45320',   // Insulation work
  '45330',   // Plumbing work
  '45400',   // Building completion work
];

/**
 * Calculate relevance score (0-100) for a construction lead.
 *
 * Factors:
 * - Country match (0-30): Priority countries get higher scores
 * - Value tier (0-25): Larger projects = more relevant
 * - CPV specificity (0-20): Matching sub-codes boost relevance
 * - Deadline proximity (0-15): Closer deadlines = more actionable
 * - Buyer type (0-10): Named buyers with URLs get bonus
 */
export function calculateRelevance(notice: TedNotice): number {
  let score = 0;

  // Country (0-30)
  const country = notice.CY?.toUpperCase() || '';
  score += PRIORITY_COUNTRIES[country] || 5;

  // Value tier (0-25)
  const value = parseValue(notice.TV);
  if (value !== null) {
    if (value >= 10_000_000) score += 25;
    else if (value >= 5_000_000) score += 20;
    else if (value >= 1_000_000) score += 15;
    else if (value >= 500_000) score += 10;
    else score += 5;
  }

  // CPV specificity (0-20)
  const cpv = notice.CPV || '';
  const matchedPrefix = PRIORITY_CPV_PREFIXES.some((p) => cpv.startsWith(p));
  if (matchedPrefix) score += 20;
  else if (cpv.startsWith('45')) score += 10;

  // Deadline proximity (0-15)
  if (notice.DT) {
    const deadline = new Date(notice.DT);
    const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / 86_400_000);
    if (daysUntil >= 0 && daysUntil <= 14) score += 15;
    else if (daysUntil > 14 && daysUntil <= 30) score += 10;
    else if (daysUntil > 30) score += 5;
  }

  // Buyer quality (0-10)
  if (notice.AA) score += 5;
  if (notice.TW) score += 5;

  return Math.min(100, score);
}

// ============================================================================
// NOTICE → LEAD CONVERSION
// ============================================================================

/** Normalized buyer name for DB unique (company_name, tender_id) — must match migration 047 trigger. */
export function normalizeCompanyNameForDedup(name: string | null | undefined): string {
  return (name || '').trim();
}

/**
 * Convert a raw TED notice to a ConstructionLead.
 */
export function noticeToLead(notice: TedNotice): ConstructionLead {
  const noticeId = notice.ND || notice.documentNumber || `unknown-${Date.now()}`;
  const title = notice.TI || notice.titleOriginalLanguage || `Construction tender ${noticeId}`;
  const company_name = normalizeCompanyNameForDedup(notice.AA);

  return {
    ted_notice_id: noticeId,
    company_name,
    tender_id: noticeId,
    document_number: notice.documentNumber || null,
    title,
    description: null,
    cpv_code: notice.CPV || null,
    cpv_description: notice.cpvDescription || null,
    country_code: notice.CY || null,
    country_name: notice.countryName || null,
    nuts_code: notice.NUTS || null,
    place_of_performance: notice.TW || null,
    buyer_name: notice.AA || null,
    buyer_url: null,
    contract_type: parseContractType(notice.NC),
    procedure_type: notice.PR || null,
    notice_type: parseNoticeType(notice.TD),
    estimated_value: parseValue(notice.TV),
    currency: notice.TVL || 'EUR',
    publication_date: notice.PD || null,
    deadline_date: notice.DT || null,
    ted_url: notice.TED_NOTICE_URL || buildNoticeUrl(noticeId),
    status: 'new',
    relevance_score: calculateRelevance(notice),
    raw_data: notice as Record<string, unknown>,
    source: 'ted_api',
    created_by: 'construction_lead_fetcher',
  };
}

/**
 * Attach ERP hint + compliance keyword hits for TED pipeline / ted_leads view.
 */
export function tedEnrichLead(notice: TedNotice, lead: ConstructionLead): ConstructionLead {
  const resolved_erp = resolveErpForBuyer(lead.buyer_name, lead.country_code);
  const compliance_keywords = matchComplianceKeywords(notice);
  return {
    ...lead,
    resolved_erp,
    compliance_keywords: compliance_keywords.length ? compliance_keywords : null,
  };
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Store leads in Supabase. Dedup is DB-enforced on (company_name, tender_id) — see migration 047.
 *
 * @returns Row count returned by PostgREST for each batch (`return=representation` with
 * `merge-duplicates`). That is one row per input row in the batch — **inserts plus updates**,
 * not net-new inserts only.
 */
export async function storeLeads(leads: ConstructionLead[]): Promise<number> {
  if (leads.length === 0) return 0;

  let upsertedRows = 0;

  // Process in batches of 20 to avoid large payloads
  const batchSize = 20;
  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);

    try {
      const result = await supabaseFetch<ConstructionLeadRow[]>(
        'construction_leads?on_conflict=company_name,tender_id',
        {
          method: 'POST',
          headers: {
            Prefer: 'resolution=merge-duplicates,return=representation',
          },
          body: JSON.stringify(batch),
        },
      );

      upsertedRows += result.length;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error('Construction leads: batch insert failed', {
        batchStart: i,
        batchSize: batch.length,
        error: msg,
      });
    }
  }

  logger.info('Construction leads: stored in database', {
    attempted: leads.length,
    upsertedRows,
  });

  return upsertedRows;
}

/**
 * Create outreach_orgs entries for high-value buyers (relevance >= 60).
 * Only creates orgs that don't already exist (by buyer name match).
 */
export async function createBuyerOrgs(leads: ConstructionLead[]): Promise<number> {
  const highValue = leads.filter((l) => l.relevance_score >= 60 && l.buyer_name);
  if (highValue.length === 0) return 0;

  // Deduplicate by buyer name
  const uniqueBuyers = new Map<string, ConstructionLead>();
  for (const lead of highValue) {
    const key = lead.buyer_name!.toLowerCase().trim();
    if (!uniqueBuyers.has(key)) {
      uniqueBuyers.set(key, lead);
    }
  }

  let created = 0;

  for (const [, lead] of uniqueBuyers) {
    const buyerName = lead.buyer_name!;
    // Generate a domain-like key from buyer name
    const domain = buyerName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 60) + '.gov';

    try {
      // Check if org already exists
      const existing = await supabaseFetch<Array<{ id: string }>>(
        `outreach_orgs?name=ilike.${encodeURIComponent(buyerName)}&select=id&limit=1`,
      );

      if (existing.length > 0) continue;

      await supabaseFetch('outreach_orgs', {
        method: 'POST',
        body: JSON.stringify({
          domain,
          name: buyerName,
          description: `Public contracting authority. Source: TED (${lead.ted_notice_id}). ${lead.country_name || lead.country_code || 'EU'}.`,
          location: [lead.place_of_performance, lead.country_name].filter(Boolean).join(', ') || null,
          industry: 'Construction / Public Sector',
          website: lead.buyer_url || null,
          prospect_status: 'target_needs_contact',
          source: 'cold',
          created_by: 'construction_lead_fetcher',
        }),
      });

      created++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.warn('Construction leads: failed to create buyer org', {
        buyer: buyerName,
        error: msg,
      });
    }
  }

  logger.info('Construction leads: buyer orgs created', {
    highValueLeads: highValue.length,
    uniqueBuyers: uniqueBuyers.size,
    orgsCreated: created,
  });

  return created;
}

// ============================================================================
// BRIEFING DATA COLLECTORS
// ============================================================================

/**
 * Get construction leads summary for morning briefing.
 */
export async function getLeadsSummary(): Promise<ConstructionLeadsSummary | null> {
  return supabaseFetchSafe<ConstructionLeadsSummary[]>(
    'v_construction_leads_summary',
  ).then((rows) => rows?.[0] || null);
}

/**
 * Get new construction leads (published in last 7 days, status=new).
 * Returns top 10 by relevance score.
 */
export async function getNewLeads(): Promise<ConstructionLeadNew[]> {
  const result = await supabaseFetchSafe<ConstructionLeadNew[]>(
    'v_construction_leads_new?limit=10&select=id,title,buyer_name,country_code,cpv_code,estimated_value,currency,publication_date,deadline_date,ted_url,relevance_score',
  );
  return result || [];
}

/**
 * Get upcoming deadlines (next 14 days).
 * Returns top 10 by deadline date.
 */
export async function getUpcomingDeadlines(): Promise<ConstructionLeadDeadline[]> {
  const result = await supabaseFetchSafe<ConstructionLeadDeadline[]>(
    'v_construction_leads_deadlines?limit=10&select=id,title,buyer_name,country_code,estimated_value,currency,deadline_date,ted_url,status,relevance_score',
  );
  return result || [];
}

// ============================================================================
// MAIN PIPELINE
// ============================================================================

/**
 * Run the full construction leads pipeline:
 * 1. Fetch tenders from TED API
 * 2. Convert to leads with relevance scores
 * 3. Store in Supabase
 * 4. Create outreach_orgs for high-value buyers
 *
 * Returns summary of what was processed.
 */
export async function fetchAndProcessLeads(
  config: TedQueryConfig = DEFAULT_QUERY_CONFIG,
): Promise<{
  fetched: number;
  /** Rows returned from upsert (`merge-duplicates`); includes updates, not inserts only. */
  upsertedRows: number;
  orgsCreated: number;
  topCountries: Record<string, number>;
}> {
  logger.info('Construction leads pipeline: starting', { config });

  // 1. Fetch from TED
  const notices = await searchConstructionTenders(config);

  // 2. Compliance filter (CPV in TED query; keywords narrow to climate/compliance language)
  const filtered = notices.filter((n) => passesComplianceFilter(n));
  if (filtered.length < notices.length) {
    logger.info('Construction leads: compliance filter dropped notices', {
      before: notices.length,
      after: filtered.length,
      mode: process.env.TED_COMPLIANCE_FILTER || 'strict',
    });
  }

  // 3. Convert to leads + ERP / keyword enrichment
  const leads = filtered.map((notice) => tedEnrichLead(notice, noticeToLead(notice)));

  // Sort by relevance score descending
  leads.sort((a, b) => b.relevance_score - a.relevance_score);

  // 4. Store in database
  const upsertedRows = await storeLeads(leads);

  // 5. Create buyer orgs for high-value leads
  const orgsCreated = await createBuyerOrgs(leads);

  // Summary stats
  const topCountries: Record<string, number> = {};
  for (const lead of leads) {
    const cc = lead.country_code || 'Unknown';
    topCountries[cc] = (topCountries[cc] || 0) + 1;
  }

  const summary = {
    fetched: notices.length,
    upsertedRows,
    orgsCreated,
    topCountries,
  };

  logger.info('Construction leads pipeline: complete', summary);

  return summary;
}

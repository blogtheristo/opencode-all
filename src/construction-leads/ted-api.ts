/**
 * TED API Client — Tenders Electronic Daily
 *
 * Fetches EU public procurement notices from the TED Search API.
 * Free, anonymous access — no API key required.
 *
 * API docs: https://docs.ted.europa.eu/api/latest/search.html
 * Swagger:  https://api.ted.europa.eu/swagger
 *
 * CPV 45000000 = "Construction Work" (all sub-codes).
 * Expert search syntax: https://ted.europa.eu/en/expert-search
 */

import logger from '../utils/logger.js';
import type { TedNotice, TedQueryConfig, TedSearchResponse } from './types.js';

// ============================================================================
// DEFAULTS
// ============================================================================

/** Default query config: Nordic + DACH construction tenders, last 7 days */
export const DEFAULT_QUERY_CONFIG: TedQueryConfig = {
  cpvCodes: ['45000000'],     // Construction Work (parent code covers all sub-codes)
  countryCodes: [
    'FI',   // Finland (home market)
    'SE',   // Sweden (NCC, Skanska HQ)
    'NO',   // Norway (Nordic)
    'DK',   // Denmark (Nordic)
    'DE',   // Germany (HOCHTIEF, STRABAG)
    'AT',   // Austria (PORR, STRABAG)
    'EE',   // Estonia (Nordic region)
    'LV',   // Latvia
    'LT',   // Lithuania
  ],
  lookbackDays: 7,
  maxResults: 100,
};

/** TED API base URLs */
const TED_API_BASE = 'https://ted.europa.eu/api/v3.0/notices/search';
const TED_NOTICE_URL_BASE = 'https://ted.europa.eu/en/notice/-/detail';

// ============================================================================
// QUERY BUILDER
// ============================================================================

/**
 * Build TED expert search query string.
 *
 * Expert search syntax:
 *   CPV=45000000          — CPV code filter
 *   CY=(FI OR SE OR DE)   — Country filter
 *   PD=[20260215 TO *]    — Publication date range
 *   TD=3                  — Notice type: contract notices
 *   NC=1                  — Contract type: works
 */
export function buildExpertQuery(config: TedQueryConfig): string {
  const parts: string[] = [];

  // CPV filter — construction codes
  if (config.cpvCodes.length > 0) {
    const cpvPart = config.cpvCodes.map((c) => `CPV=${c}`).join(' OR ');
    parts.push(`(${cpvPart})`);
  }

  // Country filter
  if (config.countryCodes.length > 0) {
    const countries = config.countryCodes.join(' OR ');
    parts.push(`CY=(${countries})`);
  }

  // Date range: lookback from today
  const fromDate = new Date(Date.now() - config.lookbackDays * 86_400_000);
  const fromStr = fromDate.toISOString().split('T')[0].replace(/-/g, '');
  parts.push(`PD=[${fromStr} TO *]`);

  // Contract type: works (NC=1) — construction-specific
  parts.push('NC=1');

  return parts.join(' AND ');
}

// ============================================================================
// API CLIENT
// ============================================================================

/**
 * Search TED for construction tenders.
 *
 * Uses the v3.0 search endpoint which supports both eForms and TED schema notices.
 * Anonymous access — no authentication required.
 */
export async function searchConstructionTenders(
  config: TedQueryConfig = DEFAULT_QUERY_CONFIG,
): Promise<TedNotice[]> {
  const query = buildExpertQuery(config);

  logger.info('TED API: searching construction tenders', {
    query,
    maxResults: config.maxResults,
  });

  const allNotices: TedNotice[] = [];
  let page = 1;
  const pageSize = Math.min(config.maxResults, 50);

  try {
    while (allNotices.length < config.maxResults) {
      const params = new URLSearchParams({
        q: query,
        page: String(page),
        limit: String(pageSize),
        scope: '3',           // All notices (last 10 years)
        fields: 'ND,PD,TI,CY,TW,AA,CPV,NC,PR,TD,DT,TV,TVL,NUTS',
      });

      const url = `${TED_API_BASE}?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'DWS-IQ6-ConstructionLeads/1.0',
        },
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('TED API error', {
          status: response.status,
          error: errorText.slice(0, 500),
          query,
          page,
        });

        // If first page fails, throw. If subsequent pages fail, return what we have.
        if (page === 1) {
          throw new Error(`TED API returned ${response.status}: ${errorText.slice(0, 200)}`);
        }
        break;
      }

      const data = await response.json() as TedSearchResponse;

      if (!data.results || data.results.length === 0) {
        break;
      }

      allNotices.push(...data.results);

      logger.info('TED API: page fetched', {
        page,
        resultsOnPage: data.results.length,
        totalAccumulated: allNotices.length,
        totalAvailable: data.total,
      });

      // No more pages
      if (allNotices.length >= (data.total || 0) || data.results.length < pageSize) {
        break;
      }

      page++;

      // Rate limiting: 500ms between requests to be respectful
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('TED API search failed', { error: msg, query });

    // Return whatever we collected so far
    if (allNotices.length === 0) {
      throw err;
    }
  }

  logger.info('TED API: search complete', {
    totalResults: allNotices.length,
    countries: [...new Set(allNotices.map((n) => n.CY).filter(Boolean))],
  });

  return allNotices.slice(0, config.maxResults);
}

/**
 * Build the TED notice URL from a notice ID.
 */
export function buildNoticeUrl(noticeId: string): string {
  // TED notice URLs use the document number
  const encoded = encodeURIComponent(noticeId);
  return `${TED_NOTICE_URL_BASE}/${encoded}`;
}

/**
 * Parse contract type code to human-readable string.
 */
export function parseContractType(code: string | undefined): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    '1': 'works',
    '2': 'supplies',
    '4': 'services',
    W: 'works',
    S: 'supplies',
    V: 'services',
  };
  return map[code] || code;
}

/**
 * Parse notice type code to human-readable string.
 */
export function parseNoticeType(code: string | undefined): string | null {
  if (!code) return null;
  const map: Record<string, string> = {
    '0': 'prior information',
    '1': 'contract notice',
    '2': 'contract award',
    '3': 'contract notice',
    '7': 'qualification system',
    D: 'design contest',
  };
  return map[code] || code;
}

/**
 * Parse estimated value from TED format.
 */
export function parseValue(value: string | undefined): number | null {
  if (!value) return null;
  const cleaned = value.replace(/[^0-9.,]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/**
 * TED API Client — Tenders Electronic Daily
 *
 * Fetches EU public procurement notices from the TED Search API.
 * Free, anonymous access — no API key required.
 *
 * API docs: https://docs.ted.europa.eu/api/latest/search.html
 * Swagger:  https://api.ted.europa.eu/swagger
 *
 * Default CPV = parent codes for all 25 DWS industries (not construction-only).
 * Expert search syntax: https://ted.europa.eu/en/expert-search
 */

import { TED_SEARCH_CPV_CODES } from '../agents/data/industry-cpv.js';
import logger from '../utils/logger.js';
import type { TedNotice, TedQueryConfig } from './types.js';

// ============================================================================
// DEFAULTS
// ============================================================================

/** Default query: Nordic + DACH tenders across all 25 DWS industries, last 7 days */
export const DEFAULT_QUERY_CONFIG: TedQueryConfig = {
  cpvCodes: [...TED_SEARCH_CPV_CODES],
  countryCodes: [
    'FI', // Finland (home market)
    'SE', // Sweden (NCC, Skanska HQ)
    'NO', // Norway (Nordic)
    'DK', // Denmark (Nordic)
    'DE', // Germany (HOCHTIEF, STRABAG)
    'AT', // Austria (PORR, STRABAG)
    'EE', // Estonia (Nordic region)
    'LV', // Latvia
    'LT', // Lithuania
  ],
  lookbackDays: 7,
  maxResults: 100,
  worksOnly: false,
};

/** TED Search API v3 — POST, anonymous. GET ted.europa.eu/api/v3.0 is gone (404). */
const TED_API_BASE = 'https://api.ted.europa.eu/v3/notices/search';
const TED_NOTICE_URL_BASE = 'https://ted.europa.eu/en/notice/-/detail';

const TED_V3_FIELDS = [
  'publication-number',
  'notice-title',
  'buyer-name',
  'buyer-country',
  'notice-type',
  'classification-cpv',
  'estimated-value-proc',
  'place-of-performance',
  'publication-date',
  'deadline',
] as const;

/** ISO 3166-1 alpha-2 → TED buyer-country (alpha-3). */
const ISO2_TO_ISO3: Record<string, string> = {
  FI: 'FIN',
  SE: 'SWE',
  NO: 'NOR',
  DK: 'DNK',
  DE: 'DEU',
  AT: 'AUT',
  EE: 'EST',
  LV: 'LVA',
  LT: 'LTU',
  FR: 'FRA',
  NL: 'NLD',
  BE: 'BEL',
  PL: 'POL',
  CZ: 'CZE',
  IT: 'ITA',
  ES: 'ESP',
  PT: 'PRT',
  IE: 'IRL',
  UK: 'GBR',
  GB: 'GBR',
  CH: 'CHE',
};

const ISO3_TO_ISO2: Record<string, string> = Object.fromEntries(
  Object.entries(ISO2_TO_ISO3).map(([iso2, iso3]) => [iso3, iso2]),
);

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
 *   NC=1                  — Contract type: works (optional; off by default)
 */
export function buildExpertQuery(config: TedQueryConfig): string {
  const parts: string[] = [];

  if (config.cpvCodes.length > 0) {
    const cpvPart = config.cpvCodes.map((c) => `CPV=${c}`).join(' OR ');
    parts.push(`(${cpvPart})`);
  }

  if (config.countryCodes.length > 0) {
    const countries = config.countryCodes.join(' OR ');
    parts.push(`CY=(${countries})`);
  }

  const fromDate = new Date(Date.now() - config.lookbackDays * 86_400_000);
  const fromStr = fromDate.toISOString().split('T')[0].replace(/-/g, '');
  parts.push(`PD=[${fromStr} TO *]`);

  if (config.worksOnly) {
    parts.push('NC=1');
  }

  return parts.join(' AND ');
}

export function toTedIso3Country(code: string): string {
  const upper = code.trim().toUpperCase();
  if (upper.length === 3) return upper;
  return ISO2_TO_ISO3[upper] || upper;
}

export function fromTedIso3Country(code: string | undefined): string | undefined {
  if (!code) return undefined;
  const upper = code.trim().toUpperCase();
  return ISO3_TO_ISO2[upper] || (upper.length === 2 ? upper : undefined) || upper.slice(0, 2);
}

/**
 * TED Search API v3 expert query (POST body `query`).
 * `classification-cpv IN (…)` + `buyer-country IN (ISO3…)` + `publication-date>=YYYYMMDD`.
 */
export function buildV3SearchQuery(config: TedQueryConfig): string {
  const parts: string[] = [];

  if (config.cpvCodes.length > 0) {
    parts.push(`classification-cpv IN (${config.cpvCodes.join(', ')})`);
  }

  if (config.countryCodes.length > 0) {
    const iso3 = config.countryCodes.map(toTedIso3Country);
    parts.push(`buyer-country IN (${iso3.join(', ')})`);
  }

  const fromDate = new Date(Date.now() - config.lookbackDays * 86_400_000);
  const fromStr = fromDate.toISOString().split('T')[0].replace(/-/g, '');
  parts.push(`publication-date>=${fromStr}`);

  return parts.join(' AND ');
}

function pickText(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number' && Number.isFinite(value)) return String(value);
  if (Array.isArray(value)) {
    for (const item of value) {
      const hit = pickText(item);
      if (hit) return hit;
    }
    return undefined;
  }
  if (value && typeof value === 'object') {
    const rec = value as Record<string, unknown>;
    for (const lang of ['eng', 'en', 'fin', 'swe', 'deu', 'nld', 'fra']) {
      const hit = pickText(rec[lang]);
      if (hit) return hit;
    }
    for (const nested of Object.values(rec)) {
      const hit = pickText(nested);
      if (hit) return hit;
    }
  }
  return undefined;
}

export function v3NoticeToTedNotice(raw: Record<string, unknown>): TedNotice {
  const publicationNumber = pickText(raw['publication-number']) || '';
  const countryIso3 = pickText(raw['buyer-country']);
  const cpv = pickText(raw['classification-cpv']);
  const title = pickText(raw['notice-title']);
  const buyer = pickText(raw['buyer-name']);
  return {
    ND: publicationNumber,
    documentNumber: publicationNumber || undefined,
    PD: pickText(raw['publication-date']) || '',
    TI: title,
    CY: fromTedIso3Country(countryIso3),
    countryName: countryIso3,
    TW: pickText(raw['place-of-performance']),
    AA: buyer,
    CPV: cpv,
    TD: pickText(raw['notice-type']),
    DT: pickText(raw['deadline']),
    TV: pickText(raw['estimated-value-proc']),
    TED_NOTICE_URL: publicationNumber ? buildNoticeUrl(publicationNumber) : undefined,
  };
}

// ============================================================================
// API CLIENT
// ============================================================================

interface TedV3SearchResponse {
  notices?: Record<string, unknown>[];
  results?: Record<string, unknown>[];
  totalNoticeCount?: number;
  total?: number;
}

/**
 * Search TED via POST https://api.ted.europa.eu/v3/notices/search.
 * Anonymous — no Google, Grok, or TED API key.
 */
export async function searchConstructionTenders(
  config: TedQueryConfig = DEFAULT_QUERY_CONFIG,
): Promise<TedNotice[]> {
  const query = buildV3SearchQuery(config);

  logger.info('TED API: searching construction tenders', {
    query,
    maxResults: config.maxResults,
  });

  const allNotices: TedNotice[] = [];
  let page = 1;
  const pageSize = Math.min(config.maxResults, 50);

  try {
    while (allNotices.length < config.maxResults) {
      const response = await fetch(TED_API_BASE, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'DWS-IQ6-TedLeads/1.1',
        },
        body: JSON.stringify({
          query,
          fields: [...TED_V3_FIELDS],
          limit: pageSize,
          scope: 'ALL',
          page,
        }),
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

        if (page === 1) {
          throw new Error(`TED API returned ${response.status}: ${errorText.slice(0, 200)}`);
        }
        break;
      }

      const data = (await response.json()) as TedV3SearchResponse;
      const rows = data.notices ?? data.results ?? [];

      if (rows.length === 0) {
        break;
      }

      const mapped = rows.map(v3NoticeToTedNotice);
      allNotices.push(...mapped);

      const totalAvailable = data.totalNoticeCount ?? data.total ?? 0;
      logger.info('TED API: page fetched', {
        page,
        resultsOnPage: rows.length,
        totalAccumulated: allNotices.length,
        totalAvailable,
      });

      if (allNotices.length >= totalAvailable || rows.length < pageSize) {
        break;
      }

      page++;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('TED API search failed', { error: msg, query });

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

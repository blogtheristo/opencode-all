/**
 * Supermetrics → SEO Sales Agent Pipeline — Row Normalization
 *
 * The Supermetrics MCP tool (`data_query`) returns rows keyed by field IDs that
 * are only known at query time (via `field_discovery`) — they must never be
 * hardcoded here (see the MCP server's own "never invent field IDs" rule).
 *
 * Instead, the calling agent/skill maps discovered field IDs onto the
 * human-readable keys below, and these functions do the deterministic part:
 * type coercion, unit normalization (e.g. CTR as fraction vs percent),
 * de-duplication, and reshaping into the exact contracts that
 * `keyword-intent` and `lead-feedback` already expect
 * (see `src/agents/seo/types.ts`, docs/SEO_SALES_AGENT_SPECIFICATION.md §2.1/§2.5).
 */

import type { IcpProfile, SearchConsoleQuery } from '../../agents/seo/types.js';

type Scalar = string | number | null | undefined;

export interface RawSearchConsoleRow {
  query: Scalar;
  clicks: Scalar;
  impressions: Scalar;
  ctr?: Scalar;
  position: Scalar;
  [key: string]: unknown;
}

export interface RawContentPerformanceRow {
  url: Scalar;
  organicSessions: Scalar;
  conversions: Scalar;
  conversionRate?: Scalar;
  avgTimeOnPage?: Scalar;
  bounceRate?: Scalar;
  [key: string]: unknown;
}

export type ContentPerformanceRow = {
  url: string;
  organicSessions: number;
  conversions: number;
  conversionRate: number;
  avgTimeOnPage: number;
  bounceRate: number;
};

function toNumber(value: Scalar): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[,%]/g, ''));
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

/** Supermetrics/GSC sometimes reports CTR as a 0-100 percentage, sometimes as a 0-1 fraction. */
function normalizeCtr(value: Scalar): number {
  const n = toNumber(value);
  return n > 1 ? n / 100 : n;
}

/**
 * Reshape Supermetrics Search Console rows into the `SearchConsoleQuery[]`
 * contract consumed by the `keyword-intent` agent. Rows missing a query
 * string are dropped; duplicate queries (e.g. across device segments) are
 * merged by summing clicks/impressions and averaging position, weighted by
 * impressions.
 */
export function toSearchConsoleQueries(rows: RawSearchConsoleRow[]): SearchConsoleQuery[] {
  const merged = new Map<
    string,
    { clicks: number; impressions: number; positionWeighted: number }
  >();

  for (const row of rows) {
    const query = typeof row.query === 'string' ? row.query.trim() : '';
    if (!query) continue;

    const clicks = toNumber(row.clicks);
    const impressions = toNumber(row.impressions);
    const position = toNumber(row.position);

    const existing = merged.get(query);
    if (existing) {
      existing.clicks += clicks;
      existing.impressions += impressions;
      existing.positionWeighted += position * Math.max(impressions, 1);
    } else {
      merged.set(query, {
        clicks,
        impressions,
        positionWeighted: position * Math.max(impressions, 1),
      });
    }
  }

  return Array.from(merged.entries())
    .map(([query, data]) => {
      const impressions = data.impressions;
      const clicks = data.clicks;
      const position = impressions > 0 ? data.positionWeighted / impressions : 0;
      const ctr = impressions > 0 ? clicks / impressions : normalizeCtr(0);
      return {
        query,
        clicks,
        impressions,
        ctr,
        position: Math.round(position * 10) / 10,
      };
    })
    .sort((a, b) => b.impressions - a.impressions);
}

/**
 * Reshape Supermetrics GA4 (or equivalent web-analytics) rows into the
 * `contentPerformance[]` contract consumed by the `lead-feedback` agent.
 * Rows missing a URL are dropped; duplicate URLs are merged (sessions/
 * conversions summed, rates recomputed from the merged totals).
 */
export function toContentPerformance(rows: RawContentPerformanceRow[]): ContentPerformanceRow[] {
  const merged = new Map<
    string,
    { sessions: number; conversions: number; timeWeighted: number; bounceWeighted: number }
  >();

  for (const row of rows) {
    const url = typeof row.url === 'string' ? row.url.trim() : '';
    if (!url) continue;

    const sessions = toNumber(row.organicSessions);
    const conversions = toNumber(row.conversions);
    const avgTimeOnPage = row.avgTimeOnPage !== undefined ? toNumber(row.avgTimeOnPage) : 0;
    const bounceRate = row.bounceRate !== undefined ? normalizeCtr(row.bounceRate) : 0;

    const existing = merged.get(url);
    if (existing) {
      existing.sessions += sessions;
      existing.conversions += conversions;
      existing.timeWeighted += avgTimeOnPage * Math.max(sessions, 1);
      existing.bounceWeighted += bounceRate * Math.max(sessions, 1);
    } else {
      merged.set(url, {
        sessions,
        conversions,
        timeWeighted: avgTimeOnPage * Math.max(sessions, 1),
        bounceWeighted: bounceRate * Math.max(sessions, 1),
      });
    }
  }

  return Array.from(merged.entries())
    .map(([url, data]) => ({
      url,
      organicSessions: data.sessions,
      conversions: data.conversions,
      conversionRate: data.sessions > 0 ? data.conversions / data.sessions : 0,
      avgTimeOnPage: data.sessions > 0 ? Math.round(data.timeWeighted / data.sessions) : 0,
      bounceRate: data.sessions > 0 ? data.bounceWeighted / data.sessions : 0,
    }))
    .sort((a, b) => b.organicSessions - a.organicSessions);
}

/**
 * Default DWS ICP profile for the `keyword-intent` agent, derived from the
 * existing sales-outreach target list (`src/agents/sales-outreach.agent.ts`)
 * and regulatory clusters (`src/agents/seo/keyword-intent.agent.ts`).
 * Kept here so callers don't have to re-derive it per run — override fields
 * as needed for a narrower query (e.g. single-industry campaign review).
 */
export const DWS_SEO_ICP_PROFILE: IcpProfile = {
  industries: ['construction', 'steel', 'manufacturing', 'energy', 'logistics', 'cement'],
  companySize: '250-5000 employees',
  regions: ['nordics', 'dach', 'eu'],
  painPoints: ['csrd-reporting', 'ets-compliance', 'cbam-exposure', 'embodied-carbon'],
  regulations: [
    'fit-for-55',
    'csrd-reporting',
    'cbam',
    'ets-compliance',
    'nis2-compliance',
    'construction-carbon',
    'epbd',
  ],
};

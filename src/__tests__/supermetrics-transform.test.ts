/**
 * Supermetrics row-normalization tests — pure functions, no LLM/Supabase/network.
 */

import { describe, expect, it } from 'vitest';
import {
  toSearchConsoleQueries,
  toContentPerformance,
  DWS_SEO_ICP_PROFILE,
} from '../integrations/supermetrics/transform.js';

describe('toSearchConsoleQueries', () => {
  it('coerces numeric strings and normalizes a percentage CTR to a fraction', () => {
    const result = toSearchConsoleQueries([
      {
        query: 'csrd reporting software',
        clicks: '12',
        impressions: '400',
        ctr: '3.0',
        position: '9.4',
      },
    ]);

    expect(result).toEqual([
      {
        query: 'csrd reporting software',
        clicks: 12,
        impressions: 400,
        ctr: 12 / 400,
        position: 9.4,
      },
    ]);
  });

  it('drops rows with no query string', () => {
    const result = toSearchConsoleQueries([
      { query: '', clicks: 5, impressions: 100, position: 4 },
      { query: undefined as unknown as string, clicks: 5, impressions: 100, position: 4 },
    ]);
    expect(result).toEqual([]);
  });

  it('merges duplicate queries by summing clicks/impressions and impression-weighting position', () => {
    const result = toSearchConsoleQueries([
      { query: 'cbam calculator', clicks: 10, impressions: 100, position: 8 },
      { query: 'cbam calculator', clicks: 5, impressions: 300, position: 12 },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].clicks).toBe(15);
    expect(result[0].impressions).toBe(400);
    // weighted: (8*100 + 12*300) / 400 = 11
    expect(result[0].position).toBe(11);
  });

  it('sorts by impressions descending', () => {
    const result = toSearchConsoleQueries([
      { query: 'low volume', clicks: 1, impressions: 10, position: 5 },
      { query: 'high volume', clicks: 1, impressions: 1000, position: 5 },
    ]);
    expect(result.map((r) => r.query)).toEqual(['high volume', 'low volume']);
  });
});

describe('toContentPerformance', () => {
  it('computes conversion rate and bounce rate from raw sessions/conversions', () => {
    const result = toContentPerformance([
      {
        url: '/blog/csrd-guide',
        organicSessions: 200,
        conversions: 10,
        avgTimeOnPage: 90,
        bounceRate: '45',
      },
    ]);

    expect(result).toEqual([
      {
        url: '/blog/csrd-guide',
        organicSessions: 200,
        conversions: 10,
        conversionRate: 0.05,
        avgTimeOnPage: 90,
        bounceRate: 0.45,
      },
    ]);
  });

  it('drops rows with no URL', () => {
    const result = toContentPerformance([{ url: '', organicSessions: 10, conversions: 1 }]);
    expect(result).toEqual([]);
  });

  it('merges duplicate URLs by summing sessions/conversions and recomputing rates', () => {
    const result = toContentPerformance([
      { url: '/pricing', organicSessions: 100, conversions: 5, avgTimeOnPage: 60, bounceRate: 0.5 },
      {
        url: '/pricing',
        organicSessions: 300,
        conversions: 15,
        avgTimeOnPage: 100,
        bounceRate: 0.3,
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].organicSessions).toBe(400);
    expect(result[0].conversions).toBe(20);
    expect(result[0].conversionRate).toBe(0.05);
  });

  it('handles zero-session rows without dividing by zero', () => {
    const result = toContentPerformance([{ url: '/empty', organicSessions: 0, conversions: 0 }]);
    expect(result).toEqual([
      {
        url: '/empty',
        organicSessions: 0,
        conversions: 0,
        conversionRate: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
      },
    ]);
  });
});

describe('DWS_SEO_ICP_PROFILE', () => {
  it('matches the shape required by the keyword-intent agent', () => {
    expect(DWS_SEO_ICP_PROFILE.industries.length).toBeGreaterThan(0);
    expect(DWS_SEO_ICP_PROFILE.regions).toContain('nordics');
    expect(DWS_SEO_ICP_PROFILE.regulations).toContain('csrd-reporting');
  });
});

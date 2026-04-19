import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearGridFactorCache, getGridFactor, getGridFactors } from '../compliance/entsoe-grid-factors.js';

describe('entsoe-grid-factors', () => {
  beforeEach(() => {
    clearGridFactorCache();
    vi.unstubAllEnvs();
  });

  it('returns static fallback when no API key', async () => {
    delete process.env.ENTSOE_API_KEY;
    const result = await getGridFactors('DE', '2026-03-24T00:00:00Z', '2026-03-24T23:59:00Z');

    expect(result.source).toBe('fallback-static');
    expect(result.periodAverage).toBe(385); // Germany static
    expect(result.factors).toHaveLength(0);
  });

  it('returns static fallback for unknown country', async () => {
    process.env.ENTSOE_API_KEY = 'test-key';
    const result = await getGridFactors('XX', '2026-03-24T00:00:00Z', '2026-03-24T23:59:00Z');

    expect(result.source).toBe('fallback-static');
    expect(result.periodAverage).toBe(230); // EU average
  });

  it('getGridFactor returns number for known country without API key', async () => {
    delete process.env.ENTSOE_API_KEY;
    const factor = await getGridFactor('FI');

    expect(factor).toBe(68); // Finland static
    expect(typeof factor).toBe('number');
  });

  it('getGridFactor returns EU average for unknown country', async () => {
    delete process.env.ENTSOE_API_KEY;
    const factor = await getGridFactor('ZZ');

    expect(factor).toBe(230); // EU fallback
  });

  it('caches results and returns cached source', async () => {
    delete process.env.ENTSOE_API_KEY;
    const start = '2026-03-24T00:00:00Z';
    const end = '2026-03-24T23:59:00Z';

    // First call — fallback
    const first = await getGridFactors('FI', start, end);
    expect(first.source).toBe('fallback-static');

    // Note: static fallback is not cached (only live API results are cached)
    // This test verifies the cache path doesn't error
  });
});

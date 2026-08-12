import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  clearCarbonPriceCache,
  getCarbonPrice,
  getCarbonPriceEur,
} from '../compliance/ember-carbon-price.js';

// Mock node:fs so tests control what loadPersistedPrice() reads.
// readFileSync returns undefined by default (vi.fn()), causing JSON.parse to
// throw inside the catch block, so existing fallback tests are unaffected.
vi.mock('node:fs', () => ({ readFileSync: vi.fn() }));

describe('ember-carbon-price', () => {
  beforeEach(() => {
    clearCarbonPriceCache();
    // Mock global fetch so tests don't hit external APIs
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network disabled in test')));
  });

  it('returns static fallback when EMBER API is unreachable', async () => {
    // Without mocking fetch, the API call will fail (no network in test)
    // Should gracefully fall back to EUR 65
    const price = await getCarbonPrice();

    expect(price.priceEur).toBe(65);
    expect(price.source).toBe('fallback-static');
    expect(typeof price.date).toBe('string');
  });

  it('getCarbonPriceEur returns a number', async () => {
    const eur = await getCarbonPriceEur();

    expect(typeof eur).toBe('number');
    expect(eur).toBe(65); // fallback
  });

  it('price is always positive', async () => {
    const price = await getCarbonPrice();
    expect(price.priceEur).toBeGreaterThan(0);
  });

  it('date format is YYYY-MM-DD', async () => {
    const price = await getCarbonPrice();
    expect(price.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

// ============ FILE CACHE TESTS ============

const HOUR = 60 * 60 * 1000;

/** Build a JSON string as the daily script would write it. */
function makeFileContent(
  overrides: Partial<{
    priceEur: number;
    date: string;
    source: string;
    fetchedAt: string;
  }> = {},
): string {
  return JSON.stringify({
    priceEur: 71.5,
    date: '2026-05-10',
    source: 'ember-live',
    fetchedAt: new Date(Date.now() - HOUR).toISOString(), // 1 hour ago — within 26h TTL
    ...overrides,
  });
}

describe('file cache (loadPersistedPrice via getCarbonPrice)', () => {
  beforeEach(() => {
    clearCarbonPriceCache();
    vi.mocked(readFileSync).mockReset();
    // fetch is already stubbed to reject by outer beforeEach — ensures the
    // test fails over to static fallback when the file cache is bypassed.
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network disabled in test')));
  });

  it('(1) returns file-cache price when file is fresh and valid', async () => {
    vi.mocked(readFileSync).mockReturnValue(makeFileContent());

    const price = await getCarbonPrice();

    expect(price.source).toBe('file-cache');
    expect(price.priceEur).toBe(71.5);
    expect(price.date).toBe('2026-05-10');
  });

  it('(2) rejects seed-fallback source and falls through to static fallback', async () => {
    vi.mocked(readFileSync).mockReturnValue(makeFileContent({ source: 'seed-fallback' }));

    const price = await getCarbonPrice();

    expect(price.source).toBe('fallback-static');
    expect(price.priceEur).toBe(65);
  });

  it('(3) rejects stale fetchedAt (27h ago) and falls through to static fallback', async () => {
    const fetchedAt = new Date(Date.now() - 27 * HOUR).toISOString();
    vi.mocked(readFileSync).mockReturnValue(makeFileContent({ fetchedAt }));

    const price = await getCarbonPrice();

    expect(price.source).toBe('fallback-static');
    expect(price.priceEur).toBe(65);
  });

  it('(3b) rejects invalid/unparseable fetchedAt (NaN age must not slip through)', async () => {
    // new Date('not-a-date').getTime() = NaN; NaN > TTL = false without the isNaN guard
    vi.mocked(readFileSync).mockReturnValue(makeFileContent({ fetchedAt: 'not-a-date' }));

    const price = await getCarbonPrice();

    expect(price.source).toBe('fallback-static');
  });

  it('rejects missing fetchedAt before TTL check', async () => {
    vi.mocked(readFileSync).mockReturnValue(makeFileContent({ fetchedAt: undefined }));

    const price = await getCarbonPrice();

    expect(price.source).toBe('fallback-static');
  });

  it('rejects invalid date string in persisted cache', async () => {
    vi.mocked(readFileSync).mockReturnValue(makeFileContent({ date: 'invalid-date' }));

    const price = await getCarbonPrice();

    expect(price.source).toBe('fallback-static');
  });

  it('rejects missing date before returning file-cache result', async () => {
    vi.mocked(readFileSync).mockReturnValue(makeFileContent({ date: undefined }));

    const price = await getCarbonPrice();

    expect(price.source).toBe('fallback-static');
  });

  it('rejects a missing file (readFileSync throws ENOENT)', async () => {
    vi.mocked(readFileSync).mockImplementation(() => {
      throw Object.assign(new Error('no such file'), { code: 'ENOENT' });
    });

    const price = await getCarbonPrice();

    expect(price.source).toBe('fallback-static');
  });

  it('rejects corrupt JSON in the file', async () => {
    vi.mocked(readFileSync).mockReturnValue('{ this is not json }');

    const price = await getCarbonPrice();

    expect(price.source).toBe('fallback-static');
  });

  it('rejects zero/negative priceEur', async () => {
    vi.mocked(readFileSync).mockReturnValue(makeFileContent({ priceEur: 0 }));

    const price = await getCarbonPrice();

    expect(price.source).toBe('fallback-static');
  });

  it('file-cache hit populates in-memory cache for subsequent calls', async () => {
    vi.mocked(readFileSync).mockReturnValue(makeFileContent({ priceEur: 72.0 }));

    const first = await getCarbonPrice();
    expect(first.source).toBe('file-cache');
    expect(first.priceEur).toBe(72.0);

    // Swap out the file content — memory cache should be used, not readFileSync
    vi.mocked(readFileSync).mockReturnValue(makeFileContent({ priceEur: 99.0 }));

    const second = await getCarbonPrice();
    // source stays 'file-cache': 'file-cache'.replace('-live', '-cached') is a no-op
    expect(second.source).toBe('file-cache');
    expect(second.priceEur).toBe(72.0); // still the first value — from memory
  });
});

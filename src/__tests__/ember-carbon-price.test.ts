import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearCarbonPriceCache,
  getCarbonPrice,
  getCarbonPriceEur,
} from '../compliance/ember-carbon-price.js';

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

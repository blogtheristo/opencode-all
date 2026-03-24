/**
 * EU ETS Carbon Price Feed — Multi-Source Cascade
 *
 * Replaces hardcoded EUR 65/tCO2e in emission-factors.ts with
 * live/cached carbon price from multiple open data sources.
 *
 * Source cascade (first success wins):
 *   1. EMBER Climate API (daily CSV, CC BY 4.0, no key)
 *   2. Sandbag Carbon Price Tracker (near-realtime, open)
 *   3. Static fallback EUR 65 (2024 EU ETS average)
 *
 * Future additions (require paid/licensed access):
 *   - ICE Endex EUA Futures (real-time, requires ICE data license)
 *   - ECB SDW (Statistical Data Warehouse, free but delayed)
 *
 * Data: https://ember-climate.org/data/data-tools/carbon-price-viewer/
 * Sandbag: https://sandbag.be/carbon-price-viewer/
 * ICE Endex: https://www.theice.com/products/197/EUA-Futures (licensed)
 * License: CC BY 4.0 (EMBER), open (Sandbag)
 *
 * Code-Version: 1.1
 * Introduced-In: PR-TBD
 * Date: 2026-03-24
 * Owner: Lifetime Oy
 */

import logger from '../utils/logger.js';

// ============ TYPES ============

export interface CarbonPrice {
  /** EUR per tonne CO2e */
  priceEur: number;
  /** Date of the price (YYYY-MM-DD) */
  date: string;
  /** Data source used */
  source: 'ember-live' | 'ember-cached' | 'sandbag-live' | 'sandbag-cached' | 'fallback-static';
  /** When this data was fetched */
  fetchedAt: string;
}

export interface CarbonPriceHistory {
  prices: CarbonPrice[];
  latestPrice: number;
  avgPrice30d: number;
  minPrice30d: number;
  maxPrice30d: number;
  source: 'ember-live' | 'ember-cached' | 'sandbag-live' | 'sandbag-cached' | 'fallback-static';
  fetchedAt: string;
}

// ============ CONSTANTS ============

/** Hardcoded fallback — same as emission-factors.ts */
const STATIC_PRICE_EUR = 65;

/** EMBER Carbon Price API endpoint.
 * Public dataset: EU ETS settlement price (ICE ECX) */
const EMBER_API_URL = 'https://api.ember-climate.org/v1/carbon-price/eu-ets';

// ============ IN-MEMORY CACHE ============

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

let priceCache: CacheEntry<CarbonPrice> | null = null;
let historyCache: CacheEntry<CarbonPriceHistory> | null = null;

/** Cache TTL: 4 hours for current price, 24 hours for history */
const PRICE_CACHE_TTL_MS = 4 * 60 * 60 * 1000;
const HISTORY_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// ============ PUBLIC API ============

/**
 * Get latest EU ETS carbon price.
 *
 * Cascade: 1) cache  2) EMBER API  3) Sandbag  4) static fallback (EUR 65)
 *
 * No API key required for EMBER or Sandbag.
 */
export async function getCarbonPrice(): Promise<CarbonPrice> {
  // 1. Check cache
  if (priceCache && priceCache.expiresAt > Date.now()) {
    const cachedSource = priceCache.data.source.replace('-live', '-cached') as CarbonPrice['source'];
    return { ...priceCache.data, source: cachedSource };
  }

  // 2. Try EMBER API
  try {
    const price = await fetchEmberLatestPrice();
    priceCache = { data: price, expiresAt: Date.now() + PRICE_CACHE_TTL_MS };
    logger.info('EMBER carbon price fetched', { price: price.priceEur, date: price.date });
    return price;
  } catch (emberErr) {
    logger.warn('EMBER API failed, trying Sandbag', {
      error: emberErr instanceof Error ? emberErr.message : String(emberErr),
    });
  }

  // 3. Try Sandbag Carbon Price Tracker
  try {
    const price = await fetchSandbagLatestPrice();
    priceCache = { data: price, expiresAt: Date.now() + PRICE_CACHE_TTL_MS };
    logger.info('Sandbag carbon price fetched', { price: price.priceEur, date: price.date });
    return price;
  } catch (sandbagErr) {
    logger.warn('Sandbag API failed, using static fallback', {
      error: sandbagErr instanceof Error ? sandbagErr.message : String(sandbagErr),
    });
  }

  // 4. Static fallback
  return {
    priceEur: STATIC_PRICE_EUR,
    date: new Date().toISOString().slice(0, 10),
    source: 'fallback-static',
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Get carbon price as a number (EUR/tCO2e).
 * Drop-in replacement for the ETS_CARBON_PRICE_EUR constant.
 */
export async function getCarbonPriceEur(): Promise<number> {
  const price = await getCarbonPrice();
  return price.priceEur;
}

/**
 * Get 30-day carbon price history with statistics.
 */
export async function getCarbonPriceHistory(): Promise<CarbonPriceHistory> {
  // 1. Check cache
  if (historyCache && historyCache.expiresAt > Date.now()) {
    return { ...historyCache.data, source: 'ember-cached' };
  }

  // 2. Try EMBER API
  try {
    const history = await fetchEmberHistory();

    // Cache it
    historyCache = { data: history, expiresAt: Date.now() + HISTORY_CACHE_TTL_MS };

    logger.info('EMBER carbon price history fetched', {
      days: history.prices.length,
      avg: history.avgPrice30d,
    });

    return history;
  } catch (err) {
    logger.error('EMBER history API failed, using static fallback', {
      error: err instanceof Error ? err.message : String(err),
    });
    return {
      prices: [],
      latestPrice: STATIC_PRICE_EUR,
      avgPrice30d: STATIC_PRICE_EUR,
      minPrice30d: STATIC_PRICE_EUR,
      maxPrice30d: STATIC_PRICE_EUR,
      source: 'fallback-static',
      fetchedAt: new Date().toISOString(),
    };
  }
}

/**
 * Clear caches. For testing.
 */
export function clearCarbonPriceCache(): void {
  priceCache = null;
  historyCache = null;
}

// ============ EMBER API ============

async function fetchEmberLatestPrice(): Promise<CarbonPrice> {
  const response = await fetch(`${EMBER_API_URL}/latest`, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`EMBER API ${response.status}: ${response.statusText}`);
  }

  const data = await response.json() as Record<string, unknown>;

  // EMBER API returns: { price: number, currency: "EUR", date: "YYYY-MM-DD", unit: "tCO2" }
  const priceEur = typeof data.price === 'number' ? round2(data.price) : STATIC_PRICE_EUR;
  const date = typeof data.date === 'string' ? data.date : new Date().toISOString().slice(0, 10);

  return {
    priceEur,
    date,
    source: 'ember-live',
    fetchedAt: new Date().toISOString(),
  };
}

async function fetchEmberHistory(): Promise<CarbonPriceHistory> {
  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const response = await fetch(
    `${EMBER_API_URL}?start_date=${startDate}&end_date=${endDate}`,
    {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15_000),
    },
  );

  if (!response.ok) {
    throw new Error(`EMBER API ${response.status}: ${response.statusText}`);
  }

  const data = await response.json() as Record<string, unknown>;

  // EMBER returns array of { date, price, currency }
  const rawPrices = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

  const prices: CarbonPrice[] = rawPrices.map((entry: Record<string, unknown>) => ({
    priceEur: round2(typeof entry.price === 'number' ? entry.price : STATIC_PRICE_EUR),
    date: typeof entry.date === 'string' ? entry.date : '',
    source: 'ember-live' as const,
    fetchedAt: new Date().toISOString(),
  }));

  const priceValues = prices.map((p) => p.priceEur);
  const latestPrice = priceValues.length > 0 ? priceValues[priceValues.length - 1] : STATIC_PRICE_EUR;
  const avgPrice30d = priceValues.length > 0
    ? round2(priceValues.reduce((s, p) => s + p, 0) / priceValues.length)
    : STATIC_PRICE_EUR;

  return {
    prices,
    latestPrice,
    avgPrice30d: avgPrice30d,
    minPrice30d: priceValues.length > 0 ? Math.min(...priceValues) : STATIC_PRICE_EUR,
    maxPrice30d: priceValues.length > 0 ? Math.max(...priceValues) : STATIC_PRICE_EUR,
    source: 'ember-live',
    fetchedAt: new Date().toISOString(),
  };
}

// ============ SANDBAG API ============

/** Sandbag Carbon Price Tracker — secondary source.
 * Near-realtime EU ETS pricing. Open access, no API key.
 * https://sandbag.be/carbon-price-viewer/ */
const SANDBAG_API_URL = 'https://sandbag.be/api/carbon-price/latest';

async function fetchSandbagLatestPrice(): Promise<CarbonPrice> {
  const response = await fetch(SANDBAG_API_URL, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Sandbag API ${response.status}: ${response.statusText}`);
  }

  const data = await response.json() as Record<string, unknown>;
  const priceEur = typeof data.price === 'number' ? round2(data.price) : STATIC_PRICE_EUR;
  const date = typeof data.date === 'string' ? data.date : new Date().toISOString().slice(0, 10);

  return {
    priceEur,
    date,
    source: 'sandbag-live',
    fetchedAt: new Date().toISOString(),
  };
}

// ============ HELPERS ============

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

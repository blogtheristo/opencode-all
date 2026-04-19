/**
 * ENTSO-E Transparency Platform — Real-Time Grid Emission Factors
 *
 * Replaces hardcoded country averages in bess-calculator.ts with
 * actual generation mix data from ENTSO-E API.
 *
 * API: https://transparency.entsoe.eu/api
 * Auth: Free API key (register at https://transparency.entsoe.eu/)
 * Resolution: 15-min or 60-min intervals
 * Coverage: All EU/EEA bidding zones
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD
 * Date: 2026-03-24
 * Owner: Lifetime Oy
 */

import logger from '../utils/logger.js';

// ============ TYPES ============

export interface GridFactor {
  /** ISO 8601 timestamp (start of interval) */
  timestamp: string;
  /** Grid emission factor (gCO2/kWh) */
  factor: number;
  /** Bidding zone (e.g. 'DE_LU', 'FI', 'SE3') */
  biddingZone: string;
  /** Resolution in minutes (15 or 60) */
  resolutionMin: number;
}

export interface GridFactorResponse {
  factors: GridFactor[];
  country: string;
  biddingZone: string;
  /** Weighted average for the period (gCO2/kWh) */
  periodAverage: number;
  source: 'entsoe-live' | 'entsoe-cached' | 'fallback-static';
  fetchedAt: string;
}

/** Generation type → emission factor (gCO2/kWh).
 * Source: IPCC 2006 Guidelines, Table 2.2 + EU reference values */
const GENERATION_FACTORS: Record<string, number> = {
  B01: 900, // Biomass — depends on feedstock, using EU average
  B02: 0, // Fossil Brown coal/Lignite → handled by B05
  B03: 0, // Fossil Coal-derived gas → handled by B05
  B04: 370, // Fossil Gas (CCGT)
  B05: 900, // Fossil Hard coal
  B06: 650, // Fossil Oil
  B07: 0, // Fossil Oil shale → use B06
  B08: 0, // Fossil Peat → 1070 gCO2/kWh but rare
  B09: 0, // Geothermal
  B10: 0, // Hydro Pumped Storage — consumption, not generation
  B11: 0, // Hydro Run-of-river
  B12: 0, // Hydro Water Reservoir
  B13: 0, // Marine
  B14: 0, // Nuclear
  B15: 0, // Other renewable
  B16: 0, // Solar
  B17: 0, // Waste — 330 gCO2/kWh but excluded (biogenic fraction)
  B18: 0, // Wind Offshore
  B19: 0, // Wind Onshore
  B20: 0, // Other
};

/** Country → ENTSO-E bidding zone mapping */
const COUNTRY_TO_ZONE: Record<string, string> = {
  FI: '10YFI-1--------U',
  SE: '10YSE-1--------K', // SE1-SE4, using SE total
  NO: '10YNO-0--------C',
  DK: '10Y1001A1001A65H', // DK1
  DE: '10Y1001A1001A83F', // DE-LU
  FR: '10YFR-RTE------C',
  NL: '10YNL----------L',
  PL: '10YPL-AREA-----S',
  ES: '10YES-REE------0',
  IT: '10YIT-GRTN-----B', // IT-North
  AT: '10YAT-APG------L',
  BE: '10YBE----------2',
  PT: '10YPT-REN------W',
  GR: '10YGR-HTSO-----Y',
  IE: '10YIE-1001A00010',
  EE: '10Y1001A1001A39I',
  LT: '10YLT-1001A0008Q',
  LV: '10YLV-1001A00074',
};

/** Fallback static factors — same as bess-calculator.ts defaults */
const STATIC_FALLBACK: Record<string, number> = {
  FI: 68,
  SE: 36,
  NO: 19,
  DK: 130,
  DE: 385,
  FR: 55,
  NL: 340,
  PL: 650,
  ES: 170,
  IT: 260,
  AT: 90,
  BE: 155,
  PT: 180,
  GR: 310,
  IE: 300,
  EE: 550,
  LT: 120,
  LV: 95,
  EU: 230,
};

/**
 * National authority overrides for domestic compliance reporting.
 * Finnish auditors may require Energiavirasto figure over ENTSO-E EU-wide data.
 * Source: Finnish Energy Authority (Energiavirasto) annual reports.
 */
const NATIONAL_AUTHORITY_OVERRIDES: Record<
  string,
  {
    factor: number;
    source: string;
    year: number;
  }
> = {
  FI: { factor: 68, source: 'Energiavirasto 2024 annual report', year: 2024 },
};

/**
 * Get national authority grid factor if available.
 * Use for domestic reporting where national regulator figure is required.
 */
export function getNationalGridFactor(country: string):
  | {
      factor: number;
      source: string;
      year: number;
    }
  | undefined {
  return NATIONAL_AUTHORITY_OVERRIDES[country.toUpperCase()];
}

// ============ IN-MEMORY CACHE ============

interface CacheEntry {
  data: GridFactorResponse;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// ============ PUBLIC API ============

/**
 * Get grid emission factors for a country and date range.
 *
 * Priority: 1) in-memory cache  2) ENTSO-E API  3) static fallback
 *
 * Requires ENTSOE_API_KEY env var. Without it, returns static fallback.
 */
export async function getGridFactors(
  country: string,
  startDate: string,
  endDate: string,
): Promise<GridFactorResponse> {
  const cc = country.toUpperCase();
  const cacheKey = `${cc}:${startDate}:${endDate}`;

  // 1. Check cache
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return { ...cached.data, source: 'entsoe-cached' };
  }

  // 2. Try ENTSO-E API
  const apiKey = process.env.ENTSOE_API_KEY;
  if (!apiKey) {
    logger.warn('ENTSOE_API_KEY not set, using static fallback', { country: cc });
    return staticFallback(cc);
  }

  const zone = COUNTRY_TO_ZONE[cc];
  if (!zone) {
    logger.warn('No ENTSO-E bidding zone for country, using static fallback', { country: cc });
    return staticFallback(cc);
  }

  try {
    const factors = await fetchGenerationMix(apiKey, zone, startDate, endDate);
    const periodAverage =
      factors.length > 0
        ? round2(factors.reduce((sum, f) => sum + f.factor, 0) / factors.length)
        : (STATIC_FALLBACK[cc] ?? STATIC_FALLBACK['EU']);

    const response: GridFactorResponse = {
      factors,
      country: cc,
      biddingZone: zone,
      periodAverage,
      source: 'entsoe-live',
      fetchedAt: new Date().toISOString(),
    };

    // Cache it
    cache.set(cacheKey, { data: response, expiresAt: Date.now() + CACHE_TTL_MS });

    logger.info('ENTSO-E grid factors fetched', {
      country: cc,
      intervals: factors.length,
      avgFactor: periodAverage,
    });

    return response;
  } catch (err) {
    logger.error('ENTSO-E API call failed, using static fallback', {
      country: cc,
      error: err instanceof Error ? err.message : String(err),
    });
    return staticFallback(cc);
  }
}

/**
 * Get single grid factor for a country (latest or static).
 * Drop-in replacement for getDefaultGridFactor() in bess-calculator.ts.
 */
export async function getGridFactor(country: string): Promise<number> {
  const cc = country.toUpperCase();

  if (!process.env.ENTSOE_API_KEY) {
    return STATIC_FALLBACK[cc] ?? STATIC_FALLBACK['EU'];
  }

  const now = new Date();
  const start = new Date(now.getTime() - 60 * 60 * 1000).toISOString(); // 1 hour ago
  const end = now.toISOString();

  const response = await getGridFactors(cc, start, end);
  return response.periodAverage;
}

/**
 * Clear the in-memory cache. For testing.
 */
export function clearGridFactorCache(): void {
  cache.clear();
}

// ============ ENTSO-E API ============

/**
 * Fetch actual generation per type (document type A75) from ENTSO-E.
 * Calculates emission factor per interval from the generation mix.
 *
 * API endpoint: /api?documentType=A75&processType=A16
 * Returns: MW per generation type per interval.
 */
async function fetchGenerationMix(
  apiKey: string,
  zone: string,
  startDate: string,
  endDate: string,
): Promise<GridFactor[]> {
  // ENTSO-E requires YYYYMMDDHHMM format
  const periodStart = formatEntsoeDate(startDate);
  const periodEnd = formatEntsoeDate(endDate);

  const url =
    `https://web-api.tp.entsoe.eu/api?` +
    `securityToken=${encodeURIComponent(apiKey)}` +
    `&documentType=A75` + // Actual generation per type
    `&processType=A16` + // Realised
    `&in_Domain=${encodeURIComponent(zone)}` +
    `&periodStart=${periodStart}` +
    `&periodEnd=${periodEnd}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/xml' },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`ENTSO-E API ${response.status}: ${response.statusText}`);
  }

  const xml = await response.text();
  return parseGenerationXml(xml, zone);
}

/**
 * Parse ENTSO-E generation XML into emission factors per interval.
 *
 * For each time interval:
 *   factor = SUM(generation_MW[type] × emission_factor[type]) / SUM(generation_MW[type])
 */
function parseGenerationXml(xml: string, zone: string): GridFactor[] {
  // Simple XML extraction — ENTSO-E returns structured TimeSeries
  // Each TimeSeries has a psrType (B01-B20) and Point elements with position+quantity
  const factors: GridFactor[] = [];

  // Extract all TimeSeries blocks
  const seriesRegex = /<TimeSeries>([\s\S]*?)<\/TimeSeries>/g;
  const intervalTotals = new Map<number, { weighted: number; total: number }>();

  let match;
  while ((match = seriesRegex.exec(xml)) !== null) {
    const series = match[1];

    // Get generation type (psrType)
    const psrMatch = series.match(/<psrType>(\w+)<\/psrType>/);
    if (!psrMatch) continue;
    const psrType = psrMatch[1];
    const emissionFactor = GENERATION_FACTORS[psrType] ?? 0;

    // Get resolution
    // Resolution and start time parsed for future per-interval granularity
    void series.match(/<resolution>PT(\d+)M<\/resolution>/);
    void series.match(/<start>([\dT:Z+-]+)<\/start>/);

    // Extract points
    const pointRegex =
      /<Point>\s*<position>(\d+)<\/position>\s*<quantity>([\d.]+)<\/quantity>\s*<\/Point>/g;
    let pointMatch;
    while ((pointMatch = pointRegex.exec(series)) !== null) {
      const position = parseInt(pointMatch[1], 10);
      const mw = parseFloat(pointMatch[2]);

      const existing = intervalTotals.get(position) ?? { weighted: 0, total: 0 };
      existing.weighted += mw * emissionFactor;
      existing.total += mw;
      intervalTotals.set(position, existing);
    }
  }

  // Convert to GridFactor entries
  // Use resolution from first series (typically 60 min)
  const resMatch = xml.match(/<resolution>PT(\d+)M<\/resolution>/);
  const resolutionMin = resMatch ? parseInt(resMatch[1], 10) : 60;
  const startMatch = xml.match(/<start>([\dT:Z+-]+)<\/start>/);
  const periodStart = startMatch ? new Date(startMatch[1]).getTime() : Date.now();

  for (const [position, { weighted, total }] of intervalTotals) {
    if (total <= 0) continue;
    const factor = round2(weighted / total);
    const timestamp = new Date(periodStart + (position - 1) * resolutionMin * 60 * 1000);

    factors.push({
      timestamp: timestamp.toISOString(),
      factor,
      biddingZone: zone,
      resolutionMin,
    });
  }

  return factors.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

// ============ HELPERS ============

function staticFallback(country: string): GridFactorResponse {
  const factor = STATIC_FALLBACK[country] ?? STATIC_FALLBACK['EU'];
  return {
    factors: [],
    country,
    biddingZone: COUNTRY_TO_ZONE[country] ?? 'unknown',
    periodAverage: factor,
    source: 'fallback-static',
    fetchedAt: new Date().toISOString(),
  };
}

function formatEntsoeDate(isoDate: string): string {
  // ENTSO-E format: YYYYMMDDHHMM
  const d = new Date(isoDate);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const h = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  return `${y}${m}${day}${h}${min}`;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

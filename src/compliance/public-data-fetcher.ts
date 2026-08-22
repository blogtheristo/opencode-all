/**
 * Public Data Fetcher — EU Regulatory Data Sources
 *
 * Fetches real compliance data from public EU sources:
 * - Eurostat: Industry emissions by NACE sector (JSON API)
 * - EEA: Greenhouse gas inventories
 * - EUTL: EU ETS verified emissions per installation
 * - EU carbon price: ETS auction price (ECX/ICE)
 *
 * All sources are free, public, and require no API keys.
 */

import { EU_SECTOR_BENCHMARKS, MANUFACTURING_BENCHMARK, type SectorBenchmark } from './eu-benchmarks.js';
import { ETS_CARBON_PRICE_EUR } from './emission-factors.js';
import logger from '../utils/logger.js';

// ============ TYPES ============

export interface EurostatResponse {
  sector: string;
  naceCode: string;
  emissions: number;        // tonnes CO2e
  year: number;
  source: string;
  fetchedAt: string;
}

export interface CarbonPriceData {
  price: number;            // EUR/tCO2e
  date: string;
  source: string;
  fetchedAt: string;
}

export interface PublicDataCache {
  eurostat: Map<string, EurostatResponse>;
  carbonPrice: CarbonPriceData | null;
  lastRefresh: Date;
}

// ============ CACHE ============

const cache: PublicDataCache = {
  eurostat: new Map(),
  carbonPrice: null,
  lastRefresh: new Date(0),
};

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function isCacheValid(): boolean {
  return Date.now() - cache.lastRefresh.getTime() < CACHE_TTL_MS;
}

// ============ EUROSTAT API ============

/**
 * Eurostat JSON API for air emissions accounts by NACE activity.
 * Dataset: env_ac_ainah_r2 (Air emissions accounts by NACE Rev. 2 activity)
 * Free, no API key required.
 *
 * API docs: https://wikis.ec.europa.eu/display/EUROSTATHELP/API+Statistics
 */
const EUROSTAT_API_BASE = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data';

/** NACE code mapping to Eurostat filter values */
const NACE_TO_EUROSTAT: Record<string, string> = {
  'C24': 'C24',       // Basic metals (steel)
  'C23.51': 'C23',    // Other non-metallic minerals (cement)
  'C24.42': 'C24',    // Aluminium
  'C20': 'C20',       // Chemicals
  'C20.15': 'C20',    // Fertilizers
  'C20.11': 'C20',    // Hydrogen (industrial gases)
  'D35': 'D',         // Electricity, gas, steam
  'C10-C33': 'C',     // Manufacturing total
  'F41-F43': 'F',     // Construction
  'H49-H53': 'H',     // Transportation and storage
};

/**
 * Fetch sector emissions from Eurostat API.
 * Uses env_ac_ainah_r2 dataset — air emissions by NACE activity.
 */
export async function fetchEurostatEmissions(
  naceCode: string,
  country: string = 'EU27_2020',
): Promise<EurostatResponse | null> {
  const cacheKey = `${naceCode}:${country}`;
  const cached = cache.eurostat.get(cacheKey);
  if (isCacheValid() && cached) {
    return cached;
  }

  const eurostatNace = NACE_TO_EUROSTAT[naceCode] || naceCode;

  // Eurostat JSON API endpoint for air emissions
  const url = new URL(`${EUROSTAT_API_BASE}/env_ac_ainah_r2`);
  url.searchParams.set('format', 'JSON');
  url.searchParams.set('lang', 'en');
  url.searchParams.set('airpol', 'GHG');      // Greenhouse gases total
  url.searchParams.set('unit', 'THS_T');       // Thousand tonnes
  url.searchParams.set('nace_r2', eurostatNace);
  url.searchParams.set('geo', country);
  url.searchParams.set('sinceTimePeriod', '2022');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { 'Accept': 'application/json' },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      logger.warn('Eurostat API returned non-OK status', {
        status: response.status,
        naceCode,
        country,
      });
      return getFallbackBenchmark(naceCode);
    }

    const data = await response.json();

    // Eurostat JSON-stat format: extract latest value
    const values = data.value || {};
    const latestValue = Object.values(values).pop() as number | undefined;

    if (latestValue === undefined) {
      logger.info('No Eurostat data for NACE code, using benchmark', { naceCode });
      return getFallbackBenchmark(naceCode);
    }

    // Convert from thousand tonnes to tonnes
    const emissions = Math.round(latestValue * 1000);

    const result: EurostatResponse = {
      sector: naceCode,
      naceCode,
      emissions,
      year: 2023, // latest available
      source: 'Eurostat env_ac_ainah_r2',
      fetchedAt: new Date().toISOString(),
    };

    cache.eurostat.set(cacheKey, result);
    cache.lastRefresh = new Date();

    logger.info('Fetched Eurostat emissions data', {
      naceCode,
      country,
      emissions,
    });

    return result;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      logger.warn('Eurostat API request timed out', { naceCode });
    } else {
      logger.warn('Eurostat API request failed, using benchmark', {
        naceCode,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return getFallbackBenchmark(naceCode);
  }
}

/**
 * Fallback to static benchmark when API is unavailable.
 */
function getFallbackBenchmark(naceCode: string): EurostatResponse {
  const benchmark = EU_SECTOR_BENCHMARKS.find((b) => b.naceCode === naceCode);
  const fallback =
    benchmark
    ?? EU_SECTOR_BENCHMARKS.find((b) => b.sector === 'manufacturing')
    ?? MANUFACTURING_BENCHMARK;

  return {
    sector: fallback.sector,
    naceCode: fallback.naceCode,
    emissions: fallback.medianEmissions,
    year: fallback.year,
    source: `DWS benchmark (${fallback.source}) — API unavailable`,
    fetchedAt: new Date().toISOString(),
  };
}

// ============ CARBON PRICE ============

/**
 * Fetch latest EU ETS carbon price.
 * Uses ECB Statistical Data Warehouse (free, no key) as primary.
 * Falls back to hardcoded reference price.
 */
export async function fetchCarbonPrice(): Promise<CarbonPriceData> {
  if (isCacheValid() && cache.carbonPrice) {
    return cache.carbonPrice;
  }

  // ECB SDW API for EU ETS allowance price
  // Series: ETS.D.EU.1.0000.EUR — daily EU ETS price in EUR
  const url = 'https://data-api.ecb.europa.eu/service/data/ETS/D.EU.1.0000.EUR?format=csvdata&lastNObservations=1';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'Accept': 'text/csv' },
    });
    clearTimeout(timeout);

    if (response.ok) {
      const csv = await response.text();
      const lines = csv.trim().split('\n');
      if (lines.length >= 2) {
        // CSV format: parse last data line
        const dataLine = lines[lines.length - 1];
        const fields = dataLine.split(',');
        // OBS_VALUE is typically the last numeric field
        const priceField = fields.find((f) => /^\d+\.?\d*$/.test(f.trim()));
        if (priceField) {
          const price = parseFloat(priceField.trim());
          const result: CarbonPriceData = {
            price,
            date: new Date().toISOString().split('T')[0],
            source: 'ECB Statistical Data Warehouse (ETS.D.EU.1.0000.EUR)',
            fetchedAt: new Date().toISOString(),
          };
          cache.carbonPrice = result;
          cache.lastRefresh = new Date();
          logger.info('Fetched EU ETS carbon price', { price });
          return result;
        }
      }
    }
  } catch (err) {
    logger.warn('ECB carbon price API failed, using reference price', {
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // Fallback to reference price
  return {
    price: ETS_CARBON_PRICE_EUR,
    date: '2024-12-31',
    source: 'DWS reference price (EU ETS 2024 average)',
    fetchedAt: new Date().toISOString(),
  };
}

// ============ COMBINED FETCH ============

export interface PublicComplianceData {
  sectorEmissions: EurostatResponse;
  carbonPrice: CarbonPriceData;
  benchmark: SectorBenchmark;
}

/**
 * Fetch all public compliance data for a sector.
 * Combines Eurostat emissions, carbon price, and sector benchmarks.
 */
export async function fetchPublicComplianceData(
  sector: string,
  country: string = 'EU27_2020',
): Promise<PublicComplianceData> {
  const benchmark =
    EU_SECTOR_BENCHMARKS.find((b) => b.sector === sector.toLowerCase())
    ?? EU_SECTOR_BENCHMARKS.find((b) => b.sector === 'manufacturing')
    ?? MANUFACTURING_BENCHMARK;

  const [sectorEmissions, carbonPrice] = await Promise.all([
    fetchEurostatEmissions(benchmark.naceCode, country),
    fetchCarbonPrice(),
  ]);

  return {
    sectorEmissions: sectorEmissions ?? {
      sector: benchmark.sector,
      naceCode: benchmark.naceCode,
      emissions: benchmark.medianEmissions,
      year: benchmark.year,
      source: `DWS benchmark (${benchmark.source}) — API unavailable`,
      fetchedAt: new Date().toISOString(),
    },
    carbonPrice,
    benchmark,
  };
}

/**
 * Clear the public data cache (useful for testing or forced refresh).
 */
export function clearPublicDataCache(): void {
  cache.eurostat.clear();
  cache.carbonPrice = null;
  cache.lastRefresh = new Date(0);
}

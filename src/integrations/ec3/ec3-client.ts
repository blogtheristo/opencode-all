/**
 * EC3 / openEPD API Client
 *
 * Connects to BuildingTransparency's EC3 openEPD REST API to fetch
 * real EPD (Environmental Product Declaration) data for construction
 * materials. Returns normalized kgCO2e/kg factors with confidence
 * scoring based on EPD count per category.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (EC3 connector)
 * Date: 2026-03-23
 * Owner: Material Oracle / EC3 Connector
 *
 * API: https://openepd.buildingtransparency.org/api
 * Auth: Bearer token from EC3 account (env: EC3_API_TOKEN)
 * Rate limits: Token-bucket, respect 429 with exponential backoff
 *
 * Attribution requirement (EC3 ToS): When showing individual EPD data,
 * provide direct links back to EC3. When using data to derive other
 * data, attribute Building Transparency and EC3 in documentation.
 */

import axios, { type AxiosError, type AxiosInstance } from 'axios';
import pino from 'pino';
import { normalizeToKg, resolveCanonicalUnit } from '../../agents/unit-normalization.js';
import type {
  EC3CategoryStats,
  EC3Epd,
  EC3SearchResponse,
  NormalizedEpd,
} from './types.js';

const logger = pino({ name: 'ec3-client' });

// ============ MATERIAL → OMF CATEGORY MAPPING ============
// Maps our internal material names to EC3 Open Material Filter search terms

const MATERIAL_TO_EC3_CATEGORY: Record<string, string> = {
  concrete: 'ReadyMix',
  steel: 'Steel',
  rebar: 'Rebar',
  timber: 'SoftwoodLumber',
  timber_hardwood: 'HardwoodLumber',
  timber_clt: 'CLT',
  timber_glulam: 'Glulam',
  aluminum: 'Aluminum',
  glass: 'FlatGlass',
  brick: 'Brick',
  insulation_mineral_wool: 'MineralWool',
  insulation_eps: 'EPS',
  insulation_xps: 'XPS',
  cement: 'Cement',
  copper: 'Copper',
  plasterboard: 'Gypsum',
  asphalt: 'Asphalt',
};

// ============ CLIENT CONFIGURATION ============

export interface EC3ClientConfig {
  /** API base URL (default: openEPD production) */
  baseUrl?: string;
  /** Bearer token for authentication */
  apiToken: string;
  /** Request timeout in ms (default: 15000) */
  timeout?: number;
  /** Max retries on rate limit / transient errors (default: 3) */
  maxRetries?: number;
  /** Geographic filter for EPDs (ISO country codes) */
  geographyFilter?: string[];
}

// ============ CLIENT IMPLEMENTATION ============

export class EC3Client {
  private http: AxiosInstance;
  private config: EC3ClientConfig;

  constructor(config: EC3ClientConfig) {
    this.config = {
      baseUrl: 'https://openepd.buildingtransparency.org/api',
      timeout: 15000,
      maxRetries: 3,
      ...config,
    };

    this.http = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiToken}`,
        'User-Agent': 'DWS-IQ-6/1.0 (MaterialOracle; EC3-Connector)',
      },
    });
  }

  /**
   * Search EPDs by material category and return normalized statistics.
   *
   * This is the primary method for Material Oracle integration.
   * Returns aggregated GWP stats with confidence level based on EPD count.
   *
   * @param materialName - Internal material name (e.g. 'concrete', 'steel')
   * @param options - Optional search refinements
   * @returns Category statistics with confidence level and normalized EPDs
   */
  async searchByMaterial(
    materialName: string,
    options?: {
      /** Only include currently valid EPDs */
      validOnly?: boolean;
      /** Max EPDs to fetch (default: 50) */
      pageSize?: number;
      /** Country filter override */
      geography?: string[];
    },
  ): Promise<EC3CategoryStats> {
    const normalizedName = materialName.toLowerCase().replace(/[\s_-]+/g, '_');
    const ec3Category = MATERIAL_TO_EC3_CATEGORY[normalizedName];

    if (!ec3Category) {
      logger.info({ materialName }, 'No EC3 category mapping for material');
      return this.emptyStats(materialName);
    }

    const pageSize = options?.pageSize ?? 50;

    // Build OMF query
    let omfQuery = `!EC3 search("${ec3Category}")`;
    if (options?.validOnly !== false) {
      const today = new Date().toISOString().split('T')[0];
      omfQuery += ` valid_until: >"${today}"`;
    }
    omfQuery += ' !pragma oMF("1.0/1")';

    try {
      const response = await this.fetchWithRetry<EC3SearchResponse>(
        '/epds',
        {
          method: 'POST',
          data: {
            filter: omfQuery,
            page_size: pageSize,
            geography: options?.geography ?? this.config.geographyFilter,
          },
        },
      );

      const epds = response.results ?? response.items ?? [];
      return this.buildCategoryStats(materialName, ec3Category, epds);
    } catch (err) {
      logger.error({ materialName, ec3Category, error: err instanceof Error ? err.message : String(err) }, 'EC3 API search failed');
      return this.emptyStats(materialName);
    }
  }

  /**
   * Get a single EPD by its openXPD UUID.
   */
  async getEpdById(id: string): Promise<EC3Epd | null> {
    try {
      return await this.fetchWithRetry<EC3Epd>(`/epds/${id}`, { method: 'GET' });
    } catch (err) {
      logger.error({ id, error: err instanceof Error ? err.message : String(err) }, 'EC3 API get EPD failed');
      return null;
    }
  }

  // ============ PRIVATE METHODS ============

  /**
   * Build category statistics from raw EPD results.
   * Normalizes all GWP values to kgCO2e/kg and computes confidence.
   */
  private buildCategoryStats(
    materialName: string,
    ec3Category: string,
    epds: EC3Epd[],
  ): EC3CategoryStats {
    if (epds.length === 0) {
      return this.emptyStats(materialName);
    }

    // Normalize each EPD's GWP to per-kg basis
    const normalizedEpds: NormalizedEpd[] = [];

    for (const epd of epds) {
      const normalized = this.normalizeEpd(epd, materialName);
      if (normalized) {
        normalizedEpds.push(normalized);
      }
    }

    if (normalizedEpds.length === 0) {
      logger.warn({ materialName, rawCount: epds.length }, 'All EPDs failed normalization');
      return this.emptyStats(materialName);
    }

    // Compute statistics on normalized GWP A1-A3 values
    const gwpValues = normalizedEpds
      .map((e) => e.gwpA1A3PerKg)
      .filter((v) => v > 0)
      .sort((a, b) => a - b);

    const stats = this.computeStats(gwpValues);
    const confidence = this.assessConfidence(normalizedEpds.length);

    if (confidence === 'low') {
      logger.warn({ materialName, ec3Category, epdCount: normalizedEpds.length }, 'EC3 low confidence: fewer than 3 EPDs in category');
    }

    return {
      category: ec3Category,
      epdCount: normalizedEpds.length,
      gwpPerKg: stats,
      confidence,
      epds: normalizedEpds,
    };
  }

  /**
   * Normalize a single EPD's GWP values to kgCO2e per kg.
   * Returns null if the EPD lacks usable GWP data.
   */
  private normalizeEpd(epd: EC3Epd, materialName: string): NormalizedEpd | null {
    // Extract GWP A1-A3 value
    let gwpA1A3Raw: number | null = null;

    const a1a2a3Mean = epd.gwp?.a1a2a3?.mean;
    if (a1a2a3Mean !== null && a1a2a3Mean !== undefined) {
      gwpA1A3Raw = a1a2a3Mean;
    } else if (epd.gwp_per_declared_unit !== null && epd.gwp_per_declared_unit !== undefined) {
      gwpA1A3Raw = epd.gwp_per_declared_unit;
    }

    if (gwpA1A3Raw === null || gwpA1A3Raw <= 0) {
      return null;
    }

    // Determine declared unit and normalize to per-kg
    const declaredUnit = epd.declared_unit || 'kg';
    const canonical = resolveCanonicalUnit(declaredUnit);

    // GWP is "per declared unit". We need "per kg".
    // If declared_unit is m³: gwpPerKg = gwpPerM3 / density
    // If declared_unit is kg: gwpPerKg = gwpRaw (passthrough)
    // If declared_unit is tonne: gwpPerKg = gwpPerTonne / 1000
    let unitConversionFactor = 1;
    let gwpA1A3PerKg = gwpA1A3Raw;

    if (canonical === 'kg') {
      gwpA1A3PerKg = gwpA1A3Raw;
      unitConversionFactor = 1;
    } else if (canonical === 'tonne') {
      // GWP per tonne → divide by 1000 to get per kg
      gwpA1A3PerKg = gwpA1A3Raw / 1000;
      unitConversionFactor = 1000;
    } else if (canonical === 'm3') {
      // GWP per m³ → divide by density to get per kg
      // Use normalizeToKg to get density: 1 m³ → X kg
      const norm = normalizeToKg(materialName, 1, 'm3');
      if (norm.confidence !== 'assumed' || norm.conversionFactor > 1) {
        gwpA1A3PerKg = gwpA1A3Raw / norm.conversionFactor;
        unitConversionFactor = norm.conversionFactor;
      }
    } else if (canonical === 'm2') {
      // GWP per m² → divide by area density to get per kg
      const norm = normalizeToKg(materialName, 1, 'm2');
      if (norm.confidence !== 'assumed' || norm.conversionFactor > 1) {
        gwpA1A3PerKg = gwpA1A3Raw / norm.conversionFactor;
        unitConversionFactor = norm.conversionFactor;
      }
    }
    // For unknown units, keep as-is (will be flagged by confidence)

    // Extract other lifecycle stages (normalize same way)
    const divFactor = canonical === 'kg' ? 1 : unitConversionFactor;
    const gwpByStage = {
      a1_a3: gwpA1A3PerKg,
      a4: (epd.gwp?.a4?.mean ?? 0) / (divFactor || 1),
      a5: (epd.gwp?.a5?.mean ?? 0) / (divFactor || 1),
      b: (epd.gwp?.b?.mean ?? 0) / (divFactor || 1),
      c: (epd.gwp?.c1c2c3c4?.mean ?? 0) / (divFactor || 1),
      d: (epd.gwp?.d?.mean ?? 0) / (divFactor || 1),
    };

    return {
      ec3Id: epd.id,
      materialName: epd.name,
      gwpA1A3PerKg,
      gwpByStage,
      originalDeclaredUnit: declaredUnit,
      unitConversionFactor,
      manufacturer: epd.manufacturer?.name ?? 'Unknown',
      geography: epd.geography ?? [],
      validUntil: epd.valid_until ?? '',
      declarationType: epd.declaration_type ?? 'unknown',
      attribution: `EPD ${epd.id} via EC3/BuildingTransparency (${epd.program_operator?.name ?? 'openEPD'})`,
    };
  }

  /**
   * Assess confidence based on EPD count in category.
   *
   * Critical rule (from product owner): fewer than 3 EPDs = low confidence.
   * A single EPD driving a compliance output is unacceptable for CFO demos.
   */
  private assessConfidence(epdCount: number): EC3CategoryStats['confidence'] {
    if (epdCount >= 10) return 'high';
    if (epdCount >= 3) return 'medium';
    if (epdCount >= 1) return 'low';
    return 'none';
  }

  /**
   * Compute descriptive statistics for a sorted array of values.
   */
  private computeStats(sorted: number[]): EC3CategoryStats['gwpPerKg'] {
    if (sorted.length === 0) {
      return { mean: 0, median: 0, p10: 0, p90: 0, min: 0, max: 0 };
    }

    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / sorted.length;
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    const p10Idx = Math.floor(sorted.length * 0.1);
    const p90Idx = Math.min(Math.floor(sorted.length * 0.9), sorted.length - 1);

    return {
      mean: Math.round(mean * 10000) / 10000,
      median: Math.round(median * 10000) / 10000,
      p10: Math.round(sorted[p10Idx] * 10000) / 10000,
      p90: Math.round(sorted[p90Idx] * 10000) / 10000,
      min: Math.round(sorted[0] * 10000) / 10000,
      max: Math.round(sorted[sorted.length - 1] * 10000) / 10000,
    };
  }

  /**
   * Return empty stats for materials with no EC3 data.
   */
  private emptyStats(materialName: string): EC3CategoryStats {
    return {
      category: materialName,
      epdCount: 0,
      gwpPerKg: { mean: 0, median: 0, p10: 0, p90: 0, min: 0, max: 0 },
      confidence: 'none',
      epds: [],
    };
  }

  /**
   * HTTP request with exponential backoff retry on 429/5xx.
   */
  private async fetchWithRetry<T>(
    path: string,
    opts: { method: 'GET' | 'POST'; data?: unknown },
  ): Promise<T> {
    const maxRetries = this.config.maxRetries ?? 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = opts.method === 'POST'
          ? await this.http.post<T>(path, opts.data)
          : await this.http.get<T>(path);
        return response.data;
      } catch (err: unknown) {
        const axiosErr = err as AxiosError;
        const status = axiosErr.response?.status;
        const isRetryable = status === 429 || (status !== undefined && status >= 500);

        if (!isRetryable || attempt === maxRetries) {
          throw err;
        }

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        logger.warn({ path, status, attempt: attempt + 1, delayMs: delay }, 'EC3 API retrying');
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Unreachable, but TypeScript needs it
    throw new Error('EC3 API max retries exceeded');
  }
}

// ============ FACTORY ============

/**
 * Create an EC3 client from environment variables.
 * Returns null if EC3_API_TOKEN is not set (graceful degradation).
 */
export function createEC3Client(): EC3Client | null {
  const token = process.env.EC3_API_TOKEN;
  if (!token) {
    logger.info('EC3_API_TOKEN not set — EC3 connector disabled, using hardcoded factors');
    return null;
  }

  return new EC3Client({
    apiToken: token,
    geographyFilter: (process.env.EC3_GEOGRAPHY_FILTER ?? 'FI,SE,NO,DK,DE').split(','),
  });
}

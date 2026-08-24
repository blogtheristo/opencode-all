/**
 * EC3 / openEPD API Types
 *
 * Type definitions for BuildingTransparency's EC3 openEPD REST API.
 * Based on openEPD format specification v1.x.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (EC3 connector)
 * Date: 2026-03-23
 * Owner: Material Oracle / EC3 Connector
 *
 * Sources:
 *   - https://openepd.buildingtransparency.org/ (REST API spec)
 *   - https://docs.open-epd-forum.org/en/open-epd-format-1/ (format spec)
 *   - https://github.com/cchangelabs/openepd (Python reference models)
 */

// ============ MEASUREMENT TYPES ============

/** openEPD measurement with statistical distribution */
export interface EC3Measurement {
  mean: number;
  unit: string;
  rsd?: number;
  dist?: 'log-normal' | 'normal' | 'uniform';
  min?: number;
  max?: number;
}

/** GWP impact by lifecycle stage (kgCO2e per declared unit) */
export interface EC3GWPBreakdown {
  /** A1-A3: Product stage (cradle-to-gate) — most common in EPDs */
  a1a2a3?: EC3Measurement;
  /** A4: Transport to site */
  a4?: EC3Measurement;
  /** A5: Construction/installation */
  a5?: EC3Measurement;
  /** B: Use stage (varies by PCR) */
  b?: EC3Measurement;
  /** C1-C4: End of life */
  c1c2c3c4?: EC3Measurement;
  /** D: Beyond system boundary */
  d?: EC3Measurement;
}

// ============ EPD RESPONSE TYPES ============

/** Organization/manufacturer reference */
export interface EC3Org {
  name: string;
  web_domain?: string;
  country?: string;
}

/** Plant (manufacturing facility) reference */
export interface EC3Plant {
  name?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

/** Program operator (EPD registry) */
export interface EC3ProgramOperator {
  name: string;
  web_domain?: string;
}

/** Core EPD object from openEPD API */
export interface EC3Epd {
  /** openXPD UUID (e.g. "ec3zsed8") */
  id: string;
  /** Human-readable EPD name */
  name: string;
  /** Declared unit for all impact values */
  declared_unit: string;
  /** GWP per declared unit (kgCO2e) — primary carbon metric */
  gwp?: EC3GWPBreakdown;
  /** Total GWP A1-A3 shorthand (when breakdown not available) */
  gwp_per_declared_unit?: number;
  /** Manufacturer */
  manufacturer?: EC3Org;
  /** Manufacturing plant(s) */
  plants?: EC3Plant[];
  /** Program operator (registry that issued the EPD) */
  program_operator?: EC3ProgramOperator;
  /** Product classes / material categories */
  product_classes?: Record<string, string>;
  /** Sector-specific specs (e.g. concrete strength, steel grade) */
  specs?: Record<string, Record<string, unknown>>;
  /** EPD validity dates */
  date_of_issue?: string;
  valid_until?: string;
  /** Whether this is a product EPD or industry-average EPD */
  declaration_type?: 'product_epd' | 'industry_epd' | 'generic';
  /** Country/region scope */
  geography?: string[];
  /** PCR (Product Category Rule) reference */
  pcr?: {
    name?: string;
    id?: string;
  };
}

/** Paginated search response from openEPD API */
export interface EC3SearchResponse {
  /** EPD results */
  results?: EC3Epd[];
  /** Alternative: items array (API version dependent) */
  items?: EC3Epd[];
  /** Total count of matching EPDs */
  total_count?: number;
  /** Pagination cursor/offset */
  next_page?: string;
}

// ============ DWS INTERNAL TYPES ============

/** Normalized EPD data for Material Oracle consumption */
export interface NormalizedEpd {
  /** EC3 EPD identifier */
  ec3Id: string;
  /** Material name */
  materialName: string;
  /** GWP A1-A3 in kgCO2e per kg (always normalized to per-kg) */
  gwpA1A3PerKg: number;
  /** GWP by lifecycle stage in kgCO2e per kg */
  gwpByStage: {
    a1_a3: number;
    a4: number;
    a5: number;
    b: number;
    c: number;
    d: number;
  };
  /** Original declared unit from EC3 */
  originalDeclaredUnit: string;
  /** Conversion factor applied (declared_unit → kg) */
  unitConversionFactor: number;
  /** Manufacturer name */
  manufacturer: string;
  /** Country/region */
  geography: string[];
  /** EPD validity */
  validUntil: string;
  /** Product or industry average */
  declarationType: string;
  /** Source attribution (required by EC3 ToS) */
  attribution: string;
}

/** Aggregated category statistics for confidence assessment */
export interface EC3CategoryStats {
  /** Material category searched */
  category: string;
  /** Total EPDs found in category */
  epdCount: number;
  /** GWP A1-A3 statistics (kgCO2e per kg, normalized) */
  gwpPerKg: {
    mean: number;
    median: number;
    p10: number;
    p90: number;
    min: number;
    max: number;
  };
  /**
   * Confidence level based on EPD count.
   * - high: 10+ EPDs — robust category average
   * - medium: 3-9 EPDs — usable but flag in reports
   * - low: 1-2 EPDs — single-source, do NOT use as hard number
   * - none: 0 EPDs — no EC3 data, fall back to ICE/hardcoded
   */
  confidence: 'high' | 'medium' | 'low' | 'none';
  /** Individual EPDs (for audit trail) */
  epds: NormalizedEpd[];
}

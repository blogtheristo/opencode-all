/**
 * EU Default Emission Factors
 *
 * Based on EU ETS benchmark values and CBAM default values (2024/2025).
 * Used when companies don't have verified installation-specific data.
 *
 * Sources:
 * - EU ETS free allocation benchmarks (Commission Implementing Regulation 2021/447)
 * - CBAM transitional default values (Implementing Regulation 2023/1773)
 * - IPCC 2006 Guidelines for National GHG Inventories
 */

export interface EmissionFactor {
  id: string;
  sector: string;
  product: string;
  factor: number;           // tonnes CO2e per unit
  unit: string;             // per tonne, per MWh, per m³, etc.
  source: string;
  methodology: 'ets-benchmark' | 'cbam-default' | 'ipcc-2006' | 'eu-reference' | 'ghg-protocol' | 'eutl';
  year: number;
  /** ISO date when this factor was last verified against the source */
  lastVerified?: string;
}

/**
 * EU ETS benchmark emission factors by product.
 * Used for ETS allowance calculations and free allocation assessment.
 */
export const ETS_EMISSION_FACTORS: EmissionFactor[] = [
  // Iron & Steel
  { id: 'ETS-STEEL-HOT', sector: 'steel', product: 'Hot metal', factor: 1.328, unit: 'tCO2e/t product', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },
  { id: 'ETS-STEEL-EAF', sector: 'steel', product: 'EAF carbon steel', factor: 0.283, unit: 'tCO2e/t product', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },
  { id: 'ETS-STEEL-COKE', sector: 'steel', product: 'Coke', factor: 0.286, unit: 'tCO2e/t coke', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },

  // Cement
  { id: 'ETS-CEMENT-CLINKER', sector: 'cement', product: 'Cement clinker', factor: 0.766, unit: 'tCO2e/t clinker', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },
  { id: 'ETS-CEMENT-GREY', sector: 'cement', product: 'Grey cement', factor: 0.620, unit: 'tCO2e/t cement', source: 'EU average 2023', methodology: 'eu-reference', year: 2024 },

  // Aluminium
  { id: 'ETS-ALUM-PRIMARY', sector: 'aluminium', product: 'Primary aluminium', factor: 1.514, unit: 'tCO2e/t aluminium', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },

  // Chemicals
  { id: 'ETS-CHEM-AMMONIA', sector: 'chemicals', product: 'Ammonia', factor: 1.619, unit: 'tCO2e/t ammonia', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },
  { id: 'ETS-CHEM-NITRIC', sector: 'chemicals', product: 'Nitric acid', factor: 0.302, unit: 'tCO2e/t 100% acid', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },
  { id: 'ETS-CHEM-HYDROGEN', sector: 'chemicals', product: 'Hydrogen', factor: 8.850, unit: 'tCO2e/t H2', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },

  // Power generation
  { id: 'ETS-POWER-COAL', sector: 'energy', product: 'Electricity (coal)', factor: 0.900, unit: 'tCO2e/MWh', source: 'IPCC 2006 coal combustion', methodology: 'ipcc-2006', year: 2024 },
  { id: 'ETS-POWER-GAS', sector: 'energy', product: 'Electricity (natural gas)', factor: 0.370, unit: 'tCO2e/MWh', source: 'IPCC 2006 gas combustion', methodology: 'ipcc-2006', year: 2024 },
  { id: 'ETS-POWER-OIL', sector: 'energy', product: 'Electricity (oil)', factor: 0.650, unit: 'tCO2e/MWh', source: 'IPCC 2006 oil combustion', methodology: 'ipcc-2006', year: 2024 },

  // Fertilizers
  { id: 'ETS-FERT-UREA', sector: 'fertilizers', product: 'Urea', factor: 0.743, unit: 'tCO2e/t urea', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },

  // Refining
  { id: 'ETS-REF-CWT', sector: 'energy', product: 'Refinery CWT', factor: 0.0295, unit: 'tCO2e/CWT', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },

  // Lime — dual-use critical raw material (steel flux, cement feedstock, chemical precursor)
  // Reclassified from 'construction' to 'lime' sector for cross-vertical intelligence (2026-03-30)
  { id: 'ETS-LIME-CALCINATION', sector: 'lime', product: 'Lime (calcination)', factor: 0.954, unit: 'tCO2e/t lime', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024, lastVerified: '2026-03-30' },
  { id: 'ETS-LIME-QUICKLIME', sector: 'lime', product: 'Quicklime (CaO)', factor: 1.092, unit: 'tCO2e/t quicklime', source: 'EU ETS Benchmark 2021-2025 (dolite benchmark)', methodology: 'ets-benchmark', year: 2024, lastVerified: '2026-03-30' },

  // Construction materials (lime retained here for backward compat)
  { id: 'ETS-CONST-LIME', sector: 'construction', product: 'Lime', factor: 0.954, unit: 'tCO2e/t lime', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },
  { id: 'ETS-CONST-BRICK', sector: 'construction', product: 'Bricks', factor: 0.171, unit: 'tCO2e/t bricks', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },
  { id: 'ETS-CONST-GLASS', sector: 'construction', product: 'Float glass', factor: 0.453, unit: 'tCO2e/t glass', source: 'EU ETS Benchmark 2021-2025', methodology: 'ets-benchmark', year: 2024 },
];

/**
 * CBAM product default emission factors.
 * Used when importers lack verified supplier-specific data.
 * Per CBAM Implementing Regulation 2023/1773, Art. 4.
 *
 * STALENESS WARNING: Machine-readable CBAM API planned for 2026 but not live.
 * These values are manually extracted from EUR-Lex PDF. Check quarterly for amendments.
 * Last verified: 2026-03-24 | Regulation version: 2023/1773 | Stale after: 180 days
 * Verify at: https://eur-lex.europa.eu/eli/reg_impl/2023/1773/oj
 */
export const CBAM_DEFAULT_FACTORS: EmissionFactor[] = [
  // CBAM Annex I products
  { id: 'CBAM-STEEL-HOT', sector: 'steel', product: 'Iron and steel (hot-rolled)', factor: 1.852, unit: 'tCO2e/t product', source: 'CBAM transitional default values', methodology: 'cbam-default', year: 2024 },
  { id: 'CBAM-STEEL-COLD', sector: 'steel', product: 'Iron and steel (cold-rolled)', factor: 2.143, unit: 'tCO2e/t product', source: 'CBAM transitional default values', methodology: 'cbam-default', year: 2024 },
  { id: 'CBAM-CEMENT', sector: 'cement', product: 'Cement', factor: 0.680, unit: 'tCO2e/t cement', source: 'CBAM transitional default values', methodology: 'cbam-default', year: 2024 },
  { id: 'CBAM-ALUM', sector: 'aluminium', product: 'Aluminium (unwrought)', factor: 6.700, unit: 'tCO2e/t aluminium', source: 'CBAM transitional default values (direct+indirect)', methodology: 'cbam-default', year: 2024 },
  { id: 'CBAM-FERT-UREA', sector: 'fertilizers', product: 'Urea', factor: 1.295, unit: 'tCO2e/t urea', source: 'CBAM transitional default values', methodology: 'cbam-default', year: 2024 },
  { id: 'CBAM-FERT-NITRATE', sector: 'fertilizers', product: 'Ammonium nitrate', factor: 3.100, unit: 'tCO2e/t product', source: 'CBAM transitional default values', methodology: 'cbam-default', year: 2024 },
  { id: 'CBAM-HYDROGEN', sector: 'hydrogen', product: 'Hydrogen', factor: 9.200, unit: 'tCO2e/t H2', source: 'CBAM transitional default values', methodology: 'cbam-default', year: 2024 },
  { id: 'CBAM-ELECTRICITY', sector: 'energy', product: 'Electricity', factor: 0.450, unit: 'tCO2e/MWh', source: 'CBAM EU average default', methodology: 'cbam-default', year: 2024 },

  // Lime — not yet in CBAM Annex I but flagged for inclusion under CRMA strategic review
  // Using ETS benchmark as proxy until CBAM amendment. Source: EU ETS Benchmark 2021-2025
  { id: 'CBAM-LIME-PROXY', sector: 'lime', product: 'Lime (calcination, ETS proxy)', factor: 0.954, unit: 'tCO2e/t lime', source: 'EU ETS Benchmark (CBAM proxy — lime not yet in Annex I)', methodology: 'ets-benchmark', year: 2024 },
];

/**
 * Look up emission factor for a sector.
 * Returns factors sorted by relevance (sector match first).
 */
export function getFactorsForSector(sector: string, source: 'ets' | 'cbam' | 'all' = 'all'): EmissionFactor[] {
  const normalized = sector.toLowerCase();
  const pool = source === 'ets' ? ETS_EMISSION_FACTORS
    : source === 'cbam' ? CBAM_DEFAULT_FACTORS
    : [...ETS_EMISSION_FACTORS, ...CBAM_DEFAULT_FACTORS];

  return pool.filter((f) => f.sector === normalized);
}

/**
 * Get a specific emission factor by ID.
 */
export function getFactorById(id: string): EmissionFactor | undefined {
  return [...ETS_EMISSION_FACTORS, ...CBAM_DEFAULT_FACTORS].find((f) => f.id === id);
}

/**
 * EU ETS carbon price per tonne CO2 (EUR).
 * Updated periodically — this is the reference price for cost calculations.
 */
export const ETS_CARBON_PRICE_EUR = 65; // EUR/tCO2e (2024 average)

/**
 * CBAM certificate price (tracks ETS auction price).
 * Per CBAM Regulation Art. 21: price = weekly average ETS auction price.
 */
export const CBAM_CERTIFICATE_PRICE_EUR = 65; // EUR/tCO2e (mirrors ETS)

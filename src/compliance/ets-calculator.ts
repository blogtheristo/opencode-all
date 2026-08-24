/**
 * EU ETS Calculator
 *
 * Calculates ETS allowance requirements, free allocation, and compliance costs.
 * Based on EU ETS Phase 4 rules (2021-2030) and Fit for 55 amendments.
 *
 * Formula:
 *   Verified emissions (tCO2e) = Activity data × Emission factor
 *   Surrender obligation = Verified emissions - Free allocation
 *   Cost = Surrender obligation × Carbon price
 */

import {
  type EmissionFactor,
  ETS_CARBON_PRICE_EUR,
  ETS_EMISSION_FACTORS,
  getFactorsForSector,
} from './emission-factors.js';

// ============ TYPES ============

export interface ETSInstallation {
  name: string;
  sector: string;
  activityData: ActivityDataEntry[];
  freeAllocationTonnes?: number;  // Pre-assigned free allowances
}

export interface ActivityDataEntry {
  product: string;
  quantity: number;             // tonnes of product (or MWh for energy)
  emissionFactorId?: string;    // Optional: use specific factor by ID
}

export interface ETSCalculationResult {
  installation: string;
  sector: string;
  totalEmissions: number;       // tonnes CO2e
  freeAllocation: number;       // tonnes CO2e
  surrenderObligation: number;  // tonnes CO2e (what must be purchased)
  estimatedCost: number;        // EUR
  carbonPrice: number;          // EUR/tCO2e used
  emissionBreakdown: EmissionBreakdownEntry[];
  etsPhase: string;
  complianceYear: number;
  exceedsThreshold: boolean;    // > 25,000 tCO2e/year
  freeAllocationReduction: number; // Phase 4 linear reduction factor
}

export interface EmissionBreakdownEntry {
  product: string;
  quantity: number;
  factor: number;
  unit: string;
  emissions: number;           // tonnes CO2e
  factorSource: string;
}

// ============ CONSTANTS ============

/** ETS Phase 4 threshold: installations below this may qualify for simplified monitoring */
const ETS_THRESHOLD_TONNES = 25_000;

/** Linear reduction factor for free allocation (2.2% annual from 2021, increasing to 4.3% from 2026) */
const FREE_ALLOCATION_REDUCTION_2024 = 0.044; // 4.4% for 2026
const FREE_ALLOCATION_BASE_YEAR = 2021;

// ============ CALCULATOR ============

/**
 * Calculate ETS compliance for an installation.
 *
 * @param installation - Installation with activity data
 * @param year - Compliance year (affects free allocation reduction)
 * @param carbonPrice - Override carbon price (defaults to current EU ETS price)
 */
export function calculateETS(
  installation: ETSInstallation,
  year: number = 2026,
  carbonPrice: number = ETS_CARBON_PRICE_EUR,
): ETSCalculationResult {
  const sectorFactors = getFactorsForSector(installation.sector, 'ets');

  const breakdown: EmissionBreakdownEntry[] = [];
  let totalEmissions = 0;

  for (const activity of installation.activityData) {
    const factor = resolveEmissionFactor(activity, sectorFactors);

    const emissions = activity.quantity * factor.factor;
    totalEmissions += emissions;

    breakdown.push({
      product: activity.product,
      quantity: activity.quantity,
      factor: factor.factor,
      unit: factor.unit,
      emissions: Math.round(emissions * 100) / 100,
      factorSource: factor.source,
    });
  }

  totalEmissions = Math.round(totalEmissions * 100) / 100;

  // Calculate free allocation with Phase 4 linear reduction
  const reductionYears = year - FREE_ALLOCATION_BASE_YEAR;
  const reductionFactor = Math.min(1, reductionYears * FREE_ALLOCATION_REDUCTION_2024);
  const baseAllocation = installation.freeAllocationTonnes ?? 0;
  const freeAllocation = Math.round(baseAllocation * (1 - reductionFactor) * 100) / 100;

  const surrenderObligation = Math.max(0, Math.round((totalEmissions - freeAllocation) * 100) / 100);
  const estimatedCost = Math.round(surrenderObligation * carbonPrice * 100) / 100;

  return {
    installation: installation.name,
    sector: installation.sector,
    totalEmissions,
    freeAllocation,
    surrenderObligation,
    estimatedCost,
    carbonPrice,
    emissionBreakdown: breakdown,
    etsPhase: 'Phase 4 (2021-2030)',
    complianceYear: year,
    exceedsThreshold: totalEmissions >= ETS_THRESHOLD_TONNES,
    freeAllocationReduction: Math.round(reductionFactor * 10000) / 100, // percentage
  };
}

/**
 * Resolve the best emission factor for an activity.
 * Priority: specific ID > sector+product match > sector default > generic
 */
function resolveEmissionFactor(
  activity: ActivityDataEntry,
  sectorFactors: EmissionFactor[],
): EmissionFactor {
  // 1. Specific factor by ID
  if (activity.emissionFactorId) {
    const specific = ETS_EMISSION_FACTORS.find((f) => f.id === activity.emissionFactorId);
    if (specific) return specific;
  }

  // 2. Match by product name (case-insensitive substring match)
  const productMatch = sectorFactors.find(
    (f) => f.product.toLowerCase().includes(activity.product.toLowerCase())
      || activity.product.toLowerCase().includes(f.product.toLowerCase()),
  );
  if (productMatch) return productMatch;

  // 3. First factor in sector as fallback
  if (sectorFactors.length > 0) return sectorFactors[0];

  // 4. Generic fallback — conservative estimate
  return {
    id: 'GENERIC-FALLBACK',
    sector: 'unknown',
    product: activity.product,
    factor: 1.0,
    unit: 'tCO2e/t product',
    source: 'Generic fallback (no sector-specific factor available)',
    methodology: 'eu-reference',
    year: 2024,
  };
}

/**
 * Estimate annual ETS cost for a sector with known emissions.
 * Quick calculation without detailed activity breakdown.
 */
export function estimateETSCost(
  annualEmissionsTonnes: number,
  freeAllocationTonnes: number = 0,
  carbonPrice: number = ETS_CARBON_PRICE_EUR,
): { surrenderObligation: number; estimatedCost: number } {
  const surrenderObligation = Math.max(0, annualEmissionsTonnes - freeAllocationTonnes);
  return {
    surrenderObligation: Math.round(surrenderObligation * 100) / 100,
    estimatedCost: Math.round(surrenderObligation * carbonPrice * 100) / 100,
  };
}

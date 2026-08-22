/**
 * BESS Compliance Cost Calculator
 *
 * Calculates compliance costs for Battery Energy Storage Systems (BESS):
 * - Scope 2 carbon cost from charging (grid emission factor × MWh charged)
 * - Roundtrip efficiency loss → additional Scope 2 carbon cost
 * - ETS allowance cost for co-located generation assets
 * - Battery degradation → CSRD asset impairment disclosure
 * - Avoided emissions → EU Taxonomy substantial contribution evidence
 *
 * Designed to consume Q-System (Qantic) dispatch schedule JSON.
 *
 * Sources:
 * - EU ETS Phase 4 (Reg. 2021/447) — carbon pricing
 * - CSRD/ESRS E1-5, E1-6 — energy & GHG disclosure
 * - EU Taxonomy Climate Delegated Act — substantial contribution criteria
 * - Qantic white paper: roundtrip efficiency 90.25% (9.75% loss)
 */

import { ETS_CARBON_PRICE_EUR } from './emission-factors.js';

// ============ TYPES ============

/** Single hour dispatch entry from Q-System */
export interface DispatchEntry {
  /** ISO 8601 timestamp */
  timestamp: string;
  /** MWh charged from grid (positive = charging) */
  chargedMwh: number;
  /** MWh discharged to grid/market (positive = discharging) */
  dischargedMwh: number;
  /** Revenue market: 'fcr' | 'afrr' | 'mfrr' | 'day-ahead' | 'intraday' | 'idle' */
  market: string;
  /** Grid emission factor for this hour (gCO2/kWh). Source: ENTSO-E or national TSO */
  gridEmissionFactor: number;
}

/** Battery installation specification */
export interface BatterySpec {
  /** Nameplate power capacity (MW) */
  powerMw: number;
  /** Nameplate energy capacity (MWh) */
  energyMwh: number;
  /** Roundtrip efficiency (0-1, e.g. 0.9025 = 90.25%) */
  roundtripEfficiency: number;
  /** Annual capacity degradation rate (0-1, e.g. 0.02 = 2%/year) */
  annualDegradationRate: number;
  /** Installation year */
  installationYear: number;
  /** Capital cost (EUR) — for impairment calculations */
  capitalCostEur: number;
  /** Expected useful life in years */
  usefulLifeYears: number;
  /** Country code (ISO 3166-1 alpha-2) for grid factor defaults */
  country: string;
}

/** Data center facility specification (optional — for PUE + facility Scope 2) */
export interface DataCenterFacility {
  /** Total IT load (MW) */
  itLoadMw: number;
  /** Total facility power draw (MW) — includes cooling, lighting, etc. */
  totalFacilityPowerMw: number;
  /** Annual facility energy consumption (MWh) — for CSRD full Scope 2 */
  annualFacilityMwh: number;
  /** Facility name (for reporting) */
  name?: string;
}

/** Full BESS compliance assessment input */
export interface BESSComplianceInput {
  /** Q-System dispatch schedule (hourly entries) */
  dispatch: DispatchEntry[];
  /** Battery installation specification */
  battery: BatterySpec;
  /** Assessment year */
  year: number;
  /** ETS carbon price override (EUR/tCO2e). Defaults to current EU ETS price */
  carbonPriceEur?: number;
  /** Whether co-located generation asset is ETS-covered */
  colocatedEtsCovered?: boolean;
  /** Data center facility — enables PUE check and facility-level Scope 2 */
  facility?: DataCenterFacility;
}

/** Compliance cost breakdown returned to Q-System */
export interface BESSComplianceCost {
  /** Total annual compliance cost (EUR) */
  totalCostEur: number;
  /** Scope 2 carbon cost from grid charging (EUR) */
  scope2ChargingCostEur: number;
  /** Additional Scope 2 cost from roundtrip efficiency loss (EUR) */
  roundtripLossCostEur: number;
  /** ETS allowance cost for co-located generation (EUR) */
  etsColocatedCostEur: number;
  /** Estimated CSRD reporting cost (EUR) — based on disclosure complexity */
  csrdReportingCostEur: number;
  /** EU Taxonomy certification cost estimate (EUR) */
  taxonomyCertificationCostEur: number;

  /** Emissions breakdown */
  emissions: {
    /** Total Scope 2 emissions from charging (tCO2e) */
    scope2TotalTonnes: number;
    /** Emissions from roundtrip efficiency loss (tCO2e) */
    roundtripLossTonnes: number;
    /** Avoided emissions from displacing fossil generation (tCO2e) */
    avoidedEmissionsTonnes: number;
    /** Net emissions position (tCO2e) — negative = net carbon benefit */
    netEmissionsTonnes: number;
    /** Weighted average grid emission factor (gCO2/kWh) */
    weightedGridFactor: number;
  };

  /** Battery lifecycle metrics for CSRD disclosure */
  lifecycle: {
    /** Current capacity as % of nameplate */
    currentCapacityPct: number;
    /** Estimated remaining useful life (years) */
    remainingLifeYears: number;
    /** Asset impairment amount (EUR) — degradation-driven */
    impairmentEur: number;
    /** Estimated replacement capex year */
    replacementYear: number;
    /** Annual straight-line depreciation (EUR) */
    annualDepreciationEur: number;
  };

  /** EU Taxonomy alignment assessment */
  taxonomy: {
    /** Does the BESS contribute to climate change mitigation? */
    substantialContribution: boolean;
    /** Avoided emissions evidence (tCO2e) */
    avoidedEmissionsEvidence: number;
    /** Does no significant harm (DNSH) to other objectives? */
    dnshAssessment: string;
    /** Taxonomy-eligible activity code */
    activityCode: string;
  };

  /** ETS-covered market hours breakdown */
  etsMarketHours: {
    /** Total dispatch hours */
    totalHours: number;
    /** Hours in ETS-covered markets (day-ahead, intraday) */
    etsCoveredHours: number;
    /** Revenue from ETS-covered markets (informational) */
    etsCoveredPct: number;
  };

  /** Data center PUE assessment (present when facility input provided) */
  dataCenter?: {
    /** Power Usage Effectiveness = totalFacilityPower / itLoad */
    pue: number;
    /** EU Taxonomy 8.1 threshold: PUE < 1.5. Binary pass/fail */
    taxonomyCompliant: boolean;
    /** Facility-level Scope 2 emissions (tCO2e) — full site, not just BESS */
    facilityScope2Tonnes: number;
    /** Facility-level Scope 2 carbon cost (EUR) */
    facilityScope2CostEur: number;
    /** BESS share of total facility consumption (%) */
    bessSharePct: number;
    /** Warning message if PUE exceeds threshold */
    warning?: string;
  };

  /** Carbon price used (EUR/tCO2e) */
  carbonPriceEur: number;
  /** Assessment year */
  year: number;
  /** Calculation timestamp */
  calculatedAt: string;
}

// ============ DEFAULT GRID EMISSION FACTORS ============

/** Country-level average grid emission factors (gCO2/kWh).
 * Source: EEA GHG Inventory 2024 + national energy agencies */
const DEFAULT_GRID_FACTORS: Record<string, number> = {
  FI: 68,    // Finland — high nuclear + hydro + wind
  SE: 36,    // Sweden — hydro + nuclear
  NO: 19,    // Norway — hydro dominated
  DK: 130,   // Denmark — wind + gas backup
  DE: 385,   // Germany — coal phase-out in progress
  FR: 55,    // France — nuclear dominated
  NL: 340,   // Netherlands — gas heavy
  PL: 650,   // Poland — coal dominated
  ES: 170,   // Spain — solar + wind + gas
  IT: 260,   // Italy — gas + renewables
  AT: 90,    // Austria — hydro dominated
  BE: 155,   // Belgium — nuclear + gas
  PT: 180,   // Portugal — renewables growing
  GR: 310,   // Greece — lignite phase-out
  IE: 300,   // Ireland — gas + wind
  EE: 550,   // Estonia — oil shale
  LT: 120,   // Lithuania — mixed
  LV: 95,    // Latvia — hydro
  EU: 230,   // EU-27 average
};

// ============ CONSTANTS ============

/** CSRD reporting cost estimate per BESS asset (EUR).
 * Source: EFRAG CSRD implementation survey 2024 — SME reporting cost range */
const CSRD_REPORTING_COST_BASE_EUR = 12_000;

/** EU Taxonomy third-party verification cost (EUR).
 * Source: EU Platform on Sustainable Finance 2024 report */
const TAXONOMY_CERTIFICATION_COST_EUR = 4_200;

/** ETS-covered electricity markets (wholesale spot) */
const ETS_COVERED_MARKETS = ['day-ahead', 'intraday'];

/** EU Taxonomy activity code for electricity storage */
const TAXONOMY_ACTIVITY_CODE = '4.10';

/** Marginal generation emission factor multiplier.
 * BESS discharges during peak demand when marginal plants (gas CCGT, coal) run.
 * Peak-hour marginal factors are typically 1.5–2.2× the average grid factor.
 * Source: ENTSO-E Transparency Platform marginal vs average analysis (2023–2024).
 * Using 1.8× as conservative mid-range estimate. */
const MARGINAL_FACTOR_MULTIPLIER = 1.8;

/** EU Taxonomy 8.1 PUE threshold for data centres.
 * Source: EU Taxonomy Climate Delegated Act, Annex I, Activity 8.1
 * "Data processing, hosting and related activities" — PUE < 1.5 required */
const EU_TAXONOMY_PUE_THRESHOLD = 1.5;

// ============ CALCULATOR ============

/**
 * Calculate BESS compliance costs from Q-System dispatch data.
 *
 * This is the core product function — deterministic, testable, no LLM dependency.
 * Returns EUR cost breakdown that Q-System displays as a line item.
 */
export function calculateBESSCompliance(input: BESSComplianceInput): BESSComplianceCost {
  const carbonPrice = input.carbonPriceEur ?? ETS_CARBON_PRICE_EUR;
  const { dispatch, battery, year } = input;

  // ---- Scope 2: Charging emissions ----
  let totalChargedMwh = 0;
  let weightedEmissions = 0; // gCO2 total
  let etsCoveredHours = 0;

  let dischargeWeightedEmissions = 0; // gCO2 total for discharge hours

  for (const entry of dispatch) {
    if (entry.chargedMwh > 0) {
      totalChargedMwh += entry.chargedMwh;
      // gCO2/kWh × 1000 kWh/MWh = gCO2/MWh
      weightedEmissions += entry.chargedMwh * entry.gridEmissionFactor * 1000;
    }
    if (entry.dischargedMwh > 0) {
      // Track grid factor at time of discharge — this is the marginal generation displaced
      dischargeWeightedEmissions += entry.dischargedMwh * entry.gridEmissionFactor * 1000;
    }
    if (ETS_COVERED_MARKETS.includes(entry.market) && entry.dischargedMwh > 0) {
      etsCoveredHours++;
    }
  }

  // Convert gCO2 to tCO2e (÷ 1,000,000)
  const scope2TotalTonnes = weightedEmissions / 1_000_000;
  const weightedGridFactor = totalChargedMwh > 0
    ? weightedEmissions / (totalChargedMwh * 1000)
    : getDefaultGridFactor(battery.country);

  // Scope 2 carbon cost
  const scope2ChargingCostEur = round2(scope2TotalTonnes * carbonPrice);

  // ---- Roundtrip efficiency loss ----
  const roundtripLossMwh = totalChargedMwh * (1 - battery.roundtripEfficiency);
  const roundtripLossTonnes = (roundtripLossMwh * weightedGridFactor * 1000) / 1_000_000;
  const roundtripLossCostEur = round2(roundtripLossTonnes * carbonPrice);

  // ---- Avoided emissions ----
  // Discharged MWh displaces marginal grid generation at the time of discharge.
  // BESS charges when grid is clean (low-price renewables) and discharges when grid
  // is dirty (fossil peak). Use the discharge-hour grid factors, not charge-hour average.
  // Source: EU Taxonomy Climate Delegated Act, Activity 4.10 — substantial contribution
  // requires evidence that storage reduces lifecycle GHG emissions.
  const avoidedEmissionsTonnes = dischargeWeightedEmissions / 1_000_000;
  const netEmissionsTonnes = round2(scope2TotalTonnes + roundtripLossTonnes - avoidedEmissionsTonnes);

  // ---- ETS co-located cost ----
  const etsColocatedCostEur = input.colocatedEtsCovered
    ? round2(scope2TotalTonnes * carbonPrice * (etsCoveredHours / Math.max(dispatch.length, 1)))
    : 0;

  // ---- Battery lifecycle (CSRD E1-5 asset disclosure) ----
  const assetAge = year - battery.installationYear;
  const currentCapacityPct = Math.max(0, 100 * Math.pow(1 - battery.annualDegradationRate, assetAge));
  const remainingLifeYears = Math.max(0, battery.usefulLifeYears - assetAge);
  const annualDepreciationEur = round2(battery.capitalCostEur / battery.usefulLifeYears);
  // Impairment = max(0, carrying_value - fair_value)
  // Carrying value = capitalCost - accumulated depreciation
  // Fair value = capitalCost × remaining capacity fraction (capacity-adjusted)
  const carryingValue = battery.capitalCostEur - (annualDepreciationEur * assetAge);
  const fairValue = battery.capitalCostEur * (currentCapacityPct / 100);
  const impairmentEur = round2(Math.max(0, carryingValue - fairValue));
  const replacementYear = battery.installationYear + battery.usefulLifeYears;

  // ---- EU Taxonomy ----
  const substantialContribution = avoidedEmissionsTonnes > scope2TotalTonnes;
  const dnshAssessment = substantialContribution
    ? 'BESS net-positive: avoided emissions exceed charging emissions'
    : 'BESS net-negative: charging emissions exceed avoided emissions — review grid mix';

  // ---- Data center PUE + facility Scope 2 (optional) ----
  let dataCenterResult: BESSComplianceCost['dataCenter'] | undefined;
  let facilityScope2CostEur = 0;
  if (input.facility) {
    const f = input.facility;
    const pue = f.itLoadMw > 0 ? round2(f.totalFacilityPowerMw / f.itLoadMw) : 0;
    // EU Taxonomy 8.1 "Data processing, hosting and related activities": PUE < 1.5
    const taxonomyCompliant = pue > 0 && pue < EU_TAXONOMY_PUE_THRESHOLD;
    const facilityGridFactor = weightedGridFactor > 0 ? weightedGridFactor : getDefaultGridFactor(battery.country);
    const facilityScope2Tonnes = round2((f.annualFacilityMwh * facilityGridFactor * 1000) / 1_000_000);
    facilityScope2CostEur = round2(facilityScope2Tonnes * carbonPrice);
    const bessAnnualMwh = totalChargedMwh; // Simplification: one day × 365 would be annual
    const bessSharePct = f.annualFacilityMwh > 0
      ? round2((bessAnnualMwh / f.annualFacilityMwh) * 100)
      : 0;

    dataCenterResult = {
      pue,
      taxonomyCompliant,
      facilityScope2Tonnes,
      facilityScope2CostEur,
      bessSharePct,
      ...(pue >= EU_TAXONOMY_PUE_THRESHOLD && pue > 0 ? {
        warning: `PUE ${pue} exceeds EU Taxonomy 8.1 threshold (${EU_TAXONOMY_PUE_THRESHOLD}). Green financing classification BLOCKED until PUE improved.`,
      } : {}),
    };
  }

  // ---- Total cost ----
  const totalCostEur = round2(
    scope2ChargingCostEur +
    roundtripLossCostEur +
    etsColocatedCostEur +
    facilityScope2CostEur +
    CSRD_REPORTING_COST_BASE_EUR +
    TAXONOMY_CERTIFICATION_COST_EUR,
  );

  return {
    totalCostEur,
    scope2ChargingCostEur,
    roundtripLossCostEur,
    etsColocatedCostEur,
    csrdReportingCostEur: CSRD_REPORTING_COST_BASE_EUR,
    taxonomyCertificationCostEur: TAXONOMY_CERTIFICATION_COST_EUR,
    emissions: {
      scope2TotalTonnes: round2(scope2TotalTonnes),
      roundtripLossTonnes: round2(roundtripLossTonnes),
      avoidedEmissionsTonnes: round2(avoidedEmissionsTonnes),
      netEmissionsTonnes,
      weightedGridFactor: round2(weightedGridFactor),
    },
    lifecycle: {
      currentCapacityPct: round2(currentCapacityPct),
      remainingLifeYears,
      impairmentEur: Math.max(0, impairmentEur),
      replacementYear,
      annualDepreciationEur,
    },
    taxonomy: {
      substantialContribution,
      avoidedEmissionsEvidence: round2(avoidedEmissionsTonnes),
      dnshAssessment,
      activityCode: TAXONOMY_ACTIVITY_CODE,
    },
    etsMarketHours: {
      totalHours: dispatch.length,
      etsCoveredHours,
      etsCoveredPct: dispatch.length > 0
        ? round2((etsCoveredHours / dispatch.length) * 100)
        : 0,
    },
    ...(dataCenterResult ? { dataCenter: dataCenterResult } : {}),
    carbonPriceEur: carbonPrice,
    year,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Quick compliance cost estimate without full dispatch data.
 * For pre-sales / indicative pricing before Q-System integration.
 */
export function estimateBESSComplianceCost(
  energyMwh: number,
  country: string,
  roundtripEfficiency: number = 0.9025,
  carbonPriceEur: number = ETS_CARBON_PRICE_EUR,
): { estimatedAnnualCostEur: number; scope2Tonnes: number; taxonomyEligible: boolean; breakdown: string } {
  const gridFactor = getDefaultGridFactor(country);
  const chargedMwh = energyMwh / roundtripEfficiency; // MWh drawn from grid
  const scope2Tonnes = (chargedMwh * gridFactor * 1000) / 1_000_000;
  const carbonCost = round2(scope2Tonnes * carbonPriceEur);
  const totalCost = round2(carbonCost + CSRD_REPORTING_COST_BASE_EUR + TAXONOMY_CERTIFICATION_COST_EUR);

  // BESS typically charges at off-peak (clean grid) and discharges at peak (dirty grid).
  // Marginal generation displaced at peak is ~1.8× average grid factor.
  // Source: ENTSO-E marginal vs average analysis; conservative multiplier.
  const marginalFactor = gridFactor * MARGINAL_FACTOR_MULTIPLIER;
  const avoidedTonnes = (energyMwh * marginalFactor * 1000) / 1_000_000;
  const taxonomyEligible = avoidedTonnes > scope2Tonnes;

  return {
    estimatedAnnualCostEur: totalCost,
    scope2Tonnes: round2(scope2Tonnes),
    taxonomyEligible,
    breakdown: `Carbon: €${carbonCost} + CSRD: €${CSRD_REPORTING_COST_BASE_EUR} + Taxonomy: €${TAXONOMY_CERTIFICATION_COST_EUR}`,
  };
}

/**
 * Get default grid emission factor for a country.
 */
export function getDefaultGridFactor(country: string): number {
  return DEFAULT_GRID_FACTORS[country.toUpperCase()] ?? DEFAULT_GRID_FACTORS['EU'];
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Energy Industry EU Compliance Module
 *
 * Specialized compliance scoring for the EU energy sector, covering:
 * - EU ETS Phase 4 (power generation, district heating, refineries)
 * - CBAM electricity imports
 * - CSRD/ESRS for energy companies (E1 climate, E1-6 GHG emissions)
 * - Fit for 55 decarbonisation pathway
 * - EU Energy Digitalisation Roadmap (Strategic Roadmap on AI in Energy, Q1 2026)
 * - RED III (Renewable Energy Directive recast)
 * - Energy Efficiency Directive (EED) recast
 * - Data Centre Energy Efficiency Package (Q1 2026)
 *
 * Sources:
 * - EU ETS Directive 2003/87/EC (amended by Dir. 2023/959)
 * - CBAM Regulation (EU) 2023/956
 * - CSRD Directive 2022/2464
 * - Renewable Energy Directive (EU) 2023/2413 (RED III)
 * - Energy Efficiency Directive (EU) 2023/1791 (EED recast)
 * - EC Strategic Roadmap on Digitalisation and AI in Energy Sector (2026)
 * - EC Affordable Energy Action Plan (Feb 2025), Action 5
 * - Eurostat energy statistics, Eurelectric data
 *
 * Code-Version: 1.0
 * Introduced-In: PR-energy-industry-eu
 * Branch: claude/energy-industry-eu-PmpKC
 * Date: 2026-04-03
 * Owner: Lifetime Oy
 */

import { ETS_CARBON_PRICE_EUR } from './emission-factors.js';
import { calculateETS, type ETSCalculationResult, type ETSInstallation } from './ets-calculator.js';
import { getBenchmark, type SectorBenchmark } from './eu-benchmarks.js';
import {
  type ComplianceScoringInput,
  scoreCompliance,
  type ScoringResult,
} from './scoring-engine.js';

// ============ TYPES ============

export type EnergySubSector =
  | 'power-generation'
  | 'district-heating'
  | 'refining'
  | 'gas-distribution'
  | 'electricity-grid'
  | 'renewable-energy'
  | 'data-centres';

export interface EnergyCompanyProfile {
  name: string;
  subSector: EnergySubSector;
  /** Annual electricity generation or throughput (MWh) */
  annualOutputMwh: number;
  /** Fuel mix as percentages — must sum to ~100 */
  fuelMix: FuelMixEntry[];
  /** Annual CO2e emissions (tonnes) — if known, overrides calculated */
  reportedEmissions?: number;
  /** Annual import value of CBAM-affected goods (EUR) */
  importValueEur: number;
  /** Number of employees (CSRD scope) */
  employees: number;
  /** Annual revenue (EUR) */
  revenueEur: number;
  /** Data points reported for ESRS */
  esrsDataPoints: { disclosureId: string; provided: boolean }[];
  /** Compliance measures in place */
  measures: {
    hasTransitionPlan: boolean;
    hasEmissionsMonitoring: boolean;
    hasSupplyChainDD: boolean;
    hasDigitalisationStrategy: boolean;
    hasGridFlexibility: boolean;
    hasEnergyStoragePlan: boolean;
  };
}

export interface FuelMixEntry {
  fuel: FuelType;
  percentage: number;
}

export type FuelType =
  | 'coal'
  | 'natural-gas'
  | 'oil'
  | 'nuclear'
  | 'wind'
  | 'solar'
  | 'hydro'
  | 'biomass'
  | 'geothermal'
  | 'hydrogen';

export interface EnergyComplianceResult {
  company: string;
  subSector: EnergySubSector;
  /** Calculated emissions from fuel mix (tonnes CO2e) */
  calculatedEmissions: number;
  /** Renewable share (%) */
  renewableShare: number;
  /** RED III target gap (percentage points below 42.5% target) */
  redIIIGap: number;
  /** ETS calculation result */
  etsResult: ETSCalculationResult;
  /** Full compliance scoring */
  complianceScore: ScoringResult;
  /** Energy-sector-specific risks and opportunities */
  sectorAnalysis: EnergySectorAnalysis;
  /** Benchmark comparison */
  benchmark: SectorBenchmark;
}

export interface EnergySectorAnalysis {
  /** Is this company subject to EU Energy Digitalisation Roadmap? */
  digitalisationRoadmapScope: boolean;
  /** ETS2 exposure (buildings/transport fuel supplier) */
  ets2Exposure: boolean;
  /** Grid flexibility readiness (demand-side response) */
  gridFlexibilityReady: boolean;
  /** Data centre energy efficiency applicability */
  dataCentreRegulationScope: boolean;
  /** Stranded asset risk (fossil fuel assets) */
  strandedAssetRiskLevel: 'high' | 'medium' | 'low';
  /** Estimated annual carbon cost (EUR) */
  annualCarbonCostEur: number;
  /** Key regulatory risks */
  risks: string[];
  /** Key opportunities from EU energy transition */
  opportunities: string[];
}

// ============ FUEL EMISSION FACTORS ============

/**
 * Emission factors per fuel type for electricity generation (tCO2e/MWh).
 * Sources: IPCC 2006 Guidelines, EEA GHG Inventory 2024
 */
const FUEL_EMISSION_FACTORS: Record<FuelType, number> = {
  coal: 0.9, // Source: IPCC 2006 hard coal combustion
  'natural-gas': 0.37, // Source: IPCC 2006 natural gas combined cycle
  oil: 0.65, // Source: IPCC 2006 fuel oil combustion
  nuclear: 0.012, // Source: IPCC lifecycle (construction+fuel cycle)
  wind: 0.011, // Source: IPCC lifecycle (manufacturing+installation)
  solar: 0.045, // Source: IPCC lifecycle (panel manufacturing)
  hydro: 0.024, // Source: IPCC lifecycle (dam construction)
  biomass: 0.23, // Source: IPCC 2006 (sustainable biomass, net)
  geothermal: 0.038, // Source: IPCC lifecycle
  hydrogen: 0.0, // Source: zero direct emissions (upstream in H2 production)
};

/** Renewable fuel types per RED III Art. 2(1) */
const RENEWABLE_FUELS: FuelType[] = ['wind', 'solar', 'hydro', 'biomass', 'geothermal'];

/** RED III 2030 target: 42.5% renewable share (binding) with 45% aspiration */
const RED_III_TARGET_2030 = 42.5; // Source: Dir. (EU) 2023/2413, Art. 3(1)

// ============ CALCULATOR ============

/**
 * Run full energy industry compliance assessment.
 * Combines ETS calculation, CSRD scoring, and energy-specific analysis.
 */
export function assessEnergyCompliance(profile: EnergyCompanyProfile): EnergyComplianceResult {
  // 1. Calculate emissions from fuel mix
  const calculatedEmissions = calculateFuelMixEmissions(profile.annualOutputMwh, profile.fuelMix);
  const effectiveEmissions = profile.reportedEmissions ?? calculatedEmissions;

  // 2. Calculate renewable share
  const renewableShare = profile.fuelMix
    .filter((f) => RENEWABLE_FUELS.includes(f.fuel))
    .reduce((sum, f) => sum + f.percentage, 0);

  const redIIIGap = Math.max(0, RED_III_TARGET_2030 - renewableShare);

  // 3. ETS calculation
  const etsInstallation: ETSInstallation = {
    name: profile.name,
    sector: 'energy',
    activityData: profile.fuelMix
      .filter((f) => !RENEWABLE_FUELS.includes(f.fuel) && f.fuel !== 'nuclear')
      .map((f) => ({
        product: `Electricity (${f.fuel})`,
        quantity: profile.annualOutputMwh * (f.percentage / 100),
      })),
    freeAllocationTonnes: 0, // Energy sector: zero free allocation since 2013
  };
  const etsResult = calculateETS(etsInstallation, 2026);

  // 4. Full compliance scoring
  const scoringInput: ComplianceScoringInput = {
    industry: 'energy',
    dataPoints: profile.esrsDataPoints,
    annualEmissions: effectiveEmissions,
    importValue: profile.importValueEur,
    hasTransitionPlan: profile.measures.hasTransitionPlan,
    hasEmissionsMonitoring: profile.measures.hasEmissionsMonitoring,
    hasSupplyChainDD: profile.measures.hasSupplyChainDD,
  };
  const complianceScore = scoreCompliance(scoringInput);

  // 5. Energy-specific sector analysis
  const sectorAnalysis = analyzeEnergySector(profile, effectiveEmissions, renewableShare);

  // 6. Benchmark
  const benchmark = getBenchmark('energy');

  return {
    company: profile.name,
    subSector: profile.subSector,
    calculatedEmissions: Math.round(calculatedEmissions * 100) / 100,
    renewableShare: Math.round(renewableShare * 10) / 10,
    redIIIGap: Math.round(redIIIGap * 10) / 10,
    etsResult,
    complianceScore,
    sectorAnalysis,
    benchmark,
  };
}

/**
 * Calculate total emissions from a fuel mix and annual output.
 */
export function calculateFuelMixEmissions(annualMwh: number, fuelMix: FuelMixEntry[]): number {
  let total = 0;
  for (const entry of fuelMix) {
    const mwh = annualMwh * (entry.percentage / 100);
    const factor = FUEL_EMISSION_FACTORS[entry.fuel] ?? 0;
    total += mwh * factor;
  }
  return Math.round(total * 100) / 100;
}

/**
 * Analyze energy-sector-specific risks and opportunities.
 */
function analyzeEnergySector(
  profile: EnergyCompanyProfile,
  emissions: number,
  renewableShare: number,
): EnergySectorAnalysis {
  const fossilShare = profile.fuelMix
    .filter((f) => ['coal', 'natural-gas', 'oil'].includes(f.fuel))
    .reduce((sum, f) => sum + f.percentage, 0);

  const strandedAssetRiskLevel: EnergySectorAnalysis['strandedAssetRiskLevel'] =
    fossilShare > 60 ? 'high' : fossilShare > 30 ? 'medium' : 'low';

  const annualCarbonCostEur = Math.round(emissions * ETS_CARBON_PRICE_EUR * 100) / 100;

  const risks: string[] = [];
  const opportunities: string[] = [];

  // Risks
  if (fossilShare > 50) {
    risks.push(
      `High fossil fuel dependency (${fossilShare}%) — stranded asset risk under Fit for 55 pathway`,
    );
  }
  if (emissions > 100_000) {
    risks.push(
      `Annual ETS cost exposure: EUR ${(annualCarbonCostEur / 1_000_000).toFixed(1)}M at current carbon price`,
    );
  }
  if (renewableShare < RED_III_TARGET_2030) {
    risks.push(
      `Below RED III 2030 target: ${renewableShare.toFixed(1)}% vs ${RED_III_TARGET_2030}% — gap of ${(RED_III_TARGET_2030 - renewableShare).toFixed(1)} pp`,
    );
  }
  if (!profile.measures.hasDigitalisationStrategy) {
    risks.push(
      'No digitalisation strategy — EU Strategic Roadmap on AI in Energy requires digital readiness (Action Plan Action 5)',
    );
  }
  if (profile.subSector === 'data-centres' && emissions > 5_000) {
    risks.push(
      'Subject to Data Centre Energy Efficiency Package (Q1 2026) — carbon-neutral data centres by 2030 target',
    );
  }
  if (!profile.measures.hasTransitionPlan) {
    risks.push(
      'Missing climate transition plan — CSRD E1-1 mandatory disclosure for energy sector',
    );
  }

  // Opportunities
  if (renewableShare > 30) {
    opportunities.push(
      'Strong renewable base — position for EU Taxonomy-aligned green financing (Activity 4.1-4.3)',
    );
  }
  if (profile.measures.hasGridFlexibility) {
    opportunities.push(
      'Grid flexibility ready — demand-side response monetisation under electricity market reform',
    );
  }
  if (profile.measures.hasEnergyStoragePlan) {
    opportunities.push(
      'Energy storage deployment — supports grid balancing and qualifies for Taxonomy Activity 4.10',
    );
  }
  if (profile.measures.hasDigitalisationStrategy) {
    opportunities.push(
      'Digital-ready — positioned for EU AI in Energy Roadmap opportunities (grid optimisation, predictive maintenance)',
    );
  }
  opportunities.push(
    'EU Electrification Strategy (Q1 2026) creates demand for clean power — growth opportunity',
  );
  if (fossilShare < 30) {
    opportunities.push(
      'Low fossil share qualifies for green bond framework under EU Green Bond Standard',
    );
  }

  return {
    digitalisationRoadmapScope: true, // All energy companies in scope
    ets2Exposure:
      profile.subSector === 'district-heating' || profile.subSector === 'gas-distribution',
    gridFlexibilityReady: profile.measures.hasGridFlexibility,
    dataCentreRegulationScope: profile.subSector === 'data-centres',
    strandedAssetRiskLevel,
    annualCarbonCostEur,
    risks,
    opportunities,
  };
}

/**
 * Get energy-sector emission factors for a specific fuel type.
 */
export function getEnergyEmissionFactor(fuel: FuelType): number {
  return FUEL_EMISSION_FACTORS[fuel] ?? 0;
}

/**
 * Check RED III compliance for an energy company's renewable share.
 */
export function checkRedIIICompliance(renewableShare: number): {
  compliant: boolean;
  gap: number;
  target: number;
  status: string;
} {
  const gap = Math.max(0, RED_III_TARGET_2030 - renewableShare);
  return {
    compliant: renewableShare >= RED_III_TARGET_2030,
    gap: Math.round(gap * 10) / 10,
    target: RED_III_TARGET_2030,
    status:
      renewableShare >= RED_III_TARGET_2030
        ? 'Meets RED III 2030 binding target'
        : renewableShare >= 35
          ? 'Approaching target — on track with current trajectory'
          : renewableShare >= 20
            ? 'Below target — accelerated renewable deployment needed'
            : 'Significantly below target — urgent transition plan required',
  };
}

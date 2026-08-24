/**
 * Construction Compliance Calculator — EN 15978 Lifecycle Assessment
 *
 * Inspired by NCC Building Nordics multi-jurisdiction compliance requirements.
 * Calculates embodied carbon per building using EN 15978 lifecycle stages (A1–D),
 * with material-level granularity and country-specific emission factors.
 *
 * Supports:
 * - CSRD (Dir. 2022/2464) — corporate-level Scope 1/2/3
 * - EPBD Recast (Dir. 2024/1275) — building-level embodied carbon
 * - Fit for 55 / ETS2 (Dir. 2023/959) — buildings sector carbon pricing
 * - EU Taxonomy — CapEx/OpEx alignment per substantial contribution
 *
 * Code-Version: 1.0
 * Date: 2026-04-02
 * Owner: Lifetime Oy
 */

// ============ TYPES ============

/** EN 15978 lifecycle stages */
export type LifecycleStage =
  | 'A1-A3'   // Product stage (raw material, transport, manufacturing)
  | 'A4'      // Transport to site
  | 'A5'      // Construction / installation
  | 'B1-B7'   // Use phase (maintenance, repair, replacement, energy)
  | 'C1-C4'   // End-of-life (demolition, transport, waste, disposal)
  | 'D';      // Reuse / recovery / recycling potential (beyond system boundary)

export interface MaterialEntry {
  name: string;
  category: 'concrete' | 'steel' | 'timber' | 'insulation' | 'aluminium' | 'glass' | 'brick' | 'other';
  quantity: number;       // tonnes (or m³ for concrete, m² for insulation)
  unit: 'tonnes' | 'm3' | 'm2';
  /** kgCO2e per declared unit — from supplier EPD (EN 15804+A2) or generic factor */
  emissionFactor: number;
  factorSource: 'epd' | 'generic' | 'co2data.fi' | 'epd-norge' | 'dansk-beton';
  /** Optional: EPD programme operator and validity */
  epdReference?: string;
}

export interface TransportEntry {
  description: string;
  distanceKm: number;
  mode: 'truck' | 'rail' | 'ship' | 'electric-truck';
  tonnage: number;
}

export interface SiteEnergyEntry {
  type: 'diesel' | 'electricity' | 'lpg' | 'district-heat';
  quantity: number;
  unit: 'litres' | 'kWh' | 'MWh';
}

export type JurisdictionCode = 'NO' | 'DK' | 'FI' | 'SE' | 'EU';

export interface BuildingProject {
  projectId: string;
  name: string;
  jurisdiction: JurisdictionCode;
  buildingType: 'residential' | 'commercial' | 'industrial' | 'mixed';
  grossFloorArea: number;    // m²
  heatedArea?: number;       // m² (for EPBD)
  materials: MaterialEntry[];
  transport: TransportEntry[];
  siteEnergy: SiteEnergyEntry[];
  /** Estimated use-phase annual energy kWh (for B6 operational energy) */
  annualOperationalEnergy?: number;
  /** Design lifetime in years (default 50) */
  designLifetime?: number;
  /** Whether project has BIM/IFC model with material quantities */
  hasBimModel?: boolean;
  /** ERP source system */
  erpSystem?: 'visma' | 'ifs-cloud' | 'dynamics-365' | 'other';
}

export interface LifecycleStageResult {
  stage: LifecycleStage;
  label: string;
  kgCO2e: number;
  kgCO2ePerM2: number;
  percentage: number;         // % of total embodied carbon
  materialBreakdown?: MaterialCarbonBreakdown[];
}

export interface MaterialCarbonBreakdown {
  name: string;
  category: string;
  kgCO2e: number;
  percentage: number;
}

export interface EPBDResult {
  /** Total embodied carbon (A1-C4) in kgCO2e */
  embodiedCarbonKgCO2e: number;
  /** Embodied carbon per m² in kgCO2e/m² */
  embodiedCarbonPerM2: number;
  /** Whole-life carbon (A1-D) in kgCO2e */
  wholeLifeCarbonKgCO2e: number;
  wholeLifeCarbonPerM2: number;
  /** EPBD threshold compliance (2028: embodied carbon for >1000m²) */
  epbdApplies: boolean;
  epbdCompliant: boolean | null;  // null if threshold unknown for jurisdiction
  /** National standard used */
  nationalStandard: string;
  lcaMethod: string;
}

export interface ConstructionComplianceResult {
  projectId: string;
  projectName: string;
  jurisdiction: JurisdictionCode;
  /** EN 15978 lifecycle stage breakdown */
  lifecycleStages: LifecycleStageResult[];
  /** Total embodied carbon (A1-C4) */
  totalEmbodiedCarbonKgCO2e: number;
  totalEmbodiedCarbonPerM2: number;
  /** EPBD compliance assessment */
  epbd: EPBDResult;
  /** Top 3 material contributors */
  topMaterialContributors: MaterialCarbonBreakdown[];
  /** Regulatory exposure summary */
  regulatoryExposure: RegulatoryExposure;
  /** Data quality score (0-100) */
  dataQuality: number;
  /** Timestamp */
  assessedAt: string;
}

export interface RegulatoryExposure {
  /** CSRD: does this project contribute materially to corporate Scope 1/2/3? */
  csrdMaterial: boolean;
  /** ETS2: estimated annual CO2e from buildings sector exposure */
  ets2ExposureTonnesCO2e: number;
  ets2CostEur: number;
  /** EPBD: building must report embodied carbon? */
  epbdReportingRequired: boolean;
  /** EU Taxonomy: potential alignment as substantial contribution */
  taxonomyAlignmentPotential: 'high' | 'medium' | 'low';
  /** Combined regulatory cost estimate (EUR) */
  totalRegulatoryExposureEur: number;
}

// ============ CONSTANTS ============

/** Transport emission factors (kgCO2e per tonne-km) */
const TRANSPORT_FACTORS: Record<TransportEntry['mode'], number> = {
  truck: 0.062,            // Source: EEA 2023, EU average HGV
  'electric-truck': 0.020, // Source: ICCT 2024, battery-electric HGV
  rail: 0.022,             // Source: EEA 2023, EU average freight rail
  ship: 0.008,             // Source: IMO 2023, EU short-sea shipping
};

/** Site energy emission factors (kgCO2e per unit) */
const SITE_ENERGY_FACTORS: Record<SiteEnergyEntry['type'], { factor: number; unit: string }> = {
  diesel: { factor: 2.68, unit: 'kgCO2e/litre' },           // Source: IPCC 2006
  electricity: { factor: 0.230, unit: 'kgCO2e/kWh' },       // EU average 2024 (EEA)
  lpg: { factor: 1.51, unit: 'kgCO2e/litre' },              // Source: IPCC 2006
  'district-heat': { factor: 0.120, unit: 'kgCO2e/kWh' },   // Nordic average (Statistics Finland)
};

/**
 * Country-specific grid electricity emission factors (kgCO2e/kWh).
 * Source: EEA GHG Inventory 2024
 */
const GRID_FACTORS: Record<JurisdictionCode, number> = {
  NO: 0.008,   // Norway: almost entirely hydro
  DK: 0.149,   // Denmark: wind + gas backup
  FI: 0.072,   // Finland: nuclear + hydro + biomass
  SE: 0.013,   // Sweden: hydro + nuclear
  EU: 0.230,   // EU-27 average
};

/**
 * National LCA standards by jurisdiction.
 * Source: Pia NCC brief — NS 3720, BR18, YM decree
 */
const NATIONAL_STANDARDS: Record<JurisdictionCode, { standard: string; lcaMethod: string }> = {
  NO: { standard: 'NS 3720:2018', lcaMethod: 'TEK17 + NS 3031' },
  DK: { standard: 'BR18 LCA (from 2023)', lcaMethod: 'DS/EN 15978 + BR18 Annex 2' },
  FI: { standard: 'YM decree 2025', lcaMethod: 'EN 15978 + One Click LCA' },
  SE: { standard: 'Boverkets klimatdeklaration', lcaMethod: 'EN 15978 + Boverkets' },
  EU: { standard: 'EN 15978:2011', lcaMethod: 'EN 15978 (generic)' },
};

/**
 * Nordic average embodied carbon benchmarks (kgCO2e/m²).
 * Source: SBI/Aalborg University 2024, VTT Technical Research Centre Finland
 */
const EMBODIED_CARBON_BENCHMARKS: Record<string, { low: number; average: number; high: number }> = {
  residential: { low: 200, average: 350, high: 500 },
  commercial: { low: 250, average: 400, high: 600 },
  industrial: { low: 180, average: 300, high: 450 },
  mixed: { low: 230, average: 370, high: 550 },
};

/** ETS2 buildings sector carbon price (EUR/tCO2e, starting 2027) */
const ETS2_CARBON_PRICE_EUR = 45; // Source: EC impact assessment 2024, conservative estimate

// ============ CALCULATOR ============

/**
 * Calculate full EN 15978 lifecycle assessment for a building project.
 * This is the core construction compliance calculation — deterministic, no LLM.
 */
export function calculateConstructionCompliance(
  project: BuildingProject,
): ConstructionComplianceResult {
  const gridFactor = GRID_FACTORS[project.jurisdiction] ?? GRID_FACTORS.EU;
  const lifetime = project.designLifetime ?? 50;

  // A1-A3: Product stage (materials)
  const a1a3 = calculateProductStage(project.materials);

  // A4: Transport to site
  const a4 = calculateTransportStage(project.transport);

  // A5: Construction / installation (site energy)
  const a5 = calculateConstructionStage(project.siteEnergy, gridFactor);

  // B1-B7: Use phase (operational energy over design lifetime)
  const b1b7 = calculateUsePhase(project, gridFactor, lifetime);

  // C1-C4: End-of-life (estimated as 3-5% of A1-A3 for Nordic construction)
  const c1c4 = Math.round(a1a3.total * 0.04 * 100) / 100; // 4% of A1-A3, source: SBI 2024

  // D: Recovery potential (credit, typically negative 10-20% of A1-A3 for recyclable materials)
  const recyclableShare = calculateRecyclableShare(project.materials);
  const stageD = Math.round(-a1a3.total * recyclableShare * 0.15 * 100) / 100;

  // Build lifecycle stages
  const totalEmbodied = a1a3.total + a4 + a5 + b1b7 + c1c4; // A1-C4
  const wholeLife = totalEmbodied + stageD; // A1-D

  const stages: LifecycleStageResult[] = [
    buildStageResult('A1-A3', 'Product (materials)', a1a3.total, project.grossFloorArea, wholeLife, a1a3.breakdown),
    buildStageResult('A4', 'Transport to site', a4, project.grossFloorArea, wholeLife),
    buildStageResult('A5', 'Construction', a5, project.grossFloorArea, wholeLife),
    buildStageResult('B1-B7', 'Use phase', b1b7, project.grossFloorArea, wholeLife),
    buildStageResult('C1-C4', 'End of life', c1c4, project.grossFloorArea, wholeLife),
    buildStageResult('D', 'Recovery potential', stageD, project.grossFloorArea, wholeLife),
  ];

  // Top material contributors
  const topContributors = a1a3.breakdown
    .sort((a, b) => b.kgCO2e - a.kgCO2e)
    .slice(0, 3);

  // EPBD assessment
  const national = NATIONAL_STANDARDS[project.jurisdiction] ?? NATIONAL_STANDARDS.EU;
  const epbdApplies = project.grossFloorArea > 1000;
  const benchmark = EMBODIED_CARBON_BENCHMARKS[project.buildingType] ?? EMBODIED_CARBON_BENCHMARKS.mixed;
  const embodiedPerM2 = project.grossFloorArea > 0 ? totalEmbodied / project.grossFloorArea : 0;

  const epbd: EPBDResult = {
    embodiedCarbonKgCO2e: Math.round(totalEmbodied),
    embodiedCarbonPerM2: Math.round(embodiedPerM2 * 10) / 10,
    wholeLifeCarbonKgCO2e: Math.round(wholeLife),
    wholeLifeCarbonPerM2: Math.round((wholeLife / Math.max(project.grossFloorArea, 1)) * 10) / 10,
    epbdApplies,
    epbdCompliant: epbdApplies ? embodiedPerM2 <= benchmark.high : null,
    nationalStandard: national.standard,
    lcaMethod: national.lcaMethod,
  };

  // Regulatory exposure
  const ets2Exposure = (a5 + (b1b7 / lifetime)) / 1000; // Annual tonnes from construction + operations
  const ets2Cost = Math.round(ets2Exposure * ETS2_CARBON_PRICE_EUR);
  const taxonomyPotential = embodiedPerM2 <= benchmark.low ? 'high'
    : embodiedPerM2 <= benchmark.average ? 'medium'
    : 'low';

  const regulatoryExposure: RegulatoryExposure = {
    csrdMaterial: totalEmbodied > 100_000, // >100 tCO2e is material for most companies
    ets2ExposureTonnesCO2e: Math.round(ets2Exposure * 100) / 100,
    ets2CostEur: ets2Cost,
    epbdReportingRequired: epbdApplies,
    taxonomyAlignmentPotential: taxonomyPotential,
    totalRegulatoryExposureEur: ets2Cost + (epbdApplies ? 15_000 : 0), // EPBD reporting cost estimate
  };

  // Data quality score
  const dataQuality = assessDataQuality(project);

  return {
    projectId: project.projectId,
    projectName: project.name,
    jurisdiction: project.jurisdiction,
    lifecycleStages: stages,
    totalEmbodiedCarbonKgCO2e: Math.round(totalEmbodied),
    totalEmbodiedCarbonPerM2: Math.round(embodiedPerM2 * 10) / 10,
    epbd,
    topMaterialContributors: topContributors,
    regulatoryExposure,
    dataQuality,
    assessedAt: new Date().toISOString(),
  };
}

// ============ STAGE CALCULATORS ============

function calculateProductStage(materials: MaterialEntry[]): { total: number; breakdown: MaterialCarbonBreakdown[] } {
  const breakdown: MaterialCarbonBreakdown[] = [];
  let total = 0;

  for (const mat of materials) {
    const kgCO2e = mat.quantity * mat.emissionFactor;
    total += kgCO2e;
    breakdown.push({
      name: mat.name,
      category: mat.category,
      kgCO2e: Math.round(kgCO2e * 100) / 100,
      percentage: 0, // calculated after totals
    });
  }

  // Calculate percentages
  for (const item of breakdown) {
    item.percentage = total > 0 ? Math.round((item.kgCO2e / total) * 1000) / 10 : 0;
  }

  return { total: Math.round(total * 100) / 100, breakdown };
}

function calculateTransportStage(transport: TransportEntry[]): number {
  let total = 0;
  for (const t of transport) {
    const factor = TRANSPORT_FACTORS[t.mode] ?? TRANSPORT_FACTORS.truck;
    total += t.tonnage * t.distanceKm * factor;
  }
  return Math.round(total * 100) / 100;
}

function calculateConstructionStage(
  siteEnergy: SiteEnergyEntry[],
  gridFactor: number,
): number {
  let total = 0;
  for (const entry of siteEnergy) {
    if (entry.type === 'electricity') {
      // Use jurisdiction-specific grid factor
      const kWh = entry.unit === 'MWh' ? entry.quantity * 1000 : entry.quantity;
      total += kWh * gridFactor;
    } else {
      const factor = SITE_ENERGY_FACTORS[entry.type];
      total += entry.quantity * factor.factor;
    }
  }
  return Math.round(total * 100) / 100;
}

function calculateUsePhase(
  project: BuildingProject,
  gridFactor: number,
  lifetime: number,
): number {
  if (!project.annualOperationalEnergy) return 0;
  // B6: Operational energy over design lifetime
  const annualKgCO2e = project.annualOperationalEnergy * gridFactor;
  return Math.round(annualKgCO2e * lifetime * 100) / 100;
}

function calculateRecyclableShare(materials: MaterialEntry[]): number {
  // Steel and aluminium are highly recyclable, timber is reusable
  const totalQuantity = materials.reduce((sum, m) => sum + m.quantity, 0);
  if (totalQuantity === 0) return 0;

  const recyclableQuantity = materials
    .filter((m) => ['steel', 'aluminium', 'timber'].includes(m.category))
    .reduce((sum, m) => sum + m.quantity, 0);

  return recyclableQuantity / totalQuantity;
}

// ============ HELPERS ============

function buildStageResult(
  stage: LifecycleStage,
  label: string,
  kgCO2e: number,
  grossFloorArea: number,
  wholeLifeTotal: number,
  materialBreakdown?: MaterialCarbonBreakdown[],
): LifecycleStageResult {
  const area = Math.max(grossFloorArea, 1);
  return {
    stage,
    label,
    kgCO2e: Math.round(kgCO2e * 100) / 100,
    kgCO2ePerM2: Math.round((kgCO2e / area) * 10) / 10,
    percentage: wholeLifeTotal !== 0
      ? Math.round((kgCO2e / Math.abs(wholeLifeTotal)) * 1000) / 10
      : 0,
    materialBreakdown,
  };
}

/**
 * Assess data quality based on source types and completeness.
 * EPD data > generic factors; BIM quantities > manual estimates.
 */
function assessDataQuality(project: BuildingProject): number {
  let score = 40; // Base score for having any data

  // EPD vs generic factors (+30 max)
  const epdCount = project.materials.filter((m) => m.factorSource === 'epd').length;
  const totalMaterials = project.materials.length;
  if (totalMaterials > 0) {
    score += Math.round((epdCount / totalMaterials) * 30);
  }

  // BIM model available (+10)
  if (project.hasBimModel) score += 10;

  // Transport data provided (+5)
  if (project.transport.length > 0) score += 5;

  // Site energy data provided (+5)
  if (project.siteEnergy.length > 0) score += 5;

  // Operational energy for use phase (+5)
  if (project.annualOperationalEnergy) score += 5;

  // ERP integration (+5)
  if (project.erpSystem && project.erpSystem !== 'other') score += 5;

  return Math.min(100, score);
}

// ============ MULTI-JURISDICTION HELPERS ============

/**
 * Get jurisdiction-specific compliance context.
 * Maps national LCA standards and grid factors for the Pia NCC use case.
 */
export function getJurisdictionContext(code: JurisdictionCode) {
  return {
    jurisdiction: code,
    national: NATIONAL_STANDARDS[code] ?? NATIONAL_STANDARDS.EU,
    gridFactor: GRID_FACTORS[code] ?? GRID_FACTORS.EU,
    benchmarks: EMBODIED_CARBON_BENCHMARKS,
  };
}

/**
 * Compare a project's embodied carbon against Nordic benchmarks.
 */
export function benchmarkProject(
  embodiedPerM2: number,
  buildingType: string,
): { rating: 'excellent' | 'good' | 'average' | 'poor'; percentile: string } {
  const bench = EMBODIED_CARBON_BENCHMARKS[buildingType] ?? EMBODIED_CARBON_BENCHMARKS.mixed;

  if (embodiedPerM2 <= bench.low) {
    return { rating: 'excellent', percentile: 'Top 25%' };
  }
  if (embodiedPerM2 <= bench.average) {
    return { rating: 'good', percentile: 'Top 50%' };
  }
  if (embodiedPerM2 <= bench.high) {
    return { rating: 'average', percentile: 'Top 75%' };
  }
  return { rating: 'poor', percentile: 'Bottom 25%' };
}

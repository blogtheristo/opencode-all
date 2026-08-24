/**
 * Cross-Vertical Intelligence Simulation
 *
 * Models the Lifetime World Model moat:
 *   18 data sources × 20 industries × 1 ledger format
 *
 * Core insight: Steel CBAM exposure correlates with construction CSRD
 * disclosure gaps from the same supply chain. Single-industry compliance
 * tools miss this signal because they don't see across verticals.
 *
 * Qantic case: energy dispatch (BESS) → grid emission factor →
 *   steel ETS cost → construction embodied carbon → CSRD E1-6 gap.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD
 * Branch: claude/cross-vertical-intelligence-sim-LdnCF
 * Date: 2026-03-24
 * Owner: Lifetime Oy
 */

import { EU_SECTOR_BENCHMARKS, type SectorBenchmark } from './eu-benchmarks.js';
import { DATA_SOURCES, type DataSource } from './data-source-registry.js';
import {
  type ComplianceScoringInput,
  scoreCompliance,
  type ScoringResult,
} from './scoring-engine.js';
import { type ComplianceLedger, costBreakdownToLedger } from './debit-credit-ledger.js';
import { getMandatoryDisclosures } from './esrs-registry.js';

// ============ TYPES ============

/** A directed link in the supply chain graph */
export interface SupplyChainLink {
  /** Upstream industry (supplier) */
  from: string;
  /** Downstream industry (buyer) */
  to: string;
  /** What flows along this link */
  material: string;
  /** Fraction of downstream's embodied carbon from this upstream (0-1) */
  carbonShare: number;
  /** Which regulations create cross-vertical exposure */
  regulatoryLinks: ('cbam' | 'ets' | 'csrd-scope3' | 'taxonomy')[];
}

/** A compliance signal that propagates across industries */
export interface CrossVerticalSignal {
  id: string;
  /** Industry where the signal originates */
  originIndustry: string;
  /** Regulation that triggers it */
  originRegulation: string;
  /** Industries affected downstream */
  affectedIndustries: string[];
  /** What the signal means */
  description: string;
  /** EUR impact per unit change in origin */
  propagationFactor: number;
}

/** Result of running the cross-vertical simulation */
export interface CrossVerticalSimResult {
  /** Timestamp */
  generatedAt: string;
  /** Supply chain graph */
  supplyChain: SupplyChainLink[];
  /** Signals that propagate across verticals */
  signals: CrossVerticalSignal[];
  /** Per-industry compliance scores (all scored with same engine) */
  industryScores: Map<string, ScoringResult>;
  /** Per-industry ledgers (1 ledger format) */
  industryLedgers: Map<string, ComplianceLedger>;
  /** Cross-vertical correlations discovered */
  correlations: CorrelationResult[];
  /** Data source coverage matrix */
  dataSourceMatrix: DataSourceCoverage[];
  /** Summary statistics */
  summary: SimSummary;
}

export interface CorrelationResult {
  /** e.g. "steel-cbam ↔ construction-csrd" */
  pair: string;
  upstreamIndustry: string;
  upstreamRegulation: string;
  downstreamIndustry: string;
  downstreamRegulation: string;
  /** Pearson-like correlation coefficient (-1 to 1) */
  coefficient: number;
  /** Causal mechanism */
  mechanism: string;
  /** EUR exposure in the downstream from upstream signal */
  downstreamExposureEur: number;
}

export interface DataSourceCoverage {
  sourceId: string;
  sourceName: string;
  /** Industries this source covers */
  industries: string[];
  /** How many industries out of 20 */
  coverageCount: number;
}

export interface SimSummary {
  totalIndustries: number;
  totalDataSources: number;
  totalSupplyChainLinks: number;
  totalCorrelations: number;
  /** Strongest cross-vertical correlation found */
  strongestCorrelation: CorrelationResult | null;
  /** Total EUR exposure hidden from single-vertical tools */
  hiddenExposureEur: number;
  /** The "18 × 20 × 1" signature */
  matrixSignature: string;
}

// ============ SUPPLY CHAIN GRAPH ============

/**
 * Supply chain links with real carbon-share estimates.
 * Sources: Ecoinvent 3.10 embodied carbon datasets, EN 15978 LCA.
 */
export const SUPPLY_CHAIN_GRAPH: SupplyChainLink[] = [
  // Steel feeds into construction, manufacturing, transport, energy
  {
    from: 'steel',
    to: 'construction',
    material: 'Structural steel (rebar, beams)',
    carbonShare: 0.35,
    regulatoryLinks: ['cbam', 'csrd-scope3', 'taxonomy'],
  },
  {
    from: 'steel',
    to: 'manufacturing',
    material: 'Steel components',
    carbonShare: 0.2,
    regulatoryLinks: ['cbam', 'csrd-scope3'],
  },
  {
    from: 'steel',
    to: 'transport',
    material: 'Vehicle steel',
    carbonShare: 0.15,
    regulatoryLinks: ['cbam', 'csrd-scope3'],
  },
  {
    from: 'steel',
    to: 'energy',
    material: 'Wind tower steel',
    carbonShare: 0.08,
    regulatoryLinks: ['cbam', 'taxonomy'],
  },

  // Cement feeds into construction
  {
    from: 'cement',
    to: 'construction',
    material: 'Portland cement, concrete',
    carbonShare: 0.3,
    regulatoryLinks: ['cbam', 'csrd-scope3', 'taxonomy'],
  },

  // Aluminium feeds into construction, manufacturing, transport
  {
    from: 'aluminium',
    to: 'construction',
    material: 'Aluminium facades, frames',
    carbonShare: 0.1,
    regulatoryLinks: ['cbam', 'csrd-scope3'],
  },
  {
    from: 'aluminium',
    to: 'manufacturing',
    material: 'Aluminium parts',
    carbonShare: 0.15,
    regulatoryLinks: ['cbam', 'csrd-scope3'],
  },
  {
    from: 'aluminium',
    to: 'transport',
    material: 'Vehicle aluminium',
    carbonShare: 0.12,
    regulatoryLinks: ['cbam'],
  },

  // Chemicals feed into manufacturing, construction, fertilizers
  {
    from: 'chemicals',
    to: 'manufacturing',
    material: 'Industrial chemicals',
    carbonShare: 0.1,
    regulatoryLinks: ['ets', 'csrd-scope3'],
  },
  {
    from: 'chemicals',
    to: 'construction',
    material: 'Paints, adhesives, coatings',
    carbonShare: 0.05,
    regulatoryLinks: ['csrd-scope3'],
  },
  {
    from: 'chemicals',
    to: 'fertilizers',
    material: 'Ammonia feedstock',
    carbonShare: 0.6,
    regulatoryLinks: ['ets', 'cbam'],
  },

  // Energy feeds into everything (Scope 2)
  {
    from: 'energy',
    to: 'steel',
    material: 'Grid electricity',
    carbonShare: 0.15,
    regulatoryLinks: ['ets', 'csrd-scope3'],
  },
  {
    from: 'energy',
    to: 'cement',
    material: 'Grid electricity',
    carbonShare: 0.1,
    regulatoryLinks: ['ets', 'csrd-scope3'],
  },
  {
    from: 'energy',
    to: 'aluminium',
    material: 'Grid electricity (smelting)',
    carbonShare: 0.4,
    regulatoryLinks: ['ets', 'csrd-scope3'],
  },
  {
    from: 'energy',
    to: 'chemicals',
    material: 'Grid electricity',
    carbonShare: 0.2,
    regulatoryLinks: ['ets', 'csrd-scope3'],
  },
  {
    from: 'energy',
    to: 'construction',
    material: 'Site electricity',
    carbonShare: 0.05,
    regulatoryLinks: ['csrd-scope3'],
  },
  {
    from: 'energy',
    to: 'manufacturing',
    material: 'Grid electricity',
    carbonShare: 0.25,
    regulatoryLinks: ['ets', 'csrd-scope3'],
  },

  // Hydrogen feeds into steel (DRI), chemicals, energy
  {
    from: 'hydrogen',
    to: 'steel',
    material: 'Green H2 for DRI',
    carbonShare: 0.05,
    regulatoryLinks: ['ets', 'taxonomy'],
  },
  {
    from: 'hydrogen',
    to: 'chemicals',
    material: 'H2 feedstock',
    carbonShare: 0.15,
    regulatoryLinks: ['ets', 'cbam'],
  },
  {
    from: 'hydrogen',
    to: 'energy',
    material: 'H2 for storage/peaking',
    carbonShare: 0.03,
    regulatoryLinks: ['taxonomy'],
  },

  // Fertilizers feed into agriculture (not tracked) but also loop through transport
  {
    from: 'fertilizers',
    to: 'transport',
    material: 'Fertilizer logistics',
    carbonShare: 0.02,
    regulatoryLinks: ['csrd-scope3'],
  },

  // Lime — dual-use critical raw material (Nordkalk/SigmaRoc pattern, 2026-03-30)
  // Lime is THE upstream dependency for steel (flux), cement (clinker), and chemicals (calcium carbide)
  {
    from: 'lime',
    to: 'steel',
    material: 'Lime flux (impurity removal in BF/BOF)',
    carbonShare: 0.08,
    regulatoryLinks: ['ets', 'cbam', 'csrd-scope3'],
  },
  {
    from: 'lime',
    to: 'cement',
    material: 'Limestone feedstock (calcination)',
    carbonShare: 0.6,
    regulatoryLinks: ['ets', 'cbam', 'csrd-scope3'],
  },
  {
    from: 'lime',
    to: 'chemicals',
    material: 'Calcium carbide precursor',
    carbonShare: 0.05,
    regulatoryLinks: ['ets', 'csrd-scope3'],
  },
  {
    from: 'lime',
    to: 'construction',
    material: 'Quicklime for mortar, soil stabilization',
    carbonShare: 0.04,
    regulatoryLinks: ['csrd-scope3', 'taxonomy'],
  },
  {
    from: 'lime',
    to: 'energy',
    material: 'Flue-gas desulphurisation (FGD)',
    carbonShare: 0.02,
    regulatoryLinks: ['ets', 'csrd-scope3'],
  },
];

// ============ CROSS-VERTICAL SIGNALS ============

/**
 * Signals that propagate across industry boundaries.
 * These are invisible to single-vertical compliance tools.
 */
export const CROSS_VERTICAL_SIGNALS: CrossVerticalSignal[] = [
  {
    id: 'SIG-CBAM-STEEL-CONSTRUCTION',
    originIndustry: 'steel',
    originRegulation: 'CBAM (Reg. 2023/956)',
    affectedIndustries: ['construction', 'manufacturing', 'transport'],
    description:
      'Steel CBAM certificate cost flows into construction material budgets as Scope 3 upstream. Construction companies importing non-EU steel face CBAM + must disclose under CSRD E1-6.',
    propagationFactor: 0.35, // 35% of construction embodied carbon = steel
  },
  {
    id: 'SIG-ETS-ENERGY-STEEL',
    originIndustry: 'energy',
    originRegulation: 'EU ETS Phase 4',
    affectedIndustries: ['steel', 'aluminium', 'cement', 'chemicals'],
    description:
      'ETS carbon price increase on electricity raises Scope 2 for all heavy industry. Grid emission factor × consumption = cascading cost.',
    propagationFactor: 0.15, // Scope 2 share of total steel emissions
  },
  {
    id: 'SIG-CSRD-CONSTRUCTION-STEEL',
    originIndustry: 'construction',
    originRegulation: 'CSRD (Dir. 2022/2464)',
    affectedIndustries: ['steel', 'cement', 'aluminium'],
    description:
      'Construction company CSRD E1-6 disclosure requires supplier emission data. Pushes steel/cement to provide verified carbon content — creates demand signal for upstream data quality.',
    propagationFactor: 0.8, // 80% of construction Scope 3 = material suppliers
  },
  {
    id: 'SIG-TAXONOMY-ENERGY-CONSTRUCTION',
    originIndustry: 'energy',
    originRegulation: 'EU Taxonomy (Reg. 2020/852)',
    affectedIndustries: ['construction', 'hydrogen', 'steel'],
    description:
      'Taxonomy-aligned green energy (Activity 4.10 BESS, 4.1 solar) affects embodied carbon of downstream products. Qantic BESS dispatch → grid factor → construction LCA.',
    propagationFactor: 0.05, // Site electricity share of construction carbon
  },
  {
    id: 'SIG-CBAM-ALUMINIUM-CONSTRUCTION',
    originIndustry: 'aluminium',
    originRegulation: 'CBAM (Reg. 2023/956)',
    affectedIndustries: ['construction', 'manufacturing', 'transport'],
    description:
      'Aluminium CBAM default factor (6.7 tCO2e/t) is the highest per-unit cost in CBAM. Construction facades using imported aluminium face significant cost pass-through.',
    propagationFactor: 0.1, // Aluminium share of construction carbon
  },
  {
    id: 'SIG-SCOPE3-CHEMICALS-MANUFACTURING',
    originIndustry: 'chemicals',
    originRegulation: 'CSRD Scope 3 (ESRS E1-6)',
    affectedIndustries: ['manufacturing', 'construction', 'fertilizers'],
    description:
      'Chemical industry ammonia emissions (1.619 tCO2e/t) cascade through fertilizer and manufacturing supply chains. CSRD Scope 3 makes this visible.',
    propagationFactor: 0.1,
  },
  // Lime dual-use disruption signal — discovered via Nordkalk fire analysis (2026-03-30)
  // Pattern: lime facility disruption → steel flux shortage → CBAM cost spike → construction carbon gap → CSRD E1 degradation
  {
    id: 'SIG-DUALUSE-LIME-STEEL',
    originIndustry: 'lime',
    originRegulation: 'EU CRM Act (Reg. 2024/1252) + KRITIS Umbrella Law',
    affectedIndustries: ['steel', 'cement', 'chemicals', 'construction'],
    description:
      'Lime facility disruption (fire, sabotage, supply constraint) cascades through steel (flux shortage → quality/output drop), cement (calcination feedstock), and chemicals (calcium carbide). Under KRITIS law (Jan 2026), dual-use facility incidents trigger mandatory reporting. PRISMEX campaign (Jan 2026) specifically targets Northern European industrial control systems. A single lime plant outage can stress-test the entire steel→construction CBAM chain.',
    propagationFactor: 0.08, // Lime is 8% of steel embodied carbon via flux
  },
  {
    id: 'SIG-CRM-SUPPLY-RESILIENCE',
    originIndustry: 'lime',
    originRegulation: 'EU CRM Act (Reg. 2024/1252)',
    affectedIndustries: ['steel', 'cement', 'construction', 'energy'],
    description:
      'EU CRMA second round (Jan 2026) granted 95 strategic projects same security priority as military bases. Lime processing plants now classified as Critical National Infrastructure. Supply concentration risk: Nordkalk controls majority of Northern European lime supply. Single-point-of-failure for Finnish/Swedish steel sector.',
    propagationFactor: 0.12, // Higher because of supply concentration
  },
];

// ============ INDUSTRY UNIVERSE ============

/** All 21 industries in the Lifetime World Model */
export const LWM_INDUSTRIES = [
  'steel',
  'cement',
  'aluminium',
  'chemicals',
  'fertilizers',
  'hydrogen',
  'energy',
  'manufacturing',
  'construction',
  'transport',
  'lime', // Added 2026-03-30: dual-use critical raw material (Nordkalk pattern)
  // Extended universe (scored with manufacturing/default benchmarks)
  'maritime',
  'aviation',
  'mining',
  'pulp-paper',
  'food-beverage',
  'textiles',
  'electronics',
  'automotive',
  'pharmaceuticals',
  'real-estate',
] as const;

export type LWMIndustry = (typeof LWM_INDUSTRIES)[number];

// ============ SIMULATION ENGINE ============

/**
 * Generate a compliance scoring input for an industry using sector benchmarks.
 * Uses median company profile from EU_SECTOR_BENCHMARKS.
 */
export function buildIndustryProfile(industry: string): ComplianceScoringInput {
  const benchmark = EU_SECTOR_BENCHMARKS.find((b) => b.sector === industry);
  const mandatory = getMandatoryDisclosures();

  // Simulate data point provision based on sector CSRD readiness
  const readiness = benchmark?.csrdReadiness ?? 30;
  const dataPoints = mandatory.map((d, i) => ({
    disclosureId: d.id,
    // Deterministic: first N% of mandatory disclosures are "provided"
    provided: (i / mandatory.length) * 100 < readiness,
  }));

  return {
    industry: benchmark?.sector ?? industry,
    dataPoints,
    annualEmissions: benchmark?.medianEmissions ?? 10_000,
    importValue: benchmark?.avgImportValue ?? 200_000,
    hasTransitionPlan: (benchmark?.typicalMeasures.transitionPlan ?? 20) > 35,
    hasEmissionsMonitoring: (benchmark?.typicalMeasures.emissionsMonitoring ?? 30) > 50,
    hasSupplyChainDD: (benchmark?.typicalMeasures.supplyChainDD ?? 15) > 25,
  };
}

/**
 * Calculate cross-vertical correlations.
 *
 * A correlation exists when an upstream regulatory exposure (e.g. steel CBAM cost)
 * creates a downstream compliance gap (e.g. construction CSRD E1-6 missing).
 * Single-vertical tools see either side but not the link.
 */
export function calculateCorrelations(
  scores: Map<string, ScoringResult>,
  links: SupplyChainLink[],
  signals: CrossVerticalSignal[],
): CorrelationResult[] {
  const correlations: CorrelationResult[] = [];

  for (const signal of signals) {
    const originScore = scores.get(signal.originIndustry);
    if (!originScore) continue;

    for (const affected of signal.affectedIndustries) {
      const downstreamScore = scores.get(affected);
      if (!downstreamScore) continue;

      // Find the supply chain link
      const link = links.find((l) => l.from === signal.originIndustry && l.to === affected);
      if (!link) continue;

      // Correlation: upstream cost × carbon share = downstream hidden exposure
      const upstreamCost = originScore.costBreakdown?.totalCostEur ?? 0;
      const downstreamExposureEur = Math.round(
        upstreamCost * link.carbonShare * signal.propagationFactor,
      );

      // Coefficient: higher when upstream has high cost AND downstream has low readiness
      const upstreamPressure = 1 - originScore.overallScore / 100;
      const downstreamVulnerability = 1 - downstreamScore.overallScore / 100;
      const coefficient =
        Math.round(((upstreamPressure + downstreamVulnerability) / 2) * 100) / 100;

      // Determine primary regulation pair
      const upReg = signal.originRegulation.includes('CBAM')
        ? 'cbam'
        : signal.originRegulation.includes('ETS')
          ? 'ets'
          : 'csrd';
      const downReg = downstreamScore.gaps.some((g) => g.regulation === 'csrd') ? 'csrd' : 'ets';

      correlations.push({
        pair: `${signal.originIndustry}-${upReg} ↔ ${affected}-${downReg}`,
        upstreamIndustry: signal.originIndustry,
        upstreamRegulation: signal.originRegulation,
        downstreamIndustry: affected,
        downstreamRegulation: downReg === 'csrd' ? 'CSRD (Dir. 2022/2464)' : 'EU ETS Phase 4',
        coefficient,
        mechanism: signal.description,
        downstreamExposureEur,
      });
    }
  }

  // Sort by coefficient descending (strongest correlations first)
  correlations.sort((a, b) => b.coefficient - a.coefficient);
  return correlations;
}

/**
 * Build the data source × industry coverage matrix.
 * Shows which of the 18 sources feed which of the 20 industries.
 */
export function buildDataSourceMatrix(
  sources: DataSource[],
  links: SupplyChainLink[],
  benchmarks: SectorBenchmark[],
): DataSourceCoverage[] {
  const allIndustries = new Set(LWM_INDUSTRIES);
  const benchmarkSectors = new Set(benchmarks.map((b) => b.sector));
  void new Set([...links.map((l) => l.from), ...links.map((l) => l.to)]);

  return sources.map((source) => {
    // Determine which industries this source covers based on category
    let industries: string[] = [];

    switch (source.category) {
      case 'grid-factors':
        // Grid factors affect all industries (Scope 2)
        industries = [...allIndustries];
        break;
      case 'carbon-pricing':
        // Carbon pricing affects ETS-exposed + CBAM-exposed industries
        industries = benchmarks
          .filter((b) => b.etsExposure !== 'low' || b.cbamExposure !== 'low')
          .map((b) => b.sector);
        // Add extended industries that use energy
        industries.push('maritime', 'aviation', 'automotive');
        break;
      case 'emission-factors':
        // Emission factors cover all industries with direct emissions
        industries = [...benchmarkSectors, 'maritime', 'aviation', 'mining', 'automotive'];
        break;
      case 'sector-benchmarks':
        // Sector benchmarks cover tracked sectors
        industries = [...benchmarkSectors];
        break;
      case 'disclosure-registry':
        // ESRS applies to all CSRD-scope industries
        industries = [...allIndustries];
        break;
    }

    // Deduplicate
    industries = [...new Set(industries)].filter((i) => allIndustries.has(i as LWMIndustry));

    return {
      sourceId: source.id,
      sourceName: source.name,
      industries,
      coverageCount: industries.length,
    };
  });
}

// ============ MAIN SIMULATION ============

/**
 * Run the full cross-vertical intelligence simulation.
 *
 * This is the Qantic case use: demonstrates how compliance signals
 * propagate across the supply chain graph, creating correlations
 * that only a multi-vertical platform (Lifetime World Model) can see.
 *
 * @returns Deterministic simulation result — no LLM, no randomness.
 */
export function runCrossVerticalSimulation(): CrossVerticalSimResult {
  // 1. Score all industries using the same scoring engine + ledger format
  const industryScores = new Map<string, ScoringResult>();
  const industryLedgers = new Map<string, ComplianceLedger>();

  for (const industry of LWM_INDUSTRIES) {
    const profile = buildIndustryProfile(industry);
    const result = scoreCompliance(profile);
    industryScores.set(industry, result);

    // Transform into unified ledger format (the "× 1 ledger format" part)
    if (result.costBreakdown) {
      const ledger = costBreakdownToLedger(result.costBreakdown);
      industryLedgers.set(industry, ledger);
    }
  }

  // 2. Calculate cross-vertical correlations
  const correlations = calculateCorrelations(
    industryScores,
    SUPPLY_CHAIN_GRAPH,
    CROSS_VERTICAL_SIGNALS,
  );

  // 3. Build data source coverage matrix
  const dataSourceMatrix = buildDataSourceMatrix(
    DATA_SOURCES,
    SUPPLY_CHAIN_GRAPH,
    EU_SECTOR_BENCHMARKS,
  );

  // 4. Summary
  const strongestCorrelation = correlations.length > 0 ? correlations[0] : null;
  const hiddenExposureEur = correlations.reduce((sum, c) => sum + c.downstreamExposureEur, 0);

  return {
    generatedAt: new Date().toISOString(),
    supplyChain: SUPPLY_CHAIN_GRAPH,
    signals: CROSS_VERTICAL_SIGNALS,
    industryScores,
    industryLedgers,
    correlations,
    dataSourceMatrix,
    summary: {
      totalIndustries: LWM_INDUSTRIES.length,
      totalDataSources: DATA_SOURCES.length,
      totalSupplyChainLinks: SUPPLY_CHAIN_GRAPH.length,
      totalCorrelations: correlations.length,
      strongestCorrelation,
      hiddenExposureEur,
      matrixSignature: `${DATA_SOURCES.length} data sources × ${LWM_INDUSTRIES.length} industries × 1 ledger format`,
    },
  };
}

/**
 * Extract the Qantic-specific case: energy BESS → steel → construction chain.
 *
 * Shows how Qantic's energy dispatch simulation connects to construction
 * CSRD disclosure through the steel supply chain — the exact moat claim.
 */
export function extractQanticCase(sim: CrossVerticalSimResult): {
  chain: string[];
  correlations: CorrelationResult[];
  steelCbamCostEur: number;
  constructionHiddenExposureEur: number;
  constructionCsrdScore: number;
  constructionCsrdGaps: number;
  insight: string;
} {
  // The Qantic chain: energy → steel → construction
  const chain = ['energy', 'steel', 'construction'];

  // Filter correlations to this chain
  const chainCorrelations = sim.correlations.filter(
    (c) =>
      (c.upstreamIndustry === 'energy' && chain.includes(c.downstreamIndustry)) ||
      (c.upstreamIndustry === 'steel' && c.downstreamIndustry === 'construction'),
  );

  const steelScore = sim.industryScores.get('steel');
  const constructionScore = sim.industryScores.get('construction');

  const steelCbamCostEur = steelScore?.costBreakdown?.cbamCostEur ?? 0;
  const constructionCsrdScore =
    constructionScore?.regulationScores.find((r) => r.regulation === 'csrd')?.score ?? 0;
  const constructionCsrdGaps =
    constructionScore?.gaps.filter((g) => g.regulation === 'csrd').length ?? 0;

  const constructionHiddenExposureEur = chainCorrelations
    .filter((c) => c.downstreamIndustry === 'construction')
    .reduce((sum, c) => sum + c.downstreamExposureEur, 0);

  return {
    chain,
    correlations: chainCorrelations,
    steelCbamCostEur,
    constructionHiddenExposureEur,
    constructionCsrdScore,
    constructionCsrdGaps,
    insight: [
      `Steel CBAM cost (€${steelCbamCostEur.toLocaleString()}) propagates into construction`,
      `as ${(0.35 * 100).toFixed(0)}% of embodied carbon.`,
      `Construction CSRD readiness is only ${constructionCsrdScore}/100`,
      `with ${constructionCsrdGaps} disclosure gaps.`,
      `Hidden cross-vertical exposure: €${constructionHiddenExposureEur.toLocaleString()}.`,
      'A single-vertical construction compliance tool misses this entirely.',
    ].join(' '),
  };
}

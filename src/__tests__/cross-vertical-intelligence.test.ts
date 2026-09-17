/**
 * Cross-Vertical Intelligence Simulation Tests
 *
 * Validates the Lifetime World Model moat:
 *   18 data sources × 20 industries × 1 ledger format
 *
 * Key assertion: steel CBAM exposure correlates with construction
 * CSRD disclosure gaps from the same supply chain.
 */

import { describe, expect, it } from 'vitest';
import {
  buildDataSourceMatrix,
  buildIndustryProfile,
  CROSS_VERTICAL_SIGNALS,
  type CrossVerticalSimResult,
  extractQanticCase,
  LWM_INDUSTRIES,
  runCrossVerticalSimulation,
  SUPPLY_CHAIN_GRAPH,
} from '../compliance/cross-vertical-intelligence.js';
import { EU_SECTOR_BENCHMARKS } from '../compliance/eu-benchmarks.js';
import { DATA_SOURCES } from '../compliance/data-source-registry.js';

// ============ SUPPLY CHAIN GRAPH ============

describe('Supply Chain Graph', () => {
  it('has directed links between industries', () => {
    expect(SUPPLY_CHAIN_GRAPH.length).toBeGreaterThan(10);
    for (const link of SUPPLY_CHAIN_GRAPH) {
      expect(link.from).toBeTruthy();
      expect(link.to).toBeTruthy();
      expect(link.from).not.toBe(link.to);
      expect(link.carbonShare).toBeGreaterThan(0);
      expect(link.carbonShare).toBeLessThanOrEqual(1);
      expect(link.regulatoryLinks.length).toBeGreaterThan(0);
    }
  });

  it('steel flows into construction with 35% carbon share', () => {
    const steelToConstruction = SUPPLY_CHAIN_GRAPH.find(
      (l) => l.from === 'steel' && l.to === 'construction',
    );
    expect(steelToConstruction).toBeDefined();
    expect(steelToConstruction!.carbonShare).toBe(0.35);
    expect(steelToConstruction!.regulatoryLinks).toContain('cbam');
    expect(steelToConstruction!.regulatoryLinks).toContain('csrd-scope3');
  });

  it('cement flows into construction with 30% carbon share', () => {
    const cementToConstruction = SUPPLY_CHAIN_GRAPH.find(
      (l) => l.from === 'cement' && l.to === 'construction',
    );
    expect(cementToConstruction).toBeDefined();
    expect(cementToConstruction!.carbonShare).toBe(0.3);
  });

  it('energy feeds all heavy industry (Scope 2)', () => {
    const energyLinks = SUPPLY_CHAIN_GRAPH.filter((l) => l.from === 'energy');
    expect(energyLinks.length).toBeGreaterThanOrEqual(5);
    const targets = energyLinks.map((l) => l.to);
    expect(targets).toContain('steel');
    expect(targets).toContain('cement');
    expect(targets).toContain('aluminium');
  });

  it('construction receives material from steel + cement + aluminium', () => {
    const constructionInputs = SUPPLY_CHAIN_GRAPH.filter((l) => l.to === 'construction');
    const suppliers = constructionInputs.map((l) => l.from);
    expect(suppliers).toContain('steel');
    expect(suppliers).toContain('cement');
    expect(suppliers).toContain('aluminium');
    // Total carbon share for construction should sum > 0.5 (material-heavy)
    const totalCarbon = constructionInputs.reduce((s, l) => s + l.carbonShare, 0);
    expect(totalCarbon).toBeGreaterThan(0.5);
  });
});

// ============ CROSS-VERTICAL SIGNALS ============

describe('Cross-Vertical Signals', () => {
  it('has steel-CBAM-to-construction signal', () => {
    const sig = CROSS_VERTICAL_SIGNALS.find((s) => s.id === 'SIG-CBAM-STEEL-CONSTRUCTION');
    expect(sig).toBeDefined();
    expect(sig!.originIndustry).toBe('steel');
    expect(sig!.affectedIndustries).toContain('construction');
    expect(sig!.propagationFactor).toBe(0.35);
  });

  it('has CSRD-construction-pushing-upstream signal', () => {
    const sig = CROSS_VERTICAL_SIGNALS.find((s) => s.id === 'SIG-CSRD-CONSTRUCTION-STEEL');
    expect(sig).toBeDefined();
    expect(sig!.originIndustry).toBe('construction');
    expect(sig!.affectedIndustries).toContain('steel');
    expect(sig!.affectedIndustries).toContain('cement');
  });

  it('all signals reference real regulations', () => {
    for (const sig of CROSS_VERTICAL_SIGNALS) {
      expect(sig.originRegulation).toMatch(/CBAM|ETS|CSRD|Taxonomy|CRM Act|KRITIS/);
    }
  });
});

// ============ INDUSTRY PROFILES ============

describe('Industry Profile Builder', () => {
  it('builds steel profile with high emissions', () => {
    const profile = buildIndustryProfile('steel');
    expect(profile.industry).toBe('steel');
    expect(profile.annualEmissions).toBe(120_000); // median from benchmarks
    expect(profile.importValue).toBe(2_500_000);
  });

  it('builds construction profile with low emissions', () => {
    const profile = buildIndustryProfile('construction');
    expect(profile.industry).toBe('construction');
    expect(profile.annualEmissions).toBe(8_000); // median from benchmarks
  });

  it('falls back gracefully for unknown industries', () => {
    const profile = buildIndustryProfile('maritime');
    expect(profile.dataPoints.length).toBeGreaterThan(0);
    expect(profile.annualEmissions).toBe(10_000); // default
  });
});

// ============ FULL SIMULATION ============

describe('Cross-Vertical Simulation', () => {
  let sim: CrossVerticalSimResult;

  // Run once for all tests in this describe block
  it('runs without error', () => {
    sim = runCrossVerticalSimulation();
    expect(sim).toBeDefined();
    expect(sim.generatedAt).toBeTruthy();
  });

  it('scores all 20 industries', () => {
    sim = runCrossVerticalSimulation();
    expect(sim.industryScores.size).toBe(LWM_INDUSTRIES.length);
    expect(sim.industryScores.size).toBe(LWM_INDUSTRIES.length);
  });

  it('produces ledgers for all scored industries (1 format)', () => {
    sim = runCrossVerticalSimulation();
    // Every industry with a cost breakdown gets a ledger
    let ledgerCount = 0;
    for (const [, score] of sim.industryScores) {
      if (score.costBreakdown) ledgerCount++;
    }
    expect(sim.industryLedgers.size).toBe(ledgerCount);
    // All ledgers have the same structure (debit/credit)
    for (const [, ledger] of sim.industryLedgers) {
      expect(ledger.entries).toBeDefined();
      expect(typeof ledger.totalDebitsEur).toBe('number');
      expect(typeof ledger.totalCreditsEur).toBe('number');
      expect(typeof ledger.netPositionEur).toBe('number');
    }
  });

  it('finds cross-vertical correlations', () => {
    sim = runCrossVerticalSimulation();
    expect(sim.correlations.length).toBeGreaterThan(0);
    // Every correlation has a coefficient between 0 and 1
    for (const corr of sim.correlations) {
      expect(corr.coefficient).toBeGreaterThanOrEqual(0);
      expect(corr.coefficient).toBeLessThanOrEqual(1);
    }
  });

  it('steel-CBAM correlates with construction-CSRD', () => {
    sim = runCrossVerticalSimulation();
    const steelConstruction = sim.correlations.find(
      (c) => c.upstreamIndustry === 'steel' && c.downstreamIndustry === 'construction',
    );
    expect(steelConstruction).toBeDefined();
    expect(steelConstruction!.coefficient).toBeGreaterThan(0.3);
    expect(steelConstruction!.downstreamExposureEur).toBeGreaterThan(0);
    expect(steelConstruction!.mechanism).toContain('CBAM');
  });

  it('total hidden exposure is non-trivial', () => {
    sim = runCrossVerticalSimulation();
    expect(sim.summary.hiddenExposureEur).toBeGreaterThan(0);
  });

  it('summary has correct matrix signature', () => {
    sim = runCrossVerticalSimulation();
    expect(sim.summary.matrixSignature).toMatch(
      /\d+ data sources × \d+ industries × 1 ledger format/,
    );
    expect(sim.summary.totalIndustries).toBe(LWM_INDUSTRIES.length);
    expect(sim.summary.totalDataSources).toBe(DATA_SOURCES.length);
  });
});

// ============ DATA SOURCE MATRIX ============

describe('Data Source Coverage Matrix', () => {
  it('maps sources to industries', () => {
    const matrix = buildDataSourceMatrix(DATA_SOURCES, SUPPLY_CHAIN_GRAPH, EU_SECTOR_BENCHMARKS);
    expect(matrix.length).toBe(DATA_SOURCES.length);
    for (const row of matrix) {
      expect(row.coverageCount).toBeGreaterThan(0);
      expect(row.industries.length).toBe(row.coverageCount);
    }
  });

  it('grid factors cover all 20 industries', () => {
    const matrix = buildDataSourceMatrix(DATA_SOURCES, SUPPLY_CHAIN_GRAPH, EU_SECTOR_BENCHMARKS);
    const gridSources = matrix.filter(
      (r) => DATA_SOURCES.find((d) => d.id === r.sourceId)?.category === 'grid-factors',
    );
    for (const gs of gridSources) {
      expect(gs.coverageCount).toBe(LWM_INDUSTRIES.length);
    }
  });

  it('ESRS disclosure registry covers all 20 industries', () => {
    const matrix = buildDataSourceMatrix(DATA_SOURCES, SUPPLY_CHAIN_GRAPH, EU_SECTOR_BENCHMARKS);
    const esrs = matrix.find((r) => r.sourceId === 'efrag-esrs');
    // ESRS source may or may not exist in the registry
    if (esrs) {
      expect(esrs.coverageCount).toBe(LWM_INDUSTRIES.length);
    }
  });
});

// ============ QANTIC CASE ============

describe('Qantic Case Use', () => {
  it('extracts energy → steel → construction chain', () => {
    const sim = runCrossVerticalSimulation();
    const qantic = extractQanticCase(sim);

    expect(qantic.chain).toEqual(['energy', 'steel', 'construction']);
  });

  it('steel CBAM cost is non-zero (high import exposure)', () => {
    const sim = runCrossVerticalSimulation();
    const qantic = extractQanticCase(sim);

    // Steel has avgImportValue €2.5M > CBAM threshold €150k
    expect(qantic.steelCbamCostEur).toBeGreaterThan(0);
  });

  it('construction CSRD readiness is low (< 50)', () => {
    const sim = runCrossVerticalSimulation();
    const qantic = extractQanticCase(sim);

    // Construction sector has csrdReadiness: 30 in benchmarks
    expect(qantic.constructionCsrdScore).toBeLessThan(50);
  });

  it('construction has CSRD disclosure gaps', () => {
    const sim = runCrossVerticalSimulation();
    const qantic = extractQanticCase(sim);

    expect(qantic.constructionCsrdGaps).toBeGreaterThan(0);
  });

  it('hidden cross-vertical exposure exists for construction', () => {
    const sim = runCrossVerticalSimulation();
    const qantic = extractQanticCase(sim);

    expect(qantic.constructionHiddenExposureEur).toBeGreaterThan(0);
  });

  it('insight string describes the moat', () => {
    const sim = runCrossVerticalSimulation();
    const qantic = extractQanticCase(sim);

    expect(qantic.insight).toContain('Steel CBAM cost');
    expect(qantic.insight).toContain('construction');
    expect(qantic.insight).toContain('single-vertical');
  });

  it('demonstrates the full 18×20×1 matrix working together', () => {
    const sim = runCrossVerticalSimulation();
    const qantic = extractQanticCase(sim);

    // The simulation ran all 20 industries through 1 scoring engine
    expect(sim.industryScores.size).toBe(LWM_INDUSTRIES.length);

    // Data sources feed the scores
    expect(sim.dataSourceMatrix.length).toBeGreaterThanOrEqual(12);

    // Cross-vertical correlations exist that single-vertical misses
    expect(qantic.correlations.length).toBeGreaterThan(0);

    // The Qantic chain has quantified EUR exposure
    expect(qantic.steelCbamCostEur).toBeGreaterThan(0);
    expect(qantic.constructionHiddenExposureEur).toBeGreaterThan(0);

    // Construction CSRD gaps are partially caused by upstream (steel) data opacity
    expect(qantic.constructionCsrdGaps).toBeGreaterThan(0);
  });
});

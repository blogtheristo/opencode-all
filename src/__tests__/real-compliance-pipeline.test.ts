/**
 * Real Compliance Pipeline Tests
 *
 * Tests for EU benchmarks, ESG report extraction, and public data integration.
 */

import { describe, expect, it } from 'vitest';
import { compareAgainstBenchmark, EU_SECTOR_BENCHMARKS, getBenchmark } from '../compliance/eu-benchmarks.js';
import { extractWithPatterns } from '../compliance/esg-report-extractor.js';
import { scoreCompliance } from '../compliance/scoring-engine.js';
import { getMandatoryDisclosures } from '../compliance/esrs-registry.js';

// ============ EU BENCHMARKS ============

describe('EU Sector Benchmarks', () => {
  it('contains benchmarks for all key CBAM sectors', () => {
    const sectors = EU_SECTOR_BENCHMARKS.map((b) => b.sector);
    expect(sectors).toContain('steel');
    expect(sectors).toContain('cement');
    expect(sectors).toContain('aluminium');
    expect(sectors).toContain('chemicals');
    expect(sectors).toContain('fertilizers');
    expect(sectors).toContain('hydrogen');
    expect(sectors).toContain('energy');
  });

  it('all benchmarks have valid data ranges', () => {
    for (const b of EU_SECTOR_BENCHMARKS) {
      expect(b.avgEmissions).toBeGreaterThan(0);
      expect(b.medianEmissions).toBeGreaterThan(0);
      expect(b.medianEmissions).toBeLessThanOrEqual(b.avgEmissions);
      expect(b.csrdReadiness).toBeGreaterThanOrEqual(0);
      expect(b.csrdReadiness).toBeLessThanOrEqual(100);
      expect(b.typicalMeasures.transitionPlan).toBeGreaterThanOrEqual(0);
      expect(b.typicalMeasures.transitionPlan).toBeLessThanOrEqual(100);
      expect(b.naceCode).toBeTruthy();
      expect(b.source).toBeTruthy();
      expect(b.year).toBeGreaterThanOrEqual(2023);
    }
  });

  it('getBenchmark returns correct sector', () => {
    const steel = getBenchmark('steel');
    expect(steel.sector).toBe('steel');
    expect(steel.avgEmissions).toBeGreaterThan(100_000);
  });

  it('getBenchmark falls back to manufacturing for unknown sectors', () => {
    const unknown = getBenchmark('underwater-basket-weaving');
    expect(unknown.sector).toBe('manufacturing');
  });

  it('benchmark comparison flags high emitters', () => {
    const comparison = compareAgainstBenchmark(
      'steel',
      500_000, // way above median
      { hasTransitionPlan: false, hasEmissionsMonitoring: false, hasSupplyChainDD: false },
      10,
    );
    expect(comparison.emissionsVsSector).toBe('above-average');
    expect(comparison.emissionsPercentile).toBeGreaterThan(65);
  });

  it('benchmark comparison flags low emitters', () => {
    const comparison = compareAgainstBenchmark(
      'steel',
      10_000, // way below median
      { hasTransitionPlan: true, hasEmissionsMonitoring: true, hasSupplyChainDD: true },
      80,
    );
    expect(comparison.emissionsVsSector).toBe('below-average');
    expect(comparison.emissionsPercentile).toBeLessThan(35);
  });
});

// ============ ESG REPORT EXTRACTION ============

describe('ESG Report Extraction', () => {
  const sampleReport = `
    ACME Steel Corporation
    Sustainability Report 2025

    Fiscal year 2025

    ACME Steel is headquartered in Helsinki, Finland.
    We employ approximately 1,200 people across our operations.
    Revenue: EUR 450 million for the reporting period.

    Climate Change (E1)

    Our total Scope 1 and 2 GHG emissions were 185,000 tonnes CO2e.
    Scope 1: 142,000 tonnes CO2e (direct emissions from steel production)
    Scope 2: 43,000 tonnes CO2e (purchased electricity and heat)
    Scope 3: 520,000 tonnes CO2e (value chain emissions)

    We have established a transition plan aligned with the Paris Agreement 1.5°C pathway.
    Our decarbonization roadmap targets 55% reduction by 2030 vs 2019 baseline.

    Our continuous emissions monitoring system covers all major production facilities.
    MRV system verified by independent third-party auditor.

    Supply Chain
    We conduct supply chain due diligence across our top 200 suppliers.
    CSDD assessment completed for all critical raw material suppliers.

    Energy consumption: 2,800 GWh total, 35% from renewable sources.
  `;

  it('extracts emissions from report text', () => {
    const result = extractWithPatterns(sampleReport);
    expect(result.scoringInput!.annualEmissions).toBe(185_000);
  });

  it('detects transition plan', () => {
    const result = extractWithPatterns(sampleReport);
    expect(result.scoringInput!.hasTransitionPlan).toBe(true);
  });

  it('detects emissions monitoring', () => {
    const result = extractWithPatterns(sampleReport);
    expect(result.scoringInput!.hasEmissionsMonitoring).toBe(true);
  });

  it('detects supply chain due diligence', () => {
    const result = extractWithPatterns(sampleReport);
    expect(result.scoringInput!.hasSupplyChainDD).toBe(true);
  });

  it('extracts scope-specific emissions', () => {
    const result = extractWithPatterns(sampleReport);
    const scope1 = result.extractedValues!.find((v) => v.fieldName === 'Scope 1 emissions');
    const scope2 = result.extractedValues!.find((v) => v.fieldName === 'Scope 2 emissions');
    expect(scope1?.value).toBe(142_000);
    expect(scope2?.value).toBe(43_000);
  });

  it('returns reasonable confidence for data-rich report', () => {
    const result = extractWithPatterns(sampleReport);
    expect(result.confidence).toBeGreaterThanOrEqual(0.5);
  });

  it('returns low confidence for sparse report', () => {
    const result = extractWithPatterns('Annual report 2025. Revenue was good.');
    expect(result.confidence).toBeLessThanOrEqual(0.5);
    expect(result.warnings!.length).toBeGreaterThan(0);
  });

  it('identifies ESRS data points from report content', () => {
    const result = extractWithPatterns(sampleReport);
    const provided = result.scoringInput!.dataPoints.filter((d) => d.provided);
    // Should detect at least E1 climate disclosures
    expect(provided.length).toBeGreaterThan(0);
    const e1Points = provided.filter((d) => d.disclosureId.startsWith('E1'));
    expect(e1Points.length).toBeGreaterThan(0);
  });
});

// ============ END-TO-END: EXTRACTION → SCORING ============

describe('Extraction to Scoring Pipeline', () => {
  it('extracted data produces valid scoring result', () => {
    const report = `
      Nordic Cement Oy — Sustainability Report 2025
      Helsinki, Finland

      Total GHG emissions: 320,000 tonnes CO2e
      Scope 1: 290,000 tonnes CO2e
      Scope 2: 30,000 tonnes CO2e

      We have a transition plan targeting carbon neutrality by 2040.
      Continuous emissions monitoring installed at all kilns.
      No formal supply chain due diligence program yet.
    `;

    const extraction = extractWithPatterns(report);
    extraction.scoringInput!.industry = 'cement';

    const result = scoreCompliance(extraction.scoringInput!);

    // With high emissions, no supply chain DD
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.overallScore).toBeLessThan(100);
    expect(result.regulationScores.length).toBe(3);

    // ETS should flag high emissions
    const ets = result.regulationScores.find((r) => r.regulation === 'ets');
    expect(ets).toBeDefined();
    // Has monitoring and transition plan, so ETS score should be reasonable
    expect(ets!.score).toBeGreaterThan(50);

    // CBAM should note missing supply chain DD
    const cbam = result.regulationScores.find((r) => r.regulation === 'cbam');
    expect(cbam).toBeDefined();
  });

  it('benchmark-based scoring produces stable results', () => {
    const benchmark = getBenchmark('steel');
    const mandatoryDisclosures = getMandatoryDisclosures();
    const benchmarkReadiness = benchmark.csrdReadiness / 100;

    const input = {
      industry: benchmark.sector,
      dataPoints: mandatoryDisclosures.map((d, i) => ({
        disclosureId: d.id,
        provided: i / mandatoryDisclosures.length < benchmarkReadiness,
      })),
      annualEmissions: benchmark.medianEmissions,
      importValue: benchmark.avgImportValue,
      hasTransitionPlan: benchmark.typicalMeasures.transitionPlan > 50,
      hasEmissionsMonitoring: benchmark.typicalMeasures.emissionsMonitoring > 50,
      hasSupplyChainDD: benchmark.typicalMeasures.supplyChainDD > 50,
    };

    const result1 = scoreCompliance(input);
    const result2 = scoreCompliance(input);

    // Deterministic — same input = same output
    expect(result1.overallScore).toBe(result2.overallScore);
    expect(result1.gaps.length).toBe(result2.gaps.length);
  });
});

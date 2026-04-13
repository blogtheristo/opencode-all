/**
 * Compliance Scoring Engine Tests
 *
 * Deterministic input→output tests for the core product logic.
 */

import { describe, expect, it } from 'vitest';
import { type ComplianceScoringInput, scoreCompliance } from '../compliance/scoring-engine.js';
import { ESRS_REGISTRY, getMandatoryDisclosures, MANDATORY_DISCLOSURES, TOTAL_DISCLOSURES } from '../compliance/esrs-registry.js';
import { generateReport } from '../compliance/report-generator.js';

// ============ ESRS REGISTRY TESTS ============

describe('ESRS Registry', () => {
  it('contains all disclosure categories', () => {
    const categories = new Set(ESRS_REGISTRY.map((d) => d.category));
    expect(categories).toContain('environment');
    expect(categories).toContain('social');
    expect(categories).toContain('governance');
  });

  it('has unique disclosure IDs', () => {
    const ids = ESRS_REGISTRY.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('getMandatoryDisclosures returns only mandatory ones', () => {
    const mandatory = getMandatoryDisclosures();
    expect(mandatory.length).toBeGreaterThan(0);
    expect(mandatory.every((d) => d.isMandatory)).toBe(true);
    expect(mandatory.length).toBe(MANDATORY_DISCLOSURES);
  });

  it('TOTAL_DISCLOSURES matches registry length', () => {
    expect(TOTAL_DISCLOSURES).toBe(ESRS_REGISTRY.length);
  });
});

// ============ SCORING ENGINE TESTS ============

describe('Compliance Scoring Engine', () => {
  const baseInput: ComplianceScoringInput = {
    industry: 'manufacturing',
    dataPoints: [],
    annualEmissions: 0,
    importValue: 0,
    hasTransitionPlan: false,
    hasEmissionsMonitoring: false,
    hasSupplyChainDD: false,
  };

  it('returns low score for empty data', () => {
    const result = scoreCompliance(baseInput);
    // CSRD score is 0 (no data), but ETS/CBAM are high (below threshold = low risk)
    // Overall: 0*0.50 + 85*0.25 + 90*0.25 ≈ 44 → partially-compliant
    expect(result.overallScore).toBeLessThan(60);
    expect(['non-compliant', 'partially-compliant']).toContain(result.complianceStatus);
    expect(result.gaps.length).toBeGreaterThan(0);
    expect(result.dataCompleteness).toBe(0);
  });

  it('improves score with data points provided', () => {
    const mandatory = getMandatoryDisclosures();
    const halfProvided = mandatory.slice(0, Math.ceil(mandatory.length / 2)).map((d) => ({
      disclosureId: d.id,
      provided: true,
    }));

    const result = scoreCompliance({
      ...baseInput,
      dataPoints: halfProvided,
    });

    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.dataCompleteness).toBeGreaterThan(30);
  });

  it('reaches compliant with full data + measures', () => {
    const allProvided = getMandatoryDisclosures().map((d) => ({
      disclosureId: d.id,
      provided: true,
    }));

    const result = scoreCompliance({
      ...baseInput,
      dataPoints: allProvided,
      hasTransitionPlan: true,
      hasEmissionsMonitoring: true,
      hasSupplyChainDD: true,
    });

    expect(result.overallScore).toBeGreaterThanOrEqual(80);
    expect(result.complianceStatus).toBe('compliant');
  });

  it('penalizes high emissions without monitoring', () => {
    const withMonitoring = scoreCompliance({
      ...baseInput,
      annualEmissions: 30000,
      hasEmissionsMonitoring: true,
    });

    const withoutMonitoring = scoreCompliance({
      ...baseInput,
      annualEmissions: 30000,
      hasEmissionsMonitoring: false,
    });

    const etsWithMon = withMonitoring.regulationScores.find((r) => r.regulation === 'ets');
    const etsWithoutMon = withoutMonitoring.regulationScores.find((r) => r.regulation === 'ets');

    expect(etsWithMon!.score).toBeGreaterThan(etsWithoutMon!.score);
  });

  it('penalizes high imports without supply chain DD', () => {
    const withDD = scoreCompliance({
      ...baseInput,
      importValue: 200000,
      hasSupplyChainDD: true,
    });

    const withoutDD = scoreCompliance({
      ...baseInput,
      importValue: 200000,
      hasSupplyChainDD: false,
    });

    const cbamWithDD = withDD.regulationScores.find((r) => r.regulation === 'cbam');
    const cbamWithoutDD = withoutDD.regulationScores.find((r) => r.regulation === 'cbam');

    expect(cbamWithDD!.score).toBeGreaterThan(cbamWithoutDD!.score);
  });

  it('identifies critical ETS gap for high emitters', () => {
    const result = scoreCompliance({
      ...baseInput,
      annualEmissions: 30000,
      hasEmissionsMonitoring: false,
    });

    const etsGaps = result.gaps.filter(
      (g) => g.regulation === 'ets' && g.severity === 'critical',
    );
    expect(etsGaps.length).toBeGreaterThan(0);
  });

  it('identifies critical CBAM gap for high importers', () => {
    const result = scoreCompliance({
      ...baseInput,
      importValue: 200000,
      hasSupplyChainDD: false,
    });

    const cbamGaps = result.gaps.filter(
      (g) => g.regulation === 'cbam' && g.severity === 'critical',
    );
    expect(cbamGaps.length).toBeGreaterThan(0);
  });

  it('generates recommendations for low scores', () => {
    const result = scoreCompliance(baseInput);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it('always returns all 3 regulation scores', () => {
    const result = scoreCompliance(baseInput);
    expect(result.regulationScores.length).toBe(3);
    const regs = result.regulationScores.map((r) => r.regulation).sort();
    expect(regs).toEqual(['cbam', 'csrd', 'ets']);
  });
});

// ============ REPORT GENERATOR TESTS ============

describe('Report Generator', () => {
  it('generates a valid report from scoring results', () => {
    const result = scoreCompliance({
      industry: 'steel',
      dataPoints: [],
      annualEmissions: 50000,
      importValue: 300000,
      hasTransitionPlan: false,
      hasEmissionsMonitoring: false,
      hasSupplyChainDD: false,
    });

    const report = generateReport(result, {
      name: 'Test Steel Corp',
      industry: 'steel',
      country: 'FI',
    });

    expect(report.reportId).toMatch(/^CR-/);
    expect(report.generatedAt).toBeTruthy();
    expect(report.company.name).toBe('Test Steel Corp');
    expect(report.summary.overallScore).toBe(result.overallScore);
    expect(report.summary.totalGaps).toBe(result.gaps.length);
    expect(report.regulationScores.length).toBe(3);
    expect(report.metadata.framework).toBe('DWS IQ Compliance Engine');
  });
});

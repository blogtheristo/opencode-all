/**
 * Compliance Engine Edge Case Tests
 *
 * Tests boundary conditions, industry-specific weights,
 * and the full assessment→report pipeline.
 */

import { describe, expect, it } from 'vitest';
import { type ComplianceScoringInput, scoreCompliance } from '../compliance/scoring-engine.js';
import { ESRS_REGISTRY, getMandatoryDisclosures } from '../compliance/esrs-registry.js';
import { generateReport } from '../compliance/report-generator.js';

const allMandatory = getMandatoryDisclosures().map((d) => ({
  disclosureId: d.id,
  provided: true,
}));

const baseInput: ComplianceScoringInput = {
  industry: 'manufacturing',
  dataPoints: [],
  annualEmissions: 0,
  importValue: 0,
  hasTransitionPlan: false,
  hasEmissionsMonitoring: false,
  hasSupplyChainDD: false,
};

// ============ BOUNDARY CONDITIONS ============

describe('Scoring Boundary Conditions', () => {
  it('scores exactly at ETS threshold (25,000 tonnes)', () => {
    const atThreshold = scoreCompliance({
      ...baseInput,
      annualEmissions: 25_000,
      hasEmissionsMonitoring: false,
    });
    const belowThreshold = scoreCompliance({
      ...baseInput,
      annualEmissions: 24_999,
      hasEmissionsMonitoring: false,
    });

    const etsAt = atThreshold.regulationScores.find((r) => r.regulation === 'ets')!;
    const etsBelow = belowThreshold.regulationScores.find((r) => r.regulation === 'ets')!;

    // At threshold should be penalized more heavily
    expect(etsAt.score).toBeLessThan(etsBelow.score);
  });

  it('scores exactly at CBAM threshold (EUR 150,000)', () => {
    const atThreshold = scoreCompliance({
      ...baseInput,
      importValue: 150_000,
      hasSupplyChainDD: false,
    });
    const belowThreshold = scoreCompliance({
      ...baseInput,
      importValue: 149_999,
      hasSupplyChainDD: false,
    });

    const cbamAt = atThreshold.regulationScores.find((r) => r.regulation === 'cbam')!;
    const cbamBelow = belowThreshold.regulationScores.find((r) => r.regulation === 'cbam')!;

    expect(cbamAt.score).toBeLessThan(cbamBelow.score);
  });

  it('score never exceeds 100', () => {
    const maxInput: ComplianceScoringInput = {
      industry: 'manufacturing',
      dataPoints: allMandatory,
      annualEmissions: 0,
      importValue: 0,
      hasTransitionPlan: true,
      hasEmissionsMonitoring: true,
      hasSupplyChainDD: true,
    };

    const result = scoreCompliance(maxInput);
    expect(result.overallScore).toBeLessThanOrEqual(100);
    for (const reg of result.regulationScores) {
      expect(reg.score).toBeLessThanOrEqual(100);
    }
  });

  it('score never goes below 0', () => {
    const worstCase: ComplianceScoringInput = {
      industry: 'steel',
      dataPoints: [],
      annualEmissions: 1_000_000,
      importValue: 10_000_000,
      hasTransitionPlan: false,
      hasEmissionsMonitoring: false,
      hasSupplyChainDD: false,
    };

    const result = scoreCompliance(worstCase);
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    for (const reg of result.regulationScores) {
      expect(reg.score).toBeGreaterThanOrEqual(0);
    }
  });
});

// ============ ALL-COMPLIANT SCENARIO ============

describe('All-Compliant Scenario', () => {
  it('reaches compliant status with complete data and all measures', () => {
    const fullyCompliant: ComplianceScoringInput = {
      industry: 'manufacturing',
      dataPoints: allMandatory,
      annualEmissions: 10_000,
      importValue: 50_000,
      hasTransitionPlan: true,
      hasEmissionsMonitoring: true,
      hasSupplyChainDD: true,
    };

    const result = scoreCompliance(fullyCompliant);

    expect(result.complianceStatus).toBe('compliant');
    expect(result.overallScore).toBeGreaterThanOrEqual(80);
    expect(result.dataCompleteness).toBe(100);
    // Should have few or no critical gaps
    const criticalGaps = result.gaps.filter((g) => g.severity === 'critical');
    expect(criticalGaps.length).toBe(0);
  });
});

// ============ INDUSTRY-SPECIFIC TESTS ============

describe('Industry-Specific Scoring', () => {
  const industries = ['energy', 'steel', 'cement', 'construction', 'transport', 'chemicals'];

  for (const industry of industries) {
    it(`scores ${industry} industry with partial data`, () => {
      const halfProvided = getMandatoryDisclosures()
        .slice(0, Math.ceil(getMandatoryDisclosures().length / 2))
        .map((d) => ({ disclosureId: d.id, provided: true }));

      const result = scoreCompliance({
        ...baseInput,
        industry,
        dataPoints: halfProvided,
        annualEmissions: 30_000,
        importValue: 200_000,
      });

      // All industries should return valid scores
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(result.regulationScores).toHaveLength(3);
      expect(result.gaps.length).toBeGreaterThan(0);
    });
  }
});

// ============ DATA COMPLETENESS ============

describe('Data Completeness Calculation', () => {
  it('returns 0% for no data points', () => {
    const result = scoreCompliance(baseInput);
    expect(result.dataCompleteness).toBe(0);
  });

  it('returns ~50% for half the mandatory disclosures', () => {
    const mandatory = getMandatoryDisclosures();
    const half = mandatory.slice(0, Math.ceil(mandatory.length / 2));

    const result = scoreCompliance({
      ...baseInput,
      dataPoints: half.map((d) => ({ disclosureId: d.id, provided: true })),
    });

    expect(result.dataCompleteness).toBeGreaterThan(40);
    expect(result.dataCompleteness).toBeLessThan(60);
  });

  it('returns 100% for all mandatory disclosures', () => {
    const result = scoreCompliance({
      ...baseInput,
      dataPoints: allMandatory,
    });
    expect(result.dataCompleteness).toBe(100);
  });

  it('ignores non-mandatory provided data points in completeness', () => {
    const nonMandatory = ESRS_REGISTRY
      .filter((d) => !d.isMandatory)
      .map((d) => ({ disclosureId: d.id, provided: true }));

    const result = scoreCompliance({
      ...baseInput,
      dataPoints: nonMandatory,
    });

    // Non-mandatory data should not count toward mandatory completeness
    expect(result.dataCompleteness).toBe(0);
  });
});

// ============ GAP IDENTIFICATION ============

describe('Gap Identification', () => {
  it('flags missing transition plan gap', () => {
    const result = scoreCompliance({
      ...baseInput,
      hasTransitionPlan: false,
    });

    const transitionGap = result.gaps.find(
      (g) => g.disclosureId === 'E1-1' && g.regulation === 'csrd' && g.gap.includes('transition plan'),
    );
    expect(transitionGap).toBeDefined();
    // E1-1 transition plan is flagged as high by buildRecommendations
    expect(['critical', 'high']).toContain(transitionGap!.severity);
  });

  it('flags E1 mandatory disclosures as critical in CSRD gap list', () => {
    const result = scoreCompliance(baseInput);
    const e1MandatoryGaps = result.gaps.filter(
      (g) => g.disclosureId?.startsWith('E1') && g.regulation === 'csrd'
        && !g.gap.includes('transition plan'), // Exclude the separate transition plan gap
    );

    // E1 mandatory data point gaps should be critical
    for (const gap of e1MandatoryGaps) {
      expect(gap.severity).toBe('critical');
    }
  });

  it('generates no duplicate gap entries', () => {
    const result = scoreCompliance({
      ...baseInput,
      annualEmissions: 50_000,
      importValue: 500_000,
    });

    const gapKeys = result.gaps.map(
      (g) => `${g.regulation}-${g.gap}-${g.disclosureId || 'none'}`,
    );
    expect(new Set(gapKeys).size).toBe(gapKeys.length);
  });
});

// ============ FULL PIPELINE TEST ============

describe('Assessment → Report Pipeline', () => {
  it('produces a valid report from worst-case assessment', () => {
    const worstCase: ComplianceScoringInput = {
      industry: 'steel',
      dataPoints: [],
      annualEmissions: 500_000,
      importValue: 5_000_000,
      hasTransitionPlan: false,
      hasEmissionsMonitoring: false,
      hasSupplyChainDD: false,
    };

    const result = scoreCompliance(worstCase);
    const report = generateReport(result, {
      name: 'Worst Case Steel AG',
      industry: 'steel',
      country: 'DE',
    });

    expect(report.reportId).toMatch(/^CR-/);
    expect(report.company.name).toBe('Worst Case Steel AG');
    expect(report.summary.overallScore).toBeLessThan(50);
    expect(report.summary.criticalGaps).toBeGreaterThan(0);
    expect(report.recommendations.length).toBeGreaterThan(0);
    expect(report.regulationScores).toHaveLength(3);
  });

  it('produces a valid report from best-case assessment', () => {
    const bestCase: ComplianceScoringInput = {
      industry: 'manufacturing',
      dataPoints: allMandatory,
      annualEmissions: 5_000,
      importValue: 10_000,
      hasTransitionPlan: true,
      hasEmissionsMonitoring: true,
      hasSupplyChainDD: true,
    };

    const result = scoreCompliance(bestCase);
    const report = generateReport(result, {
      name: 'Best Case Manufacturing GmbH',
      industry: 'manufacturing',
      country: 'FI',
    });

    expect(report.summary.overallScore).toBeGreaterThanOrEqual(80);
    expect(report.summary.criticalGaps).toBe(0);
    expect(report.metadata.framework).toBe('DWS IQ Compliance Engine');
  });
});

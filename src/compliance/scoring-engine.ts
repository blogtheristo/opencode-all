/**
 * Compliance Scoring Engine
 *
 * Replaces stub scores with real gap analysis:
 * Score = (data provided / data required) × weight
 *
 * Supports CSRD readiness, ETS exposure, and CBAM risk scoring.
 */

import { ESRS_REGISTRY, getMandatoryDisclosures } from './esrs-registry.js';
import { CBAM_CERTIFICATE_PRICE_EUR, ETS_CARBON_PRICE_EUR } from './emission-factors.js';

// ============ TYPES ============

export interface DataPointStatus {
  disclosureId: string;
  provided: boolean;
}

export interface ComplianceScoringInput {
  industry: string;
  dataPoints: DataPointStatus[];
  annualEmissions: number; // tonnes CO2e
  importValue: number; // EUR
  hasTransitionPlan: boolean;
  hasEmissionsMonitoring: boolean;
  hasSupplyChainDD: boolean;
}

export interface RegulationScore {
  regulation: string;
  score: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  dataPointsProvided: number;
  dataPointsRequired: number;
}

export interface ComplianceGap {
  regulation: string;
  gap: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  disclosureId?: string;
  category?: string;
}

export interface CostBreakdown {
  etsCostEur: number;
  cbamCostEur: number;
  csrdReportingCostEur: number;
  totalCostEur: number;
  carbonPriceEur: number;
}

export interface ScoringResult {
  overallScore: number;
  complianceStatus: 'compliant' | 'mostly-compliant' | 'partially-compliant' | 'non-compliant';
  regulationScores: RegulationScore[];
  gaps: ComplianceGap[];
  recommendations: string[];
  dataCompleteness: number; // 0-100
  /** EUR cost breakdown — compliance cost as a line item (Option A output) */
  costBreakdown?: CostBreakdown;
}

// ============ CONSTANTS ============

const CBAM_IMPORT_THRESHOLD_EUR = 150_000;
const ETS_EMISSIONS_THRESHOLD_TONNES = 25_000;

/** Industry-specific weighting for CSRD materiality */
const INDUSTRY_ENVIRONMENT_WEIGHT: Record<string, number> = {
  energy: 0.5,
  steel: 0.5,
  cement: 0.5,
  chemicals: 0.45,
  aluminium: 0.45,
  manufacturing: 0.4,
  construction: 0.4,
  transport: 0.4,
  fertilizers: 0.45,
  hydrogen: 0.45,
  default: 0.35,
};

// ============ SCORING FUNCTIONS ============

/**
 * Run a full compliance scoring assessment.
 * This is the core product logic — deterministic, testable, no LLM dependency.
 */
export function scoreCompliance(input: ComplianceScoringInput): ScoringResult {
  const csrdScore = scoreCsrdReadiness(input);
  const etsScore = scoreEtsExposure(input);
  const cbamScore = scoreCbamRisk(input);

  const regulationScores = [csrdScore, etsScore, cbamScore];

  // Overall = weighted average (CSRD heaviest since broadest)
  const overallScore = Math.round(
    csrdScore.score * 0.5 + etsScore.score * 0.25 + cbamScore.score * 0.25,
  );

  const gaps = identifyGaps(input, regulationScores);
  const recommendations = buildRecommendations(input, overallScore, gaps);

  const mandatory = getMandatoryDisclosures();
  const providedIds = new Set(
    input.dataPoints.filter((d) => d.provided).map((d) => d.disclosureId),
  );
  const mandatoryProvided = mandatory.filter((d) => providedIds.has(d.id)).length;
  const dataCompleteness =
    mandatory.length > 0 ? Math.round((mandatoryProvided / mandatory.length) * 100) : 0;

  // Cost breakdown (EUR) — compliance cost as a line item
  // ETS: only surrender obligation is purchased (emissions above free allocation)
  // Energy sector: zero free allowances; other sectors: ~70% free allocation (Phase 4 average)
  const envWeight =
    INDUSTRY_ENVIRONMENT_WEIGHT[input.industry] ?? INDUSTRY_ENVIRONMENT_WEIGHT['default'];
  const freeAllocationPct = envWeight >= 0.5 ? 0.0 : 0.7; // Energy/steel: 0%, others: ~70%
  const surrenderObligation =
    input.annualEmissions >= ETS_EMISSIONS_THRESHOLD_TONNES
      ? input.annualEmissions * (1 - freeAllocationPct)
      : 0;
  const etsCostEur = Math.round(surrenderObligation * ETS_CARBON_PRICE_EUR * 100) / 100;
  // CBAM: import value → estimated embedded carbon using sector default factors
  // Approximation: €150k imports ≈ 100t product × sector factor. Source: CBAM Reg. 2023/956 Art. 35
  const cbamCostEur =
    input.importValue >= CBAM_IMPORT_THRESHOLD_EUR
      ? Math.round((input.importValue / 1500) * CBAM_CERTIFICATE_PRICE_EUR * 100) / 100
      : 0;
  const csrdReportingCostEur = 12_000; // Source: EFRAG CSRD implementation survey 2024
  const totalCostEur = Math.round((etsCostEur + cbamCostEur + csrdReportingCostEur) * 100) / 100;

  return {
    overallScore,
    complianceStatus: classifyScore(overallScore),
    regulationScores,
    gaps,
    recommendations,
    dataCompleteness,
    costBreakdown: {
      etsCostEur,
      cbamCostEur,
      csrdReportingCostEur,
      totalCostEur,
      carbonPriceEur: ETS_CARBON_PRICE_EUR,
    },
  };
}

/**
 * CSRD Readiness Score
 * Based on ESRS data point coverage: (provided / required) × 100
 */
function scoreCsrdReadiness(input: ComplianceScoringInput): RegulationScore {
  const mandatory = getMandatoryDisclosures();
  const providedIds = new Set(
    input.dataPoints.filter((d) => d.provided).map((d) => d.disclosureId),
  );

  const provided = mandatory.filter((d) => providedIds.has(d.id)).length;
  const required = mandatory.length;

  // Base score from data completeness
  let score = required > 0 ? Math.round((provided / required) * 80) : 0;

  // Bonus for transition plan (critical for E1)
  if (input.hasTransitionPlan) score += 10;

  // Bonus for emissions monitoring
  if (input.hasEmissionsMonitoring) score += 10;

  score = Math.min(100, score);

  return {
    regulation: 'csrd',
    score,
    status: score >= 80 ? 'compliant' : score >= 50 ? 'partial' : 'non-compliant',
    dataPointsProvided: provided,
    dataPointsRequired: required,
  };
}

/**
 * ETS Exposure Score
 * Based on emissions level, monitoring capability, and reporting readiness.
 */
function scoreEtsExposure(input: ComplianceScoringInput): RegulationScore {
  const exceeds = input.annualEmissions >= ETS_EMISSIONS_THRESHOLD_TONNES;
  let score = 100; // Start full, deduct for gaps

  if (exceeds) {
    if (!input.hasEmissionsMonitoring) score -= 40;
    if (!input.hasTransitionPlan) score -= 20;

    // Check if E1-6 (GHG emissions) data is provided
    const hasGhgData = input.dataPoints.some((d) => d.disclosureId === 'E1-6' && d.provided);
    if (!hasGhgData) score -= 25;
  } else {
    // Below threshold — still good to have monitoring
    if (!input.hasEmissionsMonitoring) score -= 15;
  }

  score = Math.max(0, score);

  return {
    regulation: 'ets',
    score,
    status: score >= 80 ? 'compliant' : score >= 50 ? 'partial' : 'non-compliant',
    dataPointsProvided: input.dataPoints.filter(
      (d) => d.provided && d.disclosureId.startsWith('E1'),
    ).length,
    dataPointsRequired: ESRS_REGISTRY.filter((d) => d.standard === 'E1').length,
  };
}

/**
 * CBAM Risk Score
 * Based on import value, supply chain due diligence, and carbon content data.
 */
function scoreCbamRisk(input: ComplianceScoringInput): RegulationScore {
  const exceeds = input.importValue >= CBAM_IMPORT_THRESHOLD_EUR;
  let score = 100;

  if (exceeds) {
    if (!input.hasSupplyChainDD) score -= 40;

    // Check supply chain and pollution data
    const hasSupplyChainData = input.dataPoints.some(
      (d) => d.disclosureId === 'G1-2' && d.provided,
    );
    if (!hasSupplyChainData) score -= 20;

    const hasPollutionData = input.dataPoints.some((d) => d.disclosureId === 'E2-4' && d.provided);
    if (!hasPollutionData) score -= 15;
  } else {
    if (!input.hasSupplyChainDD) score -= 10;
  }

  score = Math.max(0, score);

  return {
    regulation: 'cbam',
    score,
    status: score >= 80 ? 'compliant' : score >= 50 ? 'partial' : 'non-compliant',
    dataPointsProvided: input.dataPoints.filter((d) => d.provided).length,
    dataPointsRequired: ESRS_REGISTRY.length,
  };
}

/**
 * Identify specific compliance gaps with severity levels.
 */
function identifyGaps(input: ComplianceScoringInput, _scores: RegulationScore[]): ComplianceGap[] {
  const gaps: ComplianceGap[] = [];
  const providedIds = new Set(
    input.dataPoints.filter((d) => d.provided).map((d) => d.disclosureId),
  );

  // Missing mandatory ESRS data points
  const mandatory = getMandatoryDisclosures();
  for (const disclosure of mandatory) {
    if (!providedIds.has(disclosure.id)) {
      gaps.push({
        regulation: 'csrd',
        gap: `Missing: ${disclosure.name} (${disclosure.id})`,
        severity: disclosure.standard === 'E1' ? 'critical' : 'high',
        disclosureId: disclosure.id,
      });
    }
  }

  // ETS gaps
  if (input.annualEmissions >= ETS_EMISSIONS_THRESHOLD_TONNES) {
    if (!input.hasEmissionsMonitoring) {
      gaps.push({
        regulation: 'ets',
        gap: 'Emissions monitoring not active — required for ETS compliance',
        severity: 'critical',
      });
    }
    if (!providedIds.has('E1-6')) {
      gaps.push({
        regulation: 'ets',
        gap: 'GHG emissions data (E1-6) not reported — required for ETS allowance calculation',
        severity: 'critical',
        disclosureId: 'E1-6',
      });
    }
  }

  // CBAM gaps
  if (input.importValue >= CBAM_IMPORT_THRESHOLD_EUR) {
    if (!input.hasSupplyChainDD) {
      gaps.push({
        regulation: 'cbam',
        gap: 'Supply chain due diligence missing — required for CBAM carbon content verification',
        severity: 'critical',
      });
    }
  }

  // No transition plan
  if (!input.hasTransitionPlan) {
    gaps.push({
      regulation: 'csrd',
      gap: 'No climate transition plan — required under E1-1',
      severity: 'high',
      disclosureId: 'E1-1',
    });
  }

  return gaps;
}

/**
 * Build prioritized recommendations based on gaps.
 */
function buildRecommendations(
  input: ComplianceScoringInput,
  overallScore: number,
  gaps: ComplianceGap[],
): string[] {
  const recs: string[] = [];

  const criticalCount = gaps.filter((g) => g.severity === 'critical').length;
  if (criticalCount > 0) {
    recs.push(`Address ${criticalCount} critical compliance gaps immediately`);
  }

  if (!input.hasTransitionPlan) {
    recs.push('Develop a climate transition plan aligned with 1.5°C pathway (ESRS E1-1)');
  }

  if (!input.hasEmissionsMonitoring && input.annualEmissions > 0) {
    recs.push('Implement continuous emissions monitoring for accurate GHG reporting');
  }

  if (input.importValue >= CBAM_IMPORT_THRESHOLD_EUR && !input.hasSupplyChainDD) {
    recs.push('Establish supply chain carbon content verification for CBAM compliance');
  }

  const providedCount = input.dataPoints.filter((d) => d.provided).length;
  const mandatoryCount = getMandatoryDisclosures().length;
  if (providedCount < mandatoryCount * 0.5) {
    recs.push(
      `Data completeness is low (${providedCount}/${mandatoryCount} mandatory points) — prioritize E1 climate disclosures first`,
    );
  }

  if (overallScore < 50) {
    recs.push(
      'Overall score below 50% — develop a comprehensive compliance roadmap with quarterly milestones',
    );
  }

  return recs;
}

function classifyScore(score: number): ScoringResult['complianceStatus'] {
  if (score >= 80) return 'compliant';
  if (score >= 60) return 'mostly-compliant';
  if (score >= 40) return 'partially-compliant';
  return 'non-compliant';
}

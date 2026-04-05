/**
 * Compliance Report Generator
 *
 * Generates structured JSON compliance reports that can be submitted to auditors.
 * PDF generation is Phase 2 — JSON is sufficient for MVP.
 */

import type { ScoringResult } from './scoring-engine.js';

export interface ComplianceReport {
  reportId: string;
  generatedAt: string;
  company: {
    name: string;
    industry: string;
    country: string;
  };
  summary: {
    overallScore: number;
    complianceStatus: string;
    dataCompleteness: number;
    criticalGaps: number;
    totalGaps: number;
  };
  regulationScores: Array<{
    regulation: string;
    score: number;
    status: string;
    dataPointsProvided: number;
    dataPointsRequired: number;
  }>;
  gaps: Array<{
    regulation: string;
    gap: string;
    severity: string;
    disclosureId?: string;
  }>;
  recommendations: string[];
  metadata: {
    assessmentVersion: string;
    esrsStandard: string;
    framework: string;
  };
}

/**
 * Generate a structured compliance report from scoring results.
 */
export function generateReport(
  scoringResult: ScoringResult,
  company: { name: string; industry: string; country: string },
): ComplianceReport {
  // Partial ScoringResult inputs can arrive from upstream mappers where
  // certain arrays have not been populated (e.g. early pipeline stages).
  // Normalize to empty arrays so .filter/.length never crashes.
  const gaps = scoringResult.gaps ?? [];
  const regulationScores = scoringResult.regulationScores ?? [];
  const recommendations = scoringResult.recommendations ?? [];

  const criticalGaps = gaps.filter((g) => g.severity === 'critical').length;

  return {
    reportId: `CR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    generatedAt: new Date().toISOString(),
    company,
    summary: {
      overallScore: scoringResult.overallScore,
      complianceStatus: scoringResult.complianceStatus,
      dataCompleteness: scoringResult.dataCompleteness,
      criticalGaps,
      totalGaps: gaps.length,
    },
    regulationScores,
    gaps,
    recommendations,
    metadata: {
      assessmentVersion: '1.0.0',
      esrsStandard: 'ESRS 2023',
      framework: 'DWS IQ Compliance Engine',
    },
  };
}

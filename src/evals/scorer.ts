/**
 * Eval Scorer — DWS IQ Agent Quality Metrics
 *
 * Scoring functions for the agent eval harness.
 * Each function returns a score 0.0–1.0 and a human-readable reason.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (claude/agent-monitoring-evals-qatA6)
 * Date: 2026-05-08
 * Owner: Lifetime Oy
 */

import type { AgentResponse } from '../agents/types.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EvalExpected {
  /** Required result fields and their expected values (exact match or contained-in for arrays) */
  result?: Record<string, unknown>;
  /** Confidence must be >= this value (default 0.5) */
  confidence_min?: number;
  /** Confidence must be <= this value (default 1.0) */
  confidence_max?: number;
  /** Keywords that must appear in reasoning (case-insensitive) */
  keywords?: string[];
  /** Recommendations must include at least one of these strings */
  recommendations_any?: string[];
}

export interface ScoreResult {
  score: number; // 0.0–1.0 composite
  passed: boolean; // score >= passing threshold
  breakdown: {
    fieldAccuracy: number;
    confidenceBand: number;
    keywordCoverage: number;
    recommendationHit: number;
  };
  reasons: string[]; // human-readable failure reasons
}

// ─── Individual scorers ───────────────────────────────────────────────────────

/**
 * Check that required result fields match expected values.
 * Supports dot-notation paths (e.g. "regulation.id").
 */
export function scoreFieldAccuracy(
  response: AgentResponse,
  expected: Record<string, unknown>,
): { score: number; reasons: string[] } {
  const keys = Object.keys(expected);
  if (keys.length === 0) return { score: 1, reasons: [] };

  let hits = 0;
  const reasons: string[] = [];

  for (const key of keys) {
    const actual = getNestedValue(response.result, key);
    const exp = expected[key];

    if (actual === undefined || actual === null) {
      reasons.push(`Missing field "${key}" in result`);
      continue;
    }

    if (Array.isArray(exp)) {
      // Array expected: actual must be contained in expected array
      if (exp.includes(actual)) {
        hits++;
      } else {
        reasons.push(`Field "${key}": got "${actual}", expected one of [${exp.join(', ')}]`);
      }
    } else if (typeof exp === 'boolean') {
      if (actual === exp) {
        hits++;
      } else {
        reasons.push(`Field "${key}": got ${actual}, expected ${exp}`);
      }
    } else if (typeof exp === 'number') {
      // Allow ±10% tolerance for numeric fields
      const tolerance = Math.abs(exp) * 0.1;
      if (Math.abs((actual as number) - exp) <= tolerance) {
        hits++;
      } else {
        reasons.push(`Field "${key}": got ${actual}, expected ${exp} (±10%)`);
      }
    } else {
      if (String(actual).toLowerCase() === String(exp).toLowerCase()) {
        hits++;
      } else {
        reasons.push(`Field "${key}": got "${actual}", expected "${exp}"`);
      }
    }
  }

  return { score: hits / keys.length, reasons };
}

/** Check that confidence falls within the acceptable band. */
export function scoreConfidenceBand(
  response: AgentResponse,
  min = 0.5,
  max = 1.0,
): { score: number; reasons: string[] } {
  const c = response.confidence;
  if (c >= min && c <= max) return { score: 1, reasons: [] };

  const reason =
    c < min
      ? `Confidence too low: ${c.toFixed(2)} < ${min}`
      : `Confidence suspiciously high: ${c.toFixed(2)} > ${max}`;

  return { score: 0, reasons: [reason] };
}

/** Check that required keywords appear in the reasoning text. */
export function scoreKeywordCoverage(
  response: AgentResponse,
  keywords: string[],
): { score: number; reasons: string[] } {
  if (keywords.length === 0) return { score: 1, reasons: [] };

  const text = response.reasoning.toLowerCase();
  const missing: string[] = [];
  let hits = 0;

  for (const kw of keywords) {
    if (text.includes(kw.toLowerCase())) {
      hits++;
    } else {
      missing.push(kw);
    }
  }

  const score = hits / keywords.length;
  const reasons =
    missing.length > 0 ? [`Keywords missing from reasoning: ${missing.join(', ')}`] : [];
  return { score, reasons };
}

/** Check that at least one expected recommendation substring appears. */
export function scoreRecommendationHit(
  response: AgentResponse,
  expectedAny: string[],
): { score: number; reasons: string[] } {
  if (expectedAny.length === 0) return { score: 1, reasons: [] };

  const allRecs = response.recommendations.join(' ').toLowerCase();
  const hit = expectedAny.some((r) => allRecs.includes(r.toLowerCase()));

  if (hit) return { score: 1, reasons: [] };
  return {
    score: 0,
    reasons: [`None of the expected recommendations found: [${expectedAny.join(', ')}]`],
  };
}

// ─── Composite scorer ─────────────────────────────────────────────────────────

const WEIGHTS = {
  fieldAccuracy: 0.5,
  confidenceBand: 0.2,
  keywordCoverage: 0.2,
  recommendationHit: 0.1,
};

const PASS_THRESHOLD = 0.7;

export function scoreResponse(response: AgentResponse, expected: EvalExpected): ScoreResult {
  const fieldResult = scoreFieldAccuracy(response, expected.result ?? {});
  const confResult = scoreConfidenceBand(
    response,
    expected.confidence_min ?? 0.5,
    expected.confidence_max ?? 1.0,
  );
  const kwResult = scoreKeywordCoverage(response, expected.keywords ?? []);
  const recResult = scoreRecommendationHit(response, expected.recommendations_any ?? []);

  const breakdown = {
    fieldAccuracy: fieldResult.score,
    confidenceBand: confResult.score,
    keywordCoverage: kwResult.score,
    recommendationHit: recResult.score,
  };

  const score =
    breakdown.fieldAccuracy * WEIGHTS.fieldAccuracy +
    breakdown.confidenceBand * WEIGHTS.confidenceBand +
    breakdown.keywordCoverage * WEIGHTS.keywordCoverage +
    breakdown.recommendationHit * WEIGHTS.recommendationHit;

  const reasons = [
    ...fieldResult.reasons,
    ...confResult.reasons,
    ...kwResult.reasons,
    ...recResult.reasons,
  ];

  return {
    score: Math.round(score * 1000) / 1000,
    passed: score >= PASS_THRESHOLD,
    breakdown,
    reasons,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getNestedValue(obj: Record<string, unknown>, dotPath: string): unknown {
  return dotPath.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && !Array.isArray(acc)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

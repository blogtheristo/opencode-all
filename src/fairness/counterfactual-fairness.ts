/**
 * Counterfactual Fairness — Situation Testing (mutatis-mutandis methodology)
 *
 * Code-Version: 1.0
 * Branch: claude/mutatis-fairness-pilot-3jmbb5
 * Date: 2026-06-23
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Reimplements (in TypeScript, from the published paper — no code vendored)
 * the counterfactual situation-testing measure for discrimination analysis:
 *   "Mutatis Mutandis: Revisiting the Comparator in Discrimination Testing"
 *   (forthcoming, Computational Intelligence). Reference implementation:
 *   github.com/SantanderAI/mutatis-mutandis (Apache-2.0; original research
 *   repo cc-jalvarez/revisiting-the-comparator).
 *
 * Method (pilot scope): for each member of the protected group, construct a
 * counterfactual comparator by flipping the protected attribute while holding
 * the legitimate attributes fixed (the "ceteris paribus" comparator), then
 * compare the decision the model would have made. The discrimination signal is
 * the difference in outcomes between the factual individual and their
 * counterfactual comparator. The paper's contribution — generating the
 * comparator through a causal model (true "mutatis mutandis") rather than
 * holding attributes fixed — is documented as out-of-scope future work; the
 * pilot uses the simpler comparator and says so in the artifact.
 *
 * Per CLAUDE.md Rule 5/9, the measurement is deterministic code (not an LLM)
 * and asserts intent: the deltas are a direct function of the protected
 * attribute, so a model that ignored it would measure zero — the test proves
 * the metric moves when the attribute is flipped.
 */

import {
  decideLoan,
  flipGender,
  type LoanDecision,
  type LoanDecisionConfig,
} from './financed-decision.js';
import type { Gender, LendingApplicant } from '../synthetic-data/lending-applicants.js';

// ============ TYPES ============

export interface FairnessConfig extends LoanDecisionConfig {
  /** The group treated as protected/disadvantaged (the side we test for harm). */
  protectedGroupValue?: Gender;
  /** Max tolerated mean approval-rate gap (|delta|) before FAIL. Default 0.02. */
  approvalGapThreshold?: number;
  /** Max tolerated decision flip rate before FAIL. Default 0.02. */
  flipRateThreshold?: number;
}

/** Per-record factual vs counterfactual comparison. */
export interface CounterfactualPair {
  applicantId: string;
  /** Factual protected-attribute value. */
  factualGender: Gender;
  /** Comparator (flipped) value. */
  comparatorGender: Gender;
  factualApproved: boolean;
  comparatorApproved: boolean;
  factualScore: number;
  comparatorScore: number;
  /** factualScore − comparatorScore. Negative ⇒ the factual individual is scored lower. */
  scoreDelta: number;
  /** True when the lend/no-lend decision changes under the flip. */
  decisionFlipped: boolean;
}

export interface FairnessResult {
  protectedAttribute: 'gender';
  protectedGroupValue: Gender;
  comparator: 'ceteris-paribus-flip';
  /** Number of protected-group records evaluated. */
  n: number;
  /** Mean (factualScore − comparatorScore) over the protected group. */
  meanScoreDelta: number;
  /** Approval rate of the protected group, factual decision. */
  protectedApprovalRate: number;
  /** Approval rate of the same individuals as their comparator. */
  comparatorApprovalRate: number;
  /** protectedApprovalRate − comparatorApprovalRate. Negative ⇒ adverse treatment. */
  approvalRateGap: number;
  /** Fraction of protected-group records whose decision flips under the comparator. */
  flipRate: number;
  /** Thresholds applied for the pass/fail verdict. */
  thresholds: { approvalGapThreshold: number; flipRateThreshold: number };
  /** PASS only if both |approvalRateGap| and flipRate are within threshold. */
  passed: boolean;
  /** Per-record evidence (Rule 12 — surface the numbers, don't hide them). */
  pairs: CounterfactualPair[];
}

// ============ COMPARATOR CONSTRUCTION ============

/**
 * Build the counterfactual comparator for one applicant by flipping the
 * protected attribute and holding every legitimate attribute fixed.
 */
export function generateCounterfactual(applicant: LendingApplicant): LendingApplicant {
  return { ...applicant, gender: flipGender(applicant.gender) };
}

// ============ MEASUREMENT ============

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/**
 * Measure counterfactual fairness of the lending decision over a dataset.
 * Fails loud (Rule 12) on an empty/invalid dataset rather than reporting a
 * vacuous PASS.
 */
export function measureCounterfactualFairness(
  applicants: ReadonlyArray<LendingApplicant>,
  config: FairnessConfig = {},
): FairnessResult {
  if (!Array.isArray(applicants) || applicants.length === 0) {
    throw new Error(
      'measureCounterfactualFairness: dataset is empty — refusing to emit a vacuous result',
    );
  }

  const protectedGroupValue: Gender = config.protectedGroupValue ?? 'female';
  if (protectedGroupValue !== 'female' && protectedGroupValue !== 'male') {
    throw new Error(
      `measureCounterfactualFairness: protectedGroupValue must be 'female' or 'male'`,
    );
  }

  const approvalGapThreshold = config.approvalGapThreshold ?? 0.02;
  const flipRateThreshold = config.flipRateThreshold ?? 0.02;
  // Thresholds outside (0, 1] would let any model pass — that is the vacuous-PASS
  // compliance-integrity risk. Reject it loudly rather than seal false evidence.
  for (const [name, value] of [
    ['approvalGapThreshold', approvalGapThreshold],
    ['flipRateThreshold', flipRateThreshold],
  ] as const) {
    if (!Number.isFinite(value) || value <= 0 || value > 1) {
      throw new Error(
        `measureCounterfactualFairness: ${name} must be a finite number in (0, 1], got ${value}`,
      );
    }
  }
  const decisionConfig: LoanDecisionConfig = {
    protectedPenalty: config.protectedPenalty,
    threshold: config.threshold,
  };

  // Validate record shape up front so a malformed dataset fails loud with a
  // structured message, not a deep error that leaks the raw record.
  applicants.forEach((a, i) => {
    const ok =
      a &&
      typeof a.applicantId === 'string' &&
      (a.gender === 'female' || a.gender === 'male') &&
      Number.isFinite(a.annualIncomeEur) &&
      Number.isFinite(a.creditScore) &&
      Number.isFinite(a.debtToIncomeRatio) &&
      Number.isFinite(a.employmentYears) &&
      Number.isFinite(a.requestedAmountEur) &&
      Number.isFinite(a.loanTermMonths);
    if (!ok) {
      throw new Error(`measureCounterfactualFairness: malformed applicant record at index ${i}`);
    }
  });

  const protectedGroup = applicants.filter((a) => a.gender === protectedGroupValue);
  if (protectedGroup.length === 0) {
    throw new Error(
      `measureCounterfactualFairness: no records in protected group '${protectedGroupValue}' — cannot test for discrimination`,
    );
  }

  const pairs: CounterfactualPair[] = protectedGroup.map((applicant) => {
    const factual: LoanDecision = decideLoan(applicant, decisionConfig);
    const comparator: LoanDecision = decideLoan(generateCounterfactual(applicant), decisionConfig);
    return {
      applicantId: applicant.applicantId,
      factualGender: applicant.gender,
      comparatorGender: flipGender(applicant.gender),
      factualApproved: factual.approved,
      comparatorApproved: comparator.approved,
      factualScore: factual.score,
      comparatorScore: comparator.score,
      scoreDelta: round4(factual.score - comparator.score),
      decisionFlipped: factual.approved !== comparator.approved,
    };
  });

  const n = pairs.length;
  const meanScoreDelta = round4(pairs.reduce((s, p) => s + p.scoreDelta, 0) / n);
  const protectedApprovalRate = round4(pairs.filter((p) => p.factualApproved).length / n);
  const comparatorApprovalRate = round4(pairs.filter((p) => p.comparatorApproved).length / n);
  const approvalRateGap = round4(protectedApprovalRate - comparatorApprovalRate);
  const flipRate = round4(pairs.filter((p) => p.decisionFlipped).length / n);

  const passed = Math.abs(approvalRateGap) <= approvalGapThreshold && flipRate <= flipRateThreshold;

  return {
    protectedAttribute: 'gender',
    protectedGroupValue,
    comparator: 'ceteris-paribus-flip',
    n,
    meanScoreDelta,
    protectedApprovalRate,
    comparatorApprovalRate,
    approvalRateGap,
    flipRate,
    thresholds: { approvalGapThreshold, flipRateThreshold },
    passed,
    pairs,
  };
}

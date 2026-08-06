/**
 * Financed-Decision Path — Deterministic Lending Decision (Fairness Pilot)
 *
 * Code-Version: 1.0
 * Branch: claude/mutatis-fairness-pilot-3jmbb5
 * Date: 2026-06-23
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * The single financed-decision / lending path the counterfactual-fairness
 * check runs against. Per CLAUDE.md Rule 5, the decision is DETERMINISTIC
 * code (no LLM): a creditworthiness score from legitimate attributes against
 * a fixed threshold. This guarantees the reproducibility the pilot requires
 * (re-run → identical result) and makes the fairness measurement meaningful.
 *
 * EU AI Act framing: a credit-scoring / lending decision is Annex III
 * high-risk use. This module is the "Body/Hands" decision surface; the
 * fairness check (counterfactual-fairness.ts) is the Art. 10 data-governance
 * control wrapped around it.
 *
 * IMPORTANT — seeded disparity: this synthetic model carries a small,
 * explicit protected-attribute penalty (PROTECTED_PENALTY). It represents the
 * latent disparate treatment documented in fair-lending literature and exists
 * ONLY so the pilot can demonstrate that the counterfactual check DETECTS a
 * disparity end-to-end. It is not a recommendation to encode the attribute in
 * a real model. Setting PROTECTED_PENALTY to 0 yields a fair model and the
 * check then reports zero discrimination — that contrast is the proof.
 */

import type { Gender, LendingApplicant } from '../synthetic-data/lending-applicants.js';

// ============ MODEL PARAMETERS ============

/** Approval threshold on the 0–1 creditworthiness score. */
export const APPROVAL_THRESHOLD = 0.5;

/**
 * Penalty subtracted from the score when gender === 'female'.
 * This is the seeded disparate treatment the pilot is built to catch.
 * Configurable per call; default reflects a small-but-material bias.
 */
export const PROTECTED_PENALTY = 0.06;

/** Feature weights (sum to 1.0 before the loan-to-income deduction). */
const WEIGHTS = {
  income: 0.25,
  creditScore: 0.35,
  debtToIncome: 0.2,
  employment: 0.1,
  loanToIncome: 0.1,
} as const;

// ============ TYPES ============

export interface LoanDecisionConfig {
  /** Override the seeded protected-attribute penalty (default PROTECTED_PENALTY). */
  protectedPenalty?: number;
  /** Override the approval threshold (default APPROVAL_THRESHOLD). */
  threshold?: number;
}

export interface LoanDecision {
  applicantId: string;
  /** Final creditworthiness score in [0, 1], rounded to 4 dp. */
  score: number;
  /** Score before the protected-attribute penalty was applied. */
  scoreBeforePenalty: number;
  approved: boolean;
  threshold: number;
  /** Human-readable factors, surfaced for transparency (Rule 12). */
  reasonCodes: string[];
}

// ============ DECISION FUNCTION ============

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

/**
 * Deterministic lend / no-lend decision for one applicant.
 * Pure function: identical input → identical output.
 */
export function decideLoan(
  applicant: LendingApplicant,
  config: LoanDecisionConfig = {},
): LoanDecision {
  if (!applicant || typeof applicant.applicantId !== 'string') {
    throw new Error('decideLoan: a valid LendingApplicant is required');
  }

  const threshold = config.threshold ?? APPROVAL_THRESHOLD;
  const protectedPenalty = config.protectedPenalty ?? PROTECTED_PENALTY;

  // Validate config bounds: out-of-range values would make the decision (and
  // therefore the fairness measurement) meaningless. Fail loud (Rule 12).
  if (!Number.isFinite(threshold) || threshold <= 0 || threshold >= 1) {
    throw new Error(`decideLoan: threshold must be a finite number in (0, 1), got ${threshold}`);
  }
  if (!Number.isFinite(protectedPenalty) || protectedPenalty < 0 || protectedPenalty > 1) {
    throw new Error(
      `decideLoan: protectedPenalty must be a finite number in [0, 1], got ${protectedPenalty}`,
    );
  }

  // Normalise legitimate attributes to [0, 1].
  const incomeNorm = clamp01((applicant.annualIncomeEur - 18_000) / (120_000 - 18_000));
  const creditNorm = clamp01((applicant.creditScore - 300) / (850 - 300));
  const dtiNorm = clamp01(1 - applicant.debtToIncomeRatio / 0.6); // lower DTI is better
  const employmentNorm = clamp01(applicant.employmentYears / 30);
  const loanToIncome = applicant.requestedAmountEur / Math.max(applicant.annualIncomeEur, 1);
  const loanToIncomePenalty = clamp01(loanToIncome / 2); // >= 2x income → full penalty

  const scoreBeforePenalty = clamp01(
    WEIGHTS.income * incomeNorm +
      WEIGHTS.creditScore * creditNorm +
      WEIGHTS.debtToIncome * dtiNorm +
      WEIGHTS.employment * employmentNorm -
      WEIGHTS.loanToIncome * loanToIncomePenalty,
  );

  const penalty = applicant.gender === 'female' ? protectedPenalty : 0;
  const score = clamp01(scoreBeforePenalty - penalty);

  const reasonCodes: string[] = [];
  if (creditNorm < 0.4) reasonCodes.push('LOW_CREDIT_SCORE');
  if (applicant.debtToIncomeRatio > 0.4) reasonCodes.push('HIGH_DEBT_TO_INCOME');
  if (loanToIncome > 1.5) reasonCodes.push('HIGH_LOAN_TO_INCOME');
  if (incomeNorm < 0.25) reasonCodes.push('LOW_INCOME');
  if (penalty > 0) reasonCodes.push('PROTECTED_ATTRIBUTE_PENALTY_APPLIED');

  return {
    applicantId: applicant.applicantId,
    score: round4(score),
    scoreBeforePenalty: round4(scoreBeforePenalty),
    approved: score >= threshold,
    threshold,
    reasonCodes,
  };
}

/** Convenience: flip the protected attribute to its comparator value. */
export function flipGender(gender: Gender): Gender {
  return gender === 'female' ? 'male' : 'female';
}

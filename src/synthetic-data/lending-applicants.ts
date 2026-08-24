/**
 * Synthetic Lending Applicants — Counterfactual Fairness Pilot Dataset
 *
 * Code-Version: 1.0
 * Branch: claude/mutatis-fairness-pilot-3jmbb5
 * Date: 2026-06-23
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Fully synthetic, programmatically generated lending applicants for the
 * EU AI Act Art. 10 / Annex III counterfactual-fairness pilot. NO PII
 * (CLAUDE.md Non-Negotiable Rule 1): identifiers are synthetic tokens
 * (SYN-LA-NNN) and every attribute is drawn from a seeded PRNG, not from
 * any real person or record.
 *
 * Design note: legitimate (creditworthiness) attributes are generated
 * INDEPENDENTLY of the protected attribute (gender). This is deliberate —
 * situation testing isolates the protected attribute's causal effect on the
 * decision by holding legitimate attributes fixed. Any approval-rate gap the
 * fairness check measures is therefore attributable to the decision model,
 * not to a correlation baked into the data.
 */

import { createHash } from 'node:crypto';

// ============ TYPES ============

/** The single protected attribute exercised by this pilot. */
export type ProtectedAttribute = 'gender';

/** Protected attribute value (binary for a tractable comparator flip). */
export type Gender = 'female' | 'male';

/** A synthetic loan applicant. Contains NO PII — all values are generated. */
export interface LendingApplicant {
  /** Synthetic, non-identifying token (e.g. SYN-LA-001). */
  applicantId: string;
  /** Protected attribute under test. */
  gender: Gender;
  /** Gross annual income in EUR (legitimate attribute). */
  annualIncomeEur: number;
  /** Years in current/continuous employment (legitimate attribute). */
  employmentYears: number;
  /** Debt-to-income ratio, 0.0–0.6 (legitimate attribute). */
  debtToIncomeRatio: number;
  /** Credit bureau score, 300–850 (legitimate attribute). */
  creditScore: number;
  /** Requested loan principal in EUR (legitimate attribute). */
  requestedAmountEur: number;
  /** Loan term in months (legitimate attribute). */
  loanTermMonths: number;
}

// ============ SEEDED PRNG ============

/** mulberry32 — small, deterministic PRNG so the dataset is reproducible. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function intBetween(rng: () => number, min: number, max: number): number {
  return Math.floor(min + rng() * (max - min + 1));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

// ============ GENERATOR ============

/**
 * Generate `count` synthetic applicants deterministically from `seed`.
 * Same (count, seed) always yields the identical dataset (reproducibility).
 */
export function generateLendingApplicants(count = 200, seed = 20260623): LendingApplicant[] {
  if (!Number.isInteger(count) || count <= 0) {
    throw new Error(`generateLendingApplicants: count must be a positive integer, got ${count}`);
  }
  const rng = mulberry32(seed);
  const applicants: LendingApplicant[] = [];

  for (let i = 0; i < count; i++) {
    // Protected attribute assigned independently of legitimate attributes.
    const gender: Gender = rng() < 0.5 ? 'female' : 'male';

    applicants.push({
      applicantId: `SYN-LA-${String(i + 1).padStart(3, '0')}`,
      gender,
      annualIncomeEur: intBetween(rng, 18_000, 120_000),
      employmentYears: intBetween(rng, 0, 30),
      debtToIncomeRatio: round2(rng() * 0.6),
      creditScore: intBetween(rng, 300, 850),
      requestedAmountEur: intBetween(rng, 5_000, 80_000),
      loanTermMonths: [12, 24, 36, 48, 60, 72, 84][intBetween(rng, 0, 6)],
    });
  }

  return applicants;
}

/**
 * Held-out evaluation set used by the pilot and its tests.
 * Frozen so callers cannot mutate the shared fixture.
 */
export const HELD_OUT_APPLICANTS: ReadonlyArray<LendingApplicant> = Object.freeze(
  generateLendingApplicants(200, 20260623),
);

/**
 * SHA-256 over the canonicalised dataset. Used as the reproducible dataset
 * fingerprint in the fairness artifact and the Article-12 input hash.
 */
export function hashDataset(applicants: ReadonlyArray<LendingApplicant>): string {
  const canonical = JSON.stringify(
    applicants.map((a) => [
      a.applicantId,
      a.gender,
      a.annualIncomeEur,
      a.employmentYears,
      a.debtToIncomeRatio,
      a.creditScore,
      a.requestedAmountEur,
      a.loanTermMonths,
    ]),
  );
  return createHash('sha256').update(canonical).digest('hex');
}

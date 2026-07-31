/**
 * Counterfactual Fairness Pilot — Tests
 *
 * Asserts INTENT (CLAUDE.md Rule 9): the fairness measurement is a genuine
 * function of the protected attribute, so flipping it MUST move the deltas.
 * A metric that ignored the attribute would pass these tests only by being
 * broken — which is exactly what they catch.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import {
  generateLendingApplicants,
  HELD_OUT_APPLICANTS,
  hashDataset,
  type LendingApplicant,
} from '../synthetic-data/lending-applicants.js';
import { decideLoan } from '../fairness/financed-decision.js';
import {
  measureCounterfactualFairness,
  generateCounterfactual,
} from '../fairness/counterfactual-fairness.js';
import { buildFairnessArtifact, artifactContentHash } from '../fairness/fairness-artifact.js';
import { emitSignedFairnessReport } from '../fairness/emit-signed-fairness-report.js';

const FIXED_TS = '2026-06-23T00:00:00.000Z';

describe('Synthetic lending dataset', () => {
  it('is deterministic for a fixed seed (reproducibility)', () => {
    const a = generateLendingApplicants(50, 123);
    const b = generateLendingApplicants(50, 123);
    expect(hashDataset(a)).toBe(hashDataset(b));
  });

  it('contains no PII — identifiers are synthetic tokens', () => {
    for (const applicant of HELD_OUT_APPLICANTS) {
      expect(applicant.applicantId).toMatch(/^SYN-LA-\d{3}$/);
    }
  });
});

describe('decideLoan — protected-attribute dependence (Rule 9 intent)', () => {
  it('flipping the protected attribute on a held-out record changes the score', () => {
    // A near-threshold female applicant: the seeded penalty pushes her below.
    const applicant: LendingApplicant = {
      applicantId: 'SYN-LA-TEST',
      gender: 'female',
      annualIncomeEur: 60_000,
      employmentYears: 8,
      debtToIncomeRatio: 0.25,
      creditScore: 660,
      requestedAmountEur: 40_000,
      loanTermMonths: 60,
    };

    const factual = decideLoan(applicant);
    const comparator = decideLoan(generateCounterfactual(applicant));

    // The metric depends on the protected attribute: scores must differ.
    expect(comparator.score).not.toBe(factual.score);
    expect(comparator.score).toBeGreaterThan(factual.score);
  });

  it('with the penalty disabled, the protected attribute has no effect', () => {
    const applicant: LendingApplicant = {
      applicantId: 'SYN-LA-FAIR',
      gender: 'female',
      annualIncomeEur: 60_000,
      employmentYears: 8,
      debtToIncomeRatio: 0.25,
      creditScore: 660,
      requestedAmountEur: 40_000,
      loanTermMonths: 60,
    };
    const factual = decideLoan(applicant, { protectedPenalty: 0 });
    const comparator = decideLoan(generateCounterfactual(applicant), { protectedPenalty: 0 });
    expect(comparator.score).toBe(factual.score);
  });
});

describe('measureCounterfactualFairness', () => {
  it('detects the seeded disparity and FAILs on the biased model', () => {
    const result = measureCounterfactualFairness(HELD_OUT_APPLICANTS);
    // Protected group is scored lower than its comparator ⇒ adverse gap.
    expect(result.approvalRateGap).toBeLessThan(0);
    expect(result.flipRate).toBeGreaterThan(0);
    expect(result.passed).toBe(false);
    // Evidence is surfaced, not hidden (Rule 12).
    expect(result.pairs.length).toBe(result.n);
  });

  it('reports a fair model (no disparity) when the penalty is removed', () => {
    const result = measureCounterfactualFairness(HELD_OUT_APPLICANTS, { protectedPenalty: 0 });
    expect(result.approvalRateGap).toBe(0);
    expect(result.flipRate).toBe(0);
    expect(result.passed).toBe(true);
  });

  it('the measured delta MOVES when the protected attribute is flipped across the dataset', () => {
    // Flip every applicant's protected attribute → the protected group is now
    // the previously-advantaged group, so the measured gap must change.
    const flipped = HELD_OUT_APPLICANTS.map((a) => generateCounterfactual(a));
    const baseline = measureCounterfactualFairness(HELD_OUT_APPLICANTS);
    const afterFlip = measureCounterfactualFairness(flipped);
    expect(afterFlip.approvalRateGap).not.toBe(baseline.approvalRateGap);
  });

  it('fails loud on an empty dataset rather than reporting a vacuous PASS', () => {
    expect(() => measureCounterfactualFairness([])).toThrow(/empty/i);
  });

  it('fails loud when the protected group is absent', () => {
    const malesOnly = HELD_OUT_APPLICANTS.filter((a) => a.gender === 'male');
    expect(() =>
      measureCounterfactualFairness(malesOnly, { protectedGroupValue: 'female' }),
    ).toThrow(/protected group/i);
  });

  it('rejects an out-of-range threshold (no vacuous PASS via Infinity)', () => {
    expect(() =>
      measureCounterfactualFairness(HELD_OUT_APPLICANTS, { approvalGapThreshold: Infinity }),
    ).toThrow(/approvalGapThreshold/);
    expect(() =>
      measureCounterfactualFairness(HELD_OUT_APPLICANTS, { flipRateThreshold: 5 }),
    ).toThrow(/flipRateThreshold/);
  });

  it('rejects an out-of-range decision threshold / penalty', () => {
    expect(() => decideLoan(HELD_OUT_APPLICANTS[0], { threshold: 2 })).toThrow(/threshold/);
    expect(() => decideLoan(HELD_OUT_APPLICANTS[0], { protectedPenalty: -1 })).toThrow(
      /protectedPenalty/,
    );
  });

  it('fails loud on a malformed applicant record', () => {
    const bad = [{ ...HELD_OUT_APPLICANTS[0], creditScore: Number.NaN }];
    expect(() => measureCounterfactualFairness(bad)).toThrow(/malformed/i);
  });
});

describe('Fairness artifact', () => {
  it('content hash is identical across runs (reproducibility) and ignores timestamp', () => {
    const result = measureCounterfactualFairness(HELD_OUT_APPLICANTS);
    const meta = { decisionPath: 'x', datasetHash: hashDataset(HELD_OUT_APPLICANTS), title: 't' };
    const a = buildFairnessArtifact(result, meta, '2026-01-01T00:00:00.000Z');
    const b = buildFairnessArtifact(result, meta, '2030-12-31T23:59:59.000Z');
    expect(a.contentHash).toBe(b.contentHash);
    expect(a.emittedAt).not.toBe(b.emittedAt); // timestamp differs, hash does not
  });

  it('cites the paper-backed methodology, not a hand-rolled metric', () => {
    const result = measureCounterfactualFairness(HELD_OUT_APPLICANTS);
    const artifact = buildFairnessArtifact(result, {
      decisionPath: 'x',
      datasetHash: 'h',
      title: 't',
    });
    expect(artifact.methodology.paper).toMatch(/Mutatis Mutandis/i);
    expect(artifact.methodology.license).toBe('Apache-2.0');
    expect(artifact.contentHash).toBe(
      artifactContentHash({
        title: 't',
        decisionPath: 'x',
        datasetHash: 'h',
        methodology: artifact.methodology,
        euAiActBasis: artifact.euAiActBasis,
        result,
        verdict: artifact.verdict,
      }),
    );
  });
});

describe('emitSignedFairnessReport (offline rails)', () => {
  let outDir: string;

  beforeEach(() => {
    outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fairness-pilot-'));
  });
  afterEach(() => {
    fs.rmSync(outDir, { recursive: true, force: true });
  });

  it('writes the artifact + an Article-12 audit entry, and is reproducible', async () => {
    const opts = { applicants: HELD_OUT_APPLICANTS, outputDir: outDir, emittedAt: FIXED_TS };
    const first = await emitSignedFairnessReport(opts);

    expect(fs.existsSync(first.artifactJsonPath)).toBe(true);
    expect(fs.existsSync(first.artifactMarkdownPath)).toBe(true);
    expect(fs.existsSync(first.article12LogPath)).toBe(true);

    // Article-12 entry is written with the high-risk classification + regulation ids.
    expect(first.article12Entry.risk_classification).toBe('high');
    expect(first.article12Entry.regulation_ids).toContain('EU-AI-ACT-ART-10');
    expect(first.article12Entry.artifact_content_hash).toBe(first.contentHash);

    // Re-run in a fresh dir → identical sealed result.
    const outDir2 = fs.mkdtempSync(path.join(os.tmpdir(), 'fairness-pilot-2-'));
    try {
      const second = await emitSignedFairnessReport({ ...opts, outputDir: outDir2 });
      expect(second.contentHash).toBe(first.contentHash);
    } finally {
      fs.rmSync(outDir2, { recursive: true, force: true });
    }
  });

  it('rejects an outputDir with parent-traversal segments (CWE-22)', async () => {
    await expect(
      emitSignedFairnessReport({
        applicants: HELD_OUT_APPLICANTS,
        outputDir: '../../supabase/migrations',
        emittedAt: FIXED_TS,
      }),
    ).rejects.toThrow(/\.\./);
  });
});

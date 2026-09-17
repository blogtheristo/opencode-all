import { describe, expect, it } from 'vitest';
import { countMgd, evaluateMgd, MGD_CRITERIA, type MgdCandidate } from '../agents/mgd-filter.js';

/**
 * These tests assert the *intent* of the MGD audit-grade filter (field note
 * §3): a decision counts only when it flows through the governed outcome layer,
 * carries full Article 12 lineage, AND is audit-grade. Each test removes one
 * ingredient and proves the decision stops counting — so the filter cannot pass
 * while silently ignoring a criterion (Engineering Discipline Rule 9).
 */

/** A fully audit-grade governed decision — passes all three criteria. */
function goodCandidate(overrides: Partial<MgdCandidate> = {}): MgdCandidate {
  return {
    agent_id: 'aegis-vesta',
    input_hash: 'a'.repeat(64),
    thinking_block_hash: 'b'.repeat(64),
    decision_summary: 'CBAM filing assessed; embedded emissions within threshold.',
    risk_classification: 'high',
    pii_scrubbed: true,
    created_at: '2026-07-10T09:00:00.000Z',
    ...overrides,
  };
}

describe('evaluateMgd', () => {
  it('counts a decision that satisfies all three criteria', () => {
    const result = evaluateMgd(goodCandidate());
    expect(result.counts).toBe(true);
    expect(result.failedCriteria).toEqual([]);
  });

  it('(a) rejects an ungoverned run with no agent_id — governed-outcome-layer', () => {
    const result = evaluateMgd(goodCandidate({ agent_id: null }));
    expect(result.counts).toBe(false);
    expect(result.failedCriteria).toContain('governed-outcome-layer');
  });

  it('(b) rejects a pre-flight-only decision missing the thinking-block hash — article12-lineage', () => {
    const result = evaluateMgd(goodCandidate({ thinking_block_hash: null }));
    expect(result.counts).toBe(false);
    expect(result.failedCriteria).toContain('article12-lineage');
  });

  it('(b) rejects a decision missing the pre-flight input hash — article12-lineage', () => {
    const result = evaluateMgd(goodCandidate({ input_hash: '' }));
    expect(result.counts).toBe(false);
    expect(result.failedCriteria).toContain('article12-lineage');
  });

  it('(c) rejects a decision with no human-reviewable summary — audit-grade', () => {
    const result = evaluateMgd(goodCandidate({ decision_summary: null }));
    expect(result.counts).toBe(false);
    expect(result.failedCriteria).toContain('audit-grade');
  });

  it('(c) rejects a decision whose PII was not scrubbed before egress — audit-grade', () => {
    const result = evaluateMgd(goodCandidate({ pii_scrubbed: false }));
    expect(result.counts).toBe(false);
    expect(result.failedCriteria).toContain('audit-grade');
  });

  it('(c) rejects a decision with no risk classification — audit-grade', () => {
    const result = evaluateMgd(goodCandidate({ risk_classification: null }));
    expect(result.counts).toBe(false);
    expect(result.failedCriteria).toContain('audit-grade');
  });

  it('treats whitespace-only hashes as absent (fails loud, not a silent pass)', () => {
    const result = evaluateMgd(goodCandidate({ thinking_block_hash: '   ' }));
    expect(result.counts).toBe(false);
    expect(result.failedCriteria).toContain('article12-lineage');
  });

  it('reports every failed criterion when a candidate fails several', () => {
    const result = evaluateMgd({});
    expect(result.counts).toBe(false);
    expect(result.failedCriteria).toEqual([
      'governed-outcome-layer',
      'article12-lineage',
      'audit-grade',
    ]);
  });
});

describe('countMgd', () => {
  it('counts only the audit-grade governed decisions in a mixed batch', () => {
    const candidates: MgdCandidate[] = [
      goodCandidate(), // counts
      goodCandidate(), // counts
      goodCandidate({ thinking_block_hash: null }), // excluded: article12-lineage
      goodCandidate({ pii_scrubbed: false }), // excluded: audit-grade
      goodCandidate({ agent_id: '' }), // excluded: governed-outcome-layer
    ];

    const result = countMgd(candidates);

    expect(result.candidatesEvaluated).toBe(5);
    expect(result.monthlyGovernedDecisions).toBe(2);
    expect(result.excluded).toBe(3);
    expect(result.excludedByCriterion).toEqual({
      'governed-outcome-layer': 1,
      'article12-lineage': 1,
      'audit-grade': 1,
    });
  });

  it('attributes an exclusion to the first (most fundamental) failed criterion', () => {
    // Fails all three; must be attributed to governed-outcome-layer only, once.
    const result = countMgd([{}]);
    expect(result.excludedByCriterion['governed-outcome-layer']).toBe(1);
    expect(result.excludedByCriterion['article12-lineage']).toBe(0);
    expect(result.excludedByCriterion['audit-grade']).toBe(0);
  });

  it('returns a zeroed count for an empty batch', () => {
    const result = countMgd([]);
    expect(result.candidatesEvaluated).toBe(0);
    expect(result.monthlyGovernedDecisions).toBe(0);
    expect(result.excluded).toBe(0);
  });
});

describe('MGD_CRITERIA', () => {
  it('documents exactly the three canonical criteria', () => {
    expect(Object.keys(MGD_CRITERIA)).toEqual([
      'governed-outcome-layer',
      'article12-lineage',
      'audit-grade',
    ]);
  });
});

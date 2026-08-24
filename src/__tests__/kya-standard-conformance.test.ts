import { describe, expect, it } from 'vitest';
import {
  classifyTrustState,
  isTrustScoreSufficient,
} from '../fairness/trust-score-classifier.js';
import {
  getSnapshotById,
  getSnapshotsByCategory,
  KYA_TRUST_SCORE_SNAPSHOTS,
} from '../fairness/test-snapshots.js';

describe('KYA-S1 ATS conformance baseline', () => {
  it.each(KYA_TRUST_SCORE_SNAPSHOTS)(
    'classifies and authorizes $id according to the specification',
    ({ input, expected }) => {
      expect(classifyTrustState(input.score)).toBe(expected.permission);
      expect(isTrustScoreSufficient(input.score, 'FULL_SANDBOX_ONLY')).toBe(
        expected.fullSandboxAuthorized,
      );
      expect(isTrustScoreSufficient(input.score, 'RESTRICTED_ALLOWED')).toBe(
        expected.restrictedActionAuthorized,
      );
    },
  );

  it('enforces the exact normative ATS boundaries', () => {
    expect(classifyTrustState(0.8)).toBe('FULL_SANDBOX');
    expect(classifyTrustState(0.799999)).toBe('RESTRICTED');
    expect(classifyTrustState(0.5)).toBe('RESTRICTED');
    expect(classifyTrustState(0.499999)).toBe('SUSPENDED');
  });

  it('fails closed below ATS 0.50', () => {
    expect(isTrustScoreSufficient(0.49, 'FULL_SANDBOX_ONLY')).toBe(false);
    expect(isTrustScoreSufficient(0.49, 'RESTRICTED_ALLOWED')).toBe(false);
  });

  it.each([NaN, Infinity, -Infinity, -0.01, 1.01])(
    'rejects an invalid ATS value of %s',
    (score) => {
      expect(() => classifyTrustState(score)).toThrow(RangeError);
      expect(() => isTrustScoreSufficient(score)).toThrow(RangeError);
    },
  );

  it('retrieves only implemented fixture categories', () => {
    expect(getSnapshotById('trs-001')).toEqual(KYA_TRUST_SCORE_SNAPSHOTS[0]);
    expect(getSnapshotById('missing')).toBeNull();
    expect(getSnapshotsByCategory('trs')).toBe(KYA_TRUST_SCORE_SNAPSHOTS);
    expect(getSnapshotsByCategory('idv')).toEqual([]);
  });
});

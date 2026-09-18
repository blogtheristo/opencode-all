import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { issueKyaVerdict, verifyKyaVerdict } from '../../security/runtime-auth.js';

const ORIGINAL_SECRET = process.env.KYA_VERDICT_SIGNING_SECRET;

beforeEach(() => {
  process.env.KYA_VERDICT_SIGNING_SECRET = 'test-secret-a';
});

afterEach(() => {
  if (ORIGINAL_SECRET === undefined) delete process.env.KYA_VERDICT_SIGNING_SECRET;
  else process.env.KYA_VERDICT_SIGNING_SECRET = ORIGINAL_SECRET;
});

describe('issueKyaVerdict / verifyKyaVerdict', () => {
  it('a verdict issued with the configured secret verifies true', () => {
    const v = issueKyaVerdict({ decision: 'allowed', trustScore: 42, gate: 'test' });
    expect(v.sig).toBeTruthy();
    expect(verifyKyaVerdict(v)).toBe(true);
  });

  it('a hand-constructed verdict with no signature verifies false', () => {
    expect(verifyKyaVerdict({ decision: 'allowed', trustScore: 100 })).toBe(false);
  });

  it('mutating any signed field invalidates the signature', () => {
    const v = issueKyaVerdict({ decision: 'allowed', trustScore: 42 });
    expect(verifyKyaVerdict({ ...v, trustScore: 43 })).toBe(false);
    expect(verifyKyaVerdict({ ...v, decision: 'denied' })).toBe(false);
    expect(verifyKyaVerdict({ ...v, gate: 'forged' })).toBe(false);
  });

  it('a verdict signed under a different secret does not verify', () => {
    const v = issueKyaVerdict({ decision: 'allowed', trustScore: 42 });
    process.env.KYA_VERDICT_SIGNING_SECRET = 'test-secret-b';
    expect(verifyKyaVerdict(v)).toBe(false);
  });

  it('fails closed when no secret is configured at all', () => {
    delete process.env.KYA_VERDICT_SIGNING_SECRET;
    const v = issueKyaVerdict({ decision: 'allowed', trustScore: 42 });
    expect(v.sig).toBeUndefined();
    expect(verifyKyaVerdict(v)).toBe(false);
    expect(verifyKyaVerdict(undefined)).toBe(false);
  });
});

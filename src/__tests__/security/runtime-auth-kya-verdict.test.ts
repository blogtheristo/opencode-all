import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { issueKyaVerdict, verifyKyaVerdict } from '../../security/runtime-auth.js';

const ORIGINAL_SECRET = process.env.KYA_VERDICT_SIGNING_SECRET;
const ORIGINAL_PREVIOUS = process.env.KYA_VERDICT_SIGNING_SECRET_PREVIOUS;
const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

beforeEach(() => {
  process.env.KYA_VERDICT_SIGNING_SECRET = 'test-secret-a';
  delete process.env.KYA_VERDICT_SIGNING_SECRET_PREVIOUS;
});

afterEach(() => {
  if (ORIGINAL_SECRET === undefined) delete process.env.KYA_VERDICT_SIGNING_SECRET;
  else process.env.KYA_VERDICT_SIGNING_SECRET = ORIGINAL_SECRET;
  if (ORIGINAL_PREVIOUS === undefined) delete process.env.KYA_VERDICT_SIGNING_SECRET_PREVIOUS;
  else process.env.KYA_VERDICT_SIGNING_SECRET_PREVIOUS = ORIGINAL_PREVIOUS;
  if (ORIGINAL_NODE_ENV === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = ORIGINAL_NODE_ENV;
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

  describe('secret rotation (KYA_VERDICT_SIGNING_SECRET_PREVIOUS)', () => {
    it('accepts a verdict signed under the previous secret during the rotation window', () => {
      const v = issueKyaVerdict({ decision: 'allowed', trustScore: 42 }); // signed with 'test-secret-a'
      process.env.KYA_VERDICT_SIGNING_SECRET_PREVIOUS = 'test-secret-a';
      process.env.KYA_VERDICT_SIGNING_SECRET = 'test-secret-new';
      expect(verifyKyaVerdict(v)).toBe(true);
    });

    it('rejects a verdict signed under neither the current nor previous secret', () => {
      const v = issueKyaVerdict({ decision: 'allowed', trustScore: 42 }); // signed with 'test-secret-a'
      process.env.KYA_VERDICT_SIGNING_SECRET_PREVIOUS = 'some-other-old-secret';
      process.env.KYA_VERDICT_SIGNING_SECRET = 'test-secret-new';
      expect(verifyKyaVerdict(v)).toBe(false);
    });

    it('stops accepting the previous secret once the grace window is removed', () => {
      const v = issueKyaVerdict({ decision: 'allowed', trustScore: 42 }); // signed with 'test-secret-a'
      process.env.KYA_VERDICT_SIGNING_SECRET = 'test-secret-new';
      delete process.env.KYA_VERDICT_SIGNING_SECRET_PREVIOUS;
      expect(verifyKyaVerdict(v)).toBe(false);
    });
  });

  describe('placeholder-secret guard', () => {
    it('refuses to issue with a known placeholder secret when NODE_ENV=production', () => {
      process.env.NODE_ENV = 'production';
      process.env.KYA_VERDICT_SIGNING_SECRET = 'change-me';
      expect(() => issueKyaVerdict({ decision: 'allowed' })).toThrow(/placeholder/);
    });

    it('allows a placeholder secret outside production (test/dev)', () => {
      process.env.NODE_ENV = 'test';
      const v = issueKyaVerdict({ decision: 'allowed' }); // KYA_VERDICT_SIGNING_SECRET is 'test-secret-a' from beforeEach
      expect(v.sig).toBeTruthy();
    });
  });
});

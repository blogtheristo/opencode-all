// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-6-luna Agent=OpenClaw-Phase2 Date=2026-09-27
// Audit trail: git log -- src/__tests__/security/runtime-auth-kya-verdict.test.ts
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import {
  _resetPoliciesForTests,
  issueKyaVerdict,
  issueThemisBridgeVerdict,
  registerToolPolicy,
  verifyKyaVerdict,
} from '../../security/runtime-auth.js';

const ORIGINAL_SECRET = process.env.KYA_VERDICT_SIGNING_SECRET;
const ORIGINAL_PREVIOUS = process.env.KYA_VERDICT_SIGNING_SECRET_PREVIOUS;
const ORIGINAL_NODE_ENV = process.env.NODE_ENV;

beforeEach(() => {
  process.env.KYA_VERDICT_SIGNING_SECRET = 'test-secret-a';
  delete process.env.KYA_VERDICT_SIGNING_SECRET_PREVIOUS;
  _resetPoliciesForTests();
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

  it('continues to verify legacy signed verdicts during rollout', () => {
    const issuedAt = '2026-09-27T12:00:00.000Z';
    const payload = JSON.stringify({
      decision: 'allowed',
      trustScore: 42,
      policyVersion: null,
      gate: null,
      issuedAt,
    });
    const sig = createHmac('sha256', 'test-secret-a').update(payload).digest('hex');

    expect(verifyKyaVerdict({ decision: 'allowed', trustScore: 42, issuedAt, sig })).toBe(true);
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

  it('signs a Themis authorization only after the existing per-tool gate allows it', () => {
    registerToolPolicy('search-docs', { actionClass: 'READ' });
    const verdict = issueThemisBridgeVerdict({
      call: { name: 'search-docs', arguments: { query: 'cbam' } },
      context: { agentName: 'themis', orgId: 'tenant-1', sessionId: 'session-1' },
      callerAgentId: 'agent-1',
      operatorId: 'operator-1',
      trustScore: 90,
      policyVersion: 'themis-policy-v1',
    });

    expect(verdict.decision).toBe('allowed');
    expect(verdict.gate).toBe('themis-policy-gate');
    const ticketLifetime = Date.parse(verdict.expiresAt!) - Date.parse(verdict.issuedAt!);
    expect(ticketLifetime).toBeGreaterThan(29_000);
    expect(ticketLifetime).toBeLessThanOrEqual(30_000);
    expect(verdict.scope).toEqual(
      expect.objectContaining({
        agentId: 'agent-1',
        operatorId: 'operator-1',
        orgId: 'tenant-1',
        sessionId: 'session-1',
        capability: 'search-docs',
        paramsDigest: expect.stringMatching(/^[a-f0-9]{64}$/),
        authorizationId: expect.any(String),
      }),
    );
    expect(verifyKyaVerdict(verdict)).toBe(true);
  });

  it('does not authorize an unregistered capability through Themis', () => {
    const verdict = issueThemisBridgeVerdict({
      call: { name: 'unregistered-harness-tool', arguments: {} },
      context: { agentName: 'themis', orgId: 'tenant-1', sessionId: 'session-1' },
      callerAgentId: 'agent-1',
      operatorId: 'operator-1',
      trustScore: 90,
      policyVersion: 'themis-policy-v1',
    });

    expect(verdict.decision).toBe('denied');
    expect(verifyKyaVerdict(verdict)).toBe(true);
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

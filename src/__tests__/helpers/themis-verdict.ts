// Evidence: Tool=Claude Code 2.1.283 Model=anthropic/claude-opus-5-5 Agent=claude-code-web Date=2026-09-27
// Audit trail: git log -- src/__tests__/helpers/themis-verdict.ts
/**
 * Test-only signer for bridge-gate verdicts. issueKyaVerdict() refuses the
 * reserved Themis gate, so bridge tests that need arbitrary scope/expiry sign
 * the wire format directly with the test secret. A change to the payload
 * format in runtime-auth.ts makes these verdicts fail verification — loudly.
 */
import { createHmac } from 'node:crypto';
import type { RuntimeKYAVerdict } from '../../agents/types.js';

export function signThemisVerdictForTest(input: {
  decision?: 'allowed' | 'denied';
  trustScore: number;
  policyVersion: string;
  scope: NonNullable<RuntimeKYAVerdict['scope']>;
  expiresAt: string;
  issuedAt?: string;
}): RuntimeKYAVerdict {
  const secret = process.env.KYA_VERDICT_SIGNING_SECRET;
  if (!secret) throw new Error('signThemisVerdictForTest: KYA_VERDICT_SIGNING_SECRET not set');
  const verdict = {
    decision: input.decision ?? 'allowed',
    trustScore: input.trustScore,
    policyVersion: input.policyVersion,
    gate: 'themis-policy-gate',
    issuedAt: input.issuedAt ?? new Date().toISOString(),
    expiresAt: input.expiresAt,
    scope: input.scope,
  } as const;
  const s = verdict.scope;
  const payload = JSON.stringify({
    decision: verdict.decision,
    trustScore: verdict.trustScore,
    policyVersion: verdict.policyVersion,
    gate: verdict.gate,
    issuedAt: verdict.issuedAt,
    expiresAt: verdict.expiresAt,
    scope: {
      agentId: s.agentId,
      operatorId: s.operatorId,
      orgId: s.orgId,
      sessionId: s.sessionId,
      capability: s.capability,
      paramsDigest: s.paramsDigest,
      authorizationId: s.authorizationId,
    },
  });
  return { ...verdict, sig: createHmac('sha256', secret).update(payload).digest('hex') };
}

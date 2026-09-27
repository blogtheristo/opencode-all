// Evidence: Tool=Claude Code 2.1.283 Model=anthropic/claude-opus-5-5 Agent=claude-code-web Date=2026-09-27
// Audit trail: git log -- src/__tests__/security/themis-principal.test.ts
/**
 * Themis bridge identity boundary: operator, tenant and agent in a bridge
 * verdict come only from verified credentials (DWS access JWT + registered
 * capability token with the themis-bridge scope). Code-level tests only —
 * no production call site or live runtime is exercised here.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createHash, randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';

// src/__tests__/setup.ts provides the test-only JWT_SECRET that auth.service loads.
const JWT_SECRET = process.env.JWT_SECRET as string;

const { default: authService } = await import('../../services/auth.service.js');
const { _resetRegistryCacheForTests } = await import('../../broker/capability-tokens.js');
const { resolveThemisPrincipal, isVerifiedThemisPrincipal } =
  await import('../../security/themis-principal.js');
const { _resetPoliciesForTests, issueThemisBridgeVerdict, registerToolPolicy, verifyKyaVerdict } =
  await import('../../security/runtime-auth.js');
const { NemoClawBridge } = await import('../../mcp/nemoclaw-bridge.js');
const { digestOf } = await import('../../security/canonical-digest.js');

const AGENT_TOKEN = 'openclaw-plaintext-token';
const BROKER_ONLY_TOKEN = 'hermes-plaintext-token';
const sha = (t: string) => createHash('sha256').update(t).digest('hex');

function operatorToken(claims: Record<string, unknown>, secret = JWT_SECRET): string {
  return jwt.sign({ type: 'access', ...claims }, secret, {
    algorithm: 'HS256',
    expiresIn: '5m',
    jwtid: randomUUID(),
  });
}

async function principalFor(claims = { userId: 'operator-1', organizationId: 'tenant-1' }) {
  const result = await resolveThemisPrincipal({
    operatorAccessToken: operatorToken(claims),
    agentBearerToken: AGENT_TOKEN,
  });
  if (!result.ok) throw new Error(`principal did not resolve: ${result.reason}`);
  return result.principal;
}

const ENV_KEYS = ['KYA_VERDICT_SIGNING_SECRET', 'BROKER_AGENT_TOKENS'] as const;
const saved: Record<string, string | undefined> = {};

beforeEach(() => {
  for (const k of ENV_KEYS) saved[k] = process.env[k];
  process.env.KYA_VERDICT_SIGNING_SECRET = 'test-secret-a';
  process.env.BROKER_AGENT_TOKENS = JSON.stringify({
    openclaw: { tokenSha256: sha(AGENT_TOKEN), scopes: ['themis-bridge'] },
    hermes: { tokenSha256: sha(BROKER_ONLY_TOKEN), scopes: ['anthropic'] },
  });
  _resetRegistryCacheForTests();
  _resetPoliciesForTests();
  registerToolPolicy('search-docs', { actionClass: 'READ' });
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) Reflect.deleteProperty(process.env, k);
    else process.env[k] = saved[k];
  }
  _resetRegistryCacheForTests();
});

describe('resolveThemisPrincipal', () => {
  it('derives operator, tenant and agent from verified credentials', async () => {
    const principal = await principalFor();
    expect(principal).toEqual({ operatorId: 'operator-1', orgId: 'tenant-1', agentId: 'openclaw' });
    expect(Object.isFrozen(principal)).toBe(true);
    expect(isVerifiedThemisPrincipal(principal)).toBe(true);
  });

  it('accepts the legacy orgId claim when organizationId is absent', async () => {
    const principal = await principalFor({ userId: 'operator-1', orgId: 'tenant-2' } as never);
    expect(principal.orgId).toBe('tenant-2');
  });

  it.each([
    ['missing operator token', undefined, AGENT_TOKEN, 'operator-token-missing'],
    [
      'operator token signed with another secret',
      operatorToken({ userId: 'operator-1', organizationId: 'tenant-1' }, 'x'.repeat(40)),
      AGENT_TOKEN,
      'operator-token-invalid',
    ],
    [
      'refresh token presented as access token',
      operatorToken({ userId: 'operator-1', organizationId: 'tenant-1', type: 'refresh' }),
      AGENT_TOKEN,
      'operator-token-invalid',
    ],
    [
      'operator token without tenant',
      operatorToken({ userId: 'operator-1' }),
      AGENT_TOKEN,
      'operator-tenant-missing',
    ],
    [
      'unregistered agent token',
      operatorToken({ userId: 'operator-1', organizationId: 'tenant-1' }),
      'forged-agent-token',
      'agent-token-invalid',
    ],
    [
      'agent token without themis-bridge scope',
      operatorToken({ userId: 'operator-1', organizationId: 'tenant-1' }),
      BROKER_ONLY_TOKEN,
      'agent-scope-missing',
    ],
  ])('rejects %s', async (_label, operatorAccessToken, agentBearerToken, reason) => {
    const result = await resolveThemisPrincipal({ operatorAccessToken, agentBearerToken });
    expect(result).toEqual({ ok: false, reason });
  });

  it('rejects a revoked operator token', async () => {
    const token = operatorToken({ userId: 'operator-1', organizationId: 'tenant-1' });
    await authService.revokeToken(token);
    const result = await resolveThemisPrincipal({
      operatorAccessToken: token,
      agentBearerToken: AGENT_TOKEN,
    });
    expect(result).toEqual({ ok: false, reason: 'operator-token-invalid' });
  });
});

describe('issueThemisBridgeVerdict identity boundary', () => {
  const call = { name: 'search-docs', arguments: { query: 'cbam' } };
  const context = { agentName: 'themis', orgId: 'tenant-1', sessionId: 'session-1' };

  it('signs scope from the verified principal after the per-tool gate allows it', async () => {
    const principal = await principalFor();
    const verdict = issueThemisBridgeVerdict({
      call,
      context,
      principal,
      trustScore: 90,
      policyVersion: 'themis-policy-v1',
    });

    expect(verdict.decision).toBe('allowed');
    expect(verdict.gate).toBe('themis-policy-gate');
    const ticketLifetime = Date.parse(verdict.expiresAt!) - Date.parse(verdict.issuedAt!);
    expect(ticketLifetime).toBeGreaterThan(29_000);
    expect(ticketLifetime).toBeLessThanOrEqual(30_000);
    expect(verdict.scope).toEqual({
      agentId: 'openclaw',
      operatorId: 'operator-1',
      orgId: 'tenant-1',
      sessionId: 'session-1',
      capability: 'search-docs',
      paramsDigest: digestOf(call.arguments),
      authorizationId: expect.any(String),
    });
    expect(verifyKyaVerdict(verdict)).toBe(true);
  });

  it('still denies an unregistered capability for a verified principal', async () => {
    const verdict = issueThemisBridgeVerdict({
      call: { name: 'unregistered-harness-tool', arguments: {} },
      context,
      principal: await principalFor(),
      trustScore: 90,
      policyVersion: 'themis-policy-v1',
    });
    expect(verdict.decision).toBe('denied');
    expect(verifyKyaVerdict(verdict)).toBe(true);
  });

  it('rejects a hand-built principal carrying caller-chosen identity strings', () => {
    const forged = { operatorId: 'operator-1', orgId: 'tenant-1', agentId: 'openclaw' };
    expect(() =>
      issueThemisBridgeVerdict({
        call,
        context,
        principal: forged,
        trustScore: 90,
        policyVersion: 'themis-policy-v1',
      }),
    ).toThrow(/not resolved from verified credentials/);
  });

  it('rejects a copy of a verified principal with a swapped operator', async () => {
    const copy = { ...(await principalFor()), operatorId: 'operator-2' };
    expect(() =>
      issueThemisBridgeVerdict({
        call,
        context,
        principal: copy,
        trustScore: 90,
        policyVersion: 'themis-policy-v1',
      }),
    ).toThrow(/not resolved from verified credentials/);
  });

  it('rejects a request context naming another tenant than the operator token', async () => {
    const principal = await principalFor();
    expect(() =>
      issueThemisBridgeVerdict({
        call,
        context: { ...context, orgId: 'tenant-2' },
        principal,
        trustScore: 90,
        policyVersion: 'themis-policy-v1',
      }),
    ).toThrow(/tenant does not match/);
  });

  it('bridge rejects a request that claims another agent or operator than the signed principal', async () => {
    const verdict = issueThemisBridgeVerdict({
      call,
      context: { ...context, sessionId: 'kya-1' },
      principal: await principalFor(),
      trustScore: 90,
      policyVersion: 'themis-policy-v1',
    });
    const auditSink = {
      logInvocation: async () => ({ traceId: 'trace-1' }),
      logResult: async () => undefined,
    };
    const bridge = new NemoClawBridge(
      {
        nemoclawEndpoint: 'https://nemoclaw.internal/rpc',
        nemoclawApiKey: 'runtime-token',
        timeoutMs: 1000,
        allowedSkills: ['search-docs'],
        logBasePath: '/tmp',
        maxResponseBytes: 2048,
      },
      { auditSink },
    );
    bridge.registerSkill({
      name: 'search-docs',
      description: 'Search internal docs',
      inputSchema: {},
      outputSchema: {},
      requiresNetwork: false,
      requiresFilesystem: false,
      minimumATS: 10,
    });
    const base = {
      method: 'search-docs',
      params: call.arguments,
      callerAgentId: 'openclaw',
      operatorId: 'operator-1',
      orgId: 'tenant-1',
      kyaSessionId: 'kya-1',
      kyaVerdict: verdict,
    };

    for (const impersonation of [
      { ...base, callerAgentId: 'athena' },
      { ...base, operatorId: 'operator-2' },
    ]) {
      const result = await bridge.invoke(impersonation);
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Themis KYA authorization is invalid/);
    }

    // Control: the same verdict dispatches when the request matches the principal.
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: true, text: async () => JSON.stringify({ result: { ok: true } }) })),
    );
    try {
      expect((await bridge.invoke(base)).success).toBe(true);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

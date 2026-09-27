// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-6-luna Agent=OpenClaw-Phase2 Date=2026-09-27
// Audit trail: git log -- src/__tests__/command-audit.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';

const logger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

vi.mock('../utils/logger.js', () => ({ default: logger }));

import type { CommandAuditSink } from '../mcp/command-audit-logger.js';
import type { Pool } from 'pg';
import type { BridgeRequest } from '../mcp/nemoclaw-bridge.js';

const originalSigningSecret = process.env.KYA_VERDICT_SIGNING_SECRET;

function makeFakeSink(): CommandAuditSink & {
  logInvocation: ReturnType<typeof vi.fn>;
  logResult: ReturnType<typeof vi.fn>;
} {
  const usedAuthorizations = new Set<string>();
  return {
    logInvocation: vi.fn(async (entry) => {
      if (entry.authorizationId && usedAuthorizations.has(entry.authorizationId)) {
        throw new Error('duplicate single-use authorization');
      }
      if (entry.authorizationId) usedAuthorizations.add(entry.authorizationId);
      return { traceId: 'trace-1' };
    }),
    logResult: vi.fn(async () => undefined),
  };
}

async function signedRequest(
  options: {
    method?: string;
    params?: Record<string, unknown>;
    orgId?: string;
    expiresAt?: string;
  } = {},
): Promise<BridgeRequest> {
  const [{ issueKyaVerdict }, { digestOf }] = await Promise.all([
    import('../security/runtime-auth.js'),
    import('../security/canonical-digest.js'),
  ]);
  const method = options.method ?? 'search-docs';
  const params = options.params ?? { query: 'cbam' };
  const authorizationId = randomUUID();
  return {
    method,
    params,
    callerAgentId: 'agent-1',
    operatorId: 'operator-1',
    orgId: options.orgId ?? 'tenant-1',
    kyaSessionId: 'kya-1',
    kyaVerdict: issueKyaVerdict({
      decision: 'allowed',
      trustScore: 90,
      policyVersion: 'themis-policy-v1',
      gate: 'themis-policy-gate',
      scope: {
        agentId: 'agent-1',
        operatorId: 'operator-1',
        orgId: 'tenant-1',
        sessionId: 'kya-1',
        capability: method,
        paramsDigest: digestOf(params),
        authorizationId,
      },
      expiresAt: options.expiresAt ?? new Date(Date.now() + 30_000).toISOString(),
    }),
  };
}

function okFetch() {
  return vi.fn(async () => ({
    ok: true,
    text: async () => JSON.stringify({ result: { ok: true } }),
  })) as unknown as typeof fetch;
}

const SKILL = {
  name: 'search-docs',
  description: 'Search internal docs',
  inputSchema: {},
  outputSchema: {},
  requiresNetwork: false,
  requiresFilesystem: false,
  minimumATS: 10,
};

beforeEach(() => {
  process.env.KYA_VERDICT_SIGNING_SECRET = 'test-secret-a';
  logger.info.mockReset();
  logger.warn.mockReset();
  logger.error.mockReset();
  logger.debug.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalSigningSecret === undefined) delete process.env.KYA_VERDICT_SIGNING_SECRET;
  else process.env.KYA_VERDICT_SIGNING_SECRET = originalSigningSecret;
});

describe('digestOf', () => {
  it('is deterministic and distinguishes values', async () => {
    const { digestOf } = await import('../mcp/command-audit-logger.js');
    expect(digestOf({ a: 1, b: 2 })).toBe(digestOf({ a: 1, b: 2 }));
    expect(digestOf('x')).not.toBe(digestOf('y'));
  });

  it('is independent of object key order', async () => {
    const { digestOf } = await import('../mcp/command-audit-logger.js');
    expect(digestOf({ a: 1, b: 2 })).toBe(digestOf({ b: 2, a: 1 }));
    expect(digestOf({ a: { x: 1, y: 2 } })).toBe(digestOf({ a: { y: 2, x: 1 } }));
  });

  it('does not collide across types', async () => {
    const { digestOf } = await import('../mcp/command-audit-logger.js');
    expect(digestOf(1)).not.toBe(digestOf('1'));
    expect(digestOf(true)).not.toBe(digestOf('true'));
    expect(digestOf(null)).not.toBe(digestOf('null'));
  });
});

describe('Themis-issued bridge authorization', () => {
  it('persists authorization IDs with the single-use audit insert', async () => {
    const query = vi.fn(async () => ({ rows: [], rowCount: 1 }));
    const { CommandAuditLogger } = await import('../mcp/command-audit-logger.js');
    const auditLogger = new CommandAuditLogger({ query } as unknown as Pool);
    await auditLogger.logInvocation({
      bridge: 'nemoclaw',
      agentId: 'agent-1',
      operatorId: 'operator-1',
      orgId: 'tenant-1',
      kyaSessionId: 'kya-1',
      authorizationId: 'themis-ticket-12345678',
      skill: 'search-docs',
      params: { query: 'cbam' },
      decision: 'allowed',
    });

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('authorization_id'),
      expect.arrayContaining(['themis-ticket-12345678']),
    );
  });
});

describe('NemoClawBridge Article 12 command logging', () => {
  it('records an allowed invoke event and a result event on success', async () => {
    vi.stubGlobal('fetch', okFetch());
    const sink = makeFakeSink();

    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = new NemoClawBridge(
      {
        nemoclawEndpoint: 'http://127.0.0.1:3100',
        nemoclawApiKey: 'runtime-secret',
        allowedSkills: ['search-docs'],
      },
      { auditSink: sink, modelVersion: 'nemotron-31b' },
    );
    bridge.registerSkill(SKILL);

    const request = await signedRequest();
    const result = await bridge.invoke(request);

    expect(result.success).toBe(true);
    expect(sink.logInvocation).toHaveBeenCalledWith(
      expect.objectContaining({
        bridge: 'nemoclaw',
        skill: 'search-docs',
        decision: 'allowed',
        authorizationId: request.kyaVerdict.scope?.authorizationId,
        operatorId: 'operator-1',
        orgId: 'tenant-1',
        callerAts: 90,
        modelVersion: 'nemotron-31b',
      }),
    );
    expect(sink.logResult).toHaveBeenCalledWith(
      expect.objectContaining({ traceId: 'trace-1', success: true, skill: 'search-docs' }),
    );
  });

  it('fail-closed: blocks the command and skips fetch when pre-flight logging fails', async () => {
    const fetchMock = okFetch();
    vi.stubGlobal('fetch', fetchMock);
    const sink = makeFakeSink();
    sink.logInvocation.mockRejectedValueOnce(new Error('ledger down'));

    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = new NemoClawBridge(
      {
        nemoclawEndpoint: 'http://127.0.0.1:3100',
        nemoclawApiKey: 'runtime-secret',
        allowedSkills: ['search-docs'],
      },
      { auditSink: sink },
    );
    bridge.registerSkill(SKILL);

    const result = await bridge.invoke(await signedRequest({ params: {} }));

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Article 12 audit log unavailable/i);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sink.logResult).not.toHaveBeenCalled();
  });

  it('records a denied event for unregistered skills', async () => {
    vi.stubGlobal('fetch', okFetch());
    const sink = makeFakeSink();

    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = new NemoClawBridge(
      {
        nemoclawEndpoint: 'http://127.0.0.1:3100',
        nemoclawApiKey: 'runtime-secret',
        allowedSkills: [],
      },
      { auditSink: sink },
    );

    const result = await bridge.invoke(await signedRequest({ method: 'evil-skill', params: {} }));

    expect(result.success).toBe(false);
    expect(sink.logInvocation).toHaveBeenCalledWith(
      expect.objectContaining({
        bridge: 'nemoclaw',
        decision: 'denied',
        deniedReason: 'skill-not-registered',
      }),
    );
  });

  it('fails closed without an audit sink', async () => {
    const fetchMock = okFetch();
    vi.stubGlobal('fetch', fetchMock);

    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = new NemoClawBridge({
      nemoclawEndpoint: 'http://127.0.0.1:3100',
      nemoclawApiKey: 'runtime-secret',
      allowedSkills: ['search-docs'],
    });
    bridge.registerSkill(SKILL);

    const result = await bridge.invoke(await signedRequest({ params: {} }));

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/audit sink is unavailable/i);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('fails closed when runtime API authentication is absent', async () => {
    const fetchMock = okFetch();
    vi.stubGlobal('fetch', fetchMock);
    const sink = makeFakeSink();
    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = new NemoClawBridge({ allowedSkills: ['search-docs'] }, { auditSink: sink });
    bridge.registerSkill(SKILL);

    const result = await bridge.invoke(await signedRequest());

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/runtime authentication is not configured/i);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sink.logInvocation).toHaveBeenCalledWith(
      expect.objectContaining({ decision: 'denied', deniedReason: 'runtime-auth-not-configured' }),
    );
  });

  it.each([
    [
      'wrong tenant',
      () => {
        return signedRequest({ orgId: 'tenant-2' });
      },
    ],
    [
      'modified params',
      async () => {
        const request = await signedRequest();
        request.params.query = 'other';
        return request;
      },
    ],
    ['expired ticket', () => signedRequest({ expiresAt: new Date(Date.now() - 1).toISOString() })],
    [
      'missing signature',
      async () => {
        const request = await signedRequest();
        delete request.kyaVerdict.sig;
        return request;
      },
    ],
  ])('blocks %s authorization before reaching the harness', async (_label, makeRequest) => {
    const fetchMock = okFetch();
    vi.stubGlobal('fetch', fetchMock);
    const sink = makeFakeSink();
    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = new NemoClawBridge(
      { nemoclawApiKey: 'runtime-secret', allowedSkills: ['search-docs'] },
      { auditSink: sink },
    );
    bridge.registerSkill(SKILL);

    const result = await bridge.invoke(await makeRequest());

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/KYA authorization is invalid/i);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sink.logInvocation).toHaveBeenCalledWith(
      expect.objectContaining({ decision: 'denied', deniedReason: expect.any(String) }),
    );
  });

  it('consumes a signed authorization once; duplicate use is blocked before fetch', async () => {
    const fetchMock = okFetch();
    vi.stubGlobal('fetch', fetchMock);
    const sink = makeFakeSink();
    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = new NemoClawBridge(
      { nemoclawApiKey: 'runtime-secret', allowedSkills: ['search-docs'] },
      { auditSink: sink },
    );
    bridge.registerSkill(SKILL);
    const request = await signedRequest();

    expect((await bridge.invoke(request)).success).toBe(true);
    const replay = await bridge.invoke(request);

    expect(replay.success).toBe(false);
    expect(replay.error).toMatch(/authorization already consumed/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

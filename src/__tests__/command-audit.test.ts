import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const logger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

vi.mock('../utils/logger.js', () => ({ default: logger }));

import type { CommandAuditSink } from '../mcp/command-audit-logger.js';

function makeFakeSink(): CommandAuditSink & {
  logInvocation: ReturnType<typeof vi.fn>;
  logResult: ReturnType<typeof vi.fn>;
} {
  return {
    logInvocation: vi.fn(async () => ({ traceId: 'trace-1' })),
    logResult: vi.fn(async () => undefined),
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
  logger.info.mockReset();
  logger.warn.mockReset();
  logger.error.mockReset();
  logger.debug.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
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

describe('NemoClawBridge Article 12 command logging', () => {
  it('records an allowed invoke event and a result event on success', async () => {
    vi.stubGlobal('fetch', okFetch());
    const sink = makeFakeSink();

    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = new NemoClawBridge(
      { nemoclawEndpoint: 'http://127.0.0.1:3100', allowedSkills: ['search-docs'] },
      { auditSink: sink, modelVersion: 'nemotron-31b' },
    );
    bridge.registerSkill(SKILL);

    const result = await bridge.invoke(
      {
        method: 'search-docs',
        params: { query: 'cbam' },
        callerAgentId: 'agent-1',
        kyaSessionId: 'kya-1',
      },
      90,
    );

    expect(result.success).toBe(true);
    expect(sink.logInvocation).toHaveBeenCalledWith(
      expect.objectContaining({
        bridge: 'nemoclaw',
        skill: 'search-docs',
        decision: 'allowed',
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
      { nemoclawEndpoint: 'http://127.0.0.1:3100', allowedSkills: ['search-docs'] },
      { auditSink: sink },
    );
    bridge.registerSkill(SKILL);

    const result = await bridge.invoke(
      { method: 'search-docs', params: {}, callerAgentId: 'agent-1', kyaSessionId: 'kya-1' },
      90,
    );

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Article 12 audit log is unavailable/i);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(sink.logResult).not.toHaveBeenCalled();
  });

  it('records a denied event for unregistered skills', async () => {
    vi.stubGlobal('fetch', okFetch());
    const sink = makeFakeSink();

    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = new NemoClawBridge(
      { nemoclawEndpoint: 'http://127.0.0.1:3100', allowedSkills: [] },
      { auditSink: sink },
    );

    const result = await bridge.invoke(
      { method: 'evil-skill', params: {}, callerAgentId: 'agent-1', kyaSessionId: 'kya-1' },
      90,
    );

    expect(result.success).toBe(false);
    expect(sink.logInvocation).toHaveBeenCalledWith(
      expect.objectContaining({
        bridge: 'nemoclaw',
        decision: 'denied',
        deniedReason: 'skill-not-registered',
      }),
    );
  });

  it('without an audit sink, runs normally (legacy operational-log behaviour)', async () => {
    const fetchMock = okFetch();
    vi.stubGlobal('fetch', fetchMock);

    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = new NemoClawBridge({
      nemoclawEndpoint: 'http://127.0.0.1:3100',
      allowedSkills: ['search-docs'],
    });
    bridge.registerSkill(SKILL);

    const result = await bridge.invoke(
      { method: 'search-docs', params: {}, callerAgentId: 'agent-1', kyaSessionId: 'kya-1' },
      90,
    );

    expect(result.success).toBe(true);
    expect(fetchMock).toHaveBeenCalled();
  });
});

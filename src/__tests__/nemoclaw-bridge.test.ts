import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const logger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

vi.mock('../utils/logger.js', () => ({ default: logger }));

const envSnapshot = { ...process.env };

beforeEach(() => {
  process.env = { ...envSnapshot };
  delete process.env.NEMOCLAW_ENDPOINT;
  delete process.env.NEMOCLAW_API_KEY;
  delete process.env.NEMOCLAW_ALLOWED_SKILLS;
  delete process.env.NEMOCLAW_TIMEOUT_MS;
  delete process.env.NEMOCLAW_MAX_RESPONSE_BYTES;
  delete process.env.NEMOCLAW_LOG_BASE_PATH;

  logger.info.mockReset();
  logger.warn.mockReset();
  logger.error.mockReset();
  logger.debug.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  process.env = { ...envSnapshot };
});

describe('NemoClawBridge.fromEnv', () => {
  it('uses secret-loader-backed environment variables for runtime config and auth', async () => {
    process.env.NEMOCLAW_ENDPOINT = 'https://nemoclaw.internal/rpc';
    process.env.NEMOCLAW_API_KEY = 'secret-token';
    process.env.NEMOCLAW_ALLOWED_SKILLS = 'search-docs, summarize ';
    process.env.NEMOCLAW_TIMEOUT_MS = '45000';
    process.env.NEMOCLAW_MAX_RESPONSE_BYTES = '2048';
    process.env.NEMOCLAW_LOG_BASE_PATH = '/secure/logs';

    const fetchMock = vi.fn(async () => ({
      ok: true,
      text: async () => JSON.stringify({ result: { ok: true } }),
    })) as unknown as typeof fetch;

    vi.stubGlobal('fetch', fetchMock);

    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = NemoClawBridge.fromEnv();

    bridge.registerSkill({
      name: 'search-docs',
      description: 'Search internal docs',
      inputSchema: {},
      outputSchema: {},
      requiresNetwork: false,
      requiresFilesystem: false,
      minimumATS: 10,
    });

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
    expect(fetchMock).toHaveBeenCalledWith(
      'https://nemoclaw.internal/rpc',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer secret-token',
          'X-KYA-Session': 'kya-1',
          'X-DWS-Agent': 'agent-1',
        }),
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it('falls back to safe defaults when optional env values are absent or invalid', async () => {
    process.env.NEMOCLAW_ALLOWED_SKILLS = '  , alpha , , beta  ';
    process.env.NEMOCLAW_TIMEOUT_MS = '0';
    process.env.NEMOCLAW_MAX_RESPONSE_BYTES = 'NaN';

    const { NemoClawBridge } = await import('../mcp/nemoclaw-bridge.js');
    const bridge = NemoClawBridge.fromEnv();

    bridge.registerSkill({
      name: 'alpha',
      description: 'Alpha skill',
      inputSchema: {},
      outputSchema: {},
      requiresNetwork: false,
      requiresFilesystem: false,
      minimumATS: 0,
    });

    expect(() =>
      bridge.registerSkill({
        name: 'gamma',
        description: 'Gamma skill',
        inputSchema: {},
        outputSchema: {},
        requiresNetwork: false,
        requiresFilesystem: false,
        minimumATS: 0,
      }),
    ).toThrow(/not in the allowed skills whitelist/i);

    expect(bridge.listSkills().map((skill) => skill.name)).toEqual(['alpha']);
  });
});

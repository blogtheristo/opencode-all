import express from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

import { createHash } from 'crypto';

const logger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

vi.mock('../utils/logger.js', () => ({ default: logger }));

const { brokerRouter } = await import('../broker/broker.routes.js');
const { _resetRegistryCacheForTests } = await import('../broker/capability-tokens.js');

function sha256(plain: string): string {
  return createHash('sha256').update(plain, 'utf8').digest('hex');
}

const envSnapshot = { ...process.env };

async function buildApp() {
  _resetRegistryCacheForTests();

  const app = express();
  app.use(express.json());
  app.use('/api/v1/broker', brokerRouter);
  return app;
}

beforeEach(() => {
  process.env = { ...envSnapshot };
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.OPENROUTER_API_KEY;
  delete process.env.GROQ_API_KEY;
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.GMAIL_ACCESS_TOKEN;
  delete process.env.BROKER_AGENT_TOKENS;

  logger.info.mockReset();
  logger.warn.mockReset();
  logger.error.mockReset();
  logger.debug.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  process.env = { ...envSnapshot };
});

describe('credential broker', () => {
  it('rejects requests without a bearer token', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      nemoclaw: { tokenSha256: sha256('plain'), scopes: ['anthropic'] },
    });
    const app = await buildApp();

    const res = await request(app).post('/api/v1/broker/anthropic/v1/messages').send({});
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('broker_unauthenticated');
  });

  it('rejects requests with an unknown bearer token', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      nemoclaw: { tokenSha256: sha256('correct'), scopes: ['anthropic'] },
    });
    const app = await buildApp();

    const res = await request(app)
      .post('/api/v1/broker/anthropic/v1/messages')
      .set('Authorization', 'Bearer wrong')
      .send({});
    expect(res.status).toBe(401);
  });

  it('denies scopes the agent does not have', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      nemoclaw: { tokenSha256: sha256('plain'), scopes: ['telegram'] },
    });
    process.env.ANTHROPIC_API_KEY = 'sk-ant-real';
    const app = await buildApp();

    const res = await request(app)
      .post('/api/v1/broker/anthropic/v1/messages')
      .set('Authorization', 'Bearer plain')
      .send({});
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('broker_scope_denied');
  });

  it('returns 503 when upstream credential is not in the vault', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      nemoclaw: { tokenSha256: sha256('plain'), scopes: ['anthropic'] },
    });
    const app = await buildApp();

    const res = await request(app)
      .post('/api/v1/broker/anthropic/v1/messages')
      .set('Authorization', 'Bearer plain')
      .send({});
    expect(res.status).toBe(503);
    expect(res.body.error).toBe('broker_credential_unavailable');
  });

  it('returns 404 for an unregistered provider', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      nemoclaw: { tokenSha256: sha256('plain'), scopes: ['quasar'] },
    });
    const app = await buildApp();

    const res = await request(app)
      .post('/api/v1/broker/quasar/v1/x')
      .set('Authorization', 'Bearer plain')
      .send({});
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('broker_unknown_provider');
  });

  it('forwards to Anthropic with x-api-key and never exposes the credential to the agent', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      nemoclaw: { tokenSha256: sha256('plain'), scopes: ['anthropic'] },
    });
    process.env.ANTHROPIC_API_KEY = 'sk-ant-REAL-SECRET';

    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      // Make assertions about how the broker built the upstream call.
      expect(url).toBe('https://api.anthropic.com/v1/messages');
      const headers = init?.headers as Record<string, string>;
      expect(headers['x-api-key']).toBe('sk-ant-REAL-SECRET');
      expect(headers['anthropic-version']).toBe('2023-06-01');
      // Broker token MUST NOT be forwarded as Authorization upstream.
      expect(headers['authorization'] ?? headers['Authorization']).toBeUndefined();
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    });

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const app = await buildApp();
    const res = await request(app)
      .post('/api/v1/broker/anthropic/v1/messages')
      .set('Authorization', 'Bearer plain')
      .send({ model: 'claude-opus-4-7', messages: [] });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ ok: true });
    // Response body must not leak the upstream credential anywhere.
    expect(JSON.stringify(res.body)).not.toContain('sk-ant-REAL-SECRET');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('forwards to OpenRouter with Authorization: Bearer <key>', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      nemoclaw: { tokenSha256: sha256('plain'), scopes: ['openrouter'] },
    });
    process.env.OPENROUTER_API_KEY = 'or-key-xyz';

    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      expect(url).toBe('https://openrouter.ai/api/v1/chat/completions');
      const headers = init?.headers as Record<string, string>;
      expect(headers['Authorization']).toBe('Bearer or-key-xyz');
      return new Response('{}', { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const app = await buildApp();
    const res = await request(app)
      .post('/api/v1/broker/openrouter/v1/chat/completions')
      .set('Authorization', 'Bearer plain')
      .send({});
    expect(res.status).toBe(200);
  });

  it('forwards to Telegram with the bot token embedded in the URL path', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      hermes: { tokenSha256: sha256('h-token'), scopes: ['telegram'] },
    });
    process.env.TELEGRAM_BOT_TOKEN = '111:AAA';

    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      expect(url).toBe('https://api.telegram.org/bot111:AAA/sendMessage');
      const headers = init?.headers as Record<string, string>;
      // No Authorization header for Telegram — token is in the path.
      expect(headers['authorization'] ?? headers['Authorization']).toBeUndefined();
      return new Response('{}', { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const app = await buildApp();
    const res = await request(app)
      .post('/api/v1/broker/telegram/sendMessage')
      .set('Authorization', 'Bearer h-token')
      .send({ chat_id: 1, text: 'hi' });
    expect(res.status).toBe(200);
  });

  it('propagates upstream non-2xx status without retry', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      nemoclaw: { tokenSha256: sha256('plain'), scopes: ['anthropic'] },
    });
    process.env.ANTHROPIC_API_KEY = 'sk';

    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ type: 'error' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    const app = await buildApp();
    const res = await request(app)
      .post('/api/v1/broker/anthropic/v1/messages')
      .set('Authorization', 'Bearer plain')
      .send({});
    expect(res.status).toBe(429);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns 502 when upstream throws', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      nemoclaw: { tokenSha256: sha256('plain'), scopes: ['anthropic'] },
    });
    process.env.ANTHROPIC_API_KEY = 'sk';

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('econnreset');
      }) as unknown as typeof fetch,
    );

    const app = await buildApp();
    const res = await request(app)
      .post('/api/v1/broker/anthropic/v1/messages')
      .set('Authorization', 'Bearer plain')
      .send({});
    expect(res.status).toBe(502);
    expect(res.body.error).toBe('broker_upstream_failed');
  });

  it('writes an audit log entry per call', async () => {
    process.env.BROKER_AGENT_TOKENS = JSON.stringify({
      nemoclaw: { tokenSha256: sha256('plain'), scopes: ['anthropic'] },
    });
    process.env.ANTHROPIC_API_KEY = 'sk';

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('{}', { status: 200 })) as unknown as typeof fetch,
    );

    const app = await buildApp();
    await request(app)
      .post('/api/v1/broker/anthropic/v1/messages')
      .set('Authorization', 'Bearer plain')
      .send({ x: 1 });

    expect(logger.info).toHaveBeenCalledWith(
      expect.objectContaining({
        audit: 'broker',
        agentId: 'nemoclaw',
        providerId: 'anthropic',
        status: 200,
      }),
      expect.stringContaining('broker nemoclaw → anthropic'),
    );
  });
});

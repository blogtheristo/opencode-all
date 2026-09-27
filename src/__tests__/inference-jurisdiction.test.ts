// Evidence: Tool=Claude Code Model=anthropic Agent=kya-inference-ijs Date=2026-09-27
// Audit trail: git log -- src/__tests__/inference-jurisdiction.test.ts
import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  loadSessionInferenceCalls: vi.fn(),
}));

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn() }));

const ijs = await import('../identity/inference-jurisdiction.js');
const { computeInferenceJurisdiction, resolveProvider, tierForScore } = ijs;

describe('resolveProvider', () => {
  it.each([
    ['nemotron-3-super', 'dgx-local'],
    ['qwen3-coder:30b', 'dgx-local'],
    ['ollama/nemotron-3-super', 'dgx-local'],
    ['local-sovereign', 'dgx-local'],
    ['local-fast', 'dgx-local'],
    ['scaleway/mistral-small', 'scaleway'],
    ['claude-sonnet-5', 'anthropic'],
    ['anthropic/claude-opus-4-8', 'anthropic'],
    ['llama-3.3-70b-versatile', 'groq'],
    ['gemini-2.5-flash', 'google'],
    ['gpt-5', 'openai'],
    ['totally-new-model', 'unknown'],
  ])('%s → %s', (model, provider) => {
    expect(resolveProvider(model).provider).toBe(provider);
  });

  it('scores LiteLLM alias smart at its worst fallback hop (Claude, US)', () => {
    expect(resolveProvider('smart')).toEqual({ provider: 'anthropic', fallbackMayLeaveEu: true });
  });

  it("does not trust the coarse 'other' provider hint", () => {
    expect(resolveProvider('mystery', 'other').provider).toBe('unknown');
    expect(resolveProvider('mystery', 'anthropic').provider).toBe('anthropic');
  });
});

describe('computeInferenceJurisdiction', () => {
  it('returns NO_EVIDENCE with a null score when no calls are recorded', () => {
    const r = computeInferenceJurisdiction([]);
    expect(r).toMatchObject({ ijs: null, tier: 'NO_EVIDENCE', callsScored: 0 });
  });

  it('on-prem only session is SOVEREIGN 100', () => {
    const r = computeInferenceJurisdiction([
      { model: 'nemotron-3-super', source: 'input' },
      { model: 'qwen3-coder:30b', source: 'input' },
    ]);
    expect(r).toMatchObject({ ijs: 100, tier: 'SOVEREIGN', cloudActExposed: false });
    expect(r.providerChain).toHaveLength(1);
    expect(r.providerChain[0]).toMatchObject({ provider: 'dgx-local', calls: 2 });
  });

  it('one US call among many local calls exposes the whole session (weakest link)', () => {
    const r = computeInferenceJurisdiction([
      ...Array.from({ length: 9 }, () => ({ model: 'nemotron-3-super', source: 'input' as const })),
      { model: 'claude-sonnet-5', source: 'input' },
    ]);
    expect(r).toMatchObject({ ijs: 15, tier: 'EXPOSED', cloudActExposed: true });
    expect(r.reasonCodes).toContain('CLOUD_ACT_EXPOSURE');
    expect(r.providerChain[0].provider).toBe('anthropic');
  });

  it('EU sovereign cloud is SOVEREIGN 95', () => {
    const r = computeInferenceJurisdiction([{ model: 'scaleway/mistral-small', source: 'input' }]);
    expect(r).toMatchObject({ ijs: 95, tier: 'SOVEREIGN', cloudActExposed: false });
  });

  it('an unresolvable model scores 0 and is listed, never guessed', () => {
    const r = computeInferenceJurisdiction([
      { model: 'nemotron-3-super', source: 'input' },
      { model: 'totally-new-model', source: 'input' },
    ]);
    expect(r).toMatchObject({ ijs: 0, tier: 'EXPOSED', unresolvedModels: ['totally-new-model'] });
    expect(r.reasonCodes).not.toContain('CLOUD_ACT_EXPOSURE');
  });

  it('flags a fallback alias that may leave the EU', () => {
    const r = computeInferenceJurisdiction([{ model: 'smart', source: 'input' }]);
    expect(r).toMatchObject({ tier: 'EXPOSED', fallbackMayLeaveEu: true });
  });

  it.each([
    [100, 'SOVEREIGN'],
    [90, 'SOVEREIGN'],
    [89, 'COMPLIANT'],
    [70, 'COMPLIANT'],
    [69, 'PARTIAL'],
    [40, 'PARTIAL'],
    [39, 'EXPOSED'],
    [0, 'EXPOSED'],
  ] as const)('tier band %i → %s', (score, tier) => {
    expect(tierForScore(score).tier).toBe(tier);
  });
});

describe('loadSessionInferenceCalls', () => {
  it('reports both evidence sources as unavailable instead of returning a silent empty set', async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_KEY;
    const r = await ijs.loadSessionInferenceCalls('session-1');
    expect(r.calls).toEqual([]);
    expect(r.sources).toEqual([]);
    expect(r.unavailable).toHaveLength(2);
    expect(r.unavailable.join(' ')).toMatch(/kya_jev_calls.*token_usage_events/);
  });
});

describe('GET /api/v1/kya/inference/:sessionId', () => {
  vi.doMock('../identity/inference-jurisdiction.js', () => ({
    ...ijs,
    loadSessionInferenceCalls: mocks.loadSessionInferenceCalls,
  }));

  async function makeApp() {
    const { default: routes } = await import('../routes/kya-inference.routes.js');
    const app = express();
    app.use('/api/v1/kya/inference', routes);
    return app;
  }

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_API_KEY = 'test-admin-key';
    mocks.loadSessionInferenceCalls.mockResolvedValue({
      calls: [{ model: 'nemotron-3-super', source: 'kya_jev_calls' }],
      sources: ['kya_jev_calls'],
      unavailable: ['token_usage_events (INTERNAL_DB_URL not set)'],
    });
  });

  it('rejects missing or wrong credentials', async () => {
    const app = await makeApp();
    await request(app).get('/api/v1/kya/inference/session-1').expect(401);
    await request(app)
      .get('/api/v1/kya/inference/session-1')
      .set('Authorization', 'Bearer wrong')
      .expect(401);
    expect(mocks.loadSessionInferenceCalls).not.toHaveBeenCalled();
  });

  it('fails closed when ADMIN_API_KEY is unset', async () => {
    delete process.env.ADMIN_API_KEY;
    const app = await makeApp();
    await request(app)
      .get('/api/v1/kya/inference/session-1')
      .set('Authorization', 'Bearer anything')
      .expect(401);
  });

  it('rejects a malformed session id', async () => {
    const app = await makeApp();
    await request(app)
      .get('/api/v1/kya/inference/bad%20id%3B')
      .set('x-admin-key', 'test-admin-key')
      .expect(400);
    expect(mocks.loadSessionInferenceCalls).not.toHaveBeenCalled();
  });

  it('returns the score, provider chain and which evidence sources were unavailable', async () => {
    const app = await makeApp();
    const res = await request(app)
      .get('/api/v1/kya/inference/session-1')
      .set('Authorization', 'Bearer test-admin-key')
      .expect(200);
    expect(mocks.loadSessionInferenceCalls).toHaveBeenCalledWith('session-1');
    expect(res.body).toMatchObject({
      sessionId: 'session-1',
      inference: { ijs: 100, tier: 'SOVEREIGN' },
      evidence: {
        sources: ['kya_jev_calls'],
        unavailable: ['token_usage_events (INTERNAL_DB_URL not set)'],
      },
    });
  });

  it('returns 500 without leaking the error message', async () => {
    mocks.loadSessionInferenceCalls.mockRejectedValue(new Error('db password=secret'));
    const app = await makeApp();
    const res = await request(app)
      .get('/api/v1/kya/inference/session-1')
      .set('x-admin-key', 'test-admin-key')
      .expect(500);
    expect(JSON.stringify(res.body)).not.toContain('secret');
  });
});

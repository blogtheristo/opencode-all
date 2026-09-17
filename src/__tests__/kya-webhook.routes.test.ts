// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/__tests__/kya-webhook.routes.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import crypto from 'crypto';
import express from 'express';
import supertest from 'supertest';

process.env.SHUFTI_SECRET_KEY = 'shufti_test_secret_for_replay_tests';

vi.mock('../identity/kya-engine.js', () => ({
  evaluateSignal: vi.fn(() => ({ action: 'UPDATE_SCORE', reason: 'aml approved', sessionId: 's1' })),
  executeDecision: vi.fn(async () => null),
}));

const { default: kyaRouter } = await import('../routes/kya-webhook.routes.js');
const { evaluateSignal } = await import('../identity/kya-engine.js');

function buildApp() {
  const app = express();
  // Mirror app.ts: stash raw bytes in the json verify callback.
  app.use(express.json({ verify: (req, _res, buf) => { (req as express.Request & { rawBody?: Buffer }).rawBody = buf; } }));
  app.use('/api/v1/kya', kyaRouter);
  return app;
}

function signed(rawBody: string): string {
  return crypto.createHash('sha256').update(process.env.SHUFTI_SECRET_KEY! + rawBody).digest('hex');
}

const validPayload = {
  event: 'verification.status.changed',
  reference: 'kya-ref-001',
  verification_data: { aml_screening: { status: 'approved' } },
};

describe('kya webhook replay contract + raw-byte signatures', () => {
  beforeEach(() => vi.clearAllMocks());

  it('accepts a signature computed over the exact raw bytes', async () => {
    const raw = JSON.stringify(validPayload);
    const res = await supertest(buildApp())
      .post('/api/v1/kya/webhook/shufti')
      .set('Content-Type', 'application/json')
      .set('Signature', signed(raw))
      .send(raw);
    expect(res.status).toBe(200);
    expect(res.body.received).toBe(true);
    expect(evaluateSignal).toHaveBeenCalledOnce();
  });

  it('blocks an identical replay within the dedup window (200 duplicate, engine not re-run)', async () => {
    const raw = JSON.stringify({ ...validPayload, reference: 'kya-replay-002' });
    const app = buildApp();
    const first = await supertest(app).post('/api/v1/kya/webhook/shufti').set('Content-Type', 'application/json').set('Signature', signed(raw)).send(raw);
    expect(first.body.duplicate).toBeUndefined();
    const second = await supertest(app).post('/api/v1/kya/webhook/shufti').set('Content-Type', 'application/json').set('Signature', signed(raw)).send(raw);
    expect(second.status).toBe(200);
    expect(second.body.duplicate).toBe(true);
    expect(evaluateSignal).toHaveBeenCalledTimes(1); // only the first delivery processed
  });

  it('rejects a body tampered after signing with 401', async () => {
    const raw = JSON.stringify(validPayload);
    const tampered = JSON.stringify({ ...validPayload, verification_data: { aml_screening: { status: 'declined' } } });
    const res = await supertest(buildApp()).post('/api/v1/kya/webhook/shufti').set('Content-Type', 'application/json').set('Signature', signed(tampered)).send(raw);
    expect(res.status).toBe(401);
  });

  it('rejects invalid payload structure with 400 even when signed', async () => {
    const raw = JSON.stringify({ event: 'x' });
    const res = await supertest(buildApp()).post('/api/v1/kya/webhook/shufti').set('Content-Type', 'application/json').set('Signature', signed(raw)).send(raw);
    expect(res.status).toBe(400);
  });
});

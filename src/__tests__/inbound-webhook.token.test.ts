// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/__tests__/inbound-webhook.token.test.ts
import { afterEach, describe, expect, it, vi } from 'vitest';
import express from 'express';
import supertest from 'supertest';

process.env.INBOUND_WEBHOOK_TOKEN = 'whsec_inbound_test_token_0123456789';
process.env.OUTREACH_DIGEST_EMAIL = 'risto@lifetime.fi';

const { default: inboundRouter } = await import('../routes/webhook.routes.js');

function buildApp() {
  const app = express();
  app.use(express.json({ limit: '10kb' }));
  app.use('/webhooks', inboundRouter);
  return app;
}

afterEach(() => vi.restoreAllMocks());

describe('inbound webhook provider-token gate (fail-closed)', () => {
  it('rejects a missing token with 401 before any processing', async () => {
    const res = await supertest(buildApp()).post('/webhooks/inbound').send({ from: 'x@y.z', body: 'hi' });
    expect(res.status).toBe(401);
  });

  it('rejects a wrong token with 401', async () => {
    const res = await supertest(buildApp())
      .post('/webhooks/inbound')
      .set('X-Inbound-Token', 'wrong-token-value-000000000000')
      .send({ from: 'x@y.z', body: 'hi' });
    expect(res.status).toBe(401);
  });

  it('answers 503 fail-closed when the token is not configured server-side', async () => {
    delete process.env.INBOUND_WEBHOOK_TOKEN;
    try {
      const res = await supertest(buildApp()).post('/webhooks/inbound').send({ from: 'x@y.z' });
      expect(res.status).toBe(503);
    } finally {
      process.env.INBOUND_WEBHOOK_TOKEN = 'whsec_inbound_test_token_0123456789';
    }
  });

  it('lets a correctly-tokened request pass the gate and hit the sender allowlist', async () => {
    // Unauthorized sender -> handler's own allowlist rejects AFTER auth passes,
    // proving the token layer no longer blocks legitimate callers.
    const res = await supertest(buildApp())
      .post('/webhooks/inbound')
      .set('X-Inbound-Token', 'whsec_inbound_test_token_0123456789')
      .send({ from: 'Attacker <attacker@evil.example>', subject: 'T:XXXX status responded', body: 'T:XXXX status responded' });
    expect(res.status).toBe(200);
    expect(res.body.rejected).toBe(true);
    expect(res.body.reason).toMatch(/Unauthorized sender/);
  });
});

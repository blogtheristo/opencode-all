// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-c-coverage Date=2026-09-27
// Audit trail: git log -- src/__tests__/payment-routes.test.ts
import crypto from 'crypto';
import express from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const authMocks = vi.hoisted(() => ({ verifyAccessToken: vi.fn() }));
vi.mock('../services/auth.service.js', () => ({
  default: { verifyAccessToken: authMocks.verifyAccessToken },
}));

process.env.PAYMENT_API_URL = 'https://payments.example';
process.env.PAYMENT_WEBHOOK_SECRET = 'payment-webhook-test-secret';
const { default: paymentRoutes } = await import('../routes/payment.routes.js');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/v1/payments', paymentRoutes);
  return app;
}

describe('payment routes', () => {
  beforeEach(() => authMocks.verifyAccessToken.mockReset());
  afterEach(() => vi.unstubAllGlobals());

  it('rejects subscription requests without a bearer token', async () => {
    const response = await request(makeApp()).post('/api/v1/payments/subscribe').send({
      plan: 'pro',
      payment_provider: 'paypal',
    });

    expect(response.status).toBe(401);
    expect(authMocks.verifyAccessToken).not.toHaveBeenCalled();
  });

  it('validates plan and provider after authentication', async () => {
    authMocks.verifyAccessToken.mockResolvedValue({ userId: 'user-1', email: 'user@example.com' });

    const response = await request(makeApp())
      .post('/api/v1/payments/subscribe')
      .set('Authorization', 'Bearer valid-token')
      .send({ plan: 'invalid', payment_provider: 'card' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation Error');
  });

  it('proxies a valid subscription using the verified identity', async () => {
    authMocks.verifyAccessToken.mockResolvedValue({ userId: 'user-1', email: 'user@example.com' });
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ payment_url: 'https://pay.example/session', provider: 'paypal' }),
        {
          status: 200,
          headers: { 'content-type': 'application/json' },
        },
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(makeApp())
      .post('/api/v1/payments/subscribe')
      .set('Authorization', 'Bearer valid-token')
      .send({
        plan: 'pro',
        payment_provider: 'paypal',
        user_id: 'attacker',
        user_email: 'attacker@example.com',
      });

    expect(response.status).toBe(200);
    expect(response.body.payment_url).toBe('https://pay.example/session');
    const forwarded = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(forwarded).toMatchObject({ user_id: 'user-1', user_email: 'user@example.com' });
  });

  it('requires a supported webhook signature', async () => {
    const response = await request(makeApp())
      .post('/api/v1/payments/webhook')
      .send({ type: 'payment.success', id: 'evt-1' });

    expect(response.status).toBe(401);
  });

  it('accepts a valid HMAC webhook and forwards the verified event', async () => {
    const event = { type: 'payment.success', id: 'evt-1' };
    const raw = JSON.stringify(event);
    const signature = crypto
      .createHmac('sha256', process.env.PAYMENT_WEBHOOK_SECRET!)
      .update(raw)
      .digest('hex');
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await request(makeApp())
      .post('/api/v1/payments/webhook')
      .set('x-webhook-signature', signature)
      .send(event);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ received: true, type: 'payment.success' });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://payments.example/v1/payments/webhook',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});

// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-c-coverage Date=2026-09-27
// Audit trail: git log -- src/__tests__/stripe-webhook.routes.test.ts
import crypto from 'crypto';
import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

process.env.STRIPE_WEBHOOK_SECRET = 'whsec_route_test';

const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  rpc: vi.fn(),
  logEvent: vi.fn(),
  flush: vi.fn(),
  emit: vi.fn(),
}));

vi.mock('../services/supabase.service.js', () => ({
  supabase: { from: mocks.from, rpc: mocks.rpc },
}));
vi.mock('../services/gtm-event-logger.js', () => ({
  gtmEventLogger: { logEvent: mocks.logEvent, flush: mocks.flush },
}));
vi.mock('../agents/event-bus.js', () => ({ eventBus: { emit: mocks.emit } }));

const { default: stripeWebhookRouter } = await import('../routes/stripe-webhook.routes.js');

function buildApp() {
  const app = express();
  app.use('/stripe-webhook', stripeWebhookRouter);
  return app;
}

function signed(event: Record<string, unknown>) {
  const body = JSON.stringify(event);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto
    .createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET!)
    .update(`${timestamp}.${body}`)
    .digest('hex');
  return { body, header: `t=${timestamp},v1=${signature}` };
}

function orderQuery(order: Record<string, unknown>) {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};
  builder.select = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.single = vi.fn().mockResolvedValue({ data: order, error: null });
  return builder;
}

describe('Stripe webhook route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.flush.mockResolvedValue(undefined);
    mocks.emit.mockResolvedValue(undefined);
    mocks.rpc.mockResolvedValue({ error: null });
  });

  it('rejects a request without a Stripe signature before billing mutations', async () => {
    const response = await request(buildApp())
      .post('/stripe-webhook')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ id: 'evt_unsigned', type: 'invoice.payment_succeeded' }));

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Missing signature' });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it('marks the matching order paid for a valid signed invoice event', async () => {
    mocks.from.mockReturnValue(orderQuery({ id: 'order-1', user_id: 'user-1', org_id: 'org-1' }));
    const event = {
      id: 'evt_paid_unique',
      type: 'invoice.payment_succeeded',
      created: 1_800_000_000,
      data: {
        object: {
          id: 'in_1',
          amount_paid: 12500,
          currency: 'eur',
          customer: 'cus_1',
          number: 'INV-1',
          customer_email: 'buyer@example.com',
        },
      },
    };
    const { body, header } = signed(event);

    const response = await request(buildApp())
      .post('/stripe-webhook')
      .set('Content-Type', 'application/json')
      .set('stripe-signature', header)
      .send(body);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      order_id: 'order-1',
      status: 'payment_completed',
    });
    expect(mocks.rpc).toHaveBeenCalledOnce();
    expect(mocks.rpc).toHaveBeenCalledWith('mark_order_paid', { p_order_id: 'order-1' });
  });

  it('replays the cached response without marking the order paid twice', async () => {
    mocks.from.mockReturnValue(
      orderQuery({ id: 'order-replay', user_id: 'user-1', org_id: 'org-1' }),
    );
    const event = {
      id: 'evt_replay_unique',
      type: 'invoice.payment_succeeded',
      created: 1_800_000_000,
      data: {
        object: {
          id: 'in_replay',
          amount_paid: 5000,
          currency: 'eur',
          customer: 'cus_1',
          number: 'INV-2',
        },
      },
    };
    const signedEvent = signed(event);
    const deliver = () =>
      request(buildApp())
        .post('/stripe-webhook')
        .set('Content-Type', 'application/json')
        .set('stripe-signature', signedEvent.header)
        .send(signedEvent.body);

    const first = await deliver();
    const replay = await deliver();

    expect(replay.status).toBe(200);
    expect(replay.body).toEqual(first.body);
    expect(mocks.rpc).toHaveBeenCalledTimes(1);
  });
});

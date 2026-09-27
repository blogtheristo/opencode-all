// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/order-intake.routes.test.ts
import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CatalogueProductError } from '../services/product-catalog.service.js';

const mocks = vi.hoisted(() => ({
  createIntent: vi.fn(),
  queueReview: vi.fn(),
  confirmPayment: vi.fn(),
  PaymentVerificationError: class PaymentVerificationError extends Error {},
  schemaReady: vi.fn(),
}));
vi.mock('../services/product-order-readiness.service.js', () => ({
  isProductOrderSchemaReady: mocks.schemaReady,
}));
vi.mock('../services/product-order.service.js', () => ({
  createProductOrderIntent: mocks.createIntent,
  queuePendingExternalPaymentReview: mocks.queueReview,
  confirmProductOrderPayment: mocks.confirmPayment,
  PaymentVerificationError: mocks.PaymentVerificationError,
}));

process.env.ADMIN_API_KEY = 'test-admin-key';
const { default: orderIntakeRoutes } = await import('../routes/order-intake.routes.js');

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/v1/orders', orderIntakeRoutes);
  return app;
}

const validOrder = {
  orderId: 'ORD-12345678',
  product: { id: 'DWS-IQ-006', name: 'Untrusted name', price: 1 },
  customer: {
    email: 'buyer@example.com',
    firstName: 'Buyer',
    lastName: 'Example',
    company: 'Example Oy',
    country: 'FI',
  },
  paymentMethod: 'revolut',
  timestamp: '2026-09-27T10:00:00.000Z',
};

describe('public order intake', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_API_KEY = 'test-admin-key';
    mocks.schemaReady.mockResolvedValue(true);
  });

  it('rejects an unknown SKU explicitly', async () => {
    mocks.createIntent.mockRejectedValue(
      new CatalogueProductError('UNKNOWN_SKU', 'Unknown product SKU: NO-SUCH-SKU'),
    );

    const response = await request(makeApp())
      .post('/v1/orders/notify')
      .send({ ...validOrder, product: { id: 'NO-SUCH-SKU' } });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('UNKNOWN_SKU');
  });

  it('returns the same durable intent for an idempotent replay', async () => {
    const baseIntent = {
      id: 'intent-1',
      product_id: 'DWS-IQ-006',
      product_name: 'Lifetime DWS IQ Platform (Version 6)',
      unit_amount_cents: 499900,
      currency: 'EUR',
      payment_status: 'pending',
      fulfilment_status: 'pending',
    };
    mocks.createIntent
      .mockResolvedValueOnce({ intent: { ...baseIntent, created: true } })
      .mockResolvedValueOnce({ intent: { ...baseIntent, created: false } });
    mocks.queueReview.mockResolvedValue({
      ...baseIntent,
      payment_review_notification_status: 'sent',
    });

    const first = await request(makeApp()).post('/v1/orders/notify').send(validOrder);
    const replay = await request(makeApp()).post('/v1/orders/notify').send(validOrder);

    expect(first.status).toBe(201);
    expect(replay.status).toBe(200);
    expect(replay.body).toMatchObject({ order_intent_id: 'intent-1', idempotent_replay: true });
    expect(mocks.createIntent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ idempotencyKey: 'notify:ORD-12345678' }),
    );
  });

  it('rejects buyer self-confirmation without the admin key', async () => {
    const response = await request(makeApp())
      .post('/v1/orders/11111111-1111-4111-8111-111111111111/confirm-payment')
      .set('x-operator-id', 'operator@example.com')
      .send({
        payment_provider: 'revolut',
        transaction_reference: 'rev_verified_1',
        amount_cents: 499900,
        currency: 'EUR',
      });

    expect(response.status).toBe(401);
    expect(mocks.confirmPayment).not.toHaveBeenCalled();
  });

  it('queues fulfilment after authorized verified payment confirmation', async () => {
    mocks.confirmPayment.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      product_id: 'DWS-IQ-006',
      payment_status: 'paid',
      fulfilment_status: 'queued',
    });

    const response = await request(makeApp())
      .post('/v1/orders/11111111-1111-4111-8111-111111111111/confirm-payment')
      .set('x-admin-key', 'test-admin-key')
      .set('x-operator-id', 'operator@example.com')
      .send({
        payment_provider: 'revolut',
        transaction_reference: 'rev_verified_1',
        amount_cents: 499900,
        currency: 'eur',
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ payment_status: 'paid', fulfilment_status: 'queued' });
    expect(mocks.confirmPayment).toHaveBeenCalledWith({
      provider: 'revolut',
      paymentReference: 'rev_verified_1',
      orderIntentId: '11111111-1111-4111-8111-111111111111',
      amountCents: 499900,
      currency: 'EUR',
      auditActor: 'operator@example.com',
      verificationMethod: 'admin_manual',
    });
  });

  it('returns conflict when the verified amount or currency mismatches', async () => {
    mocks.confirmPayment.mockRejectedValue(
      new mocks.PaymentVerificationError('Paid amount does not match immutable order amount'),
    );

    const response = await request(makeApp())
      .post('/v1/orders/11111111-1111-4111-8111-111111111111/confirm-payment')
      .set('x-admin-key', 'test-admin-key')
      .set('x-operator-id', 'operator@example.com')
      .send({
        payment_provider: 'paypal',
        transaction_reference: 'paypal_verified_1',
        amount_cents: 1,
        currency: 'USD',
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe('PAYMENT_VERIFICATION_FAILED');
  });

  it('reports schema readiness without creating an order', async () => {
    const ready = await request(makeApp()).get('/v1/orders/readiness');
    expect(ready.status).toBe(200);
    expect(ready.body).toEqual({ status: 'ready' });

    mocks.schemaReady.mockResolvedValue(false);
    const unavailable = await request(makeApp()).get('/v1/orders/readiness');
    expect(unavailable.status).toBe(503);
    expect(unavailable.body).toEqual({ status: 'unavailable' });
    expect(mocks.createIntent).not.toHaveBeenCalled();
  });
});

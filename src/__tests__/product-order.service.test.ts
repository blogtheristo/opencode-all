// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/product-order.service.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  from: vi.fn(),
  emit: vi.fn(),
  sendEmail: vi.fn(),
  sendLegacyConfirmation: vi.fn(),
  getProduct: vi.fn(),
}));

vi.mock('../services/supabase.service.js', () => ({
  supabase: { rpc: mocks.rpc, from: mocks.from },
}));
vi.mock('../agents/event-bus.js', () => ({ eventBus: { emit: mocks.emit } }));
vi.mock('../utils/send-email.js', () => ({
  escapeHtml: (value: string) => value,
  sendEmail: mocks.sendEmail,
}));
vi.mock('../services/billing.service.js', () => ({
  sendPaymentConfirmationEmail: mocks.sendLegacyConfirmation,
}));
vi.mock('../services/product-catalog.service.js', () => ({
  getPayableCatalogueProduct: mocks.getProduct,
}));

const { confirmProductOrderPayment, createProductOrderIntent, queuePendingExternalPaymentReview } =
  await import('../services/product-order.service.js');

function eventQuery(events: Array<Record<string, unknown>>) {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};
  builder.select = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.order = vi.fn().mockResolvedValue({ data: events, error: null });
  return builder;
}

function eventUpdate() {
  const builder: Record<string, ReturnType<typeof vi.fn>> = {};
  builder.update = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.eq.mockReturnValueOnce(builder).mockResolvedValueOnce({ error: null });
  return builder;
}

describe('product order service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.sendEmail.mockResolvedValue({ ok: true, transport: 'ses' });
    mocks.emit.mockResolvedValue(undefined);
    mocks.getProduct.mockResolvedValue({
      id: 'DWS-IQ-006',
      name: 'Authoritative Product',
      price: 4999,
      currency: 'EUR',
    });
  });

  it('derives product name and price from the trusted catalogue', async () => {
    mocks.rpc.mockResolvedValue({
      data: [{ id: 'intent-1', created: true, product_id: 'DWS-IQ-006' }],
      error: null,
    });

    await createProductOrderIntent({
      idempotencyKey: 'checkout-123',
      productId: 'DWS-IQ-006',
      buyerEmail: 'buyer@example.com',
      buyerName: 'Buyer',
      buyerCountry: 'FI',
      paymentProvider: 'revolut',
    });

    expect(mocks.rpc).toHaveBeenCalledWith(
      'create_product_order_intent',
      expect.objectContaining({
        p_product_name: 'Authoritative Product',
        p_unit_amount_cents: 499900,
        p_expected_payment_amount_cents: 499900,
        p_currency: 'EUR',
      }),
    );
  });

  it('transitions paid to queued and dispatches each durable event only once', async () => {
    const intent = {
      id: 'intent-1',
      product_id: 'DWS-IQ-006',
      product_name: 'Authoritative Product',
      unit_amount_cents: 499900,
      currency: 'EUR',
      buyer_email: 'buyer@example.com',
      buyer_name: 'Buyer',
      payment_provider: 'stripe',
      payment_status: 'paid',
      fulfilment_status: 'queued',
      operations_notification_status: 'pending',
    };
    mocks.rpc.mockImplementation((name: string) => {
      if (name === 'confirm_product_order_payment')
        return Promise.resolve({ data: [intent], error: null });
      return Promise.resolve({ data: null, error: null });
    });
    mocks.from
      .mockReturnValueOnce(
        eventQuery([
          { id: 'event-1', event_type: 'sales.purchase', payload: { product_id: 'DWS-IQ-006' } },
          {
            id: 'event-2',
            event_type: 'sales.fulfilment_requested',
            payload: { product_id: 'DWS-IQ-006' },
          },
        ]),
      )
      .mockReturnValueOnce(eventUpdate())
      .mockReturnValueOnce(eventUpdate())
      .mockReturnValueOnce(eventQuery([]));

    const first = await confirmProductOrderPayment({
      provider: 'stripe',
      paymentReference: 'in_1',
      orderIntentId: 'intent-1',
      amountCents: 499900,
      currency: 'EUR',
      auditActor: 'stripe:webhook:evt_1',
      verificationMethod: 'stripe_webhook',
    });
    await confirmProductOrderPayment({
      provider: 'stripe',
      paymentReference: 'in_1',
      orderIntentId: 'intent-1',
      amountCents: 499900,
      currency: 'EUR',
      auditActor: 'stripe:webhook:evt_1',
      verificationMethod: 'stripe_webhook',
    });

    expect(first).toMatchObject({ payment_status: 'paid', fulfilment_status: 'queued' });
    expect(mocks.emit).toHaveBeenCalledTimes(2);
    expect(mocks.emit).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'sales.purchase',
        payload: expect.objectContaining({ product_id: 'DWS-IQ-006' }),
      }),
    );
    expect(mocks.emit).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'sales.fulfilment_requested',
        payload: expect.objectContaining({ product_id: 'DWS-IQ-006' }),
      }),
    );
  });

  it('records failed operations email as retryable without claiming fulfilment', async () => {
    const intent = {
      id: 'intent-email-failure',
      product_id: 'DWS-IQ-006',
      product_name: 'Authoritative Product',
      unit_amount_cents: 499900,
      currency: 'EUR',
      buyer_email: 'buyer@example.com',
      buyer_name: 'Buyer',
      payment_provider: 'stripe',
      payment_status: 'paid',
      fulfilment_status: 'queued',
      operations_notification_status: 'pending',
    };
    mocks.rpc.mockImplementation((name: string) => {
      if (name === 'confirm_product_order_payment')
        return Promise.resolve({ data: [intent], error: null });
      return Promise.resolve({ data: null, error: null });
    });
    mocks.from.mockReturnValueOnce(eventQuery([]));
    mocks.sendEmail
      .mockResolvedValueOnce({ ok: true, transport: 'ses' })
      .mockResolvedValueOnce({ ok: false, error: 'SES unavailable' });

    const result = await confirmProductOrderPayment({
      provider: 'stripe',
      paymentReference: 'in_email_failure',
      orderIntentId: intent.id,
      amountCents: 499900,
      currency: 'EUR',
      auditActor: 'stripe:webhook:evt_email',
      verificationMethod: 'stripe_webhook',
    });

    expect(result.fulfilment_status).toBe('queued');
    expect(mocks.rpc).toHaveBeenCalledWith(
      'record_product_order_operations_notification',
      expect.objectContaining({ p_status: 'failed', p_error: 'SES unavailable' }),
    );
  });

  it('creates a durable review event and operations warning for pending external payment', async () => {
    const intent = {
      id: 'intent-review',
      product_id: 'DWS-IQ-006',
      product_name: 'Authoritative Product',
      unit_amount_cents: 499900,
      expected_payment_amount_cents: 499900,
      currency: 'EUR',
      buyer_email: 'buyer@example.com',
      buyer_name: 'Buyer',
      payment_provider: 'revolut',
      checkout_reference: 'rev_checkout_1',
      payment_reference: null,
      payment_status: 'pending',
      fulfilment_status: 'pending',
      payment_review_notification_status: 'pending',
      operations_notification_status: 'pending',
    };
    mocks.rpc.mockImplementation((name: string) => {
      if (name === 'queue_product_order_payment_review') {
        return Promise.resolve({ data: [intent], error: null });
      }
      return Promise.resolve({ data: null, error: null });
    });
    mocks.from
      .mockReturnValueOnce(
        eventQuery([
          {
            id: 'event-review',
            event_type: 'sales.payment_review_requested',
            payload: { product_id: 'DWS-IQ-006' },
          },
        ]),
      )
      .mockReturnValueOnce(eventUpdate());

    await queuePendingExternalPaymentReview(intent.id, 'rev_checkout_1');

    expect(mocks.emit).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'sales.payment_review_requested' }),
    );
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringMatching(
          /Provider: revolut[\s\S]*Reference: rev_checkout_1[\s\S]*Buyer: Buyer[\s\S]*Product: Authoritative Product \(DWS-IQ-006\)[\s\S]*Expected amount: 4999.00 EUR[\s\S]*Verify provider payment before fulfilment\./,
        ),
      }),
    );
    expect(mocks.rpc).toHaveBeenCalledWith(
      'record_product_order_review_notification',
      expect.objectContaining({ p_status: 'sent' }),
    );
  });

  it('rejects an underpayment and forwards a valid immutable amount to verification', async () => {
    mocks.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: 'Paid amount does not match authoritative catalogue amount' },
    });

    await expect(
      confirmProductOrderPayment({
        provider: 'stripe',
        paymentReference: 'in_underpaid',
        orderIntentId: 'intent-1',
        amountCents: 1,
        currency: 'EUR',
        auditActor: 'stripe:webhook:evt_underpaid',
        verificationMethod: 'stripe_webhook',
      }),
    ).rejects.toThrow('Paid amount does not match');

    mocks.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: 'Paid currency does not match immutable order currency' },
    });
    await expect(
      confirmProductOrderPayment({
        provider: 'stripe',
        paymentReference: 'in_wrong_currency',
        orderIntentId: 'intent-1',
        amountCents: 499900,
        currency: 'USD',
        auditActor: 'stripe:webhook:evt_currency',
        verificationMethod: 'stripe_webhook',
      }),
    ).rejects.toThrow('Paid currency does not match');

    mocks.rpc.mockResolvedValueOnce({
      data: [
        {
          id: 'intent-legacy',
          product_id: 'DWS-IQ-006',
          product_name: 'Negotiated',
          unit_amount_cents: 600000,
          expected_payment_amount_cents: 550000,
          currency: 'EUR',
          buyer_email: 'buyer@example.com',
          buyer_name: 'Buyer',
          payment_provider: 'stripe',
          payment_status: 'paid',
          fulfilment_status: 'queued',
          operations_notification_status: 'sent',
        },
      ],
      error: null,
    });
    mocks.from.mockReturnValueOnce(eventQuery([]));
    await confirmProductOrderPayment({
      provider: 'stripe',
      paymentReference: 'in_valid',
      orderIntentId: 'intent-legacy',
      amountCents: 550000,
      currency: 'EUR',
      auditActor: 'stripe:webhook:evt_valid',
      verificationMethod: 'stripe_webhook',
    });
    expect(mocks.rpc).toHaveBeenLastCalledWith(
      'confirm_product_order_payment',
      expect.objectContaining({ p_amount_cents: 550000, p_currency: 'EUR' }),
    );
  });

  it('uses immutable legacy order amounts instead of the mutable catalogue price', async () => {
    const pendingIntent = {
      id: 'intent-adopted',
      created: true,
      product_id: 'DWS-IQ-006',
      product_name: 'Negotiated legacy product',
      unit_amount_cents: 600000,
      expected_payment_amount_cents: 550000,
      currency: 'EUR',
      buyer_email: 'buyer@example.com',
      buyer_name: 'Buyer',
      payment_provider: 'stripe',
      payment_status: 'pending',
      fulfilment_status: 'pending',
      operations_notification_status: 'pending',
    };
    mocks.rpc.mockImplementation((name: string) => {
      if (name === 'create_product_order_intent') {
        return Promise.resolve({ data: [pendingIntent], error: null });
      }
      if (name === 'confirm_product_order_payment') {
        return Promise.resolve({
          data: [{ ...pendingIntent, payment_status: 'paid', fulfilment_status: 'queued' }],
          error: null,
        });
      }
      return Promise.resolve({ data: null, error: null });
    });
    mocks.from.mockReturnValueOnce(eventQuery([]));

    await confirmProductOrderPayment({
      provider: 'stripe',
      paymentReference: 'in_negotiated',
      amountCents: 550000,
      currency: 'eur',
      auditActor: 'stripe:webhook:evt_negotiated',
      verificationMethod: 'stripe_webhook',
      buyerEmail: 'buyer@example.com',
      legacyOrder: {
        id: 'legacy-order-1',
        product_id: 'DWS-IQ-006',
        product_name: 'Negotiated legacy product',
        user_id: 'user-1',
        product_price_cents: 600000,
        remainder_amount_cents: 550000,
        currency: 'EUR',
      },
    });

    expect(mocks.getProduct).not.toHaveBeenCalled();
    expect(mocks.rpc).toHaveBeenCalledWith(
      'create_product_order_intent',
      expect.objectContaining({
        p_unit_amount_cents: 600000,
        p_expected_payment_amount_cents: 550000,
      }),
    );
    expect(mocks.rpc).toHaveBeenCalledWith(
      'confirm_product_order_payment',
      expect.objectContaining({ p_amount_cents: 550000, p_currency: 'eur' }),
    );
  });
});

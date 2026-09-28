// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/services/product-order.service.ts
import { eventBus } from '../agents/event-bus.js';
import logger from '../utils/logger.js';
import { escapeHtml, sendEmail } from '../utils/send-email.js';
import { sendPaymentConfirmationEmail } from './billing.service.js';
import {
  type FulfilmentPacket,
  loadFulfilmentPacket,
  renderBuyerPacket,
  renderOperationsPacket,
} from './fulfilment-packet.service.js';
import { type CatalogueProduct, getPayableCatalogueProduct } from './product-catalog.service.js';
import { supabase } from './supabase.service.js';

export type PaymentProvider = 'revolut' | 'paypal' | 'stripe';

export interface ProductOrderIntent {
  id: string;
  idempotency_key: string;
  product_id: string;
  product_name: string;
  unit_amount_cents: number;
  expected_payment_amount_cents: number;
  currency: string;
  buyer_email: string;
  buyer_name: string;
  buyer_company: string | null;
  buyer_country: string;
  payment_provider: PaymentProvider;
  checkout_reference: string | null;
  payment_reference: string | null;
  checkout_url: string | null;
  payment_status: string;
  fulfilment_status: string;
  payment_review_notification_status: string;
  operations_notification_status: string;
  created: boolean;
}

interface CreateIntentInput {
  idempotencyKey: string;
  productId: string;
  buyerEmail: string;
  buyerName: string;
  buyerCompany?: string;
  buyerCountry: string;
  paymentProvider: PaymentProvider;
  buyerUserId?: string;
  metadata?: Record<string, unknown>;
  unitAmountCents?: number;
  expectedPaymentAmountCents?: number;
}

interface ConfirmPaymentInput {
  provider: PaymentProvider;
  paymentReference: string;
  orderIntentId?: string;
  amountCents: number;
  currency: string;
  auditActor: string;
  verificationMethod: 'stripe_webhook' | 'admin_manual';
  legacyOrder?: {
    id: string;
    product_id?: string | null;
    product_name?: string | null;
    user_id?: string | null;
    company_billing_profile_id?: string | null;
    product_price_cents?: number | null;
    remainder_amount_cents?: number | null;
    currency?: string | null;
  };
  buyerEmail?: string;
}

interface OrderEventRow {
  id: string;
  event_type: 'sales.payment_review_requested' | 'sales.purchase' | 'sales.fulfilment_requested';
  payload: Record<string, unknown>;
}

function firstRow<T>(data: T | T[] | null): T | null {
  return Array.isArray(data) ? (data[0] ?? null) : data;
}

async function persistProductOrderIntent(
  input: CreateIntentInput,
  product: CatalogueProduct,
): Promise<{ intent: ProductOrderIntent; product: CatalogueProduct }> {
  const unitAmountCents = input.unitAmountCents ?? Math.round(product.price * 100);
  const expectedPaymentAmountCents = input.expectedPaymentAmountCents ?? unitAmountCents;
  if (
    !Number.isSafeInteger(unitAmountCents) ||
    !Number.isSafeInteger(expectedPaymentAmountCents) ||
    unitAmountCents <= 0 ||
    expectedPaymentAmountCents <= 0
  ) {
    throw new Error('Order amounts must be positive integers in minor currency units');
  }
  const { data, error } = await supabase.rpc('create_product_order_intent', {
    p_idempotency_key: input.idempotencyKey,
    p_product_id: product.id,
    p_product_name: product.name,
    p_unit_amount_cents: unitAmountCents,
    p_expected_payment_amount_cents: expectedPaymentAmountCents,
    p_currency: product.currency,
    p_buyer_email: input.buyerEmail,
    p_buyer_name: input.buyerName,
    p_buyer_company: input.buyerCompany || null,
    p_buyer_country: input.buyerCountry,
    p_payment_provider: input.paymentProvider,
    p_buyer_user_id: input.buyerUserId || null,
    p_metadata: input.metadata ?? {},
  });

  const intent = firstRow(data as ProductOrderIntent | ProductOrderIntent[] | null);
  if (error || !intent) {
    throw new Error(
      `Failed to persist product order intent: ${error?.message || 'no row returned'}`,
    );
  }

  logger.info('Product order intent persisted', {
    orderIntentId: intent.id,
    productId: product.id,
    paymentProvider: input.paymentProvider,
    created: intent.created,
  });
  return { intent, product };
}

export async function createProductOrderIntent(
  input: CreateIntentInput,
): Promise<{ intent: ProductOrderIntent; product: CatalogueProduct }> {
  const product = await getPayableCatalogueProduct(input.productId);
  return persistProductOrderIntent(input, product);
}

export async function attachProductOrderPayment(
  orderIntentId: string,
  paymentReference: string,
  checkoutUrl?: string,
): Promise<void> {
  const { error } = await supabase.rpc('attach_product_order_payment', {
    p_order_intent_id: orderIntentId,
    p_payment_reference: paymentReference,
    p_checkout_url: checkoutUrl || null,
  });
  if (error) throw new Error(`Failed to attach payment reference: ${error.message}`);
}

async function dispatchPendingOrderEvents(intent: ProductOrderIntent): Promise<void> {
  const { data, error } = await supabase
    .from('product_order_events')
    .select('id, event_type, payload')
    .eq('order_intent_id', intent.id)
    .eq('dispatch_status', 'pending')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to load product order events: ${error.message}`);

  for (const event of (data ?? []) as OrderEventRow[]) {
    await eventBus.emit({
      type: event.event_type,
      source: 'product_order_service',
      payload: { ...event.payload, event_id: event.id, product_id: intent.product_id },
      priority: event.event_type === 'sales.purchase' ? 'normal' : 'high',
      timestamp: new Date().toISOString(),
      orgId: 'lifetime-oy',
      sessionId: intent.id,
    });

    const { error: updateError } = await supabase
      .from('product_order_events')
      .update({ dispatch_status: 'dispatched', dispatched_at: new Date().toISOString() })
      .eq('id', event.id)
      .eq('dispatch_status', 'pending');
    if (updateError) {
      throw new Error(`Failed to mark product order event dispatched: ${updateError.message}`);
    }
  }
}

async function sendPendingPaymentReviewNotification(intent: ProductOrderIntent): Promise<void> {
  if (intent.payment_review_notification_status === 'sent') return;

  const recipient = process.env.PRODUCT_FULFILMENT_EMAIL || 'risto@onelifetime.world';
  const expectedAmount = (intent.expected_payment_amount_cents / 100).toFixed(2);
  const result = await sendEmail({
    from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
    to: recipient,
    subject: `Payment verification required — ${intent.product_id}`,
    text: `Pending external payment ${intent.id}
Provider: ${intent.payment_provider}
Reference: ${intent.checkout_reference}
Buyer: ${intent.buyer_name} <${intent.buyer_email}>
Product: ${intent.product_name} (${intent.product_id})
Expected amount: ${expectedAmount} ${intent.currency}

Verify provider payment before fulfilment.
`,
    html: `<p><strong>Pending external payment ${escapeHtml(intent.id)}</strong></p><ul><li>Provider: ${escapeHtml(intent.payment_provider)}</li><li>Reference: ${escapeHtml(intent.checkout_reference || 'not assigned')}</li><li>Buyer: ${escapeHtml(intent.buyer_name)} &lt;${escapeHtml(intent.buyer_email)}&gt;</li><li>Product: ${escapeHtml(intent.product_name)} (${escapeHtml(intent.product_id)})</li><li>Expected amount: ${expectedAmount} ${escapeHtml(intent.currency)}</li></ul><p><strong>Verify provider payment before fulfilment.</strong></p>`,
    source: 'platform',
    templateType: 'product_payment_review_requested',
    metadata: { order_intent_id: intent.id, product_id: intent.product_id },
  });

  const { error } = await supabase.rpc('record_product_order_review_notification', {
    p_order_intent_id: intent.id,
    p_status: result.ok ? 'sent' : 'failed',
    p_error: result.ok ? null : result.error || 'Unknown SES delivery error',
  });
  if (error) {
    logger.error('Failed to persist payment review notification status', {
      orderIntentId: intent.id,
      error: error.message,
    });
  }
  if (!result.ok) {
    logger.error('Pending payment review notification failed and remains retryable', {
      orderIntentId: intent.id,
      productId: intent.product_id,
      error: result.error,
    });
  }
}

export async function queuePendingExternalPaymentReview(
  orderIntentId: string,
  paymentReference: string,
): Promise<ProductOrderIntent> {
  if (!orderIntentId || !paymentReference) {
    throw new Error('Order intent and provider checkout reference are required');
  }
  const { data, error } = await supabase.rpc('queue_product_order_payment_review', {
    p_order_intent_id: orderIntentId,
    p_payment_reference: paymentReference,
  });
  const intent = firstRow(data as ProductOrderIntent | ProductOrderIntent[] | null);
  if (error || !intent) {
    throw new Error(`Failed to queue payment review: ${error?.message || 'not found'}`);
  }

  await dispatchPendingOrderEvents(intent);
  await sendPendingPaymentReviewNotification(intent);
  return intent;
}

// The packet enriches both emails; a missing or unreadable packet never blocks a paid-order
// notification, it is logged so the gap is visible (runbook falls back to manual step 2/5).
async function fulfilmentPacketFor(intent: ProductOrderIntent): Promise<FulfilmentPacket | null> {
  try {
    const packet = await loadFulfilmentPacket(intent.product_id);
    if (!packet) {
      logger.warn(
        'No complete fulfilment packet for paid order; send acceptance and exclusions manually',
        {
          orderIntentId: intent.id,
          productId: intent.product_id,
        },
      );
    }
    return packet;
  } catch (error) {
    logger.warn('Fulfilment packet unavailable; send acceptance and exclusions manually', {
      orderIntentId: intent.id,
      productId: intent.product_id,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function sendCustomerConfirmation(
  intent: ProductOrderIntent,
  packet: FulfilmentPacket | null,
): Promise<void> {
  const amount = (intent.expected_payment_amount_cents / 100).toFixed(2);
  const extra = packet ? renderBuyerPacket(packet) : { text: '', html: '' };
  const result = await sendEmail({
    from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
    to: intent.buyer_email,
    subject: `Payment confirmed — ${intent.product_name}`,
    text: `Hello ${intent.buyer_name},\n\nWe received your payment for ${intent.product_name} (${intent.product_id}), ${amount} ${intent.currency}. Order ${intent.id} is queued for delivery.\n\n${extra.text}`,
    html: `<p>Hello ${escapeHtml(intent.buyer_name)},</p><p>We received your payment for <strong>${escapeHtml(intent.product_name)}</strong> (${escapeHtml(intent.product_id)}), ${amount} ${escapeHtml(intent.currency)}.</p><p>Order <strong>${escapeHtml(intent.id)}</strong> is queued for delivery.</p>${extra.html}`,
    source: 'platform',
    templateType: 'product_payment_confirmation',
    metadata: { order_intent_id: intent.id, product_id: intent.product_id },
  });
  if (!result.ok) {
    logger.warn('Customer payment confirmation remains retryable', {
      orderIntentId: intent.id,
      productId: intent.product_id,
      error: result.error,
    });
  }
}

async function sendOperationsNotification(
  intent: ProductOrderIntent,
  packet: FulfilmentPacket | null,
): Promise<void> {
  if (intent.operations_notification_status === 'sent') return;
  const extra = packet
    ? renderOperationsPacket(packet)
    : {
        text: 'Fulfilment packet: MISSING — follow the runbook manually.\n',
        html: '<p>Fulfilment packet: MISSING — follow the runbook manually.</p>',
      };

  const recipient = process.env.PRODUCT_FULFILMENT_EMAIL || 'risto@onelifetime.world';
  const verifiedAmount = (intent.expected_payment_amount_cents / 100).toFixed(2);
  const result = await sendEmail({
    from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
    to: recipient,
    subject: `Fulfilment queued — ${intent.product_id}`,
    text: `Paid order ${intent.id}\nSKU: ${intent.product_id}\nProduct: ${intent.product_name}\nBuyer: ${intent.buyer_name} <${intent.buyer_email}>\nProvider: ${intent.payment_provider}\nTransaction reference: ${intent.payment_reference}\nVerified amount: ${verifiedAmount} ${intent.currency}\nFulfilment status: queued\n\n${extra.text}`,
    html: `<p><strong>Paid order ${escapeHtml(intent.id)}</strong></p><ul><li>SKU: ${escapeHtml(intent.product_id)}</li><li>Product: ${escapeHtml(intent.product_name)}</li><li>Buyer: ${escapeHtml(intent.buyer_name)} &lt;${escapeHtml(intent.buyer_email)}&gt;</li><li>Provider: ${escapeHtml(intent.payment_provider)}</li><li>Transaction reference: ${escapeHtml(intent.payment_reference || 'not assigned')}</li><li>Verified amount: ${verifiedAmount} ${escapeHtml(intent.currency)}</li><li>Fulfilment status: queued</li></ul>${extra.html}`,
    source: 'platform',
    templateType: 'product_fulfilment_requested',
    metadata: { order_intent_id: intent.id, product_id: intent.product_id },
  });

  const { error } = await supabase.rpc('record_product_order_operations_notification', {
    p_order_intent_id: intent.id,
    p_status: result.ok ? 'sent' : 'failed',
    p_error: result.ok ? null : result.error || 'Unknown SES delivery error',
  });
  if (error) {
    logger.error('Failed to persist operations notification status', {
      orderIntentId: intent.id,
      error: error.message,
    });
  }
  if (!result.ok) {
    logger.error('Product fulfilment notification failed and remains retryable', {
      orderIntentId: intent.id,
      productId: intent.product_id,
      error: result.error,
    });
  }
}

export class PaymentVerificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentVerificationError';
  }
}

export async function confirmProductOrderPayment(
  input: ConfirmPaymentInput,
): Promise<ProductOrderIntent> {
  if (!Number.isSafeInteger(input.amountCents) || input.amountCents <= 0) {
    throw new PaymentVerificationError('Verified payment amount must be a positive integer');
  }
  if (!/^[A-Za-z]{3}$/.test(input.currency)) {
    throw new PaymentVerificationError('Verified payment currency must be a three-letter code');
  }
  if (!input.paymentReference || input.paymentReference.length > 200) {
    throw new PaymentVerificationError('Verified provider transaction reference is required');
  }
  if (!input.auditActor || input.auditActor.trim().length < 3) {
    throw new PaymentVerificationError('Payment verification actor is required');
  }

  let intentId = input.orderIntentId;

  if (!intentId && input.legacyOrder) {
    if (!input.legacyOrder.product_id) {
      throw new Error('Cannot queue fulfilment for a paid order without product_id');
    }
    const immutableOrderAmount = input.legacyOrder.product_price_cents;
    const immutableExpectedPayment =
      input.legacyOrder.remainder_amount_cents ?? input.legacyOrder.product_price_cents;
    if (!immutableOrderAmount || !immutableExpectedPayment) {
      throw new Error('Legacy order is missing immutable payment amounts');
    }
    const legacyCurrency = (input.legacyOrder.currency || input.currency).toUpperCase();
    if (!/^[A-Z]{3}$/.test(legacyCurrency)) {
      throw new PaymentVerificationError('Legacy order has an invalid immutable currency');
    }
    const adopted = await persistProductOrderIntent(
      {
        idempotencyKey: `${input.provider}:${input.paymentReference}`,
        productId: input.legacyOrder.product_id,
        buyerEmail: input.buyerEmail || 'unknown@onelifetime.world',
        buyerName: input.buyerEmail || 'Stripe customer',
        buyerCountry: 'FI',
        paymentProvider: input.provider,
        buyerUserId: input.legacyOrder.user_id || undefined,
        metadata: { legacy_order_id: input.legacyOrder.id },
        unitAmountCents: immutableOrderAmount,
        expectedPaymentAmountCents: immutableExpectedPayment,
      },
      {
        id: input.legacyOrder.product_id,
        name: input.legacyOrder.product_name || input.legacyOrder.product_id,
        price: immutableOrderAmount / 100,
        currency: legacyCurrency,
      },
    );
    intentId = adopted.intent.id;
    await attachProductOrderPayment(intentId, input.paymentReference);
  }

  const { data, error } = await supabase.rpc('confirm_product_order_payment', {
    p_order_intent_id: intentId || null,
    p_payment_provider: input.provider,
    p_payment_reference: input.paymentReference,
    p_amount_cents: input.amountCents,
    p_currency: input.currency,
    p_verified_by: input.auditActor,
    p_verification_method: input.verificationMethod,
  });
  const intent = firstRow(data as ProductOrderIntent | ProductOrderIntent[] | null);
  if (error) {
    const message = error.message || 'unknown payment confirmation error';
    if (/mismatch|required|not found|cannot transition|conflicts|invalid/i.test(message)) {
      throw new PaymentVerificationError(`Failed to confirm product order payment: ${message}`);
    }
    throw new Error(`Failed to confirm product order payment: ${message}`);
  }
  if (!intent) {
    throw new Error('Failed to confirm product order payment: no row returned');
  }

  if (input.legacyOrder) {
    const { error: legacyError } = await supabase.rpc('mark_order_paid', {
      p_order_id: input.legacyOrder.id,
    });
    if (legacyError) throw new Error(`Failed to mark legacy order paid: ${legacyError.message}`);
  }

  await dispatchPendingOrderEvents(intent);
  const packet = await fulfilmentPacketFor(intent);
  await Promise.all([
    input.legacyOrder
      ? sendPaymentConfirmationEmail(input.legacyOrder)
      : sendCustomerConfirmation(intent, packet),
    sendOperationsNotification(intent, packet),
  ]);

  logger.info('Paid product order queued for fulfilment', {
    orderIntentId: intent.id,
    productId: intent.product_id,
    paymentProvider: input.provider,
    paymentReference: input.paymentReference,
    fulfilmentStatus: intent.fulfilment_status,
  });
  return intent;
}

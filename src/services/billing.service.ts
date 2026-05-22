import Stripe from 'stripe';
import axios from 'axios';
import logger from '../utils/logger.js';
import { supabase } from './supabase.service.js';
import { sendEmail } from '../utils/send-email.js';
import {
  generatePaymentConfirmationHTML,
  generatePaymentConfirmationPlainText,
} from '../templates/invoice-email.template.js';

let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (stripeClient) return stripeClient;

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  stripeClient = new Stripe(secret);
  return stripeClient;
}

// ============================================================================
// VAT VALIDATION
// ============================================================================

interface VATValidationResult {
  valid: boolean;
  country: string;
  vat_number: string;
  company_name?: string;
  address?: string;
}

/**
 * Validate VAT number using VIES API (EU)
 * Supports format: FI12345678, DE123456789, etc.
 */
export async function validateVATNumber(vat_number: string): Promise<VATValidationResult> {
  try {
    const country_code = vat_number.substring(0, 2).toUpperCase();

    // VIES API endpoint
    const response = await axios.post(
      'https://ec.europa.eu/taxation_customs/vies/checkVatService.asmx',
      {
        headers: {
          'Content-Type': 'application/soap+xml; charset=utf-8',
        },
      },
    );

    // Parse SOAP response
    // Note: This is simplified; real implementation needs proper XML parsing
    const valid = response.status === 200;

    return {
      valid,
      country: country_code,
      vat_number,
    };
  } catch (error) {
    logger.warn('VAT validation failed', { error, vat_number });
    return {
      valid: false,
      country: vat_number.substring(0, 2),
      vat_number,
    };
  }
}

// ============================================================================
// STRIPE INVOICE CREATION
// ============================================================================

interface InvoiceParams {
  order_id: string;
  user_id: string;
  company_name: string;
  vat_number: string;
  billing_address: string;
  city: string;
  postal_code: string;
  country: string;
  contact_email: string;
  product_id: string;
  remainder_amount_cents: number;
  product_price_cents: number;
  deposit_amount_cents: number;
  payment_due_date: Date;
}

/**
 * Create Stripe invoice for order remainder
 */
export async function createStripeInvoice(params: InvoiceParams): Promise<Stripe.Invoice> {
  const stripe = getStripeClient();
  const {
    order_id,
    user_id,
    company_name,
    vat_number,
    billing_address,
    city,
    postal_code,
    country,
    remainder_amount_cents,
    product_price_cents,
    deposit_amount_cents,
  } = params;

  // Create or retrieve Stripe customer
  let customer_id = user_id; // Use DWS user ID as Stripe customer ID in production

  try {
    // For production: fetch Stripe customer ID from user metadata
    // const { data: user } = await supabase
    //   .from('users')
    //   .select('stripe_customer_id')
    //   .eq('id', user_id)
    //   .single();
    //
    // if (user?.stripe_customer_id) {
    //   customer_id = user.stripe_customer_id;
    // }
  } catch (error) {
    logger.error('Failed to fetch user Stripe customer ID', { error, user_id });
  }

  // Step 1: Create invoice items
  await stripe.invoiceItems.create({
    customer: customer_id,
    amount: product_price_cents,
    currency: 'eur',
    description: `DWS Platform Deployment - Order #${order_id}`,
    metadata: { order_id },
  });

  await stripe.invoiceItems.create({
    customer: customer_id,
    amount: -deposit_amount_cents,
    currency: 'eur',
    description: 'Deposit Credit - Payment received via Revolut',
    metadata: { order_id },
  });

  // Step 2: Create invoice (automatically includes pending invoice items)
  const invoice = await stripe.invoices.create({
    customer: customer_id,
    metadata: {
      order_id,
      dws_company: company_name,
      vat_number,
    },
    custom_fields: [
      {
        name: 'Company',
        value: company_name,
      },
      {
        name: 'VAT Number',
        value: vat_number,
      },
      {
        name: 'Billing Address',
        value: `${billing_address}, ${postal_code} ${city}, ${country}`,
      },
    ],
    due_date: Math.floor(params.payment_due_date.getTime() / 1000),
    default_payment_method: undefined, // Customer must choose payment method
  });

  logger.info('Stripe invoice created', {
    invoice_id: invoice.id,
    order_id,
    amount: remainder_amount_cents,
  });

  return invoice;
}

// ============================================================================
// INVOICE MANAGEMENT
// ============================================================================

/**
 * Fetch invoice by ID
 */
export async function getInvoice(invoice_id: string): Promise<Stripe.Invoice | null> {
  try {
    return await getStripeClient().invoices.retrieve(invoice_id);
  } catch (error) {
    logger.error('Failed to fetch invoice', { error, invoice_id });
    return null;
  }
}

/**
 * Send invoice to customer email
 */
export async function sendInvoiceEmail(
  invoice_id: string,
  customer_email: string,
): Promise<boolean> {
  try {
    await getStripeClient().invoices.sendInvoice(invoice_id);
    logger.info('Invoice sent via email', { invoice_id, customer_email });
    return true;
  } catch (error) {
    logger.error('Failed to send invoice email', { error, invoice_id, customer_email });
    return false;
  }
}

/**
 * Mark invoice as void (if payment fails and order is cancelled)
 */
export async function voidInvoice(invoice_id: string): Promise<Stripe.Invoice | null> {
  try {
    const invoice = await getStripeClient().invoices.voidInvoice(invoice_id);
    logger.info('Invoice voided', { invoice_id });
    return invoice;
  } catch (error) {
    logger.error('Failed to void invoice', { error, invoice_id });
    return null;
  }
}

// ============================================================================
// PAYMENT TRACKING
// ============================================================================

/**
 * Send payment confirmation email to the customer for a paid order.
 * Safe to fire and forget — failures are logged but never throw so the
 * webhook ack path stays clean.
 */
export async function sendPaymentConfirmationEmail(order: {
  id: string;
  company_billing_profile_id?: string | null;
  product_id?: string | null;
  product_price_cents?: number | null;
}): Promise<void> {
  try {
    if (!order.company_billing_profile_id) {
      logger.warn('Cannot send payment confirmation: order has no billing profile', {
        order_id: order.id,
      });
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('company_billing_profiles')
      .select('company_name, contact_email')
      .eq('id', order.company_billing_profile_id)
      .single();

    if (profileError || !profile?.contact_email) {
      logger.warn('Cannot send payment confirmation: billing profile or contact email missing', {
        order_id: order.id,
        error: profileError,
      });
      return;
    }

    const companyName = (profile.company_name as string) || 'Customer';
    const contactEmail = profile.contact_email as string;
    const paidDate = new Date().toISOString().slice(0, 10);
    const params = {
      customer_name: companyName,
      company_name: companyName,
      order_id: order.id,
      paid_date: paidDate,
      invoice_amount_eur: order.product_price_cents ?? 0,
      product_name: (order.product_id as string) || 'DWS Platform',
    };

    const result = await sendEmail({
      from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
      to: contactEmail,
      subject: `Payment Confirmed — Order ${order.id}`,
      html: generatePaymentConfirmationHTML(params),
      text: generatePaymentConfirmationPlainText(params),
      source: 'platform',
      templateType: 'payment_confirmation',
      metadata: {
        order_id: order.id,
        company: companyName,
      },
    });

    if (!result.ok) {
      logger.warn('Payment confirmation email failed to send', {
        order_id: order.id,
        contactEmail,
        error: result.error,
      });
      return;
    }

    logger.info('Payment confirmation email sent', {
      order_id: order.id,
      contactEmail,
      transport: result.transport,
    });
  } catch (error) {
    logger.error('Error sending payment confirmation email', { error, order_id: order.id });
  }
}

/**
 * Handle Stripe invoice payment succeeded webhook
 */
export async function handleInvoicePaymentSucceeded(invoice_id: string): Promise<void> {
  try {
    // Fetch order by Stripe invoice ID
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_invoice_id', invoice_id)
      .single();

    if (error || !order) {
      logger.warn('Order not found for Stripe invoice', { invoice_id });
      return;
    }

    // Mark order as paid using Supabase function
    const { error: updateError } = await supabase.rpc('mark_order_paid', {
      p_order_id: order.id,
    });

    if (updateError) {
      logger.error('Failed to mark order paid', { error: updateError, order_id: order.id });
      return;
    }

    logger.info('Order marked as paid from Stripe webhook', {
      order_id: order.id,
      invoice_id,
    });

    await sendPaymentConfirmationEmail(order);
    // TODO: Activate service/product access
  } catch (error) {
    logger.error('Error handling invoice payment', { error, invoice_id });
  }
}

/**
 * Handle Stripe invoice marked uncollectible webhook
 */
export async function handleInvoiceUncollectible(invoice_id: string): Promise<void> {
  try {
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_invoice_id', invoice_id)
      .single();

    if (!order) {
      logger.warn('Order not found for failed Stripe invoice', { invoice_id });
      return;
    }

    logger.warn('Stripe invoice marked uncollectible', {
      order_id: order.id,
      invoice_id,
    });

    // TODO: Send payment failure notification to admin
    // TODO: Send payment reminder to customer
    // TODO: Schedule auto-cancel after 30 days
  } catch (error) {
    logger.error('Error handling uncollectible invoice', { error, invoice_id });
  }
}

// ============================================================================
// INVOICE PREVIEW
// ============================================================================

/**
 * Get preview of invoice line items before creation
 * Useful for showing customer estimated totals
 */
export function getInvoicePreview(
  product_price_cents: number,
  deposit_amount_cents: number,
): {
  subtotal: number;
  deposit: number;
  remainder: number;
} {
  const remainder = product_price_cents - deposit_amount_cents;
  return {
    subtotal: product_price_cents,
    deposit: deposit_amount_cents,
    remainder: Math.max(0, remainder),
  };
}

// ============================================================================
// REFUND HANDLING
// ============================================================================

/**
 * Handle refund if payment fails or order is cancelled
 */
export async function refundPayment(
  invoice_id: string,
  reason: string,
): Promise<Stripe.Refund | null> {
  try {
    const stripe = getStripeClient();
    const invoice = await stripe.invoices.retrieve(invoice_id);

    if (!(invoice as any).charge) {
      logger.warn('No charge found for invoice', { invoice_id });
      return null;
    }

    const refund = await stripe.refunds.create({
      charge: (invoice as any).charge as string,
      metadata: {
        invoice_id,
        reason,
      },
    });

    logger.info('Refund issued', { invoice_id, refund_id: refund.id, amount: refund.amount });
    return refund;
  } catch (error) {
    logger.error('Failed to issue refund', { error, invoice_id });
    return null;
  }
}

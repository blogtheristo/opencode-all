import { Router, Request, Response, NextFunction } from 'express';
import { supabase } from '../services/supabase.service.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';
import Stripe from 'stripe';
import { sendPaymentConfirmationEmail } from '../services/billing.service.js';

const router = Router();
let stripeClient: Stripe | null = null;
function getStripeClient(): Stripe | null {
  if (stripeClient) return stripeClient;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return null;
  stripeClient = new Stripe(secret);
  return stripeClient;
}

// ============================================================================
// REQUEST/RESPONSE SCHEMAS
// ============================================================================
// Schemas removed - validation handled in route handlers

// ============================================================================
// ENDPOINTS
// ============================================================================

/**
 * POST /api/v1/b2b/billing-profiles
 * Create or update company billing profile
 */
router.post(
  '/billing-profiles',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const {
        company_name,
        vat_number,
        business_id,
        billing_address,
        city,
        postal_code,
        country,
        contact_email,
        contact_phone,
      } = req.body;

      // Call Supabase function to create profile
      const { data, error } = await supabase.rpc('create_company_billing_profile', {
        p_user_id: userId,
        p_company_name: company_name,
        p_vat_number: vat_number,
        p_business_id: business_id,
        p_billing_address: billing_address,
        p_city: city,
        p_postal_code: postal_code,
        p_country: country,
        p_contact_email: contact_email,
        p_contact_phone: contact_phone,
      });

      if (error) {
        logger.error('Failed to create billing profile', { error, userId });
        return res.status(500).json({ error: 'Failed to create billing profile' });
      }

      logger.info('Billing profile created', { profileId: data.id, userId });
      return res.status(201).json(data);
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * GET /api/v1/b2b/billing-profiles
 * List user's billing profiles
 */
router.get(
  '/billing-profiles',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { data, error } = await supabase
        .from('company_billing_profiles')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Failed to fetch billing profiles', { error, userId });
        return res.status(500).json({ error: 'Failed to fetch billing profiles' });
      }

      return res.json(data);
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * POST /api/v1/b2b/orders
 * Create order after Revolut deposit confirmation
 */
router.post('/orders', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { product_id, company_billing_profile_id, deposit_amount_cents } = req.body;

    // Verify billing profile belongs to user
    const { data: profile, error: profileError } = await supabase
      .from('company_billing_profiles')
      .select('*')
      .eq('id', company_billing_profile_id)
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Billing profile not found' });
    }

    // Get product price from products.json (fetch from config)
    const { data: productsData, error: configError } = await supabase.storage
      .from('dws10-config')
      .download('products.json');

    if (configError) {
      logger.error('Failed to fetch products.json', { error: configError });
      return res.status(500).json({ error: 'Failed to fetch product pricing' });
    }

    const products = JSON.parse(await productsData.text());
    const product = products.find((p: any) => p.id === product_id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productPriceCents = Math.round(product.price * 100);

    // Validate deposit doesn't exceed product price
    if (deposit_amount_cents > productPriceCents) {
      return res.status(400).json({ error: 'Deposit exceeds product price' });
    }

    // Create order via Supabase function
    const { data: order, error: orderError } = await supabase.rpc('create_b2b_order', {
      p_user_id: userId,
      p_product_id: product_id,
      p_company_billing_profile_id: company_billing_profile_id,
      p_product_price_cents: productPriceCents,
      p_deposit_amount_cents: deposit_amount_cents,
    });

    if (orderError) {
      logger.error('Failed to create order', { error: orderError, userId });
      return res.status(500).json({ error: 'Failed to create order' });
    }

    logger.info('Order created', { orderId: order.id, userId, deposit: deposit_amount_cents });
    return res.status(201).json(order);
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/v1/b2b/orders/:id
 * Get order status and payment details
 */
router.get('/orders/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Fetch audit log for this order
    const { data: auditLog, error: auditError } = await supabase
      .from('payment_audit_log')
      .select('*')
      .eq('order_id', id)
      .order('created_at', { ascending: false });

    if (auditError) {
      logger.warn('Failed to fetch audit log', { error: auditError, orderId: id });
    }

    res.json({
      ...order,
      audit_trail: auditLog || [],
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * POST /api/v1/b2b/orders/:id/confirm-deposit
 * Confirm Revolut deposit and issue Stripe invoice
 */
router.post(
  '/orders/:id/confirm-deposit',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const { id } = req.params;
      const { revolut_transaction_id } = req.body;

      // Fetch order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (orderError || !order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      // Confirm deposit
      const { error: updateError } = await supabase.rpc('confirm_order_deposit', {
        p_order_id: id,
        p_revolut_transaction_id: revolut_transaction_id,
      });

      if (updateError) {
        logger.error('Failed to confirm deposit', { error: updateError, orderId: id });
        return res.status(500).json({ error: 'Failed to confirm deposit' });
      }

      // Fetch billing profile for invoice
      const { data: profile, error: profileError } = await supabase
        .from('company_billing_profiles')
        .select('*')
        .eq('id', order.company_billing_profile_id)
        .single();

      if (profileError) {
        logger.error('Failed to fetch billing profile', { error: profileError });
        return res.status(500).json({ error: 'Failed to fetch billing details' });
      }

      // Create Stripe invoice for remainder
      try {
        const stripe = getStripeClient();
        if (!stripe) {
          logger.error('Stripe invoice creation unavailable: STRIPE_SECRET_KEY missing');
          return res.status(503).json({ error: 'Stripe billing is not configured' });
        }

        // Step 1: Create invoice item (Stripe will bundle it into the invoice)
        await stripe.invoiceItems.create({
          customer: userId,
          amount: order.remainder_amount_cents,
          currency: 'eur',
          description: `Remainder for order ${id} - ${profile.company_name}`,
          metadata: {
            order_id: id,
          },
        });

        // Step 2: Create the invoice (it automatically includes the pending invoice item above)
        const invoice = await stripe.invoices.create({
          customer: userId,
          collection_method: 'send_invoice',
          days_until_due: Math.ceil(
            (new Date(order.payment_due_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          ),
          metadata: {
            order_id: id,
            dws_company: profile.company_name,
          },
          expand: ['charge'],
        });

        // Update order with Stripe invoice ID
        const { data: finalOrder, error: finalError } = await supabase.rpc('issue_order_invoice', {
          p_order_id: id,
          p_stripe_invoice_id: invoice.id,
        });

        if (finalError) {
          logger.error('Failed to link Stripe invoice', { error: finalError, orderId: id });
          return res.status(500).json({ error: 'Failed to create invoice' });
        }

        logger.info('Stripe invoice created', {
          orderId: id,
          invoiceId: invoice.id,
          amount: order.remainder_amount_cents,
        });

        return res.json({
          order: finalOrder,
          stripe_invoice_url: invoice.hosted_invoice_url || invoice.invoice_pdf,
        });
      } catch (stripeError) {
        logger.error('Stripe invoice creation failed', { error: stripeError, orderId: id });
        return res.status(500).json({ error: 'Failed to create Stripe invoice' });
      }
    } catch (err) {
      return next(err);
    }
  },
);

/**
 * POST /api/v1/payments/webhook
 * Handle Revolut + Stripe webhooks
 */
router.post('/webhook', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, payment_id, invoice_id } = req.body;

    logger.info('Payment webhook received', { type, payment_id, invoice_id });

    if (type === 'payment.success' && payment_id) {
      // Handle Revolut payment success (already handled in confirm-deposit endpoint)
      logger.info('Revolut payment success acknowledged', { payment_id });
    } else if (type === 'invoice.payment_succeeded' && invoice_id) {
      // Handle Stripe invoice payment
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_invoice_id', invoice_id)
        .single();

      if (orderError) {
        logger.warn('Order not found for Stripe invoice', { invoice_id });
        return res.status(404).json({ error: 'Order not found' });
      }

      // Mark order as paid
      const { error: updateError } = await supabase.rpc('mark_order_paid', {
        p_order_id: order.id,
      });

      if (updateError) {
        logger.error('Failed to mark order paid', { error: updateError, orderId: order.id });
        return res.status(500).json({ error: 'Failed to mark order paid' });
      }

      logger.info('Order marked as paid', { orderId: order.id, invoiceId: invoice_id });

      await sendPaymentConfirmationEmail(order);
    } else if (type === 'invoice.marked_uncollectible' && invoice_id) {
      // Handle Stripe invoice failure
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_invoice_id', invoice_id)
        .single();

      if (order) {
        logger.warn('Stripe invoice marked uncollectible', {
          orderId: order.id,
          invoiceId: invoice_id,
        });
        // TODO: Notify admin, send customer reminder email
      }
    }

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
});

export default router;

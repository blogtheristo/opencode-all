// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=OpenAI/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/routes/payment.routes.ts
/**
 * Payment API Routes
 * Proxies subscription requests to Python payment service (PayPal, Revolut)
 * Requires: PAYMENT_API_URL (e.g. http://payment-service:8000)
 */

import { randomUUID } from 'node:crypto';
import express, { type NextFunction, type Request, type Response, type Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import AuthService from '../services/auth.service.js';
import { requireProductOrderSchema } from '../middleware/product-order-readiness.middleware.js';
import { CatalogueProductError } from '../services/product-catalog.service.js';
import {
  attachProductOrderPayment,
  createProductOrderIntent,
  type PaymentProvider as ProductPaymentProvider,
  queuePendingExternalPaymentReview,
} from '../services/product-order.service.js';

const router: Router = express.Router();
const PAYMENT_API_URL = process.env.PAYMENT_API_URL?.replace(/\/$/, '') || '';
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

/**
 * Auth middleware: accepts our JWT or Supabase access_token (dashboard users)
 */
async function authenticatePayment(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Authorization required' });
  }

  // 1. Try our backend JWT
  const decoded = await AuthService.verifyAccessToken(token);
  if (decoded) {
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    return next();
  }

  // 2. Try Supabase JWT (dashboard session)
  if (SUPABASE_JWT_SECRET) {
    try {
      const supabaseDecoded = jwt.verify(token, SUPABASE_JWT_SECRET) as {
        sub?: string;
        email?: string;
      };
      if (supabaseDecoded?.sub) {
        req.userId = supabaseDecoded.sub;
        req.userEmail = supabaseDecoded.email ?? undefined;
        return next();
      }
    } catch {
      // Invalid Supabase token, fall through
    }
  }

  return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
}

type PlanTier = 'pro' | 'enterprise';
type PaymentProvider = 'revolut' | 'paypal';

interface SubscribeRequest {
  plan: PlanTier;
  payment_provider: PaymentProvider;
  return_url?: string;
  cancel_url?: string;
}

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many checkout requests. Please try again later.' },
});

interface CheckoutRequest {
  product_id: string;
  customer_email: string;
  customer_name: string;
  company?: string;
  country: string;
  payment_provider: ProductPaymentProvider;
}

async function createCheckoutUrl(
  provider: ProductPaymentProvider,
  intentId: string,
  product: { name: string; price: number; currency: string; revolutLink?: string },
  customerEmail: string,
): Promise<{ paymentUrl: string; paymentReference: string }> {
  if (provider === 'revolut') {
    const secret = process.env.REVOLUT_SECRET_KEY;
    if (secret) {
      const apiUrl = process.env.REVOLUT_API_URL || 'https://merchant.revolut.com/api';
      const response = await fetch(`${apiUrl}/orders`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secret}`,
          'Content-Type': 'application/json',
          'Revolut-Api-Version': '2024-09-01',
        },
        body: JSON.stringify({
          amount: Math.round(product.price * 100),
          currency: product.currency,
          description: product.name,
          merchant_order_ext_ref: intentId,
          customer_email: customerEmail,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        id?: string;
        token?: string;
        checkout_url?: string;
      };
      const paymentUrl =
        data.checkout_url ||
        (data.token ? `https://checkout.revolut.com/payment-link/${data.token}` : '');
      if (!response.ok || !data.id || !paymentUrl) {
        throw new Error(`Revolut checkout creation failed with status ${response.status}`);
      }
      return { paymentUrl, paymentReference: data.id };
    }

    if (product.revolutLink) {
      return { paymentUrl: product.revolutLink, paymentReference: intentId };
    }
    const fallback = process.env.REVOLUT_FALLBACK_LINK || 'https://revolut.me/lifetimeoy';
    return {
      paymentUrl: `${fallback.replace(/\/$/, '')}/${Math.round(product.price)}${product.currency}`,
      paymentReference: intentId,
    };
  }

  const merchantEmail = process.env.PAYPAL_MERCHANT_EMAIL || 'risto.anton@lifetime.fi';
  const params = new URLSearchParams({
    cmd: '_xclick',
    business: merchantEmail,
    item_name: product.name,
    amount: product.price.toFixed(2),
    currency_code: product.currency,
    custom: intentId,
  });
  return {
    paymentUrl: `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`,
    paymentReference: intentId,
  };
}

router.post(
  '/checkout',
  checkoutLimiter,
  requireProductOrderSchema,
  [
    body('product_id')
      .isString()
      .trim()
      .isLength({ min: 1, max: 100 })
      .matches(/^[A-Za-z0-9._-]+$/),
    body('customer_email').isEmail().isLength({ max: 254 }).normalizeEmail(),
    body('customer_name').isString().trim().isLength({ min: 1, max: 200 }),
    body('company').optional({ checkFalsy: true }).isString().trim().isLength({ max: 200 }),
    body('country').isString().trim().isLength({ min: 2, max: 2 }).isAlpha(),
    body('payment_provider').isIn(['revolut', 'paypal']),
    body('amount').optional().isFloat({ gt: 0 }),
    body('product_name').optional().isString().isLength({ max: 300 }),
    body('currency').optional().equals('EUR'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation Error', details: errors.array() });
    }

    const request = req.body as CheckoutRequest;
    const idempotencyKey = req.get('idempotency-key') || `checkout:${randomUUID()}`;
    if (
      idempotencyKey.length < 8 ||
      idempotencyKey.length > 128 ||
      !/^[A-Za-z0-9._:-]+$/.test(idempotencyKey)
    ) {
      return res.status(400).json({ error: 'Invalid Idempotency-Key header' });
    }

    try {
      const { intent, product } = await createProductOrderIntent({
        idempotencyKey,
        productId: request.product_id,
        buyerEmail: request.customer_email,
        buyerName: request.customer_name,
        buyerCompany: request.company,
        buyerCountry: request.country.toUpperCase(),
        paymentProvider: request.payment_provider,
        metadata: { source: 'dws10_checkout' },
      });

      if (!intent.created && intent.checkout_url && intent.checkout_reference) {
        const reviewedIntent = await queuePendingExternalPaymentReview(
          intent.id,
          intent.checkout_reference,
        );
        return res.json({
          order_intent_id: intent.id,
          payment_url: intent.checkout_url,
          product_id: intent.product_id,
          product_name: intent.product_name,
          amount: intent.unit_amount_cents / 100,
          currency: intent.currency,
          review_notification_status: reviewedIntent.payment_review_notification_status,
          idempotent_replay: true,
        });
      }

      const checkout = await createCheckoutUrl(
        request.payment_provider,
        intent.id,
        product,
        request.customer_email,
      );
      await attachProductOrderPayment(intent.id, checkout.paymentReference, checkout.paymentUrl);
      const reviewedIntent = await queuePendingExternalPaymentReview(
        intent.id,
        checkout.paymentReference,
      );

      return res.status(201).json({
        order_intent_id: intent.id,
        payment_url: checkout.paymentUrl,
        product_id: product.id,
        product_name: product.name,
        amount: product.price,
        currency: product.currency,
        review_notification_status: reviewedIntent.payment_review_notification_status,
        idempotent_replay: false,
      });
    } catch (error) {
      if (error instanceof CatalogueProductError) {
        return res
          .status(error.code === 'UNKNOWN_SKU' ? 404 : 409)
          .json({ error: error.code, message: error.message });
      }
      logger.error('Product checkout failed', { error, productId: request.product_id });
      return res.status(503).json({
        error: 'CHECKOUT_UNAVAILABLE',
        message: 'Checkout could not be created. No payment should be attempted.',
      });
    }
  },
);

/**
 * POST /api/v1/payments/subscribe
 * Create subscription and return payment redirect URL.
 * User is redirected to payment_url to complete payment.
 */
router.post(
  '/subscribe',
  authenticatePayment,
  [
    body('plan').isIn(['pro', 'enterprise']).withMessage('Plan must be pro or enterprise'),
    body('payment_provider')
      .isIn(['revolut', 'paypal'])
      .withMessage('Provider must be revolut or paypal'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation Error', details: errors.array() });
    }

    const { plan, payment_provider, return_url, cancel_url } = req.body as SubscribeRequest;
    const userEmail = req.userEmail;
    const userId = req.userId;

    if (!userEmail || !userId) {
      return res.status(401).json({ error: 'Unauthorized', message: 'User identity required' });
    }

    if (!PAYMENT_API_URL) {
      logger.warn('PAYMENT_API_URL not configured, subscription deferred to contact');
      return res.status(503).json({
        error: 'Payment service unavailable',
        message: 'Payment service is not configured. Please contact support to upgrade.',
      });
    }

    const payload: Record<string, unknown> = {
      user_email: userEmail,
      user_id: userId,
      plan,
      payment_provider,
      ...(return_url ? { return_url } : {}),
      ...(cancel_url ? { cancel_url } : {}),
    };

    try {
      const response = await fetch(`${PAYMENT_API_URL}/v1/payments/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        logger.error('Payment service error', {
          status: response.status,
          data,
          userId,
        });
        return res.status(response.status >= 500 ? 502 : response.status).json({
          error: data?.detail || 'Payment service error',
        });
      }

      const paymentUrl = data?.payment_url;
      if (!paymentUrl) {
        logger.error('Payment service returned no payment_url', { data });
        return res.status(502).json({ error: 'Invalid response from payment service' });
      }

      return res.json({
        payment_url: paymentUrl,
        provider: data?.provider || payment_provider,
        plan: data?.plan || plan,
      });
    } catch (err) {
      logger.error('Payment proxy error', { err, userId });
      return res.status(502).json({
        error: 'Payment service unavailable',
        message: 'Could not reach payment service. Please try again later.',
      });
    }
  },
);

function getRawBodyBuffer(body: unknown): Buffer {
  if (Buffer.isBuffer(body)) {
    return body;
  }

  if (typeof body === 'string') {
    return Buffer.from(body, 'utf8');
  }

  return Buffer.from(JSON.stringify(body ?? {}), 'utf8');
}

function decodeSignature(signature: string, expectedLength: number): Buffer | null {
  const trimmedSignature = signature.trim();
  if (!trimmedSignature) {
    return null;
  }

  if (/^[\da-fA-F]+$/.test(trimmedSignature) && trimmedSignature.length % 2 === 0) {
    const decodedHex = Buffer.from(trimmedSignature, 'hex');
    if (decodedHex.length === expectedLength) {
      return decodedHex;
    }
  }

  try {
    const decodedBase64 = Buffer.from(trimmedSignature, 'base64');
    if (decodedBase64.length === expectedLength) {
      return decodedBase64;
    }
  } catch {
    return null;
  }

  return null;
}

async function verifyHmacWebhookSignature(
  signature: string,
  rawBody: Buffer,
  webhookSecret: string,
): Promise<boolean> {
  const crypto = await import('crypto');
  const expectedDigest = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest();
  const providedDigest = decodeSignature(signature, expectedDigest.length);

  if (!providedDigest || providedDigest.length !== expectedDigest.length) {
    return false;
  }

  return crypto.timingSafeEqual(providedDigest, expectedDigest);
}

async function getPayPalAccessToken(): Promise<string | null> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const apiBaseUrl = process.env.PAYPAL_API_BASE_URL || 'https://api-m.paypal.com';

  if (!clientId || !clientSecret) {
    return null;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`, 'utf8').toString('base64');
  const response = await fetch(`${apiBaseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => '');
    logger.warn('PayPal OAuth token request failed', {
      status: response.status,
      body: responseText,
    });
    return null;
  }

  const tokenResponse = (await response.json()) as { access_token?: string };
  return tokenResponse.access_token || null;
}

async function verifyPayPalWebhookSignature(req: Request, rawBody: Buffer): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  const apiBaseUrl = process.env.PAYPAL_API_BASE_URL || 'https://api-m.paypal.com';
  const transmissionId = req.headers['paypal-transmission-id'];
  const transmissionTime = req.headers['paypal-transmission-time'];
  const transmissionSig = req.headers['paypal-transmission-sig'];
  const certUrl = req.headers['paypal-cert-url'];
  const authAlgo = req.headers['paypal-auth-algo'];

  if (
    !webhookId ||
    typeof transmissionId !== 'string' ||
    typeof transmissionTime !== 'string' ||
    typeof transmissionSig !== 'string' ||
    typeof certUrl !== 'string' ||
    typeof authAlgo !== 'string'
  ) {
    return false;
  }

  const accessToken = await getPayPalAccessToken();
  if (!accessToken) {
    return false;
  }

  let webhookEvent: unknown;
  try {
    webhookEvent = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return false;
  }

  const response = await fetch(`${apiBaseUrl}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent,
    }),
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => '');
    logger.warn('PayPal webhook verification request failed', {
      status: response.status,
      body: responseText,
    });
    return false;
  }

  const verificationResponse = (await response.json()) as { verification_status?: string };
  return verificationResponse.verification_status === 'SUCCESS';
}

/**
 * POST /api/v1/payments/webhook
 * Payment webhook receiver (PayPal/Revolut).
 * Verifies webhook signature before processing.
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response) => {
    const rawBody = getRawBodyBuffer(req.body);
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;
    const customSignatureHeader = req.headers['x-webhook-signature'];
    const paypalSignatureHeader = req.headers['paypal-transmission-sig'];

    try {
      if (typeof customSignatureHeader === 'string') {
        if (!webhookSecret) {
          logger.warn(
            'PAYMENT_WEBHOOK_SECRET not configured for x-webhook-signature verification',
            {
              ip: req.ip,
            },
          );
          return res.status(401).json({ error: 'Invalid webhook signature' });
        }

        const isValidCustomSignature = await verifyHmacWebhookSignature(
          customSignatureHeader,
          rawBody,
          webhookSecret,
        );

        if (!isValidCustomSignature) {
          logger.warn('Payment webhook signature mismatch', {
            ip: req.ip,
          });
          return res.status(401).json({ error: 'Invalid webhook signature' });
        }
      } else if (typeof paypalSignatureHeader === 'string') {
        const isValidPayPalSignature = await verifyPayPalWebhookSignature(req, rawBody);

        if (!isValidPayPalSignature) {
          logger.warn('PayPal webhook signature mismatch', {
            ip: req.ip,
          });
          return res.status(401).json({ error: 'Invalid webhook signature' });
        }
      } else {
        logger.warn('Payment webhook received without a supported signature header', {
          ip: req.ip,
        });
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }

      const event = JSON.parse(rawBody.toString('utf8')) as Record<string, unknown>;
      const eventType = (event?.type as string) || (event?.event_type as string) || 'unknown';

      logger.info('Payment webhook received', {
        type: eventType,
        id: event?.id,
      });

      // Forward to payment service for processing
      if (PAYMENT_API_URL) {
        await fetch(`${PAYMENT_API_URL}/v1/payments/webhook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        }).catch((err: Error) => {
          logger.error('Payment webhook forwarding failed', { error: err.message });
        });
      }

      return res.json({ received: true, type: eventType });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Payment webhook processing error', { error: msg });
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }
  },
);

/**
 * GET /api/v1/payments/health
 * Check if payment service is configured and reachable.
 */
router.get('/health', async (_req: Request, res: Response) => {
  if (!PAYMENT_API_URL) {
    return res.json({
      configured: false,
      message: 'PAYMENT_API_URL not set',
    });
  }

  try {
    const response = await fetch(`${PAYMENT_API_URL}/v1/payments/health`);
    const data = await response.json().catch(() => ({}));
    return res.json({
      configured: true,
      reachable: response.ok,
      ...data,
    });
  } catch {
    return res.json({
      configured: true,
      reachable: false,
      message: 'Payment service not reachable',
    });
  }
});

export default router;

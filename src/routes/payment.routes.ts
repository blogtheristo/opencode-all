/**
 * Payment API Routes
 * Proxies subscription requests to Python payment service (PayPal, Revolut)
 * Requires: PAYMENT_API_URL (e.g. http://payment-service:8000)
 */

import express, { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import AuthService from '../services/auth.service.js';

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
      const supabaseDecoded = jwt.verify(token, SUPABASE_JWT_SECRET) as { sub?: string; email?: string };
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
    body('payment_provider').isIn(['revolut', 'paypal']).withMessage('Provider must be revolut or paypal'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation Error', details: errors.array() });
    }

    const { plan, payment_provider } = req.body as { plan: PlanTier; payment_provider: PaymentProvider };
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

    const payload = {
      user_email: userEmail,
      user_id: userId,
      plan,
      payment_provider,
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
  }
);

/**
 * POST /api/v1/payments/webhook
 * Payment webhook receiver (PayPal/Revolut).
 * Verifies webhook signature before processing.
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const signature = req.headers['x-webhook-signature'] as string
    || req.headers['paypal-transmission-sig'] as string
    || '';
  const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET;

  // Verify webhook signature when secret is configured
  if (webhookSecret) {
    const crypto = await import('crypto');
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const expected = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature.padEnd(256, '\0'));
    const expectedBuffer = Buffer.from(expected.padEnd(256, '\0'));
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      logger.warn('Payment webhook signature mismatch', {
        ip: req.ip,
      });
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }
  } else {
    logger.warn('PAYMENT_WEBHOOK_SECRET not configured — webhook signature not verified');
  }

  try {
    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventType = event?.type || event?.event_type || 'unknown';

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
});

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

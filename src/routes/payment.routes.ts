/**
 * Payment API Routes
 * Proxies subscription requests to Python payment service (PayPal, Revolut)
 * Requires: PAYMENT_API_URL (e.g. http://payment-service:8000)
 */

import express, { type NextFunction, type Request, type Response, type Router } from 'express';
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

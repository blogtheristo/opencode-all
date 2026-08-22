import { type NextFunction, type Request, type Response } from 'express';
import crypto from 'crypto';
import type Stripe from 'stripe';
import logger from '../utils/logger.js';

/**
 * Stripe webhook signature verification middleware
 * Verifies that incoming webhooks are genuinely from Stripe
 *
 * Implementation: HMAC-SHA256
 * Reference: https://stripe.com/docs/webhooks/signatures
 */

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

type VerifiedRequest = Request;

/**
 * Verify Stripe webhook signature
 * Must be applied BEFORE express.json() middleware on webhook routes
 */
export function verifyStripeWebhook(req: VerifiedRequest, res: Response, next: NextFunction) {
  if (!STRIPE_WEBHOOK_SECRET) {
    logger.error('STRIPE_WEBHOOK_SECRET not configured');
    return res.status(500).json({ error: 'Webhook not configured' });
  }

  const signature = req.headers['stripe-signature'] as string;
  if (!signature) {
    logger.warn('Missing stripe-signature header');
    return res.status(400).json({ error: 'Missing signature' });
  }

  try {
    // Get raw body (must be preserved before JSON parsing)
    const rawBody = req.rawBody || Buffer.from('');

    // Extract timestamp and signatures from header
    // Format: t=<timestamp>,v1=<signature>,v0=<signature>
    const parts = signature.split(',').reduce((acc: Record<string, string>, part: string) => {
      const [key, value] = part.split('=');
      acc[key] = value;
      return acc;
    }, {});

    const timestamp = parts.t;
    const signatures = [parts.v1]; // v1 is current (v0 is legacy)

    if (!timestamp) {
      logger.warn('Missing timestamp in stripe-signature');
      return res.status(400).json({ error: 'Invalid signature format' });
    }

    // Prevent replay attacks: check timestamp is within 5 minutes
    const now = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp, 10);
    const timeDiff = now - webhookTime;

    if (timeDiff > 300) {
      logger.warn('Webhook timestamp too old', { timeDiff });
      return res.status(400).json({ error: 'Request too old' });
    }

    if (timeDiff < -300) {
      logger.warn('Webhook timestamp in future', { timeDiff });
      return res.status(400).json({ error: 'Request timestamp invalid' });
    }

    // Create signed content: timestamp.body
    const signedContent = `${timestamp}.${rawBody.toString('utf-8')}`;

    // Compute HMAC-SHA256
    const expected = crypto
      .createHmac('sha256', STRIPE_WEBHOOK_SECRET)
      .update(signedContent)
      .digest('hex');

    // Timing-safe comparison to prevent timing attacks
    let isValid = false;
    for (const sig of signatures) {
      if (sig && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
        isValid = true;
        break;
      }
    }

    if (!isValid) {
      logger.warn('Invalid stripe-signature', { expected, received: signatures[0] });
      return res.status(403).json({ error: 'Invalid signature' });
    }

    // Parse JSON and attach to request
    req.stripeEvent = JSON.parse(rawBody.toString('utf-8')) as Stripe.Event;

    logger.info('Stripe webhook verified', {
      event_type: req.stripeEvent.type,
      event_id: req.stripeEvent.id,
    });

    return next();
  } catch (error) {
    logger.error('Webhook verification error', { error });
    return res.status(400).json({ error: 'Invalid webhook' });
  }
}

/**
 * Stripe idempotency tracking middleware
 * Prevents duplicate processing if webhook is retried
 *
 * Uses in-memory Map (for single-instance) or Redis (for distributed)
 */

const processedWebhooks = new Map<string, { timestamp: number; result: unknown }>();
const IDEMPOTENCY_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function idempotencyCheck(req: VerifiedRequest, res: Response, next: NextFunction) {
  const eventId = req.stripeEvent?.id;

  if (!eventId) {
    return next();
  }

  const cached = processedWebhooks.get(eventId);

  if (cached) {
    const age = Date.now() - cached.timestamp;
    if (age < IDEMPOTENCY_TTL) {
      logger.info('Webhook already processed (idempotency)', { event_id: eventId });
      return res.status(200).json(cached.result);
    } else {
      // Remove expired entry
      processedWebhooks.delete(eventId);
    }
  }

  // Store this request for potential retry
  req.storeWebhookResult = (result: unknown) => {
    processedWebhooks.set(eventId, {
      timestamp: Date.now(),
      result,
    });

    // Cleanup old entries periodically
    if (processedWebhooks.size > 10000) {
      const now = Date.now();
      for (const [key, value] of processedWebhooks.entries()) {
        if (now - value.timestamp > IDEMPOTENCY_TTL) {
          processedWebhooks.delete(key);
        }
      }
    }
  };

  next();
}

/**
 * Stripe event rate limiting
 * Prevent abuse: max 100 events per second per endpoint
 */

const eventRates = new Map<string, number[]>();

export function stripeRateLimit(req: VerifiedRequest, res: Response, next: NextFunction) {
  const eventType = req.stripeEvent?.type || 'unknown';
  const now = Date.now();
  const windowStart = now - 1000;

  let times = eventRates.get(eventType) || [];
  times = times.filter((t) => t > windowStart);

  if (times.length >= 100) {
    logger.warn('Stripe webhook rate limit exceeded', { event_type: eventType });
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }

  times.push(now);
  eventRates.set(eventType, times);

  return next();
}

/**
 * Raw body preservation middleware
 * Must be used BEFORE express.json() to preserve raw request body for signature verification
 */

export function preserveRawBody(req: VerifiedRequest, _res: Response, next: NextFunction) {
  let data = '';

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    req.rawBody = Buffer.from(data);
    next();
  });
}

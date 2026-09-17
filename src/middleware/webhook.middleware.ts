/**
 * DWS IQ 6 - Webhook Verification & Routing Middleware
 *
 * Verifies inbound webhook signatures from external services
 * (Stripe, PayPal, Revolut, GitHub, Supabase) and routes them
 * to the appropriate handler. Each source uses its own signature
 * header and HMAC verification scheme.
 *
 * Usage:
 *   app.post('/webhooks/stripe', webhookHandler('stripe'), stripeController);
 *   app.post('/webhooks/github', webhookHandler('github'), githubController);
 *
 * Environment variables (per source):
 *   WEBHOOK_SECRET_STRIPE, WEBHOOK_SECRET_PAYPAL, WEBHOOK_SECRET_REVOLUT,
 *   WEBHOOK_SECRET_GITHUB, WEBHOOK_SECRET_SUPABASE
 */

import { type NextFunction, type Request, type Response } from 'express';
import crypto from 'crypto';
import logger from '../utils/logger.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Supported webhook sources. */
export type WebhookSource = 'stripe' | 'paypal' | 'revolut' | 'github' | 'supabase';

/** Per-source configuration: which header carries the signature and how to verify it. */
interface WebhookSourceConfig {
  /** HTTP header (lowercased) that contains the signature. */
  signatureHeader: string;
  /** Extract the hex digest from the raw header value. */
  extractSignature: (headerValue: string) => string | null;
  /** Build the string that was signed on the sending side. */
  buildSignedPayload: (req: Request) => Buffer;
  /** HMAC algorithm used by this source. */
  algorithm: string;
}

/** Logged event shape (kept lean for console/Supabase). */
export interface WebhookEvent {
  source: WebhookSource;
  eventType: string | null;
  deliveryId: string | null;
  receivedAt: string;
  verified: boolean;
  ip: string | undefined;
}

// ---------------------------------------------------------------------------
// Source Configurations
// ---------------------------------------------------------------------------

const SOURCE_CONFIGS: Record<WebhookSource, WebhookSourceConfig> = {
  /**
   * Stripe signs with `Stripe-Signature` header.
   * Format: t=<timestamp>,v1=<signature>[,v0=<legacy>]
   * Signed payload: "<timestamp>.<rawBody>"
   */
  stripe: {
    signatureHeader: 'stripe-signature',
    algorithm: 'sha256',
    extractSignature(headerValue: string): string | null {
      const match = headerValue.match(/v1=([a-f0-9]+)/);
      return match ? match[1] : null;
    },
    buildSignedPayload(req: Request): Buffer {
      const header = req.headers['stripe-signature'] as string;
      const tsMatch = header.match(/t=(\d+)/);
      const timestamp = tsMatch ? tsMatch[1] : '';
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      return Buffer.from(`${timestamp}.${body}`);
    },
  },

  /**
   * PayPal uses `Paypal-Transmission-Sig` (SHA256 HMAC of the raw body).
   * Simplified verification for webhook secret-based HMAC.
   */
  paypal: {
    signatureHeader: 'paypal-transmission-sig',
    algorithm: 'sha256',
    extractSignature(headerValue: string): string | null {
      return headerValue || null;
    },
    buildSignedPayload(req: Request): Buffer {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      return Buffer.from(body);
    },
  },

  /**
   * Revolut uses `Revolut-Signature` header.
   * Format: v1=<hex_signature>
   */
  revolut: {
    signatureHeader: 'revolut-signature',
    algorithm: 'sha256',
    extractSignature(headerValue: string): string | null {
      const match = headerValue.match(/v1=([a-f0-9]+)/);
      return match ? match[1] : null;
    },
    buildSignedPayload(req: Request): Buffer {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      return Buffer.from(body);
    },
  },

  /**
   * GitHub uses `X-Hub-Signature-256` header.
   * Format: sha256=<hex_signature>
   * Signed payload: raw request body.
   */
  github: {
    signatureHeader: 'x-hub-signature-256',
    algorithm: 'sha256',
    extractSignature(headerValue: string): string | null {
      const match = headerValue.match(/sha256=([a-f0-9]+)/);
      return match ? match[1] : null;
    },
    buildSignedPayload(req: Request): Buffer {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      return Buffer.from(body);
    },
  },

  /**
   * Supabase webhook signature header (custom).
   * Supabase Database Webhooks send an `x-supabase-signature` header.
   * Signed payload: raw body.
   */
  supabase: {
    signatureHeader: 'x-supabase-signature',
    algorithm: 'sha256',
    extractSignature(headerValue: string): string | null {
      return headerValue || null;
    },
    buildSignedPayload(req: Request): Buffer {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      return Buffer.from(body);
    },
  },
};

// ---------------------------------------------------------------------------
// Webhook Middleware Class
// ---------------------------------------------------------------------------

export class WebhookMiddleware {
  /**
   * Verify an HMAC-SHA256 (or other algo) signature against a shared secret.
   *
   * Uses timing-safe comparison to prevent timing attacks.
   *
   * @param req      - Express request whose body will be verified
   * @param secret   - Shared secret for this webhook source
   * @param source   - Webhook source identifier
   * @returns true when the signature is valid
   */
  static verifySignature(req: Request, secret: string, source: WebhookSource): boolean {
    const config = SOURCE_CONFIGS[source];
    if (!config) {
      logger.error('Unknown webhook source', { source });
      return false;
    }

    const rawHeader = req.headers[config.signatureHeader] as string | undefined;
    if (!rawHeader) {
      logger.warn('Missing webhook signature header', {
        source,
        expectedHeader: config.signatureHeader,
      });
      return false;
    }

    const providedSignature = config.extractSignature(rawHeader);
    if (!providedSignature) {
      logger.warn('Could not extract signature from header', { source, header: rawHeader });
      return false;
    }

    const payload = config.buildSignedPayload(req);
    const expectedSignature = crypto
      .createHmac(config.algorithm, secret)
      .update(payload)
      .digest('hex');

    // Timing-safe comparison (both values must be the same length)
    const providedBuf = Buffer.from(providedSignature, 'hex');
    const expectedBuf = Buffer.from(expectedSignature, 'hex');

    if (providedBuf.length !== expectedBuf.length) {
      return false;
    }

    return crypto.timingSafeEqual(providedBuf, expectedBuf);
  }

  /**
   * Build a log-friendly event object from the incoming request.
   */
  static buildEvent(req: Request, source: WebhookSource, verified: boolean): WebhookEvent {
    // Try to pull a recognisable event type from common patterns
    const eventType: string | null =
      (req.body?.type as string) ??       // Stripe, Revolut
      (req.body?.event_type as string) ??  // PayPal
      (req.headers['x-github-event'] as string) ?? // GitHub
      null;

    const deliveryId: string | null =
      (req.headers['x-github-delivery'] as string) ??
      (req.headers['paypal-transmission-id'] as string) ??
      (req.body?.id as string) ??
      null;

    return {
      source,
      eventType,
      deliveryId,
      receivedAt: new Date().toISOString(),
      verified,
      ip: req.ip,
    };
  }

  /**
   * Log a webhook event via the project logger.
   * In a future iteration this could also write to Supabase.
   */
  static logEvent(event: WebhookEvent): void {
    const level = event.verified ? 'info' : 'warn';
    logger[level]('Webhook received', { ...event });
  }
}

// ---------------------------------------------------------------------------
// Express Middleware Factory
// ---------------------------------------------------------------------------

/**
 * Returns an Express middleware that verifies the webhook signature for the
 * given source, logs the event, and either continues the chain or responds
 * with a 401/500.
 *
 * The shared secret is read from the environment variable
 * `WEBHOOK_SECRET_<SOURCE>` (uppercased).
 *
 * @param source - one of the supported WebhookSource values
 *
 * @example
 *   import { webhookHandler } from '../middleware/webhook.middleware.js';
 *   router.post('/webhooks/stripe', webhookHandler('stripe'), handleStripe);
 */
export function webhookHandler(source: WebhookSource) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const envKey = `WEBHOOK_SECRET_${source.toUpperCase()}`;
    const secret = process.env[envKey];

    if (!secret) {
      logger.error('Webhook secret not configured', { source, envKey });
      res.status(500).json({
        error: 'Webhook configuration error',
        message: `Webhook secret for "${source}" is not configured`,
      });
      return;
    }

    const verified = WebhookMiddleware.verifySignature(req, secret, source);
    const event = WebhookMiddleware.buildEvent(req, source, verified);
    WebhookMiddleware.logEvent(event);

    if (!verified) {
      logger.warn('Webhook signature verification failed', { source, ip: req.ip });
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid webhook signature',
      });
      return;
    }

    // Attach event metadata to the request for downstream handlers
    req.webhookEvent = event;
    next();
  };
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default {
  WebhookMiddleware,
  webhookHandler,
};

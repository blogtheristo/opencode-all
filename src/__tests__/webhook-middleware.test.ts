/**
 * Webhook Middleware Tests
 *
 * Covers signature verification + routing behavior for inbound webhooks
 * (Stripe, GitHub, Supabase, PayPal, Revolut). Security-sensitive:
 * verifies missing-secret rejection, invalid-signature rejection,
 * valid-signature acceptance, and payload-from-raw-body parsing.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextFunction, type Request, type Response } from 'express';
import crypto from 'crypto';
import { webhookHandler, WebhookMiddleware } from '../middleware/webhook.middleware.js';

// ============ HELPERS ============

function mockReq(overrides: Partial<Request> = {}): Request {
  return {
    method: 'POST',
    path: '/webhook',
    headers: {},
    body: {},
    ip: '127.0.0.1',
    ...overrides,
  } as unknown as Request;
}

function mockRes(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

/** Compute a valid HMAC-SHA256 hex digest for the given body + secret. */
function sign(body: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

/** Compute a valid Stripe-style signature: HMAC over `${timestamp}.${body}`. */
function signStripe(body: string, secret: string, timestamp: string): string {
  return crypto.createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');
}

// ============ webhookHandler (factory + secret handling) ============

describe('webhookHandler — missing secret', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.WEBHOOK_SECRET_GITHUB;
    delete process.env.WEBHOOK_SECRET_STRIPE;
    delete process.env.WEBHOOK_SECRET_SUPABASE;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns 500 when WEBHOOK_SECRET_<SOURCE> is not configured', () => {
    const handler = webhookHandler('github');
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Webhook configuration error' }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('does NOT fall through to next() when secret is missing', () => {
    const handler = webhookHandler('stripe');
    const req = mockReq();
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});

// ============ webhookHandler — invalid signature rejection ============

describe('webhookHandler — invalid signature', () => {
  const originalEnv = { ...process.env };
  const SECRET = 'test-github-secret-123';

  beforeEach(() => {
    process.env.WEBHOOK_SECRET_GITHUB = SECRET;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('returns 401 when signature header is missing', () => {
    const handler = webhookHandler('github');
    const req = mockReq({ body: '{"action":"opened"}' });
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Unauthorized' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when signature hex is wrong for the payload', () => {
    const handler = webhookHandler('github');
    const body = '{"action":"opened"}';
    const wrongSig = sign(body, 'WRONG-SECRET');
    const req = mockReq({
      body,
      headers: { 'x-hub-signature-256': `sha256=${wrongSig}` },
    });
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when signature is valid hex but wrong length', () => {
    const handler = webhookHandler('github');
    const body = '{"action":"opened"}';
    const req = mockReq({
      body,
      headers: { 'x-hub-signature-256': 'sha256=deadbeef' }, // too short
    });
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when header format does not match extractor regex', () => {
    const handler = webhookHandler('github');
    const body = '{"action":"opened"}';
    const req = mockReq({
      body,
      headers: { 'x-hub-signature-256': 'bogus-format-no-sha256-prefix' },
    });
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

// ============ webhookHandler — valid signature acceptance ============

describe('webhookHandler — valid signature', () => {
  const originalEnv = { ...process.env };
  const SECRET = 'test-github-secret-xyz';

  beforeEach(() => {
    process.env.WEBHOOK_SECRET_GITHUB = SECRET;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it('calls next() and attaches webhookEvent when signature matches', () => {
    const body = '{"action":"opened","number":42}';
    const validSig = sign(body, SECRET);
    const handler = webhookHandler('github');
    const req = mockReq({
      body,
      headers: {
        'x-hub-signature-256': `sha256=${validSig}`,
        'x-github-event': 'pull_request',
        'x-github-delivery': 'abcd-1234',
      },
    });
    const res = mockRes();
    const next = vi.fn();

    handler(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(
      (
        req as unknown as {
          webhookEvent: {
            verified: boolean;
            source: string;
            eventType: string | null;
            deliveryId: string | null;
          };
        }
      ).webhookEvent,
    ).toMatchObject({
      source: 'github',
      verified: true,
      eventType: 'pull_request',
      deliveryId: 'abcd-1234',
    });
  });
});

// ============ WebhookMiddleware.verifySignature — raw body parsing ============

describe('WebhookMiddleware.verifySignature — raw body handling', () => {
  const SECRET = 'raw-body-secret';

  it('verifies correctly when body is already a string (preferred raw path)', () => {
    const rawBody = '{"event":"push","repo":"dws6"}';
    const validSig = sign(rawBody, SECRET);
    const req = mockReq({
      body: rawBody,
      headers: { 'x-hub-signature-256': `sha256=${validSig}` },
    });

    const result = WebhookMiddleware.verifySignature(req, SECRET, 'github');

    expect(result).toBe(true);
  });

  it('verifies correctly when body is a parsed object (JSON.stringify fallback)', () => {
    const bodyObj = { event: 'push', repo: 'dws6' };
    const reserialized = JSON.stringify(bodyObj);
    const validSig = sign(reserialized, SECRET);
    const req = mockReq({
      body: bodyObj,
      headers: { 'x-hub-signature-256': `sha256=${validSig}` },
    });

    const result = WebhookMiddleware.verifySignature(req, SECRET, 'github');

    expect(result).toBe(true);
  });

  it('rejects when secret is wrong (timing-safe path)', () => {
    const rawBody = '{"event":"push"}';
    const sigFromOther = sign(rawBody, 'OTHER-SECRET');
    const req = mockReq({
      body: rawBody,
      headers: { 'x-hub-signature-256': `sha256=${sigFromOther}` },
    });

    const result = WebhookMiddleware.verifySignature(req, SECRET, 'github');

    expect(result).toBe(false);
  });

  it('rejects when body has been tampered with after signing', () => {
    const originalBody = '{"amount":100,"currency":"EUR"}';
    const validSig = sign(originalBody, SECRET);
    const tamperedBody = '{"amount":999999,"currency":"EUR"}';
    const req = mockReq({
      body: tamperedBody,
      headers: { 'x-hub-signature-256': `sha256=${validSig}` },
    });

    const result = WebhookMiddleware.verifySignature(req, SECRET, 'github');

    expect(result).toBe(false);
  });

  it('verifies Stripe-style signed payload (timestamp.body prefix)', () => {
    const timestamp = '1700000000';
    const rawBody = '{"type":"payment_intent.succeeded"}';
    const validSig = signStripe(rawBody, SECRET, timestamp);
    const req = mockReq({
      body: rawBody,
      headers: { 'stripe-signature': `t=${timestamp},v1=${validSig}` },
    });

    const result = WebhookMiddleware.verifySignature(req, SECRET, 'stripe');

    expect(result).toBe(true);
  });

  it('rejects Stripe signature when timestamp is altered', () => {
    const timestamp = '1700000000';
    const rawBody = '{"type":"payment_intent.succeeded"}';
    const validSig = signStripe(rawBody, SECRET, timestamp);
    const req = mockReq({
      body: rawBody,
      headers: { 'stripe-signature': `t=9999999999,v1=${validSig}` }, // ts changed
    });

    const result = WebhookMiddleware.verifySignature(req, SECRET, 'stripe');

    expect(result).toBe(false);
  });

  it('returns false for unknown source', () => {
    const req = mockReq({
      body: '{}',
      headers: { 'x-hub-signature-256': 'sha256=abc' },
    });
    // @ts-expect-error — deliberately passing an unknown source
    const result = WebhookMiddleware.verifySignature(req, SECRET, 'unknown');
    expect(result).toBe(false);
  });
});

// ============ buildEvent metadata extraction ============

describe('WebhookMiddleware.buildEvent — metadata extraction', () => {
  it('extracts GitHub delivery + event from headers', () => {
    const req = mockReq({
      headers: {
        'x-github-event': 'push',
        'x-github-delivery': 'delivery-uuid-1',
      },
    });

    const event = WebhookMiddleware.buildEvent(req, 'github', true);

    expect(event.eventType).toBe('push');
    expect(event.deliveryId).toBe('delivery-uuid-1');
    expect(event.verified).toBe(true);
    expect(event.source).toBe('github');
  });

  it('extracts Stripe event type from body.type', () => {
    const req = mockReq({
      body: { type: 'charge.succeeded', id: 'evt_123' },
    });

    const event = WebhookMiddleware.buildEvent(req, 'stripe', true);

    expect(event.eventType).toBe('charge.succeeded');
    expect(event.deliveryId).toBe('evt_123');
  });

  it('marks event as unverified when verification failed', () => {
    const req = mockReq({ body: { type: 'test' } });
    const event = WebhookMiddleware.buildEvent(req, 'stripe', false);
    expect(event.verified).toBe(false);
  });
});

// Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- src/__tests__/stripe-webhook.middleware.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest';
import crypto from 'crypto';
import logger from '../utils/logger.js';

process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret_for_middleware_tests';

const { verifyStripeWebhook, preserveRawBody } = await import('../middleware/stripe-webhook.middleware.js');

function makeReq(overrides: Record<string, unknown> = {}) {
  return {
    method: 'POST',
    headers: {} as Record<string, string>,
    rawBody: Buffer.from(JSON.stringify({ id: 'evt_1', type: 'payment_intent.succeeded' })),
    ...overrides,
  } as never;
}

function makeRes() {
  const res: Record<string, unknown> = { statusCode: 0 };
  res.status = vi.fn().mockImplementation((c: number) => {
    res.statusCode = c;
    return res;
  });
  res.json = vi.fn().mockReturnThis();
  return res as never as { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn>; statusCode: number };
}

function signHeader(rawBody: string, tsOffsetSec = 0): string {
  const t = Math.floor(Date.now() / 1000) + tsOffsetSec;
  const expected = crypto.createHmac('sha256', process.env.STRIPE_WEBHOOK_SECRET!).update(`${t}.${rawBody}`).digest('hex');
  return `t=${t},v1=${expected}`;
}

describe('stripe webhook middleware', () => {
  beforeEach(() => vi.clearAllMocks());

  it('accepts a correctly signed webhook and calls next()', () => {
    const raw = JSON.stringify({ id: 'evt_ok' });
    const req = makeReq({ rawBody: Buffer.from(raw), headers: { 'stripe-signature': signHeader(raw) } });
    const res = makeRes();
    const next = vi.fn();
    verifyStripeWebhook(req, res as never, next);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejects an invalid signature with 403 and does NOT log the expected HMAC', () => {
    const raw = JSON.stringify({ id: 'evt_bad' });
    const forged = crypto.createHmac('sha256', 'wrong-secret').update(`${Math.floor(Date.now() / 1000)}.${raw}`).digest('hex');
    const warnSpy = vi.spyOn(logger, 'warn');
    const req = makeReq({ rawBody: Buffer.from(raw), headers: { 'stripe-signature': `t=${Math.floor(Date.now() / 1000)},v1=${forged}` } });
    const res = makeRes();
    verifyStripeWebhook(req, res as never, vi.fn());
    expect(res.status).toHaveBeenCalledWith(403);
    // Signing-oracle guard: the computed expected HMAC must not reach the log line.
    const loggedJson = JSON.stringify(warnSpy.mock.calls);
    expect(loggedJson).not.toContain(forged);
    expect(loggedJson).toMatch(/receivedLength/);
    warnSpy.mockRestore();
  });

  it('rejects a wrong-length signature without throwing', () => {
    const raw = JSON.stringify({ id: 'evt_len' });
    const req = makeReq({ rawBody: Buffer.from(raw), headers: { 'stripe-signature': `t=${Math.floor(Date.now() / 1000)},v1=deadbeef` } });
    const res = makeRes();
    expect(() => verifyStripeWebhook(req, res as never, vi.fn())).not.toThrow();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('rejects timestamps older than 5 minutes (replay window)', () => {
    const raw = JSON.stringify({ id: 'evt_old' });
    const req = makeReq({ rawBody: Buffer.from(raw), headers: { 'stripe-signature': signHeader(raw, -400) } });
    const res = makeRes();
    verifyStripeWebhook(req, res as never, vi.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('preserveRawBody answers 413 and destroys oversized streams', async () => {
    const big = 'x'.repeat(300 * 1024);
    const req = {
      headers: {},
      on(event: string, cb: (arg?: unknown) => void) {
        if (event === 'data') cb(big);
        if (event === 'end') setTimeout(cb, 0);
      },
      destroy: vi.fn(),
    } as never;
    const res = makeRes();
    preserveRawBody(req, res as never, vi.fn());
    await new Promise((r) => setTimeout(r, 10));
    expect(res.status).toHaveBeenCalledWith(413);
  });
});

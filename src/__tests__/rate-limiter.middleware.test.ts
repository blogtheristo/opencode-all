// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-c-coverage Date=2026-09-27
// Audit trail: git log -- src/__tests__/rate-limiter.middleware.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRateLimiter, RateLimiterMiddleware } from '../middleware/rate-limiter.middleware.js';

function response() {
  const res: Record<string, unknown> = {};
  res.setHeader = vi.fn();
  res.status = vi.fn(() => res);
  res.json = vi.fn(() => res);
  return res;
}

describe('rate limiter middleware', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('isolates keys, reports remaining requests, and expires the boundary timestamp', () => {
    vi.setSystemTime(1_000);
    const limiter = new RateLimiterMiddleware({ maxRequests: 2, windowMs: 1_000 });

    expect(limiter.check('a')).toMatchObject({ allowed: true, remaining: 1 });
    expect(limiter.check('a')).toMatchObject({ allowed: true, remaining: 0 });
    expect(limiter.check('a')).toMatchObject({ allowed: false, remaining: 0 });
    expect(limiter.check('b')).toMatchObject({ allowed: true, remaining: 1 });

    vi.setSystemTime(2_000);
    expect(limiter.check('a')).toMatchObject({ allowed: true, remaining: 1 });
    limiter.destroy();
  });

  it('sets standard headers and returns 429 with Retry-After', () => {
    vi.setSystemTime(5_000);
    const middleware = createRateLimiter({
      maxRequests: 1,
      windowMs: 10_000,
      keyGenerator: () => 'client',
    });
    const firstRes = response();
    const blockedRes = response();

    middleware({} as never, firstRes as never, vi.fn());
    middleware({} as never, blockedRes as never, vi.fn());

    expect(firstRes.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', 0);
    expect(blockedRes.setHeader).toHaveBeenCalledWith('Retry-After', 10);
    expect(blockedRes.status).toHaveBeenCalledWith(429);
    expect(blockedRes.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Too Many Requests', retryAfter: 10 }),
    );
  });

  it('bypasses limiting for a null key and fails open on key-generator errors', () => {
    const skippedNext = vi.fn();
    createRateLimiter({ maxRequests: 1, windowMs: 1_000, keyGenerator: () => null })(
      {} as never,
      response() as never,
      skippedNext,
    );
    expect(skippedNext).toHaveBeenCalledOnce();

    const failedOpenNext = vi.fn();
    createRateLimiter({
      maxRequests: 1,
      windowMs: 1_000,
      keyGenerator: () => {
        throw new Error('key failure');
      },
    })({} as never, response() as never, failedOpenNext);
    expect(failedOpenNext).toHaveBeenCalledOnce();
  });

  it('cleans expired buckets and destroy clears tracked state', () => {
    vi.setSystemTime(1_000);
    const limiter = new RateLimiterMiddleware({ maxRequests: 2, windowMs: 1_000 });
    limiter.check('stale');
    expect(limiter.size).toBe(1);

    vi.setSystemTime(2_000);
    limiter.cleanup();
    expect(limiter.size).toBe(0);

    limiter.check('new');
    limiter.destroy();
    expect(limiter.size).toBe(0);
  });
});

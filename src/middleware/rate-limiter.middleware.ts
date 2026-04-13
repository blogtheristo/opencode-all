/**
 * DWS IQ 6 - API Rate Limiting Middleware
 *
 * In-memory, Map-based sliding window rate limiter.
 * No Redis dependency required for MVP -- suitable for single-instance
 * deployments. For multi-instance (Cloud Run auto-scaling), swap to the
 * Redis-backed limiter at src/services/redis-rate-limiter.service.ts.
 *
 * Features:
 *   - Sliding window algorithm (per-key timestamp ring buffer)
 *   - Configurable per-route limits with sensible defaults
 *   - Standard rate-limit response headers (RFC 6585 / draft-ietf-httpapi-ratelimit-headers)
 *   - 429 Too Many Requests with Retry-After
 *   - Automatic cleanup of expired entries every 5 minutes
 *
 * Usage:
 *   import { createRateLimiter, RATE_LIMIT_PRESETS } from './rate-limiter.middleware.js';
 *
 *   app.use('/api/',           createRateLimiter(RATE_LIMIT_PRESETS.default));
 *   app.use('/api/v1/auth/',   createRateLimiter(RATE_LIMIT_PRESETS.auth));
 *   app.use('/api/v1/agents/', createRateLimiter(RATE_LIMIT_PRESETS.agentExecution));
 *   app.use('/api/v1/reports/',createRateLimiter(RATE_LIMIT_PRESETS.reportGeneration));
 *   app.use('/webhooks/',      createRateLimiter(RATE_LIMIT_PRESETS.webhook));
 */

import { type NextFunction, type Request, type Response } from 'express';
import logger from '../utils/logger.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitOptions {
  /** Maximum number of requests allowed inside the window. */
  maxRequests: number;
  /** Sliding window size in milliseconds. */
  windowMs: number;
  /**
   * Derive the bucket key from a request. Defaults to `req.ip`.
   * Returning `null` or `undefined` skips rate limiting for that request.
   */
  keyGenerator?: (req: Request) => string | null | undefined;
  /** Optional human-readable name for logging. */
  name?: string;
}

/** Internal bookkeeping for a single key. */
interface BucketEntry {
  /** Sorted array of request timestamps (epoch ms) inside the current window. */
  timestamps: number[];
}

// ---------------------------------------------------------------------------
// Rate Limiter Class
// ---------------------------------------------------------------------------

export class RateLimiterMiddleware {
  private readonly buckets = new Map<string, BucketEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly keyGenerator: (req: Request) => string | null | undefined;
  private readonly name: string;
  private readonly cleanupTimer: ReturnType<typeof setInterval>;

  constructor(options: RateLimitOptions) {
    this.maxRequests = options.maxRequests;
    this.windowMs = options.windowMs;
    this.keyGenerator = options.keyGenerator ?? ((req: Request) => req.ip ?? 'unknown');
    this.name = options.name ?? 'rate-limiter';

    // Periodic cleanup every 5 minutes to prevent memory leaks
    this.cleanupTimer = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    // Allow Node to exit even if the timer is still scheduled
    this.cleanupTimer.unref();
  }

  // -----------------------------------------------------------------------
  // Core sliding-window logic
  // -----------------------------------------------------------------------

  /**
   * Record a request and return whether it should be allowed.
   *
   * @returns An object with:
   *   - `allowed`   : true if the request is within the limit
   *   - `remaining` : how many requests the client can still make in this window
   *   - `resetMs`   : epoch ms when the oldest tracked request will fall out of the window
   *   - `limit`     : the configured maximum
   */
  check(key: string): { allowed: boolean; remaining: number; resetMs: number; limit: number } {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let entry = this.buckets.get(key);
    if (!entry) {
      entry = { timestamps: [] };
      this.buckets.set(key, entry);
    }

    // Slide the window: drop timestamps older than windowStart
    // Because timestamps are appended in order they are already sorted.
    let startIdx = 0;
    while (startIdx < entry.timestamps.length && entry.timestamps[startIdx] <= windowStart) {
      startIdx++;
    }
    if (startIdx > 0) {
      entry.timestamps = entry.timestamps.slice(startIdx);
    }

    const currentCount = entry.timestamps.length;

    if (currentCount >= this.maxRequests) {
      // Determine when the oldest request in the window will expire
      const oldestInWindow = entry.timestamps[0];
      const resetMs = oldestInWindow + this.windowMs;
      return {
        allowed: false,
        remaining: 0,
        resetMs,
        limit: this.maxRequests,
      };
    }

    // Allow and record
    entry.timestamps.push(now);

    // resetMs = when the current window expires (worst case for the client)
    const resetMs = now + this.windowMs;

    return {
      allowed: true,
      remaining: this.maxRequests - entry.timestamps.length,
      resetMs,
      limit: this.maxRequests,
    };
  }

  // -----------------------------------------------------------------------
  // Maintenance
  // -----------------------------------------------------------------------

  /** Remove entries whose entire window has expired. */
  cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    let removed = 0;

    for (const [key, entry] of this.buckets.entries()) {
      // If the newest timestamp is older than the window, the whole bucket is stale
      if (entry.timestamps.length === 0 || entry.timestamps[entry.timestamps.length - 1] <= windowStart) {
        this.buckets.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      logger.debug('Rate limiter cleanup', {
        name: this.name,
        entriesRemoved: removed,
        remaining: this.buckets.size,
      });
    }
  }

  /** Tear down the cleanup timer (useful in tests). */
  destroy(): void {
    clearInterval(this.cleanupTimer);
    this.buckets.clear();
  }

  /** Current number of tracked keys (for monitoring). */
  get size(): number {
    return this.buckets.size;
  }
}

// ---------------------------------------------------------------------------
// Express Middleware Factory
// ---------------------------------------------------------------------------

/**
 * Create an Express middleware that enforces the given rate limit.
 *
 * Sets standard headers on every response:
 *   X-RateLimit-Limit     - the configured maximum
 *   X-RateLimit-Remaining - requests remaining in the current window
 *   X-RateLimit-Reset     - UTC epoch seconds when the window resets
 *
 * On limit exceeded returns 429 with a JSON body and `Retry-After` header.
 */
export function createRateLimiter(options: RateLimitOptions) {
  const limiter = new RateLimiterMiddleware(options);

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const key = limiter['keyGenerator'](req);

      // If key generator returns null/undefined, skip rate limiting
      if (key == null) {
        next();
        return;
      }

      const result = limiter.check(key);

      // Always set informational headers
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, result.remaining));
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetMs / 1000));

      if (!result.allowed) {
        const retryAfterSeconds = Math.ceil((result.resetMs - Date.now()) / 1000);
        res.setHeader('Retry-After', Math.max(1, retryAfterSeconds));

        logger.warn('Rate limit exceeded', {
          name: options.name ?? 'rate-limiter',
          key,
          limit: result.limit,
          retryAfter: retryAfterSeconds,
        });

        res.status(429).json({
          error: 'Too Many Requests',
          message: `Rate limit exceeded. Try again in ${Math.max(1, retryAfterSeconds)} seconds.`,
          retryAfter: Math.max(1, retryAfterSeconds),
        });
        return;
      }

      next();
    } catch (error) {
      // Fail-open: if the limiter itself errors, allow the request through
      logger.error('Rate limiter error, allowing request', {
        name: options.name ?? 'rate-limiter',
        error: (error as Error).message,
      });
      next();
    }
  };
}

// ---------------------------------------------------------------------------
// Pre-configured Presets
// ---------------------------------------------------------------------------

export const RATE_LIMIT_PRESETS = {
  /** General API: 100 req / minute */
  default: {
    maxRequests: 100,
    windowMs: 60 * 1000,
    name: 'default',
  } satisfies RateLimitOptions,

  /** Auth endpoints (login, register, forgot-password): 10 req / minute */
  auth: {
    maxRequests: 10,
    windowMs: 60 * 1000,
    name: 'auth',
  } satisfies RateLimitOptions,

  /** Agent execution endpoints: 20 req / minute */
  agentExecution: {
    maxRequests: 20,
    windowMs: 60 * 1000,
    name: 'agent-execution',
  } satisfies RateLimitOptions,

  /** Report generation: 5 req / minute */
  reportGeneration: {
    maxRequests: 5,
    windowMs: 60 * 1000,
    name: 'report-generation',
  } satisfies RateLimitOptions,

  /** Webhook endpoints: 200 req / minute (higher limit for external services) */
  webhook: {
    maxRequests: 200,
    windowMs: 60 * 1000,
    name: 'webhook',
  } satisfies RateLimitOptions,
} as const;

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export default {
  RateLimiterMiddleware,
  createRateLimiter,
  RATE_LIMIT_PRESETS,
};

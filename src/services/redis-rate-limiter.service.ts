/**
 * Redis Rate Limiter Service
 * SECURITY FIX #8: Distributed rate limiting using Redis
 *
 * For multi-instance deployments (Cloud Run auto-scaling),
 * in-memory rate limiters don't work as each instance has its own counter.
 * Redis provides a shared counter across all instances.
 *
 * @see https://www.scaleway.com/en/managed-database-for-redistm/
 */

import Redis from 'ioredis';
import { type NextFunction, type Request, type Response } from 'express';
import crypto from 'crypto';
import logger from '../utils/logger.js';

// Redis configuration (shared with token blacklist)
const REDIS_URL = process.env.REDIS_URL;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_TLS = process.env.REDIS_TLS === 'true';

// Singleton Redis client (may be shared with token blacklist)
let redisClient: Redis | null = null;
let useRedis = false;

/**
 * Initialize Redis connection for rate limiting
 */
async function initializeRedis(): Promise<void> {
  if (redisClient) return;

  try {
    if (REDIS_URL) {
      redisClient = new Redis(REDIS_URL, {
        tls: REDIS_TLS ? {} : undefined,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
    } else if (REDIS_HOST) {
      redisClient = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        tls: REDIS_TLS ? {} : undefined,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
      });
    } else {
      return;
    }

    await redisClient.connect();
    await redisClient.ping();
    useRedis = true;
    logger.info('Redis rate limiter initialized');
  } catch (error) {
    logger.warn('Redis not available for rate limiting, using in-memory fallback', {
      error: (error as Error).message,
    });
    redisClient = null;
  }
}

// Initialize on module load only if Redis is explicitly configured.
// REDIS_HOST has a 'localhost' default so we check the raw env var here
// to avoid an unwanted connection attempt in CI / test environments.
if (REDIS_URL || process.env.REDIS_HOST) {
  initializeRedis().catch(() => {});
}

/**
 * Rate limiter configuration
 */
interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxAttempts: number; // Max attempts per window
  keyPrefix: string; // Redis key prefix
  keyGenerator?: (req: Request) => string; // Custom key generator
}

/**
 * In-memory fallback store
 */
const inMemoryStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup in-memory store periodically
setInterval(
  () => {
    const now = Date.now();
    for (const [key, data] of inMemoryStore.entries()) {
      if (now > data.resetTime) {
        inMemoryStore.delete(key);
      }
    }
  },
  60 * 60 * 1000,
); // Every hour

/**
 * Create a rate limiter middleware
 * Uses Redis if available, falls back to in-memory
 */
export function createRateLimiter(config: RateLimitConfig) {
  const { windowMs, maxAttempts, keyPrefix, keyGenerator } = config;
  const windowSeconds = Math.ceil(windowMs / 1000);

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Generate key for this request
      const identifier = keyGenerator ? keyGenerator(req) : req.ip || 'unknown';
      const key = `${keyPrefix}:${identifier}`;

      if (useRedis && redisClient) {
        // Redis-based rate limiting
        const current = await redisClient.incr(key);

        if (current === 1) {
          // First request, set expiry
          await redisClient.expire(key, windowSeconds);
        }

        if (current > maxAttempts) {
          const ttl = await redisClient.ttl(key);
          const remainingMinutes = Math.ceil(ttl / 60);

          logger.warn('Rate limit exceeded', { key, attempts: current, maxAttempts });

          return res.status(429).json({
            error: 'Too many requests',
            message: `Please try again in ${remainingMinutes} minutes`,
            retryAfter: ttl,
          });
        }
      } else {
        // In-memory fallback
        const now = Date.now();
        const data = inMemoryStore.get(key);

        if (!data || now > data.resetTime) {
          inMemoryStore.set(key, { count: 1, resetTime: now + windowMs });
        } else {
          data.count++;

          if (data.count > maxAttempts) {
            const remainingMs = data.resetTime - now;
            const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);

            logger.warn('Rate limit exceeded (in-memory)', {
              key,
              attempts: data.count,
              maxAttempts,
            });

            return res.status(429).json({
              error: 'Too many requests',
              message: `Please try again in ${remainingMinutes} minutes`,
              retryAfter: Math.ceil(remainingMs / 1000),
            });
          }
        }
      }

      return next();
    } catch (error) {
      // If rate limiting fails, allow the request (fail-open)
      logger.error('Rate limiter error', { error: (error as Error).message });
      return next();
    }
  };
}

/**
 * Pre-configured login rate limiter
 * 5 attempts per 15 minutes per email
 */
export const loginRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,
  keyPrefix: 'ratelimit:login',
  keyGenerator: (req: Request) => {
    const email = req.body?.email;
    if (typeof email === 'string') {
      // Hash email for privacy
      return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex').substring(0, 16);
    }
    return req.ip || 'unknown';
  },
});

/**
 * Pre-configured API rate limiter
 * 100 requests per minute per IP
 */
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxAttempts: 100,
  keyPrefix: 'ratelimit:api',
});

/**
 * Pre-configured registration rate limiter
 * 3 registrations per hour per IP
 */
export const registrationRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxAttempts: 3,
  keyPrefix: 'ratelimit:register',
});

export default {
  createRateLimiter,
  loginRateLimiter,
  apiRateLimiter,
  registrationRateLimiter,
};

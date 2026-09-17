/**
 * Upstash Redis Service
 * HTTP/REST-based Redis client for serverless and edge environments
 *
 * Benefits over traditional Redis (ioredis):
 * - Connectionless: No TCP connection overhead
 * - Edge-compatible: Works in Cloudflare Workers, Vercel Edge, Lambda
 * - Serverless-optimized: No connection pooling needed
 *
 * @see https://github.com/upstash/redis-js
 * @see https://upstash.com/docs/redis/overall/getstarted
 */

import { Redis } from '@upstash/redis';
import crypto from 'crypto';
import logger from '../utils/logger.js';

// Environment configuration
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Key prefixes for organization
const KEY_PREFIX = {
  TOKEN_BLACKLIST: 'token:revoked:',
  USER_TOKENS: 'user:tokens:',
  RATE_LIMIT: 'ratelimit:',
  SESSION: 'session:',
  CACHE: 'cache:',
};

// Default TTLs (in seconds)
const DEFAULT_TTL = {
  TOKEN: 86400,      // 24 hours (matches access token expiry)
  REFRESH: 604800,   // 7 days (matches refresh token expiry)
  RATE_LIMIT: 60,    // 1 minute
  SESSION: 604800,   // 7 days
  CACHE: 300,        // 5 minutes
};

// Singleton Redis client
let redis: Redis | null = null;

/**
 * Initialize Upstash Redis client
 * Unlike ioredis, this is connectionless - just creates the client instance
 */
export function initializeUpstashRedis(): Redis {
  if (redis) {
    return redis;
  }

  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
    throw new Error(
      'Missing Upstash Redis credentials. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN'
    );
  }

  redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  });

  logger.info('Upstash Redis client initialized (connectionless HTTP mode)');
  return redis;
}

/**
 * Get Redis client (auto-initializes if needed)
 */
export function getRedis(): Redis {
  if (!redis) {
    return initializeUpstashRedis();
  }
  return redis;
}

/**
 * Hash a token for secure storage (never store raw JWTs)
 */
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ============================================================================
// TOKEN BLACKLIST OPERATIONS
// ============================================================================

/**
 * Revoke a token by adding to blacklist
 *
 * @param token - JWT token to revoke
 * @param ttlSeconds - Time until auto-cleanup (should match token expiry)
 */
export async function revokeToken(
  token: string,
  ttlSeconds: number = DEFAULT_TTL.TOKEN
): Promise<void> {
  const client = getRedis();
  const tokenHash = hashToken(token);
  const key = `${KEY_PREFIX.TOKEN_BLACKLIST}${tokenHash}`;

  try {
    await client.setex(key, ttlSeconds, '1');
    logger.info('Token revoked', { tokenHash: tokenHash.substring(0, 16), ttl: ttlSeconds });
  } catch (error) {
    logger.error('Failed to revoke token', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Check if a token is revoked
 *
 * @param token - JWT token to check
 * @returns true if revoked, false if valid
 */
export async function isTokenRevoked(token: string): Promise<boolean> {
  const client = getRedis();
  const tokenHash = hashToken(token);
  const key = `${KEY_PREFIX.TOKEN_BLACKLIST}${tokenHash}`;

  try {
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error('Failed to check token revocation', { error: (error as Error).message });
    // Fail-safe: if Redis is unreachable, allow token (prevent total lockout)
    // For high-security, change to: return true;
    return false;
  }
}

/**
 * Register a token for a user (enables "logout all devices")
 */
export async function registerUserToken(
  userId: string,
  token: string,
  ttlSeconds: number = DEFAULT_TTL.TOKEN
): Promise<void> {
  const client = getRedis();
  const tokenHash = hashToken(token);
  const key = `${KEY_PREFIX.USER_TOKENS}${userId}`;

  try {
    await client.sadd(key, tokenHash);
    await client.expire(key, ttlSeconds);
    logger.debug('Token registered for user', { userId, tokenHash: tokenHash.substring(0, 16) });
  } catch (error) {
    // Non-critical: continue even if registration fails
    logger.warn('Failed to register user token', { error: (error as Error).message });
  }
}

/**
 * Revoke all tokens for a user (logout all devices)
 */
export async function revokeAllUserTokens(userId: string): Promise<number> {
  const client = getRedis();
  const userTokensKey = `${KEY_PREFIX.USER_TOKENS}${userId}`;

  try {
    // Get all token hashes for this user
    const tokenHashes = await client.smembers(userTokensKey);

    if (!tokenHashes || tokenHashes.length === 0) {
      logger.info('No tokens to revoke for user', { userId });
      return 0;
    }

    // Revoke each token using pipeline for efficiency
    const pipeline = client.pipeline();
    for (const hash of tokenHashes) {
      pipeline.setex(`${KEY_PREFIX.TOKEN_BLACKLIST}${hash}`, DEFAULT_TTL.TOKEN, '1');
    }
    pipeline.del(userTokensKey);
    await pipeline.exec();

    logger.info('All user tokens revoked', { userId, count: tokenHashes.length });
    return tokenHashes.length;
  } catch (error) {
    logger.error('Failed to revoke all user tokens', { error: (error as Error).message, userId });
    throw error;
  }
}

// ============================================================================
// RATE LIMITING OPERATIONS
// ============================================================================

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check and increment rate limit
 * Uses sliding window algorithm
 *
 * @param identifier - Unique identifier (IP, userId, API key)
 * @param limit - Max requests per window
 * @param windowSeconds - Window size in seconds
 */
export async function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<RateLimitResult> {
  const client = getRedis();
  const key = `${KEY_PREFIX.RATE_LIMIT}${identifier}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  try {
    // Remove old entries outside the window
    await client.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    const count = await client.zcard(key);

    if (count >= limit) {
      // Get oldest entry to calculate reset time
      const oldest = await client.zrange(key, 0, 0, { withScores: true }) as Array<{ score: number; member: string }>;
      const resetAt = oldest.length > 0
        ? Math.ceil((oldest[0].score + windowSeconds * 1000) / 1000)
        : Math.ceil((now + windowSeconds * 1000) / 1000);

      return {
        allowed: false,
        remaining: 0,
        resetAt,
      };
    }

    // Add current request
    await client.zadd(key, { score: now, member: `${now}-${Math.random()}` });
    await client.expire(key, windowSeconds);

    return {
      allowed: true,
      remaining: limit - count - 1,
      resetAt: Math.ceil((now + windowSeconds * 1000) / 1000),
    };
  } catch (error) {
    logger.error('Rate limit check failed', { error: (error as Error).message });
    // Fail-open: allow request if Redis is down
    return { allowed: true, remaining: limit, resetAt: 0 };
  }
}

// ============================================================================
// SESSION CACHE OPERATIONS
// ============================================================================

/**
 * Cache a session
 */
export async function cacheSession<T>(
  sessionId: string,
  data: T,
  ttlSeconds: number = DEFAULT_TTL.SESSION
): Promise<void> {
  const client = getRedis();
  const key = `${KEY_PREFIX.SESSION}${sessionId}`;

  try {
    await client.setex(key, ttlSeconds, JSON.stringify(data));
    logger.debug('Session cached', { sessionId: sessionId.substring(0, 16) });
  } catch (error) {
    logger.warn('Failed to cache session', { error: (error as Error).message });
  }
}

/**
 * Get cached session
 */
export async function getCachedSession<T>(sessionId: string): Promise<T | null> {
  const client = getRedis();
  const key = `${KEY_PREFIX.SESSION}${sessionId}`;

  try {
    const data = await client.get(key);
    return data ? (JSON.parse(data as string) as T) : null;
  } catch (error) {
    logger.warn('Failed to get cached session', { error: (error as Error).message });
    return null;
  }
}

/**
 * Invalidate a session
 */
export async function invalidateSession(sessionId: string): Promise<void> {
  const client = getRedis();
  const key = `${KEY_PREFIX.SESSION}${sessionId}`;

  try {
    await client.del(key);
    logger.debug('Session invalidated', { sessionId: sessionId.substring(0, 16) });
  } catch (error) {
    logger.warn('Failed to invalidate session', { error: (error as Error).message });
  }
}

// ============================================================================
// GENERIC CACHE OPERATIONS
// ============================================================================

/**
 * Set a cached value
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number = DEFAULT_TTL.CACHE
): Promise<void> {
  const client = getRedis();
  const cacheKey = `${KEY_PREFIX.CACHE}${key}`;

  try {
    await client.setex(cacheKey, ttlSeconds, JSON.stringify(value));
  } catch (error) {
    logger.warn('Failed to set cache', { error: (error as Error).message, key });
  }
}

/**
 * Get a cached value
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedis();
  const cacheKey = `${KEY_PREFIX.CACHE}${key}`;

  try {
    const data = await client.get(cacheKey);
    return data ? (JSON.parse(data as string) as T) : null;
  } catch (error) {
    logger.warn('Failed to get cache', { error: (error as Error).message, key });
    return null;
  }
}

/**
 * Delete a cached value
 */
export async function deleteCache(key: string): Promise<void> {
  const client = getRedis();
  const cacheKey = `${KEY_PREFIX.CACHE}${key}`;

  try {
    await client.del(cacheKey);
  } catch (error) {
    logger.warn('Failed to delete cache', { error: (error as Error).message, key });
  }
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Check Upstash Redis health
 */
export async function checkUpstashHealth(): Promise<boolean> {
  try {
    const client = getRedis();
    const pong = await client.ping();
    return pong === 'PONG';
  } catch (error) {
    logger.error('Upstash health check failed', { error: (error as Error).message });
    return false;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Initialization
  initializeUpstashRedis,
  getRedis,

  // Token operations
  revokeToken,
  isTokenRevoked,
  registerUserToken,
  revokeAllUserTokens,

  // Rate limiting
  checkRateLimit,

  // Session cache
  cacheSession,
  getCachedSession,
  invalidateSession,

  // Generic cache
  setCache,
  getCache,
  deleteCache,

  // Health
  checkUpstashHealth,

  // Constants
  KEY_PREFIX,
  DEFAULT_TTL,
};

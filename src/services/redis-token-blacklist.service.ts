/**
 * Redis Token Blacklist Service
 * SECURITY FIX #4: Production-grade token revocation using Redis
 *
 * Designed for Scaleway Managed Redis deployment:
 * - High availability (3-6 node clusters)
 * - EU data residency (Paris/Amsterdam)
 * - TLS encryption required
 *
 * @see https://www.scaleway.com/en/managed-database-for-redistm/
 */

import Redis from 'ioredis';
import crypto from 'crypto';
import logger from '../utils/logger.js';

// Redis connection configuration
const REDIS_URL = process.env.REDIS_URL;
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_TLS = process.env.REDIS_TLS === 'true';
const REDIS_DB = parseInt(process.env.REDIS_DB || '0', 10);

// Token blacklist key prefix
const BLACKLIST_PREFIX = 'token:revoked:';

// Default TTL for revoked tokens (24 hours in seconds)
const DEFAULT_TOKEN_TTL = 86400;

// Singleton Redis client
let redisClient: Redis | null = null;

/**
 * Initialize Redis connection
 * Call this at application startup
 */
export async function initializeRedis(): Promise<void> {
  if (redisClient) {
    logger.warn('Redis client already initialized');
    return;
  }

  try {
    // Use REDIS_URL if provided (Scaleway format: redis://user:password@host:port)
    if (REDIS_URL) {
      redisClient = new Redis(REDIS_URL, {
        tls: REDIS_TLS ? {} : undefined,
        maxRetriesPerRequest: 3,
        retryStrategy(times: number) { return Math.min(times * 100, 3000); },
        lazyConnect: true,
      });
    } else {
      redisClient = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        db: REDIS_DB,
        tls: REDIS_TLS ? {} : undefined,
        maxRetriesPerRequest: 3,
        retryStrategy(times: number) { return Math.min(times * 100, 3000); },
        lazyConnect: true,
      });
    }

    // Event handlers
    redisClient.on('connect', () => {
      logger.info('Redis connected successfully');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis connection error', { error: err.message });
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });

    // Test connection
    await redisClient.connect();
    await redisClient.ping();

    logger.info('Redis token blacklist service initialized', {
      host: REDIS_HOST,
      port: REDIS_PORT,
      tls: REDIS_TLS,
    });
  } catch (error) {
    logger.error('Failed to initialize Redis', { error: (error as Error).message });
    redisClient = null;
    throw error;
  }
}

/**
 * Get Redis client (with fallback check)
 */
function getRedisClient(): Redis {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call initializeRedis() first.');
  }
  return redisClient;
}

/**
 * Hash a token for storage (don't store raw JWTs)
 */
function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Revoke a token by adding to Redis blacklist
 *
 * @param token - The JWT token to revoke
 * @param ttlSeconds - Time to live in seconds (should match token expiry)
 */
export async function revokeToken(token: string, ttlSeconds: number = DEFAULT_TOKEN_TTL): Promise<void> {
  const redis = getRedisClient();
  const tokenHash = hashToken(token);
  const key = `${BLACKLIST_PREFIX}${tokenHash}`;

  try {
    // SETEX: Set key with expiry (auto-cleanup when token would have expired anyway)
    await redis.setex(key, ttlSeconds, '1');

    logger.info('Token revoked in Redis', {
      tokenHash: tokenHash.substring(0, 16),
      ttl: ttlSeconds,
    });
  } catch (error) {
    logger.error('Failed to revoke token in Redis', { error: (error as Error).message });
    throw error;
  }
}

/**
 * Check if a token is revoked
 *
 * @param token - The JWT token to check
 * @returns true if token is revoked, false otherwise
 */
export async function isTokenRevoked(token: string): Promise<boolean> {
  const redis = getRedisClient();
  const tokenHash = hashToken(token);
  const key = `${BLACKLIST_PREFIX}${tokenHash}`;

  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error('Failed to check token revocation in Redis', { error: (error as Error).message });
    // Fail-safe: if Redis is down, consider token valid to avoid complete lockout
    // In high-security scenarios, you might want to return true instead
    return false;
  }
}

/**
 * Revoke all tokens for a user (logout from all devices)
 * Requires storing user's active tokens in a set
 *
 * @param userId - The user ID to revoke all tokens for
 */
export async function revokeAllUserTokens(userId: string): Promise<void> {
  const redis = getRedisClient();
  const userTokensKey = `user:tokens:${userId}`;

  try {
    // Get all token hashes for this user
    const tokenHashes = await redis.smembers(userTokensKey);

    if (tokenHashes.length === 0) {
      logger.info('No tokens to revoke for user', { userId });
      return;
    }

    // Revoke each token
    const pipeline = redis.pipeline();
    for (const hash of tokenHashes) {
      pipeline.setex(`${BLACKLIST_PREFIX}${hash}`, DEFAULT_TOKEN_TTL, '1');
    }

    // Clear the user's token set
    pipeline.del(userTokensKey);

    await pipeline.exec();

    logger.info('All user tokens revoked', { userId, count: tokenHashes.length });
  } catch (error) {
    logger.error('Failed to revoke all user tokens', { error: (error as Error).message, userId });
    throw error;
  }
}

/**
 * Register a token for a user (for "logout all" functionality)
 *
 * @param userId - The user ID
 * @param token - The JWT token
 * @param ttlSeconds - Token TTL
 */
export async function registerUserToken(
  userId: string,
  token: string,
  ttlSeconds: number = DEFAULT_TOKEN_TTL
): Promise<void> {
  const redis = getRedisClient();
  const tokenHash = hashToken(token);
  const userTokensKey = `user:tokens:${userId}`;

  try {
    // Add token hash to user's token set with expiry
    await redis.sadd(userTokensKey, tokenHash);
    await redis.expire(userTokensKey, ttlSeconds);

    logger.debug('Token registered for user', { userId, tokenHash: tokenHash.substring(0, 16) });
  } catch (error) {
    logger.error('Failed to register user token', { error: (error as Error).message, userId });
    // Non-critical: continue even if registration fails
  }
}

/**
 * Close Redis connection (for graceful shutdown)
 */
export async function closeRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis connection closed');
  }
}

/**
 * Check Redis health
 */
export async function checkRedisHealth(): Promise<boolean> {
  if (!redisClient) {
    return false;
  }

  try {
    const pong = await redisClient.ping();
    return pong === 'PONG';
  } catch {
    return false;
  }
}

// Export singleton functions for backward compatibility with in-memory implementation
export default {
  initializeRedis,
  revokeToken,
  isTokenRevoked,
  revokeAllUserTokens,
  registerUserToken,
  closeRedis,
  checkRedisHealth,
};

import Redis from 'ioredis';
import { getInternalDbPool } from '../config/internal-db.js';
import logger from '../utils/logger.js';

export interface ResolveContext {
  concept_id: string;
  tenant_id?: string;
  industry?: string;
  lwm_version?: string;
  product_edition?: string;
  platform_version?: string;
  legal_profile?: string;
  cloud_profile?: string;
  locale?: string;
}

export type ResolveResult =
  | { term: string; source: string }
  | { error: 'forbidden_by_policy'; concept_id: string }
  | { error: 'unresolved'; concept_id: string };

const CACHE_TTL_SECONDS = 300;

let redisClient: Redis | null = null;
let redisReady = false;

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;

  redisClient = new Redis(redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
  });

  redisClient.on('error', (error) => {
    redisReady = false;
    logger.warn('resolveTerm Redis client error', { error: (error as Error).message });
  });

  return redisClient;
}

async function ensureRedisConnection(): Promise<Redis | null> {
  const client = getRedisClient();
  if (!client) return null;

  if (redisReady) return client;

  try {
    await client.connect();
    await client.ping();
    redisReady = true;
    return client;
  } catch (error) {
    logger.warn('resolveTerm Redis unavailable, falling back to RPC-only mode', {
      error: (error as Error).message,
    });
    return null;
  }
}

function cacheKey(ctx: ResolveContext): string {
  return [
    'termset',
    ctx.tenant_id ?? '',
    ctx.industry ?? '',
    ctx.lwm_version ?? '',
    ctx.product_edition ?? '',
    ctx.platform_version ?? '',
    ctx.legal_profile ?? '',
    ctx.cloud_profile ?? '',
    ctx.locale ?? 'en',
    ctx.concept_id,
  ].join(':');
}

export async function resolveTerm(ctx: ResolveContext): Promise<ResolveResult> {
  const key = cacheKey(ctx);
  const redis = await ensureRedisConnection();

  // 1) Redis cache
  if (redis) {
    try {
      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached) as ResolveResult;
      }
    } catch {
      // Non-fatal: continue to RPC path.
    }
  }

  // 2) resolve_term RPC (internal-ops Postgres)
  try {
    const pool = getInternalDbPool();
    if (!pool) {
      return { error: 'unresolved', concept_id: ctx.concept_id };
    }

    const { rows } = await pool.query(
      `SELECT * FROM resolve_term($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        ctx.concept_id,
        ctx.tenant_id ?? null,
        ctx.industry ?? null,
        ctx.lwm_version ?? null,
        ctx.product_edition ?? null,
        ctx.platform_version ?? null,
        ctx.legal_profile ?? null,
        ctx.cloud_profile ?? null,
        ctx.locale ?? 'en',
      ],
    );

    const row = rows[0];
    const result: ResolveResult = row
      ? row.policy_level === 'forbidden'
        ? { error: 'forbidden_by_policy', concept_id: ctx.concept_id }
        : { term: row.preferred_term, source: row.scope_type }
      : { error: 'unresolved', concept_id: ctx.concept_id };

    // Cache positive resolutions only
    if (redis && !('error' in result)) {
      await redis.setex(key, CACHE_TTL_SECONDS, JSON.stringify(result)).catch(() => {});
    }

    return result;
  } catch (error) {
    logger.warn('resolveTerm RPC failed, returning unresolved fallback', {
      concept_id: ctx.concept_id,
      error: (error as Error).message,
    });
    return { error: 'unresolved', concept_id: ctx.concept_id };
  }
}

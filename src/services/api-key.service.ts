/**
 * API Key Management Service
 *
 * Provides self-service API key CRUD for customers.
 * Keys are hashed with SHA-256 before storage — the raw key is only returned once on creation.
 * Prefix (first 12 chars) is stored for identification in the UI.
 *
 * Storage: Supabase `api_keys` table (migration 043).
 * Falls back to in-memory store when Supabase is unavailable.
 *
 * MVP Feature 1 — Customer API Key Management
 */

import crypto from 'crypto';
import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';

export interface ApiKeyRecord {
  id: string;
  userId: string;
  name: string;
  prefix: string;
  hash: string;
  scopes: string[];
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  revoked: boolean;
}

export interface CreateApiKeyInput {
  userId: string;
  name: string;
  scopes?: string[];
  expiresInDays?: number;
}

export interface CreateApiKeyResult {
  id: string;
  name: string;
  prefix: string;
  rawKey: string;
  scopes: string[];
  createdAt: string;
  expiresAt: string | null;
}

export const VALID_SCOPES = [
  'compliance:read',
  'compliance:write',
  'assistant:read',
  'assistant:write',
  'reports:read',
  'reports:export',
  'usage:read',
] as const;

const MAX_KEYS_PER_USER = 10;

// In-memory fallback store (used when Supabase is unavailable)
const memStore = new Map<string, ApiKeyRecord>();

function hashKey(rawKey: string): string {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

function generateRawKey(): string {
  const random = crypto.randomBytes(16).toString('hex');
  return `dws_live_${random}`;
}

// Map Supabase row (snake_case) to ApiKeyRecord (camelCase)
export function rowToRecord(row: any): ApiKeyRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    prefix: row.prefix,
    hash: row.hash,
    scopes: row.scopes,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    expiresAt: row.expires_at,
    revoked: row.revoked,
  };
}

export const ApiKeyService = {
  async create(input: CreateApiKeyInput): Promise<CreateApiKeyResult> {
    const { userId, name, scopes = ['compliance:read', 'usage:read'], expiresInDays } = input;

    // Validate scopes
    for (const scope of scopes) {
      if (!VALID_SCOPES.includes(scope as any)) {
        throw new Error(`Invalid scope: ${scope}. Valid scopes: ${VALID_SCOPES.join(', ')}`);
      }
    }

    const rawKey = generateRawKey();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
      : null;
    const prefix = rawKey.slice(0, 12) + '****';
    const hash = hashKey(rawKey);

    const sb = getSupabaseClient();

    if (sb) {
      // Check per-user limit
      const { count, error: countErr } = await sb
        .from('api_keys')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('revoked', false);

      if (countErr) {
        logger.error('API key count query failed', { error: countErr.message });
        throw new Error('Failed to check API key limit');
      }

      if ((count ?? 0) >= MAX_KEYS_PER_USER) {
        throw new Error(`Maximum ${MAX_KEYS_PER_USER} active API keys per user`);
      }

      const { error: insertErr } = await sb.from('api_keys').insert({
        id,
        user_id: userId,
        name,
        prefix,
        hash,
        scopes,
        created_at: now,
        last_used_at: null,
        expires_at: expiresAt,
        revoked: false,
      });

      if (insertErr) {
        logger.error('API key insert failed', { error: insertErr.message });
        throw new Error('Failed to create API key');
      }
    } else {
      // In-memory fallback
      const userKeys = Array.from(memStore.values()).filter(
        (k) => k.userId === userId && !k.revoked,
      );
      if (userKeys.length >= MAX_KEYS_PER_USER) {
        throw new Error(`Maximum ${MAX_KEYS_PER_USER} active API keys per user`);
      }

      memStore.set(id, {
        id,
        userId,
        name,
        prefix,
        hash,
        scopes,
        createdAt: now,
        lastUsedAt: null,
        expiresAt,
        revoked: false,
      });
    }

    logger.info('API key created', { userId, keyId: id, name, scopes });

    return { id, name, prefix, rawKey, scopes, createdAt: now, expiresAt };
  },

  async list(userId: string): Promise<Omit<ApiKeyRecord, 'hash'>[]> {
    const sb = getSupabaseClient();

    if (sb) {
      const { data, error } = await sb
        .from('api_keys')
        .select('id, user_id, name, prefix, scopes, created_at, last_used_at, expires_at, revoked')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('API key list query failed', { error: error.message });
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        name: row.name,
        prefix: row.prefix,
        scopes: row.scopes,
        createdAt: row.created_at,
        lastUsedAt: row.last_used_at,
        expiresAt: row.expires_at,
        revoked: row.revoked,
      }));
    }

    // In-memory fallback
    return Array.from(memStore.values())
      .filter((k) => k.userId === userId)
      .map(({ hash: _hash, ...rest }) => rest)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async revoke(userId: string, keyId: string): Promise<boolean> {
    const sb = getSupabaseClient();

    if (sb) {
      const { data, error } = await sb
        .from('api_keys')
        .update({ revoked: true })
        .eq('id', keyId)
        .eq('user_id', userId)
        .select('id')
        .single();

      if (error || !data) {
        return false;
      }

      logger.info('API key revoked', { userId, keyId });
      return true;
    }

    // In-memory fallback
    const record = memStore.get(keyId);
    if (!record || record.userId !== userId) return false;
    record.revoked = true;
    logger.info('API key revoked', { userId, keyId });
    return true;
  },

  async validate(rawKey: string): Promise<{ userId: string; scopes: string[] } | null> {
    const hash = hashKey(rawKey);
    const sb = getSupabaseClient();

    if (sb) {
      const { data, error } = await sb
        .from('api_keys')
        .select('id, user_id, scopes, expires_at')
        .eq('hash', hash)
        .eq('revoked', false)
        .single();

      if (error || !data) return null;

      // Check expiry
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        return null;
      }

      // Update last_used_at (fire-and-forget)
      sb.from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', data.id)
        .then(() => {});

      return { userId: data.user_id, scopes: data.scopes };
    }

    // In-memory fallback
    for (const record of memStore.values()) {
      if (record.hash === hash && !record.revoked) {
        if (record.expiresAt && new Date(record.expiresAt) < new Date()) return null;
        record.lastUsedAt = new Date().toISOString();
        return { userId: record.userId, scopes: record.scopes };
      }
    }

    return null;
  },
};

export default ApiKeyService;

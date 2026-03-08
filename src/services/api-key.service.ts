/**
 * API Key Management Service
 *
 * Provides self-service API key CRUD for customers.
 * Keys are hashed with SHA-256 before storage — the raw key is only returned once on creation.
 * Prefix (first 8 chars) is stored for identification in the UI.
 *
 * MVP Feature 1 — Customer API Key Management
 */

import crypto from 'crypto';
import logger from '../utils/logger.js';

// In production, this would be backed by Supabase/PostgreSQL.
// For MVP, we use an in-memory store with the same interface
// so the migration to DB is a drop-in replacement.

export interface ApiKeyRecord {
  id: string;
  userId: string;
  name: string;
  prefix: string;        // First 8 chars of the key (for UI display)
  hash: string;           // SHA-256 hash of the full key
  scopes: string[];       // e.g. ['compliance:read', 'assistant:write']
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
  rawKey: string;         // Only returned once — never stored
  scopes: string[];
  createdAt: string;
  expiresAt: string | null;
}

// Available scopes for API keys
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

// In-memory store (replaced by Supabase in production)
const keyStore = new Map<string, ApiKeyRecord>();

function hashKey(rawKey: string): string {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

function generateRawKey(): string {
  // Format: dws_live_<32 random hex chars>
  const random = crypto.randomBytes(16).toString('hex');
  return `dws_live_${random}`;
}

export const ApiKeyService = {
  /**
   * Create a new API key for a user.
   * Returns the raw key exactly once — it is never stored.
   */
  async create(input: CreateApiKeyInput): Promise<CreateApiKeyResult> {
    const { userId, name, scopes = ['compliance:read', 'usage:read'], expiresInDays } = input;

    // Enforce per-user limit
    const userKeys = Array.from(keyStore.values()).filter(
      (k) => k.userId === userId && !k.revoked,
    );
    if (userKeys.length >= MAX_KEYS_PER_USER) {
      throw new Error(`Maximum ${MAX_KEYS_PER_USER} active API keys per user`);
    }

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

    const record: ApiKeyRecord = {
      id,
      userId,
      name,
      prefix: rawKey.slice(0, 12) + '****',
      hash: hashKey(rawKey),
      scopes,
      createdAt: now,
      lastUsedAt: null,
      expiresAt,
      revoked: false,
    };

    keyStore.set(id, record);

    logger.info('API key created', { userId, keyId: id, name, scopes });

    return {
      id,
      name,
      prefix: record.prefix,
      rawKey,    // Only time the full key is returned
      scopes,
      createdAt: now,
      expiresAt,
    };
  },

  /**
   * List all API keys for a user (without hashes).
   */
  async list(userId: string): Promise<Omit<ApiKeyRecord, 'hash'>[]> {
    const keys = Array.from(keyStore.values())
      .filter((k) => k.userId === userId)
      .map(({ hash: _hash, ...rest }) => rest)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    return keys;
  },

  /**
   * Revoke an API key (soft delete — keeps audit trail).
   */
  async revoke(userId: string, keyId: string): Promise<boolean> {
    const record = keyStore.get(keyId);

    if (!record || record.userId !== userId) {
      return false;
    }

    record.revoked = true;
    logger.info('API key revoked', { userId, keyId });
    return true;
  },

  /**
   * Validate a raw API key and return the associated user info.
   * Used by the API key auth middleware.
   */
  async validate(rawKey: string): Promise<{ userId: string; scopes: string[] } | null> {
    const hash = hashKey(rawKey);

    for (const record of keyStore.values()) {
      if (record.hash === hash && !record.revoked) {
        // Check expiry
        if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
          return null;
        }

        // Update last used timestamp
        record.lastUsedAt = new Date().toISOString();

        return { userId: record.userId, scopes: record.scopes };
      }
    }

    return null;
  },
};

export default ApiKeyService;

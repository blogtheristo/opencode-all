/**
 * Shared Supabase Client for Backend Services
 *
 * Uses SUPABASE_SERVICE_KEY (service_role) for full table access.
 * All RLS policies grant service_role full access, so this client
 * bypasses row-level security by design — authorization is handled
 * in route middleware (authenticateToken, requireRole).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

let _client: SupabaseClient | null = null;

/**
 * Get the shared Supabase service-role client.
 * Returns null if credentials are not configured (graceful degradation).
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    logger.warn('Supabase credentials not configured — services will use in-memory fallback');
    return null;
  }

  _client = createClient(url, key);
  return _client;
}

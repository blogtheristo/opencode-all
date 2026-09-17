/**
 * Shared Postgres Pool for Internal DWS Operational Tables (Tier 1)
 *
 * Backs agent memory, cron/command audit logs, tool telemetry, and agent
 * nudges — self-hosted on DGX Spark (dws-postgres container), not Supabase.
 * No RLS: only dws-backend/dws-cron ever connect, over the internal
 * dws-network, so access control is connection-level (network isolation +
 * one service role), not row-level.
 *
 * Configured via a single connection string (INTERNAL_DB_URL), same shape
 * as the existing AIVEN_DATABASE_URL convention used elsewhere in this repo.
 */

import { Pool } from 'pg';
import logger from '../utils/logger.js';

let _pool: Pool | null = null;
let _hasWarnedMissingInternalDbUrl = false;

/**
 * Get the shared internal-operations Postgres pool.
 * Returns null if not configured (graceful degradation, mirrors getSupabaseClient()).
 */
export function getInternalDbPool(): Pool | null {
  if (_pool) return _pool;

  if (
    (process.env.VITEST || process.env.NODE_ENV === 'test') &&
    process.env.ENABLE_INTERNAL_DB_IN_TESTS !== 'true'
  ) {
    logger.debug('Internal Postgres disabled for self-contained tests');
    return null;
  }

  const connectionString = process.env.INTERNAL_DB_URL;

  if (!connectionString) {
    if (!_hasWarnedMissingInternalDbUrl) {
      logger.warn(
        'INTERNAL_DB_URL not configured — internal-ops Postgres disabled',
      );
      _hasWarnedMissingInternalDbUrl = true;
    }
    return null;
  }

  _pool = new Pool({ connectionString });

  _pool.on('error', (err) => {
    logger.error({ err }, 'Internal Postgres pool error');
  });

  return _pool;
}

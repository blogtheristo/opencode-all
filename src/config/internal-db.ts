/**
 * Internal Postgres Pool — Tier 1 (DWS-internal operational data)
 *
 * Backs agent memory, cron/command audit logs, tool telemetry, agent nudges,
 * token usage, and other agent-ops tables that have no real end users. Runs
 * as `dws-postgres` on the DGX Spark docker-network, no host port exposed.
 * Access control is connection-level (single service role + network
 * isolation), not RLS — there is no per-user access boundary to enforce here.
 *
 * Business/customer-facing data (auth, booking, dashboards) stays on
 * Supabase via src/config/supabase.ts — this pool is additive, not a
 * replacement.
 */

import { Pool } from 'pg';
import logger from '../utils/logger.js';

let _pool: Pool | null = null;

/**
 * Get the shared internal-ops Postgres pool.
 * Returns null if not configured (graceful degradation).
 */
export function getInternalDbPool(): Pool | null {
  if (_pool) return _pool;

  if (
    (process.env.VITEST || process.env.NODE_ENV === 'test') &&
    process.env.ENABLE_INTERNAL_DB_IN_TESTS !== 'true'
  ) {
    logger.debug('Internal DB disabled for self-contained tests');
    return null;
  }

  const connectionString = process.env.INTERNAL_DATABASE_URL;

  if (!connectionString) {
    logger.warn(
      'INTERNAL_DATABASE_URL not configured — internal-ops services will use in-memory fallback',
    );
    return null;
  }

  _pool = new Pool({ connectionString });

  _pool.on('error', (err) => {
    logger.error({ err }, 'Internal DB pool error');
  });

  return _pool;
}

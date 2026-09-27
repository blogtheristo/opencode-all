/**
 * Temporal — Client Bootstrap
 *
 * Self-hosted target per DWS Cost Policy (Rule 14, DGX-first): point
 * TEMPORAL_ADDRESS at the DGX Spark deployment, not Temporal Cloud, unless a
 * sovereignty review has explicitly cleared a customer workload for it.
 *
 * Env vars:
 *   TEMPORAL_ADDRESS    — host:port of the Temporal frontend (default: localhost:7233)
 *   TEMPORAL_NAMESPACE  — namespace (default: "default")
 *   TEMPORAL_TLS        — "true" to enable TLS (default: false, for local/self-hosted)
 */
import { Client, Connection } from '@temporalio/client';
import logger from '../utils/logger.js';

let cachedClient: Client | null = null;

export function getTemporalNamespace(): string {
  return process.env.TEMPORAL_NAMESPACE || 'default';
}

export function getTemporalAddress(): string {
  return process.env.TEMPORAL_ADDRESS || 'localhost:7233';
}

/**
 * Lazily connects and caches a Temporal Client. Throws loudly if the server
 * is unreachable — callers must not silently fall back to a non-durable path
 * (that would recreate the exact gap this migration closes).
 */
export async function getTemporalClient(): Promise<Client> {
  if (cachedClient) return cachedClient;

  const address = getTemporalAddress();
  const namespace = getTemporalNamespace();

  try {
    const connection = await Connection.connect({
      address,
      tls: process.env.TEMPORAL_TLS === 'true',
    });
    cachedClient = new Client({ connection, namespace });
    logger.info('Temporal client connected', { address, namespace });
    return cachedClient;
  } catch (err) {
    logger.error('Temporal client connection failed', {
      address,
      namespace,
      error: (err as Error).message,
    });
    throw err;
  }
}

/** Test/shutdown helper — drops the cached client so a fresh connect is forced next call. */
export function resetTemporalClientCache(): void {
  cachedClient = null;
}

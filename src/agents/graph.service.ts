/**
 * Graph Service — DWS IQ 6/7
 *
 * Read-side query service for graph_facts: wraps the graph_traverse
 * Postgres function (recursive CTE) behind an allowlisted call, mirroring
 * the callDbFunction pattern in memory.service.ts. One function serves
 * both "local search" (maxHops=1: direct neighbors) and multi-hop causal
 * chains (maxHops>1) per Microsoft's GraphRAG local/global-search framing.
 *
 * Code-Version: 1.0.0
 * Owner: Lifetime Oy
 */

import type { Pool } from 'pg';
import { getInternalDbPool } from '../config/internal-db.js';
import logger from '../utils/logger.js';

export interface GraphTraversalStep {
  hop: number;
  subject: string;
  relation: string;
  object: string;
  confidence: number;
  sourceRef: string;
  path: string[];
}

export interface GraphTraverseResult {
  steps: GraphTraversalStep[];
  durationMs: number;
}

const HARD_MAX_HOPS = 5;
const DEFAULT_MAX_HOPS = 1;

/** Call the allowlisted graph_traverse Postgres function with named params. */
async function callGraphTraverse(
  pool: Pool,
  params: {
    org_filter: string;
    start_entity: string;
    max_hops: number;
    relation_filter: string | null;
  },
): Promise<Array<Record<string, unknown>>> {
  const query = `SELECT * FROM graph_traverse(
    org_filter => $1,
    start_entity => $2,
    max_hops => $3,
    relation_filter => $4
  )`;
  const values = [params.org_filter, params.start_entity, params.max_hops, params.relation_filter];
  const result = await pool.query(query, values);
  return result.rows;
}

export class GraphService {
  private pool: Pool | null = null;

  /**
   * Traverse the fact graph from an entity. maxHops=1 is "local search"
   * (direct neighbors); maxHops>1 walks a multi-hop causal chain.
   */
  async traverse(
    orgId: string,
    entity: string,
    maxHops: number = DEFAULT_MAX_HOPS,
    relationFilter?: string,
  ): Promise<GraphTraverseResult> {
    const startTime = Date.now();
    const pool = this.getPool();
    if (!pool) {
      return { steps: [], durationMs: 0 };
    }

    const boundedHops = Math.min(Math.max(1, maxHops), HARD_MAX_HOPS);

    try {
      const rows = await callGraphTraverse(pool, {
        org_filter: orgId,
        start_entity: entity,
        max_hops: boundedHops,
        relation_filter: relationFilter ?? null,
      });

      const steps: GraphTraversalStep[] = rows.map((row) => ({
        hop: row.hop as number,
        subject: row.subject as string,
        relation: row.relation as string,
        object: row.object as string,
        confidence: row.confidence as number,
        sourceRef: row.source_ref as string,
        path: row.path as string[],
      }));

      return { steps, durationMs: Date.now() - startTime };
    } catch (err) {
      logger.error('Graph traversal failed', {
        orgId,
        entity,
        maxHops: boundedHops,
        error: err instanceof Error ? err.message : String(err),
      });
      return { steps: [], durationMs: Date.now() - startTime };
    }
  }

  /** Lazy-initialize the internal Postgres pool */
  private getPool(): Pool | null {
    if (this.pool) return this.pool;
    this.pool = getInternalDbPool();
    return this.pool;
  }
}

/** Singleton instance */
export const graphService = new GraphService();

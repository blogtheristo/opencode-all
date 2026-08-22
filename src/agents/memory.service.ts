/**
 * Memory Service — DWS IQ 6/7
 *
 * Unified memory service for all AI agents. Provides store, recall, forget,
 * and profile operations using the internal Postgres pool (DGX Spark) with
 * pgvector hybrid search (vector similarity + full-text via pg_trgm).
 *
 * Inspired by Supermemory patterns: contradiction resolution via temporal
 * superseding, user/org profiles, configurable similarity thresholds,
 * and LRU cache for repeated queries.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (improve-agent-memory)
 * Date: 2026-03-22
 * Owner: Lifetime Oy
 */

import type { Pool } from 'pg';
import { getInternalDbPool } from '../config/internal-db.js';
import logger from '../utils/logger.js';
import type {
  ConsolidationResult,
  DuplicatePair,
  MemoryCacheEntry,
  MemoryForgetInput,
  MemoryForgetResult,
  MemoryItem,
  MemoryProfile,
  MemoryRecallInput,
  MemoryRecallResult,
  MemoryStoreInput,
  MemoryStoreResult,
  MemorySupersedeInput,
  MemorySupersedeResult,
  ProfileFact,
} from './memory.types.js';

// ============ SQL HELPERS ============

type DbFunctionName =
  | 'touch_memory'
  | 'hybrid_memory_search'
  | 'supersede_memory'
  | 'decay_stale_memories'
  | 'find_duplicate_memories'
  | 'find_duplicate_org_memories'
  | 'match_semantic_memories'
  | 'forget_memory'
  | 'log_memory_audit';

/**
 * Call allowlisted Postgres functions using static SQL branches.
 */
async function callDbFunction<T = Record<string, unknown>>(
  pool: Pool,
  fnName: DbFunctionName,
  params: Record<string, unknown>,
): Promise<T[]> {
  let query: string;
  let values: unknown[];

  switch (fnName) {
    case 'touch_memory':
      query = 'SELECT * FROM touch_memory(memory_id => $1)';
      values = [params.memory_id];
      break;
    case 'hybrid_memory_search':
      query = `SELECT * FROM hybrid_memory_search(
        query_text => $1,
        query_embedding => $2::vector,
        org_filter => $3,
        customer_filter => $4,
        memory_type_filter => $5,
        match_count => $6,
        similarity_threshold => $7,
        vector_weight => $8,
        text_weight => $9
      )`;
      values = [
        params.query_text,
        params.query_embedding,
        params.org_filter,
        params.customer_filter,
        params.memory_type_filter,
        params.match_count,
        params.similarity_threshold,
        params.vector_weight,
        params.text_weight,
      ];
      break;
    case 'supersede_memory':
      query = `SELECT * FROM supersede_memory(
        p_old_memory_id => $1,
        p_new_content => $2,
        p_new_confidence => $3,
        p_new_source => $4,
        p_reason => $5,
        p_agent_id => $6,
        p_agent_ats => $7,
        p_org_id => $8,
        p_customer_id => $9,
        p_new_metadata => $10
      )`;
      values = [
        params.p_old_memory_id,
        params.p_new_content,
        params.p_new_confidence,
        params.p_new_source,
        params.p_reason,
        params.p_agent_id,
        params.p_agent_ats,
        params.p_org_id,
        params.p_customer_id,
        params.p_new_metadata,
      ];
      break;
    case 'decay_stale_memories':
      query = `SELECT * FROM decay_stale_memories(
        p_half_life_days => $1,
        p_decay_threshold => $2,
        p_dry_run => $3,
        p_org_id => $4
      )`;
      values = [
        params.p_half_life_days,
        params.p_decay_threshold,
        params.p_dry_run,
        params.p_org_id,
      ];
      break;
    case 'find_duplicate_memories':
      query = `SELECT * FROM find_duplicate_memories(
        p_org_id => $1,
        p_customer_id => $2,
        p_auto_threshold => $3,
        p_review_threshold => $4,
        p_limit => $5
      )`;
      values = [
        params.p_org_id,
        params.p_customer_id,
        params.p_auto_threshold,
        params.p_review_threshold,
        params.p_limit,
      ];
      break;
    case 'find_duplicate_org_memories':
      query = `SELECT * FROM find_duplicate_org_memories(
        p_org_id => $1,
        p_auto_threshold => $2,
        p_review_threshold => $3,
        p_limit => $4
      )`;
      values = [
        params.p_org_id,
        params.p_auto_threshold,
        params.p_review_threshold,
        params.p_limit,
      ];
      break;
    case 'match_semantic_memories':
      query = `SELECT * FROM match_semantic_memories(
        query_embedding => $1::vector,
        customer_filter => $2,
        match_count => $3,
        similarity_threshold => $4
      )`;
      values = [
        params.query_embedding,
        params.customer_filter,
        params.match_count,
        params.similarity_threshold,
      ];
      break;
    case 'forget_memory':
      query = `SELECT * FROM forget_memory(
        p_memory_id => $1,
        forget_reason => $2,
        p_agent_id => $3,
        p_org_id => $4
      )`;
      values = [params.p_memory_id, params.forget_reason, params.p_agent_id, params.p_org_id];
      break;
    case 'log_memory_audit':
      query = `SELECT * FROM log_memory_audit(
        p_operation => $1,
        p_agent_id => $2,
        p_memory_id => $3,
        p_org_id => $4,
        p_metadata => $5
      )`;
      values = [params.p_operation, params.p_agent_id, params.p_memory_id, params.p_org_id, params.p_metadata];
      break;
    default: {
      const exhaustiveCheck: never = fnName;
      throw new Error(`Unsupported function: ${String(exhaustiveCheck)}`);
    }
  }

  const result = await pool.query(query, values);
  return result.rows as T[];
}

/**
 * pgvector's `vector` type expects bracket literal syntax `[v1,v2,...]`.
 * node-pg's default array serialization emits Postgres array-literal `{...}`
 * syntax instead, which the vector input function rejects — so embeddings must
 * be pre-formatted here and bound with an explicit `::vector` cast in the SQL.
 */
function toVectorLiteral(embedding: number[] | null | undefined): string | null {
  return embedding && embedding.length > 0 ? `[${embedding.join(',')}]` : null;
}

// ============ LRU CACHE ============

const CACHE_MAX_SIZE = 1000;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

class MemoryCache {
  private cache = new Map<string, MemoryCacheEntry>();

  get(key: string): MemoryRecallResult | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    entry.hitCount++;
    return entry.result;
  }

  set(key: string, result: MemoryRecallResult): void {
    // Evict oldest if at capacity
    if (this.cache.size >= CACHE_MAX_SIZE) {
      const oldest = this.cache.keys().next().value;
      if (oldest !== undefined) this.cache.delete(oldest);
    }
    this.cache.set(key, { result, cachedAt: Date.now(), hitCount: 0 });
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) this.cache.delete(key);
    }
  }
}

// ============ MEMORY SERVICE ============

export class MemoryService {
  private pool: Pool | null = null;
  private cache = new MemoryCache();
  private embeddingApiKey: string | undefined;

  constructor() {
    this.embeddingApiKey = process.env.OPENAI_API_KEY;
  }

  // ============ PUBLIC API ============

  /**
   * Store a memory. Generates embedding, checks for duplicates,
   * and persists to semantic_memories.
   */
  async store(input: MemoryStoreInput): Promise<MemoryStoreResult> {
    const pool = this.getPool();
    if (!pool) {
      return { id: '', stored: false };
    }

    // Generate embedding
    const embedding = await this.generateEmbedding(input.content);

    // Check for near-duplicates (similarity > 0.95)
    if (embedding) {
      const duplicate = await this.findDuplicate(pool, embedding, input.orgId, input.customerId);
      if (duplicate) {
        logger.debug('Memory duplicate detected', { duplicateOf: duplicate });
        // Touch the existing memory instead of creating new
        await callDbFunction(pool, 'touch_memory', { memory_id: duplicate });
        return { id: duplicate, stored: false, duplicateOf: duplicate };
      }
    }

    // Insert new memory
    let newId: string;
    try {
      const result = await pool.query(
        `INSERT INTO semantic_memories (
           content, memory_type, customer_id, org_id, embedding, metadata,
           source, confidence, access_count, created_at, accessed_at
         ) VALUES ($1, $2, $3, $4, $5::vector, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [
          input.content,
          input.memoryType,
          input.customerId || null,
          input.orgId,
          toVectorLiteral(embedding),
          input.metadata || {},
          input.source || 'agent',
          input.confidence ?? 1.0,
          0,
          new Date().toISOString(),
          new Date().toISOString(),
        ],
      );
      newId = result.rows[0].id;
    } catch (err) {
      logger.error('Failed to store memory', {
        error: err instanceof Error ? err.message : String(err),
      });
      return { id: '', stored: false };
    }

    // Invalidate cache for this org
    this.cache.invalidate(input.orgId);

    // Audit log for store operations (KYA-S §10.1)
    this.logAudit('store', input.source || 'agent', input.orgId, newId, {
      memory_type: input.memoryType,
      confidence: input.confidence ?? 1.0,
      source: input.source,
    }).catch(() => {}); // fire-and-forget, don't block store

    logger.debug('Memory stored', {
      id: newId,
      type: input.memoryType,
      orgId: input.orgId,
    });

    return { id: newId, stored: true };
  }

  /**
   * Recall memories using hybrid search (vector + text).
   * Results are cached for 5 minutes.
   */
  async recall(input: MemoryRecallInput): Promise<MemoryRecallResult> {
    const startTime = Date.now();
    const cacheKey = this.buildCacheKey(input);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return { ...cached, durationMs: Date.now() - startTime };
    }

    const pool = this.getPool();
    if (!pool) {
      return { memories: [], totalMatches: 0, searchMethod: 'hybrid', durationMs: 0 };
    }

    const embedding = await this.generateEmbedding(input.query);
    const limit = input.limit ?? 5;
    const threshold = input.similarityThreshold ?? 0.5;
    const vectorWeight = input.vectorWeight ?? 0.7;
    const textWeight = input.textWeight ?? 0.3;

    let memories: MemoryItem[];
    let searchMethod: 'vector' | 'text' | 'hybrid' = 'hybrid';

    if (embedding) {
      // Hybrid search: vector + text
      try {
        const rows = await callDbFunction(
          pool,
          'hybrid_memory_search',
          {
            query_text: input.query,
            query_embedding: toVectorLiteral(embedding),
            org_filter: input.orgId,
            customer_filter: input.customerId || null,
            memory_type_filter: input.memoryType || null,
            match_count: limit,
            similarity_threshold: threshold,
            vector_weight: vectorWeight,
            text_weight: textWeight,
          },
        );
        memories = rows.map(this.mapToMemoryItem);

        // Touch recalled memories (update access tracking)
        for (const mem of memories) {
          void callDbFunction(pool, 'touch_memory', { memory_id: mem.id });
        }
      } catch (err) {
        logger.warn('Hybrid search failed, falling back to text', {
          error: err instanceof Error ? err.message : String(err),
        });
        memories = await this.textOnlySearch(pool, input);
        searchMethod = 'text';
      }
    } else {
      // No embedding API — text-only search
      memories = await this.textOnlySearch(pool, input);
      searchMethod = 'text';
    }

    const result: MemoryRecallResult = {
      memories,
      totalMatches: memories.length,
      searchMethod,
      durationMs: Date.now() - startTime,
    };

    // Cache the result
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * Soft-delete a memory (mark expired, audit-logged).
   * Does not hard-delete — maintains audit trail for compliance.
   */
  async forget(input: MemoryForgetInput): Promise<MemoryForgetResult> {
    const pool = this.getPool();
    if (!pool) {
      return { forgotten: false };
    }

    try {
      const rows = await callDbFunction<{ forget_memory: boolean }>(pool, 'forget_memory', {
        p_memory_id: input.memoryId,
        forget_reason: input.reason,
        p_agent_id: input.agentId || 'system',
        p_org_id: input.orgId,
      });

      // Invalidate cache
      this.cache.invalidate(input.orgId);

      return { forgotten: !!rows[0]?.forget_memory };
    } catch (err) {
      logger.error('Failed to forget memory', {
        error: err instanceof Error ? err.message : String(err),
      });
      return { forgotten: false };
    }
  }

  /**
   * Build an aggregated profile from stored memories for a customer or org.
   * Target: ~50ms retrieval for cached profiles.
   */
  async getProfile(
    entityId: string,
    entityType: 'customer' | 'organization',
    _orgId: string,
  ): Promise<MemoryProfile> {
    const pool = this.getPool();
    const emptyProfile: MemoryProfile = {
      entityId,
      entityType,
      facts: [],
      recentContext: '',
      preferences: {},
      updatedAt: new Date().toISOString(),
      memoryCount: 0,
    };

    if (!pool) return emptyProfile;

    // Fetch all active memories for this entity.
    let data: Array<Record<string, unknown>>;
    try {
      const result =
        entityType === 'customer'
          ? await pool.query(
              `SELECT id, content, memory_type, metadata, confidence, source, created_at
               FROM semantic_memories
               WHERE customer_id = $1 AND expired_at IS NULL AND superseded_by IS NULL
               ORDER BY created_at DESC
               LIMIT 100`,
              [entityId],
            )
          : await pool.query(
              `SELECT id, content, memory_type, metadata, confidence, source, created_at
               FROM semantic_memories
               WHERE org_id = $1 AND expired_at IS NULL AND superseded_by IS NULL
               ORDER BY created_at DESC
               LIMIT 100`,
              [entityId],
            );
      data = result.rows;
    } catch (err) {
      logger.warn('getProfile query failed', {
        error: err instanceof Error ? err.message : String(err),
      });
      return emptyProfile;
    }

    if (data.length === 0) {
      return emptyProfile;
    }

    // Extract facts from knowledge/fact type memories
    const facts: ProfileFact[] = data
      .filter(
        (m: Record<string, unknown>) => m.memory_type === 'fact' || m.memory_type === 'knowledge',
      )
      .map((m: Record<string, unknown>) => ({
        subject: ((m.metadata as Record<string, unknown>)?.subject as string) || entityId,
        predicate: ((m.metadata as Record<string, unknown>)?.predicate as string) || 'knows',
        value: m.content as string,
        confidence: m.confidence as number,
        source: (m.source as string) || 'unknown',
        lastUpdated: m.created_at as string,
      }));

    // Extract preferences
    const preferences: Record<string, unknown> = {};
    for (const m of data.filter((m: Record<string, unknown>) => m.memory_type === 'preference')) {
      const meta = m.metadata as Record<string, unknown>;
      const key = (meta?.key as string) || 'general';
      preferences[key] = m.content;
    }

    // Recent context from episodes
    const episodes = data
      .filter((m: Record<string, unknown>) => m.memory_type === 'episode')
      .slice(0, 5);
    const recentContext = episodes.map((e: Record<string, unknown>) => e.content).join(' | ');

    return {
      entityId,
      entityType,
      facts,
      recentContext,
      preferences,
      updatedAt: new Date().toISOString(),
      memoryCount: data.length,
    };
  }

  /**
   * Supersede a memory with newer information (temporal contradiction resolution).
   * Implements KYA-S §10.2: confidence_delta > 0.3 triggers human review hard gate.
   */
  async supersede(input: MemorySupersedeInput): Promise<MemorySupersedeResult> {
    const pool = this.getPool();
    if (!pool) {
      return {
        newMemoryId: null,
        requiresReview: false,
        confidenceDelta: 0,
        kyaDecision: 'error: internal Postgres not configured',
      };
    }

    let rows: Array<{
      new_memory_id: string | null;
      requires_review: boolean;
      confidence_delta: number;
      kya_decision: string;
    }>;
    try {
      rows = await callDbFunction(pool, 'supersede_memory', {
        p_old_memory_id: input.oldMemoryId,
        p_new_content: input.newContent,
        p_new_confidence: input.newConfidence ?? 1.0,
        p_new_source: input.newSource || 'agent',
        p_reason: input.reason || 'temporal_supersede',
        p_agent_id: input.agentId || 'system',
        p_agent_ats: input.agentAts ?? null,
        p_org_id: input.orgId,
        p_customer_id: input.customerId || null,
        p_new_metadata: input.metadata || {},
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      logger.error('Failed to supersede memory', { error: msg });
      return {
        newMemoryId: null,
        requiresReview: false,
        confidenceDelta: 0,
        kyaDecision: `error: ${msg}`,
      };
    }

    const row = rows[0];
    const result: MemorySupersedeResult = {
      newMemoryId: row?.new_memory_id || null,
      requiresReview: row?.requires_review || false,
      confidenceDelta: row?.confidence_delta || 0,
      kyaDecision: row?.kya_decision || 'unknown',
    };

    // Invalidate cache for this org
    this.cache.invalidate(input.orgId);

    if (result.requiresReview) {
      logger.warn('Memory supersede requires human review', {
        oldMemoryId: input.oldMemoryId,
        confidenceDelta: result.confidenceDelta,
        kyaDecision: result.kyaDecision,
      });
    } else {
      logger.info('Memory superseded', {
        oldMemoryId: input.oldMemoryId,
        newMemoryId: result.newMemoryId,
        kyaDecision: result.kyaDecision,
      });
    }

    return result;
  }

  /**
   * Log an audit entry for memory operations (store, extract).
   * Forget and supersede are logged by their respective RPC functions.
   */
  async logAudit(
    operation: 'store' | 'extract',
    agentId: string,
    orgId: string,
    memoryId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<string | null> {
    const pool = this.getPool();
    if (!pool) return null;

    try {
      const rows = await callDbFunction<{ log_memory_audit: string }>(pool, 'log_memory_audit', {
        p_operation: operation,
        p_agent_id: agentId,
        p_memory_id: memoryId || null,
        p_org_id: orgId,
        p_metadata: metadata || {},
      });
      return rows[0]?.log_memory_audit ?? null;
    } catch (err) {
      logger.warn('Failed to log memory audit', {
        error: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }

  /**
   * Run confidence decay on stale memories and forget those below threshold.
   * Implements time-based decay: confidence * (halfLife / (halfLife + daysSinceAccess))
   * Memories below threshold are auto-forgotten with 'decay-cron' agent attribution.
   */
  async decayStaleMemories(options?: {
    halfLifeDays?: number;
    decayThreshold?: number;
    dryRun?: boolean;
    orgId?: string;
  }): Promise<{
    decayedCount: number;
    forgottenCount: number;
    forgottenIds: string[];
    dryRun: boolean;
  }> {
    const pool = this.getPool();
    if (!pool) {
      return { decayedCount: 0, forgottenCount: 0, forgottenIds: [], dryRun: true };
    }

    const halfLifeDays = options?.halfLifeDays ?? 90;
    const decayThreshold = options?.decayThreshold ?? 0.1;
    const dryRun = options?.dryRun ?? false;
    const orgId = options?.orgId ?? null;

    let rows: Array<{
      memory_id: string;
      org_id: string;
      old_confidence: number;
      new_confidence: number;
      below_threshold: boolean;
    }>;
    try {
      rows = await callDbFunction(pool, 'decay_stale_memories', {
        p_half_life_days: halfLifeDays,
        p_decay_threshold: decayThreshold,
        p_dry_run: dryRun,
        p_org_id: orgId,
      });
    } catch (err) {
      logger.error('Failed to run decay', {
        error: err instanceof Error ? err.message : String(err),
      });
      return { decayedCount: 0, forgottenCount: 0, forgottenIds: [], dryRun };
    }

    const belowThreshold = rows.filter((r) => r.below_threshold);
    const forgottenIds: string[] = [];

    // Auto-forget memories below threshold (unless dry run)
    if (!dryRun) {
      for (const row of belowThreshold) {
        const result = await this.forget({
          memoryId: row.memory_id,
          orgId: row.org_id,
          reason: `confidence_decay: ${row.new_confidence.toFixed(3)} < ${decayThreshold}`,
          agentId: 'decay-cron',
        });
        if (result.forgotten) {
          forgottenIds.push(row.memory_id);
        }
      }
    }

    logger.info('Memory decay run complete', {
      decayedCount: rows.length,
      forgottenCount: forgottenIds.length,
      dryRun,
      orgId,
    });

    return {
      decayedCount: rows.length,
      forgottenCount: forgottenIds.length,
      forgottenIds,
      dryRun,
    };
  }

  /**
   * Find and consolidate near-duplicate memories for a specific customer.
   * GDPR Art 5 compliant: orgId and customerId are mandatory, non-nullable.
   * Cross-customer comparison is structurally impossible.
   *
   * Auto-consolidates pairs with similarity >= 0.92 via supersede().
   * Flags pairs in 0.80–0.92 range for human review.
   */
  async consolidateDuplicates(
    orgId: string,
    customerId: string,
    options?: {
      dryRun?: boolean;
      autoThreshold?: number;
      reviewThreshold?: number;
      limit?: number;
    },
  ): Promise<ConsolidationResult> {
    return this.runConsolidation(
      'find_duplicate_memories',
      {
        p_org_id: orgId,
        p_customer_id: customerId,
        p_auto_threshold: options?.autoThreshold ?? 0.92,
        p_review_threshold: options?.reviewThreshold ?? 0.8,
        p_limit: options?.limit ?? 500,
      },
      orgId,
      options?.dryRun ?? false,
    );
  }

  /**
   * Find and consolidate near-duplicate org-level memories (customer_id IS NULL).
   * Separate method to make the scoping explicit — no optional customer param.
   */
  async consolidateOrgDuplicates(
    orgId: string,
    options?: {
      dryRun?: boolean;
      autoThreshold?: number;
      reviewThreshold?: number;
      limit?: number;
    },
  ): Promise<ConsolidationResult> {
    return this.runConsolidation(
      'find_duplicate_org_memories',
      {
        p_org_id: orgId,
        p_auto_threshold: options?.autoThreshold ?? 0.92,
        p_review_threshold: options?.reviewThreshold ?? 0.8,
        p_limit: options?.limit ?? 500,
      },
      orgId,
      options?.dryRun ?? false,
    );
  }

  // ============ PRIVATE HELPERS ============

  /** Shared consolidation logic for customer-scoped and org-scoped dedup */
  private async runConsolidation(
    rpcName: 'find_duplicate_memories' | 'find_duplicate_org_memories',
    rpcParams: Record<string, unknown>,
    orgId: string,
    dryRun: boolean,
  ): Promise<ConsolidationResult> {
    const pool = this.getPool();
    if (!pool) {
      return {
        pairsFound: 0,
        autoConsolidated: 0,
        flaggedForReview: 0,
        blockedByKya: 0,
        pairs: [],
        dryRun: true,
      };
    }

    let rows: Array<{
      memory_a_id: string;
      memory_b_id: string;
      content_a: string;
      content_b: string;
      confidence_a: number;
      confidence_b: number;
      cosine_similarity: number;
      needs_review: boolean;
      keep_id: string;
      supersede_id: string;
    }>;
    try {
      if (rpcName === 'find_duplicate_memories') {
        rows = await callDbFunction(pool, 'find_duplicate_memories', rpcParams);
      } else {
        rows = await callDbFunction(pool, 'find_duplicate_org_memories', rpcParams);
      }
    } catch (err) {
      logger.error('Consolidation scan failed', {
        error: err instanceof Error ? err.message : String(err),
        rpcName,
      });
      return {
        pairsFound: 0,
        autoConsolidated: 0,
        flaggedForReview: 0,
        blockedByKya: 0,
        pairs: [],
        dryRun,
      };
    }

    const pairs: DuplicatePair[] = rows.map((r) => ({
      memoryAId: r.memory_a_id,
      memoryBId: r.memory_b_id,
      contentA: r.content_a,
      contentB: r.content_b,
      confidenceA: r.confidence_a,
      confidenceB: r.confidence_b,
      cosineSimilarity: r.cosine_similarity,
      needsReview: r.needs_review,
      keepId: r.keep_id,
      supersedeId: r.supersede_id,
    }));

    let autoConsolidated = 0;
    let flaggedForReview = 0;
    let blockedByKya = 0;

    for (const pair of pairs) {
      if (pair.needsReview) {
        flaggedForReview++;
        continue;
      }

      if (dryRun) {
        autoConsolidated++;
        continue;
      }

      // Auto-consolidate via supersede (inherits confidence_delta hard gate)
      const keepContent = pair.keepId === pair.memoryAId ? pair.contentA : pair.contentB;
      const result = await this.supersede({
        oldMemoryId: pair.supersedeId,
        newContent: keepContent,
        orgId,
        newConfidence: Math.max(pair.confidenceA, pair.confidenceB),
        newSource: 'consolidation-cron',
        reason: `duplicate_consolidation: cosine_similarity=${pair.cosineSimilarity.toFixed(3)}`,
        agentId: 'consolidation-cron',
      });

      if (result.requiresReview) {
        blockedByKya++;
      } else if (result.newMemoryId) {
        // Keep exactly one active canonical row: mark the previously kept source row
        // as superseded by the new canonical memory returned by supersede_memory.
        try {
          await pool.query(
            `UPDATE semantic_memories
             SET superseded_by = $1
             WHERE id = $2 AND org_id = $3 AND superseded_by IS NULL`,
            [result.newMemoryId, pair.keepId, orgId],
          );
        } catch (err) {
          logger.warn('Consolidation keep-row supersede update failed', {
            pairKeepId: pair.keepId,
            newMemoryId: result.newMemoryId,
            error: err instanceof Error ? err.message : String(err),
          });
        }
        autoConsolidated++;
      }
    }

    logger.info('Consolidation run complete', {
      pairsFound: pairs.length,
      autoConsolidated,
      flaggedForReview,
      blockedByKya,
      dryRun,
    });

    // Log consolidation run to audit
    this.logAudit('extract', 'consolidation-cron', orgId, undefined, {
      operation: 'consolidation_run',
      pairs_found: pairs.length,
      auto_consolidated: autoConsolidated,
      flagged_for_review: flaggedForReview,
      blocked_by_kya: blockedByKya,
      dry_run: dryRun,
    }).catch(() => {});

    return {
      pairsFound: pairs.length,
      autoConsolidated,
      flaggedForReview,
      blockedByKya,
      pairs,
      dryRun,
    };
  }

  /** Generate embedding using OpenAI text-embedding-3-small */
  private async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.embeddingApiKey) {
      logger.debug('No OPENAI_API_KEY — skipping embedding generation');
      return null;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.embeddingApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text.slice(0, 8000), // Limit input length
          model: 'text-embedding-3-small',
        }),
      });

      if (!response.ok) {
        logger.warn('Embedding API error', { status: response.status });
        return null;
      }

      const data = (await response.json()) as {
        data: Array<{ embedding: number[] }>;
      };
      return data.data[0].embedding;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.warn('Failed to generate embedding', { error: msg });
      return null;
    }
  }

  /** Find a near-duplicate memory (cosine similarity > 0.95) */
  private async findDuplicate(
    pool: Pool,
    embedding: number[],
    orgId: string,
    customerId?: string,
  ): Promise<string | null> {
    try {
      const rows = await callDbFunction<{ id: string; metadata: Record<string, unknown> }>(
        pool,
        'match_semantic_memories',
        {
          query_embedding: toVectorLiteral(embedding),
          customer_filter: customerId || null,
          match_count: 1,
          similarity_threshold: 0.95,
        },
      );

      if (rows.length > 0) {
        // Verify org isolation
        const match = rows[0];
        if (match.metadata?.org_id === orgId || !match.metadata?.org_id) {
          return match.id;
        }
      }
    } catch (err) {
      logger.debug('match_semantic_memories query failed (treating as no duplicate)', {
        error: err instanceof Error ? err.message : String(err),
      });
    }
    return null;
  }

  /** Fallback: text-only search using PostgreSQL full-text search (websearch_to_tsquery) */
  private async textOnlySearch(pool: Pool, input: MemoryRecallInput): Promise<MemoryItem[]> {
    const hasCustomerId = Boolean(input.customerId);
    const hasMemoryType = Boolean(input.memoryType);
    const limit = input.limit ?? 5;
    let data: Array<Record<string, unknown>>;
    try {
      const result =
        hasCustomerId && hasMemoryType
          ? await pool.query(
              `SELECT * FROM semantic_memories
               WHERE expired_at IS NULL
                 AND superseded_by IS NULL
                 AND org_id = $1
                 AND to_tsvector('english', content) @@ websearch_to_tsquery('english', $2)
                 AND customer_id = $3
                 AND memory_type = $4
               LIMIT $5`,
              [input.orgId, input.query, input.customerId, input.memoryType, limit],
            )
          : hasCustomerId
            ? await pool.query(
                `SELECT * FROM semantic_memories
                 WHERE expired_at IS NULL
                   AND superseded_by IS NULL
                   AND org_id = $1
                   AND to_tsvector('english', content) @@ websearch_to_tsquery('english', $2)
                   AND customer_id = $3
                 LIMIT $4`,
                [input.orgId, input.query, input.customerId, limit],
              )
            : hasMemoryType
              ? await pool.query(
                  `SELECT * FROM semantic_memories
                   WHERE expired_at IS NULL
                     AND superseded_by IS NULL
                     AND org_id = $1
                     AND to_tsvector('english', content) @@ websearch_to_tsquery('english', $2)
                     AND memory_type = $3
                   LIMIT $4`,
                  [input.orgId, input.query, input.memoryType, limit],
                )
              : await pool.query(
                  `SELECT * FROM semantic_memories
                   WHERE expired_at IS NULL
                     AND superseded_by IS NULL
                     AND org_id = $1
                     AND to_tsvector('english', content) @@ websearch_to_tsquery('english', $2)
                   LIMIT $3`,
                  [input.orgId, input.query, limit],
                );
      data = result.rows;
    } catch (err) {
      logger.warn('Text search failed', {
        error: err instanceof Error ? err.message : String(err),
      });
      return [];
    }

    return data.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      customerId: row.customer_id as string | undefined,
      orgId: row.org_id as string,
      memoryType: row.memory_type as MemoryItem['memoryType'],
      content: row.content as string,
      similarity: undefined,
      metadata: (row.metadata || {}) as Record<string, unknown>,
      createdAt: row.created_at as string,
      accessedAt: row.accessed_at as string | undefined,
      accessCount: (row.access_count as number) || 0,
      confidence: (row.confidence as number) || 1.0,
      source: row.source as string | undefined,
    }));
  }

  /** Map a hybrid search row to MemoryItem */
  private mapToMemoryItem(row: Record<string, unknown>): MemoryItem {
    return {
      id: row.id as string,
      customerId: row.customer_id as string | undefined,
      orgId: row.org_id as string,
      memoryType: row.memory_type as MemoryItem['memoryType'],
      content: row.content as string,
      similarity: row.combined_score as number | undefined,
      metadata: (row.metadata || {}) as Record<string, unknown>,
      createdAt: row.created_at as string,
      accessCount: (row.access_count as number) || 0,
      confidence: (row.confidence as number) || 1.0,
    };
  }

  /** Build a cache key from recall input */
  private buildCacheKey(input: MemoryRecallInput): string {
    return `${input.orgId}:${input.customerId || ''}:${input.memoryType || ''}:${input.query.slice(0, 100)}`;
  }

  /** Lazy-initialize the internal Postgres pool */
  private getPool(): Pool | null {
    if (this.pool) return this.pool;
    this.pool = getInternalDbPool();
    return this.pool;
  }
}

/** Singleton instance */
export const memoryService = new MemoryService();

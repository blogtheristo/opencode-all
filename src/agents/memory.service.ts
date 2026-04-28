/**
 * Memory Service — DWS IQ 6/7
 *
 * Unified memory service for all AI agents. Provides store, recall, forget,
 * and profile operations using Supabase/pgVector with hybrid search
 * (vector similarity + full-text via pg_trgm).
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

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import type {
  MemoryItem,
  MemoryStoreInput,
  MemoryStoreResult,
  MemoryRecallInput,
  MemoryRecallResult,
  MemoryForgetInput,
  MemoryForgetResult,
  MemorySupersedeInput,
  MemorySupersedeResult,
  MemoryProfile,
  MemoryCacheEntry,
  ProfileFact,
  DuplicatePair,
  ConsolidationResult,
} from './memory.types.js';

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
  private supabase: SupabaseClient | null = null;
  private cache = new MemoryCache();
  private embeddingApiKey: string | undefined;

  constructor() {
    this.embeddingApiKey = process.env.OPENAI_API_KEY;
  }

  // ============ PUBLIC API ============

  /**
   * Store a memory. Generates embedding, checks for duplicates,
   * and persists to Supabase semantic_memories.
   */
  async store(input: MemoryStoreInput): Promise<MemoryStoreResult> {
    const client = this.getClient();
    if (!client) {
      return { id: '', stored: false };
    }

    // Generate embedding
    const embedding = await this.generateEmbedding(input.content);

    // Check for near-duplicates (similarity > 0.95)
    if (embedding) {
      const duplicate = await this.findDuplicate(client, embedding, input.orgId, input.customerId);
      if (duplicate) {
        logger.debug('Memory duplicate detected', { duplicateOf: duplicate });
        // Touch the existing memory instead of creating new
        await client.rpc('touch_memory', { memory_id: duplicate });
        return { id: duplicate, stored: false, duplicateOf: duplicate };
      }
    }

    // Insert new memory
    const record = {
      content: input.content,
      memory_type: input.memoryType,
      customer_id: input.customerId || null,
      org_id: input.orgId,
      embedding,
      metadata: input.metadata || {},
      source: input.source || 'agent',
      confidence: input.confidence ?? 1.0,
      access_count: 0,
      created_at: new Date().toISOString(),
      accessed_at: new Date().toISOString(),
    };

    const { data, error } = await client
      .from('semantic_memories')
      .insert(record)
      .select('id')
      .single();

    if (error) {
      logger.error('Failed to store memory', { error: error.message });
      return { id: '', stored: false };
    }

    // Invalidate cache for this org
    this.cache.invalidate(input.orgId);

    // Audit log for store operations (KYA-S §10.1)
    this.logAudit('store', input.source || 'agent', input.orgId, data.id, {
      memory_type: input.memoryType,
      confidence: input.confidence ?? 1.0,
      source: input.source,
    }).catch(() => {}); // fire-and-forget, don't block store

    logger.debug('Memory stored', {
      id: data.id,
      type: input.memoryType,
      orgId: input.orgId,
    });

    return { id: data.id, stored: true };
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

    const client = this.getClient();
    if (!client) {
      return { memories: [], totalMatches: 0, searchMethod: 'hybrid', durationMs: 0 };
    }

    const embedding = await this.generateEmbedding(input.query);
    const limit = input.limit ?? 5;
    const threshold = input.similarityThreshold ?? 0.5;
    const vectorWeight = input.vectorWeight ?? 0.7;
    const textWeight = input.textWeight ?? 0.3;

    let memories: MemoryItem[] = [];
    let searchMethod: 'vector' | 'text' | 'hybrid' = 'hybrid';

    if (embedding) {
      // Hybrid search: vector + text
      const { data, error } = await client.rpc('hybrid_memory_search', {
        query_text: input.query,
        query_embedding: embedding,
        org_filter: input.orgId,
        customer_filter: input.customerId || null,
        memory_type_filter: input.memoryType || null,
        match_count: limit,
        similarity_threshold: threshold,
        vector_weight: vectorWeight,
        text_weight: textWeight,
      });

      if (error) {
        logger.warn('Hybrid search failed, falling back to text', { error: error.message });
        memories = await this.textOnlySearch(client, input);
        searchMethod = 'text';
      } else {
        memories = (data || []).map(this.mapToMemoryItem);

        // Touch recalled memories (update access tracking)
        for (const mem of memories) {
          void client.rpc('touch_memory', { memory_id: mem.id });
        }
      }
    } else {
      // No embedding API — text-only search
      memories = await this.textOnlySearch(client, input);
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
    const client = this.getClient();
    if (!client) {
      return { forgotten: false };
    }

    const { data, error } = await client.rpc('forget_memory', {
      p_memory_id: input.memoryId,
      forget_reason: input.reason,
      p_agent_id: input.agentId || 'system',
      p_org_id: input.orgId,
    });

    if (error) {
      logger.error('Failed to forget memory', { error: error.message });
      return { forgotten: false };
    }

    // Invalidate cache
    this.cache.invalidate(input.orgId);

    return { forgotten: !!data };
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
    const client = this.getClient();
    const emptyProfile: MemoryProfile = {
      entityId,
      entityType,
      facts: [],
      recentContext: '',
      preferences: {},
      updatedAt: new Date().toISOString(),
      memoryCount: 0,
    };

    if (!client) return emptyProfile;

    // Fetch all active memories for this entity
    const column = entityType === 'customer' ? 'customer_id' : 'org_id';
    const { data, error } = await client
      .from('semantic_memories')
      .select('id, content, memory_type, metadata, confidence, source, created_at')
      .eq(column, entityId)
      .is('expired_at', null)
      .is('superseded_by', null)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error || !data || data.length === 0) {
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
    const client = this.getClient();
    if (!client) {
      return {
        newMemoryId: null,
        requiresReview: false,
        confidenceDelta: 0,
        kyaDecision: 'error: supabase not configured',
      };
    }

    const { data, error } = await client.rpc('supersede_memory', {
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

    if (error) {
      logger.error('Failed to supersede memory', { error: error.message });
      return {
        newMemoryId: null,
        requiresReview: false,
        confidenceDelta: 0,
        kyaDecision: `error: ${error.message}`,
      };
    }

    const row = Array.isArray(data) ? data[0] : data;
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
    const client = this.getClient();
    if (!client) return null;

    const { data, error } = await client.rpc('log_memory_audit', {
      p_operation: operation,
      p_agent_id: agentId,
      p_memory_id: memoryId || null,
      p_org_id: orgId,
      p_metadata: metadata || {},
    });

    if (error) {
      logger.warn('Failed to log memory audit', { error: error.message });
      return null;
    }

    return data as string;
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
    const client = this.getClient();
    if (!client) {
      return { decayedCount: 0, forgottenCount: 0, forgottenIds: [], dryRun: true };
    }

    const halfLifeDays = options?.halfLifeDays ?? 90;
    const decayThreshold = options?.decayThreshold ?? 0.1;
    const dryRun = options?.dryRun ?? false;
    const orgId = options?.orgId ?? null;

    const { data, error } = await client.rpc('decay_stale_memories', {
      p_half_life_days: halfLifeDays,
      p_decay_threshold: decayThreshold,
      p_dry_run: dryRun,
      p_org_id: orgId,
    });

    if (error) {
      logger.error('Failed to run decay', { error: error.message });
      return { decayedCount: 0, forgottenCount: 0, forgottenIds: [], dryRun };
    }

    const rows = (Array.isArray(data) ? data : []) as Array<{
      memory_id: string;
      org_id: string;
      old_confidence: number;
      new_confidence: number;
      below_threshold: boolean;
    }>;

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
    rpcName: string,
    rpcParams: Record<string, unknown>,
    orgId: string,
    dryRun: boolean,
  ): Promise<ConsolidationResult> {
    const client = this.getClient();
    if (!client) {
      return {
        pairsFound: 0,
        autoConsolidated: 0,
        flaggedForReview: 0,
        blockedByKya: 0,
        pairs: [],
        dryRun: true,
      };
    }

    const { data, error } = await client.rpc(rpcName, rpcParams);

    if (error) {
      logger.error('Consolidation scan failed', { error: error.message, rpcName });
      return {
        pairsFound: 0,
        autoConsolidated: 0,
        flaggedForReview: 0,
        blockedByKya: 0,
        pairs: [],
        dryRun,
      };
    }

    const rows = (data || []) as Array<{
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
        const { error: keepSupersedeError } = await client
          .from('semantic_memories')
          .update({ superseded_by: result.newMemoryId })
          .eq('id', pair.keepId)
          .eq('org_id', orgId)
          .is('superseded_by', null);

        if (keepSupersedeError) {
          logger.warn('Consolidation keep-row supersede update failed', {
            pairKeepId: pair.keepId,
            newMemoryId: result.newMemoryId,
            error: keepSupersedeError.message,
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
    client: SupabaseClient,
    embedding: number[],
    orgId: string,
    customerId?: string,
  ): Promise<string | null> {
    const { data } = await client.rpc('match_semantic_memories', {
      query_embedding: embedding,
      customer_filter: customerId || null,
      match_count: 1,
      similarity_threshold: 0.95,
    });

    if (data && data.length > 0) {
      // Verify org isolation
      const match = data[0];
      if (match.metadata?.org_id === orgId || !match.metadata?.org_id) {
        return match.id;
      }
    }
    return null;
  }

  /** Fallback: text-only search using pg_trgm similarity */
  private async textOnlySearch(
    client: SupabaseClient,
    input: MemoryRecallInput,
  ): Promise<MemoryItem[]> {
    let query = client
      .from('semantic_memories')
      .select('*')
      .is('expired_at', null)
      .is('superseded_by', null)
      .eq('org_id', input.orgId)
      .textSearch('content', input.query, { type: 'websearch' })
      .limit(input.limit ?? 5);

    if (input.customerId) {
      query = query.eq('customer_id', input.customerId);
    }
    if (input.memoryType) {
      query = query.eq('memory_type', input.memoryType);
    }

    const { data, error } = await query;
    if (error) {
      logger.warn('Text search failed', { error: error.message });
      return [];
    }

    return (data || []).map((row: Record<string, unknown>) => ({
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

  /** Lazy-initialize Supabase client */
  private getClient(): SupabaseClient | null {
    if (this.supabase) return this.supabase;

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) return null;

    this.supabase = createClient(url, key);
    return this.supabase;
  }
}

/** Singleton instance */
export const memoryService = new MemoryService();

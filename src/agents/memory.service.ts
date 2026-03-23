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
      const duplicate = await this.findDuplicate(
        client, embedding, input.orgId, input.customerId,
      );
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
          client.rpc('touch_memory', { memory_id: mem.id }).catch(() => {});
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
      memory_id: input.memoryId,
      forget_reason: input.reason,
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
    orgId: string,
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
      .filter((m: Record<string, unknown>) =>
        m.memory_type === 'fact' || m.memory_type === 'knowledge'
      )
      .map((m: Record<string, unknown>) => ({
        subject: (m.metadata as Record<string, unknown>)?.subject as string || entityId,
        predicate: (m.metadata as Record<string, unknown>)?.predicate as string || 'knows',
        value: m.content as string,
        confidence: m.confidence as number,
        source: m.source as string || 'unknown',
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
    const recentContext = episodes
      .map((e: Record<string, unknown>) => e.content)
      .join(' | ');

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

  // ============ PRIVATE HELPERS ============

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
          'Authorization': `Bearer ${this.embeddingApiKey}`,
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

      const data = await response.json() as {
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

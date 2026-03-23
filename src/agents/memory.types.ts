/**
 * Memory System Types — DWS IQ 6/7
 *
 * Type definitions for the unified memory service that provides
 * store, recall, forget, and profile operations across all memory types.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (improve-agent-memory)
 * Date: 2026-03-22
 * Owner: Lifetime Oy
 */

// ============ MEMORY ITEMS ============

/** A single memory item stored in Supabase */
export interface MemoryItem {
  id: string;
  customerId?: string;
  orgId: string;
  memoryType: MemoryType;
  content: string;
  /** Pre-computed embedding vector (1536-dim, text-embedding-3-small) */
  embedding?: number[];
  /** Similarity score from search (0-1, higher = more similar) */
  similarity?: number;
  /** Structured metadata (source, tags, etc.) */
  metadata: Record<string, unknown>;
  /** When this memory was created */
  createdAt: string;
  /** When this memory was last accessed */
  accessedAt?: string;
  /** Number of times this memory has been accessed */
  accessCount: number;
  /** Confidence score (0-1), decays over time if unused */
  confidence: number;
  /** Source of this memory */
  source?: string;
}

/** Supported memory types */
export type MemoryType =
  | 'preference'
  | 'knowledge'
  | 'procedure'
  | 'episode'
  | 'fact'
  | 'profile';

// ============ STORE OPERATIONS ============

/** Input for storing a new memory */
export interface MemoryStoreInput {
  /** Content text to store */
  content: string;
  /** Memory type classification */
  memoryType: MemoryType;
  /** Customer ID (optional, for customer-scoped memories) */
  customerId?: string;
  /** Organization ID for tenant isolation */
  orgId: string;
  /** Metadata tags */
  metadata?: Record<string, unknown>;
  /** Source identifier (e.g., 'conversation', 'document', 'manual') */
  source?: string;
  /** Confidence level (0-1, default 1.0) */
  confidence?: number;
}

/** Result of a store operation */
export interface MemoryStoreResult {
  id: string;
  stored: boolean;
  /** If a duplicate/similar memory was found, its ID */
  duplicateOf?: string;
  /** If this memory supersedes an older one */
  supersedes?: string;
}

// ============ RECALL OPERATIONS ============

/** Input for recalling memories (hybrid search) */
export interface MemoryRecallInput {
  /** Natural language query */
  query: string;
  /** Filter by memory type */
  memoryType?: MemoryType;
  /** Filter by customer */
  customerId?: string;
  /** Organization ID for tenant isolation */
  orgId: string;
  /** Maximum results to return (default: 5) */
  limit?: number;
  /** Minimum similarity threshold (default: 0.5) */
  similarityThreshold?: number;
  /** Weight for vector search (0-1, default: 0.7) */
  vectorWeight?: number;
  /** Weight for text search (0-1, default: 0.3) */
  textWeight?: number;
}

/** Result of a recall operation */
export interface MemoryRecallResult {
  memories: MemoryItem[];
  /** Total memories matched before limit */
  totalMatches: number;
  /** Search method used */
  searchMethod: 'vector' | 'text' | 'hybrid';
  /** Time taken in ms */
  durationMs: number;
}

// ============ FORGET OPERATIONS ============

/** Input for forgetting (soft-deleting) a memory */
export interface MemoryForgetInput {
  /** Memory ID to forget */
  memoryId: string;
  /** Organization ID for tenant isolation */
  orgId: string;
  /** Reason for forgetting (audit trail) */
  reason: string;
}

/** Result of a forget operation */
export interface MemoryForgetResult {
  forgotten: boolean;
  /** Audit log entry ID */
  auditId?: string;
}

// ============ USER/ORG PROFILE ============

/** Aggregated profile built from memories */
export interface MemoryProfile {
  /** Customer or org identifier */
  entityId: string;
  entityType: 'customer' | 'organization';
  /** Static facts (e.g., industry, location, certifications) */
  facts: ProfileFact[];
  /** Recent interaction summary */
  recentContext: string;
  /** Preferences extracted from memories */
  preferences: Record<string, unknown>;
  /** Last updated timestamp */
  updatedAt: string;
  /** Total memories contributing to this profile */
  memoryCount: number;
}

/** A single fact in a profile */
export interface ProfileFact {
  subject: string;
  predicate: string;
  value: string;
  confidence: number;
  source: string;
  lastUpdated: string;
}

// ============ FACT EXTRACTION ============

/** A single extracted fact triple (subject-predicate-value) */
export interface ExtractedFact {
  /** Entity the fact is about (e.g., "ACME Corp", "user", "project") */
  subject: string;
  /** Relationship/attribute (e.g., "is_located_in", "has_employee_count", "prefers") */
  predicate: string;
  /** The fact value (e.g., "Helsinki", "250", "dark mode") */
  value: string;
  /** Extraction confidence 0-1 */
  confidence: number;
  /** Category for grouping facts */
  category: 'identity' | 'preference' | 'relationship' | 'metric' | 'status' | 'other';
}

/** Input for fact extraction from text */
export interface FactExtractionInput {
  /** Text to extract facts from (conversation, document, etc.) */
  text: string;
  /** Organization ID for tenant isolation */
  orgId: string;
  /** Optional customer ID to scope extracted facts */
  customerId?: string;
  /** Source identifier (e.g., "conversation", "email", "document") */
  source?: string;
  /** Whether to store extracted facts as memories (default: true) */
  persist?: boolean;
  /** Minimum confidence to persist a fact (default: 0.7) */
  minConfidence?: number;
}

/** Result of a fact extraction operation */
export interface FactExtractionResult {
  /** All extracted facts */
  facts: ExtractedFact[];
  /** Number of facts persisted as memories */
  persisted: number;
  /** Number of facts skipped (below confidence threshold or duplicates) */
  skipped: number;
  /** IDs of stored memory items */
  memoryIds: string[];
  /** Processing time in ms */
  durationMs: number;
}

// ============ CACHE ============

/** LRU cache entry for recall results */
export interface MemoryCacheEntry {
  result: MemoryRecallResult;
  cachedAt: number;
  hitCount: number;
}

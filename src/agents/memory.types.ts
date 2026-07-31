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
  /** Agent performing the forget (audit attribution, KYA-S §10.4) */
  agentId?: string;
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

// ============ SUPERSEDE (CONTRADICTION RESOLUTION) ============

/** Input for superseding a memory (temporal contradiction resolution) */
export interface MemorySupersedeInput {
  /** ID of the memory being replaced */
  oldMemoryId: string;
  /** New content that supersedes the old */
  newContent: string;
  /** Organization ID for tenant isolation */
  orgId: string;
  /** Customer ID (optional) */
  customerId?: string;
  /** Confidence of new memory (0-1, default 1.0) */
  newConfidence?: number;
  /** Source of new information */
  newSource?: string;
  /** Reason for superseding */
  reason?: string;
  /** Agent performing the supersede */
  agentId?: string;
  /** Agent Trust Score at time of supersede */
  agentAts?: number;
  /** Metadata for new memory */
  metadata?: Record<string, unknown>;
}

/** Result of a supersede operation */
export interface MemorySupersedeResult {
  /** ID of newly created memory (null if requires review) */
  newMemoryId: string | null;
  /** Whether human review is required (confidence_delta > 0.3) */
  requiresReview: boolean;
  /** Absolute difference in confidence scores */
  confidenceDelta: number;
  /** KYA governance decision */
  kyaDecision: string;
}

/** An entry in the memory_audit_log table */
export interface MemoryAuditEntry {
  id: string;
  operation: 'store' | 'supersede' | 'forget' | 'extract';
  agentId: string;
  agentAts?: number;
  memoryId?: string;
  oldMemoryId?: string;
  orgId: string;
  customerId?: string;
  reason?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

// ============ CONSOLIDATION (NEAR-DUPLICATE DETECTION) ============

/** A pair of near-duplicate memories found by consolidation scan */
export interface DuplicatePair {
  memoryAId: string;
  memoryBId: string;
  contentA: string;
  contentB: string;
  confidenceA: number;
  confidenceB: number;
  cosineSimilarity: number;
  /** true if similarity is in grey zone (0.80–0.92) and needs human review */
  needsReview: boolean;
  /** ID of the memory to keep (higher confidence, tie-break by newer) */
  keepId: string;
  /** ID of the memory to supersede */
  supersedeId: string;
}

/** Result of a consolidation scan */
export interface ConsolidationResult {
  /** Total duplicate pairs found */
  pairsFound: number;
  /** Pairs auto-consolidated via supersede (similarity >= 0.92) */
  autoConsolidated: number;
  /** Pairs flagged for review (similarity 0.80–0.92) */
  flaggedForReview: number;
  /** Pairs where supersede was blocked by confidence_delta > 0.3 hard gate */
  blockedByKya: number;
  /** Details of each pair processed */
  pairs: DuplicatePair[];
  /** Whether this was a dry run */
  dryRun: boolean;
}

// ============ CACHE ============

/** LRU cache entry for recall results */
export interface MemoryCacheEntry {
  result: MemoryRecallResult;
  cachedAt: number;
  hitCount: number;
}

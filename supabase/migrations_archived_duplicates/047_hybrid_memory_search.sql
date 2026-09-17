-- Migration 047: Hybrid Memory Search
-- DWS IQ 6/7 — Improve Agent Memory (Phase 1)
--
-- Adds hybrid search combining vector similarity + full-text search,
-- configurable similarity threshold, and memory soft-delete support.
--
-- Dependencies: 05-GROUNDING-MEMORY.md schema (semantic_memories, episodic_memories)
-- Introduced-In: PR-TBD (improve-agent-memory)

BEGIN;

-- ============================================
-- ADD ORG_ID TO MEMORY TABLES (tenant isolation)
-- ============================================

ALTER TABLE semantic_memories
  ADD COLUMN IF NOT EXISTS org_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS expired_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS superseded_by UUID REFERENCES semantic_memories(id);

CREATE INDEX IF NOT EXISTS idx_semantic_org ON semantic_memories(org_id);
CREATE INDEX IF NOT EXISTS idx_semantic_expired ON semantic_memories(expired_at)
  WHERE expired_at IS NOT NULL;

-- ============================================
-- HYBRID MEMORY SEARCH FUNCTION
-- ============================================
-- Combines vector cosine similarity with pg_trgm text similarity.
-- Weighted scoring: final_score = (vector_weight * vector_sim) + (text_weight * text_sim)

CREATE OR REPLACE FUNCTION hybrid_memory_search(
  query_text TEXT,
  query_embedding VECTOR(1536),
  org_filter VARCHAR(255) DEFAULT NULL,
  customer_filter UUID DEFAULT NULL,
  memory_type_filter VARCHAR(50) DEFAULT NULL,
  match_count INT DEFAULT 5,
  similarity_threshold FLOAT DEFAULT 0.5,
  vector_weight FLOAT DEFAULT 0.7,
  text_weight FLOAT DEFAULT 0.3
)
RETURNS TABLE (
  id UUID,
  customer_id UUID,
  org_id VARCHAR(255),
  memory_type VARCHAR(50),
  content TEXT,
  vector_similarity FLOAT,
  text_similarity FLOAT,
  combined_score FLOAT,
  metadata JSONB,
  confidence FLOAT,
  created_at TIMESTAMPTZ,
  access_count INTEGER
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sm.id,
    sm.customer_id,
    sm.org_id,
    sm.memory_type,
    sm.content,
    (1 - (sm.embedding <=> query_embedding))::FLOAT AS vector_similarity,
    COALESCE(similarity(sm.content, query_text), 0)::FLOAT AS text_similarity,
    (
      vector_weight * (1 - (sm.embedding <=> query_embedding)) +
      text_weight * COALESCE(similarity(sm.content, query_text), 0)
    )::FLOAT AS combined_score,
    sm.metadata,
    sm.confidence,
    sm.created_at,
    sm.access_count
  FROM semantic_memories sm
  WHERE
    sm.expired_at IS NULL
    AND sm.superseded_by IS NULL
    AND (org_filter IS NULL OR sm.org_id = org_filter)
    AND (customer_filter IS NULL OR sm.customer_id = customer_filter)
    AND (memory_type_filter IS NULL OR sm.memory_type = memory_type_filter)
    AND (
      (1 - (sm.embedding <=> query_embedding)) > similarity_threshold
      OR similarity(sm.content, query_text) > 0.3
    )
  ORDER BY (
    vector_weight * (1 - (sm.embedding <=> query_embedding)) +
    text_weight * COALESCE(similarity(sm.content, query_text), 0)
  ) DESC
  LIMIT match_count;
END;
$$;

-- ============================================
-- UPDATE ACCESS TRACKING FUNCTION
-- ============================================
-- Bumps access_count and accessed_at when a memory is recalled.

CREATE OR REPLACE FUNCTION touch_memory(memory_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  UPDATE semantic_memories
  SET
    access_count = access_count + 1,
    accessed_at = NOW()
  WHERE id = memory_id;
END;
$$;

-- ============================================
-- SOFT-DELETE (FORGET) FUNCTION
-- ============================================
-- Marks a memory as expired rather than deleting it.

CREATE OR REPLACE FUNCTION forget_memory(
  memory_id UUID,
  forget_reason TEXT DEFAULT 'user_request'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  affected INT;
BEGIN
  UPDATE semantic_memories
  SET expired_at = NOW()
  WHERE id = memory_id AND expired_at IS NULL;

  GET DIAGNOSTICS affected = ROW_COUNT;

  -- Log to audit
  IF affected > 0 THEN
    INSERT INTO memory_audit_log (
      operation, table_name, record_id, new_value, created_at
    ) VALUES (
      'forget', 'semantic_memories', memory_id,
      jsonb_build_object('reason', forget_reason, 'expired_at', NOW()),
      NOW()
    );
  END IF;

  RETURN affected > 0;
END;
$$;

COMMIT;

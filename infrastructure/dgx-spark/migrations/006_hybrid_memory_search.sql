-- Ported from supabase/migrations/047_hybrid_memory_search.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- The source file's "ADD ORG_ID TO MEMORY TABLES" ALTER TABLE block
-- (org_id, expired_at, superseded_by columns + the FK to semantic_memories(id))
-- is NOT repeated here: those columns are already part of the base table
-- definition in 000_semantic_memories_base.sql for this fresh target database.
-- Only the two indexes those columns need are created below.

BEGIN;

CREATE INDEX IF NOT EXISTS idx_semantic_org ON semantic_memories(org_id);
CREATE INDEX IF NOT EXISTS idx_semantic_expired ON semantic_memories(expired_at)
  WHERE expired_at IS NOT NULL;

-- ============================================
-- HYBRID MEMORY SEARCH FUNCTION
-- ============================================
-- Combines vector cosine similarity with pg_trgm text similarity.
-- Weighted scoring: final_score = (vector_weight * vector_sim) + (text_weight * text_sim)
-- Requires pg_trgm for similarity(); vector extension is enabled in 000.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

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
-- SOFT-DELETE (FORGET) FUNCTION — 2-arg version
-- ============================================
-- NOTE: superseded in 007_memory_audit_log.sql (from source 048) by a 4-arg
-- version with a different parameter name for the id (p_memory_id vs
-- memory_id here). Because Postgres/PostgREST RPC calls resolve overloads by
-- matching named JSON keys to parameter names, the two versions do NOT
-- collide/replace each other automatically — they would coexist as separate
-- overloads. 007 explicitly DROPs this 2-arg version before creating the
-- 4-arg one, since this is a fresh target DB with no need to keep the old
-- overload around. See 007 for the version real application code
-- (src/agents/memory.service.ts forget()) actually calls.
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

-- NOTE: this 2-arg forget_memory() references memory_audit_log(table_name,
-- record_id, new_value) columns that do NOT exist in the 007-ported
-- memory_audit_log schema (KYA-S §10.4 schema uses memory_id/agent_id/org_id
-- instead). This body is only ever live for the brief window between this
-- migration and 007 in the applied sequence — 007 immediately DROPs and
-- replaces it. Kept verbatim here for fidelity to the source migration.

GRANT EXECUTE ON FUNCTION hybrid_memory_search TO dws_backend;
GRANT EXECUTE ON FUNCTION touch_memory TO dws_backend;
GRANT EXECUTE ON FUNCTION forget_memory(UUID, TEXT) TO dws_backend;

COMMIT;

-- Ported from supabase/migrations/050_memory_consolidation.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- Functions only — no new table. Both are read-only candidate finders; they do
-- not auto-merge (the application layer consolidates via supersede_memory()).

BEGIN;

-- ============================================
-- FIND_DUPLICATE_MEMORIES() — SCOPED DEDUP
-- ============================================
CREATE OR REPLACE FUNCTION find_duplicate_memories(
  p_org_id TEXT,
  p_customer_id UUID,
  p_auto_threshold FLOAT DEFAULT 0.92,
  p_review_threshold FLOAT DEFAULT 0.80,
  p_limit INT DEFAULT 100
)
RETURNS TABLE (
  memory_a_id UUID,
  memory_b_id UUID,
  content_a TEXT,
  content_b TEXT,
  confidence_a FLOAT,
  confidence_b FLOAT,
  cosine_similarity FLOAT,
  needs_review BOOLEAN,
  keep_id UUID,
  supersede_id UUID
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  IF p_org_id IS NULL THEN
    RAISE EXCEPTION 'p_org_id is mandatory (GDPR Art 5 scope enforcement)';
  END IF;
  IF p_customer_id IS NULL THEN
    RAISE EXCEPTION 'p_customer_id is mandatory — use find_duplicate_org_memories() for org-level memories';
  END IF;

  RETURN QUERY
  SELECT
    a.id AS memory_a_id,
    b.memory_b_id AS memory_b_id,
    a.content AS content_a,
    b.content_b AS content_b,
    a.confidence::FLOAT AS confidence_a,
    b.confidence_b::FLOAT AS confidence_b,
    b.cosine_similarity::FLOAT AS cosine_similarity,
    b.cosine_similarity < p_auto_threshold AS needs_review,
    CASE
      WHEN a.confidence > b.confidence_b THEN a.id
      WHEN b.confidence_b > a.confidence THEN b.memory_b_id
      WHEN a.created_at > b.created_at_b THEN a.id
      ELSE b.memory_b_id
    END AS keep_id,
    CASE
      WHEN a.confidence > b.confidence_b THEN b.memory_b_id
      WHEN b.confidence_b > a.confidence THEN a.id
      WHEN a.created_at > b.created_at_b THEN b.memory_b_id
      ELSE a.id
    END AS supersede_id
  FROM semantic_memories a
  CROSS JOIN LATERAL (
    SELECT
      b_inner.id AS memory_b_id,
      b_inner.content AS content_b,
      b_inner.confidence AS confidence_b,
      b_inner.created_at AS created_at_b,
      (1 - (a.embedding <=> b_inner.embedding)) AS cosine_similarity
    FROM semantic_memories b_inner
    WHERE
      b_inner.org_id = p_org_id
      AND b_inner.customer_id = p_customer_id
      AND b_inner.expired_at IS NULL
      AND b_inner.superseded_by IS NULL
      AND b_inner.embedding IS NOT NULL
      AND b_inner.id <> a.id
    ORDER BY a.embedding <=> b_inner.embedding
    LIMIT 50  -- bound per-memory neighbor comparisons to avoid O(n^2)
  ) AS b
  WHERE
    a.org_id = p_org_id
    AND a.customer_id = p_customer_id
    AND a.expired_at IS NULL
    AND a.superseded_by IS NULL
    AND a.embedding IS NOT NULL
    AND b.cosine_similarity >= p_review_threshold
    AND a.id < b.memory_b_id
  ORDER BY b.cosine_similarity DESC
  LIMIT p_limit;
END;
$$;

-- ============================================
-- FIND_DUPLICATE_ORG_MEMORIES() — ORG-LEVEL ONLY
-- ============================================
CREATE OR REPLACE FUNCTION find_duplicate_org_memories(
  p_org_id TEXT,
  p_auto_threshold FLOAT DEFAULT 0.92,
  p_review_threshold FLOAT DEFAULT 0.80,
  p_limit INT DEFAULT 100
)
RETURNS TABLE (
  memory_a_id UUID,
  memory_b_id UUID,
  content_a TEXT,
  content_b TEXT,
  confidence_a FLOAT,
  confidence_b FLOAT,
  cosine_similarity FLOAT,
  needs_review BOOLEAN,
  keep_id UUID,
  supersede_id UUID
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  IF p_org_id IS NULL THEN
    RAISE EXCEPTION 'p_org_id is mandatory (GDPR Art 5 scope enforcement)';
  END IF;

  RETURN QUERY
  SELECT
    a.id AS memory_a_id,
    b.memory_b_id AS memory_b_id,
    a.content AS content_a,
    b.content_b AS content_b,
    a.confidence::FLOAT AS confidence_a,
    b.confidence_b::FLOAT AS confidence_b,
    b.cosine_similarity::FLOAT AS cosine_similarity,
    b.cosine_similarity < p_auto_threshold AS needs_review,
    CASE
      WHEN a.confidence > b.confidence_b THEN a.id
      WHEN b.confidence_b > a.confidence THEN b.memory_b_id
      WHEN a.created_at > b.created_at_b THEN a.id
      ELSE b.memory_b_id
    END AS keep_id,
    CASE
      WHEN a.confidence > b.confidence_b THEN b.memory_b_id
      WHEN b.confidence_b > a.confidence THEN a.id
      WHEN a.created_at > b.created_at_b THEN b.memory_b_id
      ELSE a.id
    END AS supersede_id
  FROM semantic_memories a
  CROSS JOIN LATERAL (
    SELECT
      b_inner.id AS memory_b_id,
      b_inner.content AS content_b,
      b_inner.confidence AS confidence_b,
      b_inner.created_at AS created_at_b,
      (1 - (a.embedding <=> b_inner.embedding)) AS cosine_similarity
    FROM semantic_memories b_inner
    WHERE
      b_inner.org_id = p_org_id
      AND b_inner.customer_id IS NULL
      AND b_inner.expired_at IS NULL
      AND b_inner.superseded_by IS NULL
      AND b_inner.embedding IS NOT NULL
      AND b_inner.id <> a.id
    ORDER BY a.embedding <=> b_inner.embedding
    LIMIT 50
  ) AS b
  WHERE
    a.org_id = p_org_id
    AND a.customer_id IS NULL
    AND a.expired_at IS NULL
    AND a.superseded_by IS NULL
    AND a.embedding IS NOT NULL
    AND b.cosine_similarity >= p_review_threshold
    AND a.id < b.memory_b_id
  ORDER BY b.cosine_similarity DESC
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION find_duplicate_memories TO dws_backend;
GRANT EXECUTE ON FUNCTION find_duplicate_org_memories TO dws_backend;

COMMIT;

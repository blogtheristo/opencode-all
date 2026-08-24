-- Migration 050: Memory Consolidation (Near-Duplicate Detection)
-- DWS IQ 6/7 — KYA-S §10 + GDPR Art 5 Compliant Dedup (PR-256)
--
-- Finds near-duplicate memories within a SINGLE customer scope using
-- cosine similarity. Cross-customer comparison is structurally impossible:
-- p_org_id and p_customer_id are mandatory, non-nullable parameters.
--
-- Does NOT auto-merge. Returns candidate pairs for the application layer
-- to consolidate via supersede_memory() (which enforces confidence_delta
-- hard gate from KYA-S §10.2).
--
-- Thresholds:
--   >= 0.92 cosine similarity → auto-consolidate candidates
--   0.80–0.92 → flagged for review (returned with needs_review = true)
--   < 0.80 → not returned (different memories)
--
-- Dependencies: 047_hybrid_memory_search.sql (semantic_memories, embedding)
-- Introduced-In: PR-256 (consolidation-cron)
-- KYA Reference: Legal/KYA_SECURITY_v1.2.md §10, GDPR Art 5
-- Date: 2026-03-23
-- Owner: Lifetime Oy

BEGIN;

-- ============================================
-- FIND_DUPLICATE_MEMORIES() — SCOPED DEDUP
-- ============================================
-- Mandatory org_id + customer_id scoping. No cross-customer paths.
-- For org-level memories (no customer), use find_duplicate_org_memories().

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
  -- Both params are mandatory — enforce at SQL level
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
    -- Keep the memory with higher confidence; tie-break by newer created_at
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
      -- Same org and customer scope as "a"
      b_inner.org_id = p_org_id
      AND b_inner.customer_id = p_customer_id
      AND b_inner.expired_at IS NULL
      AND b_inner.superseded_by IS NULL
      AND b_inner.embedding IS NOT NULL
      AND b_inner.id <> a.id
    ORDER BY a.embedding <=> b_inner.embedding
    LIMIT 50  -- bound per-memory neighbor comparisons to avoid O(n²)
  ) AS b
  WHERE
    -- Scope: same org, same customer, both active
    a.org_id = p_org_id
    AND a.customer_id = p_customer_id
    AND a.expired_at IS NULL
    AND a.superseded_by IS NULL
    -- "a" must have embedding
    AND a.embedding IS NOT NULL
    -- Similarity above review threshold
    AND b.cosine_similarity >= p_review_threshold
    -- Enforce ordering to avoid symmetric duplicate pairs
    AND a.id < b.memory_b_id
  ORDER BY b.cosine_similarity DESC
  LIMIT p_limit;
END;
$$;

-- ============================================
-- FIND_DUPLICATE_ORG_MEMORIES() — ORG-LEVEL ONLY
-- ============================================
-- For memories with customer_id IS NULL (org-level knowledge).
-- Same logic, but scoped to org-level memories only.

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

COMMIT;

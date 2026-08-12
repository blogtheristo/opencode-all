-- Migration 048: Memory Audit Log + Contradiction Resolution
-- DWS IQ 6/7 — KYA-S §10 Memory Audit Trail (PR-255)
--
-- Creates the memory_audit_log table for immutable audit trail of all memory
-- mutations (store, supersede, forget, extract). Adds supersede_memory() RPC
-- for temporal contradiction resolution with confidence-delta hard gate.
--
-- Dependencies: 047_hybrid_memory_search.sql (semantic_memories, forget_memory)
--   NOTE: 047_hybrid_memory_search is a duplicate-prefix file (archived per
--   §7.4); no migration in the active chain enables pgvector or creates
--   semantic_memories — production got both out-of-band. The VECTOR type is
--   needed at function-creation time, so enable the extension here (bundled
--   with the Supabase Postgres image). Table refs resolve at runtime only.
--   (CI soak catch, blank-slate replay.)
CREATE EXTENSION IF NOT EXISTS vector;

-- Introduced-In: PR-255 (contradiction-resolution)
-- KYA Reference: Legal/KYA_SECURITY_v1.2.md §10
-- Date: 2026-03-23
-- Owner: Lifetime Oy

BEGIN;

-- ============================================
-- MEMORY AUDIT LOG TABLE (KYA-S §10.4)
-- ============================================
-- Immutable audit trail for all memory mutations.
-- 7-year retention per GDPR. RLS-enforced tenant isolation.

CREATE TABLE IF NOT EXISTS memory_audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation     TEXT NOT NULL CHECK (operation IN ('store', 'supersede', 'forget', 'extract')),
  agent_id      TEXT NOT NULL,
  agent_ats     FLOAT,
  memory_id     UUID,
  old_memory_id UUID,
  org_id        TEXT NOT NULL,
  customer_id   UUID,
  reason        TEXT,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for audit queries
CREATE INDEX IF NOT EXISTS idx_audit_org ON memory_audit_log(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON memory_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_operation ON memory_audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_memory ON memory_audit_log(memory_id);
CREATE INDEX IF NOT EXISTS idx_audit_agent ON memory_audit_log(agent_id);

-- RLS: tenant isolation (service_role bypasses, authenticated users see own org)
ALTER TABLE memory_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY memory_audit_org_isolation ON memory_audit_log
  FOR ALL USING (org_id = current_setting('app.org_id', true));

-- Immutability: deny UPDATE and DELETE for non-service roles
-- (service_role bypasses RLS, so this protects authenticated/anon roles)
CREATE POLICY memory_audit_immutable_no_update ON memory_audit_log
  FOR UPDATE USING (false);

CREATE POLICY memory_audit_immutable_no_delete ON memory_audit_log
  FOR DELETE USING (false);

-- ============================================
-- UPDATE FORGET_MEMORY() TO USE NEW AUDIT SCHEMA
-- ============================================
-- Replace the old forget_memory that inserted with (operation, table_name, record_id, new_value)
-- to use the KYA-S §10.4 schema (operation, agent_id, memory_id, org_id, reason, metadata).

CREATE OR REPLACE FUNCTION forget_memory(
  p_memory_id UUID,
  forget_reason TEXT DEFAULT 'user_request',
  p_agent_id TEXT DEFAULT 'system',
  p_org_id TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  affected INT;
  v_org_id TEXT;
BEGIN
  -- Soft-delete the memory
  UPDATE semantic_memories
  SET expired_at = NOW()
  WHERE id = p_memory_id AND expired_at IS NULL
  RETURNING org_id INTO v_org_id;

  GET DIAGNOSTICS affected = ROW_COUNT;

  -- Log to audit with KYA-S §10.4 schema
  IF affected > 0 THEN
    INSERT INTO memory_audit_log (
      operation, agent_id, memory_id, org_id, reason, metadata
    ) VALUES (
      'forget',
      p_agent_id,
      p_memory_id,
      COALESCE(p_org_id, v_org_id, 'unknown'),
      forget_reason,
      jsonb_build_object('expired_at', NOW())
    );
  END IF;

  RETURN affected > 0;
END;
$$;

-- ============================================
-- SUPERSEDE_MEMORY() — TEMPORAL CONTRADICTION RESOLUTION
-- ============================================
-- Marks old memory as superseded, stores new memory, logs audit entry.
-- Hard gate: if confidence_delta > 0.3, returns requires_review = true
-- and does NOT auto-apply the supersede (KYA-S §10.2).

CREATE OR REPLACE FUNCTION supersede_memory(
  p_old_memory_id UUID,
  p_new_content TEXT,
  p_new_confidence FLOAT DEFAULT 1.0,
  p_new_source TEXT DEFAULT 'agent',
  p_reason TEXT DEFAULT 'temporal_supersede',
  p_agent_id TEXT DEFAULT 'system',
  p_agent_ats FLOAT DEFAULT NULL,
  p_org_id TEXT DEFAULT NULL,
  p_customer_id UUID DEFAULT NULL,
  p_new_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE (
  new_memory_id UUID,
  requires_review BOOLEAN,
  confidence_delta FLOAT,
  kya_decision TEXT
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_old_confidence FLOAT;
  v_old_content TEXT;
  v_old_org_id TEXT;
  v_old_customer_id UUID;
  v_old_memory_type VARCHAR(50);
  v_old_embedding VECTOR(1536);
  v_confidence_delta FLOAT;
  v_requires_review BOOLEAN;
  v_kya_decision TEXT;
  v_new_id UUID;
BEGIN
  -- Fetch old memory (must be active — not expired, not already superseded)
  SELECT
    sm.confidence, sm.content, sm.org_id, sm.customer_id,
    sm.memory_type, sm.embedding
  INTO
    v_old_confidence, v_old_content, v_old_org_id, v_old_customer_id,
    v_old_memory_type, v_old_embedding
  FROM semantic_memories sm
  WHERE sm.id = p_old_memory_id
    AND sm.expired_at IS NULL
    AND sm.superseded_by IS NULL;

  IF v_old_confidence IS NULL THEN
    RAISE EXCEPTION 'Memory % not found or already superseded/expired', p_old_memory_id;
  END IF;

  -- Calculate confidence delta (KYA-S §10.2 hard gate)
  v_confidence_delta := ABS(p_new_confidence - v_old_confidence);

  IF v_confidence_delta > 0.3 THEN
    -- Hard gate: requires human review
    v_requires_review := true;
    v_kya_decision := 'pending_review (confidence_delta > 0.3)';

    -- Log the attempt but do NOT apply
    INSERT INTO memory_audit_log (
      operation, agent_id, agent_ats, memory_id, old_memory_id,
      org_id, customer_id, reason, metadata
    ) VALUES (
      'supersede',
      p_agent_id,
      p_agent_ats,
      NULL,  -- no new memory created yet
      p_old_memory_id,
      COALESCE(p_org_id, v_old_org_id),
      COALESCE(p_customer_id, v_old_customer_id),
      p_reason,
      jsonb_build_object(
        'old_content', v_old_content,
        'new_content', p_new_content,
        'old_confidence', v_old_confidence,
        'new_confidence', p_new_confidence,
        'confidence_delta', v_confidence_delta,
        'kya_decision', v_kya_decision,
        'status', 'pending_review'
      )
    );

    RETURN QUERY SELECT NULL::UUID, v_requires_review, v_confidence_delta, v_kya_decision;
    RETURN;
  END IF;

  -- Auto-approved: confidence_delta <= 0.3
  v_requires_review := false;
  v_kya_decision := format('auto_approved (confidence_delta %.2f <= 0.3)', v_confidence_delta);

  -- Insert new memory (reuse embedding from old memory; caller can re-embed later)
  INSERT INTO semantic_memories (
    content, memory_type, customer_id, org_id, embedding,
    metadata, source, confidence, access_count, created_at, accessed_at
  ) VALUES (
    p_new_content,
    v_old_memory_type,
    COALESCE(p_customer_id, v_old_customer_id),
    COALESCE(p_org_id, v_old_org_id),
    v_old_embedding,  -- reuse until re-embedded
    p_new_metadata,
    p_new_source,
    p_new_confidence,
    0,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_new_id;

  -- Mark old memory as superseded
  UPDATE semantic_memories
  SET superseded_by = v_new_id
  WHERE id = p_old_memory_id;

  -- Audit log
  INSERT INTO memory_audit_log (
    operation, agent_id, agent_ats, memory_id, old_memory_id,
    org_id, customer_id, reason, metadata
  ) VALUES (
    'supersede',
    p_agent_id,
    p_agent_ats,
    v_new_id,
    p_old_memory_id,
    COALESCE(p_org_id, v_old_org_id),
    COALESCE(p_customer_id, v_old_customer_id),
    p_reason,
    jsonb_build_object(
      'old_content', v_old_content,
      'new_content', p_new_content,
      'old_confidence', v_old_confidence,
      'new_confidence', p_new_confidence,
      'confidence_delta', v_confidence_delta,
      'kya_decision', v_kya_decision
    )
  );

  RETURN QUERY SELECT v_new_id, v_requires_review, v_confidence_delta, v_kya_decision;
END;
$$;

-- ============================================
-- LOG_MEMORY_AUDIT() — GENERIC AUDIT HELPER
-- ============================================
-- Used by the application layer to log store/extract operations.

CREATE OR REPLACE FUNCTION log_memory_audit(
  p_operation TEXT,
  p_agent_id TEXT,
  p_memory_id UUID DEFAULT NULL,
  p_org_id TEXT DEFAULT 'unknown',
  p_customer_id UUID DEFAULT NULL,
  p_reason TEXT DEFAULT NULL,
  p_agent_ats FLOAT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO memory_audit_log (
    operation, agent_id, agent_ats, memory_id, org_id, customer_id, reason, metadata
  ) VALUES (
    p_operation, p_agent_id, p_agent_ats, p_memory_id, p_org_id, p_customer_id, p_reason, p_metadata
  )
  RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$;

COMMIT;

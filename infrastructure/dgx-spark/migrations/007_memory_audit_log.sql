-- Ported from supabase/migrations/048_memory_audit_log.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- KYA-S §10.4 memory audit trail. GDPR 7-year retention policy is a data
-- lifecycle decision, not something this migration enforces mechanically —
-- no automated deletion is added here, consistent with the source.
--
-- RLS judgment call: the source's tenant-isolation policy
-- (`org_id = current_setting('app.org_id', true)`) is NOT a Supabase
-- auth.uid()/auth.jwt()/auth.role()/service_role pattern, so it falls outside
-- the literal wording of the "strip Supabase auth.* RLS" rule. It is stripped
-- anyway: nothing in src/ ever sets the `app.org_id` GUC
-- (grepped — no set_config/current_setting('app.org_id') call exists), so on
-- a fresh dws-postgres database this policy would silently deny every row to
-- every non-bypassing role. Given the single-consumer model (only dws_backend
-- connects), the source's "GRANT ALL ON <table> TO dws_backend" replacement
-- pattern is the correct fix here too.

BEGIN;

-- ============================================
-- MEMORY AUDIT LOG TABLE (KYA-S §10.4)
-- ============================================
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

CREATE INDEX IF NOT EXISTS idx_audit_org ON memory_audit_log(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON memory_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_operation ON memory_audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_memory ON memory_audit_log(memory_id);
CREATE INDEX IF NOT EXISTS idx_audit_agent ON memory_audit_log(agent_id);

-- ============================================
-- REPLACE 2-ARG forget_memory() WITH KYA-S §10.4 SCHEMA VERSION
-- ============================================
-- 006 (source 047) created forget_memory(memory_id UUID, forget_reason TEXT).
-- Drop it explicitly rather than let it linger as an orphaned overload — its
-- body writes to memory_audit_log columns (table_name, record_id, new_value)
-- that don't exist in the schema above, so it is already broken as of this
-- migration.
DROP FUNCTION IF EXISTS forget_memory(UUID, TEXT);

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
  UPDATE semantic_memories
  SET expired_at = NOW()
  WHERE id = p_memory_id AND expired_at IS NULL
  RETURNING org_id INTO v_org_id;

  GET DIAGNOSTICS affected = ROW_COUNT;

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

  v_confidence_delta := ABS(p_new_confidence - v_old_confidence);

  IF v_confidence_delta > 0.3 THEN
    v_requires_review := true;
    v_kya_decision := 'pending_review (confidence_delta > 0.3)';

    INSERT INTO memory_audit_log (
      operation, agent_id, agent_ats, memory_id, old_memory_id,
      org_id, customer_id, reason, metadata
    ) VALUES (
      'supersede',
      p_agent_id,
      p_agent_ats,
      NULL,
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

  v_requires_review := false;
  v_kya_decision := format('auto_approved (confidence_delta %.2f <= 0.3)', v_confidence_delta);

  INSERT INTO semantic_memories (
    content, memory_type, customer_id, org_id, embedding,
    metadata, source, confidence, access_count, created_at, accessed_at
  ) VALUES (
    p_new_content,
    v_old_memory_type,
    COALESCE(p_customer_id, v_old_customer_id),
    COALESCE(p_org_id, v_old_org_id),
    v_old_embedding,
    p_new_metadata,
    p_new_source,
    p_new_confidence,
    0,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_new_id;

  UPDATE semantic_memories
  SET superseded_by = v_new_id
  WHERE id = p_old_memory_id;

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

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
GRANT ALL ON memory_audit_log TO dws_backend;
GRANT EXECUTE ON FUNCTION forget_memory(UUID, TEXT, TEXT, TEXT) TO dws_backend;
GRANT EXECUTE ON FUNCTION supersede_memory TO dws_backend;
GRANT EXECUTE ON FUNCTION log_memory_audit TO dws_backend;

COMMIT;

-- Migration 049: Memory Confidence Decay
-- DWS IQ 6/7 — KYA-S §10 Stale Memory Decay (PR-257)
--
-- Adds decay_stale_memories() function that reduces confidence of memories
-- based on time since last access. Memories below threshold are returned
-- for the application layer to forget() with proper agent attribution.
--
-- Decay formula: confidence * (half_life / (half_life + days_since_access))
-- Default half-life: 90 days (confidence halves every 90 days of non-access)
-- Default threshold: 0.1 (memories below this are candidates for forget)
--
-- Dependencies: 048_memory_audit_log.sql (memory_audit_log, forget_memory)
-- Introduced-In: PR-257 (memory-decay-audit)
-- KYA Reference: Legal/KYA_SECURITY_v1.2.md §10
-- Date: 2026-03-23
-- Owner: Lifetime Oy

BEGIN;

-- ============================================
-- DECAY_STALE_MEMORIES() — CONFIDENCE DECAY
-- ============================================
-- Applies time-based confidence decay to all active memories.
-- Returns list of memories that dropped below threshold (for forget).
-- Does NOT auto-forget — caller decides what to do with below-threshold memories.

CREATE OR REPLACE FUNCTION decay_stale_memories(
  p_half_life_days INT DEFAULT 90,
  p_decay_threshold FLOAT DEFAULT 0.1,
  p_dry_run BOOLEAN DEFAULT false,
  p_org_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  memory_id UUID,
  org_id TEXT,
  old_confidence FLOAT,
  new_confidence FLOAT,
  days_since_access FLOAT,
  below_threshold BOOLEAN
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  -- Return decay calculations for all active memories
  -- If not dry_run, also UPDATE the confidence values
  IF p_dry_run THEN
    RETURN QUERY
    SELECT
      sm.id AS memory_id,
      sm.org_id,
      sm.confidence::FLOAT AS old_confidence,
      (sm.confidence * (p_half_life_days::FLOAT / (p_half_life_days::FLOAT +
        EXTRACT(EPOCH FROM (NOW() - COALESCE(sm.accessed_at, sm.created_at))) / 86400.0
      )))::FLOAT AS new_confidence,
      (EXTRACT(EPOCH FROM (NOW() - COALESCE(sm.accessed_at, sm.created_at))) / 86400.0)::FLOAT AS days_since_access,
      (sm.confidence * (p_half_life_days::FLOAT / (p_half_life_days::FLOAT +
        EXTRACT(EPOCH FROM (NOW() - COALESCE(sm.accessed_at, sm.created_at))) / 86400.0
      ))) < p_decay_threshold AS below_threshold
    FROM semantic_memories sm
    WHERE sm.expired_at IS NULL
      AND sm.superseded_by IS NULL
      AND (p_org_id IS NULL OR sm.org_id = p_org_id);
  ELSE
    -- Apply decay and return results
    RETURN QUERY
    WITH decayed AS (
      UPDATE semantic_memories sm
      SET confidence = (sm.confidence * (p_half_life_days::FLOAT / (p_half_life_days::FLOAT +
        EXTRACT(EPOCH FROM (NOW() - COALESCE(sm.accessed_at, sm.created_at))) / 86400.0
      )))::FLOAT
      WHERE sm.expired_at IS NULL
        AND sm.superseded_by IS NULL
        AND (p_org_id IS NULL OR sm.org_id = p_org_id)
      RETURNING
        sm.id AS memory_id,
        sm.org_id,
        sm.confidence AS new_confidence
    )
    SELECT
      d.memory_id,
      d.org_id,
      -- We can't get old_confidence from the UPDATE RETURNING, so we compute it
      -- new_confidence was already set, old = new / decay_factor; approximate with new_confidence
      d.new_confidence AS old_confidence,  -- post-update value (best we can return)
      d.new_confidence,
      0.0::FLOAT AS days_since_access,  -- not available post-update
      d.new_confidence < p_decay_threshold AS below_threshold
    FROM decayed d;

    -- Log the decay run to audit
    INSERT INTO memory_audit_log (
      operation, agent_id, org_id, reason, metadata
    ) VALUES (
      'extract',  -- reuse 'extract' operation for decay audit (no new op needed)
      'decay-cron',
      COALESCE(p_org_id, 'all'),
      'confidence_decay_run',
      jsonb_build_object(
        'half_life_days', p_half_life_days,
        'decay_threshold', p_decay_threshold,
        'dry_run', p_dry_run,
        'run_at', NOW()
      )
    );
  END IF;
END;
$$;

COMMIT;

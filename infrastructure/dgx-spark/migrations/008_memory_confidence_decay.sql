-- Ported from supabase/migrations/049_memory_confidence_decay.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- Function only — no new table. Scheduling for this function moves from
-- Supabase pg_cron to dws-cron's node-cron (application-level); see
-- 010_memory_pgcron_decay.sql for the note on the excluded pg_cron.schedule()
-- call that used to invoke this.

BEGIN;

-- ============================================
-- DECAY_STALE_MEMORIES() — CONFIDENCE DECAY
-- ============================================
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
      d.new_confidence AS old_confidence,  -- post-update value (best we can return)
      d.new_confidence,
      0.0::FLOAT AS days_since_access,  -- not available post-update
      d.new_confidence < p_decay_threshold AS below_threshold
    FROM decayed d;

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

GRANT EXECUTE ON FUNCTION decay_stale_memories TO dws_backend;

COMMIT;

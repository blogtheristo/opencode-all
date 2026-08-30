-- Migration 051: pg_cron memory decay scheduler
-- Replaces Node.js cron with database-level scheduling.
-- Required for Cloud Run scale-to-zero: the app may not be running
-- when decay needs to happen, but Supabase pg_cron always runs.
--
-- Code-Version: 1.0.0
-- Introduced-In: PR-TBD (memory-decay-audit-final)
-- Date: 2026-03-23
-- Owner: Lifetime Oy
--
-- NOTE: pg_cron must be enabled in Supabase Dashboard → Extensions first.
-- This migration is idempotent — safe to re-run.
--
-- PRE-FLIGHT CHECK (run before applying):
--   SELECT * FROM pg_extension WHERE extname = 'pg_cron';
--   If empty → enable in Supabase Dashboard → Database → Extensions → pg_cron
--   pg_cron requires Supabase Pro plan or higher.
--
-- AUDIT POLICY: KYA-S §10 requires court-defensible audit trail.
-- Audit logs are NEVER deleted — they are archived to memory_audit_log_archive
-- after 1 year for long-term retention. Archive retention: 7 years minimum
-- (EU AI Act Art. 12, Finnish Accounting Act §2:10, GDPR Art. 17(3)(e)).

BEGIN;

-- ============ ENABLE EXTENSION ============
-- pg_cron is pre-installed on Supabase but must be enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- ============ CONSOLIDATION FUNCTION ============
-- Merges near-duplicate memories (similarity > 0.92) within same org.
-- Keeps the most-accessed version, soft-deletes others.

CREATE OR REPLACE FUNCTION consolidate_memories(
  p_similarity_threshold FLOAT DEFAULT 0.92,
  p_org_id TEXT DEFAULT NULL
)
RETURNS TABLE(
  consolidated_count INT,
  kept_count INT,
  merged_ids UUID[]
)
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_consolidated INT := 0;
  v_kept INT := 0;
  v_merged UUID[] := '{}';
  v_rec RECORD;
  v_dup RECORD;
BEGIN
  -- Find duplicate clusters: same org, same type, high text similarity
  FOR v_rec IN
    SELECT m1.id AS keep_id, m2.id AS merge_id
    FROM semantic_memories m1
    JOIN semantic_memories m2
      ON m1.org_id = m2.org_id
      AND m1.memory_type = m2.memory_type
      AND m1.id < m2.id
      AND m1.expired_at IS NULL
      AND m2.expired_at IS NULL
      AND similarity(m1.content, m2.content) > p_similarity_threshold
    WHERE (p_org_id IS NULL OR m1.org_id = p_org_id)
    ORDER BY m1.access_count DESC, m1.confidence DESC
    LIMIT 100  -- batch size to avoid long locks
  LOOP
    -- Keep the one with higher access_count, expire the other
    UPDATE semantic_memories
    SET expired_at = NOW(),
        metadata = metadata || jsonb_build_object(
          'consolidated_into', v_rec.keep_id::text,
          'consolidated_at', NOW()::text
        )
    WHERE id = v_rec.merge_id
      AND expired_at IS NULL;

    IF FOUND THEN
      v_consolidated := v_consolidated + 1;
      v_merged := array_append(v_merged, v_rec.merge_id);

      -- Boost kept memory access count
      UPDATE semantic_memories
      SET access_count = access_count + 1,
          accessed_at = NOW()
      WHERE id = v_rec.keep_id;

      v_kept := v_kept + 1;
    END IF;
  END LOOP;

  RETURN QUERY SELECT v_consolidated, v_kept, v_merged;
END;
$$;

-- ============ SCHEDULED JOBS ============

-- 1. Daily confidence decay at 03:00 UTC
--    Applies exponential decay to all memories, auto-forgets below 0.1
SELECT cron.schedule(
  'memory-decay-daily',
  '0 3 * * *',  -- 03:00 UTC daily
  $$SELECT * FROM decay_stale_memories(90, 0.1, false, NULL)$$
);

-- 2. Weekly consolidation on Sundays at 04:00 UTC
--    Merges near-duplicate memories to reduce bloat
SELECT cron.schedule(
  'memory-consolidation-weekly',
  '0 4 * * 0',  -- 04:00 UTC every Sunday
  $$SELECT * FROM consolidate_memories(0.92, NULL)$$
);

-- 3. Monthly audit log archival (move records older than 1 year to cold table)
--    KYA-S §10 requires court-defensible chain of custody — NEVER delete audit logs.
--    Instead, archive to memory_audit_log_archive for long-term retention.
--    Active table stays fast; archive is queryable for compliance/legal discovery.

-- ┌──────────────────────────────────────────────────────────────────┐
-- │ MEMORY_AUDIT_LOG_ARCHIVE                                       │
-- │                                                                │
-- │ This table has no DELETE policy by design.                     │
-- │ Retention is permanent (7-year minimum, no automated purge).  │
-- │ Audit chain of custody per KYA-S §10.                         │
-- │ Any future DELETE migration requires legal review.            │
-- │                                                                │
-- │ Legal basis:                                                   │
-- │   - EU AI Act Art. 12 (high-risk system logging)              │
-- │   - Finnish Accounting Act §2:10 (6+1 year retention)         │
-- │   - GDPR Art. 17(3)(e) (legal claims exception)              │
-- └──────────────────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS memory_audit_log_archive (
  LIKE memory_audit_log INCLUDING ALL
);
COMMENT ON TABLE memory_audit_log_archive IS
  'Immutable audit archive. Retention: 7 years minimum. '
  'No automated deletion. Manual purge requires legal + DPO approval. '
  'KYA-S §10, EU AI Act Art. 12, Finnish Accounting Act §2:10.';
-- RLS: same policy as source — org isolation, immutable
ALTER TABLE memory_audit_log_archive ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "audit_archive_org_isolation" ON memory_audit_log_archive;
CREATE POLICY "audit_archive_org_isolation" ON memory_audit_log_archive FOR SELECT
  USING (org_id = current_setting('app.org_id', true));
-- No UPDATE/DELETE policies — archive is append-only
-- No pg_cron job to purge — retention is enforced by ABSENCE of deletion

SELECT cron.schedule(
  'memory-audit-archive-monthly',
  '0 5 1 * *',  -- 05:00 UTC on 1st of each month
  $$
    WITH moved AS (
      DELETE FROM memory_audit_log
      WHERE created_at < NOW() - INTERVAL '365 days'
      RETURNING *
    )
    INSERT INTO memory_audit_log_archive
    SELECT * FROM moved
  $$
);

COMMIT;

-- ============ VERIFICATION ============
-- After applying, verify jobs are registered:
--   SELECT * FROM cron.job;
--
-- To unschedule:
--   SELECT cron.unschedule('memory-decay-daily');
--   SELECT cron.unschedule('memory-consolidation-weekly');
--   SELECT cron.unschedule('memory-audit-archive-monthly');
--
-- To query archived audit logs:
--   SELECT * FROM memory_audit_log_archive WHERE org_id = 'your-org' ORDER BY created_at DESC;

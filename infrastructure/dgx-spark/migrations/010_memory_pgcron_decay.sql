-- Ported from supabase/migrations/051_memory_pgcron_decay.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- pg_cron caveat: the source file's `CREATE EXTENSION IF NOT EXISTS pg_cron;`
-- and its three `SELECT cron.schedule(...)` calls (memory-decay-daily,
-- memory-consolidation-weekly, memory-audit-archive-monthly) are deliberately
-- NOT included below. pg_cron is a Supabase-managed extension that does not
-- exist on a plain postgres:16-alpine image. The equivalent scheduling
-- (calling decay_stale_memories(), consolidate_memories(), and the audit
-- archive move) now happens at the application level via dws-cron's
-- node-cron, not inside the database. Only the consolidate_memories()
-- function and the memory_audit_log_archive table are ported here — the
-- scheduling itself is dws-cron's job.

BEGIN;

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
BEGIN
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

-- ============ AUDIT ARCHIVE TABLE ============
-- ┌──────────────────────────────────────────────────────────────────┐
-- │ MEMORY_AUDIT_LOG_ARCHIVE                                        │
-- │                                                                 │
-- │ This table has no DELETE policy by design.                      │
-- │ Retention is permanent (7-year minimum, no automated purge).     │
-- │ Audit chain of custody per KYA-S §10.                            │
-- │ Any future DELETE migration requires legal review.               │
-- │                                                                 │
-- │ Legal basis:                                                    │
-- │   - EU AI Act Art. 12 (high-risk system logging)                 │
-- │   - Finnish Accounting Act §2:10 (6+1 year retention)            │
-- │   - GDPR Art. 17(3)(e) (legal claims exception)                  │
-- └──────────────────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS memory_audit_log_archive (
  LIKE memory_audit_log INCLUDING ALL
);
COMMENT ON TABLE memory_audit_log_archive IS
  'Immutable audit archive. Retention: 7 years minimum. '
  'No automated deletion. Manual purge requires legal + DPO approval. '
  'KYA-S §10, EU AI Act Art. 12, Finnish Accounting Act §2:10.';

-- No pg_cron job to purge — retention is enforced by ABSENCE of deletion.
-- The monthly archive-move job (moving rows > 365 days old from
-- memory_audit_log into memory_audit_log_archive) also moves from pg_cron to
-- dws-cron's node-cron — see the pg_cron caveat note at the top of this file.

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
-- (Source RLS used current_setting('app.org_id', true) org-isolation, which
-- would silently deny all rows here too — see 007's note on the same pattern.)
GRANT ALL ON memory_audit_log_archive TO dws_backend;
GRANT EXECUTE ON FUNCTION consolidate_memories TO dws_backend;

COMMIT;

-- =============================================================================
-- RUNBOOK (staging then prod)
-- Purpose: Remove 3 placeholder "team" threads (and their persons + activities)
-- Targets (thread_token): 2764XEMEWX, YBMDRDF4PS, YPGW53RPFQ
-- Safety: Script fails fast if target count != 3 or token set mismatches.
--
-- Preconditions:
-- 1) You have a fresh DB backup/snapshot (or PITR enabled).
-- 2) You are running the entire script in ONE execution so BEGIN/COMMIT is respected.
--    Note: Supabase SQL editor respects BEGIN/COMMIT if you run the whole file at once.
--
-- How to run (recommended):
-- 1) Staging first.
-- 2) Execute the full script.
-- 3) Inspect sanity SELECT outputs.
-- 4) If anything looks off, ROLLBACK; fix before retry.
-- 5) If everything matches expectations, COMMIT.
-- 6) After cleanup: apply migration 025_add_prospect_status.sql
--
-- Verification after COMMIT:
-- 1) Confirm these tokens no longer exist:
--    SELECT thread_token FROM outreach_threads WHERE thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ');
-- 2) Confirm no activities remain for those tokens:
--    SELECT COUNT(*) FROM outreach_activities a JOIN outreach_threads t ON a.thread_id=t.id
--    WHERE t.thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ');
-- 3) Spot check orgs remain intact (no org deletes in this script).
--
-- Rollback plan:
-- If anything goes wrong BEFORE COMMIT: run ROLLBACK.
-- If anything goes wrong AFTER COMMIT: restore from snapshot/backup (or PITR) and re-run carefully.
-- =============================================================================
-- FK setup (from 023):
--   activities.thread_id NOT NULL → threads(id) ON DELETE CASCADE
--   activities.person_id NOT NULL → persons(id) ON DELETE CASCADE
--   threads.person_id NOT NULL    → persons(id) ON DELETE CASCADE
-- Cascades would handle children, but we delete explicitly for clarity
-- and to work regardless of cascade config.
-- Note: activities.thread_id is NOT NULL, so no person-only activities exist.
-- =============================================================================

BEGIN;

-- 0) Materialize targets (dropped automatically at COMMIT)
--    Include thread_token so all guards are self-contained.
CREATE TEMP TABLE _ph_threads ON COMMIT DROP AS
  SELECT id, person_id, thread_token
  FROM outreach_threads
  WHERE thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ');

-- ── FAIL-FAST GUARDS ────────────────────────────────────────────────────────

-- Guard 1: exactly 3 rows materialized
DO $$
DECLARE v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count FROM _ph_threads;
  IF v_count <> 3 THEN
    RAISE EXCEPTION 'Expected 3 placeholder threads, got %', v_count;
  END IF;
END $$;

-- Guard 2: token set matches exactly (no extras, no missing)
DO $$
DECLARE v_tokens TEXT[];
BEGIN
  SELECT ARRAY_AGG(thread_token ORDER BY thread_token)
    INTO v_tokens FROM _ph_threads;
  IF v_tokens <> ARRAY['2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ'] THEN
    RAISE EXCEPTION 'Token mismatch. Expected {2764XEMEWX,YBMDRDF4PS,YPGW53RPFQ}, got %', v_tokens;
  END IF;
END $$;

-- ── SANITY CHECK: preview what will be deleted ──────────────────────────────

-- Targets (informational)
SELECT thread_token, id AS thread_id, person_id FROM _ph_threads ORDER BY thread_token;

-- Activities to delete (expect small number or 0)
SELECT COUNT(*) AS activities_to_delete
FROM outreach_activities a
JOIN _ph_threads t ON a.thread_id = t.id;

-- Persons: are any referenced by other (non-placeholder) threads?
-- Expect: referenced_elsewhere = false for all 3
SELECT t.person_id,
       EXISTS (
         SELECT 1 FROM outreach_threads ot
         WHERE ot.person_id = t.person_id
           AND ot.id NOT IN (SELECT id FROM _ph_threads)
       ) AS referenced_elsewhere
FROM (SELECT DISTINCT person_id FROM _ph_threads) t
ORDER BY referenced_elsewhere DESC, person_id;

-- ── STEP 1: Delete activities ───────────────────────────────────────────────

DELETE FROM outreach_activities a
USING _ph_threads t
WHERE a.thread_id = t.id;

-- Verify: expect 0
SELECT COUNT(*) AS activities_remaining
FROM outreach_activities a
JOIN _ph_threads t ON a.thread_id = t.id;

-- ── STEP 2: Delete threads ──────────────────────────────────────────────────

DELETE FROM outreach_threads ot
USING _ph_threads t
WHERE ot.id = t.id;

-- Verify: expect 0
SELECT COUNT(*) AS threads_remaining
FROM outreach_threads
WHERE id IN (SELECT id FROM _ph_threads);

-- ── STEP 3: Delete persons (only if unreferenced) ───────────────────────────

DELETE FROM persons p
USING (SELECT DISTINCT person_id FROM _ph_threads) tp
WHERE p.id = tp.person_id
  AND NOT EXISTS (
    SELECT 1 FROM outreach_threads t2 WHERE t2.person_id = p.id
  );

-- Verify: expect 0 (all placeholder persons gone)
SELECT COUNT(*) AS persons_remaining
FROM persons p
WHERE p.id IN (SELECT DISTINCT person_id FROM _ph_threads);

-- ── If everything looks right, COMMIT. Otherwise ROLLBACK. ─────────────────

COMMIT;

-- =============================================================================
-- ONE-TIME CLEANUP: Remove 3 placeholder threads + orphaned persons
-- Run manually against staging, then prod.
-- Date: 2026-02-08
-- Targets: thread_tokens 2764XEMEWX, YBMDRDF4PS, YPGW53RPFQ
-- =============================================================================
-- These were "team" placeholder entries with company LinkedIn URLs.
-- Rule going forward: only named humans with personal LinkedIn URLs get threads.
-- Orgs stay in outreach_orgs with prospect_status = 'target_needs_contact'.
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
CREATE TEMP TABLE _ph_threads ON COMMIT DROP AS
  SELECT id, person_id
  FROM outreach_threads
  WHERE thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ');

-- ── SANITY CHECK: before deletes ────────────────────────────────────────────

-- Expect: 3
SELECT COUNT(*) AS ph_thread_count FROM _ph_threads;

-- Expect: the 3 known tokens and their thread/person UUIDs
SELECT thread_token, id AS thread_id, person_id
FROM outreach_threads
WHERE id IN (SELECT id FROM _ph_threads)
ORDER BY thread_token;

-- Expect: {2764XEMEWX, YBMDRDF4PS, YPGW53RPFQ}
SELECT ARRAY_AGG(thread_token ORDER BY thread_token) AS ph_tokens
FROM outreach_threads
WHERE id IN (SELECT id FROM _ph_threads);

-- How many activities will be deleted (expect small number or 0)
SELECT COUNT(*) AS activities_to_delete
FROM outreach_activities a
JOIN _ph_threads t ON a.thread_id = t.id;

-- Sample activities for spot check
SELECT a.id AS activity_id, a.thread_id
FROM outreach_activities a
JOIN _ph_threads t ON a.thread_id = t.id
ORDER BY a.created_at DESC
LIMIT 10;

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

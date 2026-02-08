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

-- 1) Delete activities tied to those threads
DELETE FROM outreach_activities a
USING _ph_threads t
WHERE a.thread_id = t.id;

-- 2) Delete the threads themselves
DELETE FROM outreach_threads ot
USING _ph_threads t
WHERE ot.id = t.id;

-- 3) Delete persons only if no other thread still references them
DELETE FROM persons p
USING (SELECT DISTINCT person_id FROM _ph_threads) tp
WHERE p.id = tp.person_id
  AND NOT EXISTS (
    SELECT 1 FROM outreach_threads t2 WHERE t2.person_id = p.id
  );

COMMIT;

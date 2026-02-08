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
-- FK setup (from 023): activities.thread_id → threads ON DELETE CASCADE,
-- activities.person_id → persons ON DELETE CASCADE,
-- threads.person_id → persons ON DELETE CASCADE.
-- Cascades would handle children, but we delete explicitly for clarity.
-- =============================================================================

BEGIN;

-- 0) Capture person_ids before we delete the threads that reference them
CREATE TEMP TABLE _placeholder_person_ids ON COMMIT DROP AS
  SELECT DISTINCT person_id
  FROM outreach_threads
  WHERE thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ');

-- 1) Delete activities by thread
DELETE FROM outreach_activities a
WHERE a.thread_id IN (
  SELECT t.id FROM outreach_threads t
  WHERE t.thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ')
);

-- 2) Delete any remaining activities by person (person-only activities without thread)
DELETE FROM outreach_activities a
WHERE a.person_id IN (SELECT person_id FROM _placeholder_person_ids)
  AND a.thread_id IS NULL;

-- 3) Delete threads
DELETE FROM outreach_threads
WHERE thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ');

-- 4) Delete persons ONLY if no other thread still references them
DELETE FROM persons p
WHERE p.id IN (SELECT person_id FROM _placeholder_person_ids)
  AND NOT EXISTS (
    SELECT 1 FROM outreach_threads t2 WHERE t2.person_id = p.id
  );

COMMIT;

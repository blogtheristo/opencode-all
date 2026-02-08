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

BEGIN;

-- 1) Activities tied to placeholder threads
DELETE FROM outreach_activities
WHERE thread_id IN (
  SELECT id FROM outreach_threads
  WHERE thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ')
);

-- 2) Activities tied to placeholder persons
DELETE FROM outreach_activities
WHERE person_id IN (
  SELECT person_id FROM outreach_threads
  WHERE thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ')
);

-- 3) Persons (while threads still exist to resolve person_id)
DELETE FROM persons
WHERE id IN (
  SELECT person_id FROM outreach_threads
  WHERE thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ')
);

-- 4) Threads last
DELETE FROM outreach_threads
WHERE thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ');

COMMIT;

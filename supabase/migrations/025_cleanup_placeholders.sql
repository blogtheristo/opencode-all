-- Migration 025: Remove placeholder persons, add prospect_status
-- Boardy feedback: only named humans get threads. Placeholder "Team" entries
-- create fake urgency, break dedupe, and ruin conversion stats.
-- Orgs are kept — prospect_status tracks "find the buyer first".
--
-- Safety measures (Boardy final review):
--   1. Temp table targets by exact thread_token + name match — fail fast if != 3
--   2. Token array mismatch check (double verification)
--   3. Explicit FK delete order: activities → threads → person_emails → persons
--   4. Persons only deleted if unreferenced (belt + suspenders)
--   5. EXISTS-based org status update (no NULL weirdness)
--   6. Named CHECK constraint for idempotent re-runs
--   7. ON COMMIT DROP for temp table (auto-cleanup)
--
-- Note: NCC placeholder has last_name='Director' (not 'Team'), so name filter
-- includes both. Token targeting is the real safety net.

BEGIN;

-- ============================================================================
-- 1. MATERIALIZE TARGETS (token-adjacent) + FAIL FAST
-- ============================================================================

CREATE TEMP TABLE _placeholder_targets ON COMMIT DROP AS
SELECT
  p.id AS person_id,
  t.id AS thread_id,
  t.thread_token
FROM persons p
JOIN outreach_threads t ON t.person_id = p.id
WHERE p.last_name IN ('Team', 'Director')
  AND p.first_name IN ('Partnerships', 'ISV Marketplace', 'Sustainability')
  AND t.thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ');

DO $$
DECLARE v_count int;
BEGIN
  SELECT COUNT(*) INTO v_count FROM _placeholder_targets;
  IF v_count <> 3 THEN
    RAISE EXCEPTION '025_cleanup: expected 3 placeholder targets, found %', v_count;
  END IF;
END $$;

DO $$
DECLARE v_tokens text[];
BEGIN
  SELECT ARRAY_AGG(thread_token ORDER BY thread_token) INTO v_tokens
  FROM _placeholder_targets;

  IF v_tokens <> ARRAY['2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ'] THEN
    RAISE EXCEPTION '025_cleanup: token mismatch, got %', v_tokens;
  END IF;
END $$;

-- Sanity preview
SELECT thread_token, thread_id, person_id FROM _placeholder_targets ORDER BY thread_token;
SELECT COUNT(*) AS activities_to_delete
FROM outreach_activities a
WHERE a.thread_id IN (SELECT thread_id FROM _placeholder_targets);

-- ============================================================================
-- 2. DELETE PLACEHOLDER DATA (keep orgs)
-- ============================================================================

-- Activities first
DELETE FROM outreach_activities a
WHERE a.thread_id IN (SELECT thread_id FROM _placeholder_targets);

-- Threads second
DELETE FROM outreach_threads t
WHERE t.id IN (SELECT thread_id FROM _placeholder_targets);

-- Person emails third
DELETE FROM person_emails pe
WHERE pe.person_id IN (SELECT person_id FROM _placeholder_targets);

-- Persons last (only if unreferenced)
DELETE FROM persons p
WHERE p.id IN (SELECT person_id FROM _placeholder_targets)
  AND NOT EXISTS (
    SELECT 1 FROM outreach_threads t2 WHERE t2.person_id = p.id
  );

-- Post-delete sanity
SELECT COUNT(*) AS threads_remaining
FROM outreach_threads
WHERE thread_token IN ('2764XEMEWX','YBMDRDF4PS','YPGW53RPFQ');

-- ============================================================================
-- 3. PROSPECT_STATUS ON OUTREACH_ORGS (idempotent)
-- ============================================================================

ALTER TABLE outreach_orgs
  ADD COLUMN IF NOT EXISTS prospect_status text;

UPDATE outreach_orgs
SET prospect_status = 'target_needs_contact'
WHERE prospect_status IS NULL;

ALTER TABLE outreach_orgs
  ALTER COLUMN prospect_status SET DEFAULT 'target_needs_contact';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'outreach_orgs_prospect_status_check'
  ) THEN
    ALTER TABLE outreach_orgs
      ADD CONSTRAINT outreach_orgs_prospect_status_check
      CHECK (prospect_status IN ('target_needs_contact','contact_identified','active'));
  END IF;
END $$;

UPDATE outreach_orgs o
SET prospect_status = 'active'
WHERE EXISTS (SELECT 1 FROM outreach_threads t WHERE t.org_id = o.id);

SELECT prospect_status, COUNT(*)
FROM outreach_orgs
GROUP BY 1
ORDER BY 1;

COMMIT;

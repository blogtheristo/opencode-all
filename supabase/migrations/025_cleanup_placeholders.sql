-- Migration 025: Remove placeholder persons, add prospect_status
-- Boardy feedback: only named humans get threads. Placeholder "Team" entries
-- create fake urgency, break dedupe, and ruin conversion stats.
-- Orgs are kept — prospect_status tracks "find the buyer first".
--
-- Safety measures (Boardy review):
--   1. Temp table materializes exact person_ids — fail fast if not exactly 3
--   2. Requires matching thread EXISTS (token-adjacent: can't hit a legit "Team" contact)
--   3. Explicit FK delete order: activities → threads → person_emails → persons
--   4. EXISTS-based org status update (no NULL weirdness)

BEGIN;

-- ============================================================================
-- 1. MATERIALIZE TARGET PERSON IDs (fail fast if count != 3)
-- ============================================================================

CREATE TEMP TABLE _placeholder_persons AS
SELECT p.id
FROM persons p
WHERE p.last_name = 'Team'
  AND p.first_name IN ('Partnerships', 'ISV Marketplace', 'Sustainability')
  AND EXISTS (
    SELECT 1 FROM outreach_threads t
    WHERE t.person_id = p.id
  );

DO $$
DECLARE
  v_count INT;
BEGIN
  SELECT count(*) INTO v_count FROM _placeholder_persons;
  IF v_count <> 3 THEN
    RAISE EXCEPTION
      '025_cleanup: expected exactly 3 placeholder persons, found %. Aborting.',
      v_count;
  END IF;
END $$;

-- ============================================================================
-- 2. DELETE PLACEHOLDER DATA (keep orgs)
-- ============================================================================

-- Activities first (FK to both thread_id and person_id)
DELETE FROM outreach_activities
WHERE person_id IN (SELECT id FROM _placeholder_persons);

-- Threads second (FK to person_id)
DELETE FROM outreach_threads
WHERE person_id IN (SELECT id FROM _placeholder_persons);

-- Person emails (FK to person_id)
DELETE FROM person_emails
WHERE person_id IN (SELECT id FROM _placeholder_persons);

-- Persons last
DELETE FROM persons
WHERE id IN (SELECT id FROM _placeholder_persons);

DROP TABLE _placeholder_persons;

-- ============================================================================
-- 3. ADD PROSPECT_STATUS TO OUTREACH_ORGS
-- ============================================================================

ALTER TABLE outreach_orgs ADD COLUMN IF NOT EXISTS prospect_status TEXT
  DEFAULT 'target_needs_contact'
  CHECK (prospect_status IN ('target_needs_contact', 'contact_identified', 'active'));

-- Mark orgs that have real threads as active
UPDATE outreach_orgs o SET prospect_status = 'active'
WHERE EXISTS (
  SELECT 1 FROM outreach_threads t WHERE t.org_id = o.id
);

COMMIT;

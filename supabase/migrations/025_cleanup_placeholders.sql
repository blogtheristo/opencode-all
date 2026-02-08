-- Migration 025: Remove placeholder persons, add prospect_status
-- Boardy feedback: only named humans get threads. Placeholder "Team" entries
-- create fake urgency, break dedupe, and ruin conversion stats.
-- Orgs are kept — prospect_status tracks "find the buyer first".
--
-- Safety: match on first_name + last_name = 'Team' to avoid nuking real people.
-- Delete order: activities → threads → person_emails → persons (respects FKs).
-- ON DELETE CASCADE exists on all FKs, but explicit order is clearer in migrations.

-- ============================================================================
-- 1. DELETE PLACEHOLDER PERSONS + THREADS (keep orgs)
-- ============================================================================

-- Activities first (FK to both thread_id and person_id)
DELETE FROM outreach_activities WHERE person_id IN (
  SELECT id FROM persons
  WHERE last_name = 'Team'
    AND first_name IN ('Partnerships', 'ISV Marketplace', 'Sustainability')
);

-- Threads second (FK to person_id)
DELETE FROM outreach_threads WHERE person_id IN (
  SELECT id FROM persons
  WHERE last_name = 'Team'
    AND first_name IN ('Partnerships', 'ISV Marketplace', 'Sustainability')
);

-- Person emails (FK to person_id)
DELETE FROM person_emails WHERE person_id IN (
  SELECT id FROM persons
  WHERE last_name = 'Team'
    AND first_name IN ('Partnerships', 'ISV Marketplace', 'Sustainability')
);

-- Persons last
DELETE FROM persons
WHERE last_name = 'Team'
  AND first_name IN ('Partnerships', 'ISV Marketplace', 'Sustainability');

-- ============================================================================
-- 2. ADD PROSPECT_STATUS TO OUTREACH_ORGS
-- ============================================================================

ALTER TABLE outreach_orgs ADD COLUMN IF NOT EXISTS prospect_status TEXT
  DEFAULT 'target_needs_contact'
  CHECK (prospect_status IN ('target_needs_contact', 'contact_identified', 'active'));

-- Mark orgs that have real threads as active
UPDATE outreach_orgs SET prospect_status = 'active'
WHERE id IN (SELECT DISTINCT org_id FROM outreach_threads WHERE org_id IS NOT NULL);

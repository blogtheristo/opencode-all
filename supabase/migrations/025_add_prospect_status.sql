-- =============================================================================
-- Migration 025: Add prospect_status to outreach_orgs
-- =============================================================================
-- Tracks org pipeline stage when no named contact thread exists yet.
-- Values:
--   target_needs_contact  — org identified, no human buyer found
--   contact_identified    — buyer name known, thread not yet created
--   active                — at least one outreach thread exists
-- =============================================================================

-- 1) Add column (idempotent)
ALTER TABLE outreach_orgs
  ADD COLUMN IF NOT EXISTS prospect_status TEXT;

-- 2) Backfill NULLs with default
UPDATE outreach_orgs
SET prospect_status = 'target_needs_contact'
WHERE prospect_status IS NULL;

-- 3) Add CHECK constraint (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'outreach_orgs_prospect_status_check'
  ) THEN
    ALTER TABLE outreach_orgs
      ADD CONSTRAINT outreach_orgs_prospect_status_check
      CHECK (prospect_status IN (
        'target_needs_contact',
        'contact_identified',
        'active'
      ));
  END IF;
END $$;

-- 4) Set default for future rows
ALTER TABLE outreach_orgs
  ALTER COLUMN prospect_status SET DEFAULT 'target_needs_contact';

-- 5) Mark orgs that already have threads as active
--    This is a one-time backfill. It intentionally overrides the default
--    'target_needs_contact' for any org with at least one thread.
--    Future status transitions (e.g. contact_identified → active) are
--    handled by application logic, not this migration.
UPDATE outreach_orgs o
SET prospect_status = 'active'
WHERE EXISTS (
  SELECT 1 FROM outreach_threads t WHERE t.org_id = o.id
);

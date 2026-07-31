-- ============================================================
-- Migration 057: Content Calendar for flow-media-outreach.ts
-- ============================================================
-- Purpose: Replaces file-system content schedule with a Supabase table
--          so flow-media-outreach.ts is DGX Spark safe (no local FS).
-- Date: 2026-04-07
-- Introduced-In: PR-TBD
-- Code-Version: 1.0
-- Branch: claude/check-supabase-schema-LS5eZ
-- ============================================================

BEGIN;

-- ============================================================
-- PART 1: CREATE TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS content_calendar (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_date   date NOT NULL,
    status      text NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft', 'scheduled', 'published', 'skipped')),
    platform    text NOT NULL
                CHECK (platform IN ('linkedin', 'newsletter', 'onelifetime')),
    title       text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE content_calendar IS 'Media outreach content schedule — source of truth for flow-media-outreach.ts';

-- Index for the primary query pattern: upcoming posts by date + status
CREATE INDEX IF NOT EXISTS idx_content_calendar_date_status
    ON content_calendar (post_date, status);

-- Auto-update updated_at on row change
CREATE OR REPLACE FUNCTION update_content_calendar_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_content_calendar_updated_at
    BEFORE UPDATE ON content_calendar
    FOR EACH ROW
    EXECUTE FUNCTION update_content_calendar_updated_at();

-- ============================================================
-- PART 2: ENABLE RLS + POLICIES (matches 011 pattern)
-- ============================================================

ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Backoffice admins can manage content_calendar" ON content_calendar;
CREATE POLICY "Backoffice admins can manage content_calendar"
  ON content_calendar FOR ALL
  USING (is_backoffice_admin())
  WITH CHECK (is_backoffice_admin());

DROP POLICY IF EXISTS "Service role has full access to content_calendar" ON content_calendar;
CREATE POLICY "Service role has full access to content_calendar"
  ON content_calendar FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- MIGRATION COMPLETE
-- ============================================================
-- Summary:
-- - Created content_calendar table with CHECK constraints
-- - Composite index on (post_date, status)
-- - updated_at trigger (auto-maintained)
-- - Enabled RLS with 2 policies (admin + service_role)
-- - Reuses is_backoffice_admin() from migration 011
-- ============================================================

COMMIT;

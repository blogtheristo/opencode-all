-- =============================================================================
-- Aiven PostgreSQL Sandbox — One-Time Initialization
-- =============================================================================
-- Purpose: Prepare Aiven PostgreSQL for daily Supabase mirror restore.
-- Run once after creating the Aiven service:
--   psql "$AIVEN_DATABASE_URL" -f scripts/aiven-init.sql
--
-- Version: 1.0 | Date: 2026-03-07
-- =============================================================================

-- 1. Enable pgvector extension (matches Supabase production)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create auth schema stubs for RLS policy compatibility
-- Supabase RLS policies reference auth.uid() and auth.jwt() which don't exist
-- on Aiven. These stubs return dummy values so RLS policies can be created
-- without errors. RLS is effectively open on the sandbox (acceptable).
CREATE SCHEMA IF NOT EXISTS auth;

CREATE OR REPLACE FUNCTION auth.uid()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
    SELECT '00000000-0000-0000-0000-000000000000'::uuid
$$;

CREATE OR REPLACE FUNCTION auth.jwt()
RETURNS jsonb
LANGUAGE sql
STABLE
AS $$
    SELECT '{}'::jsonb
$$;

CREATE OR REPLACE FUNCTION auth.role()
RETURNS text
LANGUAGE sql
STABLE
AS $$
    SELECT 'authenticated'::text
$$;

-- 3. Create backup metadata table (tracks restore history)
CREATE TABLE IF NOT EXISTS _backup_metadata (
    id            SERIAL PRIMARY KEY,
    restored_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_host   TEXT NOT NULL,
    source_db     TEXT NOT NULL,
    backup_date   DATE NOT NULL,
    manifest      JSONB,
    row_counts    JSONB,
    notes         TEXT
);

COMMENT ON TABLE _backup_metadata IS 'Tracks daily restore history from Supabase mirror pipeline';

-- 4. Grant permissions to avnadmin (Aiven default superuser)
-- This is a no-op if avnadmin already owns everything, but ensures
-- the restore user has full access.
GRANT ALL ON SCHEMA public TO avnadmin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO avnadmin;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO avnadmin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO avnadmin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO avnadmin;

-- 5. Informational output
DO $$
BEGIN
    RAISE NOTICE 'Aiven sandbox initialization complete.';
    RAISE NOTICE 'Auth stubs: auth.uid(), auth.jwt(), auth.role()';
    RAISE NOTICE 'Extension: pgvector enabled';
    RAISE NOTICE 'Ready for daily Supabase mirror restore.';
END
$$;

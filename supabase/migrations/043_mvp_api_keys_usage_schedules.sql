-- ============================================================================
-- Migration 043: MVP Feature Tables — API Keys, Usage Metering, Report Schedules
-- ============================================================================
--
-- Purpose:
--   Migrate 3 MVP features from in-memory stores to persistent Supabase tables.
--   1. api_keys        — Self-service API key management (SHA-256 hashed)
--   2. usage_events    — Per-user API call tracking for billing metering
--   3. usage_counters  — Aggregated monthly usage per user (materialized)
--   4. report_schedules — Recurring compliance report delivery configuration
--
-- Preconditions:
--   - Migration 007 (auth_users_orgs) must be applied (users table exists)
--   - RLS enabled on all new tables per DWS Security Standard §16
--
-- Rollback:
--   DROP TABLE IF EXISTS report_schedules CASCADE;
--   DROP TABLE IF EXISTS usage_counters CASCADE;
--   DROP TABLE IF EXISTS usage_events CASCADE;
--   DROP TABLE IF EXISTS api_keys CASCADE;
--   DROP TYPE IF EXISTS usage_event_type CASCADE;
--   DROP TYPE IF EXISTS report_frequency CASCADE;
--   DROP TYPE IF EXISTS report_format CASCADE;
--
-- Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. API Keys Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  name        TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  prefix      TEXT NOT NULL,                          -- First 12 chars + '****' for UI display
  hash        TEXT NOT NULL,                          -- SHA-256 hash of the full key
  scopes      TEXT[] NOT NULL DEFAULT '{compliance:read,usage:read}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ,
  revoked     BOOLEAN NOT NULL DEFAULT false,

  -- Constraints
  CONSTRAINT api_keys_name_not_empty CHECK (name <> ''),
  CONSTRAINT api_keys_hash_not_empty CHECK (hash <> '')
);

-- Index for key validation lookups (hash-based, exclude revoked)
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys (hash) WHERE NOT revoked;

-- Index for listing keys by user
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys (user_id, created_at DESC);

-- RLS
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys FORCE ROW LEVEL SECURITY;

-- Service role: full access
DROP POLICY IF EXISTS "service_role_all_api_keys" ON api_keys;
CREATE POLICY "service_role_all_api_keys" ON api_keys
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Authenticated users: can only see/manage their own keys
DROP POLICY IF EXISTS "users_own_api_keys" ON api_keys;
CREATE POLICY "users_own_api_keys" ON api_keys
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ============================================================================
-- 2. Usage Events Table (append-only event log)
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE usage_event_type AS ENUM ('api_call', 'assistant_message', 'report_export');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS usage_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  event_type  usage_event_type NOT NULL,
  endpoint    TEXT NOT NULL DEFAULT '',
  tokens      INTEGER,                               -- Optional: token count for LLM calls
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Partition-friendly index for monthly aggregation queries
CREATE INDEX IF NOT EXISTS idx_usage_events_user_month
  ON usage_events (user_id, created_at DESC);

-- Index for event type filtering
CREATE INDEX IF NOT EXISTS idx_usage_events_type
  ON usage_events (event_type, created_at DESC);

-- RLS
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events FORCE ROW LEVEL SECURITY;

-- Service role: full access (needed for server-side inserts)
DROP POLICY IF EXISTS "service_role_all_usage_events" ON usage_events;
CREATE POLICY "service_role_all_usage_events" ON usage_events
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

-- Authenticated users: can only read their own events
DROP POLICY IF EXISTS "users_read_own_usage_events" ON usage_events;
CREATE POLICY "users_read_own_usage_events" ON usage_events
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());


-- ============================================================================
-- 3. Usage Counters Table (materialized monthly aggregates)
-- ============================================================================

CREATE TABLE IF NOT EXISTS usage_counters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  period_start    DATE NOT NULL,                     -- First day of the billing month
  api_calls       INTEGER NOT NULL DEFAULT 0,
  assistant_msgs  INTEGER NOT NULL DEFAULT 0,
  report_exports  INTEGER NOT NULL DEFAULT 0,
  tier            TEXT NOT NULL DEFAULT 'free',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- One counter row per user per month
  CONSTRAINT usage_counters_unique_user_period UNIQUE (user_id, period_start)
);

CREATE INDEX IF NOT EXISTS idx_usage_counters_user_period
  ON usage_counters (user_id, period_start DESC);

-- RLS
ALTER TABLE usage_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_counters FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_usage_counters" ON usage_counters;
CREATE POLICY "service_role_all_usage_counters" ON usage_counters
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "users_read_own_usage_counters" ON usage_counters;
CREATE POLICY "users_read_own_usage_counters" ON usage_counters
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());


-- ============================================================================
-- 4. Report Schedules Table
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE report_frequency AS ENUM ('monthly', 'quarterly', 'annually');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE report_format AS ENUM ('json', 'csv');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS report_schedules (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL,
  company_name    TEXT NOT NULL CHECK (char_length(company_name) BETWEEN 1 AND 200),
  industry        TEXT NOT NULL,
  country         CHAR(2) NOT NULL DEFAULT 'FI',
  frequency       report_frequency NOT NULL,
  format          report_format NOT NULL DEFAULT 'json',
  recipient_email TEXT NOT NULL,
  next_run_at     TIMESTAMPTZ NOT NULL,
  enabled         BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_report_schedules_user
  ON report_schedules (user_id, created_at DESC);

-- Index for scheduler: find enabled schedules due to run
CREATE INDEX IF NOT EXISTS idx_report_schedules_next_run
  ON report_schedules (next_run_at) WHERE enabled = true;

-- RLS
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_schedules FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all_report_schedules" ON report_schedules;
CREATE POLICY "service_role_all_report_schedules" ON report_schedules
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "users_own_report_schedules" ON report_schedules;
CREATE POLICY "users_own_report_schedules" ON report_schedules
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());


-- ============================================================================
-- 5. Helper Function: Increment Usage Counter (atomic upsert)
-- ============================================================================

CREATE OR REPLACE FUNCTION increment_usage_counter(
  p_user_id UUID,
  p_event_type usage_event_type,
  p_tier TEXT DEFAULT 'free'
)
RETURNS TABLE(api_calls INTEGER, assistant_msgs INTEGER, report_exports INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_period_start DATE := date_trunc('month', CURRENT_DATE)::DATE;
BEGIN
  -- Caller guard: service_role only
  IF COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role' THEN
    RAISE EXCEPTION 'forbidden — service_role only';
  END IF;

  -- Atomic upsert + increment
  INSERT INTO usage_counters (user_id, period_start, tier,
    api_calls, assistant_msgs, report_exports)
  VALUES (
    p_user_id, v_period_start, p_tier,
    CASE WHEN p_event_type = 'api_call' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'assistant_message' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'report_export' THEN 1 ELSE 0 END
  )
  ON CONFLICT (user_id, period_start)
  DO UPDATE SET
    api_calls = usage_counters.api_calls +
      CASE WHEN p_event_type = 'api_call' THEN 1 ELSE 0 END,
    assistant_msgs = usage_counters.assistant_msgs +
      CASE WHEN p_event_type = 'assistant_message' THEN 1 ELSE 0 END,
    report_exports = usage_counters.report_exports +
      CASE WHEN p_event_type = 'report_export' THEN 1 ELSE 0 END,
    tier = p_tier,
    updated_at = now();

  -- Return the updated counters
  RETURN QUERY
    SELECT uc.api_calls, uc.assistant_msgs, uc.report_exports
    FROM usage_counters uc
    WHERE uc.user_id = p_user_id AND uc.period_start = v_period_start;
END;
$$;


-- ============================================================================
-- 6. Sanity Checks
-- ============================================================================

DO $$
BEGIN
  -- Verify all 4 tables exist
  ASSERT (SELECT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'api_keys')),
    'FAIL: api_keys table not created';
  ASSERT (SELECT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'usage_events')),
    'FAIL: usage_events table not created';
  ASSERT (SELECT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'usage_counters')),
    'FAIL: usage_counters table not created';
  ASSERT (SELECT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'report_schedules')),
    'FAIL: report_schedules table not created';

  -- Verify RLS is enabled on all tables
  ASSERT (SELECT rowsecurity FROM pg_tables WHERE tablename = 'api_keys'),
    'FAIL: RLS not enabled on api_keys';
  ASSERT (SELECT rowsecurity FROM pg_tables WHERE tablename = 'usage_events'),
    'FAIL: RLS not enabled on usage_events';
  ASSERT (SELECT rowsecurity FROM pg_tables WHERE tablename = 'usage_counters'),
    'FAIL: RLS not enabled on usage_counters';
  ASSERT (SELECT rowsecurity FROM pg_tables WHERE tablename = 'report_schedules'),
    'FAIL: RLS not enabled on report_schedules';

  RAISE NOTICE 'Migration 043: All 4 tables created with RLS ✓';
END;
$$;

COMMIT;

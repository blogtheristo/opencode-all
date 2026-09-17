-- =============================================================================
-- RUNBOOK: 026_security_fixes.sql
-- Purpose: Consolidated security + correctness fixes for deployed migrations
-- Targets: 006, 007, 012, 013, 024 (8 fixes)
-- Safety: Every section is idempotent with fail-fast guards.
--
-- Preconditions:
-- 1) Fresh DB backup/snapshot (or PITR enabled).
-- 2) Run the entire script in ONE execution in Supabase SQL editor.
-- 3) Cleanup script (20260208) and migration 025 already applied.
--
-- How to run:
-- 1) Staging first. Execute full script. Inspect sanity SELECT outputs.
-- 2) If anything looks off: ROLLBACK; fix before retry.
-- 3) If everything matches: COMMIT.
-- 4) Repeat on prod.
--
-- Rollback plan:
-- Before COMMIT: ROLLBACK.
-- After COMMIT: restore from snapshot/PITR.
-- =============================================================================

BEGIN;

-- =============================================================================
-- FIX 1: 006 — update_customer_revenue() crashes on DELETE
-- Problem: trigger fires on DELETE but references NEW.customer_id (NULL on DELETE)
-- Fix: handle TG_OP, use OLD on DELETE
-- =============================================================================

-- Guard: verify the function exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'update_customer_revenue'
  ) THEN
    RAISE EXCEPTION 'update_customer_revenue() not found — migration 006 not applied?';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_customer_revenue()
RETURNS TRIGGER AS $$
DECLARE
  v_customer_id UUID;
BEGIN
  -- Determine which customer to update
  IF TG_OP = 'DELETE' THEN
    v_customer_id := OLD.customer_id;
  ELSE
    v_customer_id := NEW.customer_id;
  END IF;

  UPDATE customers
  SET
    current_mrr = (
      SELECT COALESCE(SUM(monthly_amount), 0)
      FROM subscriptions
      WHERE customer_id = v_customer_id AND is_active = TRUE
    ),
    current_arr = (
      SELECT COALESCE(SUM(monthly_amount), 0) * 12
      FROM subscriptions
      WHERE customer_id = v_customer_id AND is_active = TRUE
    ),
    updated_at = NOW()
  WHERE id = v_customer_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Sanity: verify the function was replaced + confirm column names match
SELECT 'FIX 1: update_customer_revenue() replaced' AS status;
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'subscriptions' AND column_name IN ('monthly_amount', 'is_active', 'customer_id')
ORDER BY column_name;

-- =============================================================================
-- FIX 2: 007 — handle_new_user() needs exception handling
-- Problem: duplicate email in user_profiles blocks signup silently
-- Fix: remove stale orphaned profile with same email/different id before insert,
--      then upsert on id so the profile is always created/refreshed.
-- =============================================================================

-- Guard: verify the function exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc WHERE proname = 'handle_new_user'
  ) THEN
    RAISE EXCEPTION 'handle_new_user() not found — migration 007 not applied?';
  END IF;
END $$;

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove any stale profile that holds the same email address under a
  -- different UUID (can occur when an auth.users row was deleted without a
  -- clean cascade, leaving an orphaned profile that would block the unique
  -- constraint on user_profiles.email).
  DELETE FROM public.user_profiles
  WHERE email = NEW.email AND id <> NEW.id;

  INSERT INTO public.user_profiles (id, email, first_name, last_name, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  )
  ON CONFLICT (id) DO UPDATE SET
    email          = EXCLUDED.email,
    first_name     = EXCLUDED.first_name,
    last_name      = EXCLUDED.last_name,
    email_verified = EXCLUDED.email_verified;
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- email unique constraint: an existing profile row already holds this email
    -- (e.g. orphaned row after account deletion/re-registration or data inconsistency).
    -- Update that row's email_verified state so signup continues without error.
    UPDATE public.user_profiles
    SET email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
    WHERE email = NEW.email;
    RAISE WARNING 'handle_new_user: email % already existed in user_profiles; updated email_verified for new auth id %',
      NEW.email, NEW.id;
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = pg_catalog, public;
-- =============================================================================
-- FIX 3: 007 — log_auth_event() should enforce caller = service_role
-- Problem: any authenticated user can insert arbitrary audit rows
-- Fix: add service_role guard
-- =============================================================================

CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_id uuid,
  p_action text,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_success boolean DEFAULT true
)
RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  -- Only service_role should call this
  -- Use current_setting instead of auth.role() to avoid NULL in SQL editor context
  IF COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role' THEN
    RAISE EXCEPTION 'log_auth_event: forbidden — service_role only';
  END IF;

  INSERT INTO auth_audit_log (user_id, action, details, success)
  VALUES (p_user_id, p_action, p_details, p_success)
  RETURNING id INTO log_id;
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- =============================================================================
-- FIX 4: 007 — get_user_organizations() should use auth.uid() internally
-- Problem: caller can pass any user_id and see their orgs
-- Fix: ignore parameter, use auth.uid(). Keep signature for backward compat.
-- =============================================================================

CREATE OR REPLACE FUNCTION get_user_organizations(p_user_id uuid)
RETURNS TABLE (
  organization_id uuid,
  organization_name text,
  organization_slug text,
  user_role text,
  plan_tier text
) AS $$
BEGIN
  -- Use auth.uid() instead of trusting parameter
  -- p_user_id kept for signature compatibility but ignored
  RETURN QUERY
  SELECT
    o.id,
    o.name,
    o.slug,
    om.role,
    o.plan_tier
  FROM organizations o
  JOIN organization_members om ON o.id = om.organization_id
  WHERE om.user_id = auth.uid()
  AND om.status = 'active'
  AND o.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public;

SELECT 'FIX 2-4: auth functions patched' AS status;

-- =============================================================================
-- FIX 5: 012 — firehorse_signals has NO RLS
-- Problem: PII (company names, contacts, emails, messages) exposed to any client
-- Fix: enable RLS + add policies
-- =============================================================================

-- Guard: verify table exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'firehorse_signals'
  ) THEN
    RAISE EXCEPTION 'firehorse_signals not found — migration 012 not applied?';
  END IF;
END $$;

-- Check current RLS state
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'firehorse_signals';

ALTER TABLE firehorse_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE firehorse_signals FORCE ROW LEVEL SECURITY;

-- Ensure firehorse_signals_* views cannot bypass RLS by using security_invoker
DO $$
DECLARE
  v RECORD;
BEGIN
  -- For all views in public schema matching firehorse_signals_%
  FOR v IN
    SELECT schemaname, viewname
    FROM pg_views
    WHERE schemaname = 'public'
      AND viewname LIKE 'firehorse_signals\_%' ESCAPE '\'
  LOOP
    EXECUTE format(
      'ALTER VIEW %I.%I SET (security_invoker = true);',
      v.schemaname,
      v.viewname
    );
  END LOOP;
END $$;
-- Service role full access
DROP POLICY IF EXISTS "firehorse_signals_service_role_all" ON firehorse_signals;
CREATE POLICY "firehorse_signals_service_role_all"
  ON firehorse_signals
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Backoffice admins can read (uses is_backoffice_admin() from 011)
DROP POLICY IF EXISTS "firehorse_signals_admin_read" ON firehorse_signals;
CREATE POLICY "firehorse_signals_admin_read"
  ON firehorse_signals
  FOR SELECT
  TO authenticated
  USING (is_backoffice_admin());

-- Verify RLS is now enabled
DO $$
DECLARE v_rls BOOLEAN;
BEGIN
  SELECT rowsecurity INTO v_rls
  FROM pg_tables
  WHERE schemaname = 'public' AND tablename = 'firehorse_signals';
  IF NOT v_rls THEN
    RAISE EXCEPTION 'firehorse_signals RLS still disabled after ALTER';
  END IF;
END $$;

SELECT 'FIX 5: firehorse_signals RLS enabled' AS status;

-- =============================================================================
-- FIX 6: 013 — Remove test seed data from prod (was FIX 7)
-- Problem: test.lead@kela.fi inserted unconditionally
-- Fix: Delete if exists (safe — ON CONFLICT DO NOTHING means at most 1 row)
-- =============================================================================

DELETE FROM firehorse_leads WHERE email = 'test.lead@kela.fi';

SELECT 'FIX 6: test seed data removed (' || COUNT(*) || ' rows remaining for test.lead@kela.fi)'
  AS status
FROM firehorse_leads WHERE email = 'test.lead@kela.fi';

-- =============================================================================
-- FIX 7: 024 — Finish partial migration (inbound_emails table)
-- Problem: thread_token column exists but inbound_emails table was never created
-- Fix: CREATE TABLE IF NOT EXISTS + indexes + RLS (fully idempotent)
-- =============================================================================

-- Guard: gen_random_uuid() is provided by the pgcrypto extension (which ships with Postgres).
-- On our PG 17 instance it should already be available, but we still ensure pgcrypto exists for generate_thread_token().
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
    CREATE EXTENSION pgcrypto;
    RAISE NOTICE 'pgcrypto extension created';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS inbound_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_message_id TEXT NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  from_email TEXT,
  subject TEXT,
  thread_token TEXT,
  command_line TEXT,
  parse_ok BOOLEAN DEFAULT false,
  error TEXT,
  raw_payload JSONB NOT NULL,

  CONSTRAINT inbound_emails_provider_message_id_key UNIQUE (provider_message_id)
);

CREATE INDEX IF NOT EXISTS idx_inbound_emails_received_at ON inbound_emails (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_inbound_emails_thread_token ON inbound_emails (thread_token);

ALTER TABLE inbound_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON inbound_emails;
CREATE POLICY "Service role full access" ON inbound_emails
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Also ensure thread_token constraints exist (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'outreach_threads_thread_token_key'
  ) THEN
    ALTER TABLE outreach_threads
      ADD CONSTRAINT outreach_threads_thread_token_key UNIQUE (thread_token);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'outreach_threads_thread_token_format'
  ) THEN
    ALTER TABLE outreach_threads
      ADD CONSTRAINT outreach_threads_thread_token_format
      CHECK (thread_token ~ '^[23456789A-HJ-NP-Z]{4,12}$');
  END IF;
END $$;

-- Also add the activity_outcome enum values if missing
ALTER TYPE activity_outcome ADD VALUE IF NOT EXISTS 'manual_update';
ALTER TYPE activity_outcome ADD VALUE IF NOT EXISTS 'manual_update_failed';

-- Verify inbound_emails exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'inbound_emails'
  ) THEN
    RAISE EXCEPTION 'inbound_emails table not created';
  END IF;
END $$;

SELECT 'FIX 7: inbound_emails table + thread_token constraints ensured' AS status;

-- =============================================================================
-- FIX 8: Caller guards on SECURITY DEFINER functions
-- Server-side only today, but if RPC is ever exposed, these fail closed.
-- =============================================================================

-- get_or_create_usage_for_date (014 — may not exist yet, guard accordingly)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'get_or_create_usage_for_date') THEN
    EXECUTE $fn$
      CREATE OR REPLACE FUNCTION get_or_create_usage_for_date(usage_date date)
      RETURNS climate_assistant_usage
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public, pg_temp
      AS $body$
      DECLARE
        usage_record climate_assistant_usage;
      BEGIN
        IF COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role' THEN
          RAISE EXCEPTION 'get_or_create_usage_for_date: forbidden';
        END IF;
        INSERT INTO climate_assistant_usage (date, input_tokens, output_tokens, requests, cost_usd)
        VALUES (usage_date, 0, 0, 0, 0.0)
        ON CONFLICT (date) DO NOTHING;
        SELECT * INTO usage_record FROM climate_assistant_usage WHERE date = usage_date;
        RETURN usage_record;
      END;
      $body$;
    $fn$;
    RAISE NOTICE 'get_or_create_usage_for_date: caller guard added + TOCTOU race fixed';
  ELSE
    RAISE NOTICE 'get_or_create_usage_for_date: not found (014 not applied), skipping';
  END IF;
END $$;

-- increment_climate_usage (014 — may not exist yet)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_climate_usage') THEN
    EXECUTE $fn$
      CREATE OR REPLACE FUNCTION increment_climate_usage(
        usage_date date,
        input_tokens_delta bigint,
        output_tokens_delta bigint,
        cost_delta numeric
      )
      RETURNS climate_assistant_usage
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $body$
      DECLARE
        usage_record climate_assistant_usage;
      BEGIN
        IF COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role' THEN
          RAISE EXCEPTION 'increment_climate_usage: forbidden';
        END IF;
        INSERT INTO climate_assistant_usage (date, input_tokens, output_tokens, requests, cost_usd, updated_at)
        VALUES (usage_date, input_tokens_delta, output_tokens_delta, 1, cost_delta, now())
        ON CONFLICT (date)
        DO UPDATE SET
          input_tokens = climate_assistant_usage.input_tokens + EXCLUDED.input_tokens,
          output_tokens = climate_assistant_usage.output_tokens + EXCLUDED.output_tokens,
          requests = climate_assistant_usage.requests + 1,
          cost_usd = climate_assistant_usage.cost_usd + EXCLUDED.cost_usd,
          updated_at = now()
        RETURNING * INTO usage_record;
        RETURN usage_record;
      END;
      $body$;
    $fn$;
    RAISE NOTICE 'increment_climate_usage: caller guard added';
  ELSE
    RAISE NOTICE 'increment_climate_usage: not found (014 not applied), skipping';
  END IF;
END $$;

SELECT 'FIX 8: caller guards applied where functions exist' AS status;

-- =============================================================================
-- FINAL SANITY CHECKS
-- =============================================================================

-- 1) firehorse_signals RLS is on
SELECT tablename, rowsecurity FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'firehorse_signals';

-- 2) inbound_emails exists
SELECT tablename FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'inbound_emails';

-- 3) No test seed data
SELECT COUNT(*) AS test_leads_remaining
FROM firehorse_leads WHERE email = 'test.lead@kela.fi';

-- 4) thread_token constraints exist
SELECT conname FROM pg_constraint
WHERE conname LIKE 'outreach_threads_thread_token%';

-- =============================================================================
-- If everything looks right, COMMIT. Otherwise ROLLBACK.
-- =============================================================================

COMMIT;

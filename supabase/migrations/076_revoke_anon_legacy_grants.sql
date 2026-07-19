-- Migration 076: Revoke legacy anon grants — strict opt-in anon model
--
-- STATUS: DRAFT — do NOT apply to production before the staging soak test.
-- Rollout plan (Admin manual §7.5, DWS_SECURITY_STANDARD §16.0.1):
--   1. Apply to a staging environment (local `supabase db reset` or a preview
--      branch) and run the e2e suites against it.
--   2. Watch for unexpected 42501/403s on the public surfaces below.
--   3. Apply to production; keep this file as the instant-rollback reference
--      (each opt-in grant below is also the re-grant statement).
--
-- Why: the dws6 project predates Supabase's 2026-05-30 grant change, so anon
-- still holds the grandfathered legacy default — FULL privileges (SELECT/
-- INSERT/UPDATE/DELETE/TRUNCATE/TRIGGER/REFERENCES) on every public table.
-- RLS is the only thing between an anon key and the data. This migration
-- drops anon to a strict opt-in model.
--
-- Evidence base (pg_stat_statements since 2026-02-05, checked 2026-07-19):
-- anon's real traffic is exclusively the booking flow (booking_services,
-- booking_availability, finnish_holidays, booking_reservations select+insert).
-- Everything else anon touched was 1-3 call table-enumeration probes that RLS
-- returned empty — exactly the traffic this migration is meant to shut out at
-- the table-level door.
--
-- Opt-in list derived from pg_policies: every policy that explicitly targets
-- `anon`, plus public-read-true policies on reference-data tables.
--
-- Idempotent. Safe to re-run.

BEGIN;

-- ============================================================
-- Phase A: revoke the legacy blanket grants from anon
-- ============================================================

revoke all privileges on all tables    in schema public from anon;
revoke all privileges on all sequences in schema public from anon;
revoke execute        on all functions in schema public from anon;

-- Future objects: strip anon from the postgres role's default privileges.
-- (supabase_admin's default ACL cannot be altered from the postgres role;
-- Supabase's 2026-10-30 enforcement retires that side.)
alter default privileges in schema public revoke all     on tables    from anon;
alter default privileges in schema public revoke all     on sequences from anon;
alter default privileges in schema public revoke execute on functions from anon;

-- anon keeps schema USAGE — required to reach the opt-in tables below.
grant usage on schema public to anon;

-- NOTE (out of scope here): PostgreSQL grants EXECUTE to the PUBLIC
-- pseudo-role on new functions by default, so SECURITY DEFINER functions
-- remain anon-callable until revoked from PUBLIC per-function. That is the
-- Advisor's `anon_security_definer_function_executable` finding (19
-- functions) — handle in a dedicated follow-up migration after reviewing
-- each function, since revoking PUBLIC affects every role without an
-- explicit grant.

-- ============================================================
-- Phase B: strict opt-in re-grants (existence-safe)
-- ============================================================
-- Every entry maps to an RLS policy that explicitly permits the action for
-- anon (or a public-read-true policy on reference data). RLS still gates rows.

do $$
declare
  t text;
begin
  -- Anon SELECT: public-read surfaces.
  foreach t in array array[
    'booking_services',        -- 064 services_public_read (true)
    'booking_availability',    -- 064 availability_public_read (true)
    'finnish_holidays',        -- 064 holidays_public_read (true)
    'booking_reservations',    -- 064 reservations_select_self (RLS filters rows; anon slot checks observed in telemetry)
    'v_booked_slots',          -- 072 security_invoker view for the public slot calendar
    'subscription_plans',      -- 008 subscription_plans_public_select (is_active)
    'emission_factors',        -- "Anyone can read emission factors" (true)
    'ontology_industries',     -- 070 anon read (true) — landing-page taxonomy
    'ontology_enterprises',    -- 070 anon read (true) — landing-page taxonomy
    'studios_projects',        -- "Public projects visible to all" (is_public)
    'studios_project_versions',-- "Public versions visible" (parent is_public)
    'studios_projects_public', -- public view over studios_projects
    'file_index'               -- 015 local-only table (anon read ACTIVE rows); skipped where absent
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('grant select on public.%I to anon', t);
    end if;
  end loop;

  -- Anon INSERT: public form submissions.
  foreach t in array array[
    'booking_reservations',    -- 064 reservations_insert_anon
    'captain_inquiries',       -- 034 "Anyone can submit an inquiry"
    'web_leads',               -- 070 "Anyone can submit a web lead"
    'playbook_leads',          -- 068 "anon can insert playbook leads"
    'blog_subscribers'         -- blog_subscribers_anon_insert
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('grant insert on public.%I to anon', t);
    end if;
  end loop;
end $$;

COMMIT;

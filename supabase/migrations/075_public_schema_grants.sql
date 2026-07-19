-- Migration 075: Backfill Data API grants on public schema
--
-- Supabase is dropping the implicit grants on public.* to anon/authenticated/service_role.
-- New projects: 2026-05-30. All existing projects: 2026-10-30.
-- Without explicit GRANTs, PostgREST/supabase-js/GraphQL return 42501 even when RLS would allow.
--
-- This migration:
--   1. Grants schema USAGE to all three Data API roles.
--   2. Grants full CRUD on every existing public table to service_role + authenticated.
--      RLS remains the row-level gate; this only reopens the table-level door.
--   3. Grants USAGE/SELECT on sequences and EXECUTE on functions to those two roles.
--   4. Sets ALTER DEFAULT PRIVILEGES so future tables land granted even if a migration
--      forgets the inline block.
--   5. Grants per-table anon access ONLY where an RLS policy explicitly allows it
--      (booking_services/availability/holidays/subscription_plans/file_index public read;
--      booking_reservations/captain_inquiries/web_leads/playbook_leads anon insert).
--
-- Idempotent. Safe to re-run.

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete
  on all tables in schema public
  to authenticated, service_role;

grant usage, select on all sequences in schema public
  to authenticated, service_role;

grant execute on all functions in schema public
  to authenticated, service_role;

-- Future tables created without an inline grant still land safely.
alter default privileges in schema public
  grant select, insert, update, delete on tables
  to authenticated, service_role;

alter default privileges in schema public
  grant usage, select on sequences
  to authenticated, service_role;

alter default privileges in schema public
  grant execute on functions
  to authenticated, service_role;

-- Anon grants are existence-safe: some tables exist only in local migration
-- files, not in the remote schema (e.g. file_index — remote prefix 015 is
-- email_templates). A missing table must not abort the whole backfill.
do $$
declare
  t text;
begin
  -- Anon SELECT: tables whose RLS policies grant public read.
  foreach t in array array[
    'booking_services',
    'booking_availability',
    'finnish_holidays',
    'subscription_plans',
    'file_index'
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('grant select on public.%I to anon', t);
    end if;
  end loop;

  -- Anon INSERT: tables whose RLS policies accept anon submissions.
  foreach t in array array[
    'booking_reservations',
    'captain_inquiries',
    'web_leads',
    'playbook_leads'
  ] loop
    if to_regclass('public.' || t) is not null then
      execute format('grant insert on public.%I to anon', t);
    end if;
  end loop;
end $$;

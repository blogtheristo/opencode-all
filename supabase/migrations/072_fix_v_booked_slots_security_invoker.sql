-- Migration 072: Fix SECURITY DEFINER view on v_booked_slots
--
-- Recreates public.v_booked_slots with security_invoker = on so Postgres
-- permissions and RLS of the *querying* user are enforced, not the view
-- owner's. Fixes Supabase lint: "Security Definer View" on public.v_booked_slots.
--
-- Safe change: the booking API (src/routes/booking.routes.ts) queries this view
-- via getSupabaseClient() = service_role, which bypasses RLS regardless — so
-- conflict detection is unaffected. Mirrors migrations 032 (cap-table views) and
-- 039 (construction_leads views), which already use security_invoker.
--
-- View body is unchanged from migration 064.

DROP VIEW IF EXISTS public.v_booked_slots;

CREATE VIEW public.v_booked_slots
WITH (security_invoker = on) AS
  SELECT
    service_id,
    reserved_at AS slot_start,
    reserved_at + (duration_minutes || ' minutes')::interval AS slot_end
  FROM booking_reservations
  WHERE status = 'confirmed';

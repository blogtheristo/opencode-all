-- Ported from supabase/migrations/053_system_heartbeat.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- The source comment says this table's purpose is "prevents Supabase from
-- pausing due to inactivity" — that reason is moot once this leaves Supabase.
-- It is ported anyway because it has a real, live consumer:
-- src/morning-briefing/data-collectors.ts (supabaseUpsertHeartbeat()) does a
-- POST /rest/v1/system_heartbeat upsert with {id: 'dws6', last_beat, source,
-- version} on every morning-briefing run. If that write path stays pointed at
-- this database, the table needs to exist here too.

CREATE TABLE IF NOT EXISTS system_heartbeat (
    id          text PRIMARY KEY DEFAULT 'dws6',
    last_beat   timestamptz NOT NULL DEFAULT now(),
    source      text NOT NULL DEFAULT 'morning-briefing',
    version     text
);

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
GRANT ALL ON system_heartbeat TO dws_backend;

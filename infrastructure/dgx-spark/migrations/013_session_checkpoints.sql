-- Ported from supabase/migrations/055_session_checkpoints.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- pg_cron caveat: the source file's cleanup job was already commented out in
-- the original migration (`-- SELECT cron.schedule('cleanup-expired-checkpoints', ...)`),
-- never actually enabled. No pg_cron equivalent is added here either — TTL
-- cleanup of expired checkpoints now happens at the application level via
-- dws-cron's node-cron, not inside the database.

BEGIN;

CREATE TABLE IF NOT EXISTS session_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  org_id TEXT NOT NULL,
  agent_name TEXT NOT NULL,
  state JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  -- One checkpoint per session+agent (latest wins via upsert)
  UNIQUE (session_id, agent_name)
);

CREATE INDEX IF NOT EXISTS idx_session_checkpoints_lookup ON session_checkpoints (session_id, org_id, agent_name);
CREATE INDEX IF NOT EXISTS idx_session_checkpoints_expiry ON session_checkpoints (expires_at);

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
GRANT ALL ON session_checkpoints TO dws_backend;

COMMIT;

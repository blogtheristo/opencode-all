-- Ported from supabase/migrations/044_hil_escalations.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime

BEGIN;

CREATE TABLE IF NOT EXISTS hil_escalations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name     TEXT NOT NULL,
  reason         TEXT NOT NULL,
  confidence     NUMERIC(4,3),           -- 0.000–1.000
  context        JSONB DEFAULT '{}',     -- agent-specific escalation context
  channel        TEXT NOT NULL DEFAULT 'email',  -- 'email', 'slack'
  recipient      TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at    TIMESTAMPTZ,
  resolved_by    TEXT
);

CREATE INDEX IF NOT EXISTS idx_hil_escalations_pending ON hil_escalations (created_at DESC)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_hil_escalations_agent ON hil_escalations (agent_name);

COMMENT ON TABLE hil_escalations IS
  'Agent escalation records. Created when agent confidence drops below 80%. Human is notified via email/Slack to review the agent output.';

-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
GRANT ALL ON hil_escalations TO dws_backend;

COMMIT;

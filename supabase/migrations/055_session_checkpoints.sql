-- Migration 055: Session Checkpoints (ASTA Phase 1)
-- Persists agent loop state for interruption recovery.
-- Checkpoints have 24h TTL and are cleaned by pg_cron.

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

CREATE INDEX idx_session_checkpoints_lookup ON session_checkpoints (session_id, org_id, agent_name);
CREATE INDEX idx_session_checkpoints_expiry ON session_checkpoints (expires_at);

-- RLS: service_role only
ALTER TABLE session_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY session_checkpoints_service_role ON session_checkpoints
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Auto-cleanup expired checkpoints daily (requires pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-checkpoints', '0 4 * * *',
--   $$DELETE FROM session_checkpoints WHERE expires_at < NOW()$$
-- );

COMMIT;

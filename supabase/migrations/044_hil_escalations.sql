-- Migration 044: HIL Escalations
-- Stores agent escalation records when confidence < 80%.
-- Agents call POST /api/hil/escalate to create records and notify humans.

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

CREATE INDEX idx_hil_escalations_pending ON hil_escalations (created_at DESC)
  WHERE status = 'pending';
CREATE INDEX idx_hil_escalations_agent ON hil_escalations (agent_name);

-- RLS: service key only (internal table, not exposed to anonymous users)
ALTER TABLE hil_escalations ENABLE ROW LEVEL SECURITY;
CREATE POLICY hil_escalations_service_only ON hil_escalations
  USING (auth.role() = 'service_role');

COMMENT ON TABLE hil_escalations IS
  'Agent escalation records. Created when agent confidence drops below 80%. Human is notified via email/Slack to review the agent output.';

COMMIT;

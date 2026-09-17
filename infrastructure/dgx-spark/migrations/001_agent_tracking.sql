-- Ported from supabase/migrations/013_agent_tracking.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- Only the four agent-runtime tables are ported. Everything else in the source
-- file (ALTER TABLE firehorse_leads/firehorse_events, the event_type enum, the
-- v_high_priority_leads / v_pending_approvals / v_agent_performance_leaderboard
-- views, the sample-data INSERT, and update_updated_at_column()/its trigger) is
-- scoped to firehorse_leads/firehorse_events, which are NOT moving to
-- dws-postgres — those stay in supabase/migrations/ untouched.
--
-- update_agent_metrics() is also excluded: it SELECTs from firehorse_events and
-- firehorse_leads to compute daily rollups, so it cannot run against this
-- database once those tables are gone. If dws-backend/dws-cron need equivalent
-- rollup logic here, it must be rewritten against whatever replaces the
-- firehorse event stream on this side of the split — that is an application
-- change, not a migration-porting judgment call.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- agent_metrics — daily performance metrics per AI agent
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,

  leads_processed INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  linkedin_connections INTEGER DEFAULT 0,
  linkedin_inmails INTEGER DEFAULT 0,

  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  emails_replied INTEGER DEFAULT 0,
  meetings_booked INTEGER DEFAULT 0,

  spam_complaints INTEGER DEFAULT 0,
  unsubscribes INTEGER DEFAULT 0,
  bounces INTEGER DEFAULT 0,
  avg_icp_score NUMERIC,
  avg_confidence_score NUMERIC,

  api_calls INTEGER DEFAULT 0,
  estimated_cost_eur NUMERIC DEFAULT 0,

  open_rate NUMERIC GENERATED ALWAYS AS (
    CASE WHEN emails_sent > 0 THEN ROUND((emails_opened::NUMERIC / emails_sent) * 100, 2) ELSE 0 END
  ) STORED,
  click_rate NUMERIC GENERATED ALWAYS AS (
    CASE WHEN emails_sent > 0 THEN ROUND((emails_clicked::NUMERIC / emails_sent) * 100, 2) ELSE 0 END
  ) STORED,
  reply_rate NUMERIC GENERATED ALWAYS AS (
    CASE WHEN emails_sent > 0 THEN ROUND((emails_replied::NUMERIC / emails_sent) * 100, 2) ELSE 0 END
  ) STORED,
  meeting_booked_rate NUMERIC GENERATED ALWAYS AS (
    CASE WHEN emails_sent > 0 THEN ROUND((meetings_booked::NUMERIC / emails_sent) * 100, 2) ELSE 0 END
  ) STORED,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(agent_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_agent_metrics_agent_date ON agent_metrics(agent_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_date ON agent_metrics(metric_date DESC);

COMMENT ON TABLE agent_metrics IS 'Daily performance metrics for each AI sales agent';

-- ============================================================================
-- agent_signals — Lifetime Scope Signals coordination
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  signal_type VARCHAR(50) NOT NULL CHECK (signal_type IN ('READY', 'COMPLETE', 'ERROR', 'BLOCKED')),
  milestone VARCHAR(100) NOT NULL,
  context_id VARCHAR(100),
  metadata JSONB DEFAULT '{}'::jsonb,
  emitted_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_signals_agent_id ON agent_signals(agent_id);
CREATE INDEX IF NOT EXISTS idx_signals_type ON agent_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_signals_emitted_at ON agent_signals(emitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_context ON agent_signals(context_id) WHERE context_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_signals_agent_milestone ON agent_signals(agent_id, milestone, emitted_at DESC);

COMMENT ON TABLE agent_signals IS 'Lifetime Scope Signals for agent-to-agent coordination';

-- ============================================================================
-- agent_costs — LLM + API cost tracking
-- ============================================================================
CREATE TABLE IF NOT EXISTS agent_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  cost_date DATE NOT NULL DEFAULT CURRENT_DATE,

  llm_provider VARCHAR(50),
  llm_model VARCHAR(100),
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  model_cost_eur NUMERIC DEFAULT 0,

  api_service VARCHAR(50),
  api_calls INTEGER DEFAULT 0,
  api_cost_eur NUMERIC DEFAULT 0,

  total_cost_eur NUMERIC GENERATED ALWAYS AS (model_cost_eur + api_cost_eur) STORED,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_costs_agent_date ON agent_costs(agent_id, cost_date DESC);
CREATE INDEX IF NOT EXISTS idx_costs_date ON agent_costs(cost_date DESC);

COMMENT ON TABLE agent_costs IS 'Detailed cost tracking for AI agent operations (LLM + API calls)';

-- ============================================================================
-- agent_approvals — Advisor-mode HIL approval workflow
-- ============================================================================
-- event_id originally REFERENCED firehorse_events(id) ON DELETE CASCADE.
-- firehorse_events is NOT moving to dws-postgres, so the FK is dropped; the
-- column is kept as a plain uuid. Referential integrity for event_id is now
-- application-level only.
CREATE TABLE IF NOT EXISTS agent_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL,
  agent_id VARCHAR(50) NOT NULL,
  approver_email VARCHAR(255) NOT NULL,

  action_type VARCHAR(50) NOT NULL,
  action_details JSONB NOT NULL,

  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  decision_at TIMESTAMPTZ,
  rejection_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON agent_approvals(status) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_approvals_agent_id ON agent_approvals(agent_id);
CREATE INDEX IF NOT EXISTS idx_approvals_approver ON agent_approvals(approver_email);
CREATE INDEX IF NOT EXISTS idx_approvals_created_at ON agent_approvals(created_at DESC);

COMMENT ON TABLE agent_approvals IS 'Approval workflow for agents in Advisor mode (HIL oversight). event_id no longer FKs firehorse_events (not on this database) — application-level integrity only.';

-- ============================================================================
-- Functions — self-contained (operate only on the tables above)
-- ============================================================================

CREATE OR REPLACE FUNCTION emit_agent_signal(
  p_agent_id VARCHAR,
  p_signal_type VARCHAR,
  p_milestone VARCHAR,
  p_context_id VARCHAR DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_signal_id UUID;
BEGIN
  INSERT INTO agent_signals (agent_id, signal_type, milestone, context_id, metadata)
  VALUES (p_agent_id, p_signal_type, p_milestone, p_context_id, p_metadata)
  RETURNING id INTO v_signal_id;

  RETURN v_signal_id;
END;
$$;

COMMENT ON FUNCTION emit_agent_signal IS 'Emit a Lifetime Scope Signal for agent coordination';

CREATE OR REPLACE FUNCTION expire_pending_approvals()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_expired_count INTEGER;
BEGIN
  UPDATE agent_approvals
  SET status = 'expired',
      decision_at = NOW()
  WHERE status = 'pending'
    AND expires_at <= NOW();

  GET DIAGNOSTICS v_expired_count = ROW_COUNT;
  RETURN v_expired_count;
END;
$$;

COMMENT ON FUNCTION expire_pending_approvals IS 'Auto-expire pending approvals after 24 hours';

-- ============================================================================
-- GRANTS — single consumer (dws_backend). Supabase RLS/policies removed.
-- ============================================================================
GRANT ALL ON agent_metrics TO dws_backend;
GRANT ALL ON agent_signals TO dws_backend;
GRANT ALL ON agent_costs TO dws_backend;
GRANT ALL ON agent_approvals TO dws_backend;
GRANT EXECUTE ON FUNCTION emit_agent_signal TO dws_backend;
GRANT EXECUTE ON FUNCTION expire_pending_approvals TO dws_backend;

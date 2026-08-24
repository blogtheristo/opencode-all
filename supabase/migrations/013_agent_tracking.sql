-- Agent Tracking Tables for Sales AI Agent System
-- DWS IQ 6 - Phase 1 Implementation
-- Created: 2026-01-19
-- Purpose: Extend Firehorse tables to support AI agent enrichment, scoring, and tracking

-- ============================================================================
-- EXTENSIONS TO EXISTING TABLES
-- ============================================================================

-- Add agent-specific columns to firehorse_leads
ALTER TABLE firehorse_leads
  ADD COLUMN IF NOT EXISTS revenue_eur NUMERIC,
  ADD COLUMN IF NOT EXISTS employee_count INTEGER,
  ADD COLUMN IF NOT EXISTS industry VARCHAR(100),
  ADD COLUMN IF NOT EXISTS headquarters VARCHAR(255),
  ADD COLUMN IF NOT EXISTS icp_score INTEGER CHECK (icp_score >= 0 AND icp_score <= 100),
  ADD COLUMN IF NOT EXISTS icp_breakdown JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS priority VARCHAR(20) CHECK (priority IN ('High', 'Medium', 'Low')),
  ADD COLUMN IF NOT EXISTS trigger_events JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS enrichment_data JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
  ADD COLUMN IF NOT EXISTS tech_stack JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS recent_news JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS agent_id VARCHAR(50) DEFAULT 'lead-scout-001',
  ADD COLUMN IF NOT EXISTS enriched_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_enriched_by VARCHAR(50);

-- Add indexes for agent queries
CREATE INDEX IF NOT EXISTS idx_leads_icp_score ON firehorse_leads(icp_score DESC) WHERE icp_score IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_priority ON firehorse_leads(priority) WHERE priority IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_segment ON firehorse_leads(segment);
CREATE INDEX IF NOT EXISTS idx_leads_agent_id ON firehorse_leads(agent_id);
CREATE INDEX IF NOT EXISTS idx_leads_enriched_at ON firehorse_leads(enriched_at);

-- Add comment for documentation
COMMENT ON COLUMN firehorse_leads.icp_score IS 'Ideal Customer Profile score (0-100) assigned by Lead Scout Agent';
COMMENT ON COLUMN firehorse_leads.priority IS 'Lead priority: High (70-100), Medium (50-69), Low (0-49)';
COMMENT ON COLUMN firehorse_leads.trigger_events IS 'Array of detected trigger events (new CSO hire, CSRD compliance, etc.)';
COMMENT ON COLUMN firehorse_leads.enrichment_data IS 'Full enrichment data from Apollo.io, Clearbit, LinkedIn';
COMMENT ON COLUMN firehorse_leads.confidence_score IS 'Agent confidence in data accuracy (0-100)';

-- ============================================================================
-- EXTEND firehorse_events FOR AGENT TRACKING
-- ============================================================================

-- Add new event types for agent activities
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_type' AND typtype = 'e') THEN
    CREATE TYPE event_type AS ENUM (
      'EmailSent',
      'EmailOpened',
      'LinkClicked',
      'Replied',
      'MeetingBooked',
      'StateChanged',
      'TaskCreated',
      'LeadEnriched',
      'IcpScored',
      'SequenceTriggered',
      'LinkedInConnection',
      'LinkedInInMail',
      'SpamComplaint',
      'Unsubscribed',
      'AgentError'
    );
  ELSE
    -- Add new enum values if type already exists
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'LeadEnriched';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'IcpScored';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'SequenceTriggered';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'LinkedInConnection';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'LinkedInInMail';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'SpamComplaint';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'Unsubscribed';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'AgentError';
  END IF;
END
$$;

-- Add agent-specific columns to firehorse_events
ALTER TABLE firehorse_events
  ADD COLUMN IF NOT EXISTS agent_id VARCHAR(50),
  ADD COLUMN IF NOT EXISTS sequence_type VARCHAR(50),
  ADD COLUMN IF NOT EXISTS touch_number INTEGER,
  ADD COLUMN IF NOT EXISTS channel VARCHAR(50) CHECK (channel IN ('email', 'linkedin_connection', 'linkedin_inmail', 'phone', 'other')),
  ADD COLUMN IF NOT EXISTS subject_line TEXT,
  ADD COLUMN IF NOT EXISTS subject_line_variant VARCHAR(10),
  ADD COLUMN IF NOT EXISTS body TEXT,
  ADD COLUMN IF NOT EXISTS cta TEXT,
  ADD COLUMN IF NOT EXISTS status VARCHAR(50) CHECK (status IN ('draft', 'pending_approval', 'scheduled', 'sent', 'bounced', 'spam_complaint', 'unsubscribed', 'error')),
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS opened_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approval_required BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS approved_by VARCHAR(100),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add indexes for agent event queries
CREATE INDEX IF NOT EXISTS idx_events_agent_id ON firehorse_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON firehorse_events(status);
CREATE INDEX IF NOT EXISTS idx_events_scheduled_at ON firehorse_events(scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_sent_at ON firehorse_events(sent_at) WHERE sent_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_events_channel ON firehorse_events(channel);
CREATE INDEX IF NOT EXISTS idx_events_pending_approval ON firehorse_events(status) WHERE status = 'pending_approval';

-- ============================================================================
-- NEW TABLES FOR AGENT SYSTEM
-- ============================================================================

-- Agent performance metrics table
CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Volume metrics
  leads_processed INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  linkedin_connections INTEGER DEFAULT 0,
  linkedin_inmails INTEGER DEFAULT 0,

  -- Engagement metrics
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  emails_replied INTEGER DEFAULT 0,
  meetings_booked INTEGER DEFAULT 0,

  -- Quality metrics
  spam_complaints INTEGER DEFAULT 0,
  unsubscribes INTEGER DEFAULT 0,
  bounces INTEGER DEFAULT 0,
  avg_icp_score NUMERIC,
  avg_confidence_score NUMERIC,

  -- Cost metrics
  api_calls INTEGER DEFAULT 0,
  estimated_cost_eur NUMERIC DEFAULT 0,

  -- Rates (calculated)
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

-- Agent signals table (for Lifetime Scope Signals coordination)
CREATE TABLE IF NOT EXISTS agent_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  signal_type VARCHAR(50) NOT NULL CHECK (signal_type IN ('READY', 'COMPLETE', 'ERROR', 'BLOCKED')),
  milestone VARCHAR(100) NOT NULL,
  context_id VARCHAR(100),  -- lead_id, deal_id, etc.
  metadata JSONB DEFAULT '{}'::jsonb,
  emitted_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_signals_agent_id ON agent_signals(agent_id);
CREATE INDEX idx_signals_type ON agent_signals(signal_type);
CREATE INDEX idx_signals_emitted_at ON agent_signals(emitted_at DESC);
CREATE INDEX idx_signals_context ON agent_signals(context_id) WHERE context_id IS NOT NULL;

COMMENT ON TABLE agent_signals IS 'Lifetime Scope Signals for agent-to-agent coordination';

-- Agent cost tracking table
CREATE TABLE IF NOT EXISTS agent_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id VARCHAR(50) NOT NULL,
  cost_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Model costs
  llm_provider VARCHAR(50),  -- anthropic, groq, openai
  llm_model VARCHAR(100),
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  model_cost_eur NUMERIC DEFAULT 0,

  -- API costs
  api_service VARCHAR(50),  -- apollo.io, clearbit, resend, linkedin
  api_calls INTEGER DEFAULT 0,
  api_cost_eur NUMERIC DEFAULT 0,

  -- Total
  total_cost_eur NUMERIC GENERATED ALWAYS AS (model_cost_eur + api_cost_eur) STORED,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_costs_agent_date ON agent_costs(agent_id, cost_date DESC);
CREATE INDEX idx_costs_date ON agent_costs(cost_date DESC);

COMMENT ON TABLE agent_costs IS 'Detailed cost tracking for AI agent operations (LLM + API calls)';

-- Agent approvals table (for Advisor mode workflow)
CREATE TABLE IF NOT EXISTS agent_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES firehorse_events(id) ON DELETE CASCADE,
  agent_id VARCHAR(50) NOT NULL,
  approver_email VARCHAR(255) NOT NULL,

  -- Request details
  action_type VARCHAR(50) NOT NULL,  -- send_email, linkedin_connection, linkedin_inmail
  action_details JSONB NOT NULL,

  -- Approval status
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  decision_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours'
);
CREATE INDEX idx_approvals_status ON agent_approvals(status) WHERE status = 'pending';
CREATE INDEX idx_approvals_agent_id ON agent_approvals(agent_id);
CREATE INDEX idx_approvals_approver ON agent_approvals(approver_email);
CREATE INDEX idx_approvals_created_at ON agent_approvals(created_at DESC);

COMMENT ON TABLE agent_approvals IS 'Approval workflow for agents in Advisor mode (HIL oversight)';

-- ============================================================================
-- VIEWS FOR AGENT DASHBOARDS
-- ============================================================================

-- High-priority leads view (ICP score 70+)
CREATE OR REPLACE VIEW v_high_priority_leads AS
SELECT
  l.id,
  l.email,
  l.first_name,
  l.last_name,
  l.company,
  l.title,
  l.segment,
  l.icp_score,
  l.priority,
  l.trigger_events,
  l.confidence_score,
  l.state,
  l.enriched_at,
  l.created_at,
  COUNT(DISTINCT e.id) FILTER (WHERE e.event_type = 'EmailSent') as emails_sent,
  COUNT(DISTINCT e.id) FILTER (WHERE e.event_type = 'EmailOpened') as emails_opened,
  COUNT(DISTINCT e.id) FILTER (WHERE e.event_type = 'Replied') as replies,
  MAX(e.created_at) as last_activity_at
FROM firehorse_leads l
LEFT JOIN firehorse_events e ON l.id = e.lead_id
WHERE l.icp_score >= 70
GROUP BY l.id
ORDER BY l.icp_score DESC, l.enriched_at DESC;

COMMENT ON VIEW v_high_priority_leads IS 'High-priority leads (ICP 70+) with engagement summary';

-- Pending approvals view (for Sales HIL Director)
CREATE OR REPLACE VIEW v_pending_approvals AS
SELECT
  a.id as approval_id,
  a.agent_id,
  a.action_type,
  l.company,
  l.first_name,
  l.last_name,
  l.email,
  l.icp_score,
  e.subject_line,
  e.body,
  e.cta,
  a.created_at,
  a.expires_at,
  (a.expires_at - NOW()) as time_until_expiry
FROM agent_approvals a
JOIN firehorse_events e ON a.event_id = e.id
JOIN firehorse_leads l ON e.lead_id = l.id
WHERE a.status = 'pending'
  AND a.expires_at > NOW()
ORDER BY a.created_at ASC;

COMMENT ON VIEW v_pending_approvals IS 'Pending agent actions requiring HIL Director approval';

-- Agent performance leaderboard
CREATE OR REPLACE VIEW v_agent_performance_leaderboard AS
SELECT
  agent_id,
  SUM(leads_processed) as total_leads_processed,
  SUM(emails_sent) as total_emails_sent,
  SUM(meetings_booked) as total_meetings_booked,
  ROUND(AVG(open_rate), 2) as avg_open_rate,
  ROUND(AVG(reply_rate), 2) as avg_reply_rate,
  ROUND(AVG(meeting_booked_rate), 2) as avg_meeting_booked_rate,
  SUM(spam_complaints) as total_spam_complaints,
  SUM(estimated_cost_eur) as total_cost_eur,
  MAX(metric_date) as last_active_date
FROM agent_metrics
WHERE metric_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY agent_id
ORDER BY total_meetings_booked DESC, avg_reply_rate DESC;

COMMENT ON VIEW v_agent_performance_leaderboard IS '30-day agent performance leaderboard';

-- ============================================================================
-- FUNCTIONS FOR AGENT OPERATIONS
-- ============================================================================

-- Function to update agent metrics (called daily via cron or Cloud Scheduler)
CREATE OR REPLACE FUNCTION update_agent_metrics(p_agent_id VARCHAR, p_date DATE DEFAULT CURRENT_DATE)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO agent_metrics (
    agent_id,
    metric_date,
    leads_processed,
    emails_sent,
    linkedin_connections,
    emails_opened,
    emails_clicked,
    emails_replied,
    meetings_booked,
    spam_complaints,
    unsubscribes,
    avg_icp_score,
    avg_confidence_score
  )
  SELECT
    p_agent_id,
    p_date,
    COUNT(DISTINCT CASE WHEN event_type = 'LeadEnriched' THEN lead_id END),
    COUNT(DISTINCT CASE WHEN event_type = 'EmailSent' THEN id END),
    COUNT(DISTINCT CASE WHEN event_type = 'LinkedInConnection' THEN id END),
    COUNT(DISTINCT CASE WHEN event_type = 'EmailOpened' THEN id END),
    COUNT(DISTINCT CASE WHEN event_type = 'LinkClicked' THEN id END),
    COUNT(DISTINCT CASE WHEN event_type = 'Replied' THEN id END),
    COUNT(DISTINCT CASE WHEN event_type = 'MeetingBooked' THEN id END),
    COUNT(DISTINCT CASE WHEN event_type = 'SpamComplaint' THEN id END),
    COUNT(DISTINCT CASE WHEN event_type = 'Unsubscribed' THEN id END),
    (SELECT ROUND(AVG(icp_score), 2) FROM firehorse_leads WHERE agent_id = p_agent_id AND enriched_at::date = p_date),
    (SELECT ROUND(AVG(confidence_score), 2) FROM firehorse_leads WHERE agent_id = p_agent_id AND enriched_at::date = p_date)
  FROM firehorse_events
  WHERE agent_id = p_agent_id
    AND created_at::date = p_date
  ON CONFLICT (agent_id, metric_date)
  DO UPDATE SET
    leads_processed = EXCLUDED.leads_processed,
    emails_sent = EXCLUDED.emails_sent,
    linkedin_connections = EXCLUDED.linkedin_connections,
    emails_opened = EXCLUDED.emails_opened,
    emails_clicked = EXCLUDED.emails_clicked,
    emails_replied = EXCLUDED.emails_replied,
    meetings_booked = EXCLUDED.meetings_booked,
    spam_complaints = EXCLUDED.spam_complaints,
    unsubscribes = EXCLUDED.unsubscribes,
    avg_icp_score = EXCLUDED.avg_icp_score,
    avg_confidence_score = EXCLUDED.avg_confidence_score,
    updated_at = NOW();
END;
$$;

COMMENT ON FUNCTION update_agent_metrics IS 'Calculate and store daily metrics for an agent';

-- Function to emit agent signal
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

-- Function to check if approval expired and auto-reject
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
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_approvals ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read agent metrics
CREATE POLICY agent_metrics_read_policy ON agent_metrics
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow service role to write agent metrics
CREATE POLICY agent_metrics_write_policy ON agent_metrics
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Allow authenticated users to read agent signals
CREATE POLICY agent_signals_read_policy ON agent_signals
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow service role to write agent signals
CREATE POLICY agent_signals_write_policy ON agent_signals
  FOR ALL
  USING (auth.role() = 'service_role');

-- Policy: Allow authenticated users to read/update their approvals
CREATE POLICY agent_approvals_user_policy ON agent_approvals
  FOR ALL
  USING (approver_email = auth.email() OR auth.role() = 'service_role');

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to update firehorse_leads.updated_at on changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON firehorse_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA FOR TESTING (Optional - remove in production)
-- ============================================================================

-- Insert sample high-priority lead for testing
INSERT INTO firehorse_leads (
  email,
  first_name,
  last_name,
  company,
  title,
  country,
  segment,
  state,
  revenue_eur,
  employee_count,
  industry,
  headquarters,
  icp_score,
  priority,
  trigger_events,
  confidence_score,
  agent_id,
  enriched_at
) VALUES (
  'test.lead@kela.fi',
  'Test',
  'Lead',
  'Kela (Finnish Social Insurance Institution)',
  'Chief Sustainability Officer',
  'FI',
  'Construction',
  'New',
  500000000,
  6500,
  'Government/Public Sector',
  'Helsinki, Finland',
  95,
  'High',
  '["New CSO hired Q4 2025", "CSRD compliance deadline 2025", "Green building certification pursuit"]'::jsonb,
  92,
  'lead-scout-001',
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- GRANTS (for service role and authenticated users)
-- ============================================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT ON v_high_priority_leads TO authenticated;
GRANT SELECT ON v_pending_approvals TO authenticated;
GRANT SELECT ON v_agent_performance_leaderboard TO authenticated;
GRANT EXECUTE ON FUNCTION update_agent_metrics TO service_role;
GRANT EXECUTE ON FUNCTION emit_agent_signal TO service_role;
GRANT EXECUTE ON FUNCTION expire_pending_approvals TO service_role;

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite index for common agent queries
CREATE INDEX IF NOT EXISTS idx_leads_segment_priority_score
  ON firehorse_leads(segment, priority, icp_score DESC)
  WHERE priority = 'High';

-- Index for signal coordination queries
CREATE INDEX IF NOT EXISTS idx_signals_agent_milestone
  ON agent_signals(agent_id, milestone, emitted_at DESC);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE firehorse_leads IS 'Extended with AI agent enrichment fields (ICP score, trigger events, etc.)';
COMMENT ON TABLE firehorse_events IS 'Extended with agent outreach tracking (emails, LinkedIn, approvals)';
COMMENT ON TABLE agent_metrics IS 'Daily performance metrics for AI sales agents';
COMMENT ON TABLE agent_signals IS 'Lifetime Scope Signals for agent-to-agent coordination';
COMMENT ON TABLE agent_costs IS 'Detailed cost tracking for LLM and API usage';
COMMENT ON TABLE agent_approvals IS 'Human-in-loop approval workflow for Advisor mode';

-- Migration complete
SELECT 'Migration 013_agent_tracking.sql completed successfully' as status;

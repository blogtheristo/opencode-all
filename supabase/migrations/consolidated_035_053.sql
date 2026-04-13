-- ============================================================================
-- CONSOLIDATED MIGRATIONS 035–053 (excluding 034 captain_inquiries, already applied)
-- Generated: 2026-03-29
--
-- SKIPPED (3):
--   035_grok_consent.sql       — superseded by 041 (incompatible schema)
--   036_grok_audit_immutability.sql — depends on skipped 035
--   037_resend_delivery_tracking.sql — Resend BANNED (Clawdbot incident)
--
-- 038_article12_audit_log.sql — covered by 041 section 6
-- 040_grok_consent.sql        — covered by 041 section 7
--
-- 051_memory_pgcron_decay.sql — SEPARATE (requires pg_cron extension, run manually)
--
-- Each section is independent. If one fails, the rest can still run.
-- All tables use IF NOT EXISTS — safe to re-run.
-- ============================================================================


-- ============================================================================
-- SECTION 1: 035_anna_gueorguieva_greeniumdc (data insert)
-- ============================================================================

INSERT INTO outreach_orgs (domain, name, description, location, size, industry, website, source, created_by)
VALUES (
  'greeniumdc.com',
  'GreeniumDC',
  'Sustainability data aggregation and climate analytics for institutional asset managers and REITs. 50+ asset manager clients. Built environment / ESG analytics segment.',
  'International',
  '11-50',
  'Climate Tech',
  NULL,
  'boardy',
  'risto'
)
ON CONFLICT (domain) DO UPDATE SET
  description = EXCLUDED.description,
  updated_at = NOW();

INSERT INTO persons (linkedin_url, first_name, last_name, title, location, org_id, source, created_by)
VALUES (
  'https://www.linkedin.com/in/anna-gueorguieva/',
  'Anna',
  'Gueorguieva',
  'Chief Sustainability Officer (CSO)',
  'International',
  (SELECT id FROM outreach_orgs WHERE domain = 'greeniumdc.com'),
  'boardy',
  'risto'
)
ON CONFLICT (linkedin_url) DO UPDATE SET
  title = EXCLUDED.title,
  org_id = EXCLUDED.org_id,
  updated_at = NOW();

INSERT INTO person_emails (person_id, email, is_primary, verified, source, created_by)
VALUES (
  (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/anna-gueorguieva/'),
  'annagindc@gmail.com',
  TRUE,
  FALSE,
  'boardy',
  'risto'
)
ON CONFLICT (person_id, email) DO NOTHING;

INSERT INTO outreach_threads (
  person_id, org_id, pipeline, priority,
  partnership_type,
  status, source, created_by,
  boardy_notes,
  our_angle,
  their_angle,
  next_action,
  next_action_type,
  next_action_date,
  waiting_since
) VALUES (
  (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/anna-gueorguieva/'),
  (SELECT id FROM outreach_orgs WHERE domain = 'greeniumdc.com'),
  'partner',
  'high',
  'Integration',
  'intro_made',
  'boardy',
  'risto',
  'Ph.D., CSO at GreeniumDC. Former World Bank + Bridge Investment Group. 50+ asset manager clients. Built environment ESG analytics. Boardy intro sent to annagindc@gmail.com.',
  'GreeniumDC aggregates climate data for 50+ asset managers. DWS IQ 6 turns that data into predictive FCD values. Integration creates joint value for mutual clients.',
  'DWS IQ 6 predictive layer makes GreeniumDC data more valuable. FCD concept is directly relevant to her TCFD work.',
  'Send intro email. Schedule 30-min call. Prepare FCD one-pager + integration sketch.',
  'schedule',
  CURRENT_DATE + 1,
  CURRENT_DATE
)
ON CONFLICT (person_id, org_id, pipeline) DO UPDATE SET
  priority = EXCLUDED.priority,
  partnership_type = EXCLUDED.partnership_type,
  status = EXCLUDED.status,
  boardy_notes = EXCLUDED.boardy_notes,
  our_angle = EXCLUDED.our_angle,
  their_angle = EXCLUDED.their_angle,
  next_action = EXCLUDED.next_action,
  next_action_type = EXCLUDED.next_action_type,
  next_action_date = EXCLUDED.next_action_date,
  waiting_since = EXCLUDED.waiting_since,
  updated_at = NOW();

INSERT INTO outreach_activities (
  thread_id, person_id, org_id, pipeline,
  channel, activity_type, description,
  raw_payload, outcome, source, created_by,
  next_followup_at
)
SELECT
  ot.id,
  ot.person_id,
  ot.org_id,
  'partner',
  'boardy',
  'intro',
  'Boardy connected Risto and Anna Gueorguieva (CSO, GreeniumDC). Ecosystem partner for FCD validation and data integration.',
  jsonb_build_object(
    'boardy_notes', ot.boardy_notes,
    'anna_email', 'annagindc@gmail.com',
    'anna_title', 'CSO',
    'anna_company', 'GreeniumDC',
    'partnership_type', 'Ecosystem / Data Integration'
  ),
  'positive',
  'boardy',
  'risto',
  (CURRENT_DATE + 1)::timestamptz
FROM outreach_threads ot
WHERE ot.person_id = (SELECT id FROM persons WHERE linkedin_url = 'https://www.linkedin.com/in/anna-gueorguieva/')
  AND ot.pipeline = 'partner';


-- ============================================================================
-- SECTION 2: 036_construction_leads
-- ============================================================================

CREATE TABLE IF NOT EXISTS construction_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ted_notice_id VARCHAR(100) NOT NULL UNIQUE,
  document_number VARCHAR(50),
  title TEXT NOT NULL,
  description TEXT,
  cpv_code VARCHAR(20),
  cpv_description VARCHAR(500),
  country_code VARCHAR(5),
  country_name VARCHAR(100),
  nuts_code VARCHAR(20),
  place_of_performance TEXT,
  buyer_name VARCHAR(500),
  buyer_url TEXT,
  contract_type VARCHAR(50),
  procedure_type VARCHAR(100),
  notice_type VARCHAR(100),
  estimated_value NUMERIC,
  currency VARCHAR(10) DEFAULT 'EUR',
  publication_date DATE,
  deadline_date TIMESTAMPTZ,
  ted_url TEXT,
  status VARCHAR(50) DEFAULT 'new'
    CHECK (status IN ('new', 'reviewed', 'qualified', 'outreach_started', 'contacted', 'passed', 'won')),
  relevance_score NUMERIC DEFAULT 0,
  notes TEXT,
  org_id UUID REFERENCES outreach_orgs(id) ON DELETE SET NULL,
  raw_data JSONB,
  source VARCHAR(50) DEFAULT 'ted_api' NOT NULL,
  created_by VARCHAR(100) DEFAULT 'construction_lead_fetcher' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_construction_leads_ted_id ON construction_leads(ted_notice_id);
CREATE INDEX IF NOT EXISTS idx_construction_leads_cpv ON construction_leads(cpv_code);
CREATE INDEX IF NOT EXISTS idx_construction_leads_country ON construction_leads(country_code);
CREATE INDEX IF NOT EXISTS idx_construction_leads_status ON construction_leads(status);
CREATE INDEX IF NOT EXISTS idx_construction_leads_pub_date ON construction_leads(publication_date DESC);
CREATE INDEX IF NOT EXISTS idx_construction_leads_deadline ON construction_leads(deadline_date) WHERE deadline_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_construction_leads_relevance ON construction_leads(relevance_score DESC);
CREATE INDEX IF NOT EXISTS idx_construction_leads_org ON construction_leads(org_id) WHERE org_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_construction_leads_created ON construction_leads(created_at DESC);

DROP TRIGGER IF EXISTS update_construction_leads_updated_at ON construction_leads;
CREATE TRIGGER update_construction_leads_updated_at
  BEFORE UPDATE ON construction_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE VIEW v_construction_leads_new AS
SELECT * FROM construction_leads
WHERE status = 'new' AND publication_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY relevance_score DESC, publication_date DESC;

CREATE OR REPLACE VIEW v_construction_leads_deadlines AS
SELECT * FROM construction_leads
WHERE deadline_date >= NOW() AND deadline_date <= NOW() + INTERVAL '14 days'
  AND status NOT IN ('passed', 'won')
ORDER BY deadline_date ASC;

CREATE OR REPLACE VIEW v_construction_leads_summary AS
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_count,
  SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END) AS reviewed_count,
  SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) AS qualified_count,
  SUM(CASE WHEN status = 'outreach_started' THEN 1 ELSE 0 END) AS outreach_count,
  SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) AS contacted_count,
  SUM(CASE WHEN deadline_date >= NOW() AND deadline_date <= NOW() + INTERVAL '7 days' THEN 1 ELSE 0 END) AS deadlines_this_week
FROM construction_leads
WHERE status NOT IN ('passed', 'won');

ALTER TABLE construction_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access" ON construction_leads;
CREATE POLICY "Service role full access" ON construction_leads FOR ALL USING (auth.role() = 'service_role');
DROP POLICY IF EXISTS "Authenticated read" ON construction_leads;
CREATE POLICY "Authenticated read" ON construction_leads FOR SELECT USING (auth.role() = 'authenticated');

COMMENT ON TABLE construction_leads IS 'EU public procurement notices for construction projects from TED API. CPV 45xxxxx.';


-- ============================================================================
-- SECTION 3: 038_hil_todos
-- ============================================================================

CREATE TABLE IF NOT EXISTS hil_todos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category     TEXT NOT NULL,
  description  TEXT NOT NULL,
  context      JSONB DEFAULT '{}',
  dedup_key    TEXT UNIQUE NOT NULL,
  done_token   UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  done_at      TIMESTAMPTZ,
  done_by      TEXT DEFAULT 'risto'
);

CREATE INDEX IF NOT EXISTS idx_hil_todos_open ON hil_todos (created_at DESC) WHERE done_at IS NULL;

ALTER TABLE hil_todos ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hil_todos' AND policyname = 'hil_todos_service_only') THEN
    CREATE POLICY hil_todos_service_only ON hil_todos USING (auth.role() = 'service_role');
  END IF;
END $$;

COMMENT ON TABLE hil_todos IS 'Human-in-the-Loop manual tasks. Populated by automated collectors; cleared via one-click Done links in the morning briefing email.';


-- ============================================================================
-- SECTION 4: 039_fix_security_definer_views (depends on section 2)
-- ============================================================================

DROP VIEW IF EXISTS v_construction_leads_summary;
DROP VIEW IF EXISTS v_construction_leads_new;
DROP VIEW IF EXISTS v_construction_leads_deadlines;

CREATE VIEW v_construction_leads_new
WITH (security_invoker = on) AS
SELECT * FROM construction_leads
WHERE status = 'new' AND publication_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY relevance_score DESC, publication_date DESC;

CREATE VIEW v_construction_leads_deadlines
WITH (security_invoker = on) AS
SELECT * FROM construction_leads
WHERE deadline_date >= NOW() AND deadline_date <= NOW() + INTERVAL '14 days'
  AND status NOT IN ('passed', 'won')
ORDER BY deadline_date ASC;

CREATE VIEW v_construction_leads_summary
WITH (security_invoker = on) AS
SELECT
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_count,
  SUM(CASE WHEN status = 'reviewed' THEN 1 ELSE 0 END) AS reviewed_count,
  SUM(CASE WHEN status = 'qualified' THEN 1 ELSE 0 END) AS qualified_count,
  SUM(CASE WHEN status = 'outreach_started' THEN 1 ELSE 0 END) AS outreach_count,
  SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) AS contacted_count,
  SUM(CASE WHEN deadline_date >= NOW() AND deadline_date <= NOW() + INTERVAL '7 days' THEN 1 ELSE 0 END) AS deadlines_this_week
FROM construction_leads
WHERE status NOT IN ('passed', 'won');


-- ============================================================================
-- SECTION 5: 041_fix_partial_runs (consolidation — covers 038_article12 + 040_grok)
-- ============================================================================

-- 5a: Agent tracking columns on firehorse_leads/events
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_id TEXT;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_confidence DECIMAL(3,2);
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_recommendation TEXT;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_signal TEXT;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_timestamp TIMESTAMPTZ;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_cost_cents INTEGER DEFAULT 0;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_model TEXT;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_tokens INTEGER DEFAULT 0;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_processing_time_ms INTEGER;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_version TEXT DEFAULT '1.0';
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_metadata JSONB DEFAULT '{}';
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_feedback TEXT;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_feedback_timestamp TIMESTAMPTZ;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_feedback_user_id UUID;
ALTER TABLE firehorse_leads ADD COLUMN IF NOT EXISTS agent_priority_score DECIMAL(3,2);

ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_id TEXT;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_confidence DECIMAL(3,2);
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_recommendation TEXT;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_signal TEXT;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_timestamp TIMESTAMPTZ;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_cost_cents INTEGER DEFAULT 0;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_model TEXT;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_tokens INTEGER DEFAULT 0;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_processing_time_ms INTEGER;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_version TEXT DEFAULT '1.0';
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_metadata JSONB DEFAULT '{}';
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_feedback TEXT;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_feedback_timestamp TIMESTAMPTZ;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_feedback_user_id UUID;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS agent_priority_score DECIMAL(3,2);
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'lead_update';
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS event_data JSONB DEFAULT '{}';
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS event_source TEXT DEFAULT 'agent';
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS event_confidence DECIMAL(3,2);
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS event_cost_cents INTEGER DEFAULT 0;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS event_model TEXT;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS event_tokens INTEGER DEFAULT 0;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS event_processing_time_ms INTEGER;
ALTER TABLE firehorse_events ADD COLUMN IF NOT EXISTS event_version TEXT DEFAULT '1.0';

CREATE INDEX IF NOT EXISTS firehorse_leads_agent_id_idx ON firehorse_leads (agent_id);
CREATE INDEX IF NOT EXISTS firehorse_leads_agent_confidence_idx ON firehorse_leads (agent_confidence);
CREATE INDEX IF NOT EXISTS firehorse_leads_agent_timestamp_idx ON firehorse_leads (agent_timestamp);
CREATE INDEX IF NOT EXISTS firehorse_leads_agent_priority_score_idx ON firehorse_leads (agent_priority_score DESC);
CREATE INDEX IF NOT EXISTS firehorse_events_agent_id_idx ON firehorse_events (agent_id);
CREATE INDEX IF NOT EXISTS firehorse_events_agent_timestamp_idx ON firehorse_events (agent_timestamp);
CREATE INDEX IF NOT EXISTS firehorse_events_event_type_idx ON firehorse_events (event_type);
CREATE INDEX IF NOT EXISTS firehorse_events_created_at_idx ON firehorse_events (created_at DESC);

-- 5b: Agent metrics/signals/costs/approvals tables
CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  date DATE NOT NULL,
  leads_processed INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.00,
  avg_confidence DECIMAL(3,2) DEFAULT 0.00,
  total_cost_cents INTEGER DEFAULT 0,
  avg_processing_time_ms INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (agent_name, date)
);

CREATE TABLE IF NOT EXISTS agent_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  signal_type TEXT NOT NULL,
  signal_value TEXT,
  signal_metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (agent_name, signal_type)
);

CREATE TABLE IF NOT EXISTS agent_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  model_used TEXT,
  tokens_used INTEGER DEFAULT 0,
  cost_cents INTEGER NOT NULL,
  operation_metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  operation_data JSONB NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  approved_by UUID,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS agent_metrics_agent_name_date_idx ON agent_metrics (agent_name, date DESC);
CREATE INDEX IF NOT EXISTS agent_signals_agent_name_idx ON agent_signals (agent_name);
CREATE INDEX IF NOT EXISTS agent_signals_expires_at_idx ON agent_signals (expires_at);
CREATE INDEX IF NOT EXISTS agent_costs_agent_name_idx ON agent_costs (agent_name);
CREATE INDEX IF NOT EXISTS agent_costs_created_at_idx ON agent_costs (created_at DESC);
CREATE INDEX IF NOT EXISTS agent_approvals_status_idx ON agent_approvals (approval_status);
CREATE INDEX IF NOT EXISTS agent_approvals_expires_at_idx ON agent_approvals (expires_at);

-- 5c: Views + functions
CREATE OR REPLACE VIEW v_high_priority_leads WITH (security_invoker = true) AS
SELECT l.*, m.conversion_rate, m.avg_confidence
FROM firehorse_leads l
LEFT JOIN agent_metrics m ON l.agent_id = m.agent_name
WHERE l.agent_priority_score > 0.8 AND l.created_at > NOW() - INTERVAL '30 days'
ORDER BY l.agent_priority_score DESC, l.created_at DESC;

CREATE OR REPLACE VIEW v_pending_approvals WITH (security_invoker = true) AS
SELECT a.*, u.email as approver_email
FROM agent_approvals a
LEFT JOIN auth.users u ON a.approved_by = u.id
WHERE a.approval_status = 'pending' AND a.expires_at > NOW()
ORDER BY a.created_at DESC;

CREATE OR REPLACE VIEW v_agent_performance_leaderboard WITH (security_invoker = true) AS
SELECT
  agent_name,
  SUM(leads_processed) as total_leads,
  SUM(leads_converted) as total_conversions,
  ROUND(AVG(conversion_rate), 2) as avg_conversion_rate,
  ROUND(AVG(avg_confidence), 2) as avg_confidence,
  SUM(total_cost_cents) as total_cost_cents,
  ROUND(AVG(avg_processing_time_ms), 0) as avg_processing_time_ms
FROM agent_metrics WHERE date > NOW() - INTERVAL '30 days'
GROUP BY agent_name ORDER BY avg_conversion_rate DESC, total_conversions DESC;

CREATE OR REPLACE FUNCTION update_agent_metrics()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO agent_metrics (agent_name, date, leads_processed, leads_converted, conversion_rate, avg_confidence, total_cost_cents, avg_processing_time_ms, total_tokens)
  VALUES (
    NEW.agent_id, CURRENT_DATE, 1,
    CASE WHEN NEW.agent_recommendation = 'convert' THEN 1 ELSE 0 END,
    CASE WHEN NEW.agent_recommendation = 'convert' THEN 1.0 ELSE 0.0 END,
    NEW.agent_confidence, NEW.agent_cost_cents, NEW.agent_processing_time_ms, NEW.agent_tokens
  )
  ON CONFLICT (agent_name, date) DO UPDATE SET
    leads_processed = agent_metrics.leads_processed + 1,
    leads_converted = agent_metrics.leads_converted + CASE WHEN NEW.agent_recommendation = 'convert' THEN 1 ELSE 0 END,
    conversion_rate = ROUND((agent_metrics.leads_converted + CASE WHEN NEW.agent_recommendation = 'convert' THEN 1 ELSE 0 END)::decimal / (agent_metrics.leads_processed + 1), 2),
    avg_confidence = ROUND(((agent_metrics.avg_confidence * agent_metrics.leads_processed) + NEW.agent_confidence) / (agent_metrics.leads_processed + 1), 2),
    total_cost_cents = agent_metrics.total_cost_cents + NEW.agent_cost_cents,
    avg_processing_time_ms = ROUND(((agent_metrics.avg_processing_time_ms * agent_metrics.leads_processed) + NEW.agent_processing_time_ms) / (agent_metrics.leads_processed + 1), 0),
    total_tokens = agent_metrics.total_tokens + NEW.agent_tokens,
    updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION emit_agent_signal()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO agent_signals (agent_name, signal_type, signal_value, signal_metadata, expires_at)
  VALUES (
    NEW.agent_id, 'lead_processed', NEW.id::text,
    jsonb_build_object('confidence', NEW.agent_confidence, 'recommendation', NEW.agent_recommendation),
    NOW() + INTERVAL '1 hour'
  )
  ON CONFLICT (agent_name, signal_type) DO UPDATE SET
    signal_value = NEW.id::text,
    signal_metadata = jsonb_build_object('confidence', NEW.agent_confidence, 'recommendation', NEW.agent_recommendation),
    expires_at = NOW() + INTERVAL '1 hour';
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION expire_pending_approvals()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE agent_approvals SET approval_status = 'expired'
  WHERE approval_status = 'pending' AND expires_at < NOW();
END;
$$;

ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_approvals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_metrics' AND policyname = 'Service role full access to agent_metrics') THEN
    CREATE POLICY "Service role full access to agent_metrics" ON agent_metrics FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_metrics' AND policyname = 'Authenticated users can read agent_metrics') THEN
    CREATE POLICY "Authenticated users can read agent_metrics" ON agent_metrics FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_signals' AND policyname = 'Service role full access to agent_signals') THEN
    CREATE POLICY "Service role full access to agent_signals" ON agent_signals FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_costs' AND policyname = 'Service role full access to agent_costs') THEN
    CREATE POLICY "Service role full access to agent_costs" ON agent_costs FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agent_approvals' AND policyname = 'Service role full access to agent_approvals') THEN
    CREATE POLICY "Service role full access to agent_approvals" ON agent_approvals FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

DROP TRIGGER IF EXISTS update_agent_metrics_trigger ON firehorse_leads;
CREATE TRIGGER update_agent_metrics_trigger
  AFTER INSERT ON firehorse_leads FOR EACH ROW
  WHEN (NEW.agent_id IS NOT NULL) EXECUTE FUNCTION update_agent_metrics();

DROP TRIGGER IF EXISTS emit_agent_signal_trigger ON firehorse_leads;
CREATE TRIGGER emit_agent_signal_trigger
  AFTER INSERT ON firehorse_leads FOR EACH ROW
  WHEN (NEW.agent_id IS NOT NULL) EXECUTE FUNCTION emit_agent_signal();

-- 5d: climate_assistant_usage
CREATE TABLE IF NOT EXISTS climate_assistant_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  requests_count INTEGER NOT NULL DEFAULT 0,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  cost_cents INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS climate_assistant_usage_user_date_idx ON climate_assistant_usage (user_id, date DESC);
CREATE INDEX IF NOT EXISTS climate_assistant_usage_org_date_idx ON climate_assistant_usage (org_id, date DESC);

CREATE OR REPLACE FUNCTION get_or_create_usage_for_date(p_user_id UUID, p_org_id UUID DEFAULT NULL)
RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE usage_id UUID;
BEGIN
  INSERT INTO climate_assistant_usage (user_id, org_id, date) VALUES (p_user_id, p_org_id, CURRENT_DATE)
  ON CONFLICT (user_id, date) DO NOTHING RETURNING id INTO usage_id;
  IF usage_id IS NULL THEN
    SELECT id INTO usage_id FROM climate_assistant_usage WHERE user_id = p_user_id AND date = CURRENT_DATE;
  END IF;
  RETURN usage_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_climate_usage(p_user_id UUID, p_org_id UUID DEFAULT NULL, p_requests INTEGER DEFAULT 1, p_tokens INTEGER DEFAULT 0, p_cost_cents INTEGER DEFAULT 0)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO climate_assistant_usage (user_id, org_id, date, requests_count, tokens_used, cost_cents)
  VALUES (p_user_id, p_org_id, CURRENT_DATE, p_requests, p_tokens, p_cost_cents)
  ON CONFLICT (user_id, date) DO UPDATE SET
    requests_count = climate_assistant_usage.requests_count + p_requests,
    tokens_used = climate_assistant_usage.tokens_used + p_tokens,
    cost_cents = climate_assistant_usage.cost_cents + p_cost_cents,
    updated_at = NOW();
END;
$$;

ALTER TABLE climate_assistant_usage ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'climate_assistant_usage' AND policyname = 'Service role full access to climate_assistant_usage') THEN
    CREATE POLICY "Service role full access to climate_assistant_usage" ON climate_assistant_usage FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'climate_assistant_usage' AND policyname = 'Users can read their own usage') THEN
    CREATE POLICY "Users can read their own usage" ON climate_assistant_usage FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- 5e: email_queue
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT,
  body_text TEXT,
  from_email TEXT NOT NULL DEFAULT 'risto@onelifetime.world',
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS email_queue_status_idx ON email_queue (status);
CREATE INDEX IF NOT EXISTS email_queue_created_at_idx ON email_queue (created_at DESC);
CREATE INDEX IF NOT EXISTS email_queue_to_email_idx ON email_queue (to_email);
CREATE INDEX IF NOT EXISTS email_queue_status_created_idx ON email_queue (status, created_at DESC);
CREATE INDEX IF NOT EXISTS email_queue_sent_at_idx ON email_queue (sent_at DESC);

CREATE OR REPLACE VIEW v_email_queue_stats WITH (security_invoker = true) AS
SELECT status, COUNT(*) as count, MIN(created_at) as oldest_created, MAX(created_at) as newest_created, MIN(sent_at) as oldest_sent, MAX(sent_at) as newest_sent
FROM email_queue GROUP BY status ORDER BY status;

ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_queue' AND policyname = 'Service role full access to email_queue') THEN
    CREATE POLICY "Service role full access to email_queue" ON email_queue FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_queue' AND policyname = 'Authenticated users can read email_queue') THEN
    CREATE POLICY "Authenticated users can read email_queue" ON email_queue FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- 5f: article12_audit_log (EU AI Act Article 12)
CREATE TABLE IF NOT EXISTS article12_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  trace_id UUID NOT NULL DEFAULT gen_random_uuid(),
  input_hash TEXT NOT NULL,
  model TEXT NOT NULL,
  thinking_effort TEXT CHECK (thinking_effort IN ('low','medium','high','max','none')),
  input_token_count INTEGER,
  output_token_count INTEGER,
  regulation_ids TEXT[],
  decision_summary TEXT CHECK (char_length(decision_summary) <= 500),
  thinking_block_hash TEXT,
  pii_scrubbed BOOLEAN NOT NULL DEFAULT TRUE,
  pii_types_found TEXT[],
  pii_replacement_count INTEGER NOT NULL DEFAULT 0,
  scrub_manifest_hash TEXT,
  inference_in_eu BOOLEAN NOT NULL DEFAULT FALSE,
  pii_scrub_location TEXT NOT NULL DEFAULT 'veriton-helsinki-fi',
  inference_location TEXT NOT NULL DEFAULT 'anthropic-us',
  scrubber_version TEXT NOT NULL DEFAULT '1.0.0',
  risk_classification TEXT CHECK (risk_classification IN ('high','limited','minimal')) DEFAULT 'high',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS article12_audit_log_agent_id_idx ON article12_audit_log (agent_id);
CREATE INDEX IF NOT EXISTS article12_audit_log_trace_id_idx ON article12_audit_log (trace_id);
CREATE INDEX IF NOT EXISTS article12_audit_log_created_at_idx ON article12_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS article12_audit_log_model_idx ON article12_audit_log (model);

COMMENT ON TABLE article12_audit_log IS 'EU AI Act Article 12 audit log. Append-only. Do not delete rows. Retention: 10 years.';

ALTER TABLE article12_audit_log ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'article12_audit_log' AND policyname = 'article12_insert_service') THEN
    CREATE POLICY "article12_insert_service" ON article12_audit_log FOR INSERT TO service_role WITH CHECK (TRUE);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'article12_audit_log' AND policyname = 'article12_select_authenticated') THEN
    CREATE POLICY "article12_select_authenticated" ON article12_audit_log FOR SELECT TO authenticated USING (TRUE);
  END IF;
END $$;

REVOKE UPDATE ON article12_audit_log FROM PUBLIC, authenticated, service_role;
REVOKE DELETE ON article12_audit_log FROM PUBLIC, authenticated, service_role;
REVOKE TRUNCATE ON article12_audit_log FROM PUBLIC, authenticated, service_role;

-- 5g: grok_consent tables (GDPR + EU AI Act)
CREATE TABLE IF NOT EXISTS grok_consent (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid,
  consented boolean NOT NULL DEFAULT false,
  consent_version text NOT NULL DEFAULT '1.0',
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, org_id)
);

CREATE TABLE IF NOT EXISTS grok_consent_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id uuid REFERENCES grok_consent(id) ON DELETE SET NULL,
  user_id uuid NOT NULL,
  org_id uuid,
  action text NOT NULL CHECK (action IN ('granted', 'revoked', 'updated')),
  consented boolean NOT NULL,
  consent_version text NOT NULL,
  ip_address inet,
  user_agent text,
  actor_role text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grok_inference_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  org_id uuid,
  consent_id uuid REFERENCES grok_consent(id) ON DELETE SET NULL,
  model text NOT NULL,
  prompt_tokens integer,
  completion_tokens integer,
  total_tokens integer,
  latency_ms integer,
  status text NOT NULL CHECK (status IN ('success', 'error', 'timeout')),
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grok_consent_user_id ON grok_consent (user_id);
CREATE INDEX IF NOT EXISTS idx_grok_consent_audit_consent_id ON grok_consent_audit (consent_id);
CREATE INDEX IF NOT EXISTS idx_grok_consent_audit_user_id ON grok_consent_audit (user_id);
CREATE INDEX IF NOT EXISTS idx_grok_inference_log_user_id ON grok_inference_log (user_id);
CREATE INDEX IF NOT EXISTS idx_grok_inference_log_created_at ON grok_inference_log (created_at);

ALTER TABLE grok_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE grok_consent_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE grok_inference_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'grok_consent' AND policyname = 'Service role full access to grok_consent') THEN
    CREATE POLICY "Service role full access to grok_consent" ON grok_consent FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'grok_consent_audit' AND policyname = 'Service role can insert grok_consent_audit') THEN
    CREATE POLICY "Service role can insert grok_consent_audit" ON grok_consent_audit FOR INSERT TO service_role WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'grok_consent_audit' AND policyname = 'Service role can select grok_consent_audit') THEN
    CREATE POLICY "Service role can select grok_consent_audit" ON grok_consent_audit FOR SELECT TO service_role USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'grok_inference_log' AND policyname = 'Service role can insert grok_inference_log') THEN
    CREATE POLICY "Service role can insert grok_inference_log" ON grok_inference_log FOR INSERT TO service_role WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'grok_inference_log' AND policyname = 'Service role can select grok_inference_log') THEN
    CREATE POLICY "Service role can select grok_inference_log" ON grok_inference_log FOR SELECT TO service_role USING (true);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION prevent_audit_mutation()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Audit log records are immutable: % is not permitted on %', TG_OP, TG_TABLE_NAME;
END;
$$;

DROP TRIGGER IF EXISTS grok_consent_audit_immutable ON grok_consent_audit;
CREATE TRIGGER grok_consent_audit_immutable
  BEFORE UPDATE OR DELETE ON grok_consent_audit
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();

DROP TRIGGER IF EXISTS grok_inference_log_immutable ON grok_inference_log;
CREATE TRIGGER grok_inference_log_immutable
  BEFORE UPDATE OR DELETE ON grok_inference_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();

-- 5h: emission_factors constraint + firehorse_signals RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'emission_factors_material_country_key'
      AND conrelid = 'emission_factors'::regclass
  ) THEN
    ALTER TABLE emission_factors ADD CONSTRAINT emission_factors_material_country_key UNIQUE (material, country);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'firehorse_signals' AND policyname = 'Authenticated users can read signals'
  ) THEN
    CREATE POLICY "Authenticated users can read signals"
      ON firehorse_signals FOR SELECT TO authenticated USING (TRUE);
  END IF;
END $$;


-- ============================================================================
-- SECTION 6: 042_csrd_compliance_data
-- ============================================================================

CREATE TABLE IF NOT EXISTS compliance_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  industry TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'FI',
  employee_count TEXT NOT NULL DEFAULT '1-50',
  annual_revenue_eur NUMERIC DEFAULT 0,
  annual_emissions_tonnes NUMERIC DEFAULT 0,
  import_value_eur NUMERIC DEFAULT 0,
  regulations TEXT[] NOT NULL DEFAULT ARRAY['csrd'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE compliance_profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'compliance_profiles' AND policyname = 'Users can view own org compliance profiles') THEN
    CREATE POLICY "Users can view own org compliance profiles" ON compliance_profiles FOR SELECT
      USING (organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id');
    CREATE POLICY "Users can insert own org compliance profiles" ON compliance_profiles FOR INSERT
      WITH CHECK (organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id');
    CREATE POLICY "Users can update own org compliance profiles" ON compliance_profiles FOR UPDATE
      USING (organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS esrs_data_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES compliance_profiles(id) ON DELETE CASCADE,
  esrs_standard TEXT NOT NULL,
  disclosure_id TEXT NOT NULL,
  disclosure_name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_mandatory BOOLEAN NOT NULL DEFAULT true,
  data_provided BOOLEAN NOT NULL DEFAULT false,
  data_value JSONB,
  evidence_url TEXT,
  notes TEXT,
  last_updated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE esrs_data_points ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'esrs_data_points' AND policyname = 'Users can manage own ESRS data points') THEN
    CREATE POLICY "Users can manage own ESRS data points" ON esrs_data_points FOR ALL
      USING (profile_id IN (SELECT id FROM compliance_profiles WHERE organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS compliance_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES compliance_profiles(id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL DEFAULT 'csrd_readiness',
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  compliance_status TEXT NOT NULL,
  regulation_scores JSONB NOT NULL,
  gaps JSONB NOT NULL DEFAULT '[]',
  recommendations TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  assessed_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE compliance_assessments ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'compliance_assessments' AND policyname = 'Users can view own assessments') THEN
    CREATE POLICY "Users can view own assessments" ON compliance_assessments FOR SELECT
      USING (profile_id IN (SELECT id FROM compliance_profiles WHERE organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id'));
    CREATE POLICY "System can insert assessments" ON compliance_assessments FOR INSERT
      WITH CHECK (profile_id IN (SELECT id FROM compliance_profiles WHERE organization_id::text = current_setting('request.jwt.claims', true)::json->>'org_id'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_compliance_profiles_org ON compliance_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_esrs_data_points_profile ON esrs_data_points(profile_id);
CREATE INDEX IF NOT EXISTS idx_esrs_data_points_standard ON esrs_data_points(esrs_standard, disclosure_id);
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_profile ON compliance_assessments(profile_id);
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_created ON compliance_assessments(created_at DESC);


-- ============================================================================
-- SECTION 7: 042_mcp_session_sync
-- ============================================================================

CREATE TABLE IF NOT EXISTS mcp_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    branch text NOT NULL,
    tool text NOT NULL CHECK (tool IN ('win11', 'mobile', 'vscode', 'cli', 'chromebook')),
    checkpoint jsonb,
    summary text,
    closed_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mcp_sessions_branch ON mcp_sessions (branch);
CREATE INDEX IF NOT EXISTS idx_mcp_sessions_tool ON mcp_sessions (tool);
CREATE INDEX IF NOT EXISTS idx_mcp_sessions_created ON mcp_sessions (created_at DESC);
ALTER TABLE mcp_sessions ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcp_sessions' AND policyname = 'service_full_access_sessions') THEN
    CREATE POLICY "service_full_access_sessions" ON mcp_sessions FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS mcp_migration_queue (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    migration_number integer NOT NULL UNIQUE,
    filename text NOT NULL,
    sql text NOT NULL,
    author_tool text NOT NULL,
    author_branch text NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied', 'discarded')),
    supabase_applied boolean DEFAULT false,
    applied_by text,
    applied_at timestamptz,
    notes text DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_mcp_migration_queue_status ON mcp_migration_queue (status);
CREATE INDEX IF NOT EXISTS idx_mcp_migration_queue_number ON mcp_migration_queue (migration_number);
ALTER TABLE mcp_migration_queue ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mcp_migration_queue' AND policyname = 'service_full_access_migrations') THEN
    CREATE POLICY "service_full_access_migrations" ON mcp_migration_queue FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

CREATE SEQUENCE IF NOT EXISTS mcp_migration_number_seq START WITH 43;

CREATE OR REPLACE FUNCTION next_migration_number()
RETURNS integer LANGUAGE sql SECURITY INVOKER AS $$
    SELECT nextval('mcp_migration_number_seq')::integer;
$$;


-- ============================================================================
-- SECTION 8: 042_projects_dashboard
-- ============================================================================

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    project_code TEXT,
    location TEXT,
    status TEXT DEFAULT 'green' CHECK (status IN ('green', 'amber', 'red')),
    spi DECIMAL(5,2) DEFAULT 1.00,
    cpi DECIMAL(5,2) DEFAULT 1.00,
    carbon_footprint DECIMAL(14,2) DEFAULT 0,
    budget DECIMAL(14,2),
    spent DECIMAL(14,2),
    start_date DATE,
    end_date DATE,
    compliance_status JSONB DEFAULT '{"csrd":false,"epbd":false,"ets":false,"cbam":false,"last_check":null}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_org_id ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view projects in their org" ON projects;
CREATE POLICY "Users can view projects in their org" ON projects FOR SELECT TO authenticated
    USING (org_id IS NULL OR org_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()));
DROP POLICY IF EXISTS "Service role full access on projects" ON projects;
CREATE POLICY "Service role full access on projects" ON projects FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow read projects with no org" ON projects;
CREATE POLICY "Allow read projects with no org" ON projects FOR SELECT TO authenticated USING (org_id IS NULL);

COMMENT ON TABLE projects IS 'Portfolio projects for dashboard (SPI, CPI, carbon, compliance).';


-- ============================================================================
-- SECTION 9: 043_mvp_api_keys_usage_schedules
-- ============================================================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  prefix TEXT NOT NULL,
  hash TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{compliance:read,usage:read}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT api_keys_name_not_empty CHECK (name <> ''),
  CONSTRAINT api_keys_hash_not_empty CHECK (hash <> '')
);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys (hash) WHERE NOT revoked;
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys (user_id, created_at DESC);
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_api_keys" ON api_keys;
CREATE POLICY "service_role_all_api_keys" ON api_keys FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "users_own_api_keys" ON api_keys;
CREATE POLICY "users_own_api_keys" ON api_keys FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DO $$ BEGIN CREATE TYPE usage_event_type AS ENUM ('api_call', 'assistant_message', 'report_export'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  event_type usage_event_type NOT NULL,
  endpoint TEXT NOT NULL DEFAULT '',
  tokens INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_usage_events_user_month ON usage_events (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_type ON usage_events (event_type, created_at DESC);
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_usage_events" ON usage_events;
CREATE POLICY "service_role_all_usage_events" ON usage_events FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "users_read_own_usage_events" ON usage_events;
CREATE POLICY "users_read_own_usage_events" ON usage_events FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS usage_counters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  period_start DATE NOT NULL,
  api_calls INTEGER NOT NULL DEFAULT 0,
  assistant_msgs INTEGER NOT NULL DEFAULT 0,
  report_exports INTEGER NOT NULL DEFAULT 0,
  tier TEXT NOT NULL DEFAULT 'free',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT usage_counters_unique_user_period UNIQUE (user_id, period_start)
);
CREATE INDEX IF NOT EXISTS idx_usage_counters_user_period ON usage_counters (user_id, period_start DESC);
ALTER TABLE usage_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_counters FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_usage_counters" ON usage_counters;
CREATE POLICY "service_role_all_usage_counters" ON usage_counters FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "users_read_own_usage_counters" ON usage_counters;
CREATE POLICY "users_read_own_usage_counters" ON usage_counters FOR SELECT TO authenticated USING (user_id = auth.uid());

DO $$ BEGIN CREATE TYPE report_frequency AS ENUM ('monthly', 'quarterly', 'annually'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE report_format AS ENUM ('json', 'csv'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL CHECK (char_length(company_name) BETWEEN 1 AND 200),
  industry TEXT NOT NULL,
  country CHAR(2) NOT NULL DEFAULT 'FI',
  frequency report_frequency NOT NULL,
  format report_format NOT NULL DEFAULT 'json',
  recipient_email TEXT NOT NULL,
  next_run_at TIMESTAMPTZ NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_report_schedules_user ON report_schedules (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_report_schedules_next_run ON report_schedules (next_run_at) WHERE enabled = true;
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_schedules FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all_report_schedules" ON report_schedules;
CREATE POLICY "service_role_all_report_schedules" ON report_schedules FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "users_own_report_schedules" ON report_schedules;
CREATE POLICY "users_own_report_schedules" ON report_schedules FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION increment_usage_counter(p_user_id UUID, p_event_type usage_event_type, p_tier TEXT DEFAULT 'free')
RETURNS TABLE(api_calls INTEGER, assistant_msgs INTEGER, report_exports INTEGER) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_period_start DATE := date_trunc('month', CURRENT_DATE)::DATE;
BEGIN
  IF COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role' THEN
    RAISE EXCEPTION 'forbidden — service_role only';
  END IF;
  INSERT INTO usage_counters (user_id, period_start, tier, api_calls, assistant_msgs, report_exports)
  VALUES (p_user_id, v_period_start, p_tier,
    CASE WHEN p_event_type = 'api_call' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'assistant_message' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'report_export' THEN 1 ELSE 0 END)
  ON CONFLICT (user_id, period_start) DO UPDATE SET
    api_calls = usage_counters.api_calls + CASE WHEN p_event_type = 'api_call' THEN 1 ELSE 0 END,
    assistant_msgs = usage_counters.assistant_msgs + CASE WHEN p_event_type = 'assistant_message' THEN 1 ELSE 0 END,
    report_exports = usage_counters.report_exports + CASE WHEN p_event_type = 'report_export' THEN 1 ELSE 0 END,
    tier = p_tier, updated_at = now();
  RETURN QUERY SELECT uc.api_calls, uc.assistant_msgs, uc.report_exports FROM usage_counters uc
    WHERE uc.user_id = p_user_id AND uc.period_start = v_period_start;
END;
$$;


-- ============================================================================
-- SECTION 10: 043_report_templates
-- ============================================================================

CREATE TABLE IF NOT EXISTS report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    template_id TEXT NOT NULL UNIQUE,
    template_name TEXT NOT NULL,
    template_version TEXT DEFAULT '1.0',
    config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_report_templates_org ON report_templates(org_id);
CREATE INDEX IF NOT EXISTS idx_report_templates_template_id ON report_templates(template_id);
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'report_templates' AND policyname = 'Users can view templates in their org') THEN
    CREATE POLICY "Users can view templates in their org" ON report_templates FOR SELECT TO authenticated
      USING (org_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()) OR org_id IS NULL);
    CREATE POLICY "Users can insert templates in their org" ON report_templates FOR INSERT TO authenticated
      WITH CHECK (org_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()) OR org_id IS NULL);
    CREATE POLICY "Users can update templates in their org" ON report_templates FOR UPDATE TO authenticated
      USING (org_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()));
    CREATE POLICY "Users can delete templates in their org" ON report_templates FOR DELETE TO authenticated
      USING (org_id IN (SELECT organization_id FROM organization_members WHERE user_id = auth.uid()));
    CREATE POLICY "Service role full access on report_templates" ON report_templates FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;

COMMENT ON TABLE report_templates IS 'Custom Firehorse report templates (JSON config). Editable via dashboard Template Editor.';


-- ============================================================================
-- SECTION 11: 044_hil_escalations (fixed: IF NOT EXISTS on indexes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS hil_escalations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  confidence NUMERIC(4,3),
  context JSONB DEFAULT '{}',
  channel TEXT NOT NULL DEFAULT 'email',
  recipient TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_hil_escalations_pending ON hil_escalations (created_at DESC) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_hil_escalations_agent ON hil_escalations (agent_name);

ALTER TABLE hil_escalations ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hil_escalations' AND policyname = 'hil_escalations_service_only') THEN
    CREATE POLICY hil_escalations_service_only ON hil_escalations USING (auth.role() = 'service_role');
  END IF;
END $$;

COMMENT ON TABLE hil_escalations IS 'Agent escalation records. Created when agent confidence drops below 80%.';


-- ============================================================================
-- SECTION 12: 045_customer_onboarding
-- ============================================================================

CREATE TABLE IF NOT EXISTS customer_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Finland',
  employee_count TEXT NOT NULL DEFAULT '1-50',
  annual_revenue TEXT,
  regulations TEXT[] NOT NULL DEFAULT '{csrd}',
  data_sources TEXT[] NOT NULL DEFAULT '{}',
  erp_connection JSONB,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_onboarding_user ON customer_onboarding (user_id);
CREATE INDEX IF NOT EXISTS idx_customer_onboarding_industry ON customer_onboarding (industry);

ALTER TABLE customer_onboarding ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'customer_onboarding' AND policyname = 'customer_onboarding_select') THEN
    CREATE POLICY customer_onboarding_select ON customer_onboarding FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY customer_onboarding_insert ON customer_onboarding FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY customer_onboarding_update ON customer_onboarding FOR UPDATE USING (auth.uid() = user_id);
    CREATE POLICY customer_onboarding_service ON customer_onboarding USING (auth.role() = 'service_role');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_customer_onboarding_timestamp()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_customer_onboarding_updated ON customer_onboarding;
CREATE TRIGGER trg_customer_onboarding_updated
  BEFORE UPDATE ON customer_onboarding FOR EACH ROW
  EXECUTE FUNCTION update_customer_onboarding_timestamp();

COMMENT ON TABLE customer_onboarding IS 'DWS7 customer onboarding wizard data.';


-- ============================================================================
-- SECTION 13: 046_ted_leads (fixed: IF NOT EXISTS on indexes)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ted_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  publication_number TEXT UNIQUE NOT NULL,
  title TEXT,
  buyer_name TEXT,
  buyer_country TEXT,
  notice_type TEXT,
  cpv TEXT,
  estimated_value NUMERIC,
  place_of_performance TEXT,
  publication_date DATE,
  deadline_date DATE,
  ted_url TEXT,
  dm_language TEXT,
  dm_personalization TEXT,
  erp_qualifier TEXT,
  linkedin_contact TEXT,
  linkedin_profile_url TEXT,
  outreach_status TEXT DEFAULT 'new'
    CHECK (outreach_status IN ('new', 'researching', 'dm_sent', 'followed_up', 'replied', 'demo_booked', 'closed_won', 'closed_lost', 'disqualified')),
  outreach_date TIMESTAMPTZ,
  followup_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ted_leads_pub_number ON ted_leads (publication_number);
CREATE INDEX IF NOT EXISTS idx_ted_leads_status ON ted_leads (outreach_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ted_leads_country ON ted_leads (buyer_country);
CREATE INDEX IF NOT EXISTS idx_ted_leads_date ON ted_leads (publication_date DESC);

ALTER TABLE ted_leads ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ted_leads' AND policyname = 'Service role full access') THEN
    CREATE POLICY "Service role full access" ON ted_leads FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ted_leads' AND policyname = 'Authenticated users can read leads') THEN
    CREATE POLICY "Authenticated users can read leads" ON ted_leads FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ted_leads' AND policyname = 'Authenticated users can update leads') THEN
    CREATE POLICY "Authenticated users can update leads" ON ted_leads FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION update_ted_leads_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ted_leads_updated_at ON ted_leads;
CREATE TRIGGER trigger_ted_leads_updated_at
  BEFORE UPDATE ON ted_leads FOR EACH ROW EXECUTE FUNCTION update_ted_leads_updated_at();

COMMENT ON TABLE ted_leads IS 'Construction leads from TED API v3 — automated daily pipeline';


-- ============================================================================
-- SECTION 14: 047_hybrid_memory_search
-- ============================================================================

ALTER TABLE semantic_memories
  ADD COLUMN IF NOT EXISTS org_id VARCHAR(255),
  ADD COLUMN IF NOT EXISTS expired_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS superseded_by UUID REFERENCES semantic_memories(id);

CREATE INDEX IF NOT EXISTS idx_semantic_org ON semantic_memories(org_id);
CREATE INDEX IF NOT EXISTS idx_semantic_expired ON semantic_memories(expired_at) WHERE expired_at IS NOT NULL;

CREATE OR REPLACE FUNCTION hybrid_memory_search(
  query_text TEXT, query_embedding VECTOR(1536),
  org_filter VARCHAR(255) DEFAULT NULL, customer_filter UUID DEFAULT NULL,
  memory_type_filter VARCHAR(50) DEFAULT NULL, match_count INT DEFAULT 5,
  similarity_threshold FLOAT DEFAULT 0.5, vector_weight FLOAT DEFAULT 0.7, text_weight FLOAT DEFAULT 0.3
)
RETURNS TABLE (id UUID, customer_id UUID, org_id VARCHAR(255), memory_type VARCHAR(50), content TEXT,
  vector_similarity FLOAT, text_similarity FLOAT, combined_score FLOAT, metadata JSONB, confidence FLOAT,
  created_at TIMESTAMPTZ, access_count INTEGER)
LANGUAGE plpgsql SECURITY INVOKER AS $$
BEGIN
  RETURN QUERY
  SELECT sm.id, sm.customer_id, sm.org_id, sm.memory_type, sm.content,
    (1 - (sm.embedding <=> query_embedding))::FLOAT AS vector_similarity,
    COALESCE(similarity(sm.content, query_text), 0)::FLOAT AS text_similarity,
    (vector_weight * (1 - (sm.embedding <=> query_embedding)) + text_weight * COALESCE(similarity(sm.content, query_text), 0))::FLOAT AS combined_score,
    sm.metadata, sm.confidence, sm.created_at, sm.access_count
  FROM semantic_memories sm
  WHERE sm.expired_at IS NULL AND sm.superseded_by IS NULL
    AND (org_filter IS NULL OR sm.org_id = org_filter)
    AND (customer_filter IS NULL OR sm.customer_id = customer_filter)
    AND (memory_type_filter IS NULL OR sm.memory_type = memory_type_filter)
    AND ((1 - (sm.embedding <=> query_embedding)) > similarity_threshold OR similarity(sm.content, query_text) > 0.3)
  ORDER BY (vector_weight * (1 - (sm.embedding <=> query_embedding)) + text_weight * COALESCE(similarity(sm.content, query_text), 0)) DESC
  LIMIT match_count;
END;
$$;

CREATE OR REPLACE FUNCTION touch_memory(memory_id UUID) RETURNS VOID LANGUAGE plpgsql SECURITY INVOKER AS $$
BEGIN UPDATE semantic_memories SET access_count = access_count + 1, accessed_at = NOW() WHERE id = memory_id; END; $$;


-- ============================================================================
-- SECTION 15: 048_memory_audit_log
-- ============================================================================

CREATE TABLE IF NOT EXISTS memory_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation TEXT NOT NULL CHECK (operation IN ('store', 'supersede', 'forget', 'extract')),
  agent_id TEXT NOT NULL,
  agent_ats FLOAT,
  memory_id UUID,
  old_memory_id UUID,
  org_id TEXT NOT NULL,
  customer_id UUID,
  reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_org ON memory_audit_log(org_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON memory_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_operation ON memory_audit_log(operation);
CREATE INDEX IF NOT EXISTS idx_audit_memory ON memory_audit_log(memory_id);
CREATE INDEX IF NOT EXISTS idx_audit_agent ON memory_audit_log(agent_id);

ALTER TABLE memory_audit_log ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memory_audit_log' AND policyname = 'memory_audit_org_isolation') THEN
    CREATE POLICY memory_audit_org_isolation ON memory_audit_log FOR ALL USING (org_id = current_setting('app.org_id', true));
    CREATE POLICY memory_audit_immutable_no_update ON memory_audit_log FOR UPDATE USING (false);
    CREATE POLICY memory_audit_immutable_no_delete ON memory_audit_log FOR DELETE USING (false);
  END IF;
END $$;

-- Updated forget_memory with KYA-S schema
CREATE OR REPLACE FUNCTION forget_memory(p_memory_id UUID, forget_reason TEXT DEFAULT 'user_request', p_agent_id TEXT DEFAULT 'system', p_org_id TEXT DEFAULT NULL)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY INVOKER AS $$
DECLARE affected INT; v_org_id TEXT;
BEGIN
  UPDATE semantic_memories SET expired_at = NOW() WHERE id = p_memory_id AND expired_at IS NULL RETURNING org_id INTO v_org_id;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected > 0 THEN
    INSERT INTO memory_audit_log (operation, agent_id, memory_id, org_id, reason, metadata)
    VALUES ('forget', p_agent_id, p_memory_id, COALESCE(p_org_id, v_org_id, 'unknown'), forget_reason, jsonb_build_object('expired_at', NOW()));
  END IF;
  RETURN affected > 0;
END;
$$;

-- supersede_memory with confidence-delta hard gate
CREATE OR REPLACE FUNCTION supersede_memory(
  p_old_memory_id UUID, p_new_content TEXT, p_new_confidence FLOAT DEFAULT 1.0,
  p_new_source TEXT DEFAULT 'agent', p_reason TEXT DEFAULT 'temporal_supersede',
  p_agent_id TEXT DEFAULT 'system', p_agent_ats FLOAT DEFAULT NULL,
  p_org_id TEXT DEFAULT NULL, p_customer_id UUID DEFAULT NULL, p_new_metadata JSONB DEFAULT '{}'
)
RETURNS TABLE (new_memory_id UUID, requires_review BOOLEAN, confidence_delta FLOAT, kya_decision TEXT)
LANGUAGE plpgsql SECURITY INVOKER AS $$
DECLARE
  v_old_confidence FLOAT; v_old_content TEXT; v_old_org_id TEXT; v_old_customer_id UUID;
  v_old_memory_type VARCHAR(50); v_old_embedding VECTOR(1536);
  v_confidence_delta FLOAT; v_requires_review BOOLEAN; v_kya_decision TEXT; v_new_id UUID;
BEGIN
  SELECT sm.confidence, sm.content, sm.org_id, sm.customer_id, sm.memory_type, sm.embedding
  INTO v_old_confidence, v_old_content, v_old_org_id, v_old_customer_id, v_old_memory_type, v_old_embedding
  FROM semantic_memories sm WHERE sm.id = p_old_memory_id AND sm.expired_at IS NULL AND sm.superseded_by IS NULL;
  IF v_old_confidence IS NULL THEN RAISE EXCEPTION 'Memory % not found or already superseded/expired', p_old_memory_id; END IF;
  v_confidence_delta := ABS(p_new_confidence - v_old_confidence);
  IF v_confidence_delta > 0.3 THEN
    v_requires_review := true; v_kya_decision := 'pending_review (confidence_delta > 0.3)';
    INSERT INTO memory_audit_log (operation, agent_id, agent_ats, memory_id, old_memory_id, org_id, customer_id, reason, metadata)
    VALUES ('supersede', p_agent_id, p_agent_ats, NULL, p_old_memory_id, COALESCE(p_org_id, v_old_org_id), COALESCE(p_customer_id, v_old_customer_id), p_reason,
      jsonb_build_object('old_content', v_old_content, 'new_content', p_new_content, 'old_confidence', v_old_confidence, 'new_confidence', p_new_confidence, 'confidence_delta', v_confidence_delta, 'kya_decision', v_kya_decision, 'status', 'pending_review'));
    RETURN QUERY SELECT NULL::UUID, v_requires_review, v_confidence_delta, v_kya_decision; RETURN;
  END IF;
  v_requires_review := false; v_kya_decision := format('auto_approved (confidence_delta %.2f <= 0.3)', v_confidence_delta);
  INSERT INTO semantic_memories (content, memory_type, customer_id, org_id, embedding, metadata, source, confidence, access_count, created_at, accessed_at)
  VALUES (p_new_content, v_old_memory_type, COALESCE(p_customer_id, v_old_customer_id), COALESCE(p_org_id, v_old_org_id), v_old_embedding, p_new_metadata, p_new_source, p_new_confidence, 0, NOW(), NOW())
  RETURNING id INTO v_new_id;
  UPDATE semantic_memories SET superseded_by = v_new_id WHERE id = p_old_memory_id;
  INSERT INTO memory_audit_log (operation, agent_id, agent_ats, memory_id, old_memory_id, org_id, customer_id, reason, metadata)
  VALUES ('supersede', p_agent_id, p_agent_ats, v_new_id, p_old_memory_id, COALESCE(p_org_id, v_old_org_id), COALESCE(p_customer_id, v_old_customer_id), p_reason,
    jsonb_build_object('old_content', v_old_content, 'new_content', p_new_content, 'old_confidence', v_old_confidence, 'new_confidence', p_new_confidence, 'confidence_delta', v_confidence_delta, 'kya_decision', v_kya_decision));
  RETURN QUERY SELECT v_new_id, v_requires_review, v_confidence_delta, v_kya_decision;
END;
$$;

CREATE OR REPLACE FUNCTION log_memory_audit(p_operation TEXT, p_agent_id TEXT, p_memory_id UUID DEFAULT NULL, p_org_id TEXT DEFAULT 'unknown', p_customer_id UUID DEFAULT NULL, p_reason TEXT DEFAULT NULL, p_agent_ats FLOAT DEFAULT NULL, p_metadata JSONB DEFAULT '{}')
RETURNS UUID LANGUAGE plpgsql SECURITY INVOKER AS $$
DECLARE v_audit_id UUID;
BEGIN
  INSERT INTO memory_audit_log (operation, agent_id, agent_ats, memory_id, org_id, customer_id, reason, metadata)
  VALUES (p_operation, p_agent_id, p_agent_ats, p_memory_id, p_org_id, p_customer_id, p_reason, p_metadata) RETURNING id INTO v_audit_id;
  RETURN v_audit_id;
END;
$$;


-- ============================================================================
-- SECTION 16: 049_memory_confidence_decay
-- ============================================================================

CREATE OR REPLACE FUNCTION decay_stale_memories(p_half_life_days INT DEFAULT 90, p_decay_threshold FLOAT DEFAULT 0.1, p_dry_run BOOLEAN DEFAULT false, p_org_id TEXT DEFAULT NULL)
RETURNS TABLE (memory_id UUID, org_id TEXT, old_confidence FLOAT, new_confidence FLOAT, days_since_access FLOAT, below_threshold BOOLEAN)
LANGUAGE plpgsql SECURITY INVOKER AS $$
BEGIN
  IF p_dry_run THEN
    RETURN QUERY SELECT sm.id, sm.org_id,
      sm.confidence::FLOAT,
      (sm.confidence * (p_half_life_days::FLOAT / (p_half_life_days::FLOAT + EXTRACT(EPOCH FROM (NOW() - COALESCE(sm.accessed_at, sm.created_at))) / 86400.0)))::FLOAT,
      (EXTRACT(EPOCH FROM (NOW() - COALESCE(sm.accessed_at, sm.created_at))) / 86400.0)::FLOAT,
      (sm.confidence * (p_half_life_days::FLOAT / (p_half_life_days::FLOAT + EXTRACT(EPOCH FROM (NOW() - COALESCE(sm.accessed_at, sm.created_at))) / 86400.0))) < p_decay_threshold
    FROM semantic_memories sm WHERE sm.expired_at IS NULL AND sm.superseded_by IS NULL AND (p_org_id IS NULL OR sm.org_id = p_org_id);
  ELSE
    RETURN QUERY
    WITH decayed AS (
      UPDATE semantic_memories sm SET confidence = (sm.confidence * (p_half_life_days::FLOAT / (p_half_life_days::FLOAT + EXTRACT(EPOCH FROM (NOW() - COALESCE(sm.accessed_at, sm.created_at))) / 86400.0)))::FLOAT
      WHERE sm.expired_at IS NULL AND sm.superseded_by IS NULL AND (p_org_id IS NULL OR sm.org_id = p_org_id)
      RETURNING sm.id AS memory_id, sm.org_id, sm.confidence AS new_confidence
    )
    SELECT d.memory_id, d.org_id, d.new_confidence, d.new_confidence, 0.0::FLOAT, d.new_confidence < p_decay_threshold FROM decayed d;

    INSERT INTO memory_audit_log (operation, agent_id, org_id, reason, metadata)
    VALUES ('extract', 'decay-cron', COALESCE(p_org_id, 'all'), 'confidence_decay_run',
      jsonb_build_object('half_life_days', p_half_life_days, 'decay_threshold', p_decay_threshold, 'dry_run', p_dry_run, 'run_at', NOW()));
  END IF;
END;
$$;


-- ============================================================================
-- SECTION 17: 052_user_settings
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'fi', 'de', 'sv')),
  notifications JSONB NOT NULL DEFAULT '{"emailAlerts":true,"complianceDeadlines":true,"carbonThresholds":false,"reportReady":true,"weeklyDigest":true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_settings_user_id_unique UNIQUE (user_id)
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_settings' AND policyname = 'Users can read own settings') THEN
    CREATE POLICY "Users can read own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
    CREATE POLICY "Users can insert own settings" ON public.user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Users can update own settings" ON public.user_settings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    CREATE POLICY "Service role full access" ON public.user_settings FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

COMMENT ON TABLE public.user_settings IS 'Dashboard user preferences (theme, locale, notifications) — synced from frontend';


-- ============================================================================
-- SECTION 18: 053_system_heartbeat
-- ============================================================================

CREATE TABLE IF NOT EXISTS system_heartbeat (
    id          text PRIMARY KEY DEFAULT 'dws6',
    last_beat   timestamptz NOT NULL DEFAULT now(),
    source      text NOT NULL DEFAULT 'morning-briefing',
    version     text
);

ALTER TABLE system_heartbeat ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'system_heartbeat' AND policyname = 'Service role only') THEN
    CREATE POLICY "Service role only" ON system_heartbeat USING (auth.role() = 'service_role');
  END IF;
END $$;


-- ============================================================================
-- DONE. 18 sections applied.
--
-- NOT INCLUDED (run separately if needed):
--   051_memory_pgcron_decay.sql — requires pg_cron extension (Supabase Pro)
--     Pre-flight: SELECT * FROM pg_extension WHERE extname = 'pg_cron';
-- ============================================================================

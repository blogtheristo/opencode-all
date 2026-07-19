-- Migration 041: Fix Partial Runs
-- Consolidated fix for migrations that never ran or ran partially
-- Applied via MCP on March 4, 2026
--
-- Fixes:
-- - 013 agent tracking (ALTER TABLE + CREATE TABLEs + views/functions/RLS)
-- - 014 climate_assistant_usage
-- - 027 email_queue
-- - 038 article12_audit_log (EU AI Act compliance)
-- - 040 grok_consent tables (GDPR compliance)
-- - emission_factors unique constraint (for 029 seed compatibility)
-- - firehorse_signals authenticated-read RLS policy

-- Section 1: 013 ALTER TABLE columns + indexes on firehorse_leads/events
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

-- Section 2: 013 CREATE TABLEs (agent_metrics, agent_signals, agent_costs, agent_approvals)
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

-- These indexes assume the Section-2 table variants (agent_name/date columns).
-- When 013_agent_tracking's variants already exist (agent_id/metric_date), the
-- CREATE TABLE IF NOT EXISTS above no-ops and these columns are absent — guard
-- each index on the columns it needs (caught by the CI soak, blank-slate replay).
DO $$
DECLARE
  spec RECORD;
BEGIN
  FOR spec IN
    SELECT * FROM (VALUES
      ('agent_metrics_agent_name_date_idx', 'agent_metrics',  ARRAY['agent_name','date'],
       'CREATE INDEX IF NOT EXISTS agent_metrics_agent_name_date_idx ON agent_metrics (agent_name, date DESC)'),
      ('agent_signals_agent_name_idx',      'agent_signals',  ARRAY['agent_name'],
       'CREATE INDEX IF NOT EXISTS agent_signals_agent_name_idx ON agent_signals (agent_name)'),
      ('agent_signals_expires_at_idx',      'agent_signals',  ARRAY['expires_at'],
       'CREATE INDEX IF NOT EXISTS agent_signals_expires_at_idx ON agent_signals (expires_at)'),
      ('agent_costs_agent_name_idx',        'agent_costs',    ARRAY['agent_name'],
       'CREATE INDEX IF NOT EXISTS agent_costs_agent_name_idx ON agent_costs (agent_name)'),
      ('agent_costs_created_at_idx',        'agent_costs',    ARRAY['created_at'],
       'CREATE INDEX IF NOT EXISTS agent_costs_created_at_idx ON agent_costs (created_at DESC)'),
      ('agent_approvals_status_idx',        'agent_approvals', ARRAY['approval_status'],
       'CREATE INDEX IF NOT EXISTS agent_approvals_status_idx ON agent_approvals (approval_status)'),
      ('agent_approvals_expires_at_idx',    'agent_approvals', ARRAY['expires_at'],
       'CREATE INDEX IF NOT EXISTS agent_approvals_expires_at_idx ON agent_approvals (expires_at)')
    ) AS t(idx_name, tbl, cols, ddl)
  LOOP
    IF (SELECT count(*) FROM information_schema.columns c
        WHERE c.table_schema = 'public' AND c.table_name = spec.tbl
          AND c.column_name = ANY(spec.cols)) = array_length(spec.cols, 1) THEN
      EXECUTE spec.ddl;
    ELSE
      RAISE NOTICE '041: skipping % — %.% lacks required column(s)', spec.idx_name, 'public', spec.tbl;
    END IF;
  END LOOP;
END $$;

-- Section 3: 013 views/functions/RLS
-- Guarded: this definition assumes the 041-variant agent tables; when the
-- 013-variant is live, skip (and keep 013's view) — caught by the CI soak.
DO $v1$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='agent_metrics' AND column_name='agent_name') THEN
    EXECUTE 'DROP VIEW IF EXISTS v_high_priority_leads';
    EXECUTE $ddl$
CREATE VIEW v_high_priority_leads WITH (security_invoker = true) AS
SELECT
  l.*,
  m.conversion_rate,
  m.avg_confidence
FROM firehorse_leads l
LEFT JOIN agent_metrics m ON l.agent_id = m.agent_name
WHERE l.agent_priority_score > 0.8
  AND l.created_at > NOW() - INTERVAL '30 days'
ORDER BY l.agent_priority_score DESC, l.created_at DESC
$ddl$;
  ELSE
    RAISE NOTICE '041: keeping 013-variant v_high_priority_leads';
  END IF;
END $v1$;

-- Guarded: this definition assumes the 041-variant agent tables; when the
-- 013-variant is live, skip (and keep 013's view) — caught by the CI soak.
DO $v2$
BEGIN
  IF (SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='agent_approvals' AND column_name IN ('approval_status','expires_at','approved_by')) = 3 THEN
    EXECUTE 'DROP VIEW IF EXISTS v_pending_approvals';
    EXECUTE $ddl$
CREATE VIEW v_pending_approvals WITH (security_invoker = true) AS
SELECT
  a.*,
  u.email as approver_email
FROM agent_approvals a
LEFT JOIN auth.users u ON a.approved_by = u.id
WHERE a.approval_status = 'pending'
  AND a.expires_at > NOW()
ORDER BY a.created_at DESC
$ddl$;
  ELSE
    RAISE NOTICE '041: keeping 013-variant v_pending_approvals';
  END IF;
END $v2$;

-- Guarded: this definition assumes the 041-variant agent tables; when the
-- 013-variant is live, skip (and keep 013's view) — caught by the CI soak.
DO $v3$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='agent_metrics' AND column_name='agent_name') THEN
    EXECUTE 'DROP VIEW IF EXISTS v_agent_performance_leaderboard';
    EXECUTE $ddl$
CREATE VIEW v_agent_performance_leaderboard WITH (security_invoker = true) AS
SELECT
  agent_name,
  SUM(leads_processed) as total_leads,
  SUM(leads_converted) as total_conversions,
  ROUND(AVG(conversion_rate), 2) as avg_conversion_rate,
  ROUND(AVG(avg_confidence), 2) as avg_confidence,
  SUM(total_cost_cents) as total_cost_cents,
  ROUND(AVG(avg_processing_time_ms), 0) as avg_processing_time_ms
FROM agent_metrics
WHERE date > NOW() - INTERVAL '30 days'
GROUP BY agent_name
ORDER BY avg_conversion_rate DESC, total_conversions DESC
$ddl$;
  ELSE
    RAISE NOTICE '041: keeping 013-variant v_agent_performance_leaderboard';
  END IF;
END $v3$;

CREATE OR REPLACE FUNCTION update_agent_metrics()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO agent_metrics (agent_name, date, leads_processed, leads_converted, conversion_rate, avg_confidence, total_cost_cents, avg_processing_time_ms, total_tokens)
  VALUES (
    NEW.agent_id,
    CURRENT_DATE,
    1,
    CASE WHEN NEW.agent_recommendation = 'convert' THEN 1 ELSE 0 END,
    CASE WHEN NEW.agent_recommendation = 'convert' THEN 1.0 ELSE 0.0 END,
    NEW.agent_confidence,
    NEW.agent_cost_cents,
    NEW.agent_processing_time_ms,
    NEW.agent_tokens
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
    NEW.agent_id,
    'lead_processed',
    NEW.id::text,
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
  UPDATE agent_approvals
  SET approval_status = 'expired'
  WHERE approval_status = 'pending'
    AND expires_at < NOW();
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
  AFTER INSERT ON firehorse_leads
  FOR EACH ROW
  WHEN (NEW.agent_id IS NOT NULL)
  EXECUTE FUNCTION update_agent_metrics();

DROP TRIGGER IF EXISTS emit_agent_signal_trigger ON firehorse_leads;
CREATE TRIGGER emit_agent_signal_trigger
  AFTER INSERT ON firehorse_leads
  FOR EACH ROW
  WHEN (NEW.agent_id IS NOT NULL)
  EXECUTE FUNCTION emit_agent_signal();

-- Section 4: 014 climate_assistant_usage
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

CREATE OR REPLACE FUNCTION get_or_create_usage_for_date(
  p_user_id UUID,
  p_org_id UUID DEFAULT NULL
)
RETURNS UUID LANGUAGE plpgsql AS $$
DECLARE
  usage_id UUID;
BEGIN
  INSERT INTO climate_assistant_usage (user_id, org_id, date)
  VALUES (p_user_id, p_org_id, CURRENT_DATE)
  ON CONFLICT (user_id, date) DO NOTHING
  RETURNING id INTO usage_id;

  IF usage_id IS NULL THEN
    SELECT id INTO usage_id
    FROM climate_assistant_usage
    WHERE user_id = p_user_id AND date = CURRENT_DATE;
  END IF;

  RETURN usage_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_climate_usage(
  p_user_id UUID,
  p_org_id UUID DEFAULT NULL,
  p_requests INTEGER DEFAULT 1,
  p_tokens INTEGER DEFAULT 0,
  p_cost_cents INTEGER DEFAULT 0
)
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

-- Section 5: 027 email_queue
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

DROP VIEW IF EXISTS v_email_queue_stats;
CREATE VIEW v_email_queue_stats WITH (security_invoker = true) AS
SELECT
  status,
  COUNT(*) as count,
  MIN(created_at) as oldest_created,
  MAX(created_at) as newest_created,
  MIN(sent_at) as oldest_sent,
  MAX(sent_at) as newest_sent
FROM email_queue
GROUP BY status
ORDER BY status;

ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_queue' AND policyname = 'Service role full access to email_queue') THEN
    CREATE POLICY "Service role full access to email_queue" ON email_queue FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'email_queue' AND policyname = 'Authenticated users can read email_queue') THEN
    CREATE POLICY "Authenticated users can read email_queue" ON email_queue FOR SELECT TO authenticated USING (true);
  END IF;
END $$;

-- Section 6: 038 article12_audit_log (EU AI Act Article 12)
CREATE TABLE IF NOT EXISTS article12_audit_log (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id                TEXT        NOT NULL,
  trace_id                UUID        NOT NULL DEFAULT gen_random_uuid(),
  input_hash              TEXT        NOT NULL,
  model                   TEXT        NOT NULL,
  thinking_effort         TEXT        CHECK (thinking_effort IN ('low','medium','high','max','none')),
  input_token_count       INTEGER,
  output_token_count      INTEGER,
  regulation_ids          TEXT[],
  decision_summary        TEXT        CHECK (char_length(decision_summary) <= 500),
  thinking_block_hash     TEXT,
  pii_scrubbed            BOOLEAN     NOT NULL DEFAULT TRUE,
  pii_types_found         TEXT[],
  pii_replacement_count   INTEGER     NOT NULL DEFAULT 0,
  scrub_manifest_hash     TEXT,
  inference_in_eu         BOOLEAN     NOT NULL DEFAULT FALSE,
  pii_scrub_location      TEXT        NOT NULL DEFAULT 'veriton-helsinki-fi',
  inference_location      TEXT        NOT NULL DEFAULT 'anthropic-us',
  scrubber_version        TEXT        NOT NULL DEFAULT '1.0.0',
  risk_classification     TEXT        CHECK (risk_classification IN ('high','limited','minimal')) DEFAULT 'high',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS article12_audit_log_agent_id_idx   ON article12_audit_log (agent_id);
CREATE INDEX IF NOT EXISTS article12_audit_log_trace_id_idx   ON article12_audit_log (trace_id);
CREATE INDEX IF NOT EXISTS article12_audit_log_created_at_idx ON article12_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS article12_audit_log_model_idx      ON article12_audit_log (model);

COMMENT ON TABLE article12_audit_log IS
  'EU AI Act Article 12 audit log. Append-only. Do not delete rows. Retention: 10 years (draft regulation).';
COMMENT ON COLUMN article12_audit_log.inference_in_eu IS
  'Honest declaration. FALSE = Anthropic US inference. TRUE only if a GA EU endpoint is used.';
COMMENT ON COLUMN article12_audit_log.pii_scrub_location IS
  'Where PII scrubbing ran. Must be EU jurisdiction for GDPR compliance claim.';
COMMENT ON COLUMN article12_audit_log.thinking_block_hash IS
  'SHA-256 of the adaptive thinking block. Proves reasoning lineage without exposing raw reasoning.';
COMMENT ON COLUMN article12_audit_log.decision_summary IS
  'First 500 chars of agent output for human review. Must not contain PII (scrubbed before insert).';

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

-- Section 7: 040 grok_consent tables (GDPR + EU AI Act)
CREATE TABLE IF NOT EXISTS grok_consent (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id         uuid,
  consented      boolean     NOT NULL DEFAULT false,
  consent_version text       NOT NULL DEFAULT '1.0',
  ip_address     inet,
  user_agent     text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, org_id)
);

CREATE TABLE IF NOT EXISTS grok_consent_audit (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id     uuid        REFERENCES grok_consent(id) ON DELETE SET NULL,
  user_id        uuid        NOT NULL,
  org_id         uuid,
  action         text        NOT NULL CHECK (action IN ('granted', 'revoked', 'updated')),
  consented      boolean     NOT NULL,
  consent_version text       NOT NULL,
  ip_address     inet,
  user_agent     text,
  actor_role     text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grok_inference_log (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL,
  org_id         uuid,
  consent_id     uuid        REFERENCES grok_consent(id) ON DELETE SET NULL,
  model          text        NOT NULL,
  prompt_tokens  integer,
  completion_tokens integer,
  total_tokens   integer,
  latency_ms     integer,
  status         text        NOT NULL CHECK (status IN ('success', 'error', 'timeout')),
  error_message  text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grok_consent_user_id ON grok_consent (user_id);
CREATE INDEX IF NOT EXISTS idx_grok_consent_audit_consent_id ON grok_consent_audit (consent_id);
CREATE INDEX IF NOT EXISTS idx_grok_consent_audit_user_id ON grok_consent_audit (user_id);
CREATE INDEX IF NOT EXISTS idx_grok_inference_log_user_id ON grok_inference_log (user_id);
CREATE INDEX IF NOT EXISTS idx_grok_inference_log_created_at ON grok_inference_log (created_at);

ALTER TABLE grok_consent        ENABLE ROW LEVEL SECURITY;
ALTER TABLE grok_consent_audit  ENABLE ROW LEVEL SECURITY;
ALTER TABLE grok_inference_log  ENABLE ROW LEVEL SECURITY;

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

-- Section 8: Fixes for emission_factors + firehorse_signals RLS
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
    WHERE tablename = 'firehorse_signals'
      AND policyname = 'Authenticated users can read signals'
  ) THEN
    CREATE POLICY "Authenticated users can read signals"
      ON firehorse_signals FOR SELECT
      TO authenticated
      USING (TRUE);
  END IF;
END $$;
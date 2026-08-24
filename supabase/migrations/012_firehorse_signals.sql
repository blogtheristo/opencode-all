-- Firehorse Signal-Based Sales Automation - Database Schema
-- Signal collection and correlation tracking for DWS IQ 6

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE signal_source AS ENUM (
  'linkedin',
  'x',
  'web',
  'rss',
  'manual'
);

CREATE TYPE signal_type AS ENUM (
  'job_change',
  'company_update',
  'press_release',
  'blog_post',
  'social_post',
  'funding',
  'project_announcement',
  'other'
);

CREATE TYPE signal_status AS ENUM (
  'detected',        -- Signal found
  'analyzed',        -- Correlation calculated
  'queued',          -- Ready to send
  'approved',        -- Human approved
  'sent',            -- Message sent
  'responded',       -- Customer responded
  'demo_booked',     -- Demo scheduled
  'ignored',         -- No response after 14 days
  'rejected'         -- Human rejected (not relevant)
);

-- ============================================================================
-- MAIN TABLE: firehorse_signals
-- ============================================================================

CREATE TABLE firehorse_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Signal source
  signal_source signal_source NOT NULL,
  signal_type signal_type NOT NULL,
  signal_date TIMESTAMPTZ NOT NULL,

  -- Target company/contact
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_title TEXT,
  contact_email TEXT,
  contact_linkedin_url TEXT,

  -- Signal content
  signal_content TEXT NOT NULL,
  signal_url TEXT,
  signal_metadata JSONB DEFAULT '{}'::jsonb,

  -- Correlation analysis
  correlation_score INTEGER CHECK (correlation_score BETWEEN 1 AND 5),
  correlation_reason TEXT,
  dws6_feature_match TEXT[] DEFAULT ARRAY[]::TEXT[],
  keywords_matched TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Workflow state
  status signal_status DEFAULT 'detected' NOT NULL,

  -- Message drafting
  message_draft TEXT,
  message_final TEXT,
  message_sent_at TIMESTAMPTZ,

  -- Response tracking
  response_received_at TIMESTAMPTZ,
  response_content TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_signals_correlation ON firehorse_signals(correlation_score DESC);
CREATE INDEX idx_signals_status ON firehorse_signals(status);
CREATE INDEX idx_signals_date ON firehorse_signals(signal_date DESC);
CREATE INDEX idx_signals_company ON firehorse_signals(company_name);
CREATE INDEX idx_signals_source ON firehorse_signals(signal_source);

-- ============================================================================
-- TRIGGER: Auto-update updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_firehorse_signals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_firehorse_signals_updated_at
  BEFORE UPDATE ON firehorse_signals
  FOR EACH ROW
  EXECUTE FUNCTION update_firehorse_signals_updated_at();

-- ============================================================================
-- VIEWS: Signal Prioritization
-- ============================================================================

-- ULTRA signals (correlation score 5)
CREATE VIEW firehorse_signals_ultra AS
SELECT * FROM firehorse_signals
WHERE correlation_score = 5
  AND status IN ('analyzed', 'queued')
  AND signal_date >= NOW() - INTERVAL '14 days'
ORDER BY signal_date DESC;

-- HIGH signals (correlation score 4)
CREATE VIEW firehorse_signals_high AS
SELECT * FROM firehorse_signals
WHERE correlation_score = 4
  AND status IN ('analyzed', 'queued')
  AND signal_date >= NOW() - INTERVAL '14 days'
ORDER BY signal_date DESC;

-- Pending approval (signals ready for human review)
CREATE VIEW firehorse_signals_pending_approval AS
SELECT
  s.id,
  s.company_name,
  s.contact_name,
  s.contact_title,
  s.signal_date,
  s.correlation_score,
  s.correlation_reason,
  s.signal_content,
  s.message_draft,
  s.signal_url,
  s.dws6_feature_match,
  s.keywords_matched,
  s.created_at
FROM firehorse_signals s
WHERE s.status = 'queued'
  AND s.correlation_score >= 4
ORDER BY s.correlation_score DESC, s.signal_date DESC;

-- ============================================================================
-- VIEW: Performance Metrics
-- ============================================================================

CREATE VIEW firehorse_signals_metrics AS
SELECT
  DATE_TRUNC('week', signal_date) AS week,
  correlation_score,
  COUNT(*) AS total_signals,
  SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) AS sent_count,
  SUM(CASE WHEN status = 'responded' THEN 1 ELSE 0 END) AS response_count,
  SUM(CASE WHEN status = 'demo_booked' THEN 1 ELSE 0 END) AS demo_count,
  ROUND(
    100.0 * SUM(CASE WHEN status = 'responded' THEN 1 ELSE 0 END) /
    NULLIF(SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END), 0),
    2
  ) AS response_rate_pct
FROM firehorse_signals
WHERE signal_date >= NOW() - INTERVAL '90 days'
GROUP BY week, correlation_score
ORDER BY week DESC, correlation_score DESC;

-- ============================================================================
-- VIEW: Daily Summary
-- ============================================================================

CREATE VIEW firehorse_signals_daily_summary AS
SELECT
  DATE(signal_date) AS date,
  signal_source,
  correlation_score,
  COUNT(*) AS signal_count,
  COUNT(DISTINCT company_name) AS unique_companies
FROM firehorse_signals
WHERE signal_date >= NOW() - INTERVAL '30 days'
GROUP BY DATE(signal_date), signal_source, correlation_score
ORDER BY date DESC, correlation_score DESC;

-- ============================================================================
-- FUNCTION: Get signals by company
-- ============================================================================

CREATE OR REPLACE FUNCTION get_signals_by_company(company_name_param TEXT)
RETURNS TABLE (
  id UUID,
  signal_date TIMESTAMPTZ,
  signal_type signal_type,
  correlation_score INTEGER,
  status signal_status,
  message_draft TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.signal_date,
    s.signal_type,
    s.correlation_score,
    s.status,
    s.message_draft
  FROM firehorse_signals s
  WHERE s.company_name = company_name_param
  ORDER BY s.signal_date DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Get top companies by signal count
-- ============================================================================

CREATE OR REPLACE FUNCTION get_top_companies_by_signals(limit_param INTEGER DEFAULT 10)
RETURNS TABLE (
  company_name TEXT,
  signal_count BIGINT,
  ultra_count BIGINT,
  high_count BIGINT,
  latest_signal TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.company_name,
    COUNT(*) AS signal_count,
    SUM(CASE WHEN s.correlation_score = 5 THEN 1 ELSE 0 END) AS ultra_count,
    SUM(CASE WHEN s.correlation_score = 4 THEN 1 ELSE 0 END) AS high_count,
    MAX(s.signal_date) AS latest_signal
  FROM firehorse_signals s
  WHERE s.signal_date >= NOW() - INTERVAL '30 days'
  GROUP BY s.company_name
  ORDER BY signal_count DESC, latest_signal DESC
  LIMIT limit_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS (Row Level Security) - Optional, enable if multi-tenant
-- ============================================================================

-- ALTER TABLE firehorse_signals ENABLE ROW LEVEL SECURITY;

-- Example policy (adjust based on your auth setup)
-- CREATE POLICY "Users can view all signals"
--   ON firehorse_signals FOR SELECT
--   USING (true);

-- CREATE POLICY "Only admins can insert signals"
--   ON firehorse_signals FOR INSERT
--   WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE firehorse_signals IS 'Signal-based sales automation tracking for DWS IQ 6';
COMMENT ON COLUMN firehorse_signals.correlation_score IS 'Correlation score (1-5): 1=LOW, 2=LOW, 3=MEDIUM, 4=HIGH, 5=ULTRA';
COMMENT ON COLUMN firehorse_signals.dws6_feature_match IS 'Array of DWS6 features that match this signal (e.g., [''CSRD'', ''Fit_for_55'', ''SPI_CPI''])';
COMMENT ON COLUMN firehorse_signals.keywords_matched IS 'Array of keywords that triggered this signal';
COMMENT ON VIEW firehorse_signals_pending_approval IS 'Signals with HIGH/ULTRA correlation awaiting human approval';
COMMENT ON VIEW firehorse_signals_metrics IS 'Weekly performance metrics (response rate, demo conversion)';

-- ============================================================================
-- SAMPLE DATA (for testing) - REMOVE IN PRODUCTION
-- ============================================================================

-- Uncomment to insert sample data for testing

/*
INSERT INTO firehorse_signals (
  signal_source,
  signal_type,
  signal_date,
  company_name,
  contact_name,
  contact_title,
  signal_content,
  signal_url,
  correlation_score,
  correlation_reason,
  dws6_feature_match,
  keywords_matched,
  status
) VALUES
(
  'web',
  'press_release',
  NOW() - INTERVAL '2 days',
  'NCC AB',
  'Anders Johansson',
  'COO',
  'NCC Q4 report mentions CSRD compliance requirements and Fit for 55 targets for 2030. Portfolio expansion in Nordics requires better real-time monitoring.',
  'https://www.ncc.se/news/q4-2025-report',
  5,
  'Contains ULTRA keyword: CSRD',
  ARRAY['CSRD', 'Fit_for_55', 'SPI_CPI'],
  ARRAY['CSRD', 'Fit for 55', 'portfolio'],
  'analyzed'
),
(
  'linkedin',
  'job_change',
  NOW() - INTERVAL '5 days',
  'PORR AG',
  'Karl-Heinz Strauss',
  'Chief Digital Officer',
  'Excited to join PORR AG as Chief Digital Officer! Looking forward to leading digital transformation across our CEE portfolio.',
  'https://www.linkedin.com/posts/karlheinz-strauss',
  5,
  'Contains ULTRA keyword: CDO',
  ARRAY['Digitalization', 'Portfolio'],
  ARRAY['CDO', 'digital transformation'],
  'analyzed'
),
(
  'x',
  'social_post',
  NOW() - INTERVAL '7 days',
  'Veidekke ASA',
  'Eirik Knudsen',
  'ESG Director',
  'Our team is preparing for CSRD Wave 2 – massive reporting challenge ahead. Need better tools for Scope 3 emissions tracking.',
  'https://x.com/veidekke_esg/status/123456',
  5,
  'Contains ULTRA keyword: CSRD',
  ARRAY['CSRD', 'Scope_3'],
  ARRAY['CSRD', 'Scope 3', 'emissions'],
  'queued'
);
*/

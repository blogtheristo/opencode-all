-- Migration 046: TED outreach tracking, daily rate limit, learning_log, ted_leads view
-- Idempotent where possible. Transaction-wrapped.

BEGIN;

-- ---------------------------------------------------------------------------
-- construction_leads: outreach + learning + HIL feedback (canonical "ted_leads" rows)
-- ---------------------------------------------------------------------------
ALTER TABLE construction_leads
  ADD COLUMN IF NOT EXISTS resolved_erp VARCHAR(64),
  ADD COLUMN IF NOT EXISTS compliance_keywords TEXT[],
  ADD COLUMN IF NOT EXISTS outreach_sent BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS follow_up_sent BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS follow_up_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS opened BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS replied BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS bounced BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS unsubscribed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS open_rate_lang VARCHAR(16),
  ADD COLUMN IF NOT EXISTS hil_feedback TEXT,
  ADD COLUMN IF NOT EXISTS template_flag VARCHAR(64);

CREATE INDEX IF NOT EXISTS idx_construction_leads_outreach_pending
  ON construction_leads (created_at DESC)
  WHERE outreach_sent = FALSE;

CREATE INDEX IF NOT EXISTS idx_construction_leads_followup
  ON construction_leads (sent_at)
  WHERE outreach_sent = TRUE AND follow_up_sent = FALSE;

COMMENT ON COLUMN construction_leads.resolved_erp IS 'Heuristic ERP match from company-erp-resolver (SAP, IFS, Dynamics, etc.)';
COMMENT ON COLUMN construction_leads.compliance_keywords IS 'TED title/description keyword hits used for filtering';
COMMENT ON COLUMN construction_leads.template_flag IS 'Learning pipeline flag, e.g. review_de_low_open';

-- ---------------------------------------------------------------------------
-- Daily UTC send counter (cap enforced in app + RPC)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ted_outreach_daily_send (
  bucket_utc DATE PRIMARY KEY,
  sent_count INTEGER NOT NULL DEFAULT 0 CHECK (sent_count >= 0 AND sent_count <= 1000),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE ted_outreach_daily_send ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access ted_outreach_daily_send" ON ted_outreach_daily_send;
CREATE POLICY "Service role full access ted_outreach_daily_send"
  ON ted_outreach_daily_send FOR ALL
  USING (auth.role() = 'service_role');

-- After a successful SES send, increment daily counter (max 50/day UTC). Returns success + new total.
CREATE OR REPLACE FUNCTION public.ted_outreach_finish_send()
RETURNS TABLE(success boolean, new_count int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  b date := (timezone('utc', now()))::date;
  v int;
BEGIN
  INSERT INTO ted_outreach_daily_send (bucket_utc, sent_count)
  VALUES (b, 0)
  ON CONFLICT (bucket_utc) DO NOTHING;

  UPDATE ted_outreach_daily_send
  SET
    sent_count = sent_count + 1,
    updated_at = NOW()
  WHERE bucket_utc = b
    AND sent_count < 50
  RETURNING sent_count INTO v;

  IF v IS NULL THEN
    RETURN QUERY SELECT FALSE, COALESCE((SELECT sent_count FROM ted_outreach_daily_send WHERE bucket_utc = b), 0);
  END IF;

  RETURN QUERY SELECT TRUE, v;
END;
$$;

REVOKE ALL ON FUNCTION public.ted_outreach_finish_send() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.ted_outreach_finish_send() TO service_role;

COMMENT ON FUNCTION public.ted_outreach_finish_send IS 'Increment TED outreach daily send count after successful SES delivery (cap 50/day UTC).';

-- ---------------------------------------------------------------------------
-- Weekly aggregates for template / language tuning
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ted_outreach_learning_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL,
  lang VARCHAR(16) NOT NULL,
  cpv_prefix VARCHAR(32) NOT NULL,
  sends INTEGER NOT NULL DEFAULT 0,
  opens INTEGER NOT NULL DEFAULT 0,
  replies INTEGER NOT NULL DEFAULT 0,
  bounces INTEGER NOT NULL DEFAULT 0,
  open_rate NUMERIC(8, 5),
  reply_rate NUMERIC(8, 5),
  bounce_rate NUMERIC(8, 5),
  template_flag VARCHAR(128),
  volume_adjust_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (week_start, lang, cpv_prefix)
);

CREATE INDEX IF NOT EXISTS idx_ted_learning_week ON ted_outreach_learning_log (week_start DESC);

ALTER TABLE ted_outreach_learning_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access ted_outreach_learning_log" ON ted_outreach_learning_log;
CREATE POLICY "Service role full access ted_outreach_learning_log"
  ON ted_outreach_learning_log FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE ted_outreach_learning_log IS 'Weekly aggregates by language + CPV for TED outreach tuning';

-- ---------------------------------------------------------------------------
-- SQL alias: ted_leads == construction_leads (user-facing name)
-- ---------------------------------------------------------------------------
DROP VIEW IF EXISTS ted_leads;
CREATE VIEW ted_leads AS
SELECT * FROM construction_leads;

COMMENT ON VIEW ted_leads IS 'Alias view for construction_leads (TED procurement pipeline).';

COMMIT;

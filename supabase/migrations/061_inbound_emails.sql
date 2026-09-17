-- ============================================================
-- Migration 061: inbound_emails table
-- ------------------------------------------------------------
-- Code-Version: 0.1.0
-- Introduced-In: PR-TBD
-- Branch: claude/fix-mcp-hooks-hardening-v2
-- Date: 2026-04-19
-- Owner: Lifetime Oy
--
-- Purpose: Storage for SES inbound mail parsed by
--          lambda/ses-inbound-parser. One row per received email.
-- ============================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.inbound_emails (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ses_message_id  text NOT NULL UNIQUE,
  received_at     timestamptz NOT NULL,
  from_addr       text,
  to_addrs        text[],
  subject         text,
  body_text       text,
  body_html       text,
  s3_key          text NOT NULL,
  raw_headers     jsonb,
  processed_at    timestamptz,
  error           text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inbound_emails_received_at
  ON public.inbound_emails (received_at DESC);
-- 024 already created inbound_emails in its Resend-era shape (from_email,
-- provider_message_id) and wins via IF NOT EXISTS — this SES-era variant's
-- from_addr column is then absent. Guard the index. (CI soak catch.)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'inbound_emails'
               AND column_name = 'from_addr') THEN
    CREATE INDEX IF NOT EXISTS idx_inbound_emails_from_addr
      ON public.inbound_emails (from_addr);
  ELSE
    RAISE NOTICE '061: skipping idx_inbound_emails_from_addr — 024-variant table';
  END IF;
END $$;

ALTER TABLE public.inbound_emails ENABLE ROW LEVEL SECURITY;

-- service_role: full access (Lambda inserts via service-role key)
CREATE POLICY inbound_emails_service_all
  ON public.inbound_emails
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- authenticated: read-only for now (refine when agent ownership model lands)
CREATE POLICY inbound_emails_auth_read
  ON public.inbound_emails
  FOR SELECT
  TO authenticated
  USING (true);

COMMENT ON TABLE public.inbound_emails IS
  'SES inbound mail (eu-west-1) parsed by lambda/ses-inbound-parser. Raw .eml lives in s3://lifetime-inbound-mail-euw1/inbound/.';

COMMIT;

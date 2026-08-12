-- Migration 068: playbook lead-capture + signed-download tracking
--
-- Purpose:
--   Backs the /playbooks/ funnel on dws10.com. Visitors submit an email on a
--   per-industry landing, receive a 6-char code via Amazon SES (EU SMTP), and
--   on successful verification get a 24h signed URL to the PDF in Supabase
--   Storage (sovereign bucket "playbooks").
--
-- Tables:
--   playbook_leads      — every form submission (verified or waitlist)
--   playbook_downloads  — append-only audit of every successful PDF fetch
--
-- RLS posture:
--   anon may INSERT into playbook_leads (gate form) but NEVER select.
--   anon has no access to playbook_downloads.
--   All reads, code verification, and signed-URL creation flow through the
--   playbook-request / playbook-verify edge functions, which run as
--   service_role.
--
-- Sovereignty:
--   This DB must be the Aiven Helsinki / Scaleway Paris (Tier 1 sovereign)
--   Supabase instance. Verify SUPABASE_URL before applying in prod.
--
-- Additive only — no destructive changes; reversible by DROP TABLE.

BEGIN;

CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;  -- gen_random_uuid()

-- ============================================================
-- playbook_leads
-- ============================================================
CREATE TABLE IF NOT EXISTS playbook_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email citext NOT NULL,
  industry_slug text NOT NULL,
  is_waitlist boolean NOT NULL DEFAULT false,
  language text NOT NULL DEFAULT 'en',

  -- Verification code (never stored plaintext)
  code_hash text,                  -- sha256(code || code_salt), hex
  code_salt text,                  -- per-row random salt, hex
  code_expires_at timestamptz,
  attempts_remaining int NOT NULL DEFAULT 5,

  verified_at timestamptz,
  requested_at timestamptz NOT NULL DEFAULT now(),

  -- Request context for fraud review + GDPR audit trail
  ip inet,
  ua text,
  consent_marketing boolean NOT NULL DEFAULT false,
  consent_text text NOT NULL,      -- snapshot of consent copy shown at submit

  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,

  CONSTRAINT playbook_leads_language_chk
    CHECK (language IN ('en','fi','sv','de','fr')),
  CONSTRAINT playbook_leads_attempts_chk
    CHECK (attempts_remaining >= 0 AND attempts_remaining <= 10)
);

CREATE INDEX IF NOT EXISTS idx_playbook_leads_email_industry
  ON playbook_leads (email, industry_slug);

CREATE INDEX IF NOT EXISTS idx_playbook_leads_requested_at
  ON playbook_leads (requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_playbook_leads_verified
  ON playbook_leads (verified_at)
  WHERE verified_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_playbook_leads_waitlist
  ON playbook_leads (industry_slug, requested_at DESC)
  WHERE is_waitlist = true;

-- ============================================================
-- playbook_downloads
-- ============================================================
CREATE TABLE IF NOT EXISTS playbook_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES playbook_leads(id) ON DELETE CASCADE,
  industry_slug text NOT NULL,
  pdf_version text NOT NULL,       -- e.g. 'defence-en@1.0.0'
  downloaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_playbook_downloads_lead
  ON playbook_downloads (lead_id);

CREATE INDEX IF NOT EXISTS idx_playbook_downloads_industry_time
  ON playbook_downloads (industry_slug, downloaded_at DESC);

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE playbook_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE playbook_downloads ENABLE ROW LEVEL SECURITY;

-- anon: INSERT only, no SELECT. Code hash never crosses anon trust boundary.
DROP POLICY IF EXISTS "anon can insert playbook leads" ON playbook_leads;
CREATE POLICY "anon can insert playbook leads"
  ON playbook_leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- service_role: full access (edge functions verify + read codes).
DROP POLICY IF EXISTS "service_role full access playbook_leads" ON playbook_leads;
CREATE POLICY "service_role full access playbook_leads"
  ON playbook_leads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- playbook_downloads: no anon access, service_role only.
DROP POLICY IF EXISTS "service_role full access playbook_downloads" ON playbook_downloads;
CREATE POLICY "service_role full access playbook_downloads"
  ON playbook_downloads FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Explicit deny for anon on downloads (belt + braces; default-deny already
-- applies, but the policy documents intent).
DROP POLICY IF EXISTS "no anon access to playbook_downloads" ON playbook_downloads;
CREATE POLICY "no anon access to playbook_downloads"
  ON playbook_downloads FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

COMMIT;

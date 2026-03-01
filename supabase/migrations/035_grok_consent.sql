-- Migration 035: Grok Consent & Article 12 Audit Tables
--
-- Regulatory basis:
--   GDPR Art. 6(1)(a) — explicit consent for third-country data transfer (xAI/US)
--   EU AI Act Article 12 — automatic logging for high-risk AI systems
--   NIS2 Art. 21 — incident traceability
--
-- Data sovereignty:
--   All records stored in Supabase eu-north1 (Helsinki, Finland).
--   No prompt/response content stored — only token counts + model ID.
--
-- Tables:
--   grok_consent        — per-org consent record (current state)
--   grok_consent_audit  — immutable log of consent grant/revoke events
--   grok_inference_log  — Article 12 per-call audit trail

-- ============ grok_consent ============

CREATE TABLE IF NOT EXISTS grok_consent (
  org_id                 TEXT PRIMARY KEY,
  granted                BOOLEAN NOT NULL DEFAULT FALSE,
  granted_at             TIMESTAMPTZ,
  granted_by_user_id     TEXT,
  revoked_at             TIMESTAMPTZ,
  revoked_by_user_id     TEXT,
  -- Restrict sharing to explicit data categories (e.g. 'climate', 'carbon')
  allowed_categories     TEXT[] NOT NULL DEFAULT ARRAY['climate', 'carbon', 'compliance'],
  note                   TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE grok_consent IS
  'Per-org explicit consent for routing inference to xAI Grok. '
  'GDPR Art. 6(1)(a) — EU AI Act high-risk AI logging basis.';

-- ============ grok_consent_audit ============
-- Immutable log — no UPDATE/DELETE allowed via RLS

CREATE TABLE IF NOT EXISTS grok_consent_audit (
  id           BIGSERIAL PRIMARY KEY,
  org_id       TEXT NOT NULL,
  action       TEXT NOT NULL CHECK (action IN ('granted', 'revoked')),
  user_id      TEXT NOT NULL,
  note         TEXT,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE grok_consent_audit IS
  'Immutable consent event log. Supports GDPR accountability '
  'and regulator audit requests.';

-- ============ grok_inference_log ============
-- Article 12 trace — no prompt/response content, only metadata

CREATE TABLE IF NOT EXISTS grok_inference_log (
  id             BIGSERIAL PRIMARY KEY,
  org_id         TEXT NOT NULL,
  model          TEXT NOT NULL,
  input_tokens   INTEGER NOT NULL DEFAULT 0,
  output_tokens  INTEGER NOT NULL DEFAULT 0,
  duration_ms    INTEGER NOT NULL DEFAULT 0,
  status         TEXT NOT NULL CHECK (status IN ('ok', 'error')),
  error_message  TEXT,
  logged_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE grok_inference_log IS
  'EU AI Act Article 12 automatic log. Records metadata only — '
  'no prompt or response content is stored. Retention: 7 years.';

-- Indexes for dashboard queries and regulator export
CREATE INDEX IF NOT EXISTS idx_grok_inference_log_org_id
  ON grok_inference_log (org_id, logged_at DESC);

CREATE INDEX IF NOT EXISTS idx_grok_consent_audit_org_id
  ON grok_consent_audit (org_id, occurred_at DESC);

-- ============ RLS: Service Role Only ============
-- All tables are accessible only via service role key (backend).
-- No direct client-side access.

ALTER TABLE grok_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE grok_consent_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE grok_inference_log ENABLE ROW LEVEL SECURITY;

-- Explicit service_role policies (consistent with other migrations).
-- Anon/authenticated roles have no policies and therefore no access.

CREATE POLICY grok_consent_service_role_all
  ON grok_consent
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY grok_consent_audit_service_role_all
  ON grok_consent_audit
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY grok_inference_log_service_role_all
  ON grok_inference_log
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
-- Dashboard queries go through the backend API (/api/grok-consent/:orgId/audit).

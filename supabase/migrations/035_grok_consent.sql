-- Migration 035: Grok Consent & Article 12 Audit Tables
--
-- Regulatory basis:
--   GDPR Art. 6(1)(a) — explicit consent for third-country data transfer (xAI/US)
--   EU AI Act Article 12 — automatic logging for high-risk AI systems
--   NIS2 Art. 21 — incident traceability
--
-- KYA Integration (§18 DWS_SECURITY_STANDARD):
--   Inference log includes KYA trust score and permission level at call time.
--   Consent mutations require KYA score >= 50 (restricted or higher).
--
-- Harness Engineering (L6 — DWS Information Layering Strategy):
--   Audit responses include sovereignty provenance metadata for court-defensible export.
--
-- Data sovereignty:
--   All records stored in Supabase eu-north1 (Helsinki, Finland).
--   No prompt/response content stored — only token counts + model ID.
--
-- Tables:
--   grok_consent        — per-org consent record (current state)
--   grok_consent_audit  — immutable log of consent grant/revoke events
--   grok_inference_log  — Article 12 per-call audit trail (with KYA governance)

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
-- Append-only log — immutability enforced by triggers in migration 036

CREATE TABLE IF NOT EXISTS grok_consent_audit (
  id           BIGSERIAL PRIMARY KEY,
  org_id       TEXT NOT NULL,
  action       TEXT NOT NULL CHECK (action IN ('granted', 'revoked')),
  user_id      TEXT NOT NULL,
  note         TEXT,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE grok_consent_audit IS
  'Append-only consent event log. UPDATE/DELETE rejected by trigger. '
  'Supports GDPR accountability and regulator audit requests.';

-- ============ grok_inference_log ============
-- Article 12 trace — no prompt/response content, only metadata

CREATE TABLE IF NOT EXISTS grok_inference_log (
  id                    BIGSERIAL PRIMARY KEY,
  org_id                TEXT NOT NULL,
  model                 TEXT NOT NULL,
  input_tokens          INTEGER NOT NULL DEFAULT 0,
  output_tokens         INTEGER NOT NULL DEFAULT 0,
  duration_ms           INTEGER NOT NULL DEFAULT 0,
  status                TEXT NOT NULL CHECK (status IN ('ok', 'error')),
  error_message         TEXT,
  -- KYA governance columns (§18 DWS_SECURITY_STANDARD)
  kya_score             INTEGER,   -- 0–100 trust score at inference time
  kya_permission_level  TEXT,      -- full | restricted | suspended | frozen
  logged_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE grok_inference_log IS
  'Append-only EU AI Act Article 12 log. UPDATE/DELETE rejected by trigger. '
  'Records metadata only — no prompt or response content. Retention: 7 years.';
  'EU AI Act Article 12 automatic log with KYA governance metadata. '
  'Records metadata only — no prompt or response content is stored. '
  'KYA trust score and permission level captured per call. Retention: 7 years.';

-- Indexes for dashboard queries and regulator export
CREATE INDEX IF NOT EXISTS idx_grok_inference_log_org_id
  ON grok_inference_log (org_id, logged_at DESC);

CREATE INDEX IF NOT EXISTS idx_grok_consent_audit_org_id
  ON grok_consent_audit (org_id, occurred_at DESC);

-- ============ IMMUTABILITY TRIGGERS ============
-- Enforce append-only semantics at the trigger level.
-- Triggers fire BEFORE the operation and raise an exception, blocking
-- the write regardless of the caller's role (including service role).

CREATE OR REPLACE FUNCTION fn_reject_audit_mutation()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION
    'Table % is append-only (GDPR / EU AI Act Article 12). '
    'UPDATE and DELETE are not permitted.',
    TG_TABLE_NAME;
END;
$$;

CREATE TRIGGER trg_grok_consent_audit_immutable
  BEFORE UPDATE OR DELETE ON grok_consent_audit
  FOR EACH ROW EXECUTE FUNCTION fn_reject_audit_mutation();

CREATE TRIGGER trg_grok_inference_log_immutable
  BEFORE UPDATE OR DELETE ON grok_inference_log
  FOR EACH ROW EXECUTE FUNCTION fn_reject_audit_mutation();

-- ============ RLS: Block Direct Client Access ============
-- Service role bypasses RLS (Supabase default), so RLS alone cannot
-- enforce immutability — that is handled by the triggers above.
-- RLS here prevents anonymous/authenticated JWT access to raw tables;
-- all queries go through the backend API (/api/grok-consent/:orgId/audit).

ALTER TABLE grok_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE grok_consent_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE grok_inference_log ENABLE ROW LEVEL SECURITY;

-- grok_consent: full CRUD for service_role (current consent state is mutable)
CREATE POLICY "Service role full access to grok_consent"
  ON grok_consent FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- grok_consent_audit: append-only — INSERT and SELECT only (no UPDATE/DELETE)
CREATE POLICY "Service role can insert grok_consent_audit"
  ON grok_consent_audit FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can select grok_consent_audit"
  ON grok_consent_audit FOR SELECT
  TO service_role
  USING (true);

-- grok_inference_log: append-only — INSERT and SELECT only (no UPDATE/DELETE)
CREATE POLICY "Service role can insert grok_inference_log"
  ON grok_inference_log FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can select grok_inference_log"
  ON grok_inference_log FOR SELECT
  TO service_role
  USING (true);

-- ============ Immutability Triggers ============
-- Triggers fire even when RLS is bypassed by service_role, providing a
-- second layer of defence for GDPR accountability and EU AI Act audit trails.

CREATE OR REPLACE FUNCTION prevent_audit_mutation()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION
    'Audit log records are immutable: % is not permitted on %',
    TG_OP, TG_TABLE_NAME;
  RETURN NULL;
END;
$$;

CREATE TRIGGER grok_consent_audit_immutable
  BEFORE UPDATE OR DELETE ON grok_consent_audit
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();

CREATE TRIGGER grok_inference_log_immutable
  BEFORE UPDATE OR DELETE ON grok_inference_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();

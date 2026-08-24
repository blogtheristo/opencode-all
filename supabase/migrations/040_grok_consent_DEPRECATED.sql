-- Migration 040: Grok Consent Data Sovereignty
-- Creates tables for tracking user consent for Grok/xAI inference,
-- with append-only audit trail tables enforcing GDPR and EU AI Act compliance.
--
-- Tables:
--   grok_consent        – mutable current-consent state per user/org
--   grok_consent_audit  – immutable append-only audit trail of consent changes
--   grok_inference_log  – immutable append-only log of every Grok inference call

BEGIN;

-- ============================================================
-- PART 1: TABLE DEFINITIONS
-- ============================================================

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
  -- ON DELETE SET NULL: audit records are retained even if the parent consent record
  -- is deleted (e.g. via GDPR right-to-erasure). The audit trail must remain intact
  -- for regulatory purposes; a separate data-deletion workflow handles PII scrubbing.
  consent_id     uuid        REFERENCES grok_consent(id) ON DELETE SET NULL,
  -- user_id has no FK so audit rows survive user deletion; PII scrubbing is
  -- handled by the GDPR erasure workflow, not cascading deletes.
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
  -- user_id has no FK so inference records survive user deletion; PII scrubbing is
  -- handled by the GDPR erasure workflow, not cascading deletes.
  user_id        uuid        NOT NULL,
  org_id         uuid,
  -- ON DELETE SET NULL: inference log entries are retained for regulatory audit
  -- even after the originating consent record is removed.
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

-- ============================================================
-- PART 2: INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_grok_consent_user_id
  ON grok_consent (user_id);

CREATE INDEX IF NOT EXISTS idx_grok_consent_audit_consent_id
  ON grok_consent_audit (consent_id);

CREATE INDEX IF NOT EXISTS idx_grok_consent_audit_user_id
  ON grok_consent_audit (user_id);

CREATE INDEX IF NOT EXISTS idx_grok_inference_log_user_id
  ON grok_inference_log (user_id);

CREATE INDEX IF NOT EXISTS idx_grok_inference_log_created_at
  ON grok_inference_log (created_at);

-- ============================================================
-- PART 3: ENABLE ROW-LEVEL SECURITY
-- ============================================================

ALTER TABLE grok_consent        ENABLE ROW LEVEL SECURITY;
ALTER TABLE grok_consent_audit  ENABLE ROW LEVEL SECURITY;
ALTER TABLE grok_inference_log  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PART 4: RLS POLICIES
-- ============================================================

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

-- ============================================================
-- PART 5: Immutability Triggers
-- ============================================================

CREATE OR REPLACE FUNCTION prevent_audit_mutation()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION
    'Audit log records are immutable: % is not permitted on %',
    TG_OP, TG_TABLE_NAME;
END;
$$;

CREATE TRIGGER grok_consent_audit_immutable
  BEFORE UPDATE OR DELETE ON grok_consent_audit
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();

CREATE TRIGGER grok_inference_log_immutable
  BEFORE UPDATE OR DELETE ON grok_inference_log
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_mutation();

COMMIT;

-- Migration 036: Enforce immutability on Grok audit/inference log tables
--
-- grok_consent_audit and grok_inference_log are WORM (write-once, read-many)
-- ledgers that must never be altered or deleted to satisfy:
--   GDPR Art. 5(1)(e) — storage limitation + integrity/confidentiality
--   EU AI Act Article 12 — tamper-evident automatic logging
--   NIS2 Art. 21 — incident traceability
--
-- RLS alone is not sufficient: the service_role bypasses RLS, so accidental
-- or malicious UPDATE/DELETE by backend code would not be caught.
-- Triggers fire before RLS, making immutability truly unconditional.

-- ============ grok_consent_audit — immutability triggers ============

CREATE OR REPLACE FUNCTION fn_grok_consent_audit_immutable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION
    'grok_consent_audit is an immutable audit log — UPDATE and DELETE are not permitted (EU AI Act Art. 12 / GDPR Art. 5)';
END;
$$;

CREATE TRIGGER trg_grok_consent_audit_no_update
  BEFORE UPDATE ON grok_consent_audit
  FOR EACH ROW EXECUTE FUNCTION fn_grok_consent_audit_immutable();

CREATE TRIGGER trg_grok_consent_audit_no_delete
  BEFORE DELETE ON grok_consent_audit
  FOR EACH ROW EXECUTE FUNCTION fn_grok_consent_audit_immutable();

-- ============ grok_inference_log — immutability triggers ============

CREATE OR REPLACE FUNCTION fn_grok_inference_log_immutable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION
    'grok_inference_log is an immutable audit log — UPDATE and DELETE are not permitted (EU AI Act Art. 12 / GDPR Art. 5)';
END;
$$;

CREATE TRIGGER trg_grok_inference_log_no_update
  BEFORE UPDATE ON grok_inference_log
  FOR EACH ROW EXECUTE FUNCTION fn_grok_inference_log_immutable();

CREATE TRIGGER trg_grok_inference_log_no_delete
  BEFORE DELETE ON grok_inference_log
  FOR EACH ROW EXECUTE FUNCTION fn_grok_inference_log_immutable();

-- Update table comment to reflect actual enforcement
COMMENT ON TABLE grok_consent_audit IS
  'Immutable consent event log (enforced by DB triggers — UPDATE/DELETE raise exception). '
  'Supports GDPR accountability and regulator audit requests.';

COMMENT ON TABLE grok_inference_log IS
  'EU AI Act Article 12 automatic log (enforced by DB triggers — UPDATE/DELETE raise exception). '
  'Records metadata only — no prompt or response content is stored. Retention: 7 years.';

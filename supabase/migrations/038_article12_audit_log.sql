-- Migration 038: Article 12 AI Act Audit Log
--
-- Implements append-only audit trail required by EU AI Act Article 12
-- (Transparency and provision of information to users — automatic logging
-- of all AI system events with traceability and retention).
--
-- COMPLIANCE NOTES:
--   - Table is INSERT-only via RLS (UPDATE and DELETE are denied to all roles)
--   - Hosted in Supabase europe-north1 (Finland) — EU data residency for logs ✓
--   - Inference layer (Anthropic API) runs on US infrastructure — recorded honestly
--   - PII scrubbing runs on Veriton (Helsinki) before any cloud egress — recorded here
--   - Draft EU AI Act requires 10-year retention for High-Risk AI systems
--
-- Retention: Do NOT set up automatic deletion. If a cron job already touches this
-- table, remove the article12_audit_log from its target list. Keep forever or per
-- explicit legal instruction.

-- ─── Table ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS article12_audit_log (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Which agent produced this entry
  agent_id                TEXT        NOT NULL,

  -- Unique trace token linking pre-flight and post-flight log entries
  trace_id                UUID        NOT NULL DEFAULT gen_random_uuid(),

  -- SHA-256 of the sanitized (post-scrub) input sent to the model
  -- Never store the raw input text here
  input_hash              TEXT        NOT NULL,

  -- Model used for inference
  model                   TEXT        NOT NULL,

  -- Adaptive thinking effort level (low | medium | high | max | none)
  thinking_effort         TEXT        CHECK (thinking_effort IN ('low','medium','high','max','none')),

  -- Token counts from the API response
  input_token_count       INTEGER,
  output_token_count      INTEGER,

  -- EU regulation IDs this agent run was evaluating
  regulation_ids          TEXT[],

  -- First 500 chars of the output (non-PII summary for audit review)
  decision_summary        TEXT        CHECK (char_length(decision_summary) <= 500),

  -- SHA-256 of the raw thinking block text (proves lineage without exposing reasoning)
  thinking_block_hash     TEXT,

  -- PII handling audit fields
  pii_scrubbed            BOOLEAN     NOT NULL DEFAULT TRUE,
  pii_types_found         TEXT[],                          -- e.g. {'email','hetu','iban'}
  pii_replacement_count   INTEGER     NOT NULL DEFAULT 0,
  -- SHA-256 of the full scrub manifest JSON (for spot-check audits)
  scrub_manifest_hash     TEXT,

  -- Honest data residency declaration
  -- inference_in_eu: FALSE = Anthropic US infrastructure (current state)
  -- pii_scrub_location: where scrubbing ran (must be EU for compliance claim)
  inference_in_eu         BOOLEAN     NOT NULL DEFAULT FALSE,
  pii_scrub_location      TEXT        NOT NULL DEFAULT 'veriton-helsinki-fi',
  inference_location      TEXT        NOT NULL DEFAULT 'anthropic-us',

  -- Scrubber version for auditor traceability
  scrubber_version        TEXT        NOT NULL DEFAULT '1.0.0',

  -- EU AI Act risk classification of the agent
  risk_classification     TEXT        CHECK (risk_classification IN ('high','limited','minimal')) DEFAULT 'high',

  -- Immutable timestamp (set by DB, not application)
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS article12_audit_log_agent_id_idx  ON article12_audit_log (agent_id);
CREATE INDEX IF NOT EXISTS article12_audit_log_trace_id_idx  ON article12_audit_log (trace_id);
CREATE INDEX IF NOT EXISTS article12_audit_log_created_at_idx ON article12_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS article12_audit_log_model_idx     ON article12_audit_log (model);

-- ─── Comments (audit-readable metadata) ──────────────────────────────────────

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

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE article12_audit_log ENABLE ROW LEVEL SECURITY;

-- Service role (backend agents): INSERT only
CREATE POLICY "article12_insert_service" ON article12_audit_log
  FOR INSERT
  TO service_role
  WITH CHECK (TRUE);

-- Authenticated users (admin dashboard): SELECT only
CREATE POLICY "article12_select_authenticated" ON article12_audit_log
  FOR SELECT
  TO authenticated
  USING (TRUE);

-- UPDATE: denied to all (tamper-evident — no policy = denied)
-- DELETE: denied to all (append-only — no policy = denied)

-- ─── Revoke dangerous grants ──────────────────────────────────────────────────

REVOKE UPDATE ON article12_audit_log FROM PUBLIC, authenticated, service_role;
REVOKE DELETE ON article12_audit_log FROM PUBLIC, authenticated, service_role;
REVOKE TRUNCATE ON article12_audit_log FROM PUBLIC, authenticated, service_role;

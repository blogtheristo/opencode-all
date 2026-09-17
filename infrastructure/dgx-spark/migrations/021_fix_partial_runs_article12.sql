-- Hand-split port of supabase/migrations/041_fix_partial_runs.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- 041 is a grab-bag "fix partial runs" migration covering eight unrelated
-- sections. Only Section 6 (article12_audit_log) is ported here, per explicit
-- instruction. Everything else was excluded, and the exclusions are not all
-- simple "not on this list" skips — several are deliberate conflict
-- resolutions:
--
--   Section 1 (ALTER firehorse_leads/firehorse_events + indexes) — EXCLUDED.
--     Those tables are not moving to dws-postgres.
--
--   Section 2 (CREATE TABLE IF NOT EXISTS agent_metrics/agent_signals/
--     agent_costs/agent_approvals) — EXCLUDED, and NOT merely "already
--     covered by 001_agent_tracking.sql". This section defines those four
--     tables with a DIFFERENT, INCOMPATIBLE schema than
--     supabase/migrations/013_agent_tracking.sql (e.g. agent_metrics here
--     uses columns agent_name/date instead of 013's agent_id/metric_date).
--     Real application code (src/morning-briefing/data-collectors.ts, which
--     queries `agent_metrics?select=agent_id,leads_processed,emails_sent,
--     meetings_booked&metric_date=gte...`) depends on 013's column names, not
--     this section's. Because 013 already created these tables first in the
--     real Supabase project, this section's `CREATE TABLE IF NOT EXISTS`
--     silently no-ops there — it never actually took effect. Per CLAUDE.md's
--     "surface conflicts, don't average them" rule: 013's schema is the one
--     real code depends on and the one already ported as 001_agent_tracking.sql;
--     this section's competing definition is dead code and is not ported.
--
--   Section 3 (v_high_priority_leads / v_pending_approvals /
--     v_agent_performance_leaderboard views, update_agent_metrics()/
--     emit_agent_signal() trigger functions, triggers on firehorse_leads) —
--     EXCLUDED. These join/trigger against firehorse_leads (not moving) and
--     also assume Section 2's competing agent_metrics/agent_signals schema.
--
--   Section 4 (CREATE TABLE IF NOT EXISTS climate_assistant_usage with a
--     per-user schema: user_id/org_id/requests_count/tokens_used/cost_cents,
--     plus a get_or_create_usage_for_date(uuid,uuid)/increment_climate_usage
--     (uuid,uuid,int,int,int) overload pair) — EXCLUDED for the same reason
--     as Section 2: this is a different, incompatible table design than
--     supabase/migrations/014_climate_assistant_usage.sql (global one-row-
--     per-date, see 020_climate_assistant_usage.sql), which is the schema
--     real code (src/services/climate-assistant.service.ts) actually calls
--     against. 014 ran first in the real project, so this section's
--     `CREATE TABLE IF NOT EXISTS` never took effect either.
--
--   Section 5 (email_queue) — EXCLUDED per instruction: customer/business
--     data staying on Supabase.
--
--   Section 6 (article12_audit_log) — PORTED below, per instruction.
--
--   Section 7 (grok_consent / grok_consent_audit / grok_inference_log) —
--     EXCLUDED per instruction: customer/business data staying on Supabase.
--
--   Section 8 (emission_factors UNIQUE constraint, firehorse_signals RLS
--     policy) — EXCLUDED. Both tables (emission_factors, firehorse_signals)
--     are outside the internal-ops set moving to dws-postgres.

BEGIN;

-- ─── article12_audit_log (EU AI Act Article 12 — inference audit trail) ─────
-- This is the inference-shaped sibling of 019_command_audit_log.sql (071):
-- that one logs command/skill invocations with a tamper-evident hash chain,
-- this one logs individual model inferences (model, thinking_effort, token
-- counts, PII-scrub provenance). Unlike command_audit_log, this table keeps
-- one row per inference: INSERT pre-flight, then a single post-flight UPDATE
-- completes that same row with the output lineage fields. No hash chain here;
-- evidence comes from preserving the partial pre-flight row even if the
-- completion update fails, while delete/truncate remain revoked from PUBLIC.

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
  'EU AI Act Article 12 audit log. Single-row two-phase record: insert pre-flight, complete once post-flight. Not hash-chained. Do not delete rows. Retention: 10 years (draft regulation).';
COMMENT ON COLUMN article12_audit_log.inference_in_eu IS
  'Honest declaration. FALSE = Anthropic US inference. TRUE only if a GA EU endpoint is used.';
COMMENT ON COLUMN article12_audit_log.pii_scrub_location IS
  'Where PII scrubbing ran. Must be EU jurisdiction for GDPR compliance claim.';
COMMENT ON COLUMN article12_audit_log.thinking_block_hash IS
  'SHA-256 of the adaptive thinking block. Proves reasoning lineage without exposing raw reasoning.';
COMMENT ON COLUMN article12_audit_log.decision_summary IS
  'First 500 chars of agent output for human review. Must not contain PII (scrubbed before insert).';

-- GRANTS — single-consumer access aligned with the logger's two-phase write
-- path. dws_backend inserts the pre-flight row and performs the one completion
-- UPDATE; PUBLIC still cannot mutate or truncate the table.
GRANT SELECT, INSERT, UPDATE ON article12_audit_log TO dws_backend;

REVOKE UPDATE   ON article12_audit_log FROM PUBLIC;
REVOKE DELETE   ON article12_audit_log FROM PUBLIC;
REVOKE TRUNCATE ON article12_audit_log FROM PUBLIC;

COMMIT;

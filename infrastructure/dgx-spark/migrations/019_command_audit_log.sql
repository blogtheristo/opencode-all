-- Ported from supabase/migrations/071_command_audit_log.sql
-- DGX Spark self-hosted Postgres (dws-postgres) — dws-backend/dws-cron agent runtime
--
-- EU AI Act Article 12 hash-chained, append-only audit trail. Preserved
-- exactly per instructions: append-only + tamper-evident hash chain
-- constraints are NOT simplified. Only the RLS layer is adapted (Supabase
-- roles -> single dws_backend consumer); the REVOKE UPDATE/DELETE/TRUNCATE
-- grants (which are NOT RLS/policy statements — they are plain GRANT-system
-- privilege revocations) are kept as-is, since they are the actual mechanism
-- enforcing append-only-ness at the SQL privilege level, independent of RLS.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── Table ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS command_audit_log (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- §3 event core
  event_id                UUID        NOT NULL DEFAULT gen_random_uuid(),
  event_type              TEXT        NOT NULL
                                      CHECK (event_type IN ('command.invoke','command.result')),
  -- Which bridge routed the command
  bridge                  TEXT        NOT NULL CHECK (bridge IN ('openclaw','nemoclaw')),

  -- Links the invoke event to its result event
  trace_id                UUID        NOT NULL,
  span_id                 TEXT,

  -- §3 identity (KYA-S §1)
  agent_id                TEXT        NOT NULL,   -- caller agent making the request
  operator_id             TEXT,                  -- KYC-verified human behind the session
  org_id                  TEXT,                  -- tenant isolation
  kya_session_id          TEXT,

  -- The command/skill being run
  skill                   TEXT        NOT NULL,
  caller_ats              INTEGER,               -- agent trust score at invocation (0-100)
  minimum_ats             INTEGER,               -- skill's required minimum ATS

  -- §3 risk-relevant context (digests only — raw payloads never stored)
  input_digest            TEXT,                  -- SHA-256 of scrubbed params (invoke only)
  output_digest           TEXT,                  -- SHA-256 of result (result only)

  -- Gate decision (invoke event)
  decision                TEXT        CHECK (decision IN ('allowed','denied')),
  denied_reason           TEXT,

  -- Execution outcome (result event)
  success                 BOOLEAN,
  error_text              TEXT,
  duration_ms             INTEGER,

  -- PII handling audit (KYA-S redaction is logged, never the values)
  pii_types_found         TEXT[],
  pii_replacement_count   INTEGER     NOT NULL DEFAULT 0,

  -- Provenance
  model_version           TEXT,                  -- e.g. nemotron model id (NemoClaw)
  risk_classification     TEXT        CHECK (risk_classification IN ('high','limited','minimal'))
                                      DEFAULT 'high',

  -- §3 tamper evidence (set by trigger, never by the application)
  prev_hash               TEXT        NOT NULL,
  event_hash              TEXT        NOT NULL,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Per-event-type required fields (Art. 12 "sufficient to detect risk situations")
  CONSTRAINT command_audit_invoke_fields CHECK (
    event_type <> 'command.invoke'
    OR (input_digest IS NOT NULL AND decision IS NOT NULL)
  ),
  CONSTRAINT command_audit_result_fields CHECK (
    event_type <> 'command.result'
    OR (success IS NOT NULL)
  )
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS command_audit_log_trace_id_idx   ON command_audit_log (trace_id);
CREATE INDEX IF NOT EXISTS command_audit_log_agent_id_idx   ON command_audit_log (agent_id);
CREATE INDEX IF NOT EXISTS command_audit_log_skill_idx      ON command_audit_log (skill);
CREATE INDEX IF NOT EXISTS command_audit_log_bridge_idx     ON command_audit_log (bridge);
CREATE INDEX IF NOT EXISTS command_audit_log_created_at_idx ON command_audit_log (created_at DESC);

-- ─── Hash chain (tamper evidence, §3) ────────────────────────────────────────
-- BEFORE INSERT trigger links each row to the previous event's hash. The advisory
-- lock serialises chain writes so prev_hash never forks under concurrency.

CREATE OR REPLACE FUNCTION command_audit_log_chain()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  -- Fixed search_path hardens this SECURITY DEFINER function against
  -- search-path hijacking. pg_catalog first (pins built-ins: digest/encode/
  -- pg_advisory_xact_lock), then public (the table), then extensions (pgcrypto
  -- if installed there).
  SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  last_hash TEXT;
  canonical TEXT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('command_audit_log_chain'));

  SELECT event_hash INTO last_hash
  FROM public.command_audit_log
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  NEW.prev_hash := COALESCE(last_hash, repeat('0', 64));

  -- Canonical, deterministic serialisation of the immutable event fields
  canonical := concat_ws('|',
    NEW.event_id::text,
    NEW.event_type,
    NEW.bridge,
    NEW.trace_id::text,
    NEW.agent_id,
    COALESCE(NEW.operator_id, ''),
    COALESCE(NEW.org_id, ''),
    NEW.skill,
    COALESCE(NEW.input_digest, ''),
    COALESCE(NEW.output_digest, ''),
    COALESCE(NEW.decision, ''),
    COALESCE(NEW.success::text, ''),
    to_char(NEW.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')
  );

  NEW.event_hash := encode(digest(NEW.prev_hash || canonical, 'sha256'), 'hex');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS command_audit_log_chain_trg ON command_audit_log;
CREATE TRIGGER command_audit_log_chain_trg
  BEFORE INSERT ON command_audit_log
  FOR EACH ROW EXECUTE FUNCTION command_audit_log_chain();

-- ─── Comments ────────────────────────────────────────────────────────────────

COMMENT ON TABLE command_audit_log IS
  'EU AI Act Article 12 command-execution audit trail (OpenClaw/NemoClaw bridges). Append-only, hash-chained. Do not delete rows. Min retention 6 months (Art. 26(6)).';
COMMENT ON COLUMN command_audit_log.input_digest IS
  'SHA-256 of scrubbed command params. Raw params are never stored.';
COMMENT ON COLUMN command_audit_log.event_hash IS
  'SHA-256(prev_hash || canonical_event) — tamper-evident chain link.';

-- ─── Grants (append-only enforcement + single-consumer access) ──────────────
-- GRANT ALL is NOT used here (unlike other ported tables) because "ALL"
-- includes UPDATE/DELETE/TRUNCATE, which would undo the append-only guarantee
-- this table exists to provide. dws_backend gets only INSERT + SELECT; the
-- REVOKEs below are a second, belt-and-suspenders layer against any future
-- GRANT ALL run against this table.
GRANT SELECT, INSERT ON command_audit_log TO dws_backend;

-- UPDATE / DELETE: no policy = denied (append-only, tamper-evident)
REVOKE UPDATE   ON command_audit_log FROM PUBLIC;
REVOKE DELETE   ON command_audit_log FROM PUBLIC;
REVOKE TRUNCATE ON command_audit_log FROM PUBLIC;

-- Migration 074: KYA Mandate Evidence Chain (Agentic Commerce, KYA Standard §14.5)
--
-- Backs the AP2/UCP/ACP mandate gating shipped in evaluateMandateGate()
-- (src/identity/ats-engine.ts) with the "one evidence chain" required by
-- KYA_STANDARD_v1.md §14.5: every mandate event (issue, present, execute,
-- revoke) is logged, keyed by session_id + mandate VC id, feeding both the
-- Firehorse audit trail and DWS_ARTICLE_12_LOGGING_STANDARD.md record-keeping.
-- Also backs the §14.2.1 tenant gating profile (tighten-only, two immovable
-- floors), whose Zod validator (tenantGatingProfileSchema,
-- src/identity/ats-engine.ts) is the normative shape — this migration's
-- columns mirror the TenantGatingProfile TS interface, not the illustrative
-- JSON in §14.2.1 (schema stability note: JSON is illustrative until v2.0).
--
-- Modeled on 071_command_audit_log.sql: append-only, hash-chained
-- (prev_hash -> event_hash via BEFORE INSERT trigger under an advisory
-- lock), so the mandate evidence chain cannot fork under concurrent inserts.
--
-- COMPLIANCE NOTES:
--   - kya_mandate_events is append-only via RLS (UPDATE/DELETE/TRUNCATE denied).
--   - kya_tenant_gating_profiles is versioned, not mutated in place: a policy
--     change inserts a new row and sets superseded_at on the row it replaces
--     (KYA §14.2.1: "applied only to sessions started after the change — no
--     retroactive loosening of a live session's gates").
--   - hnp_min_ats carries a DB-level CHECK at the HNP_FLOOR_ATS constant
--     (0.90) as defense-in-depth alongside the app-level tighten-only
--     validator — floors are never trusted from input at either layer.
--   - Hosted in Supabase europe-north1 (Finland) — EU data residency for logs.
--
-- Retention: Do NOT set up automatic deletion. Evidence-chain retention
-- follows DWS_ARTICLE_12_LOGGING_STANDARD.md (minimum 6 months, Art. 26(6);
-- serious-incident-linked rows 10 years, Art. 73). Keep per legal instruction.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- ─── kya_tenant_gating_profiles (§14.2.1) ──────────────────────────────────
-- One row per tenant policy version. Never updated in place — a profile
-- change inserts a new row and sets superseded_at/superseded_by on the row
-- it replaces, so the full policy history stays auditable.

CREATE TABLE IF NOT EXISTS kya_tenant_gating_profiles (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  tenant_id         TEXT        NOT NULL,
  profile_version   TEXT        NOT NULL,
  industry_default  TEXT,

  -- Immovable floor 2 (§14.2.1): HNP minimum band may be raised, never lowered
  -- past HNP_FLOOR_ATS (0.90) — CHECK mirrors the Zod floor in ats-engine.ts.
  hnp_min_ats       NUMERIC(3,2) NOT NULL CHECK (hnp_min_ats >= 0.90 AND hnp_min_ats <= 1.0),
  confirm_above     NUMERIC     CHECK (confirm_above > 0),
  hnp_enabled       BOOLEAN     NOT NULL DEFAULT TRUE,

  -- Profile changes are policy events, signed by the tenant's HIC (§14.2.1)
  signed_by_hic     TEXT        NOT NULL,

  effective_from    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  superseded_at     TIMESTAMPTZ,
  superseded_by     UUID        REFERENCES kya_tenant_gating_profiles(id),

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS kya_tenant_gating_profiles_tenant_idx
  ON kya_tenant_gating_profiles (tenant_id);
CREATE INDEX IF NOT EXISTS kya_tenant_gating_profiles_created_at_idx
  ON kya_tenant_gating_profiles (created_at DESC);

-- At most one active (non-superseded) profile per tenant at any time
CREATE UNIQUE INDEX IF NOT EXISTS kya_tenant_gating_profiles_active_idx
  ON kya_tenant_gating_profiles (tenant_id) WHERE superseded_at IS NULL;

COMMENT ON TABLE kya_tenant_gating_profiles IS
  'KYA §14.2.1 per-tenant mandate gating policy, versioned. Tighten-only vs. the platform baseline; two immovable floors (ATS<0.50 always NO_GO, HNP minimum never below 0.90). Superseded rows are kept for audit history, never deleted.';
COMMENT ON COLUMN kya_tenant_gating_profiles.hnp_min_ats IS
  'Minimum ATS for Human Not Present execution. Platform floor 0.90 (HNP_FLOOR_ATS in ats-engine.ts) — CHECK enforces this even if the app-level validator is bypassed.';
COMMENT ON COLUMN kya_tenant_gating_profiles.superseded_at IS
  'Set when a later profile change replaces this row. NULL = currently active. Never updated retroactively into a live session (§14.2.1).';

-- ─── kya_mandate_events (§14.5 evidence chain) ─────────────────────────────
-- One row per mandate lifecycle event (issue/present/execute/revoke),
-- keyed by session_id + mandate_vc_id. Append-only, hash-chained.

CREATE TABLE IF NOT EXISTS kya_mandate_events (
  id                           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  event_type                   TEXT        NOT NULL
                                            CHECK (event_type IN ('mandate.issue','mandate.present','mandate.execute','mandate.revoke')),

  -- §14.5 evidence-chain key
  session_id                   TEXT        NOT NULL,
  mandate_vc_id                TEXT        NOT NULL,  -- W3C Verifiable Credential id of the AP2/UCP/ACP mandate

  -- Identity (KYA §9.1 manifest / §14.3 spend_authority)
  subagent_id                  TEXT        NOT NULL,
  hic                          TEXT        NOT NULL,   -- verified human accountable for the spend authority
  org_id                       TEXT,                   -- tenant isolation

  -- Mandate request shape (MandateGateRequest, KYA §14.2)
  protocol                     TEXT        NOT NULL CHECK (protocol IN ('ap2','ucp','acp')),
  mandate_type                 TEXT        NOT NULL CHECK (mandate_type IN ('intent','cart','payment')),
  amount                       NUMERIC,
  currency                     TEXT,
  merchant_category            TEXT,
  human_present                BOOLEAN,

  -- Trust context at evaluation time
  kya_score_at_sign            NUMERIC,
  ats_permission_level         TEXT        CHECK (ats_permission_level IN ('full','restricted','suspended','frozen')),
  tenant_gating_profile_id     UUID        REFERENCES kya_tenant_gating_profiles(id),

  -- Gate decision (MandateGateDecision, KYA §14.2 / evaluateMandateGate())
  gate_decision                TEXT        NOT NULL CHECK (gate_decision IN ('allowed','denied')),
  requires_human_confirmation  BOOLEAN     NOT NULL DEFAULT FALSE,
  kya_violation                BOOLEAN     NOT NULL DEFAULT FALSE,
  decision_reason              TEXT,

  -- Cross-links completing the "one evidence chain" (§14.5)
  article12_trace_id           UUID,   -- ties to article12_audit_log.trace_id / command_audit_log.trace_id
  firehorse_event_id           TEXT,   -- ties to the Firehorse audit trail

  -- Tamper evidence (set by trigger, never by the application)
  prev_hash                    TEXT        NOT NULL,
  event_hash                   TEXT        NOT NULL,

  created_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS kya_mandate_events_session_mandate_idx
  ON kya_mandate_events (session_id, mandate_vc_id);
CREATE INDEX IF NOT EXISTS kya_mandate_events_subagent_id_idx
  ON kya_mandate_events (subagent_id);
CREATE INDEX IF NOT EXISTS kya_mandate_events_org_id_idx
  ON kya_mandate_events (org_id);
CREATE INDEX IF NOT EXISTS kya_mandate_events_event_type_idx
  ON kya_mandate_events (event_type);
CREATE INDEX IF NOT EXISTS kya_mandate_events_kya_violation_idx
  ON kya_mandate_events (kya_violation) WHERE kya_violation;
CREATE INDEX IF NOT EXISTS kya_mandate_events_created_at_idx
  ON kya_mandate_events (created_at DESC);

-- ─── Hash chain (tamper evidence, mirrors command_audit_log_chain) ─────────

CREATE OR REPLACE FUNCTION kya_mandate_events_chain()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  last_hash TEXT;
  canonical TEXT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('kya_mandate_events_chain'));

  SELECT event_hash INTO last_hash
  FROM public.kya_mandate_events
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  NEW.prev_hash := COALESCE(last_hash, repeat('0', 64));

  canonical := concat_ws('|',
    NEW.id::text,
    NEW.event_type,
    NEW.session_id,
    NEW.mandate_vc_id,
    NEW.subagent_id,
    NEW.hic,
    COALESCE(NEW.org_id, ''),
    NEW.protocol,
    NEW.mandate_type,
    COALESCE(NEW.amount::text, ''),
    COALESCE(NEW.currency, ''),
    NEW.gate_decision,
    NEW.kya_violation::text,
    to_char(NEW.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')
  );

  NEW.event_hash := encode(digest(NEW.prev_hash || canonical, 'sha256'), 'hex');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS kya_mandate_events_chain_trg ON kya_mandate_events;
CREATE TRIGGER kya_mandate_events_chain_trg
  BEFORE INSERT ON kya_mandate_events
  FOR EACH ROW EXECUTE FUNCTION kya_mandate_events_chain();

-- ─── Comments ────────────────────────────────────────────────────────────────

COMMENT ON TABLE kya_mandate_events IS
  'KYA §14.5 mandate evidence chain. Append-only, hash-chained. One row per AP2/UCP/ACP mandate lifecycle event (issue/present/execute/revoke), keyed by session_id + mandate_vc_id. Feeds the Firehorse audit trail and DWS_ARTICLE_12_LOGGING_STANDARD.md record-keeping. Do not delete rows.';
COMMENT ON COLUMN kya_mandate_events.mandate_vc_id IS
  'W3C Verifiable Credential id of the AP2/UCP/ACP mandate (§14.4). Together with session_id, this is the evidence-chain key (§14.5).';
COMMENT ON COLUMN kya_mandate_events.hic IS
  'Verified human accountable for the spend authority (spend_authority.hic, §14.3). No anonymous spend authority, ever.';
COMMENT ON COLUMN kya_mandate_events.kya_violation IS
  'TRUE when the mandate attempt was outside the ATS band or above a manifest ceiling (§14.2) — triggers the §9.2 enforcement sequence plus revocation of live session mandates.';
COMMENT ON COLUMN kya_mandate_events.event_hash IS
  'SHA-256(prev_hash || canonical_event) — tamper-evident chain link, mirrors command_audit_log.';

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE kya_tenant_gating_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kya_mandate_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "kya_gating_profiles_insert_service" ON kya_tenant_gating_profiles;
CREATE POLICY "kya_gating_profiles_insert_service" ON kya_tenant_gating_profiles
  FOR INSERT TO service_role WITH CHECK (TRUE);

-- Superseding a profile only ever touches superseded_at/superseded_by on the
-- prior row (never the policy fields) — allow service_role UPDATE, deny to
-- authenticated users and PUBLIC.
DROP POLICY IF EXISTS "kya_gating_profiles_update_service" ON kya_tenant_gating_profiles;
CREATE POLICY "kya_gating_profiles_update_service" ON kya_tenant_gating_profiles
  FOR UPDATE TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "kya_gating_profiles_select_authenticated" ON kya_tenant_gating_profiles;
CREATE POLICY "kya_gating_profiles_select_authenticated" ON kya_tenant_gating_profiles
  FOR SELECT TO authenticated USING (TRUE);

DROP POLICY IF EXISTS "kya_mandate_events_insert_service" ON kya_mandate_events;
CREATE POLICY "kya_mandate_events_insert_service" ON kya_mandate_events
  FOR INSERT TO service_role WITH CHECK (TRUE);

DROP POLICY IF EXISTS "kya_mandate_events_select_authenticated" ON kya_mandate_events;
CREATE POLICY "kya_mandate_events_select_authenticated" ON kya_mandate_events
  FOR SELECT TO authenticated USING (TRUE);

-- kya_mandate_events: UPDATE/DELETE denied to all (no policy = denied, append-only)

-- service_role keeps UPDATE (its policy legitimately sets superseded_at/superseded_by);
-- PUBLIC and authenticated get neither the RLS policy nor the grant.
REVOKE UPDATE   ON kya_tenant_gating_profiles FROM PUBLIC, authenticated;
REVOKE DELETE   ON kya_tenant_gating_profiles FROM PUBLIC, authenticated;
REVOKE TRUNCATE ON kya_tenant_gating_profiles FROM PUBLIC, authenticated, service_role;

REVOKE UPDATE   ON kya_mandate_events FROM PUBLIC, authenticated, service_role;
REVOKE DELETE   ON kya_mandate_events FROM PUBLIC, authenticated, service_role;
REVOKE TRUNCATE ON kya_mandate_events FROM PUBLIC, authenticated, service_role;

COMMIT;

-- Migration 079: KYA Verified-Done Attestation (Agentic Commerce, KYA Standard §14.7)
--
-- Lands the schema for the "verified-done attestation" toward the KYA v2.0
-- schema freeze. A Verified-Done Attestation is the terminal link of the
-- §14.4 trust chain (verified human -> signed manifest -> signed mandate ->
-- verified-done attestation): a portable W3C Verifiable Credential attesting
-- that a specific mandate executed under KYA governance and was logged to the
-- §14.5 evidence chain. It turns the internal evidence chain into a
-- counterparty-checkable "the agent did what it was authorized to do" credential.
--
-- The credential envelope is the normative TS shape in src/identity/types.ts
-- (VerifiedDoneAttestation / VerifiedDoneSubject); the issuer stub is
-- issueVerifiedDoneAttestation() in src/identity/ats-engine.ts (tests:
-- src/__tests__/verified-done-attestation.test.ts). Field names here mirror
-- that interface, not the illustrative §14.7 JSON (schema stability note:
-- illustrative until v2.0).
--
-- This migration does two things:
--   1. Extends kya_mandate_events.event_type (from 074) with 'mandate.attest',
--      so issuing an attestation is itself a logged, hash-chained event on the
--      one evidence chain (§14.5).
--   2. Adds kya_verified_done_attestations — the store of issued credentials,
--      re-presentable and revocable, keyed session_id + mandate_vc_id.
--
-- SIGNING IS DEFERRED. Credentials are stored proof_status='unsigned' until
-- the KYA v2.0 key-management decision (which DID method, where the issuer key
-- lives). proof_status transitions unsigned -> signed -> revoked are
-- service_role-only operations, mirroring the 074 gating-profile precedent.
--
-- COMPLIANCE NOTES:
--   - kya_verified_done_attestations rows are never deleted (DELETE/TRUNCATE
--     revoked). Revocation is a proof_status transition, not a row deletion.
--   - Retention follows DWS_ARTICLE_12_LOGGING_STANDARD.md, same as 074.
--   - Hosted in Supabase (EU) — EU data residency for evidence.
--
-- Depends on 074 (kya_mandate_events must exist). Self-contained otherwise.

BEGIN;

-- ─── 1. Extend the mandate lifecycle with 'mandate.attest' (§14.5 + §14.7) ──
-- 074 created the event_type CHECK inline; Postgres named it
-- kya_mandate_events_event_type_check. Replace it to admit the attest event.

ALTER TABLE kya_mandate_events
  DROP CONSTRAINT IF EXISTS kya_mandate_events_event_type_check;
ALTER TABLE kya_mandate_events
  ADD CONSTRAINT kya_mandate_events_event_type_check
  CHECK (event_type IN ('mandate.issue','mandate.present','mandate.execute','mandate.revoke','mandate.attest'));

-- ─── 2. kya_verified_done_attestations (§14.7 credential store) ─────────────
-- One row per issued Verified-Done credential, keyed session_id + mandate_vc_id
-- (the §14.5 evidence-chain key). Append-only for authenticated/PUBLIC;
-- service_role may transition proof_status (sign/revoke) in place.

CREATE TABLE IF NOT EXISTS kya_verified_done_attestations (
  id                     UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- §14.5 evidence-chain key
  session_id             TEXT        NOT NULL,
  mandate_vc_id          TEXT        NOT NULL,  -- W3C VC id of the attested mandate

  subagent_id            TEXT        NOT NULL,
  hic                    TEXT        NOT NULL,   -- verified human; never anonymous (§14.3)

  issuer                 TEXT        NOT NULL,   -- issuer DID / ref (key infra deferred to v2.0)
  protocol               TEXT        NOT NULL CHECK (protocol IN ('ap2','ucp','acp')),
  mandate_type           TEXT        NOT NULL CHECK (mandate_type IN ('intent','cart','payment')),
  amount                 NUMERIC,
  currency               TEXT,
  ats_at_execution       NUMERIC,

  -- kyaVerified is TRUE only when the gate allowed the mandate — a denied
  -- mandate cannot be attested done (enforced in issueVerifiedDoneAttestation).
  kya_verified           BOOLEAN     NOT NULL DEFAULT TRUE,

  -- The full VC envelope (VerifiedDoneAttestation) as issued
  credential             JSONB       NOT NULL,

  -- Signing state: unsigned until v2.0 wires real signatures
  proof_status           TEXT        NOT NULL DEFAULT 'unsigned'
                                       CHECK (proof_status IN ('unsigned','signed','revoked')),

  -- Cross-links completing the one evidence chain (§14.5)
  article12_trace_id     UUID,

  valid_from             TIMESTAMPTZ NOT NULL,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS kya_verified_done_attestations_session_mandate_idx
  ON kya_verified_done_attestations (session_id, mandate_vc_id);
CREATE INDEX IF NOT EXISTS kya_verified_done_attestations_proof_status_idx
  ON kya_verified_done_attestations (proof_status);
CREATE INDEX IF NOT EXISTS kya_verified_done_attestations_created_at_idx
  ON kya_verified_done_attestations (created_at DESC);

COMMENT ON TABLE kya_verified_done_attestations IS
  'KYA §14.7 Verified-Done Attestation store. One row per issued W3C Verifiable Credential attesting a mandate executed under KYA governance (terminal link of the §14.4 trust chain), keyed session_id + mandate_vc_id. Credentials are unsigned until KYA v2.0 wires real signing; revocation is a proof_status transition, never a row deletion. Feeds the §14.5 evidence chain (paired with a mandate.attest event) and DWS_ARTICLE_12_LOGGING_STANDARD.md record-keeping. Do not delete rows.';
COMMENT ON COLUMN kya_verified_done_attestations.kya_verified IS
  'TRUE only when the mandate gate allowed the mandate — a denied mandate is never attested done (KYA §14.7).';
COMMENT ON COLUMN kya_verified_done_attestations.proof_status IS
  'unsigned (default) until KYA v2.0 key management; signed once cryptographically proven; revoked to withdraw. Transitions are service_role-only.';

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE kya_verified_done_attestations ENABLE ROW LEVEL SECURITY;

-- Table-level grants (the Data API gate — RLS is the row gate, GRANT is the
-- table gate; without this PostgREST returns 42501 even when RLS would allow).
-- service_role inserts and transitions proof_status; authenticated only reads.
GRANT SELECT, INSERT, UPDATE ON kya_verified_done_attestations TO service_role;
GRANT SELECT                  ON kya_verified_done_attestations TO authenticated;

DROP POLICY IF EXISTS "kya_attestations_insert_service" ON kya_verified_done_attestations;
CREATE POLICY "kya_attestations_insert_service" ON kya_verified_done_attestations
  FOR INSERT TO service_role WITH CHECK (TRUE);

-- proof_status transitions (sign / revoke) are service_role-only, mirroring the
-- 074 gating-profile superseding precedent — denied to authenticated and PUBLIC.
DROP POLICY IF EXISTS "kya_attestations_update_service" ON kya_verified_done_attestations;
CREATE POLICY "kya_attestations_update_service" ON kya_verified_done_attestations
  FOR UPDATE TO service_role USING (TRUE) WITH CHECK (TRUE);

DROP POLICY IF EXISTS "kya_attestations_select_authenticated" ON kya_verified_done_attestations;
CREATE POLICY "kya_attestations_select_authenticated" ON kya_verified_done_attestations
  FOR SELECT TO authenticated USING (TRUE);

REVOKE UPDATE   ON kya_verified_done_attestations FROM PUBLIC, authenticated;
-- Revocation is a proof_status transition, never a row deletion — deny DELETE
-- to every role, service_role included.
REVOKE DELETE   ON kya_verified_done_attestations FROM PUBLIC, authenticated, service_role;
REVOKE TRUNCATE ON kya_verified_done_attestations FROM PUBLIC, authenticated, service_role;

COMMIT;

-- Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
-- Audit trail: git log -- supabase/migrations/098_270926_attestation_consistency.sql

-- CODE VERSIONING NOTE
-- Code-Version: 1.0.0
-- Introduced-In: PR-TBD
-- Branch: fix/1716-attestation-consistency
-- Commit: pending
-- Date: 2026-09-27
-- Owner: DWS Platform / GitHub Copilot CLI
-- Env-Schema: env-v1.0
-- Harness: GitHub Copilot CLI 1.0.88 + CLAUDE.md + AGENTS.md
-- Hic-Approved-Drift: none
--
-- Migration 098: make Verified-Done issuance atomic/idempotent and enforce
-- legal proof_status transitions. Depends on migrations 074 and 079.
--
-- This migration intentionally does not repair historical duplicates. It
-- fails loudly if any exist so an operator can preserve and reconcile the
-- Article 12 evidence before applying the uniqueness constraints.

BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.kya_verified_done_attestations
    GROUP BY session_id, mandate_vc_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Migration 098: duplicate verified-done attestations require evidence-preserving reconciliation';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.kya_mandate_events
    WHERE event_type = 'mandate.attest'
    GROUP BY session_id, mandate_vc_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Migration 098: duplicate mandate.attest events require evidence-preserving reconciliation';
  END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS kya_verified_done_attestations_session_mandate_uidx
  ON public.kya_verified_done_attestations (session_id, mandate_vc_id);

CREATE UNIQUE INDEX IF NOT EXISTS kya_mandate_events_attest_session_mandate_uidx
  ON public.kya_mandate_events (session_id, mandate_vc_id)
  WHERE event_type = 'mandate.attest';

CREATE OR REPLACE FUNCTION public.kya_guard_attestation_transition()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF ROW(
    NEW.id,
    NEW.session_id,
    NEW.mandate_vc_id,
    NEW.subagent_id,
    NEW.hic,
    NEW.issuer,
    NEW.protocol,
    NEW.mandate_type,
    NEW.amount,
    NEW.currency,
    NEW.ats_at_execution,
    NEW.kya_verified,
    NEW.article12_trace_id,
    NEW.valid_from,
    NEW.created_at
  ) IS DISTINCT FROM ROW(
    OLD.id,
    OLD.session_id,
    OLD.mandate_vc_id,
    OLD.subagent_id,
    OLD.hic,
    OLD.issuer,
    OLD.protocol,
    OLD.mandate_type,
    OLD.amount,
    OLD.currency,
    OLD.ats_at_execution,
    OLD.kya_verified,
    OLD.article12_trace_id,
    OLD.valid_from,
    OLD.created_at
  ) THEN
    RAISE EXCEPTION 'Verified-Done attestation identity and evidence fields are immutable';
  END IF;

  IF OLD.proof_status = 'unsigned' AND NEW.proof_status = 'signed' THEN
    IF (NEW.credential - 'proof') IS DISTINCT FROM (OLD.credential - 'proof')
       OR NOT (NEW.credential ? 'proof') THEN
      RAISE EXCEPTION 'Signing may only add a proof to the existing credential';
    END IF;
  ELSIF OLD.proof_status IN ('unsigned', 'signed') AND NEW.proof_status = 'revoked' THEN
    IF NEW.credential IS DISTINCT FROM OLD.credential THEN
      RAISE EXCEPTION 'Revocation may not rewrite the stored credential';
    END IF;
  ELSE
    RAISE EXCEPTION 'Illegal Verified-Done proof_status transition: % -> %',
      OLD.proof_status, NEW.proof_status;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS kya_verified_done_attestation_transition_trg
  ON public.kya_verified_done_attestations;
CREATE TRIGGER kya_verified_done_attestation_transition_trg
  BEFORE UPDATE ON public.kya_verified_done_attestations
  FOR EACH ROW
  EXECUTE FUNCTION public.kya_guard_attestation_transition();

CREATE OR REPLACE FUNCTION public.issue_verified_done_attestation(
  p_attestation JSONB,
  p_event JSONB
)
RETURNS TABLE (
  attestation_id UUID,
  event_id UUID,
  credential JSONB,
  proof_status TEXT
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_attestation public.kya_verified_done_attestations%ROWTYPE;
  v_event public.kya_mandate_events%ROWTYPE;
BEGIN
  IF p_attestation IS NULL OR jsonb_typeof(p_attestation) <> 'object' THEN
    RAISE EXCEPTION 'p_attestation must be a JSON object';
  END IF;
  IF p_event IS NULL OR jsonb_typeof(p_event) <> 'object' THEN
    RAISE EXCEPTION 'p_event must be a JSON object';
  END IF;
  IF p_event->>'event_type' IS DISTINCT FROM 'mandate.attest' THEN
    RAISE EXCEPTION 'Atomic attestation issuance requires event_type mandate.attest';
  END IF;
  IF p_event->>'gate_decision' IS DISTINCT FROM 'allowed' THEN
    RAISE EXCEPTION 'A denied mandate cannot receive a Verified-Done attestation';
  END IF;
  IF p_attestation->>'session_id' IS DISTINCT FROM p_event->>'session_id'
     OR p_attestation->>'mandate_vc_id' IS DISTINCT FROM p_event->>'mandate_vc_id' THEN
    RAISE EXCEPTION 'Attestation and event evidence-chain keys must match';
  END IF;

  INSERT INTO public.kya_verified_done_attestations (
    session_id,
    mandate_vc_id,
    subagent_id,
    hic,
    issuer,
    protocol,
    mandate_type,
    amount,
    currency,
    ats_at_execution,
    kya_verified,
    credential,
    proof_status,
    article12_trace_id,
    valid_from
  )
  VALUES (
    p_attestation->>'session_id',
    p_attestation->>'mandate_vc_id',
    p_attestation->>'subagent_id',
    p_attestation->>'hic',
    p_attestation->>'issuer',
    p_attestation->>'protocol',
    p_attestation->>'mandate_type',
    NULLIF(p_attestation->>'amount', '')::NUMERIC,
    p_attestation->>'currency',
    NULLIF(p_attestation->>'ats_at_execution', '')::NUMERIC,
    COALESCE((p_attestation->>'kya_verified')::BOOLEAN, TRUE),
    p_attestation->'credential',
    COALESCE(p_attestation->>'proof_status', 'unsigned'),
    NULLIF(p_attestation->>'article12_trace_id', '')::UUID,
    (p_attestation->>'valid_from')::TIMESTAMPTZ
  )
  ON CONFLICT (session_id, mandate_vc_id) DO NOTHING
  RETURNING * INTO v_attestation;

  IF v_attestation.id IS NULL THEN
    SELECT *
    INTO STRICT v_attestation
    FROM public.kya_verified_done_attestations
    WHERE session_id = p_attestation->>'session_id'
      AND mandate_vc_id = p_attestation->>'mandate_vc_id';
  END IF;

  IF v_attestation.subagent_id IS DISTINCT FROM p_attestation->>'subagent_id'
     OR v_attestation.hic IS DISTINCT FROM p_attestation->>'hic'
     OR v_attestation.issuer IS DISTINCT FROM p_attestation->>'issuer'
     OR v_attestation.protocol IS DISTINCT FROM p_attestation->>'protocol'
     OR v_attestation.mandate_type IS DISTINCT FROM p_attestation->>'mandate_type'
     OR v_attestation.amount IS DISTINCT FROM NULLIF(p_attestation->>'amount', '')::NUMERIC
     OR v_attestation.currency IS DISTINCT FROM p_attestation->>'currency'
     OR v_attestation.ats_at_execution IS DISTINCT FROM NULLIF(p_attestation->>'ats_at_execution', '')::NUMERIC
     OR v_attestation.kya_verified IS DISTINCT FROM COALESCE((p_attestation->>'kya_verified')::BOOLEAN, TRUE)
     OR v_attestation.article12_trace_id IS DISTINCT FROM NULLIF(p_attestation->>'article12_trace_id', '')::UUID
     OR v_attestation.valid_from IS DISTINCT FROM (p_attestation->>'valid_from')::TIMESTAMPTZ
     OR (v_attestation.credential - 'proof')
        IS DISTINCT FROM ((p_attestation->'credential') - 'proof') THEN
    RAISE EXCEPTION
      'Conflicting Verified-Done attestation already exists for session_id %, mandate_vc_id %',
      p_attestation->>'session_id', p_attestation->>'mandate_vc_id';
  END IF;

  INSERT INTO public.kya_mandate_events (
    event_type,
    session_id,
    mandate_vc_id,
    subagent_id,
    hic,
    org_id,
    protocol,
    mandate_type,
    amount,
    currency,
    merchant_category,
    human_present,
    kya_score_at_sign,
    ats_permission_level,
    gate_decision,
    requires_human_confirmation,
    kya_violation,
    decision_reason,
    article12_trace_id,
    firehorse_event_id
  )
  VALUES (
    'mandate.attest',
    p_event->>'session_id',
    p_event->>'mandate_vc_id',
    p_event->>'subagent_id',
    p_event->>'hic',
    p_event->>'org_id',
    p_event->>'protocol',
    p_event->>'mandate_type',
    NULLIF(p_event->>'amount', '')::NUMERIC,
    p_event->>'currency',
    p_event->>'merchant_category',
    NULLIF(p_event->>'human_present', '')::BOOLEAN,
    NULLIF(p_event->>'kya_score_at_sign', '')::NUMERIC,
    p_event->>'ats_permission_level',
    'allowed',
    COALESCE((p_event->>'requires_human_confirmation')::BOOLEAN, FALSE),
    COALESCE((p_event->>'kya_violation')::BOOLEAN, FALSE),
    p_event->>'decision_reason',
    NULLIF(p_event->>'article12_trace_id', '')::UUID,
    p_event->>'firehorse_event_id'
  )
  ON CONFLICT (session_id, mandate_vc_id)
    WHERE event_type = 'mandate.attest'
    DO NOTHING
  RETURNING * INTO v_event;

  IF v_event.id IS NULL THEN
    SELECT *
    INTO STRICT v_event
    FROM public.kya_mandate_events
    WHERE event_type = 'mandate.attest'
      AND session_id = p_event->>'session_id'
      AND mandate_vc_id = p_event->>'mandate_vc_id';
  END IF;

  IF v_event.subagent_id IS DISTINCT FROM p_event->>'subagent_id'
     OR v_event.hic IS DISTINCT FROM p_event->>'hic'
     OR v_event.org_id IS DISTINCT FROM p_event->>'org_id'
     OR v_event.protocol IS DISTINCT FROM p_event->>'protocol'
     OR v_event.mandate_type IS DISTINCT FROM p_event->>'mandate_type'
     OR v_event.amount IS DISTINCT FROM NULLIF(p_event->>'amount', '')::NUMERIC
     OR v_event.currency IS DISTINCT FROM p_event->>'currency'
     OR v_event.merchant_category IS DISTINCT FROM p_event->>'merchant_category'
     OR v_event.human_present IS DISTINCT FROM NULLIF(p_event->>'human_present', '')::BOOLEAN
     OR v_event.kya_score_at_sign IS DISTINCT FROM NULLIF(p_event->>'kya_score_at_sign', '')::NUMERIC
     OR v_event.ats_permission_level IS DISTINCT FROM p_event->>'ats_permission_level'
     OR v_event.requires_human_confirmation
        IS DISTINCT FROM COALESCE((p_event->>'requires_human_confirmation')::BOOLEAN, FALSE)
     OR v_event.kya_violation
        IS DISTINCT FROM COALESCE((p_event->>'kya_violation')::BOOLEAN, FALSE)
     OR v_event.decision_reason IS DISTINCT FROM p_event->>'decision_reason'
     OR v_event.article12_trace_id IS DISTINCT FROM NULLIF(p_event->>'article12_trace_id', '')::UUID
     OR v_event.firehorse_event_id IS DISTINCT FROM p_event->>'firehorse_event_id'
     OR v_event.gate_decision IS DISTINCT FROM 'allowed' THEN
    RAISE EXCEPTION
      'Conflicting mandate.attest event already exists for session_id %, mandate_vc_id %',
      p_event->>'session_id', p_event->>'mandate_vc_id';
  END IF;

  attestation_id := v_attestation.id;
  event_id := v_event.id;
  credential := v_attestation.credential;
  proof_status := v_attestation.proof_status;
  RETURN NEXT;
END;
$$;

COMMENT ON FUNCTION public.issue_verified_done_attestation(JSONB, JSONB) IS
  'Atomically and idempotently persists one KYA Verified-Done credential and its mandate.attest evidence-chain event. Conflicting retries fail; matching retries return the existing ids.';
COMMENT ON FUNCTION public.kya_guard_attestation_transition() IS
  'Allows only unsigned->signed, unsigned->revoked, and signed->revoked while keeping attestation evidence immutable.';

REVOKE ALL ON FUNCTION public.issue_verified_done_attestation(JSONB, JSONB)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.issue_verified_done_attestation(JSONB, JSONB)
  TO service_role;

REVOKE ALL ON FUNCTION public.kya_guard_attestation_transition()
  FROM PUBLIC, anon, authenticated, service_role;

-- Existing table grants and RLS from 074/079 remain the row/table gates.
GRANT SELECT, INSERT, UPDATE ON public.kya_verified_done_attestations TO service_role;
GRANT SELECT ON public.kya_verified_done_attestations TO authenticated;
GRANT SELECT, INSERT ON public.kya_mandate_events TO service_role;
GRANT SELECT ON public.kya_mandate_events TO authenticated;
ALTER TABLE public.kya_verified_done_attestations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kya_mandate_events ENABLE ROW LEVEL SECURITY;

COMMIT;

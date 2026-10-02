-- Evidence: Tool=Claude Code 2.1.281 Model=anthropic/undisclosed-by-runtime-policy Agent=claude-code-standby Date=2026-09-24
-- Audit trail: git log -- supabase/migrations/095_240926_decision_journey_discover_bridge.sql
-- CODE VERSIONING NOTE
-- Code-Version: 1.0.0
-- Introduced-In: PR-2093
-- Branch: claude/blissful-davinci-8782wy
-- Commit: (see git log -- this-file)
-- Date: 2026-09-24
-- Owner: DWS Platform / Claude Code cloud session (standby runtime)
-- Env-Schema: env-v1.0
-- Harness: Claude Code + CLAUDE.md + docs/system-config/STANDARDS_ROUTING.md
-- Hic-Approved-Drift: none — file authored only; APPLYING is RED zone (HIC)
--
-- Migration 095: DISCOVER -> Decision Journey bridge (M1 scope only)
--
-- HIC 24.09.2026: the first real bridge between the two worlds
--   DISCOVER                   -> website_observations   (089, 090, 091)
--   Decision Flight Recorder   -> decision_journey_event (094)
-- Scope: Ownership, Transfer, Owner Acknowledgement. Nothing else.
--
-- Anonymous Observation never becomes an Immutable Journey directly:
--   Anonymous Observation -> Ownership Finding -> Organization Identified
--   -> Decision Journey Created
-- A staff member or service job calls the import only once the visitor's
-- organisation is identified. Only structured fields are copied; the
-- visitor's free text stays in the erasable intake table (GDPR Art. 17).
--
-- Imported M1 path (acceptance criterion, HIC):
--   OBSERVATION_RECORDED -> OWNERSHIP_HYPOTHESIS_CREATED -> PATH_RECOMMENDED
--   (transfer) -> PATH_TRANSFERRED -> OWNER_ACKNOWLEDGED (-> OWNER_DECISION_STARTED)
--
-- Depends on: 089_240926_website_observations.sql, 090 (ownership_map),
--             094_240926_decision_journey.sql.
-- Spec: docs/plans/2026-09-24-decision-journey-outcome-evidence.md §9.3
-- Tests: supabase/tests/095_decision_journey_discover_bridge_verification.sql
--
-- Additive only. Reversible by DROP FUNCTION while no journey was imported.

BEGIN;

-- ============================================================
-- Import one identified DISCOVER path
-- ============================================================
CREATE OR REPLACE FUNCTION public.decision_journey_import_discover(
  p_observation_id      text,
  p_world_model_version text,
  p_imported_by         text,
  p_customer_id         uuid DEFAULT NULL,
  p_outreach_org_id     uuid DEFAULT NULL,
  p_organization_id     uuid DEFAULT NULL,
  p_ontology_version    text DEFAULT '1.5.0'
)
RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_journey   text;
  v_prev      text;
  v_id        text;
  r_root      record;
  r_own       record;
  r_res       record;
  v_own_found boolean;
  v_res_found boolean;
  v_owner     text := 'unknown';
  v_verdict   text;
BEGIN
  IF p_customer_id IS NULL AND p_outreach_org_id IS NULL AND p_organization_id IS NULL THEN
    RAISE EXCEPTION 'import_discover: an identified subject (customer, outreach org or organization) is required';
  END IF;

  -- Idempotent: a path is imported once.
  SELECT e.journey_id INTO v_journey
  FROM public.decision_journey_event e
  WHERE e.observation_id = p_observation_id AND e.emitted_by = 'website_discover'
  LIMIT 1;
  IF v_journey IS NOT NULL THEN
    RETURN v_journey;
  END IF;

  SELECT w.* INTO r_root FROM public.website_observations w
  WHERE w.observation_id = p_observation_id AND w.event IN ('query', 'recognise', 'industry')
  ORDER BY w.created_at LIMIT 1;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'import_discover: no DISCOVER observation found for %', p_observation_id;
  END IF;

  SELECT w.* INTO r_own FROM public.website_observations w
  WHERE w.observation_id = p_observation_id AND w.event = 'ownership' AND w.ownership_map IS NOT NULL
  ORDER BY w.created_at DESC LIMIT 1;
  v_own_found := FOUND;
  IF v_own_found THEN
    v_owner   := coalesce(r_own.ownership_map->'map'->>'owner', 'unknown');
    v_verdict := r_own.ownership_map->>'verdict';
  END IF;

  SELECT w.* INTO r_res FROM public.website_observations w
  WHERE w.observation_id = p_observation_id AND w.event = 'result' AND w.result = 'transferred_to_owner'
  ORDER BY w.created_at DESC LIMIT 1;
  v_res_found := FOUND;

  INSERT INTO public.decision_journey (title, customer_id, outreach_org_id, organization_id,
                                       subject_is_external, created_by)
  VALUES ('DISCOVER ' || left(p_observation_id, 12), p_customer_id, p_outreach_org_id,
          p_organization_id, true, p_imported_by)
  RETURNING journey_id INTO v_journey;

  -- 1. Observation (structured fields only, no visitor free text)
  v_id := 'evt_' || pg_catalog.replace(pg_catalog.gen_random_uuid()::text, '-', '');
  INSERT INTO public.decision_journey_event (
    event_id, journey_id, occurred_at, event_type, industry, observation_id,
    emitted_by_type, emitted_by, decision_by, affected_party, source_system,
    evidence_quality, evidence_strength, ontology_version, world_model_version,
    payload, previous_event_id, evidence_refs, created_by, hash)
  VALUES (v_id, v_journey, r_root.created_at, 'OBSERVATION_RECORDED', r_root.industry, p_observation_id,
          'customer', 'website_discover', NULL, 'customer', 'dws10_discover',
          'MANUAL_ENTRY', 0, p_ontology_version, p_world_model_version,
          pg_catalog.jsonb_build_object('path_key', r_root.path_key, 'recognise_id', r_root.recognise_id,
                                        'topics', r_root.topics),
          NULL, ARRAY['website_observations:' || r_root.id::text], p_imported_by, '');
  v_prev := v_id;

  IF v_own_found THEN
    -- 2. Ownership as stated by the visitor: a hypothesis until the owner responds
    v_id := 'evt_' || pg_catalog.replace(pg_catalog.gen_random_uuid()::text, '-', '');
    INSERT INTO public.decision_journey_event (
      event_id, journey_id, occurred_at, event_type, industry, observation_id,
      emitted_by_type, emitted_by, decision_by, affected_party, source_system,
      evidence_quality, evidence_strength, ontology_version, world_model_version,
      payload, previous_event_id, evidence_refs, created_by, hash)
    VALUES (v_id, v_journey, r_own.created_at, 'OWNERSHIP_HYPOTHESIS_CREATED', r_root.industry, p_observation_id,
            'customer', 'website_discover', NULL, 'customer', 'dws10_discover',
            'MANUAL_ENTRY', 0, p_ontology_version, p_world_model_version,
            pg_catalog.jsonb_build_object(
              'ownership_status', CASE r_own.ownership_map->>'known'
                                    WHEN 'yes' THEN 'named_by_visitor'
                                    WHEN 'partly' THEN 'partly_known'
                                    ELSE 'unclear' END,
              'ownership_map', r_own.ownership_map->'map'),
            v_prev, ARRAY['website_observations:' || r_own.id::text], p_imported_by, '');
    v_prev := v_id;

    -- 3. Transfer recommended by DISCOVER. Evidence: the stored verdict, or
    --    the transfer result itself (the UI offers "take this to the owner"
    --    only when the verdict is 'transfer').
    IF v_verdict = 'transfer' OR v_res_found THEN
      v_id := 'evt_' || pg_catalog.replace(pg_catalog.gen_random_uuid()::text, '-', '');
      INSERT INTO public.decision_journey_event (
        event_id, journey_id, occurred_at, event_type, industry, observation_id,
        emitted_by_type, emitted_by, decision_by, affected_party, source_system,
        evidence_quality, evidence_strength, ontology_version, world_model_version,
        payload, previous_event_id, evidence_refs, created_by, hash)
      VALUES (v_id, v_journey, r_own.created_at, 'PATH_RECOMMENDED', r_root.industry, p_observation_id,
              'system', 'website_discover', NULL, 'customer', 'dws10_discover',
              'SYSTEM_CONFIRMED', 0, p_ontology_version, p_world_model_version,
              pg_catalog.jsonb_build_object(
                'recommended_path', 'ownership_transfer',
                'transfer_to', v_owner,
                'recommendation_evidence', CASE WHEN v_verdict = 'transfer'
                                                THEN 'stored_verdict' ELSE 'transfer_ui_shown' END),
              v_prev, ARRAY['website_observations:' || r_own.id::text], p_imported_by, '');
      v_prev := v_id;
    END IF;
  END IF;

  IF v_res_found THEN
    -- 4. Transfer: the visitor decided to take the matter to its owner
    v_id := 'evt_' || pg_catalog.replace(pg_catalog.gen_random_uuid()::text, '-', '');
    INSERT INTO public.decision_journey_event (
      event_id, journey_id, occurred_at, event_type, industry, observation_id,
      emitted_by_type, emitted_by, decision_by, affected_party, source_system,
      evidence_quality, evidence_strength, ontology_version, world_model_version,
      payload, previous_event_id, evidence_refs, created_by, hash)
    VALUES (v_id, v_journey, r_res.created_at, 'PATH_TRANSFERRED', r_root.industry, p_observation_id,
            'customer', 'website_discover', 'customer', 'customer', 'dws10_discover',
            'HUMAN_CONFIRMED', 0, p_ontology_version, p_world_model_version,
            pg_catalog.jsonb_build_object('transferred_to_owner', v_owner),
            v_prev, ARRAY['website_observations:' || r_res.id::text], p_imported_by, '');
  END IF;

  RETURN v_journey;
END;
$$;

COMMENT ON FUNCTION public.decision_journey_import_discover(text, text, text, uuid, uuid, uuid, text) IS
  'M1 bridge: imports one identified DISCOVER path (observation, ownership hypothesis, transfer recommendation, transfer) into decision_journey_event. Idempotent. service_role only.';

-- ============================================================
-- Owner response to a transfer. Evidence is mandatory (meeting invite,
-- email reply id, signed minutes): the owner's reaction is a fact, not a
-- guess. OWNER_DECISION_STARTED is accepted only after OWNER_ACKNOWLEDGED.
-- ============================================================
CREATE OR REPLACE FUNCTION public.decision_journey_record_owner_response(
  p_transfer_event_id text,
  p_response          text,
  p_owner_role        text,
  p_evidence_ref      text,
  p_occurred_at       timestamptz,
  p_recorded_by       text,
  p_evidence_quality  text DEFAULT 'HUMAN_CONFIRMED'
)
RETURNS text
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  t      record;
  v_ack  text;
  v_prev text;
  v_id   text;
BEGIN
  IF p_response NOT IN ('OWNER_ACKNOWLEDGED', 'OWNER_DECISION_STARTED') THEN
    RAISE EXCEPTION 'record_owner_response: response must be OWNER_ACKNOWLEDGED or OWNER_DECISION_STARTED';
  END IF;
  IF coalesce(btrim(p_evidence_ref), '') = '' OR coalesce(btrim(p_owner_role), '') = '' THEN
    RAISE EXCEPTION 'record_owner_response: owner role and evidence reference are required';
  END IF;

  SELECT e.* INTO t FROM public.decision_journey_event e
  WHERE e.event_id = p_transfer_event_id AND e.event_type = 'PATH_TRANSFERRED';
  IF NOT FOUND THEN
    RAISE EXCEPTION 'record_owner_response: % is not a PATH_TRANSFERRED event', p_transfer_event_id;
  END IF;

  SELECT a.event_id INTO v_ack FROM public.decision_journey_event a
  WHERE a.previous_event_id = t.event_id AND a.event_type = 'OWNER_ACKNOWLEDGED'
  ORDER BY a.recorded_seq LIMIT 1;

  IF p_response = 'OWNER_ACKNOWLEDGED' THEN
    IF v_ack IS NOT NULL THEN
      RAISE EXCEPTION 'record_owner_response: transfer % is already acknowledged', p_transfer_event_id;
    END IF;
    v_prev := t.event_id;
  ELSE
    IF v_ack IS NULL THEN
      RAISE EXCEPTION 'record_owner_response: OWNER_DECISION_STARTED requires OWNER_ACKNOWLEDGED first';
    END IF;
    IF EXISTS (SELECT 1 FROM public.decision_journey_event d
               WHERE d.previous_event_id = v_ack AND d.event_type = 'OWNER_DECISION_STARTED') THEN
      RAISE EXCEPTION 'record_owner_response: decision already started for transfer %', p_transfer_event_id;
    END IF;
    v_prev := v_ack;
  END IF;

  v_id := 'evt_' || pg_catalog.replace(pg_catalog.gen_random_uuid()::text, '-', '');
  INSERT INTO public.decision_journey_event (
    event_id, journey_id, occurred_at, event_type, industry, observation_id,
    emitted_by_type, emitted_by, decision_by, affected_party, source_system,
    evidence_quality, evidence_strength, ontology_version, world_model_version,
    payload, previous_event_id, evidence_refs, created_by, hash)
  VALUES (v_id, t.journey_id, p_occurred_at, p_response, t.industry, t.observation_id,
          'human', p_recorded_by, p_owner_role, 'customer', 'owner_response',
          p_evidence_quality, 0, t.ontology_version, t.world_model_version,
          pg_catalog.jsonb_build_object('transfer_event_id', t.event_id),
          v_prev, ARRAY[p_evidence_ref], p_recorded_by, '');
  RETURN v_id;
END;
$$;

COMMENT ON FUNCTION public.decision_journey_record_owner_response(text, text, text, text, timestamptz, text, text) IS
  'M1 bridge: records the owner''s acknowledgement / decision start after a PATH_TRANSFERRED, with mandatory evidence. service_role only.';

-- ============================================================
-- Grants: service_role only
-- ============================================================
REVOKE ALL ON FUNCTION public.decision_journey_import_discover(text, text, text, uuid, uuid, uuid, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decision_journey_import_discover(text, text, text, uuid, uuid, uuid, text)
  TO service_role;
REVOKE ALL ON FUNCTION public.decision_journey_record_owner_response(text, text, text, text, timestamptz, text, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decision_journey_record_owner_response(text, text, text, text, timestamptz, text, text)
  TO service_role;

COMMIT;

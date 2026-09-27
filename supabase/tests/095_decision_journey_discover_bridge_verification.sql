-- Evidence: Tool=Claude Code 2.1.281 Model=anthropic/undisclosed-by-runtime-policy Agent=claude-code-standby Date=2026-09-24
-- Audit trail: git log -- supabase/tests/095_decision_journey_discover_bridge_verification.sql
--
-- Verification of migration 095 (DISCOVER -> Decision Journey bridge, M1).
--
-- HIC acceptance criterion (24.09.2026): the first possible M1 path
--   DISCOVER -> Ownership (hypothesis) -> Transfer recommended ->
--   PATH_TRANSFERRED -> OWNER_ACKNOWLEDGED
-- is visible in decision_journey_event.
--
-- Run against a THROWAWAY database only, after 089 (website_observations),
-- 090, 091, 094 and 095 (plus Supabase roles / auth.uid() / referenced
-- tables). One transaction, ends in ROLLBACK. Prints "PASS: ..." per check.
--
--   psql -v ON_ERROR_STOP=1 -f supabase/tests/095_decision_journey_discover_bridge_verification.sql

BEGIN;

CREATE FUNCTION pg_temp.expect_fail(stmt text, label text) RETURNS void LANGUAGE plpgsql AS $$
DECLARE failed boolean;
BEGIN
  BEGIN
    EXECUTE stmt;
    failed := false;
  EXCEPTION WHEN OTHERS THEN
    failed := true;
  END;
  IF NOT failed THEN RAISE EXCEPTION 'FAIL: % (statement succeeded)', label; END IF;
  RAISE NOTICE 'PASS: %', label;
END $$;

CREATE FUNCTION pg_temp.pass(ok boolean, label text) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF ok IS NOT TRUE THEN RAISE EXCEPTION 'FAIL: %', label; END IF;
  RAISE NOTICE 'PASS: %', label;
END $$;

INSERT INTO public.customers (id, name) VALUES ('00000000-0000-0000-0000-00000000c001', 'Test Customer');

-- A DISCOVER path as the dws10.com front-end records it: owner known in part,
-- decision rights elsewhere -> verdict 'transfer' -> visitor takes it to the owner.
INSERT INTO public.website_observations (observation_id, event, industry, path_key, query_text, created_at)
VALUES ('obs-discover-1', 'query', 'manufacturing', 'batch_carbon',
        'Emme tiedä tuotantoerien hiilijalanjälkeä', now() - interval '2 hours');
INSERT INTO public.website_observations (observation_id, event, ownership_map, created_at)
VALUES ('obs-discover-1', 'ownership',
        '{"known":"partly","map":{"owner":"coo","decision":"cfo"},"verdict":"transfer"}',
        now() - interval '110 minutes');
INSERT INTO public.website_observations (observation_id, event, result, created_at)
VALUES ('obs-discover-1', 'result', 'transferred_to_owner', now() - interval '100 minutes');

DO $$
DECLARE jr text; j2 text; t text; cnt integer; before_m1 integer; types text[];
BEGIN
  PERFORM pg_temp.expect_fail(
    $f$SELECT public.decision_journey_import_discover('obs-discover-1', '1.2.4', 'verification')$f$,
    'bridge: anonymous import without an identified subject is rejected');

  jr := public.decision_journey_import_discover('obs-discover-1', '1.2.4', 'verification',
          p_customer_id => '00000000-0000-0000-0000-00000000c001');

  SELECT count(*) INTO cnt FROM public.decision_journey_event WHERE journey_id = jr;
  PERFORM pg_temp.pass(cnt = 4,
    format('bridge: import wrote %s events (observation, ownership, transfer recommended, transfer)', cnt));

  PERFORM pg_temp.pass(
    NOT EXISTS (SELECT 1 FROM public.decision_journey_event
                WHERE journey_id = jr AND payload::text LIKE '%hiilijalanj%'),
    'bridge: the visitor''s free text is not copied into the immutable log');

  PERFORM pg_temp.pass(
    (SELECT payload->>'ownership_status' = 'partly_known'
     FROM public.decision_journey_event WHERE journey_id = jr AND event_type = 'OWNERSHIP_HYPOTHESIS_CREATED'),
    'bridge: visitor-stated ownership is a hypothesis, not a confirmation');

  PERFORM pg_temp.pass(
    (SELECT payload->>'recommended_path' = 'ownership_transfer' AND payload->>'transfer_to' = 'coo'
            AND emitted_by_type = 'system' AND decision_by IS NULL
     FROM public.decision_journey_event WHERE journey_id = jr AND event_type = 'PATH_RECOMMENDED'),
    'bridge: transfer recommended by DISCOVER (system, no decider)');

  SELECT event_id INTO t FROM public.decision_journey_event
   WHERE journey_id = jr AND event_type = 'PATH_TRANSFERRED'
     AND decision_by = 'customer' AND payload->>'transferred_to_owner' = 'coo';
  PERFORM pg_temp.pass(t IS NOT NULL, 'bridge: PATH_TRANSFERRED to the owner role, decided by the customer');

  j2 := public.decision_journey_import_discover('obs-discover-1', '1.2.4', 'verification',
          p_customer_id => '00000000-0000-0000-0000-00000000c001');
  PERFORM pg_temp.pass(j2 = jr, 'bridge: import is idempotent');

  PERFORM pg_temp.expect_fail(format(
    $f$SELECT public.decision_journey_record_owner_response(%L, 'OWNER_DECISION_STARTED', 'coo', 'email:1', now(), 'staff')$f$, t),
    'owner response: decision start before acknowledgement is rejected');
  PERFORM pg_temp.expect_fail(format(
    $f$SELECT public.decision_journey_record_owner_response(%L, 'OWNER_ACKNOWLEDGED', 'coo', '', now(), 'staff')$f$, t),
    'owner response: acknowledgement without evidence is rejected');

  PERFORM public.decision_journey_record_owner_response(t, 'OWNER_ACKNOWLEDGED', 'coo', 'email:reply-42', now(), 'staff');
  PERFORM pg_temp.expect_fail(format(
    $f$SELECT public.decision_journey_record_owner_response(%L, 'OWNER_ACKNOWLEDGED', 'coo', 'email:2', now(), 'staff')$f$, t),
    'owner response: a transfer is acknowledged once');

  -- HIC acceptance criterion: the whole M1 path is in decision_journey_event, in order
  SELECT array_agg(event_type ORDER BY recorded_seq) INTO types
  FROM public.decision_journey_event WHERE journey_id = jr;
  PERFORM pg_temp.pass(
    types = ARRAY['OBSERVATION_RECORDED', 'OWNERSHIP_HYPOTHESIS_CREATED', 'PATH_RECOMMENDED',
                  'PATH_TRANSFERRED', 'OWNER_ACKNOWLEDGED'],
    'ACCEPTANCE: DISCOVER -> ownership -> transfer recommended -> PATH_TRANSFERRED -> OWNER_ACKNOWLEDGED '
      || 'in decision_journey_event: ' || array_to_string(types, ' -> '));

  -- Decision Traceability (HIC): every bridged event carries evidence_refs that
  -- resolve back to the DISCOVER observation rows of the same visit.
  PERFORM pg_temp.pass(
    NOT EXISTS (
      SELECT 1 FROM public.decision_journey_event e
      WHERE e.journey_id = jr AND e.emitted_by = 'website_discover'
        AND (cardinality(e.evidence_refs) = 0
             OR EXISTS (
               SELECT 1 FROM unnest(e.evidence_refs) AS ref(r)
               WHERE NOT EXISTS (
                 SELECT 1 FROM public.website_observations w
                 WHERE 'website_observations:' || w.id::text = ref.r
                   AND w.observation_id = 'obs-discover-1')))),
    'traceability: every bridged event''s evidence_refs resolve to this visit''s website_observations rows');
  PERFORM pg_temp.pass(
    (SELECT count(DISTINCT w.event) = 3
     FROM public.decision_journey_event e
     CROSS JOIN LATERAL unnest(e.evidence_refs) AS ref(r)
     JOIN public.website_observations w ON 'website_observations:' || w.id::text = ref.r
     WHERE e.journey_id = jr),
    'traceability: journey -> query, ownership and result observations (backwards)');
  PERFORM pg_temp.pass(
    (SELECT evidence_refs = ARRAY['email:reply-42'] AND previous_event_id = t
     FROM public.decision_journey_event WHERE journey_id = jr AND event_type = 'OWNER_ACKNOWLEDGED'),
    'traceability: owner acknowledgement carries its own evidence and links to the transfer');
  PERFORM pg_temp.pass(
    (SELECT count(DISTINCT journey_id) = 1 AND count(*) = 5 FROM public.decision_journey_event
     WHERE observation_id = 'obs-discover-1'),
    'ACCEPTANCE: all five M1 events share one journey_id');

  SELECT verified_ownership_transfers INTO before_m1 FROM public.active_ontology_kpis;
  PERFORM public.decision_journey_record_owner_response(t, 'OWNER_DECISION_STARTED', 'coo', 'meeting:2026-10-01', now(), 'staff');
  PERFORM pg_temp.pass(
    (SELECT verified_ownership_transfers = before_m1 + 1 FROM public.active_ontology_kpis),
    'M1: transfer + owner acknowledgement + decision start = one verified ownership transfer');

  PERFORM pg_temp.pass(
    NOT EXISTS (SELECT 1 FROM public.decision_journey_verify_chain(jr)),
    'bridge: imported journey hash chain verifies clean');
END $$;

-- A discovery path (ownership unknown) is imported without a transfer recommendation.
INSERT INTO public.website_observations (observation_id, event, industry, created_at)
VALUES ('obs-discover-2', 'recognise', 'construction', now() - interval '1 hour');
INSERT INTO public.website_observations (observation_id, event, ownership_map, created_at)
VALUES ('obs-discover-2', 'ownership', '{"known":"no","map":{},"verdict":"discovery"}', now() - interval '50 minutes');

DO $$
DECLARE jr text;
BEGIN
  jr := public.decision_journey_import_discover('obs-discover-2', '1.2.4', 'verification',
          p_customer_id => '00000000-0000-0000-0000-00000000c001');
  PERFORM pg_temp.pass(
    (SELECT array_agg(event_type ORDER BY recorded_seq) = ARRAY['OBSERVATION_RECORDED', 'OWNERSHIP_HYPOTHESIS_CREATED']
     FROM public.decision_journey_event WHERE journey_id = jr),
    'bridge: discovery path (ownership unclear) imports no transfer events');
END $$;

-- Regression (HIC): unknown verdict -> ignored -> no event emitted.
-- Garbage in must not become immutable garbage forever. Even if an unknown
-- verdict reached the intake table (e.g. written before the Pages Function
-- whitelist), the bridge emits no recommendation or transfer for it and never
-- copies the value into the append-only log.
INSERT INTO public.website_observations (observation_id, event, industry, created_at)
VALUES ('obs-discover-3', 'query', 'energy', now() - interval '1 hour');
INSERT INTO public.website_observations (observation_id, event, ownership_map, created_at)
VALUES ('obs-discover-3', 'ownership',
        '{"known":"partly","map":{"owner":"coo","decision":"cfo"},"verdict":"drop_table_hack"}',
        now() - interval '50 minutes');

DO $$
DECLARE jr text;
BEGIN
  jr := public.decision_journey_import_discover('obs-discover-3', '1.2.4', 'verification',
          p_customer_id => '00000000-0000-0000-0000-00000000c001');
  PERFORM pg_temp.pass(
    (SELECT array_agg(event_type ORDER BY recorded_seq) = ARRAY['OBSERVATION_RECORDED', 'OWNERSHIP_HYPOTHESIS_CREATED']
     FROM public.decision_journey_event WHERE journey_id = jr),
    'regression: unknown verdict emits no PATH_RECOMMENDED / PATH_TRANSFERRED');
  PERFORM pg_temp.pass(
    NOT EXISTS (SELECT 1 FROM public.decision_journey_event
                WHERE journey_id = jr AND payload::text LIKE '%drop_table_hack%'),
    'regression: unknown verdict value is never copied into the immutable log');
END $$;

ROLLBACK;

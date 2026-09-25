-- Evidence: Tool=Claude Code 2.1.281 Model=anthropic/undisclosed-by-runtime-policy Agent=claude-code-standby Date=2026-09-24
-- Audit trail: git log -- supabase/tests/094_decision_journey_verification.sql
--
-- Verification of migration 094 (Active Ontology 1.5 foundation).
-- Plan: PR #2093 seurantasuunnitelma, phases 2-4 (HIC 24.09.2026).
--
-- Run against a THROWAWAY database only, after 094 (and Supabase roles /
-- auth.uid() / referenced tables) exist. Everything runs in one transaction
-- and ends in ROLLBACK: no data is left behind. Every check prints
-- "PASS: ..."; the first failure aborts with "FAIL: ...".
--
--   psql -v ON_ERROR_STOP=1 -f supabase/tests/094_decision_journey_verification.sql

BEGIN;

-- ------------------------------------------------------------------
-- Helpers (session-temporary)
-- ------------------------------------------------------------------
CREATE FUNCTION pg_temp.ev(
  j text, typ text, prev text, dby text, q text, refs text[],
  pl jsonb DEFAULT '{}'::jsonb, occ timestamptz DEFAULT now(),
  emt text DEFAULT 'ai', lc numeric DEFAULT NULL, sup text DEFAULT NULL
) RETURNS text LANGUAGE plpgsql AS $$
DECLARE id text := 'evt_' || replace(gen_random_uuid()::text, '-', '');
BEGIN
  INSERT INTO public.decision_journey_event (
    event_id, journey_id, occurred_at, event_type, emitted_by_type, emitted_by,
    decision_by, affected_party, source_system, evidence_quality, evidence_strength,
    ontology_version, world_model_version, payload, previous_event_id,
    supersedes_event_id, evidence_refs, created_by, hash, learning_confidence)
  VALUES (id, j, occ, typ, emt, 'test', dby, 'customer', 'test', q, 0,
          '1.5.0', '1.2.4', pl, prev, sup, refs, 'verification', '', lc);
  RETURN id;
END $$;

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

CREATE TEMP TABLE ids (k text PRIMARY KEY, v text);

INSERT INTO public.customers (id, name) VALUES ('00000000-0000-0000-0000-00000000c001', 'Test Customer');
WITH x AS (
  INSERT INTO public.decision_journey (title, customer_id, subject_is_external, created_by)
  VALUES ('Verification journey', '00000000-0000-0000-0000-00000000c001', true, 'verification')
  RETURNING journey_id
)
INSERT INTO ids SELECT 'j', journey_id FROM x;

-- ------------------------------------------------------------------
-- Phase 2 — event model, evidence, learning, hash chain
-- ------------------------------------------------------------------
DO $$
DECLARE j text := (SELECT v FROM ids WHERE k = 'j');
        obs text; sys text; man text; rec text; rej text; r record;
BEGIN
  obs := pg_temp.ev(j, 'OBSERVATION_RECORDED', NULL, NULL, 'SYSTEM_CONFIRMED', '{ref:obs}');
  INSERT INTO ids VALUES ('obs', obs);

  -- Required columns present
  PERFORM pg_temp.pass(
    (SELECT count(*) = 8 FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'decision_journey_event'
       AND column_name IN ('event_id', 'journey_id', 'occurred_at', 'recorded_at',
                           'emitted_by', 'decision_by', 'affected_party', 'hash')),
    'event model: required columns exist');

  -- evidence_strength is computed by the database, source-aware
  sys := pg_temp.ev(j, 'PATH_RECOMMENDED', obs, NULL, 'SYSTEM_CONFIRMED', '{}');
  man := pg_temp.ev(j, 'OWNERSHIP_HYPOTHESIS_CREATED', obs, NULL, 'MANUAL_ENTRY', '{}');
  PERFORM pg_temp.pass(
    (SELECT evidence_strength = 0.990 FROM public.decision_journey_event WHERE event_id = sys),
    'evidence_strength: SYSTEM_CONFIRMED recorded immediately = 0.99 (emitter value 0 ignored)');
  PERFORM pg_temp.pass(
    (SELECT evidence_strength = 0.400 FROM public.decision_journey_event WHERE event_id = man),
    'evidence_strength: MANUAL_ENTRY = 0.40 even when recorded immediately');

  -- decision_by semantics
  PERFORM pg_temp.expect_fail(format(
    $f$SELECT pg_temp.ev(%L, 'PATH_REJECTED', %L, NULL, 'HUMAN_CONFIRMED', '{}')$f$, j, sys),
    'decision_by: PATH_REJECTED without decision_by is rejected');
  rej := pg_temp.ev(j, 'PATH_REJECTED', sys, 'customer', 'HUMAN_CONFIRMED', '{}');
  INSERT INTO ids VALUES ('rej', rej);

  -- Evidence != interpretation
  PERFORM pg_temp.expect_fail(format(
    $f$SELECT pg_temp.ev(%L, 'OBSERVATION_RECORDED', NULL, NULL, 'SYSTEM_CONFIRMED', '{}', '{"hypothesis":"x"}')$f$, j),
    'evidence layer: interpretation key in payload is rejected');

  -- Append-only
  PERFORM pg_temp.expect_fail(format(
    $f$UPDATE public.decision_journey_event SET payload = '{"changed":1}' WHERE event_id = %L$f$, obs),
    'append-only: UPDATE raises');
  PERFORM pg_temp.expect_fail(format(
    $f$DELETE FROM public.decision_journey_event WHERE event_id = %L$f$, obs),
    'append-only: DELETE raises');
  PERFORM pg_temp.expect_fail('TRUNCATE public.decision_journey_event CASCADE',
    'append-only: TRUNCATE raises');
  PERFORM pg_temp.expect_fail(format(
    $f$SELECT pg_temp.ev(%L, 'OBSERVATION_CORRECTED', NULL, NULL, 'SYSTEM_CONFIRMED', '{}', '{}', now(), 'ai', NULL, %L)$f$, j, sys),
    'correction: OBSERVATION_CORRECTED must supersede an OBSERVATION_RECORDED');
END $$;

-- Learning confidence <= minimum(evidence_strength)
DO $$
DECLARE j text := (SELECT v FROM ids WHERE k = 'j');
        obs text := (SELECT v FROM ids WHERE k = 'obs');
        rej text := (SELECT v FROM ids WHERE k = 'rej');
        weakest numeric;
BEGIN
  SELECT min(evidence_strength) INTO weakest FROM public.decision_journey_event
  WHERE event_id IN (obs, rej);
  PERFORM pg_temp.expect_fail(format(
    $f$SELECT pg_temp.ev(%L, 'LEARNING_DELTA_CREATED', %L, NULL, 'SYSTEM_CONFIRMED', ARRAY[%L, %L], '{"hypothesis":"h"}', now(), 'ai', %s)$f$,
    j, rej, obs, rej, weakest + 0.01),
    format('learning: confidence %s above min evidence %s is rejected', weakest + 0.01, weakest));
  PERFORM pg_temp.pass(
    pg_temp.ev(j, 'LEARNING_DELTA_CREATED', rej, NULL, 'SYSTEM_CONFIRMED', ARRAY[obs, rej],
               '{"hypothesis":"h"}', now(), 'ai', weakest) IS NOT NULL,
    format('learning: confidence equal to min evidence %s is accepted', weakest));
  PERFORM pg_temp.expect_fail(format(
    $f$SELECT pg_temp.ev(%L, 'LEARNING_DELTA_CREATED', %L, NULL, 'SYSTEM_CONFIRMED', ARRAY[%L], '{"fact":"h"}', now(), 'ai', 0.1)$f$,
    j, rej, obs),
    'learning: a "fact" key is rejected, hypotheses only');
END $$;

-- Hash chain: payload and occurred_at protected, recorded_at not hashed
DO $$
DECLARE j text := (SELECT v FROM ids WHERE k = 'j');
        obs text := (SELECT v FROM ids WHERE k = 'obs');
BEGIN
  PERFORM pg_temp.pass(
    NOT EXISTS (SELECT 1 FROM public.decision_journey_verify_chain(j)),
    'hash chain: intact chain verifies clean');

  ALTER TABLE public.decision_journey_event DISABLE TRIGGER USER;
  UPDATE public.decision_journey_event SET recorded_at = recorded_at + interval '1 hour' WHERE event_id = obs;
  ALTER TABLE public.decision_journey_event ENABLE TRIGGER USER;
  PERFORM pg_temp.pass(
    NOT EXISTS (SELECT 1 FROM public.decision_journey_verify_chain(j)),
    'hash chain: recorded_at is not part of the hash');

  ALTER TABLE public.decision_journey_event DISABLE TRIGGER USER;
  UPDATE public.decision_journey_event SET occurred_at = occurred_at - interval '1 day' WHERE event_id = obs;
  ALTER TABLE public.decision_journey_event ENABLE TRIGGER USER;
  PERFORM pg_temp.pass(
    EXISTS (SELECT 1 FROM public.decision_journey_verify_chain(j) WHERE event_id = obs),
    'hash chain: changing occurred_at is detected');

  ALTER TABLE public.decision_journey_event DISABLE TRIGGER USER;
  UPDATE public.decision_journey_event
     SET occurred_at = occurred_at + interval '1 day', payload = '{"tampered":true}'
   WHERE event_id = obs;
  ALTER TABLE public.decision_journey_event ENABLE TRIGGER USER;
  PERFORM pg_temp.pass(
    EXISTS (SELECT 1 FROM public.decision_journey_verify_chain(j)
            WHERE event_id = obs AND problem = 'content hash mismatch'),
    'hash chain: "event kept, payload changed" is detected');

  -- HIC-approved hash set (24.09.2026): decision fields are protected too.
  ALTER TABLE public.decision_journey_event DISABLE TRIGGER USER;
  UPDATE public.decision_journey_event SET decision_by = 'someone_else'
   WHERE event_id = (SELECT v FROM ids WHERE k = 'rej');
  ALTER TABLE public.decision_journey_event ENABLE TRIGGER USER;
  PERFORM pg_temp.pass(
    EXISTS (SELECT 1 FROM public.decision_journey_verify_chain(j)
            WHERE event_id = (SELECT v FROM ids WHERE k = 'rej')
              AND problem = 'content hash mismatch'),
    'hash chain: rewriting decision_by is detected');
END $$;

-- ------------------------------------------------------------------
-- Phase 3 — PATH_ABANDONED is system-emitted only
-- ------------------------------------------------------------------
WITH x AS (
  INSERT INTO public.decision_journey (title, customer_id, subject_is_external, created_by)
  VALUES ('Abandonment journey', '00000000-0000-0000-0000-00000000c001', true, 'verification')
  RETURNING journey_id
)
INSERT INTO ids SELECT 'j2', journey_id FROM x;

DO $$
DECLARE j text := (SELECT v FROM ids WHERE k = 'j2');
        obs text; rec text; n integer; a record;
BEGIN
  obs := pg_temp.ev(j, 'OBSERVATION_RECORDED', NULL, NULL, 'SYSTEM_CONFIRMED', '{}', '{}', now() - interval '40 days');
  rec := pg_temp.ev(j, 'PATH_RECOMMENDED', obs, NULL, 'SYSTEM_CONFIRMED', '{}', '{}', now() - interval '31 days');

  PERFORM pg_temp.expect_fail(format(
    $f$SELECT pg_temp.ev(%L, 'PATH_ABANDONED', %L, NULL, 'MANUAL_ENTRY', ARRAY[%L], '{}', now(), 'human')$f$, j, rec, rec),
    'PATH_ABANDONED: user-entered event is rejected');

  n := public.decision_journey_emit_abandonments(interval '30 days');
  PERFORM pg_temp.pass(n >= 1, format('PATH_ABANDONED: timer emitted %s event(s)', n));

  SELECT * INTO a FROM public.decision_journey_event
  WHERE journey_id = j AND event_type = 'PATH_ABANDONED';
  PERFORM pg_temp.pass(a.emitted_by_type = 'system' AND a.decision_by IS NULL
                       AND a.previous_event_id = rec,
    'PATH_ABANDONED: emitted_by_type = system, decision_by = NULL, follows the recommendation');

  n := public.decision_journey_emit_abandonments(interval '30 days');
  PERFORM pg_temp.pass(n = 0, 'PATH_ABANDONED: timer is idempotent');
END $$;

-- ------------------------------------------------------------------
-- Phase 4 — metrics are computable (one full verified journey)
-- ------------------------------------------------------------------
WITH x AS (
  INSERT INTO public.decision_journey (title, customer_id, subject_is_external, created_by)
  VALUES ('Verified journey', '00000000-0000-0000-0000-00000000c001', true, 'verification')
  RETURNING journey_id
)
INSERT INTO ids SELECT 'j3', journey_id FROM x;

DO $$
DECLARE j text := (SELECT v FROM ids WHERE k = 'j3');
        o text; own text; acc text; act text; outc text; ld text; k record;
BEGIN
  o    := pg_temp.ev(j, 'OBSERVATION_RECORDED', NULL, NULL, 'SYSTEM_CONFIRMED', '{}');
  own  := pg_temp.ev(j, 'OWNERSHIP_CONFIRMED', o, 'COO', 'WORKSHOP_OUTPUT', '{workshop_report}');
  acc  := pg_temp.ev(j, 'PATH_ACCEPTED', own, 'customer', 'SYSTEM_CONFIRMED', '{order_1}');
  act  := pg_temp.ev(j, 'ACTION_COMPLETED', acc, NULL, 'SYSTEM_CONFIRMED', '{delivery_1}');
  outc := pg_temp.ev(j, 'OUTCOME_RECORDED', act, NULL, 'SYSTEM_CONFIRMED', '{report_1}');
  PERFORM pg_temp.expect_fail(format(
    $f$SELECT pg_temp.ev(%L, 'ONTOLOGY_UPDATED', %L, 'HIC', 'HUMAN_CONFIRMED', ARRAY[%L])$f$, j, outc, outc),
    'learning: Event -> Ontology Update without a learning delta is rejected');
  ld   := pg_temp.ev(j, 'LEARNING_DELTA_CREATED', outc, NULL, 'SYSTEM_CONFIRMED',
                     ARRAY[own, acc, outc], '{"hypothesis":"coo_owns_batch_footprint"}', now(), 'ai', 0.85);
  PERFORM pg_temp.ev(j, 'ONTOLOGY_UPDATED', ld, 'HIC', 'HUMAN_CONFIRMED', ARRAY[ld]);

  SELECT * INTO k FROM public.active_ontology_kpis;
  PERFORM pg_temp.pass(k.observation_count >= 3 AND k.decision_traceability_coverage IS NOT NULL,
    format('KPI: observation_count = %s paired with coverage = %s', k.observation_count, k.decision_traceability_coverage));
  PERFORM pg_temp.pass(k.verified_decision_journeys = 1, 'KPI M2: verified_decision_journeys = 1');
  PERFORM pg_temp.pass(k.verified_learning_deltas = 1, 'KPI M3: verified_learning_deltas = 1');
  PERFORM pg_temp.pass(k.verified_ownership_transfers = 0, 'KPI M1: verified_ownership_transfers = 0 (none recorded)');
  PERFORM pg_temp.pass(k.shadow_journeys_recorded = 0, 'KPI: shadow_journeys_recorded = 0 (no shadow recommendation yet)');
  PERFORM pg_temp.ev(j, 'PATH_RECOMMENDED', o, NULL, 'SYSTEM_CONFIRMED', '{}', '{"mode":"shadow","action_class":"A1","would_execute":true}');
  PERFORM pg_temp.pass((SELECT shadow_journeys_recorded = 1 FROM public.active_ontology_kpis),
    'KPI: shadow_journeys_recorded = 1 after a shadow recommendation');
END $$;

-- M1 — a transfer counts only after the owner acknowledged and started deciding
DO $$
DECLARE j text := (SELECT v FROM ids WHERE k = 'j3'); o text; t text; a text;
BEGIN
  o := pg_temp.ev(j, 'OBSERVATION_RECORDED', NULL, NULL, 'SYSTEM_CONFIRMED', '{}');
  t := pg_temp.ev(j, 'PATH_TRANSFERRED', o, 'sales_lead', 'HUMAN_CONFIRMED', '{}');
  PERFORM pg_temp.expect_fail(format(
    $f$SELECT pg_temp.ev(%L, 'OUTCOME_RECORDED', %L, NULL, 'SYSTEM_CONFIRMED', '{x}')$f$, j, t),
    'transfer: OUTCOME_RECORDED directly after PATH_TRANSFERRED is rejected');
  a := pg_temp.ev(j, 'OWNER_ACKNOWLEDGED', t, 'COO', 'HUMAN_CONFIRMED', '{}');
  PERFORM pg_temp.pass((SELECT verified_ownership_transfers = 0 FROM public.active_ontology_kpis),
    'KPI M1: acknowledgement alone does not verify a transfer');
  PERFORM pg_temp.ev(j, 'OWNER_DECISION_STARTED', a, 'COO', 'HUMAN_CONFIRMED', '{}');
  PERFORM pg_temp.pass((SELECT verified_ownership_transfers = 1 FROM public.active_ontology_kpis),
    'KPI M1: verified_ownership_transfers = 1 after OWNER_DECISION_STARTED');
END $$;

-- RLS: an authenticated user with no membership sees nothing
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-0000000000aa', true);
DO $$ BEGIN
  PERFORM pg_temp.pass((SELECT count(*) = 0 FROM public.decision_journey_event),
    'RLS: authenticated non-member reads 0 events');
END $$;
RESET ROLE;

ROLLBACK;

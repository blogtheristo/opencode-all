-- Evidence: Tool=Claude Code 2.1.281 Model=anthropic/undisclosed-by-runtime-policy Agent=claude-code-standby Date=2026-09-24
-- Audit trail: git log -- supabase/migrations/089_240926_decision_journey.sql
-- CODE VERSIONING NOTE
-- Code-Version: 1.5.0
-- Introduced-In: (PR pending — branch claude/blissful-davinci-8782wy)
-- Branch: claude/blissful-davinci-8782wy
-- Commit: (see git log -- this-file)
-- Date: 2026-09-24
-- Owner: DWS Platform / Claude Code cloud session (standby runtime)
-- Env-Schema: env-v1.0
-- Harness: Claude Code + CLAUDE.md + docs/system-config/STANDARDS_ROUTING.md
-- Hic-Approved-Drift: none — file authored only; APPLYING is RED zone (HIC)
--
-- Migration 089: decision_journey — event-first outcome evidence
--
-- Spec: docs/plans/2026-09-24-decision-journey-outcome-evidence.md
-- Field list: HIC 24.09.2026 (decision_journey_event) + Boardy review round 2
-- (emitted_by / decision_by / affected_party, evidence_quality, payload in the
-- hash). Integrity-only additions (prev_hash, recorded_seq,
-- supersedes_event_id, EVENT_CORRECTED) are listed in spec §3.4.
--
-- Principle: store events, never state. Outcomes are derived from the event
-- chain; nobody types "what happened" afterwards. ontology_version and
-- world_model_version are stamped on every event, not on the journey.
--
-- Tables:
--   decision_journeys        — journey header (dj_0001842, subject, title)
--   decision_journey_events  — append-only, hash-chained per journey
-- Views:
--   decision_journey_timeline       — ordered chain + capture_lag
--   decision_journey_paths    — every real path (one per terminal event):
--       rejected, abandoned, delayed and purchased paths are all evidence;
--       decision_state ACCEPTED / REJECTED / UNDECIDED / DELAYED / ... / OPEN.
--       is_verified marks observation -> ownership -> decision -> action ->
--       outcome chains (LD-2026-09-24).
-- Functions:
--   decision_journey_event_hash(prev_hash, event) — canonical hash
--   decision_journey_verify_chain(journey_id)     — recompute + report mismatch
--   decision_journey_emit_abandonments(window)    — system emits PATH_ABANDONED
-- KPI view:
--   active_ontology_kpis — observations, ownership findings, journeys, paths
--       by state, verified paths, learning deltas, ontology updates
--
-- Integrity (enforced in-database):
--   1. UPDATE / DELETE / TRUNCATE on events raise. Fix = EVENT_CORRECTED event.
--   2. Decision, action and outcome events require evidence_refs ("show me").
--   3. previous_event_id / supersedes_event_id stay inside the journey.
--   4. occurred_at cannot be in the future.
--   5. hash = sha256(prev_hash | payload | timestamps | ontology + world model
--      versions | actors | evidence) — changing a payload breaks the chain,
--      detectable with decision_journey_verify_chain(). Serialised per journey.
--   7. Decision events require decision_by (who decided != who proposed).
--   8. evidence_strength = quality weight x capture-lag factor, computed by
--      trigger, never supplied by the emitter.
--   9. PATH_ABANDONED is system-emitted only (decision_journey_emit_abandonments)
--      with decision_by NULL: absence of a decision is negative evidence.
--  10. Layers: EVIDENCE (facts) / LEARNING (hypothesis + confidence +
--      evidence_refs, never "fact") / ONTOLOGY (update citing learning deltas).
--      Interpretation keys are rejected in evidence-layer payloads.
--  11. Never Event -> Ontology Update: ONTOLOGY_UPDATED must follow a
--      LEARNING_DELTA_CREATED and name who accepted it (decision_by).
--  12. learning_confidence only on LEARNING_DELTA_CREATED; evidence_strength
--      and learning_confidence never mix.
--  13. Journey completeness is not required: every real path is kept.
--  14. A transfer is a state, not an outcome: OUTCOME_RECORDED cannot follow
--      PATH_TRANSFERRED directly; OWNER_ACKNOWLEDGED / OWNER_DECISION_STARTED
--      prove activation; an unanswered transfer is abandoned by the timer.
--  15. Golden Rule #4: learning_confidence <= mean evidence_strength of the
--      cited evidence-layer events.
--   6. Header: only a one-time organization_id link is allowed.
--
-- Personal data: no names or emails in payload. Owners are roles ("COO").
-- Immutable rows cannot honour GDPR Art. 17 erasure.
--
-- RLS: service_role SELECT+INSERT (emitters). authenticated SELECT on own
-- organization's journeys. anon none.
--
-- Additive only. Reversible by DROP VIEW / DROP TABLE while no data is loaded.

BEGIN;

-- ============================================================
-- decision_journeys
-- ============================================================
CREATE SEQUENCE IF NOT EXISTS public.decision_journey_ref_seq;

CREATE TABLE IF NOT EXISTS public.decision_journeys (
  journey_id       text PRIMARY KEY
                   DEFAULT ('dj_' || lpad(nextval('public.decision_journey_ref_seq')::text, 7, '0'))
                   CHECK (journey_id ~ '^dj_[0-9]{7,}$'),
  title            text NOT NULL CHECK (length(title) BETWEEN 1 AND 200),  -- "Kemira Carbon Case"
  outreach_org_id  uuid REFERENCES public.outreach_orgs(id) ON DELETE RESTRICT,
  organization_id  uuid REFERENCES public.organizations(id) ON DELETE RESTRICT,
  opened_at        timestamptz NOT NULL DEFAULT now(),
  created_by       text NOT NULL,
  CONSTRAINT decision_journeys_subject_required
    CHECK (outreach_org_id IS NOT NULL OR organization_id IS NOT NULL)
);

ALTER SEQUENCE public.decision_journey_ref_seq OWNED BY public.decision_journeys.journey_id;

COMMENT ON TABLE public.decision_journeys IS
  'Decision journey header. Content lives in decision_journey_events. Spec: docs/plans/2026-09-24-decision-journey-outcome-evidence.md';

CREATE INDEX IF NOT EXISTS idx_decision_journeys_outreach_org ON public.decision_journeys(outreach_org_id);
CREATE INDEX IF NOT EXISTS idx_decision_journeys_organization ON public.decision_journeys(organization_id);

-- ============================================================
-- decision_journey_events
-- ============================================================
CREATE TABLE IF NOT EXISTS public.decision_journey_events (
  event_id             text PRIMARY KEY CHECK (event_id ~ '^evt_[0-9A-Za-z]{10,40}$'),  -- emitter-generated ULID
  journey_id           text NOT NULL REFERENCES public.decision_journeys(journey_id) ON DELETE RESTRICT,
  recorded_seq         bigint GENERATED ALWAYS AS IDENTITY UNIQUE,

  occurred_at          timestamptz NOT NULL,              -- when it actually happened
  recorded_at          timestamptz NOT NULL DEFAULT now(),-- when the system stored it

  event_type           text NOT NULL CHECK (event_type IN (
                         'OBSERVATION_RECORDED',
                         'OWNERSHIP_HYPOTHESIS_CREATED',
                         'OWNERSHIP_CONFIRMED',
                         'OWNERSHIP_REJECTED',
                         'PATH_RECOMMENDED',
                         'PATH_ACCEPTED',
                         'PATH_REJECTED',
                         'PATH_DELAYED',
                         'PATH_ESCALATED',
                         'PATH_TRANSFERRED',
                         'OWNER_ACKNOWLEDGED',
                         'OWNER_DECISION_STARTED',
                         'PATH_ABANDONED',
                         'SKU_RECOMMENDED',
                         'SKU_PURCHASED',
                         'WORKSHOP_COMPLETED',
                         'DECISION_IDENTIFIED',
                         'ACTION_STARTED',
                         'ACTION_COMPLETED',
                         'OUTCOME_RECORDED',
                         'LEARNING_DELTA_CREATED',
                         'ONTOLOGY_UPDATED',
                         'EVENT_CORRECTED'
                       )),

  -- Evidence != Interpretation (first epistemic rule, spec §2 P0).
  layer                text GENERATED ALWAYS AS (
                         CASE
                           WHEN event_type = 'LEARNING_DELTA_CREATED' THEN 'LEARNING'
                           WHEN event_type = 'ONTOLOGY_UPDATED'       THEN 'ONTOLOGY'
                           ELSE 'EVIDENCE'
                         END
                       ) STORED,

  industry             text,                              -- ontology_industries.slug
  observation_id       text,                              -- originating observation ref

  -- Who proposed and who decided are different facts; learning sits between them.
  emitted_by_type      text NOT NULL CHECK (emitted_by_type IN ('human', 'ai', 'workflow', 'customer', 'system')),
  emitted_by           text NOT NULL,                     -- industry_captain_ai, customer_portal
  decision_by          text,                              -- customer, COO. NULL = no decision was
                                                          -- made (PATH_ABANDONED), not missing data
  affected_party       text,                              -- customer
  source_system        text NOT NULL,                     -- temporal, stripe, discover

  evidence_quality     text NOT NULL CHECK (evidence_quality IN (
                         'SYSTEM_CONFIRMED', 'WORKSHOP_OUTPUT', 'HUMAN_CONFIRMED',
                         'MANUAL_ENTRY', 'EXTERNAL_SOURCE'
                       )),
  evidence_strength    numeric(4,3) NOT NULL,             -- computed by trigger (spec §3.5)

  ontology_version     text NOT NULL CHECK (ontology_version ~ '^[0-9]+\.[0-9]+\.[0-9]+$'),
  world_model_version  text NOT NULL CHECK (world_model_version ~ '^[0-9]+\.[0-9]+\.[0-9]+$'),

  confidence           numeric(4,3) CHECK (confidence IS NULL OR confidence BETWEEN 0 AND 1),
                                                          -- emitter's estimate at event time
  -- Evidence strength (how well the event is evidenced) and learning
  -- confidence (how sure a hypothesis is) must never mix.
  learning_confidence  numeric(4,3) CHECK (learning_confidence IS NULL OR learning_confidence BETWEEN 0 AND 1),

  payload              jsonb NOT NULL DEFAULT '{}'::jsonb,

  previous_event_id    text REFERENCES public.decision_journey_events(event_id) ON DELETE RESTRICT,
  supersedes_event_id  text REFERENCES public.decision_journey_events(event_id) ON DELETE RESTRICT,
  correlation_id       text,                              -- workflow run id (Temporal), request id

  evidence_refs        text[] NOT NULL DEFAULT '{}',      -- order_442, workshop_report_77, ...

  created_by           text NOT NULL,

  prev_hash            text,                              -- hash of the journey's previous event
  hash                 text NOT NULL,                     -- set by trigger

  CONSTRAINT dje_evidence_required CHECK (
    event_type NOT IN ('PATH_ACCEPTED', 'SKU_PURCHASED', 'WORKSHOP_COMPLETED',
                       'ACTION_COMPLETED', 'OUTCOME_RECORDED', 'PATH_ABANDONED',
                       'LEARNING_DELTA_CREATED', 'ONTOLOGY_UPDATED')
    OR cardinality(evidence_refs) > 0
  ),
  CONSTRAINT dje_decision_by_required CHECK (
    event_type NOT IN ('OWNERSHIP_CONFIRMED', 'OWNERSHIP_REJECTED', 'PATH_ACCEPTED',
                       'PATH_REJECTED', 'PATH_DELAYED', 'PATH_ESCALATED',
                       'PATH_TRANSFERRED', 'SKU_PURCHASED', 'DECISION_IDENTIFIED',
                       'OWNER_ACKNOWLEDGED', 'OWNER_DECISION_STARTED',
                       'ONTOLOGY_UPDATED')   -- an ontology update is ACCEPTED learning
    OR decision_by IS NOT NULL
  ),
  -- Rejected != Abandoned: an abandoned path is defined by the absence of a decision.
  -- PATH_ABANDONED is never user-entered: only the system emits it, and
  -- decision_by NULL means "no decision was ever made", not missing data.
  CONSTRAINT dje_abandoned_system_only CHECK (
    event_type <> 'PATH_ABANDONED'
    OR (decision_by IS NULL AND emitted_by_type = 'system'
        AND evidence_quality = 'SYSTEM_CONFIRMED')
  ),
  -- Evidence layer carries facts only; interpretations live in LEARNING.
  CONSTRAINT dje_evidence_layer_no_interpretation CHECK (
    event_type IN ('LEARNING_DELTA_CREATED', 'ONTOLOGY_UPDATED')
    OR NOT (payload ?| ARRAY['hypothesis', 'interpretation', 'fact'])
  ),
  -- Learning is a hypothesis with confidence and evidence, never a fact.
  CONSTRAINT dje_learning_is_hypothesis CHECK (
    event_type <> 'LEARNING_DELTA_CREATED'
    OR (payload ? 'hypothesis' AND NOT payload ? 'fact')
  ),
  -- learning_confidence exists only on LEARNING_DELTA_CREATED, and is required there.
  CONSTRAINT dje_learning_confidence_only_on_learning CHECK (
    (event_type = 'LEARNING_DELTA_CREATED') = (learning_confidence IS NOT NULL)
  ),
  CONSTRAINT dje_correction_target CHECK (
    (event_type = 'EVENT_CORRECTED') = (supersedes_event_id IS NOT NULL)
  )
);

COMMENT ON TABLE public.decision_journey_events IS
  'Append-only, hash-chained event log of a decision journey. Outcomes are derived from this history, never typed in afterwards.';
COMMENT ON COLUMN public.decision_journey_events.payload IS
  'Shape per event_type — spec §3.3. Owners as roles (COO), never personal names or emails.';

CREATE INDEX IF NOT EXISTS idx_dje_journey_order ON public.decision_journey_events(journey_id, occurred_at, recorded_seq);
CREATE INDEX IF NOT EXISTS idx_dje_type ON public.decision_journey_events(event_type);
CREATE INDEX IF NOT EXISTS idx_dje_previous ON public.decision_journey_events(previous_event_id);
CREATE INDEX IF NOT EXISTS idx_dje_supersedes ON public.decision_journey_events(supersedes_event_id);
CREATE INDEX IF NOT EXISTS idx_dje_correlation ON public.decision_journey_events(correlation_id);
CREATE INDEX IF NOT EXISTS idx_dje_payload ON public.decision_journey_events USING gin (payload);

-- ============================================================
-- Canonical hash (payload + timestamps + versions + actors + evidence)
-- ============================================================
CREATE OR REPLACE FUNCTION public.decision_journey_event_hash(
  p_prev_hash text,
  e public.decision_journey_events
)
RETURNS text
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT pg_catalog.encode(
    pg_catalog.sha256(pg_catalog.convert_to(
      coalesce(p_prev_hash, '') || '|' ||
      pg_catalog.jsonb_build_object(
        'event_id', e.event_id,
        'journey_id', e.journey_id,
        'occurred_at', pg_catalog.timezone('UTC', e.occurred_at),  -- session-TimeZone independent
        'recorded_at', pg_catalog.timezone('UTC', e.recorded_at),  -- session-TimeZone independent
        'event_type', e.event_type,
        'industry', e.industry,
        'observation_id', e.observation_id,
        'emitted_by_type', e.emitted_by_type,
        'emitted_by', e.emitted_by,
        'decision_by', e.decision_by,
        'affected_party', e.affected_party,
        'source_system', e.source_system,
        'evidence_quality', e.evidence_quality,
        'evidence_strength', e.evidence_strength,
        'ontology_version', e.ontology_version,
        'world_model_version', e.world_model_version,
        'confidence', e.confidence,
        'learning_confidence', e.learning_confidence,
        'payload', e.payload,
        'previous_event_id', e.previous_event_id,
        'supersedes_event_id', e.supersedes_event_id,
        'correlation_id', e.correlation_id,
        'evidence_refs', e.evidence_refs,
        'created_by', e.created_by
      )::text,
      'UTF8'
    )),
    'hex'
  );
$$;

-- ============================================================
-- Evidence strength = quality weight x capture-lag factor (spec §3.5).
-- Weights are v1 proposals; calibration is an open HIC question.
-- ============================================================
CREATE OR REPLACE FUNCTION public.decision_journey_evidence_strength(
  p_quality text,
  p_lag interval
)
RETURNS numeric
LANGUAGE sql
IMMUTABLE
SET search_path = ''
AS $$
  SELECT round(
    (CASE p_quality
       WHEN 'SYSTEM_CONFIRMED' THEN 0.99   -- order signed, payment, contract
       WHEN 'WORKSHOP_OUTPUT'  THEN 0.85   -- workshop output
       WHEN 'HUMAN_CONFIRMED'  THEN 0.80   -- portal decision by the decider
       WHEN 'EXTERNAL_SOURCE'  THEN 0.60   -- registry, public filing (v1 proposal)
       WHEN 'MANUAL_ENTRY'     THEN 0.40   -- manual note
     END)
    *
    (CASE
       WHEN p_lag <= interval '5 minutes' THEN 1.00
       WHEN p_lag <= interval '1 day'     THEN 0.90
       WHEN p_lag <= interval '7 days'    THEN 0.70
       WHEN p_lag <= interval '30 days'   THEN 0.50
       ELSE 0.30
     END)
  , 3);
$$;

-- ============================================================
-- Integrity triggers
-- ============================================================
CREATE OR REPLACE FUNCTION public.decision_journey_events_guard_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  v_refs     integer;
  v_strength numeric;
BEGIN
  IF NEW.occurred_at > now() + interval '5 minutes' THEN
    RAISE EXCEPTION 'decision_journey_events: occurred_at % is in the future', NEW.occurred_at;
  END IF;

  IF NEW.previous_event_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.decision_journey_events e
    WHERE e.event_id = NEW.previous_event_id AND e.journey_id = NEW.journey_id
  ) THEN
    RAISE EXCEPTION 'decision_journey_events: previous_event_id must be in the same journey';
  END IF;

  IF NEW.supersedes_event_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM public.decision_journey_events e
    WHERE e.event_id = NEW.supersedes_event_id AND e.journey_id = NEW.journey_id
  ) THEN
    RAISE EXCEPTION 'decision_journey_events: supersedes_event_id must be in the same journey';
  END IF;

  -- Never Event -> Ontology Update: an update must follow a learning delta.
  IF NEW.event_type = 'ONTOLOGY_UPDATED' AND NOT EXISTS (
    SELECT 1 FROM public.decision_journey_events e
    WHERE e.event_id = NEW.previous_event_id
      AND e.event_type = 'LEARNING_DELTA_CREATED'
  ) THEN
    RAISE EXCEPTION 'decision_journey_events: ONTOLOGY_UPDATED must have a LEARNING_DELTA_CREATED as previous_event_id';
  END IF;

  -- A transfer is a new state, not an outcome: prove activation first.
  IF NEW.event_type = 'OUTCOME_RECORDED' AND EXISTS (
    SELECT 1 FROM public.decision_journey_events e
    WHERE e.event_id = NEW.previous_event_id
      AND e.event_type = 'PATH_TRANSFERRED'
  ) THEN
    RAISE EXCEPTION 'decision_journey_events: PATH_TRANSFERRED is not an outcome; emit OWNER_ACKNOWLEDGED / OWNER_DECISION_STARTED first';
  END IF;

  -- Golden Rule #4: learning_confidence <= mean evidence_strength of the
  -- cited events. Weak evidence cannot produce confident learning.
  IF NEW.event_type = 'LEARNING_DELTA_CREATED' THEN
    SELECT count(*), avg(e.evidence_strength) INTO v_refs, v_strength
    FROM public.decision_journey_events e
    WHERE e.event_id = ANY (NEW.evidence_refs)
      AND e.journey_id = NEW.journey_id
      AND e.layer = 'EVIDENCE';
    IF v_refs <> cardinality(NEW.evidence_refs) THEN
      RAISE EXCEPTION 'decision_journey_events: learning evidence_refs must all be evidence-layer event_ids in this journey';
    END IF;
    IF NEW.learning_confidence > round(v_strength, 3) THEN
      RAISE EXCEPTION 'decision_journey_events: learning_confidence % exceeds cited evidence strength %',
        NEW.learning_confidence, round(v_strength, 3);
    END IF;
  END IF;

  NEW.recorded_at := now();

  NEW.evidence_strength := public.decision_journey_evidence_strength(
    NEW.evidence_quality, NEW.recorded_at - NEW.occurred_at);

  -- Serialise inserts per journey so the hash chain has one predecessor.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtext(NEW.journey_id));

  SELECT e.hash INTO NEW.prev_hash
  FROM public.decision_journey_events e
  WHERE e.journey_id = NEW.journey_id
  ORDER BY e.recorded_seq DESC
  LIMIT 1;

  NEW.hash := public.decision_journey_event_hash(NEW.prev_hash, NEW);

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.decision_journey_events_block_mutation()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  RAISE EXCEPTION 'decision_journey_events is append-only (%). Insert an EVENT_CORRECTED event instead.', TG_OP;
END;
$$;

CREATE OR REPLACE FUNCTION public.decision_journeys_guard_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'decision_journeys rows cannot be deleted';
  END IF;
  -- Only allowed change: link organization_id once (prospect -> customer).
  IF OLD.organization_id IS NULL
     AND NEW.organization_id IS NOT NULL
     AND NEW.journey_id = OLD.journey_id
     AND NEW.title = OLD.title
     AND NEW.outreach_org_id IS NOT DISTINCT FROM OLD.outreach_org_id
     AND NEW.opened_at = OLD.opened_at
     AND NEW.created_by = OLD.created_by THEN
    RETURN NEW;
  END IF;
  RAISE EXCEPTION 'decision_journeys: only a one-time organization_id link is allowed';
END;
$$;

DROP TRIGGER IF EXISTS trg_dje_guard_insert ON public.decision_journey_events;
CREATE TRIGGER trg_dje_guard_insert
  BEFORE INSERT ON public.decision_journey_events
  FOR EACH ROW EXECUTE FUNCTION public.decision_journey_events_guard_insert();

DROP TRIGGER IF EXISTS trg_dje_block_update_delete ON public.decision_journey_events;
CREATE TRIGGER trg_dje_block_update_delete
  BEFORE UPDATE OR DELETE ON public.decision_journey_events
  FOR EACH ROW EXECUTE FUNCTION public.decision_journey_events_block_mutation();

DROP TRIGGER IF EXISTS trg_dje_block_truncate ON public.decision_journey_events;
CREATE TRIGGER trg_dje_block_truncate
  BEFORE TRUNCATE ON public.decision_journey_events
  FOR EACH STATEMENT EXECUTE FUNCTION public.decision_journey_events_block_mutation();

DROP TRIGGER IF EXISTS trg_dj_guard_update ON public.decision_journeys;
CREATE TRIGGER trg_dj_guard_update
  BEFORE UPDATE OR DELETE ON public.decision_journeys
  FOR EACH ROW EXECUTE FUNCTION public.decision_journeys_guard_update();

-- ============================================================
-- Chain verification (Article 12 record integrity)
-- Recomputes every hash in recorded order. Returns one row per event whose
-- stored prev_hash or hash does not match the recomputation. Empty = intact.
-- Detects a payload rewritten with triggers disabled; external anchoring of
-- the head hash (spec §3.6) is needed to detect a full-chain recompute.
-- ============================================================
CREATE OR REPLACE FUNCTION public.decision_journey_verify_chain(p_journey_id text)
RETURNS TABLE (event_id text, recorded_seq bigint, problem text)
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  r public.decision_journey_events;
  expected_prev text := NULL;
BEGIN
  FOR r IN
    SELECT * FROM public.decision_journey_events e
    WHERE e.journey_id = p_journey_id
    ORDER BY e.recorded_seq
  LOOP
    IF r.prev_hash IS DISTINCT FROM expected_prev THEN
      event_id := r.event_id; recorded_seq := r.recorded_seq; problem := 'prev_hash mismatch';
      RETURN NEXT;
    END IF;
    IF r.hash IS DISTINCT FROM public.decision_journey_event_hash(r.prev_hash, r) THEN
      event_id := r.event_id; recorded_seq := r.recorded_seq; problem := 'content hash mismatch';
      RETURN NEXT;
    END IF;
    expected_prev := r.hash;
  END LOOP;
END;
$$;

-- ============================================================
-- Timeline view (security_invoker: caller's RLS applies)
-- ============================================================
CREATE OR REPLACE VIEW public.decision_journey_timeline
WITH (security_invoker = true) AS
SELECT
  j.journey_id,
  j.title,
  j.organization_id,
  j.outreach_org_id,
  e.recorded_seq,
  e.event_id,
  e.event_type,
  e.layer,
  e.industry,
  e.observation_id,
  e.emitted_by_type,
  e.emitted_by,
  e.decision_by,
  e.affected_party,
  e.source_system,
  e.evidence_quality,
  e.evidence_strength,
  e.ontology_version,
  e.world_model_version,
  e.confidence,
  e.learning_confidence,
  e.payload,
  e.previous_event_id,
  e.supersedes_event_id,
  EXISTS (
    SELECT 1 FROM public.decision_journey_events c
    WHERE c.supersedes_event_id = e.event_id
  )                               AS is_superseded,
  e.correlation_id,
  e.evidence_refs,
  e.occurred_at,
  e.recorded_at,
  e.recorded_at - e.occurred_at   AS capture_lag,
  (e.recorded_at - e.occurred_at) > interval '7 days' AS is_after_the_fact,
  e.hash
FROM public.decision_journeys j
JOIN public.decision_journey_events e ON e.journey_id = j.journey_id;

COMMENT ON VIEW public.decision_journey_timeline IS
  'Ordered decision chain. ORDER BY journey_id, occurred_at, recorded_seq.';

-- ============================================================
-- Real decision paths (LD-2026-09-24)
-- The unit of the Active Ontology is the real path, not the successful one.
-- One row per terminal live event (no live successor), walked back along
-- previous_event_id. A path ending at PATH_REJECTED with no outcome is a
-- valid path. is_verified marks the full
--   observation -> ownership confirmed -> decision -> action -> outcome chain.
-- ============================================================
CREATE OR REPLACE VIEW public.decision_journey_paths
WITH (security_invoker = true) AS
WITH RECURSIVE live AS (
  SELECT e.* FROM public.decision_journey_events e
  WHERE NOT EXISTS (
    SELECT 1 FROM public.decision_journey_events c WHERE c.supersedes_event_id = e.event_id
  )
),
terminal AS (
  SELECT l.* FROM live l
  WHERE l.event_type <> 'EVENT_CORRECTED'
    AND NOT EXISTS (SELECT 1 FROM live n WHERE n.previous_event_id = l.event_id)
),
chain AS (
  SELECT t.event_id AS terminal_event_id, t.event_type AS terminal_event_type,
         t.journey_id, t.event_id, t.event_type, t.previous_event_id,
         t.ontology_version, t.world_model_version, t.evidence_strength, 1 AS depth
  FROM terminal t
  UNION ALL
  SELECT ch.terminal_event_id, ch.terminal_event_type,
         ch.journey_id, p.event_id, p.event_type, p.previous_event_id,
         p.ontology_version, p.world_model_version, p.evidence_strength, ch.depth + 1
  FROM chain ch
  JOIN live p ON p.event_id = ch.previous_event_id
  WHERE ch.depth < 256
)
SELECT
  ch.journey_id,
  ch.terminal_event_id,
  ch.terminal_event_type,
  count(*)                                                        AS chain_length,
  array_agg(ch.event_id   ORDER BY ch.depth DESC)                 AS event_ids,
  array_agg(ch.event_type ORDER BY ch.depth DESC)                 AS event_types,
  array_agg(DISTINCT ch.ontology_version)                         AS ontology_versions,
  array_agg(DISTINCT ch.world_model_version)                      AS world_model_versions,
  min(ch.evidence_strength)                                       AS weakest_evidence,
  bool_or(ch.event_type = 'OBSERVATION_RECORDED' AND ch.previous_event_id IS NULL) AS has_observation_root,
  bool_or(ch.event_type = 'OWNERSHIP_CONFIRMED')                  AS has_ownership,
  bool_or(ch.event_type IN ('PATH_ACCEPTED', 'SKU_PURCHASED'))    AS has_decision_accepted,
  bool_or(ch.event_type IN ('PATH_REJECTED', 'OWNERSHIP_REJECTED')) AS has_rejection,
  bool_or(ch.event_type = 'PATH_ABANDONED')                       AS has_abandonment,
  CASE ch.terminal_event_type
    WHEN 'PATH_ABANDONED'   THEN 'UNDECIDED'
    WHEN 'PATH_REJECTED'    THEN 'REJECTED'
    WHEN 'PATH_DELAYED'     THEN 'DELAYED'
    WHEN 'PATH_TRANSFERRED' THEN 'TRANSFER_PENDING'   -- sent, not yet activated
    WHEN 'OWNER_ACKNOWLEDGED'     THEN 'OWNER_ACKNOWLEDGED'
    WHEN 'OWNER_DECISION_STARTED' THEN 'OWNER_DECIDING'
    WHEN 'PATH_ESCALATED'   THEN 'ESCALATED'
    WHEN 'PATH_ACCEPTED'    THEN 'ACCEPTED'
    WHEN 'SKU_PURCHASED'    THEN 'ACCEPTED'
    WHEN 'OUTCOME_RECORDED' THEN 'OUTCOME'
    ELSE 'OPEN'
  END                                                             AS decision_state,
  bool_or(ch.event_type IN ('ACTION_STARTED', 'ACTION_COMPLETED', 'WORKSHOP_COMPLETED')) AS has_action,
  bool_or(ch.event_type = 'OUTCOME_RECORDED')                     AS has_outcome,
  (    bool_or(ch.event_type = 'OBSERVATION_RECORDED' AND ch.previous_event_id IS NULL)
   AND bool_or(ch.event_type = 'OWNERSHIP_CONFIRMED')
   AND bool_or(ch.event_type IN ('PATH_ACCEPTED', 'SKU_PURCHASED'))
   AND bool_or(ch.event_type IN ('ACTION_STARTED', 'ACTION_COMPLETED', 'WORKSHOP_COMPLETED'))
   AND ch.terminal_event_type = 'OUTCOME_RECORDED')               AS is_verified
FROM chain ch
GROUP BY ch.journey_id, ch.terminal_event_id, ch.terminal_event_type;

COMMENT ON VIEW public.decision_journey_paths IS
  'Every real decision path, one row per terminal event. Rejected, abandoned and delayed paths are evidence, not lost leads. is_verified = observation -> ownership -> decision -> action -> outcome.';

-- ============================================================
-- Abandonment emitter (negative evidence, spec §3.2)
-- A PATH_RECOMMENDED / SKU_RECOMMENDED / PATH_TRANSFERRED event with no
-- successor after the
-- window, and no accept / reject / purchase later in the journey, gets a
-- system PATH_ABANDONED. occurred_at = the moment the window lapsed.
-- Versions are copied from the recommendation (the model that made it).
-- Idempotent: an abandoned recommendation has a successor and is skipped.
-- Schedule with pg_cron (daily) when the migration is applied.
-- ============================================================
CREATE OR REPLACE FUNCTION public.decision_journey_emit_abandonments(
  p_window interval DEFAULT interval '30 days'
)
RETURNS integer
LANGUAGE plpgsql
SET search_path = ''
AS $$
DECLARE
  n integer;
BEGIN
  INSERT INTO public.decision_journey_events (
    event_id, journey_id, occurred_at, event_type, industry, observation_id,
    emitted_by_type, emitted_by, decision_by, affected_party, source_system,
    evidence_quality, evidence_strength, ontology_version, world_model_version,
    payload, previous_event_id, correlation_id, evidence_refs, created_by, hash
  )
  SELECT
    'evt_' || pg_catalog.replace(pg_catalog.gen_random_uuid()::text, '-', ''),
    r.journey_id,
    r.occurred_at + p_window,
    'PATH_ABANDONED',
    r.industry,
    r.observation_id,
    'system',
    'abandonment_timer',
    NULL,
    r.affected_party,
    'postgres',
    'SYSTEM_CONFIRMED',
    0,                      -- recomputed by trigger
    r.ontology_version,
    r.world_model_version,
    pg_catalog.jsonb_build_object(
      'days_without_decision', pg_catalog.date_part('day', p_window),
      'recommendation_event_id', r.event_id
    ),
    r.event_id,
    r.correlation_id,
    ARRAY[r.event_id],
    'decision_journey_emit_abandonments',
    ''                      -- set by trigger
  FROM public.decision_journey_events r
  WHERE r.event_type IN ('PATH_RECOMMENDED', 'SKU_RECOMMENDED', 'PATH_TRANSFERRED')
    AND r.occurred_at + p_window <= now()
    AND NOT EXISTS (
      SELECT 1 FROM public.decision_journey_events n1
      WHERE n1.previous_event_id = r.event_id
    )
    AND NOT EXISTS (
      SELECT 1 FROM public.decision_journey_events d
      WHERE d.journey_id = r.journey_id
        AND d.recorded_seq > r.recorded_seq
        AND d.event_type IN ('PATH_ACCEPTED', 'PATH_REJECTED', 'SKU_PURCHASED',
                             'PATH_DELAYED', 'PATH_TRANSFERRED', 'PATH_ESCALATED',
                             'OWNER_ACKNOWLEDGED', 'OWNER_DECISION_STARTED')
    );
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n;
END;
$$;

-- ============================================================
-- Active Ontology KPIs — "How is Lifetime performing?" in evidence terms
-- (observations, ownership, journeys, real paths, learning, ontology),
-- not revenue / visitors / orders.
-- ============================================================
CREATE OR REPLACE VIEW public.active_ontology_kpis
WITH (security_invoker = true) AS
SELECT
  (SELECT count(*) FROM public.decision_journey_events WHERE event_type = 'OBSERVATION_RECORDED') AS observations,
  (SELECT count(*) FROM public.decision_journey_events WHERE event_type = 'OWNERSHIP_HYPOTHESIS_CREATED') AS ownership_hypotheses,
  (SELECT count(*) FROM public.decision_journey_events WHERE event_type = 'OWNERSHIP_CONFIRMED') AS ownership_confirmed,
  (SELECT count(*) FROM public.decision_journeys) AS decision_journeys,
  (SELECT count(*) FROM public.decision_journey_paths) AS real_paths,
  (SELECT count(*) FROM public.decision_journey_paths WHERE decision_state = 'UNDECIDED') AS paths_undecided,
  (SELECT count(*) FROM public.decision_journey_paths WHERE decision_state = 'REJECTED') AS paths_rejected,
  (SELECT count(*) FROM public.decision_journey_paths WHERE decision_state IN ('ACCEPTED', 'OUTCOME')) AS paths_accepted_or_outcome,
  (SELECT count(*) FROM public.decision_journey_paths WHERE is_verified) AS verified_paths,
  (SELECT count(*) FROM public.decision_journey_events WHERE event_type = 'OUTCOME_RECORDED') AS outcomes,
  (SELECT count(*) FROM public.decision_journey_events WHERE event_type = 'PATH_TRANSFERRED') AS transfers,
  -- Transfer Activation Rate: transfers followed by OWNER_DECISION_STARTED.
  -- A transfer the owner never reacts to was a dispatch, not a success.
  (SELECT round(
     count(*) FILTER (WHERE EXISTS (
       SELECT 1 FROM public.decision_journey_events d
       WHERE d.journey_id = t.journey_id AND d.recorded_seq > t.recorded_seq
         AND d.event_type = 'OWNER_DECISION_STARTED'))::numeric
     / nullif(count(*), 0), 3)
   FROM public.decision_journey_events t WHERE t.event_type = 'PATH_TRANSFERRED') AS transfer_activation_rate,
  (SELECT count(*) FROM public.decision_journey_events WHERE layer = 'LEARNING') AS learning_deltas,
  (SELECT count(*) FROM public.decision_journey_events WHERE layer = 'ONTOLOGY') AS ontology_updates;

COMMENT ON VIEW public.active_ontology_kpis IS
  'Active Ontology performance in evidence terms. verified_paths is the asset count.';

-- ============================================================
-- Grants (standard block, Firehorse/supabase-schema-templates.sql) + RLS
-- No UPDATE/DELETE grants on the event log for any role.
-- ============================================================
REVOKE ALL ON public.decision_journeys, public.decision_journey_events FROM anon;
REVOKE ALL ON public.decision_journey_timeline, public.decision_journey_paths FROM anon;

GRANT SELECT, INSERT ON public.decision_journeys TO service_role;
GRANT UPDATE (organization_id) ON public.decision_journeys TO service_role;
GRANT USAGE ON SEQUENCE public.decision_journey_ref_seq TO service_role;
GRANT SELECT, INSERT ON public.decision_journey_events TO service_role;

GRANT SELECT ON public.decision_journeys TO authenticated;
GRANT SELECT ON public.decision_journey_events TO authenticated;

REVOKE ALL ON FUNCTION public.decision_journey_verify_chain(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decision_journey_verify_chain(text) TO service_role;
REVOKE ALL ON FUNCTION public.decision_journey_emit_abandonments(interval) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.decision_journey_emit_abandonments(interval) TO service_role;
REVOKE ALL ON public.active_ontology_kpis FROM anon, authenticated;
GRANT SELECT ON public.active_ontology_kpis TO service_role;

GRANT SELECT ON public.decision_journey_timeline, public.decision_journey_paths
  TO service_role, authenticated;

ALTER TABLE public.decision_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_journey_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS decision_journeys_member_select ON public.decision_journeys;
CREATE POLICY decision_journeys_member_select ON public.decision_journeys
  FOR SELECT TO authenticated
  USING (
    organization_id IN (
      SELECT m.organization_id FROM public.organization_members m
      WHERE m.user_id = (SELECT auth.uid()) AND m.status = 'active'
    )
  );

DROP POLICY IF EXISTS decision_journey_events_member_select ON public.decision_journey_events;
CREATE POLICY decision_journey_events_member_select ON public.decision_journey_events
  FOR SELECT TO authenticated
  USING (
    journey_id IN (
      SELECT j.journey_id FROM public.decision_journeys j
      JOIN public.organization_members m ON m.organization_id = j.organization_id
      WHERE m.user_id = (SELECT auth.uid()) AND m.status = 'active'
    )
  );

DROP POLICY IF EXISTS decision_journeys_service_all ON public.decision_journeys;
CREATE POLICY decision_journeys_service_all ON public.decision_journeys
  FOR ALL TO service_role USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS decision_journey_events_service_all ON public.decision_journey_events;
CREATE POLICY decision_journey_events_service_all ON public.decision_journey_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

COMMIT;

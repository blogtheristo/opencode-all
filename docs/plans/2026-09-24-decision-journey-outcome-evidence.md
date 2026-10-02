# Specification: Decision Journey — Event-First Outcome Evidence for Workflow V2 and the Active Ontology

---

VERSION AND AGENT HISTORY

- Version: 2.0
- Status: DRAFT — awaiting HIC review
- Classification: INTERNAL
- Document type: Specification
- Author: Claude Code (standby runtime) + risto.paarni2024@lifetime.fi
- Date: 2026-09-24
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/blissful-davinci-8782wy

Sessions & Modifications:

- Version: 2.0 [Latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC technical acceptance of the Active Ontology 1.5 foundation (§9.6); roadmap P0–P5 with P2 = First Ownership Discovery; realistic ownership path recorded.
- Version: 1.9 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC decision 7: final migration numbering (089–091 website_observations chain unchanged, 092 Decision Journey Foundation, 093 DISCOVER → Decision Journey bridge split out of 092), bridge adds the "transfer recommended" step, M1 acceptance criterion met in test, Pages Function keeps the ownership verdict. Deferred items listed. Verification 32 + 18 = 50/50.
- Version: 1.8 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC decisions 1–6 recorded (§9.3). Migration renamed 089 → 092 (duplicate number). DISCOVER → Decision Journey coupling at M1 scope only (import function + owner response function). World Understood = Coverage; Verified Decision Journeys is a separate milestone card. 05:00 dashboard deferred until M1. Priorities P0–P6 with M1 first. Oura recorded as an ontological test, Kemira as the multi-organisation test. Verification 42/42.
- Version: 1.7 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC review recorded: locked design decisions (§9.1), approved hash field set, rollout order and runbook (§9.2), priority P0–P5 supersedes the P1–P4 table (kept, marked superseded), Shadow Journeys Recorded as the current primary metric (`shadow_journeys_recorded`), Shadow Learning Score in the backlog. Verification now 32/32.
- Version: 1.6 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC decisions recorded: release principle of Active Ontology 1.5, priority order P1–P4, no new features until the 1.5 foundation is green; Active Ontology 1.6 Candidate dashboard added to the backlog (not built).
- Version: 1.5 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Implements HIC brief **Active Ontology 1.5 – Decision Flight Recorder** (`docs/plans/2026-09-24-active-ontology-1.5-decision-flight-recorder-brief.md`). Tables renamed `decision_journey_event` / `decision_journey`; OBSERVATION_CORRECTED; `affected_party` required; learning confidence bound changed from mean to **minimum**; `recorded_at` removed from the hash; Verified Decision Journey redefined (… → learning delta → ontology update, external organisation); Observation Count + Decision Traceability Coverage pair; Transfer Activation Rate moved out of performance KPIs; build phases (§9).
- Version: 1.4 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Flight-recorder positioning and accountable-owner buyer (§2.1); transfer is a state, not an outcome (OWNER_ACKNOWLEDGED, OWNER_DECISION_STARTED, Transfer Activation Rate); Golden Rule #4 enforced (learning_confidence ≤ mean cited evidence strength); Decision Traceability query.
- Version: 1.3 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Active Ontology Golden Rules #1–#3 (§2.0); `learning_confidence` separate from `evidence_strength`; evidence_quality enum per HIC (WORKSHOP_OUTPUT, EXTERNAL_SOURCE); ONTOLOGY_UPDATED must follow a LEARNING_DELTA_CREATED and name its approver; transfer verdict mapped to PATH_TRANSFERRED; LD refined to "verified event chains and their later outcomes".
- Version: 1.2 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Added the first epistemic rule Evidence ≠ Interpretation (P0) with three layers enforced in the schema; PATH_ABANDONED is system-emitted only (`decision_journey_emit_abandonments`), payload factual; Active Ontology KPIs (§6.1) with an honest current-state baseline.
- Version: 1.1 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Rebuilt event-first from four further HIC messages (same day) on Boardy's review: HIC field list, UPPER_CASE event types, ontology + world model version per event, three actors (emitted_by / decision_by / affected_party), evidence_quality + computed evidence_strength, payload inside the hash chain, real paths instead of successful paths, negative evidence (PATH_ABANDONED, decision_by NULL = no decision). Principles §2 preserved verbatim.
- Version: 1.0 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Initial specification (outcome evidence, verified decision paths).

Related Documents:

- `supabase/migrations/094_240926_decision_journey.sql` — the schema (authored, not applied)
- `docs/field-notes/2026-09-24-outcome-evidence-decision-journey.md` — session learning outcome
- `docs/plans/2026-07-02-firehorse-ontology-upsell-chain.md` — ontology product framing
- `DWS_TRUTH_STANDARD.md` row 29 — MGD / CRC: a governed decision needs reasoning lineage; this schema supplies it
- `dws10.com/config/products.json` — product ids in payloads (`ai-consultant-day` = Captain Day, `DWS-CLIMATE-001` = Climate Intelligence); never prices

---

## 1. Problem

Boardy: _outcome capture only works if someone actually records it._ CRMs fail because they ask a person, months later, "what happened?"

> Jos DWS IQ joutuu kysymään myöhemmin: _Mitä tapahtui?_ — järjestelmä on jo epäonnistunut.
> Outcome pitäisi syntyä osana työnkulkua. Jokainen vaihe on tapahtuma. Ei raportoitava muistikuva.

Design answer: **event-first, not CRM-first.** Store events, never state. Outcome Evidence, not Outcome Capture.

> DWS IQ:n vahvuus ei ole _usko meitä_ vaan _näytä minulle_.

## 2. Principles (HIC formulations, preserved verbatim — candidates for a standard)

### 2.0 Strategy sentence (HIC, verbatim)

> Active Ontology ei tallenna asiakkuuksia.
> Active Ontology tallentaa päätöksenteon historiaa.
> Jokainen tapahtuma on append-only, jokainen oppiminen perustuu evidenssiin, ja jokainen ontologian päivitys voidaan jäljittää siihen päätöspolkuun, josta oppiminen syntyi.

### 2.1 Flight recorder, not CRM — and who buys it

A CRM asks _"what happened?"_ afterwards. A flight recorder stores _what happened_ when it happens. The buyer is therefore not Sales Ops but the person who carries the responsibility and must answer _"how did we arrive at this decision?"_: COO, CIO, risk owner, compliance owner, board. The asset is **Decision Traceability**, not the outcome alone: a year from now the most valuable question is not _"what did we sell?"_ but, for example, _"show every case where ownership was unclear, the matter was transferred to the owner, the owner reacted within 30 days and a project started later."_ CRM, ERP, BI and competitors do not know this (§6).

Append-only is a structural rule, not a convention: `UPDATE decision_journey_event` never happens. A wrong observation is corrected by a new `OBSERVATION_CORRECTED` event, any other event by `EVENT_CORRECTED` (HIC: _Observation Corrected_); the original remains.

### 2.2 Active Ontology Golden Rules

**Golden Rule #1**

> Suositus ei ole tieto.
> Päätös on tieto.
> Lopputulos on evidenssi.
> Oppiminen on evidenssin tulkinta.
> Ontologian päivitys on hyväksytty oppiminen.

Chain: Event → Evidence → Learning Delta → Ontology Update. **Never Event → Ontology Update**, because then the ontology starts believing its own guesses. Enforced: `ONTOLOGY_UPDATED` must have a `LEARNING_DELTA_CREATED` as `previous_event_id` and must name who accepted it (`decision_by`).

**Golden Rule #2** — Accepted, Rejected, Abandoned, Transferred and Purchased are all equally valuable. Even _Recommended → Abandoned_ is a valid decision path: not a failure, but evidence.

**Golden Rule #3** — Journey completeness is not a requirement. _Observation → Outcome_ is good; _Observation → Recommendation → Abandoned_ is also good, because that is what the real world looks like. `decision_journey_paths` keeps every path; `is_verified` is a weight, not a filter.

**Refined learning statement (HIC):** the Active Ontology learns from verified event chains and their later outcomes — not only from verified decision paths. The COO case (_Captain Day → ignored → 60 days → COO meeting → Climate Intelligence → purchased_) is what a CRM loses and this model keeps. The model is closer to a **decision flight recorder** than a CRM.

**Golden Rule #4 — learning cannot be stronger than its weakest evidence** (brief 1.5 §7). `learning_confidence ≤ minimum(evidence_strength)` of the cited evidence-layer events. Not a weighted average, no exceptions. Evidence 0.95 / 0.81 / 0.43 → learning at most 0.43. The weakest evidence bounds the strength of the claim: auditable, simple, honest. Enforced by the insert trigger, which also requires every `evidence_refs` entry of a learning delta to be an evidence-layer event in the same journey. (v1.4 used the mean; the brief replaced it.)

**Operational instance — transfer verdict:** DISCOVER returning _"I will take this to the right owner"_ is recorded as `PATH_TRANSFERRED` (`decision_by` = the person transferring, `payload.transferred_to_owner` = role), followed by a measurable outcome. DISCOVER optimises the next right decision, not the product sale.

**Transfer is a new state, not an outcome** (Boardy: _how do we know the transfer worked?_). `transferred_to_owner → DONE` has no evidence. The chain is `PATH_TRANSFERRED → OWNER_ACKNOWLEDGED → OWNER_DECISION_STARTED → …`, with `decision_by` = the owner's role on both owner events. Enforced: `OUTCOME_RECORDED` cannot directly follow `PATH_TRANSFERRED`; an unanswered transfer is abandoned by the system timer like an unanswered recommendation. Metrics: **Transfer Rate** (how many were transferred) and, more importantly, **Transfer Activation Rate** (share of transfers followed by `OWNER_DECISION_STARTED`). A transfer the owner never reacts to was a dispatch, not a success.

**P0 — First epistemic rule: Event ≠ Learning, Evidence ≠ Interpretation**

`PATH_ABANDONED`, `occurred_at 2026-10-24`, `decision_by null` is a fact. _"Suositus ei ollut vakuuttava"_, _"Väärä henkilö näki suosituksen"_, _"Ajankohta oli väärä"_ are interpretations. They are never stored in the same layer:

| Layer      | Events                                                                                                                     | Content                                                    |
| ---------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1 Evidence | OBSERVATION_RECORDED, PATH_RECOMMENDED, PATH_ACCEPTED, PATH_REJECTED, PATH_ABANDONED, SKU_PURCHASED, WORKSHOP_COMPLETED, … | Facts only                                                 |
| 2 Learning | LEARNING_DELTA_CREATED                                                                                                     | `hypothesis`, `confidence`, `evidence_refs` — never `fact` |
| 3 Ontology | ONTOLOGY_UPDATED                                                                                                           | Only here does a hypothesis become world model             |

Enforced in the database: the generated column `layer`; `learning_confidence` exists only on `LEARNING_DELTA_CREATED` (so evidence strength and learning confidence never mix); evidence-layer payloads reject the keys `hypothesis`, `interpretation`, `fact`; a learning delta requires `payload.hypothesis`, `learning_confidence` and `evidence_refs`, and rejects `fact`; an ontology update requires `evidence_refs`.

**P1 — What counts as knowledge**

> Suositus ei ole tieto. Päätös on tieto. Lopputulos on evidenssi. Oppiminen syntyy niiden välisestä erosta.
> Päätöksen puuttuminen on myös tieto.

**P2 — The unit is the real path, not the successful one** (Active Ontology 1.4 principle)

> Active Ontology ei kerää onnistumisia. Active Ontology kerää päätöspolkuja.
> Hyväksytty, hylätty, unohdettu, siirretty ja keskeytynyt polku ovat kaikki evidenssiä.
> Silloin ontologia ei opi _mitä suosittelimme_. Se oppii _mitä ihmiset oikeasti tekivät_.

Standard sentence (Boardy): _A journey that ends at PATH_REJECTED with no outcome is still a valid journey._

**P3 — Negative evidence** (Boardy: _the most valuable record you'll have is the one nobody wants to log_)

Normal CRM stores _seen, clicked, bought_. The Active Ontology also stores _recommended, not accepted, not viewed, not handled, forgotten, died_ — because learning happens there.

**P4 — Where the asset starts**

> Ensimmäinen ownership finding ei tee ontologiasta assettia. Ensimmäinen todennettu päätöspolku tekee siitä assetin.

The asset is not 137 products, 256 product paths or 1,000 observations, but 1,000 real, evidenced decision paths — including those that never led to a sale. A competitor cannot generate, copy or buy that.

**P5 — Every event carries its interpreter**

"Why was Recommendation A given?" is answered not with _"the ontology said so"_ but with _"on 24.09.2026, World Model 1.2 interpreted the observation this way."_

## 3. Data model

| Object                                      | Role                                                                                                                                 |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `decision_journey`                          | Header: `journey_id` (`dj_0001842`), `title` ("Kemira Carbon Case"), subject (`outreach_orgs` prospect or `organizations` customer). |
| `decision_journey_event`                    | Append-only, hash-chained events.                                                                                                    |
| `decision_journey_timeline`                 | Ordered chain with `capture_lag`, `is_after_the_fact`, `is_superseded`.                                                              |
| `decision_journey_paths`                    | One row per real path (terminal event), with `decision_state` and `is_verified`.                                                     |
| `decision_journey_verify_chain(journey_id)` | Recomputes the hash chain; empty result = intact.                                                                                    |

### 3.1 Event fields (HIC list)

`event_id` (`evt_<ULID>`), `journey_id`, `occurred_at` (when it happened), `recorded_at` (when stored; set by the database), `event_type`, `industry`, `observation_id`, `emitted_by_type`, `emitted_by`, `decision_by`, `affected_party`, `source_system`, `ontology_version`, `world_model_version` (both semver, **per event**), `confidence` (0–1 at event time), `payload`, `previous_event_id`, `correlation_id` (Temporal run id), `evidence_refs` (`order_442`, `workshop_report_77`, …), `created_by`, `hash`.

### 3.2 Event types

`OBSERVATION_RECORDED`, `OWNERSHIP_HYPOTHESIS_CREATED`, `OWNERSHIP_CONFIRMED`, `OWNERSHIP_REJECTED`, `PATH_RECOMMENDED`, `PATH_ACCEPTED`, `PATH_REJECTED`, `PATH_ABANDONED`, `PATH_DELAYED`, `PATH_ESCALATED`, `PATH_TRANSFERRED`, `OWNER_ACKNOWLEDGED`, `OWNER_DECISION_STARTED`, `SKU_RECOMMENDED`, `SKU_PURCHASED`, `WORKSHOP_COMPLETED`, `DECISION_IDENTIFIED`, `ACTION_STARTED`, `ACTION_COMPLETED`, `OUTCOME_RECORDED`, `LEARNING_DELTA_CREATED`, `ONTOLOGY_UPDATED`, `EVENT_CORRECTED`.

**Rejected ≠ Abandoned.** `PATH_REJECTED` requires `decision_by` (someone decided no). `PATH_ABANDONED` requires `decision_by IS NULL` (no decision was made). The database enforces both, so NULL in `decision_by` never means "data missing" — it means "no one decided". They teach different things: a rejection says the offer was judged and lost; an abandonment points to _not convincing enough_, _wrong stakeholder_ or _wrong timing_ — each of those is a Layer 2 hypothesis, never part of the abandonment event.

**`PATH_ABANDONED` is never user-entered.** `decision_journey_emit_abandonments(window default 30 days)` emits it when a `PATH_RECOMMENDED` / `SKU_RECOMMENDED` has no successor and no accept / reject / purchase / delay / transfer / escalation after it. The database rejects any `PATH_ABANDONED` not emitted by `system` with `SYSTEM_CONFIRMED` evidence and `decision_by NULL`. Its payload is factual only: `days_without_decision`, `recommendation_event_id`. Scheduling (pg_cron, daily) is set up when the migration is applied.

### 3.3 Three actors

| Field            | Question                | Example `PATH_RECOMMENDED` | Example `PATH_REJECTED` |
| ---------------- | ----------------------- | -------------------------- | ----------------------- |
| `emitted_by`     | Who produced the event? | `industry_captain_ai`      | `customer_portal`       |
| `decision_by`    | Who decided?            | NULL                       | `customer`              |
| `affected_party` | Whom does it concern?   | `customer`                 | `customer`              |

Who proposed and who decided are different facts; learning is the difference between them. Decision events (`OWNERSHIP_CONFIRMED/REJECTED`, `PATH_ACCEPTED/REJECTED/DELAYED/ESCALATED/TRANSFERRED`, `SKU_PURCHASED`, `DECISION_IDENTIFIED`) require `decision_by`. Values are roles (`customer`, `COO`), never personal names.

### 3.4 Payload shapes

```yaml
OBSERVATION_RECORDED: { text: "Emme tiedä tuotantoerien hiilijalanjälkeä." }
OWNERSHIP_HYPOTHESIS_CREATED:
  {
    candidates: [Production, Sustainability, COO],
    rationale: production_data_missing,
    ownership_status: unclear,
  }
PATH_RECOMMENDED:
  {
    recommended_path: ownership_discovery,
    recommended_sku: ai-consultant-day,
    reason: ownership_unclear,
  }
PATH_ABANDONED: { days_without_decision: 30, recommendation_event_id: evt_… } # system only
LEARNING_DELTA_CREATED: { hypothesis: captain_day_too_early } # + learning_confidence 0.42 + evidence_refs
OUTCOME_RECORDED:
  { result: ownership_clarified, actual_owner: COO, next_step: climate_intelligence_pilot }
```

Additions beyond the HIC field list, for integrity only: `recorded_seq` (stable order), `prev_hash` (chain verification), `supersedes_event_id` + `EVENT_CORRECTED` (corrections without editing history), `evidence_quality` / `evidence_strength` (§3.5), `title` on the header.

### 3.5 Evidence quality and strength

`evidence_quality` states **who confirmed** the event; capture lag states **how fresh** the record is. `evidence_strength` is computed by the database from both, never supplied by the emitter:

| `evidence_quality` | Example                         | Weight             |
| ------------------ | ------------------------------- | ------------------ |
| `SYSTEM_CONFIRMED` | Order signed, payment, contract | 0.99               |
| `WORKSHOP_OUTPUT`  | Workshop output                 | 0.85               |
| `EXTERNAL_SOURCE`  | Registry, public filing         | 0.60 (v1 proposal) |
| `HUMAN_CONFIRMED`  | Portal decision by the decider  | 0.80               |
| `MANUAL_ENTRY`     | Manual note                     | 0.40               |

| Capture lag (`recorded_at − occurred_at`) | Factor |
| ----------------------------------------- | ------ |
| ≤ 5 min                                   | 1.00   |
| ≤ 1 day                                   | 0.90   |
| ≤ 7 days                                  | 0.70   |
| ≤ 30 days                                 | 0.50   |
| > 30 days                                 | 0.30   |

`evidence_strength = weight × factor`. A path's `weakest_evidence` is its minimum. Weights and factors are v1 proposals (open question §7.1).

### 3.6 Integrity (Article 12 record keeping)

1. UPDATE / DELETE / TRUNCATE on events raise. A wrong observation is corrected by a new `OBSERVATION_CORRECTED`, any other event by `EVENT_CORRECTED`; the original remains. Nothing in the chain disappears.
2. `PATH_ACCEPTED`, `SKU_PURCHASED`, `WORKSHOP_COMPLETED`, `ACTION_COMPLETED`, `OUTCOME_RECORDED` require `evidence_refs`.
3. `previous_event_id` and `supersedes_event_id` must stay inside the journey. `occurred_at` cannot be in the future.
4. `hash = sha256(prev_hash | payload | occurred_at (UTC) | ontology_version | world_model_version | actors | evidence | …)`. `occurred_at` is hashed and `recorded_at` is not: the moment of the event is the claim being protected (brief 1.5 §9). The brief's four fields are the mandatory core; the other claim fields stay in the hash so that changing `decision_by` or `event_type` is also detected. The attack "event kept, payload changed" breaks the recomputed hash and is reported by `decision_journey_verify_chain()`.
5. Residual risk, stated plainly: a database superuser can rewrite a payload **and** recompute every later hash. Detecting that needs the head hash anchored outside the database (e.g. a periodic KYA attestation or signed git commit). Not in this change.
6. No personal data in payloads — immutable rows cannot honour GDPR Art. 17.

### 3.7 Capture lag tests the thesis

Median `capture_lag` per event type shows whether events are emitted by the workflow (near zero) or reconstructed from memory (the CRM failure mode). `is_after_the_fact` flags lag > 7 days.

## 4. Paths: every real path, with its decision state

`decision_journey_paths` walks `previous_event_id` back from every terminal event (no successor):

| `decision_state`                        | Terminal event                                  |
| --------------------------------------- | ----------------------------------------------- |
| `UNDECIDED`                             | `PATH_ABANDONED`                                |
| `REJECTED`                              | `PATH_REJECTED`                                 |
| `DELAYED` / `ESCALATED`                 | `PATH_DELAYED` / `PATH_ESCALATED`               |
| `TRANSFER_PENDING`                      | `PATH_TRANSFERRED` (sent, not yet activated)    |
| `OWNER_ACKNOWLEDGED` / `OWNER_DECIDING` | `OWNER_ACKNOWLEDGED` / `OWNER_DECISION_STARTED` |
| `ACCEPTED`                              | `PATH_ACCEPTED`, `SKU_PURCHASED`                |
| `OUTCOME`                               | `OUTCOME_RECORDED`                              |
| `OPEN`                                  | anything else (in progress)                     |

`is_verified` = **Verified Decision Journey** (brief 1.5 §11): observation root → `OWNERSHIP_CONFIRMED` → decision (`PATH_ACCEPTED`/`SKU_PURCHASED`) → action (`ACTION_*`/`WORKSHOP_COMPLETED`) → `OUTCOME_RECORDED` → `LEARNING_DELTA_CREATED` → `ONTOLOGY_UPDATED` (terminal), in a journey with `subject_is_external = true`. **All paths are learning input**; `is_verified` and `weakest_evidence` weight them, they do not filter them out. A corrected event does not break a chain; `corrected_events` counts them.

## 5. Worked examples

### 5.1 Negative evidence — "dead lead" becomes evidence

| #   | event_type             | emitted_by                 | decision_by | payload                                                                                                     |
| --- | ---------------------- | -------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| 1   | OBSERVATION_RECORDED   | industry_captain_ai        | —           | `{text: "Raportointi vie liikaa aikaa", industry: construction}`                                            |
| 2   | PATH_RECOMMENDED       | industry_captain_ai        | —           | `{recommended_sku: ai-consultant-day, reason: ownership_unknown}`                                           |
| 3   | PATH_ABANDONED         | abandonment_timer (system) | NULL        | `{days_without_decision: 30, recommendation_event_id: 2}`                                                   |
| 4   | LEARNING_DELTA_CREATED | ontology_reviewer          | —           | `{hypothesis: captain_day_not_compelling_for_reporting}`, learning_confidence 0.42, evidence_refs [1, 2, 3] |

CRM: _dead lead / no activity_. Active Ontology: events 1–3 are evidence (`decision_state = UNDECIDED`). Event 4 is one hypothesis among competing ones (_wrong stakeholder_, _wrong timing_). None becomes world model until an `ONTOLOGY_UPDATED` adopts it.

### 5.2 Kemira path (HIC-supplied illustration, 24.09.2026 — not a recorded customer event)

| #   | event_type                   | ontology | decision_by | note                           |
| --- | ---------------------------- | -------- | ----------- | ------------------------------ |
| 1   | OBSERVATION_RECORDED         | 1.2.0    | —           | batch carbon footprint unknown |
| 2   | OWNERSHIP_HYPOTHESIS_CREATED | 1.2.0    | —           | unclear                        |
| 3   | PATH_RECOMMENDED             | 1.2.0    | —           | Captain Day                    |
| 4   | PATH_REJECTED                | 1.2.1    | customer    |                                |
| 5   | OWNERSHIP_CONFIRMED          | 1.3.0    | customer    | COO                            |
| 6   | PATH_RECOMMENDED             | 1.3.0    | —           | Climate Intelligence           |
| 7   | SKU_PURCHASED                | 1.3.1    | COO         | `evidence_refs: [order_…]`     |
| 8   | OUTCOME_RECORDED             | 1.3.2    | —           | positive                       |
| 9   | LEARNING_DELTA_CREATED       | 1.3.2    | —           |                                |
| 10  | ONTOLOGY_UPDATED             | 1.4.0    | HIC         |                                |

Finding from applying the LD strictly: as listed, this path has no action event between purchase (7) and outcome (8), so `is_verified = false`. The pilot deployment should be emitted as `ACTION_STARTED` / `ACTION_COMPLETED`. The schema makes this gap visible instead of assuming the action happened.

The most valuable variant (HIC): _Captain Day → ignored → 60 days → COO meeting → Climate Intelligence → purchased._ Here `PATH_ABANDONED` is followed by later events, so the path's `has_abandonment = true` and it still reaches an outcome.

## 6. Queries

Decision Traceability — ownership unclear, transferred to the owner, owner reacted within 30 days, project started later:

```sql
SELECT DISTINCT t.journey_id
FROM decision_journey_timeline t
JOIN decision_journey_timeline a
  ON a.journey_id = t.journey_id AND a.event_type = 'OWNER_ACKNOWLEDGED'
 AND a.occurred_at BETWEEN t.occurred_at AND t.occurred_at + interval '30 days'
JOIN decision_journey_timeline p
  ON p.journey_id = t.journey_id AND p.occurred_at > a.occurred_at
 AND p.event_type IN ('PATH_ACCEPTED', 'SKU_PURCHASED', 'ACTION_STARTED')
WHERE t.event_type = 'PATH_TRANSFERRED'
  AND NOT t.is_superseded AND NOT a.is_superseded AND NOT p.is_superseded
  AND EXISTS (SELECT 1 FROM decision_journey_timeline u
              WHERE u.journey_id = t.journey_id
                AND u.event_type = 'OWNERSHIP_HYPOTHESIS_CREATED'
                AND u.payload->>'ownership_status' = 'unclear');
```

Every case where ownership was unclear:

```sql
SELECT DISTINCT journey_id FROM decision_journey_timeline
WHERE event_type = 'OWNERSHIP_HYPOTHESIS_CREATED'
  AND payload->>'ownership_status' = 'unclear' AND NOT is_superseded;
```

Ownership unclear, Captain Day rejected or abandoned, Climate Intelligence bought later:

```sql
SELECT DISTINCT r.journey_id
FROM decision_journey_timeline r
JOIN decision_journey_timeline b
  ON b.journey_id = r.journey_id AND b.occurred_at > r.occurred_at
WHERE r.event_type IN ('PATH_REJECTED', 'PATH_ABANDONED') AND NOT r.is_superseded
  AND EXISTS (SELECT 1 FROM decision_journey_timeline p
              WHERE p.event_id = r.previous_event_id
                AND p.payload->>'recommended_sku' = 'ai-consultant-day')
  AND b.event_type = 'SKU_PURCHASED' AND NOT b.is_superseded
  AND b.payload->>'sku' = 'DWS-CLIMATE-001'
  AND EXISTS (SELECT 1 FROM decision_journey_timeline u
              WHERE u.journey_id = r.journey_id
                AND u.event_type = 'OWNERSHIP_HYPOTHESIS_CREATED'
                AND u.payload->>'ownership_status' = 'unclear');
```

Decision states across all paths (the asset, including paths that never sold):

```sql
SELECT decision_state, count(*), round(avg(weakest_evidence), 2)
FROM decision_journey_paths GROUP BY decision_state;
```

### 6.1 Active Ontology KPIs — "How is Lifetime performing?"

In Active Ontology terms the answer is not revenue, visitors or orders, but `active_ontology_kpis`. Its first two columns are a pair and are **always shown together** (brief 1.5 §12): `observation_count` and `decision_traceability_coverage` (share of observations whose journey reached a recorded decision state, abandonment included). Coverage alone would reward not recording difficult observations. The strategic target is not 10 journeys but **`verified_decision_journeys` = 1** (brief 1.5 §11). Transfer Activation Rate lives in a separate view, `decision_journey_customer_signals`: it measures customer behaviour, not system quality, and is not a performance metric (brief 1.5 §10).

Honest baseline, 24.09.2026:

| Measure                 | Now                                     | Source                                                |
| ----------------------- | --------------------------------------- | ----------------------------------------------------- |
| Products in catalogue   | 136                                     | `dws10.com/config/products.json` (HIC estimate ≈ 137) |
| Industries              | 25                                      | `DWS_TRUTH_STANDARD.md`                               |
| Decision paths          | Hypotheses only                         | this spec                                             |
| Recorded journey events | 0                                       | migration 092 not applied                             |
| Verified decision paths | 0 recorded (HIC estimate 0–3, informal) | —                                                     |
| Outcome evidence        | Very little; none in a schema           | —                                                     |

The catalogue exists. The Active Ontology exists. Decision paths exist as hypotheses. The evidenced asset is neither the catalogue nor the ontology: it begins with the first real `decision_journey` event chain. The first real Observation → Ownership Finding → Decision → Outcome chain — Kemira or any other — turns the Active Ontology from theory into evidence. It matters not as the next sale but as the first evidence node in the system.

## 7. Open questions for HIC

1. Evidence weights and lag factors (§3.5) — accept v1 or calibrate?
2. Abandonment window: 30 days fixed, or per product / per industry?
3. Version sources: which registry owns `ontology_version` and `world_model_version`?
4. Head-hash anchoring (§3.6.5): KYA attestation, signed git commit, or both?
5. Prospect-only journeys: service_role only (current), or readable by DWS staff via an internal org?

## 8. Emitters (next step, not in this change)

| Source                                                         | Events                                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| DISCOVER / Industry Captain agents                             | OBSERVATION_RECORDED, OWNERSHIP_HYPOTHESIS_CREATED, PATH/SKU_RECOMMENDED |
| Customer portal                                                | PATH_ACCEPTED / REJECTED / DELAYED (HUMAN_CONFIRMED)                     |
| Stripe → `orders` (migration 086), `contracts_lifecycle` (084) | SKU_PURCHASED, PATH_ACCEPTED (SYSTEM_CONFIRMED)                          |
| Workshop / Captain Day report                                  | WORKSHOP_COMPLETED, OWNERSHIP_CONFIRMED (WORKSHOP_CONFIRMED)             |
| `decision_journey_emit_abandonments()` via pg_cron, daily      | PATH_ABANDONED (system only)                                             |
| Outcome check at agreed measurement date (scheduled)           | OUTCOME_RECORDED                                                         |
| Ontology review → HIC gate                                     | LEARNING_DELTA_CREATED (Layer 2) → ONTOLOGY_UPDATED (Layer 3)            |

## 9. Brief 1.5 mapping and build phases

| Brief 1.5 item                                                   | Where                                                                                                             |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| 1 Flight recorder, events not states                             | §2.1; no state or note columns in the schema                                                                      |
| 2 `decision_journey_event`, append-only, OBSERVATION_CORRECTED   | migration 092: table, triggers, `dje_correction_target`                                                           |
| 3 Required fields                                                | all present; `previous_event_id` is NULL only for the root observation; `decision_by` NULL carries meaning (§3.2) |
| 4 Three actors                                                   | `emitted_by`, `decision_by`, `affected_party` (NOT NULL)                                                          |
| 5 PATH_ABANDONED, system only                                    | `dje_abandoned_system_only` + `decision_journey_emit_abandonments()`                                              |
| 6 Evidence ≠ Learning                                            | `layer` column + payload constraints (P0)                                                                         |
| 7 learning_confidence ≤ minimum                                  | insert trigger (Golden Rule #4)                                                                                   |
| 8 evidence_quality + evidence_strength, source-aware             | §3.5 weight × lag                                                                                                 |
| 9 Hash: previous_hash + payload + occurred_at + ontology_version | `decision_journey_event_hash()`; `recorded_at` excluded                                                           |
| 10 Transfer events; activation rate not a performance metric     | OWNER\_\* events; `decision_journey_customer_signals`                                                             |
| 11 Verified Decision Journey, first target 1                     | `decision_journey_paths.is_verified`, `verified_decision_journeys`                                                |
| 12 Observation Count + Coverage pair                             | `active_ontology_kpis` first two columns                                                                          |
| 13 Strategy sentence                                             | §2.0                                                                                                              |
| 14 Build order                                                   | below                                                                                                             |

**Phase 1 — build now (brief §14):** `decision_journey_event` (append-only), `PATH_ABANDONED` with its timer, `evidence_quality`, `evidence_strength`, `decision_by`. The schema also holds the other event types as allowed values, but no emitter, UI or workflow is built for them until the first real Verified Decision Journey is being recorded.

**Phase 2 — after the first real journey:** emitters in §8 beyond the abandonment timer, transfer tracking, dashboards.

**Release principle of Active Ontology 1.5 (HIC, 24.09.2026, from brief §14):**

> Kun nämä ovat olemassa, voidaan alkaa kerätä ensimmäistä oikeaa Verified Decision Journeyta. Se on tärkeämpi kuin seuraavat 20 ominaisuutta.

**Priority order (HIC, 24.09.2026) — never the other way round.** _Superseded by the P0–P5 order in §9.2 (HIC, same day); kept for the record._ No new feature is added before the Active Ontology 1.5 foundation is green.

| Priority       | Content                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1 Foundation   | `decision_journey_event`, append-only, `PATH_ABANDONED`, `decision_by`, `evidence_quality`, `evidence_strength`, hash chain |
| 2 Verification | First Ownership Transfer → First Verified Decision Journey → First Verified Learning Delta                                  |
| 3 Dashboard    | Active Ontology 1.6 Candidate (below)                                                                                       |
| 4 New features | Only after 1–3                                                                                                              |

**Backlog — Active Ontology 1.6 Candidate (HIC, 24.09.2026; not built, priority 3).** A dashboard that measures the growth of the ontology, not only sales. Three main levels, from top to bottom:

| Level              | Measure                                                              | Source (`active_ontology_kpis`)  |
| ------------------ | -------------------------------------------------------------------- | -------------------------------- |
| WORLD LEARNED FROM | Verified Learning Deltas                                             | `verified_learning_deltas`       |
| WORLD UNDERSTOOD   | Decision Traceability Coverage (always shown with Observation Count) | `decision_traceability_coverage` |
| WORLD SEEN         | Observation Count                                                    | `observation_count`              |

_Corrected by HIC decision 4 (24.09.2026):_ World Understood is **Coverage**, which measures understanding of the world. **Verified Decision Journeys** is a separate milestone card (M2), which measures systematic follow-through. They are not the same thing.

Beneath them, as a secondary layer: **Business Impact** — deals, revenue, customers.

### 9.1 Locked design decisions (HIC, 24.09.2026)

Do not change these without a very good reason, recorded in a new spec version:

1. **The database writes the evidence.** `evidence_strength`, the hash chain and `PATH_ABANDONED` are the database's responsibility, never the application's (Decision Flight Recorder).
2. **`decision_by` is required on decision events.** This keeps _recommendation_ and _decision_ apart, which is the precondition for the ontology to learn.
3. **Shadow mode before autonomy.** The agent proposes, a human decides, the ontology learns. No automatic action is allowed before that.
4. **`would_have_executed_wrongly`** is the primary safety measure: _what would have happened had we trusted the agent?_ It outranks the plain agreement rate.

**Hash field set — approved (HIC, 24.09.2026):** at least `event_type`, `emitted_by`, `decision_by`, `affected_party`, `evidence_refs`, `payload`, `occurred_at`, `ontology_version`. All of them are in `decision_journey_event_hash()`. The verification test proves that rewriting `payload`, `occurred_at` or `decision_by` is detected.

### 9.2 Rollout order and priorities (HIC, 24.09.2026) — P0–P5 table superseded by §9.3

**Current primary metric: Shadow Journeys Recorded** (`active_ontology_kpis.shadow_journeys_recorded`). First prove World → Events → Evidence → Storage → Traceability. Only then prove Learning → Ontology Growth. Deals, revenue, conversion and even Verified Decision Journeys come later.

| Priority | Milestone                       | Measured by                                          |
| -------- | ------------------------------- | ---------------------------------------------------- |
| P0       | Migration 092 applied           | tables exist, verification test passes in the target |
| P1       | First real shadow journey       | `shadow_journeys_recorded ≥ 1`                       |
| P2       | First `PATH_ABANDONED`          | `paths_undecided ≥ 1`                                |
| P3       | First Ownership Transfer        | `verified_ownership_transfers ≥ 1`                   |
| P4       | First Verified Decision Journey | `verified_decision_journeys ≥ 1`                     |
| P5       | First Verified Learning Delta   | `verified_learning_deltas ≥ 1`                       |

> Ensimmäinen Verified Learning Delta on tärkeämpi kuin seuraavat 20 ominaisuutta. — But right now, the first real event chain matters more still: it shows how the world behaves, not only how the architecture was designed. (HIC)

**Rollout runbook** (HIC approved the test-branch migration in principle; every step that touches a Supabase database is RED and run by the HIC):

1. **Supabase test** — create a test branch or project.
   Prerequisites: `public.outreach_orgs`, `public.organizations`, `public.customers`, `public.organization_members`, `auth.uid()`. Migrations 090 and 091, and the other `089_240926_website_observations.sql`, also need `public.is_backoffice_admin()`, which no migration in the repository defines.
2. **Migrations** — apply in order: `089_240926_website_observations.sql`, `090_240926_website_observations_ownership.sql`, `091_240926_website_observation_summary.sql`, `094_240926_decision_journey.sql`, `095_240926_decision_journey_discover_bridge.sql`. Then run `supabase/tests/094_decision_journey_verification.sql` (expect 32 × PASS) and `supabase/tests/095_decision_journey_discover_bridge_verification.sql` (expect 20 × PASS). Both end in ROLLBACK.
3. **Timer** — schedule the abandonment emitter once a day:
   `select cron.schedule('decision-journey-abandonment', '0 3 * * *', $$select public.decision_journey_emit_abandonments()$$);`
4. **Shadow mode** — set `WORLD_MODEL_VERSION` (semver) and `DECISION_JOURNEY_SHADOW=1` for the API that runs the Helpdesk agent against the test project.
5. **Collect the first real events** — real tickets, no seed or demo data.
6. **Check the data** — `select * from active_ontology_kpis;`, `select * from helpdesk_shadow_agreement;`, `select * from decision_journey_verify_chain('<journey_id>');` (empty = intact).
7. **Production** — repeat 2–4 on production only after step 6 has been reviewed.

**Backlog — Shadow Learning Score (HIC, 24.09.2026; display only, not built).** Recommendations / Accepted / Rejected / Abandoned / Would Have Executed Wrongly (e.g. 142 / 109 / 24 / 9 / 3). The numbers are already computable per action class from `helpdesk_shadow_agreement` (`recommendations`, `agreed`, `disagreed`, `abandoned`, `would_have_executed_wrongly`). Only the presentation is missing.

### 9.3 HIC decisions 1–6 (24.09.2026) — current priorities

1. **PR #2093 continues.** Phases 1–4 are done; phase 5 waits on infrastructure.
2. **Migration numbering** (final: HIC decision 7 below): 089–091 are the website_observations chain, 092 is the Decision Journey Foundation, and 093 is the DISCOVER → Decision Journey bridge. §4.5 requires unique numbers. Nothing had been applied, so fixing the numbering is free now.
3. **DISCOVER → Decision Journey, M1 scope only:** Ownership, Transfer, Acknowledgement. Nothing else is built around it.
   - Migration 093: `decision_journey_import_discover(observation_id, world_model_version, imported_by, customer / outreach_org / organization)` imports one DISCOVER path: observation → ownership hypothesis → transfer recommended (`PATH_RECOMMENDED`) → `PATH_TRANSFERRED`.
     - Only for an **identified** organisation. The anonymous website intake never writes to the immutable log, so bots cannot pollute it.
     - Only structured fields are copied. The visitor's free text stays in the erasable `website_observations`.
     - Idempotent.
   - `decision_journey_record_owner_response(transfer_event_id, OWNER_ACKNOWLEDGED | OWNER_DECISION_STARTED, owner_role, evidence_ref, occurred_at, recorded_by)` records the owner's reaction. Evidence is mandatory (email reply, meeting, minutes). Acknowledgement comes first, and each response is recorded once.
   - An unanswered transfer is abandoned by the timer after 30 days.
   - Both functions are service_role only. Tested end to end: import + acknowledgement + decision start = `verified_ownership_transfers + 1`, and the chain hash is clean.
4. **World Understood = Decision Traceability Coverage.** Verified Decision Journeys is its own milestone card (§9 backlog table corrected).
5. **The 05:00 dashboard is not built yet.** With M1–M3 at 0 it would create more illusion than information. Build after M1.
6. **Primary goal now: M1, the first Ownership Transfer.** M2 cannot happen without it.

| Priority | Item                                 | Measured by                                         |
| -------- | ------------------------------------ | --------------------------------------------------- |
| P0       | GitHub Actions working               | CI runs on a runner                                 |
| P1       | Supabase test migration              | 089–093 applied, 32 + 20 × PASS                     |
| P2       | DISCOVER → Journey coupling          | import + owner response in use (built, §9.3 item 3) |
| P3       | First Ownership Transfer (M1)        | `verified_ownership_transfers ≥ 1`                  |
| P4       | First Verified Decision Journey (M2) | `verified_decision_journeys ≥ 1`                    |
| P5       | First Verified Learning Delta (M3)   | `verified_learning_deltas ≥ 1`                      |
| P6       | 05:00 dashboard                      | built after M1                                      |

> **Ensimmäinen oikea Ownership Transfer on tärkeämpi kuin seuraavat 20 ominaisuutta.** — because it starts the first decision path that happens in the outside world. (HIC, 24.09.2026)

**Oura as an ontological test, not a reference (HIC).** The Oura case (`kb/raw/signals/2026-09-24-ai-support-decision-authority-oura.md`) put observation → recommendation → decision → action → order → evidence in one system. It proves that a decision path can be modelled. It does not prove that a multi-organisation decision path works. That is why Kemira remains the more important test.

### 9.4 HIC decision 7 — numbering, bridge acceptance, deferred work (24.09.2026)

**Final numbering** (HIC chose "website chain unchanged"):

| Number | File                                              | Meaning                                 |
| ------ | ------------------------------------------------- | --------------------------------------- |
| 089    | `089_240926_website_observations.sql`             | Website Observations (DISCOVER intake)  |
| 090    | `090_240926_website_observations_ownership.sql`   | Ownership stage of the intake           |
| 091    | `091_240926_website_observation_summary.sql`      | Intake summary function                 |
| 092    | `094_240926_decision_journey.sql`                 | Decision Journey Foundation             |
| 093    | `095_240926_decision_journey_discover_bridge.sql` | DISCOVER → Decision Journey bridge (M1) |
| 094+   | —                                                 | future migrations                       |

**Bridge principle (HIC):** never _Anonymous Observation → Immutable Journey_. Always _Anonymous Observation → Ownership Finding → Organization Identified → Decision Journey Created_, only in an identified context (GDPR and Active Ontology).

**093 acceptance criterion (HIC), met in the test:** DISCOVER → ownership (hypothesis) → transfer recommended → `PATH_TRANSFERRED` → `OWNER_ACKNOWLEDGED` appear in `decision_journey_event`, in that order. With known = "no" the DISCOVER rule engine recommends ownership discovery, not transfer. A transfer path therefore starts from known = "partly" or "yes", with decision rights elsewhere. For a discovery path the bridge imports no transfer events.

**Intake fix:** `dws10.com/functions/api/observations.js` (and its landing-pages mirror) now keeps the whitelisted ownership verdict. The front-end already sent it, but the Function dropped it. The verdict is the stored evidence for "transfer recommended".

**Still not built** (HIC): dashboard, learning-delta automation, World Learned From views, journey scoring. These wait until DISCOVER → Journey works with real data.

**Next real milestone:** not _does the architecture work?_ but _can the first real Ownership Transfer happen?_

> **Ensimmäinen Ownership Transfer on tärkeämpi kuin seuraavat 20 ominaisuutta.** (HIC)

### 9.5 Technical validation of the Active Ontology 1.5 foundation (24.09.2026)

The run: a brand-new empty database (`CREATE DATABASE`, 0 public tables), Supabase stubs, migrations 089 → 090 → 091 → 092 → 093, then the Foundation tests, then the Bridge tests.

| HIC question                                               | Answer         | Evidence                                                                                                         |
| ---------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1. Does the whole 089→093 chain apply to a clean database? | **Yes**        | all five migrations exit 0                                                                                       |
| 2. Do the Foundation tests pass?                           | **Yes, 32/32** | append-only, learning-confidence cap, hash chain, `PATH_ABANDONED`, ontology-update gating                       |
| 3. Do the Bridge tests pass?                               | **Yes, 20/20** | the M1 path, Decision Traceability through `evidence_refs`, the unknown-verdict regression                       |
| 4. One `journey_id` holding all five acceptance events?    | **Yes**        | `OBSERVATION_RECORDED → OWNERSHIP_HYPOTHESIS_CREATED → PATH_RECOMMENDED → PATH_TRANSFERRED → OWNER_ACKNOWLEDGED` |

The regression **unknown verdict → ignored → no event emitted** is tested at both layers:

- the intake Pages Function, in both mirrors, drops an unknown verdict (`src/__tests__/discover-observations-verdict.test.ts`);
- the bridge emits no recommendation or transfer for an unknown verdict and never copies the value into the log (093 suite).

Garbage in does not become immutable garbage.

Both suites end in ROLLBACK; 0 events remained afterwards. The local run used PostgreSQL 16; production Supabase runs 17, so the same run must be repeated on the Supabase test project (runbook step 2).

**Conclusion:** DISCOVER → bridge → Decision Journey is technically possible. Active Ontology 1.5 is no longer only a specification: migrations, data model, constraints, evidence rules and the decision bridge work together. M1–M3 are not yet proven; they need real data.

### 9.6 HIC technical acceptance (24.09.2026)

The HIC accepted the §9.5 validation report. Status:

| Component                                                                            | Status                                                                                                                                                    |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Active Ontology 1.5 Foundation (092)                                                 | ✅ Validated: 32/32                                                                                                                                       |
| Decision Flight Recorder                                                             | ✅ Validated                                                                                                                                              |
| Decision Traceability: journey event → evidence ref → original observation, and back | ✅ Validated                                                                                                                                              |
| DISCOVER Bridge (093)                                                                | ✅ Validated: 20/20, including the unknown-verdict regression. The HIC acceptance text cites 18/18, which was the count before that regression was added. |
| M1 Ownership Transfer                                                                | ⏳ Possible, not reached: waits for the first real-world event                                                                                            |
| M2 Verified Decision Journey                                                         | ⏳ Waiting                                                                                                                                                |
| M3 Verified Learning Delta                                                           | ⏳ Strategic target                                                                                                                                       |

**M1 status change:** before, M1 was theory. Now the system can receive the event. That is technically possible, not achieved.

**Realistic ownership path (HIC):** Ownership Unknown → Ownership Discovery → Owner Identified → Transfer Recommendation → Transfer → Owner Acknowledged. The path is not Ownership Unknown → Transfer. The bridge follows this: with ownership unknown, DISCOVER recommends discovery and no transfer is imported.

**Roadmap (supersedes the §9.3 priority table):**

| Priority | Item                                                                                      |
| -------- | ----------------------------------------------------------------------------------------- |
| P0       | GitHub Actions runners (mandatory)                                                        |
| P1       | Supabase test deployment: 089–093, then Foundation 32 PASS and Bridge 20 PASS (mandatory) |
| P2       | First Ownership Discovery, from the first identified organisation                         |
| P3       | M1: first Ownership Transfer                                                              |
| P4       | M2: first Verified Decision Journey                                                       |
| P5       | M3: first Verified Learning Delta                                                         |

**Still waiting (data first, visualisation later):** dashboard, learning-delta automation, journey scoring, World Learned From views.

> **Ensimmäinen oikea Ownership Transfer on nyt tärkeämpi kuin seuraavat 20 ominaisuutta.** The system is ready, for the first time, to receive a real-world decision path. This is where the architecture starts to become an asset. (HIC)

## 10. Status

- Migrations 092 and 093 are **not applied**. On 24.09.2026 the production project (`dws6`) has no `decision_journey*` tables, so the files are edited in place rather than superseded by new migrations. Applying is RED zone (HIC).
- **Executed and verified 24.09.2026** on a throwaway PostgreSQL 16 with Supabase stubs (roles, `auth.uid()`, referenced tables): `supabase/tests/094_decision_journey_verification.sql`, 32/32 PASS, and `supabase/tests/095_decision_journey_discover_bridge_verification.sql`, 20/20 PASS, with migrations applied in order 089 → 093. Both end in ROLLBACK. Covers:
  - the event model columns;
  - append-only (UPDATE, DELETE and TRUNCATE all raise) and the OBSERVATION_CORRECTED rule;
  - `decision_by` required on decisions;
  - source-aware `evidence_strength` (0.99 / 0.40, the emitter's value ignored);
  - no interpretation in the evidence layer;
  - `learning_confidence ≤ min(evidence_strength)`, rejected at +0.01;
  - the hash chain: payload and `occurred_at` tampering detected, `recorded_at` not hashed;
  - `PATH_ABANDONED`: system-only, `decision_by` NULL, timer idempotent;
  - no Event → Ontology Update without a learning delta;
  - a transfer is not an outcome;
  - KPI milestones M1–M3 and the Observation Count + Coverage pair;
  - RLS (non-member reads 0 rows);
  - the 093 bridge: anonymous import rejected, no free text copied, idempotent, the owner response needs evidence and runs in order, the M1 acceptance path (five events, one journey_id), Decision Traceability (every bridged event's `evidence_refs` resolve back to the visit's `website_observations` rows; the owner acknowledgement carries its own evidence), and a discovery path imports no transfer.
- Migrations 090 and 091 (website_observations ownership, PR #2091) are independent of this schema and apply alongside it. On a fresh test project, `089_240926_website_observations.sql` needs `public.is_backoffice_admin()`, which no migration in the repository defines.
- Numbering: resolved (HIC decision 7). Every number from 089 to 093 is unique; the next free number is 094.
- Production (Supabase `dws6`, PostgreSQL 17) not yet applied: RED zone, HIC.

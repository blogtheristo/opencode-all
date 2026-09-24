# Specification: Decision Journey — Event-First Outcome Evidence for Workflow V2 and the Active Ontology

---

VERSION AND AGENT HISTORY

- Version: 1.4
- Status: DRAFT — awaiting HIC review
- Classification: INTERNAL
- Document type: Specification
- Author: Claude Code (standby runtime) + risto.paarni2024@lifetime.fi
- Date: 2026-09-24
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/blissful-davinci-8782wy

Sessions & Modifications:

- Version: 1.4 [Latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Flight-recorder positioning and accountable-owner buyer (§2.1); transfer is a state, not an outcome (OWNER_ACKNOWLEDGED, OWNER_DECISION_STARTED, Transfer Activation Rate); Golden Rule #4 enforced (learning_confidence ≤ mean cited evidence strength); Decision Traceability query.
- Version: 1.3 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Active Ontology Golden Rules #1–#3 (§2.0); `learning_confidence` separate from `evidence_strength`; evidence_quality enum per HIC (WORKSHOP_OUTPUT, EXTERNAL_SOURCE); ONTOLOGY_UPDATED must follow a LEARNING_DELTA_CREATED and name its approver; transfer verdict mapped to PATH_TRANSFERRED; LD refined to "verified event chains and their later outcomes".
- Version: 1.2 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Added the first epistemic rule Evidence ≠ Interpretation (P0) with three layers enforced in the schema; PATH_ABANDONED is system-emitted only (`decision_journey_emit_abandonments`), payload factual; Active Ontology KPIs (§6.1) with an honest current-state baseline.
- Version: 1.1 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Rebuilt event-first from four further HIC messages (same day) on Boardy's review: HIC field list, UPPER_CASE event types, ontology + world model version per event, three actors (emitted_by / decision_by / affected_party), evidence_quality + computed evidence_strength, payload inside the hash chain, real paths instead of successful paths, negative evidence (PATH_ABANDONED, decision_by NULL = no decision). Principles §2 preserved verbatim.
- Version: 1.0 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: Initial specification (outcome evidence, verified decision paths).

Related Documents:

- `supabase/migrations/089_240926_decision_journey.sql` — the schema (authored, not applied)
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

Append-only is a structural rule, not a convention: `UPDATE decision_journey_event` never happens. A wrong observation is corrected by a new `EVENT_CORRECTED` event (HIC: _Observation Corrected_); the original remains.

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

**Golden Rule #4 — learning cannot be stronger than its evidence.** `learning_confidence ≤ mean(evidence_strength)` of the cited evidence-layer events. Evidence 0.40 / 0.50 / 0.55 → learning at most 0.48; weak evidence can never yield 0.95. Enforced by the insert trigger, which also requires every `evidence_refs` entry of a learning delta to be an evidence-layer event in the same journey. This stops the ontology from believing its own guesses.

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
| `decision_journeys`                         | Header: `journey_id` (`dj_0001842`), `title` ("Kemira Carbon Case"), subject (`outreach_orgs` prospect or `organizations` customer). |
| `decision_journey_events`                   | Append-only, hash-chained events.                                                                                                    |
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

1. UPDATE / DELETE / TRUNCATE on events raise. A wrong event is corrected by a new `EVENT_CORRECTED`; the original remains. Nothing in the chain disappears.
2. `PATH_ACCEPTED`, `SKU_PURCHASED`, `WORKSHOP_COMPLETED`, `ACTION_COMPLETED`, `OUTCOME_RECORDED` require `evidence_refs`.
3. `previous_event_id` and `supersedes_event_id` must stay inside the journey. `occurred_at` cannot be in the future.
4. `hash = sha256(prev_hash | payload | timestamps (UTC) | ontology_version | world_model_version | actors | evidence | …)`. The attack "event kept, payload changed" breaks the recomputed hash and is reported by `decision_journey_verify_chain()`.
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

`is_verified` = observation root → `OWNERSHIP_CONFIRMED` → decision (`PATH_ACCEPTED`/`SKU_PURCHASED`) → action (`ACTION_*`/`WORKSHOP_COMPLETED`) → `OUTCOME_RECORDED`. **All paths are learning input**; `is_verified` and `weakest_evidence` weight them, they do not filter them out.

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

In Active Ontology terms the answer is not revenue, visitors or orders, but the view `active_ontology_kpis`: observations, ownership hypotheses and confirmations, decision journeys, real paths by decision state, verified paths, outcomes, learning deltas, ontology updates.

Honest baseline, 24.09.2026:

| Measure                 | Now                                     | Source                                                |
| ----------------------- | --------------------------------------- | ----------------------------------------------------- |
| Products in catalogue   | 136                                     | `dws10.com/config/products.json` (HIC estimate ≈ 137) |
| Industries              | 25                                      | `DWS_TRUTH_STANDARD.md`                               |
| Decision paths          | Hypotheses only                         | this spec                                             |
| Recorded journey events | 0                                       | migration 089 not applied                             |
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

## 9. Status

- Migration 089 is **authored, not applied**. Applying is RED zone (HIC).
- Verified in this session: full SQL and every function body parse with libpg_query (pglast). **Not executed** against a database — no Postgres server available in the container. Run on a Supabase branch before production; test inserts for each constraint and a tamper test for `decision_journey_verify_chain()`.

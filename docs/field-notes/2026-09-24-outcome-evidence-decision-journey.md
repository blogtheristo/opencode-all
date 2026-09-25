---
Status: PENDING_REVIEW
Date: 2026-09-24
Branch: claude/blissful-davinci-8782wy
Author: Claude Code (standby runtime)
---

# Outcome Evidence, not Outcome Capture — decision_journey schema

## VERSION AND AGENT HISTORY

---

Version: 1.1
Tool: Claude Code
Date: 2026-09-24
Changes: [Latest] Brief Active Ontology 1.5 implemented (§8); external signal (§9).

Version: 1.0
Tool: Claude Code
Date: 2026-09-24
Changes: [not latest] Initial field note.

---

## 1. What happened

The HIC reviewed Boardy's feedback on outcome capture across five messages on 24.09.2026. Each message refined the model; the session turned them into one specification and one migration file:

- `docs/plans/2026-09-24-decision-journey-outcome-evidence.md` (v1.2): specification with the principles kept verbatim.
- `supabase/migrations/094_240926_decision_journey.sql`: authored, **not applied** (RED zone).

## 2. Learning Deltas (HIC formulations)

- **LD-1** Outcome Evidence, not Outcome Capture. The outcome comes from the event history. Nobody types it in afterwards.
- **LD-2** The first verified decision path makes the Active Ontology an asset. The first ownership finding does not.
- **LD-3** The Active Ontology collects decision paths, not successes. Accepted, rejected, abandoned, transferred and interrupted paths are all evidence.
- **LD-4** A recommendation is not knowledge. A decision is knowledge. An outcome is evidence. The absence of a decision is also knowledge.
- **LD-5 (first epistemic rule)** Event ≠ Learning; Evidence ≠ Interpretation. Layers: Evidence → Learning (hypothesis + confidence) → Ontology Update.
- **LD-6 (Golden Rules #1–#3)** Learning is the interpretation of evidence. An ontology update is accepted learning, and Event → Ontology Update is never allowed. Every real path counts: completeness is not a requirement.
- **LD-7** The Active Ontology learns from verified event chains and their later outcomes. The system is a decision flight recorder, not a CRM.
- **LD-8** A transfer is a new state, not an outcome. Activation is proven by OWNER_ACKNOWLEDGED and OWNER_DECISION_STARTED and measured as the Transfer Activation Rate.
- **LD-9 (Golden Rule #4)** learning_confidence ≤ the mean evidence_strength of the cited evidence. The database enforces this.
- **LD-10** The asset is Decision Traceability. The buyer is the accountable owner (COO, CIO, risk, compliance, board), not Sales Ops.

## 3. What the schema enforces

Event-first and append-only, with a hash chain that covers the payload. Every event carries its own ontology and world-model version. The schema records three actors: emitted_by, decision_by and affected_party. evidence_strength is computed by the database. PATH_ABANDONED can only be emitted by the system, and there decision_by NULL means that no one decided. Interpretation keys are rejected in the evidence layer. The KPI view reports evidence counts, not revenue.

## 4. Findings surfaced

1. As the HIC listed it, the Kemira path runs purchase → outcome with no action event, so it would not count as verified. The pilot deployment should be emitted as ACTION_STARTED / ACTION_COMPLETED.
2. Two HIC messages defined evidence_quality differently (REAL_TIME/AFTER_THE_FACT vs WORKSHOP/HUMAN_CONFIRMED). Resolution: quality = who confirmed it; freshness = capture lag, applied as a factor. The latest enum was kept.
3. Residual integrity risk: a superuser can recompute the whole chain. The head hash must be anchored outside the database (open question).
4. Current baseline: 136 products, 25 industries, 0 recorded verified decision paths.

## 5. Verification

- The full SQL and every function body parse with libpg_query (pglast).
- The SQL has **not** been executed. No Postgres server was available in the container.

## 6. Session Learning Outcome steps

- KB update: N/A — deferred to the HIC `/kb` run after the spec is approved.
- Learn/ HTML render: N/A — the spec is a DRAFT awaiting HIC review.
- Drive export: N/A — the repository is the source of truth until approval.
- Calendar: N/A — no dated commitment was made.
- HIC decision question: see §7.

## 7. HIC decision

Should P0–P4 (spec §2) become a standard, the "Active Ontology Evidence Standard", before any emitter is built? Or should they stay in the spec until the first real journey is recorded?

## 8. Active Ontology 1.5 — Decision Flight Recorder (HIC brief, same day)

The brief is recorded verbatim in `docs/plans/2026-09-24-active-ontology-1.5-decision-flight-recorder-brief.md` and implemented in spec v1.5 §9 and the decision journey migration (now `094_240926_decision_journey.sql`). What changed from v1.4:

- Tables renamed to `decision_journey_event` / `decision_journey`.
- New event type `OBSERVATION_CORRECTED`. `affected_party` is now required.
- Learning confidence is capped at the minimum of the cited evidence strengths; v1.4 used the mean.
- `recorded_at` is no longer part of the hash.
- A Verified Decision Journey now also requires a learning delta, an ontology update and an organisation outside Lifetime.
- Observation Count and Decision Traceability Coverage are shown as a pair.
- Transfer Activation Rate has moved to a separate view of customer behaviour.

Surfaced conflict (Rule 7): the brief's hash formula names four fields. The implementation keeps those four as the core and also hashes the other claim fields (`event_type`, the actors, evidence). Otherwise `decision_by` could be rewritten without detection. `recorded_at` is excluded, as the brief requires.

Build order (brief §14): Phase 1 is only the event table, PATH_ABANDONED with its timer, evidence quality and strength, and `decision_by`. No other emitters or UI until the first real Verified Decision Journey is being recorded.

## 9. External signal — AI with decision authority (LinkedIn, 24.09.2026)

A public post by an investor and COO describes an Oura ring warranty claim. An AI support agent diagnosed the problem at night and had the authority to approve a replacement. The process took about 10 minutes, and a new ring arrived three days later. In this schema, that is the case where `emitted_by` and `decision_by` are the same AI agent. The capture lag is close to zero, and the replacement order is `SYSTEM_CONFIRMED` evidence. The post's message is that the AI solved the problem instead of only answering. That supports the DWS position that decision authority is what has to be recorded and governed (KYA mandate + decision_journey). Use it as a market signal (PhD scope), not as a DWS customer case.

## 10. HIC decisions 1–6 (24.09.2026, later the same day)

Recorded in spec v1.8 §9.3.

- Migration numbering is unique: 092 is the Decision Journey Foundation, 093 is the DISCOVER bridge (decision 7, §11).
- DISCOVER is now coupled to the decision journey, at M1 scope only (Ownership, Transfer, Acknowledgement). An identified organisation is required, so the anonymous intake never writes to the immutable log.
- World Understood = Decision Traceability Coverage. Verified Decision Journeys is a separate milestone card.
- The 05:00 dashboard is deferred until M1.
- Priorities: P0 GitHub Actions → P1 test migration → P2 coupling → P3 M1 → P4 M2 → P5 M3 → P6 dashboard.
- **LD-11** The first real Ownership Transfer matters more than the next 20 features, because it starts the first decision path in the outside world.
- **LD-12** Oura is an ontological test, not a reference. It proves that a single-system decision path can be modelled. Kemira is the multi-organisation test.

Verification: see §11 (46/46).

## 11. HIC decision 7 — numbering and bridge (24.09.2026)

- Final numbering: 089–091 website_observations chain (unchanged), 092 Decision Journey Foundation, 093 DISCOVER → Decision Journey bridge. Next free: 094. Registered in `supabase/migrations/README.md` v1.4.
- The HIC message held two conflicting numbering versions: 090 = decision journey vs "website chain unchanged". 091 depends on 090's `ownership_map` column, so the first version meant moving #2091's files. I surfaced the conflict (Rule 7) and the HIC chose the website chain unchanged.
- The bridge imports observation → ownership hypothesis → transfer recommended → `PATH_TRANSFERRED`. The owner response function then adds `OWNER_ACKNOWLEDGED`. That meets the HIC acceptance criterion in the test.
- Found and fixed: the dws10.com Pages Function dropped the ownership verdict the front-end sends (`OWN_VERDICTS` was defined but unused). The verdict is the evidence for "transfer recommended".
- Found: with known = "no", DISCOVER recommends discovery, not transfer. The M1 path therefore starts from known = "partly" or "yes".
- Verification on a fresh PostgreSQL 16, 089 → 093: `092_*` 32/32 and `093_*` 18/18.
- Still deferred (HIC): dashboard, learning-delta automation, World Learned From views, journey scoring.
- HIC follow-up (same day): numbering confirmed as 092 Foundation + 093 Bridge, since the bridge writes to the Foundation's tables. Test suites stay separate, so a failure shows whether the Flight Recorder or the bridge broke. Decision Traceability added to the 093 suite: `evidence_refs` cross the bridge and resolve back to the DISCOVER rows. MS-007 and the #2091 handoff were updated.
- **Technical validation (HIC acceptance run):** a new empty database → 089 → 090 → 091 → 092 → 093 → Foundation 32/32 → Bridge 20/20. All five acceptance events share one `journey_id`. The unknown-verdict regression is tested at intake (vitest, both mirrors) and at the bridge (SQL). Result: the Active Ontology 1.5 foundation is technically valid for M1. M1 itself still needs a real Ownership Transfer.

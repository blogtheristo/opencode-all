---
Status: PENDING_REVIEW
Date: 2026-09-24
Branch: claude/blissful-davinci-8782wy
Author: Claude Code (standby runtime)
---

# Outcome Evidence, not Outcome Capture — decision_journey schema

## VERSION AND AGENT HISTORY

---

Version: 1.0
Tool: Claude Code
Date: 2026-09-24
Changes: [Latest] Initial field note.

---

## 1. What happened

The HIC reviewed Boardy's feedback on outcome capture across five messages on 24.09.2026. Each message refined the model; the session turned them into one specification and one migration file:

- `docs/plans/2026-09-24-decision-journey-outcome-evidence.md` (v1.2): specification with the principles kept verbatim.
- `supabase/migrations/089_240926_decision_journey.sql`: authored, **not applied** (RED zone).

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

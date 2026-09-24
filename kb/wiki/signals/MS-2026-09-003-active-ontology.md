---
title: "MS-2026-09-003 — Passive → active ontology: customers buy a hypothesis, not a part"
signal_id: MS-2026-09-003
learning_delta: LD-2026-09-003
world_model_version: 1.3.0
hic_decision: APPLY
approved_at: 2026-09-24
applies_to: [dws10.com, dws10.com/buy]
excluded: [lifetime.fi, investor-centre]
source: docs/market-signals/2026-09-24-ford-smax-egr-aktiivinen-ontologia.md
---

# Applied learning (world model 1.3.0)

**Old assumption.** Agentic Commerce helps the customer buy (= product recommendation). A store's job is to show products.

**New learning.** Agentic Commerce helps the customer decide; buying is the consequence. Security arises when uncertainty falls enough for a confident decision. The customer does not need more information; the customer needs less uncertainty. Agentic Commerce is need recognition and uncertainty removal regardless of interface — not an AI chat. The active ontology is a reasoning layer that may surface as a choice path, a diagnostic tree, search, a recommender, a store, an expert or a chat; people dislike chat unless it is excellent, so default to a diagnostic choice path ("which best describes your situation?" → "what matters most?" → three options). Agentic Commerce = removing uncertainty + understanding the need + reasoning on
the customer's behalf + purchase as a by-product. A passive ontology shows products; an active
ontology starts from the symptom and answers "what is the customer trying to achieve".

**Chain the system must run for the customer**
`Observation → Candidate causes → Evidence → Likelihood → Repair paths → Required parts → Purchase options`
(B2B: `Need → Situation → Industry → Goal → Risks → 3 relevant options → Purchase path`).

**Evidence.** One documented case (24.09.2026): symptom-first repair, nine manual steps, a
92 € new-part sale lost by the merchant not on price or availability but on diagnostics; the
customer would have bought the whole repair kit had the reasoning been done for them. New
concepts: Symptom, Candidate cause, Likelihood, Repair path, Recommended basket
(likely / possible / to-check).

**How agents must use this.**

- dws10.com and /buy: ask what the customer is trying to achieve; return three relevant options
  with the reasoning and risk before the price; keep the rest of the 136-product catalogue in the
  background. Do not delete products; make the view intelligent.
- Out of scope until a separate HIC decision: offering positioning, funnel chapters, Journal text (recorded as proposals in the registry).
- **Excluded:** lifetime.fi (WHY layer shows no products) and Investor Centre. Merchants in the
  case are never named publicly.

**Open refuting test.** 60 days after the first active need-view ships on dws10.com: buy→checkout
drop-off must fall and wrong-recommendation rate stay under 1/20; otherwise the view is not
genuinely active.

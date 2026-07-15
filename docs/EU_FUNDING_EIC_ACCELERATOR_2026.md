# EU Funding Brief — EIC Accelerator Open 2026 (KYA v2 + Agentic Commerce)

---

## VERSION AND AGENT HISTORY

| Field          | Value                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------- |
| Version        | 1.1                                                                                       |
| Date           | 2026-07-15                                                                                |
| Author         | Lifetime Oy                                                                               |
| Owner          | risto-001                                                                                 |
| Status         | Active — Step 1 preparation                                                               |
| Classification | Internal                                                                                  |
| Introduced-In  | PR-TBD                                                                                    |
| Branch         | claude/ngi-sargasso-gber-i2l47d                                                           |
| Source         | EIC Work Programme 2026 / Guide for Applicants v6.0 (2025-11-19); web-verified 2026-07-15 |

**v1.1 (2026-07-15, same session):** Team narrative rewritten from
"solo-founder + AI agents" to the **distributed delivery model**: Founder +
Lifetime Certified Partners consortium (Cubet Techno Labs ~100 engineers +
9series, contracted under NDA, active in the ORK160826 bid) + AI agent fleet
as operational multiplier. Grounded in
`bids/ORK160826/ORK160826_ALIHANKINTALOMAKE.md`. Added the non-EU-subcontractor
positioning caveat (§3.3) — data stays EU/EEA, core R&D in Finland.

---

## 1. Call Identification (verified 2026-07-15)

| Field                | Value                                                                                                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Programme            | Horizon Europe — European Innovation Council                                                                                                                            |
| Instrument           | **EIC Accelerator Open** (also: Challenges, separate budget)                                                                                                            |
| 2026 budget          | €414M (Open) + €220M (Challenges)                                                                                                                                       |
| Grant component      | ≤ **€2.5M** lump sum, **70%** of eligible costs, innovation activities TRL 6–8, ≤24 months                                                                              |
| Equity component     | **€1M–€10M** (minimum raised from €0.5M→€1M in 2026); grant-only and grant-first options exist under Open                                                               |
| Applicant            | **Single SME** — no consortium required                                                                                                                                 |
| Step 1               | **Rolling** — 12-page form + 10-slide deck + 3-min video; batched first Tuesday of each month; 4 remote evaluators; **≥3 GO** → invited to Step 2; result in ~4–6 weeks |
| Step 2 cut-offs 2026 | Jan 7 · Mar 4 · May 6 · Jul 8 · **Sep 2** · **Nov 4** (bimonthly from 2026)                                                                                             |
| After Step 2         | Jury interview → grant agreement preparation. **Cash realistically lands H1–mid 2027.**                                                                                 |

**Timeline honesty:** Step 1 submitted mid-July → GO ~late Aug → **Sep 2 Step 2 is
a sprint with no slack**; **Nov 4 is the realistic Step 2 target**. EIC is the
serious-money track, not a €100K-in-weeks bridge. The bridge function of Step 1
is different: a GO within weeks is a **credibility signal** usable with investors
(SAFE round) — not cash.

---

## 2. The Pitch — KYA v2 + Agentic Commerce

One sentence: **KYC for AI agents that transact** — KYA v2 as the EU-native
conformance standard for agent-level identity, capability manifests, revocable
spending mandates, and Article-12 audit trails; open standard (Apache-2.0 spec) +
proprietary Themis implementation.

Strategy: dual-track — open conformance standard as EU public good, commercial
product on top. Companion application (small, fast, same thesis):
`docs/EU_FUNDING_NGI_TALER_KYA_2026.md` (NGI Taler, Aug 1 — payment-mandate
extension on GNU Taler rails).

---

## 3. Step 1 Mapping (GO/NO-GO — need ≥3 of 4 evaluators GO)

### 3.1 Excellence — novelty, TRL, IP

- **Novelty:** KYA v2 as an open conformance standard for agentic-AI
  trust-scoring is genuinely novel — no existing EU standard covers agent-level
  identity, capability manifests, and audit trails for regulatory compliance.
  Existing agent-payment efforts (Coinbase x402, Google AP2, Stripe agent
  toolkit) are custodial, US-centric, bind the _human_ not the agent.
- **TRL 6–7, evidenced:** KYA in production with **6 paying customers**;
  Article-12 logging pipeline live; Firecracker MicroVM isolation operational.
  Not lab-stage. (Most EIC applicants arrive at TRL 3–4 — this is ahead of the
  field.)
- **IP:** open standard (Apache-2.0 spec) + proprietary Themis implementation;
  patent potential on the trust-scoring model and evidence-chain architecture
  (aligned with the existing patent-track research line: agentic commerce,
  transactions, quantum-safe primitives).

### 3.2 Impact — market opportunity

- **Regulatory timing:** EU AI Act Article 12/14/72 enforcement for high-risk
  systems starts **Aug 2027** — every enterprise deploying AI agents needs
  exactly this. Regulation creates mandatory demand.
- **Validated pricing:** €59,990 onboarding + €999/mo, across 25 regulated
  industries. **€7K MRR, 100% retention** (internal figures, 2026-07).
- **Structural moat:** EU-sovereign infrastructure (CLOUD-Act-free,
  Finnish-hosted) — a position US players cannot replicate.
- **Ecosystem impact:** KYA as open standard creates EU-wide interoperability
  for agentic-AI governance. Infrastructure, not just a product.

### 3.3 Risk, team, need for EU support

- **Team — lead with the distributed delivery model, not headcount:**
  1. **Founder** — 35+ years ICT infrastructure; NVIDIA Connect partner, IBM
     Business Partner, AWS Advanced Consulting Partner; production system
     running.
  2. **Lifetime Certified Partners consortium** — contracted delivery capacity
     under NDA: **Cubet Techno Labs** (Kochi, est. 2013, AI/LLM engineering;
     ~100 engineers per founder input — verify exact figure with Cubet before
     external use) + **9series Solutions**. Not aspirational: both are active
     subcontractors in the ORK160826 bid (roles confirmed by Cubet CEO
     Lovegin John, 2026-07-08; see `bids/ORK160826/ORK160826_ALIHANKINTALOMAKE.md`).
  3. **AI agent fleet as operational multiplier** — 50 production agents;
     execution capacity scales without linear headcount.

  **Positioning caveat (handle in prose, don't hide):** Cubet is a non-EU
  (India) subcontractor inside an EU-sovereignty pitch. The ORK bid already
  solved this framing — reuse it verbatim: development under EU controls, **no
  registry/customer data leaves EU/EEA**, EU-based maintenance handover, core
  IP and innovation stay with Lifetime Oy in Finland. EIC also expects the
  core innovation in-house — partners are _delivery scale_, not the R&D brain.

- **Risk:** technical risk high (sovereign edge AI unsolved) but de-risked by
  live deployments; financial risk mitigated by MRR + retention.
- **Additionality:** EIC funding accelerates KYA v2 standard development and
  cross-border validation (**Finland + Sweden via Lifetime AB**). Without it,
  standard development is slower and fragmented — and the
  sovereignty-as-public-good component is not pure-VC-bankable, which is the
  EIC rationale.

---

## 4. Step 2 Mapping (full proposal)

Same three criteria at full depth. Note: exact Step 2 scoring mechanics
(thresholds, jury weighting) must be taken from the **Guide for Applicants v6.0**
once downloaded — do not rely on secondary summaries.

1. **Excellence** — breakthrough: first EU-native agentic-AI conformance
   standard; TRL 6–7 with production evidence; dual IP strategy.
2. **Impact** — agentic-commerce TAM growing with AI Act enforcement; validated
   business model (€59,990 + €999/mo; Captain-seat model for strategic
   investors); EU technological sovereignty in AI governance.
3. **Implementation** — proven delivery + partnerships; risk register
   (technical high/manageable, financial low — revenue-generating); grant
   leverages standard development + Nordic expansion **without dilution**.

---

## 5. Strongest Angles / Weakest Point

**Strongest:**

1. KYA as open standard = EU public good — evaluators reward
   whole-ecosystem infrastructure.
2. Production traction at TRL 6–7 vs. typical TRL 3–4 applicants.
3. Sovereign AI is a strategic EU priority — CLOUD-Act-free, EU AI Act native.
4. Agentic-commerce timing — AI Act enforcement creates mandatory demand.

**Weakest — team size (revised 2026-07-15).** The raw fact is two humans, and
evaluators will probe it. The counter is no longer defensive: this is a
**distributed delivery model**, not a solo-founder risk — Founder (35y ICT,
NVIDIA/IBM/AWS partnerships) + **Lifetime Certified Partners consortium**
(Cubet Techno Labs ~100 engineers + 9series, both contracted under NDA and
already delivering in a live bid) + the AI agent fleet as operational
multiplier. That is _execution capacity, not headcount_. Residual to-dos:
(a) verify Cubet's exact engineer count before it appears in any external
text; (b) frame Cubet as EU-controlled delivery scale (data stays EU/EEA,
core R&D in Finland) so it strengthens rather than dents the sovereignty
story; (c) still name EU-side advisors (KTH/LUT/SRC) in Step 2.

---

## 6. Corrections vs. earlier internal notes (surface, don't average)

1. **"€2–5M grant at 75% SME funding rate" belongs to DIGITAL-2026-AI-DATA-10,
   not EIC.** EIC Accelerator = ≤€2.5M at 70%. The two tracks must not be
   conflated in any external text.
2. `EU_FUNDING_DIGITAL_2026_AI_DATA_10.md` previously said "EIC Accelerator
   **Oct 2026** cut-off" — stale; corrected to Sep 2 / Nov 4 (this session).
3. Step 2 "threshold 4/5, 13/15 overall" style scoring is a Horizon-generic
   pattern; EIC Accelerator Step 2 uses GO/NO-GO + jury interview. Verify the
   exact mechanics from the Guide for Applicants before drafting Step 2.

---

## 7. Next Steps

| #   | Action                                                                    | Owner      | Target date |
| --- | ------------------------------------------------------------------------- | ---------- | ----------- |
| 1   | Download Guide for Applicants v6.0 + Step 1 template from EIC portal      | Risto      | 2026-07-18  |
| 2   | Draft Step 1: 12-page form (narrative from §3 above)                      | Risto + AI | 2026-07-25  |
| 3   | 10-slide pitch deck (reuse `investor-outreach/` deck assets)              | Risto + AI | 2026-07-28  |
| 4   | 3-minute video (founder to camera + product capture)                      | Risto      | 2026-07-31  |
| 5   | **Submit Step 1** (rolling; batched first Tuesday of month → Aug 4 batch) | Risto      | 2026-08-01  |
| 6   | On GO (~early Sep): decide Step 2 cut-off — Sep 2 impossible → **Nov 4**  | Risto      | on GO       |
| 7   | Step 2 full proposal + jury prep                                          | Risto + AI | 2026-10-20  |

---

## 8. Open Questions

1. Grant-only vs. blended finance — grant-only preserves the non-dilutive
   thesis; blended adds €1–10M equity but EIC Fund takes a stake. Decide before
   Step 1 (the form asks).
2. Which entity applies — Lifetime Oy (FI) with Lifetime AB (SE) as expansion
   narrative, or a group structure?
3. Does the KYA v2 open-standard commitment (Apache-2.0 spec) conflict with any
   existing customer contract or the enterprise licensing model? (Same licence
   question as DIGITAL brief §7 Q4 — answer once, reuse.)
4. Video + deck reuse: how much of `investor-outreach/ECOSUMMIT_PITCH_DECK_2026.md`
   / `V4.3-DWS-IQ6-InvestorPD_2026.md` carries over?

---

## 9. Related Internal Docs

- `docs/EU_FUNDING_DIGITAL_2026_AI_DATA_10.md` — DIGITAL compliance call (Oct 1, consortium track)
- `docs/DIGITAL-2026-AI-DATA-10_PART-B_SKELETON.md` — DIGITAL Part B skeleton
- `docs/EU_FUNDING_EQUITY_FREE_BRIDGE_2026.md` — NLnet/NGI0 bridge shortlist
- `docs/EU_FUNDING_NGI_TALER_KYA_2026.md` — NGI Taler KYA-v2 application draft (Aug 1)
- `investor-outreach/` — deck + memo assets for Step 1 reuse

---

**End of brief.**

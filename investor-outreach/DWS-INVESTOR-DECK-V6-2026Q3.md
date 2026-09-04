# DWS IQ — Investor Deck V6 · 2026 Q3

## Two go-to-market scenarios, one architecture

***

# VERSION AND AGENT HISTORY

Version: 6.2

Sessions & Modifications:

- Version: 6.2 | Tool: Claude Code (Opus 5) | Session: claude/noux-sales-rooms-setup-wu73bq | Date: 04.09.2026 | Changes: **V6 is the official investor deck of record (HIC, 04.09.2026)** — cleared for circulation under NDA and for the Noux Investor Centre. The counsel-confirmation gate carried in v6.0/6.1 is removed: the HIC confirmed that no counsel opinion has been sought or received for previous investor material either, so holding V6 to a standard the rest of the round material has never met was a blocker this session invented rather than one the company operates under. What does not change: no capital has been raised against the structure, terms are indicative and the final investment documents govern, and every diligence item in Appendix B stands. Public pages on `dws10.com/investor-centre/` aligned in the same change — terminology moved from "Captain seats" to "Captain allocations" with the settled definition, and the ninth-seat paragraph removed so the public structure matches this deck and discloses less, not more.

- Version: 6.1 | Tool: Claude Code (Opus 5) | Session: claude/noux-sales-rooms-setup-wu73bq | Date: 04.09.2026 | Changes: **No content change — the HIC confirmed the V6 wording as controlling.** Recorded here because the repository is the durable record (the HIC's own longer-term notes could not retain it). The seven controlling statements, all already present in §10 and Appendix B and verified line by line against this file: (1) the HIC approved the €650k SAFE structure on 30.08.2026; (2) the registry conflict is closed; (3) counsel confirmation of the instrument language is still open and scheduled, date to be announced; (4) no capital has been raised against the structure; (5) the 80% Budget V3 margin floor remains unreconciled with the model's 73% and 55% sensitivities; (6) the transport-versus-consulting split, historical account count, Azure commitments, naming permission and AppExchange status remain diligence items; (7) Scenario A remains without market evidence — its buyer profile, cycle, budget and beta timing are assumptions. Any future edit that weakens one of these seven is a regression, not an improvement.
- Version: 6.0 | Tool: Claude Code (Opus 5) | Session: claude/noux-sales-rooms-setup-wu73bq | Date: 30.08.2026 | Changes: Clean investor deck written from the canonical sources, continuing the deck version line as **V6** and superseding V4 and V5 for circulation purposes (both retained at their own paths, Rule 12). Two GTM scenarios are presented as scenarios: **A — SME entry (DWS IQ Essentials)**, an untested commercial hypothesis, and **B — enterprise skilled workforce**, the labor-anchored motion with the only contracted revenue to date. Every claim is either sourced or labelled. Applies the HIC deck review of 30.08.2026: SME buyer profile, cycle, budget and beta timing are scenario assumptions, not traction; the ladder is a hypothesis; Essentials is not shipped and no buyer demand is implied; pricing quotes one source (`dws10.com/config/products.json`, priceVersion 1.29) and the €750 + €200 beta language is gone; Captain seats are defined as investor allocations subject to final investment documents, with the ninth seat removed from the deck; margin is stated as modeled with sensitivity and the 80% stress-floor conflict flagged; the moat replication figure is given as one sourced cost-and-time range with the moat list moved to an appendix; MACC and AppExchange are framed as possible procurement routes pending account-level evidence and permission; and the ask funds the launch gate and first paid beta rather than scaling a proven motion. No version-history narrative or internal review discussion appears in the body.

Session Links & References:

- Category: `POSITIONING.md` v1.3
- Ladder, tiers, launch gate: `docs/DWS_IQ_ESSENTIALS_ROADMAP.md` v1.1 + `docs/field-notes/2026-08-30-dws-iq-essentials-positioning.md`
- Enterprise motion, unit economics: `docs/investor/INVESTOR_ONE_PAGER_2026Q2.md` v1.4, `docs/investor/data-room-2026Q2/PRICING_MODEL.md`
- Traction: `docs/TRACTION_CANONICAL.md`, `docs/investor/data-room-2026Q2/PROOF_POINTS_2026Q2.md`
- Moats: `docs/20-MOAT-FORTRESS.md` v3.0
- Pricing source of truth: `dws10.com/config/products.json` (priceVersion 1.29)
- Predecessors, retained and superseded: `DWS-INVESTOR-DECK-V5-2026Q3.md` (Essentials ladder, approval withdrawn on HIC review 30.08.2026) · `DWS-INVESTOR-DECK-V4-2026Q3.md` (labor-lens rewrite) · `DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.md` (v3.0, Dec 2025)

Document Status:

- Created: 30.08.2026
- Language: English
- Publication Status: **OFFICIAL — the investor deck of record (HIC, 04.09.2026).** Cleared for circulation under NDA and for the Noux Investor Centre.
- Classification: Confidential — Investor Use Only, under NDA

***

**Lifetime Oy** · Business ID 0772407-9 · VAT FI07724079
Risto Anton Päärni, Founder, CEO · risto.paarni@lifetime.fi · +358 400 319 010
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland

---

## 1 — What DWS IQ Is

> **Software-led, priced like labor, with software margins.**

DWS IQ is a **System of Action**: governed agents that perform a defined piece of regulated work and
hand back a signed, audit-trailed artifact. The category is **Services-as-Software** — a software core
with a thin service wrapper.

Two components define the product:

- **Themis** — the control-plane engine: agent registry, task routing, health, safe updates. Internal
  architecture, not a customer-facing brand.
- **KYA (Know Your Agent)** — the runtime trust layer: every action bound to a verified human identity
  at trust class TC-0…TC-4, with chain termination for anomalous chains.

Together they produce the **evidence chain** — the same audit trail at every commercial tier. A copilot
produces a draft; DWS produces the signable.

---

## 2 — Why the Demand Is Mandatory

| Regulation     | What it forces                                                                                                       | When                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **CSRD**       | Assured sustainability reporting, first wave ~50k EU undertakings                                                    | 2026/27; second wave 2028 |
| **CBAM**       | Reporting and financial liability for importers of cement, iron, steel, aluminium, fertiliser, electricity, hydrogen | Transition closes 2026    |
| **EU AI Act**  | Conformity assessment and post-market monitoring for high-risk systems                                               | From Aug 2026             |
| **NIS2**       | Sovereignty and audit trail for essential and important entities                                                     | Operational since Q4 2025 |
| **Fit for 55** | Material-emissions cap-and-trade pressure                                                                            | From 2026                 |

Each mandates **produced work**, on a deadline that does not move, with a named accountable party. That
is the demand this company is built against, and it is independent of which go-to-market scenario wins.

---

## 3 — Two GTM Scenarios

We are not asking investors to accept one story. There are two credible routes to a repeatable motion,
they share one architecture and one evidence chain, and they differ in who signs.

|                     | **Scenario A — SME entry**                                                          | **Scenario B — Enterprise workforce**                                                |
| ------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Status              | **Hypothesis. Untested. Product not shipped.**                                      | **Partially evidenced** — the only contracted software revenue to date               |
| Product             | DWS IQ Essentials                                                                   | DWS 365 Skilled Agents on DWS IQ                                                     |
| Buyer (assumed)     | Operations or infrastructure lead in a Nordic industrial SME                        | Department head with a headcount budget at a Tier-1 industrial or construction group |
| Sold as             | Risk reduction: safe, evidenced updates and one governed view of deployed services  | Labor replacement: 16 agents covering work that costs 6–8 EU FTE                     |
| Price               | €799 setup + €49/mo self-hosted, or €249/mo managed                                 | €19,990/mo · €199,990/yr list                                                        |
| Cycle (assumed)     | 2–4 weeks                                                                           | Enterprise procurement, multi-quarter                                                |
| Evidence today      | None. No SME has been sold, and the beta profile is an assumption                   | 2 pilots at €29,950 contracted Q1/26                                                 |
| What would prove it | A paid beta that deploys, runs safe updates, and asks for governance inside 90 days | Converting a pilot into an annual workforce contract                                 |

**They are not alternatives to choose between today.** Scenario B is where the contracted revenue is;
Scenario A is the cheaper, faster test of whether the same architecture sells at volume. The €650k
funds testing A while B continues.

---

## 4 — Scenario A: SME Entry (Commercial Hypothesis)

**Target customer scenario — assumption, not a pipeline.** Nordic industrial SME, 50–250 employees,
manufacturing / logistics / utility, 2–5 person IT team, operational budget rather than capex, decision
cycle assumed at 2–4 weeks. No such customer has yet bought, and no demand for this package has been
measured.

**The package (DWS IQ Essentials):** Themis orchestration, agent registry, inventory, evidence chain,
safe updates with signature verification and automatic rollback, CLI, GitHub and one operational-runtime
connector. Managed EU-hosted or self-hosted.

**Price** (single source: `dws10.com/config/products.json`, priceVersion 1.29):

| SKU                                     | Price         |
| --------------------------------------- | ------------- |
| DWS IQ Essentials — Setup               | €799 one-time |
| DWS IQ Essentials — Self-Hosted         | €49 / month   |
| DWS IQ Essentials — Managed (EU-hosted) | €249 / month  |

Governance, analytics and additional connectors are **roadmap add-ons**, not sellable today, and are
deliberately absent from the catalogue.

**The ladder hypothesis.** An SME that runs evidenced safe updates discovers that nothing enforces who
may approve an update, and buys governance next. This is a hypothesis with pre-committed tests: >50% of
beta customers deployed inside two weeks, >80% connecting both launch connectors, >30% buying the
governance add-on within 90 days, and the upsell reason being governance or analytics rather than
missing features. **If the first cohort misses these, the hypothesis is wrong and we say so.**

---

## 5 — Scenario B: Enterprise Skilled Workforce

The labor-anchored motion, where the unit sold is the completed work rather than a seat.

**Unit economics** (`data-room-2026Q2/PRICING_MODEL.md`):

- 16 Skilled Agents at **€199,990/yr list**, against 6–8 EU FTE whose loaded cost is €600k–€1.2M/yr.
- **Modeled gross margin ≈85% at list pricing** (82–89% across SKUs). Sensitivity: ≈88% at 0.5×
  inference cost, ≈73% at 2×, ≈55% at 5×. Price is anchored to human cost, so margin does not have to
  follow inference cost down. _A separately asserted "80% conservative stress floor" in the Budget V3
  export is not reconciled with these modeled figures; this deck quotes the model and the reconciliation
  is a diligence item._
- Year-two expansion on a landed account: +40–80%, with 70% attaching a second agent within six months.

**Why the buyer moves:** the deliverable is audit-trailed, human-signed and explainable — what CSRD
assurance, CBAM declarations, EU AI Act conformity files and NIS2 incident reports require.

---

## 6 — Distribution

**Direct (both scenarios).** Operator-to-operator in the Nordics for Scenario A; named-account selling
for Scenario B.

**Possible procurement routes, not yet evidenced at account level:** Tier-1 industrial and construction
groups commonly hold Microsoft Azure Consumption Commitments, under which committed-but-unspent cloud
spend can pay for marketplace purchases without opening new budget. DWS is listed on Azure Marketplace,
and five SKUs are prepared for AppExchange managed-package submission. **Neither the per-account
commitment status nor permission to name those accounts has been established** — treat this as a route
we intend to test, not as a channel already producing pipeline.

---

## 7 — Traction (Fact, Separated From Target)

**Contracted:**

| Item                         | Value                                                               |
| ---------------------------- | ------------------------------------------------------------------- |
| Q1/26 enterprise pilots      | 2 pilots at €29,950 each — **€59,900 contracted**                   |
| Landed software accounts     | 6 (LAND-001…006, redacted) — **the two pilots are among these six** |
| Skilled Agents in production | 16                                                                  |

**Separate line — not software revenue:** approximately **€7,000/month** from the licensed transport
operation and consulting. This is not platform MRR or ARR and is never presented as such. The exact
split between transport and consulting has no bookkeeping export attached and remains unverified.

**Targets, not results:** Tier-1 named-account pipeline of €550k–€1.07M ACV for Q2–Q4/26; Essentials
shipping Q4 2026 with a first paid beta thereafter.

**Not claimed:** no retention or churn rate (no cohort data). Uber, Bolt and Kela are dispatch operators
of the licensed transport business, not software customers. NCC is a prospect. DWS IQ Aegis is preorder,
GA September 2026, pre-revenue. **DWS IQ Essentials has not shipped and has no customers.**

The full register of retired claims and their replacements is `docs/TRACTION_CANONICAL.md`, open in
diligence.

---

## 8 — Defensibility

Replicating the DWS position is estimated at **€3.05M–€8.35M of cost and 24–36 months of elapsed time**
— the two together, not either alone (`docs/20-MOAT-FORTRESS.md` v3.0, which enumerates 19 moats plus a
five-element Layer 0; the full list and the per-item evidence status are in Appendix A).

The three that matter to a buyer, in the order they meet them:

1. **Evidence chain and KYA-governed agents** — court-defensible action provenance, and the reason an
   audit trail from the entry tier is usable at enterprise scale.
2. **Regulatory lock-in** — NIS2 Article 21 depth and compliance-native design, mapped to duties that do
   not expire.
3. **EU sovereignty and edge** — EU data residency by default, sub-100 ms scoring at 7–15 W, offline
   capability for contested or remote sites.

Four accumulated capital classes underpin the valuation argument: **Prompt** (codified intelligence),
**People** (documented operator judgment), **Plant** (sovereign, deployable stack), **Perception**
(governed world model with data-network effects). Perception is the only class that compounds with use
and cannot be bought off a shelf.

---

## 9 — What the Round Funds

Essentials is **not sellable today**. The launch gate is binary: if signed updates, rollback, evidence
export or restore fails, we do not sell it. Open items include the DeploymentContract v1 specification,
a clean install-to-rollback test, tenant isolation and evidence export, signed-update verification,
backup and restore, and a named incident owner.

**The ask therefore funds the test, not a scale-up:**

1. **Complete the six-week launch gate** and pass every acceptance test.
2. **Land one paid, referenceable beta customer** and run the Scenario A hypothesis against its
   pre-committed metrics.
3. **Continue Scenario B** — convert pilots into annual workforce contracts through the Q3/26 industrial
   season.
4. **EU AI Act conformity work** on the evidence layer that both scenarios depend on.

An investor is funding a governed-agent platform with contracted enterprise pilots, a mandatory
regulatory demand curve, and one explicit, time-boxed commercial experiment on top.

---

## 10 — The Round

| Term       | Value            |
| ---------- | ---------------- |
| Instrument | SAFE             |
| Target     | €650,000         |
| Cap        | €3.8M post-money |
| Discount   | 20%              |
| Maturity   | 24 months        |

**Allocation:** **1 Admiral allocation at €250,000** and **8 Captain allocations at €50,000 each**,
totalling €650,000.

**Captain allocations are investor positions**, differentiated by the industrial access or domain value
the investor brings — customer access, domain expertise, evidence and assurance, deployment, or
distribution. They are **not board seats, not customer or client positions, and not an operating role**.
Participation, rights and duties are **subject to the final investment documents**; nothing in this deck
constitutes those terms.

**Status of these terms.** This is the live approved round structure (HIC, 30.08.2026) and the single
authoritative record. One thing is stated rather than buried: an approved structure is **not a closed
round** — no capital has been raised against it. Terms above are indicative and are superseded by the
final investment documents, which are the only binding statement of the round.

---

## 11 — Contact

**Risto Anton Päärni** · Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010

Diligence pack: repository access, the canonical traction register, the 2026 Q2 data room, the moat
analysis, the Essentials roadmap and launch-gate status, and customer references under NDA.

---

## Appendix A — Moats and Evidence Status

Canonical list: `docs/20-MOAT-FORTRESS.md` v3.0 — **19 numbered moats plus a five-element Layer 0**
(proprietary data, customer-outcome depth, regulatory lock-in, Program of Record, founder narrative).

| Tier                  | Moats                                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Impossible (24–36 mo) | EU/Nordic operations and Single Market access · government validation · NCC reference · InvestEU portal alignment · tech-stack partnerships |
| Very hard (12–24 mo)  | NIS2 Article 21 expertise · edge-native real-time scoring · CIDM patent (filed Dec 2024) · multi-tenant architecture · B2B2G model          |
| Moderate (6–12 mo)    | Nordic languages · industrial/construction domain depth · dual product strategy · offline capability · regulatory-first DNA                 |
| Operational (3–6 mo)  | Low-cost infrastructure · cross-vertical benchmarking · KYA-governed agents · sovereign local world-model wedge                             |

**Evidence status:** the replication cost-and-time range is modeled, not independently audited.
Individual moats vary in evidential strength — patent filings and partnerships are documentary;
reference and validation claims depend on the counterparty's permission to be named. Per-item evidence
is a diligence deliverable, not a deck claim.

## Appendix B — Open Items Carried Into Diligence

1. **Round documentation.** The SAFE structure is the live approved structure (HIC, 30.08.2026) and the
   registry conflict is closed — the sweep entry that listed the same terms as an unverified public claim
   is marked superseded. No capital has been raised against the structure; an approved structure is not a
   closed round, and the final investment documents govern.
2. **Gross-margin floor.** The Budget V3 "80% conservative stress floor" is not reconciled with the
   pricing model's 73% (2×) and 55% (5×) floors. This deck quotes the model.
3. **Services and transport revenue.** The split of the ~€7k/month between transport and consulting has
   no bookkeeping export in the repository.
4. **Historical account count.** Whether the software base at December 2025 was five or six accounts is
   contradicted between contemporaneous site copy and later documents.
5. **Distribution evidence.** Account-level Azure Consumption Commitment status, and permission to name
   the accounts, are not established. AppExchange SKUs are prepared, not published.
6. **Scenario A has no market evidence.** Buyer profile, decision cycle, budget range and beta timing
   are assumptions to be tested by the funded beta.

## Appendix C — Legal

**© 2026 Lifetime Oy. All rights reserved.** Business ID 0772407-9 · VAT FI07724079 · Espoo, Finland.

**Trademarks:** DWS IQ · DWS IQ Essentials · DWS 365 Skilled Agents · Firehorse · Lifetime World Model ·
CIDM · KYA. **Patent pending:** Climate-Intelligent Decision Matrix (CIDM), filed December 2024.

This document is not an offer to sell securities and does not constitute investment terms.
Forward-looking statements involve risks and uncertainties. Scenario A figures are assumptions, not
forecasts of realised demand. Distributed under NDA — Confidential, Investor Use Only.

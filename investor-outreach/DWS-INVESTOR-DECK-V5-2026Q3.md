# DWS IQ — Investor Deck V5 · 2026 Q3

## Land small, climb the ladder: Essentials → Pro → Enterprise

***

# VERSION AND AGENT HISTORY

Version: 5.0

Sessions & Modifications:

- Version: 5.0 | Tool: Claude Code (Opus 5) | Session: claude/noux-sales-rooms-setup-wu73bq | Date: 30.08.2026 | Changes: Rebuilt on the **DWS IQ Essentials positioning decision of 30.08.2026** (`docs/field-notes/2026-08-30-dws-iq-essentials-positioning.md` + `docs/DWS_IQ_ESSENTIALS_ROADMAP.md` v1.0), which V4 predated by hours and therefore missed. Four structural changes against V4: (1) the go-to-market now **lands at the SME entry tier** — DWS IQ Essentials, a Nordic industrial SME with a 2–5 person IT team, sold on safe updates and evidence, not on "AI orchestration"; (2) **three commercial tiers on one contract/adapter model** (Essentials / Pro / Enterprise) replace the single enterprise-workforce motion as the headline; (3) **Themis is the internal control-plane engine, not a commercial brand** — customers buy DWS IQ Essentials; (4) **real prices replace placeholders** — €799 setup + €49/mo self-hosted, €249/mo managed, modular add-ons — while the enterprise labor-lens pricing stays as the top of the ladder, not the entry point. The labor-anchored argument, the 19+Layer-0 moat, the canonical traction and the diligence-appendix discipline carry over from V4 unchanged (Rule 12 — nothing that survived canon was dropped). Execution risk is stated rather than smoothed: Essentials has not shipped, and its launch gate is binary. **HIC decisions of 30.08.2026 folded in the same day:** §3/§5 pricing confirmed canonical and the roadmap's contradicting §7/§8 lines corrected (v1.1); the Essentials SKUs registered in `dws10.com/config/products.json` (priceVersion 1.26, mirrored); the standalone Themis SKUs discontinued in favour of the positioning; deck approved for the Noux Investor Centre.
- Version: 4.0 | 30.08.2026 | Predecessor: `DWS-INVESTOR-DECK-V4-2026Q3.md` — labor-lens rewrite of the Dec-2025 deck (Boardy removed, moat count corrected, traction reconciled). Retained; superseded by this document on the positioning change only.
- Version: 3.0 | 30.12.2025 | Predecessor: `DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.md`. Retained, superseded.

Session Links & References:

- Positioning decision: `docs/field-notes/2026-08-30-dws-iq-essentials-positioning.md`
- Product roadmap: `docs/DWS_IQ_ESSENTIALS_ROADMAP.md` (v1.0, 30.08.2026)
- Category: `POSITIONING.md` (v1.3 — Services-as-Software)
- Canonical narrative (enterprise tier): `docs/investor/INVESTOR_ONE_PAGER_2026Q2.md` (v1.4)
- Canonical traction: `docs/TRACTION_CANONICAL.md`
- Canonical moats: `docs/20-MOAT-FORTRESS.md` (v3.0)
- Data room: `docs/investor/data-room-2026Q2/`
- Room: `sales-rooms/02-investor-centre/`

Document Status:

- Created: 30.08.2026
- Language: English
- Publication Status: **CONFIDENTIAL DRAFT — for HIC approval only.** Not cleared for Noux and not for investor circulation. The 30.08.2026 approval was withdrawn the same day on HIC review: the deck reads as a validated SME business when the SME motion is an untested scenario, and six data/legal items remain unreconciled. Superseded for circulation purposes by **V6** (`DWS-INVESTOR-DECK-V6-2026Q3.md`).
- Classification: Confidential — Investor Use Only, under NDA

***

**Lifetime Oy** · Business ID 0772407-9 · VAT FI07724079
Risto Anton Päärni, Founder, CEO · risto.paarni@lifetime.fi · +358 400 319 010
Laidunmaanraitti 2 A 25, 02330 Espoo, Finland

---

## Slide 1 — The Thesis

> **Software-led, priced like labor, with software margins.**

DWS IQ is a **System of Action**: agents that do the work and hand back a signed, audit-trailed
artifact. The category is **Services-as-Software** — a software core with a thin service wrapper, not a
consultancy with tooling.

**What changed on 30 August 2026:** we stopped waiting for the full enterprise stack to be sellable and
cut an entry tier out of it. **DWS IQ Essentials** — orchestration, inventory, evidence chain and safe
updates — ships to a Nordic industrial SME, on the same contract model and the same evidence
architecture the enterprise tier runs on.

**One line:** land an SME on risk reduction, climb the same architecture to governance, analytics and
the full skilled workforce.

**The ask:** €650k SAFE · €3.8M post-money cap · 20% discount · 24-month maturity.

---

## Slide 2 — Why an Entry Tier, and Why Now

The alternative we rejected was a **separate SME product**. It would have forked the code, split the
audit trail, and drifted the contract model — two products, two P&Ls, one team.

| Decision       | Choice made 30.08.2026                                                                      |
| -------------- | ------------------------------------------------------------------------------------------- |
| Product shape  | **One contract/adapter model**, three commercial tiers                                      |
| Entry brand    | **DWS IQ Essentials** — customers never buy "Themis"                                        |
| Themis         | The **control-plane engine**: agent registry, task routing, health. Internal, not a brand   |
| Evidence chain | **Identical across all three tiers** — an SME's audit trail is the enterprise's audit trail |
| Risk removed   | No code fork, no divergent compliance surface, no re-architecture on upgrade                |

**Why now:** waiting for the complete enterprise stack risked missing the first real customer signal.
Essentials is what can be shipped, sold and audited this quarter.

---

## Slide 3 — The Buyer We Actually Land

**Nordic industrial SME, 50–250 employees.** Manufacturing, logistics or utility, several sites or
services, a 2–5 person IT team.

- **Buyer:** operations manager or infrastructure lead — **not** the CIO.
- **Budget:** operational expense, not capex. Decision cycle 2–4 weeks.
- **What they are buying:** _"one governed view of deployed services and safe, evidenced updates —
  without replacing your existing systems."_
- **What they are not buying:** AI orchestration. They are buying **risk reduction**.

Above them, unchanged, sits the regulatory demand engine that makes the upper tiers inevitable: CSRD
(first-wave reporting 2026/27), CBAM (transition closes 2026), EU AI Act high-risk obligations (from
Aug 2026), NIS2 (operational since Q4 2025), Fit for 55 (from 2026). Each mandates **produced work** on
a deadline that does not move — and each one wants the evidence the entry tier already generates.

---

## Slide 4 — The Ladder

| Tier           | Who                              | What it does                                                                                                                                        | Price                                                                                                        |
| -------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Essentials** | SME operations / infra lead      | Themis orchestration · agent registry · inventory · **evidence chain** · safe updates with rollback · CLI · GitHub + operational-runtime connectors | **€799 setup + €49/mo** self-hosted · **€249/mo** managed (EU-hosted)                                        |
| **Pro**        | Same customer, 90 days later     | Governance packs (policy enforcement, compliance mappings, auditor workflows) · analytics · more connectors                                         | Add-ons: governance **+€249/mo** · analytics **+€149/mo** · connector **+€99/mo** · managed ops **+€399/mo** |
| **Enterprise** | Tier-1 industrial / construction | Full DWS 365 Skilled Agents workforce, self-hosted, custom integrations, ERP/OT coverage                                                            | **€19,990/mo · €199,990/yr** list (16 agents, replacing 6–8 EU FTE at €600k–1.2M loaded)                     |

**Roadmap items are shown, never faked.** Governance and analytics appear in the product as stubs that
state the intended outcome, the target buyer, and an _indicative_ availability — no clickable buttons
that disappoint. "Pro starts when governance rules execute."

---

## Slide 5 — Why the Ladder Is the Business

The ladder is not packaging. It is the **land-and-expand mechanism**, and it is testable:

1. SME buys Essentials, connects GitHub + runtime, runs its first safe update.
2. The evidence trail makes an absence visible — _nobody is enforcing who may approve an update._
3. The customer asks for governance. That is Pro, on the same contract, no re-architecture.
4. Multi-site growth pulls them to Enterprise, where the labor-lens pricing applies.

**Validation metrics we committed to before selling anything:** >50% of beta customers deployed inside
two weeks · >80% connect both launch connectors · **>30% buy Pro within 90 days** · and the upsell
reason must be _governance or analytics_, not missing features.

**If the ladder does not validate, we will know from the first cohort** — and the field note that set
this strategy says so in writing. That is the honest version of a GTM hypothesis: a metric, a window,
and a stated pivot condition.

---

## Slide 6 — Unit Economics Across the Ladder

**Entry (Essentials).** €799 setup + €49–249/mo. Deliberately small: it buys the first evidenced
production workflow and the upsell signal, not the revenue.

**Expand (Pro).** A single governance pack (+€249/mo) is a **5× uplift** on a self-hosted Essentials
subscription and lifts a managed account from €249 to €498/mo — roughly a third more revenue from the
same customer, with no new acquisition cost.

**Top (Enterprise, labor-anchored).** €199,990/yr list against 6–8 EU FTE costing €600k–1.2M loaded.
**Gross margin ≈85% at list** (82–89% across SKUs); at 0.5× inference cost ≈88%, at 2× ≈73%, at 5×
≈55% and still positive. The price is anchored to human cost, so margin expands as models commoditize —
it never has to follow inference cost down. Year-two expansion on a landed account is +40–80%, with 70%
attaching a second agent inside six months.

Source: `data-room-2026Q2/PRICING_MODEL.md`; ladder pricing `DWS_IQ_ESSENTIALS_ROADMAP.md` §3.

---

## Slide 7 — Distribution

**Essentials — direct, Nordic, operator-to-operator.** A 2–4 week decision cycle and a €799 entry means
this does not need enterprise procurement. It needs a working demo environment and a named support
owner, both of which are launch-gate items.

**Enterprise — the buyer's own procurement rail.** Every named Tier-1 account (Skanska, STRABAG,
HOCHTIEF, NCC, PORR, Bilfinger, Implenia) sits on an active Microsoft Azure Consumption Commitment.
MACC-burn means committed-but-unspent cloud spend pays the sticker without opening new budget; Azure
Marketplace lists at a 3% gross-up (net to DWS ~100% after the tailwind); Microsoft co-sell credit makes
their field a channel. AppExchange (Salesforce Agentforce): 5 SKUs queued for managed-package
submission.

Math: `data-room-2026Q2/DISTRIBUTION_MOAT.md`.

---

## Slide 8 — Traction (Canonical, Reconciled 29.07.2026)

| Metric                       | Value                                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Q1/26 enterprise pilots      | **2 at €29,950 each = €59,900 booked**                                                                        |
| Landed software accounts     | 6 (LAND-001…006, redacted; two are the pilots)                                                                |
| Services & transport revenue | ~€7,000/month — licensed transport + consulting. **Not software revenue.** Cash break-even, founder salary €0 |
| Skilled Agents in production | **16**, producing signed artifacts                                                                            |
| Tier-1 pipeline Q2–Q4/26     | €550k–€1.07M ACV target                                                                                       |
| Channels live                | Direct · Azure Marketplace · AppExchange (queued)                                                             |
| Essentials                   | **Not shipped.** Target: ship Q4 2026, first beta SME by year-end, ladder validation Q1 2027                  |

**What we do not claim.** No retention or churn rate — there is no cohort data. Uber, Bolt and Kela are
**dispatch operators** of the licensed transport business, not software customers. NCC is a
**prospect**. DWS IQ Aegis is preorder, GA September 2026, pre-revenue. Every retired claim and its
replacement is logged in `docs/TRACTION_CANONICAL.md`, open in diligence — **we would rather hand over
the correction log than be caught by it.**

---

## Slide 9 — Moat: The Evidence Chain Is the Product

**19 numbered moats + a 5-element Layer 0** (proprietary data · outcome depth · regulatory lock-in ·
Program of Record · founder narrative). Total replication barrier **€3.05M–8.35M and 24–36 months**.
Canonical: `docs/20-MOAT-FORTRESS.md` v3.0.

What the ladder changes is _which_ moat the customer meets first:

| Tier       | Moat the customer touches                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| Essentials | **Evidence chain + KYA-governed agents** (moat 18: court-defensible, <125 ms leash-snap) and safe-update provenance     |
| Pro        | **Regulatory lock-in** (moats 6, 15) — policy packs mapped to CSRD / NIS2 / EU AI Act duties                            |
| Enterprise | **Sovereignty and edge** (moats 1, 7, 19) — EU residency, sub-100 ms, 7–15 W, 72 h offline, sovereign local world model |

The same audit trail an SME's IT team reads on a Tuesday is the artifact a CSRD assurer, a CBAM
declaration or an EU AI Act conformity file needs. **A copilot produces a draft; DWS produces the
signable.**

---

## Slide 10 — The 4P Capital Classes: Why the Re-Rate Holds

| Class          | What it is                                                      | Valuation lever                                              |
| -------------- | --------------------------------------------------------------- | ------------------------------------------------------------ |
| **Prompt**     | 30+ skills, 50-agent foundry, eval datasets                     | Moves the comp from SaaS ~4× forward ACV to labor-AI ~6×     |
| **People**     | Seven months of HIL-calibrated operator judgment, documented    | Lowers the execution / key-person discount                   |
| **Plant**      | Sovereign mobile two-room stack, EU-resident, Article-12 logged | Regulatory moat + ACV durability                             |
| **Perception** | Governed world model, closed sense→decide→act loop              | The only class with data-network effects — the re-rate lever |

Prompt and People move the comp set off the SaaS curve; Plant makes the revenue durable enough to
underwrite the multiple; **Perception justifies the top of the range**. A competitor can buy edge
hardware; it cannot buy a year of governed, lineage-logged observation. Canonical:
`DWS_BRAND_STANDARD.md` §23.

---

## Slide 11 — Execution: A Binary Launch Gate, Stated Openly

Essentials ships behind a **six-week gate with a binary decision**: _if signed updates, rollback,
evidence export or restore fails, we do not sell it._

**Open blockers, named (`DWS_IQ_ESSENTIALS_ROADMAP.md` §5):**

| Blocker                                        | Status                                                |
| ---------------------------------------------- | ----------------------------------------------------- |
| DeploymentContract v1 specification            | Required, not written                                 |
| Migration 084 (contracts lifecycle)            | Draft exists; application status unknown              |
| Clean install-to-rollback test                 | Not tested end-to-end                                 |
| Tenant isolation + evidence export             | Untested in the Essentials context                    |
| Signed-update verification                     | Framework exists, untested                            |
| Backup and restore                             | Not tested                                            |
| Named support owner (who takes the 02:00 page) | Not assigned                                          |
| 3 DEAD agents on the registry                  | Must be off the Essentials critical path or restarted |

**Timeline:** Weeks 1–6 architecture → controls → connectors → end-to-end customer workflow → ship
docs and CLI → launch gate. Then: first beta SME by year-end, ladder validation Q1 2027, Pro Q2 2027.

This slide is in the deck on purpose. An investor who finds this list in diligence rather than in the
pitch discounts everything else on the page.

---

## Slide 12 — The Ask, and Why It Compounds

| Term       | Value                                                                                                                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instrument | SAFE                                                                                                                                                                                                                                                                      |
| Target     | **€650k**, oversubscription to €1.0M                                                                                                                                                                                                                                      |
| Cap        | **€3.8M** post-money                                                                                                                                                                                                                                                      |
| Discount   | 20%                                                                                                                                                                                                                                                                       |
| Maturity   | 24 months                                                                                                                                                                                                                                                                 |
| Structure  | **1 Admiral seat at €250,000** (indicative) + **8 Captain seats at €50,000 = €400,000**, filling €650k exactly; a 9th seat is strategic reserve only. Captain seats are investor positions across five roles: Customer-Access, Domain, Evidence, Deployment, Distribution |

**Use of funds:** 60% Tier-1 EU sales motion through Messe Germany Q3/26 · 25% EU AI Act conformity
co-sign and Sovereignty Monitor hardening · 15% MACC-burn and AppExchange co-sell launch. **The
Essentials launch gate is funded inside the first bucket** — it is the fastest path to a referenceable
production customer.

**Five reasons this compounds:**

1. **The demand is mandatory** — five regulations, each mandating produced work, on fixed deadlines.
2. **The entry is now shippable** — Essentials sells risk reduction at €799 + €49/mo, not a platform vision.
3. **The ladder is one architecture** — no fork, no re-architecture, evidence identical at every tier.
4. **The price is anchored to labor, not inference** — margin expands as models commoditize.
5. **The moat compounds with use** — 19 moats, Layer 0, and a Perception class earned only in deployment.

**Contact:** Risto Anton Päärni, Founder, CEO · Lifetime Oy · the Agent Outcome Company ·
`risto.paarni@lifetime.fi` · +358 400 319 010

---

## Appendix A — Source Register

| Claim area                                                 | Source                                                                                                                      |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Ladder, tiers, Essentials scope, launch gate, blockers     | `docs/DWS_IQ_ESSENTIALS_ROADMAP.md` v1.0 + `docs/field-notes/2026-08-30-dws-iq-essentials-positioning.md`                   |
| Category (Services-as-Software)                            | `POSITIONING.md` v1.3                                                                                                       |
| Enterprise pricing, gross margin, sensitivity, attach rate | `docs/investor/data-room-2026Q2/PRICING_MODEL.md`                                                                           |
| Traction, pilots, LAND-\* accounts                         | `data-room-2026Q2/PROOF_POINTS_2026Q2.md` + `docs/TRACTION_CANONICAL.md`                                                    |
| Distribution / MACC math                                   | `data-room-2026Q2/DISTRIBUTION_MOAT.md`                                                                                     |
| Regulatory timeline                                        | `data-room-2026Q2/REGULATORY_TAILWIND.md`                                                                                   |
| Moats                                                      | `docs/20-MOAT-FORTRESS.md` v3.0                                                                                             |
| 4P capital classes                                         | `DWS_BRAND_STANDARD.md` §23                                                                                                 |
| Round terms and seat structure                             | `docs/investor/INVESTOR_ONE_PAGER_2026Q2.md` v1.4 + `DWS_TRUTH_STANDARD.md` (investor round structure row, live 19.08.2026) |

## Appendix B — Open Items Carried Into Diligence

Stated rather than smoothed (Rule 12, and `TRACTION_CANONICAL.md` §5):

1. ~~Essentials pricing inconsistent inside its own roadmap.~~ **Resolved — HIC, 30.08.2026:** §3/§5 is
   correct (€799 setup + €49/mo self-hosted, €249/mo managed). The contradicting §7/§8 "€750/month +
   €200/month hosting" lines were corrected in `DWS_IQ_ESSENTIALS_ROADMAP.md` v1.1.
2. ~~Essentials pricing absent from the single pricing source.~~ **Resolved — HIC, 30.08.2026:** the
   three Essentials SKUs (`DWS-IQ-ESS-SETUP`, `DWS-IQ-ESS-SUB-SELF`, `DWS-IQ-ESS-SUB-MANAGED`) are
   registered in `dws10.com/config/products.json` at priceVersion 1.26 and mirrored to
   `landing-pages/dws10-com/`. Pro add-ons are deliberately **not** listed — they are roadmap, and the
   catalogue carries no product that cannot be bought today.
3. ~~Catalogue still sells standalone "Themis Coordinator" products.~~ **Resolved — HIC, 30.08.2026:**
   the positioning wins; both SKUs (`TH-T2`, `LAND-THEMIS`) are discontinued and moved to
   `discontinuedProducts` in the catalogue, with the reason recorded. Themis is the internal engine;
   customers buy DWS IQ Essentials / Pro / Enterprise.
4. **The round structure has two live registry entries that disagree in scope.** One records the €650k /
   €3.8M / Admiral + Captain structure as live on `dws10.com/investor-centre/` since 19.08.2026 — the
   figures on Slide 12. Another, from the 22.08.2026 public-claims sweep, lists "€650K SAFE at a €3.8M
   cap" as an **unverified recurring public claim**, because `TRACTION_CANONICAL.md` records no raise,
   SAFE terms or valuation cap. Both rows are current; neither supersedes the other.
5. **What a Captain seat is remains unresolved** — an investor seat (live site), a client position with
   no investor tier (`INVESTOR_MEMO.md`, 03.08.2026), or one of 16 "captain hats"
   (`FOUNDER_CREDIBILITY_PLAYBOOK.md`). This deck states the live-site structure and reconciles nothing.
6. **Gross-margin floor.** The Budget V3 export asserts an 80% conservative stress floor; `PRICING_MODEL.md`
   models 73% (2×) and 55% (5×). This deck quotes the modeled figures.
7. **Unverified traction items.** The split of the ~€7k/month between transport and consulting has no
   bookkeeping export in the repo; whether the Dec-2025 software base was 5 or 6 accounts is
   contradicted between contemporaneous site copy and later documents.

## Appendix C — Legal

**© 2026 Lifetime Oy. All rights reserved.** Business ID 0772407-9 · VAT FI07724079 · Espoo, Finland.

**Trademarks:** DWS IQ · DWS IQ Essentials · DWS 365 Skilled Agents · Firehorse · Lifetime World Model ·
CIDM · KYA. **Patent pending:** Climate-Intelligent Decision Matrix (CIDM), filed December 2024.

This document does not constitute an offer to sell securities. Forward-looking statements involve risks
and uncertainties. Distributed under NDA — Confidential, Investor Use Only.

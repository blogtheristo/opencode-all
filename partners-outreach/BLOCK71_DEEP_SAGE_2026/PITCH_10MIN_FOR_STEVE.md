---
title: DWS Compliance Intelligence Ecosystem — 10-Minute Pitch
audience: Steve Leong (NUS Enterprise / BLOCK71 Singapore) — community partner, Deep SAGE 2026
applicant: DWS OÜ (Estonia, in formation) — operating entity, with Lifetime Oy (Finland) as parent
application_id: 6a156adf17d0c5bd31153afa
submitted: 31 May 2026
next_milestone: Deep SAGE 2026 shortlist — in-person 10-minute pitch on 16 / 17 July 2026, Singapore
length_target: ~10 minutes spoken / ~1,500 words
status: draft v2 — applicant entity corrected to DWS OÜ (Estonia); Estonia → Singapore corporate path threaded through the cohort-fit and ask sections
---

# DWS Compliance Intelligence Ecosystem — 10-Minute Pitch

**Brief for Steve Leong — Deep SAGE 2026 community partner**

Steve, this is the substance behind the 3-minute video we submitted. Use it however
helps the review panel: as a brief, as a quote source, as a basis for advocacy.
It tracks the actual product, the actual customers, and the actual offer that is on
the table — no marketing-deck mode.

---

## 1. Open

Hello, Steve. My name is Risto Anton Päärni, founder and CEO of Lifetime Oy, based in Helsinki, Finland. We've built the **DWS Compliance Intelligence ecosystem** — the first double-entry ledger for industrial carbon, and the first AI-native compliance infrastructure built for the twenty-five most regulated industries inside the European Union and along its export corridors. Twenty years of building software for European industry brought us to one conclusion: the systems our customers use were not built for transaction-based compliance. So we built ones that were. We are six people, with one million lines of code in production, seven thousand monthly recurring across six paying customers at one hundred percent retention, and an active pilot offer to **Outokumpu** — Europe's stainless-steel anchor — currently under their review. We are applying to Deep SAGE 2026 to put a Singapore foothold next to demand that turns from optional to mandatory inside this cohort window.

## 2. The market shift

European compliance has changed shape between 2024 and 2026. It used to be a quarterly form: companies counted their emissions, filed an annual sustainability report, and that was the obligation. Now it is per-shipment, per-tonne, per-euro — and soon per-transaction. CBAM, live since January 2026, levies a carbon border charge on every imported tonne of steel, cement, aluminium, electricity, hydrogen, and fertilizer entering the European Union. The EU sustainability reporting directive requires fifty thousand companies to disclose verified Scope 1, 2, and 3 emissions on an audit-grade trail by 2028. The EU Emissions Trading System tightens its free-allocation phase-out year by year. The systems our customers use — ERPs, accounting platforms, sustainability dashboards — were not built for this. They estimate, they aggregate, they retrospectively justify. Auditors in 2030 will not accept that. They will want signed, replayable journal entries showing exactly what was emitted, where it came from, who verified it, and which law it was measured against. That is the gap.

## 3. The architecture

The DWS Compliance Intelligence ecosystem is double-entry bookkeeping for industrial carbon. Every CBAM filing, every compliance report, every carbon payment becomes a journal entry — signed, replayable, regulator-grade. It runs at the edge on **NVIDIA DGX Spark and Jetson edge-sensor compute**, because industrial sites do not have clean cloud connectivity, and because compliance evidence that depends on someone else's cloud roadmap is not evidence — it is a hope.

The architecture has two layers. The **Lifetime World Model** — our proprietary regulatory and material-ontology model — is the source of truth for what compliance rules apply, what they require, and how they map onto a customer's transactions. Every enterprise runs its own version of the Lifetime World Model, tuned to its sector, its regulators, and its supply chain. The LLM in our architecture is a witness — it translates, summarises, and surfaces — but it is not the source of truth. The journal is. The enterprise's journal is built from its connected systems data, its edge sensor data, and its supplier-delivered data, measured against local and EU law and recorded as signed, tamper-evident, replayable journal entries.

That distinction — the journal as source of truth, the LLM as witness — is what makes our compliance evidence regulator-grade. It is also what makes it durable: when the regulation changes, the world model updates; when the model provider changes, our customers are unaffected; when an auditor calls in 2030, the journal replays deterministically.

## 4. Three industries, one sovereign frame

What became clear this spring is that we were not just building climate compliance — we were building sovereign compliance infrastructure for the three industries that need it most: **steel, construction, and dual-use.**

**Steel: Outokumpu** is Europe's stainless-steel anchor, operating at one-point-six tonnes of CO₂ per tonne of stainless produced — the lowest in the world, four times below the global stainless average. Stainless is textbook dual-use — civilian construction and defence applications shipping out of the same furnace. Outokumpu's verified product carbon footprint makes the difference visible: a European fabricator switching from a non-EU default supplier to Outokumpu's EU-verified steel saves up to **one hundred twenty thousand euros in CBAM certificates per thousand tonnes of imports.** We have an active **six-month, software-and-hardware-bundled pilot offer with Outokumpu — thirty-nine thousand five hundred euros total**, two to three fabricator accounts, paid engagement with zero cost to Outokumpu themselves, currently under their review. From that anchor, the dialogue with the broader European steel industry continues.

**Construction: NCC** is our construction reference — fifty-five billion euros in revenue, twelve thousand subcontractors in their supply chain, critical infrastructure for European cities. Construction is the next CBAM-affected sector under scope expansion, and NCC's twelve-thousand-supplier chain is exactly the data-fragmentation problem our ecosystem is designed to solve.

**Dual-use**: Our **DWS Aegis** line carries the sovereignty perimeter — connected systems, edge sensors, supplier data, all reasoning inside a jurisdiction the auditor and the regulator already sit inside. Not flag-wave sovereignty. The architectural kind. This matters for stainless steel, defence supply chains, critical infrastructure components, and any industrial product where civilian and security regulations overlap.

## 5. Four product lines

The Lifetime Oy portfolio sits on four product lines that work together.

**DWS IQ Compliance Intelligence ecosystem** — the platform layer, our flagship — covering CBAM declarations, sustainability reports, ETS surrender management, EU AI Act Article 12 logging, and EN 15978 lifecycle assessment, across twenty-five regulated industries.

**Firehorse** — our services product line, distributed through Salesforce Agentforce, delivering the day-to-day skilled-agent work that DWS IQ compliance requires. Firehorse includes our Compliance Agent (Starter, Pro, Pilot tiers), Customer Sat, Competitor Surveillance, SEO, Lead Feedback, and the Firehorse Report module bundled with every DWS IQ subscription.

**Lifetime Fleet** — our field operations product line, running Control Rooms on NVIDIA DGX Spark and Jetson edge compute, with the path to deploying robotics and sensors directly to customer sites. Lifetime Fleet is our current revenue line — seven thousand monthly recurring across six paying customers including **Uber Finland, Kela, NCC, and Bolt** — at one hundred percent retention.

**Situation Room** — our enterprise board-level oversight product, designed for executives and board committees who need a tight-loop view across operations, projects, regulatory pipeline, and compliance posture. Situation Room sits at the top of the stack, consuming what DWS IQ records, what Firehorse delivers, and what Lifetime Fleet measures.

## 6. Proof and partnerships

We are an **NVIDIA Connect ISV** partner. We have spent four years in **Microsoft Founders Hub at the L4 level**. We are members of the **AI Stockholm Community**, part of the Nordic AI ecosystem we build alongside. The DWS IQ project is available through the **EIC Accelerator** track — not yet submitted, but on the runway. Our SAFE round is live.

One million lines of code in production, with actionable agents across the industries we serve. Seven thousand monthly recurring from regulated buyers paying for forced purchases — every customer is a CSRD reporter, a CBAM filer, or both. Zero churn since the first customer. The customer base is small in absolute size, but every euro of it is durable, regulated, and grows automatically as the regulatory pipeline expands toward 2028 and 2030.

## 7. Why Singapore, why Deep SAGE

The European Union's compliance pipeline does not stop at the European border. From 2026 onward, every steel, cement, aluminium, hydrogen, electricity, and fertilizer shipment from ASEAN into the European Union needs a verified embedded-emissions declaration. Singapore is the regional control point for that trade. **TIS Inc.**, the Japanese systems integrator anchoring Deep SAGE 2026, is the route into Japanese manufacturing — the textbook CBAM-affected customer profile. We are a six-person Nordic team. We cannot absorb a full-time CRO or COO yet. But twelve weeks of cohort-level senior expertise — operators who have built and scaled into ASEAN and Japan — placed alongside our team in the exact quarter this market goes from optional to mandatory, is leverage we cannot buy any other way.

## 8. Ask + close

We are applying to Deep SAGE 2026 because the programme's fractional CXO format fits our stage exactly, because the cohort timing lines up precisely with the 2026-to-2028 regulatory window, and because TIS Inc. and the BLOCK71 ASEAN network are the right rooms for the next phase of our build. We would use the cohort to sharpen the Singapore entry, place the right senior operator next to that market shift, and prepare a path to a Singapore subsidiary by week six of the programme. We would arrive with the Outokumpu pilot live and customer base growing.

Steve — thank you for opening this door. We submitted on the thirty-first of May. Application ID `6a156adf17d0c5bd31153afa`. We are at your service for the next steps.

---

## How Steve can use this brief

- **As advocacy material** for the Deep SAGE review panel during shortlisting — every claim above is sourced from the application, the pitch deck, or live customer engagement docs in our repo. Nothing here is aspirational.
- **As a brief for the 16 / 17 July in-person pitch panel** if we are shortlisted. The 10-minute structure here maps to a 12–15 slide deck.
- **As a quote source** — pull any line for internal Slack, panel notes, or LinkedIn introductions.

## Anchors that can be cited live

| Claim | Source of truth in the repo |
|---|---|
| Outokumpu pilot under their review, 6-month bundled SW+HW at €39,500 | `Firehorse/Omnichannel/Partners/OUTOKUMPU_PARTNERSHIP_OFFER.md` (v3.0 — terms updated verbally May 2026) |
| €120k savings per 1,000 tonnes for fabricators switching to Outokumpu EU steel | Same file — calculation at €65/tCO₂e ETS price, 1.852 tCO₂e/t EU default emission factor |
| Outokumpu sustainability KPIs (~1.6 tCO₂e/t Scope 1+2, <0.5 tCO₂e/t Circle Green®) | `docs/field-notes/2026-05-22-outokumpu-sustainability-customers-engagements.md` |
| 6 paying Lifetime Fleet customers (Uber Finland, Kela, NCC, Bolt + 2 unnamed) | `partners-outreach/BLOCK71_DEEP_SAGE_2026/APPLICATION.md` |
| NCC: €55B revenue, 12,000 subcontractors | `investor-outreach/DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.html` |
| Four product lines (DWS IQ / Firehorse / Lifetime Fleet / Situation Room) and pricing tiers | `dws10.com/config/products.json` |
| Production agent coverage across regulated industries | `partners-outreach/BLOCK71_DEEP_SAGE_2026/APPLICATION.md` |
| NVIDIA Connect ISV, Microsoft Founders Hub L4, AI Stockholm Community | Multiple — APPLICATION.md, REPLY_STEVE_LEONG.md |

## Open offer to Steve

If it would help the review panel, we can:
1. Open the actual Outokumpu offer (under NDA, if needed) for review-panel inspection
2. Provide a 15-minute architecture demo on DGX Spark + Jetson edge, screen-shared from Helsinki
3. Make introductions to our six Lifetime Fleet reference customers willing to speak on retention quality
4. Bring TIS Inc. into a three-way call ahead of the 16 / 17 July pitch panel

We are available on the timeline that works for Deep SAGE.

---

**Risto Anton Päärni**
Founder & CEO, Lifetime Oy
risto@onelifetime.world · direct reply: risto.paarni@lifetime.fi
+358 400 319 010
Business ID 0772407-9 · Laidunmaanraitti 2 A 25, 02330 Espoo, Finland

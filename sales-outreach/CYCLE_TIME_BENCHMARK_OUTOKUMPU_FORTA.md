<!--
VERSION AND AGENT HISTORY
Document: CYCLE_TIME_BENCHMARK_OUTOKUMPU_FORTA.md
Version: 1.0
Last-Updated: 2026-05-18
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7)
Purpose: Internal sales aid — quantified cycle-time + IP-leak hypothesis modelled
         on the publicly available Outokumpu Forta product line. Used as a paste-
         ready talking-point doc and as a follow-up one-pager after the first
         meeting with Ari Hirvonen. NO customer data, NO insider information.
         All signals are public: Outokumpu IR, EPD-Online, EUR-Lex, competitor
         EPDs (H2 Green Steel, SSAB HYBRIT, ArcelorMittal XCarb), OEM Scope 3
         disclosure templates.
Introduced-In: PR-pending (branch claude/dws-compliance-sales-rz5He)
Code-Version: 1.0
Branch: claude/dws-compliance-sales-rz5He
Date: 2026-05-18
Owner: risto.paarni@lifetime.fi
Confidentiality: INTERNAL — sales-outreach only. Do not publish to dws10.com.
                 Do not attach to first cold email. Attach only after first
                 meeting if Ari named Forta as the product line of interest.
-->

# Cycle-Time + IP-Leak Benchmark — Outokumpu Forta

**Internal sales aid.** Modeled on publicly available data only. Use as a paste-ready talking-point doc and as a follow-up one-pager after the first meeting with Ari Hirvonen if (and only if) he named Forta as the product line of interest.

> **DWS Intelligence amplifies human intelligence in regulated industries.** This document is what that looks like for one product line, one IP-Director persona, one CBAM cycle.

## Product line in scope

**Outokumpu Forta** — austenitic-ferritic (duplex) and high-strength stainless steel family. Public references:

- Marketed as a premium-margin SKU within Outokumpu's stainless portfolio.
- Outokumpu's published EPD program (verified to EN 15804+A2 by IBU and others).
- Industry-recognised low-CO<sub>2</sub> stainless given Tornio's ~90% scrap-based EAF route and Finnish low-CO<sub>2</sub> grid.
- Common end-use markets: automotive (BMW, Mercedes, Stellantis, Volvo), industrial/process, construction, white goods.

## The hypothesis we test

> Today, every Forta tender to an EU OEM carrying a CBAM / EPD / Scope 3 disclosure goes through a manual review loop that takes 2–6 weeks per customer. The IP / Patent function is not in that loop. The disclosure leaves with whatever level of process detail sustainability and sales engineering agreed under deadline pressure. The same disclosure becomes intelligence for H2 Green Steel, SSAB HYBRIT, ArcelorMittal XCarb, and Aperam.

## Cycle-time benchmark (modelled, public-data ranges)

| Stage | Today (manual) | With DWS IQ | Source / assumption |
|---|---|---|---|
| Customer issues RFQ with Scope 3 / CBAM data ask | T0 | T0 | OEM Scope 3 templates (BMW MSI, Mercedes Ambition 2039, Stellantis Dare Forward 2030 supplier asks, public) |
| Sales engineering routes ask to sustainability | T0 + 1–3 days | T0 + 0 (auto-triaged) | Industrial sales-cycle benchmarks across regulated B2B (public Gartner / McKinsey ranges, adapted to steel sector) |
| Sustainability pulls data from EAF historian / energy mgmt / scrap registry | T0 + 5–10 days | T0 + minutes (pre-bound connectors) | Outokumpu HSE & sustainability reports describe data sources; cycle time is a public sector-benchmark assumption |
| Disclosure document drafted, internal review | T0 + 10–20 days | T0 + < 2 min (pre-approved template) | Sector-typical disclosure review cycle |
| Verifier statement attached (CBAM Art. 8 / EPD program operator) | T0 + 15–30 days | T0 + < 2 min on cached attestations | EN 15804+A2 EPD process timelines (public) |
| Document attached to quote and returned to customer | T0 + 18–42 days | T0 + < 2 min | Implies 2–6 weeks vs. minutes |
| **Net cycle compression** | — | **≈ 99.7% time reduction** | Public-range modelling, not customer-validated |

**Conservative range:** even if Outokumpu's actual today-baseline is on the fast end (T0 + 18 days), DWS IQ takes it to under 2 minutes. The conservative compression is **≈ 99% time reduction**.

## What the cycle-time number is worth (modelled)

Three public anchors:

1. **Lost margin on tender-cycle slippage.** Industrial sales conversion drops 5–8 percentage points per additional week of tender response time (public B2B sales-cycle research, applied to a premium-margin SKU). On the highest-margin SKU lines (Forta, Circle Green), where CBAM premium is largest, that is also where the absolute margin loss is largest.
2. **Sales engineering hours reclaimed.** A sales engineer fielding 30 regulated tenders/year at 8–16 hours of disclosure form-filling per tender → 240–480 hours/year reclaimed per rep. At even modest fully-loaded cost, that is six-figure annual savings per dozen reps.
3. **CBAM premium realisation rate.** When a competitor (H2 Green Steel commissioning Boden) can also deliver a low-CO<sub>2</sub> stainless with a verifier-attached disclosure inside the customer's window, the CBAM premium is competitively contestable. Cycle-time directly affects premium-capture rate.

All three are public-data anchors. None require Outokumpu insider data.

## The IP-leak side of the same model

For the same Forta product line, look at what each manual disclosure published over the last 24 months *could have included* if granularity drifted past the threshold the IP function would have drawn:

| Disclosure field | Routine publication today | If granularity drifts | IP exposure |
|---|---|---|---|
| Embedded emissions intensity (tCO<sub>2</sub>e/t) | Product-route average | Per-heat or per-coil | Reveals batch-level process performance; competitor can infer recipe / electrode / power profile |
| Energy mix and primary input shares | Annual average | Per-quarter, per-shift | Reveals operational ramp behaviour; competitor can infer demand-response economics |
| Scrap ratio and recycled-content provenance | Annual fraction | Per-heat with source country | Reveals supplier strategy and source-mix sensitivity |
| Ferrochrome reductant detail | Aggregate, supplier-anonymised | Per-supplier, per-route | Reveals supplier negotiation leverage; reads on contracts and on Outokumpu's own captive ferrochrome IP |
| Slag valorization route | Product names + credited tonnage | Composition windows | Reads on Outokumpu's slag-valorization filings and trade-secret programs |
| Verifier statement scope | Standard EN 15804+A2 | Scope expansion to plant-level metrics | Increases public surface area available to competitor patent counsel |

**Hypothesis:** today, the drift is largely passive — sustainability and sales engineering disclose whatever the customer asks for, weighed against deadline pressure, not against IP-portfolio impact. Q3 2026 CBAM definitive declarations + tightening OEM Scope 3 templates will accelerate the drift. The IP function should be in the loop *before* that acceleration, not after.

## How DWS Intelligence shows up here

This is what "DWS Intelligence sharpens the IP Director" looks like operationally for Forta:

- **Live competitor-filing radar** cross-references Forta-relevant patent filings from H2 Green Steel, SSAB HYBRIT, ArcelorMittal XCarb, Aperam, and Outokumpu's own pending filings against current and proposed Forta disclosure fields. Surfaces overlap *before* the document leaves.
- **Disclosure-template diff** flags any field where the proposed disclosure goes deeper than the historical baseline or deeper than any competitor's most recent comparable disclosure.
- **OEM-aware customer schemas** track how BMW MSI, Mercedes Ambition, Stellantis Dare Forward, Volvo Sustainability templates have evolved per release, so the IP function can pre-author allow/redact/aggregate rules per OEM tier *once*, and let the templates fill themselves automatically.
- **Verifier-statement cache** with KYA-attested provenance — no re-verification round-trip for unchanged process parameters.

Every Forta disclosure that ships through DWS IQ becomes training data for the next one. **Friction is one-shot; intelligence compounds.**

## Pilot scope proposed (the ask)

**Goal.** Model one Forta SKU end-to-end with the IP-policy lever applied at field level, KYA-attested, sovereign NVIDIA stack.

**Scope.**
- One product line: Forta (or Circle Green, IP Director's choice).
- One OEM tier: one EU automotive OEM running Scope 3 supplier audits at depth.
- One IP-authored disclosure template: field-level allow / redact / aggregate, KYA-gated.
- Two outcomes measured: cycle time (today vs. DWS IQ) and IP-function review coverage (ad-hoc vs. 100%).

**Duration.** 8 weeks scoping + pilot.

**Deployment.** Edge (NVIDIA Jetson Orin Nano or DGX Spark) on Outokumpu premises or EU-sovereign cloud (Aiven Helsinki / Scaleway Paris / UpCloud Helsinki). No Outokumpu data leaves EU jurisdiction at any point.

**Owner sponsorship.** Ari Hirvonen (Patent IP Director) as strategic sponsor. CSO and Head of Sales Engineering as operational co-sponsors invoked at Week 2.

**Cost / commercial.** To be scoped after first meeting based on Forta volume and OEM tier complexity. Default frame: pilot at-cost, conversion to commercial at agreed KPIs.

## Caveats — what this document is and is not

This is **modeled** on public data. It is **not**:

- A statement about Outokumpu's actual cycle times. Real numbers may be faster (mature operation) or slower (untracked process delays). Validating real numbers is part of the pilot, not a precondition.
- A claim of IP leakage that has occurred. The IP-leak side is a *hypothesis about exposure surface*, not an accusation of past harm.
- A binding commercial proposal. Pricing, delivery, and SLA terms are for the post-pilot conversation.

This **is**:

- A worked example showing what DWS Intelligence delivers for Outokumpu's IP Director persona, on Outokumpu's most CBAM-premium SKU family, with the disclosure-as-IP wedge made concrete in cycle-time and field-level terms.
- A talking-point document for the first meeting with Ari Hirvonen.
- A foundation we will replace with real pilot data within 8 weeks of pilot start.

## Document control

- **Sender to use:** `risto.paarni@lifetime.fi`
- **Channel:** PDF attachment after first meeting, OR shared as Lifetime-hosted PDF link (no third-party hosting).
- **Do not** share with anyone outside Outokumpu IP / Legal / Sustainability / Commercial without Ari's consent.
- **Do not** publish to dws10.com or any public surface.
- **Sources:** public Outokumpu IR materials, EPD-Online program-operator records, EUR-Lex CBAM regulation text, publicly filed competitor EPDs and patent records, OEM Scope 3 templates published by BMW, Mercedes, Stellantis, Volvo. No insider information.

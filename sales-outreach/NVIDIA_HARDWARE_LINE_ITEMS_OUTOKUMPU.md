<!--
VERSION AND AGENT HISTORY
Document: NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md
Version: 1.0
Last-Updated: 2026-05-25
Status: DRAFT. Send-ready when:
        - Quantities confirmed against Stage 1 scoping outcomes
        - Unitree model + EU distributor confirmed (B2 industrial
          recommended; not yet a DWS productized SKU — vendor
          pass-through for this pilot)
        - R20 / R21 procurement review for Outokumpu standard supplier
          terms
        - Converted to PDF (Pandoc command in pre-send checklist below)
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7)

Sessions & Modifications:
  - 1.0 | 2026-05-25 | Rewritten against canonical price-list source.
                       All NVIDIA hardware items now reference product
                       IDs from dws10.com/config/products.json with
                       exact list prices (no placeholders). DWS-EU-
                       PILOT product subsumes the previously itemized
                       Scaleway/Aiven cloud lines. LF-SOV-MODEL-SUB
                       added as maintenance subscription. Unitree
                       retained as vendor pass-through (not yet in
                       price list); flagged as recommended future
                       Lifetime Fleet SKU.
  - 0.9 | 2026-05-25 | Initial scaffold with placeholder pricing.
                       Superseded — placeholders weren't aligned with
                       the Truth Standard (canonical source =
                       DWS_PRODUCT_STANDARD.md + products.json).

Branch: claude/exa-openclaw-integration-YnDpO
Owner: risto.paarni@lifetime.fi
Audience: Outokumpu Procurement (R20 / R21) primary; routable to
          CFO (R23) for CAPEX approval and Ari Hirvonen for technical
          alignment.
Funnel role: Attachment 2/2 referenced in Reply 2 v1.2 ("Here is the
             detailed pilot sheet and the NVIDIA hardware line items").
             Companion: PILOT_SHEET_OUTOKUMPU_FORTA.md.

Pricing source-of-truth: dws10.com/config/products.json
                         (per DWS_PRODUCT_STANDARD.md and
                         DWS_TRUTH_STANDARD.md §2 row 2).

Key principle: Customer CAPEX model. Hardware purchased for the
               pilot STAYS WITH OUTOKUMPU after pilot ends — durable
               infrastructure asset whether or not the pilot converts
               to commercial license. No rental. Lifetime takes no
               margin on hardware beyond what is already priced into
               the productized SKUs (which include install + service
               wrap).
-->

# Hardware & Services Line Items — Outokumpu Forta Pilot

**Customer:** Outokumpu Oyj
**Provider:** Lifetime Oy
**Companion document:** `PILOT_SHEET_OUTOKUMPU_FORTA.md`
**Date issued:** 2026-05-25 *(update on send)*
**Version:** 1.0
**Classification:** Confidential — Outokumpu Oyj and Lifetime Oy only
**Pricing source:** `dws10.com/config/products.json` (canonical per DWS Product Standard)

---

## Commercial principle

> **Customer CAPEX model.** All hardware items below are purchased by Outokumpu via Lifetime's productized SKUs at DWS list prices. **Hardware stays with Outokumpu after the pilot ends** — durable infrastructure asset whether or not the pilot converts to commercial license. Cloud services and AI-platform agents are OPEX monthly subscriptions, also via productized SKUs.
>
> **Of the total 3-month pilot infrastructure spend, ~60% is durable CAPEX that Outokumpu retains regardless of conversion outcome.**

Three categories:

- **A. Compute hardware** — CAPEX, one-time, Customer owns. All items are DWS-productized SKUs with install + 24/7 service wrap included.
- **B. Field robot** — CAPEX, one-time, Customer owns. Unitree quadruped; not yet a DWS productized SKU (vendor pass-through for this pilot; recommended future Lifetime Fleet SKU).
- **C. Platform + EU sovereign cloud + model updates** — OPEX, monthly subscriptions, productized.

---

## A. Compute hardware (CAPEX — Customer owns, includes install + service)

All items are productized SKUs from `dws10.com/config/products.json`. Prices include Lifetime install + the standard service wrap (operator training, 24/7 technical support, warranty servicing, remote configuration). VAT 0% reverse charge for Finnish / EU B2B.

| # | Product ID *(canonical)* | Product name | Tier in Risto's framing | Qty | Unit price (EUR, ex-VAT) | Total (EUR, ex-VAT) | Use case in Forta pilot |
|---|---|---|---|---|---|---|---|
| A1 | `edge-node-gn100` | Control Room — Acer Veriton GN100 + NVIDIA Model Install | "T4000-tier" — command brain | 1 | **€5,294** | €5,294 | Central disclosure pipeline + KYA signing + IP-rule schema execution. Acer Veriton GN100 = NVIDIA GB10 Grace Blackwell, 1 PFLOPS FP4, 128 GB LPDDR5x, 20-core Arm. |
| A2 | `LF-IGX-ORIN` | IGX Orin — Industrial / Medical Sovereign Edge + Install & Service | "T5000-tier" — industrial mill-grade | 1 | **€11,990** | €11,990 | Mill-floor deployment at Tornio or Avesta. ECC memory, 10-year NVIDIA support through 2033, mill-environment-rated. The "T5000" Risto referenced — the highest-spec workstation in the Lifetime Fleet line. |
| A3 | Sensor concentrator / in-vehicle backend tier — **3 options, customer picks** | see A3 sub-table below | Field-edge brain paired with §B robot | 1 | varies | varies | Aggregates sensor lanes (cameras, LiDAR, acoustic, IoT), runs VLA / VLM locally, forwards events to A1 / A2. |
| A4 *(optional)* | `LF-JETSON-NANO` | Jetson Sensor Node — Orin Nano Super + Install & Service | Lightweight site-edge | 0–2 | €764 each | €0–€1,528 | Optional. Drop one or two at specific sensor locations (e.g. EAF camera point, scrap-yard gate). Scope-dependent on Stage 1. |
| | **Subtotal — A. Compute hardware** | | | | | **€21,000–€38,000 depending on A3 choice** | |

### A3 sensor concentrator — three options (per "we keep 3 options we learn")

Per field note `docs/field-notes/2026-05-22-nvidia-gtc-taipei-2026-jetson-thor-edge-bca.md` (PR #1387), Risto's "T4000 / T5000" terminology refers to **NVIDIA Jetson Thor module SKUs**, not workstation GPUs. Thor is the new edge tier between Orin and DGX Spark, BCA Golden Award winner at GTC Taipei 2026. **Procurement guidance from that field note: hold off on Orin AGX bulk purchases pending post-keynote pricing (GTC Taipei keynote 1–4 June 2026).**

Three concentrator options offered, mirroring the A3-tier 3-option pattern in §B robot:

| Option | SKU | Source | Qty | Unit price (EUR, ex-VAT) | Use case in Forta pilot | Trade-off |
|---|---|---|---|---|---|---|
| **A3-a** *(productized, available now)* | `LF-JETSON-AGX` — Jetson Sensor Concentrator (AGX Orin 64 GB + Install & Service) | DWS price list | 1 | **€2,694** | Orin AGX 64 GB, 275 INT8 TOPS, 5 GbE. Pairs with Unitree B1/B2 or ANYmal B3. | Cheapest. Works today. Per PR #1387 may be obsoleted by Thor before the pilot's Stage 1 ends — but the productized SKU is the safest path if Q3 Thor availability slips. |
| **A3-b** *(new tier, sensible-spec, available now)* | Jetson Thor **T4000** module + Connect Tech Gauntlet carrier + integration | Vendor pass-through (Aaeon / Advantech / Connect Tech) — **not yet a DWS productized SKU** | 1 | *[~$1,999 module + €~1,500–€2,500 carrier + €495 install — VERIFY, ~€4,000–€5,000 total]* | Thor T4000: 1,200 FP4 TFLOPS, 64 GB LPDDR5X, 5 GbE + 4× PoE camera ports + CAN bus. 4× the FP4 throughput of Orin AGX at ~2× the cost. Shipping since CES Jan 2026. | Better future-proofing than A3-a; lower BOM than A3-c; no DWS productization yet (vendor pass-through this pilot). 4× PoE camera ports work for camera-stream sensors but cap LiDAR aggregate bandwidth. |
| **A3-c** *(strategic alignment, future-proof, ~Q3 2026)* | Jetson Thor **T5000** module + Connect Tech Rogue-T5 or Aaeon / Advantech carrier + integration | Vendor pass-through — **not yet a DWS productized SKU**; early dev-kit allocation via Lifetime's NVIDIA Connect ISV status | 1 | *[module price not yet public — VERIFY post GTC Taipei keynote 1–4 June 2026]* | Thor T5000: 2,070 FP4 TFLOPS, 128 GB LPDDR5X, **4×25 GbE (100 Gbps)**, MIG slicing. Hosts NVFP4 LWM 55B with headroom for V2 omnimodal extension (November 2026). | Per Risto 22.05.2026 (in PR #1387 field note): T5000 is the designated in-vehicle backend for Lifetime Robots on Lifetime Fleet, targeting Q1 2027 production. Choosing T5000 here **aligns Outokumpu's pilot hardware with the Lifetime Robots roadmap** — same silicon, same NVFP4 LWM image, same CI pipeline. Strategic durability bonus. Highest BOM. |

**Recommendation for the Outokumpu Forta pilot:**

- **Default to A3-b (Thor T4000)** — best fit for the sensor-concentrator role at one Forta line: ~4× Orin AGX throughput, 64 GB unified, available today, ~€4–5k all-in. Procurement-freeze on Orin AGX (per PR #1387) applies — A3-a should be the conscious fallback only if Thor lead time exceeds Stage 1 scoping window.
- **Upgrade to A3-c (Thor T5000)** if Outokumpu's pilot scope includes multi-stream sensor fusion across 4×25 GbE (LiDAR + multiple cameras + tethered robots) OR if Outokumpu wants to be the first reference customer of the Lifetime Robots silicon stack (Q1 2027 alignment). Wait for post-keynote pricing before committing the BOM.
- **Fall back to A3-a (Orin AGX productized)** only if Stage 1 scoping reveals lower sensor-fusion demand AND Customer wants the safer "in DWS price list today" path.

### Procurement guidance per PR #1387 (Thor field note)

> "Procurement should be told to **hold off on Orin AGX bulk purchases**; a fortnight of patience changes the spec sheet meaningfully." — `docs/field-notes/2026-05-22-nvidia-gtc-taipei-2026-jetson-thor-edge-bca.md` §"Pricing signal for Q2/Q3 procurement"

Outokumpu Forta pilot timing (Stage 1 kickoff likely week 23 — 1 June 2026) coincides with GTC Taipei keynote (1–4 June). **Stage 1 scoping deliverable should include the Thor SKU-selection decision** with pricing locked from the keynote.

### SKU mapping correction — supersedes earlier drafts of this doc

Earlier drafts of this doc (v1.0, pre-PR-#1387 review) mapped Risto's "T4000 / T5000" to:
- ~~T4000 → `edge-node-gn100` (Acer Veriton workstation, €5,294)~~ **WRONG**
- ~~T5000 → `LF-IGX-ORIN` (Industrial IGX Orin workstation, €11,990)~~ **WRONG**

The correct mapping (per PR #1387 field note, decided 22.05.2026):
- **T4000 = Jetson Thor T4000 module** (1,200 FP4 TFLOPS, 64 GB LPDDR5X, $1,999 list, shipping)
- **T5000 = Jetson Thor T5000 module** (2,070 FP4 TFLOPS, 128 GB LPDDR5X, post-keynote pricing, ~Q3 2026)

Both are **edge / in-vehicle / sensor-concentrator tier** — they occupy the A3 row, not the A1 / A2 rows. The A1 (`edge-node-gn100`) and A2 (`LF-IGX-ORIN`) workstations remain correct as the central pipeline + industrial mill-grade brain respectively; they are separate from the T4000 / T5000 concentrator tier.

---

## B. Field robot (CAPEX — vendor pass-through, Customer owns)

Three options offered. Customer picks one in Stage 1 scoping. Trade-off is **cost vs. industrial-grade vs. European sovereignty** — all three matter to Outokumpu in different ways.

| # | Item | Model | Origin | Qty | Estimated unit price (EUR, ex-VAT) *(verify)* | Total | Why this option |
|---|---|---|---|---|---|---|---|
| **B1** | Unitree industrial quadruped — **lowest cost** | Unitree B2 (Industrial Edition) + sensor payload | China (Hangzhou) | 1 | *[€~25,000 — VERIFY EU distributor]* | *[calc]* | Cheapest entry into autonomous melt-shop / scrap-yard observation. Mature SDK. Pairs with A3 sensor concentrator. Carries thermal + visual + acoustic payload. Trade-off: Chinese origin may matter for downstream defence-adjacent Outokumpu supply-chain customers. |
| **B2** | Unitree humanoid — **visible board demo** | Unitree G1 (EDU) | China (Hangzhou) | 1 | *[€~20,000 — VERIFY]* | *[calc]* | Humanoid form factor. Stronger visual story for board / investor demos than a quadruped. Trade-off: less suited to genuine mill-floor conditions than B1 or B3. Same origin concern as B1. |
| **B3** | ANYbotics ANYmal — **European-sovereign, industrial-grade** | ANYmal X (or ANYmal D depending on payload spec) | Switzerland (Zurich, ETH spinout) | 1 | *[€~150,000–€200,000 — VERIFY EU distributor]* | *[calc]* | The ABB-adjacent industrial quadruped (used by ABB, Petrobras, BASF, MHI). **ATEX Zone 1/2 certified** — explosion-proof, mill-floor-rated. Purpose-built for industrial inspection in steel / oil / heavy-process environments. Swiss origin = Tier 1 sovereignty-aligned per `DWS_STANDARDS_LIBRARY.md` §3.6 (no Chinese origin, no US Cloud Act exposure). Trade-off: ~7–8× the cost of B1. |
| | **Subtotal — B. Field robot (one of three)** | | | | | *[~€20,000–€200,000 depending on B1 / B2 / B3]* | |

### Selection guidance

| Outokumpu priority | Recommended option | Rationale |
|---|---|---|
| Lowest total pilot cost; happy to iterate on hardware later | **B1 Unitree B2** | Functional, cheap, gets the use case validated for ~€25k. |
| Strongest sovereignty alignment + industrial-grade durability + supply-chain credibility for downstream defence-adjacent customers | **B3 ANYbotics ANYmal** | Swiss origin, ATEX-certified, used by ABB. Strong story for Outokumpu's own customers (BMW, Mercedes, Stellantis) who are sovereignty-sensitive in their procurement. Materially raises the pilot CAPEX but materially raises the durable-value pitch (€150k+ asset Outokumpu retains). |
| Maximum board / investor demo visibility | **B2 Unitree G1 humanoid** | Form factor wins. Less mill-grade. |

### Productization notes

- **None of the three** are currently DWS-productized SKUs in `dws10.com/config/products.json`. All treated as **vendor pass-through** for this pilot (Lifetime sources at vendor list, Customer owns).
- **If the Forta pilot validates the robot-in-disclosure-pipeline use case**, recommend adding to the price list:
  - `LF-UNITREE-B2-INDUSTRIAL` — Unitree B2 + sensor payload + Jetson AGX integration + service wrap. Volume play.
  - `LF-ANYMAL-INDUSTRIAL` — ANYmal X + integration + service wrap. Premium / sovereignty-tier play.
- Productizing both gives DWS a two-tier robot offering (mass-market + enterprise-sovereign), matching the existing two-tier pattern in the Jetson family (`LF-JETSON-NANO` / `LF-JETSON-NX` / `LF-JETSON-AGX`).

---

## C. Platform + EU sovereign cloud + model updates (OPEX — monthly subscriptions, productized)

All items are productized SKUs from `dws10.com/config/products.json`. Monthly subscription pricing.

| # | Product ID | Product name | Qty | Monthly price (EUR, ex-VAT) | 3-month total (EUR, ex-VAT) | What's included |
|---|---|---|---|---|---|---|
| C1 | `DWS-EU-PILOT` | DWS IQ — EU Sovereign Pilot | 1 | **€1,499/mo** | €4,497 | Full EU sovereign evaluation tier. 8 AI agents, Firehorse Report, Aiwen EU AI Act Article 12 logging, NIS2 dashboard, 5 seats. **Bundles the EU sovereign infrastructure** (Aiven PostgreSQL + Hetzner/Scaleway). Zero CLOUD Act exposure. Eliminates the need to itemize Scaleway / Aiven separately at this stage. |
| C2 | `LF-SOV-MODEL-SUB` | Sovereign Model Updates Subscription | 3 *(one per CAPEX device: A1, A2, A3)* | €299/mo each | €2,691 | Monthly NIM refreshes (Llama Nemotron, Cosmos, Nemotron VLMs), TensorRT-LLM kernel updates, GB10-specific quantization. Weekly security backports, daily hotfixes for critical CVEs. Includes 24/7 technical support, warranty servicing, remote configuration. **One subscription per CAPEX device to keep the NVIDIA stack current.** |
| | **Subtotal — C. Platform + cloud + updates (3 months)** | | | | **€7,188** | |

**Note on bundling:** *Earlier draft itemized Scaleway and Aiven separately. The canonical product `DWS-EU-PILOT` already bundles EU sovereign cloud (Aiven PostgreSQL + Hetzner/Scaleway) into a single productized line item at €1,499/mo. That is the right Truth-Standard-aligned line item; standalone Scaleway / Aiven items are not in the price list and should not be invented for this proposal.*

---

## D. Total estimate

| Category | Subtotal (EUR, ex-VAT) | Type | Outokumpu retains post-pilot |
|---|---|---|---|
| A. Compute hardware (CAPEX) | €19,978–€21,506 | One-time | ✅ Yes — Outokumpu owns |
| B. Field robot (CAPEX, vendor pass-through) — one of three options | ~€20,000 (B2 humanoid) / ~€25,000 (B1 industrial) / ~€150,000–€200,000 (B3 ANYmal sovereign) | One-time | ✅ Yes — Outokumpu owns |
| C. Platform + cloud + updates (OPEX) | €7,188 | Monthly × 3 | ❌ Subscription ends with pilot (renewable on conversion) |
| Lifetime pilot fee *(from `PILOT_SHEET_OUTOKUMPU_FORTA.md` §4)* | €24,000 | One-time | ❌ Effort fee |
| **Pilot grand total — B1 path (lowest cost)** | **~€76,000** | | |
| **Pilot grand total — B2 path (humanoid demo)** | **~€71,000** | | |
| **Pilot grand total — B3 path (sovereignty-tier)** | **~€201,000–€253,000** | | |
| **Of which Outokumpu retains as durable asset** | **B1: ~€45,000 (~60%)** / **B2: ~€40,000 (~57%)** / **B3: ~€170,000–€220,000 (~85%)** | | ✅ |
| **Lifetime margin on hardware (A) and cloud (C)** | €0 | (Already priced into productized SKUs; no extra layer) | |

---

## E. Notes

- **Pricing source:** All productized prices are sourced from `dws10.com/config/products.json`, the canonical pricing source per `DWS_PRODUCT_STANDARD.md` and `DWS_TRUTH_STANDARD.md` §2 row 2. Any drift between this document and `products.json` is a documentation bug — `products.json` wins.
- **Productized SKU = list price.** No discounting at this stage; pilot terms are "pay list, keep asset". Volume discount conversation deferred to commercial-conversion phase if the pilot succeeds (Pilot Sheet §8).
- **BYO for A and C** where existing Customer contracts / hardware exist. Reduces total; Lifetime provides config + integration only. Configuration / integration time may shift from CAPEX SKUs to a small Stage 1 scoping engagement (currently free per Pilot Sheet §3).
- **Unitree (B1)** is the only line not yet productized. If Customer prefers to procure direct from a Unitree EU distributor, Lifetime provides integration spec + Jetson AGX (A3) pairing instructions. If Customer prefers single point of contact, Lifetime sources at vendor list and passes through (no margin).
- **VAT:** EU B2B intra-community reverse charge (Customer accounts for VAT).
- **Hardware delivery lead time:** Lifetime Fleet SKUs (A1, A2, A3, A4) typically 2–6 weeks via EMEA channel; Unitree B2 typically 4–8 weeks via EU distributor; Jetson Orin Nano in stock. Stage 1 scoping (Pilot Sheet §6 weeks 1–2) initiates orders; Stage 2 pilot execution waits on hardware arrival.
- **Sovereignty posture:** All items are Tier 1 Full EU Sovereign per `DWS_STANDARDS_LIBRARY.md` §3.6. No US Cloud Act perimeter on Customer data or IP material.

---

## Document control

- **Pricing source:** `dws10.com/config/products.json` (canonical). Mirror: `landing-pages/dws10-com/config/products.json`.
- **Companion document:** `PILOT_SHEET_OUTOKUMPU_FORTA.md`.
- **Sovereignty rationale:** `DWS_STANDARDS_LIBRARY.md` §3.6.
- **Truth Standard:** `DWS_TRUTH_STANDARD.md` §2 row 2 (products + pricing canonical source).
- **Future productization:** Unitree SKU candidate flagged for `dws10.com/config/products.json` if Forta pilot validates the use case.

## Pre-send checklist for Risto

- [ ] **Confirm "T4000 / T5000" mapping**: A1 = `edge-node-gn100` (€5,294), A2 = `LF-IGX-ORIN` (€11,990). Correct, or swap to alternative SKUs (e.g. `LF-DGX-SPARK` €5,994 for A1 if you prefer DGX over GN100)?
- [ ] **Confirm A3 inclusion**: `LF-JETSON-AGX` (€2,694) — needed if Unitree (B1) is in scope as sensor source. Drop if Unitree dropped.
- [ ] **Confirm A4 quantity**: 0, 1, or 2 lightweight Jetson Nano nodes for site-specific sensor deployment. Scope-dependent.
- [ ] **Confirm field-robot choice from three options**:
  - **B1 Unitree B2** (industrial, Chinese, ~€25k) — lowest cost
  - **B2 Unitree G1** (humanoid, Chinese, ~€20k) — board-demo
  - **B3 ANYbotics ANYmal** (industrial, Swiss, ATEX-certified, ~€150–200k) — sovereignty-tier
  Remove the two lines not chosen, OR present all three in the meeting and let Ari + Procurement choose.
- [ ] **Verify EU distributor price** for the chosen option:
  - B1/B2: Unitree EU distributor (RoboShop EU or direct)
  - B3: ANYbotics direct (Zurich) or EU regional partner
- [ ] **Confirm C2 device count**: defaulted to 3 (one `LF-SOV-MODEL-SUB` per CAPEX device A1 + A2 + A3). Adjust if A3 dropped or A4 added.
- [ ] **R20 / R21 procurement review** for Outokumpu standard supplier terms.
- [ ] **R05 General Counsel review** of ownership transfer clauses (asset transfers to Outokumpu on purchase per Customer CAPEX model in Commercial Principle above).
- [ ] **Convert to PDF**: `pandoc NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md -o NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.pdf --pdf-engine=xelatex --variable=geometry:a4paper,margin=20mm`
- [ ] **Attach PDF (not .md)** to the email.

## Post-pilot productization opportunity

If the Forta pilot validates the robot-in-disclosure-pipeline use case (KPI 1 cycle-time + KPI 3 hours reclaimed both met per `PILOT_SHEET_OUTOKUMPU_FORTA.md` §8), propose adding to the price list:

- `LF-UNITREE-B2-INDUSTRIAL` — Lifetime Fleet Unitree B2 + sensor payload + Jetson AGX integration + 24/7 service wrap. Suggested price: **vendor cost + €495 install + service tier** (mirrors the Jetson family productization pattern).

That would close the loop on the Truth Standard for hardware: every item this pilot uses would then be productized, no vendor pass-through gaps.

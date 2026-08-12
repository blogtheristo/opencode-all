<!--
VERSION AND AGENT HISTORY
Document: KEMIRA_FLEET_MOBILE_SITUATION_ROOM_BUSINESS_CASE.md
Version: 1.0
Last-Updated: 2026-06-26
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Customer business case for the Lifetime Fleet Mobile Situation Room
         at Kemira Oyj. Combined operational + strategic framing — one mobile
         sovereign command node, two modes: on-site incident command AND
         strategic carbon/compliance/board view. Continues the Kemira motion
         opened via Maria Sederholm (Fiber Essentials) and the Aegis board
         case, extending it from a compliance platform to a deployable,
         mobile command surface on Finnish, CLOUD Act-free infrastructure.
Branch: claude/nvidia-drive-agx-thor-fsrvvf
Owner: risto.paarni@lifetime.fi
Recipient: Maria (Hintikka) Sederholm (VP Product Line Management & Strategy,
           Fiber Essentials, Kemira Oyj) — entry door; Mikko Pohjala (VP
           Strategy) — strategic bridge; Kemira executive committee via forward.
Standards applied: DWS_DOCUMENT_STANDARD (header), DWS_ROLES_REGISTRY (role
           wedge), DWS_BRAND_STANDARD (customer-facing tone), DWS_TRUTH_STANDARD
           (verified-vs-confirm discipline; prices cite dws10.com/config/products.json),
           DWS_SECURITY_STANDARD (Article 12 / sovereignty).
-->

# Lifetime Fleet Mobile Situation Room — Business Case for Kemira Oyj

**One mobile sovereign command node. Two modes: on-site incident command and strategic carbon/compliance/board view. Finnish-hosted, CLOUD Act-free, EU AI Act Article 12 audited.**

---

## §0. Executive summary

Kemira runs speciality and process chemistry across **~58 production sites in ~37 countries** — critical-infrastructure inputs (water treatment, fibre/pulp chemistry) carrying hard, SBTi-validated carbon targets and a first-year CSRD statement under assurance. Two problems recur in a footprint that size: (1) when something goes wrong at a site — a process upset, a water-treatment failure, an environmental exceedance — command is slow, phone-and-spreadsheet, and the decision trail is not audit-grade; (2) carbon, CBAM, and CSRD posture lives in dashboards that no one can operate _at the point of decision_ (a site walk, a board offsite, a customer PCF negotiation).

The **Lifetime Fleet Mobile Situation Room** answers both with a single deployable unit: a **sovereign, dual-node AI command surface** (2× NVIDIA Grace Blackwell) that a Kemira team can take to a site or a boardroom, wrapped in the **Lifetime Fleet** mobility + edge-management service. It runs models locally (no cloud round-trip, no US data exposure), aggregates site sensor and compliance data, and writes an **EU AI Act Article 12 audit log** on every action.

> **The ask:** a scoped **pilot with one mobile unit in Fiber Essentials** (Maria's line) — free Stage 1 scoping, then a paid 8–12 week pilot with hard measurement gates.
>
> **The offer:** Lifetime Fleet Mobile Situation Room pilot bundle — Situation Room (2× Acer Veriton GN100), Lifetime Fleet VIP membership, and Sovereign Model Updates — **≈ €16.7k Year 1 for a single mobile unit** (pilot / Blue pricing; see §6). Sovereignty, Article 12 audit, and Finnish-to-Finnish support included.

---

## §1. What the Lifetime Fleet Mobile Situation Room is

The product is a bundle of three canonical DWS IQ 6 building blocks, delivered as one mobile capability:

| Layer                     | Component                                          | What it does                                                                                                                                                                                                      | SKU (source: `dws10.com/config/products.json`) |
| ------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Compute**               | **Situation Room** — 2× Acer Veriton GN100 bridged | Strategic command: dual-node, tensor-parallel inference (40 Arm cores, 256 GB unified memory, ConnectX-7 200 Gbps link) for heavier reasoning/vision/language models; dual-node Article 12 log replica + failover | `LF-SITROOM-001`                               |
| **Mobility + management** | **Lifetime Fleet VIP**                             | The wrapper that makes it _mobile_: managed transport of the unit and the expert to the site, edge-device management, NVIDIA edge stack, EU-sovereign inference                                                   | `FLEET-VIP-001`                                |
| **Freshness**             | **Sovereign Model Updates**                        | Keeps the on-box NVIDIA NIM catalogue + models current; operator training, 24/7 support, warranty, remote config                                                                                                  | Subscription                                   |
| **(optional) satellite**  | **Control Room** — 1× GN100                        | A lighter single-node for a fixed site or a second team — operational command (fleet heartbeats, sensor alerts, missions)                                                                                         | `LF-CTRLROOM-GN100-2026`                       |

**The "mobile" in Mobile Situation Room.** The Situation Room is normally a strategic, fixed dual-node brain. Lifetime Fleet turns it into a _deployable_ asset: the unit and a Lifetime expert are dispatched to where the decision has to be made — a site during an incident, a BU offsite during a carbon review — and operated in the field via the `/remote-control situation-room` and `control-room` command surface (status, board-view, finance, compliance; dispatch, alerts, acknowledge).

**Two modes, one node:**

- **Operational mode (Control Room semantics):** live site feed — sensor alerts, asset/mission status, incident timeline — with sovereign models doing triage and next-best-action, everything Article 12 logged for the post-incident report.
- **Strategic mode (Situation Room semantics):** portfolio/compliance posture — carbon (Scope 1/2/3), CSRD/CBAM readiness, risk summary — operated live in a board or customer meeting, on infrastructure that never leaves Finland.

---

## §2. Kemira company profile

_(Verified in the 24 Jun 2026 research pass behind `KEMIRA_AEGIS_BOARD_BUSINESS_CASE.html`. Items marked **Confirm** are to be validated in scoping; per `DWS_TRUTH_STANDARD.md` we do not assert unverified figures to the board.)_

| Field                                           | Value                                                                                                                                                                                                                                         | Status                           |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Entity                                          | Kemira Oyj — Nasdaq Helsinki (KEMIRA), HQ Helsinki                                                                                                                                                                                            | Verified                         |
| Business                                        | Speciality & process chemicals: pulp/paper/fibre, water treatment, packaging, hygiene                                                                                                                                                         | Verified                         |
| Scale                                           | FY2024 revenue ≈ €2.95 bn; ≈ 4,700 employees; ≈ 58 production sites across ~37 countries                                                                                                                                                      | Verified                         |
| Structure (from 1 Jan 2025)                     | 3 BUs: **Fiber Essentials** (EVP Antti Matula), **Water Solutions** (EVP Tuija Pohjolainen-Hiltunen), **Packaging & Hygiene Solutions** (EVP Harri Eronen); CEO **Antti Salminen**; Strategy & Sustainability under EVP **Linus Hildebrandt** | Verified                         |
| Carbon targets (SBTi)                           | Scope 1&2 **−51.23% by 2030** (2018 base); Scope 3 **−32.5% by 2033** (2021 base); **carbon-neutral Scope 1&2 by 2045**                                                                                                                       | Verified                         |
| CSRD                                            | FY2024 = first CSRD/ESRS sustainability statement, under assurance                                                                                                                                                                            | Confirm                          |
| Scope 3 / PCF                                   | Supplier PCF Reporting Guideline (April 2025) — bidirectional product-carbon-footprint flow                                                                                                                                                   | Confirm                          |
| Critical-infra / dual-use / ETS / CBAM exposure | CER/NIS2 scope, ETS Phase 4 installations, CBAM precursor exposure, export-control obligations                                                                                                                                                | **Not verified — do not assert** |

**Doors:** primary **Maria Sederholm** (VP PLM & Strategy, Fiber Essentials) — owns line-level strategy, sees this as a commercial lever not a cost; bridge **Mikko Pohjala** (VP Strategy) → EVP Strategy & Sustainability → CEO. Geographic advantage: Lifetime Oy (Espoo) ↔ Kemira (Helsinki), same metro, Finnish-to-Finnish.

---

## §3. Problem & opportunity

### 3.1 The operational gap

Across ~58 sites, incident command is improvised. When a process upset or water-treatment exceedance happens, the people who can decide are not on-site, the sensor picture is fragmented, and the decision record assembled afterwards is not audit-grade. Time-to-control is measured in hours; the regulatory and reputational tail of an environmental exceedance is measured in months.

### 3.2 The strategic gap

Kemira's carbon and CSRD posture is real and hard-targeted, but it lives in dashboards operated by analysts, not in the room where commitments are made — the board offsite, the customer PCF negotiation, the regulator meeting. There is no _sovereign, operable_ command surface for "what is our Scope 3 exposure on this product line, right now, and what is the audit trail."

### 3.3 Why a _mobile sovereign_ node specifically

- **Sovereignty is now a buyer requirement.** Process IP and site data are exactly what must not sit under extraterritorial (US CLOUD Act) reach. Local inference on Finnish-hosted hardware keeps it in-country.
- **Article 12 audit turns compliance into evidence.** Every triage, every carbon figure surfaced, is logged — the difference between "we handled it" and an attestable record for assurance, insurers, and regulators.
- **Edge, not cloud, is the incident-command answer.** A site incident cannot wait for a cloud round-trip; on-box models respond in the field even on degraded connectivity.

---

## §4. Flagship scenario — one unit, both modes in a week

**Monday, strategic mode.** Fiber Essentials holds a product-line review. The Mobile Situation Room is in the room; Maria's team operates `situation-room compliance` — live Scope 1/2/3 posture for the line, CBAM/CSRD readiness flags, and the exact PCF figures for the three products under a customer PCF negotiation. Every number is sourced and Article 12 logged. The board narrative is built on an operable, sovereign source of truth instead of a stale slide.

**Thursday, operational mode.** A water-treatment upset is reported at a site. The unit and a Lifetime expert are dispatched (Lifetime Fleet). On arrival it ingests the site's sensor feed; `control-room status` shows the live picture, sovereign models triage the exceedance and propose containment steps, and `control-room dispatch` coordinates the field response. Time-to-control compresses from hours to minutes, and the full incident timeline — decisions, data, actions — is written to the Article 12 log, so the post-incident and regulatory report writes itself.

One asset. Two modes. Same sovereign audit spine.

---

## §5. Capability mapping — Kemira gap → Fleet Mobile Situation Room

| Kemira gap                                            | Mobile Situation Room capability                                                         | Sovereignty / audit                        |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------ |
| Slow, fragmented incident command across ~58 sites    | Deployable dual-node command; live sensor aggregation; on-box triage & next-best-action  | Article 12 incident log, dual-node replica |
| Non-audit-grade decision trail                        | Every action logged; post-incident report generated from the log                         | EU AI Act Article 12                       |
| Carbon/CSRD posture not operable at point of decision | `situation-room compliance` / `finance` / `board-view` live in board & customer meetings | Finnish-hosted, CLOUD Act-free             |
| Process IP & site data under extraterritorial risk    | Local inference; data stays in Finland/EU                                                | No US cloud dependency                     |
| Scope 3 / PCF negotiation without live evidence       | Live PCF figures + source trail for customer/supplier PCF flow                           | Attestable, versioned                      |

---

## §6. Commercial offer & pricing

All prices are Finnish / EU B2B (VAT 0% reverse charge), canonical source **`dws10.com/config/products.json`** (price list v1.20, next review 2026-08-01). Fleet VIP is a **Blue (pilot) SKU** — pricing indicative until ratified to Green; Situation Room and Control Room are canonical.

| Line item                                                        | SKU                      | Price                          | Status       |
| ---------------------------------------------------------------- | ------------------------ | ------------------------------ | ------------ |
| Situation Room (2× Acer Veriton GN100, bridged + NVIDIA install) | `LF-SITROOM-001`         | **€10,093** one-time           | Canonical    |
| Lifetime Fleet VIP membership (mobility + edge management)       | `FLEET-VIP-001`          | **€2,990** / year              | Blue (pilot) |
| Sovereign Model Updates (on-box NIM/model refresh, 24/7 support) | subscription             | **€299** / month (€3,588 / yr) | Canonical    |
| _(optional)_ Control Room satellite node (1× GN100)              | `LF-CTRLROOM-GN100-2026` | **€5,294** one-time            | Canonical    |

**Pilot bundle (single mobile unit, Year 1):** €10,093 + €2,990 + €3,588 ≈ **€16,671**. Year 2+ ≈ **€6,578** (membership + updates; hardware amortised).

**Expansion scenarios (illustrative — internal, not a Kemira commitment):**

| Scenario | Mobile units          | Year 1 (approx.) | Fit                                  |
| -------- | --------------------- | ---------------- | ------------------------------------ |
| Pilot    | 1 (Fiber Essentials)  | ≈ €16.7k         | One BU, one mobile unit, gated pilot |
| Base     | 3 (one per BU)        | ≈ €50k           | BU-level rollout                     |
| Stretch  | 8 (key sites/regions) | ≈ €133k          | Site-network coverage                |

_Figures are illustrative unit-economics, not quotes; final pricing ratifies against `products.json` at contract._

---

## §7. KPIs & success criteria (pilot)

| KPI                                           | Baseline (to establish in scoping) | Pilot target                        | Method                          |
| --------------------------------------------- | ---------------------------------- | ----------------------------------- | ------------------------------- |
| Time-to-control on a simulated site incident  | Current phone/spreadsheet time     | **≥70% reduction**                  | Timed tabletop + one live drill |
| Decision-trail completeness                   | Ad-hoc, post-hoc                   | **100% Article 12-logged** actions  | Log audit                       |
| Carbon/PCF query latency at point of decision | Analyst turnaround (hours/days)    | **< 60 s** live in-room             | Session timing                  |
| Data sovereignty                              | Cloud-dependent tooling            | **0 bytes** to non-EU jurisdictions | Network egress audit            |

Commercial conversion gate: meet ≥3 of 4 targets and a signed operator sign-off from Maria's team.

---

## §8. Risks & mitigations

| Risk                                          | Mitigation                                                                                                                                     |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| "We already have dashboards"                  | The differentiator is _operable + sovereign + Article 12 audited at the point of decision_, and the mobile incident mode — not a new dashboard |
| Fleet VIP is Blue (pilot) pricing             | Pilot contract fixes the price for the term; ratification to Green won't retroactively change it                                               |
| Unverified regulatory exposure (ETS/CBAM/CER) | Not asserted; validated in free Stage 1 scoping before any board claim                                                                         |
| Change-management at site level               | Lifetime expert dispatched with the unit (Fleet); operator training bundled in Sovereign Model Updates                                         |
| Hardware supply / lead time                   | GN100 nodes are the current sovereign edge tier; roadmap (§9) de-risks the next generation                                                     |

---

## §9. Roadmap — the in-vehicle evolution

The current mobile unit is Grace Blackwell (GN100) transported to the point of decision. The next step is a **truly in-vehicle** situation room: NVIDIA's **DRIVE AGX Thor / Jetson Thor** edge platform (Blackwell, DriveOS 7, ISO 26262 ASIL-D / ISO 21434) makes a safety-certified, always-on command node that lives _in the response vehicle itself_ — see the field note `docs/field-notes/2026-06-26-nvidia-drive-agx-thor-developer-kit-ga.md`. This is a roadmap direction, not a current SKU; it signals where the mobile-sovereign-command line is heading and why Kemira's investment compounds.

---

## §10. Next steps

1. **20-min alignment** with Maria (Fiber Essentials) — confirm the pilot site/line and the incident + carbon scenarios to instrument.
2. **Loop in Mikko Pohjala** (Strategy) for the board narrative bridge.
3. **Free Stage 1 scoping** — establish baselines, validate the "Confirm"/unverified items in §2, and fix pilot KPIs.
4. **Paid 8–12 week pilot** — single mobile unit, measured against §7 gates.
5. **Convert** on gate pass; expand per §6 scenarios.

---

## §11. Sources & method / document control

- **Product facts & pricing:** `dws10.com/config/products.json` (canonical; Fleet VIP = Blue/pilot). Situation Room `LF-SITROOM-001`, Control Room `LF-CTRLROOM-GN100-2026`, Fleet VIP `FLEET-VIP-001`. Command surface: `.claude/commands/remote-control.md`.
- **Kemira facts:** verified research pass behind `sales-outreach/KEMIRA_AEGIS_BOARD_BUSINESS_CASE.html`; outreach context `sales-outreach/INTRO_MARIA_SEDERHOLM_KEMIRA.md`. Verified vs Confirm vs Not-verified flags preserved per `DWS_TRUTH_STANDARD.md`.
- **Roadmap:** `docs/field-notes/2026-06-26-nvidia-drive-agx-thor-developer-kit-ga.md` (NVIDIA DRIVE AGX Thor — external vendor claims, verify before external propagation).
- **Discipline:** no unverified regulatory exposure asserted; all prices trace to the single pricing source; sovereignty & Article 12 per `DWS_SECURITY_STANDARD.md`.

_End of business case — Lifetime Fleet Mobile Situation Room for Kemira Oyj. v1.0, 26.06.2026._

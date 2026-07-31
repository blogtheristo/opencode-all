<!--
VERSION AND AGENT HISTORY
Document: KEMIRA_AEGIS_DEPLOYMENT_ALTERNATIVES.md
Document revision: v1.1
Version: 1.1 | Tool: Claude Code | Session: claude/dgx-spark-mining-case-gf1159 | Date: 26.06.2026 | Changes: Repositioned Alternative B (on-prem) from the bespoke 3x DGX Spark figure onto canonical DWS turnkey appliances — Control Room (€5,294) / Situation Room (€10,093) per dws10.com/config/products.json — deployed one-per-factory. Updated tables, recommendation, caveats. DGX-class node retained only as the upper rung of the hardware ladder.
Version: 1.0 | Tool: Claude Code | Session: claude/dgx-spark-mining-case-gf1159 | Date: 26.06.2026 | Changes: Initial creation — presents Kemira two canonical technological alternatives for deploying DWS IQ Aegis climate-compliance: (A) Sovereign EU Cloud on UpCloud Helsinki, (B) On-prem / air-gapped Aegis Sovereign on a customer-owned 3x NVIDIA DGX Spark cluster. Aligned to canonical pricing in Store/PRODUCT_AEGIS.md and verified company facts from KEMIRA_AEGIS_BOARD_DECK (PR #1509). Reconciles and supersedes the earlier docs/DGX_SPARK_3X_KEMIRA_* drafts (Alternative B preserves their content as customer hardware CAPEX, not a competing product price).
Companion: sales-outreach/KEMIRA_AEGIS_BOARD_BUSINESS_CASE.html, sales-outreach/KEMIRA_AEGIS_BOARD_DECK.pptx, Store/PRODUCT_AEGIS.md (canonical product + pricing).
Author: Risto Anton Päärni (Lifetime Oy). Status: DRAFT.
-->

# Kemira × DWS IQ Aegis — Two Technological Alternatives for Sovereign Climate Compliance

> One platform, one set of agents, two deployment paths. Choose by how far you want sovereignty to go — managed EU cloud, or fully air-gapped on Kemira's own hardware.

**Customer:** Kemira Oyj · **Provider:** Lifetime Oy · **Version:** 1.0 (DRAFT) · **Date:** 2026-06-26
**Classification:** Confidential — Kemira Oyj and Lifetime Oy only
**Audience:** Maria (Hintikka) Sederholm (VP, Fiber Essentials) · Mikko Pohjala (VP, Strategy) · CISO / Head of IT

---

## 0. Why this document

Both alternatives deliver the **same DWS IQ Aegis capability** for Kemira's carbon-compliance work — KYA-governed agents, EU AI Act Article 12 audit, deterministic carbon-declaration scoring, and sovereign EU operation. They differ only in **where the platform runs and who owns the iron.** This sheet states the trade-off plainly so the board can choose with eyes open.

The shared capability set (identical in both alternatives):

- **VulcanAgent** — ETS / CBAM carbon-declaration engine; deterministic scoring of every figure (no LLM in the number path — the model only drafts narrative, analyses gaps, and cites sources).
- **CSRD/ESRS readiness** — Scope 1/2/3 inventory and ESRS data-point coverage, reproducible to source for assurance.
- **CrossVerticalIntel** — bidirectional PCF: ingest supplier PCFs (per Kemira's Apr-2025 Supplier PCF Reporting Guideline), produce customer-facing per-product footprints / EPDs.
- **KYA (Know Your Agent)** — verified agent identity, Firecracker MicroVM isolation, real-time kill authority, forensic audit trail.
- **Article 12 logging + Sovereignty Assessment** — every AI action logged with reasoning lineage; CLOUD Act exposure scored (Sovereign / Compliant / Partial / Exposed).

> **Verified context (from the board deck, PR #1509).** Kemira Oyj — Nasdaq Helsinki, HQ Helsinki; CEO Antti Salminen (since 12 Feb 2024); three business units since 1 Jan 2025 (Fiber Essentials — EVP Matula; Water Solutions; Packaging & Hygiene), Strategy & Sustainability under EVP Hildebrandt. SBTi-validated targets: **Scope 1&2 −51.23% by 2030 (vs 2018)**, **Scope 3 −32.5% by 2033 (vs 2021)**, **carbon-neutral Scope 1&2 by 2045**. CSRD/ESRS first sustainability statement (FY2024) under assurance _(confirm)_. Revenue ≈ €2.95B, ~4,700 employees, ~58 sites _(confirm)_.

---

## 1. Alternative A — Sovereign EU Cloud (UpCloud Helsinki)

**What it is.** DWS IQ Aegis as the canonical **software-only** platform, single-tenant Kubernetes on **UpCloud Managed Kubernetes, Helsinki DC (fi-hel1 / fi-hel2)** — Finnish-owned, Tesi-backed, ISO 27001, CISPE member, **zero CLOUD Act exposure**. NVIDIA **L40S** nodes provide local LLM inference inside the EU enclave.

**Best for:** fastest time-to-value, lowest up-front cost, no hardware to own or operate, group-wide reach across Kemira's ~58 sites without per-site iron.

|                                                  |                                                                                         |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| Hosting                                          | UpCloud UKS, Helsinki (Finnish sovereign cloud)                                         |
| Hardware to buy                                  | **None** (software-only; L40S inference is cloud capacity)                              |
| Sovereignty                                      | EU-sovereign, zero CLOUD Act; data resides in Finland on managed cloud                  |
| Speed                                            | Fastest — aligns to Aegis GA **Aug 2026**                                               |
| Commercial (canonical, `Store/PRODUCT_AEGIS.md`) | **Aegis Standard €59,990 onboarding + €999/mo** · **Aegis Defence €89,990 + €1,999/mo** |
| SLA                                              | 99.9% application / 99.999% infrastructure (UpCloud)                                    |

**Trade-off:** data lives on a (Finnish, sovereign, ISO-27001) _managed cloud_ rather than physically inside the plant. For most CSRD/ETS/PCF work this is fully sufficient and the recommended starting point.

---

## 2. Alternative B — On-Prem / Air-Gapped (Aegis Sovereign on a DWS Control Room / Situation Room)

**What it is.** The **Aegis Sovereign** tier deployed **air-gapped on a Kemira-owned DWS turnkey sovereign appliance** at a single site — the canonical **DWS Control Room** (single Acer Veriton GN100 node + NVIDIA model install) or the **DWS Situation Room** (2× GN100 bridged + wider NVIDIA model bundle). Aegis remains software-only; the appliance is the **customer-owned hardware substrate** (turnkey, on-site install included), exactly as in the Outokumpu hardware line-item model.

**Deployment model: one Control Room (or Situation Room) per factory** — the appliance sits on each site's network, fed by edge sensor nodes (cameras, acoustic, IoT, historian), running Aegis Sovereign air-gapped on-site. Scale by adding a unit per additional site.

**Best for:** maximum sovereignty where process/recipe data must **never leave the plant** — air-gapped operation, no managed-cloud dependency, latency at the panel, and a durable owned asset.

|                        |                                                                                                                                                                      |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hosting                | On-prem, air-gapped, plant network — no cloud dependency                                                                                                             |
| Hardware to buy        | **DWS Control Room €5,294** (single GN100 node) or **DWS Situation Room €10,093** (2× GN100 bridged + model bundle) — turnkey, customer-owned, on-site install incl. |
| On-site models         | NVIDIA model bundle (vision, acoustic, language, reasoning, voice) — bridged pair runs parallel inference for the wider bundle                                       |
| Sovereignty            | Maximum — air-gapped; emissions, process and recipe data never leave the site                                                                                        |
| Speed                  | Turnkey appliance, on-site install in one visit (slower than cloud, but no bespoke build)                                                                            |
| Commercial (canonical) | **Aegis Sovereign — Custom onboarding + €4,999/mo** software, **+ appliance CAPEX** (€5,294 / €10,093)                                                               |

**Trade-off:** appliance CAPEX and a single-site footprint. In return: a **canonical turnkey product with set pricing**, on-site install, and the strongest possible sovereignty story plus a Kemira-owned asset.

> **Which appliance.** DWS hardware ladder: Jetson edge nodes → **Control Room (GN100, €5,294)** → DGX Spark → **Situation Room (2× GN100, €10,093)** → IGX Orin. Pick the node to the site's model bundle and inference load: Control Room for a single-node compliance co-pilot; Situation Room's bridged pair when you also want acoustic/vision site monitoring alongside compliance. For the largest 1M-token-context flagship workloads, a DGX-class node is the upper rung (cf. the archived `docs/DGX_SPARK_3X_KEMIRA_*_OLD` technical notes).

---

## 3. Side-by-Side

| Dimension          | **A — Sovereign EU Cloud**                                   | **B — On-Prem / Air-Gapped**                      |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------- |
| Aegis capability   | Identical (VulcanAgent, KYA, Article 12, CrossVerticalIntel) | Identical                                         |
| Where data lives   | Finnish sovereign cloud (UpCloud Helsinki)                   | Physically inside the plant, air-gapped           |
| CLOUD Act exposure | None (Finnish-owned, CISPE, ISO 27001)                       | None (no external network at all)                 |
| Hardware ownership | None (software-only)                                         | DWS Control Room / Situation Room, customer-owned |
| Up-front cost      | €59,990 / €89,990 onboarding                                 | Custom onboarding + €5,294–€10,093 appliance      |
| Recurring          | €999 / €1,999 per month                                      | €4,999 per month                                  |
| Time to value      | Fastest (GA Aug 2026)                                        | Slower (procurement + OT integration)             |
| Scope              | Group-wide, many sites                                       | Single high-sensitivity site                      |
| Best when          | CSRD/ETS/PCF at scale, speed matters                         | Recipe/OT data must never leave the plant         |

---

## 4. Recommendation

**Start with Alternative A** (Sovereign EU Cloud) for the Fiber Essentials pilot aligned to Aegis GA — it is the fastest path to measured carbon-declaration cycle-time, audit coverage, and hours reclaimed, with full EU sovereignty and zero hardware to own. **Reserve Alternative B** (on-prem / air-gapped Aegis Sovereign on a DWS Control Room or Situation Room appliance) for any site or product line where process/recipe data sensitivity demands a physical air-gap, or where Kemira prefers a CAPEX-owned asset over OPEX. The two are not exclusive: pilot on cloud, then place on-prem where sovereignty requires it. Both run the identical Aegis agents and audit chain — so the choice is purely deployment topology, not capability.

---

## 5. Assumptions & Caveats

1. **Pricing is canonical.** Aegis tier prices are from `Store/PRODUCT_AEGIS.md`; appliance prices (Control Room €5,294, Situation Room €10,093) from `dws10.com/config/products.json` (single source). Aegis software bundles no hardware — the appliance is a separate customer-owned CAPEX line.
2. **Deterministic scoring (Rule 5).** Scope 1/2/3, ESRS coverage, ETS and PCF are computed by testable code; the LLM only drafts, gap-analyses, and cites. This is what makes output audit-defensible.
3. **CBAM scope is narrow today** — cement, iron & steel, aluminium, fertilisers, hydrogen, electricity. Most of Kemira's chemistry is out of scope; value is mainly imported precursors / hydrogen and forward coverage. Confirm in scoping.
4. **Appliance sizing.** Pick Control Room (single GN100 node) vs Situation Room (bridged pair) to the site's model bundle and inference load; a DGX-class node is the upper rung for 1M-token-context flagship workloads. Confirm the model bundle in scoping.
5. **Assurance still needs a human auditor.** Aegis accelerates and traces the reporting; it does not replace the external assurance provider.
6. **Figures tagged _(confirm)_** are single-source from the board deck and must be validated with Kemira before board circulation.

---

_Provider: Lifetime Oy · Business ID 0772407-9 · VAT FI07724079 · Laidunmaanraitti 2 A 25, 02330 Espoo, Finland · CEO Risto Anton Päärni · risto.paarni@lifetime.fi_
_Companion documents: `sales-outreach/KEMIRA_AEGIS_BOARD_BUSINESS_CASE.html`, `sales-outreach/KEMIRA_AEGIS_BOARD_DECK.pptx`, `Store/PRODUCT_AEGIS.md`. Business case for discussion, not a contract._

# DWS Product Tiers & Partner Map

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.2 | Tool: Claude Code (Opus 4.7) | Session: claude/sovereign-ai-jurisdiction-PmlIN | Date: 25.04.2026 | Changes: Added "Cross-Tier Partners — Per-Tier Graduation" section to the Partner Map. Two cross-tier rows: Shufti Pro (KYA identity verification) — Connect: DPA approved · Sovereign Infra & Aegis: exploration; Cohere + Aleph Alpha (sovereign AI platform, post-merger 24-Apr-2026) — Connect: fast-track to approved · Sovereign Infra & Aegis: exploration Q3 2026. Documents the graduation rule: cross-tier partners clear Connect first, escalate per tier as sovereignty review clears.
- Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/product-tiers-partners-Jbh0U | Date: 20.04.2026 | Changes: Fixed Aiven → Aiven spelling; reframed Aiven as (a) Finnish managed PostgreSQL provider and (b) EU AI Act Article 12 compliance overlay (per CLOUD_ENVIRONMENTS.md §7). Named Hetzner Helsinki as actual Tier 1 sovereign compute provider; removed Supabase from Aegis data path because it is US-incorporated.
- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/product-tiers-partners-Jbh0U | Date: 19.04.2026 | Changes: Initial product tier matrix (Aegis / Sovereign Infra / Connect), partner map, market segmentation, positioning statement

Session Links & References:

- Claude Code (claude/product-tiers-partners-Jbh0U): https://github.com/blogtheristo/dws6/commits/claude/product-tiers-partners-Jbh0U
- Claude Code (claude/sovereign-ai-jurisdiction-PmlIN): https://github.com/blogtheristo/dws6/commits/claude/sovereign-ai-jurisdiction-PmlIN
- Related: investor-outreach/INVESTOR_MEMO_AEGIS.md, Admin/AEGIS_SWOT_BOARDY.md, docs/CLOUD_ENVIRONMENTS.md, docs/field-notes/2026-04-25-cohere-aleph-alpha-sovereign-ai-merger.md, docs/field-notes/2026-04-01-shufti-dpa-review-aegis-sovereignty.md

Document Status:

- Created: 19.04.2026
- Last Modified: 25.04.2026
- Language: English
- Publication Status: ACTIVE (Internal — sales, partner, investor reference)

Code-Version: 1.2
Branch: claude/sovereign-ai-jurisdiction-PmlIN
Date: 2026-04-25
Owner: Risto Anton Päärni, Lifetime Oy

---

**Effective Date:** 2026-04-08 (tiers finalized)
**Owner:** Risto Anton Päärni, Lifetime Oy
**Status:** Active
**Audience:** Internal — sales, partnerships, investor prep

---

## Purpose

Single source of truth for the three DWS product tiers, their target customers, and the partner ecosystem each tier draws from. Sovereignty is the segmentation axis — not a feature flag.

---

## Positioning Statement

**"Sovereignty is segmentation, not a restriction."**

Each tier is sold to a customer whose regulatory exposure determines what infrastructure they can legally use. The same agent stack is deployed differently per tier — same brain, different jurisdiction.

**Updated 28.05.2026 — three-pillar refinement (v1.3).** The DWS6 product segmentation (Aegis / Sovereign Infra / Connect) is the EU-origin enterprise's *operational expression* of the universal three-pillar (Data / Technology / Operational) × three-jurisdiction (EU / US / Singapore) sovereignty model. The pillar model is canonical in `docs/PHD_FIREHORSE_EN.md` §14.23 and explained for general audiences in `docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md` and the blog post `onelifetime.world/posts/sovereignty-field-note-2-three-pillars.html`. The vendor-tier model (T1/T2/T3 — `DWS_STANDARDS_LIBRARY.md` §3.6) operates *inside each pillar*, not above it.

- **Aegis** = J1 (EU)-emphasis SKU. All three pillars at full EU-sovereign (T1 vendor class). R-Sac²-ready surface for the post-quantum migration (NIST FIPS 203 / 204 / 205, 2030–2035 cutover horizon).
- **Sovereign Infra** = J1 (EU) baseline. Data pillar primary. Tech + Op pillars at EU operational sovereignty (T2 vendor class).
- **Connect** = J2 (US) / J3 (Singapore) market-access SKU. Tech + Op pillars under non-EU jurisdiction. Data pillar deliberately light.

KYA-track mapping per pillar: Data → SIB-track, Technology → CSB-track, Operational → EAB-track, ASB-track binding the identity spine. Procurement gates speak the four-track vocabulary instead of marketing language.

---

## Tier Matrix

| Tier                         | Sovereignty Posture | Target Customer                              | Hosting                                                                                          | CLOUD Act Exposure | Pricing                                                             |
| ---------------------------- | ------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------ | ------------------------------------------------------------------- |
| **DWS IQ Aegis**             | Full Sovereign      | Government, defence, critical infrastructure | Hetzner Helsinki + Aiven managed PostgreSQL (FI, EU-incorporated); Article 12 compliance overlay | Zero               | EUR 59,990 one-time + EUR 999/mo                                    |
| **DWS IQ 6 Sovereign Infra** | EU-Sovereign        | Regulated EU/UK enterprise SaaS              | Scaleway EU cloud + EU IDV (iDenfy candidate)                                                    | None               | Enterprise Navigator / Premium / Nordic / World tiers (see pricing) |
| **DWS IQ Connect**           | Global              | Global enterprise, no sovereignty constraint | US/global cloud (AWS, Azure, NVIDIA), APAC, MENA                                                 | Standard           | Tier-priced via partner channels                                    |

---

## Tier 1 — DWS IQ Aegis (Full Sovereign)

**Audience:** EU government agencies, defence contractors, dual-use manufacturing.

**Control plane:** **Themis — the Aegis Control Plane.** DWS's proprietary implementation of the open KYA standard: identity attribution, Article 12 logging pipeline, Annex III systems registry, and policy gating bundled into one sovereign control plane. Ships with every Aegis deployment. Open-standard architecture documented in `DWS_ARTICLE_12_LOGGING_STANDARD.md`.

**Sovereignty:**

- EUDI Wallet native authentication
- Zero CLOUD Act exposure (no US-incorporated vendor in the data path)
- Hosting: **UpCloud** / **Hetzner Helsinki** (EU-incorporated compute, Finnish data centre)
- Database: **Aiven managed PostgreSQL** (Finnish-owned, EU region) — replaces Supabase for Aegis because Supabase is US-incorporated
- Control plane: **Themis** — hash-chained append-only ledger on Aiven Postgres, KYA-attested events, 6-month minimum retention, auditor JSON export under 10 business days
- Article 26 deployer evidence on file

**Use cases:**

- Defence procurement compliance (EDIP DEF 2.0 readiness)
- Dual-use export control (EU 2021/821)
- Critical infrastructure NIS2/KRITIS reporting
- Sovereign AI inference for classified workflows

**Pricing:** EUR 59,990 one-time + EUR 999/mo. Margin-positive from day one.

**Reference docs:**

- `investor-outreach/INVESTOR_MEMO_AEGIS.md`
- `Admin/AEGIS_SWOT_BOARDY.md`
- `docs/legal/AEGIS_PLATFORM_TERMS.md`

---

## Tier 2 — DWS IQ 6 Sovereign Infra (EU-Sovereign)

**Audience:** Regulated EU/UK enterprise — construction, logistics, energy, manufacturing.

**Sovereignty:**

- No US infrastructure in the data path
- No CLOUD Act hook
- Scaleway EU cloud (Paris/Amsterdam) for inference and storage
- EU-resident IDV provider (iDenfy candidate; alternatives under review)
- GDPR-native, CSRD/ETS/CBAM-ready

**Use cases:**

- CSRD/ESRS reporting (EU 2022/2464)
- ETS/CBAM compliance (EU 2003/87, EU 2023/956)
- ERP-integrated emission accounting (SAP, IFS, Dynamics, Monitor, Visma, Jeeves)
- Multi-vendor consortium delivery (DWS 6 Consortium Program)

**Pricing tiers:**

| Sub-tier                 | Audience                                    |
| ------------------------ | ------------------------------------------- |
| **Enterprise Navigator** | Mid-market with single-country footprint    |
| **Premium**              | Multi-country EU enterprise                 |
| **Nordic**               | Nordic region pack (FI, SE, NO, DK)         |
| **World**                | EU-headquartered enterprise with global ops |

**Add-on SKU:**

| Add-on                               | Audience                                                                       | Price                          |
| ------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------ |
| **Themis — The Aegis Control Plane** | Tier 2 customers needing EU AI Act Article 12 compliance on their own EU cloud | **€14,990 one-time + €499/mo** |

Themis is DWS's proprietary implementation of the open KYA standard — Article 12 logging pipeline, Annex III systems registry, policy gate, KYA policy proxy. Tier 2 customers buy it standalone and deploy on Scaleway / OVH / Red Hat OpenShift / Azure AI Foundry EU. Tier 1 customers (Aegis) receive it bundled at no extra cost. See `Store/PRODUCT_THEMIS.md` and `dws10.com/products/themis.html`.

---

## Tier 3 — DWS IQ Connect (Global)

**Audience:** Global enterprise without EU sovereignty constraint; APAC and MENA reach via regional cloud partners.

**Sovereignty:**

- US infrastructure permitted (AWS, Azure, NVIDIA inference)
- Broadest market reach
- No CLOUD Act sovereignty claim — explicit in contracts
- Regional partner clouds for APAC (Alibaba) and Gulf/MENA (G42)

**Use cases:**

- Global supply chain compliance for non-EU enterprises
- APAC manufacturing emissions tracking via Alibaba Cloud
- Gulf/MENA energy and construction reporting via G42
- US enterprise pilots (NVIDIA Connect ISV co-sell)

**Pricing:** Tier-priced; channel-led via partner programs.

---

## Partner Map

### Cross-Tier Partners — Per-Tier Graduation

Some partners deliver one capability across all three tiers but graduate per tier — Connect (Tier 3) clears first because its sovereignty posture is permissive; Sovereign Infra (Tier 2) and Aegis (Tier 1) graduate after stricter sovereignty review (EU-only sub-processor chain, Annex A inventory, residency assertions, sometimes addenda). Status is tracked **per tier**, not as a single flat row.

| Capability                                | Partner                                                    | Tier 3 — Connect                                                     | Tier 2 — Sovereign Infra                                                          | Tier 1 — Aegis                                                                                                        |
| ----------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Agent identity verification (KYA Layer 1) | **Shufti Pro**                                             | **DPA approved**                                                     | Exploration                                                                       | Exploration (addendum negotiation in flight per `docs/field-notes/2026-04-01-shufti-dpa-review-aegis-sovereignty.md`) |
| Sovereign AI platform (model + serving)   | **Cohere + Aleph Alpha** (post-merger entity, 24-Apr-2026) | **Fast-track to approved** (Cohere North as Canada-anchored default) | Exploration Q3 2026 (Cohere North + Pharia on Scaleway / OVH / Red Hat OpenShift) | Exploration Q3 2026 (Pharia weights on Hetzner Helsinki, EU-only sub-processor chain)                                 |

**Graduation rule:** A cross-tier partner is added at Connect first under a standard DPA, then escalated to Sovereign Infra and Aegis as the per-tier sovereignty review clears. Self-hosted Llama / Mistral remains the Aegis fallback for the sovereign AI platform row until the Tier-1 DPA clears.

### Tier 3 (Connect) — Global Hyperscaler & Regional Partners

| Region      | Partner       | Program / Status                       |
| ----------- | ------------- | -------------------------------------- |
| US          | NVIDIA        | Connect ISV Partner                    |
| US          | AWS           | Advanced Consulting Partner            |
| US          | Microsoft     | Microsoft Founders Hub                 |
| US          | IBM           | IBM Business Partner                   |
| APAC        | Alibaba Cloud | Regional cloud — APAC reach            |
| Gulf / MENA | G42           | Regional cloud — also valid for Tier 2 |

### Tier 2 (Sovereign Infra) — EU Cloud & Identity

| Function           | Partner  | Status                         |
| ------------------ | -------- | ------------------------------ |
| EU compute         | Scaleway | Active (Paris / Amsterdam)     |
| EU IDV             | iDenfy   | Candidate (under evaluation)   |
| Gulf / MENA bridge | G42      | Cross-listed with Connect tier |

### Tier 1 (Aegis) — Sovereign Stack

| Function           | Partner / Provider                                                    | Status                                                |
| ------------------ | --------------------------------------------------------------------- | ----------------------------------------------------- |
| Sovereign compute  | UpCloud (FI) / Hetzner Helsinki (EU-incorporated, FI data centre)     | Active                                                |
| Sovereign database | Aiven managed PostgreSQL (Finnish-owned, EU)                          | Active                                                |
| Control plane      | **Themis — The Aegis Control Plane** (DWS-proprietary, KYA-compliant) | Shipping with Aegis; full Article 12 pipeline Q2 2026 |
| Identity           | EUDI Wallet                                                           | Native (timeline per EU schedule)                     |

**Note:** Aiven is a Finnish-owned managed-database SaaS (aiven.io) and is used at Aegis tier as the sovereign PostgreSQL provider and the storage backend for the Themis hash-chained event ledger. **Themis** is DWS's own proprietary control plane — not an Aiven product — implementing the open KYA standard (identity, Article 12 logging, Annex III registry, policy gating). Supabase is **not** used in Aegis because it is US-incorporated and would void the zero-CLOUD-Act claim.

---

## Market Segmentation Summary

| Tier                | Primary Markets                                                          |
| ------------------- | ------------------------------------------------------------------------ |
| **Aegis**           | EU government agencies, defence contractors, dual-use manufacturing      |
| **Sovereign Infra** | EU/UK regulated enterprise — construction, logistics, energy             |
| **Connect**         | Global enterprise; APAC reach via Alibaba Cloud; Gulf/MENA reach via G42 |

---

## Sales Decision Tree

1. **Does the customer have CLOUD Act sensitivity (defence, government, classified data)?**
   → **Aegis.** No exception. EUR 59,990 + EUR 999/mo.
2. **Is the customer EU/UK and CSRD/ETS/CBAM/NIS2 exposed?**
   → **Sovereign Infra.** Match sub-tier to footprint (Navigator / Premium / Nordic / World).
3. **Is the customer outside the EU or has explicit non-sovereign posture?**
   → **Connect.** Route via the regional partner that owns the geography.

If a prospect spans tiers (e.g. EU HQ with US subsidiary), default to the **highest sovereignty tier** that covers the regulated workload, then offer Connect for non-regulated subsidiaries as a sidecar.

---

## Cross-References

- `CLOUD_ENVIRONMENTS.md` — US / EU cloud infrastructure + Article 12 Logging Pipeline (§7)
- `../DWS_DATA_STANDARD.md` — Data residency rules
- `../DWS_SECURITY_STANDARD.md` — AI safety, enterprise security framework
- `../Admin/SECURITY_COMPLIANCE.md` — Deployment controls and certifications
- `../Partners/CERTIFIED_PARTNERS_PROGRAM.md` — Training and consortium partner program
- `../investor-outreach/INVESTOR_MEMO_AEGIS.md` — Defence-vertical investor pitch

---

## Open Items

- [ ] Confirm iDenfy as EU IDV provider (alternatives: Veriff EE, Onfido EU)
- [ ] Document G42 partnership terms for Gulf/MENA (sovereign-eligible vs. Connect-only)
- [ ] Map Sovereign Infra sub-tier pricing into `dws10.com/config/products.json`
- [ ] Add Connect-tier ISV co-sell motion to `Partners/CERTIFIED_PARTNERS_PROGRAM.md`
- [ ] **Shufti — graduate from Connect to Sovereign Infra and Aegis.** Close the addendum negotiation per `docs/field-notes/2026-04-01-shufti-dpa-review-aegis-sovereignty.md`; flip the Aegis cell from _Exploration_ to _DPA approved_ once signed. Sync `Store/PRODUCT_AEGIS.md` line 162 to per-tier wording (currently flat _Partnership pending_ — RED zone, human-applied).
- [ ] **Cohere + Aleph Alpha — open Tier-3 DPA, scope Tier-1 / Tier-2 sovereignty review.** Tier 3: standard DPA on the merged entity to fast-track Connect. Tier 2: confirm EU-only processing for Pharia weights + Cohere North inference on Scaleway / OVH / OpenShift. Tier 1: assert zero non-EU data path for Pharia on Hetzner Helsinki, full Annex A sub-processor inventory. Target: Q3 2026.

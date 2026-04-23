# DWS Product Tiers & Partner Map

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/product-tiers-partners-Jbh0U | Date: 20.04.2026 | Changes: Fixed Aiven → Aiven spelling; reframed Aiven as (a) Finnish managed PostgreSQL provider and (b) EU AI Act Article 12 compliance overlay (per CLOUD_ENVIRONMENTS.md §7). Named Hetzner Helsinki as actual Tier 1 sovereign compute provider; removed Supabase from Aegis data path because it is US-incorporated.
- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/product-tiers-partners-Jbh0U | Date: 19.04.2026 | Changes: Initial product tier matrix (Aegis / Sovereign Infra / Connect), partner map, market segmentation, positioning statement

Session Links & References:

- Claude Code (claude/product-tiers-partners-Jbh0U): https://github.com/blogtheristo/dws6/commits/claude/product-tiers-partners-Jbh0U
- Related: investor-outreach/INVESTOR_MEMO_AEGIS.md, Admin/AEGIS_SWOT_BOARDY.md, docs/CLOUD_ENVIRONMENTS.md

Document Status:

- Created: 19.04.2026
- Last Modified: 19.04.2026
- Language: English
- Publication Status: ACTIVE (Internal — sales, partner, investor reference)

Code-Version: 1.1
Branch: claude/product-tiers-partners-Jbh0U
Date: 2026-04-20
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

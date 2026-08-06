<!--
VERSION AND AGENT HISTORY
Document: PILOT_SHEET_SSAB_ZERO.md
Version: 1.0 — DRAFT (clone of PILOT_SHEET_OUTOKUMPU_FORTA.md for account #2)
Last-Updated: 2026-06-07
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-8)
Branch: claude/ssab-cbam-account2-clone
Owner: risto.paarni@lifetime.fi
Status: DRAFT — verify-before-send items only:
        - SSAB contracting entity + org/VAT no. (SSAB AB (publ), Stockholm,
          or Finnish entity SSAB Europe Oy, Raahe) — confirm which
        - Customer sponsor + commercial signatory
        - SSAB Zero / Docol sub-line locks in Stage 1 (by design)
        - R05 General Counsel review §11/§12
        - Export to PDF (Pandoc command below)
Audience: Christina Friborg (EVP Sustainability) primary; Carl Orrling (CTO/
          Transformation) co-sponsor; routable to CFO Leena Craelius (R23).
Companion: SSAB_DISCLOSURE_IP_EXPOSURE_BRIEF.md; clone of NVIDIA HW line items
           (swap SKUs only) if hardware in scope.
Legal note: PILOT PROPOSAL, not a contract. Subject to mutual NDA + separate
            pilot agreement on Lifetime Oy standard terms. R05 review mandatory.
Export: pandoc PILOT_SHEET_SSAB_ZERO.md -o PILOT_SHEET_SSAB_ZERO.pdf --pdf-engine=xelatex --variable=geometry:a4paper,margin=20mm
Provenance: structure + commercial terms cloned from the Outokumpu Forta pilot
            sheet (account #1). Bespoke vs source ~20-25% (door, SKU, source
            systems, framing) — feeds the CBAM wedge scoreboard repeatability test.
-->

# Pilot Proposal — Sovereign CBAM / Fossil-Free Disclosure Pipeline (SSAB Zero / Docol)

**Customer:** SSAB *(entity TBD — SSAB AB (publ) / SSAB Europe Oy)*
**Provider:** Lifetime Oy
**Date issued:** 2026-06-07 *(update on send date)*
**Version:** 1.0 *(draft — supersedes none)*
**Classification:** Confidential — SSAB and Lifetime Oy only

---

## 1. Parties

| Role | Party | Details |
|---|---|---|
| **Provider** | Lifetime Oy | Espoo, Finland. Business ID 0772407-9. VAT FI07724079. Laidunmaanraitti 2 A 25, 02330 Espoo. |
| **Provider primary contact** | Risto Anton Päärni | CEO, Lifetime Oy. risto.paarni@lifetime.fi |
| **Customer** | SSAB | *[Entity TBD: SSAB AB (publ), Stockholm, or SSAB Europe Oy, Raahe. Org/VAT no. — verify]* |
| **Customer primary contact (door)** | Christina Friborg | EVP & Head of Sustainability, SSAB *(verify contact)* |
| **Customer tech co-sponsor** | Carl Orrling | EVP CTO + Transformation Office *(verify)* |
| **Customer commercial signatory** | *[TBD — typically CFO Leena Craelius / Procurement]* | |

---

## 2. Pilot scope

- **Product line in scope:** one **SSAB Zero** or **Docol** fossil-free sub-line, selected by Customer during Stage 1 scoping.
- **Workflow in scope:** KYA-governed CBAM / EPD / Scope-3 disclosure pipeline. Field-level allow / redact / aggregate rules authored jointly by Customer's **Sustainability + CTO/R&D** functions (the hydrogen-DRI process-IP owners). Cryptographic human-bound veto path before publication.
- **Source data integration:** DRI / EAF (HYBRIT route) historian, energy management system (fossil-free electricity / PPA), iron-ore / pellet feed registry. Read-only; no source-data mutation.
- **Output:** signed CBAM / EPD / Scope-3 disclosure document attachable to a sales quote, with Article 12 audit log per disclosure.
- **Out of scope:** other SSAB product lines (replicable post-pilot at commercial conversion); upstream supplier disclosure governance (separate workstream).

---

## 3. Duration and effort

| Item | Value |
|---|---|
| Total duration | 3 months from contract signature |
| Provider effort | 50% (~1.5 person-months of senior engineer / CEO time) |
| **Stage 1 — Scoping** | 1–2 weeks, **FREE OF CHARGE**. Lock scope, SSAB Zero / Docol sub-line selection, source-data audit, baseline measurement. |
| **Stage 2 — Pilot execution** | ~10 weeks. Pipeline build, KYA integration, weekly delivery cycles, Sustainability+CTO/R&D review loop, measurement collection. |
| Start date | *[TBD — default 5 business days after signature]* |

---

## 4. Commercial terms

| Item | Value |
|---|---|
| **Pilot price (Provider effort)** | **€24,000 (ex-VAT)** *(SEK equivalent on request)* |
| Currency | EUR (SEK optional) |
| Budget source | SSAB |
| Payment schedule | *[Default: 50% on signature, 50% on Milestone 12 (final report) acceptance. Adjustable per Customer AP terms.]* |
| VAT treatment | EU B2B intra-community reverse charge (Customer accounts for VAT) |
| Invoicing | Monthly progress invoices acceptable; default per schedule above |
| **NVIDIA hardware** | Customer CAPEX, Customer owns, stays with Customer after pilot. Sourced via NVIDIA EU partner channel at list. No Lifetime margin. See HW line items (clone, SKU-swapped) if in scope. |
| **EU sovereign cloud services** | OPEX, monthly pass-through (Scaleway Paris and/or Aiven Helsinki). At provider cost, no margin. Customer may BYO. |
| BYO option (hardware) | Customer may deploy on existing NVIDIA workstations/servers if equivalent. Lifetime provides config + integration only. |
| BYO option (cloud) | Customer may use existing Scaleway / Aiven contracts. Provider invoices Customer directly. |
| Cancellation | Customer may cancel at any time; pro-rated effort to cancellation date. No penalty. |

---

## 5. Deliverables

1. **KYA-governed disclosure pipeline** integrating SSAB source systems (DRI/EAF historian, energy mgmt, iron-ore feed registry).
2. **Process-IP veto path:** field-level allow / redact / aggregate rules authored by Customer Sustainability + CTO/R&D; cryptographic human-bound gate before publication (hydrogen-DRI detail stays gated).
3. **Article 12 audit log** (EU AI Act) for every AI-mediated action.
4. **Before/after measurement report** covering the three KPIs in §7.
5. **Technical documentation:** architecture diagram, KYA configuration, IP-rule schema, integration runbook, operator guide.
6. **Final pilot report** (English) including commercial-conversion recommendation.

---

## 6. Milestones

| Week | Milestone | Provider deliverable | Customer responsibility |
|---|---|---|---|
| 0 | Contract signature | Stage 1 scoping kickoff | Assign technical contact + process-IP policy owner |
| 1–2 | Stage 1 scoping | SSAB Zero / Docol sub-line locked; source-data audit; baseline (cycle time, IP coverage %, sales-eng hours) | Read-only source access; assign sales-engineering counterpart |
| 3–4 | Pipeline architecture | KYA configuration; IP-rule schema (joint with Sustainability + CTO/R&D) | Author first-pass field-level rules |
| 5–7 | Pipeline build | First signed disclosure via pilot pipeline; review loop integration | Review first-pass disclosures; refine rules |
| 8–10 | Pilot execution | Weekly cycles; rolling disclosure generation against live/staged quotes | Trigger disclosure requests; ongoing review |
| 11 | Measurement collection | Before/after analysis on the three KPIs | Validate measurement data |
| 12 | Final report + conversion review | Final report; conversion recommendation; success-criteria evaluation | Decide on commercial conversion |

---

## 7. Measurement (KPIs)

All measurements use Customer's actual data from the pilot SSAB Zero / Docol line. Baseline measured weeks 1–2; pilot performance weeks 8–11.

| # | KPI | Baseline (sector benchmark; Customer-actual measured in Stage 1) | Target at pilot exit | Measurement method |
|---|---|---|---|---|
| 1 | **Disclosure cycle time** | 18–42 days/disclosure (sector benchmark; Customer-actual TBD) | **< 2 minutes per disclosure** | Time from disclosure request to signed document on quote. Sampled across pilot. |
| 2 | **Process-IP coverage rate** | < 10% (ad-hoc; Customer-actual TBD) | **≥ 95%** of pilot-period disclosures pass the IP-gate | Pipeline logs % gated through IP-rule schema before publication. |
| 3 | **Sales-engineering hours reclaimed** | 8–16 h/disclosure (sector benchmark; Customer-actual TBD) | **≥ 240 hours/rep/year extrapolated** | Time tracking on disclosure tasks: before vs during pilot. |

---

## 8. Success criteria for commercial conversion

If at pilot exit (week 12) measurements show all three of:
- KPI 1: **≥ 90% cycle-time reduction** from Customer-actual baseline,
- KPI 2: **≥ 95% process-IP coverage rate**, and
- KPI 3: **≥ 240 hours/rep/year reclaimed**,

then Customer has the **option** to convert to a commercial DWS IQ license on terms to be agreed separately. Conversion is at Customer's sole discretion; pilot completion creates no commercial obligation.

If success criteria are not met, pilot ends with delivery of the final report. No obligation either way.

---

## 9. Governance and compliance

- **KYA-attested operator identity** for every AI-mediated action. Cryptographic, human-bound, auditable.
- **EU AI Act Article 12 audit log:** automatic, immutable, per-action.
- **EU AI Act Annex III alignment:** high-risk AI use case in regulated industrial disclosure.
- **NIS2:** incident-reporting capability built in.
- **GDPR:** data processing limited to Customer's own data; DPA template on request.
- **Trade-secret protection:** all source data + IP-rule schemas treated as Customer trade secret (hydrogen-DRI process); provider personnel under NDA.
- **Sovereignty:** all infrastructure Tier 1 Full EU Sovereign per `DWS_STANDARDS_LIBRARY.md` §3.6. No US CLOUD Act perimeter on Customer data or process IP.

---

## 10. IP ownership

| Asset | Owned by |
|---|---|
| DWS IQ platform, KYA framework, agent definitions, methodology | Lifetime Oy |
| SSAB source data, IP-rule schemas authored by SSAB, generated disclosures | SSAB |
| Pilot measurement data | Joint — internal use by both; external publication needs written consent of the other |
| Improvements to the DWS IQ platform during the pilot | Lifetime Oy (Customer benefits via platform) |
| Improvements specific to SSAB's IP-rule schema | SSAB |

---

## 11. Legal framework

- **Governing law:** *[Finland if SSAB Europe Oy contracts; Sweden if SSAB AB — confirm]*.
- **Jurisdiction:** *[Helsinki District Court / Stockholm — per entity]*.
- **Mutual NDA:** prerequisite to Stage 1.
- **Liability cap:** Provider aggregate liability capped at pilot price (€24,000). Standard exclusions for gross negligence, wilful misconduct, IP indemnification.
- **Pilot agreement:** this proposal is subject to a separate pilot agreement on Lifetime Oy standard terms; material terms carry over.

---

## 12. Acceptance

Valid 30 days from the date issued in §0. Acceptance by Customer signature initiates Stage 1 scoping; legal-framework finalisation runs in parallel and must execute before Stage 2.

| | Lifetime Oy | SSAB |
|---|---|---|
| Signed by | Risto Anton Päärni, CEO | *[Name + title]* |
| Date | | |
| Email | risto.paarni@lifetime.fi | *[Email]* |

---

## Document control

- Provenance / source: `sales-outreach/PILOT_SHEET_OUTOKUMPU_FORTA.md` (account #1 — cloned, SKU/door-swapped).
- Companion: `sales-outreach/SSAB_DISCLOSURE_IP_EXPOSURE_BRIEF.md`; `sales-outreach/SSAB_SALES_GOIN.md` (buying centre).
- Sovereignty / compliance: `DWS_STANDARDS_LIBRARY.md` §3.1, §3.3, §3.6.
- Scoreboard: `sales-outreach/CBAM_WEDGE_SCOREBOARD.md` (account #2 row).

## Pre-send checklist for Risto

- [ ] Confirm SSAB contracting entity (SSAB AB (publ) vs SSAB Europe Oy) + org/VAT no.
- [ ] Confirm door (Friborg) + tech co-sponsor (Orrling) + commercial signatory (CFO Craelius / Procurement)
- [ ] Confirm SSAB Zero vs Docol sub-line (or let Customer pick in Stage 1)
- [ ] Set governing law/jurisdiction per entity (§11)
- [ ] R05 General Counsel review §10 (IP) + §11 (legal)
- [ ] Clone NVIDIA HW line items (SKU-swap only) if hardware in scope
- [ ] Convert to PDF; attach PDF (not .md)

<!--
VERSION AND AGENT HISTORY
Document: PILOT_SHEET_OUTOKUMPU_FORTA.md
Version: 0.9 — DRAFT (scaffold for Risto to fill remaining blanks)
Last-Updated: 2026-05-25
Status: DRAFT. Send-ready when:
        - All [TBD] fields filled in by Risto
        - Reviewed by R05 General Counsel (Lifetime side) or equivalent
        - Forta sub-line confirmed by Outokumpu in Stage 1 scoping
        - Converted to PDF (Pandoc: pandoc PILOT_SHEET_OUTOKUMPU_FORTA.md -o
          PILOT_SHEET_OUTOKUMPU_FORTA.pdf --pdf-engine=xelatex)
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7) — scaffold drafted; commercial
       values reused from material package + Reply 2 v1.2. Legal
       framework defaults to Finnish standard practice; legal review
       required before contract execution.
Branch: claude/exa-openclaw-integration-YnDpO
Date: 2026-05-25
Owner: risto.paarni@lifetime.fi
Audience: Ari Hirvonen primary; routable to Outokumpu Procurement
          (R20 / R21), CFO (R23), General Counsel / Legal (R05 / R06).
Funnel role: Attachment 1/2 referenced in Reply 2 v1.2 ("Here is the
             detailed pilot sheet and the NVIDIA hardware line items").
             Companion: NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md.
Legal note: This is a PILOT PROPOSAL, not a contract. Subject to
            mutual NDA and execution of separate pilot agreement on
            Lifetime Oy standard terms. R05 General Counsel review
            mandatory before signature.
-->

# Pilot Proposal — Sovereign CBAM Disclosure Pipeline

**Customer:** Outokumpu Oyj
**Provider:** Lifetime Oy
**Date issued:** 2026-05-25 *(Risto: update on send date)*
**Version:** 0.9 *(draft — supersedes none)*
**Classification:** Confidential — Outokumpu Oyj and Lifetime Oy only

---

## 1. Parties

| Role | Party | Details |
|---|---|---|
| **Provider** | Lifetime Oy | Espoo, Finland. Business ID 0772407-9. VAT FI07724079. Laidunmaanraitti 2 A 25, 02330 Espoo. |
| **Provider primary contact** | Risto Anton Päärni | CEO, Lifetime Oy. risto.paarni@lifetime.fi |
| **Customer** | Outokumpu Oyj | Helsinki, Finland. Business ID *[TBD — fill from PRH]*. VAT *[TBD]*. |
| **Customer primary contact** | Ari Hirvonen | Patent IP Director, Outokumpu Oyj. ari.hirvonen@outokumpu.com *(verify)* |
| **Customer commercial signatory** | *[TBD — typically CFO / Procurement]* | |

---

## 2. Pilot scope

- **Product line in scope:** one Outokumpu Forta sub-line, to be selected by Customer during Stage 1 scoping (candidates: Forta H-series, Forta SX, Forta LDX, or Customer's nominated alternative).
- **Workflow in scope:** KYA-governed CBAM / EPD / Scope-3 disclosure pipeline. Field-level allow / redact / aggregate rules authored by Customer's IP function. Cryptographic human-bound veto path before publication.
- **Source data integration:** melt-shop and EAF historian, energy management system, scrap registry. Read-only; no source-data mutation.
- **Output:** signed CBAM / EPD / Scope-3 disclosure document, attachable to a sales quote, with Article 12 audit log per disclosure.
- **Out of scope:** other Outokumpu product lines (replicable post-pilot at commercial conversion); upstream supplier disclosure governance (separate workstream, can be added at commercial conversion).

---

## 3. Duration and effort

| Item | Value |
|---|---|
| Total duration | 3 months from contract signature |
| Provider effort | 50% (~1.5 person-months of senior engineer / CEO time) |
| **Stage 1 — Scoping** | 1–2 weeks, **FREE OF CHARGE**. Lock scope, Forta sub-line selection, source-data audit, baseline measurement. |
| **Stage 2 — Pilot execution** | ~10 weeks. Pipeline build, KYA integration, weekly delivery cycles, IP-function review loop, measurement collection. |
| Start date | *[TBD — depends on signature date; default 5 business days after signature]* |

---

## 4. Commercial terms

| Item | Value |
|---|---|
| **Pilot price (Provider effort)** | **€24,000 (ex-VAT)** |
| Currency | EUR |
| Budget source | Outokumpu Oyj |
| Payment schedule | *[Default: 50% on contract signature, 50% on Milestone 12 (final report) acceptance. Adjustable per Customer's standard AP terms.]* |
| VAT treatment | EU B2B intra-community reverse charge (Customer accounts for VAT) |
| Invoicing | Monthly progress invoices acceptable; default per payment schedule above |
| **NVIDIA hardware** | **Customer CAPEX. Customer purchases, Customer owns. Hardware stays with Customer after the pilot** — durable infrastructure asset whether or not the pilot converts to commercial license. Sourced via NVIDIA EU partner channel at list (or partner discount where available). No Lifetime margin. See attached `NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md`. |
| **EU sovereign cloud services** | OPEX, monthly pass-through (Scaleway Paris and/or Aiven Helsinki). Billed at provider cost, no Lifetime margin. Customer may BYO if existing contracts exist. |
| BYO option (hardware) | Customer may deploy on existing NVIDIA workstations / servers if equivalent specifications. Lifetime provides configuration + integration only. |
| BYO option (cloud) | Customer may use existing Scaleway / Aiven contracts where available. Provider invoices Customer directly. |
| Cancellation | Customer may cancel at any time. Cancellation fee: Provider effort delivered up to cancellation date, pro-rated. No penalty. |

---

## 5. Deliverables

1. **KYA-governed disclosure pipeline** integrating with Outokumpu's existing source systems (melt-shop historian, energy mgmt, scrap registry).
2. **IP-function veto path:** field-level allow / redact / aggregate rules authored by Customer IP function; cryptographic human-bound gate before publication.
3. **Article 12 audit log** (EU AI Act compliance) for every AI-mediated action in the pipeline.
4. **Before/after measurement report** covering the three KPIs in §7.
5. **Technical documentation:** architecture diagram, KYA configuration, IP-rule schema, integration runbook, operator guide.
6. **Final pilot report** (English; Finnish translation on request) including commercial-conversion recommendation.

---

## 6. Milestones

| Week | Milestone | Provider deliverable | Customer responsibility |
|---|---|---|---|
| 0 | Contract signature | Stage 1 scoping kickoff | Assign Customer technical contact + IP function policy owner |
| 1–2 | Stage 1 scoping | Forta sub-line locked; source-data audit; baseline measurement (current cycle time, IP coverage %, sales-eng hours per disclosure) | Provide access to source systems (read-only); assign sales-engineering counterpart for baseline measurement |
| 3–4 | Pipeline architecture | KYA configuration; IP-rule schema design (joint with Customer IP function) | IP function authors first-pass field-level rules |
| 5–7 | Pipeline build | First signed disclosure generated via pilot pipeline (validation gate); IP-review loop integration | IP function reviews first-pass disclosures; refines rules |
| 8–10 | Pilot execution | Weekly delivery cycles; rolling disclosure generation against live (or staged) sales quotes | Sales-engineering counterpart triggers disclosure requests; IP function reviews ongoing |
| 11 | Measurement collection | Before/after analysis on the three KPIs | Validate measurement data |
| 12 | Final report and conversion review | Final pilot report; commercial-conversion recommendation; success-criteria evaluation | Decide on commercial conversion |

---

## 7. Measurement (KPIs)

All measurements use Customer's actual data from the pilot Forta sub-line. Baseline measured in §6 weeks 1–2; pilot performance measured in §6 weeks 8–11.

| # | KPI | Baseline (industry benchmark; Customer-actual measured in Stage 1) | Target at pilot exit | Measurement method |
|---|---|---|---|---|
| 1 | **Disclosure cycle time** | 18–42 days per disclosure (sector benchmark; Customer-actual TBD week 1–2) | **< 2 minutes per disclosure** | Time from sales engineer disclosure request to signed document attached to quote. Sampled across pilot period. |
| 2 | **IP-function coverage rate** | < 10% (ad-hoc review; Customer-actual TBD week 1–2) | **≥ 95%** of pilot-period disclosures pass through IP-review gate | Pilot pipeline logs % of disclosures gated through IP-rule schema before publication. |
| 3 | **Sales-engineering hours reclaimed** | 8–16 hours per disclosure (sector benchmark; Customer-actual TBD week 1–2) | **≥ 240 hours/rep/year extrapolated** (lower bound of sector benchmark) | Time tracking on disclosure-related tasks: before pilot (week 1–2) vs during pilot (week 8–11). |

---

## 8. Success criteria for commercial conversion

If at pilot exit (week 12) the measurements show all three of:

- KPI 1: **≥ 90% cycle-time reduction** from Customer-actual baseline,
- KPI 2: **≥ 95% IP-function coverage rate** of pilot-period disclosures, and
- KPI 3: **≥ 240 hours/rep/year reclaimed** (extrapolated from week 8–11 measurement),

then Customer has the **option** to convert to a commercial DWS IQ 6 license on terms to be agreed separately. Conversion is at Customer's sole discretion; pilot completion creates no commercial obligation on Customer.

If success criteria are not met, pilot ends with delivery of the final report. No commercial obligation on either party either way.

---

## 9. Compute and hardware (pass-through, see attached)

See attached `NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md` for itemised list. Summary:

- **NVIDIA compute:** Jetson Orin Nano edge units (site-edge inference) and / or DGX Spark cloud capacity (central training / batch inference). Scope-dependent on Stage 1.
- **EU sovereign data services:** Scaleway (Paris) and / or Aiven (Helsinki). Postgres, object storage, optional event streaming.
- All passed through at provider cost. No Lifetime margin.
- Customer may BYO existing contracts where they exist.
- Sovereignty: all infrastructure Tier 1 Full EU Sovereign per `DWS_STANDARDS_LIBRARY.md` §3.6. No US Cloud Act perimeter on Customer data or IP material.

---

## 10. Governance and compliance

- **KYA-attested operator identity** for every AI-mediated action in the pipeline. Cryptographic, human-bound, auditable.
- **EU AI Act Article 12 audit log:** automatic, immutable, per-action.
- **EU AI Act Annex III alignment:** confirmed (high-risk AI use case in regulated industrial disclosure).
- **NIS2:** incident reporting capability built in; 24h early warning, 72h final report flow.
- **GDPR:** data processing limited to Customer's own data; DPA template on request before signature.
- **Trade-secret protection:** all source data and IP-rule schemas treated as Customer trade secret; provider personnel under NDA per §12.

---

## 11. IP ownership

| Asset | Owned by |
|---|---|
| DWS IQ 6 platform, KYA framework, agent definitions, methodology | Lifetime Oy |
| Outokumpu source data, IP-rule schemas authored by Outokumpu, generated disclosures | Outokumpu Oyj |
| Pilot measurement data | Joint — both parties may use for internal reporting; external publication requires written consent of the other party |
| Improvements to the DWS IQ 6 platform made during the pilot | Lifetime Oy (Customer receives the benefit via the platform; no separate licence) |
| Improvements specific to Outokumpu's IP-rule schema | Outokumpu Oyj |

---

## 12. Legal framework

- **Governing law:** Finland.
- **Jurisdiction:** Helsinki District Court.
- **Mutual NDA:** prerequisite to Stage 1. Lifetime Oy standard mutual NDA on request, or reference existing NDA between the parties if one is in place.
- **Liability cap:** Provider's aggregate liability under this pilot capped at the pilot price (€24,000). Standard exclusions for gross negligence, wilful misconduct, and IP indemnification.
- **Pilot agreement:** This proposal is subject to mutual agreement on Lifetime Oy standard pilot terms, executed via separate pilot agreement document. Material terms (price, scope, duration, KPIs, success criteria) per this proposal carry over to the pilot agreement; legal-framework terms are finalised in the pilot agreement.

---

## 13. Acceptance

This proposal is valid for 30 days from the date issued in §0. Acceptance by Customer signature below initiates Stage 1 scoping kickoff; legal-framework finalisation (§12) runs in parallel and must be executed before Stage 2 pilot start.

| | Lifetime Oy | Outokumpu Oyj |
|---|---|---|
| Signed by | Risto Anton Päärni, CEO | *[Name + title]* |
| Date | | |
| Email | risto.paarni@lifetime.fi | *[Email]* |

---

## Document control

- Sources for commercial terms: `sales-outreach/LETTER_ARI_HIRVONEN_OUTOKUMPU_MATERIAL_PACKAGE.md`, `sales-outreach/LETTER_ARI_HIRVONEN_OUTOKUMPU_REPLY2_CLARIFICATION.md`.
- Sources for measurement baselines: `sales-outreach/CYCLE_TIME_BENCHMARK_OUTOKUMPU_FORTA.md`.
- Sources for sovereignty / compliance: `DWS_STANDARDS_LIBRARY.md` §3.1, §3.3, §3.6.
- Companion document: `sales-outreach/NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md`.
- This proposal supersedes nothing; first issuance.

## Pre-send checklist for Risto

- [ ] Fill all `[TBD]` fields in §1, §3, §4, §13
- [ ] Confirm Outokumpu business ID + VAT (PRH lookup)
- [ ] Confirm Customer commercial signatory (likely Outokumpu CFO or Procurement Director — Ari to nominate)
- [ ] Confirm preferred payment schedule (default 50/50 in §4; adjust if Outokumpu standard AP terms differ)
- [ ] R05 General Counsel review of §11 (IP ownership) and §12 (Legal framework) before issue
- [ ] Convert to PDF: `pandoc PILOT_SHEET_OUTOKUMPU_FORTA.md -o PILOT_SHEET_OUTOKUMPU_FORTA.pdf --pdf-engine=xelatex --variable=geometry:a4paper,margin=20mm`
- [ ] Attach PDF (not .md) to the email

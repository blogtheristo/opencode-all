# DWS Legal Standard

VERSION AND AGENT HISTORY
Version: 1.2
Date: 2026-06-10
Author: Claude Code (claude/susanna-hypponen-card-tnq9cl)
Owner: Lifetime Oy
Status: Active

Sessions & Modifications:

- Version: 1.2 | Tool: Claude Code | Session: claude/susanna-hypponen-card-tnq9cl | Date: 10.06.2026 | Changes: Legal Hub §3 reframed around Data Protection Management (tietosuojajohtaminen) as a managed, risk-based discipline; DPO line backed by external data-protection/AI-governance advisory bench; ISO/IEC 42001 (AI Management System) added to the certifications roadmap; Digia Hub partner trust signal added to §12 contact ecosystem
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/audit-shufti-dpa-artifacts-HFEGx | Date: 08.04.2026 | Changes: Updated Shufti Pro key facts with Companies House verification (PR #768), added DPA signatory Stephen Ullman, updated sub-processor status to addendum-ready, resolved open issue #6, added TeleSign/Twilio risk notes, added open issues #8-10 (ML training prohibition, Art. 9 basis, TeleSign noyb)
- Version: 1.0 | Tool: Claude Code | Session: claude/review-shufti-dpa-QYsiV | Date: 01.04.2026 | Changes: Initial DWS Legal Standard

---

## 1. Purpose

This standard governs all legal documents, agreements, and compliance frameworks for Lifetime Oy (trading as DWS IQ). It ensures consistency across the legal hub, partner agreements, product terms, and regulatory compliance documentation.

## 2. Legal Entity

| Field                                 | Value                                         |
| ------------------------------------- | --------------------------------------------- |
| **Company Name**                      | Lifetime Oy                                   |
| **Trading As**                        | DWS IQ                                        |
| **Business Identity Code (Y-tunnus)** | 0772407-9                                     |
| **VAT ID (ALV-tunnus)**               | FI07724079                                    |
| **Registered Address**                | Laidunmaanraitti 2 A 25, 02330 Espoo, Finland |
| **Country**                           | Finland                                       |
| **CEO**                               | Risto Anton Päärni                            |
| **CEO Email**                         | risto.paarni@lifetime.fi                      |
| **DPO**                               | dpo@lifetime.fi                               |
| **Privacy Team**                      | privacy@lifetime.fi                           |
| **Security Team**                     | security@lifetime.fi                          |
| **Governing Law**                     | Finnish law                                   |
| **Jurisdiction**                      | Espoon käräjäoikeus (Espoo District Court)    |

## 3. Legal Hub Structure

Public legal documents are published at `dws10.com/legal/` (HTML only — no .md files in public site folders per CLAUDE.md rule). The legacy `/legal-hub/*` root was consolidated into `/legal/` in April 2026; the three legacy paths are now redirect stubs that canonicalise to the `/legal/` equivalents.

### 3.1 Document Registry

| Document                            | Source (repo)                           | Public URL                    | Status      |
| ----------------------------------- | --------------------------------------- | ----------------------------- | ----------- |
| **Legal & Compliance Hub**          | `dws10.com/legal/index.html`            | `/legal/`                     | Active      |
| **Data Processing Agreement (DPA)** | `docs/DPA_DATA_PROCESSING_AGREEMENT.md` | `/legal/dpa.html`             | Active v1.2 |
| **Sub-Processor List**              | (embedded in DPA Annex A)               | `/legal/sub-processors.html`  | Active      |
| **DPA Print (Shufti)**              | `dws10.com/legal/dpa-print.html`        | `/legal/dpa-print.html`       | Active      |
| **Aegis Platform Terms**            | `docs/legal/AEGIS_PLATFORM_TERMS.md`    | `/legal/aegis-terms.html`     | Stub        |
| **KYA Partner Agreement**           | `docs/legal/KYA_PARTNER_AGREEMENT.md`   | `/legal/kya-partner.html`     | Stub        |
| **Dual-Use Export Notice**          | `docs/legal/DUAL_USE_EXPORT_NOTICE.md`  | `/legal/dual-use-notice.html` | Stub        |

### 3.2 Dual Folder Sync Rule

Per CLAUDE.md, all legal hub files must exist in both:

- `dws10.com/legal/` (source of truth)
- `landing-pages/dws10-com/legal/` (production)

Both must be updated in the same commit. The legacy `dws10.com/legal-hub/` and `landing-pages/dws10-com/legal-hub/` folders contain only redirect stubs (301-equivalent meta-refresh + canonical + JS `location.replace`) pointing to the corresponding `/legal/` paths — do not add new content there.

## 4. Data Processing Agreement (DPA)

### 4.1 GDPR Article 28 Compliance Matrix

The DPA (`docs/DPA_DATA_PROCESSING_AGREEMENT.md`) covers all mandatory GDPR Art. 28(3) clauses:

| GDPR Art. 28(3) Requirement                     | DPA Coverage | Article                    |
| ----------------------------------------------- | ------------ | -------------------------- |
| Process only on documented instructions         | ✅           | Art. 3.1.2                 |
| Confidentiality obligation for personnel        | ✅           | Art. 2.4, Art. 6           |
| Security measures (Art. 32)                     | ✅           | Art. 8, Annex B            |
| Sub-processor conditions                        | ✅           | Art. 7                     |
| Assist with data subject rights                 | ✅           | Art. 10                    |
| Assist with security, breach, DPIA (Art. 32-36) | ✅           | Art. 3.1.5, Art. 8, Art. 9 |
| Delete/return data at end                       | ✅           | Art. 13                    |
| Make available information for audits           | ✅           | Art. 12                    |
| Inform controller of unlawful instructions      | ✅           | Art. 3.1.2                 |

### 4.2 Additional Coverage

| Requirement                                | DPA Coverage | Article          |
| ------------------------------------------ | ------------ | ---------------- |
| AI-specific processing (EU AI Act Art. 12) | ✅           | Art. 2.6         |
| International transfers (SCC)              | ✅           | Art. 11, Annex C |
| Transfer Impact Assessments                | ✅           | Annex C.3        |
| Biometric data (Art. 9 special category)   | ✅           | Annex A (Shufti) |
| DORA compliance (financial entities)       | ✅           | Annex D          |
| Processing register (Art. 30)              | ✅           | Art. 4           |
| Breach notification (48h)                  | ✅           | Art. 9           |

### 4.3 DORA Applicability

DORA (EU 2022/2554) applies when:

- Customer is a financial entity (bank, insurer, investment firm, payment institution)
- Services constitute ICT services to financial entities
- KYC/IDV sub-processors (Shufti) serve financial entity customers

DORA-specific provisions are in DPA Annex D, covering:

- Exit strategy and transition assistance (90 days)
- ICT incident notification
- Concentration risk disclosure
- Flow-down to sub-processors (Shufti)

## 5. Sub-Processor Governance

### 5.1 Authorized Sub-Processors (Current)

| Sub-processor              | HQ  | Data Location        | Category            | DPA Status                                  |
| -------------------------- | --- | -------------------- | ------------------- | ------------------------------------------- |
| Supabase Inc.              | USA | EU (Finland/Germany) | Core Infrastructure | Auto (ToS)                                  |
| Google Cloud (Google LLC)  | USA | EU (Finland)         | Core Infrastructure | Auto (ToS)                                  |
| Cloudflare Inc.            | USA | EU edge nodes        | Infrastructure      | Auto (ToS)                                  |
| Anthropic PBC              | USA | USA + SCC            | AI Services         | Auto (ToS)                                  |
| Groq Inc.                  | USA | USA + SCC            | AI Services         | Auto (ToS)                                  |
| Temporal Technologies Inc. | USA | EU                   | Core Infrastructure | Auto (ToS)                                  |
| Shufti Pro Limited         | UK  | EU only              | Identity (KYC/IDV)  | DPA reviewed + Addendum ready for signature |

### 5.2 Sub-Processor Onboarding Checklist

Before adding any sub-processor:

- [ ] EU data processing confirmed (or SCC + TIA for non-EU)
- [ ] DPA/DPA addendum obtained
- [ ] Sub-processor list reviewed (their own sub-processors)
- [ ] Data retention/deletion policy documented
- [ ] Security certifications verified (ISO 27001, SOC 2, or equivalent)
- [ ] 30-day advance notice to existing customers (Art. 7.4)
- [ ] Update `sub-processors.html` and DPA Annex A
- [ ] Update `DWS_SECURITY_STANDARD.md` vendor risk section
- [ ] Update `Admin/SECURITY_COMPLIANCE.md`

### 5.3 Shufti Pro — Key Facts

| Field               | Value                                                      |
| ------------------- | ---------------------------------------------------------- |
| Legal Name          | Shufti Pro Limited                                         |
| Registered Address  | Coppergate House, 10 Whites Row, London, England, E1 7NF   |
| Company Number      | 11039567 (Companies House, UK)                             |
| Status              | Active (private limited company, incorporated 31 Oct 2017) |
| SIC Codes           | 62012 (software development), 63110 (data processing)      |
| LEI                 | 984500AF891013CE9D42                                       |
| CEO                 | Victor Fredung (Swedish, co-founder, appointed Oct 2018)   |
| CFO / DPA Signatory | Stephen James Ullman (ACA ICAEW, appointed director)       |
| Contact             | compliance@shufti.com                                      |
| EU Entity           | **None found** — UK company, post-Brexit                   |
| Data Processing     | EU only (confirmed April 2026, addendum ready)             |
| Data Category       | Biometric (GDPR Art. 9 special category)                   |
| KYA Layer           | Layer 1 — Human Identity                                   |
| Funding             | $20M Series A (March 2022, led by Updata Partners)         |
| Valuation           | ~71.4M GBP                                                 |

**Companies House verification (2026-04-02):** Company filings current (accounts filed 31 Dec 2024, confirmation statement 22 Dec 2025). Persons with significant control: Shahid UK Holdings Limited (25-50%) and Grundbulten 106742 Ab (Swedish). Stephen Ullman verified as legitimate director with ICAEW chartered accountant qualification and prior regulated payments experience (My EU Pay). Source: `2026-04-02-shufti-dpa-clause-audit-go-nogo.md`.

**Risk note:** Shufti is a UK company without a confirmed EU subsidiary. Post-Brexit, UK is a "third country" under GDPR. However, the UK has an adequacy decision from the European Commission (Decision 2021/1772, valid until June 2025, expected renewal). Verify adequacy status before DPA execution.

**Sub-processor risk (from DPA clause audit):**

- **TeleSign Corp (USA):** noyb filed GDPR complaint (June 2023) with Belgian DPA alleging secret profiling of mobile users. Case pending. TeleSign used for SMS/2FA delivery. Under EU-only mode, confirm TeleSign is either not used or routed EU-only.
- **Twilio/SendGrid (USA):** Multiple security incidents (2024-2025 — Authy leak, call records exposed, SendGrid records for sale). Handles OTP delivery and video recording (KYC). Under EU-only mode, Twilio video KYC must route EU-only.
- **Mitigation:** EU-only addendum (Clause 1) requires all processing within EEA. Programmers Force (Pakistan) removed. GCP locked to EEA regions.

## 6. Product-Specific Terms

### 6.1 DWS IQ 6 SaaS (Standard)

Covered by the main DPA and Service Agreement. Pricing per legal hub.

### 6.2 DWS IQ Aegis (Single-Tenant Sovereign)

Requires dedicated terms covering:

- Single-tenant deployment on customer-designated infrastructure
- Data sovereignty guarantees (EU-only, no CLOUD Act exposure)
- Custom SLA (higher than SaaS tier)
- Infrastructure ownership and responsibilities
- Decommissioning and data destruction procedures

**Status:** Stub at `docs/legal/AEGIS_PLATFORM_TERMS.md`. Needs Finnish lawyer review before publication.

### 6.3 Dual-Use Export Control

DWS IQ Aegis touches defence use cases. EU Dual-Use Regulation (EU 2021/821) applies. Export control notice required on legal hub before any government/defence buyer engagement.

**Status:** Stub at `docs/legal/DUAL_USE_EXPORT_NOTICE.md`.

## 7. KYA Partner Certification Program

### 7.1 Partner Tiers

| Tier                             | Fee                             | Partners                                   | Rights                                                           |
| -------------------------------- | ------------------------------- | ------------------------------------------ | ---------------------------------------------------------------- |
| **Tier 1 — Integration Partner** | EUR 2,500/year                  | Sub-processors (KYC, biometrics, identity) | Listed on dws10.com, KYA-certified badge, annual recertification |
| **Tier 2 — Strategic Partner**   | EUR 7,500/year                  | ERP vendors, cloud providers               | Co-marketing, joint case studies, priority integration support   |
| **Tier 3 — Enterprise Partner**  | EUR 15,000/year + revenue share | System integrators, defence primes         | Custom SLA, dedicated support, revenue share on sourced deals    |

### 7.2 Partner Agreement Scope

One-page framework under Finnish law, covering:

- Badge usage rights (KYA Certified Partner mark)
- Annual certification review and audit obligations
- Annual fee and payment terms
- Data processing obligations (flow-down from DPA)
- Termination (30 days notice, badge removal within 7 days)
- Liability caps proportional to annual fee

**Status:** Stub at `docs/legal/KYA_PARTNER_AGREEMENT.md`.

### 7.3 Shufti as First Partner

Shufti Pro fits **Tier 1 — Integration Partner** (EUR 2,500/year). They are a sub-processor providing KYC/IDV for KYA Layer 1. This establishes the precedent for every KYC/KYB vendor onboarded after them.

## 8. Certification Roadmap (Canonical)

**These are the authoritative timelines. All documents must reference these values.**

| Certification     | Target      | Auditor                  | Status                                                                     |
| ----------------- | ----------- | ------------------------ | -------------------------------------------------------------------------- |
| **PiTuKri**       | Completed   | Internal + TÜV Rheinland | ✅ Audited (v1.1 — transitioning to national criteria library autumn 2026) |
| **ISO 27001**     | **Q3 2026** | TÜV Rheinland            | Gap assessment Q1 2026                                                     |
| **SOC 2 Type II** | **Q4 2026** | Deloitte/EY              | Roadmap                                                                    |
| **IEC 62443**     | Q1 2027     | TBD                      | Planned (IoT/Fleet)                                                        |

**Known outliers to fix:**

- `docs/field-notes/2026-03-16-pentesting-plan-dws6.md` says ISO 27001 Q4 2026, SOC 2 Q2 2027 — **wrong**
- `Admin/Security/SECURITY_IMPLEMENTATION_COMPLETE.txt` says both Q2 2026 — **wrong**

## 9. Open Issues

| #   | Issue                                                                        | Action Required                                                                                                                                                             | Owner  |
| --- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | DPO listed as "Risto Rautakorpi" in `/legal/` and `DWS_SECURITY_STANDARD.md` | Confirm correct name — is this Risto Päärni or different person?                                                                                                            | Risto  |
| 2   | UK adequacy decision for Shufti                                              | Verify EU adequacy decision for UK still valid (original: June 2025). EU-only addendum mitigates transfer risk regardless.                                                  | Legal  |
| 3   | Aegis ToS not drafted                                                        | Needs Finnish lawyer review                                                                                                                                                 | Legal  |
| 4   | KYA Partner Agreement not drafted                                            | Draft and review                                                                                                                                                            | Legal  |
| 5   | Dual-use export notice not published                                         | Draft, legal review, publish to legal hub                                                                                                                                   | Legal  |
| 6   | ~~Shufti DPA not received~~                                                  | ✅ RESOLVED — DPA received, clause-by-clause audit completed (2026-04-02), addendum drafted (`partners-outreach/Shufti/DPA_ADDENDUM_EU_ONLY_2026.md`). Ready for signature. | Risto  |
| 8   | TeleSign noyb complaint (Shufti sub-processor)                               | Confirm TeleSign data flows under EU-only mode; assess Belgian DPA ruling impact                                                                                            | Legal  |
| 9   | ML training prohibition clause                                               | Explicit prohibition clause needed in addendum (PR #768 audit finding A) — currently only acknowledged as trade-off, not binding clause                                     | Legal  |
| 10  | Art. 9 legal basis for biometric processing                                  | Add GDPR Art. 9(2) legal basis reference in Shufti DPA Annex I Section 4                                                                                                    | Legal  |
| 7   | Cert timeline outliers                                                       | Fix 2 files with wrong ISO/SOC dates                                                                                                                                        | Claude |

## 10. GDPR.eu DPA Template Cross-Reference

Verification of our DPA against the standard GDPR.eu DPA template:

| GDPR.eu Template Section              | Our DPA                | Status |
| ------------------------------------- | ---------------------- | ------ |
| Preamble / Recitals                   | Opening paragraphs     | ✅     |
| Definitions                           | Article 1              | ✅     |
| Processing of Personal Data           | Article 2              | ✅     |
| Rights/obligations of Controller      | Article 5              | ✅     |
| Confidentiality                       | Article 2.4, Article 6 | ✅     |
| Security of processing                | Article 8, Annex B     | ✅     |
| Use of sub-processors                 | Article 7, Annex A     | ✅     |
| Transfer to third countries           | Article 11, Annex C    | ✅     |
| Assistance to Controller              | Article 3, Article 10  | ✅     |
| Breach notification                   | Article 9              | ✅     |
| DPIA assistance                       | Article 3.1.5          | ✅     |
| Deletion/return of data               | Article 13             | ✅     |
| Audit rights                          | Article 12             | ✅     |
| DPO appointment                       | Article 15             | ✅     |
| Appendix A: Processing info           | Article 2.5            | ✅     |
| Appendix B: Sub-processors            | Annex A                | ✅     |
| Appendix C: Processing instructions   | Article 3              | ✅     |
| **AI Processing (DWS addition)**      | Article 2.6            | ✅     |
| **DORA (DWS addition)**               | Annex D                | ✅     |
| **SCC Implementation (DWS addition)** | Annex C                | ✅     |
| **TIA Template (DWS addition)**       | Annex C.3              | ✅     |

**Result: Full GDPR.eu template coverage confirmed.** Our DPA exceeds the template with AI Processing, DORA, SCC, and TIA provisions.

## 11. AEB Trust Center Reference

Best-practice trust center structure (based on AEB and enterprise SaaS standards):

| Page                      | Content                                      | Our Equivalent                                           |
| ------------------------- | -------------------------------------------- | -------------------------------------------------------- |
| Trust Center landing      | Overview, certifications, badges             | `/legal/` (Sections 0, 10 + `/compliance/trust-center/`) |
| Data Protection / Privacy | DPA, privacy policy, sub-processors          | `/legal/dpa.html`, `/legal/sub-processors.html`          |
| Security                  | SOC 2 report, pen test summary, architecture | `/legal/` Section 10                                     |
| Compliance                | Regulatory mapping, certifications           | `/legal/` Sections 7-9                                   |
| Sub-processors            | Dedicated sub-processor list with change log | `/legal/sub-processors.html` ✅                          |
| DPA download              | Downloadable/printable DPA                   | `/legal/dpa-print.html` ✅                               |

**Status (April 2026):** The previously-split `/legal/` and `/legal-hub/` roots were consolidated into a single `/legal/` hub. Board governance, D&O safe-harbor, evidence-layer and EU-regulated-industries content now live as dedicated sections inside `/legal/index.html`. Legacy `/legal-hub/*` URLs resolve to redirect stubs with canonical pointing at the new `/legal/*` path.

---

_This standard is maintained in the repository and must be updated whenever legal documents, sub-processors, or certification timelines change._

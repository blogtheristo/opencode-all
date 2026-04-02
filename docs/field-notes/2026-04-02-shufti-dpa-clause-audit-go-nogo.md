# Shufti DPA Clause-by-Clause Audit — Go/No-Go Assessment

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-02
Author: Claude Code (claude/review-shufti-dpa-dugAv)
Owner: Lifetime Oy
Status: CONDITIONAL GO — with required amendments
---

## Context

Shufti Pro shared their standard DPA (v1.0, adopted 2024-12-17). This is a clause-by-clause legal audit against DWS requirements. The DPA is a generic template — Lifetime Oy details are blank. Signed by Stephen Ullman (Director) for Shufti Pro.

**Document reviewed:** Shufti Pro Standard DPA v1.0 (12 pages, 6 clauses + 2 annexes)

## Executive Summary

**Verdict: CONDITIONAL GO** — The DPA is structurally sound and GDPR-compliant in its framework, but has 4 critical gaps and 3 moderate issues that must be resolved before signature. No showstoppers that would require switching vendors.

## 10-Point Clause Audit

### 1. EU-Only Processing — FAIL (CRITICAL)

**Requirement:** EU-only processing explicitly stated in DPA body
**DPA says:** Nothing. The DPA is jurisdiction-agnostic. Clause 5 allows transfers outside EEA with "appropriate safeguards" (SCCs, BCRs, adequacy decisions).
**Email says:** "Yes, EU only processing and storage can be enabled for your account" (compliance@shufti.com, 2026-03-31)
**Gap:** Email confirmation has zero legal weight. The DPA must contain a binding EU-only clause.

**Required amendment:**
> "The Provider shall process all Personal Data exclusively within the European Economic Area (EEA). No Personal Data shall be transferred to, stored in, or accessed from any jurisdiction outside the EEA, including for backup, disaster recovery, or support purposes. This obligation supersedes Clause 5 of this DPA."

### 2. Sub-Processor List — PARTIAL PASS (CRITICAL)

**Requirement:** Full list with data locations, all EU/EEA
**DPA says:** Annex II provides 9 sub-processors with jurisdictions and transfer mechanisms.
**Problem:** 4 of 9 sub-processors are US-based:

| Sub-processor | Jurisdiction | Transfer Mechanism | Risk |
|---------------|-------------|-------------------|------|
| Cloudflare Inc. | USA | Data Privacy Framework (DPF) | MEDIUM — DPF valid but fragile (Schrems III risk) |
| Idera/IPStack | USA | DPF | MEDIUM — IP geolocation, not biometric |
| TeleSign Corp | USA | DPF | HIGH — SMS/2FA delivery, PII exposed |
| Twilio/SendGrid | USA | DPF | HIGH — OTP, video recording (KYC!), email |

**Critical concern:** Twilio handles "video recording (KYC)" — this means biometric data (facial video) may transit US servers. This directly contradicts EU-only processing.

**Required amendment:**
- Confirm that with EU-only enabled, Twilio/TeleSign/Cloudflare/IPStack are either (a) not used, or (b) use EU-only endpoints
- If Twilio video KYC cannot be EU-only, this is a **deal-breaker**
- Request updated Annex II reflecting EU-only sub-processor configuration

### 3. Biometric Data Handling — PARTIAL PASS

**Requirement:** GDPR Art. 9 special category — explicit legal basis
**DPA says:** Annex I Section 4 acknowledges biometric data (facial recognition) and sensitive data (religion, gender, blood group via Advanced Extraction). Clause 3.3 has enhanced security for Special Categories.
**Gap:** No explicit Art. 9(2) legal basis stated. The DPA should reference that processing is based on Art. 9(2)(a) explicit consent or Art. 9(2)(g) substantial public interest.

**Required amendment:** Add Art. 9 legal basis reference in Annex I Section 4.

### 4. Data Retention/Deletion — PARTIAL PASS

**Requirement:** Auto-delete post-verification, timeline stated
**DPA says:** Clause 2.9 — 30 days post-termination to return/delete, written certification. "Unless the law requires storage."
**Gap:** No post-verification deletion timeline. When a single KYC check completes, how long is data retained? 30 days post-termination is contract-end, not per-verification.

**Required clarification:**
- What is the retention period per individual verification?
- Can it be set to 0 days (immediate delete after result delivery)?
- Does "Advanced Extraction" data follow the same retention policy?

### 5. Breach Notification — PASS

**Requirement:** Timeline <= 48 hours
**DPA says:** Clause 2.4 — 48 hours, includes nature of breach, categories affected, likely consequences, measures taken.
**Assessment:** Aligns with DWS standard. Notification email address is blank — must fill in `risto.paarni@lifetime.fi`.

### 6. Audit Rights — PASS

**Requirement:** Right to audit or request evidence of EU processing
**DPA says:** Clause 6.6 — Client may inspect via audits, risk assessments, ad hoc inspections, or information requests. Reasonable advance notice, business hours.
**Note:** Costs borne by Client. Standard practice. Acceptable.

### 7. Data Transfer Exceptions — FAIL (see #1)

**Requirement:** No carve-outs for non-EU transfer
**DPA says:** Clause 5 contains multiple transfer mechanisms (SCCs, BCRs, adequacy, certifications). No restriction to EU-only.
**Assessment:** Addressed by required amendment in #1.

### 8. Termination Deletion — PASS

**Requirement:** Verified deletion certificate upon contract end
**DPA says:** Clause 2.9 — Return and/or delete within 30 days. Written certification of compliance.
**Assessment:** Acceptable. 30-day window is standard.

### 9. Sub-Processor Change Notification — PARTIAL PASS

**Requirement:** Prior notice of sub-processor changes (>= 30 days)
**DPA says:** Clause 4.4 — 14 days to object.
**Gap:** 14 days is short. Industry standard is 30 days. With US sub-processors, a change could introduce new CLOUD Act exposure.

**Required amendment:** Extend objection period from 14 to 30 days.

### 10. Liability and Indemnity — NEUTRAL

**Requirement:** Proportional, not capped at zero
**DPA says:** Clause 6.4 mentions injunctive relief. No liability cap or indemnity clause in the DPA itself.
**Assessment:** Liability likely governed by the main Services Agreement. Must verify the main agreement's liability terms before signing.

## Stephen Ullman Director Audit — VERIFIED

**DPA signatory:** Stephen Ullman, Director, Shufti Pro Limited

**Companies House verification (2026-04-02):**
- **Company Number:** 11039567
- **Status:** Active (private limited company)
- **Incorporated:** 31 October 2017
- **Registered Office:** Coppergate House, 10 Whites Row, London, E1 7NF — matches DPA
- **SIC Codes:** 62012 (software development), 63110 (data processing/hosting)
- **Last accounts filed:** 31 December 2024 — current
- **Last confirmation statement:** 22 December 2025 — current
- **LEI:** 984500AF891013CE9D42
- **Funding:** $20M Series A (March 2022), led by Updata Partners
- **Valuation:** ~71.4M GBP

**Stephen James Ullman — CONFIRMED as director:**
- **Role:** CFO and Board Director
- **Qualifications:** ACA (ICAEW), BA Accounting & Finance (University of Essex)
- **Prior role:** CFO & COO at My EU Pay (regulated payments institution, ~4.75 years)
- **Sources:** Companies House officers list, Dun & Bradstreet, The Org, RocketReach

**Other current directors:**
- Victor Fredung (Swedish, DOB May 1991, appointed Oct 2018) — co-founder/CEO
- Braden Snyder (American, DOB Sep 1961, appointed Nov 2023) — Updata Partners board seat

**Persons with Significant Control (2 active):**
- Shahid UK Holdings Limited (UK reg. 13849223) — 25-50% shares
- Grundbulten 106742 Ab (Swedish reg. 559356-9519)

**Assessment:** Stephen Ullman is a legitimate, verified director with appropriate qualifications (ICAEW-chartered accountant, regulated payments background). Company filings are current. No red flags on the signatory. The DPA spelling "Ullman" is correct.

**Source:** https://find-and-update.company-information.service.gov.uk/company/11039567

## Additional Issues Found

### A. Missing AI/ML Training Clause

The DPA does not prohibit Shufti from using Lifetime Oy's customer biometric data to train ML models. This is a critical omission for a KYC provider that uses AI.

**Required amendment:**
> "The Provider shall not use any Personal Data, including biometric data and document images, processed on behalf of the Client for the purposes of training, fine-tuning, or improving machine learning models, artificial intelligence systems, or any automated decision-making systems."

### B. DPA Date Anomaly

The DPA template says "entered into on _____ day of February, 2026" but it's now April 2026. Minor — update to current date when signing.

### C. TeleSign Sub-Processor — HIGH RISK (noyb Complaint)

**Critical finding from research:** noyb filed a GDPR complaint (June 2023) with the Belgian DPA alleging TeleSign secretly profiles half the world's mobile phone users via data from BICS (Belgian interconnection provider). TeleSign assigns "trust scores" (0-300) to phone numbers and sells these to TikTok, Microsoft, Salesforce. Potential fine: up to 236M EUR. Case still pending as of April 2026.

**Impact on DPA:** TeleSign is listed in Annex II for "SMS delivery and two-factor authentication". If Shufti's use of TeleSign involves the contested trust-scoring functionality, Lifetime Oy inherits regulatory exposure.

**Required action:** Ask Shufti on call with Haris:
1. What data flows to TeleSign — is it only SMS delivery or also trust scoring?
2. Can TeleSign be replaced with an EU-based SMS provider?
3. If Belgian DPA rules against TeleSign, what is Shufti's contingency plan?

### D. Twilio/SendGrid — MODERATE RISK (Repeated Incidents)

Research found multiple security incidents:
- July 2024: ShinyHunters leaked 33M Authy phone numbers via unauthenticated API
- September 2024: 12,000 call records exposed
- April 2025: 848,000 SendGrid customer records allegedly for sale
- Class action investigation underway re Authy leak

**Impact:** Twilio handles "OTP delivery, video recording (KYC)" per Annex II. The video recording function means biometric data transits Twilio infrastructure.

### E. IPStack Transfer Mechanism — Outdated

IPStack privacy policy still references EU-US Privacy Shield, invalidated July 2020 (Schrems II). Transfer mechanism may be non-compliant. Low severity (IP geolocation only, not biometric).

### F. Missing Notification Email

Clause 2.4 breach notification email is blank: "___________________". Must be filled with `risto.paarni@lifetime.fi`.

### D. Data Processing Schedule Reference

Clauses reference "Data Processing Schedule of the Agreement" for nature, purpose, and categories of data — but this schedule is not attached. Must request it or confirm it's in the main Services Agreement.

## Go/No-Go Decision Matrix

| # | Issue | Severity | Blocks Signature? | Resolution |
|---|-------|----------|-------------------|------------|
| 1 | No EU-only clause | CRITICAL | YES | Add EU-only processing addendum |
| 2 | US sub-processors (Twilio video!) | CRITICAL | YES | Confirm EU-only config disables US routing |
| 3 | TeleSign noyb/Belgian DPA complaint | CRITICAL | YES | Clarify data flows, contingency plan |
| 4 | No ML training prohibition | CRITICAL | YES | Add ML training prohibition clause |
| 5 | No Art. 9 legal basis | MODERATE | NO (but recommended) | Add reference in Annex I |
| 6 | No per-verification retention | MODERATE | Negotiable | Clarify retention policy |
| 7 | 14-day objection period | MODERATE | NO (but recommended) | Negotiate to 30 days |
| 8 | Twilio repeated security incidents | MODERATE | Negotiable | Assess Shufti's incident response posture |
| 9 | IPStack outdated transfer mechanism | LOW | NO | Confirm DPF replaces Privacy Shield |
| 10 | Missing Data Processing Schedule | MODERATE | YES | Request from Shufti |
| 11 | Stephen Ullman verification | ~~CRITICAL~~ | RESOLVED | Verified via Companies House — ICAEW ACA, legitimate |

**VERDICT: CONDITIONAL GO**

The DPA framework is competent and GDPR-aligned. The 4 blocking items (EU-only clause, US sub-processor routing, ML training prohibition, Ullman verification) are all resolvable through negotiation. None require switching vendors.

## Recommended Next Steps

1. **Risto (immediate):** Verify Stephen Ullman on Companies House — search "Shufti Pro Limited"
2. **Risto (call with Haris):** Present the 4 blocking amendments:
   - EU-only processing addendum (non-negotiable)
   - Confirmation that Twilio video KYC routes EU-only when enabled
   - ML training prohibition clause
   - Request Data Processing Schedule
3. **Risto (negotiate):** Push for 30-day sub-processor change notification (nice-to-have)
4. **After amendments agreed:** Fill in Lifetime Oy details, update date, add notification email
5. **Sign via DocuSign:** Use existing template flow (`scripts/verify-nda-signatures.ts`)
6. **Post-signature:** Update DWS sub-processor list, Security Compliance, Aegis materials

## Comparison: Shufti DPA vs DWS Requirements

| DWS Requirement | Shufti DPA | Gap? |
|-----------------|-----------|------|
| 48h breach notification | 48h (Clause 2.4) | NO |
| Audit rights | Yes (Clause 6.6) | NO |
| Termination deletion | 30 days + cert (Clause 2.9) | NO |
| EU-only processing | Not stated | YES |
| Sub-processor transparency | Annex II (9 listed) | PARTIAL |
| ML training prohibition | Not stated | YES |
| Data minimization | Clause 2.11 | NO |
| DSAR assistance | Clause 2.12 | NO |
| Encryption standards | AES-256 rest, TLS 1.2 transit | NO |
| Incident response plan | Clause 3.5 | NO |

## Relation to Prior Field Notes

- `2026-04-01-shufti-dpa-review-aegis-sovereignty.md` — DPA review checklist (now completed)
- `2026-04-01-shufti-dpa-haris-escalation.md` — Escalation to Shufti Legal
- `2026-03-17-shufti-eu-compliance-dpa-inquiry.md` — Original DPA inquiry
- `2026-03-09-shufti-kya-byo-partner-access.md` — Partnership proposal
- `2026-03-09-shufti-kya-technical-requirements.md` — Technical requirements

## Ontology Tags

- **Geography:** Europe > Finland (Lifetime Oy), UK (Shufti Pro HQ), USA (sub-processors)
- **Sector:** Technology > Identity Verification > GDPR Compliance > Biometrics
- **Entities:** Shufti Pro, Lifetime Oy, Stephen Ullman, DWS IQ 6, KYA Framework
- **Regulation:** GDPR Art. 9 (biometrics), Art. 28 (DPA), Art. 44-49 (transfers), EU AI Act
- **Temporal Context:** 2026-Q2, DPA Audit Phase
- **Confidence:** High (full DPA text reviewed)

---

**Source:** Shufti Pro DPA v1.0 (adopted 2024-12-17), email chain Haris/Shufti compliance (2026-03-31), prior field notes

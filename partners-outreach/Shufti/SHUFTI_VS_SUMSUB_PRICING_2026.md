# Shufti vs. Sumsub — IDV/KYC Pricing Comparison 2026

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-08
Author: Claude Code (claude/shufti-sumsub-pricing-93JeN)
Owner: Lifetime Oy
Status: Decision Support Document

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/shufti-sumsub-pricing-93JeN | Date: 08.04.2026 | Changes: Initial pricing comparison with volume calculations and DWS use case recommendation

---

## Context

Lifetime Oy evaluates two IDV/KYC providers for DWS IQ 6 KYA (Know Your Agent) Layer 1:

- **Shufti Pro** — existing partner, DPA signed (26.02.2026), EU-only addendum ready for signature
- **Sumsub** — market alternative, no existing relationship

Use case: identity verification for DWS IQ platform users and BYO agent operators. Integration point: `src/integrations/idv/shufti.ts` (KYA Layer 1).

---

## 1. Pricing Models Side by Side

### Shufti Pro

| Tier         | Monthly Fee | Per Verification | Notes                             |
| ------------ | ----------- | ---------------- | --------------------------------- |
| Free Forever | $0          | $0 (max 10/mo)   | Testing/pilot only                |
| Essentials   | $0          | $1.00            | No monthly minimum, pay-per-check |
| Enterprise   | Custom      | Custom           | Volume discounts, custom SLA      |

**Source:** Shufti Pro public pricing page (2026)

### Sumsub

| Tier       | Monthly Fee     | Per Verification | Notes                      |
| ---------- | --------------- | ---------------- | -------------------------- |
| Basic      | $149/mo minimum | $1.35            | Identity verification only |
| Compliance | $299/mo minimum | $1.85            | Includes AML screening     |
| Enterprise | Custom          | Custom           | Volume discounts           |

**Source:** Sumsub public pricing (2026). Additional charges: AML hits, SMS notifications, ongoing monitoring.

---

## 2. Volume Cost Calculations

### Scenario A: 5,000 verifications / year (~417/mo)

| Provider              | Per-check cost | Monthly minimum    | Annual total | Notes                                  |
| --------------------- | -------------- | ------------------ | ------------ | -------------------------------------- |
| **Shufti Essentials** | $1.00 x 5,000  | $0                 | **$5,000**   | No minimum                             |
| **Sumsub Basic**      | $1.35 x 5,000  | $149 x 12 = $1,788 | **$6,750**   | Min already exceeded at ~111 checks/mo |
| **Sumsub Compliance** | $1.85 x 5,000  | $299 x 12 = $3,588 | **$9,250**   | Includes AML                           |

**Shufti savings vs Sumsub Basic: $1,750/year (26%)**
**Shufti savings vs Sumsub Compliance: $4,250/year (46%)**

### Scenario B: 20,000 verifications / year (~1,667/mo)

| Provider              | Per-check cost | Monthly minimum | Annual total | Notes |
| --------------------- | -------------- | --------------- | ------------ | ----- |
| **Shufti Essentials** | $1.00 x 20,000 | $0              | **$20,000**  |       |
| **Sumsub Basic**      | $1.35 x 20,000 | included        | **$27,000**  |       |
| **Sumsub Compliance** | $1.85 x 20,000 | included        | **$37,000**  |       |

**Shufti savings vs Sumsub Basic: $7,000/year (26%)**
**Shufti savings vs Sumsub Compliance: $17,000/year (46%)**

### Scenario C: 100,000 verifications / year (~8,333/mo)

| Provider              | Per-check cost  | Monthly minimum | Annual total | Notes                                    |
| --------------------- | --------------- | --------------- | ------------ | ---------------------------------------- |
| **Shufti Essentials** | $1.00 x 100,000 | $0              | **$100,000** | Likely qualifies for Enterprise discount |
| **Sumsub Basic**      | $1.35 x 100,000 | included        | **$135,000** | Likely qualifies for Enterprise discount |
| **Sumsub Compliance** | $1.85 x 100,000 | included        | **$185,000** |                                          |

**Shufti savings vs Sumsub Basic: $35,000/year (26%)**

> **Note:** At 100k+ volume, both vendors offer Enterprise pricing with volume discounts. Actual savings depend on negotiated rates. Shufti's existing relationship and signed DPA give Lifetime Oy negotiating leverage.

### DWS Credit Program Model

For DWS IQ customers using KYA verification, a credit-based model:

| DWS Credit Pack     | Verifications | DWS Price (markup)  | Shufti Cost | Gross Margin       |
| ------------------- | ------------- | ------------------- | ----------- | ------------------ |
| Starter (10)        | 10            | $0 (free tier)      | $0          | —                  |
| Basic (100)         | 100           | $200 ($2.00/ea)     | $100        | **$100 (50%)**     |
| Pro (1,000)         | 1,000         | $1,500 ($1.50/ea)   | $1,000      | **$500 (33%)**     |
| Enterprise (10,000) | 10,000        | $12,000 ($1.20/ea)  | $10,000     | **$2,000 (17%)**   |
| Scale (100,000)     | 100,000       | $110,000 ($1.10/ea) | ~$80,000\*  | **~$30,000 (27%)** |

\*Enterprise-negotiated rate assumed at $0.80/check for 100k+ volume.

---

## 3. Hidden Cost Comparison

| Cost Factor                 | Shufti                     | Sumsub                                 |
| --------------------------- | -------------------------- | -------------------------------------- |
| Base per-check              | $1.00                      | $1.35–$1.85                            |
| Monthly minimum             | None                       | $149–$299                              |
| AML screening               | Depends on package         | Extra on Basic, included on Compliance |
| SMS notifications           | Not separately billed      | Extra charge                           |
| Ongoing monitoring          | Included in some tiers     | Extra charge                           |
| Failed verification billing | Check with contract        | Only successful verifications billed   |
| DPA/legal cost              | $0 (already signed)        | Legal review + negotiation needed      |
| Integration cost            | $0 (architecture designed) | New integration required               |
| EU-only mode                | Confirmed, addendum ready  | Unknown — must negotiate               |

---

## 4. DWS Use Case Recommendation

### Why Shufti is the right choice for DWS IQ 6

| Factor                          | Shufti Advantage                                         | Weight   |
| ------------------------------- | -------------------------------------------------------- | -------- |
| **Existing DPA**                | Signed 26.02.2026, EU-only addendum ready                | CRITICAL |
| **EU sovereignty**              | EU-only processing confirmed, GCP EEA-locked             | CRITICAL |
| **No monthly minimum**          | Matches SaaS variable volume                             | HIGH     |
| **KYA architecture**            | Integration designed in `src/integrations/idv/shufti.ts` | HIGH     |
| **Programmers Force removed**   | Non-EU sub-processor eliminated                          | HIGH     |
| **Cost**                        | 26–46% cheaper than Sumsub                               | MEDIUM   |
| **Relationship**                | Active partnership (Aitsam, Haris)                       | MEDIUM   |
| **30-day sub-processor notice** | Contractually agreed                                     | MEDIUM   |

### When Sumsub would make sense (not our case)

- Heavily regulated financial services (banking, crypto exchanges)
- Need built-in regulator reporting templates
- Monthly minimum is acceptable (high-volume, predictable traffic)
- No existing vendor relationship

### Decision Matrix

| Criterion             | Shufti Score | Sumsub Score     |
| --------------------- | ------------ | ---------------- |
| Cost efficiency       | 9/10         | 6/10             |
| EU sovereignty        | 10/10        | 5/10 (unknown)   |
| Legal readiness       | 10/10        | 2/10 (no DPA)    |
| Integration readiness | 9/10         | 2/10 (new build) |
| AML depth             | 7/10         | 9/10             |
| Regulatory reporting  | 6/10         | 8/10             |
| Variable volume fit   | 10/10        | 5/10             |
| **Total**             | **61/70**    | **37/70**        |

---

## 5. Recommendation

**PROCEED WITH SHUFTI PRO.**

Rationale:

1. **26–46% cost savings** across all volume scenarios
2. **Zero switching cost** — DPA signed, EU addendum ready, integration architecture designed
3. **No monthly minimum** — critical for SaaS with variable verification volume
4. **EU sovereignty confirmed** — non-EU sub-processors removed, GCP EEA-locked
5. **KYA Layer 1 ready** — Shufti webhook integration already designed for real-time risk scoring

Sumsub would cost $1,750–$35,000 more per year depending on volume, plus require new DPA negotiation (~4–8 weeks), new integration build (~2–4 weeks), and uncertain EU-only capability.

### Next Steps

1. Sign Shufti DPA EU-only addendum (`partners-outreach/Shufti/DPA_ADDENDUM_EU_ONLY_2026.md`)
2. Negotiate Enterprise rate for 10k+ volume ($0.80–$0.90/check target)
3. Implement DWS Credit Program pricing in `dws10.com/config/products.json`
4. Build Shufti integration in `src/integrations/idv/shufti.ts`

---

## References

- Shufti DPA: `partners-outreach/Shufti/Shufti Data Processing Agreement 26022026.docx`
- EU Addendum: `partners-outreach/Shufti/DPA_ADDENDUM_EU_ONLY_2026.md`
- DPA Clause Audit: `docs/field-notes/2026-04-02-shufti-dpa-clause-audit-go-nogo.md`
- Compliance Resolution: `docs/field-notes/2026-04-05-shufti-dpa-compliance-resolution.md`
- KYA Framework: `docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md`
- KYA Technical Reqs: `docs/field-notes/2026-03-09-shufti-kya-technical-requirements.md`

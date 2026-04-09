# Shufti vs. Sumsub — IDV/KYC Pricing Comparison 2026

VERSION AND AGENT HISTORY
Version: 1.1
Date: 2026-04-08
Author: Claude Code (claude/shufti-sumsub-pricing-93JeN)
Owner: Lifetime Oy
Status: Decision Support Document

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/shufti-sumsub-pricing-93JeN | Date: 08.04.2026 | Changes: Initial pricing comparison with volume calculations and DWS use case recommendation
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/shufti-eudi-integration-xmJ7L | Date: 08.04.2026 | Changes: Deep due diligence on iDenfy (infra NOT confirmed, red flag on EU data transfers) and Sproof (CONFIRMED EU-sovereign: OVHcloud, CLOUD Act immune, EUDI ready). Updated market scan verdicts.

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

| Criterion             | Shufti Score                     | Sumsub Score     |
| --------------------- | -------------------------------- | ---------------- |
| Cost efficiency       | 9/10                             | 6/10             |
| EU sovereignty        | 6/10 (CLOUD Act — see Section 6) | 5/10 (unknown)   |
| Legal readiness       | 10/10                            | 2/10 (no DPA)    |
| Integration readiness | 9/10                             | 2/10 (new build) |
| AML depth             | 7/10                             | 9/10             |
| Regulatory reporting  | 6/10                             | 8/10             |
| Variable volume fit   | 10/10                            | 5/10             |
| **Total**             | **57/70**                        | **37/70**        |

---

## 5. Recommendation

**REJECTED. NEITHER SHUFTI NOR SUMSUB MEETS THE AEGIS SOVEREIGNTY STANDARD.**

Aegis does not accept "almost sovereign" solutions. A vendor running on US-jurisdicted cloud infrastructure (GCP, AWS, Azure) is not EU-sovereign — regardless of DPA clauses, EU-only mode toggles, or compliance team assurances. This is a hard no.

### Why Both Fail

| Vendor     | Company jurisdiction | Cloud infra       | CLOUD Act exposed | Aegis verdict |
| ---------- | -------------------- | ----------------- | ----------------- | ------------- |
| Shufti Pro | UK                   | Google Cloud (US) | YES               | **REJECTED**  |
| Sumsub     | UK                   | AWS/GCP (US)      | YES               | **REJECTED**  |

"Almost sovereign" is not sovereign. A DPA clause cannot override US federal law. EU-only mode on US cloud is marketing, not compliance.

### What Aegis Requires

An IDV provider for Aegis production use MUST meet ALL of the following:

1. **EU-incorporated company** — not UK, not US, not any third country
2. **EU-sovereign cloud infrastructure** — OVHcloud, Hetzner, Scaleway, or self-hosted in EU — no US parent company
3. **Zero CLOUD Act exposure** — no US entity anywhere in the data processing chain
4. **GDPR Art. 28 compliant DPA** — with real substance behind the clauses, not just paper
5. **Biometric data (Art. 9) processing exclusively under EU jurisdiction** — no exceptions

### Aegis Competitive Position

This is the Aegis selling point: **we reject what others accept.** Every competitor using Shufti, Sumsub, Onfido, or Jumio on US cloud is exposed. They sign DPA addendums and call it sovereign. We don't.

EU regulation is a compounding moat (GDPR → Schrems II → AI Act → NIS2 → DORA). Every year the bar rises. Vendors who accepted "almost sovereign" today will be non-compliant tomorrow. Aegis is already on the right side of that line.

### Next Steps

1. **DO NOT integrate Shufti or Sumsub into Aegis production** — the DPA work is useful reference material but does not change the sovereignty verdict
2. **Scout EU-sovereign IDV providers** — EU company + EU cloud + zero CLOUD Act exposure. This is the #1 priority for KYA Layer 1.
3. **Evaluate build-vs-buy** — if no EU-sovereign IDV vendor exists at competitive quality, assess building KYA Layer 1 identity verification on DWS-controlled EU infrastructure
4. **Shufti DPA and pricing analysis retained** — useful for cost benchmarking and as negotiation reference when evaluating EU-sovereign alternatives

---

## 6. CLOUD Act Risk — Red Flag

### The Problem

Shufti Pro uses **Google Cloud Platform (GCP)** as infrastructure. Google (Alphabet Inc.) is a US corporation subject to the **CLOUD Act (18 U.S.C. § 2713)**, which compels US companies to produce data regardless of where it is physically stored.

| What Shufti promises           | What is actually true                                                 |
| ------------------------------ | --------------------------------------------------------------------- |
| EU-only processing and storage | Data physically in EEA — **juridically accessible by US authorities** |
| GCP locked to EEA regions      | GCP operator is a US company → CLOUD Act applies globally             |
| Programmers Force removed      | Good, but does not mitigate CLOUD Act exposure via GCP                |

### Legal Basis

- **CLOUD Act (2018):** US law enforcement can compel any US-headquartered provider to disclose data, even if stored outside the US
- **GDPR Article 48:** Third-country court orders are not a lawful basis for data transfer — direct conflict with CLOUD Act
- **Schrems II (C-311/18):** EU-US data transfers require supplementary measures beyond SCCs when US surveillance law applies

### Practical Assessment

**Shufti will give us the DPA clauses we ask for.** They have confirmed all 5 points. The standard DPA from Haris is a template — they can and will customize it.

**Shufti will not change their infrastructure.** Migrating off GCP for one customer is not commercially viable. This is a structural limitation, not a negotiation failure.

### Risk Rating

| Factor                         | Rating                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------- |
| Probability of US data request | LOW (Lifetime Oy is a Finnish SME, not a high-value target)                         |
| Impact if it happens           | HIGH (biometric data, identity documents — GDPR Art. 9 special category)            |
| Contractual mitigation         | MEDIUM (DPA addendum provides legal basis to challenge, but cannot override US law) |
| **Overall risk**               | **MEDIUM — accepted with documentation**                                            |

### Why DPA Clauses Do Not Mitigate This

Shufti confirmed all 5 DPA amendment points. They will sign whatever we ask. But:

- A DPA clause saying "EU-only" does not override 18 U.S.C. § 2713
- A sub-processor removal does not change the cloud operator's jurisdiction
- A 30-day notification period is irrelevant if a US court issues a gag order

**Paper compliance ≠ actual compliance.** Shufti's DPA is well-intentioned but structurally unenforceable against US law.

### EU Regulation as Structural Moat

EU data protection law is not just compliance — it is a **deliberate market barrier** designed to prevent non-EU actors like Shufti from operating freely in EU markets. And it works:

- **GDPR (2018):** Forced global vendors to localize or exit
- **Schrems II (2020):** Invalidated Privacy Shield. Every US-cloud-dependent vendor now operates in legal grey zone
- **EU AI Act (2024/2025):** Art. 10 + Art. 15 add new requirements for biometric AI
- **NIS2 (2024):** Critical infrastructure supply chain requirements hit IDV vendors
- **DORA (2025):** Financial sector ICT risk management — direct scrutiny of IDV providers

**Each new regulation raises the bar.** Shufti can customize DPA clauses, but they cannot change the structural reality: UK company, US cloud, non-EU jurisdiction. The gap between what they promise and what they can deliver grows every year.

### Conclusion

**Shufti and Sumsub are REJECTED for Aegis production use.**

Aegis does not accept "almost sovereign." This is not a risk to mitigate — it is a disqualifying condition. Our competitors accept these vendors and call it compliant. We don't. That is the Aegis selling point.

Find an EU-sovereign IDV provider or build one.

---

## 7. EU-Sovereign IDV Alternatives — Market Scan (2026-04-08)

### Boardy Recommendation (received 2026-04-08)

> "EU-sovereign IDV-providerit joita kannattaa katsoa: Veriff (Viro, EU-pilvi, ei CLOUD Act), iDenfy (Liettua, GDPR-native), Ondato (Liettua). Kaikki EU-yhtiöitä, EU-hosting, ei US-omistusta."

### Due Diligence on Boardy's Picks

| Vendor                 | Boardy claim             | Reality                                                                                                                                                                             | Verdict         |
| ---------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| **Veriff** (Estonia)   | "EU cloud, no CLOUD Act" | **Uses AWS** (Amazon SageMaker + Amazon Rekognition). Source: AWS case study. CLOUD Act exposed.                                                                                    | **REJECTED**    |
| **iDenfy** (Lithuania) | "GDPR-native"            | Lithuanian company (Kaunas), Lithuanian/Polish investors only ($1.1M), no US ownership. Hetzner partnership (Hetzner uses iDenfy for their own KYC). Cloud infra not yet confirmed. | **INVESTIGATE** |
| **Ondato** (Lithuania) | "Lithuania"              | Founded Lithuania but **HQ moved to London (UK)**. Globally distributed cloud, not confirmed EU-only.                                                                               | **REJECTED**    |

### Full Market Scan — All Major IDV Vendors

| Vendor          | Country         | Cloud infra                                               | US ownership/investment                                | CLOUD Act                 | Aegis verdict   |
| --------------- | --------------- | --------------------------------------------------------- | ------------------------------------------------------ | ------------------------- | --------------- |
| Shufti Pro      | UK              | GCP (US)                                                  | No                                                     | YES                       | REJECTED        |
| Sumsub          | UK              | AWS/GCP (US)                                              | No                                                     | YES                       | REJECTED        |
| Veriff          | Estonia         | AWS (US)                                                  | No                                                     | YES                       | REJECTED        |
| IDnow           | Germany         | Unknown                                                   | **96% Corsair Capital (New York)** — $295M acquisition | YES (US owner)            | REJECTED        |
| Ondato          | Lithuania/UK    | Global distributed                                        | No                                                     | Unclear (UK HQ)           | REJECTED        |
| Onfido          | UK              | AWS (US)                                                  | Acquired by Entrust (US)                               | YES                       | REJECTED        |
| Jumio           | US              | AWS (US)                                                  | US company                                             | YES                       | REJECTED        |
| **iDenfy**      | **Lithuania**   | **NOT DISCLOSED (red flag: DPA allows non-EU transfers)** | **No (LT/PL investors)**                               | **TBD — infra unknown**   | **CONDITIONAL** |
| **Sproof**      | **Austria**     | **OVHcloud (EU) — CONFIRMED**                             | **No (EU angels: Venionaire Capital)**                 | **NO — confirmed immune** | **CANDIDATE**   |
| **Digidentity** | **Netherlands** | **Unknown**                                               | **100% Solera Holdings / Vista Equity Partners (US)**  | **YES (US owner)**        | **REJECTED**    |

**Pattern:** Every major European IDV vendor has been acquired by US private equity. IDnow (Corsair), Digidentity (Solera/Vista), Onfido (Entrust). EU-sovereign IDV = unsolved market gap.

### Deep Due Diligence Results (2026-04-08)

**1. iDenfy (Kaunas, Lithuania) — CONDITIONAL (infra not confirmed)**

- UAB iDenfy, Baršausko street 59, 51423 Kaunas, Lithuania (EU)
- Founded 2017 by Gediminas Ratkevicius (CEO) and Domantas Ciulde
- $1.1M funding (Mar 2025), Lithuanian/Polish investors only (Kaunas Startup Awards, Startup Hub Poland) — no US ownership
- ISO 27001 (TÜV Thüringen, cert TIC 1512120135, since 03/2020), SOC 2 (House of CPA, annual), eIDAS Trust Service Provider
- 1,000+ business customers, KYC/KYB/AML, 99.8% accuracy rate
- Hetzner uses iDenfy for their KYC onboarding (customer, NOT infrastructure provider)
- Pricing: only charges for approved/completed verifications (rejected excluded)
- **RED FLAG:** Cloud infrastructure provider NOT publicly disclosed. iDenfy's Service Agreement states "data can be sent outside the European Union" with Standard Contractual Clauses. This language is consistent with US cloud usage (AWS/GCP).
- **VERDICT:** Cannot confirm EU-sovereign. Must request infrastructure disclosure and sub-processor list before proceeding. If infra is AWS/GCP → REJECTED (same as Veriff).

**2. Sproof (Salzburg/Vienna, Austria) — CONFIRMED EU-SOVEREIGN**

- Sproof GmbH, founded Autumn 2019, Salzburg and Vienna, Austria (EU)
- Founders: Dr. Clemens Brunner (CEO), Dr. Fabian Knirsch (CEO), Erich Höpoldseder — security PhDs with data protection expertise
- €3M+ funding (investment + grants), EU-only investors: Berthold Baurek-Karlic (Venionaire Capital / European Super Angels Club), Michael Repnik — no US ownership
- **Infrastructure: OVHcloud (EU) — CONFIRMED.** Sproof explicitly states: "100% developed in Europe and hosted on European servers." OVHcloud provides the infrastructure, confirmed CLOUD Act immune.
- **CLOUD Act position: EXPLICIT.** Sproof published a dedicated article on CLOUD Act risks, positioning their EU-only infrastructure as the solution. Not a footnote — a strategic differentiator.
- **EUDI Wallet: READY.** sproof Ident is a European identity aggregator, eID Hub supports all EU eIDs, designed for eIDAS 2.0 / EUDI Wallet integration.
- Products: sproof Sign, sproof Ident, sproof Fastlane, sproof Widget, sproof Validate, sproof eID Hub
- Certifications: eIDAS compliant, GDPR compliant, EU-hosted
- **VERDICT: Meets all 5 Aegis sovereignty requirements.** EU company, EU cloud (OVHcloud), zero CLOUD Act, GDPR Art. 28 ready, biometric processing in EU jurisdiction. Recommended as bridge IDV provider until EUDI Wallet goes live (12/2026).

**3. eIDAS 2.0 / EUDI Wallet + Digital Euro — THE ENDGAME (12/2026)**

The EU is building its own sovereign identity and payment infrastructure. This eliminates the need for third-party IDV vendors and reduces dependency on US payment networks.

| EU Infrastructure         | Timeline                                             | What it replaces                                                    |
| ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| **EUDI Wallet**           | 12/2026 live, ~12/2027 mandatory for relying parties | All third-party IDV vendors (Shufti, Veriff, Sumsub, Onfido, Jumio) |
| **Digital Euro (e-euro)** | Regulation ~2026, pilot H2/2027, issuance ~2029      | Visa/Mastercard dependency for EU payments                          |

**EUDI Wallet for KYA Layer 1 (ENACTED LAW — Regulation 2024/1183):**

- All 27 EU member states provide EUDI wallets by 12/2026 (24 months from implementing acts 12/2024)
- Regulated relying parties + VLOPs must accept ~12/2027 (12 months after wallet availability)
- Government-issued, cryptographically verifiable identity
- No third-party IDV vendor needed — the state IS the identity provider
- Zero CLOUD Act exposure — EU sovereign by definition
- Eliminates Shufti/Sumsub/Veriff dependency entirely

**Digital Euro for Aegis payments (ECB TARGET — conditional on regulation adoption):**

- ECB digital currency, EU-sovereign payment rail
- Regulation expected adopted 2026 (EP ECON vote 05.05.2026)
- 12-month pilot from H2/2027, first potential issuance ~2029
- Development budget: €1.3 billion committed (ECB closing report 10/2025)
- No Visa/Mastercard intermediary for EU-to-EU transactions
- Programmable money — compliance rules embedded in payment logic

**Together:** EUDI Wallet + Digital Euro = EU-sovereign identity + payment stack. No US vendor in the chain. This is what Aegis should build toward.

### Recommended Path (updated after due diligence)

```
NOW (Q2 2026):     Contact Sproof → request DPA, sub-processor list, pricing
                   Contact iDenfy → request infrastructure disclosure (cloud provider)
                   Build EUDI Wallet integration into KYA architecture
                   If iDenfy confirms US cloud → REJECT, Sproof becomes sole bridge candidate
Q3 2026:           Sproof Ident bridge integration (if needed before EUDI)
                   EUDI Wallet pilot integration (test with early member state wallets)
Q4 2026:           EUDI Wallet live (eIDAS 2.0 — enacted law, Regulation 2024/1183)
H2 2027:           EUDI Wallet mandatory for relying parties — sunset bridge IDV
H2 2027:           Digital Euro pilot begins (12 months, conditional on regulation adoption 2026)
2029:              Digital Euro first potential issuance (ECB target)
```

**Aegis strategic position:** Sproof is the only verified EU-sovereign IDV bridge candidate. iDenfy is conditionally viable pending infrastructure disclosure. But the endgame remains EUDI Wallet + Digital Euro — EU state infrastructure that makes the entire IDV vendor market irrelevant.

### Key Lessons

1. **Boardy's recommendation was partially wrong.** Veriff sounds EU-sovereign (Estonian company) but runs on AWS. This is exactly the "almost sovereign" trap.
2. **Infrastructure-level verification is mandatory.** iDenfy looked promising (Lithuanian company, no US ownership) but their DPA allows non-EU data transfers — the same red flag we caught with Shufti. Company registration tells you nothing; cloud provider tells you everything.
3. **Sproof is the exception that proves the rule.** They explicitly built their sovereignty position around OVHcloud and published a CLOUD Act analysis. This is not accidental — it is a strategic choice.
4. **The real answer is not finding a better vendor — it is building on EU government infrastructure.** EUDI Wallet (12/2026, law) eliminates the need for any third-party IDV vendor.

---

## 8. Investor Memo Language (v5.2)

Source: Boardy feedback (2026-04-08)

> "DWS IQ rakentuu EU:n valtion infrastruktuurin päälle, EUDI Wallet (12/2026) + digitaalinen euro (~2029). Identity + payment stack on EU-sovereign by design, ei kolmannen osapuolen varassa."

This single sentence communicates three things to investors:

1. **Burning platform** — US-cloud-dependent vendors (Shufti, Veriff, Stripe, Jumio) are structurally non-compliant with EU law. EU regulation progressively excludes them. Every competitor using these vendors is exposed.
2. **Moat** — EU state infrastructure (EUDI Wallet + Digital Euro) is a competitive advantage that US competitors cannot replicate. You cannot build EUDI integration from outside the EU regulatory framework.
3. **Timing** — 12/2026 EUDI Wallet (enacted law, Regulation 2024/1183) and ~2029 Digital Euro (ECB target, €1.3B committed). EUDI is law, not a proposal.

**For Investor Memo v5.2:** Use verbatim. This is the sovereignty thesis in one sentence.

---

## References

- Shufti DPA: `partners-outreach/Shufti/Shufti Data Processing Agreement 26022026.docx`
- EU Addendum: `partners-outreach/Shufti/DPA_ADDENDUM_EU_ONLY_2026.md`
- DPA Clause Audit: `docs/field-notes/2026-04-02-shufti-dpa-clause-audit-go-nogo.md`
- Compliance Resolution: `docs/field-notes/2026-04-05-shufti-dpa-compliance-resolution.md`
- KYA Framework: `docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md`
- KYA Technical Reqs: `docs/field-notes/2026-03-09-shufti-kya-technical-requirements.md`

### Due Diligence Sources (2026-04-08)

**iDenfy:**

- iDenfy Security & Compliance: https://www.idenfy.com/security/ (ISO 27001, SOC 2, eIDAS TSP)
- iDenfy Service Agreement: https://www.idenfy.com/agreement/ (DPA, non-EU transfer clause)
- iDenfy Privacy Policy: https://www.idenfy.com/privacy-policy/ (UAB iDenfy, Kaunas, Lithuania)
- Hetzner + iDenfy partnership: https://thepaypers.com/fraud-and-fincrime/news/hetzner-teams-up-with-idenfy-to-optimise-identity-verification-at-onboarding (Hetzner is CLIENT, not iDenfy infra provider)
- iDenfy Crunchbase: https://www.crunchbase.com/organization/idenfy ($1.1M, LT/PL investors)

**Sproof:**

- Sproof CLOUD Act analysis: https://www.sproof.com/en/what-is-the-us-cloud-act-the-underestimated-risk-to-european-company-data-and-digital-sovereignty/ (OVHcloud confirmed, CLOUD Act immune)
- Sproof EUDI Wallet / eIDAS 2.0: https://www.sproof.com/en/ready-for-eidas-2-0-why-your-company-needs-a-european-identity-aggregator
- Sproof Crunchbase: https://www.crunchbase.com/organization/sproof (€3M+, EU investors)
- Sproof European Alternatives: https://european-alternatives.eu/product/sproof
- Sproof Press: https://www.sproof.com/en/press/ (Dr. Brunner, Dr. Knirsch, Höpoldseder)

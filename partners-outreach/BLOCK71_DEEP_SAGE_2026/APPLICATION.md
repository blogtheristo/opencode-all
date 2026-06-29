# BLOCK71 Deep SAGE 2026 — DWS IQ Application Draft

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/block71-deep-sage-2026-xNiom | Date: 25.05.2026 | Changes: Initial draft — Deep SAGE 2026 application narrative based on Steve Leong's community outreach. Programme fit, Singapore/ASEAN angle, application answers, scaling plan, S$500K use of funds.

Session Links & References:
  - Programme page: https://block71.co/programmes/deep-sage-2026/
  - Community partner contact: Steve Leong (steveleonghw@nus.edu.sg)
  - Partner: TIS Inc. (Japan) + NUS Enterprise
  - Related: investor-outreach/EIC_STEP1_APPLICATION.md (sister application; reuse executive summary)
  - Related: investor-outreach/DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.md (positioning source)

Document Status:
  - Created: 25.05.2026
  - Last Modified: 25.05.2026
  - Language: English
  - Publication Status: DRAFT — not yet submitted
  - Classification: CONFIDENTIAL

***

## Application Metadata

| Field            | Value                                                   |
| ---------------- | ------------------------------------------------------- |
| Programme        | BLOCK71 Deep SAGE 2026                                  |
| Partners         | TIS Inc. (Japan) × NUS Enterprise × BLOCK71 Singapore   |
| Company          | Lifetime Oy                                             |
| Product          | DWS IQ — EU Industrial Compliance Infrastructure        |
| Y-tunnus         | 0772407-9                                               |
| VAT              | FI07724079                                              |
| HQ Country       | Finland (Espoo)                                         |
| Stage            | Seed / Pre-Series A (SAFE round live)                   |
| Sector match     | AI · Smart Cities (primary); Robotics (LWM edge HW)     |
| Funding ask      | Up to S$500,000 from TIS (open to staged tranche)       |
| Programme dates  | 12-week structured curriculum (cohort 2026)             |
| Application due  | **31 May 2026** (6 days from today)                     |
| Apply URL        | https://block71.co/programmes/deep-sage-2026/           |
| Primary contact  | Risto Anton Päärni, CEO (risto.paarni@lifetime.fi)      |

---

## Why Deep SAGE — Strategic Fit (Internal Note)

Three reasons this is worth the application effort, not just a polite share:

1. **Singapore = ASEAN CBAM gateway.** From 2026, every steel / cement / aluminium / fertiliser / electricity shipment from ASEAN into the EU needs a CBAM declaration with verified embedded-emissions data. Singapore is the regional HQ for the trading houses, MNCs, and Japanese SIs that route those exports. A Singapore foothold puts DWS IQ adjacent to ASEAN-side CBAM demand, not just the EU-side importer pain we already serve.

2. **TIS Inc. is the actual prize, not the S$500K.** TIS is a Tokyo-listed system integrator (~JPY 500B revenue) embedded in Japanese manufacturing and energy. Japanese manufacturers exporting to the EU are the textbook CBAM-affected buyer. The S$500K is bridge capital; TIS is enterprise distribution.

3. **Fractional C-suite is the right shape for SAFE-stage Lifetime Oy.** We cannot yet absorb a full-time CRO/CFO/COO. A senior 12-week engagement on go-to-market, pricing, and ASEAN expansion is the highest-leverage cost we can run pre-Series A.

Risk to flag honestly: Deep SAGE expects scaling traction, and our MRR is still €7K. We compensate with regulatory tailwind (forced purchases 2026–2030), 6 paying customers at 100% retention, NVIDIA Connect ISV status, and a non-replicable carbon-ledger architecture.

---

## 1. One-Liner

DWS IQ is the **compliance ledger for European industrial payments** — double-entry bookkeeping for CBAM, CSRD, and ETS obligations, running at sub-100ms on edge hardware where cloud cannot reach. Every tonne of CO₂ tracked the way every euro is.

---

## 2. Executive Summary (≤ 2,500 chars)

Lifetime Oy builds **DWS IQ**, the first double-entry ledger for industrial CO₂. Every CBAM import, ETS surrender, and CSRD disclosure produces a journal entry — same carbon, four regulatory touchpoints, one auditable ledger.

50,000+ EU companies must file CBAM declarations and CSRD reports by 2026–2028. The current state is disconnected spreadsheets, manual consultants, and SaaS tools that assume cloud connectivity at industrial sites where connectivity is absent. The cost of failure is customs seizure, ETS penalties, and EU AI Act audit liability — not a missed dashboard.

Three compounding moats:

- **Carbon balance-sheet infrastructure.** First application of double-entry bookkeeping (Pacioli 1494) to CO₂. Each customer's verified emissions improve every other customer's CBAM accuracy — network effect.
- **Edge AI at €17K/year.** NVIDIA Jetson Orin Nano delivers on-premise inference under 100ms with zero cloud egress. Comparable cloud architectures cost €350K/year and run at 2–5s latency. EU AI Act Article 12 logging shipped March 2026 — five months ahead of enforcement.
- **Payment-agnostic recording.** Obligations are recorded at the transaction level, not the rail. Works with SEPA today and Qivalis (12-bank European MiCA-stablecoin consortium, H2 2026) tomorrow.

Traction (Q1 2026): €7K MRR, 6 paying customers (Uber Finland, Bolt, Kela, NCC reference, two unnamed industrial), 100% retention. Production agent coverage across 25 EU-regulated industries. NVIDIA Connect ISV Partner. Microsoft Founders Hub L4. Three InvestEU Portal listings. EIC Accelerator Step 1 submitted.

Why ASEAN now: CBAM forces ASEAN exporters into the EU to provide verified embedded-emissions data per shipment from 2026. Singapore is the regional control point. Deep SAGE + TIS Inc. provides distribution into Japanese manufacturing and ASEAN supply chains exactly when this demand goes from optional to mandatory.

---

## 3. The Problem (≤ 1,000 chars)

EU regulation moved from "report annually" to "declare per shipment." Three deadlines collide in 2026:

- **CBAM** (operational 2026): per-shipment embedded-emissions declarations for steel, cement, aluminium, fertiliser, electricity. Default factors inflate costs 20–40% vs. actual. 8–12 hours per manual declaration.
- **CSRD** (wave 1: 2026, wave 2: 2027): double materiality, Scope 1/2/3, taxonomy alignment. Enterprise consultant cost: €180K–350K/year.
- **ETS Phase IV** (2026–2030): tightening caps. Real-time position required to avoid over-surrender or penalty.

No platform connects these to the underlying payments and shipments that generate them. ASEAN exporters get hit hardest — they must provide verified data without any EU-side tooling.

---

## 4. The Solution (≤ 1,000 chars)

DWS IQ converts every industrial transaction into a compliance journal entry — automatically.

1. A steel shipment is paid via SEPA, ERP PO, or future Qivalis stablecoin.
2. DWS IQ reads the transaction and embedded-emission data.
3. Three journal entries are written in the same second: CBAM obligation, CSRD Scope-3 entry, ETS surrender position.
4. Audit trail written to tamper-evident Article-12 log (7-year retention, EU AI Act compliant).

Runs on NVIDIA Jetson Orin Nano (€500/device, 15W) — no cloud egress, no CLOUD Act exposure, no latency. Model-agnostic: Claude, Gemini, or any future frontier model can swap in without rewriting compliance logic, which lives in the 55B-parameter Lifetime World Model.

---

## 5. Innovation & Defensibility

Three validated innovations, each with an academic citation track:

1. **Carbon debit-credit ledger** — Pacioli 1494 applied to CO₂. No competitor has this architecture. Documented in Metropolia Master's thesis V3 (2026).
2. **6-layer harness engineering** — information architecture that lifted compliance accuracy from 52.8% → 66.5% without changing the underlying model. Same Metropolia thesis.
3. **Payment-agnostic compliance recording** — first MiCA-aware industrial compliance ledger in Europe. Qivalis-ready before Qivalis ships.

19-moat competitive fortress (€3–6M / 24–36 month entry barrier). Boardy.ai raised €11M — 16× our SAFE ask — and still cannot replicate Tier-1 moats (EU operations, Kela validation, NCC reference, InvestEU portal, edge stack).

---

## 6. Market & Why Singapore / ASEAN Now

| Year    | EU regulation pulse                              | EU TAM     | ASEAN-side exposure                           |
| ------- | ------------------------------------------------ | ---------- | --------------------------------------------- |
| 2026    | CSRD wave 1, CBAM operational                    | €2B        | Singapore trading houses, Japanese exporters  |
| 2026–28 | Fit for 55, CSRD wave 2                          | €5B        | ASEAN steel, cement, aluminium                |
| 2027–30 | EPBD, ETS expansion                              | €8B + €10B | Power, shipping, industrial heat              |

Total EU TAM: ~€25B over 10 years. The ASEAN-side compliance-data market (verified emissions for EU-bound exports) is unmeasured today and entirely greenfield. Deep SAGE puts DWS IQ in front of it before competition forms.

Japan angle (TIS Inc.): Japanese manufacturers (steel, automotive, electronics) exporting into the EU are textbook CBAM buyers. TIS is positioned to be the in-country SI partner.

---

## 7. Traction (Q1 2026)

- **€7K MRR**, 6 paying customers, 100% retention
- **25 EU-regulated industries** covered by the production agent fleet
- **Uber Finland**: CSRD reporting 60h → 8h per month (87% reduction)
- **Kela**: audit readiness 6 months → 4 weeks
- **Bolt Finland**: ETS compliance — €10K–50K penalty exposure → €0
- **NCC**: reference customer, construction vertical
- **Partnerships**: NVIDIA Connect ISV, Microsoft Founders Hub L4, Red Hat AI event partner (Finland Mar 2026), Aiven (EU-sovereign DB migration)
- **Funding**: EIC Accelerator Step 1 submitted; SAFE round live at €3.8M cap; three InvestEU Portal listings

---

## 8. Team

- **Risto Anton Päärni** — Founder & CEO. Helsinki. Background: enterprise compliance, AI infrastructure. Author of DWS Standards Library. PhD candidate (Firehorse research line, LUT) and Master's candidate (Metropolia, V3 thesis on DWS IQ architecture).
- **Lifetime Oy core team** — engineering + compliance + sales (current headcount and recent hires available on request; structured for a 12-week scaling sprint).
- **Advisors / investor signal**: Boardy network introductions in flight; Colbridge Ventures (Nicolas Derrien), Soldera (Oliver Bonallack), Plug and Play (Arthur Périssich).

---

## 9. Why Deep SAGE (the answer to the form field)

Three specific gaps Deep SAGE fills exactly:

1. **Fractional CXO for ASEAN expansion.** We need a senior Singapore-based CRO or COO who has scaled an enterprise AI / climate-tech business across ASEAN — not a full-time hire we cannot yet afford.
2. **TIS Inc. as enterprise distribution.** A Japanese SI relationship is the fastest route into Japanese manufacturers exporting to the EU (= our CBAM buyer profile).
3. **S$500K bridge to Series A.** Extends runway through Q4 2026 Series A target. Used for ASEAN-side go-to-market, not for product (product is shipped).

---

## 10. Use of Funds — S$500K Tranche (Illustrative)

| Line item                                                | S$       | Notes                                                                |
| -------------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| Singapore entity setup + 1 ASEAN GTM lead (12 months)    | 220,000  | Hire post-cohort; mandate = TIS relationship + first ASEAN customers |
| Pilot deployments (Jetson hardware + integration), 3 sites | 120,000  | Japanese manufacturer + Singapore trading house + 1 utility           |
| CSRD/CBAM data partnerships in ASEAN                       | 60,000   | Local emission factor sources, port data integrations                 |
| Compliance certifications (SOC2, ISO 27001 maintenance)    | 50,000   |                                                                      |
| Marketing / events (Asia Tech x SG, regional Messe)        | 30,000   | Aligned with German Messe and PE meeting cadence already in plan      |
| Reserve                                                    | 20,000   |                                                                      |
| **Total**                                                  | **500,000** |                                                                      |

---

## 11. 12-Week Programme Plan (What We'd Actually Do)

| Weeks | Focus                                                  | Output                                                       |
| ----- | ------------------------------------------------------ | ------------------------------------------------------------ |
| 1–2   | Fractional CXO matching; ASEAN ICP definition          | Singapore ICP doc; 30 named accounts                         |
| 3–4   | TIS Inc. discovery; first Japanese manufacturer intros | TIS partnership framework; 5 qualified discovery calls       |
| 5–6   | Singapore entity, 1 pilot signed                       | Pilot SOW + Jetson deployment scheduled                      |
| 7–8   | CBAM data partnerships (port, trading house)           | 2 LOIs with ASEAN emissions-data sources                     |
| 9–10  | Pricing experiments for ASEAN market                   | Validated ASEAN price card                                   |
| 11    | Series A storyline refresh with ASEAN traction         | Updated investor memo                                        |
| 12    | Demo day: TIS, NUS Enterprise, regional investors      | At least 1 TIS commercial term sheet, 2 ASEAN pilots running |

---

## 12. Risks We Will Be Asked About (and Our Answer)

| Risk                                                  | Mitigation                                                                                                   |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| MRR is small (€7K)                                    | Regulatory tailwind = forced purchases 2026–2030. Traction quality (100% retention, enterprise logos) > size. |
| EU founder team without ASEAN experience              | This is the entire point of Deep SAGE. Fractional CXO + TIS solve it.                                        |
| Competition from Watershed, Persefoni, Sweep          | None offer edge inference, none offer payment-agnostic recording, none cover CBAM + CSRD + ETS in one ledger.|
| Hardware dependency (Jetson) creates supply risk      | NVIDIA Connect ISV status. Multi-SKU on-ramp (Orin Nano, Orin NX, Spark). Software runs on CPU-only fallback.|
| EU regulatory uncertainty (CBAM scope changes)        | Architecture is rail-agnostic and obligation-agnostic. Scope changes are config, not rewrite.                |

---

## 13. Application Submission Checklist

- [ ] Confirm application form fields on https://block71.co/programmes/deep-sage-2026/
- [ ] Paste Section 2 (Executive Summary) into form (verify char limit)
- [ ] Paste Sections 3–4 into Problem/Solution fields
- [ ] Paste Section 9 into "Why this programme"
- [ ] Attach pitch deck: `investor-outreach/DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.html`
- [ ] Founder LinkedIn + Y-tunnus + bank verification details
- [ ] Submit before **23:59 SGT, 31 May 2026** (allow 48h buffer → target submit by 29 May)
- [ ] CC Steve Leong (steveleonghw@nus.edu.sg) after submission so he can flag DWS IQ to the review team
- [ ] Log application in `investor-outreach/` index after submission

---

## 14. Open Questions for Risto Before Submit

1. Do we want to apply as **Lifetime Oy** (parent) or set up the Singapore entity inside the cohort? → Default: apply as Lifetime Oy, set up SG entity in weeks 5–6.
2. Is the SAFE round wording compatible with TIS S$500K — convertible note vs. equity vs. SAFE? Need 1-page from finance.
3. Reference customer permission: can we name **Uber Finland**, **Kela**, **NCC** on the application form (vs. anonymised "Tier-1 mobility / public sector / construction")? Default: name only with prior written OK.
4. Founder bandwidth: 12 weeks with Singapore travel — does this collide with German Messe + PE meeting cadence already in `investor-outreach/`?

---

## 15. Next Action

Send `REPLY_STEVE_LEONG.md` today (community-partner reply) → submit application by 29 May → CC Steve after submit.

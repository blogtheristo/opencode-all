---
VERSION AND AGENT HISTORY
Document: Qantic × Lifetime Oy — Deal Proposal V5
Version: 5.0
Created: 2026-03-21
Author: Claude Opus 4.6 (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: DRAFT — INTERNAL ONLY (prospect stage, no NDA signed)

Sessions & Modifications:
  - Version: 5.4 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 23.03.2026 | Changes: Updated NDA readiness — DocuSign eSignature integration built, NDA template EU 2016/943 compliant, signature verification script ready. All documents can be sent digitally same-day after 26.03 call.
  - Version: 5.3 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Moved expansion strategy to internal playbook (docs/partnerships/qantic-internal-playbook.md). Deal proposal stays focused on current deal scope only.
  - Version: 5.2 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Added expansion framing — "20 industries, one vendor" one-liner for 26.03 call. LWM details held back until BESS pilot proves itself.
  - Version: 5.1 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Added Section 8 — Mutual Credibility Window sales argument (DWS10.com as Qantic's compliance credibility layer for their clients' due diligence)
  - Version: 5.0 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Consolidated deal proposal incorporating corrected pipeline (3-5 verified CSRD clients), Phase 1/2/3 approach, corrected COGS (Helsinki-Berlin travel), non-compete rationale, validation question for 26.03 call
  - Version: 1.0 (business-case) | Date: 19.03.2026 | Changes: Initial partnership business case
  - Version: 1.0 (scoping-agenda) | Date: 19.03.2026 | Changes: 20-min call agenda
  - Version: 1.0 (product-summary) | Date: 19.03.2026 | Changes: BESS Compliance API product summary
  - Version: 1.0 (api-spec) | Date: 19.03.2026 | Changes: BESS Compliance API technical spec
  - Version: 1.1 (market-research) | Date: 21.03.2026 | Changes: Competitive analysis + deal analysis Section 11

Document Status:
  - Last Modified: 23.03.2026
  - Classification: CONFIDENTIAL — Partnership Strategy
  - Publication Status: INTERNAL ONLY
---

# Qantic × Lifetime Oy — Deal Proposal V5

**Document ID:** DWS-PARTNER-QANTIC-V5
**Classification:** CONFIDENTIAL — Internal Strategy
**Next Milestone:** Scoping call 26.03.2026

---

## 1. Executive Summary

Qantic's Q-System models energy revenue. DWS IQ 6 models compliance cost. Neither delivers a complete bankability picture alone. Together they produce the only integrated revenue + compliance assessment for EU energy assets.

This proposal defines a phased partnership: start with product deals that generate revenue and teach us Q-System's data formats, then build an API integration based on real data, then scale via per-seat SaaS pricing.

**Corrected pipeline:** 3-5 verified CSRD-obligated clients (not 10). Government agencies in Qantic's portfolio are regulators, not reporting entities.

**3-year conservative revenue:** €222k-€276k
**3-year optimistic revenue:** €349k-€403k

---

## 2. The Value Proposition

### What we solve together

| Q-System answers | DWS IQ 6 answers | Combined |
|---|---|---|
| "How much will this BESS earn?" | "What will compliance cost?" | "What is the true net return?" |
| Dispatch revenue per market | Scope 2 carbon cost per MWh | Full P&L including regulatory costs |
| Battery degradation curve | Asset impairment disclosure (CSRD) | Lifecycle financial + compliance view |
| Curtailment hours | Avoided emissions (EU Taxonomy) | Green financing eligibility proof |

### Why this cannot be replicated easily

- DWS IQ 6 has 82 ESRS disclosures pre-mapped — 18 months of regulatory engineering
- Emission factor database sourced from EU ETS benchmarks (Reg. 2021/447) and CBAM defaults (Reg. 2023/1773)
- BESS Compliance API already built: 19 unit tests passing, dispatch → EUR/year/asset
- Qantic has 10+ years of energy simulation IP — cannot be replicated as "evening work"

---

## 3. Pipeline Reality Check

### Qantic's verified references (~10)

| Client | Sector | CSRD-obligated? | Status |
|--------|--------|-----------------|--------|
| dena (Deutsche Energie-Agentur) | Government | NO — regulator | Not a compliance buyer |
| LANUV NRW | Government | NO — state agency | Not a compliance buyer |
| EU member state regulator | Government | NO — regulator | Not a compliance buyer |
| German TSO | Infrastructure | YES — large company | Likely Wave 1 or 2 |
| MAN Energy Solutions SE | Industrial | YES — €4B+ revenue, Wave 1 | High priority |
| Naturstrom AG | Energy | YES — energy supplier, Wave 2 | High priority |
| Energox GmbH | Energy tech | MAYBE — depends on size | Needs verification |
| Int'l project developer | Energy | UNKNOWN | Needs verification |
| Int'l plant manufacturer | Industrial | UNKNOWN | Needs verification |

**Realistic CSRD pipeline: 3-5 clients**

### Validation question for 26.03 call

> "How many of your current clients have active CSRD reporting obligations this year?"

This one question tells us if the pipeline is 3 or 10. If Thomas can name specific clients with reporting deadlines, the deal is real. If he speaks in generalities, the pipeline is smaller than it looks.

---

## 4. Phased Approach

### Phase 1: Product Deals (Now → Month 3)

Sell DWS IQ products directly to 2-3 Qantic-referred clients.

**Purpose:**
- Generate revenue immediately (no API development delay)
- Learn Q-System's actual export formats firsthand
- Get case studies and reference logos
- Prove the value before committing engineering to API

**Per client revenue options:**

| Package | Products | Price |
|---------|----------|-------|
| Minimum | Firehorse Reports + Data Services | €2,898 |
| Standard | Starter Bundle + Data Services | €7,399 |
| Full stack | Starter Bundle + Automation + Data Services + Fit55 Consulting | €16,849 |

**COGS per client (corrected for Helsinki-Berlin travel):**

| Cost | Amount |
|------|--------|
| Cloud hosting + AI compute | €2,000/year |
| Workshop delivery Helsinki → Berlin | €2,300 (flights €400 RT, hotel 2 nights €400, per diem 3 days €500, facilitator time €1,000) |
| Integration setup (one-time) | €500 |
| **Total COGS** | **€4,800** |

**Gross margin:** 72% (full stack) to 14% (minimum deal)

### Phase 2: Build API Integration (Month 3 → 6)

Design the Q-System → DWS IQ API based on real Phase 1 data.

**What we already have:**
- BESS Compliance API: POST /api/v1/agents/bess/execute
- 19 unit tests passing
- Dispatch schedule ingestion scaffold (DispatchEntry[] format)
- Quick estimate endpoint (no dispatch data needed)

**What we need from Qantic:**
- Q-System JSON export format confirmation
- Sample dispatch data (timestamp, chargedMwh, dischargedMwh, market, gridEmissionFactor)
- API authentication preferences

**Engineering effort:** 4-6 weeks from JSON format confirmation

**Firehorse Data Services (€899)** is the bridge product — covers the API scoping, data mapping, and initial integration consultancy.

### Phase 3: API SaaS Deal (Month 6+)

Qantic embeds DWS IQ compliance as a module inside Q-System. Their clients see compliance cost as a line item next to revenue projections.

**Pricing model: B1 — Per-seat SaaS (recommended)**

| Tier | Seats | Price/seat/month | Annual |
|------|-------|------------------|--------|
| Starter | 1-5 | €500 | €6,000-€30,000 |
| Professional | 6-15 | €400 | €28,800-€72,000 |
| Enterprise | 16+ | €300 | €57,600+ |

**Why B1 (per-seat) over other models:**
- B2 (per-report): unpredictable for us, hard to forecast
- B3 (platform license): too high upfront for a 2-10 person company
- B4 (revenue share): weakest for us — never offer first

---

## 5. Financial Projections (Corrected)

### Conservative (3-5 verified CSRD clients, organic growth to 15)

| Year | Product Revenue | API Revenue | Total | Notes |
|------|----------------|-------------|-------|-------|
| Year 1 | €44,547 | €0 | €44,547 | 3 product deals (avg €14,849) |
| Year 2 | €14,849 | €54,000 | €68,849 | 1 product + 5 API clients (15 seats × €300 × 12) |
| Year 3 | €0 | €108,000-€162,000 | €108,000-€162,000 | 10-15 API clients |
| **3-year** | **€59,396** | **€162,000-€216,000** | **€222k-€276k** | |

### Optimistic (network effect — TSO ecosystem, Qantic's clients' partners)

| Year | Product Revenue | API Revenue | Total |
|------|----------------|-------------|-------|
| Year 1 | €44,547 | €0 | €44,547 |
| Year 2 | €29,698 | €28,800 | €58,498 |
| Year 3 | €0 | €216,000-€270,000 | €216,000-€270,000 |
| **3-year** | **€74,245** | **€244,800-€298,800** | **€349k-€403k** |

### What the previous 50-client / €1.09M projection assumed (WRONG)

- 50 API clients by year 3: Qantic has ~10 references, not 50
- Linear growth from 10 to 50: no evidence for 5x network effect
- Workshop COGS at €1,500: actually €2,300 for Helsinki-Berlin

---

## 6. Commercial Terms

### For Phase 1 (Product Deals)

- Standard DWS product pricing — no Qantic discount initially
- Qantic refers, we close and deliver
- No referral commission (yet) — reassess after first 3 deals
- If referral volume justifies: 10-15% first-year commission

### For Phase 3 (API Deal)

| Term | Detail |
|------|--------|
| Pricing | Per-seat SaaS: €300-€500/seat/month |
| Minimum annual commitment | €25,000/year from Qantic (covers API hosting + support) |
| Contract length | 2 years initial, 1-year renewals |
| SLA | 99.5% uptime, 2s API response time, EU-only hosting |
| Data residency | Finland (europe-north1), no CLOUD Act exposure |
| Support | Business hours CET, 24h response for P1 issues |

### Non-Negotiable Terms

| Term | Detail | Rationale |
|------|--------|-----------|
| **3-year non-compete** | Qantic cannot build a competing CSRD/ESRS reporting engine during the partnership + 3 years after termination | Thomas's "evening work" comment (21.03.2026) signals they may view this as trivially replicable. The clause protects 18 months of regulatory engineering IP. This is the most important clause in the agreement. |
| **IP ownership** | DWS IQ engine, ESRS mappings (82 disclosures), emission factor database, compliance algorithms remain Lifetime Oy IP | Prevents reverse-engineering through API inspection |
| **Data ownership** | Client data belongs to client, processed under GDPR DPA | Regulatory requirement, non-negotiable |
| **Audit rights** | Lifetime Oy can audit Qantic's use of API for compliance with terms | Standard for OEM/embedded agreements |

---

## 7. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Qantic builds own CSRD engine | MEDIUM (small team, but Thomas's "evening work" comment) | HIGH — lose channel + IP exposure | 3-year non-compete clause (non-negotiable) |
| Pipeline is 3 clients, not 5 | MEDIUM | MEDIUM — lower revenue | Phase 1 product deals still profitable at 3 clients |
| Q-System has no JSON export | LOW (they're a SaaS company) | HIGH — delays integration | Offer CSV-to-JSON wrapper as fallback |
| MAN/Naturstrom buy from Big 4 instead | MEDIUM | HIGH — lose key reference | Price advantage (€16,849 vs €200k+/year) is 10x |
| Thomas loses interest after Phase 1 | MEDIUM | LOW — we keep the clients | Direct relationships established in Phase 1 |
| EU delays CSRD Wave 2 | LOW | MEDIUM — delays SME demand | Wave 1 (large companies) already started, unaffected |

---

## 8. Mutual Credibility Window (Sales Argument)

**Core insight:** Qantic's web presence is weak. Ours is strong. This is a selling point, not a gap.

**The argument for the 26.03 call:**

> "Your clients will research both of us. DWS10.com gives them the technical depth and compliance credibility to feel confident moving forward. We're not just a vendor — we're part of your pitch to your own clients."

**Why this works both ways:**

| Direction | What it proves |
|-----------|---------------|
| Qantic → Lifetime | Energy sector domain, BESS simulation IP, German market access, client network |
| Lifetime → Qantic | Technical depth (dws10.com/csrd/), EU compliance credibility, working product (not vaporware), EU-hosted infra |

**What Qantic's client sees when they Google us:**
- dws10.com/csrd/ — CSRD compliance landing page with pricing, regulation detail, structured data
- 82 ESRS disclosures mapped — visible technical depth
- EU-hosted (Finland) — data sovereignty story
- Products with real pricing — not "contact us for a demo"

**What Qantic's client sees when they Google Qantic alone:**
- Q-System product page — strong on energy simulation
- No compliance story — gap that their client notices
- No EU regulatory depth — makes the compliance module feel bolted-on

**After this deal:** Qantic becomes our energy sector reference. We become Qantic's compliance credibility layer. Both logos strengthen each other's pitch decks.

**Use on the call:** Frame DWS10.com as Qantic's credibility asset, not just a backend service. Their clients' due diligence works in our favor.

---

## 9. What We Bring to the Table

| Asset | Status | Value |
|-------|--------|-------|
| BESS Compliance API | Built, 19 tests passing | 4-6 weeks to production (not a roadmap item) |
| 82 ESRS disclosures mapped | Built, esrs-registry.ts | 18 months of regulatory engineering |
| ETS calculator | Built, ets-calculator.ts | Phase 4 emission factor calculations |
| CBAM calculator | Built, cbam-calculator.ts | Transitional + definitive 2026 |
| Helios energy agent | Built, helios.agent.ts | Industry-specific energy compliance |
| 18 EU country grid emission factors | Built, validated sources | UBA, RTE, NVE, Energinet, etc. |
| EU-hosted infrastructure | Live, Finland (europe-north1) | GDPR compliant, no CLOUD Act |
| CSRD landing page | Live, dws10.com/csrd/ | Lead capture for energy clients |

---

## 10. What We Need from Qantic

| Item | When | Priority |
|------|------|----------|
| Confirm CSRD-obligated client count | 26.03 call | CRITICAL — sizes the pipeline |
| Q-System JSON export format | After NDA | HIGH — unlocks Phase 2 |
| Sample dispatch data (anonymized) | After NDA | HIGH — validates API integration |
| Named pilot client for Phase 1 | 26.03 call | HIGH — first revenue |
| Signed NDA (via DocuSign — ready to send) | Before any technical sharing | REQUIRED |
| Signed LOI | After commercial terms agreed | REQUIRED |

---

## 11. Next Steps

| # | Action | Owner | Deadline |
|---|--------|-------|----------|
| 1 | Scoping call — ask the pipeline question | Risto + Thomas | 26.03.2026 |
| 2 | Send NDA via DocuSign for digital signature | Risto | Same day as call |
| 3 | Identify first pilot client (MAN or Naturstrom) | Thomas | 02.04.2026 |
| 4 | Product deal for pilot client | Risto | April 2026 |
| 5 | Receive Q-System JSON format | Thomas | After NDA |
| 6 | Build Q-System adapter (Phase 2) | Engineering | May-June 2026 |
| 7 | API SaaS commercial terms | Both | June 2026 |
| 8 | Phase 3 launch | Both | July 2026 |

---

## Related Documents

| Document | Location | Version |
|----------|----------|---------|
| Competitive Analysis | docs/market-research/qantic-energy-analysis.md | v1.2 |
| Business Case | docs/partnerships/qantic-partnership-business-case.md | v1.0 |
| Scoping Call Agenda | docs/partnerships/qantic-scoping-call-agenda.md | v1.0 |
| Meeting Minutes Template | docs/partnerships/qantic-scoping-call-minutes.md | v1.0 |
| After-Call Checklist | docs/partnerships/qantic-after-call-checklist.md | v1.0 |
| BESS API Product Summary | docs/partnerships/qantic-product-summary.md | v1.0 |
| BESS API Technical Spec | docs/api/bess-compliance-api.md | v1.0 |

---

**Document Owner:** Product Strategy
**Contact:** risto@lifetime.fi
**Distribution:** INTERNAL ONLY — Lifetime Oy

© 2026 Lifetime Oy · Partnership Strategy · Confidential

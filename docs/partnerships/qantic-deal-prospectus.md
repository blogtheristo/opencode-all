---
VERSION AND AGENT HISTORY
Document: Qantic × Lifetime Oy — Deal Prospectus
Version: 1.0
Created: 2026-03-21
Author: Claude Opus 4.6 (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: FINAL — Ready for 26.03 call

Sessions & Modifications:
  - Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 23.03.2026 | Changes: NDA ready via DocuSign (digital signature), updated documents-required section, signature verification script built
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Added mutual credibility bonus — DWS10.com as Qantic's compliance credibility layer
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Two-part deal — 16k setup + API fees. Replaces API-only and product-only proposals.

Document Status:
  - Last Modified: 23.03.2026
  - Classification: CONFIDENTIAL — Partnership Strategy
  - Publication Status: INTERNAL ONLY
---

# Qantic × Lifetime Oy — Deal Prospectus

**Date:** 26.03.2026
**Purpose:** API sales discussion — one pilot client

---

## The Deal: €15,990 Setup + €99/Asset/Month API + 30% Reseller Bonus

### Part 1 — Setup & Delivery (one-time)

| Deliverable | Value |
|---|---|
| Climate Reporting Starter Bundle (Platform + Reports) | €6,500 |
| Firehorse Automation (ESG data pipelines) | €4,950 |
| Firehorse Data Services (API scoping + data mapping) | €899 |
| Consulting Fit for 55 Specialist (1 month) | €3,000 |
| 3-day on-site workshop Helsinki → Berlin | included |
| Q-System JSON format mapping | included |
| **Total setup** | **€15,990** |

Invoiced on delivery. One payment, one project.

**What the client receives:**
- Complete BESS compliance cost report (CSRD, ETS, EU Taxonomy)
- Working data pipeline from Q-System dispatch to compliance output
- 3-day hands-on workshop with their compliance team
- EU Taxonomy substantial contribution evidence for green financing
- API credentials for ongoing access

### Part 2 — Ongoing API Access (monthly)

€99/month per asset. No volume tiers, no complexity.

Annual equivalent: €1,188/asset/year.
First 2 assets: free trial (30 days).

**What the API returns per asset:**

Example — 50MW/200MWh BESS in Germany:

| Cost component | EUR/year |
|---|---|
| Scope 2 carbon cost | €5,005 |
| Roundtrip efficiency loss cost | €488 |
| CSRD reporting cost | €12,000 |
| EU Taxonomy certification cost | €4,200 |
| **Total compliance cost** | **€21,693** |

Without this number, investor models miss 5-15% of costs.

---

## Why Both Parts

| | Setup only | API only | Setup + API |
|---|---|---|---|
| Year 1 revenue | €15,990 | €5,940 (5 assets) | €21,930 |
| Year 2 revenue | €0 | €11,880 (10 assets) | €11,880+ |
| Cash timing | Upfront | Monthly | Upfront + monthly |
| Ongoing obligation | None | SLA + maintenance | SLA + maintenance |
| Proves value before API | No — API is abstract | No — no relationship | Yes — workshop builds trust |
| Reference logo | Maybe | Unlikely | Yes — delivered project |

Setup pays for your time and travel. API is pure margin on code that already exists.

---

## Reseller Bonus — 30%

Qantic resells the package to their clients, earns 30% on everything.

**Per deal Qantic earns:**
- Setup: 30% × €15,990 = **€4,797 per client**
- API: 30% × €99 = **€29.70/asset/month ongoing**

**Example — Qantic sells to 5 clients over 2 years:**
- Setup commissions: 5 × €4,797 = €23,985
- API commissions (5 clients × 3 assets avg × 12 months): €5,346/year
- Total Qantic earns Year 1-2: **€29,331+**

**What Qantic does:** Identifies client, makes introduction, co-presents (optional). We deliver everything.

**What we do:** Workshop delivery, compliance report, API hosting, regulation updates, SLA, support.

Qantic carries zero delivery risk. Zero engineering. Zero support cost.

**Revenue per client (our share after 30% commission):**
- Setup: €15,990 − €4,797 = €11,193
- API: €99 − €29.70 = €69.30/asset/month
- COGS per client: €4,800 (cloud + travel + setup)
- Gross margin per client: €6,393 (57% on setup alone)

---

## What Exists Today

| Feature | Status |
|---|---|
| BESS Compliance API (POST /api/v1/agents/bess/execute) | Built, 19 tests passing |
| 82 ESRS disclosures mapped | Built (esrs-registry.ts) |
| ETS calculator (Phase 4) | Built (ets-calculator.ts) |
| CBAM calculator | Built (cbam-calculator.ts) |
| 18 EU country grid emission factors | Built, validated sources |
| Quick estimate endpoint (no dispatch data needed) | Built |
| EU-hosted infrastructure (Finland, europe-north1) | Live |

This is not a roadmap item. Code is written and tested.

---

## What We Need from Qantic

| Item | When |
|---|---|
| Name one pilot client with CSRD obligation | 26.03 call |
| Confirm Q-System JSON export format | After NDA |
| Sample dispatch data (anonymized) | After NDA |

**Preferred pilot:** MAN Energy Solutions or Naturstrom AG

---

## Timeline

| When | What |
|---|---|
| 26.03 | Scoping call — confirm pilot client |
| 26.03 | NDA sent via DocuSign same day |
| April | Workshop in Berlin (3 days), compliance report delivered |
| April | Invoice €15,990 |
| May-June | Q-System JSON adapter built (4-6 weeks) |
| July | API integration live, per-asset billing starts |

---

## Commercial Terms

| Term | Detail |
|---|---|
| Setup price | €15,990 one-time, invoiced on delivery |
| API pricing | €99/asset/month |
| Contract | 2 years initial, 1-year renewals |
| SLA | 99.5% uptime, 2-second API response |
| Data residency | Finland (europe-north1), EU only |
| IP | DWS IQ engine, ESRS mappings remain Lifetime Oy IP |
| Data | Client data belongs to client, GDPR DPA |
| Reseller commission | 30% on setup + API |
| Commission payment | Within 30 days of client invoice |
| Non-compete | 3 years — Qantic will not build competing CSRD/ESRS engine |
| Termination | 90 days written notice after initial term |

---

## Documents Required Before Technical Sharing

1. **Mutual NDA via DocuSign** — EU 2016/943 compliant, digital signature, sent within 1 hour of call (template: Partners/NDA_TEMPLATE_EU_2026.md, DocuSign integration: src/integrations/docusign/)
2. **Letter of Intent** — confirms pilot client, pricing, timeline (non-binding, template: docs/partnerships/qantic-loi-template.md)
3. **Reseller agreement** — 30% commission terms, non-compete, IP protection

NDA sent digitally same day. LOI + reseller agreement within 48 hours if terms agreed.

---

## Revenue Impact for Lifetime Oy

| | Amount | When |
|---|---|---|
| Setup invoice | €15,990 | April 2026 |
| Current MRR | €7,000 | Ongoing |
| Setup = months of MRR | 2.3 months | One project |
| API Year 1 (5 assets × €99 × 6 months) | €2,970 | July-Dec 2026 |
| API Year 2 (10 assets × €99 × 12) | €11,880 | 2027 |
| **Total Year 1** | **€18,960** | |

Plus: energy sector reference client, Qantic partner logo, DACH market entry proof point.

**Mutual credibility bonus:** Qantic's clients will research both parties. DWS10.com provides the technical depth and EU compliance credibility that strengthens Qantic's own pitch. We're not just a backend — we're part of Qantic's client confidence story.

---

## Contacts

Risto Päärni, Founder & CEO, Lifetime Oy (Espoo)
risto@lifetime.fi

Thomas Kalitzky, Managing Director, Qantic GmbH (Berlin)
support@qantic.com

---

**Document Owner:** Product Strategy
**Distribution:** INTERNAL ONLY — Lifetime Oy

© 2026 Lifetime Oy · Deal Prospectus · Confidential

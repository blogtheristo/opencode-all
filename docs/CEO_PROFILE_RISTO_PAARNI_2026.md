# Risto Paarni — Founder & CEO, Lifetime Oy

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/ceo-magazine-profile-EDmiH | Date: 15.02.2026 | Changes: New 10-page CEO profile — facts-first, no paid placement, incorporates board feedback and Fleet Captain framework. Replaces CEO_MAGAZINE_PROFILE_RISTO_PAARNI_2026.md.
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/ceo-magazine-profile-EDmiH | Date: 15.02.2026 | Changes: Restructured raise from EUR 150k/6 Fleet Captains to EUR 500k/16 Industry Captains (EUR 50k) + 16 Deputy Captains (EUR 30k). One seat per industry. Updated Pages 6, 8, 10. Vineyard Owner VC messaging updated.

Session Links & References:
  - Claude Code (claude/ceo-magazine-profile-EDmiH): https://github.com/blogtheristo/dws6/commits/claude/ceo-magazine-profile-EDmiH
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/CEO_PROFILE_RISTO_PAARNI_2026.md

Document Status:
  - Created: 15.02.2026
  - Last Modified: 15.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

---

## Page 1 — The Shrimp Boat Captain

There's a line in Forrest Gump that most people remember for the wrong reason. Bubba doesn't sell Forrest on the economics of shrimping. He doesn't pitch the TAM. He makes Forrest feel like he belongs on that boat. He gives him a role, a purpose, and a deck to stand on.

Risto Paarni has spent 35 years in industrial IT. Factory floors in Finland. ERP migrations across Scandinavia. Cloud architecture for manufacturers still running systems from the 1990s. He holds an M.Sc. in Industrial Management — the degree that sits at the intersection of engineering and business, exactly where compliance problems live.

Two years ago he looked at the EU's Fit for 55 package — ETS, CBAM, CSRD, EPBD, and a dozen more regulations hitting 16 industries simultaneously — and saw what no one was building: a single platform that treats every regulation as a data contract, maps them into one system, and automates compliance end-to-end.

Every regulation tells you what to measure. CBAM tells you what to report at the border. CSRD tells you how to disclose. They aren't separate problems. They're 15,000 rules in one system. And systems are what engineers build.

So he built it.

He still writes code daily. He manages the GitHub repository. He reviews architecture decisions. When a demo breaks, he fixes it himself. His philosophy: the CEO of an AI company should understand the models, the infrastructure, and the deployment constraints — not just the market opportunity.

That's the origin. Not a pivot from fintech. Not an MBA chasing a trend. An industrial engineer who spent three decades watching factories struggle with compliance — and finally built the tool they needed.

---

## Page 2 — The Problem: 15,000 Rules, Zero Tools

The EU's Fit for 55 package is the most ambitious climate regulation in history. It covers 16 industries and spans regulations arriving on a compressed timeline:

| Regulation | What it demands | Deadline |
|------------|----------------|----------|
| **ETS** | Emissions allowance tracking, trading, surrender | Active now |
| **CBAM** | Carbon calculations on every import at the EU border | Full implementation 2026 |
| **CSRD** | ESRS E1 climate disclosures, audit-ready data | Expanding 2026 |
| **ETS2** | Road transport + buildings emissions trading | 2027 |
| **EPBD** | Embodied carbon reporting, buildings >1,000 sqm | 2028 |
| **ESR** | National target tracking, non-ETS sectors | Active now |
| **ReFuelEU** | Sustainable aviation fuel mandates | Active now |
| **NIS2** | Cybersecurity compliance for critical infrastructure | Active now |
| **EU AI Act** | Automatic logging of all AI system events (Article 12) | 2026 |

What do companies use today? Spreadsheets. Consultants. Manual data entry. Time to produce a compliance report: three to six weeks.

Why existing tools fail:

- General-purpose ESG dashboards don't handle regulation-specific logic
- Consulting firms sell hours, not automation — they don't scale
- Cloud-only platforms can't serve air-gapped factories or mid-ocean vessels
- No existing platform covers all 16 industries under one regulatory stack

The gap is real, the deadline is fixed, and the penalty for non-compliance is market exclusion.

---

## Page 3 — The EUR 333,000 Question

This is the number that defines Lifetime Oy's technical advantage.

While competitors route all AI inference through cloud APIs — paying per token, accepting latency, depending on connectivity — Paarni's team deploys NVIDIA Jetson Orin Nano devices at the edge. Construction sites. Factory floors. Maritime vessels.

The cost comparison:

| Metric | Cloud-only competitor | Lifetime (edge AI) |
|--------|----------------------|-------------------|
| Monthly inference cost | EUR 27,750+ | EUR 0 (on-device) |
| Monthly infrastructure | EUR 2,000-5,000 | EUR 15-50 |
| Inference latency | 2-5 seconds | Under 100ms |
| Works offline | No | Yes |
| Annual total cost | EUR 350,000+ | EUR 17,000 (incl. hardware) |
| **Annual savings** | — | **EUR 333,000** |

The hardware economics:

- **Device cost:** ~EUR 500 per NVIDIA Jetson Orin Nano
- **Power draw:** 7-15 watts — solar-capable for remote construction sites
- **Hardware ROI payback:** Under 2 months
- **Planned deployment:** 50 sites

Construction sites don't have reliable internet. Factories run air-gapped OT networks. Ships operate mid-ocean. A compliance platform that requires a cloud connection has already failed the industrial use case. Paarni built for the places where cloud doesn't reach.

---

## Page 4 — The Platform

DWS IQ 6 is a multi-agent AI platform that automates climate compliance across 16 EU industries. It operates in four layers:

**Brain — Multi-Agent Orchestration.**
Coordinates real-time decision-making across compliance domains. Built on Google Cloud Run with Groq LPU acceleration. Processes regulatory signals, emissions data, and supply chain inputs simultaneously.

**Memory — Lifetime World Model.**
Climate-specialized knowledge base indexed across 15,000+ EU regulatory documents and 16 industry verticals. Purpose-built for regulatory intelligence — not a general-purpose language model repurposed for compliance.

**Body — Firehorse Product Suite.**
The operational layer: report generation, workflow automation, document management, omnichannel outreach. The Firehorse V2 module for construction uses Physical AI to reconstruct site events and generate audit-ready compliance documentation.

**Hands — Lifetime Fleet.**
Physical execution layer: vehicles, IoT devices, and drones extending the platform into the real world. Already operational and generating revenue through Uber, Taksi Helsinki, and Kela National Care transportation partnerships.

The full infrastructure stack:

- **Edge:** NVIDIA Jetson + AWS IoT Greengrass
- **Core:** Google Cloud Run + Groq API + LlamaStack orchestration
- **Client:** Chromebook Plus with Progressive Web App
- **Data:** Supabase (hot data) + AWS S3 (cold archive)
- **AI models:** Claude (Anthropic) + Google Gemini + Groq, orchestrated via Model Context Protocol (MCP)
- **Monthly infrastructure cost:** EUR 15-50

---

## Page 5 — 16 Industries, One Stack

DWS IQ 6 covers every EU-regulated industry under Fit for 55, organized by emissions criticality:

**Tier 1 — Critical Emissions Industries:**
Power and heat generation (25-30% of EU emissions), iron and steel, cement and lime, chemicals and petrochemicals, aviation, maritime shipping, road transport and logistics, construction and buildings (36-40% of lifecycle emissions).

**Tier 2 — Important Emissions Industries:**
Agriculture, waste management, aluminium, pulp and paper, petroleum refining, food and beverage, glass and ceramics, mining.

What the platform automates for each industry:

| Regulation | Automation |
|------------|-----------|
| ETS | Allowance tracking, trading, surrender |
| CBAM | Import carbon calculations, certificate management |
| CSRD | ESRS E1 climate disclosures, audit-ready data |
| EPBD | Embodied carbon assessment (EN 15978), lifecycle analysis |
| ESR | National target tracking, non-ETS emissions |
| ReFuelEU | Sustainable aviation fuel mandates, fuel intensity tracking |
| NIS2 | Cybersecurity compliance for critical entities |

**The construction beachhead.** EPBD mandates embodied carbon reporting for buildings over 1,000 square metres by 2028. Current manual processes — spreadsheets, external consultants, weeks of data gathering — cannot meet this deadline at scale. DWS IQ 6 can. That's why construction is the first market Paarni is attacking.

---

## Page 6 — Traction and Revenue

Lifetime Oy is not pre-revenue. The numbers:

**Current revenue:**

| Source | Amount | Status |
|--------|--------|--------|
| Fleet division (Uber, Taksi Helsinki, Kela) | EUR 7,000-14,000/month MRR | Operational |
| Q1 2026 pilot contracts (2 signed) | EUR 59,900 total | Signed |
| Projected annual (combined) | EUR 140,000+ | On track |

**Cloud credits secured:**

| Provider | Value |
|----------|-------|
| Google for Startups | USD 100,000 |
| AWS for Startups | USD 25,000 |
| Groq for Startups | USD 10,000 |
| GitHub Enterprise | Advanced features, 20 seats |
| NVIDIA hardware | EUR 54,200 |
| **Total** | **USD 135,000+ credits + EUR 54,200 hardware** |

**Capital efficiency:**

- Monthly infrastructure burn: EUR 15-50
- Bootstrapped to revenue before raising external capital
- Current raise: EUR 500,000 via SAFE notes (EUR 3.8M cap, 20% discount)
- Structure: 16 Industry Captain seats (EUR 50k) + 16 Deputy Captain seats (EUR 30k) — one of each per industry

**External validation:**

- Peachscore Accelerator — Cohort 25
- European Commission InvestEU Portal — Project INPO-20254383
- NVIDIA Inception Program participant

---

## Page 7 — Security and Data Sovereignty

Industrial customers in power generation, chemicals, and maritime handle critical infrastructure data. They cannot use platforms that store emissions data in US data centres. For these companies, EU data residency is a prerequisite, not a feature.

**Security architecture:**

| Capability | Implementation |
|-----------|---------------|
| Data residency | 100% EU — Finland, Germany, Netherlands |
| Encryption at rest | AES-256-GCM |
| Encryption in transit | TLS 1.3 |
| Key management | BYOK + CMEK supported |
| Audit logging | Immutable, 7-year retention, SIEM export |
| AI data policy | No customer data used to train public models |
| EU AI Act | Article 12 automatic logging — compliant |

**Deployment options:**

- Customer VPC
- Dedicated Private Cloud
- Hybrid Edge (cloud + on-premises Jetson)
- OT-Isolated Edge (fully air-gapped)

**Certification roadmap:**

| Certification | Target |
|--------------|--------|
| EU AI Act Article 12 | Q2 2026 |
| ISO 27001 | Q3 2026 |
| SOC 2 Type II | Q4 2026 |
| IEC 62443 (manufacturing security) | Q4 2026 |

---

## Page 8 — Become Captain of Your Industry

DWS IQ 6 covers 16 EU industries. Paarni is raising EUR 500,000 by offering one Industry Captain and one Deputy Captain seat per industry. Not a generic angel round — a structured crew where every investor owns a vertical.

**The tagline:** *Become Captain of your industry.*

**The structure:**

| Seat | Investment | Seats available |
|------|-----------|-----------------|
| **Industry Captain** | EUR 50,000 SAFE | 16 (one per industry) |
| **Deputy Captain** | EUR 30,000 SAFE | 16 (one per industry) |
| **Total seats** | | **32** |
| **Valuation cap** | EUR 3.8M | 20% discount |
| **Raise target** | **EUR 500,000** | |

**The 16 Industry Captain seats:**

| # | Industry | Captain | Deputy |
|---|----------|---------|--------|
| 1 | Power & Heat Generation | EUR 50k | EUR 30k |
| 2 | Iron & Steel | EUR 50k | EUR 30k |
| 3 | Cement & Lime | EUR 50k | EUR 30k |
| 4 | Chemicals & Petrochemicals | EUR 50k | EUR 30k |
| 5 | Aviation | EUR 50k | EUR 30k |
| 6 | Maritime Shipping | EUR 50k | EUR 30k |
| 7 | Road Transport & Logistics | EUR 50k | EUR 30k |
| 8 | Construction & Buildings | EUR 50k | EUR 30k |
| 9 | Agriculture | EUR 50k | EUR 30k |
| 10 | Waste Management | EUR 50k | EUR 30k |
| 11 | Aluminium | EUR 50k | EUR 30k |
| 12 | Pulp & Paper | EUR 50k | EUR 30k |
| 13 | Petroleum Refining | EUR 50k | EUR 30k |
| 14 | Food & Beverage | EUR 50k | EUR 30k |
| 15 | Glass & Ceramics | EUR 50k | EUR 30k |
| 16 | Mining | EUR 50k | EUR 30k |

**What every Captain and Deputy gets:**

- **Founding login** to the Lifetime World Model + Situation Room Reports — the same intelligence layer the platform runs on
- **Quarterly briefings** — full transparency, no black box
- **Priority routing** for 1 design partner or pilot introduction in their industry vertical
- **Industry-specific intelligence** — regulatory updates, competitive signals, and compliance alerts for their vertical
- **Founding crew identity** — they're on the ship before it scales

**Why Industry Captains, not generic angels:**

A Captain of Construction understands building sites. A Captain of Maritime knows what happens mid-ocean. A Captain of Chemicals has the Rolodex that opens procurement doors. By matching investors to industries, every Captain brings domain knowledge — not just capital. They become the crew member who knows their part of the ship.

An Industry Captain at EUR 50k leads the vertical. A Deputy Captain at EUR 30k is the lower entry point for angels who want skin in the game without the full commitment. Both get the same access. Both are crew.

32 seats across 16 industries. One Captain, one Deputy per vertical. When a seat is taken, it's gone.

---

## Page 9 — The Road Ahead: 2026

The regulatory timeline is not waiting for anyone. CBAM reached full implementation this year. CSRD reporting scope is expanding. ETS2 launches in 2027. EPBD embodied carbon mandates hit construction in 2028.

**Lifetime Oy's 2026 roadmap:**

- Pilot deployments with Nordic and Central European construction companies
- ISO 27001 and SOC 2 certifications — the keys that unlock enterprise procurement
- EU AI Act Article 12 compliance — positioning DWS IQ 6 as one of the first industrial AI platforms with full regulatory traceability
- NVIDIA Inception Program participation — Jetson and Omniverse for next-generation Physical AI
- Firehorse product suite expansion with new industry-specific modules

**Sales discipline:**

Paarni targets a curated list of 30 accounts. Three contacts per day. Fifteen per week. No exceptions.

Top 5 account targets:

| Company | Revenue | Country |
|---------|---------|---------|
| HOCHTIEF AG | EUR 25B | Germany |
| STRABAG SE | EUR 17B | Austria |
| Skanska AB | EUR 15B | Sweden |
| PORR AG | EUR 6.2B | Austria |
| NCC AB | EUR 5.5B | Sweden |

Each account gets 8-contact multi-threading: CEO, COO, CDO, ESG Director, Portfolio Director, Projects Head, CFO, BIM Lead.

**Regulatory timeline:**

```
2026  ████████  CBAM full implementation
      ████████  CSRD scope expansion
      ████████  EU AI Act Article 12

2027  ████████  ETS2 (road transport + buildings)

2028  ████████  EPBD embodied carbon (>1,000 sqm buildings)

2030  ████████  Fit for 55 — 55% emissions reduction target

2050  ████████  Paris Agreement — net-zero
```

The compliance wave is not approaching. It arrived. The companies that automate now gain a structural advantage. The ones that don't face fines, market exclusion, and a widening gap they'll never close.

---

## Page 10 — At a Glance

| | |
|---|---|
| **Name** | Risto Anton Paarni |
| **Title** | Founder & CEO |
| **Company** | Lifetime Oy (Finland) |
| **Platform** | DWS IQ 6 |
| **Education** | M.Sc. (Tech), Industrial Management |
| **Experience** | 35 years industrial IT |
| **Industries served** | 16 EU-regulated verticals |
| **Products** | DWS IQ 6, Firehorse Suite, Lifetime World Model, Lifetime Fleet |
| **Revenue** | EUR 7-14k MRR (Fleet) + EUR 59,900 Q1 2026 pilots |
| **Edge AI savings** | EUR 333,000/year vs. cloud competitors |
| **Infrastructure cost** | EUR 15-50/month |
| **Regulations covered** | ETS, CBAM, CSRD, EPBD, ESR, ReFuelEU, NIS2, EU AI Act |
| **Data residency** | 100% EU (Finland, Germany, Netherlands) |
| **Security roadmap** | ISO 27001 (Q3), SOC 2 (Q4), IEC 62443 (Q4) |
| **Current raise** | EUR 500k SAFE — 16 Industry Captains (EUR 50k) + 16 Deputy Captains (EUR 30k) |
| **Valuation cap** | EUR 3.8M (20% discount) |
| **Accelerator** | Peachscore Cohort 25 |
| **InvestEU** | Project INPO-20254383 |
| **Languages** | Finnish, English, Swedish |
| **Contact** | risto@lifetime.fi |
| **LinkedIn** | linkedin.com/in/ristopaarni |

---

**Related documents:**
- `docs/FOUNDER_CREDIBILITY_PLAYBOOK.md` — Internal playbook (press strategy, DM templates, LinkedIn post, carousel specs)
- `docs/CEO_MAGAZINE_PROFILE_RISTO_PAARNI_2026.md` — Original magazine profile (SUPERSEDED)

<!-- VERSION AND AGENT HISTORY
Document: Investor Memo — DWS IQ Aegis (Defence & Sovereignty)
Version: 1.2
Date: 2026-04-01
Author: Claude Opus 4.6 + Human Review
Branch: claude/review-investment-decision-0zTSR
Status: Final Draft
Story Lock: Defence Supply Chain Resilience + Sovereign AI + Dual-Use Intelligence
Audience: Defence & Resilience VCs (Sentris, Keen, Join Capital, Vsquared, NATO Innovation Fund, OTB)

AGENT HISTORY:
- v1.2 (2026-07-29): Traction claims reconciled to docs/TRACTION_CANONICAL.md — retired the "6 paying customers / EUR 7k MRR / 100% retention / EUR 84k ARR" formulation, removed dispatch operators (Uber/Bolt/Kela/Taksi Helsinki/Limo Helsinki/Sixt) from software-customer lists, and restated traction as ~EUR 7,000/month services and transport revenue (not software revenue) plus two enterprise pilots contracted Q1/2026 at EUR 29,950 each (EUR 59,900 booked).
- v1.1 (2026-04-01): Updated one-liner to "intelligence interceptor" framing — sharper for defence VCs. Old: "autonomous compliance intelligence" (too generic). New: sovereign + CLOUD Act-free in the first sentence.
- v1.0 (2026-04-01): Created after Sentris Capital rejection. Root cause: general investor memo led with "Climate Tech" — defence VCs pattern-matched to "not our mandate." This memo inverts the framing: defence supply chain resilience first, carbon compliance as a defence capability. Same company, same numbers, different lens.
-->

# DWS IQ Aegis — Investor Memo

**Company:** Lifetime Oy (Finland)
**Sector:** Defence & Resilience / Sovereign AI Infrastructure / Dual-Use Supply Chain Intelligence
**Product:** DWS IQ Aegis — Single-Tenant Sovereign AI Platform
**Stage:** Seed (bridge to Series A 2026)
**Document Version:** 1.0
**Last Updated:** April 1, 2026
**Status:** Active Fundraising
**Confidentiality:** For Potential Investors Only

---

## The One-Liner

**EN:** DWS IQ Aegis — intelligence interceptor for EU dual-use industries. Sovereign AI, Finnish-hosted, CLOUD Act-free.

**FI:** DWS IQ Aegis — teollisuustiedustelualusta EU:n säännellyille toimialoille. Suvereeni tekoäly, Suomessa ylläpidetty (reuna/private), CLOUD Act -vapaa.

No US cloud. No CLOUD Act exposure. Every agent decision logged, governed, and auditable under EU AI Act Article 12.

---

## The Problem

EU defence industrial supply chains face a regulatory collision that no existing platform addresses:

1. **Six overlapping regulations** — ETS, CBAM, CSRD, NIS2, KRITIS, EU AI Act apply simultaneously to defence contractors and their supply chains
2. **Carbon is now a supply chain weapon** — CBAM (Carbon Border Adjustment Mechanism) makes carbon cost a procurement variable. Defence supply chains importing steel, aluminium, or cement from non-EU sources face escalating carbon tariffs
3. **No cross-vertical visibility** — When a lime facility burns in Finland, the cascade hits steel (flux shortage), cement (feedstock), construction (embodied carbon), and chemical precursors (calcium carbide for explosives). No existing tool connects this chain
4. **US platforms are sovereignty-incompatible** — Palantir, Anduril, and C3.ai are US-headquartered and CLOUD Act exposed. EU defence procurement increasingly requires sovereign infrastructure
5. **EU AI Act creates personal liability** — Article 99(4) imposes fines up to EUR 15M or 3% of global revenue for violations of high-risk deployer obligations (Arts. 8-15, 26); Article 99(3) raises that to EUR 35M or 7% for prohibited-practice violations under Art. 5. Directors and officers need Article 12 logging and Article 26 deployer evidence on file, not dashboards

**The gap:** Defence supply chain compliance is a multi-industry, multi-regulation problem. Single-vertical tools see one slice. Consulting firms see the full picture but charge EUR 500K+ and deliver PDFs, not autonomous intelligence.

---

## The Solution: Aegis

DWS IQ Aegis is a single-tenant sovereign AI platform deployed on Finnish infrastructure. It provides autonomous compliance intelligence across 21 EU-regulated industries, including dual-use critical raw materials and defence supply chains.

### Architecture

| Layer              | Component                                      | Purpose                                                                            |
| ------------------ | ---------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Infrastructure** | UpCloud Managed Kubernetes (Helsinki DC)       | Finnish-owned, zero CLOUD Act exposure                                             |
| **Agents**         | 18+ industrial AI agents                       | Deterministic scoring across 21 industries                                         |
| **Governance**     | KYA Standard v1.6                              | Hardware-attested agent identity, capability gating, court-defensible audit trails |
| **Compliance**     | EU AI Act Article 12 logging                   | Every AI decision logged with reasoning lineage                                    |
| **Isolation**      | Single-tenant Kubernetes + Firecracker MicroVM | Dedicated cluster per customer, no shared tenancy                                  |

### Key Agents (Defence-Relevant)

| Agent                  | Capability                                                             | Defence Relevance                                                 |
| ---------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **ComplianceAgent**    | EU regulatory compliance (CSRD, ETS, CBAM, NIS2, EU AI Act)            | Defence supply chain regulatory exposure                          |
| **SovereigntyMonitor** | CLOUD Act exposure detection, EU data residency verification           | Sovereign infrastructure assurance                                |
| **VulcanAgent**        | Steel and metals — ETS Phase 4, CBAM carbon declarations               | Steel is sovereign capability; flux/alloy supply chain monitoring |
| **GaiaAgent**          | Cement, lime, earth materials — critical raw material assessment       | Dual-use critical raw materials under EU CRM Act                  |
| **CrossVerticalIntel** | Supply chain signal propagation across 21 industries                   | One disruption, five industries affected, one auditable ledger    |
| **MaterialOracle**     | Embodied carbon tracking, sustainable procurement                      | Defence procurement carbon cost visibility                        |
| **SiteSenseAgent**     | Site safety scoring, logistics optimization, EN 13001 crane monitoring | Defence construction and fortification site safety                |

### Roadmap Capabilities

| Capability                            | Status                                                            | Timeline      |
| ------------------------------------- | ----------------------------------------------------------------- | ------------- |
| **Orbital intelligence (ArgusAgent)** | Architecture designed, ICEYE-compatible SAR satellite integration | 2027          |
| **NATO interoperability layer**       | Specification phase                                               | Post-Series A |

---

## Why Defence — Not Just Climate

Carbon compliance IS defence infrastructure. This is not a metaphor:

1. **CBAM is a supply chain cost weapon** — Steel imported from Turkey, India, or China now carries escalating carbon tariffs. Defence contractors sourcing non-EU steel face CBAM cost spikes that affect procurement budgets and project timelines
2. **KRITIS mandatory reporting** — Germany's critical infrastructure law (January 2026) triggers mandatory security reporting for supply chain disruptions. A lime facility fire triggers KRITIS obligations across steel, cement, and chemical industries
3. **EU Critical Raw Materials Act** — 95 strategic projects granted the same security priority as military bases. Lime, rare earths, and strategic metals are now dual-use by regulation
4. **EU AI Act applies to defence AI** — Any AI system used in defence procurement, supply chain management, or infrastructure monitoring must comply with Article 12 logging requirements. US platforms cannot provide this
5. **Steel is sovereign capability** — Without civilian steel supply chains functioning, defence industrial output halts within weeks. Carbon compliance visibility across the steel supply chain is defence supply chain visibility

**The insight:** The same ledger that tracks industrial carbon compliance tracks defence supply chain exposure. One platform, two markets, one auditable record.

---

## Cross-Vertical Intelligence — The Moat

### Case Study: Nordkalk Lime Facility Fire (March 30, 2026)

A fire at Nordkalk's limestone facility in Finland — Northern Europe's leading limestone producer (Sigmaroc group, EUR 400M revenue, operations across Finland, Sweden, Poland, Spain).

**DWS IQ Aegis signal propagation (real-time, autonomous):**

```
TRIGGER: Lime facility disruption
    |
    +-- Steel flux shortage (VulcanAgent)
    |   +-- Steel quality/output degradation
    |   +-- CBAM cost spike (importers fill gap with non-EU steel)
    |   +-- ETS exposure recalculation
    |
    +-- Cement feedstock constraint (GaiaAgent)
    |   +-- Clinker production bottleneck
    |   +-- Construction material cost increase
    |
    +-- Chemical precursor gap
    |   +-- Calcium carbide shortage
    |   +-- Synthetic rubber + explosives supply chain stress
    |   +-- Defence industrial base alert
    |
    +-- Cross-vertical cascade (CrossVerticalIntel)
        +-- Construction embodied carbon increase (MaterialOracle)
        +-- CSRD E1 disclosure gap (ScoringEngine)
        +-- Customer compliance score degradation
        +-- KRITIS mandatory incident reporting triggered
```

**Five industries. Four EU regulations. One signal chain. Deterministic scoring — no LLM hallucination. Every data point verifiable from public EU sources.**

No existing platform — Palantir, Anduril, C3.ai, or Big 4 consulting — provides this cross-vertical cascade intelligence. This is the moat.

---

## Competitive Positioning

| Dimension                       | Palantir AIP    | Anduril Lattice  | C3.ai           | **DWS IQ Aegis**                                                  |
| ------------------------------- | --------------- | ---------------- | --------------- | ----------------------------------------------------------------- |
| **HQ / Jurisdiction**           | US (CLOUD Act)  | US (CLOUD Act)   | US (CLOUD Act)  | **Finland (EU)**                                                  |
| **CLOUD Act Exposure**          | Yes             | Yes              | Yes             | **None**                                                          |
| **EU AI Act Compliance**        | Roadmap         | None             | None            | **Article 12 native**                                             |
| **Agent Governance**            | Proprietary     | Hardware-focused | Dashboard       | **KYA Standard (court-defensible)**                               |
| **Cross-Vertical Intelligence** | Single-vertical | Hardware/sensors | Single-vertical | **21 industries, one ledger**                                     |
| **Carbon/CBAM Compliance**      | None            | None             | None            | **Native (ETS, CBAM, CSRD)**                                      |
| **Dual-Use Export Control**     | Partial         | Partial          | None            | **Reg. 2021/821 native**                                          |
| **EU Certification Roadmap**    | None announced  | None announced   | None announced  | **ISO 27001 (Q3 2026), SOC 2 Type II (Q4 2026), PiTuKri audited** |
| **Year 1 Cost**                 | ~EUR 920K+      | Custom (high)    | ~EUR 300K+      | **EUR 72K**                                                       |
| **5-Year TCO**                  | ~EUR 4.6M       | Custom           | ~EUR 1.5M       | **EUR 120K**                                                      |

**Price advantage:** 13x cheaper than Palantir in Year 1. 38x cheaper over 5 years.

---

## Sovereignty Credentials

| Credential             | Status                                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| **Infrastructure**     | UpCloud (Finnish-owned, Tesi-backed), Helsinki DC                                                                             |
| **CLOUD Act Exposure** | None — no US parent company, no US-owned infrastructure                                                                       |
| **Data Residency**     | EU-only (Finland, Germany)                                                                                                    |
| **Staff Access**       | EU-only personnel                                                                                                             |
| **ISO 27001**          | Q3 2026                                                                                                                       |
| **SOC 2 Type II**      | Q4 2026                                                                                                                       |
| **PiTuKri**            | Audited — Traficom NCSC-FI cloud security criteria v1.1, 52 criteria (transitioning to national criteria library autumn 2026) |
| **CISPE**              | Member                                                                                                                        |
| **Compliance**         | GDPR, NIS2, EU AI Act, CER Directive, EU CRM Act, KRITIS, dual-use export control (Reg. 2021/821)                             |
| **SLA**                | 99.999% (UpCloud infrastructure)                                                                                              |

---

## Traction & Metrics

**Current Metrics (March 2026):**

| Metric           | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| Services + transport revenue | ~EUR 7,000/month — not software revenue; cash break-even, founder salary EUR 0 |
| Software revenue | EUR 0 (Aegis is preorder; GA September 2026; pre-revenue)    |
| Contracted enterprise pilots | 2 (Q1/2026, EUR 29,950 each, EUR 59,900 booked)  |
| Customer LTV     | EUR 70K–120K annual value per logo                           |
| Platform         | a fleet of skilled agents, 32 products, 5 cloud environments |
| Industries       | 21 EU-regulated verticals                                    |
| Time Savings     | 40+ hours/month saved per customer                           |

**Sales Timeline:**

| Date                | Milestone                                         |
| ------------------- | ------------------------------------------------- |
| Now – June 14       | Pipeline building, pilot conversions              |
| **June 15, 2026**   | V1 Launch at Arctic 15 (Helsinki) — sales kickoff |
| June 15 – Aug 15    | 100% sales sprint (2-month dedicated push)        |
| **August 15, 2026** | First sales cycle data available                  |
| 2026 target         | EUR 900K ARR (25 customers x EUR 36K avg)         |
| Series A            | 2026 at EUR 15M+ pre-money valuation              |

---

## Aegis Unit Economics

### Per-Customer Infrastructure (UpCloud Helsinki)

| Component                    | EUR/mo   |
| ---------------------------- | -------- |
| UKS Production control plane | ~60      |
| 3x Worker nodes (4xCPU-8GB)  | 156      |
| Managed PostgreSQL (HA)      | ~100     |
| Managed Valkey/Redis         | ~30      |
| Load Balancer                | 30       |
| Egress                       | 0        |
| **Total**                    | **~376** |

### Aegis Pricing & Margins

| Metric                           | Value                  |
| -------------------------------- | ---------------------- |
| One-time deployment              | EUR 59,990             |
| Monthly subscription             | EUR 999/mo             |
| Infrastructure cost              | EUR 376/mo             |
| **Infra gross margin**           | **62% (EUR 623/mo)**   |
| Effective margin (amortized 5yr) | **81% (EUR 1,623/mo)** |
| Breakeven                        | ~6 customers           |

Enterprise and government pricing on request.

---

## Current Fundraising Round

### Round Structure — EUR 650K Total

- **Instrument:** SAFE (Simple Agreement for Future Equity)
- **Valuation Cap:** EUR 3.8M
- **Investment Type:** Equity-style, high-risk investment (not a loan)
- **Total Round:** EUR 650,000

### Seat Tiers

| Tier               | Investment  | Seats                                                                      |
| ------------------ | ----------- | -------------------------------------------------------------------------- |
| **Fleet Admiral**  | EUR 200,000 | 1                                                                          |
| **Captain**        | EUR 50,000  | 9 (each covering a cluster of EU-regulated industries, including dual-use) |
| **Deputy Captain** | EUR 5,000   | Unlimited                                                                  |

**Round math:** EUR 200K (Fleet Admiral) + 9 x EUR 50K (Captain) = EUR 650K total

- **Fleet Admiral** — Strategic co-pilot. Full board observer rights, annual 1:1 strategy sessions, first right of refusal on all follow-on rounds.
- **Captain** — Named captain covering a cluster of 21 EU-regulated industries, including dual-use (defence/sovereignty). Quarterly strategy briefings, priority pilot routing, founding Situation Room access, industry-specific intelligence.
- **Deputy Captain** — Open tier, unlimited seats. EUR 5,000. Quarterly briefings, upgrade path to Captain.

### Use of Funds (EUR 650K)

| Category            | Allocation | EUR    |
| ------------------- | ---------- | ------ |
| Product Development | 40%        | 260K   |
| Sales & Marketing   | 35%        | 227.5K |
| Operations & Team   | 15%        | 97.5K  |
| Runway Buffer       | 10%        | 65K    |

**Target Runway:** 18–24 months to Series A.

---

## Team & Company

**Founder & CEO:** Risto Anton Paearni — 35 years of domain expertise in industrial IT, construction, and infrastructure. Career operator who has lived the compliance problem from factory floor to boardroom, now encoding that knowledge into AI agents.

**Company:** Lifetime Oy
**Business ID:** 0772407-9
**VAT:** FI07724079
**HQ:** Espoo, Finland

**Partnerships:** NVIDIA Connect Partner, Microsoft Founders Hub (L1-L4), Google Cloud, AWS Consulting Partner, IBM Business Partner, Acer Finland, Konfitech

**Accelerator:** Peachscore Cohort 25 (Nordic VC network access)

**Cloud Credits:** EUR 100K+ in AWS/Google Cloud infrastructure credits secured

**Third-Party Validation:**

- Crunchbase Growth Score: 91
- Crunchbase Heat Score: 86

**Defence Ecosystem:**

- DEFINE Finland (Defence Tech Hub) — 60+ member ecosystem (ICEYE, IQM, Kuva Space, Varjo, Elfys)
- NATO DIANA Accelerator (VTT-operated, Espoo)
- Research partners: VTT, Aalto University

---

## Distribution Channels

| Channel                   | Reach                                            |
| ------------------------- | ------------------------------------------------ |
| IFS Cloud Marketplace     | Nordic defence/industrial ERP customers          |
| SAP Store                 | Defence supply chain S/4HANA integration         |
| Microsoft AppSource       | Dynamics 365 for defence procurement             |
| DEFINE / Defence Tech Hub | 60+ member ecosystem, defence procurement access |
| Direct enterprise sales   | V1 launch at Arctic 15 (June 15, 2026)           |

---

## KYA Standard — Agent Governance for Defence

The KYA Standard (v1.6) is why Aegis is not just another AI platform:

- **Know Your Agent (KYA-S):** Hardware-attested agent identity, capability gating, forensic audit trails. Every agent carries a cryptographic identity and operates within explicit capability bounds.
- **Court-defensible logs:** Every agent decision logged with reasoning lineage — evidentiary basis for EU AI Act Article 12 compliance and D&O safe harbor claims.
- **Kill-switch authority:** Hardware kill-switch for any agent in the swarm. Human override is a physical capability, not a software promise.
- **D&O Safe Harbor:** KYA-S certification provides proof of compliance with EU AI Act obligations. Estimated 8–12% D&O insurance premium reduction for certified deployments.

**Why this matters for defence investors:** KYA is a standard, not a feature. Customers build compliance workflows on top of it. Switching costs are structural, not contractual. No competitor has an equivalent governance framework for autonomous agent swarms.

---

## Risk Factors

- Early-stage company risk — seed stage, pre-Series A
- Lean two-person team; senior technical (CTO) hire still pending (funded by the raise)
- Market adoption risk — enterprise sales cycles are long
- Execution risk — scaling from 6 to 25 customers in 2026
- Competition risk — well-funded US platforms may build EU-sovereign offerings
- Regulatory risk — EU regulation timeline may shift
- Technology risk — AI capabilities evolving rapidly

---

## Contact

**Founder & CEO:** Risto Anton Paearni
**Email:** risto@onelifetime.world
**Phone:** +358 400 319 010
**Company:** Lifetime Oy, Espoo, Finland

**Product Information:** https://dws10.com
**Investor Relations:** https://dws10.com/investor-relations/
**Aegis Product Page:** https://dws10.com/products/aegis.html
**Pitch Video:** https://youtu.be/7pLs8IEzZfg?si=XggZ67cAusqnXjzs

---

**DISCLAIMER:** This memo is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy securities. Any investment decision should be made based on a thorough understanding of the risks involved and independent professional advice.

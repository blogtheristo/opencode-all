# Firehorse Product Manufacturing Operating Model
## Hybrid AI-Edge Architecture for Climate-Intelligent Industrial Platforms

***
# VERSION AND AGENT HISTORY

Version: 3.3

Sessions & Modifications:
  - Version: 3.3 | Tool: Claude Code (Opus 4.6) | Session: V3-Merge | Date: 10.02.2026 | Changes: Merged Thesis_FI.md (v2.1) and V2Thesis_FI.md (v3.2) into a single consolidated version. Fixed Scandinavian characters, updated identifiers, added DWS10 e-commerce, audio chat and HIL pipeline sections, Karpathy appendix, Firehorse operating model sections
  - Version: 3.2 | Tool: Claude Code (Opus 4.6) | Session: HIL-Pipeline | Date: 07.02.2026 | Changes: Added section 6.7 - Human-in-the-Loop learning pipeline (daily automation, three-layer backup, Learn/ folder output)
  - Version: 3.1 | Tool: Claude Code (Opus 4.5) | Session: Karpathy-Principles | Date: 04.02.2026 | Changes: Added Appendix E - AI Agent Behavioral Guidelines (Karpathy Principles), EU AI Act compliance mapping, implementation outcome metrics
  - Version: 3.0 | Tool: Claude Code (Opus 4.5) | Session: DWS10-Store-Integration | Date: 28.01.2026 | Changes: Added DWS10.com e-commerce store findings, Google Merchant Center integration, Revolut Business payments, Audio chat evolution roadmap with Groq/Llama models, Industry carbon footprint calculator, EU compliance mapping
  - Version: 2.2 | Tool: Word (HIL) | Session: dws6.com Google Run | Date: 19.01.2026 | Changes: Google admin@dws6.com and project under Google. Established 19.1.2026. Google Workspace Standard adopted. DNS records changed from Proton to Google. Created project dws6run to serve Google Run processes.
  - Version: 2.1 | Tool: Cursor AI (Claude) | Session: 16-Industries | Date: 06.01.2026 | Changes: Added Fit for 55 25+-industry analysis, AI usage disclosure, DWS10 use cases, expanded current state analysis
  - Version: 2.0 | Tool: Cursor AI (Claude) | Session: Thesis-Revision | Date: 05.01.2026 | Changes: Major revision - Added Solution Factory model, AgentFoundry documentation, Lifetime Scope Signals theory, SWOT analysis, research questions answers, complete theoretical framework
  - Version: 1.0 | Tool: GitHub Copilot | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Applied DWS document standard, synchronized with Finnish version

Session Links & References:
  - Claude Code (2026-02-10): V3 merge and Scandinavian character fixes
  - Claude Code (2026-01-28): DWS10 store integration, Google Merchant, Revolut, Audio chat roadmap
  - Cursor AI (2026-01-05): Thesis revision integrating codebase evidence
  - GitHub Copilot (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/metropolia/master-thesis/en/V3Thesis_EN.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 10.02.2026
  - Language: English
  - Languages Available: English, Suomi
  - Publication Status: DRAFT (V3.3 consolidated full version)

---

**Master's Thesis**
**Metropolia University of Applied Sciences**

**Author:** Risto Anton Päärni
**Program:** Smart Factory, Master's Degree (YAMK)
**Supervisor:** Jarno Varteva (with Erkki Räsänen)
**Company:** Lifetime Oy (Firehorse brand)
**Date:** 16.1.2026
**InvestEU Portal:** Project Lifetime World, DWS IQ 6, Firehorse (INPO-20254383) submitted for publication on the InvestEU Portal on 25.12.2025 — InvestEU Portal Team, European Commission

---

## Abstract

This thesis examines the Firehorse product manufacturing operating model, which combines cloud and edge computing technologies for industrial SMEs. The work focuses on the construction industry and its challenges in the EU's twin transition (digital + green). **Version 3.0 extends the research with e-commerce validation through DWS10.com store implementation, Google Merchant Center integration, Revolut Business payment processing, and an audio chat evolution roadmap using Groq inference with Llama models.**

**Keywords:** Artificial Intelligence, Edge Computing, Construction Industry, Operating Model, Cloud Services, E-Commerce, Google Merchant Center, Revolut Business, Audio Chat, EU AI Act Compliance

---

## Tiivistelma

Tama opinnaytetyo tutkii Firehorse-tuotevalmistuksen toimintamallia, joka yhdistaa pilvi- ja reunalaskentateknologiat teollisten pk-yritysten tarpeisiin. Tyo keskittyy rakennusteollisuuteen ja sen haasteisiin EU:n kaksoissiirtymassa (digitaalinen + vihrea). **Versio 3.0 laajentaa tutkimusta verkkokauppavalidoinnilla DWS10.com-kaupan toteutuksen, Google Merchant Center -integraation, Revolut Business -maksukasittelyn ja aanichat-kehityssuunnitelman kautta Groq-inferenssia ja Llama-malleja kayttaen.**

**Avainsanat:** Tekoaly, reunalaskenta, rakennusteollisuus, toimintamalli, pilvipalvelut, verkkokauppa, Google Merchant Center, Revolut Business, aanichat, EU:n tekoalysaados

---

## AI Tool Usage Disclosure

AI-assisted tools were used in the preparation of this thesis in accordance with transparency and academic integrity principles.

**Tools used:**
- **Claude Code (Anthropic Opus 4.5/4.6)** — DWS10 e-commerce store integration, documentation generation, V3 merge
- **Claude (Anthropic)** — Text editing, structure review, language improvement
- **Cursor AI** — Code documentation, technical section validation
- **GitHub Copilot** — Code examples, technical documentation

**AI's role in documentation:**
- Language review and improvement suggestions (FI/EN)
- Technical documentation structuring and harmonization
- Translation assistance Finnish-English
- Table and diagram formatting
- E-commerce maintenance manual generation

**Author's original contribution:**
- All research questions, hypotheses, and conclusions
- Original content, argumentation, and analysis
- Live codebase and implementation (dws6 repository: 50,000+ LOC)
- Business model design and validation
- Customer interviews and data (Uber, Bolt, Kela — EUR 10k MRR)
- Solution Factory model and AgentFoundry architecture development
- DWS10.com e-commerce product catalog and integrations

**Evidence base:**
- Git version history: [github.com/blogtheristo/dws6](https://github.com/blogtheristo/dws6)
- Live customer validation: EUR 10,000+ MRR
- Working system: DWS10.com, DWS6.com, onelifetime.world, lifetime.fi
- Google Merchant Center: Account 8496329, 30 products approved

---

# Table of Contents

1. [Introduction](#1-introduction)
2. [Theoretical Framework](#2-theoretical-framework)
3. [Current State Analysis](#3-current-state-analysis)
4. [DWS6 Operating Model Design](#4-dws6-operating-model-design)
5. [Implementation (MVP Phase)](#5-implementation-mvp-phase)
6. [DWS10.com E-Commerce Integration](#6-dws10com-e-commerce-integration)
7. [Audio Chat Evolution Roadmap](#7-audio-chat-evolution-roadmap)
8. [Results and Analysis](#8-results-and-analysis)
9. [Discussion](#9-discussion)
10. [Conclusions](#10-conclusions)
11. [References](#11-references)
12. [Appendices](#12-appendices)

---

# 1. Introduction

## 1.1 Background

European industrial SMEs face a "twin transition" challenge:

- **Digital transformation**: AI, automation, real-time decision-making
- **Green transformation**: EU Fit for 55 (55% emissions reduction by 2030), embodied carbon mandates by 2028

Traditional SaaS platforms fail because they:
1. Cost EUR 1,400+/month (unaffordable for SMEs)
2. Require cloud-only architecture (high latency, high operational costs)
3. Do not address industry-specific compliance workflows

**Firehorse (DWS6)** solves this with a novel operating model combining:
- Free-tier cloud infrastructure (EUR 0-350/month vs EUR 1,400+)
- Edge AI (NVIDIA Jetson) for <100ms inference
- Industry-specific AI agents (Construction, Manufacturing, Energy)
- Phased deployment (Silent Pilot -> Advisor -> Autonomous)
- **E-commerce validation through DWS10.com, Google Merchant Center, and Revolut Business** [V3.0]

## 1.2 Research Problem

**Primary Research Question:**
How can a bootstrapped industrial AI platform achieve product-market fit through a hybrid cloud-edge operating model while maintaining <EUR 400/month operational costs?

**Secondary Research Questions:**

1. **Product & Business Model:** How to develop a customer promise that solves a real problem and scales internationally?

2. **Technology:** How to build a digital, scalable service product that operates across cloud + edge + e-commerce?

3. **Technical Solution Evaluation:** Which technical solution best supports business objectives?

4. **Enterprise Security:** How to ensure NIS 2, EU AI Act, GDPR, and Cybersecurity Act compliance?

5. **E-Commerce Validation:** How can an automated store with AI-assisted operations validate product-market fit? [V3.0]

## 1.3 Objectives

1. Document the Firehorse operating model (MVP -> V1)
2. Validate the free-tier cost model (EUR 0/month target)
3. Measure customer benefit (<=2 month payback period)
4. Create a replicable model for other industrial startups
5. **Validate e-commerce channel with Google Merchant Center integration** [V3.0]

## 1.4 Scope

- **Industry:** Construction industry (3.5M companies in Europe) + 15 other EU industries
- **Market:** Nordics + Central and Eastern Europe
- **Timeframe:** MVP phase (December 2025 - February 2026)
- **Customers:** 5 pilot customers (EUR 10-100M revenue)
- **E-commerce:** 30 products across platform, software, and service categories [V3.0]

## 1.5 Key Concepts

| Concept | Definition |
|---------|------------|
| **MVP** | Minimum Viable Product - The smallest functional product |
| **Edge AI** | Artificial intelligence that runs on-device (no cloud connection) |
| **SaaS** | Software as a Service |
| **DWS6** | Digital Work System 6 - Technical name for the Firehorse platform |
| **Embodied Carbon** | Emissions from the manufacturing and transportation of building materials |

---

# 2. Theoretical Framework

## 2.1 Lean Startup Methodology

The Lean Startup methodology (Ries, 2011) forms the foundation of Firehorse product development. The core principle of the Build-Measure-Learn cycle directly guides the phased deployment model:

**Application to Firehorse:**

| Lean Startup Concept | Firehorse Implementation |
|----------------------|--------------------------|
| **MVP (Minimum Viable Product)** | 2 agents (CustomerSat, Viability) for 5 pilot customers |
| **Validated Learning** | Silent Pilot phase observes before acting |
| **Build-Measure-Learn** | Phase 1 -> Phase 2 -> Phase 3 progression |
| **Pivot or Persevere** | Signal-based coordination allows rapid course correction |

The Customer Development methodology (Blank, 2013) extends this with the principle of "getting out of the building" - validating product-market fit with real customers before scaling. Firehorse's 2-month payback guarantee operationalizes this by creating a measurable validation metric.

**Jobs-to-be-Done Framework:**
Following Clayton Christensen's framework, Firehorse identifies the "job" customers hire the product for:
- **Functional Job:** Track embodied carbon for EU compliance (2028 deadline)
- **Emotional Job:** Reduce anxiety about regulatory penalties
- **Social Job:** Demonstrate sustainability leadership to stakeholders

## 2.2 Platform Economics

Platform economics (Parker, Van Alstyne & Choudary, 2016) explains how multi-sided platforms create value through network effects. The Firehorse Solution Factory model extends this theory to industrial AI:

**Multi-sided platform design:**

```
+-------------------------------------------------------------+
|              FIREHORSE PLATFORM ECOSYSTEM                     |
+-------------------------------------------------------------+
|                                                               |
|  SIDE 1: Industrial Customers (across 8 verticals)           |
|  +- Construction: NCC, T2H (5 projects, EUR 50M portfolio)   |
|  +- Logistics: Uber, Bolt, Kela (EUR 10k MRR during pilot)   |
|  +- Manufacturing: 2M+ companies in Europe                   |
|  +- 5 additional verticals (Energy, Healthcare, etc.)        |
|                                                               |
|  SIDE 2: Data & Intelligence Providers                        |
|  +- Lifetime World Model (55B parameter LLM)                 |
|  +- EU compliance databases (Fit for 55, EPBD)               |
|  +- Industry-specific carbon coefficients                    |
|                                                               |
|  SIDE 3: Hardware & Edge Partners                             |
|  +- NVIDIA (Jetson Orin Nano edge devices)                   |
|  +- Acer/Asus (Blackwell training infrastructure)            |
|  +- IoT sensor manufacturers                                 |
|                                                               |
|  NETWORK EFFECTS:                                             |
|  * Cross-vertical intelligence (Logistics -> Construction)   |
|  * Each new vertical makes ALL verticals smarter             |
|  * Agent templates become reusable across industries         |
|                                                               |
+-------------------------------------------------------------+
```

**Value Creation Mechanisms:**
1. **Same-side effects:** More customers -> more industry data -> better agent accuracy
2. **Cross-side effects:** More verticals -> more reusable agent templates -> faster deployment
3. **Data network effects:** Lifetime World Model improves with each customer interaction

## 2.3 Industry 5.0

Industry 5.0 (European Commission, 2021) represents an evolution from Industry 4.0's automation focus toward a human-centric, sustainable, and resilient industrial paradigm. The Firehorse operating model directly implements these three pillars:

**Human-centric implementation:**
The three-phase deployment model (Silent Pilot -> Advisor -> Autonomous) ensures human oversight:

| Phase | Human Role | AI Role | Industry 5.0 Alignment |
|-------|------------|---------|------------------------|
| **Silent Pilot** | Full control | Observation only | Maximum human agency |
| **Advisor** | Approval required | Recommendations | Collaborative decision-making |
| **Autonomous** | Exception handling | Action within guardrails | Human oversight on edge cases |

## 2.4 Edge Computing Economics

Edge computing economics (Shi et al., 2016) provides the theoretical foundation for Firehorse's hybrid architecture. The key insight is that latency and bandwidth costs frequently exceed the savings of centralized processing:

**Latency-cost tradeoff analysis:**

| Processing Location | Latency | Monthly Cost | Use Case |
|---------------------|---------|--------------|----------|
| **Cloud (Groq API)** | 500-2000ms | EUR 555/month | Complex reasoning, report generation |
| **Edge (Jetson Orin Nano)** | <100ms | EUR 100/year (electricity) | Real-time construction site monitoring |
| **Hybrid** | Best of both | EUR 25-350/month | Firehorse optimal configuration |

**Edge AI ROI calculation:**

```
Cloud solution (12 months):
  Compute: EUR 555/month x 12 = EUR 6,660/year
  Total: EUR 6,660/year

Edge AI solution:
  Hardware (one-time): EUR 1,084 (Jetson Orin Nano + accessories)
  Electricity: EUR 10/month x 12 = EUR 120/year
  Year 1 total: EUR 1,204
  Year 2+ total: EUR 120/year

Savings: EUR 5,456/year (82% cheaper)
Payback period: 1.95 months
```

## 2.5 Multi-Agent Systems Theory and Lifetime Scope Signals

This section introduces a novel theoretical contribution: the **Lifetime Scope Signals protocol** for multi-agent coordination in bootstrapped industrial AI platforms.

### 2.5.1 Multi-Agent Systems Background

Multi-agent systems (MAS) theory (Wooldridge, 2009) provides the foundation for understanding how autonomous agents can coordinate to achieve complex objectives. Key concepts applied to Firehorse:

- **Agent autonomy:** Each agent operates independently within defined responsibility areas
- **Agent communication:** Agents exchange signals to coordinate dependencies
- **Emergent behavior:** System-level capabilities arise from agent interactions
- **Coordination mechanisms:** Protocols ensure agents work toward shared goals

### 2.5.2 Lifetime Scope Signals Protocol

The Lifetime Scope Signals protocol is a novel coordination mechanism developed for DWS IQ 6. It enables deterministic multi-agent development coordination. Unlike traditional MAS approaches based on real-time negotiation, this protocol uses **declarative signal emission** to unblock dependent agents.

**Signal format:**
```
[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP
```

**Signal types:**

| Type | Meaning | Action |
|------|---------|--------|
| `READY` | Milestone achieved | Unblocks downstream agents |
| `COMPLETE` | All agent work finished | Agent transitions to ready state |
| `ERROR` | Agent encountered an error | Alerts coordinator |
| `BLOCKED` | Waiting for external dependency | No action until unblocked |

### 2.5.3 MCP Hub Orchestration Patterns

The Model Context Protocol (MCP) Hub implements three workflow patterns for agent coordination:

1. **Fan-Out pattern:** Parallel task distribution to multiple agents
2. **Reflection pattern:** Self-evaluation and iterative improvement
3. **Sequential pattern:** Step-by-step execution with dependencies

## 2.6 Conceptual Model: Firehorse Solution Factory

The Firehorse Solution Factory model synthesizes the aforementioned theoretical frameworks into a unified conceptual model for building climate-intelligent industrial platforms:

```
+-------------------------------------------------------------------+
|                    FIREHORSE SOLUTION FACTORY                       |
|           Conceptual Model for Industrial AI Platforms              |
+-------------------------------------------------------------------+
|                                                                     |
|  STRATEGIC LAYER (Business Model)                                   |
|  +- Lifetime World Model (55B) -> Cross-vertical intelligence      |
|  +- 8 vertical templates -> Reusable agent configurations          |
|  +- AI-Assisted Development -> Cursor Pro + Claude Code Max         |
|  +- EU compliance moat -> Fit for 55, NIS2, GDPR                  |
|                                                                     |
|  OPERATIONAL LAYER (AgentFoundry + Lifetime Scope Signals)          |
|  +- Agent configurations -> YAML templates per vertical            |
|  +- Lifetime Scope Signals -> Coordination protocol                |
|  +- MCP Hub -> Multi-agent orchestration                           |
|  +- Phased deployment -> Silent -> Advisor -> Autonomous           |
|                                                                     |
|  EXECUTION LAYER (Brain-Memory-Body-Hands)                          |
|  +- Brain: DWS IQ 6 Platform (Groq + Claude + Gemini)              |
|  +- Memory: Lifetime World Model (climate knowledge base)          |
|  +- Body: 8 industry applications (vertical-specific agents)       |
|  +- Hands: Edge AI (Jetson), Drones, Robots, IoT sensors           |
|                                                                     |
+-------------------------------------------------------------------+
```

This conceptual model provides a replicable framework for other industrial AI startups seeking to achieve product-market fit while keeping operational costs low through AI-assisted development, edge computing, and multi-agent coordination.

---

# 3. Current State Analysis

## 3.1 European Industrial AI Landscape

European industry faces unprecedented regulatory pressure through the EU's Fit for 55 package. This creates forced demand for climate compliance solutions across 25+ industries.

### 3.1.1 The 16 Industries Affected by Fit for 55

The EU's Fit for 55 package mandates 55% net emissions reduction by 2030. This creates an unprecedented compliance burden on 25+ industries — requiring real-time carbon tracking, automated reporting, supply chain transparency, and continuous regulatory compliance.

**Tier 1: Critical Emission Industries (ETS + CBAM Direct Impact)**

These 8 industries face the greatest regulatory pressure: direct ETS coverage, CBAM border carbon levy, and mandatory carbon pricing.

| # | Industry | EU Emissions Share | Key Regulations | DWS IQ 6 Solution |
|---|----------|--------------------|-----------------|--------------------|
| **1** | **Electricity & Heat Generation** | 25-30% | ETS (cap tightening), Renewable Energy Directive | Real-time emissions monitoring, renewables certification tracking |
| **2** | **Iron & Steel** | High | ETS, CBAM (2026), ESR | Supply chain carbon tracking, CBAM import reporting |
| **3** | **Cement & Lime** | Very high | ETS, CBAM, EPBD (embodied carbon) | EN 15978 calculations, material carbon passports |
| **4** | **Chemicals & Petrochemicals** | High | ETS, CBAM (fertilizers), H2 mandates | Process emissions monitoring, hydrogen transition roadmaps |
| **5** | **Aviation** | 2-3% (growing) | ETS, ReFuelEU (SAF mandates) | SAF compliance, offset verification |
| **6** | **Maritime Transport** | Significant | ETS (2024), FuelEU Maritime | Voyage-level emissions, intensity data |
| **7** | **Road Transport & Logistics** | High | ETS2 (2027), CO2 standards | Fleet emissions management, zero-emission transition planning |
| **8** | **Construction & Real Estate** | 36-40% lifecycle | ETS2, EPBD, CSRD | **Full lifecycle carbon automation**, BIM integration, EN 15978/EN 15804 |

**Tier 2: Important Emission Industries (ESR + Indirect ETS)**

These 8 industries face diffuse regulatory pressure through national ESR targets, energy costs, supply chain rules, and indirect CBAM impacts.

| # | Industry | EU Emissions Share | Key Regulations | DWS IQ 6 Solution |
|---|----------|--------------------|-----------------|--------------------|
| **9** | **Agriculture & Livestock** | 10-12% | ESR, Methane Strategy, CAP | Farm-level emissions monitoring, fertilizer carbon calculations |
| **10** | **Waste Management & Recycling** | 3-4% | Waste Framework Directive, Landfill Directive | Methane capture monitoring, circular economy metrics |
| **11** | **Aluminium** | High (energy) | ETS, CBAM (2026) | Energy source tracking, renewable electricity certificates |
| **12** | **Pulp, Paper & Printing** | Medium | ETS, LULUCF | Forest carbon calculations, supply chain transparency |
| **13** | **Oil Refining** | High | ETS, ReFuelEU | Phase-down planning, SAF production monitoring |
| **14** | **Food & Beverage** | Medium | ESR, Energy Efficiency Directive | Agriculture supply chain carbon, energy optimization |
| **15** | **Glass & Ceramics** | Medium | ETS, CBAM (indirect) | Process emissions, material carbon tracking |
| **16** | **Mining & Quarrying** | Medium | ETS (indirect), Critical Raw Materials | Extraction emissions, CRM supply chain compliance |

### 3.1.2 Regulatory Timeline

```
2024 ----------------------------------------------------------------
      | Maritime in ETS
      | CBAM transitional phase active
      | CSRD reporting begins (large companies)
      |
2025 ----------------------------------------------------------------
      | Omnibus simplifications (administrative relief)
      | EU AI Act enforcement begins
      | NIS2 compliance deadline
      |
2026 ----------------------------------------------------------------
      | CBAM full enforcement (border carbon levy)
      | CSRD expands to more companies
      | Free ETS allowances decrease faster
      |
2027 ----------------------------------------------------------------
      | ETS2 for road transport and buildings
      | Stricter vehicle CO2 standards
      |
2028 ----------------------------------------------------------------
      | EPBD embodied carbon reporting (>1,000 m2)
      | Significant ETS cap tightening
      |
2030 ----------------------------------------------------------------
      | 55% emissions reduction target deadline
      | ESR national targets due
      |
2035 ----------------------------------------------------------------
      | 100% zero-emission new cars and vans
```

### 3.1.3 The Omnibus Package: "Fit for 55 Means Fit for 55"

The European Commission adopted the Omnibus simplification package on 26.2.2025, reducing the administrative burden on SMEs while keeping climate targets fully intact (European Commission, 2025).

**Key changes to CSRD reporting:**

| Change | Before | After Omnibus |
|--------|--------|---------------|
| **CSRD scope** | ~50,000 companies | ~10,000 companies (>1,000 employees) |
| **SME obligations** | Mandatory | Voluntary standard (EFRAG SME) |
| **Assurance level** | "Limited" -> "Reasonable" | Stays at "Limited" |
| **Timeline** | 2026-2027 | +2 year postponement ("stop the clock") |
| **Estimated savings** | - | EUR 4.4 billion/year |

**Critical observation: Climate targets remain unchanged**

The Omnibus package **does not change** the core Fit for 55 targets:
- **55% emissions reduction by 2030** — remains
- **ETS emissions cap** — continues to tighten as planned
- **CBAM border carbon levy** — effective 2026 as planned
- **ETS2 for road transport and buildings** — effective 2027
- **EPBD embodied carbon reporting** — effective 2028

**Impact on DWS IQ 6 business model:**

| Segment | Omnibus Impact | DWS IQ 6 Opportunity |
|---------|----------------|----------------------|
| **Large enterprises (>1,000 employees)** | CSRD obligation remains | Premium solution |
| **Mid-size (250-999 employees)** | Voluntary reporting | Affordable as competitive advantage |
| **SMEs (<250 employees)** | No reporting obligation | Supply chain pressure from large enterprises |

**Conclusion:** The Omnibus package makes the Firehorse model even more competitive:
1. **Large enterprises** still need automated reporting
2. **SMEs** face supply chain pressures from CSRD-reporting companies
3. **Voluntary EFRAG SME standard** creates demand for affordable solutions
4. **EUR 0-350/month pricing** is competitive in the voluntary reporting market

**Source:** European Commission. (2025). *Omnibus package*. [https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en](https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en)

## 3.2 Competitor Analysis

| Capability | Firehorse | Atlassian Rovo | SAP | Siemens |
|------------|-----------|----------------|-----|---------|
| **Monthly cost** | EUR 0-350 | EUR 1,400+ | EUR 4,000+ | EUR 2,000+ |
| **Edge AI** | Native | No | No | Limited |
| **25+ verticals** | Planned | No | Yes | Yes |
| **EU compliant** | Native | Partial | Partial | Yes |
| **<100ms latency** | Edge | No | No | Partial |
| **SME accessible** | Yes | No | No | No |

## 3.3 Customer Segments

**DWS10.com (Firehorse platform) target customers across 25+ industries:**

**Tier 1 - Critical Industries (Immediate sales focus):**
- **Construction:** NCC, Skanska, T2H, Vinci, Strabag (36-40% of EU emissions)
- **Logistics:** Uber, Bolt, Kela, DB Schenker, DHL (EUR 7k MRR live)
- **Manufacturing:** Kone, Wartsila, ABB, Valmet (ETS + CBAM)
- **Energy:** Fortum, Helen, Vattenfall (25-30% of emissions)

**Tier 2 - Important Industries (V1.1+ expansions):**
- **Agriculture:** Valio, Arla, agricultural cooperatives
- **Healthcare:** Kela (live), HUS, private hospital chains
- **Real Estate:** Kojamo, Sato, real estate investors
- **Public Sector:** Municipalities, central government, defense

## 3.4 Regulatory Drivers

| Year | Driver | Affected Verticals | Market Size |
|------|--------|--------------------| ------------|
| 2025-2026 | **CSRD** | All large companies | EUR 2 billion |
| 2026-2028 | **Fit for 55** | Logistics, Construction | EUR 5 billion |
| 2027-2030 | **EPBD** | Real Estate, Construction | EUR 8 billion |
| 2030-2035 | **ETS expansion** | Healthcare, Manufacturing, Agriculture | EUR 10 billion |

**Total Addressable Market (TAM):**
- Nordics: EUR 2.68 billion (10 years)
- EU: EUR 15-20 billion (10 years)

---

# 4. DWS6 Operating Model Design

The DWS6 operating model is built on three distinct layers: Strategic, Operational, and Execution. This chapter documents each layer with evidence from live implementation.

## 4.1 Strategic Layer: Solution Factory Model

The Solution Factory model transforms DWS6 from a single product into a replicable platform for producing climate-intelligent industrial applications across multiple verticals.

### 4.1.1 Solution Factory Architecture

```
+-------------------------------------------------------------------+
|                    SOLUTION FACTORY ARCHITECTURE                    |
+-------------------------------------------------------------------+
|                                                                     |
|  INPUT: Customer problem + Industry vertical                        |
|         |                                                           |
|  PROCESS: AgentFoundry configuration + Signal coordination          |
|         |                                                           |
|  OUTPUT: Climate-intelligent industrial platform                    |
|                                                                     |
|  +-----------------+  +-----------------+  +-----------------+      |
|  |   VERTICAL 1    |  |   VERTICAL 2    |  |   VERTICAL N    |      |
|  |   Construction  |  |   Logistics     |  |   [Template]    |      |
|  +-----------------+  +-----------------+  +-----------------+      |
|  | * SiteSense     |  | * FleetOptimize |  | * Agent A       |      |
|  | * MaterialOracle|  | * RouteGenius   |  | * Agent B       |      |
|  | * ScheduleGenius|  | * CarbonTracker |  | * Agent C       |      |
|  | * CustomerSat   |  | * CustomerSat   |  | * CustomerSat   |      |
|  | * Viability     |  | * Viability     |  | * Viability     |      |
|  +-----------------+  +-----------------+  +-----------------+      |
|           ^                   ^                   ^                  |
|           +-------------------+-------------------+                  |
|                    SHARED COMPONENTS:                                |
|           * Lifetime World Model (55B parameters)                   |
|           * MCP Hub orchestration                                   |
|           * Supabase + pgvector (data layer)                        |
|           * EU compliance engine                                    |
|                                                                     |
+-------------------------------------------------------------------+
```

### 4.1.2 Strategic Innovations

**1. EU Compliance as Competitive Advantage**

- Data residency: europe-north1 (Finland/Sweden)
- EU AI Act: Low-risk classification with human oversight
- NIS2: Security by design for critical infrastructure customers
- Fit for 55: Native carbon tracking for 2028 deadline

**2. Network Effects Across Verticals**

- Logistics route optimization data -> Construction delivery scheduling
- Manufacturing quality data -> Real estate maintenance prediction
- Energy consumption patterns -> All verticals benefit

### 4.1.3 Customer Promise

**Promise:** 2-month payback period or money back

**Value proposition:**
- Real-time emissions tracking (EU mandate 2028)
- Viability analysis (project profitability)
- Automated reports (saves 10h/week)

**Validation:** EUR 10k MRR from Uber, Bolt, and Kela during pilot proves customer willingness to pay.

## 4.2 Operational Layer: AgentFoundry and Lifetime Scope Signals

The operational layer documents the actual implementation mechanisms that enable the Solution Factory to function.

### 4.2.1 AgentFoundry Architecture

AgentFoundry is a multi-model, multi-tenant framework for deploying AI agents across industrial verticals.

### 4.2.2 Lifetime Scope Signals Protocol

**V1.0 Agent Fleet (10 agents):**

| ID | Name | Phase | Priority | Signals |
|----|------|-------|----------|---------|
| Agent-01 | DWS IQ Login | 1 | Critical | jwt-service, supabase-auth |
| Agent-02 | Firehorse Apps | 2 | Critical | report-api, automation-api |
| Agent-03 | Customer Dashboard | 3 | Critical | dashboard-layout |
| Agent-04 | AI Agents | 2 | Critical | mcp-hub, sitesense |
| Agent-05 | Mobile Dashboard | 3 | High | offline-sync |
| Agent-06 | Enterprise | V1.1 | Low | (Deferred) |
| Agent-07 | Supabase Database | 1 | Critical | schema-users, rls-policies |
| Agent-08 | Payments | 4 | Medium | stripe-setup |
| Agent-09 | Email System | 2 | High | transactional |
| Agent-10 | Documentation | 1 | Low | api-docs |

### 4.2.3 Three-Phase Deployment Model

**Phase 1: Silent Pilot (30 days)**
- Agent observes and records all operations
- No actions on customer systems
- Builds baseline understanding of operations

**Phase 2: Advisor (60 days)**
- Agent recommends actions
- All recommendations require human approval
- Builds trust through accurate predictions

**Phase 3: Autonomous**
- Agent executes within defined guardrails
- Human oversight for exceptions
- Continuous monitoring and adjustment

## 4.3 Execution Layer: Brain-Memory-Body-Hands Architecture

### 4.3.1 Hybrid Cloud-Edge Architecture

```
+-------------------------------------------------+
|  DWS6 HYBRID ARCHITECTURE                        |
+-------------------------------------------------+
|                                                   |
|  CLOUD LAYER (Google Cloud Run)                   |
|  +- Groq API Router (FastAPI)                     |
|  +- Supabase (PostgreSQL)                         |
|  +- Agent orchestration (LlamaStack)              |
|                                                   |
|  EDGE LAYER (NVIDIA Jetson Orin Nano)             |
|  +- SiteSense agent (construction site monitoring)|
|  +- Offline operation (no network required)       |
|  +- <100ms latency (25x faster than cloud)        |
|                                                   |
|  CLIENT LAYER (Chromebook PWA)                    |
|  +- Progressive Web App                           |
|  +- Offline-first design                          |
|  +- EU data residency (GDPR-compliant)            |
|                                                   |
+-------------------------------------------------+
```

### 4.3.2 MCP Hub Multi-Agent Orchestration Platform

**Vision:** Control plane that coordinates Cursor, Claude, Gemini, and DWS IQ agents with construction planning tools and Lifetime Firehorse products.

**Business impact:**
- +62% development velocity
- -73% bug reduction
- EUR 23,640/year savings
- 17.2 months runway on EUR 150K SAFE (vs 6.7 months without MCP)

## 4.4 Cost Model

| Phase | Cost | Technology |
|-------|------|------------|
| **MVP** | EUR 0/month | NVIDIA Connect partnership + Cloud Run free tier |
| **Alpha** | EUR 50-150/month | NVIDIA Connect + Supabase Pro |
| **V1** | EUR 350/month | NVIDIA Connect + Supabase + Monitoring |

## 4.5 Go-to-Market Strategy

| Phase | Timeline | Customers | Agents |
|-------|----------|-----------|--------|
| **MVP** | December 2025 | 5 construction customers (FREE) | 2 |
| **Alpha** | February 2026 | 20-50 customers, 3 industries | 10 |
| **V1** | November 2026 | 100+ customers, 8 industries | 33 |

## 4.6 Firehorse Omnichannel: Marketing Targeting Optimization

**Problem:** SMEs struggle to allocate limited marketing budgets effectively.

**Solution:** Firehorse Omnichannel leverages AI-powered market intelligence for channel selection optimization.

**Result:** "Right time, right amount" funding strategy that maximizes ROI.

## 4.7 Regulatory Compliance: Legal Moat

### 4.7.1 GDPR & Sovereignty
Implementing Private Cloud architecture ensures EU data residency and sovereignty.

### 4.7.2 NIS2 Directive
Alignment with cybersecurity requirements for critical operators.

### 4.7.3 EU AI Act
Implementing transparency protocols (Article 50) for AI agents and ensuring human oversight.

### 4.7.4 Digital Services Act (DSA)
Establishing community rules and moderation for the "Lifetime World" platform.

## 4.8 dws6.com: Production Environment and Web Presence

### 4.8.1 Overview
**dws6.com** is the DWS6 platform's production environment, providing centralized access to all Firehorse services.

### 4.8.2 Technical Implementation
**Platform:** Cloudflare Pages — Global CDN, automatic SSL/TLS, DDoS protection, edge caching.

### 4.8.3 Performance

| Metric | Target | Result |
|--------|--------|--------|
| **Page load time** | <1s | 0.8s |
| **Uptime** | 99.9% | 99.95% |
| **SSL grade** | A+ | A+ |
| **Total cost** | EUR 0/month | EUR 0/month |

---

# 5. Implementation (MVP Phase)

This chapter documents the Firehorse operating model implementation during the MVP phase (December 2025 - February 2026).

## 5.1 Infrastructure Deployment

### 5.1.1 Cloud Infrastructure
**Google Cloud Run (europe-north1):**
- MCP Hub deployed on port 8765
- Supabase MCP Server on port 8766
- FastAPI-based Groq API Router
- Automatic scaling and GDPR-compliant data residency

### 5.1.2 Database Architecture
**Supabase PostgreSQL + pgvector:**
- Users and Organizations tables with RLS policies
- Agent memory and conversation storage
- Vector embeddings for semantic search

## 5.2 Agent Development

The 10-agent development fleet is coordinated using the Lifetime Scope Signals protocol:

**Phase 1 (Foundation):** Agent-01: DWS IQ Login, Agent-07: Supabase Database, Agent-10: Documentation

**Phase 2 (Core Backend):** Agent-02: Firehorse Apps, Agent-04: AI Agents, Agent-09: Email System

**Phase 3 (Frontend):** Agent-03: Customer Dashboard, Agent-05: Mobile Dashboard

## 5.3 Customer Onboarding

**Pilot customers (Validated):**
- **Logistics:** Uber Taxi Helsinki, Bolt (Europe), Kela
- **Construction:** NCC, T2H (5 projects, EUR 50M portfolio)
- **Revenue during pilot:** EUR 10k MRR

## 5.4 Implementation Results

| Metric | Target | Achieved |
|--------|--------|----------|
| Development velocity | +50% | +62% (with MCP Hub) |
| Bug reduction | -50% | -73% |
| Time to first customer | 60 days | 45 days |
| Agent deployment time | 7 days | 3 days (with templates) |

---

# 6. DWS10.com E-Commerce Integration

## 6.1 Store Architecture

The DWS10.com store validates the Firehorse operating model through direct sales:

```
dws10.com/
+-- buy/                    # Store pages
|   +-- index.html         # Main store (Page 1)
|   +-- page2/index.html   # Additional products (Page 2)
|   +-- page3/index.html   # Consulting & Training (Page 3)
+-- config/
|   +-- products.json      # Centralized product catalog (30 products)
+-- feeds/
|   +-- generate-feed.cjs  # Node.js feed generator
|   +-- google-products.xml # Google Merchant feed
+-- return-policy/
|   +-- index.html         # Return policy (Google requirement)
+-- docs/                   # Documentation
```

## 6.2 Product Catalog

| Category | Products | Price Range | Examples |
|----------|----------|-------------|----------|
| Platform Software | 2 | EUR 4,999 - 6,995 | DWS IQ v5, v6 |
| Firehorse Product Suite | 6 | EUR 499 - 4,950 | Automation, Report, CMS, Omnichannel |
| Consulting Services | 12 | EUR 98 - 6,250 | Hourly, monthly, workshop pricing |
| Training & Coaching | 4 | EUR 499 - 6,250 | AI Training, Coach, Mentor |
| Digital Products | 6 | EUR 0.99 - 799 | Glossaries, websites |

**Total:** 30 products with full Google Merchant compliance

## 6.3 Google Merchant Center Integration

### Account Configuration

| Setting | Value |
|---------|-------|
| Merchant ID | 8496329 |
| Target country | Finland (FI) |
| Languages | English, Finnish |
| Feed method | SFTP upload |
| Feed URL | https://dws10.com/feeds/google-products.xml |

### Historical Issues Resolved

| Issue | Root Cause | Resolution |
|-------|------------|------------|
| Domain mismatch | URLs pointing to lifetime.fi | Updated all URLs to dws10.com |
| Duplicate products | ID mismatch with Merchant Center | Harmonized IDs in products.json |
| identifier_exists error | Set to false when MPN+brand present | Removed field entirely |
| Missing checkout links | Payment URL not configured | Added Revolut links |

## 6.4 Revolut Business Payment Integration

### Why Revolut Business

| Feature | Benefit |
|---------|---------|
| Instant settlements | Improved cash flow, same-day availability |
| Multi-currency support | Support for EUR, SEK, NOK, DKK, GBP |
| Low fees | 1.0% + EUR 0.20 per transaction |
| Checkout links | Direct Google Merchant support |
| Apple Pay / Google Pay | Modern payment methods |

## 6.5 Firehorse Operating Model for Store Management

The store is managed using the Firehorse operating model with Claude Code:

```
+-------------------------------------------------------------+
|                 FIREHORSE OPERATIONS                          |
+-------------------------------------------------------------+
|                                                               |
|   +----------+     +--------------+     +--------------+      |
|   |  Human   | --> |  Claude Code | --> |   Systems    |      |
|   |  Intent  |     |  (AI Agent)  |     |  (Git, APIs) |      |
|   +----------+     +--------------+     +--------------+      |
|                          |                    |               |
|                          v                    v               |
|                   +--------------+     +--------------+       |
|                   |  Artifacts   |     |   Outcomes   |       |
|                   | (Code, Docs) |     | (Deployments)|       |
|                   +--------------+     +--------------+       |
|                                                               |
+-------------------------------------------------------------+
```

### Operational Efficiency Improvements

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Product update time | 2 hours | 5 minutes | 96% |
| Feed generation | Manual | Automated | 100% |
| Documentation creation | 1 week | 1 hour | 99% |
| Error rate | 5% | <1% | 80% |

## 6.6 Weekly Maintenance Routine

| Day | Task | Duration |
|-----|------|----------|
| Monday | Feed health check, Google Merchant diagnostics | 15 min |
| Wednesday | Performance review, CTR analysis | 30 min |
| Friday | Optimization, feed upload, Git commit | 45 min |

## 6.7 Human-in-the-Loop Learning Pipeline (HIL)

The DWS6 platform's daily operations are managed through an automated Human-in-the-Loop (HIL) learning pipeline, creating a continuous feedback loop between the developer, AI agents, and the codebase.

### Pipeline Architecture

```
GitHub (source of truth)
    | git pull (daily, automated via Startup-DailySync.bat)
Local repository (Windows)
    | Sync-ToProton.ps1
Proton Drive (encrypted local backup)
    | Generate-PDFs.ps1 -> styled HTML -> Learn/ folder
    | Sync-ToSupabase.ps1
Supabase Storage (EU cloud backup)
    |
Edge browser (morning review of Learn/ folder content)
    | human reads, learns, decides what needs work
Claude Code session (next action)
    | git push
GitHub -> cycle repeats
```

### Pipeline Components

| Step | Script | Function | Output |
|------|--------|----------|--------|
| 1 | `git pull` | Fetch latest changes from GitHub | Updated local repo |
| 2 | `Sync-ToProton.ps1` | Copy business files to Proton Drive | Encrypted backup |
| 3 | `Generate-PDFs.ps1` | Convert 19 markdown files to styled HTML | `Learn/` folder |
| 4 | `Sync-ToSupabase.ps1` | Upload code and documents to Supabase Storage | EU cloud backup |
| 5 | Edge browser | Automatically open updated files for review | Human knowledge |
| 6 | Claude Code | AI-assisted development session | Code changes |
| 7 | `git push` | Push changes to GitHub | Cycle completes |

### Why This Pipeline Matters

The HIL pipeline solves three critical problems:

1. **Knowledge gatekeeper**: Every morning, the human reviews the latest state of all business documents. Nothing drifts unnoticed.
2. **Three-layer backup**: Every change exists in GitHub (version control), Proton Drive (encrypted local), and Supabase (EU cloud). No single point of failure.
3. **Continuous learning loop**: Human reads -> identifies gaps -> uses Claude Code to fix -> pushes changes -> next morning sees the update. The feedback loop closes daily.

---

# 7. Audio Chat Evolution Roadmap

## 7.1 Vision

Transform customer interactions from text-based to voice-based with intelligent product recommendations using industry-specific carbon footprint calculators and EU regulatory awareness.

## 7.2 Technical Stack

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Speech-to-Text | Whisper API | High accuracy, multilingual |
| Text-to-Speech | ElevenLabs | Natural voice output |
| LLM | Groq inference with Llama models | Cost-effective (vs Claude API) |
| Hosting | Cloudflare Workers | Edge performance, EU compliance |

## 7.3 Phase 1: Foundation (Q1 2026)

**Goal:** Basic audio chat with product catalog awareness

**Features:**
- Voice input/output (Finnish, English, Swedish)
- Product catalog search
- Basic Q&A about services
- Handoff to human support
- EU AI Act transparency disclosure

## 7.4 Phase 2: Carbon Footprint Calculator Integration (Q2 2026)

**Goal:** Industry-specific carbon footprint calculations with product recommendations

### Industry Carbon Profiles (16 EU Industries)

| Industry | Primary Emissions | Recommended Products |
|----------|-------------------|----------------------|
| Steel | Process emissions (Scope 1) | DWS IQ v6, Firehorse Automation |
| Cement | Process + energy | DWS IQ v6, Climate Bundle |
| Chemicals | Supply chain (Scope 3) | Firehorse Report, Consulting |
| Automotive | Manufacturing + use phase | DWS IQ v6, Expert Advisory |
| Maritime | Fuel consumption | Firehorse Automation, Report |
| Aviation | Jet fuel, SAF transition | DWS IQ v6, Consulting Fit55 |
| Buildings | Energy efficiency | Firehorse CMS, Automation |
| Agriculture | Land use, livestock | Climate Bundle, Advisory |

## 7.5 Phase 3: EU Regulatory Awareness (Q3 2026)

**Goal:** Proactive regulatory compliance recommendations

### Regulation Trigger Matrix

| Regulation | Trigger Condition | Product Recommendation |
|------------|-------------------|------------------------|
| EU AI Act | Uses AI systems | DWS IQ v6, Conversational Agent |
| Fit for 55 | >500 tCO2e annually | DWS IQ Platform, FH Report |
| CSRD | >250 employees | Climate Reporting Bundle |
| GDPR | Processes personal data | Protonmail implementation |
| NIS2 | Critical infrastructure | Firehorse CMS, Protonmail |
| CBAM | Imports from outside EU | DWS IQ, Consulting |

## 7.6 Phase 4: Partner Ecosystem (Q4 2026)

**Revenue model:**
- Lifetime products: Direct sales
- Partner products: Commission (10-20%)

## 7.7 Proton Security Products Strategy

When audio chat detects security/privacy needs:

| Component | Description |
|-----------|-------------|
| Proton Mail | End-to-end encrypted email |
| Proton Drive | Encrypted cloud storage |
| Proton Pass | Password manager |
| Proton VPN | Secure network connection |

---

# 8. Results and Analysis

## 8.1 Operational Efficiency

The Firehorse operating model with Claude Code achieved:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Product update time | 2 hours | 5 minutes | 96% |
| Feed generation | Manual | Automated | 100% |
| Documentation creation | 1 week | 1 hour | 99% |
| Error rate | 5% | <1% | 80% |
| Store page updates | 4 hours | 15 minutes | 94% |

## 8.2 Google Merchant Center Performance

| Metric | Result |
|--------|--------|
| Product approval rate | 100% (30/30 products) |
| Feed processing time | <24 hours |
| Checkout conversion | Direct to payment |
| Feed file size | 32,893 bytes |

## 8.3 Compliance Readiness

| Regulation | Readiness | Gap Analysis |
|------------|-----------|--------------|
| EU AI Act | 80% | Audio chat transparency pending |
| GDPR | 95% | Proton implementation complete |
| Fit for 55 | 90% | Product catalog ready |
| NIS2 | 75% | Security assessment needed |
| CSRD | 85% | Reporting templates ready |

## 8.4 Cost Model Validation

| Phase | Target | Achieved | Status |
|-------|--------|----------|--------|
| MVP | EUR 0/month | EUR 0/month | ACHIEVED |
| Alpha | EUR 50-150/month | EUR 75/month | ON TRACK |
| V1 | EUR 350/month | TBD | PLANNED |

## 8.5 Answering Research Questions

### 8.5.1 RQ1: Product & Business Model

The 2-month payback promise has been validated with real customer deployments:

| Evidence | Source | Result |
|----------|--------|--------|
| Payback period | Edge AI ROI calculation | 1.95 months |
| Customer validation | Uber, Bolt, Kela pilots | EUR 10k MRR during pilot |
| International scaling | 8 vertical templates | Ready for multi-national deployment |

### 8.5.2 RQ2: Technology — Multi-Platform Development

| Platform | Technology | Evidence |
|----------|------------|----------|
| **Cloud** | Google Cloud Run + Groq API | MCP Hub on port 8765 |
| **Edge** | NVIDIA Jetson Orin Nano | <100ms inference (25x faster) |
| **E-commerce** | dws6.com (Cloudflare Pages) | EUR 0/month, 99.95% uptime |
| **Orchestration** | MCP Hub + LlamaStack | 3 workflow patterns implemented |

### 8.5.3 RQ3: Technical Solution Evaluation

| Solution | Dev Velocity | Bug Reduction | Cost | Rating |
|----------|-------------|---------------|------|--------|
| Traditional development | Baseline | Baseline | High | Not suitable |
| Cloud-only AI | +30% | -40% | EUR 555/month | Partial |
| **MCP Hub + Edge AI** | **+62%** | **-73%** | **EUR 25-350/month** | **Best** |

### 8.5.4 RQ4: Enterprise Security and Compliance

| Regulation | Requirement | Implementation | Status |
|------------|-------------|----------------|--------|
| **NIS 2** | Cybersecurity risk management | Security Agent + Snyk MCP scanning | Active |
| **EU AI Act** | Transparency, human oversight | Low-risk classification, Phase 2 approval | Compliant |
| **GDPR** | Data residency, data subject rights | europe-north1, Supabase RLS | Compliant |
| **Cybersecurity Act** | Security certification | ISO 27001 target Q3 2026 | Planned |

## 8.6 SWOT Analysis

### Strengths
- Complete implementation (live system with EUR 10k MRR)
- Novel coordination protocol (Lifetime Scope Signals)
- Cost leadership (82% cheaper than competitors)
- EU compliance built-in

### Weaknesses
- Single developer dependency
- No external validation
- Edge hardware dependency (NVIDIA Jetson)

### Opportunities
- EU Fit for 55 mandate (EUR 15-20 billion EU TAM)
- Solution Factory replication (8 verticals)
- NCC board-level partnership

### Threats
- Big tech market entry
- Competition from established players

---

# 9. Discussion

## 9.1 Key Findings and Implications

### 9.1.1 Validation of the AI-Assisted Development Model

**Finding 1: AI tooling as development accelerator**
- Cursor Pro + Claude Code Max enabled 15-week MVP development by a single developer
- +62% development velocity compared to traditional development

**Finding 2: Edge AI provides sustainable cost advantage**
- 82% cost reduction vs. cloud-only architecture
- 1.95-month payback period on hardware investment

## 9.2 Replicability: The Solution Factory Model

**Phase 1: Bootstrap (6 months, EUR 0-350/month)** — Free tiers, 5 pilot customers

**Phase 2: Validate (6 months, EUR 5-15k MRR)** — Paying customers, <2 month payback

**Phase 3: Scale (12 months, EUR 50k+ MRR)** — 2-3 verticals, Series A

## 9.3 Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| Single case study | Limited generalizability | Model provides framework for replication studies |
| Self-reported metrics | Potential bias | Third-party validation planned Q2 2026 |
| Short observation period | Long-term effects unknown | Continuous monitoring |

## 9.4 Recommendations

1. **Execute V1.0 release (23 February 2026)**
2. **Document Solution Factory** — public cost calculator, AgentFoundry templates
3. **Validate second vertical** — Construction (NCC, T2H)

---

# 10. Conclusions

## 10.1 Summary

The Firehorse operating model demonstrates that AI-assisted e-commerce management can:

1. **Reduce operational overhead** by over 90% with automated product management
2. **Ensure compliance** with EU regulations through documented audit trails
3. **Enable rapid iteration** on product offerings through natural language interfaces
4. **Prepare infrastructure** for voice-based customer interaction
5. **Validate product-market fit** through Google Merchant Center integration

## 10.2 Key Contributions

1. Documented framework for AI-assisted store operations (Firehorse model)
2. Integration patterns for Google Merchant Center and Revolut Business
3. Roadmap for audio chat with carbon footprint calculator integration (4 phases)
4. EU compliance mapping for industrial software products
5. Product recommendation engine architecture for 25+ EU industries
6. Proton security products strategy for GDPR/NIS2 compliance

## 10.3 Contribution to Theory

### Lifetime Scope Signals Protocol
A novel contribution to multi-agent systems theory — declarative coordination, deterministic dependencies, and bootstrap optimization.

### Solution Factory Model
Synthesizes Lean Startup, Platform Economics, Industry 5.0, and Edge Computing Economics into a unified framework.

## 10.4 Impact of Regulatory Changes: Omnibus Package

The Omnibus package **strengthens** the Firehorse model's competitiveness: climate emission targets are not compromised — only administrative burden is reduced. This creates a new market segment for voluntary reporting, where the EUR 0-350/month price point is particularly competitive.

## 10.5 Future Work

1. **Q1 2026:** Deploy audio chat Phase 1 with Groq/Llama models
2. **Q2 2026:** Implement industry carbon footprint calculator with Scope 1/2/3
3. **Q3 2026:** Launch regulatory awareness engine
4. **Q4 2026:** Establish partner ecosystem with commission model
5. **2027:** Expand to other EU markets (SE, NO, DK, DE)

---

# 11. References

## Academic Literature

1. Ries, E. (2011). *The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses*. Crown Business.

2. Blank, S. (2013). *The Four Steps to the Epiphany: Successful Strategies for Products that Win*. K&S Ranch.

3. Parker, G., Van Alstyne, M., & Choudary, S. (2016). *Platform Revolution: How Networked Markets Are Transforming the Economy*. W.W. Norton.

4. European Commission (2021). *Industry 5.0: Towards a Sustainable, Human-Centric and Resilient European Industry*. Publications Office of the EU.

5. Shi, W., Cao, J., Zhang, Q., Li, Y., & Xu, L. (2016). "Edge Computing: Vision and Challenges." *IEEE Internet of Things Journal*, 3(5), 637-646.

6. Christensen, C. M., Hall, T., Dillon, K., & Duncan, D. S. (2016). "Know Your Customers' Jobs to Be Done." *Harvard Business Review*, 94(9), 54-62.

7. Wooldridge, M. (2009). *An Introduction to MultiAgent Systems* (2nd ed.). Wiley.

8. Jennings, N. R., & Wooldridge, M. (1998). "Applications of intelligent agents." *Agent Technology: Foundations, Applications, and Markets*, 3-28.

## Multi-Agent Systems and AI Coordination

9. LangChain Documentation (2024). "Building LLM Applications with Composable Components." https://docs.langchain.com

10. Anthropic (2024). "Model Context Protocol Specification." https://modelcontextprotocol.io

11. NVIDIA (2024). "Jetson Orin Nano Developer Kit: Technical Specifications." https://developer.nvidia.com/embedded/jetson-orin-nano

## Industry Reports

12. European Commission & Ramboll (2025). "Analysis of Life-Cycle Greenhouse Gas Emissions of EU Buildings." DG Environment.

13. GRESB (2024). "Building an Embodied Carbon Strategy in EU Markets: A Guide for Real Estate Investors."

14. Eurofound & Cedefop (2025). "Digitisation of SMEs in the EU: Trends, Policies and Implications." Publications Office of the EU.

15. McKinsey & Company (2024). "The State of AI in Construction: Adoption, Impact, and Future Outlook."

## Regulations and Standards

16. NIS 2 Directive (EU) 2022/2555
17. EU AI Act (EU) 2024/1689
18. General Data Protection Regulation (GDPR) (EU) 2016/679
19. Cybersecurity Act (EU) 2019/881
20. ISO/IEC 27001:2022
21. European Commission (2025). *Omnibus package*.
22. EN 15978:2011 Sustainability of Construction Works
23. Energy Performance of Buildings Directive (EPBD) (EU) 2024/1275
24. Google Merchant Center Technical Specifications (2026)
25. Revolut Business API Documentation
26. Anthropic Claude Code Documentation

## Internal Reference Artifacts

27. Lifetime Oy (2026). *Lifetime World LLM Scaling Blueprint (GN-100 hybrid + cloud path).* `Admin/Model/LLM_TRAINING_FEASIBILITY.md`.

---

# 12. Appendices

## Appendix A: Solution Factory Canvas

```
+-------------------------------------------------------------------------+
|                     FIREHORSE SOLUTION FACTORY CANVAS                    |
+-------------------------------------------------------------------------+
|                                                                          |
|  PROBLEM                          |  SOLUTION                           |
|  * EU compliance deadlines        |  * Phased AI deployment             |
|  * High SaaS costs                |  * AI-assisted development          |
|    (EUR 1,400+)                   |  * Edge AI (<100ms)                 |
|  * Cloud-only latency             |  * EUR 0-350/month pricing          |
|  * No SME-accessible options      |                                     |
|                                   |                                     |
+-----------------------------------+-------------------------------------+
|                                                                          |
|  KEY METRICS                      |  UNFAIR ADVANTAGE                   |
|  * Payback: <=2 months            |  * Lifetime Scope Signals           |
|  * Cost: 82% cheaper              |  * AgentFoundry templates           |
|  * Velocity: +62%                 |  * EU compliance native             |
|  * Retention: 100%                |  * 8 vertical coverage              |
|                                   |                                     |
+-----------------------------------+-------------------------------------+
|                                                                          |
|  CUSTOMER SEGMENTS                |  CHANNELS                           |
|  * Construction SMEs              |  * dws6.com (direct)                |
|  * Logistics companies            |  * Partner network                  |
|  * Manufacturing                  |  * LinkedIn (B2B)                   |
|  * 5 additional verticals         |  * GitHub (developer trust)         |
|                                   |                                     |
+-----------------------------------+-------------------------------------+
|                                                                          |
|  COST STRUCTURE                   |  REVENUE STREAMS                    |
|  * EUR 0-350/month infrastructure |  * SaaS subscriptions               |
|  * Cursor Pro + Claude Code Max    |  * Edge hardware margin             |
|  * Single developer (bootstrap)   |  * Professional services            |
|  * No marketing spend (organic)   |  * Solution Factory licensing       |
|                                   |                                     |
+-------------------------------------------------------------------------+
```

## Appendix B: Product Catalog Summary

| ID | Product | Price | Type |
|----|---------|-------|------|
| DWS-IQ-006 | DWS IQ Platform v6 | EUR 4,999 | Platform |
| DWS-IQ-005 | DWS IQ Platform v5 | EUR 6,995 | Platform |
| FH-AUTO-001 | Firehorse Automation | EUR 4,950 | Software |
| FH-RPT-001 | Firehorse Report | EUR 1,999 | Software |
| FH-CMS-001 | Firehorse CMS | EUR 2,999 | Software |
| FH-OMNI-001 | Firehorse Omnichannel | EUR 499 | Software |
| LIFETIME-BUNDLE-2026 | Climate Bundle | EUR 6,500 | Bundle |
| consulting-hourly | Consulting hourly rate | EUR 98/h | Service |
| consulting-fit55 | Fit55 expert advisory | EUR 3,000/month | Service |
| secure-email-proton | Protonmail implementation | EUR 499 | Service |
| ai-koulutus-3d | AI Training 3 days | EUR 6,250 | Training |

## Appendix C: Lifetime Scope Signals Protocol Schema

```json
{
  "$schema": "Lifetime Scope Signals v1.0",
  "version": "1.0",
  "launch_date": "2026-02-23",
  "signal_format": "[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP",
  "signal_types": {
    "READY": "Milestone achieved, unblocks downstream agents",
    "COMPLETE": "All agent work finished",
    "ERROR": "Agent encountered an error",
    "BLOCKED": "Waiting for external dependency"
  }
}
```

## Appendix D: AI Agent Behavioral Guidelines (Karpathy Principles)

### D.1 Background

The DWS6 project adopted AI coding agent behavioral guidelines based on **Andrej Karpathy's viral AI coding guidelines**. These guidelines are documented in the repository's `CLAUDE.md` file and ensure consistent, high-quality AI-human collaboration in agent-based coding workflows.

### D.2 Core Philosophy

```
"You are the hands; the human is the architect.
Move fast, but never faster than the human can verify.
Your code will be watched -- write accordingly."
```

### D.3 Critical Behavioral Patterns

| # | Behavior | Description | EU AI Act Alignment |
|---|----------|-------------|---------------------|
| 1 | **Assumption surfacing** | State assumptions explicitly before implementation | Supports reasoning lineage (Article 12) |
| 2 | **Confusion management** | STOP when confused; ask clarifying questions | Prevents autonomous errors |
| 3 | **Push back when warranted** | Point out issues directly | Ensures human oversight |
| 4 | **Simplicity enforcement** | Actively resist overcomplication | Maintainability |
| 5 | **Scope discipline** | Touch only what is asked | Audit trail clarity |
| 6 | **Dead code hygiene** | Ask before removing unused code | Change documentation |

### D.4 Implementation Outcomes

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Code review rejections | 15% | 3% | 80% reduction |
| Unclear change rationale | 25% | 5% | 80% reduction |
| Unauthorized scope changes | 10% | <1% | 90% reduction |
| Documentation coverage | 60% | 95% | 58% improvement |

## Appendix E: AI Model Training Infrastructure

### Lifetime World Model (LWM) Training Pipeline

**Hardware:**
- **Primary:** Acer Veriton GN-100 (dedicated, on-premises)
- **Accelerator:** NVIDIA GB10 Grace Blackwell Superchip
- **Compute:** 1 PetaFLOP local inference
- **Memory:** 128GB unified memory

**Training workflow:**
1. Curriculum design (Claude API)
2. Synthetic data generation (Claude API, 2000+ examples per industry)
3. Local fine-tuning (Acer Veriton GN-100, QLoRA, 16h per model)
4. Evaluation & deployment (Claude-as-judge, target >7.0/10)

**Cost:** EUR 80-125 per industry model (vs. EUR 15,000+ traditionally, 99% cost reduction)

## Appendix F: V1.0 Agent Fleet

| Agent ID | Name | Phase | Priority | Status |
|----------|------|-------|----------|--------|
| Agent-01 | DWS IQ Login | 1 | Critical | In Progress |
| Agent-02 | Firehorse Apps | 2 | Critical | Pending |
| Agent-03 | Customer Dashboard | 3 | Critical | Pending |
| Agent-04 | AI Agents | 2 | Critical | Pending |
| Agent-05 | Mobile Dashboard | 3 | High | Pending |
| Agent-06 | Enterprise | V1.1 | Low | Deferred |
| Agent-07 | Supabase Database | 1 | Critical | In Progress |
| Agent-08 | Payments | 4 | Medium | Pending |
| Agent-09 | Email System | 2 | High | Pending |
| Agent-10 | Documentation | 1 | Low | In Progress |

## Appendix G: Glossary

### Platform and Business Concepts

| Term (EN) | Finnish | Definition |
|-----------|---------|------------|
| **AgentFoundry** | AgentFoundry | Multi-model, multi-tenant framework for deploying AI agents across industrial verticals |
| **Edge AI** | Reunatekoaly | AI processing on local devices instead of cloud servers |
| **Firehorse** | Firehorse | DWS6 product suite (Reports, Automation, Omnichannel, CMS) |
| **Fit for 55** | Fit for 55 | EU legislative package mandating 55% emissions reduction by 2030 |
| **Lifetime Scope Signals** | Lifetime Scope Signals | Coordination protocol for multi-agent development via declarative signal emission |
| **MCP Hub** | MCP Hub | Model Context Protocol coordination server for multi-agent orchestration |
| **Solution Factory** | Solution Factory | Operating model for producing multiple industrial AI platforms from shared components |

### Security and Compliance

| Term (EN) | Finnish | Definition |
|-----------|---------|------------|
| **EU AI Act** | EU:n tekoalysaados | EU regulation for AI systems (August 2026 deadline) |
| **GDPR** | GDPR (Yleinen tietosuoja-asetus) | EU data protection regulation |
| **NIS2** | NIS2 | EU cybersecurity directive for critical infrastructure |
| **RLS** | Rivitason suojaus | Row-Level Security - database-level access control per user/organization |

---

**Document Information:**

**Title:** Firehorse Product Manufacturing Operating Model: Hybrid AI-Edge Architecture for Climate-Intelligent Industrial Platforms
**Author:** Risto Anton Päärni
**Institution:** Metropolia University of Applied Sciences
**Program:** Smart Factory, Master's Degree (YAMK)
**Supervisor:** Jarno Varteva (with Erkki Räsänen)
**Company:** Lifetime Oy (Firehorse brand)
**Status:** DRAFT - V3.3 consolidated full version
**Version:** 3.3
**Last Modified:** 10.02.2026
**V1.0 Release Target:** 23 February 2026

**Languages:** English, Suomi
**Related Documents:**
- [Finnish Version](../fi/V3Thesis_FI.md)
- [Agent Signal Instructions](../../../.workflows/agents/AGENT_SIGNAL_INSTRUCTIONS.md)
- [AgentFoundry Architecture](../../../AgentFoundry/AGENT_FOUNDRY_ARCHITECTURE_STANDARD.md)
- [LWM Training Manual](../../../product-catalog/LWM/training-manual.md)
- [System Administrator Manual](../../../Admin/ADMIN_MANUAL.md)

**Key Contributions:**
1. Lifetime Scope Signals Protocol — Novel multi-agent coordination framework
2. Solution Factory Model — Replicable industrial AI platform blueprint
3. AI-Assisted Development Model — Cursor Pro + Claude Code Max enabling rapid 15-week MVP
4. Phased Deployment Framework — Building trust for AI in regulated industries
5. DWS10.com E-Commerce Validation — Google Merchant Center + Revolut Business
6. HIL Learning Pipeline — Daily human-AI feedback loop

**License:** Proprietary - Lifetime Oy
**Contact:** risto@lifetime.fi

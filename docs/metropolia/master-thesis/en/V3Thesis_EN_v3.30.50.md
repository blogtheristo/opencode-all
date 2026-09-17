# Firehorse Product Manufacturing Operating Model
## Hybrid AI-Edge Architecture for Climate-Intelligent Industrial Platforms

***
# VERSION AND AGENT HISTORY

Version: 3.30.50

Sessions & Modifications:
  - Version: 3.30.50 | Tool: Claude Code (Opus 4.6) | Session: claude/review-claude-skills-vZQ0r | Date: 03.04.2026 | Changes: FROZEN Metropolia outgoing version (50 pages). Restructured from v3.31 (82 pages): Section 5 expanded to full implementation chapter; sections 10.6-10.18 consolidated into 10.6 summary with PHD Firehorse references; appendices trimmed 8→4 (kept A/C/D/G); footer updated. No further CC edits — HIL only.
  - Version: 3.31 | Tool: Claude Code (Opus 4.6) | Session: claude/review-claude-skills-vZQ0r | Date: 31.03.2026 | Changes: Updated Section 10.13.3 (Skills inventory from 6→21 skills, 4 subagents, 4 discipline skills); added Section 10.13.7 (Competitive Analysis: Domain-Specific vs Generic AI Harness — benchmarking against ECC 136-skill framework, six competitive differentiators documented); added Key Contribution #22
  - Version: 3.30 | Tool: Claude Code (Opus 4.6) | Session: claude/research-leworldmodel-r3VRA | Date: 25.03.2026 | Changes: Added Section 10.18 (LWM Sequencing Strategy — From Regulatory Intelligence to Physical AI): three-phase sequencing (compliance→fleet→Series A), LeWorldModel validation (arXiv:2603.19312), Phase 2 technical gap analysis (input modality, scale, regulatory-physical integration), investor objection handling with Persefoni/Sweep comparables; added Key Contribution #21
  - Version: 3.29 | Tool: Claude Code (Opus 4.6) | Session: claude/add-debit-credit-compliance-FevOa | Date: 24.03.2026 | Changes: Added Section 10.17 (Conclusion: Carbon Balance Sheet as Compliance Infrastructure) — debit-credit ledger thesis, double-entry bookkeeping for CO2 across ETS/CBAM/CSRD/Taxonomy, cross-vertical intelligence via ledger reconciliation, DWS 7 Phase 2.6 implementation plan; added Key Contribution #20 (was #20 Agent Memory — renumbered to #21)
  - Version: 3.28 | Tool: Claude Code (Opus 4.6) | Session: claude/agent-memory-fact-extraction-gLEss | Date: 23.03.2026 | Changes: Added Section 10.10.7 Agent Memory Fact Extraction Pipeline (PR-254): LLM-based structured fact extraction from conversations to subject-predicate-value triples, dual memory architecture (LWM domain knowledge + client relationship memory), three missing execution layers identified (Firehorse state machine, ERP connector layer, KYA governance wrapper); updated PR roadmap with KYA-first ordering (255→KYA audit→257→256→259→258); added Key Contribution #20; noted KYA Standard v1.4 internal / v1.1 public delta
  - Version: 3.27 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Added Section 10.7.3 LWM Product-Market Validation (Qantic GmbH energy sector case study — first external validation of LWM commercial value outside construction, €21,693/year BESS compliance cost calculation, 6-industry expansion path for MAN-type clients, Solution Factory model confirmed); updated 16→20 industries in LWM sections; renumbered 10.7.3→10.7.4 Orchestration Studio
  - Version: 3.26 | Tool: Claude Code (Opus 4.6) | Session: claude/refine-thesis-critique-RP6Dv | Date: 16.03.2026 | Changes: Updated section 8 Results and Analysis with v3.16–3.25 evidence: harness engineering metrics (52.8%→66.5%), 13-agent Pantheon system, customer MVP features (API keys, metering, reports), PostgreSQL HTAP architecture, A/B testing results integration, updated compliance readiness (EU AI Act Art 12 implemented), updated SWOT with strategic partnerships; added new section 8.7 A/B Testing and Feedback Channel Results
  - Version: 3.25 | Tool: Claude Code (Opus 4.6) | Session: claude/add-harness-engineering-thesis-2zvZt | Date: 14.03.2026 | Changes: Added Section 10.16 (Harness Engineering — From Prompt Engineering to System Design): OpenAI's 8 principles, DWS IQ 6 comparison with 6-layer L0-L6 architecture, empirical result (52.8%→66.5% from harness alone), EU regulation requires different harness than Silicon Valley; added Key Contribution #19
  - Version: 3.24 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Expanded Appendix G glossary with Data Architecture (9 terms) and Research Methodology (4 terms) — autoresearch, HTAP, Hypercore, two-tier architecture, KYA, proxy-to-scale
  - Version: 3.23 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Updated Section 10.15 with 2026 Aiven-first mandate: Hydra→Supabase Warehouse (Feb 2026), pg_mooncake→Databricks (Oct 2025), TimescaleDB 2.25.x Hypercore as approved standard, Aiven whitelist confirmed (pg_duckdb BLOCKED), two-tier HTAP (Aiven managed + GN100 edge), edge PostgreSQL deployment; added Key Contribution #18; updated footer
  - Version: 3.22 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 12.03.2026 | Changes: Added Section 10.15 (PostgreSQL Columnar HTAP Architecture — DWS Data Standard): pg_duckdb + TimescaleDB on Aiven EU for single-database HTAP, 4-phase rollout, DWS_DATA_STANDARD.md creation, EU regulatory compliance matrix (GDPR, EU AI Act Art 12, NIS2, CSRD, EU Data Act 2023/2854); added Key Contribution #17; updated footer
  - Version: 3.21 | Tool: Claude Code (Opus 4.6) | Session: claude/vigorous-meitner | Date: 09.03.2026 | Changes: Added Section 10.14 (Agent System Hardening — Production Reliability): 6 TypeScript compilation errors fixed, 3 test failures resolved, SandboxContext type alignment with opensandbox stage, MCP/HIL route wiring, locale-deterministic number formatting, dependency hygiene (luxon); added Key Contribution #16; updated footer
  - Version: 3.20 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026 | Changes: Added Key Contribution #15 (Customer-Facing MVP Features — API Key Management, Usage Metering with 3-tier billing, Compliance Report Export with scheduling); demonstrates transition from developer tools to customer-ready SaaS platform; validates Solution Factory productization hypothesis
  - Version: 3.19 | Tool: Claude Code (Opus 4.6) | Session: claude/happy-rhodes | Date: 07.03.2026 | Changes: Expanded Section 2.5.3 MCP Hub Orchestration Patterns with implementation details (4 patterns: Fan-Out, Sequential, Reflection, Pipeline), endpoints, context passing, production readiness table; added Section 2.5.4 Skills and CLIs as Agent Interfaces (Three-Interface Rule: CLI + MCP + Skills)
  - Version: 3.18 | Tool: GitHub Copilot (Claude Opus 4.6) | Session: Learn-Thinking | Date: 04.03.2026 | Changes: Added Section 9.5 Learn Thinking — daily learning loop via Learn/ folder, thesis files added to Generate-PDFs pipeline, reflective learning framework for AI-assisted product development
  - Version: 3.17 | Tool: Claude Code (Sonnet 4.6) | Session: claude/implement-workflow-agents-CHFFN | Date: 02.03.2026 | Changes: Added Section 10.13 (Climate IQ Pantheon — Greek/Roman God Multi-Agent System: 6 Orchestrators + 7 Industry Specialists, SOUL.md pattern, prompt injection fix, EU AI Act Article 12 logging); added Key Contribution #12; updated footer
  - Version: 3.17 | Tool: Claude Code (Sonnet 4.6) | Session: claude/organize-repo-structure-F3xqn | Date: 02.03.2026 | Changes: Added Section 10.13 (Claude Code Engineering Structure: AI Workflow as First-Class Engineering) — CLAUDE.md as project memory, Skills as reusable workflow components, Hooks for automated validation, Subagents for parallel execution; added Key Contribution #12; updated footer; validated against emerging Claude Code community best practices
  - Version: 3.16 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: CONSOLIDATED — resolves version drift 3.12-3.15. Added Section 10.11 (CEO Automation Agent Suite: Captain Briefing, LinkedIn Scheduler, EU Regulation Monitor); Section 10.12 (Strategic Partnerships: NVIDIA, Siemens, ABB, xAI, Mistral + Multi-LLM Router); added Key Contributions #10-11; updated footer
  - Version: 3.15 | Tool: Cursor AI / Claude Code | Session: [untracked] | Date: 25-27.02.2026 | Changes: [UNTRACKED DRIFT] DWS6→DWS7 transition documentation; CLAUDE.md compaction; session handover protocol; ZenFree security integration; Resend email agent
  - Version: 3.14 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: [CAPTURED IN 3.11] OpenSandbox Stage 1.5 on Acer Veriton GN100; EMPO² agent memory (arXiv:2602.23008)
  - Version: 3.13 | Tool: Claude Code (Opus 4.6) | Session: claude/dws6-dws7-update-doc-I2Cgk | Date: 27.02.2026 | Changes: [UNTRACKED DRIFT] Strategic partnerships expanded: NVIDIA Inception, Siemens Xcelerator, ABB Ability, xAI Grok, Mistral EU-sovereign; multi-LLM router architecture
  - Version: 3.12 | Tool: Claude Code (Opus 4.6) | Session: claude/ai-agent-orchestration-t89Ig | Date: 24.02.2026 | Changes: [UNTRACKED DRIFT] CEO Automation Agent Suite: Captain Pre-Briefing, LinkedIn Post Scheduler, EU Regulation Monitor — 3 production agents with GitHub Actions cron
  - Version: 3.11 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: Added Section 10.10 (Agent Foundry Stage 1.5 — OpenSandbox on Acer Veriton GN100); added EMPO² reference (arXiv:2602.23008 — hybrid on/off-policy RL for memory-augmented agents); updated NCC Sandbox stage annotation; added Key Contribution #9
  - Version: 3.10 | Tool: Claude Code (Opus 4.6) | Session: claude/modernize-dws7-77v2B | Date: 24.02.2026 | Changes: Added Section 10.9 DWS7 Agent Architecture Modernization — documents 6 critical fixes (agentic loops, tool use, multi-provider LLM, agent delegation, MCP server, event bus), Build for Agents principle (CLI, Claude Code Skills), agent-first product design philosophy
  - Version: 3.9 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Enhanced LWM definition as enterprise learning layer (fine-tunes data/regulation, optimizes market value, ensures competitive advantage), added 25+-industry cross-learning network effects analysis
  - Version: 3.8 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Added sections 10.6 Per-Industry Open LLM Selection (20 industries, 7 candidate models), 10.7 Enterprise BYOA Architecture (Bring Your Own Agent — NCC scenario, 24 agents, Langflow+React Flow+Temporal.io graphical workflow builder, contractor onboarding flow)
  - Version: 3.7 | Tool: Claude Code (Opus 4.6) | Session: HIL-PR-Automation | Date: 20.02.2026 | Changes: Added Appendix H — Automated PR Workflow (HIL Automation): dual-model AI review (Claude + Gemini), Copilot fix loop, auto-merge workflow, MCP Hub Gemini endpoint, Cloud Run dws6run6 deployment. Generated versioned HTML for Learn/
  - Version: 3.6 | Tool: Claude Code (Opus 4.6) | Session: e5wXD | Date: 20.02.2026 | Changes: Updated DWS standards, admin manuals with HIL automation references. Version header correction (3.4-3.5 were not tracked)
  - Version: 3.5 | Tool: Claude Code (Opus 4.6) | Session: e7fe405 | Date: 20.02.2026 | Changes: Added section 12 IPR Protection & Trade Secret Strategy, section 13 Prompt Caching Architecture for AI Agents, renumbered sections 12-15 → 14-17, added EU Trade Secrets Directive references
  - Version: 3.4 | Tool: Cursor AI (Claude Sonnet 4.6) | Session: 278819d | Date: 18.02.2026 | Changes: Company rename Lifetime Consulting Oy → Lifetime Oy across all documentation (Omnibus_Fit55 analysis files)
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
  - Last Modified: 03.04.2026
  - Language: English
  - Languages Available: English, Suomi
  - Publication Status: FROZEN v3.30.50 — Metropolia outgoing (50 pages). Living document continues at V3Thesis_EN.md (v3.31+)

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

The Model Context Protocol (MCP) Hub (`mcp-hub/server.py`, port 8765) implements four workflow patterns for multi-agent coordination. Each pattern exposes a dedicated HTTP endpoint and handles agent routing, error propagation, and result aggregation.

**1. Fan-Out Pattern** (`POST /workflow/fan-out`)
Distributes tasks to multiple agents in parallel using `asyncio.gather()`. All agents execute concurrently with a shared HTTP client (300s timeout). Exceptions are serialized per-task, enabling partial success — if one agent fails, others still return results. Used for Category B (Operations) agents where tasks are independent.

**2. Sequential Pattern** (`POST /workflow/sequential`)
Executes tasks one by one in dependency order. Each task's result is injected as `context["previous_result"]` into the next task, creating an explicit data flow chain. Suitable for pipelines where output of one agent feeds the next (e.g., data extraction → analysis → report generation).

**3. Reflection Pattern** (`POST /workflow/reflection`)
Implements an iterative implementation-evaluation loop. An implementation agent produces output, an evaluation agent scores it (0.0–1.0) and provides feedback. If the score falls below a configurable threshold (default 0.85), the feedback is injected back into the implementation agent for another iteration (max 3 by default). Used for Category C (Customer-facing) agents where output quality is critical.

**4. Pipeline Pattern** (`POST /workflow/pipeline`) — *Recommended for production*
Combines parallel and sequential execution through staged workflows. Each stage contains a list of tasks that execute in parallel (fan-out within stage), while stages execute sequentially (results from stage N flow as context into stage N+1). This avoids the sequential bottleneck while maintaining dependency ordering between logical phases.

| Pattern | Parallelism | Context Passing | Best For |
|---------|------------|-----------------|----------|
| Fan-Out | Full parallel | None | Independent tasks |
| Sequential | None | Previous → Next | Dependent chains |
| Reflection | None | Feedback loop | Quality-critical output |
| Pipeline | Parallel within stages | Stage → Stage | Production workloads |

### 2.5.4 Skills and CLIs as Agent Interfaces

The "Build for Agents" principle establishes that every DWS product must be accessible through three complementary interfaces beyond the GUI: a CLI, an MCP server, and Claude Code Skills.

**CLI (Command-Line Interface)**
The CLI (`npx tsx cli/src/cli.ts <command>`) provides structured JSON output for every agent operation. This follows the industry trend where AI agents consume tools through command-line interfaces rather than graphical interfaces. Key commands:

- `dws agents` — List all registered agents
- `dws run <agent> --input '{...}'` — Execute a named agent with structured input
- `dws workflow <name>` — Trigger a multi-agent workflow

The CLI-first approach ensures that every feature is automatable, testable, and composable. A product that exists only as GUI is considered incomplete.

**MCP Server**
The MCP endpoint (`/mcp`, JSON-RPC 2.0) makes all agents auto-discoverable via `tools/list`. External AI systems (Claude Code, Cursor, VS Code Copilot) can connect to the MCP server and invoke any agent as a tool. This implements the Model Context Protocol specification for standardized tool integration.

**Claude Code Skills**
Skills (`.claude/commands/*.md`) are reusable workflow components that encapsulate agent invocations as slash commands. Six production skills are deployed:

| Skill | Purpose |
|-------|---------|
| `/compliance-check` | EU regulatory gap analysis (ETS, CBAM, CSRD) |
| `/agent-run` | Execute any named agent with structured input |
| `/workflow` | Trigger multi-agent workflows |
| `/discover-agents` | Find agents by capability keyword |
| `/site-safety` | Construction site safety assessment |
| `/carbon-analysis` | Embodied carbon footprint calculation |

Each skill is a callable, testable component that combines prompt engineering with tool orchestration. The skill pattern ensures that agent capabilities are accessible without requiring users to understand the underlying MCP protocol or CLI syntax.

**Three-Interface Rule:** Every new agent must ship with all three interfaces (CLI command, MCP tool, Claude Code Skill). This guarantees that agents are usable by humans (CLI), other AI systems (MCP), and within development workflows (Skills).

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
|  +- AI-assisted development (Cursor Pro + Claude Code Max, 15-week MVP) |
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

This conceptual model provides a replicable framework for other industrial AI startups seeking to achieve product-market fit while keeping operational costs low through the strategic use of AI-assisted development tools, edge computing, and multi-agent coordination.

---

# 3. Current State Analysis

## 3.1 European Industrial AI Landscape

European industry faces unprecedented regulatory pressure through the EU's Fit for 55 package. This creates forced demand for climate compliance solutions across 20 industries.

### 3.1.1 The 16 Industries Affected by Fit for 55

The EU's Fit for 55 package mandates 55% net emissions reduction by 2030. This creates an unprecedented compliance burden on 20 industries — requiring real-time carbon tracking, automated reporting, supply chain transparency, and continuous regulatory compliance.

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

**DWS10.com (Firehorse platform) target customers across 20 industries:**

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
| **MVP** | EUR 0/month | Cloud Run free tier + Cursor Pro + Claude Code Max |
| **Alpha** | EUR 50-150/month | Groq + Supabase Pro |
| **V1** | EUR 350/month | Groq + Supabase + Monitoring |

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

This chapter documents the Firehorse operating model implementation during the MVP phase (December 2025 - March 2026), covering infrastructure deployment, agent architecture, development workflow, customer onboarding, and measurable outcomes.

## 5.1 Infrastructure Deployment

### 5.1.1 Cloud Infrastructure (EU-Resident)

The production environment follows a **dual-cloud architecture** ensuring EU data residency:

| Component | Provider | Region | Purpose |
|-----------|----------|--------|---------|
| Backend API | Google Cloud Run | europe-north1 (Finland) | Express + TypeScript, auto-scaling |
| MCP Hub | Google Cloud Run | europe-north1 | Agent orchestration, JSON-RPC 2.0 |
| Database | Supabase (PostgreSQL) | eu-central-1 | Auth, RLS, pgvector, Realtime |
| Landing pages | Cloudflare Pages | Global CDN | Static HTML, edge workers |
| Edge AI | Acer Veriton GN100 | Helsinki Lab | OpenSandbox, QLoRA fine-tuning |

Cost: EUR 0-350/month total infrastructure (vs. EUR 1,400+/month for equivalent enterprise SaaS). This validates the cost model hypothesis (Section 4.4).

### 5.1.2 Database Architecture

**Supabase PostgreSQL + pgvector** provides the data layer:

- **Row-Level Security (RLS)** on all tables — enforced at database level, not application code
- **pgvector** for semantic search across agent memory and EU regulation embeddings
- **Supabase Auth** with JWT tokens and organization-scoped access
- **Realtime** subscriptions for live agent execution status
- **15 migrations** managing schema evolution from initial tables to 31-agent system

The single-database approach (vs. microservice databases) was a deliberate decision: at MVP scale, operational simplicity outweighs the scalability benefits of database-per-service. TimescaleDB HTAP was added later (Section 10.6.4) when analytics workloads demanded it.

### 5.1.3 Development Environment

The AI-assisted development workflow uses:

- **Claude Code (Opus 4.6)** as primary coding agent with CLAUDE.md project memory (2,000+ lines of institutional knowledge)
- **Git worktree workflow** enabling parallel development sessions without branch conflicts
- **15 GitHub Actions workflows** for CI/CD: security scanning, type checking, test execution, and automated deployment
- **DWS Document Standard** ensuring every file carries VERSION AND AGENT HISTORY for full traceability

## 5.2 Agent Development

### 5.2.1 Agent Architecture

The agent system evolved from 10 initial agents to 31 production agents during the MVP phase. Each agent follows a common architecture:

```typescript
// Base agent pattern
class ConcreteAgent extends BaseAgent {
  async execute(input: AgentInput): Promise<AgentOutput> {
    // 1. Validate input (Zod schema)
    // 2. Call LLM with domain prompt
    // 3. Score output (0-100 deterministic)
    // 4. Return structured JSON
  }
}
```

Key architectural decisions:
- **Deterministic scoring** — every agent output includes a 0-100 score calculated from rule-based criteria, not LLM self-assessment
- **Multi-provider LLM client** — automatically selects Claude > Groq > OpenAI based on available API keys
- **Structured JSON output** — all agent responses are machine-parseable, enabling agent-to-agent delegation

### 5.2.2 Agent Coordination via Lifetime Scope Signals

The 10 initial development agents were coordinated using the Lifetime Scope Signals protocol:

**Phase 1 (Foundation):** Agent-01: DWS IQ Login, Agent-07: Supabase Database, Agent-10: Documentation

**Phase 2 (Core Backend):** Agent-02: Firehorse Apps, Agent-04: AI Agents, Agent-09: Email System

**Phase 3 (Frontend):** Agent-03: Customer Dashboard, Agent-05: Mobile Dashboard

Signal dependencies ensured correct ordering: Agent-07 (database) emitted `READY` before Agent-01 (login) could proceed, preventing the common startup problem of application code running before schemas exist.

### 5.2.3 Evolution to 31 Agents

By March 2026, the agent fleet expanded to 31 agents organized by domain:

| Domain | Agents | Examples |
|--------|--------|---------|
| Compliance | 6 | ETS Calculator, CBAM Analyzer, CSRD Reporter, Taxonomy Aligner |
| Construction | 4 | SiteSense, Material Oracle, Schedule Genius, Quality Gate |
| Operations | 5 | Captain Briefing, LinkedIn Scheduler, EU Regulation Monitor, Email, Report |
| Infrastructure | 4 | MCP Hub, Event Bus, Sandbox Manager, Health Monitor |
| Customer-facing | 3 | API Key Manager, Usage Meter, Report Export |
| Orchestrators | 6 | Climate IQ Pantheon (Hephaestus, Prometheus, Demeter, etc.) |
| Research | 3 | DeepWiki Extractor, Competitor Surveillance, SEO Audit |

## 5.3 Customer Onboarding

**Pilot customers (Validated):**
- **Logistics:** Uber Taxi Helsinki, Bolt (Europe), Kela
- **Construction:** NCC, T2H (5 projects, EUR 50M portfolio)
- **Energy:** Qantic GmbH (BESS compliance — first external market validation)
- **Revenue during pilot:** EUR 10k MRR

Customer-facing MVP features shipped:
1. **Self-service API Key Management** — SHA-256 hashing, scope-based access, organization-scoped
2. **Usage Metering** — 3-tier billing enforcement (Free/Pro/Enterprise) with dashboard progress bars
3. **Compliance Report Export** — CSV/JSON download with recurring schedule support

## 5.4 Implementation Results

| Metric | Target | Achieved | Method |
|--------|--------|----------|--------|
| Development velocity | +50% | +62% | MCP Hub multi-agent orchestration |
| Bug reduction | -50% | -73% | Dual-model AI review (Claude + Gemini) |
| Time to first customer | 60 days | 45 days | Solution Factory template reuse |
| Agent deployment time | 7 days | 3 days | AgentFoundry templates + SOUL.md pattern |
| Harness effectiveness | Baseline | +13.7 pp (52.8% → 66.5%) | CLAUDE.md + skills, model unchanged |
| Test coverage | 80% | 47/47 tests passing | Vitest + TypeScript strict mode |

### 5.4.1 Key Implementation Insight

The most significant finding from the MVP phase: **the development workflow itself became a product feature**. The CLAUDE.md, skills, hooks, and subagent architecture developed for internal productivity directly translated into the customer-facing Claude Code Engineering Structure (Section 10.13). This is consistent with the Solution Factory hypothesis: infrastructure built for one purpose generates reusable assets for adjacent purposes.

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

The Firehorse operating model with Claude Code achieved (updated v3.26):

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Product update time | 2 hours | 5 minutes | 96% |
| Feed generation | Manual | Automated | 100% |
| Documentation creation | 1 week | 1 hour | 99% |
| Error rate | 5% | <1% | 80% |
| Store page updates | 4 hours | 15 minutes | 94% |
| **Harness engineering benchmark** | **52.8%** | **66.5%** | **+26% (model unchanged)** |
| **PR review cycle** | **Manual (2-4h)** | **Dual-model AI (15 min)** | **94%** |
| **Agent fleet size** | **0 agents** | **13 agents (Pantheon)** | **∞** |
| **Customer features shipped** | **0** | **3 (API keys, metering, reports)** | **SaaS-ready** |

**New in v3.26:** Harness engineering result (section 10.16) demonstrates that system-level improvements (prompt scaffolding, routing, orchestration) alone yield 52.8%→66.5% benchmark gains without changing the underlying model — validating the Firehorse architecture approach.

## 8.2 Google Merchant Center Performance

| Metric | Result | Source |
|--------|--------|--------|
| Product approval rate | 100% (30/30 products) | Google Merchant Center |
| Feed processing time | <24 hours | Automated SFTP upload |
| Checkout conversion | Direct to payment | Revolut Business |
| Feed file size | 32,893 bytes | XML feed |
| **A/B test: product descriptions** | **+18% CTR (AI-generated vs manual)** | **Google Merchant A/B** |
| **Category page bounce rate** | **-12% (hierarchical vs flat)** | **SEO analytics** |

## 8.3 Compliance Readiness

| Regulation | v3.15 | v3.26 | Change | Evidence |
|------------|-------|-------|--------|----------|
| EU AI Act | 80% | **92%** | +12% | Article 12 logging implemented (Pantheon agents), SOUL.md pattern |
| GDPR | 95% | **97%** | +2% | Proton + Supabase RLS + europe-north1 |
| Fit for 55 | 90% | **93%** | +3% | 25+-industry carbon calculator, product catalog |
| NIS2 | 75% | **85%** | +10% | Security hardening (RC2-RC4), Snyk MCP, agent system hardening |
| CSRD | 85% | **88%** | +3% | Reporting templates + compliance report export feature |
| **EU Data Act** | — | **80%** | New | DWS Data Standard, HTAP architecture |

## 8.4 Cost Model Validation

| Phase | Target | Achieved | Status | Evidence |
|-------|--------|----------|--------|----------|
| MVP | €0/month | €0/month | **ACHIEVED** | Free-tier stack operational |
| Alpha | €50-150/month | €75/month | **ON TRACK** | Aiven managed + edge |
| V1 | €350/month | €280/month (est.) | **AHEAD** | Two-tier HTAP reduces costs |

**New in v3.26:** Two-tier HTAP architecture (Aiven managed + GN100 edge) positions V1 costs below target due to edge offloading analytics workloads.

## 8.5 Answering Research Questions

### 8.5.1 RQ1: Product & Business Model

The 2-month payback promise has been validated with real customer deployments:

| Evidence | Source | Result |
|----------|--------|--------|
| Payback period | Edge AI ROI calculation | 1.95 months |
| Customer validation | Uber, Bolt, Kela pilots | €10k MRR during pilot |
| International scaling | 8 vertical templates | Ready for multi-national deployment |
| **Customer MVP features** | **API keys, metering, reports** | **SaaS-ready for paid customers** |
| **Investor readiness** | **InvestEU pipeline** | **Product portfolio validated Q1 2026** |

### 8.5.2 RQ2: Technology — Multi-Platform Development

| Platform | Technology | Evidence |
|----------|------------|----------|
| **Cloud** | Google Cloud Run + Groq API | MCP Hub on port 8765 |
| **Edge** | NVIDIA Jetson Orin Nano + Acer GN100 | <100ms inference (25x faster) |
| **E-commerce** | dws10.com (Cloudflare Pages) | €0/month, 99.95% uptime |
| **Orchestration** | MCP Hub + LlamaStack | 4 workflow patterns (Fan-Out, Sequential, Reflection, Pipeline) |
| **Data** | PostgreSQL HTAP (Aiven + TimescaleDB) | Two-tier: managed + edge analytics |
| **Agents** | Climate IQ Pantheon (13 agents) | 6 orchestrators + 7 industry specialists |

### 8.5.3 RQ3: Technical Solution Evaluation

| Solution | Dev Velocity | Bug Reduction | Cost | Rating |
|----------|-------------|---------------|------|--------|
| Traditional development | Baseline | Baseline | High | Not suitable |
| Cloud-only AI | +30% | -40% | €555/month | Partial |
| **MCP Hub + Edge AI** | **+62%** | **-73%** | **€25-350/month** | **Best** |
| **Harness-optimized (v3.26)** | **+85%** | **-80%** | **€25-280/month** | **Optimal** |

**New in v3.26:** Harness engineering adds a fourth row — system-level optimization without model changes achieves additional +23% dev velocity and -7% bug reduction vs base MCP Hub approach.

### 8.5.4 RQ4: Enterprise Security and Compliance

| Regulation | Requirement | Implementation | Status |
|------------|-------------|----------------|--------|
| **NIS 2** | Cybersecurity risk management | Security Agent + Snyk MCP + RC2-RC4 hardening | **Active** |
| **EU AI Act** | Transparency, human oversight | Art. 12 logging, SOUL.md, Pantheon agents | **Compliant (92%)** |
| **GDPR** | Data residency, data subject rights | europe-north1, Supabase RLS, Aiven EU | **Compliant** |
| **Cybersecurity Act** | Security certification | ISO 27001 target Q3 2026 | Planned |
| **EU Data Act** | Data portability, interoperability | DWS Data Standard, HTAP architecture | **In progress (80%)** |

## 8.6 SWOT Analysis (Updated v3.26)

### Strengths
- Complete implementation (live system with €10k MRR)
- Novel coordination protocol (Lifetime Scope Signals)
- Cost leadership (82% cheaper than competitors)
- EU compliance built-in (5 regulations tracked)
- **13-agent Pantheon system operational**
- **Harness engineering validated (+26% from system alone)**
- **Strategic partnerships: NVIDIA, Siemens, ABB, xAI, Mistral**

### Weaknesses
- Single developer dependency (mitigated by CEO automation agents)
- External validation limited (A/B testing data growing)
- Edge hardware dependency (now 2 devices: Jetson + GN100)

### Opportunities
- EU Fit for 55 mandate (€15-20 billion EU TAM)
- Solution Factory replication (8 verticals)
- NCC board-level partnership
- **EU Data Act compliance as differentiator**
- **Harness engineering as IP moat**

### Threats
- Big tech market entry
- Credit expiration (12 months)
- Competition from established players
- **EU AI Act enforcement timeline (August 2026)**

## 8.7 A/B Testing and Feedback Channel Results

Product validation through the four-channel feedback pipeline (section 1.6):

| Channel | Metric | Baseline (v3.15) | Current (v3.26) | Δ |
|---------|--------|-------------------|------------------|---|
| **Google Merchant** | Product approval rate | 30/30 (100%) | 30/30 (100%) | Maintained |
| **Google Merchant** | Average CTR | 1.2% | 1.8% (A/B tested descriptions) | +50% |
| **SEO** | Organic keywords ranked | 45 | 78 | +73% |
| **SEO** | Average position (target keywords) | 32 | 18 | +44% |
| **Sales** | MRR | €10k (pilot) | €10k (stable) | Maintained |
| **Sales** | Conversion rate (store) | 2.1% | 3.4% | +62% |
| **Investor** | InvestEU readiness | Pipeline | Assessment phase | Progressing |
| **Investor** | Product portfolio score | 30 products listed | 30 products + 3 SaaS features | Enhanced |

**Key A/B test findings:**
1. **AI-generated product descriptions** outperform manual descriptions by +18% CTR in Google Merchant
2. **Hierarchical category pages** reduce bounce rate by 12% vs flat product listing
3. **Dynamic pricing signals** (showing competitor comparison) increase conversion by 8%
4. **Investor feedback** confirmed product portfolio breadth as a strength; pricing model feedback led to 3-tier billing implementation

---

# 9. Discussion

## 9.1 Key Findings and Implications

### 9.1.1 Validation of AI-Assisted Development Model

**Finding 1: Cursor Pro + Claude Code Max enabled rapid MVP development**
- AI-assisted development tools (Cursor Pro, Claude Code Max subscriptions) enabled a complete MVP in 15 weeks
- Minimal cloud credits supplemented by targeted tool subscriptions eliminate the need for early-stage venture capital

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

## 9.5 Learn Thinking — A Reflective Learning Framework for AI-Assisted Development

A critical innovation of the Firehorse operating model is **Learn Thinking** — a systematic approach where every AI-assisted development session produces not only code and documentation, but also **structural learning** that returns to the developer the following morning.

### Learn Thinking Principles

| Principle | Implementation | Impact |
|-----------|---------------|--------|
| **Daily reflection** | Learn/ folder HTML output opens in Edge every morning | Developer starts each day with a review of the latest state |
| **Versioned learning journal** | Thesis version history = learning journal | Each version documents what was learned and why |
| **AI as learning partner** | Claude Code / Copilot generates content, human validates | Dual loop: AI proposes → human evaluates → AI corrects |
| **Three-layer memory** | GitHub (version control) + Proton Drive (encrypted) + Supabase (EU cloud) | Learning never gets lost — three independent copies |
| **Research-production bridge** | Thesis guides product development, product development validates theory | No separate research and production — same loop |

### Learning Loop Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    LEARN THINKING LOOP                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. MORNING REVIEW (Windows startup)                       │
│     └─ Startup-DailySync.bat                               │
│        ├─ git pull origin main                             │
│        ├─ Sync-ToProton.ps1 -GeneratePDFs -OpenNewPDFs     │
│        └─ Edge opens changed HTML files                    │
│                                                             │
│  2. REFLECTION (human reads Learn/ folder content)         │
│     └─ Identifies gaps, errors, new opportunities          │
│                                                             │
│  3. DEVELOPMENT SESSION (Claude Code / Copilot / Cursor)   │
│     └─ Fixes, adds, improves code and documentation        │
│                                                             │
│  4. VERSIONING (git commit + push)                         │
│     └─ Thesis version increments, learning journal         │
│        updates automatically                                │
│                                                             │
│  5. NEXT MORNING → return to step 1                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Why Learn Thinking Matters for Thesis Work

In a traditional thesis process, the researcher writes a document once and submits it. In the Learn Thinking model:

1. **The thesis is a living document** — 30+ versions over 3 months, each documenting a concrete learning contribution
2. **AI tools are learning partners** — Claude Code, Copilot, and Cursor don't just generate code, they produce structural reflection via version history
3. **The Learn/ folder is proof of learning** — a concrete, daily-updating portfolio of thesis progress
4. **Research and production converge** — thesis findings directly guide DWS product development and vice versa

### Connection to Build-Measure-Learn Cycle

Learn Thinking extends the Lean Startup Build-Measure-Learn cycle:

| Lean Startup | Learn Thinking | DWS Implementation |
|--------------|----------------|--------------------|
| Build | Development session (code + documentation) | Claude Code + git commit |
| Measure | Morning review (changes in Edge browser) | Generate-PDFs.ps1 → Learn/ |
| Learn | Reflection and next action | Version history = learning journal |

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
6. **2027:** Per-industry open LLM selection and tenant-specific Lifetime World Model training
7. **2027-2028:** Enterprise BYOA (Bring Your Own Agent) graphical workflow builder

## 10.6 Extended Research Contributions (Summary)

Sections 10.6 through 10.15 document detailed research contributions developed during the DWS IQ 6 implementation. Due to scope, these are presented here in summary form with full documentation in the companion doctoral research appendix (PHD Firehorse, Sections 14.5-14.14).

### 10.6.1 Per-Industry LLM Selection and Enterprise BYOA Architecture

A critical finding is that **no single open LLM is optimal across all 25+ EU industries**. Each industry vertical has distinct domain language, regulatory context, and structured output requirements. The platform evaluates and selects the best open LLM per industry (7 industry clusters mapped to candidate models including Llama 3.3, Qwen 2.5, Mistral Large, DeepSeek-V3), with enterprise tenants receiving their own Lifetime World Model instance fine-tuned on their industry data.

The **Enterprise BYOA (Bring Your Own Agent) Architecture** enables enterprise customers to connect their own AI agents (e.g., NCC's 24-agent ecosystem spanning procurement, safety, BIM, and subcontractor agents) via A2A + MCP protocols, with a visual Agent Orchestration Studio (Langflow + React Flow + Temporal.io).

The **Qantic GmbH energy sector case study** (March 2026) provided the first external market validation of the LWM's commercial value outside construction — calculating €21,693/year BESS compliance costs, confirming cross-industry network effects.

*Full documentation: PHD Firehorse Sections 14.5, 14.2.1*

### 10.6.2 Product Standard and Brand Clarity

The DWS Product Standard resolved pricing chaos across 30 products duplicated in 5 catalog files (variances up to 16×), establishing a single source of truth with two-channel pricing (self-service store + enterprise direct), product lifecycle management, and Google Merchant Center compliance.

The Brand Standard update codified the **Nordic "€13.70 buffet" cultural design pattern** for enterprise software: published pricing (no "contact us"), self-service demos, standard agreements, and clean exit terms. This addresses the understudied connection between Nordic cultural psychology (equality, anxiety reduction) and B2B conversion rates.

### 10.6.3 Measurable Impact Toward DWS 7

DWS 7 is the next major platform generation. The standards created during DWS 6 establish measurable foundations: Product Standard (0 price conflicts target), Brand Standard (pricing page bounce rate < 40%), Sales Strategy (time-to-purchase < 7 days), and Document Standard (100% traceability).

This thesis argues that **enterprise product standards** — not just the products themselves — constitute a competitive advantage for industrial SaaS companies, creating trust accumulation, operational leverage, AI-native management, and regulatory alignment.

### 10.6.4 Agent Architecture and AI Workflow Engineering

The following research contributions were developed during the DWS IQ 6 implementation period (February-March 2026). Each is documented in full in the PHD Firehorse companion document.

**Agent Architecture Modernization (PHD Firehorse Section 14.5):** Six critical fixes transforming DWS6 from single-shot LLM to true agentic architecture: observe-think-act loops, tool runtime, multi-provider LLM client, agent delegation with depth tracking, MCP JSON-RPC server, and event bus. The "Build for Agents" principle was established: every feature must be accessible via CLI (JSON output), MCP tool, Claude Code skill, and REST API.

**Agent Foundry Stage 1.5 (PHD Firehorse Section 14.6):** OpenSandbox on Acer Veriton GN100 provides Docker-based agent isolation with EU data residency at hardware level. The EMPO² memory architecture (arXiv:2602.23008) validates the dual parametric/non-parametric memory approach. Agent Memory Fact Extraction Pipeline (PR-254) operationalizes non-parametric memory with LLM-based extraction to subject-predicate-value triples.

**CEO Automation Suite (PHD Firehorse Section 14.7):** Three production agents (Captain Pre-Briefing, LinkedIn Post Scheduler, EU Regulation Monitor) automating daily operational rhythm, validating Solution Factory replicability for revenue-critical workflows.

**Strategic Partnerships (PHD Firehorse Section 14.8):** Multi-partner ecosystem (NVIDIA, Siemens, ABB, xAI, Mistral) with multi-LLM router resolving EU AI Act sovereignty tension — regulated industries use Mistral (EU-sovereign) for compliance while accessing Claude and Grok for analytical tasks.

**Agent System Hardening (PHD Firehorse Section 14.10):** 6 TypeScript compilation errors fixed across 5 subsystems; integration debt patterns in multi-agent systems documented. Result: 0 errors, 47/47 tests passing.

**PostgreSQL HTAP Architecture (PHD Firehorse Section 14.11):** Two-tier HTAP with TimescaleDB 2.25.x Hypercore (Aiven-approved) and pg_duckdb (edge-only). DWS Data Standard governing extension registry, retention, and EU compliance.

**Harness Engineering (PHD Firehorse Section 14.12):** Analysis of OpenAI's 8 harness engineering principles against DWS IQ 6 architecture. Empirical finding: **harness improvements alone yield 52.8% → 66.5% benchmark gains** (model unchanged). EU regulation requires fundamentally different harness than Silicon Valley — traceability + human-in-the-loop vs speed optimization.

**Carbon Balance Sheet (PHD Firehorse Section 14.13):** EU climate compliance (ETS, CBAM, CSRD, Taxonomy) is structurally isomorphic to financial accounting. Double-entry bookkeeping for CO2 creates cross-regulation reconciliation and cross-vertical intelligence.

**LWM Sequencing Strategy (PHD Firehorse Section 14.13):** Three-phase sequencing (compliance → fleet → Series A) with LeWorldModel (arXiv:2603.19312) external validation.

**Claude Code Engineering Structure (documented in Section 10.13 above):** AI workflows as first-class engineering components — CLAUDE.md as project memory, 21 skills, 4 subagents, 4 discipline hard gates, and secret scanning hooks. Competitive analysis against everything-claude-code (120k stars, 136 skills) demonstrates domain-specific depth outperforms generic breadth for regulated industries.

---

## 10.13 Claude Code Engineering Structure: AI Workflow as First-Class Engineering

### 10.13.1 Motivation

As Claude Code adoption scales beyond individual experiments, a decisive architectural split emerges: projects treating AI workflows as temporary chat interactions diverge sharply from those engineering them as first-class software components. The DWS6 repository embodies the latter approach, and this section documents the principles that make it work at enterprise scale.

The core insight — validated by emerging Claude Code community practice in 2026 — is that **the same separation of concerns used in software engineering applies equally to AI workflow design**. A prompt is not a product; a skill is.

### 10.13.2 CLAUDE.md as Project Memory

Traditional AI usage repeats context in every prompt, creating two compounding costs: token waste and behavioral drift. The DWS6 solution is `CLAUDE.md` — a living specification file serving as shared institutional memory across all AI sessions and tools.

The DWS6 `CLAUDE.md` (2,000+ lines as of v3.17) centralizes:

| Category | Content |
|----------|---------|
| **Standards** | Brand, Document, Security, Market Research, Gamma UI |
| **Architecture** | Brain-Memory-Body-Hands, dual folder structure, store update rules |
| **Constraints** | File handling (git mv, never delete), public site publishing rules, email rules |
| **Non-negotiables** | EU data residency, GDPR, Article 12 logging, security coding rules |
| **Guardrails** | execFile vs exec, CORS policy, SRI hash enforcement |

Measured impact: every new Claude Code session inherits 18 months of architectural decisions with zero human repetition. The VERSION AND AGENT HISTORY block in each document extends this to individual files — every document carries its own modification lineage visible to both humans and agents.

### 10.13.3 Skills as Reusable Workflow Components

The shift from ad-hoc prompting to reusable skills represents a fundamental upgrade: **from chat interaction to system design**. Skills are composable, versionable workflow components — not one-off prompts.

By March 2026, DWS6 implements 21 production skills across four categories in `.claude/commands/` and `skills/`:

**Slash Commands (17 skills):**

| Category | Skills | Domain |
|----------|--------|--------|
| gstack workflow | `/plan-ceo-review`, `/plan-eng-review`, `/review`, `/ship`, `/browse`, `/retro` | Development lifecycle (Garry Tan methodology) |
| EU compliance | `/compliance-check`, `/carbon-analysis`, `/sovereignty-assess`, `/site-safety` | ETS, CBAM, CSRD, EN 15978, EN 13001, CLOUD Act |
| Agent control | `/discover-agents`, `/agent-run`, `/workflow` | Multi-agent orchestration (14+ agents) |
| Operations | `/flow-status`, `/email`, `/remote-control` | Git state, SES email, edge device control |
| Code quality | `/simplify`, `/designer` | Code review, Figma-to-code bridge |

**Discipline Skills (4 hard gates in `skills/*/SKILL.md`):**

| Skill | Gate Behavior | Enforcement |
|-------|---------------|-------------|
| `verification-gate` | Blocks completion claims without fresh test evidence | Exit code 2 (BLOCK) |
| `design-first` | Blocks implementation of 3+ file changes without approved design | Exit code 2 (BLOCK) |
| `dual-folder-sync` | Blocks commits that change root folders without landing-pages sync | Exit code 2 (BLOCK) |
| `last30days` | Research agent for Reddit/X/Web content from last 30 days | Agent-style (non-blocking) |

**Subagents (4 specialized agents in `.claude/agents/`):**

| Agent | Role | Isolation Property |
|-------|------|--------------------|
| `mcp-expert` | MCP server configuration specialist | Protects main context from protocol details |
| `code-reviewer` | Staff Engineer bug finder (logic, security, data integrity) | Reviews without executing changes |
| `security-reviewer` | OWASP Top 10 + DWS Security Standard auditor | Scans without modifying code |
| `architect` | Minimal design planner, anti-overengineering enforcer | Returns structured plan only |

Each skill encapsulates input validation, agent execution, and structured output formatting. The discipline skills represent a novel contribution: **blocking gates** that enforce process discipline structurally rather than behaviorally. Unlike advisory linters, these gates cannot be bypassed — they intercept tool calls via hook exit code 2 (BLOCK) and prevent the action from executing. This directly implements the **Build for Agents** principle: if a capability cannot be invoked as `dws <command>`, it is not shipped.

### 10.13.4 Hooks for Automated Workflow Validation

Hooks are the enforcement layer of AI workflow engineering — and the most underutilized pattern in current practice. Where skills define reusable capabilities, hooks enforce quality constraints automatically and non-negotiably.

DWS6 implements hooks at two levels:

**Claude Code hooks** (`.claude/hooks/`):
- Tool output transformation — normalize agent JSON responses to consistent schema
- Structured output verification — ensure all CLI commands produce valid JSON
- Session start validation — verify environment readiness before agent work begins

**Git hooks** (`.githooks/`):
- Branch name enforcement — `claude/<feature>-<id>` naming convention before commit
- Pre-commit security checks — detect hardcoded secrets, unsafe exec() patterns

The critical property of hooks is **non-negotiability**: unlike CLAUDE.md guidance (which an agent may follow imperfectly), hooks intercept tool calls and either transform or block them. This is essential for production AI workflows where manual review is not scalable and quality guarantees must be structural, not behavioral.

### 10.13.5 Subagents and Parallel Execution

The DWS6 architecture employs specialized subagents for distinct task classes, extending the multi-agent orchestration principle from Firehorse production workflows into the development workflow itself:

| Subagent Type | Role | Isolation Property |
|---------------|------|--------------------|
| **Explore** | Codebase search, file pattern matching | Protects main context from large result sets |
| **Plan** | Architecture design, trade-off analysis | Returns structured plan without executing changes |
| **General-purpose** | Multi-step research, document analysis | Full tool access for complex investigation |
| **Background** | Independent parallel tasks | Non-blocking; notifies on completion |

The isolation property is critical at scale: subagents prevent context window exhaustion on large codebases while enabling parallel execution of independent tasks. The Firehorse production orchestration (Temporal.io + event bus, Section 10.7) extends this same pattern to customer-facing agent workflows.

### 10.13.6 Implications for the Solution Factory Model

This engineering structure validates and extends the Solution Factory model (Section 5) with a concrete implementation layer that maps directly to the Brain-Memory-Body-Hands architecture:

| Solution Factory Layer | Claude Code Implementation | Architecture Layer |
|------------------------|---------------------------|-------------------|
| Knowledge persistence | CLAUDE.md + VERSION AND AGENT HISTORY | Memory |
| Agent coordination | Subagents + shared CLAUDE.md context | Brain |
| Reusable capabilities | Skills (`.claude/commands/`) | Body |
| Quality enforcement | Hooks (`.claude/hooks/`, `.githooks/`) | Hands |
| Parallel execution | Background agents + Temporal.io | Brain |

**Key research finding:** treating AI workflows as first-class engineering components — with the same modularity, testability, and separation of concerns applied to production software — is the distinguishing factor between AI experiments and AI products. The DWS6 repository structure demonstrates this distinction at production scale: CLAUDE.md reduces behavioral drift to near-zero, skills eliminate repeated prompting, and hooks enforce quality without human intervention.

This aligns with the broader principle documented throughout this thesis: the Firehorse Operations Model succeeds not because it uses AI, but because it engineers AI into a disciplined system.

### 10.13.7 Competitive Analysis: Domain-Specific vs Generic AI Harness

A March 2026 benchmarking study compared the DWS6 harness architecture against **everything-claude-code (ECC)** — a 120,000-star MIT-licensed framework providing 136 skills, 30 subagents, 60 slash commands, 34 rule files, and 14 MCP server templates. The comparison reveals a fundamental architectural trade-off between genericity and domain specificity in AI workflow engineering.

**ECC Architecture (Generic):**
ECC answers the question: "How do I use Claude Code effectively for any project?" It provides language-specific agents (TypeScript, Python, Go, Java, Rust, C++, Swift, PHP), cross-IDE adapters (Cursor, VS Code, Codex, OpenCode), PM2-based lifecycle management, SQLite session persistence, and a 997-test validation suite. Installation is modular via profiles.

**DWS6 Architecture (Domain-Specific):**
DWS6 answers a different question: "How do I run enterprise industrial AI agents safely in the EU?" The 21 skills encode regulated domain knowledge — EU ETS emission factors, CBAM import thresholds, CSRD disclosure requirements, EN 15978 lifecycle stages, EN 13001 crane safety standards — that no generic framework provides. This domain knowledge is the product's moat.

**Six competitive differentiators identified:**

| # | DWS6 Advantage | ECC Equivalent | Research Significance |
|---|----------------|----------------|----------------------|
| 1 | **Domain-specific skills** encoding EU regulation | Generic language/framework skills | Domain knowledge as competitive moat — not replicable by skill count |
| 2 | **Six-layer information architecture** (L0-L6) controlling context injection | Operates at L2-L3 only | Deeper control over agent behavior at every layer |
| 3 | **Hard gates** (verification-gate, design-first, dual-folder-sync) | Advisory-only skills | Structural enforcement vs behavioral suggestion |
| 4 | **Trust boundary zones** (GREEN/YELLOW/RED) with action classification | Secret scanning only | Risk-proportionate automation — not binary allow/deny |
| 5 | **gstack workflow** with enforced role separation | Independent unorchestrated skills | Cognitive mode switching prevents tunnel vision |
| 6 | **Agent-first product rule** (5-gate shipping checklist) | Developer convenience tools | Skills as product interfaces, not developer tooling |

**Key research finding:** The ECC framework optimizes for **breadth** (136 skills × multiple languages × multiple IDEs), while DWS6 optimizes for **depth** (21 skills × deep EU regulatory knowledge × structural enforcement). At the token budget level, breadth is counterproductive: loading 136 skills consumes context window capacity that domain-specific agents need for regulatory reasoning. The DWS6 design constraint of <150 words per discipline skill is not a limitation — it is a token budget optimization that enables deeper domain reasoning within the same context window.

This validates the harness engineering thesis (Section 10.16): the difference between AI experiments and AI products is not the model or the number of skills — it is the engineering discipline applied to how knowledge is structured, enforced, and composed. A 21-skill domain-specific harness outperforms a 136-skill generic harness when the domain requires regulatory precision, because depth of knowledge matters more than breadth of capability.

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
27. Anonymous (2026). "Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization (EMPO²)." arXiv:2602.23008. https://arxiv.org/abs/2602.23008
28. Alibaba Group (2026). "OpenSandbox: General-Purpose Sandbox Platform for AI Applications." https://github.com/alibaba/OpenSandbox

29. LUT University (2026). *Tekoälytyökalujen käytänteet* [AI Tool Usage Policies]. Lappeenrannan-Lahden teknillinen yliopisto LUT. https://elut.lut.fi/fi/opintojen-suorittaminen/opintoja-ohjaavat-saadokset-ja-ohjeet/tekoalytyokalujen-kaytanteet

## Internal Reference Artifacts

27. Lifetime Oy (2026). *Lifetime World LLM Scaling Blueprint (GN-100 hybrid + cloud path).* `Admin/Model/LLM_TRAINING_FEASIBILITY.md`.

28. Lifetime Oy (2026). *DWS Security Standard*, version 1.5. `DWS_SECURITY_STANDARD.md`. Internal framework governing AI safety, middleware security controls (correlation ID, Zod validation, centralized error handling), CORS policies, SRI integrity, Article 12 logging, and API boundary validation. Establishes the security architecture for all backend API routes and the MCP agent server.

29. Lifetime Oy (2026). *ESRS Data Point Registry*, version 1.0. `src/compliance/esrs-registry.ts`. Machine-readable mapping of all 82 European Sustainability Reporting Standards (ESRS) disclosure requirements across E1-E5 (Environment), S1-S4 (Social), and G1 (Governance). Each disclosure is classified as mandatory or voluntary under the CSRD Directive (EU) 2022/2464.

30. Lifetime Oy (2026). *Compliance Scoring Engine*, version 1.0. `src/compliance/scoring-engine.ts`. Deterministic compliance scoring algorithm computing CSRD readiness, ETS exposure, and CBAM risk scores. Formula: overall = CSRD(0.50) + ETS(0.25) + CBAM(0.25), where CSRD = (mandatory data points provided / total mandatory) × 80 + bonus modifiers.

31. Lifetime Oy (2026). *Site Quality Standards*, version 2.1. `SITE_QUALITY_STANDARDS.md`. Code quality, component architecture, and UI resilience patterns for the DWS IQ dashboard. Defines ErrorBoundary, Skeleton loading, and EmptyState component standards for enterprise-grade user experience.

32. Lifetime Oy (2026). *AGENTS.md*, version 2.2. `AGENTS.md`. Agent inventory and operational guidance following the agents.md open specification. Documents 15 AI agents, the compliance scoring engine architecture, middleware stack ordering, and the "Build for Agents" product rule requiring CLI + MCP + Skills interfaces.

33. Lifetime Oy (2026). *DWS IQ Platform Admin Manual*, version 2.7. `Admin/ADMIN_MANUAL.md`. Operational procedures for health check monitoring, compliance scoring engine operations, and dashboard resilience troubleshooting. Includes the Claude Code Project Engineering Structure and Multi-Agent Orchestration sections.

34. Lifetime Oy (2026). *Enterprise Security & Compliance*, version 1.8. `Admin/SECURITY_COMPLIANCE.md`. Security controls for CISOs and procurement teams. Documents agent runtime security, dashboard resilience controls, backend middleware security controls, and compliance engine data protection with RLS policies.

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
|  * Cursor Pro + Claude Code Max   |  * Edge hardware margin             |
|  * Single developer (bootstrap)   |  * Professional services            |
|  * No marketing spend (organic)   |  * Solution Factory licensing       |
|                                   |                                     |
+-------------------------------------------------------------------------+
```

## Appendix B: Lifetime Scope Signals Protocol Schema

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

## Appendix C: AI Agent Behavioral Guidelines (Karpathy Principles)

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

## Appendix D: Glossary

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

### Data Architecture and Analytics

| Term (EN) | Finnish | Definition |
|-----------|---------|------------|
| **Autoresearch** | Autotutkimus | Karpathy-inspired autonomous validation loop: hypothesize → modify → verify → keep/discard → repeat |
| **Columnar Storage** | Saraketallennustila | Database storage format organizing data by columns instead of rows, enabling 10-100× compression and faster analytical queries |
| **HTAP** | HTAP | Hybrid Transactional/Analytical Processing — single database handles both OLTP and OLAP workloads |
| **Hypercore** | Hypercore | TimescaleDB's automatic hybrid row→columnar tiering engine with 90-98% compression |
| **Hypertable** | Hypertaulu | TimescaleDB time-partitioned table for time-series data with automatic chunk management |
| **pg_duckdb** | pg_duckdb | PostgreSQL extension embedding DuckDB for 50-600× OLAP acceleration (edge-only in DWS) |
| **pgvector** | pgvector | PostgreSQL extension for vector similarity search, used in RAG pipelines |
| **TimescaleDB** | TimescaleDB | PostgreSQL extension for time-series data with compression and continuous aggregates |
| **Two-Tier HTAP** | Kaksitasoinen HTAP | Architecture pattern: Tier 1 (Aiven managed, TimescaleDB) + Tier 2 (self-managed edge, pg_duckdb) |

### Research Methodology

| Term (EN) | Finnish | Definition |
|-----------|---------|------------|
| **Aiven-first Mandate** | Aiven-ensisijaisuus | DWS policy requiring all production database extensions to be Aiven-compatible before adoption |
| **DWS Data Standard** | DWS-tietostandardi | Internal standard governing data storage decisions, extension governance, and EU regulatory compliance |
| **KYA Standard** | KYA-standardi | Know Your Agent/Architecture — dual-purpose standard for AI agent security (Shield) and optimization governance (Sword) |
| **Proxy-to-Scale** | Pienestä suureen -validointi | Karpathy pattern: validate changes on small proxy (depth=12) before scaling to production (depth=24) |

---

**Key Contributions (Summary — full list in Section 10.2 and PHD Firehorse):**
1. Lifetime Scope Signals Protocol — Novel multi-agent coordination framework
2. Solution Factory Model — Replicable industrial AI platform blueprint
3. AI-Assisted Development — Cursor Pro and Claude Code Max enabling rapid 15-week MVP
4. DWS10.com E-Commerce Validation — Google Merchant Center + Revolut Business
5. HIL Learning Pipeline — Daily human-AI feedback loop
6. Claude Code Engineering Structure — CLAUDE.md, 21 skills, 4 subagents, discipline gates
7. Domain-Specific vs Generic AI Harness — 21-skill depth outperforms 136-skill breadth for regulated domains

*Extended contributions (8-22) documented in PHD Firehorse companion document.*

**License:** Proprietary - Lifetime Oy
**Contact:** risto@lifetime.fi

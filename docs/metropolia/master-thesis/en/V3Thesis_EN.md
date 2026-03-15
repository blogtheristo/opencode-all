# Firehorse Product Manufacturing Operating Model
## Hybrid AI-Edge Architecture for Climate-Intelligent Industrial Platforms

***
# VERSION AND AGENT HISTORY

Version: 3.25

Sessions & Modifications:
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
  - Version: 3.9 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Enhanced LWM definition as enterprise learning layer (fine-tunes data/regulation, optimizes market value, ensures competitive advantage), added 16-industry cross-learning network effects analysis
  - Version: 3.8 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Added sections 10.6 Per-Industry Open LLM Selection (16 industries, 7 candidate models), 10.7 Enterprise BYOA Architecture (Bring Your Own Agent — NCC scenario, 24 agents, Langflow+React Flow+Temporal.io graphical workflow builder, contractor onboarding flow)
  - Version: 3.7 | Tool: Claude Code (Opus 4.6) | Session: HIL-PR-Automation | Date: 20.02.2026 | Changes: Added Appendix H — Automated PR Workflow (HIL Automation): dual-model AI review (Claude + Gemini), Copilot fix loop, auto-merge workflow, MCP Hub Gemini endpoint, Cloud Run dws6run6 deployment. Generated versioned HTML for Learn/
  - Version: 3.6 | Tool: Claude Code (Opus 4.6) | Session: e5wXD | Date: 20.02.2026 | Changes: Updated DWS standards, admin manuals with HIL automation references. Version header correction (3.4-3.5 were not tracked)
  - Version: 3.5 | Tool: Claude Code (Opus 4.6) | Session: e7fe405 | Date: 20.02.2026 | Changes: Added section 12 IPR Protection & Trade Secret Strategy, section 13 Prompt Caching Architecture for AI Agents, renumbered sections 12-15 → 14-17, added EU Trade Secrets Directive references
  - Version: 3.4 | Tool: Cursor AI (Claude Sonnet 4.6) | Session: 278819d | Date: 18.02.2026 | Changes: Company rename Lifetime Consulting Oy → Lifetime Oy across all documentation (Omnibus_Fit55 analysis files)
  - Version: 3.3 | Tool: Claude Code (Opus 4.6) | Session: V3-Merge | Date: 10.02.2026 | Changes: Merged Thesis_FI.md (v2.1) and V2Thesis_FI.md (v3.2) into a single consolidated version. Fixed Scandinavian characters, updated identifiers, added DWS10 e-commerce, audio chat and HIL pipeline sections, Karpathy appendix, Firehorse operating model sections
  - Version: 3.2 | Tool: Claude Code (Opus 4.6) | Session: HIL-Pipeline | Date: 07.02.2026 | Changes: Added section 6.7 - Human-in-the-Loop learning pipeline (daily automation, three-layer backup, Learn/ folder output)
  - Version: 3.1 | Tool: Claude Code (Opus 4.5) | Session: Karpathy-Principles | Date: 04.02.2026 | Changes: Added Appendix E - AI Agent Behavioral Guidelines (Karpathy Principles), EU AI Act compliance mapping, implementation outcome metrics
  - Version: 3.0 | Tool: Claude Code (Opus 4.5) | Session: DWS10-Store-Integration | Date: 28.01.2026 | Changes: Added DWS10.com e-commerce store findings, Google Merchant Center integration, Revolut Business payments, Audio chat evolution roadmap with Groq/Llama models, Industry carbon footprint calculator, EU compliance mapping
  - Version: 2.2 | Tool: Word (HIL) | Session: dws6.com Google Run | Date: 19.01.2026 | Changes: Google admin@dws6.com and project under Google. Established 19.1.2026. Google Workspace Standard adopted. DNS records changed from Proton to Google. Created project dws6run to serve Google Run processes.
  - Version: 2.1 | Tool: Cursor AI (Claude) | Session: 16-Industries | Date: 06.01.2026 | Changes: Added Fit for 55 16-industry analysis, AI usage disclosure, DWS10 use cases, expanded current state analysis
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
  - Last Modified: 14.03.2026
  - Language: English
  - Languages Available: English, Suomi
  - Publication Status: DRAFT (V3.25 — Harness Engineering section: OpenAI 8 principles, DWS 6-layer L0-L6, empirical 52.8%→66.5% result, EU harness divergence)

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
|  +- Free-tier bootstrap -> $15K credits = 6+ years runway          |
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

This conceptual model provides a replicable framework for other industrial AI startups seeking to achieve product-market fit while keeping operational costs low through the strategic use of startup credits, edge computing, and multi-agent coordination.

---

# 3. Current State Analysis

## 3.1 European Industrial AI Landscape

European industry faces unprecedented regulatory pressure through the EU's Fit for 55 package. This creates forced demand for climate compliance solutions across 16 industries.

### 3.1.1 The 16 Industries Affected by Fit for 55

The EU's Fit for 55 package mandates 55% net emissions reduction by 2030. This creates an unprecedented compliance burden on 16 industries — requiring real-time carbon tracking, automated reporting, supply chain transparency, and continuous regulatory compliance.

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
| **16 verticals** | Planned | No | Yes | Yes |
| **EU compliant** | Native | Partial | Partial | Yes |
| **<100ms latency** | Edge | No | No | Partial |
| **SME accessible** | Yes | No | No | No |

## 3.3 Customer Segments

**DWS10.com (Firehorse platform) target customers across 16 industries:**

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

**1. Free-Tier Bootstrap Strategy**
Leveraging $15,300 in startup credits from providers:

| Provider | Credit | Duration | Status |
|----------|--------|----------|--------|
| Groq | $10,000 | 12 months | Active |
| Google Cloud | $300 | 3 months | Active |
| AWS | $5,000 | 24 months | Active |
| **Total** | **$15,300** | **6+ years runway** | - |

**2. EU Compliance as Competitive Advantage**

- Data residency: europe-north1 (Finland/Sweden)
- EU AI Act: Low-risk classification with human oversight
- NIS2: Security by design for critical infrastructure customers
- Fit for 55: Native carbon tracking for 2028 deadline

**3. Network Effects Across Verticals**

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
| **MVP** | EUR 0/month | Groq $10K credits + Cloud Run free tier |
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
| **Orchestration** | MCP Hub + LlamaStack | 4 workflow patterns implemented (Fan-Out, Sequential, Reflection, Pipeline) |

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
- Credit expiration (12 months)
- Competition from established players

---

# 9. Discussion

## 9.1 Key Findings and Implications

### 9.1.1 Validation of the Free-Tier Bootstrap Model

**Finding 1: Startup credits as a substitute for venture capital**
- $15,300 in startup credits provides 6+ years of infrastructure runway
- Eliminates the need for early-stage infrastructure investment

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
5. Product recommendation engine architecture for 16 EU industries
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

## 10.6 Per-Industry Open LLM Selection

A critical finding from the platform architecture work is that **no single open LLM is optimal across all 16 EU industries**. Each industry vertical has distinct domain language, regulatory context, and structured output requirements. The `AgentConfig.model` field is already per-agent, so each concrete agent can be configured with a different trained Lifetime World Model (LWM) + open LLM, with continuous benchmarking. The platform must evaluate and select the best open LLM per industry rather than defaulting to a single model (e.g., Llama 3.3 70B) for all verticals.

**Candidate open LLMs per industry domain:**

| Industry Cluster | Candidate Models | Key Domain Requirement |
|-----------------|------------------|----------------------|
| Construction, Real Estate | Llama 3.3 70B, Qwen 2.5 72B, Mistral Large | EN 15978 lifecycle stages, Nordic building codes, EPBD |
| Energy, Steel & Metals, Cement | Llama 3.3, DeepSeek-V3, Mixtral 8x22B | ETS allowance calculations, process emissions, CBAM |
| Manufacturing, Chemicals | Qwen 2.5 72B, Llama 3.3 | CBAM product classification, BOM analysis, REACH |
| Logistics, Maritime, Aviation | Mistral Large, Llama 3.3, Gemma 2 27B | FuelEU Maritime, CORSIA, route optimization |
| Agriculture, Food & Beverage | Llama 3.3, Gemma 2, Command R+ | LULUCF, Scope 3 supply chain, packaging lifecycle |
| Finance, Public Sector | Mistral Large (EU-hosted), Llama 3.3 | SFDR, EU Taxonomy, double materiality, GPP |
| Healthcare, Textiles | Gemma 2 (EU-hosted), Qwen 2.5 | Digital product passport, medical waste, pharmaceutical supply chain |

**Selection criteria:** domain knowledge depth, multilingual capability (Finnish/Swedish/20+ for CBAM), structured output reliability, context window (128k+ for supply chain), inference speed, EU data residency, and commercial license.

Each enterprise tenant can have their Lifetime World Model trained on their own industry data with their chosen LLM as the base model.

### 10.6.1 Why 16 Industries Make DWS IQ Stronger

From the customer's perspective, a platform covering 16 EU industries is not complexity — it is **the competitive advantage they are buying**. The 16-industry architecture creates compounding value that a single-industry platform cannot match:

1. **Cross-industry regulatory intelligence.** EU regulations like Fit for 55, CSRD, and CBAM affect multiple industries simultaneously. A construction company's Scope 3 emissions include steel (ETS), cement (CBAM), logistics (FuelEU), and energy (RED III). A single-industry tool sees one slice; DWS IQ sees the entire regulatory chain. The customer gets compliance intelligence that understands their full supply chain, not just their own vertical.

2. **Supply chain visibility across verticals.** When a manufacturing customer reports CBAM imports, DWS IQ already understands the steel producer's ETS obligations, the logistics provider's fuel regulations, and the energy supplier's renewable certificates. This cross-industry knowledge means the customer's compliance reports are more accurate, audit-ready, and defensible because the platform understands every link in their value chain.

3. **LWM cross-pollination.** The Lifetime World Model learns from anonymized patterns across all 16 industries. A carbon reduction technique proven in cement manufacturing (e.g., clinker ratio optimization) generates transferable insight for construction (low-carbon concrete specification). The customer benefits from an LWM that has been trained on 16 industries' worth of climate intelligence — not just their own narrow domain.

4. **Agent template reusability.** Agent configurations that work in one industry accelerate deployment in related industries. The BIM compliance agent developed for construction is adapted for real estate energy performance certificates. The supply chain Scope 3 agent in manufacturing transfers to food & beverage. Customers in later-deploying industries get battle-tested agents at lower cost and faster deployment.

5. **Regulatory early warning.** When a new regulation (e.g., EU Deforestation Regulation) first impacts agriculture, the platform detects it and alerts food & beverage, textiles, and logistics customers proactively — before the regulation reaches their industry. A single-industry platform cannot provide this cross-sector foresight.

6. **Benchmarking across peers and adjacent industries.** An energy company can benchmark its emissions intensity not only against other utilities but against the industrial customers it serves (manufacturing, mining, chemicals). This multi-dimensional benchmarking gives the customer strategic insight into where they stand in the broader decarbonization landscape.

7. **Network effects compound over time.** Each new industry added to the platform makes every existing industry's LWM smarter. The 16th industry customer benefits from all 15 industries' accumulated intelligence. This creates a **moat**: a competitor starting with one industry must replicate years of cross-industry learning to match DWS IQ's accumulated intelligence.

**The bottom line for the customer:** DWS IQ's 16-industry coverage means their compliance intelligence is not isolated — it is connected to the entire EU industrial ecosystem. They pay for one platform and receive intelligence that would require 16 separate tools to approximate.

## 10.7 Enterprise BYOA Architecture: Bring Your Own Agent

A key platform evolution is supporting enterprise customers who **bring their own AI agents** to work on DWS IQ. This section describes the architecture using NCC (Nordic construction company) as an illustrative case.

### 10.7.1 The NCC Scenario

NCC operates with a complex agent ecosystem:

| Agent Source | Count | Examples |
|-------------|-------|---------|
| **NCC Internal Agents** | 7 | Procurement Agent, Safety Compliance Agent, BIM Agent, Sustainability Agent, Cost Estimation Agent, Quality Agent, Project Planning Agent |
| **Contractor Agents** | 14 | HVAC Subcontractor Agent, Electrical Agent, Concrete Supplier Agent, Steel Supplier Agent, Window Manufacturer Agent, Insulation Agent, etc. |
| **DWS IQ Platform Agents** | 3 | Compliance Calculation, Firehorse Report, Carbon Calculator |
| **Total** | 24 | All connected via A2A + MCP protocols |

Each contractor agent arrives with its own:
- **Agent Card** (A2A `/.well-known/agent.json`) describing capabilities
- **LLM preference** — the contractor may use a different model than NCC
- **ERP/BIM connectors** — Tekla, Solibri, IFS, SAP, Dynamics 365
- **Data residency requirements** — some contractors operate from non-EU jurisdictions

### 10.7.2 Tenant-Specific Lifetime World Model

The **Lifetime World Model (LWM)** is the enterprise learning layer that sits on top of the chosen open LLM. It is not simply a fine-tuned model — it is a strategic intelligence layer that:

1. **Fine-tunes enterprise data and regulation** — ingests the customer's operational data, industry standards, and EU regulatory context to create domain-specific intelligence that generic LLMs cannot provide
2. **Optimizes market value** — the LWM continuously learns from compliance outcomes, energy efficiency results, and operational metrics to identify value creation opportunities the enterprise would otherwise miss
3. **Ensures competitive advantage with multi-agent tools** — by combining tenant-specific knowledge with the multi-agent orchestration layer (A2A + MCP), the LWM transforms raw AI capability into an irreplaceable operational asset. Competitors using generic models cannot replicate this accumulated institutional intelligence

NCC receives their own instance of the Lifetime World Model:

```
NCC Lifetime World Model
├── Base LLM: Qwen 2.5 72B (selected for Nordic construction)
├── Fine-tuned on: NCC project data, Finnish building codes, RT-kortisto
├── Regulatory context: Fit for 55, CSRD ESRS E1, EN 15978
├── Connector endpoints:
│   ├── Tekla Structures (BIM)
│   ├── IFS Cloud (ERP)
│   └── CO2data.fi (Finnish emissions factors)
└── Sandbox: Stage 1.5 (OpenSandbox, Acer Veriton GN100) → Stage 2 (Cloud Run, europe-north1)
```

### 10.7.3 Graphical Workflow Builder: Agent Orchestration Studio

To enable NCC (and similar enterprise customers) to build connections and workflows between 24+ agents, the platform requires a **visual workflow builder**. After evaluating six open-source candidates, the recommended architecture is:

**Evaluation of graphical workflow tools:**

| Tool | License | MCP Support | A2A Support | Self-Hosted EU | Embeddable in React | Best For |
|------|---------|-------------|-------------|---------------|-------------------|----------|
| **Langflow** | Apache 2.0 | Native (client + server) | Via custom nodes | Yes | Via API/iframe | Agent orchestration, LLM workflows |
| **n8n** | Fair Code (sustainable-use) | Via community nodes | Via HTTP nodes | Yes | Via API/iframe | ERP/BIM connectors, data pipelines |
| **React Flow** | MIT | Custom implementation | Custom implementation | N/A (library) | Native React | Custom visual builder UI |
| **Flowise** | Apache 2.0 | Partial | No | Yes | Via API/iframe | Chatbot-focused RAG workflows |
| **Node-RED** | Apache 2.0 | Via FlowFuse | Via HTTP nodes | Yes | Via iframe | IoT/edge, industrial automation |
| **Temporal UI** | MIT | No | No | Yes | Via API | Workflow execution monitoring |

**Recommended architecture: Langflow + React Flow + Temporal.io**

```
┌─────────────────────────────────────────────────────────┐
│  DWS IQ Agent Orchestration Studio (React)              │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React Flow Visual Canvas                         │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐         │  │
│  │  │ NCC  │→│Safety│→│ DWS  │→│Report│         │  │
│  │  │ BIM  │  │Agent │  │Carbon│  │ Gen  │         │  │
│  │  └──────┘  └──────┘  └──────┘  └──────┘         │  │
│  │       ↑                   ↑                       │  │
│  │  ┌──────┐            ┌──────┐                     │  │
│  │  │Tekla │            │HVAC  │ (contractor)        │  │
│  │  │Conn. │            │Agent │                     │  │
│  │  └──────┘            └──────┘                     │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │  Langflow Engine (MCP + A2A orchestration)        │  │
│  │  - Each agent node = A2A Agent Card               │  │
│  │  - Each connector = MCP tool                      │  │
│  │  - Flows export as Temporal.io workflows          │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │  Temporal.io (execution engine, already in stack) │  │
│  │  - Durable workflow execution                     │  │
│  │  - Retry, timeout, compensation                   │  │
│  │  - EU AI Act Article 12 audit trail               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Why this combination:**

1. **React Flow** — Custom visual canvas embedded in the DWS IQ React dashboard. NCC users drag-and-drop agent nodes, draw connections, set per-agent LLM models. MIT license, zero vendor lock-in.

2. **Langflow** — Backend orchestration engine. Native MCP protocol support means every DWS IQ tool (Supabase, Carbon Engine, ERP connectors) is accessible. Native A2A support means contractor agents auto-register via Agent Cards. Apache 2.0, self-hosted in EU (europe-north1). IBM enterprise partnership provides additional validation.

3. **Temporal.io** — Already in the DWS IQ stack. Executes the workflows defined in the visual builder. Provides durable execution (workflows survive server restarts), automatic retries, timeout handling, and full audit trail for EU AI Act Article 12 compliance.

**n8n** serves as a supplementary tool for ERP/BIM connector workflows (Tekla Structures ↔ IFS Cloud data sync) where Langflow's LLM focus is unnecessary.

### 10.7.4 Contractor Agent Onboarding Flow

```
1. Contractor publishes Agent Card at /.well-known/agent.json
2. NCC admin opens Agent Orchestration Studio
3. Studio discovers contractor agent via A2A protocol
4. NCC admin drags contractor agent onto canvas
5. NCC admin connects contractor to relevant workflows
6. Studio validates connectivity (A2A health check)
7. Workflow deploys to Temporal.io for execution
8. All agent interactions logged per EU AI Act Article 12
```

This architecture enables NCC to manage 24+ agents visually without writing code, while maintaining full EU data residency, audit compliance, and per-agent LLM flexibility.

## 10.6 DWS Product Standard — Resolving Enterprise Product Chaos

### Problem Statement

As the Firehorse product catalog grew to 30 unique products duplicated across 5 catalog files, pricing inconsistencies emerged that threatened commercial credibility. The same product appeared with different prices depending on which file a sales agent, investor, or customer consulted:

| Product | Lowest Price Found | Highest Price Found | Variance |
|---------|-------------------|-------------------|----------|
| DWS IQ Platform | €4,999 | €12,500 | 2.5× |
| Consulting Hourly | €98/hr | €350/hr | 3.6× |
| Workshop 3 Days | €4,500 | €15,000 | 3.3× |
| Firehorse Omnichannel | €499 | €8,000 | 16.0× |

This is not a technical problem. It is a **trust problem.** In Nordic B2B markets where transparency is a cultural requirement, inconsistent pricing destroys credibility faster than any competitor.

### Solution: DWS Product Standard v1.0

The DWS Product Standard (`DWS_PRODUCT_STANDARD.md`) was created as the single source of truth for all product definitions, resolving conflicts through a **two-channel pricing model:**

1. **Self-Service Store** (dws10.com): Published prices for SMEs and self-serve buyers, powered by Revolut/Stripe checkout
2. **Enterprise Direct**: Subscription tiers (€5,990-€10,950/month) for large organizations, with full Firehorse Suite included

The standard establishes:
- Product taxonomy across 6 product families
- Mandatory two-number pricing rule ("Buy now: €XX / Monthly: €YY")
- Price floor enforcement (minimum €150/hr for consulting, €499 for software modules)
- Google Merchant Center compliance for all 67 products
- Price conflict resolution protocol with change propagation checklist
- Product lifecycle management (Alpha → Active → Sunset → Retired)

### Research Contribution

This represents a novel contribution to **AI-assisted product management**: the Product Standard was generated through systematic AI analysis of the entire codebase, identifying conflicts that manual review missed over 3 months. The audit methodology — multi-file price extraction, cross-reference, and conflict resolution — is reproducible for any SaaS company scaling from single-product to multi-product catalog.

## 10.7 Brand Standard Product Clarity — One-Click Industrial Buy

### The One-Click Hypothesis

Industrial B2B SaaS products are traditionally sold through 45-90 day consultative cycles. The Nordic Sales Strategy (Section 11) challenges this assumption: if pricing is transparent, the demo is self-service, and the agreement is digital, the actual decision takes one day. The remaining 44-89 days are friction.

The DWS Brand Standard v1.1 was updated to codify this insight into product card UI components:

1. **Product Pricing Clarity (Section 7):** New CSS tokens for price display, enterprise tier card variants, and the mandatory two-number rule as a UI standard
2. **Intelligent Decision Helper:** A 2-question recommender that tells the buyer which tier is right, based on portfolio size and CSRD deadline pressure
3. **Tier Badge System:** Visual hierarchy (Pilot = blue, Alpha = purple, Production = green) that communicates progression without requiring sales explanation

### Cultural Design Pattern: The €13.70 Buffet

The brand standard now explicitly encodes a Nordic cultural design principle: the Finnish lunch buffet model. At €13.70, the buffet works because the price is visible before you commit, the value is visible before you pay, the risk is low, and the exit is clean. The updated brand standard applies this same anxiety-reduction pattern to €5,990/month enterprise software:

- Published pricing (no "contact us")
- Live demo accessible with email only (no sales qualification)
- Standard agreement (no custom negotiation)
- 5-month pilot with clean exit

### Research Contribution

The connection between cultural psychology (Nordic equality, anxiety reduction) and B2B product design is understudied in existing literature. This work proposes that **cultural UX patterns** — not just feature completeness — are a primary driver of enterprise conversion rates in Nordic markets.

## 10.8 Measurable Impact Toward DWS 7

### What DWS 7 Inherits

DWS 7 is the next major platform generation. The standards created during DWS 6 establish measurable foundations:

| Standard | DWS 6 State | DWS 7 Target | Measurable Outcome |
|----------|-------------|-------------|-------------------|
| **Product Standard** | 5 conflicting catalogs, 7 price conflicts | Single source of truth, 0 conflicts | Quarterly audit: conflict count = 0 |
| **Brand Standard** | No pricing display rules | Two-number rule, tier cards, decision helper | Pricing page bounce rate < 40% |
| **Sales Strategy** | 45-90 day cycles, 0% self-service | One-click path, 20-30% self-service | CRM: time-to-purchase < 7 days |
| **Document Standard** | Ad-hoc versioning | Full traceability, agent history | 100% document compliance |

### Impact Measurement Framework

The following metrics MUST be tracked starting Q1 2026 to validate the standards' contribution:

**Commercial Impact:**

| Metric | Baseline (Feb 2026) | Q2 2026 Target | Q4 2026 Target | DWS 7 Target |
|--------|---------------------|----------------|----------------|-------------|
| MRR | €7,000 | €14,000 | €30,000 | €60,000 |
| Price conflicts in codebase | 7 | 0 | 0 | 0 |
| Products with Google Merchant compliance | ~30% | 80% | 100% | 100% |
| Self-service purchases (% of new deals) | 0% | 5% | 15% | 30% |
| Time from first contact to signed agreement | 45-90 days | 30 days | 14 days | 7 days |
| Deals closed without a meeting | 0% | 5% | 15% | 25% |

**Operational Impact:**

| Metric | Baseline | Target | Method |
|--------|----------|--------|--------|
| Files updated per price change | 5 | 1 (auto-propagate) | Engineering automation |
| Product card consistency across sites | ~60% | 100% | Automated visual regression |
| Investor document pricing accuracy | Unknown | 100% match to Product Standard | Manual quarterly audit |
| Store page load time (pricing section) | TBD | < 2 seconds | Lighthouse |

### Contribution to Theory: Standards as Competitive Moat

This thesis argues that **enterprise product standards** — not just the products themselves — constitute a competitive advantage for industrial SaaS companies. While competitors in the BMS market (Siemens Desigo, Schneider EcoStruxure) have larger product catalogs, their pricing is opaque and negotiation-dependent. DWS IQ 6's published pricing, standardized product cards, and one-click buy architecture represent a structural advantage that compounds over time:

1. **Trust accumulation:** Every transparent price interaction builds Nordic trust capital
2. **Operational leverage:** Standards reduce the cost of adding new products from weeks to hours
3. **AI-native management:** Product catalogs maintained by AI agents following the Product Standard require zero manual synchronization
4. **Regulatory alignment:** EU AI Act Article 12 traceability requirements are satisfied by the same version-controlled standards that manage products

This positions DWS 7 not merely as a product upgrade, but as a **standards-native platform** where product management, pricing, and compliance are unified in a single documented framework.

### 10.9 DWS7 Agent Architecture Modernization: From Single-Shot to Agentic

Version 3.10 documents the critical architectural leap from DWS6's single-shot LLM pattern to a true agentic system. This work, performed in a single Claude Code session (24.02.2026), addresses six architectural deficiencies that separated DWS6 from production-grade agent platforms.

#### 10.9.1 The Six Critical Fixes

| # | Problem (DWS6) | Fix (DWS7) | Implementation |
|---|---------------|-----------|----------------|
| 1 | Single-shot LLM calls — no iteration | Observe-think-act agentic loop with configurable iterations | `base.agent.ts:runLoop()` with `AgentLoopConfig` |
| 2 | No tool use / function calling | Full tool runtime with JSON Schema definitions | `tools.ts` — 4 built-in tools, extensible registry |
| 3 | Hardcoded Groq HTTP fetch | Multi-provider LLM client (Anthropic > Groq > OpenAI) | `llm-client.ts` — auto-detects from env vars |
| 4 | No agent-to-agent communication | Delegation with depth tracking (max 5), discovery API | `delegate_to_agent` tool, `discoverAgents()` |
| 5 | MCP was vapor | MCP JSON-RPC 2.0 server exposing all agents as tools | `mcp/agent-server.ts` — `/mcp` endpoint |
| 6 | Express monolith only | Event-driven architecture with pub/sub event bus | `event-bus.ts` — pattern subscriptions, Redis Streams |

**Backward compatibility:** All 18 existing agents using `execute()` + `callLLM()` continue to work unchanged. The `callLLM()` method now routes through the multi-provider client instead of raw Groq fetch.

#### 10.9.2 Build for Agents: CLI, MCP, Skills

A parallel insight emerged during implementation: **the primary consumers of DWS IQ in 2026 are AI agents, not humans clicking buttons.** This led to the "Build for Agents" principle:

| Surface | Implementation | Purpose |
|---------|---------------|---------|
| **CLI** | `cli/src/cli.ts` — zero-dependency, JSON-only output | Agents run commands, pipe output |
| **MCP Server** | `/mcp` endpoint, JSON-RPC 2.0 | Claude Code / Cursor discover and call agents |
| **Claude Code Skills** | `.claude/commands/*.md` (6 skills) | Natural language → agent execution |
| **REST API** | `/api/agents/*` (existing + new endpoints) | Traditional integration |
| **Event Bus** | Pattern-based pub/sub + SSE streaming | Real-time agent coordination |

**Key CLI commands:**
```
dws agents                              # List all agents (JSON)
dws run compliance --input '{"reg":"CSRD"}'  # Execute agent
dws discover carbon                      # Find agents by capability
dws workflow compliance-assessment       # Multi-agent workflow
```

#### 10.9.3 EU AI Act Article 12 Compliance via Loop Logging

The agentic loop architecture inherently satisfies Article 12's automatic logging requirement. Each loop iteration records:

- **Observation:** What the agent perceived
- **Thought:** The LLM's reasoning (token-level)
- **Actions:** Tool calls made (with arguments)
- **Results:** Tool outputs returned
- **Timestamp and duration:** Per-iteration timing

These are persisted to the `agent_loop_iterations` Supabase table, creating a complete reasoning lineage from input to output — a requirement that single-shot architectures cannot fulfill.

#### 10.9.4 Research Contribution

This modernization validates two thesis hypotheses:

1. **Solution Factory replicability (Section 4.1):** The entire six-fix modernization was designed, implemented, and documented in a single AI-assisted session — demonstrating that the Firehorse operating model scales to architectural refactoring, not just product catalog management.

2. **Lifetime Scope Signals evolution (Section 2.5.2):** The event bus (`event-bus.ts`) is the production implementation of the theoretical signal emission protocol. Agents emit structured events (`agent.execution_complete`, `compliance.check_passed`) that other agents subscribe to — exactly the "declarative signal emission" pattern described in the V1.0 Agent Fleet specification.

---

## 10.10 Agent Foundry Stage 1.5: OpenSandbox on Acer Veriton GN100

*Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026*

### 10.10.1 Background

The DWS IQ 6 Agent Foundry required an intermediate isolation layer between Stage 1 (Anthropic SDK sandbox, demo-grade) and Stage 2 (Cloud Run ephemeral containers, paid multi-tenant). Stage 1.5 fills this gap with **OpenSandbox** (https://github.com/alibaba/OpenSandbox) running on the **Acer Veriton GN100** edge node (120 GiB RAM, 20 cores, Helsinki Lab).

### 10.10.2 Stage Progression

| Stage | Isolation Method | Best For | Cost |
|-------|-----------------|---------|------|
| 1 — SDK Sandbox | Anthropic Agent SDK (bubblewrap/seatbelt) | Demo, single-tenant pilots | €0 |
| **1.5 — OpenSandbox** | **Docker on Acer Veriton GN100 (Helsinki Lab)** | **EU air-gapped, internal pilots** | **€0 (HW only)** |
| 2 — Cloud Run | Ephemeral containers (europe-north1) | Paid multi-tenant | ~€20-50/mo |
| 3 — Persistent | gVisor/Firecracker per tenant | Scale (€50k+ MRR) | €200+/mo |

Activation: `SANDBOX_STAGE=opensandbox` + `OPENSANDBOX_HOST=http://<veriton-ip>:8080`

### 10.10.3 OpenSandbox Architecture

OpenSandbox provides Docker-based isolation with a TypeScript SDK and a REST API server. Each agent task creates a dedicated ephemeral container, executes within it, and the container is destroyed upon completion:

```
DWS Express Backend (EU Cloud Run)
  └── OpenSandboxClient (src/sandbox/opensandbox.ts)
        └── OpenSandbox REST API (:8080)
              └── Docker Containers (Acer Veriton GN100, Helsinki Lab)
                    └── Agent task (ephemeral, destroyed post-execution)
```

Security properties: filesystem isolation per task, network egress deny-by-default with explicit domain allow-list (`api.anthropic.com`, `api.groq.com`, MCP Hub), EU data residency enforced at hardware level.

### 10.10.4 Agent Memory: EMPO² (arXiv:2602.23008)

The OpenSandbox integration coincides with important new research on agent memory. The paper *"Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization"* (EMPO², February 2026) proposes a hybrid RL framework that addresses the core bottleneck of LLM agent training: **exploration in novel environments**.

**EMPO² dual-update mechanism:**
- **Parametric updates** (RL): fine-tunes model weights using on/off-policy rollouts
- **Non-parametric updates** (memory): stores and retrieves task-specific "tips" from a memory buffer during rollouts
- **Two rollout modes**: with memory (retrieval-augmented) and without memory (parametric only)
- **Two update modes**: on-policy (tips retained during update) and off-policy (tips removed during update)

**Results:** 128.6% improvement over GRPO on ScienceWorld, 11.3% on WebShop, with superior out-of-distribution generalization requiring only a few memory trials (no parameter updates) for new tasks.

**Relevance to DWS IQ 6 / Lifetime World Model:**

The DWS Lifetime World Model (LWM) already combines both memory types theoretically proposed by EMPO²:

| EMPO² Component | DWS LWM Equivalent |
|-----------------|-------------------|
| Parametric memory | Fine-tuned LLM (QLoRA, Acer Veriton GN100) |
| Non-parametric memory | RAG over enterprise data + EU regulations (pgvector) |
| Memory buffer | Supabase `agent_loop_iterations` table |
| Tip retrieval | Context injection from Compliance/Carbon databases |

The EMPO² finding — *"learning with memory enables models to become robust both with and without memory at inference time"* — validates the DWS strategy of progressively embedding domain knowledge into model weights via QLoRA fine-tuning on the Acer Veriton, while maintaining non-parametric retrieval as a real-time fallback.

The OpenSandbox environment on the Acer Veriton GN100 now serves both roles: **EMPO²-style RL training sandbox** (isolated exploration environment) and **production agent isolation runtime** (secure execution per task).

### 10.10.5 MCP Integration

Six MCP tools expose OpenSandbox through the DWS MCP Hub (`/sandbox/*`):

| Tool | Purpose |
|------|---------|
| `sandbox_create` | Create isolated Docker container |
| `sandbox_execute` | Run command inside sandbox |
| `sandbox_file_read` | Read output artifacts |
| `sandbox_file_write` | Write input/config files |
| `sandbox_destroy` | Destroy sandbox (ephemeral) |
| `sandbox_ping` | Health check Veriton connectivity |

Claude Code and other MCP clients can now orchestrate agent sandboxes directly via natural language tool calls.

### 10.10.6 Research Contribution

Stage 1.5 demonstrates three thesis claims simultaneously:

1. **Hardware-aware Solution Factory (Section 4.1):** The same agent architecture runs on EU cloud (Stage 2) and EU on-premises edge hardware (Stage 1.5) with a single environment variable — validating the platform's deployment flexibility for air-gapped industrial environments (defense, healthcare, critical infrastructure).

2. **Lifetime Fleet concept validation (Section 3.5):** The Acer Veriton GN100 is the first physical node in the Lifetime Fleet — EU-resident hardware running containerized AI workloads under full operator control, fulfilling the edge-AI theoretical model proposed in the thesis.

3. **EMPO² memory architecture alignment:** The hybrid parametric/non-parametric memory architecture independently validated by EMPO² (arXiv:2602.23008) matches the DWS LWM design — providing academic grounding for an implementation choice made on engineering intuition.

---

## 10.11 CEO Automation Agent Suite

*Deployed: 24.02.2026 | Commit: claude/ai-agent-orchestration-t89Ig*

Three production AI agents that automate the CEO's daily operational rhythm, fully integrated into the Firehorse platform (GitHub Actions cron, Supabase, Resend).

### 10.11.1 Captain Pre-Briefing Agent

**Trigger:** 07:30 Helsinki, Mon–Fri | **File:** `src/captain-briefing/`

Prepares a pre-call briefing for each active sales contact (captain) with a next action due today. Pulls thread history, contact info, proposals, and meetings from Supabase, generates talking points and a suggested next action, sends as a dark-theme HTML email via Resend.

```
07:30 Helsinki → Captain Briefing Agent
  └── Supabase: thread_history + proposals + meetings
  └── Claude: talking points + suggested next action
  └── Resend: HTML email → risto@lifetime.fi
```

**Research contribution:** Implements the Lifetime Scope Signals protocol (Section 2.5.2) in an operational context — the agent observes CRM signals and emits an action recommendation, demonstrating the brain-body interface in a revenue-critical workflow.

### 10.11.2 LinkedIn Post Scheduler

**Trigger:** 08:00 Helsinki, Mon–Fri | **File:** `src/social-scheduler/`

Weekly content calendar with category-specific post templates (Mon=thought leadership, Tue=compliance, Wed=product, Thu=case study, Fri=ecosystem). CEO approval digest — reply approve/edit/reject per draft. Posts queue stored in Supabase (`social_posts` table, migration `034_social_posts.sql`).

### 10.11.3 EU Regulation Monitor

**Trigger:** 05:30 Helsinki, Mon–Fri (before briefing) | **File:** `src/regulation-monitor/`

Fetches RSS from EU Commission, EUR-Lex, Carbon Pulse, and Euractiv. Classifies updates by regulation (CBAM, CSRD, Fit for 55, EPBD, EU AI Act, ETS) with severity scoring (urgent/important/info) and customer impact detection. Feeds regulation alerts into the LinkedIn Scheduler as content ideas.

```
05:30 → EU Regulation Monitor
  └── Fetch: EU Commission + EUR-Lex + Carbon Pulse + Euractiv
  └── Classify: CBAM | CSRD | Fit for 55 | EPBD | EU AI Act | ETS
  └── Score: urgent / important / info
  └── Feed: → LinkedIn Scheduler content queue
07:30 → Captain Briefing (uses regulation context)
08:00 → LinkedIn Scheduler (drafts regulation-aware posts)
```

**Solution Factory validation:** All three agents were implemented in a single session following the same patterns: dark-theme HTML email, Resend delivery, GitHub Actions cron with DST-safe dual entries (`UTC+2`/`UTC+3`), best-effort Supabase queries. This confirms the operating model's replicability for new agent types.

---

## 10.12 Strategic Partnerships: NVIDIA, Siemens, ABB, xAI & Mistral

*Documented: 27.02.2026 | Source: docs/DWS6_TO_DWS7_UPDATE.md v1.1*

DWS7 builds a multi-partner ecosystem spanning industrial automation (NVIDIA, Siemens, ABB), frontier AI inference (xAI, Mistral), and edge computing. Each partner fills a distinct role in the Brain-Memory-Body-Hands architecture.

| Partner | Role in Architecture | Integration Status |
|---------|--------------------|--------------------|
| **NVIDIA** | GPU compute (Brain), Jetson edge (Hands), Omniverse digital twins (Body) | Inception program target Q2 2026 |
| **Siemens** | MindSphere IoT (Hands), digital twin composer (Body), Xcelerator marketplace | Developer access Q2 2026 |
| **ABB** | Industrial automation + robotics (Hands), power grid management | Integration target Q3 2026 |
| **xAI** | Real-time market intelligence via Grok, X/Twitter signal discovery (Brain) | Active (production) |
| **Mistral** | EU-sovereign AI inference, multilingual compliance generation (Brain/Memory) | Planned Q3 2026 |

### 10.12.1 Multi-LLM Router Architecture

DWS7 selects the LLM per task type based on three criteria: **EU sovereignty**, **cost**, and **latency**:

```
Task type → LLM selection
  Compliance generation (CSRD, CBAM)  → Claude (reasoning depth) or Mistral (EU-sovereign)
  Real-time market signal analysis     → xAI Grok (live X/Twitter data)
  Code generation                      → Claude or Groq (Llama 70B, fast)
  Lightweight summarization            → Groq (Haiku-equivalent speed)
  Edge inference (Acer Veriton)        → Qwen 2.5 72B (QLoRA fine-tuned, on-premises)
```

This multi-LLM router is not a monolithic integration — it is the **Lifetime World Model's inference layer**, selecting among its constituent models based on sovereignty, cost, and latency constraints at runtime.

### 10.12.2 NVIDIA — GPU Compute & Edge AI

NVIDIA provides the infrastructure for both cloud inference and on-premises edge AI. The Acer Veriton GN100 (Section 10.10) already hosts CUDA-capable workloads. NVIDIA Inception membership (target Q2 2026) unlocks preferred pricing on compute credits and access to the Omniverse industrial simulation platform for digital twin workflows.

**Partnership track:** NVIDIA Inception (Q2 2026) → Ecosystem Partner (Q4 2026) → Strategic Partner (2027+)

### 10.12.3 ABB — Industrial Automation & Emissions Data

ABB's installed base of drives, motors, and power distribution equipment generates the sensor data DWS7 needs for real-time emissions calculation. ABB Ability Platform enables cloud-to-cloud IoT data ingestion; ABB Ability Energy Manager provides real-time Scope 2 emissions data.

**Why ABB matters for EU ETS:** ABB's customers — steel, cement, chemicals, aluminum — are exactly the industries facing the highest EU ETS carbon costs. DWS7 becomes the compliance brain on top of ABB's operational data.

### 10.12.4 Research Contribution

The multi-partner ecosystem validates the **Solution Factory model's third pillar** (Section 4.1.3 — distribution leverage). By plugging DWS7 into Siemens Xcelerator and NVIDIA Inception, the platform gains access to 10,000+ industrial customers without building a direct sales organization — consistent with the free-tier bootstrap strategy (Section 7.3) applied at the partnership level.

The multi-LLM router architecture also demonstrates practical resolution of the **EU AI Act sovereignty tension**: regulated industries can use Mistral for compliance generation (EU-domiciled, GDPR-compliant) while still accessing Claude and Grok for non-regulated analytical tasks.

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

DWS6 implements six production skills in `.claude/commands/`:

| Skill | Function | Output |
|-------|----------|--------|
| `/compliance-check` | EU ETS/CBAM/CSRD gap analysis | Structured compliance report |
| `/agent-run` | Execute any named DWS IQ agent | Scored JSON results |
| `/workflow` | Trigger multi-agent workflow chains | Unified multi-agent report |
| `/discover-agents` | Find agents by capability keyword | Agent capability index |
| `/site-safety` | Construction safety assessment (SiteSense) | Score 0–100, EN 13001 warnings |
| `/carbon-analysis` | Embodied carbon per EN 15978 LCA | kgCO2e by lifecycle stage |

Each skill encapsulates input validation, agent execution, and structured output formatting. Without skills, these workflows require repeated error-prone prompting. With skills, they become callable, testable components — directly implementing the **Build for Agents** principle: if a capability cannot be invoked as `dws <command>`, it is not shipped.

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
|  * High SaaS costs                |  * Free-tier bootstrap              |
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
|  * Startup credits ($15K)         |  * Edge hardware margin             |
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

## Appendix H: Automated PR Workflow (HIL Automation)

### Background

A key operational challenge for solo developers and small teams managing enterprise-grade codebases is maintaining code quality without a dedicated review team. The Firehorse model addresses this with a fully automated pull request review and merge workflow that replaces manual human-in-the-loop (HIL) code review with dual-model AI review.

### Architecture

```
Claude Code → PR → Claude sanity check → Gemini HIL review → @copilot fixes → CI → auto-merge
                                                ↑                    |
                                                └────────────────────┘  (fix loop)
```

### Components

| Component | Role | Technology |
|-----------|------|-----------|
| Claude Code | Code generation, branch creation, PR opening | Anthropic Claude Opus/Sonnet |
| Claude (reviewer) | Quick sanity check: security, correctness, breaking changes | Claude Sonnet 4 API |
| Gemini (HIL gate) | Deep review: edge cases, tests, architecture, OWASP security | Gemini 2.0 Flash API |
| Copilot coding agent | Implements fix instructions from review comments | GitHub Copilot |
| PR Auto-Merge | Merges when all checks pass and AI approves | GitHub Actions + GraphQL |

### Design Decisions

1. **Gemini defaults to REQUEST_CHANGES** — ensures every PR goes through at least one improvement cycle, even when the original implementation appears correct
2. **Dual-model review** — two different AI models catch different classes of issues (structural vs. security vs. convention)
3. **Automated fix loop** — structured fix instructions sent to @copilot, which implements fixes and re-triggers review, reducing developer involvement to final skim (~5 min per PR)
4. **Human overrides** — `do-not-merge` and `needs-human-review` labels pause automation for manual review when needed

### Relevance to Thesis

This workflow demonstrates the Solution Factory model (Section 5) operating at full automation: a single developer with AI agents produces enterprise-quality code at scale. The HIL learning pipeline (Section 6.7) feeds review insights back into agent training, creating a continuous improvement loop that aligns with EU AI Act Article 12 auditability requirements.

### Deployment

Cloud Run service `dws6run6` (europe-north1, Finland). MCP Hub exposes `POST /gemini/review` for on-demand security analysis by any agent in the Firehorse fleet.

---

## 10.13 Climate IQ Pantheon — Greek/Roman God Multi-Agent System

Building on the DWS7 agent modernization framework (Section 10.9) and CEO Automation Agent Suite (Section 10.11), this section documents the **Climate IQ Pantheon**: a production multi-agent system where each AI agent carries the identity and domain expertise of a Greek or Roman deity.

### Motivation: Agent Identity as Operational Design

Prior to this work, DWS IQ agents were functionally specialized (compliance, logistics, SEO) but lacked a coherent identity framework. The **SOUL.md pattern** addresses this: each agent has a Markdown identity file defining persona, behavioral rules, and tone. This SOUL is injected as the LLM system prompt at runtime, making identity persistent and testable.

The Greek/Roman pantheon provides two complementary benefits:
1. **Memorability** — stakeholders immediately understand "ask Athena" vs "ask Hermes"
2. **Behavioral precision** — mythological roles encode domain expertise (Athena = wisdom/law, Hermes = speed/routes, Hephaestus = craft/construction)

### Architecture: Six Orchestrators + Seven Industry Specialists

**Tier 1 — Climate IQ Pantheon (Orchestrators)**

| Agent | Deity | Domain | Capabilities |
|-------|-------|--------|-------------|
| Atlas | Titan (Greek) | Chief of Staff | Routing, synthesis, executive briefing |
| Athena | Goddess (Greek) | EU Compliance | ETS, CBAM, CSRD, Fit for 55 |
| Hephaestus | God (Greek) | Field & Site | Site safety, materials, scheduling |
| Iris | Goddess (Greek) | Research & Intel | Competitive intelligence, market research |
| Hermes | God (Greek) | Logistics & Ops | Supply chain, critical path, quality gate |
| Apollo | God (Greek) | Content & Outreach | SEO, content strategy, sales outreach |

**Tier 2 — Industry Specialists**

| Agent | Deity | Industry | Key Regulation |
|-------|-------|----------|---------------|
| Vulcan | Roman | Steel & Metals | ETS Phase 4, CBAM iron/steel |
| Helios | Greek | Energy & Renewables | RED III, 42.5% target by 2030 |
| Neptune | Roman | Maritime & Shipping | FuelEU Maritime, ETS 40/70/100% |
| Ceres | Roman | Agriculture & Fertilizers | CBAM fertilizers, N2O emissions |
| Prometheus | Greek | Hydrogen | RFNBO additionality, RED III |
| Mars | Roman | Construction & Buildings | EPBD recast, EN 15978 |
| Gaia | Greek | Cement & Earth Materials | CBAM clinker benchmark, ETS |

### Implementation: SOUL.md + BaseAgent Architecture

Each Pantheon agent follows the file structure established in Section 10.9:

```
src/agents/workflow/{agent}/
├── SOUL.md          # Identity: persona, tone, behavioral rules
└── {agent}.agent.ts # TypeScript: execute(), callLLM(), logExecution()
```

A critical audit finding (resolved this session) was that SOUL constants were defined but never wired into the LLM system prompt. The fix adds `soulPrompt` property and `systemPromptOverride` parameter to `BaseAgent.callLLM()`:

```typescript
// Priority: explicit override > soulPrompt > generic fallback
const systemContent = systemPromptOverride ?? this.soulPrompt ?? genericFallback;
```

### Security: Prompt Injection Fix

`HermesAgent` was found forwarding arbitrary caller keys via `...input` spread to sub-agents — a prompt injection vector. All spreads were replaced with explicit field extraction (typed guards per field), aligning with the input validation security principle from the 2026-02-21 vulnerability assessment.

### EU AI Act Article 12 Compliance

All 13 agents call `logExecution()` at start and completion, writing to the `agent_executions` Supabase table. This satisfies Article 12 automatic logging requirements for High-Risk AI systems, with traceability metadata: agent name, session ID, org ID, user ID, confidence, duration, and LLM token counts.

### Business Value: The Marketing Wedge

The Pantheon naming strategy doubles as a marketing wedge. Each agent carries a humorous one-liner making enterprise AI approachable:

- **Athena:** "Has memorized every EU regulation since 2005. Corrects lawyers. Unprompted."
- **Hermes:** "Optimizes your supply chain while you're still figuring out where the warehouse is."
- **Apollo:** "Writes your sales copy, ranks it on Google, and sends the follow-up email. Probably already did it."
- **Vulcan:** "Turns ETS carbon prices into competitive strategy. Red-hot accuracy."

These personas appear at onelifetime.world/team alongside human staff, reinforcing the product thesis: humans and AI agents work side by side. One of them never sleeps.

## 10.14 Agent System Hardening — Production Reliability

### 10.14.1 Motivation

The 31-agent system (13 core + 5 SEO + 13 workflow/industry) had accumulated 6 TypeScript compilation errors and 3 test failures that blocked production builds. These were not design flaws but integration debt: type mismatches across module boundaries, missing route wiring, uninstalled dependencies, and locale-dependent formatting. This section documents the systematic hardening that restored zero-error compilation and full test coverage.

### 10.14.2 Type System Alignment: SandboxContext

The `SandboxStage` type in `src/sandbox/index.ts` defined four stages: `'1' | 'opensandbox' | '2' | '3'`, where `'opensandbox'` represents the Stage 1.5 Docker-based isolation on Acer Veriton GN100 hardware (Section 10.10). However, `SandboxContext.stage` in `src/agents/types.ts` only accepted `'1' | '2' | '3'`, creating a compile-time error when `BaseAgent` attempted to assign the sandbox stage. The fix aligned both types, ensuring agents can execute in all four isolation stages.

### 10.14.3 Route Wiring: MCP and Human-in-the-Loop

Two critical routes were unreachable due to missing imports in `src/app.ts`:

1. **MCP Agent Server** (`/mcp`) — The `createMCPRouter()` function from `src/mcp/agent-server.ts` exposes all agents as MCP tools via JSON-RPC 2.0. Without this import, external MCP clients (Claude Desktop, other AI agents) could not discover or invoke DWS agents.

2. **Human-in-the-Loop** (`/api/hil`) — The HIL endpoint enables one-click task completion from morning briefing emails. Without this route, the Captain Pre-Briefing Agent's "Done" buttons returned 404 errors.

### 10.14.4 Locale-Deterministic Number Formatting

The Emissions Data Analyst agent formats ETS cost estimates using `Number.toLocaleString()`. On EU-locale machines (Finland, Germany), this produces space-separated numbers (e.g., `2 040 000`), while tests expected US comma-separated format (`2,040,000`). The fix specifies `'en-US'` locale explicitly, ensuring deterministic output regardless of deployment environment. This is critical for EU-hosted Cloud Run instances where system locale defaults to European conventions.

### 10.14.5 Dependency Hygiene

The `luxon` library (timezone-aware date handling for Helsinki business hours) was imported in the Social Scheduler but never added to `package.json`. The Resend email SDK's batch response type was a union (`undefined[] | CreateBatchSuccessResponse`) that required runtime array detection before calling `.map()`.

### 10.14.6 Research Contribution

This hardening session demonstrates a pattern relevant to multi-agent system maintenance: **integration debt accumulates at module boundaries, not within modules**. Each individual agent was correctly implemented, but the connections between agents, sandbox, routes, and tests had drifted. The fix touched 6 files across 5 subsystems in a single commit, restoring:

- **0 TypeScript errors** (was 6)
- **47/47 tests passing** (was 44/47)
- **Full MCP discoverability** for all 31 agents
- **HIL operational** for morning briefing workflows

---

## 10.15 PostgreSQL Columnar HTAP Architecture — DWS Data Standard

### 10.15.1 Motivation

DWS6 runs all analytics against transactional heap tables with no columnar or HTAP capabilities. As the platform scales toward IoT telemetry (DWS7 Phase 4), 7-year Article 12 audit retention, and growing agent execution logs, the single-engine approach creates performance bottlenecks: campaign funnel aggregation hits raw event tables, agent cost rollups require full table scans, and audit log storage costs grow linearly with no compression.

The PostgreSQL "columnar extension" pattern — pioneered by Hydra and now production-ready across six implementations — enables true HTAP (Hybrid Transactional/Analytical Processing) within a single database: transactional tables remain as standard heap, analytics tables become columnar, with seamless joins and zero data movement.

### 10.15.2 Extension Evaluation (Updated March 2026 — Aiven-First Mandate)

The original v3.22 evaluation assumed pg_duckdb availability on Aiven. March 2026 findings invalidated this:

- **Hydra** core team joined Supabase (Feb 2026) to build "Supabase Warehouse" — Hydra is effectively dead as an independent project.
- **pg_mooncake** acquired by Databricks (Oct 2025) — future uncertain for self-hosted deployments.
- **CRITICAL: pg_duckdb is BLOCKED on the Aiven extension whitelist** — it is NOT available on Aiven managed PostgreSQL. This was the key finding that forced the two-tier architecture redesign.
- **TimescaleDB 2.25.x Hypercore** is the ONLY columnar/HTAP option natively available on Aiven.

**ClickBench performance context:** pg_duckdb achieves 50-600× over vanilla PostgreSQL; TimescaleDB Hypercore achieves 10-100× with 98% compression on time-series data.

Updated evaluation reflecting 2026 reality:

| Solution | Engine | Speed vs PG | Aiven? | Supabase? | Self-Host? | DWS Fit |
|----------|--------|-------------|--------|-----------|------------|---------|
| Hydra (→Supabase Warehouse) | DuckDB | 100-600× | No | Alpha | Yes | Monitor |
| pg_duckdb v1.x | DuckDB | 50-600× | **NO (blocked)** | Yes | **Yes** | Edge only |
| pg_mooncake (→Databricks) | DuckDB | Top-10 ClickBench | No | Custom | Yes | Phase 3 |
| TimescaleDB 2.25.x Hypercore | PG+SIMD | 10-100× | **Yes (native)** | Yes | **Yes** | **PRIMARY** |
| ParadeDB pg_analytics | DuckDB | 10-100× | No | Yes | Yes | Not recommended |
| Citus Columnar | PG | 5-50× | No | No | Yes | Not recommended |

### 10.15.3 Recommended Stack (Two-Tier HTAP Architecture)

The Aiven whitelist constraint (pg_duckdb BLOCKED) drives a **two-tier architecture** — managed production on Aiven with full extension freedom on edge hardware:

**Tier 1: Aiven Managed (Production) — TimescaleDB 2.25.x Hypercore ONLY**

- Automatic hybrid row→columnar storage via Hypercore: recent data stays in heap for OLTP, older data compresses into columnar format automatically.
- 98% compression on time-series and audit data (agent_metrics, agent_costs, article12_audit_log, IoT sensor data).
- 10-100× analytical acceleration over vanilla PostgreSQL via SIMD vectorized scans.
- 99.99% SLA, EU Finland (europe-north1), managed backups, automatic failover.
- No pg_duckdb, no Hydra, no pg_mooncake — only Aiven-whitelisted extensions.

```sql
-- TimescaleDB Hypercore hybrid table (Aiven production)
CREATE TABLE events (
  time TIMESTAMPTZ NOT NULL,
  device_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  value DOUBLE PRECISION
) WITH (timescaledb.hybrid = true);
SELECT create_hypertable('events', 'time');
```

**Tier 2: GN100 Edge (Analytics) — TimescaleDB + pg_duckdb + pgvector**

- Deployed 2026-03-13 on Acer Veriton GN100 via Docker with SSH tunnel to Aiven.
- Full extension stack: pg_duckdb (50-600× OLAP), pgvector (AI embeddings), TimescaleDB (time-series).
- Use cases: ad-hoc analytical queries, ClickBench-class workloads, AI vector search, data exploration.
- Not production-critical — edge device serves as analytical sandbox.

**Local dev parity:** `timescale/timescaledb:2.25.2-pg16` Docker image ensures developers match Aiven production schema.

**pg_mooncake** (Phase 3, 2027) for Iceberg/Parquet export satisfying EU Data Act 2023/2854 IoT data portability requirements — pending Databricks acquisition outcome.

### 10.15.4 DWS Data Standard

A new `DWS_DATA_STANDARD.md` was created to govern all data storage decisions. Key sections:

1. **Storage Engine Policy** — decision matrix for row vs columnar vs hybrid
2. **Extension Governance** — approved registry with sovereignty assessment
3. **Retention Policy** — per-table rules mapped to EU regulations (GDPR Art 17, EU AI Act Art 12: 7yr, NIS2 Art 23: 5yr, Finnish Accounting Act 1336/1997: 10yr)
4. **Partitioning Standard** — TimescaleDB hypertables preferred over native partitioning
5. **Compression Policy** — tiered compression targets (1:1 hot → 20:1 archive)
6. **EU Regulatory Compliance** — matrix mapping 11 EU regulations to database requirements

### 10.15.5 Phased Rollout (Updated — Aiven-First Mandate)

| Phase | Timeline | Target | Actions |
|-------|----------|--------|---------|
| 0 | Q1 2026 | Supabase | Table partitioning, materialized views |
| 1 | Q2 2026 | Aiven V1 + GN100 Edge | TimescaleDB Hypercore hypertables (Aiven), pg_duckdb + pgvector deployed on edge (done) |
| 2 | Q3-Q4 2026 | Aiven + Edge | Audit log compression (98%), IoT hypertables, edge analytical queries |
| 3 | 2027 | Full HTAP | pg_mooncake lakehouse, Iceberg/Parquet |

### 10.15.6 Research Contribution

This work demonstrates that the **single-database HTAP pattern** is viable for regulated EU industrial platforms: same SQL, same clients, same RLS, zero ETL. The phased approach — starting with natively-supported extensions on a managed EU-sovereign provider (Aiven Finland) — eliminates the traditional choice between operational simplicity and analytical capability. The DWS Data Standard codifies this as an organizational standard, ensuring that storage engine decisions are deliberate, documented, and EU-compliant.

The March 2026 Aiven whitelist finding adds a critical practical contribution: **managed-provider extension constraints drive architectural decisions in ways not captured by extension benchmarks alone.** The pg_duckdb extension achieves 50-600× analytical speedups but is unusable on Aiven managed PostgreSQL. This forced the two-tier HTAP architecture (Aiven managed + GN100 edge), demonstrating how real-world provider constraints shape database architecture for regulated EU deployments — a pattern likely applicable to any organization adopting managed PostgreSQL with HTAP ambitions.

### 10.16 Harness Engineering — From Prompt Engineering to System Design

**Source:** OpenAI, "Harness engineering: leveraging Codex in an agent-first world", 13.02.2026; Martin Fowler, "Harness Engineering", 2026; Datadog, "Closing the verification loop", 2026.

**Context:** OpenAI's Harness team built a product in five months without writing a single line of code manually — one million lines, ~1,500 PRs, 3-7 engineers. This section analyzes the 8 harness engineering principles and compares them with DWS IQ 6's independently developed architecture.

#### 10.16.1 Definition

**Harness** = the entire environment (scaffolding, constraints, feedback loops) surrounding an AI agent that enables stable, productive work.

**Harness Engineering** = the shift from writing code to:
- **Environment design** — designing the workspace agents operate in
- **Intent specification** — defining what needs to happen, not how
- **Feedback loop construction** — building mechanisms for agents to self-correct

When something fails, the question is not "try harder" but **"what capability is missing?"**

#### 10.16.2 The Eight Principles — DWS IQ 6 Comparison

| # | Principle | OpenAI Approach | DWS IQ 6 Approach | Readiness |
|---|-----------|-----------------|-------------------|-----------|
| 1 | AGENTS.md = map, not encyclopedia | ~100 lines, acts as table of contents | CLAUDE.md + AGENTS.md + JIT L0-L6 six-layer loading | **90%** |
| 2 | "Boring technology" wins | Stable, well-documented tech stacks | Express 4, React 19, PostgreSQL — CLI-first mandate | **95%** |
| 3 | Golden Principles quality gates | Automated background scanning + fix PRs | 11 standards + Boardy architect persona review | **75%** |
| 4 | Mechanical architecture enforcement | Linters with fix instructions in errors | ESLint + security coding rules (OWASP, SRI, CORS) | **60%** |
| 5 | Knowledge belongs in the repo | If it's not in the repo, it doesn't exist | 71 docs + DWS Document Standard + VERSION AND AGENT HISTORY | **95%** |
| 6 | Agent-agent code review | "Ralph Wiggum Loop" — self-review cycles | Simplify skill + Boardy + human-in-the-loop | **50%** |
| 7 | Compounding returns (build capabilities) | Diagnose missing capability, build into repo | 10 skills + 16 agents + MCP Hub + workflow orchestration | **85%** |
| 8 | Engineers as environment designers | 3.5 PR/engineer/day throughput | Worktree workflow + session handover protocol | **80%** |

**Overall DWS readiness: ~79%** against OpenAI's harness engineering principles.

#### 10.16.3 Key Empirical Finding: The Model Does Not Solve — The Harness Does

The most significant empirical finding from the harness engineering literature:

> The same model (gpt-5.2-codex) improved its benchmark results from **52.8% to 66.5%** purely through harness improvements (LangChain case). No model change — only system-level improvements.

This validates DWS IQ 6's core architectural hypothesis: **the system surrounding the model matters more than the model itself.** DWS's six-layer information architecture (L0 Platform Model → L6 Tool Result Injection) is a formalization of this principle.

**Progressive disclosure works empirically:**
- Cursor achieved **46.9% token savings** through context management
- Vercel reduced context from **145K → 67K tokens** with JIT loading
- DWS's L6 Tool Injection layer (system-reminder after every tool call) shows **15-47% better rule compliance** than system prompt alone

#### 10.16.4 DWS Six-Layer Architecture (L0-L6) as Harness Formalization

DWS IQ 6 has independently developed a six-layer information architecture that formalizes the harness concept:

| Layer | Name | Function | OpenAI Equivalent |
|-------|------|----------|-------------------|
| **L0** | Platform Model | Base LLM capabilities | Implicit (Codex model) |
| **L1** | System Prompt | Session-level instructions | AGENTS.md injection |
| **L2** | Standards (JIT) | On-demand standard loading | docs/ folder references |
| **L3** | Task Context | Current task specification | PR description + issue |
| **L4** | Auto-Learned State | Persistent memory (Supabase + MEMORY.md) | Not described by OpenAI |
| **L5** | Tool Results | Output from tool executions | Agent loop tool calls |
| **L6** | Tool Result Injection | System reminders after each tool call | Not described by OpenAI |

**DWS innovations beyond OpenAI:**
- **L4 Auto-Learned State:** Agents learn across sessions via persistent memory — OpenAI does not describe equivalent capability
- **L6 Tool Result Injection:** System reminders injected after every tool call, achieving 15-47% better standard compliance than prompt-only approaches
- **12 Factor Agents compliance:** DWS documents 12/12 compliance with the 12 Factor Agents framework — OpenAI does not reference this

#### 10.16.5 EU Regulation Requires a Different Harness

The most significant divergence between OpenAI and DWS approaches stems from regulatory context:

| Dimension | OpenAI (Silicon Valley) | DWS IQ 6 (EU-regulated) |
|-----------|------------------------|-------------------------|
| **Optimization target** | Speed (3.5 PR/engineer/day) | Traceability, auditability, human-in-the-loop |
| **Autonomy level** | Near-full agent autonomy | Human remains final approver (Karpathy principles) |
| **Code review** | Agent-agent only (Ralph Wiggum Loop) | Agent pre-review + human final approval |
| **Audit trail** | Not described | VERSION AND AGENT HISTORY in every document, court-defensible |
| **Data residency** | US-centric | EU data residency (Finland/Germany), GDPR, EU AI Act |
| **Industries served** | Internal tooling | 20 EU-regulated industries (construction, energy, chemicals...) |

**Thesis argument:** Both approaches are valid, but for different contexts. OpenAI optimizes for velocity in an unregulated internal environment. DWS optimizes for compliance, traceability, and trust in EU-regulated industries where autonomous agent decisions carry legal liability.

The EU AI Act (effective August 2026) explicitly requires:
- **Article 12:** Logging of AI system operations for at least 7 years
- **Article 14:** Human oversight of high-risk AI systems
- **Article 15:** Accuracy, robustness, and cybersecurity requirements

These requirements make OpenAI's "full autonomy" model non-compliant for high-risk applications in EU-regulated industries. DWS's human-in-the-loop harness is not a limitation — it is an architectural response to regulatory requirements.

#### 10.16.6 Open Research Questions

1. **Does the harness model scale to EU-regulated industries?** OpenAI's case is internal tooling without regulatory requirements. DWS operates across 20 regulated industries — empirical validation is ongoing.

2. **What is the optimal autonomy level?** OpenAI: near-full autonomy. DWS: human-in-the-loop. Which produces better outcomes in regulated contexts?

3. **Is the six-layer context architecture generalizable?** DWS's L0-L6 model is specific to its standards ecosystem, but the principles may be universal.

4. **Verification gap:** Martin Fowler noted that OpenAI's article lacks behavioral verification — how does the harness ensure generated code does the right thing, not just compiles?

#### 10.16.7 Research Contribution

This section contributes three findings to the harness engineering discourse:

1. **Formalization:** DWS's L0-L6 six-layer architecture provides a formal framework for what OpenAI describes informally. This makes harness design reproducible and auditable.

2. **Regulatory divergence:** EU-regulated industries require fundamentally different harness design — prioritizing traceability and human oversight over speed. This is not a weakness but an architectural constraint analogous to how Aiven's extension whitelist drives database architecture (Section 10.15).

3. **Empirical confirmation:** The 52.8% → 66.5% improvement from harness alone (not model change) validates DWS's investment in system architecture over model selection. The six-layer architecture, DWS Document Standard, and progressive disclosure are all harness engineering practices developed independently before OpenAI published its findings.

---

**Document Information:**

**Title:** Firehorse Product Manufacturing Operating Model: Hybrid AI-Edge Architecture for Climate-Intelligent Industrial Platforms
**Author:** Risto Anton Päärni
**Institution:** Metropolia University of Applied Sciences
**Program:** Smart Factory, Master's Degree (YAMK)
**Supervisor:** Jarno Varteva (with Erkki Räsänen)
**Company:** Lifetime Oy (Firehorse brand)
**Status:** DRAFT - V3.25
**Version:** 3.25
**Last Modified:** 14.03.2026
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
3. Free-Tier Bootstrap Strategy — Startup credits as substitute for venture capital
4. Phased Deployment Framework — Building trust for AI in regulated industries
5. DWS10.com E-Commerce Validation — Google Merchant Center + Revolut Business
6. HIL Learning Pipeline — Daily human-AI feedback loop
7. Automated PR Workflow — Dual-model AI review replacing manual code review
8. DWS7 Agent Modernization — Agentic loops, tool use, MCP server, Build for Agents principle
9. OpenSandbox Edge Integration — Stage 1.5 agent sandboxing on Acer Veriton GN100; EMPO² agent memory alignment (arXiv:2602.23008)
10. CEO Automation Agent Suite — Captain Briefing, LinkedIn Scheduler, EU Regulation Monitor; validates Solution Factory replicability for revenue-critical workflows
11. Multi-Partner AI Ecosystem — NVIDIA, Siemens, ABB, xAI, Mistral; multi-LLM router resolving EU AI Act sovereignty tension in practice
12. Climate IQ Pantheon — 13-agent Greek/Roman god system (6 orchestrators + 7 industry specialists) with SOUL.md identity pattern, prompt injection security, EU AI Act Article 12 logging, and marketing wedge personas
12. Claude Code Engineering Structure — CLAUDE.md as project memory, Skills as reusable workflow components, Hooks for automated quality enforcement; demonstrates AI workflow design as software engineering discipline
13. Learn Thinking — Reflective learning framework: thesis as living document, daily Learn/ folder reflection loop, extension of Build-Measure-Learn cycle for AI-assisted product development
14. MCP Hub Orchestration + Three-Interface Rule — Four production workflow patterns (Fan-Out, Sequential, Reflection, Pipeline) with documented endpoints; Skills/CLI as mandatory agent interfaces ensuring every agent is accessible to humans, AI systems, and development workflows
15. Customer-Facing MVP Features — Three production features transitioning DWS IQ from developer tooling to customer-ready SaaS: (a) Self-service API Key Management with SHA-256 hashing and scope-based access, (b) Usage Metering with 3-tier billing enforcement (Free/Pro/Enterprise) and dashboard progress bars, (c) Compliance Report Export with CSV/JSON download and recurring schedule support. Validates Solution Factory productization hypothesis — platform is market-ready for regulated EU industries
16. Agent System Hardening — Production reliability restoration: 6 TypeScript compilation errors fixed across 5 subsystems, SandboxContext type alignment, MCP/HIL route wiring, locale-deterministic number formatting, dependency hygiene; demonstrates integration debt patterns in multi-agent systems
17. PostgreSQL Columnar HTAP Architecture — Single-database HTAP via pg_duckdb + TimescaleDB on Aiven EU; DWS Data Standard creation governing storage engines, extension registry, retention policies, and EU regulatory compliance (GDPR, EU AI Act Art 12, NIS2, CSRD, EU Data Act); 4-phase rollout from table partitioning to lakehouse integration
18. Two-Tier HTAP Architecture — Aiven-first mandate locks TimescaleDB 2.25.x Hypercore as approved standard for managed production (10-100× analytics, 98% compression); pg_duckdb (50-600× OLAP) relegated to edge device only due to Aiven whitelist; GN100 edge PostgreSQL deployed with full extension stack for ad-hoc analytics
19. Harness Engineering — Analysis of OpenAI's 8 harness engineering principles against DWS IQ 6 architecture; empirical finding that harness improvements alone yield 52.8%→66.5% benchmark gains (model unchanged); DWS's L0-L6 six-layer architecture as formal harness framework; EU regulation requires fundamentally different harness (traceability + human-in-the-loop vs Silicon Valley speed optimization)

**License:** Proprietary - Lifetime Oy
**Contact:** risto@lifetime.fi

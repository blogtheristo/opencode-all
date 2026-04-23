# Doctoral Programme Study Plan Appendix: Firehorse Operations Model for AI-Assisted E-Commerce

**Title:** AI-Native Store Operations: A Case Study of Firehorse Model Implementation with Claude Code
**Author:** Lifetime Oy Research Division
**Date:** January 2026
**Institution:** DWS IQ Research / LUT University
**Document Type:** Doctoral Programme Application Appendix (Jatko-opiskeluhakemus)
**Reference:** LUT Doctoral School — Application and Attachments

---

# VERSION AND AGENT HISTORY

Version: 3.39

Sessions & Modifications:

- Version: 3.39 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Terminology rename — "Aiven overlay" / "Aiven layer" (deprecated infrastructure labels) → "Article 12 Logging Pipeline" per new DWS_ARTICLE_12_LOGGING_STANDARD.md v1.0 (unified 3-tier canonical term). Aiven remains the correct name for the Postgres SaaS. All 4 thesis files bumped in lockstep per CLAUDE.md thesis rule; only V3Thesis_EN had the infra-context string in content
- Version: 3.38 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Typo correction — "Aiwen" → "Aiven" (Aiven.io is our Helsinki Postgres partner) as part of repo-wide sweep of 116 files; no content change beyond the spelling fix; unified version track preserved (all 4 thesis files bumped in lockstep per CLAUDE.md thesis rule)
- Version: 3.37 | Tool: Claude Code (Opus 4.7) | Session: claude/rename-godagents-skilled-dXqBs | Date: 22.04.2026 | Changes: **Unified thesis version track.** PHD_FIREHORSE and Metropolia V3Thesis are now on a single shared version number (3.37). From this commit forward, all 4 thesis files (V3Thesis_EN/FI + PHD_FIREHORSE_EN/FI) bump in lockstep (3.37 → 3.38 → … → 3.99 → 4.00). Chain-break history honestly recorded: v2.9 → v2.10 (21.04.2026, Boardy refinements) → an unintended v3.10 jump collided with an already-existing local v3.1, v3.2 chain → remote was pushed to v3.5 in this session (22.04.2026) without visibility of the local v3.2 work → unified here to v3.37 to align with V3Thesis. Local v3.2 work is expected to be folded into v3.38 as the next bump (human to paste diff). Substantive content in this version: Section 14.17 (DWS Skilled Taxonomy — Brand / Spec / UI Across Agents, Workflows, and Jurisdictions); "GodAgent"/"Godagent" branding deprecated; three-tier `Skilled <Axis>` / `Industrial Specialist <Axis>` / `Industry <Axis>` pattern across three active axes (Agents, Workflows, Jurisdictions — EU/US/Aiven); SKU-copy, scheduler-copy, and jurisdiction-packaging disciplines derived as operations-model implications; Key Contribution #22.
- Version: 3.5 | Tool: Claude Code (Opus 4.7) | Session: claude/rename-godagents-skilled-dXqBs | Date: 22.04.2026 | Changes: [Superseded by v3.37 unification.] Opened the PHD_FIREHORSE major-version line at v3.5 (later reverted). Substantive content moved to v3.37.
- Version: 2.10 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: f2a5b1e0-a01c-489a-8d33-fde09a7dd970 | Date: 21.04.2026 | Changes: Incorporated Boardy-driven refinements: KYA open-source standardization path via Agentic AI Foundation / Linux Foundation, explicit NIST submission status (not sent), publication phasing (2026-2029), court-defensible compliance framing, and tighter supervisor letter structure
- Version: 2.9 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: f2a5b1e0-a01c-489a-8d33-fde09a7dd970 | Date: 21.04.2026 | Changes: Refined research-question targeting: positioned KYA as an Agentic AI Foundation standard candidate, added DWS 7 objectives, added hydrogen-economy continuity note (DWS 5), refocused third research stream to dual-use industries (including Nokia Defence discussions), added Aegis/Sovereign Infra/Connect sovereignty segmentation with core figure, added Siemens and NVIDIA Connect collaboration notes; added supervisor response letter draft
- Version: 2.8 | Tool: Claude Code (Opus 4.7) | Session: claude/update-thesis-work-EoyoF | Date: 20.04.2026 | Changes: Added Section 14.16 (April 2026 Evolution) — five subsections: Firehorse Report Engine production scheduler (PR #1064, cron-driven compliance report dispatch, module-scoped tests, manual trigger route), Firehorse Product Line V2 consolidation (omnichannel/report/automation/content as unified DWS IQ product family), Firehorse Snap benchmark (measured <125ms kill latency on Firecracker MicroVM replaces 122ms Arctic 15 spec), Skills paradigm applied to operations (Anthropic's "Stop Building Agents" validates §14.14; +3 skills: /regulatory-radar, /investor-outreach, /multilingual), Ops Manager V0 buyer lock (PRD v0.2 with ICP validation script), Founder→Team transition (SOLO_FOUNDER_STATEMENT v1.2 + Anthony Maurin CTO + /investor-outreach reproducible workflow with 10+ INTRO notes); added Key Contributions #17–#19
- Version: 2.7 | Tool: Claude Code (Opus 4.6) | Session: claude/refine-thesis-critique-RP6Dv | Date: 18.03.2026 | Changes: Added Appendix H (KYA Partner Ecosystem): 5-layer partner mapping, Shufti IDV integration (L1/L5), Palantir AIP connector model, BYO Agent Policy, strategic ecosystem partners (NVIDIA, Siemens, ABB, xAI, Mistral), partnership distribution hypothesis validation; added Key Contribution #16
- Version: 2.6 | Tool: Claude Code (Opus 4.6) | Session: claude/refine-thesis-critique-RP6Dv | Date: 16.03.2026 | Changes: Updated section 15 Results and Discussion with v2.1–2.5 evidence: harness engineering metrics (52.8%→66.5%), 13-agent Pantheon, customer MVP features, PostgreSQL HTAP, A/B testing integration, compliance readiness updates, SWOT refresh; added section 15.5 A/B Testing Results
- Version: 2.5 | Tool: Claude Code (Opus 4.6) | Session: claude/add-harness-engineering-thesis-2zvZt | Date: 14.03.2026 | Changes: Added Section 14.12 (Harness Engineering and Forensic Telemetry): harness-forensics connection, court-defensible harness via VERSION AND AGENT HISTORY, KYA Standard as hardware-attested harness beyond software-level scaffolding, EU regulatory divergence from OpenAI's speed-optimized approach; added Key Contribution #15
- Version: 2.4 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Added Appendix G Glossary with 21 terms across Platform (5), Data Architecture (8), and Security/Compliance (8) categories
- Version: 2.3 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Updated Section 14.11 with 2026 Aiven-first mandate: Hydra→Supabase Warehouse (Feb 2026), pg_mooncake→Databricks (Oct 2025), TimescaleDB 2.25.x Hypercore as approved standard, Aiven whitelist (pg_duckdb BLOCKED), two-tier HTAP (Aiven + GN100 edge), edge deployment on Acer Veriton GN100; added Key Contribution #14; updated footer
- Version: 2.2 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 12.03.2026 | Changes: Added Section 14.11 (PostgreSQL Columnar HTAP Architecture — DWS Data Standard): pg_duckdb + TimescaleDB on Aiven EU, single-database HTAP for Firehorse operations, 4-phase rollout, DWS_DATA_STANDARD.md creation, EU regulatory compliance; added Key Contribution #13; updated footer
- Version: 2.1 | Tool: Claude Code (Opus 4.6) | Session: claude/vigorous-meitner | Date: 09.03.2026 | Changes: Added Section 14.10 (Agent System Hardening — Production Reliability): 6 TypeScript compilation errors fixed, 3 test failures resolved, SandboxContext type alignment, MCP/HIL route wiring, locale-deterministic number formatting, dependency hygiene; updated footer
- Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026 | Changes: Added Key Contribution #12 (Customer-Facing MVP Features — API Key Management, Usage Metering, Report Export); demonstrates Firehorse Operations Model transition from internal tooling to customer-deliverable SaaS; documents 3-tier billing architecture as product monetization pattern
- Version: 1.9 | Tool: Claude Code (Opus 4.6) | Session: claude/implement-mvp-features-D2e9d | Date: 07.03.2026 | Changes: Added DWS platform standards to References §17 with Oxford notation — DWS Security Standard, ESRS Registry, Compliance Scoring Engine, Site Quality Standards, AGENTS.md, Admin Manual, Security Compliance; explanatory annotations for each standard
- Version: 1.8 | Tool: Claude Code (Opus 4.6) | Session: claude/pedantic-easley | Date: 07.03.2026 | Changes: Added Section 14.6.3 (Lifetime Scope Signals for LWM Training Coordination — Training Agent Fleet T-01 through T-10, quality gate signals, resource arbitration, Fan-Out parallelism); added Key Contribution #11; updated footer
- Version: 1.7 | Tool: Claude Code (Sonnet 4.6) | Session: claude/implement-workflow-agents-CHFFN | Date: 02.03.2026 | Changes: Added Section 14.9 (Climate IQ Pantheon — Greek/Roman God Multi-Agent System: 6 orchestrators + 7 industry specialists, SOUL.md pattern, prompt injection fix, EU AI Act Article 12 logging, marketing wedge personas); updated footer
- Version: 1.7 | Tool: Claude Code (Sonnet 4.6) | Session: claude/organize-repo-structure-F3xqn | Date: 02.03.2026 | Changes: Added Appendix F (Claude Code Engineering Structure: CLAUDE.md as project memory, Skills as reusable workflow components, Hooks for automated quality enforcement, Subagents for parallel execution); updated footer and Publication Status
- Version: 1.6 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: CONSOLIDATED — resolves version drift. Added Section 14.7 (CEO Automation Agent Suite); Section 14.8 (Strategic Partnerships: NVIDIA, Siemens, ABB, xAI, Mistral + Multi-LLM Router); Key Contributions 9-10; references 15-16; footer updated
- Version: 1.5 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: Added Section 14.6 (Agent Foundry Stage 1.5 — OpenSandbox on Acer Veriton GN100); added EMPO² agent memory section (arXiv:2602.23008); added references 13-14; updated Key Contributions
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/modernize-dws7-77v2B | Date: 24.02.2026 | Changes: Added Section 14.5 DWS7 Agent Architecture Modernization (agentic loops, tool use, multi-provider LLM, MCP server, CLI, Claude Code Skills), added VERSION AND AGENT HISTORY block
- Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Enhanced LWM definition, 16-industry cross-learning analysis, BYOA architecture, Agent Orchestration Studio
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: HIL-PR-Automation | Date: 20.02.2026 | Changes: Added Appendix E Automated PR Workflow, IPR Protection, Prompt Caching Architecture
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: DWS10-Integration | Date: 28.01.2026 | Changes: Initial structured version with 18 sections
- Version: 1.0 | Tool: Claude Code (Opus 4.5) | Session: PHD-Init | Date: 15.01.2026 | Changes: Initial document creation

Document Status:

- Created: 15.01.2026
- Last Modified: 21.04.2026
- Language: English
- Languages Available: English, Suomi
- Publication Status: DRAFT (V2.10 — KYA open-source standard path, NIST status, publication phasing, supervisor letter refined)

- Created: 15.01.2026
- Last Modified: 24.03.2026
- Language: English
- Languages Available: English, Suomi
- Publication Status: DRAFT (V3.0 — LWM Sequencing Strategy: compliance→fleet→Series A, LeWorldModel validation, Phase 2 technical gap)

---

## Abstract

This thesis documents the implementation of the Firehorse Operations Model, an AI-assisted approach to e-commerce store management using Claude Code. The model demonstrates significant efficiency gains in product catalog management, Google Merchant Center integration, and payment processing through Revolut Business. We present the technical architecture, operational workflows, and future evolution toward audio-based customer interactions with industry-specific carbon calculator integration and EU regulatory compliance.

**Keywords:** AI Operations, E-Commerce Automation, Google Merchant Center, Claude Code, Firehorse Model, EU AI Act Compliance, Carbon Calculator, Industrial Compliance

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Literature Review](#2-literature-review)
3. [Firehorse Operations Model](#3-firehorse-operations-model)
4. [Technical Implementation](#4-technical-implementation)
5. [Payment Integration (Revolut Business)](#5-payment-integration-revolut-business)
6. [Google Merchant Center Operations](#6-google-merchant-center-operations)
7. [EU Regulatory Compliance](#7-eu-regulatory-compliance)
8. [Product Recommendation Engine](#8-product-recommendation-engine)
9. [Audio Chat Evolution Roadmap](#9-audio-chat-evolution-roadmap)
10. [Industry Carbon Calculator](#10-industry-carbon-calculator)
11. [Proton Products Strategy](#11-proton-products-strategy)
12. [IPR Protection & Trade Secret Strategy](#12-ipr-protection--trade-secret-strategy)
13. [Prompt Caching Architecture for AI Agents](#13-prompt-caching-architecture-for-ai-agents)
14. [Results and Discussion](#14-results-and-discussion)
15. [Conclusion](#15-conclusion)
16. [References](#16-references)
17. [Appendices](#17-appendices)

---

## 1. Introduction

### 1.1 Background

The enterprise software market increasingly demands rapid product iteration, compliance with EU regulations, and seamless customer experiences. Traditional e-commerce operations require manual intervention for product updates, feed management, and customer support. The Firehorse Operations Model addresses these challenges through AI-native automation using Claude Code.

Lifetime Oy operates DWS10.com, an enterprise e-commerce platform serving climate intelligence solutions, compliance software, and professional consulting services to 16 EU-regulated industries. The platform integrates with:

- **Google Merchant Center** (Account ID: 8496329) for product visibility
- **Revolut Business** for checkout and payment processing
- **Claude Code** for automated store maintenance via Firehorse operations model
- **Cloudflare Pages** for static hosting with EU data residency

### 1.2 Research Questions

1. How can AI assistants effectively manage e-commerce product catalogs?
2. What efficiency gains are achievable through automated feed management?
3. How should audio-based customer interaction evolve to recommend industry-specific solutions?
4. What EU AI Act requirements impact AI-assisted sales channels?
5. How can carbon calculators drive product recommendations for industrial prospects?

### 1.3 Scope

This thesis covers the DWS10.com store implementation, serving 30+ products across:

| Category            | Products                             | Price Range     |
| ------------------- | ------------------------------------ | --------------- |
| Platform Software   | DWS IQ v5, v6                        | €4,999 - €6,995 |
| Firehorse Suite     | Automation, Report, CMS, Omnichannel | €499 - €4,950   |
| Consulting Services | Hourly, Monthly, Workshops           | €98 - €6,250    |
| Training & Coaching | AI Koulutus, Coach, Mentor           | €499 - €6,250   |
| Digital Products    | Glossaries, Web Pages                | €0.99 - €799    |

### 1.4 Motivating Thesis: The Carbon Balance Sheet

The central hypothesis motivating this doctoral research is that EU climate compliance — spanning ETS, CBAM, CSRD, and the EU Taxonomy — is not a reporting problem but a **ledger problem**. The same physical quantity of CO2e flows through multiple regulatory touchpoints: a steel mill's ETS surrender becomes an importer's CBAM embedded emission, becomes a construction company's CSRD Scope 3 upstream disclosure, and determines their Taxonomy alignment. Current compliance tools treat each regulation as a separate reporting workflow, producing duplicated data, inconsistent factors, and ±40% Scope 3 uncertainty.

This thesis proposes that carbon compliance requires **double-entry bookkeeping** — the same architectural solution that financial accounting adopted centuries ago. Every compliance event produces a journal entry (debit or credit) in dual units (EUR and tCO2e). The resulting carbon balance sheet provides a net carbon position that is auditable, reconcilable, and machine-readable.

**Why this frames the Firehorse operations research:**

The Firehorse Operations Model (Sections 3–13) documents the engineering infrastructure — multi-agent orchestration, edge deployment, ERP integration, regulatory intelligence — required to build a carbon balance sheet that works across 20 EU-regulated industries. Without the harness architecture (Section 14.12), the cross-industry ledger cannot maintain audit integrity. Without the MCP orchestration, the cross-regulation reconciliation cannot happen in real-time. Without the edge deployment, industrial sites cannot contribute verified emissions data.

**Three research questions emerge from the carbon balance sheet thesis:**

1. **Structural isomorphism:** Is the analogy between financial double-entry bookkeeping and carbon compliance tracking formally valid, or merely metaphorical? Can the same data structures, reconciliation algorithms, and audit guarantees transfer?

2. **Cross-vertical intelligence:** Does a multi-industry carbon ledger produce emergent intelligence that single-vertical tools cannot replicate? Specifically: when a steel mill's verified ETS emissions replace a construction company's CBAM default values, does the accuracy improvement (hypothesized ±3% vs ±40%) materialize in practice?

3. **Network effects in compliance data:** At what scale (number of industries, entities, transactions) does the cross-regulation reconciliation become self-reinforcing — where adding one more industry to the ledger improves data quality for all existing industries?

**The role of open source connectors:**

A carbon balance sheet requires verified data from heterogeneous industrial systems — ERP platforms (SAP, IFS, Dynamics, Visma, Jeeves), EU registries (EUTL, CBAM Transitional Registry), emission factor databases (EEA, IPCC), IoT sensors, and ESG platforms (Worldfavor, PositionGreen). This thesis argues that these connectors must be **open source** (MIT-licensed) for three reasons: (1) auditability — auditors must inspect the data path from source system to ledger entry, not trust a vendor's black box; (2) network effect acceleration — open source lowers adoption barriers, enabling the cross-vertical intelligence to emerge faster; (3) regulatory defensibility — EU AI Act Article 12 requires auditable AI pipelines, which open source satisfies by design. The connector architecture extends the ERP integration patterns already implemented in DWS (`src/integrations/erp/`), treating each connector as a standardized adapter (input schema → journal entry) that plugs into the ledger's append-only ingestion API.

These questions extend beyond the Firehorse e-commerce operations into the domain of **compliance infrastructure design** — the transition from "tools that generate reports" to "infrastructure that maintains a system of record for carbon." The DWS 7 implementation (Phase 2.6, PRs 093A–093H) provides the empirical test bed.

### 1.5 Research Focus Refinement (v2.10)

The refined research focus is organized into three streams:

1. **KYA as an Agentic AI Foundation standard:** KYA (Know Your Agent) is elevated from an internal governance wrapper toward a generalizable foundation standard for identity binding, runtime control, auditability, and sovereignty guarantees in agentic systems.
2. **DWS 7 objectives as empirical testbed:** DWS 7 is treated as the operational environment to validate carbon-ledger infrastructure, KYA governance, multi-partner integration (Siemens, NVIDIA Connect), and sovereignty-aware product segmentation.
3. **Dual-use industries as the third research stream:** The third stream is explicitly focused on dual-use industries (industrial + defence), including ongoing Nokia Defence discussions as part of the funding and pilot pathway.

A continuity note is added from DWS 5 to DWS 7: hydrogen economy compliance (RFNBO additionality and verification) is treated as a longitudinal thread in the platform's research program.

**Product-tier and sovereignty segmentation (core figure):**

<img src="../artifacts/Sovereignty.jpg" alt="Aegis, Sovereign Infra and Connect segmentation" />

The figure anchors three product layers in the research framing:

- **Aegis** = security and critical-infrastructure governance product
- **Sovereign Infra** = EU-sovereign infrastructure layer for regulated operators
- **Connect** = global integration and distribution layer

**Open-source standardization path (new refinement):**

- KYA standard proposal to **Agentic AI Foundation / Linux Foundation** is currently in draft state (not yet submitted).
- NIST track is also not yet submitted and is modeled as a parallel validation path (US validation vs open-source adoption).
- Research principle: a standard that remains private cannot scale to ecosystem adoption; therefore, standardization work must include both open specification and reference implementation evidence.

### 1.6 Response Letter Draft to Prof. Kari Smolander

Dear Kari,

thank you for your message and for the clear guidance. I especially value your point that doctoral work is an endurance process where socialization into the research community and peer-reviewed publication are central.

I will prepare the short research idea description you requested with the following structure:

- **Research problem:** how to build an agentic AI architecture that produces court-defensible compliance data in EU-regulated industrial settings (CBAM, CSRD, NIS2, AI Act).
- **Research objectives:** (1) develop and validate a KYA-certified governance model for industrial AI agents, (2) study scalability of multi-agent systems (MCP + A2A) across 20+ regulatory verticals, (3) evaluate impact of agentic compliance automation on D&O insurability and legal accountability.
- **Preliminary methods:** Design Science Research (DSR), artifact construction (DWS IQ 6/7), empirical validation with paying-customer environments, and case-study analysis.
- **Publication phasing:** 2026 Article 1 (KYA open-source standard), 2027 Article 2 (MCP architecture), 2028 Articles 3-4 (empirical findings), 2028-2029 synthesis + dissertation.

Article 1 is framed as: **"KYA Standard: An Open Source Governance Framework for Agentic AI in EU-Regulated Industries"**, proposed toward Agentic AI Foundation / Linux Foundation pathways and targeted for an international conference.

Current status is made explicit:

- KYA open-source proposal is drafted but not sent.
- NIST submission has not been sent.
- The two paths are complementary, but open-source adoption is prioritized first in this round.

I would be glad to discuss this draft with you online or in person. I can send a concise 2-3 page version in advance.

Kind regards,  
Risto Anton Päärni

---

## 2. Literature Review

### 2.1 AI in E-Commerce Operations

Recent advances in Large Language Models (LLMs) enable natural language interfaces for complex technical operations. Claude Code, built on Anthropic's Claude model, provides:

- File system manipulation
- Code generation and modification
- External API integration
- Multi-step task orchestration
- Git version control integration

### 2.2 Product Information Management

Modern Product Information Management (PIM) systems require:

- Centralized data storage (products.json)
- Multi-channel syndication (Google Merchant, social commerce)
- Compliance metadata (EU regulations)
- Dynamic pricing capabilities
- Checkout link integration

### 2.3 EU Regulatory Framework

The European Union's regulatory landscape affecting AI-assisted commerce includes:

| Regulation             | Effective Date | Impact                                              |
| ---------------------- | -------------- | --------------------------------------------------- |
| EU AI Act              | August 2026    | AI system classification, transparency requirements |
| GDPR                   | May 2018       | Data protection, consent management                 |
| NIS2 Directive         | October 2024   | Cybersecurity requirements                          |
| Green Claims Directive | 2026           | Environmental marketing compliance                  |
| Fit for 55 Package     | 2030 targets   | Carbon reduction obligations                        |
| CSRD                   | January 2024   | Corporate sustainability reporting                  |
| CBAM                   | October 2023   | Carbon border adjustment mechanism                  |
| EPBD 2028              | 2028           | Building energy performance                         |

---

## 3. Firehorse Operations Model

### 3.1 Model Overview

The Firehorse Operations Model is a human-AI collaborative framework for e-commerce management:

```
┌─────────────────────────────────────────────────────────────┐
│                   FIREHORSE OPERATIONS                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐     ┌─────────────┐     ┌─────────────┐       │
│   │  Human  │ ──► │ Claude Code │ ──► │   Systems   │       │
│   │ Intent  │     │  (AI Agent) │     │ (Git, APIs) │       │
│   └─────────┘     └─────────────┘     └─────────────┘       │
│                          │                    │              │
│                          ▼                    ▼              │
│                   ┌─────────────┐     ┌─────────────┐       │
│                   │  Artifacts  │     │   Outcomes  │       │
│                   │ (Code, Docs)│     │ (Deployments)│      │
│                   └─────────────┘     └─────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Core Principles

1. **Natural Language Interface**: Operations expressed in plain language
2. **Version Control**: All changes tracked via Git
3. **Audit Trail**: Complete history for EU AI Act compliance
4. **Reproducibility**: Documented processes for consistency
5. **Traceability**: Decision lineage for regulatory requirements

### 3.3 Operational Domains

| Domain               | AI Capabilities                  | Human Oversight                  |
| -------------------- | -------------------------------- | -------------------------------- |
| Product Management   | CRUD operations, feed generation | Pricing approval, content review |
| Payment Integration  | Link creation, configuration     | Financial authorization          |
| Compliance           | Document generation, monitoring  | Legal sign-off                   |
| Customer Interaction | AI chat, recommendations         | Escalation handling              |
| Documentation        | Manual generation, translations  | Technical review                 |

### 3.4 Workflow Examples

**Product Update Workflow:**

```
User: "Add new product X at €999"
Claude Code:
  1. Updates products.json
  2. Validates required fields
  3. Regenerates Google Merchant feed
  4. Commits changes to Git
  5. Uploads feed via SFTP
```

**Documentation Workflow:**

```
User: "Create admin manual"
Claude Code:
  1. Reads product catalog
  2. Analyzes system architecture
  3. Generates comprehensive documentation
  4. Creates bilingual versions (EN/FI)
  5. Commits to repository
```

---

## 4. Technical Implementation

### 4.1 Architecture

```
dws10.com/
├── buy/                    # Store pages
│   ├── index.html         # Main store (Page 1)
│   ├── page2/index.html   # Additional products (Page 2)
│   └── page3/index.html   # Consulting & Training (Page 3)
├── config/
│   └── products.json      # Central product catalog (30 products)
├── feeds/
│   ├── generate-feed.cjs  # Node.js feed generator
│   └── google-products.xml # Google Merchant feed
├── return-policy/
│   └── index.html         # Return policy (Google requirement)
├── static/images/         # Product images
└── docs/                   # Documentation
```

### 4.2 Product Data Model

```json
{
  "id": "DWS-IQ-006",
  "gtin": null,
  "mpn": "DWSIQ-V6-2026",
  "name": "Lifetime DWS IQ Platform (Version 6)",
  "price": 4999,
  "currency": "EUR",
  "type": "one-time",
  "description": "The Industrial Brain for Fit for 55 Compliance. AI-native platform with 5 agents deployed in your cloud.",
  "priceNote": "One-time deployment + €499/mo subscription",
  "revolutLink": "https://checkout.revolut.com/pay/f023d433-0bf4-48fa-98cd-494de448df39",
  "image": "/DWS_IQ2026.png",
  "detailsUrl": "../buy/",
  "featured": true,
  "google": {
    "productCategory": "Software > Business & Productivity Software",
    "condition": "new",
    "availability": "in_stock",
    "brand": "Lifetime",
    "targetCountry": "FI",
    "contentLanguage": "en"
  }
}
```

### 4.3 Feed Generation Pipeline

```javascript
// generate-feed.cjs workflow
const generateFeed = () => {
  // 1. Load products.json
  const products = require("../config/products.json");

  // 2. Validate required fields
  validateProducts(products); // id, mpn, price, brand

  // 3. Generate XML with g: namespace
  let xml = generateXMLHeader();

  for (const product of products) {
    xml += generateProductItem(product);

    // 4. Add checkout_link_template for Revolut
    const checkoutLink = product.revolutLink || "https://revolut.me/lifetimeoy";
    xml += `<g:checkout_link_template>${checkoutLink}</g:checkout_link_template>`;
  }

  // 5. Write google-products.xml
  writeFile("google-products.xml", xml);
};
```

### 4.4 Deployment Pipeline

- **Hosting:** Cloudflare Pages (static HTML)
- **Build:** Automatic deployment on git push
- **Caching:** Edge caching for performance
- **Compliance:** EU data residency (Finland/Germany)

---

## 5. Payment Integration (Revolut Business)

### 5.1 Why Revolut Business

Lifetime Oy selected Revolut Business for payment processing based on:

| Feature                | Benefit                             |
| ---------------------- | ----------------------------------- |
| Instant settlements    | Improved cash flow, same-day access |
| Multi-currency         | Support for EUR, SEK, NOK, DKK, GBP |
| Low fees               | 1.0% + €0.20 per transaction        |
| API integration        | Automated reconciliation            |
| Checkout links         | Direct Google Merchant support      |
| Apple Pay / Google Pay | Modern payment methods              |

### 5.2 Checkout Link Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Product   │ ──► │   Google    │ ──► │   Revolut   │
│   Catalog   │     │  Merchant   │     │   Checkout  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                    │
       │    checkout_link_template              │
       └───────────────────────────────────────►│
```

### 5.3 Payment Flow

1. Customer discovers product via Google Shopping
2. Clicks through to Revolut checkout
3. Completes payment with card/Apple Pay/Google Pay
4. Instant settlement to Lifetime Oy account
5. Order confirmation sent automatically

### 5.4 Checkout Link Configuration

**Dedicated links per product:**

```json
"revolutLink": "https://checkout.revolut.com/pay/f023d433-0bf4-48fa-98cd-494de448df39"
```

**Fallback for products without specific links:**

```json
"revolutFallbackLink": "https://revolut.me/lifetimeoy"
```

### 5.5 Maintenance Advances

Recent improvements implemented:

- **Dedicated checkout links** per product (vs. generic payment page)
- **Fallback URL** for products without specific links
- **Google Merchant integration** via `checkout_link_template`
- **Multi-currency support** ready for Nordic expansion

---

## 6. Google Merchant Center Operations

### 6.1 Account Configuration

| Setting        | Value                                       |
| -------------- | ------------------------------------------- |
| Merchant ID    | 8496329                                     |
| Target Country | Finland (FI)                                |
| Languages      | English (primary), Finnish                  |
| Feed Method    | SFTP upload                                 |
| Feed URL       | https://dws10.com/feeds/google-products.xml |
| SFTP Host      | partnerupload.google.com:19321              |

### 6.2 Feed Compliance Requirements

| Attribute                | Requirement              | Implementation                 |
| ------------------------ | ------------------------ | ------------------------------ |
| g:id                     | Unique identifier        | Matches products.json ID       |
| g:mpn                    | Manufacturer part number | Format: CATEGORY-TYPE-YEAR     |
| g:brand                  | Product brand            | "Lifetime" or "Firehorse"      |
| g:price                  | Price with currency      | EUR format                     |
| g:availability           | Stock status             | Always "in_stock" for services |
| g:checkout_link_template | Payment URL              | Revolut checkout link          |
| g:condition              | Product condition        | Always "new"                   |

### 6.3 SFTP Upload Process

```bash
# Weekly feed upload to Google Merchant Center
curl -T google-products.xml \
  -u "mc-sftp-8496329:PASSWORD" \
  --insecure \
  "sftp://partnerupload.google.com:19321/google-products.xml"
```

**Password encoding:** Special characters must be URL-encoded

- `$` becomes `%24`
- `!` becomes `%21`

### 6.4 Historical Issues and Resolutions

| Issue                   | Root Cause                       | Resolution                    |
| ----------------------- | -------------------------------- | ----------------------------- |
| Domain mismatch         | URLs pointing to lifetime.fi     | Updated all URLs to dws10.com |
| Duplicate products      | ID mismatch with Merchant Center | Aligned IDs in products.json  |
| identifier_exists error | Set false when MPN+brand exist   | Removed field entirely        |
| Image URL errors        | Double slashes in paths          | Fixed path generation         |
| Missing checkout links  | No payment URL configured        | Added Revolut links           |

---

## 7. EU Regulatory Compliance

### 7.1 EU AI Act Requirements (August 2026)

The EU AI Act classifies AI systems by risk level. Our audio chat and recommendation system falls under **Limited Risk** category, requiring:

1. **Transparency:** Inform users they're interacting with AI
2. **Human oversight:** Escalation path to human support
3. **Documentation:** System capabilities and limitations
4. **Data protection:** GDPR-compliant data handling
5. **Reasoning lineage:** Traceable decision chains

### 7.2 Compliance Mapping by Product

| Regulation       | Relevant Products                 | Customer Need                         |
| ---------------- | --------------------------------- | ------------------------------------- |
| **EU AI Act**    | DWS IQ v6, Conversational Agent   | AI system documentation, transparency |
| **Fit for 55**   | DWS IQ Platform, Firehorse Report | Carbon reporting, ETS compliance      |
| **CSRD**         | Climate Reporting Bundle          | Sustainability disclosure             |
| **GDPR**         | Protonmail Implementation         | Data protection, encryption           |
| **NIS2**         | Protonmail, Firehorse CMS         | Cybersecurity requirements            |
| **Green Claims** | Firehorse Omnichannel             | Environmental marketing compliance    |
| **EPBD 2028**    | Firehorse Automation              | Building energy performance           |
| **CBAM**         | DWS IQ, Consulting Fit55          | Carbon border adjustment              |

### 7.3 Article 12 Compliance (Automatic Logging)

The Firehorse Operations Model ensures EU AI Act Article 12 compliance through:

- **Git version control:** All changes logged with timestamps
- **Commit history:** Decision provenance documented
- **Feed generation logs:** Processing records maintained
- **Audit trail:** Complete history for regulatory review

### 7.4 Compliance Disclosure Template

```
┌─────────────────────────────────────────────────────────────┐
│ COMPLIANCE DISCLOSURE (EU AI Act Article 52)                │
├─────────────────────────────────────────────────────────────┤
│ This conversation is powered by AI. You are interacting     │
│ with an automated system.                                   │
│                                                              │
│ Applicable Regulations for Your Profile:                    │
│ • EU ETS Directive - Carbon trading compliance              │
│ • CSRD - Sustainability reporting requirements              │
│ • EU AI Act - AI system documentation                       │
│ • GDPR - Data protection obligations                        │
│                                                              │
│ Human Support: support@lifetime.fi                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Product Recommendation Engine

### 8.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│            PRODUCT RECOMMENDATION ENGINE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │  Customer   │ ──► │  Industry   │ ──► │  Regulation │   │
│  │   Profile   │     │  Detection  │     │   Mapping   │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│         │                   │                    │          │
│         ▼                   ▼                    ▼          │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │   Carbon    │ ──► │   Product   │ ──► │   Bundle    │   │
│  │ Calculator  │     │   Matcher   │     │  Generator  │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│                             │                               │
│                             ▼                               │
│                    ┌─────────────────┐                     │
│                    │ Recommendation  │                     │
│                    │     Output      │                     │
│                    └─────────────────┘                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Industry Detection Rules

| Industry Indicator          | Detected Sector | Primary Products                |
| --------------------------- | --------------- | ------------------------------- |
| "cement", "concrete"        | Cement          | DWS IQ v6, Climate Bundle       |
| "steel", "metal"            | Steel           | DWS IQ v6, Firehorse Automation |
| "chemical", "petrochemical" | Chemicals       | Firehorse Report, Consulting    |
| "automotive", "vehicle"     | Automotive      | DWS IQ v6, Expert Advisory      |
| "shipping", "maritime"      | Maritime        | Firehorse Automation, Report    |
| "aviation", "airline"       | Aviation        | DWS IQ v6, Consulting Fit55     |
| "building", "construction"  | Buildings       | Firehorse CMS, Automation       |
| "agriculture", "farming"    | Agriculture     | Climate Bundle, Advisory        |

### 8.3 Regulation Trigger Matrix

```
┌──────────────┬──────────────┬───────────────────────┐
│ Regulation   │ Trigger      │ Recommended Product   │
├──────────────┼──────────────┼───────────────────────┤
│ EU AI Act    │ AI systems   │ DWS IQ, Conv. Agent   │
│ Fit for 55   │ >500 tCO2e   │ DWS IQ, FH Report     │
│ CSRD         │ >250 emp.    │ Climate Bundle        │
│ GDPR         │ Personal data│ Protonmail Impl.      │
│ NIS2         │ Critical infr│ FH CMS, Protonmail    │
│ CBAM         │ EU imports   │ DWS IQ, Consulting    │
└──────────────┴──────────────┴───────────────────────┘
```

### 8.4 Bundle Generation Logic

When multiple regulations apply, generate optimized bundles:

**Example: Manufacturing Company (250+ employees, imports materials)**

```
Detected Regulations:
- Fit for 55 (carbon reporting)
- CSRD (sustainability disclosure)
- CBAM (import carbon pricing)
- NIS2 (cybersecurity)

Generated Bundle:
1. DWS IQ Platform v6 (€4,999) - Core compliance
2. Firehorse Report (€1,999) - Automated reporting
3. Consulting Fit55 (€3,000/mo) - Expert guidance
4. Protonmail Implementation (€499) - Secure communications

Total: €10,497 + €3,000/mo ongoing
Savings vs. individual: 15%
```

---

## 9. Audio Chat Evolution Roadmap

### 9.1 Vision

Transform customer interactions from text-based to voice-based with intelligent product recommendations using industry-specific carbon calculators and EU regulation awareness.

### 9.2 Phase 1: Foundation (Q1 2026)

**Objective:** Basic audio chat with product catalog awareness

```
┌─────────────────────────────────────────────────────────────┐
│                     AUDIO CHAT v1.0                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐                            ┌─────────────┐     │
│  │  Voice  │ ──► Speech-to-Text ──────► │  Product    │     │
│  │  Input  │                            │  Matching   │     │
│  └─────────┘                            └─────────────┘     │
│       ▲                                        │             │
│       │                                        ▼             │
│  ┌─────────┐                            ┌─────────────┐     │
│  │  Voice  │ ◄── Text-to-Speech ◄────── │  Response   │     │
│  │  Output │                            │  Generator  │     │
│  └─────────┘                            └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

**Features:**

- Voice input/output (Finnish, English, Swedish)
- Product catalog search
- Basic Q&A about services
- Handoff to human support
- EU AI Act transparency disclosure

**Technical Stack:**

- Speech-to-Text: Whisper API
- Text-to-Speech: ElevenLabs
- LLM: Groq inference with Llama models (cost-effective)
- Hosting: Cloudflare Workers

### 9.3 Phase 2: Carbon Calculator Integration (Q2 2026)

**Objective:** Industry-specific carbon footprint calculation with product recommendations

**Features:**

- Industry sector detection (16 EU industries)
- Carbon footprint estimation (Scope 1, 2, 3)
- Automatic product recommendations based on emissions profile
- Compliance requirement identification
- ROI calculation for compliance solutions

**Example Interaction:**

```
Customer: "We're a cement manufacturer producing 500,000 tonnes annually.
          What's our estimated carbon footprint and how can you help?"

Audio Chat: "Based on industry averages for cement production, your estimated
            annual emissions are approximately 450,000 tonnes CO2.

            Under the EU Emissions Trading System, you'll need verified
            reporting by 2026. I recommend:

            1. DWS IQ Platform v6 at €4,999 - Automated ETS reporting
            2. Firehorse Automation at €4,950 - Zero-touch compliance

            Total investment: €9,949 with 90% reporting time savings.

            Would you like me to explain the EU AI Act requirements for
            these AI-powered compliance tools?"
```

### 9.4 Phase 3: EU Regulation Awareness (Q3 2026)

**Objective:** Proactive regulatory compliance recommendations

**Features:**

- Real-time regulation monitoring
- Customer profile analysis
- Proactive compliance alerts
- Multi-regulation bundle optimization
- Partner product integration

**Regulation Detection Matrix:**

```
Customer Profile Analysis:
├── Industry sector
├── Company size (SME/Large)
├── Geographic scope
├── Data handling practices
└── AI system usage

→ Automated Regulation Mapping
→ Product Recommendations
→ Compliance Timeline
```

### 9.5 Phase 4: Partner Ecosystem (Q4 2026)

**Objective:** Expand recommendations to include partner offerings

**Partner Categories:**

- Compliance Software Partners
- ESG Data Providers
- Carbon Offset Marketplaces
- Legal Advisory Partners
- Certification Bodies

**Revenue Model:**

- Lifetime products: Direct sale
- Partner products: Referral commission (10-20%)

### 9.6 Implementation Timeline

| Phase | Quarter | Features          | EU Compliance           |
| ----- | ------- | ----------------- | ----------------------- |
| 1     | Q1 2026 | Basic audio chat  | AI Act transparency     |
| 2     | Q2 2026 | Carbon calculator | Fit for 55 support      |
| 3     | Q3 2026 | Regulation engine | Full compliance mapping |
| 4     | Q4 2026 | Partner ecosystem | Extended offerings      |

---

## 10. Industry Carbon Calculator

### 10.1 Calculator Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              INDUSTRY CARBON CALCULATOR                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Input Parameters:                                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │ • Industry sector (16 EU industries supported)     │     │
│  │ • Annual revenue (EUR)                             │     │
│  │ • Energy consumption (kWh)                         │     │
│  │ • Transportation logistics (km, modes)             │     │
│  │ • Supply chain scope (tier 1, 2, 3)               │     │
│  │ • Number of employees                             │     │
│  │ • Production volume (units/tonnes)                │     │
│  └────────────────────────────────────────────────────┘     │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │            CARBON FOOTPRINT ENGINE                  │     │
│  │  • Scope 1: Direct emissions (fuel, process)      │     │
│  │  • Scope 2: Indirect energy (electricity, heat)   │     │
│  │  • Scope 3: Value chain (supply, distribution)    │     │
│  └────────────────────────────────────────────────────┘     │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │         PRODUCT RECOMMENDATION ENGINE               │     │
│  │  Maps carbon profile → Lifetime products           │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Industry Emission Factors

| Industry        | Avg. tCO2e/M€ Revenue | Primary Emission Source      |
| --------------- | --------------------- | ---------------------------- |
| Steel           | 850                   | Process emissions (Scope 1)  |
| Cement          | 900                   | Calcination process          |
| Chemicals       | 400                   | Energy + feedstock           |
| Automotive      | 150                   | Manufacturing + supply chain |
| Maritime        | 300                   | Fuel consumption             |
| Aviation        | 500                   | Jet fuel combustion          |
| Buildings       | 100                   | Energy performance           |
| Agriculture     | 250                   | Land use, livestock          |
| Pulp & Paper    | 200                   | Process energy               |
| Glass           | 350                   | Melting process              |
| Ceramics        | 300                   | Kiln operations              |
| Textiles        | 180                   | Supply chain                 |
| Food & Beverage | 120                   | Processing + cold chain      |
| Electronics     | 80                    | Manufacturing + use phase    |
| Pharmaceuticals | 60                    | Controlled processes         |
| Data Centers    | 150                   | Electricity consumption      |

### 10.3 Product Mapping by Carbon Profile

| Carbon Profile | Emissions Range      | Recommended Products                             |
| -------------- | -------------------- | ------------------------------------------------ |
| Very High      | >100,000 tCO2e       | DWS IQ v6, Firehorse Automation, Expert Advisory |
| High           | 10,000-100,000 tCO2e | DWS IQ v6, Firehorse Report, Climate Bundle      |
| Medium         | 1,000-10,000 tCO2e   | Climate Bundle, Firehorse Report                 |
| Low            | <1,000 tCO2e         | Firehorse Report, Consulting Hourly              |

### 10.4 ROI Calculator

```
Input:
- Current manual reporting hours: 200 hrs/year
- Hourly cost: €75/hr
- Current reporting cost: €15,000/year

Investment:
- DWS IQ Platform v6: €4,999
- Annual subscription: €5,988/year

Savings:
- Automated reporting: 90% time reduction
- New reporting cost: €1,500/year
- Annual savings: €13,500

ROI:
- First year: €13,500 - €10,987 = €2,513 net positive
- Payback period: 9.8 months
- 3-year savings: €40,500
```

---

## 11. Proton Products Strategy

### 11.1 Security Product Portfolio

Lifetime Oy offers Proton Business Suite implementation as a security-focused product:

**Product:** Protonmail Secure Email & Domains Implementation
**Price:** €499 (8-hour implementation)
**MPN:** PROTON-EMAIL-2026

### 11.2 Included Services

| Component    | Description                     |
| ------------ | ------------------------------- |
| Proton Mail  | End-to-end encrypted email      |
| Proton Drive | Encrypted cloud storage         |
| Proton Pass  | Zero-knowledge password manager |
| Proton VPN   | Secure networking               |
| Domain Setup | Custom domain configuration     |
| Migration    | Email migration assistance      |

### 11.3 Compliance Coverage

| Regulation      | Proton Compliance             |
| --------------- | ----------------------------- |
| GDPR Article 32 | Technical security measures   |
| NIS2            | Cryptographic controls        |
| EU AI Act       | Secure AI communications      |
| Swiss FADP      | Additional privacy protection |

### 11.4 Recommendation Triggers

Audio chat recommends Proton implementation when detecting:

- "security concerns" or "data protection"
- "GDPR compliance" or "privacy"
- "encrypted email" or "secure communication"
- "NIS2" or "cybersecurity requirements"
- Industry sectors: Healthcare, Legal, Financial

### 11.5 Recommendation Output

```
┌─────────────────────────────────────────────────────────────┐
│ SECURITY RECOMMENDATION: Protonmail Implementation          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Detected Need: Secure communication, GDPR compliance        │
│                                                              │
│ Product: Protonmail Secure Email & Domains Implementation   │
│ Price: €499 (8-hour implementation)                         │
│                                                              │
│ Included:                                                    │
│ • End-to-end encrypted email                                │
│ • Proton Drive (encrypted cloud storage)                    │
│ • Proton Pass (password manager)                            │
│ • Proton VPN (secure networking)                            │
│                                                              │
│ Compliance Coverage:                                         │
│ • GDPR - Article 32 security measures                       │
│ • NIS2 - Cryptographic controls                             │
│ • EU AI Act - Secure AI communications                      │
│                                                              │
│ Why Proton for EU Compliance:                               │
│ • Swiss jurisdiction + EU-hosted option                     │
│ • Zero-knowledge architecture                               │
│ • Open source, audited security                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. IPR Protection & Trade Secret Strategy

### 12.1 Three-Tier IPR Framework

The Firehorse Operations Model and its underlying technologies require a structured intellectual property protection strategy. Lifetime Oy employs a three-tier classification framework:

| Tier                      | Mechanism                 | Scope                                                             | Legal Basis                                     |
| ------------------------- | ------------------------- | ----------------------------------------------------------------- | ----------------------------------------------- |
| **Tier 1: Public**        | Free distribution         | Teaser, FCD concept, market sizing                                | —                                               |
| **Tier 2: NDA Required**  | Confidentiality agreement | LWM architecture, knowledge graph overview, BYOC logic            | EU Trade Secrets Directive 2016/943             |
| **Tier 3A: Patent**       | Patent protection         | CIDM method, causal reasoning algorithm                           | PRH (Finland), EPO, PCT                         |
| **Tier 3B: Trade Secret** | Internal controls         | Knowledge graph structure (10,000+ nodes), weights, training data | EU 2016/943, Finnish Trade Secrets Act 595/2018 |

### 12.2 NDA Gate for Technical Disclosure

Before any technical deep-dive with partners, investors, or customers, the receiving party must sign the Lifetime Oy NDA (EU Trade Secrets Directive 2016/943 compliant). The NDA covers:

- **LWM Architecture** — component diagram, data flow, processing pipeline
- **Knowledge Graph Structure** — node taxonomy, edge types, relationship model
- **BYOC (Bring Your Own Cloud) Logic** — cloud deployment, tenant isolation, data residency
- **Agent Orchestration** — MCP server configuration, coordination protocols
- **Integration Architecture** — ERP connectors (SAP, IFS, Dynamics)

Public/marketing materials (Tier 1) can be shared freely without NDA: product teasers, FCD concept overview, market sizing, and high-level architecture diagrams.

### 12.3 Patent Strategy

Patentable innovations are filed through PRH (Patentti- ja rekisterihallitus, Finland) with international PCT extension:

| Priority | Innovation                                 | Filing Path           | Status                   |
| -------- | ------------------------------------------ | --------------------- | ------------------------ |
| P1       | CIDM — Climate-Intelligent Decision Making | PRH → PCT → EPO/USPTO | Patent pending           |
| P2       | Causal Reasoning for Regulatory Risk       | PRH → PCT             | Prior art search Q2 2026 |
| P3       | LWM Temporal Latent Space                  | PRH → PCT             | Evaluation Q3 2026       |

**Critical rule:** Patent applications MUST be filed before any public disclosure of the method. NDA-protected disclosures do not destroy patentability.

### 12.4 Trade Secret as Preferred Protection for Knowledge Graph

For the knowledge graph (10,000+ nodes), trade secret protection is strategically preferred over patents:

| Factor               | Patent                         | Trade Secret             |
| -------------------- | ------------------------------ | ------------------------ |
| Duration             | 20 years (then public)         | Indefinite               |
| Disclosure           | Must publish full method       | No disclosure            |
| Competitor awareness | Knows exactly what's protected | Cannot know what to copy |
| Cost                 | €120k–200k (3 patents, EU+US)  | Administrative only      |

Trade secret status under EU Directive 2016/943 requires: (1) the information is secret, (2) it has commercial value because it is secret, and (3) reasonable steps have been taken to keep it secret. Lifetime Oy maintains access controls, encryption, employee confidentiality agreements, and internal classification registers.

### 12.5 Implications for Firehorse Operations

The IPR framework directly impacts Firehorse e-commerce operations:

- **Product descriptions** on dws10.com describe _what_ the platform does (Tier 1), never _how_ it works
- **Investor pitch decks** share problem/solution/market freely; architecture details require NDA
- **Conference presentations** discuss EU compliance gaps, not algorithm specifics
- **Customer demos** operate under NDA with watermarked materials
- **Store product pages** reference capabilities, not implementation details

---

## 13. Prompt Caching Architecture for AI Agents

### 13.1 Engineering Principle: Cache Rules Everything

The Firehorse Operations Model relies on long-running AI agent sessions (Claude Code) for store management, product updates, and compliance automation. Prompt caching is the foundational engineering principle that makes these sessions economically viable.

**Source:** Thariq Shihipar (Anthropic), "Lessons from Building Claude Code: Prompt Caching Is Everything" (2026).

**Core insight:** Prompt caching reuses computation from previous API roundtrips via prefix matching. The API caches everything from the start of the request up to each `cache_control` breakpoint. A high cache hit rate reduces costs and latency significantly.

### 13.2 System Prompt Layout for Caching

The order of prompt content matters — static content first, dynamic content last:

```
1. Static system prompt & Tools     (globally cached)
2. CLAUDE.md / project config       (cached within a project)
3. Session context                   (cached within a session)
4. Conversation messages             (new per turn)
```

**Fragility warning:** Cache ordering breaks when:

- Timestamps are placed in the static system prompt
- Tool definitions are shuffled non-deterministically
- Tool parameters are updated mid-session (e.g., available agents)

### 13.3 Six Engineering Rules for Agent Caching

| Rule                                       | Principle                                         | Implementation                                                                           |
| ------------------------------------------ | ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **1. Static first, dynamic last**          | Maximize shared prefix across sessions            | System prompt → CLAUDE.md → session context → messages                                   |
| **2. Use system messages for updates**     | Never modify the static prompt mid-session        | Pass time, file changes, mode switches via `<system-reminder>` tags in the next message  |
| **3. Never change models mid-session**     | Prompt caches are model-specific                  | Switching from Opus to Haiku at 100k tokens costs more than keeping Opus (cache rebuild) |
| **4. Never add/remove tools mid-session**  | Tools are part of the cached prefix               | Use tool stubs with `defer_loading: true` for optional tools; discover via ToolSearch    |
| **5. Design features around the cache**    | State transitions via tools, not tool set changes | Plan mode = system message + ExitPlanMode tool, not swapping the tool set                |
| **6. Fork operations share parent prefix** | Compaction/summarization must reuse cache         | Use identical system prompt, tools, and message history for forked requests              |

### 13.4 Compaction: Cache-Safe Context Forking

When running agents approach the context window limit, compaction (summarization) must preserve the cache:

```
WRONG: New API call with different system prompt + no tools
       → Full cache miss, expensive

RIGHT: Same system prompt + same tools + parent message history
       + compaction prompt appended as new user message
       → Cache hit on parent prefix, only new tokens are the prompt
```

This requires reserving a "compaction buffer" — enough room in the context window for the compact message and summary output tokens.

### 13.5 Operational Impact on Firehorse

For DWS10.com store operations, these caching principles translate to:

| Operation                     | Cache Impact                    | Practice                            |
| ----------------------------- | ------------------------------- | ----------------------------------- |
| Product catalog updates       | Long session, many file edits   | Keep same model throughout          |
| Feed generation               | Tool-heavy workflow             | All tools defined at session start  |
| Compliance checking           | Context-heavy (regulations)     | CLAUDE.md cached as project config  |
| Multi-file sync (dual folder) | Sequential dependent operations | Chain in single session, don't fork |

**Monitoring:** Cache hit rate is treated as an uptime metric. A drop in cache hits triggers investigation — it indicates a system prompt change, tool definition shift, or model switch that needs correction.

### 13.6 Cost & Latency Implications

| Scenario                         | Cache Hit Rate    | Relative Cost | Latency   |
| -------------------------------- | ----------------- | ------------- | --------- |
| Optimized (static prefix)        | >90%              | 1x (baseline) | Low       |
| Tool set changes mid-session     | ~50%              | ~2x           | High      |
| Model switch mid-session         | 0% (full rebuild) | ~3-5x         | Very high |
| Compaction without parent prefix | 0%                | ~3x           | High      |

These economics are critical for Firehorse's AI-assisted store operations, where sessions routinely process 30+ products across multiple files.

---

## 14. Results and Discussion

### 14.1 Per-Industry Open LLM Selection

No single open LLM is optimal for all 16 EU industries served by DWS IQ. Each industry vertical has distinct regulatory language, domain knowledge requirements, and structured output needs. The `AgentConfig.model` field is already per-agent, so each concrete agent can be configured with a different trained Lifetime World Model (LWM) + open LLM, with continuous benchmarking.

**Candidate open LLMs by industry cluster:**

| Industry Cluster               | Candidate Models                           | Key Domain Requirement                                 |
| ------------------------------ | ------------------------------------------ | ------------------------------------------------------ |
| Construction, Real Estate      | Llama 3.3 70B, Qwen 2.5 72B, Mistral Large | EN 15978 lifecycle stages, Nordic building codes, EPBD |
| Energy, Steel & Metals, Cement | Llama 3.3, DeepSeek-V3, Mixtral 8x22B      | ETS allowance calculations, process emissions, CBAM    |
| Manufacturing, Chemicals       | Qwen 2.5 72B, Llama 3.3                    | CBAM product classification, BOM analysis, REACH       |
| Logistics, Maritime, Aviation  | Mistral Large, Llama 3.3, Gemma 2 27B      | FuelEU Maritime, CORSIA, route optimization            |
| Agriculture, Food & Beverage   | Llama 3.3, Gemma 2, Command R+             | LULUCF, Scope 3 supply chain, packaging lifecycle      |
| Finance, Public Sector         | Mistral Large (EU-hosted), Llama 3.3       | SFDR, EU Taxonomy, double materiality, GPP             |
| Healthcare, Textiles           | Gemma 2 (EU-hosted), Qwen 2.5              | Digital product passport, pharmaceutical supply chain  |

**Selection criteria:** domain knowledge depth, multilingual capability, structured output reliability, context window (128k+), inference speed, EU data residency, and commercial license.

**Continuous benchmarking process:** Each industry agent runs weekly automated compliance prompts (EN 15978, CSRD ESRS E1, CBAM declarations) against the current model and 2-3 alternatives. If an alternative consistently scores higher on accuracy and structured output, the model is flagged for review and potential switch.

### 14.2 Bring Your Own Agent (BYOA) Architecture

Enterprise customers bring their own AI agents to work on DWS IQ. This section uses NCC (Nordic construction company) as an illustrative case.

**NCC agent ecosystem:**

| Agent Source          | Count | Examples                                                                                                 |
| --------------------- | ----- | -------------------------------------------------------------------------------------------------------- |
| **NCC Internal**      | 7     | Procurement, Safety Compliance, BIM, Sustainability, Cost Estimation, Quality, Project Planning          |
| **Contractor Agents** | 14    | HVAC Subcontractor, Electrical, Concrete Supplier, Steel Supplier, Window Manufacturer, Insulation, etc. |
| **DWS IQ Platform**   | 3     | Compliance Calculation, Firehorse Report, Carbon Calculator                                              |
| **Total**             | 24    | All connected via A2A + MCP protocols                                                                    |

**Tenant-specific Lifetime World Model (LWM):**

The Lifetime World Model is the enterprise learning layer that sits on top of the chosen open LLM. It is not simply a fine-tuned model — it is a strategic intelligence layer that:

1. **Fine-tunes enterprise data and regulation** — ingests the customer's operational data, industry standards, and EU regulatory context to create domain-specific intelligence that generic LLMs cannot provide
2. **Optimizes market value** — continuously learns from compliance outcomes, energy efficiency results, and operational metrics to identify value creation opportunities
3. **Ensures competitive advantage with multi-agent tools** — combining tenant-specific knowledge with multi-agent orchestration (A2A + MCP), the LWM transforms raw AI capability into an irreplaceable operational asset

Each enterprise tenant receives their own LWM instance:

- **Base LLM:** Selected per industry evaluation (e.g., Qwen 2.5 72B for Nordic construction)
- **Fine-tuned on:** Tenant's own project data, industry codes (RT-kortisto), regulatory context
- **Connectors:** Tekla Structures (BIM), IFS Cloud (ERP), CO2data.fi (emissions factors)
- **Sandbox:** Stage 2 ephemeral containers (europe-north1) or Stage 3 persistent (at scale)

**Why 20 industries make the LWM stronger:** Each industry added to the platform makes every existing industry's LWM smarter through cross-pollination of anonymized compliance patterns. A carbon reduction technique proven in cement manufacturing generates transferable insight for construction. Supply chain Scope 3 agents in manufacturing transfer to food & beverage. The 20th industry customer benefits from all 19 industries' accumulated intelligence — creating a moat that single-industry competitors cannot replicate.

### 14.2.1 LWM Product-Market Validation: Energy Sector Case Study (March 2026)

The Lifetime World Model's commercial viability received its first external validation in March 2026 through partnership negotiations with **Qantic GmbH** (Berlin), a BESS simulation company whose Q-System models energy revenue but lacks compliance cost calculation.

**Validated hypothesis:** The LWM's regulatory intelligence graph has commercial value beyond construction. Qantic's enterprise clients (e.g., MAN Energy Solutions) span six EU-regulated industries simultaneously — Power & Heat, Iron & Steel, Maritime Shipping, Road Transport, Construction, and Chemicals. DWS IQ's 20-industry LWM addresses all six from one platform, validating the cross-industry network effects thesis.

**Quantified output (50MW/200MWh BESS, Germany):** €21,693/year total compliance cost (Scope 2: €5,005, CSRD reporting: €12,000, EU Taxonomy certification: €4,200, efficiency loss: €488). Calculated by the existing BESS Compliance API (19 unit tests passing) — not a roadmap item.

**Firehorse Operations Model evidence:** The deal structure (€15,990 setup + €99/asset/month API) validates the Firehorse product manufacturing approach: standardized products built before customer engagement, delivered at 10x lower cost than enterprise alternatives (€200k+/year from Big 4). This demonstrates that the Firehorse model scales beyond construction into energy sector compliance — supporting the doctoral thesis that AI-native operations models are transferable across EU-regulated industries.

**Key Contribution #16:** First external market validation of LWM commercial value outside the construction sector, confirming the 20-industry architecture creates defensible competitive advantage through cross-sector regulatory coverage.

### 14.3 Agent Orchestration Studio: Graphical Workflow Builder

To enable enterprise customers to build connections between 24+ agents, the platform provides a visual workflow builder.

**Tool evaluation:**

| Tool            | License    | MCP Support              | A2A Support      | Self-Hosted EU | Best For                           |
| --------------- | ---------- | ------------------------ | ---------------- | -------------- | ---------------------------------- |
| **Langflow**    | Apache 2.0 | Native (client + server) | Via custom nodes | Yes            | Agent orchestration, LLM workflows |
| **n8n**         | Fair Code  | Via community nodes      | Via HTTP nodes   | Yes            | ERP/BIM connectors, data pipelines |
| **React Flow**  | MIT        | Custom                   | Custom           | N/A (library)  | Custom visual builder UI           |
| **Flowise**     | Apache 2.0 | Partial                  | No               | Yes            | Chatbot RAG workflows              |
| **Node-RED**    | Apache 2.0 | Via FlowFuse             | Via HTTP         | Yes            | IoT/edge, industrial automation    |
| **Temporal UI** | MIT        | No                       | No               | Yes            | Workflow execution monitoring      |

**Recommended: Langflow + React Flow + Temporal.io**

```
┌─────────────────────────────────────────────────────────┐
│  DWS IQ Agent Orchestration Studio (React)              │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React Flow Visual Canvas                         │  │
│  │  - Drag-and-drop agent nodes                      │  │
│  │  - Per-agent LLM model selection                  │  │
│  │  - Visual connector wiring                        │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Langflow Engine (MCP + A2A orchestration)        │  │
│  │  - Agent nodes = A2A Agent Cards                  │  │
│  │  - Connectors = MCP tools                         │  │
│  │  - Flows export to Temporal.io workflows          │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Temporal.io (durable execution, already in stack)│  │
│  │  - Retry, timeout, compensation                   │  │
│  │  - EU AI Act Article 12 audit trail               │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Rationale:**

1. **React Flow** (MIT) — Custom visual canvas in DWS IQ React dashboard. Zero vendor lock-in.
2. **Langflow** (Apache 2.0) — Native MCP + A2A support. Self-hosted EU. IBM enterprise partnership.
3. **Temporal.io** — Already in stack. Durable execution with full Article 12 audit trail.
4. **n8n** — Supplementary for ERP/BIM connector workflows (Tekla ↔ IFS Cloud sync).

### 14.4 Contractor Agent Onboarding

```
1. Contractor publishes Agent Card (/.well-known/agent.json)
2. NCC admin opens Agent Orchestration Studio
3. Studio discovers contractor agent via A2A protocol
4. Admin drags contractor onto canvas, connects to workflows
5. Studio validates connectivity (A2A health check)
6. Workflow deploys to Temporal.io
7. All interactions logged per EU AI Act Article 12
```

### 14.5 DWS7 Agent Architecture Modernization

The DWS6-to-DWS7 transition addresses six critical architectural gaps discovered during production deployment. Implemented in a single Claude Code session (24.02.2026), these fixes transform the agent system from a 2023-era pattern to a production-grade agentic platform.

**The six fixes:**

| #   | Gap                    | Fix                                               | Key File          |
| --- | ---------------------- | ------------------------------------------------- | ----------------- |
| 1   | Single-shot LLM calls  | Observe-think-act loop (`runLoop()`)              | `base.agent.ts`   |
| 2   | No tool use            | Tool runtime with JSON Schema + 4 built-in tools  | `tools.ts`        |
| 3   | Hardcoded Groq fetch   | Multi-provider client (Anthropic > Groq > OpenAI) | `llm-client.ts`   |
| 4   | No agent communication | Delegation + depth tracking + discovery API       | `index.ts`        |
| 5   | MCP was vapor          | JSON-RPC 2.0 server at `/mcp`                     | `agent-server.ts` |
| 6   | Express-only           | Event bus with pub/sub + Redis Streams            | `event-bus.ts`    |

**Build for Agents principle:** Every DWS product must be accessible via:

- **CLI** (`cli/src/cli.ts`) — JSON output, pipeable, zero dependencies
- **MCP** (`/mcp` endpoint) — auto-discovered by Claude Code, Cursor
- **Claude Code Skills** (`.claude/commands/`) — natural language agent invocation
- **REST API** (`/api/agents/`) — traditional HTTP integration
- **Event bus** — real-time agent coordination via SSE

**EU AI Act Article 12 compliance:** The agentic loop architecture inherently satisfies automatic logging requirements. Each iteration records observation, thought, actions, and results to the `agent_loop_iterations` Supabase table — creating complete reasoning lineage from input to output.

**Impact on Firehorse operating model:** The CLI and Skills layer means the Firehorse store management workflow can now be automated by AI agents end-to-end: compliance checks via `/compliance-check`, carbon analysis via `/carbon-analysis`, and multi-agent workflows via `/workflow` — all without human GUI interaction.

---

### 14.6 Agent Foundry Stage 1.5: OpenSandbox + EMPO² Agent Memory (v1.5)

_Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026_

#### 14.6.1 Stage 1.5 — OpenSandbox on Acer Veriton GN100

The Agent Foundry received a new isolation stage between the demo-grade SDK sandbox (Stage 1) and Cloud Run (Stage 2): **OpenSandbox** (https://github.com/alibaba/OpenSandbox) deployed on the **Acer Veriton GN100** edge node (120 GiB RAM, 20 cores, Helsinki Lab).

| Stage   | Method                                 | Cost       | Use Case                          |
| ------- | -------------------------------------- | ---------- | --------------------------------- |
| 1       | SDK sandbox (bubblewrap/seatbelt)      | €0         | Demo, single-tenant               |
| **1.5** | **OpenSandbox Docker (Veriton GN100)** | **€0 HW**  | **EU air-gapped, internal pilot** |
| 2       | Cloud Run ephemeral (europe-north1)    | ~€20-50/mo | Paid multi-tenant                 |
| 3       | Persistent containers (gVisor)         | €200+/mo   | Scale                             |

Activation: `SANDBOX_STAGE=opensandbox`. Six MCP tools (`sandbox_create`, `sandbox_execute`, `sandbox_file_read`, `sandbox_file_write`, `sandbox_destroy`, `sandbox_ping`) expose it via `/sandbox/*` endpoints in the MCP Hub.

**Firehorse operating model impact:** Stage 1.5 enables EU air-gapped agent execution for regulated industries (defense, healthcare, critical infrastructure) — customers where data must never leave on-premises hardware. The Acer Veriton GN100 is the first physical Lifetime Fleet node fulfilling this capability.

#### 14.6.2 EMPO²: Academic Grounding for the LWM Memory Architecture

The paper _"Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization"_ (EMPO², arXiv:2602.23008, February 2026) provides academic validation for the DWS Lifetime World Model's hybrid memory design.

EMPO² proposes combining:

- **Parametric memory** (RL updates to model weights) — analogous to DWS LWM fine-tuning (QLoRA, Acer Veriton GN100)
- **Non-parametric memory** (retrieval from memory buffer) — analogous to DWS RAG over EU regulations + enterprise data (pgvector)

Results: 128.6% improvement over GRPO on ScienceWorld, 11.3% on WebShop. Key insight: _models trained with memory become robust even without memory at inference_ — validating the DWS strategy of progressively embedding domain knowledge into LWM weights while maintaining RAG as a fallback.

The OpenSandbox environment additionally serves as a **safe EMPO²-style RL training sandbox**: isolated containers provide the clean, reproducible environments needed for RL-based memory training without affecting production infrastructure.

#### 14.6.3 Lifetime Scope Signals for LWM Training Coordination

_Session: claude/pedantic-easley | Date: 07.03.2026_

The Lifetime Scope Signals (LSS) protocol — originally designed for deterministic multi-agent development coordination (see Metropolia thesis Section 2.5.2) — extends naturally to ML pipeline orchestration. Rather than introducing a dedicated ML workflow engine (Kubeflow, Airflow), the LWM training pipeline is coordinated using the same four signal types: READY, COMPLETE, ERROR, BLOCKED.

**Training Agent Fleet (T-01 through T-10):**

| Agent ID | Name                 | Role                                      | Emits                                                       | Listens For                                             |
| -------- | -------------------- | ----------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| T-01     | InfraVerifier        | Validate CUDA/PyTorch on GN-100 nodes     | `COMPLETE:infra-verified`                                   | (none — entry point)                                    |
| T-02     | ModelFetcher         | Download base model to shared storage     | `READY:base-model`                                          | `T-01:COMPLETE:infra-verified`                          |
| T-03     | CurriculumAgent      | Claude API curriculum design per vertical | `READY:curriculum:{vertical}`                               | `T-02:READY:base-model`                                 |
| T-04     | DataSynthAgent       | Generate 2000+ synthetic examples         | `READY:dataset:{vertical}`                                  | `T-03:READY:curriculum:{vertical}`                      |
| T-05     | TrainingAgent        | QLoRA fine-tuning on assigned node        | `READY:lora-weights:{vertical}`                             | `T-04:READY:dataset:{vertical}`, `T-06:READY:node-slot` |
| T-06     | ResourceArbiter      | Allocate GN-100 node slots (2 tokens)     | `READY:node-slot`                                           | `T-05:READY:lora-weights:*` (releases slot)             |
| T-07     | EvalAgent            | Claude-as-judge, quality gate ≥7.0        | `READY:eval-pass:{vertical}` / `ERROR:eval-fail:{vertical}` | `T-05:READY:lora-weights:{vertical}`                    |
| T-08     | MergeAgent           | Merge LoRA adapter into base model        | `READY:merged-model:{vertical}`                             | `T-07:READY:eval-pass:{vertical}`                       |
| T-09     | DeployAgent          | Deploy inference API                      | `COMPLETE:lwm-deployed:{vertical}`                          | `T-08:READY:merged-model:{vertical}`                    |
| T-10     | PipelineOrchestrator | Monitor all verticals                     | `COMPLETE:lwm-all-verticals`                                | All `T-09:COMPLETE:*`                                   |

The `{vertical}` parameterized milestone enables per-industry pipeline instantiation — the only protocol extension over base LSS v1.0.

**Key mechanisms:**

1. **Quality gate signals** — T-07 emits `READY:eval-pass:{vertical}` only when Claude-as-judge score ≥7.0; failure emits `ERROR:eval-fail:{vertical}`, triggering curriculum re-generation (max 3 retries → `BLOCKED` → human escalation). This maps to the EMPO² off-policy update pattern (Section 14.6.2).

2. **Resource arbitration** — T-06 manages two node-slot tokens (one per GN-100). Training agents acquire a token before starting; release on completion. First-come-first-served by signal emission order.

3. **Fan-Out parallelism** — Curriculum generation (T-03) and data synthesis (T-04) run across all 16 verticals simultaneously (CPU-bound, no GPU constraint), eliminating idle GPU time.

**Firehorse operating model impact:** The training coordination validates LSS as a general-purpose deterministic coordination mechanism — the same protocol orchestrates both software development agents (Appendix F) and ML training pipelines, reducing operational complexity for Firehorse customers who need both capabilities.

#### 14.6.4 Agent Memory Fact Extraction Pipeline (PR-254)

_Session: claude/agent-memory-fact-extraction-gLEss | Date: 23.03.2026_

The EMPO² theoretical framework (Section 14.6.2) was operationalized through a **fact extraction pipeline** — the first production implementation of the non-parametric memory update path in the Firehorse operating model.

**Dual Memory Architecture:**

| Layer             | Role                                                              | Firehorse Impact                             |
| ----------------- | ----------------------------------------------------------------- | -------------------------------------------- |
| **LWM**           | Domain knowledge (regulations, emission factors, industry models) | Enables _what_ the agent can analyze         |
| **Client Memory** | Relationship knowledge (preferences, decisions, open issues)      | Enables _personalized_ analysis per customer |

The fact extraction pipeline converts unstructured conversation text into structured subject-predicate-value triples using LLM-based extraction (Claude Haiku), with confidence scoring, duplicate detection via cosine similarity (pgvector), and persistence as `fact` type memories in the semantic_memories table.

**Three Execution Layers for Actionable Memory:**

Fact extraction creates passive knowledge. The Firehorse operating model requires three additional layers:

1. **Firehorse State Machine** — Acts on extracted facts. A fact "customer deadline Q2 2026" must trigger workflow escalation, not just sit in a database. This is the core Firehorse execution layer.

2. **ERP Connector Layer** — Feeds live data from Visma/IFS/SAP/Dynamics into memory. Client memory captures stated preferences; ERP reveals actual behavior (order patterns, payment history).

3. **KYA Governance Wrapper (v1.4 internal / v1.1 public)** — Wraps every memory mutation with audit-grade provenance. Critical insight: **contradiction resolution (PR-255) without KYA attestation means resolving memory conflicts with no audit trail for _why_ one fact superseded another.** The court-defensible audit chain: "fact A replaced fact B at timestamp X, approved by agent Y, logged to Firehorse" — required for CSRD and EU AI Act Article 12 compliance.

**KYA-First PR Ordering:**

| Priority | PR  | Feature                  |
| -------- | --- | ------------------------ |
| 1        | 254 | Fact Extraction ✅       |
| 2        | 255 | Contradiction Resolution |
| 3        | —   | KYA Memory Audit Trail   |
| 4        | 257 | Decay Scoring            |
| 5        | 256 | Consolidation Cron       |
| 6        | 259 | Connector Sync           |
| 7        | 258 | Supermemory MCP EU       |

**Key Contribution #17:** First production fact extraction pipeline for EU-compliant industrial AI, demonstrating dual LWM/client-memory architecture and identifying the three-layer execution gap (state machine, ERP connectors, KYA governance) essential for court-defensible enterprise AI memory in regulated industries.

### 14.7 CEO Automation Agent Suite

_Deployed: 24.02.2026 | Commit: claude/ai-agent-orchestration-t89Ig_

Three production agents automate the CEO's daily operational loop — GitHub Actions cron, Supabase data layer, Resend delivery.

| Agent                       | Trigger                 | Role                                                                 |
| --------------------------- | ----------------------- | -------------------------------------------------------------------- |
| **Captain Pre-Briefing**    | 07:30 Helsinki, Mon-Fri | Pre-call prep: CRM pull → talking points → email                     |
| **LinkedIn Post Scheduler** | 08:00 Helsinki, Mon-Fri | Content calendar → draft → CEO approval digest                       |
| **EU Regulation Monitor**   | 05:30 Helsinki, Mon-Fri | RSS fetch → classify by regulation → severity score → feed scheduler |

The EU Regulation Monitor creates a closed feedback loop: it fetches EU Commission / EUR-Lex / Carbon Pulse / Euractiv, classifies by regulation (CBAM, CSRD, Fit for 55, EPBD, EU AI Act, ETS), and feeds regulation alerts as LinkedIn content ideas — ensuring CEO outreach stays aligned with active regulatory development.

**Firehorse operating model impact:** These agents demonstrate the model at the revenue layer — not just product management and compliance, but active sales motion and thought leadership are now AI-automated. The CEO operates as a supervisor, not an executor, of the daily revenue workflow.

### 14.8 Strategic Partnerships and Multi-LLM Router

_Documented: 27.02.2026 | Source: docs/DWS6_TO_DWS7_UPDATE.md v1.1_

DWS7 has formalized a 5-partner ecosystem for the Brain-Memory-Body-Hands architecture:

| Partner | Architecture Layer                                       | Status                   |
| ------- | -------------------------------------------------------- | ------------------------ |
| NVIDIA  | Brain (compute) + Hands (Jetson edge) + Body (Omniverse) | Inception target Q2 2026 |
| Siemens | Hands (MindSphere IoT) + Body (digital twin)             | Xcelerator Q2 2026       |
| ABB     | Hands (automation, robotics, power grid)                 | Q3 2026                  |
| xAI     | Brain (Grok real-time market intelligence)               | Active production        |
| Mistral | Brain/Memory (EU-sovereign AI inference)                 | Planned Q3 2026          |
| Red Hat | Body (AgentOps BYOA, OpenShift AI, hybrid cloud infra)   | Active (March 2026)      |

**Multi-LLM Router:** Task-level LLM selection based on sovereignty, cost, and latency — Claude/Mistral for compliance, Grok for market signals, Groq for low-latency summarization, Qwen 2.5 72B (QLoRA, Acer Veriton) for on-premises sovereign inference.

**Red Hat alignment:** Red Hat's "The Adaptable Enterprise" (2025) identifies that worldwide GenAI spending will reach $644 billion in 2025 (76.4% YoY), yet 42% of organizations are blocked by lack of in-house AI expertise. Their BYOA (Bring Your Own Agent) framework — enterprise Kubernetes for agent deployment with production guardrails — validates the Firehorse managed-platform approach and complements the NVIDIA edge compute layer.

**Research contribution:** The partnership model validates the Firehorse operating model's distribution hypothesis: access to 10,000+ industrial customers (NVIDIA Inception, Siemens Xcelerator, Red Hat OpenShift ecosystem) without building a direct sales organization — a key enabler of the partnership distribution strategy applied at scale.

---

## 15. Results and Discussion

### 15.1 Operational Efficiency Gains (Updated v2.6)

The Firehorse Operations Model with Claude Code achieved:

| Metric                            | Before            | After                               | Improvement                |
| --------------------------------- | ----------------- | ----------------------------------- | -------------------------- |
| Product update time               | 2 hours           | 5 minutes                           | 96%                        |
| Feed generation                   | Manual            | Automated                           | 100%                       |
| Documentation creation            | 1 week            | 1 hour                              | 99%                        |
| Error rate                        | 5%                | <1%                                 | 80%                        |
| Store page updates                | 4 hours           | 15 minutes                          | 94%                        |
| **Harness engineering benchmark** | **52.8%**         | **66.5%**                           | **+26% (model unchanged)** |
| **PR review cycle**               | **Manual (2-4h)** | **Dual-model AI (15 min)**          | **94%**                    |
| **Agent fleet size**              | **0 agents**      | **13 agents (Pantheon)**            | **∞**                      |
| **Customer features shipped**     | **0**             | **3 (API keys, metering, reports)** | **SaaS-ready**             |

### 15.2 Google Merchant Center Performance

| Metric                             | Result                | Source                  |
| ---------------------------------- | --------------------- | ----------------------- |
| Product approval rate              | 100% (30/30 products) | Google Merchant Center  |
| Feed processing time               | <24 hours             | Automated SFTP          |
| Checkout conversion                | Direct to payment     | Revolut Business        |
| Feed file size                     | 32,893 bytes          | XML feed                |
| **A/B test: product descriptions** | **+18% CTR**          | **Google Merchant A/B** |

### 15.3 Compliance Readiness Assessment (Updated v2.6)

| Regulation      | v1.4 | v2.6    | Change | Evidence                                  |
| --------------- | ---- | ------- | ------ | ----------------------------------------- |
| EU AI Act       | 80%  | **92%** | +12%   | Art. 12 logging, SOUL.md, Pantheon agents |
| GDPR            | 95%  | **97%** | +2%    | Proton + Supabase RLS + Aiven EU          |
| Fit for 55      | 90%  | **93%** | +3%    | 16-industry carbon calculator             |
| NIS2            | 75%  | **85%** | +10%   | RC2-RC4 hardening, Snyk MCP               |
| CSRD            | 85%  | **88%** | +3%    | Report export feature                     |
| **EU Data Act** | —    | **80%** | New    | DWS Data Standard, HTAP                   |

### 15.4 Limitations

1. **Audio chat not yet deployed** — Roadmap documented, architecture designed
2. **Partner ecosystem** — Strategic partnerships established (NVIDIA, Siemens, ABB) but not revenue-generating
3. **Multi-language support** — Currently English/Finnish only
4. **Carbon calculator** — Architecture complete, industry data validation pending
5. **A/B testing sample sizes** — Statistical significance limited by pilot customer volume
6. **Single-developer bias** — Mitigated by external data (Google Merchant, git history) but third-party validation planned Q2 2026

### 15.5 A/B Testing and Feedback Channel Results (New v2.6)

| Channel             | Metric                  | Baseline | Current (v2.6)    | Δ           |
| ------------------- | ----------------------- | -------- | ----------------- | ----------- |
| **Google Merchant** | CTR                     | 1.2%     | 1.8% (A/B tested) | +50%        |
| **SEO**             | Organic keywords ranked | 45       | 78                | +73%        |
| **SEO**             | Average position        | 32       | 18                | +44%        |
| **Sales**           | Conversion rate         | 2.1%     | 3.4%              | +62%        |
| **Investor**        | Portfolio readiness     | Pipeline | Assessment        | Progressing |

---

## 15. Conclusion

### 13.1 Summary

The Firehorse Operations Model demonstrates that AI-assisted e-commerce management can:

1. **Reduce operational overhead** by 90%+ through automated product management
2. **Ensure compliance** with EU regulations via documented audit trails
3. **Enable rapid iteration** on product offerings with natural language interfaces
4. **Prepare infrastructure** for voice-based customer interactions
5. **Support industrial customers** with carbon calculator integration

### 13.2 Key Contributions

This thesis contributes:

1. A documented framework for AI-assisted store operations (Firehorse Model)
2. Integration patterns for Google Merchant Center and Revolut Business
3. A roadmap for audio chat with carbon calculator integration (4 phases)
4. EU compliance mapping for industrial software products
5. Product recommendation engine architecture for 16 EU industries
6. Proton products security strategy for GDPR/NIS2 compliance
7. Agent Foundry Stage 1.5 — OpenSandbox on Acer Veriton GN100 for EU air-gapped agent sandboxing
8. EMPO² alignment — hybrid parametric/non-parametric memory architecture validated by arXiv:2602.23008
9. CEO Automation Agent Suite — Captain Briefing, LinkedIn Scheduler, EU Regulation Monitor; Firehorse model applied to revenue workflow automation
10. Multi-Partner AI Ecosystem — NVIDIA, Siemens, ABB, xAI, Mistral + multi-LLM router; validates distribution hypothesis of the Firehorse operating model
11. LSS Training Pipeline Coordination — Lifetime Scope Signals applied to LWM training: Training Agent Fleet (T-01–T-10), quality gate signals, resource arbitration for 2× GN-100 nodes; validates LSS as general-purpose coordination beyond software development
12. Customer-Facing MVP Features — API Key Management, Usage Metering with 3-tier billing, Compliance Report Export; Firehorse operations model transition to customer-deliverable SaaS
13. PostgreSQL Columnar HTAP Architecture — Single-database HTAP via pg_duckdb + TimescaleDB on Aiven EU; DWS Data Standard creation governing storage engines, extension registry, retention policies, EU regulatory compliance; 4-phase rollout for Firehorse operations data
14. Two-Tier HTAP Architecture — Aiven-first mandate, TimescaleDB Hypercore for production, pg_duckdb for edge analytics; validates managed-provider constraint as architectural driver
15. Harness Engineering and Forensic Telemetry — court-defensible harness via VERSION AND AGENT HISTORY, KYA Standard as hardware-attested harness
16. LWM Product-Market Validation — Qantic GmbH energy sector case study, first external market validation
17. Agent Memory Fact Extraction Pipeline — LLM-based fact extraction, dual memory architecture, KYA-first ordering
18. Carbon Balance Sheet Thesis — EU climate compliance as ledger problem; double-entry bookkeeping for CO2 with dual-unit entries (EUR + tCO2e); three PhD research questions: structural isomorphism, cross-vertical intelligence, network effects in compliance data; DWS 7 Phase 2.6 as empirical test bed

### 13.3 Future Work

1. **Q1 2026:** Deploy audio chat Phase 1 with EU AI Act transparency
2. **Q2 2026:** Implement industry carbon calculator with Scope 1/2/3
3. **Q3 2026:** Launch regulation awareness engine
4. **Q4 2026:** Establish partner ecosystem with commission model
5. **2027:** Expand to additional EU markets (SE, NO, DK, DE)

---

## 16. References

1. EU AI Act, Regulation (EU) 2024/1689
2. Google Merchant Center Technical Specifications (2026)
3. Revolut Business API Documentation
4. Anthropic Claude Code Documentation
5. Fit for 55 Package, European Commission
6. CSRD Directive (EU) 2022/2464
7. NIS2 Directive (EU) 2022/2555
8. GDPR, Regulation (EU) 2016/679
9. CBAM Regulation (EU) 2023/956
10. GHG Protocol Corporate Standard
11. ISO 14064-1:2018 Greenhouse Gas Accounting
12. Proton AG Security Documentation
13. Anonymous (2026). "Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization (EMPO²)." arXiv:2602.23008. https://arxiv.org/abs/2602.23008
14. Alibaba Group (2026). "OpenSandbox: General-Purpose Sandbox Platform for AI Applications." https://github.com/alibaba/OpenSandbox
15. Anthropic Claude Code Documentation — Captain Briefing Agent (claude/ai-agent-orchestration-t89Ig, 2026)
16. DWS6_TO_DWS7_UPDATE.md v1.1 — Strategic Partnerships: NVIDIA, Siemens, ABB, xAI, Mistral (claude/dws6-dws7-update-doc-I2Cgk, 2026)
17. EU Trade Secrets Directive (EU) 2016/943
18. Finnish Trade Secrets Act (liikesalaisuuslaki 595/2018)
19. Patent Cooperation Treaty (PCT), WIPO
20. Shihipar, T. (2026). "Lessons from Building Claude Code: Prompt Caching Is Everything." Anthropic Engineering Blog

### DWS Platform Standards (Internal)

The following internal standards govern the DWS IQ 6 platform architecture, security, and quality. They are maintained as living documents in the private repository and are referenced here in Oxford notation for academic traceability.

17. Lifetime Oy (2026). _DWS Security Standard_, version 1.5. `DWS_SECURITY_STANDARD.md`. Internal framework governing AI safety, middleware security controls, CORS policies, SRI integrity, Article 12 logging, and API boundary validation using Zod schemas. Establishes the security architecture for all 15 backend API routes and the MCP agent server.

18. Lifetime Oy (2026). _ESRS Data Point Registry_, version 1.0. `src/compliance/esrs-registry.ts`. Machine-readable mapping of all 82 European Sustainability Reporting Standards (ESRS) disclosure requirements across E1-E5 (Environment), S1-S4 (Social), and G1 (Governance). Each disclosure is classified as mandatory or voluntary under the CSRD Directive (EU) 2022/2464.

19. Lifetime Oy (2026). _Compliance Scoring Engine_, version 1.0. `src/compliance/scoring-engine.ts`. Deterministic compliance scoring algorithm computing CSRD readiness, ETS exposure, and CBAM risk scores. Formula: overall = CSRD(0.50) + ETS(0.25) + CBAM(0.25), where CSRD = (mandatory data points provided / total mandatory) x 80 + bonus modifiers.

20. Lifetime Oy (2026). _Site Quality Standards_, version 2.1. `SITE_QUALITY_STANDARDS.md`. Code quality, component architecture, and UI resilience patterns for the DWS IQ dashboard. Defines ErrorBoundary, Skeleton loading, and EmptyState component standards for enterprise-grade user experience.

21. Lifetime Oy (2026). _AGENTS.md_, version 2.2. `AGENTS.md`. Agent inventory and operational guidance following the agents.md open specification. Documents 15 AI agents, the compliance scoring engine architecture, middleware stack ordering, and the "Build for Agents" product rule requiring CLI + MCP + Skills interfaces.

22. Lifetime Oy (2026). _DWS IQ Platform Admin Manual_, version 2.7. `Admin/ADMIN_MANUAL.md`. Operational procedures for health check monitoring, compliance scoring engine operations, and dashboard resilience troubleshooting. Includes the Claude Code Project Engineering Structure and Multi-Agent Orchestration sections.

23. Lifetime Oy (2026). _Enterprise Security & Compliance_, version 1.8. `Admin/SECURITY_COMPLIANCE.md`. Security controls for CISOs and procurement teams. Documents agent runtime security, dashboard resilience controls, backend middleware security controls, and compliance engine data protection with RLS policies.

24. LUT University (2026). _Tekoälytyökalujen käytänteet_ [AI Tool Usage Policies]. Lappeenrannan-Lahden teknillinen yliopisto LUT. https://elut.lut.fi/fi/opintojen-suorittaminen/opintoja-ohjaavat-saadokset-ja-ohjeet/tekoalytyokalujen-kaytanteet — University-level policy framework for AI tool usage in academic work, requiring transparent disclosure of AI assistance and documenting the human-AI collaboration model.

---

## 17. Appendices

### Appendix A: Complete Product Catalog

| ID                      | Product                   | Price     | Type     | Brand     |
| ----------------------- | ------------------------- | --------- | -------- | --------- |
| DWS-IQ-006              | DWS IQ Platform v6        | €4,999    | Platform | Lifetime  |
| DWS-IQ-005              | DWS IQ Platform v5        | €6,995    | Platform | Lifetime  |
| FH-AUTO-001             | Firehorse Automation      | €4,950    | Software | Firehorse |
| FH-RPT-001              | Firehorse Report          | €1,999    | Software | Firehorse |
| FH-CMS-001              | Firehorse CMS             | €2,999    | Software | Firehorse |
| FH-OMNI-001             | Firehorse Omnichannel     | €499      | Software | Firehorse |
| LIFETIME-BUNDLE-2026    | Climate Bundle            | €6,500    | Bundle   | Lifetime  |
| expert-services         | Expert Workshop 3 Days    | €4,500    | Service  | Lifetime  |
| consulting-hourly       | Consulting Hourly         | €98/hr    | Service  | Lifetime  |
| consulting-fit55        | Fit55 Specialist          | €3,000/mo | Service  | Lifetime  |
| LIFETIME-EXP-001        | Expert Advisory           | €3,000/mo | Service  | Lifetime  |
| aws-consultancy         | AI & Cloud Consultancy    | €4,500    | Service  | Lifetime  |
| conversational-agent    | Conversational Agent      | €3,500    | Software | Lifetime  |
| m365-consultancy        | M365 Consultancy          | €1,120    | Service  | Lifetime  |
| powerapps-consultancy   | Power Platform            | €1,120    | Service  | Lifetime  |
| ai-agent-engineering    | AI Agent Engineering      | €99/hr    | Service  | Lifetime  |
| lean-project            | Firehorse Lean Project    | €4,960    | Service  | Firehorse |
| ai-consultant-day       | AI Consultant Day         | €699      | Service  | Lifetime  |
| business-mentor-30      | Business Mentor 30hrs     | €4,960    | Service  | Lifetime  |
| firehorse-coach         | Firehorse Coach           | €499      | Service  | Firehorse |
| firehorse-flow          | Firehorse Flow            | €499      | Software | Firehorse |
| omnichannel-multimodal  | Omnichannel Multimodal    | €699/mo   | Software | Firehorse |
| professional-web-pages  | Professional Web Pages    | €799      | Service  | Lifetime  |
| secure-email-proton     | Protonmail Implementation | €499      | Service  | Lifetime  |
| firehorse-data-services | Data Services             | €899      | Service  | Firehorse |
| agentti-sanasto         | Agentti Sanasto           | €0.99     | Digital  | Lifetime  |
| devops-lead             | Workflow Agent Delivery   | €2,500    | Service  | Lifetime  |
| digital-design-gold     | Digital Design Gold       | €2,499    | Service  | Lifetime  |
| cloud-ready-teams       | Solution Ready Team       | €950      | Service  | Lifetime  |
| ai-koulutus-3d          | AI Koulutus 3 Days        | €6,250    | Training | Lifetime  |

### Appendix B: Weekly Maintenance Checklist

```
MONDAY - Feed Health Check
[ ] Access Google Merchant Center diagnostics
[ ] Review product approval status
[ ] Check for disapproved items
[ ] Verify feed freshness (< 7 days)
[ ] Document any issues found

WEDNESDAY - Performance Review
[ ] Review impressions and clicks
[ ] Calculate click-through rate (CTR)
[ ] Identify underperforming products
[ ] Note optimization opportunities

FRIDAY - Optimization & Upload
[ ] Implement product improvements
[ ] Regenerate feed (node generate-feed.cjs)
[ ] Validate XML (xmllint --noout)
[ ] Upload via SFTP
[ ] Commit changes to Git
[ ] Verify upload in Merchant Center
```

### Appendix C: Audio Chat Compliance Disclosures

**Required disclosure (EU AI Act Article 52):**

```
"You are now connected to Lifetime's AI assistant. This is an automated
system using artificial intelligence. For human support, say 'speak to
a person' or email support@lifetime.fi."
```

**Finnish version:**

```
"Olet nyt yhteydessa Lifetimen tekoalyavustajaan. Tama on automaattinen
jarjestelma, joka kayttaa tekoalya. Jos haluat keskustella ihmisen kanssa,
sano 'haluan puhua ihmisen kanssa' tai laheta sahkopostia osoitteeseen
support@lifetime.fi."
```

### Appendix D: SFTP Credentials Reference

| Setting  | Value                    |
| -------- | ------------------------ |
| Host     | partnerupload.google.com |
| Port     | 19321                    |
| Username | mc-sftp-8496329          |
| Protocol | SFTP                     |
| File     | google-products.xml      |

### Appendix E: Automated PR Workflow (HIL Automation)

The Firehorse operations model includes a fully automated pull request review and merge workflow that replaces manual human-in-the-loop code review. This is a key operational efficiency gain for solo developers and small teams managing enterprise-grade codebases.

**Architecture:**

```
Claude Code → PR → Claude sanity check → Gemini HIL review → @copilot fixes → CI → auto-merge
                                                ↑                    |
                                                └────────────────────┘  (fix loop)
```

**Components:**

| Component            | Role                                                         | Technology                   |
| -------------------- | ------------------------------------------------------------ | ---------------------------- |
| Claude Code          | Code generation, branch creation, PR opening                 | Anthropic Claude Opus/Sonnet |
| AI Code Review       | Dual-model review replacing human reviewer                   | GitHub Actions workflow      |
| Claude (reviewer)    | Quick sanity check: security, correctness, breaking changes  | Claude Sonnet 4 API          |
| Gemini (HIL gate)    | Deep review: edge cases, tests, architecture, OWASP security | Gemini 2.0 Flash API         |
| Copilot coding agent | Implements fix instructions from review comments             | GitHub Copilot               |
| PR Auto-Merge        | Merges when all checks pass and AI approves                  | GitHub Actions + GraphQL     |

**Key design decision:** Gemini defaults to REQUEST_CHANGES on every review. This ensures every PR goes through at least one improvement cycle, enforcing quality even when the original implementation appears correct. Only code with zero issues, adequate tests, and convention compliance receives APPROVE.

**Operational metrics (expected):**

- Developer involvement reduced to final skim/approve (~5 min per PR)
- 70-90% of basic/refactor/test issues caught before human sees them
- Typical fix loop: 1-3 iterations before approval

**Deployment:** Cloud Run service `dws6run6` (europe-north1, Finland). MCP Hub `POST /gemini/review` for on-demand code analysis.

---

## 14.9 Climate IQ Pantheon — Greek/Roman God Multi-Agent System

Building on the multi-tenant agent architecture (Section 14), this section documents the **Climate IQ Pantheon**: 13 production AI agents carrying Greek/Roman deity identities, organized in two tiers for Climate IQ's EU industrial compliance platform.

### System Overview

**Tier 1 — Orchestrator Agents (6)**

| Agent      | Deity         | Role               | One-liner                                                |
| ---------- | ------------- | ------------------ | -------------------------------------------------------- |
| Atlas      | Greek Titan   | Chief of Staff     | Routes chaos, synthesizes it into executive briefings    |
| Athena     | Greek Goddess | EU Compliance      | Memorized every EU regulation since 2005                 |
| Hephaestus | Greek God     | Field & Site       | Never gets mud on his boots, but checks everything       |
| Iris       | Greek Goddess | Research & Intel   | Reads 10,000 pages so you don't have to                  |
| Hermes     | Greek God     | Logistics & Ops    | Optimizes your supply chain while you find the warehouse |
| Apollo     | Greek God     | Content & Outreach | Writes copy, ranks it, sends the follow-up. Already did. |

**Tier 2 — Industry Specialists (7)**

Vulcan (Steel/ETS), Helios (Energy/RED III), Neptune (Maritime/FuelEU), Ceres (Agriculture/CBAM), Prometheus (Hydrogen/RFNBO), Mars (Construction/EPBD), Gaia (Cement/ETS clinker).

### SOUL.md Pattern

Each agent has a `SOUL.md` identity file injected as LLM system prompt via `BaseAgent.callLLM(systemPromptOverride)`. This resolves the "SOUL dead code" audit finding where persona constants were defined but never wired into LLM calls.

### Security & Compliance

- **Prompt injection fix**: Replaced all `...input` spreads in HermesAgent with explicit typed field extraction
- **EU AI Act Article 12**: All 13 agents write to `agent_executions` Supabase table (start + completion events)

### Business Innovation: Names as Marketing

The Pantheon naming is the product's marketing wedge — agent one-liners appear on onelifetime.world/team alongside human staff, making enterprise AI approachable without sacrificing credibility.

### Appendix F: Claude Code Engineering Structure — AI Workflow as First-Class Engineering

The Firehorse operations model is built on a principle that emerges from both the research findings and operational practice: **AI workflows must be engineered, not improvised**.
This appendix documents the concrete structural patterns that implement this principle in the DWS6 repository, validated against emerging Claude Code community best practices (2026).
**CLAUDE.md as Project Memory**
The `CLAUDE.md` file at the repository root is not documentation — it is the primary intelligence substrate for every AI agent session. It encodes standards, constraints, architecture decisions, email rules, security controls, and non-negotiables in a single file that every Claude Code session reads automatically. This eliminates behavioral drift and removes the need for repeated per-session context injection.
Key metric: 2,000+ lines of institutional knowledge (brand standards, document standards, security controls, deployment rules, thesis rules, email rules) inherited by every session at zero marginal cost.
**Skills as Reusable Workflow Components (expanded March 2026)**
By March 2026, the skills inventory grew from 6 to 21 production skills across four categories:

- **17 slash commands** in `.claude/commands/`: gstack development workflow (6), EU compliance (4), agent control (3), operations (3), code quality (2)
- **4 discipline skills** in `skills/*/SKILL.md`: `verification-gate` (blocks "done" claims without evidence), `design-first` (blocks 3+ file changes without approved design), `dual-folder-sync` (blocks root changes without landing-pages sync), `last30days` (research agent)
- **4 specialized subagents** in `.claude/agents/`: `mcp-expert`, `code-reviewer`, `security-reviewer`, `architect`
- **Secret scanning hook**: PreToolUse hook scanning 14 secret patterns (AWS, GitHub, Stripe, Anthropic, etc.) with audit logging
  The discipline skills represent a novel contribution: **blocking gates** enforced via hook exit code 2 (BLOCK) that cannot be bypassed by agent behavior. This is structural enforcement, not behavioral suggestion — essential for regulated industries where "the agent usually follows the rules" is insufficient.
  **Hooks for Automated Quality Enforcement**
  Git hooks (`.githooks/`) enforce structural invariants:
- Branch naming convention (`claude/<feature>-<id>`) — prevents incorrect branch workflows
- Anti-destructive-push guard — prevents accidental deletion of production branches
- Post-merge sync — keeps Admin/, docs/, AgentFoundry/ synchronized to backup storage
  The quality enforcement is **structural, not behavioral** — hooks cannot be bypassed by agent behavior. This is the key architectural distinction between a disciplined AI workflow system and an ad-hoc one.
  **Subagents for Context Isolation and Parallel Execution**
  Background agents enable parallel research and task execution without exhausting the main context window. The Explore agent specifically provides codebase search without polluting the primary context — critical for large repositories. This pattern directly extends the multi-agent orchestration documented in Sections 3 and 14.
  **Conclusion**
  The architectural lesson for the Firehorse Operations Model: the difference between AI experiments and AI products is not the model — it is the engineering discipline applied to how the model is integrated. CLAUDE.md, skills, hooks, and subagents are not features; they are the infrastructure that makes the Firehorse model reliable, consistent, and scalable.

### Section 14.10: Agent System Hardening — Production Reliability

The 31-agent system accumulated 6 TypeScript compilation errors and 3 test failures across module boundaries. These were not design flaws but integration debt — the kind that emerges when independently correct modules evolve at different speeds.

**Fixes applied:**

1. **SandboxContext type alignment** — `SandboxContext.stage` in `types.ts` was missing the `'opensandbox'` literal that `SandboxStage` in `sandbox/index.ts` defined. This blocked agent execution in Stage 1.5 (Acer Veriton Docker).

2. **MCP route wiring** — `createMCPRouter()` was defined in `src/mcp/agent-server.ts` but never imported in `app.ts`. All 31 agents were invisible to external MCP clients.

3. **HIL route wiring** — The Human-in-the-Loop endpoint (`/api/hil`) for morning briefing task completion was unreachable. Captain Pre-Briefing "Done" buttons returned 404.

4. **Locale-deterministic formatting** — Emissions Data Analyst used `toLocaleString()` without locale, producing space-separated numbers on EU servers. Fixed with explicit `'en-US'` locale for consistent output.

5. **Resend batch type safety** — Email service `.map()` call failed on `CreateBatchSuccessResponse` union type. Added runtime array detection.

6. **Dependency hygiene** — `luxon` was imported but missing from `package.json`.

**Result:** 0 TypeScript errors (was 6), 47/47 tests passing (was 44/47).

**Research insight:** In multi-agent architectures, integration debt accumulates at module boundaries, not within modules. Systematic hardening sessions — touching multiple subsystems in a single commit — are more effective than per-module fixes because they restore cross-cutting invariants that individual modules cannot enforce alone.

---

### Section 14.11: PostgreSQL Columnar HTAP Architecture — DWS Data Standard

The Firehorse operations model generates growing volumes of campaign events, agent execution logs, and audit trail data. Running analytics against transactional heap tables creates performance bottlenecks as data scales.

**Solution: Two-Tier HTAP — Aiven-first mandate (updated 13.03.2026)**

The original v2.2 plan assumed pg_duckdb availability on Aiven. Three market shifts invalidated that assumption:

1. **Hydra joined Supabase** (Feb 2026) — renamed "Supabase Warehouse"; no longer independent, not on Aiven.
2. **pg_mooncake acquired by Databricks** (Oct 2025) — roadmap pivoted to lakehouse; Aiven listing unlikely.
3. **pg_duckdb: BLOCKED on Aiven whitelist** — extension not in Aiven's approved list; no ETA for inclusion.

**Extension evaluation (revised):**

| Extension          | Engine                 | Aiven Status                                 | Verdict                                                  |
| ------------------ | ---------------------- | -------------------------------------------- | -------------------------------------------------------- |
| TimescaleDB 2.25.x | PostgreSQL (Hypercore) | **Approved**                                 | ONLY managed option — hypertables + columnar compression |
| pg_duckdb          | DuckDB                 | **BLOCKED** (not whitelisted)                | Edge-only — approved for GN100 self-managed nodes        |
| Hydra              | Citus columnar         | **Dead** — joined Supabase (Feb 2026)        | Removed from evaluation                                  |
| pg_mooncake        | DuckDB                 | **Dead** — acquired by Databricks (Oct 2025) | Removed from evaluation                                  |

**Recommended stack — two-tier HTAP:**

| Tier               | Host                       | Extensions                         | Role                                                      |
| ------------------ | -------------------------- | ---------------------------------- | --------------------------------------------------------- |
| **Production**     | Aiven PostgreSQL (EU)      | TimescaleDB 2.25.x Hypercore       | OLTP + time-series compression, audit logs, agent metrics |
| **Edge analytics** | Acer Veriton GN100 (ARM64) | TimescaleDB + pg_duckdb + pgvector | Local OLAP, fleet telemetry, AI inference                 |

Edge PostgreSQL deployed **2026-03-13** on Acer Veriton GN100 (ARM64), self-managed.

**DWS Data Standard** (`DWS_DATA_STANDARD.md`) governing:

- Storage engine decisions (row vs columnar vs hybrid)
- Extension governance with EU sovereignty assessment and Aiven whitelist compliance
- Retention policies mapped to 11 EU regulations (GDPR Art 17, EU AI Act Art 12: 7yr, NIS2: 5yr, Finnish Accounting Act: 10yr)
- Partitioning and compression standards

**Revised rollout:** Phase 0 (table partitioning) → Phase 1 (TimescaleDB Hypercore on Aiven) → Phase 2 (edge pg_duckdb on GN100) → Phase 3 (Aiven↔GN100 replication).

**Research contribution:** Demonstrates that managed-provider extension whitelists are a first-class architectural constraint — not a deployment detail. When the preferred extension (pg_duckdb) is blocked, the architecture must split into tiers rather than compromise on provider choice. The two-tier pattern (managed cloud + self-managed edge) preserves both EU data residency and analytical capability.

### 14.12 Harness Engineering and Forensic Telemetry

**Source:** OpenAI, "Harness engineering: leveraging Codex in an agent-first world", 13.02.2026; analysis in `docs/OPENAI_HARNESS_ENGINEERING_ANALYSIS.md`.

**Context:** OpenAI's harness engineering framework describes how the environment surrounding AI agents (scaffolding, constraints, feedback loops) determines agent effectiveness more than the model itself. This section connects harness engineering to Firehorse's forensic telemetry and the broader PHD research on court-defensible AI operations.

#### 14.12.1 The Harness-Forensics Connection

OpenAI's harness model focuses on **developer productivity** — building products faster with AI agents. DWS IQ 6 extends the harness concept to **forensic operations**, where every agent action must be traceable, auditable, and court-defensible.

| Harness Layer          | OpenAI Purpose           | Firehorse Forensic Purpose                             |
| ---------------------- | ------------------------ | ------------------------------------------------------ |
| **AGENTS.md**          | Map for developer agents | Audit-ready system description for regulators          |
| **Golden Principles**  | Code quality enforcement | Compliance standard adherence across 20 industries     |
| **Knowledge in repo**  | Developer documentation  | VERSION AND AGENT HISTORY — immutable modification log |
| **Agent-agent review** | Code quality iteration   | Multi-model review creating forensic evidence trail    |
| **Feedback loops**     | Developer productivity   | Court-defensible decision provenance                   |

**Key insight:** The DWS Document Standard's VERSION AND AGENT HISTORY block transforms every document into a forensic artifact. Each modification records: version number, tool used, session ID, date, and specific changes. This is a harness mechanism that OpenAI does not describe — because they optimize for speed, not legal defensibility.

#### 14.12.2 KYA Standard as Hardware-Attested Harness

OpenAI's harness operates entirely at the software level — constraints, linters, code review loops. DWS's KYA (Know Your Agent/Architecture) Standard extends the harness into hardware:

| Harness Type            | OpenAI                     | DWS KYA                                            |
| ----------------------- | -------------------------- | -------------------------------------------------- |
| **Agent identity**      | Software-level session IDs | Hardware-attested agent identity (TPM/Secure Boot) |
| **Execution isolation** | Container sandboxing       | Hardware-isolated execution environments           |
| **Audit immutability**  | Git history                | Hardware-attested audit logs (tamper-evident)      |
| **Trust boundary**      | Process-level              | Hardware security module boundary                  |

The KYA Standard's Shield (security) and Sword (optimization) paradigm demonstrates that **hardware-level harness provides guarantees that software harness cannot** — particularly for EU-regulated industries where agent decisions carry legal liability.

#### 14.12.3 Empirical Validation: Harness Over Model

The harness engineering literature provides empirical evidence supporting the Firehorse Operations Model:

- **52.8% → 66.5% improvement** from harness changes alone (LangChain case, same gpt-5.2-codex model)
- **46.9% token savings** from progressive disclosure (Cursor)
- **15-47% better rule compliance** from L6 Tool Result Injection vs system prompt alone (DWS internal measurement)

These findings validate the Firehorse model's investment in operational infrastructure (forensic telemetry, automated PR review, session handover protocol) over model selection. The model is interchangeable — the harness is the competitive advantage.

#### 14.12.4 EU Regulatory Divergence

For Firehorse operations serving EU-regulated industries, the harness must satisfy constraints that OpenAI's internal tooling does not face:

| EU Requirement                         | Harness Implication                        | Firehorse Implementation                          |
| -------------------------------------- | ------------------------------------------ | ------------------------------------------------- |
| **EU AI Act Art 12** (7-year logging)  | Every agent action logged immutably        | VERSION AND AGENT HISTORY + Supabase audit tables |
| **EU AI Act Art 14** (human oversight) | Human-in-the-loop mandatory for high-risk  | Karpathy principles: "human is the architect"     |
| **GDPR Art 17** (right to erasure)     | Data deletion while preserving audit trail | Pseudonymized audit logs with separate PII store  |
| **NIS2 Art 23** (incident reporting)   | 24-hour breach notification capability     | Firehorse automated incident telemetry            |

**Research contribution:** This section demonstrates that **harness engineering is not one-size-fits-all.** The EU regulatory context requires a fundamentally different harness design — one that prioritizes traceability, human oversight, and legal defensibility over speed. OpenAI's 3.5 PR/engineer/day metric is irrelevant when the primary metric is compliance assurance and audit readiness.

### 14.13 LWM Sequencing Strategy — From Regulatory Intelligence to Physical AI

**Source:** LeWorldModel (arXiv:2603.19312, Maes et al., March 2026); LWM sequencing analysis in `docs/field-notes/2026-03-25-lwm-phase2-technical-gap-analysis.md`.

**Context:** The Lifetime World Model serves dual roles: regulatory intelligence engine (Phase 1, current) and physical planning system (Phase 2, future). This section documents the sequencing strategy and the technical gap between phases, framing the PhD research agenda.

#### 14.13.1 Three-Phase Sequencing

**Phase 1 (Current):** LWM as regulatory intelligence engine — 15,000+ EU documents, 18 AI agents, carbon balance sheet with cross-regulation reconciliation. Revenue-generating. Validated by 6 customers (KELA, Taksi Helsinki, Uber, Bolt, Limo Helsinki, Sixt).

**Phase 2 (Post-SAFE):** LWM adds physical planning via latent space models (LeWorldModel-style JEPA architecture). Helsinki healthcare fleet pilot. The carbon ledger provides regulatory constraints for physical planning decisions.

**Phase 3 (Series A):** Full dual-use product — compliance infrastructure + edge Physical AI across 5 industries.

**Key insight for PhD research:** Compliance data feeds physical planning. Not the reverse. This inverts the typical world model narrative and represents a novel architectural contribution.

#### 14.13.2 LeWorldModel as External Validation

LeWorldModel (Maes, Le Lidec, Scieur, LeCun, Balestriero, 2026) demonstrates stable JEPA training from raw pixels using only 2 loss terms (prediction + SIGReg). 15M parameters, single GPU, 48x faster planning than foundation model alternatives. The SIGReg regularizer (Cramer-Wold theorem, isotropic Gaussian prior) solves the representation collapse problem that plagued prior JEPA approaches.

This validates the world model category but does not validate Lifetime's specific product. The honest framing: Lifetime builds domain-specific regulatory infrastructure on commodity AI.

#### 14.13.3 Phase 2 Technical Gap

Three unsolved problems for PhD investigation:

1. **Input modality gap:** Text-based regulatory graph → latent planner expecting visual/sensor input. Proposed bridge: OpenUSD digital twin encoding both physical and regulatory metadata.

2. **Scale gap:** LeWorldModel tested in controlled simulation (PushT, Reacher). Industrial environments are uncontrolled, long-horizon, sparse-reward. Scalability is research.

3. **Regulatory-physical integration:** Physical planner proposes → regulatory engine validates → KYA governance enforces. KYA v1.4 (Firecracker MicroVM kill-switches) is the only Phase 2 component already built.

**Research contribution:** The compliance-first world model thesis — that regulatory infrastructure must precede physical planning capability — provides a concrete research programme connecting LeWorldModel's theoretical advances to industrial deployment in regulated EU environments.

---

## Appendix G: Glossary

### Platform and Business Concepts

| Term (EN)            | Finnish          | Definition                                                                              |
| -------------------- | ---------------- | --------------------------------------------------------------------------------------- |
| **AgentFoundry**     | AgentFoundry     | Multi-model, multi-tenant framework for deploying AI agents across industrial verticals |
| **Edge AI**          | Reunatekoäly     | AI processing on local devices instead of cloud servers                                 |
| **Firehorse**        | Firehorse        | DWS6 product suite (Reports, Automation, Omnichannel, CMS)                              |
| **MCP Hub**          | MCP Hub          | Model Context Protocol coordination server for multi-agent orchestration                |
| **Solution Factory** | Solution Factory | Operating model for producing multiple industrial AI platforms from shared components   |

### Data Architecture and Analytics

| Term (EN)            | Finnish             | Definition                                                                                          |
| -------------------- | ------------------- | --------------------------------------------------------------------------------------------------- |
| **Autoresearch**     | Autotutkimus        | Karpathy-inspired autonomous validation loop: hypothesize → modify → verify → keep/discard → repeat |
| **Columnar Storage** | Saraketallennustila | Database storage format organizing data by columns instead of rows, enabling 10-100× compression    |
| **HTAP**             | HTAP                | Hybrid Transactional/Analytical Processing — single database handles both OLTP and OLAP workloads   |
| **Hypercore**        | Hypercore           | TimescaleDB's automatic hybrid row→columnar tiering engine with 90-98% compression                  |
| **pg_duckdb**        | pg_duckdb           | PostgreSQL extension embedding DuckDB for 50-600× OLAP acceleration (edge-only in DWS)              |
| **pgvector**         | pgvector            | PostgreSQL extension for vector similarity search, used in RAG pipelines                            |
| **TimescaleDB**      | TimescaleDB         | PostgreSQL extension for time-series data with compression and continuous aggregates                |
| **Two-Tier HTAP**    | Kaksitasoinen HTAP  | Architecture: Tier 1 (Aiven managed, TimescaleDB) + Tier 2 (self-managed edge, pg_duckdb)           |

### Security and Compliance

| Term (EN)               | Finnish                          | Definition                                                                                    |
| ----------------------- | -------------------------------- | --------------------------------------------------------------------------------------------- |
| **Aiven-first Mandate** | Aiven-ensisijaisuus              | DWS policy requiring production extensions to be Aiven-compatible before adoption             |
| **DWS Data Standard**   | DWS-tietostandardi               | Internal standard governing data storage, extension governance, and EU regulatory compliance  |
| **EU AI Act**           | EU:n tekoälysäädös               | EU regulation for AI systems (August 2026 deadline)                                           |
| **GDPR**                | GDPR (Yleinen tietosuoja-asetus) | EU data protection regulation                                                                 |
| **KYA Standard**        | KYA-standardi                    | Know Your Agent/Architecture — AI agent security (Shield) and optimization governance (Sword) |
| **NIS2**                | NIS2                             | EU cybersecurity directive for critical infrastructure                                        |
| **Proxy-to-Scale**      | Pienestä suureen -validointi     | Karpathy pattern: validate on small proxy before scaling to production                        |
| **RLS**                 | Rivitason suojaus                | Row-Level Security — database-level access control per user/organization                      |

### 14.14 Competitive Analysis: Domain-Specific vs Generic AI Harness

A March 2026 benchmarking study compared the DWS6 harness architecture against **everything-claude-code (ECC)** — a 120,000-star open-source framework providing 136 skills, 30 subagents, and 60 slash commands.

**The fundamental trade-off:** ECC optimizes for **breadth** (136 skills × 8 languages × 5 IDEs); DWS6 optimizes for **depth** (21 skills × deep EU regulatory knowledge × structural enforcement).

Six competitive differentiators identified:

1. **Domain-specific skills** encoding EU regulation (ETS, CBAM, CSRD, EN 15978, EN 13001) — not replicable by generic skill count
2. **Six-layer information architecture** (L0-L6) controlling context injection at every layer — ECC operates at L2-L3 only
3. **Hard gates** (verification-gate, design-first, dual-folder-sync) using exit code 2 (BLOCK) — ECC skills are advisory-only
4. **Trust boundary zones** (GREEN/YELLOW/RED) with risk-proportionate action classification — ECC has binary secret scanning only
5. **gstack workflow** with enforced cognitive role separation — ECC skills are independent and unorchestrated
6. **Agent-first product rule** (5-gate shipping checklist: CLI, JSON output, MCP tool, Claude skill, markdown docs) — skills are product interfaces, not developer convenience

**Research significance:** At the token budget level, breadth is counterproductive for regulated domains. Loading 136 generic skills consumes context window capacity that domain-specific agents need for regulatory reasoning. The DWS6 constraint of <150 words per discipline skill is a token budget optimization enabling deeper domain reasoning. This validates the harness engineering thesis (Section 14.12): a 21-skill domain-specific harness outperforms a 136-skill generic harness when regulatory precision matters.

### 14.15 Master Thesis Dual-Version Architecture

The master thesis (V3Thesis) grew to 82 pages and 26,000+ words during the AI-assisted research process — nearly double the 40-50 page Metropolia submission target. Rather than permanently deleting research content, a dual-version architecture was adopted:

**v3.30.50 (Frozen, 50 pages):** Restructured for Metropolia submission. Sections 10.6-10.18 consolidated into a summary section (10.6 "Extended Research Contributions") with cross-references to this PHD Firehorse document. Section 5 expanded from 0.7 to ~4 pages. Appendices trimmed from 8 to 4. This file receives only HIL (Human-in-the-Loop) edits — no automated AI updates.

**v3.32+ (Living, 82 pages):** Continues accumulating research findings as before. Every new version entry is a timestamped record of research progression.

**PHD Firehorse as canonical home:** Sections 14.1-14.14 of this document now serve as the authoritative detailed documentation for content summarized in the master thesis v3.30.50. The master thesis explicitly cross-references "PHD Firehorse Sections 14.X" for each summarized topic.

**Research contribution:** This dual-version pattern demonstrates a practical methodology for AI-assisted academic writing where research velocity systematically exceeds institutional format constraints. The pattern preserves intellectual property while meeting submission requirements — a recurring challenge as AI accelerates research documentation.

**Key Contribution #18:** Dual-version thesis architecture as methodological contribution to AI-assisted academic writing.

### 14.16 April 2026 Evolution: Report Engine in Production, Product Line V2, Snap Benchmark, and Founder→Team Transition

_Added: 20.04.2026 | Source: PRs #1064, #1109, #1110; field notes 2026-04-06 through 2026-04-19; Firehorse Snap benchmark (Firecracker MicroVM); SOLO_FOUNDER_STATEMENT v1.2._

Between v2.7 (18.03.2026) and v2.8 (20.04.2026) Firehorse progressed from a documented operating model to a measurable production system. Five operational milestones define this window.

#### 14.16.1 Firehorse Report Engine — Production Scheduler (PR #1064)

The Firehorse Report module graduated from specification to scheduled production. PR #1064 merged the report scheduler (`src/firehorse/report-scheduler.ts`), module-scoped tests (`src/__tests__/firehorse-report-module.test.ts`), and a manual trigger route. This is the first Firehorse module to ship a cron-driven customer deliverable, closing the loop between the Operations Model (§14.1–14.4) and customer-facing value:

| Capability         | Implementation                                                  |
| ------------------ | --------------------------------------------------------------- |
| Scheduled dispatch | Node-cron expressions per tenant; timezone-aware                |
| Manual trigger     | REST route for ad-hoc report generation                         |
| Test coverage      | Module-scoped tests (no cross-module leakage)                   |
| Compliance output  | CSV/JSON export consumable by CSRD/CBAM/ETS reporting pipelines |

**Operations-model significance:** The scheduler is the first Firehorse component where the 3-tier billing contract (§2.0 v2.0, Version 2.0) produces recurring compliance artefacts without human intervention. The hypothesis that an AI-assisted one-person team can operate a multi-tenant compliance product is now testable against real scheduled dispatch.

#### 14.16.2 Firehorse Product Line V2 — Unified DWS IQ Product Family

In April 2026 the four Firehorse modules (Omnichannel, Signed Report, Automation, Content Management) were consolidated into a single V2 product line under the DWS IQ product family. Each module received a V2 naming, dedicated imagery, and a store presence. Merged commits include `Firehorse Product Line V2`, `Firehorse Automation V2`, `Firehorse Starter V2 bundle`, `Firehorse Content Management V2`, `Firehorse Signed Report V2`, `Firehorse ReportV2`, and `firehorse-omnichannel-v2.png`. The Firehorse Starter V2 bundle exists as an entry-level SKU.

**Operations-model significance:** V2 crystallises the Solution Factory output into a catalogue-first product family that can be purchased, bundled, and versioned independently — a pre-condition for the Ops Manager ICP (see §14.16.5).

#### 14.16.3 Firehorse Snap Benchmark — <125 ms Measured Kill Latency

Earlier versions of this thesis cited 122 ms as the Firehorse Snap kill latency specification from Arctic 15 planning documents. In April 2026, the measured kill latency on Firecracker MicroVM infrastructure was captured and published on the KYA Standard page (`dws10.com/kya-standard`). The public claim has been updated from the 122 ms spec to **<125 ms measured** (Firecracker MicroVM benchmark). The KYA page now displays both measured and Firecracker spec figures so readers can distinguish specification from measurement.

**Operations-model significance:** Court-defensible harness claims (§14.12 Harness Engineering and Forensic Telemetry) require measurement, not specification. Updating the public figure from spec to measured is the first time a Firehorse harness guarantee is backed by a reproducible benchmark. This is a precondition for EU AI Act Article 12 log admissibility in enforcement proceedings.

#### 14.16.4 Skills Paradigm Applied to Operations — Anthropic's 2026-04-16 Validation

Anthropic's 2026-04-16 essay "Stop Building Agents, Start Building Skills" (field note `docs/field-notes/2026-04-16-anthropic-skills-paradigm-stop-building-agents.md`) externally validates the skill-first architecture documented in §14.14 (Domain-Specific vs Generic AI Harness). The Firehorse operating model is not "an agent framework with skills" — it is a skill library that happens to invoke agents. Three new production skills shipped in this window:

| Skill                | Purpose                                                        | Ops-model function                                   |
| -------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| `/regulatory-radar`  | Scan EUR-Lex / DG ENER / EFRAG / CINEA for upcoming regulation | Anticipates compliance product roadmap               |
| `/investor-outreach` | Draft, triage, and track investor INTRO notes                  | Makes fundraising a reproducible workflow (§14.16.5) |
| `/multilingual`      | Generate / audit EU multilingual content (FI/SV/DE/FR)         | Localises Firehorse store + onelifetime.world        |

Total skill inventory: 24+ production skills with 4 blocking discipline gates. The hypothesis that skills are the product interface (Section 14.14 Research Significance) is now externally confirmed as the emerging industry pattern.

#### 14.16.5 Ops Manager V0 Buyer Lock + Founder→Team Transition

Two coupled milestones answer the "who buys" and "who builds" questions of the operations model:

- **Ops Manager V0 Buyer Lock (PRD v0.2, commit `4e64a089`):** The first-dollar customer is locked to the Ops Manager persona at Finnish datacentre operators (hyperscaler + colocation). A validation script accompanies the PRD to prevent unvalidated ICP drift. This tightens the loop between Section 14.4 (Contractor Agent Onboarding) and the Datacentre Compliance Agent PRD v0.1 (`docs/DWS_IQ_7_DATACENTRE_COMPLIANCE_AGENT_PRD_v0.1.md`).
- **Founder→Team Transition:** `SOLO_FOUNDER_STATEMENT.md` v1.2 locks the solo-founder-with-AI-team narrative as single source of truth for Series A / SAFE investor conversations. Anthony Maurin enters as CTO co-builder with tightened equity sequencing against the Perissich reactivation catalyst. The `/investor-outreach` skill produces 10+ named INTRO notes in the 2-week window (42CAP Wilke, Plug and Play Paris Laouiti, Ingrisano, Perissich, Kefalogiannis, von Euen, Yomutbayev, Zawadzinski) — investor outreach is now a DWS IQ workflow, not tacit founder knowledge.

**Operations-model significance:** The Firehorse Operations Model survives the founder-to-team transition only if every previously tacit founder activity (fundraising, buyer validation, partner outreach) becomes a skill. PRD v0.2 (buyer validation) + `/investor-outreach` (investor pipeline) are two of three legs; partner outreach (Aiven, Shufti, Kosti Salmi / Salesforce) remains to be codified as a skill in the next window.

#### 14.16.6 Research Contribution

**Key Contribution #19 — Report Engine in Production:** The Firehorse Report scheduler (PR #1064) is the first Firehorse module to ship cron-driven customer deliverables with module-scoped tests and a manual trigger route. This closes the loop between the Operations Model's 3-tier billing contract (Version 2.0) and recurring compliance artefacts without human intervention, providing the first end-to-end test of the one-person-team multi-tenant compliance hypothesis.

**Key Contribution #20 — Measured Harness Guarantee (<125 ms Snap):** The Firehorse Snap kill latency is now backed by a reproducible Firecracker MicroVM benchmark rather than an Arctic 15 specification. This is the first time a court-defensible harness claim in the Firehorse operating model has a published measurement replacing a specification, a precondition for EU AI Act Article 12 log admissibility in enforcement contexts (§14.12).

**Key Contribution #21 — Founder→Team Transition as Skills:** The Ops Manager V0 buyer lock (PRD v0.2 with validation script) and the `/investor-outreach` skill (10+ INTRO notes drafted) together demonstrate that previously tacit founder activities (ICP validation, investor pipeline) can be codified as reproducible DWS IQ skills. This extends the Firehorse Operations Model from internal tooling to a founder-to-team transition mechanism — a necessary property if the operating model is to survive beyond the solo-founder phase.

---

### 14.17 DWS Skilled Taxonomy: Brand / Spec / UI Across Agents, Workflows, and Jurisdictions

_Added: 22.04.2026 | Source: CLAUDE.md "DWS Skilled Taxonomy Rule"; Anthropic 2026-04-16 Skills paradigm essay (§14.16.4); deprecation of "GodAgent" branding. PHD_FIREHORSE version track unified with Metropolia V3Thesis at v3.37; from v3.37 forward all 4 thesis files bump in lockstep (3.37 → 3.38 → … → 3.99 → 4.00)._

#### 14.17.1 From "GodAgent" to a Three-Tier Naming System

The Firehorse Operations Model earlier used "GodAgent" as a single label for industry-scoped specialist agents. Anthropic's 2026-04-16 essay "Stop Building Agents, Start Building Skills" (see §14.16.4) externally validated the skill-first architecture embedded in the operating model (§14.14 Domain-Specific vs Generic AI Harness). With that validation, the single-label convention became a positioning liability: a brand, a specification, and a UI category are three distinct registers, and no single term can serve all three without diluting each. This section introduces the three-tier naming taxonomy that replaces "GodAgent" in the Firehorse operating model.

#### 14.17.2 The Pattern

```
Skilled <Axis>                 ← BRAND   (what we SELL)
    └─ Industrial Specialist <Axis>    ← SPEC    (what they ARE)
            └─ Industry <Axis>         ← UI      (how we LIST them)
```

Three axes are currently active in the Firehorse operating model:

| Tier    | **Agents**                   | **Workflows**                                                       | **Jurisdictions**                     |
| ------- | ---------------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| 1 Brand | Skilled Agents               | Skilled Autonomous Workflows                                        | Skilled Jurisdictions (EU, US, Aiven) |
| 2 Spec  | Industrial Specialist Agents | Specialist Workflows (long-form: _Industrial Specialist Workflows_) | Regulatory Specialist Jurisdictions   |
| 3 UI    | Industry Agents              | Industrial Workflows                                                | Jurisdictions                         |

"Autonomous" appears only in the workflow brand tier because workflows execute on schedule or event without a human in the loop — a property the operating-model store copy must earn for every product that claims recurring compliance artefacts (see §14.16.1 Firehorse Report Engine scheduler). "Regulatory" appears in the jurisdiction spec tier because jurisdictions are defined by their regulatory surface (AI Act, GDPR, CBAM, ETS, CSRD for EU; sector rules for US; data localisation for Aiven), not by geography alone.

#### 14.17.3 Operations-Model Significance

Three implications follow for the Firehorse Operations Model:

1. **SKU copy discipline.** The `brand:` field in `products.json` and store-page metadata must use the brand-tier term (`Skilled Agents`, `Skilled Autonomous Workflows`) to align the outward-facing positioning with the Anthropic Skills paradigm validation (§14.16.4). Spec- and UI-tier terms do not belong in hero copy.
2. **Scheduler copy discipline.** Firehorse Report Engine (§14.16.1) and the forthcoming Firehorse Automation module produce scheduled deliverables; their product descriptions must reach for the workflow tier ("Skilled Autonomous Workflows"), not the agent tier, to avoid under-selling the autonomy property.
3. **Jurisdiction packaging.** The Aegis / Sovereign Infra / Connect segmentation (see V3Thesis §10.21.5) is already organised by regulatory surface. The taxonomy names that structure explicitly: jurisdictions are branded ("Skilled Jurisdictions") rather than treated as deployment metadata.

#### 14.17.4 Count Dynamism

The number of entries in each axis will shift as industries, workflows, and jurisdictions are added. Three acceptable patterns:

1. **Open-ended counts** in platform copy: `18+ Skilled Agents`, `20+ Skilled Jurisdictions` — the `+` absorbs growth.
2. **Registry-anchored references** in specs: "see `docs/Deputy-Agents-Architecture.md` §3 for the current Industrial Specialist Agent registry".
3. **Product-scoped counts** in SKU copy: "Climate Intelligence ships with 8 Skilled Agents" — precise but treated as part of the SKU specification in `products.json`, not as free-floating copy.

#### 14.17.5 Exclusions

- **Docker / infrastructure identifiers** (`dws-godagent-llm` network, `dws-godagent:latest` image, label `dws-godagent`) remain unchanged; their renaming is an infra migration, not a doc change.
- **Pantheon "God Agents"** on `onelifetime.world` (Greek-mythology characters — see §14.9 Climate IQ Pantheon) is a distinct brand and remains unchanged.
- **Historical records** (field notes, dated folders, time-tracking and learning journals) are not retroactively edited.

#### 14.17.6 Research Contribution

**Key Contribution #22 — Register-Explicit Brand Architecture for Operating Models:** The Firehorse Operations Model formalises a three-tier naming taxonomy (Skilled / Industrial Specialist / Industry) applied uniformly across three orthogonal capability axes (agents, workflows, jurisdictions). The taxonomy is a research contribution because it treats naming as part of the operations model rather than marketing overhead: each register has a different audience (buyer, auditor, user) with different compliance obligations, and the single-label convention inherited from early-stage SaaS cannot satisfy all three simultaneously in EU-regulated industries. The `Skilled <Axis>` monotone pattern is proposed as a generalisable design pattern for one-person-team industrial AI platforms that need auditable brand architecture without a dedicated marketing function.

---

## Appendix H: KYA Partner Ecosystem

_Added: 18.03.2026 | Source: docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md, docs/field-notes/2026-03-10-palantir-aip-partner-outreach.md, docs/gtm/KYA_CONNECTOR_BRIEF_PALANTIR.md_

The KYA (Know Your Agent) Standard requires a partner ecosystem to deliver its 5-layer trust framework. No single vendor can provide hardware attestation, identity verification, industrial distribution, and EU-sovereign AI inference simultaneously. This appendix documents the partner architecture and its research implications.

### H.1 KYA 5-Layer Partner Mapping

The KYA Standard defines five trust layers. Each layer maps to a specific partner capability:

| KYA Layer                 | Function                                                                                                                                                                                                     | Partner                       | Integration Status        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | ------------------------- |
| **L1 — Human Identity**   | KYC/AML/IDV verification                                                                                                                                                                                     | Shufti Pro                    | PoC in progress (Q1 2026) |
| **L2 — Agent Provenance** | Agent origin and registry verification                                                                                                                                                                       | DWS Agent Registry (internal) | Production                |
| **L3 — Agent Capability** | Tool/API access gating via MCP manifest                                                                                                                                                                      | DWS MCP Hub (internal)        | Production                |
| **L4 — Runtime Behavior** | Court-defensible telemetry (egress, file I/O, tokens) — OpenSandbox governance layer wrapping Docker containers; VMM-level monitoring below agent OS; TPM 2.0 attested logs for EU AI Act Art. 12 compliance | DWS OpenSandbox (internal)    | From MVP                  |
| **L5 — Continuous Risk**  | Dynamic risk profile monitoring                                                                                                                                                                              | Shufti Pro webhooks           | PoC planned               |

**L4 architecture decision (March 2026):** Application workloads run in Docker containers, but L4 telemetry requires OpenSandbox (Firecracker MicroVM) as a governance layer _around_ the Docker runtime. Docker alone cannot provide court-defensible L4 because: (1) shared kernel allows root agents to manipulate their own logs, (2) no TPM 2.0 attestation of telemetry integrity, (3) EU AI Act Art. 12 requires tamper-proof automatic event logging for all high-risk AI systems. All DWS IQ customers operate in EU-regulated industries — there is no "functional-only L4" tier. Every agent interaction must produce a court-defensible audit trail.

**Research significance:** Layers L2–L4 are built internally, but L1 and L5 require external identity intelligence. This creates a natural partnership boundary: DWS governs the agent runtime; the identity partner governs the human behind it.

### H.2 Shufti Pro — Identity Verification Partner (L1/L5)

**Problem:** Traditional KYC verifies the human at the door. In agent-native architectures, the human is just the entry point. The real risk surface is: what agent does the user deploy, and does the user's risk profile change after the agent is running?

**Integration architecture:**

```
User Onboarding: DWS Auth (Supabase) → Shufti IDV API → KYA L1 Score
Agent Deployment: Agent Manifest → KYA L2-L3 Review → Sandbox Policy
Runtime:          Shufti Webhooks (L5) → DWS Event Bus → Sandbox Restrict/Expand
```

**KYA Trust Score formula:**

```
KYA_TRUST = f(shufti_risk_score, agent_provenance, capability_scope, runtime_behavior)
```

| Score | Tier       | Sandbox Action                          |
| ----- | ---------- | --------------------------------------- |
| >= 80 | Full       | All MCP tools, egress, filesystem       |
| 50–79 | Restricted | No egress, read-only, curated tools     |
| < 50  | Suspended  | Human review required                   |
| 0     | Frozen     | Agent terminated (122ms Firehorse Snap) |

**Partnership terms:** Technical PoC pilot (not seat-license). Shufti provides API access; DWS provides OpenSandbox runtime and KYA framework. Value proposition for Shufti: first-mover in "Zero-Trust Agent Workspace" category — identity layer for autonomous AI agents, not just humans.

**Current status (March 2026):** EU-only processing confirmation and DPA (Data Processing Agreement) requested from Shufti. GDPR Art. 44-49 compliance required for enterprise customers. HMAC-SHA256 webhook signing confirmed.

### H.3 Palantir AIP — Connector Partner Model

**Strategic thesis:** Palantir AIP is a platform partner opportunity, not a competitor. Palantir has enterprise distribution and ontology data modeling; DWS has hardware-level agent isolation and EU regulatory depth.

| Palantir Has                         | Palantir Lacks                 | DWS IQ Provides                          |
| ------------------------------------ | ------------------------------ | ---------------------------------------- |
| Enterprise agent orchestration (AIP) | Hardware-level agent isolation | Firecracker MicroVM (122ms kill)         |
| Fortune 500 customer base            | EU CBAM/ETS/Fit for 55 depth   | 20-industry regulatory engine            |
| Ontology data model                  | TPM 2.0 hardware attestation   | Court-defensible audit trail             |
| $2.6B ARR, proven scale              | Sub-5ms VMM-layer guardrails   | Hardware-enforced behavioral enforcement |

**Connector architecture:** AIP agent workflows run inside KYA-governed Firecracker MicroVMs. Zero modification to existing Palantir workflows. The governance layer sits _below_ the agent's operating system.

**Revenue models proposed:**

| Model             | Structure                                            |
| ----------------- | ---------------------------------------------------- |
| Connector License | Per-MicroVM governance fee (€0.02/agent/hour)        |
| Co-sell           | Joint enterprise deals in EU regulated industries    |
| OEM               | Palantir bundles KYA governance into AIP EU offering |

### H.4 BYO (Bring Your Own) Agent Policy

BYO defines how external agents — from any partner or customer — enter the DWS IQ ecosystem:

| BYO Stage           | Gate                                                          | Enforcement              |
| ------------------- | ------------------------------------------------------------- | ------------------------ |
| Registration        | Agent manifest (name, version, tool requirements, source)     | DWS Agent Registry API   |
| Identity Binding    | Agent bound to verified human identity                        | KYA L1 (Shufti)          |
| Capability Review   | MCP tools reviewed against organization policy                | MCP Tool Approval        |
| Sandbox Entry       | Isolated sandbox (Stage 1–3 based on tenant tier)             | OpenSandbox Architecture |
| Runtime Monitoring  | Continuous telemetry: egress, file writes, token consumption  | KYA L4                   |
| Dynamic Restriction | Risk profile change → sandbox permissions adjust in real-time | KYA L5 (Shufti webhooks) |

**Significance for Firehorse:** BYO enables the platform-as-a-service model. Customers bring their own agents; DWS governs them. This is the monetization layer for the Firehorse operating model.

### H.5 Strategic Ecosystem Partners (Brain-Memory-Body-Hands)

The 5-partner ecosystem maps to the DWS architecture layers:

| Partner             | Architecture Layer                                       | KYA Role                                       | Status                   |
| ------------------- | -------------------------------------------------------- | ---------------------------------------------- | ------------------------ |
| NVIDIA              | Brain (compute) + Hands (Jetson edge) + Body (Omniverse) | Compute substrate for KYA-governed agents      | Inception target Q2 2026 |
| Siemens             | Hands (MindSphere IoT) + Body (digital twin)             | Industrial IoT data for KYA runtime monitoring | Xcelerator Q2 2026       |
| ABB                 | Hands (automation, robotics, power grid)                 | Physical execution layer under KYA governance  | Q3 2026                  |
| xAI                 | Brain (Grok real-time market intelligence)               | Real-time signals for multi-LLM router         | Active production        |
| Mistral             | Brain/Memory (EU-sovereign AI inference)                 | EU-sovereign model for compliance workloads    | Planned Q3 2026          |
| Shufti Pro          | L1/L5 (Human Identity + Continuous Risk)                 | Identity verification for KYA trust framework  | PoC Q1 2026              |
| Palantir (proposed) | Brain (AIP orchestration)                                | Enterprise distribution via connector model    | Outreach initiated       |

**Distribution hypothesis validation:** Access to 10,000+ industrial customers (NVIDIA Inception, Siemens Xcelerator) without building a direct sales organization. The partnership model is the distribution strategy — not a supplement to it.

### H.6 Research Contribution

The KYA partner ecosystem demonstrates three research findings:

1. **Identity-to-runtime bridge:** No existing vendor offers continuous identity monitoring that controls autonomous agent sandbox permissions. The Shufti-KYA integration creates a new category: execution-layer trust.

2. **Connector-not-competitor positioning:** The Palantir connector model shows that hardware governance can be offered as an infrastructure layer to existing platform vendors — a partnership strategy that avoids direct competition with established players.

3. **Partnership as distribution:** For a one-person startup, the 5-partner ecosystem (NVIDIA, Siemens, ABB, xAI, Mistral) provides market access equivalent to a direct sales organization — validating the Firehorse operating model's hypothesis that partnerships can substitute for headcount in early-stage industrial AI companies.

---

**Key Contributions:**
1-14. (See VERSION AND AGENT HISTORY) 15. Harness Engineering and Forensic Telemetry — Connects OpenAI's harness engineering framework to Firehorse forensic operations; demonstrates that EU-regulated industries require court-defensible harness (VERSION AND AGENT HISTORY, KYA hardware attestation) vs Silicon Valley speed optimization; empirical validation that harness improvements alone yield 52.8%→66.5% gains (model unchanged); KYA Standard as hardware-attested harness beyond software scaffolding 16. KYA Partner Ecosystem — 5-layer partner mapping (Shufti IDV for L1/L5, Palantir AIP connector model, BYO Agent Policy); demonstrates identity-to-runtime bridge as new category, connector-not-competitor positioning for enterprise distribution, and partnership-as-distribution hypothesis for one-person startup scaling 17. Competitive Analysis: Domain-Specific vs Generic AI Harness — 6-differentiator comparison against 136-skill generic frameworks; token-budget argument for domain specificity in regulated industries 18. Master Thesis Dual-Version Architecture — v3.30.50 frozen 50-page Metropolia outgoing + 82-page living document; pattern for AI-assisted academic writing where research velocity exceeds institutional format constraints 19. Report Engine in Production — Firehorse Report scheduler (PR #1064) as first cron-driven customer deliverable; closes 3-tier billing contract loop with recurring compliance artefacts; first end-to-end test of one-person-team multi-tenant compliance hypothesis 20. Measured Harness Guarantee (<125 ms Snap) — Firehorse Snap kill latency backed by Firecracker MicroVM benchmark replacing Arctic 15 specification; first court-defensible harness claim with published measurement replacing spec; precondition for EU AI Act Article 12 log admissibility 21. Founder→Team Transition as Skills — Ops Manager V0 buyer lock (PRD v0.2 + validation script) + `/investor-outreach` skill (10+ INTRO notes) codify previously tacit founder activities as reproducible DWS IQ workflows; extends Firehorse Operations Model from internal tooling to founder-to-team transition mechanism 22. KYA Agentic AI Foundation Targeting with Dual-Use Extension — KYA positioned as a general trust/governance standard candidate for agentic systems; DWS 7 designated as empirical testbed for hydrogen-economy continuity, sovereignty segmentation (Aegis/Sovereign Infra/Connect), and dual-use validation (Nokia Defence discussions), with Siemens and NVIDIA Connect collaboration pathways 23. KYA Open-Source Standardization Path — explicit standardization route added (Agentic AI Foundation / Linux Foundation) with declared status (proposal and NIST track not yet submitted), moving Article 1 from conceptual framing to an open-spec + reference-implementation publication agenda 24. DWS Skilled Taxonomy (Register-Explicit Brand Architecture for Operating Models) — three-tier `Skilled / Industrial Specialist / Industry` naming pattern applied uniformly across three orthogonal axes (Agents, Workflows, Jurisdictions) with explicit extensibility pattern for future axes; operations-model implications derived (SKU-copy discipline, scheduler-copy discipline, jurisdiction packaging); "GodAgent" branding deprecated in favour of register-specific terms aligned with Anthropic Skills paradigm validation (§14.16.4)

_Document generated using Firehorse Operations Model with Claude Code_
_Last updated: 22.04.2026_
_Version: 3.37 (unified with Metropolia V3Thesis; lockstep from this point)_

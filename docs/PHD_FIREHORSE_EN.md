# Master Thesis: Firehorse Operations Model for AI-Assisted E-Commerce

**Title:** AI-Native Store Operations: A Case Study of Firehorse Model Implementation with Claude Code
**Author:** Lifetime Oy Research Division
**Date:** January 2026
**Institution:** DWS IQ Research
**Document Type:** Master Thesis Documentation

***
# VERSION AND AGENT HISTORY

Version: 2.3

Sessions & Modifications:
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
  - Last Modified: 13.03.2026
  - Language: English
  - Languages Available: English, Suomi
  - Publication Status: DRAFT (V2.3 — Two-Tier HTAP Architecture: Aiven-first mandate, TimescaleDB Hypercore, edge pg_duckdb on GN100)

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
14. [Enterprise Multi-Tenant Agent Architecture](#14-enterprise-multi-tenant-agent-architecture)
15. [Results and Discussion](#15-results-and-discussion)
16. [Conclusion](#16-conclusion)
17. [References](#17-references)
18. [Appendices](#18-appendices)

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

| Category | Products | Price Range |
|----------|----------|-------------|
| Platform Software | DWS IQ v5, v6 | €4,999 - €6,995 |
| Firehorse Suite | Automation, Report, CMS, Omnichannel | €499 - €4,950 |
| Consulting Services | Hourly, Monthly, Workshops | €98 - €6,250 |
| Training & Coaching | AI Koulutus, Coach, Mentor | €499 - €6,250 |
| Digital Products | Glossaries, Web Pages | €0.99 - €799 |

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

| Regulation | Effective Date | Impact |
|------------|----------------|--------|
| EU AI Act | August 2026 | AI system classification, transparency requirements |
| GDPR | May 2018 | Data protection, consent management |
| NIS2 Directive | October 2024 | Cybersecurity requirements |
| Green Claims Directive | 2026 | Environmental marketing compliance |
| Fit for 55 Package | 2030 targets | Carbon reduction obligations |
| CSRD | January 2024 | Corporate sustainability reporting |
| CBAM | October 2023 | Carbon border adjustment mechanism |
| EPBD 2028 | 2028 | Building energy performance |

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

| Domain | AI Capabilities | Human Oversight |
|--------|----------------|-----------------|
| Product Management | CRUD operations, feed generation | Pricing approval, content review |
| Payment Integration | Link creation, configuration | Financial authorization |
| Compliance | Document generation, monitoring | Legal sign-off |
| Customer Interaction | AI chat, recommendations | Escalation handling |
| Documentation | Manual generation, translations | Technical review |

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
  const products = require('../config/products.json');

  // 2. Validate required fields
  validateProducts(products); // id, mpn, price, brand

  // 3. Generate XML with g: namespace
  let xml = generateXMLHeader();

  for (const product of products) {
    xml += generateProductItem(product);

    // 4. Add checkout_link_template for Revolut
    const checkoutLink = product.revolutLink || 'https://revolut.me/lifetimeoy';
    xml += `<g:checkout_link_template>${checkoutLink}</g:checkout_link_template>`;
  }

  // 5. Write google-products.xml
  writeFile('google-products.xml', xml);
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

| Feature | Benefit |
|---------|---------|
| Instant settlements | Improved cash flow, same-day access |
| Multi-currency | Support for EUR, SEK, NOK, DKK, GBP |
| Low fees | 1.0% + €0.20 per transaction |
| API integration | Automated reconciliation |
| Checkout links | Direct Google Merchant support |
| Apple Pay / Google Pay | Modern payment methods |

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

| Setting | Value |
|---------|-------|
| Merchant ID | 8496329 |
| Target Country | Finland (FI) |
| Languages | English (primary), Finnish |
| Feed Method | SFTP upload |
| Feed URL | https://dws10.com/feeds/google-products.xml |
| SFTP Host | partnerupload.google.com:19321 |

### 6.2 Feed Compliance Requirements

| Attribute | Requirement | Implementation |
|-----------|-------------|----------------|
| g:id | Unique identifier | Matches products.json ID |
| g:mpn | Manufacturer part number | Format: CATEGORY-TYPE-YEAR |
| g:brand | Product brand | "Lifetime" or "Firehorse" |
| g:price | Price with currency | EUR format |
| g:availability | Stock status | Always "in_stock" for services |
| g:checkout_link_template | Payment URL | Revolut checkout link |
| g:condition | Product condition | Always "new" |

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

| Issue | Root Cause | Resolution |
|-------|------------|------------|
| Domain mismatch | URLs pointing to lifetime.fi | Updated all URLs to dws10.com |
| Duplicate products | ID mismatch with Merchant Center | Aligned IDs in products.json |
| identifier_exists error | Set false when MPN+brand exist | Removed field entirely |
| Image URL errors | Double slashes in paths | Fixed path generation |
| Missing checkout links | No payment URL configured | Added Revolut links |

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

| Regulation | Relevant Products | Customer Need |
|------------|------------------|---------------|
| **EU AI Act** | DWS IQ v6, Conversational Agent | AI system documentation, transparency |
| **Fit for 55** | DWS IQ Platform, Firehorse Report | Carbon reporting, ETS compliance |
| **CSRD** | Climate Reporting Bundle | Sustainability disclosure |
| **GDPR** | Protonmail Implementation | Data protection, encryption |
| **NIS2** | Protonmail, Firehorse CMS | Cybersecurity requirements |
| **Green Claims** | Firehorse Omnichannel | Environmental marketing compliance |
| **EPBD 2028** | Firehorse Automation | Building energy performance |
| **CBAM** | DWS IQ, Consulting Fit55 | Carbon border adjustment |

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

| Industry Indicator | Detected Sector | Primary Products |
|-------------------|-----------------|------------------|
| "cement", "concrete" | Cement | DWS IQ v6, Climate Bundle |
| "steel", "metal" | Steel | DWS IQ v6, Firehorse Automation |
| "chemical", "petrochemical" | Chemicals | Firehorse Report, Consulting |
| "automotive", "vehicle" | Automotive | DWS IQ v6, Expert Advisory |
| "shipping", "maritime" | Maritime | Firehorse Automation, Report |
| "aviation", "airline" | Aviation | DWS IQ v6, Consulting Fit55 |
| "building", "construction" | Buildings | Firehorse CMS, Automation |
| "agriculture", "farming" | Agriculture | Climate Bundle, Advisory |

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

| Phase | Quarter | Features | EU Compliance |
|-------|---------|----------|---------------|
| 1 | Q1 2026 | Basic audio chat | AI Act transparency |
| 2 | Q2 2026 | Carbon calculator | Fit for 55 support |
| 3 | Q3 2026 | Regulation engine | Full compliance mapping |
| 4 | Q4 2026 | Partner ecosystem | Extended offerings |

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

| Industry | Avg. tCO2e/M€ Revenue | Primary Emission Source |
|----------|----------------------|------------------------|
| Steel | 850 | Process emissions (Scope 1) |
| Cement | 900 | Calcination process |
| Chemicals | 400 | Energy + feedstock |
| Automotive | 150 | Manufacturing + supply chain |
| Maritime | 300 | Fuel consumption |
| Aviation | 500 | Jet fuel combustion |
| Buildings | 100 | Energy performance |
| Agriculture | 250 | Land use, livestock |
| Pulp & Paper | 200 | Process energy |
| Glass | 350 | Melting process |
| Ceramics | 300 | Kiln operations |
| Textiles | 180 | Supply chain |
| Food & Beverage | 120 | Processing + cold chain |
| Electronics | 80 | Manufacturing + use phase |
| Pharmaceuticals | 60 | Controlled processes |
| Data Centers | 150 | Electricity consumption |

### 10.3 Product Mapping by Carbon Profile

| Carbon Profile | Emissions Range | Recommended Products |
|---------------|-----------------|---------------------|
| Very High | >100,000 tCO2e | DWS IQ v6, Firehorse Automation, Expert Advisory |
| High | 10,000-100,000 tCO2e | DWS IQ v6, Firehorse Report, Climate Bundle |
| Medium | 1,000-10,000 tCO2e | Climate Bundle, Firehorse Report |
| Low | <1,000 tCO2e | Firehorse Report, Consulting Hourly |

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

| Component | Description |
|-----------|-------------|
| Proton Mail | End-to-end encrypted email |
| Proton Drive | Encrypted cloud storage |
| Proton Pass | Zero-knowledge password manager |
| Proton VPN | Secure networking |
| Domain Setup | Custom domain configuration |
| Migration | Email migration assistance |

### 11.3 Compliance Coverage

| Regulation | Proton Compliance |
|------------|-------------------|
| GDPR Article 32 | Technical security measures |
| NIS2 | Cryptographic controls |
| EU AI Act | Secure AI communications |
| Swiss FADP | Additional privacy protection |

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

| Tier | Mechanism | Scope | Legal Basis |
|------|-----------|-------|-------------|
| **Tier 1: Public** | Free distribution | Teaser, FCD concept, market sizing | — |
| **Tier 2: NDA Required** | Confidentiality agreement | LWM architecture, knowledge graph overview, BYOC logic | EU Trade Secrets Directive 2016/943 |
| **Tier 3A: Patent** | Patent protection | CIDM method, causal reasoning algorithm | PRH (Finland), EPO, PCT |
| **Tier 3B: Trade Secret** | Internal controls | Knowledge graph structure (10,000+ nodes), weights, training data | EU 2016/943, Finnish Trade Secrets Act 595/2018 |

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

| Priority | Innovation | Filing Path | Status |
|----------|-----------|-------------|--------|
| P1 | CIDM — Climate-Intelligent Decision Making | PRH → PCT → EPO/USPTO | Patent pending |
| P2 | Causal Reasoning for Regulatory Risk | PRH → PCT | Prior art search Q2 2026 |
| P3 | LWM Temporal Latent Space | PRH → PCT | Evaluation Q3 2026 |

**Critical rule:** Patent applications MUST be filed before any public disclosure of the method. NDA-protected disclosures do not destroy patentability.

### 12.4 Trade Secret as Preferred Protection for Knowledge Graph

For the knowledge graph (10,000+ nodes), trade secret protection is strategically preferred over patents:

| Factor | Patent | Trade Secret |
|--------|--------|-------------|
| Duration | 20 years (then public) | Indefinite |
| Disclosure | Must publish full method | No disclosure |
| Competitor awareness | Knows exactly what's protected | Cannot know what to copy |
| Cost | €120k–200k (3 patents, EU+US) | Administrative only |

Trade secret status under EU Directive 2016/943 requires: (1) the information is secret, (2) it has commercial value because it is secret, and (3) reasonable steps have been taken to keep it secret. Lifetime Oy maintains access controls, encryption, employee confidentiality agreements, and internal classification registers.

### 12.5 Implications for Firehorse Operations

The IPR framework directly impacts Firehorse e-commerce operations:

- **Product descriptions** on dws10.com describe *what* the platform does (Tier 1), never *how* it works
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

| Rule | Principle | Implementation |
|------|-----------|---------------|
| **1. Static first, dynamic last** | Maximize shared prefix across sessions | System prompt → CLAUDE.md → session context → messages |
| **2. Use system messages for updates** | Never modify the static prompt mid-session | Pass time, file changes, mode switches via `<system-reminder>` tags in the next message |
| **3. Never change models mid-session** | Prompt caches are model-specific | Switching from Opus to Haiku at 100k tokens costs more than keeping Opus (cache rebuild) |
| **4. Never add/remove tools mid-session** | Tools are part of the cached prefix | Use tool stubs with `defer_loading: true` for optional tools; discover via ToolSearch |
| **5. Design features around the cache** | State transitions via tools, not tool set changes | Plan mode = system message + ExitPlanMode tool, not swapping the tool set |
| **6. Fork operations share parent prefix** | Compaction/summarization must reuse cache | Use identical system prompt, tools, and message history for forked requests |

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

| Operation | Cache Impact | Practice |
|-----------|-------------|----------|
| Product catalog updates | Long session, many file edits | Keep same model throughout |
| Feed generation | Tool-heavy workflow | All tools defined at session start |
| Compliance checking | Context-heavy (regulations) | CLAUDE.md cached as project config |
| Multi-file sync (dual folder) | Sequential dependent operations | Chain in single session, don't fork |

**Monitoring:** Cache hit rate is treated as an uptime metric. A drop in cache hits triggers investigation — it indicates a system prompt change, tool definition shift, or model switch that needs correction.

### 13.6 Cost & Latency Implications

| Scenario | Cache Hit Rate | Relative Cost | Latency |
|----------|---------------|---------------|---------|
| Optimized (static prefix) | >90% | 1x (baseline) | Low |
| Tool set changes mid-session | ~50% | ~2x | High |
| Model switch mid-session | 0% (full rebuild) | ~3-5x | Very high |
| Compaction without parent prefix | 0% | ~3x | High |

These economics are critical for Firehorse's AI-assisted store operations, where sessions routinely process 30+ products across multiple files.

---

## 14. Enterprise Multi-Tenant Agent Architecture

### 14.1 Per-Industry Open LLM Selection

No single open LLM is optimal for all 16 EU industries served by DWS IQ. Each industry vertical has distinct regulatory language, domain knowledge requirements, and structured output needs. The `AgentConfig.model` field is already per-agent, so each concrete agent can be configured with a different trained Lifetime World Model (LWM) + open LLM, with continuous benchmarking.

**Candidate open LLMs by industry cluster:**

| Industry Cluster | Candidate Models | Key Domain Requirement |
|-----------------|------------------|----------------------|
| Construction, Real Estate | Llama 3.3 70B, Qwen 2.5 72B, Mistral Large | EN 15978 lifecycle stages, Nordic building codes, EPBD |
| Energy, Steel & Metals, Cement | Llama 3.3, DeepSeek-V3, Mixtral 8x22B | ETS allowance calculations, process emissions, CBAM |
| Manufacturing, Chemicals | Qwen 2.5 72B, Llama 3.3 | CBAM product classification, BOM analysis, REACH |
| Logistics, Maritime, Aviation | Mistral Large, Llama 3.3, Gemma 2 27B | FuelEU Maritime, CORSIA, route optimization |
| Agriculture, Food & Beverage | Llama 3.3, Gemma 2, Command R+ | LULUCF, Scope 3 supply chain, packaging lifecycle |
| Finance, Public Sector | Mistral Large (EU-hosted), Llama 3.3 | SFDR, EU Taxonomy, double materiality, GPP |
| Healthcare, Textiles | Gemma 2 (EU-hosted), Qwen 2.5 | Digital product passport, pharmaceutical supply chain |

**Selection criteria:** domain knowledge depth, multilingual capability, structured output reliability, context window (128k+), inference speed, EU data residency, and commercial license.

**Continuous benchmarking process:** Each industry agent runs weekly automated compliance prompts (EN 15978, CSRD ESRS E1, CBAM declarations) against the current model and 2-3 alternatives. If an alternative consistently scores higher on accuracy and structured output, the model is flagged for review and potential switch.

### 14.2 Bring Your Own Agent (BYOA) Architecture

Enterprise customers bring their own AI agents to work on DWS IQ. This section uses NCC (Nordic construction company) as an illustrative case.

**NCC agent ecosystem:**

| Agent Source | Count | Examples |
|-------------|-------|---------|
| **NCC Internal** | 7 | Procurement, Safety Compliance, BIM, Sustainability, Cost Estimation, Quality, Project Planning |
| **Contractor Agents** | 14 | HVAC Subcontractor, Electrical, Concrete Supplier, Steel Supplier, Window Manufacturer, Insulation, etc. |
| **DWS IQ Platform** | 3 | Compliance Calculation, Firehorse Report, Carbon Calculator |
| **Total** | 24 | All connected via A2A + MCP protocols |

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

**Why 16 industries make the LWM stronger:** Each industry added to the platform makes every existing industry's LWM smarter through cross-pollination of anonymized compliance patterns. A carbon reduction technique proven in cement manufacturing generates transferable insight for construction. Supply chain Scope 3 agents in manufacturing transfer to food & beverage. The 16th industry customer benefits from all 15 industries' accumulated intelligence — creating a moat that single-industry competitors cannot replicate.

### 14.3 Agent Orchestration Studio: Graphical Workflow Builder

To enable enterprise customers to build connections between 24+ agents, the platform provides a visual workflow builder.

**Tool evaluation:**

| Tool | License | MCP Support | A2A Support | Self-Hosted EU | Best For |
|------|---------|-------------|-------------|---------------|----------|
| **Langflow** | Apache 2.0 | Native (client + server) | Via custom nodes | Yes | Agent orchestration, LLM workflows |
| **n8n** | Fair Code | Via community nodes | Via HTTP nodes | Yes | ERP/BIM connectors, data pipelines |
| **React Flow** | MIT | Custom | Custom | N/A (library) | Custom visual builder UI |
| **Flowise** | Apache 2.0 | Partial | No | Yes | Chatbot RAG workflows |
| **Node-RED** | Apache 2.0 | Via FlowFuse | Via HTTP | Yes | IoT/edge, industrial automation |
| **Temporal UI** | MIT | No | No | Yes | Workflow execution monitoring |

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

| # | Gap | Fix | Key File |
|---|-----|-----|----------|
| 1 | Single-shot LLM calls | Observe-think-act loop (`runLoop()`) | `base.agent.ts` |
| 2 | No tool use | Tool runtime with JSON Schema + 4 built-in tools | `tools.ts` |
| 3 | Hardcoded Groq fetch | Multi-provider client (Anthropic > Groq > OpenAI) | `llm-client.ts` |
| 4 | No agent communication | Delegation + depth tracking + discovery API | `index.ts` |
| 5 | MCP was vapor | JSON-RPC 2.0 server at `/mcp` | `agent-server.ts` |
| 6 | Express-only | Event bus with pub/sub + Redis Streams | `event-bus.ts` |

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


*Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026*

#### 14.6.1 Stage 1.5 — OpenSandbox on Acer Veriton GN100

The Agent Foundry received a new isolation stage between the demo-grade SDK sandbox (Stage 1) and Cloud Run (Stage 2): **OpenSandbox** (https://github.com/alibaba/OpenSandbox) deployed on the **Acer Veriton GN100** edge node (120 GiB RAM, 20 cores, Helsinki Lab).

| Stage | Method | Cost | Use Case |
|-------|--------|------|----------|
| 1 | SDK sandbox (bubblewrap/seatbelt) | €0 | Demo, single-tenant |
| **1.5** | **OpenSandbox Docker (Veriton GN100)** | **€0 HW** | **EU air-gapped, internal pilot** |
| 2 | Cloud Run ephemeral (europe-north1) | ~€20-50/mo | Paid multi-tenant |
| 3 | Persistent containers (gVisor) | €200+/mo | Scale |

Activation: `SANDBOX_STAGE=opensandbox`. Six MCP tools (`sandbox_create`, `sandbox_execute`, `sandbox_file_read`, `sandbox_file_write`, `sandbox_destroy`, `sandbox_ping`) expose it via `/sandbox/*` endpoints in the MCP Hub.

**Firehorse operating model impact:** Stage 1.5 enables EU air-gapped agent execution for regulated industries (defense, healthcare, critical infrastructure) — customers where data must never leave on-premises hardware. The Acer Veriton GN100 is the first physical Lifetime Fleet node fulfilling this capability.

#### 14.6.2 EMPO²: Academic Grounding for the LWM Memory Architecture

The paper *"Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization"* (EMPO², arXiv:2602.23008, February 2026) provides academic validation for the DWS Lifetime World Model's hybrid memory design.

EMPO² proposes combining:
- **Parametric memory** (RL updates to model weights) — analogous to DWS LWM fine-tuning (QLoRA, Acer Veriton GN100)
- **Non-parametric memory** (retrieval from memory buffer) — analogous to DWS RAG over EU regulations + enterprise data (pgvector)

Results: 128.6% improvement over GRPO on ScienceWorld, 11.3% on WebShop. Key insight: *models trained with memory become robust even without memory at inference* — validating the DWS strategy of progressively embedding domain knowledge into LWM weights while maintaining RAG as a fallback.

The OpenSandbox environment additionally serves as a **safe EMPO²-style RL training sandbox**: isolated containers provide the clean, reproducible environments needed for RL-based memory training without affecting production infrastructure.

#### 14.6.3 Lifetime Scope Signals for LWM Training Coordination

*Session: claude/pedantic-easley | Date: 07.03.2026*

The Lifetime Scope Signals (LSS) protocol — originally designed for deterministic multi-agent development coordination (see Metropolia thesis Section 2.5.2) — extends naturally to ML pipeline orchestration. Rather than introducing a dedicated ML workflow engine (Kubeflow, Airflow), the LWM training pipeline is coordinated using the same four signal types: READY, COMPLETE, ERROR, BLOCKED.

**Training Agent Fleet (T-01 through T-10):**

| Agent ID | Name | Role | Emits | Listens For |
|----------|------|------|-------|-------------|
| T-01 | InfraVerifier | Validate CUDA/PyTorch on GN-100 nodes | `COMPLETE:infra-verified` | (none — entry point) |
| T-02 | ModelFetcher | Download base model to shared storage | `READY:base-model` | `T-01:COMPLETE:infra-verified` |
| T-03 | CurriculumAgent | Claude API curriculum design per vertical | `READY:curriculum:{vertical}` | `T-02:READY:base-model` |
| T-04 | DataSynthAgent | Generate 2000+ synthetic examples | `READY:dataset:{vertical}` | `T-03:READY:curriculum:{vertical}` |
| T-05 | TrainingAgent | QLoRA fine-tuning on assigned node | `READY:lora-weights:{vertical}` | `T-04:READY:dataset:{vertical}`, `T-06:READY:node-slot` |
| T-06 | ResourceArbiter | Allocate GN-100 node slots (2 tokens) | `READY:node-slot` | `T-05:READY:lora-weights:*` (releases slot) |
| T-07 | EvalAgent | Claude-as-judge, quality gate ≥7.0 | `READY:eval-pass:{vertical}` / `ERROR:eval-fail:{vertical}` | `T-05:READY:lora-weights:{vertical}` |
| T-08 | MergeAgent | Merge LoRA adapter into base model | `READY:merged-model:{vertical}` | `T-07:READY:eval-pass:{vertical}` |
| T-09 | DeployAgent | Deploy inference API | `COMPLETE:lwm-deployed:{vertical}` | `T-08:READY:merged-model:{vertical}` |
| T-10 | PipelineOrchestrator | Monitor all verticals | `COMPLETE:lwm-all-verticals` | All `T-09:COMPLETE:*` |

The `{vertical}` parameterized milestone enables per-industry pipeline instantiation — the only protocol extension over base LSS v1.0.

**Key mechanisms:**

1. **Quality gate signals** — T-07 emits `READY:eval-pass:{vertical}` only when Claude-as-judge score ≥7.0; failure emits `ERROR:eval-fail:{vertical}`, triggering curriculum re-generation (max 3 retries → `BLOCKED` → human escalation). This maps to the EMPO² off-policy update pattern (Section 14.6.2).

2. **Resource arbitration** — T-06 manages two node-slot tokens (one per GN-100). Training agents acquire a token before starting; release on completion. First-come-first-served by signal emission order.

3. **Fan-Out parallelism** — Curriculum generation (T-03) and data synthesis (T-04) run across all 16 verticals simultaneously (CPU-bound, no GPU constraint), eliminating idle GPU time.

**Firehorse operating model impact:** The training coordination validates LSS as a general-purpose deterministic coordination mechanism — the same protocol orchestrates both software development agents (Appendix F) and ML training pipelines, reducing operational complexity for Firehorse customers who need both capabilities.

### 14.7 CEO Automation Agent Suite

*Deployed: 24.02.2026 | Commit: claude/ai-agent-orchestration-t89Ig*

Three production agents automate the CEO's daily operational loop — GitHub Actions cron, Supabase data layer, Resend delivery.

| Agent | Trigger | Role |
|-------|---------|------|
| **Captain Pre-Briefing** | 07:30 Helsinki, Mon-Fri | Pre-call prep: CRM pull → talking points → email |
| **LinkedIn Post Scheduler** | 08:00 Helsinki, Mon-Fri | Content calendar → draft → CEO approval digest |
| **EU Regulation Monitor** | 05:30 Helsinki, Mon-Fri | RSS fetch → classify by regulation → severity score → feed scheduler |

The EU Regulation Monitor creates a closed feedback loop: it fetches EU Commission / EUR-Lex / Carbon Pulse / Euractiv, classifies by regulation (CBAM, CSRD, Fit for 55, EPBD, EU AI Act, ETS), and feeds regulation alerts as LinkedIn content ideas — ensuring CEO outreach stays aligned with active regulatory development.

**Firehorse operating model impact:** These agents demonstrate the model at the revenue layer — not just product management and compliance, but active sales motion and thought leadership are now AI-automated. The CEO operates as a supervisor, not an executor, of the daily revenue workflow.

### 14.8 Strategic Partnerships and Multi-LLM Router

*Documented: 27.02.2026 | Source: docs/DWS6_TO_DWS7_UPDATE.md v1.1*

DWS7 has formalized a 5-partner ecosystem for the Brain-Memory-Body-Hands architecture:

| Partner | Architecture Layer | Status |
|---------|--------------------|--------|
| NVIDIA | Brain (compute) + Hands (Jetson edge) + Body (Omniverse) | Inception target Q2 2026 |
| Siemens | Hands (MindSphere IoT) + Body (digital twin) | Xcelerator Q2 2026 |
| ABB | Hands (automation, robotics, power grid) | Q3 2026 |
| xAI | Brain (Grok real-time market intelligence) | Active production |
| Mistral | Brain/Memory (EU-sovereign AI inference) | Planned Q3 2026 |

**Multi-LLM Router:** Task-level LLM selection based on sovereignty, cost, and latency — Claude/Mistral for compliance, Grok for market signals, Groq for low-latency summarization, Qwen 2.5 72B (QLoRA, Acer Veriton) for on-premises sovereign inference.

**Research contribution:** The partnership model validates the Firehorse operating model's distribution hypothesis: access to 10,000+ industrial customers (NVIDIA Inception, Siemens Xcelerator) without building a direct sales organization — a key enabler of the free-tier bootstrap strategy applied at scale.

---

## 15. Results and Discussion

### 15.1 Operational Efficiency Gains

The Firehorse Operations Model with Claude Code achieved:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Product update time | 2 hours | 5 minutes | 96% |
| Feed generation | Manual | Automated | 100% |
| Documentation creation | 1 week | 1 hour | 99% |
| Error rate | 5% | <1% | 80% |
| Store page updates | 4 hours | 15 minutes | 94% |

### 15.2 Google Merchant Center Performance

After implementing Revolut checkout links and fixing feed issues:

| Metric | Result |
|--------|--------|
| Product approval rate | 100% (30/30 products) |
| Feed processing time | <24 hours |
| Checkout conversion | Direct to payment |
| Feed file size | 32,893 bytes |

### 15.3 Compliance Readiness Assessment

| Regulation | Readiness | Gap Analysis |
|------------|-----------|--------------|
| EU AI Act | 80% | Audio chat transparency pending |
| GDPR | 95% | Proton implementation complete |
| Fit for 55 | 90% | Product catalog complete |
| NIS2 | 75% | Security assessment needed |
| CSRD | 85% | Reporting templates ready |

### 15.4 Limitations

1. **Audio chat not yet deployed** - Roadmap documented, Q1 2026 target
2. **Partner ecosystem** - Partnerships in development
3. **Multi-language support** - Currently English/Finnish only
4. **Carbon calculator** - Requires industry data validation

---

## 16. Conclusion

### 16.1 Summary

The Firehorse Operations Model demonstrates that AI-assisted e-commerce management can:

1. **Reduce operational overhead** by 90%+ through automated product management
2. **Ensure compliance** with EU regulations via documented audit trails
3. **Enable rapid iteration** on product offerings with natural language interfaces
4. **Prepare infrastructure** for voice-based customer interactions
5. **Support industrial customers** with carbon calculator integration

### 16.2 Key Contributions

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

### 16.3 Future Work

1. **Q1 2026:** Deploy audio chat Phase 1 with EU AI Act transparency
2. **Q2 2026:** Implement industry carbon calculator with Scope 1/2/3
3. **Q3 2026:** Launch regulation awareness engine
4. **Q4 2026:** Establish partner ecosystem with commission model
5. **2027:** Expand to additional EU markets (SE, NO, DK, DE)

---

## 17. References

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
13. EU Trade Secrets Directive (EU) 2016/943
14. Finnish Trade Secrets Act (liikesalaisuuslaki 595/2018)
15. Patent Cooperation Treaty (PCT), WIPO
16. Shihipar, T. (2026). "Lessons from Building Claude Code: Prompt Caching Is Everything." Anthropic Engineering Blog

### DWS Platform Standards (Internal)

The following internal standards govern the DWS IQ 6 platform architecture, security, and quality. They are maintained as living documents in the private repository and are referenced here in Oxford notation for academic traceability.

17. Lifetime Oy (2026). *DWS Security Standard*, version 1.5. `DWS_SECURITY_STANDARD.md`. Internal framework governing AI safety, middleware security controls, CORS policies, SRI integrity, Article 12 logging, and API boundary validation using Zod schemas. Establishes the security architecture for all 15 backend API routes and the MCP agent server.

18. Lifetime Oy (2026). *ESRS Data Point Registry*, version 1.0. `src/compliance/esrs-registry.ts`. Machine-readable mapping of all 82 European Sustainability Reporting Standards (ESRS) disclosure requirements across E1-E5 (Environment), S1-S4 (Social), and G1 (Governance). Each disclosure is classified as mandatory or voluntary under the CSRD Directive (EU) 2022/2464.

19. Lifetime Oy (2026). *Compliance Scoring Engine*, version 1.0. `src/compliance/scoring-engine.ts`. Deterministic compliance scoring algorithm computing CSRD readiness, ETS exposure, and CBAM risk scores. Formula: overall = CSRD(0.50) + ETS(0.25) + CBAM(0.25), where CSRD = (mandatory data points provided / total mandatory) x 80 + bonus modifiers.

20. Lifetime Oy (2026). *Site Quality Standards*, version 2.1. `SITE_QUALITY_STANDARDS.md`. Code quality, component architecture, and UI resilience patterns for the DWS IQ dashboard. Defines ErrorBoundary, Skeleton loading, and EmptyState component standards for enterprise-grade user experience.

21. Lifetime Oy (2026). *AGENTS.md*, version 2.2. `AGENTS.md`. Agent inventory and operational guidance following the agents.md open specification. Documents 15 AI agents, the compliance scoring engine architecture, middleware stack ordering, and the "Build for Agents" product rule requiring CLI + MCP + Skills interfaces.

22. Lifetime Oy (2026). *DWS IQ Platform Admin Manual*, version 2.7. `Admin/ADMIN_MANUAL.md`. Operational procedures for health check monitoring, compliance scoring engine operations, and dashboard resilience troubleshooting. Includes the Claude Code Project Engineering Structure and Multi-Agent Orchestration sections.

23. Lifetime Oy (2026). *Enterprise Security & Compliance*, version 1.8. `Admin/SECURITY_COMPLIANCE.md`. Security controls for CISOs and procurement teams. Documents agent runtime security, dashboard resilience controls, backend middleware security controls, and compliance engine data protection with RLS policies.

---

## 18. Appendices

### Appendix A: Complete Product Catalog

| ID | Product | Price | Type | Brand |
|----|---------|-------|------|-------|
| DWS-IQ-006 | DWS IQ Platform v6 | €4,999 | Platform | Lifetime |
| DWS-IQ-005 | DWS IQ Platform v5 | €6,995 | Platform | Lifetime |
| FH-AUTO-001 | Firehorse Automation | €4,950 | Software | Firehorse |
| FH-RPT-001 | Firehorse Report | €1,999 | Software | Firehorse |
| FH-CMS-001 | Firehorse CMS | €2,999 | Software | Firehorse |
| FH-OMNI-001 | Firehorse Omnichannel | €499 | Software | Firehorse |
| LIFETIME-BUNDLE-2026 | Climate Bundle | €6,500 | Bundle | Lifetime |
| expert-services | Expert Workshop 3 Days | €4,500 | Service | Lifetime |
| consulting-hourly | Consulting Hourly | €98/hr | Service | Lifetime |
| consulting-fit55 | Fit55 Specialist | €3,000/mo | Service | Lifetime |
| LIFETIME-EXP-001 | Expert Advisory | €3,000/mo | Service | Lifetime |
| aws-consultancy | AI & Cloud Consultancy | €4,500 | Service | Lifetime |
| conversational-agent | Conversational Agent | €3,500 | Software | Lifetime |
| m365-consultancy | M365 Consultancy | €1,120 | Service | Lifetime |
| powerapps-consultancy | Power Platform | €1,120 | Service | Lifetime |
| ai-agent-engineering | AI Agent Engineering | €99/hr | Service | Lifetime |
| lean-project | Firehorse Lean Project | €4,960 | Service | Firehorse |
| ai-consultant-day | AI Consultant Day | €699 | Service | Lifetime |
| business-mentor-30 | Business Mentor 30hrs | €4,960 | Service | Lifetime |
| firehorse-coach | Firehorse Coach | €499 | Service | Firehorse |
| firehorse-flow | Firehorse Flow | €499 | Software | Firehorse |
| omnichannel-multimodal | Omnichannel Multimodal | €699/mo | Software | Firehorse |
| professional-web-pages | Professional Web Pages | €799 | Service | Lifetime |
| secure-email-proton | Protonmail Implementation | €499 | Service | Lifetime |
| firehorse-data-services | Data Services | €899 | Service | Firehorse |
| agentti-sanasto | Agentti Sanasto | €0.99 | Digital | Lifetime |
| devops-lead | Workflow Agent Delivery | €2,500 | Service | Lifetime |
| digital-design-gold | Digital Design Gold | €2,499 | Service | Lifetime |
| cloud-ready-teams | Solution Ready Team | €950 | Service | Lifetime |
| ai-koulutus-3d | AI Koulutus 3 Days | €6,250 | Training | Lifetime |

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

| Setting | Value |
|---------|-------|
| Host | partnerupload.google.com |
| Port | 19321 |
| Username | mc-sftp-8496329 |
| Protocol | SFTP |
| File | google-products.xml |

### Appendix E: Automated PR Workflow (HIL Automation)

The Firehorse operations model includes a fully automated pull request review and merge workflow that replaces manual human-in-the-loop code review. This is a key operational efficiency gain for solo developers and small teams managing enterprise-grade codebases.

**Architecture:**

```
Claude Code → PR → Claude sanity check → Gemini HIL review → @copilot fixes → CI → auto-merge
                                                ↑                    |
                                                └────────────────────┘  (fix loop)
```

**Components:**

| Component | Role | Technology |
|-----------|------|-----------|
| Claude Code | Code generation, branch creation, PR opening | Anthropic Claude Opus/Sonnet |
| AI Code Review | Dual-model review replacing human reviewer | GitHub Actions workflow |
| Claude (reviewer) | Quick sanity check: security, correctness, breaking changes | Claude Sonnet 4 API |
| Gemini (HIL gate) | Deep review: edge cases, tests, architecture, OWASP security | Gemini 2.0 Flash API |
| Copilot coding agent | Implements fix instructions from review comments | GitHub Copilot |
| PR Auto-Merge | Merges when all checks pass and AI approves | GitHub Actions + GraphQL |

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

| Agent | Deity | Role | One-liner |
|-------|-------|------|-----------|
| Atlas | Greek Titan | Chief of Staff | Routes chaos, synthesizes it into executive briefings |
| Athena | Greek Goddess | EU Compliance | Memorized every EU regulation since 2005 |
| Hephaestus | Greek God | Field & Site | Never gets mud on his boots, but checks everything |
| Iris | Greek Goddess | Research & Intel | Reads 10,000 pages so you don't have to |
| Hermes | Greek God | Logistics & Ops | Optimizes your supply chain while you find the warehouse |
| Apollo | Greek God | Content & Outreach | Writes copy, ranks it, sends the follow-up. Already did. |

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
**Skills as Reusable Workflow Components**
Six production skills in `.claude/commands/` transform ad-hoc prompting into callable, documented, testable workflow components:
| Skill | Domain |
|-------|--------|
| `/compliance-check` | EU ETS/CBAM/CSRD regulatory gap analysis |
| `/agent-run` | Execute any DWS IQ agent via structured CLI |
| `/workflow` | Chain multiple agents into unified reports |
| `/discover-agents` | Agent capability discovery |
| `/site-safety` | Construction site safety (EN 13001) |
| `/carbon-analysis` | Embodied carbon lifecycle assessment |
Each skill is an engineered component with a defined interface, documentation, and failure modes. This is the Build for Agents principle in practice.
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

| Extension | Engine | Aiven Status | Verdict |
|-----------|--------|-------------|---------|
| TimescaleDB 2.25.x | PostgreSQL (Hypercore) | **Approved** | ONLY managed option — hypertables + columnar compression |
| pg_duckdb | DuckDB | **BLOCKED** (not whitelisted) | Edge-only — approved for GN100 self-managed nodes |
| Hydra | Citus columnar | **Dead** — joined Supabase (Feb 2026) | Removed from evaluation |
| pg_mooncake | DuckDB | **Dead** — acquired by Databricks (Oct 2025) | Removed from evaluation |

**Recommended stack — two-tier HTAP:**

| Tier | Host | Extensions | Role |
|------|------|-----------|------|
| **Production** | Aiven PostgreSQL (EU) | TimescaleDB 2.25.x Hypercore | OLTP + time-series compression, audit logs, agent metrics |
| **Edge analytics** | Acer Veriton GN100 (ARM64) | TimescaleDB + pg_duckdb + pgvector | Local OLAP, fleet telemetry, AI inference |

Edge PostgreSQL deployed **2026-03-13** on Acer Veriton GN100 (ARM64), self-managed.

**DWS Data Standard** (`DWS_DATA_STANDARD.md`) governing:
- Storage engine decisions (row vs columnar vs hybrid)
- Extension governance with EU sovereignty assessment and Aiven whitelist compliance
- Retention policies mapped to 11 EU regulations (GDPR Art 17, EU AI Act Art 12: 7yr, NIS2: 5yr, Finnish Accounting Act: 10yr)
- Partitioning and compression standards

**Revised rollout:** Phase 0 (table partitioning) → Phase 1 (TimescaleDB Hypercore on Aiven) → Phase 2 (edge pg_duckdb on GN100) → Phase 3 (Aiven↔GN100 replication).

**Research contribution:** Demonstrates that managed-provider extension whitelists are a first-class architectural constraint — not a deployment detail. When the preferred extension (pg_duckdb) is blocked, the architecture must split into tiers rather than compromise on provider choice. The two-tier pattern (managed cloud + self-managed edge) preserves both EU data residency and analytical capability.

---

*Document generated using Firehorse Operations Model with Claude Code*
*Last updated: 13.03.2026*
*Version: 2.3*

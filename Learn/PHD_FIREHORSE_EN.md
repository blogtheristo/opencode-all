# Master Thesis: Firehorse Operations Model for AI-Assisted E-Commerce

**Title:** AI-Native Store Operations: A Case Study of Firehorse Model Implementation with Claude Code
**Author:** Lifetime Oy Research Division
**Date:** January 2026
**Institution:** DWS IQ Research
**Document Type:** Master Thesis Documentation

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

## 14. Results and Discussion

### 12.1 Operational Efficiency Gains

The Firehorse Operations Model with Claude Code achieved:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Product update time | 2 hours | 5 minutes | 96% |
| Feed generation | Manual | Automated | 100% |
| Documentation creation | 1 week | 1 hour | 99% |
| Error rate | 5% | <1% | 80% |
| Store page updates | 4 hours | 15 minutes | 94% |

### 12.2 Google Merchant Center Performance

After implementing Revolut checkout links and fixing feed issues:

| Metric | Result |
|--------|--------|
| Product approval rate | 100% (30/30 products) |
| Feed processing time | <24 hours |
| Checkout conversion | Direct to payment |
| Feed file size | 32,893 bytes |

### 12.3 Compliance Readiness Assessment

| Regulation | Readiness | Gap Analysis |
|------------|-----------|--------------|
| EU AI Act | 80% | Audio chat transparency pending |
| GDPR | 95% | Proton implementation complete |
| Fit for 55 | 90% | Product catalog complete |
| NIS2 | 75% | Security assessment needed |
| CSRD | 85% | Reporting templates ready |

### 12.4 Limitations

1. **Audio chat not yet deployed** - Roadmap documented, Q1 2026 target
2. **Partner ecosystem** - Partnerships in development
3. **Multi-language support** - Currently English/Finnish only
4. **Carbon calculator** - Requires industry data validation

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
13. EU Trade Secrets Directive (EU) 2016/943
14. Finnish Trade Secrets Act (liikesalaisuuslaki 595/2018)
15. Patent Cooperation Treaty (PCT), WIPO
16. Shihipar, T. (2026). "Lessons from Building Claude Code: Prompt Caching Is Everything." Anthropic Engineering Blog

---

## 17. Appendices

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

*Document generated using Firehorse Operations Model with Claude Code*
*Last updated: February 2026*
*Version: 1.1*

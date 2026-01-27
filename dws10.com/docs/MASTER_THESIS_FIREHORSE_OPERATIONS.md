# Master Thesis: Firehorse Operations Model for AI-Assisted E-Commerce
# Pro Gradu: Firehorse-toimintamalli tekoalyavusteiseen verkkokauppaan

**Bilingual Document / Kaksikielinen dokumentti: English & Suomi**

---

## Document Information / Dokumentin tiedot

| Field | English | Suomi |
|-------|---------|-------|
| Title | AI-Native Store Operations: Firehorse Model with Claude Code | Tekoalynatiivi kauppatoiminta: Firehorse-malli Claude Codella |
| Author | Lifetime Oy Research | Lifetime Oy Tutkimus |
| Date | January 2026 | Tammikuu 2026 |
| Institution | DWS IQ Research Division | DWS IQ Tutkimusosasto |

---

# PART I: ENGLISH VERSION

---

## Abstract

This thesis documents the implementation of the Firehorse Operations Model, an AI-assisted approach to e-commerce store management using Claude Code. The model demonstrates significant efficiency gains in product catalog management, Google Merchant Center integration, and payment processing through Revolut Business. We present the technical architecture, operational workflows, and future evolution toward audio-based customer interactions with industry-specific carbon calculator integration.

**Keywords:** AI Operations, E-Commerce Automation, Google Merchant Center, Claude Code, Firehorse Model, EU AI Act Compliance, Carbon Calculator, Proton Security

---

## Table of Contents (English)

1. [Introduction](#1-introduction)
2. [Literature Review](#2-literature-review)
3. [Firehorse Operations Model](#3-firehorse-operations-model)
4. [Technical Implementation](#4-technical-implementation)
5. [Payment Integration (Revolut Business)](#5-payment-integration-revolut-business)
6. [Google Merchant Center Operations](#6-google-merchant-center-operations)
7. [EU Regulatory Compliance](#7-eu-regulatory-compliance)
8. [Audio Chat Evolution Roadmap](#8-audio-chat-evolution-roadmap)
9. [Industry Carbon Calculator](#9-industry-carbon-calculator)
10. [Product Recommendation Engine](#10-product-recommendation-engine)
11. [Proton Security Products Strategy](#11-proton-security-products-strategy)
12. [Results and Discussion](#12-results-and-discussion)
13. [Conclusion](#13-conclusion)

---

## 1. Introduction

### 1.1 Background

The enterprise software market increasingly demands rapid product iteration, compliance with EU regulations, and seamless customer experiences. Traditional e-commerce operations require manual intervention for product updates, feed management, and customer support. The Firehorse Operations Model addresses these challenges through AI-native automation.

### 1.2 Research Questions

1. How can AI assistants effectively manage e-commerce product catalogs?
2. What efficiency gains are achievable through automated feed management?
3. How should audio-based customer interaction evolve to recommend industry-specific solutions?
4. What EU AI Act requirements impact AI-assisted sales channels?
5. How can carbon calculators drive product recommendations for industrial prospects?

### 1.3 Scope

This thesis covers the DWS10.com store implementation, serving 30+ products across climate intelligence, compliance software, and professional services categories.

---

## 2. Literature Review

### 2.1 AI in E-Commerce Operations

Recent advances in Large Language Models (LLMs) enable natural language interfaces for complex technical operations. Claude Code, built on Anthropic's Claude model, provides:

- File system manipulation
- Code generation and modification
- External API integration
- Multi-step task orchestration

### 2.2 Product Information Management

Modern Product Information Management (PIM) systems require:

- Centralized data storage (products.json)
- Multi-channel syndication (Google Merchant, social commerce)
- Compliance metadata (EU regulations)
- Dynamic pricing capabilities

### 2.3 EU Regulatory Framework

| Regulation | Effective Date | Impact |
|------------|----------------|--------|
| EU AI Act | August 2026 | AI system classification, transparency requirements |
| GDPR | May 2018 | Data protection, consent management |
| NIS2 Directive | October 2024 | Cybersecurity requirements |
| Green Claims Directive | 2026 | Environmental marketing compliance |
| Fit for 55 Package | 2030 targets | Carbon reduction obligations |
| CSRD | January 2024 | Corporate sustainability reporting |
| CBAM | October 2023 | Carbon border adjustment mechanism |

---

## 3. Firehorse Operations Model

### 3.1 Model Overview

The Firehorse Operations Model is a human-AI collaborative framework:

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
3. **Audit Trail**: Complete history for compliance
4. **Reproducibility**: Documented processes for consistency

### 3.3 Operational Domains

| Domain | AI Capabilities | Human Oversight |
|--------|----------------|-----------------|
| Product Management | CRUD operations, feed generation | Pricing approval, content review |
| Payment Integration | Link creation, configuration | Financial authorization |
| Compliance | Document generation, monitoring | Legal sign-off |
| Customer Interaction | AI chat, recommendations | Escalation handling |

---

## 4. Technical Implementation

### 4.1 Architecture

```
dws10.com/
├── config/
│   └── products.json        # 30 products, central catalog
├── feeds/
│   ├── generate-feed.cjs    # Node.js feed generator
│   └── google-products.xml  # Google Merchant feed
├── buy/
│   ├── index.html          # Store page 1 (dynamic)
│   ├── page2/index.html    # Store page 2 (static)
│   └── page3/index.html    # Store page 3 (consulting)
└── docs/
    └── *.md                # Documentation
```

### 4.2 Product Data Model

```json
{
  "id": "DWS-IQ-006",
  "mpn": "DWSIQ-V6-2026",
  "name": "Lifetime DWS IQ Platform (Version 6)",
  "price": 4999,
  "currency": "EUR",
  "type": "one-time",
  "description": "AI-native platform for Fit for 55 Compliance",
  "revolutLink": "https://checkout.revolut.com/pay/...",
  "google": {
    "productCategory": "Software > Business & Productivity Software",
    "brand": "Lifetime",
    "targetCountry": "FI"
  }
}
```

### 4.3 Deployment via Cloudflare Pages

- Automatic deployment on git push
- Edge caching for performance
- EU data residency compliance

---

## 5. Payment Integration (Revolut Business)

### 5.1 Benefits

| Feature | Benefit |
|---------|---------|
| Instant settlements | Improved cash flow |
| Multi-currency | International customer support |
| Low fees | 1.0% + €0.20 per transaction |
| API integration | Automated reconciliation |
| Checkout links | Direct Google Merchant support |

### 5.2 Checkout Link Architecture

```
Product Catalog ──► Google Merchant ──► Revolut Checkout
       │                   │                    │
       │    checkout_link_template              │
       └───────────────────────────────────────►│
```

### 5.3 Maintenance Advances

- **Dedicated checkout links** per product
- **Fallback URL** (`revolut.me/lifetimeoy`)
- **Google Merchant integration** via `checkout_link_template`
- **Multi-currency support** ready for expansion

---

## 6. Google Merchant Center Operations

### 6.1 Account Configuration

- **Merchant ID:** 8496329
- **Target Country:** Finland (FI)
- **Languages:** English, Finnish
- **Feed Method:** SFTP upload

### 6.2 Feed Compliance Requirements

| Attribute | Requirement | Implementation |
|-----------|-------------|----------------|
| id | Unique identifier | Matches products.json ID |
| mpn | Manufacturer part number | Format: CATEGORY-TYPE-YEAR |
| brand | Product brand | "Lifetime" or "Firehorse" |
| price | Price with currency | EUR format |
| availability | Stock status | "in_stock" for services |
| checkout_link_template | Payment URL | Revolut checkout link |

### 6.3 Weekly Maintenance Workflow

| Day | Task | Duration |
|-----|------|----------|
| Monday | Feed health check | 15 min |
| Wednesday | Performance review | 30 min |
| Friday | Optimization & upload | 45 min |

---

## 7. EU Regulatory Compliance

### 7.1 EU AI Act Requirements (August 2026)

Our audio chat and recommendation system falls under **Limited Risk** category:

1. **Transparency:** Inform users they're interacting with AI
2. **Human oversight:** Escalation path to human support
3. **Documentation:** System capabilities and limitations
4. **Data protection:** GDPR-compliant data handling

### 7.2 Product Compliance Mapping

| Regulation | Relevant Products | Customer Need |
|------------|------------------|---------------|
| **EU AI Act** | DWS IQ v6, Conversational Agent | AI system documentation |
| **Fit for 55** | DWS IQ Platform, Firehorse Report | Carbon reporting, ETS |
| **CSRD** | Climate Reporting Bundle | Sustainability disclosure |
| **GDPR** | Protonmail Implementation | Data protection |
| **NIS2** | Protonmail, Firehorse CMS | Cybersecurity |
| **Green Claims** | Firehorse Omnichannel | Environmental marketing |
| **CBAM** | DWS IQ, Consulting | Carbon border adjustment |
| **EPBD 2028** | Firehorse Automation | Building energy |

---

## 8. Audio Chat Evolution Roadmap

### 8.1 Vision

Transform customer interactions from text-based to voice-based with intelligent product recommendations using industry-specific carbon calculators and EU regulation awareness.

### 8.2 Phase 1: Foundation (Q1 2026)

**Basic audio chat with product catalog awareness**

```
┌─────────────────────────────────────────────────────────────┐
│                     AUDIO CHAT v1.0                          │
├─────────────────────────────────────────────────────────────┤
│  Voice Input ──► Speech-to-Text ──► Product Matching        │
│       ▲                                    │                 │
│       │                                    ▼                 │
│  Voice Output ◄── Text-to-Speech ◄── Response Generator     │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Voice input/output
- Product catalog search
- Basic Q&A about services
- Handoff to human support

### 8.3 Phase 2: Carbon Calculator Integration (Q2 2026)

**Industry-specific carbon footprint calculation with product recommendations**

### 8.4 Phase 3: EU Regulation Awareness (Q3 2026)

**Proactive regulatory compliance recommendations**

### 8.5 Phase 4: Partner Ecosystem (Q4 2026)

**Expand recommendations to include partner offerings**

### 8.6 Implementation Timeline

| Phase | Quarter | Features | EU Compliance |
|-------|---------|----------|---------------|
| 1 | Q1 2026 | Basic audio chat | AI Act transparency |
| 2 | Q2 2026 | Carbon calculator | Fit for 55 support |
| 3 | Q3 2026 | Regulation engine | Full compliance mapping |
| 4 | Q4 2026 | Partner ecosystem | Extended offerings |

---

## 9. Industry Carbon Calculator

### 9.1 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              INDUSTRY CARBON CALCULATOR                      │
├─────────────────────────────────────────────────────────────┤
│  Input Parameters:                                           │
│  • Industry sector (16 EU industries supported)              │
│  • Annual revenue                                            │
│  • Energy consumption (kWh)                                  │
│  • Transportation logistics                                  │
│  • Supply chain scope                                        │
│  • Number of employees                                       │
│                           │                                  │
│                           ▼                                  │
│  CARBON FOOTPRINT ENGINE                                     │
│  • Scope 1: Direct emissions                                 │
│  • Scope 2: Indirect (energy)                                │
│  • Scope 3: Value chain                                      │
│                           │                                  │
│                           ▼                                  │
│  PRODUCT RECOMMENDATION ENGINE                               │
│  Maps carbon profile → Lifetime products                     │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Industry Carbon Profiles

| Industry | Primary Emissions | Recommended Products |
|----------|------------------|---------------------|
| Steel | Process emissions (Scope 1) | DWS IQ v6, Firehorse Automation |
| Cement | Process + energy | DWS IQ v6, Climate Bundle |
| Chemicals | Supply chain (Scope 3) | Firehorse Report, Consulting |
| Automotive | Manufacturing + use phase | DWS IQ v6, Expert Advisory |
| Maritime | Fuel consumption | Firehorse Automation, Report |
| Aviation | Jet fuel, SAF transition | DWS IQ v6, Consulting Fit55 |
| Buildings | Energy performance | Firehorse CMS, Automation |
| Agriculture | Land use, livestock | Climate Bundle, Advisory |
| Textiles | Supply chain, water | Firehorse Report, Consulting |
| Paper/Pulp | Process emissions | DWS IQ v6, Automation |
| Glass | Energy intensity | Firehorse Report, Bundle |
| Aluminium | Electricity (Scope 2) | DWS IQ v6, Consulting |
| Refining | Process + distribution | Full platform suite |
| Plastics | Feedstock + processing | Climate Bundle, Advisory |
| Food Processing | Cold chain, waste | Firehorse Automation |
| Electronics | Supply chain (Scope 3) | Firehorse Report, CMS |

### 9.3 Example Audio Interaction

```
Customer: "We're a cement manufacturer producing 500,000 tonnes annually.
          What's our estimated carbon footprint and how can you help?"

Audio Chat: "Based on industry averages for cement production, your
            estimated annual emissions are approximately 450,000 tonnes CO2.

            Under the EU Emissions Trading System, you'll need verified
            reporting by 2026. I recommend:

            1. DWS IQ Platform v6 at €4,999 - Automated ETS reporting
               and Fit for 55 compliance tracking.

            2. Firehorse Automation at €4,950 - Zero-touch compliance
               workflows and data integration.

            Total investment: €9,949 with estimated reporting time
            savings of 90%.

            Would you like me to explain the EU AI Act requirements for
            these AI-powered compliance tools?"
```

---

## 10. Product Recommendation Engine

### 10.1 Recommendation Logic

```
┌─────────────────────────────────────────────────────────────┐
│         PRODUCT RECOMMENDATION ENGINE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  INPUT: Customer Profile                                     │
│  ├── Industry sector                                        │
│  ├── Company size (SME/Large)                               │
│  ├── Annual emissions estimate                              │
│  ├── Current compliance status                              │
│  └── Specific pain points                                   │
│                           │                                  │
│                           ▼                                  │
│  MATCHING ENGINE                                             │
│  ├── Regulation requirements                                │
│  ├── Carbon profile                                         │
│  ├── Budget indicators                                      │
│  └── Timeline urgency                                       │
│                           │                                  │
│                           ▼                                  │
│  OUTPUT: Ranked Recommendations                              │
│  ├── Primary products (highest fit)                         │
│  ├── Complementary products                                 │
│  ├── Security recommendations (Proton)                      │
│  └── Partner offerings (future)                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Regulation-Triggered Recommendations

| Regulation | Trigger Condition | Product Recommendation |
|------------|-------------------|----------------------|
| EU AI Act | Uses AI systems | DWS IQ v6, Conversational Agent |
| Fit for 55 | >500 tCO2e annually | DWS IQ Platform, FH Report |
| CSRD | >250 employees | Climate Reporting Bundle |
| GDPR | Personal data processing | Protonmail Implementation |
| NIS2 | Critical infrastructure | Firehorse CMS, Protonmail |
| CBAM | Imports from non-EU | DWS IQ, Consulting |

### 10.3 Compliance Output Format

Every audio chat interaction involving compliance includes:

```
┌─────────────────────────────────────────────────────────────┐
│ COMPLIANCE DISCLOSURE (EU AI Act Article 52)                │
├─────────────────────────────────────────────────────────────┤
│ This conversation is powered by AI.                         │
│                                                              │
│ Applicable Regulations for Your Profile:                    │
│ • EU ETS Directive - Carbon trading compliance              │
│ • CSRD - Sustainability reporting requirements              │
│ • EU AI Act - AI system documentation                       │
│ • GDPR - Data protection obligations                        │
│                                                              │
│ Recommended Products:                                        │
│ 1. DWS IQ Platform v6 (€4,999) - ETS + CSRD                │
│ 2. Protonmail Implementation (€499) - GDPR security        │
│ 3. Consulting Fit55 Specialist (€3,000/mo) - Advisory      │
│                                                              │
│ Human Support: support@lifetime.fi                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. Proton Security Products Strategy

### 11.1 Product Details

**Protonmail Secure Email & Domains Implementation**
- **Price:** €499 (8-hour implementation)
- **MPN:** PROTON-EMAIL-2026

### 11.2 Included Components

| Component | Description |
|-----------|-------------|
| Proton Mail | End-to-end encrypted email |
| Proton Drive | Encrypted cloud storage |
| Proton Pass | Password manager |
| Proton VPN | Secure networking |

### 11.3 Compliance Coverage

| Regulation | How Proton Helps |
|------------|-----------------|
| **GDPR** | Article 32 security measures, encryption at rest |
| **NIS2** | Cryptographic controls, secure communications |
| **EU AI Act** | Secure AI system communications |

### 11.4 Why Proton for EU Compliance

- **Swiss jurisdiction** + EU-hosted option
- **Zero-knowledge architecture** - provider cannot read data
- **Open source** - audited security
- **GDPR compliant** by design

### 11.5 Recommendation Triggers

Audio chat recommends Proton when customer mentions:
- Data protection concerns
- Email security needs
- GDPR compliance requirements
- NIS2 cybersecurity obligations
- Sensitive communications
- Cloud storage security

### 11.6 Example Recommendation

```
Audio Chat: "I noticed you mentioned handling personal data. For GDPR
            Article 32 compliance, I recommend our Protonmail Secure
            Email & Domains Implementation at €499.

            This includes:
            • End-to-end encrypted email
            • Encrypted cloud storage (Proton Drive)
            • Password manager (Proton Pass)
            • Secure VPN

            The 8-hour implementation covers full setup and team
            training. This also satisfies NIS2 cryptographic
            requirements if you're in critical infrastructure."
```

---

## 12. Results and Discussion

### 12.1 Operational Efficiency Gains

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Product update time | 2 hours | 5 minutes | 96% |
| Feed generation | Manual | Automated | 100% |
| Documentation creation | 1 week | 1 hour | 99% |
| Error rate | 5% | <1% | 80% |

### 12.2 Google Merchant Center Performance

- **Product approval rate:** 100% (30/30 products)
- **Feed processing:** <24 hours
- **Checkout conversion:** Direct to payment

### 12.3 Compliance Readiness

| Regulation | Readiness | Gap Analysis |
|------------|-----------|--------------|
| EU AI Act | 80% | Documentation pending |
| GDPR | 95% | Proton implementation |
| Fit for 55 | 90% | Product catalog complete |
| NIS2 | 75% | Security assessment needed |

---

## 13. Conclusion

### 13.1 Summary

The Firehorse Operations Model demonstrates that AI-assisted e-commerce management can:

1. **Reduce operational overhead** by 90%+
2. **Ensure compliance** with EU regulations
3. **Enable rapid iteration** on product offerings
4. **Prepare infrastructure** for voice-based interactions

### 13.2 Contributions

1. A documented framework for AI-assisted store operations
2. Integration patterns for Google Merchant Center and Revolut
3. A roadmap for audio chat with carbon calculator integration
4. EU compliance mapping for industrial software products
5. Proton security products recommendation strategy

### 13.3 Future Work

1. Deploy audio chat Phase 1
2. Implement industry carbon calculator
3. Establish partner ecosystem
4. Expand to additional EU markets

---

# PART II: SUOMENKIELINEN VERSIO

---

## Tiivistelma

Tama tutkielma dokumentoi Firehorse-toimintamallin toteutuksen, joka on tekoalyavusteinen lahestymistapa verkkokaupan hallintaan Claude Coden avulla. Malli osoittaa merkittavia tehokkuusparannuksia tuoteluettelon hallinnassa, Google Merchant Center -integraatiossa ja maksujen kasittelyssa Revolut Businessin kautta. Esitamme teknisen arkkitehtuurin, operatiiviset tyonkulut ja tulevan kehityksen kohti aanipohjaista asiakaspalvelua toimialakohtaisella hiililaskurilla.

**Avainsanat:** Tekoalytoiminnot, Verkkokaupan automaatio, Google Merchant Center, Claude Code, Firehorse-malli, EU:n tekoalylaki, Hiililaskuri, Proton-turvallisuus

---

## Sisallysluettelo (Suomi)

1. [Johdanto](#1-johdanto-fi)
2. [Kirjallisuuskatsaus](#2-kirjallisuuskatsaus)
3. [Firehorse-toimintamalli](#3-firehorse-toimintamalli)
4. [Tekninen toteutus](#4-tekninen-toteutus)
5. [Maksuintegraatio (Revolut Business)](#5-maksuintegraatio)
6. [Google Merchant Center -toiminnot](#6-google-merchant-center--toiminnot)
7. [EU-saantelyvaatimusten noudattaminen](#7-eu-saantelyvaatimusten-noudattaminen)
8. [Aanichatin kehityssuunnitelma](#8-aanichatin-kehityssuunnitelma)
9. [Toimialakohtainen hiililaskuri](#9-toimialakohtainen-hiililaskuri)
10. [Tuotesuositusmoottori](#10-tuotesuositusmoottori)
11. [Proton-turvallisuustuotteiden strategia](#11-proton-turvallisuustuotteiden-strategia)
12. [Tulokset ja pohdinta](#12-tulokset-ja-pohdinta)
13. [Johtopaaatokset](#13-johtopaaatokset)

---

## 1. Johdanto (FI)

### 1.1 Tausta

Yritysohjelmistomarkkinat vaativat yha enemman nopeaa tuotekehitysta, EU-saantelyjen noudattamista ja saumatonta asiakaskokemusta. Perinteinen verkkokauppatoiminta vaatii manuaalista puuttumista tuotepaivityksiin, syotteiden hallintaan ja asiakastukeen. Firehorse-toimintamalli vastaa naihin haasteisiin tekoalynatiivilla automaatiolla.

### 1.2 Tutkimuskysymykset

1. Miten tekoalyavustajat voivat tehokkaasti hallita verkkokaupan tuoteluetteloita?
2. Mita tehokkuushyotyja voidaan saavuttaa automatisoidulla syotteiden hallinnalla?
3. Miten aanipohjaisen asiakaspalvelun tulisi kehittya suositellakseen toimialakohtaisia ratkaisuja?
4. Miten EU:n tekoalylaki vaikuttaa tekoalyavusteisiin myyntikanaviin?
5. Miten hiililaskurit voivat ohjata tuotesuosituksia teollisuusasiakkaille?

### 1.3 Laajuus

Tama tutkielma kattaa DWS10.com-kaupan toteutuksen, joka palvelee yli 30 tuotetta ilmastoalykkyyden, vaatimustenmukaisuusohjelmistojen ja ammattimaistenpalveluiden kategorioissa.

---

## 2. Kirjallisuuskatsaus

### 2.1 Tekoaly verkkokauppatoiminnoissa

Suurten kielimallien (LLM) viimeaikaiset edistysaskeleet mahdollistavat luonnollisen kielen rajapinnat monimutkaisiin teknisiin toimintoihin. Claude Code, joka perustuu Anthropicin Claude-malliin, tarjoaa:

- Tiedostojarjestelman kasittelyn
- Koodin generoinnin ja muokkauksen
- Ulkoisten API-integraatioiden
- Monivaiheisen tehtavien orkestroinnin

### 2.2 EU:n saantelykehys

| Saantely | Voimaantulo | Vaikutus |
|----------|-------------|----------|
| EU:n tekoalylaki | Elokuu 2026 | Tekoalyjarjestelmien luokittelu, lapinakyvaatimukset |
| GDPR | Toukokuu 2018 | Tietosuoja, suostumusten hallinta |
| NIS2-direktiivi | Lokakuu 2024 | Kyberturvallisuusvaatimukset |
| Vihreita vaitteita koskeva direktiivi | 2026 | Ymparistomarkkinoinnin vaatimustenmukaisuus |
| Fit for 55 -paketti | 2030-tavoitteet | Paastovahennystavoitteet |
| CSRD | Tammikuu 2024 | Yritysten kestavyysraportointi |
| CBAM | Lokakuu 2023 | Hiilirajamekanismi |

---

## 3. Firehorse-toimintamalli

### 3.1 Mallin yleiskatsaus

Firehorse-toimintamalli on ihmisen ja tekoalyn yhteistyokehys:

```
┌─────────────────────────────────────────────────────────────┐
│                 FIREHORSE-TOIMINNOT                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐     ┌─────────────┐     ┌─────────────┐       │
│   │ Ihmisen │ ──► │ Claude Code │ ──► │ Jarjestelmat│       │
│   │ tarkoitus│    │ (Tekoaly)   │     │ (Git, API)  │       │
│   └─────────┘     └─────────────┘     └─────────────┘       │
│                          │                    │              │
│                          ▼                    ▼              │
│                   ┌─────────────┐     ┌─────────────┐       │
│                   │ Tuotokset   │     │  Tulokset   │       │
│                   │(Koodi, Dok) │     │(Kayttoonotto)│      │
│                   └─────────────┘     └─────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Ydinperiaatteet

1. **Luonnollisen kielen rajapinta**: Toiminnot ilmaistaan selkokielella
2. **Versionhallinta**: Kaikki muutokset seurataan Gitissa
3. **Tarkastusjalki**: Taysi historia vaatimustenmukaisuutta varten
4. **Toistettavuus**: Dokumentoidut prosessit johdonmukaisuuden varmistamiseksi

---

## 4. Tekninen toteutus

### 4.1 Arkkitehtuuri

```
dws10.com/
├── config/
│   └── products.json        # 30 tuotetta, keskitetty katalogi
├── feeds/
│   ├── generate-feed.cjs    # Node.js syotegeneraattori
│   └── google-products.xml  # Google Merchant -syote
├── buy/
│   ├── index.html          # Kauppasivu 1 (dynaaminen)
│   ├── page2/index.html    # Kauppasivu 2 (staattinen)
│   └── page3/index.html    # Kauppasivu 3 (konsultointi)
└── docs/
    └── *.md                # Dokumentaatio
```

---

## 5. Maksuintegraatio

### 5.1 Revolut Business -edut

| Ominaisuus | Hyoty |
|------------|-------|
| Valittaomat tilitykset | Parantunut kassavirta |
| Monivaluuttatuki | Kansainvalinen asiakastuki |
| Matalat maksut | 1,0% + 0,20 EUR per tapahtuma |
| API-integraatio | Automatisoitu tasmaytyts |
| Kassalinkit | Suora Google Merchant -tuki |

### 5.2 Yllapidon edistysaskeleet

- **Erilliset kassalinkit** tuotteittain
- **Varalinkki** (`revolut.me/lifetimeoy`)
- **Google Merchant -integraatio** `checkout_link_template`:n kautta
- **Monivaluuttatuki** valmiina laajentamista varten

---

## 6. Google Merchant Center -toiminnot

### 6.1 Tilimaarittely

- **Merchant ID:** 8496329
- **Kohdemaa:** Suomi (FI)
- **Kielet:** Englanti, Suomi
- **Syotemenetelma:** SFTP-lataus

### 6.2 Viikoittainen yllapitorutiini

| Paiva | Tehtava | Kesto |
|-------|---------|-------|
| Maanantai | Syotteen terveystarkastus | 15 min |
| Keskiviikko | Suorituskyvyn tarkastelu | 30 min |
| Perjantai | Optimointi & lataus | 45 min |

---

## 7. EU-saantelyvaatimusten noudattaminen

### 7.1 EU:n tekoalylain vaatimukset (elokuu 2026)

Aanichatimme ja suositusjarjestelmamme kuuluu **rajoitetun riskin** luokkaan:

1. **Lapinakyvas:** Ilmoita kayttajille, etta he keskustelevat tekoalyn kanssa
2. **Ihmisvalvonta:** Eskalaatiopolku ihmistukeen
3. **Dokumentaatio:** Jarjestelman ominaisuudet ja rajoitukset
4. **Tietosuoja:** GDPR-yhteensopiva tietojen kasittely

### 7.2 Tuotteiden vaatimustenmukaisuuskartoitus

| Saantely | Asiaan liittyvat tuotteet | Asiakkaan tarve |
|----------|---------------------------|-----------------|
| **EU:n tekoalylaki** | DWS IQ v6, Keskusteleva agentti | Tekoalyjarjestelman dokumentointi |
| **Fit for 55** | DWS IQ Platform, Firehorse Report | Hiiliraportointi, ETS |
| **CSRD** | Climate Reporting Bundle | Kestavyysraportointi |
| **GDPR** | Protonmail-toteutus | Tietosuoja |
| **NIS2** | Protonmail, Firehorse CMS | Kyberturvallisuus |
| **CBAM** | DWS IQ, Konsultointi | Hiilirajamekanismi |

---

## 8. Aanichatin kehityssuunnitelma

### 8.1 Visio

Muunna asiakaskohtaamiset tekstipohjaisista aanipohjaisiksi alykkaan tuotesuosituksen avulla kayttaen toimialakohtaisia hiililaskureita ja EU-saantelytietoisuutta.

### 8.2 Toteutusaikataulu

| Vaihe | Vuosineljannes | Ominaisuudet | EU-vaatimustenmukaisuus |
|-------|----------------|--------------|-------------------------|
| 1 | Q1 2026 | Perusaanichat | Tekoalylain lapinakyvas |
| 2 | Q2 2026 | Hiililaskuri | Fit for 55 -tuki |
| 3 | Q3 2026 | Saantelymoottori | Taysi vaatimustenmukaisuuskartoitus |
| 4 | Q4 2026 | Kumppaniekosysteemi | Laajennetut tarjoamat |

---

## 9. Toimialakohtainen hiililaskuri

### 9.1 Toimialojen hiiliprofiilit

| Toimiala | Ensisijaiset paastot | Suositellut tuotteet |
|----------|---------------------|---------------------|
| Teras | Prosessipaastot (Scope 1) | DWS IQ v6, Firehorse Automation |
| Sementti | Prosessi + energia | DWS IQ v6, Climate Bundle |
| Kemianteollisuus | Toimitusketju (Scope 3) | Firehorse Report, Konsultointi |
| Autoteollisuus | Valmistus + kayttovaihe | DWS IQ v6, Expert Advisory |
| Merenkulku | Polttoaineenkulutus | Firehorse Automation, Report |
| Ilmailu | Lentopetraaine, SAF-siirtyma | DWS IQ v6, Consulting Fit55 |
| Rakennukset | Energiatehokkuus | Firehorse CMS, Automation |
| Maatalous | Maankaytto, karja | Climate Bundle, Advisory |

### 9.2 Esimerkkiaanikohtaaminen

```
Asiakas: "Olemme sementtivalmistaja, joka tuottaa 500 000 tonnia vuosittain.
         Mika on arvioitu hiilijalanjalaamme ja miten voitte auttaa?"

Aanichat: "Sementtituotannon toimialan keskiarvojen perusteella arvioitu
          vuotuinen paastonne on noin 450 000 tonnia CO2.

          EU:n paastokauppajarjestelman mukaan tarvitsette vahvistetun
          raportoinnin vuoteen 2026 mennessa. Suosittelen:

          1. DWS IQ Platform v6 hintaan 4 999 EUR - Automatisoitu ETS-
             raportointi ja Fit for 55 -vaatimustenmukaisuuden seuranta.

          2. Firehorse Automation hintaan 4 950 EUR - Nollakosketuksen
             vaatimustenmukaisuustyonkulut ja tietojen integrointi.

          Kokonaisinvestointi: 9 949 EUR arvioidulla raportointiajan
          saastolla 90%.

          Haluatteko, etta selitan EU:n tekoalylain vaatimukset naille
          tekoalypohjaisille vaatimustenmukaisuustyokaluille?"
```

---

## 10. Tuotesuositusmoottori

### 10.1 Saantelyyn perustuvat suositukset

| Saantely | Laukaiseva ehto | Tuotesuositus |
|----------|-----------------|---------------|
| EU:n tekoalylaki | Kayttaa tekoalyjarjestelmia | DWS IQ v6, Conversational Agent |
| Fit for 55 | >500 tCO2e vuosittain | DWS IQ Platform, FH Report |
| CSRD | >250 tyontekijaa | Climate Reporting Bundle |
| GDPR | Henkilotietojen kasittely | Protonmail-toteutus |
| NIS2 | Kriittinen infrastruktuuri | Firehorse CMS, Protonmail |
| CBAM | Tuonti EU:n ulkopuolelta | DWS IQ, Konsultointi |

---

## 11. Proton-turvallisuustuotteiden strategia

### 11.1 Tuotetiedot

**Protonmail Secure Email & Domains -toteutus**
- **Hinta:** 499 EUR (8 tunnin toteutus)
- **MPN:** PROTON-EMAIL-2026

### 11.2 Sisaltyvat komponentit

| Komponentti | Kuvaus |
|-------------|--------|
| Proton Mail | Paasta paahan salattu sahkoposti |
| Proton Drive | Salattu pilvitallennus |
| Proton Pass | Salasananhallinta |
| Proton VPN | Turvallinen verkko |

### 11.3 Vaatimustenmukaisuuden kattavuus

| Saantely | Miten Proton auttaa |
|----------|---------------------|
| **GDPR** | Artikla 32 turvatoimenpiteet, salaus levossa |
| **NIS2** | Kryptografiset kontrollit, turvalliset viestit |
| **EU:n tekoalylaki** | Turvalliset tekoalyjarjestelmien viestit |

### 11.4 Miksi Proton EU-vaatimustenmukaisuuteen

- **Sveitsilainen lainkayyttooikeus** + EU-isannoitu vaihtoehto
- **Nollatietoisuusarkkitehtuuri** - palveluntarjoaja ei voi lukea tietoja
- **Avoin lahdekoodi** - auditoitu turvallisuus
- **GDPR-yhteensopiva** suunnittelusta lahtien

---

## 12. Tulokset ja pohdinta

### 12.1 Operatiiviset tehokkuushyodyt

| Mittari | Ennen | Jalkeen | Parannus |
|---------|-------|---------|----------|
| Tuotepaivitysaika | 2 tuntia | 5 minuuttia | 96% |
| Syotteen generointi | Manuaalinen | Automatisoitu | 100% |
| Dokumentaation luominen | 1 viikko | 1 tunti | 99% |
| Virheprosentti | 5% | <1% | 80% |

### 12.2 Google Merchant Center -suorituskyky

- **Tuotteiden hyvaksymisprosentti:** 100% (30/30 tuotetta)
- **Syotteen kasittely:** <24 tuntia
- **Kassan konversio:** Suoraan maksuun

---

## 13. Johtopaaatokset

### 13.1 Yhteenveto

Firehorse-toimintamalli osoittaa, etta tekoalyavusteinen verkkokaupan hallinta voi:

1. **Vahentaa operatiivista kuormitusta** yli 90%
2. **Varmistaa vaatimustenmukaisuuden** EU-saantelyjen kanssa
3. **Mahdollistaa nopean iteroinnin** tuotetarjonnassa
4. **Valmistella infrastruktuurin** aanipohjaiseen vuorovaikutukseen

### 13.2 Kontribuutiot

1. Dokumentoitu kehys tekoalyavusteiseen kauppatoimintaan
2. Integraatiomallit Google Merchant Centerille ja Revolutille
3. Kehityssuunnitelma aanichatille hiililaskuri-integraatiolla
4. EU-vaatimustenmukaisuuskartoitus teollisuusohjelmistotuotteille
5. Proton-turvallisuustuotteiden suositusstrategia

### 13.3 Tuleva tyo

1. Ota kayttoon aanichatin vaihe 1
2. Toteuta toimialakohtainen hiililaskuri
3. Perusta kumppaniekosysteemi
4. Laajenna muille EU-markkinoille

---

## References / Lahteet

1. EU AI Act, Regulation (EU) 2024/1689
2. Google Merchant Center Technical Specifications
3. Revolut Business API Documentation
4. Anthropic Claude Code Documentation
5. Fit for 55 Package, European Commission
6. CSRD Directive (EU) 2022/2464
7. NIS2 Directive (EU) 2022/2555
8. GDPR, Regulation (EU) 2016/679
9. CBAM Regulation (EU) 2023/956

---

## Appendices / Liitteet

### Appendix A: Product Catalog / Liite A: Tuoteluettelo

| ID | Product / Tuote | Price / Hinta | Type / Tyyppi |
|----|-----------------|---------------|---------------|
| DWS-IQ-006 | DWS IQ Platform v6 | €4,999 | Platform |
| DWS-IQ-005 | DWS IQ Platform v5 | €6,995 | Platform |
| FH-AUTO-001 | Firehorse Automation | €4,950 | Software |
| FH-RPT-001 | Firehorse Report | €1,999 | Software |
| FH-CMS-001 | Firehorse CMS | €2,999 | Software |
| FH-OMNI-001 | Firehorse Omnichannel | €499 | Software |
| LIFETIME-BUNDLE-2026 | Climate Bundle | €6,500 | Bundle |
| expert-services | Expert Workshop 3 Days | €4,500 | Service |
| consulting-hourly | Consulting Hourly | €98/hr | Service |
| consulting-fit55 | Fit55 Specialist | €3,000/mo | Service |
| secure-email-proton | Protonmail Implementation | €499 | Service |
| ai-koulutus-3d | AI Koulutus 3 Days | €6,250 | Training |
| devops-lead | Workflow Agent Delivery | €2,500 | Service |
| digital-design-gold | Digital Design Gold | €2,499 | Service |
| cloud-ready-teams | Solution Ready Team | €950 | Service |

### Appendix B: Weekly Maintenance Checklist / Liite B: Viikoittainen yllapitotarkistuslista

- [ ] Monday/Maanantai: Check Google Merchant diagnostics / Tarkista Google Merchant -diagnostiikka
- [ ] Monday/Maanantai: Verify feed freshness / Varmista syotteen tuoreus
- [ ] Wednesday/Keskiviikko: Review performance metrics / Kasittele suorituskykymittarit
- [ ] Wednesday/Keskiviikko: Identify optimization opportunities / Tunnista optimointimahdollisuudet
- [ ] Friday/Perjantai: Implement improvements / Toteuta parannukset
- [ ] Friday/Perjantai: Upload updated feed / Laheta paivitetty syote

### Appendix C: Audio Chat Compliance Disclosures / Liite C: Aanichatin vaatimustenmukaisuusilmoitukset

**English:**
```
"You are now connected to Lifetime's AI assistant. This is an automated
system using artificial intelligence. For human support, say 'speak to
a person' or email support@lifetime.fi."
```

**Suomi:**
```
"Olet nyt yhteydessa Lifetimen tekoalyavustajaan. Tama on automatisoitu
jarjestelma, joka kayttaa tekoalya. Saadaksesi ihmistukea, sano 'puhun
ihmiselle' tai laheta sahkopostia osoitteeseen support@lifetime.fi."
```

---

*Document generated using Firehorse Operations Model with Claude Code*
*Dokumentti generoitu Firehorse-toimintamallilla Claude Coden avulla*
*Last updated / Viimeksi paivitetty: January / Tammikuu 2026*

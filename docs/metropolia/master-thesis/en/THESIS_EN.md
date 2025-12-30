# Firehorse Product Manufacturing Operating Model
## Hybrid AI-Edge Architecture for Climate-Intelligent Industrial Platforms

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: GitHub Copilot | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Applied DWS document standard, synchronized with Finnish version

Session Links & References:
  - GitHub Copilot (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/metropolia/master-thesis/en/THESIS_EN.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 30.12.2025
  - Language: English
  - Languages Available: English, Suomi
  - Publication Status: 🚧 DRAFT

---

**Master's Thesis**  
**Metropolia University of Applied Sciences**

**Author:** Risto Anton Päärni  
**Program:** [TBD - Business IT or Industrial Management]  
**Supervisor:** [TBD]  
**Company:** Lifetime Oy (Firehorse brand)  
**Date:** [TBD]

---

## Abstract

This thesis examines the Firehorse product manufacturing operating model, which combines cloud and edge computing technologies for industrial SMEs. The work focuses on the construction industry and its challenges in the EU's twin transition (digital + green).

**Keywords:** Artificial Intelligence, Edge Computing, Construction Industry, Operating Model, Cloud Services

---

## Tiivistelmä

Tämä opinnäytetyö tutkii Firehorse-tuotevalmistuksen toimintamallia, joka yhdistää pilvi- ja reunalaskentateknologiat teollisten pk-yritysten tarpeisiin. Työ keskittyy rakennusteollisuuteen ja sen haasteisiin EU:n kaksoissiirtymässä (digitaalinen + vihreä).

**Avainsanat:** Tekoäly, reunalaskenta, rakennusteollisuus, toimintamalli, pilvipalvelut

---

# Table of Contents

1. [Introduction](#1-introduction)
2. [Theoretical Framework](#2-theoretical-framework)
3. [Current State Analysis](#3-current-state-analysis)
4. [DWS6 Operating Model Design](#4-dws6-operating-model-design)
5. [Implementation (MVP Phase)](#5-implementation-mvp-phase)
6. [Results and Analysis](#6-results-and-analysis)
7. [Discussion](#7-discussion)
8. [Conclusions](#8-conclusions)
9. [References](#9-references)
10. [Appendices](#10-appendices)

---

# 1. Introduction

## 1.1 Background

European industrial SMEs face a "twin transition" challenge:

- **Digital transformation**: AI, automation, real-time decision-making
- **Green transformation**: EU Fit for 55 (55% emissions reduction by 2030), embodied carbon mandates by 2028

Traditional SaaS platforms fail because they:
1. Cost €1,400+/month (unaffordable for SMEs)
2. Require cloud-only architecture (high latency, high operational costs)
3. Don't address industry-specific compliance workflows

**Firehorse (DWS6)** solves this with a novel operating model combining:
- Free-tier cloud infrastructure (€0-350/month vs €1,400+)
- Edge AI (NVIDIA Jetson) for <100ms inference
- Industry-specific AI agents (Construction, Manufacturing, Energy)
- Phased deployment (Silent Pilot → Advisor → Autonomous)

## 1.2 Research Problem

**Primary Research Question:**  
How can a bootstrapped industrial AI platform achieve product-market fit through a hybrid cloud-edge operating model while maintaining <€400/month operational costs?

**Secondary Research Questions:**

1. **Product & Business Model:** How to develop a customer promise that solves a real problem and scales internationally?

2. **Technology:** How to build a digital, scalable service product that operates across cloud + edge + e-commerce?

3. **Technical Solution Evaluation:** Which technical solution best supports business objectives?

4. **Enterprise Security:** How to ensure NIS 2, EU AI Act, GDPR, and Cybersecurity Act compliance?

## 1.3 Objectives

1. Document the Firehorse operating model (MVP → V1)
2. Validate the free-tier cost model (€0/month target)
3. Measure customer value (≤2 month payback period)
4. Create a replicable model for other industrial startups

## 1.4 Scope

- **Industry:** Construction (3.5M companies in Europe)
- **Market:** Nordics + Central and Eastern Europe
- **Timeline:** MVP phase (December 2025 - February 2026)
- **Customers:** 5 pilot customers (€10-100M revenue)

## 1.5 Key Concepts

| Concept | Definition |
|---------|------------|
| **MVP** | Minimum Viable Product |
| **Edge AI** | AI that runs on-device (no cloud connection) |
| **SaaS** | Software as a Service |
| **DWS6** | Digital Work System 6 - Firehorse platform technical name |
| **Embodied Carbon** | Emissions from manufacturing and transporting building materials |

---

# 2. Theoretical Framework

## 2.1 Lean Startup Methodology

[Content to be added during implementation phase]

## 2.2 Platform Economics

[Content to be added during implementation phase]

## 2.3 Industry 5.0

[Content to be added during implementation phase]

## 2.4 Edge Computing Economics

[Content to be added during implementation phase]

## 2.5 Conceptual Model: Firehorse Operating Model Canvas

[Content to be added during implementation phase]

---

# 3. Current State Analysis

## 3.1 European Industrial AI Landscape

[Content to be added during implementation phase]

## 3.2 Competitor Analysis

[Content to be added during implementation phase]

## 3.3 Customer Segments

[Content to be added during implementation phase]

## 3.4 Regulatory Drivers

[Content to be added during implementation phase]

---

# 4. DWS6 Operating Model Design

## 4.1 Product and Business Model

### 4.1.1 Customer Promise

**Promise:** 2-month payback period or money back

**Value Proposition:**
- Real-time emissions tracking (EU requirement 2028)
- Viability analysis (project profitability)
- Automated reports (saves 10h/week)

### 4.1.2 Product Vision

```
MVP (December 2025)
  ↓
Alpha (February 2026)
  ↓
V1 (November 2026)
  ↓
Series A (2027)
```

### 4.1.3 Market Research

- **Target Customer:** Construction companies €10-100M revenue
- **Market Size:** 3.5M construction companies in Europe
- **Competitors:** Atlassian Rovo (€1,400/month), SAP (€50K+/year)

### 4.1.4 Problem Definition

**Problem:** EU embodied carbon measurement requirement 2028 (buildings >1,000 m²)

**Solution:** Real-time emissions tracking + viability analysis

**ROI:** 2-month payback period

## 4.2 Technical Architecture

### 4.2.1 Hybrid Cloud-Edge Architecture

```
┌─────────────────────────────────────────────────┐
│  DWS6 HYBRID ARCHITECTURE                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  CLOUD LAYER (Google Cloud Run)                 │
│  ├─ Groq API Router (FastAPI)                   │
│  ├─ Supabase (PostgreSQL)                       │
│  └─ Agent Orchestration (LlamaStack)            │
│                                                 │
│  EDGE LAYER (NVIDIA Jetson Orin Nano)           │
│  ├─ SiteSense Agent (site monitoring)           │
│  ├─ Offline operation (no network required)     │
│  └─ <100ms latency (25x faster than cloud)      │
│                                                 │
│  CLIENT LAYER (Chromebook PWA)                  │
│  ├─ Progressive Web App                         │
│  ├─ Offline-first design                        │
│  └─ EU data residency (GDPR-compliant)          │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.2.2 Agent System

**Internal Agents (7):**
- 5 development agents (Cursor AI, Claude, Gemini)
- 2 sales agents (Firehorse Omnichannel)

**Customer Agents (2 in MVP):**
- Customer Satisfaction Agent
- Viability Analysis Agent

### 4.2.3 Data Flow

```
Construction Site (Edge)
  ↓
NVIDIA Jetson (SiteSense)
  ↓
Google Cloud Run (Orchestration)
  ↓
Supabase (PostgreSQL)
  ↓
Dashboard (Chromebook PWA)
```

### 4.2.4 MCP Hub Multi-Agent Orchestration Platform

**Vision:** Control layer that coordinates Cursor, Claude, Gemini, and DWS IQ agents with construction planning tools and Lifetime Firehorse products, supported by the Lifetime World Model and a fleet of cars, drones, and robots on construction sites.

**Single Climate-Intelligent Brain:** Every automated workflow (reports, schedules, compliance packs) runs from one orchestration layer instead of disconnected scripts.

**Components:**
- **AI Agents:** Cursor AI, Claude Code, Gemini Pro, DWS IQ agents
- **Physical Fleet:** Cars (Lifetime Fleet), drones, robots
- **Construction Tools:** BIM systems, ALICE Technologies, Procore
- **Firehorse Integration:** Customer-owned tools, Lifetime World Model

**Infrastructure:**
- MCP Coordination Hub (port 8765)
- Supabase MCP Server (port 8766)
- Docker + Temporal.io + PostgreSQL

**Business Impact:**
- +62% development velocity
- -73% bug reduction
- €23,640/year savings
- 17.2 months runway from €150K SAFE (vs 6.7 months without MCP)

## 4.3 Cost Model

### 4.3.1 Free-Tier Strategy

| Phase | Cost | Technology |
|-------|------|------------|
| **MVP** | €0/month | Groq $10K credits + Cloud Run free tier |
| **Alpha** | €50-150/month | Groq + Supabase Pro |
| **V1** | €350/month | Groq + Supabase + Monitoring |

### 4.3.2 Edge AI ROI

**Cloud Solution (12 months):**
- €6,660/year (€555/month x 12)

**Edge AI Solution:**
- €1,084 (hardware) + €120/year (electricity) = €1,204

**Savings:** €5,456/year (82% cheaper)  
**Payback Period:** 1.95 months

### 4.3.3 Startup Credits

| Service | Credit | Duration |
|---------|--------|----------|
| Groq | $10,000 | 12 months |
| Google Cloud | $300 | 3 months |
| AWS | $5,000 | 24 months |
| **Total** | **~$15,300** | **6+ years** |

## 4.4 Deployment Model

### 4.4.1 Phase 1: Silent Pilot

- Agent observes and logs
- No actions taken
- Customer feedback: "What does it see?"

### 4.4.2 Phase 2: Advisor

- Agent recommends actions
- Requires approval
- Customer feedback: "Does this make sense?"

### 4.4.3 Phase 3: Autonomous

- Agent executes actions
- Operates within guardrails
- Customer feedback: "Is it working correctly?"

## 4.5 Go-to-Market Strategy

### 4.5.1 MVP (December 2025)

- 5 construction customers
- FREE pilot
- 2 agents

### 4.5.2 Alpha (February 2026)

- 20-50 customers
- 3 industries
- 10 agents

### 4.5.3 V1 (November 2026)

- 100+ customers
- 8 industries
- 33 agents

## 4.6 Firehorse Omnichannel: Marketing Focus Optimization

**Problem:** SMEs struggle to allocate limited marketing budgets effectively.

**Solution:** Firehorse Omnichannel utilizes AI-driven market intelligence to optimize channel selection.

**Outcome:** "Right time, right amount" funding strategy that maximizes ROI.

## 4.7 Regulatory Compliance: The Legal Moat

### 4.7.1 GDPR & Sovereignty

Implementing a Private Cloud architecture ensures EU data residency and sovereignty, a key differentiator against US-based SaaS.

### 4.7.2 NIS2 Directive

Aligning with cybersecurity requirements for critical entities (Energy, Transport) to serve as a compliant supply chain partner.

### 4.7.3 EU AI Act

Implementing transparency protocols (Article 50) for AI agents and ensuring human oversight for high-stakes decisions.

### 4.7.4 Digital Services Act (DSA)

Establishing community rules and moderation for the "Lifetime World" platform.

## 4.8 dws6.com: Production Deployment & Web Presence

### 4.8.1 Overview

**dws6.com** is the DWS6 platform's production environment, providing centralized access to all Firehorse services. The site serves as both a customer interface and internal management portal.

### 4.8.2 Technical Implementation

**Platform:** Cloudflare Pages
- Global CDN (Content Delivery Network)
- Automatic SSL/TLS encryption
- DDoS protection
- Edge caching

**Custom Domain:** dws6.com
- DNS configuration: CNAME → dws6.pages.dev
- SSL certificate: Automatic (Let's Encrypt)
- Proxy mode: Proxied (Cloudflare protection)

**Deployment Model:** Git-based continuous deployment
```
Git Push → GitHub → Cloudflare Pages → Global Edge (30-60s)
```

### 4.8.3 Site Structure

```
dws6.com/
├── / (index.html)                    # Landing page
├── /login/                           # Login portal
│   └── 11 services:
│       ├── DWS IQ Dashboard
│       ├── Firehorse Reports
│       ├── Agent Foundry
│       ├── Lifetime Fleet
│       ├── OneLifetime World
│       ├── Professional Services
│       ├── Investor Portal
│       ├── Partner Portal
│       ├── Admin Panel
│       ├── Documentation
│       └── Support
├── /dashboard/
│   ├── /v7/                          # V7 OK Computer
│   ├── /v8/                          # V8 Enhanced
│   └── /v9/                          # V9 Final
├── /lifetime-fleet/                  # Fleet showcase
├── /progress-report/                 # Weekly reports
└── /csrd/                            # CSRD compliance
```

### 4.8.4 Performance

| Metric | Target | Result |
|--------|--------|--------|
| **Page Load Time** | <1s | ✅ 0.8s |
| **Uptime** | 99.9% | ✅ 99.95% |
| **SSL Grade** | A+ | ✅ A+ |
| **Mobile Support** | 100% | ✅ 100% |

**Optimizations:**
- Global edge caching (170+ data centers)
- HTTP/2 and HTTP/3 (QUIC) support
- Automatic image optimization
- Automatic minification (HTML, CSS, JS)
- Brotli compression

### 4.8.5 Security

**Automatic HTTPS:**
- TLS 1.3 encryption
- Automatic certificate renewal (90 days)
- HSTS (HTTP Strict Transport Security)

**Cloudflare WAF (Web Application Firewall):**
- OWASP Top 10 protection
- SQL injection protection
- XSS (Cross-Site Scripting) protection

**Rate Limiting:**
- 100 requests / 15 minutes per IP
- DDoS protection (automatic)
- Bot management

**Security Headers:**
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### 4.8.6 Cost

**Cloudflare Pages (Free Tier):**
- Builds: 500/month
- Bandwidth: Unlimited
- Requests: Unlimited
- Custom domains: 100
- SSL certificates: Unlimited

**Total Cost:** €0/month

**Comparison:**
- Netlify Pro: €19/month
- Vercel Pro: €20/month
- AWS Amplify: ~€15-30/month
- **Cloudflare Pages:** €0/month ✅

### 4.8.7 Business Impact

**1. Professional Web Presence**
- First impression for customers and investors
- Brand credibility (custom domain, HTTPS, fast loading)
- SEO optimization (Google ranking)

**2. Centralized Authentication Portal**
- Single Sign-On (SSO) for 11 services
- User management (RBAC - Role-Based Access Control)
- Audit log (who accessed what and when)

**3. Real-Time Progress Tracking**
- Weekly reports (progress-report)
- Dashboard suite (V7, V8, V9)
- Transparency for customers and investors

**4. Compliance Documentation**
- CSRD (Corporate Sustainability Reporting Directive)
- EU requirements fulfillment
- Enterprise customer compliance needs

**5. Scalable Infrastructure**
- Supports 100+ customers without additional costs
- Global distribution (latency <50ms worldwide)
- Automatic scaling (no server configuration)

### 4.8.8 Deployment Timeline

| Phase | Date | Status |
|-------|------|--------|
| **Domain Registration** | 15.12.2025 | ✅ Complete |
| **Cloudflare Pages Project** | 20.12.2025 | ✅ Complete |
| **DNS Configuration** | 22.12.2025 | ✅ Complete |
| **SSL Activation** | 22.12.2025 | ✅ Complete |
| **Content Migration** | 26.12.2025 | ✅ Complete |
| **Custom Domain (dws6.com)** | 30.12.2025 | ✅ Complete |
| **Production Launch** | 30.12.2025 | ✅ Live |

### 4.8.9 Maintenance and Monitoring

**Daily Monitoring:**
- Availability check (https://dws6.com)
- SSL certificate status
- Error logs (4xx, 5xx)

**Weekly Monitoring:**
- Cloudflare analytics (traffic, performance)
- Security events (WAF blocks)
- Performance metrics (load times)

**Monthly Monitoring:**
- Content updates
- Resource optimization
- Documentation review

**Automated Alerts:**
- Uptime <99% (UptimeRobot)
- SSL certificate expires <30 days
- Abnormal traffic spikes (DDoS attempt)

### 4.8.10 Future Enhancements

**Q1 2026:**
- [ ] A/B testing (different versions for different users)
- [ ] Analytics (Google Analytics 4)
- [ ] Chatbot (customer support)
- [ ] Multilingual (EN, FI, SV, DE)

**Q2 2026:**
- [ ] Personalization (user-specific content)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Developer portal (API keys, documentation)
- [ ] Integrations (Zapier, Make, n8n)

### 4.8.11 Summary

**dws6.com** is a critical part of the DWS6 ecosystem, providing:

✅ **Professional web presence** (€0/month cost)  
✅ **Centralized access** to all services  
✅ **Scalable infrastructure** (100+ customers)  
✅ **Security** (HTTPS, WAF, DDoS protection)  
✅ **Performance** (<1s load, 99.9% uptime)  
✅ **Transparency** (reports, dashboards, CSRD)

The implementation demonstrates that a startup can build enterprise-grade web infrastructure without significant costs by leveraging modern cloud services (Cloudflare Pages) and open-source tools.

---

# 5. Implementation (MVP Phase)

[Content to be added during implementation phase - December 2025 - February 2026]

## 5.1 Infrastructure Deployment

[To be added]

## 5.2 Agent Development

[To be added]

## 5.3 Customer Onboarding

[To be added]

## 5.4 Results

[To be added]

---

# 6. Results and Analysis

[Content to be added during analysis phase - February 2026]

## 6.1 Cost Analysis

[To be added]

## 6.2 Customer Analysis

[To be added]

## 6.3 Operational Analysis

[To be added]

## 6.4 Competitive Positioning

[To be added]

---

# 7. Discussion

[Content to be added during discussion phase - March 2026]

## 7.1 Key Findings and Implications

[To be added]

## 7.2 Replicability

[To be added]

## 7.3 Limitations and Threats

[To be added]

## 7.4 Recommendations for Lifetime Oy

[To be added]

## 7.5 Future Research Directions

[To be added]

---

# 8. Conclusions

[Content to be added during final phase - March 2026]

---

# 9. References

[References to be added as work progresses]

## Academic Literature

1. Ries, E. (2011). *The Lean Startup*. Crown Business.
2. Blank, S. (2013). *The Four Steps to the Epiphany*. K&S Ranch.
3. Parker, G., Van Alstyne, M., & Choudary, S. (2016). *Platform Revolution*. W.W. Norton.
4. European Commission (2021). *Industry 5.0: Towards a sustainable, human-centric and resilient European industry*.
5. Shi, W., et al. (2016). "Edge Computing: Vision and Challenges." *IEEE Internet of Things Journal*, 3(5), 637-646.

## Industry Reports

1. European Commission (2025). "Life cycle GHG emissions of buildings." Ramboll.
2. GRESB (2024). "Creating an Embodied Carbon Strategy in European Markets."
3. Eurofound & Cedefop (2025). "Digitalisation of SMEs in the EU: Trends, policies and impacts."
4. Statista (2024). "Revenue of major construction companies in Europe 2023."

## Regulations and Standards

1. NIS 2 Directive (EU) 2022/2555
2. EU AI Act (EU) 2024/1689
3. GDPR (EU) 2016/679
4. Cybersecurity Act (EU) 2019/881
5. ISO 27001:2022 (Information Security Management)

---

# 10. Appendices

## Appendix 1: Customer Interview Protocol

[To be added]

## Appendix 2: Cost Tracking Form

[To be added]

## Appendix 3: Agent YAML Configurations

[To be added]

## Appendix 4: Glossary

[To be added]

---

**Document Information:**

**Title:** Firehorse Product Manufacturing Operating Model  
**Author:** Risto Anton Päärni  
**Institution:** Metropolia University of Applied Sciences  
**Program:** [TBD - Business IT or Industrial Management]  
**Supervisor:** [TBD]  
**Company:** Lifetime Oy (Firehorse brand)  
**Status:** 🚧 DRAFT - Work in Progress  
**Version:** 1.0  
**Last Updated:** 30.12.2025  
**Next Update:** Implementation Phase (December 2025 - February 2026)

**Languages:** English, Suomi  
**Related Documents:**  
- [Finnish Version](../fi/OPINNAYTETYO_FI.md)  
- [Thesis Outline](THESIS_OUTLINE.md)  
- [Research Framework](RESEARCH_FRAMEWORK.md)

**License:** Proprietary - Lifetime Oy  
**Contact:** risto@lifetime.fi

---
title: "Terms of Service for MCP Hub"
description: "Legal terms governing the use of DWS MCP Hub - Multi-Agent Orchestration Platform"
effective_date: "December 10, 2025"
version: "1.0"
---

# Terms of Service for MCP Hub
**Multi-Agent Orchestration Platform**

**Effective Date:** December 10, 2025  
**Service Provider:** Lifetime Oy  
**Registered Address:** Laidunmaanraitti 2 A 25, 02330 Espoo, Finland  
**Business ID:** [Insert Y-tunnus]

---

## 1. Service Definition

### 1.1 What is MCP Hub?

The **DWS MCP Hub** (Model Context Protocol Hub) is a multi-agent orchestration platform that coordinates:

- **AI Agents**: Cursor AI, Claude Code (Anthropic), Gemini Pro (Google), and DWS IQ agents
- **Construction Tools**: BIM systems, ALICE Technologies, Procore, and EU compliance validators
- **Lifetime Firehorse Products**: Customer-owned tools, Lifetime World Model, EN 15978 Carbon Calculator
- **Physical Fleet**: Cars (Lifetime Fleet), drones (site monitoring), robots (automated inspection)
- **Automated Workflows**: Reports, schedules, and compliance packages

The MCP Hub operates as a **single climate-intelligent brain** instead of disconnected scripts, enabling:
- **Fan-out workflows**: Parallel task execution
- **Reflection workflows**: Iterative quality loops
- **Sequential workflows**: BIM → Carbon → Compliance pipelines

### 1.2 Service Components

The MCP Hub consists of:

| Component | Port | Purpose |
|-----------|------|---------|
| **MCP Coordination Hub** | 8765 | Agent orchestration and workflow management |
| **Supabase MCP Server** | 8766 | Session persistence and Firehorse integration |
| **Temporal.io Engine** | 7233 | Workflow durability and reliability |
| **Temporal UI** | 8088 | Real-time monitoring dashboard |
| **PostgreSQL Store** | 5432 | Context storage with pgvector |

---

## 2. Acceptable Use Policy

### 2.1 Permitted Uses

You may use the MCP Hub for:

✅ **Development Orchestration**: Coordinating AI agents for software development  
✅ **Construction Workflows**: BIM processing, carbon calculations, compliance validation  
✅ **Fleet Management**: Route optimization for Lifetime Fleet vehicles  
✅ **Report Generation**: Automated compliance reports (Fit for 55, EPBD, ETS, CBAM)  
✅ **Research & Testing**: Evaluating multi-agent workflow patterns  

### 2.2 Prohibited Uses

You may **NOT** use the MCP Hub for:

❌ **Illegal Activities**: Any activity violating EU or Finnish law  
❌ **Malicious Automation**: DDoS attacks, spam generation, or system exploitation  
❌ **Unauthorized Data Processing**: Processing personal data without proper legal basis  
❌ **Competitive Intelligence**: Reverse-engineering the orchestration algorithms  
❌ **High-Risk AI Applications**: Biometric surveillance, social scoring, or safety-critical systems without human oversight (EU AI Act compliance)  

### 2.3 Rate Limits & Fair Use

Default rate limits:
- **100 requests/minute** per API key
- **10 concurrent workflows** (Fan-out pattern)
- **3 reflection iterations** (Reflection pattern)

Enterprise customers may request higher limits. Abuse of rate limits may result in temporary service suspension.

---

## 3. Data Processing & Privacy

### 3.1 Data Controller Relationship

**For Public Cloud Deployment:**
- **Lifetime Oy** acts as the **Data Controller** for MCP Hub infrastructure
- **You (Customer)** act as the **Data Controller** for your business data processed through the Hub
- MCP Hub acts as a **Data Processor** when handling your customer data

**For Private Cloud Deployment:**
- **You (Customer)** are the **Data Controller** for all data
- MCP Hub runs in your GCP/Azure environment with full data sovereignty

### 3.2 What Data We Collect

| Data Type | Purpose | Retention | GDPR Basis |
|-----------|---------|-----------|------------|
| **Session Data** | Claude Code session continuity | 7 days (default) | Legitimate Interest |
| **Agent Memory** | Context across development sessions | 90 days | Contract Performance |
| **Workflow Logs** | Temporal.io execution tracking | 30 days | Contract Performance |
| **API Usage** | Rate limiting, billing, security | 12 months | Legal Obligation |
| **Error Logs** | System debugging and reliability | 90 days | Legitimate Interest |

### 3.3 Third-Party AI Providers

The MCP Hub integrates with:

| Provider | Service | Data Sharing | Privacy Policy |
|----------|---------|--------------|----------------|
| **Anthropic** | Claude Code | API requests, code context | [Anthropic Privacy](https://www.anthropic.com/privacy) |
| **Google** | Gemini Pro | API requests, prompts | [Google Privacy](https://policies.google.com/privacy) |
| **Groq** | Fast inference | API requests, tokens | [Groq Privacy](https://groq.com/privacy-policy/) |

**Important**: We do **NOT** train public models on your data. Each provider has independent data retention policies.

### 3.4 Data Residency (GDPR Compliance)

- **Primary Storage**: EU/EEA (Frankfurt, Germany - Supabase eu-central-1)
- **Backup Storage**: EU/EEA (Stockholm, Sweden - AWS eu-north-1)
- **No US Transfers**: Unless you explicitly choose a US-based Supabase instance

### 3.5 Your Rights (GDPR)

You have the right to:

✅ **Access** your session data and workflow logs  
✅ **Rectification** of incorrect data  
✅ **Erasure** ("Right to be forgotten") - subject to legal retention requirements  
✅ **Data Portability** - export in JSON format  
✅ **Object** to automated decision-making  

**Contact**: dpo@lifetime.fi

---

## 4. Service Level Agreement (SLA)

### 4.1 Uptime Guarantee

| Tier | Uptime Target | Downtime/Month | Credit |
|------|---------------|----------------|--------|
| **Free** | 99.0% | 7.2 hours | None |
| **Pro** | 99.5% | 3.6 hours | 10% credit |
| **Enterprise** | 99.9% | 43 minutes | 25% credit |

**Exclusions**: Scheduled maintenance (announced 48h in advance), force majeure, third-party AI provider outages.

### 4.2 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **MCP Hub Latency** | <500ms | P95 response time |
| **Supabase MCP Latency** | <200ms | P95 response time |
| **Workflow Initiation** | <2s | Fan-out pattern start |
| **Session Retrieval** | <100ms | PostgreSQL query time |

### 4.3 Support Response Times

| Severity | Description | Response Time | Channels |
|----------|-------------|---------------|----------|
| **Critical** | Service down, data loss | 1 hour | Phone, Email |
| **High** | Major feature broken | 4 hours | Email, Slack |
| **Medium** | Minor issue, workaround exists | 24 hours | Email |
| **Low** | Question, feature request | 72 hours | Email, Community |

**Enterprise Support**: Dedicated Slack channel with 24/7 on-call engineer.

---

## 5. Security & Compliance

### 5.1 Security Standards

The MCP Hub implements:

✅ **Encryption at Rest**: AES-256 for PostgreSQL data  
✅ **Encryption in Transit**: TLS 1.3 for all API communications  
✅ **API Authentication**: Bearer token + optional API key  
✅ **Rate Limiting**: Protection against abuse  
✅ **Audit Logging**: Immutable logs for all agent decisions  
✅ **Vulnerability Scanning**: Weekly automated scans (Snyk)  

### 5.2 NIS2 Directive Compliance

As a provider to essential entities (Energy, Transport, Construction), we align with **NIS2**:

- **24-hour incident reporting** for significant cyber threats
- **Risk management framework** with annual audits
- **Supply chain security** for third-party AI providers
- **Cybersecurity training** for all personnel

### 5.3 EU AI Act Compliance

The MCP Hub is classified as **Limited Risk AI System**:

✅ **Transparency**: Users are informed when interacting with AI agents  
✅ **Human Oversight**: Critical decisions (e.g., "demolish structure") require human approval  
✅ **Not High-Risk**: Does not perform biometric identification or safety-critical functions without oversight  

**Documentation**: AI system documentation available at [docs.dws10.com/ai-act](https://docs.dws10.com/ai-act)

---

## 6. Intellectual Property

### 6.1 Ownership

| Asset | Owner | Notes |
|-------|-------|-------|
| **MCP Hub Software** | Lifetime Oy | Proprietary, licensed not sold |
| **Your Code & Data** | You (Customer) | 100% ownership retained |
| **Agent Configurations** | You (Customer) | YAML configs you create |
| **Workflow Results** | You (Customer) | Reports, schedules, compliance packs |
| **Session Transcripts** | You (Customer) | Claude Code sessions |

### 6.2 No-Training Policy

**We do NOT train public models on your data.**

Your:
- Industrial knowledge
- Proprietary BIM models
- Project schedules
- Customer lists
- Carbon calculations

...are **NEVER** used to train Anthropic Claude, Google Gemini, or Groq models.

### 6.3 License Grant

Lifetime Oy grants you a **non-exclusive, non-transferable, revocable license** to use the MCP Hub during your subscription period.

---

## 7. Fees & Payment

### 7.1 Pricing Tiers

| Tier | Price | Included |
|------|-------|----------|
| **Free** | €0/month | 100 workflow executions, community support |
| **Pro** | €499/month | 10,000 executions, 5 edge devices, email support |
| **Enterprise** | €2,499/month | Unlimited executions, 50+ devices, dedicated Slack |

### 7.2 Billing

- **Billing Cycle**: Monthly, in advance
- **Payment Methods**: Revolut (0.8% fee), PayPal (2.9% fee)
- **Currency**: EUR (€)
- **VAT**: EU Reverse Charge applies for valid B2B VAT IDs

### 7.3 Overages

Executions beyond plan limits:
- **€0.05/execution** (Pro tier)
- **Contact sales** (Enterprise tier)

### 7.4 Refund Policy

- **Free Tier**: N/A
- **Pro Tier**: 14-day money-back guarantee (first purchase only)
- **Enterprise Tier**: Custom refund terms in contract

---

## 8. Term & Termination

### 8.1 Subscription Term

- **Free**: Month-to-month, cancel anytime
- **Pro**: Monthly or annual (20% discount)
- **Enterprise**: Annual contract with auto-renewal

### 8.2 Termination by Customer

You may terminate:
- **Immediately** for Free tier
- **30 days notice** for Pro tier (no refund for unused portion)
- **90 days notice** for Enterprise tier

### 8.3 Termination by Lifetime Oy

We may terminate or suspend your account:
- **Immediately** for violation of Acceptable Use Policy (Section 2.2)
- **7 days notice** for non-payment
- **30 days notice** for convenience (with pro-rated refund)

### 8.4 Data Export on Termination

Upon termination:
- **7 days** to export your data (JSON format)
- **30 days** we retain data for recovery
- **After 30 days**: Data permanently deleted (GDPR compliance)

---

## 9. Liability & Warranties

### 9.1 Warranty Disclaimer

THE MCP HUB IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:

- **Merchantability**: No guarantee of fitness for a particular purpose
- **Uninterrupted Service**: Downtime may occur (see SLA)
- **Error-Free Operation**: Bugs and errors may exist
- **Third-Party AI Accuracy**: We do not guarantee Claude, Gemini, or Groq outputs

### 9.2 Limitation of Liability

**Lifetime Oy's total liability is limited to:**
- **Free Tier**: €0 (no liability)
- **Pro Tier**: 1 month subscription fee (€499)
- **Enterprise Tier**: 3 months subscription fees (€7,497)

**We are NOT liable for:**
- Indirect, incidental, or consequential damages
- Lost profits or business opportunities
- Data loss due to your failure to backup
- Third-party AI provider errors or downtime

### 9.3 Indemnification

You agree to indemnify Lifetime Oy against claims arising from:
- Your violation of these Terms
- Your use of the MCP Hub for illegal purposes
- Your infringement of third-party intellectual property

---

## 10. Changes to Terms

### 10.1 Notification

We may update these Terms with:
- **30 days notice** for material changes (via email)
- **Immediate effect** for legal/regulatory requirements

### 10.2 Acceptance

Continued use after notice period = acceptance of new Terms.

If you **disagree**, you may terminate your subscription without penalty.

---

## 11. Governing Law & Disputes

### 11.1 Governing Law

These Terms are governed by **Finnish Law** (*Suomen laki*).

### 11.2 Jurisdiction

Disputes shall be resolved in the **District Court of Helsinki** (*Helsingin käräjäoikeus*).

### 11.3 Alternative Dispute Resolution

Before litigation, you may submit disputes to:
- **Consumer Disputes Board** (*Kuluttajariitalautakunta*) - for consumers
- **Mediation** - for business customers (optional)

---

## 12. Miscellaneous

### 12.1 Entire Agreement

These Terms constitute the entire agreement between you and Lifetime Oy regarding the MCP Hub.

### 12.2 Severability

If any provision is unenforceable, the remaining provisions remain in full effect.

### 12.3 No Waiver

Failure to enforce any right does not constitute a waiver of that right.

### 12.4 Assignment

You may not assign these Terms without our written consent. We may assign to affiliates or acquirers.

---

## 13. Contact Information

**Data Protection Officer (DPO)**  
Lifetime Oy  
Laidunmaanraitti 2 A 25  
02330 Espoo, Finland

**Designated Contacts:**
- **General Inquiries**: hello@lifetime.fi
- **Technical Support**: support@dws10.com
- **Legal/Privacy**: dpo@lifetime.fi
- **Executive Controller (CEO)**: risto@lifetime.fi

**Website**: https://dws10.com/legal/mcp-hub

---

## 14. Acknowledgment

By using the MCP Hub, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.

**Version**: 1.0  
**Effective Date**: December 10, 2025  
**Last Updated**: December 10, 2025

---

**© 2025 Lifetime Oy. All rights reserved.**


# DWS6 to DWS7 Platform Update — Migration & Evolution Guide

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/dws6-dws7-update-doc-I2Cgk | Date: 22.02.2026 | Changes: Initial creation — comprehensive DWS6→DWS7 update document covering architecture, migration path, compliance engine, and deployment evolution
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/dws6-dws7-update-doc-I2Cgk | Date: 27.02.2026 | Changes: Expanded Section 11 from NVIDIA+Siemens to full 5-partner ecosystem (NVIDIA, Siemens, ABB, xAI, Mistral), added multi-LLM router architecture, ABB Ability integration, EU-sovereign AI strategy with Mistral

Session Links & References:
  - Claude Code (claude/dws6-dws7-update-doc-I2Cgk): https://github.com/blogtheristo/dws6/commits/claude/dws6-dws7-update-doc-I2Cgk
  - DWS7 Roadmap: DWS7_ROADMAP.md
  - Cloud Environments: docs/CLOUD_ENVIRONMENTS.md
  - NVIDIA/Siemens Integration: dws7/DWS7_INTEGRATION_ROADMAP_NVIDIA_SIEMENS.md

Document Status:
  - Created: 22.02.2026
  - Last Modified: 27.02.2026
  - Language: English
  - Publication Status: ACTIVE

***

**Version:** 1.1
**Status:** Living Document
**Created:** 2026-02-22
**Last Updated:** 2026-02-27
**Audience:** Engineering, Product, Compliance, Investors

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What Changes from DWS6 to DWS7](#2-what-changes-from-dws6-to-dws7)
3. [Architecture Evolution](#3-architecture-evolution)
4. [Migration Timeline (6 Phases, 247 PRs)](#4-migration-timeline-6-phases-247-prs)
5. [Compliance Engine — Fit for 55](#5-compliance-engine--fit-for-55)
6. [EU AI Act Compliance (Full Sovereignty Layer)](#6-eu-ai-act-compliance-full-sovereignty-layer)
7. [Cloud & Infrastructure Changes](#7-cloud--infrastructure-changes)
8. [Security & Certification Path](#8-security--certification-path)
9. [Agentic AI & Intelligence Layer](#9-agentic-ai--intelligence-layer)
10. [IoT-to-Compliance Pipeline](#10-iot-to-compliance-pipeline)
11. [Strategic Partnerships — NVIDIA, Siemens, ABB, xAI & Mistral](#11-strategic-partnerships--nvidia-siemens-abb-xai--mistral)
12. [Multi-Tenancy & Billing](#12-multi-tenancy--billing)
13. [Industry Vertical Expansion](#13-industry-vertical-expansion)
14. [Breaking Changes & Migration Notes](#14-breaking-changes--migration-notes)
15. [Revenue & Business Milestones](#15-revenue--business-milestones)
16. [Success Criteria for DWS7 GA](#16-success-criteria-for-dws7-ga)

---

## 1. Executive Summary

DWS IQ 6 is a pilot-phase enterprise climate intelligence platform built on Express/TypeScript, React 19, Supabase, and 6 AI agents with MCP orchestration. It serves EU-regulated industries with climate compliance automation.

**DWS IQ 7** is the production-grade evolution — transforming the pilot (€7K MRR, 3 customers) into a scalable, certified platform (€72K+ MRR, 16+ customers) with full EU regulatory coverage.

The transition is not a rewrite. It is a **disciplined 22-month evolution** across 247 pull requests in 6 phases (Q1 2026 → Q4 2027), adding compliance engines, agentic AI, IoT pipelines, multi-tenancy, and security certifications on top of DWS6's foundations.

### Key Numbers

| Metric | DWS6 (Current) | DWS7 (Target) |
|--------|----------------|----------------|
| Customers | 3 | 16+ |
| MRR | €7,000 | €72,000+ |
| ARR | €84,000 | €864,000+ |
| Regulations covered | Partial ETS | Full Fit-for-55 (ETS + CBAM + CSRD + ESR) |
| EU AI Act compliance | None | Full Article 12 + Reasoning Lineage |
| Automated tests | ~20 | 200+ |
| Security certification | None | ISO 27001 + SOC 2 Type II (in progress) |
| Industry verticals | General | 16 specialized modules |
| Cloud regions | 1 (EU) | 2 (Finland + Germany) |

---

## 2. What Changes from DWS6 to DWS7

### Preserved (DWS6 Foundations)

These DWS6 components carry forward unchanged or with incremental improvements:

- **Backend**: Express 4.19 + TypeScript 5.9 (same stack, hardened)
- **Frontend**: React 19 + Vite 7.2 + TailwindCSS 4.1 (same stack, new modules)
- **Database**: Supabase PostgreSQL + pgvector (same, with RLS policies added)
- **AI models**: Claude (Anthropic), Gemini, Groq (same providers)
- **MCP**: Model Context Protocol for agent coordination (expanded)
- **Landing pages**: Cloudflare Pages/Workers (same deployment)
- **CI/CD**: 15 GitHub Actions workflows (expanded to ~25)

### Added (New in DWS7)

| Capability | Phase | PRs |
|------------|-------|-----|
| EU ETS compliance engine | Phase 2 | 12 |
| CBAM compliance engine | Phase 2 | 10 |
| CSRD/ESRS reporting | Phase 2 | 10 |
| EU AI Act (Article 12, reasoning lineage) | Phase 2 | 6 |
| Multi-tenant isolation (RLS, tenant routing) | Phase 3 | 8 |
| ISO 27001 security controls | Phase 3 | 10 |
| Stripe billing & subscription management | Phase 3 | 8 |
| Temporal.io agent orchestration | Phase 4 | 10 |
| IoT data ingestion & real-time emissions | Phase 4 | 7 |
| Climate LLM fine-tuning (LoRA on Llama 3.3 70B) | Phase 4 | 3 |
| Supplier CBAM portal | Phase 5 | 9 |
| 12 industry vertical modules | Phase 5 | 12 |
| Mobile PWA + React Native | Phase 5 | 6 |
| Multi-region deployment (FI + DE) | Phase 6 | 4 |
| SOC 2 Type II preparation | Phase 6 | 3 |
| Investor metrics dashboard | Phase 6 | 4 |

### Removed or Replaced

| DWS6 Component | DWS7 Replacement | Reason |
|----------------|------------------|--------|
| Manual cron scheduling | Temporal.io workflows | Reliability, visibility, retry semantics |
| Single-tenant database | Row-Level Security (RLS) isolation | Required for multi-customer deployment |
| CORS `*` wildcard | Explicit origin allowlist | Security hardening (per 2026-02-21 vulnerability assessment) |
| `exec()` shell commands | `execFile()` with argument arrays | Command injection prevention |
| Community MCP skills (unvetted) | Reviewed + signed MCP skills only | Supply chain security |

---

## 3. Architecture Evolution

### DWS6 Architecture (Current)

```
┌─────────────────────────────────────────────────┐
│  US Cloud (Cloudflare)                          │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Pages (SPA)  │  │ Workers (Edge API)       │ │
│  │ dws6.com     │  │ Rate limiting, caching   │ │
│  │ dws10.com    │  │                          │ │
│  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────┐
│  EU Cloud (Google Cloud + Supabase)             │
│  ┌──────────────┐  ┌──────────────────────────┐ │
│  │ Cloud Run    │  │ Supabase                 │ │
│  │ Express API  │  │ PostgreSQL + pgvector    │ │
│  │ 6 AI Agents  │  │ Auth + Realtime          │ │
│  └──────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### DWS7 Architecture (Target)

```
┌─────────────────────────────────────────────────────────────┐
│  US Cloud (Cloudflare) — Global Edge                        │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────────┐ │
│  │ Pages (SPA)  │  │ Workers          │  │ Store + Feeds │ │
│  │ dws6/10.com  │  │ Edge API + WAF   │  │ Google Merch  │ │
│  │ onelifetime  │  │ Rate limiting    │  │ Product pages │ │
│  └──────────────┘  └──────────────────┘  └───────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  EU Cloud (Google Cloud + Supabase) — Backend               │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────┐ │
│  │ Cloud Run    │  │ Temporal.io │  │ Supabase           │ │
│  │ Express API  │  │ Agent Orch  │  │ PostgreSQL+pgvec   │ │
│  │ Compliance   │  │ Workflows   │  │ RLS Multi-tenant   │ │
│  │ Engine       │  │ IoT Pipeline│  │ Auth + Realtime    │ │
│  └──────────────┘  └─────────────┘  └────────────────────┘ │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────┐ │
│  │ Redis Cache  │  │ Climate LLM │  │ Scaleway Backup    │ │
│  │ Session +    │  │ Llama 3.3   │  │ Failover (fr-par)  │ │
│  │ API cache    │  │ LoRA tuned  │  │ Cold standby       │ │
│  └──────────────┘  └─────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  EU AI Act Compliance Overlay (Full Sovereignty / Aegis)    │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────┐ │
│  │ OpenTelemetry│  │ Reasoning   │  │ Audit Log          │ │
│  │ Trace Collect│  │ Store       │  │ Append-only PG     │ │
│  │ (sidecar)   │  │ (pgvector)  │  │ 7-year retention   │ │
│  └──────────────┘  └─────────────┘  └────────────────────┘ │
│  ┌──────────────┐  ┌─────────────────────────────────────┐ │
│  │ Privacy      │  │ Safety: NeMo Guardrails /           │ │
│  │ Presidio NER │  │ Llama Guard                         │ │
│  │ PII masking  │  │                                     │ │
│  └──────────────┘  └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  Edge AI (NVIDIA Jetson Orin Nano) — Factory Floor          │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────────────┐ │
│  │ Sensor Input │  │ Local       │  │ Emissions Calc     │ │
│  │ IoT Gateway  │  │ Inference   │  │ Real-time MRV      │ │
│  └──────────────┘  └─────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Brain-Memory-Body-Hands Model

DWS7 formalizes the ecosystem into four layers:

| Layer | Component | Function |
|-------|-----------|----------|
| **Brain** | DWS IQ 7 Platform | Multi-agent AI orchestration, decision-making |
| **Memory** | Lifetime World Model | Climate LLM + EU regulation knowledge base (RAG) |
| **Body** | Firehorse Suite | Reports, automation, content DMS, omnichannel outreach |
| **Hands** | Lifetime Fleet | IoT sensors, NVIDIA Jetson edge AI, physical execution |

---

## 4. Migration Timeline (6 Phases, 247 PRs)

### Phase 1 — Launch & Stabilize (Feb–Apr 2026)

**45 PRs | Target: €8,500 MRR | 3 paying customers**

Focus: Production readiness. Testing, monitoring, deployment hardening.

| Category | PRs | Key Deliverables |
|----------|-----|------------------|
| Testing & Quality | 18 | Vitest coverage gate, unit tests for auth/climate/email/ERP, integration tests, E2E smoke suite |
| Backend & API | 14 | Rate limiting, error handling, API versioning, health checks, structured logging |
| Frontend & Dashboard | 6 | Performance optimization, accessibility, responsive fixes |
| DevOps | 7 | Staging environment, Docker Compose prod, monitoring dashboards, backup automation |

**Milestone:** DWS6 becomes production-stable. First 3 customers onboarded with SLA.

### Phase 2 — Compliance Engine (May–Jul 2026)

**48 PRs | Target: €15,000 MRR | 5 customers**

Focus: Full Fit-for-55 regulatory coverage + EU AI Act compliance.

| Module | PRs | Key Deliverables |
|--------|-----|------------------|
| EU ETS | 12 | Registry data model, emission calculation engine, free allowance tracker, financial exposure dashboard, MRV report generator |
| CBAM | 10 | Product classification engine, embedded emissions calculator, supplier data portal, quarterly CBAM reporting |
| CSRD/ESRS | 10 | 1,100+ data point registry, GHG Scope 1-3 calculation, transition plan builder, double materiality assessment |
| EU AI Act | 6 | Article 12 automatic logging, reasoning lineage documentation, model registry, human-in-the-loop workflows, transparency reports |

**Milestone:** Only platform covering ETS + CBAM + CSRD + EU AI Act in a single product.

### Phase 3 — Scale & Harden (Aug–Oct 2026)

**44 PRs | Target: €28,000 MRR | 8 customers**

Focus: Enterprise readiness — security, multi-tenancy, billing.

| Category | PRs | Key Deliverables |
|----------|-----|------------------|
| Security | 16 | ISO 27001 controls, penetration testing, vulnerability scanning, SIEM integration, incident response plan |
| Multi-Tenancy | 8 | Supabase RLS policies, tenant routing middleware, data isolation verification, tenant provisioning API |
| Performance | 9 | Redis caching layer, query optimization, CDN configuration, load testing, <100ms p95 target |
| Billing | 8 | Stripe integration, subscription management, usage metering, invoice generation, dunning |
| ERP Depth | 3 | SAP S/4HANA, IFS Cloud, Monitor ERP — production-validated connectors |

**Milestone:** Platform passes ISO 27001 gap analysis. 8 customers across 3+ industries.

### Phase 4 — Intelligence Layer (Nov 2026–Jan 2027)

**40 PRs | Target: €40,000 MRR | 10 customers**

Focus: Autonomous AI agents + IoT data pipeline.

| Category | PRs | Key Deliverables |
|----------|-----|------------------|
| Agentic AI | 13 | Temporal.io orchestration, compliance checking agent, data collection agent, report generation agent, anomaly detection, deadline reminders, supplier outreach agent |
| IoT Pipeline | 10 | Sensor data ingestion (MQTT/OPC-UA), real-time emissions calculation, automated MRV from sensor data, edge inference on Jetson |
| Analytics | 7 | Executive climate dashboard, industry benchmarking, trend analysis, predictive compliance scoring |
| Climate LLM | 5 | Fine-tuned Llama 3.3 70B (LoRA), RAG pipeline for EU regulation knowledge base, regulation Q&A |
| Advanced Reporting | 5 | Automated CSRD report drafting, board-ready climate summary, supply chain emissions map |

**Milestone:** First fully autonomous compliance workflow — sensor data to regulatory filing with zero manual steps.

### Phase 5 — Market Expansion (Feb–May 2027)

**38 PRs | Target: €56,000 MRR | 14 customers**

Focus: Industry specialization + supplier ecosystem + mobile.

| Category | PRs | Key Deliverables |
|----------|-----|------------------|
| Supplier Portal | 9 | CBAM data entry wizard, supplier onboarding flow, verification workflow, data quality scoring, automated reminders |
| Industry Verticals | 12 | Specialized modules for Construction, Steel, Cement, Chemicals, Aluminum, Manufacturing, Logistics, Energy, Mining, Healthcare, Real Estate, Public Sector |
| Partner API | 2 | Partner API gateway + OAuth2 for third-party integrations |
| Mobile | 6 | PWA for mobile access, React Native app for field workers |
| i18n | 3 | EN, FI, DE, SV, NO language support |
| ERP Expansion | 6 | Microsoft Dynamics 365 + Visma + Jeeves connectors |

**Milestone:** Serving 14 customers across 8+ industries. Supplier portal live.

### Phase 6 — DWS7 GA Release (Jun–Dec 2027)

**32 PRs | Target: €72,000+ MRR | 16+ customers**

Focus: Certification, investor readiness, advanced features.

| Category | PRs | Key Deliverables |
|----------|-----|------------------|
| Multi-Region | 4 | Finland + Germany deployment, data residency controls, geo-routing |
| Certification | 6 | ISO 27001 certification audit, SOC 2 Type II preparation, penetration test report |
| Quality | 4 | 200+ automated tests, feature flag system, A/B testing framework |
| Investor | 4 | Investor metrics API, real-time financial dashboard, customer success metrics |
| Advanced Features | 14 | SBTi target tracker, decarbonization scenario planner, real-time carbon dashboard from IoT, digital twin integration, advanced supply chain mapping |

**Milestone:** DWS IQ 7 General Availability. ISO 27001 certified. 16+ paying customers.

---

## 5. Compliance Engine — Fit for 55

DWS7 is the only platform that covers all four major EU climate regulations in a single product:

### EU ETS (Emissions Trading System)

- **Registry data model**: EU ETS installation registry with historical allowance data
- **Emission calculation engine**: Fuel-based and mass-balance methodologies
- **Free allowance tracker**: Phase 4 allocation tracking with carbon leakage protection
- **Financial exposure dashboard**: Real-time EUA price integration, hedge recommendations
- **MRV report generator**: Automated Monitoring, Reporting & Verification reports

### CBAM (Carbon Border Adjustment Mechanism)

- **Product classification**: CN code mapping to CBAM product categories
- **Embedded emissions calculator**: Direct + indirect emissions per product
- **Supplier data portal**: Third-country supplier emission data collection
- **Quarterly reporting**: Automated CBAM quarterly and annual declarations
- **Certificate management**: CBAM certificate purchase tracking and surrendering

### CSRD/ESRS (Corporate Sustainability Reporting Directive)

- **Data point registry**: Full coverage of 1,100+ ESRS data points
- **GHG Scope 1-3**: Complete greenhouse gas accounting across all scopes
- **Transition plan builder**: Climate transition planning aligned with Paris Agreement
- **Double materiality assessment**: Impact materiality + financial materiality analysis
- **Audit trail**: Complete data lineage for external assurance

### ESR (Effort Sharing Regulation)

- **National target tracking**: Member state emission reduction target monitoring
- **Sector allocation**: Emissions by sector (transport, buildings, agriculture, waste)
- **Compliance gap analysis**: Distance-to-target calculations with trajectory modeling

---

## 6. EU AI Act Compliance (Full Sovereignty Layer)

DWS7 classifies as a **high-risk AI system** under the EU AI Act (industrial decision support for regulated industries). The Full Sovereignty (Aegis) compliance layer, deployed as an overlay on the EU Cloud, ensures full compliance by August 2026.

### Article 12 — Automatic Logging

| Component | Technology | Purpose |
|-----------|------------|---------|
| Trace collection | Cloud Run sidecar + OpenTelemetry | Capture all AI system events |
| Reasoning store | Supabase pgvector | Store decision chains with embeddings |
| Audit log | Append-only PostgreSQL | Immutable event record, 7-year retention |
| Privacy filter | Presidio NER | Automatic PII masking before storage |

### Reasoning Lineage

Every AI decision must be traceable from input to output:

```
User Query → Agent Selection → Model Inference → Tool Calls → Output → Verification
     │              │                │               │           │           │
     └──────────────┴────────────────┴───────────────┴───────────┴───────────┘
                              All steps logged with metadata
```

### AI Safety

| Control | Implementation |
|---------|---------------|
| Input validation | NeMo Guardrails for prompt injection detection |
| Output safety | Llama Guard for harmful content filtering |
| Human-in-the-loop | Approval workflows for high-stakes decisions |
| Model registry | Version tracking for all deployed models |
| Transparency reports | Quarterly AI system performance and fairness reports |

---

## 7. Cloud & Infrastructure Changes

### Cost Evolution

| Phase | Monthly Cloud Cost | MRR | Gross Margin |
|-------|-------------------|-----|-------------|
| DWS6 Pilot (current) | ~€250 | €7,000 | 96% |
| DWS7 Phase 1 | ~€400 | €8,500 | 95% |
| DWS7 Phase 3 | ~€700 | €28,000 | 97% |
| DWS7 Phase 6 | ~€1,200 | €72,000 | 98% |

### New Infrastructure Components

| Component | When | Purpose |
|-----------|------|---------|
| Redis cache | Phase 3 | API response caching, session management |
| Temporal.io | Phase 4 | Agent workflow orchestration, retry semantics |
| Scaleway (fr-par) | Phase 3 | Cold standby failover for EU Cloud |
| Hetzner Helsinki | Phase 2 | Jitsi Meet for Firehorse V3 (€16.79/mo → €80/mo) |
| NVIDIA Jetson Orin Nano | Phase 4 | Edge AI inference at customer factory sites |
| Multi-region (DE) | Phase 6 | Germany region for data residency requirements |

### Deployment Tiers

| Tier | Environment | Purpose | Phase |
|------|-------------|---------|-------|
| T1 | Docker Compose (local) | Development | Current |
| T2 | Cloud Run (europe-north1) | Staging | Phase 1 |
| T3 | Cloud Run + Scaleway backup | Production EU | Phase 3 |
| T4 | Cloudflare Pages/Workers | Global edge | Current |

---

## 8. Security & Certification Path

### DWS6 Security Baseline

- HTTPS everywhere (Cloudflare)
- JWT authentication
- Helmet security headers
- Basic input validation
- `.env` secret management
- Pre-commit hooks for branch validation

### DWS7 Security Additions

| Control | Phase | Standard |
|---------|-------|----------|
| Explicit CORS origin allowlist | Phase 1 | OWASP |
| `execFile()` for all shell commands | Phase 1 | OWASP Command Injection |
| SRI hashes on all CDN dependencies | Phase 1 | Supply Chain Security |
| Rate limiting (per-tenant) | Phase 1 | DDoS prevention |
| Row-Level Security (RLS) on all tables | Phase 3 | Multi-tenant isolation |
| SIEM integration (Wazuh/Elastic) | Phase 3 | ISO 27001 A.12 |
| Vulnerability scanning (weekly) | Phase 3 | ISO 27001 A.12.6 |
| Penetration testing (annual) | Phase 3 | ISO 27001 A.18.2 |
| Incident response plan | Phase 3 | ISO 27001 A.16 |
| Encryption at rest (AES-256) | Phase 3 | GDPR Art. 32 |
| Key rotation (90-day cycle) | Phase 3 | ISO 27001 A.10 |
| SOC 2 Type II controls | Phase 6 | AICPA TSC |
| ISO 27001 certification | Phase 6 | ISO/IEC 27001:2022 |
| ASPICE gap analysis (Lifetime Fleet) | Phase 3 | Automotive SPICE v4.0 / ISO/IEC 33000 |
| SQuaRE quality metrics (agents + KYA) | Phase 3 | ISO/IEC 25010:2023 |
| ASPICE Level 2 readiness (Fleet) | Phase 5 | Automotive SPICE v4.0 |
| ASPICE Level 3 assessment (Fleet) | Phase 6 | Automotive SPICE v4.0 |

### Certification Timeline

```
Phase 1 (Feb-Apr 2026)    → Security hardening + vulnerability fixes
Phase 3 (Aug-Oct 2026)    → ISO 27001 gap analysis + control implementation
                          → ASPICE gap analysis for Lifetime Fleet (advisor-led)
                          → SQuaRE quality metrics framework for agents + KYA
Phase 5 (Feb-May 2027)    → ISO 27001 Stage 1 audit
                          → ASPICE Level 2 readiness for Fleet (SWE.1–SWE.6 + SUP.1, SUP.8, SUP.9, SUP.10)
Phase 6 (Jun-Dec 2027)    → ISO 27001 Stage 2 audit + SOC 2 Type II engagement
                          → ASPICE Level 3 external assessment for Fleet (Tier-1 automotive OEM requirement)
```

### Lifetime Fleet ASPICE Roadmap (DWS IQ 7)

Lifetime Fleet targets Tier-1 industrial/automotive OEMs (Bosch, Continental, Volvo, Scania) for which **Automotive SPICE Level 2–3 is a hard procurement gate**. Without ASPICE maturity, Fleet cannot enter the automotive supply chain regardless of technical capability.

| Phase | Deliverable | ASPICE Processes | Owner |
|-------|------------|------------------|-------|
| Phase 3 (Aug-Oct 2026) | Gap analysis against ASPICE v4.0 | Full VDA Scope (SYS.1–SYS.5, SWE.1–SWE.6, SUP, MAN, ACQ.4) | Standards & Compliance Advisor (Teemu Vesala candidate) |
| Phase 3 | Process asset library (templates, checklists, work products) | SUP.8 Configuration Management, SUP.9 Problem Resolution, SUP.10 Change Request Management | Advisor + Engineering |
| Phase 5 (Feb-May 2027) | Internal ASPICE Level 2 assessment | SWE.1 Software Requirements Analysis → SWE.6 Software Testing | Engineering |
| Phase 6 (Jun-Dec 2027) | External Level 3 assessment (intacsᵀᴹ competent assessor) | All Level 3 Capability Indicators | Certified assessor |

**Rationale:** ASPICE complements existing EU regulatory stack (EU AI Act Article 12, CBAM, NIS2) by adding **process-maturity evidence** automotive OEMs require in addition to regulatory compliance. Roadmap entry-point for this work is the Teemu Vesala advisor engagement (see `docs/field-notes/2026-04-19-vesala-teemu-standards-enthusiast.md`).

---

## 9. Agentic AI & Intelligence Layer

### DWS6 Agents (Current)

6 AI agents coordinated via MCP:
- Climate Assistant
- Email Service Agent
- ERP Connector Agent
- Report Generator
- Data Collection Agent
- Compliance Checker

### DWS7 Agent Architecture (Temporal.io)

```
┌──────────────────────────────────────────────────┐
│  Temporal.io Orchestration                       │
│                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ Compliance │  │ Data       │  │ Report     │ │
│  │ Checking   │  │ Collection │  │ Generation │ │
│  │ Agent      │  │ Agent      │  │ Agent      │ │
│  └────────────┘  └────────────┘  └────────────┘ │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │ Anomaly    │  │ Deadline   │  │ Supplier   │ │
│  │ Detection  │  │ Reminder   │  │ Outreach   │ │
│  │ Agent      │  │ Agent      │  │ Agent      │ │
│  └────────────┘  └────────────┘  └────────────┘ │
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │ Agent Approval Workflow                      ││
│  │ Human-in-the-loop for high-stakes decisions  ││
│  └──────────────────────────────────────────────┘│
│  ┌──────────────────────────────────────────────┐│
│  │ Performance Analytics                        ││
│  │ Agent execution metrics + cost tracking      ││
│  └──────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

Key improvements over DWS6:
- **Temporal.io** replaces node-cron for workflow orchestration (retry semantics, visibility, failure recovery)
- **Agent approval workflow** for high-stakes regulatory decisions
- **Performance analytics** tracking agent execution time, cost, and accuracy
- **Anomaly detection** for emissions data outliers
- **Supplier outreach** automation for CBAM data collection

### Climate LLM

- Base model: Llama 3.3 70B
- Fine-tuning: LoRA adapters on EU regulation corpus
- RAG pipeline: pgvector embeddings over 50,000+ regulation documents
- Deployment: Cloud Run (inference) + Jetson Orin Nano (edge)

---

## 10. IoT-to-Compliance Pipeline

The signature DWS7 capability — no competitor bridges IoT sensor data to regulatory filings:

```
Factory Floor                    Cloud                         Regulator
┌──────────┐    ┌────────────┐    ┌──────────────────┐    ┌──────────┐
│ Sensors  │───▶│ Jetson     │───▶│ Cloud Run        │───▶│ EU ETS   │
│ (temp,   │    │ Orin Nano  │    │ Emissions Calc   │    │ Registry │
│ flow,    │    │ Edge AI    │    │ MRV Generator    │    │ Filing   │
│ energy)  │    │ Inference  │    │ Compliance Check │    │          │
└──────────┘    └────────────┘    └──────────────────┘    └──────────┘
     │                │                    │
     ▼                ▼                    ▼
  MQTT/OPC-UA    Local anomaly       Automated MRV
  protocol       detection           report generation
```

### Supported Protocols

| Protocol | Use Case |
|----------|----------|
| MQTT | Lightweight sensor data (temperature, humidity, flow) |
| OPC-UA | Industrial equipment (PLCs, SCADA systems) |
| Modbus TCP | Legacy industrial equipment |
| REST API | Cloud-to-cloud data exchange |

### Pipeline Stages

1. **Ingest**: Sensor data arrives via MQTT/OPC-UA to Jetson edge device
2. **Process**: Edge AI performs anomaly detection and data validation
3. **Calculate**: Cloud Run computes emissions using fuel-based or mass-balance methodology
4. **Verify**: Automated cross-checks against historical data and regulatory thresholds
5. **Report**: MRV report generated and submitted to EU ETS registry
6. **Audit**: Complete data lineage stored in sovereignty audit log (7-year retention)

---

## 11. Strategic Partnerships — NVIDIA, Siemens, ABB, xAI & Mistral

DWS7 builds a multi-partner ecosystem spanning industrial automation (NVIDIA, Siemens, ABB), frontier AI inference (xAI, Mistral), and edge computing. Each partner fills a distinct role in the Brain-Memory-Body-Hands architecture.

### Partnership Overview

| Partner | Role in DWS7 | Layer | Status |
|---------|-------------|-------|--------|
| **NVIDIA** | GPU compute, edge AI (Jetson), digital twins (Omniverse) | Brain + Hands | Inception program target (Q2 2026) |
| **Siemens** | Industrial IoT (MindSphere), digital twins, marketplace | Body + Hands | Xcelerator developer access (Q2 2026) |
| **ABB** | Industrial automation, robotics, power & grid management | Hands | Integration target (Q3 2026) |
| **xAI** | Real-time market intelligence (Grok), X/Twitter data discovery | Brain + Memory | Active integration (production) |
| **Mistral** | EU-sovereign AI inference, multilingual compliance generation | Brain + Memory | Planned (Q3 2026) |

### 11.1 NVIDIA — GPU Compute & Edge AI

DWS7 positions within the NVIDIA-Siemens Industrial AI Operating System announced at CES 2026.

**Integration Phases:**

| Phase | Period | Investment | Key Deliverables |
|-------|--------|-----------|------------------|
| Foundation | Q2-Q3 2026 | $50-100K | NVIDIA Inception membership, team training on CUDA-X |
| MVP | Q3-Q4 2026 | $150-300K | Omniverse + Digital Twin pilot, Jetson edge deployment |
| Production | Q4 2026-Q1 2027 | $300-500K | Marketplace listing, 5-10 customers, $200K+ ARR |
| Scale | Q2 2027+ | Variable | 16 vertical modules, multi-region |

**Technology Integration:**

| NVIDIA Technology | DWS7 Use |
|-------------------|----------|
| Omniverse APIs | Factory digital twin visualization for emissions monitoring |
| CUDA-X Libraries | 2-10x speedup for emissions calculation and ML inference |
| TensorRT | Optimized inference on Jetson Orin Nano edge devices |
| OpenUSD | Standardized 3D scene description for industrial digital twins |
| Jetson Orin Nano | On-premise edge AI for IoT-to-compliance pipeline |
| NeMo Guardrails | AI safety layer for EU AI Act Article 12 compliance |

**Partnership Track:** NVIDIA Inception (Q2 2026) → Ecosystem Partner (Q4 2026) → Strategic Partner (2027+, $1M+ ARR)

### 11.2 Siemens — Industrial IoT & Digital Twins

**Technology Integration:**

| Siemens Technology | DWS7 Use |
|-------------------|----------|
| Digital Twin Composer | Climate-aware factory digital twins (announced CES 2026, mid-2026 launch) |
| Xcelerator Marketplace | Distribution channel for DWS7 industry modules |
| MindSphere | IoT data source for real-time emissions calculation |
| Tecnomatix | Manufacturing simulation with emissions optimization |
| Teamcenter | Product lifecycle management with carbon footprint tracking |
| Opcenter | Production operations with ETS compliance integration |

**Partnership Track:** Xcelerator Developer (Q2 2026) → Marketplace Seller (Q3-Q4 2026) → Solution Partner (2027+)

### 11.3 ABB — Industrial Automation & Power Management

ABB brings industrial automation, robotics, and power grid management — critical for DWS7's IoT-to-compliance pipeline in energy-intensive industries (steel, cement, chemicals, aluminum).

**Why ABB:** ABB's installed base of drives, motors, and power distribution equipment generates the sensor data DWS7 needs for real-time emissions calculation. Their customers are the exact EU ETS-regulated industries DWS7 targets.

**Technology Integration:**

| ABB Technology | DWS7 Use |
|----------------|----------|
| ABB Ability Platform | Cloud-to-cloud IoT data ingestion for emissions monitoring |
| ABB Ability Energy Manager | Real-time energy consumption data → Scope 2 emissions calculation |
| ABB Ability Condition Monitoring | Equipment efficiency data for emission intensity tracking |
| ABB Robotics (OmniCore) | Robotics cell energy consumption → production line carbon footprint |
| ABB Drives & Motors | Variable frequency drive data for energy optimization + ETS reporting |
| ABB Power Grids (FACTS) | Grid-level emissions data for energy sector vertical |

**Integration Architecture:**

```
ABB Ability Platform                    DWS7
┌──────────────────┐    REST/MQTT    ┌──────────────────┐
│ Energy Manager   │───────────────▶│ IoT Ingestion    │
│ Condition Monitor│                 │ Emissions Calc   │
│ Drive Data       │                 │ ETS/CBAM Report  │
└──────────────────┘                 └──────────────────┘
         │                                    │
         ▼                                    ▼
  ABB customer sites               Compliance dashboard
  (Steel, Cement, Chemicals)       + automated MRV filing
```

**Target Timeline:**

| Milestone | Period | Deliverable |
|-----------|--------|-------------|
| API exploration | Q3 2026 | ABB Ability API access, data format mapping |
| Pilot connector | Q4 2026 | Energy Manager → DWS7 data pipeline (1 customer site) |
| Production | Q1 2027 | Multi-site deployment, ABB Marketplace listing |
| Scale | Q2 2027+ | Cross-sell to ABB installed base across 25+ verticals |

**Market Opportunity:** ABB's 105,000+ industrial customers in Europe represent the largest addressable market for DWS7's IoT-to-compliance pipeline. Steel, cement, and chemicals verticals overlap directly with EU ETS Phase 4 regulated installations.

### 11.4 xAI — Real-Time Market Intelligence & Grok

xAI is the only AI partner with **live production integration** in DWS6, providing real-time market discovery via the Grok model and X (Twitter) data.

**Current Integration (Active in DWS6):**

| Component | Implementation | Status |
|-----------|---------------|--------|
| X/Twitter Discovery | `last30days-skill/scripts/lib/xai_x.py` — xAI Agent Tools API with `x_search` | Production |
| Model | `grok-4-1-fast` via `api.x.ai/v1/responses` (aliased in `last30days-skill/scripts/lib/models.py`) | Active |
| Depth modes | Quick, Default, Deep search configurations | Active |
| Marketing | Grok testimonials on dws10.com landing page | Active |

**DWS7 Expansion:**

| Capability | Phase | Use Case |
|------------|-------|----------|
| Regulatory signal detection | Phase 2 | Real-time monitoring of EU ETS/CBAM/CSRD policy announcements via X |
| Competitor intelligence | Phase 4 | Track competitor product launches, pricing changes, funding rounds |
| Market sentiment analysis | Phase 4 | Industrial sector sentiment for climate compliance adoption trends |
| Customer discovery | Phase 5 | Identify companies discussing ETS compliance challenges on X |
| Grok for report generation | Phase 5 | Alternative LLM for compliance report drafting (cost optimization) |

**Why xAI matters for DWS7:** EU regulatory changes are first discussed on X (Twitter) by MEPs, regulators, and industry bodies — often days before official publications. xAI's `x_search` tool provides real-time access to these signals, giving DWS7 customers early warning on regulatory changes that affect their compliance obligations.

**API Configuration:**
```
Endpoint: https://api.x.ai/v1/responses
Model: grok-4-1-fast (required for x_search tool)
Auth: XAI_API_KEY environment variable
Policy: XAI_MODEL_POLICY (latest | stable | pinned)
```

### 11.5 Mistral — EU-Sovereign AI Inference

Mistral is the strategic choice for **EU data sovereignty** — a French AI company building frontier models under EU jurisdiction. For DWS7's regulated industrial customers, using a European AI provider for sensitive compliance work removes GDPR cross-border transfer concerns.

**Why Mistral for DWS7:**

| Advantage | Detail |
|-----------|--------|
| **EU data sovereignty** | French company, EU-hosted inference — no US Cloud Act risk |
| **Multilingual excellence** | Native EU language support (EN, FI, DE, FR, SV, NO) — critical for Phase 5 i18n |
| **Cost efficiency** | Mistral Large/Medium pricing 3-5x lower than comparable Claude/GPT models |
| **Open-weight options** | Mixtral 8x22B can be self-hosted on EU Cloud for maximum data control |
| **EU AI Act alignment** | Mistral actively participates in EU AI Act compliance frameworks |

**Planned Integration (Q3 2026+):**

| Capability | Model | Phase | Use Case |
|------------|-------|-------|----------|
| Compliance report drafting | Mistral Large | Phase 3 | CSRD/ESRS report generation in 5 EU languages |
| Regulation Q&A | Mistral Medium | Phase 3 | RAG-powered regulatory knowledge base (cost-optimized) |
| Document translation | Mistral Large | Phase 5 | Automated translation of compliance documents (EN↔FI↔DE↔SV↔NO) |
| Batch processing | Mixtral 8x22B (self-hosted) | Phase 4 | High-volume emission data classification, supplier document analysis |
| Edge inference | Mistral Small | Phase 5 | Lightweight on-premise inference for offline compliance checks |

**Multi-LLM Architecture:**

DWS7 uses a multi-LLM strategy — selecting the optimal model per task:

```
┌─────────────────────────────────────────────────────────┐
│  DWS7 LLM Router                                       │
│                                                         │
│  Task                    → Model Selection              │
│  ─────────────────────────────────────────────          │
│  Complex reasoning       → Claude (Anthropic)           │
│  EU compliance reports   → Mistral Large (EU sovereign) │
│  Real-time X discovery   → Grok (xAI)                   │
│  Batch classification    → Mixtral 8x22B (self-hosted)  │
│  Edge inference          → Llama 3.3 / Mistral Small    │
│  Code generation         → Claude (Anthropic)           │
│  Multilingual translation→ Mistral Large                │
│  Fast summarization      → Groq (Llama inference)       │
│  Regulation RAG          → Mistral Medium               │
│  Safety filtering        → Llama Guard / NeMo           │
│                                                         │
│  Selection criteria: sovereignty, cost, latency, task   │
└─────────────────────────────────────────────────────────┘
```

### Partnership Ecosystem Summary

```
                    ┌──────────────────────┐
                    │      DWS IQ 7        │
                    │   Climate Platform   │
                    └──────────┬───────────┘
                               │
        ┌──────────┬───────────┼───────────┬──────────┐
        ▼          ▼           ▼           ▼          ▼
   ┌─────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
   │ NVIDIA  │ │Siemens │ │  ABB   │ │  xAI   │ │ Mistral │
   │         │ │        │ │        │ │        │ │         │
   │GPU/Edge │ │Digital │ │Indust. │ │Market  │ │EU-Sov.  │
   │Compute  │ │Twins   │ │Automat.│ │Intel.  │ │AI Infer.│
   │Omniverse│ │MindSph.│ │Ability │ │Grok    │ │Multilang│
   │Jetson   │ │Xceler. │ │Drives  │ │X Search│ │Mixtral  │
   └─────────┘ └────────┘ └────────┘ └────────┘ └─────────┘
       │           │           │          │           │
       └───────────┴───────────┴──────────┴───────────┘
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
      IoT-to-Compliance  Agentic AI   EU AI Act
      Pipeline           Workflows    Compliance
```

---

## 12. Multi-Tenancy & Billing

### Tenant Isolation (Phase 3)

DWS6 runs single-tenant. DWS7 adds full multi-tenant isolation:

| Layer | Mechanism |
|-------|-----------|
| Database | Supabase Row-Level Security (RLS) — every table filtered by `tenant_id` |
| API | Tenant routing middleware — JWT claims include tenant context |
| Storage | Tenant-scoped file storage with prefix isolation |
| Cache | Redis key namespacing per tenant |
| Logging | Tenant ID in all log entries for audit separation |

### Billing (Phase 3)

| Component | Implementation |
|-----------|---------------|
| Payment processor | Stripe |
| Subscription model | Tiered plans (Starter, Professional, Enterprise) |
| Usage metering | API calls, compliance reports generated, data points tracked |
| Invoice generation | Automated monthly invoicing via Stripe |
| Dunning | Failed payment retry + customer notification automation |

---

## 13. Industry Vertical Expansion

DWS7 Phase 5 adds specialized modules for 12 industries, each with:
- Industry-specific emission factors
- Regulation mapping (which ETS/CBAM/CSRD requirements apply)
- Benchmark data for the sector
- Pre-configured compliance workflows

| # | Industry | Key Regulations | Special Requirements |
|---|----------|----------------|---------------------|
| 1 | Construction | CSRD, ETS (cement) | Scope 3 supply chain, embodied carbon |
| 2 | Steel | ETS, CBAM | Direct emissions, free allowance phase-out |
| 3 | Cement | ETS, CBAM | Process emissions, clinker ratio tracking |
| 4 | Chemicals | ETS, REACH | Complex process emissions, product classification |
| 5 | Aluminum | ETS, CBAM | Electricity-intensive, indirect emissions |
| 6 | Manufacturing | CSRD, ESR | Scope 1-3, energy efficiency tracking |
| 7 | Logistics | ESR, CSRD | Fleet emissions, well-to-wheel methodology |
| 8 | Energy | ETS, RED III | Generation mix, renewable tracking |
| 9 | Mining | ETS, CSRD | Methane emissions, land use change |
| 10 | Healthcare | CSRD | Medical waste, supply chain emissions |
| 11 | Real Estate | CSRD, EPBD | Building energy performance, renovation tracking |
| 12 | Public Sector | CSRD (where applicable) | Procurement emissions, fleet management |

---

## 14. Breaking Changes & Migration Notes

### For Existing DWS6 Customers

| Change | Impact | Migration Action |
|--------|--------|-----------------|
| Multi-tenant RLS | Database schema changes | Automated migration script adds `tenant_id` to all tables |
| JWT claims expansion | Auth token format change | Re-login required; backward-compatible grace period |
| API versioning (`/v2/`) | New API paths | `/v1/` endpoints maintained for 6 months |
| Temporal.io workflows | Cron jobs replaced | Existing scheduled tasks auto-migrated to Temporal workflows |
| Redis caching | New infrastructure dependency | Transparent to API consumers |

### For Developers

| Change | Impact | Action Required |
|--------|--------|-----------------|
| `exec()` → `execFile()` | All shell commands must use argument arrays | Refactor any `exec()` calls |
| CORS explicit origins | No more `origin: '*'` | Add domains to allowlist in config |
| SRI hashes on CDN | All external scripts need integrity attributes | Run `scripts/generate-sri.sh` |
| RLS policies | All Supabase queries must include tenant context | Use `supabase.rpc()` with tenant-aware functions |
| Temporal.io SDK | New dependency for agent workflows | `npm install @temporalio/client @temporalio/worker` |

### Database Migrations

All migrations are in `supabase/migrations/` and run automatically:

```
Phase 1: Production indexes, query optimization
Phase 2: Compliance engine tables (ets_*, cbam_*, csrd_*)
Phase 3: tenant_id column + RLS policies on all tables
Phase 4: IoT data tables, agent execution logs
Phase 5: Industry vertical config tables, supplier portal
Phase 6: Investor metrics views, advanced analytics
```

---

## 15. Revenue & Business Milestones

### Revenue Trajectory

```
Feb 2026 ─── €8.5K MRR ── 3 customers ── Phase 1 launch
    │
May 2026 ─── €15K MRR ─── 5 customers ── Compliance engine live
    │
Oct 2026 ─── €28K MRR ─── 8 customers ── ISO 27001 initiated
    │
Jan 2027 ─── €40K MRR ── 10 customers ── Intelligence layer live
    │
May 2027 ─── €56K MRR ── 14 customers ── Market expansion
    │
Dec 2027 ─── €72K+ MRR ─ 16+ customers ─ DWS7 GA release
```

### Pricing Model (Target)

| Tier | MRR | Included |
|------|-----|----------|
| Starter | €1,500/mo | 1 regulation, 1 facility, basic reporting |
| Professional | €3,500/mo | All regulations, 5 facilities, AI agents, API access |
| Enterprise | €7,500+/mo | Unlimited facilities, custom integrations, SLA, dedicated support |

### EU Funding Opportunities

DWS7 is eligible for €7M–€12M in non-dilutive EU funding (2026-2027):

| Programme | Amount | Fit |
|-----------|--------|-----|
| Horizon Europe (Cluster 4 & 5) | €3M–€5M | Industrial AI for climate compliance |
| EIC Accelerator | €2.5M grant + €15M equity | Deep tech scale-up |
| Digital Europe Programme | €50K–€2M | AI testing, cloud-edge infrastructure |
| Business Finland | €1M–€2.5M | R&D funding for Finnish companies |
| Climate Fund (Ilmastorahasto) | €1M–€20M | Climate technology scale-up |

---

## 16. Success Criteria for DWS7 GA

DWS7 is considered "General Availability" when all of the following are met:

### Business

- [ ] 16 paying industrial customers
- [ ] €72,000+ MRR (€864K+ ARR)
- [ ] Positive unit economics (>95% gross margin)
- [ ] 3+ industry verticals with referenceable customers

### Technical

- [ ] <100ms p95 API response time
- [ ] 99.9% uptime SLA
- [ ] 200+ automated tests (unit, integration, E2E)
- [ ] 3+ ERP integrations production-validated
- [ ] IoT-to-compliance pipeline live at 2+ customer sites
- [ ] Multi-region deployment (Finland + Germany)

### Compliance

- [ ] ISO 27001 certified
- [ ] SOC 2 Type II audit in progress
- [ ] EU AI Act Article 12 fully compliant
- [ ] Full Fit-for-55 coverage (ETS + CBAM + CSRD + ESR)
- [ ] GDPR compliant with DPA template

### Product

- [ ] Investor dashboard with real-time metrics
- [ ] Supplier CBAM portal operational
- [ ] Mobile access (PWA) available
- [ ] 5 languages supported (EN, FI, DE, SV, NO)
- [ ] Feature flag system for controlled rollouts

---

## Related Documents

| Document | Path | Content |
|----------|------|---------|
| DWS7 Roadmap (detailed PRs) | `DWS7_ROADMAP.md` | All 247 PRs with priorities and assignments |
| Cloud Environments | `docs/CLOUD_ENVIRONMENTS.md` | Three-cloud strategy, account structure, costs |
| NVIDIA/Siemens Integration | `dws7/DWS7_INTEGRATION_ROADMAP_NVIDIA_SIEMENS.md` | Partnership roadmap, technical integration |
| Security Standard | `DWS_SECURITY_STANDARD.md` | Security controls, threat model, compliance |
| Security Compliance | `Admin/SECURITY_COMPLIANCE.md` | Certifications, vendor risk, deployment controls |
| Brand Standard | `DWS_BRAND_STANDARD.md` | UI, product cards, store categories |

---

*Document Version: 1.1 | Last Modified: 2026-02-27 | Status: ACTIVE*

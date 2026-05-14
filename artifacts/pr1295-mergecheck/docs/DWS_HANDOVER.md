# DWS IQ 6 — Client Handover Document / Asiakkaan käyttöönottodokumentti

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/create-handover-documentation-kJunm | Date: 24.02.2026 | Changes: Initial creation — client handover document with gap analysis, checklists, SLA, training plan, and operational procedures

Session Links & References:
  - Claude Code (claude/create-handover-documentation-kJunm): https://github.com/blogtheristo/dws6/commits/claude/create-handover-documentation-kJunm

Document Status:
  - Created: 24.02.2026
  - Last Modified: 24.02.2026
  - Language: English & Finnish (bilingual)
  - Languages Available: English, Suomi
  - Publication Status: ACTIVE

***

## Table of Contents

1. [Executive Summary / Yhteenveto](#1-executive-summary--yhteenveto)
2. [Delivery Scope / Toimituksen laajuus](#2-delivery-scope--toimituksen-laajuus)
3. [System Architecture Overview / Järjestelmäarkkitehtuuri](#3-system-architecture-overview--järjestelmäarkkitehtuuri)
4. [Environment Handover / Ympäristöjen luovutus](#4-environment-handover--ympäristöjen-luovutus)
5. [Credentials & Access / Tunnukset ja pääsy](#5-credentials--access--tunnukset-ja-pääsy)
6. [Integration Points / Integraatiopisteet](#6-integration-points--integraatiopisteet)
7. [Acceptance Criteria / Hyväksymiskriteerit](#7-acceptance-criteria--hyväksymiskriteerit)
8. [Training Plan / Koulutussuunnitelma](#8-training-plan--koulutussuunnitelma)
9. [Operational Procedures / Käyttötoimenpiteet](#9-operational-procedures--käyttötoimenpiteet)
10. [Support & SLA / Tuki ja palvelutaso](#10-support--sla--tuki-ja-palvelutaso)
11. [Known Limitations / Tunnetut rajoitukset](#11-known-limitations--tunnetut-rajoitukset)
12. [Rollback & Contingency / Palautus ja varasuunnitelma](#12-rollback--contingency--palautus-ja-varasuunnitelma)
13. [Data Migration / Tietojen siirto](#13-data-migration--tietojen-siirto)
14. [Change Management / Muutoshallinta](#14-change-management--muutoshallinta)
15. [What Is Missing / Mitä puuttuu](#15-what-is-missing--mitä-puuttuu)
16. [Sign-Off / Hyväksyntä](#16-sign-off--hyväksyntä)

---

## 1. Executive Summary / Yhteenveto

**DWS IQ 6** is an enterprise AI orchestration platform for EU Fit for 55 climate compliance, covering ETS, CBAM, CSRD, EPBD, ESR, LULUCF, ReFuelEU, and NIS2 across 16 EU-regulated industries.

This document defines the handover package from the development team (Lifetime Oy) to the client's operational team. It covers what is delivered, what remains open, how to operate the system, and what support is available during and after go-live.

**DWS IQ 6** on teollinen AI-alusta EU:n Fit for 55 -ilmastosääntelyyn. Tämä dokumentti määrittää luovutuspaketin kehitystiimiltä (Lifetime Oy) asiakkaan operatiiviselle tiimille: mitä toimitetaan, mikä on kesken, miten järjestelmää operoidaan ja millainen tuki on käytettävissä.

### Delivery Summary

| Item | Status | Notes |
|------|--------|-------|
| Platform backend (EU Cloud) | Delivered | Google Cloud Run europe-north1 |
| Database (Supabase) | Delivered | EU-hosted, pgvector, RLS enabled |
| Frontend dashboard (Firehorse v9) | Delivered | React 19 + Vite + TailwindCSS |
| Public websites (dws6.com, dws10.com) | Delivered | Cloudflare Pages/Workers |
| AI agents (Claude, Gemini, Groq) | Delivered | Multi-agent orchestration |
| MCP servers | Delivered | Logistics, Construction, Compliance |
| ERP integrations | Partial | SAP, IFS, Dynamics connectors exist; customer-specific config needed |
| Mobile app (Firehorse) | Ready for deploy | React Native, Google Play listing prepared |
| Documentation | Delivered | 15+ admin manuals, architecture docs, security docs |
| EU AI Act compliance layer | Roadmap Q2 2026 | Article 12 logging framework planned |

---

## 2. Delivery Scope / Toimituksen laajuus

### 2.1 Included in Delivery

**Platform Components:**
- DWS IQ 6 multi-agent AI orchestration engine
- Firehorse Suite (Report, Automation, ContentMS, Omnichannel)
- Lifetime World Model (Climate LLM, 15,000+ EU regulations indexed)
- MCP (Model Context Protocol) hub and domain-specific servers
- Dashboard (Firehorse v9-react) with real-time monitoring

**Infrastructure:**
- Google Cloud Run backend (europe-north1, Finland)
- Supabase database with pgvector embeddings
- Cloudflare Pages/Workers for public-facing sites
- CI/CD pipelines (15 GitHub Actions workflows)
- Automated daily backups (sites + sessions)

**Documentation:**
- Admin Manual (master) + 12 domain-specific manuals
- Architecture documentation (12-phase series)
- Security compliance documentation
- Cloud environments guide
- DPA (Data Processing Agreement)

**Security:**
- JWT authentication with Helmet
- Row-level security (Supabase RLS)
- CORS with explicit origin lists
- SRI hashes on CDN dependencies
- Automated security scanning (Bandit, Safety, npm audit)

### 2.2 Not Included (Client Responsibility)

- Customer-specific ERP data mapping (SAP S/4HANA, IFS Cloud, Dynamics 365)
- Customer-specific ESG platform configuration (Worldfavor, PositionGreen)
- Production API keys for customer's own services
- Customer's internal network/firewall configuration
- End-user devices and browsers
- Customer's own IT helpdesk staffing

---

## 3. System Architecture Overview / Järjestelmäarkkitehtuuri

```
┌─────────────────────────────────────────────────────────────────┐
│                    BRAIN — DWS IQ 6 Platform                    │
│         Multi-agent AI Orchestration & Decision Engine          │
│        (EU Google Cloud + Groq + Enterprise Private Cloud)      │
├─────────────────────────────────────────────────────────────────┤
│                   MEMORY — Lifetime World Model                 │
│    Climate LLM + Enterprise Integrations (SAP, ABB, NVIDIA)     │
├─────────────────────────────────────────────────────────────────┤
│              BODY — 16 Industrial Solutions                     │
│   Firehorse Report | Automation | Content DMS | Omnichannel     │
├─────────────────────────────────────────────────────────────────┤
│                  HANDS — Lifetime Fleet                          │
│           Robots • Vehicles • Drones • IoT                      │
└─────────────────────────────────────────────────────────────────┘
```

**Key Technology Stack:**

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + Vite + TailwindCSS | 19.2 / 7.2 / 4.1 |
| Backend | Express + TypeScript | 4.19 / 5.9 |
| Database | Supabase (PostgreSQL + pgvector) | Latest |
| AI/LLM | Claude (Anthropic), Gemini, Groq | Latest |
| Agent Protocol | MCP (Model Context Protocol) | 1.x |
| Edge/CDN | Cloudflare Workers/Pages | — |
| Orchestration | Temporal.io | — |
| Edge AI | NVIDIA Jetson Orin Nano | — |

---

## 4. Environment Handover / Ympäristöjen luovutus

### 4.1 Environments

| Environment | Provider | Region | Purpose | Status |
|-------------|----------|--------|---------|--------|
| **US Cloud (Public)** | Cloudflare | Global | Landing pages, store, CDN | Active |
| **EU Cloud (Backend)** | Google Cloud Run + Supabase | europe-north1 (Finland) | API, AI agents, database | Active |
| **Full Sovereignty (Aegis)** | EU Cloud overlay | EU-only | Article 12 compliance | Planned Q2 2026 |
| **Hetzner V3** | Hetzner Helsinki | Finland | Jitsi Meet, email | Active |

### 4.2 DNS & Domains

| Domain | Registrar | DNS Provider | Target |
|--------|-----------|-------------|--------|
| dws6.com | — | Cloudflare | Cloudflare Pages |
| dws10.com | — | Cloudflare | Cloudflare Pages |
| onelifetime.world | — | Cloudflare | Cloudflare Pages |
| lifetime.fi | — | — | Email, Hetzner |

### 4.3 Handover Checklist

- [ ] Cloud account ownership transferred or shared
- [ ] DNS management access provided
- [ ] Cloudflare account team member added
- [ ] Supabase project access granted
- [ ] Google Cloud IAM roles assigned
- [ ] GitHub repository access configured (read/write)
- [ ] CI/CD secrets documented in Secret Manager
- [ ] SSL certificates verified (auto-renew via Cloudflare)

---

## 5. Credentials & Access / Tunnukset ja pääsy

> **Security note:** Actual credentials are NEVER stored in this document. All secrets are in `.env` files and cloud Secret Managers.

### 5.1 Access Matrix

| System | Access Level | Granted To | Method |
|--------|-------------|------------|--------|
| GitHub (blogtheristo/dws6) | Write | Client dev team | GitHub team invite |
| Supabase Dashboard | Admin | Client DBA | Supabase team invite |
| Google Cloud Console | Editor | Client DevOps | IAM role binding |
| Cloudflare Dashboard | Super Admin | Client IT admin | Cloudflare team invite |
| Anthropic API | API key | Application only | Secret Manager |
| Groq API | API key | Application only | Secret Manager |

### 5.2 Key Rotation Schedule

| Secret | Rotation Frequency | Owner |
|--------|-------------------|-------|
| JWT_SECRET | Every 90 days | Client DevOps |
| API keys (Anthropic, Groq, Google) | Every 180 days | Client DevOps |
| Supabase service key | On incident only | Client DBA |
| Cloudflare API token | Every 180 days | Client IT admin |

---

## 6. Integration Points / Integraatiopisteet

### 6.1 Active Integrations

| Integration | Direction | Protocol | Status | Location |
|-------------|-----------|----------|--------|----------|
| Supabase (DB, Auth, Realtime) | Bidirectional | REST/WebSocket | Active | `src/` |
| Claude (Anthropic) | Outbound | REST API | Active | `src/mcp/` |
| Google Gemini | Outbound | REST API | Active | `src/` |
| Groq API | Outbound | REST API | Active | `src/` |
| Cloudflare Workers | Bidirectional | HTTP/Edge | Active | `dws10.com/`, `dws6.com/` |
| Resend (Email) | Outbound | REST API | Active | `src/` |

### 6.2 Connectors Available (Require Customer Configuration)

| Integration | Code Location | Customer Action Required |
|-------------|---------------|------------------------|
| SAP S/4HANA | `src/integrations/erp/sap/` | Provide API endpoint, credentials, field mapping |
| IFS Cloud | `src/integrations/erp/ifs/` | Provide API endpoint, credentials, field mapping |
| Microsoft Dynamics 365 | `src/integrations/erp/dynamics/` | Provide API endpoint, credentials, field mapping |
| Monitor ERP | `src/integrations/erp/` | Provide API endpoint, credentials |
| Visma | `src/integrations/erp/` | Provide API endpoint, credentials |
| Worldfavor (ESG) | `src/integrations/esg/worldfavor/` | Provide API key, workspace ID |
| PositionGreen (ESG) | `src/integrations/esg/positiongreen/` | Provide API key, organization ID |

### 6.3 Data Flow Diagram

```
Customer ERP (SAP/IFS/Dynamics)
        │
        ▼
  DWS IQ 6 Backend (Cloud Run)
        │
   ┌────┼────┬────────┐
   ▼    ▼    ▼        ▼
Claude  Groq Gemini  Supabase (DB)
   │    │    │        │
   └────┴────┘        ▼
        │         Dashboard (React)
        ▼              │
   MCP Servers         ▼
   (Domain Logic)   Cloudflare (CDN)
        │              │
        ▼              ▼
   Compliance      End Users
   Reports         (Browser)
```

---

## 7. Acceptance Criteria / Hyväksymiskriteerit

### 7.1 Technical Acceptance

| # | Criterion | Target | Measurement Method |
|---|-----------|--------|-------------------|
| T1 | System availability | ≥99.5% uptime | Cloud Run monitoring |
| T2 | API response time (p95) | <2 seconds | OpenTelemetry traces |
| T3 | Dashboard load time | <3 seconds | Lighthouse audit |
| T4 | AI agent accuracy | ≥90% correct responses | Reasoning test suite |
| T5 | Unit test coverage | ≥80% | Vitest coverage report |
| T6 | Security scan | Zero critical vulnerabilities | npm audit + Bandit |
| T7 | Database backup | Daily automated | Supabase backup logs |
| T8 | SSL/TLS | All endpoints HTTPS | SSL Labs scan |

### 7.2 Functional Acceptance

| # | Criterion | Description |
|---|-----------|-------------|
| F1 | User login and authentication | JWT-based login, session management, role-based access |
| F2 | Dashboard data rendering | Real-time data display, charts, compliance status |
| F3 | AI compliance queries | Natural language queries return accurate regulatory answers |
| F4 | Report generation | Automated CSRD/ETS/CBAM reports with correct data |
| F5 | Alert notifications | Email alerts for compliance deadlines, anomalies |
| F6 | ERP data import | Data flows correctly from customer ERP (once configured) |
| F7 | Multi-language support | Finnish and English UI |

### 7.3 User Acceptance Testing (UAT) Process

1. **Preparation** (1 week): Client test team identified, test data loaded, test plan agreed
2. **Execution** (2 weeks): Client executes test cases against criteria above
3. **Defect resolution** (1 week): Critical defects fixed, retested
4. **Sign-off**: Client signs acceptance form (Section 16)

---

## 8. Training Plan / Koulutussuunnitelma

### 8.1 Training Sessions

| # | Session | Audience | Duration | Format |
|---|---------|----------|----------|--------|
| 1 | **Platform overview** | All users | 2 hours | On-site / Teams |
| 2 | **Dashboard & daily operations** | End users (5–15 persons) | 3 hours | Hands-on workshop |
| 3 | **Compliance reporting** | Compliance officers | 2 hours | Hands-on workshop |
| 4 | **Admin & configuration** | IT admin team (2–3 persons) | 4 hours | Hands-on workshop |
| 5 | **ERP integration setup** | IT / ERP team | 3 hours | Technical session |
| 6 | **Security & incident response** | IT security team | 2 hours | Walkthrough |
| 7 | **AI agent usage & prompt best practices** | Power users | 2 hours | Workshop |

### 8.2 Training Materials Delivered

| Material | Format | Location |
|----------|--------|----------|
| Admin Manual (master) | Markdown / PDF | `Admin/ADMIN_MANUAL.md` |
| Authentication Manual | Markdown / PDF | `Admin/ADMIN_MANUAL_AUTHENTICATION.md` |
| Supabase Manual | Markdown / PDF | `Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md` |
| Testing Manual | Markdown / PDF | `Admin/ADMIN_MANUAL_TESTING.md` |
| Dashboard V8 Manual | Markdown / PDF | `Admin/ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md` |
| Store Admin Manual (EN/FI) | Markdown / PDF | `dws10.com/docs/STORE_ADMIN_MANUAL_*.md` |
| Cloud Environments Guide | Markdown / PDF | `docs/CLOUD_ENVIRONMENTS.md` |
| Security Compliance | Markdown / PDF | `Admin/SECURITY_COMPLIANCE.md` |

### 8.3 Post-Training Support

- **Week 1–2 after go-live:** Dedicated support channel (Slack/Teams), 4-hour response SLA
- **Week 3–4:** Standard support, daily check-in calls
- **Month 2+:** Standard SLA (see Section 10)

---

## 9. Operational Procedures / Käyttötoimenpiteet

### 9.1 Daily Operations

| Task | Responsible | Frequency | Tool |
|------|-------------|-----------|------|
| Monitor system health | Client IT | Daily | Cloud Run dashboard |
| Check AI agent logs | Client IT | Daily | Google Cloud Logging |
| Review compliance alerts | Compliance team | Daily | Dashboard notifications |
| Verify backup completion | Client DBA | Daily | Supabase + GitHub Actions |

### 9.2 Weekly Operations

| Task | Responsible | Frequency |
|------|-------------|-----------|
| Run `npm audit` for dependency vulnerabilities | Client DevOps | Weekly |
| Review error rate trends | Client IT | Weekly |
| Check API token usage / cost | Client IT | Weekly |
| Update compliance calendar | Compliance team | Weekly |

### 9.3 Monthly Operations

| Task | Responsible | Frequency |
|------|-------------|-----------|
| Security scan (Bandit + Safety) | Client Security | Monthly |
| Review and rotate API keys (if scheduled) | Client DevOps | Per schedule (Section 5.2) |
| Performance review (response times, uptime) | Client IT | Monthly |
| Review AI model accuracy metrics | Client + Lifetime | Monthly |

### 9.4 Deployment Procedure

```bash
# 1. Pull latest from main
git pull origin main

# 2. Run tests
npm run test

# 3. Build
npm run build

# 4. Deploy backend (Cloud Run)
gcloud run deploy dws6-backend --source . --region europe-north1

# 5. Deploy frontend (Cloudflare Pages)
# Automatic via GitHub push to main → Cloudflare Pages
```

Full deployment runbook: `Admin/ADMIN_MANUAL.md` → [Deployment Procedures](#deployment-procedures)

---

## 10. Support & SLA / Tuki ja palvelutaso

### 10.1 Support Tiers

| Tier | Scope | Response Time | Resolution Time |
|------|-------|--------------|-----------------|
| **P1 — Critical** | System down, data loss, security breach | 1 hour | 4 hours |
| **P2 — High** | Major feature broken, significant performance degradation | 4 hours | 1 business day |
| **P3 — Medium** | Minor feature issue, workaround available | 1 business day | 3 business days |
| **P4 — Low** | Enhancement request, cosmetic issue, question | 2 business days | Next release |

### 10.2 Support Channels

| Channel | Use For | Availability |
|---------|---------|-------------|
| Email: `risto@onelifetime.world` | All priority levels | Business hours (Mon–Fri 09:00–17:00 EET) |
| Teams/Slack (shared channel) | P1, P2 during hypercare | Hypercare period (first 4 weeks) |
| GitHub Issues | P3, P4, feature requests | 24/7 (async) |

### 10.3 Hypercare Period

**Duration:** 4 weeks from go-live date

During hypercare:
- Daily stand-up call (15 min) between Lifetime and client teams
- P1/P2 response time reduced to 30 minutes
- On-call Lifetime engineer available outside business hours
- Immediate patches deployed for critical issues

### 10.4 Post-Hypercare Maintenance

| Service | Frequency | Included |
|---------|-----------|----------|
| Security patches | As needed | Yes |
| Dependency updates | Monthly | Yes |
| AI model updates | Quarterly | Yes |
| Feature development | Per agreement | Separate SOW |

---

## 11. Known Limitations / Tunnetut rajoitukset

| # | Limitation | Impact | Mitigation / Roadmap |
|---|-----------|--------|---------------------|
| L1 | EU AI Act compliance layer not yet implemented | No Article 12 logging | Planned Q2 2026 |
| L2 | ERP connectors require customer-specific configuration | Not plug-and-play | Professional services engagement |
| L3 | Mobile app not yet published on Google Play | No mobile access | Build & deploy guide ready, 2–3 weeks to publish |
| L4 | Omnibus regulation pivot (Jan 2026) may require rule updates | Regulation changes | Lifetime World Model updated as regulations finalize |
| L5 | Edge AI (Jetson Orin Nano) in pilot phase | Limited on-premise AI | Expanding in DWS 7 roadmap |
| L6 | Maximum 16 concurrent AI agent sessions per customer | Throughput ceiling | Horizontal scaling available on request |

---

## 12. Rollback & Contingency / Palautus ja varasuunnitelma

### 12.1 Rollback Procedure

If a deployment causes critical issues:

```bash
# 1. Identify the last stable revision
gcloud run revisions list --service dws6-backend --region europe-north1

# 2. Route traffic to previous stable revision
gcloud run services update-traffic dws6-backend \
  --to-revisions=REVISION_NAME=100 \
  --region europe-north1

# 3. For Cloudflare Pages: revert via Cloudflare dashboard
#    Deployments → Select previous deployment → "Rollback to this deploy"
```

### 12.2 Database Rollback

- Supabase point-in-time recovery available (last 7 days)
- Daily backups retained for 30 days (GitHub Actions)
- Contact Lifetime support for database restore assistance

### 12.3 Contingency Plan

| Scenario | Action | RTO | RPO |
|----------|--------|-----|-----|
| Backend service failure | Automatic Cloud Run restart + alert | 5 min | 0 |
| Database corruption | Supabase point-in-time recovery | 1 hour | 1 hour |
| Cloudflare outage | DNS failover to origin (manual) | 30 min | 0 |
| AI service unavailable | Graceful degradation (cached responses) | Immediate | N/A |
| Complete region failure | Deploy to backup region (Scaleway fr-par) | 4 hours | 1 hour |

---

## 13. Data Migration / Tietojen siirto

### 13.1 Migration Scope

| Data Source | Migration Method | Responsible |
|-------------|-----------------|-------------|
| Existing compliance data (spreadsheets) | CSV import via admin UI | Client + Lifetime |
| ERP master data | API connector (once configured) | Client ERP team |
| Historical emission reports | Manual upload or batch import | Client compliance team |
| User accounts | Supabase Auth bulk import | Client IT + Lifetime |

### 13.2 Migration Checklist

- [ ] Source data inventory completed
- [ ] Data quality assessment done (duplicates, missing fields)
- [ ] Field mapping document approved
- [ ] Test migration executed in staging environment
- [ ] Data validation after test migration (record counts, checksums)
- [ ] Production migration scheduled (off-hours)
- [ ] Post-migration validation sign-off

### 13.3 Data Residency

All data is stored within the EU:
- **Database:** Supabase EU (PostgreSQL in europe-north1)
- **File storage:** Supabase Storage (EU)
- **Backups:** GitHub Actions artifacts (EU pipeline)
- **CDN cache:** Cloudflare (global edge, origin in EU)

GDPR compliance: See `docs/DPA_DATA_PROCESSING_AGREEMENT.md`

---

## 14. Change Management / Muutoshallinta

### 14.1 Process Changes for Users

Deploying DWS IQ 6 typically changes these operational processes:

| Before (Manual) | After (DWS IQ 6) | Impact |
|-----------------|-------------------|--------|
| Manual compliance tracking (spreadsheets) | Automated real-time monitoring | Compliance officers shift from data entry to oversight |
| Periodic regulatory checks | Continuous AI-driven alerts | Earlier detection of compliance gaps |
| Manual ETS/CBAM report writing | AI-generated report drafts | Report writers become reviewers |
| Reactive audit preparation | Always audit-ready data | Reduced audit stress and overtime |
| Separate ERP and compliance systems | Integrated data flow | IT team manages one fewer manual sync |

### 14.2 Change Management Actions

| # | Action | Owner | Timeline |
|---|--------|-------|----------|
| 1 | Identify affected roles and communicate changes | Client HR/Management | 4 weeks before go-live |
| 2 | Update job descriptions where applicable | Client HR | 2 weeks before go-live |
| 3 | Conduct training sessions (Section 8) | Lifetime + Client | 1–2 weeks before go-live |
| 4 | Designate internal champions / super-users | Client Management | 1 week before go-live |
| 5 | Establish feedback channel for user issues | Client IT | Go-live day |
| 6 | Weekly retrospective during hypercare | Client + Lifetime | Weeks 1–4 after go-live |
| 7 | Process refinement based on feedback | Client process owner | Month 2+ |

### 14.3 Communication Plan

| When | What | To Whom | Channel |
|------|------|---------|---------|
| 4 weeks before | Announcement: new system coming | All affected staff | Email + intranet |
| 2 weeks before | Training schedule published | End users + IT | Email |
| 1 week before | Quick-start guide distributed | End users | Email + printed |
| Go-live day | "System is live" announcement | All staff | Email + Slack/Teams |
| Week 1 | Daily tips / FAQ | End users | Slack/Teams channel |
| Week 2–4 | Weekly status update | Management | Email |

---

## 15. What Is Missing / Mitä puuttuu

### 15.1 Critical Gaps (Must Fix Before Go-Live)

| # | Gap | Description | Priority | Est. Effort |
|---|-----|-------------|----------|-------------|
| G1 | **Client-specific ERP configuration** | SAP/IFS/Dynamics connectors exist but need customer field mapping, credentials, and endpoint configuration | Critical | 2–4 weeks |
| G2 | **Production API keys** | Customer needs their own Anthropic/Groq API keys or a shared billing arrangement | Critical | 1 day |
| G3 | **User Acceptance Testing (UAT)** | No formal UAT cycle has been executed with real client users | Critical | 2–3 weeks |
| G4 | **Client-specific compliance rules** | Industry-specific compliance thresholds and reporting templates need customization | Critical | 1–2 weeks |

### 15.2 High Priority Gaps (Should Fix Within 30 Days of Go-Live)

| # | Gap | Description | Priority | Est. Effort |
|---|-----|-------------|----------|-------------|
| G5 | **Operational runbook** | Detailed step-by-step runbook for common scenarios (restart service, scale up, investigate errors) | High | 3 days |
| G6 | **Incident response plan (client-facing)** | Documented escalation paths, contact matrix, severity definitions customized for client org | High | 2 days |
| G7 | **Performance benchmarks / SLOs** | Baseline performance metrics not yet measured on production with real data | High | 1 week |
| G8 | **End-user quick-start guide** | Simple 2-page guide for non-technical users (login, navigate dashboard, request report) | High | 2 days |
| G9 | **Mobile app deployment** | React Native app ready but not published to Google Play | High | 2–3 weeks |

### 15.3 Medium Priority Gaps (Fix Within 90 Days)

| # | Gap | Description | Priority | Est. Effort |
|---|-----|-------------|----------|-------------|
| G10 | **EU AI Act compliance layer** | Article 12 automatic logging not yet implemented | Medium | Q2 2026 roadmap |
| G11 | **Multi-tenant isolation** | Current architecture is single-tenant; multi-tenant requires architectural changes | Medium | 4–6 weeks |
| G12 | **Automated smoke tests** | No automated post-deployment smoke test suite for production | Medium | 1 week |
| G13 | **Client admin training video** | Recorded training for onboarding new admins without live session | Medium | 3 days |
| G14 | **API documentation (OpenAPI)** | OpenAPI spec mentioned in architecture but not generated as standalone deliverable | Medium | 3 days |
| G15 | **Disaster recovery drill** | DR procedure documented but not tested end-to-end | Medium | 1 day |

### 15.4 Summary

```
CRITICAL (block go-live):     4 gaps  →  resolve before go-live
HIGH (first 30 days):         5 gaps  →  resolve during hypercare
MEDIUM (first 90 days):       6 gaps  →  resolve post-stabilization
                             ──────
TOTAL:                       15 gaps
```

---

## 16. Sign-Off / Hyväksyntä

### 16.1 Delivery Acceptance

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **Client Project Manager** | _________________ | _________________ | ___.___.2026 |
| **Client IT Lead** | _________________ | _________________ | ___.___.2026 |
| **Client Compliance Officer** | _________________ | _________________ | ___.___.2026 |
| **Lifetime CEO (Delivery)** | Risto Paarni | _________________ | ___.___.2026 |
| **Lifetime Tech Lead** | _________________ | _________________ | ___.___.2026 |

### 16.2 Acceptance Conditions

By signing above, the parties confirm:

1. The delivery scope (Section 2) has been reviewed and understood
2. Known limitations (Section 11) are acknowledged
3. The gap list (Section 15) has been reviewed and prioritized jointly
4. The support and SLA terms (Section 10) are agreed
5. Training has been completed or scheduled (Section 8)
6. Access credentials have been transferred (Section 5)

### 16.3 Warranty Period

**Duration:** 90 days from sign-off date

During the warranty period, Lifetime Oy will fix at no additional cost:
- Defects in delivered functionality (Sections 2.1 and 7)
- Security vulnerabilities rated Critical or High
- Data integrity issues caused by platform bugs

Not covered under warranty:
- Customer-specific configuration changes
- Issues caused by customer modifications to the codebase
- Third-party service outages (Anthropic, Groq, Google Cloud, Cloudflare)
- Feature requests beyond the agreed delivery scope

---

*Document generated as part of DWS IQ 6 Phase 10: Delivery & Launch.*
*See also: `docs/architecture/10-DELIVERY-LAUNCH.md` for the full delivery plan.*

# DWS7 ROADMAP — From Pilot to 16 Paying Industrial Customers

> **Document Standard:** DWS Document Standard v2.0
> **Version:** 1.1.0
> **Status:** Living Document (auto-tracked weekly)
> **Created:** 2026-02-12
> **Updated:** 2026-03-01 — Added sovereign on-premise AI gap, GN100 infrastructure asset, Blackwell watch signal (Claude Code, claude/dws6-dws7-update-doc-I2Cgk)
> **Timeline:** Q1 2026 → Q4 2027 (22 months)
> **Target:** DWS IQ 7 — Production-grade, 16 industrial customers, investors signed, profitable

## VERSION AND AGENT HISTORY

Version: 1.1.0

- Date: 12.02.2026 — Initial draft.
- Date: 01.03.2026 — Added sovereign on-premise AI gap, GN100 infrastructure asset, Blackwell watch signal (Claude Code, claude/dws6-dws7-update-doc-I2Cgk)

---

## Executive Summary

DWS IQ 6 is a pilot-phase climate intelligence platform with strong foundations: Express/TypeScript backend, React 19 dashboard, 6 AI agents, MCP orchestration, ERP connectors, 60+ landing pages, and 15 CI/CD workflows. But the gap between "pilot with €7k MRR" and "production platform with 16 paying customers and growing profits" requires disciplined execution across **247 pull requests** organized in 6 phases.

**Why 247, not 500:** Every PR here represents real, necessary work. Inflating to 500 would require splitting atomic changes or inventing unnecessary features. 247 PRs over 22 months = ~11 PRs/week — ambitious but achievable with AI-assisted development.

---

## Competitive Positioning

DWS7 exploits **4 gaps no competitor fills:**

| Gap | Opportunity | Competitors Missing It |
|-----|-------------|----------------------|
| **Unified Fit-for-55 platform** | Single platform for ETS + CBAM + CSRD + ESR across 25+ industries | Everyone specializes in one regulation |
| **IoT-to-compliance pipeline** | Sensor data → verified regulatory filings, no manual steps | Schneider does IoT, Persefoni does reporting — nobody bridges them |
| **Agentic AI compliance** | Multi-agent autonomous compliance checking + report generation | CO2 AI and Schneider are exploring; nobody has shipped it |
| **Sovereign on-premise AI** | Compliance workloads that cannot leave the customer's premises — local inference on dedicated hardware, EU data residency guaranteed by physics not policy | Every SaaS competitor routes data through US cloud APIs; nobody ships on-premise AI inference as a standard offering |

**Market size:** Carbon accounting software market grows from $24.3B (2025) to $191.2B (2035) at 22.9% CAGR. Only 13.5% of EU businesses use AI — massive adoption runway.

---

## Infrastructure Assets

Physical and cloud infrastructure already in place entering Phase 1. These are not roadmap PRs — they are existing capital that de-risks execution.

### Compute

| Asset | Specs | Role | Status |
|-------|-------|------|--------|
| **Acer Veriton GN100** | NVIDIA Blackwell GPU, 120 GiB RAM, 20 CPU cores, Ubuntu 24.04 LTS | Local AI inference, Climate LLM fine-tuning (PR 161), sovereign on-premise product offering | In-house, operational. See `Admin/Acer-Veriton-GN100/README.md` |
| **NVIDIA Jetson Orin Nano** | Edge AI module, JetPack SDK | Factory/site edge agent deployment (PR 154), offline IoT-to-compliance | Roadmap target deployment |

### Cloud

| Asset | Provider | Role |
|-------|----------|------|
| EU Cloud backend | Google Cloud Run (`europe-north1`) | Express API, AI agents, EU data residency |
| Database | Supabase (EU) | PostgreSQL + Auth + Realtime + pgvector |
| CDN / Edge | Cloudflare Pages + Workers | Landing pages, dashboard SPA, edge API |
| Sovereignty audit layer | EU Cloud overlay | EU AI Act Article 12 logging, reasoning lineage (Phase 2+) |

### What GN100 enables for the roadmap

- **PR 161 (Climate LLM):** Fine-tune Llama 3.3 70B locally — no cloud training cost, no data leaving premises
- **Sovereign on-premise AI gap:** The 4th competitive gap (above) is real because this hardware already exists
- **Groq risk mitigation:** Immediate fallback inference for Llama 3.3 70B (~40 GB VRAM) and Mistral Large (~45 GB VRAM) without cloud dependency
- **EU AI Act Article 12:** All local inference workloads log to sovereignty audit layer — compliance-by-default

---

## Phase Overview

| Phase | Period | Theme | PRs | Milestone |
|-------|--------|-------|-----|-----------|
| **1** | Feb–Apr 2026 | **Launch & Stabilize** | 45 | V1.0 production launch, first 3 paying customers |
| **2** | May–Jul 2026 | **Compliance Engine** | 48 | Full Fit-for-55 coverage, EU AI Act compliance |
| **3** | Aug–Oct 2026 | **Scale & Harden** | 44 | 8 customers, ISO 27001 initiated, SOC 2 prep |
| **4** | Nov 2026–Jan 2027 | **Intelligence Layer** | 40 | Agentic AI workflows, IoT pipeline live |
| **5** | Feb–May 2027 | **Market Expansion** | 38 | 16 customers, supplier portal, partner ecosystem |
| **6** | Jun–Dec 2027 | **DWS7 Release** | 32 | V7.0 GA, investor metrics dashboard, profitability |

---

## Phase 1: Launch & Stabilize (Feb–Apr 2026) — 45 PRs

### 1.1 Testing Foundation (PRs 001–012)

The codebase has 3 test files (390 lines). This is the #1 risk for production.

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 001 | Add Vitest coverage config and CI gate | P0 | Configure coverage thresholds (60% min), add to CI pipeline |
| 002 | Unit tests for auth service (register, login, JWT) | P0 | Cover all auth flows: registration, login, password reset, token refresh |
| 003 | Unit tests for climate-assistant service | P0 | Test Groq integration, budget tracking, tier system, topic filtering |
| 004 | Unit tests for climate-assistant-gated service | P0 | Test lead capture, tier escalation, rate limits per tier |
| 005 | Unit tests for email service and templates | P1 | Test Resend integration, template rendering, variable substitution |
| 006 | Unit tests for ERP base connector | P1 | Test connection lifecycle, retry logic, auth header injection |
| 007 | Unit tests for Firehorse state machine | P1 | Test all state transitions, invalid transitions, event handling |
| 008 | Unit tests for Firehorse sales pipeline | P1 | Test lead progression, scoring, pipeline stage management |
| 009 | Integration tests for auth routes (Supertest) | P0 | Full HTTP request/response testing for /api/v1/auth/* |
| 010 | Integration tests for climate-assistant routes | P0 | HTTP tests for both public and gated assistant endpoints |
| 011 | Integration tests for webhook routes | P1 | Test Resend webhook signature validation, event processing |
| 012 | Add E2E smoke test suite for critical paths | P0 | Login → dashboard → climate query → logout happy path |

### 1.2 Backend Hardening (PRs 013–022)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 013 | Structured error handling middleware | P0 | Replace ad-hoc try/catch with centralized error handler, error codes |
| 014 | Request validation middleware with Zod | P0 | Replace express-validator with Zod schemas matching frontend |
| 015 | API versioning strategy (v1/v2 coexistence) | P1 | Standardize versioned routes, deprecation headers |
| 016 | Health check endpoint with dependency status | P0 | /health returns Supabase, Redis, Groq connectivity status |
| 017 | Graceful shutdown improvements | P1 | Drain connections, complete in-flight requests, close DB pools |
| 018 | Request/response logging with correlation IDs | P0 | Pino structured logs with trace IDs for debugging |
| 019 | API rate limiting per tenant (not just global) | P1 | Tenant-aware rate limits using organization_id |
| 020 | Database connection pooling optimization | P1 | Configure Supabase connection pool for production load |
| 021 | Environment config validation on startup | P0 | Zod schema validates all required env vars before server starts |
| 022 | OpenAPI/Swagger spec generation | P1 | Auto-generate API docs from route definitions |

### 1.3 Dashboard v10 Production Readiness (PRs 023–033)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 023 | Dashboard error boundaries and fallback UI | P0 | React error boundaries for each major section |
| 024 | Loading states and skeleton screens | P0 | Consistent loading UX across all data-fetching components |
| 025 | Dashboard responsive layout (tablet + mobile) | P0 | Tailwind responsive breakpoints for all dashboard pages |
| 026 | Real-time data with Supabase subscriptions | P1 | Live updates for signals, agent status, metrics |
| 027 | Dashboard navigation and routing | P0 | React Router with protected routes, breadcrumbs |
| 028 | Carbon tracking page: chart components | P1 | Recharts/Visx charts for emissions over time, by scope |
| 029 | Settings page: organization management | P1 | Org profile, member invites, role management UI |
| 030 | Settings page: notification preferences | P2 | Email digest frequency, alert thresholds |
| 031 | Report viewer: PDF preview and download | P1 | In-browser PDF rendering for compliance reports |
| 032 | Agent chat: conversation history | P1 | Persist and reload previous climate assistant conversations |
| 033 | Dashboard accessibility audit and fixes | P1 | WCAG 2.1 AA: keyboard nav, screen reader, contrast |

### 1.4 Deployment & DevOps (PRs 034–040)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 034 | Staging environment on Cloud Run | P0 | Separate staging project with production-like config |
| 035 | Database migration CI pipeline | P0 | Auto-run pending migrations on deploy, rollback on failure |
| 036 | Frontend build + deploy pipeline (Cloudflare Pages) | P0 | v10-react auto-deploys on merge to main |
| 037 | Sentry/error tracking integration | P1 | Client + server error capture with source maps |
| 038 | Uptime monitoring (Checkly or equivalent) | P1 | Synthetic checks for API, dashboard, landing pages |
| 039 | Log aggregation setup (Grafana Loki or Cloud Logging) | P1 | Centralized log search across services |
| 040 | Secrets rotation runbook and automation | P2 | Documented process + script for rotating all API keys |

### 1.5 Customer Onboarding (PRs 041–045)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 041 | Customer onboarding wizard (multi-step form) | P0 | Industry selection → company profile → ERP connection → first report |
| 042 | Welcome email sequence (3-email drip) | P1 | Day 0: welcome, Day 3: first steps, Day 7: check-in |
| 043 | In-app guided tour (first-time user) | P1 | Highlight key features on first login |
| 044 | Customer-facing API documentation | P1 | Interactive API docs for programmatic access |
| 045 | SLA monitoring dashboard (internal) | P2 | Track uptime, response times, error rates per customer |

---

## Phase 2: Compliance Engine (May–Jul 2026) — 48 PRs

### 2.1 EU ETS Module (PRs 046–057)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 046 | ETS installation registry data model | P0 | Supabase schema for installations, permits, activity data |
| 047 | ETS emission calculation engine (Scope 1) | P0 | Standard + fallback calculation methods per activity type |
| 048 | ETS free allowance tracker (2026–2034 phase-out) | P0 | Model annual free allocation reduction per sector |
| 049 | ETS allowance price integration (live market data) | P1 | Daily EUA price fetch from ICE/EEX; store history |
| 050 | ETS financial exposure calculator | P0 | Project carbon cost based on allocation shortfall × market price |
| 051 | ETS MRV report generator (monitoring plan format) | P0 | Auto-generate Monitoring, Reporting, Verification documents |
| 052 | ETS verification workflow | P1 | Status tracking: draft → submitted → verified → approved |
| 053 | ETS compliance calendar with deadline alerts | P1 | Key dates: Mar 31 report, Apr 30 surrender, Sep 30 verification |
| 054 | ETS sector benchmarks (cement, steel, chemicals) | P1 | Pre-loaded benchmark values for 25+ industries |
| 055 | ETS allowance trading decision support | P2 | Buy/sell recommendation based on position and price forecast |
| 056 | ETS historical emissions dashboard | P1 | Year-over-year trend visualization, target vs actual |
| 057 | ETS export to national registry XML format | P1 | Generate submission-ready XML for EU Transaction Log |

### 2.2 CBAM Module (PRs 058–067)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 058 | CBAM product classification (CN codes) | P0 | Map imported products to CBAM-covered categories |
| 059 | CBAM embedded emissions calculator | P0 | Direct + indirect emissions per product, default values fallback |
| 060 | CBAM supplier data collection portal | P0 | Self-service portal for non-EU suppliers to submit emissions data |
| 061 | CBAM quarterly report generator | P0 | Transitional period report format (2026) |
| 062 | CBAM certificate cost estimator | P1 | Calculate CBAM certificate obligation based on import volume |
| 063 | CBAM country-of-origin carbon price adjustment | P1 | Deduct carbon price already paid in country of origin |
| 064 | CBAM customs data integration | P1 | Import customs declarations to auto-populate CBAM data |
| 065 | CBAM supplier verification workflow | P1 | Track supplier data quality, flag missing/suspicious data |
| 066 | CBAM financial impact dashboard | P1 | Visualize CBAM cost by product, supplier, country |
| 067 | CBAM definitive period preparation (2026+) | P2 | Schema and logic for post-transitional CBAM requirements |

### 2.3 CSRD/ESRS Module (PRs 068–077)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 068 | ESRS data point registry | P0 | Complete ESRS disclosure requirements mapped to data fields |
| 069 | ESRS E1 Climate: GHG emissions data collection | P0 | Scope 1/2/3 data entry with calculation helpers |
| 070 | ESRS E1 Climate: transition plan template | P0 | Structured template for climate transition plan |
| 071 | ESRS double materiality assessment tool | P1 | Guided assessment: impact materiality + financial materiality |
| 072 | ESRS report builder (multi-standard) | P0 | Assemble ESRS disclosures into compliant report format |
| 073 | ESRS data validation rules engine | P1 | Cross-check data points for consistency and completeness |
| 074 | ESRS gap analysis dashboard | P1 | Show readiness percentage per disclosure requirement |
| 075 | ESRS audit trail for all data entries | P0 | Immutable log of who changed what, when, with evidence |
| 076 | ESRS value chain (Scope 3) data collection | P1 | Supplier engagement + estimation methods for upstream/downstream |
| 077 | ESRS XBRL tagging for digital filing | P2 | Auto-tag disclosures for ESEF digital reporting |

### 2.4 EU AI Act Compliance (PRs 078–083)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 078 | Article 12 automatic logging framework | P0 | Structured log every AI decision: input, output, model, confidence |
| 079 | Reasoning lineage documentation per AI output | P0 | Chain-of-thought trace from input → processing → recommendation |
| 080 | AI model registry with version tracking | P1 | Track which model version produced which outputs |
| 081 | Human-in-the-loop override mechanism | P0 | Allow users to override any AI recommendation with audit trail |
| 082 | AI transparency disclosures in UI | P1 | Clear labeling of AI-generated content, confidence indicators |
| 083 | AI risk assessment documentation | P1 | FRIA (Fundamental Rights Impact Assessment) for high-risk uses |

### 2.5 Cross-Regulation Features (PRs 084–093)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 084 | Unified compliance calendar (all regulations) | P0 | Single view of all deadlines across ETS, CBAM, CSRD |
| 085 | Cross-regulation data sharing layer | P1 | Emissions data entered once, used across ETS + CBAM + CSRD |
| 086 | Regulation change tracker (auto-detect updates) | P2 | Monitor EUR-Lex for regulatory amendments |
| 087 | Multi-entity compliance (group reporting) | P1 | Parent + subsidiary consolidation for CSRD group reporting |
| 088 | Compliance status API for ERP integration | P1 | Push compliance status back to SAP/IFS/Dynamics |
| 089 | Notification engine (email + in-app + webhook) | P0 | Configurable alerts for deadlines, data gaps, threshold breaches |
| 090 | Compliance evidence vault | P1 | Secure document storage linked to specific disclosures |
| 091 | Industry-specific compliance templates (batch 1: cement, steel, chemicals) | P0 | Pre-configured for top 3 industries |
| 092 | Industry-specific compliance templates (batch 2: aluminum, fertilizers, hydrogen) | P1 | Next 3 CBAM-covered industries |
| 093 | Regulatory readiness score per customer | P1 | Weighted score across all applicable regulations |

---

## Phase 3: Scale & Harden (Aug–Oct 2026) — 44 PRs

### 3.1 Security Certifications (PRs 094–103)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 094 | ISO 27001 gap analysis and remediation plan | P0 | Map current controls against ISO 27001 Annex A |
| 095 | Information security policy documents | P0 | ISMS policies: access control, data classification, incident response |
| 096 | Role-based access control (RBAC) enforcement | P0 | Enforce org-level permissions on every API endpoint |
| 097 | Audit logging for all data mutations | P0 | Record every create/update/delete with user, timestamp, old/new value |
| 098 | Data encryption at rest (Supabase TDE) | P1 | Enable transparent data encryption on all sensitive tables |
| 099 | Penetration test remediation (external vendor) | P0 | Fix findings from scheduled pentest |
| 100 | SOC 2 Type I evidence collection | P1 | Automated evidence gathering for SOC 2 controls |
| 101 | Vulnerability management process | P1 | Triage, SLA, and remediation workflow for security findings |
| 102 | Data retention and deletion policies | P1 | GDPR-compliant retention schedules, automated purge jobs |
| 103 | Third-party risk assessment framework | P2 | Vendor security questionnaire for Groq, Supabase, Cloudflare |

### 3.2 Multi-Tenancy & Isolation (PRs 104–111)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 104 | Row-level security (RLS) policies for all tables | P0 | Enforce tenant isolation at database level |
| 105 | Tenant-scoped API middleware | P0 | Inject org_id into every query from JWT claims |
| 106 | Tenant data export (GDPR data portability) | P1 | Export all customer data in machine-readable format |
| 107 | Tenant provisioning automation | P1 | API to create new org with default config, admin user, sample data |
| 108 | Tenant usage metering | P0 | Track API calls, AI queries, storage per org for billing |
| 109 | Tenant-level rate limiting | P1 | Different rate limits per plan tier (starter/pro/enterprise) |
| 110 | Cross-tenant data leak prevention tests | P0 | Automated tests verifying tenant A cannot access tenant B data |
| 111 | Tenant admin dashboard (customer self-service) | P1 | Manage users, roles, billing, API keys within their org |

### 3.3 Performance & Reliability (PRs 112–120)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 112 | API response time benchmarks and optimization | P1 | Target: p95 < 200ms for reads, < 500ms for writes |
| 113 | Database query optimization (slow query analysis) | P1 | Identify and optimize queries > 100ms |
| 114 | Redis caching layer for frequent queries | P1 | Cache compliance status, dashboard metrics, user preferences |
| 115 | CDN configuration for static assets | P1 | Cloudflare caching rules for dashboard, landing pages |
| 116 | Load testing suite (k6 or Artillery) | P0 | Simulate 100 concurrent users across key workflows |
| 117 | Auto-scaling configuration (Cloud Run) | P1 | Min/max instances, CPU/memory thresholds |
| 118 | Database backup verification (restore test) | P0 | Monthly automated restore test to verify backup integrity |
| 119 | Circuit breaker for external services | P1 | Graceful degradation when Groq, Supabase, or ERP APIs fail |
| 120 | Zero-downtime deployment pipeline | P1 | Blue-green or canary deploy on Cloud Run |

### 3.4 Billing & Subscription (PRs 121–128)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 121 | Subscription plan data model | P0 | Plans: Starter (€500/mo), Professional (€2,000/mo), Enterprise (€5,000+/mo) |
| 122 | Stripe subscription integration | P0 | Create/update/cancel subscriptions, webhook handlers |
| 123 | Usage-based billing calculation | P1 | Metered billing for AI queries, API calls above plan limits |
| 124 | Invoice generation and history | P1 | Monthly invoices with line items, downloadable PDF |
| 125 | Plan upgrade/downgrade flow | P1 | Self-service plan changes with proration |
| 126 | Billing dashboard (customer-facing) | P1 | Current plan, usage, invoices, payment method management |
| 127 | Dunning management (failed payment handling) | P2 | Retry logic, grace period, account suspension flow |
| 128 | Revenue analytics dashboard (internal) | P1 | MRR, churn, expansion revenue, LTV tracking |

### 3.5 ERP Integration Depth (PRs 129–137)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 129 | SAP S/4HANA bidirectional sync (production) | P0 | Tested, production-ready SAP connector with real customer |
| 130 | IFS Cloud connector (full implementation) | P0 | Complete IFS integration for Nordic manufacturing customers |
| 131 | Monitor ERP connector (full implementation) | P1 | Nordic SME market — key competitive differentiator |
| 132 | Microsoft Dynamics 365 BC connector | P1 | Most common ERP for EU mid-market |
| 133 | ERP data mapping UI (customer self-service) | P1 | Visual field mapping editor for custom ERP configurations |
| 134 | ERP sync status dashboard | P1 | Show last sync time, errors, data quality scores per entity |
| 135 | ERP webhook receiver for real-time events | P2 | React to ERP changes instantly instead of polling |
| 136 | ERP integration test suite | P0 | Mock-based tests for all 6 ERP connectors |
| 137 | ERP connector SDK documentation | P2 | Guide for partners to build custom connectors |

---

## Phase 4: Intelligence Layer (Nov 2026–Jan 2027) — 40 PRs

### 4.1 Agentic AI Workflows (PRs 138–150)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 138 | Agent orchestration engine (Temporal.io integration) | P0 | Durable, resumable multi-agent workflows |
| 139 | Compliance checking agent | P0 | Autonomous scan of customer data against regulation thresholds |
| 140 | Data collection agent | P0 | Auto-pull missing data from connected ERPs and IoT sensors |
| 141 | Report generation agent | P0 | Autonomous ETS/CBAM/CSRD report drafting from collected data |
| 142 | Anomaly detection agent | P1 | Flag unusual emissions spikes, data quality issues |
| 143 | Deadline reminder agent | P1 | Proactive notifications before compliance deadlines |
| 144 | Supplier outreach agent | P1 | Auto-send CBAM data requests to suppliers, track responses |
| 145 | Agent execution dashboard | P0 | Real-time view of running agents, their status, outputs |
| 146 | Agent approval workflow (human-in-the-loop) | P0 | Queue agent outputs for human review before submission |
| 147 | Agent performance analytics | P1 | Track agent accuracy, execution time, human override rate |
| 148 | Multi-agent pipeline builder (visual) | P2 | Drag-and-drop agent workflow construction |
| 149 | Agent notification system | P1 | Alert users when agents complete, fail, or need input |
| 150 | Agent retry and error recovery | P1 | Automatic retry with exponential backoff, dead letter queue |

### 4.2 IoT-to-Compliance Pipeline (PRs 151–160)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 151 | IoT data ingestion API | P0 | High-throughput endpoint for sensor data (MQTT → REST bridge) |
| 152 | Sensor data normalization layer | P0 | Standardize diverse sensor formats into unified schema |
| 153 | Real-time emissions calculation from sensor data | P0 | Convert energy/fuel/process readings to CO2e in real-time |
| 154 | Jetson Orin Nano edge agent deployment | P1 | Package and deploy inference models to edge devices |
| 155 | Edge-to-cloud data sync with conflict resolution | P1 | Handle offline periods, reconcile when connectivity restored |
| 156 | Sensor health monitoring dashboard | P1 | Track sensor connectivity, data quality, calibration status |
| 157 | Automated MRV from sensor data | P0 | Generate Monitoring/Reporting/Verification docs from live data |
| 158 | Sensor data to ETS submission pipeline | P1 | End-to-end: sensor → calculation → verification → XML export |
| 159 | IoT device provisioning and management | P1 | Register, configure, update edge devices remotely |
| 160 | Predictive maintenance from sensor patterns | P2 | ML model for equipment failure prediction |

### 4.3 Climate LLM Enhancement (PRs 161–170)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 161 | Fine-tuned climate LLM (LoRA on Llama 3.3 70B) | P1 | Domain-specific model trained on EU regulation corpus. Primary fine-tuning platform: Acer Veriton GN100 (NVIDIA Blackwell, 120 GiB RAM) — see `Admin/Acer-Veriton-GN100/README.md` |
| 162 | RAG pipeline for regulation knowledge base | P0 | Retrieve relevant regulation text for AI responses |
| 163 | Multi-language climate assistant (EN, FI, DE, SV, NO) | P1 | Localized responses for Nordic + DACH markets |
| 164 | Climate assistant conversation memory | P1 | Context-aware follow-up questions across sessions |
| 165 | Climate assistant source citations | P0 | Every AI answer cites specific regulation article/section |
| 166 | Climate assistant confidence scoring | P1 | Show certainty level, flag when human expert needed |
| 167 | Regulation comparison tool (AI-powered) | P2 | "What changed between CSRD draft and final?" style queries |
| 168 | Climate scenario modeling assistant | P1 | "What if carbon price reaches €150?" financial projections |
| 169 | Batch query API for programmatic access | P1 | Process multiple compliance questions via API |
| 170 | Climate assistant feedback loop | P1 | Users rate answers, feedback improves model over time |

### 4.4 Analytics & Reporting (PRs 171–177)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 171 | Executive summary dashboard | P0 | C-level view: compliance status, financial exposure, trend |
| 172 | Drill-down analytics (by site, product, scope) | P1 | Interactive charts with filter/group/export |
| 173 | Custom report builder | P1 | Users define own report templates with drag-and-drop fields |
| 174 | Scheduled report delivery (email + SFTP) | P1 | Automated weekly/monthly report distribution |
| 175 | Benchmark comparison (industry peers) | P2 | Anonymized comparison against similar companies |
| 176 | Carbon reduction tracking vs targets | P0 | SBTi target progress visualization |
| 177 | Board-ready ESG presentation export | P1 | PowerPoint/PDF export formatted for board meetings |

---

## Phase 5: Market Expansion (Feb–May 2027) — 38 PRs

### 5.1 Supplier CBAM Portal (PRs 178–186)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 178 | Supplier self-registration portal | P0 | Non-EU manufacturers register to provide emissions data |
| 179 | Supplier data entry wizard | P0 | Guided emissions data collection with calculation helpers |
| 180 | Supplier verification workflow | P1 | Review and approve supplier-submitted data |
| 181 | Supplier communication hub | P1 | In-app messaging between importers and their suppliers |
| 182 | Supplier data quality scoring | P1 | Rate completeness, consistency, timeliness of supplier data |
| 183 | Supplier bulk invite (CSV/API) | P1 | Importers invite hundreds of suppliers at once |
| 184 | Supplier dashboard (their view) | P1 | Suppliers see which importers need their data, deadlines |
| 185 | Supplier freemium model | P2 | Free for suppliers, paid features for advanced analytics |
| 186 | Supplier network effect analytics | P2 | Track how supplier adoption drives importer retention |

### 5.2 Industry Vertical Deepening (PRs 187–198)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 187 | Construction industry module (EN 15978 deep integration) | P0 | Full lifecycle carbon assessment for building projects |
| 188 | Steel industry module (ETS + CBAM specifics) | P0 | BF-BOF vs EAF routes, scrap ratios, free allowance calc |
| 189 | Cement industry module | P0 | Clinker ratio, alternative fuels, process emissions |
| 190 | Chemicals industry module | P1 | Crackers, polymerization, GHG intensity per product |
| 191 | Aluminum industry module | P1 | Smelting emissions, anode effects, electricity source |
| 192 | Manufacturing (general) module | P1 | Machine-level energy tracking, OEE integration |
| 193 | Logistics & transport module | P1 | Fleet emissions, route optimization, ReFuelEU |
| 194 | Energy production module | P1 | Generation mix, grid emission factors, renewable certificates |
| 195 | Mining industry module | P2 | Extraction emissions, processing, rehabilitation |
| 196 | Healthcare facilities module | P2 | Energy-intensive medical equipment, waste management |
| 197 | Real estate & buildings module | P1 | EPBD compliance, EPC integration, renovation roadmap |
| 198 | Public sector module | P2 | Green public procurement, climate neutrality targets |

### 5.3 Partner Ecosystem (PRs 199–206)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 199 | Partner API with OAuth2 authentication | P1 | Secure API access for integration partners |
| 200 | Partner portal (documentation + sandbox) | P1 | Self-service partner onboarding with test environment |
| 201 | White-label configuration (branding per partner) | P2 | Partners resell DWS7 under their brand |
| 202 | Consulting partner dashboard | P2 | Sustainability consultants manage multiple client accounts |
| 203 | Webhook event catalog for integrations | P1 | Publish events partners can subscribe to |
| 204 | Marketplace for industry templates | P2 | Partners publish compliance templates to marketplace |
| 205 | Partner referral tracking | P2 | Attribution for partner-sourced customers |
| 206 | Integration with One Click LCA (bidirectional) | P1 | Import LCA data, export compliance status |

### 5.4 Mobile & Accessibility (PRs 207–215)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 207 | Mobile-responsive dashboard (PWA) | P0 | Dashboard works on mobile browsers, installable as PWA |
| 208 | Push notifications (web + mobile) | P1 | Deadline reminders, agent completions, alerts |
| 209 | Offline data entry capability | P1 | Collect data in offline mode, sync when connected |
| 210 | React Native app: authentication flow | P1 | Mobile login with biometrics support |
| 211 | React Native app: dashboard summary view | P1 | Key metrics on mobile with pull-to-refresh |
| 212 | React Native app: camera for evidence capture | P2 | Photograph meters, documents for compliance evidence |
| 213 | Internationalization framework (i18n) | P0 | Extract all UI strings, support EN/FI/DE/SV/NO |
| 214 | Finnish localization | P1 | Complete Finnish translation |
| 215 | German localization | P1 | Complete German translation — DACH market entry |

---

## Phase 6: DWS7 Release (Jun–Dec 2027) — 32 PRs

### 6.1 Platform Maturity (PRs 216–225)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 216 | Multi-region deployment (Finland + Germany) | P1 | Active-active deployment for data residency compliance |
| 217 | Disaster recovery runbook and automation | P0 | RTO < 4 hours, RPO < 1 hour, automated failover |
| 218 | SOC 2 Type II audit preparation | P0 | 6-month observation period evidence collection |
| 219 | ISO 27001 certification audit | P0 | Final audit with certification body |
| 220 | Performance optimization (sub-100ms API reads) | P1 | Edge caching, query optimization, connection pooling |
| 221 | Feature flag system for gradual rollouts | P1 | Per-tenant feature flags, A/B testing capability |
| 222 | Automated regression test suite (200+ tests) | P0 | Comprehensive test suite covering all critical paths |
| 223 | API backward compatibility guarantee (SemVer) | P1 | Versioned API with 6-month deprecation windows |
| 224 | Customer success metrics dashboard | P1 | NPS, health score, usage patterns, churn risk per customer |
| 225 | DWS7 migration guide (v6 → v7) | P0 | Step-by-step upgrade path for existing pilot customers |

### 6.2 Investor & Financial (PRs 226–234)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 226 | Investor metrics API | P1 | Programmatic access to ARR, MRR, churn, NRR, CAC, LTV |
| 227 | Investor reporting dashboard | P0 | Real-time metrics for board and investors |
| 228 | Revenue recognition automation | P1 | ASC 606/IFRS 15 compliant revenue tracking |
| 229 | Unit economics tracker | P1 | Per-customer profitability, CAC payback, gross margin |
| 230 | Financial forecasting model integration | P2 | Connect actuals to financial projections |
| 231 | Customer cohort analysis | P1 | Retention and expansion by cohort, industry, plan |
| 232 | ARR waterfall visualization | P1 | New + expansion − contraction − churn = net ARR change |
| 233 | Burn rate and runway calculator | P2 | Real-time financial health monitoring |
| 234 | Board deck auto-generation | P2 | Monthly board update from live metrics |

### 6.3 Advanced Features (PRs 235–247)

| PR | Title | Priority | Description |
|----|-------|----------|-------------|
| 235 | Digital product passport integration (EU CPR) | P1 | Construction product carbon data in standardized format |
| 236 | Carbon credit marketplace connector | P2 | Buy verified carbon credits directly from platform |
| 237 | Science-Based Targets initiative (SBTi) tracker | P1 | Set and track SBTi-aligned reduction targets |
| 238 | Scope 3 category-level automation | P1 | Auto-calculate each Scope 3 category from ERP + supplier data |
| 239 | Decarbonization scenario planner | P1 | Model "what if" scenarios: new equipment, fuel switch, efficiency |
| 240 | Real-time carbon dashboard (live from IoT) | P1 | Sub-minute emissions visualization from sensor network |
| 241 | Automated verification report preparation | P1 | Pre-fill third-party verifier requirements |
| 242 | Regulatory sandbox for testing new rules | P2 | Simulate impact of proposed regulations before enforcement |
| 243 | Customer community portal | P2 | Forum for customers to share best practices, templates |
| 244 | API usage analytics and developer portal | P1 | Track API consumption, provide interactive documentation |
| 245 | Advanced RBAC: custom roles and permissions | P1 | Customers define their own role/permission combinations |
| 246 | Bulk data import/export (CSV, Excel, API) | P1 | Mass data operations for initial setup and migration |
| 247 | DWS IQ 7.0 GA release packaging | P0 | Final release: changelog, migration, marketing, launch |

---

## PR Priority Distribution

| Priority | Count | Percentage | Definition |
|----------|-------|------------|------------|
| **P0** (Must-have) | 78 | 31.6% | Blocks customer deployment or revenue |
| **P1** (Should-have) | 118 | 47.8% | Significant value, can ship without temporarily |
| **P2** (Nice-to-have) | 51 | 20.6% | Enhances competitiveness, not blocking |

---

## PRs by Category

| Category | Count | Phases |
|----------|-------|--------|
| Testing & Quality | 18 | 1, 3, 6 |
| Backend & API | 14 | 1, 3 |
| Frontend & Dashboard | 18 | 1, 4, 5 |
| DevOps & Infrastructure | 14 | 1, 3, 6 |
| EU ETS Compliance | 12 | 2 |
| CBAM Compliance | 10 | 2, 5 |
| CSRD/ESRS Compliance | 10 | 2 |
| EU AI Act | 6 | 2 |
| Cross-Regulation | 10 | 2 |
| Security & Certifications | 16 | 3, 6 |
| Multi-Tenancy | 8 | 3 |
| Billing & Payments | 8 | 3 |
| ERP Integrations | 9 | 3 |
| Agentic AI | 13 | 4 |
| IoT Pipeline | 10 | 4 |
| Climate LLM | 10 | 4 |
| Analytics & Reporting | 7 | 4 |
| Supplier Portal | 9 | 5 |
| Industry Verticals | 12 | 5 |
| Partner Ecosystem | 8 | 5 |
| Mobile & i18n | 9 | 5 |
| Investor & Financial | 9 | 6 |
| Advanced Features | 13 | 6 |
| **Total** | **247** | |

---

## Revenue Milestones

| Date | Customers | MRR Target | Cumulative ARR |
|------|-----------|------------|----------------|
| Apr 2026 (Phase 1 done) | 3 | €8,500 | €102,000 |
| Jul 2026 (Phase 2 done) | 5 | €15,000 | €180,000 |
| Oct 2026 (Phase 3 done) | 8 | €28,000 | €336,000 |
| Jan 2027 (Phase 4 done) | 10 | €40,000 | €480,000 |
| May 2027 (Phase 5 done) | 14 | €56,000 | €672,000 |
| Dec 2027 (DWS7 GA) | 16+ | €72,000+ | €864,000+ |

**Assumptions:** Average customer value €4,500/mo blended (mix of Starter, Pro, Enterprise). Lifetime Fleet revenue additive.

---

## EU Funding Programs

DWS7 is eligible for multiple EU funding instruments. These are non-dilutive and should be pursued in parallel with customer revenue.

### Active & Upcoming Programs

| Program | Funding | Deadline Window | DWS7 Fit | Phase |
|---------|---------|----------------|----------|-------|
| **Horizon Europe — Cluster 4: Digital, Industry & Space** | Up to €3M per project | Rolling calls 2026-2027 | AI for industrial sustainability, multi-agent systems, edge AI | 4, 5 |
| **Horizon Europe — Cluster 5: Climate, Energy & Mobility** | Up to €5M per project | Rolling calls 2026-2027 | Climate compliance automation, IoT monitoring, ETS optimization | 2, 4 |
| **EIC Accelerator** | Up to €2.5M grant + €15M equity | Cut-off dates: Mar, Jun, Oct 2026 | Deep-tech AI platform with market traction, <€5M revenue | 3 |
| **Digital Europe Programme (DIGITAL)** | €50K–€2M | Calls in 2026 | AI deployment in industry, cybersecurity, cloud-to-edge | 1, 4 |
| **EIC Pathfinder** | Up to €4M | Annual calls | Novel multi-agent coordination, agentic AI for compliance | 4 |
| **LIFE Programme — Clean Energy Transition** | Up to €2M co-funding | Annual calls Q1 | Tools for industrial decarbonization, ETS compliance | 2 |
| **InvestEU — Sustainable Infrastructure** | Loan guarantees, equity | Continuous via intermediaries | Scale-up funding for climate-tech platforms | 5, 6 |
| **EU Innovation Fund** | €50K–€7.5M (small-scale) | Annual calls | Technologies reducing industrial GHG emissions | 4 |
| **IPCEI — Cloud Infrastructure & Services** | National + EU co-funding | Member state calls | Sovereign cloud for EU compliance data | 6 |
| **CEF Digital** | Co-funding up to 75% | Annual calls | Cross-border digital infrastructure for compliance | 3 |

### National Programs (Finland)

| Program | Funding | Agency | DWS7 Fit |
|---------|---------|--------|----------|
| **Business Finland — AI & Digitalization** | Up to €1M grant | Business Finland | AI-native compliance platform development |
| **Business Finland — Co-Innovation** | Up to €2M (consortium) | Business Finland | Joint R&D with industrial customers |
| **Business Finland — Research to Business** | Up to €500K | Business Finland | PhD thesis → commercial platform validation |
| **Business Finland — Tempo** | Up to €50K (6 months) | Business Finland | Market validation for new industry verticals |
| **Business Finland — Young Innovative Company (NIY)** | Up to €1.25M over 3 years | Business Finland | If company < 5 years, < 50 employees |
| **Finnvera** | Loans + guarantees | Finnvera | Growth capital, working capital |
| **Climate Fund (Ilmastorahasto)** | €1M–€20M equity/loan | Ilmastorahasto | Climate solutions at scale-up phase |
| **Academy of Finland** | PhD/postdoc funding | Academy of Finland | PhD thesis research on AI + industrial compliance |

### EU Funding → Roadmap Phase Mapping

```
Phase 1 (Feb-Apr 2026): Apply for Business Finland Tempo (market validation)
Phase 2 (May-Jul 2026): Apply for LIFE Programme (compliance engine)
Phase 3 (Aug-Oct 2026): Apply for EIC Accelerator (Oct 2026 cut-off)
Phase 4 (Nov-Jan 2027): Apply for Horizon Europe Cluster 4 (agentic AI)
Phase 5 (Feb-May 2027): Apply for EU Innovation Fund (IoT-to-compliance)
Phase 6 (Jun-Dec 2027): Apply for InvestEU (scale-up infrastructure)
```

### Funding Application Calendar

| Month | Program | Action | Estimated Value |
|-------|---------|--------|----------------|
| Mar 2026 | Business Finland Tempo | Submit application | €50K |
| Apr 2026 | Digital Europe Programme | Check open calls | €200K–€500K |
| Jun 2026 | LIFE Programme | Submit consortium proposal | €500K–€1M |
| Jul 2026 | Academy of Finland | PhD funding application | €150K (4 years) |
| Oct 2026 | EIC Accelerator | Submit full application | €2.5M grant + equity |
| Nov 2026 | Horizon Europe Cluster 4 | Submit consortium proposal | €500K–€1M (DWS share) |
| Jan 2027 | EU Innovation Fund (small-scale) | Submit application | €2.5M |
| Mar 2027 | Business Finland Co-Innovation | Submit with industrial partners | €1M |
| Jun 2027 | Climate Fund (Ilmastorahasto) | Growth investment discussion | €2M–€5M |

### Total Non-Dilutive Funding Potential: €7M–€12M (2026-2027)

This complements the investor SAFE (€150K @ €3.8M cap) and customer revenue. Funding applications become stronger as each phase delivers measurable results.

---

## Weekly Tracking

This roadmap is tracked by the `roadmap-weekly-tracker.yml` GitHub Actions workflow:
- Runs every Monday at 08:00 UTC
- Counts PRs matching roadmap categories
- Updates progress in GitHub Issues
- Sends summary to team

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Regulation changes mid-implementation | High | Modular compliance engine, regulation change tracker (PR 086) |
| Key customer churn during pilot | High | Customer success metrics (PR 224), NPS tracking |
| Security breach before ISO 27001 | Critical | Daily security scans (existing), pentest (PR 099) |
| Groq API pricing increase | Medium | Multi-LLM fallback, self-hosted option (PR 161). Acer Veriton GN100 (NVIDIA Blackwell, in-house) provides immediate fallback inference for Llama 3.3 70B and Mistral Large without cloud dependency |
| Edge AI hardware supply issues | Medium | Cloud-only fallback mode for IoT pipeline |
| Competitor acquires market share | Medium | Speed to market on unified Fit-for-55 platform |
| Team scaling challenges | Medium | AI-assisted development (Claude Code), modular architecture |

---

## Success Criteria for DWS7

- [ ] 16 paying industrial customers across 4+ industries
- [ ] €72,000+ MRR (€864,000+ ARR)
- [ ] ISO 27001 certified
- [ ] SOC 2 Type II in progress
- [ ] EU AI Act compliant
- [ ] Full Fit-for-55 coverage (ETS + CBAM + CSRD)
- [ ] < 100ms p95 API response time
- [ ] 99.9% uptime SLA
- [ ] 200+ automated tests
- [ ] 3+ ERP integrations production-validated
- [ ] IoT-to-compliance pipeline live at 2+ customer sites
- [ ] Investor dashboard live with real-time metrics
- [ ] Revolut balance growing month-over-month

---

## PhD Thesis Output / Tohtorinväitöskirjan tuotos

The DWS6 → DWS7 evolution is simultaneously an applied research project. Each phase produces publishable academic output in both English and Finnish.

### Thesis Framework / Väitöskirjan kehys

**EN:** *"AI-Native Multi-Agent Platforms for Automated EU Climate Compliance in Industrial SMEs: From Prototype to Production"*

**FI:** *"Tekoälynatiivit moniagenttialustat EU:n ilmastosäännöstenmukaisuuden automatisoimiseksi teollisissa pk-yrityksissä: Prototyypistä tuotantoon"*

**Institution / Oppilaitos:** TBD (Aalto / Tampere / Metropolia continuation → doctoral)
**Author / Tekijä:** Risto Anton Päärni
**Builds on / Perustuu:** Master's Thesis, Metropolia University of Applied Sciences (2026)

### Research Questions / Tutkimuskysymykset

| # | English | Suomi | Phase |
|---|---------|-------|-------|
| RQ1 | How can multi-agent AI systems autonomously execute EU climate compliance workflows for industrial SMEs? | Miten moniagentti-tekoälyjärjestelmät voivat itsenäisesti suorittaa EU:n ilmastosäännöstenmukaisuustyönkulkuja teollisille pk-yrityksille? | 2, 4 |
| RQ2 | What is the cost-effectiveness of edge AI (IoT-to-compliance) vs cloud-only approaches for continuous emissions monitoring? | Mikä on reunatekoälyn (IoT-vaatimustenmukaisuus) kustannustehokkuus verrattuna pelkkään pilvipohjaiseen lähestymistapaan jatkuvassa päästöjen seurannassa? | 4 |
| RQ3 | How does a unified multi-regulation platform (ETS+CBAM+CSRD) reduce compliance overhead compared to point solutions? | Miten yhtenäinen monisääntelyalusta (ETS+CBAM+CSRD) vähentää vaatimustenmukaisuuden ylikuormitusta verrattuna yksittäisratkaisuihin? | 2, 3, 5 |
| RQ4 | What architectural patterns enable EU AI Act compliant reasoning lineage in production AI systems? | Mitkä arkkitehtuurimallit mahdollistavat EU:n tekoälysäädöksen mukaisen päättelyketjun tuotanto-tekoälyjärjestelmissä? | 2 |
| RQ5 | How can AI-assisted software development (Claude Code, MCP) accelerate industrial platform delivery while maintaining security standards? | Miten tekoälyavusteinen ohjelmistokehitys (Claude Code, MCP) voi nopeuttaa teollisten alustojen toimitusta säilyttäen turvallisuusstandardit? | 1–6 |

### Publications per Phase / Julkaisut vaiheittain

| Phase | Publication (EN) | Julkaisu (FI) | Type | Target Venue |
|-------|-----------------|---------------|------|-------------|
| **1** | *"From Pilot to Production: Testing Strategies for AI-Native Industrial Platforms"* | *"Pilotista tuotantoon: Testausstrategiat tekoälynatiiveille teollisille alustoille"* | Conference paper | ECSA 2026 / ICSE 2027 |
| **2** | *"Automated EU Climate Compliance: A Multi-Regulation Engine for ETS, CBAM, and CSRD"* | *"Automatisoitu EU:n ilmastovaatimustenmukaisuus: Monisääntelymoottori ETS:lle, CBAM:lle ja CSRD:lle"* | Journal article | Journal of Cleaner Production |
| **2** | *"EU AI Act Article 12 in Practice: Reasoning Lineage for Industrial AI Systems"* | *"EU:n tekoälysäädöksen artikla 12 käytännössä: Päättelyketju teollisissa tekoälyjärjestelmissä"* | Conference paper | AIES 2027 |
| **3** | *"Multi-Tenant Security Architecture for EU-Regulated Industrial SaaS"* | *"Monivuokralaisen turvallisuusarkkitehtuuri EU-säännellylle teolliselle SaaS:lle"* | Workshop paper | EuroS&P 2027 |
| **4** | *"Agentic AI for Autonomous Climate Compliance: Multi-Agent Orchestration with Temporal.io"* | *"Agenttinen tekoäly itsenäiseen ilmastovaatimustenmukaisuuteen: Moniagenttiorkestraatio Temporal.io:lla"* | **Core PhD chapter** | Autonomous Agents and Multi-Agent Systems (JAAMAS) |
| **4** | *"IoT-to-Compliance: Bridging Real-Time Sensor Data and EU ETS Regulatory Filings"* | *"IoT-vaatimustenmukaisuus: Reaaliaikaisen sensoridatan ja EU:n päästökauppajärjestelmän raportointisarjan yhdistäminen"* | Journal article | Environmental Science & Technology |
| **5** | *"Network Effects in B2B Climate Compliance: Supplier Portal Design for CBAM Data Exchange"* | *"Verkostovaikutukset B2B-ilmastovaatimustenmukaisuudessa: Toimittajaportaalin suunnittelu CBAM-tietojenvaihtoon"* | Conference paper | CSCW 2027 |
| **6** | *"DWS IQ 7: A Longitudinal Case Study of AI-Native Platform Evolution for EU Industrial Compliance"* | *"DWS IQ 7: Pitkittäistapaustutkimus tekoälynatiivista alustaevoluutiosta EU:n teolliseen vaatimustenmukaisuuteen"* | **PhD Dissertation** | Doctoral thesis |

### Data Collection per Phase / Tiedonkeruu vaiheittain

| Phase | Data Source (EN) | Tietolähde (FI) | Method |
|-------|-----------------|-----------------|--------|
| 1 | Test coverage metrics, deployment logs, bug reports | Testikattavuusmittarit, käyttöönottologit, virheraporti | Quantitative |
| 2 | Compliance accuracy vs manual processes, time savings | Vaatimustenmukaisuuden tarkkuus vs manuaaliset prosessit, ajansäästö | Mixed methods |
| 3 | Security audit results, pentest findings, SLA metrics | Turvallisuustarkastusten tulokset, tietoturvatestauksen löydökset, SLA-mittarit | Quantitative |
| 4 | Agent execution logs, IoT sensor data, AI decision accuracy | Agenttien suorituslogit, IoT-sensoridata, tekoälypäätösten tarkkuus | Quantitative + case study |
| 5 | Customer interviews (16 industrial customers), NPS, usage data | Asiakashaastattelut (16 teollisuusasiakasta), NPS, käyttödata | Qualitative + quantitative |
| 6 | Full longitudinal dataset (22 months), financial metrics | Täydellinen pitkittäisaineisto (22 kuukautta), taloudelliset mittarit | Longitudinal case study |

### Thesis Repository Structure / Väitöskirjan kansiorakenne

```
docs/
├── thesis/                          # Multi-agent coordination (existing)
├── metropolia/master-thesis/        # Master's thesis (existing, foundation)
│   ├── en/V2Thesis_EN.md
│   └── fi/V2Thesis_FI.md
└── phd/                             # PhD thesis (new, generated from DWS7 phases)
    ├── en/                          # English publications
    │   ├── CH1_introduction.md
    │   ├── CH2_literature_review.md
    │   ├── CH3_testing_strategies.md      ← Phase 1
    │   ├── CH4_compliance_engine.md       ← Phase 2
    │   ├── CH5_eu_ai_act_practice.md      ← Phase 2
    │   ├── CH6_security_architecture.md   ← Phase 3
    │   ├── CH7_agentic_ai.md              ← Phase 4 (core)
    │   ├── CH8_iot_to_compliance.md       ← Phase 4
    │   ├── CH9_network_effects.md         ← Phase 5
    │   ├── CH10_longitudinal_case.md      ← Phase 6
    │   └── DISSERTATION_EN.md             ← Final compiled thesis
    └── fi/                          # Finnish publications
        ├── CH1_johdanto.md
        ├── CH2_kirjallisuuskatsaus.md
        ├── CH3_testausstrategiat.md       ← Vaihe 1
        ├── CH4_vaatimustenmukaisuusmoottori.md  ← Vaihe 2
        ├── CH5_eu_tekoalysaados.md        ← Vaihe 2
        ├── CH6_turvallisuusarkkitehtuuri.md     ← Vaihe 3
        ├── CH7_agenttinen_tekoaly.md      ← Vaihe 4 (ydin)
        ├── CH8_iot_vaatimustenmukaisuus.md      ← Vaihe 4
        ├── CH9_verkostovaikutukset.md     ← Vaihe 5
        ├── CH10_pitkittaistapaustutkimus.md     ← Vaihe 6
        └── VAITOSKIRJA_FI.md              ← Lopullinen koottu väitöskirja
```

### Academic Timeline / Akateeminen aikataulu

| Date | Milestone (EN) | Välitavoite (FI) |
|------|---------------|-----------------|
| Apr 2026 | Submit Phase 1 conference paper | Lähetä vaiheen 1 konferenssipaperi |
| Jul 2026 | Submit compliance engine journal article | Lähetä vaatimustenmukaisuusmoottorin lehtiartikkeli |
| Oct 2026 | PhD program application (with 2-3 published papers) | Tohtoriohjelman hakemus (2-3 julkaistua paperia) |
| Jan 2027 | Submit agentic AI core chapter to JAAMAS | Lähetä agenttinen tekoäly -ydinluku JAAMAS:iin |
| May 2027 | Submit IoT-to-compliance article | Lähetä IoT-vaatimustenmukaisuusartikkeli |
| Oct 2027 | Complete dissertation draft | Väitöskirjaluonnoksen valmistuminen |
| Dec 2027 | Submit PhD dissertation | Väitöskirjan jättäminen |

### Contribution to Knowledge / Panos tietämykseen

**EN:** This research contributes the first longitudinal empirical study of an AI-native multi-agent platform purpose-built for EU industrial climate compliance, bridging the gap between theoretical multi-agent systems research and real-world deployment at 16 industrial sites. The novel IoT-to-compliance pipeline and EU AI Act reasoning lineage implementation provide reference architectures for the emerging field of autonomous regulatory compliance.

**FI:** Tämä tutkimus tuottaa ensimmäisen pitkittäisen empiirisen tutkimuksen tekoälynatiivista moniagenttialustasta, joka on rakennettu EU:n teolliseen ilmastovaatimustenmukaisuuteen, yhdistäen teoreettisen moniagenttijärjestelmätutkimuksen ja todellisen käyttöönoton 16 teollisuuskohteessa. Uudenlainen IoT-vaatimustenmukaisuusputki ja EU:n tekoälysäädöksen mukainen päättelyketjun toteutus tarjoavat referenssiarkkitehtuurit autonomisen sääntelynmukaisuuden kehittyvälle alalle.

---

## Weekly Correction Process

This roadmap is a **living document** — corrected every week based on real-world signals.

### What Gets Corrected

| Signal | Source | Action |
|--------|--------|--------|
| **Competitor moves** | Competitor RSS feeds, Crunchbase, ProductHunt | Re-prioritize PRs, add defensive PRs, drop obsoleted features |
| **Technology advances** | GitHub Trending, HN, framework releases | Swap libraries, adopt new patterns, update tech stack PRs |
| **Regulation changes** | EUR-Lex, European Commission, national registries | Add/modify compliance PRs, shift phase timelines |
| **Customer feedback** | Support tickets, NPS surveys, churn signals | Promote P2→P1, add urgent PRs, re-scope features |
| **Market data** | Carbon price (EUA), industry reports, funding rounds | Adjust financial projections, reprioritize industry verticals |

### Correction Workflow (Every Monday)

1. **08:00 UTC** — `roadmap-weekly-tracker.yml` runs automatically
2. **Gathers signals:** PR progress, dependency updates, GitHub security alerts
3. **Creates GitHub Issue** with progress + signals requiring attention
4. **Team reviews** the issue, decides corrections
5. **Corrections committed** to `DWS7_ROADMAP.md` with changelog entry below

### Competitor Watch List

Track these competitors weekly for moves that affect our roadmap:

| Competitor | Watch For | Impact on DWS7 |
|------------|-----------|-----------------|
| **Persefoni** | EU expansion, CBAM features, pricing changes | If they launch EU CBAM → accelerate Phase 2 CBAM PRs |
| **Watershed** | EU market entry, Scope 3 automation | If they expand EU → deepen industry-specific moat |
| **Sweep** | CSRD features, SME pricing | If they drop prices → adjust our Starter tier |
| **One Click LCA** | Post-SimaPro integration, API partnerships | If they open API → prioritize PR 206 (LCA integration) |
| **Plan A** | New certifications, industry modules | If they add industrial → differentiate on IoT pipeline |
| **CO2 AI (BCG)** | Agentic AI launch, enterprise deals | If they ship agentic → accelerate Phase 4 |
| **Schneider Electric** | EcoStruxure + sustainability convergence | If they ship IoT-to-compliance → defend with speed |
| **SAP** | Sustainability Control Tower updates | If SAP adds CBAM native → pivot ERP integration strategy |
| **Coolset / ClimEase** | CBAM market share, pricing moves | If CBAM tools commoditize → bundle as free tier feature |
| **Normative** | Post-Eivee acquisition, Nordic expansion | If they target Finland → accelerate local ERP connectors |

### Big Tech AI Platform Watch

These companies directly shape DWS7's AI capabilities, infrastructure costs, and competitive landscape. Their moves can shift entire phases of the roadmap.

#### NVIDIA

| Signal | Watch For | Roadmap Impact |
|--------|-----------|---------------|
| **Jetson Orin updates** | New Jetson modules, JetPack SDK releases, power efficiency improvements | PR 154 (edge agent deployment), Phase 4 IoT pipeline |
| **CUDA / TensorRT** | Inference optimization, new quantization methods | Climate LLM fine-tuning performance (PR 161) |
| **NIM (NVIDIA Inference Microservices)** | Self-hosted inference containers, new model support | Alternative to Groq for on-premise/edge inference |
| **Blackwell (GB10 / GN100)** | New Blackwell-class GPU performance, VRAM, quantization improvements | Directly impacts Acer Veriton GN100 capacity — affects which models run locally, Climate LLM fine-tuning throughput (PR 161), sovereign inference roadmap |
| **Omniverse / Digital Twins** | Industrial digital twin capabilities | Future: factory/site digital twin integration |
| **Pricing & supply** | GPU availability, Jetson pricing changes | Edge AI cost model, hardware procurement decisions |
| **X accounts** | @nvidia, @NVIDIAAIDev, @JetsonHacks | |

#### Google

| Signal | Watch For | Roadmap Impact |
|--------|-----------|---------------|
| **Gemini model releases** | Gemini 2.5+, context window, tool-use improvements | Multi-LLM strategy — Gemini as fallback/alternative to Claude |
| **Google Cloud Run** | Pricing changes, new features, GPU support | Primary backend deployment costs (Phase 1-6) |
| **Vertex AI** | Agent Builder, Vertex AI Search, grounding | Potential alternative to MCP for agent orchestration |
| **BigQuery + sustainability** | Carbon footprint datasets, public data programs | Industry benchmark data for compliance (PR 175) |
| **Google Cloud for Startups** | Credits program changes, sustainability track | Infrastructure credits (existing $135K+ potential) |
| **Colab / TPU** | Training infrastructure, pricing | Climate LLM fine-tuning compute costs (PR 161) |
| **X accounts** | @GoogleAI, @GoogleCloud, @GeminiApp | |

#### Microsoft

| Signal | Watch For | Roadmap Impact |
|--------|-----------|---------------|
| **Azure OpenAI** | GPT-5+, o3 reasoning models, pricing | Competitive pressure on Claude-based architecture |
| **Dynamics 365 Sustainability** | Native sustainability features in ERP | If D365 adds CBAM/ETS native → pivot PR 132 strategy |
| **Microsoft Sustainability Manager** | Feature updates, industry modules | Direct competitor for enterprise sustainability |
| **Copilot for Industry** | Manufacturing, energy industry Copilots | May set customer expectations for AI-assisted compliance |
| **Azure IoT** | Edge runtime updates, Digital Twins | Alternative to AWS IoT Greengrass for edge deployment |
| **GitHub Copilot** | Agent mode advances, workspace features | Developer productivity competition |
| **X accounts** | @Microsoft, @MSCloud, @AzureIoT | |

#### IBM

| Signal | Watch For | Roadmap Impact |
|--------|-----------|---------------|
| **IBM Envizi** | New ESG features, industry modules, pricing | Direct competitor for enterprise carbon accounting |
| **watsonx.ai** | New foundation models, industry models | Alternative LLM for industrial-specific AI |
| **watsonx.governance** | AI governance tools, EU AI Act features | Reference for our EU AI Act compliance (PRs 078-083) |
| **IBM Consulting** | Sustainability practice announcements, partner deals | May influence enterprise buyer expectations |
| **Granite models** | Open-source enterprise models | Potential base model for climate LLM fine-tuning |
| **X accounts** | @IBM, @IBMResearch, @IBMSustain | |

#### AWS

| Signal | Watch For | Roadmap Impact |
|--------|-----------|---------------|
| **AWS IoT Greengrass** | Edge runtime updates, ML inference at edge | Phase 4 IoT pipeline (PRs 151-160) |
| **Amazon Bedrock** | New models, agent framework, knowledge bases | Multi-LLM infrastructure alternative |
| **AWS Sustainability** | Customer Carbon Footprint Tool updates | May commoditize basic carbon tracking |
| **SageMaker** | Training cost reductions, new instance types | Climate LLM training cost optimization |
| **AWS Credits** | Startup program, sustainability credits | Infrastructure cost offset |
| **EU Region expansion** | New EU regions, data residency guarantees | Multi-region deployment options (PR 216) |
| **X accounts** | @awscloud, @AWSstartups, @AWSIoT | |

#### Anthropic

| Signal | Watch For | Roadmap Impact |
|--------|-----------|---------------|
| **Claude model releases** | Claude 5+, capabilities, context window, pricing | Core AI engine — every model upgrade improves all agents |
| **MCP (Model Context Protocol)** | New tools, server spec changes, ecosystem growth | MCP hub architecture (entire agent layer depends on this) |
| **Claude Code** | New features, agent SDK improvements | Development velocity, worktree workflows |
| **Tool use improvements** | Better structured output, parallel tool calls | Agent reliability and performance |
| **Pricing changes** | API price drops/increases, new tiers | Operating cost for climate assistant (PRs 046-177) |
| **Safety research** | Constitutional AI updates, EU AI Act alignment | Reasoning lineage compliance (PRs 078-083) |
| **X accounts** | @AnthropicAI, @alexalbert__, @aabornadel (Dario) | |

#### OpenAI

| Signal | Watch For | Roadmap Impact |
|--------|-----------|---------------|
| **GPT-5+ releases** | New capabilities, reasoning, tool use | Competitive pressure — customers may ask "why not GPT?" |
| **o3/o4 reasoning models** | Reasoning capability, cost/performance tradeoffs | May force us to offer multi-model choice |
| **API pricing** | Price drops that shift market expectations | Pressure on our pricing if competitors use cheaper models |
| **Enterprise features** | Data residency, compliance certifications | Enterprise buyers may demand OpenAI model option |
| **Agents / Swarm** | Multi-agent frameworks, production deployment | Reference architecture for our agentic AI (Phase 4) |
| **X accounts** | @OpenAI, @sama, @gabornadel (Greg Brockman) | |

#### Chinese LLMs (DeepSeek, Qwen, Yi, Baichuan)

| Signal | Watch For | Roadmap Impact |
|--------|-----------|---------------|
| **DeepSeek** | V3+, R1 reasoning, open-source releases, cost leadership | If DeepSeek quality matches Claude at 10x lower cost → evaluate for non-sensitive workloads |
| **Qwen (Alibaba)** | Qwen 3+, multilingual EU language support | Potential for Finnish/German/Swedish language tasks |
| **Yi (01.AI)** | New releases, commercial licensing | Alternative for self-hosted inference |
| **EU data sovereignty concerns** | EU regulatory stance on Chinese AI models | May be blocked for EU compliance workloads — monitor closely |
| **Cost disruption** | If Chinese models commoditize LLM inference | Could pressure DWS7 pricing model downward |
| **Open-source fine-tuning** | Quality of open models for domain-specific tasks | Base model selection for climate LLM (PR 161) |
| **X accounts** | @deepabornadel, @Alibaba_Qwen | |

#### Platform Decision Matrix

When a major platform announcement occurs, use this framework:

```
Big tech announcement detected →
  1. Does it ENABLE something we couldn't do before?
     └─ YES → Add adoption PR, estimate effort and timeline
  2. Does it THREATEN our competitive position?
     └─ YES → Evaluate: Can we integrate it? Switch to it? Or differentiate harder?
  3. Does it change PRICING economics?
     └─ YES → Re-model unit economics, adjust billing (PRs 121-128)
  4. Does it shift CUSTOMER EXPECTATIONS?
     └─ YES → Update roadmap priorities to match what customers now expect
  5. Does it affect EU DATA SOVEREIGNTY?
     └─ YES → Flag immediately — compliance is non-negotiable
```

### Technology Watch List (Frameworks & Infrastructure)

| Technology | Watch For | Impact on DWS7 |
|------------|-----------|-----------------|
| **React** | React 20+, Server Components maturity | Dashboard architecture decisions |
| **Vite** | Major releases, new features | Build tooling updates |
| **Supabase** | New features (vectors, branching, edge functions) | Database architecture, new capabilities |
| **Temporal.io** | SDK updates, new workflow patterns | Agent orchestration improvements |
| **Cloudflare** | Workers AI, D1, new edge features | Edge deployment strategy |
| **EU Digital Product Passport** | Standard finalization, implementation guides | PR 235 timing and scope |
| **pgvector / embeddings** | Performance improvements, new models | RAG pipeline optimization (PR 162) |
| **LangChain / LlamaIndex** | Agent framework updates, tool ecosystems | Evaluate vs custom MCP implementation |
| **Deno / Bun** | Runtime performance, TypeScript support | Future backend runtime consideration |
| **Tailwind CSS** | v5+ major changes, new utility patterns | Dashboard styling approach |

### Industry Watch List (16 EU Industries)

Each of DWS7's 16 target industries has its own regulatory shifts, technology disruptions, and competitive dynamics. Track weekly.

| # | Industry | Key Regulation | Watch For | Signal Sources | Roadmap Impact |
|---|----------|---------------|-----------|----------------|----------------|
| 1 | **Construction** | EPBD, CPR, EN 15978 | Digital product passports (Jul 2027), nearly-zero energy buildings mandate, One Click LCA moves | European Commission DG GROW, BuildingSMART | PRs 187, 235 timing |
| 2 | **Steel** | ETS, CBAM | Green steel premiums, H2-DRI adoption rates, ArcelorMittal/SSAB announcements | Eurofer, World Steel Association | PR 188 scope, free allowance calcs |
| 3 | **Cement** | ETS, CBAM | Clinker substitution breakthroughs, CCUS deployment, Heidelberg/Holcim strategy | CEMBUREAU, Global Cement Review | PR 189 calculation methods |
| 4 | **Chemicals** | ETS, REACH update | Bio-based feedstock shifts, PFAS restriction proposals, BASF/Evonik pivots | CEFIC, ECHA consultations | PR 190 product scope |
| 5 | **Aluminum** | ETS, CBAM | Inert anode tech (Elysis), recycled content mandates, Hydro/Norsk Hydro moves | European Aluminium, IAI | PR 191 emission factors |
| 6 | **Manufacturing** | EED, ETS for scope expansion | Industry 4.0 + sustainability convergence, digital twin adoption | Eurostat energy balances, VDMA | PR 192 OEE integration |
| 7 | **Logistics & Transport** | ReFuelEU, FuelEU Maritime | SAF mandates (2% 2025 → 6% 2030), e-truck adoption, Maersk/DHL announcements | IATA, IMO, IRU | PR 193 fleet emissions |
| 8 | **Energy Production** | RED III, ETS | Offshore wind expansion, nuclear renaissance, grid storage breakthroughs | ENTSO-E, IRENA, IEA | PR 194 generation mix |
| 9 | **Mining** | CSRD, Taxonomy | Critical raw materials act, ESG due diligence for minerals, Boliden/LKAB updates | EIT RawMaterials, ICMM | PR 195 extraction metrics |
| 10 | **Healthcare** | CSRD, medical device regulation | Sustainable healthcare initiatives, hospital energy optimization, Philips/Siemens Healthineers | WHO green healthcare, HCWH Europe | PR 196 facility tracking |
| 11 | **Real Estate** | EPBD recast, Taxonomy | Minimum Energy Performance Standards (MEPS 2030), renovation wave funding | European Commission DG ENER, BPIE | PR 197 EPC integration |
| 12 | **Public Sector** | Green public procurement | Net-zero government targets, climate-neutral cities mission (100 by 2030) | EU Mission Cities, national procurement agencies | PR 198 procurement tracking |
| 13 | **Financial Services** | SFDR, DORA, Taxonomy | Scope 3 financed emissions mandates, climate stress tests, ECB/EBA guidance | ECB, EBA, ESMA | New PR candidate: financed emissions module |
| 14 | **Food & Agriculture** | CAP reform, LULUCF | Farm-to-fork emissions, methane reduction tech, carbon farming credits | DG AGRI, EEA | New PR candidate: agricultural emissions |
| 15 | **Textiles** | ESPR, CSRD | EU Strategy for Sustainable Textiles, digital product passports, H&M/Inditex moves | EURATEX, European Commission DG GROW | New PR candidate: textile supply chain |
| 16 | **ICT & Data Centers** | EED Art. 12, Code of Conduct | Energy efficiency reporting obligations (from 2024), PUE mandates, hyperscaler sustainability reports | European Commission JRC, EUDCA | New PR candidate: data center emissions |

### Industry Signal Response Matrix

When an industry signal fires, use this decision matrix:

```
Signal detected → Is it regulatory?
  ├─ YES → Does it change compliance requirements?
  │   ├─ YES → Add/modify compliance PR, adjust Phase 2-3 scope
  │   └─ NO (just timeline shift) → Update deadline in compliance calendar
  └─ NO → Is it competitive?
      ├─ YES → Does a competitor now serve this industry better?
      │   ├─ YES → Promote industry module PR to P0, add differentiation PRs
      │   └─ NO → Log and monitor
      └─ NO → Is it technology?
          ├─ YES → Does it enable better/cheaper solution?
          │   ├─ YES → Evaluate effort, add tech adoption PR if ROI > 3x
          │   └─ NO → Log for future consideration
          └─ NO → Log in weekly report, review quarterly
```

### X (Twitter) Intelligence Feed

X has been a primary source of early signals for AI, climate-tech, and EU regulation. Track these accounts and topics weekly.

#### Key Accounts to Monitor

**AI & Development:**

| Account | Why | Signal Type |
|---------|-----|-------------|
| @AnthropicAI | Claude model releases, MCP updates, safety research | Tech: agent capabilities |
| @kabornadel (Andrej Karpathy) | AI development philosophy, agentic coding insights | Tech: dev practices |
| @dabornadel (Daniel San) | Claude Code workflows, worktrees, Ghostty patterns | Tech: dev tooling |
| @OpenAI | GPT model advances, competitive pressure | Competitor: AI models |
| @GoogleAI | Gemini updates, Vertex AI features | Competitor: AI models |
| @MetaAI | Llama releases, open-source LLM advances | Tech: fine-tuning base |
| @GroqInc | Inference speed improvements, new models | Tech: LLM inference |
| @suabornadel | Supabase features, edge functions, vectors | Tech: database |
| @temporalio | Workflow orchestration patterns | Tech: agent orchestration |
| @CloudflareDev | Workers updates, edge AI, Pages features | Tech: deployment |

**Climate-Tech & Compliance:**

| Account | Why | Signal Type |
|---------|-----|-------------|
| @EU_Commission | Policy announcements, Fit-for-55 updates | Regulation |
| @EUClimateAction | ETS, CBAM implementation details | Regulation |
| @ABORNADEL (EEA) | European environment data, emissions reports | Industry data |
| @PersefoniAI | Product launches, EU expansion signals | Competitor |
| @watershedclimate | Feature announcements, enterprise wins | Competitor |
| @sweabornadel | CSRD features, pricing moves | Competitor |
| @OneClickLCA | Construction LCA updates, SimaPro integration | Competitor |
| @PlanA_earth | German market moves, certifications | Competitor |
| @CarbonBrief | Carbon market analysis, policy explainers | Market intelligence |
| @BloombergNEF | Carbon price forecasts, clean energy data | Market data |
| @IEA | Global energy and emissions outlook | Industry data |

**Industry Verticals:**

| Account | Why | Signal Type |
|---------|-----|-------------|
| @ABORNADEL (Eurofer) | Steel industry policy positions | Industry: steel |
| @CEMBUREAU | Cement decarbonization progress | Industry: cement |
| @CEFIC_EU | Chemical industry sustainability | Industry: chemicals |
| @ArcelorMittal | Green steel announcements | Industry: steel |
| @HeidelbergCement | Low-carbon cement tech | Industry: cement |
| @SSAB | Fossil-free steel (HYBRIT) progress | Industry: steel |
| @Maersk | Green shipping, methanol fuel adoption | Industry: logistics |
| @Schneider_EU | Industrial IoT + sustainability | Competitor: IoT |
| @SiemensInfra | Building X, digital twin updates | Competitor: IoT |
| @NVIDIA | Jetson updates, edge AI platform | Tech: edge AI |

#### X Signal Topics (Search Weekly)

| Search Query | Purpose |
|-------------|---------|
| `"EU ETS" carbon price` | Track weekly EUA price sentiment |
| `CBAM implementation 2026` | CBAM transitional period updates |
| `CSRD reporting software` | Competitor product launches |
| `"EU AI Act" compliance` | Article 12 implementation guidance |
| `"green steel" OR "fossil-free steel"` | Steel industry decarbonization pace |
| `"digital product passport" EU` | CPR implementation timeline |
| `Claude Code OR "claude agent"` | AI dev tooling advances |
| `MCP "model context protocol"` | MCP ecosystem growth |
| `"climate tech" funding` | Competitor funding rounds |
| `Supabase OR "edge function" release` | Infrastructure capabilities |

#### X Signal → Roadmap Action Process

```
1. Spot signal on X
2. Log in weekly GitHub Issue (roadmap-tracker label)
3. Assess: Does this change a PR priority, scope, or timeline?
   ├─ YES → Commit correction to Correction Changelog with X post link
   └─ NO → Archive in weekly report for quarterly review
```

### Correction Changelog

Record every weekly correction here to maintain reasoning lineage.

| Week | Date | Correction | Reason | Source |
|------|------|------------|--------|--------|
| W07 | 2026-02-12 | Initial roadmap created | Baseline: 247 PRs across 6 phases | Codebase analysis + competitive research |
| W09 | 2026-02-24 | **DWS7 Agent Modernization — 6 critical fixes implemented in DWS6** | Ship now for DWS6 customers, not wait for DWS7 Phase 4. Accelerates PRs 078, 079, 138–150 | Session: claude/modernize-dws7-77v2B |

---

## Agent Evolution Roadmap

*Added: 2026-02-24 | Session: claude/modernize-dws7-77v2B*

The DWS7 agent modernization was accelerated to ship in **DWS6** to enable customer acquisition now, not at DWS7 Phase 4 (Nov 2026). This section tracks what was implemented, what it maps to in the roadmap, and what remains.

### Delivered in DWS6 (2026-02-24)

These capabilities are **production-ready in DWS6** on branch `claude/modernize-dws7-77v2B`:

| Capability | Files | Maps to PRs | Status |
|-----------|-------|-------------|--------|
| **Observe-think-act agentic loop** | `src/agents/base.agent.ts` (`runLoop()`) | PR 138 (partial), PR 079 | ✅ Implemented |
| **Tool use / function calling** | `src/agents/tools.ts`, `types.ts` | PR 138 (partial), PR 140 | ✅ Implemented |
| **Multi-provider LLM client** (Anthropic, Groq, OpenAI-compat) | `src/agents/llm-client.ts` | PR 161 (infrastructure) | ✅ Implemented |
| **Agent-to-agent delegation** | `src/agents/index.ts` (delegate_to_agent) | PR 138 (partial) | ✅ Implemented |
| **MCP Agent Server** (/mcp endpoint, 22+ tools) | `src/mcp/agent-server.ts` | New — not in original roadmap | ✅ Implemented |
| **Event bus** (in-process + Redis Streams) | `src/agents/event-bus.ts` | PR 149 (partial) | ✅ Implemented |
| **Workflow definitions & executor** | `src/agents/workflows.ts` | PR 138 (partial) | ✅ Implemented |
| **Article 12 loop iteration logging** | `base.agent.ts` (`logLoopIterations()`) | PR 078, PR 079 | ✅ Implemented |
| **Delegation depth tracking** (anti-loop) | `src/agents/index.ts` | PR 150 (partial) | ✅ Implemented |
| **Agent discovery by capability** (A2A) | `src/agents/index.ts` (`discoverAgents()`) | New — A2A protocol prep | ✅ Implemented |
| **SSRF protection on agent tools** | `src/agents/tools.ts` (domain allowlist) | PR 103 (partial) | ✅ Implemented |
| **Predefined workflows** (compliance, construction, SEO) | `src/agents/workflows.ts` | PR 138 (partial) | ✅ Implemented |

### Standards Updated (2026-02-24)

| Standard | Section Added | Purpose |
|----------|--------------|---------|
| `DWS_SECURITY_STANDARD.md` v1.3 | §16: Agent Event-Driven Arch, §17: MCP Tool Approval | Security controls for new agent runtime |
| `Admin/SECURITY_COMPLIANCE.md` v1.5 | Agent Runtime Security Controls | Error handling, autonomy tiers, MCP endpoint security |
| `SITE_QUALITY_STANDARDS.md` | Agent-Driven UI Patterns | Frontend patterns for agent results, workflows, events |
| `docs/CLOUD_ENVIRONMENTS.md` | §13: MCP Agent Server | Deployment, endpoints, event streaming architecture |
| `DWS7_ROADMAP.md` | Agent Evolution Roadmap (this section) | Track what shipped early vs what remains |

### What Still Needs DWS7 Phase 4

These PRs are **not yet implemented** and remain in the Phase 4 timeline:

| PR | Title | Why Not Yet |
|----|-------|-------------|
| 138 | Temporal.io integration | Workflow executor runs in-process; Temporal wiring needs infra provisioning |
| 140 | Data collection agent | Need ERP connectors (PRs 129-137) first |
| 141 | Report generation agent | Need ESRS report builder (PR 072) first |
| 142 | Anomaly detection agent | Need IoT pipeline (PRs 151-153) first |
| 143 | Deadline reminder agent | Need compliance calendar (PR 053) first |
| 144 | Supplier outreach agent | Need CBAM supplier portal (PR 060) first |
| 145 | Agent execution dashboard (UI) | Frontend — need dashboard v10 completion (Phase 1.3) |
| 146 | Agent approval workflow (UI) | Frontend — need dashboard v10 + agent execution dashboard |
| 147 | Agent performance analytics | Need execution data collected over time |
| 148 | Multi-agent pipeline builder (visual) | Complex UI — Phase 4 proper |

### PR Acceleration Impact

The DWS6 agent modernization **accelerates 12 PRs** from Phase 4 (Nov 2026) to Phase 1 (Feb 2026):

```
Original Phase 4 timeline:     Nov 2026 - Jan 2027
Accelerated to DWS6 (now):     Feb 2026

PRs affected:
  078 (Article 12 logging)     — PARTIALLY COMPLETE (loop iteration logging)
  079 (Reasoning lineage)      — PARTIALLY COMPLETE (agentic loop traces)
  138 (Agent orchestration)    — PARTIALLY COMPLETE (in-process, no Temporal)
  139 (Compliance agent)       — ALREADY EXISTS (enhanced with tool use)
  145 (Agent execution dash)   — BACKEND READY (API endpoints exist)
  146 (Agent approval workflow) — BACKEND READY (governance engine exists)
  149 (Agent notification)     — PARTIALLY COMPLETE (event bus exists)
  150 (Agent retry/recovery)   — PARTIALLY COMPLETE (graceful degradation)

Net effect: -8 PRs from Phase 4, saving ~3 weeks of Phase 4 work
Customer value: Agentic AI capabilities available NOW for pilot customers
```

### New API Endpoints (DWS6)

These endpoints are **live** after the modernization and ready for customer-facing demos:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `POST /mcp` | JSON-RPC | MCP protocol — external ADEs call agents as tools |
| `GET /mcp/sse` | SSE | Real-time agent event stream |
| `GET /mcp/health` | GET | MCP server health |
| `GET /api/agents/discover/:cap` | GET | Find agents by capability |
| `GET /api/agents/workflows` | GET | List predefined workflows |
| `POST /api/agents/workflow/:name` | POST | Trigger multi-agent workflow |
| `GET /api/agents/events` | GET | Event bus history |

---

*This document is auto-tracked weekly. See `.github/workflows/roadmap-weekly-tracker.yml`.*
*Last updated: 2026-03-01*

# DWS7 ROADMAP — From Pilot to 16 Paying Industrial Customers

> **Document Standard:** DWS Document Standard v2.0
> **Version:** 1.0.0
> **Status:** Living Document (auto-tracked weekly)
> **Created:** 2026-02-12
> **Timeline:** Q1 2026 → Q4 2027 (22 months)
> **Target:** DWS IQ 7 — Production-grade, 16 industrial customers, investors signed, profitable

---

## Executive Summary

DWS IQ 6 is a pilot-phase climate intelligence platform with strong foundations: Express/TypeScript backend, React 19 dashboard, 6 AI agents, MCP orchestration, ERP connectors, 60+ landing pages, and 15 CI/CD workflows. But the gap between "pilot with €7k MRR" and "production platform with 16 paying customers and growing profits" requires disciplined execution across **247 pull requests** organized in 6 phases.

**Why 247, not 500:** Every PR here represents real, necessary work. Inflating to 500 would require splitting atomic changes or inventing unnecessary features. 247 PRs over 22 months = ~11 PRs/week — ambitious but achievable with AI-assisted development.

---

## Competitive Positioning

DWS7 exploits **3 gaps no competitor fills:**

| Gap | Opportunity | Competitors Missing It |
|-----|-------------|----------------------|
| **Unified Fit-for-55 platform** | Single platform for ETS + CBAM + CSRD + ESR across 16 industries | Everyone specializes in one regulation |
| **IoT-to-compliance pipeline** | Sensor data → verified regulatory filings, no manual steps | Schneider does IoT, Persefoni does reporting — nobody bridges them |
| **Agentic AI compliance** | Multi-agent autonomous compliance checking + report generation | CO2 AI and Schneider are exploring; nobody has shipped it |

**Market size:** Carbon accounting software market grows from $24.3B (2025) to $191.2B (2035) at 22.9% CAGR. Only 13.5% of EU businesses use AI — massive adoption runway.

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
| 054 | ETS sector benchmarks (cement, steel, chemicals) | P1 | Pre-loaded benchmark values for 16 industries |
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
| 161 | Fine-tuned climate LLM (LoRA on Llama 3.3 70B) | P1 | Domain-specific model trained on EU regulation corpus |
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
| Groq API pricing increase | Medium | Multi-LLM fallback, self-hosted option (PR 161) |
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

*This document is auto-tracked weekly. See `.github/workflows/roadmap-weekly-tracker.yml`.*
*Last updated: 2026-02-12*

# DWS IQ 6 - V1.0 Feature List

## Launch Date: February 23, 2026 (16 days remaining)

**Status as of:** March 10, 2026
**Document Owner:** Risto Anton Päärni
**Purpose:** Track what's built vs what's missing for V1.0 launch

---

## V1.0 Readiness Summary

| #   | Category                            | Status                   | Completion |
| --- | ----------------------------------- | ------------------------ | ---------- |
| 1   | DWS IQ Login System                 | Implemented              | 85%        |
| 2   | Firehorse Apps - Production Code    | API + UI Ready           | 75%        |
| 3   | Customer Dashboard (Frontend)       | Implemented              | 70%        |
| 4   | AI Agents - Production Ready        | Implemented              | 70%        |
| 5   | Mobile Dashboard                    | Foundation + Redux       | 35%        |
| 6   | Enterprise Integrations             | Connectors Ready         | 80%        |
| 7   | Supabase Database - Production Data | Migration Audit Complete | 100%       |
| 8   | Payment Integration                 | Backend Ready            | 70%        |
| 9   | Email System                        | Implemented              | 75%        |
| 10  | Documentation & CI/CD               | Complete                 | 95%        |
| 11  | V1 EU-Sovereign Migration (Aiven)   | Plan decided             | 5%         |

**Overall V1.0 Readiness: ~75%** (up from 48% on Jan 3)

---

## CRITICAL - Must Have for V1.0

### 1. DWS IQ Login System

**Status:** Implemented - React login UI + Supabase Auth + RBAC

#### What EXISTS:

- `src/services/auth.service.ts` - JWT authentication logic
- `src/middleware/auth.middleware.ts` - Auth middleware
- `src/routes/auth.routes.ts` - API routes
- `landing-pages/dws6-com/shared/js/auth-handler.js` - Supabase auth handler
- `landing-pages/dws6-com/shared/js/mfa-handler.js` - MFA handler
- `landing-pages/dws6-com/shared/js/role-router.js` - Role-based routing
- `landing-pages/dws6-com/shared/js/supabase-client.js` - Supabase client
- `landing-pages/dws6-com/login/` - 12+ login portals (DWS IQ, Store, Enterprise, MCP Hub, etc.)
- `onelifetime.world/lib/auth.ts` - Full auth library (browser/server/admin clients, RBAC)
- `onelifetime.world/components/auth/RoleGuard.tsx` - Role-based access control component
- `onelifetime.world/app/dashboard/profile/page.tsx` - User profile page
- `onelifetime.world/app/dashboard/organization/page.tsx` - Org management page
- `onelifetime.world/app/dashboard/security/page.tsx` - Security/session management
- **NEW:** `dws6.com/dashboard/firehorse/v10-react/src/pages/LoginPage.tsx` - React login/register UI
- **NEW:** `dws6.com/dashboard/firehorse/v10-react/src/pages/ResetPasswordPage.tsx` - Password reset flow

#### What's MISSING:

- OAuth/SSO integration (Google, Microsoft) - defer to V1.1
- Email verification flow (backend ready, needs email provider)

**Completion:** 85%

---

### 2. Firehorse Apps - Production Code

**Status:** API + UI Ready - Backend services + dashboard integration

#### What EXISTS:

- `Firehorse/api/main.py` - FastAPI Report Engine API (500+ lines)
- `Firehorse/automation/main.py` - Automation Service (LinkedIn engine, 18KB)
- `Firehorse/dms/main.py` - Document Management Service
- `Firehorse/report_engine.py` - Python report engine (1,000+ lines)
- `Firehorse/docker-compose.yml` - Container orchestration
- `Firehorse/templates/` - 6 sample JSON templates
- `src/firehorse/routes.ts` - Express API endpoints
- `src/firehorse/database.ts` - Database queries
- `src/firehorse/state-machine.ts` - Lead state management
- `src/firehorse/sales-pipeline.ts` - Sales pipeline logic
- `src/firehorse/account-based-rules.ts` - ABM rules engine
- `src/firehorse/email-service.ts` - Email sending
- `src/firehorse/scheduler.ts` - Task scheduling (node-cron)
- `src/firehorse/linkedin-workflow.ts` - LinkedIn integration
- Report Engine API: 6 endpoints ready
- Automation Service: 5 endpoints ready

#### What's NEW (March 2026):

- Template editor UI: TemplateEditorPage for custom report templates (JSON config, Supabase report_templates)

#### What's MISSING:

- PDF preview in browser
- Workflow builder UI (frontend)

**Completion:** 75%

---

### 3. Customer Dashboard (Frontend)

**Status:** Implemented - v10 React + onelifetime.world Next.js

#### What EXISTS:

- `dws6.com/dashboard/firehorse/v10-react/` - Active React 19.2 + Vite 7.2 dashboard
  - `src/App.tsx` - Main app with project list, metrics, assistant toggle
  - `src/components/ClimateAssistant.tsx` - AI chatbot with voice I/O
  - `src/components/MetricsHeader.tsx` - Portfolio KPI cards
  - `src/components/ProjectCard.tsx` - Project cards
  - `src/hooks/useSpeechRecognition.ts` - Voice input
  - `src/hooks/useSpeechSynthesis.ts` - Voice output
  - `src/lib/supabase.ts` - Supabase client + real-time subscriptions
  - `src/types/dashboard.ts` - TypeScript interfaces
- `onelifetime.world/app/dashboard/page.tsx` - Dashboard with stats grid
- `onelifetime.world/app/dashboard/layout.tsx` - Dashboard layout
- `onelifetime.world/app/dashboard/profile/page.tsx` - Profile management
- `onelifetime.world/app/dashboard/organization/page.tsx` - Org settings
- `onelifetime.world/app/dashboard/security/page.tsx` - Security settings
- **NEW:** `dws6.com/dashboard/firehorse/v10-react/src/pages/CarbonTrackingPage.tsx` - Carbon tracking dashboard
- **NEW:** `dws6.com/dashboard/firehorse/v10-react/src/pages/ReportViewerPage.tsx` - Report viewer
- **NEW:** `dws6.com/dashboard/firehorse/v10-react/src/pages/SettingsPage.tsx` - Settings page
- **NEW:** `dws6.com/dashboard/firehorse/v10-react/src/components/AgentChat.tsx` - Agent chat interface

#### What's NEW (March 2026):

- React Router (react-router-dom) — /login, /reset-password, /, /settings, /carbon, /reports, /billing, /agents
- ProtectedRoute / PublicRoute for auth gating
- ProfileMenu + HamburgerMenu: Billing nav link

#### What's NEW (March 2026):

- PWA configuration: vite-plugin-pwa, manifest (DWS IQ Dashboard), service worker, Supabase runtime cache
- Template Editor: TemplateEditorPage at /templates, CRUD for custom report templates (Supabase report_templates)

#### What's MISSING:

- Offline support (basic service worker in place)
- Advanced mobile responsive polish

**Completion:** 70%

---

### 4. AI Agents - Production Ready

**Status:** Implemented - 5 production agents + MCP Hub

#### What EXISTS:

- `mcp-hub/server.py` - Coordination hub (353 lines)
- Fan-out, Reflection, Sequential workflow patterns
- BIM-Carbon pipeline endpoint
- Agent task routing logic
- `mcp-hub/services/claude_code_session_manager.py` - Session orchestration
- `supabase/migrations/013_agent_tracking.sql` - Agent execution audit trail
- **NEW:** `src/agents/sitesense.agent.ts` - Site monitoring agent
- **NEW:** `src/agents/schedule-genius.agent.ts` - Timeline optimization agent
- **NEW:** `src/agents/material-oracle.agent.ts` - Carbon & procurement agent
- **NEW:** `src/agents/customer-sat.agent.ts` - Customer health analysis agent
- **NEW:** `src/agents/viability.agent.ts` - Unit economics agent
- **NEW:** `src/agents/index.ts` - Agent registry and orchestration

#### What's MISSING:

- LlamaStack integration (defer to V1.1)
- Advanced agent memory persistence (basic context works)
- Full agent test suite

**Completion:** 70%

---

### 5. Mobile Dashboard (React Native)

**Status:** NCC scope folded into Firehorse/mobile-app (2026-07-04); standalone `mobile-dashboard/` app retired.

`mobile-dashboard/` was a code-free shell after 6 months (Phase 1 only). Retired to `mobile-dashboard_RETIRED/` — see `mobile-dashboard_RETIRED/RETIRED.md`. NCC's portfolio-dashboard scope now lives in `Firehorse/mobile-app`, which was already a fully built app on the same stack.

#### What EXISTS:

- `Firehorse/mobile-app/src/screens/DashboardScreen.tsx` - Portfolio KPI tiles (SPI/CPI/active-projects/at-risk) + project list with RAG badges
- `Firehorse/mobile-app/src/screens/AlertsScreen.tsx` - NCC Portfolio Alert Center (acknowledge / bulk-acknowledge)
- `Firehorse/mobile-app/src/store/` - Redux slices (carbon, diary, inspection, offline), now with smoke test coverage
- `Firehorse/mobile-app/src/theme/nordicTheme.ts` - Nordic UI theme
- `Firehorse/mobile-app/src/navigation/` - Navigation structure, incl. new "NCC PORTFOLIO" drawer section
- `mobile-dashboard_RETIRED/config/fixtures/` - Original API mock data fixtures, kept for reference

#### What's MISSING:

- Real API integration (portfolio/projects/alerts endpoints are still static demo data)
- OAuth2/OIDC auth, offline cache, push notifications, app store submission — deferred until there's a firm NCC commercial commitment

**Completion:** MVP portfolio view + alerts folded into Firehorse/mobile-app; full `mobile-dashboard_RETIRED/docs/IMPLEMENTATION_PLAN.md` roadmap not carried forward.

---

## HIGH PRIORITY - Should Have for V1.0

### 6. Enterprise Integrations

**Status:** Connectors Ready - 6 ERP + 1 ESG connector implemented

#### What EXISTS:

- `src/integrations/erp/base-connector.ts` - Abstract connector class
- `src/integrations/erp/connectors/sap-connector.ts` - SAP S/4HANA
- `src/integrations/erp/connectors/ifs-connector.ts` - IFS Cloud
- `src/integrations/erp/connectors/dynamics365-connector.ts` - Microsoft Dynamics 365
- `src/integrations/erp/connectors/visma-connector.ts` - Visma
- `src/integrations/erp/connectors/jeeves-connector.ts` - Jeeves
- `src/integrations/erp/connectors/monitor-connector.ts` - Monitor ERP
- `src/integrations/erp/approval-gate.ts` - Approval workflow
- `src/integrations/erp/service.ts` - ERP orchestration service
- `src/integrations/erp/routes.ts` - ERP API endpoints
- `src/integrations/erp/scheduler.ts` - ERP sync scheduling
- `src/integrations/esg/worldfavor-connector.ts` - Worldfavor ESG
- `src/integrations/esg/types.ts` - ESG data types
- **NEW:** `src/middleware/webhook.middleware.ts` - Webhook verification & routing
- **NEW:** `src/middleware/rate-limiter.middleware.ts` - API rate limiting

#### What's MISSING:

- BIM/IFC file parser (specialized, defer to V1.1)
- API versioning headers

**Completion:** 80%

---

### 7. Supabase Database - Production Data

**Status:** Migrations Complete - 12 migration files

#### What EXISTS:

- `supabase/migrations/002_firehorse_pilot.sql` - Leads, events, tasks
- `supabase/migrations/003_firehorse_linkedin_dm_templates.sql` - LinkedIn templates
- `supabase/migrations/004_firehorse_porr_templates.sql` - PORR templates
- `supabase/migrations/005_firehorse_linkedin_workflow.sql` - Workflow state machine
- `supabase/migrations/006_investor_reporting_financial_data.sql` - Financial metrics
- `supabase/migrations/007_auth_users_orgs.sql` - Users, organizations, RBAC
- `supabase/migrations/008_payment_integration.sql` - Subscriptions, invoices
- `supabase/migrations/011_fix_security_issues.sql` - Security patches
- `supabase/migrations/012_firehorse_signals.sql` - Signal tracking
- `supabase/migrations/013_agent_tracking.sql` - AI agent execution logs
- `supabase/migrations/014_climate_assistant_usage.sql` - Usage metering
- `Firehorse/supabase-schema-templates.sql` - Template schema (800+ lines)
- **NEW:** `supabase/migrations/015_email_templates.sql` - Email template storage

#### What's NEW (March 2026):

- `scripts/seed-demo-projects.ts` - Demo projects seed script (run after 042_projects_dashboard.sql)
- `supabase/migrations/042_projects_dashboard.sql` - Projects table for dashboard portfolio

#### What's MISSING:

- Backup/restore automation

**Completion:** 92%

---

### 8. Payment Integration

**Status:** Backend Ready - PayPal + Revolut + Subscriptions

#### What EXISTS:

- `src/payments/config.py` - Payment configuration
- `src/payments/paypal.py` - PayPal integration
- `src/payments/revolut.py` - Revolut integration
- `src/payments/subscription_service.py` - Subscription management
- `src/payments/routes.py` - Payment API endpoints
- `src/payments/webhooks.py` - Payment webhook handlers
- `src/payments/models.py` - Payment data models
- `src/cloudflare/billing-integration.ts` - Billing Cloudflare Worker
- `src/cloudflare/revolut-checkout-worker.ts` - Revolut checkout Worker
- `supabase/migrations/008_payment_integration.sql` - Payment DB schema

#### What's NEW (March 2026):

- Payment checkout flow: BillingPage "Upgrade" calls /api/v1/payments/subscribe, redirects to PayPal/Revolut
- Express payment proxy routes (PAYMENT_API_URL, SUPABASE_JWT_SECRET for dashboard auth)

#### What's MISSING:

- Stripe integration (PayPal + Revolut cover EU market)
- Usage-based billing metering (foundation in migration 014)

**Completion:** 70%

---

### 9. Email System

**Status:** Implemented - Transactional email service + templates

#### What EXISTS:

- `src/firehorse/email-service.ts` - Email sending service
- **NEW:** `src/services/email.service.ts` - Transactional email service (welcome, reset, notifications, reports)
- **NEW:** `src/services/email-templates.ts` - HTML email templates (DWS brand)
- **NEW:** `supabase/migrations/015_email_templates.sql` - Email template storage

#### What's MISSING:

- Email provider production credentials (Resend/SendGrid)
- Email delivery analytics

**Completion:** 75%

---

## COMPLETE - Ready for V1.0

### 10. Documentation & CI/CD

- README.md - Complete
- ARCHITECTURE_SUMMARY.md - Complete
- Firehorse documentation - Complete (10,000+ lines)
- API documentation structure
- Integration guides
- Privacy policy & legal docs
- GitHub Actions workflows (15 workflows)
- Docker configuration
- Cloudflare DNS setup
- Google Cloud Run deployment scripts
- Auth service with JWT
- ZenFree runtime protection
- CORS configuration

### 11. CI/CD & DevOps ✅

- ✅ GitHub Actions workflows
- ✅ Docker configuration
- ✅ Cloudflare DNS setup
- ✅ Google Cloud Run deployment scripts

### 12. Labor-Anchored Product Catalog (T0–T4, Blue/pilot)

- ✅ §13.8 of `DWS_DYNAMIC_DEPLOYMENT_PRICING_STANDARD.md` — schema for the
  labor-anchored SKU (sku / tier / priceUnit / agents[] / replaces /
  nextUpsellSku / deploymentColor) and the public-render rule that bans
  SaaS-comparison columns.
- ✅ 64 Blue/pilot SKUs in `dws10.com/config/products.json` (mirrored to
  `landing-pages/dws10-com/config/products.json` in lockstep): 39 single
  agents, 6 Function/Workforce bundles, 9 Industry Pod add-ons,
  10 Land overlay engagements.
- ✅ Green + Blue price-list generators render tier, Replaces, and
  Next Upsell. Green list filters out every Blue SKU.
- ✅ Public price list (`dws10.com/price-list/` + landing-pages mirror) and
  `/upsell-map/` with the "Price AI like labor, not like a tool." hero.
- ✅ `src/services/upsell-rules.ts` implements the §5 trigger ladder
  (Zod-validated inputs); dashboard banner consumes it.
- ✅ Pricing validator (`scripts/validate-pricing.ts` / `.ps1`) wired to
  `.githooks/pre-commit` and a dedicated CI workflow.
- ⏳ Green ratification — every SKU stays Blue/pilot until Risto signs it
  Green per §5.

### 12. Security Framework ✅

- ✅ Auth service with JWT
- ✅ ZenFree runtime protection (MCP Hub)
- ✅ CORS configuration
- ✅ Environment variable handling

**Completion:** 95%

---

### 11. V1 EU-Sovereign Migration (Target: 02.08.2026)

**Status:** Plan decided — Aiven Developer + Startup

**Decision (10.03.2026):** Use Aiven for PostgreSQL migration from Supabase per DWS_SOVEREIGNTY_STANDARD.md.

| Plan          | Use Case    | Price  | Resources                     |
| ------------- | ----------- | ------ | ----------------------------- |
| **Developer** | Dev/staging | $5/mo  | 8 GB storage, 1 GB RAM, 1 CPU |
| **Startup**   | Production  | $75/mo | 99.99% SLA, HA options        |

**Total:** ~$80/mo. Aiven is Finnish (Helsinki), ISO 27001, pgvector-compatible.

#### What's PLANNED:

- [ ] Provision Aiven Developer (eu-north-1)
- [ ] Provision Aiven Startup (eu-north-1)
- [ ] Migrate Supabase schema → Aiven (`pg_dump` / `pg_restore`)
- [ ] Keycloak setup (auth replacement)
- [ ] MinIO or UpCloud Object Storage (file storage)

**Field note:** docs/field-notes/2026-03-10-v1-aiven-plan-decision.md

**Completion:** 5% (plan decided)

---

## Sprint Progress Report (Weeks 2-5)

### Week 2 (Jan 13-19): Firehorse Apps MVP

| Task                         | Planned | Actual    | Status                                                              |
| ---------------------------- | ------- | --------- | ------------------------------------------------------------------- |
| Report Engine API (FastAPI)  | 6h      | Completed | `Firehorse/api/main.py` (500+ lines)                                |
| Report generation endpoint   | 4h      | Completed | 6 endpoints: generate, carbon, templates, validate, batch, download |
| Automation - basic workflows | 6h      | Completed | `Firehorse/automation/main.py` (18KB, LinkedIn engine)              |
| Content DMS - upload/storage | 6h      | Completed | `Firehorse/dms/main.py` + Supabase Storage integration              |
| Omnichannel - email delivery | 4h      | Partial   | `src/firehorse/email-service.ts` created, templates deferred        |

**Week 2 Outcome:** Firehorse backend fully operational. All 4 services containerized with `docker-compose.yml`. Report Engine and Automation APIs production-ready with 11 endpoints total. DMS backend live with signed URL support.

**Readiness: 48% -> 55%**

---

### Week 3 (Jan 20-26): Frontend Dashboard

| Task                      | Planned | Actual    | Status                                                              |
| ------------------------- | ------- | --------- | ------------------------------------------------------------------- |
| Next.js setup + layout    | 4h      | Completed | `onelifetime.world/app/dashboard/layout.tsx`                        |
| Dashboard home page       | 6h      | Completed | v10-react `App.tsx` with metrics, projects, assistant               |
| Project overview + carbon | 6h      | Completed | `CarbonTrackingPage.tsx` - EN 15978 lifecycle stages                |
| Agent chat interface      | 6h      | Completed | `AgentChat.tsx` + `ClimateAssistant.tsx` with voice I/O             |
| Settings + profile        | 4h      | Completed | `SettingsPage.tsx`, profile/org/security pages in onelifetime.world |

**Week 3 Outcome:** Two dashboard implementations delivered. v10-react dashboard (React 19.2 + Vite 7.2) with 4 new pages. onelifetime.world Next.js dashboard with profile, organization, and security management. Report viewer added for Firehorse integration.

**Readiness: 55% -> 62%**

---

### Week 4 (Jan 27-31): AI Agents & Integration

| Task                                | Planned | Actual    | Status                                                                                             |
| ----------------------------------- | ------- | --------- | -------------------------------------------------------------------------------------------------- |
| SiteSense + ScheduleGenius agents   | 6h      | Completed | `sitesense.agent.ts` (weather risk, EN 13001), `schedule-genius.agent.ts` (CPM algorithm)          |
| MaterialOracle + CustomerSat agents | 6h      | Completed | `material-oracle.agent.ts` (EN 15978, ICE Database v3), `customer-sat.agent.ts` (weighted scoring) |
| Viability agent                     | -       | Completed | `viability.agent.ts` (ROI, NPV, IRR bisection, EU ETS carbon credits)                              |
| Agent registry + API routes         | -       | Completed | `index.ts` (singleton registry), `routes.ts` (3 endpoints, JWT auth)                               |
| Groq API integration                | 4h      | Completed | All agents support optional Groq LLM enhancement with deterministic fallback                       |
| Enterprise integrations             | -       | Completed | 6 ERP connectors + ESG connector, webhook middleware, rate limiting                                |
| Testing & bug fixes                 | 6h      | Partial   | Agent execution logging ready, full test suite deferred                                            |

**Week 4 Outcome:** All 5 production AI agents implemented with real business logic (not stubs). Agent registry with Express API. Enterprise integrations complete with 6 ERP connectors (SAP, IFS, Dynamics, Visma, Jeeves, Monitor). Webhook verification and API rate limiting middleware added.

**Readiness: 62% -> 70%**

---

### Week 5 (Feb 3-7): Email, Auth UI, Database & Polish

| Task                            | Planned (Mobile) | Actual (Reprioritized) | Status                                                       |
| ------------------------------- | ---------------- | ---------------------- | ------------------------------------------------------------ |
| Mobile: Expo/React Native setup | 4h               | Deferred to V1.1       | Mobile has foundation + Redux slices                         |
| Auth: Login/Register UI         | -                | Completed              | `LoginPage.tsx`, `ResetPasswordPage.tsx`, `useAuth.ts`       |
| Email: Transactional service    | -                | Completed              | `email.service.ts` (welcome, reset, notify, report delivery) |
| Email: HTML templates           | -                | Completed              | `email-templates.ts` (DWS-branded responsive templates)      |
| Database: Email migration       | -                | Completed              | `015_email_templates.sql`                                    |
| Feature list: V2.0 update       | -                | Completed              | Full audit of codebase vs. feature list                      |

**Week 5 Outcome:** Reprioritized from mobile (deferred to V1.1) to close critical gaps. Login/auth UI for v10-react dashboard. Full transactional email system with Resend/SendGrid support. Database migration for email templates. Comprehensive feature list audit revealed many features were further along than documented.

**Readiness: 70% -> 75%**

---

### Sprint Velocity Summary

```
Week 1 (Jan 6-12):   Auth backend + DB        ████████░░ 48% -> 52%
Week 2 (Jan 13-19):  Firehorse APIs           █████████░ 52% -> 55%
Week 3 (Jan 20-26):  Dashboard frontend       ██████████ 55% -> 62%
Week 4 (Jan 27-31):  AI Agents + Integrations ██████████ 62% -> 70%
Week 5 (Feb 3-7):    Email + Auth UI + Polish ██████████ 70% -> 75%
                                               ──────────
                                               Target: 100% by Feb 23
```

### Key Decisions Made During Weeks 2-5:

1. **Mobile deferred to V1.1** - 10-14 days of work for a platform that can soft-launch via TestFlight
2. **PayPal + Revolut over Stripe** - Better EU market coverage, Stripe can be added in V1.1
3. **v10-react as primary dashboard** - React 19.2 + Vite 7.2 chosen over separate Next.js app
4. **Groq as LLM provider** - Agents use Groq with deterministic fallback when API key missing
5. **5 agents over 3** - Delivered all planned agents rather than deferring, each with real business logic

---

## Remaining Sprint (Weeks 6-7: Feb 8-22)

### Week 6 (Feb 8-14): Integration & Wiring

| Day | Task                                             | Priority | Est. Hours |
| --- | ------------------------------------------------ | -------- | ---------- |
| Mon | Wire agent routes into `src/app.ts`              | Critical | 2h         |
| Mon | Add react-router-dom + page routing in v10-react | Critical | 3h         |
| Tue | Configure Resend/SendGrid API keys               | High     | 1h         |
| Tue | Database seeding script (demo data)              | High     | 4h         |
| Wed | Payment UI components in dashboard               | Medium   | 6h         |
| Thu | Agent integration testing                        | High     | 6h         |
| Fri | End-to-end smoke tests                           | Critical | 4h         |

### Week 7 (Feb 15-22): Polish & Launch Prep

| Day     | Task                                    | Priority | Est. Hours |
| ------- | --------------------------------------- | -------- | ---------- |
| Mon-Tue | Responsive design polish                | Medium   | 8h         |
| Wed     | Security audit (OWASP top 10 review)    | Critical | 4h         |
| Thu     | Performance optimization                | Medium   | 4h         |
| Fri     | User acceptance testing                 | Critical | 4h         |
| Sat-Sun | Final bug fixes, marketing site updates | High     | 6h         |

**Target: 75% -> 90%+ by Feb 22 (launch-ready)**

---

## Effort Estimation Summary (Updated Feb 7)

| Category                | Original Est.  | Remaining   | Priority   |
| ----------------------- | -------------- | ----------- | ---------- |
| Login System            | 3-4 days       | 0.5 days    | Done       |
| Firehorse Apps          | 6-8 days       | 2 days      | UI polish  |
| Customer Dashboard      | 5-7 days       | 1.5 days    | Polish     |
| AI Agents               | 5-7 days       | 1.5 days    | Testing    |
| Mobile Dashboard        | 10-14 days     | 8 days      | Defer V1.1 |
| Enterprise Integrations | 3-4 days       | 0.5 days    | Done       |
| Database Production     | 2 days         | 0.5 days    | Seeding    |
| Payment Integration     | 3-4 days       | 1.5 days    | UI         |
| Email System            | 2 days         | 0.5 days    | Done       |
| **TOTAL**               | **38-52 days** | **~8 days** |            |

**Available Days:** 16 days (Feb 7 - Feb 23)
**Buffer:** 8 days - comfortable margin for polish and testing

---

## Risk Assessment (Updated)

### Resolved Risks:

1. ~~Authentication~~ - Supabase Auth + RBAC implemented
2. ~~Enterprise Integrations~~ - 6 ERP connectors + ESG ready
3. ~~Database~~ - 12 migrations covering all entities

### Remaining Risks:

1. **Mobile Dashboard** - Largest gap, recommended defer to V1.1
2. **Payment UI** - Backend ready, needs dashboard integration
3. **Email provider** - Service ready, needs production API keys

### Low Risk:

1. **AI Agents** - 5 agents implemented, need integration testing
2. **Dashboard** - Core pages built, need responsive polish

---

## Minimum Viable V1.0 (Feb 23 Target)

### Will Ship:

1. Login + Supabase Auth + RBAC
2. Dashboard with project view + carbon tracking + agent chat
3. Firehorse Report Engine + Automation APIs
4. 5 AI agents (SiteSense, ScheduleGenius, MaterialOracle, CustomerSat, Viability)
5. Carbon tracking display
6. Enterprise ERP connectors (SAP, IFS, Dynamics, Visma, Jeeves, Monitor)
7. Payment backend (PayPal, Revolut) + Billing UI in dashboard
8. Email service (transactional)
9. Full database schema with RLS

### Defer to V1.1 (March 2026):

- Mobile app (React Native) store submission
- OAuth/SSO (Google, Microsoft)
- BIM/IFC file parser
- Advanced agent memory persistence
- LlamaStack integration
- PWA + offline support

---

---

## MVP Gap Analysis (March 22, 2026)

### Closed Since Last Update

### Closed Since Last Update

| #   | Gap                            | Resolution                                                                                                                                                                                                                               | Date       |
| --- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 1   | PDF Preview in browser         | Implemented — iframe viewer with Supabase signed URL + fallback HTML preview                                                                                                                                                             | 2026-03-22 |
| 2   | Payment UI wiring              | BillingPage now shows current plan from Supabase, usage stats, invoice history                                                                                                                                                           | 2026-03-22 |
| 3   | Database seeding               | Comprehensive seed script covers projects, reports, subscription_plans, agent_executions                                                                                                                                                 | 2026-03-22 |
| 4   | CHANGELOG.md                   | Added — V1.0.0 through V1.4.0 release history, Keep a Changelog format, SemVer                                                                                                                                                           | 2026-04-13 |
| 5   | OpenAPI 3.1 spec + Swagger UI  | Added `src/openapi.ts` — 40 endpoints documented, interactive docs at `/api/docs`, raw spec at `/api/docs/openapi.json`                                                                                                                  | 2026-04-13 |
| 6   | Test coverage gate enforcement | Verified active — `vitest.config.ts` thresholds (60% statements, 50% branches) + `.github/workflows/test.yml`                                                                                                                            | 2026-04-13 |
| 7   | OpenAPI spec completion        | Expanded from 41 → 70 operations — added HIL, BIM, Situation Room, Grok Consent, Outreach, KYA, Memory audit/decay, Notifications, Activity, Dashboard, Status groups                                                                    | 2026-04-15 |
| 8   | Public status page             | `GET /api/v1/status` endpoint added — returns service name, version, uptime, environment, region, component status (no auth required)                                                                                                    | 2026-04-15 |
| 9   | Audit log SIEM export          | `GET /api/v1/activity/export` added — admin-only, NDJSON or CSV format, date range + type filters, up to 10k events (Splunk/OpenSearch compatible)                                                                                       | 2026-04-15 |
| 10  | Staging environment            | `NODE_ENV=staging` added to enum; `staging.env.example`; `infrastructure/staging/docker-compose.staging.yml`; `.github/workflows/deploy-staging.yml` (auto-deploys `claude/**` branches to Cloud Run staging service `dws6run6-staging`) | 2026-04-15 |
| 11  | Email Resend→SES migration     | `outreach-send.routes.ts` migrated from banned Resend to SES SMTP (`sendEmail()`). Field note `docs/field-notes/2026-04-16-ses-smtp-production-setup.md` documents exact AWS console steps for credentials setup.                        | 2026-04-16 |
| 12  | OpenAPI remaining 9 endpoints  | Added investor-reports (metrics, MRR, summary, generate), content DMS (list, create, stats, transition), outreach send-email — spec now covers 79/79 operations                                                                          | 2026-04-16 |
| 13  | Customer knowledge base        | `docs/CUSTOMER_KB.md` — 12-section FAQ covering login, dashboard, reports, carbon tracking, AI agents, compliance, billing, data/privacy, security, ERP integrations, troubleshooting, and contact                                       | 2026-04-16 |

### Still Open

| #   | Gap                           | Priority | Status                                                                                                            | Target   |
| --- | ----------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Mobile App screens            | V1.1     | Foundation only — deferred                                                                                        | Q2 2026  |
| 2   | OAuth/SSO (Google, Microsoft) | V1.1     | Not started                                                                                                       | Q2 2026  |
| 3   | Email production credentials  | High     | Code complete — human must set SMTP_USER + SMTP_PASS in Cloud Run (see field note 2026-04-16)                     | ASAP     |
| 4   | Workflow Builder UI           | V1.1     | Backend state machine ready                                                                                       | Q2 2026  |
| 5   | Full agent test suite         | Medium   | Partial coverage                                                                                                  | Q2 2026  |
| 6   | Stripe payment                | V1.1     | PayPal + Revolut sufficient for EU                                                                                | Q3 2026  |
| 7   | EU-Sovereign Migration        | Low      | Plan decided (Aiven)                                                                                              | Aug 2026 |
| 8   | LlamaStack integration        | V1.1     | Groq fallback works                                                                                               | Q2 2026  |
| 9   | Blue-green deployment         | V1.1     | Staging/prod split done; blue-green = Cloud Run revision traffic splitting (0% → smoke test → 100%) not yet wired | Q3 2026  |

### Architecture Diagram

See `docs/MVP_ARCHITECTURE.md` for Mermaid diagram of MVP feature flow.

---

---

## V2 / System of Action Track

Derived from tietotehdas field research and Google Cloud Agentic Data Cloud analysis (10.05.2026).
Source: `docs/field-notes/2026-05-10-tietotehdas-datakeskus-suomen-kansallisvarallisuus.md`

Core thesis: DWS IQ is a **System of Action operator**, not a SaaS vendor. V2 track builds the infrastructure that makes this true at product level.

### High Priority

| #   | Feature                                   | Description                                                                                                          | Target  |
| --- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------- |
| 1   | **MCP-katalogi julkisille rekistereille** | MCP servers for DVV, Traficom, PRH public APIs — tietotehdas access without data silo fragmentation                  | Q3 2026 |
| 2   | **Knowledge Catalog prototype**           | Semantic layer on top of DWS IQ agent memory — raw data → contextualized knowledge (Google Knowledge Flywheel model) | Q3 2026 |
| 3   | **System of Action positioning rollout**  | Update dws10.com hero, all sales decks, investor materials with canonical sentences from §22 DWS_BRAND_STANDARD      | Q2 2026 |

### Medium Priority

| #   | Feature                           | Description                                                                                                                                                         | Target  |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 4   | **Google Cloud partnership eval** | Assess Gemini Enterprise Agent Platform Govern pillar (Agent Identity, Agent Gateway, Model Armor) for DWS governance layer — especially for public register access | Q3 2026 |
| 5   | **Dark Data inventory**           | Map Finnish public data reserves (DVV, Kela, THL, Luke, Ilmatieteenlaitos) for GDPR-compliant tietotehdas activation                                                | Q3 2026 |
| 6   | **Agent fleet governance layer**  | Cryptographic agent identities + unified audit trail for all agent actions over regulated data — build or buy decision                                              | Q4 2026 |

### Architecture Decision Required

| Decision                     | Option A                           | Option B                                   | Owner |
| ---------------------------- | ---------------------------------- | ------------------------------------------ | ----- |
| Govern layer: build vs. buy  | Own implementation (Anthropic+MCP) | Google Gemini Enterprise Agent Platform    | CTO   |
| Public register access model | Direct API federation              | Data broker / intermediary (e.g. Findynet) | CTO   |
| Knowledge Catalog: scope     | DWS IQ agents only                 | Shared across Finnish tietotehdas partners | CEO   |

---

**Document Version:** 2.8
**Created:** January 3, 2026
**Last Updated:** 10.05.2026
**Status:** V1 complete. V2 System of Action track added — 6 features, 3 architecture decisions pending.

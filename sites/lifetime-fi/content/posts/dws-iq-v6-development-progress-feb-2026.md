---
title: "DWS IQ V6: From 48% to 75% in 5 Weeks - Building an Enterprise Climate Intelligence Platform"
date: 2026-02-07
slug: dws-iq-v6-development-progress-feb-2026
type: post
author: "Risto Anton Paarni"
tags: ["dws-iq", "climate-intelligence", "development", "ai-agents", "eu-compliance", "fit-for-55"]
categories: ["Engineering", "Product Updates"]
meta_description: "How we built 10 core features for DWS IQ V6 in 5 sprint weeks, going from 48% to 75% readiness for the February 23 launch."
meta_keywords: ["DWS IQ 6", "climate compliance", "CSRD", "Fit for 55", "AI agents", "construction technology"]
status: published
---

# DWS IQ V6: From 48% to 75% in 5 Weeks

**Building an enterprise climate intelligence platform for EU-regulated industries.**

On January 3, 2026, we sat down and counted. Our V1.0 feature list had 10 categories, 38-52 days of estimated work, and 51 days until launch. Overall readiness: 48%. Five weeks later, we're at 75% with 16 days of buffer remaining.

This is how we got here.

---

## The 10 Features

DWS IQ 6 is a climate compliance automation platform targeting construction, infrastructure, and logistics companies across the EU. The V1.0 launch covers 10 feature areas:

1. **Login & Authentication** - Supabase Auth, JWT, RBAC, MFA
2. **Firehorse Apps** - Report Engine, Automation, Content DMS, Omnichannel
3. **Customer Dashboard** - React 19.2 + Vite 7.2 with real-time Supabase subscriptions
4. **AI Agents** - 5 production agents for site monitoring, scheduling, materials, customer health, and viability
5. **Mobile Dashboard** - React Native foundation (deferred to V1.1)
6. **Enterprise Integrations** - 6 ERP connectors (SAP, IFS, Dynamics, Visma, Jeeves, Monitor)
7. **Supabase Database** - 13 migration files covering auth, payments, agents, signals
8. **Payment Integration** - PayPal + Revolut for EU market coverage
9. **Email System** - Transactional emails with Resend/SendGrid
10. **Documentation & CI/CD** - 15 GitHub Actions workflows, Docker, Cloudflare

---

## Week-by-Week: What Actually Happened

### Week 1: Authentication & Database (48% to 52%)

Started with the foundation. Supabase Auth integration replaced the demo-only user system. JWT middleware hardened. Database migrations for users, organizations, and role-based access landed. Not glamorous work, but everything else depends on it.

### Week 2: Firehorse APIs (52% to 55%)

The Firehorse product suite went from documentation to running code. Four backend services containerized with Docker Compose:

- **Report Engine API** (FastAPI, 500+ lines) - 6 endpoints including EN 15978 carbon report generation
- **Automation Service** - Workflow execution, Slack notifications, webhook triggers
- **Content DMS** - Document upload with Supabase Storage, signed URLs, PDF preview
- **Docker orchestration** - All services running together

11 production API endpoints. Zero frontend yet, but the engine runs.

### Week 3: Dashboard Frontend (55% to 62%)

The biggest single-week jump. Two dashboard implementations shipped:

The **v10-react dashboard** (React 19.2 + Vite 7.2) got four new pages: carbon tracking with EN 15978 lifecycle breakdown, a report viewer connected to the Firehorse API, a settings page, and an agent chat interface with voice input/output using the Web Speech API.

The **onelifetime.world** Next.js app got dashboard layout, profile management, organization settings, and security/session management pages.

Both share the same Supabase backend. Both render real-time data.

### Week 4: AI Agents & Integrations (62% to 70%)

The most technically ambitious week. Five production AI agents, each with real business logic:

- **SiteSense** - Analyzes site conditions using EN 13001 wind thresholds, computes safety scores, flags weather risks
- **ScheduleGenius** - Implements Critical Path Method (CPM) with forward/backward pass and slack computation
- **MaterialOracle** - Carbon footprint analysis using ICE Database v3 emission factors across EN 15978 lifecycle stages (A1-A5, B, C, D)
- **CustomerSat** - Weighted scoring model for customer health with churn prediction
- **Viability** - Unit economics with ROI, NPV, IRR (bisection method), and EU ETS carbon credit valuation

All agents support optional Groq LLM enhancement with deterministic fallback when the API key isn't configured. They register through a singleton AgentRegistry and expose via Express API routes with JWT authentication.

Same week: 6 ERP connectors shipped (SAP S/4HANA, IFS Cloud, Microsoft Dynamics 365, Visma, Jeeves, Monitor ERP), plus webhook verification middleware and API rate limiting.

### Week 5: Email, Auth UI, Polish (70% to 75%)

The original plan called for mobile dashboard work. We made a deliberate call to defer mobile to V1.1 and close critical gaps instead:

- **Login UI** - React login/register pages with password reset flow for v10-react dashboard
- **Email service** - Transactional email with branded HTML templates (welcome, password reset, notifications, report delivery)
- **Database migration** - Email template storage
- **Feature list audit** - Discovered many features were further along than documented

The mobile foundation (Redux slices, navigation, theme) exists. It can soft-launch via TestFlight. Burning 10-14 days on App Store submission before the web platform launches made no sense.

---

## Key Technical Decisions

**PayPal + Revolut over Stripe.** Our customers are EU construction companies. PayPal and Revolut have stronger EU market penetration. Stripe can be V1.1.

**React 19.2 + Vite 7.2 as primary dashboard.** Faster builds, better developer experience, and the AI SDK integrates cleanly. The Next.js app at onelifetime.world handles the marketing/blog side.

**Groq as LLM provider for agents.** Fast inference, good pricing. Every agent has a deterministic fallback path - if the LLM is down or unconfigured, the agent still returns computed results from its business logic. The LLM enhances; it doesn't gate.

**5 agents instead of 2.** The original "minimum viable" plan called for just CustomerSat and Viability. We shipped all five because the base agent class made each additional agent a focused implementation exercise rather than a new architecture problem.

---

## What's Left: Weeks 6-7

The remaining work is integration and polish, not greenfield development:

**Week 6 (Feb 8-14): Wiring**
- Mount agent routes in the Express app
- Add react-router-dom page routing to the dashboard
- Database seeding with demo data
- Agent integration testing
- End-to-end smoke tests

**Week 7 (Feb 15-22): Launch Prep**
- Responsive design polish
- OWASP security audit
- Performance optimization
- User acceptance testing
- Marketing site updates

Velocity math: 5.4% average per week, 2.3 weeks remaining, projects to ~87%. Even the pessimistic scenario (integration friction) lands at 85% by Feb 23.

---

## The Stack

For those interested in the technical details:

| Layer | Technology |
|-------|------------|
| Frontend | React 19.2, Vite 7.2, TypeScript 5.9, TailwindCSS 4.1 |
| Backend | Express 4.19, TypeScript, FastAPI (Python services) |
| Database | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| AI/LLM | Groq API, Claude (Anthropic), MCP Protocol |
| Agents | 5 TypeScript agents with CPM, EN 15978, ICE Database v3 |
| Payments | PayPal, Revolut, Supabase billing tables |
| ERP | SAP, IFS, Dynamics 365, Visma, Jeeves, Monitor connectors |
| Deployment | Google Cloud Run, Cloudflare Workers/Pages |
| CI/CD | 15 GitHub Actions workflows, Docker Compose |

---

## What We Learned

**Feature lists rot fast.** Our January 3 list said "Customer Dashboard: 0%, NOT STARTED" when we already had a v10-react dashboard with Supabase integration and a climate assistant component. Audit your actual codebase, not your tracking document.

**Parallel agent development works.** Week 4's velocity spike came from running multiple implementation streams simultaneously. The base agent class was the force multiplier - each new agent was a focused 200-400 line implementation, not a new system design.

**Deferring correctly is a feature.** Cutting mobile saved 10-14 days and lost nothing for launch. The web dashboard is the primary interface for construction portfolio managers. Mobile is a nice-to-have for site visits. We'll ship it in V1.1 when the core platform is stable.

**EU compliance is the product.** Every technical decision maps back to EN 15978, Fit for 55, CSRD, EPBD, or ETS. The carbon tracking page shows lifecycle stages because auditors need lifecycle stages. The MaterialOracle agent uses ICE Database v3 emission factors because those are the industry-accepted factors. The specificity is the moat.

---

## Launch: February 23, 2026

16 days. 75% complete. On track.

If you're a construction, infrastructure, or logistics company dealing with Fit for 55 compliance, CSRD reporting, or EPBD certification - we're building this for you.

**Contact:** [info@dws10.com](mailto:info@dws10.com)
**Platform:** [onelifetime.world](https://onelifetime.world)
**GitHub:** [blogtheristo/dws6](https://github.com/blogtheristo/dws6)

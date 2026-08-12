# DWS Cloud Environments — US, EU & Sovereignty Tiers

---

# VERSION AND AGENT HISTORY

Version: 2.5

Sessions & Modifications:

- Version: 2.5 | Tool: Claude Code (Opus 4.8) | Session: claude/gsutil-deprecation-migration-69l85d | Date: 22.07.2026 | Changes: Added Section 2.4.1 recording the July 2026 orphaned-project cleanup under `risto.paarni2024@lifetime.fi` — `dws-iq-pilot` and `gen-lang-client-0339803660` (Kaggle101125) deleted; the four remaining "check-first" Google-integration projects (`dws6login`, `coral-loop-494008-r2`, `dws-mcp-hub`, Gemini API) documented with keep/verify status. Annotated the Section 2.4 snapshot rows for the deleted projects (snapshot preserved, not rewritten). Context: the gsutil→gcloud storage migration surfaced these orphans; `src/sandbox/cloudrun-ephemeral.ts` was repointed off the now-deleted `dws-iq-pilot` default (fails loud if `GOOGLE_CLOUD_PROJECT` unset). Added `scripts/gcp-project-audit.cmd` as the repeatable read-only inventory tool
- Version: 2.4 | Tool: Claude Code (Sonnet 5) | Session: claude/cloudflare-serverless-research-9m90rh | Date: 05.07.2026 | Changes: Corrected a significant staleness gap found during Cloudflare-migration research — this document never mentioned DGX Spark, which took over as the actual primary 24/7 backend + cron runtime around April-May 2026 (see `Cron-works.md`), demoting Cloud Run to secondary/staging. Added new Section 3.2.2 documenting DGX Spark. Updated Section 4.2 (Backend API row) and Section 8 (Environment Matrix) to reflect this. Corrected the Cloudflare Workers status in Sections 4.2/8/12 against a live account check (Cloudflare Developer Platform MCP): of the 8 workers designed in `src/cloudflare/`, only 1 (`dws-revolut-checkout`) is actually deployed — zero KV namespaces exist account-wide, so the other 7 (including the MCP Edge Gateway referenced in Section 12) cannot be running. Also corrected the header version number itself, which had drifted one behind the latest changelog entry.
- Version: 2.3 | Tool: Claude Code (Sonnet 4.6) | Session: claude/fix-config-dependencies-7npjf | Date: 24.05.2026 | Changes: Added Section 3.2.1 "Deployment Tier Choice: GCP Primary vs Scaleway Sovereign" — documents the two-tier deployment decision logic, activation triggers for Scaleway, and the intentionally dormant `deploy-scaleway_OLD.yml` CI/CD workflow (preserved for Tier 2 sovereignty customers, not dead infra)
- Version: 2.2 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: main | Date: 11.05.2026 | Changes: Documented current Google Cloud account/project inventory for `risto.paarni2024@lifetime.fi` (active + not-current projects and org), and added staging deployment project-alignment note clarifying that CI/CD must target `dws6run6` (not `dws6-backend`) to avoid Artifact Registry IAM failures
- Version: 2.1 | Tool: Claude Code (Opus 4.7) | Session: claude/b2b-payment-stack-DNdkW | Date: 25.04.2026 | Changes: Section 4.5 — added "Scaling note" subsection. Records that the current single-tenant deployment pattern (one Cloud Run service, one trigger, one Stripe endpoint, one shared secret inventory) is correct for the internal Lifetime Oy billing use case shipped today, and lists the re-evaluation triggers (>100 tenants, first per-tenant Stripe account, first non-EU residency, first non-CLOUD-Act jurisdiction) that would force a rework. Includes a single-tenant→multi-tenant dimension table for future reference; explicit instruction to fork the section rather than mutate it when re-evaluating, so historical pattern is preserved. Note, not a task
- Version: 2.0 | Tool: Claude Code (Opus 4.7) | Session: claude/b2b-payment-stack-DNdkW | Date: 25.04.2026 | Changes: Section 4.5 — added STRIPE_WEBHOOK_SECRET to required secrets table and canonical deploy command; new "Public ingress" subsection covering the two-layer block (Workspace org policy `iam.allowedPolicyMemberDomains` + Cloud Run private-by-default IAM) with the exact override + binding commands; new "Stripe webhook wiring" table pinning service URL, mounted route, signing secret, Stripe destination name (`charming-serenity`), 7 subscribed event types; new "Smoke-test recipes" with three single-curl tests proving liveness, raw-body chain, and full HMAC chain; new "Pitfalls discovered & captured" subsection logging six lessons learned: express.json consumes raw stream, Compute-SA default since 2024, tsconfig excludes vs runtime stubs, Node 22 ESM `.js` requirement, `/webhooks/stripe` path, `timingSafeEqual` length-mismatch behaviour. Major version bump to 2.0 reflects that 4.5 is now a complete deployment standard, not a partial pattern note
- Version: 1.9 | Tool: Claude Code (Opus 4.7) | Session: claude/b2b-payment-stack-DNdkW | Date: 24.04.2026 | Changes: Added Section 4.5 "DWS 6 Cloud Run Deployment Pattern (Standard)" — principles (secrets in Secret Manager not env-vars, user-managed replication pinned to europe-north1, least-privilege secretAccessor per secret, never-paste rule); provisioning workflow via `scripts/Provision-DwsIqSecrets.ps1`; required backend secret inventory (STRIPE_SECRET_KEY, SUPABASE_URL/ANON/SERVICE/SERVICE_ROLE, JWT_SECRET, SMTP_USER/PASS); canonical deploy command separating `--set-env-vars` (non-secret config) from `--set-secrets` (Secret Manager refs); rotation playbook with `:latest` + nonce env-var; security-benefits comparison table. Renumbered prior 4.5 Limitations → 4.6
- Version: 1.8 | Tool: Claude Code (Opus 4.7) | Session: claude/b2b-payment-stack-DNdkW | Date: 24.04.2026 | Changes: Section 4.4 — BUILD FIX CONFIRMED. Root cause was the 2024+ Google default change: `dws6run6` runs Cloud Build as the Compute SA (`1074393862472-compute@developer.gserviceaccount.com`), not the legacy Cloud Build SA. Added Step 4 (repo-scoped `roles/artifactregistry.writer` on `dws-iq-repo` for Compute SA) — the only grant that actually worked; build id `5fcd7368-cc55-4ebf-b4bb-473c9c2ff54a` pushed image `sha256:e1ecbd6c…`. Flagged Step 2 and Step 3 grants as OBSOLETE in the IAM table; added "Gotcha" subsection documenting the Compute-SA default + `gcloud builds list` verification command; added cleanup commands to drop the two dead bindings
- Version: 1.7 | Tool: Claude Code (Opus 4.7) | Session: claude/b2b-payment-stack-DNdkW | Date: 24.04.2026 | Changes: Section 4.4 — added Step 3 (repo-scoped `roles/artifactregistry.repoAdmin` on `dws-iq-repo` for Cloud Build SA) as the least-privilege replacement for Step 2's project-level admin; added corresponding row to IAM table with Scope column; staged Step 4 removal command for the project-level `artifactregistry.admin` binding once a successful build confirms Step 3 is sufficient
- Version: 1.6 | Tool: Claude Code (Opus 4.7) | Session: claude/b2b-payment-stack-DNdkW | Date: 24.04.2026 | Changes: Section 4.4 — added Artifact Registry repo-creation step (prior push error was "or it may not exist", repo `dws-iq-repo` did not yet exist in `europe-north1`); logged auto-provisioned Artifact Registry service agent `service-1074393862472@gcp-sa-artifactregistry.iam...` that appeared when the API activated on first repo; split the resolution narrative into two explicit gcloud steps
- Version: 1.5 | Tool: Claude Code (Opus 4.7) | Session: claude/b2b-payment-stack-DNdkW | Date: 24.04.2026 | Changes: Added Section 4.4 (DWS 6 Cloud IAM Bindings) — project-level IAM table for `dws6run6`, documented `roles/artifactregistry.admin` grant to Cloud Build SA `1074393862472@cloudbuild.gserviceaccount.com` to unblock Artifact Registry push; renumbered prior 4.4 → 4.5 (Limitations); flagged least-privilege follow-up
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026 | Changes: Added Section 13.8 (Database Disaster Recovery Architecture) — dual-database (Supabase dws6-production + Aiven dws-test), Linux recovery scripts, RTO < 5 min schema / < 15 min full, 4-destination backup redundancy
- Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/silly-zhukovsky | Date: 07.03.2026 | Changes: Added Aiven PostgreSQL Sandbox as 5th environment in matrix — agent workspace + LWM training, EU Finland region, daily mirror from Supabase
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/mcp-google-cloud-run-BuSpY | Date: 23.02.2026 | Changes: Added MCP Gateway on Cloud Run section (Section 12) — Streamable HTTP for mobile Claude Code, secret provisioning script
- Version: 1.1 | Tool: Claude Code | Session: claude/zealous-mcclintock | Date: 20.02.2026 | Changes: Added Google Cloud project details (dws6run6) and Secret Manager API status
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/document-cloud-environments-EK7iZ | Date: 16.02.2026 | Changes: Initial cloud environments documentation — US public, EU development, EU AI Act compliance layer, DWS 6 + DWS 7 strategy

Session Links & References:

- Claude Code (claude/mcp-google-cloud-run-BuSpY): https://github.com/blogtheristo/dws6/commits/claude/mcp-google-cloud-run-BuSpY
- Claude Code (claude/zealous-mcclintock): https://github.com/blogtheristo/dws6/commits/claude/zealous-mcclintock
- Claude Code (claude/document-cloud-environments-EK7iZ): https://github.com/blogtheristo/dws6/commits/claude/document-cloud-environments-EK7iZ

Document Status:

- Created: 16.02.2026
- Last Modified: 11.05.2026
- Language: EN
- Languages Available: EN
- Publication Status: ACTIVE

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Account Structure](#2-account-structure)
3. [Cloud Environment Overview](#3-cloud-environment-overview)
4. [DWS 6 — Cloud Environments](#4-dws-6--cloud-environments)
5. [DWS 7 — Cloud Environments](#5-dws-7--cloud-environments)
6. [Firehorse V3 — Multi-Cloud Strategy](#6-firehorse-v3--multi-cloud-strategy)
7. [Full Sovereignty (Aegis) — EU AI Act Compliance Layer](#7-full-sovereignty-aegis--eu-ai-act-compliance-layer)
8. [Environment Matrix](#8-environment-matrix)
9. [Data Residency & Sovereignty](#9-data-residency--sovereignty)
10. [Migration Path: DWS 6 → DWS 7](#10-migration-path-dws-6--dws-7)
11. [Cost Structure](#11-cost-structure)
12. [References](#12-references)

---

## 1. Executive Summary

DWS operates across three cloud environments serving different purposes, compliance requirements, and customer segments. This document clarifies the account structure, deployment topology, and evolution path from the current DWS 6 pilot through DWS 7 production to Full Sovereignty (Aegis) EU AI Act compliance.

**Three Cloud Environments:**

| Environment                  | Region                    | Purpose                                                          | Account                      | Status          |
| ---------------------------- | ------------------------- | ---------------------------------------------------------------- | ---------------------------- | --------------- |
| **US Cloud (Public)**        | US (Cloudflare global)    | Public-facing sites, store, landing pages                        | dws6.com                     | Active          |
| **EU Cloud (Development)**   | europe-north1 (Finland)   | Development, pilot customers, production backend                 | risto.paarni2024@lifetime.fi | Active          |
| **Full Sovereignty (Aegis)** | EU-only (Finland/Germany) | EU AI Act Article 12 compliance, reasoning lineage, audit trails | Planned                      | Roadmap Q2 2026 |

---

## 2. Account Structure

### 2.1 Account Separation

Two primary accounts manage the DWS platform, each with distinct responsibilities:

#### Pilot / MVP Account

- **Email:** `risto.paarni2024@lifetime.fi`
- **Scope:** DWS IQ Pilot project, development environments, EU cloud infrastructure
- **Services managed:**
  - Google Cloud Run (europe-north1) — backend services, AI agents
  - Supabase (EU) — database, auth, realtime
  - Terraform state — GPU training infrastructure
  - Artifact Registry — container images
  - Secret Manager — API keys and credentials
- **API Key:** Set in `.env` (ANTHROPIC_API_KEY, GROQ_API_KEY, etc.)
- **Environment:** Development + pilot customer deployments

#### DWS 6 Cloud US (Public)

- **Account:** dws6.com (Cloudflare account)
- **Login:** Google SSO via `risto.paarni2024@lifetime.fi`
- **Scope:** Public-facing websites, store, landing pages, CDN
- **Services managed:**
  - Cloudflare Pages — dws6.com, dws10.com, onelifetime.world
  - Cloudflare Workers — edge execution, API gateway
  - Cloudflare Tunnel — secure origin connection
  - DNS management — all public domains
- **Environment:** Production (public-facing)

### 2.2 Why Two Accounts

| Concern                | Pilot Account               | US Public Account                         |
| ---------------------- | --------------------------- | ----------------------------------------- |
| **Data residency**     | EU-only (Finland)           | Global CDN (US-primary)                   |
| **GDPR scope**         | Customer data, PII, AI logs | Public content only                       |
| **Cost model**         | Pay-as-you-go compute       | Flat CDN/Pages pricing                    |
| **Security boundary**  | Backend secrets, DB access  | Static content, edge logic                |
| **CLOUD Act exposure** | None (EU providers)         | Cloudflare (US company, but content-only) |

### 2.3 Account Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DWS Platform Accounts                         │
├─────────────────────────────┬───────────────────────────────────────┤
│                             │                                       │
│  PILOT / EU CLOUD           │  US PUBLIC CLOUD                      │
│  risto.paarni2024@          │  dws6.com account                     │
│  lifetime.fi                │  (Cloudflare)                         │
│                             │                                       │
│  ┌─────────────────────┐    │  ┌─────────────────────┐              │
│  │ Google Cloud Run     │    │  │ Cloudflare Pages    │              │
│  │ europe-north1        │    │  │ dws6.com            │              │
│  │ - dws-iq-backend    │    │  │ dws10.com           │              │
│  │ - agent-lead-scout  │    │  │ onelifetime.world   │              │
│  │ - agent-outreach    │    │  │                     │              │
│  └─────────────────────┘    │  └─────────────────────┘              │
│                             │                                       │
│  ┌─────────────────────┐    │  ┌─────────────────────┐              │
│  │ Supabase (EU)        │    │  │ Cloudflare Workers  │              │
│  │ PostgreSQL + pgvector│    │  │ - dws6-dashboard    │              │
│  │ Auth + Realtime      │    │  │ - dws-iq-agent      │              │
│  └─────────────────────┘    │  │ - mcp-gateway        │              │
│                             │  └─────────────────────┘              │
│  ┌─────────────────────┐    │                                       │
│  │ Secret Manager       │    │  ┌─────────────────────┐              │
│  │ API keys, tokens     │    │  │ DNS                  │              │
│  └─────────────────────┘    │  │ dws6.com, dws10.com │              │
│                             │  └─────────────────────┘              │
├─────────────────────────────┴───────────────────────────────────────┤
│                                                                      │
│  FULL SOVEREIGNTY / AEGIS (Planned Q2 2026)                         │
│  EU AI Act compliance layer — sits on top of EU Cloud               │
│  Reasoning lineage, audit trails, Article 12 logging                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### 2.4 `risto.paarni2024@lifetime.fi` — Google Cloud inventory snapshot (May 2026)

The following inventory reflects the currently visible projects/org context when troubleshooting staging deploy permissions:

| Resource                         | Type                         | Status in account context |
| -------------------------------- | ---------------------------- | ------------------------- |
| `dws6run6`                       | Project                      | **Current**               |
| `coral-loop-494008-r2`           | Project (MCP Google Drive)   | Not current               |
| `dws-mcp-hub`                    | Project (DWS MCP Hub)        | Not current               |
| `dws-iq-pilot`                   | Project (DWS IQ Pilot)       | **Deleted 2026-07-22** (§2.4.1) |
| `dws6login`                      | Project                      | Not current               |
| `sys-28065221981339444149331534` | Project (GPT3 Demo Template) | Not current               |
| `1074856518213`                  | Organisation (`lifetime.fi`) | Not current               |

### 2.4.1 Orphaned-project cleanup (July 2026)

Triggered by the March-2027 `gsutil` deprecation notice (Google), which flagged `dws-iq-pilot` and prompted a wider audit of idle projects under `risto.paarni2024@lifetime.fi`. The May-2026 snapshot above is left intact for history; this subsection records the deltas.

**Deleted** (30-day undelete window applies — `gcloud projects undelete <id>`):

| Project | Reason | Code impact |
| ------- | ------ | ----------- |
| `dws-iq-pilot` | Idle since Apr 2026; the bundled-`gsutil` project Google flagged. CI deploy workflows that used its `github-actions-deployer` SA are `.disabled`; authoritative deploy identity had already moved to `dws-iq-60`. | `src/sandbox/cloudrun-ephemeral.ts` silently defaulted to it — repointed to derive project/image/SA from `GOOGLE_CLOUD_PROJECT` / `AGENT_RUNNER_IMAGE` and **fail loud** if unset. |
| `gen-lang-client-0339803660` (Kaggle101125) | Google AI Studio project from the Nov-2025 DWS6 build push; no recent access, no charges. | None — no repo references. |

**Kept — verify credential/SA before any future deletion** (all are Google-integration projects whose value lives in OAuth clients / API keys, which do **not** appear in bucket/Cloud Run/Compute listings, so an empty resource audit is not proof they are unused):

| Project | Backs | Verify before deleting |
| ------- | ----- | ---------------------- |
| `dws6login` | OAuth sign-in for dws6 | `console.cloud.google.com/apis/credentials?project=dws6login` |
| `coral-loop-494008-r2` | Google Drive MCP connector (OAuth) | Drive connector still in use? |
| `gen-lang-client-0279605237` (Gemini API) | Gemini API key(s) | Any live key referencing this project |
| `dws-mcp-hub` | Not referenced as a cloud project (the code hits are a local Docker/Temporal name collision) | `gcloud iam service-accounts list --project=dws-mcp-hub` |

**Never delete:** `lifetime.fi` (org root), `system-gsuite`, `apps-script`, `sys-…` (GPT3 Demo Template) — Google-managed, auto-recreated.

**Tooling:** run `scripts\gcp-project-audit.cmd [project-ids…]` (read-only) for a repeatable inventory before deleting anything. Note: a bare `gcloud run/compute list` on a project with the API disabled will offer to enable it — the audit script suppresses that prompt; if you list manually and accidentally enable an API, disable it with `gcloud services disable <api> --project=<id> --force`.

---

## 3. Cloud Environment Overview

### 3.1 US Cloud (Public) — Current

**Purpose:** Serve public-facing content globally with low latency.

**What runs here:**

- Static landing pages (dws6.com, dws10.com, onelifetime.world)
- DWS IQ Dashboard frontend (Cloudflare Pages)
- Edge API gateway (Cloudflare Workers)
- Product store and payment redirects

**What does NOT run here:**

- Customer data processing
- AI model inference
- Database operations
- Authentication backend

**Deployment:**

- Push to `main` → Cloudflare Pages auto-deploy
- Workers deployed via `wrangler` CLI
- Root folders (`dws6.com/`, `dws10.com/`) → Workers (testing)
- Landing pages folders (`landing-pages/dws6-com/`, etc.) → Pages (production)

### 3.2 EU Cloud (Development + Production Backend) — Current

**Purpose:** All computation, data storage, AI inference, and customer-facing backend.

**Google Cloud Project:** `dws6run6` (admin@dws6.com)

**What runs here:**

- Express.js backend on Cloud Run (europe-north1)
- AI agent services (Lead Scout, Outreach, Discovery, Meeting, Proposal, Customer Success)
- MCP Hub orchestration
- **MCP Gateway on Cloud Run** — Streamable HTTP transport for mobile Claude Code sessions (Supabase + GitHub tools)
- Supabase PostgreSQL + pgvector
- Temporal.io workflow engine (development)
- LLM training infrastructure (on-demand GPU bursting)

**Provider stack:**

| Layer    | Provider                 | Region                  | Purpose                                                                                       |
| -------- | ------------------------ | ----------------------- | --------------------------------------------------------------------------------------------- |
| Compute  | Google Cloud Run         | europe-north1 (Finland) | Backend API, agents — **active (onboarding phase)**                                           |
| Compute  | Scaleway Serverless      | fr-par (France)         | Customer Tier 2 sovereignty deployments — **dormant, activate on first sovereignty customer** |
| Training | Scaleway H100 GPU        | fr-par (France)         | LWM 1 / LWM 2 training — **planned, not yet scheduled**                                       |
| Database | Supabase                 | EU (Frankfurt/Helsinki) | PostgreSQL, auth, realtime                                                                    |
| Secrets  | Google Secret Manager    | europe-north1           | API keys, credentials ✅ Enabled                                                              |
| Images   | Google Artifact Registry | europe-north1           | Container registry                                                                            |
| Training | Google Compute (A3 mega) | europe-north1           | On-demand H100 GPU                                                                            |

> **Phase note (2026-04-28):** Google Cloud Run is the active backend during the pre-customer / onboarding phase (no per-idle cost). Scaleway Serverless becomes the deployment target for customer Tier 1 & 2 environments once the first paying customer or investor pilot starts — its EU residency (fr-par) and sovereign positioning are the deciding factors.

### 3.2.1 Deployment Tier Choice: GCP Primary vs Scaleway Sovereign

Two deployment paths exist. The choice is customer-driven, not a migration — both run in parallel once Tier 2 customers onboard.

| Tier                      | Provider                       | Region                  | Activated when                                                        | CI/CD workflow                                  |
| ------------------------- | ------------------------------ | ----------------------- | --------------------------------------------------------------------- | ----------------------------------------------- |
| **Tier 1 — Default EU**   | Google Cloud Run               | europe-north1 (Finland) | Always (current)                                                      | `deploy-cloudrun.yml`, `deploy-staging.yml`     |
| **Tier 2 — Sovereign EU** | Scaleway Serverless Containers | fr-par (France)         | Customer explicitly requests sovereignty / non-CLOUD Act jurisdiction | `deploy-scaleway_OLD.yml` (dormant — see below) |
| **Training (LWM)**        | Scaleway H100 GPU              | fr-par (France)         | LWM 1 / LWM 2 training runs                                           | Manual / to be automated                        |

**Scaleway account:** org `78e26603-c820-4617-b0d2-f8589eb7693b` (Lifetime Oy), project `dws-backend`, region `fr-par`. Login via Google OAuth (admin6 Chrome profile). Full setup: `docs/field-notes/scaleway-infrastructure-setup.md`.

#### CI/CD workflow: `deploy-scaleway_OLD.yml`

The `_OLD` suffix is **misleading** — this is intentionally dormant infrastructure, not abandoned. The workflow is preserved and ready to activate. It was filed as `_OLD` to suppress it from the default CI matrix while GCP is the sole active backend.

**Activation steps when a Tier 2 customer onboards:**

1. Rename `deploy-scaleway_OLD.yml` → `deploy-scaleway.yml` (removes it from the suppression pattern).
2. Verify Scaleway container namespace and env vars are current (see `scaleway-infrastructure-setup.md`).
3. Update the workflow's branch trigger and `PROJECT_ID` / namespace ID if they have drifted.
4. Wire the Stripe webhook to the Scaleway endpoint `captivating-splendor` (ID `we_1TPfyGAK2DZTbwRFTuzNhaqT`) for that tenant.

**Do not delete this workflow.** It is the only CI path for Scaleway deployments and encodes the container build + push steps for `fr-par`.

#### LWM training on Scaleway H100

Scaleway GPU (H100) is the candidate for LWM 1 and LWM 2 training runs due to EU residency and competitive H100 pricing vs GCP A3. Current GCP A3 (H100 burst) in europe-north1 is the active training path; Scaleway H100 is the planned alternative when training volume justifies a dedicated EU-sovereign GPU node. CI/CD automation for training runs is not yet wired — add to `scripts/on-deploy/` or a dedicated `train-lwm.yml` workflow when the first training run is scheduled.

**Enabled Google Cloud APIs:**

- **Secret Manager API** (`secretmanager.googleapis.com`) — Stores sensitive data such as API keys, passwords, and certificates. Provides convenience while improving security. (Google Enterprise API, Public API, Status: Enabled)

### 3.2.2 DGX Spark — Actual Primary Compute (Self-Hosted, Zero Marginal Cost)

**This section corrects a long-standing gap: prior to v2.4, this document did not mention DGX Spark anywhere, despite it being the environment the backend and all scheduled work actually run on today.** Cloud Run (§3.2, §4) remains live and is the correct target for secondary/staging traffic and anything that must be reachable without depending on a single self-hosted box, but it is no longer the primary 24/7 runtime.

| Property    | Value                                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Hardware    | Acer Veriton GN100 — NVIDIA Grace Blackwell GB10, 128GB RAM, ARM64                                                                                                       |
| Location    | Self-hosted (Lifetime Oy premises, Finland) — zero CLOUD Act exposure, zero marginal compute cost                                                                        |
| Runtime     | Docker Compose (`infrastructure/dgx-spark/docker-compose.yml`) — `dws-backend` (Express + all agents + node-cron schedulers) and `dws-cron` (script runner) containers   |
| Deploy      | `.github/workflows/deploy-dgx-spark.yml` — push to `main` triggers SSH + `git reset --hard` + `docker compose build && up -d`, fully automatic, no human action required |
| LLM routing | Local Ollama (`nemotron-3-super`, `qwen3-coder:30b`) primary, Groq API fallback                                                                                          |
| Heartbeat   | `:9999/health`, used by the failover tiers below                                                                                                                         |

**Scheduling is DGX-primary, not GitHub-Actions-primary.** All 31 daily and 16 weekly scripts (`scripts/daily/`, `scripts/weekly/`) run on DGX Spark's cron, auto-discovered by a day-runner. GitHub Actions' own `schedule:` triggers were deliberately removed from 20 previously-scheduled workflows during the April–May 2026 migration (each carries a `# Schedule REMOVED ... DGX Spark is primary` comment) and now survive only as manual `workflow_dispatch` failover. This cut GHA usage from ~2,250 min/month (~$18) to ~415–515 min/month (~$3.32–4.12), a ~78% reduction. Full detail: `Cron-works.md`.

**Three-tier failover** (documented in `Cron-works.md`, orchestrated via `skills/cron/SKILL.md`):

| Tier             | What                                                                                                                            | Trigger condition                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 1 — Primary      | DGX Spark cron, 24/7, free                                                                                                      | Always, unless heartbeat fails                                                   |
| 2 — Local backup | Claude Desktop Scheduled Tasks (5 critical jobs: db backup, TED pipeline, morning briefing, security audit, construction leads) | Heartbeat check fails → HIL email alert → SSH first-aid restart → local fallback |
| 3 — Cloud backup | GitHub Actions `workflow_dispatch` (manual)                                                                                     | Desktop app closed / laptop off                                                  |

**Why this matters for the Cloudflare question:** DGX Spark is already the zero-cost, EU-sovereign compute tier. Any new workload evaluation should check DGX Spark fit _first_, Cloudflare Workers second (edge reach, still cheap, but real Workers CPU-time billing at scale), and Cloud Run/GCP third (paid, EU-resident but not self-hosted) — reversing the historical GCP-first framing earlier sections of this document still carry. See Section 12.1 for the concrete application of this ordering to the MCP Gateway.

### 3.3 Full Sovereignty (Aegis) — Planned Q2 2026

**Purpose:** Dedicated compliance layer for EU AI Act Article 12, reasoning lineage, and audit trail management.

See [Section 7](#7-full-sovereignty-aegis--eu-ai-act-compliance-layer) for full specification.

---

## 4. DWS 6 — Cloud Environments

DWS IQ 6 is the current pilot platform. Its cloud deployment is split across US (public content) and EU (backend + data).

### 4.1 Current Architecture

```
User → Cloudflare CDN (US/Global) → Static frontend
         ↓ (API calls)
       Cloudflare Workers (edge) → Google Cloud Run (EU) → Supabase (EU)
         ↓ (AI inference)
       Claude API / Groq API (external)
```

### 4.2 DWS 6 Services by Environment

| Service            | US Cloud           | EU Cloud                                           | Notes                                                                                                                                                                                                              |
| ------------------ | ------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Landing pages      | Cloudflare Pages   | —                                                  | dws6.com, dws10.com — **live**                                                                                                                                                                                     |
| Dashboard frontend | Cloudflare Pages   | —                                                  | v10-react SPA — **live**                                                                                                                                                                                           |
| Backend API        | —                  | DGX Spark (primary), Cloud Run (secondary/staging) | Express.js, port 8080. DGX Spark runs it 24/7 self-hosted at zero marginal cost — see §3.2.2. Cloud Run remains live for staging/failover                                                                          |
| AI Agents          | —                  | DGX Spark (primary), Cloud Run (secondary)         | 6 agent services — same primary/secondary split as Backend API                                                                                                                                                     |
| Database           | —                  | Supabase EU                                        | PostgreSQL + pgvector — **live**                                                                                                                                                                                   |
| Auth               | —                  | Supabase Auth                                      | JWT, GitHub SSO (Google login removed by Supabase)                                                                                                                                                                 |
| MCP Hub            | —                  | DGX Spark / Cloud Run / Docker                     | Agent orchestration                                                                                                                                                                                                |
| Monitoring         | —                  | Prometheus + Grafana                               | Docker Compose (dev)                                                                                                                                                                                               |
| Edge API           | Cloudflare Workers | —                                                  | **Designed, mostly not deployed.** 8 workers exist in `src/cloudflare/`; a live account check confirms only 1 (`dws-revolut-checkout`) is actually running — 0 KV namespaces exist to back the other 7. See §12.1. |

### 4.3 DWS 6 Deployment Configuration

**Backend (EU):**

- `cloudbuild.yaml` — CI/CD to Cloud Run (europe-north1)
- `Dockerfile` — Multi-stage Node 22-alpine build
- `AgentFoundry/cloudbuild.yaml` — Agent-specific CI/CD
- Auto-scaling: 0–10 instances, 80 concurrency, 60s timeout

**Frontend (US/Global):**

- `wrangler.toml` — Cloudflare Workers config
- GitHub → Cloudflare Pages auto-deploy (main branch)
- SSL, brotli compression, minification enabled

#### Staging deployment project alignment (critical)

For GitHub Actions staging deploys (Cloud Run + Artifact Registry), `PROJECT_ID` must match the active backend project in this account context: **`dws6run6`**.

- Expected image path pattern: `europe-north1-docker.pkg.dev/dws6run6/...`
- Using `dws6-backend` in workflow/env with a key from `dws6run6` causes IAM/resource mismatch failures (for example `artifactregistry.repositories.uploadArtifacts denied`).

### 4.4 DWS 6 Cloud IAM Bindings

Project-level IAM bindings required for the `dws-iq-backend` image to build, push, and deploy from Cloud Build to Artifact Registry → Cloud Run (all in `europe-north1`).

**Project:** `dws6run6` · **Project number:** `1074393862472`
**Artifact Registry repo:** `europe-north1-docker.pkg.dev/dws6run6/dws-iq-repo`

| Principal                                              | Role                                   | Scope              | Purpose                                                                                                                                 | Granted    |
| ------------------------------------------------------ | -------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `1074393862472@cloudbuild.gserviceaccount.com`         | `roles/cloudbuild.builds.builder`      | Project            | Execute Cloud Build jobs (baseline).                                                                                                    | Default    |
| `1074393862472@cloudbuild.gserviceaccount.com`         | `roles/artifactregistry.admin`         | Project            | ⚠️ OBSOLETE — granted to the wrong SA (see "Gotcha" below). Safe to remove.                                                             | 24.04.2026 |
| `1074393862472@cloudbuild.gserviceaccount.com`         | `roles/artifactregistry.repoAdmin`     | Repo `dws-iq-repo` | ⚠️ OBSOLETE — granted to the wrong SA (see "Gotcha" below). Safe to remove.                                                             | 24.04.2026 |
| `1074393862472-compute@developer.gserviceaccount.com`  | `roles/cloudbuild.builds.editor`       | Project            | Compute SA used by triggers.                                                                                                            | Default    |
| `1074393862472-compute@developer.gserviceaccount.com`  | `roles/logging.logWriter`              | Project            | Write build/runtime logs.                                                                                                               | Default    |
| `1074393862472-compute@developer.gserviceaccount.com`  | `roles/storage.admin`                  | Project            | Source tarball + build artifacts in GCS.                                                                                                | Default    |
| `1074393862472-compute@developer.gserviceaccount.com`  | `roles/artifactregistry.writer`        | Repo `dws-iq-repo` | **Effective push permission.** Cloud Build runs as this SA (see Gotcha); grants push to `dws-iq-backend`. Confirmed working 24.04.2026. | 24.04.2026 |
| `service-1074393862472@gcp-sa-cloudbuild.iam...`       | `roles/cloudbuild.serviceAgent`        | Project            | Cloud Build service agent (Google-managed).                                                                                             | Default    |
| `service-1074393862472@serverless-robot-prod.iam...`   | `roles/run.serviceAgent`               | Project            | Cloud Run service agent (Google-managed).                                                                                               | Default    |
| `service-1074393862472@containerregistry.iam...`       | `roles/containerregistry.ServiceAgent` | Project            | Legacy GCR service agent.                                                                                                               | Default    |
| `service-1074393862472@gcp-sa-artifactregistry.iam...` | `roles/artifactregistry.serviceAgent`  | Project            | Artifact Registry service agent (auto-created 24.04.2026 when first repo was provisioned).                                              | 24.04.2026 |
| `admin@dws6.com`                                       | `roles/owner`                          | Project            | Human owner.                                                                                                                            | Default    |

#### Gotcha — Cloud Build runs as the Compute SA, not the Cloud Build SA (2024+ default)

Since Google's mid-2024 default change, **new projects (including `dws6run6`) run Cloud Build jobs as the Compute Engine default SA** (`<project-number>-compute@developer.gserviceaccount.com`), **not** the legacy Cloud Build SA (`<project-number>@cloudbuild.gserviceaccount.com`). Verified on 24.04.2026 via:

```cmd
gcloud builds list --limit=3 --format="table(id,status,serviceAccount,createTime)"
```

Output showed `SERVICE_ACCOUNT = projects/dws6run6/serviceAccounts/1074393862472-compute@developer.gserviceaccount.com` for all three failed builds. This is why the first two IAM grants (Steps 2 and 3 below, both targeting `1074393862472@cloudbuild.gserviceaccount.com`) did not fix the push — they went to the wrong principal for this project. Only Step 4, which targets the Compute SA, was effective.

**Push failure resolved 24.04.2026.** Cloud Build push to Artifact Registry failed with `denied: Permission 'artifactregistry.repositories.uploadArtifacts' denied on resource (or it may not exist).` Three root causes, resolved in sequence:

1. The repository did not yet exist in `europe-north1` (hence "or it may not exist" in the error).
2. Even after creating the repo, the Cloud Build SA lacked write permission.
3. **Most importantly:** the Cloud Build SA we were granting is not the principal Cloud Build actually uses for this project — the Compute SA is (see Gotcha).

**Step 1 — Create the Docker repository in `europe-north1`:**

```cmd
gcloud artifacts repositories create dws-iq-repo ^
    --repository-format=docker ^
    --location=europe-north1 ^
    --description="Docker repository for DWS IQ Backend"
```

Side effect: Google auto-provisioned the Artifact Registry service agent `service-1074393862472@gcp-sa-artifactregistry.iam.gserviceaccount.com` with `roles/artifactregistry.serviceAgent` on first use of the API (recorded in table above).

**Step 2 — Grant the legacy Cloud Build SA (⚠️ ineffective — wrong SA; kept here for audit history):**

```cmd
gcloud projects add-iam-policy-binding dws6run6 ^
    --member="serviceAccount:1074393862472@cloudbuild.gserviceaccount.com" ^
    --role="roles/artifactregistry.admin"
```

**Step 3 — Tighten the Step 2 grant to repo scope (⚠️ also ineffective — wrong SA; kept for audit history):**

```cmd
gcloud artifacts repositories add-iam-policy-binding dws-iq-repo ^
    --location=europe-north1 ^
    --member="serviceAccount:1074393862472@cloudbuild.gserviceaccount.com" ^
    --role="roles/artifactregistry.repoAdmin"
```

**Step 4 — Grant the Compute SA push rights on the repo (✅ the actual fix):**

```cmd
gcloud artifacts repositories add-iam-policy-binding dws-iq-repo ^
    --location=europe-north1 ^
    --member="serviceAccount:1074393862472-compute@developer.gserviceaccount.com" ^
    --role="roles/artifactregistry.writer"
```

After Step 4, `gcloud builds submit` push succeeded (build id `5fcd7368-cc55-4ebf-b4bb-473c9c2ff54a`, digest `sha256:e1ecbd6c6ab15a7dd8e81ef5d700459355eded6abb5f72c3e63051ee78b93ff2`).

**Cleanup (recommended, non-blocking).** The Step 2 and Step 3 grants to `1074393862472@cloudbuild.gserviceaccount.com` are now dead weight — the SA is unused by Cloud Build in this project. Remove them to reduce blast radius:

```cmd
:: Remove Step 2 (project-level)
gcloud projects remove-iam-policy-binding dws6run6 ^
    --member="serviceAccount:1074393862472@cloudbuild.gserviceaccount.com" ^
    --role="roles/artifactregistry.admin"

:: Remove Step 3 (repo-scoped)
gcloud artifacts repositories remove-iam-policy-binding dws-iq-repo ^
    --location=europe-north1 ^
    --member="serviceAccount:1074393862472@cloudbuild.gserviceaccount.com" ^
    --role="roles/artifactregistry.repoAdmin"
```

### 4.5 DWS 6 Cloud Run Deployment Pattern (Standard)

Operational standard for deploying the `dws-iq-backend` container to Cloud Run. Enforces EU residency, Secret Manager for sensitive values, and separation of concerns between runtime config and secret material. Applies to any future Cloud Run service in this project; new services should follow the same pattern.

> **Why this pattern is superior for rotation.** The same script + the same source file handles both **initial provisioning** and **key rotation** identically — no separate "update" path, no bespoke rotation scripts per credential. Update the value in the source file, re-run `Provision-DwsIqSecrets.ps1`, and Secret Manager creates a new version alongside the old one (idempotent: new secret → `Created version [1]`; existing secret → `Created version [2]`, `[3]`, …). Because the Cloud Run deploy references each secret as `:latest`, the next revision-start picks up the new version automatically — rotating one credential, rotating all seven at once, or rotating a single key after a suspected leak all follow the exact same three lines. No redeploy pipeline needed; a `gcloud run services update --update-env-vars="SECRET_ROTATION_NONCE=<timestamp>"` triggers the next revision to fetch the new values. Old versions remain enabled by default as a rollback path until you explicitly `destroy` them. Contrast with `--set-env-vars` (rotation = edit the deploy command + redeploy + the old value is in build/deploy logs forever) or with per-service credential files (rotation = edit N files, commit, redeploy each).

#### Principles

1. **Secrets live in Secret Manager, not env-vars.** Values passed via `--set-env-vars` land in the Cloud Run service spec in plaintext and are visible to anyone with `run.services.get`. Values passed via `--set-secrets` are resolved from Secret Manager at revision-start time and are never persisted into the spec.
2. **User-managed replication pinned to `europe-north1`.** Guarantees the encrypted material never leaves EU region, satisfying DWS EU data-residency commitments.
3. **Runtime SA has least privilege per secret.** The Cloud Run worker SA (the Compute Engine default SA in `dws6run6`; see §4.4 Gotcha) is granted `roles/secretmanager.secretAccessor` on each secret individually, not project-wide.
4. **Env vars are for non-secret config only.** `NODE_ENV`, `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `PORT` — values you'd commit to source control and can log without consequence.
5. **Never paste secrets into chat, terminal scrollback, or `--data` flags.** Use `--data-file=<path>` referencing a temp file that is zero-filled and deleted after upload. The provisioning script does this automatically.
6. **One secret per logical credential, not per service.** A single `stripe-secret-key` is referenced by multiple services (checkout, webhook, billing); rotating it once rotates everywhere.

#### Provisioning workflow (one-time per secret, or on rotation)

Use `scripts/Provision-DwsIqSecrets.ps1` — PowerShell-first per DWS standard, reads a local `.env`-style or gcloud-command-style file, uploads only recognised backend secrets, grants runtime access:

```powershell
# Preview what would be uploaded (no changes)
.\scripts\Provision-DwsIqSecrets.ps1 `
  -SecretsFile "<path to local secrets file>" `
  -DryRun

# Apply
.\scripts\Provision-DwsIqSecrets.ps1 `
  -SecretsFile "<path to local secrets file>"
```

The script:

- Accepts any text file containing `KEY=value` pairs (regex-based, word-bounded, quoted or unquoted, handles `--set-env-vars="K=v,K=v"` command snippets too).
- Maps each recognised env name to a kebab-case secret name (`SUPABASE_SERVICE_KEY` → `supabase-service-key`).
- Supports aliases so source files written to canonical naming (`SUPABASE_SERVICE_ROLE_KEY`) resolve to the backend's lookup name without duplication.
- Per-secret temp file at `%TEMP%`, overwritten with zeros before delete — never passes values on a command line or via stdin pipe.
- Creates secret with `--replication-policy="user-managed" --locations=europe-north1` on first run; adds a new version on subsequent runs (rotation-friendly, no downtime).
- Grants `roles/secretmanager.secretAccessor` to the runtime SA on each secret.

After provisioning, delete the local source file or move it to encrypted storage. Plaintext credentials on disk are the last mile of exposure.

#### Required backend secrets (current inventory)

| Env var (in code)                                    | Secret Manager name     | Source                                                                        |
| ---------------------------------------------------- | ----------------------- | ----------------------------------------------------------------------------- |
| `STRIPE_SECRET_KEY`                                  | `stripe-secret-key`     | Stripe dashboard → Developers → API keys (live mode)                          |
| `STRIPE_WEBHOOK_SECRET`                              | `stripe-webhook-secret` | Stripe dashboard → Webhooks → endpoint detail → Signing secret (`whsec_…`)    |
| `SUPABASE_URL`                                       | `supabase-url`          | Supabase project → Settings → API                                             |
| `SUPABASE_ANON_KEY`                                  | `supabase-anon-key`     | Supabase project → Settings → API → `anon/public`                             |
| `SUPABASE_SERVICE_KEY` / `SUPABASE_SERVICE_ROLE_KEY` | `supabase-service-key`  | Supabase project → Settings → API → `service_role`                            |
| `JWT_SECRET`                                         | `jwt-secret`            | Generated: 64-char hex via `(1..64).ForEach{'{0:x}' -f (Get-Random -Max 16)}` |
| `SMTP_USER`                                          | `smtp-user`             | AWS SES → SMTP credentials (20-char `AKIA…` IAM key)                          |
| `SMTP_PASS`                                          | `smtp-pass`             | AWS SES → SMTP credentials (44-char derived password)                         |

#### Deploy command (canonical)

```cmd
gcloud run deploy dws-iq-backend ^
  --image=europe-north1-docker.pkg.dev/dws6run6/dws-iq-repo/dws-iq-backend:latest ^
  --region=europe-north1 ^
  --platform=managed ^
  --port=8080 ^
  --memory=512Mi ^
  --concurrency=80 ^
  --timeout=60 ^
  --set-env-vars="NODE_ENV=production,EMAIL_FROM=risto@onelifetime.world,SMTP_HOST=email-smtp.eu-north-1.amazonaws.com,SMTP_PORT=587,SMTP_SECURE=false" ^
  --set-secrets="STRIPE_SECRET_KEY=stripe-secret-key:latest,STRIPE_WEBHOOK_SECRET=stripe-webhook-secret:latest,SUPABASE_URL=supabase-url:latest,SUPABASE_ANON_KEY=supabase-anon-key:latest,SUPABASE_SERVICE_KEY=supabase-service-key:latest,SUPABASE_SERVICE_ROLE_KEY=supabase-service-key:latest,JWT_SECRET=jwt-secret:latest,SMTP_USER=smtp-user:latest,SMTP_PASS=smtp-pass:latest"
```

Notes:

- `SUPABASE_SERVICE_KEY` and `SUPABASE_SERVICE_ROLE_KEY` both point to the same secret. Current code reads both names across different modules (Article 12 logger uses the canonical, everything else uses the short form). Until the code is unified to one name, both env-var names must be set.
- `--set-secrets` references `:latest` — so a new secret version via `gcloud secrets versions add` is picked up on the next revision without editing the deploy command.
- Memory/concurrency/timeout tuned for current load; revise upward if P95 startup exceeds 10 s or container hits OOM.
- `--allow-unauthenticated` is **not** included in the baseline. Public ingress requires a separate `gcloud run services add-iam-policy-binding ... --member=allUsers --role=roles/run.invoker` step and may be blocked by org policy; apply only to services that must accept anonymous traffic (webhooks, buyer endpoints).

#### Rotation playbook

Rotating a secret does not require a redeploy if the deploy used `:latest`:

```powershell
# 1. Push new version to Secret Manager
.\scripts\Provision-DwsIqSecrets.ps1 -SecretsFile "<new-value-file>"

# 2. Force Cloud Run to pick up the new version on next revision
gcloud run services update dws-iq-backend --region=europe-north1 --project=dws6run6 --update-env-vars="SECRET_ROTATION_NONCE=$(Get-Date -Format 'yyyyMMddHHmmss')"

# 3. After verifying new revision healthy, destroy the old version
gcloud secrets versions destroy <old-version> --secret=<secret-name> --project=dws6run6
```

#### Security benefits vs. naïve `--set-env-vars`

| Risk                                                | `--set-env-vars`        | `--set-secrets` (this pattern)   |
| --------------------------------------------------- | ----------------------- | -------------------------------- |
| Secret visible in service spec (`run.services.get`) | Yes                     | No (only reference visible)      |
| Secret rotation requires redeploy                   | Yes                     | No (bump version, nonce env)     |
| Per-secret audit trail                              | No                      | Yes (Secret Manager access logs) |
| Per-secret IAM scope                                | No (all env vars equal) | Yes (secretAccessor per secret)  |
| EU residency guarantee                              | Inherits service region | Explicit `user-managed` lock     |
| Rotation without running a deploy pipeline          | No                      | Yes                              |

#### Public ingress (required for Stripe webhooks + buyer redirects)

Cloud Run services are private by default — `403 Forbidden` to anonymous clients. The B2B payment stack must accept anonymous traffic for two reasons:

- **Stripe webhooks** originate from Stripe's network and cannot authenticate to your Workspace domain.
- **Buyer redirect pages** (Stripe Checkout return URLs) are browser-origin GETs.

In a Workspace org with default settings, two layers will block public access. Both must be addressed:

**Layer 1 — Org policy `iam.allowedPolicyMemberDomains`** (domain-restricted sharing). Default-on for Workspace orgs. Treats `allUsers` as a non-domain principal and rejects any IAM binding that includes it. Diagnostic symptom on `gcloud run services add-iam-policy-binding ... --member=allUsers`:

```text
ERROR: (gcloud.run.services.add-iam-policy-binding) FAILED_PRECONDITION:
One or more users named in the policy do not belong to a permitted customer,
perhaps due to an organization policy.
```

Override at the **project level** (requires `roles/orgpolicy.policyAdmin`; project owner usually has it):

```powershell
# Enable the API once per project
gcloud services enable orgpolicy.googleapis.com --project=dws6run6

# Write the override
@"
name: projects/dws6run6/policies/iam.allowedPolicyMemberDomains
spec:
  rules:
  - allowAll: true
"@ | Out-File -FilePath "$env:TEMP\policy.yaml" -Encoding utf8 -NoNewline

gcloud org-policies set-policy "$env:TEMP\policy.yaml"
Remove-Item "$env:TEMP\policy.yaml"
```

**Layer 2 — Cloud Run IAM** — bind `allUsers` to `roles/run.invoker` on the service:

```cmd
gcloud run services add-iam-policy-binding dws-iq-backend ^
    --region=europe-north1 ^
    --member="allUsers" ^
    --role="roles/run.invoker" ^
    --project=dws6run6
```

If you lack `policyAdmin`, the alternative is an HTTPS Load Balancer + serverless NEG fronting a Cloud Run service set to `--ingress=internal-and-cloud-load-balancing`. The LB authenticates to Cloud Run as itself (no `allUsers` binding needed), satisfying the org policy.

#### Stripe webhook wiring

| Item                 | Value                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloud Run service    | `dws-iq-backend` (europe-north1)                                                                                                                                                                                                                              |
| Mounted route        | `POST /webhooks/stripe` (in `src/app.ts`; route file `src/routes/stripe-webhook.routes.ts`)                                                                                                                                                                   |
| **Full webhook URL** | `https://dws-iq-backend-1074393862472.europe-north1.run.app/webhooks/stripe`                                                                                                                                                                                  |
| Signing secret env   | `STRIPE_WEBHOOK_SECRET` → Secret Manager `stripe-webhook-secret`                                                                                                                                                                                              |
| Stripe destination   | `charming-serenity` (live mode, account `acct_1GH00mAK2DZTbwRF`)                                                                                                                                                                                              |
| Subscribed events    | 7 (see handler in `src/routes/stripe-webhook.routes.ts`): `invoice.payment_succeeded`, `invoice.payment_failed`, `invoice.payment_action_required`, `invoice.payment_attempt_required`, `invoice.marked_uncollectible`, `charge.refunded`, `customer.deleted` |

The path is **`/webhooks/stripe`** — not `/api/...` or `/api/stripe/webhook`. Mount comes from `app.use('/webhooks/stripe', stripeWebhookRoutes)`.

#### Smoke-test recipes (no Stripe involvement, no signed events)

Three single-curl tests prove each stage of the chain in turn. Run from PowerShell on Win11:

**Test 1 — Liveness (proves service is reachable + public):**

```powershell
curl https://dws-iq-backend-1074393862472.europe-north1.run.app/livez
```

Expected: `HTTP 200` body `{"status":"alive","timestamp":"…"}`.

**Test 2 — Webhook reachability + raw-body chain (timestamp window):**

```powershell
curl -X POST "https://dws-iq-backend-1074393862472.europe-north1.run.app/webhooks/stripe" `
  -H "Content-Type: application/json" `
  -H "Stripe-Signature: t=123,v1=fake" `
  -d "{}"
```

Expected: `HTTP 400` body `{"error":"Request too old"}`. Proves: route mounted, `preserveRawBody` consumed the stream (no hang), timestamp validation ran, t=123 (epoch 1970) correctly rejected as outside the ±300s window.

**Test 3 — Full HMAC chain (current timestamp + 64-char fake signature):**

```powershell
curl -X POST "https://dws-iq-backend-1074393862472.europe-north1.run.app/webhooks/stripe" `
  -H "Content-Type: application/json" `
  -H "Stripe-Signature: t=$([DateTimeOffset]::UtcNow.ToUnixTimeSeconds()),v1=0000000000000000000000000000000000000000000000000000000000000000" `
  -d "{}"
```

Expected: `HTTP 403` body `{"error":"Invalid signature"}`. Proves: timestamp inside window, HMAC computed against `STRIPE_WEBHOOK_SECRET` from Secret Manager, mismatch detected and rejected.

If Test 3 returns `{"error":"Invalid webhook"}` instead, the v1 string passed wasn't 64 hex chars — `crypto.timingSafeEqual()` throws on length mismatch and the catch block returns the generic 400. Real Stripe events always ship 64-char hex signatures, so production traffic gets the proper 403/200 responses.

#### Pitfalls discovered & captured (do not repeat)

1. **Express `json()` consumes the raw stream.** `stripe-webhook.middleware.ts:preserveRawBody` reads via `req.on('data') / req.on('end')`. If `app.use(express.json(...))` is mounted globally before the webhook route, the stream is consumed and the data/end events never fire — the request hangs until Cloud Run kills it at the 60s timeout, returning `upstream request timeout`. Fix: skip `express.json` and `express.urlencoded` for any path under `/webhooks/stripe`. See `src/app.ts` body-parsers block.

2. **Cloud Build runs as the Compute SA, not the Cloud Build SA.** Per-project default since 2024 (see §4.4 Gotcha). All push and runtime IAM bindings must target `<project-number>-compute@developer.gserviceaccount.com`, not the legacy `<project-number>@cloudbuild.gserviceaccount.com`. Verify via `gcloud builds list --limit=1 --format="value(serviceAccount)"`.

3. **`tsconfig.json` excludes ≠ runtime stubs.** Folders like `src/firehorse`, `src/mcp`, `src/investor-reports` are excluded from the compiled tree, but if `app.ts` imports from them, the runtime crashes with `ERR_MODULE_NOT_FOUND` because dist/ has no corresponding `.js`. `@ts-ignore` only silences the compiler — it does not provide a runtime fallback. Fix: define `let` stubs (`express.Router()`, no-op functions) at module scope so the imports compile and the routes still mount as 404 routers.

4. **Node 22 ESM requires explicit `.js` extensions on relative imports.** `import { x } from '../foo/bar'` compiles fine but fails at runtime. Always end relative imports with `.js`.

5. **Webhook URL path is `/webhooks/stripe`** — not `/api/stripe/webhook`. Defined by `app.use('/webhooks/stripe', stripeWebhookRoutes)` in `src/app.ts`. Match it in the Stripe dashboard endpoint config.

6. **`crypto.timingSafeEqual` throws on length mismatch.** The catch block in the webhook middleware then returns generic 400 `{"error":"Invalid webhook"}`. Real Stripe signatures are always 64 hex chars; the only time you see this generic error is during smoke testing with truncated fake signatures.

#### Scaling note — single-tenant today, multi-tenant when 100+ customers onboard

This deployment standard is intentionally **single-tenant**: one Cloud Build trigger, one Cloud Run service (`dws-iq-backend`), one Stripe webhook endpoint, one shared secret inventory. That fit is correct for the **internal Lifetime Oy billing use case** the stack ships today (one merchant, one set of payment credentials, audit boundary = the project).

When customer onboarding crosses ~100 active tenants — or earlier if any tenant brings their own Stripe account, their own Supabase project, their own data residency requirement — this pattern will need a rework. Re-evaluation triggers (any one is sufficient):

- **>100 tenants** with shared Stripe/Supabase: revisit per-tenant config, queue isolation, fair-use rate limits, log partitioning.
- **First customer demanding their own Stripe account**: per-tenant `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` — current single-secret pattern ends here.
- **First customer outside EU residency**: separate Cloud Run service in their region, separate Secret Manager replica, separate trigger.
- **First customer requesting non-CLOUD-Act jurisdiction**: migrate that tenant's plane to Aiven / Scaleway (per §6/§7), keep the rest on GCP.

Rework dimensions to consider when the time comes (do **not** preemptively build):

| Dimension           | Single-tenant today            | Multi-tenant target                                                                                                                  |
| ------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Cloud Run service   | one (`dws-iq-backend`)         | per-tenant or per-region cluster, behind Cloud Load Balancer with tenant-aware routing                                               |
| Cloud Build trigger | one (`dws-iq-backend-main`)    | per-region templated triggers; tenant-id substitution via `_TENANT` substitution variable                                            |
| Secrets             | one shared set                 | per-tenant prefix (`stripe-secret-key-tenant-<id>`); script becomes `Provision-Tenant-Secrets.ps1`                                   |
| Stripe webhook      | one endpoint                   | one per merchant Stripe account; signed-secret per endpoint; `STRIPE_WEBHOOK_SECRET` becomes a lookup keyed by Stripe-Account header |
| Supabase            | one project (service-role)     | shared project with RLS by tenant_id, **or** Supabase-managed branching, **or** per-tenant project for highest-isolation tier        |
| Audit logs          | shared GCP audit               | per-tenant log sink for SOC2 / customer audit access                                                                                 |
| Org policy override | project-level `allowAll: true` | re-evaluate; possibly tag-based exceptions per service                                                                               |

This is a **note, not a task** — the standard above stays in effect verbatim until a re-evaluation trigger fires. When it does, fork this section into a new "DWS 6 Multi-Tenant Deployment Standard" subsection rather than mutating the current single-tenant guidance, so the historical pattern is preserved for existing services.

### 4.6 DWS 6 Limitations (Why DWS 7 Is Needed)

| Limitation                         | Impact                        | DWS 7 Solution                     |
| ---------------------------------- | ----------------------------- | ---------------------------------- |
| Pilot-grade testing (3 test files) | Production risk               | 380+ test cases, 60% coverage gate |
| No multi-tenancy                   | One customer = one deployment | Tenant-aware isolation             |
| Manual compliance reports          | Doesn't scale                 | Automated Fit-for-55 engine        |
| Single-region backend              | No failover                   | Multi-region EU deployment         |
| No ISO 27001                       | Blocks enterprise sales       | Certification Q3 2026              |

---

## 5. DWS 7 — Cloud Environments

DWS IQ 7 is the production platform (target: 16 paying customers, €72k+ MRR by Q4 2027). It inherits DWS 6's infrastructure but upgrades every layer.

### 5.1 DWS 7 Target Architecture

```
                    ┌──────────────────────────────────┐
                    │        Cloudflare Edge (Global)   │
                    │  CDN + Workers + WAF + DDoS       │
                    └──────────────┬───────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                     │
    ┌─────────▼──────────┐  ┌─────▼──────────┐  ┌──────▼─────────┐
    │  EU Cloud Primary   │  │  EU Cloud       │  │  Full Sov.     │
    │  europe-north1 (FI) │  │  Backup (DE)    │  │  (Aegis)       │
    │  Cloud Run + GKE    │  │  Scaleway/      │  │  Compliance    │
    │                     │  │  Hetzner         │  │                │
    └─────────┬──────────┘  └─────┬──────────┘  └──────┬─────────┘
              │                    │                     │
              └────────────────────┼─────────────────────┘
                                   │
                    ┌──────────────▼───────────────────┐
                    │       Supabase EU (Primary)       │
                    │  PostgreSQL + pgvector + Auth      │
                    │  Realtime subscriptions            │
                    └──────────────────────────────────┘
```

### 5.2 DWS 7 Environment Strategy

DWS 7 operates across **four tiers** of environments:

| Tier   | Environment   | Purpose                   | Provider                          | Region                 |
| ------ | ------------- | ------------------------- | --------------------------------- | ---------------------- |
| **T1** | Development   | Local + CI testing        | Docker Compose                    | Local                  |
| **T2** | Staging       | Pre-production validation | Cloud Run                         | europe-north1          |
| **T3** | Production EU | Customer workloads        | Cloud Run → Scaleway (Tier 1 & 2) | europe-north1 / fr-par |
| **T4** | Edge (Global) | Static content, CDN       | Cloudflare Pages/Workers          | Global                 |

### 5.3 DWS 7 Cloud Services

| Service                 | Provider                | Region             | DWS 7 Upgrade vs DWS 6                             |
| ----------------------- | ----------------------- | ------------------ | -------------------------------------------------- |
| **Backend API**         | Google Cloud Run        | europe-north1      | API versioning (v1/v2), tenant-aware rate limiting |
| **Agent Orchestration** | Cloud Run + Temporal.io | europe-north1      | Production Temporal cluster (not Docker dev)       |
| **Database**            | Supabase                | EU                 | Connection pooling, read replicas, backup strategy |
| **Search / Embeddings** | Supabase pgvector       | EU                 | Optimized indexes, embedding pipeline              |
| **Secrets**             | Google Secret Manager   | europe-north1      | Automated rotation, per-tenant secrets             |
| **Training**            | GCP A3 (H100)           | europe-north1      | On-demand burst, MLflow experiment tracking        |
| **Customer Compute**    | Scaleway Serverless     | fr-par (France)    | Tier 1 & 2 customer deployments (sovereign EU)     |
| **Edge / CDN**          | Cloudflare              | Global (EU-routed) | Durable Objects, KV, Analytics Engine              |
| **Video (V3)**          | Hetzner Helsinki        | europe-north1      | Self-hosted Jitsi Meet                             |
| **Email (V3)**          | Hetzner Helsinki        | europe-north1      | Postfix + Dovecot / Migadu                         |
| **Monitoring**          | Prometheus + Grafana    | europe-north1      | Production-grade (Cloud Monitoring + self-hosted)  |
| **Compliance**          | Full Sovereignty layer  | EU-only            | EU AI Act Article 12, reasoning lineage            |

### 5.4 DWS 7 Phased Cloud Rollout

Aligned with the DWS7 Roadmap (247 PRs, 6 phases):

| Phase                    | Period            | Cloud Changes                                                                                          |
| ------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------ |
| **1** Launch & Stabilize | Feb–Apr 2026      | Staging environment on Cloud Run (PR 034), DB migration CI (PR 035), frontend deploy pipeline (PR 036) |
| **2** Compliance Engine  | May–Jul 2026      | Full Sovereignty (Aegis) compliance layer deployment, ETS/CBAM data pipelines                          |
| **3** Scale & Harden     | Aug–Oct 2026      | Multi-tenant isolation, ISO 27001 infrastructure controls, SOC 2 prep                                  |
| **4** Intelligence Layer | Nov 2026–Jan 2027 | Production Temporal cluster, IoT data pipeline, agentic AI scaling                                     |
| **5** Market Expansion   | Feb–May 2027      | Supplier portal cloud, multi-region (FI + DE), partner sandbox environments                            |
| **6** DWS 7 Release      | Jun–Dec 2027      | Multi-region failover, SOC 2 Type II audit, investor metrics dashboard                                 |

### 5.5 DWS 7 NVIDIA & Siemens Integration

Per the DWS7 Integration Roadmap (`dws7/DWS7_INTEGRATION_ROADMAP_NVIDIA_SIEMENS.md`):

| Partner                  | Integration                | Cloud Impact                    |
| ------------------------ | -------------------------- | ------------------------------- |
| **NVIDIA Omniverse**     | Digital twin visualization | GPU compute (A3 mega instances) |
| **NVIDIA CUDA-X**        | AI model acceleration      | Training cluster (H100 burst)   |
| **Siemens Xcelerator**   | Industrial IoT data        | API integration, data pipeline  |
| **Siemens Digital Twin** | Building/facility twins    | Edge compute (Jetson Orin Nano) |

---

## 6. Firehorse V3 — Multi-Cloud Strategy

Firehorse V3 (SME Communication & Compliance Suite) introduces new cloud requirements beyond the core DWS platform. The V3 strategy must be rethought to align with the three-cloud architecture.

### 6.1 V3 Current Plan (Single-Cloud)

The original V3 specification targets Hetzner Helsinki for self-hosted Jitsi + Email at €16.79/month infrastructure cost. This works for a standalone product but doesn't align with the broader DWS cloud strategy.

### 6.2 V3 Upgraded Plan (Multi-Cloud)

**Rethought V3 deployment across three environments:**

| V3 Component             | US Cloud                                          | EU Cloud                           | Full Sovereignty (Aegis) |
| ------------------------ | ------------------------------------------------- | ---------------------------------- | ------------------------ |
| **Landing page**         | Cloudflare Pages (dws6.com/products/firehorse-v3) | —                                  | —                        |
| **Dashboard**            | Cloudflare Pages (SPA)                            | —                                  | —                        |
| **Backend API**          | —                                                 | Cloud Run (europe-north1)          | —                        |
| **Jitsi Meet**           | —                                                 | Hetzner Helsinki (self-hosted)     | —                        |
| **Email**                | —                                                 | Hetzner Helsinki (Postfix/Dovecot) | —                        |
| **AI Climate Assistant** | —                                                 | Cloud Run (Claude API)             | Article 12 logging       |
| **User data**            | —                                                 | Supabase EU                        | Audit trail              |
| **Meeting recordings**   | —                                                 | Hetzner Object Storage (EU)        | Retention policy         |
| **Compliance reports**   | —                                                 | Cloud Storage (europe-north1)      | Reasoning lineage        |

### 6.3 V3 Upgrade Path (V3 → V3.1 → V3.2)

| Version            | Scope                              | Cloud Changes                                                     |
| ------------------ | ---------------------------------- | ----------------------------------------------------------------- |
| **V3** (Q1 2026)   | Jitsi IFrame + meet.jit.si         | No new infra — uses public meet.jit.si                            |
| **V3.1** (Q2 2026) | Self-hosted Jitsi + Email launch   | Hetzner Helsinki CX22 instances (€16.79/mo)                       |
| **V3.2** (Q3 2026) | Sovereignty compliance + recording | Full Sovereignty (Aegis) compliance logging, encrypted EU storage |
| **V3.3** (Q4 2026) | Multi-language, clustered Jitsi    | Hetzner cluster (100+ concurrent rooms), CDN for recordings       |

### 6.4 V3 Cost Evolution

| Version | Monthly Infra Cost         | Break-even Users |
| ------- | -------------------------- | ---------------- |
| V3      | €0 (public Jitsi)          | 0                |
| V3.1    | €16.79 (2x CX22 + storage) | 2 users          |
| V3.2    | €25 (+ sovereignty audit)  | 3 users          |
| V3.3    | €80 (clustered)            | 9 users          |

---

## 7. Full Sovereignty (Aegis) — EU AI Act Compliance Layer

The **Full Sovereignty tier** (product name: Aegis) is the compliance layer that ensures all DWS AI systems meet EU AI Act requirements by August 2026.

### 7.1 What Is the Full Sovereignty Tier

The Full Sovereignty tier is not a separate cloud provider — it is a **compliance overlay** deployed within the EU Cloud environment. It adds Article 12 automatic logging, reasoning lineage, and audit trail capabilities to all DWS AI components. Customers on this tier operate single-tenant, EU-only infrastructure with zero CLOUD Act exposure.

### 7.2 EU AI Act Requirements (August 2026 Deadline)

| Article        | Requirement                               | Full Sovereignty Implementation             |
| -------------- | ----------------------------------------- | ------------------------------------------- |
| **Article 12** | Automatic logging of all AI system events | OpenTelemetry traces with immutable storage |
| **Article 13** | Transparency and information to users     | AI disclosure badges, model cards           |
| **Article 14** | Human oversight                           | Approval gates in agent workflows           |
| **Article 52** | Transparency for conversational AI        | "You are talking to an AI" disclosure       |
| **Annex III**  | High-risk AI classification               | Risk assessment per AI component            |

### 7.3 Full Sovereignty Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                  FULL SOVEREIGNTY (AEGIS) LAYER              │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Trace         │  │ Reasoning    │  │ Audit Trail      │   │
│  │ Collector     │  │ Lineage      │  │ Manager          │   │
│  │ (OpenTelemetry│  │ Store        │  │ (Immutable logs) │   │
│  │  + custom)    │  │ (pgvector)   │  │                  │   │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │
│         │                  │                    │             │
│         └──────────────────┼────────────────────┘             │
│                            │                                  │
│              ┌─────────────▼──────────────┐                   │
│              │   Compliance Dashboard      │                   │
│              │   (Forensic Debugging)      │                   │
│              └────────────────────────────┘                   │
│                                                              │
│  Per-Interaction Record:                                     │
│  ┌────────────────────────────────────────────┐              │
│  │ Trace ID: uuid-v4                          │              │
│  │ Trigger:  User Request / Scheduled / Event │              │
│  │ Agent:    Which AI agent handled it        │              │
│  │ Reasoning: Decision chain (CoT/ReAct/ToT)  │              │
│  │ Verification: Approval gate result         │              │
│  │ Action:   What was executed                │              │
│  │ Timestamp: ISO 8601 with timezone          │              │
│  │ Data Classification: Public/Internal/HR    │              │
│  └────────────────────────────────────────────┘              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 7.4 Full Sovereignty Technology Stack

| Component            | Technology                         | Purpose                                 |
| -------------------- | ---------------------------------- | --------------------------------------- |
| **Trace Collection** | OpenTelemetry SDK                  | Capture all AI interactions             |
| **Reasoning Store**  | Supabase pgvector                  | Store reasoning chains as embeddings    |
| **Audit Log**        | Immutable PostgreSQL (append-only) | 7-year retention, SIEM export           |
| **Privacy**          | Presidio / Custom NER              | PII masking before LLM                  |
| **Safety**           | NeMo Guardrails / Llama Guard      | Toxic prompt blocking                   |
| **Identity**         | OAuth 2.0 / OIDC                   | Role-based data access                  |
| **Dashboard**        | React (DWS IQ Dashboard module)    | Forensic debugging for compliance teams |

### 7.5 Full Sovereignty Deployment on EU Cloud

The Full Sovereignty tier runs entirely within the EU Cloud (pilot account). No data leaves EU.

| Service         | Deployment                    | Region        |
| --------------- | ----------------------------- | ------------- |
| Trace Collector | Cloud Run sidecar             | europe-north1 |
| Reasoning Store | Supabase (existing)           | EU            |
| Audit Log       | Supabase (dedicated table)    | EU            |
| Privacy Filter  | Cloud Run (pre-LLM pipeline)  | europe-north1 |
| Safety Filter   | Cloud Run (inbound/outbound)  | europe-north1 |
| Dashboard       | Cloudflare Pages (admin-only) | EU-routed     |

### 7.6 Full Sovereignty Rollout Timeline

| Phase                   | Period     | Deliverables                                                          |
| ----------------------- | ---------- | --------------------------------------------------------------------- |
| **Foundation**          | Q2 2026    | OpenTelemetry integration, basic trace collection, audit log schema   |
| **Reasoning Lineage**   | Q3 2026    | Decision chain logging, pgvector reasoning store, forensic dashboard  |
| **Trust Guardrails**    | Q3–Q4 2026 | PII masking (Presidio), toxicity filtering (NeMo), approval gates     |
| **Certification Ready** | Q4 2026    | EU AI Act high-risk assessment, documentation package, external audit |
| **Production**          | Q1 2027    | Full Article 12 compliance, customer-facing compliance reports        |

### 7.7 Full Sovereignty for DWS 6 vs DWS 7

| Aspect            | DWS 6 + Full Sovereignty | DWS 7 + Full Sovereignty                 |
| ----------------- | ------------------------ | ---------------------------------------- |
| **Scope**         | Climate assistant only   | All 6+ agent types                       |
| **Logging depth** | Basic interaction traces | Full reasoning lineage (CoT/ReAct/ToT)   |
| **Storage**       | Shared Supabase table    | Dedicated audit schema, 7-year retention |
| **Dashboard**     | Read-only log viewer     | Forensic debugging, compliance export    |
| **Certification** | Self-assessed            | External audit (ISO 27001 + EU AI Act)   |

---

## 8. Environment Matrix

### 8.1 Complete Service-to-Environment Mapping

| Service           | US Cloud (Cloudflare) | EU Cloud (GCP/Supabase) | Full Sov. (EU)  | Hetzner (V3) | Aiven (Sandbox)        |
| ----------------- | --------------------- | ----------------------- | --------------- | ------------ | ---------------------- |
| **Landing pages** | Cloudflare Pages      | —                       | —               | —            | —                      |
| **Dashboard SPA** | Cloudflare Pages      | —                       | —               | —            | —                      |
| **Edge API**      | Cloudflare Workers    | —                       | —               | —            | —                      |
| **Backend API**   | —                     | Cloud Run               | Trace sidecar   | —            | —                      |
| **AI Agents**     | —                     | Cloud Run               | Reasoning log   | —            | Agent workspace        |
| **MCP Hub**       | —                     | Cloud Run               | Trace sidecar   | —            | —                      |
| **Database**      | —                     | Supabase EU (prod)      | Audit tables    | —            | Daily mirror (sandbox) |
| **Auth**          | —                     | Supabase Auth           | Identity layer  | —            | Auth stubs             |
| **Jitsi (V3)**    | —                     | —                       | —               | Self-hosted  | —                      |
| **Email (V3)**    | —                     | —                       | —               | Self-hosted  | —                      |
| **Training**      | —                     | GCP A3 (burst)          | —               | —            | LWM training data      |
| **Monitoring**    | —                     | Prometheus + Grafana    | —               | —            | —                      |
| **Compliance**    | —                     | —                       | Full Sov. stack | —            | —                      |

> **Note (v2.4):** This matrix predates DGX Spark's adoption as primary compute and doesn't have a column for it. Read "Backend API / AI Agents / MCP Hub → EU Cloud → Cloud Run" above as **secondary/staging** — DGX Spark (self-hosted, zero marginal cost) is primary for all three; see §3.2.2. Read "Edge API → Cloudflare Workers" as **designed, not deployed** — a live account check found only 1 of 8 planned workers actually running; see §12.1.

### 8.2 Domain-to-Environment Mapping

| Domain              | Environment           | Content                           |
| ------------------- | --------------------- | --------------------------------- |
| `dws6.com`          | US Cloud (Cloudflare) | Platform site, dashboard, store   |
| `dws10.com`         | US Cloud (Cloudflare) | Product commerce, Firehorse store |
| `onelifetime.world` | US Cloud (Cloudflare) | Corporate / brand site            |
| `agent.dws10.com`   | US Cloud → EU Cloud   | Edge → Cloud Run (agent API)      |
| `mcp-hub.dws10.com` | US Cloud → EU Cloud   | Edge → Cloud Run (MCP)            |
| `meet.dws6.com`     | EU Cloud (Hetzner)    | Jitsi Meet (V3, Q2 2026)          |
| `mail.dws6.com`     | EU Cloud (Hetzner)    | Email service (V3, Q2 2026)       |

---

## 9. Data Residency & Sovereignty

### 9.1 Data Classification by Cloud

| Data Type                    | US Cloud     | EU Cloud      | Full Sov. (Aegis) | CLOUD Act Risk      |
| ---------------------------- | ------------ | ------------- | ----------------- | ------------------- |
| Public content (pages, docs) | Yes          | —             | —                 | Low (public data)   |
| Customer PII                 | Never        | Yes           | Audit only        | None (EU providers) |
| AI model inputs              | Never        | Yes           | Traced            | None                |
| AI model outputs             | Never        | Yes           | Traced + stored   | None                |
| Meeting recordings (V3)      | Never        | Yes (Hetzner) | Retention policy  | None                |
| Email content (V3)           | Never        | Yes (Hetzner) | —                 | None                |
| Compliance reports           | Never        | Yes           | Reasoning lineage | None                |
| Payment data                 | Stripe (PCI) | —             | —                 | PCI-DSS compliant   |

### 9.2 Sovereignty Levels

| Deployment Option              | DWS 6 | DWS 7   | V3      | Full Sov. |
| ------------------------------ | ----- | ------- | ------- | --------- |
| **EU Cloud (default)**         | High  | High    | High    | Maximum   |
| **Self-hosted (customer VPC)** | —     | Maximum | Maximum | Maximum   |
| **Hybrid edge**                | —     | High    | —       | High      |
| **OT-isolated**                | —     | Maximum | —       | Maximum   |

---

## 10. Migration Path: DWS 6 → DWS 7

### 10.1 What Carries Forward

| Component            | DWS 6 → DWS 7                 | Action                                       |
| -------------------- | ----------------------------- | -------------------------------------------- |
| Supabase database    | Migrate with schema evolution | Migration scripts in `supabase/migrations/`  |
| Cloud Run backend    | Upgrade in-place              | API versioning (v1 → v2 coexistence)         |
| Cloudflare frontend  | Upgrade in-place              | Dashboard v10 replaces v8/v9                 |
| AI agents            | Upgrade + add new agents      | AgentFoundry evolution                       |
| Customer accounts    | Preserve                      | Supabase Auth continuity                     |
| `.env` configuration | Extend                        | New vars for sovereignty layer, multi-tenant |

### 10.2 What Changes

| DWS 6                | DWS 7                       | Change Type         |
| -------------------- | --------------------------- | ------------------- |
| Single-tenant        | Multi-tenant                | Architecture change |
| 3 test files         | 380+ test cases             | Quality enforcement |
| Manual compliance    | Automated Fit-for-55 engine | New capability      |
| No sovereignty layer | Full EU AI Act compliance   | New layer           |
| Single region        | Multi-region EU (FI + DE)   | Infrastructure      |
| No ISO certification | ISO 27001 + SOC 2           | Compliance          |
| 3 pilot customers    | 16 paying customers         | Scale               |

### 10.3 Migration Timeline

| Period            | Migration Step                                                                     |
| ----------------- | ---------------------------------------------------------------------------------- |
| Feb–Apr 2026      | DWS 6 stabilized as "DWS 7 Phase 1" — same infra, production-hardened              |
| May–Jul 2026      | Full Sovereignty (Aegis) layer added, compliance engine deployed — "DWS 7 Phase 2" |
| Aug–Oct 2026      | Multi-tenant, ISO 27001 infra controls — "DWS 7 Phase 3"                           |
| Nov 2026–May 2027 | Intelligence + expansion — "DWS 7 Phase 4-5"                                       |
| Jun–Dec 2027      | DWS IQ 7.0 GA release — "DWS 7 Phase 6"                                            |

---

## 11. Cost Structure

### 11.1 Current (DWS 6 Pilot)

| Service                | Monthly Cost     | Notes                              |
| ---------------------- | ---------------- | ---------------------------------- |
| Google Cloud Run       | ~€50–100         | Auto-scaling 0–10, minimal traffic |
| Supabase               | Free tier / €25  | Pro plan for production            |
| Cloudflare             | Free / €20       | Pages free, Workers paid plan      |
| AI APIs (Claude, Groq) | ~€50–200         | Usage-based                        |
| **Total**              | **~€150–350/mo** | Pilot-phase costs                  |

### 11.2 Target (DWS 7 Production)

| Service                             | Monthly Cost       | Notes                         |
| ----------------------------------- | ------------------ | ----------------------------- |
| Google Cloud Run (backend + agents) | €260–306           | Per AgentFoundry estimate     |
| Supabase Pro                        | €25–75             | Depending on usage            |
| Cloudflare Pro                      | €20–200            | Workers Unbound + Pages       |
| Hetzner (V3 infra)                  | €17–80             | Jitsi + Email + Storage       |
| AI APIs                             | €200–500           | Scale with customers          |
| Sovereignty audit (logging/storage) | €25–50             | OpenTelemetry + audit storage |
| Monitoring (Grafana Cloud)          | €0–50              | Free tier or Cloud Monitoring |
| **Total**                           | **~€550–1,260/mo** | 16-customer production        |

### 11.3 Revenue vs Cost

| Phase         | MRR Target | Cloud Cost | Margin |
| ------------- | ---------- | ---------- | ------ |
| DWS 6 Pilot   | €7,000     | ~€250      | 96%    |
| DWS 7 Phase 1 | €8,500     | ~€400      | 95%    |
| DWS 7 Phase 3 | €25,000    | ~€700      | 97%    |
| DWS 7 Phase 6 | €72,000    | ~€1,200    | 98%    |

---

## 12. MCP Gateway on Cloud Run (Mobile Claude Code)

### 12.1 Problem

Claude Code on mobile (web sessions) cannot spawn local MCP server processes via stdio transport. MCP tools (Supabase, GitHub) are unavailable in mobile sessions.

### 12.2 Solution

A lightweight MCP Gateway runs on Cloud Run (europe-north1) exposing MCP tools over **Streamable HTTP** transport. Any Claude Code session — mobile or desktop — can connect to it via URL.

```
┌─────────────────────┐         ┌──────────────────────────────┐
│  Claude Code Mobile  │──HTTP──▶│  MCP Gateway (Cloud Run)     │
│  (web session)       │         │  europe-north1               │
└─────────────────────┘         │                              │
                                │  Tools: Supabase, GitHub     │
┌─────────────────────┐         │  Secrets: GCP Secret Manager │
│  Claude Code Desktop │──HTTP──▶│  Transport: Streamable HTTP  │
│  (also works)        │         │  Auth: Bearer token          │
└─────────────────────┘         └──────────────────────────────┘
```

### 12.3 Cloud Run Service

| Property        | Value                                                        |
| --------------- | ------------------------------------------------------------ |
| Service name    | `mcp-gateway`                                                |
| Region          | europe-north1                                                |
| Image           | `europe-north1-docker.pkg.dev/PROJECT_ID/dws-iq/mcp-gateway` |
| Service account | `mcp-gateway@PROJECT_ID.iam.gserviceaccount.com`             |
| Min instances   | 0 (scale to zero)                                            |
| Max instances   | 3                                                            |
| Memory          | 512 Mi                                                       |
| Auth            | Bearer token (no-allow-unauthenticated)                      |
| Cost            | ~€3-6/month                                                  |

### 12.4 Secrets Required

| Secret Name (GCP)      | Source Env Var       | Purpose                      |
| ---------------------- | -------------------- | ---------------------------- |
| `supabase-url`         | SUPABASE_URL         | Supabase project URL         |
| `supabase-service-key` | SUPABASE_SERVICE_KEY | Supabase service role key    |
| `github-token`         | GITHUB_TOKEN         | GitHub personal access token |
| `mcp-gateway-api-key`  | MCP_GATEWAY_API_KEY  | Gateway authentication       |

### 12.5 Claude Code Configuration

```json
{
  "mcpServers": {
    "dws-gateway": {
      "type": "url",
      "url": "https://mcp-gateway-XXXXX-ew.a.run.app/mcp"
    }
  }
}
```

### 12.6 Deployment

```bash
# 1. Provision secrets from .env
./scripts/provision-secrets.sh

# 2. Deploy to Cloud Run
gcloud builds submit --config=mcp-servers/cloud-run-gateway/cloudbuild.yaml .
```

### 12.7 Available Tools

**Supabase:** `supabase_query`, `supabase_insert`, `supabase_update`, `supabase_rpc`, `supabase_list_tables`

**GitHub:** `github_list_repos`, `github_get_repo`, `github_list_issues`, `github_list_prs`, `github_get_file`, `github_search_code`, `github_create_issue`

**Gateway:** `gateway_health`

### 12.8 Files

| File                                                    | Purpose                      |
| ------------------------------------------------------- | ---------------------------- |
| `mcp-servers/cloud-run-gateway/server.py`               | MCP Gateway server           |
| `mcp-servers/cloud-run-gateway/Dockerfile`              | Cloud Run container          |
| `mcp-servers/cloud-run-gateway/cloudbuild.yaml`         | CI/CD pipeline               |
| `mcp-servers/cloud-run-gateway/mcp-config.example.json` | Claude Code config template  |
| `scripts/provision-secrets.sh`                          | .env → Google Secret Manager |

### 12.9 Migration Plan (2026-07) — Priority: DGX Spark → Cloudflare Workers → Cloud Run

Added during Cloudflare-migration research (v2.4). Two findings changed the plan for this service:

1. **The scaffolded `src/cloudflare/mcp-gateway.ts` is not a drop-in replacement.** It's a multi-tenant SaaS routing proxy (forwards to `env.MCP_HUB_ORIGIN`, requires per-tenant config in a `TENANT_ROUTES` KV namespace, OAuth introspection against an auth server) — designed for the "Cloudflare Sandbox" product concept in `docs/CLOUDFLARE_SANDBOX_PILOT.md`, not for this gateway's actual job. The real gateway (`mcp-servers/cloud-run-gateway-ts/src/server.ts`) directly implements Supabase + GitHub tools over the MCP SDK's `StreamableHTTPServerTransport`, with server-side session state held in an in-memory object keyed by `mcp-session-id`. Deploying the scaffold as-is would produce edge infrastructure pointing at an origin (`mcp-hub.dws10.com`) that isn't live — not a working migration.
2. **A live Cloudflare account check found only 1 of 8 designed workers actually deployed** (`dws-revolut-checkout`; 0 KV namespaces exist), confirming the gateway scaffold was never provisioned.

**Revised host priority for this and future workloads** (per house preference: cost and sovereignty first):

| Priority | Host                                | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Cost                              |
| -------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 1        | **DGX Spark** (self-hosted, §3.2.2) | Zero marginal cost, EU-sovereign, already running the backend 24/7. The real gateway's in-process session state (the `transports` object in `server.ts`) needs no porting here — it's just another route/container on a persistent Node process. Needs a public HTTPS hostname for mobile Claude Code's remote-MCP client; a Cloudflare Tunnel (already the pattern in `src/cloudflare/README.md`'s hybrid architecture) gives that without touching Workers compute. | €0 marginal                       |
| 2        | **Cloudflare Workers**              | Global edge reach, cheap at low volume — but the real gateway's per-session state would need porting to a Durable Object (Workers isolates don't share memory across requests the way a persistent Node process does), and the MCP TypeScript SDK's `createMcpExpressApp` binding assumes Express/Node, not the Workers `fetch` handler contract. Real, non-trivial port — not a config change.                                                                       | Workers CPU-time billing at scale |
| 3        | **Cloud Run** (current)             | Already working today; keep as fallback until tier 1 or 2 is proven, then retire.                                                                                                                                                                                                                                                                                                                                                                                     | Paid (~€3–6/mo for this service)  |

**Status (2026-07-05): Tier 1 code shipped, not yet live.** `mcp-servers/cloud-run-gateway-ts` (the real gateway, unmodified) is now wired into `infrastructure/dgx-spark/docker-compose.yml` as the `mcp-gateway` service, plus a profile-gated `cloudflare-tunnel` service and a `heartbeat.ts`/`CHECK_MCP_GATEWAY` entry so failover monitoring covers it. It ships with the next `deploy-dgx-spark.yml` run automatically (no host-published port — internal to the DGX Docker network only).

Two steps remain, both outside this repo and both required before this is reachable by mobile Claude Code — see `mcp-servers/cloud-run-gateway-ts/README.md` "Deploy on DGX Spark" for the exact commands:

1. Set `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `GITHUB_TOKEN`, `MCP_GATEWAY_API_KEY` in the DGX host's `.env`. **Do not skip `MCP_GATEWAY_API_KEY`** — without it the gateway accepts unauthenticated requests, which is fine while unexposed but not once tunneled.
2. Create a Cloudflare Tunnel (Zero Trust dashboard), set `CLOUDFLARE_TUNNEL_TOKEN`, route a public hostname to `http://mcp-gateway:8080`, then start it with `docker compose --profile gateway up -d cloudflare-tunnel`.

Tier 2 (Cloudflare Workers port) and Tier 3 retirement (Cloud Run) remain undone, per the table above.

---

## 13. MCP Agent Server (DWS7 — In-Process)

_Added: 2026-02-24 | Session: claude/modernize-dws7-77v2B_

While Section 12 covers the **Cloud Run MCP Gateway** (HTTP bridge for mobile Claude Code), this section documents the **in-process MCP Agent Server** that exposes all 18 DWS IQ agents as MCP tools directly from the Express backend.

### 13.1 Architecture

```
External ADE (Claude Code, Cursor, Codex)
  ↓ JSON-RPC over HTTP
Express Backend (/mcp endpoint)
  ↓
MCP Agent Server (src/mcp/agent-server.ts)
  ├─ tools/list → 22+ tools (21 agents + 4 meta-tools)
  ├─ tools/call → AgentRegistry.executeAgent()
  └─ SSE stream → EventBus subscription
```

**Key difference from Section 12:** The Cloud Run Gateway (Section 12) is a standalone Python service for mobile/web sessions. This MCP server runs inside the Express backend and has direct access to all agents, the event bus, and Supabase.

### 13.2 Endpoints

| Endpoint      | Method | Purpose                                                 | Auth |
| ------------- | ------ | ------------------------------------------------------- | ---- |
| `/mcp`        | POST   | JSON-RPC 2.0 — `initialize`, `tools/list`, `tools/call` | JWT  |
| `/mcp/sse`    | GET    | Server-Sent Events — real-time agent events             | JWT  |
| `/mcp/health` | GET    | Health check with agent count and protocol version      | None |

### 13.3 Available Meta-Tools

| Tool              | Description                                             |
| ----------------- | ------------------------------------------------------- |
| `dws_list_agents` | List all registered agents with capabilities and models |
| `dws_discover`    | Find agents by capability tag (A2A-style discovery)     |
| `dws_workflow`    | Trigger a predefined multi-agent workflow               |
| `dws_events`      | Get recent events from the event bus                    |

### 13.4 Agent Endpoint Security

| Control           | Implementation                                             |
| ----------------- | ---------------------------------------------------------- |
| Authentication    | JWT extracted from Authorization header                    |
| Rate limiting     | 30 requests/minute per IP (Express middleware)             |
| Tool allowlist    | Only agents in registry exposed — no dynamic registration  |
| SSRF protection   | `fetch_external` tool validates against domain allowlist   |
| Input validation  | JSON-RPC format enforced                                   |
| Delegation limits | Max depth 5 per session                                    |
| Governance        | All agent executions pass through governance policy engine |

### 13.5 Event Streaming Architecture

The `/mcp/sse` endpoint provides real-time agent activity via Server-Sent Events:

```
Client connects → EventBus.subscribe("*") → Events streamed as SSE data frames
Client disconnects → Subscription auto-removed → No resource leak
```

**Event types emitted by the agent runtime:**

| Event Type                  | Trigger                    | Payload                                 |
| --------------------------- | -------------------------- | --------------------------------------- |
| `agent.execution_complete`  | Any agent finishes         | `{ agentName, confidence, durationMs }` |
| `compliance.gap_detected`   | Compliance agent finds gap | `{ regulation, gap, severity }`         |
| `workflow.{name}.started`   | Workflow begins            | `{ workflowName, input }`               |
| `workflow.{name}.completed` | Workflow finishes          | `{ workflowName, stepResults }`         |
| `workflow.{name}.failed`    | Workflow errors            | `{ workflowName, error }`               |

**Persistence:** Events are stored in-memory (last 1,000) and optionally persisted to Redis Streams at `dws:events:{orgId}`.

### 13.6 Deployment

The MCP Agent Server deploys as part of the Express backend — no separate service needed:

| Environment        | Endpoint                               | Notes                     |
| ------------------ | -------------------------------------- | ------------------------- |
| Local dev          | `http://localhost:8080/mcp`            | Full access               |
| Cloud Run (EU)     | `https://dws-iq-backend-*.run.app/mcp` | JWT required              |
| Cloudflare Workers | Not available                          | Workers run frontend only |

**Claude Code configuration:**

```json
{
  "mcpServers": {
    "dws-agents": {
      "type": "url",
      "url": "https://dws-iq-backend-XXXXX-ew.a.run.app/mcp"
    }
  }
}
```

### 13.7 Available Workflows

| Workflow                | Steps | Agents                                                                | Timeout |
| ----------------------- | ----- | --------------------------------------------------------------------- | ------- |
| `compliance-assessment` | 4     | emissions-data-analyst → compliance → viability → notify              | 5 min   |
| `construction-full`     | 4     | [sitesense, material-oracle, schedule-genius] → construction → notify | 5 min   |
| `seo-pipeline`          | 3     | keyword-intent → competitor-surveillance → content-brief              | 10 min  |

Workflows execute in-process via `src/agents/workflows.ts`. When Temporal.io is wired (DWS7 Phase 4), these definitions export directly to Temporal workflow activities.

---

## 13.8 Database Disaster Recovery Architecture

### Dual-Database Strategy

| Database         | Provider         | Role                                              | Region             | Project Name      |
| ---------------- | ---------------- | ------------------------------------------------- | ------------------ | ----------------- |
| **Primary**      | Supabase         | Production (all customer data)                    | EU (europe-north1) | `dws6-production` |
| **Warm standby** | Aiven PostgreSQL | Sandbox, agent workspace, LWM training, DR target | EU (Finland)       | `dws-test`        |

### Recovery Time Objectives

| Scenario                          | RTO      | RPO                 | Method                                                           |
| --------------------------------- | -------- | ------------------- | ---------------------------------------------------------------- |
| Schema rebuild from migrations    | < 5 min  | N/A (schema in git) | `scripts/db-recovery.sh --target aiven`                          |
| Full data restore (schema + dump) | < 15 min | 24 hours            | `scripts/db-recovery.sh --target supabase --restore-dump <file>` |
| Aiven warm standby switchover     | < 5 min  | 24 hours            | Update `.env` SUPABASE_URL → AIVEN_DATABASE_URL                  |

### Backup Destinations (4-Destination Redundancy)

| #   | Destination              | Method              | Frequency       | Script                |
| --- | ------------------------ | ------------------- | --------------- | --------------------- |
| 1   | Local disk (F: drive)    | pg_dump + GPG       | Daily           | `Backup-Database.ps1` |
| 2   | Proton Drive             | Encrypted sync      | Daily           | `Sync-ToProton.ps1`   |
| 3   | Acer Veriton Helsinki    | SCP over SSH        | Daily           | `Backup-Database.ps1` |
| 4   | GitHub Actions artifacts | pg_dump             | Daily 02:30 UTC | `daily-db-backup.yml` |
| 5   | Aiven PostgreSQL         | Full mirror restore | Daily           | `Mirror-ToAiven.ps1`  |

### Recovery Scripts (Linux)

| Script                      | Purpose                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------ |
| `scripts/db-recovery.sh`    | Rebuilds full schema from 43+ migrations, restores from backup dump, verifies tables + RLS |
| `scripts/db-backup-test.sh` | End-to-end backup test drive: export → verify → restore → row count comparison             |
| `scripts/aiven-init.sql`    | Aiven auth stubs (auth.uid, auth.jwt, auth.role) for RLS policy compatibility              |

### Emergency Procedure

1. **Detect** — Supabase outage or data corruption identified
2. **Assess** — Determine scope: schema-only or full data loss
3. **Recover** — Run `db-recovery.sh --target supabase` (new project) or switch to Aiven
4. **Verify** — Check table counts, RLS status, function availability
5. **Switch** — Update production `.env` with new database credentials
6. **Document** — Create field note in `docs/field-notes/`

---

## 14. References

- **DWS7 Roadmap:** `DWS7_ROADMAP.md` — 247-PR production roadmap
- **DWS7 NVIDIA/Siemens:** `dws7/DWS7_INTEGRATION_ROADMAP_NVIDIA_SIEMENS.md` — Partnership strategy
- **Production Deployment:** `docs/architecture/09-PRODUCTION-DEPLOYMENT.md` — GCP infrastructure
- **Cloudflare Deployment:** `CLOUDFLARE_DEPLOYMENT.md` — Edge deployment guide
- **Security Compliance:** `Admin/SECURITY_COMPLIANCE.md` — Controls and certifications
- **Firehorse V3 Spec:** `product-catalog/Firehorse/V3/product-specification.md` — V3 product details
- **Trust System:** `FIELD_NOTE_TRUST_SYSTEM_2026.md` — Reasoning lineage design
- **EU AI Act:** Regulation (EU) 2024/1689 — Artificial Intelligence Act

---

**Document Owner:** Platform Architecture
**Last Updated:** 2026-02-24
**Session:** claude/modernize-dws7-77v2B

---

(c) 2026 Lifetime Oy - DWS Cloud Environments Documentation

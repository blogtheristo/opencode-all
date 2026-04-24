# DWS Cloud Environments — US, EU & Aiven

---

# VERSION AND AGENT HISTORY

Version: 1.5

Sessions & Modifications:

- Version: 1.5 | Tool: Claude Code (Opus 4.7) | Session: claude/b2b-payment-stack-DNdkW | Date: 24.04.2026 | Changes: Added Section 4.4 (DWS 6 Cloud IAM Bindings) — project-level IAM table for `dws6run6`, documented `roles/artifactregistry.admin` grant to Cloud Build SA `1074393862472@cloudbuild.gserviceaccount.com` to unblock Artifact Registry push; renumbered prior 4.4 → 4.5 (Limitations); flagged least-privilege follow-up
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026 | Changes: Added Section 13.8 (Database Disaster Recovery Architecture) — dual-database (Supabase dws6-production + Aiven dws-test), Linux recovery scripts, RTO < 5 min schema / < 15 min full, 4-destination backup redundancy
- Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/silly-zhukovsky | Date: 07.03.2026 | Changes: Added Aiven PostgreSQL Sandbox as 5th environment in matrix — agent workspace + LWM training, EU Finland region, daily mirror from Supabase
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/mcp-google-cloud-run-BuSpY | Date: 23.02.2026 | Changes: Added MCP Gateway on Cloud Run section (Section 12) — Streamable HTTP for mobile Claude Code, secret provisioning script
- Version: 1.1 | Tool: Claude Code | Session: claude/zealous-mcclintock | Date: 20.02.2026 | Changes: Added Google Cloud project details (dws6run6) and Secret Manager API status
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/document-cloud-environments-EK7iZ | Date: 16.02.2026 | Changes: Initial cloud environments documentation — US public, EU development, Article 12 Logging Pipeline (originally labelled "Aiwen/Aiven layer" — deprecated), DWS 6 + DWS 7 strategy

Session Links & References:

- Claude Code (claude/mcp-google-cloud-run-BuSpY): https://github.com/blogtheristo/dws6/commits/claude/mcp-google-cloud-run-BuSpY
- Claude Code (claude/zealous-mcclintock): https://github.com/blogtheristo/dws6/commits/claude/zealous-mcclintock
- Claude Code (claude/document-cloud-environments-EK7iZ): https://github.com/blogtheristo/dws6/commits/claude/document-cloud-environments-EK7iZ

Document Status:

- Created: 16.02.2026
- Last Modified: 24.04.2026
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
7. [Aiven — EU AI Act Compliance Cloud](#7-aiven--eu-ai-act-compliance-cloud)
8. [Environment Matrix](#8-environment-matrix)
9. [Data Residency & Sovereignty](#9-data-residency--sovereignty)
10. [Migration Path: DWS 6 → DWS 7](#10-migration-path-dws-6--dws-7)
11. [Cost Structure](#11-cost-structure)
12. [References](#12-references)

---

## 1. Executive Summary

DWS operates across three cloud environments serving different purposes, compliance requirements, and customer segments. This document clarifies the account structure, deployment topology, and evolution path from the current DWS 6 pilot through DWS 7 production to the Article 12 Logging Pipeline (EU AI Act) deployment.

**Three Cloud Environments:**

| Environment                     | Region                    | Purpose                                                          | Account                      | Status          |
| ------------------------------- | ------------------------- | ---------------------------------------------------------------- | ---------------------------- | --------------- |
| **US Cloud (Public)**           | US (Cloudflare global)    | Public-facing sites, store, landing pages                        | dws6.com                     | Active          |
| **EU Cloud (Development)**      | europe-north1 (Finland)   | Development, pilot customers, production backend                 | risto.paarni2024@lifetime.fi | Active          |
| **Article 12 Logging Pipeline** | EU-only (Finland/Germany) | EU AI Act Article 12 compliance, reasoning lineage, audit trails | Planned                      | Roadmap Q2 2026 |

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
│  AIVEN (Planned Q2 2026)                                            │
│  EU AI Act compliance layer — sits on top of EU Cloud               │
│  Reasoning lineage, audit trails, Article 12 logging                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

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

| Layer       | Provider                 | Region                  | Purpose                    |
| ----------- | ------------------------ | ----------------------- | -------------------------- | ---------- |
| Compute     | Google Cloud Run         | europe-north1 (Finland) | Backend API, agents        |
| Database    | Supabase                 | EU (Frankfurt/Helsinki) | PostgreSQL, auth, realtime |
| Secrets     | Google Secret Manager    | europe-north1           | API keys, credentials      | ✅ Enabled |
| Images      | Google Artifact Registry | europe-north1           | Container registry         |
| Training    | Google Compute (A3 mega) | europe-north1           | On-demand H100 GPU         |
| Alternative | Scaleway Serverless      | fr-par (France)         | Backup compute             |

**Enabled Google Cloud APIs:**

- **Secret Manager API** (`secretmanager.googleapis.com`) — Stores sensitive data such as API keys, passwords, and certificates. Provides convenience while improving security. (Google Enterprise API, Public API, Status: Enabled)

### 3.3 Article 12 Logging Pipeline — Planned Q2 2026

**Purpose:** Dedicated compliance layer for EU AI Act Article 12, reasoning lineage, and audit trail management.

See [Section 7](#7-aiven--eu-ai-act-compliance-cloud) for full specification.

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

| Service            | US Cloud           | EU Cloud             | Notes                                              |
| ------------------ | ------------------ | -------------------- | -------------------------------------------------- |
| Landing pages      | Cloudflare Pages   | —                    | dws6.com, dws10.com                                |
| Dashboard frontend | Cloudflare Pages   | —                    | v10-react SPA                                      |
| Backend API        | —                  | Cloud Run            | Express.js, port 8080                              |
| AI Agents          | —                  | Cloud Run            | 6 agent services                                   |
| Database           | —                  | Supabase EU          | PostgreSQL + pgvector                              |
| Auth               | —                  | Supabase Auth        | JWT, GitHub SSO (Google login removed by Supabase) |
| MCP Hub            | —                  | Cloud Run / Docker   | Agent orchestration                                |
| Monitoring         | —                  | Prometheus + Grafana | Docker Compose (dev)                               |
| Edge API           | Cloudflare Workers | —                    | Rate limiting, caching                             |

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

### 4.4 DWS 6 Cloud IAM Bindings

Project-level IAM bindings required for the `dws-iq-backend` image to build, push, and deploy from Cloud Build to Artifact Registry → Cloud Run (all in `europe-north1`).

**Project:** `dws6run6` · **Project number:** `1074393862472`
**Artifact Registry repo:** `europe-north1-docker.pkg.dev/dws6run6/dws-iq-repo`

| Principal                                             | Role                                   | Scope   | Purpose                                       | Granted    |
| ----------------------------------------------------- | -------------------------------------- | ------- | --------------------------------------------- | ---------- |
| `1074393862472@cloudbuild.gserviceaccount.com`        | `roles/cloudbuild.builds.builder`      | Project | Execute Cloud Build jobs (baseline).          | Default    |
| `1074393862472@cloudbuild.gserviceaccount.com`        | `roles/artifactregistry.admin`         | Project | Push `dws-iq-backend` image to `dws-iq-repo`. | 24.04.2026 |
| `1074393862472-compute@developer.gserviceaccount.com` | `roles/cloudbuild.builds.editor`       | Project | Compute SA used by triggers.                  | Default    |
| `1074393862472-compute@developer.gserviceaccount.com` | `roles/logging.logWriter`              | Project | Write build/runtime logs.                     | Default    |
| `1074393862472-compute@developer.gserviceaccount.com` | `roles/storage.admin`                  | Project | Source tarball + build artifacts in GCS.      | Default    |
| `service-1074393862472@gcp-sa-cloudbuild.iam...`      | `roles/cloudbuild.serviceAgent`        | Project | Cloud Build service agent (Google-managed).   | Default    |
| `service-1074393862472@serverless-robot-prod.iam...`  | `roles/run.serviceAgent`               | Project | Cloud Run service agent (Google-managed).     | Default    |
| `service-1074393862472@containerregistry.iam...`      | `roles/containerregistry.ServiceAgent` | Project | Legacy GCR service agent.                     | Default    |
| `admin@dws6.com`                                      | `roles/owner`                          | Project | Human owner.                                  | Default    |

**Push failure resolved 24.04.2026.** Cloud Build push to Artifact Registry failed with `denied: Permission 'artifactregistry.repositories.uploadArtifacts' denied on resource (or it may not exist).` Fix:

```cmd
gcloud projects add-iam-policy-binding dws6run6 ^
    --member="serviceAccount:1074393862472@cloudbuild.gserviceaccount.com" ^
    --role="roles/artifactregistry.admin"
```

**Least-privilege follow-up (open):** `roles/artifactregistry.admin` at project level is broader than needed. A future tightening should either (a) swap to `roles/artifactregistry.writer` at repo scope on `dws-iq-repo`, or (b) keep admin but scope it to the single repo. Tracked as a hardening item; non-blocking.

### 4.5 DWS 6 Limitations (Why DWS 7 Is Needed)

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
    │  EU Cloud Primary   │  │  EU Cloud       │  │  Aiven         │
    │  europe-north1 (FI) │  │  Backup (DE)    │  │  Compliance    │
    │  Cloud Run + GKE    │  │  Scaleway/      │  │  Layer         │
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

| Tier   | Environment   | Purpose                   | Provider                 | Region                |
| ------ | ------------- | ------------------------- | ------------------------ | --------------------- |
| **T1** | Development   | Local + CI testing        | Docker Compose           | Local                 |
| **T2** | Staging       | Pre-production validation | Cloud Run                | europe-north1         |
| **T3** | Production EU | Customer workloads        | Cloud Run + Scaleway     | europe-north1, fr-par |
| **T4** | Edge (Global) | Static content, CDN       | Cloudflare Pages/Workers | Global                |

### 5.3 DWS 7 Cloud Services

| Service                 | Provider                    | Region             | DWS 7 Upgrade vs DWS 6                             |
| ----------------------- | --------------------------- | ------------------ | -------------------------------------------------- |
| **Backend API**         | Google Cloud Run            | europe-north1      | API versioning (v1/v2), tenant-aware rate limiting |
| **Agent Orchestration** | Cloud Run + Temporal.io     | europe-north1      | Production Temporal cluster (not Docker dev)       |
| **Database**            | Supabase                    | EU                 | Connection pooling, read replicas, backup strategy |
| **Search / Embeddings** | Supabase pgvector           | EU                 | Optimized indexes, embedding pipeline              |
| **Secrets**             | Google Secret Manager       | europe-north1      | Automated rotation, per-tenant secrets             |
| **Training**            | GCP A3 (H100)               | europe-north1      | On-demand burst, MLflow experiment tracking        |
| **Edge / CDN**          | Cloudflare                  | Global (EU-routed) | Durable Objects, KV, Analytics Engine              |
| **Backup Compute**      | Scaleway Serverless         | fr-par             | Failover for Cloud Run                             |
| **Video (V3)**          | Hetzner Helsinki            | europe-north1      | Self-hosted Jitsi Meet                             |
| **Email (V3)**          | Hetzner Helsinki            | europe-north1      | Postfix + Dovecot / Migadu                         |
| **Monitoring**          | Prometheus + Grafana        | europe-north1      | Production-grade (Cloud Monitoring + self-hosted)  |
| **Compliance**          | Article 12 Logging Pipeline | EU-only            | EU AI Act Article 12, reasoning lineage            |

### 5.4 DWS 7 Phased Cloud Rollout

Aligned with the DWS7 Roadmap (247 PRs, 6 phases):

| Phase                    | Period            | Cloud Changes                                                                                          |
| ------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------ |
| **1** Launch & Stabilize | Feb–Apr 2026      | Staging environment on Cloud Run (PR 034), DB migration CI (PR 035), frontend deploy pipeline (PR 036) |
| **2** Compliance Engine  | May–Jul 2026      | Article 12 Logging Pipeline deployment, ETS/CBAM data pipelines                                        |
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

| V3 Component             | US Cloud                                          | EU Cloud                           | Aiven              |
| ------------------------ | ------------------------------------------------- | ---------------------------------- | ------------------ |
| **Landing page**         | Cloudflare Pages (dws6.com/products/firehorse-v3) | —                                  | —                  |
| **Dashboard**            | Cloudflare Pages (SPA)                            | —                                  | —                  |
| **Backend API**          | —                                                 | Cloud Run (europe-north1)          | —                  |
| **Jitsi Meet**           | —                                                 | Hetzner Helsinki (self-hosted)     | —                  |
| **Email**                | —                                                 | Hetzner Helsinki (Postfix/Dovecot) | —                  |
| **AI Climate Assistant** | —                                                 | Cloud Run (Claude API)             | Article 12 logging |
| **User data**            | —                                                 | Supabase EU                        | Audit trail        |
| **Meeting recordings**   | —                                                 | Hetzner Object Storage (EU)        | Retention policy   |
| **Compliance reports**   | —                                                 | Cloud Storage (europe-north1)      | Reasoning lineage  |

### 6.3 V3 Upgrade Path (V3 → V3.1 → V3.2)

| Version            | Scope                            | Cloud Changes                                               |
| ------------------ | -------------------------------- | ----------------------------------------------------------- |
| **V3** (Q1 2026)   | Jitsi IFrame + meet.jit.si       | No new infra — uses public meet.jit.si                      |
| **V3.1** (Q2 2026) | Self-hosted Jitsi + Email launch | Hetzner Helsinki CX22 instances (€16.79/mo)                 |
| **V3.2** (Q3 2026) | Aiven integration + recording    | Article 12 compliance logging, encrypted EU storage         |
| **V3.3** (Q4 2026) | Multi-language, clustered Jitsi  | Hetzner cluster (100+ concurrent rooms), CDN for recordings |

### 6.4 V3 Cost Evolution

| Version | Monthly Infra Cost         | Break-even Users |
| ------- | -------------------------- | ---------------- |
| V3      | €0 (public Jitsi)          | 0                |
| V3.1    | €16.79 (2x CX22 + storage) | 2 users          |
| V3.2    | €25 (+ Aiven logging)      | 3 users          |
| V3.3    | €80 (clustered)            | 9 users          |

---

## 7. Aiven — EU AI Act Compliance Cloud

**Aiven** is the compliance layer that ensures all DWS AI systems meet EU AI Act requirements by August 2026.

### 7.1 What Is Aiven

Aiven is not a separate cloud provider — it is a **compliance overlay** deployed within the EU Cloud environment. It adds Article 12 automatic logging, reasoning lineage, and audit trail capabilities to all DWS AI components.

**Name origin:** "Aiven" = AI + Wen (Finnish: "when") — "When AI meets compliance."

### 7.2 EU AI Act Requirements (August 2026 Deadline)

| Article        | Requirement                               | Aiven Implementation                        |
| -------------- | ----------------------------------------- | ------------------------------------------- |
| **Article 12** | Automatic logging of all AI system events | OpenTelemetry traces with immutable storage |
| **Article 13** | Transparency and information to users     | AI disclosure badges, model cards           |
| **Article 14** | Human oversight                           | Approval gates in agent workflows           |
| **Article 52** | Transparency for conversational AI        | "You are talking to an AI" disclosure       |
| **Annex III**  | High-risk AI classification               | Risk assessment per AI component            |

### 7.3 Aiven Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        AIVEN LAYER                           │
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

### 7.4 Aiven Technology Stack

| Component            | Technology                         | Purpose                                 |
| -------------------- | ---------------------------------- | --------------------------------------- |
| **Trace Collection** | OpenTelemetry SDK                  | Capture all AI interactions             |
| **Reasoning Store**  | Supabase pgvector                  | Store reasoning chains as embeddings    |
| **Audit Log**        | Immutable PostgreSQL (append-only) | 7-year retention, SIEM export           |
| **Privacy**          | Presidio / Custom NER              | PII masking before LLM                  |
| **Safety**           | NeMo Guardrails / Llama Guard      | Toxic prompt blocking                   |
| **Identity**         | OAuth 2.0 / OIDC                   | Role-based data access                  |
| **Dashboard**        | React (DWS IQ Dashboard module)    | Forensic debugging for compliance teams |

### 7.5 Aiven Deployment on EU Cloud

Aiven runs entirely within the EU Cloud (pilot account). No data leaves EU.

| Aiven Service   | Deployment                    | Region        |
| --------------- | ----------------------------- | ------------- |
| Trace Collector | Cloud Run sidecar             | europe-north1 |
| Reasoning Store | Supabase (existing)           | EU            |
| Audit Log       | Supabase (dedicated table)    | EU            |
| Privacy Filter  | Cloud Run (pre-LLM pipeline)  | europe-north1 |
| Safety Filter   | Cloud Run (inbound/outbound)  | europe-north1 |
| Dashboard       | Cloudflare Pages (admin-only) | EU-routed     |

### 7.6 Aiven Rollout Timeline

| Phase                   | Period     | Deliverables                                                          |
| ----------------------- | ---------- | --------------------------------------------------------------------- |
| **Foundation**          | Q2 2026    | OpenTelemetry integration, basic trace collection, audit log schema   |
| **Reasoning Lineage**   | Q3 2026    | Decision chain logging, pgvector reasoning store, forensic dashboard  |
| **Trust Guardrails**    | Q3–Q4 2026 | PII masking (Presidio), toxicity filtering (NeMo), approval gates     |
| **Certification Ready** | Q4 2026    | EU AI Act high-risk assessment, documentation package, external audit |
| **Production**          | Q1 2027    | Full Article 12 compliance, customer-facing compliance reports        |

### 7.7 Aiven for DWS 6 vs DWS 7

| Aspect            | DWS 6 + Aiven            | DWS 7 + Aiven                            |
| ----------------- | ------------------------ | ---------------------------------------- |
| **Scope**         | Climate assistant only   | All 6+ agent types                       |
| **Logging depth** | Basic interaction traces | Full reasoning lineage (CoT/ReAct/ToT)   |
| **Storage**       | Shared Supabase table    | Dedicated audit schema, 7-year retention |
| **Dashboard**     | Read-only log viewer     | Forensic debugging, compliance export    |
| **Certification** | Self-assessed            | External audit (ISO 27001 + EU AI Act)   |

---

## 8. Environment Matrix

### 8.1 Complete Service-to-Environment Mapping

| Service           | US Cloud (Cloudflare) | EU Cloud (GCP/Supabase) | Aiven (EU)       | Hetzner (V3) | Aiven (Sandbox)        |
| ----------------- | --------------------- | ----------------------- | ---------------- | ------------ | ---------------------- |
| **Landing pages** | Cloudflare Pages      | —                       | —                | —            | —                      |
| **Dashboard SPA** | Cloudflare Pages      | —                       | —                | —            | —                      |
| **Edge API**      | Cloudflare Workers    | —                       | —                | —            | —                      |
| **Backend API**   | —                     | Cloud Run               | Trace sidecar    | —            | —                      |
| **AI Agents**     | —                     | Cloud Run               | Reasoning log    | —            | Agent workspace        |
| **MCP Hub**       | —                     | Cloud Run               | Trace sidecar    | —            | —                      |
| **Database**      | —                     | Supabase EU (prod)      | Audit tables     | —            | Daily mirror (sandbox) |
| **Auth**          | —                     | Supabase Auth           | Identity layer   | —            | Auth stubs             |
| **Jitsi (V3)**    | —                     | —                       | —                | Self-hosted  | —                      |
| **Email (V3)**    | —                     | —                       | —                | Self-hosted  | —                      |
| **Training**      | —                     | GCP A3 (burst)          | —                | —            | LWM training data      |
| **Monitoring**    | —                     | Prometheus + Grafana    | —                | —            | —                      |
| **Compliance**    | —                     | —                       | Full Aiven stack | —            | —                      |

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

| Data Type                    | US Cloud     | EU Cloud      | Aiven             | CLOUD Act Risk      |
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

| Deployment Option              | DWS 6 | DWS 7   | V3      | Aiven   |
| ------------------------------ | ----- | ------- | ------- | ------- |
| **EU Cloud (default)**         | High  | High    | High    | Maximum |
| **Self-hosted (customer VPC)** | —     | Maximum | Maximum | Maximum |
| **Hybrid edge**                | —     | High    | —       | High    |
| **OT-isolated**                | —     | Maximum | —       | Maximum |

---

## 10. Migration Path: DWS 6 → DWS 7

### 10.1 What Carries Forward

| Component            | DWS 6 → DWS 7                 | Action                                      |
| -------------------- | ----------------------------- | ------------------------------------------- |
| Supabase database    | Migrate with schema evolution | Migration scripts in `supabase/migrations/` |
| Cloud Run backend    | Upgrade in-place              | API versioning (v1 → v2 coexistence)        |
| Cloudflare frontend  | Upgrade in-place              | Dashboard v10 replaces v8/v9                |
| AI agents            | Upgrade + add new agents      | AgentFoundry evolution                      |
| Customer accounts    | Preserve                      | Supabase Auth continuity                    |
| `.env` configuration | Extend                        | New vars for Aiven, multi-tenant            |

### 10.2 What Changes

| DWS 6                | DWS 7                       | Change Type         |
| -------------------- | --------------------------- | ------------------- |
| Single-tenant        | Multi-tenant                | Architecture change |
| 3 test files         | 380+ test cases             | Quality enforcement |
| Manual compliance    | Automated Fit-for-55 engine | New capability      |
| No Aiven             | Full EU AI Act compliance   | New layer           |
| Single region        | Multi-region EU (FI + DE)   | Infrastructure      |
| No ISO certification | ISO 27001 + SOC 2           | Compliance          |
| 3 pilot customers    | 16 paying customers         | Scale               |

### 10.3 Migration Timeline

| Period            | Migration Step                                                                  |
| ----------------- | ------------------------------------------------------------------------------- |
| Feb–Apr 2026      | DWS 6 stabilized as "DWS 7 Phase 1" — same infra, production-hardened           |
| May–Jul 2026      | Article 12 Logging Pipeline added, compliance engine deployed — "DWS 7 Phase 2" |
| Aug–Oct 2026      | Multi-tenant, ISO 27001 infra controls — "DWS 7 Phase 3"                        |
| Nov 2026–May 2027 | Intelligence + expansion — "DWS 7 Phase 4-5"                                    |
| Jun–Dec 2027      | DWS IQ 7.0 GA release — "DWS 7 Phase 6"                                         |

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
| Aiven (logging/storage)             | €25–50             | OpenTelemetry + audit storage |
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

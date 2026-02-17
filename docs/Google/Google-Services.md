# Google Services — DWS IQ Platform

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/peaceful-hertz | Date: 17.02.2026 | Changes: Initial creation — documented GCP project dws6run6, Gemini status, Cloud Run services, Secret Manager, account structure

Session Links & References:
  - Claude Code (claude/peaceful-hertz): https://github.com/blogtheristo/dws6/commits/claude/peaceful-hertz

Document Status:
  - Created: 17.02.2026
  - Last Modified: 17.02.2026
  - Language: EN
  - Languages Available: EN
  - Publication Status: ACTIVE

***

## Table of Contents

1. [GCP Project](#1-gcp-project)
2. [Account Structure](#2-account-structure)
3. [Gemini](#3-gemini)
4. [Cloud Run Services](#4-cloud-run-services)
5. [Secret Manager](#5-secret-manager)
6. [Artifact Registry](#6-artifact-registry)
7. [Cloud Build](#7-cloud-build)
8. [Cloud Scheduler](#8-cloud-scheduler)
9. [APIs Enabled](#9-apis-enabled)
10. [Cost Summary](#10-cost-summary)
11. [Decision Log](#11-decision-log)

---

## 1. GCP Project

| Property | Value |
|----------|-------|
| **Project ID** | `dws6run6` |
| **Project Number** | `446442351781` |
| **Region** | `europe-north1` (Finland) |
| **Admin Account** | `admin@dws6.com` |
| **Billing** | Enabled |
| **Created** | 19.01.2026 |
| **`.env` variable** | `GOOGLE_CLOUD_PROJECT=dws6run6` |

---

## 2. Account Structure

| Account | Email | Role |
|---------|-------|------|
| **GCP Admin** | `admin@dws6.com` | Project owner, billing, Cloud Run, Secret Manager |
| **Development** | `risto.paarni2024@lifetime.fi` | EU Cloud pilot, Supabase, AI agents |

**Rule:** Use `admin@dws6.com` for all GCP console operations and VS Code Gemini login. Use `risto.paarni2024@lifetime.fi` for Supabase and development.

---

## 3. Gemini

### Gemini Code Assist (VS Code)

| Property | Value |
|----------|-------|
| **Usage** | Free tier (Gemini Code Assist for individuals) |
| **Login** | `admin@dws6.com` in VS Code |
| **Cost** | Free |
| **Features** | Code completion, chat, Gemini model access |

### Gemini for Google Cloud API (Enterprise Suite)

| Property | Value |
|----------|-------|
| **Status** | DISABLED (17.02.2026) |
| **Cost** | €62/month (not needed) |
| **Includes** | Code Assist, Cloud Assist, Security, BigQuery, Looker |
| **Re-enable if** | Enterprise features needed beyond free VS Code tier |

### Gemini API (for application code)

| Property | Value |
|----------|-------|
| **`.env` variable** | `GOOGLE_API_KEY=AIza...` |
| **Used by** | MCP Hub (planned, currently commented out) |
| **Status** | Key exists, not actively used in production |

---

## 4. Cloud Run Services

Region: `europe-north1` (Finland)

| Service | Purpose | Schedule | Config |
|---------|---------|----------|--------|
| `dws-iq-backend` | Express.js backend API | Always on (0-10 instances) | `cloudbuild.yaml` |
| `agent-lead-scout-001` | Lead enrichment, ICP scoring | Daily 06:00 CET | `AgentFoundry/cloudbuild.yaml` |
| `agent-outreach-001` | Email drafting, approval workflow | Mon-Fri 09:00 CET | `AgentFoundry/cloudbuild.yaml` |
| `agent-director-dashboard` | Monitoring and approval UI | Always on (1-3 instances) | `AgentFoundry/cloudbuild.yaml` |

### Morning Briefing (CEO Cockpit)

| Property | Value |
|----------|-------|
| **Code** | `src/morning-briefing/scheduler.ts` |
| **Schedule** | Mon-Sat 06:00 Helsinki time |
| **Email provider** | Resend (primary), SendGrid (fallback) |
| **Recipient** | `risto@lifetime.fi` |
| **Sender** | `noreply@dws6.com` |

---

## 5. Secret Manager

Secrets stored in Google Secret Manager (project `dws6run6`):

| Secret Name | Used By |
|-------------|---------|
| `anthropic-api-key` | Backend, Lead Scout, Proposal agents |
| `groq-api-key` | Outreach, Customer Success agents |
| `supabase-url` | All services |
| `supabase-service-key` | All services |
| `jwt-secret` | Backend auth |
| `apollo-api-key` | Lead Scout |
| `clearbit-api-key` | Lead Scout |
| `resend-api-key` | Outreach, Morning Briefing |
| `slack-webhook` | Notifications |
| `linkedin-email` | Outreach |
| `linkedin-password` | Outreach |

---

## 6. Artifact Registry

| Property | Value |
|----------|-------|
| **URL** | `europe-north1-docker.pkg.dev/dws6run6/dws-iq-repo` |
| **Images** | `dws-iq-backend`, `sales-agent` |
| **Region** | `europe-north1` |

---

## 7. Cloud Build

| Property | Value |
|----------|-------|
| **Service Account** | `446442351781@cloudbuild.gserviceaccount.com` |
| **Config (backend)** | `cloudbuild.yaml` |
| **Config (agents)** | `AgentFoundry/cloudbuild.yaml` |
| **Timeout** | 1200s (20 min) |

---

## 8. Cloud Scheduler

| Job | Cron | Target | Auth |
|-----|------|--------|------|
| Lead Scout | `0 6 * * *` (daily 06:00 CET) | `agent-lead-scout-001` | OIDC |
| Outreach | `0 9 * * 1-5` (Mon-Fri 09:00 CET) | `agent-outreach-001` | OIDC |

---

## 9. APIs Enabled

| API | Status | Notes |
|-----|--------|-------|
| Cloud Run API | Enabled | Core compute |
| Cloud Build API | Enabled | CI/CD |
| Artifact Registry API | Enabled | Container images |
| Secret Manager API | Enabled | Secrets |
| Cloud Scheduler API | Enabled | Cron jobs |
| Gemini for Google Cloud API | **Disabled** | €62/mo not needed |

---

## 10. Cost Summary

| Service | Monthly Cost |
|---------|-------------|
| Cloud Run (agents, scale-to-zero) | €5-10 |
| Cloud Run (dashboard, min 1 instance) | €15-20 |
| Cloud Build (4 builds/month) | €2-5 |
| Cloud Scheduler (2 jobs) | €0.30 |
| Secret Manager (11 secrets) | €0.50 |
| Artifact Registry (2 images) | €1-2 |
| **GCP Total** | **~€25-38/month** |

External costs (not GCP):

| Service | Monthly Cost |
|---------|-------------|
| LLM APIs (Anthropic + Groq) | €50-80 |
| Data APIs (Apollo, Clearbit) | €178 |
| Email (Resend) | €10 |

---

## 11. Decision Log

| Date | Decision | Reason |
|------|----------|--------|
| 19.01.2026 | Created project `dws6run6` | Serve Google Cloud Run processes |
| 17.02.2026 | Disabled Gemini for Google Cloud API | €62/month not needed — free Gemini Code Assist in VS Code is sufficient |
| 17.02.2026 | Use `admin@dws6.com` for GCP, `risto.paarni2024@lifetime.fi` for Supabase | Account separation per security policy |

---

## 12. Troubleshooting & Lessons Learned

### The Gemini Authentication Mess (17.02.2026)

**What happened:**
1. Gemini CLI in VS Code was authenticated with `risto.paarni2024@lifetime.fi`
2. This caused VS Code to lose the `dws6run6` project context
3. Gemini Code Assist stopped accepting messages
4. The "buy Gemini Pro" link from GCP console pointed to a non-existent page (`console.cloud.google.com/gemini/admin?chat=true`)

**Root cause:** Authenticating VS Code with the wrong Google account (`risto.paarni2024@lifetime.fi` instead of `admin@dws6.com`) broke the project association.

**Fix:**
1. In VS Code: sign out of Google account
2. Sign back in with `admin@dws6.com`
3. Set project to `dws6run6` in Gemini extension settings
4. Use free Gemini Code Assist — do NOT buy the €62/month enterprise suite

### `.env` Syntax Errors Found

```
# WRONG (YAML syntax, not .env):
GOOGLE_OAUTH_CLIENT_ID: ${GOOGLE_OAUTH_CLIENT_ID}
GOOGLE_OAUTH_CLIENT_SECRET: ${GOOGLE_OAUTH_CLIENT_SECRET}

# CORRECT (.env syntax):
GOOGLE_OAUTH_CLIENT_ID=your-oauth-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-oauth-client-secret
```

### Project ID Confusion

| What was documented | What is correct |
|---------------------|----------------|
| `dws6run` | `dws6run6` |

The project ID `dws6run` appeared in `Admin/ADMIN_MANUAL.md` and `cloudbuild.yaml`. The actual GCP project ID is `dws6run6`. Corrected in this session.

### Account Confusion Summary

| Task | Use This Account | NOT This |
|------|-----------------|----------|
| GCP Console | `admin@dws6.com` | `risto.paarni2024@lifetime.fi` |
| VS Code Gemini | `admin@dws6.com` | `risto.paarni2024@lifetime.fi` |
| Supabase | `risto.paarni2024@lifetime.fi` | `admin@dws6.com` |
| GitHub | `blogtheristo` | — |
| Cloudflare | dws6.com account | — |

### OAuth Status

| OAuth Provider | Status | File |
|----------------|--------|------|
| MCP servers (RFC 7591) | Implemented | `src/mcp/oauth_dcr.py` |
| Supabase Auth | Configured | `SUPABASE_OAUTH_SETUP_GUIDE.md` |
| GitHub PAT | Configured | `GITHUB_API_OAUTH_SSL_SETUP.md` |
| Google OAuth (user login) | **NOT configured** | Placeholders in `.env` only |

### Key URLs

| What | URL |
|------|-----|
| GCP Console (project) | `https://console.cloud.google.com/home/dashboard?project=dws6run6` |
| APIs & Services | `https://console.cloud.google.com/apis/dashboard?project=dws6run6` |
| Secret Manager | `https://console.cloud.google.com/security/secret-manager?project=dws6run6` |
| Cloud Run | `https://console.cloud.google.com/run?project=dws6run6` |
| IAM | `https://console.cloud.google.com/iam-admin/iam?project=dws6run6` |
| Gemini setup docs | `https://docs.cloud.google.com/gemini/docs/codeassist/set-up-gemini` |
| Gemini pricing | `https://cloud.google.com/products/gemini/pricing` |

---

**Document Owner:** Platform Operations
**Related:** [Cloud Environments](../CLOUD_ENVIRONMENTS.md) | [Admin Manual](../../Admin/ADMIN_MANUAL.md)

---

(c) 2026 Lifetime Oy — Google Services Documentation

# Google Services — DWS IQ Platform

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/peaceful-hertz | Date: 17.02.2026 | Changes: Initial creation — documented GCP project dws6run6, Gemini status, Cloud Run services, Secret Manager, account structure
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/peaceful-hertz | Date: 17.02.2026 | Changes: Added GCP org structure, DWS IQ Pilot project, complete login flow documentation

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

1. [GCP Organization & Projects](#1-gcp-organization--projects)
2. [Account Structure](#2-account-structure)
3. [Gemini](#3-gemini)
4. [Login & Authentication (dws6.com)](#4-login--authentication-dws6com)
5. [Cloud Run Services](#5-cloud-run-services)
6. [Secret Manager](#6-secret-manager)
7. [Artifact Registry](#7-artifact-registry)
8. [Cloud Build](#8-cloud-build)
9. [Cloud Scheduler](#9-cloud-scheduler)
10. [Credentials & Keys](#10-credentials--keys)
11. [APIs Enabled](#11-apis-enabled)
12. [Cost Summary](#12-cost-summary)
13. [Decision Log](#13-decision-log)
14. [Troubleshooting & Lessons Learned](#14-troubleshooting--lessons-learned)

---

## 1. GCP Organization & Projects

### Organization

| Property | Value |
|----------|-------|
| **Organization** | `dws6.com` |
| **Org ID** | `784410725346` |
| **Admin Account** | `admin@dws6.com` |

### Projects Under `admin@dws6.com`

| Project | ID | Purpose | Billing | Region |
|---------|----|---------|---------|--------|
| **dws6run6** | `dws6run6` (number: `446442351781`) | Cloud Run, Secret Manager, Cloud Build | Enabled | `europe-north1` (Finland) |

### Projects Under `risto.paarni2024@lifetime.fi`

| Project | ID | Purpose | Billing | Region |
|---------|----|---------|---------|--------|
| **DWS IQ Pilot** | *(personal GCP project)* | EU Cloud pilot, AI agents, development | Enabled | `europe-north1` (Finland) |

### `.env` Variable

```
GOOGLE_CLOUD_PROJECT=dws6run6
```

---

## 2. Account Structure

| Account | Email | Owns | Use For |
|---------|-------|------|---------|
| **GCP Admin** | `admin@dws6.com` | Org `dws6.com`, project `dws6run6` | GCP Console, Cloud Run, Secret Manager, VS Code Gemini login |
| **Development** | `risto.paarni2024@lifetime.fi` | Project `DWS IQ Pilot` | Supabase, AI agents, EU Cloud pilot |
| **GitHub** | `blogtheristo` | Repo `dws6` | Code, CI/CD, GitHub Actions |
| **Cloudflare** | dws6.com account | Pages, Workers, DNS | Public sites, CDN, edge |

**Rules:**
- Use `admin@dws6.com` for all GCP console operations and VS Code Gemini login
- Use `risto.paarni2024@lifetime.fi` for Supabase and development
- NEVER authenticate VS Code Gemini with `risto.paarni2024@lifetime.fi` — it loses the `dws6run6` project context

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

## 4. Login & Authentication (dws6.com)

### How Login Works

```
User → dws6.com/login/ → Supabase Auth → Role-based dashboard redirect
```

**Auth provider:** Supabase Auth (hosted EU, project `kpucuwwfhuwurdxyjjtz`)
**Flow type:** PKCE (Proof Key for Code Exchange)
**Session storage key:** `dws6-auth-token`

### Login Methods

| Method | Provider | Status |
|--------|----------|--------|
| Email + Password | Supabase Auth | Active |
| Google Workspace OAuth | Supabase + Google | Active |
| Microsoft/Azure AD | Supabase + Microsoft | Active |
| Proton Key | Custom | UI exists, not connected |
| IBM Watsonx | Custom | UI exists, not connected |

### Login Flow (Email/Password)

1. User goes to `dws6.com/login/index.html`
2. Enters email + password (3 tabs: Standard, Proton Key, Social/OAuth)
3. `auth-handler.js` calls `supabase.auth.signInWithPassword()`
4. If MFA enabled → redirect to `/mfa-verify/` for TOTP 6-digit code
5. If no MFA → `role-router.js` reads `user.user_metadata.role`
6. Redirect to role-specific dashboard (13 roles defined)
7. Audit event logged to `auth_audit_log` table

### Login Flow (Google OAuth)

1. User clicks "Google Workspace" button
2. `auth-handler.js` calls `supabase.auth.signInWithOAuth({provider: 'google'})`
3. Stores `pending_oauth_role` in sessionStorage
4. User redirected to Google consent screen
5. Google returns to Supabase callback URL
6. `handleOAuthCallback()` assigns role, updates last login
7. Redirect to dashboard

### MFA (Multi-Factor Authentication)

| Feature | Implementation |
|---------|---------------|
| TOTP | Supabase `mfa.enroll()` + `mfa.verify()` |
| Backup codes | 10 codes, SHA-256 hashed, one-time use |
| Handler | `dws6.com/shared/js/mfa-handler.js` (564 lines) |
| UI | `dws6.com/mfa-verify/index.html` |

### Role-Based Dashboards (13 roles)

| Role | Dashboard Path |
|------|---------------|
| `dws_iq_standard` | `/dashboard/dws-iq/` |
| `enterprise_client` | `/dashboard/enterprise/` |
| `watsonx_user` | `/dashboard/watsonx/` |
| `backoffice_admin` | `/dashboard/backoffice/` |
| `api_developer` | `/dashboard/api/` |
| `mcp_admin` | `/dashboard/mcp-hub/` |
| `store_manager` | `/dashboard/store/` |
| + 6 more | See `supabase-config.js` |

### Security Settings

| Setting | Value |
|---------|-------|
| Password minimum | 12 chars (upper + lower + number + special) |
| Session timeout | 1 hour |
| Max login attempts | 5 per 15 minutes |
| Lockout duration | 15 minutes |
| JWT access token | 24-hour expiry |
| JWT refresh token | 7-day expiry |
| Token blacklist | Redis (prod) / in-memory (dev) |
| Email verification | Required before access |
| Audit logging | All auth events, email hashed (GDPR) |

### Key Files

| File | Purpose |
|------|---------|
| `dws6.com/login/index.html` | Main login page (710 lines) |
| `dws6.com/shared/js/auth-handler.js` | All auth logic (827 lines) |
| `dws6.com/shared/js/supabase-client.js` | Supabase client init |
| `dws6.com/shared/js/mfa-handler.js` | MFA enrollment + verification |
| `dws6.com/shared/js/role-router.js` | Post-login role redirect |
| `dws6.com/shared/config/supabase-config.js` | URLs, keys, role mappings |
| `src/services/auth.service.ts` | Backend JWT + bcrypt (346 lines) |
| `src/routes/auth.routes.ts` | API: /register, /login, /logout, /refresh |
| `src/middleware/auth.middleware.ts` | Token verification, rate limiting, RBAC |

### Backend API Endpoints

```
POST /api/v1/auth/register    — Create account (email verification sent)
POST /api/v1/auth/login       — Login (rate limited: 5/15min)
POST /api/v1/auth/logout      — Revoke token + blacklist
POST /api/v1/auth/refresh     — Refresh access token
POST /api/v1/auth/verify-email — Verify email token
POST /api/v1/auth/forgot-password — Send reset email
```

---

## 5. Cloud Run Services

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
| **Email** | risto@onelifetime.world (verified in SES and Resend.com) |
| **Recipient** | `risto@lifetime.fi` |

---

## 6. Secret Manager

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
| `resend-api-key` | Fallback email (SES SMTP primary) |
| `slack-webhook` | Slack notifications (Incoming Webhook); optional |
| `teams-webhook` | Microsoft Teams notifications (Incoming Webhook); optional |
| `linkedin-email` | Outreach |
| `linkedin-password` | Outreach |

---

## 7. Artifact Registry

| Property | Value |
|----------|-------|
| **URL** | `europe-north1-docker.pkg.dev/dws6run6/dws-iq-repo` |
| **Images** | `dws-iq-backend`, `sales-agent` |
| **Region** | `europe-north1` |

---

## 8. Cloud Build

| Property | Value |
|----------|-------|
| **Service Account** | `446442351781@cloudbuild.gserviceaccount.com` |
| **Config (backend)** | `cloudbuild.yaml` |
| **Config (agents)** | `AgentFoundry/cloudbuild.yaml` |
| **Timeout** | 1200s (20 min) |

---

## 9. Cloud Scheduler

| Job | Cron | Target | Auth |
|-----|------|--------|------|
| Lead Scout | `0 6 * * *` (daily 06:00 CET) | `agent-lead-scout-001` | OIDC |
| Outreach | `0 9 * * 1-5` (Mon-Fri 09:00 CET) | `agent-outreach-001` | OIDC |

---

## 10. Credentials & Keys (project `dws6run6`)

### API Keys

| Name | Created | Restrictions | `.env` variable |
|------|---------|-------------|-----------------|
| `GOOGLE_API_KEY` | 17.02.2026 | None (should be restricted) | `GOOGLE_API_KEY=AIza...` — **active in VS Code `.env`** |

### OAuth 2.0 Client IDs

| Name | Created | Type | Client ID |
|------|---------|------|-----------|
| `Web client 1` | 17.02.2026 | Web application | `1074393862472-38v...` |

**OAuth status:** Client created but NOT yet connected to dws6.com login. The `.env` placeholders need the actual client ID and secret:

```
GOOGLE_OAUTH_CLIENT_ID=1074393862472-38v...  (get full ID from GCP Console)
GOOGLE_OAUTH_CLIENT_SECRET=...               (get from GCP Console > Credentials > Web client 1)
```

**To connect Google OAuth to dws6.com login:**
1. GCP Console > APIs & Services > Credentials > `Web client 1`
2. Add authorized redirect URI: `https://kpucuwwfhuwurdxyjjtz.supabase.co/auth/v1/callback`
3. Add authorized JavaScript origin: `https://dws6.com`
4. Copy Client ID + Secret to Supabase Dashboard > Auth > Providers > Google
5. Copy Client ID to `.env` as `GOOGLE_OAUTH_CLIENT_ID`

---

## 11. APIs Enabled

| API | Status | Notes |
|-----|--------|-------|
| Cloud Run API | Enabled | Core compute |
| Cloud Build API | Enabled | CI/CD |
| Artifact Registry API | Enabled | Container images |
| Secret Manager API | Enabled | Secrets |
| Cloud Scheduler API | Enabled | Cron jobs |
| Gemini for Google Cloud API | **Disabled** | €62/mo not needed |

---

## 12. Cost Summary

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

## 13. Decision Log

| Date | Decision | Reason |
|------|----------|--------|
| 19.01.2026 | Created project `dws6run6` | Serve Google Cloud Run processes |
| 17.02.2026 | Disabled Gemini for Google Cloud API | €62/month not needed — free Gemini Code Assist in VS Code is sufficient |
| 17.02.2026 | Use `admin@dws6.com` for GCP, `risto.paarni2024@lifetime.fi` for Supabase | Account separation per security policy |

---

## 14. Google Drive Archive

For DWS 6 document archives (weekly reports, investor PDFs, compliance, thesis, NotebookLM), see **[docs/google-drive.md](../google-drive.md)**. All archives use `risto.paarni2024@lifetime.fi`. Setup script: `scripts/Setup-GoogleDriveFolders.ps1`.

---

## 15. Troubleshooting & Lessons Learned

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
| Google OAuth (user login) | **Client created** (17.02.2026) — needs redirect URI + Supabase connection | See Section 10 |

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
**Related:** [Cloud Environments](../CLOUD_ENVIRONMENTS.md) | [Google Drive](../google-drive.md) | [Admin Manual](../../Admin/ADMIN_MANUAL.md)

---

(c) 2026 Lifetime Oy — Google Services Documentation

# DWS IQ Platform - Admin Manual

---

# VERSION AND AGENT HISTORY

Version: 2.3

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: Nov 2025 | Date: 23.11.2025 | Changes: Initial creation, session history
- Version: 1.1 | Tool: Claude Code | Session: Dec 2025 | Date: 11.12.2025 | Changes: Sensitive Data Protection section
- Version: 1.2 | Tool: Claude Code | Session: Dec 2025 | Date: 19.12.2025 | Changes: Bug Tracking & Security Maintenance
- Version: 1.3 | Tool: Claude Code | Session: PxSux | Date: 23.12.2025 | Changes: AI Agent Policy from 2,500+ agent analysis
- Version: 1.4 | Tool: Claude Code | Session: Jan 2026 | Date: 03.01.2026 | Changes: Code Review Process, removed Argus PR Review
- Version: 1.5 | Tool: Claude Code | Session: Jan 2026 | Date: 04.01.2026 | Changes: AI Model Configuration, Security Framework
- Version: 1.6 | Tool: Claude Code | Session: r6bU3 | Date: 24.01.2026 | Changes: Training section with LWM/Firehorse workflows
- Version: 1.7 | Tool: Claude Code | Session: krDzD | Date: 29.01.2026 | Changes: Climate Assistant Chat Widget, Copilot instructions, security fixes
- Version: 1.8 | Tool: Claude Code (Opus 4.6) | Session: claude/research-dws-brand-standard-Rm8Jw | Date: 06.02.2026 | Changes: Admin Manuals Index, Revolut payments, MCP config, Karpathy guidelines, security glossary, DPA, backup infrastructure, multi-agent orchestration
- Version: 1.9 | Tool: Claude Code (Opus 4.6) | Session: claude/research-dws-brand-standard-Rm8Jw | Date: 06.02.2026 | Changes: Windows Startup folder documentation, pandoc PDF generation workflow
- Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/research-dws-brand-standard-Rm8Jw | Date: 06.02.2026 | Changes: Moved 9 admin manuals to Admin/ folder, PDF auto-open in Edge on login, splatting fix
- Version: 2.1 | Tool: Claude Code (Opus 4.6) | Session: claude/research-dws-brand-standard-Rm8Jw | Date: 07.02.2026 | Changes: Script versioning, engine choice (HTML/PDF), Supabase sync in startup pipeline, code/scripts backup
- Version: 2.2 | Tool: Claude Code (Opus 4.7) | Session: claude/ci-hygiene-audit-vBYGo | Date: 22.04.2026 | Changes: Local-First CI + Audit Log section; new Audit Manual linked; Files & Folders manual indexed
- Version: 2.3 | Tool: Copilot CLI (GPT-5.3-Codex) | Session: claude/fix-booking-email-delivery-20260429 | Date: 29.04.2026 | Changes: SES SMTP runtime hardening, Supabase runtime env audit, Cloud Run env requirements updated

Session Links & References:

- Claude Code (Rm8Jw): https://github.com/blogtheristo/dws6/commits/claude/research-dws-brand-standard-Rm8Jw
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL.md

Document Status:

- Created: 23.11.2025
- Last Modified: 29.04.2026
- Language: English
- Languages Available: English
- Publication Status: ✅ ACTIVE

---

**Repository:** [blogtheristo/dws6](https://github.com/blogtheristo/dws6)

---

## Table of Contents

1. [Admin Manuals Index](#admin-manuals-index) ⭐ **NEW in v1.8**
2. [Installation Manual](#installation-manual-link)
3. [Scaleway Serverless Containers](#scaleway-serverless-containers-primary)
4. [Revolut Payments & Store](#revolut-payments--store) ⭐ **NEW in v1.8**
5. [MCP Configuration](#mcp-configuration) ⭐ **NEW in v1.8**
6. [Climate Assistant Chat Widget](#climate-assistant-chat-widget)
7. [AI Agent Operational Guidelines](#ai-agent-operational-guidelines) ⭐ **NEW in v1.8**
8. [Security Glossary & OWASP](#security-glossary--owasp) ⭐ **NEW in v1.8**
9. [Data Processing Agreement (DPA)](#data-processing-agreement-dpa) ⭐ **NEW in v1.8**
10. [Backup & Sync Infrastructure](#backup--sync-infrastructure) ⭐ **NEW in v1.8**
11. [Multi-Agent Orchestration](#multi-agent-orchestration) ⭐ **NEW in v1.8**
12. [GitHub Copilot Instructions](#github-copilot-instructions)
13. [Session Security Fixes (January 2026)](#session-security-fixes-january-2026)
14. [Files and Folders Structure](#files-and-folders-structure)
15. [Document Index](#document-index)
16. [AI Agent Policy](#ai-agent-policy)
17. [Deployment Procedures](#deployment-procedures)
18. [Session History](#session-history)
19. [Maintenance Plan (Complete)](#maintenance-plan-complete)
20. [Bug Tracking & Security Maintenance](#bug-tracking--security-maintenance)
21. [Code Review Process](#code-review-process)
22. [Maintenance Tasks](#maintenance-tasks)
23. [Git Workflow](#git-workflow)
24. [Sensitive Data Protection](#sensitive-data-protection)
25. [Emergency Procedures](#emergency-procedures)
26. [Training](#training)

---

## Admin Manuals Index

All admin manuals across the DWS6 repository, organized by domain.

### Core Platform

| Manual                               | Location                                                                 | Language | Description                                                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------- |
| **Admin Manual** (this file)         | [`ADMIN_MANUAL.md`](ADMIN_MANUAL.md)                                     | EN       | Master admin manual - platform operations                                                                      |
| **Audit Manual (external auditors)** | [`ADMIN_MANUAL_AUDIT.md`](ADMIN_MANUAL_AUDIT.md)                         | EN       | Audit-trail inventory, sample SQL, integrity checks, auditor access model (EU AI Act Art. 12, GDPR, ISO 27001) |
| **GitHub Apps Audit**                | [`GITHUB_APPS_AUDIT.md`](GITHUB_APPS_AUDIT.md)                           | EN       | Audit of 9 installed GitHub Apps; keep / review / remove verdict; Continue → Claude Code migration             |
| **Authentication Manual**            | [`ADMIN_MANUAL_AUTHENTICATION.md`](ADMIN_MANUAL_AUTHENTICATION.md)       | EN       | JWT auth, login flows, token management                                                                        |
| **Supabase Manual**                  | [`ADMIN_MANUAL_SUPABASE_EN_v1.md`](ADMIN_MANUAL_SUPABASE_EN_v1.md)       | EN       | Database, RLS, migrations, storage                                                                             |
| **Testing Manual**                   | [`ADMIN_MANUAL_TESTING.md`](ADMIN_MANUAL_TESTING.md)                     | EN       | Vitest, security tests, CI/CD testing                                                                          |
| **Files & Folders Index**            | [`ADMIN_MANUAL_FILES_AND_FOLDERS.md`](ADMIN_MANUAL_FILES_AND_FOLDERS.md) | EN       | Every script, workflow, config, doc — what it does and how it's used                                           |
| **Gaps Analysis**                    | [`ADMIN_MANUAL_GAPS_ANALYSIS.md`](ADMIN_MANUAL_GAPS_ANALYSIS.md)         | EN       | Missing features and remediation plan                                                                          |

### Websites & Store

| Manual                     | Location                                                                                                        | Language | Description                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------- |
| **DWS6.com Manual**        | [`ADMIN_MANUAL_DWS6_COM.md`](ADMIN_MANUAL_DWS6_COM.md)                                                          | EN       | DWS6 website operations                                        |
| **DWS10 Store & Payments** | [`ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md`](ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md)                                  | EN       | Revolut + Stripe hybrid flow, Google Merchant ops, 38 products |
| **Store Admin (EN)**       | [`dws10.com/docs/STORE_ADMIN_MANUAL_EN.md`](../dws10.com/docs/STORE_ADMIN_MANUAL_EN.md)                         | EN       | Store product management, feeds                                |
| **Store Admin (FI)**       | [`dws10.com/docs/STORE_ADMIN_MANUAL_FI.md`](../dws10.com/docs/STORE_ADMIN_MANUAL_FI.md)                         | FI       | Kaupan hallinta                                                |
| **Dashboard V8 Manual**    | [`ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md`](ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md)                                      | EN       | Firehorse dashboard operations                                 |
| **Blog System (EN)**       | [`onelifetime.world/ADMIN_MANUAL_BLOG_SYSTEM_EN_v1.md`](../onelifetime.world/ADMIN_MANUAL_BLOG_SYSTEM_EN_v1.md) | EN       | Onelifetime.world blog CMS                                     |
| **Blog System (FI)**       | [`onelifetime.world/ADMIN_MANUAL_BLOG_SYSTEM_FI_v1.md`](../onelifetime.world/ADMIN_MANUAL_BLOG_SYSTEM_FI_v1.md) | FI       | Blogin hallinta                                                |

### Security

| Manual                     | Location                                                                                             | Language | Description                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------- |
| **Security Manuals Index** | [`Admin/Security/ADMIN_MANUALS_INDEX.md`](Security/ADMIN_MANUALS_INDEX.md)                           | EN       | Index of all security documentation         |
| **Domain Validator**       | [`Admin/Security/ADMIN_MANUAL_DOMAIN_VALIDATOR.md`](Security/ADMIN_MANUAL_DOMAIN_VALIDATOR.md)       | EN       | Domain validation and DNS security          |
| **Security Monitoring**    | [`Admin/Security/ADMIN_MANUAL_SECURITY_MONITORING.md`](Security/ADMIN_MANUAL_SECURITY_MONITORING.md) | EN       | Security monitoring and alerting            |
| **Security Testing**       | [`Admin/Security/ADMIN_MANUAL_SECURITY_TESTING.md`](Security/ADMIN_MANUAL_SECURITY_TESTING.md)       | EN       | Penetration testing, vulnerability scanning |
| **Security Audit Report**  | [`Admin/SECURITY_AUDIT_REPORT.md`](SECURITY_AUDIT_REPORT.md)                                         | EN       | Latest security audit findings              |

### Products & Architecture

| Manual                    | Location                                                                                         | Language | Description                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------ | -------- | ------------------------------------------------ |
| **Firehorse Omnichannel** | [`Admin/Firehorse_Omnichannel_Next_Admin_Manual.md`](Firehorse_Omnichannel_Next_Admin_Manual.md) | EN       | Omnichannel product operations                   |
| **Files & Folders**       | [`ADMIN_MANUAL_FILES_AND_FOLDERS.md`](ADMIN_MANUAL_FILES_AND_FOLDERS.md)                         | EN       | Repository structure, backup infrastructure      |
| **Port Mapping**          | [`PORT_MAPPING.md`](PORT_MAPPING.md)                                                             | EN       | Docker/host port allocation, conflict prevention |

### Related Documentation

| Document                  | Location                                                                            | Description                                                                 |
| ------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **CLAUDE.md**             | [`CLAUDE.md`](../CLAUDE.md)                                                         | AI agent behavior guidelines (Karpathy principles)                          |
| **DPA Agreement**         | [`docs/DPA_DATA_PROCESSING_AGREEMENT.md`](../docs/DPA_DATA_PROCESSING_AGREEMENT.md) | GDPR data processing agreement                                              |
| **MCP Configuration**     | [`docs/MCP_CONFIGURATION.md`](../docs/MCP_CONFIGURATION.md)                         | Model Context Protocol server setup                                         |
| **Security Compliance**   | [`SECURITY_COMPLIANCE.md`](SECURITY_COMPLIANCE.md)                                  | Security framework and compliance status                                    |
| **Security Glossary**     | [`docs/SECURITY_GLOSSARY.md`](../docs/SECURITY_GLOSSARY.md)                         | Security terms and OWASP references                                         |
| **Playwright Capability** | [`docs/PLAYWRIGHT.md`](../docs/PLAYWRIGHT.md)                                       | `dws browse` + MCP `dws_browse_*` — JS-rendered fetch, screenshot, snapshot |
| **Agent Second Brain**    | [`docs/AGENT_SECOND_BRAIN.md`](../docs/AGENT_SECOND_BRAIN.md)                       | DGX Spark embeddings, KB inbox watcher, `dws kb preflight`                  |

---

## Maintenance Plan (Complete)

This section links the **full maintenance plan** in one place:

- **Operations maintenance (runbook)**:
  - [Deployment Procedures](#deployment-procedures) (Cloudflare Pages deploy flow + manual retry)
  - [Maintenance Tasks](#maintenance-tasks) (weekly/monthly + recommended automated checks)
  - [Sensitive Data Protection](#sensitive-data-protection) (what must never be committed + incident handling)
  - [Emergency Procedures](#emergency-procedures) (rollback + DNS/SSL triage)

- **Security maintenance**:
  - [Bug Tracking & Security Maintenance](#bug-tracking--security-maintenance) (audit status, fix history, monthly budget, roadmap)

---

## Installation Manual Link

**NEW:** Complete Installation and Deployment Guide

📖 **See:** [`INSTALLATION_MANUAL.md`](INSTALLATION_MANUAL.md)

**Purpose:** Comprehensive guide for installing DWS IQ on:

- Private Cloud infrastructure
- IBM Watsonx platform
- Google Cloud Run
- Groq Edge AI

**Deployment Structures:** `Admin/Installation/`

- `Admin/Installation/Private/` - Self-managed infrastructure
- `Admin/Installation/Public/watsonx/` - IBM AI platform
- `Admin/Installation/Public/gcr/` - Google Cloud serverless
- `Admin/Installation/Public/groq/` - Edge AI hardware

**Start Here:** Choose your platform and follow the README in that folder.

---

## Scaleway Serverless Containers (Primary)

**Status:** ✅ **ACTIVE** - EU-hosted, GDPR compliant
**Last Updated:** January 28, 2026
**Session ID:** krDzD

### Overview

Scaleway Serverless Containers provides EU-hosted container deployment with full GDPR compliance. Selected as primary deployment platform due to:

- 🇫🇷 French company, EU data residency
- 🔒 GDPR compliant by design
- 💰 Pay-per-use pricing, generous free tier
- 🚀 Similar to Google Cloud Run (serverless containers)

### Live Deployment

| Property               | Value                                                                           |
| ---------------------- | ------------------------------------------------------------------------------- |
| **Status**             | ✅ **LIVE**                                                                     |
| **Container Endpoint** | `https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud` |
| **Container ID**       | `7f17b90d-a44c-4b75-ab9e-7099c5ade031`                                          |
| **Namespace ID**       | `3639617d-3041-4051-9a28-19b4ca6a14db`                                          |
| **Deployed**           | January 28, 2026                                                                |

### Project Configuration

| Property               | Value                                  |
| ---------------------- | -------------------------------------- |
| **Organization Name**  | `dws6`                                 |
| **Organization ID**    | `78e26603-c820-4617-b0d2-f8589eb7693b` |
| **Project Name**       | `dws-iq-backend`                       |
| **Project ID**         | `78e26603-c820-4617-b0d2-f8589eb7693b` |
| **Region**             | `fr-par` (Paris, France)               |
| **Zone**               | `fr-par-1`                             |
| **Container Registry** | `rg.fr-par.scw.cloud/dws-iq-backend`   |
| **Admin Account**      | `admin@dws6.com`                       |
| **Console URL**        | https://console.scaleway.com           |

### API Credentials

| Key                     | Value                             |
| ----------------------- | --------------------------------- |
| **Access Key**          | `SCW_ACCESS_KEY=<set-in-secrets>` |
| **Secret Key**          | `SCW_SECRET_KEY=<set-in-secrets>` |
| **Application Name**    | `dws-iq-chat-cli`                 |
| **API Key Description** | `dws-iq-chat-cli-v1`              |
| **Expiration**          | Never (Organization setting)      |

> **Security note:** Configure `SCW_ACCESS_KEY` and `SCW_SECRET_KEY` only via your secret manager or deployment environment (e.g., CI/CD secrets, `.env` files not committed to the repo). Do **not** store live credentials in this document or in source control.

### IAM Policy Configuration

| Property           | Value                                  |
| ------------------ | -------------------------------------- |
| **Policy ID**      | `ef70608b-d296-48a7-bac9-c20c909b0251` |
| **Principal**      | `dws-iq-chat-cli`                      |
| **Scope**          | All current Projects                   |
| **Permission Set** | `AllProductsFullAccess`                |
| **Created**        | January 28, 2026                       |

### Environment Variables (PowerShell)

> **⚠️ SECURITY WARNING:** The credentials shown below were exposed in a previous commit and have been **rotated**. Never commit real credentials to source control. Always use environment variables populated from a password manager or CI/CD secrets.

```powershell
# Set permanently (User level)
# Replace placeholder values with your actual credentials from your password manager
[Environment]::SetEnvironmentVariable("SCW_ACCESS_KEY", "SCWXXXXXXXXXXXXXXXXX", "User")
[Environment]::SetEnvironmentVariable("SCW_SECRET_KEY", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", "User")
[Environment]::SetEnvironmentVariable("SCW_DEFAULT_ORGANIZATION_ID", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", "User")
[Environment]::SetEnvironmentVariable("SCW_DEFAULT_PROJECT_ID", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", "User")
[Environment]::SetEnvironmentVariable("SCW_DEFAULT_REGION", "fr-par", "User")
[Environment]::SetEnvironmentVariable("SCW_DEFAULT_ZONE", "fr-par-1", "User")

# Apply to current session
# Replace placeholder values with your actual credentials from your password manager
$env:SCW_ACCESS_KEY = "SCWXXXXXXXXXXXXXXXXX"
$env:SCW_SECRET_KEY = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$env:SCW_DEFAULT_ORGANIZATION_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$env:SCW_DEFAULT_PROJECT_ID = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
$env:SCW_DEFAULT_REGION = "fr-par"
$env:SCW_DEFAULT_ZONE = "fr-par-1"
```

### CLI Installation & Setup

```powershell
# 1. Install Scaleway CLI (Windows)
choco install scaleway-cli

# 2. Verify installation
scw version

# 3. Configure (interactive)
scw init

# 4. Or configure via environment variables (see above)
# Then verify configuration
scw info
```

### Deployment Commands (Step-by-Step)

```powershell
# Step 1: Login to Container Registry
scw registry login

# Step 2: Create Registry Namespace (first time only)
scw registry namespace create name=dws-iq region=fr-par

# Step 3: Build Docker Image
cd F:\2026\Repos2026\dws6
docker build -t rg.fr-par.scw.cloud/dws-iq/dws-iq-backend:latest .

# Step 4: Push to Scaleway Container Registry
docker push rg.fr-par.scw.cloud/dws-iq/dws-iq-backend:latest

# Step 5: Create Serverless Container Namespace
scw container namespace create name=dws-iq-backend region=fr-par

# Step 6: Deploy Container (replace <namespace-id> with actual ID from step 5)
# Replace <your-groq-api-key> with your actual Groq API key from https://console.groq.com/
scw container container create \
  namespace-id=<namespace-id> \
  name=dws-iq-backend \
  registry-image=rg.fr-par.scw.cloud/dws-iq/dws-iq-backend:latest \
  environment-variables.GROQ_API_KEY=<your-groq-api-key> \
  environment-variables.NODE_ENV=production \
  min-scale=0 \
  max-scale=5 \
  memory-limit=512 \
  port=8080
```

> **Security note:** Replace `<your-groq-api-key>` with your actual Groq API key. **Never** commit live API keys to source control. For production deployments, use Scaleway Secrets Manager or pass environment variables securely via CI/CD secrets (see GitHub Actions configuration below).

### One-Liner Deployment (After Initial Setup)

```powershell
cd F:\2026\Repos2026\dws6; docker build -t rg.fr-par.scw.cloud/dws-iq/dws-iq-backend:latest .; docker push rg.fr-par.scw.cloud/dws-iq/dws-iq-backend:latest
```

### API Endpoints (Live)

**Base URL:** `https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud`

| Endpoint                                | Method | Description                 |
| --------------------------------------- | ------ | --------------------------- |
| `/health`                               | GET    | Health check                |
| `/api/v2/climate-assistant/chat`        | POST   | Chat with Climate Assistant |
| `/api/v2/climate-assistant/lead`        | POST   | Submit lead capture form    |
| `/api/v2/climate-assistant/topics`      | GET    | List allowed topics         |
| `/api/v2/climate-assistant/session/:id` | GET    | Get session details         |

### Test Commands

```powershell
# Health check
curl https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud/health

# Chat (public user - 1 free message)
curl -X POST https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud/api/v2/climate-assistant/chat -H "Content-Type: application/json" -d "{\"message\": \"What is CBAM?\"}"

# Get allowed topics
curl https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud/api/v2/climate-assistant/topics
```

### Container Configuration

| Setting                   | Value        | Description                          |
| ------------------------- | ------------ | ------------------------------------ |
| **Port**                  | `8080`       | Container HTTP port                  |
| **Memory**                | `2048 MB`    | Container memory limit               |
| **vCPU**                  | `1000 mVCPU` | 1 full vCPU                          |
| **Min Scale**             | `0`          | Scale to zero when idle              |
| **Max Scale**             | `5`          | Maximum concurrent instances         |
| **Concurrent Executions** | `50`         | Max concurrent requests per instance |
| **Timeout**               | `300s`       | Request timeout                      |
| **Privacy**               | `Public`     | Publicly accessible endpoint         |
| **HTTPS Only**            | `Enabled`    | Enforce HTTPS only (no plain HTTP)   |
| **HTTP Protocol**         | `HTTP/1`     | HTTP version                         |

### Troubleshooting

**Error: "organization ID is required"**

```powershell
# Use your actual organization ID from the Scaleway console
$env:SCW_DEFAULT_ORGANIZATION_ID = "<your-organization-id>"
```

**Error: "insufficient permissions"**

- Go to IAM → Applications → dws-iq-chat-cli → Policies
- Attach `AllProductsFullAccess` policy

**Error: "namespace not found"**

```powershell
scw registry namespace list
# Use the correct namespace ID
```

### Useful Commands

```powershell
# List registry namespaces
scw registry namespace list

# List container namespaces
scw container namespace list

# List containers
scw container container list

# View container logs
scw container container logs <container-id>

# Delete container
scw container container delete <container-id>

# Update container image
scw container container update <container-id> registry-image=rg.fr-par.scw.cloud/dws-iq/dws-iq-backend:latest
```

### GitHub Actions CI/CD

**Status:** ✅ **ACTIVE** - Automated deployment on push to main
**Workflow File:** `.github/workflows/deploy-scaleway.yml`
**Last Updated:** January 28, 2026

#### Workflow Triggers

- **Push to main** - Auto-deploys when src/, public/, package\*.json, Dockerfile, or tsconfig.json changes
- **Manual dispatch** - Can be triggered manually from GitHub Actions UI

#### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

> **⚠️ SECURITY WARNING:** Use actual credentials from your Scaleway console. The values shown below are placeholders only.

| Secret Name           | Value                        | Description                               |
| --------------------- | ---------------------------- | ----------------------------------------- |
| `SCW_ACCESS_KEY`      | `<your-scaleway-access-key>` | Scaleway API access key (starts with SCW) |
| `SCW_SECRET_KEY`      | `<your-scaleway-secret-key>` | Scaleway API secret key (UUID format)     |
| `SCW_ORGANIZATION_ID` | `<your-org-id>`              | Scaleway organization ID (UUID format)    |
| `SCW_PROJECT_ID`      | `<your-project-id>`          | Scaleway project ID (UUID format)         |
| `SCW_NAMESPACE_ID`    | `<your-namespace-id>`        | Container namespace ID (UUID format)      |

#### Setup Instructions

1. **Navigate to GitHub repository settings:**

   ```
   https://github.com/blogtheristo/dws6/settings/secrets/actions
   ```

2. **Add each secret:**
   - Click "New repository secret"
   - Enter secret name and value
   - Click "Add secret"

3. **Verify workflow:**
   - Go to Actions tab
   - Find "Deploy to Scaleway Serverless Containers"
   - Trigger manually or push to main

#### Workflow Features

- **Docker Build** - Multi-stage build with caching
- **Image Push** - Pushes to Scaleway Container Registry
- **Auto-Deploy** - Redeploys container with new image
- **Health Check** - Verifies deployment success
- **Failure Notification** - Creates GitHub issue on failure

#### Manual Trigger

```bash
# Trigger deployment from CLI
gh workflow run deploy-scaleway.yml
```

---

## Revolut Payments & Store

**Status:** ✅ **ACTIVE**
**Last Updated:** February 6, 2026
**Session ID:** Rm8Jw

### Overview

DWS10.com store uses Revolut Web SDK for payment processing across 25 products. All payments are processed through a Cloudflare Worker that creates Revolut orders.

### Architecture

```
Customer clicks "Buy" → Revolut Web SDK (browser) → Cloudflare Worker → Revolut Merchant API → Order created
                         ↓
                    Revolut Checkout (hosted page) → Payment completed → Redirect to success page
```

### Key Configuration

| Component           | Value                                                |
| ------------------- | ---------------------------------------------------- |
| **Worker**          | `dws-revolut-checkout` at `api.dws10.com/checkout/*` |
| **Worker Source**   | `src/cloudflare/revolut-checkout-worker.ts`          |
| **Worker Config**   | `src/cloudflare/wrangler.revolut.toml`               |
| **Products Config** | `dws10.com/config/products.json`                     |
| **Store Page**      | `dws10.com/buy/index.html`                           |
| **Public Key**      | Stored in `products.json` settings (pk\_ prefix)     |
| **Amounts**         | Minor currency units (7034 = €70.34)                 |

### Related Manuals

- **Full manual:** [`ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md`](ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md) - Complete Revolut integration guide
- **Store admin (EN):** [`dws10.com/docs/STORE_ADMIN_MANUAL_EN.md`](../dws10.com/docs/STORE_ADMIN_MANUAL_EN.md) - Product management
- **Store admin (FI):** [`dws10.com/docs/STORE_ADMIN_MANUAL_FI.md`](../dws10.com/docs/STORE_ADMIN_MANUAL_FI.md) - Kaupan hallinta

### Quick Commands

```bash
# Deploy Worker
cd src/cloudflare && wrangler deploy -c wrangler.revolut.toml

# Test order creation
curl -X POST https://api.dws10.com/checkout/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount": 7034, "currency": "EUR", "description": "Test"}'
```

---

## MCP Configuration

**Status:** ✅ **ACTIVE**
**Last Updated:** February 5, 2026

### Overview

Model Context Protocol (MCP) connects Claude Code and other AI tools to external services for database access, caching, and API operations.

### Configured Servers

| Server                | Port | Purpose                               | Credentials                                          |
| --------------------- | ---- | ------------------------------------- | ---------------------------------------------------- |
| **Supabase MCP**      | -    | Database queries, auth, real-time     | `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`               |
| **Upstash Redis MCP** | -    | Token blacklist, rate limiting, cache | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| **DWS Supabase API**  | 8766 | Custom REST wrapper                   | Docker-based                                         |
| **MCP Hub**           | 8765 | Multi-agent workflow coordination     | Temporal.io integration                              |

### Setup

```bash
# Copy template and fill credentials
cp .mcp.json.example .mcp.json
# Edit .mcp.json with actual credentials (NEVER commit .mcp.json)
git check-ignore .mcp.json  # Must return ".mcp.json"
```

### Related Documentation

- **Full guide:** [`docs/MCP_CONFIGURATION.md`](../docs/MCP_CONFIGURATION.md)
- **Worktree scripts** auto-copy `.mcp.json` to new worktrees

---

## Climate Assistant Chat Widget

**Status:** ✅ **ACTIVE**
**Last Updated:** January 29, 2026
**Session ID:** krDzD

### Overview

The Climate Assistant Chat Widget is an embeddable JavaScript widget that provides EU Climate Compliance expertise on any website. It connects to the Scaleway-hosted backend API.

### Live Deployments

| Site                  | URL                                                                                                  | Status      |
| --------------------- | ---------------------------------------------------------------------------------------------------- | ----------- |
| **Standalone Page**   | https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud/climate-assistant.html | ✅ Live     |
| **dws10.com**         | https://dws10.com                                                                                    | ✅ Embedded |
| **onelifetime.world** | https://onelifetime.world                                                                            | ✅ Embedded |

### Embed Code

Add the following script tag before the closing `</body>` tag on any website:

```html
<!-- DWS Climate Assistant Chat Widget -->
<script
  src="https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud/chat-widget.js"
  async
></script>
```

### Widget Features

| Feature                 | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| **Floating Button**     | Blue chat button fixed at bottom-right corner           |
| **Chat Interface**      | Full-featured chat window (380×520px)                   |
| **Topic Buttons**       | Quick access to CBAM, CSRD, Fit for 55, EU ETS, Scope 3 |
| **Voice Input**         | Web Speech API integration for voice-to-text            |
| **Session Persistence** | Maintains session ID across page reloads                |
| **Mobile Responsive**   | Adapts to mobile viewport sizes                         |
| **Auto Scroll**         | Messages auto-scroll to latest                          |
| **Typing Indicator**    | Animated dots while waiting for response                |

### Widget Configuration

The widget is configured in `public/chat-widget.js`:

```javascript
const CONFIG = {
  apiUrl: "https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud",
  primaryColor: "#0066FF",
  title: "Climate Assistant",
  subtitle: "EU Climate Compliance Expert",
  placeholder: "Ask about CBAM, CSRD, Fit for 55...",
  welcomeMessage: "Hello! I'm your EU Climate Compliance Assistant...",
  position: "right", // 'left' or 'right'
};
```

### API Endpoints Used

| Endpoint                         | Method | Purpose           |
| -------------------------------- | ------ | ----------------- |
| `/api/v2/climate-assistant/chat` | POST   | Send chat message |

### Source Code Location

| File                            | Purpose                                     |
| ------------------------------- | ------------------------------------------- |
| `public/chat-widget.js`         | Embeddable widget (530 lines, IIFE pattern) |
| `public/climate-assistant.html` | Standalone chat page                        |
| `src/app.ts`                    | Express server with Helmet CSP configured   |

### Security Configuration (Helmet CSP)

The Express server is configured to allow the chat widget and inline scripts:

```typescript
// src/app.ts - Helmet CSP configuration
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: [
          "'self'",
          "https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud",
        ],
      },
    },
  }),
);
```

### Troubleshooting

**Widget not appearing:**

1. Check browser console for JavaScript errors
2. Verify script URL is accessible
3. Ensure no Content Security Policy blocking

**403 error on chat page:**

- Helmet CSP needs to allow `'unsafe-inline'` for scripts
- Re-deploy backend after updating `src/app.ts`

**Voice input not working:**

- Web Speech API requires HTTPS
- Browser must support `webkitSpeechRecognition` or `SpeechRecognition`

---

## GitHub Copilot Instructions

**Status:** ✅ **ACTIVE**
**Last Updated:** January 29, 2026
**Session ID:** krDzD

### Overview

Custom instructions for GitHub Copilot that provide project-specific context, coding standards, and development guidelines.

### File Location

`.github/copilot-instructions.md`

### Contents

| Section                  | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| **Project Overview**     | DWS IQ 6 platform description                    |
| **Tech Stack**           | Frontend, Backend, AI/LLM, Database technologies |
| **Code Style**           | TypeScript, React, naming conventions            |
| **Development Commands** | npm scripts for dev, build, test                 |
| **Security Rules**       | Never/Always lists for secure coding             |
| **Git Workflow**         | Branch naming, commit messages                   |
| **Key Directories**      | Repository structure                             |
| **Deployment**           | Scaleway Serverless info                         |
| **Testing**              | Vitest requirements                              |

### Usage

GitHub Copilot automatically reads this file when working in the repository to provide context-aware suggestions aligned with project standards.

---

## Session Security Fixes (January 2026)

**Session ID:** krDzD
**Date:** January 28-29, 2026
**Branch:** `claude/fix-v9-chat-loading-krDzD`

### Security Vulnerabilities Fixed

| Issue                    | Severity | File                                           | Fix                                           |
| ------------------------ | -------- | ---------------------------------------------- | --------------------------------------------- |
| **Insecure CORS**        | High     | `src/app.ts`                                   | Replaced wildcard `*` with explicit allowlist |
| **Privilege Escalation** | Critical | `src/routes/climate-assistant-gated.routes.ts` | Removed client-controlled tier parameter      |
| **JWT Validation**       | High     | `src/routes/climate-assistant-gated.routes.ts` | Validate JWT tokens before tier upgrade       |
| **Helmet CSP**           | Medium   | `src/app.ts`                                   | Configure CSP to allow static HTML pages      |

### CORS Configuration (Fixed)

Before (insecure):

```typescript
app.use(cors({ origin: "*" })); // Allows any origin
```

After (secure):

```typescript
app.use(
  cors({
    origin: [
      "https://dws10.com",
      "https://onelifetime.world",
      "https://lifetime.fi",
      "https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud",
    ],
    credentials: true,
  }),
);
```

### JWT Validation (Fixed)

- Tokens must be validated before upgrading user tier
- Added security tests in `src/__tests__/jwt-validation-security.test.ts`
- Added auth tests in `src/__tests__/climate-assistant-gated-auth.test.ts`

### Files Changed

| File                                                 | Action                        |
| ---------------------------------------------------- | ----------------------------- |
| `src/app.ts`                                         | CORS allowlist, Helmet CSP    |
| `src/routes/climate-assistant-gated.routes.ts`       | JWT validation, tier security |
| `src/__tests__/jwt-validation-security.test.ts`      | New security tests            |
| `src/__tests__/climate-assistant-gated-auth.test.ts` | New auth tests                |
| `vitest.config.ts`                                   | Test configuration            |

---

## Google Cloud Run (Active - B2B Payment Stack)

**Status:** ✅ **ACTIVE** - Deployed for B2B payment webhooks

### Project: dws6run6

| Property              | Value                                               |
| --------------------- | --------------------------------------------------- |
| **Project ID**        | `dws6run6`                                          |
| **Project Number**    | `1074393862472`                                     |
| **Region**            | `europe-north1` (Finland)                           |
| **Artifact Registry** | `europe-north1-docker.pkg.dev/dws6run6/dws-iq-repo` |
| **Admin Account**     | `admin@dws6.com`                                    |
| **Service**           | `dws-iq-backend` (Stripe webhook endpoint)          |
| **Endpoint**          | `https://dws-iq-backend-[hash]-uc.a.run.app`        |

### ⚠️ CRITICAL: Cloud Build Service Account IAM Roles

**Service Account:** `1074393862472-compute@developer.gserviceaccount.com`

**Required Roles** (grant ALL of these or build will fail):

| Role                             | Permission                | Why Needed                         |
| -------------------------------- | ------------------------- | ---------------------------------- |
| `roles/cloudbuild.builds.editor` | Cloud Build operations    | Build and push Docker images       |
| `roles/storage.admin`            | Cloud Storage access      | Upload source code tarball + cache |
| `roles/logging.logWriter`        | Write build logs          | Display build output and errors    |
| `roles/artifactregistry.writer`  | Push to Artifact Registry | Store Docker images                |
| `roles/run.developer`            | Deploy to Cloud Run       | Create/update Cloud Run services   |

**Setup Commands** (run once per project):

```bash
# Grant Cloud Build permissions
gcloud projects add-iam-policy-binding dws6run6 \
  --member=serviceAccount:1074393862472-compute@developer.gserviceaccount.com \
  --role=roles/cloudbuild.builds.editor

# Grant Storage access
gcloud projects add-iam-policy-binding dws6run6 \
  --member=serviceAccount:1074393862472-compute@developer.gserviceaccount.com \
  --role=roles/storage.admin

# Grant Logging access
gcloud projects add-iam-policy-binding dws6run6 \
  --member=serviceAccount:1074393862472-compute@developer.gserviceaccount.com \
  --role=roles/logging.logWriter

# Grant Artifact Registry access
gcloud projects add-iam-policy-binding dws6run6 \
  --member=serviceAccount:1074393862472-compute@developer.gserviceaccount.com \
  --role=roles/artifactregistry.writer

# Grant Cloud Run access
gcloud projects add-iam-policy-binding dws6run6 \
  --member=serviceAccount:1074393862472-compute@developer.gserviceaccount.com \
  --role=roles/run.developer
```

### Deployment Commands (from repo root in CMD)

```bash
# Authenticate with Google Cloud
gcloud auth login --project=dws6run6

# Set active project
gcloud config set project dws6run6

# Build and push Docker image
gcloud builds submit --tag europe-north1-docker.pkg.dev/dws6run6/dws-iq-repo/dws-iq-backend:latest

# Deploy to Cloud Run with environment variables
gcloud run deploy dws-iq-backend ^
  --image europe-north1-docker.pkg.dev/dws6run6/dws-iq-repo/dws-iq-backend:latest ^
  --region europe-north1 ^
  --allow-unauthenticated ^
  --memory 512Mi ^
  --cpu 1 ^
  --timeout 300 ^
  --set-env-vars="STRIPE_SECRET_KEY=sk_live_...,STRIPE_WEBHOOK_SECRET=whsec_...,NODE_ENV=production"

# View deployment logs
gcloud run logs read dws-iq-backend --region europe-north1 --limit 50
```

### Troubleshooting

| Error                                                    | Cause                             | Fix                                 |
| -------------------------------------------------------- | --------------------------------- | ----------------------------------- |
| `PERMISSION_DENIED: does not have permission`            | Missing IAM role                  | Run one of the setup commands above |
| `does not have storage.objects.get access`               | Missing `roles/storage.admin`     | Grant storage.admin role            |
| `does not have permission to write logs`                 | Missing `roles/logging.logWriter` | Grant logging.logWriter role        |
| `Build step failure: gcr.io/cloud-builders/gcb-internal` | Multiple permission issues        | Run ALL setup commands              |

### Webhook Configuration

**Stripe Workbench Setup:**

- Endpoint URL: `https://dws-iq-backend-[hash]-uc.a.run.app/webhooks/stripe`
- Events: `invoice.payment_succeeded`, `invoice.payment_failed`, `invoice.payment_attempt_required`, `invoice.payment_action_required`, `charge.refunded`, `customer.deleted`
- Signing Secret: `whsec_...` (from Stripe Workbench → Destination)

**Environment Variables Required:**

- `STRIPE_SECRET_KEY` (sk*live*...)
- `STRIPE_WEBHOOK_SECRET` (whsec\_...)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

### Runtime Environment Audit (2026-04-29)

**Scope:** Verify that production runtime instances include Supabase credentials required for booking + email audit logging, and align email delivery with SES SMTP-only policy.

#### Cloud Run verification result

| Project | Service | SUPABASE_URL | SUPABASE_SERVICE_KEY | Status |
| --- | --- | --- | --- | --- |
| `dws6run6` | `dws-iq-backend` | `secret` | `secret` | ✅ OK |
| `dws6-backend` | N/A | N/A | N/A | ⚠️ No services visible to current operator identity (or no services deployed) |

#### SES SMTP-only runtime requirements

For booking confirmations and admin notifications to send reliably, Cloud Run runtime must include:

- `SMTP_HOST`
- `SMTP_PORT` (default `587`)
- `SMTP_SECURE` (default `false`)
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM` (default `risto@onelifetime.world`)
- `BOOKING_ADMIN_EMAIL` (default `risto@lifetime.fi`)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

#### Implemented hardening changes (same remediation set)

1. Cloud Run GitHub deployment now injects SMTP + Supabase envs:
   - `.github/workflows/deploy-cloudrun.yml`
2. Manual PowerShell Cloud Run deployment now validates and injects SMTP + Supabase envs:
   - `scripts/Deploy-CloudRun.ps1`
3. Core mail sender switched to SES SMTP-only behavior (Resend fallback removed):
   - `src/utils/send-email.ts`
4. Additional email flows switched from Resend/SendGrid fallback to SES SMTP sender:
   - `src/morning-briefing/scheduler.ts`
   - `src/outreach/daily-digest.ts`
   - `src/routes/hil.routes.ts`
   - `src/routes/webhook.routes.ts`

---

## AI Agent Operational Guidelines

**Based on:** Andrej Karpathy's AI coding principles (adapted for enterprise)
**Implementation:** [`CLAUDE.md`](../CLAUDE.md) in repository root
**Added to thesis:** [`docs/metropolia/master-thesis/en/V2Thesis_EN.md`](../docs/metropolia/master-thesis/en/V2Thesis_EN.md) (Appendix E)

### Core Philosophy

> "You are the hands; the human is the architect. Move fast, but never faster than the human can verify."

### Critical Behaviors for DWS IQ Operations

| #   | Behavior                     | Operational Impact                                                                     |
| --- | ---------------------------- | -------------------------------------------------------------------------------------- |
| 1   | **Assumption Surfacing**     | All AI agents must state assumptions before implementing changes to production systems |
| 2   | **Confusion Management**     | STOP when encountering conflicting configs (e.g., .env vs production secrets)          |
| 3   | **Push Back When Warranted** | Agents must flag security risks even if human requests them                            |
| 4   | **Simplicity Enforcement**   | Prefer boring, obvious solutions over clever abstractions                              |
| 5   | **Scope Discipline**         | Never modify files outside the requested scope                                         |
| 6   | **Dead Code Hygiene**        | Ask before deleting - prevents accidental data loss                                    |

### DWS-Specific Failure Modes

| #   | Failure Mode                                 | Prevention                        |
| --- | -------------------------------------------- | --------------------------------- |
| 13  | Not using DWS document standard              | Follow `DWS_DOCUMENT_STANDARD.md` |
| 14  | Deleting files without asking                | Explicit approval required        |
| 15  | Using new environment without security check | Verify .gitignore and .env first  |

### EU AI Act Alignment

These guidelines support EU AI Act Article 12 (Automatic Logging): assumption templates create reasoning chains, change summaries provide audit trails, inline planning demonstrates decision-making process.

---

## Security Glossary & OWASP

**Source:** [`docs/SECURITY_GLOSSARY.md`](../docs/SECURITY_GLOSSARY.md) and thesis glossary

### Authentication Terms (Quick Reference)

| Term                | Definition                                                         |
| ------------------- | ------------------------------------------------------------------ |
| **JWT**             | JSON Web Token - stateless authentication (24h access, 7d refresh) |
| **bcrypt**          | Password hashing (12 salt rounds)                                  |
| **RBAC**            | Role-Based Access Control (admin, member, viewer)                  |
| **RLS**             | Row Level Security - Supabase database-level access per user       |
| **Token Blacklist** | Redis/database of revoked tokens (checked on every request)        |

### OWASP Top 10 - DWS6 Relevance

| Code         | Issue                  | Where in DWS6                           |
| ------------ | ---------------------- | --------------------------------------- |
| **A01:2021** | Broken Access Control  | Role extraction, Admin API validation   |
| **A02:2021** | Cryptographic Failures | JWT secret validation                   |
| **A03:2021** | Injection              | Input validation (express-validator)    |
| **A07:2021** | Auth Failures          | Password verification, Token revocation |

### Related Manuals

- **Full glossary:** [`docs/SECURITY_GLOSSARY.md`](../docs/SECURITY_GLOSSARY.md)
- **Authentication manual:** [`ADMIN_MANUAL_AUTHENTICATION.md`](ADMIN_MANUAL_AUTHENTICATION.md)
- **Security testing:** [`Admin/Security/ADMIN_MANUAL_SECURITY_TESTING.md`](Security/ADMIN_MANUAL_SECURITY_TESTING.md)
- **Security monitoring:** [`Admin/Security/ADMIN_MANUAL_SECURITY_MONITORING.md`](Security/ADMIN_MANUAL_SECURITY_MONITORING.md)

---

## Data Processing Agreement (DPA)

**Full document:** [`docs/DPA_DATA_PROCESSING_AGREEMENT.md`](../docs/DPA_DATA_PROCESSING_AGREEMENT.md)
**Jurisdiction:** Finnish law (Helsinki courts), GDPR

### Key Terms for Operations

| Obligation                        | Requirement                               |
| --------------------------------- | ----------------------------------------- |
| **Data Residency**                | EU data centers default (Finland/Germany) |
| **Encryption**                    | AES-256 at rest, TLS 1.3 in transit       |
| **Breach Notification**           | Within 48 hours                           |
| **AI Training on Customer Data**  | NOT allowed without written consent       |
| **AI Output Ownership**           | Customer retains ownership                |
| **Data Export After Termination** | 30-day window                             |
| **Confidentiality**               | 5 years post-contract                     |

### Sub-Processors

| Provider     | Location | Purpose                     |
| ------------ | -------- | --------------------------- |
| Supabase     | EU       | Database, auth, storage     |
| Google Cloud | EU       | Cloud Run backend           |
| Cloudflare   | EU       | CDN, Workers, Pages         |
| Anthropic    | USA\*    | Claude AI (SCC applied)     |
| Groq         | USA\*    | LLM inference (SCC applied) |
| Temporal     | EU       | Workflow orchestration      |

\*USA processors: Standard Contractual Clauses (SCC) with data minimization/pseudonymization

---

## Backup & Sync Infrastructure

**Status:** ✅ **ACTIVE** (since February 6, 2026)
**Full documentation:** [`ADMIN_MANUAL_FILES_AND_FOLDERS.md`](ADMIN_MANUAL_FILES_AND_FOLDERS.md)

### Three-Layer Backup Strategy

| Layer               | Tool                                  | Location                                 |
| ------------------- | ------------------------------------- | ---------------------------------------- |
| 1. Git              | GitHub (private repo)                 | All source + business docs               |
| 2. Proton Drive     | `scripts/Sync-ToProton.ps1`           | Business files + secrets                 |
| 3. Full Backup      | `scripts/Sync-ToProton.ps1 -FullRepo` | Complete repo to `F:\2026\Backups\dws6\` |
| 4. Supabase Storage | `scripts/Sync-ToSupabase.ps1`         | EU cloud `admin-vault` bucket            |

### Critical: Claude Code Cloud Limitation

Claude Code cloud sessions can ONLY reach GitHub. Supabase, Google Cloud, Proton Drive are all blocked. Files in gitignored paths are **destroyed** when sessions end. This is why:

- Business docs (Admin/, AgentFoundry/, Team/) are tracked in git (private repo)
- Only actual secrets (.env, API keys) remain gitignored
- Local sync scripts bridge git repo to Proton Drive

### Script Version Registry

All automation scripts include version headers and change logs.

| Script                            | Version | Purpose                                                 |
| --------------------------------- | ------- | ------------------------------------------------------- |
| `scripts/Startup-DailySync.bat`   | v1.4    | Login trigger: git pull + Proton sync + docs + Supabase |
| `scripts/Sync-ToProton.ps1`       | v1.7    | Proton Drive sync (folders, secrets, docs, Learn/ HTML) |
| `scripts/Generate-PDFs.ps1`       | v1.6    | Markdown to HTML/PDF (pandoc, output to Learn/)         |
| `scripts/Install-StartupSync.ps1` | v1.1    | Creates/removes Startup shortcut                        |
| `scripts/Sync-ToSupabase.ps1`     | v1.2    | EU cloud backup to Supabase Storage                     |

### Daily Operations

| Task                 | How to run                                                  |
| -------------------- | ----------------------------------------------------------- |
| Sync to Proton       | VS Code: Terminal > Run Task > "Sync to Proton Drive"       |
| Full backup          | VS Code: Terminal > Run Task > "Full Repo Backup to Proton" |
| Pull and sync        | VS Code: Terminal > Run Task > "Pull and Sync"              |
| Dry run              | `.\scripts\Sync-ToProton.ps1 -DryRun`                       |
| Auto on login        | `.\scripts\Install-StartupSync.ps1` (one-time)              |
| Generate docs (HTML) | `.\scripts\Generate-PDFs.ps1` (default: HTML engine)        |
| Generate docs (PDF)  | `.\scripts\Generate-PDFs.ps1 -Engine wkhtmltopdf`           |
| Supabase backup      | `.\scripts\Sync-ToSupabase.ps1` (or `-DryRun`)              |

### Windows Startup Auto-Sync

The daily sync runs automatically on Windows login via a shortcut in:

```
C:\Users\risto\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
```

**Setup (one-time):**

```powershell
.\scripts\Install-StartupSync.ps1        # Install shortcut
.\scripts\Install-StartupSync.ps1 -Remove  # Remove shortcut
```

**What it does on every Windows login:**

1. Waits 120 seconds (for network + Proton Drive to mount)
2. `git pull origin main` (gets latest from GitHub)
3. Runs `Sync-ToProton.ps1 -GeneratePDFs -OpenNewPDFs` (Proton sync + doc generation)
4. Runs `Sync-ToSupabase.ps1` (EU cloud backup of Admin, scripts, src, Firehorse, sales, investor)
5. Opens changed documents in Edge for morning review

### Document Generation (Pandoc)

Converts 16 key markdown files (admin manuals, sales, investor) to styled HTML or PDF.

**Prerequisites (install once):**

```powershell
winget install --id JohnMacFarlane.Pandoc          # Required
winget install wkhtmltopdf                          # Optional (PDF engine)
```

**Engine choice:**
| Engine | Output | Dependencies | Reliability |
|--------|--------|-------------|-------------|
| `html` (default) | `.html` styled documents | pandoc only | Always works |
| `wkhtmltopdf` | `.pdf` files | pandoc + wkhtmltopdf | May have path issues |

**Run manually:**

```powershell
.\scripts\Generate-PDFs.ps1                        # HTML (default, always works)
.\scripts\Generate-PDFs.ps1 -Engine wkhtmltopdf    # PDF output
.\scripts\Generate-PDFs.ps1 -DryRun                # Preview what would be generated
.\scripts\Generate-PDFs.ps1 -OpenNew               # Open changed files in Edge
```

**Output location:** `F:\Proton\Proton\My files\2026\generated-pdfs\`

### Supabase Storage Backup

EU cloud backup of all code, scripts, and business documents to Supabase Storage.

**Bucket:** `admin-vault` (private)

**Folders synced:**
| Folder | Content |
|--------|---------|
| `Admin/` | Admin manuals, security docs |
| `scripts/` | PowerShell/Bash automation scripts |
| `src/` | Backend source code, integrations |
| `Firehorse/` | Product suite files |
| `AgentFoundry/` | AI agent configurations |
| `Team/` | Team documentation |
| `sales-outreach/` | Sales materials |
| `investor-outreach/` | Investor documents |
| `docs/metropolia/` | Thesis documentation |

**Run manually:** `.\scripts\Sync-ToSupabase.ps1` or `-DryRun` or `-CreateBucket`

---

## Multi-Agent Orchestration

**Source:** [`docs/thesis/MULTI_AGENT_COORDINATION_EN.md`](../docs/thesis/MULTI_AGENT_COORDINATION_EN.md) (Section 7.3)

### Claude Code: Subagents vs Agent Teams

| Aspect            | Subagents                  | Agent Teams                    |
| ----------------- | -------------------------- | ------------------------------ |
| **Context**       | Share caller's window      | Independent per agent          |
| **Communication** | Return to caller           | Direct messaging (mailbox)     |
| **Cost**          | Lower (summarized results) | Higher (full context each)     |
| **Best for**      | Focused research tasks     | Complex parallel collaboration |

### Recommended for DWS6 Operations

| Scenario                                   | Approach                           |
| ------------------------------------------ | ---------------------------------- |
| Sprint development                         | Agent Teams for parallel features  |
| PR review (security + performance + tests) | Agent Teams (3 reviewers)          |
| Sales automation                           | Subagents (cost-effective)         |
| Customer support                           | Subagents (predictable costs)      |
| Complex debugging                          | Agent Teams (competing hypotheses) |

### Upstash Redis (Serverless)

DWS6 uses Upstash Redis for distributed operations across agents:

| Use Case               | Details                                                    |
| ---------------------- | ---------------------------------------------------------- |
| **Token Blacklist**    | Revoked JWTs stored in Redis, checked on every API request |
| **Rate Limiting**      | Distributed rate limiting across serverless instances      |
| **Session Cache**      | Agent session state persistence                            |
| **API Response Cache** | Reduce LLM API calls for repeated queries                  |

**Tier:** Free (256MB, 500K commands/month)
**Protocol:** REST API (works in serverless, no TCP needed)
**Credentials:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` in `.env`

### Integration Architecture

```
MCP Hub (Port 8765) + Temporal.io
  ├── Subagents (focused, cost-effective)
  ├── Agent Teams (parallel, collaborative)
  └── Lifetime Scope Signals (dependency DAG)
```

### Related Documentation

- **MCP Configuration:** [`docs/MCP_CONFIGURATION.md`](../docs/MCP_CONFIGURATION.md)
- **Agent Teams field note:** [`docs/field-notes/2026-02-05-claude-code-agent-teams-vs-subagents.md`](../docs/field-notes/2026-02-05-claude-code-agent-teams-vs-subagents.md)

---

## Files and Folders Structure

### Root Directory

```
dws6/
├── admin/                          # Admin documentation (this folder)
│   └── ADMIN_MANUAL.md            # This file
├── in-update-claude/              # Temporary files from Claude sessions
├── lifetime-agent-foundry/        # Agent development framework
│   └── AGENT_FOUNDRY.md          # Complete framework documentation
├── landing-pages/                 # Static landing pages
│   ├── onelifetime-world/
│   │   └── index.html            # Community landing page
│   └── dws10-com/
│       └── index.html            # Platform landing page
├── AI_AGENT_POLICY.md             # AI Agent best practices policy
├── AI_AGENT_GUIDELINES.md         # Comprehensive agent guidelines
├── ARCHITECTURE_SUMMARY.md        # Visual architecture & traffic flows
├── CLOUDFLARE_DNS_RECORDS_READY.md # DNS records for all domains
├── CLOUDFLARE_DNS_SETUP.md        # Complete Cloudflare configuration
├── DOMAIN_STRATEGY.md             # Domain architecture analysis
├── IMPLEMENTATION_SUMMARY.md      # Next steps & quick reference
├── PAYMENT_INTEGRATION.md         # Revolut + PayPal integration
├── PLANNING_PHASE_UPDATED.md      # 90-day implementation roadmap
├── SITE_ARCHITECTURE.md           # Cross-linking strategy
├── STARTUP_PROGRAMS_APPLICATIONS.md # Startup credits applications
├── STRATEGIC_PARTNERSHIPS.md      # Partnerships documentation
├── README.md                      # Project overview
├── LICENSE                        # MIT License
└── .gitignore                     # Git ignore rules
```

---

## Document Index

### Core Planning Documents

| Document                      | Purpose                                 | Status     | Lines  | Last Updated |
| ----------------------------- | --------------------------------------- | ---------- | ------ | ------------ |
| **README.md**                 | Platform overview, mission, quick links | ✅ Current | ~200   | Nov 23, 2025 |
| **PLANNING_PHASE_UPDATED.md** | 90-day roadmap, code examples           | ✅ v3.0    | ~1,680 | Nov 23, 2025 |
| **ARCHITECTURE_SUMMARY.md**   | Visual diagrams, traffic flows          | ✅ Current | ~600   | Nov 23, 2025 |
| **IMPLEMENTATION_SUMMARY.md** | Quick reference, next steps             | ✅ v2.0    | ~575   | Nov 23, 2025 |

### Infrastructure Documentation

| Document                            | Purpose                          | Status     | Lines | Last Updated |
| ----------------------------------- | -------------------------------- | ---------- | ----- | ------------ |
| **CLOUDFLARE_DNS_SETUP.md**         | Complete DNS configuration guide | ✅ Current | ~634  | Nov 16, 2025 |
| **CLOUDFLARE_DNS_RECORDS_READY.md** | Specific DNS records to add      | ✅ Current | ~477  | Nov 16, 2025 |
| **DOMAIN_STRATEGY.md**              | 4 domain options analysis        | ✅ Current | ~487  | Nov 16, 2025 |
| **SITE_ARCHITECTURE.md**            | Cross-linking strategy           | ✅ Current | ~334  | Nov 23, 2025 |

### Business Documentation

| Document                             | Purpose                   | Status          | Lines | Last Updated |
| ------------------------------------ | ------------------------- | --------------- | ----- | ------------ |
| **PAYMENT_INTEGRATION.md**           | Revolut + PayPal webhooks | ✅ Current      | ~652  | Nov 16, 2025 |
| **STRATEGIC_PARTNERSHIPS.md**        | Peachscore, partnerships  | ⚠️ Needs update | ~386  | Nov 16, 2025 |
| **STARTUP_PROGRAMS_APPLICATIONS.md** | $125K credits guide       | ⚠️ Needs update | ~506  | Nov 16, 2025 |

### Agent Framework & Policy

| Document                                    | Purpose                        | Status     | Lines | Last Updated |
| ------------------------------------------- | ------------------------------ | ---------- | ----- | ------------ |
| **lifetime-agent-foundry/AGENT_FOUNDRY.md** | Complete agent framework       | ✅ Current | ~600+ | Nov 23, 2025 |
| **AI_AGENT_POLICY.md**                      | Agent best practices policy    | ✅ Current | ~650  | Dec 23, 2025 |
| **AI_AGENT_GUIDELINES.md**                  | Comprehensive agent guidelines | ✅ Current | ~400  | Nov 2025     |

### Landing Pages

| File                                           | Domain            | Status  | Last Updated |
| ---------------------------------------------- | ----------------- | ------- | ------------ |
| **landing-pages/onelifetime-world/index.html** | onelifetime.world | ✅ Live | Nov 22, 2025 |
| **landing-pages/dws10-com/index.html**         | dws10.com         | ✅ Live | Nov 23, 2025 |

---

## AI Agent Policy

⭐ **NEW in v1.3** - Added December 23, 2025

### Overview

**Purpose:** Define best practices for creating and maintaining AI agent instructions in the DWS6 project.

**Version:** 1.0
**Created:** December 23, 2025
**Session ID:** PxSux
**Based on:** Analysis of 2,500+ high-performing agent implementations

**Full Policy Document:** See [`AI_AGENT_POLICY.md`](../AI_AGENT_POLICY.md) in repository root

### Core Principles

All agent instruction files MUST include:

✅ **Executable commands in early sections** - Immediate actionability
✅ **Code examples over explanations** - Show, don't tell
✅ **Clear boundaries** - Explicit do's and don'ts
✅ **Stack specification** - Technologies and tools used
✅ **Six core areas** - Commands, testing, project structure, code style, git workflow, boundaries
✅ **Version tracking** - Document evolution and changes

### Required Structure

```markdown
# [Agent Name] - Instructions

**Version:** X.Y
**Stack:** [List technologies]
**Last Updated:** YYYY-MM-DD

## Quick Start Commands

[Executable commands first]

## Stack & Technologies

[Explicit stack listing]

## 1. Commands Reference

[Development, testing, deployment]

## 2. Testing Requirements

[Mandatory tests, coverage, examples]

## 3. Project Structure

[Directory layout, naming conventions]

## 4. Code Style Guidelines

[TypeScript/React patterns, examples]

## 5. Git Workflow

[Branch naming, commits, pre-commit checks]

## 6. Boundaries & Security

[Never/Always lists with examples]
```

### Key Security Boundaries

**NEVER:**

- ❌ Commit secrets or credentials
- ❌ Commit customer data (PII, GDPR protected)
- ❌ Commit admin files (ProtonDrive only)
- ❌ Skip tests without approval
- ❌ Force push to main/master
- ❌ Use any types in TypeScript

**ALWAYS:**

- ✅ Use environment variables for secrets
- ✅ Validate input data
- ✅ Write tests for new features
- ✅ Document complex logic
- ✅ Keep dependencies updated

### Testing Requirements

Before committing code:

- ✅ All unit tests pass (`npm test`)
- ✅ No TypeScript errors (`npm run type-check`)
- ✅ No linting errors (`npm run lint`)
- ✅ Code coverage ≥ 80% for new code
- ✅ Integration tests pass for affected modules

### Git Workflow

**Branch Naming:**

- `claude/feature-name-[SESSION_ID]`
- `feature/feature-name`
- `fix/bug-description-[SESSION_ID]`
- `docs/document-name-[SESSION_ID]`

**Commit Format:**

```
[Type] Short description (max 50 chars)

Detailed explanation of changes (wrap at 72 chars)

- Bullet points for multiple changes
- Reference issue numbers: Fixes #123

Files changed: filename.ts (version X.Y)
Session ID: [SESSION_ID]
```

**Types:** feat, fix, docs, style, refactor, test, chore

### Performance Guidelines

**React Components:**

```javascript
// ✅ GOOD: Memoized expensive computation
import { useMemo } from 'react';

function AgentList({ agents }: Props) {
  const sortedAgents = useMemo(
    () => agents.sort((a, b) => a.score - b.score),
    [agents]
  );
  return <div>{sortedAgents.map(renderAgent)}</div>;
}
```

**Database Queries:**

```javascript
// ✅ GOOD: Batched query with indexes
const agents = await db.agent.findMany({
  where: { userId: user.id },
  select: { id: true, name: true, score: true },
  orderBy: { score: "desc" },
  take: 10,
});
```

### Agent File Checklist

Before finalizing an agent instruction file:

- ✅ Quick start commands in early section
- ✅ Stack and technologies specified
- ✅ Code examples for all major concepts
- ✅ Clear boundaries (dos and don'ts)
- ✅ All six core areas covered
- ✅ Version number and date included
- ✅ No secrets or sensitive data
- ✅ Examples are executable and tested

### Implementation Status

**Current Agent Files:**

- `.claude/instructions.md` - ⚠️ Needs improvement (missing commands, stack, testing)
- `AI_AGENT_GUIDELINES.md` - ⚠️ Needs improvement (missing quick start, code examples)

**Improvement Proposal:** See `AGENT_IMPROVEMENTS_PROPOSAL.md`

**Priority Actions:**

1. Add quick start commands to `.claude/instructions.md`
2. Add stack specification
3. Create testing requirements section
4. Add code examples throughout
5. Implement pre-commit checklist
6. Add performance guidelines

---

## Deployment Procedures

### Cloudflare Pages Deployment

#### Current Setup

| Project           | Domain            | Source                    | Branch | Status  |
| ----------------- | ----------------- | ------------------------- | ------ | ------- |
| onelifetime-world | onelifetime.world | GitHub: blogtheristo/dws6 | main   | ✅ Live |
| dws10-platform    | dws10.com         | GitHub: blogtheristo/dws6 | main   | ✅ Live |

#### Root Directories

- **onelifetime-world:** `landing-pages/onelifetime-world`
- **dws10-platform:** `landing-pages/dws10-com`

#### Deployment Flow

```
Local Edit → Git Push → GitHub (main) → Cloudflare Pages Auto-Deploy
                                              ↓
                                         ~30 seconds
                                              ↓
                                    Live at domain
```

#### Manual Deployment (if needed)

1. Go to Cloudflare Pages dashboard
2. Select project
3. **Deployments** → **Retry deployment**

---

## Session History

### Session: January 28-29, 2026 (krDzD)

**Branch:** `claude/fix-v9-chat-loading-krDzD`

#### Tasks Completed

✅ Created GitHub Actions CI/CD workflow for Scaleway deployment
✅ Fixed Scaleway CLI argument names in workflow
✅ Fixed registry namespace error (dwsiqcontainersjwyssm4e → dws-iq)
✅ Fixed Helmet CSP to allow static HTML pages
✅ Created embeddable chat widget (public/chat-widget.js)
✅ Added chat widget to dws10.com and onelifetime.world
✅ Created GitHub Copilot instructions (.github/copilot-instructions.md)
✅ Fixed CORS security (wildcard → explicit allowlist)
✅ Fixed JWT validation security
✅ Fixed privilege escalation (removed client-controlled tier)
✅ Updated Admin Manual to v1.7

#### Files Created

| File                                                 | Purpose                | Status    |
| ---------------------------------------------------- | ---------------------- | --------- |
| `.github/workflows/deploy-scaleway.yml`              | CI/CD for Scaleway     | ✅ Active |
| `.github/copilot-instructions.md`                    | GitHub Copilot context | ✅ Active |
| `public/chat-widget.js`                              | Embeddable chat widget | ✅ Active |
| `src/__tests__/jwt-validation-security.test.ts`      | Security tests         | ✅ Active |
| `src/__tests__/climate-assistant-gated-auth.test.ts` | Auth tests             | ✅ Active |

#### Files Modified

| File                                           | Changes                       |
| ---------------------------------------------- | ----------------------------- |
| `src/app.ts`                                   | CORS allowlist, Helmet CSP    |
| `src/routes/climate-assistant-gated.routes.ts` | JWT validation, tier security |
| `dws10.com/index.html`                         | Chat widget embedded          |
| `onelifetime.world/index.html`                 | Chat widget embedded          |
| `landing-pages/dws10-com/index.html`           | Chat widget embedded          |
| `landing-pages/onelifetime-world/index.html`   | Chat widget embedded          |
| `Admin/ADMIN_MANUAL.md`                        | Updated to v1.7               |

#### Security Fixes

| Bug                         | Severity | Status   |
| --------------------------- | -------- | -------- |
| Insecure CORS (wildcard)    | High     | ✅ Fixed |
| Privilege escalation (tier) | Critical | ✅ Fixed |
| JWT validation missing      | High     | ✅ Fixed |
| Helmet CSP blocking         | Medium   | ✅ Fixed |

---

### Session: December 23, 2025 (PxSux)

**Branch:** `claude/check-api-credits-PxSux`

#### Tasks Completed

✅ Created AI Agent Policy based on 2,500+ agent analysis
✅ Created AI_AGENT_POLICY.md in repository root
✅ Created AGENT_IMPROVEMENTS_PROPOSAL.md with specific recommendations
✅ Protected admin/ directory in .gitignore (both Admin/ and admin/)
✅ Updated Admin Manual to v1.3 with AI Agent Policy section

#### Files Created/Updated

| File                           | Action          | Status              |
| ------------------------------ | --------------- | ------------------- |
| AI_AGENT_POLICY.md             | Created         | ✅ In repo          |
| AGENT_IMPROVEMENTS_PROPOSAL.md | Created         | ✅ In repo          |
| .gitignore                     | Updated         | ✅ Committed        |
| admin/ADMIN_MANUAL.md          | Updated to v1.3 | 📋 ProtonDrive only |

#### Key Findings

From 2,500+ Agent Analysis:

- Best agents start with executable commands
- Code examples more effective than explanations
- Clear boundaries (never/always) critical
- Stack specification improves consistency
- Six core areas ensure completeness
- Version tracking enables evolution

---

### Session: November 23, 2025

**Branch:** `claude/plan-agentic-ai-saas-019iY6SMFqVQnFq5GXUVB2jH`

#### Tasks Completed

1. ✅ Deployed landing pages to Cloudflare Pages (onelifetime.world, dws10.com)
2. ✅ Configured SSL/TLS Full (strict) on all 3 domains
3. ✅ Created Lifetime Agent Foundry documentation
4. ✅ Created site architecture and cross-linking strategy
5. ✅ Removed Turner Construction references from all documents
6. ✅ Merged PR to main

#### Files Created/Updated

| File                                    | Action          | Status       |
| --------------------------------------- | --------------- | ------------ |
| lifetime-agent-foundry/AGENT_FOUNDRY.md | Created         | ✅ Committed |
| SITE_ARCHITECTURE.md                    | Created         | ✅ Committed |
| landing-pages/dws10-com/index.html      | Updated         | ✅ Committed |
| PLANNING_PHASE_UPDATED.md               | Updated to v3.0 | ✅ Committed |
| ARCHITECTURE_SUMMARY.md                 | Updated         | ✅ Committed |
| IMPLEMENTATION_SUMMARY.md               | Updated to v2.0 | ✅ Committed |

#### Commits

1. `c77f5a5` - Add Lifetime Agent Foundry
2. `28d0dfc` - Add site architecture and cross-linking strategy
3. `b2c903f` - Remove Turner Construction reference from landing page
4. `85d5ec7` - Remove Turner Construction references from all documents

#### Temporary Files (Not in Repo)

Location: `/home/user/omat tiedostot/lataukset/`

- `onelifetime-world-index.html` - Copy of landing page (for Chromebook upload)
- `dws10-com-index.html` - Copy of landing page (for Chromebook upload)

**Note:** These are duplicates of files already in repo, created for manual Cloudflare Pages upload from Chromebook.

---

## Bug Tracking & Security Maintenance

### Bug Estimation (Current Repository State)

**Last Security Audit:** December 19, 2025
**Bugs Fixed in Session:** 20 critical/high/medium security issues

#### Current Estimated Bug Count

Based on comprehensive security audit covering auth layer, validation, build scripts:

| Severity          | Estimated Count | Areas                                                            |
| ----------------- | --------------- | ---------------------------------------------------------------- |
| **Critical/High** | 5-15            | MCP servers, AgentFoundry services, frontend auth, API endpoints |
| **Medium**        | 30-60           | Error handling, validation, edge cases, script reliability       |
| **Low/Tech Debt** | 100-300+        | TODOs, deprecated code, missing tests, outdated dependencies     |

#### High-Confidence Bug Locations

Areas not yet audited (likely to contain bugs):

1. **MCP Servers** (`mcp-hub/`, `mcp-servers/`)
   - Authentication/authorization
   - Input validation
   - Error handling

2. **AgentFoundry Services** (`AgentFoundry/services/`)
   - Python microservices security
   - API endpoints
   - Request validation

3. **Frontend** (`landing-pages/`, Next.js sites)
   - Client-side validation
   - XSS prevention
   - CSRF protection

4. **Dependencies**
   - Outdated npm packages (`npm audit`)
   - Python package vulnerabilities (`pip-audit`)
   - Security patches

5. **Configuration**
   - Environment variable validation
   - Deployment config security
   - Secret management

6. **Error Boundaries**
   - Uncaught exceptions
   - Unhandled Promise rejections
   - Graceful degradation

### Monthly Maintenance Budget

**Target:** 15-50 fixes per month (normal active development cadence)

#### Proactive Maintenance (Planned)

| Task                          | Frequency   | Expected Count | Priority |
| ----------------------------- | ----------- | -------------- | -------- |
| **Dependency updates**        | Monthly     | 5-10 fixes     | High     |
| **Security patches**          | As released | 1-5 fixes      | Critical |
| **Linting/type errors**       | Monthly     | 3-5 fixes      | Medium   |
| **Performance optimizations** | Monthly     | 1-2 fixes      | Low      |
| **Tech debt cleanup**         | Monthly     | 2-5 fixes      | Medium   |

**Monthly Total (Proactive):** 12-27 fixes

#### Reactive Maintenance (Discovered)

| Source                       | Frequency     | Expected Count | Priority    |
| ---------------------------- | ------------- | -------------- | ----------- |
| **Production issues**        | As reported   | 1-3 fixes      | Critical    |
| **User bug reports**         | As reported   | 2-4 fixes      | High        |
| **Security vulnerabilities** | As discovered | 1-2 fixes      | Critical    |
| **Integration breakage**     | As occurs     | 2-4 fixes      | High        |
| **Monitoring alerts**        | As triggered  | 1-3 fixes      | Medium-High |

**Monthly Total (Reactive):** 7-16 fixes

**Combined Monthly Range:** 15-50 fixes

- **Conservative:** 15-30 fixes/month
- **Aggressive (reducing tech debt):** 30-50 fixes/month

### Reducing Monthly Maintenance Load

#### CI/CD Automation (Saves 5-10 bugs/month)

```yaml
# .github/workflows/security-checks.yml
name: Security Checks
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # TypeScript strict mode
      - name: TypeScript Check
        run: npm run type-check

      # Linting
      - name: ESLint
        run: npm run lint

      # Security scan
      - name: Snyk Code Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      # Dependency audit
      - name: npm audit
        run: npm audit --audit-level=high
```

#### Dependency Automation (Saves 5-10 bugs/month)

1. **Enable Dependabot** (auto-merge for patches):

   ```yaml
   # .github/dependabot.yml
   version: 2
   updates:
     - package-ecosystem: "npm"
       directory: "/"
       schedule:
         interval: "weekly"
       open-pull-requests-limit: 10
   ```

2. **Monthly Dependency Review Ritual**:
   - First Monday of month
   - Review major version updates
   - Test before merging

#### Monitoring Setup (Saves 3-5 bugs/month)

| Tool                       | Purpose             | Benefit                                     |
| -------------------------- | ------------------- | ------------------------------------------- |
| **Sentry**                 | Error tracking      | Catch production errors before users report |
| **Log aggregation**        | Centralized logs    | Detect patterns, debug faster               |
| **Uptime monitoring**      | Service health      | Proactive alerting                          |
| **Performance monitoring** | Slow queries/routes | Prevent performance degradation             |

#### Documentation (Saves 2-3 bugs/month)

| Document                  | Purpose                   | Maintenance                |
| ------------------------- | ------------------------- | -------------------------- |
| **Runbooks**              | Common operational tasks  | Update after each incident |
| **Architecture diagrams** | System understanding      | Update quarterly           |
| **Deployment checklists** | Prevent deployment errors | Update after each failure  |
| **Incident post-mortems** | Learn from failures       | Create after each incident |

### Bug Hunting Roadmap (Priority Order)

**Recommended audit sequence based on risk × impact:**

#### Quarter 1 (Immediate - High Risk)

1. **MCP Servers Security Audit** (Week 1-2)
   - Authentication mechanisms
   - Input validation
   - Authorization checks
   - Estimated: 5-10 high-severity bugs

2. **AgentFoundry Services Review** (Week 3-4)
   - API endpoint security
   - Python dependency vulnerabilities
   - Error handling
   - Estimated: 8-15 medium/high bugs

3. **Frontend Security Scan** (Week 5-6)
   - XSS vulnerabilities
   - CSRF protection
   - Client-side validation
   - Estimated: 10-20 medium bugs

#### Quarter 2 (Important - Medium Risk)

4. **Dependency Audit** (Week 1)
   - `npm audit --audit-level=moderate`
   - `pip-audit`
   - Update critical packages
   - Estimated: 15-30 dependency issues

5. **Configuration Security** (Week 2)
   - Environment variable validation
   - Secret management review
   - Deployment config hardening
   - Estimated: 5-10 config issues

6. **Error Handling Audit** (Week 3-4)
   - Unhandled Promise rejections
   - Try-catch coverage
   - Graceful degradation
   - Estimated: 20-40 error handling gaps

#### Quarter 3 (Tech Debt - Lower Risk)

7. **Test Coverage Expansion** (Ongoing)
   - Unit tests for critical paths
   - Integration tests for APIs
   - E2E tests for user flows
   - Estimated: 50+ test gaps

8. **Performance Optimization** (Week 1-2)
   - Slow database queries
   - Bundle size reduction
   - Caching strategies
   - Estimated: 10-20 performance issues

9. **Code Quality** (Week 3-4)
   - Linting rule enforcement
   - TypeScript strict mode
   - Dead code removal
   - Estimated: 30-60 quality issues

### Bug Severity Classification

| Severity     | Definition                                      | Response Time | Examples                                         |
| ------------ | ----------------------------------------------- | ------------- | ------------------------------------------------ |
| **Critical** | System down, data loss, security breach         | < 1 hour      | Auth bypass, data leak, XSS, XXE                 |
| **High**     | Major feature broken, significant security risk | < 24 hours    | DoS vulnerability, broken payment, timing attack |
| **Medium**   | Feature partially broken, minor security issue  | < 1 week      | Validation missing, info disclosure, memory leak |
| **Low**      | Minor bug, cosmetic issue, tech debt            | < 1 month     | UI quirk, unused code, missing types             |

### Security Fix History (December 2025)

#### Session: December 19, 2025

**Branch:** `claude/security-fixes-15-18-19-OkAMF`

**Bugs Fixed:** 20 security vulnerabilities

| Bug # | Severity | Issue                                           | Fix                                 |
| ----- | -------- | ----------------------------------------------- | ----------------------------------- |
| 1     | High     | Authentication performance (bcrypt per request) | Pre-computed hash                   |
| 2     | Low      | Duplicate middleware                            | Removed duplicate                   |
| 3     | Medium   | Broken cookie authentication                    | Removed broken code                 |
| 4     | Critical | Missing authentication on user routes           | Added authenticateToken             |
| 5     | Medium   | Missing parseInt radix                          | Added explicit radix                |
| 6     | High     | Information disclosure (12 endpoints)           | Generic error messages              |
| 7     | High     | Memory leak in rate limiter                     | Periodic cleanup                    |
| 8     | Medium   | Unused rate limiter (dead code)                 | Activated dual-layer protection     |
| 9     | High     | Missing rate limiting on forgot-password        | Added IP-based limiting             |
| 10    | High     | Missing max password length (bcrypt DoS)        | Added 128 char max                  |
| 11    | High     | Missing body size limits (JSON DoS)             | Added 10kb limit                    |
| 12    | Medium   | Missing max length on name fields               | Added 100 char max                  |
| 13    | Critical | Logging sensitive data in validation errors     | Sanitized logs                      |
| 14    | Critical | Timing attack on login (email enumeration)      | Constant-time response              |
| 15    | High     | Logout doesn't invalidate tokens                | Auth required + documented          |
| 16    | Medium   | Unsafe email typing in middleware               | Type validation                     |
| 17    | High     | Path traversal in AgentFoundry                  | Path validation                     |
| 18    | High     | Jinja2 missing autoescape (XSS)                 | Enabled autoescape                  |
| 19    | Critical | Unsafe XML parser (XXE)                         | Use defusedxml                      |
| 20    | Low      | NameError in warning fallback                   | Fixed SecurityWarning → UserWarning |

**Security Impact:**

- ✅ Authentication bypass fixed (Bug #4, #14)
- ✅ 4 DoS vulnerabilities patched (#7, #10, #11, #12)
- ✅ 3 information disclosure issues resolved (#6, #13, #14)
- ✅ XSS prevention (Bug #18)
- ✅ XXE prevention (Bug #19)
- ✅ GDPR/PCI-DSS/OWASP compliant

**Files Changed:**

- `src/routes/auth.routes.ts`
- `src/routes/user.routes.ts`
- `src/services/auth.service.ts`
- `src/middleware/auth.middleware.ts`
- `src/app.ts`
- `sites/*/build.py` (4 files)
- `admin/Sites-Archive/sites/*/build.py` (2 files)
- `scripts/build_store.py`
- `scripts/import_wordpress.py`
- `AgentFoundry/services/claude-router/main.py`

---

## AI Model Configuration

### Overview

**Status:** ✅ **UPDATED** (as of January 4, 2026)

DWS6 uses Claude Opus 4.5 as the primary AI model for development assistance.

### AI Model Switch (Week 53)

| Previous Model    | New Model           | Reason                  |
| ----------------- | ------------------- | ----------------------- |
| Claude Sonnet 4.5 | **Claude Opus 4.5** | Knowledge cutoff issues |

**Issue with Sonnet 4.5:**

- Knowledge cutoff at early 2024
- Suggested deprecated `actions/upload-artifact@v3` instead of `@v4`
- Outdated CLI syntax for `safety` and `cyclonedx-py`
- Recommended deprecated library versions

**Resolution:**
Switched to **Claude Opus 4.5** which has:

- More recent knowledge base
- Better understanding of 2026 tooling
- Accurate security tool recommendations
- Correct GitHub Actions versions

---

## Agent Capabilities — Browse + Second Brain (2026-04-25)

Two agent-facing capabilities ship in branch `claude/add-playwright-implementation-Rg5Jy`. Full design in [`docs/PLAYWRIGHT.md`](../docs/PLAYWRIGHT.md) and [`docs/AGENT_SECOND_BRAIN.md`](../docs/AGENT_SECOND_BRAIN.md).

### Browse (Playwright)

| Surface        | Command / endpoint                                                               |
| -------------- | -------------------------------------------------------------------------------- |
| CLI            | `dws browse fetch <url>` / `screenshot <url>` / `snapshot <url>`                 |
| MCP tools      | `dws_browse_fetch`, `dws_browse_screenshot`, `dws_browse_snapshot`               |
| Skill          | `/browse`                                                                        |
| Runtime dep    | `playwright` is in `dependencies` (so `npm ci --omit=dev` keeps it on the Spark) |
| One-time setup | `npx playwright install chromium` per machine (browser binary not in git)        |

**SSRF guard (`src/utils/url-guard.ts`):** every URL — both the user-supplied one AND any redirect / sub-resource Chromium tries to load via `page.route('**/*')` — is checked against a default-deny list of IPv4/IPv6 private, loopback, link-local, cloud-metadata (`169.254.169.254`), CGNAT, and unique-local ranges. Hostnames `localhost`, `*.local`, `*.internal`, `*.intranet` are blocked without a DNS lookup; all other hostnames are resolved and rejected if **any** answer is private. Override for local dev only: `BROWSE_ALLOW_PRIVATE=1`. Residual risk: DNS rebinding (documented; not fully mitigated).

URL guard also accepts `http://` and `https://` only; 30 s navigation timeout; fresh `BrowserContext` per call. Results return rendered HTML / base64 PNG / accessibility-tree JSON.

### Agent Second Brain (DGX Spark embeddings + KB watcher)

| Surface                 | Command / file                                                      |
| ----------------------- | ------------------------------------------------------------------- |
| Embeddings provider     | `src/utils/embeddings.ts` — `EMBEDDING_PROVIDER=openai\|dgx-spark`  |
| DGX Spark probe (shell) | `scripts/ollama-spark-embed.sh --preflight`                         |
| Preflight (CLI)         | `dws kb preflight` (exits non-zero on failure with actionable hint) |
| Inbox watcher           | `scripts/daily/kb-watch-inbox.sh` (auto-discovered by day-runner)   |
| Cap (operator-tunable)  | `KB_WATCH_MAX_PER_RUN` (default `25`)                               |

`memoryService` (`semantic_memories` pgvector) keeps OpenAI 1536-dim by default. Switching it to DGX Spark's 768-dim `nomic-embed-text` requires a schema migration (RED zone) and is documented as a follow-up.

### Operator runbook (DGX Spark embeddings)

```bash
# 1. Probe — verify SSH alias + Ollama + model in one call
dws kb preflight

# 2. If model missing, pull it on the Spark
ssh dgx-spark ollama pull nomic-embed-text

# 3. Flip the env var only after preflight is green
export EMBEDDING_PROVIDER=dgx-spark
```

The watcher's first run backfills the existing inbox up to the cap and rolls remaining files into the next day. No manual sentinel deletion is needed.

---

## Code Review Process

### Overview

**Status:** ✅ **STREAMLINED** (as of January 3, 2026)

DWS6 uses an integrated code review process that leverages existing AI tools without additional API costs.

### Review Tools (Current Setup)

| Tool                            | Purpose                         | Cost                            | Status       |
| ------------------------------- | ------------------------------- | ------------------------------- | ------------ |
| **Cursor AI (Claude Opus 4.5)** | Interactive code review         | Included in Cursor subscription | ✅ Active    |
| **Snyk MCP**                    | Security vulnerability scanning | Free/Pro tier                   | ✅ Active    |
| **GitHub Copilot Review**       | Automated PR review             | Included in GitHub              | ✅ Available |
| **Ruff**                        | Python linting & security       | Free                            | ✅ Active    |

### Removed Tools

| Tool                | Reason                                         | Alternative          |
| ------------------- | ---------------------------------------------- | -------------------- |
| **Argus PR Review** | Required separate OpenAI API key (~$20-100/mo) | Cursor AI + Snyk MCP |

**Archive Location:** `Archive/workflows/argus-code-review.yml.DEPRECATED`

### Review Workflow

#### 1. Pre-Commit Review (Local)

```powershell
# Run before committing
.\scripts\gdpr-safety-check.ps1    # Security check
ruff check .                        # Python linting
npm run lint                        # JS/TS linting (if applicable)
```

#### 2. AI-Assisted Review (Cursor)

Use Cursor AI for interactive code review:

```
# Example prompts:
"Review this diff for security issues"
"Check this code for OWASP Top 10 vulnerabilities"
"Analyze this function for performance issues"
"Review this PR for code quality"
```

**Benefits:**

- ✅ Interactive - can ask follow-up questions
- ✅ Context-aware - sees full codebase
- ✅ No extra cost - included in Cursor subscription
- ✅ Multi-model - Claude Opus 4.5, GPT-5.2

#### 3. Security Scanning (Automated)

**Snyk MCP** runs automatically via Cursor:

```
# Manual scan (if needed)
snyk code test
snyk test
```

**GitHub Actions** run on push/PR:

- `security-scan-daily.yml` - Daily security scan
- `security-check-pr.yml` - PR security review
- `dependency_review.yml` - Dependency vulnerability check

#### 4. GitHub Copilot Review (Optional)

Request automated review on any PR:

```bash
gh pr review --request-review copilot
```

### Review Checklist

Before approving/merging a PR:

- [ ] Security scan passed (Snyk/Ruff)
- [ ] No deployment files included
- [ ] No secrets or credentials
- [ ] Tests pass (if applicable)
- [ ] Code follows project conventions
- [ ] Documentation updated (if needed)

### Best Practices

1. **Use Cursor AI for complex reviews** - Interactive dialogue reveals issues faster
2. **Run Snyk before pushing** - Catch vulnerabilities early
3. **Review deployment file protections** - Pre-commit hook should block sensitive files
4. **Check GitHub Actions results** - Automated security scans catch what humans miss

---

## Maintenance Tasks

### Weekly Tasks

| Task                        | Frequency | Owner                     |
| --------------------------- | --------- | ------------------------- |
| Check cross-links work      | Weekly    | Automated (GitHub Action) |
| Review analytics            | Weekly    | Marketing                 |
| Update landing page content | As needed | Marketing                 |
| Review open security issues | Weekly    | Dev team                  |

### Monthly Tasks

| Task                       | Frequency | Owner                  |
| -------------------------- | --------- | ---------------------- |
| Update documentation       | Monthly   | Dev team               |
| Review DNS records         | Monthly   | DevOps                 |
| Check SSL certificates     | Monthly   | Automated (Cloudflare) |
| Security audit (npm audit) | Monthly   | Dev team               |
| Review Dependabot alerts   | Monthly   | Dev team               |

### Automated Checks

#### Link Checker (Recommended)

Add to `.github/workflows/check-links.yml`:

```yaml
name: Check Cross-Links
on:
  schedule:
    - cron: "0 9 * * 1" # Every Monday 9am
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: lycheeverse/lychee-action@v1
        with:
          args: >
            https://lifetime.fi
            https://onelifetime.world
            https://dws10.com
```

---

## Git Workflow

### Worktree Security Warning

**Status:** ⛔ **DISABLED UNTIL APRIL 2026**
**Date Disabled:** January 29, 2026
**Reason:** Security incident - worktree exposed environment variables

#### Warning

**DO NOT USE `git worktree` in this repository until April 2026.**

Git worktree can expose sensitive environment files and break security protections:

- `.env` files may be shared across worktrees
- `.gitignore` protections may not apply correctly
- Sensitive data can be accidentally committed

#### Alternative Workflows

Instead of worktree, use:

1. **Separate clones** - Clone the repository to different directories
2. **Branch switching** - Use `git checkout` or `git switch`
3. **Stash changes** - Use `git stash` to save work temporarily

#### Incident Details

- **Date:** January 29, 2026
- **Issue:** Worktree pushed Admin manual to GitHub unexpectedly
- **Resolution:** Manual removed from public tracking; worktree usage suspended

---

### Branch Strategy

| Branch Type  | Example                         | Purpose                                      |
| ------------ | ------------------------------- | -------------------------------------------- |
| **main**     | main                            | Production, auto-deploys to Cloudflare Pages |
| **claude/**  | claude/plan-agentic-ai-saas-... | AI session work, merge via PR                |
| **feature/** | feature/new-agent               | New feature development                      |

## Deployment File Protection System

### Overview

**Status:** ✅ **ENHANCED** (as of January 2, 2026)

The deployment file protection system prevents accidental commits of infrastructure configuration files that contain sensitive deployment procedures, credentials, and infrastructure details.

### Protection Evolution

**Before (Pre-January 2026):**

- ❌ Pre-commit hook only blocked Admin/ folder and secret files
- ❌ No automated verification in GitHub
- ❌ Risk of accidentally committing deployment files
- ⚠️ **Incident:** Deployment files exposed Dec 23, 2025 - Jan 2, 2026 (10 days)

**Now (Post-January 2026):**

- ✅ Pre-commit hook blocks deployment files locally
- ✅ GitHub Actions verifies protections remotely
- ✅ Daily automated checks prevent regressions
- ✅ Prevents repeat of Dec 23 - Jan 2 incident

### Protected Files

**Google Cloud Platform:**

- `cloudbuild.yaml`
- `cloudrun-service.yaml`
- `deploy-gcp.sh`
- `setup-secrets-gcp.sh`
- `GCP_DEPLOYMENT.md`
- `QUICK_DEPLOY.md`
- `*.gcp.*`
- `*cloudbuild*`
- `*cloudrun*`

**Docker:**

- `docker-compose.mcp.yml`
- `Dockerfile`
- `.dockerignore`
- `DOCKER_*.md`
- `DOCKER_*.txt`
- `*.dockerfile`

**MCP Hub:**

- `mcp-hub/Dockerfile`
- `mcp-hub/DOCKER_*.md`
- `mcp-hub/GCP_*.md`
- `mcp-hub/DEPLOY_*.md`
- `mcp-hub/README.md`
- `mcp-hub/*deploy*`
- `mcp-hub/*deployment*`

### Pre-commit Hook

**Location:** `scripts/gdpr-safety-check.ps1` (Windows) / `.git/hooks/pre-commit` (Linux/Mac)

**Functionality:**

- Automatically runs before every `git commit`
- Checks for 18+ deployment file patterns
- Blocks commits containing infrastructure configuration files
- Provides clear error messages with unstage instructions

**Testing:**

```powershell
# Test the hook manually
.\scripts\gdpr-safety-check.ps1
```

**If deployment file is detected:**

```
[BLOCKED] Deployment files detected!
   These files contain infrastructure configuration and deployment procedures
   They must remain local only and are protected by .gitignore
   - docker-compose.mcp.yml

[BLOCKED] COMMIT BLOCKED for security compliance

To unstage these files:
   git reset HEAD <file>
```

### GitHub Actions Verification

**Workflow:** `.github/workflows/verify-gitignore-protections.yml`

**Triggers:**

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Daily schedule (2 AM UTC)
- Manual trigger (`workflow_dispatch`)

**Checks:**

1. Verifies `.gitignore` contains all 14 required patterns
2. Checks if deployment files are tracked in Git
3. Validates "MCP HUB DEPLOYMENT FILES" section exists
4. Generates protection report in GitHub Actions summary

**View Results:**

- Go to: **Actions** tab → **Verify .gitignore Protections**
- Check: Protection status and any violations

### Incident Response

**If deployment file is accidentally committed:**

1. **Immediate:** Remove from Git tracking (file stays on disk)

   ```bash
   git rm --cached <deployment-file>
   ```

2. **Verify:** Check `.gitignore` contains the pattern

   ```bash
   grep -i "deployment-file-name" .gitignore
   ```

3. **Commit:** Commit the removal

   ```bash
   git commit -m "security: Remove deployment file from tracking"
   ```

4. **Verify:** Run pre-commit hook to confirm protection

   ```powershell
   .\scripts\gdpr-safety-check.ps1
   ```

5. **Document:** Update `Admin/SECURITY_AUDIT_REPORT.md` if needed

### Maintenance

**Monthly:**

- Review GitHub Actions workflow results
- Verify no deployment files are tracked
- Check `.gitignore` patterns are up-to-date

**Quarterly:**

- Full security audit (see `Admin/SECURITY_AUDIT_REPORT.md`)
- Review incident history
- Update protection patterns if needed

### Related Documentation

- **Security Audit Report:** `Admin/SECURITY_AUDIT_REPORT.md`
- **Confidential Data Policy:** `Admin/CONFIDENTIAL-handling-policy.md`
- **Agent Security:** `AgentFoundry/Security.md`

---

### Deployment Branch

**IMPORTANT:** Cloudflare Pages deploys from `main` branch only.

All work branches must be merged to `main` to deploy.

### Merge Process

1. Work on feature branch (e.g., `claude/...`)
2. Push to GitHub
3. Create Pull Request
4. Review changes
5. Merge to `main`
6. Cloudflare auto-deploys in ~30 seconds

---

## Sensitive Data Protection

### Overview

The `.gitignore` file contains patterns to prevent sensitive data from being committed to the repository. This ensures GDPR and ISO 27001 compliance.

### Protected Categories

| Category                       | Patterns                                                                                      | Description                                                      |
| ------------------------------ | --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Confidential Business Data** | `/confidential/`, `/secrets/`, `/investor-materials/`, `*.confidential.*`, `*-confidential.*` | Internal business documents, investor materials, strategic plans |
| **Customer Data**              | `/customer-data/`, `/pilot-data/`, `/ncc-data/`, `/t2h-data/`                                 | GDPR-protected customer information and pilot project data       |
| **API Keys & Credentials**     | `.env.local`, `.env.*.local`, `credentials.json`, `service-account-*.json`                    | API keys, service accounts, local environment secrets            |
| **Financial Models**           | `*financial-model*.xlsx`, `*roi-calculator*.xlsx`, `*cap-table*.xlsx`                         | Sensitive financial projections and capitalization data          |
| **Proprietary Algorithms**     | `/dws-core/proprietary/`, `/algorithms/confidential/`                                         | DWS IQ trade secrets and confidential algorithms                 |
| **Admin Documentation**        | Admin/, admin/                                                                                | Admin manual, installation guides (ProtonDrive only)             |

### Directory Structure for Sensitive Data

```
dws6/
├── confidential/           # ⛔ NEVER COMMIT - Business secrets
├── secrets/                # ⛔ NEVER COMMIT - API keys, passwords
├── investor-materials/     # ⛔ NEVER COMMIT - Investor decks, financials
├── customer-data/          # ⛔ NEVER COMMIT - GDPR protected data
├── pilot-data/             # ⛔ NEVER COMMIT - Pilot customer data
├── ncc-data/               # ⛔ NEVER COMMIT - NCC customer data
├── t2h-data/               # ⛔ NEVER COMMIT - T2H customer data
├── admin/                  # ⛔ NEVER COMMIT - Admin manual (ProtonDrive only)
├── dws-core/
│   └── proprietary/        # ⛔ NEVER COMMIT - Trade secrets
└── algorithms/
    └── confidential/       # ⛔ NEVER COMMIT - Proprietary algorithms
```

### Admin Instructions

#### Before Committing

1. **Run `git status`** - Review all files staged for commit
2. **Check for sensitive patterns** - Look for files matching protected patterns
3. **Verify `.gitignore`** - Ensure patterns are not bypassed with `git add -f`

#### Adding New Sensitive Data Categories

1. Edit `.gitignore` in the repository root
2. Add pattern under appropriate section with comment
3. Commit the `.gitignore` change
4. Run `git rm --cached <file>` if file was previously tracked

#### Verifying Protection

```bash
# Check if a file would be ignored
git check-ignore -v <filename>

# List all ignored files in repo
git status --ignored

# Verify no sensitive files are tracked
git ls-files | grep -E "(confidential|secrets|credentials)"
```

#### Handling Accidental Commits

If sensitive data was accidentally committed:

1. **Do NOT push** if not yet pushed
2. **Remove from history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch <file>" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** (with team coordination)
4. **Rotate credentials** - If API keys or passwords were exposed
5. **Notify security team** - Document the incident

#### Compliance Checklist

- [ ] All customer data stored in protected directories
- [ ] No API keys in code (use environment variables)
- [ ] Financial models stored locally only
- [ ] Investor materials not in version control
- [ ] Admin manual on ProtonDrive only
- [ ] Regular audit of `.gitignore` patterns

### File Naming Conventions

To ensure automatic protection, use these naming conventions:

| Type              | Pattern             | Example                        |
| ----------------- | ------------------- | ------------------------------ |
| Confidential docs | `*-confidential.*`  | `roadmap-confidential.pdf`     |
| Confidential data | `*.confidential.*`  | `data.confidential.xlsx`       |
| Financial models  | `*financial-model*` | `2025-financial-model.xlsx`    |
| ROI calculators   | `*roi-calculator*`  | `customer-roi-calculator.xlsx` |
| Cap tables        | `*cap-table*`       | `lifetime-cap-table.xlsx`      |

---

## Emergency Procedures

### Rollback Deployment

If a bad deployment goes live:

1. Go to Cloudflare Pages dashboard
2. Select affected project
3. **Deployments** → Find last good deployment
4. Click **⋯** → **Rollback to this deployment**

### DNS Issues

If domains stop working:

1. Check Cloudflare DNS records match `CLOUDFLARE_DNS_RECORDS_READY.md`
2. Verify SSL/TLS mode is **Full (strict)**
3. Check nameservers point to Cloudflare
4. Use `dig onelifetime.world` to verify DNS propagation

### SSL Certificate Issues

Cloudflare auto-renews. If SSL fails:

1. SSL/TLS → Edge Certificates
2. Verify **Always Use HTTPS** is ON
3. Check certificate status (should be Active)
4. Contact Cloudflare support if persists

### Security Incident Response

If security vulnerability is actively exploited:

1. **Immediate:** Take affected service offline
2. **Assess:** Review logs and determine impact
3. **Patch:** Apply security fix or rollback to safe version
4. **Test:** Verify fix in staging environment
5. **Deploy:** Push fix to production
6. **Notify:** Inform affected users if data breach occurred (GDPR requirement)
7. **Document:** Create incident report in admin/

---

## Contact Information

### Repository Owner

- **Email:** risto@lifetime.fi
- **LinkedIn:** https://www.linkedin.com/in/ristopaarni
- **GitHub:** https://github.com/blogtheristo

### Key URLs

| Service                  | URL                                            |
| ------------------------ | ---------------------------------------------- |
| **GitHub Repo**          | https://github.com/blogtheristo/dws6           |
| **Cloudflare Dashboard** | https://dash.cloudflare.com                    |
| **onelifetime.world**    | https://onelifetime.world                      |
| **dws10.com**            | https://dws10.com                              |
| **Peachscore**           | https://app.peachscore.com/company/lifetime-oy |

---

## DWS IQ 6 Security Framework

### Overview

**Status:** ✅ **COMPLETE** (as of January 4, 2026)

The DWS IQ 6 Security Framework is a comprehensive 5-layer security architecture protecting the platform from modern threats while maintaining EU compliance (GDPR, NIS2, EU Cybersecurity Act).

### Framework Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 5: GOVERNANCE                          │
│  AI Governance | Compliance Reporting | Audit Trail             │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 4: MONITORING                          │
│  Aikido Threat Detection | Snyk Scanning | Ruff Linting         │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 3: APPLICATION SECURITY                │
│  Input Validation | CSRF Protection | XSS Prevention | CORS     │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 2: AUTHENTICATION & AUTHORIZATION      │
│  JWT Tokens | bcrypt Hashing | Rate Limiting | RBAC             │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 1: INFRASTRUCTURE                      │
│  HTTPS/TLS 1.3 | Cloudflare WAF | Secret Management            │
└─────────────────────────────────────────────────────────────────┘
```

### Security Tools Stack

| Tool              | Purpose                         | Status                |
| ----------------- | ------------------------------- | --------------------- |
| **Snyk**          | Dependency scanning (SCA, SAST) | ✅ Active             |
| **Aikido**        | Runtime threat detection        | ✅ Active             |
| **Ruff**          | Python security linting         | ✅ Active (398 fixes) |
| **CodeQL**        | Code analysis (SARIF)           | ✅ Active             |
| **pip-audit**     | Python vulnerability scanning   | ✅ Active             |
| **safety**        | Python security database        | ✅ Active             |
| **cyclonedx-bom** | SBOM generation                 | ✅ Active             |
| **pip-licenses**  | License compliance              | ✅ Active             |

### Compliance Status (January 2026)

| Regulation               | Status       | Score |
| ------------------------ | ------------ | ----- |
| **GDPR**                 | ✅ Compliant | 95%   |
| **NIS2**                 | ✅ Compliant | 95%   |
| **EU Cybersecurity Act** | ✅ Compliant | 95%   |
| **OWASP Top 10**         | ✅ Protected | 95%   |

### Week 53 Security Fixes (449 → 0 issues)

| Category     | Count  | Status              |
| ------------ | ------ | ------------------- |
| **Critical** | 4      | ✅ Fixed            |
| **High**     | 8      | ✅ Fixed            |
| **Medium**   | 6      | ✅ Fixed            |
| **Total**    | **18** | ✅ **ALL RESOLVED** |

### Security Documentation

| Document                             | Location          | Purpose                  |
| ------------------------------------ | ----------------- | ------------------------ |
| `MASTER_INDEX.md`                    | `Admin/Security/` | Security stack overview  |
| `COMPLETE_SECURITY_STACK_SUMMARY.md` | `Admin/Security/` | Executive summary        |
| `SECURITY_WORKFLOW_SNYK_AIKIDO.md`   | `Admin/Security/` | Workflow documentation   |
| `JANUARY_2026_SECURITY_UPDATE.md`    | `Admin/Security/` | Week 53 security updates |

---

## Training

### Overview

DWS IQ platform provides comprehensive training resources for administrators, developers, and end-users. Training materials are organized by role and competency level.

### Administrator Training

#### Core Platform Administration

- **Duration:** 2-4 hours
- **Prerequisites:** System administration experience, basic cloud infrastructure knowledge
- **Location:** `Admin/ADMIN_MANUAL.md` (this document)

**Topics Covered:**

1. Platform architecture and infrastructure setup
2. Deployment procedures (Cloudflare Pages, Cloud Run, Watsonx)
3. Security monitoring and compliance (GDPR, NIS2)
4. Backup and recovery procedures
5. Emergency response protocols

#### AI Model Training (LWM/Firehorse)

- **Duration:** 8-16 hours (hands-on)
- **Prerequisites:** Python programming, ML fundamentals, NVIDIA GPU access
- **Location:** `product-catalog/LWM/training-manual.md`

**Topics Covered:**

1. Infrastructure setup (Acer Veriton GN-100, NVIDIA drivers, CUDA)
2. Claude API integration for synthetic data generation
3. QLoRA fine-tuning procedures
4. Industry-specific model training (Logistics, Construction, Manufacturing, Energy, Healthcare)
5. Model evaluation and deployment
6. NVIDIA Inception Program integration

**Training Pipeline:**

```
Phase 1: Environment Setup (2 hours)
  ├── Hardware verification
  ├── Software installation (PyTorch, Transformers, PEFT)
  └── API configuration (Anthropic, HuggingFace)

Phase 2: Data Generation (3 hours)
  ├── Industry curriculum design
  ├── Synthetic training data creation
  └── Dataset validation

Phase 3: Model Training (8-12 hours)
  ├── Base model preparation
  ├── QLoRA configuration
  ├── Fine-tuning execution
  └── Model merging and export

Phase 4: Evaluation & Deployment (2 hours)
  ├── Claude-as-judge evaluation
  ├── Performance benchmarking
  └── Production deployment
```

### Developer Training

#### Frontend Development

- **Duration:** 4 hours
- **Location:** Repository `dws6/`, component documentation
- **Framework:** React + TypeScript + Tailwind CSS

**Topics:**

1. Component architecture (Agent UI, Dashboard, Product pages)
2. Styling system (Tailwind + custom utilities)
3. State management (Vercel AI SDK, Supabase)
4. Build and deployment workflow

#### Backend Development

- **Duration:** 4 hours
- **Location:** `ADMIN_MANUAL_SUPABASE_EN_v1.md`, API documentation

**Topics:**

1. Supabase integration (PostgreSQL, Auth, Storage)
2. Edge Function development
3. API endpoint creation and testing
4. Database schema management

### End-User Training

#### DWS IQ Dashboard

- **Duration:** 1 hour
- **Location:** `ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md`
- **Audience:** Construction professionals, logistics managers

**Topics:**

1. Dashboard navigation and key features
2. Project creation and management
3. Compliance tracking (Fit for 55, CSRD)
4. Report generation

#### Firehorse Forensic AI

- **Duration:** 2 hours
- **Location:** `product-catalog/Firehorse/V2/product-specification.md`
- **Audience:** Auditors, compliance officers

**Topics:**

1. Creating compliance audits
2. Site reconstruction with Digital Twin
3. Carbon emissions tracking
4. Regulatory report generation

### Training Resources

| Resource                | Type             | Location                                 | Purpose                             |
| ----------------------- | ---------------- | ---------------------------------------- | ----------------------------------- |
| **LWM Training Manual** | Technical guide  | `product-catalog/LWM/training-manual.md` | Complete AI model training workflow |
| **Admin Manual**        | Reference        | `Admin/ADMIN_MANUAL.md`                  | Platform administration             |
| **Installation Manual** | Setup guide      | `Admin/INSTALLATION_MANUAL.md`           | Multi-cloud deployment              |
| **Dashboard Manual**    | User guide       | `ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md`     | End-user interface                  |
| **Security Manual**     | Compliance guide | `Admin/Security/MASTER_INDEX.md`         | Security stack                      |
| **Product Catalog**     | Product docs     | `product-catalog/`                       | LWM, Firehorse specifications       |

### Certification Paths

#### DWS IQ Certified Administrator

**Requirements:**

- [ ] Complete platform administration training
- [ ] Deploy DWS IQ on at least one cloud platform
- [ ] Pass security compliance audit (GDPR/NIS2)
- [ ] Document 2 successful emergency recovery procedures

#### LWM Certified Trainer

**Requirements:**

- [ ] Complete LWM training manual course
- [ ] Successfully train 1 industry-specific model
- [ ] Achieve >80% pass rate on Claude-as-judge evaluation
- [ ] NVIDIA Inception Program membership (recommended)

### Training Schedule

**Weekly:**

- Security monitoring review (1 hour)
- Dependency updates and testing (2 hours)

**Monthly:**

- Platform administration refresher (2 hours)
- New feature training (as released)
- Compliance updates (GDPR, NIS2, EU AI Act)

**Quarterly:**

- Complete security audit training
- New industry model training (LWM)
- Customer success case study review

### External Training Partners

| Partner          | Program                       | Focus Area                        | Link                                   |
| ---------------- | ----------------------------- | --------------------------------- | -------------------------------------- |
| **NVIDIA**       | Deep Learning Institute (DLI) | GPU-accelerated AI training       | https://www.nvidia.com/en-us/training/ |
| **NVIDIA**       | Inception Program             | Startup support, DGX Cloud access | https://www.nvidia.com/en-us/startups/ |
| **Anthropic**    | Claude API Documentation      | LLM integration                   | https://docs.anthropic.com/            |
| **Hugging Face** | Transformers Course           | Open-source LLM fine-tuning       | https://huggingface.co/course          |

### Support Resources

- **Technical Support:** support@lifetime.fi
- **Training Inquiries:** training@lifetime.fi
- **Emergency Support:** 24/7 via security monitoring system

### Training Metrics

Track training effectiveness:

- [ ] Administrator onboarding time: Target <8 hours
- [ ] LWM model training success rate: Target >90%
- [ ] Security incident response time: Target <2 hours
- [ ] User satisfaction score: Target >4.5/5

---

## Local-First CI + Audit Log (2026-04-22)

DWS6 runs CI checks **locally** (dev machines) and **on DGX Spark** (weekly
cron), not on GitHub Actions. Every run produces a tamper-evident audit
record mirrored to Supabase `ci_audit_log` as the legal record-of-truth.

**Why:** GitHub Actions minutes are paid and slow (2–5 min queue + run) for
checks that take <1 min locally. EU AI Act Art. 12 and CSRD ESRS G1 require
traceable, tamper-evident audit trails with EU residency — GitHub Actions
logs don't meet that bar; Supabase europe-north1 (Helsinki) + RLS-enforced
INSERT-only does.

### Architecture

```
Dev laptop                      DGX Spark (weekly cron)
git push → .githooks/pre-push   scripts/weekly/security-audit.sh
  → scripts/local-ci.sh            (same record format, runner_kind=dgx-spark)
  ↓                                ↓
.ci-audit/runs/<ts>_<sha>.json (hash-chained, committed to git)
  ↓
Supabase ci_audit_log (INSERT-only, EU, tamper-evident)
  ↓
GitHub: CI Audit Gate workflow (~3s) — verifies chain + HEAD coverage
```

### Files

| File                                    | Purpose                                                   |
| --------------------------------------- | --------------------------------------------------------- |
| `scripts/local-ci.sh`                   | Runner: vitest + gitleaks + npm-audit + ruff              |
| `scripts/ci-audit-verify.sh`            | Verifier: chain integrity + HEAD coverage                 |
| `scripts/ci-audit-upload.ts`            | Supabase uploader (no-op if env/table missing)            |
| `scripts/weekly/security-audit.sh`      | DGX Spark weekly replacement for GitHub security scanners |
| `.githooks/pre-push`                    | Runs `local-ci.sh` after ZenFree on every `git push`      |
| `.github/workflows/ci-audit-verify.yml` | 3-second GitHub gate (verify-only)                        |
| `.ci-audit/runs/*.json`                 | Local hash-chained audit records (committed)              |
| `.ci-audit/README.md`                   | Quick-reference for the record format                     |
| `docs/CI_AUDIT.md`                      | Full developer spec + Supabase migration SQL              |
| `Admin/ADMIN_MANUAL_AUDIT.md`           | External-auditor manual (evidence packs, queries)         |

### What was disabled

Four GitHub workflows renamed `.yml.disabled` (rename back to re-enable):
`test.yml`, `secret-scan-gitleaks.yml`, `dependency_review.yml`, `ruff.yml`.

### Setup (once per clone)

```bash
git config core.hooksPath .githooks
export SUPABASE_URL="https://<ref>.supabase.co"        # enables legal record
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

Apply the `ci_audit_log` Supabase migration (SQL block in `docs/CI_AUDIT.md`)
— it is RED-zone per CLAUDE.md, so a human must run it in Supabase SQL
editor. Without the table, local records still work; Supabase upload is a
no-op with warning until the table exists.

### Override paths (all audited)

- Normal: `git push` — runs local-ci, writes record, gate on GitHub verifies
- Skip CI only (keep ZenFree): `SKIP_LOCAL_CI=1 git push` — visible in shell history
- Skip every hook: `git push --no-verify` — recorded in git reflog
- Commits pushed without an audit record will fail the GitHub gate

### External auditor reference

For external auditors (EU AI Act, GDPR, ISO 27001, PiTuKri), see the
dedicated **Audit Manual** at `Admin/ADMIN_MANUAL_AUDIT.md`. It contains:
the four audit-trail inventory, sample SQL queries for evidence pulls,
integrity-check procedures, retention policy, and the read-only
auditor-access model.

---

## Document Changelog

| Version | Date         | Changes                                                                                                                                                                                                                                                                                                                                                        | Session ID |
| ------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 2.4     | Apr 25, 2026 | Browse SSRF hardening (`src/utils/url-guard.ts`): default-deny IPv4/IPv6 private/loopback/link-local/cloud-metadata ranges, two-layer enforcement (pre-`goto` + `page.route` for redirects), `BROWSE_ALLOW_PRIVATE=1` dev override; moved `playwright` from devDependencies to dependencies so DGX Spark `npm ci --omit=dev` keeps it. 75 tests pass.          | Rg5Jy      |
| 2.3     | Apr 25, 2026 | Added Agent Capabilities section (Browse + Second Brain): `dws browse` (Playwright Chromium, MCP `dws_browse_*`), DGX Spark embeddings provider (`EMBEDDING_PROVIDER=dgx-spark`), `dws kb preflight`, `scripts/daily/kb-watch-inbox.sh` (auto-backfill with `KB_WATCH_MAX_PER_RUN` cap); linked PLAYWRIGHT.md + AGENT_SECOND_BRAIN.md in Related Documentation | Rg5Jy      |
| 2.2     | Apr 22, 2026 | Added Local-First CI + Audit Log section (scripts/local-ci.sh, ci-audit-verify.sh, ci-audit-upload.ts, weekly/security-audit.sh, .ci-audit/, ci-audit-verify.yml gate); linked new Audit Manual for external auditors; indexed Files & Folders manual                                                                                                          | vBYGo      |
| 1.8     | Feb 6, 2026  | DWS Document Standard header; Admin Manuals Index (23 manuals); Revolut Payments & Store; MCP Configuration (Supabase, Upstash Redis, MCP Hub); AI Agent Operational Guidelines (Karpathy); Security Glossary & OWASP; DPA summary; Backup & Sync Infrastructure; Multi-Agent Orchestration (Subagents vs Agent Teams, Upstash Redis)                          | Rm8Jw      |
| 1.7     | Jan 29, 2026 | Added Climate Assistant Chat Widget section with embed code, features, security configuration (Helmet CSP), and troubleshooting                                                                                                                                                                                                                                | krDzD      |
| 1.6     | Jan 24, 2026 | Added Training section with LWM/Firehorse training workflows, certification paths, and external partner resources; Updated training manual location references                                                                                                                                                                                                 | r6bU3      |
| 1.5     | Jan 4, 2026  | Added AI Model Configuration (Sonnet → Opus 4.5 switch); Added DWS IQ 6 Security Framework section; Updated compliance scores to 95%                                                                                                                                                                                                                           | -          |
| 1.4     | Jan 3, 2026  | Added Code Review Process section; Removed Argus PR Review (moved to Archive); Documented Cursor AI + Snyk MCP workflow                                                                                                                                                                                                                                        | -          |
| 1.3     | Dec 23, 2025 | Added AI Agent Policy section based on 2,500+ agent analysis; Protected admin directory in .gitignore                                                                                                                                                                                                                                                          | PxSux      |
| 1.2     | Dec 19, 2025 | Added Bug Tracking & Security Maintenance section with 20-bug fix history, monthly maintenance budget, bug hunting roadmap                                                                                                                                                                                                                                     | -          |
| 1.1     | Dec 11, 2025 | Added Sensitive Data Protection section (GDPR/ISO 27001 compliance)                                                                                                                                                                                                                                                                                            | -          |
| 1.0     | Nov 23, 2025 | Initial creation, documented session history                                                                                                                                                                                                                                                                                                                   | -          |

---

**License:** Proprietary - Lifetime Oy  
**Maintained by:** Lifetime Oy Development Team  
**Storage:** GitHub (private repo) + ProtonDrive sync - /2026/Repos2026/dws6/Admin

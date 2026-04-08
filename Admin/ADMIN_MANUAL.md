# DWS IQ Platform - Admin Manual

---

# VERSION AND AGENT HISTORY

Version: 3.3

Sessions & Modifications:

- Version: 3.3 | Tool: Claude Code (Opus 4.6) | Session: claude/replace-actions-with-cron-6A9Fr | Date: 08.04.2026 | Changes: Added Section 30 (GitHub Actions & Cron Job Registry) — full audit of 35 workflows and 22 cron scripts, removed cron schedules from 7 daily/weekly GitHub Actions (saving ~1,200 min/month), DGX Spark is primary runtime, GitHub Actions failover only with workflow_dispatch
- Version: 3.2 | Tool: Claude Code (Opus 4.6) | Session: claude/setup-safety-hooks-vyt21 | Date: 04.04.2026 | Changes: Added Section 30 (Claude Code Safety Hooks Reference) — full documentation of 12 hooks across 4 event types, deny patterns, secret scanner patterns, SQL safety rules, file protection rules, trust boundary zones, audit logging, testing instructions; updated Section 27.3 hooks summary to reflect current state
- Version: 3.1 | Tool: Claude Code (Opus 4.6) | Session: claude/dgx-spark-setup-UN9WR | Date: 29.03.2026 | Changes: Updated Section 29 — DGX Spark fully deployed: 4 Docker containers healthy, Cloudflare Tunnel (heartbeat.dws6.com) as systemd service, §29.11 Cloudflare Tunnel setup, §29.12 Docker container reference, §29.9 secrets updated with live values, deployment verification checklist
- Version: 3.0 | Tool: Claude Code (Opus 4.6) | Session: claude/dgx-spark-setup-UN9WR | Date: 29.03.2026 | Changes: Added Section 29 (DGX Spark Primary 24/7 Runtime) — full admin documentation for DGX Spark setup, SSH access, day-runner, script auto-discovery, failover, troubleshooting
- Version: 2.9 | Tool: Claude Code (Opus 4.6) | Session: claude/add-debit-credit-compliance-FevOa | Date: 24.03.2026 | Changes: Added Section 28 (Carbon Balance Sheet & Compliance Ledger) — debit-credit architecture, open source connectors, DWS 7 Phase 2.6 plan; updated Section 11 Multi-Agent Orchestration with memory service (PR-871), memory decay (PR-876-878), ContentMS (PR-873); updated Section 10 Backup with Supabase automated scripts (PR-882); updated 16→20 industries throughout; added Firehorse ContentMS, company-to-ERP resolver, EC3 Material Database to capabilities; PR gap analysis from 50 latest PRs
- Version: 2.8 | Tool: Claude Code (Opus 4.6) | Session: claude/research-superpowers-dws-AWAYB | Date: 22.03.2026 | Changes: Version bump (2.7 already applied externally), skills guide finalized
- Version: 2.7 | Tool: Claude Code (Opus 4.6) | Session: claude/research-superpowers-dws-AWAYB | Date: 21.03.2026 | Changes: Updated Section 27 skills inventory (7→20 skills: 17 slash commands + 3 discipline skills), added gstack workflow, discipline skills (verification-gate, design-first, dual-folder-sync), skills guide reference (docs/DWS_SKILLS_GUIDE.md, Learn/DWS_SKILLS_GUIDE_v1.0.html)
- Version: 2.6 | Tool: Claude Code (Sonnet 4.6) | Session: claude/organize-repo-structure-F3xqn | Date: 02.03.2026 | Changes: Added Section 27 (Claude Code Project Engineering Structure: CLAUDE.md as project memory, Skills as reusable workflows, Hooks for automated quality enforcement, Subagents, MCP integrations); repository gap analysis documented; added to ToC; updated footer
- Version: 2.6 | Tool: Claude Code (Sonnet 4.6) | Session: claude/implement-workflow-agents-CHFFN | Date: 02.03.2026 | Changes: Added Climate IQ Pantheon subsection to Multi-Agent Orchestration (13 agents: 6 Pantheon orchestrators + 7 industry specialists, registry, SOUL.md pattern)
- Version: 2.5 | Tool: Claude Code (Opus 4.6) | Session: claude/create-handover-documentation-kJunm | Date: 24.02.2026 | Changes: Added Client Handover document (DWS_HANDOVER.md) to Related Documentation index
- Version: 2.4 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Enhanced LWM definition as enterprise learning layer (fine-tunes data/regulation, optimizes market value, ensures competitive advantage with multi-agent tools)
- Version: 2.3 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Sandbox Isolation (Agent Foundry) section, Per-Industry Open LLM Selection matrix for 16 EU industries
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
- Version: 2.2 | Tool: Claude Code (Opus 4.6) | Session: claude/fix-morning-email-time-K3bXV | Date: 17.02.2026 | Changes: Appendix A — CEO Cockpit Morning Briefing user manual
- Version: 2.3 | Tool: GitHub Copilot (Claude Sonnet 4.6) | Session: claude/zealous-mcclintock | Date: 23.02.2026 | Changes: MCP Server Expansion — cloudrun-mcp (8769), lwm-mcp (8770), claude-mcp (8771); Supabase migration 033_mcp_session_sync; docker-compose and mcp-hub updates

Session Links & References:

- Claude Code (Rm8Jw): https://github.com/blogtheristo/dws6/commits/claude/research-dws-brand-standard-Rm8Jw
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL.md

Document Status:

- Created: 23.11.2025
- Last Modified: 08.04.2026
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
27. [Claude Code Project Engineering Structure](#claude-code-project-engineering-structure) ⭐ **NEW in v2.6**
28. [Carbon Balance Sheet & Compliance Ledger](#carbon-balance-sheet--compliance-ledger) ⭐ **NEW in v2.9**
29. [Claude Code Safety Hooks Reference](#section-30-claude-code-safety-hooks-reference) ⭐ **NEW in v3.2**
30. [GitHub Actions & Cron Job Registry](#github-actions--cron-job-registry) ⭐ **NEW in v3.3**

**Appendices**

- [Appendix A: CEO Cockpit Morning Briefing](#appendix-a-ceo-cockpit-morning-briefing)

---

## Admin Manuals Index

All admin manuals across the DWS6 repository, organized by domain.

### Core Platform

| Manual                       | Location                                                                     | Language | Description                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Admin Manual** (this file) | [`ADMIN_MANUAL.md`](ADMIN_MANUAL.md)                                         | EN       | Master admin manual - platform operations                                                                              |
| **Authentication Manual**    | [`ADMIN_MANUAL_AUTHENTICATION.md`](ADMIN_MANUAL_AUTHENTICATION.md)           | EN       | JWT auth, login flows, token management                                                                                |
| **Supabase Manual**          | [`ADMIN_MANUAL_SUPABASE_EN_v1.md`](ADMIN_MANUAL_SUPABASE_EN_v1.md)           | EN       | Database, RLS, migrations, storage                                                                                     |
| **Testing Manual**           | [`ADMIN_MANUAL_TESTING.md`](ADMIN_MANUAL_TESTING.md)                         | EN       | Vitest, security tests, CI/CD testing                                                                                  |
| **Gaps Analysis**            | [`ADMIN_MANUAL_GAPS_ANALYSIS.md`](ADMIN_MANUAL_GAPS_ANALYSIS.md)             | EN       | Missing features and remediation plan                                                                                  |
| **DWS IQ 6 User Manual**     | [`../Situation/DWS_IQ6_USER_MANUAL.md`](../Situation/DWS_IQ6_USER_MANUAL.md) | EN       | End-user workflow from `dws10.com` to `dws6.com`, Dashboard V10, Situation Room, and local Veriton-backed Control Room |

### Websites & Store

| Manual                     | Location                                                                                                        | Language | Description                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------- |
| **DWS6.com Manual**        | [`ADMIN_MANUAL_DWS6_COM.md`](ADMIN_MANUAL_DWS6_COM.md)                                                          | EN       | DWS6 website operations                         |
| **DWS10 Store & Payments** | [`ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md`](ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md)                                  | EN       | Revolut Web SDK, Cloudflare Worker, 25 products |
| **Store Admin (EN)**       | [`dws10.com/docs/STORE_ADMIN_MANUAL_EN.md`](../dws10.com/docs/STORE_ADMIN_MANUAL_EN.md)                         | EN       | Store product management, feeds                 |
| **Store Admin (FI)**       | [`dws10.com/docs/STORE_ADMIN_MANUAL_FI.md`](../dws10.com/docs/STORE_ADMIN_MANUAL_FI.md)                         | FI       | Kaupan hallinta                                 |
| **Dashboard V8 Manual**    | [`ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md`](ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md)                                      | EN       | Firehorse dashboard operations                  |
| **Blog System (EN)**       | [`onelifetime.world/ADMIN_MANUAL_BLOG_SYSTEM_EN_v1.md`](../onelifetime.world/ADMIN_MANUAL_BLOG_SYSTEM_EN_v1.md) | EN       | Onelifetime.world blog CMS                      |
| **Blog System (FI)**       | [`onelifetime.world/ADMIN_MANUAL_BLOG_SYSTEM_FI_v1.md`](../onelifetime.world/ADMIN_MANUAL_BLOG_SYSTEM_FI_v1.md) | FI       | Blogin hallinta                                 |

### Security

| Manual                     | Location                                                                                             | Language | Description                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------- |
| **Security Manuals Index** | [`Admin/Security/ADMIN_MANUALS_INDEX.md`](Security/ADMIN_MANUALS_INDEX.md)                           | EN       | Index of all security documentation         |
| **Domain Validator**       | [`Admin/Security/ADMIN_MANUAL_DOMAIN_VALIDATOR.md`](Security/ADMIN_MANUAL_DOMAIN_VALIDATOR.md)       | EN       | Domain validation and DNS security          |
| **Security Monitoring**    | [`Admin/Security/ADMIN_MANUAL_SECURITY_MONITORING.md`](Security/ADMIN_MANUAL_SECURITY_MONITORING.md) | EN       | Security monitoring and alerting            |
| **Security Testing**       | [`Admin/Security/ADMIN_MANUAL_SECURITY_TESTING.md`](Security/ADMIN_MANUAL_SECURITY_TESTING.md)       | EN       | Penetration testing, vulnerability scanning |
| **Security Audit Report**  | [`Admin/SECURITY_AUDIT_REPORT.md`](SECURITY_AUDIT_REPORT.md)                                         | EN       | Latest security audit findings              |

### Edge Infrastructure

| Manual                    | Location                                                             | Language | Description                                                             |
| ------------------------- | -------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------- |
| **Acer GN100 Admin**      | [`Admin/Acer-Veriton-GN100/README.md`](Acer-Veriton-GN100/README.md) | EN       | Edge AI device: Docker, CUDA, Ollama, OpenSandbox, PostgreSQL           |
| **Edge PostgreSQL Setup** | [`Admin/Acer-Veriton-GN100/postgres/`](Acer-Veriton-GN100/postgres/) | EN       | Docker Compose + Dockerfile for TimescaleDB + pg_duckdb + pgvector      |
| **DWS Data Standard**     | [`DWS_DATA_STANDARD.md`](../DWS_DATA_STANDARD.md)                    | EN       | Data storage governance, Aiven-first mandate, extension registry (v2.0) |

### Products & Architecture

| Manual                         | Location                                                                                                 | Language | Description                                                                             |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------- |
| **Client Veriton Offers**      | [`Acer-Veriton-GN100/CLIENT_VERITON_OFFERS_EN_v1.md`](Acer-Veriton-GN100/CLIENT_VERITON_OFFERS_EN_v1.md) | EN       | Product definition for Control Room Acer Veriton and Situation Room Acer Veriton-backed |
| **Veriton Edge Stack Runbook** | [`Acer-Veriton-GN100/VERITON_EDGE_STACK_RUNBOOK.md`](Acer-Veriton-GN100/VERITON_EDGE_STACK_RUNBOOK.md)   | EN       | Docker, Ollama, OpenSandbox, MCP, tunnel, and health-check runbook                      |
| **User Storyboard**            | [`../Situation/user-storyboard.md`](../Situation/user-storyboard.md)                                     | EN       | End-user path from public entry to Dashboard V10 and local Control Room                 |
| **Admin Storyboard**           | [`../Situation/admin-storyboard.md`](../Situation/admin-storyboard.md)                                   | EN       | Admin path for Dashboard V10 oversight, local admin app, and Veriton operations         |
| **Firehorse Omnichannel**      | [`Admin/Firehorse_Omnichannel_Next_Admin_Manual.md`](Firehorse_Omnichannel_Next_Admin_Manual.md)         | EN       | Omnichannel product operations                                                          |
| **Files & Folders**            | [`ADMIN_MANUAL_FILES_AND_FOLDERS.md`](ADMIN_MANUAL_FILES_AND_FOLDERS.md)                                 | EN       | Repository structure, backup infrastructure                                             |

### Related Documentation

| Document                | Location                                                                            | Description                                        |
| ----------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------- |
| **CLAUDE.md**           | [`CLAUDE.md`](../CLAUDE.md)                                                         | AI agent behavior guidelines (Karpathy principles) |
| **DPA Agreement**       | [`docs/DPA_DATA_PROCESSING_AGREEMENT.md`](../docs/DPA_DATA_PROCESSING_AGREEMENT.md) | GDPR data processing agreement                     |
| **MCP Configuration**   | [`docs/MCP_CONFIGURATION.md`](../docs/MCP_CONFIGURATION.md)                         | Model Context Protocol server setup                |
| **Security Compliance** | [`SECURITY_COMPLIANCE.md`](SECURITY_COMPLIANCE.md)                                  | Security framework and compliance status           |
| **Security Glossary**   | [`docs/SECURITY_GLOSSARY.md`](../docs/SECURITY_GLOSSARY.md)                         | Security terms and OWASP references                |

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
**Last Updated:** February 23, 2026

### Overview

Model Context Protocol (MCP) connects Claude Code and other AI tools to external services for database access, caching, and API operations.

### Configured Servers

| Server                | Port | Purpose                                            | Credentials                                          |
| --------------------- | ---- | -------------------------------------------------- | ---------------------------------------------------- |
| **Supabase MCP**      | -    | Database queries, auth, real-time                  | `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`               |
| **Upstash Redis MCP** | -    | Token blacklist, rate limiting, cache              | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| **DWS Supabase API**  | 8766 | Custom REST wrapper                                | Docker-based                                         |
| **MCP Hub**           | 8765 | Multi-agent workflow coordination                  | Temporal.io integration                              |
| **CloudRun MCP**      | 8769 | GCP Cloud Run management, container deployment     | `GCP_PROJECT_ID`, `GCP_REGION`                       |
| **LWM MCP**           | 8770 | Lifetime World Model training, NVIDIA Jetson GN100 | `LWM_MCP_PORT`, `GN100_HOST`, `MLFLOW_URL`           |
| **Claude MCP**        | 8771 | Claude Code session sync, git repo tools           | `CLAUDE_MCP_PORT`, `REPO_PATH`                       |

**New in v2.3 — Session Persistence:** Migration `033_mcp_session_sync.sql` adds two Supabase tables:

- `mcp_sessions` — Persists agent branch, tool, checkpoint, and session summary across restarts
- `mcp_migration_queue` — Tracks migration state with unique migration numbers and Supabase apply status

Both tables use RLS with `service_role` policies. See `supabase/migrations/033_mcp_session_sync.sql`.

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

## Google Cloud Run (Optional/Backup)

**Status:** ⏸️ **PENDING** - Requires billing setup

### Project: dws6run

| Property              | Value                                              |
| --------------------- | -------------------------------------------------- |
| **Project ID**        | `dws6run`                                          |
| **Project Number**    | `446442351781`                                     |
| **Region**            | `europe-north1` (Finland)                          |
| **Artifact Registry** | `europe-north1-docker.pkg.dev/dws6run/dws-iq-repo` |
| **Admin Account**     | `admin@dws6.com`                                   |

### Service Account Permissions

Cloud Build service account (`446442351781@cloudbuild.gserviceaccount.com`) requires:

- `roles/artifactregistry.writer` - Push Docker images
- `roles/logging.logWriter` - Write build logs

### Deployment Commands

```powershell
# Build and push image
gcloud builds submit --tag europe-north1-docker.pkg.dev/dws6run/dws-iq-repo/dws-iq-backend:latest --project=dws6run

# Deploy to Cloud Run
gcloud run deploy dws-iq-backend --image europe-north1-docker.pkg.dev/dws6run/dws-iq-repo/dws-iq-backend:latest --region europe-north1 --project dws6run --allow-unauthenticated --set-env-vars="GROQ_API_KEY=<key>,NODE_ENV=production"
```

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

| Script                            | Version | Purpose                                                                  |
| --------------------------------- | ------- | ------------------------------------------------------------------------ |
| `scripts/Startup-DailySync.bat`   | v1.6    | Login trigger: health check + git pull + Proton sync + docs + Supabase   |
| `scripts/Test-DailySync.ps1`      | v1.0    | Pre-flight health check (GitHub, Proton, Supabase) with JSON output      |
| `scripts/Sync-ToProton.ps1`       | v1.9    | Proton Drive sync (folders, secrets, docs, Learn/ HTML, sales, investor) |
| `scripts/Generate-PDFs.ps1`       | v1.6    | Markdown to HTML/PDF (pandoc, output to Learn/)                          |
| `scripts/Install-StartupSync.ps1` | v1.1    | Creates/removes Startup shortcut                                         |
| `scripts/Sync-ToSupabase.ps1`     | v1.5    | EU cloud backup to Supabase Storage (auto-creates bucket)                |
| `scripts/Sync-Report.ps1`         | v1.0    | Full pipeline wrapper with structured JSON report output                 |

### Daily Operations

| Task                 | How to run                                                       |
| -------------------- | ---------------------------------------------------------------- |
| Sync to Proton       | VS Code: Terminal > Run Task > "Sync to Proton Drive"            |
| Full backup          | VS Code: Terminal > Run Task > "Full Repo Backup to Proton"      |
| Pull and sync        | VS Code: Terminal > Run Task > "Pull and Sync"                   |
| Dry run              | `.\scripts\Sync-ToProton.ps1 -DryRun`                            |
| Auto on login        | `.\scripts\Install-StartupSync.ps1` (one-time)                   |
| Generate docs (HTML) | `.\scripts\Generate-PDFs.ps1` (default: HTML engine)             |
| Generate docs (PDF)  | `.\scripts\Generate-PDFs.ps1 -Engine wkhtmltopdf`                |
| Supabase backup      | `.\scripts\Sync-ToSupabase.ps1 -CreateBucket` (or `-DryRun`)     |
| Health check         | `.\scripts\Test-DailySync.ps1` (or `-JsonOnly` for agent output) |

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
2. Runs `Test-DailySync.ps1` (pre-flight health check — GitHub, Proton, Supabase)
3. `git pull origin main` (gets latest from GitHub)
4. Runs `Sync-ToProton.ps1 -GeneratePDFs -OpenNewPDFs` (Proton sync + doc generation)
5. Runs `Sync-ToSupabase.ps1 -CreateBucket` (EU cloud backup of Admin, scripts, src, Firehorse, sales, investor)
6. Opens changed documents in Edge for morning review

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

### Sandbox Isolation (Agent Foundry)

**Implementation:** `src/sandbox/` — Staged tenant isolation for multi-tenant agent execution.

| Stage                     | Isolation Method                          | LLM Provider           | When                    |
| ------------------------- | ----------------------------------------- | ---------------------- | ----------------------- |
| 1 — SDK Sandbox           | Anthropic Agent SDK (bubblewrap/seatbelt) | Groq (default)         | Demo / Pilot            |
| 2 — Ephemeral Containers  | Cloud Run Jobs (europe-north1)            | Configurable per agent | First paid multi-tenant |
| 3 — Persistent Containers | gVisor / Firecracker                      | Configurable per agent | Scale (€50k+ MRR)       |

**Environment variable:** `SANDBOX_STAGE=1` (default), `2`, or `3`

See `DWS_SECURITY_STANDARD.md` Section 14 for full security architecture.

### Climate IQ Pantheon Agent Registry

DWS IQ runs **13 named agents** organized in two tiers, registered at startup in `src/agents/index.ts`.

**Tier 1 — Orchestrators (6 agents)**

| Agent        | Deity | Role               | Capabilities                                                   |
| ------------ | ----- | ------------------ | -------------------------------------------------------------- |
| `atlas`      | Titan | Chief of Staff     | workflow-orchestration, executive-briefing, request-routing    |
| `athena`     | Greek | EU Compliance      | eu-regulatory, ets-monitoring, cbam-assessment, csrd-reporting |
| `hephaestus` | Greek | Field & Site       | site-safety, materials-analysis, schedule-management           |
| `iris`       | Greek | Research & Intel   | competitor-analysis, market-research, deep-wiki-extraction     |
| `hermes`     | Greek | Logistics & Ops    | logistics-optimization, supply-chain-risk, quality-gate        |
| `apollo`     | Greek | Content & Outreach | content-strategy, seo-optimization, sales-outreach             |

**Tier 2 — Industry Specialists (7 agents)**

| Agent        | Deity | Industry                  | Key Regulation                        |
| ------------ | ----- | ------------------------- | ------------------------------------- |
| `vulcan`     | Roman | Steel & Metals            | ETS Phase 4, CBAM iron/steel          |
| `helios`     | Greek | Energy & Renewables       | RED III 42.5%, REPowerEU              |
| `neptune`    | Roman | Maritime & Shipping       | FuelEU Maritime, ETS shipping         |
| `ceres`      | Roman | Agriculture & Fertilizers | CBAM fertilizers, N2O                 |
| `prometheus` | Greek | Hydrogen                  | RFNBO additionality, RED III          |
| `mars`       | Roman | Construction & Buildings  | EPBD, EN 15978 whole-life carbon      |
| `gaia`       | Greek | Cement & Earth Materials  | CBAM clinker benchmark 766 tCO2/1000t |

**Identity pattern:** Each agent has `src/agents/workflow/{tier}/{name}/SOUL.md` injected as system prompt.
**Logging:** All agents call `logExecution()` to `agent_executions` Supabase table (EU AI Act Article 12).
**Security:** No `...input` spreads to sub-agents — all delegation uses explicit typed field extraction.

### Per-Industry Open LLM Selection (IMPORTANT)

**Do NOT default to Llama 3.3 70B for every industry.** Each of the 16 EU industries DWS IQ serves has different domain characteristics. The agent system must evaluate and select the best open LLM per industry vertical.

**Selection criteria per industry:**

| Criteria                      | Why It Matters                                                              |
| ----------------------------- | --------------------------------------------------------------------------- |
| Domain knowledge depth        | Construction vs. maritime vs. healthcare have different regulatory language |
| Multilingual capability       | Nordic industries need Finnish/Swedish, CBAM suppliers need 20+ languages   |
| Structured output reliability | Compliance reports need deterministic JSON, not creative prose              |
| Context window                | Supply chain analysis may need 128k+ context                                |
| Inference speed               | Real-time compliance checks need sub-second response                        |
| EU data residency             | Some models can only run on EU-hosted infrastructure                        |
| License                       | Commercial use restrictions vary by model                                   |

**Industry LLM evaluation matrix (to be completed per industry study):**

| Industry              | Default LLM          | Alternatives to Evaluate                 | Key Requirement                                      |
| --------------------- | -------------------- | ---------------------------------------- | ---------------------------------------------------- |
| Construction          | Llama 3.3 70B (Groq) | Mistral Large, Qwen 2.5 72B, DeepSeek-V3 | EN 15978 lifecycle stages, Finnish building codes    |
| Energy                | TBD                  | Llama 3.3, Mistral, Command R+           | ETS allowance calculations, power grid terminology   |
| Manufacturing         | TBD                  | Llama 3.3, Qwen 2.5, Mixtral 8x22B       | CBAM product classification, BOM analysis            |
| Logistics & Transport | TBD                  | Llama 3.3, Mistral, Gemma 2 27B          | Route optimization, ESR non-ETS emissions            |
| Maritime & Shipping   | TBD                  | Llama 3.3, Mistral Large                 | FuelEU Maritime, MRV regulations                     |
| Aviation              | TBD                  | Llama 3.3, Mistral                       | CORSIA, SAF calculations                             |
| Steel & Metals        | TBD                  | Llama 3.3, Qwen 2.5                      | CBAM embedded emissions, alloy specifications        |
| Chemicals             | TBD                  | Llama 3.3, DeepSeek-V3                   | REACH, process emissions, safety data sheets         |
| Cement & Concrete     | TBD                  | Llama 3.3, Mistral                       | Clinker ratios, EPD data, kiln emissions             |
| Agriculture           | TBD                  | Llama 3.3, Gemma 2                       | LULUCF, methane accounting, CAP subsidies            |
| Food & Beverage       | TBD                  | Llama 3.3, Mistral                       | Scope 3 supply chain, packaging lifecycle            |
| Textiles              | TBD                  | Llama 3.3, Qwen 2.5                      | Digital product passport, CBAM for imports           |
| Real Estate           | TBD                  | Llama 3.3, Mistral                       | EPBD energy certificates, renovation passports       |
| Finance & Insurance   | TBD                  | Llama 3.3, Mistral Large                 | SFDR, EU Taxonomy alignment, double materiality      |
| Public Sector         | TBD                  | Llama 3.3, Mistral (EU-hosted)           | CSRD for state-owned enterprises, GPP criteria       |
| Healthcare            | TBD                  | Llama 3.3, Gemma 2 (EU-hosted)           | Medical waste emissions, pharmaceutical supply chain |

**Evaluation process for each industry:**

1. **Benchmark** — Run industry-specific compliance prompts (EN 15978, CSRD ESRS E1, CBAM declarations) against 3-4 candidate models
2. **Score** — Evaluate on accuracy, structured output reliability, and domain terminology
3. **Cost** — Compare inference cost per 1K tokens across providers (Groq, Together, Fireworks, self-hosted)
4. **Residency** — Verify EU data residency compliance for the provider
5. **Select** — Choose the best model per industry, document rationale
6. **Configure** — Set per-agent model in `AgentConfig.model` field (`src/agents/types.ts`)

**Configuration example:**

```typescript
// In each agent's constructor, set the industry-optimized model:
new ConstructionAgent({
  name: "construction",
  model: "llama-3.3-70b-versatile", // Or 'mistral-large-latest' after evaluation
  // ...
});
```

**Action item:** Complete industry LLM benchmarks before first enterprise deployment. Each industry vertical should have a documented model selection rationale.

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

## Tools

### Database Migration (db_push)

Push Supabase migrations to the linked project (ref: `kpucuwwfhuwurdxyjjtz`).

```powershell
# Full run (link + push)
pwsh -File scripts/db_push.ps1

# Or via npm
npm run db:push

# Skip link if already linked
pwsh -File scripts/db_push.ps1 -SkipLink
npm run db:push:skip-link
```

**When to run:** After adding new migrations in `supabase/migrations/`, or when setting up on a new machine.

**Check pending migrations:**

```bash
npx supabase migration list
```

### Supabase MCP

The **Supabase MCP Server** (`mcp-servers/supabase/server.py`) provides AI-accessible tools for Supabase integration:

| Endpoint                                | Purpose                          |
| --------------------------------------- | -------------------------------- |
| `POST /tools/query_carbon_calculations` | Query carbon calculation history |
| `POST /tools/log_agent_activity`        | Log agent activity to database   |
| `POST /tools/query_compliance`          | Query compliance data            |

**Configuration:** Port 8766. Set `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in `.env.mcp`.

**Docker:** Runs as `supabase-mcp` in `docker-compose.hybrid.yml`.

### Supabase Skills (Cursor)

For AI-assisted database operations in Cursor, configure Supabase skills:

- **MCP File System:** Supabase tool descriptors in `mcps/<server>/tools/`
- **Skills:** Create `.cursor/skills/` or use Cursor's built-in Supabase MCP integration
- **Reference:** `ADMIN_MANUAL_SUPABASE_EN_v1.md` for full database administration

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

## Appendix A: CEO Cockpit Morning Briefing

**Status:** ✅ **ACTIVE** (since February 2026)
**Delivery:** Mon–Sat at 06:00 Helsinki time via GitHub Actions
**Workflow:** `.github/workflows/morning-briefing.yml`

### What It Is

A 5-minute daily briefing email delivering a prioritized CEO action summary. Pulls live data from Supabase and sends via Resend.

### Schedule

| Trigger       | When                   | Notes                                                 |
| ------------- | ---------------------- | ----------------------------------------------------- |
| **Automatic** | Mon–Sat 06:00 Helsinki | Dual cron (03:00 + 04:00 UTC) covers both DST offsets |
| **Manual**    | Anytime                | GitHub Actions → "Morning Briefing" → Run workflow    |

The send script has a Helsinki time guard: it only sends when the Helsinki hour is exactly 6. The "wrong" cron entry silently exits. Manual triggers (`workflow_dispatch`) skip the time guard automatically.

### Email Sections

| #   | Section              | What It Shows                                                       | Data Source                                               |
| --- | -------------------- | ------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | **3 Changes**        | Pipeline movement, product velocity, delivery milestones (last 24h) | `v_outreach_enriched`, `agent_metrics`, `firehorse_leads` |
| 2   | **Today's 3 Bets**   | Top 3 actions for the day (auto-generated from overdue/due threads) | `v_outreach_enriched`                                     |
| 3   | **Top Risk**         | Most overdue thread + days overdue + next action                    | `v_outreach_enriched`                                     |
| 4   | **Captain Momentum** | Contacts to ping today + suggested artifact to prepare              | `v_outreach_enriched`                                     |
| 5   | **Metrics Strip**    | MRR, active convos, weekly commits, MVP ETA                         | GitHub API, Supabase, env vars                            |
| 6   | **Send List**        | Top 3–5 contacts to manually message, sorted by urgency             | `v_outreach_enriched`                                     |

### How to Trigger Manually

1. Go to **GitHub → Actions → "Morning Briefing"**
2. Click **"Run workflow"**
3. Optionally enter a recipient email to override the default
4. Click the green **"Run workflow"** button

### How to Enter Data

#### Outreach Contacts (feeds Pipeline, Bets, Risk, Momentum, Send List)

```bash
curl -X POST https://your-server/api/v1/outreach/inbound \
  -H "Content-Type: application/json" \
  -H "X-Outreach-Key: YOUR_KEY" \
  -d '{
    "first_name": "Matti",
    "org_name": "Wärtsilä",
    "pipeline": "customer",
    "source": "linkedin"
  }'
```

**Pipeline values:** `investor`, `customer`, `partner`
**Source values:** `boardy`, `linkedin`, `conference`, `referral`, `cold`, `inbound`, `manual`

Or add/edit records directly in **Supabase Dashboard → Table Editor**:

- `outreach_threads` — thread status, next_action, next_action_date
- `persons` — contact details
- `outreach_orgs` — company info

#### Firehorse Leads (feeds Delivery changes)

```bash
curl -X POST https://your-server/api/v1/firehorse/leads \
  -H "Content-Type: application/json" \
  -d '{"email": "matti@wartsila.com", "first_name": "Matti", "company": "Wärtsilä", "country": "FI"}'
```

**CSV bulk import:**

```bash
npx tsx scripts/import-leads-csv.ts data/leads.csv
```

#### Metrics (MRR, MVP ETA)

Set as **GitHub repository secrets** (Settings → Secrets and variables → Actions → Secrets):

| Secret    | Example   | Purpose                          |
| --------- | --------- | -------------------------------- |
| `MRR_EUR` | `500`     | Monthly recurring revenue in EUR |
| `MVP_ETA` | `2026-Q2` | Estimated MVP date               |

Weekly commits are fetched live from the GitHub API — no manual config needed.

### Manual API Trigger

If the Express server is running:

```bash
curl -X POST https://your-server/api/v1/morning-briefing/send \
  -H "x-admin-key: YOUR_ADMIN_KEY"
```

### Configuration (GitHub Secrets)

| Secret                  | Default                      | Purpose                                            |
| ----------------------- | ---------------------------- | -------------------------------------------------- |
| `RESEND_API_KEY`        | _(required)_                 | Resend email provider API key                      |
| `SUPABASE_URL`          | _(required)_                 | Supabase project URL                               |
| `SUPABASE_SERVICE_KEY`  | _(required)_                 | Supabase service role key                          |
| `EMAIL_FROM`            | `risto@onelifetime.world`    | Sender address (must be on Resend-verified domain) |
| `OUTREACH_DIGEST_EMAIL` | `risto@lifetime.fi`          | Recipient address                                  |
| `GITHUB_TOKEN`          | _(auto-provided by Actions)_ | For live commit count                              |
| `MRR_EUR`               | —                            | Monthly recurring revenue                          |
| `MVP_ETA`               | —                            | MVP estimated date                                 |

### File Map

```
scripts/send-morning-briefing.ts          # Entry point (GitHub Actions runs this)
src/morning-briefing/
  ├── data-collectors.ts                  # Supabase queries for all 6 sections
  ├── briefing-template.ts                # HTML + plain text email templates
  ├── scheduler.ts                        # Send logic (Resend API call)
  └── index.ts                            # Module exports
.github/workflows/morning-briefing.yml    # Cron schedule + workflow_dispatch
```

### Troubleshooting

| Symptom                           | Cause                                        | Fix                                                                                    |
| --------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| "domain not verified" from Resend | `EMAIL_FROM` secret set to unverified domain | Set secret to `risto@onelifetime.world` or verify the domain in Resend                 |
| "column does not exist" in logs   | Supabase table schema changed                | Check column names in `data-collectors.ts` match actual table                          |
| Email arrives at 05:00 or 07:00   | DST offset change                            | Both cron entries (03:00 + 04:00 UTC) handle this; time guard ensures only 06:00 sends |
| Commits show 0                    | `GITHUB_TOKEN` not in workflow env           | Verify workflow passes `GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}`                     |
| "No product signals captured"     | No rows in `agent_metrics` for yesterday     | Agents must write daily metrics; table may be empty                                    |
| Email not received                | No `RESEND_API_KEY` secret                   | Add the secret in GitHub repository settings                                           |

### Fix History

| PR   | Date       | Fix                                                                                 |
| ---- | ---------- | ----------------------------------------------------------------------------------- |
| #501 | 2026-02-17 | `v_outreach_enriched.updated_at` → `created_at`; `firehorse_leads.status` → `state` |
| #504 | 2026-02-17 | `firehorse_leads.updated_at` → `created_at`                                         |
| #505 | 2026-02-17 | `agent_logs` → `agent_metrics`; live commit count via GitHub API                    |

---

## Automated PR Workflow (HIL Automation)

### Overview

All code changes undergo automated dual-model AI review before merge, replacing manual human-in-the-loop review:

```
Claude Code → PR → Claude sanity check → Gemini HIL review → @copilot fixes → CI → auto-merge
                                                ↑                    |
                                                └────────────────────┘  (fix loop)
```

### Workflow Files

| File                                  | Purpose                                |
| ------------------------------------- | -------------------------------------- |
| `.github/workflows/ai-pr-review.yml`  | Dual AI review (Claude + Gemini HIL)   |
| `.github/workflows/pr-auto-merge.yml` | Auto-merge when approved + CI green    |
| `.github/copilot-setup-steps.yml`     | Copilot coding agent environment setup |

### How It Works

1. Claude Code generates implementation on a feature branch and opens a PR
2. **Claude** performs quick sanity check (security, correctness, breaking changes)
3. **Gemini** performs deep HIL review (edge cases, tests, architecture, OWASP security)
4. Gemini defaults to **REQUEST_CHANGES** — only APPROVE when zero issues + adequate tests
5. If changes requested: structured fix instructions sent to **@copilot** coding agent
6. Copilot implements fixes, pushes to branch → review re-triggers automatically
7. When both approve: `ai-approved` label triggers auto-merge workflow

### Labels

| Label                  | Meaning                                 |
| ---------------------- | --------------------------------------- |
| `ai-reviewed`          | AI review completed (dual-model)        |
| `ai-approved`          | Both Claude + Gemini approved           |
| `ai-changes-requested` | Issues found, waiting for fixes         |
| `do-not-merge`         | Human override: block auto-merge        |
| `needs-human-review`   | Human override: pause for manual review |

### Required Secrets

| Secret              | Purpose                                                     |
| ------------------- | ----------------------------------------------------------- |
| `ANTHROPIC_API_KEY` | Claude API review (GitHub Settings → Secrets)               |
| `GOOGLE_AI_API_KEY` | Gemini API review (GitHub Settings + Google Secret Manager) |

### MCP Hub Integration

Gemini review available at `POST /gemini/review` on MCP Hub (`mcp-hub/server.py`). Model: `gemini-2.0-flash`. Cloud Run service: `dws6run6` (europe-north1).

---

## Document Changelog

| Version | Date         | Changes                                                                                                                                                                                                                                                                                                                               | Session ID |
| ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| 2.6     | Mar 2, 2026  | Claude Code Project Engineering Structure (Section 27): CLAUDE.md as project memory, Skills, Hooks, Subagents, MCP; repository gap analysis from exploration                                                                                                                                                                          | F3xqn      |
| 2.5     | Feb 24, 2026 | Client Handover document (DWS_HANDOVER.md) added to Related Documentation index                                                                                                                                                                                                                                                       | kJunm      |
| 2.4     | Feb 21, 2026 | Enhanced LWM definition as enterprise learning layer                                                                                                                                                                                                                                                                                  | Q0lzp      |
| 2.3     | Feb 20, 2026 | Automated PR Workflow (HIL Automation): Claude + Gemini dual review, Copilot fix loop, auto-merge, Cloud Run dws6run6                                                                                                                                                                                                                 | e5wXD      |
| 2.2     | Feb 17, 2026 | Appendix A: CEO Cockpit Morning Briefing — schedule, data entry, configuration, troubleshooting, fix history                                                                                                                                                                                                                          | K3bXV      |
| 1.8     | Feb 6, 2026  | DWS Document Standard header; Admin Manuals Index (23 manuals); Revolut Payments & Store; MCP Configuration (Supabase, Upstash Redis, MCP Hub); AI Agent Operational Guidelines (Karpathy); Security Glossary & OWASP; DPA summary; Backup & Sync Infrastructure; Multi-Agent Orchestration (Subagents vs Agent Teams, Upstash Redis) | Rm8Jw      |
| 1.7     | Jan 29, 2026 | Added Climate Assistant Chat Widget section with embed code, features, security configuration (Helmet CSP), and troubleshooting                                                                                                                                                                                                       | krDzD      |
| 1.6     | Jan 24, 2026 | Added Training section with LWM/Firehorse training workflows, certification paths, and external partner resources; Updated training manual location references                                                                                                                                                                        | r6bU3      |
| 1.5     | Jan 4, 2026  | Added AI Model Configuration (Sonnet → Opus 4.5 switch); Added DWS IQ 6 Security Framework section; Updated compliance scores to 95%                                                                                                                                                                                                  | -          |
| 1.4     | Jan 3, 2026  | Added Code Review Process section; Removed Argus PR Review (moved to Archive); Documented Cursor AI + Snyk MCP workflow                                                                                                                                                                                                               | -          |
| 1.3     | Dec 23, 2025 | Added AI Agent Policy section based on 2,500+ agent analysis; Protected admin directory in .gitignore                                                                                                                                                                                                                                 | PxSux      |
| 1.2     | Dec 19, 2025 | Added Bug Tracking & Security Maintenance section with 20-bug fix history, monthly maintenance budget, bug hunting roadmap                                                                                                                                                                                                            | -          |
| 1.1     | Dec 11, 2025 | Added Sensitive Data Protection section (GDPR/ISO 27001 compliance)                                                                                                                                                                                                                                                                   | -          |
| 1.0     | Nov 23, 2025 | Initial creation, documented session history                                                                                                                                                                                                                                                                                          | -          |

---

## Claude Code Project Engineering Structure

_Added in v2.6 | 02.03.2026_

This section documents the DWS6 Claude Code engineering structure — the patterns that make AI-assisted development reliable, consistent, and scalable. Based on a repository audit conducted on 02.03.2026.

### Architecture: Five Pillars

#### 1. CLAUDE.md — Project Memory

`CLAUDE.md` (repo root, 2,000+ lines) is the primary intelligence substrate for all Claude Code sessions. It is not documentation — it is institutional memory. Every session inherits:

- Brand, document, security, UI, and market research standards
- Architecture decisions (Brain-Memory-Body-Hands, dual folder rule, store update checklist)
- Critical rules (git mv not rm, .md never published to public sites, email sender rules)
- EU compliance requirements (GDPR, Article 12, data residency)
- Security coding rules (execFile not exec, CORS, SRI hashes)

**Impact:** Zero per-session context repetition. Zero behavioral drift from standards.

#### 2. Skills — Reusable Workflow Components

**20 production skills** (17 slash commands in `.claude/commands/` + 3 discipline skills in `skills/`) replace ad-hoc prompting with callable, documented, testable workflow components.

**Full guide:** `docs/DWS_SKILLS_GUIDE.md` | HTML: `Learn/DWS_SKILLS_GUIDE_v1.0.html`

**gstack Development Workflow (Garry Tan):**
`/plan-ceo-review` → `/plan-eng-review` → _implement_ → `/review` → `/ship` → `/retro`

| Category                       | Skills                                                                          | Count |
| ------------------------------ | ------------------------------------------------------------------------------- | ----- |
| gstack (dev workflow)          | `/plan-ceo-review`, `/plan-eng-review`, `/review`, `/ship`, `/browse`, `/retro` | 6     |
| Agent discovery & execution    | `/discover-agents`, `/agent-run`, `/workflow`                                   | 3     |
| EU compliance & analysis       | `/compliance-check`, `/carbon-analysis`, `/sovereignty-assess`, `/site-safety`  | 4     |
| Operations & infrastructure    | `/flow-status`, `/email`, `/remote-control`                                     | 3     |
| Code quality                   | `/simplify`                                                                     | 1     |
| Discipline skills (hard gates) | `verification-gate`, `design-first`, `dual-folder-sync`                         | 3     |

**Discipline skills** (in `skills/*/SKILL.md`) are passive — agents follow them automatically:

- **verification-gate:** No completion claims without fresh verification evidence
- **design-first:** No implementation without design approval for 3+ file changes
- **dual-folder-sync:** Root folder changes must sync to landing-pages in same commit

**Principle:** If a capability cannot be invoked as `dws <command>`, it is not shipped.

#### 3. Hooks — Automated Quality Enforcement

**Git hooks** (`.githooks/`, installed via `git config core.hooksPath .githooks`):

| Hook         | Trigger         | Enforcement                                        |
| ------------ | --------------- | -------------------------------------------------- |
| `pre-push`   | Before git push | Branch name validation, blocks destructive deletes |
| `post-merge` | After merge     | Syncs Admin/, AgentFoundry/, docs/ to backup       |

**Claude Code hooks** (`.claude/hooks/`) — **12 hooks across 4 event types**, configured in `.claude/settings.local.json`. Full reference: [Section 30](#section-30-claude-code-safety-hooks-reference).

| Event                    | Hooks                                                                             | Design                                                |
| ------------------------ | --------------------------------------------------------------------------------- | ----------------------------------------------------- |
| SessionStart             | `session-start.sh`                                                                | Injects trust boundary (GREEN/YELLOW/RED zones)       |
| PreToolUse (Bash)        | `pretooluse-guard.sh`, `secret-scan.sh`, `log-commands.sh`, `sql-safety-guard.sh` | Block destructive commands, detect secrets, audit     |
| PreToolUse (Edit/Write)  | `protect-files.sh`, `secret-scan.sh`                                              | Block .env/.key writes, .md in public folders         |
| PreToolUse (PR create)   | `require-tests-for-pr.sh`                                                         | Hard gate: tests must pass before PR                  |
| PostToolUse (Write/Edit) | prettier, eslint (inline)                                                         | Auto-format on every file change                      |
| Stop                     | `session-stop.sh`, `auto-commit.sh`                                               | Governance checklist, auto-commit on feature branches |

**Design principle:** Zero permission prompts. Block or allow, never ask.

#### 4. Subagents — Context Isolation and Parallel Execution

Claude Code subagent types used in DWS6:

| Type              | Use Case                                | Isolation                  |
| ----------------- | --------------------------------------- | -------------------------- |
| `Explore`         | Codebase search, file discovery         | Protects main context      |
| `Plan`            | Architecture design, trade-off analysis | Read-only, no side effects |
| `general-purpose` | Multi-step research, document analysis  | Full tool access           |
| Background        | Parallel independent tasks              | Non-blocking               |

**Rule:** Run independent research in parallel background agents whenever possible.

#### 5. MCP Integration (`/mcp`, `mcp.json`, `mcp-hub/`)

MCP exposes all DWS agents as auto-discoverable tools via JSON-RPC 2.0:

```bash
# List all agents
curl POST /mcp -d '{"method": "tools/list"}'

# Execute agent
curl POST /mcp -d '{"method": "tools/call", "params": {"name": "compliance", "arguments": {...}}}'
```

**Current gap:** `mcp.json` not committed to repo (users must copy `.mcp.json.example`). **Action: commit safe default config.**

### Repository Gap Analysis (Audit: 02.03.2026)

| Gap                                                 | Priority | Status      |
| --------------------------------------------------- | -------- | ----------- |
| `.claude/hooks/` directory and `pre-bash-safety.sh` | High     | **Done**    |
| `mcp.json` not committed                            | High     | Planned     |
| No pre-commit lint hook                             | Medium   | Planned     |
| No consolidated `docs/MCP_TOOLS.md`                 | Medium   | Planned     |
| Supabase MCP server is stub only                    | Medium   | In progress |
| No dev server launcher script                       | Low      | Planned     |

### Operational Checklist: New Claude Code Session Setup

```bash
# 1. Verify hooks installed
git config core.hooksPath
# Expected: .githooks

# 2. Verify skills accessible
ls .claude/commands/
# Expected: 17 .md files (slash commands)
ls skills/*/SKILL.md
# Expected: 3 SKILL.md files (discipline skills)

# 3. Verify CLAUDE.md loaded
# Claude Code reads this automatically on session start

# 4. Set up MCP (if needed)
cp .mcp.json.example .mcp.json
# Edit with actual Supabase/Redis credentials

# 5. Start dev server
cd dws6.com/dashboard/firehorse/v9-react && npm run dev  # Frontend
npm run dev  # Backend (root)
```

---

## Section 28: Carbon Balance Sheet & Compliance Ledger

_Added: v2.9 (24.03.2026) — PR-892, thesis v3.29/v2.9_

### 28.1 Overview

The Carbon Balance Sheet is DWS IQ's core compliance infrastructure — a double-entry bookkeeping system for CO2 that tracks carbon across multiple EU regulations (ETS, CBAM, CSRD, EU Taxonomy) in dual units (EUR and tCO2e).

**Key principle:** Carbon compliance is a ledger problem, not a reporting problem. The same tonne of CO2e flows through multiple regulatory touchpoints. The debit-credit ledger reconciles them.

### 28.2 Debit-Credit Architecture

Every compliance event produces a journal entry:

| Event                              | Debit (liability) | Credit (asset) | Regulation |
| ---------------------------------- | ----------------- | -------------- | ---------- |
| ETS allowance surrender            | tCO2e + EUR       | —              | EU ETS     |
| Free allocation received           | —                 | tCO2e          | EU ETS     |
| CBAM certificate purchase          | EUR + tCO2e       | —              | CBAM       |
| CBAM origin carbon price deduction | —                 | EUR            | CBAM       |
| Verified offset retirement         | —                 | tCO2e          | Voluntary  |

**Net carbon position** = Total liabilities (debits) − Total assets (credits)

**Implementation:** `src/compliance/debit-credit-ledger.ts` (V1 in-memory), promoted to persistent ledger in DWS 7 Phase 2.6.

### 28.3 Open Source Connectors (MIT-Licensed)

The ledger depends on open source connectors for data ingestion from industrial systems:

| Connector                   | Source Systems                                               | Status                                        |
| --------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| **ERP**                     | SAP S/4HANA, IFS Cloud, Dynamics 365, Monitor, Visma, Jeeves | `src/integrations/erp/` (active)              |
| **ETS/Registry**            | EU Transaction Log (EUTL), national registries               | Planned (Phase 2.6)                           |
| **CBAM**                    | CBAM Transitional Registry, customs                          | Planned (Phase 2.6)                           |
| **Emission factors**        | EEA GHG Inventory, IPCC, EU ETS benchmarks                   | `src/compliance/emission-factors.ts` (active) |
| **IoT/edge**                | NVIDIA Jetson Orin Nano, energy meters                       | Edge deployment active (GN100)                |
| **ESG platforms**           | Worldfavor, PositionGreen, CDP                               | `src/integrations/esg/` (active)              |
| **EC3 Material Database**   | Building Transparency EC3                                    | Dashboard added (PR-880)                      |
| **Company-to-ERP resolver** | Nordic construction company registry                         | `src/integrations/erp/` (PR-867)              |

**Why MIT-licensed:** Auditability (auditors inspect source code, not vendor black boxes), regulatory defensibility (EU AI Act Art 12), and network effect acceleration (lower adoption barriers for 50,000+ CSRD-obligated companies).

### 28.4 DWS 7 Phase 2.6 Implementation Plan (May–July 2026)

8 planned PRs (093A–093H):

1. Persistent carbon ledger (append-only, corrections as reverse entries)
2. Dual-unit entries (EUR + tCO2e, carbon price at entry time)
3. Chart of carbon accounts (ESRS E1 scopes)
4. Cross-regulation reconciliation (ETS ↔ CBAM ↔ CSRD)
5. Ledger-native compliance scoring
6. CFO dashboard (balance sheet view with drill-down)
7. ERP GL sync (SAP/IFS/Dynamics general ledger)
8. XBRL export (machine-readable CSRD reports)

### 28.5 Recent Feature Updates (PRs 843–892)

Features shipped since last admin manual update (v2.8, 22.03.2026):

| PR         | Feature                                               | Admin Impact                               |
| ---------- | ----------------------------------------------------- | ------------------------------------------ |
| **PR-892** | Debit-credit compliance ledger + 18 open data sources | This section                               |
| **PR-882** | Automated Supabase backup/restore scripts             | Backup procedures updated                  |
| **PR-880** | EC3 Material Database dashboard                       | New data source for carbon factors         |
| **PR-878** | Memory Dashboard + pg_cron decay                      | Agent memory now auto-decays stale facts   |
| **PR-876** | Memory confidence decay + forget() agent              | KYA-compliant memory lifecycle             |
| **PR-875** | Memory audit trail + contradiction resolution         | Court-defensible agent memory              |
| **PR-873** | Firehorse ContentMS MVP                               | Content pipeline for blog, email, outreach |
| **PR-871** | Unified memory service + hybrid search + MCP tools    | Agent memory searchable via MCP            |
| **PR-870** | Firehorse expanded to 20 industries                   | Was 16, now 20 EU-regulated industries     |
| **PR-867** | Company-to-ERP resolver (Nordic construction)         | Auto-resolves company → ERP system         |
| **PR-865** | US Cloud vs EU Sovereign pricing tiers                | Dual pricing model                         |
| **PR-864** | PDF preview, payment UI, DB seeding                   | Store checkout improvements                |
| **PR-857** | Superpowers framework + composable skills             | 3 sample skills added                      |
| **PR-854** | Qantic energy partnership + BESS calculator           | First external LWM validation              |
| **PR-852** | BESS compliance API                                   | Battery energy storage compliance          |
| **PR-846** | 8 Dependabot vulnerability fixes                      | 7 high, 1 low resolved                     |

### 28.6 Operational Notes

- **Backup automation (PR-882):** Supabase backup/restore scripts now available at `scripts/db-backup.sh` and `scripts/db-restore.sh`. Automated daily backups with 30-day retention.
- **Memory decay (PR-876-878):** Agent memory facts decay over time via pg_cron. Stale facts below confidence threshold are auto-archived. Dashboard at `/dashboard/memory`.
- **20 industries:** All documentation should now reference 20 EU-regulated industries (was 16). Industries added: energy/BESS, chemicals, textiles, food processing.

---

## Section 29: DGX Spark — Primary 24/7 Runtime

### 29.1 Overview

DGX Spark (Acer Veriton GN100) is the primary compute runtime for all DWS IQ agents, cron jobs, and scheduled tasks. GitHub Actions is failover only — workflows check DGX Spark heartbeat before running.

| Spec            | Value                                                |
| --------------- | ---------------------------------------------------- |
| **Hardware**    | NVIDIA Grace Blackwell GB10 Superchip                |
| **RAM**         | 128GB unified memory                                 |
| **Storage**     | 3TB NVMe                                             |
| **OS**          | NVIDIA DGX Spark 7.4.0 (Ubuntu, Linux 6.17, aarch64) |
| **Hostname**    | gn100-cb5d                                           |
| **IP**          | 192.168.101.113 (Wi-Fi wlP9s9)                       |
| **SSH**         | admin100@192.168.101.113                             |
| **Web Console** | https://gn100-cb5d:9090/ (Cockpit)                   |

### 29.2 Architecture

```
DGX Spark (24/7, autonomous)              Win11 (on laptop open)
├── dws-backend    :8080  (16 agents)     ├── Startup-DWS.ps1 (at logon)
├── dws-cron       :8081  (23 cron jobs)  │   - git pull
├── dws-heartbeat  :9999  (health API)    │   - check DGX Spark heartbeat
├── redis          :6379  (job queue)     │   - run missed daily tasks
├── Ollama         :11434 (native)        └── Install-DailyTasks.ps1 (one-time)
│   ├── llama3.3:70b    (~40GB)
│   └── qwen2.5-coder:32b (~20GB)        GitHub Actions (failover)
└── day-runner.sh (systemd, every 5min)   ├── Checks heartbeat before each run
    ├── git pull if behind                ├── Skips if DGX Spark alive
    ├── docker compose up                 └── Runs job if DGX Spark down
    ├── scan scripts/daily/
    ├── scan scripts/hourly/
    └── scan scripts/on-deploy/
```

### 29.3 First-Time Setup (Run Once)

SSH into DGX Spark and run:

```bash
ssh admin100@192.168.101.113

# Set git identity (first time only)
git config --global user.email "risto.paarni@lifetime.fi"
git config --global user.name "DGX Spark"

# Clone or update repo
cd ~/dws6 && git pull origin main

# Run first-boot (installs everything)
bash infrastructure/dgx-spark/first-boot.sh
```

The first-boot script:

1. Installs Node.js 22 (if not present)
2. Runs `npm ci`
3. Pulls Ollama models (llama3.3:70b, qwen2.5-coder:32b)
4. Copies `.env` from repo root (or creates from `.env.example`)
5. Installs systemd services (day-runner timer + docker service)
6. Generates SSH key for GitHub Actions deploy

After first-boot, edit `.env` with real API keys:

```bash
nano ~/dws6/infrastructure/dgx-spark/.env
```

### 29.4 SSH Access from Win11

Add to `~\.ssh\config`:

```
Host dgx-spark
  HostName 192.168.101.113
  User admin100
  IdentityFile ~/.ssh/id_ed25519
  ServerAliveInterval 60
  ServerAliveCountMax 3
  LocalForward 11435 localhost:11434
  LocalForward 9998 localhost:9999
  LocalForward 8081 localhost:8081
```

Then: `ssh dgx-spark`

Port forwards provide:

- `localhost:11435` → Ollama API (for Cursor/Cline)
- `localhost:9998` → Heartbeat dashboard
- `localhost:8081` → Cron runner status

### 29.5 Daily Operations

DGX Spark is autonomous. The day-runner (systemd timer, every 5 minutes):

1. Checks if repo is behind — pulls if needed
2. Copies `.env` if missing or stale
3. Rebuilds Docker if Dockerfiles changed
4. Restarts unhealthy containers
5. Runs scripts in `scripts/daily/`, `scripts/hourly/`, `scripts/on-deploy/`

**Check status from Win11:**

```powershell
.\infrastructure\dgx-spark\Deploy-DgxSpark.ps1 -Status
```

**Or via SSH:**

```bash
ssh admin100@192.168.101.113
systemctl status dws-day-runner.timer    # Day runner active?
systemctl status dws-docker.service      # Docker containers up?
docker ps                                # Running containers
curl -s http://localhost:9999/health     # Heartbeat status
curl -s http://localhost:8081/status     # Cron job status
journalctl -u dws-day-runner --since today  # Today's logs
```

### 29.6 Script Convention (Auto-Discovery)

Drop a script in the right folder and it runs automatically. No config needed.

| Folder                             | Runs                                  | Example                                         |
| ---------------------------------- | ------------------------------------- | ----------------------------------------------- |
| `scripts/daily/*.sh` or `*.ts`     | Once per day (03:00–06:00 UTC)        | `db-backup.sh`, `morning-emails.sh`             |
| `scripts/hourly/*.sh` or `*.ts`    | Once per hour                         | Health checks                                   |
| `scripts/on-deploy/*.sh` or `*.ts` | After every git pull with new commits | `generate-google-feed.sh`, `inject-blog-nav.sh` |

State tracked in `logs/day-runner-state.json` to prevent double-runs.

### 29.7 Failover Behavior

| DGX Spark Status            | GitHub Actions                                                |
| --------------------------- | ------------------------------------------------------------- |
| Healthy (200)               | Skips scheduled runs (exit 0)                                 |
| Degraded (200)              | Skips scheduled runs — DGX still alive, avoids duplicate jobs |
| Down (503) / Unreachable    | Runs all jobs (full takeover)                                 |
| No heartbeat URL configured | Runs as primary (backwards compatible)                        |

**GitHub secret required:** `DGX_SPARK_HEARTBEAT_URL` — public URL of heartbeat service (via Cloudflare Tunnel or ngrok). Without this secret, GitHub Actions runs as primary.

**GitHub secret for auto-deploy:** `DGX_SPARK_SSH_KEY` — private SSH key matching DGX Spark's `~/.ssh/authorized_keys`.

### 29.8 Troubleshooting

| Problem                    | Fix                                                                                                                  |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Containers not running     | `ssh dgx-spark "cd ~/dws6/infrastructure/dgx-spark && docker compose up -d"`                                         |
| Day-runner not running     | `ssh dgx-spark "sudo systemctl start dws-day-runner.timer"`                                                          |
| Ollama not responding      | `ssh dgx-spark "systemctl status ollama"` then `sudo systemctl restart ollama`                                       |
| Repo stuck on wrong branch | `ssh dgx-spark "cd ~/dws6 && git checkout main && git pull origin main"`                                             |
| .env missing/stale         | Day-runner auto-copies from repo root every 5min. Or manually: `cp ~/dws6/.env ~/dws6/infrastructure/dgx-spark/.env` |
| SSH connection refused     | Check firewall: `ssh dgx-spark "sudo ufw status"`. Check sshd: `systemctl status sshd`                               |
| Model not found in Ollama  | `ssh dgx-spark "ollama pull llama3.3:70b"`                                                                           |

### 29.9 GitHub Repository Secrets

Manage at: https://github.com/blogtheristo/dws6/settings/secrets/actions

| Secret                           | Purpose                                              | Rotate via                                                                        |
| -------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`           | Cache purge for landing pages sync                   | Cloudflare → Profile → API Tokens (Google SSO via `risto.paarni2024@lifetime.fi`) |
| `CLOUDFLARE_ACCOUNT_ID`          | Cloudflare account identifier                        | Cloudflare dashboard → Account ID (sidebar)                                       |
| `CLOUDFLARE_ZONE_ID_DWS10`       | Zone ID for dws10.com                                | Cloudflare → dws10.com → Overview → Zone ID                                       |
| `CLOUDFLARE_ZONE_ID_ONELIFETIME` | Zone ID for onelifetime.world                        | Cloudflare → onelifetime.world → Overview → Zone ID                               |
| `DGX_SPARK_SSH_KEY`              | Private SSH key for auto-deploy to DGX Spark         | `ssh-keygen -t ed25519` on DGX Spark, paste private key                           |
| `DGX_SPARK_HOST`                 | DGX Spark IP address (192.168.101.113)               | Update if IP changes                                                              |
| `DGX_SPARK_KNOWN_HOSTS`          | Pinned SSH host key (prevents MITM)                  | `ssh-keyscan -t ed25519 192.168.101.113` on trusted network                       |
| `DGX_SPARK_HEARTBEAT_URL`        | `https://heartbeat.dws6.com/health` — failover check | Reconfigure if tunnel changes                                                     |
| `SUPABASE_URL`                   | Supabase project URL                                 | Supabase dashboard → Settings → API                                               |
| `SUPABASE_SERVICE_KEY`           | Supabase service role key                            | Supabase dashboard → Settings → API                                               |
| `GROQ_API_KEY`                   | Groq API for LLM fallback                            | https://console.groq.com/keys                                                     |
| `EMAIL_FROM`                     | Default sender email                                 | Verified in Amazon SES eu-north-1                                                 |
| `GCP_SA_KEY`                     | Google Cloud service account key                     | GCP Console → IAM → Service Accounts                                              |
| `SNYK_TOKEN`                     | Snyk security scanning                               | https://app.snyk.io/account                                                       |
| `SCW_ACCESS_KEY`                 | Scaleway API access key                              | Scaleway Console → Credentials                                                    |
| `SCW_SECRET_KEY`                 | Scaleway API secret key                              | Scaleway Console → Credentials                                                    |
| `SCW_ORGANIZATION_ID`            | Scaleway organization ID                             | Scaleway Console → Organization                                                   |
| `SCW_PROJECT_ID`                 | Scaleway project ID                                  | Scaleway Console → Project Settings                                               |
| `SCW_NAMESPACE_ID`               | Scaleway container namespace                         | Scaleway Console → Serverless Containers                                          |

**Deleted secrets (do NOT re-add):**

- `RESEND_API_KEY` — Resend banned (suspected C2 channel in Clawdbot incident). Email via Amazon SES only.
- `CLOUDFLARE_APII_TOKEN` — typo duplicate of `CLOUDFLARE_API_TOKEN`. No workflows referenced it.
- `DEEPSEEK_API_KEY` — unused, can be removed.

**Cloudflare login:** Google SSO via `risto.paarni2024@lifetime.fi` at https://dash.cloudflare.com/login

**API token rotation:** https://dash.cloudflare.com/profile/api-tokens → find token → Roll → copy new value → update GitHub secret.

### 29.10 Cloudflare Tunnel (heartbeat.dws6.com)

The heartbeat service is exposed to the internet via a Cloudflare Tunnel so GitHub Actions can check DGX Spark health for failover decisions.

**Tunnel details:**
| Field | Value |
|-------|-------|
| Tunnel name | `dgx-heartbeat` |
| Tunnel ID | `b2d1d6e8-28e5-48e0-a2d5-3d5b702ead8b` |
| Public URL | `https://heartbeat.dws6.com/health` |
| Local target | `http://localhost:9999` |
| Systemd service | `cloudflared.service` (auto-starts on boot) |
| Config file | `/etc/cloudflared/config.yml` |
| Credentials | `/etc/cloudflared/b2d1d6e8-28e5-48e0-a2d5-3d5b702ead8b.json` |
| User config (backup) | `~/.cloudflared/config.yml` |

**Config file contents (`/etc/cloudflared/config.yml`):**

```yaml
tunnel: dgx-heartbeat
credentials-file: /home/admin100/.cloudflared/b2d1d6e8-28e5-48e0-a2d5-3d5b702ead8b.json

ingress:
  - hostname: heartbeat.dws6.com
    service: http://localhost:9999
  - service: http_status:404
```

**Troubleshooting tunnel:**
| Problem | Fix |
|---------|-----|
| 502 error | Heartbeat container not running: `docker compose up -d heartbeat` |
| 1033 error | Tunnel not running: `sudo systemctl restart cloudflared` |
| Tunnel config missing | `sudo cp ~/.cloudflared/config.yml /etc/cloudflared/` |
| Check tunnel status | `cloudflared tunnel info dgx-heartbeat` |
| Check systemd status | `sudo systemctl status cloudflared` |
| View tunnel logs | `sudo journalctl -u cloudflared -f` |

**Security:** Only `/ping` and `/health` are public (minimal info). `/status` and `/api/*` require LAN IP or `HEARTBEAT_STATUS_TOKEN`. The heartbeat never leaks hostname or internal IPs.

### 29.11 Docker Containers

All services run via Docker Compose from `~/dws6/infrastructure/dgx-spark/`.

| Container       | Image                   | Port            | Health check                     | Purpose                        |
| --------------- | ----------------------- | --------------- | -------------------------------- | ------------------------------ |
| `dws-redis`     | `redis:7-alpine`        | 6379            | `redis-cli ping`                 | Cache, queue                   |
| `dws-backend`   | `dgx-spark-dws-backend` | 8080            | `curl localhost:8080/api/health` | Express API server             |
| `dws-cron`      | `dgx-spark-dws-cron`    | 8081 (internal) | `curl localhost:8081/health`     | 17 cron jobs                   |
| `dws-heartbeat` | `dgx-spark-heartbeat`   | 9999            | `curl localhost:9999/health`     | Health aggregator for failover |

**Common commands:**

```bash
# Status
cd ~/dws6/infrastructure/dgx-spark && docker compose ps

# Restart all
docker compose down && docker compose up -d

# Rebuild single container (e.g. after code fix)
docker compose build --no-cache dws-backend && docker compose up -d --no-deps dws-backend

# View logs
docker logs dws-backend --tail 50
docker logs dws-cron --tail 50
docker logs dws-heartbeat --tail 50

# Full rebuild from scratch
docker compose down && docker compose build --no-cache && docker compose up -d
```

**Build context:** Dockerfiles use `context: ../../` (repo root) for backend/cron, and `context: ./` for heartbeat/redis.

**Important:** After code fixes, always `git pull` on DGX Spark before rebuilding. The Docker build uses the local filesystem, not the Docker cache.

### 29.12 Deployment Verification Checklist

After any deployment or reboot, verify:

```bash
# 1. All containers healthy
docker compose ps

# 2. Backend responding
curl http://localhost:8080/api/health

# 3. Heartbeat responding
curl http://localhost:9999/health

# 4. Cloudflare Tunnel connected
curl https://heartbeat.dws6.com/health

# 5. Ollama running
curl http://localhost:11434/api/tags | python3 -m json.tool

# 6. Cloudflared service active
sudo systemctl status cloudflared
```

All 6 checks should pass. If heartbeat returns healthy but Cloudflare returns 502/1033, restart the tunnel: `sudo systemctl restart cloudflared`.

### 29.13 Related Files

| File                                                                    | Purpose                               |
| ----------------------------------------------------------------------- | ------------------------------------- |
| `infrastructure/dgx-spark/docker-compose.yml`                           | All Docker services                   |
| `infrastructure/dgx-spark/day-runner.sh`                                | Systemd auto-runner (every 5min)      |
| `infrastructure/dgx-spark/first-boot.sh`                                | One-time setup script                 |
| `infrastructure/dgx-spark/cron-runner.ts`                               | 23 cron jobs mirroring GitHub Actions |
| `infrastructure/dgx-spark/heartbeat.ts`                                 | Health aggregator                     |
| `infrastructure/dgx-spark/Deploy-DgxSpark.ps1`                          | Win11 PowerShell control              |
| `infrastructure/dgx-spark/.env.example`                                 | Environment template                  |
| `.github/actions/dgx-failover-check/action.yml`                         | Reusable failover check               |
| `.github/workflows/deploy-dgx-spark.yml`                                | Auto-deploy on merge to main          |
| `scripts/Startup-DWS.ps1`                                               | Win11 logon script                    |
| `scripts/Install-DailyTasks.ps1`                                        | Win11 Task Scheduler installer        |
| `docs/field-notes/2026-03-29-dgx-spark-primary-runtime-setup.md`        | Architecture field note               |
| `docs/field-notes/2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md` | SSH/firewall hardening                |

---

## Section 30: Claude Code Safety Hooks Reference

_Added: v3.2 (04.04.2026) — Branch: claude/setup-safety-hooks-vyt21_

### 30.1 Overview

DWS6 uses **12 Claude Code hooks** across 4 event types to enforce safety, security, and code quality automatically. All hooks are in `.claude/hooks/` and configured in `.claude/settings.local.json`.

**Design philosophy:** Zero permission prompts. Every hook either blocks (exit 2) or allows (exit 0). Never prompts the user to decide. This eliminates decision fatigue from constant approval dialogs.

**Architecture:** Allow-first. Safe command prefixes (node, npx, npm, python, git commit, etc.) are allowed immediately before any deny checks run. This prevents false positives from SQL/git keywords inside string literals, commit messages, or inline scripts.

### 30.2 Hook Inventory

#### SessionStart Hooks

| Hook           | File               | Purpose                                                                                                   |
| -------------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| Trust Boundary | `session-start.sh` | Injects GREEN/YELLOW/RED zone context, checks branch, warns about dirty working tree, verifies MCP health |

#### PreToolUse Hooks — Bash Commands

| Hook             | File                  | Purpose                                                                                                                                                                                            |
| ---------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pretooluse Guard | `pretooluse-guard.sh` | Master deny list: blocks rm -rf, force push, hard reset, git clean, git rm, sudo, pipe-to-shell, ollama model changes                                                                              |
| Secret Scanner   | `secret-scan.sh`      | Detects 14 OWASP secret patterns (AWS keys, GitHub tokens, Stripe keys, Anthropic keys, private key headers, JWT, npm tokens, Slack tokens)                                                        |
| Command Logger   | `log-commands.sh`     | Timestamps and audits every Bash command with branch info to `.claude/hooks/audit/bash-commands.log`                                                                                               |
| SQL Safety Guard | `sql-safety-guard.sh` | 7 SQL rules: transaction wrappers required, RLS on every CREATE TABLE, DROP TABLE approval, Aiwen Article 12 audit table immutability, CASCADE warnings, SECURITY DEFINER warnings, pg_cron safety |

#### PreToolUse Hooks — Edit/Write

| Hook           | File               | Purpose                                                                                                                                                     |
| -------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File Protector | `protect-files.sh` | Blocks writes to: `.env*`, `.git/*`, `*.pem/*.key/*.secret`, `credentials.json`, `supabase/migrations/*.sql`, lockfiles, `.md` files in public site folders |
| Secret Scanner | `secret-scan.sh`   | Same 14-pattern scan on file content being written                                                                                                          |

#### PreToolUse Hooks — PR Creation

| Hook      | File                      | Purpose                                                              |
| --------- | ------------------------- | -------------------------------------------------------------------- |
| Test Gate | `require-tests-for-pr.sh` | Hard gate: runs `npm run test`, blocks PR creation if any test fails |

#### PostToolUse Hooks — Write/Edit

| Hook     | Command                         | Purpose                                             |
| -------- | ------------------------------- | --------------------------------------------------- |
| Prettier | `npx prettier --write` (inline) | Auto-formats every written/edited file              |
| ESLint   | `npx eslint --fix` (inline)     | Auto-fixes lint errors on every written/edited file |

#### Stop Hooks

| Hook         | File              | Purpose                                                                                                                                                        |
| ------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Session Stop | `session-stop.sh` | Advisory governance checklist: uncommitted changes, dual folder sync, thesis file consistency, .md in public folders, standards updates                        |
| Auto-Commit  | `auto-commit.sh`  | Auto-commits staged changes on feature branches at session end. Skips main/master. Message format: `chore(ai): auto-commit N file(s) on session stop [branch]` |

#### Other

| Hook             | File                      | Purpose                                                                                               |
| ---------------- | ------------------------- | ----------------------------------------------------------------------------------------------------- |
| Branch Validator | `validate-branch-name.py` | Validates Git Flow naming: `feature/`, `release/vX.Y.Z`, `hotfix/`. Returns JSON denial with examples |

### 30.3 Trust Boundary Zones

Injected by `session-start.sh` on every session start:

| Zone                       | Policy              | Examples                                                                             |
| -------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| **GREEN** (full auto)      | No restrictions     | Read, Edit, Write, lint, test, build, git on feature branches                        |
| **YELLOW** (auto + logged) | Allowed but audited | MCP tools, agent skills, Docker, gh CLI, git push                                    |
| **RED** (blocked)          | Human required      | DB migrations, deploys, emails, thesis files, Store sync, standards updates, secrets |

### 30.4 Pretooluse Guard — Deny Patterns

| Pattern                           | Block Reason                         |
| --------------------------------- | ------------------------------------ |
| `rm -rf /`, `rm -fr /`            | Destructive rm on broad path         |
| `git push --force`, `git push -f` | Force push                           |
| `git reset --hard`                | Hard reset                           |
| `git clean -f`                    | Git clean with force                 |
| `git rm`                          | Must use `git mv` with `_OLD` suffix |
| `sudo`                            | Sudo blocked                         |
| `curl ... \| sh/bash`             | Pipe-to-shell attack                 |
| `wget ... \| sh/bash`             | Pipe-to-shell attack                 |
| `ollama pull/rm/remove/delete`    | Ollama model changes require human   |

**Allow-first bypass:** Commands starting with `node`, `npx`, `npm`, `tsx`, `python`, `git` (non-destructive), `make`, `cargo`, `docker`, `curl` (without pipe), `ls`, `cat`, `grep`, etc. skip all deny checks immediately.

### 30.5 Secret Scanner — 14 Patterns

| #   | Pattern                        | Detects               |
| --- | ------------------------------ | --------------------- |
| 1   | `AKIA[0-9A-Z]{16}`             | AWS Access Key        |
| 2   | `ghp_[A-Za-z0-9]{36}`          | GitHub Personal Token |
| 3   | `gho_[A-Za-z0-9]{36}`          | GitHub OAuth Token    |
| 4   | `ghu_[A-Za-z0-9]{36}`          | GitHub User Token     |
| 5   | `ghs_[A-Za-z0-9]{36}`          | GitHub Server Token   |
| 6   | `ghr_[A-Za-z0-9]{36}`          | GitHub Refresh Token  |
| 7   | `sk_live_[A-Za-z0-9]{24,}`     | Stripe Live Key       |
| 8   | `rk_live_[A-Za-z0-9]{24,}`     | Stripe Restricted Key |
| 9   | `-----BEGIN.*PRIVATE KEY-----` | Private Key Header    |
| 10  | `eyJ[A-Za-z0-9_-]{20,}\.eyJ`   | JWT Token             |
| 11  | `npm_[A-Za-z0-9]{36}`          | npm Token             |
| 12  | `sk-ant-[A-Za-z0-9_-]{20,}`    | Anthropic API Key     |
| 13  | `xoxb-[0-9]{10,}`              | Slack Bot Token       |
| 14  | `xoxp-[0-9]{10,}`              | Slack User Token      |

### 30.6 SQL Safety Rules

| #   | Rule                     | Enforcement                                                     |
| --- | ------------------------ | --------------------------------------------------------------- |
| 1   | Transaction wrappers     | Multi-DDL statements require `BEGIN`/`COMMIT`                   |
| 2   | RLS required             | `CREATE TABLE` without `ENABLE ROW LEVEL SECURITY` is blocked   |
| 3   | DROP TABLE approval      | Requires `-- APPROVED:` comment                                 |
| 4   | Aiwen immutability       | `UPDATE`/`DELETE` on `aiwen_*` and `article12_*` tables blocked |
| 5   | CASCADE warning          | `ON DELETE CASCADE` logged as warning                           |
| 6   | SECURITY DEFINER warning | Logged for review                                               |
| 7   | pg_cron safety           | Mutations via `cron.schedule` flagged                           |

### 30.7 File Protection Rules

| Blocked Path Pattern                               | Reason                              |
| -------------------------------------------------- | ----------------------------------- |
| `.env`, `.env.*`                                   | Secrets file                        |
| `.git/*`                                           | Git internals                       |
| `*.pem`, `*.key`, `*.secret`                       | Cryptographic material              |
| `credentials.json`, `service-account-*.json`       | Service credentials                 |
| `supabase/migrations/*.sql`                        | DB migrations (human-authored only) |
| `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` | Lockfiles                           |
| `dws10.com/**/*.md`, `dws6.com/**/*.md`            | .md in public site folders          |
| `landing-pages/**/*.md`                            | .md in public site folders          |
| `onelifetime.world/**/*.md`                        | .md in public site folders          |

### 30.8 Configuration

Full hook wiring in `.claude/settings.local.json`. See `.claude/settings.local.json` in the repository for the complete JSON configuration. Key structure:

- `hooks.SessionStart` — runs `session-start.sh`
- `hooks.PreToolUse` — 3 matcher groups: `Bash`, `Edit|Write`, `mcp__github__create_pull_request`
- `hooks.PostToolUse` — matcher `Write|Edit` runs prettier + eslint
- `hooks.Stop` — runs `session-stop.sh` + `auto-commit.sh`

### 30.9 Audit and Logging

| Log File                                | Content                                     |
| --------------------------------------- | ------------------------------------------- |
| `.claude/hooks/audit/bash-commands.log` | Every Bash command with timestamp + branch  |
| `.claude/hooks/audit.log`               | Block/allow decisions from pretooluse-guard |
| `.claude/command-log.txt`               | Duplicate command log                       |

All log files are gitignored (`*.log` pattern).

### 30.10 Testing Hooks

```bash
# Test pretooluse-guard — should BLOCK (exit 2)
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf /"}}' | bash .claude/hooks/pretooluse-guard.sh

# Test pretooluse-guard — should ALLOW (exit 0)
echo '{"tool_name":"Bash","tool_input":{"command":"npm run test"}}' | bash .claude/hooks/pretooluse-guard.sh

# Test sql-safety-guard — should BLOCK (missing RLS)
echo '{"tool_name":"Bash","tool_input":{"command":"psql -c \"CREATE TABLE foo (id int)\""}}' | bash .claude/hooks/sql-safety-guard.sh
```

### 30.11 Dependencies

- `jq` — JSON parser (required by all hooks)
- `grep` with Perl regex (`-P`) — used by secret-scan
- POSIX shell (`/bin/sh`) — all hooks
- Python 3 — `validate-branch-name.py` only
- `npm` — `require-tests-for-pr.sh`, PostToolUse formatters

### 30.12 Related Files

| File                               | Purpose                              |
| ---------------------------------- | ------------------------------------ |
| `.claude/hooks/README.md`          | Developer README for hooks directory |
| `.claude/settings.local.json`      | Hook wiring configuration            |
| `docs/AUTO_MODE_TRUST_BOUNDARY.md` | GREEN/YELLOW/RED zone definitions    |
| `CLAUDE.md`                        | Security rules that hooks enforce    |
| `Admin/SECURITY_COMPLIANCE.md`     | Enterprise security controls         |
| `DWS_SECURITY_STANDARD.md`         | AI safety framework                  |

---

## Section 31: External Repositories & Dependency Registry

_Added: v3.3 (08.04.2026) — Branch: claude/document-repos-weekly-sync-hHRMR_

### 31.1 Overview

DWS6 depends on external repositories for skills, tools, sandboxing, and research. This section is the **single source of truth** for all imported external repos, their security status, update cadence, and breach exposure analysis.

**Weekly sync:** `scripts/weekly/sync-external-repos.sh` runs every Sunday at 04:00 UTC via `day-runner.sh`.

### 31.2 External Repository Registry

| #   | Repository                      | License     | Version (pinned)                  | Category              | Integration Type                               | Status                   |
| --- | ------------------------------- | ----------- | --------------------------------- | --------------------- | ---------------------------------------------- | ------------------------ |
| 1   | `garrytan/gstack`               | MIT         | v0.15.16.0                        | Skills/Workflow       | Global install (`~/.claude/skills/gstack/`)    | ADOPT — 8 skills active  |
| 2   | `karpathy/autoresearch`         | MIT         | Fork: `blogtheristo/autoresearch` | Research/Optimization | Forked, `src/autoresearch/` adapts pattern     | ADOPT — KYA tuner        |
| 3   | `alibaba/OpenSandbox`           | Apache-2.0  | ^0.1.0                            | Sandboxing            | SDK integration (`src/sandbox/opensandbox.ts`) | TRIAL — Stage 1.5        |
| 4   | `vercel-labs/agent-browser`     | MIT         | Latest                            | Browser Automation    | CLI tool + `/browse` skill                     | ADOPT — QA/testing       |
| 5   | `googleworkspace/cli`           | Apache-2.0  | Latest                            | Workspace Integration | Optional global CLI add-on                     | ASSESS — not required    |
| 6   | `mvanhorn/last30days-skill`     | Unknown     | Vendored (in-repo)                | Prompt Research       | Vendored in `last30days-skill/`                | ADOPT — vendored copy    |
| 7   | `agentsmd/agents.md`            | Open spec   | v1.0                              | Specification         | AGENTS.md format standard                      | ADOPT — spec only        |
| 8   | `clawdbot/clawdbot`             | Unknown     | **BANNED**                        | Agent Framework       | Research reference ONLY                        | **BANNED** — C2 incident |
| 9   | `Shubhamsaboo/awesome-llm-apps` | Open source | N/A                               | Research              | Read-only extraction guide                     | ASSESS — research only   |

### 31.3 Security Exposure Analysis

#### 31.3.1 Resolved Incidents

| Incident           | Date       | External Dep                     | Impact                                                                             | Resolution                                                                            | Status        |
| ------------------ | ---------- | -------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------- |
| Clawdbot/Resend C2 | 2026-03-26 | `clawdbot/clawdbot` + Resend SDK | Suspected environment hijack via Cursor MCP; email exfiltration through Resend API | Resend permanently banned; Docker MCP retired; Cursor removed; CLI-first architecture | **RESOLVED**  |
| OpenClaw MCP Hub   | 2026-02-21 | OpenClaw/Moltworker ecosystem    | 3 critical + 5 high findings: SSRF via callback_url, zero auth, Redis injection    | MCP Hub isolated; auth required; never deployed to prod                               | **MITIGATED** |

#### 31.3.2 Current Risk Assessment

| Repository                  | Risk Level | Attack Surface                                                                       | Mitigation                                                                                        |
| --------------------------- | ---------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `garrytan/gstack`           | **MEDIUM** | Rapid releases (multiple/day); skill code executes with full Claude Code permissions | Pin to tested version; review changelogs before updating; weekly sync checks for breaking changes |
| `alibaba/OpenSandbox`       | **MEDIUM** | Low maturity (v0.1.0); sparse documentation; Docker-based (container escape risk)    | Network egress controls; Acer Veriton only (air-gapped); never expose to internet                 |
| `vercel-labs/agent-browser` | **LOW**    | Rust binary; CDP access to Chrome; AES-256-GCM encrypted sessions                    | Headless mode only; no persistent sessions in prod; scoped to QA                                  |
| `mvanhorn/last30days-skill` | **LOW**    | Requires OpenAI + XAI API keys; vendored (no auto-update)                            | Keys in `~/.config/last30days/.env` (not in repo); vendored copy is frozen                        |
| `googleworkspace/cli`       | **LOW**    | Optional; OAuth scoped; not officially supported by Google                           | Only install when needed; service account for CI                                                  |
| `karpathy/autoresearch`     | **LOW**    | Single GPU, no network, no tools; forked and governed by KYA v1.4                    | Local-only; 11% efficiency cap; human gate on parameter changes                                   |

#### 31.3.3 Supply Chain Rules

1. **Never auto-install** external skills or tools from community registries (CLAUDE.md rule)
2. **Pin versions** — every external dep must have a pinned version in this registry
3. **Weekly audit** — `scripts/weekly/sync-external-repos.sh` checks for new releases, security advisories, and breaking changes
4. **Vendor when possible** — prefer vendored copies (like `last30days-skill/`) over global installs
5. **BANNED list** — `clawdbot/clawdbot` and `resend` package are permanently banned (see incident report: `docs/field-notes/2026-03-26-post-incident-cli-first-migration.md`)

### 31.4 Update Procedures

| Frequency                 | What                                                 | Script                                               | Human Approval               |
| ------------------------- | ---------------------------------------------------- | ---------------------------------------------------- | ---------------------------- |
| Weekly (Sunday 04:00 UTC) | Check all repos for new releases, CVEs, deprecations | `scripts/weekly/sync-external-repos.sh`              | Report only — no auto-update |
| Monthly                   | Review gstack changelog, update pinned version       | Manual                                               | Required                     |
| On incident               | Emergency audit of all external deps                 | `scripts/weekly/sync-external-repos.sh --full-audit` | Required                     |

### 31.5 Autoresearch Status

**Upstream:** `karpathy/autoresearch` (MIT, 30k+ stars)
**Fork:** `blogtheristo/autoresearch`
**DWS integration:** `src/autoresearch/runner.ts` + `src/autoresearch/kya-tuner.ts` + `src/autoresearch/synthetic-kya.ts`

The DWS autoresearch implementation adapts Karpathy's pattern for KYA (Know Your Architecture) parameter tuning:

- Overnight batch optimization of agent trust score parameters
- Governed by KYA v1.4 Pillar 4 (11% efficiency cap, 72h human gate)
- Methodology documented: `docs/field-notes/2026-03-14-openclaw-autoresearch-dws-feature-plan.md`

**Weekly sync updates the fork** from upstream (`karpathy/autoresearch`) and reports divergence.

### 31.6 Related Documents

| Document                                                                         | Purpose                          |
| -------------------------------------------------------------------------------- | -------------------------------- |
| `docs/field-notes/2026-03-26-post-incident-cli-first-migration.md`               | Clawdbot/Resend incident report  |
| `docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md` | OpenClaw security assessment     |
| `docs/field-notes/2026-03-14-openclaw-autoresearch-dws-feature-plan.md`          | Autoresearch + OpenClaw strategy |
| `docs/TECH_RADAR.md`                                                             | Technology adoption rings        |
| `AGENTS.md` Section 16                                                           | Rise of CLIs & External Add-ons  |
| `DWS_SECURITY_STANDARD.md`                                                       | AI safety framework              |

---

## GitHub Actions & Cron Job Registry

> **Added v3.3 (08.04.2026)** — Full audit of 35 GitHub Actions workflows and 22+ DGX Spark cron scripts. As of 2026-04-08, **DGX Spark is the primary runtime** for all scheduled automation. GitHub Actions retains only CI/CD (PR/push-triggered) workflows and manual dispatch fallbacks.

### 30.1 Architecture: DGX Spark Primary, GitHub Actions Failover

```
DGX Spark (24/7)                    GitHub Actions (CI/CD only)
├── day-runner.sh (every 5 min)     ├── PR/push-triggered workflows
│   ├── scripts/daily/*.{ts,sh}     ├── workflow_dispatch (manual fallback)
│   ├── scripts/weekly/*.{ts,sh}    └── Deployment workflows
│   ├── scripts/hourly/*.{ts,sh}
│   └── scripts/on-deploy/*.{ts,sh}
└── systemd timers (morning emails)
```

**Why:** GitHub Actions free tier = 3,000 min/month. Scheduled workflows consumed ~1,200 min/month on timer checks alone. DGX Spark runs 24/7 with no minute limits.

### 30.2 DGX Spark Cron Scripts (Primary)

Auto-discovered by `infrastructure/dgx-spark/day-runner.sh`. No config needed — drop a script in the right folder.

#### Daily Scripts (`scripts/daily/`)

| Script                        | Purpose                                    | Replaced GitHub Actions         |
| ----------------------------- | ------------------------------------------ | ------------------------------- |
| `generate-campaign-post.sh`   | 800-day campaign post generation (EN + FI) | `campaign-daily-posts.yml`      |
| `construction-leads.sh`       | TED tender scraping, Supabase storage      | `construction-leads.yml`        |
| `db-backup.sh`                | pg_dump Supabase, AES-256 encryption       | `daily-db-backup.yml`           |
| `backup-sites.sh`             | Backup dws6/dws10/onelifetime sites        | `daily-site-backup.yml`         |
| `db-restore-verify.sh`        | Verify backup integrity                    | —                               |
| `morning-emails.sh`           | Wrapper for morning brief V2               | `morning-briefing.yml.disabled` |
| `news-to-signal.sh`           | RSS to regulation signals                  | —                               |
| `autosend-x.sh`               | Autonomous social posting                  | —                               |
| `check-ollama-models.sh`      | Verify Ollama models are loaded            | —                               |
| `check-breach-deadlines.sh`   | GDPR breach deadline alerts                | —                               |
| `check-breach-deadlines.ts`   | TypeScript version of above                | —                               |
| `kb-lint.sh`                  | Knowledge base linting                     | —                               |
| `kb-cleanup.sh`               | Knowledge base cleanup                     | —                               |
| `dependabot-audit.sh`         | Dependency vulnerability check             | —                               |
| `flow-sales-outreach.ts`      | Autonomous sales pipeline                  | —                               |
| `flow-media-outreach.ts`      | Autonomous media pipeline                  | —                               |
| `flow-investor-outreach.ts`   | Autonomous investor pipeline               | —                               |
| `flow-partner-outreach.ts`    | Autonomous partner pipeline                | —                               |
| `flow-customer-onboarding.ts` | Autonomous onboarding pipeline             | ���                             |
| `tool-telemetry-report.ts`    | MCP tool usage analytics                   | —                               |
| `synthetic-data-health.ts`    | Synthetic data quality checks              | —                               |

#### Weekly Scripts (`scripts/weekly/`)

| Script                   | Purpose                                     | Replaced GitHub Actions      |
| ------------------------ | ------------------------------------------- | ---------------------------- |
| `sync-external-repos.sh` | Sync forks from upstream                    | —                            |
| `market-research.sh`     | Competitor data collection, Supabase writes | `market-research-weekly.yml` |

#### Hourly Scripts (`scripts/hourly/`)

None currently. Place scripts here for hourly execution.

#### On-Deploy Scripts (`scripts/on-deploy/`)

Run after every `git pull` that has new commits.

### 30.3 GitHub Actions — Schedule REMOVED (Manual Dispatch Only)

These workflows had their `schedule` (cron) triggers removed on 2026-04-08. They remain available via `workflow_dispatch` (manual trigger from GitHub UI) as fallback.

| Workflow                     | Was                                | Monthly Minutes Saved | DGX Spark Replacement                               |
| ---------------------------- | ---------------------------------- | --------------------- | --------------------------------------------------- |
| `campaign-daily-posts.yml`   | `0 3,4 * * *` (2x daily)           | ~480 min              | `scripts/daily/generate-campaign-post.sh`           |
| `construction-leads.yml`     | `0 3,4 * * 1-6` (2x daily Mon-Sat) | ~241 min              | `scripts/daily/construction-leads.sh`               |
| `daily-db-backup.yml`        | `30 2 * * *` (daily)               | ~120 min              | `scripts/daily/db-backup.sh`                        |
| `daily-site-backup.yml`      | `0 2 * * *` (daily)                | ~150 min              | `scripts/daily/backup-sites.sh`                     |
| `daily-backup.yml`           | `55 23 * * *` (daily)              | ~90 min               | Not needed (backs up git-tracked files into git)    |
| `daily-claude-backup.yml`    | `0 6 * * *` (daily)                | ~60 min               | Not needed (Claude sessions are local to worktrees) |
| `market-research-weekly.yml` | `0 7 * * 1` (Monday)               | ~43 min               | `scripts/weekly/market-research.sh`                 |
| **TOTAL SAVED**              |                                    | **~1,184 min/month**  |                                                     |

### 30.4 GitHub Actions — Schedule ACTIVE (Remain in Actions)

These workflows keep their cron schedules because they need GitHub API access (issue creation, PR comments, security events) that DGX Spark doesn't have.

| Workflow                              | Schedule             | Purpose                                     | Monthly Minutes    |
| ------------------------------------- | -------------------- | ------------------------------------------- | ------------------ |
| `agents-md-freshness.yml`             | Mon 06:00 UTC        | AGENTS.md staleness check, creates issues   | ~9 min             |
| `biweekly-auth-security-audit.yml`    | 1st & 15th 02:00 UTC | Auth security audit, creates issues         | ~38 min            |
| `golden-principle-scan.yml`           | Mon 06:30 UTC        | Golden principle violations, creates issues | ~9 min             |
| `housekeeping-weekly.yml`             | Sun 03:00 UTC        | Repo housekeeping audit, creates issues     | ~13 min            |
| `roadmap-weekly-tracker.yml`          | Mon 08:00 UTC        | DWS7 roadmap progress, creates issues       | ~22 min            |
| `security-audit-enhanced.yml`         | Mon 02:00 UTC        | Deployment file protection check            | ~9 min             |
| `security-scan-weekly.yml`            | Sun 21:00 UTC        | ZenFree weekly security scan                | ~26 min            |
| `security-scan-biweekly.yml`          | 1st & 15th 02:30 UTC | ZenFree biweekly scan                       | ~38 min            |
| `monthly-security-audit-enhanced.yml` | 1st 00:00 UTC        | Monthly deep security audit                 | ~6 min             |
| `dependency_review.yml`               | Sun 00:00 UTC + PR   | Dependency vulnerability scan               | ~18 min            |
| **TOTAL ACTIVE**                      |                      |                                             | **~188 min/month** |

**Migration note:** If `gh` CLI is installed on DGX Spark, these could also move to cron. For now they stay in Actions due to GitHub API dependency.

### 30.5 GitHub Actions — PR/Push-Triggered (CI/CD)

These run only on code changes and are essential CI/CD gates. No changes needed.

| Workflow                      | Trigger                    | Purpose                          |
| ----------------------------- | -------------------------- | -------------------------------- |
| `test.yml`                    | Push/PR to src/            | Vitest + coverage (CI gate)      |
| `secret-scan-gitleaks.yml`    | PR + main push             | Gitleaks secret detection        |
| `security-check-pr.yml`       | PR code changes            | Aikido security check            |
| `ai-pr-review.yml`            | PR opened/sync             | Dual AI review (Claude + Gemini) |
| `claude-review.yml`           | PR ready                   | Claude PR review                 |
| `claude-auto-fix.yml`         | PR + manual                | Claude Code auto-fix             |
| `copilot-preflight.yml`       | Push copilot/_, claude/_   | Pre-PR gate                      |
| `ruff.yml`                    | PR/Push \*\*.py            | Python linting                   |
| `image-guardian.yml`          | PR/Push images             | Image asset protection           |
| `agents-md-sync.yml`          | Push main, src/agents/     | Auto-sync AGENTS.md              |
| `sync-dws6-landing-pages.yml` | Push main, site dirs       | rsync to landing-pages/          |
| `update-store.yml`            | Push Store/, products.json | Google Merchant feed build       |
| `dependency-submission.yml`   | Push deps + manual         | Dependency snapshot              |
| `no-delete-branch-guard.yml`  | Branch delete event        | Auto-restore deleted branches    |

### 30.6 GitHub Actions — Deployment Workflows

| Workflow               | Trigger              | Purpose                                    |
| ---------------------- | -------------------- | ------------------------------------------ |
| `deploy-dgx-spark.yml` | Push main (filtered) | SSH to DGX Spark, git pull, docker rebuild |
| `deploy-scaleway.yml`  | Push main + manual   | Docker build, Scaleway deploy              |

### 30.7 GitHub Actions — Manual Dispatch Only

| Workflow            | Purpose                     |
| ------------------- | --------------------------- |
| `ruff-auto-fix.yml` | Ruff auto-fix + PR creation |
| `pr-auto-merge.yml` | Auto-merge ai-approved PRs  |

### 30.8 Morning Brief V2 Sections

The Morning Brief V2 (`scripts/send-morning-brief-v2.ts`) sends one combined email at 06:00 Helsinki time (Mon-Sat). As of v3.0 it has 10 sections:

| #   | Section             | Data Source                                      | Added |
| --- | ------------------- | ------------------------------------------------ | ----- |
| 1   | Metrics Strip       | Supabase (cockpit data)                          | v2.0  |
| 2   | Pipeline Dashboard  | Supabase (outreach threads + flow tasks)         | v2.0  |
| 3   | Captain & Inquiries | Supabase (captain_inquiries + outreach)          | v2.0  |
| 4   | Regulation Signals  | External RSS feeds                               | v2.0  |
| 5   | Media Board         | Supabase (content_calendar)                      | v2.0  |
| 6   | Social Queue        | Supabase (social scheduler)                      | v2.0  |
| 7   | Campaign Posts      | Supabase (content_calendar) + day counter        | v3.0  |
| 8   | Construction Leads  | Supabase (construction_leads via lead-processor) | v3.0  |
| 9   | Market Research     | Supabase (market_research_signals), Monday only  | v3.0  |
| 10  | HIL Checklist       | Static + Supabase (overdue count)                | v2.0  |

**Sections 7-9** were added 2026-04-08 to surface campaign posts and construction leads that previously only ran as GitHub Actions with no email notification. Market research signals are surfaced on Mondays after the weekly collection.

### 30.9 Backup Infrastructure Audit

| Backup Type             | Script/Workflow                      | Schedule             | Storage                    | Retention      |
| ----------------------- | ------------------------------------ | -------------------- | -------------------------- | -------------- |
| Database (pg_dump)      | `scripts/daily/db-backup.sh`         | Daily 03-06 UTC      | Local encrypted + artifact | 30 days        |
| Database restore verify | `scripts/daily/db-restore-verify.sh` | Daily (after backup) | Local log                  | —              |
| Site files              | `scripts/daily/backup-sites.sh`      | Daily 03-06 UTC      | Local tar.gz               | 30 days        |
| Git sync                | `day-runner.sh` step 1               | Every 5 min          | DGX Spark local repo       | Always current |
| Docker images           | `day-runner.sh` step 2               | On code change       | DGX Spark Docker           | Latest         |

**Git sync verification:** The day-runner runs `git fetch origin main` every 5 minutes and `git reset --hard origin/main` when behind. This ensures DGX Spark always has the latest code, which means backup scripts always backup the latest state.

### 30.10 Cost Impact Summary

| Before (March 2026)           | After (April 2026)                          |
| ----------------------------- | ------------------------------------------- |
| 35 workflows, 16 scheduled    | 35 workflows, 10 scheduled                  |
| ~1,372 min/month scheduled    | ~188 min/month scheduled                    |
| 90% of 3,000 min free tier    | ~6% of 3,000 min free tier (scheduled only) |
| PR/push variable: ~2,000+ min | PR/push unchanged: ~2,000+ min              |
| **Monthly total: ~3,400 min** | **Monthly total: ~2,200 min**               |

**Savings: ~1,200 min/month (~35% reduction)**

---

**License:** Proprietary - Lifetime Oy
**Maintained by:** Lifetime Oy Development Team
**Storage:** GitHub (private repo) + ProtonDrive sync - /2026/Repos2026/dws6/Admin

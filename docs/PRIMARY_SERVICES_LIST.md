# Primary Services List — DWS IQ 6

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-i5ASR | Date: 17.03.2026 | Changes: Initial creation — complete service catalog with MVP pilot, V1, failover, and pentesting status

Session Links & References:
  - Claude Code (claude/build-mvp-features-i5ASR): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/PRIMARY_SERVICES_LIST.md

Document Status:
  - Created: 17.03.2026
  - Last Modified: 17.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.0
**Effective Date:** 2026-03-17
**Status:** Active

---

## 1. Service Tiers

| Tier | Definition | SLA Target |
|------|-----------|------------|
| **MVP Pilot** | Minimum services for first paying customer | 99% uptime |
| **V1 Customer** | Full services for 3rd+ customer (production-hardened) | 99.5% uptime |
| **V2 Enterprise** | Multi-tenant, ISO 27001, on-premise options | 99.9% uptime |

---

## 2. Email Services

| Service | Version | Role | MVP Pilot | V1 Customer | Failover | Pentest Status |
|---------|---------|------|-----------|-------------|----------|----------------|
| **Amazon SES (SMTP)** | via nodemailer ^8.0.1 | Primary email transport | YES | YES | Falls back to Resend | Verified — DKIM/SPF/DMARC configured (2026-03-10) |
| **Resend** | ^4.0.0 | Secondary email transport | YES | YES | Falls back to local queue | API key rotated quarterly |
| **Supabase email_queue** | PostgreSQL table | Local audit trail + retry queue | YES | YES | Last resort — manual CLI replay | RLS enforced, service_role only |
| **Onboarding Email Sequence** | 1.0 | Day 0/3/7 drip via SES | YES | YES | Emails persist to email_queue | Templates reviewed for XSS |

**SES as client implementation requirement:** Every enterprise customer deployment includes SES DKIM/SPF setup for their sender domain. See Section 8 (Enterprise Rollout Checklist).

**GN100 SES Bridge (planned):** Postfix relay on Acer GN100 for edge email failover when cloud SES is unreachable. See Section 9.

---

## 3. Database Services

| Service | Version | Role | MVP Pilot | V1 Customer | Failover | Pentest Status |
|---------|---------|------|-----------|-------------|----------|----------------|
| **Supabase PostgreSQL** | PostgreSQL 16 + pgvector | Primary transactional DB | YES | YES | Aiven mirror (daily) | RLS on all tables, drift-checked |
| **Aiven PostgreSQL** | PostgreSQL 16 | Training sandbox / mirror | NO | YES | Read-only copy | Isolated network |
| **GN100 Edge PostgreSQL** | PG16 + TimescaleDB + pg_duckdb + pgvector | Edge telemetry + Article 12 audit | NO | YES | Local-only, SSH access | ARM64 hardened Docker container |
| **Redis (Docker)** | 7-alpine | Session cache, rate limiting | YES | YES | Upstash Redis (serverless) | Port 6380, no external exposure |
| **Upstash Redis** | ^1.36.2 | Edge token blacklist | YES | YES | Fallback to local ioredis | HTTP-based, connectionless |

**Data Residency:** All primary data in europe-north1 (Finland). Edge data stays on-premise (GN100).

---

## 4. Cloud & Hosting Services

| Service | Type | Region | MVP Pilot | V1 Customer | Failover | Pentest Status |
|---------|------|--------|-----------|-------------|----------|----------------|
| **Google Cloud Run** | Backend API containers | europe-north1 | YES | YES | Scaleway Serverless (fr-par) | Container scanning via Image Guardian |
| **Cloudflare Pages** | Static site hosting | Global CDN | YES | YES | Multi-zone redundancy (built-in) | SRI hashes on all CDN assets |
| **Cloudflare Workers** | Edge compute + sandboxes | Global | YES | YES | Cloud Run fallback | Isolated V8 runtime |
| **Cloudflare DNS** | Domain management | Global | YES | YES | Cloudflare multi-zone | DNSSEC enabled |
| **GCP Artifact Registry** | Docker images | europe-north1 | YES | YES | Scaleway Container Registry | Private registry, IAM-gated |
| **Scaleway** | Secondary hosting | fr-par | NO | YES | N/A (is the failover) | Isolated deployment pipeline |

---

## 5. AI/LLM Services

| Service | Model | Role | MVP Pilot | V1 Customer | Failover | Pentest Status |
|---------|-------|------|-----------|-------------|----------|----------------|
| **Anthropic Claude** | claude-sonnet-4 | Primary LLM | YES | YES | Groq → Grok → OpenAI-compatible | API key scoped, no PII in prompts |
| **Groq** | llama-3.3-70b-versatile | Fast inference fallback | YES | YES | Grok → OpenAI-compatible | OpenAI-compatible endpoint |
| **xAI Grok** | grok-3 | Sovereign LLM (org-gated) | NO | YES | OpenAI-compatible | GDPR Art. 6 consent gate, Article 12 logging |
| **Ollama (GN100)** | Local models | Edge inference | NO | YES | Cloud LLM fallback | Air-gapped inference, no data egress |

**Provider Chain:** Anthropic → Groq → Grok (with consent) → OpenAI-compatible (Ollama)

---

## 6. Auth & Security Services

| Service | Version | Role | MVP Pilot | V1 Customer | Failover | Pentest Status |
|---------|---------|------|-----------|-------------|----------|----------------|
| **Supabase Auth** | Supabase SDK ^2.39.0 | User authentication | YES | YES | JWT fallback (local) | OAuth 2.0, email verification |
| **JWT** | jsonwebtoken ^9.0.2 | Token signing (7d expiry) | YES | YES | N/A (stateless) | HS256 minimum, secret rotated quarterly |
| **Helmet** | ^7.1.0 | Security headers | YES | YES | N/A | HSTS, CSP, X-Frame-Options |
| **express-validator + Zod** | ^7.2.0 | Input validation | YES | YES | N/A | All routes validated at boundary |
| **bcryptjs** | ^2.4.3 | Password hashing | YES | YES | N/A | Cost factor 12 |

---

## 7. Monitoring & Observability

| Service | Version | Role | MVP Pilot | V1 Customer | Failover | Pentest Status |
|---------|---------|------|-----------|-------------|----------|----------------|
| **Pino** | ^9.3.2 | Structured JSON logging | YES | YES | stdout fallback | No PII in log output |
| **Prometheus** | v2.48.0 | Metrics collection | NO | YES | N/A | Port 9091, internal only |
| **Grafana** | 10.2.2 | Dashboard visualization | NO | YES | N/A | Port 3001, auth-gated |
| **cAdvisor** | v0.47.0 | Container metrics | NO | YES | N/A | Port 8080, internal only |
| **Health Check (/health)** | Built-in | Readiness probe | YES | YES | N/A | Reports Supabase + Redis + LLM status |

---

## 8. Enterprise Customer Rollout Checklist (SES Setup)

Every enterprise customer deployment MUST include email infrastructure setup:

| # | Step | Owner | MVP Pilot | V1 Customer |
|---|------|-------|-----------|-------------|
| 1 | **Verify customer sender domain in SES** | DWS + Customer IT | YES | YES |
| 2 | **Configure DKIM (2048-bit)** on customer domain | DWS | YES | YES |
| 3 | **Configure SPF** — add SES include in customer DNS | Customer IT | YES | YES |
| 4 | **Configure DMARC** — p=quarantine minimum | Customer IT | YES | YES |
| 5 | **Move SES out of sandbox mode** — production access request | DWS | YES | YES |
| 6 | **Set up SMTP credentials** — per-customer IAM user | DWS | YES | YES |
| 7 | **Configure email_queue audit table** — customer org_id scoped | DWS | YES | YES |
| 8 | **Test email delivery** — welcome + compliance report emails | DWS QA | YES | YES |
| 9 | **Set up bounce/complaint handling** — SNS topic → webhook | DWS | NO | YES |
| 10 | **Configure Resend as failover** — customer domain verified | DWS | NO | YES |
| 11 | **Edge SMTP relay on GN100** — Postfix bridge for offline email | DWS | NO | YES |
| 12 | **Weekly SES sending quota monitoring** — CloudWatch alarm | DWS Ops | NO | YES |

**Timeline:** Steps 1-8 during customer onboarding week. Steps 9-12 within 30 days of go-live.

---

## 9. GN100 SES Bridge — Edge Email Failover

**Question:** Can SES run partly as a bridge on the Acer Veriton GN100?

**Answer: Yes.** The GN100 (ARM64, 120 GiB RAM, Ubuntu 24.04) can run a **Postfix SMTP relay** that queues emails locally and forwards them through SES when connectivity is available.

### Architecture

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────┐
│  DWS IQ Backend      │     │  GN100 Edge Device   │     │  Amazon SES  │
│  (Cloud Run / Local) │────▶│  Postfix SMTP Relay   │────▶│  SMTP API    │
│                      │     │  + Maildir spool      │     │              │
│  Falls back to       │     │  + Daily flush cron   │     │  eu-north-1  │
│  GN100 when SES      │     │  + Email audit log    │     │              │
│  is unreachable      │     │  (ARM64 Docker)       │     │              │
└──────────────────────┘     └──────────────────────┘     └──────────────┘
```

### How It Works

1. **Normal operation:** DWS backend sends via SES SMTP directly. GN100 is idle.
2. **SES unreachable:** Backend detects SMTP failure, routes to GN100 Postfix relay (LAN or SSH tunnel).
3. **GN100 spools:** Postfix queues emails to local Maildir. Writes copy to edge PostgreSQL `email_queue`.
4. **Connectivity restored:** Cron job flushes Postfix queue through SES. Updates `email_queue` status to `sent`.
5. **Audit trail:** Every email exists in both cloud Supabase `email_queue` AND edge PostgreSQL — full traceability.

### GN100 Suitability

| Requirement | GN100 Capability | Verdict |
|-------------|-----------------|---------|
| ARM64 Postfix | Ubuntu 24.04 apt repository | Supported |
| Local mail spool | 120 GiB RAM, NVMe storage | More than enough |
| TLS to SES | OpenSSL available | Supported |
| Docker container | Docker runtime validated (2026-03-11) | Supported |
| Audit logging | Edge PostgreSQL with TimescaleDB | Supported |

### Implementation Status

| Component | Status | Priority |
|-----------|--------|----------|
| Postfix Docker image (ARM64) | NOT STARTED | V1 Customer |
| Maildir spool configuration | NOT STARTED | V1 Customer |
| SES relay credentials (per-customer) | NOT STARTED | V1 Customer |
| Cron flush job | NOT STARTED | V1 Customer |
| Edge PostgreSQL email_queue sync | SCHEMA EXISTS | V1 Customer |
| send-email.ts GN100 fallback route | NOT STARTED | V1 Customer |

---

## 10. CI/CD & Deployment Services

| Service | Version | Role | MVP Pilot | V1 Customer |
|---------|---------|------|-----------|-------------|
| **GitHub Actions** | 15 workflows | CI/CD pipeline | YES | YES |
| **Docker Compose** | hybrid.yml | Local + prod orchestration | YES | YES |
| **gitleaks** | Workflow | Secret scanning on every push | YES | YES |
| **Bandit + Safety** | Weekly | Python security scanning | NO | YES |
| **Dependency Review** | PR gate | Block unsafe deps | YES | YES |
| **Image Guardian** | Scheduled | Docker image vulnerability scan | NO | YES |
| **Vitest** | ^4.0.16 | Unit + integration + E2E tests | YES | YES |

---

## 11. ERP & ESG Integrations

| Service | Type | MVP Pilot | V1 Customer | Status |
|---------|------|-----------|-------------|--------|
| **SAP S/4HANA** | ERP connector | NO | YES (Phase 2) | Development |
| **IFS Cloud** | ERP connector | NO | YES (Phase 2) | Development |
| **Microsoft Dynamics 365** | ERP connector | NO | YES (Phase 2) | Development |
| **Monitor ERP** | Nordic SME connector | NO | YES (Phase 2) | Development |
| **Visma** | Nordic mid-market | NO | YES (Phase 2) | Development |
| **Jeeves ERP** | Swedish SME | NO | YES (Phase 2) | Development |
| **Worldfavor** | ESG reporting | NO | YES (Phase 2) | Development |
| **PositionGreen** | Carbon reporting | NO | YES (Phase 2) | Development |

---

## 12. MCP (Model Context Protocol) Services

| Server | Port | MVP Pilot | V1 Customer | Purpose |
|--------|------|-----------|-------------|---------|
| **MCP Hub** | 8765 | YES | YES | Central orchestrator |
| **Carbon API** | 8766 | YES | YES | DB operations via MCP |
| **GitHub MCP** | 8767 | NO | YES | Repository management |
| **Cloud Run MCP** | 8769 | NO | YES | GCP deploy management |
| **LWM Training Bridge** | 8770 | NO | YES | GN100 ↔ MCP Hub |
| **Claude Session Sync** | 8771 | NO | YES | Session handoff |

---

## 13. Pentesting & Security Assessment Status

| Area | Last Assessment | Finding | Status | Next Review |
|------|----------------|---------|--------|-------------|
| **Shell injection** | 2026-02-21 | Use execFile, never exec with string interpolation | REMEDIATED | Quarterly |
| **CORS** | 2026-02-21 | Explicit origins, no wildcards | REMEDIATED | Quarterly |
| **CDN SRI** | 2026-02-21 | integrity + crossorigin on all external scripts | REMEDIATED | On each CDN update |
| **MCP prompt injection** | 2026-02-21 | Treat all MCP tool responses as untrusted | MITIGATED | Quarterly |
| **DKIM/SPF/DMARC (SES)** | 2026-03-10 | Full email auth chain verified | PASS | Monthly |
| **Supabase RLS** | Ongoing | All tables have RLS policies | MONITORED | db-drift-check on deploy |
| **Secret scanning** | Every push | gitleaks workflow | AUTOMATED | Continuous |
| **Dependency vulnerabilities** | Weekly | npm audit + Safety | AUTOMATED | Weekly |
| **Docker image scan** | Scheduled | Image Guardian workflow | AUTOMATED | Weekly |
| **Password hashing** | 2026-02-21 | bcryptjs cost factor 12 | PASS | Annually |
| **JWT security** | 2026-02-21 | HS256, 7d expiry, token blacklist | PASS | Quarterly |
| **Edge device hardening** | 2026-03-11 | Docker isolation, SSH-only access | PASS | Monthly |

---

## 14. Failover Summary

| Layer | Primary | Failover 1 | Failover 2 | Manual Fallback |
|-------|---------|------------|------------|-----------------|
| **Email** | Amazon SES (SMTP) | Resend API | Supabase email_queue | CLI replay from queue |
| **Email (edge)** | SES direct | GN100 Postfix relay | Local Maildir spool | Manual flush |
| **LLM** | Anthropic Claude | Groq | Grok (consent-gated) / Ollama | Switch env var |
| **Database** | Supabase (EU) | Aiven mirror | GN100 edge PostgreSQL | pg_restore |
| **Backend** | Google Cloud Run (EU) | Scaleway Serverless (EU) | Docker local | Manual deploy |
| **CDN** | Cloudflare (global) | Multi-zone built-in | N/A | DNS failover |
| **Auth tokens** | Upstash Redis | ioredis (local) | JWT stateless | Manual revoke |
| **Monitoring** | Prometheus + Grafana | Pino stdout logs | syslog (future) | Manual dashboard |

---

## 15. Service Count Summary

| Category | MVP Pilot Services | V1 Customer Services | Total Catalog |
|----------|-------------------|---------------------|---------------|
| Email | 3 | 4 (+ GN100 bridge) | 4 |
| Database | 3 | 5 | 5 |
| Cloud/Hosting | 4 | 6 | 6 |
| AI/LLM | 2 | 4 | 4 |
| Auth/Security | 5 | 5 | 5 |
| Monitoring | 2 | 5 | 5 |
| MCP | 2 | 6 | 6 |
| CI/CD | 5 | 7 | 7 |
| ERP/ESG | 0 | 8 (Phase 2) | 8 |
| **Total** | **26** | **50** | **50** |

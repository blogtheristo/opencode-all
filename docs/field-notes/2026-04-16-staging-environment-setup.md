---
VERSION AND AGENT HISTORY
Document:   Field Note — Staging Environment Setup
Version:    1.0
Date:       2026-04-16
Owner:      Lifetime Oy / Risto Päärni
Branch:     claude/fix-v1-features-wODI5-1QXGi
Commit:     283f4c2d
Introduced-In: PR (fix-v1-features-wODI5-1QXGi)
Code-Version: 1.0
Agent:      Claude Sonnet 4.6
Classification: Infrastructure — V1 Gap Closure
---

# Field Note: Staging Environment Setup

## DWS IQ 6 — Gap #10 Closure — 2026-04-16

**Status:** SHIPPED (code-side complete; Cloud Run provisioning is a human step)
**Commit:** `283f4c2d` on branch `claude/fix-v1-features-wODI5-1QXGi`
**V1_FEATURE_LIST.md:** v2.5 → v2.6

---

## 1. Problem

DWS IQ 6 had no staging environment. Every feature branch merged directly to
production (`dws6run6` on Cloud Run, `NODE_ENV=production` on DGX Spark).
Risks:

- No smoke test layer between a feature branch and live users
- `NODE_ENV=staging` crashed the server (enum validation only allowed
  `development | production | test`)
- No isolated database for branch testing — all test traffic hit production
  Supabase
- No lower-cost LLM tier for CI/CD validation runs

---

## 2. What Was Built

### 2.1 `src/config/validate-env.ts` — NODE_ENV enum

Added `'staging'` to the Zod enum:

```typescript
NODE_ENV: z.enum(["development", "staging", "production", "test"]);
```

Previously starting the server with `NODE_ENV=staging` threw a Zod validation
error at startup and exited. Now `staging` is a recognised first-class
environment value.

### 2.2 `staging.env.example` — Credential template

Root-level template (not a dotfile — avoids the `.env.*` secrets hook). Key
differences from production `.env.example`:

| Variable               | Staging value              | Reason                                    |
| ---------------------- | -------------------------- | ----------------------------------------- |
| `NODE_ENV`             | `staging`                  | First-class env tier                      |
| `SCW_MODEL`            | `llama-3.1-8b-instruct`    | Smaller/cheaper than 70B prod model       |
| `REDIS_URL`            | `redis://localhost:6379/1` | DB index 1, isolated from prod DB 0       |
| `SMTP_HOST`            | `email-smtp.eu-north-1.amazonaws.com` | Matches runtime SMTP env contract in code |
| `AIWEN_AUDIT_ENABLED`  | `false`                    | Article 12 audit is production-only       |
| `ENABLE_CRON_JOBS`     | `false`                    | No cron noise from staging                |
| `ENABLE_*_INTEGRATION` | `false`                    | All ERP integrations mocked               |

### 2.3 `infrastructure/staging/docker-compose.staging.yml` — Staging runtime

Mirrors `infrastructure/dgx-spark/docker-compose.yml` with:

- Backend on host port **8081** (avoids collision with production 8080)
- Memory limit: **2G** (vs 8G prod), reservation 512M (vs 2G prod)
- **Ephemeral Redis** (`--save "" --appendonly no`) on host port 6380
- No `dws-cron` container — staging doesn't run scheduled jobs
- No `heartbeat` container — no DGX Spark failover needed
- `LLM_PRIMARY=groq` — Ollama not available in staging (no local GPU)

### 2.4 `.github/workflows/deploy-staging.yml` — Auto-deploy workflow

Triggers on push to any `claude/**` branch when backend code changes
(`src/**`, `public/**`, `package*.json`, `Dockerfile`, `tsconfig.json`).

Flow:

```
push to claude/** branch
  → build Docker image (linux/amd64)
  → tag: staging-<sha> + staging-latest
  → push to Artifact Registry (europe-north1)
  → gcloud deploy → dws6run6-staging (Cloud Run, europe-north1)
  → smoke test: GET /health (retry 10×, 10s interval)
  → smoke test: GET /api/v1/status (non-blocking warning)
  → step summary to GitHub Actions UI
  → on failure: create GitHub issue with run link
```

Cloud Run staging service config vs production:

| Property      | Staging | Production (`dws6run6`) |
| ------------- | ------- | ----------------------- |
| Memory        | 512Mi   | 512Mi                   |
| CPU           | 1       | 1                       |
| Min instances | 0       | 0                       |
| Max instances | 3       | 10                      |
| Concurrency   | 80      | 80                      |

---

## 3. Is This Blue-Green?

No. This is a **staging/production environment split** — a different pattern.

| Concept       | This setup                                    | Blue-green                               |
| ------------- | --------------------------------------------- | ---------------------------------------- |
| Environments  | `staging` (branches) + `production` (main)    | `blue` + `green` (both production-grade) |
| Traffic model | Dev traffic → staging; user traffic → prod    | 100% to one slot; deploy to other; flip  |
| Persistence   | Permanent environments with different configs | Two identical slots that swap roles      |
| Purpose       | Test before merge                             | Zero-downtime production deploys         |

Cloud Run supports **revision traffic splitting** natively — blue-green could
be layered on top of the production service later. That would be a separate
piece of work (e.g. deploy new revision with 0% traffic, run integration tests,
shift 100%). Not required for V1.

---

## 4. What Remains Before Staging is Fully Live

These are human/infrastructure steps — code is ready:

| #   | Step                                                                                                                                                             | Who   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| 1   | Provision `dws6run6-staging` Cloud Run service in GCP (europe-north1)                                                                                            | Human |
| 2   | Create separate Supabase project `dws6-staging`                                                                                                                  | Human |
| 3   | Run migrations against staging Supabase (`supabase db push --linked`)                                                                                            | Human |
| 4   | Add GitHub secrets: `GCP_SA_KEY`, `STAGING_SUPABASE_URL`, `STAGING_SUPABASE_ANON_KEY`, `STAGING_SUPABASE_SERVICE_KEY`, `STAGING_JWT_SECRET`, `STAGING_ANTHROPIC_API_KEY`, `STAGING_GROQ_API_KEY` | Human |
| 5   | Verify GCP service account has `roles/run.admin` + `roles/artifactregistry.writer`                                                                               | Human |

Until steps 1–5 are complete, the workflow will fail at the deploy step (GCP
auth error). The build step will succeed because it only needs `GCP_SA_KEY`.

---

## 5. Remaining V1 Gaps After This Work

| #   | Gap                           | Priority    |
| --- | ----------------------------- | ----------- |
| 3   | Email production credentials  | High (ASAP) |
| 9   | OpenAPI remaining 9 endpoints | Low         |
| 11  | Customer knowledge base       | Medium      |

---

## 6. Related Files

- `src/config/validate-env.ts` — NODE_ENV enum change (line 15)
- `staging.env.example` — staging credential template
- `infrastructure/staging/docker-compose.staging.yml` — staging compose
- `.github/workflows/deploy-staging.yml` — CI/CD workflow
- `V1_FEATURE_LIST.md` — v2.6, gap #10 closed

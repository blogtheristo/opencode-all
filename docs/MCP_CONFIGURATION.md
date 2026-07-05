# DWS IQ 6 - MCP Configuration Guide

Practical setup guide for Model Context Protocol (MCP) servers used in `dws6`.

**Last Updated:** May 12, 2026
**Estimated Time:** 10-15 minutes

---

## 1. Overview

This repository uses a **split MCP model by use case**, not one universal default.

| Use case                  | Where it runs          | What belongs there                                                                                   | Config surface                                          |
| ------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Win11 developer MCP**   | Developer workstation  | Local backend `/mcp`, local Python gateway for developer tools, no Docker                            | `.mcp.json.example`, `mcp.dws-local.example.json`       |
| **DWS Hub orchestration** | DGX Spark              | Coordination hub, scheduled flows, long-running automation, session persistence                      | `env.mcp.example` / `.env.mcp`                          |
| **Remote/mobile MCP**     | Hosted HTTP endpoint   | Cloud/mobile access when no local process can run                                                    | `mcp-servers/cloud-run-gateway/mcp-config.example.json` |
| **Google-managed MCP**    | Google Cloud (managed) | First-party MCP for GCP services (BigQuery, Cloud Run, GCS, Maps, Drive, …) — no DWS process to host | `mcp.google-managed.example.json`                       |

**Rule:** Docker-backed MCP no longer belongs on Win11. DGX hosts the hub/orchestration layer. Win11 keeps developer-local MCP only. Where a Google-managed MCP exists for a GCP-native capability (e.g. Cloud Run, BigQuery, Cloud Logging, GCS), prefer it over rebuilding the same capability inside the DWS hub.

### Supabase placement

Supabase is needed in **both** environments, but for different reasons:

| Environment               | Supabase use                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| **Win11 developer**       | Local gateway tools, local backend development, direct testing against real project data |
| **DGX hub**               | Session persistence, daily orchestration flows, automation state, shared runtime memory  |
| **Remote/mobile gateway** | Hosted Supabase MCP tools for mobile/web sessions                                        |

---

## 2. Quick Start

### 2.1 Pick the right profile

#### Win11 developer profile

This is the default for local development on Windows:

```bash
# From repo root
cp .mcp.json.example .mcp.json
```

#### DGX hub profile

This is not a Claude `.mcp.json` profile. It is the orchestration environment:

```bash
cp env.mcp.example .env.mcp
```

#### Remote/mobile profile

Use the hosted gateway example when the client cannot run local processes:

```bash
# Use as reference
type mcp-servers\cloud-run-gateway\mcp-config.example.json
```

#### Google-managed MCP profile

Use this when you want Google Cloud first-party MCP for GCP-native services
(BigQuery, Cloud Run, Cloud Logging, GCS, Maps, Drive, Gmail, Calendar, …).
No local DWS process to host; auth is Cloud IAM rather than a DWS bearer token.

```bash
# Use as reference (copy entries you actually need into .mcp.json)
type mcp.google-managed.example.json
```

See section 4 for the full catalog, IAM setup, and the DWS prefer-Google-managed rule.

### 2.2 Fill in credentials

For **Win11 developer MCP**:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `GITHUB_TOKEN` (optional, only needed for GitHub tool calls from local gateway)

For **DGX hub**:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `DATABASE_URL`
- `MCP_HUB_API_KEY`

For **remote/mobile MCP**:

- `MCP_GATEWAY_URL`
- `MCP_GATEWAY_API_KEY`
- `DWS_MCP_AGENT_URL`
- `DWS_API_TOKEN`

For **Google-managed MCP**:

- `GOOGLE_APPLICATION_CREDENTIALS` (path to a service-account JSON used by the
  client to obtain ID tokens), or run `gcloud auth application-default login`
- `GCP_PROJECT_ID` (defaults the project the MCP servers operate against)
- `GCP_REGION` (default region for region-bound services; DWS default `europe-north1`)

Never paste a long-lived static API key here — Google-managed MCP servers
authenticate the caller via Cloud IAM, not a shared secret.

### 2.3 Verify `.mcp.json` is local-only

```bash
git check-ignore .mcp.json
```

Expected result: `.mcp.json` should be ignored by Git.

---

## 3. Win11 Developer MCP Configuration

These are the MCP servers we recommend enabling by default on Win11.

```json
{
  "mcpServers": {
    "dws-agents-local": {
      "type": "http",
      "url": "http://localhost:3001/mcp"
    },
    "dws-gateway-local": {
      "type": "stdio",
      "command": "python",
      "args": ["mcp-servers/cloud-run-gateway/server.py", "--transport", "stdio"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_SERVICE_KEY": "${SUPABASE_SERVICE_KEY}"
      }
    }
  }
}
```

### 3.1 Win11 developer health check

```bash
npm run diag:mcp
```

### 3.2 DGX hub environment

The DGX hub is configured via environment, not `.mcp.json`:

```bash
cp env.mcp.example .env.mcp
```

Use the DGX hub for:

- scheduled flows in `scripts/daily/`
- orchestration/session persistence
- long-running coordination services

### 3.3 Remote/mobile MCP environment

Use `mcp-servers/cloud-run-gateway/mcp-config.example.json` for hosted HTTP access from mobile/web or when no local process can run.

---

## 4. Google-Managed MCP Servers

As of May 2026, Google Cloud offers 50+ first-party MCP servers (GA + preview)
for its native services. They are MCP-spec compliant and work with Claude
Code, Gemini CLI, ChatGPT, VS Code, LangChain, ADK, and CrewAI.

Source announcement:
<https://cloud.google.com/blog/products/ai-machine-learning/google-managed-mcp-servers-are-available-for-everyone>
Canonical catalog: <https://docs.cloud.google.com/mcp/supported-products>

### 4.1 Why this changes the DWS MCP plan

The DWS MCP hub historically wrapped GCP capabilities (Cloud Run management,
BigQuery queries, GCS access) as DWS-owned MCP servers. Google-managed MCP
removes that need for anything that is a thin pass-through to a Google API.

**DWS prefer-Google-managed rule:** if a capability is a thin pass-through to
a Google service that already has a Google-managed MCP, use the Google-managed
endpoint and remove the DWS-owned wrapper (or mark the wrapper retired). Keep
DWS-owned MCP servers only when they add DWS-specific orchestration, business
logic, EU-sovereign data handling, or cross-service coordination on top of the
raw Google API.

This applies in particular to:

- Cloud Run management (replaces what the retired `cloudrun-mcp` did)
- BigQuery query/analysis
- Cloud Logging / Monitoring read paths
- GCS object access
- Maps Grounding (routing / weather / POI) — replaces ad-hoc Maps glue
- Drive / Gmail / Calendar / People — replaces ad-hoc Google Workspace glue

It does **not** apply to:

- Supabase (not a Google service — keep DWS Supabase MCP)
- DWS agents themselves (`dws_compliance`, `dws_sitesense`, …)
- DGX hub orchestration of `scripts/daily/`, `scripts/weekly/` flows
- LWM training pipeline / GN100 access
- Anything that must stay inside the EU-sovereign data perimeter (see 4.5)

### 4.2 Catalog (subset used by DWS)

Pull the full list from Google's MCP supported-products page; the subset
relevant to current DWS work:

| Category              | Server                           | DWS use case                                                                 |
| --------------------- | -------------------------------- | ---------------------------------------------------------------------------- |
| Infrastructure & Ops  | Cloud Run                        | Deploy / inspect MCP gateway and other GCP services; replaces `cloudrun-mcp` |
| Infrastructure & Ops  | GKE                              | Optional, only if GKE workloads appear                                       |
| Infrastructure & Ops  | Cloud Logging                    | Read service logs without scripting `gcloud logging read`                    |
| Infrastructure & Ops  | Cloud Monitoring                 | Read latency / error metrics during incidents                                |
| Infrastructure & Ops  | Google Security Operations       | Threat investigation (Chronicle); strictly read paths                        |
| Databases & Analytics | BigQuery                         | Emissions/dataset queries when datasets live in BigQuery                     |
| Databases & Analytics | Cloud SQL                        | Only when a workload is not on Supabase                                      |
| Databases & Analytics | Spanner / Bigtable / Firestore   | Reserved for future workloads                                                |
| Storage               | Google Cloud Storage             | Read/write GCS objects (e.g. LWM checkpoints, exported reports)              |
| Storage / Catalog     | Dataplex Knowledge Catalog       | Contextual data discovery if/when we adopt Dataplex                          |
| Streaming             | Pub/Sub                          | Event ingestion when GCP-side                                                |
| Maps & Grounding      | Maps Grounding Lite              | Routing, weather, POI for SiteSense / construction agents                    |
| Workspace             | Gmail / Drive / Calendar         | Lifetime Oy back-office automations (read-only first)                        |
| AI Platform           | Gemini Enterprise Agent Platform | Model + agent lifecycle (informational; we run Claude/Groq primarily)        |

### 4.3 Authentication

Google-managed MCP servers authenticate with **Cloud IAM**, not a DWS bearer
token or static API key. The client must present a Google identity token
signed for the MCP server's audience.

Two common ways to provide that identity:

```bash
# Option A — service account JSON via env (good for CI / DGX)
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/sa.json

# Option B — user creds via Application Default Credentials (good for Win11 dev)
gcloud auth application-default login
```

DWS guardrails:

- Grant the minimum role set per service (e.g. `roles/run.viewer`,
  `roles/bigquery.dataViewer`) and prefer Deny policies on destructive actions.
- Never put a Google service-account JSON content into `.mcp.json` — reference
  the file via `GOOGLE_APPLICATION_CREDENTIALS` instead.
- Do not commit `.mcp.json`; the existing gitignore rule in section 7 already
  covers this.
- For the DGX hub, the existing GCP service account used by `cloudrun-mcp`
  can be reused after granting the Google-managed MCP audiences.

### 4.4 Wiring into a client

Reference config lives in `mcp.google-managed.example.json` at the repo root.
Typical entry shape (the exact server URLs come from Google's catalog and
should not be hand-edited here; copy them from the Google docs page):

```json
{
  "mcpServers": {
    "google-cloud-run": {
      "type": "http",
      "url": "https://<managed-cloud-run-mcp-endpoint>/mcp",
      "headers": {
        "Authorization": "Bearer ${GOOGLE_ID_TOKEN}"
      }
    },
    "google-bigquery": {
      "type": "http",
      "url": "https://<managed-bigquery-mcp-endpoint>/mcp",
      "headers": {
        "Authorization": "Bearer ${GOOGLE_ID_TOKEN}"
      }
    }
  }
}
```

The `${GOOGLE_ID_TOKEN}` env should be populated at session start by a small
helper (e.g. `gcloud auth print-identity-token --audiences=...`). Do not
hardcode tokens.

### 4.5 Sovereignty and EU data perimeter

Google-managed MCP is **not automatically EU-sovereign**. Before pointing a
Google-managed MCP at data that falls under our CLOUD-Act-out / sovereignty
posture (see `docs/Deputy-Agents-Architecture.md` and the `sovereignty-assess`
skill), confirm:

1. The target GCP service is configured in an EU region (default `europe-north1`).
2. The service supports EU data-residency commitments for our tier.
3. The MCP traffic does not cause data to leave the EU perimeter (e.g. Maps
   Grounding Lite responses can route via non-EU endpoints — keep it for
   non-sensitive routing context, not for processing customer PII).
4. Customer / PII workloads stay on Supabase / DWS hub paths, not on
   Google-managed MCP.

When in doubt, route the data flow through the DWS hub (which is
EU-sovereign by construction) and call Google-managed MCP only with
non-sensitive inputs.

### 4.6 Migration plan for DWS-owned wrappers

| DWS-owned MCP (status)                             | Google-managed replacement                                             | Action                                                                                                                                                  |
| -------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudrun-mcp` (already retired, see 2026-02 note) | Cloud Run MCP                                                          | Use Google-managed; do not resurrect `cloudrun-mcp`.                                                                                                    |
| `mcp-servers/cloud-run-gateway` (active)           | Partial — keep for Supabase + DWS-agent surface, drop GCP passthroughs | Narrow scope to Supabase + DWS agents + GitHub. Anything that is a thin GCP API call should move to the Google-managed equivalent in the client config. |
| Ad-hoc BigQuery glue in `scripts/`                 | BigQuery MCP                                                           | New work goes to BigQuery MCP; do not add new glue scripts.                                                                                             |
| Ad-hoc Maps / weather glue in SiteSense            | Maps Grounding Lite MCP                                                | Route via Maps Grounding Lite MCP when the agent runs in a Claude / Gemini session with MCP access.                                                     |

This is a non-breaking migration: existing `cloud-run-gateway` deployments
continue to work; new capabilities should prefer Google-managed.

---

## 5. Legacy Reference: Older Catalog and Local Options

These sections are kept for historical context and narrow dev workflows. They are not the default setup anymore.

### 5.1 GitHub

**Why it matters here**

This repo already relies heavily on GitHub-centric automation:

- AI PR review
- PR auto-merge
- weekly reporting via issues and PR queries
- CI and workflow monitoring

Use the built-in GitHub MCP in Claude Code when you want the agent to work directly with GitHub objects instead of relying on browser/manual review steps.

**Current guidance**

- In Claude Code, GitHub MCP is built in — do **not** add a manual `.mcp.json` package entry.
- Use GitHub OAuth, not personal access tokens in `.mcp.json`.
- If a non-Claude client needs GitHub MCP, use that client's current official GitHub MCP integration instructions rather than old package snippets from this repo.

### 5.2 Docker Hub

**Why it matters here**

Use `Docker Hub` when you need:

- image discovery
- repository and tag inspection
- Docker Hardened Images lookup
- Docker Hub namespace/repository management

This is useful for supply-chain work, but it is **not** currently the primary deployment path for `dws6`.

**Current guidance**

- Treat Docker Hub MCP as an external catalog integration.
- Use the provider's current Docker Desktop MCP catalog entry or official setup docs.
- Do not rely on the old `mcp/dockerhub` package string in repository docs.

### 5.3 Cloud Run

**Why it matters here**

Use `Cloud Run` when you are actively deploying or debugging GCP-hosted services. This is useful for DWS cloud experimentation and future hosted MCP work, even though the repo's main deployment workflow currently targets Scaleway.

**Current guidance**

- Prefer the Google-managed Cloud Run MCP (section 4). It is the maintained
  path and replaces both the retired DWS `cloudrun-mcp` and the old
  `mcp/cloud-run-mcp` community package.
- Do not rely on the old `mcp/cloud-run-mcp` package name in repository docs.
- In this repo, Cloud Run is mostly relevant for hosted MCP gateway deployment and legacy transition work.

### 5.5 Cloudflare Developer Platform

**Status:** live as a built-in Claude Code connector (confirmed 2026-07-03) — no `.mcp.json` entry needed.

**Why it matters here**

`dws6.com`, `dws10.com`, `onelifetime.world`, and `lifetime.fi` all deploy to Cloudflare Pages, and `dws10.com`'s hybrid Revolut+Stripe payment flow runs a Cloudflare Worker (`dws-revolut-checkout`). Before this connector went live, Cloudflare's actual account state (Workers, KV, R2, D1, Hyperdrive) was only inferable from `wrangler.toml` and deploy workflow files — never queried directly. Live-querying it once (2026-07-03) already found one Worker, `dws-revolut-checkout`, that wasn't in `docs/BUSINESS_CRITICAL_SYSTEMS.md` — added there and to the `Vesta` agent's registry in the same session.

**Current guidance**

- Use it for read-only discovery (`workers_list`, `kv_namespaces_list`, `r2_buckets_list`, `d1_databases_list`, `hyperdrive_configs_list`, `workers_get_worker_code`) to verify the live account state against what's documented in `docs/BUSINESS_CRITICAL_SYSTEMS.md`.
- Treat any create/delete/edit tool (`*_create`, `*_delete`, `hyperdrive_config_edit`) as requiring the same confirm-before-acting discipline as any other production-infrastructure change — these are not read-only.
- As of 2026-07-03: 1 Worker (`dws-revolut-checkout`), 0 KV namespaces, 0 D1 databases, 0 Hyperdrive configs, R2 not enabled on the account (dashboard-gated, not an MCP permission issue).
- Re-run the discovery tools whenever `docs/BUSINESS_CRITICAL_SYSTEMS.md`'s Cloudflare rows are reviewed (see that document's Review cadence section) instead of re-inferring from config files.

### 5.4 Docker Desktop note

If you are on Docker Desktop `4.43+`, the easiest path is to add these servers through the MCP Toolkit / catalog UI and then let Docker Desktop generate the config for you.

Use the committed `.mcp.json.example` as:

- a repo-level starting point
- a fallback when you want explicit file-based config
- a reference for worktree copies

---

## 6. Optional DWS-Local and DGX Services

These services are repo-specific and should be documented separately from the official Docker catalog MCPs.

Use the committed example file `mcp.dws-local.example.json` when you want this local stack as your starting point.

### 6.1 DWS Carbon API

This is a **local DWS wrapper** running on `localhost:8766`. It is useful for local carbon/compliance and table operations, but it is not the same thing as the official Supabase MCP.

```json
{
  "mcpServers": {
    "DWS Carbon API": {
      "_type": "rest-api",
      "_container": "dws-carbon-api",
      "_endpoints": {
        "query": "POST http://localhost:8766/tools/query",
        "insert": "POST http://localhost:8766/tools/insert",
        "log_activity": "POST http://localhost:8766/tools/log_agent_activity",
        "health": "GET http://localhost:8766/health"
      }
    }
  }
}
```

**Live OpenAPI contract observed on Mar 11, 2026:**

- `POST /tools/query`
- body: `table` required
- optional: `select`, `filters`, `limit`
- `POST /tools/insert`
- body: `table` required
- body: `data` required
- `POST /tools/log_agent_activity`
- body: `agent_name`, `task`, `status`

Example query payload:

```json
{
  "table": "projects",
  "select": "*",
  "limit": 10
}
```

Example insert payload:

```json
{
  "table": "projects",
  "data": {
    "name": "Example Project",
    "status": "green"
  }
}
```

**Important:** This local API is **not** a raw SQL endpoint. Sending a body like `{ "query": "CREATE TABLE ..." }` will fail validation because `/tools/query` expects `table`, not SQL text.

For schema migrations such as `supabase/migrations/042_projects_dashboard.sql`, use:

1. Supabase SQL Editor
2. a migration runner that supports raw SQL

Use the local API for verification, reads, inserts, and logging after the schema exists.

**Placement**

- DGX / containerized environments only
- Not a Win11 developer default after the Clawdbot Docker removal

### 6.2 Supabase Official

Use this when you want the **real Supabase MCP** outside the built-in DWS local gateway.

Example MCP config:

```json
{
  "mcpServers": {
    "Supabase Official": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_SERVICE_KEY": "${SUPABASE_SERVICE_KEY}"
      }
    }
  }
}
```

**Placement**

- Win11 developer: local gateway usually enough
- DGX hub: direct Supabase env access for orchestration/session persistence
- External MCP client: use `@supabase/mcp-server-supabase` when you need a standalone Supabase MCP

### 6.3 Redis MCP

Use this for cache/session inspection when Redis access is relevant to the task:

```json
{
  "mcpServers": {
    "Redis MCP": {
      "command": "npx",
      "args": ["-y", "@upstash/redis-mcp@latest"],
      "env": {
        "REDIS_URL": "redis://user:password@host:port"
      }
    }
  }
}
```

### 6.4 MCP Hub

The DWS MCP Hub is the internal coordination layer for multi-agent workflows and should live on DGX, not on Win11 developer Docker:

```json
{
  "mcpServers": {
    "MCP Hub": {
      "_type": "coordination-hub",
      "_port": 8765,
      "_endpoints": {
        "hub": "http://localhost:8765"
      }
    }
  }
}
```

Use it for DGX-hosted orchestration flows, scheduled automation, and shared runtime coordination. It is not the default Win11 developer MCP profile.

If you need both layers, merge the entries from `.mcp.json.example` and `mcp.dws-local.example.json` into your local `.mcp.json`.

---

## 7. Workflow Mapping

The current GitHub Actions setup explains which MCPs matter most.

### 7.1 Highest-value GitHub integration

These workflows are the clearest match:

- `ai-pr-review.yml`
- `pr-auto-merge.yml`
- `weekly-report.yml`
- `security-check-pr.yml`
- `dependency_review.yml`

If you are choosing only one GitHub integration in Claude Code, use the built-in GitHub MCP via OAuth.

### 7.2 Useful but secondary: Docker Hub

Best fit for:

- image lookup during deployment work
- registry/repository inspection
- hardened image checks
- container supply-chain exploration

### 7.3 Useful but situational: Cloud Run (Google-managed)

Best fit for:

- GCP service deployment
- service inspection and logs
- future DWS hosted MCP / agent infrastructure

Current note: the tracked deployment workflow in this repo is `deploy-scaleway.yml`, so `Cloud Run` is additive rather than the default deployment path today. When you do need it, use the Google-managed Cloud Run MCP (section 4) rather than a self-hosted wrapper.

---

## 8. Security Rules

### 8.1 Keep secrets out of Git

| File                | Rule                    |
| ------------------- | ----------------------- |
| `.mcp.json`         | local only, gitignored  |
| `.mcp.json.example` | committed template only |
| `.env.mcp`          | local only, gitignored  |
| `env.mcp.example`   | committed template only |

### 8.2 Least privilege

- Use the smallest GitHub token scope set that still supports your workflow.
- Use a dedicated Docker Hub PAT, not your password.
- Use Google Cloud credentials with the minimum required project access.
  For Google-managed MCP, prefer per-service viewer roles plus Deny policies
  on destructive actions (delete, terminate, drop).
- Keep DWS-local admin credentials in `.env` or external secret storage, never in committed config.

### 8.3 Worktrees

Gitignored MCP files are **not** shared automatically between worktrees.

Preferred workflow:

```bash
./scripts/new-claude-worktree.sh feature-branch
```

Or on Windows:

```powershell
.\scripts\New-ClaudeWorktree.ps1 -BranchName "feature-branch"
```

These scripts are responsible for copying `.mcp.json` into the new worktree when present.

---

## 9. Troubleshooting

### 9.1 Claude Code does not see MCP servers

Check:

1. `.mcp.json` exists in the current repo or worktree root.
2. Docker Desktop is running.
3. The referenced credentials and mounted paths are valid.
4. Claude Code was restarted after changing the config.

### 9.2 DWS Carbon API is unreachable

```bash
docker ps --filter "name=dws-carbon-api"
docker logs dws-carbon-api
curl http://127.0.0.1:8766/health
```

### 9.3 Worktree has no MCP tools

Most common cause: `.mcp.json` was never copied into that worktree.

Fix:

1. Copy the local `.mcp.json` into the worktree root.
2. Restart Claude Code in that worktree.
3. Prefer the automated worktree scripts next time.

---

## 10. Bottom Line

For `dws6`, the recommended order is:

1. `GitHub Official` (built into Claude Code via OAuth)
2. Google-managed MCP for any GCP-native capability you need
   (Cloud Run, BigQuery, Cloud Logging, GCS, Maps Grounding Lite, …)
3. DWS local gateway (`dws-gateway-local`) for Supabase + DWS-agent surface
4. `Docker Hub` for image discovery / supply-chain work
5. Add DWS-local `DWS Carbon API`, `Supabase Official (Docker)`, `Redis MCP`, and `MCP Hub` only when your task actually needs them

This keeps the default setup aligned with the official Docker catalog while preserving the repo-specific local services as an optional second layer.

---

**Document Version:** 2.1  
**Created:** February 5, 2026  
**Last Updated:** May 12, 2026  
**Author:** DWS IQ Team

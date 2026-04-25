# DWS IQ 6 - MCP Configuration Guide

Practical setup guide for Model Context Protocol (MCP) servers used in `dws6`.

**Last Updated:** March 11, 2026  
**Estimated Time:** 10-15 minutes

---

## 1. Overview

This repository uses a **split MCP model by use case**, not one universal default.

| Use case | Where it runs | What belongs there | Config surface |
|--------|---------|----------------|----------------|
| **Win11 developer MCP** | Developer workstation | Local backend `/mcp`, local Python gateway for developer tools, no Docker | `.mcp.json.example`, `mcp.dws-local.example.json` |
| **DWS Hub orchestration** | DGX Spark | Coordination hub, scheduled flows, long-running automation, session persistence | `env.mcp.example` / `.env.mcp` |
| **Remote/mobile MCP** | Hosted HTTP endpoint | Cloud/mobile access when no local process can run | `mcp-servers/cloud-run-gateway/mcp-config.example.json` |

**Rule:** Docker-backed MCP no longer belongs on Win11. DGX hosts the hub/orchestration layer. Win11 keeps developer-local MCP only.

### Supabase placement

Supabase is needed in **both** environments, but for different reasons:

| Environment | Supabase use |
|------------|--------------|
| **Win11 developer** | Local gateway tools, local backend development, direct testing against real project data |
| **DGX hub** | Session persistence, daily orchestration flows, automation state, shared runtime memory |
| **Remote/mobile gateway** | Hosted Supabase MCP tools for mobile/web sessions |

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
      "url": "http://localhost:8080/mcp"
    },
    "dws-gateway-local": {
      "type": "stdio",
      "command": "python",
      "args": [
        "mcp-servers/cloud-run-gateway/server.py",
        "--transport",
        "stdio"
      ],
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

## 4. Legacy Reference: Older Catalog and Local Options

These sections are kept for historical context and narrow dev workflows. They are not the default setup anymore.
### 4.1 GitHub

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

### 4.2 Docker Hub

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

### 4.3 Cloud Run

**Why it matters here**

Use `Cloud Run` when you are actively deploying or debugging GCP-hosted services. This is useful for DWS cloud experimentation and future hosted MCP work, even though the repo’s main deployment workflow currently targets Scaleway.

**Current guidance**

- Use Google Cloud CLI plus the provider's current Cloud Run MCP integration instructions.
- Do not rely on the old `mcp/cloud-run-mcp` package name in repository docs.
- In this repo, Cloud Run is mostly relevant for hosted MCP gateway deployment and legacy transition work.

### 4.4 Docker Desktop note

If you are on Docker Desktop `4.43+`, the easiest path is to add these servers through the MCP Toolkit / catalog UI and then let Docker Desktop generate the config for you.

Use the committed `.mcp.json.example` as:

- a repo-level starting point
- a fallback when you want explicit file-based config
- a reference for worktree copies

---

## 5. Optional DWS-Local and DGX Services

These services are repo-specific and should be documented separately from the official Docker catalog MCPs.

Use the committed example file `mcp.dws-local.example.json` when you want this local stack as your starting point.

### 5.1 DWS Carbon API

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

### 5.2 Supabase Official

Use this when you want the **real Supabase MCP** outside the built-in DWS local gateway.

Example MCP config:

```json
{
  "mcpServers": {
    "Supabase Official": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest"
      ],
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

### 5.3 Redis MCP

Use this for cache/session inspection when Redis access is relevant to the task:

```json
{
  "mcpServers": {
    "Redis MCP": {
      "command": "npx",
      "args": [
        "-y",
        "@upstash/redis-mcp@latest"
      ],
      "env": {
        "REDIS_URL": "redis://user:password@host:port"
      }
    }
  }
}
```

### 5.4 MCP Hub

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

## 6. Workflow Mapping

The current GitHub Actions setup explains which MCPs matter most.

### 6.1 Highest-value GitHub integration

These workflows are the clearest match:

- `ai-pr-review.yml`
- `pr-auto-merge.yml`
- `weekly-report.yml`
- `security-check-pr.yml`
- `dependency_review.yml`

If you are choosing only one GitHub integration in Claude Code, use the built-in GitHub MCP via OAuth.

### 6.2 Useful but secondary: Docker Hub

Best fit for:

- image lookup during deployment work
- registry/repository inspection
- hardened image checks
- container supply-chain exploration

### 6.3 Useful but situational: Cloud Run

Best fit for:

- GCP service deployment
- service inspection and logs
- future DWS hosted MCP / agent infrastructure

Current note: the tracked deployment workflow in this repo is `deploy-scaleway.yml`, so `Cloud Run` is additive rather than the default deployment path today.

---

## 7. Security Rules

### 6.1 Keep secrets out of Git

| File | Rule |
|------|------|
| `.mcp.json` | local only, gitignored |
| `.mcp.json.example` | committed template only |
| `.env.mcp` | local only, gitignored |
| `env.mcp.example` | committed template only |

### 6.2 Least privilege

- Use the smallest GitHub token scope set that still supports your workflow.
- Use a dedicated Docker Hub PAT, not your password.
- Use Google Cloud credentials with the minimum required project access.
- Keep DWS-local admin credentials in `.env` or external secret storage, never in committed config.

### 6.3 Worktrees

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

## 8. Troubleshooting

### 7.1 Claude Code does not see MCP servers

Check:

1. `.mcp.json` exists in the current repo or worktree root.
2. Docker Desktop is running.
3. The referenced credentials and mounted paths are valid.
4. Claude Code was restarted after changing the config.

### 7.2 DWS Carbon API is unreachable

```bash
docker ps --filter "name=dws-carbon-api"
docker logs dws-carbon-api
curl http://127.0.0.1:8766/health
```

### 7.3 Worktree has no MCP tools

Most common cause: `.mcp.json` was never copied into that worktree.

Fix:

1. Copy the local `.mcp.json` into the worktree root.
2. Restart Claude Code in that worktree.
3. Prefer the automated worktree scripts next time.

---

## 8. Bottom Line

For `dws6`, the recommended order is:

1. `GitHub Official`
2. `Docker Hub`
3. `Cloud Run`
4. Add DWS-local `DWS Carbon API`, `Supabase Official (Docker)`, `Redis MCP`, and `MCP Hub` only when your task actually needs them

This keeps the default setup aligned with the official Docker catalog while preserving the repo-specific local services as an optional second layer.

---

**Document Version:** 2.0  
**Created:** February 5, 2026  
**Last Updated:** March 11, 2026  
**Author:** DWS IQ Team

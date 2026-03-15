# DWS IQ 6 - MCP Configuration Guide

Practical setup guide for Model Context Protocol (MCP) servers used in `dws6`.

**Last Updated:** March 11, 2026  
**Estimated Time:** 10-15 minutes

---

## 1. Overview

This repository now uses a **two-tier MCP model**:

1. **Official Docker catalog MCPs**: the default layer for day-to-day development.
2. **DWS-local services**: optional repo-specific integrations that run on localhost or inside the project Docker stack.

This split matters because the official Docker catalog servers are standard MCP servers, while some DWS-local integrations are local wrappers or internal services. They should not be documented as if they were the same thing.

### Recommended default MCPs

The default `dws6` stack is based on the three official Docker catalog servers already identified in Docker MCP Search:

| Server | Tools | Best use in `dws6` |
|--------|-------|--------------------|
| `GitHub Official` | 40 | PRs, issues, workflow status, code search, repository automation |
| `Docker Hub` | 13 | Image discovery, repository/tag inspection, Docker Hardened Images |
| `Cloud Run` | 8 | GCP/Cloud Run deployment and debugging workflows |

### Optional DWS-local services

These are still useful, but they are **not** the default public MCP layer:

| Service | Type | Purpose |
|---------|------|---------|
| `DWS Carbon API` | local REST wrapper | Carbon/compliance query, insert, and activity logging via local container |
| `Supabase Official (Docker)` | dockerized stdio MCP | Official Supabase MCP tools via Docker image |
| `Redis MCP` | external/local MCP | Cache and session inspection |
| `MCP Hub` | local DWS service | Multi-agent coordination and orchestration |

---

## 2. Quick Start

### 2.1 Copy the template

```bash
# From repo root
cp .mcp.json.example .mcp.json
```

If you want the repo-specific local services instead of the default Docker catalog set, start from:

```bash
cp mcp.dws-local.example.json .mcp.json
```

### 2.2 Fill in credentials

Edit `.mcp.json` and replace the placeholder values:

- `GITHUB_PERSONAL_ACCESS_TOKEN`
- `HUB_PAT_TOKEN`
- Docker Hub username
- Google Cloud application default credentials path

### 2.3 Verify `.mcp.json` is local-only

```bash
git check-ignore .mcp.json
```

Expected result: `.mcp.json` should be ignored by Git.

---

## 3. Tier 1: Official Docker Catalog MCPs

These are the MCP servers we recommend enabling by default in `dws6`.

### 3.1 GitHub Official

**Why it matters here**

This repo already relies heavily on GitHub-centric automation:

- AI PR review
- PR auto-merge
- weekly reporting via issues and PR queries
- CI and workflow monitoring

Use `GitHub Official` when you want the agent to work directly with GitHub objects instead of relying on browser/manual review steps.

**Template entry**

```json
{
  "mcpServers": {
    "GitHub Official": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_personal_access_token_here"
      }
    }
  }
}
```

**Credential**

- Personal access token with the scopes required for the GitHub operations you intend to run

### 3.2 Docker Hub

**Why it matters here**

Use `Docker Hub` when you need:

- image discovery
- repository and tag inspection
- Docker Hardened Images lookup
- Docker Hub namespace/repository management

This is useful for supply-chain work, but it is **not** currently the primary deployment path for `dws6`.

**Template entry**

```json
{
  "mcpServers": {
    "Docker Hub": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "HUB_PAT_TOKEN",
        "mcp/dockerhub",
        "--transport=stdio",
        "--username=your-dockerhub-username"
      ],
      "env": {
        "HUB_PAT_TOKEN": "your_docker_hub_pat_here"
      }
    }
  }
}
```

**Credentials**

- Docker Hub username
- Docker Hub personal access token

### 3.3 Cloud Run

**Why it matters here**

Use `Cloud Run` when you are actively deploying or debugging GCP-hosted services. This is useful for DWS cloud experimentation and future hosted MCP work, even though the repo’s main deployment workflow currently targets Scaleway.

**Template entry**

```json
{
  "mcpServers": {
    "Cloud Run": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GOOGLE_APPLICATION_CREDENTIALS",
        "-v",
        "C:/Users/you/.config/gcloud:/gcloud",
        "mcp/cloud-run-mcp"
      ],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "/gcloud/application_default_credentials.json"
      }
    }
  }
}
```

**Credential**

- Local Google Cloud application default credentials file mounted into the container

### 3.4 Docker Desktop note

If you are on Docker Desktop `4.43+`, the easiest path is to add these servers through the MCP Toolkit / catalog UI and then let Docker Desktop generate the config for you.

Use the committed `.mcp.json.example` as:

- a repo-level starting point
- a fallback when you want explicit file-based config
- a reference for worktree copies

---

## 4. Tier 2: Optional DWS-Local Services

These services are repo-specific and should be documented separately from the official Docker catalog MCPs.

Use the committed example file `mcp.dws-local.example.json` when you want this local stack as your starting point.

### 4.1 DWS Carbon API

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

Start it with:

```bash
docker-compose -f docker-compose.hybrid.yml up -d carbon-api
```

### 4.2 Supabase Official (Docker)

Use this when you want the **real Supabase MCP** in Docker via stdio transport.

Build the local image:

```bash
docker build -t dws6-supabase-official-mcp:latest ./mcp-servers/supabase-official
```

Example MCP config:

```json
{
  "mcpServers": {
    "Supabase Official (Docker)": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "SUPABASE_ACCESS_TOKEN",
        "-e",
        "SUPABASE_PROJECT_REF",
        "dws6-supabase-official-mcp:latest"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_your_personal_access_token_here",
        "SUPABASE_PROJECT_REF": "kpucuwwfhuwurdxyjjtz"
      }
    }
  }
}
```

Use `SUPABASE_ACCESS_TOKEN` (personal access token) and `SUPABASE_PROJECT_REF` for the official server.

### 4.3 Redis MCP

Use this for cache/session inspection when Redis access is relevant to the task:

```json
{
  "mcpServers": {
    "Redis MCP": {
      "command": "npx",
      "args": [
        "-y",
        "@anthropic/redis-mcp@latest"
      ],
      "env": {
        "REDIS_URL": "redis://user:password@host:port"
      }
    }
  }
}
```

### 4.3 MCP Hub

The DWS MCP Hub is the internal coordination layer for multi-agent workflows:

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

Use it when you are testing repo-specific orchestration flows, not as a replacement for the official Docker catalog servers.

If you need both layers, merge the entries from `.mcp.json.example` and `mcp.dws-local.example.json` into your local `.mcp.json`.

---

## 5. Workflow Mapping

The current GitHub Actions setup explains which MCPs matter most.

### 5.1 Highest-value MCP: GitHub Official

These workflows are the clearest match:

- `ai-pr-review.yml`
- `pr-auto-merge.yml`
- `weekly-report.yml`
- `security-check-pr.yml`
- `dependency_review.yml`

If you are choosing only one MCP to enable first, enable `GitHub Official`.

### 5.2 Useful but secondary: Docker Hub

Best fit for:

- image lookup during deployment work
- registry/repository inspection
- hardened image checks
- container supply-chain exploration

### 5.3 Useful but situational: Cloud Run

Best fit for:

- GCP service deployment
- service inspection and logs
- future DWS hosted MCP / agent infrastructure

Current note: the tracked deployment workflow in this repo is `deploy-scaleway.yml`, so `Cloud Run` is additive rather than the default deployment path today.

---

## 6. Security Rules

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

## 7. Troubleshooting

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

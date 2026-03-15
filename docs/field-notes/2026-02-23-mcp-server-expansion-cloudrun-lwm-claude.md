# MCP Server Expansion: CloudRun, LWM, Claude Session Sync

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.0 | Tool: GitHub Copilot (Claude Sonnet 4.6) | Session: claude/zealous-mcclintock | Date: 23.02.2026 | Changes: Initial field note — MCP server expansion (cloudrun-mcp 8769, lwm-mcp 8770, claude-mcp 8771), Supabase session sync migration 033
  - Version: 1.1 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/ecstatic-murdock | Date: 07.03.2026 | Changes: Fix schema docs to match migration, add auth docs, update next steps, renumber migration to 042, fix REPO_PATH/HANDOFF_FILE contract, add discard platform gate

Session Links & References:
  - GitHub branch: https://github.com/blogtheristo/dws6/tree/claude/zealous-mcclintock

Document Status:
  - Created: 23.02.2026
  - Last Modified: 07.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Classification: INTERNAL
  - Document Type: Architecture Field Note / Infrastructure

Related Documents:
  - Admin/ADMIN_MANUAL.md (v2.3 — MCP Configuration section)
  - supabase/migrations/042_mcp_session_sync.sql
  - docker-compose.hybrid.yml
  - mcp-hub/server.py
  - mcp-servers/cloudrun/
  - mcp-servers/lwm/
  - mcp-servers/claude/

***

## Executive Summary

Three new MCP (Model Context Protocol) servers were added to the DWS IQ 6 platform on 23 February 2026, completing the MCP fleet to 6 servers. A new Supabase migration (`042_mcp_session_sync.sql`) adds persistent session state tables, enabling cross-session continuity for AI agents operating across the multi-server cluster. All servers use Bearer token auth via `MCP_HUB_API_KEY` (matching the mcp-hub pattern).

**Impact:** MCP coverage now spans Cloud infrastructure (GCP), edge AI hardware (NVIDIA GN100/Jetson), and Claude Code coding agents — creating a complete development + operations + training loop.

---

## Problem Statement

Prior to this expansion, the MCP Hub only had direct access to Supabase. Three critical infrastructure domains lacked MCP coverage:

1. **GCP Cloud Run** — Container deployments required manual CLI intervention; no agent-accessible management plane
2. **LWM training pipeline** — The NVIDIA GN100 server (MLflow, checkpoints, GCS) was isolated from agent workflows
3. **Claude Code sessions** — No mechanism for cross-session state handover; conversation summaries were manual

---

## Architecture: MCP Fleet After Expansion

```
MCP Hub (FastAPI, port 8765)
│
├── supabase-mcp    (:8766) — Supabase DB, auth, realtime
├── cloudrun-mcp    (:8769) — GCP Cloud Run management ← NEW
├── lwm-mcp         (:8770) — Lifetime World Model / NVIDIA GN100 ← NEW
└── claude-mcp      (:8771) — Claude Code session sync, git tools ← NEW
```

### CloudRun MCP (Port 8769)

**Purpose:** Programmatic management of Google Cloud Run services from within AI agent workflows.

**Capabilities:**
- Deploy, list, describe Cloud Run services via GCP SDK
- Read container logs (last N lines), tail streaming logs
- Trigger CI/CD builds programmatically
- Get service URL and revision history

**Env vars required:** `GCP_PROJECT_ID`, `GCP_REGION` (default: `europe-north1`), `GOOGLE_APPLICATION_CREDENTIALS_JSON`

**Dockerfile:** `python:3.11-slim`, EXPOSE 8769, healthcheck via curl

### LWM MCP (Port 8770)

**Purpose:** Interface to the Lifetime World Model training pipeline running on the NVIDIA GN100 server.

**Capabilities:**
- Query MLflow experiment runs and metrics
- Submit new training jobs (fine-tuning, LoRA adapters)
- Read/write model checkpoints from GCS bucket
- Monitor NVIDIA GPU utilization on Jetson hardware

**Env vars required:** `GN100_HOST`, `GN100_PORT` (default: `8890`), `MLFLOW_URL`, `GCS_CHECKPOINTS_BUCKET`, `LWM_MCP_PORT` (default: `8770`)

**Dockerfile:** `python:3.11-slim`, EXPOSE 8770, healthcheck via curl

### Claude MCP (Port 8771)

**Purpose:** Session state synchronization and git repository tools for Claude Code agents.

**Capabilities:**
- Persist session checkpoints to Supabase `mcp_sessions` table
- Resume from checkpoint: restore branch context, tool state, last summary
- Git operations: `git log`, `git diff`, `git status` scoped to mounted `/repo`
- Read file trees and search code within the mounted repository

**Env vars required:** `CLAUDE_MCP_PORT` (default: `8771`), `CLAUDE_MCP_PLATFORM`, `REPO_PATH` (default: `/repo`)

**Dockerfile:** `python:3.11-slim` + `git` installed, EXPOSE 8771, `VOLUME ["/repo"]`, healthcheck via curl. The `/repo` volume is bound to `.:/repo` in docker-compose.

---

## Database: Supabase Migration 042

Migration file: `supabase/migrations/042_mcp_session_sync.sql`

### Tables Created

**`mcp_sessions`** — Agent session checkpoint store
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `branch` | text NOT NULL | Git branch the session was on |
| `tool` | text NOT NULL CHECK | `win11` / `mobile` / `vscode` / `cli` / `chromebook` |
| `checkpoint` | jsonb | Todos, files_modified, next_action, notes |
| `summary` | text | Set on session close |
| `closed_at` | timestamptz | null = session still open |
| `created_at` | timestamptz NOT NULL | Auto-set to NOW() |

**`mcp_migration_queue`** — Migration number authority across platforms
| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `migration_number` | integer UNIQUE NOT NULL | Assigned atomically via sequence |
| `filename` | text NOT NULL | SQL filename |
| `sql` | text NOT NULL | Full SQL content |
| `author_tool` | text NOT NULL | Platform that queued it |
| `author_branch` | text NOT NULL | Branch it was queued from |
| `status` | text NOT NULL | `pending` / `applied` / `discarded` |
| `supabase_applied` | boolean | Whether Supabase CLI ran it |
| `applied_by` | text | Server-assigned platform (win11) |
| `applied_at` | timestamptz | When it was applied |
| `notes` | text | Free-form notes |
| `created_at` | timestamptz NOT NULL | Auto-set to NOW() |

**Sequence:** `mcp_migration_number_seq` (starts at 43) for atomic numbering.
**RPC:** `next_migration_number()` returns next integer from sequence.
**RLS Policy:** Both tables use `service_role` access only — no public/anon reads/writes.

---

## docker-compose.hybrid.yml Changes

Three new service blocks added:

```yaml
cloudrun-mcp:
  build: ./mcp-servers/cloudrun
  ports: ["8769:8769"]
  environment:
    - GCP_PROJECT_ID=${GCP_PROJECT_ID}
    - GCP_REGION=${GCP_REGION:-europe-north1}
    - CLOUDRUN_MCP_PORT=8769
  restart: unless-stopped

lwm-mcp:
  build: ./mcp-servers/lwm
  ports: ["8770:8770"]
  environment:
    - GN100_HOST=${GN100_HOST}
    - GN100_PORT=${GN100_PORT:-8890}
    - MLFLOW_URL=${MLFLOW_URL}
    - GCS_CHECKPOINTS_BUCKET=${GCS_CHECKPOINTS_BUCKET}
    - LWM_MCP_PORT=8770
  restart: unless-stopped

claude-mcp:
  build: ./mcp-servers/claude
  ports: ["8771:8771"]
  volumes:
    - ./.claude/handoff.md:/handoff/handoff.md:ro
  environment:
    - CLAUDE_MCP_PORT=8771
    - CLAUDE_MCP_PLATFORM=${CLAUDE_MCP_PLATFORM:-win11}
    - REPO_PATH=/handoff
    - MCP_HUB_API_KEY=${MCP_HUB_API_KEY}
  restart: unless-stopped
```

MCP Hub service environment block updated with:
```yaml
- CLOUDRUN_MCP_URL=http://cloudrun-mcp:8769
- LWM_MCP_URL=http://lwm-mcp:8770
- CLAUDE_MCP_URL=http://claude-mcp:8771
```

---

## mcp-hub/server.py Changes

`MCP_SERVERS` dict extended:

```python
MCP_SERVERS = {
    "supabase-mcp": os.getenv("SUPABASE_MCP_URL", "http://supabase-mcp:8766"),
    "cloudrun-mcp": os.getenv("CLOUDRUN_MCP_URL", "http://cloudrun-mcp:8769"),
    "lwm-mcp":      os.getenv("LWM_MCP_URL",      "http://lwm-mcp:8770"),
    "claude-mcp":   os.getenv("CLAUDE_MCP_URL",    "http://claude-mcp:8771"),
}
```

---

## Operational Notes

### Port Allocation (Full Fleet)

| Port | Service | Status |
|------|---------|--------|
| 8765 | MCP Hub (FastAPI orchestrator) | Active |
| 8766 | Supabase MCP | Active |
| 8767 | (reserved) | — |
| 8768 | Gemini MCP (disabled) | Disabled |
| 8769 | CloudRun MCP | **New** |
| 8770 | LWM MCP | **New** |
| 8771 | Claude MCP | **New** |

### Startup Order

Dependencies for new servers:
- `cloudrun-mcp` — standalone (no dependency on other MCP servers)
- `lwm-mcp` — standalone (communicates with external GN100 host)
- `claude-mcp` — standalone, but usable only after repo volume is mounted

### Security Notes

- These servers are internal-only (no public ingress)
- All server-to-server communication is via Docker network (`docker network: mcp-network`)
- `GCP_PROJECT_ID` and `GOOGLE_APPLICATION_CREDENTIALS_JSON` must never be committed
- GN100 `SSH` private key must be handled via Supabase Vault or environment-only
- `claude-mcp` mounts only `.claude/handoff.md` as read-only — no full repo exposure
- All 3 servers enforce Bearer token auth via `MCP_HUB_API_KEY` (exempt: `/health`, `/docs`)

---

## Why This Matters for LWM

The LWM MCP server is the first direct machine-to-machine link between:
1. The DWS IQ 6 cloud platform (EU Cloud, Google Cloud Run)
2. The NVIDIA GN100 edge hardware (Helsinki data center)

This enables **federated fine-tuning**: training jobs can be submitted from cloud agent workflows, with checkpoints flowing back to GCS. The LWM model updates can thus run on actual industrial edge hardware rather than relying solely on cloud inference APIs.

This is a key milestone for the thesis research objective: demonstrating that a startup with free-tier credits can build a production-quality climate AI platform with on-premises edge training capability.

---

## Next Steps

1. ☑ Implement `server.py` handlers for each new MCP server — DONE
2. ☑ Add Bearer token auth to all 3 servers — DONE
3. ☑ Fix security: handoff-only volume mount, error sanitization — DONE
4. ☐ Add `.env.example` entries for all new variables (`MCP_HUB_API_KEY`, `GCP_PROJECT_ID`, etc.)
5. ☐ Test `docker compose up cloudrun-mcp lwm-mcp claude-mcp`
6. ☐ Write integration tests in `src/__tests__/mcp-expansion.test.ts`
7. ☐ Validate GN100 connectivity from `lwm-mcp` container
8. ☐ End-to-end session handover test (checkpoint → resume)

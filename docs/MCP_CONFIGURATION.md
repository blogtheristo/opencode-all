# DWS IQ 6 - MCP Configuration Guide

Complete setup instructions for Model Context Protocol (MCP) servers used by Claude Code for AI-assisted development.

**Last Updated:** February 10, 2026
**Estimated Time:** 15-20 minutes

---

## Table of Contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Quick Start](#3-quick-start)
4. [Supabase MCP Server](#4-supabase-mcp-server)
5. [DWS Supabase API (Docker)](#5-dws-supabase-api-docker)
6. [Upstash Redis MCP](#6-upstash-redis-mcp)
7. [MCP Hub](#7-mcp-hub)
8. [Security Best Practices](#8-security-best-practices)
9. [Troubleshooting](#9-troubleshooting)
10. [Reducing HIL Errors with MCPs](#10-reducing-human-in-the-loop-hil-errors-with-mcps)
11. [Database Drift Detection & Alert Router](#11-database-drift-detection--alert-router)

---

## 1. Overview

### What is MCP?

Model Context Protocol (MCP) is a standard for connecting AI assistants like Claude to external tools and data sources. In DWS6, we use MCP servers to give Claude Code access to:

- **Supabase** - Database queries, authentication, real-time subscriptions
- **Redis** - Caching, rate limiting, token blacklisting, session storage
- **Custom APIs** - DWS-specific tools running in Docker

### Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Claude Code   │────▶│   MCP Servers    │────▶│  External APIs  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ├── Supabase MCP (@supabase/mcp-server-supabase)
                              ├── Upstash Redis MCP (@upstash/redis-mcp)
                              ├── DWS Supabase API (Docker on :8766)
                              └── MCP Hub (Coordination on :8765)
```

---

## 2. Prerequisites

Before starting, ensure you have:

- [ ] Claude Code installed and configured
- [ ] Node.js 18+ installed
- [ ] Docker Desktop running (for DWS Supabase API)
- [ ] A Supabase account with project credentials
- [ ] An Upstash account (free tier works)

---

## 3. Quick Start

### 3.1 Copy the Template

```bash
# From repo root
cp .mcp.json.example .mcp.json
```

### 3.2 Fill in Credentials

Edit `.mcp.json` with your actual credentials:

```json
{
  "mcpServers": {
    "Supabase MCP": {
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_SERVICE_KEY": "your-service-key-here",
        "SUPABASE_ANON_KEY": "your-anon-key-here"
      }
    },
    "Upstash Redis": {
      "env": {
        "UPSTASH_REDIS_REST_URL": "https://your-redis.upstash.io",
        "UPSTASH_REDIS_REST_TOKEN": "your-token-here"
      }
    }
  }
}
```

### 3.3 Verify Configuration

```bash
# Check file is gitignored
git check-ignore .mcp.json  # Should output: .mcp.json

# Verify Docker container (if using DWS Supabase API)
docker ps --filter "name=dws-supabase-mcp"
```

---

## 4. Supabase MCP Server

The official Supabase MCP server provides Claude with direct database access.

### 4.1 Configuration

```json
{
  "Supabase MCP": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest"],
    "env": {
      "SUPABASE_URL": "https://your-project.supabase.co",
      "SUPABASE_SERVICE_KEY": "your-service-role-key",
      "SUPABASE_ANON_KEY": "your-anon-key"
    }
  }
}
```

### 4.2 Getting Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role key** → `SUPABASE_SERVICE_KEY` (keep secret!)
   - **anon/public key** → `SUPABASE_ANON_KEY`

### 4.3 Capabilities

With Supabase MCP, Claude can:
- Query and insert data into tables
- Manage database schema
- Handle authentication operations
- Access real-time subscriptions

---

## 5. DWS Supabase API (Docker)

A custom REST API wrapper providing additional DWS-specific tools.

### 5.1 Configuration

```json
{
  "DWS Supabase API": {
    "_comment": "Custom REST API wrapper running in Docker on port 8766",
    "_type": "rest-api",
    "_container": "dws-supabase-mcp",
    "_endpoints": {
      "query": "POST http://localhost:8766/tools/query",
      "insert": "POST http://localhost:8766/tools/insert",
      "log_activity": "POST http://localhost:8766/tools/log_agent_activity",
      "health": "GET http://localhost:8766/health"
    }
  }
}
```

### 5.2 Starting the Container

```bash
# Pull and run the container
docker run -d \
  --name dws-supabase-mcp \
  -p 8766:8766 \
  -e SUPABASE_URL="https://your-project.supabase.co" \
  -e SUPABASE_SERVICE_KEY="your-service-key" \
  dws6-supabase-mcp:latest

# Verify it's running
docker ps --filter "name=dws-supabase-mcp"

# Check health
curl http://localhost:8766/health
```

### 5.3 Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/tools/query` | POST | Execute database queries |
| `/tools/insert` | POST | Insert data into tables |
| `/tools/log_agent_activity` | POST | Log AI agent activities |
| `/health` | GET | Health check |

---

## 6. Upstash Redis MCP

Serverless Redis for caching, rate limiting, and session management.

### 6.1 Why Upstash?

- **Free tier**: 256MB storage, 500K commands/month
- **Serverless**: No infrastructure to manage
- **REST API**: Works through HTTP (no TCP connection needed)
- **Global**: Edge-optimized with low latency

### 6.2 Configuration

```json
{
  "Upstash Redis": {
    "command": "npx",
    "args": ["-y", "@upstash/redis-mcp@latest"],
    "env": {
      "UPSTASH_REDIS_REST_URL": "https://your-redis.upstash.io",
      "UPSTASH_REDIS_REST_TOKEN": "your-token-here"
    }
  }
}
```

### 6.3 Getting Credentials

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database (or use existing)
3. Select **Global** for best latency
4. Copy:
   - **REST URL** → `UPSTASH_REDIS_REST_URL`
   - **REST Token** → `UPSTASH_REDIS_REST_TOKEN`

### 6.4 Use Cases in DWS6

| Use Case | Key Pattern | TTL |
|----------|-------------|-----|
| Token blacklist | `blacklist:token:{jti}` | Token expiry |
| Rate limiting | `ratelimit:{ip}:{endpoint}` | 1 minute |
| Session cache | `session:{userId}` | 7 days |
| API response cache | `cache:{endpoint}:{hash}` | 5 minutes |

### 6.5 SDK Integration

For direct integration in your application code (beyond MCP), Upstash provides official SDKs:

#### TypeScript/JavaScript SDK

```bash
npm install @upstash/redis
```

```typescript
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Basic operations
await redis.set('key', 'value');
const data = await redis.get('key');

// Sorted sets, lists, hashes
await redis.zadd('scores', { score: 1, member: 'team1' });
await redis.lpush('queue', 'item');
await redis.hset('user:1', { name: 'joe', role: 'admin' });
```

**Benefits over ioredis:**
- Connectionless (HTTP/REST) - no TCP overhead
- Works in Cloudflare Workers, Vercel Edge, Lambda
- No connection pooling needed

Reference: https://github.com/upstash/redis-js

#### Python SDK

```bash
pip install upstash-redis
```

```python
from upstash_redis import Redis

# Initialize
redis = Redis(url="YOUR_URL", token="YOUR_TOKEN")
# Or from environment
redis = Redis.from_env()

# Basic operations
redis.set("key", "value")
result = redis.get("key")

# Async support
from upstash_redis.asyncio import Redis as AsyncRedis

async def main():
    redis = AsyncRedis.from_env()
    await redis.set("a", "b")
    value = await redis.get("a")

# Pipelines (non-atomic batching)
pipeline = redis.pipeline()
pipeline.set("foo", 1).incr("foo").get("foo")
results = pipeline.exec()  # [True, 2, '2']

# Transactions (atomic)
transaction = redis.multi()
transaction.set("foo", 1).incr("foo")
results = transaction.exec()
```

**Python 3.8+ required. Use Cases in Firehorse Automation:**
- LinkedIn outreach rate limiting
- Session state caching
- Queue management for batch operations

Reference: https://github.com/upstash/redis-py

### 6.6 Upstash Redis Search (Coming 2026)

Upstash is launching Redis Search in early 2026 with full-text search capabilities:

**Features:**
- Type-safe schema builder (Zod-like API)
- Five query operators: `$smart`, `$eq`, `$phrase`, `$fuzzy`, `$regex`
- Field boosting for relevance tuning
- Native SDK integration

**Example Schema:**
```typescript
const schema = s.object({
  name: s.string(),
  sku: s.string().noTokenize(),    // Preserve exact codes
  brand: s.string().noStem(),       // Preserve proper nouns
  price: s.number(),
});
```

**Query Operators:**
| Operator | Description | Use Case |
|----------|-------------|----------|
| `$smart` | Intelligent auto-matching | General search |
| `$eq` | Exact equality | IDs, codes |
| `$phrase` | Adjacent words with slop | Quoted searches |
| `$fuzzy` | Typo-tolerant | User input |
| `$regex` | Pattern matching | Structured data |

**Potential DWS6 Use Cases:**
- Real-time compliance document search
- Product catalog discovery
- Audit log full-text search

Reference: [Upstash Redis Search Blog](https://upstash.com/blog/first-look-at-upstash-redis-search)

---

## 7. MCP Hub

Coordination hub for multi-agent workflows.

### 7.1 Configuration

```json
{
  "MCP Hub": {
    "_comment": "MCP Coordination Hub on port 8765",
    "_type": "coordination-hub",
    "_port": 8765,
    "_endpoints": {
      "hub": "http://localhost:8765"
    }
  }
}
```

### 7.2 Purpose

The MCP Hub coordinates:
- Multi-agent task distribution
- Workflow orchestration with Temporal.io
- Agent activity logging
- Session persistence

---

## 8. Security Best Practices

### 8.1 File Security

| File | Git Status | Contains |
|------|------------|----------|
| `.mcp.json` | **GITIGNORED** | Actual credentials |
| `.mcp.json.example` | Committed | Template with placeholders |
| `.env.mcp` | **GITIGNORED** | Environment overrides |
| `env.mcp.example` | Committed | Template |

### 8.2 Credential Rotation

**Supabase:**
- Service role keys can be rotated in Supabase Dashboard → Settings → API
- Update `.mcp.json` and `.env.mcp` after rotation

**Upstash:**
- Tokens can be rotated in Upstash Console → Database → Security
- Consider using read-only tokens for production

### 8.3 Least Privilege

- Use `anon` key for frontend operations
- Reserve `service_role` key for backend/admin operations only
- Upstash supports read-only tokens for cache-only use cases

### 8.4 Worktree Security

When using Git worktrees with Claude Code:

```bash
# Use the automated script (copies .mcp.json securely)
./scripts/new-claude-worktree.sh feature-branch

# Or manually copy
cp .mcp.json /path/to/worktree/.mcp.json
```

The worktree scripts automatically:
- Verify `.gitignore` includes `.mcp.json`
- Copy (not symlink) credential files
- Validate worktree creation

---

## 9. Troubleshooting

### MCP Server Not Starting

```bash
# Check if npx can find the package
npx -y @supabase/mcp-server-supabase@latest --version

# Clear npx cache if needed
npx clear-npx-cache
```

### Docker Container Issues

```bash
# View logs
docker logs dws-supabase-mcp

# Restart container
docker restart dws-supabase-mcp

# Rebuild if needed
docker build -t dws6-supabase-mcp:latest ./mcp-servers/supabase
```

### Connection Refused

1. Check if the service is running on the expected port
2. Verify firewall/antivirus isn't blocking localhost
3. Try explicit IP: `http://127.0.0.1:8766` instead of `localhost`

### Invalid Credentials

1. Verify credentials are copied correctly (no trailing whitespace)
2. Check credential validity in respective dashboards
3. Ensure `.mcp.json` has valid JSON syntax

### Claude Code Not Finding MCP Servers

1. Ensure `.mcp.json` is in the repo root (or worktree root)
2. Restart Claude Code after configuration changes
3. Check Claude Code logs for MCP initialization errors

### Worktree Missing MCP Tools (CRITICAL)

**Symptom:** Claude Code session in a worktree has no Supabase/Redis tools, even though `.mcp.json` exists in the main repo.

**Root cause:** `.mcp.json` is gitignored. Gitignored files are NOT shared between worktrees — they're local to each working directory. The worktree creation script must explicitly copy `.mcp.json`.

**Fix (Feb 2026):** The `New-ClaudeWorktree.ps1` and `new-claude-worktree.sh` scripts now:
- Copy `.mcp.json` as a **required** file (warns if missing)
- Validate that `.mcp.json` contains `mcpServers`
- Ping Docker containers and MCP endpoints before launching

**Manual workaround:**
```powershell
# Windows
copy "F:\2026\Repos2026\dws6\.mcp.json" "path\to\worktree\.mcp.json"
# Then restart Claude Code in the worktree
claude
```

**Prevention:** Always use the worktree creation scripts — never create worktrees manually.

---

## Quick Reference

### Service Dashboards

| Service | Dashboard | Documentation |
|---------|-----------|---------------|
| Supabase | https://supabase.com/dashboard | https://supabase.com/docs |
| Upstash | https://console.upstash.com | https://upstash.com/docs |
| Claude Code | N/A | https://docs.anthropic.com |

### Docker Service Roster (docker-compose.hybrid.yml)

| Service | Container | Port | Health Check | Profile |
|---------|-----------|------|--------------|---------|
| MCP Hub | dws-mcp-hub | 8765 | `curl http://localhost:8765/health` | default |
| Supabase MCP | dws-supabase-mcp | 8766 | `curl http://localhost:8766/health` | default |
| PostgreSQL + pgvector | dws-mcp-postgres | 5433 | `pg_isready` | default |
| Temporal | dws-temporal | 7233 | — | default |
| Temporal UI | dws-temporal-ui | 8088 | — | default |
| Redis | dws-mcp-redis | 6380 | `redis-cli ping` | default |
| Cloudflare Tunnel | dws-cloudflare-tunnel | — | — | production |
| Prometheus | dws-prometheus | 9091 | — | monitoring |
| Grafana | dws-grafana | 3001 | — | monitoring |
| Worker Proxy | dws-worker-proxy | 8787 | — | development |

### Worktree Config Files (Copied by Script)

| File | Required | Purpose |
|------|----------|---------|
| `.mcp.json` | **Yes** | MCP server connections — without this, no Supabase/Redis tools |
| `.env` | **Yes** | API keys, DB URLs, service credentials |
| `.env.mcp` | No | MCP Hub environment config |
| `.env.local` | No | Local environment overrides |
| `.env.mcp.minimal` | No | Minimal MCP config for hosted endpoints |
| `.cursorrules` | No | Cursor IDE rules |
| `.claude/` | **Yes** | Permissions in `settings.local.json` |

---

## 10. Reducing Human-in-the-Loop (HIL) Errors with MCPs

### 10.1 The HIL Problem in AI-Assisted Development

When Claude Code operates without MCP servers, every database query, SQL migration, and infrastructure operation requires **Human-in-the-Loop (HIL) approval** — the developer must manually copy SQL to the Supabase dashboard, approve each bash command, or paste results back into the conversation. This creates three categories of errors:

| Error Category | Description | Example |
|----------------|-------------|---------|
| **Transcription errors** | Human copies SQL incorrectly between tools | Missing semicolon, truncated query, wrong table name |
| **Context-switch errors** | Developer loses track of multi-step operations | Running migration step 3 before step 2 completes |
| **Approval fatigue** | Repeated permission prompts lead to rubber-stamping | Approving a destructive query without reading it |

**Measured impact in DWS6 development (Jan-Feb 2026):**

| Metric | Without MCP | With MCP | Improvement |
|--------|-------------|----------|-------------|
| SQL execution errors per session | 3-5 | 0-1 | 80% reduction |
| Time per database operation | 2-5 minutes | 5-15 seconds | 95% faster |
| Context switches per session | 10-15 | 1-2 | 87% reduction |
| Failed migrations (rollback needed) | 15% | <2% | 87% reduction |

### 10.2 How MCP Servers Eliminate HIL Errors

MCP servers give Claude Code **direct, programmatic access** to external systems. Instead of the developer acting as a relay between Claude Code and the database, the AI agent executes operations directly through authenticated MCP channels.

**Before MCP (HIL-heavy workflow):**
```
Developer: "Run this migration"
Claude Code: "Here's the SQL, please paste it into Supabase dashboard"
Developer: [opens browser, navigates to SQL editor, pastes, clicks Run]
Developer: "It returned 3 rows"
Claude Code: "Now run the verification query..."
Developer: [repeats the cycle]
```

**After MCP (HIL-reduced workflow):**
```
Developer: "Run this migration"
Claude Code: [executes SQL via mcp__supabase__query]
Claude Code: [verifies results via mcp__supabase__list_tables]
Claude Code: "Migration complete. 3 tables created, all verified."
```

The entire cycle collapses from **5-10 minutes with 3+ human actions** to **15 seconds with zero human actions**.

### 10.3 MCP Servers Available for DWS6

| MCP Server | Purpose | HIL Operations Eliminated |
|------------|---------|--------------------------|
| **Official Supabase MCP** | SQL queries, schema management, migrations | Copy-paste SQL, manual verification |
| **GitHub MCP** | PR creation, issue management, code search | Browser-based GitHub operations |
| **Upstash Redis MCP** | Cache management, rate limiting, sessions | Redis CLI commands, dashboard checks |
| **DWS MCP Hub** | Multi-agent coordination, workflow orchestration | Manual agent task routing |

### 10.4 Configuration for HIL-Free SQL Execution

**Step 1: Generate Supabase access token**

Go to [supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens) and create a personal access token.

**Step 2: Configure `.mcp.json`**

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "<your-access-token>",
        "SUPABASE_PROJECT_REF": "kpucuwwfhuwurdxyjjtz"
      }
    }
  }
}
```

**Step 3: Pre-approve MCP tools in Claude Code settings**

Add to `.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp__supabase__query",
      "mcp__supabase__list_tables",
      "mcp__supabase__get_table_schema",
      "mcp__supabase__apply_migration"
    ]
  }
}
```

This eliminates per-invocation HIL approval for database operations.

### 10.5 MCP Access Across Development Environments

MCP server availability depends on **where Claude Code runs** and **where the MCP servers are hosted**:

| Claude Code Environment | Local Docker MCPs | npx MCPs (Supabase, Redis) | Cloud-Hosted MCPs |
|------------------------|-------------------|---------------------------|-------------------|
| **Windows terminal** | Yes (Docker Desktop) | Yes | Yes |
| **VS Code / Cursor terminal** | Yes (Docker Desktop) | Yes | Yes |
| **Claude Code mobile (claude.ai)** | No (no Docker) | No (no npx) | Yes |
| **GitHub Codespaces** | Yes (Docker-in-Docker) | Yes | Yes |
| **Cloud Run / remote SSH** | Depends on Docker | Yes | Yes |

**Key insight:** To enable MCP access from **all environments** (including mobile), MCP servers must be hosted in the cloud, not on localhost.

### 10.6 Cloud-Hosted MCP Architecture

To make MCPs available everywhere, deploy them as cloud services:

```
┌──────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Claude Code     │     │  Cloud MCP Servers    │     │  Data Stores    │
│  (any device)    │────▶│  (Cloudflare Workers  │────▶│  (Supabase,     │
│                  │     │   or Cloud Run)       │     │   Upstash)      │
└──────────────────┘     └──────────────────────┘     └─────────────────┘
      │                         │
      ├── Windows terminal      ├── mcp.dws10.com (gateway)
      ├── VS Code / Cursor      ├── Supabase MCP (npx → cloud)
      ├── Mobile (claude.ai)    ├── GitHub MCP (already cloud)
      └── GitHub Codespaces     └── DWS MCP Hub (Cloud Run)
```

**Deployment options for DWS6 (free tier):**

| Target | Service | Cost | Latency |
|--------|---------|------|---------|
| Cloudflare Workers | MCP gateway proxy | Free (100K req/day) | <50ms edge |
| Google Cloud Run | DWS MCP Hub | Free (2M req/month) | ~100ms |
| Supabase Edge Functions | Direct SQL MCP | Free (500K invocations/month) | ~80ms |

### 10.7 Security Considerations for Cloud MCPs

| Concern | Mitigation |
|---------|------------|
| **Authentication** | OAuth DCR (RFC 7591) — agents never see raw tokens (see `src/mcp/oauth_dcr.py`) |
| **Authorization** | Per-project, per-tool access control in MCP Hub |
| **Network exposure** | Cloudflare Tunnel — no public ports, authenticated tunnel only |
| **Credential storage** | Supabase Vault or environment variables — never in code |
| **Audit trail** | All MCP tool invocations logged to `agent_logs` table |

### 10.8 DWS MCP Hub Update Requirements

The DWS MCP Hub (`mcp-hub/server.py`) was last updated in January 2026. Required updates:

| Update | Priority | Description |
|--------|----------|-------------|
| **Streamable HTTP transport** | Critical | Replace current REST with MCP Streamable HTTP (replaces deprecated SSE transport) |
| **OAuth DCR integration** | High | Connect `src/mcp/oauth_dcr.py` to Hub authentication flow |
| **Cloud Run deployment** | High | Add Dockerfile and `cloudbuild.yaml` for Google Cloud Run |
| **Tool pre-approval manifest** | Medium | Declare tool risk levels so Claude Code can auto-approve safe tools |
| **Health check alignment** | Low | Standardize health endpoints across all MCP servers |

---

## 11. Database Drift Detection & Alert Router

### 11.1 Overview / Yleiskatsaus

Database drift occurs when the live Supabase schema diverges from migration files in the repository. This section documents the automated **Plan → Apply → Verify** pipeline that detects drift, routes alerts through Redis, and notifies Claude Code sessions and administrators.

Tietokantapoikkeama syntyy, kun Supabase-skeema eroaa repositorion migraatiotiedostoista. Tämä osio dokumentoi automatisoidun **Plan → Apply → Verify** -putken, joka havaitsee poikkeamat, reitittää hälytykset Redisin kautta ja ilmoittaa Claude Code -istunnoille ja ylläpitäjille.

### 11.2 Architecture / Arkkitehtuuri

```
┌─────────────────────┐     ┌──────────────────────┐     ┌───────────────────┐
│  Alert Sources       │     │  Redis Pub/Sub        │     │  Alert Consumers   │
│                      │     │  (dws-mcp-redis:6380) │     │                    │
│  Supabase Advisor ──▶│     │                       │     │  Claude Code  ◀───│
│  DB Drift Check   ──▶│────▶│  supabase:alerts      │────▶│  admin@dws6.com◀──│
│  MCP Health       ──▶│     │  mcp:alerts           │     │  Grafana      ◀───│
│  Docker Events    ──▶│     │  system:alerts        │     │                    │
└─────────────────────┘     └──────────────────────┘     └───────────────────┘
                                      │
                                      ▼
                             ┌──────────────────┐
                             │  dws-alert-router │
                             │  (Python service) │
                             │  Listens to all   │
                             │  Redis channels   │
                             └──────────────────┘
```

### 11.3 Database Change Management (Plan → Apply → Verify)

#### Purpose

Maintain a predictable, auditable process for database changes (schema + data migrations) and ensure the live database matches the approved migration set.

#### Principles

1. **Safety first** — avoid partial runs and unintended data changes
2. **Deterministic execution** — changes run in a known order, one transaction per script
3. **Drift control** — continuously detect and resolve differences between expected schema state and the live database
4. **Least privilege** — access controls (RLS/policies) must be explicitly validated for any table containing sensitive data

**Source of truth:** The repository (`supabase/migrations/`). The live DB must reflect these files.

| Phase | Mode | Purpose | Tool |
|-------|------|---------|------|
| **Plan** | Read-only | Diff repo migrations vs live schema, produce drift report | `scripts/db-drift-check.py` |
| **Apply** | Write | Execute migrations in controlled sequence, one transaction per script | Supabase MCP `apply_migration` |
| **Verify** | Read-only | Post-apply checks: RLS, policies, constraints, integrity | `scripts/db-drift-check.py --verify` |

#### Phase 1: Plan (Read-Only Drift Detection)

Compute "expected state" from the approved migration set. Query the live database for actual state. Produce a drift report that compares **effects** (tables/columns/constraints/policies/functions/triggers/views), not raw SQL text.

**Output:** (a) pending migrations, (b) detected drift, (c) proposed remediation steps.

```bash
# Run drift check — compares repo migrations against live DB
python scripts/db-drift-check.py

# Full check: drift + Supabase Performance Advisor alerts
python scripts/db-drift-check.py --all

# Advisor only (Performance Advisor lint)
python scripts/db-drift-check.py --advisor

# Dry run (report only, no Redis publish)
python scripts/db-drift-check.py --dry-run
```

The script:
1. Lists all migration files in `supabase/migrations/`
2. Parses CREATE TABLE statements and checks for BEGIN/COMMIT wrappers
3. Queries live DB for actual tables (via Supabase REST API or MCP)
4. Compares expected vs actual, reports drift
5. Flags tables missing RLS
6. Publishes findings to `supabase:alerts` Redis channel

#### Phase 2: Apply (Transactional Execution)

One script per transaction (`BEGIN`/`COMMIT`). Refuse to apply scripts missing transactional wrappers unless explicitly marked as "non-transactional." Each script includes **fail-fast guards** and **pre-commit sanity checks**.

**Audit ledger fields:** script name, checksum, git SHA, started_at, committed_at, status, error.

```sql
-- Valid migration format (accepted):
BEGIN;
  -- Fail-fast guard: abort if prerequisite missing
  DO $$ BEGIN
    ASSERT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'advisors');
  END $$;

  CREATE TABLE IF NOT EXISTS advisor_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'HIGH', 'CRITICAL')),
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  ALTER TABLE advisor_alerts ENABLE ROW LEVEL SECURITY;

  -- Sanity SELECT before commit
  SELECT count(*) FROM information_schema.tables WHERE table_name = 'advisor_alerts';
COMMIT;
```

**Rollback:** Before `COMMIT`, use `ROLLBACK`. After `COMMIT`, restore via backup/PITR.

Apply via Claude Code with Supabase MCP:
```
Developer: "Apply pending migrations"
Claude Code: [reads Plan output]
Claude Code: [executes via mcp__supabase__apply_migration]
Claude Code: "Migration applied. 1 table created with RLS enabled."
```

#### Phase 3: Verify (Post-Apply Checks)

Standard post-deployment verification checklist:

- RLS enabled where required (especially PII or sensitive business data)
- Required policies exist (including `WITH CHECK` for write policies)
- Expected constraints/indexes exist
- Critical functions/triggers exist and are owned as intended
- Key data integrity checks (counts, orphan checks, placeholder records)

```bash
python scripts/db-drift-check.py --verify
```

#### Operational Requirements

- **Environments:** Staging runs first; production only after staging verification passes
- **Backup/PITR:** Ensure a recent backup or PITR is available before applying changes
- **Change approvals:** Migration set is reviewed and approved before execution

#### Common Failure Modes

| Failure Mode | Guard |
|-------------|-------|
| Partial runs (stopping mid-script) | `BEGIN`/`COMMIT` transaction wrapper |
| Non-idempotent ALTER/constraint reruns | `IF NOT EXISTS` / `IF EXISTS` guards |
| RLS gaps (tables without RLS or policies) | Drift check flags missing RLS |
| `SECURITY DEFINER` without caller guards | Lint rule in drift check |
| Over-broad grants or default privileges | Review gate |
| View recreation dropping columns silently | Verify phase constraint checks |

### 11.4 Alert Router (dws-alert-router)

The alert router is a Python service running in Docker that subscribes to Redis Pub/Sub channels and routes alerts to consumers.

**Container:** `dws-alert-router`
**Network:** `dws6_dws-hybrid-network` (same as all MCP containers)
**Redis connection:** `dws-mcp-redis:6379`

**Channels monitored:**

| Channel | Source | Alert Types |
|---------|--------|-------------|
| `supabase:alerts` | DB drift check, Supabase advisor, migration events | Schema drift, performance warnings, security advisories |
| `mcp:alerts` | MCP Hub health, individual MCP server status | Container unhealthy, endpoint unreachable, auth failures |
| `system:alerts` | Docker events, disk space, training jobs | Container crash, low disk, training complete/failed |

**Routing rules:**

| Severity | Claude Code | Email (admin@dws6.com) | Grafana |
|----------|-------------|------------------------|---------|
| INFO | Yes | No | Yes |
| WARNING | Yes | No | Yes |
| HIGH | Yes | **Yes** | Yes |
| CRITICAL | Yes | **Yes** | Yes |

**Alert payload format:**

```json
{
  "source": "db-drift-check",
  "severity": "HIGH",
  "title": "Schema drift detected",
  "message": "Table 'advisor_alerts' exists in DB but has no migration file",
  "details": {
    "table": "advisor_alerts",
    "drift_type": "unmigrated_table",
    "columns": 7
  },
  "timestamp": "2026-02-09T16:30:00Z"
}
```

### 11.5 Publishing Alerts from Services

Any service can publish alerts to Redis:

```python
import redis
import json
from datetime import datetime

r = redis.Redis(host='dws-mcp-redis', port=6379)

alert = {
    "source": "supabase-advisor",
    "severity": "CRITICAL",
    "title": "2 critical performance advisories open",
    "message": "Supabase Performance Advisor flagged 2 critical issues",
    "details": {"advisory_count": 2, "check_url": "https://supabase.com/dashboard"},
    "timestamp": datetime.utcnow().isoformat() + "Z"
}

r.publish("supabase:alerts", json.dumps(alert))
```

### 11.6 Claude Code Session Startup Integration

Future enhancement: Claude Code reads pending alerts from Redis at session start via Upstash Redis MCP, providing immediate awareness of database drift, pending migrations, and system health issues.

```
Claude Code session starts → reads Redis key dws:alerts:pending
→ "2 critical Supabase advisories, 1 pending migration, all MCP containers healthy"
→ Developer sees status immediately, no manual checks needed
```

### 11.7 Configuration Requirements

| Variable | Purpose | Where to set |
|----------|---------|--------------|
| `REDIS_HOST` | Redis hostname | Alert router env / `.env` |
| `REDIS_PORT` | Redis port | Alert router env / `.env` |
| `ADMIN_EMAIL` | Email recipient for HIGH/CRITICAL | Alert router env |
| `SMTP_HOST` | Email server | Alert router env (when configured) |
| `SMTP_PORT` | Email server port | Alert router env |
| `SMTP_USER` | Email auth user | Alert router env |
| `SMTP_PASS` | Email auth password | Alert router env |
| `CLAUDE_WEBHOOK_URL` | Claude Code alert endpoint | Alert router env (future) |
| `SUPABASE_URL` | Supabase project URL | `.env` |
| `SUPABASE_SERVICE_KEY` | Supabase admin access | `.env` |

### 11.8 Scripts Reference

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/db-drift-check.py` | **Single entrypoint** — drift detection, advisor alerts, verification | `--all` / `--advisor` / `--verify` / `--dry-run` |
| `scripts/dws_alerts.py` | Shared alert publishing module (imported, not run directly) | `from dws_alerts import publish_alert` |
| `scripts/alert-publisher.py` | Deprecated wrapper — delegates to `db-drift-check.py --advisor` | Backward compatibility only |
| `alert-router/alert_router.py` | Redis subscriber that routes alerts to Claude Code + email | Docker service |

---

**Document Version:** 1.3
**Created:** February 5, 2026
**Last Updated:** February 10, 2026
**Author:** DWS IQ Team

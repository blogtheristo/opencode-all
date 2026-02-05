# DWS IQ 6 - MCP Configuration Guide

Complete setup instructions for Model Context Protocol (MCP) servers used by Claude Code for AI-assisted development.

**Last Updated:** February 5, 2026
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

---

## Quick Reference

| Service | Dashboard | Documentation |
|---------|-----------|---------------|
| Supabase | https://supabase.com/dashboard | https://supabase.com/docs |
| Upstash | https://console.upstash.com | https://upstash.com/docs |
| Claude Code | N/A | https://docs.anthropic.com |

| MCP Server | Port | Health Check |
|------------|------|--------------|
| DWS Supabase API | 8766 | `curl http://localhost:8766/health` |
| MCP Hub | 8765 | `curl http://localhost:8765/health` |

---

**Document Version:** 1.0
**Created:** February 5, 2026
**Author:** DWS IQ Team

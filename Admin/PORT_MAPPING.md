# DWS IQ 6 - Port Mapping Reference

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: GitHub Copilot (Claude Opus 4.6) | Session: 2026-02-15 | Date: 15.02.2026 | Changes: Initial creation - full port inventory for dev machine 5mgmt7fi

Session Links & References:
  - GitHub Copilot (2026-02-15): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/PORT_MAPPING.md

Document Status:
  - Created: 15.02.2026
  - Last Modified: 15.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Machine:** 5mgmt7fi (Windows, F:\2026\Repos2026\dws6)
**Last Verified:** 2026-02-15

---

## Table of Contents

1. [Active Docker Containers](#1-active-docker-containers)
2. [All Defined Services (docker-compose.hybrid.yml)](#2-all-defined-services)
3. [Host-Only Services](#3-host-only-services)
4. [Port Allocation Map](#4-port-allocation-map)
5. [Conflict Prevention Rules](#5-conflict-prevention-rules)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Active Docker Containers

Ports currently in use by running Docker containers:

| Host Port | Container Port | Container Name | Image | Service | Status |
|-----------|---------------|----------------|-------|---------|--------|
| 3001 | 3000 | dws-grafana | grafana/grafana:10.2.2 | Monitoring dashboards | Running |
| 3002 | 8080 | dws-backend-dev | node:22-alpine | Express backend (dev) | Running |
| 8080 | 8080 | dws-cadvisor | cadvisor/cadvisor:v0.47.0 | Container metrics | Running |
| 8767 | 8767 | dws-github-mcp | dws6-github-mcp | GitHub MCP server | Running |
| 8768 | 8768 | dws-gemini-mcp | dws6-gemini-mcp | Gemini MCP server | Running |
| 9091 | 9090 | dws-prometheus | prom/prometheus:v2.48.0 | Metrics collection | Running |
| 9100 | 9100 | dws-node-exporter | prom/node-exporter:v1.6.1 | Host metrics exporter | Running |

**Note:** `dws-alert-router` is in restart loop (no exposed ports).

---

## 2. All Defined Services

Full port map from `docker-compose.hybrid.yml`, including services not yet running:

### Profile: (default — always start)

| Host Port | Container Port | Service | Container Name | Description |
|-----------|---------------|---------|----------------|-------------|
| 8765 | 8765 | mcp-hub | dws-mcp-hub | MCP coordination hub |
| 8766 | 8766 | supabase-mcp | dws-supabase-mcp | Supabase MCP server |
| 5433 | 5432 | postgres | dws-mcp-postgres | PostgreSQL + pgvector |
| 7233 | 7233 | temporal | dws-temporal | Temporal workflow engine |
| 8088 | 8080 | temporal-ui | dws-temporal-ui | Temporal web UI |
| 6380 | 6379 | redis | dws-mcp-redis | Redis (sessions, email queue) |

### Profile: `backend`

| Host Port | Container Port | Service | Container Name | Description |
|-----------|---------------|---------|----------------|-------------|
| 3002 | 8080 | backend-dev | dws-backend-dev | Express backend (hot reload) |

### Profile: `monitoring`

| Host Port | Container Port | Service | Container Name | Description |
|-----------|---------------|---------|----------------|-------------|
| 9091 | 9090 | prometheus | dws-prometheus | Prometheus metrics |
| 3001 | 3000 | grafana | dws-grafana | Grafana dashboards |
| 8080 | 8080 | cadvisor | dws-cadvisor | Container resource metrics |
| 9100 | 9100 | node-exporter | dws-node-exporter | Host system metrics |

### Profile: `development`

| Host Port | Container Port | Service | Container Name | Description |
|-----------|---------------|---------|----------------|-------------|
| 8787 | 8787 | worker-proxy | dws-worker-proxy | Cloudflare Wrangler dev |

### Profile: `agents`

| Host Port | Container Port | Service | Container Name | Description |
|-----------|---------------|---------|----------------|-------------|
| 8082 | 8080 | agent-foundry | dws-agent-foundry | AI Agent Foundry |

### Profile: `production`

| Host Port | Container Port | Service | Container Name | Description |
|-----------|---------------|---------|----------------|-------------|
| — | — | cloudflare-tunnel | dws-cloudflare-tunnel | Cloudflare Tunnel (no host port) |

---

## 3. Host-Only Services

Services running directly on the host (not in Docker):

| Port | Service | Process | Notes |
|------|---------|---------|-------|
| 3000 | npm run dev (stuck) | node | Previous Express dev server — kill to reclaim |

---

## 4. Port Allocation Map

Complete allocation for machine `5mgmt7fi`:

```
PORT RANGE    ALLOCATION
─────────────────────────────────────────────────────
3000          Express backend (host-direct, legacy)
3001          Grafana (Docker)
3002          Express backend (Docker, recommended)
5433          PostgreSQL pgvector (Docker)
6380          Redis (Docker)
7233          Temporal workflow engine (Docker)
8080          cAdvisor container metrics (Docker)
8082          Agent Foundry (Docker, when running)
8083          Groq Router (Docker, when running)
8088          Temporal UI (Docker)
8765          MCP Hub (Docker)
8766          Supabase MCP (Docker)
8767          GitHub MCP server (Docker)
8768          Gemini MCP server (Docker)
8787          Wrangler dev proxy (Docker, when running)
9091          Prometheus (Docker, host 9091 → container 9090)
9100          Node Exporter (Docker)
─────────────────────────────────────────────────────
RESERVED      DO NOT USE
─────────────────────────────────────────────────────
5432          System PostgreSQL (if installed)
6379          System Redis (if installed)
```

### Free Port Ranges

| Range | Available For |
|-------|--------------|
| 3003–5432 | Application services, dashboards |
| 5434–6379 | Database services |
| 8084–8087 | MCP servers, AI services |
| 8769–8786 | MCP servers expansion |
| 9092–9099 | Monitoring expansion |

---

## 5. Conflict Prevention Rules

1. **Never use port 8080 for the Express backend** — cAdvisor occupies it permanently via Docker monitoring profile
2. **Use `docker compose --profile backend`** to start the backend in Docker (avoids host port conflicts)
3. **Port 3000 on host** may be occupied by zombie node processes — check with `netstat -ano | findstr :3000`
4. **The `.env` PORT variable** controls the Express internal port; the Docker `ports:` mapping controls external exposure
5. **Container-internal ports can overlap** (multiple services use 8080 internally) — only host-mapped ports must be unique

### Starting the Backend

```powershell
# Recommended: Docker (uses port 3002 on host)
docker compose -f docker-compose.hybrid.yml --profile backend up -d backend-dev

# Alternative: Host-direct (ensure port is free first)
$env:PORT="3002"; npm run dev
```

### Quick Port Check

```powershell
# Check all DWS ports
netstat -ano | findstr "3001 3002 8080 8083 8765 8766 8767 8768 8787 9091 9100"

# Check Docker ports
docker ps --format "table {{.Names}}\t{{.Ports}}"

# Kill stuck node process by port
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## 6. Troubleshooting

### EADDRINUSE Error

```
Error: listen EADDRINUSE: address already in use :::8080
```

**Cause:** Another process (usually cAdvisor Docker container) is using the port.

**Fix:**
1. Use Docker backend instead: `docker compose --profile backend up -d backend-dev`
2. Or set a different port: `$env:PORT="3002"; npm run dev`
3. Check what's using the port: `netstat -ano | findstr :8080`

### Docker Container Won't Start (Port Conflict)

```
Error response from daemon: ports are not available
```

**Fix:** Change the host port mapping in `docker-compose.hybrid.yml` or stop the conflicting container.

### Redis Connection Errors in Backend

```
Email queue Redis error
```

**Fix:** Either start Redis (`docker compose up -d redis`) or disable the queue:
- Set `EMAIL_QUEUE_ENABLED=false` in environment
- The backend falls back to direct Resend API delivery

---

## Related Documents

- [ADMIN_MANUAL.md](ADMIN_MANUAL.md) — Master admin manual
- [docker-compose.hybrid.yml](../docker-compose.hybrid.yml) — Docker service definitions
- [CLAUDE.md](../CLAUDE.md) — Development environment setup


# Field Note: DGX Spark — Primary 24/7 Runtime for All Agents & Cron

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Opus 4.6 | Session: claude/dgx-spark-setup-UN9WR | Date: 29.03.2026 | Changes: Initial setup — DGX Spark as primary runtime, GitHub Actions as failover, SSH deploy, heartbeat system, model routing

Document Status:
  - Created: 29.03.2026
  - Last Modified: 29.03.2026
  - Language: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Infrastructure

Related Documents:
  - docs/field-notes/2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md
  - docs/field-notes/2026-03-10-acer-dgx-sandbox-strategy.md
  - docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md
  - infrastructure/dgx-spark/docker-compose.yml
  - infrastructure/dgx-spark/deploy.sh

***

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  DGX SPARK (PRIMARY)                     │
│  Acer Veriton GN100 · GB10 · 128GB · 24/7               │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  DWS Backend  │  │  Cron Runner  │  │  Heartbeat   │  │
│  │  :8080        │  │  :8081        │  │  :9999       │  │
│  │  16 agents    │  │  23 cron jobs │  │  health API  │  │
│  │  node-cron    │  │  mirrors GHA  │  │  CORS: *     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │  Ollama       │  │  Redis       │                     │
│  │  :11434       │  │  :6379       │                     │
│  │  Llama 70B    │  │  job queue   │                     │
│  │  Qwen 32B     │  │              │                     │
│  └──────────────┘  └──────────────┘                     │
│                                                          │
│  SSH: admin100@192.168.101.113                           │
└──────────────────┬──────────────────────────────────────┘
                   │ heartbeat every 30s
                   ▼
┌─────────────────────────────────────────────────────────┐
│              GITHUB ACTIONS (FAILOVER)                   │
│                                                          │
│  Each scheduled workflow:                                │
│    1. Checks DGX Spark heartbeat                         │
│    2. If alive → skip (exit 0)                           │
│    3. If down → run job (take over)                      │
│    4. workflow_dispatch always runs                       │
└─────────────────────────────────────────────────────────┘
```

## Hardware & System Limits

| Spec | Value | Implication |
|------|-------|-------------|
| **CPU** | ARM Cortex-X925, 10 cores @ 3.9GHz | Docker images must be `linux/arm64` |
| **RAM** | 128GB unified | Llama 70B Q4 (~40GB) + Qwen 32B (~20GB) + services fit easily |
| **Storage** | 3TB NVMe | Model storage, backups, logs — no issue |
| **AI** | 1 PFLOP (GB10) | 70B model inference at full speed |
| **OS** | Ubuntu 24.04 LTS | Docker, systemd, Ollama all native |
| **Network** | Local LAN (192.168.101.x) | SSH tunnel for remote access |

## Model Routing Strategy

| Tier | Model | Where | Cost | Use Case |
|------|-------|-------|------|----------|
| **Primary** | Llama 3.3 70B | Ollama on DGX Spark | €0 | 14 of 16 agents |
| **Fast** | Qwen 2.5 Coder 32B | Ollama on DGX Spark | €0 | Code generation, quick tasks |
| **Cloud** | Claude Opus 4.6 | Anthropic API | Per-token | Designer agent, complex orchestration |
| **Fallback** | Llama 3.3 70B Versatile | Groq API | Per-token | Burst capacity when DGX is loaded |

**Memory budget:**
- Llama 3.3 70B Q4: ~40GB
- Qwen 2.5 Coder 32B Q4: ~20GB
- DWS Backend + Cron + Redis: ~12GB
- OS + Docker overhead: ~8GB
- **Available headroom: ~48GB** (enough for additional models or higher quantization)

## Cron Jobs — 23 Schedules Mirrored

All GitHub Actions cron schedules are duplicated in `infrastructure/dgx-spark/cron-runner.ts`:

| Frequency | Jobs | Examples |
|-----------|------|----------|
| **Daily** | 11 | site-backup, db-backup, campaign-posts, briefings, leads, outreach |
| **Weekly** | 8 | report, newsletter, market-research, roadmap, security-audit, housekeeping |
| **Biweekly/Monthly** | 4 | auth-audit, security-scan, monthly-audit |

## SSH Access

```bash
# Quick access
ssh admin100@192.168.101.113

# With port forwards (for Cursor / CC Mobile)
ssh -L 11435:localhost:11434 \
    -L 9998:localhost:9999 \
    -L 8081:localhost:8081 \
    admin100@192.168.101.113

# SSH config (recommended)
# See: ./infrastructure/dgx-spark/deploy.sh --ssh-config
```

## Deploy Commands

```bash
# Full deploy (from any machine with SSH access)
./infrastructure/dgx-spark/deploy.sh

# Check status
./infrastructure/dgx-spark/deploy.sh --status

# Restart services
./infrastructure/dgx-spark/deploy.sh --restart

# View logs
./infrastructure/dgx-spark/deploy.sh --logs

# Pull Ollama models
./infrastructure/dgx-spark/deploy.sh --models

# Stop (activates GitHub Actions failover)
./infrastructure/dgx-spark/deploy.sh --stop
```

## Cursor / CC Mobile Integration

**Cursor (Win11/Mac):**
1. SSH config with `LocalForward` for Ollama and heartbeat
2. Cursor → Settings → Models → Base URL = `http://localhost:11435/v1`
3. Model: `qwen2.5-coder:32b` or `llama3.3:70b`
4. Heartbeat dashboard: `http://localhost:9998/`

**CC Mobile (Claude Code on mobile):**
1. SSH tunnel via Termux: `ssh -L 11435:localhost:11434 admin100@192.168.101.113`
2. Deploy script works over SSH — all commands are remote
3. Heartbeat `/status` endpoint returns full JSON (CORS: *)

## Failover Behavior

| DGX Spark Status | GitHub Actions Behavior |
|-----------------|------------------------|
| **Healthy** | Skips scheduled runs (exit 0) |
| **Degraded** | Runs scheduled jobs (partial services down) |
| **Down** | Runs all scheduled jobs (full takeover) |
| **No heartbeat URL** | Runs as primary (backwards compatible) |

**Secret required:** Add `DGX_SPARK_HEARTBEAT_URL` to GitHub repository secrets. This should be the public URL of the heartbeat service (via Cloudflare Tunnel, ngrok, or public IP).

## Files Created

| File | Purpose |
|------|---------|
| `infrastructure/dgx-spark/docker-compose.yml` | All services (backend, cron, redis, heartbeat) |
| `infrastructure/dgx-spark/Dockerfile.backend` | DWS IQ Express server + agents |
| `infrastructure/dgx-spark/Dockerfile.cron` | Cron runner mirroring GitHub Actions |
| `infrastructure/dgx-spark/Dockerfile.heartbeat` | Health aggregator for failover |
| `infrastructure/dgx-spark/cron-runner.ts` | 23 cron jobs with execution logging |
| `infrastructure/dgx-spark/heartbeat.ts` | Service health checks + dashboard API |
| `infrastructure/dgx-spark/deploy.sh` | SSH deploy/status/restart/logs script |
| `infrastructure/dgx-spark/.env.example` | Environment template |
| `.github/actions/dgx-failover-check/action.yml` | Reusable failover check action |

## GitHub Actions Updated (10 workflows)

Re-enabled with failover check:
- `morning-briefing.yml`
- `construction-leads.yml`
- `captain-briefing.yml`
- `weekly-report.yml`
- `campaign-newsletter.yml`
- `regulation-monitor.yml`
- `social-scheduler.yml`
- `outreach-digest.yml`

Added failover check to already-active:
- `campaign-daily-posts.yml`
- `daily-db-backup.yml`
- `daily-site-backup.yml`

## Next Steps

1. **SSH to DGX Spark** and clone/pull the repo
2. **Copy .env** from `.env.example` and fill in secrets
3. **Pull Ollama models**: `./infrastructure/dgx-spark/deploy.sh --models`
4. **Deploy**: `./infrastructure/dgx-spark/deploy.sh`
5. **Set up Cloudflare Tunnel** (or ngrok) to expose heartbeat:9999 publicly
6. **Add GitHub secret** `DGX_SPARK_HEARTBEAT_URL` pointing to the public heartbeat URL
7. **Verify failover**: stop DGX Spark services → trigger workflow_dispatch → confirm GHA runs

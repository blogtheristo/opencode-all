# Field Note: DGX Spark — Primary 24/7 Runtime for All Agents & Cron

---

# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:

- Version: 1.3 | Tool: Claude Code | Session: claude/compare-qwen-deepseek-E6Gly | Date: 16.05.2026 | Changes: Upgraded Fast tier from Qwen 2.5 Coder 32B → Qwen3-Coder 30B (MoE 30B/3.3B active). Added Synth-data routing row (SyntheticDataAgent teacher via NeMo DataDesigner). Added "Next Steps — NVFP4 path" section covering Blackwell FP4 cores, Nemotron 3 Super/Ultra context, and compute-scarcity hedge rationale. Memory budget refreshed (~19GB Qwen, ~49GB headroom).
- Version: 1.2 | Tool: Claude Opus 4.6 | Session: claude/mvp-missing-features-pS9La | Date: 13.04.2026 | Changes: Added "Host Paths on DGX Spark" section with exact absolute paths (dws6 repo, docker-compose.yml, env file, logs, Ollama models) + rebuild playbook to prevent "stale container" confusion after host git pull
- Version: 1.1 | Tool: Claude Opus 4.6 | Session: claude/dgx-spark-setup-UN9WR | Date: 29.03.2026 | Changes: Deployment complete — 4 containers healthy, Cloudflare Tunnel live (heartbeat.dws6.com), systemd auto-start, CORS hardened (LAN-only), syntax fixes in data-collectors.ts and briefing-template.ts
- Version: 1.0 | Tool: Claude Opus 4.6 | Session: claude/dgx-spark-setup-UN9WR | Date: 29.03.2026 | Changes: Initial setup — DGX Spark as primary runtime, GitHub Actions as failover, SSH deploy, heartbeat system, model routing

Document Status:

- Created: 29.03.2026
- Last Modified: 16.05.2026
- Language: English
- Publication Status: ACTIVE
- Document Type: Field Note / Infrastructure

Related Documents:

- docs/field-notes/2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md
- docs/field-notes/2026-03-10-acer-dgx-sandbox-strategy.md
- docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md
- infrastructure/dgx-spark/docker-compose.yml
- infrastructure/dgx-spark/deploy.sh

---

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
│  │  node-cron    │  │  mirrors GHA  │  │  LAN-only    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐                     │
│  │  Ollama       │  │  Redis       │                     │
│  │  :11434       │  │  :6379       │                     │
│  │  Llama 70B    │  │  job queue   │                     │
│  │  Qwen3-Coder  │  │              │                     │
│  │  30B (MoE)    │  │              │                     │
│  └──────────────┘  └──────────────┘                     │
│                                                          │
│  SSH: admin100@192.168.101.113                           │
└──────────────────┬──────────────────────────────────────┘
                   │ Cloudflare Tunnel (systemd)
                   ▼
┌─────────────────────────────────────────────────────────┐
│          CLOUDFLARE TUNNEL (dgx-heartbeat)               │
│  heartbeat.dws6.com → localhost:9999                     │
│  Tunnel ID: b2d1d6e8-28e5-48e0-a2d5-3d5b702ead8b       │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────────────────────┐
│              GITHUB ACTIONS (FAILOVER)                   │
│                                                          │
│  Each scheduled workflow:                                │
│    1. curl https://heartbeat.dws6.com/health             │
│    2. If 200 → skip (exit 0)                             │
│    3. If 503 / unreachable → run job (take over)         │
│    4. workflow_dispatch always runs                       │
└─────────────────────────────────────────────────────────┘
```

## Deployment Status (29.03.2026)

All services verified live:

| Container     | Status         | Port | Verified                                       |
| ------------- | -------------- | ---- | ---------------------------------------------- |
| dws-redis     | healthy        | 6379 | `redis-cli ping` → PONG                        |
| dws-backend   | healthy        | 8080 | `curl localhost:8080/api/health` → 200         |
| dws-cron      | healthy        | 8081 | 17 enabled jobs running                        |
| dws-heartbeat | healthy        | 9999 | `curl localhost:9999/health` → 200             |
| cloudflared   | systemd active | —    | `curl https://heartbeat.dws6.com/health` → 200 |

**GitHub secret:** `DGX_SPARK_HEARTBEAT_URL` = `https://heartbeat.dws6.com/health`

## Host Paths on DGX Spark (gn100-cb5d)

Exact absolute paths on the Acer Veriton GN100 host (`admin100@192.168.101.113`). Use these when debugging, pulling, or rebuilding — don't guess.

| Purpose                    | Absolute Path                                                                 |
| -------------------------- | ----------------------------------------------------------------------------- |
| **Repo root**              | `/home/admin100/dws6`                                                         |
| **Compose file**           | `/home/admin100/dws6/infrastructure/dgx-spark/docker-compose.yml`             |
| **Cron Dockerfile**        | `/home/admin100/dws6/infrastructure/dgx-spark/Dockerfile.cron`                |
| **Backend Dockerfile**     | `/home/admin100/dws6/infrastructure/dgx-spark/Dockerfile.backend`             |
| **Env file (for compose)** | `/home/admin100/dws6/infrastructure/dgx-spark/.env`                           |
| **Repo-level .env**        | `/home/admin100/dws6/.env`                                                    |
| **Cron-runner source**     | `/home/admin100/dws6/infrastructure/dgx-spark/cron-runner.ts`                 |
| **Morning brief script**   | `/home/admin100/dws6/scripts/send-morning-brief-v2.ts`                        |
| **Ollama models (host)**   | `/usr/share/ollama/.ollama/models/`                                           |
| **Backend logs volume**    | Docker volume `dgx-spark_backend-logs` (inspect with `docker volume inspect`) |

**Inside containers:**

- App root: `/app`
- Scripts: `/app/scripts/`
- Logs: `/app/logs/`
- State (cron last-run JSON): `/app/state/cron-state.json`
- Execution log (JSONL): `/app/logs/cron-executions.jsonl`
- Email audit log: `/app/logs/email-audit.jsonl`

## Rebuild Playbook (CRITICAL — Prevents "Stale Container" Trap)

**Symptom of a stale container:** `docker logs dws-cron` shows old job names, old errors, or `Cannot find module 'scripts/send-morning-brief-v2.ts'` even though the file exists on the host. Cause: `git pull` updates the host files but Docker still runs whatever image it built last time. **Host `apt upgrade` and host `git pull` do NOT propagate into running containers.**

Always use this 4-step playbook after pulling new code or after host security updates:

```bash
# 1. Sync repo on DGX host
cd /home/admin100/dws6
git fetch origin <branch-name>
git checkout <branch-name>
git pull origin <branch-name>
git log --oneline -1   # note the commit hash you're about to deploy

# 2. Rebuild the affected container with --no-cache
cd /home/admin100/dws6/infrastructure/dgx-spark
docker compose build --no-cache dws-cron    # or dws-backend, etc.

# 3. Recreate the container (stops old, starts new)
docker compose up -d --force-recreate dws-cron

# 4. Verify the new code is actually inside the running container
docker exec dws-cron grep -n "<something-new-from-this-commit>" /app/cron-runner.ts
docker exec dws-cron ls -la /app/scripts/<new-script>.ts
```

**Why `--no-cache` matters:** without it, Docker can reuse a cached `COPY` layer if it thinks the files haven't changed. Force a clean build to eliminate that class of surprise.

**Why host `apt upgrade` doesn't touch containers:** Docker images are immutable snapshots built from a base image (`node:22-slim`). `apt upgrade` on the host only updates host binaries. To pick up an updated base image after host security updates, also run `docker compose build --no-cache --pull dws-cron` (the `--pull` flag fetches the latest `node:22-slim` from the registry).

## Hardware & System Limits

| Spec        | Value                              | Implication                                                   |
| ----------- | ---------------------------------- | ------------------------------------------------------------- |
| **CPU**     | ARM Cortex-X925, 10 cores @ 3.9GHz | Docker images must be `linux/arm64`                           |
| **RAM**     | 128GB unified                      | Llama 70B Q4 (~40GB) + Qwen 32B (~20GB) + services fit easily |
| **Storage** | 3TB NVMe                           | Model storage, backups, logs — no issue                       |
| **AI**      | 1 PFLOP (GB10)                     | 70B model inference at full speed                             |
| **OS**      | Ubuntu 24.04 LTS                   | Docker, systemd, Ollama all native                            |
| **Network** | Local LAN (192.168.101.x)          | SSH tunnel for remote access                                  |

## Model Routing Strategy

| Tier             | Model                   | Where               | Cost      | Use Case                              |
| ---------------- | ----------------------- | ------------------- | --------- | ------------------------------------- |
| **Primary**      | Llama 3.3 70B           | Ollama on DGX Spark | €0        | 14 of 16 agents                       |
| **Fast**         | Qwen3-Coder 30B (MoE)   | Ollama on DGX Spark | €0        | Code generation, quick tasks          |
| **Synth-data**   | Qwen3-Coder 30B (MoE)   | Ollama on DGX Spark | €0        | SyntheticDataAgent teacher (CBAM / ESRS / EPBD seeding via NeMo DataDesigner) |
| **Cloud**        | Claude Opus 4.6         | Anthropic API       | Per-token | Designer agent, complex orchestration |
| **Fallback**     | Llama 3.3 70B Versatile | Groq API            | Per-token | Burst capacity when DGX is loaded     |

Qwen3-Coder is a Mixture-of-Experts model: 30B total parameters with only 3.3B active per token. Inference is faster than the previous dense Qwen 2.5 Coder 32B despite a comparable disk/VRAM footprint, which is why the Fast tier and the synthetic-data teacher slot share the same weights — one pull, two roles.

**Memory budget:**

- Llama 3.3 70B Q4: ~40GB
- Qwen3-Coder 30B Q4 (MoE): ~19GB
- DWS Backend + Cron + Redis: ~12GB
- OS + Docker overhead: ~8GB
- **Available headroom: ~49GB** (enough for additional models or higher quantization)

## Next Steps — NVFP4 path (strategic, Track 2)

The Spark's GB10 ships Blackwell FP4 tensor cores. Running Qwen3-Coder as Q4 GGUF through Ollama uses general-purpose CUDA, not the FP4 path — we leave Blackwell's hardware moat on the table. Two strategic moves:

1. **Native NVFP4 serving for Qwen.** Move the Fast / Synth-data slot off Ollama Q4 onto NVIDIA's native stack — TensorRT-LLM or NIM with a Qwen3-Coder build in NVFP4. Expected: significantly higher tokens/sec on the same hardware, and tighter alignment with the path NVIDIA itself is taking with Nemotron 3 Super (120B, 25T tokens, pretrained NVFP4) and Nemotron 3 Ultra (~500B, pretrained NVFP4). Pretraining directly in NVFP4 at 500B scale is new ground — most labs still BF16-pretrain and post-quantize.
2. **Compute-scarcity hedge.** Anthropic has already secured ≥5GW across AWS / Google / Azure / Fluidstack / CoreWeave and now added SpaceX Colossus 1 (300MW+, 220k+ NVIDIA GPUs). The bottleneck for everyone behind that wave is delivered power + GPUs actually online. The Spark is **owned, EU-sited, fixed-power compute we already control** — pre-positioning Qwen on its native FP4 stack now means we are not bidding into the shortage when synthetic-data demand (CBAM / ESRS / EPBD generation) scales.

This stays a planning note in this PR — actual NIM / TensorRT-LLM integration is a separate workstream because it replaces the `:11434` Ollama endpoint that 14 agents + `scripts/ollama-spark.sh` target.

Market-signal references (Anthropic compute deals, SpaceX orbital concept, $NBIS / $IREN comps) belong in `docs/PHD_FIREHORSE_EN.md` / `docs/PHD_FIREHORSE_FI.md` per the CLAUDE.md thesis split, not here.

## Cron Jobs — 23 Schedules Mirrored

All GitHub Actions cron schedules are duplicated in `infrastructure/dgx-spark/cron-runner.ts`:

| Frequency            | Jobs | Examples                                                                   |
| -------------------- | ---- | -------------------------------------------------------------------------- |
| **Daily**            | 11   | site-backup, db-backup, campaign-posts, briefings, leads, outreach         |
| **Weekly**           | 8    | report, newsletter, market-research, roadmap, security-audit, housekeeping |
| **Biweekly/Monthly** | 4    | auth-audit, security-scan, monthly-audit                                   |

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
3. Model: `qwen3-coder:30b` or `llama3.3:70b`
4. Heartbeat dashboard: `http://localhost:9998/`

**CC Mobile (Claude Code on mobile):**

1. SSH tunnel via Termux: `ssh -L 11435:localhost:11434 admin100@192.168.101.113`
2. Deploy script works over SSH — all commands are remote
3. Heartbeat `/status` endpoint returns full JSON (CORS: \*)

## Failover Behavior

| DGX Spark Status     | GitHub Actions Behavior                                             |
| -------------------- | ------------------------------------------------------------------- |
| **Healthy** (200)    | Skips scheduled runs (exit 0)                                       |
| **Degraded** (200)   | Skips scheduled runs — DGX Spark still alive, avoids duplicate jobs |
| **Down** (503)       | Runs all scheduled jobs (full takeover)                             |
| **No heartbeat URL** | Runs as primary (backwards compatible)                              |

**Secret required:** Add `DGX_SPARK_HEARTBEAT_URL` to GitHub repository secrets. This should be the public URL of the heartbeat service (via Cloudflare Tunnel, ngrok, or public IP).

## Files Created

| File                                            | Purpose                                        |
| ----------------------------------------------- | ---------------------------------------------- |
| `infrastructure/dgx-spark/docker-compose.yml`   | All services (backend, cron, redis, heartbeat) |
| `infrastructure/dgx-spark/Dockerfile.backend`   | DWS IQ Express server + agents                 |
| `infrastructure/dgx-spark/Dockerfile.cron`      | Cron runner mirroring GitHub Actions           |
| `infrastructure/dgx-spark/Dockerfile.heartbeat` | Health aggregator for failover                 |
| `infrastructure/dgx-spark/cron-runner.ts`       | 23 cron jobs with execution logging            |
| `infrastructure/dgx-spark/heartbeat.ts`         | Service health checks + dashboard API          |
| `infrastructure/dgx-spark/deploy.sh`            | SSH deploy/status/restart/logs script          |
| `infrastructure/dgx-spark/.env.example`         | Environment template                           |
| `.github/actions/dgx-failover-check/action.yml` | Reusable failover check action                 |

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

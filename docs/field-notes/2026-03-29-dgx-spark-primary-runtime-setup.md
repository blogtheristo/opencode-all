# Field Note: DGX Spark — Primary 24/7 Runtime for All Agents & Cron

---

# VERSION AND AGENT HISTORY

Version: 1.7

Sessions & Modifications:

- Version: 1.7 | Tool: Claude Code | Session: claude/compare-qwen-deepseek-E6Gly | Date: 16.05.2026 | Changes: Added `--models-cleanup` flag to `deploy.sh` + `Deploy-DgxSpark.ps1` for destructive removal of deprecated `llama3.3:70b` and `qwen2.5-coder:32b`. Separate from `--models` on purpose: requires explicit `remove` confirmation prompt, intended to run only after the new Primary + Fast tiers are verified in production. Field note documents the warm-rollback policy (May 2026): all four models stay on disk during transition — Spark NVMe has ~3TB, no constraint, RAM unaffected because Ollama lazy-loads.
- Version: 1.6 | Tool: Claude Code | Session: claude/compare-qwen-deepseek-E6Gly | Date: 16.05.2026 | Changes: Wired OpenClaw into the docker-compose stack as a first-class service (port 8090) — image parameterised via `OPENCLAW_IMAGE` env var, `OPENCLAW_ALLOW_EGRESS=false` enforces no-egress posture, persistent state and logs volumes added. Heartbeat service now polls `CHECK_OPENCLAW=http://openclaw:8090/health` alongside backend/cron/ollama. `deploy.sh` post-deploy health-check sequence prints OpenClaw status. Container table and Host Paths table updated. Deployment status snapshot row marked `(post-deploy)` — full healthy confirmation will land on first deploy.
- Version: 1.5 | Tool: Claude Code | Session: claude/compare-qwen-deepseek-E6Gly | Date: 16.05.2026 | Changes: Added OpenClaw as a tracked Spark service — local autonomous agent runtime with Brain wired to `nemotron-3-super` via Ollama. Architecture diagram now shows OpenClaw alongside Ollama/Redis. New "OpenClaw — local autonomous agent runtime" section clarifies the EU-sovereign no-egress role, its complementarity with the cloud-side `clawdbot` skill, and the workload pairings (private data analysis, confidential code review, long-document reasoning at 256K).
- Version: 1.4 | Tool: Claude Code | Session: claude/compare-qwen-deepseek-E6Gly | Date: 16.05.2026 | Changes: Replaced Primary tier Llama 3.3 70B (dense, ~4.4 tok/s) → Nemotron 3 Super (NVIDIA `nemotron_h_moe`, 123.6B/12.7B active, Mamba-2 + attention + Latent MoE, ~19.5 tok/s on DGX Spark Q4_K_M — ~4.5× faster). Memory budget tightened (~126GB committed, ~2GB headroom — relies on Ollama lazy-load + `OLLAMA_KEEP_ALIVE` to avoid simultaneous-hot OOM). Added operational notes: Ollama 0.17.1+ requirement, default ctx 262144 (1M = OOM), NVIDIA sampling defaults (temp 1.0 chat / 0.6 + top_p 0.95 tool calls). Hardware table refreshed with GB10 GPU specs, 20-core ARM split, 240W power, form factor.
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
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Ollama       │  │  Redis       │  │  OpenClaw    │  │
│  │  :11434       │  │  :6379       │  │  agent rt    │  │
│  │  Nemotron 3   │  │  job queue   │  │  Brain →     │  │
│  │  Super (MoE)  │  │              │  │  Nemotron 3  │  │
│  │  Qwen3-Coder  │  │              │  │  Super (Ollama)│  │
│  │  30B (MoE)    │  │              │  │  no egress   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
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
| dws-openclaw  | (post-deploy)  | 8090 | `curl localhost:8090/health` → 200 — local agent runtime, no egress |
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
| **OpenClaw image (env)**   | `OPENCLAW_IMAGE` in `infrastructure/dgx-spark/.env` (default `ghcr.io/openclaw/openclaw:latest`) |
| **OpenClaw state volume**  | Docker volume `dgx-spark_openclaw-state`                                      |
| **OpenClaw logs volume**   | Docker volume `dgx-spark_openclaw-logs`                                       |
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
| **CPU**     | 20-core ARM (10× Cortex-X925 + 10× Cortex-A725) | Docker images must be `linux/arm64`                           |
| **GPU**     | 6,144 CUDA cores, 5th-gen Tensor (GB10 Grace Blackwell) | NVFP4 sparse: 1 PFLOP                                  |
| **RAM**     | 128GB unified LPDDR5x (273 GB/s)   | Nemotron 3 Super Q4_K_M (~87GB) + Qwen3-Coder 30B Q4 (~19GB) + services — tight; see budget below |
| **Storage** | 3TB NVMe                           | Model storage, backups, logs — no issue                       |
| **AI**      | 1 PFLOP FP4 sparse (GB10)          | MoE inference at decode bandwidth limit (~19.5 tok/s Nemotron) |
| **Power**   | 240W                               | Form factor: 150×150×50 mm, 1.2 kg — desktop AI box           |
| **OS**      | Ubuntu 24.04 LTS                   | Docker, systemd, Ollama all native                            |
| **Network** | Local LAN (192.168.101.x)          | SSH tunnel for remote access                                  |

## Model Routing Strategy

| Tier             | Model                   | Where               | Cost      | Use Case                              |
| ---------------- | ----------------------- | ------------------- | --------- | ------------------------------------- |
| **Primary**      | Nemotron 3 Super (MoE)  | Ollama on DGX Spark | €0        | 14 of 16 agents; agentic reasoning, long-context workflows |
| **Fast**         | Qwen3-Coder 30B (MoE)   | Ollama on DGX Spark | €0        | Code generation, quick tasks          |
| **Synth-data**   | Qwen3-Coder 30B (MoE)   | Ollama on DGX Spark | €0        | SyntheticDataAgent teacher (CBAM / ESRS / EPBD seeding via NeMo DataDesigner) |
| **Cloud**        | Claude Opus 4.6         | Anthropic API       | Per-token | Designer agent, complex orchestration |
| **Fallback**     | Llama 3.3 70B Versatile | Groq API            | Per-token | Burst capacity when DGX is loaded     |

**Nemotron 3 Super** (NVIDIA, architecture `nemotron_h_moe`): 123.6B total parameters, ~12.7B active per token (~10:1 sparsity). 88 layers — mostly Mamba-2 state-space blocks (linear time, fixed-size state, no KV cache growth) with interleaved Grouped-Query attention (32Q / 2KV, head dim 128) at strategic depths and Latent MoE layers that route 4× more experts per token at standard-MoE cost. Pretrained natively in NVFP4 across 25T tokens. Capabilities: `completion`, `tools`, `thinking`. On the DGX Spark Q4_K_M: prompt-eval ~3.51 tok/s, eval ~19.5 tok/s — **~4.5× faster than dense Llama 3.3 70B on the same hardware** because MoE moves ~12B of weights through the 273 GB/s memory bus per token instead of all 70B. Requires Ollama ≥ 0.17.1.

**Qwen3-Coder** is a Mixture-of-Experts model: 30B total parameters with only 3.3B active per token. Inference is faster than the previous dense Qwen 2.5 Coder 32B despite a comparable disk/VRAM footprint, which is why the Fast tier and the synthetic-data teacher slot share the same weights — one pull, two roles.

**Memory budget (128GB unified LPDDR5x):**

- Nemotron 3 Super Q4_K_M: ~87GB
- Qwen3-Coder 30B Q4 (MoE): ~19GB
- DWS Backend + Cron + Redis: ~12GB
- OS + Docker overhead: ~8GB
- **Committed if both models hot: ~126GB → ~2GB headroom (tight)**

Both models loaded simultaneously leaves effectively no room for KV cache growth. In practice, Ollama lazy-loads on request and unloads idle models after `OLLAMA_KEEP_ALIVE` (default 5m), so usually only one large model is hot at a time. Cold-load penalty on tier switch (~30–60s for Nemotron from NVMe). For workloads that flip frequently between Primary and Fast, set `OLLAMA_KEEP_ALIVE=15m` to reduce thrash at the cost of higher steady-state memory pressure.

**Ollama context limits:** `ollama show nemotron-3-super` reports default context 262144 (256K). The model's theoretical max is 1M tokens; setting `--ctx-size` to 1M on the Spark triggers CUDA OOM. Practical range on the Spark: 16384 to 262144. Use NVIDIA's recommended sampling: `temperature=1.0` for chat, `temperature=0.6 top_p=0.95` for tool calling.

**Warm-rollback policy (May 2026):** All four models stay on disk during the Nemotron / Qwen3-Coder transition — `nemotron-3-super` + `qwen3-coder:30b` (new Primary + Fast) and `llama3.3:70b` + `qwen2.5-coder:32b` (deprecated, kept as warm rollback). Total disk: ~166GB of the Spark's 3TB NVMe; no constraint. RAM is unaffected (Ollama lazy-loads, only one big model hot at a time). To remove the deprecated pair once the new models are verified in production, run `./infrastructure/dgx-spark/deploy.sh --models-cleanup` — destructive, prompts to confirm with `remove`, reclaims ~60GB.

## OpenClaw — local autonomous agent runtime

OpenClaw is an open-source agent framework running directly on the Spark, with its Brain wired to `nemotron-3-super` via Ollama at `http://localhost:11434`. It is the **EU-sovereign autonomous-agent surface**: every reasoning step, tool call, and intermediate artifact stays inside the 192.168.101.x LAN. No network egress by default.

This is the runtime for workloads that cannot legally or commercially touch a cloud provider — healthcare / finance / legal / defense data, confidential codebases under code review, full-stack long-document reasoning where the 256K context lets us load entire spec bundles without RAG. It complements rather than replaces the `clawdbot` skill: `clawdbot` is the session janitor over Claude Code transcripts (cloud-bound, Anthropic side); OpenClaw is the local agent runtime (Spark side, Nemotron-backed, no egress). Different surfaces, different trust boundaries, both kept.

Concrete pairings:

- **Private data analysis** (healthcare, finance, legal, defense) — clients whose data cannot leave the building call OpenClaw on the Spark; output streams back over LAN/VPN only.
- **Confidential code review** — Nemotron's PinchBench / Qodo code-review scores (~73% precision) make this practical on code that cannot ship to GitHub Copilot or Cursor cloud.
- **Long-document reasoning** — load entire codebases, regulation bundles (CSRD ESRS package, CBAM Implementing Regulation, EU AI Act consolidated text) into one 256K-token context, no chunking, no RAG.

When OpenClaw is the active workload, the routing strategy above still applies — OpenClaw issues completion / tool / thinking requests against `nemotron-3-super` (Primary) and falls through to `qwen3-coder:30b` (Fast) for code-heavy subtasks via the same `OLLAMA_BASE_URL` other Spark services use.

## Next Steps — NVFP4 path (strategic, Track 2)

The Spark's GB10 ships Blackwell FP4 tensor cores. Nemotron 3 Super was pretrained natively in NVFP4 across 25T tokens, but we are serving it as Q4_K_M GGUF through Ollama — Ollama's CUDA path doesn't dispatch to the FP4 tensor cores, so we're leaving the Blackwell hardware moat on the table even with the right weights. Two moves to close that gap:

1. **Native NVFP4 serving for Nemotron + Qwen.** Stand up TensorRT-LLM or NIM alongside Ollama and route the Primary + Fast tiers there in NVFP4. Expected: another step up over the current ~19.5 tok/s on Nemotron, tighter latency tails, and access to thinking-mode / tool-calling features the model exposes natively. The same path applies upward to Nemotron 3 Ultra (~500B, also pretrained NVFP4) when 1.6T-class workloads land — 500B NVFP4 pretrain is new ground vs the industry default of BF16-pretrain then post-quantize.
2. **Compute-scarcity hedge.** Anthropic has already secured ≥5GW across AWS / Google / Azure / Fluidstack / CoreWeave and now added SpaceX Colossus 1 (300MW+, 220k+ NVIDIA GPUs). The bottleneck for everyone behind that wave is delivered power + GPUs actually online. The Spark is **owned, EU-sited, fixed-power compute we already control** — pre-positioning the stack on its native FP4 path now means we are not bidding into the shortage when synthetic-data demand (CBAM / ESRS / EPBD generation) scales.

This stays a planning note in this PR — actual NIM / TensorRT-LLM integration is a separate workstream because it replaces the `:11434` Ollama endpoint that 14 agents + `scripts/ollama-spark.sh` target. Build flag note for the llama.cpp path: `-DCMAKE_CUDA_ARCHITECTURES="121"` for GB10 (without it, CPU-only fallback).

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
3. Model: `qwen3-coder:30b` or `nemotron-3-super`
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

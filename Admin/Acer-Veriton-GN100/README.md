# Acer Veriton GN100 — Edge AI Lab Device

***
# VERSION AND AGENT HISTORY

Version: 1.6

Sessions & Modifications:
  - Version: 1.6 | Tool: GPT-5.4 | Date: 11.03.2026 | Changes: Added Veriton Edge Stack Runbook and client endpoint templates for Control Room / Situation Room delivery
  - Version: 1.6 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Add Edge PostgreSQL section — TimescaleDB + pg_duckdb + pgvector Docker setup, SSH deployment script, GN100-tuned configuration
  - Version: 1.5 | Tool: Claude Code | Date: 11.03.2026 | Changes: Add successful NVIDIA PyTorch ARM64 container validation, record GB10 support warning, and promote NVIDIA NGC PyTorch as validated GN100 baseline
  - Version: 1.4 | Tool: Claude Code | Date: 11.03.2026 | Changes: Document GN100 Docker/CUDA validation, confirm ARM64 host environment, record NVIDIA GB10 runtime status, and set ARM64-first PyTorch container decision
  - Version: 1.3 | Tool: Claude Code | Date: 11.03.2026 | Changes: Add Ollama systemd override runbook, remote bind verification, Continue CLI/extension base URL guidance, and direct-vs-local troubleshooting
  - Version: 1.2 | Tool: Claude Code | Date: 04.03.2026 | Changes: Added Ollama & IDE clients (Cursor, Cline) — OpenAI-compatible baseUrl, pointer to field note
  - Version: 1.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: Added OpenSandbox section — server setup, env vars, MCP tools, NIS2 statement for Stage 1.5 agent sandboxing
  - Version: 1.0 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/optimistic-burnell | Date: 27.02.2026 | Changes: Initial creation — Admin folder for Acer Veriton GN100 edge AI device

Session Links & References:
  - Claude Code (claude/optimistic-burnell): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/Acer-Veriton-GN100/README.md

Document Status:
  - Created: 27.02.2026
  - Last Modified: 13.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Device Overview

| Field | Value |
|-------|-------|
| **Manufacturer** | Acer Inc. |
| **Model** | Acer Veriton GN100 |
| **Hostname** | gn100-cb5d |
| **OS** | Ubuntu 24.04.4 LTS |
| **CPU** | ARM Cortex-X925, 10 cores @ 3.9GHz |
| **Architecture** | aarch64 / ARM64 |
| **Memory** | 120 GiB |
| **GPU** | NVIDIA GB10 |
| **Asset Tag** | DTR6LEH002547000426700 |
| **Machine ID** | 435bf64de6f94bfa93dca976e55670bd |
| **Role** | Lifetime Fleet — Edge AI inference & development |

## Software Stack

- **NVIDIA AI Workbench** — Local AI development environment
- **CUDA** — GPU compute (version TBD)
- **Docker** — Container runtime for edge agents
- **OpenSandbox** — Agent isolation platform (Stage 1.5 sandbox)

## 2026-03-11 Environment Validation

The GN100 environment was validated during a Docker + CUDA troubleshooting session on 11.03.2026.

### Verified host state

| Check | Result |
|-------|--------|
| `docker info --format '{{.OSType}}/{{.Architecture}}'` | `linux/aarch64` |
| `uname -m` | `aarch64` |
| `nvidia-smi` | Healthy; full table rendered |
| GPU reported by `nvidia-smi` | `NVIDIA GB10` |
| Driver version | `580.126.09` |
| Host CUDA version | `13.0` |
| Kernel | `6.17.0-1008-nvidia` |

### Hardware description reconciliation

Earlier GN100 notes in the repo used a more generic hardware summary such as `CPU: 20 cores`. That description is retained as historical context only and should not be used as the authoritative platform description for container or architecture decisions.

For current technical work on GN100, the authoritative source order is:

1. Live host verification from the device (`uname -m`, `docker info`, `nvidia-smi`)
2. The detailed GN100 field note: `docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md`
3. This admin README

Current working assumption for engineering decisions:

- GN100 is an `aarch64 / ARM64` host
- The CPU/platform should be treated as ARM-based, not x86_64
- Container/image selection must follow ARM64 compatibility first

### Docker GPU validation

The following container test passed on GN100:

```bash
docker run --rm --gpus all nvidia/cuda:12.8.0-runtime-ubuntu24.04 nvidia-smi
```

**Meaning:** NVIDIA Container Toolkit, Docker GPU passthrough, and CUDA userspace handoff are working on this machine.

### PyTorch container finding

The generic upstream PyTorch image failed:

```bash
docker run --rm --gpus all pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime python -c "import torch; print(torch.cuda.is_available())"
```

**Root cause:** the image resolved to `linux/amd64` while GN100 is `linux/aarch64`. The failure was:

```text
exec /opt/conda/bin/python: exec format error
```

This was an image architecture mismatch, not a Docker GPU runtime failure.

An NVIDIA NGC PyTorch container was then validated successfully:

```bash
docker run --rm --gpus all nvcr.io/nvidia/pytorch:25.02-py3 python3 -c "import torch; print(torch.__version__); print(torch.cuda.is_available()); print(torch.cuda.get_device_name(0)); print(torch.version.cuda)"
```

Observed result:

```text
WARNING: Detected NVIDIA GB10 GPU, which may not yet be supported in this version of the container
2.7.0a0+ecf3bae40a.nv25.02
True
NVIDIA GB10
12.8
```

**Meaning:** the validated working PyTorch baseline on GN100 is `nvcr.io/nvidia/pytorch:25.02-py3`, with a compatibility-warning caveat for `NVIDIA GB10`.

### Operational decision

For GN100, use **Docker as the standard local runtime** for GPU validation, edge agent isolation, and future local model workloads.

ARM64 rules for this host:

- Prefer images that publish a native `linux/arm64` manifest
- Verify architecture before pull when image support is uncertain:

```bash
docker manifest inspect <image>:<tag>
```

- Do **not** use `--platform linux/amd64` for CUDA/PyTorch workloads on GN100 except temporary debugging
- Treat `nvidia/cuda:12.8.0-runtime-ubuntu24.04` as the known-good baseline image

### PyTorch strategy for GN100

Validated baseline:

1. `nvcr.io/nvidia/pytorch:25.02-py3` is confirmed working for basic CUDA/PyTorch validation on GN100.
2. Treat the `GB10 may not yet be supported` warning as a signal to test advanced workloads carefully.

Preferred order:

1. Use `nvcr.io/nvidia/pytorch:<tag>` when the tag includes an `arm64` manifest.
2. If NVIDIA PyTorch image support is missing or unsuitable, build from the known-good CUDA base image (`nvidia/cuda:12.8.0-runtime-ubuntu24.04`) and install an ARM64-compatible PyTorch distribution.
3. Avoid generic `pytorch/pytorch` tags unless manifest inspection confirms `linux/arm64` support.

### Runtime notes

- `nvidia-ctk runtime configure --runtime=docker` requires `sudo` to write `/etc/docker/daemon.json`
- Earlier `gpu requires reset` errors cleared once the host GPU returned to a healthy state; later Docker CUDA validation succeeded without additional runtime changes
- Container timestamps may differ from host local time if the container runs in UTC

## OpenSandbox — Agent Sandboxing

The Acer Veriton GN100 hosts the **OpenSandbox server** for DWS IQ 6 agent sandboxing (Stage 1.5).

OpenSandbox provides Docker-based isolation for AI agents: each task runs in a dedicated ephemeral container. Data never leaves the Veriton.

### Server Setup

```bash
# Install
pip install opensandbox-server

# Initialize Docker config
opensandbox-server init-config ~/.sandbox.toml --example docker

# Start (listens on :8080)
opensandbox-server

# (Optional) Run as systemd service
sudo systemctl enable opensandbox
sudo systemctl start opensandbox
```

### Environment Variables (on DWS backend / MCP hub)

```
SANDBOX_STAGE=opensandbox
OPENSANDBOX_HOST=http://2001:14ba:a1b0:a500:ec74:7c47:3601:204f:8080  # IPv6
# or local network IP:
OPENSANDBOX_HOST=http://192.168.X.X:8080
OPENSANDBOX_API_KEY=<secret>
OPENSANDBOX_IMAGE=opensandbox/code-interpreter:v1.0.1
OPENSANDBOX_TIMEOUT_MS=300000
```

### MCP Tools (via mcp-hub /sandbox/*)

| Endpoint | Purpose |
|----------|---------|
| `GET /sandbox/ping` | Health check connectivity to Veriton |
| `POST /sandbox/create` | Create isolated Docker container |
| `POST /sandbox/execute` | Run command inside container |
| `POST /sandbox/file/read` | Read file from container |
| `POST /sandbox/file/write` | Write files to container |
| `POST /sandbox/destroy` | Destroy container (ephemeral) |
| `GET /sandbox/tools` | List all MCP tool schemas |

### Security Properties

| Property | How Enforced |
|----------|-------------|
| Filesystem isolation | Each task in dedicated container |
| Network egress | Deny-by-default, explicit allow-list |
| Data residency | On-premise Veriton hardware (Helsinki Lab) |
| Ephemeral | Container destroyed after each task |
| Cross-agent privilege | `file_access_control.py` protects config paths |

**NIS2 audit statement:**
> "OpenSandbox Stage 1.5 executes each agent task in an ephemeral Docker container on the Acer Veriton GN100. Containers are destroyed post-task. Data residency is enforced at hardware level — no agent data leaves the device."

See: `DWS_SECURITY_STANDARD.md §14.6`, `src/sandbox/opensandbox.ts`, `mcp-hub/services/opensandbox_mcp.py`

## Ollama & IDE clients (Cursor, Cline, Continue)

If **Ollama** is running on the Veriton (e.g. Qwen), it exposes an inference API on port `11434`.

### Host-side requirement

Local-only bind (`127.0.0.1:11434`) is not enough for remote IDE clients. The host must listen on all interfaces:

```bash
ss -ltnp | grep 11434
```

**Good:**
```text
LISTEN ... *:11434 ... /usr/local/bin/ollama serve
```

**Bad:**
```text
LISTEN ... 127.0.0.1:11434 ...
```

### Permanent Ubuntu systemd configuration

Check the service:

```bash
systemctl status ollama
systemctl cat ollama
```

Create systemd override:

```bash
sudo mkdir -p /etc/systemd/system/ollama.service.d
printf '[Service]\nEnvironment="OLLAMA_HOST=0.0.0.0:11434"\n' | sudo tee /etc/systemd/system/ollama.service.d/override.conf
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

Verify:

```bash
systemctl show ollama --property=Environment
ss -ltnp | grep 11434
curl http://127.0.0.1:11434/api/tags
```

Expected:
- `Environment=... OLLAMA_HOST=0.0.0.0:11434`
- `ss` shows `*:11434` or `0.0.0.0:11434`
- `curl` returns model JSON

### Continue CLI / Continue extension base URL

If Continue runs on another machine, its base URL must point to the Veriton host:

```text
http://<veriton-ip-or-hostname>:11434
```

Examples:
- `http://gn100-cb5d:11434`
- `http://192.168.x.x:11434`

Use the same host:port in Continue CLI and Continue extension model/provider configuration.

### Cursor / Cline / Continue guidance

- If the tool expects an Ollama-native endpoint, use `http://<veriton-ip-or-hostname>:11434`
- If the tool expects an OpenAI-compatible proxy layer, verify the client’s provider docs before appending `/v1`
- Always test the raw host first with:

```bash
curl http://<veriton-ip-or-hostname>:11434/api/tags
```

If this fails, the IDE client will fail too.

### Common failure pattern

If `curl http://127.0.0.1:11434/api/tags` works on the Veriton but the IDE client cannot connect:
- Ollama is healthy locally
- the service is probably bound only to `127.0.0.1`, or
- firewall/VPN routing blocks remote access to `11434`

### Safer alternative: SSH tunnel

If exposing Ollama on the network is not acceptable:

```bash
ssh -L 11434:127.0.0.1:11434 admin100@gn100-cb5d
```

Then point Continue/Cursor/Cline locally to:

```text
http://127.0.0.1:11434
```

## Related Documents

| Document | Location |
|----------|----------|
| Veriton Edge Stack Runbook | `Admin/Acer-Veriton-GN100/VERITON_EDGE_STACK_RUNBOOK.md` |
| Client endpoint templates | `Admin/Acer-Veriton-GN100/templates/CLIENT_ENDPOINT_TEMPLATES.md` |
| Continue tunnel template | `Admin/Acer-Veriton-GN100/templates/continue-ollama-tunnel.yaml` |
| Continue direct template | `Admin/Acer-Veriton-GN100/templates/continue-ollama-direct.yaml` |
| Client Veriton offers | `Admin/Acer-Veriton-GN100/CLIENT_VERITON_OFFERS_EN_v1.md` |
| Veriton config template | `Admin/Acer-Veriton-GN100/templates/veriton-edge-config.example` |
| Edge PostgreSQL setup (2026-03-13) | `docs/field-notes/2026-03-13-acer-gn100-edge-postgres-setup.md` |
| Docker + CUDA validation (2026-03-11) | `docs/field-notes/2026-03-11-veriton-gn100-docker-cuda-validation.md` |
| Ollama + dev environment (Cursor, Cline, Claude Code) | `docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md` |
| NVIDIA GPG Key Fix (2026-02-27) | `docs/field-notes/2026-02-27-acer-veriton-gn100-nvidia-gpg-key-fix.md` |
| OpenSandbox TypeScript Integration | `src/sandbox/opensandbox.ts` |
| OpenSandbox MCP Service (Python) | `mcp-hub/services/opensandbox_mcp.py` |
| Security Standard §14.6 | `DWS_SECURITY_STANDARD.md` |

## Edge PostgreSQL — TimescaleDB + pg_duckdb + pgvector

A Docker-based PostgreSQL 16 instance runs on the GN100 for edge analytics, time-series telemetry, and local vector search.

### Extensions

| Extension | Version | Purpose |
|-----------|---------|---------|
| TimescaleDB | 2.x | Time-series hypertables, compression, continuous aggregates |
| pg_duckdb | 1.x | DuckDB-powered OLAP analytics inside PostgreSQL |
| pgvector | 0.8.x | Vector similarity search (matches Supabase stack) |

### Quick Start

```bash
# 1. Configure credentials
cd Admin/Acer-Veriton-GN100/postgres/
cp .env.example .env
# Edit .env — set EDGE_PG_PASSWORD

# 2. Deploy via SSH
./scripts/deploy-acer-postgres.sh

# 3. Check status
./scripts/deploy-acer-postgres.sh --status

# 4. Connect via SSH tunnel
./scripts/deploy-acer-postgres.sh --tunnel
# Then: psql postgresql://dws_edge@localhost:15432/dws_edge
```

### Network Security

PostgreSQL is bound to `127.0.0.1:5432` only — not exposed to the network. Remote access requires SSH tunnel:

```bash
ssh -L 15432:127.0.0.1:5432 admin100@gn100-cb5d
```

### GN100-Tuned Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| shared_buffers | 8 GB | ~25% of 32 GB container allocation |
| effective_cache_size | 24 GB | ~75% of allocation |
| max_parallel_workers | 8 | 8 of 10 cores for PG |
| shm_size | 4 GB | Docker shared memory for sorting |

See: `docs/field-notes/2026-03-13-acer-gn100-edge-postgres-setup.md`

## Maintenance Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-03-13 | Edge PostgreSQL deployed | PostgreSQL 16 + TimescaleDB + pg_duckdb + pgvector in Docker |
| 2026-03-11 | Docker GPU runtime and PyTorch validated | Confirmed `linux/aarch64` host, `NVIDIA GB10`, working `nvidia/cuda:12.8.0-runtime-ubuntu24.04`, validated `nvcr.io/nvidia/pytorch:25.02-py3`, and ARM64-first container policy |
| 2026-03-01 | OpenSandbox server deployed | Stage 1.5 agent sandboxing activated |
| 2026-02-27 | NVIDIA GPG key expired | Documented fix procedure in field note |

## Network Access

| Method | Details |
|--------|---------|
| **SSH/Web Console** | IPv6: `2001:14ba:a1b0:a500:ec74:7c47:3601:204f` |
| **Location** | Helsinki Lab |

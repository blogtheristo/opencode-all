# Acer Veriton GN100 — Edge AI Lab Device

***
# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:
  - Version: 1.2 | Tool: Claude Code | Date: 04.03.2026 | Changes: Added Ollama & IDE clients (Cursor, Cline) — OpenAI-compatible baseUrl, pointer to field note
  - Version: 1.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: Added OpenSandbox section — server setup, env vars, MCP tools, NIS2 statement for Stage 1.5 agent sandboxing
  - Version: 1.0 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/optimistic-burnell | Date: 27.02.2026 | Changes: Initial creation — Admin folder for Acer Veriton GN100 edge AI device

Session Links & References:
  - Claude Code (claude/optimistic-burnell): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/Acer-Veriton-GN100/README.md

Document Status:
  - Created: 27.02.2026
  - Last Modified: 01.03.2026
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
| **CPU** | 20 cores |
| **Memory** | 120 GiB |
| **Asset Tag** | DTR6LEH002547000426700 |
| **Machine ID** | 435bf64de6f94bfa93dca976e55670bd |
| **Role** | Lifetime Fleet — Edge AI inference & development |

## Software Stack

- **NVIDIA AI Workbench** — Local AI development environment
- **CUDA** — GPU compute (version TBD)
- **Docker** — Container runtime for edge agents
- **OpenSandbox** — Agent isolation platform (Stage 1.5 sandbox)

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

## Ollama & IDE clients (Cursor, Cline)

If **Ollama** is running on the Veriton (e.g. Qwen), it exposes an **OpenAI-compatible API** on port 11434. **Cursor** and **Cline** can connect by setting their provider **baseUrl** to `http://<veriton-ip-or-hostname>:11434/v1`. Ensure Ollama is bound to `0.0.0.0:11434` and the Veriton is reachable (VPN or LAN). See: `docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md` (section "Cline CLI → Qwen on Acer Veriton").

## Related Documents

| Document | Location |
|----------|----------|
| Ollama + dev environment (Cursor, Cline, Claude Code) | `docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md` |
| NVIDIA GPG Key Fix (2026-02-27) | `docs/field-notes/2026-02-27-acer-veriton-gn100-nvidia-gpg-key-fix.md` |
| OpenSandbox TypeScript Integration | `src/sandbox/opensandbox.ts` |
| OpenSandbox MCP Service (Python) | `mcp-hub/services/opensandbox_mcp.py` |
| Security Standard §14.6 | `DWS_SECURITY_STANDARD.md` |

## Maintenance Log

| Date | Action | Notes |
|------|--------|-------|
| 2026-03-01 | OpenSandbox server deployed | Stage 1.5 agent sandboxing activated |
| 2026-02-27 | NVIDIA GPG key expired | Documented fix procedure in field note |

## Network Access

| Method | Details |
|--------|---------|
| **SSH/Web Console** | IPv6: `2001:14ba:a1b0:a500:ec74:7c47:3601:204f` |
| **Location** | Helsinki Lab |

# Veriton Edge Stack Runbook

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: GPT-5.4 | Session: 2026-03-11 | Date: 11.03.2026 | Changes: Initial Veriton edge stack runbook covering Docker services, Ollama, OpenSandbox, MCP integration, firewall, SSH tunnel, and health checks

Session Links & References:
  - Related device manual: `Admin/Acer-Veriton-GN100/README.md`

Document Status:
  - Created: 11.03.2026
  - Last Modified: 11.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.0
**Purpose:** Standard operating runbook for deploying the Veriton edge stack used by Control Room and Situation Room client offers
**Audience:** Delivery, DevOps, Support, Security, Solutions Engineering
**Updated:** 11.03.2026

***

## 1. Scope

This runbook standardizes the Acer Veriton edge stack used in client deployments.

The baseline pattern is:

- Veriton as the client-side edge node
- Docker for local service packaging
- Ollama as the default local inference service
- OpenSandbox as the controlled execution layer
- DWS backend and MCP Hub as the control plane

This runbook assumes the DWS backend remains authoritative for orchestration and agent access.

---

## 2. Baseline Stack

| Component | Mode | Default Port | Purpose |
|----------|------|--------------|---------|
| Ollama | systemd or container | `11434` | Local model serving |
| OpenSandbox | service or container-backed API | `8080` | Isolated task execution |
| SSH | system service | `22` | Admin and tunnel access |
| Docker | system service | n/a | Local runtime |
| DWS backend | remote HTTPS | `443` | Control plane |
| MCP Hub | remote HTTPS/private network | varies | Orchestration and MCP tools |

---

## 3. Preferred Deployment Modes

### 3.1 Safest Mode

Use local-only inference exposure plus SSH tunnel:

- Ollama binds to `127.0.0.1:11434`
- admin tools tunnel to the Veriton host
- local tools use `http://localhost:<forwarded-port>`

Use this when:

- the client has strict network controls
- the Veriton is in a protected subnet
- external exposure of inference endpoints is not acceptable

### 3.2 Trusted Private Network Mode

Use direct host access:

- Ollama binds to `0.0.0.0:11434`
- firewall restricts the source IPs
- admin tools connect to `http://<veriton-ip-or-hostname>:11434`

Use this when:

- client private network is trusted
- firewall rules are enforced
- remote operator access is required without SSH tunneling

---

## 4. Service Standardization

### 4.1 Ollama

Default local inference service.

Verify local health:

```bash
curl http://127.0.0.1:11434/api/tags
```

Verify listening address:

```bash
ss -ltnp | grep 11434
```

If remote access is required on Ubuntu:

```bash
sudo mkdir -p /etc/systemd/system/ollama.service.d
printf '[Service]\nEnvironment="OLLAMA_HOST=0.0.0.0:11434"\n' | sudo tee /etc/systemd/system/ollama.service.d/override.conf
sudo systemctl daemon-reload
sudo systemctl restart ollama
systemctl show ollama --property=Environment
ss -ltnp | grep 11434
```

### 4.2 OpenSandbox

OpenSandbox is the preferred controlled execution layer for Veriton-backed deployments.

Expected backend-side environment:

```bash
SANDBOX_STAGE=opensandbox
OPENSANDBOX_HOST=http://<veriton-ip>:8080
OPENSANDBOX_API_KEY=<secret-if-used>
```

Relevant implementation:

- `src/sandbox/index.ts`
- `mcp-hub/services/opensandbox_mcp.py`

### 4.3 Docker

Docker is the packaging standard for client-local services and optional sidecars.

Required checks:

```bash
docker ps
docker info
```

If GPU-backed containers are needed:

```bash
docker run --rm --gpus all nvidia/cuda:12.8.0-runtime-ubuntu24.04 nvidia-smi
```

---

## 5. Control Plane Integration

### 5.1 DWS Backend

The Veriton does not replace the DWS backend.

Keep these in the DWS backend:

- API routes in `src/app.ts`
- agent routes in `src/agents/routes.ts`
- MCP exposure in `src/mcp/agent-server.ts`
- situation reporting in `src/routes/situation-room.routes.ts`

### 5.2 MCP

Veriton-hosted services should be integrated through MCP/HTTPS wherever possible.

Why:

- HTTPS/MCP is more robust under enterprise VPN conditions than direct raw TCP dependencies
- the repo already documents this difference in `Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md`

Preferred path:

- Veriton local service
- private endpoint or tunnel
- DWS backend / MCP Hub
- client tools

---

## 6. Health Checks

### 6.1 Veriton host checks

```bash
hostname
uptime
docker ps
systemctl status ollama --no-pager
curl http://127.0.0.1:11434/api/tags
```

### 6.2 OpenSandbox checks

```bash
curl http://<veriton-ip>:8080/health
```

or through MCP Hub tooling via `sandbox_ping`.

### 6.3 DWS-side checks

Use the diagnostics scripts from the repo root:

```bash
npm run diag:dws-api
npm run diag:mcp
npm run diag:supabase-rest
npm run db:test
npm run diag:ollama
```

Interpretation:

- `diag:dws-api` verifies backend HTTPS health
- `diag:mcp` verifies MCP/Hub path
- `diag:supabase-rest` verifies REST/API path
- `db:test` verifies direct Postgres path
- `diag:ollama` verifies Veriton inference endpoint

---

## 7. Firewall and Network Rules

### 7.1 Required Principle

Expose as little as possible.

Preferred order:

1. local bind + SSH tunnel
2. private network bind + firewall restriction
3. public exposure only behind explicit security review

### 7.2 Minimum rules

- SSH allowed only from trusted admin ranges
- Ollama allowed only from trusted internal ranges if directly exposed
- OpenSandbox allowed only from DWS backend/MCP Hub or approved admin endpoints

### 7.3 VPN Caveat

Do not assume hostname-based bypass rules will work for raw TCP under enterprise VPNs.

Use:

- HTTPS/MCP as the default client path
- direct DB only for admin/break-glass use
- explicit testing per path

---

## 8. SSH Tunnel Patterns

### 8.1 Ollama tunnel

```bash
ssh -L 11435:localhost:11434 admin100@<veriton-host>
```

Then use:

```text
http://localhost:11435
```

or, for OpenAI-compatible clients that require it:

```text
http://localhost:11435/v1
```

### 8.2 Why tunnel mode is preferred

- no network-wide exposure of inference endpoint
- fewer firewall exceptions
- fewer VPN hostname-routing surprises
- simplest support story for admin tooling

---

## 9. Client Tool Endpoint Guidance

| Tool | Tunnel Mode | Direct Mode |
|------|-------------|-------------|
| Continue | `http://localhost:11435` | `http://<veriton-host>:11434` |
| Cursor custom local model | `http://localhost:11435` or `.../v1` depending on client mode | `http://<veriton-host>:11434` |
| Cline/OpenAI-compatible mode | `http://localhost:11435/v1` | `http://<veriton-host>:11434/v1` |

Use actual behavior of the client to decide whether `/v1` is needed.

---

## 10. Troubleshooting Rules

### 10.1 Ollama works locally but not remotely

Likely causes:

- still bound to `127.0.0.1`
- firewall restriction
- VPN/network route issue

Checks:

```bash
ss -ltnp | grep 11434
curl http://127.0.0.1:11434/api/tags
```

### 10.2 MCP works but direct DB fails

Likely causes:

- VPN allows HTTPS but blocks raw `5432`
- hostname or DoH bypass mismatch

Action:

- use MCP/REST/SQL Editor path
- treat direct DB as admin-only

### 10.3 vLLM in venv fails on advanced hardware

Action:

- do not standardize on ad hoc venv installs
- prefer containerized inference for advanced OpenAI-compatible local serving
- keep Ollama as the default supported Veriton inference service

---

## 11. Related Files

- `Admin/Acer-Veriton-GN100/CLIENT_VERITON_OFFERS_EN_v1.md`
- `Admin/Acer-Veriton-GN100/README.md`
- `Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md`
- `src/sandbox/index.ts`
- `mcp-hub/services/opensandbox_mcp.py`
- `src/mcp/agent-server.ts`


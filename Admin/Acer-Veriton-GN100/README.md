# Acer Veriton GN100 — Device Admin Manual

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/dws-standards-codex-proposal-0Mg1S | Date: 28.02.2026 | Changes: Initial creation — device overview, software stack template, maintenance log, field note cross-links

Session Links & References:
  - Claude Code (claude/dws-standards-codex-proposal-0Mg1S): https://github.com/blogtheristo/dws6/commits/claude/dws-standards-codex-proposal-0Mg1S

Document Status:
  - Created: 28.02.2026
  - Last Modified: 28.02.2026
  - Language: EN
  - Languages Available: EN
  - Publication Status: ACTIVE — INTERNAL ONLY

***

## Table of Contents

1. [Device Overview](#1-device-overview)
2. [Software Stack](#2-software-stack)
3. [Network & Access](#3-network--access)
4. [AI / GPU Workload Configuration](#4-ai--gpu-workload-configuration)
5. [Maintenance Log](#5-maintenance-log)
6. [Related Field Notes](#6-related-field-notes)

---

## 1. Device Overview

| Field | Value |
|-------|-------|
| **Hostname** | `[TBD]` |
| **Model** | Acer Veriton GN100 |
| **Role** | Local AI inference & development workstation |
| **OS** | Ubuntu 24.04 LTS |
| **Kernel** | `[TBD — run: uname -r]` |
| **CPU cores** | 20 |
| **CPU model** | `[TBD — run: lscpu \| grep "Model name"]` |
| **RAM** | 120 GiB (~128 GB physical) |
| **GPU** | NVIDIA Blackwell `[TBD — confirm model: nvidia-smi]` |
| **VRAM** | `[TBD]` |
| **Storage** | `[TBD — run: lsblk]` |
| **Location** | `[TBD — office / rack / desk]` |
| **Managed by** | risto@lifetime.fi |

### Notes

- RAM reported as 120 GiB in OS; physical modules likely 128 GB DDR5.
- GPU architecture confirmed as NVIDIA Blackwell generation. Exact SKU TBD.
- `nvidia-smi` output should be captured and appended here on first setup.

---

## 2. Software Stack

### System

| Component | Version | Notes |
|-----------|---------|-------|
| Ubuntu | 24.04 LTS | Noble Numbat |
| Docker | `[TBD]` | `docker --version` |
| NVIDIA Driver | `[TBD]` | `nvidia-smi` |
| CUDA | `[TBD]` | `nvcc --version` |
| Node.js | `[TBD]` | `node --version` |
| Python | `[TBD]` | `python3 --version` |
| Git | `[TBD]` | `git --version` |

### DWS Stack

| Component | Status | Notes |
|-----------|--------|-------|
| DWS IQ 6 backend (`src/app.ts`) | `[TBD]` | Express + TypeScript |
| Supabase JS SDK | `[TBD]` | Auth + DB |
| Claude Code CLI | `[TBD]` | `claude --version` |
| MCP Hub (`mcp-hub/`) | `[TBD]` | Local MCP servers |
| Vite dashboard (`dws6.com/dashboard/firehorse/v9-react/`) | `[TBD]` | React 19 |

### AI / LLM Runtimes

| Runtime | Status | Notes |
|---------|--------|-------|
| Ollama | `[TBD]` | Local model serving |
| LlamaStack | `[TBD]` | `src/` integration |
| vLLM | `[TBD]` | GPU inference server |
| TensorRT-LLM | `[TBD]` | NVIDIA optimized runtime |

> **Action:** Run `dpkg -l | grep -E "cuda|tensorrt|ollama"` and fill table above.

---

## 3. Network & Access

| Field | Value |
|-------|-------|
| **LAN IP** | `[TBD]` |
| **SSH access** | `ssh [user]@[ip]` |
| **Firewall** | `ufw` — `[TBD: status]` |
| **Remote UI** | `[TBD — Cockpit / none]` |
| **Supabase target** | `europe-north1` (EU Cloud) |

---

## 4. AI / GPU Workload Configuration

### GPU Confirmation

```bash
# Run and paste output here
nvidia-smi
```

```
[PASTE nvidia-smi OUTPUT HERE]
```

### CUDA Verification

```bash
nvcc --version
python3 -c "import torch; print(torch.cuda.is_available(), torch.version.cuda)"
```

### Recommended Local Models (Blackwell-class)

Given 120 GiB RAM and Blackwell GPU, this device can serve:

| Model | Size | Use case |
|-------|------|----------|
| `qwen2.5-coder:32b` | ~20 GB VRAM | DWS agentic coding |
| `llama3.3:70b` | ~40 GB VRAM | Compliance reasoning |
| `mistral-large` | ~45 GB VRAM | EU document analysis |
| Custom LWM (Climate LLM) | TBD | DWS IQ 6 production |

> See field note `2026-02-16-nvidia-blackwell-ultra-agentic-ai-inference.md` for context on Blackwell inference economics.

### EU AI Act Article 12 Logging

All AI workloads running on this device must log to the Aiwen layer:

- Endpoint: EU Cloud (`europe-north1`)
- Logging format: Article 12-compliant event log (traceability + retention)
- See: `docs/CLOUD_ENVIRONMENTS.md` Section on Aiwen

---

## 5. Maintenance Log

| Date | Action | By | Notes |
|------|--------|----|-------|
| 28.02.2026 | Device documented in Admin/ | Claude Code | Initial README created |
| `[date]` | Initial Ubuntu 24.04 setup | `[name]` | `[notes]` |
| `[date]` | NVIDIA driver install | `[name]` | Driver version: `[TBD]` |
| `[date]` | DWS stack deployed | `[name]` | `[notes]` |

---

## 6. Related Field Notes

| Date | Field Note | Relevance |
|------|-----------|-----------|
| 2026-02-16 | [`nvidia-blackwell-ultra-agentic-ai-inference.md`](../../docs/field-notes/2026-02-16-nvidia-blackwell-ultra-agentic-ai-inference.md) | Blackwell inference performance & economics for DWS agentic workloads |
| 2026-02-04 | [`qwen3-coder-next-agentic-llm.md`](../../docs/field-notes/2026-02-04-qwen3-coder-next-agentic-llm.md) | MoE models suited for local inference on this device |
| 2026-02-06 | [`brockman-agentic-software-development.md`](../../docs/field-notes/2026-02-06-brockman-agentic-software-development.md) | Agentic coding demand — why local GPU inference matters |

## Related Core Docs

| Doc | Path |
|-----|------|
| Cloud Environments | `docs/CLOUD_ENVIRONMENTS.md` |
| Security Standard | `DWS_SECURITY_STANDARD.md` |
| Security Compliance | `Admin/SECURITY_COMPLIANCE.md` |
| Brand Standard | `DWS_BRAND_STANDARD.md` |

---

**Owner:** risto@lifetime.fi
**Review cadence:** Monthly or after significant hardware/software changes

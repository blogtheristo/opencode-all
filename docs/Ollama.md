# Ollama — Cloud & Local AI Model Platform

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/update-ollama-cloud-docs-cQUfn | Date: 14.03.2026 | Changes: Initial creation — Ollama cloud documentation with NVIDIA B300 hardware updates, Kimi K2.5 and GLM-5 model support, OpenClaw integration, subscription tiers, DWS integration patterns

Session Links & References:
  - Claude Code (claude/update-ollama-cloud-docs-cQUfn): https://github.com/blogtheristo/dws6/commits/claude/update-ollama-cloud-docs-cQUfn
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/Ollama.md

Document Status:
  - Created: 14.03.2026
  - Last Modified: 14.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Document Type: Technical Reference

Related Documents:
  - docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md
  - docs/field-notes/2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md
  - product-catalog/LWM/training-manual-part1-infrastructure.md (Section 9: Ollama)
  - product-catalog/LWM/training-manual-part3-evaluation-deployment.md (Section 6: Ollama Deployment)
  - Admin/Acer-Veriton-GN100/templates/continue-ollama-direct.yaml
  - Admin/Acer-Veriton-GN100/templates/continue-ollama-tunnel.yaml
  - docs/CLOUD_ENVIRONMENTS.md

***

**Version:** 1.0
**Effective Date:** 2026-03-14
**Last Updated:** 2026-03-14
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [Ollama Cloud](#2-ollama-cloud)
3. [NVIDIA B300 Hardware](#3-nvidia-b300-hardware)
4. [Supported Models](#4-supported-models)
5. [OpenClaw Integration](#5-openclaw-integration)
6. [Subscription Plans](#6-subscription-plans)
7. [Ollama Local (Edge / On-Premise)](#7-ollama-local-edge--on-premise)
8. [DWS Integration](#8-dws-integration)
9. [Quick Reference](#9-quick-reference)

---

## 1. Overview

Ollama provides a unified interface for running LLMs both locally and in the cloud. DWS uses Ollama in two modes:

| Mode | Infrastructure | Use Case |
|------|---------------|----------|
| **Cloud** | NVIDIA B300 data center GPUs | Production inference, OpenClaw, high-throughput workloads |
| **Local** | Acer Veriton GN100 (NVIDIA Jetson), DGX Spark | Edge AI, development, sovereign on-premise inference |

Ollama supports 45,000+ custom integrations from GitHub and works with the OpenAI-compatible API format.

---

## 2. Ollama Cloud

Ollama's cloud runs on NVIDIA's latest data center hardware (B300 Moonshot series), providing:

- **Faster throughput** — higher tokens/second for large models
- **Lower latency** — reduced time-to-first-token
- **Reliable tool calls** — stable function calling for agent integrations
- **Fixed pricing** — predictable subscription costs (no overage bills)

### Launch Command

```bash
ollama launch <integration> --model <model>:<tier>
```

All Ollama integrations work via the standard `ollama launch` command, connecting to cloud-hosted models transparently.

---

## 3. NVIDIA B300 Hardware

Ollama's cloud is updated to use NVIDIA's latest data center hardware: **B300** (Blackwell architecture).

| Specification | B300 |
|---------------|------|
| Architecture | NVIDIA Blackwell |
| Target | Data center AI inference & training |
| Key benefit | Higher throughput, lower latency vs. previous generation |
| Ollama models | Kimi K2.5, GLM-5, and all cloud-tier models |

The B300 hardware significantly improves model performance while maintaining reliable tool calls for integrations.

---

## 4. Supported Models

### Cloud Models (NVIDIA B300)

| Model | Provider | Launch Command |
|-------|----------|---------------|
| **Kimi K2.5** | Moonshot AI | `ollama launch openclaw --model kimi-k2.5:cloud` |
| **GLM-5** | Z AI (Zhipu) | `ollama launch openclaw --model glm-5:cloud` |

### Local Models (DWS Edge Devices)

| Model | Device | Use Case |
|-------|--------|----------|
| Qwen 3 Coder | Veriton GN100 | Local code generation, Continue IDE |
| Llama 3.x | Veriton GN100 / DGX Spark | General-purpose local inference |

See field notes for local setup details:
- `docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md`
- `docs/field-notes/2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md`

---

## 5. OpenClaw Integration

Ollama is officially integrated into **OpenClaw's default onboarding**. Kimi K2.5 is one of the most recommended models for use with OpenClaw.

### Setup

```bash
ollama launch openclaw --model kimi-k2.5:cloud
```

### Features

- **Web search enhancement** — Ollama enhances OpenClaw with web search by default, providing latest information when needed
- **Cloud-powered** — runs on NVIDIA B300 for faster, more reliable performance
- **Tool calling** — stable function calling for OpenClaw agent workflows

### DWS + OpenClaw

OpenClaw can be used as an alternative coding agent alongside Claude Code:

| Agent | Primary Use | Ollama Model |
|-------|------------|--------------|
| Claude Code | Primary development agent | Claude API (direct) |
| OpenClaw + Ollama | Alternative/complementary agent | Kimi K2.5 (cloud) |

---

## 6. Subscription Plans

Ollama's cloud uses **fixed subscription rates** — no surprise overage bills.

| Plan | Price | Notes |
|------|-------|-------|
| **Free** | $0/month | Experience cloud models, rate-limited |
| **Standard** | $20/month | General use |
| **Pro** | $100/month | Higher throughput and priority |

**Key advantage:** Fixed pricing means no surprise bills when leaving Claude Code or OpenClaw running for extended sessions. Additional plans for higher usage are planned.

---

## 7. Ollama Local (Edge / On-Premise)

DWS runs Ollama locally on edge hardware for sovereign, on-premise AI inference.

### Hardware

| Device | GPU | Ollama Use |
|--------|-----|-----------|
| Acer Veriton GN100 | NVIDIA Jetson Orin Nano | Local dev, Continue IDE chat |
| NVIDIA DGX Spark | Desktop AI | Training, evaluation, hardened inference |

### Configuration Templates

- `Admin/Acer-Veriton-GN100/templates/continue-ollama-direct.yaml` — Direct connection
- `Admin/Acer-Veriton-GN100/templates/continue-ollama-tunnel.yaml` — SSH tunnel connection

### OpenAI-Compatible API

Ollama exposes an OpenAI-compatible API locally:

```
http://<device-ip>:11434/v1/chat/completions
```

This works with Continue IDE, Cline, and any OpenAI SDK client.

---

## 8. DWS Integration

### Agent Integration Pattern

Ollama models can serve as backends for DWS IQ agents via the OpenAI-compatible API:

```typescript
// Example: Using Ollama cloud model in DWS agent
const response = await fetch('https://cloud.ollama.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`
  },
  body: JSON.stringify({
    model: 'kimi-k2.5',
    messages: [{ role: 'user', content: prompt }],
    tools: toolDefinitions
  })
});
```

### MCP Compatibility

Ollama models with tool calling support (Kimi K2.5, GLM-5) can be used as MCP-compatible backends when wrapped with the appropriate adapter.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `OLLAMA_API_KEY` | Ollama cloud API key |
| `OLLAMA_BASE_URL` | Cloud or local endpoint URL |
| `OLLAMA_MODEL` | Default model name |

---

## 9. Quick Reference

```bash
# Cloud — Kimi K2.5 with OpenClaw
ollama launch openclaw --model kimi-k2.5:cloud

# Cloud — GLM-5 with OpenClaw
ollama launch openclaw --model glm-5:cloud

# Local — Run model on edge device
ollama run qwen3-coder

# Local — List available models
ollama list

# Local — Pull a model
ollama pull kimi-k2.5
```

---

*Document maintained by DWS IQ 6 Platform Team. For Ollama support, join Ollama's Discord channel.*

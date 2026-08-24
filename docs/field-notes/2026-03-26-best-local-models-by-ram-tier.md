# Field Note: Best Local Models by RAM Tier (March 2026)

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/document-best-models-K9SLB | Date: 29.03.2026 | Changes: Initial creation — best local LLM models categorized by hardware RAM tier (64GB, 96GB, 192GB)

Session Links & References:
  - Claude Code (claude/document-best-models-K9SLB): https://github.com/blogtheristo/dws6/commits/claude/document-best-models-K9SLB
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-03-26-best-local-models-by-ram-tier.md

Document Status:
  - Created: 29.03.2026
  - Last Modified: 29.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Hardware Planning

Related Documents:
  - docs/Ollama.md
  - docs/field-notes/2026-02-04-qwen3-coder-next-agentic-llm.md
  - docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md
  - docs/field-notes/2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md

***

**Version:** 1.0
**Effective Date:** 2026-03-26
**Last Updated:** 2026-03-29
**Status:** Active

---

## Ontology Tags

- **Geography:** Global > Open Source AI Ecosystem
- **Sector:** Technology > AI/ML > Large Language Models > Local Inference
- **Entities:** Qwen, Alibaba, Zhipu AI, NVIDIA, Nous Research, Mistral AI, MiniMax, StepFun
- **Temporal Context:** 2026-Q1, Local LLM Hardware Planning
- **Confidence:** High

---

## Executive Summary

Curated list of the best open-weight LLMs to run locally, organized by hardware RAM tier. These recommendations are based on real-world testing and community benchmarks as of March 26, 2026. The goal: maximum capability per dollar of hardware.

**Impact:** Running top-tier local models eliminates API costs for routine tasks, keeps data sovereign (EU compliance), and enables offline/edge inference for DWS IQ agents.

---

## 1. 64 GB RAM Tier

Entry-level for serious local LLM work. Supports quantized large models and full-precision smaller models.

| Model | Best For | Notes |
|-------|----------|-------|
| **Qwen3-Coder-Next 80B (4-bit)** | Coding, Claude Code backend, general agent | MoE architecture — 80B total, ~3B active params. 4-bit quantization fits in 64GB. Excellent for agentic coding workflows. |
| **Qwen3.5-122B-REAP** | Browser use, multimodal, tool calling, general agent | Strong multimodal capabilities. REAP (Reasoning-Enhanced Alignment Process) improves instruction following. |

**DWS hardware match:** Acer Veriton GN100 (119GB RAM) comfortably runs both models at full context.

---

## 2. 96 GB RAM Tier

Mid-range. Unlocks larger unquantized models and specialized variants.

| Model | Best For | Notes |
|-------|----------|-------|
| **GLM-4.6V** | Multimodal, tool calls | Zhipu AI's vision-language model. Strong tool-use and visual understanding. |
| **Hermes-70B** | Jailbroken / uncensored | Nous Research fine-tune. Useful for unrestricted research and creative tasks. |
| **Nemotron-120B-Super** | OpenClaw integration | NVIDIA's model. Designed for structured agent workflows. |
| **Mistral-4-Small** | General agent | Mistral's latest efficient model. Good all-rounder for agent tasks. |

---

## 3. 192 GB RAM Tier

Top tier. These models approach Claude Sonnet-level capabilities running fully local.

| Model | Best For | Notes |
|-------|----------|-------|
| **Step-3.5-Flash** | General reasoning | StepFun's fast reasoning model. Excellent speed-to-quality ratio. |
| **Qwen3.5-397B-REAP** | Full-scale general agent | Massive MoE model. Near-frontier capabilities on local hardware. |
| **MiniMax-M2.5** | General (M2.7 coming soon) | Strong multilingual. M2.7 expected to close gap with frontier models further. |
| **GLM-4.7-REAP** | General reasoning + tool use | Zhipu AI's latest. REAP alignment for better instruction following. |

**Performance note:** All 192GB-tier models are excellent top-tier LLMs and approach Sonnet in capabilities.

---

## 4. Deployment Pattern

All models above can be served via Ollama for local inference:

```bash
# Pull and run (example)
ollama pull qwen3-coder-next:80b-q4_K_M
ollama run qwen3-coder-next:80b-q4_K_M

# Serve as API endpoint for DWS agents
ollama serve  # default: http://localhost:11434
```

For DWS IQ 6 integration, local models connect through the same Ollama API endpoint documented in `docs/Ollama.md`.

---

## 5. Hardware Investment Guide

| RAM | Approx. Cost (2026) | Best Value Pick | Use Case |
|-----|---------------------|-----------------|----------|
| 64 GB | Budget entry | Qwen3-Coder-Next 80B 4-bit | Dev team coding agent |
| 96 GB | Mid-range | Nemotron-120B-Super | Enterprise agent with OpenClaw |
| 192 GB | Premium | Qwen3.5-397B-REAP | Near-frontier local inference |

---

*Field note by DWS IQ 6 team. Updated as new models and benchmarks emerge.*

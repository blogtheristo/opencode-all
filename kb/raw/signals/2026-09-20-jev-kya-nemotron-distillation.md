---
title: "Jev-KYA 4B Nemotron-4 Distillation & Proxy Trust Hardening Architecture"
date: 2026-09-20
tags: [signal, kya, nemotron, dgx-spark, distillation, blackwell, security, hic-learning-outcome]
---

# What happened

1. **Proxy Trust Validator Hardening:**
   - Addressed IP spoofing vulnerability in `proxy-addr` involving IPv4-mapped IPv6 subnets.
   - Enforced `/104` subnet prefix validation via `src/middleware/proxy-trust-validator.middleware.ts`.
   - Verified with unit and integration tests in `src/__tests__/proxy-trust-validator.test.ts`.
   - Protects rate-limiting, IP-based authorization, and EU AI Act Article 12 audit logs.

2. **Jev-KYA 4B Sequential Distillation Pipeline on DGX Spark:**
   - Architecture and execution plan created for single-node NVIDIA DGX Spark (Grace Blackwell GB10).
   - Designed as a 4-phase sequential pipeline:
     1. Teacher inference using `Nemotron-4-340B-Instruct` (FP8, high batch size, ~6–8 h).
     2. Reward evaluation and curation using `Nemotron-4-340B-Reward` (Top 10–20 % filter, ~4–5 h).
     3. Student model training on 4B base via Full Parameter Fine-Tuning BF16 with FSDP (~2–4 h).
     4. Quantization and export for Windows 11 / PC (GGUF/ONNX/TensorRT-LLM ~2.5 GB), Intel Mac (2017, 16 GB RAM llama.cpp CPU ~2.5 GB), and Edge/Local GPUs (vLLM AWQ/FP8, ~22 ms latency, ~1 h).
   - Fully compliant with DWS Rule 14 (Cost Policy & Sovereignty) — 100% on-premise execution with zero marginal inference cost. DGX Ollama models stopped during phases 1 & 2 to maximize VRAM.

# The insight

By distilling Nemotron-4 340B into a specialized 4B student model on a single Grace Blackwell node sequentially, DWS achieves frontier-grade KYA decision quality without general-domain bloat, keeping data 100% sovereign within the EU, and reducing edge inference costs to zero across Windows 11, Intel Mac, and local GPU nodes.

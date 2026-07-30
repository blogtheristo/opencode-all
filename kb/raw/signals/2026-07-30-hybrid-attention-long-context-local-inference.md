<!--
VERSION AND AGENT HISTORY
Document: Raw signal — hybrid-attention long-context models + RDNA-native inference (hipfire)
Version: 1.0
Date: 2026-07-30
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active (raw source — not compiled)
Agent: Claude Code, session claude/enterprise-ai-harness-0anl7s
Purpose: Raw capture of the HIC field observation on throughput-at-depth, plus the
         verified model/engine specifications, for later /kb compile.
         Compiled reading: docs/field-notes/2026-07-30-hybrid-attention-long-context-local-inference.md
-->

# Raw Signal — Throughput at Context Depth (30.07.2026)

**Kind:** Technology signal + HIC field measurement
**Captured:** 2026-07-30

## ⚠️ Provenance

Originates with the **HIC's own observation and measurement**, not with a prior DWS position. The repository had **no mention of `Nemotron-Cascade-2-30B-A3B`** before 30.07.2026. Do not later recall this as a pre-existing DWS assessment.

## The claims

1. **Hybrid attention is a prerequisite for usable long context.** A 1M window is not exploitable under N² attention — nominal window and working window diverge. `Nemotron-Cascade-2-30B-A3B` (Mamba-2 + attention hybrid) is the counter-example.
2. **Engine matters as much as architecture.** Most local stacks fall to single-digit tok/s once real context accumulates. **hipfire** holds **~40 tok/s on a Radeon 7900 XTX with Qwen 3.6-27B, roughly constant to ~250K context depth** (HIC measurement).
3. Underlying complaint, and the durable part: **benchmarks are quoted at shallow depth; agents work at deep depth.** A tok/s number from a 2K prompt says nothing about the agentic regime.

## Verified specifications

**Nemotron-Cascade-2-30B-A3B** (NVIDIA)
- 30B total / ~3B activated MoE; base = Nemotron-3-Nano-30B-A3B; **Mamba-2 state-space layers + standard attention** hybrid. **CONFIRMED.**
- **1M-token context. CONFIRMED.**
- Fits **24 GB VRAM at Q4**; claimed to beat Nemotron-3-Super 120B on coding/instruction-following; IMO/IOI 2025 gold. **VENDOR-REPORTED**, not independently verified.
- Thinking + instruct modes.

**hipfire**
- Rust + HIP inference engine for **AMD consumer GPUs, RDNA1–RDNA4**; Rust orchestrator dlopening `libamdhip64.so`, in-tree per-chip HIP C++ kernels. **CONFIRMED** (`hipfire.dev`, public repo).
- Published **~44 tok/s Qwen 3.6-27B on 7900 XTX** autoregressive; **~185 tok/s** with "DFlash" speculative decode on code prompts. **CONFIRMED as the project's own figures**; context depth not stated.

## The unverified load-bearing claim

**Constant ~40 tok/s to ~250K depth** — one operator, one machine, one configuration. No public benchmark corroborating constant throughput at that depth was found. Consistent with the published shallow figure and with what a hybrid + RDNA-tuned path should do. **Worth reproducing on the DGX Spark GN-100 before anything is built on it.**

## Why captured

Third piece of the day's harness thread. Nadella: the harness is the durable layer. Composio: the harness is where the money goes (340k-token median for Claude Code). This: those tokens are *context depth*, and whether they cost anything depends on the architecture and engine underneath. On a metered API, harness overhead is a bill; on a hybrid-attention local model with constant throughput at depth, it is latency already paid for at €0/token.

**R-01 boundary:** hipfire is RDNA (consumer graphics), **not** the CDNA/Instinct MI300 or Gaudi 3 testbed the risk register specifies. It does **not** close R-01. It is evidence the non-NVIDIA exit is real, and a candidate cheaper first increment.

## Source URLs

- https://huggingface.co/nvidia/Nemotron-Cascade-2-30B-A3B
- https://research.nvidia.com/labs/nemotron/nemotron-cascade-2/
- https://hipfire.dev/
- https://huggingface.co/schuttdev/hipfire-qwen3.6-27b
- https://forum.level1techs.com/t/7900xtx-llm-inference-notes/250869

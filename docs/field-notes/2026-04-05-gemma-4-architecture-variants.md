# Field Note: Gemma 4 Architecture — Three Variants (E2B/E4B, 31B Dense, 26B A4B MoE)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/add-gemma-field-note-4RCI0 | Date: 05.04.2026 | Changes: Initial creation — Gemma 4 architecture overview based on Google diagram

Session Links & References:

- Claude Code (claude/add-gemma-field-note-4RCI0): https://github.com/blogtheristo/dws6/commits/claude/add-gemma-field-note-4RCI0
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-04-05-gemma-4-architecture-variants.md

Document Status:

- Created: 05.04.2026
- Last Modified: 05.04.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Model Architecture

Related Documents:

- docs/field-notes/2026-03-26-best-local-models-by-ram-tier.md
- docs/field-notes/2026-02-04-qwen3-coder-next-agentic-llm.md
- docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md
- docs/field-notes/2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md
- docs/PHD_FIREHORSE_EN.md (sector→model mapping references Gemma 2)
- docs/metropolia/master-thesis/en/V3Thesis_EN.md (same mapping)

---

## Ontology Tags

- **Geography:** Global > Google DeepMind > Open-Weight Models
- **Sector:** Technology > AI/ML > Large Language Models > Open Weights
- **Entities:** Google, DeepMind, Gemma Team, DWS IQ 6, LWM
- **Temporal Context:** 2026-Q2, Gemma 4 Release Cycle
- **Confidence:** High (architecture diagram from Google)

---

## Executive Summary

Google released **Gemma 4** in three architectural variants, each targeting a different deployment tier. The family keeps the shared decoder backbone (RMSNorm + Local/Global Attention + residual MLP/MoE block + RMSNorm + LM Head) but differentiates on how the FFN is structured and on embedding handling.

| Variant       | Class | FFN                    | Distinctive Feature            | Positioning                                             |
| ------------- | ----- | ---------------------- | ------------------------------ | ------------------------------------------------------- |
| **E2B / E4B** | Tiny  | Dense FFNN             | **Per-Layer Embeddings (PLE)** | "Tiny models are efficient" — edge, on-device           |
| **31B**       | Dense | Dense FFNN             | Standard decoder               | "Dense models are strong" — server / workstation        |
| **26B A4B**   | MoE   | **Mixture of Experts** | ~4B active of 26B total        | "MoE models are incredible" — high-throughput inference |

All three share: Token Embedding Layer → N× Decoder blocks (pre-norm RMSNorm, Local **or** Global attention per block, residual adds, post-block RMSNorm) → final RMSNorm → LM Head.

---

## Architecture Notes

### 1. E2B / E4B — Tiny with Per-Layer Embeddings (PLE)

- **PLE** is the differentiator: per-layer embedding tables feed each decoder block instead of only the shared input embedding. This raises effective parameter capacity without increasing decoder FLOPs — ideal for on-device inference where compute is the bottleneck but memory bandwidth to embeddings is cheaper.
- Local/Global attention alternation preserves long-range awareness at tiny scale.
- **DWS fit:** NVIDIA Jetson Orin Nano (Hands layer), mobile/browser edge, Lifetime Fleet field devices.

### 2. Gemma 4 31B — Dense Reference Model

- Plain dense FFNN path. This is the "quality anchor" — the configuration against which distilled and sparse variants are measured.
- Same Local/Global attention pattern.
- **DWS fit:** DGX Spark (128GB), Acer Veriton GN100 (119GB) at 4-bit quantization. Replaces Gemma 2 27B in the current sector→model mapping used in PHD_FIREHORSE and V3 thesis.

### 3. Gemma 4 26B A4B — MoE (4B active)

- **A4B = ~4B active parameters** routed from 26B total. Inference cost tracks the active set while capacity tracks the total.
- Same attention structure; the FFN block is swapped for MoE + RMSNorm.
- **DWS fit:** Cloud Run batch workloads, sovereignty audit reasoning lineage tier, multi-tenant agent backends where throughput per GPU matters more than single-query latency. Competitive with Qwen3-Coder-Next's MoE (80B / ~3B active) at a smaller total footprint.

---

## Impact on DWS IQ 6

### Body (Firehorse / LWM model selection)

- **Replace Gemma 2 references with Gemma 4** in sector-to-model recommendation tables once Gemma 4 weights land on Hugging Face and Ollama. Specifically:
  - `docs/PHD_FIREHORSE_EN.md` lines 1018–1021 (and FI mirror)
  - `docs/metropolia/master-thesis/en/V3Thesis_EN.md` lines 1374+ (and FI mirror)
  - Mapping update: _"Gemma 2 27B" → "Gemma 4 31B"_; _"Gemma 2 (EU-hosted)" → "Gemma 4 31B (EU-hosted)"_; add **Gemma 4 26B A4B** as MoE option for multi-tenant ESG reasoning.
- **Deferred:** thesis updates are gated by the CLAUDE.md Thesis Update Rule (all 4 thesis files together + versioned HTML regen). Do not update in isolation.

### Brain (Agent orchestration)

- **26B A4B** is a strong candidate for the `compliance` and `carbon-analysis` agents where reasoning depth matters but latency budgets are soft. Benchmark against current Qwen3-Coder-Next backend.
- **E4B with PLE** opens a path to **on-device safety scoring** for SiteSense — crane operator tablets, dashcam edge inference — where round-tripping to cloud breaks the UX.

### Hands (Lifetime Fleet edge AI)

- E2B is the first Gemma family variant realistically deployable on Jetson Orin Nano 8GB without heroic quantization. Pairs well with the firewalled Ollama setup documented in `2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md`.

### RAM tier field note (`2026-03-26-best-local-models-by-ram-tier.md`)

- **Add Gemma 4 31B** to the 96 GB tier (unquantized or 8-bit) and **Gemma 4 26B A4B** to the 64 GB tier (MoE active-set fits easily).
- Update only once weights are verified available via Ollama pull — per CLAUDE.md Ollama Model Rule, **do not auto-pull**. Report availability and wait for human approval.

---

## Open Questions

1. **License terms** — does Gemma 4 keep the Gemma Terms of Use, or move closer to Apache 2.0? This affects whether we can embed it in the Signed Reports pipeline.
2. **EU residency** — is there a Google Cloud EU-hosted inference endpoint at launch, or is self-hosting the only sovereign path?
3. **PLE memory overhead** — per-layer embeddings add memory in exchange for compute savings; quantify the tradeoff before committing E4B to Jetson.
4. **MoE routing stability** — 4B-active MoEs historically have load-balance pathologies. Needs eval on DWS compliance prompts before production.

---

## Action Items

- [ ] Verify Gemma 4 availability in Ollama registry (report only, do not pull)
- [ ] Add Gemma 4 row to `2026-03-26-best-local-models-by-ram-tier.md` (once available)
- [ ] Queue thesis + PHD_FIREHORSE Gemma 2 → Gemma 4 update as a **single coordinated change** per Thesis Update Rule
- [ ] Benchmark Gemma 4 26B A4B against Qwen3-Coder-Next on DWS compliance eval set
- [ ] Confirm Gemma 4 license before embedding in Signed Reports

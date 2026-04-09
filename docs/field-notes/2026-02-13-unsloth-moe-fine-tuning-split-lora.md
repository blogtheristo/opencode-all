# Field Note: Unsloth AI + Hugging Face — 12x Faster MoE Fine-Tuning with Split LoRA

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/update-lab-notes-unsloth-xVRjL | Date: 13.02.2026 | Changes: Initial creation - LWM lab note on Unsloth Split LoRA for MoE fine-tuning

Session Links & References:
  - Claude Code (claude/update-lab-notes-unsloth-xVRjL): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-02-13-unsloth-moe-fine-tuning-split-lora.md

Document Status:
  - Created: 13.02.2026
  - Last Modified: 13.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Ontology Tags

- **Geography:** Global > USA/Australia (Unsloth AI) > Global Open Source
- **Sector:** Technology > AI/ML > Large Language Models > Fine-Tuning > Mixture of Experts
- **Entities:** Unsloth AI, Hugging Face, OpenAI (gpt-oss), Qwen Team, GLM/THUDM, PyTorch, Triton, DWS IQ 6, LWM
- **Temporal Context:** 2026-Q1, Post-Transformers-v5 Era, MoE Democratization
- **Confidence:** High

---

## Executive Summary

**Unsloth AI**, in collaboration with **Hugging Face**, has released a major advancement for fine-tuning **Mixture of Experts (MoE)** large language models. Their new **Split LoRA** technique, combined with custom **Triton kernels** and PyTorch's `torch._grouped_mm`, achieves up to **~12x faster** MoE fine-tuning with **~35% less VRAM** and support for **~6x longer context lengths** — all with **zero accuracy loss**.

### Key Highlights

| Metric | Improvement | Baseline |
|--------|-------------|----------|
| **Training Speed** | ~12x faster overall | vs. Transformers v4 (additional ~2x on top of v5's ~6x) |
| **VRAM Usage** | ~35% less on average | vs. standard fine-tuning |
| **Context Length** | ~6x longer supported | Same VRAM budget |
| **Accuracy** | Zero loss | Split LoRA is mathematically exact |

This makes fine-tuning large MoE models practical on consumer hardware, free Colab instances, or limited data-center GPUs.

---

## The Observation

### Core Innovation: Split LoRA

Traditional LoRA applies low-rank adapters to model layers uniformly. MoE architectures — with their many experts and token-routing mechanisms — create memory and compute bottlenecks that standard LoRA cannot efficiently address.

**Split LoRA** reformulates LoRA application to work per expert/group within the MoE architecture:

- **Mathematically exact** — no approximations, hence no accuracy degradation
- Splits LoRA adapters efficiently across MoE experts
- Eliminates memory overhead from redundant adapter copies
- Preserves full equivalence to standard LoRA outputs

```
┌─────────────────────────────────────────────────────────────┐
│              Standard LoRA vs. Split LoRA on MoE            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Standard LoRA (wasteful on MoE):                          │
│  ┌──────────┐    ┌────────┐    ┌────────┐                  │
│  │ Expert 1 │◄───│ LoRA A │    │ LoRA B │                  │
│  │ Expert 2 │◄───│  (full │    │  (full │    High VRAM     │
│  │ Expert 3 │◄───│  copy) │    │  copy) │    Slow          │
│  │ Expert N │◄───│        │    │        │                  │
│  └──────────┘    └────────┘    └────────┘                  │
│                                                             │
│  Split LoRA (efficient on MoE):                            │
│  ┌──────────┐    ┌────────────────────┐                    │
│  │ Expert 1 │◄───│ Split LoRA         │                    │
│  │ Expert 2 │◄───│  (grouped per      │    Low VRAM        │
│  │ Expert 3 │◄───│   expert, exact    │    Fast            │
│  │ Expert N │◄───│   equivalence)     │                    │
│  └──────────┘    └────────────────────┘                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Custom Triton Kernels

Unsloth wrote hand-optimized **Triton kernels** (using OpenAI's Triton GPU programming language) for MoE operations:

- Grouped GEMM for expert routing and computation
- Outperform PyTorch's optimized `torch._grouped_mm` in many cases
- **Automatic backend selection**: Triton or `torch._grouped_mm` based on hardware
- Compatible across GPU families: H100, B200, A100, RTX 30/40-series

### Broader Ecosystem Integration

- Builds on **Hugging Face Transformers v5** MoE improvements
- Standardized `torch._grouped_mm` for grouped matrix multiplications
- Extends Unsloth's existing optimizations (manual backprop, sequence packing, etc.)

---

## Documented Benchmarks

All benchmarks use LoRA (rank=64, applied to MoE layers: gate/up/down) unless noted.

### Qwen3-30B-A3B (30B total, ~3B active MoE)

| Metric | Result | Notes |
|--------|--------|-------|
| **Speedup** | ~1.77–1.8x | On H100/B200 |
| **VRAM** | 17.5 GB | For 16-bit LoRA |
| **Scaling** | Memory savings grow with sequence length | Efficiency compounds |

### GLM-4.7 Flash (30B MoE, ~3–3.6B active)

| Metric | Result | Notes |
|--------|--------|-------|
| **Throughput** | Up to 2.6x faster | vs. optimized Transformers v5 |
| **VRAM** | >15% less | Across batch sizes |
| **Strength** | Coding/agentic tasks | Strong niche performance |

### gpt-oss-20b (OpenAI open-weight MoE)

| Metric | Result | Notes |
|--------|--------|-------|
| **VRAM** | 12.8 GB | Viable on consumer GPUs (RTX 3090/4090) |
| **Speed** | ~7x faster training | In some configurations |
| **VRAM Reduction** | 36% | In some configurations |
| **Free Colab** | YES | Runs on free-tier GPU instances |

### Qwen3-14B (Dense, for reference)

| Metric | Result | Notes |
|--------|--------|-------|
| **Speed** | ~2x faster | vs. standard training |
| **VRAM** | 70% less | Fits on free Colab T4 GPUs |

### Scaling Behavior

Efficiency gains **compound** with model size, sequence length, and batch size — the bigger and longer the run, the larger the relative savings. Exponential memory benefits observed at scale.

---

## Why This Matters for DWS IQ 6

### The Ground Truth

**MoE fine-tuning was previously impractical for most organizations because:**
- VRAM requirements exceeded consumer/mid-range hardware
- Training was prohibitively slow for iteration
- Context lengths were severely limited by memory constraints

**Unsloth + Split LoRA changes this by:**
- Making 30B+ MoE models fine-tunable on a single consumer GPU
- Enabling rapid iteration cycles (7–12x faster)
- Supporting longer context windows for document-heavy training data

### LWM Training Pipeline Impact

This directly affects our Lifetime World Model training infrastructure:

```
┌─────────────────────────────────────────────────────────────┐
│           LWM Fine-Tuning with Unsloth Split LoRA          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Before (Transformers v4):                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ MoE Base │───▶│ Standard │───▶│ Slow     │   A100/H100 │
│  │ Model    │    │ LoRA     │    │ Training │   required   │
│  └──────────┘    └──────────┘    └──────────┘             │
│                                                             │
│  After (Unsloth + Split LoRA):                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ MoE Base │───▶│ Split    │───▶│ 12x      │   RTX 4090  │
│  │ Model    │    │ LoRA     │    │ Faster   │   sufficient │
│  └──────────┘    └──────────┘    └──────────┘             │
│                                                             │
│  Hardware requirement drops from data-center to consumer   │
└─────────────────────────────────────────────────────────────┘
```

### Specific Opportunities

1. **Qwen3-30B-A3B Fine-Tuning** — Previously evaluated in `2026-02-04-qwen3-coder-next-agentic-llm.md`. Now fine-tunable in 17.5 GB VRAM with Split LoRA — achievable on our RTX 4090 or even Jetson Orin Nano with quantization.

2. **gpt-oss-20b Customization** — OpenAI's open-weight MoE at 12.8 GB VRAM opens a new base model option for LWM. Consumer GPU fine-tuning means rapid prototyping without cloud costs.

3. **GLM-4.7 Flash for Agentic Tasks** — Strong in coding/agentic workloads. 2.6x throughput improvement makes it viable for domain-specific fine-tuning on enterprise patterns.

4. **Edge Deployment Pipeline** — Fine-tune on cloud/workstation → quantize → deploy to Jetson Orin Nano. The VRAM savings translate directly to smaller quantized models for edge inference.

---

## Technical Details

### Installation

```bash
pip install --upgrade --force-reinstall --no-cache-dir --no-deps unsloth unsloth_zoo
```

New kernels are enabled automatically after installation. No configuration changes needed.

### Supported Model Families

| Family | Models | Status |
|--------|--------|--------|
| **gpt-oss** | gpt-oss-20b | Supported |
| **Qwen3** | 30B-A3B, 235B, Next variants | Supported |
| **GLM** | GLM-4.7, GLM-4.7-Flash | Supported |
| **DeepSeek** | MoE variants | Supported |
| **Qwen3 Dense** | 14B (reference) | Supported |

### Hardware Compatibility

| GPU | Triton Kernels | torch._grouped_mm | Notes |
|-----|---------------|-------------------|-------|
| NVIDIA H100 | YES | YES | Full performance |
| NVIDIA B200 | YES | YES | Full performance |
| NVIDIA A100 | YES | YES | Full performance |
| RTX 4090 | YES | YES | Consumer, recommended |
| RTX 3090 | YES | YES | Consumer, viable |
| Free Colab T4 | Fallback | YES | Works with limitations |

### Free Colab Notebooks

Available for most supported models:
- gpt-oss-20b on consumer VRAM
- Qwen3-30B-A3B on A100
- Qwen3-14B on T4

---

## Action Items

### Immediate (This Week)

- [ ] Install updated Unsloth in LWM training environment
- [ ] Test Split LoRA on Qwen3-14B (dense) as baseline validation
- [ ] Run gpt-oss-20b Colab notebook to verify 12.8 GB VRAM claim

### Short-term (Q1 2026)

- [ ] Benchmark Split LoRA fine-tuning of Qwen3-30B-A3B on RTX 4090
- [ ] Compare gpt-oss-20b vs. Qwen3-30B-A3B as LWM base model candidates
- [ ] Evaluate GLM-4.7 Flash for agentic/coding fine-tuning

### Medium-term (Q2 2026)

- [ ] Integrate Unsloth Split LoRA into LWM training pipeline (training-manual Part 2)
- [ ] Design fine-tune → quantize → edge-deploy pipeline for Jetson Orin Nano
- [ ] Produce DWS-specific benchmarks comparing MoE vs. dense fine-tuned models

---

## Related Field Notes

- `2026-02-04-qwen3-coder-next-agentic-llm.md` — Qwen3-Coder MoE architecture and LWM integration
- `2026-01-28-eu-tech-stack-sovereignty-positioning.md` — EU data sovereignty (self-hosted fine-tuning relevance)
- `2026-01-21-karp-enterprise-ai-ontology.md` — Enterprise AI strategy context

## Related Core Artifacts

- **Pending:** `ART-2026-XXX-moe-fine-tuning-pipeline.md`
- **Pending:** `ART-2026-XXX-edge-ai-deployment-patterns.md`

## Related LWM Training Manual

- `/product-catalog/LWM/training-manual-part2-data-training.md` — Data Generation & Training (to be updated with Split LoRA path)

---

## References

1. Unsloth AI. "Split LoRA: 12x Faster MoE Fine-Tuning with Zero Accuracy Loss." Unsloth Blog, February 2026.
2. Hugging Face. "Transformers v5: Grouped Matrix Multiplication for MoE." Hugging Face Documentation, 2026.
3. OpenAI. "Triton: An Intermediate Language and Compiler for Tiled Neural Network Computations." OpenAI, 2021.
4. Hu, E. et al. "LoRA: Low-Rank Adaptation of Large Language Models." arXiv:2106.09685, 2021.

---

## Confidence Assessment

| Claim | Confidence | Source |
|-------|------------|--------|
| ~12x faster MoE fine-tuning overall | HIGH | Unsloth official benchmarks (vs. Transformers v4) |
| ~35% less VRAM on average | HIGH | Unsloth official benchmarks |
| Split LoRA is mathematically exact (zero accuracy loss) | HIGH | Analytical proof — no approximation in technique |
| gpt-oss-20b fine-tunes in 12.8 GB VRAM | HIGH | Unsloth official results |
| Qwen3-30B-A3B at 17.5 GB VRAM | HIGH | Unsloth official results |
| GLM-4.7 Flash 2.6x throughput | HIGH | Unsloth official benchmarks |
| Consumer GPU viability (RTX 3090/4090) | HIGH | Extrapolated from VRAM figures |
| LWM pipeline integration benefit | MEDIUM | Internal analysis, needs validation |

---

**Author:** DWS AI Research Team
**Review Status:** Pending team validation
**Next Review:** 2026-02-27 (2 weeks)

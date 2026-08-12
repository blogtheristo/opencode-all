# Field Note: Training LWM for Each Industry - MoE 12x Faster with Unsloth Triton Kernels

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/add-lab-notes-training-EzA66 | Date: 11.02.2026 | Changes: Initial creation - Lab note on Unsloth MoE Triton kernels for LWM industry training
  - Version: 1.1 | Tool: Claude Code (Claude Opus 4.6) | Session: claude/add-lab-notes-training-EzA66 | Date: 11.02.2026 | Changes: Updated to DWS Document Standard v1.4 - added YAML metadata, field note required elements, Pandoc-compatible delimiters

Session Links & References:
  - Claude Code (claude/add-lab-notes-training-EzA66): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-02-11-lwm-industry-training-unsloth-moe-triton.md

Document Status:
  - Created: 11.02.2026
  - Last Modified: 11.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.1
**Date:** 2026-02-11
**Author:** DWS AI Research Team / Lifetime Consulting Oy
**Location:** Finland (Remote)
**Context:** LWM Training Pipeline - Evaluating Unsloth MoE Triton kernels for 16 EU industry verticals
**Category:** Technical / AI-ML / LLM Training
**Tags:** MoE, Triton, Unsloth, LWM, QLoRA, Split-LoRA, DeepSeek, Qwen3, GLM, gpt-oss, HuggingFace, industry-training

---

## Ontology Tags

- **Geography:** Global > USA (Unsloth AI) > France (Hugging Face) > Finland (DWS / Lifetime Consulting)
- **Sector:** Technology > AI/ML > LLM Fine-tuning > Mixture of Experts Training
- **Entities:** Unsloth AI, Hugging Face, DWS IQ 6, LWM, DeepSeek, Qwen Team, GLM (Zhipu AI), NVIDIA, OpenAI (gpt-oss)
- **Temporal Context:** 2026-Q1, Post-MoE Training Revolution, LWM Industry Vertical Scaling
- **Confidence:** High

---

## Executive Summary

Unsloth AI, in collaboration with Hugging Face, has released custom Triton kernels that train Mixture of Experts (MoE) models **12x faster with 35% less VRAM** and zero accuracy loss. This breakthrough directly impacts the DWS IQ 6 Lifetime World Model (LWM) training pipeline, enabling cost-effective fine-tuning of MoE models like DeepSeek, Qwen3, and GLM for each of the 16 EU industry verticals. OpenAI's `gpt-oss` can now be fine-tuned locally on just **12.8 GB VRAM**.

### Key Numbers

| Metric | Value | Context |
|--------|-------|---------|
| **MoE Training Speedup** | Up to 12x faster | vs. baseline Transformers + TRL |
| **VRAM Reduction** | ~35% less | Longer context fits in same memory |
| **gpt-oss-20b VRAM** | 12.8 GB | Consumer GPU fine-tuning possible |
| **Qwen3-30B-A3B VRAM** | 17.5 GB | Fits on single RTX 4090 |
| **GLM 4.7 Flash Speedup** | 2.6x faster | >15% less VRAM across all batch sizes |
| **Accuracy Loss** | 0% | Analytically exact, no approximation |

---

## The Story

Unsloth AI announced a major release in Q1 2026: custom hand-written Triton kernels that dramatically accelerate Mixture of Experts (MoE) model fine-tuning. In collaboration with Hugging Face, they demonstrated 12x faster training with 35% less VRAM across DeepSeek, Qwen3, GLM, and OpenAI's gpt-oss models. This was immediately relevant to the DWS IQ 6 LWM pipeline, which currently fine-tunes dense Llama 3.1 8B models per industry vertical at €50-70 each. The MoE approach could fundamentally change the cost-quality equation for training 16 EU industry-specific models.

---

## The Observation

### What Changed: Split LoRA + Triton Kernels for MoE

The core problem with MoE fine-tuning is LoRA adapter memory overhead. In a model like Qwen3-30B-A3B with 128 experts, LoRA adapters across all experts add up quickly. With hidden size m=2048, intermediate size n=768, and LoRA rank r=64, the ratio r/n = 64/768 is large compared to dense models (e.g., r/n = 64/25600 in Qwen3-32B). Fused `gate_proj` and `up_proj` roughly double this overhead.

**Unsloth's Solution: Split LoRA**

Split LoRA is analytically superior when sequence length s > Emn/k(m+n), which is approximately 16K tokens for Qwen3-30B-A3B style architectures. Key speedups come from reduced memory traffic - modern GPUs are bandwidth-bound, so transferring less data matters more than raw FLOPs.

**Technical Stack:**
- Hand-written Triton kernels with manual backprop engine
- 2.3x faster QK Rotary Embedding fused Triton kernel with packing support
- Updated SwiGLU, GeGLU kernels with int64 indexing for long context
- Smart auto packing for variable-length sequences
- 0% approximation - analytically exact computation

### Benchmark Results

| Model | Hardware | Speedup | VRAM Savings | Notes |
|-------|----------|---------|--------------|-------|
| **Qwen3-30B-A3B** | NVIDIA B200 | ~1.7x | ~35% | Memory savings improve at longer sequences |
| **Qwen3-30B-A3B** | H100 | 1.77x | ~5.3 GB at 4K ctx | Scales to 8K ctx where baseline OOMs |
| **GLM 4.7 Flash** | - | 2.6x | >15% | 30B MoE (3B active), 64 routed + 1 shared expert |
| **gpt-oss-20b** | Consumer GPU | - | Fits 12.8 GB | First time fine-tunable on consumer hardware |
| **Qwen3-14B** | Tesla T4 (free Colab) | 2x | 70% less | Fits in 16 GB |

### Supported Models

In collaboration with Hugging Face, Unsloth now supports faster MoE training for:

- **DeepSeek** R1, V3
- **Qwen3** 30B-A3B, 235B, VL, Coder, 2507 (Thinking & Instruct)
- **GLM** 4.6, 4.7, Flash
- **gpt-oss** (OpenAI's open-source model)
- **Gemma 3** (now uses Flex-Attention by default, O(N) memory, >3x faster)

### Official Resources

| Resource | URL | Purpose |
|----------|-----|---------|
| Unsloth Docs | `unsloth.ai/docs/new/faster-moe` | MoE training documentation |
| GitHub Repo | `github.com/unslothai/unsloth` | Source code, notebooks, examples |
| Hugging Face | `huggingface.co/unsloth/` | Pre-quantized model weights |

---

## Why This Matters for DWS IQ 6 LWM

### Current LWM Training Pipeline Bottleneck

The LWM training manual (DWS-LWM-TRAIN-001) documents fine-tuning Llama 3.1 8B via QLoRA on the Acer Veriton GN-100 for 5 industry verticals at ~€50-70 per industry. The current pipeline uses dense models, limiting:

1. **Model quality** - Dense 8B models lack the specialist capacity of MoE architectures
2. **Context length** - VRAM constraints limit context to ~4K tokens
3. **Scaling** - Training 16 industry verticals is cost/time prohibitive with current setup

### MoE + Unsloth Triton Changes the Equation

```
┌──────────────────────────────────────────────────────────────────────┐
│           LWM Industry Training: Dense vs. MoE Pipeline              │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  BEFORE (Dense - Llama 3.1 8B)        AFTER (MoE - Qwen3-30B-A3B)  │
│  ┌──────────────────────┐             ┌──────────────────────┐      │
│  │ 8B params always on  │             │ 30B total, 3B active │      │
│  │ ~24 GB VRAM needed   │             │ 17.5 GB VRAM needed  │      │
│  │ 4K context limit     │             │ 8K+ context length   │      │
│  │ Generalist model     │             │ Expert routing       │      │
│  │ 16-24h per industry  │             │ Faster convergence   │      │
│  └──────────────────────┘             └──────────────────────┘      │
│                                                                      │
│  gpt-oss-20b Alternative:                                            │
│  ┌──────────────────────┐                                            │
│  │ 20B open-source      │                                            │
│  │ 12.8 GB VRAM (!)     │   ← Consumer GPU / Jetson Orin viable     │
│  │ Local-first training │                                            │
│  │ No API dependency    │                                            │
│  └──────────────────────┘                                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Impact on 16 EU Industry Verticals

The LWM targets EU-regulated industries. With Unsloth MoE training, each vertical benefits from:

| Industry | Regulatory Framework | MoE Advantage |
|----------|---------------------|---------------|
| Logistics | GDPR, Working Time Directive | Expert routing for route vs. compliance tasks |
| Construction | CE Marking, Eurocodes | Separate experts for BIM, safety, cost |
| Manufacturing | ISO 9001, Machinery Directive | Process control vs. quality vs. reporting |
| Energy/Climate | EU ETS, CSRD, Taxonomy | Emissions vs. compliance vs. reporting |
| Healthcare | GDPR-Health, MDR, NIS2 | Clinical vs. documentation vs. privacy |
| Steel | EU ETS, CBAM | Emissions vs. trade compliance |
| Cement | Fit for 55, CBAM | Carbon capture vs. process optimization |
| Chemicals | REACH, CLP | Safety vs. regulatory vs. process |
| Aviation | EU ETS Aviation, CORSIA | Fleet vs. emissions vs. scheduling |
| Maritime | FuelEU Maritime, EU MRV | Route vs. fuel vs. compliance |
| Agriculture | CAP, Farm to Fork | Yield vs. sustainability vs. compliance |
| Waste Management | Waste Framework Directive | Sorting vs. routing vs. reporting |
| Mining | Extractive Waste Directive | Safety vs. environmental vs. production |
| Textiles | EU Strategy for Textiles | Supply chain vs. sustainability |
| Pulp & Paper | IED, EU ETS | Process vs. emissions vs. forestry |
| Food & Beverage | Food Safety, CSRD | Safety vs. supply chain vs. reporting |

**MoE expert routing naturally maps to these multi-domain requirements** - each industry needs expertise in operations, compliance, and reporting, which different experts in the MoE architecture can specialize in.

---

## Proposed Changes to LWM Training Pipeline

### Phase 1: Evaluate MoE Base Models (Q1 2026)

1. **Benchmark candidates on DWS6 industry tasks:**
   - Qwen3-30B-A3B (17.5 GB VRAM, 128 experts)
   - gpt-oss-20b (12.8 GB VRAM, open-source)
   - GLM 4.7 Flash (30B MoE, 3B active, agentic focus)

2. **Install Unsloth with Triton kernel support:**
   ```bash
   pip install unsloth[triton]
   # or from source for latest MoE support
   pip install git+https://github.com/unslothai/unsloth.git
   ```

3. **Run comparison fine-tune on logistics vertical:**
   - Dense Llama 3.1 8B (current baseline)
   - MoE Qwen3-30B-A3B with Split LoRA
   - MoE gpt-oss-20b with Split LoRA
   - Measure: training time, VRAM usage, evaluation score, inference latency

### Phase 2: Update Training Manual (Q1-Q2 2026)

Update `product-catalog/LWM/training-manual-part2-data-training.md` to include:
- MoE model selection guide
- Unsloth Split LoRA configuration for MoE
- Updated VRAM requirements table
- Revised cost estimates (expected reduction)

### Phase 3: Scale to 16 Industries (Q2-Q3 2026)

**Revised cost estimate with MoE + Unsloth:**

| Item | Before (Dense) | After (MoE + Unsloth) | Savings |
|------|----------------|----------------------|---------|
| Training time per industry | 16-24h | 2-6h (est.) | ~75% |
| VRAM required | ~24 GB | 12.8-17.5 GB | ~35% |
| Claude API (data gen) | €40-60 | €40-60 (unchanged) | 0% |
| Electricity per industry | €5-8 | €1-3 (est.) | ~65% |
| **Total per industry** | **€50-70** | **€45-65 (est.)** | ~10% |
| **Total 25+ industries** | **€800-1,120** | **€720-1,040 (est.)** | ~10% |

**The real win is not cost but quality:** MoE models with 30B total parameters provide significantly better domain expertise than dense 8B models, while using less VRAM.

### Edge Deployment Opportunity

gpt-oss-20b at 12.8 GB VRAM opens a new path:

| Platform | VRAM | gpt-oss-20b | Qwen3-30B-A3B |
|----------|------|-------------|----------------|
| NVIDIA Jetson Orin Nano (8GB) | 8 GB | Needs quantization | No |
| NVIDIA Jetson AGX Orin (32GB) | 32 GB | YES | YES |
| RTX 4060 Ti (16GB) | 16 GB | YES (with offload) | Tight |
| RTX 4090 (24GB) | 24 GB | YES | YES |
| Acer Veriton GN-100 | 24 GB | YES | YES |

---

## The Insight

### Why MoE Architecture Fits LWM Industry Training

The Lifetime World Model's per-industry training approach has a natural alignment with MoE architectures:

1. **Expert specialization mirrors industry domains** - An MoE model fine-tuned for energy/climate will develop experts that specialize in emissions calculation, regulatory compliance, and operational reporting separately.

2. **Sparse activation = efficient inference** - Only 3B of 30B parameters activate per token, meaning industry-specific LWMs run fast at inference time despite large total parameter counts.

3. **Unsloth eliminates the training bottleneck** - Previously, MoE fine-tuning was impractical due to LoRA overhead across 128 experts. Split LoRA + Triton kernels make it feasible on single-GPU setups.

4. **Open-weight MoE models break vendor lock-in** - gpt-oss, Qwen3, and DeepSeek are all open-weight, aligning with EU digital sovereignty requirements.

### Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Unsloth Triton kernels introduce subtle bugs | LOW | HIGH | 0% approximation claim; validate with evaluation suite |
| MoE models underperform dense on narrow tasks | MEDIUM | MEDIUM | Benchmark before committing to pipeline change |
| VRAM estimates don't hold for long sequences | LOW | LOW | Unsloth handles 8K where baseline OOMs at 4K |
| Dependency on Unsloth (small team) | MEDIUM | MEDIUM | Triton kernels are open-source, can fork if needed |

---

## Next Steps

### Immediate (This Week)

- [ ] Install Unsloth with Triton MoE support on Acer Veriton GN-100
- [ ] Download Qwen3-30B-A3B and gpt-oss-20b from Hugging Face
- [ ] Run baseline benchmark: logistics vertical on current dense pipeline

### Short-term (Q1 2026)

- [ ] Complete MoE vs. dense comparison for logistics vertical
- [ ] Evaluate GLM 4.7 Flash as alternative MoE base
- [ ] Document results as field note
- [ ] Update LWM training manual Part 2 with MoE option

### Medium-term (Q2-Q3 2026)

- [ ] Train MoE-based LWM for all 16 industry verticals
- [ ] Benchmark inference latency for edge deployment
- [ ] Evaluate gpt-oss-20b on NVIDIA Jetson AGX Orin

---

## Related Field Notes

- `2026-02-04-qwen3-coder-next-agentic-llm.md` - Qwen3 MoE architecture analysis
- `2026-01-28-eu-tech-stack-sovereignty-positioning.md` - EU sovereignty and open-weight models
- `2026-01-27-apply-ai-robotics-manufacturing-webinar.md` - Manufacturing industry AI context

## Related Core Artifacts

- **DWS-LWM-TRAIN-001** - LWM Training Manual (to be updated with MoE pipeline)
- **Pending:** `ART-2026-XXX-moe-industry-training-benchmark.md`

---

## References

1. Unsloth AI. "Fine-tune MoE Models 12x Faster." `unsloth.ai/docs/new/faster-moe`
2. Unsloth AI GitHub. `github.com/unslothai/unsloth`
3. DWS LWM Training Manual. `product-catalog/LWM/training-manual.md`
4. Hugging Face / Unsloth Models. `huggingface.co/unsloth/`
5. Qwen3 MoE Documentation. `qwen.readthedocs.io/en/latest/training/unsloth.html`

---

## Confidence Assessment

| Claim | Confidence | Source |
|-------|------------|--------|
| 12x faster MoE training | HIGH | Unsloth official docs, benchmarks |
| 35% VRAM reduction | HIGH | Measured on B200 and H100 |
| 0% accuracy loss (exact computation) | HIGH | Analytically proven Split LoRA |
| gpt-oss-20b fits 12.8 GB VRAM | HIGH | Unsloth official benchmark |
| MoE architecture fits LWM industry model | MEDIUM-HIGH | Architectural analysis, not yet validated |
| Cost savings estimates for 25+ industries | MEDIUM | Extrapolated from single-model benchmarks |
| Edge deployment on Jetson | MEDIUM | VRAM requirements match, not tested |

---

**Author:** DWS AI Research Team
**Review Status:** Pending team validation
**Next Review:** 2026-02-25 (2 weeks)

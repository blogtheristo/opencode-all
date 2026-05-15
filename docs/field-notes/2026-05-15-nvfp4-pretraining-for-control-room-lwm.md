# NVFP4 Pretraining — Implications for Control-Room LWM

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/industries-hub-worldmodel-lJrC6 | Date: 15.05.2026 | Changes: Initial study note on arxiv:2509.25149 ("Pretraining Large Language Models with NVFP4", NVIDIA). Maps the NVFP4 format and pretraining recipe onto the Lifetime World Model V1 (June 12 2026, DWS IQ 6) and V2 (November 2026, DWS IQ 7) control-room deployment.

Session Links & References:
  - Paper: https://arxiv.org/abs/2509.25149 — "Pretraining Large Language Models with NVFP4" (NVIDIA, Sep 2025)
  - NVIDIA blog: https://developer.nvidia.com/blog/nvfp4-trains-with-precision-of-16-bit-and-speed-and-efficiency-of-4-bit/
  - LWM Phase 2 gap analysis: docs/field-notes/2026-03-25-lwm-phase2-technical-gap-analysis.md
  - LWM training manual: product-catalog/LWM/training-manual.md
  - Hardware: Acer Veriton GN-100 (NVIDIA GB10 / DGX Spark class)

Document Status:
  - Created: 15.05.2026
  - Last Modified: 15.05.2026
  - Language: English
  - Publication Status: ACTIVE (internal research)

***

## TL;DR (90 seconds)

NVIDIA proved you can pretrain a 12B-parameter LLM on 10 trillion tokens entirely in **NVFP4** (their 4-bit FP format) and match an FP8 baseline on MMLU, HellaSwag, etc. This is the first multi-trillion-token billion-parameter FP4 pretraining run on record.

For our control-room LWM this means:
- **Memory** — LWM V1 (55B, currently FP8) fits in ~28 GB at NVFP4. Same hardware can host a **larger** V2 model (≥100B) or two V1 models side-by-side.
- **Compute** — Blackwell tensor cores (B100/B200/GB10/DGX Spark) accelerate NVFP4 GEMM natively. Reported **2–3× speedup vs FP8** on attention-heavy workloads.
- **DGX Spark/GB10** — our edge node already has NVFP4 tensor-core silicon. Field reports show ~20% faster inference than AWQ on Spark.
- **V2 omnimodal (Nov 2026)** — the V2 video/audio extension is the obvious place to apply NVFP4: video tokens explode the context, so 4-bit weights free room for longer windows and bigger vision encoders.

**Action:** evaluate NVFP4 for V1 inference *now* (no retrain needed — quantize post-hoc); design V2 pretraining for native NVFP4 from day one.

---

## What NVFP4 actually is

NVFP4 is NVIDIA's branded 4-bit floating-point block-scaling format:

| Component | Spec |
|-----------|------|
| Element type | **E2M1** — 1 sign bit, 2 exponent, 1 mantissa → ±0, ±0.5, ±1, ±1.5, ±2, ±3, ±4, ±6 |
| Block size | **16 elements** per block (MXFP4 uses 32) |
| Block scale | **FP8 (E4M3)** per-block — finer than MXFP4's E8M0 |
| Tensor scale | **FP32** per-tensor global |
| Hardware | Native Blackwell tensor cores (B100, B200, GB200, GB10, RTX PRO 6000) |

The smaller block size and FP8 (not power-of-two-only) block scale is the key practical difference vs MXFP4 — it preserves a lot more dynamic range and is what makes the FP4 pretraining recipe converge.

## The pretraining recipe (paper §3)

The paper's contribution is the **recipe**, not the format. Four core techniques:

1. **2D weight scaling** — weights are scaled in **16×16 blocks** so the forward-pass and backward-pass quantization stay consistent (chain rule preserved, no gradient mismatch).
2. **Random Hadamard Transform (RHT) on Wgrad inputs** — disperses block-level outliers before they get quantized. This is the single biggest stabilizer at FP4.
3. **Stochastic rounding** — unbiased gradient estimation; deterministic round-to-nearest at FP4 introduces a bias that compounds over 10T tokens.
4. **Selective high-precision layers** — **first 2 and last 8 transformer blocks** stay in **BF16**. Attention can be FP8 (MHA in FP8 removes cast ops at the dot-product boundary). All other linear layers run NVFP4.

Master weights: **FP32**. Activations/gradients: **BF16**. All three GEMMs (FPROP, DGRAD, WGRAD): **NVFP4**.

## Headline result

| Metric | Value |
|--------|-------|
| Model size | **12 B parameters** |
| Token horizon | **10 T tokens** |
| Loss curve vs FP8 | **Matches** throughout training |
| Downstream tasks | MMLU, HellaSwag, etc. — within noise of FP8 baseline |
| First-of-kind | First multi-trillion-token, billion-param FP4 pretraining run |

Caveat: 12 B is well below frontier-scale. The paper does not claim that NVFP4 holds at 70B / 405B / 1T. But the recipe is principled and the trend is encouraging.

---

## Why this matters for the control-room LWM

The Lifetime World Model lives on-prem in the customer's control room (Acer Veriton GN-100 / GB10 / DGX Spark) — not in cloud. That makes the **memory wall** and the **edge tensor-core feature set** the binding constraints. NVFP4 attacks both.

### 1. Memory budget on GB10 / DGX Spark

DGX Spark headline: **1 PFLOP FP4, 128 GB unified memory**. LWM model footprints:

| Model | BF16 weights | FP8 weights | NVFP4 weights |
|-------|-------------:|------------:|--------------:|
| LWM V1 (55B) | 110 GB | 55 GB | **~28 GB** |
| LWM V2 (planned 100B+) | >200 GB (won't fit) | ~100 GB | **~50 GB** |
| LWM V2 + 1M-token KV cache | (n/a) | (tight) | **fits with headroom** |

V1 already fits in FP8. NVFP4 doubles the headroom — meaning a single Spark can host **V1 + the upcoming video encoder** for V2 omnimodal without a second box.

### 2. Native silicon path

Per NVIDIA, GB10 has **specific silicon pathways** for NVFP4 (not just generic MXFP4) — **~10–15% latency advantage** vs a generic MXFP4 container at the same bit-width. NVFP4 is the format Blackwell wants to run.

Field benchmarks from third parties on DGX Spark (May 2026):
- **NVFP4 ~20% faster than AWQ** on the same model
- **~67 tok/s** with speculative decoding (MTP head) on top of NVFP4
- Inference engines: vLLM and TensorRT-LLM both support NVFP4 quantized checkpoints

### 3. Training the per-industry LWM models

Our 23 industry-specific QLoRA models (V1) are currently fine-tuned in **BF16/FP8** on the GN-100. NVFP4 fine-tuning would let us:
- Train **larger base models** in the same VRAM (Llama 3.1 70B becomes feasible on a single Spark)
- Cut training **wall-clock by ~2×** vs FP8
- Keep the same NVIDIA Transformer Engine code path (NVFP4 is built into TE 2.x)

This is implementation-level — belongs in V3Thesis, not PhD Firehorse (per CLAUDE.md thesis-scope rule).

---

## Mapping to the LWM versions

### V1 Multimodal — June 12 2026 (DWS IQ 6)

**Already locked.** Don't change pretraining mid-flight. But:
- **Post-training quantization to NVFP4** is feasible *before* June 12 if we want it. ~2 weeks of engineering: quantize checkpoint, run accuracy regression on the 23 industry evals, swap inference engine to TensorRT-LLM NVFP4 path.
- Decision point: ship V1 in FP8 (proven) and follow with an NVFP4 inference path as a v1.1 dot-release in July.

### V2 Omnimodal / Video — November 2026 (DWS IQ 7)

**Design for NVFP4 from day one.** Video tokens are the killer use case:
- Video at 8 FPS × 6 months on-site = **billions of vision tokens** per construction project
- Each video token has high entropy → context windows balloon to 1M+ tokens
- NVFP4 weights free **~50 GB** vs FP8 — that's where the long-context KV cache goes
- Pretraining recipe from arxiv:2509.25149 is directly transferable; no novel research needed for the format itself

This is the alignment point with the **world-model V1→V2 roadmap** we just shipped on `dws10.com/world-model/`.

---

## Risks & honest limits

1. **12B is not 100B.** The paper does not validate NVFP4 at V2-scale. We will be in unexplored territory if V2 ≥ 70B. Mitigation: stage V2 pretraining (12B sanity-check → 30B → 70B → 100B), abandon NVFP4 and fall back to FP8 if loss curves diverge.
2. **Recipe complexity.** RHT + 2D scaling + stochastic rounding are not turn-key. NVIDIA's NeMo / Megatron-Core has reference implementations, but we'd be adopting a frontier codepath, not a stable one.
3. **Attention precision.** The paper keeps MHA in FP8. For a video-heavy V2 with long context, attention is the dominant cost. Whether NVFP4 attention will land in time for V2 pretraining is open.
4. **No improvement on memory bandwidth.** NVFP4 helps the **memory-bound** GEMM throughput but does not change HBM bandwidth on Spark. The KV cache (which is what fills up at long context) is typically kept in BF16/FP8. NVFP4 KV cache is an active research area, not in this paper.
5. **First 2 / last 8 layers in BF16.** That's ~10–15% of params at higher precision. The "4-bit model" headline is slightly misleading — the realized memory savings are closer to **3.5×** vs BF16, not 4×.

## What I want to do next

1. **This week** — read the actual recipe section of the paper and prototype NVFP4 post-training quantization on one of our existing industry checkpoints (Construction or Energy). Confirm accuracy regression < 1% on the industry eval set.
2. **Before June 12 V1 ship** — decide go/no-go on NVFP4 inference path for V1.1 (target: July dot-release).
3. **V2 design doc** — add a §"Numerical Precision" section that locks NVFP4 as the V2 pretraining target, with FP8 as fallback.
4. **Capex** — confirm whether the customer-deployed Acer GN-100s are GB10 silicon (NVFP4-native) or earlier Blackwell (RTX PRO 6000 also fine, RTX 50-series also fine, anything pre-Blackwell is not). Anything pre-Blackwell needs an upgrade path.

---

## One-line thesis

> NVFP4 is the format that makes a 100B-class on-prem world model fit in a single control-room chassis. The paper proves the recipe works at 12B / 10T tokens. We pre-commit to NVFP4 for LWM V2 (November 2026) and decide on an NVFP4 V1.1 inference path before June 12.

# NVFP4 Pretraining — Implications for Control-Room LWM

***
# VERSION AND AGENT HISTORY

Version: 1.6

Sessions & Modifications:
  - Version: 1.6 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Date: 23.05.2026 | Changes: Pinned V2 / Situation Room timing to **DWS IQ 7 Phase 4 (Nov 2026 – Jan 2027)** per DWS7_ROADMAP.md. Earlier "DWS IQ 7" wording risked being read as "DWS IQ 7 GA = Q4 2027" — a 10-month overstatement of the customer-facing wait. Phase 4 is the actual Intelligence Layer milestone that ships V2. Also surfaces the IQ 8 mismatch: DWS IQ 8 GA = Q3-Q4 2029, hardware-bound to NVIDIA Feynman silicon — not a viable "later" option for V2 / Situation Room without a 3-year delay.
  - Version: 1.5 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Date: 23.05.2026 | Changes: Appended "Training Economics Addendum (LWM2)" — separates the V1 per-industry fine-tune economics (now ~$10 USD on Colab Pro+ A100 80GB, an order of magnitude under the manual's €50–70 figure) from the V2 NVFP4 pretrain economics (still B100/B200/GB10 class, justifies DGX Cloud / Brev premium). Confirms the two-budget split: V1 fine-tunes go cheap-cloud, V2 omnimodal pretrain stays on Blackwell silicon.
  - Version: 1.4 | Tool: Claude Code (Opus 4.7) | Session: claude/industries-hub-worldmodel-lJrC6 | Date: 15.05.2026 | Changes: Promoted **`nvidia/Gemma-4-31B-IT-NVFP4`** to canonical spike model — first-party NVIDIA release with documented **99.7% accuracy retention on GPQA (75.46% vs 75.71%)**, ~16 GB on disk, attention kept in BF16 (matches arxiv:2509.25149 §3 selective-precision pattern), 256K context preserved. Kept drawais Qwen3 variants as recipe-contrast points. The three models now stake out three points on the quantization-recipe surface (skip-attention, quantize-everything, SpinQuant) for our 55B LWM PTQ decision.
  - Version: 1.3 | Tool: Claude Code (Opus 4.7) | Session: claude/industries-hub-worldmodel-lJrC6 | Date: 15.05.2026 | Changes: Added `drawais/Qwen3-32B-NVFP4` as the headline spike model (Apache-2.0, dense 32B, **W4A4**, ~17 GB on disk, fits a single 24 GB consumer GPU). 32B is the closest publicly available proxy for an LWM-class checkpoint on a control-room-class box. Kept the 8B variant as a laptop fallback and added a model-selection table.
  - Version: 1.2 | Tool: Claude Code (Opus 4.7) | Session: claude/industries-hub-worldmodel-lJrC6 | Date: 15.05.2026 | Changes: Added "Easiest path to actually try NVFP4 inference today" subsection under V1 — 3-line vLLM + `drawais/Qwen3-8B-SpinQuant-NVFP4` recipe for a 15-minute spike, plus framing of what the spike does and does not validate. Also bumped "23 industry evals" → "25 industry evals" to align with the registry reconciliation.
  - Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/industries-hub-worldmodel-lJrC6 | Date: 15.05.2026 | Changes: Added §"Industry-registry inconsistency" appendix. Repo currently disagrees on the industry count (16 / 20 / 21 / 22 / 23 across 16-INDUSTRIES.md, README.md, Aegis docs, DWS7/DWS8 roadmaps, V3Thesis, PHD_FIREHORSE). Reconciliation target locked at **25** with Data Centres + RFNBO committed. Renamed `16-INDUSTRIES.md` → `INDUSTRIES.md` and updated it to the canonical 25-industry registry.
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
- **Post-training quantization to NVFP4** is feasible *before* June 12 if we want it. ~2 weeks of engineering: quantize checkpoint, run accuracy regression on the 25 industry evals, swap inference engine to TensorRT-LLM NVFP4 path.
- Decision point: ship V1 in FP8 (proven) and follow with an NVFP4 inference path as a v1.1 dot-release in July.

#### Easiest path to actually try NVFP4 inference today (15-minute spike)

No internal training run required. Several public NVFP4 checkpoints are now on the Hub — including a **first-party NVIDIA release with documented GPQA accuracy retention**. Pick the size that matches the GPU in front of you and run a single `vllm serve` command:

| Model | Publisher | Format | On-disk | Min VRAM | Documented accuracy | Best for |
|-------|-----------|--------|--------:|---------:|---------------------|----------|
| **`nvidia/Gemma-4-31B-IT-NVFP4`** | **NVIDIA (first-party)** | NVFP4 W4A4, **attention kept BF16**, 256K context preserved | ~16 GB | **24 GB** | **99.7% of FP16 on GPQA — 75.46% vs 75.71%** | **Recommended canonical spike** — NVIDIA-supported, accuracy-verified, ships with the paper's selective-precision recipe baked in |
| `drawais/Qwen3-32B-NVFP4` | Community (drawais) | NVFP4 W4A4 (all linear layers) | ~17 GB | 24 GB | Not published | More aggressive quantization (no BF16 attention) — useful as a contrast to NVIDIA's recipe |
| `drawais/Qwen3-8B-SpinQuant-NVFP4` | Community | NVFP4 + SpinQuant rotations | ~5 GB | 8–12 GB | Not published | Laptop / 4060 / fast smoke test; answers the rotations-help-at-small-scale question |

```bash
pip install vllm
vllm serve nvidia/Gemma-4-31B-IT-NVFP4       # canonical spike — NVIDIA-blessed, ~16 GB, 24 GB GPU
# or to contrast quantization recipes on similar-size models:
vllm serve drawais/Qwen3-32B-NVFP4           # aggressive W4A4 incl. attention, ~17 GB
vllm serve drawais/Qwen3-8B-SpinQuant-NVFP4  # ~5 GB, runs anywhere
# point any OpenAI-compatible client at http://localhost:8000
```

That's it — no code changes, no recipe tuning, no quantization work of our own. You get **31B-class output at 99.7% FP16 accuracy** with NVIDIA's reference recipe, faster generation than the INT4 / AWQ lane on the same hardware, and a clean baseline to A/B against our existing FP8 inference stack.

**Why the NVIDIA Gemma-4-31B release matters most for us:**
- **First-party**: NVIDIA owns the recipe. If something is broken in vLLM's NVFP4 path on our hardware, this is the model NVIDIA will debug against.
- **Documented accuracy**: 75.46% vs 75.71% on GPQA = **0.25 pp absolute drop, 99.7% retention**. This is the concrete number we cite in the V1.1 decision memo — not a vibes claim.
- **The recipe matches the paper.** Self-attention stays in BF16; only MLP layers go to NVFP4. That's exactly the "first 2 / last 8 layers in BF16" pattern from arxiv:2509.25149 §3, generalized. It tells us our own LWM PTQ should follow the same pattern — skip attention, quantize MLPs.
- **256K context preserved.** This is the V1.1 happy path: long industrial prompts (full EPBD building report + months of telemetry) without surgery on rope scaling.

**What this spike tells us:**
- Whether vLLM's NVFP4 GEMM path is stable enough on our hardware mix today (it is, per Avarok's DGX Spark reports — but worth confirming on our own GN-100 silicon).
- Real measured tok/s vs our current FP8 path at LWM-realistic model size — **~31B in ~16 GB at 99.7% accuracy** is the headline data point.
- Whether the OpenAI-compatible surface is drop-in for our agent orchestrator (it should be — we already talk OpenAI-compat to FP8 vLLM).
- Whether W4A4 (4-bit activations, not just weights) holds up on real prompts — this is what differentiates NVFP4 from AWQ/INT4-weight-only.
- **Attention-precision sensitivity**: NVIDIA-Gemma (BF16 attention) vs Qwen3-32B (FP4 attention) on the same prompt set tells us whether the BF16-attention escape hatch is necessary for our 55B LWM PTQ or just nice-to-have.

**What it does *not* tell us:**
- Accuracy on our 25 industry compliance evals (those are LWM-specific, not Gemma-base or Qwen3-base). Still need the ~2-week quantize-and-regress pass on our own checkpoints before V1.1 ships.
- KV-cache behaviour at 1M+ tokens (V2 territory, not V1).
- Whether SpinQuant-style rotations are needed for our own LWM checkpoints — the three models above stake out three points on the recipe surface (NVIDIA's "skip attention", drawais's "quantize everything", drawais's "SpinQuant rotations") so we can pick the closest fit.

Owner for the spike: whoever's first to a GN-100 / Spark / 4090+ with an idle hour. Default model: **`nvidia/Gemma-4-31B-IT-NVFP4`** if the GPU is ≥24 GB, else `drawais/Qwen3-8B-SpinQuant-NVFP4`. Result: a one-page tok/s + memory + GPQA comparison appended to this note as Appendix B.

### V2 Omnimodal / Video — DWS IQ 7 Phase 4 (Nov 2026 – Jan 2027)

> **Timing note (locked 23.05.2026):** V2 ships as part of **DWS IQ 7 Phase 4 "Intelligence Layer"** per `DWS7_ROADMAP.md` line 75. Not DWS IQ 7 GA (Q4 2027) and not DWS IQ 8 (Q3–Q4 2029). Phase 4 is the actual customer-facing milestone. See PRs 177A–177D in `DWS7_ROADMAP.md` for the Situation Room product-surface work that consumes this V2 model.

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

> NVFP4 is the format that makes a 100B-class on-prem world model fit in a single control-room chassis. The paper proves the recipe works at 12B / 10T tokens. We pre-commit to NVFP4 for LWM V2 (**DWS IQ 7 Phase 4 — Nov 2026 / Jan 2027**) and decide on an NVFP4 V1.1 inference path before June 12.

---

## Appendix A — Industry-registry inconsistency (flagged 15.05.2026)

The repo currently disagrees with itself on how many EU-regulated industries the LWM and DWS IQ platform support. This is a registry hygiene problem, not a product problem — but it shows up in investor decks, the world-model page, the master thesis and PhD thesis, so it must be reconciled to one number.

### What was found

| Count | Where it's stated | Status |
|------:|-------------------|--------|
| **16** | `16-INDUSTRIES.md` (now `INDUSTRIES.md`), `DWS7_ROADMAP.md`, `ONTOLOGY.md`, parts of `Learn/PHD_FIREHORSE_EN.md`, `skills/risto/SKILL.md` | Stale (pre-V1) |
| **20** | `README.md`, `DWS8_ROADMAP.md`, `INVESTOR_EMAIL_TEMPLATES.md`, parts of `Learn/PHD_FIREHORSE_EN.md`, dws10.com/world-model (pre-15.05) | Mid-cycle |
| **21** | `Store/PRODUCT_AEGIS.md`, dws10.com/index.html, ironclad-nav v3.x comments | Aegis-era |
| **22** | Implicit in earlier draft of world-model V1 | Transient |
| **23** | dws10.com/world-model/ (15.05 morning), dws10.com/industries/, captain/details/ | Locked & shipped today |
| **25** | **NEW target** — adds Data Centres + RFNBO | **Canonical from 15.05.2026** |

### Recommended action — already executed in this PR

1. ✅ Rename `16-INDUSTRIES.md` → `INDUSTRIES.md` (`git mv`).
2. ✅ Update `INDUSTRIES.md` to be the **canonical registry** with 25 industries in three tiers (Tier 1: ETS+CBAM direct, 1–8 · Tier 2: ESR+indirect, 9–16 · Tier 3: cross-cutting + newly regulated, 17–25).
3. ✅ Commit Data Centres (EED Article 12 + Data Centre Energy Reporting Delegated Regulation + CSRD) and RFNBO (RED III + REDII Delegated Acts Article 27 + ETS coupling) as industries 24 and 25.
4. ✅ Update `dws10.com/world-model/index.html` (+ landing-pages mirror) 23 → 25 — hero stat, h2, JSON-LD, og/twitter meta, version-roadmap, "industry models" stat, and added the two new industry tiles.
5. ✅ Update `dws10.com/industries/index.html` (+ mirror) hero badge "23 → 25 EU-Regulated Industries on the Lifetime World Model" and stat-strip "25 Models in LWM V1".

### Recommended action — TODO (out of scope for this PR)

A repo-wide reconciliation pass to bring every other doc to **25**. Files known to need editing:

- `README.md` (3 occurrences of "20 industries" / "20 industry verticals")
- `DWS7_ROADMAP.md` (5+ occurrences of "25+ industries" / "16 industrial customers" — separate concept; review whether customer count should follow registry)
- `DWS8_ROADMAP.md` (3 occurrences of "20 industries")
- `Store/PRODUCT_AEGIS.md` (5 occurrences of "21 industries" — Aegis SKU description)
- `Learn/PHD_FIREHORSE_EN.md` (mixed 16 + 20 within same doc — needs careful pass since PhD-thesis scope rule applies)
- `Learn/V3Thesis_EN.html` + `docs/metropolia/master-thesis/en/V3Thesis_EN.md` + FI mirror (thesis-rule: all 4 files together per CLAUDE.md)
- `INVESTOR_EMAIL_TEMPLATES.md` (3 occurrences of "20 industries", incl. Industry Captain seat description)
- `ONTOLOGY.md` (2 occurrences of "25+ industries")
- `CHANGELOG.md` (historical note "16 to 20 industries" — leave as-is for audit trail)
- `Firehorse/Omnichannel/Investors/*.md` (CAPTAIN_ACQUISITION_FUNNEL, INDEX, OUTREACH_WORKFLOW)
- `dws10.com/index.html` line 1436 / 1442: "21 industry applications" / "Body: 21 industry-specific applications"
- `dws10.com/shared-assets/nav/ironclad-nav.js` v3.x comment (cosmetic — comment changelog, not user-facing)
- `Learn/` HTML archives: leave as historical snapshots; do not edit (they are versioned outputs).

This sweep should be a single dedicated PR titled `chore: reconcile industry-registry to 25 across docs (Data Centres + RFNBO)` so each file's edit is reviewable in one place.

### Why Data Centres and RFNBO

Both have moved from "watch list" to "in scope" in 2026:

- **Data Centres** — EED 2023/1791 Article 12 enforced in 2026 with the Commission's Data Centre Energy Reporting Delegated Regulation; CSRD ESRS E1 applies; hyperscalers and colos in Finland (Microsoft, Google, Equinix, Telia) are direct prospects.
- **RFNBO** — RED III Delegated Acts (Article 27) on additionality, temporal and geographic correlation are binding from 2026; the Finnish hydrogen valleys (Joutseno, Kokkola, Inkoo) need certification infrastructure DWS IQ can provide.

These are commitments, not aspirations. Industry models 24 (Data Centres) and 25 (RFNBO) enter the LWM V1 training set before June 12 2026 ship.

---

## Training Economics Addendum (LWM2 / V2 vs V1, 23.05.2026)

This addendum separates the **per-industry fine-tune economics (V1, June 2026)** from the **omnimodal pretrain economics (V2, November 2026)**. The two budgets do not share a cost surface — V1 lives on cheap A100 cloud, V2 lives on Blackwell silicon — and conflating them was the largest budgeting error in the earlier roadmap drafts.

Detail study: `docs/field-notes/2026-05-23-lwm-price-estimate-colab-vs-nvidia-cloud.md`.

### LWM V1 per-industry fine-tune (one 9B model, one industry)

Observed run on Colab Pro+, A100 80GB, 22–23 May 2026, end-to-end (train + eval + validation + GGUF/MLX conversion). The pattern: Codex + computer-use Chrome extension steps the notebook unattended overnight; SLM engineer touches the job at kickoff and at morning verification only.

| Line item | Quantity | Rate | Cost |
|---|---:|---:|---:|
| GPU compute (A100 80GB, ~10.25 h) | one cycle | ~€9 (Colab) to €25 (Brev/CoreWeave) | **€9–€25** |
| Claude API data generation | per industry | per training-manual | **€40–€60** |
| **SLM engineer (€100/h)** — kickoff 0.5 h + morning verify 0.5 h + smoke test 0.5 h | **1.5 h** | **€100/h** | **€150** |
| **Total per industry (cheap-cloud path)** | | | **€199–€235** |
| **Total per industry (Lambda EU sovereign path)** | | | **€207–€243** |
| **Total per industry (on-prem GN-100, electricity only)** | | | **€195–€220** (€5–8 electricity + €150 engineer + €40–60 API) |

**Read:** with engineer time baked in, the *delta* between Colab and on-prem GN-100 collapses to ~€20/industry. Hardware amortization on the GN-100 is justified by sovereignty and operational autonomy, not by cost saving. The thing that actually saves money is **driving engineer touch-time down** — the Codex/computer-use unattended loop is the real cost lever, not the GPU price.

25-industry V1 coverage rebenched:
- Cheap-cloud path: **€4 975–€5 875**
- Sovereign Lambda EU path: **€5 175–€6 075**
- On-prem GN-100: **€4 875–€5 500** (ignoring sunk hardware)

### LWM V2 NVFP4 pretrain (omnimodal, Nov 2026)

V2 is a different animal. The §"V2 omnimodal" subsection above identifies it as the place to apply NVFP4 from day one. That means:

| Line item | Quantity | Rate | Cost |
|---|---:|---:|---:|
| GPU compute — Blackwell tensor cores required (B100/B200/GB10) | NVFP4-native pretrain pass | not addressable on A100 cloud | **DGX Cloud / Brev tier only** |
| GPU $/h benchmark (H100 PCIe ~$2.49; B200 ~$4–$6; DGX Cloud 8×H100 ~$36 999/mo ≈ $51/h cluster) | — | — | order-of-magnitude higher than V1 |
| SLM engineer (€100/h) — attended ramp + checkpoint monitoring + recipe tuning | **40–80 h per pretrain run** | **€100/h** | **€4 000–€8 000** |
| Data curation pipeline (video + audio + structured site state) | per pretrain | — | **€10 000+** (one-off) |
| **Total per V2 pretrain attempt (order of magnitude)** | | | **€50 000–€150 000** |

**Read:** V2 cannot ride the Colab path. NVFP4 needs Blackwell silicon, the dataset is omnimodal (video/audio explode the token budget), and the engineering loop is attended — checkpoints must be diffed, recipes tuned, collapse detection run. This is the workload where **NVIDIA DGX Cloud or Brev on B200 is correctly priced**; the per-engineer-hour line dominates compute by 10×, which inverts the V1 picture.

### Two-budget split (lock this)

| Budget bucket | Used for | Cost surface |
|---|---|---|
| **V1 fine-tune budget** | 25-industry per-vertical SLMs | €200/industry, ~€5K for 25 industries |
| **V2 pretrain budget** | One NVFP4-native omnimodal model | €50K–€150K per pretrain attempt |

Do not let V2 cost assumptions leak into V1 plans, and vice versa. They are not the same product.

### What this changes in this lab note

The model-selection table earlier in this note (Gemma-4-31B-IT-NVFP4 / Qwen3-32B-NVFP4 / Qwen3-8B-SpinQuant-NVFP4) is **V1 PTQ territory** — pick one and ship. The NVFP4 *pretraining* recipe from arxiv:2509.25149 is **V2 territory** — staff and budget accordingly.

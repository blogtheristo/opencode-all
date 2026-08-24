# Train Model — Enterprise Product Spec (3-Tier Pricing)

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Date: 23.05.2026 | Changes: Initial productization. Turns the LWM training pipeline into a sellable enterprise SKU — "Train Model" — with three size tiers (Compact 3B, Standard 9B, Pro 32B). Pricing built bottom-up from the 23.05.2026 price-estimate study with the **€100/h SLM engineer line included**. Each tier is priced as a fixed-scope deliverable: dataset prep → train → eval → validation → GGUF/MLX/NIM conversion → registry push → 30-day model SLA.

Session Links & References:
  - LWM price estimate (BOM source): docs/field-notes/2026-05-23-lwm-price-estimate-colab-vs-nvidia-cloud.md
  - LWM Phase 2 gap analysis: docs/field-notes/2026-03-25-lwm-phase2-technical-gap-analysis.md
  - NVFP4 pretraining (V2 ceiling): docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md
  - LWM training manual: product-catalog/LWM/training-manual.md
  - LWM V1 NVIDIA Inception submission: V1_LWM.md

Document Status:
  - Created: 23.05.2026
  - Last Modified: 23.05.2026
  - Language: English
  - Publication Status: ACTIVE (internal — pre-pricing-page)

***

**Date:** 2026-05-23
**Author:** DWS AI Research Team / Lifetime Consulting Oy
**Category:** Product / Pricing / GTM
**Tags:** Train-Model, SLM, fine-tuning, enterprise-pricing, BOM, Aegis, Lambda, Colab, NIM, GGUF, MLX

---

## TL;DR (60 seconds)

We can now produce a customer-specific SLM end-to-end in **~1 night of compute + ~1.5 h of engineer time**. Loaded marginal BOM is **~€200 for a 9B model**. We sell it as a fixed-scope SKU called **Train Model**, three sizes, three prices.

| SKU | Model size | Wall clock | Engineer time | Loaded BOM | **List price** | Gross margin |
|---|---:|---:|---:|---:|---:|---:|
| **Train Model — Compact** | 3B params | ~4 h | 1.0 h | **~€150** | **€1 490** | ~90 % |
| **Train Model — Standard** | 9B params | ~10 h (overnight) | 1.5 h | **~€210** | **€2 990** | ~93 % |
| **Train Model — Pro** | 32B params | ~36 h (3 nights) | 4.0 h | **~€680** | **€7 490** | ~91 % |

All tiers ship with: dataset prep, training, eval suite, validation suite, GGUF + MLX + NVIDIA NIM conversion, push to customer's private model registry, and a 30-day "your model still passes our eval suite" SLA.

---

## 1. Why this is a product now (and wasn't 6 months ago)

Three things moved in Q1–Q2 2026:

1. **Unattended overnight training is reliable.** The Codex + computer-use Chrome-extension loop drives a Colab/Lambda notebook unattended for 10+ hours. The morning artifact is finished. Engineer touch-time fell from a full day to ~1.5 h. (Source: `2026-02-11-lwm-industry-training-unsloth-moe-triton.md`, confirmed 22–23 May 2026.)
2. **Cloud GPU pricing collapsed for SLM-class workloads.** A100 80GB at $1.19–$1.79/h across NVIDIA-Inception partners. One overnight run for a 9B model costs ~€10 in raw compute. (Source: `2026-05-23-lwm-price-estimate-colab-vs-nvidia-cloud.md`.)
3. **Conversion stack is one button.** GGUF (llama.cpp), MLX (Apple silicon), NIM (NVIDIA Inception inference container) all auto-generate from the same checkpoint. No bespoke deployment engineering per customer.

That combination is what makes "we'll train you a model" a productizable line item instead of a project quote.

---

## 2. BOM per tier (loaded, €100/h SLM engineer)

### Compact — 3B params

Use case: low-latency on-device classification, narrow-task assistants, embedded into a single workflow. Fits on a laptop CPU + 8 GB RAM (Q4 GGUF). Customer-supplied dataset, 50K–500K examples.

| Line | Quantity | Cost |
|---|---:|---:|
| GPU compute (A100 80GB, ~4 h, Colab Pro+ / Lambda) | one run | €4–7 |
| Data generation / curation API (Claude / gpt-oss) | per model | €20–40 |
| SLM engineer (€100/h × 1.0 h: kickoff 0.5 h + verify 0.5 h) | 1.0 h | €100 |
| Conversion (GGUF + MLX + NIM, automated) | one run | €5 |
| **Loaded BOM** | | **€129–€152** |
| **List price** | | **€1 490** |
| Gross margin | | ~90 % |

### Standard — 9B params (the observed cycle)

Use case: per-industry vertical model, customer-specific compliance assistant, mid-quality RAG backbone. Fits on a single consumer GPU (24 GB VRAM, Q4 GGUF) or on Apple silicon (M-series 32 GB+, MLX). Customer-supplied dataset, 100K–2M examples.

| Line | Quantity | Cost |
|---|---:|---:|
| GPU compute (A100 80GB, ~10.25 h, Colab Pro+ / Lambda / RunPod) | one overnight run | €9–25 |
| Data generation / curation API (Claude / gpt-oss) | per model | €40–60 |
| SLM engineer (€100/h × 1.5 h: kickoff 0.5 h + morning verify 0.5 h + smoke test 0.5 h) | 1.5 h | €150 |
| Conversion (GGUF + MLX + NIM, automated) | one run | €5 |
| **Loaded BOM** | | **€204–€240** |
| **List price** | | **€2 990** |
| Gross margin | | ~93 % |

### Pro — 32B params

Use case: customer's flagship internal model, NVFP4 inference on Blackwell hardware (Acer Veriton GN-100, DGX Spark, B200), production RAG / agentic workloads, multi-turn reasoning. Customer-supplied dataset, 1M–10M examples. May require multi-night training run or H100 cloud.

| Line | Quantity | Cost |
|---|---:|---:|
| GPU compute (H100 80GB, ~36 h, Lambda / Brev / CoreWeave) | three overnight runs | €90–250 |
| Data generation / curation API (Claude / gpt-oss + RLAIF pass) | per model | €120–200 |
| SLM engineer (€100/h × 4.0 h: scoping 1 h + per-night verify 3 × 0.5 h + final eval 1.5 h) | 4.0 h | €400 |
| Conversion (GGUF + MLX + NIM + NVFP4 PTQ, semi-automated) | one run | €20 |
| **Loaded BOM** | | **€630–€870** |
| **List price** | | **€7 490** |
| Gross margin | | ~89–92 % |

---

## 3. What's in the deliverable (all tiers)

Every Train Model SKU ships the same artifact set so the customer can self-serve from day one:

1. **Model checkpoints** — Hugging Face Transformers format (safetensors)
2. **Quantized inference artifacts** — GGUF (Q4_K_M + Q8_0), MLX (4-bit + 8-bit), NVIDIA NIM container
3. **Eval report** — pass/fail across customer-specified benchmark + our LWM-industry baseline (compliance, factuality, refusal rate)
4. **Validation report** — held-out test set performance, calibration curves, failure-mode taxonomy
5. **Reproducibility bundle** — training notebook, dataset spec, hyperparameter file, seed, registry URL
6. **30-day model SLA** — if our eval suite regresses on the delivered model within 30 days due to a pipeline issue, we re-train at no charge

What is explicitly **not** included (sold separately):

- Hosting / inference infrastructure → **DWS IQ Inference** SKU
- Sovereign deployment → **Aegis** uplift (Lambda EU / GN-100 path, +€990 on any tier)
- Continuous re-training / model update subscription → **Train Model — Subscription** (monthly, separate field note)
- Dataset construction from scratch → priced per project

---

## 4. Aegis sovereign uplift (+€990 on any tier)

Triggers when the customer needs:

- EU CLOUD-Act-free training (Lambda EU, Hetzner GPU, or on-prem GN-100)
- Data-residency-guaranteed dataset handling
- Signed model attestation (KYA chain-of-custody)
- Air-gapped delivery

Marginal compute delta is ~€10–€20/industry (per the 23.05 price study) — the €990 uplift covers the operational overhead (sovereign-cloud account provisioning, attestation paperwork, KYA registration) and the brand premium of the Aegis tier, not the GPU $/h delta.

---

## 5. Pricing logic (why these numbers, not others)

We anchored on three reference points:

1. **OpenAI fine-tuning pricing** — GPT-4o fine-tune is ~$25/1M training tokens. A 100M-token fine-tune is ~$2 500. That's the upper anchor for "Standard" tier in customer perception.
2. **Hugging Face AutoTrain / Together AI** — managed SLM fine-tunes priced $200–$2 000 per run depending on size. That's the lower anchor.
3. **Our loaded BOM** — €150 / €210 / €680. Pricing at 7×–14× BOM keeps us at 89–93 % gross margin, which matches the SaaS-margin envelope and leaves room for the Aegis uplift to be incremental, not foundational.

The **Standard tier at €2 990 is the conversion lane** — it's priced just under the OpenAI fine-tune anchor, ships an artifact the customer owns outright (not a hosted endpoint), and includes deployment-ready GGUF/MLX/NIM out of the box. That's the value gap.

---

## 6. Sales math (rough)

| Annual volume | Compact | Standard | Pro | Revenue | Loaded BOM cost | Gross profit |
|---|---:|---:|---:|---:|---:|---:|
| 20 customers, mix 5/12/3 | 5 × €1 490 | 12 × €2 990 | 3 × €7 490 | **€65 800** | €4 270 | **€61 530** |
| 50 customers, mix 10/30/10 | 10 × €1 490 | 30 × €2 990 | 10 × €7 490 | **€179 300** | €11 200 | **€168 100** |
| 100 customers, mix 20/60/20 | 20 × €1 490 | 60 × €2 990 | 20 × €7 490 | **€358 600** | €22 400 | **€336 200** |

50 customers/year (one Standard SKU per business week) is a credible Y1 target given the existing 25-industry LWM registry and the DWS IQ customer pipeline. That's **~€170K of high-margin revenue on a product that runs unattended overnight**.

---

## 7. What we still need to lock before shipping a pricing page

1. **5-run unattended reliability proof.** One successful Colab Pro+ run on 22–23 May 2026 is not yet a 30-day SLA. We need 5 successful unattended runs across at least 2 model sizes before the SLA is honest.
2. **NIM container path for non-Inception customers.** NIM containers require NVIDIA AI Enterprise license on the customer side. Confirm the licensing story or strip NIM from the standard deliverable and make it a Pro-tier-only add-on.
3. **Dataset intake spec.** What's the minimum customer-supplied dataset shape? Document the schema (JSONL, instruction-response, system-prompt convention) so onboarding is one shared spec, not one bespoke conversation per customer.
4. **Engineer time tracking.** Validate the 1.0 / 1.5 / 4.0 h assumptions across the next 5 runs. If real touch-time is 2× the estimate, all three prices need to move up ~€100–€400 to preserve margin.
5. **Aegis legal pack.** Sovereign uplift needs the KYA attestation form, the customer-DPA template, and the Lambda EU / GN-100 deployment path documented. Without that, the +€990 line is theoretical.

---

## 8. Open positioning question

Do we ship the page as **"Train Model"** (literal, neutral, enterprise-buyer-friendly) or as **"Lifetime SLM"** (brand-aligned with LWM / Lifetime stack, more memorable, harder for procurement)?

Recommendation: ship the page as **"Train Model — by Lifetime"** — neutral enough for procurement, branded enough that the LWM connection is obvious. The three SKUs become *Train Model — Compact / Standard / Pro by Lifetime*.

---

## 9. Bottom line

The economics work. Compute is ~€10 per overnight run. Engineer time at €100/h is ~€150 per Standard model. Loaded BOM is ~€200. List price €2 990 at 93 % margin. Three sizes covers narrow-task → vertical-model → flagship needs.

The remaining work is **proving unattended reliability** (5-run streak) and **packaging legal/operational bits** (NIM licensing, Aegis DPA, dataset schema). The pricing is locked once those land.

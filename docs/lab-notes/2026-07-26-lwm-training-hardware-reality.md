<!--
VERSION AND AGENT HISTORY
Document: LWM Training — Verified Hardware Reality
Version: 1.0
Date: 2026-07-26
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/ollama-orchestration-merge-047pj7
Purpose: Lab note fixing the boundary between what the Acer Veriton GN-100 can and
         cannot do for Lifetime World Model (LWM) training, after a July 2026
         verification. Companion to V3Thesis Appendix E (v3.88 amendment).
-->

# Lab Note — LWM Training: Verified Hardware Reality

## 1. The finding

**The Acer Veriton GN-100 (GB10 Grace Blackwell, 128 GB unified, ARM64) is an edge inference / development node — not a training cluster.** It can QLoRA-fine-tune small models (~7–13B) and serve inference. It **cannot** pretrain the full ~55B Lifetime World Model.

Why (memory): a model in training needs optimiser states + gradients + activations at roughly **8–16× its inference footprint** — hundreds of GB to TB, plus multi-GPU interconnect (NVLink/InfiniBand). A 55B pretrain is a data-centre workload; 128 GB unified is an edge-inference budget.

## 2. What the repository verification established (PR #1720, 24.07.2026)

- **No training-pipeline code** in the repo.
- **No such on-prem training node.** The separately-described box (x86, 2× RTX 4090) does not exist; the only documented Acer device is the **Veriton GN-100 (ARM64 / GB10 edge inference & development)**.
- **No go-live record.** The Enterprise Model Training path that presented on-prem training as delivered was retagged **"Pending Hardware, not yet verified live."**
- **Cloud (GCP A3 Mega) is the available full-training route.**

The existing V3Thesis Appendix E QLoRA per-industry pipeline (small models, ~16 h on the GN-100, ~€80–125/model) is feasible and remains the delivered path — it is *fine-tuning*, not 55B pretraining. The correction is only to the broader "on-prem trains the LWM" claim.

## 3. The realistic pipeline

```
Cloud pretrain / fine-tune (GCP A3 Mega, or rented H100/H200)
   → NVFP4 quantisation, co-designed for Blackwell (tile alignment, width>depth)
   → deploy to GN-100 for EDGE INFERENCE (Ollama / vLLM)
```
Training and inference are distinct workloads on distinct hardware. Do not conflate the Ollama-boss edge-inference stack (qwen2.5:72b/7b) with LWM training.

## 4. Strategic framing (token capital)

The defensible asset is not a from-scratch 55B — it is the **learning loop**: private evals, an RL environment, and adaptation on owned operational (fleet) data. Full 55B pretraining is cloud CAPEX that does not by itself produce a moat; the owned loop does (`/token-capital`). Realistic "LWM training" for DWS = adaptation + the eval/RL loop on proprietary data, not a from-scratch pretrain.

## 5. Applied to the thesis

Recorded as implementation evidence in **V3Thesis Appendix E** (v3.88 amendment, EN + FI); PHD_FIREHORSE EN/FI take a lockstep-only version entry (this is hardware/implementation, not market-signal, per the §1.4 scope rule). `Learn/` HTML regeneration PENDING (Pandoc build).

---

_Follows DWS Document Standard._

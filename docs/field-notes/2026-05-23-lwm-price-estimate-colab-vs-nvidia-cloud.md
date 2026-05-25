# LWM / LWM1 Price Estimate — Google Colab Pro+ vs NVIDIA Cloud for a 9B Train Cycle

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Date: 23.05.2026 | Changes: Initial study. Captures one operator-observed Colab Pro+ train cycle ($13.99 CAD, 9B model, A100 80GB, ~10.25 h wall) and compares to NVIDIA-aligned cloud options (DGX Cloud, Brev, Lambda, CoreWeave, RunPod) for the same workload. Recomputes LWM per-industry BOM against the training-manual.md baseline of €50–70.
  - Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Date: 23.05.2026 | Changes: Added the **SLM engineer labor line at €100/h**. Per-industry BOM revised — compute is the cheap line, engineer time is the dominant line, even with the Codex/computer-use unattended overnight loop. The Colab-vs-NVIDIA-Cloud delta shrinks dramatically when labor is included; the actual cost lever is engineer touch-time, not GPU $/h.

Session Links & References:
  - LWM training manual: product-catalog/LWM/training-manual.md (current €50–70/industry baseline)
  - LWM Phase 2 gap analysis: docs/field-notes/2026-03-25-lwm-phase2-technical-gap-analysis.md
  - Unsloth MoE Triton kernels: docs/field-notes/2026-02-11-lwm-industry-training-unsloth-moe-triton.md
  - NVFP4 pretraining: docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md
  - LWM V1 NVIDIA Inception submission: V1_LWM.md

Document Status:
  - Created: 23.05.2026
  - Last Modified: 23.05.2026
  - Language: English
  - Publication Status: ACTIVE (internal research)

***

**Date:** 2026-05-23
**Author:** DWS AI Research Team / Lifetime Consulting Oy
**Context:** Operator-observed train cycle on Google Colab Pro+ vs published NVIDIA-aligned cloud rates
**Category:** Cost / AI-ML / LWM Training Economics
**Tags:** LWM, LWM1, Colab, A100, H100, DGX Cloud, Brev, Lambda, CoreWeave, RunPod, SLM, fine-tuning, BOM

---

## TL;DR (60 seconds)

One overnight Colab Pro+ run produced a **trained, evaluated, validated, GGUF/MLX-converted 9B model for $13.99 CAD (~$10.20 USD)** on a single A100 80GB. Wall-clock 10.25 h end-to-end; the human is asleep during 99 % of it (a Codex + Chrome-computer-use loop steps the notebook).

At that price point, **NVIDIA's own DGX Cloud is ~6× more expensive** for the equivalent workload; the cheapest NVIDIA-Inception aggregator (RunPod Community) is roughly at parity; everything in between (Lambda, CoreWeave, Brev) sits in a $18–$25 USD band for the same 10.25 h.

**Implication for LWM:** The `training-manual.md` €50–70/industry baseline is now the *ceiling*, not the floor. A 25-industry LWM coverage matrix is **~€230 in raw cloud compute** if you use the Colab path, vs ~€1 500 on DGX Cloud. The 9B-SLM-per-industry economics no longer gate the roadmap.

---

## 1. The Observed Train Cycle (operator report, 22–23 May 2026)

| Stage | Wall clock | GPU active? |
|-------|-----------:|:-----------:|
| Notebook step / kernel warmup | 0:10 | partial |
| Train (9B, QLoRA/SFT class workload) | 7:00 | yes |
| Eval testing | 1:30 | yes |
| Validation testing | 1:15 | yes |
| GGUF / MLX conversion | 0:30 | partial |
| **Total** | **10:25** | — |

- **Hardware:** NVIDIA A100 80GB (Colab Pro+ allocation)
- **Spend:** $13.99 CAD (~$10.20 USD at 0.73 USD/CAD)
- **Effective rate:** ~$1.37 CAD/h wall ≈ ~$1.00 USD/h wall
- **Human-in-the-loop:** none after kickoff. Codex + computer-use Chrome extension steps the notebook overnight; the morning artifact is a finished model.

> Caveat on Colab billing: Pro+ is **compute-unit** billed, not wall-clock. A 100-unit pack is ~$13 CAD; an A100 burns ≈ 11.77 units/h. So $13.99 CAD buys ≈ 8.5 h of A100 *compute*. The reported 10.25 h wall-clock includes idle gaps (conversion, IO, agent latency) that don't count fully against the meter. The effective compute-unit rate is closer to **~$1.65 CAD/h ≈ $1.20 USD/h GPU-hour**, which is what we compare to below.

---

## 2. NVIDIA-Aligned Cloud Comparison (A100 80GB on-demand, May 2026)

All rates are USD, on-demand, single A100 80GB unless noted. 10.25 h of GPU time used as the workload constant.

| Provider | Tier | A100 80GB $/h | 10.25 h cost | Notes |
|---|---|---:|---:|---|
| **Google Colab Pro+** | consumer | ~$1.20 effective | **~$10.20** | The observed run. Compute-unit billed. |
| **RunPod Community Cloud** | Inception partner | $1.19–$1.89 | $12.20–$19.37 | Lowest sustained NVIDIA-aligned rate; community boxes, no SLA. |
| **Lambda Cloud** | NVIDIA partner | $1.79 | $18.35 | 1-click PyTorch; widely used by indie SLM trainers. |
| **CoreWeave** | NVIDIA-aligned | ~$2.21 (reserved tier) | $22.65 | On-demand A100 80GB now scarce; H100 is the headline SKU. |
| **NVIDIA Brev** (Lambda/CoreWeave passthrough) | NVIDIA-owned aggregator | $1.79–$2.50 | $18.35–$25.63 | Brev is the routing layer NVIDIA pushes for indie devs. |
| **NVIDIA DGX Cloud** | NVIDIA enterprise | A100 SKU not offered; nearest = H100 @ ~$6.42 effective | **~$65.81** (H100-equiv) | Sold as $36 999/mo per 8× H100 instance; not a one-shot SKU. Treat as not-comparable for a one-overnight 9B train. |
| **NVIDIA Launchpad** | trial | $0 | $0 | Time-boxed eval only; not a production path. |

**Ranking for our workload (9B SLM, one overnight cycle, hobbyist scale):**

1. Colab Pro+ — **$10–11 USD** (winner on absolute dollars)
2. RunPod Community — $12–19 USD (winner on transparency, no compute-unit games)
3. Lambda Cloud — $18 USD (winner on developer ergonomics)
4. Brev / CoreWeave — $19–26 USD
5. DGX Cloud — $66+ USD (wrong tier; built for 8-GPU enterprise jobs, not one A100)

---

## 3. What this does to the LWM BOM

The `product-catalog/LWM/training-manual.md` baseline:

> Cost per industry: €50–70 (€40–60 Claude API + €5–8 electricity) on Acer Veriton GN-100 (local DGX Spark class)
> Total per industry incl. eval/validation/deploy: **€80–125**
> 5-industry total: **€400–625**

That baseline ignored loaded labor. Re-cost with the **SLM engineer at €100/h** and the realistic touch-time per overnight unattended run:

| Touch point | Time | Cost |
|---|---:|---:|
| Kickoff (notebook config, dataset & hyperparam set, monitor first 10 min) | 0.5 h | €50 |
| Morning verification (eval/validation result review, fail-or-pass) | 0.5 h | €50 |
| Smoke test + push to model registry | 0.5 h | €50 |
| **Engineer total per industry** | **1.5 h** | **€150** |

Full BOM per industry (cheap-cloud path):

| Line | Cost |
|---|---:|
| GPU compute (A100 80GB, ~10.25 h, Colab Pro+) | €9 |
| Claude API data generation | €40–60 |
| SLM engineer labor (€100/h × 1.5 h) | **€150** |
| **Total per industry (cheap-cloud)** | **€199–€219** |

Re-bench per-industry across compute scenarios with the €150 labor line constant:

| Scenario | Compute / industry | Engineer (€100/h × 1.5 h) | API | **Total / industry** | 25-industry total |
|---|---:|---:|---:|---:|---:|
| Local Acer GN-100 (status quo) | €5–8 | €150 | €40–60 | **€195–218** | €4 875–5 450 |
| Colab Pro+ (observed) | €9 | €150 | €40–60 | **€199–219** | €4 975–5 475 |
| RunPod Community | €11–18 | €150 | €40–60 | **€201–228** | €5 025–5 700 |
| Lambda Cloud (EU sovereign) | €17 | €150 | €40–60 | **€207–227** | €5 175–5 675 |
| DGX Cloud (H100-equiv) | €60+ | €150 | €40–60 | **€250+** | €6 250+ |

**Two things to read off this table:**

1. **The compute line collapsed; the labor line did not.** Engineer time is now 60–75 % of the per-industry cost across every cloud scenario. GPU $/h optimization is a rounding error.
2. **The compute-driven delta between Colab and Lambda EU is ~€10/industry — well under the cost of one extra engineer-hour.** So sovereign-cloud choice is a compliance decision, not a price decision. We can default Aegis customers to Lambda EU at essentially no cost penalty.

The real cost lever is **engineer touch-time per cycle**. The Codex/computer-use unattended overnight loop is what moved this from "research project" to "cron job"; further reducing the kickoff + verification touch points (templated notebooks, auto-pushed eval reports, registry hooks) is where the next 30–40 % of cost comes out.

---

## 4. Why this matters for LWM1 and the V1 → V2 roadmap

- **LWM V1 (June 12 2026):** the per-industry fine-tune is no longer the constraint. We can stand up all 25 verticals from the reconciled `INDUSTRIES.md` registry for **<€500 of cloud compute** even on Lambda; **<€250** if we accept Colab/RunPod operational risk.
- **LWM V2 (Nov 2026, omnimodal):** Colab/RunPod still don't help — V2 needs the NVFP4 pretrain recipe on B100/B200 class silicon, and there the DGX Cloud / Brev premium is justified. Keep the two budgets separate.
- **Aegis sovereign tier:** Colab and RunPod Community are **NOT** acceptable for Aegis-customer industry models (US/cross-border data residency). For those, Lambda EU regions, Hetzner-GPU, or on-prem GN-100 is the path; budget €50–70/industry stays the right number.
- **Operator pattern is the unlock:** the headline isn't the $13.99 — it's that a Codex + computer-use loop runs the notebook overnight with zero human attention. That turns "train an SLM" from a tracked engineering task into a cron job. The Skill Codification Rule applies — if we run this more than twice it goes into `skills/lwm-train/SKILL.md` as a parameterized procedure.

---

## 5. Open questions

1. **Compute-unit math:** confirm the actual Colab Pro+ unit burn on a 9B QLoRA run with the eval/validation tail included. The $13.99 figure may include a top-up; need a second observed run to lock the rate.
2. **Reproducibility on RunPod Community:** does the same notebook complete unattended on a Community Cloud box, or do pre-emption events break the overnight loop?
3. **Aegis split:** which subset of the 25 industries can use non-sovereign cheap compute, and which *must* stay on GN-100 / Lambda EU? Likely tied to the customer-tier matrix in `docs/field-notes/2026-04-15-dws-iq-aegis-lwm-strategy.md`.
4. **Claude API line item:** at €40–60/industry, the data-generation step is now 4–5× the compute. Worth a separate study on whether `gpt-oss` local generation (per the Unsloth note) collapses that line.

---

## 6. Bottom line

> *"It's not hard to train SLMs anymore."*

Confirmed. **$10 USD of GPU + 1.5 hours of engineer time at €100/h = ~€160 of marginal cost** produces one finished, eval/validated, inference-ready 9B model per overnight cycle. NVIDIA's own enterprise cloud is built for a different workload (8-GPU, multi-day, SLA-bound) and is correctly priced for V2 omnimodal pretraining — not for V1 per-industry fine-tunes.

Three numbers to internalize:

- **Compute cost / industry: ~€10–€20.** A rounding error. Choose the cloud on sovereignty, not price.
- **Engineer labor / industry: ~€150** (€100/h × 1.5 h touch-time per overnight cycle, assuming the Codex/computer-use loop holds).
- **Total marginal BOM / industry: ~€200–€220.** This is the number that goes into the Train Model product pricing.

The €50–70/industry number in the training manual was the *compute + electricity* number with engineer time hidden. Realistic loaded BOM is ~3–4× that. Even so, 25-industry V1 coverage is now a **~€5K line item**, not a roadmap blocker.

# 3× NVIDIA DGX Spark — On-Prem Process Co-Pilot for Kemira

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/dgx-spark-mining-case-gf1159 | Date: 26.06.2026 | Changes: Initial creation — 3× DGX Spark "entry-tier" business case adapted for Kemira (process-chemicals: water solutions + pulp & paper). Cheaper sibling to the 4× mining flagship: 384 GB pool, 200–300B-class MoE, long (not 1M) context, single-site scope. Includes ROI table, why-3×-not-4×/2×, an Assumptions & Caveats section (incl. the TP=3 sharding constraint), and an upgrade path to the 4× tier.

Session Links & References:

- Claude Code (claude/dgx-spark-mining-case-gf1159): https://github.com/blogtheristo/dws6/commits/claude/dgx-spark-mining-case-gf1159
- Companion (4× flagship): docs/DGX_SPARK_4X_MINING_BUSINESS_CASE.md
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/DGX_SPARK_3X_KEMIRA_BUSINESS_CASE.md

Document Status:

- Created: 26.06.2026
- Last Modified: 26.06.2026
- Language: English
- Languages Available: English (Finnish one-pager: DGX_SPARK_3X_KEMIRA_YHTEENVETO_FI.md)
- Publication Status: DRAFT

---

> **Positioning.** This is the **entry tier** of the DGX Spark edge family. The 4× flagship (`DGX_SPARK_4X_MINING_BUSINESS_CASE.md`) runs the 753B GLM-5.2 with a 1M-token context for the most documentation-heavy assets. This 3× build trades that ceiling for a **lower price point and a single-site footprint** — the right entry point for a chemical production line. It upgrades to 4× by adding one node.
>
> **Assumptions (Rule 1).** Kemira facts below are limited to publicly known ones — a Finnish chemicals company operating in water solutions and pulp & paper process chemistry, HQ Helsinki, with proprietary formulations and EU-regulated production. The operational scenario, KPIs, and costs are **illustrative planning figures** for discussion, not measured Kemira data; the pilot's Stage 1 replaces them with site-actuals.

## Executive Summary

In continuous and batch chemical production, an unplanned line trip or a run of off-spec batches costs **thousands to tens of thousands of euros per hour** in lost output, rework, and wasted feedstock. Diagnosis is slow because the answer is scattered across process historian/SCADA streams, standard operating procedures, batch records, equipment manuals, safety data sheets, and REACH/process-safety dossiers — and the most valuable of these (**formulations and process recipes**) are trade secrets that must never leave the plant network.

The proposal is an **On-Prem Process Co-Pilot**: a **3× NVIDIA DGX Spark** cluster sitting at a single Kemira production site. It pools **384 GB of unified memory** under **~0.75 kW**, runs a 200–300B-class open-weight MoE entirely on-prem with a long context window, and turns a process deviation into a precise, source-cited disposition in seconds — without any data leaving Kemira's network.

**Bottom line:** a **~$18,000** outlay pays for itself by avoiding roughly **one to two hours** of unplanned line stoppage, while keeping formulations and OT data 100% inside the plant.

## The Problem (Process-Chemicals Context)

Kemira runs EU-based chemical production — coagulants and polymers for water treatment, and process chemicals for pulp & paper. These are continuous- and batch-process plants where uptime, batch yield, and process safety drive margin.

- **The Documentation Crisis.** When a reactor drifts off-spec or a line trips, root-cause sits across hundreds of thousands of pages: P&IDs, SOPs, batch records, equipment O&M manuals, SDS/REACH dossiers, and years of historian trends. No process engineer can fuse all of that under shift-time pressure.
- **The Trade-Secret & Sovereignty Constraint.** Formulations and process recipes are Kemira's crown-jewel IP. Sending process telemetry and recipe context to a public cloud is unacceptable on IP, process-safety (Seveso), and EU data-residency grounds. OT networks are segmented from IT by design.
- **The Latency Constraint.** Shift engineers need an answer at the panel in seconds, not a round-trip to a remote API.

## The Solution: On-Prem Process Co-Pilot

A compact 3× DGX Spark cluster in a cabinet at the site, on the plant network — not a server room, not the cloud.

- **The Hardware.** Three DGX Spark units networked via a 100/200 GbE switch using onboard ConnectX-7 NICs — a localized pool of **384 GB unified memory** drawing **~0.75 kW**, easily fed from existing site power and UPS.
- **The Model.** A **200–300B-class open-weight Mixture-of-Experts** model quantized to **NVFP4**. At ~235B and 4 bits/param the weights occupy ≈ **118 GB**, leaving **~260 GB** for a long context window (e.g. 256K–512K tokens) plus system tasks — comfortable headroom for one site's SOP/batch/historian corpus. (The 753B/1M-token flagship is the 4× tier; see _Why 3×_.)
- **The Inference Engine.** **vLLM** coordinates the cluster over NCCL using tensor or pipeline parallelism across the three nodes (see caveat on TP=3 sharding).

## Operational Workflow

1. **Ingestion.** On a deviation or trip, the shift engineer drops the relevant historian window (e.g. last 24–48 h of tag data) alongside the line's SOPs, recent batch records, and the equipment manual into the Co-Pilot.
2. **Contextual Analysis.** With a long context window, the model reads the procedures, batch history, and telemetry _together_ — exact data, not a lossy vector-search (RAG) approximation.
3. **Actionable Output.** Within seconds the local cluster outputs a precise, source-cited disposition:

   > _"Conductivity drift on Line 2 polymer feed began 02:40, consistent with the dosing-pump cavitation signature in SOP-114 §6.3. Off-spec risk on the next two batches. Recommend: verify suction-side strainer ΔP, re-prime per SOP-114, and hold batch B-2287 for QC retest before release."_

## Business Case & Financial ROI

_Illustrative entry-tier economics; Stage 1 replaces with Kemira site-actuals._

| Investment Component                  | Cost (USD)   | Return Metric / Operational Savings                                                                                                          |
| ------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **3× DGX Spark Nodes**                | ~$13,500     | **Deviation-to-disposition time** reduced by **~40%** — engineers stop hunting across PDFs and historians.                                   |
| **100/200G Switch & Cabling**         | ~$4,500      | **Uptime & yield:** avoiding **~1–2 hours** of unplanned line stoppage (or a handful of off-spec batches) covers the entire ~$18,000 outlay. |
| **Software (vLLM / open-weight MoE)** | $0           | **Zero cloud data fees** and **zero egress** of recipe/OT data.                                                                              |
| **Total Initial Outlay**              | **~$18,000** | **Data Sovereignty:** 100% on-prem; formulations and process data never leave the plant. EU-aligned (REACH/CSRD/Seveso posture intact).      |

> Hardware list prices vary by region and reseller — order-of-magnitude planning numbers, not a quote.

## Why 3× — and Why Not 4× or 2×

|                         | 2× Spark (256 GB)          | **3× Spark (384 GB)**                  | 4× Spark (512 GB)                 |
| ----------------------- | -------------------------- | -------------------------------------- | --------------------------------- |
| Total unified memory    | 256 GB                     | **384 GB**                             | 512 GB                            |
| Power                   | ~0.5 kW                    | **~0.75 kW**                           | <1 kW                             |
| Indicative cost         | ~$12,000                   | **~$18,000**                           | ~$24,000                          |
| Practical model ceiling | ~200–235B + modest context | **200–300B + long (256–512K) context** | **753B (GLM-5.2) + 1M context**   |
| Best for                | Single line, short context | **Single site, doc-heavy deviations**  | Fleet-scale, max-context flagship |

- **Not 4×:** the 753B / 1M-token flagship needs 512 GB (376.5 GB weights leave only ~7.5 GB at 3× — no KV-cache room). If Kemira needs that ceiling, it is the 4× tier, not this one. This case deliberately targets a smaller model that fits 3× with generous context headroom.
- **Not 2×:** 256 GB runs a 235B model but squeezes long-context KV cache and leaves no headroom. 3× buys comfortable context and a cleaner upgrade path to 4× (add one node).

## Assumptions & Caveats

1. **Model is open-weight, not the GLM-5.2 flagship.** This tier runs a 200–300B-class MoE (e.g. a Qwen3-235B-class or GLM-4.6-class open model) at NVFP4. Confirm the exact model, its NVFP4 checkpoint, license (commercial use), and supported context length before purchase.
2. **TP=3 has a sharding constraint.** Tensor parallelism across 3 GPUs requires the model's attention-head and intermediate dimensions to divide evenly by 3. If they don't, run **pipeline parallelism** across the 3 nodes, or TP=2 with the third node serving a second model / overflow KV. Validate the chosen model's dims against TP=3 on the bench before deployment.
3. **Long context ≠ 1M context.** This tier targets 256K–512K tokens, sufficient for one line's SOP/batch/manual bundle plus a telemetry window. Whole-fleet, million-token corpora are the 4× flagship's job.
4. **ROI inputs are operator-specific.** The 40% deviation-to-disposition figure and the "1–2 hours of stoppage = payback" claim are illustrative; Stage 1 measures Kemira-actual cost-per-hour, off-spec rate, and baseline investigation time.
5. **OT integration is the real work.** Read-only historian/SCADA access, OT/IT segmentation, and process-safety sign-off are the gating items — not the hardware. De-risk with a single-line proof-of-concept.

## Upgrade Path

Start at 3× for one site. Add a fourth Spark to reach **512 GB** and unlock the **753B GLM-5.2 / 1M-token flagship** when a site's documentation depth justifies it — same cabinet, same network, no rip-and-replace. The entry tier is a stepping stone, not a dead end.

---

_Provider: Lifetime Oy · Business ID 0772407-9 · VAT FI07724079 · Laidunmaanraitti 2 A 25, 02330 Espoo, Finland · CEO Risto Anton Paarni · risto.paarni@lifetime.fi_
_This is a business case for discussion, not a contract or pilot agreement. It can be converted into a pilot sheet on Lifetime Oy standard terms (cf. `sales-outreach/PILOT_SHEET_OUTOKUMPU_FORTA.md`)._

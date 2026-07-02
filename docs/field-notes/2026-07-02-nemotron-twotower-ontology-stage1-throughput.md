# Field Note: NVIDIA Nemotron-TwoTower — Parallel-Token Throughput for Industry Ontology Auto-Generation (Stage 1)

---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Field Note / Technical Opportunity
- Author: Claude Code (claude-sonnet-5) + risto.paarni2024@lifetime.fi
- Date: 2026-07-02
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/tokenization-economy-ai-moat-zwfrr8

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Initial field note. Triggered by Risto sharing NVIDIA's Nemotron-Labs-TwoTower research release; mapped against the existing 3-stage ontology auto-generation pipeline (`docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md` §3).

Related Documents:

- `docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md` §3.1–3.4 (the pipeline this note proposes modifying — Stage 1 specifically)
- `docs/plans/2026-07-02-firehorse-ontology-upsell-chain.md` (the productized version of this pipeline's output — FH-ONT-\* SKUs)
- `docs/field-notes/2026-07-02-karp-tokenization-economy-ai-moat.md` §6, §9.1 (open-weight vs. distillation distinction; model-layer optionality argument)

---

## 1. The Study (verified)

> NVIDIA Research: "We took a 30B model and split it in two to write tokens in parallel instead of one at a time." Nemotron-Labs-TwoTower — a diffusion language model adapted from Nemotron-3-Nano-30B-A3B. One tower holds context (frozen, copied from the pretrained backbone); the other writes tokens (trained as a denoiser), both reusing the pretrained model instead of training from scratch. Reported: 98.7% of the original model's aggregate benchmark quality at 2.42× faster wall-clock generation.

> ✅ **Verified 02.07.2026.** Confirmed via arXiv 2606.26493 ("Nemotron-TwoTower: Diffusion Language Modeling with Pretrained Autoregressive Context"), MarkTechPost coverage, and NVIDIA's own HuggingFace release (`nvidia/Nemotron-TwoTower-30B-A3B-Base-BF16`, open weights under the NVIDIA Nemotron Open Model License). Architecture: both towers are 52-layer copies of the Nemotron-3-Nano-30B-A3B hybrid backbone (23 Mamba-2 + 6 self-attention + 23 MoE layers each); only the denoiser tower is trained, the AR context tower stays frozen. ~60B total parameters, ~3B active per tower per token. Released 01.07.2026 — same week as the Palantir-Nvidia Nemotron announcement in the Karp field note, but this is NVIDIA's own open-weight research release, not part of that commercial partnership.

## 2. Where this actually fits the ontology pipeline — Stage 1, not Stage 2

The 25-industry ontology auto-generation pipeline (`2026-06-22-lwm-ontology-v1-500-enterprises.md` §3) has three stages. TwoTower is a throughput upgrade for exactly one of them:

| Stage                                | Engine today                                                       | What it does                                                                                                                                                     | TwoTower fit?                                                                                                                                                                                                                                |
| ------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Local preprocessing**           | Qwen3-Coder 30B on DGX Spark, ~25 enterprises/hour, ~8hrs/industry | Semantic filtering, entity extraction, term-candidate generation from raw enterprise documents (kept local because documents may contain confidential/patent IP) | **Yes** — mechanical, high-volume, no world-knowledge requirement; the exact profile TwoTower's throughput gain targets                                                                                                                      |
| **2. Claude API ontology synthesis** | Claude API (Opus/Sonnet), ~€40-80/industry                         | JSON-LD/OWL ontology assembly, requiring EU regulation and industry-standard world knowledge the local model doesn't have                                        | **No** — this is the judgment/synthesis step (CLAUDE.md Rule 5: model only for judgment calls). Swapping it for a faster-but-unvalidated-on-this-task model to save time is the wrong trade; quality here is the whole point of using Claude |
| **3. Sovereign QLoRA fine-tuning**   | QLoRA on GB10, ~2-4hrs/industry                                    | Fine-tunes the customer-deployable artifact from the finished ontology                                                                                           | Not applicable — different workload (training, not generation)                                                                                                                                                                               |

**This is a Stage 1 throughput swap, not a dependency-reduction move.** Stage 1 already runs entirely local (that's _why_ it's local — confidential documents never leave DGX Spark) and never touched Claude/Anthropic in the first place. TwoTower doesn't reduce the pipeline's Anthropic dependency; it speeds up a stage that was already self-hosted.

## 3. Quantified impact, if it holds up in a pilot

Stage 1 today: ~25 enterprises/hour → ~8 hours DGX Spark time per industry (200 enterprises). At a naive 2.42× throughput multiplier, that becomes **~3.3 hours per industry** — roughly 4.7 hours saved × 25 industries = **~118 DGX Spark-hours** across the full 5,000-enterprise buildout. Against the plan's "1 customer/day × 500 days" cadence target, this is real headroom, not a rounding error — but it is a projection from the paper's aggregate benchmark numbers, not a measurement on this specific extraction task.

## 4. Caveats before wiring this into production

- **98.7% is aggregate benchmark quality**, not validated for this specific task (semantic filtering + entity/relationship extraction from enterprise documents). Diffusion LMs can behave differently than AR models on structured-extraction tasks specifically. Recommend a **one-industry pilot** — run Stage 1 with TwoTower and with Qwen3-Coder 30B on the same enterprise document set, diff the extracted term-candidate JSON, before touching the production pipeline spec.
- **VRAM/hardware fit on DGX Spark is unconfirmed.** Qwen3-Coder 30B fits in ~18GB. TwoTower ships ~60B total parameters (two 30B-class towers); even with ~3B active per tower per token, the memory footprint for holding both towers resident may differ meaningfully from a single dense 30B model. This needs a feasibility check on the actual GB10 hardware, not an assumption.
- **Open-weight, not a distillation risk.** Per §6 of the Karp field note, worth being precise: TwoTower is NVIDIA open-sourcing its own architecture research on its own base model — a different category from the DeepSeek/Moonshot/MiniMax/Qwen distillation-attack pattern discussed there (training on a competitor's API outputs). No conflict with that section; noted here only to avoid conflating the two when this gets referenced later.

## 5. Recommended next step

Pilot on one industry (smallest term-candidate volume, to keep the compute/time cost of the comparison low), measure: (a) wall-clock Stage 1 time, (b) term-candidate JSON diff against the Qwen3-Coder baseline, (c) downstream Stage 2 ontology quality when fed TwoTower's output vs. baseline output. If the pilot holds, update `2026-06-22-lwm-ontology-v1-500-enterprises.md` §3.1's engine spec — that edit is not made in this note.

---

**Status:** ✅ Processed — 🟡 Open (pilot required before production adoption)
**Confidence:** HIGH (technical facts verified via primary sources) / MEDIUM (applicability to this specific extraction task — unvalidated, hence the pilot recommendation)
**Impact:** Operational (Stage 1 throughput, deployment-cadence headroom) — not strategic/positioning, unlike today's other notes

<!--
VERSION AND AGENT HISTORY
Document: Hybrid attention + constant-throughput inference — why long-context local models change the agentic cost equation
Version: 1.1
Date: 2026-07-30
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/enterprise-ai-harness-0anl7s
Purpose: Capture the HIC's field observation that hybrid-attention models
         (Nemotron-Cascade-2-30B-A3B, 1M context, Mamba-2 + attention) and
         RDNA-native inference engines (hipfire) hold throughput at context depths
         where N^2 attention collapses. Records why this is the missing third piece
         of the day's harness thread: agentic work needs deep context, the harness
         is what consumes it, and constant-throughput local inference is what turns
         that consumption from unpredictable per-token exposure into a bounded,
         dimensioned cost base — NOT into zero cost (corrected 30.07.2026, §2).
         Also assesses — precisely — what it does and does not do for
         risk-register item R-01.
Related: docs/field-notes/2026-07-30-composio-harness-token-efficiency-benchmark.md,
         docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md,
         docs/field-notes/2026-07-26-ollama-boss-cost-architecture.md,
         docs/field-notes/2026-07-26-cosmos-3-edge-lwm-build-adopt-inflection.md,
         docs/field-notes/2026-03-26-best-local-models-by-ram-tier.md,
         docs/risk-register/DWS_PRODUCT_RISK_REGISTER.md (R-01, R-03),
         kb/wiki/concepts/adopt-the-base-own-the-loop.md,
         kb/wiki/concepts/harness-cost-is-a-pl-line-item.md

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Opus 5) | Session: claude/enterprise-ai-harness-0anl7s | Date: 30.07.2026 | Changes: Re-labelled this note's HIC decision point as **Q3** under the new branch-scoped numbering convention (DWS_LEARNING_STANDARD.md §10.1.1, added v1.4). All three field notes on this branch previously opened at "Q1", so three distinct decisions shared one label and could not be answered by reference. Label only — the question, its options, the recommendation and the reasoning are unchanged (Rule 12).
- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/enterprise-ai-harness-0anl7s | Date: 30.07.2026 | Changes: Initial field note. Captures the HIC's hipfire / 7900XTX field measurement and the hybrid-attention argument, verifies the model and engine specifications against primary sources (§5), and connects the throughput-at-depth property to the day's harness-cost thread. Assesses the R-01 relevance precisely: RDNA3 consumer is not the CDNA/Instinct testbed the register specifies, so this does not close R-01.
-->

# Field Note — Hybrid Attention and Constant Throughput: Why Long-Context Local Inference Changes the Agentic Cost Equation

**Document Type:** Field Note — Technology Signal + HIC Field Measurement
**Scope:** Why context depth, not parameter count, is the binding constraint on local models for agentic work; what hybrid-attention architectures and RDNA-native inference engines change about that; and what it means for the DWS local tier and for risk-register item R-01. Capture and assessment only — no hardware bought, no tier re-specified, no R-01 claim made.
**Ontology Tags:** Geography > Global, EU-27 | Sector > AI Infrastructure > Local Inference, Long-Context Architectures, Non-NVIDIA Accelerators | Entities > NVIDIA, Nemotron-Cascade 2, Qwen 3.6, hipfire, AMD RDNA3 / Radeon 7900 XTX, Ollama, DGX Spark GN-100, Lifetime Oy, DWS IQ | Temporal Context > 2026-Q3, post-hybrid-attention | Confidence > HIGH on model and engine specifications (verified §5); **HIC-REPORTED, not independently reproduced** on the 250K-depth throughput measurement

## 0. Attribution correction (fail loud, before anything else)

This note originates with the **HIC's own field observation**, not with a pre-existing DWS position. No prior DWS document, and nothing earlier in the originating session, expressed a view on `Nemotron-Cascade-2-30B-A3B` — the repository has **no mention of it** before this note. It should not be recorded, cited, or later recalled as a DWS assessment that predates 30.07.2026. The assistant in that session had expressed no view on the model either; the sense of shared prior appreciation was not grounded in anything on record.

What follows is therefore: the HIC's observation, plus verification of the underlying specifications, plus DWS-side reasoning built on top. Those three layers are kept distinct throughout.

## 1. The observation

Two claims from the HIC, both about the same underlying problem — **throughput collapse at context depth**:

1. **Hybrid attention is a prerequisite for usable long context.** A 1M-token window is not usable with quadratic (N²) attention: the cost of attending over the window grows faster than any practical throughput budget, so the nominal window and the working window diverge. Models advertising large contexts without a sub-quadratic mechanism cannot exploit them. `Nemotron-Cascade-2-30B-A3B` is the current example of the alternative — a Mamba-2 / attention hybrid where the state-space layers carry long-range context.
2. **Engine matters as much as architecture.** Most local stacks degrade toward single-digit tokens/second once real context accumulates — fine for *"the capital of France is"*, useless for agentic work. **hipfire** does not: the HIC measures **~40 tok/s on a Radeon 7900 XTX with Qwen 3.6-27B, holding roughly constant to ~250K context depth.**

The underlying complaint is the important part, and it is correct: **benchmarks are quoted at shallow depth, and agents work at deep depth.** A tok/s figure measured on a 2K prompt tells you nothing about the regime where agentic work actually happens.

## 2. Why this is the third piece of today's harness thread

Two signals were captured earlier today. This is the piece that makes them actionable rather than merely true.

| Signal | Finding |
| --- | --- |
| Nadella, 29.07.2026 | The **harness** is the durable layer; memory, context and traces live outside the model, which is swappable |
| Composio benchmark | The **harness** is also where the money goes — up to 30× token spread, same model, same tasks; Claude Code at a 340k-token median |
| **This note** | Those 340k tokens are **context depth**. Whether they are an unpredictable bill or a bounded, dimensioned cost depends on the architecture and engine underneath them |

The synthesis, stated plainly:

> Agentic harnesses are context-hungry by construction. On a metered API, harness overhead is an unpredictable bill. On a local model with hybrid attention and an engine that holds throughput at depth, the same overhead becomes **latency against a bounded, dimensioned cost base**.

_Corrected 30.07.2026 after external review: an earlier version of this line read "€0/token". That is false — electricity, hardware amortisation, serving, maintenance and throughput capacity all remain. The defensible claim is that **unpredictable per-token API exposure is replaced by bounded sovereign compute economics**, not that tokens are free._

This is the mechanism that makes the ollama-boss architecture's local tiers viable for *real* agentic work rather than only for shallow classification. The T0/T1 tiers there (`qwen2.5:7b` workers, `qwen2.5:72b` boss) were specified for **volume**, not for **depth** — and the note's own §4 finding was that the expensive part is *the orchestrator's own accumulating context*. A hybrid-attention model with constant throughput at depth attacks exactly that cost term. It is the local-tier answer to a problem that note identified and could not solve with the models it specified.

**Corollary for the T1 boss slot:** an orchestrator's job is precisely to hold a long, accumulating context. A 72B dense model with no external per-token bill that collapses to single digits at depth is a worse orchestrator than a 30B-A3B hybrid that holds 40 tok/s — and the hybrid also fits far more comfortably in the GN-100's unified memory. This is not a recommendation to re-spec the tier; it is the observation that the tier was chosen on the wrong axis.

## 3. What the specifications support (verified — see §5)

`Nemotron-Cascade-2-30B-A3B`:

- **30B total / ~3B activated** MoE, built on the Nemotron-3-Nano-30B-A3B base — a **hybrid mixing Mamba-2 state-space layers with standard attention layers**. The Mamba layers are what make the window economically usable, which is precisely the HIC's point.
- **1M-token context**.
- Reported to **fit 24 GB VRAM at Q4**, and to beat NVIDIA's own ~120B Nemotron-3-Super on coding and instruction-following; gold-medal claims on IMO/IOI 2025.
- Thinking and instruct modes.

`hipfire`:

- A **Rust + HIP inference engine for AMD consumer GPUs (RDNA1–RDNA4)** — a Rust orchestrator that dlopens `libamdhip64.so` directly, with in-tree HIP C++ kernels tuned per chip. Published at `hipfire.dev`.
- Publishes **~44 tok/s for Qwen 3.6-27B on the 7900 XTX** in plain autoregressive decode, and ~185 tok/s on code prompts via its "DFlash" speculative-decode path. The HIC's ~40 tok/s is consistent with the published autoregressive figure.

**The 24 GB fit is the strategically interesting number.** A 1M-context hybrid that runs on a single consumer-class card is not a datacentre proposition — it is a sovereign-edge one, and it sits squarely in the "adopt the base, own the loop" posture (`kb/wiki/concepts/adopt-the-base-own-the-loop.md`).

## 4. R-01 — what this does and does not do

`docs/risk-register/DWS_PRODUCT_RISK_REGISTER.md` **R-01** (compute-layer supply concentration on NVIDIA) is the register's **top open action**, status **NOT YET EXERCISED**, with the mitigation specified as: *one open model + one workload runnable on a non-NVIDIA accelerator at testbed scale — AMD **Instinct MI300** (ROCm + vLLM) or **Intel Gaudi 3** (SynapseAI).*

**Precision matters here, so state it as a boundary, not a headline:**

- ❌ **This does not close R-01.** hipfire is **RDNA-native — consumer graphics silicon**. The register names **CDNA / Instinct MI300**, a different architecture with a different software path. A working RDNA3 inference stack is not the specified testbed and must not be reported as one.
- ✅ **It is real evidence that the non-NVIDIA path is not theoretical.** R-01's own framing is that "a dependency is managed when the exit is demonstrated; it is lock-in when the exit is only asserted." A maintained AMD inference workload — even on consumer RDNA — moves the exit from *asserted* toward *demonstrated*, and it does so at roughly the cost of one GPU rather than one datacentre accelerator.
- ⚠️ **It suggests a cheaper first increment** than the register currently contemplates: exercise the port on RDNA3 first to find the real breakages, then decide whether MI300 is required. That is a proposal for the HIC, not a change to the register — the register is not edited by this note.

## 5. Verification note (fail loud)

| Claim | Status |
| --- | --- |
| `Nemotron-Cascade-2-30B-A3B` exists; 30B MoE / ~3B active; 1M context | **CONFIRMED** — NVIDIA model card + NVIDIA Nemotron research page (Cascade 2, 16.03.2026) |
| Hybrid architecture: Mamba-2 state-space + attention layers, from the Nemotron-3-Nano-30B-A3B base | **CONFIRMED** |
| Fits 24 GB at Q4; beats Nemotron-3-Super 120B on coding/instruction-following; IMO/IOI 2025 gold | **REPORTED** by NVIDIA and secondary coverage — vendor benchmark claims, not independently verified. Do not restate as measured fact |
| `hipfire` exists; Rust + HIP; RDNA1–RDNA4; `hipfire.dev` + public repo | **CONFIRMED** |
| ~44 tok/s Qwen 3.6-27B on 7900 XTX (autoregressive); ~185 tok/s with DFlash speculative decode on code prompts | **CONFIRMED as hipfire's published figures** — project's own numbers, context depth not stated |
| **~40 tok/s held roughly constant to ~250K context depth on a 7900 XTX** | **HIC FIELD MEASUREMENT — not independently reproduced.** No public benchmark corroborating constant throughput at that depth was found. Consistent with the published shallow figure and with what a hybrid/RDNA-tuned path should do, but it is one operator, one machine, one configuration. **This is the load-bearing claim of the note and it is the least verified** |
| "1M context is a must for agent work"; N² attention cannot exploit large windows | **HIC POSITION**, well-founded in the architecture and consistent with why hybrids exist. Stated as reasoning, not as a benchmarked result |
| DWS held a prior view on Nemotron-Cascade-2 | **FALSE** — no repository mention before this note. See §0 |
| This exercises R-01 | **NO** — RDNA3 consumer ≠ Instinct MI300 / Gaudi 3. See §4 |

**The one measurement worth reproducing:** the 250K-depth throughput curve. If it holds on a second machine, it is the strongest available argument for a sovereign local orchestrator tier. Until then it is a promising single data point, and this note does not spend it as more than that.

## 6. The five-step Learning Standard record

| # | Step | State |
| - | ---- | ----- |
| 1 | **Knowledge base** | ✅ `kb/raw/signals/2026-07-30-hybrid-attention-long-context-local-inference.md` |
| 2 | **Field note** | ✅ this file |
| 3 | **`Learn/` HTML** | ✅ `Learn/2026-07-30-hybrid-attention-long-context-local-inference.html` + `.docx` |
| 4 | **Drive export** | ✅ `2026 DWS6` folder — `docs.google.com/document/d/1o9rdxIBAtvwsmt43Eum66nchTKVK5b8ZPJ9bTjal0NQ` |
| 5 | **HIC question** | ✅ §7, session reply, and `.claude/handoffs/claude/enterprise-ai-harness-0anl7s.md` |

## 7. Next steps and the HIC question

**Routed, not executed:** no tier re-specification in `src/agents/model-selector.ts`; no edit to the ollama-boss note's T0/T1 table; no change to the risk register; no hardware decision; no thesis edit. `/truth-check` before any external use of the 24 GB or "beats 120B" figures — they are vendor claims.

### HIC question (EU AI Act Art. 14 intervention point)

**Q3. The local tier was specified on volume; this says the binding constraint is depth. Do we re-test it — and on which axis?**

**Options:**

1. **Reproduce the depth curve first.** Run one throughput-vs-context-depth measurement (shallow → 250K) for `Nemotron-Cascade-2-30B-A3B` on the **DGX Spark GN-100** — the box DWS actually owns — before any claim or purchase. Answers the T1-orchestrator question with DWS's own number instead of a vendor's or a single operator's.
2. **Treat it as the R-01 first increment.** Stand the workload up on **AMD RDNA3 + hipfire** as a cheap exit-demonstration, accepting that it is *not* the MI300/Gaudi 3 testbed the register specifies and cannot be reported as closing R-01.
3. **Note and hold.** Record the observation, change nothing until the local tier actually blocks on depth in production.

**(RECOMMEND: 1.** It is the cheapest, it uses hardware already owned, and it produces the one number that both other options depend on — a DWS-measured depth curve. Option 2 is attractive but answers a *sovereignty* question with a *performance* experiment, and doing them in one step would confound both; R-01 still needs its own decision. Option 3 is defensible only if the local tier is not on the critical path, and the ollama-boss note's §4 finding suggests it is.)

- **Reversibility:** two-way door for all three; option 1 is a measurement, not a commitment.
- **Unblocks:** whether the T1 boss slot should be a hybrid rather than a dense 72B; whether R-01's mitigation can start cheaper than MI300; a defensible depth figure for the PhD's sovereign-inference argument.
- **Cost of delay:** low and non-compounding — the models and engine are open and will still be there. The risk is the opposite one: acting on a single unreproduced measurement.
- **Rests on:** **verified** for the model and engine specifications (§5); **HIC-reported, unreproduced** for the 250K-depth curve — which is exactly why option 1 is to measure it rather than to build on it.

## 8. References

**Primary**

- `nvidia/Nemotron-Cascade-2-30B-A3B` — Hugging Face model card
- NVIDIA Nemotron research, "Nemotron-Cascade 2: Post-Training LLMs with Cascade RL and Multi-Domain On-Policy Distillation" (16.03.2026) — `research.nvidia.com/labs/nemotron/nemotron-cascade-2/`
- `hipfire` — `https://hipfire.dev/` and the public repository (Rust + HIP, RDNA1–RDNA4)
- `schuttdev/hipfire-qwen3.6-27b` — Hugging Face
- Level1Techs, "7900xtx LLM inference notes" — community measurements

**DWS internal**

- `docs/field-notes/2026-07-30-composio-harness-token-efficiency-benchmark.md` _(DWS internal)_
- `docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md` _(DWS internal)_
- `docs/field-notes/2026-07-26-ollama-boss-cost-architecture.md` — T0/T1 tiers, §4 accumulating-context finding _(DWS internal)_
- `docs/field-notes/2026-03-26-best-local-models-by-ram-tier.md` _(DWS internal)_
- `docs/risk-register/DWS_PRODUCT_RISK_REGISTER.md` — R-01, R-03 _(DWS internal)_
- `kb/wiki/concepts/harness-cost-is-a-pl-line-item.md`, `kb/wiki/concepts/adopt-the-base-own-the-loop.md` _(DWS internal)_
- `src/agents/model-selector.ts` — LITE/HEAVY split and per-model cost fields _(DWS internal)_

---

_This document follows DWS Document Standard, DWS Market Research Standard §8.3, and DWS Learning Standard (EU AI Act Article 14)._
_Ontology: AI Infrastructure > Local Inference > Long-Context Architectures > Throughput at Depth_

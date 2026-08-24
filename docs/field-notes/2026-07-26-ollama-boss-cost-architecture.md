<!--
VERSION AND AGENT HISTORY
Document: Ollama-Boss Cost & Model Architecture — corrected after billing fact-check
Version: 1.0
Date: 2026-07-26
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code (Opus 4.8), session claude/ollama-orchestration-merge-047pj7
Purpose: Record the corrected cost/model architecture for the Ollama-boss
         orchestration on DGX Spark GN-100, after a web fact-check refuted the
         "June 15 2026 two-pool billing split". Stops the wrong $20-pool premise
         from living on in plans.
-->

# Field Note — Ollama-Boss Cost & Model Architecture (corrected)

## 1. Fact-check that changed the plan (verified via web, 2026-07-26)

- **The June 15 2026 two-pool billing split was CANCELLED before it took effect.** There is **no separate $20/mo "programmatic pool"** on Pro. All Claude Code usage — interactive AND scripted/SDK/Actions — draws from the **normal subscription usage window**. (Sources: The New Stack, aicodex.to, DigitalApplied.)
- **Pro runs Sonnet 5 only in Claude Code; Pro CANNOT run Opus.** Opus 5 needs **Max** or a **raw API key**. (code.claude.com/model-config; support.claude.com.)
- **Prices (official, anthropic.com):** Sonnet 5 = **$2/$10** per MTok (intro through 2026-08-31; then $3/$15). Opus 5 = **$5/$25**.
- **Binding constraint on Pro = the usage window, not a dollar credit.** That is the limit this session actually hit ("resets 8am UTC"). Subscription usage is **not** billed per-token, so per-token math applies only to a real **API key**.

**Consequence:** the earlier "does $20/mo cover the 5% Claude calls" analysis is moot — that pool never shipped. Per-token cost modelling is still valid, but for API-key usage, not the subscription.

## 2. The layered model architecture (DGX Spark GN-100: 128 GB unified, ~98 GB for models)

| Tier | Handles | Model | Cost | Where |
| --- | --- | --- | --- | --- |
| **T0 workers (≈95% of calls)** | classification, triage, extraction, safety scoring — high volume | **qwen2.5:7b** (or llama3.1:8b) | €0/token | Ollama, GN-100 |
| **T1 boss / orchestrator** | read worker outputs, synthesize, plan, route | **qwen2.5:72b** (or llama3.3:70b) | €0/token | Ollama, GN-100 |
| **T2 hardest ≈5%** | novel architecture, subtle correctness/security, ambiguous product calls | **Opus 5 via API key** ($5/$25) *or* Sonnet 5 (Pro, interactive) | per-token, no cap | Anthropic API / Pro |
| **T3 human routine coding** | mechanical KEEP_REVIEW fixes, rebases, edits | Cursor Pro's included cheaper model | Cursor Pro flat | Cursor on DGX |

> **Correction (30.07.2026, external review).** The `€0/token` in the T0/T1 rows above means **no external per-token bill** — it does not mean free. Electricity, hardware amortisation, model serving, maintenance and finite throughput capacity remain part of the cost base. The table is left as written (Rule 12) but the figure must not be quoted as zero cost in any customer, investor or public document. Canonical wording: `PHD_FIREHORSE §14.45` Finding 5.

### Do we need two Ollama models? **Yes — one big boss + one small worker.**
- The boss (72B) is wasted on trivial worker classification; the worker (7B) is too weak to orchestrate. Splitting them is exactly what `src/agents/model-selector.ts` already encodes (LITE = qwen2.5:7b; HEAVY = qwen 32B local).
- Both fit resident on GN-100: 72B Q4 ≈ 40–48 GB + 7B ≈ 5 GB + KV/overhead ≪ 98 GB.
- Throughput: 7B workers fast (≈50–80 tok/s) carry the 95% volume; the 72B boss is slower (≈10–15 tok/s single-stream on GB10) but called far less often. **Benchmark both before trusting these numbers.**
- Start with **two** (T0 + T1). Add a mid tier (qwen2.5:32b, STANDARD) only if 7B proves too weak for compliance/report tasks — not pre-emptively (Rule 2, simplicity first).

## 3. How Opus 5 actually gets called for the hardest 5%

**Pro cannot call Opus in Claude Code.** Two clean options:
- **(a) API key → Opus 5** ($5/$25 per-token, no ceiling): the boss escalates a genuinely hard call to the API. Cost/call ≈ 3000/1e6×5 + 800/1e6×25 = **$0.035** (lean estimate — real orchestration calls are fatter). At 20k invocations × 5% = 1,000 calls ≈ **$35/mo, uncapped**. **Recommended** — matches the 95%-offload design, pay only for the 5%.
- **(b) Max subscription:** buys Opus-in-Claude-Code + 5×/20× window. Worth it **only** if a human wants Opus driving *interactive* boss sessions, or Pro's window keeps getting blown on interactive work.

**Verdict:** "Pro is enough" holds — but as **Pro (Sonnet, interactive HIC) + an API key (per-token Opus/Sonnet for the automated hard 5%)**, not via a non-existent $20 pool. Cursor Pro adds a cheap human coding lane so Pro's window is spent on judgment, not typing.

## 4. Empirical caveat (this session)

The "3K in / 800 out per call" assumption understates the boss pattern badly. This session ran ~25 subagents at **80k–200k tokens each** and hit the usage window. The expensive part is the **orchestrator's own accumulating context**, not the thin worker calls — which is the strongest argument for putting the boss on local Ollama (T1), where that context growth costs €0.

## 5. Open items

1. Pull the models on DGX: `ollama pull qwen2.5:72b` (boss) + `ollama pull qwen2.5:7b` (workers); confirm with `scripts/ollama-spark.sh --list`.
2. **Benchmark** 72B + 7B single-stream + concurrent throughput on GN-100 before trusting §2 numbers.
3. Decide T2 access: **API key (recommended)** vs Max. If API key, add `ANTHROPIC_API_KEY` and route the model-selector HEAVY tier's Claude option through it (separate from the Pro subscription).
4. Wire Cursor Pro as the T3 human coding lane on DGX.
5. Add a real Claude-side token/call log (extend the GN-100 throughput log) to replace the 3K/800 estimate.

---

_Follows DWS Document Standard. Corrects the cost premise recorded in the 2026-07-26 orchestration field note._

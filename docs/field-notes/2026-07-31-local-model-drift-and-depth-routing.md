<!--
VERSION AND AGENT HISTORY
Document: Local-model drift reconciled; contextWindow made load-bearing
Version: 1.0
Date: 2026-07-31
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code (Opus 5), session claude/enterprise-ai-harness-0anl7s
Purpose: Record the reconciliation of the local-model drift (a runtime bug, not
         doc rot), the wiring of contextWindow into model selection, and the
         rejection of a Gemini-authored spec that would have re-introduced the
         defect. Raises Q9.
Related: src/agents/model-selector.ts, kb/wiki/concepts/config-drift-is-a-runtime-bug.md,
         DWS_LEARNING_STANDARD.md v1.6

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/enterprise-ai-harness-0anl7s | Date: 31.07.2026 | Changes: Initial field note.
-->

# Field Note — The Sovereign Path Was Selectable In Name Only

**Document Type:** Field Note — Defect + Architecture
**Ontology Tags:** Sector > Sovereign Compute, Edge AI | Entities > DGX Spark, Acer Veriton GN100, Ollama, DWS IQ 6 | Temporal > 2026-Q3 | Confidence > HIGH — verified in code and tests

## 1. What was wrong

Ten places named the local Ollama models. `MODEL_CATALOG` listed `qwen2.5:7b` and `qwen2.5:32b`; `llm-client.ts` defaulted to `qwen2.5:32b`. **None of those are on the box.** The Spark runs `nemotron-3-super` + `qwen3-coder:30b`, and seven other files already agreed on that pair.

This had been carried as "four-way model drift", deferred as documentation hygiene. That diagnosis was wrong. `MODEL_CATALOG` is read by `selectModel()` on every agent call, so the runtime requested a model the host had never pulled — the call fails, or falls silently through to a metered cloud provider.

**The local-first architecture we sell was, in the selection path, unreachable.** Captured as `kb/wiki/concepts/config-drift-is-a-runtime-bug.md`.

Two further findings:

- **Standard tier had no `ollama-local` entry at all.** An Ollama-only Spark fell past both vLLM options straight to Groq/Anthropic. The tier meant to be local-first was the one that could not go local.
- **`infrastructure/dgx-spark/.env.example` named `llama3.3:70b` + `qwen2.5-coder:32b`** — the exact pair `deploy.sh --models-cleanup` exists to delete. A fresh deploy read its models from a file describing the deprecated set.

## 2. What changed

Exported `OLLAMA_DEPLOYED_MODELS {deep, fast}` as the single source of truth; every `ollama-local` catalog entry binds to it, and **no literal Ollama id remains in the catalog**. `llm-client.ts`, both `.env.example` files, and the standard tier now agree. Tests read `check-ollama-models.sh` and `deploy.sh` from disk, so editing those in isolation fails CI.

**`contextWindow` was declared on all 16 models and read by nothing.** Added `modelFitsDepth()`, applied in the primary and fallback loops, with required depth = estimated input **plus the tier's reserved output** (a window equal to the prompt cannot answer it). `ModelSelection` now carries `contextWindow` and `requiredContextTokens`; the no-model case distinguishes "no provider" from "nothing deep enough".

Corrected `nemotron-3-super` footprint from an invented 34/38 GB to **87 GB disk / ~90 GB RAM** (`Deploy-DgxSpark.ps1` states the pull size; `heartbeat.ts` gives MoE 120B/12.7B active). It now sits deliberately tight against the 98 GB budget so `isLocalModelFeasible()` rejects it rather than OOM-ing the box.

Also removed three surviving **"€0/hour"** claims — including the `reason` string emitted into logs and telemetry, where the retired cost claim was leaking into machine-readable output.

## 3. The Gemini spec — rejected, with the useful parts kept

A Gemini-authored execution spec arrived proposing the opposite direction: make `MODEL_CATALOG` canonical and rewrite the deployment scripts to match it.

**Rejected, because it would have re-introduced the defect.** It proposed adding `qwen2.5:7b` back (the phantom), adding `nemotron-cascade-2-30b-a3b` (an _external market signal_ from a field note, not a deployed model, with no evidence it is pullable), and **removing `nemotron-3-super`** — which `docker-compose.yml` references three times as the running model. It also assumed a codebase that does not exist here: `MODEL_CATALOG` as a flat array (it is `Record<ModelTier, TierConfig>`), `selectModel(request)` (it is `selectModel(agentName, options)`), `provider: "ollama"` (it is `ollama-local`), tiers `fast|heavy` (they are `lite|standard|heavy`), and `src/services/llm-client.ts` (it is `src/agents/`). Implementing it verbatim would have been a rewrite breaking 1046 passing tests.

**The general lesson, which is the reusable part:** truth flows from the deployed reality inward. You cannot fix a deployment by editing a constant.

**Kept from it:** (i) `infrastructure/dgx-spark/.env.example` was genuinely stale and I had missed it — fixed, though to the deployed pair rather than Gemini's set; (ii) dynamic `num_ctx` sizing on the Ollama call is a real gap and is carried into the next session; (iii) an explicit `requireLocal` selection constraint is worth having.

## 4. Learning Outcome (six-step)

1. **KB** — `kb/wiki/concepts/config-drift-is-a-runtime-bug.md` (new).
2. **Field note** — this file.
3. **`Learn/` HTML** — rendered.
4. **Drive** — `N/A — no customer-facing artifact in this change; the Outokumpu pack was exported 30.07 and is unchanged.`
5. **HIC question** — Q9 below.
6. **Calendar** — `N/A — this change created no dated commitment. The six Outokumpu dates from 30.07 stand.`

## 5. HIC decisions

**Q8 (still OPEN, carried)** — does the 240 h / €200 h basis in the Outokumpu tuntiraportti hold? Blocks sending that annex.

### Q9 (OPEN) — are the context-window values in the catalog fit to route on?

Depth routing is now live, and it routes on numbers **nobody has measured**. I set `qwen3-coder:30b` to 262144 and `nemotron-3-super` to 131072 from vendor/model-card knowledge, not from the box. The pre-existing vLLM entries still say 32768, which may itself be stale. Per `kb/wiki/concepts/harness-cost-is-a-pl-line-item.md`, a number with no measurement behind it is an estimate — and these estimates now change which model runs.

**Options:**

1. **Ship as-is, mark the values `unverified` in the type** _(RECOMMEND)_. Depth routing is strictly better than the previous behaviour (no routing at all), and the field carries its own provenance so nobody mistakes it for measured.
2. **Block depth routing until the GN-100 sweep runs.** Most correct, but the sweep is unrun and unreachable from cloud containers, so this parks a working improvement behind an unscheduled dependency.
3. **Probe the box at startup** and populate `contextWindow` from the live Ollama `/api/show`. Best long-term; needs the box reachable and a cache for when it is not.

**Reversibility:** two-way. Nothing customer-facing depends on it yet — but it becomes ONE-WAY the moment a context-window figure appears in a customer proposal or the Aegis pilot sizing report.

## 6. Follow-up (2026-07-31, same day, session claude/redact-aegis-customer-names) — the box still didn't have the models

Reconciling the code and picking a `contextWindow` number both assumed the box actually had `nemotron-3-super` + `qwen3-coder:30b` pulled. It didn't. Logged in with live shell access to the GN-100 (`gn100-cb5d`) as part of continuing the boss-session PR-backlog cleanup, and `ollama list` showed three different models entirely: `qwen2.5-coder:14b`, `qwen2.5-coder:32b`, `llama3.3:70b` — none of which match `OLLAMA_DEPLOYED_MODELS`, `deploy.sh`, or this field note.

This is a **different failure mode than §1's drift**, not a recurrence of it: the code and `deploy.sh` already agree with each other (reconciled together in commit `1cc8534e`, this same day) — it's specifically _this box's provisioning_ that never ran `deploy.sh --models` (or ran it against an older model set and was never re-synced). Raised to HIC: reconcile the code to match the box's ad-hoc state, or provision the box to match the already-reconciled code? **HIC chose the latter** — `ollama pull nemotron-3-super` (~87GB) and `ollama pull qwen3-coder:30b` (~18GB) were started directly on the box rather than editing the catalog again.

Also added, from the original DGX routing task (`docs/pr-cleanup/next-prompts/DGX-model-selector-routing-v2.md`) — the one part of that prompt that wasn't stale: `escalateToClaude(agentName)`, an explicit, opt-in escalation to `claude-opus-5` (distinct from the passive `claude-sonnet-5` heavy-tier cloud fallback), gated on `ANTHROPIC_API_KEY`, throwing rather than silently falling back to the Pro subscription. `AGENT_TIER_MAP`'s boss/worker split (heavy = atlas/athena/hephaestus/iris/mercury/apollo; lite = sitesense/customer-sat/keyword-intent/lead-feedback/quality-gate/argus) already matched the "boss on strong local, workers on small local" intent and needed no change.

**Still open:** Q9 above is unaffected by this — even once the correct models are pulled, their `contextWindow` values remain unmeasured. And this is at least the _sixth_ place local-model identity has drifted in one day (catalog, `llm-client.ts` default, `.env.example`, this field note's own two model IDs, and now a live box) — worth asking whether `scripts/daily/check-ollama-models.sh` should be extended to alert when a _specific_ box's `ollama list` disagrees with `OLLAMA_DEPLOYED_MODELS`, not just when the catalog disagrees with itself.

**Recommendation: option 1 now, option 3 as the durable fix**, so the depth-curve sweep validates a mechanism that already exists rather than gating it.

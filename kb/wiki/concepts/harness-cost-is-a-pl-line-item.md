<!--
VERSION AND AGENT HISTORY
Document: harness-cost-is-a-pl-line-item.md
Version: 1.0
Last-Updated: 2026-07-30
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Canonical DWS rule on agent cost economics — measure the harness before
         optimising the model, and never state a cost-per-task figure that no
         token log stands behind. Extracted from the Composio 3-harness benchmark
         (30.07.2026) and the disproved per-call estimate in the ollama-boss note.
Introduced-In: PR-pending (branch claude/enterprise-ai-harness-0anl7s)
Code-Version: 1.0
Branch: claude/enterprise-ai-harness-0anl7s
Date: 2026-07-30
Owner: risto.paarni@lifetime.fi
-->

# Harness Cost Is a P&L Line Item

**Version:** 1.0 · **Status:** Active · **Scope:** any DWS cost model, model-routing decision, agent budget, or externally-stated cost figure
**Companions:** `docs/field-notes/2026-07-30-composio-harness-token-efficiency-benchmark.md`, `docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md`, `docs/field-notes/2026-07-26-ollama-boss-cost-architecture.md`

## The rule

**Measure the harness before optimising the model.** Harness overhead — accumulated
orchestrator context, tool-call framing, retries, subagent fan-out — can dominate the model's
per-token price by an order of magnitude. Two harnesses running *the same model on the same
task* have been measured up to **30× apart on tokens at comparable success rates**.

Corollary, and the harder half:

**A cost-per-task figure with no token log behind it is an estimate, not a measurement — and
must be labelled as one.** Modelled per-call costs are systematically wrong in one direction:
they count the prompt and forget the accumulating context around it.

## Why this is a rule and not a benchmark result

The benchmark that prompted it is **vendor-run** (Composio benchmarked three harnesses
including its own; see the field note §2) and covers one model, one run, 28 tasks. The
*number* is not durable. The *rule* is, because DWS proved the same thing on its own data
before ever seeing the benchmark:

`2026-07-26-ollama-boss-cost-architecture.md` costed T2 escalation at ~3,000 in / 800 out
≈ $0.035 per call — then §4 of that same note observed one real session running **~25
subagents at 80k–200k tokens each**, and concluded "the expensive part is the orchestrator's
own accumulating context." The estimate was off by roughly two orders of magnitude, and it
was DWS's own estimate about DWS's own workload.

## The test to apply

Before asserting any agent cost figure — internally, to an investor, or to a customer:

1. **Which harness produced it?** If the figure is per-model and harness-blind, it is incomplete.
2. **Is there a token log?** Not a rate card, not an assumed prompt size — a record of tokens
   actually consumed, attributable to a completed task.
3. **If not, say "estimate".** Rule 12 (Fail Loud). "Tracking active" in a code path that
   tracks nothing is the failure mode this rule exists to catch —
   see `src/agents/base.agent.ts:515-517`.

## Known state of DWS instrumentation (as of 30.07.2026)

DWS **cannot** currently state its own cost per completed task. The per-task schema exists —
`token_usage_events` carries `prompt_tokens`, `completion_tokens`, `cached_tokens`, `cost_eur`
and **`task_id`** (`src/services/token-usage.service.ts`) — but it instruments product usage,
not Claude Code sessions, and no Claude-side token log survives a container. Full audit:
the field note §5. Tracked as Open Item 5 of the ollama-boss note.

Until that closes, every DWS agent-cost number is an estimate. Label it accordingly.

## Positioning guard

Do not cite the 30× figure externally without naming that the benchmark was run by a vendor
whose own harness placed near the top. The direction of the finding survives the caveat; the
credibility of a DWS document that omits it does not.

<!--
VERSION AND AGENT HISTORY
Document: Raw signal — Composio 3-harness token-efficiency benchmark (Kimi K3, 28 tasks)
Version: 1.0
Date: 2026-07-30
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active (raw source — not compiled)
Agent: Claude Code, session claude/enterprise-ai-harness-0anl7s
Purpose: Raw capture of Composio's 3-harness benchmark figures for later /kb compile.
         Compiled reading: docs/field-notes/2026-07-30-composio-harness-token-efficiency-benchmark.md
         Durable rule: kb/wiki/concepts/harness-cost-is-a-pl-line-item.md
-->

# Raw Signal — Composio Harness Token-Efficiency Benchmark (29–30.07.2026)

**Kind:** Market / competitive signal (third-party benchmark)
**Captured:** 2026-07-30

## ⚠️ Declared interest — attach to every citation

**Hermes is Composio's own agent harness.** Composio designed, ran and published this benchmark, and its own product placed 2nd on tokens, 1st on runtime, 2nd on success. Vendor-run research. Never cite the 30× figure without this sentence.

## The figures (as published)

Same model (Kimi K3), same 28 tasks, only the harness changed.

| Harness | Median tokens/task | Avg cost/task (@ $3/M input) | Success | Median runtime |
| --- | --- | --- | --- | --- |
| Kimi Code | 61k | $0.22 | 22/28 | 297 s |
| Hermes (Composio) | 67k | $0.28 | 21/28 | 179 s |
| Claude Code | 340k | $2.00 | 20/28 | 348 s |

- Headline: up to **30× token spread** on the same task; **~6×** median gap between Claude Code and Kimi Code.
- Cost model assumes **~95% of agentic token spend is input** (Composio's assumption, unaudited).
- Composio's conclusion: *"If you want to reduce agent costs, examine the harness before switching models."*

**Unverified:** the 28-task set, success criteria, retry policy, context-window settings, and per-harness MCP tool load — all of which move token counts materially. One model, one run.

## Adjacent Composio claim — noted, not relied on

A separate Composio post claims K3 matched Claude Fable 5 on a 14-task agentic benchmark (same 9 passes, same 5 failures), contrasting Fable at $10/M input with K3 at $3/M and free self-hosting weights. Same vendor, separate benchmark, not verified. Do not propagate.

## Naming collision

"Hermes" here = Composio's harness. DWS already uses *Hermes* as an internal agent name (logistics/ops captain, `AGENTS.md:337`, `DWS_BRAND_STANDARD.md`). Unrelated.

## Why captured

DWS runs on Claude Code — last on all three metrics here. Combined with the Nadella signal from the same 48 hours (the harness is the durable layer), this makes harness choice a P&L line item and the completed task the unit it should be priced in. It also exposed that DWS cannot measure its own cost per completed task; see §5 of the companion field note.

## Source URLs

- https://x.com/composio/status/2082452269522378858 — the 3-harness thread
- https://x.com/composio/status/2082091871493574936 — K3 vs Fable 5, 14-task benchmark
- https://composio.dev/content/openclaw-vs-hermes-agent — establishes Hermes as Composio's own harness
- https://composio.dev/content/glm-vs-kimi
- https://huggingface.co/moonshotai/Kimi-K3

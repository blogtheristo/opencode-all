<!--
VERSION AND AGENT HISTORY
Document: Composio harness token-efficiency benchmark — and what DWS can (and cannot) measure about its own cost per task
Version: 1.0
Date: 2026-07-30
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/enterprise-ai-harness-0anl7s
Purpose: Capture Composio's 3-harness benchmark of Kimi K3 (28 identical tasks;
         up to 30x token spread at similar success rates) as a market signal, with
         the vendor-run caveat declared up front. Pairs it with an audit of what
         DWS can actually measure about its own harness cost per completed task —
         answer: nothing durable. Empirical half of the cost-per-task sub-signal
         logged this morning in the Nadella harness note §5.
Related: docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md,
         docs/field-notes/2026-07-26-ollama-boss-cost-architecture.md,
         docs/field-notes/2026-06-19-karpathy-12-rules-harness-hardening.md,
         docs/field-notes/2026-05-28-agent-deployment-execution-harness.md,
         kb/wiki/concepts/adopt-the-base-own-the-loop.md,
         kb/wiki/concepts/harness-cost-is-a-pl-line-item.md,
         AI_AGENT_GUIDELINES.md §6

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/enterprise-ai-harness-0anl7s | Date: 30.07.2026 | Changes: Initial field note. Records the Composio 3-harness / 28-task Kimi K3 benchmark with its published token, cost, success and runtime figures; declares the vendor-run interest (Hermes is Composio's own harness) and the DWS internal naming collision on "Hermes"; and adds §5, an audit establishing that DWS cannot currently measure its own cost per completed task, with the exact file-level gaps and the surviving git/handoff proxies.
-->

# Field Note — The Harness Is the Cost Line: Composio's 3-Harness Benchmark, and What DWS Cannot Measure

**Document Type:** Field Note — Competitive / Market Signal + Internal Audit
**Scope:** A third-party benchmark showing that agent-harness choice, not model choice, drives cost per completed task by up to an order of magnitude — and a reproducible audit of what DWS can measure about its own harness spend. Capture and audit only; no instrumentation built, no harness migration proposed.
**Ontology Tags:** Geography > Global, EU-27 | Sector > Enterprise AI > Agent Harnesses, Coding Agents, Token Economics | Entities > Composio, Moonshot AI, Kimi K3, Kimi Code, Hermes (Composio), Claude Code, Anthropic, Lifetime Oy, DWS IQ | Temporal Context > 2026-Q3, post-open-weight-parity | Confidence > HIGH that the figures are as published; **MEDIUM-LOW that they generalise** (vendor-run, single model, single run — §2, §6)

## 1. The benchmark

Composio ran **Kimi K3 through three agent harnesses on 28 identical tasks**. Same model, same tasks; only the harness changed.

| Harness | Median tokens/task | Avg cost/task (@ $3/M input) | Success | Median runtime |
| --- | --- | --- | --- | --- |
| **Kimi Code** | 61k | $0.22 | 22/28 | 297 s |
| **Hermes** (Composio's own) | 67k | $0.28 | 21/28 | 179 s |
| **Claude Code** | 340k | $2.00 | 20/28 | 348 s |

Headline: **up to 30× more tokens for the same task depending on the harness**, at broadly similar success rates. The median task cost nearly **6× more** in Claude Code than in Kimi Code. Composio's stated cost model assumes input tokens are ~95% of agentic spend.

Composio's own conclusion, quoted:

> If you want to reduce agent costs, examine the harness before switching models.

## 2. Declared interest — read this before the numbers (fail loud)

**Hermes is Composio's own agent harness.** Composio designed the benchmark, ran it, published it, and its own product placed **2nd on tokens, 1st on runtime, 2nd on success**. That does not make the numbers wrong, and the *direction* of the finding is consistent with what anyone who has watched an agent loop burn context already suspects. But this is **vendor-run research with the vendor near the top of its own leaderboard**, and it must never be cited in a DWS document, deck or investor conversation without that sentence attached.

Further limits, stated once so nobody re-derives them later:

- **One model** (Kimi K3), **one run**, **28 tasks**. Nothing here licenses a claim about harness efficiency on Opus 5, Sonnet 5, or any other model.
- The **task set and methodology were not readable** in what was verified — success criteria, retry policy, context-window settings and MCP tool load per harness are all unknown, and every one of them moves token counts substantially.
- The **95%-input assumption** is Composio's, adopted for their dollar math. Plausible for agentic workloads; unaudited here.

**Naming collision — flag for future readers.** "Hermes" in this note is **Composio's harness**. DWS already uses *Hermes* as an internal agent name (the logistics/ops captain, `AGENTS.md:337`, with a brand colour in `DWS_BRAND_STANDARD.md`). They are unrelated. Do not let a future session conflate them.

## 3. Why this matters to DWS specifically

**DWS runs on Claude Code** — the harness that placed last on all three reported metrics in this benchmark. That is a statement about DWS's own cost base, not a market observation.

What it is **not**: a reason to migrate. Twenty-eight tasks on one model, measured by an interested party, with an unpublished task set, does not justify moving the harness that the entire `.claude/` governance layer — hooks, skills, the learning-outcome gate, the handoff protocol — is built on. The switching cost is the governance, not the CLI.

What it **is**: evidence that harness overhead is a first-order cost term, and confirmation that DWS's own per-call cost model is built on an estimate it has already disproved. `2026-07-26-ollama-boss-cost-architecture.md` costed T2 escalation at ~3,000 input / 800 output per call ≈ $0.035/call — then §4 of that same note observed one session running **~25 subagents at 80k–200k tokens each** and concluded "the expensive part is the orchestrator's own accumulating context." Composio's 340k median for Claude Code sits in the same order of magnitude as that observation and roughly 100× the modelled per-call assumption.

## 4. The link to this morning's signal

This is the **empirical half** of the sub-signal logged in `2026-07-30-nadella-harness-model-swappability-signal.md` §5.

- **Nadella (29.07.2026):** the harness is the durable layer; the model is swappable underneath it.
- **Composio (29–30.07.2026):** the harness is also where the money goes — by up to 30×, at equal success.

Put together: **harness choice is a P&L line item, and the completed task is the unit it should be priced in.** That is precisely the unit the third-party tool teased in §5 intends to sell. The uncomfortable part is §5's own conclusion, now sharpened by §5 below: DWS asserted it "has the telemetry to answer" this. It does not. It has the *schema*.

## 5. DWS harness cost audit — what is measurable today

Scope: can DWS state its own cost per completed task? **No.** Not from anything that survives a session. The gaps, each verified in-repo this session:

| Layer | What exists | Verdict |
| --- | --- | --- |
| Command volume | `.claude/hooks/log-commands.sh` writes `.claude/hooks/audit/bash-commands.log` + `.claude/command-log.txt` | ❌ **Neither file exists in this container and neither is git-tracked** — `.gitignore:78` ignores `.claude/*`, whitelisting only `HANDOFF.md`, `handoffs/`, `hooks/`, `settings*.json`, `archive/`, `commands/`. Per-session volume dies with the container |
| Token budget | Rule 6: per-task 4,000 / per-session 30,000 (`CLAUDE_AUTO_MODE_BUDGET`) | ❌ **Advisory only** — `.claude/hooks/session-start.sh` merely *echoes* the value. Nothing accumulates, nothing enforces |
| Agent cost policy | `src/agents/base.agent.ts:515-517`, `case 'cost-limit'` | ❌ **Stub** — `max_daily_eur || 50`, returns `allowed: true` with the string "(tracking active)". No tracking is active |
| Agent execution log | `supabase/migrations/030_agent_logging_tables.sql` → `agent_executions` | ⚠️ `duration_ms` only, **no token or cost columns**. `AI_AGENT_GUIDELINES.md:332` explicitly forbids documenting `prompt_tokens`/`completion_tokens`/`total_tokens` as current columns |
| Real cost ledger | `src/services/token-usage.service.ts` → `token_usage_events` | ⚠️ **Exists and is good** — carries `prompt_tokens, completion_tokens, cached_tokens, cost_eur, model, session_id, task_id`. But it instruments **product** usage (climate assistant / API), **not Claude Code sessions**. The per-task attribution schema is already built and pointed at the wrong workload |

**Surviving cross-container proxies** (reproducible from the repo, no external data):

- 499 commits since 2026-07-01, of which **325 authored by Claude** — `git log --author=Claude --since=2026-07-01 | wc -l`.
- **36** branch handoff files in `.claude/handoffs/claude/`; **95** handoff additions since 2026-07-01.
- One empirical token observation on record: **~25 subagents × 80k–200k tokens**, one session, ollama-boss note §4.

**Honest conclusion:** a commit is not a task and a handoff is not a session-cost record. DWS can count *output* (commits, handoffs, notes) and cannot count *input* (tokens, euros). A cost-per-task number derived from these proxies would be a fabrication dressed as a metric, so this audit produces none. What it produces is the precise gap: **one Claude-side token log, written against a table that already has `task_id`.** That is `Open Item 5` of the ollama-boss note, open since 26.07.2026.

## 6. Verification note (fail loud)

| Claim | Status |
| --- | --- |
| 28 tasks, 3 harnesses, up to 30× token spread; medians 61k / 67k / 340k; $0.22 / $0.28 / $2.00 at $3/M | **CONFIRMED as published** — Composio, 29–30.07.2026 |
| Success 22/28 Kimi Code, 21/28 Hermes, 20/28 Claude Code; median runtimes 297 s / 179 s / 348 s | **CONFIRMED as published** |
| Hermes is Composio's own harness | **CONFIRMED** — composio.dev publishes Hermes integration docs and harness comparison content |
| Independence of the benchmark | **NOT INDEPENDENT.** Vendor-run; vendor's own harness placed near the top. Declared, not discounted to zero |
| Task set, success criteria, retry policy, per-harness tool load | **UNVERIFIED** — not readable in what was checked. Each materially affects token counts |
| "~95% of agentic spend is input tokens" | **Composio's assumption**, adopted for their dollar math. Plausible, unaudited |
| Related Composio claim: K3 matched Claude Fable 5 on a separate 14-task benchmark (same 9 passes, 5 failures) | **NOTED, NOT RELIED ON** — same vendor, separate benchmark, not verified here. Do not propagate |
| DWS's own cost per completed task | **NOT MEASURABLE TODAY** — §5. No Claude-side token log survives a container |
| DWS proxy counts (499 / 325 commits, 36 / 95 handoffs) | **REPRODUCIBLE** from `git log` and `ls` in this repo, 30.07.2026 |

## 7. The five-step Learning Standard record

| # | Step | State |
| - | ---- | ----- |
| 1 | **Knowledge base** | ✅ `kb/raw/signals/2026-07-30-composio-harness-token-efficiency-benchmark.md` + new concept `kb/wiki/concepts/harness-cost-is-a-pl-line-item.md` (the durable rule; the benchmark numbers will age) |
| 2 | **Field note** | ✅ this file; `2026-07-30-nadella-harness-model-swappability-signal.md` bumped to v1.1 with a §5 cross-reference |
| 3 | **`Learn/` HTML** | ✅ `Learn/2026-07-30-composio-harness-token-efficiency-benchmark.html` + `.docx` |
| 4 | **Drive export** | ✅ Google Doc "2026-07-30 Field Note v1.0 — The Harness Is the Cost Line…" in the `2026 DWS6` folder (`docs.google.com/document/d/1tI8jclu3Zc4axEhLb6GG9psvH4m3bEWYcL-BZF9hP9U`). The Drive connector dropped mid-session and reconnected; repo is source of truth either way (Truth Standard §2E) |
| 5 | **HIC question** | ✅ §8, session reply, and `.claude/handoffs/claude/enterprise-ai-harness-0anl7s.md` |

## 8. Next steps and the HIC question

**Routed, not executed:**

1. **Instrumentation is not built here.** No hook changes, no migration, no edit to `token-usage.service.ts`. See the question below.
2. **No harness migration** proposed or evaluated. The switching cost is the `.claude/` governance layer, not the CLI.
3. **`/truth-check`** before any external use of the 30× figure — and never without the vendor-run caveat (§2).
4. **PhD thesis** — the "harness overhead dominates model price" finding is market-signal data for `PHD_FIREHORSE_{EN,FI}`. Deferred, pending HIC approval. Master's thesis untouched.

### HIC question (EU AI Act Art. 14 intervention point)

**Q1. DWS's own cost per completed task is unmeasured, and the table that would hold it (`token_usage_events`, with `task_id`) already exists. Do we instrument it?**

**Options:**

1. **Instrument the Claude-side token log** against the existing `token_usage_events` schema — closes ollama-boss Open Item 5, replaces the disproved 3K/800 estimate with measurement, and makes every future cost claim defensible. Cost: real engineering on the harness layer, plus a decision about where session token counts come from.
2. **Do not instrument; cap by policy instead** — set a hard `CLAUDE_AUTO_MODE_BUDGET` and actually enforce it in `session-start.sh`, accepting that DWS manages spend without ever knowing its per-task cost.
3. **Fold cost-per-task into a customer-facing capability** — treat the measurement as the first increment of the pricing tool flagged in the Nadella note §5, rather than as internal telemetry.

**(RECOMMEND: 1, scoped to internal measurement only.** Option 3 is the same work with a product commitment attached, and committing to a customer-facing pricing surface before DWS can measure *one* number about *itself* is the wrong order. Option 2 caps the bleeding while guaranteeing we never learn where it comes from — and Rule 12 makes an unmeasured "tracking active" string in `base.agent.ts:517` a live fail-loud violation regardless of which option wins.)

- **Reversibility:** two-way door for 1 and 2. Option 3 becomes one-way once a price is published.
- **Unblocks:** ollama-boss Open Item 5; a defensible per-task figure for the PhD entry and for any investor cost claim; option 3 later, if wanted.
- **Cost of delay:** compounding but quiet. Every session without a token log is a session whose cost is unrecoverable — the data is gone when the container is.
- **Rests on:** **verified** for the in-repo audit (§5, every row checked this session); **published-but-vendor-run** for the Composio figures. The recommendation does not depend on Composio being right — the measurement gap is real either way.

## 9. References

**Primary**

- Composio, "We ran Kimi K3 through 3 agent harnesses…" — `https://x.com/composio/status/2082452269522378858` (29–30.07.2026)
- Composio, K3 vs Claude Fable 5 on a 14-task agentic benchmark — `https://x.com/composio/status/2082091871493574936` (noted, not relied on)
- Composio, "OpenClaw vs Hermes Agent: The best agent harness in 2026" — `https://composio.dev/content/openclaw-vs-hermes-agent` (establishes Hermes as Composio's own)
- Composio, "GLM 5.2 vs Kimi K3" — `https://composio.dev/content/glm-vs-kimi`
- `moonshotai/Kimi-K3` — Hugging Face model card

**DWS internal**

- `docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md` _(DWS internal)_
- `docs/field-notes/2026-07-26-ollama-boss-cost-architecture.md` _(DWS internal)_
- `docs/field-notes/2026-06-19-karpathy-12-rules-harness-hardening.md` _(DWS internal)_
- `docs/field-notes/2026-05-28-agent-deployment-execution-harness.md` _(DWS internal)_
- `kb/wiki/concepts/harness-cost-is-a-pl-line-item.md` _(DWS internal)_
- `src/services/token-usage.service.ts`, `src/agents/base.agent.ts:515-517`, `supabase/migrations/030_agent_logging_tables.sql`, `AI_AGENT_GUIDELINES.md` §6 _(DWS internal)_

---

_This document follows DWS Document Standard, DWS Market Research Standard §8.3, and DWS Learning Standard (EU AI Act Article 14)._
_Ontology: Enterprise AI > Agent Harnesses > Token Economics > Cost Per Completed Task_

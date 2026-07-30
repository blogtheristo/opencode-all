# Handoff — claude/enterprise-ai-harness-0anl7s

**Date:** 2026-07-30 · **Status:** Complete, pushed. No PR opened (not requested). Capture-only by HIC decision.

## What the branch did

Captured Satya Nadella's 29.07.2026 Microsoft FY26 Q4 earnings-call framing — *"You've got to keep your harness separate from the model… any given model at any given time is swappable"* — as a market signal, via the DWS Learning Standard five-step HIC Learning Outcome (EU AI Act Art. 14).

**The reading (both halves, deliberately):**

- **Validation.** Microsoft publicly stated the architecture DWS already holds as canonical in `kb/wiki/concepts/adopt-the-base-own-the-loop.md` — don't pretrain the base, own the loop around it.
- **Compression.** Microsoft sells the harness (Copilot) *and* the models. As of 29.07.2026 "harness separate from model" is incumbent marketing — **table stakes, not a DWS differentiator**. The claim that survives is narrower: the **sovereign compliance evidence loop** (KYA, Article 12 chain, private evals on the customer's own operational corpus). Evidence is jurisdictional; a horizontal harness is not.
- **Sub-signal, logged not built:** a third party (BEP Research, Substack) is building an enterprise **cost-per-completed-task pricing tool** — adjacent to `/token-capital` and `2026-07-26-ollama-boss-cost-architecture.md`, a unit DWS has telemetry for and has never packaged.

## Files

| Step | Path |
| ---- | ---- |
| 1 KB (raw) | `kb/raw/signals/2026-07-30-nadella-harness-separate-from-model.md` — first real use of the declared `/kb ingest` signals route |
| 1 KB (wiki) | `kb/wiki/concepts/adopt-the-base-own-the-loop.md` → **v1.1**: `## External validation (2026-07-29)` + rewritten positioning guard ("never claim we own the harness") |
| 2 Field note | `docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md` |
| 3 Learn | `Learn/2026-07-30-nadella-harness-model-swappability-signal.html` + `.docx` |
| 4 Drive | Google Doc in `2026 DWS6` — `docs.google.com/document/d/1CypbA3GsW8ecKDRX1ndA12BoJWvyL-6Xj7fSUd-gj4I` |
| 5 HIC question | Field note §8, session reply, and below |

**Container note worth carrying forward:** `pandoc` was **installed in this container this session** (`apt-get install -y pandoc`), which unblocked the Learn/ HTML step that the 26.07.2026 session had to record as `N/A`. Fresh containers still start without it — install it early rather than recording step 3 N/A.

## Verified vs. propagated (fail loud)

- **CONFIRMED:** the two Nadella quotes, the call date (29.07.2026), the analyst (UBS, Karl Keirstead). Sources: TechCrunch 29.07.2026, Investing.com transcript.
- **PARTIAL:** the "train your own model… you have all the traces" continuation — reported, not checked against a primary transcript.
- **CORROBORATED:** Huang × Harrison Chase LangChain fireside, 08.07.2026 (36Kr, VentureBeat).
- **UNVERIFIED:** the BEP Research author's claims about their own publication ("published the full framework on July 12", "five launches in three days"). Source page returned **HTTP 403**. Third-party author, not Lifetime Oy (HIC-confirmed in session). Never restate as DWS fact.
- **Standing drift, recorded not fixed:** `/kb` says `kb/wiki/` is LLM-compiled and never hand-edited, but every concept there is hand-authored and `kb/kb.json` is stale (`lastCompile: null`, `articleCount: 0`). Followed actual practice; flagged for a `/kb compile` reconciliation.

## Open / handed off (NOT done — deliberately)

1. **PhD thesis routing.** The durable framing belongs in `PHD_FIREHORSE_{EN,FI}` §14.NN as market-signal data (Thesis Content Scope Rule). **Deferred, pending HIC approval.** Master's thesis untouched — this is not implementation evidence.
2. **`/truth-check` sweep** for harness/swappability language on live DWS surfaces, before any positioning rewrite. This is the prerequisite for option 1 of the HIC question.
3. **Cost-per-task pricing** — a separate decision, not bundled into positioning.
4. No blog/LSJ draft. Publication needs `/blog-draft` + explicit HIC approval (Non-Negotiable Rule 13).

## HIC question (open)

**Q1. "Harness" stopped being a differentiator on 29.07.2026. What does DWS do about its positioning?**
(1) Re-cut positioning to the evidence-loop claim across brand/truth standards and site copy · (2) Hold positioning, route to the PhD thesis only · (3) Open cost-per-task pricing as its own work item.
**RECOMMEND: 2 now, 1 next — but only after the `/truth-check` sweep tells us the blast radius.** Reversibility: two-way for 1 and 2; 3 becomes one-way once priced publicly. Rests on: verified for the signal, propagated-not-verified for the commentary (the conclusion does not depend on it).

## Commit (signal 1)

`learn(hic): HIC Learning Outcome — Nadella harness/model-swappability signal (DWS_LEARNING_STANDARD.md, EU AI Act Art. 14)` — field note, raw signal, concept v1.1, Learn HTML + DOCX, this handoff. Pushed to origin (`57460c6`).

---

# Signal 2 — Composio harness token-efficiency benchmark + DWS harness cost audit (same day)

**Date:** 2026-07-30 · **Status:** Complete, pushed. Capture + audit by HIC decision; **no instrumentation built**.

## What arrived

Composio benchmarked **Kimi K3 across three harnesses on 28 identical tasks**. Same model, same tasks, only the harness changed:

| Harness | Median tokens | Cost/task @ $3/M | Success | Median runtime |
| --- | --- | --- | --- | --- |
| Kimi Code | 61k | $0.22 | 22/28 | 297 s |
| Hermes (Composio's own) | 67k | $0.28 | 21/28 | 179 s |
| Claude Code | 340k | $2.00 | 20/28 | 348 s |

Up to **30× token spread at comparable success**. This is the **empirical half** of signal 1's §5 cost-per-task sub-signal: Nadella said the harness is the durable layer; Composio measured that it is also where the money goes.

**Two caveats that must travel with the figure:**

1. **Vendor-run.** Hermes is Composio's own harness and it placed near the top of Composio's own benchmark. Never cite the 30× without saying so. One model, one run, unpublished task set.
2. **Naming collision.** "Hermes" here is Composio's harness — unrelated to DWS's internal Hermes (logistics/ops captain, `AGENTS.md:337`, `DWS_BRAND_STANDARD.md`).

## The audit result — the part that matters internally

**DWS cannot measure its own cost per completed task.** Every row verified in-repo this session:

- `.claude/hooks/audit/bash-commands.log` and `.claude/command-log.txt` — **do not exist here and are not git-tracked** (`.gitignore:78`). Per-session command volume dies with the container.
- `CLAUDE_AUTO_MODE_BUDGET` — `session-start.sh` only **echoes** it. Rule 6's 4k/30k budgets never accumulate or enforce.
- `src/agents/base.agent.ts:515-517` — cost-limit policy is a **stub** returning `allowed: true` with the string "(tracking active)". Nothing is tracked. That string is itself a live Rule 12 violation.
- `agent_executions` (migration 030) — `duration_ms`, **no token/cost columns**.
- `src/services/token-usage.service.ts` / `token_usage_events` — **already carries `prompt_tokens, completion_tokens, cached_tokens, cost_eur, model, session_id, task_id`**, but instruments *product* usage, not Claude Code sessions. The per-task schema exists and points at the wrong workload.

Surviving proxies (reproducible): 499 commits since 2026-07-01, **325 Claude-authored**; 36 handoff files, 95 handoff additions. Plus one token observation on record — ollama-boss §4, ~25 subagents × 80k–200k tokens.

**No cost-per-task number was produced.** Deriving one from commit counts would be a fabrication dressed as a metric. Signal 1's §5 claim that DWS "has the telemetry" was corrected in v1.1: it has the **schema**, not the log.

## Files (signal 2)

| Step | Path |
| ---- | ---- |
| 1 KB (raw) | `kb/raw/signals/2026-07-30-composio-harness-token-efficiency-benchmark.md` |
| 1 KB (wiki) | **New concept** `kb/wiki/concepts/harness-cost-is-a-pl-line-item.md` v1.0 — the durable rule (measure the harness before the model; a cost figure with no token log is an estimate). The benchmark numbers will age; this won't |
| 2 Field note | `docs/field-notes/2026-07-30-composio-harness-token-efficiency-benchmark.md` + Nadella note → **v1.1** |
| 3 Learn | `Learn/2026-07-30-composio-harness-token-efficiency-benchmark.html` + `.docx`; Nadella note re-rendered |
| 4 Drive | `docs.google.com/document/d/1tI8jclu3Zc4axEhLb6GG9psvH4m3bEWYcL-BZF9hP9U` — the connector dropped mid-session and reconnected; register was corrected from a pre-filled `N/A` |
| 5 HIC question | Field note §8, below, and the session reply |

## HIC question 2 (open)

**Q1. DWS's cost per completed task is unmeasured, and `token_usage_events.task_id` already exists. Do we instrument it?**
(1) Instrument the Claude-side token log against the existing schema — closes ollama-boss **Open Item 5**, open since 26.07 · (2) Don't instrument; enforce a hard `CLAUDE_AUTO_MODE_BUDGET` instead · (3) Fold cost-per-task into a customer-facing pricing capability.
**RECOMMEND: 1, internal measurement only.** Option 3 is the same work with a product commitment attached — committing to a customer-facing pricing surface before DWS can measure one number about itself is the wrong order. Reversibility: two-way for 1 and 2; 3 is one-way once a price is published. Cost of delay: compounding but quiet — every uninstrumented session's cost is unrecoverable once the container is gone.

## Commit (signal 2)

`learn(hic): Composio harness token-efficiency benchmark + DWS harness cost audit (DWS_LEARNING_STANDARD.md, EU AI Act Art. 14)`. Pushed to origin.

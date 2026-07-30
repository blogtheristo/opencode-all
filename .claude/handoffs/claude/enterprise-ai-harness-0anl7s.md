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

`learn(hic): Composio harness token-efficiency benchmark + DWS harness cost audit (DWS_LEARNING_STANDARD.md, EU AI Act Art. 14)`. Pushed to origin (`63fc614`).

---

# Signal 3 — Hybrid attention + throughput at context depth (same day)

**Date:** 2026-07-30 · **Status:** Complete, pushed. Capture and assessment only — no tier re-spec, no hardware decision, no register edit.

## Attribution correction (carry this forward)

The note originates with the **HIC's own field observation**, not a prior DWS position. The repo had **no mention of `Nemotron-Cascade-2-30B-A3B`** before 30.07.2026, and the assistant had expressed no view on it. Recorded as §0 of the note so a future session does not recall a DWS assessment that never existed.

## The observation

1. **Hybrid attention is a prerequisite for usable long context** — a 1M window is not exploitable under N² attention; nominal and working window diverge. `Nemotron-Cascade-2-30B-A3B` (Mamba-2 + attention hybrid) is the counter-example.
2. **Engine matters as much as architecture** — most local stacks fall to single-digit tok/s once context accumulates. **hipfire** (Rust + HIP, RDNA1–4) holds **~40 tok/s on a 7900 XTX with Qwen 3.6-27B, roughly constant to ~250K depth** (HIC measurement).
3. The durable complaint: **benchmarks are quoted at shallow depth; agents work at deep depth.**

## Why it completes the day's thread

Nadella: the harness is the durable layer. Composio: the harness is where the money goes (340k median). **This: those tokens are context depth — and whether they cost anything depends on the architecture and engine underneath.** On a metered API harness overhead is a bill; on a hybrid-attention local model with constant throughput at depth it is latency already paid for at €0/token.

**Sharpest internal consequence:** the ollama-boss T0/T1 tiers (`qwen2.5:7b` / `qwen2.5:72b`) were specified on **volume**, but that note's own §4 found the expensive part is *the orchestrator's accumulating context* — a depth problem. A dense 72B that collapses at depth is a worse T1 boss than a 30B-A3B hybrid holding 40 tok/s. **The tier was chosen on the wrong axis.** Not re-specified here.

## Verified vs. reported

- **CONFIRMED:** Nemotron-Cascade-2-30B-A3B — 30B MoE / ~3B active, Mamba-2 + attention hybrid on the Nemotron-3-Nano base, **1M context**. hipfire exists (Rust + HIP, RDNA1–4, `hipfire.dev`), publishing ~44 tok/s Qwen 3.6-27B on 7900 XTX autoregressive and ~185 tok/s via DFlash speculative decode.
- **VENDOR-REPORTED:** 24 GB fit at Q4; "beats Nemotron-3-Super 120B"; IMO/IOI gold. `/truth-check` before any external use.
- **HIC-REPORTED, UNREPRODUCED — the load-bearing claim:** constant ~40 tok/s to ~250K depth. No public benchmark corroborates constant throughput at that depth. One operator, one machine, one config.

## R-01 boundary — do not overstate

hipfire is **RDNA (consumer graphics)**; R-01 specifies **CDNA / Instinct MI300** or Gaudi 3. **This does not close R-01** and must never be reported as doing so. It *is* evidence the non-NVIDIA exit is real ("demonstrated, not asserted"), and a candidate cheaper first increment. Register unedited.

## Files (signal 3)

`docs/field-notes/2026-07-30-hybrid-attention-long-context-local-inference.md` · `kb/raw/signals/2026-07-30-hybrid-attention-long-context-local-inference.md` · `Learn/2026-07-30-hybrid-attention-long-context-local-inference.{html,docx}` · Drive `docs.google.com/document/d/1o9rdxIBAtvwsmt43Eum66nchTKVK5b8ZPJ9bTjal0NQ`

## HIC question 3 (open)

**Q1. The local tier was specified on volume; this says the binding constraint is depth. Do we re-test it — and on which axis?**
(1) Reproduce the depth curve on the **GN-100 we already own** (shallow → 250K, Nemotron-Cascade-2) · (2) Treat it as the R-01 first increment on RDNA3 + hipfire · (3) Note and hold.
**RECOMMEND: 1.** Cheapest, uses owned hardware, and produces the one number the other two depend on. Option 2 answers a *sovereignty* question with a *performance* experiment — doing both at once confounds them. Cost of delay is low; the risk is the opposite one, acting on a single unreproduced measurement.

## Commit (signal 3)

`learn(hic): hybrid attention + throughput at context depth — local inference signal (DWS_LEARNING_STANDARD.md, EU AI Act Art. 14)`. Pushed to origin.


---

# Session close — 2026-07-30

**HIC question counter for this branch: highest used = Q6.** The next decision point raised on
`claude/enterprise-ai-harness-0anl7s` is **Q6**, in any document. Per `DWS_LEARNING_STANDARD.md`
§10.1.1 (added v1.4 this session) the counter is branch-scoped and never restarts — do not open a
new note at Q1.

| Q | Decision | State |
| - | -------- | ----- |
| Q1 | Hold positioning, route to PhD thesis | Done, then superseded by Q4 |
| Q2 | Instrument the Claude-side token log | **Shipped** — `scripts/record-session-tokens.mjs` + Stop hook |
| Q3 | Reproduce the depth curve on the GN-100 | **Harness shipped, sweep NOT run** — box unreachable from cloud containers |
| Q4 | Positioning: harness ownership vs coupling | Answered — hold the narrative, re-cut to harness + sovereign compute + jurisdiction |
| Q5 | Claim-level truth check vs. rely on human review | **OPEN** — see `docs/field-notes/2026-07-30-hic-decisions-executed.md` §8. RECOMMEND option 1 (extend `/truth-check` to the banned cost strings) |

## What shipped

- **Thesis** §14.45 + KC #50, lockstep **3.94** across all four files; `Learn/` at v3.94. Fixed the
  `gen-thesis-html.cjs` root cause — it read stale duplicate sources under `Learn/*.md` (v3.83), now
  reads canonical `docs/`.
- **Blog** — "The Harness Paywall" published EN, registry row 48, Text of the Day, dual folder synced.
  Draft at `docs/blog-drafts/harness-paywall-depth-arbitrage.md` is `Status: APPROVED` with the record.
- **Telemetry** — token recorder (Q2) and depth-curve sweep (Q3), both tested and both verified
  falsifiable by stubbing. `base.agent.ts` no longer claims "(tracking active)" while tracking nothing.
- **dws10 hero** re-cut to bounded sovereign compute; prior Nordic/EN 15978 copy preserved in an
  adjacent HTML comment, not deleted.
- **Standards** — `DWS_LEARNING_STANDARD.md` → v1.4 (§10.1.1, branch-scoped numbering).

## Two corrections that came from outside — carry these forward

1. **"€0 marginal token cost" was false** and had reached six files including a thesis section and a
   blog draft awaiting publication. Canonical replacement wording is now
   `kb/wiki/concepts/bounded-not-zero-sovereign-compute-economics.md`. **Quote that sentence; do not
   improvise a stronger one.** "Zero tokens leave the premises" is a *residency* claim, true, and must
   never be reused as a cost claim.
2. **HIC question numbering** restarted per-note and made three decisions unanswerable by reference.
   Fixed in §10.1.1; the three notes were retro-labelled Q1/Q2/Q3.

Neither was caught by the harness. A hook checks that a field note exists, not whether its claims are
true — worth remembering before trusting a green session-stop.

## Open, in priority order

1. **Run the depth sweep** on the GN-100 (`scripts/weekly/depth-curve-sweep.sh`, self-scheduling
   Sunday 04:00 UTC). Until the curve exists, §14.45 is an architectural hypothesis and says so.
2. **Tier re-spec, code half.** `contextWindow` in `src/agents/model-selector.ts` is still a dead
   field read by nothing; selection has no depth dimension. The reasoning is in §14.45 Finding 2/5.
3. **Four-way local-model drift** — `MODEL_CATALOG` vs DGX deploy path vs ollama-boss note vs
   `.env.example` name four different model sets. Deliberately deferred, still unreconciled.
4. **Harness-language exposure pack** — 37 public files use `harness`/`swappable`, incl. an investor
   note calling harness engineering "the architectural moat behind DWS IQ 6". Q4 settled the claim;
   whether those surfaces need the narrower wording is undecided.


## Locked decision added after session close — network-independent critical operation

**HIC, 30.07.2026:** in a hybrid-war environment a manufacturing facility is **dual-use critical
infrastructure** — loss of network connectivity **cannot** stop production or the core compliance
workflow. Operational premise, not a deployment preference. Five pilot requirements: local execution
and evidence; local identity, logs and kill authority; no network dependency for the core outcome;
cloud only for optional sync/backup/non-critical reporting; specified graceful degradation.

**Commercial line (use this, not "on-prem"):**
> Aegis keeps critical compliance and control-room workflows running when the network cannot be trusted.

**Why it matters more than today's economic argument:** continuity is **provable today** — pull the
cable during the pilot. The §14.45 economic argument still depends on the unrun depth-curve sweep.
Lead pilot material with continuity; keep economics in the conversation but not load-bearing.

**Article 12 sharpening:** the record must exist for decisions taken *during* an outage, not be
reconstructed after. An evidence chain that pauses when the uplink drops has its gap at exactly the
moment it matters. That moves this from resilience engineering to compliance engineering.

**Conflict found and corrected:** `Store/PRODUCT_AEGIS.md` said "available **exclusively** on European
cloud or enterprise private cloud" and put air-gapped operation behind the €4,999/mo Sovereign tier —
i.e. sold the premise as a premium upgrade. Overview corrected; **tiers untouched**.

Captured: `docs/field-notes/2026-07-30-network-independent-critical-operation.md`,
`kb/wiki/concepts/network-independent-critical-operation.md` (with a five-point architecture test),
`Learn/` HTML, Drive.

**Q6 (OPEN):** does network-independent operation move into Standard/Defence, stay Sovereign-only, or
split? **RECOMMEND: split** — local evidence, local kill authority and specified degradation are
governance and belong in every tier; full local *execution* of the physical layer needs a customer
box and is a genuine Sovereign distinction. Becomes **ONE-WAY** the moment it is quoted in a pilot
proposal or price list. Open engineering dependency: can Standard/Defence deliver local identity/logs/
kill authority without customer hardware? Unanswered.

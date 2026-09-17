<!--
VERSION AND AGENT HISTORY
Document: HIC Learning Outcome — 2026-07-30 session (harness thread: three signals, five decisions, two corrections)
Version: 1.0
Date: 2026-07-30
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/enterprise-ai-harness-0anl7s
Purpose: DWS Learning Standard closing record for a session that started as a single
         market-signal capture and became a positioning decision, two shipped
         telemetry capabilities, a published post, a thesis section, and two
         externally-caught corrections to claims this session itself had written.
         Legal basis: EU AI Act Article 14 (human oversight) — HIC = Human-In-Command.
Related: docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md,
         docs/field-notes/2026-07-30-composio-harness-token-efficiency-benchmark.md,
         docs/field-notes/2026-07-30-hybrid-attention-long-context-local-inference.md,
         docs/PHD_FIREHORSE_EN.md §14.45 / Key Contribution #50,
         kb/wiki/concepts/bounded-not-zero-sovereign-compute-economics.md,
         kb/wiki/concepts/harness-cost-is-a-pl-line-item.md,
         DWS_LEARNING_STANDARD.md §10.1.1

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/enterprise-ai-harness-0anl7s | Date: 30.07.2026 | Changes: Initial closing record. Documents the three-signal capture, the five HIC decisions and their execution, the two external corrections (Boardy on the €0 claim; the HIC on question numbering), the two shipped telemetry capabilities, and what remains open. Raises Q5.
-->

# HIC Learning Outcome — 2026-07-30

## 1. What the session was, and what it became

It started as one pasted market signal and became the day the harness argument acquired an economic spine, a public surface, and — twice — a correction from outside.

**The arc:** Nadella quote pasted → captured as a signal → a benchmark arrives that prices it → a field observation arrives that resolves it → the three turn out to be one argument → the argument goes into the PhD thesis → it goes public as a blog post → an external reviewer catches a false cost claim inside it → the claim is corrected across six files → the homepage hero is re-cut to the corrected wording → two of the three open decisions are executed as working code.

## 2. The three signals (each with its own note)

| # | Signal | Note |
| - | ------ | ---- |
| 1 | Nadella, MSFT FY26 Q4 call 29.07 — "keep your harness separate from the model" | `2026-07-30-nadella-harness-model-swappability-signal.md` |
| 2 | Composio 3-harness benchmark — up to 30× token spread, same model and tasks | `2026-07-30-composio-harness-token-efficiency-benchmark.md` |
| 3 | Hybrid attention + throughput at depth (HIC field measurement) | `2026-07-30-hybrid-attention-long-context-local-inference.md` |

**The synthesis was the HIC's, and the framing was Gemini 3.6 Thinking's** — thesis (the harness is durable) → antithesis (its token intensity is disqualifying under metered pricing) → synthesis (fixed sovereign compute changes the cost *type*). Attributed as such in `PHD_FIREHORSE §14.45` and in the published post, because an argument structure adopted from an external model is itself a provenance claim.

## 3. The five decisions and what was done

| Q | Decision | Executed |
| - | -------- | -------- |
| **Q1** | Hold positioning; route the signal to the PhD thesis | ✅ §14.45 + KC #50, lockstep 3.91 → 3.94. **Then superseded:** the HIC re-cut positioning to the *coupling* claim (§5 below) |
| **Q2** | Instrument the Claude-side token log — internal measurement only | ✅ `scripts/record-session-tokens.mjs` + Stop hook. Cost per completed task is now measurable |
| **Q3** | Reproduce the depth curve on the GN-100 | ⚠️ **Harness built, sweep not run** — GN-100 unreachable from this container. Registered in `scripts/weekly/` so it runs itself |
| **Q4** | Positioning: harness ownership vs the coupling | ✅ Answered by the HIC: hold the harness-engineering narrative, re-cut the claim to *harness + fixed sovereign compute + jurisdiction* |
| **Q5** | *(open — §8)* | — |

Also executed outside the numbered questions: the tier re-spec instruction produced Finding 2/5 rather than code (the code half is still open, §7), and the blog post was drafted, revised three times, approved and published.

## 4. What was verified, not assumed

- **Nadella's two quotes** — CONFIRMED against the FY26 Q4 call (TechCrunch, Investing.com transcript). The "train your own model… traces" continuation is reported, not verbatim-verified.
- **Composio's figures** — CONFIRMED as published, and declared **vendor-run**: Hermes is Composio's own harness and placed near the top of Composio's own leaderboard. One model, one run, unpublished task set.
- **Nemotron-Cascade-2-30B-A3B and hipfire** — specifications CONFIRMED against primary sources. The 250K-depth throughput curve is a **single unreproduced operator report** and is labelled as the load-bearing, least-verified claim wherever it appears.
- **The DWS cost audit** — every row checked in-repo. Result: DWS could not state its own cost per completed task. Now it can (Q2).
- **The `gen-thesis-html.cjs` bug** — reported on 26.07, undiagnosed. Root cause found: it read duplicate thesis sources under `Learn/*.md` frozen at v3.83 while `docs/` was at 3.91. Repointed at the canonical paths.

## 5. The two corrections that came from outside

Both matter more than anything this session produced on its own, because both caught something the session was confident about.

**5.1 — "marginal token cost is €0" was false (external review, Boardy).** By the time it was caught it had propagated to `PHD_FIREHORSE` §14.45 in both languages, a field note, a KB raw signal, `infrastructure/dgx-spark/docker-compose.yml`, `mcp-servers/cloud-run-gateway-ts/README.md`, and a blog draft awaiting publication. Electricity, hardware amortisation, serving, maintenance and throughput capacity all remain. Corrected everywhere; the canonical replacement wording is now a KB concept (`bounded-not-zero-sovereign-compute-economics.md`) precisely because **the false version is more quotable than the true one** — "€0" is a headline, "bounded and dimensioned" is a sentence, and under drafting pressure the compressible claim wins unless a rule stops it.

Kept distinct: **"zero tokens leave the premises"** is a data-residency claim, is true, and is not a cost claim. Recorded so the distinction survives.

**5.2 — HIC question numbering was broken (HIC).** Three notes on one branch each opened at "Q1", so three distinct decisions shared one label and could not be answered by reference. `DWS_LEARNING_STANDARD.md` §10 fixed the *form* of a decision point and left the *counter* undefined. Fixed as §10.1.1 (v1.4): branch-scoped, never restarting, with the running counter carried in the handoff. The three notes were retro-labelled Q1/Q2/Q3 — labels only, questions unchanged.

**What both have in common:** the harness caught neither. A hook checks that a field note exists, not whether its claims are true or its questions answerable. Both corrections came from a human and a second model reading the output.

## 6. The five-step Learning Standard record

| # | Step | State |
| - | ---- | ----- |
| 1 | **Knowledge base** | ✅ `kb/wiki/concepts/bounded-not-zero-sovereign-compute-economics.md` (new), `harness-cost-is-a-pl-line-item.md` (new, earlier today), `adopt-the-base-own-the-loop.md` → v1.1, plus three `kb/raw/signals/` captures |
| 2 | **Field note** | ✅ this file, plus the three signal notes |
| 3 | **`Learn/` HTML** | ✅ all four field notes rendered; thesis at `PHD_FIREHORSE_{EN,FI}_v3.94.html` and `V3Thesis_{EN,FI}_v3.94.html` |
| 4 | **Drive export** | ✅ `2026 DWS6` folder — three signal notes exported; this record to follow the same path |
| 5 | **HIC question** | ✅ **Q5**, §8 |

## 7. What is still open

1. **The depth sweep has not run.** The harness exists and is scheduled; the curve does not exist. Until it does, §14.45's argument is explicitly an architectural hypothesis — stated that way in the thesis and in the published post.
2. **The tier re-spec is half-done.** The *reasoning* landed (the tier was chosen on volume, the binding constraint is depth). The *code* did not: `contextWindow` in `src/agents/model-selector.ts` is still a dead field, read by nothing.
3. **Four-way local-model drift**, unreconciled and deliberately out of scope: `MODEL_CATALOG` says `qwen2.5:7b`/`32b`, the DGX deploy path says `nemotron-3-super`/`qwen3-coder:30b`, the ollama-boss note says `qwen2.5:72b` (which exists in no code), and `.env.example` says `llama3.3:70b`.
4. **The harness-language exposure pack** was never written — 37 files across the public sites use `harness`/`swappable`, including an investor note calling harness engineering "the architectural moat behind DWS IQ 6". Q4 resolved the *claim*; whether those surfaces need the narrower wording is undecided.

## 8. HIC question Q5 (EU AI Act Art. 14 intervention point)

**Q5. Two external reviewers caught what the harness did not. Do we build a check for claim-level truth, or accept that this is what human and peer review are for?**

**Options:**

1. **Extend `/truth-check` to claim patterns, not just phrases.** It currently lints a deprecated-phrase deny-list. Add the banned cost formulations from the new KB concept (`€0/token`, `zero marginal cost`, `free tokens`) as blocking patterns, and wire it into the pre-publish path so a false cost claim cannot reach a public surface or a thesis section. Narrow, mechanical, catches exactly this class.
2. **Accept the limit and formalise the review instead.** Do not grow the harness; instead make "second reader before any outward-facing claim" an explicit step in the learning outcome, naming who (HIC, Boardy, another model). Cheaper to run, no false confidence in automation.
3. **Both, sequenced** — pattern lint now for the known-false strings, review step for everything a lint cannot see.

**(RECOMMEND: 1, and only 1 for now.** The €0 error was a *known-false string*, which is exactly what a lint catches — and it propagated to six files precisely because nothing mechanical stood between drafting and committing. Option 2 sounds more thorough and is in practice what already happened: two reviewers caught it, unprompted, and codifying that into a checklist step is unlikely to make it happen more reliably. Option 3 is 1 plus a process nobody will follow. Do the narrow mechanical thing that would have worked, and leave review as the thing humans already do well.)

- **Reversibility:** two-way door. A lint rule is one file and revertible; a false negative costs nothing beyond the status quo.
- **Unblocks:** the pre-publish gate for the harness-language exposure pack (§7.4), and any future cost claim reaching the store or investor pages.
- **Cost of delay:** low but sharp-edged. The next €0-shaped claim is cheap to write and expensive to retract once it is on an investor surface.
- **Rests on:** **verified** — the six-file propagation is in this session's own git history; the KB concept naming the banned strings already exists. Nothing here depends on a claim from outside the repo.

## 9. References

- `docs/PHD_FIREHORSE_{EN,FI}.md` §14.45 / Key Contribution #50 _(DWS internal)_
- `kb/wiki/concepts/bounded-not-zero-sovereign-compute-economics.md` _(DWS internal)_
- `kb/wiki/concepts/harness-cost-is-a-pl-line-item.md` _(DWS internal)_
- `DWS_LEARNING_STANDARD.md` §10.1.1 (v1.4) _(DWS internal)_
- `docs/blog-drafts/harness-paywall-depth-arbitrage.md` (Status: APPROVED) _(DWS internal)_
- `onelifetime.world/posts/harness-paywall-depth-arbitrage.html` (published 30.07.2026)
- `scripts/record-session-tokens.mjs`, `scripts/weekly/depth-curve-sweep.mjs` _(DWS internal)_

---

_This document follows DWS Document Standard and DWS Learning Standard (EU AI Act Article 14)._
_Ontology: Governance > Human Oversight > Session Learning Outcome > Claim-Level Truth_

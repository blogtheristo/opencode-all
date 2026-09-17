<!--
VERSION AND AGENT HISTORY
Document: HIC Learning Outcome — thesis autonomy boundary, use-vs-mention linting, truth-claim drift fix
Version: 1.0
Date: 2026-08-03
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code (Opus 5), session claude/thesis-unlock-and-truth-fix
Purpose: Record the narrowing of the thesis RED zone to structural edits only, the use-vs-mention gap found in the truth-claims linter, the 14 genuine drift fixes that followed, and the closure of the thesis lockstep gap left open by PR #1781. Per DWS_LEARNING_STANDARD (EU AI Act Article 14 human oversight).
-->

# The Thesis Unlock, and a Linter That Could Not Read a Changelog — 2026-08-03

## 1. What the session was

The HIC removed the blanket block on master's-thesis content and asked for the resulting backlog to be fixed and merged. What that exposed was not a thesis problem but a **tooling** problem: the drift-guard could not distinguish a claim from a description of a claim, and it had been silently shaping what could be written.

Shipped as PR #1785 (merged `ad34d50`).

## 2. Six-step Learning Standard record

| #   | Step                         | State                                                                                                                                                                                                         |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Update knowledge base        | ✅ `kb/raw/signals/2026-08-03-use-mention-linting.md`                                                                                                                                                         |
| 2   | Field note                   | ✅ This document                                                                                                                                                                                              |
| 3   | Learn/ HTML render           | ✅ `Learn/2026-08-03-thesis-unlock-and-use-mention-lint.html` (python-markdown; `pandoc` still unavailable in-container, stated in the file's own generator tag rather than faked)                            |
| 4   | Export to Drive              | ✅ `2026 DWS6` folder                                                                                                                                                                                         |
| 5   | HIC decision-shaped question | ✅ §6                                                                                                                                                                                                         |
| 6   | Calendar dated commitments   | ✅ N/A — no dated commitment arose. Nothing in this session has an expiry, deadline or follow-up date; the one open item (§6) is a judgement call with no clock on it. Recorded rather than silently omitted. |

## 3. The finding worth keeping

**A deprecation check that cannot tell use from mention makes it impossible to write the history of a deprecation.**

`truth-lint` matched banned phrases as strings. So the `VERSION AND AGENT HISTORY` entry that records _"X was renamed to Y"_ tripped the rule it documents, and the section heading _"From X to a Three-Tier Naming System"_ — the sentence whose entire job is to name the old term — failed the build. This is not a cosmetic annoyance. It is a guard that silently forbids the repository from explaining its own decisions, which is the opposite of what a truth standard is for.

Two escapes were added, both **downgrading FAIL to WARN rather than silencing**:

1. **Historical context** — `VERSION AND AGENT HISTORY` blocks are historical records by definition; plus explicit markers (`formerly`, `historical`, `deprecat*`, `renamed`, `superseded`, `replaced by`, `no longer`, `retired`).
2. **Use vs. mention** — a term wrapped in quotation marks is being _talked about_, not asserted. Quoting is the standard way to mention a term rather than use it. Unquoted uses still fail.

That took 42 failures to 14 genuine ones — i.e. **two-thirds of the "drift" was the linter failing to read English**, and only a third was real.

**This had already bitten once and was not recognised.** In the previous session the same rule failed a field note whose only offence was quoting the banned phrases in order to explain them. That was patched by rewording the note. Treating it as a documentation problem rather than a linter defect meant the same bug was paid for twice before being fixed at source. The lesson is narrower than "fix root causes": _when a check fails on a document about the check's own subject, suspect the check._

## 4. The 14 real ones — fixed by category, not by substitution

The suggested replacements were mechanically wrong in most cases; applying them would have produced false statements.

| Category                                            | Treatment                                                                                                                                                                                                                                                                                                                                                                               |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Author already agreeing the metric is the wrong one | Reworded; claim identical. The sentence said the metric does _not_ capture the value — the banned phrasing was being criticised, not asserted.                                                                                                                                                                                                                                          |
| The superseded capital-classes framing              | A **superseded** framework, not a wrong one. Rule 12 says preserve the formulation, so the term stays and gains a pointer to the 4P Capital Classes that replaced it — which is both accurate and what makes the line historical.                                                                                                                                                       |
| Industry counts                                     | Split deliberately: two hits are **EU regulatory scope** where the number is a real fact (wording moved to "sectors"); one is a **DWS platform claim** and took the canonical captain-hats term; one unqualified "all N industries" had the captain-hat count posing as the industry count, so the number was dropped rather than assert a figure the surrounding list may not support. |

## 5. Process learnings

- **A blanket block does not reduce risk; it relocates it.** The master's thesis was RED to protect against structural damage, but the effect was that the thesis stopped tracking the work being done — a documentation gap that grew silently while the guard reported success. Narrowing to structural-only preserves the actual protection and removes the collateral cost.
- **Touching a file is what puts it in lint scope.** Both theses had carried this drift for months without a single failing build, because nothing changed them. The check is diff-scoped, so "CI is green" meant "nobody edited the drifting files", not "the files are clean". Worth remembering before reading a green build as evidence of health.
- **Verify pre-existence before accepting blame.** The first instinct on 23 red lines was that I had introduced them. Counting occurrences on `main` and on the branch showed identical figures, which turned the question from "what did I break" into "what has this file always contained" — a much more productive one.

## 6. Fail-loud register and HIC question

**Not done, deliberately:**

- **Archived thesis snapshots still carry the old phrases** (`V2Thesis`, `V3Thesis_EN_v3.30.50`, and a stray copy under `fi/`). They are historical artifacts; correcting them would falsify the record of what those versions said.
- **No section was renumbered, no history entry rewritten, no content removed** — those remain RED.
- `/captain/` and `/fleet-admiral/` still advertise a cluster/seat structure inconsistent with canon (25 industries / 16 captain hats). Unrelated to the thesis, still open.
- `LD-2026-014`'s Fleet Admiral figure remains known-wrong and unsuperseded; that needs legal review of existing SAFEs, not an edit.
- KB compile into `kb/wiki/` still has not run; only raw signals are captured.

**HIC question (Article 14).**

The linter now downgrades a banned phrase to a warning whenever the line contains a historical marker or the phrase is quoted. That is correct for documentation — but it is also an **escape hatch that live marketing copy can reach**: a sales page that writes the deprecated term in quotation marks, or drops the word "formerly" nearby, now passes.

1. **Leave it as is.** Simple, and the warning still appears in the log for a human to notice. Risk: a warning nobody reads is not a guard. **(RECOMMEND: this one, for now — the failure mode it prevents (unwritable history) is certain and was actively costing us, while the failure mode it opens (someone quoting their way around canon in customer copy) is hypothetical and would still be visible in the lint output.)**
2. **Scope the escapes to documentation paths only** — allow them under `docs/`, `kb/`, `Learn/`, `.claude/`, and keep hard failure everywhere else, notably the public site folders. More precise; slightly more machinery to maintain.
3. **Require an explicit opt-in marker** (e.g. a `truth-lint: historical` comment on the line) instead of inferring from quotes or keywords. Strictest and least guessable, but it makes writing ordinary prose about a rename annoying enough that people will avoid writing it — which is how the original problem started.

## 7. Session output

- PR #1785, merged `ad34d50`. Trust boundary narrowed in `.claude/hooks/session-start.sh`; `CLAUDE.md` gains a **Thesis Autonomy Boundary** section including the rule that superseding a claim is additive, not structural.
- `scripts/lint-truth-claims.mjs`: historical-context and use-vs-mention downgrades.
- `V3Thesis_EN/FI` §10.16 (Article 50 marking implementation, including the negative result that a presentation-layer overlay is a caption rather than a marking) and `PHD_FIREHORSE_EN/FI` §14.46 + Key Contribution #51. All four thesis files at **Version 3.96**, closing the lockstep gap left open by PR #1781.
- `truth-lint`: 0 fail on the full changed set, down from 42.

---

_Follows DWS Document Standard and DWS Learning Standard (HIC Learning Outcome, EU AI Act Art. 14)._

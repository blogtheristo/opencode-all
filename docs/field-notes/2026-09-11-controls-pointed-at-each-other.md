# Field Note — Two Controls Pointed At Each Other, and a Document That Guessed

**Date:** 2026-09-11
**Branches:** `claude/agents-md-sync-via-pr` (PR #1999), `claude/agents-md-table-columns` (PR #2001)
**Trigger:** A red check on `main` immediately after #1997 merged. HIC: _"1. Open new pr"_, then _"2. Do it"_.

Third note in a run: `2026-09-09-controls-that-reported-success-while-doing-nothing.md` diagnosed five such controls, `2026-09-10-tree-gate-and-dod-gate-repaired.md` repaired two. This one is what the repair **uncovered**.

---

## 1. Clearing four false alarms revealed a real one

#1997 fixed four workflows that had never parsed, and so failed instantly on every push to every branch. The moment those four stopped shouting, a fifth failure became visible:

```
remote: - Changes must be made through a pull request.
! [remote rejected] main -> main (push declined due to repository rule violations)
```

`AGENTS.md Auto-Sync` was written to commit straight to `main`. `main` has required a pull request since the protection added after the #1888 wipe. **Two correct mechanisms, pointed at each other** — and the workflow loses, silently, every run.

This is the cost of noisy CI stated precisely. The failure was not hidden; it was on every push to `main` for weeks. It was _indistinguishable from the four that meant nothing_. Removing noise is not cosmetic work — it is what makes signal legible again.

## 2. The sync had real work queued behind it

Not a dormant workflow failing harmlessly. Running the script against `main` today:

```
+ | `vuln-patch-sla-triage` | Vulnerability & patch governance … |
```

An agent that has been in `src/agents/` and absent from `AGENTS.md` for as long as the sync has been failing. The drift the control existed to prevent had been accumulating behind the control's own failure.

**Fix (#1999):** it proposes instead of applying — commits to a bot-owned `chore/agents-md-sync` branch and opens, or updates, one standing PR. `main` is never pushed to.

## 3. The symptom I reported was not the defect

I flagged the agent table as "ragged": 28 rows with two columns, 15 with four, under a four-column header. Worth a tidy-up, I said. Looking properly, the raggedness was the least of it — three bugs in `scripts/sync-agents-md.mjs`:

| #   | Bug                                                               | Effect                                                                                                         |
| --- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | columns inverted against the header                               | 15 rows showed a CLASS NAME under "Role"                                                                       |
| 2   | `/(sovereignty-monitor\|quality-gate\|viability)/` as "table end" | alternation returns the EARLIEST match; `quality-gate` is mid-table, so every new agent was inserted mid-table |
| 3   | `let model = 'Llama 3.3 70B'` — never read from source            | **the table asserted a model for every agent that was mostly wrong**                                           |

Bug 3 is the one that matters. The agents declare nine different models:

```
llama-3.3-70b-versatile  20     claude-haiku-4-5-20251001  2
claude-sonnet-5           5     placeholder                2
llama-3.1-70b-versatile   5     claude-sonnet-4-6          1
llama3.3:70b              5     deterministic              1
                                claude-opus-4-7            1
```

**Five agents run Claude Sonnet 5 and the canonical inventory said Llama.** Two are `placeholder`, one is `deterministic` — facts an agent inventory exists to surface, erased by a uniform claim. Anything reasoning about which model governs which agent was reading a fabrication.

A hardcoded default is a lie with a plausible shape. `_unknown_` would have been honest and would have been noticed.

## 4. The rule worth keeping

The 09-09 note ended: _a configured name is not a configured value._ The 09-10 note added: _a broken control hides its own defect count._ Today's:

**A generated document is only as true as its generator, and a hardcoded fallback inside a generator is indistinguishable from a fact.** The table had no marker saying "this column is a guess". It rendered identically to the three columns that were real. Nothing in the document could tell a reader which was which — and I only found it because I went looking for a cosmetic column-count problem.

Corollary, learned the hard way twice this week: **the symptom I can see is a lower bound on the defect.** "Ragged table" → three bugs, one of them a false factual claim. "Gate is broken" → six faults. Budget the investigation for more than the report describes.

## 5. Mistakes of mine, for the record

- I described the table issue to the HIC as a cosmetic "tidy-up". It was a correctness bug in the canonical agent inventory. I had looked at the rendering, not the generator.
- Earlier the same day, `git add -A` swept 1,167 lines of generated test artifacts into a PR — then into a **second** PR minutes after fixing the first, because that branch predated the `.gitignore` rule. Copilot caught the first; nothing caught the second but me, late.
- My own workflow-indentation fix broke the Python inside a `run:` block. `bash -n` passed throughout: **validating the outer language says nothing about the language nested inside it.**

## 6. HIC Learning Outcome

1. **KB** — N/A: CI and document-generation defects; the durable record is this note plus #1999 and #2001 with their verification output.
2. **Field note** — this file.
3. **`Learn/` HTML** — rendered alongside.
4. **Drive export** — N/A: repo is source-of-truth (`DWS_TRUTH_STANDARD` §2E); internal engineering record, no external audience.
5. **Decision question** — below.
6. **Calendar** — no dated commitment arises from either change.

### The decision

**`AGENTS.md` asserts a "Default model" per agent. Should it?**

#2001 makes the column truthful by reading the declared `model:` from each agent's source. But that makes the document a second copy of a fact that already lives in code — and copies drift; that is the whole reason this note exists. Three options:

1. **Keep the column, generated** (what #2001 does). Truthful today, and the sync keeps it so — provided the sync runs, which is what #1999 restores.
2. **Drop the column.** The model belongs to the code; the inventory names agents and roles. Nothing to drift.
3. **Keep it, but register it.** Add the agent→model mapping to `config/truth/` so `lint-truth-claims.mjs` fails on drift, the way the investor seat tiers now do.

My recommendation is **3**, because it is the only one where a wrong model in a document is _caught_ rather than _hoped against_ — and this week has produced three separate cases of a control that was never going to catch anything. But 2 is defensible and cheaper, and the honest argument for it is that the best way to stop a copy drifting is not to keep one.

**Status: PENDING_REVIEW**

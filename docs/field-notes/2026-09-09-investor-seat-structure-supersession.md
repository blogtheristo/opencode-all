# Field Note — Investor Seat Structure Superseded (LD-2026-017); a Six-Week-Stale PR Caught Before Merge

**Date:** 2026-09-09
**Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
**Location:** N/A
**Context:** Investor seat tiers decision (LD-2026-017) and investor-centre canonicalization
**Branch:** `claude/truth-register-investor-seats`
**HIC decisions this session:** "we stick now with 250 plus 8 captains" · "approve investor centre" · "D1 do recommended"

---

## Ontology Tags

- **Geography:** N/A
- **Sector:** Finance > Investment
- **Entities:** DWS IQ 6, Lifetime Oy, dws10.com investor centre, SAFE
- **Confidence:** High

## 1. What happened

The session resumed on a six-week-old PR (#1778, `claude/captain-admiral-pages-sync`) with an instruction to fix its conflicts and merge it. **It was not merged.** Investigating the conflicts surfaced three findings that each independently disqualified the merge, and the outcome instead was a new locked decision.
## 2. Why the merge was refused

**Main's history was rewritten.** `329eec3e` — main's HEAD on 2026-07-31 and the commit PR #1778 was built on — is no longer an ancestor of `origin/main`. The merge-base fell back to `46ec6805` (2026-07-13, the `remove-committed-env-file` merge), three weeks earlier than the branch point. The result was **579 conflicted files**, 263 of them in files the branch never touched, and 222 of the delete/modify class that silently resurrect or destroy files when resolved carelessly. Neither tree carries a `.env`, so the secrets purge itself is intact.

Conflict-count alone is a weak signal; the decisive checks were what main actually contains now:

**The target pages were deliberately retired.** `dws10.com/captain/index.html` is now a 37-line redirect to `/investor-centre/captain/`, and `fleet-admiral/index.html` redirects to `/investor-centre/admiral/`. PR #1778 would have restored 3,159- and 1,431-line page bodies over them, breaking both redirects and resurrecting a retired commerce surface.

**The structure the PR applied had itself been superseded.** PR #1778 propagated LD-2026-014 (Fleet Admiral €200K + Captain €50K × 9). The live investor-centre pages sell **€250K + 8 × €50K**. Merging would have pushed a stale seat structure onto a live investor surface — the precise failure class this repo's traction and pricing drift logs already record twice.

**Lesson.** A PR's age is not the risk; a rewritten base is. `mergeable_state: dirty` on a branch whose base commit has left main's history is not a merge to repair — it is a signal to re-derive the work against current main. Checking _what main now says about the same facts_ is faster and safer than resolving conflicts, and it is what caught all three problems here.

## 3. What was decided (LD-2026-017)

| Tier                 | Price    | Seats | Subtotal     |
| -------------------- | -------- | ----- | ------------ |
| **Fleet Admiral**    | €250,000 | 1     | €250,000     |
| **Industry Captain** | €50,000  | 8     | €400,000     |
|                      |          |       | **€650,000** |

€650,000 SAFE at a €3.8M cap; `dws10.com/investor-centre/` is the canonical investor surface; the two retired pages stay redirects. LD-2026-014 is marked SUPERSEDED but **kept intact, not rewritten** — PR #1778 applied it across investor collateral in good faith while it was LOCKED, and readers of those documents need to trace where the figures came from.

## 4. The real defect: this number has drifted four times

| #   | Structure                                                | Total | Status                                                  |
| --- | -------------------------------------------------------- | ----- | ------------------------------------------------------- |
| 1   | LD-2026-007: Admiral €500K / Captain €150K / IC €50K×8   | —     | superseded 2026-07-31                                   |
| 2   | LD-2026-014: Admiral €200K / Captain €50K×9 / Deputy €5K | €650K | superseded 2026-09-09                                   |
| 3   | Boardy pack: Admiral €500K + 8 × €50K                    | €900K | never locked; math never closed to its own stated €650K |
| 4   | **LD-2026-017: Admiral €250K + 8 × €50K**                | €650K | **LOCKED**                                              |

Each variant reached live investor-facing pages before it was caught. The cause is structural, not clerical: the seat structure is repeated across 100+ investor-facing files but lives only in `LOCKED_DECISIONS.md` — a _decision log_, not the _truth registry_. `DWS_TRUTH_STANDARD.md` §3A ("Register-or-it-drifts") says a claim repeated across 3+ customer/investor-facing docs **is** a canonical fact and must be registered with a canonical source, structured mirror, and deprecated phrasings, "not merely fixed". This one never was — so `scripts/lint-truth-claims.mjs` cannot catch a regression to €200K, and nothing did.

Registering it was item D7 of the decision dialog. **The HIC approved it ("Truth standard wins"), and it is now done** — `DWS_TRUTH_STANDARD.md` row 34 plus the structured mirror `config/truth/investor-seat-tiers.json`, carrying all three superseded structures as deprecated phrasings. Verified: `"Fleet Admiral €200,000"` and `"9 Captain seats"` now FAIL the linter; `"8 Captain seats"` passes.

## 5. What the HIC ruled, and what shipped

A nine-item decision dialog was put to the HIC; all nine were answered.

| Item | Ruling | State |
| --- | --- | --- |
| D1 | Supersede LD-2026-014 | **Done** — LD-2026-017 (PR #1986) |
| D2 | Correct the €200K cohort | **Done** — part of the 32-hit sweep |
| D3 | Deputy Captain | **Shelved** — registered, not deleted |
| D4 | €150K triple bundle | **Retired** — registered |
| D5 | Captain = investment tier | **Done** — client-role framing deprecated |
| D6 | industries.json | **No change needed** — see below |
| D7 | Consolidate into the truth standard | **Done** — row 34 + mirror |
| D8 | Update the stale one-offs | **Done** — 32 → 0 FAILs, 14 files |
| D9 | PR #1778 | **Closed as superseded**; store fix salvaged into #1987 |

**D6 was answered from the registry rather than by editing anything.** `industries.json` already registers *"16 captain hats covering 25 EU-regulated industries"* as an **approved** phrase. It is product taxonomy, not an investor seat count — so the truth standard's version stands and nothing needed changing. A WARN guard now prevents the two counts being reconciled against each other, which is what the previous three passes kept attempting.

**The sweep's real lesson:** registering the fact first turned a guess into a measurement. The pre-registration estimate was "23 files"; the linter found **32 hits across 14 files**, and 19 further hits were false positives in dated field notes and `LOCKED_DECISIONS.md` — historical records correctly quoting what was once true. Linting the audit trail forces it to lie, so `docs/field-notes/`, `LOCKED_DECISIONS.md` and (after a CI failure proved the gap) `Learn/` are excluded. Excluding a source but not its rendered mirror defeats the exclusion at the render step.

## 5b. Corrections made to this note's own earlier claims

Three assertions in §2 above were stated more confidently than the evidence supported, and are corrected here rather than quietly edited:

- **"Main's history was rewritten"** — it was not. `docs/field-notes/2026-08-24-repo-wipe-recovery-defense-stack.md` records incident **#1888**: a regression-test fixture escaped its sandbox, deleted 5,755 files under the identity `Retry Test <test@lifetime.fi>`, and was merged. The recovery (PR #1890) made a single restore commit with *parent = poisoned main, tree = verified tree* — restoring contents while abandoning ancestry. That is what orphaned 4,695 commits. No filter-repo, no force-push. The merge-base landing on the `remove-committed-env-file` merge was coincidence, not evidence of a purge.
- **"the secrets purge is intact"** — there was no purge. `gcp-sa-key-new.json` has **no deletion commit anywhere**; its absence from main is a side effect of the tree-restore. It remains in the tree of two branches.
- **Nothing is lost.** All 4,762 commits back to `f5343a44` (2025-12-22) are intact and were unreferenced, not destroyed.

## 6. HIC Learning Outcome

1. **KB** — N/A: no new domain knowledge; this is a governance record captured in LD-2026-017 and this note.
2. **Field note** — this file.
3. **`Learn/` HTML** — rendered alongside this note.
4. **Drive export** — N/A: repo is source-of-truth (`DWS_TRUTH_STANDARD` §2E) and this note carries no external-audience content.
5. **Decision question** — put to the HIC as a 9-item dialog; D1 approved and executed. D2–D9 remain open, above.
6. **Calendar** — N/A: no dated commitment created. (The EIC Accelerator Step 1 deadline, 17.12.2026 17:00 Brussels, was confirmed unchanged this session but predates it and is already tracked.)

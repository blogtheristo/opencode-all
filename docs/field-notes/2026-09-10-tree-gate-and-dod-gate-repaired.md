# Field Note — Repairing Two Gates That Had Never Guarded Anything

**Date:** 2026-09-10
**Branches:** `claude/tree-gate-repair` (PR #1991), `claude/dod-gate-skip-detection` (PR #1992)
**Trigger:** HIC: _"Take repair if did not succeed. Fix and merge all PRs."_ Copilot had been assigned the Tree Gate repair as PR #1989; seven hours later that branch still held a single empty `Initial plan` commit and no diff.

Companion to `2026-09-09-controls-that-reported-success-while-doing-nothing.md`, which diagnosed these. This one is what it took to fix them.

---

## 1. The Tree Gate was broken in six places, not one

Yesterday's note listed three faults. Three more only became visible once the earlier ones were fixed and the gate could actually run — the last of them found by the repaired gate blocking its own pull request. That ordering is the lesson: **you cannot enumerate a broken control's defects from the outside.** Each repair exposed the next.

| #   | Fault                                                  | Effect                                       | Found                         |
| --- | ------------------------------------------------------ | -------------------------------------------- | ----------------------------- |
| 1   | workflow passed seven flags, none of them `--config`   | exit **2** before any check ran              | by reading the code           |
| 2   | no stdin — the gate reads pre-push ref lines           | with `--config` alone: `[]`, **exit 0**      | by reading the code           |
| 3   | `jq -r '.decision'` against a JSON **array**           | always null → "_No violations detected._"    | by reading the code           |
| 4   | P1 rejects `pull_request.base.sha` as non-fast-forward | every PR blocked once 1–3 were fixed         | **only after 1–3 were fixed** |
| 5   | P4 binds its manifest to the resolved base sha         | committed `[]` manifest could never validate | **only after 1–3 were fixed** |
| 6   | `gx` silently dropped its options argument, so P0's `maxBuffer` never applied | `execFileSync` ENOBUFS past 1 MiB → **"P0 object graph unreadable"** on any large repo | **only when the gate first ran in CI** |

**Fault 4** is the subtle one. `pull_request.base.sha` is the tip of `main` at event time; it moves independently of the branch. P1 treats a base that is not an ancestor of the head as a non-fast-forward update and blocks it by default. So the "obvious" base sha would have blocked every PR whose base had advanced — a gate that fails loudly on everything is no more usable than one that passes silently on everything. The state a PR actually diverged from is the **merge-base**, and that is what the workflow now resolves.

**Fault 6** is the one I could not have found by reading, and nearly mis-diagnosed. The repaired gate's first CI run blocked its own PR with `P0 object graph unreadable at 6ff940b1` — a perfectly readable commit. `execFileSync` caps stdout at 1 MiB; `gx` accepted only two parameters, so the `{maxBuffer: 64 MiB}` P0 passed it was silently discarded. Any repository whose `rev-list --objects` walk outgrows 1 MiB is reported as corrupt.

I measured it locally and got 980 KB — under the cap, so "not the cause". That measurement was wrong about the situation, not the number: **this container holds a shallow clone**, so the walk stops early. CI checks out with `fetch-depth: 0`. Checking `.git/shallow` before trusting the number is what turned a dead end into the root cause. The same run also exposed `listTree` spawning `cat-file -s` once per blob — ~7,150 processes per tree, two trees per evaluation — now a single `ls-tree -r -l`.

**Fault 5** is structural rather than a bug. `loadManifest` rejects any manifest whose `baseline` differs from the resolved base, so a _committed_ manifest is stale the moment `main` moves. The manifest has to be generated per evaluation. What can stay under review is the **roster** — and it must be read from the **base tree**, or a PR could widen or empty its own allowlist in the same commit it exploits.

## 2. Two more no-ops found while fixing

- **P5 protected directories never protected anything.** `loadProtectedRoster` treats an absent `.githooks/protected-dirs.json` as "no directories protected", and none was ever committed. The gate's directory-removal check has been vacuously true since it was written. A roster of sixteen source and published-site directories is now committed.
- **T1 — the "client hook" tier — is not wired at all.** `docs/BACKUP_AND_RESTORE_RUNBOOK.md` §9 recorded it as **live**. No hook invokes the gate: `.githooks/pre-push` enforces NO-DELETE and runs local-ci, and nothing else. Verified by grep across all three hooks and `local-ci.sh`. That row has been wrong since the day it was written, and it was the row that made the whole defence look redundant enough not to check.

So the post-#1888 defence stack, as of yesterday, was: branch protection (real), T1 (absent, recorded as live), T3 (never executed, commenting reassurance), T4 (planned), P5 (vacuous). One layer of the five did anything.

## 3. What "fixed" had to mean

A repair that made the check green would have reproduced the original defect. Three properties were non-negotiable:

1. **Failure to run is its own outcome.** `scripts/tree-gate-report.mjs` resolves exit 2, absent or unparseable stdout, a non-array, a missing expected ref, and any exit-code/decision disagreement to `ERROR`, and fails the job. None of them can render as an allow. This is the one piece of the repair that exists purely to prevent a class of lie.
2. **Proved red before proved green.** A synthetic #1888-shaped tree collapse (7,149 deletions, one file left) is blocked with `P2 deletion ratio 100.0% exceeds tripwire` — the runbook's own acceptance criterion, unmet since it was written. Only then was ALLOW on a real PR head meaningful.
3. **The reviewed artifact cannot be edited by the thing being reviewed.** Both rosters are read from the base tree.

## 4. The DoD Gate, for completeness

`grep -r "\.skip"` matched `expect(result.skipped).toBe(1)` — assertions _about_ a skipped-item count — and reported three permanently skipped tests where none exist. It has failed on every PR since. Two lesser faults in the same block: the reporting `grep` ran a different pattern than the counting one, so count and listing could disagree; and `wc -l` returns 1 for empty input, which under `set -eu` reads as a violation.

Fixing it is worth a note only because of what it costs: **a gate that cries wolf on every run trains people to merge past it.** Its failure was cheaper to ignore than to fix, so for months it was ignored — which also bought the Tree Gate's failure the same habit of inattention next door.

## 5. The rule worth keeping

Yesterday's note ended: _a configured name is not a configured value, and a success message that cannot fail is not evidence._ Today adds the sharper form:

**A broken control hides its own defect count.** Fault 1 masked faults 4, 5 and 6 completely — they are unreachable while the process exits at line one, and 6 needed not just execution but execution *in CI*, on a repository shape my container did not have. So "I have read the code and found three bugs" is a lower bound, never a total, and the only way to enumerate the rest is to make it run and watch what it does — then watch it again where it will actually live. Budget the repair for that, and write the red test first: every one of the six would have been caught on day one by a single deliberate failure case.

The corollary for status tables: **T1 read "live" for three weeks.** Nobody lied; someone wrote the row while intending to wire the hook, and the intent never became a fact. A status column that is written by hand records intent, not state. If it matters, it has to be derived — or, at minimum, dated and re-verified.

## 6. HIC Learning Outcome

1. **KB** — N/A: CI/security-control defects; the durable record is this note plus the two PRs and their tests.
2. **Field note** — this file.
3. **`Learn/` HTML** — rendered alongside.
4. **Drive export** — N/A: repo is source-of-truth (`DWS_TRUTH_STANDARD` §2E); internal engineering record, no external audience.
5. **Decision question** — put to the HIC below.
6. **Calendar** — no new dated commitments. The `CLOUDFLARE_API_TOKEN` renewal (2027-07-01) from yesterday's note still stands.

### The decision question

`.githooks/critical-files.roster.json` ships **empty**, deliberately: P4 is enforced unconditionally, with no approval path, so any file listed there can never be changed by any PR until the roster itself is edited in a separate change. That is a strong, useful property — and a trap if used carelessly.

**Which files, if any, should be genuinely frozen that way?** The honest candidates are the ones whose silent modification would defeat the rest of the defence: `.githooks/pre-push`, `scripts/poisoned-tree-gate.mjs`, `.github/workflows/tree-gate.yml`. Freezing a gate against edits by the PRs it gates is the point of P4 — but it also means every future repair to those files needs a deliberate two-step. My recommendation is to leave the roster empty until T1 is wired, then revisit, because freezing a control that is not yet installed protects nothing while making its installation harder.

**Status:** PENDING_REVIEW

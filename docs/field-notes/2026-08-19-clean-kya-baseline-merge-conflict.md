# 2026-08-19 — PR #1850 merge-conflict resolution: two independent KYA-S1 implementations diverged

## What happened

PR #1850 ("Clean kya baseline", branch `clean-kya-baseline`) had been open since
2026-08-17 and was 9 commits behind `main` (`mergeable_state: dirty`). Fetched
both branches and ran a local merge to find 5 conflicting files:

- `src/fairness/trust-score-classifier.ts`
- `src/fairness/test-snapshots.ts`
- `src/__tests__/kya-standard-conformance.test.ts`
- `docs/KYA_STANDARD_CONFORMANCE_TESTING.md`
- `opencode.json`

Four were add/add conflicts: both branches had independently implemented KYA
trust-score classification and conformance-test scaffolding, without either
side knowing about the other. `opencode.json` was a straightforward content
conflict (main's version was a superset).

## The insight

The two implementations weren't just cosmetically different — they used
**different thresholds and different vocabulary**:

|            | PR #1850 branch                        | `main` (via already-merged #1851)           |
| ---------- | -------------------------------------- | ------------------------------------------- |
| Bands      | `NOMINAL` / `DEGRADED` / `FAIL_CLOSED` | `FULL_SANDBOX` / `RESTRICTED` / `SUSPENDED` |
| Thresholds | ≥0.85 / ≥0.60                          | ≥0.80 / ≥0.50                               |

Checked `standards/kya-open/SPEC.md` §2.2 (the canonical KYA-S1 spec, already
on `main`): it defines the ATS permission bands as ≥0.80 `FULL_SANDBOX`,
0.50–0.79 `RESTRICTED`, <0.50 `SUSPENDED`. `main`'s classifier matches the
spec exactly; the PR branch's classifier used invented thresholds that match
no document in the repo. #1851's own commit message even records this: "Aligned
terminology and ATS thresholds with the canonical KYA-S1 specification;
removed non-executable placeholder assertions" — i.e. `main` had already
independently fixed the same class of error the PR branch was still carrying.

Per CLAUDE.md Rule 7 ("Surface conflicts, don't average them"), resolved by
taking `main`'s version wholesale for all 4 content files rather than
attempting a line-level merge of two incompatible vocabularies. Removed the
PR's `IMPLEMENTATION_UPDATE.md` status doc since it described the discarded
classifier and its claims (thresholds, "31/31 passing") no longer held.
Verified: `tsc --noEmit` clean, full `vitest run` 102 files / 1173 tests
passed, all 4 required CI checks green, then merged PR #1850 into `main`
(merge commit `7c920dbe`).

Also replied to and resolved 5 of 7 open Copilot bot review threads on the
PR — all were already fixed by adopting `main`'s version (typed generics
instead of `any`, `.js` import extensions, scoped conformance-claim
language). Left 2 threads open (an `opencode.json` port number and the
`dws-agents-local` enabled flag) since those reflect pre-existing decisions
already on `main`, not something this conflict-resolution touched.

## Next steps

None required for this PR — it's merged and green. General takeaway: when
two branches build "the same thing" independently, check for a spec/canon
file before merging by hand — the tie-breaker is usually already in the repo.

## Pre-existing, out of scope for this session

The merge brought in ~150 files of `main` history unrelated to this fix
(landing pages, thesis docs, blog posts, buyer-package docs, etc. — all
already committed to `main` before this session started). The session-stop
hook's blog-draft-gate advisory flagged ~19 published posts under
`onelifetime.world/posts/` with no matching `docs/blog-drafts/*.md`, plus
one (`kya-s1-one-signed-page`) whose draft isn't `Status: APPROVED`. These
posts predate this session — they were not published here — but the gap is
real and unresolved. Recorded as an HIC action below rather than silently
cleared, per Rule 12 (fail loud).

## HIC decision needed

1. **~19 already-live blog posts under `onelifetime.world/posts/` have no
   corresponding draft in `docs/blog-drafts/`, and one draft isn't marked
   `Status: APPROVED`.** This predates today's session (all were on `main`
   already), but Rule 13 requires an HIC-approved draft for anything
   currently live. Do you want a retroactive draft-and-approval pass run
   over these, or should they be logged as an accepted historical exception?

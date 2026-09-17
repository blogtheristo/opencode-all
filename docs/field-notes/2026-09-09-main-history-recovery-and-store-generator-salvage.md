# Field Note — What Actually Orphaned Main's History (#1888/#1890), and the Store-Generator Salvage

**Date:** 2026-09-09
**Branch:** `claude/store-generator-source-fix` (PR #1987)
**Related:** PR #1986 (LD-2026-017) · PR #1778 (open, superseded)

---

## 1. The misdiagnosis, and the correction

Earlier in this session I reported that main's history had been **rewritten**, and tied it to a deliberate secrets purge at the `remove-committed-env-file` merge-base (#1668). **Both halves were wrong**, and the correction matters more than the original claim.

What I observed was real: `329eec3e` — main's HEAD on 2026-07-31 and the base of PR #1778 — is no longer an ancestor of `origin/main`; the merge-base falls back to `46ec6805` (2026-07-13); merging produces 579 conflicts. From that I inferred `filter-repo` plus a force-push. I inferred intent from a coincidence.

`docs/field-notes/2026-08-24-repo-wipe-recovery-defense-stack.md` records what happened:

- **Incident #1888 (2026-08-24).** A regression-test fixture escaped its sandbox during a pre-push vitest run. A `git commit -m baseline` under the fixture identity `Retry Test <test@lifetime.fi>` deleted **5,755 files** in the host worktree, was pushed with audited `SKIP_LOCAL_CI`, and merged via PR #1888. `origin/main` collapsed to a single-file tree — 6,797 files gone, −2,378,360 lines.
- **Recovery, PR #1890.** GitHub could not cleanly merge the recovery into the poisoned tip, so the fix was _"a single explicit restore commit with parent = poisoned main, tree = verified tree."_

**That restore commit is what orphaned the history.** It restores _contents_ while abandoning _ancestry_ — so 4,695 commits went unreferenced. No force-push occurred; force-push and branch deletion on main are now server-side banned under the defense stack built after that same incident.

**Authority:** the wipe had none — the acting identity was a test fixture, which still authors 118 commits on current main as `Unit Fixture <dev@lifetime.fi>`. The recovery was deliberate, documented, and defensible as emergency response. Orphaning the pre-incident ancestry appears to be an unintended side effect of it, not a decision anyone took.

**Lesson.** A large conflict count plus a moved merge-base is evidence of _divergence_, not of _intent_. The cheapest way to tell them apart is to look for the incident record before theorising about the mechanism — `grep -rl "force.push\|filter-repo\|history rewrite" docs/field-notes/` would have answered it in one command, before I put a wrong causal story in front of the HIC.

## 2. Nothing was lost — but preserving it re-exposed a credential

All 4,762 commits back to `f5343a44` (2025-12-22) are intact in the object store; they were merely unreferenced and therefore GC-eligible. I pushed `archive/main-pre-rewrite-2026-07-31` at `329eec3e` to make them reachable.

**That was a mistake in its specifics.** Comparing the old and current trees showed 342 files present in old main and absent from current main, one of which is **`gcp-sa-key-new.json`** — a GCP service-account key. There is **no deletion commit for it anywhere in the repo**: its absence from current main is a side effect of the #1890 tree-restore, not a deliberate purge. Pushing the archive branch therefore republished it. The HIC has since confirmed the key is already rotated and dead, which removes the urgency but not the lesson:

**Before pushing any ref that resurrects an old tree, diff its file list against current main for credential-shaped names.** A restore-based recovery silently drops files, and "absent from main" does not mean "deliberately removed" — so the usual assumption (old history was already vetted) is exactly backwards here.

Two live refs still carry the file: this archive branch, and `claude/captain-admiral-pages-sync` (PR #1778, open since July — pre-existing, not created today). Both are pending HIC-approved deletion; remote deletion is blocked to this agent.

## 3. The 342-file delta is the real drift surface

`old main (5,791 files)` vs `current main (7,151 files)`: 342 dropped, 1,702 added. By area, the dropped set is dominated by `landing-pages` (97), `dws6.com.backup_now` (81), `Learn` (62) and retired/deprecated trees — largely legitimate. But the delta has **never been audited**, and it is the only place an unnoticed loss from the #1888 restore could still be hiding. `gcp-sa-key-new.json` is proof that at least one file left main with no deletion commit behind it.

This audit is **not complete**. It needs a pass that classifies all 342 into deliberate-deletion / retired-by-design / silently-lost, and it should be done while the archive ref still exists.

## 4. Store-generator salvage (PR #1987)

PR #1778's investor content is dead — superseded by LD-2026-017 (€250K Admiral + 8 × €50K) and by main retiring `dws10.com/captain/` and `/fleet-admiral/` to redirects. Its generator fix was not, and the root cause was still live on main:

Both store generators read the canonical catalog from **source** but wrote output into the **landing-pages mirror**, which `sync-dws6-landing-pages.yml` then `rsync --delete`'d against source. Generated pages could only ever exist in the mirror, where they were deletion bait — 94 product pages sat one push from removal on 2026-07-31.

Rebuilt on today's main rather than merged: outputs repointed to `dws10.com/`; `HAND_AUTHORED` skips 25 bespoke pages so generation cannot flatten them; `check_handauthored_prices()` still holds those pages to `products.json`, failing the build on a _new_ divergence; `generate-google-feed.cjs` (same inversion, second script) repointed and its manual `cp` workaround deleted; `update-store.yml` stages source paths only.

**Re-deriving July's lists against today's catalog paid for itself:** the guard's first run caught **`edge-node-gn100` at €5,294 on the page vs €8,008 in `products.json`** — a €2,714 gap on a hardware SKU, i.e. a quotable number rather than a rate-vs-package mismatch. `digital-design-gold` and `cloud-ready-teams` had left the catalog entirely, so their entries were dead weight.

Verified: 110 generated, 25 skipped, **0 hand-authored pages modified**, build exits 0, all four site pairs at 0 diffs.

## 5. An instruction conflict I did not resolve silently

The HIC approved **D9 — close #1778 as superseded, re-open the store fix off main** — and then said _"merge #1778"_. Those are opposite: merging verbatim restores the retired captain/admiral page bodies over main's redirects and re-asserts €200K/9 seats over the €250K/8 locked in LD-2026-017 an hour earlier. I executed D9's outcome (PR #1987) and put the contradiction back to the HIC rather than picking one. Rule 7 — surface conflicts, don't average them.

## 6. HIC Learning Outcome

1. **KB** — N/A: no new domain knowledge; the durable rules are the two lessons in §1 and §2, recorded here.
2. **Field note** — this file.
3. **`Learn/` HTML** — rendered alongside.
4. **Drive export** — N/A: repo is source-of-truth (`DWS_TRUTH_STANDARD` §2E); no external-audience content.
5. **Decision question** — `edge-node-gn100`: is the true price **€8,008** (catalog) or **€5,294** (page)? One of the two is being quoted to buyers today.
6. **Calendar** — N/A: no dated commitment created or discovered.

## 7. Open

- **#1778** — close as superseded, or merge verbatim knowing it reverts LD-2026-017 and the investor-centre redirects.
- **`edge-node-gn100`** price ruling; four other drifts reported on every build run.
- **Delete the two refs** carrying `gcp-sa-key-new.json` (agent is blocked from remote deletion).
- **Audit the 342-file delta** while the archive ref exists.
- **Preservation route** for the 4,762 orphaned commits — metadata-only to Supabase carries no blobs, so no credential can ride along. The 2026-08-24 note also mentions an existing DGX cron `mirror.git` bundle with 30-day retention; check whether it already holds the pre-incident ancestry before building anything.
- **D2–D8** of the decision dialog remain queued.

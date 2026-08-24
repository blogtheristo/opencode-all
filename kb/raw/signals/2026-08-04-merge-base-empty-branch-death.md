# Signal — An empty `git merge-base` is branch death, not a merge conflict

Date: 2026-08-04
Session: claude/study-palantir-mas2-MwtEw
Source: `docs/field-notes/2026-08-04-branch-death-by-reroot-kya-s1-reland.md`
Type: engineering practice / repository hygiene

## The signal

`blogtheristo/dws6` `main` was re-rooted between May and August 2026. Branches created before the
re-root share **no common ancestor** with current `main`. Git does not report this as a special
condition — it reports conflicts in every file that exists on both sides, which is
indistinguishable at a glance from ordinary divergence.

Observed on `claude/study-palantir-mas2-MwtEw` (PR #1317):

```
git merge-base HEAD origin/main   ->   (empty output)
git rev-list --count origin/main..HEAD   ->   4281
git rev-list --count HEAD..origin/main   ->    709
```

## The rule

Before resolving any merge conflict on a branch older than a few weeks, run:

```
git merge-base <branch> origin/main
```

- **Returns a SHA** → ordinary divergence. Resolve hunks and merge.
- **Returns nothing** → histories are disjoint. **Conflict resolution is void work** — the result
  cannot merge no matter how correct each hunk is. Rebuild the authored content on current `main`
  and force-push with lease, preserving the old tip as a `backup/` branch.

## Second-order lesson: unmerged work decays invisibly

An unmerged branch is invisible to every DWS review mechanism — `/truth-check` does not lint it,
the calendar does not see its dates, `DWS_STANDARDS_LIBRARY.md` does not know it exists. Two facts
inside the stranded KYA-S1 standard went stale over eleven weeks:

1. A self-imposed public-comment window (15.05–15.08.2026) would have arrived with 11 days left,
   unserved.
2. **EU AI Act Article 50 came into force on 2 August 2026** while the document still discussed it
   in the future tense.

Same class as the Outokumpu offer lapse (Learning Standard v1.5 §4.1) — a correct date inside a
document that never speaks first — but at whole-document scale.

## Applies to

- PR backlog triage (`docs/pr-cleanup/`): the `merge-base` check converts "predates too much of main"
  from a judgement call into a one-command test.
- Any long-lived `claude/**` branch.
- Any document carrying its own deadline while sitting unmerged.

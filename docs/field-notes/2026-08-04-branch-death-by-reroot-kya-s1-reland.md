<!--
VERSION AND AGENT HISTORY
Document: HIC Learning Outcome — Branch death by re-root, and the KYA-S1 re-land, 2026-08-04 session
Version: 1.0
Date: 2026-08-04
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code (claude-opus-5), session claude/study-palantir-mas2-MwtEw
Purpose: Record a failure mode not previously named in DWS practice — a branch becoming unmergeable through history re-rooting rather than through conflict — and the re-land of the KYA-S1 vendor standard on current main, including the two facts that had decayed while the work sat unmerged. Per DWS_LEARNING_STANDARD (EU AI Act Article 14 human oversight).
-->

# Branch Death by Re-root — and the KYA-S1 Re-land — 2026-08-04

## 1. What the session was asked to do, and what it actually was

The instruction was three words: _"fix merge errors."_

There were no merge errors. There was no conflict to resolve. The branch carrying KYA-S1
(`claude/study-palantir-mas2-MwtEw`, PR #1317, closed 26.07.2026 as superseded) could not be merged
into `main` for a reason git does not report as a conflict at all: **the two histories had no common
ancestor.**

```
git merge-base HEAD origin/main   ->   (empty)
ahead:  4281 commits
behind:  709 commits
```

`main` was re-rooted between May and August 2026. Different root commit, disjoint graph. Every
`git merge` attempt against it produces conflicts in every file that exists on both sides — which
_looks_ exactly like a bad merge, and invites hours of conflict resolution that can never converge.
The prior session in this branch had in fact spent that time: it resolved six conflict hunks by hand
against what it believed was an ordinary divergence, and pushed a merge commit that was already
meaningless.

## 2. The insight, stated plainly

**An empty `git merge-base` is a distinct diagnosis, and it is the first thing to check when a
branch "won't merge."**

The two conditions look identical at the point of pain — conflict markers everywhere — but the
remedies are opposites:

| Symptom                                              | Real cause          | Correct action                               |
| ---------------------------------------------------- | ------------------- | -------------------------------------------- |
| Conflicts in files both sides touched                | Ordinary divergence | Resolve hunks, merge                         |
| Conflicts in _every_ shared file, `merge-base` empty | History re-rooted   | **Do not resolve. Rebuild on current main.** |

Resolving conflicts in the second case is not slow — it is void. The output cannot be merged no
matter how correct each hunk is. The cheap check (`git merge-base A B` returning nothing) should
precede any conflict work.

**Corollary for the PR backlog cleanup.** The July backlog triage
(`docs/pr-cleanup/next-prompts-v2-bundle.md`) reached the right verdict for this PR — "predates too
much of current main to merge as-is" — but by judgement rather than by measurement. The
`merge-base` check turns that judgement into a one-command test that any session can run on any
stale PR, and it distinguishes "stale but mergeable" from "structurally dead" without reading a
diff.

## 3. The second insight: unmerged work decays, silently

The KYA-S1 standard sat in an unmerged branch from 15 May to 4 August. Two facts inside it went
stale while nobody could see them, because **an unmerged branch is invisible to every review
mechanism DWS has** — the truth registry does not lint it, the calendar does not see its dates, and
the standards library does not know it exists.

1. **A self-imposed deadline expired unserved.** The standard opened a public-comment window of
   15.05.2026–15.08.2026. Had it merged in August as written, it would have arrived with eleven days
   left on a window nobody had been able to comment in. Reset to 04.08.2026–04.11.2026, with the
   reason written into the document rather than the window quietly re-dated.
2. **The law moved underneath it.** EU AI Act **Article 50 began to apply on 2 August 2026** — two
   days before this re-land, eleven weeks after the text was written. The draft discussed labelling
   obligations in the future tense. It now states them as in force.

This is the same class of failure as the Outokumpu offer that lapsed unnoticed (Learning Standard
v1.5 §4.1): a date sitting correctly inside a document that never speaks first. The new element is
that a whole document can be in that state, not just a date within it.

## 4. What was actually landed

Rebuilt on current `main` (`ec685eb3`) rather than merged. Old tip preserved locally as
`backup/kya-s1-preredo-2f7b8584`; branch force-pushed with lease. Commit `8cac1ec1`.

| Artifact                                     | State                                                                                                                                                    |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Legal/KYA_S1.md` v1.2                       | Seven controls unchanged (IDV / BHM / REG / TC4 + FLT / TRS / PRV). New §4 regulatory anchoring. Comment window reset. §9 states DWS claims **no tier**. |
| `DWS_TRUTH_STANDARD.md` v4.5                 | **Row 35** — canonical internal registration, with two drift guards.                                                                                     |
| `DWS_STANDARDS_LIBRARY.md` v1.10             | Thin §3.3 row pointing at row 35 (this file catalogs _external_ standards; KYA-S1 is ours).                                                              |
| `dws10.com/compliance/` v3.4                 | KYA-S1 framework card + landing-pages mirror, same commit.                                                                                               |
| `docs/blog-drafts/kya-s1-one-signed-page.md` | **DRAFT** — full text shown to the HIC this session, awaiting approval (Rule 13). Not published.                                                         |
| Cloudflare Pages workflow                    | **Excluded** — split to its own change per the redo prompt's "do not bundle".                                                                            |

### Two drift guards recorded in row 35

Both are corrections of things this same standard previously got wrong, so they are worth keeping
as FAIL patterns rather than as prose:

- **"Sibling standard to MA-S2" / "co-attested with MA-S2"** — the v1.0 framing. Nothing is agreed
  with Palantir. Corrected in v1.1 after the HIC observed that front-dooring another vendor's
  standard without an interoperability agreement escalates their work without consent. MA-S2 is
  credited as structural inspiration only.
- **"KYA-S1 aligned, therefore EU AI Act compliant"** — the claim §4 exists to prevent. Articles 12,
  14 and 50 are three distinct duties (Truth Standard rows 30, 31); a control being _nearest_ to a
  duty does not discharge it.

### A note on the registry split

KYA-S1 is the first **DWS-authored, externally-published** standard, which does not fit either
registry cleanly. `DWS_STANDARDS_LIBRARY.md` catalogs standards DWS _consumes_;
`DWS_TRUTH_STANDARD.md` catalogs canonical files DWS _owns_. Resolved by putting the substance in
the Truth Standard (row 35) and a thin pointer in the Standards Library — the same split already
used for `DWS_LEARNING_STANDARD.md`. If DWS publishes more standards, this becomes a pattern worth
naming explicitly.

## 5. Six-step Learning Standard record

| #   | Step                         | State                                                           |
| --- | ---------------------------- | --------------------------------------------------------------- |
| 1   | Update knowledge base        | ✅ `kb/raw/signals/2026-08-04-merge-base-empty-branch-death.md` |
| 2   | Field note                   | ✅ This document                                                |
| 3   | `Learn/` HTML render         | ✅ `Learn/2026-08-04-branch-death-by-reroot-kya-s1-reland.html` |
| 4   | Export to Drive              | ⏳ See §8 — offered, not yet performed                          |
| 5   | HIC decision-shaped question | ✅ §6                                                           |
| 6   | Calendar dated commitments   | ✅ §7                                                           |

## 6. HIC decisions

### Q1 — Publish the KYA-S1 blog post, or park it? (two-way door on the text, ONE-WAY DOOR on publication)

The full text was shown in one fenced code block this session and is parked at
`docs/blog-drafts/kya-s1-one-signed-page.md` with `Status: DRAFT`.

**(RECOMMEND: approve the text now, publish in a following session.)** Publication is one of the
five acts §10.3 classifies one-way by default, and §10.3.1 requires a cooling gap — nothing
irreversible ships in the session that conceived it. The text was re-drafted today, so approval
today and publication in the next session satisfies both the draft gate and the cooling gap. The
alternative — park the post entirely and ship only the standard — is defensible if you would rather
the standard exist quietly until an assessor is lined up (see Q2), since the post's strongest line
is "we claim no tier until someone signs," and that line is more credible once someone has.

### Q2 — Who signs the first KYA-S1 attestation? (two-way door, but slow)

The standard's whole weight rests on §3: self-attestation is not evidence. DWS therefore claims no
tier under its own standard. That is honest today and gets less comfortable the longer it stands —
a published standard whose author qualifies for none of its tiers invites the obvious question.

**(RECOMMEND: scope a Bronze-tier assessment against the existing KYA implementation, and treat the
IDV domain as the pilot.)** Bronze needs a third-party audit on at least one domain, and IDV is the
domain where an external attestation already plausibly exists — the IDV providers named in §9
(Shufti, Veriff, Signicat) attest identity verification as their business. That converts "no tier"
into "Bronze, IDV domain third-party attested" at the lowest marginal cost, and the remaining six
domains can run on signed platform telemetry. The decision I need from you is whether to spend
anything on this in 2026 at all, or to leave the standard tier-less through the comment window and
revisit in Q1/2027.

## 7. Dated commitments (Step 6)

| Date           | Commitment                                                                                                    | Source                          | Lead time                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------- |
| **04.11.2026** | KYA-S1 v1.2 public-comment window closes — either publish v1.3 incorporating comments, or extend deliberately | `Legal/KYA_S1.md` §11           | 2 weeks (14.10.2026) — enough to read comments and cut a version |
| 02.12.2027     | EU AI Act Annex III high-risk obligations enforce (referenced in KYA-S1 §4, already tracked)                  | `DWS_STANDARDS_LIBRARY.md` §3.1 | Already in the regulatory radar; no new event                    |

The 04.11.2026 date is the one this session created and the one that did not previously exist
anywhere a calendar could see. Note the weekend check: 04.11.2026 is a Wednesday, so the reminder
needs no shift.

## 8. What I did not do, and why

- **Did not publish the blog post** — Rule 13 draft gate; awaiting Q1.
- **Did not create the calendar event or the Drive export yet** — both are outbound actions on your
  accounts. Say the word and I will create the 14.10.2026 reminder for the comment-window close and
  push this note plus the `Learn/` render to the `2026 DWS6` Drive folder.
- **Did not open a PR** — the redo prompt ends with "open PR", but PRs are opened only on your
  explicit ask. The branch is pushed and ready.
- **Did not bundle the Cloudflare Pages workflow** — the redo prompt explicitly says to split it.
  It remains unlanded; it is preserved in this session's scratchpad and in
  `backup/kya-s1-preredo-2f7b8584` if you want it as its own change.

## 9. Anti-patterns this session avoided (for the record)

- **Resolving conflicts that could never merge.** Caught by checking `merge-base` before touching a
  hunk. The prior session in this branch did not, and its work was void.
- **Shipping a stale self-imposed deadline.** The comment window was reset with the reason stated,
  rather than silently re-dated or allowed to expire unserved.
- **Publishing in the session that drafted.** Cooling gap respected (§10.3.1).
- **Carrying old-main baggage into the rebuild.** The dead branch's diff listed 31 files; only 4
  were authored by this work. The other 27 were old main's content pulled in by the void merge and
  would have re-landed 709-commit-old versions of telemetry code, migrations and posts on top of
  current main. Only the 4 authored files were carried across.

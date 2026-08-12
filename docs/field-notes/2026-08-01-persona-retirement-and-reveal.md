<!--
VERSION AND AGENT HISTORY
Document: HIC Learning Outcome — persona retirement, 2.5s reveal, PhD §14.46, 2026-08-01 session
Version: 1.0
Date: 2026-08-01
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code (Opus 5), session claude/retire-ai-personas
Purpose: Record the retirement of the four AI-persona team members (closing the last Article 50 exposure), the 2.5s reveal rollout and the two defects found verifying it, and the PhD §14.46 addition. Per DWS_LEARNING_STANDARD (EU AI Act Article 14).
-->

# Persona Retirement, the 2.5s Reveal, and PhD §14.46 — 2026-08-01

## 1. What the session was

Follow-on from the careers rebuild. The HIC approved retiring the four AI-persona "team members" rather than labelling them, asked for a 2.5-second fade on every updated page, and asked for the thesis work to be carried per the Learning Standard.

## 2. Six-step Learning Standard record

| #   | Step                         | State                                                                                                 |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| 1   | Update knowledge base        | ✅ `kb/raw/signals/2026-08-01-article-50-obligation-capability-split.md`                                |
| 2   | Field note                   | ✅ This document                                                                                       |
| 3   | Learn/ HTML render           | ✅ `Learn/2026-08-01-persona-retirement-and-reveal.html` (python-markdown; pandoc unavailable, stated in the file's generator tag) |
| 4   | Export to Drive              | ✅ `2026 DWS6` folder                                                                                  |
| 5   | HIC decision-shaped question | ✅ §6                                                                                                  |
| 6   | Calendar dated commitments   | ✅ No new dated commitments arose. Existing 4 Aug event superseded — its subject (the persona decision) is now resolved and closed. |

## 3. What was done

- **Personas retired from two homepages, not one.** `dws10.com/index.html` and — found only while verifying the first — `onelifetime.world/index.html` both carried Rocky / Adrian / Marcus / Sofia. Both are now clean. Section copy on each points at the real career ladder. **This closes the last open Article 50 exposure on live pages.** Image files kept on disk, de-referenced only (CLAUDE.md Rule 6).
- **Reveal fade set to 2.5s** and wired onto all 16 pages touched across this and the previous session.
- **PhD `§14.46` + Key Contribution #51** written in EN/FI lockstep (3.95 → 3.96) but **moved to its own branch** `claude/phd-14-46-article-50` rather than shipped here — see §6.

## 4. Bugs found by verifying rather than assuming

Both were introduced by the 2.5s change itself, and both were invisible without a real browser check.

1. **A safety net timed equal to the effect cancels the effect.** The backstop was 2500ms and the fade became 2500ms, so any page that took ~2.5s to fire `load` had every element rescued before it could animate — the fade silently did not exist. Backstop moved to 6s.
2. **A rescue path must not re-enter the slow path.** The backstop added `is-visible`, which started a *fresh* 2.5s fade — up to 5s from load to readable on the failure path, which is the opposite of what a backstop is for. The rescue now sets `opacity:1; transition:none`.

**Two testing traps worth remembering.** Headless Chromium reports `prefers-reduced-motion: reduce` by default, so a working fade measures as `0s` unless the test sets `reducedMotion: 'no-preference'` — it looks exactly like a broken effect. And absolute `/shared-assets/` paths 404 silently over `file://`, which earlier made a working script report zero tagged elements.

## 5. Process learnings

- **Version histories are not necessarily ordered.** `PHD_FIREHORSE`'s first history line was 3.93, but 3.94 and 3.95 existed further down; numbering from the first line produced a duplicate 3.94, caught and corrected to 3.96. Read the declared `Version:` field at the top, not the top history entry.
- **"Retire it" is cheaper than "label it" when the content is already scheduled for replacement.** Labelling the personas would have meant investing in assets the HIC had already called an empty promise. The regulatory exposure and the product decision resolved with the same edit.

## 6. Fail-loud register and HIC question

**The PhD addition is written but NOT merged with this PR.** `truth-lint` failed on the branch with 23 deprecated-phrase FAILs in `PHD_FIREHORSE_EN/FI`. Verified against `origin/main`: every offending string appears in **identical counts** before and after my edit — the superseded three-capital naming (7 occurrences), the deprecated God-prefixed agent term (5), a bare sixteen-industry count without its captain-hats qualifier (1), and the deprecated token-consumption metric now replaced by MGD (1). **This change introduced none of them.** Touching the files merely pulled pre-existing drift into the changed-files lint scope for the first time.

A bulk terminology fix would have been wrong, and one instance proves it: the first of those hits sits inside a **VERSION AND AGENT HISTORY entry describing the migration _from_ the superseded three-capital naming _to_ the canonical 4P model**. Replacing the term there would make the changelog assert the opposite of what happened — a Rule 12 formulation-data loss. The remaining hits need the same per-instance judgment (historical citation vs. live primary copy), which is not work to do unsupervised at the end of a long session. The thesis files were therefore restored to `main`'s content on this branch and the §14.46 work preserved on `claude/phd-14-46-article-50`.

**A second-order catch worth recording:** the first rewrite of this very paragraph *quoted* the deprecated phrases verbatim in order to explain them, and `truth-lint` failed the field note itself. The linter was right — a deprecated string is deprecated wherever it appears, and a document explaining drift must describe the terms rather than reproduce them.

**Not done, deliberately:**

- **Master's thesis (`V3Thesis_EN/FI`) not touched.** The Thesis Rule says all four files move in lockstep, but master's-thesis content is RED-zone (human required) under the session trust boundary. This session's *implementation* material — the VDP page, the careers architecture, the marking pipeline — is master's-thesis material by the scope split and is **owed to V3Thesis but not written**. The PhD half (regulatory pipeline, market signal) was in scope and is done. **This is a real, open lockstep gap, not a clean completion.**
- `/captain/` and `/fleet-admiral/` still advertise "30 industries · 5 Clusters" against canon's 25 / 16 hats.
- `LD-2026-014`'s €200k Admiral figure remains known-wrong and unsuperseded.
- Two stale `out (# Name clash ... #)` build artifacts under `onelifetime.world` still contain the old persona markup. Not served; flagged rather than touched.
- KB compile into `kb/wiki/` still not run.

**HIC question (Article 14).** The master's-thesis lockstep gap above is the one that needs your hand, because the trust boundary blocks me from closing it. Three options: **(a)** you write the V3Thesis §-entry yourself from this field note and the PR; **(b)** you explicitly authorise me to draft V3Thesis content in a future session, narrowing the RED-zone rule to structural edits only (TOC, chapter restructure, VERSION block rewrites) while additive implementation sections become GREEN — this is what the PhD side already allows; **(c)** accept the lockstep gap and record V3Thesis as trailing PHD_FIREHORSE by one version. **(RECOMMEND: (b).** The PhD half already has exactly this carve-out and it has worked; the risk being guarded against is structural edits, not additive implementation content, and the current rule blocks the thesis from tracking the work that is actually being done.)

## 7. Session output

- Branch `claude/retire-ai-personas`. Personas removed from both homepages; reveal at 2.5s across 16 pages with two defects fixed; `PHD_FIREHORSE_EN/FI` §14.46 + Key Contribution #51, 3.95 → 3.96 lockstep.

---

_Follows DWS Document Standard and DWS Learning Standard (HIC Learning Outcome, EU AI Act Art. 14)._

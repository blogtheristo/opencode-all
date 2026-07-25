<!--
VERSION AND AGENT HISTORY
Document: institutional-record-errors.md
Version: 1.0
Last-Updated: 2026-07-25
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Canonical DWS rule for handling an error that has reached a permanent
         public institutional record — record the decision that caused it, not
         only the discrepancy. Worked case: the Metropolia YAMK thesis cover-page
         title error (Theseus URN:NBN:fi:amk-2026062725698).
Introduced-In: PR-pending (branch claude/greg-isenberg-field-notes-a2r544)
Code-Version: 1.0
Branch: claude/greg-isenberg-field-notes-a2r544
Date: 2026-07-25
Owner: risto.paarni@lifetime.fi
-->

# Institutional Record Errors — Record the Decision, Not the Discrepancy

**Version:** 1.0 · **Status:** Active · **Scope:** any error that has reached a permanent, externally-held record (thesis deposit, registry filing, published standard, invoice, contract)

## The rule

When a permanent external record is wrong, the internal record of it must name **the decision that produced the error** — who decided, when, on what reading, and what alternative was available at that moment — not merely the fact that two values disagree.

**A discrepancy is a fact about two strings. A decision has an owner and a date.** Only the second supports a correction request, and only the second prevents a repeat.

## Why the weaker form fails

A record that says *"the deposited title does not match the content"* supports no action:

- **Nobody to write to.** A correction request needs an account of how the wrong value got there. "It differs" invites the recipient to ask the question the record should already answer.
- **No repeat prevention.** The same misreading recurs, because nothing captured what was misread.
- **It reads as an accusation of the institution.** The error was frequently made on the applicant's own side; a record that omits this makes every future explanation defensive rather than factual.

## Failure mode to watch for

The strong pull is to explain an anomaly with an **impersonal mechanism** — inherited from a form, drifted between systems, a process artifact — when the actual cause was a **specific human decision at a specific moment**. Both explanations fit the evidence equally well at first sight. Only one is true, and only one is actionable.

**Institutional artifacts fail through people, not through systems.** Prefer the personal explanation until the impersonal one is proven.

## Worked case — Metropolia YAMK thesis title (2026)

The deposited thesis (<https://urn.fi/URN:NBN:fi:amk-2026062725698>, 10.07.2026) carries an obsolete cover-page title while its own abstract, on the same page, describes the current subject. Chain:

1. Registered under an early title; content moved on; title updated to match.
2. **The guidance was misread** as requiring the final version to bear the originally registered title.
3. On that reading the title was **changed back by hand** and that version submitted.
4. **The handling person went on holiday**; the correction window closed unclosed.
5. Wrong title reached the assessment (5.6.2026) and Theseus (10.7.2026).

Scope: the two versions are **identical except the cover page**. One work, wrong name — not two works.

**Correctability: open.** Route is the awarding institution's library, not the archive service.

## Second-order asset

An error visible **from inside the document itself** (cover page vs. abstract, same file) is materially easier to get corrected than one requiring external evidence — the reviewer verifies it without leaving the artifact. When recording such an error, **state where the self-contradiction is visible.** It is the strongest sentence in the eventual request.

## Related

- `docs/field-notes/2026-07-25-thesis-title-error-cause-and-record.md`
- `docs/metropolia/master-thesis/arviointi/README.md` (the archived record, v1.1)
- `DWS_LEARNING_STANDARD.md` §10.4 (verified vs. propagated)
- `CLAUDE.md` Rule 12 (fail loud) — an unrecorded known error in a public record is a silent failure

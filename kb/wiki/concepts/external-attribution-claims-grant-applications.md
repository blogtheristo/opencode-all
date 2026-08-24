<!--
VERSION AND AGENT HISTORY
Document: external-attribution-claims-grant-applications.md
Version: 1.0
Last-Updated: 2026-07-29
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-sonnet-5)
Purpose: Canonical DWS rule for citing a named external party's specific
         action (funder, partner, regulator) in grant applications, investor
         material, and correspondence. Originated from the EIC Accelerator
         Step 1 ground-truth rebuild (2026-07-29), where a founder-recalled
         "NATO DIANA requested our video and deck" resolved to a different
         funder's (RTOY) rejection feedback — caught before submission, but
         would have been a false statement to the European Commission.
Introduced-In: PR #1700 (branch claude/eic-accelerator-2026-step1-bstysc)
Branch: claude/eic-accelerator-2026-step1-bstysc
Date: 2026-07-29
Owner: risto.paarni@lifetime.fi
-->

# External-Attribution Rule — Claims of the Form "[Named Party] Said/Requested/Confirmed X"

**Version:** 1.0
**Status:** Active
**Scope:** Grant applications (EIC, national funds), investor material, funder/partner correspondence — anywhere a specific dated action is attributed to a named external party.

## The rule

**Draft the sentence only after the dated, quotable source exists.** If it does not yet exist, write a `[TO FILL]` placeholder plus the exact verifying question — never draft prose on the assumption the source will check out. This applies with extra force when two similarly-named or institutionally-adjacent organisations exist (a municipal fund vs. the international programme it feeds into; a regional accelerator vs. its national umbrella) — verify **which one** before attributing an action to either.

## Why this exists

A founder recalled "NATO DIANA requested our pitch video and deck." The claim was drafted into an EIC Accelerator application's dual-use justification before being traced to a source. When interrogated ("which accelerator site/cohort — paste the request verbatim"), it resolved to a **different funder's** rejection letter (Riihimäen Tilat ja Kehitys Oy / RTOY, a municipal Defence Startup Fund, rejected 23 April 2026) that happened to name the same two missing artifacts (video + deck). RTOY genuinely is the local gateway organisation for NATO DIANA opportunities in its region — which is exactly why the conflation was easy to make in good faith, not a sign of carelessness. Had the sentence shipped as originally drafted, it would have been a false statement to the European Commission in an active grant application.

## The generalizable pattern

1. A claim of the form "[External Party] [past-tense verb] [specific thing]" is a factual assertion about a third party's action, not a paraphrase of general context.
2. Draft order: **evidence first, prose second.** The moment such a claim is needed, the first move is "give me the date, the channel, and — ideally — the message verbatim," not writing the sentence and citing it later.
3. When two entities are institutionally related but distinct (see also `docs/eic/DIANA_DOOR_OPENING_PLAN.md` for the RTOY/DEFINE/VTT/NATO-DIANA map worked out in this incident), state the actual **relationship** between them when correcting a conflation — not just that they are "not the same," which reads as "unrelated" and can undersell a genuinely usable connection.
4. A scaffold file with explicit `[TO FILL]` rows (see `docs/eic/correspondence/2026-07_DUAL_USE_ENGAGEMENT_LOG.md`) is a good mechanical enforcement: it forces a human to supply the missing fact before the claim can ship, rather than letting the agent infer or soften it.

## Related

- `docs/learning-loops/2026-07-29-this-session.md` — full diarized incident + proposed rule text for `DWS_TRUTH_STANDARD.md` (not yet applied — human review pending).
- `docs/field-notes/2026-07-29-eic-accelerator-ground-truth-rebuild.md` — full field note.
- `.claude/commands/truth-check.md:31` — the related SWEEP COMPLETENESS rule (a sibling gap: a canonical-number claim already self-diagnosed as wrong elsewhere in the repo should be checked before auditing a claim fresh).

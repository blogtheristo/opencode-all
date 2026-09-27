# Field Note — NATO DIANA: from a false claim to an actual first-contact draft

**Date:** 2026-07-29
**Session:** `claude/dws-eic-accelerator-step1-82ml4d` (continuation of PR #1700 / #1765, main `44e5448`)
**Type:** Grant-application-adjacent relationship-building capture
**Ontology tags:** `#grants` `#eic` `#nato-diana` `#dual-use` `#truth-standard` `#learning-standard`

---

## What happened

Continuing the prior session's EIC Accelerator Step 1 work, a re-check of `docs/eic/EIC_STEP1_FILL_PACKET.md` found that the DIANA-resolution commits from the prior session (`7b03695`, `d8e4c18`, `86559c6`) had fixed the false "NATO DIANA requested our video and deck" claim everywhere else in the repo — but had missed the one file that is the actual copy-paste text for the Step 1 online form. F7b still read "a submission to NATO DIANA is in preparation at DIANA's own request." Fixed and pushed before anything else this session (commit `87e63ac`).

Mid-session, the founder explicitly asked to reinstate that exact sentence ("submission to NATO DIANA is in preparation by HIC request"). The request was declined, with the reasoning stated directly: the claim would go into a real EU Commission grant submission, and every piece of dated, founder-confirmed evidence in the repo said it was false. The founder did not push back further — the conversation instead turned constructive: verifying DIANA's own accelerator-cohort timing, then finding real contact channels and drafting an actual first-touch outreach.

**What that produced, in order:**

1. Verified via web search that the DIANA 2027 cohort deadline (3 July 2026) has already passed, confirming `DIANA_DOOR_OPENING_PLAN.md`'s existing timeline — no live application window is being missed.
2. Found real, named VTT DIANA contacts (Lotta Partanen, Sauli Eloranta) via VTT/Cision public press materials — direct `WebFetch` to `diana.nato.int` and `vttresearch.com` consistently returned 403 (bot-protection, confirmed not a proxy fault via `$HTTPS_PROXY/__agentproxy/status`).
3. Drafted a first-contact email — not a claim of a relationship, an actual attempt to start one — per `DIANA_DOOR_OPENING_PLAN.md` §2.1.
4. Founder supplied VTT's own general-inquiries address (`natodiana@vtt.fi`) from VTT's Contact-us page; the draft was retargeted from the guessed named contact to that address.
5. Founder raised that VTT is only one of DIANA's 16 accelerator sites, and might not be the best challenge-area fit. Verified: DIANA runs 16 sites NATO-wide with different specialties; VTT's is Advanced Communication Technologies, while "Critical Infrastructure and Logistics" — a much closer match to Aegis's actual thesis (supply-chain sovereignty, CSRD/CBAM/NIS2/CER compliance) — is one of DIANA's own named challenge areas. Added a third question to the draft asking VTT directly whether they're still the right entry point given that mismatch, rather than assuming either way.
6. Founder shared a screenshot confirming DIANA's official LinkedIn "About" section (verified page, `diana.nato.int`, defence/space industry, 11–50 employees, 150 affiliated members) — general public confirmation of the organisation, not evidence of any Lifetime Oy–DIANA contact. Logged here for the record; it doesn't change anything in the engagement log since it isn't a dated exchange with Lifetime Oy.
7. Founder cc'd the draft to a personal inbox and Boardy (AI advisor) for review — logged as "not the VTT send" in the draft's pre-send checklist, since the actual `natodiana@vtt.fi` send is still pending.

## The insight

**Redirecting a request to reinstate a false claim toward actually making the claim true is the right failure mode to aim for.** The founder's first instinct (reinstate the sentence) and second instinct (contact DIANA for real) both came from the same underlying want — a genuine DIANA relationship — but only one of them is compatible with submitting to the European Commission. Declining the first request cost one round of pushback; it did not cost the relationship the founder actually wants, because the second path gets there for real instead of on paper only.

**A close second insight:** the founder's own domain knowledge ("VTT is one of many, there may be a better fit") caught something the agent's own research had already surfaced but not connected — `DIANA_DOOR_OPENING_PLAN.md` already noted "ACT is not Aegis's natural challenge area," but nobody had yet checked whether a *different* DIANA site's specialty was a better match, only that VTT's wasn't ideal. Founder domain instinct plus agent research access found this together; neither alone had it.

## What changed

- `docs/eic/EIC_STEP1_FILL_PACKET.md` — false DIANA claim removed from the live submission text (the actual gap this session opened with).
- `docs/eic/PIC_PARTICIPANT_REGISTER_CHECKLIST.md`, `docs/eic/DUAL_USE_WINDOW_VERIFICATION_2026-07-29.md` — new, researched, resolve two open founder questions from the prior handoff.
- `docs/eic/correspondence/2026-07-29_VTT_DIANA_first-contact-draft.md` — new: a real, sourced, three-question first-contact draft to `natodiana@vtt.fi`, not yet sent. Pre-send checklist tracks what's done (cc'd for review) vs. what isn't (the actual VTT send).
- `docs/eic/DIANA_DOOR_OPENING_PLAN.md` — updated with the 16-site / Critical-Infrastructure-and-Logistics finding.
- `sales-outreach/LETTER_LAURA_MANNER_RAAPPANA_RTOY_SHORT_REPLY_FI.md` — new short RTOY reply draft, not sent (no Gmail thread found on the connected account; original correspondence likely lives on the Proton-routed address).
- Confirmed via GitHub: PR #1766 (traction-truth-reconciliation) was already open and deliberately unmerged — not lost, needs a founder merge decision.

## Next steps

1. Send the VTT draft from `risto.paarni@lifetime.fi` to `natodiana@vtt.fi`.
2. Log VTT's reply verbatim in `docs/eic/correspondence/2026-07_DUAL_USE_ENGAGEMENT_LOG.md` §1 the moment it arrives — only then can F7b describe any DIANA relationship.
3. Send the RTOY short reply from the correct (Proton-routed) mailbox.
4. Fill the dual-use log §2 (2–3 enterprise contacts) — still needs founder-supplied data.
5. Decide PR #1766 (traction reconciliation) — merging publishes 4 live sites, and 4 open decisions are logged in `docs/TRACTION_CANONICAL.md` §5.
6. Approve or amend the two outstanding learning-loop rule edits (`docs/learning-loops/2026-07-29-this-session.md`).

See `.claude/handoffs/claude/dws-eic-accelerator-step1-82ml4d.md` for full session state.

---

## HIC Learning Outcome — five-step record

1. **KB updated:** N/A this note — no new generalizable concept beyond what `kb/wiki/concepts/external-attribution-claims-grant-applications.md` (prior session) already covers; this session applied that same rule rather than adding a new one.
2. **Field note:** this file.
3. **Learn/ HTML:** N/A — deferred; can be rendered on request via `scripts/render-doc.sh`.
4. **Drive export:** N/A — deferred; can be exported on request.
5. **HIC question:** already asked and answered live in this session's chat (whether to apply the learning-loop rule edits now or review diffs first; the dual-use log §2 contacts) — both still open as of this note.

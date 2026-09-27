# Handoff — claude/dws-eic-accelerator-step1-82ml4d

## Task

Continuation of EIC Accelerator 2026 Step 1 prep after PR #1700 merged to main (e0481cf7). Working through the 7-item priority list left by the prior session's handoff (`claude/eic-accelerator-2026-step1-bstysc.md`).

## State this session

1. **Critical catch: `docs/eic/EIC_STEP1_FILL_PACKET.md` F7b still had the false NATO DIANA claim.** The prior session's DIANA-resolution commits (7b03695, d8e4c18, 86559c6) fixed the claim everywhere else but missed the one file that is the actual copy-paste text for the Step 1 online form. Fixed and pushed (commit `87e63ac`) before anything else this session — this was the single highest-severity open item, higher priority than the 7-item list itself. Confirmed via grep that no other live/submission-facing file still carries the claim (only correspondence/analysis/kb files describing the resolved incident do, which is correct).
2. **PIC / Participant Register** — researched and written up as `docs/eic/PIC_PARTICIPANT_REGISTER_CHECKLIST.md`. Key finding: self-registration (getting a PIC) is separate from Central Validation (LEAR + legal docs), and CVS is only triggered if a proposal is selected for funding — it does not block Step 1 submission. Actual registration still needs the founder's EU Login + legal documents; not agent-doable.
3. **Dual-use submission window verified** — `docs/eic/DUAL_USE_WINDOW_VERIFICATION_2026-07-29.md`. The founder's recalled "28.10.2026" is real but belongs to **EIC STEP Scale Up Defence** (a separate €100M equity-only call, 30.6–28.10.2026), not the EIC Accelerator Lifetime Oy is applying to. The Accelerator's continuous 17.12.2026 17:00 Brussels deadline is confirmed unaffected — no changes needed to the fill packet. Sourced from 5 independent secondary sources (WebFetch to eic.ec.europa.eu itself returned 403 — bot-protection, not a proxy fault, confirmed via proxy status check).
4. **RTOY short reply drafted** — `sales-outreach/LETTER_LAURA_MANNER_RAAPPANA_RTOY_SHORT_REPLY_FI.md`. Short version per Boardy's phrasing (thank her, name deck-ready + video-in-final-production, ask for 15-min call). **Not sent**: the connected Gmail MCP account (`risto.paarni2024@lifetime.fi`) has no thread with `laura.manner-raappana@riihimaki.fi` — the original correspondence likely lives on the Proton-routed `risto.paarni@lifetime.fi` catch-all, which this session cannot access. Founder needs to send from the correct mailbox, ideally as a reply-in-thread.
5. **Traction-truth-reconciliation background agent — already resolved, not lost.** Branch `claude/traction-truth-reconciliation` exists on remote (10 commits, confirmed up to date with main) and **PR #1766 is already open** ("docs: reconcile traction claims to one canonical source"). It was deliberately left unmerged by that agent — merging it auto-publishes 4 live public sites (one-way door per `DWS_LEARNING_STANDARD.md` §10.3) and it has real open founder decisions logged in `docs/TRACTION_CANONICAL.md` §5 (an arithmetic conflict, a contract with no evidence found, an account-count discrepancy, and whether any external recipient of the old overstated figures needs a correction sent). This needs a founder merge decision, not further agent work.
6. **Learning-loop rule proposals — still awaiting approval, not yet applied.** `docs/learning-loops/2026-07-29-this-session.md` proposes 3 edits. Checked current state: Edit 1 (External-Attribution Rule) is only in `kb/wiki/concepts/external-attribution-claims-grant-applications.md` (via the HIC Learning Outcome commit), **not yet in `DWS_TRUTH_STANDARD.md`** as the file recommends. Edit 2 (prior-self-diagnosis grep addition to `.claude/commands/truth-check.md`) **not applied**. Edit 3 (risk-section scoping) not applied. Presented to user this turn for explicit approval before a `learn:` commit.
7. **Dual-use log §2 (2-3 enterprise contacts)** — still `[TO FILL]`, needs founder-supplied data (counterparty/person/channel/date/stage). Cannot be filled by an agent without fabrication.
8. **Video recording** — still blocked on the founder actually recording it; background/script ready (`EIC_STEP1_VIDEO_BG.html`, `EIC_STEP1_SHOT_SCRIPT.md`). Sequencing note: send the RTOY short reply first (offering the deck now + video "in final production"), then record once whatever the reply surfaces is incorporated.

## Next steps (for the founder, in order)

1. Start PIC self-registration (`docs/eic/PIC_PARTICIPANT_REGISTER_CHECKLIST.md`) — no dependency on anything else.
2. Decide PR #1766 (traction-truth-reconciliation) — review the 4 open decisions in `docs/TRACTION_CANONICAL.md` §5, then merge (triggers 4 site publishes) or request changes.
3. Approve or amend the learning-loop edits (see this session's chat for the presented text) — then a `learn:` commit applies them.
4. Send the RTOY short reply from the correct mailbox (`risto.paarni@lifetime.fi`), attaching the deck once confirmed it's RTOY-appropriate.
5. Supply the 2-3 dual-use enterprise contacts for the log §2.
6. Record the video once the RTOY exchange lands.

## Blockers

None on the EIC text itself — it is now fully ground-truth-accurate including the F7b file that was previously missed. Everything else in this list is a founder decision or founder action (portal registration, sending mail, recording video, approving rule changes) that cannot be completed by an agent.

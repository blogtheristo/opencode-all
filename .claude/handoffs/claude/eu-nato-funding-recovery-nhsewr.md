# Handoff: claude/eu-nato-funding-recovery-nhsewr

## Task

Recovery run brief: re-create the "lost" EU Commission + NATO DIANA funding pack
(`docs/lut/eu-nato-instruments-research-2026-07.md`) and, per a chat prompt, publish a
self-contained Artifact web page summarising it.

## State: DONE — but the research recovery was ALREADY COMPLETE before this branch started

**Do not re-run the EU/NATO research recovery. It is finished and on `main`.**

- `docs/lut/eu-nato-instruments-research-2026-07.md` (v1.3, 461 lines) was recovered on
  branch `claude/eu-nato-funding-recovery-lsogw2`, verified against official sources, and
  **merged to `main` via PR #1676** on 14.07.2026.
- The master roadmap `docs/lut/fundraising-roadmap-2026-2027.md` (v1.4 on main, v1.5 on
  `claude/europe-roadmap-agents-g9zs8a`) marks **all four lost packs RECOVERED — "no lost
  packs remain."**
- This branch was cut from a stale base (#1670) that predated #1676, which is why the
  session-start state looked empty. Branch was realigned to `origin/main` (was 136 commits
  behind); no unique research commits were lost because there were none.

**Conclusion:** committing any re-run of this research would duplicate and, in places,
regress the more-verified canonical pack. So this branch adds **no research commit** — only
this handoff.

## What this session actually produced

A private Artifact web page (visual companion to the canonical pack, NOT new research):
**https://claude.ai/code/artifact/8f856f9f-26ad-4222-83b2-6b757a9304b0**

- First published from the brief before the canonical pack was found; it had drifted from
  source-of-truth (it repeated the exact EIC €30M conflation that pack v1.2 explicitly
  rejected). **Corrected and republished to mirror pack v1.3.** Fixes made: EIC equity
  ceiling €10M not €30M (STEP Scale-Up Defence broken out as the separate €10–30M scheme);
  EDF surfaced as a LIVE 29 Sep 2026 deadline (€4M/100%), not an "annual/monitor" item;
  Digital Europe 75% SME rate / €8.5M-2-grants; NGI Sargasso (1 Aug 2026) added as the
  most-urgent item and #1 in apply-order; AI4Gov-X added; Eurostars marked civil-only;
  ranked order + fit scores aligned to pack §8.
- The page has an SE-led / FI-led applicant toggle that re-colours the negative-equity gate
  verdict per instrument (Gate 1: SE-led-via-Lifetime-AB-now vs FI-led-after-cure).

## Follow-on work done this session (after the initial handoff)

1. **Eurostars Call 11 drafting kit** — `docs/lut/eurostars-call-11-proposal-kit-2026-07.md`
   (v1.0, committed `af72148`). Section-by-section plan keyed to the verified Eurostars
   evaluation mechanics (Excellence / Impact / Implementation, avg ≥3.6 each, 3 remote experts
   → IEP), civil-only framing, lean consortium plan (AB lead + LUT/Simula verification partner),
   Vinnova SEK 5M budget shape, and an honest 8-week sprint with a 1 Aug partner-lock go/no-go
   vs a Call-12 fallback. Built the Europa Media RIA/IA template into narrative-craft guidance
   only — flagged that Eurostars ≠ Horizon RIA/IA (different portal/form).

2. **NGI Sargasso correction (founder-flagged)** — Sargasso is NOT a live 2026 call. All its
   Horizon NGI open calls closed in 2024 (OC4 1 Aug 2024, OC5 25 Nov 2024). The canonical pack's
   "1 Aug 2026 / file first" was a misdated OC4. Fixed in three places:
   - Pack `eu-nato-instruments-research-2026-07.md` → **v1.4** (`7c5064b`): §4 row + recommendation,
     §8 ranking (Eurostars now #1), §9 note.
   - Roadmap `fundraising-roadmap-2026-2027.md` → **v1.4.1** (`5b295b1`): §3 table row marked CLOSED.
     Patch-numbered on purpose to avoid colliding with the pending v1.5 (Nordic) on
     `claude/europe-roadmap-agents-g9zs8a`.
   - Artifact (same URL) → re-published mirroring pack v1.4; Sargasso card/spine/rank all corrected.
   - **AI4Gov-X flagged `(verify still open)`** everywhere — the Sargasso miss is the reason to
     re-check every cascade call at its primary source before relying on it.

## Resource dropped in chat

Founder uploaded **EuropaMediaRIAIAProposalTemplate2026.pdf** (50-page Horizon Europe RIA/IA
proposal template). Used as narrative-craft input for the Eurostars kit above (not as the
submission structure — Eurostars uses its own form on myeurekaproject.org).

## Next steps (if anyone picks this up)

- Recovery itself is done on main; no re-run needed.
- Eurostars Call 11 W0 actions are listed in the kit §8 (confirm AB "innovative SME" + Vinnova
  registration; invite LUT/Simula; write the one-sentence innovation claim + market number;
  book a Vinnova NCP call; diarise the 1 Aug partner-lock go/no-go).
- The roadmap's v1.5 (Nordic recovery + `***` delimiter fixes) sits on
  `claude/europe-roadmap-agents-g9zs8a`, not yet merged to main. When it merges, reconcile it
  with this branch's v1.4.1 Sargasso patch (patch numbering should make that a clean stack).

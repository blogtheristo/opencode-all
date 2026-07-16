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

## Resource dropped in chat (not yet actioned)

Founder uploaded **EuropaMediaRIAIAProposalTemplate2026.pdf** (50-page Horizon Europe RIA/IA
proposal template) + a Europa Media Trainings marketing email. Relevant to the _next_ phase —
actually drafting the Eurostars / Digital Europe / Horizon proposals. Not folded into any
deliverable this session; candidate next step is a proposal skeleton keyed to that template.

## Next steps (if anyone picks this up)

- None required for the recovery itself — it's done on main.
- Optional: build a proposal-drafting skeleton from the Europa Media RIA/IA template for the
  top apply-order items (NGI Sargasso 1 Aug, Eurostars 10 Sep SE-led).
- The roadmap's v1.5 (Nordic recovery + `***` delimiter fixes) sits on
  `claude/europe-roadmap-agents-g9zs8a`, not yet merged to main as of this session.

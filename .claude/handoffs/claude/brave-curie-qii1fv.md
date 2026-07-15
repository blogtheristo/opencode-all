# Handoff — claude/brave-curie-qii1fv

**Date:** 15.07.2026 · **Session task:** FI/SE funding-lanes bank-check / recovery (roadmap §0 row 5).

## What was done

Recovered the at-risk **FI/SE lanes research pack** and updated the master roadmap. This branch
was a fresh session; it bootstrapped `docs/lut/` + `scripts/claude-durability-checkpoint.sh` from
`claude/europe-roadmap-agents-g9zs8a`.

- **New file:** `docs/lut/fi-se-lanes-research-2026-07.md` (v1.0) — all four FI/SE lanes
  (apurahat, Vinnova, Almi, VGR) re-researched from primary sources for **Lifetime Oy** (FI,
  negative-equity/GBER firm-in-difficulty) vs **Lifetime AB** (SE, <3y, GBER-exempt). Per-lane
  instrument tables, deadline stack (§5.2), cross-lane synthesis (§5).
- **Roadmap:** `docs/lut/fundraising-roadmap-2026-2027.md` → v1.1. §0 row 5 flipped to
  **RECOVERED**; §6 rewritten from summary bullets to full per-lane detail.

## Key finding (load-bearing)

**The Oy's negative-equity / GBER "undertaking in difficulty" gate does NOT bite personal
doctoral apurahat** — they are _henkilöapurahat_ paid to the individual (Risto/LUT), outside the
state-aid regime. The gate bites **only Business Finland**. So **_apuraha → stay Finland_ is
structurally the cleanest of the four lanes.** Vinnova is the real Swedish company-grant door via
the AB; Almi is debt-not-grant; VGR is blocked by a Västra Götaland territorial-registration gate.

## Near-term FI/SE deadline stack

LSR apuraha **15 Aug** → Eurostars Call 11 **10 Sep** → TSR **24 Sep–15 Oct** → Innovativa Startups
opens **12 Oct** → SKR **15–30 Oct**.

## Verify-before-filing

All euro/krona figures are from **official-page search renders** (all target sites 403-blocked the
fetcher) — re-confirm on the live portal before any filing. Full verify list in research pack §6.

## Reconciliation with #1682 (15.07.2026, later same day)

**PR #1685** was opened for this branch. Meanwhile a **parallel session**
(`claude/fi-se-funding-lanes-recovery-pbmlmg`, **PR #1682**) had independently recovered the
**same** FI/SE lanes and **merged to `main` first** — plus an EU/NATO recovery. That produced
**add/add merge conflicts** on 6 files (both branches created the same filenames from a base that
lacked them).

Resolved by merging `origin/main` into this branch and **deferring to main's canonical, more-complete
versions** (roadmap **v1.2** with EU/NATO integrated + Copilot autofixes; recovery-prompts,
fieldnote-prompt, paste-ready prompts, and `claude-durability-checkpoint.sh` all Copilot-hardened on
main). Taking this branch's older versions would have **regressed main** (dropped the EU/NATO
recovery, re-opened already-fixed `***`-delimiter / Document-Status / script findings) — the #1682
handoff (`.claude/handoffs/claude/fi-se-funding-lanes-recovery-pbmlmg.md`) explicitly warns those are
stale if re-flagged.

For the one file with genuine divergence — `fi-se-lanes-research-2026-07.md` — kept main's canonical
research **in full** and **grafted only this branch's additive §0.5 per-lane verdict table** (v1.0 →
v1.1). This branch's independent four-lane run is preserved in git history (commits e4b9458 /
fba2262); nothing was discarded, nothing on main was regressed.

**Net:** #1685 now = main + this session's §0.5 summary table + this handoff. The substantive FI/SE
recovery already lives on main via #1682. If a lighter PR is preferred, #1685 can be closed with no
loss.

## State

Original recovery work was `✓ DURABLE` at HEAD fba2262. After reconciliation the branch is a merge
commit atop `origin/main`; conflicts resolved, no markers, tree clean.

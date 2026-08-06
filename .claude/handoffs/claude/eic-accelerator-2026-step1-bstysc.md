# Handoff — claude/eic-accelerator-2026-step1-bstysc

## Task

EIC Accelerator 2026 Step 1 (`HORIZON-EIC-2026-ACCELERATOR-01`) short-proposal prep for Lifetime Oy: fix a stale monthly-batch deadline assumption, then a full ground-truth rebuild of every claim after two read-only audits found the pack would not have survived evaluator scrutiny.

## State — PR #1700, merged to main this session

- **Deadline corrected:** continuous, 17.12.2026 17:00 Brussels (not a batch). PIC/Participant Register registration still not started — **this is now the only real timeline risk**.
- **Ground truth applied everywhere** (form, deck, video background, shot script, pptx builder, product catalog + mirror): Aegis is `preorder`, GA **September 2026**, pre-revenue — never "live". TRL claim is **"5 completed, entering 6"**, anchored on the KYA engine (real, running, Article-12 audit deployed) — not on Aegis, not on revenue.
- **Traction detached from the platform:** the ~€7k/month is Lifetime Fleet transport + consulting revenue (Traficom-regulated dispatch operators charge commission on it), explicitly NOT software traction. Real pipeline: 2 enterprise pilots contracted Q1/2026, active discussions (not "filed") with Outokumpu and Kemira.
- **Dual-use declared** (Part A tick box → YES, founder decision 2026-07-29). F7b states the honest asymmetry: civil evidenced and primary, defence at design-partner stage, no reference customer, no LOI. **Never name the defence prime** (NDA covers negotiations/partnerships, €100k penalty; NDA copy in repo has blank signatures — confirm an executed copy exists before citing it at all).
- **The NATO DIANA claim was resolved to zero and removed.** What was recalled as "DIANA requested a video and deck" was actually RTOY's (a Riihimäki municipal fund) rejection feedback of 23.4.2026. RTOY is the local gateway organisation for DIANA opportunities but is not DIANA itself (VTT hosts DIANA in Finland). See `docs/eic/DIANA_DOOR_OPENING_PLAN.md` for the real path: DIANA's 2027 cohort closed 3.7.2026, next entry is the 2028 cohort (~mid-2027); nearest-term move is answering Laura Manner-Raappana's (RTOY) feedback directly, short and specific, per Boardy's suggested phrasing.
- **Export control is off the Step 1 critical path** (F6c) — nothing in the submission describes a controlled item; MFA classification opinion is sequenced before shipping the SAR module, explicitly **no expedite** (founder decision — product still in development).
- `docs/eic/correspondence/2026-07_DUAL_USE_ENGAGEMENT_LOG.md` is the evidence scaffold for any dual-use citation — §1 (DIANA) now correctly says no relationship exists; §2 (2-3 dual-use enterprise contacts) still has `[TO FILL]` rows.
- Learning-loop written: `docs/learning-loops/2026-07-29-this-session.md` (read-only, not yet applied — see Next steps).

## Next steps

1. **PIC / Participant Register** — start now, Central Validation takes weeks.
2. **Verify the dual-use submission window** (possibly 28.10.2026, unconfirmed from an official source) vs. the continuous 17.12.2026 deadline.
3. **Send the short reply to Laura Manner-Raappana (RTOY)** — Boardy's phrasing: thank her, name the two things now fixed, ask for a 15-min call on whether the material now answers the gaps. Log her reply in the dual-use engagement log §1.
4. **Fill dual-use log §2** — the 2-3 dual-use enterprise contacts the founder mentioned but hadn't logged.
5. **Record the two ADR-worthy rules** from the learning-loop file into `DWS_TRUTH_STANDARD.md` (external-attribution rule) and `.claude/commands/truth-check.md` (prior-self-diagnosis grep) — proposed, not yet applied.
6. **Check on the traction-truth-reconciliation background agent** (worktree `agent-a62771ec0a679202c`, branch `claude/traction-truth-reconciliation` was never confirmed pushed) — the same 7-month customer/MRR drift needs reconciling across `docs/investor/`, `docs/sales/`, `docs/board/`, `sales-outreach/`, `Store/` (docs/eic/ already fixed, out of that agent's scope).
7. Record the video once the DIANA/RTOY reply lands — same video+deck now serves EIC, RTOY resubmission, and eventual DIANA 2028.

## Blockers

None on the EIC text itself. PIC registration and the RTOY reply are the two real dependencies before submission.

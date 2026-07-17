# Handoff — claude/dl-18-7-delivery-7m1hnj

**Last session:** 2026-07-17 · Opus 4.8

## Focus: DL 18.7 = EIC Accelerator Step 1 (delivery due 18 July)

Branch task "dl-18-7-delivery" resolved to the EIC Accelerator Open 2026 Step 1
milestone (`docs/EU_FUNDING_EIC_ACCELERATOR_2026.md` §7 row 1, due 2026-07-18).

## What shipped this session (committed + pushed)

1. **`docs/eic/EIC_STEP1_FILL_PACKET.md`** — paste-ready Chrome fill packet for the
   Step 1 online form. F1–F14 text fields (trimmed from draft v0.91 to ~1,000-char
   EIC limits) + structured fields (Lifetime Oy · FI · Y-tunnus 0772407-9 ·
   grant-only €2.5M · budget €3.57M · TRL 6–7→8 · 24 mo) + uploads/pre-submit
   checklist. Built to be filled via **Claude for Chrome** in Risto's authenticated
   EU Login session (remote container can't reach the portal).
2. **Two founder decisions locked** (recommended defaults): **grant-only €2.5M** and
   applicant = **Lifetime Oy (FI)** (Lifetime AB = expansion narrative, not co-applicant).
3. **§7 row 1 marked in progress** in the EIC brief.

## Verified links (this session)

- Step 1 is a **separate platform** (not F&T portal): apply via
  https://eic.ec.europa.eu/eic-funding-opportunities/eic-accelerator_en → "Apply to
  the EIC Accelerator" → EU Login (ecas.ec.europa.eu).
- **Guide for Applicants v6.0 PDF** (= the DL 18.7 download, no login):
  https://eic.ec.europa.eu/document/download/9d96fbf3-4d85-4ad0-9483-c77ce348111d_en?filename=EIC+Accelerator+guide+for+applicants_WP26.pdf
- Step 1 package is **three parts, all mandatory**: 12-page form + 10-slide deck +
  **3-minute video**. Batched first Tuesday → **Aug 4** batch (submit ~Aug 1).

## Board state (tonight, founder snapshot)

| Track            | State                                   | Next human action                                                                                              |
| ---------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| EIC Accelerator  | Narrative v0.91 + deck prompt ready     | **Jul 18:** portal recon, send me the real form fields (→ re-trim the fill packet)                              |
| EUIPO Voucher 3  | Verified live, sequenced                | **Jul 22:** apply (grant decision MUST precede counsel engagement)                                             |
| NLnet Taler      | v1.0 submission-ready                   | **Jul 25:** go/no-go                                                                                            |
| AI Accelerate 2026 | GO — market-entry section drafted     | **Jul 28–30:** assemble + record video (two closers)                                                           |
| DIGITAL (Oct 1)  | Brief v1.2 + Part B skeleton            | Consortium outreach when KTH/LUT reply                                                                          |
| Jit Singh        | Connect sent, contact recorded          | If he accepts: short note referencing the Stripe agentic-commerce briefing, **not** the application            |

## Next actions (agent-side, when unblocked)

- On Risto sending real Step 1 field labels/limits → re-trim `EIC_STEP1_FILL_PACKET.md`.
- Offered but not yet built: **3-min video script** (timed shot list) + **10-slide deck
  outline** (from `investor-outreach/ECOSUMMIT_PITCH_DECK_2026.md` + `V4.3-DWS-IQ6-InvestorPD_2026.md`).
- Pre-submit gates (per packet): `/truth-check`; SAFE phrasing "in progress" not "open";
  MRR churn-window wording; confirm exact fields vs Guide v6.0.

## Cross-references

- `docs/EIC_STEP1_DRAFT_KYA_2026.md` (v0.91) — source narrative (2 [DECIDE] now resolved).
- `docs/EU_FUNDING_EIC_ACCELERATOR_2026.md` (v1.3) — criteria mapping + §7 next steps.

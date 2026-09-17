# EIC Accelerator Step 1 (Open 2026) — Readiness & Gap Brief

***

## VERSION AND AGENT HISTORY

| Field          | Value                                                              |
| -------------- | ------------------------------------------------------------------ |
| Version        | 1.0                                                                |
| Date           | 2026-07-24                                                         |
| Author         | Lifetime Oy                                                        |
| Owner          | risto-001                                                          |
| Status         | Assessment — read-only readiness check (no submission)             |
| Classification | Internal                                                           |
| Branch         | claude/dws-learning-hic-process-e70k0a                             |
| Target         | EIC Accelerator Open, **Step 1 Aug 4 2026 batch** (submit ~Aug 1)  |
| Sources        | `docs/eic/EIC_STEP1_FILL_PACKET.md` (operative), `EIC_STEP1_DECK_AND_VIDEO.md`, `EIC_STEP1_SHOT_SCRIPT.md`, `docs/EIC_STEP1_DRAFT_KYA_2026.md` (v0.91), handoffs `dl-18-7-delivery` + `ngi-sargasso-gber`, `BOARDY_MONDAY_PRIORITIES_V3.md` |

***

## 1. What the Step 1 package requires (authoritative, from repo)

The EIC Accelerator Step 1 submission is **three deliverables into the EU Login / Funding & Tenders portal** (topic **HORIZON-EIC-2026-ACCELERATOR-01** → Step 1 platform), one application at a time:

1. **Written short proposal** — a set of online form fields, filled from the paste-ready packet (`EIC_STEP1_FILL_PACKET.md` maps them F1–F14 + F6b IP + structured/numeric fields). The older `EIC_STEP1_DRAFT_KYA_2026.md` is a 12-page long-form narrative; the **fill packet (v2.0) is the operative, hero-corrected source** (Aegis-as-hero, not KYA-2-standard-as-hero).
2. **Pitch deck** — **≤10 slides, PDF** upload.
3. **Video** — **≤3 minutes, 1–3 people** (solo founder permitted).
4. **Structured fields** — entity, Y-tunnus, SME status, funding type, grant amount, TRL now/target, duration, civil/dual-use tick box (all values locked in the packet).

**Gate rule (from `dl-18-7` handoff):** *do not click Submit until deck + video are uploaded and reviewed.*

## 2. Component status — DONE / PARTIAL / MISSING

| Component | Status | Evidence / gap |
| --- | --- | --- |
| Written narrative (F1–F14 + F6b + structured) | **DONE** | `EIC_STEP1_FILL_PACKET.md` v2.0 paste-ready; all claims founder-locked (retention, SAFE, gender-balance wording). |
| `[DECIDE]` grant-only vs blended | **DONE** | Grant-only €2.5M locked 22.07. |
| `[DECIDE]` applicant entity | **DONE** | Lifetime Oy (FI) single SME; AB = expansion narrative only. |
| `[DECIDE]` civil vs dual-use | **DONE** | Civil-only tick box locked 2026-07-17. |
| 10-slide pitch deck | **DONE (final QA pending)** | `EIC_STEP1_PITCH_DECK.pdf` (147 KB) + `.html` + `.pptx` all present in `docs/eic/`. Needs a final claim-match pass vs the fill packet before upload. |
| **3-minute video** | **MISSING** | Script (`EIC_STEP1_DECK_AND_VIDEO.md`) and shot script (`EIC_STEP1_SHOT_SCRIPT.md`) are DONE and record-ready — **but no recorded `.webm`/`.mp4` exists anywhere in the repo.** This is the long pole. |
| Field labels/limits vs live form | **PARTIAL** | Guide v6.0 + template downloaded (DL 18.7 done), but packet still flags "confirm exact labels/limits"; trim-to-counter not yet done against the real form. |
| `/truth-check` final pass | **PARTIAL** | Last run 0 fail / 0 warn (per handoff), but the *final* pre-upload pass is not yet executed. |
| Partner card (Lovegin photo + confirmation) | **PARTIAL — non-blocking** | Confirmation email SENT 2026-07-17; awaiting reply + photo (nudge ~Jul 28). Deck can ship without it. |
| Online form entry + upload + Submit | **NOT STARTED** | Human, EU Login, RED-zone. Blocked by video. |

**"To assemble Jul 28–30" reduces to:** record + edit the video, final deck QA, fill the online form, run `/truth-check`, upload, submit. **No writing work remains** — the content is done.

## 3. Critical path Jul 28 → Aug 4

| Day | Action | Note |
| --- | --- | --- |
| **Mon Jul 27** | IP-assignment sprint (LUT free IPR review, then sign); Boardy prep. Jul-27 pre-deadline sweep trigger fires. | **Does NOT gate EIC** — see §4. |
| **Tue Jul 28** | Nudge Lovegin (photo/confirmation). Prep live Aegis UI for capture (blur all customer data). Final deck claim-match QA. **Start video: dry run.** | Long-pole start. |
| **Tue–Wed Jul 28–29** | **RECORD video** on Acer Chromebook (Screencast, 1080p, `.webm`) → transfer to ZBook → trim/caption. | Earliest possible; longest lead time. |
| **Wed Jul 29** | Boardy meeting — confirm grant-only + EIC Aug 4 among decisions. | Board sign-off. |
| **Thu Jul 30** | Finish video edit. Fill Step 1 online form from packet (EU Login). Run final `/truth-check`. | |
| **Fri Jul 31 – Sat Aug 1** | Upload deck PDF + video; founder review; **SUBMIT (~Aug 1)**. | Buffer before cut-off. |
| **Tue Aug 4** | **HARD EU cut-off** (Step 1 batch = first Tuesday). Do not run to this day. | 3-day safety margin if submitted Aug 1. |

**Longest lead time = the video** (confirmed): it is the only deliverable that does not yet exist in any form, requires a human on specific hardware, and blocks the upload/submit gate.

## 4. Blockers & dependencies

- **Video recording (RED-zone, single point of slip).** Human action on founder's hardware; also needs the live Aegis UI staged with customer data blurred. Nothing downstream (upload → submit) can begin until the `.webm` exists. **This is the whole risk.**
- **Monday IP-assignment sprint does NOT block Aug 4.** Explicitly de-gated in the handoffs: patents-before-publication is sequenced ahead of the *first published milestone* (M12 EUPL-core release), not the grant submission; EUIPO Voucher 3 is voucher-only (free); patent filing is Q4 2026. The Boardy P0 IP action unblocks term sheets, not the EIC form. State this to the founder — it is a likely source of misplaced worry.
- **Financial-health / negative equity — not a Step 1 gate.** The equity cure (R&D-cap Phase 2) is a Business Finland "firm in difficulty" prerequisite and matters at EIC **Step 2 / grant-agreement**, not at the Step 1 remote screen of a grant-only proposal. Downstream risk only.
- **Lovegin confirmation + photo** — outstanding but non-blocking; the partner card is factual/optional and can be omitted if silent.
- **Attention contention (real).** The same Jul 27–Aug 1 window holds AI Accelerate (Jul 31), Taler, Boardy 29 Jul, and the Monday IP sprint. Founder bandwidth — not content — is the scarce resource.

## 5. Go / No-Go verdict

**CONDITIONAL GO — on track but fragile, gated entirely on one human action.**

All written content is done and founder-locked; the deck exists as an uploadable PDF. The entire remaining critical path collapses to: **record the ~3-minute video**, then mechanical form entry, a `/truth-check` pass, and upload. If the founder records by **Jul 29–30**, the Aug 4 cut-off is comfortably met with a 3-day buffer. The slip risk is execution/availability, not readiness.

**Top 3 risks / blockers**

1. **Video not recorded in time** — the only true long pole; it blocks the upload-then-submit gate and depends on founder time plus a staged live-Aegis screen capture (with customer data blurred). Single point of failure. *Mitigation: block Jul 28–29 for it; dry-run once; edit on ZBook.*
2. **Founder-attention contention** — AI Accelerate (Jul 31), Taler, Boardy 29 Jul and the Monday IP sprint all crowd the same week; the EIC video is the item most easily deferred. *Mitigation: submit EIC ~Aug 1 as a hard personal deadline; treat the IP sprint as non-gating.*
3. **Last-mile portal friction** — EU Login access, form field limits not yet confirmed against the live template, deck+video upload, final `/truth-check`, and the outstanding Lovegin photo — all no-slack steps if left to Aug 1–4. *Mitigation: fill the form Jul 30, upload Jul 31, keep Aug 1–3 as buffer.*

***

**End of brief.**

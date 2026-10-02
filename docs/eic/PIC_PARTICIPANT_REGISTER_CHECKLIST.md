# PIC / Participant Register — registration checklist for Lifetime Oy

---

## VERSION AND AGENT HISTORY

| Field          | Value                                                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version        | 1.0                                                                                                                                                                                                                      |
| Date           | 2026-07-29                                                                                                                                                                                                               |
| Author         | Lifetime Oy                                                                                                                                                                                                             |
| Owner          | risto-001                                                                                                                                                                                                               |
| Status         | Active — founder action required, not startable by an agent                                                                                                                                                            |
| Classification | Internal                                                                                                                                                                                                                |
| Branch         | claude/dws-eic-accelerator-step1-82ml4d                                                                                                                                                                                 |
| Why this exists | The handoff for this session named PIC / Participant Register registration as "the only real timeline risk" on EIC Step 1. Registration itself requires an EU Login and legal-document upload only the founder can do — this file is the researched checklist so that work starts with zero lookup friction. |

---

## 1. Why this matters (and why it is not actually a hard blocker for Step 1)

Two different things get conflated as "PIC registration," and the distinction changes the urgency:

| Step | What it is | Required before... |
| ----- | ---------- | ------------------- |
| **A. Self-registration (get a PIC)** | Create an EU Login, register Lifetime Oy on the Participant Register, receive a 9-digit **PIC** | **Submitting the Step 1 short application** — the online form asks for the applicant's PIC |
| **B. Central Validation (LEAR appointment + legal-entity validation)** | The Research Executive Agency's Central Validation Service (CVS) verifies legal status, financial viability documents, and appoints a LEAR (Legal Entity Appointed Representative) | **Only triggered once a proposal is selected for funding** — not a Step 1 submission gate |

**Consequence:** Step A (self-registration, get the PIC) should happen now regardless, because the online form needs the number. Step B (Central Validation) does not block *submitting* — it blocks *signing the grant agreement* if Step 1 gets a GO. But Central Validation is the slow part (see §3), so starting Step A now buys the runway Step B will need later without creating false urgency about Step 1 itself.

*(Sourced from EU Funding & Tenders Portal registration/validation guidance and third-party EU-grants practitioner summaries; the founder should confirm the CVS-trigger-on-selection detail against the portal's own "Registration and validation of your organisation" manual page when logged in — that page returned 403 to an unauthenticated fetch during this research pass, consistent with it requiring an EU Login session.)*

---

## 2. What Lifetime Oy needs on hand before starting

- [ ] EU Login (ECAS) account for the founder — create at `webgate.ec.europa.eu/cas` if none exists yet.
- [ ] Company legal documents (Business ID 0772407-9, VAT FI07724079 — both already in `CLAUDE.md` Legal Identity Rule):
  - [ ] Certificate of incorporation / trade register extract (Finnish: kaupparekisteriote), recent (typically <6 months old for validation, though self-registration alone may not require it yet)
  - [ ] VAT registration certificate
  - [ ] Legal representative's ID (founder's passport/ID)
  - [ ] Bank account details / IBAN (for the financial capacity check, needed later at Central Validation, not at self-registration)
- [ ] Company address confirmed as it appears on official documents: Laidunmaanraitti 2 A 25, 02330 Espoo, Finland (per Legal Identity Rule — confirm this matches the trade register exactly, since address mismatches are a common validation rejection reason)

---

## 3. The registration steps

1. **Log in to the Funding & Tenders Portal** (`ec.europa.eu/info/funding-tenders/opportunities/portal/`) with EU Login.
2. **Register the organisation** ("How to participate" → "Register your organisation" / the "Register an organisation" IT-How-To page). This is self-service and does not require CVS approval to get a PIC number.
3. **Receive the PIC** — typically issued near-instantly to within a few business days for a straightforward SME registration (third-party estimates: 5–10 business days typical; 2–3 weeks if documentation is incomplete or the organisation structure is unusual). Lifetime Oy is a simple single-entity Finnish Oy, so the fast end of that range is the reasonable expectation.
4. **Use the PIC in the Step 1 short application form** — this is the only thing Step 1 submission needs from this whole process.
5. **Do not wait for Central Validation to submit.** CVS validation (LEAR appointment, document verification) is only triggered *if and when* the proposal is selected — per the portal's own stated process, and confirmed by third-party EU-grants consultancies. Practitioner guidance recommends 6–8 weeks of runway before a deadline for CVS in a *consortium* context; Lifetime Oy is a single beneficiary, so this mainly matters for the Step 2 timeline, not Step 1.

---

## 4. Recommended sequencing against the EIC Step 1 timeline

- **Now:** start self-registration (§3 steps 1–3). This has no dependency on anything else in the EIC pack and should not wait for the RTOY reply, the video, or the dual-use log.
- **Before submitting the Step 1 form:** have the PIC in hand (should be well before 17.12.2026 given the short lead time in §3).
- **Only if Step 1 gets a GO:** begin gathering the Central Validation document set (trade register extract dated appropriately, financial statements, LEAR appointment) — that is when the 6–8 week consortium-style runway guidance becomes directly relevant, this time for Step 2.

---

## 5. Open item

- [ ] **Founder to confirm:** does Lifetime Oy already hold a PIC from a prior EU funding interaction (e.g., if any past Horizon/EIC/Erasmus application was ever started)? If a PIC already exists, re-registering is unnecessary and could create a duplicate-organisation conflict — check the Participant Register by VAT/Business ID first before creating a new entry.

## Sources

- EU Funding & Tenders Portal — "Registration and validation of your organisation" (Online Manual, OM space) — page returned 403 to unauthenticated fetch; founder should consult directly while logged in.
- EU Funding & Tenders Portal — "Register an organisation" (IT How-To, IT space) — same access note.
- Third-party EU-grants practitioner summaries (EMDESK Academy, general EU-grants consultancy guidance) via web search, 2026-07-29 — used for typical processing-time estimates only; the authoritative timeline is whatever the portal shows once the founder is registering.

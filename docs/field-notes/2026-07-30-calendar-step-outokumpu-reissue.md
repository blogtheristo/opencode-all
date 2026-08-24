<!--
VERSION AND AGENT HISTORY
Document: Step 6 of the HIC Learning Outcome, and the Outokumpu re-issue
Version: 1.0
Date: 2026-07-30
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code (Opus 5), session claude/enterprise-ai-harness-0anl7s
Purpose: Record (a) the HIC decision that the Learning Outcome gains a sixth step
         — calendar every dated commitment — and the missed-deadline incident that
         produced it, (b) the same-day strengthening of the weekend rule, and
         (c) the Outokumpu offer re-issue and its proposed letter to Ari T.
         Hirvonen, drafted but deliberately not sent.
Related: DWS_LEARNING_STANDARD.md v1.6 §4.1,
         kb/wiki/concepts/dates-live-in-calendars-not-documents.md,
         bids/OUTOKUMPU/OUTOKUMPU_TARJOUKSEN_UUDELLEENANTO.md,
         sales-outreach/EMAIL_ARI_HIRVONEN_OUTOKUMPU_UUDELLEENANTO.md

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/enterprise-ai-harness-0anl7s | Date: 30.07.2026 | Changes: Initial field note. Records Q7 and Q8, the six-step change, and the Outokumpu re-issue pack.
-->

# Field Note — Step 6, and the Offer That Lapsed Without Anyone Noticing

**Document Type:** Field Note — Standard Change + Customer Engagement
**Ontology Tags:** Geography > Finland, EU-27 | Sector > Steel, Dual-Use Manufacturing | Regulatory > EU AI Act Art. 14, Art. 12, NIS2, Tilaajavastuulaki | Entities > Outokumpu Oyj, Ari T. Hirvonen, Lifetime Oy, DWS IQ Aegis | Temporal > 2026-Q3 | Confidence > HIGH — HIC-stated decisions and verified file state

## 1. The incident

The Outokumpu pilot offer of 27.6.2026 declared its own 30-day validity. **It lapsed on 27.7.2026 and nobody noticed.** It surfaced three days later only because a session reading the bid pack for an unrelated reason happened to compute the date.

Nothing had been mis-recorded. The date appeared correctly in the offer letter, the price form, and the pilot sheet. What was absent was any mechanism that would raise it on the day.

The HIC named the general case in the same breath: *"I have forgot DLs and meetings. Would like to stay in the loop and meet requirements."*

## 2. What was actually wrong — and it was structural

The HIC Learning Outcome had five steps. Steps 1–4 make session knowledge **findable**; step 5 hands the HIC a decision to take **now**. Nothing in the loop handed the HIC anything to act on **later**.

So the loop was working exactly as designed and the deadline was missed anyway. Good documentation practice makes a fact retrievable *on demand* — which is worthless precisely when nobody is looking, and the trigger to look is the deadline itself. **The better the documentation, the more convincing the illusion of control.**

Captured as a KB concept: `kb/wiki/concepts/dates-live-in-calendars-not-documents.md`.

## 3. The change — a sixth step

`DWS_LEARNING_STANDARD.md` 1.4 → **1.6**, in lockstep with `CLAUDE.md` and `DWS_TRUTH_STANDARD.md` (4.0 → 4.1).

**Step 6 — Calendar every dated commitment**, specified in §4.1: what must be calendared (expiry / deadline / meeting / follow-up / **derived** dates); the three things every event carries (a title naming the *consequence*, the source file, a lead time matched to how long the action takes); placement on the calendar that owns the work; escalation to email only where missing the date is irreversible.

**The framing that makes it stick:** *step 5 hands the HIC what to decide now; step 6 hands them what to act on later.*

**Same-day correction (v1.5 → v1.6).** v1.5 said "shift the *reminder*, never the deadline" for weekend dates. The HIC overruled it within the hour: a Sunday event is a Friday event. The distinction that makes the shift safe is now explicit — **the calendar holds the action date, the document holds the deadline** — with a guard that a shifted event must never propagate back into a customer-facing document or statutory date. Superseded wording retained per Rule 12.

## 4. Dogfooded before codifying

Six Outokumpu dates went into the **Myynti pipeline** calendar with per-event lead times, and §4.1's rules were derived from doing it rather than imagined:

| Date | Event | Lead | Note |
| --- | --- | --- | --- |
| 3.8.2026 | Verovelkatodistus (OmaVero) | 1 d | Already breaches the 3-month threshold at the 14.8 tender moment |
| 14.8.2026 | Tarjoushetki | 3 d + email | |
| **25.9.2026** | Order new kaupparekisteriote | 7 d | **Moved from Sunday 27.9** — true expiry named in title and description |
| 30.9.2026 | Last signature date for 2026 delivery | 14 d + email | Capacity threshold |
| 1.12.2026 | Follow-up before expiry | 1 d | |
| 31.12.2026 | Offer validity ends | 7 d + email | |

Two of these exist *only* because the validity was extended — the register extract and the tax certificate both expire inside the new window, and either would have stalled a December signature.

## 5. The Outokumpu re-issue

**Framed as a re-issue, not an extension.** A lapsed offer cannot be unilaterally extended by the offeror; it is given again. Same terms, new validity to **31.12.2026** (HIC decision).

Unchanged: €24 000, 50/50 payment, 3 months, one Forta sub-line, free Phase 0, hardware CAPEX, cloud pass-through, €120/h follow-on. Price fixed for the whole period, not indexed.

Three things the longer window forced into the open: **capacity** (validity is not a capacity reservation — signature by 30.9 completes in 2026, Q4 completes Q1/2027), **tilaajavastuu certificates** (fresh ones promised free at signature), and **KPI 4 timing** (must be agreed before signature — adding an acceptance criterion mid-delivery changes what "done" means).

**The letter to Ari T. Hirvonen is drafted and deliberately not sent.** KPI 4 is framed as an *optional Phase 0 continuity module*, not an attached hurdle: Ari is the Patent IP Director and buys IP protection and CBAM speed; a network-outage test in his inbox uninvited creates internal friction before Operations is even involved. The message says the outage needs no physical cut (VLAN isolation, production network untouched) and that Operations and the CISO are the natural counterparts — making it a door, not an obstacle.

Attachment split: the re-issue letter attaches immediately; the pilot sheet and the tuntiraportti go **on request only**.

## 6. Learning Outcome (six-step)

1. **KB** — `kb/wiki/concepts/dates-live-in-calendars-not-documents.md` (new).
2. **Field note** — this file.
3. **`Learn/` HTML** — `DWS_LEARNING_STANDARD`, `EMAIL_ARI_HIRVONEN_OUTOKUMPU_UUDELLEENANTO`, `OUTOKUMPU_TARJOUKSEN_UUDELLEENANTO`, `OUTOKUMPU_TUNTIRAPORTTI`, `PILOT_SHEET_OUTOKUMPU_FORTA` rendered.
4. **Drive** — folder *Outokumpu — Tarjouksen uudelleenanto 2026-07-30*: the re-issue letter, the covering letter + attachment split, and the tuntiraportti, all marked LUONNOS / EI LÄHETETTY. **Partial: the pilot sheet v2.0 is rendered in `Learn/` but not yet in Drive** — stated per Rule 12 rather than omitted.
5. **HIC question** — Q8 below.
6. **Calendar** — six events, §4 above. Complete.

## 7. HIC decisions this session

**Q7 (ANSWERED 30.07.2026).** Should the Learning Outcome gain a calendar step? → **Yes.** Six-step minimum, shipped. Weekend rule strengthened same day: the event moves to Friday, not just the reminder.

### Q8 (OPEN) — Does the 240 h / €200 h basis in the tuntiraportti hold?

The hours annex derives **240 billable hours** from the offer's *"n. 1,5 henkilötyökuukautta"* and a **€200/h nominal senior rate**, giving €48 000 nominal, 50 % co-funded, €24 000 payable, €100/h effective. Every downstream figure — the co-funding argument, the €28 800 / €48 000 comparison table, the rate-card protection — rests on it. It is derived from the offer's prose, **not from a timesheet**.

**Options:**

1. **Confirm as-is** *(RECOMMEND)*. The arithmetic closes exactly and the €120/h follow-on rate in the sent price form is preserved and repositioned as preferential rather than contradicted. Cost: the 240 h is an estimate presented to a customer as a basis.
2. **Reconstruct from actual records** before the annex leaves the building. Slower, and possibly moves €100/h. Strongest under procurement challenge.
3. **Never send the annex** — keep it internal, answer any pricing question verbally. Loses the co-funding argument, which is the strongest part of the commercial story.

**Reversibility:** **ONE-WAY** the moment the annex reaches Outokumpu — a stated hourly basis cannot be quietly revised afterwards. Two-way while it stays internal.

**Recommendation: option 1**, with the annex held back from the first message (as the attachment split already specifies) so it only goes out if procurement asks — which converts a one-way door into one taken deliberately.

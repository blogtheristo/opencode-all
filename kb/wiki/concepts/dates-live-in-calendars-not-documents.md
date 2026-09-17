<!--
VERSION AND AGENT HISTORY
Document: dates-live-in-calendars-not-documents.md
Version: 1.0
Last-Updated: 2026-07-30
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (Opus 5)
Purpose: Canonical DWS concept behind Step 6 of the HIC Learning Outcome — a
         commitment recorded only in a document will be missed, because no
         document reminds anyone. HIC-raised 30.07.2026.
Introduced-In: PR-pending (branch claude/enterprise-ai-harness-0anl7s)
Branch: claude/enterprise-ai-harness-0anl7s
Owner: risto.paarni@lifetime.fi
-->

# Dates Live in Calendars, Not in Documents

**Version:** 1.0 · **Status:** Active — codified as `DWS_LEARNING_STANDARD.md` Step 6 / §4.1
**Companions:** `DWS_LEARNING_STANDARD.md` §4.1, `DWS_TRUTH_STANDARD.md` §2F, `CLAUDE.md` Session Learning Outcome Rule

## The claim

> **A commitment recorded only in a document will be missed. The record can be perfectly accurate and the obligation still lapses, because a document never speaks first.**

This is not about sloppy note-taking. It is about the difference between a **passive store** and an **active reminder**, and the fact that capture discipline produces the first and feels like the second.

## The incident that produced it

The Outokumpu pilot offer of 27.6.2026 stated, correctly and in writing, that it was valid 30 days. It **lapsed on 27.7.2026 with nobody noticing.** It was found three days later, and only because an unrelated session happened to read the file for another reason.

Nothing was mis-recorded. The date was in the offer letter, in the price form, and in the pilot sheet — three times, all correct. What was missing was any mechanism that would surface it on the day it mattered.

## Why capture-discipline hides the failure

A well-run documentation practice produces a strong feeling of control: the fact is written down, versioned, cross-referenced, and findable. Every one of those properties is about **retrieval on demand** — they help a person who is already looking. A deadline is precisely the case where nobody is looking, because the trigger to look *is* the deadline.

So the better the documentation, the more convincing the illusion. This is why the failure survives in disciplined organisations rather than careless ones.

## The two dates

Every obligation has two dates, and documents usually record only one:

| | What it is | Where it belongs |
| --- | --- | --- |
| **The deadline** | When the obligation falls | The document — contract, offer, filing, statute |
| **The action date** | When a human must start, so the deadline is met | The calendar |

The action date is almost always earlier, and is frequently **never written anywhere**. A three-month certificate implies a re-order date. A validity end implies a follow-up before it. A three-month engagement implies a last-date-to-sign for delivery inside the year. These are derived, obvious in hindsight, and reliably missed.

**Corollary (HIC decision 30.07.2026):** when the action date falls on a weekend or public holiday, the calendar event moves to the preceding working day and names the true date in its title. The calendar holds the action date; the document holds the deadline. **A shifted event must never propagate back into a customer-facing document, contract date or statutory filing date.**

## What follows operationally

1. **Calendar the commitment in the session that discovers it.** Deferring it is how it is lost — the session that found it is the only one that knows it exists.
2. **Calendar the derived dates, not only the stated ones.**
3. **Title the event with the consequence**, not the object: "Offer validity ends" beats "Outokumpu".
4. **Cite the source file in the event**, so the calendar entry traces back to the artifact — the artifact stays the source of truth, per Truth Standard §2E.
5. **Set the lead time from how long the action actually takes.** Default reminders are a way of being notified too late, politely.
6. **Put it on the calendar that owns the work**, not a personal one, so the date survives the individual.

## Relationship to Article 14

The HIC Learning Outcome exists so a human can genuinely oversee and override. Steps 1–5 make session knowledge findable and hand the HIC a decision to take **now**. None of them hand the HIC anything to act on **later** — and an oversight duty you cannot discharge because you missed the date is not discharged. Step 6 closes that, which is why it sits inside the Article 14 mechanism rather than in a productivity guide.

## The test

For any dated fact a session produces or discovers:

1. **Is it in a calendar, or only in a file?** If only in a file, it is not a commitment; it is a note about one.
2. **Is the *action* date there, or only the deadline?** If only the deadline, it will be actioned late.
3. **Does the lead time match the work?** A week's notice for a two-week job is a notification, not a warning.
4. **Would it survive this person leaving?** If it is on a personal calendar, no.

# Captain Referral Ask — Existing Pilot Customers

| Field | Value |
|-------|-------|
| **Document ID** | DWS-REF-001 |
| **Version** | 1.0 |
| **Date** | 2026-02-24 |
| **Funnel Stage** | Stage 1 — Warm Referral |
| **Target** | Current DWS IQ 6 pilot customers (two Q1/2026 enterprise pilots at EUR 29,950 each, plus four smaller landed accounts) |
| **Channels** | Email (primary), LinkedIn DM (secondary) |
| **Goal** | Each pilot customer refers 2-3 captain prospects from their network |

---

## Why This Works

Pilot customers already:
- Use the platform daily and see the value
- Know peers in their industry who face the same compliance pain
- Have credibility that a cold DM from Risto doesn't

A warm introduction from a user converts at 3-5x the rate of a cold outreach. One referral from each pilot customer = 8-12 qualified captain prospects.

---

## Email Template — Referral Ask

**Subject:** Quick ask — know anyone drowning in [REGULATION] reporting?

**From:** risto@onelifetime.world

---

> Hi [First Name],
>
> First — thank you for being one of our earliest users. Your feedback has shaped DWS IQ 6 in ways I couldn't have predicted, and the platform is stronger because of it.
>
> I have a quick ask.
>
> We're opening **8 Platinum Industry Captain seats** — EUR 50k SAFE investment at EUR 3.8M cap. Each Captain owns one of 16 EU industry verticals on the platform: founding login to the World Model, quarterly briefings, 1:1 strategy sessions, and direct influence over how DWS IQ serves their industry.
>
> **You're already seeing the platform work.** Who in your network would benefit from owning a seat?
>
> I'm looking for:
> - **CDOs, CTOs, or sustainability leads** in EU-regulated industries
> - People frustrated with manual compliance reporting (CSRD, ETS, CBAM)
> - Operators who think like investors — they want to own the tool, not just rent it
>
> If 2-3 names come to mind, I'd love a warm intro. A simple LinkedIn message or email CC works — I'll handle the rest.
>
> **What's in it for you:** Every Captain referral that closes earns you a **12-month platform credit** (EUR 2,400 value) plus priority access to the Captain Quarterly briefings. You've earned the right to be in the room where this gets built.
>
> The full Captain programme: https://dws10.com/captain/
> The deck and term sheet: https://dws10.com/captain/deck/
>
> Thank you for building this with us.
>
> Best,
> **Risto Anton Päärni**
> Founder & CEO, Lifetime Oy
> risto@onelifetime.world

---

## LinkedIn DM Version (Shorter)

> Hi [First Name],
>
> Quick ask from someone who values your input: we're opening Captain seats for DWS IQ 6 (EUR 50k SAFE, industry vertical ownership). You've seen the platform work firsthand.
>
> Who in your network would benefit from owning a seat? CDOs, CTOs, sustainability leads in regulated industries. A simple LinkedIn intro is all I need — I'll handle the rest.
>
> Referral perk: 12-month platform credit for every closed Captain.
>
> Details: dws10.com/captain/deck/
>
> — Risto

**Character count:** ~480

---

## Follow-Up (Day 5, if no reply)

**Subject:** Re: Quick ask — know anyone drowning in [REGULATION] reporting?

> Hi [First Name],
>
> Just floating this back up. No pressure at all — if names don't come to mind, that's perfectly fine.
>
> One thing that might help: the industries with the most open Captain seats right now are:
>
> - Steel & Metals (CBAM hitting hard)
> - Maritime (EU ETS expansion in 2026)
> - Real Estate (EPBD recast deadlines)
> - Chemicals (IED + CBAM overlap)
>
> Even one name would be a huge help.
>
> — Risto

---

## Referral Tracking

When a customer provides a referral:

1. **Log in Supabase:** Add to `outreach_threads` with `source = 'referral'` and `referrer_name`
2. **Send thank-you:** Immediate reply to the referrer confirming you'll reach out
3. **Intro the prospect:** Use Template B (CSO/sustainability) from `CAPTAIN_LINKEDIN_DM_GENERIC.md`, prefixed with "Hi [Name], [Referrer] suggested we connect..."
4. **Track conversion:** Update thread status through the funnel
5. **Deliver reward:** On Captain close, auto-generate 12-month platform credit

**API call to log referral:**
```json
{
  "first_name": "[Prospect Name]",
  "pipeline": "investor",
  "status": "intro_made",
  "source": "referral",
  "metadata": {
    "referrer": "[Customer Name]",
    "referrer_email": "[customer@company.com]",
    "campaign": "captain-referral-q1-2026"
  }
}
```

---

## Referral Incentive Structure

| Referral Outcome | Reward |
|-----------------|--------|
| Warm intro provided | Thank-you email + Captain Quarterly invite |
| Referral books a briefing call | EUR 600 platform credit (3 months) |
| Referral signs as Captain | EUR 2,400 platform credit (12 months) + Captain Quarterly access |

**Rule:** Rewards stack. If a customer refers 3 Captains who all close, they earn EUR 7,200 in credits — effectively free platform access for 3 years.

---

## Target: Which Customers to Ask First

Prioritize customers who:

| Priority | Criteria | Why |
|----------|----------|-----|
| 1 | Longest tenure (earliest adopters) | Most loyal, deepest platform knowledge |
| 2 | Highest usage (daily active) | Can speak to value from experience |
| 3 | In industries with open Captain seats | Their referrals are most relevant |
| 4 | Active on LinkedIn | More likely to make warm intros |

**Cadence:** Ask each customer once. Follow up once. Never push.

---

*Document Version 1.0 — 24 February 2026 — Lifetime Oy*

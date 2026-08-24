# Captain Acquisition Funnel

| Field | Value |
|-------|-------|
| **Document ID** | DWS-FUNNEL-001 |
| **Version** | 1.0 |
| **Date** | 2026-02-15 |
| **Owner** | Risto Anton Päärni, CEO |
| **Status** | Active |

---

## Overview

One DM does not close EUR 50,000. This document defines the 11-stage Captain acquisition funnel — from first touch to signed Captain with an active work plan.

**Channels:** LinkedIn + Email (primary). Landing page as the anchor.

**Landing page:** [dws10.com/captain/](https://dws10.com/captain/)

**Target:** 8 Platinum Industry Captain seats at EUR 50,000 SAFE in the first tranche.

---

## The 11-Stage Funnel

```
DM/Teaser → Webinar → Call → Whitepaper → Contract Proposal
→ Due Diligence → Benefits Showcase → Lunch & Signatures
→ Work Plan → Meetings → Captain Reporting
```

---

### Stage 1 — DM / Teaser (First Touch)

**Goal:** Get a reply. Not a close — a conversation.

**Channels:** LinkedIn DM + cold email (same message, adapted for format)

**Timing:** Day 0

**Action:**
- Send personalized teaser linking to `dws10.com/captain/`
- Reference their specific industry and a concrete regulatory pain point
- One question at the end — never a pitch deck

**LinkedIn DM template:** See `CONSTRUCTION_TEASER_DM.md`

**Email template:** Same content, add press release link and email signature

**Success metric:** Reply rate > 15%

**Email implementation:** `POST /api/v1/email/send` with source `outreach`, template type `custom`

---

### Stage 2 — Webinar (Educate)

**Goal:** Demonstrate platform depth without asking for money.

**Channels:** Email invite + LinkedIn event

**Timing:** Day 3-7 after reply

**Action:**
- Invite to a 30-minute Situation Room live demo for their industry
- Show the World Model, regulation tracker, and Situation Room Reports in action
- Keep it small — max 5 attendees per session, builds exclusivity
- Record for later use in Stage 6

**Format:** Google Meet or Zoom. Share screen of live platform.

**Content:**
1. 5 min — What Fit for 55 means for [their industry] in 2026-2028
2. 10 min — Live Situation Room walkthrough (their industry data)
3. 10 min — How the Captain program shapes the product
4. 5 min — Q&A

**Success metric:** 60%+ of replies attend webinar

---

### Stage 3 — Call (Qualify)

**Goal:** Understand their motivation, assess fit, qualify the ticket.

**Channels:** Phone or video call

**Timing:** Day 7-10 (immediately after webinar)

**Action:**
- 1:1 call with Risto
- Discover: Why this industry? What's their network? Can they commit EUR 50k?
- Assess: Are they crew or cargo? Will they do the quarterly introductions?
- Surface the engagement duties early — filter out passive money

**Key questions:**
1. "What's the biggest compliance headache in your industry right now?"
2. "Who in your network would be the first pilot customer?"
3. "The Captain role has quarterly engagement duties — introductions, product feedback, briefing attendance. Does that fit how you want to be involved?"

**Disqualifiers:**
- Can't name a single industry contact → not a Captain
- Wants passive returns only → redirect to Deputy or decline
- Unclear on the industry → wrong seat

**Success metric:** 70%+ of webinar attendees take the call

---

### Stage 4 — Whitepaper (Deep Dive)

**Goal:** Give them something to study. Build intellectual buy-in.

**Channels:** Email (PDF attachment or link)

**Timing:** Day 10-14 (after call)

**Action:**
- Send industry-specific whitepaper:
  - Regulatory landscape (which Fit for 55 mandates hit their industry, by when)
  - Market size and compliance cost data
  - How DWS IQ 6 automates the pain
  - Captain program structure and benefits
  - Traction data: MRR, pilots, infrastructure efficiency

**Whitepaper variants (create per industry):**
- Construction: CSRD + EPBD + EN 15978 carbon reporting
- Maritime: MRV + FuelEU Maritime + ETS for shipping
- Aviation: CORSIA + ETS aviation + SAF mandates
- Power & Heat: ETS Phase 4 + CBAM + renewable mandates
- Chemicals: ETS + CBAM + REACH + Industrial Emissions Directive

**Success metric:** Whitepaper downloaded/opened by 80%+ of call participants

---

### Stage 5 — Contract Proposal (Terms)

**Goal:** Put the SAFE on the table. No ambiguity.

**Channels:** Email (PDF)

**Timing:** Day 14-18

**Action:**
- Send formal SAFE note terms:
  - EUR 50,000 investment
  - EUR 3.8M valuation cap
  - 18% discount
  - Captain engagement duties (quarterly briefings, introductions, product feedback)
  - Named vertical lead acknowledgement
- Include YC SAFE template reference
- Attach term sheet summary (1 page) + full SAFE document

**Key elements:**
- Clear: no hidden terms
- Professional: lawyer-reviewed document
- Personal: cover note from Risto referencing their specific industry and call discussion

**Success metric:** 60%+ request due diligence after receiving proposal

---

### Stage 6 — Due Diligence for Certified Partnership

**Goal:** Show leadership, transparency, and substance. Let them verify.

**Channels:** Email (data room link) + follow-up call

**Timing:** Day 18-28

**Action:**
- Open data room with:
  - Company registration (Lifetime Oy, Finland)
  - Financial summary (MRR, burn rate, runway)
  - Platform architecture overview
  - Security documentation (ISO 27001 roadmap, EU data residency)
  - Customer references (anonymized if needed)
  - Team background
  - Signed pilot agreements (EUR 59,900)
  - Cloud credit documentation (Google, AWS, Groq, NVIDIA)
- Schedule DD call for questions
- Be transparent about what's early-stage and what's proven

**What Captains verify:**
- Is the company real? → Registration, bank, team
- Does the product work? → Live demo access, pilot references
- Is the market real? → Regulation timeline, mandatory compliance dates
- Can Risto execute? → Track record, platform traction, capital efficiency

**Success metric:** 80%+ of DD participants move to Stage 7

---

### Stage 7 — Benefits Showcase with DWS IQ 6 / Brochure

**Goal:** Make it tangible. Show what they get as Captain on Day 1.

**Channels:** Email (brochure PDF) + optional video call walkthrough

**Timing:** Day 25-30

**Action:**
- Send Captain Benefits Brochure:
  - Founding login to World Model + Situation Room
  - Their industry dashboard (mock-up with their vertical's data)
  - Quarterly briefing format and schedule
  - Captain identity: how they appear on the platform
  - Design partner introduction process
  - Annual strategy session format
- Optional: 15-minute video walkthrough of their specific industry view
- Link to live `dws10.com/captain/` page showing their seat status

**Brochure sections:**
1. What you own (the vertical)
2. What you see (Situation Room Reports)
3. What you shape (product roadmap influence)
4. What you get (quarterly briefings, strategy sessions, priority routing)
5. What we expect (engagement duties)
6. The terms (EUR 50k SAFE, EUR 3.8M cap, 18% discount)

**Success metric:** 70%+ express intent to proceed after showcase

---

### Stage 8 — Meeting Over Lunch and Signatures

**Goal:** Close. Face-to-face if possible.

**Channels:** In-person (Helsinki, Stockholm, or their city) or video call

**Timing:** Day 28-35

**Action:**
- Meet in person for final conversation
- Bring printed SAFE for signing (or DocuSign if remote)
- Keep it relaxed — lunch, coffee, or dinner
- Answer final questions
- Sign the SAFE
- Celebrate — they are now a Captain

**Logistics:**
- For Finnish/Nordic contacts: Helsinki meeting
- For DACH contacts: Video or travel to their city
- For remote: DocuSign + video call signing ceremony

**After signing:**
- Immediate welcome email with login credentials
- Captain profile creation on the platform
- Announce internally (team) and to other Captains (community)

**Success metric:** 80%+ of Stage 7 participants sign

---

### Stage 9 — Work Plan

**Goal:** Activate the Captain immediately. No dead air after signing.

**Channels:** Email + shared document

**Timing:** Day 35-42 (within 1 week of signing)

**Action:**
- Create joint 90-day Work Plan:
  - Month 1: Onboarding, platform access, first briefing, 1 industry introduction
  - Month 2: First design partner introduction routed, product feedback session
  - Month 3: First quarterly briefing, industry-specific feature review
- Assign Risto as their primary contact for the first 90 days
- Set up shared communication channel (email thread or Slack)

**Work plan template:**

| Week | Captain Action | DWS IQ Action |
|------|---------------|---------------|
| 1 | Platform onboarding, explore Situation Room | Set up industry dashboard, Captain profile |
| 2-3 | First industry introduction (1 contact) | Route design partner into their vertical |
| 4 | Product feedback on industry features | Implement top feedback item |
| 5-8 | Attend first quarterly briefing | Deliver industry-specific intelligence report |
| 9-12 | Second introduction, review roadmap | 1:1 strategy session, plan next quarter |

**Success metric:** 100% of Captains have active work plan within 7 days of signing

---

### Stage 10 — Meetings (Ongoing Engagement)

**Goal:** Sustain the relationship. Captains who engage stay; Captains who go silent become liability.

**Channels:** Video calls + email

**Timing:** Ongoing, quarterly cadence

**Action:**
- Quarterly briefing (all Captains together): transparency, metrics, roadmap
- Annual 1:1 strategy session (Platinum only): their industry's roadmap
- Ad hoc calls as needed for introductions, product feedback, or industry events
- Captain-to-Captain introductions where cross-industry value exists

**Quarterly briefing agenda:**
1. Platform metrics (MRR, users, customers)
2. Product roadmap update (what shipped, what's next)
3. Industry-specific intelligence highlights
4. Captain engagement scorecard (introductions made, feedback given)
5. Open Q&A

**Success metric:** 90%+ quarterly briefing attendance

---

### Stage 11 — Captain Reporting Follow-Up

**Goal:** Close the loop. Show Captains their impact.

**Channels:** Email (monthly report) + quarterly briefing

**Timing:** Monthly, starting Month 2

**Action:**
- Monthly Captain Report:
  - Platform metrics relevant to their industry
  - Introductions made → outcomes (pilot started, customer signed, etc.)
  - Product features shipped for their vertical
  - Next month's priorities
  - Their engagement score (introductions, attendance, feedback)
- Use this as the backbone for the next quarterly briefing
- Identify disengaged Captains early and intervene (personal call from Risto)

**Report format:**
```
CAPTAIN REPORT — [Industry] — [Month Year]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform:     EUR [X]k MRR (+[Y]% MoM)
Your vertical: [N] customers, [M] in pipeline
Introductions: [count] made → [outcomes]
Features:     [list of industry-specific features shipped]
Next month:   [priorities]
Your score:   [engagement rating]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Success metric:** 100% report delivery, <48hr response time to Captain questions

---

## Funnel Metrics Summary

| Stage | Name | Channel | Timing | Target Conversion |
|-------|------|---------|--------|------------------|
| 1 | DM / Teaser | LinkedIn + Email | Day 0 | 15% reply rate |
| 2 | Webinar | Email + LinkedIn | Day 3-7 | 60% of replies |
| 3 | Call | Phone / Video | Day 7-10 | 70% of webinar |
| 4 | Whitepaper | Email | Day 10-14 | 80% open rate |
| 5 | Contract Proposal | Email | Day 14-18 | 60% request DD |
| 6 | Due Diligence | Email + Call | Day 18-28 | 80% proceed |
| 7 | Benefits Showcase | Email + Call | Day 25-30 | 70% intent |
| 8 | Lunch & Signatures | In-person / Video | Day 28-35 | 80% sign |
| 9 | Work Plan | Email + Doc | Day 35-42 | 100% activated |
| 10 | Meetings | Video + Email | Quarterly | 90% attendance |
| 11 | Captain Reporting | Email | Monthly | 100% delivery |

**Estimated funnel math for 8 Platinum seats:**
- Need ~80 first touches (Stage 1) to close 8 Captains
- At 15% reply rate → 12 conversations
- At 60% webinar → 7 webinars
- Through funnel → 5-8 signed Captains

---

## Email Implementation

All outreach emails route through the existing Firehorse email infrastructure:

| Component | Endpoint / Service |
|-----------|-------------------|
| **Queue email** | `POST /api/v1/email/send` (async via Redis Streams) |
| **Direct email** | `POST /api/v1/email/send-direct` (immediate) |
| **Provider** | Amazon SES (SMTP only — Resend/SendGrid banned per CLAUDE.md Rule 4 / LD-2026-008) |
| **Source tracking** | `source: "outreach"` |
| **Audit trail** | Supabase `email_logs` + `email_queue` tables |
| **Daily digest** | Automatic Mon-Fri 06:00 via `daily-digest.ts` |

**Campaign tracking fields:**
- `campaign_id`: `captain-acquisition-2026-q1`
- `template_type`: `custom`
- `metadata.funnel_stage`: `1` through `11`
- `metadata.industry`: industry name
- `metadata.lead_id`: investor contact ID

---

## LinkedIn Workflow

LinkedIn is the primary channel for Stage 1 (DM) and Stage 2 (webinar invite).

**Daily cadence:**
- 5 connection requests to targeted industry operators (Mon-Fri)
- 3 personalized DMs to accepted connections
- 1 LinkedIn post per week referencing the Captain program (not selling — sharing industry insights)

**Profile optimization:**
- Headline references Fit for 55 + 16 captain hats (covering 25+ industries)
- Featured section links to `dws10.com/captain/`
- Activity: regular posts about EU regulation deadlines, industry compliance news

**DM rules:**
- Never send a pitch deck in first message
- Always reference something specific about their profile or company
- End with a question, not a CTA
- Follow up once at Day 3 if no reply, then stop

---

## File Index

| Deliverable | File | Status |
|-------------|------|--------|
| This funnel | `CAPTAIN_ACQUISITION_FUNNEL.md` | Active |
| Construction teaser DM | `CONSTRUCTION_TEASER_DM.md` | Active |
| Captain landing page | `dws10.com/captain/index.html` | Live |
| Investor outreach workflow | `OUTREACH_WORKFLOW.md` | Active |
| CEO Profile (Magazine) | `docs/CEO_PROFILE_RISTO_PAARNI_2026.md` | Active |
| Founder Playbook | `docs/FOUNDER_CREDIBILITY_PLAYBOOK.md` | Active |

---

*Document Version 1.0 — 15 February 2026 — Lifetime Oy*

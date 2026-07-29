# DWS6 Investor Outreach Workflow

---

# VERSION AND AGENT HISTORY

Version: 2.1

Sessions & Modifications:

- Version: 2.1 | Tool: Claude Code (Opus 5) | Session: claude/traction-truth-reconciliation | Date: 29.07.2026 | Changes: Traction claims reconciled to docs/TRACTION_CANONICAL.md — EUR 7-14k MRR / 6 paying customers / 100% retention / EUR 70k-120k LTV replaced with EUR 59,900 of contracted Q1/2026 pilot value, the services-and-transport revenue framing, and no asserted retention rate.
- Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-sales-call-script-xg1zO | Date: 21.03.2026 | Changes: Aligned to Fleet Admiral / Captain / Deputy Captain tier structure from INVESTOR_MEMO.md, updated dates to March 2026, fixed email sender to risto@onelifetime.world, updated traction to EUR 7-14k MRR, aligned email templates to Captain framing
- Version: 1.0 | Tool: Claude Code | Session: N/A (pre-session-tracking) | Date: 27.12.2025 | Changes: Initial creation — complete outreach workflow with email templates, Supabase tracking, daily automation

Session Links & References:

- Claude Code (claude/improve-sales-call-script-xg1zO): https://github.com/blogtheristo/dws6/commits/claude/improve-sales-call-script-xg1zO

Document Status:

- Created: 27.12.2025
- Last Modified: 21.03.2026
- Language: English
- Publication Status: ACTIVE

---

## Complete System Overview

This document describes the end-to-end investor outreach workflow, connecting cold email campaigns, the Captain landing page, Supabase tracking, and daily automation.

---

## Campaign Goal

**Objective**: Raise EUR 650K via Fleet Admiral / Captain tiered SAFE at EUR 3.8M cap

| Tier               | Investment  | Seats                | Status                       |
| ------------------ | ----------- | -------------------- | ---------------------------- |
| **Fleet Admiral**  | EUR 500,000 | 1                    | OPEN                         |
| **Captain**        | EUR 50,000  | 8 (one per industry) | OPEN (Construction priority) |
| **Deputy Captain** | TBD         | Unlimited            | NOT YET ACTIVE               |

**Round math:** EUR 500K (Fleet Admiral) + 8 x EUR 50K (Captain) = EUR 650K total

**Target**: 8-12 investor meetings per month
**Timeline**: Close Q2 2026
**Daily Activity**: 5 LinkedIn DMs + 5 emails (parallel channels to same 88-contact list)
**Arctic 15 deadline**: Helsinki 15.6.2026 — V1 launch, Captains in front row

---

## Current Status (March 2026)

### Traction Metrics

- **Software pipeline (contracted)**: EUR 59,900 — two Q1/2026 enterprise pilots at EUR 29,950 each, plus four smaller landed accounts (names redacted pending authorization)
- **Services and transport revenue**: ~EUR 7,000/month (licensed transport operation + consulting) — **not** software revenue; puts the company at cash break-even with a founder salary of EUR 0. Source: Lemonsoft bookkeeping.
- **Retention / churn**: not asserted — no cohort data
- **Customer LTV**: modelled only; no observed LTV — do not present as actual
- **Gross margin**: >90%
- **Infra cost**: EUR 15-50/month
- **Pipeline**: two enterprise pilots contracted Q1/2026 at EUR 29,950 each (EUR 59,900 booked)
- **Target**: EUR 900k ARR by end 2026 (target, not a run-rate)

### Third-Party Validation

- **Crunchbase Growth Score**: 91
- **Crunchbase Heat Score**: 86
- **CB Rank**: 104,995
- **Peachscore**: Cohort 25
- **Cloud Credits**: €100k+ secured (AWS, Google)

### Current Customers

| Customer             | Vertical     | Status | Annual Value        |
| -------------------- | ------------ | ------ | ------------------- |
| Logistics Operator 1 | Logistics    | Paid   | €70,000             |
| Logistics Operator 2 | Logistics    | Paid   | €60,000             |
| Logistics Operator 3 | Healthcare   | Paid   | €90,000             |
| Construction Co. A   | Construction | Pilot  | €80,000 (projected) |
| Construction Co. B   | Construction | Pilot  | €80,000 (projected) |

---

## 🔄 Complete Workflow (4 Components)

### 1. Cold Email Outreach

**Daily Process:**

```
9:00 AM Daily → Automation selects 20 investors from Supabase
              → Personalizes email templates
              → Sends emails with tracking links
              → Logs to campaign_logs table
              → Updates investor_contacts status
```

**Email Structure:**

- **Subject**: Personalized based on investor focus
- **Body**: 50-100 words
  - Reference specific portfolio company
  - Mention CSRD/Fit for 55 regulatory wave
  - Highlight traction (€59,900 of contracted Q1/2026 enterprise pilots)
  - Include link to Captain page (https://dws10.com/captain/)
- **CTA**: "Open to a brief call next week?"
- **Tracking**: UTM parameters + campaign_id + investor_id

**Example Email:**

```
Subject: Fit for 55 compliance automation for construction

Hi [First Name],

I noticed your investment in [Portfolio Company] and your focus
on climate tech. We're building CSRD compliance automation for
construction portfolios.

Current traction: two enterprise pilots contracted in Q1/2026 at
EUR 29,950 each (EUR 59,900 booked), plus four smaller landed accounts.

We're filling 8 Platinum Captain seats — EUR 50K SAFE at EUR 3.8M
cap. Each Captain owns one of 20 EU industry verticals.
Construction is available.

Full details: https://dws10.com/captain/?campaign={{campaign_id}}&investor={{investor_id}}

Open to a brief call next week?

Best,
Risto Anton Päärni
Founder & CEO, Lifetime Oy
risto@onelifetime.world
```

### 2. Captain Landing Page

**URL**: https://dws10.com/captain/
**Deck**: https://dws10.com/captain/deck/

**Page Content:**

1. **Hero Section**
   - Headline: "Own an Industry Vertical — Platinum Captain Seats"
   - Subtitle: "EUR 50k SAFE at EUR 3.8M cap, 18% discount"
   - Key metrics: EUR 59,900 of contracted Q1/2026 enterprise pilots, mandatory market
   - CTA: "Request full deck / intro call"

2. **Problem Section**
   - Construction reporting is broken
   - 40–80 hours manual work per project
   - €10k–€50k fines per project
   - Fit for 55 / CSRD mandatory 2025–2028

3. **Solution Section**
   - DWS IQ 6 + Firehorse automation
   - Plug into SAP/ERP, pull data automatically
   - AI validation, audit-ready reports
   - 4 weeks from contract to deployment

4. **Traction Section**
   - EUR 59,900 of contracted Q1/2026 enterprise pilots (two at EUR 29,950 each)
   - Four additional smaller landed accounts (names redacted pending authorization)
   - Separately, ~EUR 7,000/month services and transport revenue (licensed transport operation + consulting) — not software revenue
   - No retention or churn rate asserted — no cohort data

5. **This Round Section — Fleet Admiral / Captain**
   - Fleet Admiral: EUR 500K SAFE (1 seat — strategic co-pilot, board observer)
   - Captain: EUR 50K SAFE x 8 (one per industry — own a vertical)
   - Deputy Captain: TBD (unlimited, quarterly briefings, upgrade path)
   - Total round: EUR 650K at EUR 3.8M cap, 18% discount
   - Target close: Q2 2026 (Arctic 15 deadline: 15.6.2026)
   - What EUR 650K buys:
     - 3-5 flagship portfolios onboarded
     - Productized Fit for 55 module across 20 industries
     - Firehorse workflow scaled
     - 8 named industry verticals activated

6. **EUR 650K Campaign Carousel** (8 slides)
   - Slide 1: Big Hero (product headline)
   - Slide 2: The Pain (broken reporting)
   - Slide 3: Automation (how it works)
   - Slide 4: Better Reports & Dashboards
   - Slide 5: Investment & Efficiency (EUR 650K round, EUR 15-50/mo infra)
   - Slide 6: Revenue & ROI (EUR 900K ARR target)
   - Slide 7: Why Now (regulation live, first-mover)
   - Slide 8: Campaign Video

7. **Team Section**
   - Founder: 35+ years experience
   - SAP integration, regulatory compliance
   - Fortune 500 deployments
   - Finland advantage (AAA rating)

8. **Crunchbase Metrics**
   - Growth Score: 91
   - Heat Score: 86
   - CB Rank: 104,995

9. **Contact Section**
   - Email: investor@dws10.com
   - Full deck request link
   - Crunchbase profile link
   - Pitch video link
   - GitHub investor materials

**Tracking Implementation:**

```html
<script>
  // Track page visits from campaigns
  const urlParams = new URLSearchParams(window.location.search);
  const campaignId = urlParams.get("campaign");
  const investorId = urlParams.get("investor");

  if (campaignId && investorId) {
    // Log visit to Supabase
    fetch("https://your-project.supabase.co/rest/v1/campaign_logs", {
      method: "PATCH",
      headers: {
        apikey: "your-anon-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: campaignId,
        clicked: true,
        clicked_at: new Date().toISOString(),
      }),
    });
  }
</script>
```

### 3. Supabase Database

**Tables:**

**investor_contacts:**

```sql
- id (UUID)
- name (TEXT)
- email (TEXT UNIQUE)
- company (TEXT)
- investment_focus (TEXT[])
- preferred_stage (TEXT)
- check_size_min (NUMERIC)
- check_size_max (NUMERIC)
- geography (TEXT[])
- portfolio_companies (TEXT[])
- linkedin_url (TEXT)
- website_url (TEXT)
- status (TEXT) -- new, contacted, engaged, meeting, declined
- priority (INTEGER) -- 1-10 scoring
- notes (TEXT)
- source (TEXT)
- tags (TEXT[])
- last_contacted (TIMESTAMP)
- emails_sent (INTEGER)
- emails_opened (INTEGER)
- emails_clicked (INTEGER)
- emails_replied (INTEGER)
- meeting_scheduled (BOOLEAN)
- created_at (TIMESTAMP)
```

**campaign_logs:**

```sql
- id (UUID)
- campaign_date (DATE)
- investor_id (UUID) -- FK to investor_contacts
- email_subject (TEXT)
- email_template (TEXT)
- sent_at (TIMESTAMP)
- delivered (BOOLEAN)
- opened (BOOLEAN)
- opened_at (TIMESTAMP)
- clicked (BOOLEAN)
- clicked_at (TIMESTAMP)
- replied (BOOLEAN)
- replied_at (TIMESTAMP)
- bounce_reason (TEXT)
- created_at (TIMESTAMP)
```

**Data Flow:**

```
1. Research investor → Add to investor_contacts
2. Daily automation → Query eligible contacts
3. Send email → Insert into campaign_logs
4. Investor opens → Update campaign_logs.opened = true
5. Investor clicks → Update campaign_logs.clicked = true
6. Investor replies → Update campaign_logs.replied = true
7. Daily report → Aggregate metrics from campaign_logs
```

### 4. Daily Campaign Automation

**Schedule**: Runs daily at 9:00 AM

**Process:**

**Step 1: Query Eligible Contacts**

```sql
SELECT * FROM investor_contacts
WHERE status IN ('new', 'follow_up')
AND (last_contacted IS NULL OR last_contacted < NOW() - INTERVAL '7 days')
ORDER BY priority DESC
LIMIT 20;
```

**Step 2: Personalize Emails**

```javascript
for (const contact of contacts) {
  const firstName = contact.name.split(" ")[0];
  const portfolioCompany = contact.portfolio_companies[0];

  const email = {
    to: contact.email,
    subject: `Fit for 55 compliance automation for ${contact.investment_focus}`,
    html: personalizeTemplate(contact),
    tracking: {
      campaign_id: generateId(),
      investor_id: contact.id,
    },
  };
}
```

**Step 3: Send Emails**

```javascript
await emailService.send(email);
```

**Step 4: Log Campaign**

```javascript
await supabase.from("campaign_logs").insert({
  campaign_date: new Date().toISOString().split("T")[0],
  investor_id: contact.id,
  email_subject: email.subject,
  sent_at: new Date().toISOString(),
});
```

**Step 5: Update Contact**

```javascript
await supabase
  .from("investor_contacts")
  .update({
    status: "contacted",
    last_contacted: new Date().toISOString(),
    emails_sent: contact.emails_sent + 1,
  })
  .eq("id", contact.id);
```

**Step 6: Generate Report (6 PM)**

```javascript
const today = new Date().toISOString().split("T")[0];
const campaigns = await supabase.from("campaign_logs").select("*").eq("campaign_date", today);

const metrics = {
  sent: campaigns.length,
  opened: campaigns.filter((c) => c.opened).length,
  clicked: campaigns.filter((c) => c.clicked).length,
  replied: campaigns.filter((c) => c.replied).length,
};

console.log(`
📊 Daily Report - ${today}
━━━━━━━━━━━━━━━━━━━━━━━━
Sent:      ${metrics.sent}
Opened:    ${metrics.opened} (${pct(metrics.opened, metrics.sent)}%)
Clicked:   ${metrics.clicked} (${pct(metrics.clicked, metrics.sent)}%)
Replied:   ${metrics.replied} (${pct(metrics.replied, metrics.sent)}%)
`);
```

---

## 📧 Email Template Library

### Template 1: Climate Tech Funds

```
Subject: CSRD compliance automation for construction portfolios

Hi {{first_name}},

I noticed your investment in {{portfolio_company}} and your focus on
industrial decarbonization. We're building compliance automation for
construction's CSRD reporting challenge.

Current traction:
- EUR 59,900 of contracted Q1/2026 enterprise pilots (two at EUR 29,950 each)
- 2 construction pilots at EUR 59,900 level
- >90% gross margin, EUR 15-50/mo infra cost

We're filling 8 Platinum Captain seats — EUR 50K SAFE at EUR 3.8M
cap, 18% discount. Each Captain owns one of 20 EU industry verticals.
Construction is available.

Full details: https://dws10.com/captain/?campaign={{campaign_id}}&investor={{investor_id}}

Open to a brief call next week?

Best,
Risto Anton Päärni
Founder & CEO, Lifetime Oy
risto@onelifetime.world
```

### Template 2: Construction Tech Investors

```
Subject: Construction compliance automation - €59,900 in contracted Q1/2026 pilots

Hi {{first_name}},

Your portfolio company {{portfolio_company}} is solving {{problem}}.
We're tackling the adjacent challenge of CSRD compliance automation
for construction asset owners.

The market:
- 3.5M EU construction firms
- Fit for 55 / CSRD mandatory 2025-2028
- EUR 10k-50k fines per project without compliance

Our traction:
- EUR 59,900 of contracted Q1/2026 enterprise pilots (two at EUR 29,950 each)
- LTV is modelled, not observed
- 40+ hours/month saved per customer

We're filling 8 Platinum Captain seats — EUR 50K SAFE at EUR 3.8M
cap. Each Captain owns one industry vertical on the platform.
Construction is available.

Details: https://dws10.com/captain/?campaign={{campaign_id}}&investor={{investor_id}}

Would value 15 minutes to get your take on our approach.

Best,
Risto Anton Päärni
Founder & CEO, Lifetime Oy
risto@onelifetime.world
```

### Template 3: Business Angels

```
Subject: Construction climate compliance - exited founder perspective?

Hi {{first_name}},

As someone who built and exited {{company}} in the {{sector}} space,
you understand the challenge of selling into conservative construction
buyers.

We're automating CSRD compliance for construction portfolios:
- EUR 59,900 of contracted Q1/2026 enterprise pilots (two at EUR 29,950 each)
- 2 construction pilots at EUR 59,900 level
- Mandatory market (Fit for 55 live 2025-2028)

I'm filling 8 Platinum Captain seats — EUR 50K SAFE at EUR 3.8M cap,
18% discount. Each Captain owns one of 20 EU industry verticals.
Also seeking one Fleet Admiral (EUR 500K, board observer rights).

Full deck: https://dws10.com/captain/deck/?campaign={{campaign_id}}&investor={{investor_id}}

Available for a quick call this week?

Best,
Risto Anton Päärni
Founder & CEO, Lifetime Oy
risto@onelifetime.world
```

---

## 📊 Success Metrics & Targets

### Daily Metrics

- **Emails Sent**: 20/day
- **Delivery Rate**: >95% (19+ delivered)
- **Open Rate**: >25% (5+ opens)
- **Click Rate**: >5% (1+ clicks)
- **Response Rate**: >3% (0.6+ responses = 1 every 2 days)

### Weekly Metrics

- **Emails Sent**: 100 (20/day × 5 days)
- **Opens**: 25+
- **Clicks**: 5+
- **Responses**: 3+
- **Meetings Scheduled**: 2-3

### Monthly Metrics

- **Emails Sent**: 400+
- **Opens**: 100+
- **Clicks**: 20+
- **Responses**: 12+
- **Meetings Scheduled**: 8-12
- **Committed Investors**: 1-2

### Campaign Performance Dashboard

```
Campaign Performance — March 2026 (target)

88 Construction CXO contacts (parallel channels)
  LinkedIn DM: 88 x 15% = 13 demos
  Email:       88 x 10% = 9 demos
  Calls:       30 warm x 40% = 12 demos
  Deduplicated total: ~20-25 demos

20-25 Demos
  ↓ 30%
6-8 Captain conversations
  ↓ 10-15%
1 Captain signature (EUR 50K SAFE)

Second signature requires referral channel or list expansion beyond 88.
```

---

## 🎯 Investor Targeting (From TARGETING_QUICK_REFERENCE.md)

### Fleet Admiral Target (EUR 500K — 1 seat)

- **Profile**: Strategic co-pilot — fund, family office, or operator with board-level network
- **Value**: Board observer rights, annual 1:1 strategy, first right of refusal on follow-on
- **Geography**: Nordics + DACH + EU-focused global funds
- **Channels**: Warm intro only (accelerators, accountancy firm referrals, Captain 1 referral)

### Captain Targets (EUR 50K — 8 seats)

- **Profile**: Industry operators, CDOs, CTOs, CSOs in any of 20 EU regulated industries
- **Value**: Own one industry vertical, quarterly briefings, founding Situation Room access
- **Geography**: Nordics + DACH + Benelux + UK
- **Channels**: LinkedIn DM, cold email, industry events, trade association referrals

### Deputy Captain (TBD — unlimited, not yet active)

- **Profile**: Passive angels, smaller check operators
- **Value**: Quarterly briefings, upgrade path to Captain
- **Activation**: After first 2-3 Captains close

---

## Beyond LinkedIn — High-Signal CXO Channels

These channels convert faster than cold DMs for Fleet Admiral and Captain seats:

| #   | Channel                                                                            | Target                  | Why                                                                        |
| --- | ---------------------------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------- |
| 1   | **Industry events** — Rakennusmessut, Nordic Built, Greenbuild Europe              | All tiers               | Warm handshake converts faster than any DM                                 |
| 2   | **Trade associations** — RAKLI, EBC (European Builders Confederation), FIEC        | Captain                 | Members are exactly the operator tier                                      |
| 3   | **Referral from Captain 1** — whoever signs first                                  | Captain + Fleet Admiral | One warm intro from a peer CFO = 50 cold DMs                               |
| 4   | **Accelerators/hubs** — Business Finland, Cleantech Scandinavia, Nordic Innovation | Fleet Admiral + Captain | Curated CXO networks, warm intro culture                                   |
| 5   | **Accountancy/audit firms** — KPMG, Deloitte, PwC Nordic sustainability practices  | Fleet Admiral           | They advise the CFOs you're targeting, can refer you in as compliance tool |

**Rule:** LinkedIn DM + email are Week 1 channels. Events, associations, and referral channels activate in parallel and accelerate through the funnel. The Fleet Admiral seat will likely close through channel 4 or 5, not cold outreach.

---

## Technical Setup

### Required Tools

1. **Supabase**: Database for contacts and campaign tracking
2. **Email Service**: Amazon SES (primary) / Resend (fallback)
3. **Node.js**: Automation scripts
4. **Cron / Task Scheduler**: Daily campaign execution
5. **Analytics**: Supabase + custom dashboards

### Environment Variables

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
EMAIL_API_KEY=your-email-service-api-key
EMAIL_FROM=risto@onelifetime.world
EMAIL_FROM_NAME=Risto Anton Päärni
# Daily cap for investor outreach emails (LinkedIn DMs handled separately)
DAILY_LIMIT=5
SEND_HOUR=9
INVESTOR_PAGE_URL=https://dws10.com/captain/
```

---

## 📞 Contact & Resources

### Primary Contact

- **Email**: risto@onelifetime.world (SES-verified sender)
- **Alternative**: risto@lifetime.fi
- **Founder**: Risto Anton Päärni

### Key Resources

- **Captain Page**: https://dws10.com/captain/
- **Captain Deck**: https://dws10.com/captain/deck/
- **Crunchbase**: https://www.crunchbase.com/organization/lifetime-oy
- **Peachscore**: https://app.peachscore.com/company/lifetime-oy
- **GitHub**: https://github.com/blogtheristo/dws6
- **Pitch Video**: https://youtu.be/7pLs8IEzZfg?si=XggZ67cAusqnXjzs

### Documentation

- **INVESTOR_MEMO.md**: Complete investment terms and deal structure
- **TARGETING_QUICK_REFERENCE.md**: One-page targeting cheat sheet
- **DWS6_INVESTOR_PROFILES.md**: Detailed investor qualification guide
- **README.md**: Full outreach strategy

---

**Last Updated**: 21 March 2026
**Status**: Active — Fleet Admiral / Captain aligned
**Next Action**: Send Week 1 LinkedIn DMs to 6 priority construction contacts

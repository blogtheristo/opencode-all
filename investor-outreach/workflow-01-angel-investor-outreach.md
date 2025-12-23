# Angel Investor Outreach Workflow

## Overview
This workflow guides you through the process of identifying, contacting, and closing angel investors for the €150K SAFE round at €3.8M cap.

**Target:** €150K in 3-6 months
**Investor profile:** Climate tech angels, construction/proptech angels, AI/deep tech angels
**Check size:** €10K-€50K per angel

---

## Phase 1: Preparation (Week 1-2)

### 1.1 Build Investor Target List

**Climate Tech Angels** (Target: 20)
- [ ] Chris Neuman (The Assembly) – Urban tech, emissions reduction
- [ ] Simon Mantkelow (Green Angel Syndicate) – €25K-€50K checks
- [ ] Taavet Hinrikus – AI/climate overlap
- [ ] Eileen Burbidge – Fintech/sustainability
- [ ] [Add 16 more from investor-timeline.md resources]

**Proptech/Construction Angels** (Target: 15)
- [ ] Research top 50 Europe proptech angel lists
- [ ] Filter for sustainability/ESG focus
- [ ] Identify angels with construction industry experience
- [ ] Find angels who invested in compliance tech

**Deep Tech/AI Angels** (Target: 10)
- [ ] Focus on edge computing investors
- [ ] Target IoT/hardware-software hybrid investors
- [ ] Find angels with enterprise SaaS experience

**Syndicate Networks** (Target: 5)
- [ ] Green Angel Syndicate (james@greenangelsyndicate.com)
- [ ] Una Terra
- [ ] Sifted climate tech angel network
- [ ] LinkedIn angel groups (Climate Tech Angels Europe)
- [ ] Local Finnish angel groups

### 1.1.1 Using the Angel Investor Contact List

**Import the Contact List**
- [ ] Open `contacts-angel-investors.csv` in your CRM (Airtable, Notion) or Google Sheets
- [ ] Review pre-populated angel investors with focus areas and check sizes
- [ ] Add 40-50 more angels from your research (aim for 50+ total targets)

**Contact List Fields Explained**
- **Name**: Angel investor full name
- **Email**: Direct email (research via hunter.io, LinkedIn, company website)
- **LinkedIn**: LinkedIn profile URL
- **Phone**: Direct phone number (optional, use sparingly)
- **Location**: City/country
- **Focus Area**: Primary investment focus (climate tech, proptech, AI, etc.)
- **Check Size (EUR)**: Typical angel check range
- **Angel Network**: Syndicate or network affiliation
- **Portfolio Companies**: Relevant portfolio companies to reference
- **Personalization Notes**: Key insights for customizing outreach
- **Warm Intro Path**: Mutual connections who can introduce you
- **Contact Status**: Tracking stage (Not contacted, Outreach sent, Call scheduled, etc.)
- **Last Contact Date**: Date of most recent interaction
- **Next Action**: What to do next with this contact

**Research Each Angel** (15-20 min per person)
- [ ] LinkedIn: Check portfolio, background, recent posts about climate/AI/construction
- [ ] Crunchbase: View investment history and focus areas
- [ ] Twitter/X: See what they're talking about publicly
- [ ] Portfolio company websites: Understand their investment thesis
- [ ] News/press: Recent interviews, podcast appearances, articles

**Fill in Personalization Notes**
For each angel, document:
1. **Portfolio fit**: Which portfolio company is similar to DWS IQ 6?
2. **Background**: Relevant work experience or expertise
3. **Focus area**: Specific sub-sector (edge computing, carbon tracking, construction tech)
4. **Recent activity**: Recent investments, tweets, or posts you can reference
5. **Mutual connections**: LinkedIn connections in common
6. **Event attendance**: Will they be at Ecosummit, Slush, etc.?

**Example Personalization Research**

*Chris Neuman (The Assembly):*
```
Portfolio fit: Invests in urban tech for emissions reduction - DWS IQ 6 targets
construction (40% of urban emissions)

Background: Founded The Assembly, focus on climate solutions in built environment

Recent activity: Posted about EU Green Deal impact on construction (LinkedIn, Nov 2025)

Mutual connections: Jan Michael Hess (Ecosummit)

Event attendance: Likely at Ecosummit March 2026

Personalization angle: "I noticed The Assembly's focus on urban emissions reduction.
DWS IQ 6 tackles the construction sector—40% of EU CO₂—with edge AI that delivers
515% ROI. Given your background in built environment solutions, I'd love to share
how we're automating embodied carbon compliance for the EU 2028 mandate."
```

*Simon Mantkelow (Green Angel Syndicate):*
```
Portfolio fit: Invested in 10+ sustainable startups including methane detection
and biodiversity monitoring

Background: Exited Mindtools, active in Green Angel Syndicate

Check size: €25K-€50K average

Network: Green Angel Syndicate (james@greenangelsyndicate.com)

Personalization angle: "Your portfolio of sustainable startups—especially in
emissions monitoring—aligns perfectly with DWS IQ 6. We're applying similar real-time
tracking principles to embodied carbon in construction, an industry representing 40%
of EU emissions. Would love to share our pilot results showing €50-100K annual
savings per customer."
```

### 1.1.2 Automatic Personalization Workflow

**Step 1: Batch Research (Dedicate 1-2 days)**
- [ ] Block 4-6 hours for deep research on 20-30 angels
- [ ] Use LinkedIn, Crunchbase, Google News, Twitter
- [ ] Fill in "Personalization Notes" column for each angel
- [ ] Identify warm intro paths for at least 50% of your list

**Step 2: Create Personalization Snippets**

For each angel, write 1-2 sentence personalization snippets based on their type:

**Climate Tech Angels**
```
"I noticed your investment in [Portfolio Company] focused on [specific climate problem].
DWS IQ 6 takes a similar approach for construction—the sector responsible for 40% of
EU CO₂—using edge AI to automate embodied carbon compliance for the 2028 EU mandate."
```

**Proptech/Construction Angels**
```
"Given your background in proptech and investments in [Construction Tech Company], you
understand the regulatory shift hitting 3.5M EU construction firms in 2028. DWS IQ 6
is the operating system for SMEs who need real-time carbon compliance without adding
headcount—validated at €50-100K annual savings."
```

**AI/Deep Tech Angels**
```
"Your portfolio focus on edge computing and industrial AI (e.g., [Portfolio Company])
aligns perfectly with DWS IQ 6. We're using NVIDIA Jetson to deliver <100ms inference
on construction sites—25× faster than cloud—while cutting infrastructure costs by 86%."
```

**ESG/Impact Angels**
```
"Your focus on ESG impact investing in [sector] suggests DWS IQ 6 could be a strong
fit. We're helping 3.5M EU SMEs reduce carbon footprint profitably—validated €50-100K
savings per customer—ahead of the 2028 embodied carbon mandate."
```

**Syndicate Members**
```
"[Lead Angel Name] mentioned you're active in [Syndicate Name] and focus on
sustainability. DWS IQ 6 fits your thesis: industrial decarbonization with proven ROI
(515% hardware payback) and a clear regulatory catalyst (EU 2028 mandate)."
```

**Step 3: Mail Merge Setup** (if using Gmail or CRM)

Set up mail merge fields in your email tool:
- `{{first_name}}` - Angel first name
- `{{full_name}}` - Full name
- `{{focus_area}}` - Their investment focus
- `{{portfolio_company}}` - Relevant portfolio company
- `{{personalization}}` - Your custom 1-2 sentence snippet
- `{{mutual_connection}}` - Name of warm intro (if applicable)
- `{{calendly_link}}` - Your scheduling link

**Step 4: Use the Updated Angel Letter Template**

The new `01-angel-investor-letter.md` template includes:
- Pre-written personalization options by angel type
- Mail merge variables
- Modular sections you can customize per angel

**Step 5: Personalize Each Email (10-15 min per angel)**

For each outreach email:
1. Copy base template from `01-angel-investor-letter.md`
2. Replace `{{placeholders}}` with actual data from contact list
3. Insert your custom personalization snippet from research
4. Add 1 specific detail (recent post, portfolio company, mutual connection)
5. Proofread for name spelling, company names, accuracy
6. Send or schedule for optimal time (Tue-Thu, 9-11am local time)

**Example: Personalized Email for Chris Neuman**

```
Subject: DWS IQ 6 – ROI-positive climate AI platform raising €150k SAFE

Hi Chris,

I'm Risto, founder & CEO of Lifetime Oy in Finland. We're building DWS IQ 6, an edge
AI platform that helps high‑carbon industries (starting with construction) meet upcoming
EU embodied‑carbon and Fit for 55 requirements without adding compliance headcount.

Where we are now:
- ~€140k in revenue from early customers and pilots
- 8 target industries (construction first) with clear EU regulatory pull for 2028
- Hybrid AWS IoT + NVIDIA Jetson + Google Cloud + Groq stack delivering <100ms edge inference
- €135k in secured startup credits and an architecture that saves ~€333k vs pure‑cloud over 12 months

[... rest of template ...]

Why I'm reaching out to you specifically:

I noticed The Assembly's focus on urban tech for emissions reduction. DWS IQ 6 tackles
the construction sector—which represents 40% of EU CO₂—with edge AI that delivers 515% ROI.
Given your background in built environment solutions and your recent LinkedIn post about
the EU Green Deal's impact on construction, I'd love to share how we're automating embodied
carbon compliance for the 2028 mandate.

If this aligns with your focus on climate tech and urban emissions, I'd love to schedule a
30-minute call to walk through the tech stack and pilot results.

Reply with your availability, or book directly: [Calendly link]

Looking forward to connecting!

Best,
Risto Anton Päärni
```

**Step 6: Track Personalization Effectiveness**

In your CRM, track which personalization angles work best:
- Portfolio company reference → 25% response rate
- Mutual connection mention → 40% response rate
- Recent post/activity reference → 30% response rate
- Background/expertise → 20% response rate
- Event attendance → 35% response rate

Adjust your approach based on what converts.

### 1.2 Prepare Collateral

**Core Documents**
- [ ] Finalize angel investor letter (use template 01-angel-investor-letter.md)
- [ ] Create 1-page executive summary with key metrics
- [ ] Prepare pitch deck (10 slides max)
  - Problem: EU 2028 mandate, 3.5M companies
  - Solution: DWS IQ 6 edge AI platform
  - Moat: 515% ROI, €135K credits, hybrid edge-cloud
  - Traction: €140K revenue, 2-3 pilots
  - Financials: Path to €281K profit in 12 months
  - Ask: €150K SAFE @ €3.8M cap
- [ ] Update GitHub repo with latest architecture
- [ ] Create demo video (3 minutes) showing platform in action

**Supporting Materials**
- [ ] ROI calculator (Excel/Google Sheets)
- [ ] Customer testimonials or letters of intent
- [ ] Technical whitepaper (2-3 pages)
- [ ] Financial model (12-month projection)
- [ ] SAFE agreement template
- [ ] Data room setup (Google Drive or Notion)
  - Company documents
  - Financial statements
  - Customer contracts
  - Technical documentation
  - IP and legal docs

### 1.3 Set Up Tracking System

**CRM Setup** (Use Notion, Airtable, or Google Sheets)
- [ ] Create investor pipeline tracker
  - Columns: Name, Email, LinkedIn, Focus Area, Check Size, Status, Last Contact, Next Action
  - Statuses: Researching, Outreach, Initial Call, Due Diligence, Negotiating, Committed, Passed
- [ ] Set up email templates in Gmail/Outlook
- [ ] Schedule weekly review sessions for pipeline management
- [ ] Create calendar for follow-up reminders

---

## Phase 2: Warm Outreach (Week 3-4)

### 2.1 Leverage Existing Network

**First-Degree Connections**
- [ ] List all LinkedIn connections who are angels or know angels
- [ ] Reach out to existing advisors, mentors, customers for intros
- [ ] Contact Ecosummit (jan@ecosummit.net) for angel intros
- [ ] Ask AWS/Google/Groq account managers for investor connections
- [ ] Reach out to fellow founders in climate tech for warm intros

**Warm Introduction Template**
```
Subject: Introduction to [Angel Name]

Hi [Mutual Connection],

Hope you're doing well! I'm raising a €150K SAFE for DWS IQ 6, our edge AI platform
for EU carbon compliance. We've validated €50-100K annual savings per customer and
have a clear path to profitability in 12 months.

I noticed you're connected to [Angel Name] who invests in [climate tech/proptech/AI].
Would you be willing to make an introduction? Happy to send a forwardable blurb.

Thanks!
Risto
```

**Forwardable Blurb**
```
Hi [Angel Name],

My colleague Risto is building DWS IQ 6—edge AI for EU carbon compliance in construction.
They're raising €150K on a SAFE and have:
• €140K revenue, path to €281K profit in 12 months
• 515% hardware ROI proven
• EU 2028 mandate creating €40B market

Worth a conversation if you're looking at climate tech. Intro?

[Your Name]
```

### 2.2 Event-Based Outreach

**Upcoming Events** (from investor-timeline.md)
- [ ] Ecosummit March 25-26, 2026 – Book 1:1s with attending angels
- [ ] Slush 2026 November – Schedule meeting table
- [ ] Wolves Summit – Multiple events Q1-Q2 2026
- [ ] Local Helsinki/Finnish startup events

**Pre-Event Strategy**
- [ ] Get attendee list 2-4 weeks before event
- [ ] Research angels who will attend
- [ ] Send pre-event outreach: "Will you be at [Event]? I'd love to connect."
- [ ] Book 15-20 minute coffee chats during event
- [ ] Prepare printed one-pagers and business cards

**Post-Event Follow-Up**
- [ ] Send personalized follow-up within 24 hours
- [ ] Reference specific conversation points
- [ ] Attach pitch deck and investor letter
- [ ] Propose next step (call, demo, due diligence)

---

## Phase 3: Cold Outreach (Week 5-8)

### 3.1 LinkedIn Outreach

**Step-by-Step Process**

**Day 1-2: Profile Optimization**
- [ ] Update LinkedIn profile with DWS IQ 6 highlights
- [ ] Add "Raising €150K SAFE" to headline
- [ ] Create featured section with GitHub repo, demo video
- [ ] Post about the fundraise with key metrics

**Day 3-14: Connection Requests** (10 per day)
```
Hi [Angel Name],

I'm building DWS IQ 6—edge AI for EU carbon compliance. We've validated 515%
hardware ROI and have a clear path to profitability.

Currently raising €150K SAFE. Would love to connect if you're investing in
climate tech!

Risto
```

**Day 15-30: Messaging Accepted Connections** (Wait 2-3 days after acceptance)
```
Hi [Angel Name],

Thanks for connecting! DWS IQ 6 helps EU construction firms comply with the
2028 embodied carbon mandate using edge AI (<100ms decisions).

We're raising €150K SAFE @ €3.8M cap. €140K revenue, path to €281K profit
in 12 months.

Open to a quick call to share more? Here's our deck: [Link]

Best,
Risto
```

### 3.2 Email Outreach

**Finding Email Addresses**
- [ ] Use hunter.io, apollo.io, or similar tools
- [ ] Check angel's company website
- [ ] Look for email patterns (firstname@company.com)

**Cold Email Template** (Use 01-angel-investor-letter.md as base)
```
Subject: €150K SAFE, 515% ROI, 12-month profitability – DWS IQ 6

Hi [Angel Name],

I'm Risto, CEO of Lifetime Oy. We're raising €150K SAFE @ €3.8M cap for DWS IQ 6
—edge AI for EU carbon compliance.

Why now: EU 2028 mandate hits 3.5M construction firms. We deliver <100ms carbon
decisions via NVIDIA Jetson, 25× faster than cloud.

Traction:
• €140K revenue from pilots
• 515% hardware ROI validated
• €135K in AWS/Google/Groq credits
• Path to +€281K profit in 12 months

Our customers (Vinci, Bouygues, ACS) save €50-100K/year. We're looking for climate
tech angels to join this round.

30-min call to walk through the opportunity?

Full deck: [Link]
GitHub: https://github.com/blogtheristo/dws6

Best,
Risto Anton Päärni
risto@lifetime.fi
```

**Email Sequence** (if no response)
- Day 0: Initial outreach
- Day 4: Follow-up #1 (share new metric or customer win)
- Day 10: Follow-up #2 (ask direct question: "Is this a fit for your portfolio?")
- Day 20: Final follow-up (soft close: "Moving forward with other investors. Last chance to join.")

### 3.3 Angel Networks & Syndicates

**Green Angel Syndicate**
- [ ] Apply via james@greenangelsyndicate.com
- [ ] Submit pitch deck and investor letter
- [ ] Schedule pitch presentation (if accepted)
- [ ] Follow up with individual syndicate members

**Una Terra**
- [ ] Research application process
- [ ] Tailor pitch for biodiversity/climate angle
- [ ] Submit application

**Other Syndicates**
- [ ] Research regional syndicates (Nordic, EU-wide)
- [ ] Join relevant angel network Slack/Discord communities
- [ ] Participate in pitch events and demo days

---

## Phase 4: Initial Meetings (Week 6-12)

### 4.1 Prepare for Investor Calls

**Before Each Call**
- [ ] Research investor's portfolio (LinkedIn, Crunchbase)
- [ ] Find common connections or interests
- [ ] Review their investment thesis
- [ ] Prepare 3-5 questions to ask them
- [ ] Have pitch deck and demo ready to screen share

**Call Structure** (30 minutes)
1. **Intro** (2 min): Your background, company mission
2. **Problem** (3 min): EU 2028 mandate, 3.5M companies, €40B market
3. **Solution** (5 min): DWS IQ 6 platform, edge AI, 515% ROI
4. **Traction** (5 min): €140K revenue, pilots, path to profitability
5. **Ask** (3 min): €150K SAFE, €3.8M cap, use of funds
6. **Demo** (7 min): Show platform in action (if requested)
7. **Q&A** (5 min): Answer questions, address concerns

**After Each Call**
- [ ] Send thank you email within 2 hours
- [ ] Attach any requested materials
- [ ] Propose clear next step
- [ ] Update CRM with notes and action items
- [ ] Set calendar reminder for follow-up

### 4.2 Handle Common Objections

**"The valuation is too high for this stage."**
→ "We've validated €50-100K annual savings per customer, have €140K in revenue,
and a clear path to profitability. The €3.8M cap reflects our proven traction
and the €40B market opportunity created by the EU 2028 mandate."

**"How will you compete with larger players?"**
→ "Incumbents offer cloud-only solutions with >2s latency and no edge capabilities.
We're 25× faster with 86% lower costs. Our hybrid architecture is our moat."

**"What if the EU delays the 2028 mandate?"**
→ "Even without the mandate, we're delivering €50-100K in annual savings through
efficiency gains. The mandate accelerates adoption, but our ROI stands on its own."

**"Your burn rate seems high."**
→ "We have €135K in secured credits reducing infrastructure costs by 86%. Our
12-month forecast shows +€281K profit, making this a bridge to profitability,
not just another round."

**"Who else is in the round?"**
→ (If you have commits): "We have €X committed from [Angel Names/Syndicates].
Looking to close the final €Y with the right strategic angels."
→ (If you don't): "We're in conversations with several climate tech and proptech
angels. Hoping to close the round in [Timeline] with 3-5 strategic investors."

### 4.3 Provide Due Diligence Materials

**Data Room Contents**
- [ ] Executive summary and pitch deck
- [ ] Financial model (12-month forecast)
- [ ] Customer contracts or letters of intent
- [ ] Technical architecture documentation
- [ ] Product demo video
- [ ] SAFE agreement template
- [ ] Cap table (current state)
- [ ] Company registration and legal docs
- [ ] IP overview (if applicable)
- [ ] Team CVs and backgrounds

**Due Diligence Call** (45-60 min)
- [ ] Schedule with investor after initial interest
- [ ] Bring in technical co-founder or CTO (if applicable)
- [ ] Deep dive on technology, market, financials
- [ ] Answer all questions transparently
- [ ] Request feedback and concerns
- [ ] Clarify timeline for decision

---

## Phase 5: Negotiation & Close (Week 12-16)

### 5.1 Term Negotiation

**Key SAFE Terms**
- **Valuation cap**: €3.8M (standard, non-negotiable for this round)
- **Discount**: 20% (standard, some flexibility to 15-25%)
- **MFN** (Most Favored Nation): Yes (standard)
- **Pro rata rights**: Optional (consider for larger checks €30K+)

**Negotiation Tips**
- [ ] Be firm on valuation cap (backed by traction)
- [ ] Be flexible on discount (within 15-25% range)
- [ ] Offer pro rata to strategic angels only
- [ ] Don't negotiate too hard—preserve relationship
- [ ] Get legal review before signing (lawyer or service like Ledgy)

### 5.2 Create Urgency

**Deadline Tactics**
- [ ] Set a clear close date: "We're closing the round on [Date]"
- [ ] Share momentum: "We have €X committed, closing final €Y this month"
- [ ] Highlight external events: "Need to deploy funds before Q2 pilot programs"
- [ ] Use scarcity: "Only €30K remaining in the round"

### 5.3 Close the Deal

**Commitment Letter**
- [ ] Send simple commitment template:
  ```
  I, [Angel Name], commit to investing €[Amount] in Lifetime Oy via SAFE
  agreement at €3.8M cap with 20% discount.

  Signature: _____________
  Date: _____________
  ```
- [ ] Request signed letter before sending SAFE docs

**SAFE Execution**
- [ ] Use YC SAFE template or local equivalent
- [ ] Have lawyer review (or use Ledgy, Carta, etc.)
- [ ] Send via DocuSign or local e-signature platform
- [ ] Set 7-day deadline for signature
- [ ] Follow up daily if unsigned

**Wire Transfer Instructions**
- [ ] Provide company bank details
- [ ] Request proof of transfer
- [ ] Confirm receipt within 24 hours
- [ ] Send thank you note and welcome packet

### 5.4 Post-Close

**Investor Onboarding**
- [ ] Add to cap table
- [ ] Send welcome email with update schedule
- [ ] Add to investor email list (monthly updates)
- [ ] Schedule quarterly investor calls
- [ ] Invite to Lifetime™World launch (Dec 2026)
- [ ] Thank them publicly on LinkedIn (with permission)

**Leverage for Next Round**
- [ ] Ask for introductions to VC contacts
- [ ] Request LinkedIn endorsements
- [ ] Invite to refer other angels
- [ ] Use as social proof in future pitches

---

## Metrics & Goals

### Weekly Targets
- **Outreach**: 50 new investors contacted (LinkedIn + email)
- **Responses**: 10 responses (20% response rate)
- **Calls**: 3-5 investor calls scheduled
- **Follow-ups**: 20 follow-up emails to previous contacts

### Monthly Targets
- **Month 1**: Build list (50 investors), warm outreach (20), initial calls (5)
- **Month 2**: Cold outreach (100), investor calls (15), due diligence (3)
- **Month 3**: Close first commits (€30-50K), create urgency, close round

### Success Metrics
- **Target**: €150K in 3-6 months
- **Investor count**: 3-8 angels (average €18K-€50K each)
- **Conversion rate**: 5-10% from outreach to commitment
- **Time to close**: <90 days from first outreach

---

## Templates & Resources

### Quick Reference
- Angel investor letter: `investor-outreach/01-angel-investor-letter.md`
- Pitch deck: [Create and link]
- Financial model: [Create and link]
- SAFE template: [YC SAFE or local equivalent]
- Email templates: [See sections above]

### Tools
- **CRM**: Notion, Airtable, HubSpot (free tier), Google Sheets
- **Email finder**: Hunter.io, Apollo.io, Snov.io
- **E-signature**: DocuSign, HelloSign, SignNow
- **Cap table**: Carta, Ledgy, Pulley
- **Calendar**: Calendly for easy scheduling

### Support
- **Legal**: Find startup-friendly lawyer for SAFE review
- **Accounting**: Ensure proper bookkeeping for investor funds
- **Advisors**: Leverage Ecosummit, World Fund, other mentors for intros

---

## Troubleshooting

### "I'm not getting responses to cold outreach"
- Improve subject lines (test A/B variants)
- Shorten email to <100 words
- Add social proof (customer logos, traction metrics)
- Try different channels (LinkedIn + email + Twitter)
- Get warm intros instead of cold outreach

### "Investors are interested but not committing"
- Create urgency with deadline
- Show momentum (other commits, customer wins)
- Address objections directly in follow-up
- Offer smaller check size to reduce barrier
- Ask directly: "What would it take to get you to commit?"

### "The round is taking too long to close"
- Reduce target (close €75K first, then extend)
- Accept smaller checks to build momentum
- Increase outreach volume (2× current efforts)
- Attend more events for face-to-face meetings
- Consider switching to VC/seed strategy if angel path slow

---

## Next Steps

1. [ ] Complete Phase 1 preparation (Week 1-2)
2. [ ] Start warm outreach (Week 3)
3. [ ] Begin cold outreach (Week 5)
4. [ ] Schedule first 10 investor calls (Week 6-8)
5. [ ] Enter negotiation with interested angels (Week 10-12)
6. [ ] Close first tranche of round (Week 12-14)
7. [ ] Close final tranche and celebrate! (Week 14-16)

**Start date:** [Insert date]
**Target close date:** [Insert date + 12-16 weeks]

Good luck! 🚀

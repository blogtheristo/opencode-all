# Investor Outreach Strategy

## Overview

This directory contains all resources, strategies, and workflows for investor outreach campaigns.

## Current Workflow

### 1. Cold Email Reach
- **Daily Volume**: 20 outbound emails
- **Target**: Qualified investors matching our criteria
- **Goal**: Schedule intro calls and pitch meetings
- **Contact**: investor@dws10.com

### 2. Captain Landing Page
- **Location**: `https://dws10.com/captain/`
- **Deck**: `https://dws10.com/captain/deck/`
- **Purpose**: Central hub for Captain seat programme and investor information
- **Content**:
  - 8 Platinum Captain seats (EUR 50k SAFE, EUR 3.8M cap, 18% discount)
  - Current traction: EUR 59,900 of contracted Q1/2026 enterprise pilots (two at EUR 29,950 each) plus four smaller landed accounts. Separately ~EUR 7,000/month services and transport revenue (licensed transport operation + consulting) — not software revenue. No retention rate is asserted.
  - Industry vertical ownership model
  - Full pitch deck
  - Contact information

### 3. Investor Database (Supabase)
- **Table**: `investor_contacts`
- **Fields**:
  - `id`: UUID
  - `name`: Full name
  - `email`: Contact email
  - `company`: Investment firm/organization
  - `focus`: Investment focus areas
  - `stage`: Preferred investment stage
  - `status`: Lead status (new, contacted, engaged, meeting, declined)
  - `notes`: Additional context
  - `created_at`: Timestamp
  - `last_contacted`: Last outreach date

### 4. Daily Campaign Automation
- **Schedule**: Runs daily at 9:00 AM
- **Process**:
  1. Query Supabase for new/follow-up contacts
  2. Select 20 contacts based on priority
  3. Personalize email templates
  4. Send emails via email service
  5. Update contact status
  6. Log campaign metrics

## Email Templates

### Initial Outreach
```
Subject: [Personalized based on investor focus]

Hi [First Name],

I noticed your interest in [specific sector/stage] investments and thought you might be interested in what we're building at DWS6.

[Brief value proposition - 2-3 sentences]

Would you be open to a brief call next week to explore if there's a fit?

Best regards,
[Your Name]
```

### Follow-up (7 days)
```
Subject: Following up - [Company Name]

Hi [First Name],

I wanted to follow up on my previous email about DWS6. 

[New angle or recent achievement]

Are you available for a 15-minute call this week?

Best,
[Your Name]
```

### Meeting Request
```
Subject: Quick call about [specific topic]?

Hi [First Name],

Based on your portfolio in [sector], I think there's strong alignment with what we're building.

Could we schedule 15 minutes this week? Here's my calendar: [link]

Thanks,
[Your Name]
```

## Campaign Stages

1. **Research**: Identify and qualify investors
2. **Database Entry**: Add to Supabase with complete profile
3. **Initial Outreach**: Send personalized cold email
4. **Follow-up 1**: 7 days after initial (if no response)
5. **Follow-up 2**: 14 days after initial (if no response)
6. **Engagement**: Track opens, clicks, replies
7. **Meeting**: Schedule and conduct pitch
8. **Pipeline**: Move to active fundraising pipeline

## Targeting Criteria

### Institutional Investors (Funds)

- **Investment Stage**: Seed / Seed-extension (bridge to Series A in 2026)
  - Not pre-seed; comfortable with an early software base of €59,900 in contracted Q1/2026 pilots
  - Target €900k ARR by 2026 (target, not a run-rate)
  
- **Sector Focus**: 
  - Climate tech
  - Industrial decarbonization
  - Construction & infrastructure SaaS
  - ESG/CSRD compliance automation
  - Industrial AI
  
- **Geography**: 
  - Primary: Nordics + DACH + Benelux + UK
  - Secondary: EU-focused climate funds globally (including US funds with EU climate/infra thesis)
  
- **Check Size**: €100k–€500k (lead investors)
  
- **Portfolio Fit**: Funds who have invested in:
  - Construction tech
  - Infrastructure/asset management SaaS
  - Climate reporting / ESG tooling
  - Regulatory/"mandatory spend" SaaS
  - Industrial automation platforms

### Business Angels (€15k–€50k)

- **Stage**: Late seed / seed extension
  - Comfortable with an early software base of €59,900 in contracted Q1/2026 pilots
  - Path to ~€900k ARR in 2026 (target, not a run-rate)
  
- **Profile**: 
  - Exited founders
  - Senior operators (construction, infrastructure, logistics, climate/ESG SaaS)
  
- **Ticket Size**: €15k–€50k per angel
  
- **Value-Add Role**: 
  - Sparring partner / strategic advisor
  - Door opening (construction/infra portfolio owners, ESG/CSRD consulting)
  
- **Geography**: 
  - Nordics, DACH, Benelux, UK
  - Preferably EU-focused with EU regulatory understanding
  
- **Portfolio Fit**: Previous investments in:
  - Construction tech
  - Infrastructure/climate reporting
  - "Mandatory spend" SaaS

## Compliance

- ✅ CAN-SPAM compliant unsubscribe link
- ✅ Physical mailing address in footer
- ✅ Accurate "From" information
- ✅ Clear subject lines
- ✅ Honor opt-out requests within 10 days

## Performance Metrics

Track these metrics for each campaign:

- **Sent**: Total emails sent
- **Delivered**: Successfully delivered
- **Opened**: Unique opens
- **Clicked**: Link clicks
- **Replied**: Responses received
- **Meetings**: Calls scheduled
- **Conversion**: Meeting → Term sheet

## Tools & Integrations

- **Database**: Supabase
- **Email Service**: [Your ESP]
- **Scheduling**: [Calendar tool]
- **Analytics**: Campaign tracking dashboard
- **CRM**: Lead management system

## Best Practices

1. **Personalize**: Reference specific investments or portfolio companies
2. **Be Concise**: Keep emails under 100 words
3. **Clear CTA**: Single, specific call-to-action
4. **Timing**: Send Tuesday-Thursday, 9-11 AM
5. **Follow-up**: Maximum 2 follow-ups, then pause
6. **Track**: Monitor all metrics for optimization

## Next Steps

1. Create investor target list
2. Research each investor thoroughly
3. Add to Supabase database
4. Customize email templates
5. Schedule first campaign
6. Monitor and optimize

---

**Campaign Status**: Active
**Last Campaign**: [Date]
**Next Campaign**: [Date]

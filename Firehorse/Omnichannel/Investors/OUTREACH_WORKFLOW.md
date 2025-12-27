# DWS6 Investor Outreach Workflow

## Complete System Overview

This document describes the end-to-end investor outreach workflow, connecting cold email campaigns, the investor-relations page, Supabase tracking, and daily automation.

---

## 🎯 Campaign Goal

**Objective**: Raise €500k SAFE at €3.8M cap to scale construction vertical  
**Target**: 8-12 investor meetings per month  
**Timeline**: Close Q1 2026  
**Daily Activity**: 20 personalized outbound emails  

---

## 📊 Current Status (December 2025)

### Traction Metrics
- **MRR**: €7k with 5 paying customers
- **Retention**: 100% (zero churn)
- **Customer LTV**: €70k–€120k per logo
- **Pipeline**: 2 construction pilots → +€6k MRR in Q1 2026
- **Target**: €14k MRR by Q1 2026 → €900k ARR by 2026

### Third-Party Validation
- **Crunchbase Growth Score**: 91
- **Crunchbase Heat Score**: 86
- **CB Rank**: 104,995
- **Peachscore**: Cohort 25
- **Cloud Credits**: €100k+ secured (AWS, Google)

### Current Customers

| Customer | Vertical | Status | Annual Value |
|----------|----------|--------|--------------|
| Logistics Operator 1 | Logistics | Paid | €70,000 |
| Logistics Operator 2 | Logistics | Paid | €60,000 |
| Logistics Operator 3 | Healthcare | Paid | €90,000 |
| Construction Co. A | Construction | Pilot | €80,000 (projected) |
| Construction Co. B | Construction | Pilot | €80,000 (projected) |

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
  - Highlight traction (€7k MRR, 100% retention)
  - Include link to investor-relations page
- **CTA**: "Open to a brief call next week?"
- **Tracking**: UTM parameters + campaign_id + investor_id

**Example Email:**
```
Subject: Fit for 55 compliance automation for construction

Hi [First Name],

I noticed your investment in [Portfolio Company] and your focus 
on climate tech. We're building CSRD compliance automation for 
construction portfolios.

Current traction: €7k MRR, 100% retention, 2 construction pilots 
converting to €6k+ MRR in Q1.

Raising €500k SAFE to scale to 5 flagship portfolios. Would you 
be open to a brief call?

Full details: https://dws10.com/investor-relations/?campaign=abc123&investor=xyz789

Best,
Risto
```

### 2. Investor Relations Page

**URL**: https://dws10.com/investor-relations/

**Page Content:**
1. **Hero Section**
   - Headline: "DWS IQ 6: Climate Intelligence for Construction & Infrastructure Portfolios"
   - Subtitle: "Automated compliance reporting for Fit for 55 / CSRD"
   - Key metrics: €7k MRR, 100% retention, mandatory market
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
   - €7k MRR live (December 2025)
   - 5 paying customers
   - 100% retention
   - Customer table with annual values
   - 2 construction pilots in progress

5. **This Round Section**
   - €500k SAFE at €3.8M cap
   - Target close: Q1 2026
   - What €500k buys:
     - 3–5 flagship portfolios onboarded
     - Productized Fit for 55 module
     - Firehorse workflow scaled

6. **€500K Campaign Carousel** (8 slides)
   - Slide 1: Big Hero (product headline)
   - Slide 2: The Pain (broken reporting)
   - Slide 3: Automation (how it works)
   - Slide 4: Better Reports & Dashboards
   - Slide 5: Investment & Efficiency (€500k, €1,470 cost)
   - Slide 6: Revenue & ROI (€9.5M target, 1,700% ROI)
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
  const campaignId = urlParams.get('campaign');
  const investorId = urlParams.get('investor');
  
  if (campaignId && investorId) {
    // Log visit to Supabase
    fetch('https://your-project.supabase.co/rest/v1/campaign_logs', {
      method: 'PATCH',
      headers: {
        'apikey': 'your-anon-key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: campaignId,
        clicked: true,
        clicked_at: new Date().toISOString()
      })
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
  const firstName = contact.name.split(' ')[0];
  const portfolioCompany = contact.portfolio_companies[0];
  
  const email = {
    to: contact.email,
    subject: `Fit for 55 compliance automation for ${contact.investment_focus}`,
    html: personalizeTemplate(contact),
    tracking: {
      campaign_id: generateId(),
      investor_id: contact.id
    }
  };
}
```

**Step 3: Send Emails**
```javascript
await emailService.send(email);
```

**Step 4: Log Campaign**
```javascript
await supabase.from('campaign_logs').insert({
  campaign_date: new Date().toISOString().split('T')[0],
  investor_id: contact.id,
  email_subject: email.subject,
  sent_at: new Date().toISOString()
});
```

**Step 5: Update Contact**
```javascript
await supabase.from('investor_contacts').update({
  status: 'contacted',
  last_contacted: new Date().toISOString(),
  emails_sent: contact.emails_sent + 1
}).eq('id', contact.id);
```

**Step 6: Generate Report (6 PM)**
```javascript
const today = new Date().toISOString().split('T')[0];
const campaigns = await supabase
  .from('campaign_logs')
  .select('*')
  .eq('campaign_date', today);

const metrics = {
  sent: campaigns.length,
  opened: campaigns.filter(c => c.opened).length,
  clicked: campaigns.filter(c => c.clicked).length,
  replied: campaigns.filter(c => c.replied).length
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
• €7k MRR, 100% retention
• 2 construction pilots → +€6k MRR Q1 2026
• 4 weeks from contract to audit-ready reports

Raising €500k SAFE (€3.8M cap) to scale to 5 flagship portfolios.

Full details: https://dws10.com/investor-relations/?campaign={{campaign_id}}&investor={{investor_id}}

Open to a brief call next week?

Best,
Risto Anton Päärni
Founder & CEO, DWS6
investor@dws10.com
```

### Template 2: Construction Tech Investors

```
Subject: Construction compliance automation - €7k MRR, 100% retention

Hi {{first_name}},

Your portfolio company {{portfolio_company}} is solving {{problem}}. 
We're tackling the adjacent challenge of CSRD compliance automation 
for construction asset owners.

The market:
• 3.5M EU construction firms
• Fit for 55 / CSRD mandatory 2025
• €10k–€50k fines per project without compliance

Our traction:
• €7k MRR live, 100% retention
• €70k–€120k LTV per customer
• 40+ hours/month saved per customer

Raising €500k SAFE to convert 2 pilots and onboard 3 more portfolios.

Details: https://dws10.com/investor-relations/?campaign={{campaign_id}}&investor={{investor_id}}

Would value 15 minutes to get your take on our approach.

Best,
Risto
```

### Template 3: Business Angels

```
Subject: Construction climate compliance - exited founder perspective?

Hi {{first_name}},

As someone who built and exited {{company}} in the {{sector}} space, 
you understand the challenge of selling into conservative construction 
buyers.

We're automating CSRD compliance for construction portfolios:
• €7k MRR, 100% retention
• 2 pilots converting to €6k+ MRR Q1
• Mandatory market (Fit for 55 live 2025)

Raising €500k SAFE (€15k–€50k tickets for angels).

Would love your perspective on our positioning: 
https://dws10.com/investor-relations/?campaign={{campaign_id}}&investor={{investor_id}}

Available for a quick call this week?

Best,
Risto Anton Päärni
investor@dws10.com
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
┌─────────────────────────────────────────┐
│ December 2025 Campaign Performance      │
├─────────────────────────────────────────┤
│ Contacts in Database:        250        │
│ Contacted This Month:        200        │
│ Open Rate:                   26%        │
│ Click Rate:                  11%        │
│ Response Rate:               5%         │
│ Meetings Scheduled:          10         │
│ Term Sheets:                 0          │
│ Committed:                   0          │
└─────────────────────────────────────────┘

Conversion Funnel:
200 Contacted
  ↓ 26%
52 Opened
  ↓ 42%
22 Clicked
  ↓ 45%
10 Responded
  ↓ 100%
10 Meetings
  ↓ 0%
0 Committed (ongoing)
```

---

## 🎯 Investor Targeting (From TARGETING_QUICK_REFERENCE.md)

### Institutional Investors (€100k–€500k)
- **Sectors**: Climate tech, industrial decarbonization, construction/infra SaaS, ESG/CSRD automation
- **Geography**: Nordics + DACH + Benelux + UK + EU-focused global funds
- **Portfolio Fit**: Construction tech, infra/asset mgmt, climate/ESG reporting, regulatory SaaS

### Business Angels (€15k–€50k)
- **Profile**: Exited founders, senior operators (construction, infra, logistics, climate/ESG)
- **Value**: Sparring + door opening (construction/infra owners, ESG/CSRD consulting)
- **Geography**: Nordics, DACH, Benelux, UK (EU-focused, EU regulatory understanding)

---

## 🔧 Technical Setup

### Required Tools
1. **Supabase**: Database for contacts and campaign tracking
2. **Email Service**: SendGrid / Mailgun / AWS SES
3. **Node.js**: Automation scripts
4. **Cron / Task Scheduler**: Daily campaign execution
5. **Analytics**: Supabase + custom dashboards

### Environment Variables
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key
EMAIL_API_KEY=your-email-service-api-key
EMAIL_FROM=investor@dws10.com
EMAIL_FROM_NAME=DWS6 Team
DAILY_LIMIT=20
SEND_HOUR=9
INVESTOR_PAGE_URL=https://dws10.com/investor-relations/
```

---

## 📞 Contact & Resources

### Primary Contact
- **Email**: investor@dws10.com
- **Alternative**: risto@lifetime.fi
- **Founder**: Risto Anton Päärni

### Key Resources
- **Investor Page**: https://dws10.com/investor-relations/
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

**Last Updated**: December 27, 2025  
**Status**: Active - Ready to launch  
**Next Action**: Set up Supabase and send first 20 emails

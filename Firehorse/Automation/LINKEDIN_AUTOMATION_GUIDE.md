# LinkedIn Sales Navigator Automation Guide

## Overview

LinkedIn Sales Navigator can be integrated into your investor outreach workflow to complement email campaigns. This guide covers tools, best practices, and workflows for automated LinkedIn outreach.

---

## ⚠️ Important Disclaimer

**LinkedIn's Terms of Service**: LinkedIn prohibits automation tools that violate their User Agreement. Using third-party automation tools can result in account restrictions or bans. 

**Recommended Approach**: Use LinkedIn's official API and approved tools, or use semi-automated workflows that require human oversight.

---

## 🎯 LinkedIn Outreach Strategy

### Why LinkedIn for Investor Outreach?

✅ **Higher Response Rates**: LinkedIn messages often get 2-3x higher response rates than cold emails  
✅ **Professional Context**: Investors expect business development on LinkedIn  
✅ **Rich Profiles**: See portfolio, interests, recent activity before reaching out  
✅ **Warm Introductions**: Leverage mutual connections  
✅ **Multi-Touch**: Combine with email for higher conversion  

### LinkedIn vs Email

| Channel | Open Rate | Response Rate | Best For |
|---------|-----------|---------------|----------|
| **Cold Email** | 20-30% | 2-5% | Detailed pitch, attachments |
| **LinkedIn InMail** | 30-50% | 10-25% | Initial contact, warm intro |
| **LinkedIn Connection + Message** | 40-60% | 15-30% | Building relationship |

---

## 🛠️ Automation Tools (Ranked by Safety)

### Tier 1: Safest (LinkedIn-Approved)

#### 1. **LinkedIn Sales Navigator (Native)**
- **What**: LinkedIn's official premium tool
- **Features**: 
  - Advanced search filters (industry, company size, geography)
  - Lead recommendations
  - InMail credits (50/month with Premium)
  - CRM integration
  - Lead lists and saved searches
- **Automation**: Limited, but can export to CSV
- **Price**: $99/month (Professional), $149/month (Team)
- **Risk**: ✅ Zero (official tool)

#### 2. **LinkedIn Campaign Manager API**
- **What**: Official LinkedIn advertising API
- **Features**: Sponsored InMail campaigns
- **Automation**: Full automation via API
- **Price**: Pay per send ($0.50-$2.00 per InMail)
- **Risk**: ✅ Zero (official API)

### Tier 2: Semi-Safe (Human-in-the-Loop)

#### 3. **Dux-Soup** (Chrome Extension)
- **What**: Semi-automated LinkedIn tool
- **Features**:
  - Auto-visit profiles
  - Auto-endorse skills
  - Auto-send connection requests
  - Auto-send messages (with delays)
  - Export to CSV
- **Automation**: Requires browser to be open
- **Price**: $14.99/month (Pro)
- **Risk**: ⚠️ Low (mimics human behavior, requires oversight)
- **URL**: https://www.dux-soup.com/

#### 4. **Expandi.io**
- **What**: Cloud-based LinkedIn automation
- **Features**:
  - Smart sequences (view → connect → message)
  - Personalization with variables
  - A/B testing
  - CRM integration
  - Safety limits (daily caps)
- **Automation**: Runs in cloud, mimics human behavior
- **Price**: $99/month
- **Risk**: ⚠️ Low-Medium (cloud-based, has safety features)
- **URL**: https://expandi.io/

#### 5. **Phantombuster**
- **What**: Cloud automation platform
- **Features**:
  - LinkedIn profile scrapers
  - Auto-connect and message
  - Export to CSV/Google Sheets
  - Zapier integration
- **Automation**: Scheduled cloud automation
- **Price**: $59/month (Starter)
- **Risk**: ⚠️ Medium (more aggressive, needs careful setup)
- **URL**: https://phantombuster.com/

### Tier 3: Higher Risk (Aggressive Automation)

#### 6. **LinkedHelper**
- **What**: Desktop automation software
- **Features**: Full LinkedIn automation suite
- **Price**: $15/month
- **Risk**: ⚠️⚠️ Medium-High (desktop bot, more detectable)

#### 7. **Octopus CRM**
- **What**: Chrome extension for LinkedIn automation
- **Features**: Auto-connect, message, endorse
- **Price**: $9.99/month
- **Risk**: ⚠️⚠️ Medium-High (aggressive automation)

---

## 🎯 Recommended Setup for DWS6

### Option 1: Safe & Manual (Recommended for Start)

**Tools**: LinkedIn Sales Navigator + Manual Outreach

**Workflow**:
```
1. Sales Navigator Search → Filter investors
2. Export to CSV (50 leads/day limit)
3. Import to Supabase
4. Manual review and personalization
5. Send connection requests (20-30/day)
6. Send messages after connection (10-15/day)
7. Track in Supabase
```

**Pros**: Zero risk, highest quality, best for small volume  
**Cons**: Time-consuming, not scalable  
**Best For**: High-value targets (Priority 9-10 investors)

### Option 2: Semi-Automated (Recommended for Scale)

**Tools**: LinkedIn Sales Navigator + Dux-Soup + Supabase

**Workflow**:
```
1. Sales Navigator Search → Save search
2. Dux-Soup auto-visits profiles (50/day)
3. Dux-Soup auto-sends connection requests (20/day)
4. After connection: Dux-Soup sends message (template)
5. Export activity to CSV
6. Import to Supabase for tracking
7. Manual follow-up for engaged leads
```

**Pros**: Scalable, safe with limits, tracks activity  
**Cons**: Requires browser open, some manual work  
**Best For**: Medium-priority targets (Priority 6-8 investors)

### Option 3: Fully Automated (Use with Caution)

**Tools**: LinkedIn Sales Navigator + Expandi.io + Supabase + Zapier

**Workflow**:
```
1. Sales Navigator Search → Export to CSV
2. Upload to Expandi.io
3. Expandi runs sequence:
   - Day 1: View profile
   - Day 2: Send connection request
   - Day 5: Send message (if connected)
   - Day 12: Follow-up message (if no reply)
4. Expandi webhooks → Zapier → Supabase
5. Track all activity in Supabase
6. Manual intervention for hot leads
```

**Pros**: Fully automated, scalable, tracked  
**Cons**: Higher risk, requires monitoring, monthly cost  
**Best For**: Low-priority targets (Priority 4-5 investors)

---

## 📋 LinkedIn Sales Navigator Search Filters

### For Climate Tech Funds

**Search Criteria**:
```
Title: 
- Partner
- Principal
- Investment Manager
- Venture Capitalist

Industry:
- Venture Capital & Private Equity
- Environmental Services

Company:
- [Specific fund names from your target list]

Geography:
- Nordic Countries
- DACH Region
- Benelux
- United Kingdom

Keywords:
- "climate tech"
- "climate fund"
- "ESG"
- "sustainability"
- "decarbonization"
```

### For Construction Tech Investors

**Search Criteria**:
```
Title:
- Partner
- Investment Director
- Managing Partner

Industry:
- Venture Capital & Private Equity
- Construction

Keywords:
- "construction tech"
- "PropTech"
- "infrastructure"
- "real estate tech"

Recent Activity:
- Posted about construction/climate in last 90 days
```

### For Business Angels

**Search Criteria**:
```
Title:
- Founder
- CEO
- Angel Investor
- Advisor

Past Company:
- [Exited construction tech companies]

Industry:
- Construction
- Real Estate
- Logistics

Keywords:
- "angel investor"
- "exited founder"
- "construction"
- "climate tech"
```

---

## 📧 LinkedIn Message Templates

### Connection Request (300 characters max)

#### Template 1: Climate Tech Focus
```
Hi [Name], noticed your investment in [Portfolio Company]. 
We're automating CSRD compliance for construction portfolios 
(€59,900 in contracted Q1/2026 pilots). Worth connecting?
```

#### Template 2: Construction Tech Focus
```
Hi [Name], saw your focus on construction tech. We're building 
CSRD automation for construction portfolios. Raising €500k SAFE. 
Would value your perspective.
```

#### Template 3: Mutual Connection
```
Hi [Name], [Mutual Connection] suggested we connect. We're 
automating Fit for 55 compliance for construction. Would love 
to share what we're building.
```

### First Message (After Connection)

#### Template 1: Climate Tech Funds
```
Hi [Name],

Thanks for connecting! I'm Risto, Founder of DWS IQ 6.

We automate CSRD / Fit for 55 reporting for construction 
portfolios – turning 40–80 hours of Excel into audit-ready 
reports.

Current traction:
• Two enterprise pilots contracted Q1/2026 at €29,950 each (€59,900 booked)
• Four additional smaller landed accounts
• LTV is modelled, not observed

Raising €500k SAFE (€3.8M cap) to scale to 5 flagship portfolios.

Given your investment in [Portfolio Company] and focus on 
[climate/construction], would you be open to a brief call?

Full details: https://dws10.com/investor-relations/

Best,
Risto
```

#### Template 2: Construction Tech Investors
```
Hi [Name],

Thanks for connecting!

Quick intro: We're automating CSRD compliance for construction 
portfolios. The market is mandatory (Fit for 55 live 2025) and 
we're first to market.

Traction: two enterprise pilots contracted in Q1/2026 at 
€29,950 each (€59,900 booked), plus four smaller landed accounts.

Raising €500k SAFE to convert pilots and onboard 3 more 
portfolios.

Your portfolio company [Company] is solving [problem]. We're 
tackling the adjacent compliance automation challenge.

Worth a quick call to explore fit?

Best,
Risto
investor@dws10.com
```

#### Template 3: Business Angels
```
Hi [Name],

Thanks for connecting!

As someone who built and exited [Company] in the [sector] 
space, you understand the challenge of selling into 
conservative construction buyers.

We're automating CSRD compliance for construction portfolios:
• €59,900 of contracted Q1/2026 enterprise pilots
• Mandatory market (Fit for 55 live 2025)
• €15k–€50k angel tickets

Would love your perspective on our approach.

Quick call this week?

Best,
Risto
investor@dws10.com
```

### Follow-Up Message (7 Days Later)

```
Hi [Name],

Following up on my previous message about DWS IQ 6.

Quick update: Just converted one pilot to paid, adding €3k MRR.

Still raising €500k SAFE at €3.8M cap. Would a 15-minute call 
work this week to explore if this fits your [climate/construction] 
thesis?

Here's my calendar: [link]

Best,
Risto
```

---

## 🔄 Integrated Workflow: LinkedIn + Email

### Multi-Touch Sequence

**Day 1: LinkedIn**
- View profile on Sales Navigator
- Send connection request with personalized note

**Day 3: Email** (if no LinkedIn response)
- Send cold email to investor's email address
- Reference LinkedIn connection request

**Day 5: LinkedIn** (if connected)
- Send first LinkedIn message with pitch

**Day 7: Email Follow-Up** (if no response)
- Send follow-up email

**Day 10: LinkedIn Follow-Up** (if no response)
- Send follow-up LinkedIn message

**Day 14: Email Final Touch** (if no response)
- Send final email with specific ask

**Day 21: Pause**
- Mark as "paused" in Supabase
- Re-engage in 90 days

### Conversion Tracking

```javascript
// Track LinkedIn activity in Supabase

// When connection request sent
await supabase.from('investor_contacts').update({
  linkedin_connection_sent: true,
  linkedin_connection_sent_at: new Date(),
  status: 'linkedin_pending'
}).eq('id', investorId);

// When connection accepted
await supabase.from('investor_contacts').update({
  linkedin_connected: true,
  linkedin_connected_at: new Date(),
  status: 'linkedin_connected'
}).eq('id', investorId);

// When LinkedIn message sent
await supabase.from('campaign_logs').insert({
  investor_id: investorId,
  channel: 'linkedin',
  message_type: 'first_message',
  sent_at: new Date()
});

// When LinkedIn message replied
await supabase.from('investor_contacts').update({
  linkedin_replied: true,
  linkedin_replied_at: new Date(),
  status: 'engaged'
}).eq('id', investorId);
```

---

## 📊 LinkedIn Outreach Metrics

### Daily Limits (Safe)

| Activity | Safe Limit | Aggressive Limit | Risk Level |
|----------|------------|------------------|------------|
| **Profile Views** | 50-100/day | 200+/day | Low → High |
| **Connection Requests** | 20-30/day | 50+/day | Low → High |
| **Messages** | 10-20/day | 50+/day | Low → High |
| **InMails** | 10-15/day | 30+/day | Low → Medium |
| **Endorsements** | 20-30/day | 100+/day | Low → Medium |

### Target Metrics

| Metric | Target | Industry Benchmark |
|--------|--------|-------------------|
| **Connection Accept Rate** | >40% | 30-50% |
| **Message Response Rate** | >20% | 10-25% |
| **Meeting Conversion** | >5% | 2-5% |
| **LinkedIn → Email** | 30% | 20-40% |

### Weekly Goals

- **Connections Sent**: 100-150
- **Connections Accepted**: 40-60
- **Messages Sent**: 50-70
- **Responses**: 10-15
- **Meetings Scheduled**: 3-5

---

## 🔧 Technical Setup

### Option A: Dux-Soup + Supabase

**Step 1: Install Dux-Soup**
```
1. Go to https://www.dux-soup.com/
2. Install Chrome extension
3. Sign up for Pro ($14.99/month)
4. Configure settings:
   - Connection requests: 25/day
   - Messages: 15/day
   - Delays: Random 30-60 seconds
```

**Step 2: Create LinkedIn Campaign**
```
1. Sales Navigator: Create saved search
2. Dux-Soup: Import search results
3. Dux-Soup: Set up sequence:
   - Visit profile
   - Send connection request (with template)
   - Wait 3 days
   - Send message (if connected)
4. Dux-Soup: Export activity to CSV daily
```

**Step 3: Sync to Supabase**
```javascript
// Import Dux-Soup CSV to Supabase
const csv = require('csv-parser');
const fs = require('fs');

fs.createReadStream('dux-soup-export.csv')
  .pipe(csv())
  .on('data', async (row) => {
    await supabase.from('investor_contacts').upsert({
      name: row.name,
      linkedin_url: row.profile_url,
      company: row.company,
      title: row.title,
      linkedin_connection_sent: row.connection_sent === 'Yes',
      linkedin_connected: row.connected === 'Yes',
      source: 'linkedin_sales_navigator'
    }, { onConflict: 'linkedin_url' });
  });
```

### Option B: Expandi.io + Zapier + Supabase

**Step 1: Set Up Expandi.io**
```
1. Sign up at https://expandi.io/
2. Connect LinkedIn account
3. Import leads from CSV (from Sales Navigator)
4. Create campaign sequence:
   - Day 1: View profile
   - Day 2: Send connection request
   - Day 5: Send message 1 (if connected)
   - Day 12: Send message 2 (if no reply)
```

**Step 2: Configure Webhooks**
```
Expandi.io → Webhooks → Configure:
- Connection accepted: POST to Zapier
- Message sent: POST to Zapier
- Reply received: POST to Zapier
```

**Step 3: Zapier Integration**
```
Zapier Workflow:
1. Trigger: Webhook from Expandi
2. Action: Update Supabase record
3. Filter: Only update if investor exists
4. Action: Send Slack notification (for hot leads)
```

---

## 🎯 Best Practices

### DO:
✅ Personalize every connection request  
✅ Reference specific portfolio companies  
✅ Keep messages under 200 words  
✅ Include clear call-to-action  
✅ Respect daily limits  
✅ Track all activity in Supabase  
✅ Follow up 2-3 times max  
✅ Use LinkedIn + Email multi-touch  

### DON'T:
❌ Send generic "I'd like to add you" requests  
❌ Pitch in connection request  
❌ Send long messages (>300 words)  
❌ Exceed daily limits (risk ban)  
❌ Use aggressive automation tools  
❌ Spam with follow-ups (>3 touches)  
❌ Forget to track responses  

---

## 🚨 Account Safety Tips

### Warm Up Your Account
```
Week 1: 10 connections/day, 5 messages/day
Week 2: 15 connections/day, 8 messages/day
Week 3: 20 connections/day, 10 messages/day
Week 4+: 25 connections/day, 15 messages/day
```

### Red Flags to Avoid
- ❌ 100+ connection requests in one day
- ❌ Identical messages to multiple people
- ❌ Sending messages at 3 AM (use scheduling)
- ❌ High rejection rate (>50% ignored)
- ❌ Running automation 24/7

### If Your Account Gets Restricted
1. **Stop all automation immediately**
2. **Wait 7-14 days**
3. **Verify your identity with LinkedIn**
4. **Resume with lower limits**
5. **Use more manual approach**

---

## 📈 ROI Calculation

### LinkedIn Sales Navigator + Dux-Soup

**Monthly Cost**:
- Sales Navigator: $149
- Dux-Soup Pro: $15
- **Total**: $164/month

**Expected Output**:
- Connections sent: 500/month
- Connections accepted: 200/month (40%)
- Messages sent: 200/month
- Responses: 40/month (20%)
- Meetings: 10/month (25%)
- Committed investors: 1-2/month

**ROI**:
- Cost per meeting: $16.40
- Cost per investor: $82-$164
- **Excellent ROI** for investor outreach

---

## 🔄 Recommended Workflow for DWS6

### Phase 1: Manual (Week 1-2)
- Use Sales Navigator to find 100 investors
- Send 20 connection requests/day manually
- Send 10 messages/day manually
- Track everything in Supabase
- **Goal**: Learn what works

### Phase 2: Semi-Automated (Week 3-4)
- Install Dux-Soup
- Set up automated connection requests (20/day)
- Set up automated messages (10/day)
- Export activity daily to Supabase
- **Goal**: Scale while maintaining quality

### Phase 3: Multi-Channel (Week 5+)
- Combine LinkedIn + Email outreach
- Use multi-touch sequences
- Track cross-channel attribution
- Optimize based on data
- **Goal**: Maximize conversion

---

## 📞 Support & Resources

### Tools
- **LinkedIn Sales Navigator**: https://business.linkedin.com/sales-solutions/sales-navigator
- **Dux-Soup**: https://www.dux-soup.com/
- **Expandi.io**: https://expandi.io/
- **Phantombuster**: https://phantombuster.com/

### Learning Resources
- LinkedIn Sales Navigator Training: https://learning.linkedin.com/
- LinkedIn Best Practices: https://business.linkedin.com/marketing-solutions/best-practices

### Community
- r/LinkedInAutomation (Reddit)
- LinkedIn Sales Navigator User Group (LinkedIn)

---

**Last Updated**: December 27, 2025  
**Status**: Ready to implement  
**Recommended**: Start with Sales Navigator + Manual, then add Dux-Soup after 2 weeks

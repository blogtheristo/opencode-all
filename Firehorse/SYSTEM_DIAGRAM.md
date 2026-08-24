# Firehorse System Architecture

## Complete System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FIREHORSE PLATFORM                               │
│                    Omnichannel Outreach System                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        1. DATA LAYER (Supabase)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────┐         ┌──────────────────────┐             │
│  │ investor_contacts   │         │  campaign_logs       │             │
│  ├─────────────────────┤         ├──────────────────────┤             │
│  │ • id                │         │ • id                 │             │
│  │ • name              │◄────────┤ • investor_id        │             │
│  │ • email             │         │ • campaign_date      │             │
│  │ • company           │         │ • sent_at            │             │
│  │ • investment_focus  │         │ • opened             │             │
│  │ • status            │         │ • clicked            │             │
│  │ • priority          │         │ • replied            │             │
│  │ • last_contacted    │         │ • created_at         │             │
│  │ • emails_sent       │         └──────────────────────┘             │
│  │ • created_at        │                                               │
│  └─────────────────────┘                                               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    2. CONTENT LAYER (ContentMS)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐    │
│  │ Email Templates  │  │ Landing Pages    │  │  Social Media    │    │
│  ├──────────────────┤  ├──────────────────┤  ├──────────────────┤    │
│  │ • Cold outreach  │  │ • Investor page  │  │ • LinkedIn posts │    │
│  │ • Follow-up #1   │  │ • Demo pages     │  │ • Twitter threads│    │
│  │ • Follow-up #2   │  │ • Case studies   │  │ • Blog content   │    │
│  │ • Meeting req.   │  │ • Whitepapers    │  │ • Announcements  │    │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘    │
│                                                                          │
│  Variables: {{first_name}}, {{company}}, {{investment_focus}}, etc.    │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   3. AUTOMATION LAYER (Firehorse/Automation)            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                    Daily Campaign Runner                         │  │
│  │                      (Runs at 9:00 AM)                          │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                │                                        │
│                                ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  STEP 1: Query Supabase                                          │ │
│  │  • Get contacts with status='new' or 'follow_up'                 │ │
│  │  • Filter: last_contacted > 7 days ago OR null                   │ │
│  │  • Order by: priority DESC                                       │ │
│  │  • Limit: 20 contacts                                            │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                │                                        │
│                                ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  STEP 2: Personalize Templates                                   │ │
│  │  • Load email template from ContentMS                            │ │
│  │  • Replace {{first_name}}, {{company}}, etc.                     │ │
│  │  • Add tracking parameters to links                              │ │
│  │  • Generate unique campaign_id                                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                │                                        │
│                                ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  STEP 3: Send Emails                                             │ │
│  │  • Send via Amazon SES (SMTP)                                    │ │
│  │  • Include tracking pixel for opens                              │ │
│  │  • Include UTM parameters for clicks                             │ │
│  │  • Handle errors and retries                                     │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                │                                        │
│                                ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  STEP 4: Log Campaign                                            │ │
│  │  • Insert record into campaign_logs                              │ │
│  │  • Record: investor_id, sent_at, campaign_date                   │ │
│  │  • Initial status: sent=true, opened=false, clicked=false        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                │                                        │
│                                ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  STEP 5: Update Contacts                                         │ │
│  │  • Set status='contacted'                                        │ │
│  │  • Set last_contacted=NOW()                                      │ │
│  │  • Increment emails_sent counter                                 │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    4. DELIVERY LAYER (Email Service)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                     Email Service Provider                        │ │
│  │                  (Amazon SES, SMTP only)                  │ │
│  ├──────────────────────────────────────────────────────────────────┤ │
│  │                                                                   │ │
│  │  • Send transactional emails                                     │ │
│  │  • Track deliverability                                          │ │
│  │  • Handle bounces and spam reports                               │ │
│  │  • Provide webhooks for events                                   │ │
│  │  • Manage sender reputation                                      │ │
│  │                                                                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   5. RECIPIENT LAYER (Investor)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                      Investor Inbox                               │ │
│  ├──────────────────────────────────────────────────────────────────┤ │
│  │                                                                   │ │
│  │  📧 Email Received                                               │ │
│  │     Subject: Quick question about SaaS investments               │ │
│  │     From: DWS6 Team <investors@dws10.com>                       │ │
│  │                                                                   │ │
│  │     Hi John,                                                     │ │
│  │                                                                   │ │
│  │     I noticed your focus on SaaS investments...                  │ │
│  │                                                                   │ │
│  │     [Learn more about DWS6] ← Tracked link                      │ │
│  │                                                                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Actions:                                                               │
│  • Opens email → Tracking pixel fires → Update campaign_logs           │
│  • Clicks link → UTM tracked → Update campaign_logs                    │
│  • Replies → Webhook → Update campaign_logs                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 6. LANDING PAGE (Investor Relations)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │              https://dws10.com/investor-relations/                │ │
│  │           ?campaign=abc123&investor=xyz789                        │ │
│  ├──────────────────────────────────────────────────────────────────┤ │
│  │                                                                   │ │
│  │  🏢 DWS6 - Investor Relations                                    │ │
│  │                                                                   │ │
│  │  • Company Overview                                              │ │
│  │  • Financial Highlights                                          │ │
│  │  • Team & Advisors                                               │ │
│  │  • Product Demo                                                  │ │
│  │  • Pitch Deck Download                                           │ │
│  │  • Contact Form                                                  │ │
│  │                                                                   │ │
│  │  [Get in Touch] ← Form submission → Supabase                    │ │
│  │                                                                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Tracking:                                                              │
│  • Page view logged to campaign_logs (clicked=true)                    │
│  • Time on page tracked                                                │
│  • Form submission creates new contact or updates existing             │
│  • Status changed to 'engaged' or 'inbound'                            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   7. REPORTING LAYER (Analytics)                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                    Daily Report (6:00 PM)                         │ │
│  ├──────────────────────────────────────────────────────────────────┤ │
│  │                                                                   │ │
│  │  📊 Campaign Metrics - December 27, 2025                         │ │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │ │
│  │                                                                   │ │
│  │  Sent:      20                                                   │ │
│  │  Delivered: 19 (95%)                                             │ │
│  │  Opened:    5 (26%)                                              │ │
│  │  Clicked:   2 (11%)                                              │ │
│  │  Replied:   1 (5%)                                               │ │
│  │                                                                   │ │
│  │  Top Performers:                                                 │ │
│  │  1. John Doe (Example VC) - Clicked + Replied                   │ │
│  │  2. Jane Smith (Tech Fund) - Opened + Clicked                   │ │
│  │                                                                   │ │
│  │  Follow-ups Scheduled: 15 (for 7 days from now)                 │ │
│  │                                                                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                          │
│  Distribution:                                                          │
│  • Email to team                                                        │
│  • Slack notification                                                   │
│  • Dashboard update                                                     │
│  • CSV export for analysis                                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                 8. FOLLOW-UP AUTOMATION (Day 7 & 14)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │                   Follow-up Trigger Logic                         │ │
│  ├──────────────────────────────────────────────────────────────────┤ │
│  │                                                                   │ │
│  │  IF contacted 7 days ago AND no reply:                           │ │
│  │    → Send Follow-up #1                                           │ │
│  │    → Update status='follow_up_1'                                 │ │
│  │                                                                   │ │
│  │  IF contacted 14 days ago AND no reply:                          │ │
│  │    → Send Follow-up #2                                           │ │
│  │    → Update status='follow_up_2'                                 │ │
│  │                                                                   │ │
│  │  IF contacted 21 days ago AND no reply:                          │ │
│  │    → Update status='paused'                                      │ │
│  │    → Re-engage in 90 days                                        │ │
│  │                                                                   │ │
│  │  IF replied at any point:                                        │ │
│  │    → Update status='engaged'                                     │ │
│  │    → Alert team for manual follow-up                             │ │
│  │    → Move to CRM pipeline                                        │ │
│  │                                                                   │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Summary

```
Contact Added → Daily Automation → Email Sent → Investor Opens → 
Clicks Link → Lands on Page → Fills Form → Logged in Supabase → 
Daily Report → Follow-up Triggered → Meeting Scheduled
```

## Key Integration Points

### 1. Supabase ↔ Automation
- Automation queries Supabase for contacts
- Updates contact status after sending
- Logs all campaign activity

### 2. Automation ↔ Email Service
- Sends emails via API
- Receives webhooks for events
- Handles bounces and unsubscribes

### 3. Email ↔ Landing Page
- Tracking links with UTM parameters
- Campaign and investor IDs in URL
- JavaScript tracking on page

### 4. Landing Page ↔ Supabase
- Form submissions saved directly
- Page views logged to campaign_logs
- Real-time updates

### 5. Supabase ↔ Reporting
- Daily queries for metrics
- Aggregation and analysis
- Export to various formats

## Omnichannel Expansion

```
Current: Investors (Email)
    ↓
Add: Customers (Email + In-app)
    ↓
Add: Partners (Email + LinkedIn)
    ↓
Future: Multi-channel (Email + Social + Content + Events)
```

## System Requirements

### Infrastructure
- **Database**: Supabase (PostgreSQL)
- **Email**: Amazon SES (SMTP only — Resend/SendGrid banned per CLAUDE.md Rule 4)
- **Automation**: Node.js + Cron / Cloud Functions
- **Hosting**: Existing dws10.com
- **Analytics**: Supabase + Custom dashboards

### Accounts Needed
- ✅ Supabase (free tier: 500MB, 2GB bandwidth)
- ✅ Amazon SES (SMTP credentials configured)
- ✅ Domain with DNS access (for SPF/DKIM)
- ✅ Node.js environment (local or cloud)

### Cost Estimate
- **Supabase**: $0/month (free tier)
- **Amazon SES**: $0.10 per 1,000 emails
- **Hosting**: $0 (using existing)
- **Total**: $0-15/month

## Performance Metrics

### Target Performance
- **Email Delivery**: <1 second per email
- **Database Queries**: <100ms
- **Page Load**: <2 seconds
- **Campaign Runtime**: <5 minutes for 20 emails
- **Report Generation**: <10 seconds

### Scalability
- **Current**: 20 emails/day = 400/month
- **Scale to**: 100 emails/day = 2,000/month
- **Maximum**: 500 emails/day = 10,000/month (with paid plan)

---

**System Status**: ✅ Architecture Complete  
**Next Step**: Implement according to QUICK_START.md  
**Documentation**: See INDEX.md for all guides  

**Last Updated**: December 27, 2025

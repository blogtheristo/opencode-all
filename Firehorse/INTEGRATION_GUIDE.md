# Firehorse Integration Guide

## Overview

This guide explains how to integrate your existing DWS6 assets with the Firehorse omnichannel outreach platform.

## Current Assets

### 1. Investor Relations Page
- **Location**: `dws10.com/investor-relations/index.html`
- **Purpose**: Central hub for investor information
- **Integration**: Link from cold emails, track visits

### 2. Supabase Database
- **Purpose**: Contact management and campaign tracking
- **Tables**: `investor_contacts`, `campaign_logs`
- **Integration**: Primary data source for all campaigns

### 3. Cold Email System
- **Capacity**: 20 outbound emails/day
- **Integration**: Automated through Firehorse/Automation

## Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Firehorse Platform                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │  Omnichannel │    │  ContentMS   │    │Automation │ │
│  │              │    │              │    │           │ │
│  │ • Investors  │───▶│ • Templates  │───▶│ • Sender  │ │
│  │ • Customers  │    │ • Landing    │    │ • Tracker │ │
│  │ • Partners   │    │ • Assets     │    │ • Sync    │ │
│  └──────────────┘    └──────────────┘    └───────────┘ │
│         │                    │                   │       │
│         └────────────────────┴───────────────────┘       │
│                              │                           │
└──────────────────────────────┼───────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
         ┌──────▼──────┐            ┌────────▼────────┐
         │  Supabase   │            │  Email Service  │
         │  Database   │            │   Provider      │
         │             │            │                 │
         │ • Contacts  │            │ • Delivery      │
         │ • Campaigns │            │ • Tracking      │
         │ • Metrics   │            │ • Analytics     │
         └─────────────┘            └─────────────────┘
                │
                │
         ┌──────▼──────┐
         │  Investor   │
         │  Relations  │
         │    Page     │
         │             │
         │ dws10.com/  │
         │ investor-   │
         │ relations/  │
         └─────────────┘
```

## Step-by-Step Integration

### Step 1: Set Up Supabase Tables

Create the database schema for investor contacts and campaign tracking:

```sql
-- Run this in your Supabase SQL editor
-- (See Firehorse/Starter/investor-campaign-template.md for full schema)

CREATE TABLE investor_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  status TEXT DEFAULT 'new',
  last_contacted TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE campaign_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_date DATE NOT NULL,
  investor_id UUID REFERENCES investor_contacts(id),
  sent_at TIMESTAMP,
  opened BOOLEAN,
  clicked BOOLEAN,
  replied BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Step 2: Configure Environment

Create `.env` file in `Firehorse/Automation/`:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# Email Service Configuration
EMAIL_API_KEY=your-email-service-api-key
EMAIL_FROM=investors@dws10.com
EMAIL_FROM_NAME=DWS6 Team

# Campaign Settings
DAILY_LIMIT=20
SEND_HOUR=9
SEND_TIMEZONE=Europe/Helsinki

# Tracking
TRACKING_DOMAIN=dws10.com
INVESTOR_PAGE_URL=https://dws10.com/investor-relations/

# Alerts (optional: one or both)
ALERT_EMAIL=team@dws10.com
SLACK_WEBHOOK=your-slack-incoming-webhook-url
TEAMS_WEBHOOK=your-teams-incoming-webhook-url
```

### Step 3: Update Investor Relations Page

Add tracking and integration to your investor-relations page:

```html
<!-- Add to investor-relations/index.html -->

<!-- Firehorse Campaign Tracking -->
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
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        id: campaignId,
        clicked: true,
        clicked_at: new Date().toISOString()
      })
    });
  }
</script>

<!-- Add contact form integration -->
<form id="investor-contact-form">
  <input type="text" name="name" placeholder="Name" required>
  <input type="email" name="email" placeholder="Email" required>
  <input type="text" name="company" placeholder="Company">
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Get in Touch</button>
</form>

<script>
  document.getElementById('investor-contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Save to Supabase
    await fetch('https://your-project.supabase.co/rest/v1/investor_contacts', {
      method: 'POST',
      headers: {
        'apikey': 'your-anon-key',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        notes: formData.get('message'),
        source: 'website',
        status: 'inbound'
      })
    });
    
    alert('Thank you! We\'ll be in touch soon.');
    e.target.reset();
  });
</script>
```

### Step 4: Create Email Templates

Store templates in `Firehorse/ContentMS/email-templates/`:

**cold-investor-intro-v1.html**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <p>Hi {{first_name}},</p>
  
  <p>I noticed your focus on {{investment_focus}} investments and thought you might be interested in what we're building at DWS6.</p>
  
  <p>We're developing [brief value proposition - 2-3 sentences about your product/service].</p>
  
  <p>Would you be open to a brief call next week to explore if there's a fit?</p>
  
  <p>You can learn more about us here: <a href="https://dws10.com/investor-relations/?campaign={{campaign_id}}&investor={{investor_id}}">DWS6 Investor Relations</a></p>
  
  <p>Best regards,<br>
  {{sender_name}}<br>
  {{sender_title}}<br>
  DWS6</p>
  
  <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
  <p style="font-size: 11px; color: #666;">
    DWS6<br>
    [Your Address]<br>
    <a href="{{unsubscribe_link}}">Unsubscribe</a>
  </p>
</body>
</html>
```

### Step 5: Set Up Automation

Create campaign automation script in `Firehorse/Automation/campaigns/`:

**investor-daily-outreach.js**
```javascript
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function runDailyCampaign() {
  console.log('Starting daily investor outreach campaign...');
  
  // 1. Get eligible contacts
  const { data: contacts, error } = await supabase
    .from('investor_contacts')
    .select('*')
    .in('status', ['new', 'follow_up'])
    .or(`last_contacted.is.null,last_contacted.lt.${getSevenDaysAgo()}`)
    .order('priority', { ascending: false })
    .limit(parseInt(process.env.DAILY_LIMIT));
  
  if (error) {
    console.error('Error fetching contacts:', error);
    return;
  }
  
  console.log(`Found ${contacts.length} eligible contacts`);
  
  // 2. Send emails
  for (const contact of contacts) {
    try {
      // Send email (implement with your email service)
      await sendEmail(contact);
      
      // Log campaign
      await logCampaign(contact);
      
      // Update contact
      await updateContact(contact);
      
      console.log(`✓ Sent to ${contact.email}`);
    } catch (err) {
      console.error(`✗ Failed for ${contact.email}:`, err);
    }
  }
  
  console.log('Campaign complete!');
}

function getSevenDaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date.toISOString();
}

async function sendEmail(contact) {
  // Implement with your email service (Amazon SES SMTP — the only sanctioned transport)
  // Include tracking parameters in links
}

async function logCampaign(contact) {
  await supabase.from('campaign_logs').insert({
    campaign_date: new Date().toISOString().split('T')[0],
    investor_id: contact.id,
    sent_at: new Date().toISOString()
  });
}

async function updateContact(contact) {
  await supabase
    .from('investor_contacts')
    .update({
      last_contacted: new Date().toISOString(),
      emails_sent: (contact.emails_sent || 0) + 1,
      status: 'contacted'
    })
    .eq('id', contact.id);
}

// Run if called directly
if (require.main === module) {
  runDailyCampaign().catch(console.error);
}

module.exports = { runDailyCampaign };
```

### Step 6: Schedule Daily Campaigns

**Option A: Cron (Linux/Mac)**
```bash
# Edit crontab
crontab -e

# Add this line (runs at 9 AM daily)
0 9 * * * cd /path/to/dws6/Firehorse/Automation && node campaigns/investor-daily-outreach.js
```

**Option B: Windows Task Scheduler**
1. Open Task Scheduler
2. Create Basic Task
3. Name: "Firehorse Daily Investor Outreach"
4. Trigger: Daily at 9:00 AM
5. Action: Start a program
6. Program: `node`
7. Arguments: `campaigns/investor-daily-outreach.js`
8. Start in: `D:\Proton\My files\2026\Repos2026\dws6\Firehorse\Automation`

**Option C: Cloud Functions (Recommended)**
Deploy to Google Cloud Functions, AWS Lambda, or Vercel Cron Jobs

### Step 7: Set Up Reporting

Create daily report script in `Firehorse/Report/`:

**daily-report.js**
```javascript
const { createClient } = require('@supabase/supabase-js');

async function generateDailyReport() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  );
  
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's campaigns
  const { data: campaigns } = await supabase
    .from('campaign_logs')
    .select('*')
    .eq('campaign_date', today);
  
  const metrics = {
    sent: campaigns.length,
    delivered: campaigns.filter(c => c.delivered).length,
    opened: campaigns.filter(c => c.opened).length,
    clicked: campaigns.filter(c => c.clicked).length,
    replied: campaigns.filter(c => c.replied).length
  };
  
  console.log(`
📊 Daily Campaign Report - ${today}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sent:      ${metrics.sent}
Delivered: ${metrics.delivered} (${pct(metrics.delivered, metrics.sent)}%)
Opened:    ${metrics.opened} (${pct(metrics.opened, metrics.delivered)}%)
Clicked:   ${metrics.clicked} (${pct(metrics.clicked, metrics.delivered)}%)
Replied:   ${metrics.replied} (${pct(metrics.replied, metrics.delivered)}%)
  `);
}

function pct(num, den) {
  return den > 0 ? Math.round((num / den) * 100) : 0;
}

generateDailyReport().catch(console.error);
```

## Testing the Integration

### 1. Test Database Connection
```bash
cd Firehorse/Automation
node -e "require('dotenv').config(); console.log(process.env.SUPABASE_URL)"
```

### 2. Test Email Sending
```bash
node campaigns/investor-daily-outreach.js --test --limit 1
```

### 3. Test Tracking
Visit: `https://dws10.com/investor-relations/?campaign=test&investor=test`
Check browser console and Supabase logs

### 4. Test Reporting
```bash
cd Firehorse/Report
node daily-report.js
```

## Workflow Summary

```
1. Add investors to Supabase
   ↓
2. Daily automation selects 20 contacts
   ↓
3. Personalized emails sent with tracking links
   ↓
4. Investors click → land on investor-relations page
   ↓
5. Page visit tracked in Supabase
   ↓
6. Investors fill contact form → saved to Supabase
   ↓
7. Daily report shows metrics
   ↓
8. Follow-up automation for engaged contacts
```

## Next Steps

1. ✅ Create folder structure (DONE)
2. ⬜ Set up Supabase tables
3. ⬜ Configure environment variables
4. ⬜ Update investor-relations page with tracking
5. ⬜ Create email templates
6. ⬜ Set up automation scripts
7. ⬜ Schedule daily campaigns
8. ⬜ Test with small batch (5 contacts)
9. ⬜ Launch full campaign (20/day)
10. ⬜ Monitor and optimize

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Email Service**: Amazon SES (SMTP only — Resend/SendGrid banned per CLAUDE.md Rule 4)
- **Scheduling**: Cron, Task Scheduler, or Cloud Functions
- **Analytics**: Built-in Supabase analytics + custom dashboards

---

**Integration Status**: Ready to implement
**Last Updated**: December 27, 2025

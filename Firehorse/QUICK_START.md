# Firehorse Quick Start Guide

## 🚀 Get Your Investor Outreach Running in 30 Minutes

This guide will help you launch your first investor outreach campaign today.

## Prerequisites

- ✅ Supabase account (free tier works)
- ✅ Amazon SES SMTP credentials (SES is the only sanctioned transport — Resend/SendGrid banned per CLAUDE.md Rule 4)
- ✅ Node.js installed (for automation)
- ✅ List of investor contacts

## 30-Minute Setup

### Step 1: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and create a project
2. In SQL Editor, run this query:

```sql
CREATE TABLE investor_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  investment_focus TEXT,
  status TEXT DEFAULT 'new',
  priority INTEGER DEFAULT 5,
  last_contacted TIMESTAMP,
  emails_sent INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE campaign_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_date DATE NOT NULL,
  investor_id UUID REFERENCES investor_contacts(id),
  sent_at TIMESTAMP,
  opened BOOLEAN DEFAULT false,
  clicked BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

3. Go to Settings → API and copy:
   - Project URL
   - Service role key (keep this secret!)

### Step 2: Add Your First Contacts (5 minutes)

In Supabase, go to Table Editor → investor_contacts → Insert row

Add at least 5 test contacts:

| name | email | company | investment_focus | priority |
|------|-------|---------|------------------|----------|
| John Doe | john@example.com | Example VC | SaaS, B2B | 10 |
| Jane Smith | jane@example.com | Tech Fund | Enterprise | 9 |
| ... | ... | ... | ... | ... |

### Step 3: Configure Environment (3 minutes)

Create `Firehorse/Automation/.env`:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# Email (Amazon SES SMTP only — Resend/SendGrid banned per CLAUDE.md Rule 4)
SMTP_HOST=email-smtp.eu-north-1.amazonaws.com
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
EMAIL_FROM=investors@dws10.com
EMAIL_FROM_NAME=DWS6 Team

# Campaign
DAILY_LIMIT=20
SEND_HOUR=9
```

### Step 4: Install Dependencies (2 minutes)

```bash
cd Firehorse/Automation
npm init -y
npm install @supabase/supabase-js dotenv nodemailer
```

### Step 5: Create Simple Campaign Script (10 minutes)

Create `Firehorse/Automation/simple-campaign.js`:

```javascript
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// Configure
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendCampaign() {
  console.log('🚀 Starting campaign...\n');
  
  // Get contacts to email
  const { data: contacts } = await supabase
    .from('investor_contacts')
    .select('*')
    .eq('status', 'new')
    .limit(5); // Start with just 5
  
  console.log(`📋 Found ${contacts.length} contacts\n`);
  
  for (const contact of contacts) {
    try {
      // Personalize email
      const firstName = contact.name.split(' ')[0];
      const email = {
        to: contact.email,
        from: process.env.EMAIL_FROM,
        subject: `Quick question about ${contact.investment_focus} investments`,
        html: `
          <p>Hi ${firstName},</p>
          
          <p>I noticed your focus on ${contact.investment_focus} investments and thought you might be interested in what we're building at DWS6.</p>
          
          <p>We're [your brief value proposition - replace this].</p>
          
          <p>Would you be open to a brief call next week?</p>
          
          <p>Learn more: <a href="https://dws10.com/investor-relations/">DWS6 Investor Relations</a></p>
          
          <p>Best regards,<br>
          Your Name<br>
          DWS6</p>
        `
      };
      
      // Send email
      await mailer.sendMail(email);
      
      // Log to Supabase
      await supabase.from('campaign_logs').insert({
        campaign_date: new Date().toISOString().split('T')[0],
        investor_id: contact.id,
        sent_at: new Date().toISOString()
      });
      
      // Update contact
      await supabase
        .from('investor_contacts')
        .update({
          status: 'contacted',
          last_contacted: new Date().toISOString(),
          emails_sent: contact.emails_sent + 1
        })
        .eq('id', contact.id);
      
      console.log(`✅ Sent to ${contact.name} (${contact.email})`);
      
    } catch (error) {
      console.error(`❌ Failed for ${contact.email}:`, error.message);
    }
  }
  
  console.log('\n✨ Campaign complete!');
}

sendCampaign().catch(console.error);
```

### Step 6: Test Run (5 minutes)

```bash
cd Firehorse/Automation
node simple-campaign.js
```

You should see:
```
🚀 Starting campaign...

📋 Found 5 contacts

✅ Sent to John Doe (john@example.com)
✅ Sent to Jane Smith (jane@example.com)
...

✨ Campaign complete!
```

### Step 7: Verify Results

1. **Check your email** - You should see test emails sent
2. **Check Supabase** - Go to campaign_logs table, you should see entries
3. **Check contacts** - Status should be updated to "contacted"

## 🎉 Success! You're Now Running Campaigns

## What's Next?

### Immediate Actions (Today)

1. **Customize the email template** in `simple-campaign.js`
2. **Add more contacts** to Supabase (aim for 100+)
3. **Test with real investors** (start with 5-10)

### This Week

1. **Set up daily automation**
   - Windows: Use Task Scheduler
   - Mac/Linux: Use cron
   - Cloud: Deploy to Vercel/AWS Lambda

2. **Add tracking**
   - Update investor-relations page with tracking code
   - Monitor opens and clicks

3. **Create follow-up sequence**
   - Day 7: First follow-up
   - Day 14: Second follow-up

### This Month

1. **Scale to 20/day** - Increase DAILY_LIMIT to 20
2. **A/B test subject lines** - Try different approaches
3. **Optimize send times** - Test different hours
4. **Build reporting** - Track metrics and ROI

## Common Issues & Solutions

### "Cannot find module '@supabase/supabase-js'"
```bash
cd Firehorse/Automation
npm install @supabase/supabase-js dotenv nodemailer
```

### "Unauthorized" error from Supabase
- Make sure you're using the **service role key**, not the anon key
- Check that SUPABASE_URL and SUPABASE_KEY are correct in .env

### Emails not sending
- Verify EMAIL_API_KEY is correct
- Check your email service dashboard for errors
- Make sure EMAIL_FROM is verified in your email service

### No contacts returned
- Check that contacts have status='new' in Supabase
- Try removing the `.eq('status', 'new')` filter to see all contacts

## Daily Workflow

```
Morning (9 AM):
  1. Run campaign script (or let automation run it)
  2. Check that emails were sent successfully

Afternoon (2 PM):
  3. Check Supabase for opens/clicks
  4. Respond to any replies

Evening (6 PM):
  5. Review daily metrics
  6. Add new contacts for tomorrow
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `Firehorse/README.md` | Platform overview |
| `Firehorse/INTEGRATION_GUIDE.md` | Full integration details |
| `Firehorse/Omnichannel/Investors/README.md` | Investor strategy |
| `Firehorse/Starter/investor-campaign-template.md` | Complete template |
| `Firehorse/Automation/simple-campaign.js` | Your campaign script |

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **AWS SES Docs**: https://docs.aws.amazon.com/ses/
- **Node.js Docs**: https://nodejs.org/docs

## Metrics to Track

Start tracking these from day 1:

- **Emails Sent**: Total sent each day
- **Delivery Rate**: % successfully delivered
- **Open Rate**: % of emails opened
- **Click Rate**: % who clicked your link
- **Response Rate**: % who replied
- **Meeting Rate**: % who scheduled a call

**Target Benchmarks:**
- Open Rate: >25%
- Click Rate: >5%
- Response Rate: >3%
- Meeting Rate: >1%

## Quick Commands

```bash
# Run campaign
node simple-campaign.js

# Check logs
tail -f campaign.log

# Add contact via CLI
node scripts/add-contact.js "John Doe" "john@example.com" "Example VC"

# Generate report
node scripts/daily-report.js
```

## Scaling Checklist

- [ ] Test with 5 contacts ✓
- [ ] Test with 20 contacts
- [ ] Set up daily automation
- [ ] Add tracking to investor-relations page
- [ ] Create follow-up sequences
- [ ] Build reporting dashboard
- [ ] Scale to 20 emails/day
- [ ] Optimize based on metrics

---

**You're Ready!** 🎯

Start with the 30-minute setup above, then gradually add more features as you go.

**Questions?** Review the detailed guides in the Firehorse folder.

**Last Updated**: December 27, 2025

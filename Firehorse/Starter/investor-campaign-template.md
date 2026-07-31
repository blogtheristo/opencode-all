# Investor Campaign Template

## DWS6 Targeting Criteria

### Institutional Investors (€100k–€500k)
- **Stage**: Seed / Seed-extension (bridge to Series A 2026), €59,900 of contracted Q1/2026 enterprise pilots → €900k ARR target
- **Sectors**: Climate tech, industrial decarbonization, construction/infra SaaS, ESG/CSRD automation, industrial AI
- **Geography**: Nordics + DACH + Benelux + UK; EU-focused climate funds (incl. US funds with EU climate/infra thesis)
- **Portfolio**: Construction tech, infra/asset mgmt SaaS, climate/ESG reporting, regulatory SaaS, industrial automation

### Business Angels (€15k–€50k)
- **Profile**: Exited founders, senior operators (construction, infra, logistics, climate/ESG SaaS)
- **Value**: Sparring + door opening (construction/infra owners, ESG/CSRD consulting)
- **Geography**: Nordics, DACH, Benelux, UK (EU-focused, EU regulatory understanding)
- **Portfolio**: Construction tech, infra/climate reporting, "mandatory spend" SaaS

## Campaign Setup Checklist

- [ ] Define target investor profile (see DWS6 criteria above)
- [ ] Build contact list (minimum 100 contacts)
- [ ] Create Supabase table structure
- [ ] Write email templates (3 variations)
- [ ] Set up automation workflow
- [ ] Configure tracking and analytics
- [ ] Test with small batch (5-10 contacts)
- [ ] Launch daily campaign (20/day)

## Supabase Table Schema

```sql
-- Create investor_contacts table
CREATE TABLE investor_contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  title TEXT,
  investment_focus TEXT[],
  preferred_stage TEXT,
  check_size_min NUMERIC,
  check_size_max NUMERIC,
  geography TEXT[],
  portfolio_companies TEXT[],
  linkedin_url TEXT,
  website_url TEXT,
  status TEXT DEFAULT 'new',
  priority INTEGER DEFAULT 5,
  notes TEXT,
  source TEXT,
  tags TEXT[],
  last_contacted TIMESTAMP,
  last_opened TIMESTAMP,
  last_clicked TIMESTAMP,
  last_replied TIMESTAMP,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  emails_replied INTEGER DEFAULT 0,
  meeting_scheduled BOOLEAN DEFAULT false,
  meeting_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for efficient queries
CREATE INDEX idx_investor_status ON investor_contacts(status);
CREATE INDEX idx_investor_priority ON investor_contacts(priority DESC);
CREATE INDEX idx_investor_last_contacted ON investor_contacts(last_contacted);

-- Create campaign_logs table
CREATE TABLE campaign_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  campaign_date DATE NOT NULL,
  investor_id UUID REFERENCES investor_contacts(id),
  email_subject TEXT,
  email_template TEXT,
  sent_at TIMESTAMP,
  delivered BOOLEAN,
  opened BOOLEAN,
  opened_at TIMESTAMP,
  clicked BOOLEAN,
  clicked_at TIMESTAMP,
  replied BOOLEAN,
  replied_at TIMESTAMP,
  bounce_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_campaign_date ON campaign_logs(campaign_date DESC);
CREATE INDEX idx_campaign_investor ON campaign_logs(investor_id);
```

## Email Template Variables

Use these variables in your templates:

- `{{first_name}}`: Investor's first name
- `{{last_name}}`: Investor's last name
- `{{company}}`: Investment firm name
- `{{focus}}`: Investment focus area
- `{{portfolio_company}}`: Relevant portfolio company
- `{{stage}}`: Preferred investment stage
- `{{geography}}`: Investment geography
- `{{sender_name}}`: Your name
- `{{sender_title}}`: Your title
- `{{company_name}}`: Your company name
- `{{meeting_link}}`: Calendar scheduling link
- `{{unsubscribe_link}}`: Unsubscribe URL

## Sample Automation Script (Pseudocode)

```javascript
// Daily campaign runner
async function runDailyCampaign() {
  // 1. Get eligible contacts
  const contacts = await supabase
    .from('investor_contacts')
    .select('*')
    .in('status', ['new', 'follow_up'])
    .or('last_contacted.is.null,last_contacted.lt.' + sevenDaysAgo())
    .order('priority', { ascending: false })
    .limit(20);

  // 2. For each contact
  for (const contact of contacts) {
    // Determine email template based on history
    const template = selectTemplate(contact);
    
    // Personalize email
    const email = personalizeEmail(template, contact);
    
    // Send email
    const result = await sendEmail(contact.email, email);
    
    // Log campaign
    await logCampaign(contact.id, email, result);
    
    // Update contact
    await updateContact(contact.id, {
      last_contacted: new Date(),
      emails_sent: contact.emails_sent + 1,
      status: determineNextStatus(contact)
    });
  }
  
  // 3. Generate daily report
  await generateReport();
}

// Run daily at 9 AM
schedule('0 9 * * *', runDailyCampaign);
```

## Campaign Workflow

```
[New Contact] 
    ↓
[Add to Supabase]
    ↓
[Day 1: Initial Email]
    ↓
[Track Opens/Clicks]
    ↓
[Day 7: Follow-up 1] (if no reply)
    ↓
[Track Engagement]
    ↓
[Day 14: Follow-up 2] (if no reply)
    ↓
[Pause or Re-engage Later]

If Reply at Any Stage:
    ↓
[Schedule Meeting]
    ↓
[Move to Active Pipeline]
```

## Success Metrics

### Target Benchmarks
- **Delivery Rate**: >95%
- **Open Rate**: 20-30%
- **Click Rate**: 5-10%
- **Response Rate**: 2-5%
- **Meeting Rate**: 1-3%

### Weekly Goals
- Contacts Added: 50+
- Emails Sent: 100 (20/day × 5 days)
- Meetings Scheduled: 2-3

### Monthly Goals
- Contacts Added: 200+
- Emails Sent: 400+
- Meetings Scheduled: 8-12
- Active Conversations: 15-20

## A/B Testing Ideas

Test these variables:

1. **Subject Lines**
   - Question vs. Statement
   - Personalized vs. Generic
   - Short vs. Long

2. **Email Length**
   - 50 words vs. 100 words
   - Single paragraph vs. Multiple

3. **Call-to-Action**
   - "Are you available?" vs. "Let's schedule"
   - Calendar link vs. Reply request

4. **Timing**
   - Morning vs. Afternoon
   - Tuesday vs. Thursday
   - Beginning vs. End of month

## Compliance Footer Template

```
---
[Your Company Name]
[Physical Address]
[City, State, ZIP]

You're receiving this because we believe you may be interested in [Company Name].
If you'd prefer not to receive these emails, you can [unsubscribe]({{unsubscribe_link}}).
```

## Quick Start Commands

```bash
# 1. Set up Supabase tables
psql -h [host] -U [user] -d [database] -f schema.sql

# 2. Import initial contact list
node scripts/import-contacts.js contacts.csv

# 3. Test email templates
node scripts/test-templates.js

# 4. Run test campaign (5 contacts)
node scripts/run-campaign.js --test --limit 5

# 5. Launch daily campaign
node scripts/run-campaign.js --production --limit 20

# 6. Generate report
node scripts/generate-report.js --date today
```

## Resources

- Email template examples: `ContentMS/email-templates/`
- Automation scripts: `Automation/investor-outreach/`
- Analytics dashboard: `Report/investor-metrics/`
- Contact import tools: `Automation/data-import/`

---

**Template Version**: 1.0
**Last Updated**: December 27, 2025

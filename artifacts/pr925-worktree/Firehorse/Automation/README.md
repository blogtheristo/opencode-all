# Campaign Automation

> **Status: SHIPPED** — TypeScript workflow engine at `src/firehorse/workflow-engine.ts` with 4 built-in templates, Supabase persistence, and API routes. Legacy Python stub (`main.py`) superseded.

## Overview

Automation scripts, workflows, and integrations for running omnichannel campaigns at scale.

## Automation Types

### 1. Email Campaigns
- Daily outreach automation
- Follow-up sequences
- Drip campaigns
- Triggered emails

### 2. LinkedIn Outreach
- Sales Navigator automation
- Connection requests
- Message sequences
- Profile engagement
- **See**: `LINKEDIN_AUTOMATION_GUIDE.md`

### 3. Data Management
- Contact import/export
- Database synchronization
- Lead scoring
- Duplicate detection

### 4. Reporting
- Daily metrics collection
- Weekly performance reports
- Dashboard updates
- Alert notifications

### 5. Integrations
- Supabase ↔ Email service
- LinkedIn ↔ Supabase
- CRM synchronization
- Analytics tracking
- Calendar scheduling

## Directory Structure

```
Automation/
├── campaigns/           # Campaign execution scripts
├── data-sync/          # Database synchronization
├── integrations/       # Third-party integrations
├── reporting/          # Automated reporting
├── scheduling/         # Cron jobs and schedulers
└── utilities/          # Helper functions
```

## Daily Campaign Workflow

### Morning Routine (9:00 AM)
```javascript
1. Query eligible contacts from Supabase
2. Apply priority and filtering rules
3. Select 20 contacts for outreach
4. Personalize email templates
5. Send emails via email service
6. Log campaign activity
7. Update contact records
8. Generate daily report
```

### Evening Routine (6:00 PM)
```javascript
1. Collect engagement metrics (opens, clicks)
2. Update contact engagement scores
3. Process replies and responses
4. Update campaign dashboard
5. Send summary to team
```

## Automation Scripts

### Campaign Runner
```bash
# Run daily investor outreach
node campaigns/investor-outreach.js --limit 20

# Run customer nurture sequence
node campaigns/customer-nurture.js

# Run partner follow-ups
node campaigns/partner-followup.js
```

### Data Sync
```bash
# Import contacts from CSV
node data-sync/import-contacts.js --file contacts.csv

# Sync with CRM
node data-sync/crm-sync.js

# Update engagement scores
node data-sync/update-scores.js
```

### Reporting
```bash
# Generate daily report
node reporting/daily-report.js

# Generate weekly summary
node reporting/weekly-summary.js

# Export campaign metrics
node reporting/export-metrics.js --date 2025-12-27
```

## Scheduling

### Cron Schedule
```
# Daily campaign at 9 AM
0 9 * * * node campaigns/investor-outreach.js

# Evening metrics at 6 PM
0 18 * * * node reporting/daily-report.js

# Weekly summary on Monday at 8 AM
0 8 * * 1 node reporting/weekly-summary.js

# Database backup daily at midnight
0 0 * * * node utilities/backup-database.js
```

## Integration Points

### Supabase
- Contact database queries
- Campaign logging
- Metrics storage
- Real-time updates

### Email Service Provider
- Send transactional emails
- Track deliverability
- Handle bounces
- Process unsubscribes

### Analytics
- Track email opens
- Monitor link clicks
- Measure conversions
- Attribution tracking

### CRM
- Lead synchronization
- Opportunity updates
- Activity logging
- Pipeline management

## Error Handling

### Retry Logic
- Failed emails: Retry 3 times with exponential backoff
- API errors: Retry with rate limiting
- Database errors: Log and alert team

### Monitoring
- Health checks every 5 minutes
- Alert on failures
- Log all errors
- Daily error summary

## Configuration

### Environment Variables
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
EMAIL_API_KEY=your_email_api_key
EMAIL_FROM=outreach@yourcompany.com
DAILY_LIMIT=20
RETRY_ATTEMPTS=3
LOG_LEVEL=info
```

### Campaign Settings
```javascript
{
  "dailyLimit": 20,
  "priorityThreshold": 5,
  "followUpDelay": 7,
  "maxFollowUps": 2,
  "sendWindow": {
    "start": "09:00",
    "end": "17:00"
  },
  "excludeDays": ["Saturday", "Sunday"]
}
```

## Testing

### Test Mode
```bash
# Test with 5 contacts (no actual sending)
node campaigns/investor-outreach.js --test --limit 5

# Dry run (show what would be sent)
node campaigns/investor-outreach.js --dry-run

# Send to test email only
node campaigns/investor-outreach.js --test-email test@yourcompany.com
```

## Performance Optimization

- Batch database queries
- Cache frequently used data
- Parallel email sending
- Rate limit API calls
- Monitor memory usage

## Security

- Store credentials in environment variables
- Encrypt sensitive data
- Validate all inputs
- Rate limit API endpoints
- Log security events

## Maintenance

### Daily
- Monitor campaign execution
- Check error logs
- Verify email deliverability

### Weekly
- Review automation performance
- Update contact lists
- Optimize send times

### Monthly
- Audit automation scripts
- Update dependencies
- Review security settings

---

**Automation Status**: Active
**Last Run**: [Timestamp]
**Next Scheduled**: [Timestamp]
**Last Updated**: December 27, 2025

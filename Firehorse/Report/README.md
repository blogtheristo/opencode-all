# Campaign Analytics & Reporting

> **Status: SHIPPED** — TypeScript report module at `src/firehorse/report-module.ts` generates Board Pack, Annual Report, Compliance Summary, and Carbon Footprint formats from DWS IQ validated data. API routes at `/api/v1/firehorse/reports/*`. Legacy Python engine (`report_engine.py`) superseded.

## Overview

Centralized reporting and analytics for all Firehorse campaigns across investors, customers, and partners.

## Report Types

### 1. Daily Reports
- Emails sent today
- Delivery rate
- Open rate
- Click rate
- Responses received
- Meetings scheduled

### 2. Weekly Summaries
- Campaign performance trends
- Top performing templates
- Engagement metrics
- Conversion funnel
- Week-over-week comparison

### 3. Monthly Analytics
- Overall campaign health
- Channel performance
- Audience segment analysis
- ROI calculations
- Goal achievement

### 4. Campaign-Specific Reports
- Individual campaign deep-dive
- A/B test results
- Cohort analysis
- Attribution tracking

## Key Metrics Dashboard

### Email Performance
```
┌─────────────────────────────────────────┐
│ Daily Email Metrics                     │
├─────────────────────────────────────────┤
│ Sent:           20                      │
│ Delivered:      19 (95%)                │
│ Opened:         5 (26%)                 │
│ Clicked:        2 (11%)                 │
│ Replied:        1 (5%)                  │
│ Bounced:        1 (5%)                  │
└─────────────────────────────────────────┘
```

### Conversion Funnel
```
Contacts in Database:  500
  ↓
Contacted:            200 (40%)
  ↓
Engaged (opened):      50 (25%)
  ↓
Interested (clicked):  15 (30%)
  ↓
Responded:             8 (53%)
  ↓
Meeting Scheduled:     3 (38%)
  ↓
Opportunity Created:   1 (33%)
```

## Report Schedule

### Automated Reports
- **Daily**: 6 PM every day
- **Weekly**: Monday 8 AM
- **Monthly**: 1st of month, 9 AM
- **Quarterly**: First Monday of quarter

### Distribution
- Email to team
- Slack notification
- Dashboard update
- Export to CSV/PDF

## Metrics Definitions

### Email Metrics
- **Sent**: Total emails dispatched
- **Delivered**: Successfully delivered (not bounced)
- **Delivery Rate**: Delivered / Sent
- **Opened**: Unique opens
- **Open Rate**: Opened / Delivered
- **Clicked**: Unique clicks
- **Click Rate**: Clicked / Delivered
- **Click-to-Open Rate**: Clicked / Opened
- **Replied**: Responses received
- **Response Rate**: Replied / Delivered
- **Bounced**: Failed deliveries
- **Bounce Rate**: Bounced / Sent

### Engagement Metrics
- **Engagement Score**: Weighted score based on actions
- **Time to Open**: Hours until first open
- **Time to Click**: Hours until first click
- **Time to Reply**: Hours until response
- **Multi-touch**: Contacts requiring multiple touches

### Conversion Metrics
- **Meeting Rate**: Meetings / Contacted
- **Conversion Rate**: Opportunities / Contacted
- **Pipeline Value**: Total opportunity value
- **Average Deal Size**: Pipeline Value / Opportunities
- **Cost per Meeting**: Campaign Cost / Meetings
- **ROI**: (Revenue - Cost) / Cost

## Report Templates

### Daily Report Template
```markdown
# Daily Campaign Report - [Date]

## Summary
- Emails Sent: [X]
- Open Rate: [X%]
- Response Rate: [X%]
- Meetings Scheduled: [X]

## Top Performers
1. [Contact Name] - [Action]
2. [Contact Name] - [Action]
3. [Contact Name] - [Action]

## Issues
- [Any bounces or errors]

## Tomorrow's Plan
- [Contacts to reach]
- [Follow-ups scheduled]
```

### Weekly Summary Template
```markdown
# Weekly Campaign Summary - Week of [Date]

## Overview
- Total Contacts: [X]
- Emails Sent: [X]
- Response Rate: [X%]
- Meetings: [X]

## Performance by Channel
- Investors: [Metrics]
- Customers: [Metrics]
- Partners: [Metrics]

## Top Templates
1. [Template Name] - [Open Rate]
2. [Template Name] - [Open Rate]

## Insights & Recommendations
- [Key findings]
- [Optimization suggestions]

## Next Week Goals
- [Objectives]
```

## Analytics Tools

### Built-in Analytics
- Campaign performance tracking
- Email engagement metrics
- Conversion funnel analysis
- Cohort analysis

### Integrations
- Google Analytics
- Mixpanel
- Amplitude
- Custom dashboards

## Data Visualization

### Charts & Graphs
- **Line Chart**: Metrics over time
- **Bar Chart**: Campaign comparison
- **Funnel Chart**: Conversion stages
- **Pie Chart**: Audience segments
- **Heatmap**: Send time optimization

## Export Formats

### Available Formats
- **CSV**: Raw data export
- **PDF**: Formatted reports
- **JSON**: API integration
- **Excel**: Advanced analysis

### Export Commands
```bash
# Export daily metrics
node reporting/export.js --type daily --format csv

# Export weekly summary
node reporting/export.js --type weekly --format pdf

# Export custom date range
node reporting/export.js --start 2025-12-01 --end 2025-12-31
```

## Benchmarks

### Industry Standards
- **Open Rate**: 15-25%
- **Click Rate**: 2-5%
- **Response Rate**: 1-3%
- **Meeting Rate**: 0.5-2%

### Internal Goals
- **Open Rate**: >25%
- **Click Rate**: >5%
- **Response Rate**: >3%
- **Meeting Rate**: >2%

## Alert Thresholds

### Performance Alerts
- Open rate drops below 15%
- Bounce rate exceeds 5%
- Zero responses for 3 days
- Meeting rate below 1%

### System Alerts
- Campaign failed to run
- Database connection error
- API rate limit reached
- Email service down

## Optimization Insights

### What to Monitor
1. **Best Send Times**: When do people open?
2. **Top Subject Lines**: What drives opens?
3. **Effective CTAs**: What gets clicks?
4. **Response Triggers**: What prompts replies?
5. **Segment Performance**: Which audiences engage?

### Action Items
- A/B test underperforming elements
- Double down on what works
- Pause low-performing campaigns
- Refine targeting criteria
- Update templates based on data

---

**Reporting Status**: Active
**Last Report**: [Timestamp]
**Next Report**: [Timestamp]
**Last Updated**: December 27, 2025

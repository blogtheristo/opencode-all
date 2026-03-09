# Firehorse Omnichannel Next - Admin Manual
# Complete System Administration & Operations Guide

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: 3nsxX | Commit: [pending] | Date: 25.12.2025

Session Links & References:
  - Claude Code (3nsxX): https://github.com/blogtheristo/dws6/commits/claude/firehorse-pilot-automation-3nsxX
  - GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/Firehorse_Omnichannel_Next_Admin_Manual.md

Document Status:
  - Created: 25.12.2025
  - Last Modified: 25.12.2025
  - Language: English
  - Languages Available: English
  - Publication Status: Published

Repository Status:
  - GitHub: ✅ Committed & Pushed
  - Location: /Admin/ (Protected admin documentation)
  - .gitignore: NO
  - Workflows: None (manual admin documentation)
  - Access Level: 🔴 Restricted/Protected (Admin only)

Update Process:
  - Manual edits: Risto only
  - Automated updates: None
  - Approval required: Yes - Risto approves
  - Publishing: Manual merge only
---

## 📑 Table of Contents

1. [System Overview](#system-overview)
2. [Production Readiness](#production-readiness)
3. [Technical Architecture](#technical-architecture)
4. [Database Schema](#database-schema)
5. [Codebase Structure](#codebase-structure)
6. [Configuration Management](#configuration-management)
7. [Deployment Guide](#deployment-guide)
8. [Operations & Monitoring](#operations--monitoring)
9. [Security & Compliance](#security--compliance)
10. [Data Management](#data-management)
11. [Troubleshooting](#troubleshooting)
12. [Appendix: Complete File Listing](#appendix-complete-file-listing)

---

## System Overview

### Mission Statement

**Firehorse Omnichannel Next - CustomerPilotLoop v1** is a B2B sales automation system designed to sell DWS IQ 6 + Firehorse pilots to Nordic and Central European construction/infrastructure companies with account-based precision and multi-channel execution.

### Key Objectives

- **Goal**: 2 new DWS IQ 6 + Firehorse pilots in Q1/2026
- **Target Market**: Nordic (FI, SE, NO, DK) and German (DE) construction companies
- **Account Strategy**: TOP 30 accounts in Q1 (164 total contact points)
- **Sales Commitment**: 20 hours/week dedicated execution
- **Fundraising**: 150k€ SAFE round @ 3.8M€ cap

### System Capabilities

1. **Automated Email Sequences**: Cold 1 → Cold 2 (3d) → Cold 3 (5d)
2. **LinkedIn Workflow**: Human-in-the-loop connection tracking
3. **Meeting Pipeline**: Scheduling, tracking, and outcome management
4. **Proposal Management**: Draft, sent, negotiation, won/lost tracking
5. **Multi-Threading**: 5-10 contacts per target account (CEO, COO, CDO, ESG, Portfolio)
6. **Account-Based Enforcement**: Code-level validation against TOP 30 list

---

## Production Readiness

### ✅ System Status

All development work is **complete and production-ready**. The system has been fully committed to branch `claude/firehorse-pilot-automation-3nsxX` and is ready for deployment.

### Recent Commits (Last 5)

1. `8086f21` - docs: Add investor outreach email templates for 150k€ SAFE round
2. `f24967c` - docs: Add Q1/2026 Sales Manifesto - commitment to execution
3. `e151561` - feat: Add TOP 30 account-based targeting rules for Q1/2026
4. `feb0463` - docs: Add complete sales workflow guide with weekly cadence and metrics
5. `59e4f1f` - feat: Complete LinkedIn workflow and sales pipeline automation

### Deliverables Summary

**Codebase:**
- 2,296 lines of TypeScript (12 modules)
- 5 Supabase migrations (complete schema)
- 5 core tables + 7 views
- Account-based enforcement (GOLDEN RULE)
- Multi-channel tracking (email + LinkedIn + meetings + proposals)

**Documentation:**
- DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md (325 lines)
- INVESTOR_EMAIL_TEMPLATES.md (237 lines)
- FIREHORSE_SALES_WORKFLOW.md (410 lines)
- FIREHORSE_PILOT_SUMMARY.md (407 lines)

**Data:**
- TOP 30 accounts Q1/2026 (30 companies, 164 total contacts target)
- 55 unique contacts ready for import
- Account priorities: 5 ULTRA, 5 HIGH, 10 MEDIUM, 10 LOW

---

## Technical Architecture

### Technology Stack

**Backend:**
- Node.js 18+ with TypeScript
- Express.js for API routes
- Supabase PostgreSQL for database
- Node-cron for scheduling
- Email service integration (SendGrid/Resend/AWS SES)

**Frontend Integration:**
- REST API endpoints
- Webhook receivers for email events
- Manual operations via API

**External Services:**
- Supabase (PostgreSQL database + real-time subscriptions)
- Email service provider (SendGrid/Resend/AWS SES)
- LinkedIn (manual workflow tracking)

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FIREHORSE AUTOMATION                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              STATE MACHINE LOGIC                            │
│  - Lead States (10 states)                                  │
│  - Event Triggers (email open, click, reply, meeting)       │
│  - Action Handlers (send email, create task, log event)     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              DATABASE LAYER (Supabase)                      │
│  Tables: leads, events, tasks, templates, replies,          │
│          meetings, proposals, linkedin_activities           │
│  Views: 7 operational views for automation                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│              SCHEDULER (Node-cron)                          │
│  - Daily: Process 30 new leads @ 08:00                      │
│  - Every 6h: Cold 2 & Cold 3 follow-ups                     │
│  - LinkedIn: Manual daily workflow                          │
└─────────────────────────────────────────────────────────────┘
```

### State Machine Overview

**10 Lead States:**
1. `New` - Initial state for imported leads
2. `Cold_1_Sent` - First email sent
3. `Cold_1_Opened` - Email opened (engagement signal)
4. `Cold_1_Clicked` - Link clicked (strong signal)
5. `Cold_2_Sent` - Second follow-up sent
6. `Cold_3_Sent` - Final follow-up sent
7. `Engaged` - Manual reply or conversation started
8. `Meeting_Booked` - Meeting scheduled
9. `Disqualified` - Not interested or wrong fit
10. `Parked` - Timing not right, follow up later

**Event-Driven Triggers:**
- Email Opened → Log engagement, update timestamp
- Link Clicked → Change to Engaged, create manual task
- Email Reply → Change to Engaged, create task for Risto
- Meeting Booked → Change to Meeting_Booked, create meeting record
- Manual Actions → LinkedIn connections, proposal creation

---

## Database Schema

### Core Tables

#### 1. firehorse_leads
Primary table for lead management.

```sql
CREATE TABLE firehorse_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  title VARCHAR(150),
  company VARCHAR(255),
  country lead_country NOT NULL,
  state lead_state NOT NULL DEFAULT 'New',
  linkedin_url VARCHAR(500),
  revenue_eur_million DECIMAL(10, 2),
  cold_1_sent_at TIMESTAMPTZ,
  cold_2_sent_at TIMESTAMPTZ,
  cold_3_sent_at TIMESTAMPTZ,
  last_engagement_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Fields:**
- `state`: Current state in sales funnel
- `country`: FI, SE, NO, DK, or DE (triggers country-specific messaging)
- `company`: Must be in TOP 30 list (enforced at API level)
- `*_sent_at`: Timestamps for email sequence tracking

#### 2. firehorse_events
Event log for all lead interactions.

```sql
CREATE TABLE firehorse_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES firehorse_leads(id),
  event_type event_type NOT NULL,
  event_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Event Types:**
- `EmailSent`, `EmailOpened`, `LinkClicked`, `EmailReplied`
- `MeetingBooked`, `ProposalSent`, `StateChanged`

#### 3. firehorse_tasks
Manual tasks generated by automation.

```sql
CREATE TABLE firehorse_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES firehorse_leads(id),
  task_type task_type NOT NULL,
  description TEXT,
  owner VARCHAR(50) DEFAULT 'Risto',
  completed BOOLEAN DEFAULT FALSE,
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Task Types:**
- `ManualReply`: Lead clicked link, requires personal follow-up
- `LinkedInConnect`: Send connection request
- `PrepareDemo`: Meeting booked, prepare demo
- `FollowUpCall`: Post-meeting follow-up

#### 4. firehorse_templates
Email and LinkedIn message templates.

```sql
CREATE TABLE firehorse_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  template_type template_type NOT NULL,
  language VARCHAR(2) DEFAULT 'en',
  country VARCHAR(2),
  subject VARCHAR(200),
  body TEXT NOT NULL,
  variables JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Template Types:**
- `email`: Cold email campaigns
- `linkedin_dm`: LinkedIn direct messages

**Variables:**
- `{{first_name}}`, `{{company}}`, `{{country_context}}`
- Country context injected via SQL function `get_country_context()`

#### 5. firehorse_meetings
Meeting tracking and outcomes.

```sql
CREATE TABLE firehorse_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES firehorse_leads(id),
  title VARCHAR(255) NOT NULL,
  meeting_type VARCHAR(50) DEFAULT 'demo',
  status meeting_status DEFAULT 'scheduled',
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  outcome_notes TEXT,
  next_steps TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Meeting Statuses:**
- `scheduled`, `completed`, `no_show`, `rescheduled`, `cancelled`

#### 6. firehorse_proposals
Proposal pipeline management.

```sql
CREATE TABLE firehorse_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES firehorse_leads(id),
  status proposal_status DEFAULT 'draft',
  amount_eur DECIMAL(12, 2),
  pilot_duration_months INTEGER DEFAULT 5,
  sent_at TIMESTAMPTZ,
  decision_date DATE,
  win_probability DECIMAL(3, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Proposal Statuses:**
- `draft`, `sent`, `under_negotiation`, `won`, `lost`

**Pricing:**
- Pilot: 29,950€ (5 months)
- Alpha: 55,930€ (12 months)
- V1: 10,950€/month

### Operational Views

#### 1. firehorse_daily_new_leads
Selects 30 new leads per day for Cold 1 email.

```sql
CREATE VIEW firehorse_daily_new_leads AS
SELECT * FROM firehorse_leads
WHERE state = 'New' AND cold_1_sent_at IS NULL
ORDER BY created_at ASC
LIMIT 30;
```

#### 2. firehorse_cold2_candidates
Leads eligible for Cold 2 follow-up (3 days after Cold 1).

```sql
CREATE VIEW firehorse_cold2_candidates AS
SELECT * FROM firehorse_leads
WHERE state = 'Cold_1_Sent'
  AND cold_1_sent_at < NOW() - INTERVAL '3 days'
  AND cold_2_sent_at IS NULL;
```

#### 3. firehorse_cold3_candidates
Leads eligible for Cold 3 follow-up (5 days after Cold 2).

```sql
CREATE VIEW firehorse_cold3_candidates AS
SELECT * FROM firehorse_leads
WHERE state = 'Cold_2_Sent'
  AND cold_2_sent_at < NOW() - INTERVAL '5 days'
  AND cold_3_sent_at IS NULL;
```

#### 4. linkedin_pending
LinkedIn connections pending manual action.

```sql
CREATE VIEW linkedin_pending AS
SELECT l.*, a.connection_requested_at
FROM firehorse_leads l
LEFT JOIN firehorse_linkedin_activities a ON l.id = a.lead_id
WHERE a.connection_status = 'pending' OR a.connection_status IS NULL
ORDER BY a.connection_requested_at ASC NULLS LAST;
```

#### 5. upcoming_meetings
Next 7 days of scheduled meetings.

```sql
CREATE VIEW upcoming_meetings AS
SELECT m.*, l.first_name, l.last_name, l.company
FROM firehorse_meetings m
JOIN firehorse_leads l ON m.lead_id = l.id
WHERE m.status = 'scheduled'
  AND m.scheduled_at BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY m.scheduled_at ASC;
```

#### 6. active_proposals
Proposals in draft, sent, or negotiation.

```sql
CREATE VIEW active_proposals AS
SELECT p.*, l.first_name, l.last_name, l.company
FROM firehorse_proposals p
JOIN firehorse_leads l ON p.lead_id = l.id
WHERE p.status IN ('draft', 'sent', 'under_negotiation')
ORDER BY p.created_at DESC;
```

#### 7. sales_pipeline
Full funnel visibility.

```sql
CREATE VIEW sales_pipeline AS
SELECT
  l.state,
  COUNT(*) as count,
  SUM(CASE WHEN p.amount_eur IS NOT NULL THEN p.amount_eur ELSE 0 END) as total_value_eur
FROM firehorse_leads l
LEFT JOIN firehorse_proposals p ON l.id = p.lead_id
GROUP BY l.state
ORDER BY l.state;
```

---

## Codebase Structure

### Source Code (src/firehorse/)

**12 TypeScript Modules (2,296 lines):**

1. **types.ts** (193 lines)
   - TypeScript type definitions
   - Enums: LeadState, LeadCountry, EventType, TaskType, TemplateType
   - Interfaces: Lead, Event, Task, Template, Meeting, Proposal

2. **state-machine.ts** (375 lines)
   - Core state machine logic
   - Event handlers: handleEmailOpened, handleLinkClicked, handleEmailReply
   - Daily automation: processNewLeadsDaily, processCold2Candidates, processCold3Candidates

3. **actions.ts** (262 lines)
   - Action functions: sendEmail, changeState, logEvent, createTask
   - Email template rendering with variable substitution
   - Country context injection

4. **database.ts** (258 lines)
   - Supabase client wrapper
   - Database operations: getNewLeadsForToday, getCold2Candidates, getCold3Candidates
   - SQL function calls: getCountryContext()

5. **email-service.ts** (145 lines)
   - Email provider abstraction
   - Integration with SendGrid/Resend/AWS SES
   - Webhook URL registration for tracking

6. **scheduler.ts** (107 lines)
   - Node-cron based automation
   - Daily job @ 08:00: Process 30 new leads
   - Every 6 hours: Cold 2 & Cold 3 follow-ups

7. **routes.ts** (308 lines)
   - Express.js API routes
   - Webhook endpoints for email events
   - Manual operations: create lead, update state, create meeting

8. **account-based-rules.ts** (209 lines)
   - TOP 30 account list enforcement
   - `enforceAccountBasedRule()` throws error if company not in target list
   - Account priority calculation (ULTRA, HIGH, MEDIUM, LOW)
   - Multi-threading targets (4-8 contacts per account)

9. **linkedin-workflow.ts** (126 lines)
   - Human-in-the-loop LinkedIn tracking
   - `generateLinkedInNote()` for connection requests
   - Country-specific message templates (FI, SE, EN)

10. **sales-pipeline.ts** (190 lines)
    - Meeting management: scheduleMeeting, updateMeetingOutcome
    - Proposal management: createProposal, updateProposalStatus

11. **helpers.ts** (98 lines)
    - Utility functions
    - Template variable substitution
    - Date formatting
    - Email validation

12. **index.ts** (25 lines)
    - Module exports
    - Public API surface

### Scripts (scripts/)

**1. import-leads-csv.ts**
- Batch import leads from CSV
- Validation: required fields, country codes, email format
- Account-based validation: company must be in TOP 30

**Example Usage:**
```bash
npm run import-csv data/prospects-nordic-cee-top50.csv
```

### Data Files (data/)

**1. top-30-accounts-q1-2026.csv**
- 30 target companies for Q1
- Columns: account_id, company, country, revenue_eur_million, priority, contacts_target
- Priorities: ULTRA (8), HIGH (6), MEDIUM (5), LOW (4)

**2. leads-example.csv**
- 10 example contacts (including PORR AG leadership)
- Format: email, first_name, last_name, title, company, country, linkedin_url

**3. prospects-nordic-cee-top50.csv**
- 48 real prospect contacts
- Nordic and CEE construction industry leaders

### Documentation Files

**1. DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md** (325 lines)
- 5-part structure: FOKUS, RYTMI, TAVOITTEET, SÄÄNNÖT, TODISTEET
- 18h/week commitment breakdown
- 164 contacts → 8-12 demos → 2 pilots (59,900€)
- GOLDEN RULE: No outbound outside TOP 30

**2. INVESTOR_EMAIL_TEMPLATES.md** (237 lines)
- 4 templates: VC/Family Office, Operator Angel, Warm Intro, LinkedIn DM
- Objection handling guide
- Follow-up sequences (Day 0, 5, 10)
- 150k€ SAFE round @ 3.8M€ cap

**3. FIREHORSE_SALES_WORKFLOW.md** (410 lines)
- Weekly schedule (Ma-Pe breakdown)
- Q1 execution checklist (Week 0-13)
- Multi-threading examples (NCC AB 8-contact plan)
- Sales pipeline dashboard metrics

**4. FIREHORSE_PILOT_SUMMARY.md** (407 lines)
- Email templates (Cold 1-3, FI/EN variants)
- LinkedIn DM templates (General, SE, DE)
- API endpoints documentation
- Pricing tiers

---

## Configuration Management

### Environment Variables

**Required Variables (.env):**

```bash
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Email Service (choose one)
EMAIL_SERVICE=sendgrid  # or 'resend' or 'ses'

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=risto@firehorse.io

# Resend
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=risto@firehorse.io

# AWS SES
AWS_REGION=eu-north-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
SES_FROM_EMAIL=risto@firehorse.io

# Scheduler
FIREHORSE_SCHEDULER_ENABLED=true
DAILY_PROCESS_HOUR=08
DAILY_PROCESS_MINUTE=00
FOLLOWUP_INTERVAL_HOURS=6
```

**Optional Variables:**

```bash
# Logging
LOG_LEVEL=info  # debug, info, warn, error

# Rate Limiting
MAX_EMAILS_PER_DAY=100
```

### Configuration Files

**1. package.json**
- Dependencies: @supabase/supabase-js, express, node-cron, tsx
- Scripts: dev (tsx watch), build (tsc), start (node dist/index.js)

**2. tsconfig.json**
- TypeScript compiler configuration
- Target: ES2020, Module: CommonJS
- Strict mode enabled

**3. .env.example**
- Template for environment variables
- Copy to .env and fill in actual values

---

## Deployment Guide

### Prerequisites

1. **Node.js 18+** and npm installed
2. **Supabase account** with project created
3. **Email service account** (SendGrid/Resend/AWS SES)
4. **PostgreSQL access** (via Supabase)

### Step-by-Step Deployment

#### 1. Clone Repository

```bash
git clone https://github.com/blogtheristo/dws6.git
cd dws6
git checkout claude/firehorse-pilot-automation-3nsxX
```

#### 2. Install Dependencies

```bash
npm install
```

**If npm install fails:**
- Check package.json for correct versions
- Known issue: @types/csurf should be ^1.11.5 (not 1.11.6)

#### 3. Set Up Supabase

**Run Migrations:**

```bash
# Migration 002: Core schema
psql postgresql://postgres:password@db.supabase.co:5432/postgres \
  < supabase/migrations/002_firehorse_pilot.sql

# Migration 003: LinkedIn DM templates
psql postgresql://postgres:password@db.supabase.co:5432/postgres \
  < supabase/migrations/003_firehorse_linkedin_dm_templates.sql

# Migration 004: PORR AG templates
psql postgresql://postgres:password@db.supabase.co:5432/postgres \
  < supabase/migrations/004_firehorse_porr_templates.sql

# Migration 005: LinkedIn workflow
psql postgresql://postgres:password@db.supabase.co:5432/postgres \
  < supabase/migrations/005_firehorse_linkedin_workflow.sql
```

**Verify Tables:**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'firehorse%';
```

Expected: 8 tables (leads, events, tasks, templates, replies, meetings, proposals, linkedin_activities)

#### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

**Required:**
- SUPABASE_URL and SUPABASE_ANON_KEY from Supabase dashboard
- Email service API key
- FROM_EMAIL address (verified domain)

#### 5. Import Initial Data

```bash
# Import TOP 30 accounts
npm run import-csv data/top-30-accounts-q1-2026.csv

# Import prospect contacts
npm run import-csv data/prospects-nordic-cee-top50.csv
```

**Verify Import:**

```sql
SELECT COUNT(*) FROM firehorse_leads;
-- Expected: 55 contacts

SELECT company, COUNT(*) as contacts
FROM firehorse_leads
GROUP BY company
ORDER BY contacts DESC;
-- Should show TOP 30 companies
```

#### 6. Test Email Service

```bash
# Send test email
curl -X POST http://localhost:3001/api/firehorse/test-email \
  -H "Content-Type: application/json" \
  -d '{"to":"your-email@example.com"}'
```

#### 7. Start Development Server

```bash
npm run dev
```

Server should start on `http://localhost:3001`

#### 8. Verify API Endpoints

```bash
# Health check
curl http://localhost:3001/health

# Get all leads
curl http://localhost:3001/api/firehorse/leads

# Create test task
curl -X POST http://localhost:3001/api/firehorse/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id":"lead-uuid",
    "task_type":"ManualReply",
    "description":"Test task"
  }'
```

#### 9. Start Scheduler

The scheduler starts automatically when the server starts (if FIREHORSE_SCHEDULER_ENABLED=true).

**Verify Scheduler:**

```bash
# Check logs for:
# [Firehorse Scheduler] Daily job scheduled for 08:00
# [Firehorse Scheduler] Follow-up job scheduled every 6 hours
```

#### 10. Production Build

```bash
npm run build
npm start
```

### Production Considerations

**Security:**
- Use environment-specific .env files (.env.production)
- Never commit .env files to Git
- Rotate API keys regularly
- Use HTTPS for all API endpoints

**Monitoring:**
- Set up error tracking (Sentry, Rollbar)
- Monitor email delivery rates
- Track API response times
- Alert on scheduler failures

**Scaling:**
- Use PM2 for process management: `pm2 start dist/index.js --name firehorse`
- Consider load balancer for multiple instances
- Database connection pooling (Supabase handles this)

---

## Operations & Monitoring

### Daily Operations Checklist

**Morning (08:00-09:00):**
- [ ] Review overnight automation logs
- [ ] Check email delivery report (Cold 1 sent to 30 new leads)
- [ ] Send 3 LinkedIn connection requests (manual)
- [ ] Review new tasks in dashboard

**Throughout Day:**
- [ ] Respond to email replies within 4 hours
- [ ] Update meeting notes and outcomes
- [ ] Move proposals through pipeline stages

**End of Day:**
- [ ] Review daily metrics (emails sent, opens, clicks, replies)
- [ ] Log any manual actions in database
- [ ] Plan tomorrow's priority contacts

### Weekly Review (Friday 09:00-10:00)

**Metrics to Review:**
1. **Outbound Activity:**
   - LinkedIn connections sent: Target 15/week (3/day × 5 days)
   - Cold emails sent: Target ~150/week (30/day × 5 days)
   - Reply rate: Target 2-5%

2. **Engagement:**
   - Email open rate: Target 25-35%
   - Link click rate: Target 3-5%
   - Meeting booked rate: Target 1-2%

3. **Pipeline:**
   - Demos scheduled this week
   - Proposals sent
   - Deals in negotiation

4. **GOLDEN RULE Compliance:**
   - All outbound to TOP 30 accounts only ✅
   - No spray-and-pray violations ✅

### Monitoring Queries

#### 1. Daily Outbound Report

```sql
-- Emails sent today
SELECT COUNT(*) as emails_sent_today
FROM firehorse_events
WHERE event_type = 'EmailSent'
  AND created_at::date = CURRENT_DATE;

-- Opens today
SELECT COUNT(*) as emails_opened_today
FROM firehorse_events
WHERE event_type = 'EmailOpened'
  AND created_at::date = CURRENT_DATE;

-- Clicks today
SELECT COUNT(*) as links_clicked_today
FROM firehorse_events
WHERE event_type = 'LinkClicked'
  AND created_at::date = CURRENT_DATE;
```

#### 2. Pipeline Health

```sql
SELECT * FROM sales_pipeline;
-- Shows count and value by state
```

#### 3. Top Engaged Companies

```sql
SELECT
  company,
  COUNT(*) as engagement_events,
  MAX(last_engagement_at) as last_active
FROM firehorse_leads
WHERE last_engagement_at IS NOT NULL
GROUP BY company
ORDER BY engagement_events DESC
LIMIT 10;
```

#### 4. Tasks Due Today

```sql
SELECT
  t.description,
  t.task_type,
  l.first_name,
  l.last_name,
  l.company
FROM firehorse_tasks t
JOIN firehorse_leads l ON t.lead_id = l.id
WHERE t.completed = FALSE
  AND (t.due_date IS NULL OR t.due_date <= CURRENT_DATE)
ORDER BY t.created_at ASC;
```

### Logging & Debugging

**Log Levels:**
- `DEBUG`: Detailed execution flow (development only)
- `INFO`: Normal operations (email sent, state changed)
- `WARN`: Unexpected but handled (rate limit hit, API slow)
- `ERROR`: Failures requiring attention (email bounce, database error)

**Common Log Patterns:**

```typescript
// Example INFO log
logger.info({
  event: 'email_sent',
  lead_id: 'uuid',
  template: 'cold1_fi',
  recipient: 'email@example.com'
});

// Example ERROR log
logger.error({
  event: 'email_send_failed',
  lead_id: 'uuid',
  error: error.message,
  stack: error.stack
});
```

**Log Locations:**
- Development: Console output
- Production: File logs in `logs/` directory
- Suggested: Integrate with Datadog, Papertrail, or CloudWatch

---

## Security & Compliance

### Data Protection

**Personal Data Stored:**
- First name, last name, email, job title
- Company name, LinkedIn URL
- Engagement timestamps (email opens, clicks)
- Meeting notes and proposal details

**GDPR Compliance:**
- Legitimate interest basis: B2B sales outreach to public business contacts
- Right to deletion: Implement API endpoint to purge lead data
- Data minimization: Only collect necessary fields
- Encryption: All data at rest (Supabase) and in transit (HTTPS)

**Data Retention:**
- Active leads: Keep indefinitely while in pipeline
- Disqualified leads: Purge after 12 months
- Won/lost proposals: Archive after 24 months
- Event logs: Retain for 6 months

### Access Control

**Database:**
- Supabase Row-Level Security (RLS) policies
- Service role key for backend (keep secret)
- Anon key for client-side (if applicable)

**API:**
- Authentication required for all write operations
- API key rotation every 90 days
- Rate limiting: 100 requests/hour per IP

**Secrets Management:**
- Never commit .env files
- Use environment-specific configs
- Rotate API keys on compromise

### Security Best Practices

1. **Input Validation:**
   - Validate email addresses before import
   - Sanitize all user inputs
   - Check company name against TOP 30 list

2. **Rate Limiting:**
   - Email: Max 100 emails/day (provider limits)
   - LinkedIn: Max 15 connections/week (platform policy)

3. **Monitoring:**
   - Alert on unusual activity (sudden spike in emails)
   - Track failed login attempts (if authentication added)
   - Monitor database query performance

4. **Backup:**
   - Supabase automatic backups (daily)
   - Export CSV backups weekly to local/S3
   - Test restoration procedure monthly

---

## Data Management

### Lead Import Process

**CSV Format:**

```csv
email,first_name,last_name,title,company,country,linkedin_url,revenue_eur_million
john.doe@example.com,John,Doe,CEO,Example Corp,FI,linkedin.com/in/johndoe,150
```

**Validation Rules:**
1. Email must be valid format and unique
2. Country must be one of: FI, SE, NO, DK, DE
3. Company must be in TOP 30 list (enforced by account-based-rules.ts)
4. LinkedIn URL optional but recommended

**Import Command:**

```bash
npm run import-csv data/your-file.csv
```

**Import Error Handling:**
- Duplicate emails: Skip with warning
- Invalid country: Reject row
- Company not in TOP 30: Reject with error
- Missing required field: Reject row

### Export & Reporting

#### 1. Export All Leads to CSV

```sql
COPY (
  SELECT email, first_name, last_name, title, company, country, state, created_at
  FROM firehorse_leads
  ORDER BY created_at DESC
) TO '/tmp/firehorse_leads_export.csv' CSV HEADER;
```

#### 2. Weekly Activity Report

```sql
SELECT
  DATE_TRUNC('week', created_at) as week,
  event_type,
  COUNT(*) as count
FROM firehorse_events
WHERE created_at >= NOW() - INTERVAL '4 weeks'
GROUP BY week, event_type
ORDER BY week DESC, event_type;
```

#### 3. Account Penetration Report

```sql
SELECT
  company,
  COUNT(*) as total_contacts,
  SUM(CASE WHEN state IN ('Engaged', 'Meeting_Booked') THEN 1 ELSE 0 END) as engaged_contacts,
  MAX(last_engagement_at) as last_activity
FROM firehorse_leads
WHERE company IN (SELECT company FROM top_30_accounts_q1_2026)
GROUP BY company
ORDER BY engaged_contacts DESC, total_contacts DESC;
```

### Data Cleanup

**Remove Duplicates:**

```sql
-- Find duplicates
SELECT email, COUNT(*) as count
FROM firehorse_leads
GROUP BY email
HAVING COUNT(*) > 1;

-- Delete duplicates (keep oldest)
DELETE FROM firehorse_leads
WHERE id NOT IN (
  SELECT MIN(id)
  FROM firehorse_leads
  GROUP BY email
);
```

**Archive Old Disqualified Leads:**

```sql
-- Create archive table (one-time)
CREATE TABLE firehorse_leads_archive AS
SELECT * FROM firehorse_leads WHERE 1=0;

-- Move disqualified leads older than 12 months
INSERT INTO firehorse_leads_archive
SELECT * FROM firehorse_leads
WHERE state = 'Disqualified'
  AND updated_at < NOW() - INTERVAL '12 months';

DELETE FROM firehorse_leads
WHERE state = 'Disqualified'
  AND updated_at < NOW() - INTERVAL '12 months';
```

---

## Troubleshooting

### Common Issues

#### 1. Scheduler Not Running

**Symptoms:**
- No emails sent at 08:00
- Follow-ups not triggered

**Diagnosis:**

```bash
# Check scheduler status in logs
grep "Scheduler" logs/app.log

# Expected:
# [Firehorse Scheduler] Started
# [Firehorse Scheduler] Daily job scheduled
```

**Solutions:**
- Verify `FIREHORSE_SCHEDULER_ENABLED=true` in .env
- Check server timezone: `date` (should match Europe/Helsinki or UTC)
- Restart server: `pm2 restart firehorse`

#### 2. Emails Not Sending

**Symptoms:**
- Leads stuck in `New` state
- No EmailSent events in database

**Diagnosis:**

```sql
-- Check for failed email attempts
SELECT * FROM firehorse_events
WHERE event_type = 'EmailSendFailed'
ORDER BY created_at DESC
LIMIT 10;
```

**Solutions:**
- Verify email service API key is correct
- Check FROM_EMAIL is verified in provider dashboard
- Test email service independently:
  ```bash
  curl -X POST http://localhost:3001/api/firehorse/test-email \
    -H "Content-Type: application/json" \
    -d '{"to":"your-email@example.com"}'
  ```
- Check rate limits (SendGrid: 100/day on free tier)

#### 3. Database Connection Errors

**Symptoms:**
- API returns 500 errors
- "Unable to connect to database" in logs

**Diagnosis:**

```bash
# Test Supabase connection
curl https://your-project.supabase.co/rest/v1/firehorse_leads \
  -H "apikey: your-anon-key"
```

**Solutions:**
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in .env
- Check Supabase project status (not paused)
- Review Supabase logs for errors
- Test PostgreSQL connection: `psql $DATABASE_URL`

#### 4. Account-Based Rule Violations

**Symptoms:**
- Error: "ACCOUNT-BASED RULE VIOLATION: Company not in target list"

**This is expected behavior!** The system enforces the GOLDEN RULE.

**Solutions:**
- Add company to TOP 30 list in `src/firehorse/account-based-rules.ts`:
  ```typescript
  export const TOP_30_Q1 = [
    'NCC AB',
    'Skanska AB',
    // ... add new company here
  ];
  ```
- Or import only contacts from TOP 30 companies
- Review `data/top-30-accounts-q1-2026.csv` for approved list

#### 5. LinkedIn Workflow Issues

**Symptoms:**
- Connection requests not tracked
- linkedin_pending view empty

**Diagnosis:**

```sql
SELECT * FROM firehorse_linkedin_activities
ORDER BY created_at DESC
LIMIT 10;
```

**Solutions:**
- LinkedIn workflow is **manual** (not automated)
- Use API to log connections:
  ```bash
  curl -X POST http://localhost:3001/api/firehorse/linkedin/connect \
    -H "Content-Type: application/json" \
    -d '{"lead_id":"uuid","note":"Hej ...","language":"se"}'
  ```
- Review FIREHORSE_SALES_WORKFLOW.md for daily process

---

## Appendix: Complete File Listing

### Repository Structure

```
dws6/
├── Admin/
│   └── Firehorse_Omnichannel_Next_Admin_Manual.md (THIS FILE)
├── data/
│   ├── leads-example.csv (10 contacts)
│   ├── prospects-nordic-cee-top50.csv (48 contacts)
│   └── top-30-accounts-q1-2026.csv (30 companies)
├── scripts/
│   └── import-leads-csv.ts
├── src/
│   └── firehorse/
│       ├── types.ts (193 lines)
│       ├── state-machine.ts (375 lines)
│       ├── actions.ts (262 lines)
│       ├── database.ts (258 lines)
│       ├── email-service.ts (145 lines)
│       ├── scheduler.ts (107 lines)
│       ├── routes.ts (308 lines)
│       ├── account-based-rules.ts (209 lines)
│       ├── linkedin-workflow.ts (126 lines)
│       ├── sales-pipeline.ts (190 lines)
│       ├── helpers.ts (98 lines)
│       └── index.ts (25 lines)
├── supabase/
│   └── migrations/
│       ├── 002_firehorse_pilot.sql
│       ├── 003_firehorse_linkedin_dm_templates.sql
│       ├── 004_firehorse_porr_templates.sql
│       └── 005_firehorse_linkedin_workflow.sql
├── DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md (325 lines)
├── FIREHORSE_PILOT_SUMMARY.md (407 lines)
├── FIREHORSE_SALES_WORKFLOW.md (410 lines)
├── INVESTOR_EMAIL_TEMPLATES.md (237 lines)
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

### Code Statistics

- **Total TypeScript Lines**: 2,296
- **Total Migration SQL Lines**: ~800
- **Total Documentation Lines**: 1,379
- **Total Data Rows**: 93 (55 contacts + 30 accounts + 8 table structures)

### Key Files by Function

**Configuration:**
- `.env.example` - Environment variables template
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript compiler config

**Database:**
- `supabase/migrations/002_firehorse_pilot.sql` - Core schema
- `supabase/migrations/003_firehorse_linkedin_dm_templates.sql` - LinkedIn templates
- `supabase/migrations/004_firehorse_porr_templates.sql` - PORR strategic templates
- `supabase/migrations/005_firehorse_linkedin_workflow.sql` - LinkedIn tracking

**Core Logic:**
- `src/firehorse/state-machine.ts` - State transitions and automation
- `src/firehorse/actions.ts` - Email sending, task creation, state changes
- `src/firehorse/account-based-rules.ts` - TOP 30 enforcement

**API:**
- `src/firehorse/routes.ts` - Express endpoints and webhooks
- `src/firehorse/scheduler.ts` - Cron jobs for automation

**Data:**
- `data/top-30-accounts-q1-2026.csv` - Target account list
- `data/prospects-nordic-cee-top50.csv` - Prospect contacts

**Documentation:**
- `DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md` - Q1 commitment and strategy
- `FIREHORSE_SALES_WORKFLOW.md` - Weekly execution guide
- `INVESTOR_EMAIL_TEMPLATES.md` - Fundraising materials
- `Admin/Firehorse_Omnichannel_Next_Admin_Manual.md` - THIS FILE

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev                          # Start dev server with hot reload
npm run build                        # Compile TypeScript to JavaScript
npm start                            # Start production server

# Database
npm run migrate                      # Run Supabase migrations
npm run import-csv <file>            # Import leads from CSV

# Testing
curl http://localhost:3001/health    # Health check
curl http://localhost:3001/api/firehorse/leads  # Get all leads
```

### Key Metrics Targets

- **Daily Outbound**: 30 emails (automated @ 08:00)
- **Weekly LinkedIn**: 15 connections (3/day × 5 days, manual)
- **Q1 Total Contacts**: 164 (across TOP 30 accounts)
- **Conversion Funnel**: 164 contacts → 8-12 demos → 2 pilots
- **Revenue Target**: 59,900€ (2 pilots × 29,950€)

### Support Contacts

- **System Administrator**: Risto Päärni
- **Email**: risto@lifetime.fi
- **GitHub**: blogtheristo/dws6
- **Branch**: claude/firehorse-pilot-automation-3nsxX

---

**Document Version:** 1.0
**Last Updated:** 25.12.2025
**Status:** ✅ Production Ready
**Access Level:** 🔴 Restricted - Admin Only

© 2025 Lifetime Oy. All rights reserved.

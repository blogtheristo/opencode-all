# DWS Sales AI Agents - Deployment Guide

## Phase 1 Implementation (Weeks 1-4)

---

**Version:** 1.0
**Created:** 2026-01-19
**Owner:** Lifetime Oy - Sales & Engineering
**Status:** Ready for Deployment

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Google Cloud Setup](#google-cloud-setup)
3. [Supabase Migration](#supabase-migration)
4. [Build & Deploy Agents](#build--deploy-agents)
5. [Monitoring & Dashboards](#monitoring--dashboards)
6. [Week 1-4 Checklist](#week-1-4-checklist)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Access

- [ ] Google Cloud Project with billing enabled
- [ ] Supabase project (existing DWS IQ 6 project)
- [ ] API Keys:
  - Anthropic API key (Claude Sonnet 4.5)
  - Groq API key (Llama 3.1 70B)
  - Apollo.io API key
  - Clearbit API key
  - Amazon SES SMTP credentials (SMTP_USER, SMTP_PASS, SMTP_HOST)
  - LinkedIn Sales Navigator account
- [ ] GitHub repository access (blogtheristo/dws6)
- [ ] Notification channel: WhatsApp Business Cloud API, Microsoft Teams webhook, or self-hosted ntfy/Gotify

### Local Development Tools

```bash
# Install required CLI tools
brew install gcloud  # Google Cloud SDK
brew install supabase/tap/supabase  # Supabase CLI
brew install docker  # Docker Desktop

# Verify installations
gcloud --version
supabase --version
docker --version
```

---

## Google Cloud Setup

### Step 1: Configure GCP Project

```bash
# Set your project ID
export PROJECT_ID="dws-iq6-production"
export REGION="europe-north1"

# Authenticate
gcloud auth login
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  cloudscheduler.googleapis.com \
  secretmanager.googleapis.com
```

### Step 2: Create Artifact Registry

```bash
# Create Docker repository for agent images
gcloud artifacts repositories create dws-agents \
  --repository-format=docker \
  --location=$REGION \
  --description="DWS Sales AI Agent container images"

# Configure Docker authentication
gcloud auth configure-docker ${REGION}-docker.pkg.dev
```

### Step 3: Create Service Account

```bash
# Create service account for agents
gcloud iam service-accounts create sales-agents \
  --display-name="DWS Sales AI Agents" \
  --description="Service account for running sales automation agents"

# Grant necessary permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:sales-agents@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:sales-agents@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

### Step 4: Store Secrets in Secret Manager

```bash
# Anthropic API Key
echo -n "sk-ant-your-key-here" | gcloud secrets create anthropic-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Supabase credentials
echo -n "https://your-project.supabase.co" | gcloud secrets create supabase-url \
  --data-file=- \
  --replication-policy="automatic"

echo -n "your-service-role-key" | gcloud secrets create supabase-service-key \
  --data-file=- \
  --replication-policy="automatic"

# Apollo.io API Key
echo -n "your-apollo-key" | gcloud secrets create apollo-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Clearbit API Key
echo -n "your-clearbit-key" | gcloud secrets create clearbit-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Groq API Key
echo -n "your-groq-key" | gcloud secrets create groq-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Resend API Key
echo -n "your-resend-key" | gcloud secrets create resend-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Generic notification webhook (Teams, ntfy/Gotify, or other approved broker)
echo -n "https://notify.example.internal/dws-alerts" | gcloud secrets create notify-webhook \
  --data-file=- \
  --replication-policy="automatic"

# WhatsApp alerting bundle: WHATSAPP_* env vars in dotenv format
printf "WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id\nWHATSAPP_ACCESS_TOKEN=your-token\nWHATSAPP_DEFAULT_RECIPIENT=+358401234567\n" | gcloud secrets create whatsapp-alerting \
  --data-file=- \
  --replication-policy="automatic"

# LinkedIn credentials
echo -n "your-linkedin-email" | gcloud secrets create linkedin-email \
  --data-file=- \
  --replication-policy="automatic"

echo -n "your-linkedin-password" | gcloud secrets create linkedin-password \
  --data-file=- \
  --replication-policy="automatic"
```

---

## Supabase Migration

### Step 1: Test Migration Locally

```bash
# Navigate to project root
cd /home/user/dws6

# Link to Supabase project
supabase link --project-ref your-project-ref

# Test migration
supabase db reset --local

# If successful, apply to production
supabase db push
```

### Step 2: Verify Tables Created

```sql
-- Connect to Supabase SQL Editor and verify:

-- Check new columns on firehorse_leads
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'firehorse_leads'
  AND column_name IN ('icp_score', 'priority', 'enrichment_data');

-- Check new tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('agent_metrics', 'agent_signals', 'agent_costs', 'agent_approvals');

-- Check views
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name LIKE 'v_%';
```

### Step 3: Test Functions

```sql
-- Test emit_agent_signal function
SELECT emit_agent_signal(
  'lead-scout-001',
  'READY',
  'test-milestone',
  NULL,
  '{"test": true}'::jsonb
);

-- Verify signal was created
SELECT * FROM agent_signals ORDER BY emitted_at DESC LIMIT 1;

-- Test update_agent_metrics function
SELECT update_agent_metrics('lead-scout-001', CURRENT_DATE);

-- Verify metrics row created
SELECT * FROM agent_metrics WHERE agent_id = 'lead-scout-001';
```

---

## Build & Deploy Agents

### Step 1: Build Docker Image Locally (Optional Test)

```bash
cd /home/user/dws6

# Build image
docker build -f AgentFoundry/Dockerfile -t sales-agent:test .

# Test run locally
docker run -p 8080:8080 \
  -e AGENT_ID=lead-scout-001 \
  -e AGENT_CONFIG_PATH=/app/AgentFoundry/configs/production/lead-scout-001.yaml \
  -e SUPABASE_URL=https://your-project.supabase.co \
  -e SUPABASE_KEY=your-service-key \
  -e ANTHROPIC_API_KEY=sk-ant-your-key \
  sales-agent:test

# Test health endpoint
curl http://localhost:8080/health
# Expected: {"status":"healthy","timestamp":"2026-01-19T..."}

# Stop container
docker stop $(docker ps -q --filter ancestor=sales-agent:test)
```

### Step 2: Deploy via Cloud Build

```bash
cd /home/user/dws6

# Submit build to Google Cloud Build
gcloud builds submit \
  --config=AgentFoundry/cloudbuild.yaml \
  --substitutions=_ENVIRONMENT=production,_REGION=europe-north1 \
  .

# Monitor build progress
# Build typically takes 10-15 minutes
# View logs at: https://console.cloud.google.com/cloud-build/builds
```

### Step 3: Verify Deployment

```bash
# Check Cloud Run services
gcloud run services list --region=europe-north1

# Expected output:
# SERVICE                  REGION          URL                                            LAST DEPLOYED BY
# agent-lead-scout-001     europe-north1   https://agent-lead-scout-001-xxx-ew.a.run.app  ...
# agent-outreach-001       europe-north1   https://agent-outreach-001-xxx-ew.a.run.app    ...

# Test Lead Scout agent
LEAD_SCOUT_URL=$(gcloud run services describe agent-lead-scout-001 \
  --region=europe-north1 \
  --format='value(status.url)')

curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  $LEAD_SCOUT_URL/health
```

### Step 4: Configure Cloud Scheduler

```bash
# Update Cloud Scheduler with actual service URLs
# (cloudbuild.yaml creates placeholder jobs, now update them)

# Get Lead Scout URL
LEAD_SCOUT_URL=$(gcloud run services describe agent-lead-scout-001 \
  --region=europe-north1 \
  --format='value(status.url)')

# Update Lead Scout daily job
gcloud scheduler jobs update http lead-scout-daily-run \
  --location=europe-north1 \
  --uri="${LEAD_SCOUT_URL}/run" \
  --oidc-token-audience="${LEAD_SCOUT_URL}"

# Get Outreach URL
OUTREACH_URL=$(gcloud run services describe agent-outreach-001 \
  --region=europe-north1 \
  --format='value(status.url)')

# Update Outreach daily job (Mon-Fri only)
gcloud scheduler jobs update http outreach-daily-run \
  --location=europe-north1 \
  --uri="${OUTREACH_URL}/run" \
  --oidc-token-audience="${OUTREACH_URL}"

# List scheduled jobs
gcloud scheduler jobs list --location=europe-north1
```

### Step 5: Manual Test Run

```bash
# Trigger Lead Scout agent manually (don't wait for scheduled time)
gcloud scheduler jobs run lead-scout-daily-run --location=europe-north1

# Check logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=agent-lead-scout-001" \
  --limit 50 \
  --format json

# Or view in Cloud Console:
# https://console.cloud.google.com/run/detail/europe-north1/agent-lead-scout-001/logs
```

---

## Monitoring & Dashboards

### Supabase Dashboard Queries

**Save these queries in Supabase SQL Editor for daily monitoring:**

#### 1. High-Priority Leads (Ready for Outreach)

```sql
-- High-priority leads enriched today
SELECT
  company,
  first_name || ' ' || last_name as contact,
  title,
  icp_score,
  priority,
  trigger_events,
  enriched_at
FROM v_high_priority_leads
WHERE enriched_at::date = CURRENT_DATE
ORDER BY icp_score DESC;
```

#### 2. Agent Performance Leaderboard

```sql
-- Last 7 days agent performance
SELECT * FROM v_agent_performance_leaderboard;
```

#### 3. Pending Approvals (for Outreach Agent in Advisor mode)

```sql
-- Emails waiting for HIL Director approval
SELECT * FROM v_pending_approvals
ORDER BY created_at ASC;
```

#### 4. Daily Metrics Summary

```sql
-- Today's agent activity
SELECT
  agent_id,
  leads_processed,
  emails_sent,
  open_rate,
  reply_rate,
  meeting_booked_rate,
  spam_complaints,
  estimated_cost_eur
FROM agent_metrics
WHERE metric_date = CURRENT_DATE;
```

#### 5. Cost Tracking

```sql
-- Month-to-date agent costs
SELECT
  agent_id,
  SUM(total_cost_eur) as mtd_cost_eur,
  COUNT(*) as days_active
FROM agent_costs
WHERE cost_date >= DATE_TRUNC('month', CURRENT_DATE)
GROUP BY agent_id
ORDER BY mtd_cost_eur DESC;
```

### WhatsApp / Webhook Notifications

**Configure alert routing in each agent YAML:**

- ✅ **Daily Summary** (9 AM CET): Leads enriched, emails sent, meetings booked
- ⚠️ **Error Alerts**: Agent failures, API errors, GDPR violations
- 🚨 **Critical Alerts**: Spam complaints, budget thresholds (80%), security issues

WhatsApp Business Cloud API is optional and requires Meta-approved templates for outbound
business-initiated messages. For EU-sovereignty customers, point `NOTIFY_WEBHOOK_URL` to a
self-hosted ntfy/Gotify endpoint or an enterprise Teams webhook.

**Example alert message format:**

```
🤖 Lead Scout Agent - Daily Summary
📅 Date: 2026-01-19

✅ Leads Enriched: 87
⭐ High Priority: 32 (ICP 70+)
📊 Avg ICP Score: 68
💰 Cost: €2.34

🔗 View Dashboard: https://supabase.com/dashboard/project/xxx
```

### Google Cloud Monitoring

**Create custom dashboards in Cloud Console:**

1. **Agent Health Dashboard**
   - Cloud Run request count
   - Error rate
   - Latency p50/p95/p99
   - Instance count (should be 0 when idle)

2. **Cost Dashboard**
   - Daily spend by agent
   - LLM API costs (Anthropic, Groq)
   - Cloud Run compute costs
   - Trend analysis (week-over-week)

3. **Alerts**
   - Error rate > 5%
   - Latency p95 > 30s
   - Daily budget exceeded
   - Spam complaint detected

---

## Week 1-4 Checklist

### Week 1: Infrastructure & Silent Pilot

**Monday (Day 1):**

- [ ] Complete Google Cloud setup (service accounts, secrets)
- [ ] Run Supabase migration 013_agent_tracking.sql
- [ ] Verify all tables/views/functions created

**Tuesday-Wednesday (Day 2-3):**

- [ ] Build and deploy Lead Scout agent
- [ ] Configure Cloud Scheduler (daily 6 AM run)
- [ ] Test manual run, verify logs

**Thursday-Friday (Day 4-5):**

- [ ] Monitor first enrichment runs
- [ ] Review 20 enriched leads manually for quality
- [ ] Tune ICP scoring if needed (adjust YAML config)

**Success Metrics (Week 1):**

- ✅ 100 leads enriched
- ✅ 30+ "High Priority" leads (ICP 70+)
- ✅ 0 errors, 0 GDPR violations
- ✅ <€10 in API costs

---

### Week 2: Outreach Agent (Advisor Mode)

**Monday (Day 8):**

- [ ] Review Week 1 Lead Scout performance
- [ ] Deploy Outreach Agent (Advisor mode)
- [ ] Test approval workflow in Supabase

**Tuesday-Friday (Day 9-12):**

- [ ] Review and approve 10-15 emails per day
- [ ] Monitor open rates (target 40-50%)
- [ ] Tune subject lines based on A/B test results

**Success Metrics (Week 2):**

- ✅ 50 emails drafted by agent
- ✅ 40 emails approved and sent (80% approval rate)
- ✅ 40-50% open rate
- ✅ 5-10% reply rate

---

### Week 3: Optimization

**Monday-Friday (Day 15-19):**

- [ ] Analyze Week 2 results (which subject lines performed best?)
- [ ] Update Outreach Agent YAML with winning variants
- [ ] Increase approval rate target to 90%
- [ ] Test LinkedIn connection requests (20/day limit)

**Success Metrics (Week 3):**

- ✅ 75 emails sent
- ✅ 50% open rate (improved from Week 2)
- ✅ 10-15% reply rate
- ✅ 2-3 meetings booked

---

### Week 4: Scale & Review

**Monday-Thursday (Day 22-25):**

- [ ] Run full week at scale (200 emails drafted/week)
- [ ] Monitor costs (should be <€50/week total)
- [ ] Prepare for Phase 2 (Meeting & Discovery agents)

**Friday (Day 26):**

- [ ] End-of-Phase-1 review meeting
- [ ] Decide: Advance Outreach Agent to Autonomous mode? (requires 60 days in Advisor)
- [ ] Plan Phase 2 deployment (Weeks 5-12)

**Success Metrics (Week 4):**

- ✅ 100+ emails sent
- ✅ 5-8 meetings booked (total across Weeks 2-4)
- ✅ €150-200 total agent costs (well under budget)
- ✅ 0 spam complaints

---

## Troubleshooting

### Issue: Agent not enriching leads

**Symptoms:**

- Leads remain in 'New' state
- `enriched_at` column is NULL
- No entries in `agent_signals` table

**Debug Steps:**

```bash
# 1. Check Cloud Run logs
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=agent-lead-scout-001" \
  --limit 100 \
  --format json | jq '.[] | select(.severity=="ERROR")'

# 2. Test agent manually
LEAD_SCOUT_URL=$(gcloud run services describe agent-lead-scout-001 \
  --region=europe-north1 \
  --format='value(status.url)')

curl -X POST \
  -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  -H "Content-Type: application/json" \
  $LEAD_SCOUT_URL/run

# 3. Check Supabase for new leads
psql $DATABASE_URL -c "SELECT COUNT(*) FROM firehorse_leads WHERE enriched_at IS NULL;"

# 4. Verify API keys in Secret Manager
gcloud secrets versions access latest --secret=anthropic-api-key
```

**Common Fixes:**

- API key expired → Update secret in Secret Manager
- No new leads in DB → Insert test lead manually
- Rate limit exceeded → Reduce `max_leads_per_day` in YAML

---

### Issue: High API costs

**Symptoms:**

- Agent costs > €150/month budget
- Alert email received at 80% threshold

**Debug Steps:**

```sql
-- Check daily costs
SELECT
  agent_id,
  cost_date,
  SUM(model_cost_eur) as llm_cost,
  SUM(api_cost_eur) as api_cost,
  SUM(total_cost_eur) as total_cost
FROM agent_costs
WHERE cost_date >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY agent_id, cost_date
ORDER BY cost_date DESC;

-- Identify expensive LLM calls
SELECT
  agent_id,
  llm_provider,
  llm_model,
  input_tokens,
  output_tokens,
  model_cost_eur
FROM agent_costs
WHERE cost_date >= CURRENT_DATE - INTERVAL '7 days'
  AND model_cost_eur > 1.0  -- Calls costing >€1
ORDER BY model_cost_eur DESC;
```

**Common Fixes:**

- Reduce `max_tokens` in YAML (4000 → 2000)
- Lower temperature (0.7 → 0.3) for shorter responses
- Switch expensive models (Claude Sonnet → Claude Haiku for simple tasks)
- Increase caching (use same system prompt across calls)

---

### Issue: Emails going to spam

**Symptoms:**

- Open rate <10% (normal is 40-50%)
- Spam complaints in `firehorse_events`
- Domain reputation issues

**Debug Steps:**

```sql
-- Check spam complaints
SELECT
  l.company,
  l.email,
  e.subject_line,
  e.body,
  e.created_at
FROM firehorse_events e
JOIN firehorse_leads l ON e.lead_id = l.id
WHERE e.event_type = 'SpamComplaint'
ORDER BY e.created_at DESC;
```

**Common Fixes:**

- Remove spammy keywords ("act now", "limited time")
- Shorten email body (<75 words)
- Improve personalization (reference company-specific news)
- Verify domain SPF/DKIM records
- Reduce send volume (50 → 30 emails/day)
- Warm up email domain (start with 10/day, increase gradually)

---

### Issue: Approval workflow not working (Outreach Agent)

**Symptoms:**

- Emails stuck in `pending_approval` status
- No WhatsApp/webhook notifications received
- HIL Director can't find approval UI

**Debug Steps:**

```sql
-- Check pending approvals
SELECT * FROM v_pending_approvals;

-- Check for expired approvals
SELECT COUNT(*) FROM agent_approvals
WHERE status = 'expired'
  AND expires_at > CURRENT_DATE - INTERVAL '7 days';
```

**Common Fixes:**

- Run `SELECT expire_pending_approvals();` to clean up old approvals
- Verify `notify-webhook` and `whatsapp-alerting` in Secret Manager
- Build custom approval UI (Supabase dashboard + email link)

---

## Next Steps

**After Phase 1 (Week 4) completion:**

1. **Advance to Phase 2** (Weeks 5-12)
   - Deploy Meeting Agent
   - Deploy Discovery Agent
   - Continue Outreach in Advisor mode

2. **Scale Outreach Agent**
   - After 60 days in Advisor mode (Week 10), advance to Autonomous
   - Increase email volume (50 → 100/day)

3. **Add More Agent Types**
   - Proposal Agent (Week 13)
   - Customer Success Agent (Week 14)
   - Investor Outreach Agent (Week 15)

4. **Optimize & Iterate**
   - Weekly A/B tests (subject lines, send times)
   - Monthly ICP recalibration
   - Quarterly cost/performance review

---

## Support & Resources

**Documentation:**

- Sales AI Agent Design: `/home/user/dws6/sales-outreach/SALES_AI_AGENT_DESIGN_FI_v1.md`
- Agent Foundry Product Doc: `/home/user/dws6/Store/PRODUCT_AGENT_FOUNDRY.md`
- DWS Document Standard: `/home/user/dws6/DWS_DOCUMENT_STANDARD.md`

**Tools:**

- Google Cloud Console: https://console.cloud.google.com
- Supabase Dashboard: https://supabase.com/dashboard
- Agent Logs: `gcloud logging read ...`
- Agent Metrics: `SELECT * FROM agent_metrics`

**Contacts:**

- Engineering Lead: [engineering@lifetime.fi]
- Sales HIL Director: [sales@lifetime.fi]
- Support: [support@dws6.com]

---

**Last Updated:** 2026-01-19
**Version:** 1.0
**© 2026 Lifetime Oy. All rights reserved.**

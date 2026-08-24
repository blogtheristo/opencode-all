# Google Cloud Run Setup - Quick Start Guide

## What Needs to Be Done on Google Cloud Run

---

**Version:** 1.0
**Created:** 2026-01-19
**Time Required:** 2-3 hours (first time)
**Owner:** Engineering + Sales HIL Director

---

## Overview

Google Cloud Run will host:

1. **Lead Scout Agent** (runs daily at 6 AM)
2. **Outreach Agent** (runs daily at 9 AM, Mon-Fri only)
3. **Director Dashboard** (always available, mobile-friendly)

**Why Cloud Run?**

- ✅ **Serverless** - Scales to zero when not in use (saves €)
- ✅ **EU region** - europe-north1 (Finland) for GDPR compliance
- ✅ **Cost-effective** - Pay only for actual execution time
- ✅ **Easy deployment** - Docker containers, managed infrastructure

---

## What You Need Before Starting

### 1. Google Cloud Account

```bash
# Create free account (€300 credit for 90 days)
# Visit: https://cloud.google.com/free

# Or use existing DWS project if available
```

### 2. API Keys (collect these first)

| Service                         | Key Name                   | Where to Get                            | Cost                       |
| ------------------------------- | -------------------------- | --------------------------------------- | -------------------------- |
| **Anthropic**                   | ANTHROPIC_API_KEY          | https://console.anthropic.com           | $3/1M input tokens         |
| **Groq**                        | GROQ_API_KEY               | https://console.groq.com                | $0.59/1M tokens (cheaper!) |
| **Apollo.io**                   | APOLLO_API_KEY             | https://apollo.io/settings/integrations | $290/year                  |
| **Clearbit is part of Hubspot** | CLEARBIT_API_KEY           | https://clearbit.com/pricing            | $99/month                  |
| **Resend**                      | RESEND_API_KEY             | https://resend.com/api-keys             | $10/month                  |
| **Supabase**                    | SUPABASE_URL, SUPABASE_KEY | https://supabase.com/dashboard          | Included in DWS project    |

### 3. Install Google Cloud SDK

```bash
# macOS
brew install --cask google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash

# Windows
# Download installer from: https://cloud.google.com/sdk/docs/install
```

---

## Step-by-Step Setup (Copy-Paste Ready)

### Step 1: Initial Project Setup (5 minutes)

```bash
# Set your project ID (replace with your actual project)
export PROJECT_ID="dws-iq6-production"
export REGION="europe-north1"

# Login to Google Cloud
gcloud auth login

# Set active project
gcloud config set project $PROJECT_ID

# Enable required APIs (takes 2-3 minutes)
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  cloudscheduler.googleapis.com \
  secretmanager.googleapis.com \
  logging.googleapis.com \
  monitoring.googleapis.com \
  cloudtrace.googleapis.com \
  telemetry.googleapis.com

# Wait for APIs to be enabled...
echo "✅ APIs enabled successfully"
# Note: telemetry.googleapis.com (unified OTLP ingestion endpoint) is auto-activated
# by GCP when logging/monitoring APIs are enabled (March 2026+), but listing it
# explicitly ensures activation for projects created via API rather than console/CLI.
```

---

### Step 2: Create Service Account (3 minutes)

```bash
# Create service account for agents
gcloud iam service-accounts create sales-agents \
  --display-name="DWS Sales AI Agents" \
  --description="Service account for running sales automation agents"

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:sales-agents@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:sales-agents@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:sales-agents@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.invoker"

echo "✅ Service account created: sales-agents@${PROJECT_ID}.iam.gserviceaccount.com"
```

---

### Step 3: Store API Keys in Secret Manager (10 minutes)

```bash
# Anthropic API Key
echo -n "sk-ant-YOUR-KEY-HERE" | gcloud secrets create anthropic-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Groq API Key
echo -n "YOUR-GROQ-KEY" | gcloud secrets create groq-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Supabase URL
echo -n "https://YOUR-PROJECT.supabase.co" | gcloud secrets create supabase-url \
  --data-file=- \
  --replication-policy="automatic"

# Supabase Service Key
echo -n "YOUR-SUPABASE-SERVICE-ROLE-KEY" | gcloud secrets create supabase-service-key \
  --data-file=- \
  --replication-policy="automatic"

# Apollo.io API Key
echo -n "YOUR-APOLLO-KEY" | gcloud secrets create apollo-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Clearbit API Key
echo -n "YOUR-CLEARBIT-KEY" | gcloud secrets create clearbit-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Resend API Key (for email)
echo -n "YOUR-RESEND-KEY" | gcloud secrets create resend-api-key \
  --data-file=- \
  --replication-policy="automatic"

# Generic notification webhook (Teams, ntfy/Gotify, or other approved broker)
echo -n "https://notify.example.internal/dws-alerts" | gcloud secrets create notify-webhook \
  --data-file=- \
  --replication-policy="automatic"

# WhatsApp alerting bundle: WHATSAPP_* env vars in dotenv format
printf "WHATSAPP_PHONE_NUMBER_ID=YOUR-PHONE-NUMBER-ID\nWHATSAPP_ACCESS_TOKEN=YOUR-TOKEN\nWHATSAPP_DEFAULT_RECIPIENT=+358401234567\n" | gcloud secrets create whatsapp-alerting \
  --data-file=- \
  --replication-policy="automatic"

# LinkedIn credentials (for Outreach Agent)
echo -n "your-linkedin@email.com" | gcloud secrets create linkedin-email \
  --data-file=- \
  --replication-policy="automatic"

echo -n "your-linkedin-password" | gcloud secrets create linkedin-password \
  --data-file=- \
  --replication-policy="automatic"

# Grant service account access to secrets
for secret in anthropic-api-key groq-api-key supabase-url supabase-service-key apollo-api-key clearbit-api-key resend-api-key notify-webhook whatsapp-alerting linkedin-email linkedin-password; do
  gcloud secrets add-iam-policy-binding $secret \
    --member="serviceAccount:sales-agents@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
done

echo "✅ All secrets stored and accessible to service account"
```

---

### Step 4: Create Artifact Registry for Docker Images (2 minutes)

```bash
# Create Docker repository
gcloud artifacts repositories create dws-agents \
  --repository-format=docker \
  --location=$REGION \
  --description="DWS Sales AI Agent container images"

# Configure Docker to authenticate with Artifact Registry
gcloud auth configure-docker ${REGION}-docker.pkg.dev

echo "✅ Artifact Registry created: ${REGION}-docker.pkg.dev/${PROJECT_ID}/dws-agents"
```

---

### Step 5: Build & Deploy Agents (15-20 minutes)

```bash
# Navigate to project root
cd /home/user/dws6

# Submit build to Cloud Build
# This will:
# 1. Build Docker image
# 2. Push to Artifact Registry
# 3. Deploy Lead Scout Agent
# 4. Deploy Outreach Agent
# 5. Create Cloud Scheduler jobs

gcloud builds submit \
  --config=AgentFoundry/cloudbuild.yaml \
  --substitutions=_ENVIRONMENT=production,_REGION=europe-north1 \
  .

# Monitor build progress
# Builds typically take 10-15 minutes
# View logs at: https://console.cloud.google.com/cloud-build/builds

# Wait for build to complete...
# Expected output: "BUILD SUCCESS"

echo "✅ Agents deployed to Cloud Run"
```

---

### Step 6: Get Service URLs & Configure Scheduler (5 minutes)

```bash
# Get Lead Scout Agent URL
export LEAD_SCOUT_URL=$(gcloud run services describe agent-lead-scout-001 \
  --region=$REGION \
  --format='value(status.url)')

echo "Lead Scout Agent URL: $LEAD_SCOUT_URL"

# Get Outreach Agent URL
export OUTREACH_URL=$(gcloud run services describe agent-outreach-001 \
  --region=$REGION \
  --format='value(status.url)')

echo "Outreach Agent URL: $OUTREACH_URL"

# Update Cloud Scheduler with actual URLs
gcloud scheduler jobs update http lead-scout-daily-run \
  --location=$REGION \
  --uri="${LEAD_SCOUT_URL}/run" \
  --oidc-token-audience="${LEAD_SCOUT_URL}"

gcloud scheduler jobs update http outreach-daily-run \
  --location=$REGION \
  --uri="${OUTREACH_URL}/run" \
  --oidc-token-audience="${OUTREACH_URL}"

# List all scheduled jobs
gcloud scheduler jobs list --location=$REGION

echo "✅ Scheduler configured - agents will run automatically"
```

---

### Step 7: Test Deployment (5 minutes)

```bash
# Test Lead Scout Agent health endpoint
curl -H "Authorization: Bearer $(gcloud auth print-identity-token)" \
  $LEAD_SCOUT_URL/health

# Expected response:
# {"status":"healthy","timestamp":"2026-01-19T12:34:56Z"}

# Trigger manual run (don't wait for 6 AM schedule)
gcloud scheduler jobs run lead-scout-daily-run --location=$REGION

# Wait 30 seconds, then check logs
sleep 30

gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=agent-lead-scout-001" \
  --limit 20 \
  --format json | jq '.[] | select(.severity=="INFO") | .textPayload'

# Check Supabase for enriched leads
# Visit: https://supabase.com/dashboard/project/YOUR-PROJECT/editor
# Run: SELECT * FROM firehorse_leads WHERE enriched_at::date = CURRENT_DATE;

echo "✅ Manual test completed - check Supabase for results"
```

---

### Step 8: Deploy Director Dashboard (10 minutes)

```bash
# Deploy Director Dashboard (separate Cloud Run service)
gcloud run deploy agent-director-dashboard \
  --image=europe-north1-docker.pkg.dev/${PROJECT_ID}/dws-agents/sales-agent:latest \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated=false \
  --service-account=sales-agents@${PROJECT_ID}.iam.gserviceaccount.com \
  --set-env-vars=APP_MODE=director_dashboard \
  --set-secrets=SUPABASE_URL=supabase-url:latest \
  --set-secrets=SUPABASE_KEY=supabase-service-key:latest \
  --cpu=1 \
  --memory=512Mi \
  --min-instances=1 \
  --max-instances=3 \
  --port=8080

# Get Dashboard URL
export DASHBOARD_URL=$(gcloud run services describe agent-director-dashboard \
  --region=$REGION \
  --format='value(status.url)')

echo "🎉 Director Dashboard URL: $DASHBOARD_URL"
echo "Share this URL with Sales HIL Director (login required)"
```

---

## What Happens After Setup?

### Automatic Daily Execution

**Lead Scout Agent:**

- ⏰ Runs every day at **6:00 AM CET**
- 🔍 Enriches up to 100 new leads
- 📊 Calculates ICP scores
- 🚨 Sends WhatsApp/webhook notification with summary

**Outreach Agent:**

- ⏰ Runs Monday-Friday at **9:00 AM CET**
- 📧 Drafts personalized email sequences
- ⏸️ Waits for HIL Director approval (Advisor mode)
- ✉️ Sends approved emails at optimal time

**Director Dashboard:**

- 📱 Always available (mobile-friendly)
- 🔐 Requires authentication
- 📊 Real-time metrics & approvals
- ⚡ Control panel for agents

---

## Cost Breakdown (Monthly)

| Service                          | Usage                           | Cost (EUR)         |
| -------------------------------- | ------------------------------- | ------------------ |
| **Cloud Run (Agents)**           | ~30 requests/day, scale to zero | €5-10              |
| **Cloud Run (Dashboard)**        | Min 1 instance, low traffic     | €15-20             |
| **Cloud Build**                  | ~4 builds/month (deployments)   | €2-5               |
| **Cloud Scheduler**              | 2 jobs, daily execution         | €0.30              |
| **Secret Manager**               | 10 secrets, 60 accesses/day     | €0.50              |
| **Artifact Registry**            | 2 Docker images (~500MB each)   | €1-2               |
| **LLM APIs (Anthropic + Groq)**  | 100 leads/day enrichment        | €50-80             |
| **Data APIs (Apollo, Clearbit)** | Subscriptions                   | €178               |
| **Email (Resend)**               | 200 emails/week                 | €10                |
| **TOTAL**                        |                                 | **€260-306/month** |

**Compare to:** 3 human SDRs = €25,000-35,000/month (96% cost savings!)

---

## Monitoring URLs (Bookmark These)

| Resource                | URL                                                                          | Purpose              |
| ----------------------- | ---------------------------------------------------------------------------- | -------------------- |
| **Cloud Run Services**  | https://console.cloud.google.com/run?project=$PROJECT_ID                     | View all agents      |
| **Cloud Build History** | https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID      | Deployment logs      |
| **Cloud Scheduler**     | https://console.cloud.google.com/cloudscheduler?project=$PROJECT_ID          | Scheduled jobs       |
| **Logs Explorer**       | https://console.cloud.google.com/logs/query?project=$PROJECT_ID              | Debug errors         |
| **Secret Manager**      | https://console.cloud.google.com/security/secret-manager?project=$PROJECT_ID | API keys             |
| **Director Dashboard**  | $DASHBOARD_URL                                                               | Mobile agent control |

---

## Common Tasks After Setup

### View Recent Logs

```bash
# Lead Scout Agent (last 100 entries)
gcloud logging read \
  "resource.type=cloud_run_revision AND resource.labels.service_name=agent-lead-scout-001" \
  --limit 100 \
  --format json | jq '.[] | {timestamp: .timestamp, severity: .severity, message: .textPayload}'
```

### Trigger Manual Agent Run

```bash
# Run Lead Scout outside of schedule
gcloud scheduler jobs run lead-scout-daily-run --location=$REGION

# Run Outreach Agent
gcloud scheduler jobs run outreach-daily-run --location=$REGION
```

### Update Agent Configuration

```bash
# Edit YAML config locally
vim AgentFoundry/configs/production/lead-scout-001.yaml

# Redeploy
gcloud builds submit --config=AgentFoundry/cloudbuild.yaml .
```

### Pause Agent Temporarily

```bash
# Pause scheduler (agent won't run automatically)
gcloud scheduler jobs pause lead-scout-daily-run --location=$REGION

# Resume later
gcloud scheduler jobs resume lead-scout-daily-run --location=$REGION
```

### Update Secret (e.g., API key expired)

```bash
# Update Anthropic API key
echo -n "sk-ant-NEW-KEY" | gcloud secrets versions add anthropic-api-key --data-file=-

# No redeploy needed - agents will use new key on next run
```

---

## Troubleshooting

### Issue: "Permission denied" errors

**Fix:**

```bash
# Ensure service account has correct permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:sales-agents@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### Issue: Build fails

**Fix:**

```bash
# Check Cloud Build logs
gcloud builds list --limit=5

# Get specific build ID
gcloud builds log BUILD_ID
```

### Issue: Agent not executing

**Fix:**

```bash
# Check scheduler status
gcloud scheduler jobs describe lead-scout-daily-run --location=$REGION

# Check last run result
gcloud scheduler jobs describe lead-scout-daily-run \
  --location=$REGION \
  --format=json | jq '.status'
```

---

## Next Steps

After completing this setup:

1. ✅ **Test manually** - Run Lead Scout agent, verify Supabase gets enriched leads
2. ✅ **Monitor first week** - Check logs daily, tune ICP scoring
3. ✅ **Deploy Outreach** - Week 2, start Advisor mode email sequences
4. ✅ **Review costs** - Weekly cost reports, optimize if needed
5. ✅ **Scale gradually** - Add more agents (Discovery, Meeting, Proposal)

---

**Setup Complete! 🎉**

You now have:

- ✅ 2 AI sales agents running automatically
- ✅ Mobile director dashboard for monitoring
- ✅ Secure secret management
- ✅ Cost-effective serverless infrastructure
- ✅ Full observability (logs, metrics, alerts)

**Total setup time:** 2-3 hours (first time), 30 minutes (subsequent deployments)

---

**Document Version:** 1.0
**Last Updated:** 2026-01-19
**Owner:** Lifetime Oy - Engineering
**© 2026 Lifetime Oy. All rights reserved.**

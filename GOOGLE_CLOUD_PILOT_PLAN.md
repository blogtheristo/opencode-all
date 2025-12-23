# DWS6 Google Cloud Pilot Plan
## Focus: Google Cloud Only (AWS deferred to post-pilot)

**Timeline:** 30 days
**Cost:** €0-50/month
**Goal:** Deploy 2 AI agents analyzing 5 construction customers

---

## Architecture (Google Cloud Only)

```
┌─────────────────────────────────────────────────────┐
│            Google Cloud Platform                     │
│            (europe-north1 - Finland)                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Cloud Run Services                            │ │
│  ├────────────────────────────────────────────────┤ │
│  │                                                │ │
│  │  Service 1: groq-agent-router                 │ │
│  │  - Port: 8083                                  │ │
│  │  - 2 AI agents (Customer Sat + Viability)    │ │
│  │  - Groq API integration (€0 with credits)    │ │
│  │  - Domain: api.dws6.com                       │ │
│  │                                                │ │
│  │  Service 2: dws10-frontend (Future)           │ │
│  │  - Next.js sales & marketing site             │ │
│  │  - Domain: dws10.com                          │ │
│  │  - Status: Post-pilot                         │ │
│  │                                                │ │
│  │  Service 3: onelifetime-community (Future)    │ │
│  │  - Community platform                          │ │
│  │  - Domain: onelifetime.world                  │ │
│  │  - Status: Post-pilot                         │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Secret Manager                                │ │
│  │  - GROQ_API_KEY                               │ │
│  │  - SUPABASE_KEY                               │ │
│  │  - SLACK_WEBHOOK_URL                          │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Container Registry                            │ │
│  │  europe-north1-docker.pkg.dev/dws-iq-pilot/dws-containers/                      │ │
│  │  - groq-agent-router:v1.0.0                   │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  Cloud Scheduler (Future)                      │ │
│  │  - Weekly customer health reports             │ │
│  │  - Daily viability calculations               │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │   External Services     │
         ├────────────────────────┤
         │  Groq API ($10K free)  │
         │  Supabase (€0 free)    │
         │  Slack (€0 free)       │
         │  Google Sheets (€0)    │
         └────────────────────────┘
```

**DEFERRED TO LATER (AWS Components):**
- ❌ AWS IoT Core (edge device management)
- ❌ AWS S3 (cold storage)
- ❌ AWS Greengrass (NVIDIA Jetson Orin Nano Super Developer Kit)
- ❌ Edge computing layer

**Why defer AWS:**
- Not needed for MVP (5 customers, no edge devices yet)
- Reduces complexity
- Focus on proving AI agent value first
- Can add AWS layer post-funding

---

## 30-Day Pilot Timeline

### Week 1: Google Cloud Setup (Days 1-7)

**Day 1: Google Cloud Project Setup**
```bash
# Create project
gcloud projects create dws-iq-pilot --name="DWS IQ Pilot"
gcloud config set project dws-iq-pilot

# Enable billing (for startup credits)
gcloud beta billing projects link dws-iq-pilot \
  --billing-account=XXXXXX-XXXXXX-XXXXXX

# Enable required APIs
gcloud services enable \
  run.googleapis.com \
  secretmanager.googleapis.com \
  containerregistry.googleapis.com \
  cloudbuild.googleapis.com

# Verify
gcloud services list --enabled
```

**Day 2: Apply for Google for Startups**
```
1. Visit: https://cloud.google.com/startup
2. Application form:
   - Company: Lifetime Oy
   - Product: DWS IQ Platform
   - Stage: Pre-seed
   - Request: $100,000 credits
3. Wait time: 1-2 weeks
4. Fallback: Use $300 free trial for pilot
```

**Day 3: Secret Manager Setup**
```bash
# Create secrets
echo -n "gsk_..." | gcloud secrets create GROQ_API_KEY \
  --data-file=-

echo -n "https://hooks.slack.com/..." | \
  gcloud secrets create SLACK_WEBHOOK_URL \
  --data-file=-

echo -n "postgresql://..." | \
  gcloud secrets create SUPABASE_CONNECTION_STRING \
  --data-file=-

# Grant Cloud Run access
gcloud secrets add-iam-policy-binding GROQ_API_KEY \
  --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**Day 4: Domain Configuration (api.dws6.com)**
```bash
# Prerequisites:
# 1. You own dws6.com
# 2. Access to DNS provider (Cloudflare?)

# Step 1: Deploy a placeholder service first
gcloud run deploy api-placeholder \
  --image gcr.io/cloudrun/hello \
  --region europe-north1 \
  --allow-unauthenticated

# Step 2: Map custom domain
gcloud run domain-mappings create \
  --service api-placeholder \
  --domain api.dws6.com \
  --region europe-north1

# Step 3: Get DNS records to configure
gcloud run domain-mappings describe \
  --domain api.dws6.com \
  --region europe-north1

# Output will show:
# A record: api.dws6.com → 216.239.32.21
# AAAA record: api.dws6.com → 2001:4860:4802:32::15

# Step 4: Add these to your DNS provider (Cloudflare)
# SSL certificate: Automatic via Cloud Run (Let's Encrypt)
```

**Day 5-6: Supabase Database Setup**
```sql
-- Create Supabase project: dws-iq-pilot
-- Region: EU Central (Frankfurt) for GDPR
-- Tier: Free (500MB storage)

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- MVP Tables (simplified)
CREATE TABLE customer_health_mvp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id TEXT NOT NULL,
  customer_name TEXT,
  health_score INT,
  risk_level TEXT,
  primary_concern TEXT,
  recommended_action TEXT,
  nps_score INT,
  open_tickets INT,
  days_since_contact INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE viability_analysis_mvp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id TEXT NOT NULL,
  customer_name TEXT,
  payback_months DECIMAL(4,2),
  gross_margin_percent DECIMAL(5,2),
  verdict TEXT, -- 'Approve', 'Review', 'Reject'
  hardware_cost_eur DECIMAL(10,2),
  setup_hours INT,
  monthly_revenue_eur DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agent_usage_mvp (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT,
  customer_id TEXT,
  tokens_used INT,
  cost_eur DECIMAL(10,4),
  latency_ms INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_customer_health_customer ON customer_health_mvp(customer_id);
CREATE INDEX idx_customer_health_created ON customer_health_mvp(created_at DESC);
CREATE INDEX idx_viability_customer ON viability_analysis_mvp(customer_id);
CREATE INDEX idx_agent_usage_agent ON agent_usage_mvp(agent_id);
CREATE INDEX idx_agent_usage_created ON agent_usage_mvp(created_at DESC);

-- Sample data for testing
INSERT INTO customer_health_mvp (customer_id, customer_name, nps_score, open_tickets, days_since_contact)
VALUES
  ('cust_001', 'Demo Construction', 8, 2, 15),
  ('cust_002', 'Acme Builders', 6, 7, 47),
  ('cust_003', 'BuildCo Ltd', 7, 4, 28),
  ('cust_004', 'Nordic Builders', 9, 1, 8),
  ('cust_005', 'SitePro Construction', 8, 3, 12);
```

**Day 7: Free Integrations Setup**
```bash
# 1. Slack Workspace Setup
# - Create channel: #dws-pilot
# - Add Incoming Webhook
# - Save webhook URL to Secret Manager

# 2. Google Sheets Setup
# - Create spreadsheet: "DWS IQ Pilot Dashboard"
# - Sheet 1: "Customer Health"
# - Sheet 2: "Viability Analysis"
# - Share with your email

# 3. HubSpot Free CRM (Optional)
# - Create free account
# - Add 5 pilot customers
# - Note: Not integrating API in MVP (manual entry)
```

---

### Week 2: Agent Development & Local Testing (Days 8-14)

**Day 8-9: Build Agent Router Service**

Create `/home/user/dws6/AgentFoundry/services/groq-router-mvp/`:

```python
# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import httpx
import os
from datetime import datetime

app = FastAPI(title="DWS IQ Agent Router - MVP")

# Environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

class CustomerData(BaseModel):
    customer_id: str
    customer_name: str
    nps_score: int
    open_tickets: int
    days_since_contact: int
    usage_trend: str = "Stable"

class ViabilityData(BaseModel):
    customer_id: str
    customer_name: str
    setup_hours: int
    monthly_revenue_eur: float

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "groq-agent-router-mvp",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/v1/agents/customersat-construction-mvp/analyze")
async def analyze_customer_health(data: CustomerData):
    """Customer Satisfaction Agent - Analyzes customer health"""

    system_prompt = """You are a Customer Satisfaction Specialist for construction SMEs.

ANALYZE:
1. NPS score (target: >8)
2. Support ticket count (red flag: >5 open)
3. Last interaction date (red flag: >30 days)
4. Usage trend

OUTPUT (JSON only):
{
  "customer_id": "string",
  "health_score": 0-100,
  "risk_level": "Low" | "Medium" | "High",
  "primary_concern": "string",
  "recommended_action": "string"
}

Keep response under 200 tokens."""

    user_message = f"""Analyze customer health:
- Customer ID: {data.customer_id}
- Customer Name: {data.customer_name}
- NPS Score: {data.nps_score}
- Open Tickets: {data.open_tickets}
- Days Since Last Contact: {data.days_since_contact}
- Usage Trend: {data.usage_trend}"""

    # Call Groq API
    async with httpx.AsyncClient() as client:
        response = await client.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                "temperature": 0.3,
                "max_tokens": 500
            },
            timeout=30.0
        )

        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="Groq API error")

        result = response.json()
        agent_response = result["choices"][0]["message"]["content"]
        usage = result.get("usage", {})

        return {
            "agent_id": "customersat-construction-mvp",
            "customer_id": data.customer_id,
            "response": agent_response,
            "usage": usage,
            "cost_eur": 0.0  # Using free credits
        }

@app.post("/v1/agents/viability-construction-mvp/analyze")
async def analyze_viability(data: ViabilityData):
    """Viability Agent - Calculates payback period"""

    system_prompt = """You are a Financial Analyst calculating payback periods.

CALCULATE:
1. Payback Period = (Hardware + Setup) / Monthly Gross Profit
2. Gross Margin % = (Revenue - COGS) / Revenue

CONSTANTS:
- Hardware: €470 (2x Jetson Orin Nano Super @ $249 each)
- Setup hourly rate: €80
- Monthly COGS: €50 (cloud costs)

OUTPUT (JSON only):
{
  "customer_id": "string",
  "payback_months": number,
  "gross_margin_percent": number,
  "verdict": "Approve" | "Review" | "Reject",
  "calculation": "string (show formula)"
}

DECISION RULES:
- Approve: payback ≤ 2 months
- Review: payback 2-3 months
- Reject: payback > 3 months"""

    user_message = f"""Calculate viability:
- Customer ID: {data.customer_id}
- Customer Name: {data.customer_name}
- Setup Hours: {data.setup_hours}
- Monthly Revenue: €{data.monthly_revenue_eur}"""

    # Call Groq API
    async with httpx.AsyncClient() as client:
        response = await client.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.1-70b-versatile",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                "temperature": 0.1,
                "max_tokens": 400
            },
            timeout=30.0
        )

        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="Groq API error")

        result = response.json()
        agent_response = result["choices"][0]["message"]["content"]
        usage = result.get("usage", {})

        return {
            "agent_id": "viability-construction-mvp",
            "customer_id": data.customer_id,
            "response": agent_response,
            "usage": usage,
            "cost_eur": 0.0
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8083)
```

**requirements.txt:**
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
httpx==0.26.0
pydantic==2.5.3
python-dotenv==1.0.0
```

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .

EXPOSE 8083

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8083"]
```

**Day 10-11: Local Testing**
```bash
cd /home/user/dws6/AgentFoundry/services/groq-router-mvp

# Install dependencies
pip install -r requirements.txt

# Set environment variable
export GROQ_API_KEY="gsk_..."

# Run locally
python main.py

# Test in another terminal
curl http://localhost:8083/health

# Test Customer Satisfaction Agent
curl -X POST http://localhost:8083/v1/agents/customersat-construction-mvp/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_002",
    "customer_name": "Acme Builders",
    "nps_score": 6,
    "open_tickets": 7,
    "days_since_contact": 47,
    "usage_trend": "Declining"
  }'

# Test Viability Agent
curl -X POST http://localhost:8083/v1/agents/viability-construction-mvp/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_002",
    "customer_name": "Acme Builders",
    "setup_hours": 6,
    "monthly_revenue_eur": 650
  }'
```

**Day 12-14: GitHub Actions CI/CD Setup**

Create `.github/workflows/deploy-pilot.yml`:
```yaml
name: Deploy DWS6 Pilot to Cloud Run

on:
  push:
    branches: [claude/dws6-pilot-setup-01MsouoNp4hdrFQxeYU6EJFY, main]

env:
  PROJECT_ID: dws-iq-pilot
  SERVICE_NAME: groq-agent-router-mvp
  REGION: europe-north1

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v1

      - name: Configure Docker for GCR
        run: gcloud auth configure-docker

      - name: Build Docker image
        run: |
          cd AgentFoundry/services/groq-router-mvp
          docker build -t gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA .
          docker tag gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA \
                     gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

      - name: Push to Container Registry
        run: |
          docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:$GITHUB_SHA
          docker push gcr.io/$PROJECT_ID/$SERVICE_NAME:latest

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy $SERVICE_NAME \
            --image gcr.io/$PROJECT_ID/$SERVICE_NAME:latest \
            --region $REGION \
            --platform managed \
            --allow-unauthenticated \
            --memory 512Mi \
            --cpu 1 \
            --min-instances 0 \
            --max-instances 2 \
            --set-secrets GROQ_API_KEY=GROQ_API_KEY:latest

      - name: Verify deployment
        run: |
          SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
            --region $REGION \
            --format 'value(status.url)')
          curl -f $SERVICE_URL/health || exit 1
```

---

### Week 3: Production Deployment (Days 15-21)

**Day 15: Build & Push Docker Image**
```bash
cd /home/user/dws6/AgentFoundry/services/groq-router-mvp

# Build
docker build -t groq-agent-router-mvp:v1.0.0 .

# Tag for GCR
docker tag groq-agent-router-mvp:v1.0.0 \
  europe-north1-docker.pkg.dev/dws-iq-pilot/dws-containers/groq-agent-router-mvp:v1.0.0

# Authenticate
gcloud auth configure-docker

# Push
docker push europe-north1-docker.pkg.dev/dws-iq-pilot/dws-containers/groq-agent-router-mvp:v1.0.0
```

**Day 16: Deploy to Cloud Run**
```bash
gcloud run deploy groq-agent-router-mvp \
  --image europe-north1-docker.pkg.dev/dws-iq-pilot/dws-containers/groq-agent-router-mvp:v1.0.0 \
  --region europe-north1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 2 \
  --set-secrets GROQ_API_KEY=GROQ_API_KEY:latest \
  --set-env-vars MVP_MODE=true

# Get service URL
export SERVICE_URL=$(gcloud run services describe groq-agent-router-mvp \
  --region europe-north1 \
  --format 'value(status.url)')

echo "Service deployed at: $SERVICE_URL"

# Test
curl $SERVICE_URL/health
```

**Day 17: Map Custom Domain (api.dws6.com)**
```bash
# Map domain
gcloud run domain-mappings create \
  --service groq-agent-router-mvp \
  --domain api.dws6.com \
  --region europe-north1

# Get DNS records
gcloud run domain-mappings describe \
  --domain api.dws6.com \
  --region europe-north1

# Add to Cloudflare:
# Type: A
# Name: api.dws6.com
# Value: 216.239.32.21 (from output above)
# Proxy: No (DNS only)

# Wait 5-10 minutes for DNS propagation

# Test
curl https://api.dws6.com/health
```

**Day 18-19: Integration Testing**
```bash
# Test all 5 customers
for i in {1..5}; do
  curl -X POST https://api.dws6.com/v1/agents/customersat-construction-mvp/analyze \
    -H "Content-Type: application/json" \
    -d @test_data/customer_00$i.json
done

# Test Viability Agent
for i in {1..5}; do
  curl -X POST https://api.dws6.com/v1/agents/viability-construction-mvp/analyze \
    -H "Content-Type: application/json" \
    -d @test_data/viability_00$i.json
done

# Check cost tracking
curl https://api.dws6.com/v1/metrics
```

**Day 20-21: Monitoring Setup**
```bash
# Cloud Logging query
gcloud logging read "resource.type=cloud_run_revision \
  AND resource.labels.service_name=groq-agent-router-mvp" \
  --limit 50 \
  --format json

# Set up log-based metrics
gcloud logging metrics create agent_invocations \
  --description="Number of agent invocations" \
  --log-filter='resource.type="cloud_run_revision"
    AND jsonPayload.message=~"Agent invoked"'

# Set up uptime check
gcloud monitoring uptime create https://api.dws10.com/health \
  --display-name="DWS IQ Pilot Uptime" \
  --check-interval=60s
```

---

### Week 4: Pilot Operation & Data Collection (Days 22-30)

**Day 22: Create Analysis Script**

`analyze_all_customers.sh`:
```bash
#!/bin/bash

API_URL="https://api.dws6.com"

echo "🤖 Running DWS IQ Pilot Analysis..."
echo "Date: $(date)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Customer 1: Demo Construction (Healthy)
echo "Analyzing cust_001: Demo Construction..."
curl -X POST $API_URL/v1/agents/customersat-construction-mvp/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_001",
    "customer_name": "Demo Construction",
    "nps_score": 8,
    "open_tickets": 2,
    "days_since_contact": 15,
    "usage_trend": "Stable"
  }' | jq .

# Customer 2: Acme Builders (At Risk!)
echo "Analyzing cust_002: Acme Builders..."
curl -X POST $API_URL/v1/agents/customersat-construction-mvp/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust_002",
    "customer_name": "Acme Builders",
    "nps_score": 6,
    "open_tickets": 7,
    "days_since_contact": 47,
    "usage_trend": "Declining"
  }' | jq .

# ... (repeat for all 5 customers)

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Analysis complete!"
```

**Day 23-29: Daily Monitoring**
```bash
# Run daily analysis
./analyze_all_customers.sh

# Check costs
curl https://api.dws10.com/v1/metrics

# Update Google Sheets (manual for MVP)
# - Copy agent responses to spreadsheet
# - Track trends over 7 days
```

**Day 30: Pilot Results Summary**

Create Google Sheets dashboard showing:
- Customer health scores (trend chart)
- Risk distribution (pie chart: 60% healthy, 20% medium, 20% high)
- Viability analysis (all 5 customers, average payback: 1.9 months)
- Cost tracking (total €0 using Groq credits)
- Agent accuracy (compare predictions to actual outcomes)

---

## Cost Summary (30 Days)

| Service | Usage | Cost |
|---------|-------|------|
| **Groq API** | 500K tokens | €0 (using $10K credits) |
| **Google Cloud Run** | 10K requests | €0 (free tier: 2M/month) |
| **Secret Manager** | 3 secrets | €0 (free tier: 6 secrets) |
| **Container Registry** | 1 image | €0 (free tier: 0.5GB) |
| **Supabase** | 5MB data | €0 (free tier: 500MB) |
| **Slack** | 120 messages | €0 (free tier: 10K) |
| **Google Sheets** | <1MB | €0 (free tier: 15GB) |
| **Domain** | dws6.com | €0 (already owned) |
| **TOTAL** | | **€0** |

---

## Success Metrics

**Technical:**
- ✅ 2 agents deployed and responding
- ✅ <2s response time (Groq is fast: ~1s)
- ✅ 99.9% uptime (Cloud Run SLA)
- ✅ €0 cost (validates free tier strategy)

**Business:**
- ✅ Correctly identify 1 at-risk customer
- ✅ Payback calculations within 10% accuracy
- ✅ Prevent at least 1 churn (€24K saved)
- ✅ Average payback <2 months (target met)

**Investor Ready:**
- ✅ Live demo works flawlessly
- ✅ Unit economics proven
- ✅ Scalability demonstrated
- ✅ Cost efficiency validated

---

## Next Steps (Post-Pilot)

### Month 2: Investor Pitch
- Present 30-day pilot results
- Show Google Sheets dashboard (live data)
- Demonstrate API calls (live demo)
- Request €150K SAFE

### Month 3-6: Scale to 50 Customers (Post-Seed)
- Deploy all 32 agents (8 industries × 4 types)
- Add Phase 2 (approval workflows)
- Integrate HubSpot API
- Cost: ~€150/month

### Month 7-12: Add AWS Edge Layer
- NVIDIA Jetson Orin Nano Super Developer Kit deployment
- AWS IoT Core integration
- Edge-to-cloud sync
- Cost: ~€345/month (full system)

---

## Deferred AWS Components (Post-Pilot)

**What we're NOT doing in pilot:**

1. ❌ **AWS IoT Core** - No edge devices yet
2. ❌ **AWS S3** - Use Supabase for hot data only
3. ❌ **AWS Greengrass** - No NVIDIA Jetson Orin Nano Super Developer Kit deployment
4. ❌ **Edge inference** - Cloud-only for MVP
5. ❌ **Multi-region** - Single region (europe-north1) only

**Why this is OK:**
- MVP validates AI agent value, not edge computing
- 5 customers don't need edge devices
- Can add AWS layer in Month 7+ (post-funding)
- Reduces complexity and cost for pilot
- Focus on proving unit economics first

---

## Questions Before We Start?

1. **Do you have access to dws6.com DNS?** (Needed for api.dws6.com mapping)
2. **Do you have Groq API key?** ($10K credits confirmed?)
3. **Do you have Google Cloud account?** (Can apply for $100K startup credits)
4. **Do you have 5 real/mock customers for pilot?** (Or should I create synthetic data?)
5. **Timeline:** Can you start this week? (30-day pilot starts Day 1)

---

## Ready to Build?

If approved, I'll:
1. Create the FastAPI service code
2. Set up Dockerfile and requirements
3. Configure GitHub Actions workflow
4. Deploy to Cloud Run
5. Map to api.dws10.com
6. Run first analysis on 5 customers

**Estimated time to first deployment: 2-3 days**

---

**Document Version:** 1.0
**Created:** December 3, 2025
**Author:** Claude Code
**Status:** READY FOR APPROVAL

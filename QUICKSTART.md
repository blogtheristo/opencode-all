# DWS6 Pilot - Quick Start Guide
## From Zero to Deployed in 2-3 Days

**Goal:** Deploy 2 AI agents analyzing 5 Nordic construction companies for €0 cost

---

## ⚡ Super Quick Start (30 minutes)

### Step 1: Clone and Navigate
```bash
cd /home/user/dws6
```

### Step 2: Test Locally
```bash
# Install dependencies
cd AgentFoundry/services/groq-router-mvp
pip install -r requirements.txt

# Set your Groq API key
export GROQ_API_KEY="gsk_your_key_here"

# Run service
python main.py
```

### Step 3: Test Agents
```bash
# In another terminal
curl http://localhost:8083/health

# Test with Nordic company
curl -X POST http://localhost:8083/v1/agents/customersat-construction-mvp/analyze \
  -H "Content-Type: application/json" \
  -d @test_data/customer_003_health.json | jq '.'
```

**✅ If this works, you're ready to deploy to Google Cloud!**

---

## 🚀 Full Deployment (2-3 hours)

### Day 1: Setup Google Cloud

#### 1.1 Get Groq API Key
```bash
# Visit: https://console.groq.com/keys
# Click "Create API Key"
# Save it: export GROQ_API_KEY="gsk_..."
```

#### 1.2 Setup Google Cloud Project
```bash
cd /home/user/dws6
./scripts/setup_gcp.sh

# Follow prompts:
# - Enter Groq API key when asked
# - Confirm project creation
```

**Expected time:** 15 minutes

---

### Day 2: Deploy Service

#### 2.1 Deploy to Cloud Run
```bash
# Deploy with one command
./scripts/deploy.sh

# Expected output:
# Service URL: https://groq-agent-router-mvp-xxxxx.run.app
```

#### 2.2 Test Production Deployment
```bash
# Save service URL
export SERVICE_URL="https://groq-agent-router-mvp-xxxxx.run.app"

# Test health
curl $SERVICE_URL/health

# Test with all 5 Nordic companies
./scripts/test_agents.sh
```

**Expected time:** 30 minutes

---

### Day 3: Setup Custom Domain (Optional)

#### 3.1 Map api.dws6.com
```bash
gcloud run domain-mappings create \
  --service groq-agent-router-mvp \
  --domain api.dws6.com \
  --region europe-north1

# Get DNS records
gcloud run domain-mappings describe \
  --domain api.dws6.com \
  --region europe-north1
```

#### 3.2 Update DNS (Cloudflare)
```
Type: A
Name: api.dws6.com
Value: 216.239.32.21 (from above command)
Proxy: No (DNS only)
```

#### 3.3 Wait and Test
```bash
# Wait 5-10 minutes for DNS propagation
curl https://api.dws6.com/health
```

**Expected time:** 20 minutes (+ DNS propagation)

---

## 📊 Setup Supabase Database (Optional)

### 4.1 Create Supabase Project
```bash
# Visit: https://supabase.com/dashboard
# Click "New Project"
# Name: dws-iq-pilot
# Region: EU Central (Frankfurt)
# Password: (save this!)
```

### 4.2 Run SQL Schema
```bash
# Copy SQL from: AgentFoundry/database/supabase_schema.sql
# Paste into Supabase SQL Editor
# Click "Run"
```

### 4.3 Insert Sample Data
```bash
# Copy SQL from: AgentFoundry/database/sample_data.sql  
# Paste into Supabase SQL Editor
# Click "Run"

# Verify data
SELECT * FROM customer_health_summary;
```

**Expected time:** 15 minutes

---

## 🎯 Test Everything

### Test Script
```bash
cd /home/user/dws6

# Set API URL (production or local)
export API_URL="https://api.dws6.com"
# OR
export API_URL="http://localhost:8083"

# Run full test suite
./scripts/test_agents.sh
```

### Expected Output
```
Testing Customer 1: Veidekke (Norway)
📊 Customer Health Analysis:
  health_score: 92
  risk_level: Low
  verdict: Healthy promoter

💰 Viability Analysis:
  payback_months: 1.4
  verdict: Approve ✅

Testing Customer 3: YIT (Finland) - HIGH RISK
📊 Customer Health Analysis:
  health_score: 38
  risk_level: High
  primary_concern: CRITICAL - Detractor, 8 tickets, 52 days no contact
  
💰 Viability Analysis:
  payback_months: 2.4
  verdict: Review ⚠️

✓ All tests completed!
```

---

## 📈 Investor Demo Prep

### 1. Prepare Google Sheets Dashboard
```
Sheet 1: Customer Health
| Customer | Country | Health | Risk | NPS | Last Contact |
|----------|---------|--------|------|-----|--------------|
| Veidekke | NO | 92 | Low | 9 | 8 days |
| YIT | FI | 38 | High | 5 | 52 days |
| ... | ... | ... | ... | ... | ... |

Sheet 2: Viability Analysis
| Customer | Revenue | Payback | Verdict |
|----------|---------|---------|---------|
| Veidekke | €850 | 1.4 mo | Approve |
| YIT | €650 | 2.4 mo | Review |
| ... | ... | ... | ... |
```

### 2. Demo Script
```
1. Open: https://api.dws6.com/docs
2. Show: Live API documentation
3. Run: Customer health analysis (show YIT at-risk alert)
4. Run: Viability analysis (show 1.9 month avg payback)
5. Show: Google Sheets dashboard with trends
6. Reveal: Total cost = €0 (vs €1,400/mo for Rovo)
```

---

## ✅ Success Checklist

- [ ] Service deployed to Google Cloud Run
- [ ] api.dws6.com domain mapped and SSL working
- [ ] All 5 Nordic companies tested successfully
- [ ] Supabase database populated with sample data
- [ ] Google Sheets dashboard created
- [ ] Investor demo script prepared
- [ ] Cost confirmed at €0 for 30-day pilot

---

## 🎬 What You Built

**Architecture:**
```
api.dws6.com (Google Cloud Run)
├── Customer Satisfaction Agent
│   └── Analyzes health, identifies churn risk
├── Viability Agent
│   └── Calculates payback, unit economics
└── 5 Nordic construction companies
    ├── 🟢 Healthy: Veidekke, NCC, Peab
    ├── 🟡 Medium: Skanska
    └── 🔴 High Risk: YIT (prevented €7,800 churn!)
```

**Cost:** €0 for 30 days
**Time:** 2-3 days to deploy
**Result:** Investor-ready demo

---

## 🚨 Troubleshooting

### "Permission denied" error
```bash
chmod +x scripts/*.sh
./scripts/setup_gcp.sh
```

### "GROQ_API_KEY not found"
```bash
export GROQ_API_KEY="your_key_here"
python main.py
```

### "gcloud command not found"
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### "Docker build fails"
```bash
# Check Docker is running
docker version

# If not installed: https://docs.docker.com/get-docker/
```

---

## 📚 Next Steps

1. ✅ **Complete this quick start**
2. ⏳ **Run 30-day pilot** with real data
3. ⏳ **Present to investors** with live demo
4. ⏳ **Secure €150K funding** from SAFE
5. ⏳ **Scale to 50 customers** (Month 4-6)
6. ⏳ **Add AWS edge layer** (Month 7+)

---

## 📞 Need Help?

- **Documentation:** See `/home/user/dws6/GOOGLE_CLOUD_PILOT_PLAN.md`
- **GitHub Issues:** https://github.com/blogtheristo/dws6/issues
- **API Docs:** https://api.dws6.com/docs (after deployment)

---

**You're ready to build! 🚀**

**Estimated total time:** 2-3 days from zero to deployed
**Total cost:** €0
**Investor demo:** Ready in 30 days

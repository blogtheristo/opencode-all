# MVP Roadmap - DWS IQ Agent System
## Proof of Concept Phase

**Timeline:** Month 1-3 (December 2025 - February 2026)
**Goal:** Prove technical feasibility and unit economics for investor due diligence
**Budget:** €0/month (100% free tier)

---

## Success Criteria

**Must Achieve:**
- ✅ 5 pilot customers onboarded and active
- ✅ Average payback period ≤2.0 months
- ✅ Zero churn during pilot
- ✅ AI agents make accurate predictions (>85% accuracy)
- ✅ Raise €150K seed funding

**Nice to Have:**
- ⚠️ 1 customer prevented from churning (demonstrates value)
- ⚠️ All customers approve based on viability criteria
- ⚠️ Weekly reports automated

---

## Scope

### Agents (2 Total)

**1. Customer Satisfaction Agent**
- **Vertical:** Construction only
- **Phase:** Phase 1 (Silent Pilot)
- **Features:**
  - Analyze customer health (NPS, tickets, engagement)
  - Calculate health score (0-100)
  - Identify churn risk (Low/Medium/High)
  - Weekly Slack reports
- **Model:** Groq Llama 3.1 70B
- **Cost:** €0 (startup credits)

**2. Viability Agent**
- **Vertical:** Construction only
- **Phase:** Phase 1 (Silent Pilot)
- **Features:**
  - Calculate payback period
  - Calculate gross margin
  - Approve/Review/Reject decisions
  - Track unit economics
- **Model:** Groq Llama 3.1 70B
- **Cost:** €0 (startup credits)

**❌ NOT in MVP:**
- Deal Flow Agent → Alpha
- Desirability Agent → Alpha
- Growth Tracker Agent → V1
- SiteSense Edge Agent → V1

### Infrastructure

**Services:**
- ✅ Groq Agent Router (port 8083)
- ✅ Google Cloud Run (free tier: 2M requests/month)
- ✅ Supabase (free tier: 500MB database)
- ✅ Slack (free tier: 10K messages)
- ✅ Google Sheets (manual data warehouse)

**Integrations:**
- ✅ Slack webhook (notifications)
- ✅ Google Sheets API (data export)
- ⚠️ HubSpot Free CRM (manual entry)
- ❌ Stripe (not needed yet - manual invoicing)

**Cost:** €0/month (all free tiers)

### Verticals

**Included:**
- ✅ Construction (5 pilot customers)

**NOT Included:**
- ❌ Manufacturing → Alpha
- ❌ Energy → Alpha
- ❌ Logistics → V1
- ❌ Real Estate → V1
- ❌ Architecture → V1
- ❌ Waste Management → V1
- ❌ Mining → V1

---

## Timeline

### Week 1: Setup & Deployment
**Dec 1-7, 2025**

**Tasks:**
- [x] Get Groq API key
- [ ] Deploy Groq Agent Router to Cloud Run
- [ ] Set up Supabase free tier
- [ ] Configure Slack webhook
- [ ] Create Google Sheets dashboard
- [ ] Test both agents locally

**Deliverable:** Working agent system deployed

### Week 2: Customer Onboarding
**Dec 8-14, 2025**

**Tasks:**
- [ ] Onboard 3 pilot customers
- [ ] Collect baseline data (NPS, tickets, revenue)
- [ ] Run first Customer Sat analysis
- [ ] Run first Viability calculation
- [ ] Set up weekly Slack reports

**Deliverable:** 3 customers actively monitored

### Week 3: Monitoring & Calibration
**Dec 15-21, 2025**

**Tasks:**
- [ ] Onboard 2 more customers (total 5)
- [ ] Review agent prediction accuracy
- [ ] Calibrate health score calculations
- [ ] Compare predicted vs. actual payback
- [ ] Document any at-risk customers

**Deliverable:** 5 customers, accuracy baseline established

### Week 4: Results Collection
**Dec 22-28, 2025**

**Tasks:**
- [ ] Generate 30-day results summary
- [ ] Calculate average metrics (payback, health scores)
- [ ] Identify at-risk customers
- [ ] Create investor presentation slides
- [ ] Prepare live demo

**Deliverable:** MVP results package

### Month 2-3: Investor Outreach
**January - February 2026**

**Tasks:**
- [ ] Present to 10+ angel investors
- [ ] Refine pitch based on feedback
- [ ] Continue monitoring 5 pilot customers
- [ ] Track churn (target: 0)
- [ ] Close seed round (€150K target)

**Deliverable:** Seed funding secured

---

## Features

### Phase 1 Only (Silent Pilot)

**What Agents DO:**
- ✅ Observe customer data
- ✅ Generate health scores
- ✅ Calculate financial metrics
- ✅ Send weekly reports to Slack
- ✅ Flag at-risk customers

**What Agents DON'T DO:**
- ❌ Modify CRM records (read-only)
- ❌ Send customer emails (manual only)
- ❌ Take autonomous actions
- ❌ Require approval workflows (not needed yet)

### Data Tracking

**Automated:**
- Customer health scores (via agent)
- Payback calculations (via agent)
- Churn risk flags (via agent)

**Manual (Google Sheets):**
- Customer list
- Monthly revenue
- Growth metrics (MRR, customer count)
- Investor updates

**Time:** 15 minutes/week

---

## Technical Specs

### Agent Configurations

**File Locations:**
- `configs/mvp/customersat-construction-mvp.yaml`
- `configs/mvp/viability-construction-mvp.yaml`

**Token Limits:**
- Customer Sat: 1500 tokens/invocation
- Viability: 1200 tokens/invocation

**Estimated Monthly Usage:**
- 60 invocations/month (12 per customer)
- ~500K tokens total
- Cost: €0 (covered by Groq $10K credits)

### Infrastructure Specs

**Google Cloud Run:**
- Memory: 512Mi
- CPU: 1 vCPU
- Min instances: 0
- Max instances: 2
- Region: europe-north1

**Supabase:**
- Tables: 3 (customer_health_mvp, viability_analysis_mvp, agent_actions_mvp)
- Storage: <5MB
- Queries: <1K/month

---

## Metrics to Track

### Customer Metrics
- Total active customers (Target: 5)
- Churn count (Target: 0)
- Average NPS (Target: >7)
- Support tickets per customer (Baseline only)

### Financial Metrics
- Total MRR (Target: €10K)
- Average payback period (Target: ≤2.0 months)
- Gross margin % (Target: ≥60%)
- Customer acquisition cost (Track only)

### Agent Performance
- Prediction accuracy (Target: >85%)
- Response time (Target: <2 seconds)
- False positive rate (Target: <10%)
- Uptime (Target: 99%+)

### Business Metrics
- Investor meetings held (Target: 10+)
- Seed funding raised (Target: €150K)
- Cost per customer (Target: €0)

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Groq credits run out | Medium | Low | Switch to Gemini free tier |
| Can't find 5 customers | High | Medium | Lower to 3 customers minimum |
| Payback >2 months | High | Low | Adjust setup process |
| Agent predictions wrong | Medium | Medium | Manual review catches errors |
| Seed funding fails | High | Medium | Bootstrap to 10 customers first |
| Customer churns during pilot | Medium | Low | Proactive CSM engagement |

---

## Deliverables

### Week 4 (End of MVP)

**1. Technical Deliverables:**
- ✅ 2 AI agents deployed and operational
- ✅ Cloud infrastructure running on free tiers
- ✅ Google Sheets dashboard with 30 days data

**2. Business Deliverables:**
- ✅ 5 pilot customers active (target: 0 churn)
- ✅ Average payback: ≤2.0 months proven
- ✅ Unit economics validated

**3. Investor Package:**
- ✅ PowerPoint pitch deck (10-12 slides)
- ✅ Live demo script (8 minutes)
- ✅ Google Sheets dashboard (live data)
- ✅ 30-day results summary (PDF)
- ✅ Financial model (Google Sheets)

---

## Budget

| Item | Free Tier Limit | MVP Usage | Cost |
|------|-----------------|-----------|------|
| Groq API | $10K credits | 500K tokens | €0 |
| Cloud Run | 2M requests | 10K requests | €0 |
| Supabase | 500MB | 5MB | €0 |
| Slack | 10K messages | 120 messages | €0 |
| Google Sheets | 15GB | <1MB | €0 |
| HubSpot CRM | Unlimited contacts | 5 contacts | €0 |
| **TOTAL** | | | **€0** |

**Contingency:** If any free tier exceeded, max cost: €20/month

---

## Success Metrics

### Technical Success
- ✅ Agents deployed: 2/2
- ✅ Uptime: >99%
- ✅ Response time: <2s
- ✅ Accuracy: >85%

### Business Success
- ✅ Customers: 5 active
- ✅ Churn: 0
- ✅ Payback: ≤2.0 months
- ✅ Cost: €0

### Fundraising Success
- ✅ Investor meetings: 10+
- ✅ Seed funding: €150K raised
- ✅ Valuation: €3.8M cap

---

## What's NOT in MVP

**Deferred to Alpha:**
- Additional verticals (Manufacturing, Energy)
- Deal Flow Agent
- Desirability Agent
- Phase 2 (Advisor Mode)
- CRM write access

**Deferred to V1:**
- Growth Tracker Agent
- Edge AI (NVIDIA Jetson)
- SiteSense Agent
- Autonomous mode (Phase 3)
- All 8 verticals

---

## Transition to Alpha

**Trigger:** Seed funding received + 5 customers proven

**Next Steps:**
1. Expand to 20 customers
2. Add Manufacturing & Energy verticals
3. Deploy Deal Flow + Desirability agents
4. Upgrade to Phase 2 (Advisor Mode)
5. Move to Alpha Roadmap

**Budget:** €50-100/month

---

## Quick Reference

**Current Phase:** MVP
**Duration:** 3 months (Dec 2025 - Feb 2026)
**Agents:** 2 (Customer Sat + Viability)
**Customers:** 5 pilot
**Verticals:** 1 (Construction)
**Cost:** €0/month
**Goal:** Raise €150K seed funding

**Next Phase:** Alpha (see ROADMAP_ALPHA.md)

---

**Last Updated:** December 1, 2025
**Status:** Active - Week 1
**Owner:** Lifetime Oy - Founding Team

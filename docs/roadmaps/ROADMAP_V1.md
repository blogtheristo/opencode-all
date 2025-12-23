# V1 Roadmap - DWS IQ Agent System
## Production Release

**Timeline:** Month 7-12 (June 2026 - November 2026)
**Goal:** Full production system with 100+ customers across 8 verticals
**Budget:** €250-400/month

---

## Prerequisites

- ✅ Alpha successful (50 customers, <5% churn)
- ✅ 3 verticals proven (Construction, Manufacturing, Energy)
- ✅ Phase 2 operational for 60+ days
- ✅ Series A prep underway

---

## Success Criteria

- ✅ 100+ active customers
- ✅ All 8 verticals operational
- ✅ Growth Tracker Agent deployed
- ✅ Edge AI on 10+ construction sites
- ✅ Phase 3 (Autonomous Mode) activated
- ✅ <3% monthly churn
- ✅ Series A raised (€1-2M)

---

## New in V1

### 1. Growth Tracker Agent ⭐

**Purpose:** Automated growth metrics and investor reporting

**Features:**
- Auto-generate weekly investor updates
- Real-time MRR/ARR dashboard
- Churn prediction modeling
- Cohort analysis (by month, vertical, ACV)
- Automated board reports (PowerPoint export)
- Predictive MRR forecasting

**Tech Stack:**
- Model: Groq Llama 3.1 70B
- Dashboard: Grafana Cloud
- Storage: Supabase + time-series DB

**Cost:** €20/month

**Timeline:** Month 7 (June 2026)

**Outputs:**
```markdown
# Weekly Growth Report (Auto-Generated)

## Key Metrics
- MRR: €200,000 (+15% MoM)
- Customers: 105 (+12 this month)
- Churn: 2.8% (3 customers)
- NRR: 115%

## Alerts
- Manufacturing vertical trending down (-5% usage)
- 8 customers at churn risk (health score <50)

## Projections
- MRR (30 days): €230,000
- Runway: 18 months
```

### 2. Complete Vertical Rollout

**Add 5 New Verticals:**
- Logistics (15 customers)
- Real Estate (10 customers)
- Architecture (8 customers)
- Waste Management (5 customers)
- Mining (3 customers)

**Each Vertical Gets:**
- Customer Satisfaction Agent
- Viability Agent
- Deal Flow Agent
- Desirability Agent

**Total Agents:** 32 (4 agents × 8 verticals)

**Timeline:** Month 7-9

### 3. Edge AI (SiteSense Agent)

**Deploy to 10 construction sites:**
- NVIDIA Jetson Orin Nano devices
- <100ms real-time inference
- Material detection (YOLOv8)
- Safety monitoring (PPE detection)
- Offline-capable

**Hardware Cost:** €35,000 (one-time)
**Cloud Savings:** €333,000/year

**Timeline:** Month 10-11

### 4. Phase 3 (Autonomous Mode)

**Activate Full Automation:**

**Customer Sat Agent:**
- Send personalized emails (no approval)
- Create CRM tasks automatically
- Trigger retention workflows
- Schedule check-in calls

**Guardrails:**
- Max 2 emails/customer/week
- Never send after hours
- Escalate if customer ACV >€50K
- Human review for Critical risk level

**Timeline:** Month 11

### 5. Advanced Dashboards

**Grafana Real-Time Dashboards:**
- Executive dashboard (MRR, customers, churn)
- Agent performance (accuracy, latency, cost)
- Customer health heatmap
- Financial metrics (payback, margins, NRR)

**Timeline:** Month 8

---

## Timeline

### Month 7: Growth Tracker + Grafana
- Deploy Growth Tracker Agent
- Set up Grafana dashboards
- Automated weekly investor emails
- Add Logistics + Real Estate verticals

### Month 8-9: Remaining Verticals
- Add Architecture vertical
- Add Waste Management vertical
- Add Mining vertical
- Scale to 80-100 customers

### Month 10-11: Edge AI
- Hardware procurement (10 Jetson devices)
- Edge deployment to construction sites
- Real-time monitoring live
- Cloud cost savings realized

### Month 12: Autonomous Mode
- Activate Phase 3 for top-performing agents
- Monitor autonomous actions
- Prepare Series A pitch
- V1 complete

---

## Budget

| Category | Monthly Cost |
|----------|--------------|
| **Agents (32 total)** | |
| - Strategic agents (Claude) | €100 |
| - Domain agents (Groq) | €50 |
| **Infrastructure** | |
| - Cloud Run | €50 |
| - Supabase Pro | €25 |
| - Grafana Cloud | €25 |
| **Integrations** | |
| - HubSpot | €50 |
| - Intercom | €29 |
| **Tools** | |
| - Growth Tracker Agent | €20 |
| **TOTAL** | **€349/month** |

**Hardware (one-time):** €35,000 (Edge AI)

**vs. Rovo:** €1,400/month (for 100 users)

**Savings:** €1,051/month + Edge AI capability

---

## Agent Count by Phase

| Phase | Agents | Verticals | Customers | Cost/Month |
|-------|--------|-----------|-----------|------------|
| MVP | 2 | 1 | 5 | €0 |
| Alpha | 8 | 3 | 50 | €101 |
| **V1** | **32 + Growth Tracker** | **8** | **100+** | **€349** |

---

## Growth Tracker Deployment Plan

### Week 1: Basic Implementation
- [ ] Create growth-tracker-agent.yaml config
- [ ] Integrate with Supabase (read financial data)
- [ ] Test MRR/ARR calculations
- [ ] Deploy to Cloud Run

### Week 2: Reporting
- [ ] Build weekly report template
- [ ] Set up Slack automation (Monday 9am)
- [ ] Email integration for investor updates
- [ ] Test with real data

### Week 3: Dashboards
- [ ] Grafana setup (free tier)
- [ ] Create 4 core dashboards
- [ ] Set up alerting rules
- [ ] Train team on dashboard usage

### Week 4: Advanced Features
- [ ] Churn prediction model
- [ ] Cohort analysis queries
- [ ] PowerPoint export (board decks)
- [ ] Predictive forecasting

**Total Effort:** 4 weeks (Part-time, 20 hours total)

---

## Success Metrics

**Technical:**
- ✅ 33 agents operational (32 + Growth Tracker)
- ✅ Edge AI: <100ms latency
- ✅ Uptime: 99.9%
- ✅ Phase 3 active: Yes

**Business:**
- ✅ Customers: 100+
- ✅ Churn: <3%
- ✅ NRR: >110%
- ✅ All 8 verticals: Active

**Financial:**
- ✅ MRR: €200K+
- ✅ ARR: €2.4M
- ✅ Payback: ≤2 months avg
- ✅ Series A: €1-2M raised

---

## Risks

| Risk | Mitigation |
|------|------------|
| Growth Tracker complexity | Start with MVP features, iterate |
| Edge AI deployment delays | Focus on 5 sites minimum |
| Phase 3 autonomous errors | Gradual rollout, extensive guardrails |
| Cost overruns | Monitor daily, alerts at 80% budget |

---

## What Comes After V1

**V2 (2027):**
- Multi-language support (Finnish, Swedish)
- Mobile app for site managers
- Self-service onboarding
- Partner/reseller network
- Series B prep (€5-10M)

---

## Quick Reference

**Phase:** V1 Production Release
**Duration:** 6 months (Jun - Nov 2026)
**Key Addition:** Growth Tracker Agent
**Agents:** 33 total
**Customers:** 100+
**Verticals:** 8 (all)
**Cost:** €349/month
**Goal:** Series A + profitability path

**Previous:** Alpha (see ROADMAP_ALPHA.md)
**Next:** V2 (TBD)

---

**Last Updated:** December 1, 2025
**Status:** Planned - Starts June 2026
**Owner:** Lifetime Oy - Product Team

# DWS IQ Agent System - Product Roadmap

**Last Updated:** December 1, 2025
**Status:** Pre-Seed / MVP Phase

---

## Current Phase: MVP (Month 1-3)

**Focus:** Prove concept with minimal complexity and cost

### Active Now ✅

**Agents Deployed:**
1. ✅ Customer Satisfaction Agent (Construction vertical only)
2. ✅ Viability Agent (Construction vertical only)

**Infrastructure:**
- ✅ Groq Agent Router (using $10K free credits)
- ✅ Supabase free tier (database)
- ✅ Google Cloud Run free tier
- ✅ Google Sheets (manual growth tracking)

**Scope:**
- 5 pilot customers
- 30-day silent pilot (Phase 1 only)
- Construction vertical only
- Manual investor updates

**Cost:** €0/month

### Deferred to Later ⏸️

**Growth Tracker Agent:**
- ❌ NOT implementing in MVP
- ✅ Using Google Sheets template instead
- 📅 **Scheduled for:** Post-Seed (Month 4-6, when 20+ customers)
- **Reason:** Manual tracking sufficient for 5 customers (15 min/week)

**Other Agents:**
- Deal Flow Agent → Month 4+
- Desirability Agent → Month 4+
- Additional verticals (7 more) → Month 6+

---

## Phase 2: Early Growth (Month 4-6)

**Trigger:** Seed funding received + 10-20 customers

### Goals
- Scale to 20-50 customers
- Expand to 2-3 verticals
- Deploy advisor mode (Phase 2)

### New Deployments 📅

**1. Growth Tracker Agent** (HIGH PRIORITY)
- **When:** 20+ customers OR monthly investor board meetings required
- **Why:** Manual tracking exceeds 1 hour/week
- **Features:**
  - Auto-generate weekly investor reports
  - Real-time MRR/ARR dashboard
  - Churn prediction modeling
  - Cohort analysis
- **Cost:** €10-20/month (Groq)
- **Time to build:** 6-8 hours
- **ROI:** Positive (saves 8 hours/month)

**2. Deal Flow Agent**
- **When:** Active sales pipeline >50 leads
- **Why:** Sales team needs lead prioritization
- **Cost:** €10/month

**3. Additional Verticals**
- Manufacturing (Customer Sat + Viability)
- Energy (Customer Sat + Viability)
- **Cost:** €20/month (2 more verticals)

### Infrastructure Upgrades
- Supabase Pro: €25/month (needed for 50+ customers)
- Cloud Run scaling: ~€30/month

**Total Cost:** €85-105/month

---

## Phase 3: Scale (Month 7-12)

**Trigger:** 50+ customers, Series A prep

### Goals
- Scale to 100+ customers
- Deploy all 8 verticals
- Activate autonomous mode (Phase 3)
- Edge AI deployment

### New Deployments 📅

**1. Desirability Agent** (All Verticals)
- Market intelligence and competitive analysis
- **Cost:** €30/month

**2. Complete Vertical Rollout**
- All 8 verticals × 4 agents = 32 total agents
- **Cost:** €200/month (split between Claude + Groq)

**3. Edge AI (SiteSense)**
- Deploy to 10 construction sites
- NVIDIA Jetson Orin Nano devices
- <100ms real-time inference
- **Hardware:** €35,000 (one-time capex)
- **Savings:** €333,000/year cloud costs

**4. Grafana + Advanced Dashboards**
- Real-time observability
- Board-level reporting
- **Cost:** €25/month

**Total Cost:** €345/month operational + €35K hardware

---

## Roadmap Summary Table

| Phase | Timeline | Customers | Agents | Verticals | Cost/Month | Key Milestone |
|-------|----------|-----------|--------|-----------|------------|---------------|
| **MVP** | Month 1-3 | 5 | 2 | 1 | €0 | Prove concept, raise seed |
| **Early Growth** | Month 4-6 | 20-50 | 6 | 3 | €85-105 | **+ Growth Tracker** |
| **Scale** | Month 7-12 | 100+ | 32 | 8 | €345 | Edge AI, autonomous mode |

---

## Growth Tracker Agent - Detailed Roadmap

### Phase 2A: Basic Growth Tracker (Month 4-5)

**When to Deploy:** 20+ customers

**Features (MVP):**
- Weekly automated investor reports
- MRR, ARR, customer count tracking
- Growth rate calculations (MoM, QoQ)
- Basic churn analysis
- Slack notifications

**Tech Stack:**
- Groq Llama 3.1 70B
- Supabase for data storage
- Google Sheets integration (read/write)

**Effort:** 6-8 hours development

**Cost:** €10/month

### Phase 2B: Enhanced Growth Tracker (Month 6)

**When to Deploy:** 50+ customers OR board meetings

**Additional Features:**
- Cohort analysis (by month, vertical, ACV tier)
- Churn prediction modeling
- Expansion revenue tracking
- Real-time Grafana dashboard
- Automated board decks (PowerPoint export)

**Tech Stack:**
- Add Claude Sonnet 4.5 for complex analysis
- Grafana Cloud (free tier)
- Metabase for SQL dashboards

**Effort:** +4 hours enhancement

**Cost:** €20/month

### Phase 3: Advanced Analytics (Month 9+)

**When to Deploy:** Series A prep

**Additional Features:**
- Predictive MRR forecasting (ML models)
- Unit economics by cohort/vertical
- CAC payback optimization recommendations
- Competitive benchmarking (vs. Peachscore data)
- Automated quarterly board reports

**Tech Stack:**
- Add predictive models (scikit-learn)
- Peachscore API integration

**Effort:** +8 hours

**Cost:** €30/month

---

## Decision Framework: When to Add Growth Tracker

### ✅ Deploy Growth Tracker if ANY of these are true:

| Trigger | Status | Deploy? |
|---------|--------|---------|
| 20+ customers | ❌ (currently 5) | Wait |
| Manual tracking >1 hour/week | ❌ (currently 15 min) | Wait |
| Monthly board meetings | ❌ (not yet) | Wait |
| Multiple verticals | ❌ (only construction) | Wait |
| Investor requests automation | ❌ (not yet) | Wait |
| Series A fundraising starts | ❌ (still pre-seed) | Wait |

**Current Decision:** ✅ **Wait** - Use Google Sheets until Month 4

---

## Alternative Options (If Needed Earlier)

### Option A: Lightweight Automation (Month 3)

**If you need *some* automation before 20 customers:**

**Solution:** Extend Viability Agent with basic growth metrics
- Add MRR calculation to Viability Agent
- Add customer count tracking
- Output: "MRR: €10K, 5 customers, 1.9mo payback"

**Effort:** 2 hours (modify existing config)
**Cost:** €0 (same Groq calls)

**When to use:**
- Investors request weekly metrics
- Manual tracking becomes annoying
- You want to look more automated

### Option B: Zapier Integration (Month 3-4)

**No-code automation:**
- Stripe → Google Sheets (new customer auto-added)
- Weekly Google Sheets → Slack report
- Supabase → Google Sheets sync

**Effort:** 1 hour setup
**Cost:** €0 (Zapier free tier: 100 tasks/month)

---

## Cost Evolution Path

### Year 1 Projection

| Quarter | Customers | Agents | Infrastructure | Total/Month | Cumulative |
|---------|-----------|--------|----------------|-------------|------------|
| **Q1 (MVP)** | 5 | 2 | Free tier | €0 | €0 |
| **Q2 (Growth)** | 20 | 6 | Supabase Pro | €85 | €255 |
| **Q3 (Scale)** | 50 | 16 | + Grafana | €150 | €705 |
| **Q4 (Production)** | 100+ | 32 | + Edge AI | €345 | €1,740 |

**Year 1 Total Cost:** €1,740 operational + €35K hardware

**Compare to Rovo:** €16,800/year (recurring)

**Savings:** €15,060 (86% cheaper)

---

## Feature Comparison: Manual vs. Automated

| Feature | Google Sheets (Now) | Growth Tracker Agent (Month 4+) |
|---------|---------------------|----------------------------------|
| **MRR Tracking** | ✅ Manual formula | ✅ Auto-calculated |
| **Customer Count** | ✅ Manual count | ✅ Auto-synced |
| **Growth Rate** | ✅ Manual formula | ✅ Auto-calculated |
| **Churn Analysis** | ❌ Manual | ✅ Automated |
| **Cohort Analysis** | ❌ Too manual | ✅ Automated |
| **Weekly Reports** | ⚠️ Copy-paste template | ✅ Auto-generated |
| **Real-time Dashboard** | ❌ No | ✅ Yes (Grafana) |
| **Predictive Modeling** | ❌ No | ✅ Yes (Phase 3) |
| **Board Decks** | ⚠️ Manual PowerPoint | ✅ Auto-generated |
| **Cost** | €0 | €10-30/month |
| **Time/Week** | 15 min | 5 min |

---

## Dependencies & Blockers

### Growth Tracker Agent Dependencies:

**Must Have First:**
1. ✅ Groq API access (already have $10K credits)
2. ⏸️ 20+ customers (currently 5)
3. ⏸️ Supabase Pro (upgrade at 50+ customers)
4. ✅ Google Cloud Run (already deployed)

**Nice to Have:**
- Stripe integration (for auto-revenue sync)
- Grafana Cloud account
- Weekly board meeting schedule

### Potential Blockers:

| Blocker | Risk | Mitigation |
|---------|------|------------|
| Groq credits run out | Low | Switch to Gemini free tier |
| Customer count stays <20 | Medium | Keep using Google Sheets |
| Seed funding delayed | Medium | Defer to Month 6+ |
| No board meetings | Low | Weekly investor emails sufficient |

---

## Success Metrics

### MVP Phase (Month 1-3)
- ✅ 5 pilot customers onboarded
- ✅ Payback <2 months proven
- ✅ Zero churn
- ✅ Manual tracking <20 min/week
- ✅ Investor deck ready

### Early Growth Phase (Month 4-6)
- ✅ 20+ customers
- ✅ Growth Tracker deployed
- ✅ Automated weekly reports
- ✅ Manual tracking eliminated
- ✅ Board meeting cadence established

### Scale Phase (Month 7-12)
- ✅ 100+ customers
- ✅ All 32 agents deployed
- ✅ Edge AI operational
- ✅ Series A prep complete

---

## Next Review Date

**When to revisit this roadmap:**
- ✅ After MVP pilot (Month 3)
- ✅ When customer count hits 15 (check if Growth Tracker needed)
- ✅ After seed funding received
- ✅ Monthly during Early Growth phase

---

## Quick Reference: "Should I Build Growth Tracker Now?"

```
┌─────────────────────────────────────────────┐
│  Growth Tracker Decision Tree               │
└─────────────────────────────────────────────┘

Do you have 20+ customers?
├─ YES → Deploy Growth Tracker (Phase 2A)
└─ NO ↓

Is manual tracking >1 hour/week?
├─ YES → Deploy Growth Tracker (Phase 2A)
└─ NO ↓

Do you have monthly board meetings?
├─ YES → Deploy Growth Tracker (Phase 2B)
└─ NO ↓

Are you raising Series A?
├─ YES → Deploy Growth Tracker (Phase 3)
└─ NO ↓

✅ Keep using Google Sheets
📅 Revisit when you hit 15 customers
```

---

## Summary

**Current Status:** ✅ MVP Phase - Use Google Sheets

**Next Agent to Deploy:** 📅 Growth Tracker Agent (Month 4-6, at 20+ customers)

**Cost Impact:** +€10-20/month when deployed

**Time Savings:** 1+ hour/week (positive ROI at scale)

**Your Focus Now:** Get to 5 pilot customers, prove unit economics, raise seed funding

---

**Last Updated:** December 1, 2025
**Next Review:** March 1, 2026 (after MVP pilot complete)
**Maintained By:** Lifetime Oy - Product Team

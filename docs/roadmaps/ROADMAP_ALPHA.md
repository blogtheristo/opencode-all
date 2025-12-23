# Alpha Roadmap - DWS IQ Agent System
## Early Adopter Phase

**Timeline:** Month 4-6 (March 2026 - May 2026)
**Goal:** Scale to 20-50 customers across 3 verticals
**Budget:** €50-150/month

---

## Prerequisites

**Must Complete First:**
- ✅ MVP successful (5 customers, 0 churn)
- ✅ Seed funding raised (€150K)
- ✅ Unit economics proven (payback ≤2 months)
- ✅ Agents operating smoothly for 30+ days

---

## Success Criteria

**Must Achieve:**
- ✅ 20-50 active customers
- ✅ 3 verticals operational (Construction, Manufacturing, Energy)
- ✅ Phase 2 (Advisor Mode) deployed
- ✅ <5% monthly churn rate
- ✅ NPS >8 average
- ✅ Automated weekly reports

**Nice to Have:**
- ⚠️ 50+ customers (stretch goal)
- ⚠️ 4 verticals (add Logistics)
- ⚠️ First enterprise customer (>€10K MRR)

---

## Scope

### Deployment Options

**Two deployment models offered in Alpha:**

#### Option A: DWS IQ Cloud (Default) 🎯

**Our custom agent system (recommended):**
- Built on Claude + Groq + LlamaStack
- Full control and flexibility
- Edge AI ready
- Cost: €50-150/month
- **This is what we build and support**

#### Option B: DWS6 Private Cloud with Rovo Agents 🆕

**For Atlassian-native customers:**
- Available as managed service
- Uses Atlassian Rovo agents
- Requires customer's Atlassian Premium/Enterprise license
- Deployed on customer's Atlassian Cloud tenant
- We configure and manage Rovo agents
- Cost: €200-300/month (managed service fee)
- **Customer must provide:** Atlassian Premium/Enterprise license

**When to offer Option B:**
- Customer already heavily invested in Atlassian (Jira, Confluence)
- Enterprise customer requiring Atlassian compliance
- Customer prefers no-code/low-code tools
- IT team mandates Atlassian-only integrations

**Limitations of Option B (Rovo):**
- ❌ No edge AI capability (cloud-only)
- ❌ Cannot use Groq credits
- ❌ Limited to Atlassian's LLM models
- ❌ Locked to Atlassian ecosystem
- ⚠️ Customer must pay for Atlassian license (~€1,400/month for 100 users)

### Agents (Option A - DWS IQ Cloud)

**Existing (from MVP):**
1. ✅ Customer Satisfaction Agent (Construction)
2. ✅ Viability Agent (Construction)

**New in Alpha:**
3. **Customer Satisfaction Agent** - Manufacturing
4. **Customer Satisfaction Agent** - Energy
5. **Viability Agent** - Manufacturing
6. **Viability Agent** - Energy
7. **Deal Flow Agent** - Construction (new agent type)
8. **Desirability Agent** - Construction (new agent type)

**Total:** 8 agents across 3 verticals

**❌ NOT in Alpha:**
- Growth Tracker Agent → V1
- SiteSense Edge Agent → V1
- Remaining 5 verticals → V1
- Phase 3 (Autonomous Mode) → V1

### Infrastructure Upgrades

**New Services:**
- ✅ Supabase Pro (€25/month) - needed for 50+ customers
- ✅ HubSpot CRM integration (paid tier if needed)
- ✅ Intercom (for customer support tracking)

**Existing (Continue):**
- ✅ Groq Agent Router (still using credits)
- ✅ Google Cloud Run (may start paying ~€20/month)
- ✅ Slack notifications

**New Integrations:**
- ✅ Stripe API (automated revenue tracking)
- ✅ HubSpot CRM write access (Phase 2)
- ✅ Email automation (Phase 2 approvals)

**Estimated Cost:** €50-150/month

### Verticals

**Included:**
- ✅ Construction (expand from 5 to 15-20 customers)
- ✅ Manufacturing (new, 10-15 customers)
- ✅ Energy (new, 5-10 customers)

**NOT Included:**
- ❌ Logistics → V1
- ❌ Real Estate → V1
- ❌ Architecture → V1
- ❌ Waste Management → V1
- ❌ Mining → V1

---

## Timeline

### Month 4: Infrastructure & New Agents
**March 2026**

**Week 1-2: Deploy New Agent Types**
- [ ] Build Deal Flow Agent config
- [ ] Build Desirability Agent config
- [ ] Test both on Construction vertical
- [ ] Deploy to production

**Week 3-4: Expand to Manufacturing**
- [ ] Deploy Customer Sat Agent (Manufacturing)
- [ ] Deploy Viability Agent (Manufacturing)
- [ ] Onboard 10 manufacturing customers
- [ ] Calibrate agents for manufacturing use cases

**Deliverable:** 15 customers (5 construction + 10 manufacturing)

### Month 5: Energy Vertical & Phase 2
**April 2026**

**Week 1-2: Energy Rollout**
- [ ] Deploy Customer Sat Agent (Energy)
- [ ] Deploy Viability Agent (Energy)
- [ ] Onboard 5-10 energy customers
- [ ] Test cross-vertical analytics

**Week 3-4: Activate Phase 2 (Advisor Mode)**
- [ ] Deploy approval workflows
- [ ] Enable CRM write access (with approvals)
- [ ] Train CSMs on agent recommendations
- [ ] Set up email notification system

**Deliverable:** 25-30 customers, Phase 2 active

### Month 6: Scale & Optimize
**May 2026**

**Week 1-2: Customer Acquisition**
- [ ] Scale Construction to 20 customers
- [ ] Scale Manufacturing to 15 customers
- [ ] Scale Energy to 10 customers
- [ ] Deploy Deal Flow agent to all verticals

**Week 3-4: Optimization**
- [ ] Review churn data
- [ ] Optimize agent prompts based on feedback
- [ ] A/B test Claude vs. Groq for strategic agents
- [ ] Prepare for V1 transition

**Deliverable:** 45-50 customers, optimized system

---

## Features

### Phase 2 (Advisor Mode)

**What Changes from MVP:**

**Customer Satisfaction Agent:**
- ✅ Recommends outreach actions (email templates)
- ✅ Suggests upsell opportunities
- ✅ Flags churn risk with intervention plans
- ⚠️ **Requires human approval** for all actions

**Viability Agent:**
- ✅ Recommends pricing adjustments
- ✅ Flags unprofitable customers
- ✅ Suggests contract renegotiations
- ⚠️ **Requires finance lead approval**

**Deal Flow Agent (NEW):**
- Scores leads 0-100
- Prioritizes sales pipeline
- Generates personalized outreach
- Recommends deal stages
- **Human approval required**

**Desirability Agent (NEW):**
- Tracks market trends
- Monitors competitors
- Analyzes customer feedback
- Recommends feature priorities
- **Weekly report format**

### Approval Workflows

**Implemented via:**
- Slack notifications with "Approve/Reject" buttons
- Email notifications to assigned CSM/Sales Rep
- Dashboard for pending approvals
- 24-hour timeout (escalate if no response)

**Auto-approve scenarios:**
- Customer health score >70 (low risk)
- Viability score >80 (strong economics)
- Deal score >85 (hot lead)

### Data Tracking

**Automated (New):**
- Revenue sync from Stripe
- CRM updates (with approval)
- Support ticket sync (Intercom)
- Lead scoring (Deal Flow agent)

**Still Manual:**
- Growth metrics (MRR, churn) → Google Sheets
- Board reports → Manual PowerPoint
- Financial forecasting → Manual model

**Time:** 30 minutes/week (down from 15 min but more customers)

---

## Technical Specs

### New Agent Configurations

**Deal Flow Agent:**
```yaml
model: groq/llama-3.1-70b-versatile
temperature: 0.4
max_tokens: 2000
tools:
  - enrich_company_data
  - score_lead
  - generate_outreach_email
```

**Desirability Agent:**
```yaml
model: groq/llama-3.1-70b-versatile
temperature: 0.5
max_tokens: 2500
tools:
  - web_search (news, competitors)
  - analyze_feedback
  - generate_market_report
```

### Infrastructure Scaling

**Supabase Pro:**
- Storage: 8GB
- Bandwidth: 50GB/month
- Concurrent connections: 200

**Cloud Run:**
- Memory: 1Gi (increased from 512Mi)
- Max instances: 5 (increased from 2)
- Estimated requests: 100K/month

**Groq API:**
- Estimated tokens: 2M/month
- Cost: ~€1.40 (still covered by credits)

---

## Metrics to Track

### Customer Metrics
- Total active customers (Target: 50)
- Monthly churn rate (Target: <5%)
- Average NPS (Target: >8)
- Customer Lifetime Value (Track)

### Financial Metrics
- Total MRR (Target: €100K)
- MRR by vertical (Track distribution)
- Average payback period (Target: ≤2.0 months)
- Gross margin by vertical (Track)

### Agent Performance
- Approval rate (Target: >80%)
- Recommendation accuracy (Target: >85%)
- Time to value (Target: <7 days)
- Agent uptime (Target: 99.5%+)

### Business Metrics
- Lead conversion rate (Track baseline)
- Sales cycle length (Track baseline)
- Feature requests by vertical (Track for roadmap)

---

## New Agent Details

### Deal Flow Agent

**Purpose:** Qualify leads and prioritize sales pipeline

**Inputs:**
- Company domain
- Industry vertical
- Company size (employees)
- Budget signals (if known)
- Engagement level

**Outputs:**
```json
{
  "lead_id": "lead_123",
  "score": 82,
  "tier": "Hot",
  "recommended_actions": [
    "Schedule demo within 48 hours",
    "Assign to senior sales rep",
    "Send pricing proposal"
  ],
  "enrichment_data": {
    "annual_revenue_est": "€5M-10M",
    "employee_count": 75,
    "tech_stack": ["Procore", "AutoCAD"],
    "fit_score": 85
  }
}
```

**Scoring Criteria:**
- Company size: 50-500 employees (ideal)
- Budget authority: Director+ engagement
- Technical fit: Existing IoT/software
- Geographic fit: EU-based
- Urgency: Compliance deadlines

### Desirability Agent

**Purpose:** Market intelligence and product strategy

**Inputs:**
- News APIs (construction tech, climate tech)
- Competitor websites (monthly scrapes)
- Customer interview transcripts
- Feature request backlog

**Outputs:**
```markdown
## Weekly Market Intelligence Report

### Competitive Landscape
- Competitor A launched new feature X (threat level: Medium)
- Industry trend: IoT adoption accelerating in manufacturing

### Customer Insights
- Top requested feature: Mobile app (15 mentions this month)
- Pain point: Setup time >1 week (8 complaints)

### Opportunities
- EU Fit for 55 enforcement starting Q3 2026
- 3 new grant programs announced (€500K total available)

### Recommendations
1. Prioritize mobile app (high demand, differentiator)
2. Streamline setup process (reducing churn risk)
3. Apply for EU Innovation Fund grant by June 30
```

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Can't scale to 50 customers | High | Medium | Lower target to 30 minimum |
| Phase 2 approvals too slow | Medium | High | Set 24hr timeout, auto-approve low-risk |
| Multi-vertical complexity | Medium | Medium | Standardize configs across verticals |
| Groq credits exhausted | Low | Low | Switch to Gemini or budget €50/month |
| Churn >5% | High | Medium | Proactive CSM weekly check-ins |
| Deal Flow agent low accuracy | Medium | Low | Train on historical won/lost deals |

---

## Deliverables

### End of Month 4
- ✅ 4 new agents deployed (Deal Flow, Desirability, 2 new verticals)
- ✅ 15-20 customers active
- ✅ Infrastructure upgraded (Supabase Pro)

### End of Month 5
- ✅ Phase 2 (Advisor Mode) activated
- ✅ 25-30 customers active
- ✅ Approval workflows operational
- ✅ Energy vertical live

### End of Month 6 (Alpha Complete)
- ✅ 45-50 customers active
- ✅ <5% monthly churn
- ✅ All 8 agents operational
- ✅ Automated weekly reports
- ✅ Ready for V1 transition

---

## Budget

### Option A: DWS IQ Cloud (Default)

| Item | Month 4 | Month 5 | Month 6 |
|------|---------|---------|---------|
| Supabase Pro | €25 | €25 | €25 |
| Cloud Run | €20 | €30 | €40 |
| Groq API | €0 | €0 | €10 |
| Intercom | €0 (free) | €0 | €29 |
| HubSpot CRM | €0 | €50 | €50 |
| **TOTAL** | **€45** | **€105** | **€154** |

**Average:** €101/month

### Option B: DWS6 Private Cloud with Rovo

**Customer Costs:**
- Atlassian Jira Premium: ~€1,400/month (100 users)
- Rovo usage fees: €0-200/month (usage-based after quotas)
- **Subtotal (Customer pays):** €1,400-1,600/month

**Our Costs (Managed Service):**
- Setup fee (one-time): €2,000
- Monthly management: €200-300/month
- Rovo agent configuration: €500 (one-time)

**Total Customer Cost:** €1,600-1,900/month

**vs. Option A:** €101/month

**Savings with Option A:** €1,499-1,799/month (94%)

---

## Success Metrics

### Technical Success
- ✅ Agents deployed: 8/8
- ✅ Uptime: >99.5%
- ✅ Phase 2 active: Yes
- ✅ Approval rate: >80%

### Business Success
- ✅ Customers: 45-50
- ✅ Churn: <5%
- ✅ NPS: >8
- ✅ MRR: €100K

### Operational Success
- ✅ Automated reports: Weekly
- ✅ Manual tracking: <30 min/week
- ✅ CSM satisfaction: >80%

---

## Option B: Rovo Agent Configuration (DWS6 Private Cloud)

### What We Configure in Customer's Rovo

**For Atlassian-native customers who choose Option B:**

#### 1. Customer Health Agent (Rovo Studio)
**Type:** No-code Rovo Studio agent

**Configuration:**
- **Knowledge Base:** Connected to customer's Confluence spaces (Construction, Manufacturing, Energy)
- **Data Sources:** Jira tickets, customer interaction logs
- **Role:** "You are a Customer Success specialist monitoring customer health"
- **Capabilities:**
  - Create Jira Issue (flag at-risk customers)
  - Comment on Confluence pages (health reports)
  - Look up Jira tickets
- **Conversation Starters:**
  - "Analyze health for all customers"
  - "Show at-risk customers this week"
  - "Generate customer health report"

**Limitations:** Cannot access external APIs (Stripe, HubSpot) without Forge app

#### 2. Deal Flow Agent (Rovo Studio)
**Type:** No-code Rovo Studio agent

**Configuration:**
- **Knowledge Base:** Sales playbooks, pricing sheets (Confluence)
- **Data Sources:** Jira Service Desk (lead forms), CRM exports
- **Role:** "You are a Sales Operations specialist prioritizing leads"
- **Capabilities:**
  - Create Jira Issue (new qualified leads)
  - Update issue status
  - Assign to sales reps

**Limitations:** No real-time CRM integration, no lead enrichment APIs

#### 3. Viability Checker (Atlassian Forge)
**Type:** Custom Forge app (requires development)

**manifest.yml:**
```yaml
modules:
  rovo:agent:
    - key: viability-agent
      name: Financial Viability Agent
      prompt: >
        Calculate payback period and gross margin.
        Use 'calculate-payback' tool when asked about viability.

  function:
    - key: payback-calculator
      handler: index.calculatePayback
```

**Capabilities:**
- Call external financial APIs (Stripe, accounting systems)
- Calculate payback period
- Approve/reject deals based on criteria

**Development Required:** 40-60 hours for Forge app development

### Rovo Agent Comparison vs. DWS IQ Cloud

| Feature | DWS IQ Cloud (Option A) | Rovo (Option B) |
|---------|-------------------------|-----------------|
| **Setup Time** | 1 week | 3-4 weeks (Forge apps) |
| **Customization** | Full control | Limited to Rovo APIs |
| **External APIs** | ✅ Any API | ⚠️ Only via Forge |
| **Edge AI** | ✅ NVIDIA Jetson | ❌ Cloud-only |
| **LLM Choice** | ✅ Claude, Groq, Llama | ❌ Atlassian's models |
| **Cost (50 users)** | €101/month | €1,600-1,900/month |
| **Data Residency** | ✅ Full control | ⚠️ Atlassian-controlled |
| **Phase 3 (Autonomous)** | ✅ Yes (V1) | ❌ No (always requires approval) |

### When to Recommend Option B (Rovo)

**✅ Good fit:**
- Customer has 500+ Atlassian licenses already
- Enterprise compliance requires Atlassian
- Customer refuses cloud providers other than Atlassian
- IT team very familiar with Forge development

**❌ Not a good fit:**
- Customer needs edge AI (<100ms decisions)
- Wants to minimize costs
- Needs advanced analytics (Growth Tracker, predictive models)
- Requires autonomous agents (Phase 3)
- Multi-cloud strategy (Google Cloud, AWS)

### Managed Service SLA (Option B)

**What we provide:**
- Initial Rovo agent configuration (4 weeks)
- Monthly optimization and tuning
- Quarterly knowledge base updates
- 24/7 Slack support
- Monthly performance reports

**What customer provides:**
- Atlassian Premium/Enterprise license
- Access to Rovo Studio
- Confluence/Jira admin access
- Forge app deployment approvals

---

## What's NOT in Alpha

**Deferred to V1:**
- **Growth Tracker Agent** (deploy at 50+ customers)
- Edge AI (NVIDIA Jetson) - **Not available for Option B**
- SiteSense Agent - **Not available for Option B**
- Phase 3 (Autonomous Mode) - **Limited for Option B**
- Remaining 5 verticals
- Real-time dashboards (Grafana) - **Option B uses Atlassian Analytics**
- Predictive analytics

---

## Transition to V1

**Trigger:** 50 customers active + Alpha stable for 30 days

**Next Steps:**
1. Deploy Growth Tracker Agent
2. Expand to all 8 verticals
3. Activate Phase 3 (Autonomous Mode)
4. Deploy Edge AI to construction sites
5. Build Grafana dashboards
6. Move to V1 Roadmap

**Budget:** €250-400/month

---

## Quick Reference

**Current Phase:** Alpha
**Duration:** 3 months (Mar 2026 - May 2026)
**Deployment Options:** 2 (DWS IQ Cloud + DWS6 Private Cloud with Rovo)
**Agents:** 8 (Customer Sat + Viability + Deal Flow + Desirability)
**Customers:** 20-50
**Verticals:** 3 (Construction, Manufacturing, Energy)

**Cost:**
- **Option A (Default):** €50-150/month
- **Option B (Rovo):** €1,600-1,900/month (customer pays Atlassian licenses)

**Goal:** Prove scalability and multi-vertical viability

**Previous Phase:** MVP (see ROADMAP_MVP.md)
**Next Phase:** V1 (see ROADMAP_V1.md)

---

**Last Updated:** December 2, 2025
**Status:** Planned - Starts March 2026
**Owner:** Lifetime Oy - Product Team
**Note:** Option B (DWS6 Private Cloud with Rovo) added for Atlassian-native customers

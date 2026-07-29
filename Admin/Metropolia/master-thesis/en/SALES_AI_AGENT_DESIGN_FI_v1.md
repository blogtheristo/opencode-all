# Sales AI Agent Design - DWS IQ 6 Myyntiautomaatio

---
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 5) | Session: claude/traction-truth-reconciliation | Date: 29.07.2026 | Changes: Traction claims reconciled to docs/TRACTION_CANONICAL.md — Kela/Uber Finland removed as customers and case studies (they are Traficom-defined dispatch operators of the transport business), and the €7k MRR starting point replaced with €59,900 of contracted Q1/2026 pilot value.
  - Version: 1.0 | Tool: Claude Code | Session: jqfl0 | Date: 19.01.2026 | Changes: Initial creation - Comprehensive sales AI agent design for 5 customer segments

Session Links & References:
  - Claude Code (jqfl0): https://github.com/blogtheristo/dws6/tree/claude/sales-ai-agent-design-jqfl0
  - View on GitHub: [Pending commit]

Document Status:
  - Created: 19.01.2026
  - Last Modified: 19.01.2026
  - Language: Finnish & English (bilingual)
  - Languages Available: Suomi, English
  - Publication Status: 🚧 DRAFT

---

**Version:** 1.0
**Purpose:** Määritellä AI-agentit myynnin tehostamiseen viidelle asiakassegmentille
**Audience:** Sales Leadership, Product Management, Engineering
**Updated:** 19.01.2026

---

## Executive Summary / Yhteenveto

### Ongelma: Myynti ei vedä

DWS IQ 6:lla on viisi erillistä myyntihaastetta:

1. **Pilotti asiakkaat rakennusala** - Construction pilot customers
2. **Pilotti asiakkaat konsultointi** - Consulting pilot customers
3. **Pilotti asiakkaat koulutus** - Training/education pilot customers
4. **Firehorse asiakkaat** - Firehorse CRM customers
5. **Investor outreach sales** - Investor/VC sales

### Ratkaisu: Human-Agent -hybridimalli

Tämä dokumentti määrittelee **6 erikoistunutta myyntiagenttia** + **1 Sales HIL Director** -roolit, jotka yhdessä muodostavat skaalautuvan myyntiorganisaation.

**Keskeiset mittarit:**
- Human-to-Agent ratio: 1:6 (1 Director + 6 agenttia)
- Tavoite: €60k MRR (16-18 kuukaudessa). Lähtötaso on €59 900 sopimuksin varmistettua Q1/2026-pilottiarvoa (kaksi yrityspilottia á €29 950) sekä neljä pienempää asiakkuutta — ei €7k MRR:ää, joka on palvelu- ja kuljetusliikevaihtoa.
- Kustannustehokkuus: €900-1,500/kk (vs. €25k-35k/kk 3 SDR:ää)

---

## Table of Contents

1. [Human-to-Agent Ratio & Vastuut](#1-human-to-agent-ratio--vastuut)
2. [Agent Ylivoima Sales Funnelissa](#2-agent-ylivoima-sales-funnelissa)
3. [Kontrolli & Tarkistuspisteet](#3-kontrolli--tarkistuspisteet)
4. [Orkestrointi & Johtaminen](#4-orkestrointi--johtaminen)
5. [Skills: Agentit vs. HIL Director](#5-skills-agentit-vs-hil-director)
6. [Vaaditut Agentit](#6-vaaditut-agentit)
7. [Tuotekohtaiset Myyntiotteeet](#7-tuotekohtaiset-myyntiotteeet)
8. [YAML Agent Configurations](#8-yaml-agent-configurations)
9. [Implementation Roadmap](#9-implementation-roadmap)

---

## 1. Human-to-Agent Ratio & Vastuut

### 1.1 Missä ihminen tuo eniten lisäarvoa?

**Human-in-Loop (HIL): Sales Director -rooli**

| Vaihe | Ihmisen lisäarvo | Miksi AI ei riitä? |
|-------|------------------|-------------------|
| **Strategic account selection** | Subjektiivinen bisneslogiikka | Agent ei ymmärrä markkinadynamiikkaa, kilpailutilannetta, poliittisia tekijöitä |
| **High-touch negotiations** | Luottamuksen rakentaminen | €29,950 pilotti + €8,500/kk deals vaativat henkilökohtaisen suhteen |
| **Complex RFP response** | Räätälöinti & storytelling | Nordic construction RFP:t vaativat kulttuurista ymmärrystä (Kela, Senaatti) |
| **Executive relationships** | Pitkäaikaiset suhteet | CFO/CSO/CTO -tasolla ihmiskontakti pakollinen |
| **Crisis management** | Emotionaalinen äly | Churn prevention, escalation handling vaatii empatiaa |
| **Product-market fit validation** | Strateginen oivallus | Määrittää mitä tuotteita kenellekin segmentille myydään |

**Kontribuutio:**
- **Ihminen:** 20% ajasta, 80% arvosta (high-value touchpoints)
- **Agentit:** 80% ajasta, 20% arvosta (repetitive, data-driven tasks)

---

### 1.2 Agent-First Tasks

**Mitä agentit tekevät paremmin:**

| Tehtävä | Agentin etu | ROI |
|---------|-------------|-----|
| **Lead enrichment** | 24/7 LinkedIn scraping, company data aggregation | 10x nopeampi kuin manuaalinen |
| **Email sequence execution** | Perfect timing, no "forgot to follow up" | 3x parempi response rate |
| **Meeting scheduling** | Instant calendar coordination | 5h/viikko aikasäästö |
| **CRM hygiene** | Auto-update contact info, deal stages | 100% data accuracy |
| **Multi-channel presence** | Simultaneous LinkedIn + Email + calls | Inhimillisesti mahdoton |
| **A/B testing** | Continuous subject line, CTA optimization | 40% parempi open rate |

---

## 2. Agent Ylivoima Sales Funnelissa

### 2.1 Industrial Sales Funnel - Agent vs. Human Map

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DWS IQ 6 INDUSTRIAL SALES FUNNEL                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  AWARENESS (100% Agent)                                                 │
│  ├─ LinkedIn scraping & enrichment          [Lead Scout Agent]          │
│  ├─ Company trigger event monitoring        [Lead Scout Agent]          │
│  └─ ICP scoring (CSRD compliance, revenue)  [Lead Scout Agent]          │
│                                                                         │
│  INTEREST (90% Agent, 10% Human)                                        │
│  ├─ Cold email sequences (7-touch)          [Outreach Agent]            │
│  ├─ LinkedIn connection requests             [Outreach Agent]            │
│  ├─ A/B testing subject lines               [Outreach Agent]            │
│  └─ [HIL] Warm intro via network            [Sales Director]            │
│                                                                         │
│  CONSIDERATION (70% Agent, 30% Human)                                   │
│  ├─ Meeting scheduling & reminders          [Meeting Agent]             │
│  ├─ Discovery call prep (research)          [Discovery Agent]           │
│  ├─ [HIL] Discovery call execution          [Sales Director]            │
│  ├─ Demo deck customization                 [Discovery Agent]           │
│  └─ ROI calculator generation                [Proposal Agent]            │
│                                                                         │
│  EVALUATION (50% Agent, 50% Human)                                      │
│  ├─ Proposal drafting                       [Proposal Agent]            │
│  ├─ [HIL] Proposal presentation              [Sales Director]           │
│  ├─ Competitor battle card prep              [Discovery Agent]          │
│  ├─ [HIL] Negotiation & pricing              [Sales Director]           │
│  └─ Contract prep & legal review            [Proposal Agent]            │
│                                                                         │
│  DECISION (80% Human, 20% Agent)                                        │
│  ├─ [HIL] Executive sign-off meeting         [Sales Director]           │
│  ├─ [HIL] Final objection handling           [Sales Director]           │
│  └─ Contract finalization tracking          [Proposal Agent]            │
│                                                                         │
│  ONBOARDING (90% Agent, 10% Human)                                      │
│  ├─ Kickoff scheduling                      [Customer Success Agent]    │
│  ├─ Documentation delivery                  [Customer Success Agent]    │
│  ├─ Training session coordination            [Customer Success Agent]    │
│  └─ [HIL] Executive check-in (30/60/90)     [Sales Director]            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Mikä agentti on ylivoimainen missä?

| Sales Funnel Vaihe | Paras Agentti | Perustelu |
|-------------------|---------------|-----------|
| **Top-of-funnel (TOFU)** | Lead Scout Agent | Skaalaa 1,000+ leads/week, ihminen max 50 |
| **Middle-of-funnel (MOFU)** | Discovery Agent | Tuottaa ROI calcit, case studyt 24/7 |
| **Bottom-of-funnel (BOFU)** | Proposal Agent | €29,950 proposals error-free, legal compliance |
| **Post-sale retention** | Customer Success Agent | NPS monitoring, churn signals, proactive support |
| **Investor outreach** | Investor Outreach Agent | 500+ VC/PE database, warm intro paths |
| **Multi-channel sequencing** | Outreach Agent | Koordinoi Email+LinkedIn+Phone perfectly |

---

## 3. Kontrolli & Tarkistuspisteet

### 3.1 Miten varmistamme laadun?

**Phased Deployment Model (Agent Foundry Standard):**

| Phase | Duration | Agent Mode | Human Approval | Checkpoint |
|-------|----------|------------|----------------|------------|
| **Silent Pilot** | 30 days | Observe only | Not required | Daily review of agent recommendations |
| **Advisor Mode** | 60 days | Recommend | Every action requires approval | Director approves before send |
| **Autonomous** | Ongoing | Execute | Exception-based (€10k+ deals) | Weekly pipeline review |

### 3.2 Tarkistuspisteet (Checkpoints)

**Daily (Automated):**
- Email send volume (max 50/day per agent)
- Response rate tracking (alert if <5%)
- Spam complaint monitoring (threshold: 0.1%)
- CRM data quality score (Supabase validation)

**Weekly (Human Review):**
- HIL Director reviews all proposals >€10k
- Pipeline velocity analysis (stuck deals flagged)
- A/B test results review & optimization
- Agent performance leaderboard

**Monthly (Strategic):**
- Win/loss analysis (why deals closed/lost)
- ICP refinement (which segments convert best)
- Agent skill upgrades (new tools, prompts)
- Budget review (€900-1,500/mo agent costs)

### 3.3 Approval Gates

```yaml
approval_gates:
  email_send:
    silent_pilot: false      # No emails sent, log only
    advisor_mode: true       # Every email requires HIL approval
    autonomous: false        # Auto-send unless flagged

  proposal_generation:
    <10k_eur: advisor_mode   # Auto-draft, HIL review before send
    10k-30k_eur: true        # Always require HIL approval
    >30k_eur: true           # Always require HIL + Legal review

  meeting_scheduling:
    discovery: false         # Auto-schedule
    demo: false              # Auto-schedule
    executive: true          # Require HIL coordination

  linkedin_outreach:
    connection_requests: advisor_mode  # Max 20/day, HIL review in Advisor
    inmails: true            # Always require HIL approval (cost: $10/InMail)
```

---

## 4. Orkestrointi & Johtaminen

### 4.1 Miten orkestroimme agentit?

**MCP Hub Coordination Pattern (file: `mcp-hub/server.py`)**

```python
# Agent orchestration via MCP Hub
# Pattern: Sequential + Fan-Out hybrid

SALES_WORKFLOW = {
    "new_lead_intake": {
        "pattern": "sequential",
        "agents": [
            {"agent": "lead-scout", "action": "enrich_lead"},
            {"agent": "lead-scout", "action": "icp_score"},
            {"agent": "outreach", "action": "trigger_sequence_if_qualified"}
        ]
    },

    "discovery_call_prep": {
        "pattern": "fan-out",  # Parallel execution
        "agents": [
            {"agent": "discovery", "action": "research_company"},
            {"agent": "discovery", "action": "generate_meddpicc"},
            {"agent": "proposal", "action": "draft_roi_calculator"}
        ]
    },

    "deal_won": {
        "pattern": "sequential",
        "agents": [
            {"agent": "proposal", "action": "finalize_contract"},
            {"agent": "customer-success", "action": "schedule_kickoff"},
            {"agent": "customer-success", "action": "deliver_docs"}
        ]
    }
}
```

### 4.2 Lifetime Scope Signals (Agent-to-Agent Communication)

**Signal Format:** `[AGENT-ID]:SIGNAL_TYPE:MILESTONE:TIMESTAMP`

**Example Flow:**
```
[LEAD-SCOUT-001]:READY:lead-enriched:2026-01-19T10:00:00Z
  ↓
[OUTREACH-001]:READY:sequence-sent:2026-01-19T10:05:00Z
  ↓
[MEETING-001]:READY:discovery-scheduled:2026-01-19T14:30:00Z
  ↓
[DISCOVERY-001]:READY:meddpicc-complete:2026-01-20T09:00:00Z
  ↓
[PROPOSAL-001]:READY:proposal-drafted:2026-01-21T16:00:00Z
  ↓
[HIL-DIRECTOR]:APPROVAL_REQUIRED:proposal-review:2026-01-21T16:05:00Z
```

### 4.3 Johtamistaidot & -menetelmät

**Sales HIL Director - Required Skills:**

| Skill Category | Specific Skills | Why Critical |
|---------------|-----------------|--------------|
| **Agent Management** | Prompt engineering, YAML config tuning | Optimize agent performance |
| **Data Literacy** | SQL, Supabase queries, pipeline analytics | Identify bottlenecks |
| **Sales Strategy** | ICP definition, vertical positioning | Guide agent targeting |
| **Emotional Intelligence** | Objection handling, executive rapport | High-touch moments |
| **Compliance** | GDPR, CSRD, NIS2 awareness | Avoid legal risks |
| **Storytelling** | Value prop articulation, case studies | Differentiate in crowded market |

**Leadership Methods:**

1. **Weekly Agent Performance Review**
   - Leaderboard: Open rate, reply rate, meeting-booked rate
   - Identify underperforming agents → prompt/tool updates

2. **Monthly ICP Calibration**
   - Analyze win/loss data
   - Refine target account lists (TOP 30 enforcement)

3. **Quarterly Strategic Pivots**
   - Vertical prioritization (construction vs. consulting vs. education)
   - Product-market fit validation (DWS IQ 6 vs. Firehorse positioning)

---

## 5. Skills: Agentit vs. HIL Director

### 5.1 Agent Skills (Defined in YAML)

**Example: Lead Scout Agent Skills**

```yaml
agent:
  id: "lead-scout-001"
  skills:
    data_enrichment:
      - linkedin_scraping
      - company_database_lookup
      - trigger_event_monitoring

    scoring:
      - icp_qualification
      - lead_prioritization
      - segment_classification

    research:
      - competitor_analysis
      - tech_stack_detection
      - recent_news_aggregation

    compliance:
      - gdpr_data_handling
      - spam_law_compliance
      - opt_out_management
```

**Full Agent Skill Matrix:**

| Agent | Core Skills | Tools | Output |
|-------|-------------|-------|--------|
| **Lead Scout** | LinkedIn scraping, ICP scoring, trigger events | Apollo.io API, LinkedIn Sales Nav, Clearbit | Enriched lead records |
| **Outreach** | Email copywriting, A/B testing, send-time optimization | Resend API, Supabase, LinkedIn API | Email sequences, connection requests |
| **Meeting** | Calendar coordination, reminder sequences, no-show prevention | Google Calendar API, Calendly | Scheduled meetings |
| **Discovery** | Company research, MEDDPICC, battle cards | Perplexity API, internal knowledge base | Discovery prep docs |
| **Proposal** | ROI calculations, proposal drafting, contract templating | Pandoc, Supabase templates | Proposals, contracts |
| **Customer Success** | NPS monitoring, churn prediction, upsell signals | Supabase analytics, Slack API | Health scores, alerts |

### 5.2 Sales HIL Director Skills

**Unique Human Skills (AI cannot replicate):**

| Skill Domain | Specific Competencies | Example Application |
|--------------|----------------------|---------------------|
| **Strategic Intuition** | Market timing, competitive positioning | "We should focus on logistics NOW because NIS2 Oct 2024 deadline creates urgency" |
| **Relationship Capital** | Executive network, warm intros, trust | Leveraging an existing transport-side counterparty relationship to unlock a public-sector introduction (Senaatti) |
| **Cultural Fluency** | Nordic business culture, hierarchy navigation | Understanding Finnish decision-making (consensus-based, slow but sticky) |
| **Complex Negotiation** | Multi-stakeholder alignment, creative deal structures | "We'll discount pilot to €19,950 if you commit to €8.5k/mo for 12 months" |
| **Crisis Leadership** | Churn prevention, escalation handling | When a key account threatens to cancel, Director steps in with executive call |
| **Product Vision** | Roadmap influence, customer feedback synthesis | "Construction customers need EN 15978 carbon reporting → prioritize DWS IQ 6 feature" |

**Skill Development Plan for HIL Director:**

```yaml
sales_hil_director:
  technical_skills:
    - yaml_configuration: "Tune agent prompts and guardrails"
    - sql_analytics: "Query Supabase for pipeline insights"
    - mcp_hub_coordination: "Trigger agent workflows via API"

  sales_skills:
    - meddpicc_framework: "Qualify €29,950 pilot deals"
    - value_selling: "Articulate sub-100ms latency ROI"
    - vertical_expertise: "Deep knowledge of construction, logistics, healthcare"

  leadership_skills:
    - agent_team_management: "Optimize 6-agent sales team"
    - data_driven_decisions: "Use metrics to guide strategy"
    - stakeholder_alignment: "Coordinate with Product, Engineering, Legal"
```

---

## 6. Vaaditut Agentit

### 6.1 Core Sales Agents (6 agents)

**Agent Roster:**

| # | Agent Name | ID | Primary Function | Customer Segments |
|---|------------|-----|------------------|-------------------|
| 1 | **Lead Scout Agent** | `lead-scout-001` | Lead enrichment, ICP scoring | All segments |
| 2 | **Outreach Agent** | `outreach-001` | Multi-channel sequences (Email + LinkedIn) | Construction, Consulting, Education pilots |
| 3 | **Meeting Agent** | `meeting-001` | Scheduling, reminders, follow-ups | All segments |
| 4 | **Discovery Agent** | `discovery-001` | Research, MEDDPICC, demo prep | Construction, Consulting, Education pilots |
| 5 | **Proposal Agent** | `proposal-001` | ROI calculators, proposals, contracts | All segments |
| 6 | **Customer Success Agent** | `customer-success-001` | Onboarding, NPS, churn prevention | Firehorse customers |

**Special-Purpose Agents:**

| # | Agent Name | ID | Primary Function | Customer Segment |
|---|------------|-----|------------------|------------------|
| 7 | **Investor Outreach Agent** | `investor-outreach-001` | VC/PE database, warm intro paths, pitch deck versioning | Investor outreach |

### 6.2 Agent Deployment Map by Segment

```
┌─────────────────────────────────────────────────────────────────────────┐
│              AGENT DEPLOYMENT BY CUSTOMER SEGMENT                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🏗️  CONSTRUCTION PILOTS (Target: 2 in Q1/2026)                        │
│  ├─ Lead Scout → Outreach → Meeting → Discovery → Proposal             │
│  └─ Focus: Kela, Senaatti, YIT, SRV                                    │
│                                                                         │
│  💼 CONSULTING PILOTS (Target: 1 in Q1/2026)                            │
│  ├─ Lead Scout → Outreach → Meeting → Discovery → Proposal             │
│  └─ Focus: McKinsey Digital, BCG Platinion (sustainability practice)   │
│                                                                         │
│  🎓 EDUCATION PILOTS (Target: 1 in Q2/2026)                             │
│  ├─ Lead Scout → Outreach → Meeting → Discovery → Proposal             │
│  └─ Focus: Aalto University, University of Helsinki (campus ops)       │
│                                                                         │
│  🔥 FIREHORSE CUSTOMERS (Target: Retain all, upsell 3)                  │
│  ├─ Customer Success → Proposal (for upsells)                          │
│  └─ Focus: NPS monitoring, churn prevention, feature adoption          │
│                                                                         │
│  💰 INVESTOR OUTREACH (Target: €2M raise in H2/2026)                    │
│  ├─ Investor Outreach → Meeting → Proposal                             │
│  └─ Focus: Nordic VCs (Voima, Lifeline), EU climate tech funds         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Tuotekohtaiset Myyntiotteeet

### 7.1 Vaatiiko eri tuotteet eri myyntiotteen?

**Vastaus: KYLLÄ. Jokaisella tuotteella oma value proposition, buyer persona, ja sales cycle.**

### 7.2 Product-Specific Sales Playbooks

#### 7.2.1 DWS IQ 6 (Construction/Industrial)

**Product:** Real-time edge AI for building optimization
**Price:** €29,950 pilot + €8,500/month
**Sales Cycle:** 16 months (long, complex, multi-stakeholder)

| Element | Construction Playbook |
|---------|----------------------|
| **Buyer Persona** | CFO (ROI), CSO (CSRD compliance), Facilities Manager (operations) |
| **Pain Points** | 2-5 min legacy BMS latency, CSRD reporting gaps, 15-25% energy waste |
| **Value Prop** | Sub-100ms climate intelligence → €25-50k/year energy savings + CSRD compliance |
| **Competitive Moat** | NVIDIA Jetson edge AI (vs. Siemens/Schneider cloud latency) |
| **Sales Approach** | Enterprise B2B: Discovery → Demo → ROI calc → Pilot → Production |
| **Key Documents** | 14-slide pitch deck, ROI calculator, NIS2 compliance package (no customer case study is published — none authorized) |
| **Agent Focus** | Discovery Agent (MEDDPICC), Proposal Agent (ROI calc) |

#### 7.2.2 Firehorse CRM

**Product:** Omnichannel sales automation (Email + LinkedIn + Meetings)
**Price:** €500-2,000/month (tiered)
**Sales Cycle:** 3-6 months (mid-market SaaS)

| Element | Firehorse Playbook |
|---------|-------------------|
| **Buyer Persona** | VP Sales, Sales Ops Manager, SDR Team Lead |
| **Pain Points** | Manual prospecting, low reply rates, CRM data rot |
| **Value Prop** | 3x reply rates, 10x SDR productivity, perfect CRM hygiene |
| **Competitive Moat** | Account-based enforcement (no spray-and-pray), Nordic data sovereignty |
| **Sales Approach** | Product-led growth: Free trial → Advisor mode → Autonomous upgrade |
| **Key Documents** | Interactive demo, A/B test results, customer testimonials |
| **Agent Focus** | Outreach Agent (self-demo), Customer Success Agent (retention) |

#### 7.2.3 Agent Foundry (Enterprise Platform)

**Product:** Deploy custom AI agents for industrial operations
**Price:** €500-2,000/month (Starter/Pro), Custom (Enterprise)
**Sales Cycle:** 12-18 months (platform sale, integration-heavy)

| Element | Agent Foundry Playbook |
|---------|------------------------|
| **Buyer Persona** | CTO, VP Engineering, Head of Digital Transformation |
| **Pain Points** | AI pilot hell (never scale), lack of governance, cost overruns |
| **Value Prop** | Production-grade agent framework, EU AI Act compliance, phased rollout |
| **Competitive Moat** | YAML-based config (no-code), MCP Hub orchestration, built-in guardrails |
| **Sales Approach** | Consultative: POC → Silent Pilot → Advisor → Autonomous |
| **Key Documents** | Technical architecture doc, compliance matrix (GDPR/AI Act), ROI model |
| **Agent Focus** | Discovery Agent (technical deep-dive), Proposal Agent (MSA/SLA) |

### 7.3 Vertical-Specific Customizations

**Construction Vertical:**
- Emphasize: EN 15978 carbon reporting, BIM integration, Fit for 55 compliance
- Case studies: none published — no reference customer has authorized one
- Competitive: Siemens, Schneider, Honeywell

**Consulting Vertical:**
- Emphasize: Client billability, sustainability advisory tools, CSRD expertise
- Case studies: McKinsey Digital sustainability practice
- Competitive: Internal builds, Watershed, Persefoni

**Education Vertical:**
- Emphasize: Campus energy savings, student sustainability engagement, grant funding
- Case studies: Aalto University smart campus
- Competitive: Legacy campus management systems

**Investor Vertical:**
- Emphasize: €720k ARR roadmap, 20-moat competitive fortress, Nordic market leadership
- Case studies: none published. Kela and Uber Finland are **dispatch operators** of the licensed transport operation (Traficom-defined role), not software customers.
- Competitive: Other climate tech startups (Normative, Plan A)

---

## 8. YAML Agent Configurations

### 8.1 Lead Scout Agent

```yaml
agent:
  id: "lead-scout-001"
  name: "Lead Scout Agent"
  version: "1.0.0"
  segment: "all"

  model:
    provider: "anthropic"
    name: "claude-sonnet-4.5"
    temperature: 0.3

  system_prompt: |
    You are a B2B lead intelligence specialist for DWS IQ 6.

    Your mission:
    1. Enrich leads with company data (revenue, employee count, tech stack)
    2. Score leads against ICP criteria (CSRD compliance, NIS2 exposure)
    3. Identify trigger events (new CSO hire, sustainability report published)
    4. Classify by segment: Construction, Consulting, Education, Firehorse, Investor

    ICP Criteria (score 0-100):
    - Revenue: €50M+ (CSRD mandatory) = +30 points
    - Employees: 250+ = +20 points
    - Industry: Construction/Logistics/Healthcare = +20 points
    - Trigger event: Sustainability officer hire = +15 points
    - Tech stack: Legacy BMS detected = +15 points

    Threshold: 70+ points = "High Priority", 50-69 = "Medium", <50 = "Low"

    Output format: JSON with enriched data + ICP score + reasoning.

  tools:
    - linkedin_company_lookup
    - apollo_io_enrichment
    - clearbit_reveal
    - news_aggregation
    - tech_stack_detection

  guardrails:
    - max_leads_per_day: 100
    - min_icp_score_for_outreach: 70
    - gdpr_compliant: true
    - no_competitors: true  # Don't scrape Siemens, Schneider employees

  cost_tracking:
    budget_monthly_eur: 150
    alert_at_percentage: 80
    model_costs:
      claude_sonnet_4_5:
        input_per_1m_tokens: 3.00
        output_per_1m_tokens: 15.00

  deployment:
    phase: "advisor"  # Silent Pilot → Advisor → Autonomous
    approval_required: false  # Auto-enrich, HIL reviews scores weekly
```

### 8.2 Outreach Agent

```yaml
agent:
  id: "outreach-001"
  name: "Outreach Agent"
  version: "1.0.0"
  segment: "construction,consulting,education"

  model:
    provider: "groq"
    name: "llama-3.1-70b-versatile"
    temperature: 0.7  # Higher temp for creative email copy

  system_prompt: |
    You are a B2B sales outreach specialist for DWS IQ 6.

    Your mission:
    1. Execute 7-touch email sequences (Cold 1 → Cold 2 → Cold 3 → Breakup)
    2. Personalize based on lead data (company, role, recent news)
    3. A/B test subject lines, CTAs, send times
    4. Coordinate LinkedIn connection requests + InMails
    5. Track engagement (opens, clicks, replies) and optimize

    Email best practices:
    - Subject line: 3-7 words, question format works best
    - Body: 50-100 words max, mobile-friendly
    - CTA: Single, clear ask (book 15min call)
    - Personalization: Reference recent company news or pain point
    - Compliance: Include unsubscribe link (GDPR), no spam keywords

    Example Subject Lines (A/B test):
    - "Sub-100ms building intelligence?"
    - "CSRD compliance for [Company]?"
    - "15% energy savings at [reference site]" (use only once a real, authorized reference exists)

    LinkedIn Rules:
    - Max 20 connection requests/day
    - Personalized note (150 chars): "Hi [Name], saw your CSRD initiative..."
    - Follow up 3 days after connection accepted

    Spam Prevention:
    - Max 50 emails/day
    - Stop sequence if spam complaint
    - Respect opt-outs immediately

  tools:
    - resend_email_api
    - linkedin_api
    - supabase_crm
    - perplexity_research  # For personalization research

  guardrails:
    - max_emails_per_day: 50
    - max_linkedin_connections_per_day: 20
    - stop_on_spam_complaint: true
    - respect_optout: true
    - never_send_weekends: true
    - send_time_optimization: true  # 9-11am CET highest open rates

  cost_tracking:
    budget_monthly_eur: 200
    alert_at_percentage: 80
    costs:
      resend_api: 0.10_per_1000_emails
      linkedin_inmails: 10.00_per_inmail

  deployment:
    phase: "advisor"  # Requires HIL approval for first 60 days
    approval_required: true  # Every email reviewed before send
```

### 8.3 Discovery Agent

```yaml
agent:
  id: "discovery-001"
  name: "Discovery Agent"
  version: "1.0.0"
  segment: "construction,consulting,education"

  model:
    provider: "anthropic"
    name: "claude-sonnet-4.5"
    temperature: 0.2  # Low temp for accurate research

  system_prompt: |
    You are a sales engineer and discovery specialist for DWS IQ 6.

    Your mission:
    1. Research prospect company before discovery call (financials, tech stack, competitors)
    2. Generate MEDDPICC qualification framework
    3. Prepare demo customization (vertical-specific use cases)
    4. Create competitive battle cards (vs. Siemens, Schneider, Honeywell)
    5. Draft post-call summary and next steps

    MEDDPICC Framework:
    - Metrics: What are their energy cost baselines? Emissions targets?
    - Economic Buyer: Who owns the budget? (CFO, CSO, Facilities Director)
    - Decision Criteria: What matters most? (Latency, compliance, ROI, EU sovereignty)
    - Decision Process: How many stakeholders? Timeline?
    - Identify Pain: What's broken today? (Legacy BMS latency, CSRD gaps)
    - Champion: Who internally will advocate for DWS IQ 6?
    - Paper Process: Procurement cycles, framework agreements?

    Competitive Intelligence:
    - Siemens Desigo CC: 2-5 min cloud latency, €3-6M entry cost → We win on speed + price
    - Schneider EcoStruxure: Vendor lock-in, complex integration → We win on simplicity
    - Honeywell Forge: US data centers, GDPR concerns → We win on EU sovereignty

    Demo Customization:
    - Construction: Show BIM integration, EN 15978 carbon tracking
    - Consulting: Show client dashboard, CSRD report automation
    - Education: Show campus energy map, student engagement dashboard

    Output: Structured JSON for HIL Director review before call.

  tools:
    - perplexity_research
    - company_financials_api
    - tech_stack_detection
    - news_aggregation
    - internal_knowledge_base  # Case studies, battle cards, ROI models

  guardrails:
    - verify_facts: true  # Never hallucinate company data
    - cite_sources: true  # Link to LinkedIn, news articles
    - flag_low_confidence: true  # Alert HIL if research incomplete

  cost_tracking:
    budget_monthly_eur: 100
    alert_at_percentage: 80

  deployment:
    phase: "advisor"
    approval_required: false  # Auto-generate research, HIL reviews before call
```

### 8.4 Proposal Agent

```yaml
agent:
  id: "proposal-001"
  name: "Proposal Agent"
  version: "1.0.0"
  segment: "all"

  model:
    provider: "anthropic"
    name: "claude-sonnet-4.5"
    temperature: 0.1  # Very low temp for legal accuracy

  system_prompt: |
    You are a proposal and contract specialist for DWS IQ 6.

    Your mission:
    1. Generate ROI calculators (Excel/Google Sheets + 1-page summary)
    2. Draft proposals (2-4 pages: Challenge, Solution, Results, Pricing)
    3. Prepare contracts (MSA, DPA, SLA) using legal-approved templates
    4. Track proposal status (sent, under review, negotiation, accepted/rejected)
    5. Alert HIL Director on pricing negotiations

    ROI Calculator Inputs:
    - Current energy costs (€/year)
    - Building sqm, occupancy hours
    - Legacy BMS latency (minutes)
    - CSRD compliance status (yes/no)

    ROI Calculator Outputs:
    - Energy savings: 15-25% reduction = €X/year
    - CSRD automation value: €15-30k/year (FTE savings)
    - Equipment failure prevention: €50-200k avoided costs
    - Payback period: 6-12 months
    - 5-year NPV: €X

    Proposal Template:
    1. Executive Summary (1 paragraph)
    2. Challenge (prospect's pain points)
    3. Solution (DWS IQ 6 deployment plan)
    4. Results (pilot metrics, once a reference customer authorizes publication)
    5. Investment (€29,950 pilot + €8,500/mo)
    6. Timeline (12-week implementation)
    7. Next Steps (sign by [date], kickoff [date])

    Pricing Tiers:
    - Starter Pilot: €29,950 (1 building, 3 months)
    - Production: €8,500/month (1-5 buildings)
    - Enterprise: Custom (5+ buildings, SLA, dedicated support)

    Approval Gates:
    - <€10k: Auto-draft, HIL review
    - €10k-€30k: Requires HIL approval
    - >€30k: Requires HIL + Legal review

  tools:
    - pandoc_pdf_generation
    - excel_formula_engine
    - supabase_templates  # MSA, DPA, SLA templates
    - docusign_api  # For contract signing

  guardrails:
    - legal_template_only: true  # Never deviate from approved MSA/DPA
    - pricing_within_bounds: true  # Min €8,500/mo, max 20% discount
    - approval_threshold_eur: 10000
    - never_share_competitor_data: true

  cost_tracking:
    budget_monthly_eur: 50
    alert_at_percentage: 80

  deployment:
    phase: "autonomous"  # Can auto-draft, but approval gates enforce HIL review
    approval_required: conditional  # Based on deal size
```

### 8.5 Customer Success Agent

```yaml
agent:
  id: "customer-success-001"
  name: "Customer Success Agent"
  version: "1.0.0"
  segment: "firehorse,post-sale"

  model:
    provider: "groq"
    name: "llama-3.1-70b-versatile"
    temperature: 0.5

  system_prompt: |
    You are a customer success manager for Firehorse CRM customers.

    Your mission:
    1. Monitor NPS scores (quarterly surveys)
    2. Detect churn signals (login frequency, feature adoption, support tickets)
    3. Trigger proactive outreach (30/60/90 day check-ins)
    4. Identify upsell opportunities (Advisor → Autonomous upgrade)
    5. Coordinate onboarding (kickoff, training, documentation delivery)

    Churn Signals:
    - No login for 14+ days → Send re-engagement email
    - Support ticket sentiment: negative → Alert HIL Director
    - Feature adoption <30% after 60 days → Offer training session
    - NPS <7 → Immediate HIL escalation

    Upsell Triggers:
    - Hitting plan limits (3 agents on Starter → suggest Pro)
    - High engagement (daily usage) → Suggest Autonomous upgrade
    - Positive NPS (9-10) → Request case study, referral

    Onboarding Checklist:
    - Day 0: Kickoff call scheduled (HIL Director + customer exec)
    - Day 1-7: Training sessions (product walkthrough)
    - Day 7: Documentation delivered (admin manual, API docs)
    - Day 30: Check-in (how's it going? any blockers?)
    - Day 60: Feature adoption review
    - Day 90: NPS survey + renewal discussion

    Output: Health score (0-100), churn risk (low/medium/high), recommended actions.

  tools:
    - supabase_analytics  # Login frequency, feature usage
    - nps_survey_api
    - slack_api  # Alert HIL Director
    - calendly_api  # Schedule check-ins

  guardrails:
    - escalate_churn_risk_high: true  # Alert HIL immediately
    - max_automated_emails: 10_per_month_per_customer
    - never_push_upsell_if_churn_risk: true

  cost_tracking:
    budget_monthly_eur: 100
    alert_at_percentage: 80

  deployment:
    phase: "autonomous"
    approval_required: false  # Auto-monitor, auto-alert HIL on issues
```

### 8.6 Investor Outreach Agent

```yaml
agent:
  id: "investor-outreach-001"
  name: "Investor Outreach Agent"
  version: "1.0.0"
  segment: "investor"

  model:
    provider: "anthropic"
    name: "claude-sonnet-4.5"
    temperature: 0.6

  system_prompt: |
    You are an investor relations specialist for DWS IQ 6 fundraising.

    Your mission:
    1. Maintain VC/PE database (500+ Nordic/EU climate tech investors)
    2. Identify warm intro paths (LinkedIn 2nd degree connections)
    3. Customize pitch deck versions (Seed, Series A, strategic investors)
    4. Track outreach status (intro requested, meeting scheduled, pass)
    5. Prepare investor FAQs (financials, market size, competitive moat)

    Investor Segmentation:
    - Nordic VCs: Voima Ventures, Lifeline Ventures, Inventure
    - EU Climate Tech: Extantia Capital, ETF Partners, 2150
    - Corporate VCs: Siemens Next47, Schneider Electric Ventures
    - Family Offices: Nordic sustainable investing focus

    Warm Intro Strategy:
    - Check LinkedIn for shared connections (founder network, advisors)
    - Prioritize 1st degree intros > cold emails
    - No published case study exists; do not cite Kela — it is a dispatch operator of the transport business, not a software customer

    Pitch Deck Customization:
    - Seed ($1-2M): Emphasize market urgency (EPBD 2027, CSRD), team, traction
    - Series A ($5-10M): Emphasize €720k ARR roadmap, 20-moat, unit economics
    - Strategic: Emphasize partnership opportunities (channel, integration)

    Investor FAQs:
    - Market size: €127B TAM (EU smart building market)
    - Traction: €59,900 of contracted Q1/2026 enterprise pilots (two at €29,950 each) plus four smaller landed accounts → €60k MRR roadmap. Kela and Uber Finland are dispatch operators, not software customers.
    - Competition: Siemens/Schneider = €3-6M entry barrier, we're €29,950 pilot
    - Defensibility: 20-moat framework (NVIDIA Jetson, EU data sovereignty, edge AI)
    - Exit: Strategic acquirer (Siemens, Schneider, Honeywell) or IPO (2030+)

    Output: Investor CRM updates, meeting prep docs, pitch deck versions.

  tools:
    - linkedin_api
    - crunchbase_api
    - pitch_deck_versioning  # Auto-generate slide variations
    - supabase_investor_crm

  guardrails:
    - never_cold_email_tier1_vcs: true  # Always seek warm intro
    - max_outreach_per_week: 10  # Quality > quantity
    - verify_investor_focus: true  # Only climate tech, B2B SaaS, industrial IoT
    - nda_compliance: true  # Never share confidential metrics publicly

  cost_tracking:
    budget_monthly_eur: 100
    alert_at_percentage: 80

  deployment:
    phase: "advisor"
    approval_required: true  # Every investor outreach reviewed by HIL Director
```

---

## 9. Implementation Roadmap

### 9.1 Phase 1: Foundations (Weeks 1-4)

**Goal:** Deploy Lead Scout + Outreach agents in Silent Pilot mode

| Week | Milestone | Owner | Deliverable |
|------|-----------|-------|-------------|
| 1 | Agent infrastructure setup | Engineering | MCP Hub deployed, Supabase tables created |
| 2 | Lead Scout agent YAML config | Sales HIL Director | `lead-scout-001.yaml` finalized |
| 3 | Outreach agent YAML config | Sales HIL Director | `outreach-001.yaml` finalized |
| 4 | Silent Pilot launch | Sales HIL Director | 30-day observation log started |

**Success Metrics:**
- 100 leads enriched/week (Lead Scout)
- 50 emails drafted/week (Outreach, not sent yet)
- 0 errors, 0 spam complaints

### 9.2 Phase 2: Advisor Mode (Weeks 5-12)

**Goal:** Activate Outreach + Discovery + Meeting agents with HIL approval

| Week | Milestone | Owner | Deliverable |
|------|-----------|-------|-------------|
| 5 | Advance to Advisor mode | Sales HIL Director | Approval workflow configured |
| 6-8 | Discovery agent deployment | Engineering | `discovery-001.yaml` live |
| 9-10 | Meeting agent deployment | Engineering | `meeting-001.yaml` live |
| 11-12 | First agent-sourced meeting | Sales HIL Director | 1 discovery call from agent outreach |

**Success Metrics:**
- 10% reply rate on outreach emails
- 5 meetings scheduled (agent-sourced)
- 1 demo delivered

### 9.3 Phase 3: Autonomous (Weeks 13-24)

**Goal:** Full agent orchestration, 2 pilots signed

| Week | Milestone | Owner | Deliverable |
|------|-----------|-------|-------------|
| 13 | Proposal agent deployment | Engineering | `proposal-001.yaml` live |
| 14 | Customer Success agent deployment | Engineering | `customer-success-001.yaml` live |
| 15 | Investor Outreach agent deployment | Sales HIL Director | `investor-outreach-001.yaml` live |
| 16-20 | Autonomous mode for Outreach + Meeting | Sales HIL Director | Approval gates configured |
| 21-24 | First agent-sourced pilot signed | Sales HIL Director | €29,950 pilot contract |

**Success Metrics:**
- 2 pilots signed (€59,900 revenue)
- 8-12 demos delivered
- €15k MRR growth target

### 9.4 Phase 4: Scale (Months 7-12)

**Goal:** €60k MRR with agent-led sales

| Month | Milestone | Target |
|-------|-----------|--------|
| 7-9 | Optimize agent performance (A/B testing) | 15% reply rate, 8% meeting-booked rate |
| 10-12 | Deploy vertical-specific agent variations | Construction, Consulting, Education playbooks live |
| 12 | Achieve €60k MRR | 7 production customers @ €8.5k/mo |

**Success Metrics:**
- €60k MRR
- 1:6 Human-to-Agent ratio maintained
- <€1,500/mo agent operational costs

---

## 10. Cost Analysis

### 10.1 Agent Operating Costs

| Agent | Monthly Cost | Breakdown |
|-------|-------------|-----------|
| Lead Scout | €150 | Claude API (100k tokens/day) |
| Outreach | €200 | Groq API + Resend (2k emails/mo) + LinkedIn (20 InMails/mo) |
| Meeting | €50 | Calendly API, Google Calendar |
| Discovery | €100 | Claude API + Perplexity (research) |
| Proposal | €50 | Claude API + Pandoc |
| Customer Success | €100 | Groq API + Slack alerts |
| Investor Outreach | €100 | Claude API + Crunchbase |
| **TOTAL** | **€750-900/mo** | vs. €25k-35k/mo for 3 human SDRs |

**ROI:**
- Cost savings: 96% (€750 vs. €25k)
- Output: 6x more leads processed
- Quality: Higher (no "forgot to follow up")

### 10.2 Human Cost (Sales HIL Director)

| Role | FTE | Monthly Cost | Responsibilities |
|------|-----|--------------|------------------|
| Sales HIL Director | 1.0 | €8,000-12,000 | Agent orchestration, high-touch deals, strategic accounts |

**Total Sales Cost:**
- Agents: €900/mo
- Human: €10,000/mo
- **Combined: €10,900/mo** (vs. €35k/mo traditional SDR team)

---

## 11. Success Metrics & KPIs

### 11.1 Agent Performance Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Lead Enrichment Rate** | 100 leads/week | Supabase `firehorse_leads` table growth |
| **ICP Score Accuracy** | 80%+ qualified | Win rate on >70 ICP score leads |
| **Email Reply Rate** | 10-15% | Resend analytics |
| **Meeting-Booked Rate** | 5-8% | Calendly conversions |
| **Demo-to-Pilot Rate** | 25% | 8 demos → 2 pilots |
| **Pilot-to-Production Rate** | 50% | 2 pilots → 1 production |
| **Customer Health Score** | 75+ (low churn risk) | Supabase analytics |
| **Agent Cost per Deal** | <€500 | Agent costs / deals closed |

### 11.2 Human (HIL Director) Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **High-Touch Deal Close Rate** | 30% | Deals >€10k requiring negotiation |
| **Executive Relationship NPS** | 9+ | Quarterly surveys with C-level buyers |
| **Agent Optimization Cycles** | 2/month | YAML config updates, prompt tuning |
| **Time Spent on Admin** | <10% | More time on strategy, less on CRM hygiene |

### 11.3 Business Outcomes

| Metric | Q1/2026 Target | Q4/2026 Target |
|--------|----------------|----------------|
| **MRR** | €15k | €60k |
| **New Pilots Signed** | 2 | 8 |
| **Production Customers** | 1 | 7 |
| **Investor Meetings** | 5 | 20 |
| **Customer Churn Rate** | <5% | <5% |

---

## 12. Risk Mitigation

### 12.1 Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Agent sends spam** | Medium | High (brand damage) | Advisor mode for 60 days, max 50 emails/day, spam monitoring |
| **Low reply rates** | Medium | Medium (wasted effort) | A/B testing, ICP refinement, warm intros via HIL |
| **Agent hallucinates data** | Low | High (legal risk) | Fact verification, cite sources, HIL review before send |
| **GDPR violation** | Low | Critical (fines) | Opt-out enforcement, EU data residency, legal review |
| **Agent cost overruns** | Low | Low (budget impact) | Monthly budget alerts at 80%, hard caps on API calls |
| **Over-reliance on agents** | Medium | Medium (skill atrophy) | HIL Director maintains high-touch deal skills |

### 12.2 Compliance Checklist

- [ ] **GDPR:** Opt-out links in all emails, data retention policies
- [ ] **CAN-SPAM:** Unsubscribe mechanism, physical address in footer
- [ ] **LinkedIn ToS:** Max 20 connection requests/day, no scraping
- [ ] **EU AI Act:** Transparency (recipients know it's AI), human oversight (Advisor mode)
- [ ] **NIS2:** Secure API keys (Google Secret Manager), audit logs

---

## 13. Appendix: Reference Documents

### 13.1 DWS Internal Docs

| Document | Path | Purpose |
|----------|------|---------|
| **DWS Document Standard** | `DWS_DOCUMENT_STANDARD.md` | Versioning, naming conventions |
| **Agent Foundry Product Doc** | `Store/PRODUCT_AGENT_FOUNDRY.md` | Agent framework, YAML templates |
| **AGENTS.md** | `AGENTS.md` | Master agent index, MCP Hub patterns |
| **Enterprise Sales Blueprint** | `sales-outreach/enterprise-sales.md` | 13-document sales stack |
| **Firehorse Sales Pipeline** | `src/firehorse/sales-pipeline.ts` | Meeting & proposal tracking code |
| **MCP Hub Orchestration** | `mcp-hub/server.py` | Workflow coordination logic |

### 13.2 External Resources

| Resource | URL | Purpose |
|----------|-----|---------|
| **MEDDPICC Framework** | [meddpicc.com](https://www.meddpicc.com) | Sales qualification methodology |
| **Apollo.io API** | [apollo.io/api](https://www.apollo.io/api) | Lead enrichment |
| **Resend Email API** | [resend.com/docs](https://resend.com/docs) | Transactional email |
| **LinkedIn Sales Navigator** | [linkedin.com/sales](https://www.linkedin.com/sales) | B2B prospecting |
| **EU AI Act Compliance** | [digital-strategy.ec.europa.eu](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) | Regulatory guidance |

---

## 14. Glossary / Sanasto

| Term (EN) | Termi (FI) | Definition |
|-----------|------------|------------|
| **Human-in-Loop (HIL)** | Ihminen silmukassa | Human oversight in AI workflows, especially for high-stakes decisions |
| **Agent** | Agentti | Autonomous AI software that performs tasks (email, research, scheduling) |
| **ICP** | Ideaaliasiakasprofiili | Ideal Customer Profile - target customer characteristics |
| **MEDDPICC** | MEDDPICC | Sales qualification framework (Metrics, Economic Buyer, Decision Criteria, etc.) |
| **MRR** | Kuukausittainen toistuva liikevaihto | Monthly Recurring Revenue |
| **Churn** | Asiakaspoistuma | Customer cancellation rate |
| **NPS** | Net Promoter Score | Customer satisfaction metric (-100 to +100) |
| **Sales Funnel** | Myyntisuppilo | Customer journey stages (Awareness → Interest → Decision) |
| **Pilot** | Pilotti | Trial deployment (€29,950 for 3 months) |
| **Production** | Tuotantokäyttö | Full deployment (€8,500/month) |

---

**Document Version:** 1.0
**Last Updated:** January 19, 2026
**Owner:** Lifetime Oy - Sales & Product
**© 2026 Lifetime Oy. All rights reserved.**

---

## Quick Reference / Pikaohje

### For Sales HIL Director

**Daily Tasks:**
```bash
# Check agent status
cd .workflows/agents
node coordinator.cjs status

# Review overnight agent activity
node coordinator.cjs signals | grep $(date +%Y-%m-%d)

# Approve pending emails (Advisor mode)
psql $DATABASE_URL -c "SELECT * FROM firehorse_events WHERE status='pending_approval';"
```

**Weekly Review:**
```bash
# Pipeline analytics
psql $DATABASE_URL -f scripts/weekly_sales_report.sql

# Agent performance leaderboard
python scripts/agent_performance.py --week=$(date +%U)
```

**Monthly Optimization:**
```bash
# A/B test results
python scripts/ab_test_analysis.py --month=$(date +%m)

# Update agent configs based on learnings
vim AgentFoundry/configs/production/outreach-001.yaml
```

### For Engineering

**Deploy new agent:**
```bash
# 1. Create YAML config
cp AgentFoundry/configs/templates/agent-template.yaml \
   AgentFoundry/configs/production/new-agent.yaml

# 2. Register with MCP Hub
python scripts/register_agent.py --config=production/new-agent.yaml

# 3. Start in Silent Pilot
python scripts/deploy_agent.py --agent=new-agent --mode=silent_pilot

# 4. Monitor logs
tail -f logs/agents/new-agent.log
```

**Emergency shutdown:**
```bash
# Stop runaway agent
python scripts/kill_agent.py --agent=outreach-001 --reason="spam_detected"
```

---

**END OF DOCUMENT**

# DWS Team Agent Suite
**Internal AI Agents for DWS6 Development & Operations**

---

## Purpose

5 coordinated AI agents to **design, build, deploy, secure, and maintain** the DWS6 solution.

These agents are **internal tools** for Lifetime Oy team, distinct from the customer-facing agents (Customer Satisfaction, Viability, Deal Flow, etc.).

**Operating model:**
- Agents work as a "virtual team" alongside human developers
- Each agent owns specific domains (architecture, code, infrastructure, security, reporting)
- Agents maintain documentation, update GitHub Projects, and generate weekly reports
- Humans make final decisions; agents recommend and automate routine tasks

---

## Proposed Team Agents

**7 coordinated internal AI agents** (5 development + 2 sales):

### Development Agents

### 1. Architect Agent 🏗️

**Role:** System designer and technical decision-maker

**Responsibilities:**
- Designs overall DWS6 system architecture across edge (NVIDIA Jetson), cloud (Google Cloud Run + AWS), and data layers (Supabase + S3)
- Maintains `ARCHITECTURE_SUMMARY.md` and ensures all industry-specific agents (Construction, Manufacturing, Energy) follow consistent patterns
- Reviews proposed changes for architectural impact (e.g., "Will adding this feature break edge AI compatibility?")
- Creates diagrams (system diagrams, data flow diagrams, deployment diagrams)
- Tracks technical debt and proposes refactoring priorities

**Tools & Access:**
- Read/write: `docs/architecture/`, `AgentFoundry/configs/`
- Read-only: All codebase
- External: Draw.io or Mermaid for diagrams

**Weekly deliverables:**
- Architecture decision records (ADRs) for major changes
- Updated system diagrams (if architecture changed)
- Technical debt log (prioritized backlog)

**Example tasks:**
- "Design data flow for edge AI → cloud sync (offline-first architecture)"
- "Evaluate whether to use PostgreSQL or MongoDB for customer data"
- "Create deployment diagram showing Cloud Run + Jetson + Supabase interactions"

---

### 2. Builder Agent 🛠️

**Role:** Code generator and implementation specialist

**Responsibilities:**
- Implements agent logic and integrations based on Architect Agent's designs
- Generates code stubs, tests, and deployment scripts for Corporate Cloud Agents and SiteSense
- Writes agent configuration files (YAML) based on industry requirements
- Creates FastAPI endpoints for Groq API router
- Implements data models (Supabase schemas, Pydantic models)
- Writes unit tests and integration tests

**Tools & Access:**
- Read/write: `AgentFoundry/`, `CloudAgents/`, `SiteSense/`
- Code generation: GitHub Copilot, Cursor.ai integration
- Testing: pytest, coverage.py

**Weekly deliverables:**
- New agent implementations (YAML configs + Python code)
- Test coverage reports (target: 80%)
- Code review summaries (what was merged, what's pending)

**Example tasks:**
- "Implement Manufacturing Energy Optimization Agent (YAML config + Groq API integration)"
- "Create Pydantic model for customer onboarding workflow"
- "Write integration test for Customer Satisfaction Agent → Slack notification flow"

---

### 3. DevOps Agent ⚙️

**Role:** Infrastructure automation and reliability engineer

**Responsibilities:**
- Manages CI/CD pipelines (GitHub Actions for auto-deploy to Cloud Run)
- Provisions infrastructure as code (Terraform or gcloud CLI scripts)
- Maintains deployment pipelines for each industry vertical + environment (dev/staging/prod)
- Sets up monitoring and alerting (Sentry for errors, Uptime Robot for availability, Cloud Monitoring for costs)
- Manages secrets (Google Secret Manager, environment variables)
- Tracks infrastructure costs and optimizes resource usage

**Tools & Access:**
- Read/write: `.github/workflows/`, `infrastructure/`, `docker/`
- Cloud platforms: Google Cloud Console, AWS Console, Groq API dashboard
- Monitoring: Sentry, Grafana, Cloud Monitoring

**Weekly deliverables:**
- Infrastructure cost report (actual vs budget)
- Uptime report (99%+ target)
- CI/CD pipeline health (build success rate, deployment frequency)

**Example tasks:**
- "Set up GitHub Actions workflow for auto-deploy to Cloud Run on main branch push"
- "Create Terraform script to provision Supabase + Cloud Run + Secret Manager"
- "Configure Sentry alerts for errors >10/hour"
- "Optimize Cloud Run instance count (scale to zero when idle)"

---

### 4. Security & Compliance Agent 🔒

**Role:** Security hardening and regulatory compliance specialist

**Responsibilities:**
- Tracks ISO 27001, GDPR, and EU data residency requirements
- Scans configs and code for security vulnerabilities (secrets in code, SQL injection, XSS)
- Recommends hardening measures (Cloud Run VPC, encryption at rest, least-privilege IAM)
- Maintains a "security checklist" per deployment (dev/staging/prod)
- Audits agent permissions (which agents can write to CRM? Which can execute financial transactions?)
- Creates incident response playbooks (what to do if data breach occurs)

**Tools & Access:**
- Read-only: All codebase, infrastructure configs
- Security scanning: Trivy (container scanning), Bandit (Python security linting), OWASP ZAP (web app scanning)
- Compliance: GDPR data mapping tool, ISO 27001 checklist

**Weekly deliverables:**
- Security scan report (vulnerabilities found + remediation status)
- Compliance checklist (GDPR, ISO 27001) with % completion
- Incident log (security incidents + resolution)

**Example tasks:**
- "Scan all Docker images for critical CVEs (Common Vulnerabilities and Exposures)"
- "Audit Cloud Run IAM roles (ensure least-privilege access)"
- "Create GDPR data deletion workflow (customer right to be forgotten)"
- "Review agent permissions: should Viability Agent have CRM write access?"

---

### 5. Product & Reporting Agent 📊

**Role:** Progress tracker and communication specialist

**Responsibilities:**
- Reads GitHub Projects (Kanban boards for each roadmap)
- Compiles weekly progress into `docs/Reports/en/` and `docs/Reports/fi/`
- Calculates MVP completion % (Done tasks / Total tasks × 100)
- Highlights risks for investors, partners, and Metropolia supervisor
- Generates customer-facing reports (NPS scores, uptime, feature releases)
- Maintains product roadmap (updates based on customer feedback and technical feasibility)

**Tools & Access:**
- Read: All GitHub Projects, cost dashboards, customer feedback (Slack, Typeform)
- Write: `docs/Reports/`, `docs/roadmaps/`
- Analytics: Google Sheets (cost tracking, customer metrics)

**Weekly deliverables:**
- Weekly report (English + Finnish) using template
- Updated roadmap % completion
- Customer insights summary (feature requests, pain points)

**Example tasks:**
- "Generate Week 01 report (Dec 2025) for investors"
- "Calculate DWS6 Construction V1 completion % (25 done / 43 total = 58%)"
- "Summarize customer feedback from this week's interviews"
- "Identify top 3 risks based on GitHub issue labels (blockers, bugs, missed deadlines)"

---

### Sales & Market Intelligence Agents

### 6. Market Signal Agent 📈

**Role:** Market intelligence and demand detection

**Responsibilities:**
- Monitors Google Merchant Server analytics (impressions, clicks, conversions)
- Tracks search queries (what terms bring people to products)
- Identifies high-interest, low-conversion products (opportunities)
- Detects pricing sensitivity (do clicks drop at certain price points?)
- Compares competitor products (what features do they emphasize?)
- Generates weekly market signal reports

**Tools & Access:**
- Read: Google Merchant Center API, Google Search Console, Google Analytics
- Read: Competitor websites (web scraping for feature comparison)
- Write: `docs/market-signals/` (weekly reports)

**Weekly deliverables:**
- Market signal report (top searched terms, conversion funnel analysis)
- Product opportunity matrix (what to build next based on market demand)
- Pricing recommendations (test price points based on click patterns)
- Messaging insights (what keywords/phrases resonate)

**Example tasks:**
- "Analyze Google Merchant data: which products have >1K impressions but 0 conversions?"
- "Track search query trends: what construction AI terms are growing >20% MoM?"
- "Compare DWS6 vs Atlassian Rovo product pages: what messaging do they emphasize?"

**Integration with development:**
- High-interest products → Backlog (validate with landing page)
- Pricing experiments → A/B tests on product pages
- Market insights → Weekly reports (inform roadmap prioritization)

---

### 7. Product Page Generator Agent 🛒

**Role:** Dynamic sales page creation and updating

**Responsibilities:**
- Reads GitHub Projects (development status: MVP 35% → 50% → 100%)
- Reads roadmaps (what's coming: Alpha, V1 features)
- Generates product pages for onelifetime.world and dws10.com
- Updates pages automatically when:
  - Development milestones reached (MVP → Alpha transition)
  - Pricing experiments launched (A/B test €999 vs €1,499)
  - New customer testimonials added
  - Market signals suggest messaging changes
- Deploys via static site generator (Hugo) + Netlify

**Tools & Access:**
- Read: GitHub Projects API, roadmap files, customer database (testimonials)
- Write: Hugo markdown files (product pages)
- Deploy: Git push → Netlify auto-deploy

**Weekly deliverables:**
- Updated product pages (reflect latest development %)
- New landing pages (for demand validation experiments)
- A/B test variations (pricing, messaging experiments)

**Example tasks:**
- "Update DWS6 Construction page: MVP 35% → 42% complete (auto from GitHub)"
- "Create landing page for 'Embodied Carbon Agent' (validate demand before building)"
- "Deploy A/B test: €2,000 vs €999 pricing (50/50 traffic split)"

**Integration with development:**
- GitHub Projects update → Product page auto-updates (transparency)
- Roadmap milestone → New feature listed on product page
- Customer testimonial → Auto-added to social proof section

---

## Agent Coordination & Workflows

### Weekly Cycle (Fridays)

1. **Market Signal Agent** generates market insights (Google Merchant data, search trends)
2. **Product Page Generator Agent** updates product pages (development %, pricing changes)
3. **DevOps Agent** provides cost data + infrastructure metrics
4. **Security & Compliance Agent** provides security scan results
5. **Builder Agent** provides code review summary
6. **Architect Agent** provides architecture change log
7. **Product & Reporting Agent** compiles final report (includes market signals), publishes to `docs/Reports/`

### Monthly Cycle (Last Friday)

1. **Market Signal Agent** generates monthly market report (trend analysis, competitor moves)
2. **Product Page Generator Agent** reviews conversion funnel (where do visitors drop off?)
3. **Product & Reporting Agent** generates monthly investor update (includes NPS, ARR, burn rate, market insights)
4. **Architect Agent** reviews technical debt backlog, proposes Q+1 priorities
5. **Security & Compliance Agent** runs full compliance audit (GDPR, ISO 27001)
6. **DevOps Agent** reviews cloud costs, optimizes for next month

### Ad-Hoc Coordination

**Example 1: New agent deployment (e.g., Manufacturing Energy Optimization Agent)**

1. **Architect Agent** designs data model and API contract
2. **Builder Agent** implements code + tests
3. **DevOps Agent** sets up CI/CD for deployment
4. **Security & Compliance Agent** reviews for security issues
5. **Product Page Generator Agent** creates product page, deploys to onelifetime.world
6. **Product & Reporting Agent** updates roadmap, notifies customers

**Example 2: Market signal triggers new product (e.g., Embodied Carbon Agent)**

1. **Market Signal Agent** detects high search volume (340/month for "embodied carbon tracking")
2. **Market Signal Agent** notifies Product & Reporting Agent (adds to weekly report)
3. **Product Page Generator Agent** creates landing page for demand validation
4. **DevOps Agent** deploys landing page to onelifetime.world/embodied-carbon-agent
5. **Market Signal Agent** monitors waitlist signups (target: 20 in 2 weeks)
6. If validated → **Architect Agent** designs, **Builder Agent** implements
7. If not validated → **Product Page Generator Agent** archives landing page, **Market Signal Agent** investigates why

---

## Implementation Strategy

### Phase 1: Manual (MVP Phase - Month 1-3)

**Humans play all 5 roles**, but use agent-like thinking:
- Architect: Risto maintains architecture docs manually
- Builder: Risto writes code with GitHub Copilot
- DevOps: Risto deploys manually via gcloud CLI
- Security: Risto runs Trivy scans manually
- Product: Risto writes weekly reports manually

**Goal:** Establish workflows and templates

### Phase 2: Semi-Automated (Alpha Phase - Month 4-6)

**Automate routine tasks:**
- DevOps Agent: GitHub Actions auto-deploys to Cloud Run
- Security Agent: Trivy scans run on every PR
- Product Agent: Cost data auto-populated in weekly report template (Risto fills in narrative)

**Tools:**
- GitHub Actions (CI/CD automation)
- Sentry webhooks (auto-create GitHub issues for errors)
- Google Sheets API (auto-fetch cost data)

### Phase 3: AI-Assisted (V1 Phase - Month 7-12)

**Use Claude/Groq agents for drafting:**
- Product Agent: Claude generates draft weekly report (Risto reviews and edits)
- Architect Agent: Claude suggests architecture improvements based on codebase analysis
- Builder Agent: Claude generates boilerplate code (Risto reviews)

**Tools:**
- Claude API (for text generation)
- Groq API (for fast code generation)
- LlamaStack (for multi-agent orchestration)

### Phase 4: Autonomous (Post-V1 - Month 13+)

**Agents run autonomously with human oversight:**
- Product Agent: Auto-generates weekly reports, posts to Slack (Risto approves before sending to investors)
- DevOps Agent: Auto-scales infrastructure based on load, notifies Risto if cost >€400/month
- Security Agent: Auto-creates GitHub issues for CVEs, assigns to Builder Agent

---

## Agent Configurations (Example)

### Product & Reporting Agent (YAML Pseudo-Config)

```yaml
agent:
  id: "product-reporting-internal"
  role: "Product & Reporting Specialist"

  model:
    provider: "anthropic"
    name: "claude-sonnet-4.5"
    temperature: 0.3  # Balanced (factual but readable)
    max_tokens: 4000  # Long-form reports

  system_prompt: |
    You are the Product & Reporting Agent for DWS6.

    Your role:
    - Generate weekly reports (English + Finnish)
    - Calculate MVP completion % from GitHub Projects
    - Summarize customer feedback and risks

    Guidelines:
    - Use the weekly report template in docs/Reports/en/TEMPLATE.md
    - Be concise but thorough
    - Highlight risks proactively (investors hate surprises)
    - Translate accurately to Finnish (use formal business language)

    Output format: Markdown

  data_sources:
    - GitHub Projects API (task counts)
    - Google Sheets (cost data, customer metrics)
    - Slack (customer feedback messages)

  outputs:
    - docs/Reports/en/YYYY-WW.md (English report)
    - docs/Reports/fi/YYYY-WW.md (Finnish report)

  schedule:
    - Weekly: Friday 4pm (generate draft)
    - Monthly: Last Friday (investor update)

  permissions:
    - Read: All repos, GitHub Projects, Google Sheets
    - Write: docs/Reports/ only
```

---

## Success Metrics

### Agent Performance (Measured Weekly)

| Agent | Metric | Target |
|-------|--------|--------|
| **Architect** | Architecture docs updated | 1+ ADR/week (if major change) |
| **Builder** | Code merged to main | 5+ PRs/week |
| **DevOps** | Deployment success rate | >95% |
| **Security** | Critical CVEs unresolved | 0 |
| **Product** | Weekly report published on time | 100% (Fridays by 5pm) |
| **Market Signal** | Market insights generated | 1 report/week |
| **Product Page Generator** | Pages updated (auto) | 100% of dev milestones |

### Team Efficiency (Measured Monthly)

| Metric | Before Agents | With Agents | Target Improvement |
|--------|---------------|-------------|-------------------|
| **Time to deploy new agent** | 8 hours | 4 hours | 50% faster |
| **Weekly report writing time** | 2 hours | 30 min | 75% faster |
| **Security incidents** | 2/month | <1/month | 50% reduction |
| **Infrastructure cost variance** | ±20% | ±5% | Tighter control |
| **Product page update time** | 2 hours/update | 5 min (auto) | 96% faster |
| **Market signal analysis time** | 4 hours/week | 30 min (auto) | 87% faster |

### Sales Efficiency (Measured Monthly)

| Metric | Static Pages (Squarespace) | Dynamic Pages (Hugo + Agents) | Target Improvement |
|--------|----------------------------|-------------------------------|-------------------|
| **Page update frequency** | 1x/month (manual) | Daily (auto) | 30x faster |
| **Conversion rate** | 0% (baseline) | 5%+ (target) | ∞ improvement |
| **Time to launch new product page** | 1 week | 1 day | 7x faster |
| **Market signal → action time** | Never (no feedback loop) | 24 hours | Competitive advantage |

---

## Integration with Customer-Facing Agents

**Clear separation:**
- **Internal agents (DWS Team):** Help Lifetime Oy build and operate DWS6
- **External agents (Corporate Cloud, SiteSense):** Help customers optimize their businesses

**Example interaction:**
1. Customer Satisfaction Agent (external) detects customer churn risk
2. Product & Reporting Agent (internal) logs this in weekly report
3. Architect Agent (internal) proposes feature to prevent churn
4. Builder Agent (internal) implements feature
5. DevOps Agent (internal) deploys feature
6. Customer Satisfaction Agent (external) monitors if churn risk reduced

---

## Roadmap

### MVP Phase (Month 1-3)
- ✅ Define agent roles and responsibilities (this document)
- ✅ Create templates (weekly report, architecture ADR, security checklist)
- ☐ Humans play all agent roles manually (establish workflows)
- ☐ **NEW:** Set up Market Signal Agent (manual Google Merchant data pulls)
- ☐ **NEW:** Create first dynamic product page (onelifetime.world)

### Alpha Phase (Month 4-6)
- ☐ Automate DevOps Agent (GitHub Actions CI/CD)
- ☐ Automate Security Agent (Trivy scans on PRs)
- ☐ Semi-automate Product Agent (cost data auto-fetched)
- ☐ **NEW:** Automate Market Signal Agent (daily Google Merchant data pulls)
- ☐ **NEW:** Automate Product Page Generator (GitHub webhook → auto-update pages)

### V1 Phase (Month 7-12)
- ☐ Deploy Product Agent (Claude generates draft reports)
- ☐ Deploy Architect Agent (Claude suggests architecture improvements)
- ☐ Deploy Builder Agent (Claude generates boilerplate code)
- ☐ **NEW:** Deploy Market Signal Agent (Claude analyzes trends, proposes new products)
- ☐ **NEW:** Deploy Product Page Generator (Claude writes product copy, A/B test variations)

### Post-V1 (Month 13+)
- ☐ Full autonomous mode with human approval
- ☐ Multi-agent orchestration (agents coordinate without human intervention)

---

## Open Questions

1. **Should agents have GitHub commit access?**
   - Pro: Faster (agents update docs automatically)
   - Con: Risk (agents could break things)
   - **Proposal:** Alpha phase = agents create PRs (humans merge), V1 phase = agents merge if tests pass

2. **Which LLM for each agent?**
   - Architect: Claude Sonnet (complex reasoning)
   - Builder: Groq Llama 3.1 70B (fast code generation)
   - DevOps: Groq Llama 3.1 8B (simple scripts)
   - Security: Claude Sonnet (security requires deep reasoning)
   - Product: Claude Sonnet (reports require nuance)

3. **How to handle agent errors?**
   - All agent outputs are drafts (humans review before final)
   - Agents log all actions to audit trail (GitHub commit history)
   - Humans can rollback agent changes (git revert)

---

## References

**Inspiration:**
- [AutoGPT](https://github.com/Significant-Gravitas/AutoGPT) - Autonomous AI agents
- [LangChain Agents](https://python.langchain.com/docs/modules/agents/) - Agent framework
- [CrewAI](https://www.crewai.io/) - Multi-agent collaboration

**DWS6 Context:**
- [AgentFoundry configs](../../AgentFoundry/configs/) - Customer-facing agent templates
- [Roadmaps](../../docs/roadmaps/) - MVP, Alpha, V1 deployment phases
- [Weekly report templates](../../docs/Reports/) - Report format for Product Agent

---

**Document Status:** v1.0 (Proposal)
**Last Updated:** December 3, 2025
**Owner:** Risto Anton Päärni
**Next Review:** After MVP Phase (March 2026)

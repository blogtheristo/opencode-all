# Phase 10: Delivery & Launch

## DWS IQ 6 Agent Architecture - Final Phase

**Document Version:** 1.0  
**Created:** 2026-01-19  
**Author:** Lifetime Oy  
**Classification:** Internal / Customer-Ready

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Implementation Timeline](#2-implementation-timeline)
3. [Delivery Package](#3-delivery-package)
4. [Customer Pilot Plans](#4-customer-pilot-plans)
5. [Training Program](#5-training-program)
6. [Handoff Documentation](#6-handoff-documentation)
7. [Product Roadmap](#7-product-roadmap)
8. [Success Metrics & KPIs](#8-success-metrics--kpis)
9. [Risk Management](#9-risk-management)
10. [Financial Projections](#10-financial-projections)

---

## 1. Executive Summary

### 1.1 Project Overview

DWS IQ 6 "One Brain, Eight Industries" is an AI orchestration platform designed for EU-regulated industries, starting with Finnish logistics (Kela transport) and construction (NCC, T2H pilots). The platform uses a multi-agent architecture with specialized agents for each domain, unified by shared compliance and orchestration layers.

### 1.2 Key Deliverables

| Deliverable | Status | Hours |
|-------------|--------|-------|
| Phase 00: Master Blueprint | ✅ Complete | 8 |
| Phase 01: Agent Discovery | ✅ Complete | 16 |
| Phase 02: Cognitive Architecture | ✅ Complete | 24 |
| Phase 03: Orchestration Layer | ✅ Complete | 24 |
| Phase 04: Tool Architecture | ✅ Complete | 32 |
| Phase 05: Grounding & Memory | ✅ Complete | 24 |
| Phase 06: Prompt Engineering | ✅ Complete | 16 |
| Phase 07: Implementation | ✅ Complete | 120 |
| Phase 08: Testing | ✅ Complete | 60 |
| Phase 09: Production Deployment | ✅ Complete | 40 |
| Phase 10: Delivery & Launch | 🔄 In Progress | 16 |
| **Total** | | **380 hours** |

### 1.3 Investment Summary

| Category | One-Time | Monthly | Annual |
|----------|----------|---------|--------|
| Development (380 hrs × €75) | €28,500 | - | - |
| Infrastructure | - | €392 | €4,704 |
| API Usage (Claude + embeddings) | - | €187 | €2,244 |
| Testing & CI/CD | - | €105 | €1,260 |
| **Total** | **€28,500** | **€684** | **€8,208** |

### 1.4 ROI Projection

| Metric | Year 1 | Year 2 | Year 3 |
|--------|--------|--------|--------|
| Revenue (10 customers × €7K MRR) | €84,000 | €252,000 | €504,000 |
| Operating Costs | €36,708 | €45,000 | €60,000 |
| **Gross Margin** | **€47,292** | **€207,000** | **€444,000** |
| **ROI** | **166%** | **460%** | **740%** |

---

## 2. Implementation Timeline

### 2.1 Master Schedule (Q1 2026)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ WEEK 1-2: Foundation                                                        │
│ ├── Repository setup & CI/CD pipeline                                       │
│ ├── Supabase schema migration                                               │
│ ├── Base agent implementation                                               │
│ └── MCP server scaffolding                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ WEEK 3-4: Core Agents                                                       │
│ ├── LogisticsAgent + Kela MCP server                                        │
│ ├── ConstructionAgent + T2H MCP server                                      │
│ ├── ComplianceAgent + Finnish regulations                                   │
│ └── Unit test coverage ≥80%                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ WEEK 5-6: Orchestration                                                     │
│ ├── LangGraph router implementation                                         │
│ ├── Memory manager (semantic + episodic)                                    │
│ ├── Approval workflow system                                                │
│ └── Integration tests                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ WEEK 7-8: Production Hardening                                              │
│ ├── Cloud Run deployment (europe-north1)                                    │
│ ├── Load balancer + Cloud Armor WAF                                         │
│ ├── Monitoring & alerting                                                   │
│ └── Security audit & penetration testing                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ WEEK 9-10: Pilot Launch                                                     │
│ ├── NCC pilot kickoff                                                       │
│ ├── T2H pilot kickoff                                                       │
│ ├── Daily monitoring & iteration                                            │
│ └── Customer feedback integration                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ WEEK 11-12: Stabilization                                                   │
│ ├── Bug fixes & performance optimization                                    │
│ ├── Documentation finalization                                              │
│ ├── Training completion                                                     │
│ └── Production GA release                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Milestone Gates

| Gate | Date | Criteria | Owner |
|------|------|----------|-------|
| **M1: Foundation** | Week 2 | CI/CD green, Supabase live, base agent tests pass | Tech Lead |
| **M2: MVP** | Week 4 | Logistics + Construction agents functional, 80% test coverage | Tech Lead |
| **M3: Integration** | Week 6 | Full orchestration working, approval flow complete | Tech Lead |
| **M4: Production** | Week 8 | Deployed to GCP, security audit passed, monitoring live | DevOps |
| **M5: Pilot Start** | Week 9 | NCC & T2H onboarded, first production requests | Product |
| **M6: GA** | Week 12 | Pilot success criteria met, documentation complete | CEO |

### 2.3 Resource Allocation

| Role | Hours/Week | Cost/Week | Total (12 weeks) |
|------|------------|-----------|------------------|
| Senior Developer (Risto) | 30 | €2,250 | €27,000 |
| Contract DevOps | 10 | €1,000 | €12,000 |
| Part-time QA | 5 | €375 | €4,500 |
| **Total** | **45** | **€3,625** | **€43,500** |

**Note:** Contract resources can be scaled down after Week 8 (production deployment).

---

## 3. Delivery Package

### 3.1 Repository Structure

```
F:\2026\Repos2026\dws6\
├── README.md                    # Project overview
├── LICENSE                      # MIT or proprietary
├── CHANGELOG.md                 # Version history
├── CONTRIBUTING.md              # Development guidelines
├── Makefile                     # Build & deploy commands
├── pyproject.toml               # Python dependencies (Poetry)
├── .env.example                 # Environment template
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # Unit + integration tests
│   │   ├── cd-staging.yml      # Staging deployment
│   │   ├── cd-production.yml   # Production deployment
│   │   └── security-scan.yml   # SAST + dependency audit
│   └── CODEOWNERS              # Review assignments
├── src/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── base.py             # DWSBaseAgent
│   │   ├── logistics.py        # LogisticsAgent
│   │   ├── construction.py     # ConstructionAgent
│   │   ├── compliance.py       # ComplianceAgent
│   │   └── reconciliation.py   # DataReconciliationAgent
│   ├── cognitive/
│   │   ├── __init__.py
│   │   ├── react.py            # ReAct pattern
│   │   ├── cot.py              # Chain-of-Thought
│   │   ├── tot.py              # Tree-of-Thought
│   │   └── reflexion.py        # Self-correction
│   ├── orchestration/
│   │   ├── __init__.py
│   │   ├── state.py            # DWSAgentState
│   │   ├── router.py           # Master router graph
│   │   └── checkpointer.py     # PostgreSQL persistence
│   ├── mcp_servers/
│   │   ├── logistics/
│   │   │   ├── __init__.py
│   │   │   ├── server.py       # FastMCP server
│   │   │   ├── tools.py        # Kela, routing tools
│   │   │   └── Dockerfile
│   │   ├── construction/
│   │   │   ├── __init__.py
│   │   │   ├── server.py
│   │   │   ├── tools.py        # Tilaajavastuu, YTJ tools
│   │   │   └── Dockerfile
│   │   └── compliance/
│   │       ├── __init__.py
│   │       ├── server.py
│   │       ├── tools.py        # NIS2, GDPR tools
│   │       └── Dockerfile
│   ├── memory/
│   │   ├── __init__.py
│   │   ├── manager.py          # MemoryManager
│   │   ├── semantic.py         # Vector search
│   │   └── episodic.py         # Interaction history
│   ├── prompts/
│   │   ├── __init__.py
│   │   ├── system.py           # System prompt templates
│   │   ├── industry/
│   │   │   ├── logistics.py
│   │   │   └── construction.py
│   │   └── cognitive/
│   │       ├── react.py
│   │       └── cot.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── main.py             # FastAPI application
│   │   ├── routes/
│   │   │   ├── agent.py        # /agent/* endpoints
│   │   │   ├── approval.py     # /approve/* endpoints
│   │   │   └── health.py       # /health endpoint
│   │   └── middleware/
│   │       ├── auth.py         # JWT validation
│   │       ├── audit.py        # Compliance logging
│   │       ├── validation.py   # Input sanitization
│   │       ├── output_filter.py # PII redaction
│   │       └── cost_control.py # Token limits
│   ├── config/
│   │   ├── __init__.py
│   │   ├── settings.py         # Pydantic Settings
│   │   └── feature_flags.py    # Rollout control
│   └── utils/
│       ├── __init__.py
│       ├── telemetry.py        # OpenTelemetry
│       ├── logging.py          # Structured logging
│       ├── exceptions.py       # Custom errors
│       └── retry.py            # Backoff strategies
├── tests/
│   ├── conftest.py             # Fixtures
│   ├── unit/
│   ├── integration/
│   ├── reasoning/
│   ├── e2e/
│   └── adversarial/
├── deployments/
│   ├── cloud-run/
│   │   ├── agent-service.yaml
│   │   ├── logistics-mcp.yaml
│   │   ├── construction-mcp.yaml
│   │   └── compliance-mcp.yaml
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── modules/
│   └── monitoring/
│       ├── dashboard.json
│       └── alerts.yaml
├── migrations/
│   └── supabase/
│       ├── 001_initial_schema.sql
│       ├── 002_vector_extension.sql
│       ├── 003_memory_tables.sql
│       └── 004_audit_tables.sql
├── scripts/
│   ├── deploy.sh
│   ├── rollback.sh
│   ├── migrate.sh
│   └── seed-data.sh
└── docs/
    ├── architecture/
    │   ├── 00-master-blueprint.md
    │   ├── 01-agent-discovery.md
    │   └── ... (all phase docs)
    ├── api/
    │   └── openapi.yaml
    ├── operations/
    │   ├── runbooks.md
    │   └── incident-response.md
    └── training/
        ├── admin-guide.md
        └── user-guide.md
```

### 3.2 Environment Configuration

```bash
# .env.example - Copy to .env and fill values

# === API Keys ===
ANTHROPIC_API_KEY=sk-ant-...
GROQ_API_KEY=gsk_...  # Optional: for faster inference

# === Supabase ===
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...

# === MCP Servers ===
MCP_LOGISTICS_URL=https://logistics-mcp-xxx.run.app
MCP_CONSTRUCTION_URL=https://construction-mcp-xxx.run.app
MCP_COMPLIANCE_URL=https://compliance-mcp-xxx.run.app
MCP_AUTH_TOKEN=...

# === Authentication ===
JWT_SECRET_KEY=...
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# === Environment ===
ENVIRONMENT=development  # development | staging | production
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:3000"]

# === Feature Flags ===
FEATURE_NEW_REASONING_ENGINE=false
FEATURE_PARALLEL_TOOL_EXECUTION=false
FEATURE_MEMORY_V2=false

# === Cost Controls ===
DAILY_TOKEN_LIMIT_TIER1=1000000
DAILY_TOKEN_LIMIT_TIER2=500000
DAILY_TOKEN_LIMIT_TIER3=100000
HOURLY_COST_LIMIT_EUR=50
```

### 3.3 Deployment Checklist

```markdown
## Pre-Deployment Checklist

### Code Quality
- [ ] All unit tests passing (≥80% coverage)
- [ ] All integration tests passing
- [ ] All reasoning tests passing (≥90% accuracy)
- [ ] No critical security vulnerabilities (npm audit, pip-audit)
- [ ] Code review approved by 2+ reviewers

### Infrastructure
- [ ] GCP project created with billing enabled
- [ ] Service accounts created with minimal permissions
- [ ] Secrets stored in Secret Manager
- [ ] VPC connector configured
- [ ] Cloud Armor WAF rules deployed

### Database
- [ ] Supabase project created (eu-central-1)
- [ ] All migrations applied
- [ ] Row-level security policies enabled
- [ ] Backup schedule configured (daily)
- [ ] Connection pooling enabled

### Monitoring
- [ ] OpenTelemetry exporters configured
- [ ] Dashboard deployed
- [ ] Alerting policies active
- [ ] Log retention set (30 days standard, 7 years audit)

### Documentation
- [ ] API documentation generated (OpenAPI)
- [ ] Runbooks reviewed
- [ ] Incident response contacts updated
- [ ] Customer onboarding docs ready

### Sign-off
- [ ] Tech Lead approval: _______________ Date: ___
- [ ] DevOps approval: _______________ Date: ___
- [ ] Product approval: _______________ Date: ___
```

---

## 4. Customer Pilot Plans

### 4.1 NCC Pilot (Construction)

**Company:** NCC Building Finland  
**Industry:** Construction  
**Contact:** [Project Manager TBD]  
**Pilot Duration:** 8 weeks  
**Start Date:** Week 9 (after M5 milestone)

#### 4.1.1 Objectives

1. **Subcontractor Compliance Automation**
   - Automated Tilaajavastuu verification for all new subcontractors
   - Real-time YTJ status monitoring
   - Compliance alert dashboard

2. **Safety Incident Processing**
   - AI-assisted incident classification (TR index categories)
   - Automatic regulatory notification drafts
   - Trend analysis for safety improvements

3. **Document Processing**
   - Construction permit extraction and validation
   - Work safety plan review assistance
   - Change order impact analysis

#### 4.1.2 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Tilaajavastuu check automation rate | ≥90% | Manual vs automated checks |
| Average verification time | <2 minutes | From request to result |
| False positive rate | <5% | Manual review of flagged items |
| User satisfaction (NPS) | ≥40 | Post-pilot survey |
| System uptime | ≥99.5% | Monitoring data |

#### 4.1.3 Pilot Schedule

| Week | Activities | Deliverables |
|------|------------|--------------|
| 1 | Kickoff, system access, training | Signed pilot agreement |
| 2-3 | Tilaajavastuu integration, testing | 10 real verifications |
| 4-5 | Safety incident processing | 5 incident reports processed |
| 6-7 | Document processing, refinement | 20 documents analyzed |
| 8 | Evaluation, feedback session | Pilot report, commercial proposal |

#### 4.1.4 Resource Requirements

**From NCC:**
- Pilot coordinator (4 hrs/week)
- 3-5 test users (site managers, procurement)
- API access to existing systems (if applicable)
- Sample documents for testing

**From Lifetime Consulting:**
- Technical support (8 hrs/week)
- Weekly status calls (1 hr)
- On-site training session (4 hrs)

#### 4.1.5 Pricing Proposal

| Phase | Duration | Price | Notes |
|-------|----------|-------|-------|
| Pilot | 8 weeks | €0 | Free pilot, investment in partnership |
| Setup | Post-pilot | €15,000 | Integration, customization |
| Monthly subscription | Ongoing | €3,500/month | Up to 500 verifications |
| Per verification (overage) | - | €5/check | Above 500/month |

**Year 1 Value:** €57,000 (setup + 12 months)

### 4.2 T2H Pilot (Construction - Workforce)

**Company:** T2H Rakennus Oy  
**Industry:** Construction / Workforce Management  
**Contact:** [HR Director TBD]  
**Pilot Duration:** 6 weeks  
**Start Date:** Week 9 (parallel with NCC)

#### 4.2.1 Objectives

1. **Worker Qualification Verification**
   - Automated certificate validation (hot work permits, safety cards)
   - Expiration tracking and renewal reminders
   - Competency matching for project staffing

2. **Timesheet Reconciliation**
   - Cross-reference timesheets with site access logs
   - Anomaly detection (overtime patterns, missing entries)
   - Integration with payroll prep

3. **Compliance Reporting**
   - Automated weekly compliance summaries
   - Audit-ready documentation
   - Regulatory change alerts

#### 4.2.2 Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Qualification verification automation | ≥85% | Manual vs automated |
| Timesheet reconciliation accuracy | ≥98% | Matched vs total entries |
| Hours saved per week | ≥10 hrs | Admin time tracking |
| User satisfaction (NPS) | ≥35 | Post-pilot survey |

#### 4.2.3 Pricing Proposal

| Phase | Duration | Price | Notes |
|-------|----------|-------|-------|
| Pilot | 6 weeks | €0 | Free pilot |
| Setup | Post-pilot | €10,000 | Integration, training |
| Monthly subscription | Ongoing | €2,500/month | Up to 200 workers |
| Per worker (overage) | - | €10/worker/month | Above 200 |

**Year 1 Value:** €40,000 (setup + 12 months)

### 4.3 Existing Logistics Customers (Expansion)

**Current Customers:** Uber Taksi Helsinki, Bolt, Kela transport providers  
**Current MRR:** €7,000  
**Expansion Opportunity:** DWS IQ 6 upgrade

#### 4.3.1 Upgrade Path

| Feature | Current | DWS IQ 6 | Value Add |
|---------|---------|----------|-----------|
| Route optimization | Basic | AI-powered with traffic prediction | 15% efficiency gain |
| Driver matching | Manual | Automated with constraints | 20% faster dispatch |
| Compliance checks | Periodic | Real-time continuous | Risk reduction |
| Reporting | Standard | AI-generated insights | Decision support |

#### 4.3.2 Pricing Adjustment

| Customer Tier | Current MRR | Proposed MRR | Increase |
|---------------|-------------|--------------|----------|
| Enterprise (Uber) | €3,500 | €5,000 | +43% |
| Growth (Bolt) | €2,500 | €3,500 | +40% |
| Standard (others) | €1,000 | €1,500 | +50% |

**Projected MRR after upgrade:** €10,000 (+43%)

---

## 5. Training Program

### 5.1 Administrator Training (4 hours)

**Target Audience:** System administrators, IT staff  
**Format:** On-site or virtual workshop  
**Materials:** Admin Guide, video recordings

#### Module 1: System Architecture (1 hour)
- DWS IQ 6 component overview
- Agent types and responsibilities
- MCP server ecosystem
- Data flow and security boundaries

#### Module 2: Configuration & Management (1.5 hours)
- Environment setup and configuration
- User management and permissions (Tier 1/2/3)
- Feature flag management
- Cost control and limits

#### Module 3: Monitoring & Troubleshooting (1 hour)
- Dashboard walkthrough
- Alert interpretation
- Common issues and solutions
- Escalation procedures

#### Module 4: Security & Compliance (0.5 hours)
- Data protection (GDPR)
- Access audit logs
- Incident reporting (NIS2)
- Backup and recovery

### 5.2 End User Training (2 hours)

**Target Audience:** Business users, operators  
**Format:** Virtual workshop + self-paced modules  
**Materials:** User Guide, quick reference cards

#### Module 1: Getting Started (30 minutes)
- Accessing the system
- Interface overview
- Basic query patterns
- Understanding agent responses

#### Module 2: Common Workflows (45 minutes)
- Compliance verification requests
- Document analysis tasks
- Report generation
- Approval workflows

#### Module 3: Best Practices (30 minutes)
- Effective prompting techniques
- When to use which agent
- Handling errors and retries
- Providing feedback

#### Module 4: Hands-on Practice (15 minutes)
- Guided exercises with real scenarios
- Q&A session

### 5.3 Training Materials

#### Quick Reference Card (A4 laminated)

```
┌─────────────────────────────────────────────────────────────────┐
│                    DWS IQ 6 QUICK REFERENCE                     │
├─────────────────────────────────────────────────────────────────┤
│ AGENT TYPES                                                     │
│ ┌─────────────┬────────────────────────────────────────────┐   │
│ │ Logistics   │ Kela transport, routing, driver dispatch   │   │
│ │ Construction│ Tilaajavastuu, YTJ, safety incidents       │   │
│ │ Compliance  │ NIS2, GDPR, Finnish regulations            │   │
│ │ Reconcile   │ Data matching, anomaly detection           │   │
│ └─────────────┴────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│ COMMON COMMANDS                                                 │
│ "Verify subcontractor [Y-tunnus]"                               │
│ "Check Kela eligibility for patient [reference]"                │
│ "Analyze safety incident: [description]"                        │
│ "Generate compliance report for [date range]"                   │
├─────────────────────────────────────────────────────────────────┤
│ APPROVAL WORKFLOW                                               │
│ Tier 1: Read-only operations → Auto-approved                    │
│ Tier 2: Write operations → Manager approval required            │
│ Tier 3: Sensitive operations → All require approval             │
├─────────────────────────────────────────────────────────────────┤
│ SUPPORT                                                         │
│ Email: support@dws6.fi    Phone: +358-xxx-xxx                   │
│ Hours: Mon-Fri 08:00-17:00 EET                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Handoff Documentation

### 6.1 Operations Runbook

```markdown
# DWS IQ 6 Operations Runbook

## Daily Operations

### Morning Checklist (08:00 EET)
1. Check monitoring dashboard for overnight alerts
2. Review error rate trends (should be <1%)
3. Verify all MCP servers healthy
4. Check pending approval queue
5. Review cost dashboard (daily burn rate)

### Evening Checklist (17:00 EET)
1. Clear or escalate pending approvals >4 hours old
2. Archive completed conversations
3. Review customer feedback/tickets
4. Update on-call handoff notes

## Incident Response

### Severity Classification
- **SEV1 (Critical):** System down, data loss risk → 15 min response
- **SEV2 (High):** Major feature broken, customer impacted → 30 min response
- **SEV3 (Medium):** Minor feature issue, workaround exists → 2 hr response
- **SEV4 (Low):** Enhancement request, cosmetic issue → 24 hr response

### SEV1 Procedure
1. Acknowledge in #incidents Slack channel
2. Check Cloud Run service status: `gcloud run services describe agent-service`
3. Check dependencies: Supabase, MCP servers, Claude API
4. If system-wide: Execute rollback: `./scripts/rollback.sh`
5. Notify customers via status page
6. Post-incident review within 24 hours

### Common Issues

#### High Error Rate (>5%)
1. Check Cloud Logging for error patterns
2. Verify MCP server health: `curl https://[mcp-url]/health`
3. Check Supabase connection pool
4. If Claude API errors: Check status.anthropic.com
5. If persistent: Scale up instances or circuit break

#### High Latency (P95 >10s)
1. Check agent iteration counts (should be <5)
2. Review tool call latencies
3. Check Supabase query performance
4. Consider enabling caching for repeated queries

#### Approval Queue Backlog
1. Alert approvers via Slack/email
2. Check if approver accounts are active
3. Consider auto-escalation rules
4. Review if tier classification is too strict

## Scaling Procedures

### Scale Up (Expected Load Increase)
```bash
# Increase max instances
gcloud run services update agent-service \
  --max-instances=200 \
  --region=europe-north1

# Increase MCP server capacity
gcloud run services update logistics-mcp \
  --max-instances=50 \
  --region=europe-north1
```

### Scale Down (Cost Optimization)
```bash
# Reduce during off-hours
gcloud run services update agent-service \
  --min-instances=0 \
  --max-instances=50 \
  --region=europe-north1
```

## Maintenance Windows

### Scheduled Maintenance
- **When:** Sundays 02:00-04:00 EET
- **Notification:** 72 hours advance via email
- **Procedure:**
  1. Enable maintenance mode (returns 503)
  2. Apply database migrations
  3. Deploy new version with canary (10%)
  4. Monitor for 30 minutes
  5. Full rollout or rollback
  6. Disable maintenance mode

### Emergency Maintenance
- Requires CEO or CTO approval
- Customer notification within 15 minutes
- Maximum duration: 2 hours
```

### 6.2 API Documentation

```yaml
# openapi.yaml (excerpt)
openapi: 3.1.0
info:
  title: DWS IQ 6 Agent API
  version: 1.0.0
  description: AI orchestration platform for EU-regulated industries
  contact:
    name: Lifetime Oy
    email: api-support@dws6.fi

servers:
  - url: https://api.dws6.fi/v1
    description: Production
  - url: https://staging-api.dws6.fi/v1
    description: Staging

security:
  - bearerAuth: []

paths:
  /agent/invoke:
    post:
      summary: Invoke an agent
      description: Send a request to be processed by the appropriate agent
      operationId: invokeAgent
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AgentRequest'
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AgentResponse'
        '202':
          description: Approval required
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApprovalPending'
        '429':
          description: Rate limit exceeded

  /agent/status/{conversation_id}:
    get:
      summary: Get conversation status
      parameters:
        - name: conversation_id
          in: path
          required: true
          schema:
            type: string
            format: uuid

  /approve/{conversation_id}:
    post:
      summary: Approve or reject a pending action
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ApprovalDecision'

components:
  schemas:
    AgentRequest:
      type: object
      required:
        - message
      properties:
        message:
          type: string
          maxLength: 10000
        conversation_id:
          type: string
          format: uuid
        context:
          type: object
          additionalProperties: true

    AgentResponse:
      type: object
      properties:
        conversation_id:
          type: string
          format: uuid
        answer:
          type: string
        confidence:
          type: number
          minimum: 0
          maximum: 1
        actions_taken:
          type: array
          items:
            $ref: '#/components/schemas/Action'
        reasoning_trace:
          type: array
          items:
            type: string

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### 6.3 Contact Matrix

| Role | Name | Email | Phone | Escalation |
|------|------|-------|-------|------------|
| CEO / Product Owner | Risto | risto@lifetime.fi | +358-xxx | Final escalation |
| Tech Lead | Risto | tech@lifetime.fi | +358-xxx | Technical issues |
| DevOps (Contract) | TBD | devops@lifetime.fi | - | Infrastructure |
| Customer Success | TBD | success@dws6.fi | - | Customer issues |
| On-Call | Rotating | oncall@dws6.fi | PagerDuty | After hours |

---

## 7. Product Roadmap

### 7.1 2026 Roadmap

```
Q1 2026: FOUNDATION
├── ✅ Phase 00-10: Architecture & Implementation
├── ✅ Logistics agents (Kela, routing)
├── ✅ Construction agents (Tilaajavastuu, YTJ)
├── 🔄 NCC & T2H pilot launch
└── 🔄 Production GA release

Q2 2026: EXPANSION
├── Energy industry agent (NIS2 focus)
├── Healthcare documentation agent
├── Multi-language support (Swedish, English)
├── Mobile app (React Native)
└── Salesforce integration

Q3 2026: INTELLIGENCE
├── Advanced analytics dashboard
├── Predictive compliance alerts
├── Custom model fine-tuning (Claude)
├── Voice interface (pilot)
└── IoT sensor integration (construction sites)

Q4 2026: SCALE
├── Multi-tenant SaaS architecture
├── Partner API program
├── Marketplace for industry-specific modules
├── ISO 27001 certification
└── Nordic expansion (Sweden, Norway)
```

### 7.2 Feature Backlog (Prioritized)

| Priority | Feature | Effort | Value | Target |
|----------|---------|--------|-------|--------|
| P0 | Production GA | 12 weeks | Critical | Q1 |
| P0 | NCC pilot success | 8 weeks | €57K ARR | Q1 |
| P0 | T2H pilot success | 6 weeks | €40K ARR | Q1 |
| P1 | Energy industry agent | 4 weeks | €100K+ market | Q2 |
| P1 | Swedish language | 2 weeks | Nordic expansion | Q2 |
| P1 | Salesforce connector | 3 weeks | Enterprise sales | Q2 |
| P2 | Mobile app | 6 weeks | User convenience | Q2 |
| P2 | Analytics dashboard | 4 weeks | Upsell opportunity | Q3 |
| P2 | Voice interface | 6 weeks | Differentiation | Q3 |
| P3 | Partner API | 4 weeks | Ecosystem | Q4 |
| P3 | ISO 27001 | 8 weeks | Enterprise requirement | Q4 |

### 7.3 Technical Debt Backlog

| Item | Impact | Effort | Priority |
|------|--------|--------|----------|
| Replace sync Supabase calls with async | Performance | 2 days | High |
| Add request deduplication | Cost reduction | 1 day | High |
| Implement connection pooling | Scalability | 1 day | Medium |
| Add circuit breaker for Claude API | Reliability | 2 days | Medium |
| Migrate to LangGraph 0.3 (when stable) | Features | 3 days | Low |
| Add GraphQL API option | Developer experience | 1 week | Low |

---

## 8. Success Metrics & KPIs

### 8.1 Business Metrics

| Metric | Q1 Target | Q2 Target | Q4 Target |
|--------|-----------|-----------|-----------|
| MRR | €15,000 | €35,000 | €70,000 |
| Customers | 5 | 12 | 25 |
| NPS | 40 | 50 | 60 |
| Churn rate | <5% | <5% | <3% |
| CAC | €5,000 | €4,000 | €3,000 |
| LTV | €50,000 | €60,000 | €80,000 |

### 8.2 Technical Metrics

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Uptime | ≥99.9% | <99.5% |
| P95 Latency | ≤3s | >5s |
| Error rate | <1% | >3% |
| Task completion rate | ≥95% | <90% |
| Tool selection accuracy | ≥90% | <85% |
| Cost per request | ≤€0.04 | >€0.06 |

### 8.3 Compliance Metrics

| Metric | Target | Audit Requirement |
|--------|--------|-------------------|
| GDPR subject access requests | <48hr response | Yes |
| GDPR deletion requests | <72hr completion | Yes |
| NIS2 incident notification | <24hr | Yes |
| Audit log retention | 7 years | Yes |
| Security vulnerability patches | <48hr critical | Yes |

---

## 9. Risk Management

### 9.1 Risk Register

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| Claude API price increase | Medium | High | Budget buffer, Groq fallback | CEO |
| Key person dependency (Risto) | High | Critical | Documentation, knowledge transfer | CEO |
| Pilot customer churn | Low | High | Weekly check-ins, success criteria | Product |
| Security breach | Low | Critical | Pen testing, WAF, audit logs | Tech Lead |
| Regulatory change (EU AI Act) | Medium | Medium | Compliance monitoring agent | Compliance |
| Competitor enters market | Medium | Medium | Feature velocity, customer lock-in | CEO |
| Cloud provider outage | Low | High | Multi-region DR plan (Q3) | DevOps |

### 9.2 Contingency Plans

#### Claude API Unavailability

**Trigger:** Claude API errors >50% for >5 minutes

**Response:**
1. Activate circuit breaker
2. Route to Groq/Llama fallback (reduced capability)
3. Notify customers of degraded mode
4. Queue non-urgent requests for retry
5. Monitor Anthropic status page

**Fallback Capabilities:**
- Basic query classification: ✅
- Simple tool selection: ✅
- Complex reasoning: ❌
- Compliance checks: ⚠️ (reduced accuracy)

#### Supabase Outage

**Trigger:** Database connection failures >30 seconds

**Response:**
1. Activate read-only mode (cache responses)
2. Queue write operations
3. Notify customers
4. Monitor Supabase status
5. Replay queued operations on recovery

### 9.3 Business Continuity

| Scenario | RTO | RPO | Procedure |
|----------|-----|-----|-----------|
| Single service failure | 5 min | 0 | Auto-restart, health checks |
| Regional outage | 4 hr | 1 hr | Failover to europe-west1 |
| Data corruption | 24 hr | 24 hr | Restore from backup |
| Security incident | 1 hr | 0 | Isolate, investigate, notify |

---

## 10. Financial Projections

### 10.1 Revenue Model

| Revenue Stream | Unit Price | Q1 Units | Q1 Revenue |
|----------------|------------|----------|------------|
| Monthly subscription (Tier 1) | €1,500/mo | 3 | €13,500 |
| Monthly subscription (Tier 2) | €3,500/mo | 2 | €21,000 |
| Monthly subscription (Tier 3) | €5,000/mo | 1 | €15,000 |
| Setup fees | €10-15K | 3 | €35,000 |
| Usage overage | Variable | - | €5,000 |
| **Q1 Total** | | | **€89,500** |

### 10.2 Cost Structure

| Category | Monthly | Q1 Total | % of Revenue |
|----------|---------|----------|--------------|
| Infrastructure (GCP) | €400 | €1,200 | 1.3% |
| Claude API | €200 | €600 | 0.7% |
| Supabase | €34 | €102 | 0.1% |
| Contract labor | €1,000 | €12,000 | 13.4% |
| Marketing | €500 | €1,500 | 1.7% |
| Legal/Compliance | €200 | €600 | 0.7% |
| **Q1 Total OPEX** | | **€16,002** | **17.9%** |

### 10.3 Runway Analysis

**Current Position:**
- Cash: €150,000 (SAFE round)
- Monthly burn: €5,000 (pre-revenue operations)
- Current runway: 30 months

**Post-Launch Projection:**

| Month | Revenue | Expenses | Net | Cash Balance |
|-------|---------|----------|-----|--------------|
| Mar 2026 | €7,000 | €8,000 | -€1,000 | €149,000 |
| Apr 2026 | €12,000 | €10,000 | €2,000 | €151,000 |
| May 2026 | €18,000 | €12,000 | €6,000 | €157,000 |
| Jun 2026 | €25,000 | €15,000 | €10,000 | €167,000 |
| Jul 2026 | €32,000 | €18,000 | €14,000 | €181,000 |
| Aug 2026 | €40,000 | €20,000 | €20,000 | €201,000 |

**Break-even:** Month 4 (April 2026)  
**Cash positive trajectory:** Month 3 onwards

### 10.4 Unit Economics

| Metric | Current | Target (12mo) |
|--------|---------|---------------|
| Average contract value (ACV) | €36,000 | €48,000 |
| Customer acquisition cost (CAC) | €5,000 | €4,000 |
| Gross margin | 75% | 80% |
| LTV | €90,000 | €120,000 |
| LTV:CAC ratio | 18:1 | 30:1 |
| Payback period | 2 months | 1.5 months |

### 10.5 Investment for Ecosummit 2026

**Ask:** €500,000 seed round  
**Valuation:** €5M pre-money (€3.8M + traction premium)  
**Use of Funds:**

| Category | Amount | Purpose |
|----------|--------|---------|
| Engineering | €250,000 | 2 senior hires for 12 months |
| Sales & Marketing | €150,000 | Nordic expansion, events, content |
| Operations | €50,000 | Legal, compliance, infrastructure |
| Reserve | €50,000 | Contingency buffer |

**Milestones for Next Round:**
1. €70K MRR (10x current)
2. 26 paying customers
3. Successful Nordic expansion
4. SOC 2 Type II certification

---

## Appendix A: Pilot Agreement Template

```
PILOT PROGRAM AGREEMENT

Between: Lifetime Oy ("Provider")
And: [Customer Name] ("Customer")

1. PILOT SCOPE
   - Duration: [X] weeks
   - Features: [List specific agents/tools]
   - Users: Up to [X] named users
   - Data: [Customer provides / synthetic only]

2. SUCCESS CRITERIA
   [Insert from pilot plan section]

3. OBLIGATIONS
   Provider:
   - Dedicated support contact
   - Weekly status meetings
   - Issue resolution within 24 hours
   
   Customer:
   - Designated pilot coordinator
   - Timely feedback (within 48 hours)
   - Participation in evaluation

4. DATA HANDLING
   - All data processed in EU (Finland/Germany)
   - GDPR compliant processing
   - Data deleted 30 days post-pilot unless converted

5. INTELLECTUAL PROPERTY
   - Provider retains all IP
   - Customer owns their data
   - Anonymized usage data may be used for improvement

6. COMMERCIAL TERMS
   - Pilot period: No charge
   - Post-pilot pricing: As per proposal
   - Conversion decision: Within 14 days of pilot end

7. CONFIDENTIALITY
   - Both parties maintain confidentiality
   - Press releases require mutual approval

Signatures:

Provider: _______________ Date: ___
Customer: _______________ Date: ___
```

---

## Appendix B: Ecosummit 2026 Pitch Deck Outline

```
1. TITLE
   DWS IQ 6: One Brain, Eight Industries
   AI Orchestration for EU-Regulated Markets

2. PROBLEM
   - EU regulations complex (NIS2, GDPR, EU AI Act)
   - Manual compliance costs €50K+/year for SMEs
   - 60% of compliance tasks are repetitive

3. SOLUTION
   - Multi-agent AI platform
   - Industry-specific agents (logistics, construction, energy...)
   - Shared compliance layer
   - EU-compliant by design (Finland hosting)

4. TRACTION
   - €7K MRR (100% retention)
   - 6 paying customers
   - NCC & T2H pilots (€100K pipeline)
   - Microsoft ISV Partner

5. MARKET
   - €2.3B EU RegTech market
   - 40% CAGR through 2030
   - Finland → Nordic → EU expansion

6. BUSINESS MODEL
   - SaaS subscription (€1.5K-€5K/month)
   - Setup fees (€10K-€15K)
   - Usage-based overage
   - 75% gross margin

7. COMPETITIVE ADVANTAGE
   - First mover in Finnish construction compliance
   - Deep regulatory expertise
   - Local language & context
   - Cloud-agnostic (GCP, AWS, Azure)

8. TEAM
   - Risto: 15+ years cloud architecture
   - [Future hire]: Sales/BD
   - [Future hire]: Engineering

9. FINANCIALS
   - Current: €7K MRR
   - Q4 2026: €70K MRR
   - Break-even: Q2 2026

10. ASK
    - €500K seed round
    - €5M pre-money valuation
    - Use: 2 engineers, Nordic expansion

11. CONTACT
    risto@lifetime.fi
    www.dws6.fi
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Risto | Initial release |

---

*This document completes the DWS IQ 6 Agent Architecture Blueprint (Phases 00-10).*

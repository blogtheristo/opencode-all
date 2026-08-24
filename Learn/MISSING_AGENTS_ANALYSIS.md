# Missing Agents Analysis - DWS IQ 6

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/deepwiki-agent-extraction-aS6Ub | Date: 11.02.2026 | Changes: Initial analysis of agents needed but not yet implemented

Session Links & References:
  - Claude Code (claude/deepwiki-agent-extraction-aS6Ub): https://github.com/blogtheristo/dws6/commits/claude/deepwiki-agent-extraction-aS6Ub

Document Status:
  - Created: 11.02.2026
  - Last Modified: 11.02.2026
  - Language: English
  - Publication Status: ACTIVE

***

## Current State as of 11.02.2026: 10 Implemented, 15+ Missing

> **Note:** Following the merge of PR #553, the agents for Compliance, QualityGate, Construction, and Logistics have been integrated into `src/agents/` and should be considered **Implemented**. The counts below reflect the full state after those additions. If you are referencing this document for a new audit, please check `src/agents/` directly for the most current list.

### Implemented (in `src/agents/`) — original 6, as of 11.02.2026

| Agent | Purpose | Origin | Tier |
|-------|---------|--------|------|
| SiteSense | Site monitoring, weather/safety scoring | Legacy core | 1 |
| ScheduleGenius | Critical path analysis, timeline optimization | Legacy core | 1 |
| MaterialOracle | EN 15978 carbon footprint, material alternatives | Legacy core | 1 |
| CustomerSat | Customer health scoring, churn prediction | Legacy core | 1 |
| Viability | ROI, NPV, EU ETS carbon credit valuation | Legacy core | 1 |
| DeepWikiExtractor | Code extraction from GitHub repos | Legacy core | 1 |

All six are Tier 1 (read-only analysis). None perform mutations, send communications, or touch financial systems.

### Added by PR #553

| Agent | Purpose | Origin | Tier |
|-------|---------|--------|------|
| Compliance | EU regulatory compliance monitoring (Fit for 55, ETS, CBAM, CSRD) | PR #553 | 1 |
| QualityGate | Deployment readiness, test coverage, security scan aggregation | PR #553 | 1 |
| Construction | Construction compliance orchestration, BIM carbon tracking | PR #553 | 1 |
| Logistics | Transport route optimisation, Kela API, ADR compliance | PR #553 | 1 |

---

## CRITICAL - Must Have for V1.0

### 1. ConstructionAgent

**What:** Orchestrates construction compliance workflows - YTJ company verification, building permit status, safety compliance, subcontractor vetting, BIM carbon tracking.

**Why needed:** Construction is DWS6's primary target market. Architecture docs (Phases 01-10) define this as MVP. The existing SiteSense and MaterialOracle agents handle subsets of construction needs, but there's no orchestration agent that ties them together into construction-specific workflows.

**Evidence:**
- `docs/architecture/01-AGENT-DISCOVERY.md` - listed as Primary Agent (MVP)
- `docs/architecture/02-COGNITIVE-ARCHITECTURE.md` - assigned ReAct+CoT pattern
- `16-INDUSTRIES.md` - Construction is Tier 1 (36-40% of EU lifecycle emissions)
- Target customers: NCC, T2H, Kela, Senaatti, YIT, SRV

**Expected tools:** YTJ API, Traficom API, Suomi.fi, BIM parsers, EPD databases

**Cognitive pattern:** ReAct + Chain-of-Thought (multi-system integration with reasoning)

---

### 2. LogisticsAgent

**What:** Manages transport logistics - route optimization, Kela transport API integration, driver dispatch, ADR/license compliance verification.

**Why needed:** Logistics is DWS6's second production vertical. Architecture docs define this as MVP alongside Construction.

**Evidence:**
- `docs/architecture/01-AGENT-DISCOVERY.md` - listed as Primary Agent (MVP)
- Target customers: Uber Taksi Helsinki, Bolt, Kela transport

**Cognitive pattern:** ReAct (reasoning + acting loops for real-time dispatch)

---

## HIGH - Should Have for V1.0

### 3. CustomerServiceAgent

**What:** Intent classification, ticket routing, FAQ responses, escalation management across email/chat/Slack.

**Why needed:** Enables 24/7 customer response for pilot customers without proportional headcount.

**Evidence:**
- `docs/architecture/01-AGENT-DISCOVERY.md` - listed as Primary Agent (MVP)
- `docs/architecture/02-COGNITIVE-ARCHITECTURE.md` - assigned Reflexion pattern

**Cognitive pattern:** Reflexion (self-correction for improved response quality)

---

### 4. Lead Scout Agent (Sales)

**What:** LinkedIn scraping, lead enrichment, ICP scoring, 100+ leads/week automation.

**Why needed:** Blocks Feb-March 2026 pilot customer acquisition. Full YAML config exists in `SALES_AI_AGENT_DESIGN_FI_v1.md` but no code.

---

### 5. Outreach Agent (Sales)

**What:** Multi-channel email + LinkedIn sequences, A/B testing, send-time optimization, 7-touch sequences.

**Why needed:** Pairs with Lead Scout for sales pipeline. Targets 3x reply rate improvement.

---

## MEDIUM - V1.1 (March-May 2026)

### 6. ComplianceMonitorAgent

**What:** Monitors EUR-Lex, Finlex, industry standards (EN 15978, EN 15804, EN 13001) for regulatory changes. Generates customer impact assessments.

**Why needed:** EU regulatory environment changes frequently. Fit for 55, CSRD, ETS Phase 4, CBAM all have evolving requirements. Manual monitoring is unsustainable across 25+ industries.

**Cognitive pattern:** Chain-of-Thought (linear document processing)

---

### 7. DataReconciliationAgent

**What:** Cross-system data consistency verification between ERP, BIM, IoT, and energy meter sources.

**Why needed:** Architecture docs estimate 1-2 hours/day manual reconciliation per customer (~EUR 2,000/month savings per deployment).

**Cognitive pattern:** Tree-of-Thoughts (explores multiple resolution paths for discrepancies)

---

### 8-11. Sales Pipeline Agents

| Agent | Purpose |
|-------|---------|
| Meeting Agent | Calendar coordination, scheduling, reminders |
| Discovery Agent | Company research, MEDDPICC qualification, demo prep |
| Proposal Agent | ROI calculators, proposal drafting, contract templates |
| Customer Success Agent | NPS monitoring, churn prevention, upsell signals |

All have full YAML configs in `SALES_AI_AGENT_DESIGN_FI_v1.md` but zero implementation.

---

### 12. Investor Outreach Agent

**What:** VC/PE database management, warm intro paths, pitch deck versioning.

**Why needed:** Supports EUR 2M fundraising in H2 2026. Targets 500+ Nordic/EU climate tech investors.

---

## LOW - Q2-Q3 2026 (Internal Operations)

### 13-19. Internal DWS Team Agents

From AGENTS.md Section 4 - weekly automation cycle:

| Agent | Weekly Output |
|-------|--------------|
| Architect | ADRs, architecture diagrams, tech debt log |
| Builder | Code generation, test coverage reports |
| DevOps | Cost report, uptime metrics, CI/CD health |
| Security | Vulnerability scans, compliance checklists |
| Product | Weekly reports (EN/FI), roadmap updates |
| Market Signal | Market intelligence, product opportunities |
| Product Page Generator | Updated product/landing pages |

None of these are implemented. The "Weekly Coordination Cycle" in AGENTS.md Section 4 is aspirational.

---

## Key Risk: V1.0 Launch Gap

V1_FEATURE_LIST.md Section 4 says "AI Agents - Production Ready - 70% completion" with 5 agents. The architecture documents specify 3 additional MVP agents (Construction, Logistics, CustomerService) that are completely missing.

**Gap assessment:**
- 6 agents implemented (utility/analysis agents)
- 2 critical vertical agents missing (Construction, Logistics)
- 1 high-priority support agent missing (CustomerService)
- 7 sales agents documented but zero implemented

The implemented agents are horizontal utilities. The missing critical agents are vertical business logic. Without Construction and Logistics agents, DWS6 has analysis tools but no industry-specific workflows.

---

## Recommendation for HIL Decision

**Minimum viable agent set for launch:**

1. ConstructionAgent (CRITICAL) - ties together SiteSense, MaterialOracle, ScheduleGenius for construction workflows
2. Lead Scout + Outreach (HIGH) - enables pilot customer acquisition

**Everything else can ship post-V1.0** if the construction vertical agent orchestrates the existing 5 utility agents effectively.

**DeepWiki extraction opportunity:** Several of the missing agents (ComplianceMonitor, DataReconciliation) could benefit from extracting specific functionality from open-source EU compliance libraries rather than building from scratch.

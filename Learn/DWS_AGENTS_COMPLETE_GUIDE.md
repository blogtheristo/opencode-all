# DWS IQ 6 - Complete Agent Guide for Human-in-the-Loop (HIL) Understanding

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/deepwiki-agent-extraction-aS6Ub | Date: 11.02.2026 | Changes: Initial creation - comprehensive agent guide for HIL understanding and planning

Session Links & References:
  - Claude Code (claude/deepwiki-agent-extraction-aS6Ub): https://github.com/blogtheristo/dws6/commits/claude/deepwiki-agent-extraction-aS6Ub

Document Status:
  - Created: 11.02.2026
  - Last Modified: 11.02.2026
  - Language: English
  - Publication Status: ACTIVE

***

## Table of Contents

1. [Why This Document](#1-why-this-document)
2. [The DWS Agent Standard](#2-the-dws-agent-standard)
3. [Agent Categories Overview](#3-agent-categories-overview)
4. [Production Agents (Implemented)](#4-production-agents-implemented)
5. [V1.0 Development Agents (Sprint Fleet)](#5-v10-development-agents-sprint-fleet)
6. [Internal DWS Team Agents](#6-internal-dws-team-agents)
7. [Customer-Facing Agents](#7-customer-facing-agents)
8. [MCP Infrastructure](#8-mcp-infrastructure)
9. [Coordination: Lifetime Scope Signals](#9-coordination-lifetime-scope-signals)
10. [DeepWiki Extraction Pattern (New)](#10-deepwiki-extraction-pattern-new)
11. [How to Add a New Agent](#11-how-to-add-a-new-agent)
12. [Decision Framework: When to Use an Agent](#12-decision-framework-when-to-use-an-agent)
13. [Planning Next Steps](#13-planning-next-steps)

---

## 1. Why This Document

This document gives the human operator (HIL) a single place to understand every agent in the DWS IQ 6 ecosystem: what it does, where it lives, how it connects to other agents, and what decisions remain.

**Key files to pair with this:**
- `AGENTS.md` - Master index with signal maps
- `src/agents/` - Code implementations
- `docs/architecture/01-AGENT-DISCOVERY.md` - When to use an agent vs. a prompted model
- `.workflows/agents/ULTRA_AGENT_COORDINATOR.md` - Visual coordination guide

---

## 2. The DWS Agent Standard

There is no single "DWS Agent Standard" document. The standard is distributed across six layers:

### Layer 1: Code Pattern (`src/agents/base.agent.ts`)

Every agent extends `BaseAgent` and implements `execute()`:

```typescript
abstract class BaseAgent {
  protected config: AgentConfig;
  abstract execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse>;
  protected async logExecution(log: AgentExecutionLog): Promise<void>;
  protected async callLLM(prompt: string): Promise<{ content, model, inputTokens, outputTokens }>;
}
```

**Four core types (`src/agents/types.ts`):**

| Type | Purpose |
|------|---------|
| `AgentContext` | Who's calling: `projectId`, `userId`, `orgId`, `sessionId` |
| `AgentResponse` | What's returned: `result`, `confidence` (0-1), `reasoning`, `recommendations`, `metadata` |
| `AgentConfig` | Agent identity: `name` (kebab-case), `description`, `capabilities[]`, `model` |
| `AgentExecutionLog` | Audit trail: persisted to Supabase `agent_executions` table |

### Layer 2: Behavior Standard (`CLAUDE.md`)

Based on Karpathy's principles for agentic coding:
- Surface assumptions before implementing
- Stop and name confusion when encountering inconsistencies
- Push back on bad ideas (no sycophancy)
- Enforce simplicity (100 lines > 1000 lines)
- Touch only what you're asked to touch (scope discipline)
- Clean up dead code after refactors

### Layer 3: Architecture Standard (`docs/architecture/`)

10-phase blueprint from agent discovery through production deployment. Key phase: **Agent Necessity Matrix** that determines if a problem needs an agent, a prompted model, or cached responses.

### Layer 4: Coordination Standard (`.workflows/agents/`)

Lifetime Scope Signals protocol for multi-agent coordination. File-based, using `AGENT_SIGNAL_REGISTRY.json` and `coordinator.cjs`.

### Layer 5: Document Standard (`DWS_DOCUMENT_STANDARD.md`)

All agent-produced documents must include VERSION AND AGENT HISTORY blocks with tool, session ID, date, and change description.

### Layer 6: Security Standard (`DWS_SECURITY_STANDARD.md`)

Never include API keys, PII, or credentials. All agents log to Supabase for EU AI Act Article 12 compliance. Three autonomy tiers control what agents can do without human approval.

### AI Agent Guidelines Cross-Reference

`AI_AGENT_GUIDELINES.md` now defines the canonical rules for agent naming, metadata, versioning, and security. Earlier versions of this guide noted that such a file did not exist and that the guidance was scattered across the six layers above; that guidance has since been consolidated into `AI_AGENT_GUIDELINES.md`, which this document summarizes and cross-references.

---

## 3. Agent Categories Overview

```
DWS IQ 6 AGENT ECOSYSTEM
=========================

CATEGORY 1: Production Agents (9 implemented, in src/agents/)
  Code runs in Express backend, registered in AgentRegistry singleton.
  Used by customers via API endpoints.

CATEGORY 2: V1.0 Development Agents (10 planned, in .workflows/agents/)
  Claude/Cursor AI sessions building DWS IQ 6 for Feb 23 launch.
  Coordinated via Lifetime Scope Signals.

CATEGORY 3: Internal DWS Team Agents (7 planned)
  Architect, Builder, DevOps, Security, Product, Market Signal, Page Generator.
  Weekly cycle automation.

CATEGORY 4: Customer-Facing Agents (5+ planned, in AgentFoundry/)
  Per-vertical deployment with 3-phase rollout (silent -> advisor -> autonomous).
```

---

## 4. Production Agents (Implemented)

These five agents exist as TypeScript code in `src/agents/` and are registered in the `AgentRegistry` singleton (`src/agents/index.ts`).

### 4.1 SiteSense Agent (`sitesense.agent.ts`)

**Purpose:** Site monitoring and safety analysis for construction/industrial sites.

**What it does:**
- Takes site metrics: temperature, humidity, wind speed, worker count, incident count
- Calculates safety score against EU construction safety standards (EN 13001 for wind/crane ops)
- Returns weather risk level, safety recommendations, work restriction alerts

**Input:** `{ siteId, metrics: { temperature, humidity, windSpeed, workers, incidents } }`

**Key thresholds:**
- Wind > 17 m/s = stop outdoor elevated work
- Wind > 25 m/s = full site shutdown
- Temperature extremes: < -15C or > 40C = extreme risk

**Capabilities:** `site-monitoring`, `safety-analysis`, `weather-risk`, `worker-safety`

**LLM model:** Groq (Llama 3.1 70B) for fast inference

**Edge deployment:** Can run on NVIDIA Jetson Orin Nano for on-premise real-time monitoring.

---

### 4.2 ScheduleGenius Agent (`schedule-genius.agent.ts`)

**Purpose:** Timeline optimization using Critical Path Method (CPM).

**What it does:**
- Takes a list of project tasks with durations, dependencies, and progress percentages
- Computes earliest/latest start/finish times, total slack, critical path
- Identifies delayed and at-risk tasks
- Recommends schedule adjustments

**Input:** `{ projectId, tasks: [{ name, duration, dependencies[], progress }] }`

**Key logic:**
- Forward pass: earliest start/finish
- Backward pass: latest start/finish
- Slack = latest start - earliest start
- Critical path = all tasks with zero slack

**Capabilities:** `critical-path-analysis`, `schedule-optimization`, `delay-detection`, `resource-planning`

---

### 4.3 MaterialOracle Agent (`material-oracle.agent.ts`)

**Purpose:** Carbon footprint analysis and low-carbon material alternatives.

**What it does:**
- Analyzes materials against EN 15978 lifecycle stages (A1-A5, B, C, D)
- Uses ICE Database v3 emission factors (kgCO2e per unit)
- Computes embodied carbon per material and total project carbon
- Suggests lower-carbon alternatives

**Input:** `{ materials: [{ name, quantity, unit, supplier }] }`

**Key data:**
- Concrete: 0.132 kgCO2e/kg (A1-A3)
- Steel: 1.46 kgCO2e/kg (A1-A3), but -0.35 kgCO2e/kg in stage D (recycling credit)
- Timber: 0.31 kgCO2e/kg (A1-A3), but -0.55 kgCO2e/kg in stage D (carbon storage)
- Aluminum: 6.67 kgCO2e/kg (A1-A3)

**Capabilities:** `carbon-footprint`, `material-analysis`, `en15978-lifecycle`, `procurement-optimization`

---

### 4.4 CustomerSat Agent (`customer-sat.agent.ts`)

**Purpose:** Customer health scoring and churn prediction.

**What it does:**
- Calculates composite health score from NPS, ticket load, interaction recency, contract value
- Predicts churn probability
- Recommends retention actions

**Input:** `{ customerId, interactions, npsScore, openTickets, contractValue }`

**Scoring weights:**
- NPS: 30%
- Ticket load: 25%
- Interaction recency: 25%
- Contract value: 20%

**Key thresholds:**
- NPS 9-10 = promoter, 7-8 = passive, 0-6 = detractor
- Ticket risk normalized per EUR 100k contract value

**Capabilities:** `satisfaction-analysis`, `churn-prediction`, `retention-recommendations`

---

### 4.5 Viability Agent (`viability.agent.ts`)

**Purpose:** Unit economics, ROI, and carbon credit valuation for investment decisions.

**What it does:**
- Calculates ROI, payback period, NPV with 8% WACC discount rate
- Values carbon savings using EU ETS prices (EUR 55-120 per tonne CO2)
- Produces composite viability score

**Input:** `{ projectCost, revenue, carbonSaved, timeline, market }`

**Key parameters:**
- Current EU ETS price: EUR 68/tonne (Q1 2026)
- Default discount rate: 8% WACC
- Inflation: 2.5% EU average

**Capabilities:** `roi-calculation`, `npv-analysis`, `carbon-credit-valuation`, `payback-analysis`

---

## 5. V1.0 Development Agents (Sprint Fleet)

These are NOT code agents. They are Claude/Cursor AI sessions building the platform, coordinated via signals.

| ID | Name | Phase | What It Builds | Status |
|----|------|-------|----------------|--------|
| Agent-01 | Login System | 1 (Foundation) | JWT, OAuth, Supabase Auth | Running |
| Agent-02 | Firehorse Apps | 2 (Backend) | Reports, Automation, DMS APIs | Waiting |
| Agent-03 | Customer Dashboard | 3 (Frontend) | Vite + React web dashboard (dws6.com/dashboard/firehorse/v10-react/) | Waiting |
| Agent-04 | AI Agents | 2 (Backend) | MCP Hub, Groq integration, agent APIs | Waiting |
| Agent-05 | Mobile Dashboard | 3 (Frontend) | React Native/Expo mobile app | Waiting |
| Agent-06 | Enterprise Integrations | V1.1 | SAP, BIM/IFC connectors | **Deferred** |
| Agent-07 | Supabase Database | 1 (Foundation) | Schema, RLS policies, migrations | Running |
| Agent-08 | Payment Integration | 4 (Optional) | Stripe, subscriptions | Waiting |
| Agent-09 | Email System | 2 (Backend) | Transactional email via Resend | Waiting |
| Agent-10 | Documentation | 1 (Foundation) | API docs, guides | Running |

**Dependency chain:** Phase 1 must emit READY signals before Phase 2 can start.

---

## 6. Internal DWS Team Agents

Weekly automation cycle running Fridays:

| Agent | What It Does | Weekly Output |
|-------|-------------|---------------|
| Architect | System design decisions, tech debt tracking | ADRs, architecture diagrams |
| Builder | Code generation, implementation | Agent code, test coverage |
| DevOps | Infrastructure monitoring | Cost report, uptime metrics |
| Security | Vulnerability scanning, compliance checks | Scan results, compliance checklist |
| Product | Progress tracking, stakeholder reporting | Weekly report (EN/FI) |
| Market Signal | Market intelligence from EU regulatory sources | Market signal report |
| Page Generator | Dynamic sales page creation | Updated product/landing pages |

---

## 7. Customer-Facing Agents

Deployed per industry vertical with 3-phase rollout:

| Phase | Mode | Duration | Actions | Human Approval |
|-------|------|----------|---------|----------------|
| 1 | Silent Pilot | 30 days | Observe, report, calibrate | None needed |
| 2 | Advisor | 60 days | Recommend, flag risks | Required |
| 3 | Autonomous | Ongoing | Execute, send emails, create tasks | Exception only |

**Planned verticals:** Construction, Manufacturing, Energy (25+ EU industries total).

---

## 8. MCP Infrastructure

### MCP Hub (`mcp-hub/server.py`, port 8765)

Central orchestration with three workflow patterns:

1. **Fan-Out** - Execute tasks in parallel, aggregate results
2. **Reflection** - Implement -> evaluate -> improve loop (max 3 iterations, 0.85 threshold)
3. **Sequential** - Step-by-step with result passing between steps

**Specialized pipeline:** BIM -> Carbon calculation -> Compliance validation

### Supabase MCP Server (`mcp-servers/supabase/server.py`, port 8766)

Tools: `query_carbon_calculations`, `upsert_bim_metadata`, `get_compliance_rules`, `log_agent_activity`, `semantic_search`

### Cloudflare Worker Agent (`src/cloudflare/worker-agent.ts`)

Serverless edge execution with multi-tenancy, rate limiting, Durable Object sessions.

---

## 9. Coordination: Lifetime Scope Signals

### How it works

1. Agent reaches a milestone -> emits signal: `[AGENT-07]:READY:schema-users`
2. Downstream agents listen for required signals before starting
3. All signals tracked in `AGENT_SIGNAL_REGISTRY.json`

### Signal types

| Signal | Meaning |
|--------|---------|
| `READY` | Milestone done, dependents can proceed |
| `COMPLETE` | All work finished |
| `ERROR` | Failure, may block dependents |
| `BLOCKED` | Waiting for external input |

### Commands

```bash
cd .workflows/agents
node coordinator.cjs status          # All agent statuses
node coordinator.cjs ready           # Who can launch now
node coordinator.cjs emit agent-07 READY:schema-users
```

---

## 10. DeepWiki Extraction Pattern (New)

### The Concept

Based on Andrej Karpathy's workflow (February 2026): instead of importing entire libraries as dependencies, use an AI agent to:

1. **Understand** a GitHub repo via DeepWiki (swap "github" to "deepwiki" in any repo URL)
2. **Extract** the specific functionality you need
3. **Produce** self-contained, dependency-free code targeted for your exact use case

### Why This Matters for DWS

- EU compliance libraries are large and monolithic. We often need one specific calculation.
- ERP integration SDKs (SAP, IFS) carry massive dependency trees for narrow functionality.
- AI/ML libraries (torch, transformers) have features buried in complex abstractions.

### The Pattern

```
INPUT:  GitHub repo URL + description of what to extract
TOOLS:  DeepWiki MCP (understand repo) + GitHub CLI (access code)
OUTPUT: Self-contained module that does exactly what you need
```

### Bacterial Code Philosophy

Write code that is:
- **Self-contained** - no unnecessary imports or dependencies
- **Stateless** - easy to test, move, replace
- **Small** - 100 lines that work > 1000 lines of abstraction
- **Rippable** - can be extracted from the repo and used elsewhere

This aligns with the Karpathy principle already in CLAUDE.md: "Prefer the boring, obvious solution. Cleverness is expensive."

### Implementation

See `src/agents/deepwiki-extractor.agent.ts` - a new agent that implements this pattern within the DWS agent standard (extends `BaseAgent`, uses `AgentContext`/`AgentResponse`).

---

## 11. How to Add a New Agent

1. Create `src/agents/your-agent.agent.ts`
2. Extend `BaseAgent`
3. Define config: `{ name: 'kebab-case', description, capabilities[], model }`
4. Implement `execute(context, input)` returning `AgentResponse`
5. Register in `src/agents/index.ts`
6. Add API route in `src/agents/routes.ts` if needed
7. Update `AGENTS.md`

**Checklist:**
- [ ] Returns `confidence` score (0-1)
- [ ] Returns `reasoning` string explaining its logic
- [ ] Returns `recommendations[]` for actionable next steps
- [ ] Logs execution to Supabase via `this.logExecution()`
- [ ] Handles missing LLM API key gracefully (deterministic fallback)
- [ ] Input validated before processing

---

## 12. Decision Framework: When to Use an Agent

From `docs/architecture/01-AGENT-DISCOVERY.md`:

| Problem Shape | Solution |
|---------------|----------|
| Static response, no real-time data | Cached response |
| Static + needs retrieval | Prompted model + RAG |
| Single-step text generation | Prompted model |
| Single-step with tool use | Simple agent |
| Multi-system, single path | ReAct agent |
| Multi-system, multiple paths | Multi-agent system |

### Autonomy Tiers

| Tier | Actions | Approval |
|------|---------|----------|
| 1: Full Autonomy | Read-only queries, status checks | None |
| 2: Supervised | Data modifications, customer comms | Audit log + async review |
| 3: Human-in-Loop | Financial transactions, permit submissions | Explicit approval before execution |

---

## 13. Planning Next Steps

### Immediate (for HIL review)

1. **Gap:** `AI_AGENT_GUIDELINES.md` is missing. Consider creating it to consolidate the distributed standard into one reference.
2. **Gap:** No DeepWiki integration exists yet. The new `deepwiki-extractor` agent fills this.
3. **Decision needed:** Which V1.0 development agents should be prioritized given the Feb 23 timeline is compressed?

### Architectural Questions

1. Should the DeepWiki extraction pattern be an MCP server (shared across all agents) or a standalone agent?
2. Should extracted "bacterial code" modules go to a dedicated `src/extracted/` folder or inline where needed?
3. How should extracted code be audited for security before production use?

### Agent Fleet Expansion

Current production agents cover construction/industrial verticals. Planned expansions:
- Energy sector agents (carbon trading, grid optimization)
- Manufacturing agents (supply chain, quality control)
- Financial compliance agents (CSRD reporting, ESG scoring)

---

## Key File Locations

| Resource | Path |
|----------|------|
| Agent implementations | `src/agents/*.agent.ts` |
| Agent types | `src/agents/types.ts` |
| Agent registry | `src/agents/index.ts` |
| Agent API routes | `src/agents/routes.ts` |
| Master agent index | `AGENTS.md` |
| Signal coordinator | `.workflows/agents/coordinator.cjs` |
| Signal registry | `.workflows/agents/AGENT_SIGNAL_REGISTRY.json` |
| MCP Hub | `mcp-hub/server.py` |
| Architecture docs | `docs/architecture/` |
| Agent foundry configs | `AgentFoundry/configs/templates/` |
| Cloudflare worker agent | `src/cloudflare/worker-agent.ts` |

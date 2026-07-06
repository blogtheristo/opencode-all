# AGENTS.md - Master Agent Index

## DWS IQ 6 - Agent Architecture & Coordination

**Version:** 1.0  
**Created:** January 3, 2026  
**Owner:** Lifetime Oy  
**Status:** Active

---

## Table of Contents

1. [Agent Architecture Overview](#1-agent-architecture-overview)
2. [Lifetime Scope Signals Protocol](#2-lifetime-scope-signals-protocol)
3. [V1.0 Development Agents](#3-v10-development-agents)
4. [Internal DWS Team Agents](#4-internal-dws-team-agents)
5. [Customer-Facing Agents](#5-customer-facing-agents)
6. [MCP Servers Integration](#6-mcp-servers-integration)
7. [Agent Guidelines & Conventions](#7-agent-guidelines--conventions)
8. [Quick Reference](#8-quick-reference)

---

## 1. Agent Architecture Overview

> **Every agent operates by the 12 Engineering Discipline Rules.** Canonical source: [`CLAUDE.md`](CLAUDE.md) -> "Engineering Discipline — The 12 Rules"; agent-specific bindings in [`AI_AGENT_GUIDELINES.md`](AI_AGENT_GUIDELINES.md) §0. The rules are injected into every session by `.claude/hooks/session-start.sh`.

### Agent Types

DWS IQ 6 uses three categories of AI agents:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        DWS IQ 6 AGENT ECOSYSTEM                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  V1.0 DEVELOPMENT AGENTS (10 agents)                            │   │
│  │  Purpose: Build DWS IQ 6 for Feb 23, 2026 launch                │   │
│  │  Scope: One-time sprint, plan mode coordination                 │   │
│  │  Tools: Cursor AI, Claude, Gemini                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  INTERNAL DWS TEAM AGENTS (7 agents)                            │   │
│  │  Purpose: Design, build, deploy, secure, maintain DWS6         │   │
│  │  Scope: Ongoing operations, continuous improvement              │   │
│  │  Tools: LlamaStack, Groq, Claude                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CUSTOMER-FACING AGENTS (5+ agents)                             │   │
│  │  Purpose: Help customers optimize their businesses              │   │
│  │  Scope: Per-vertical deployment, phased rollout                 │   │
│  │  Tools: AgentFoundry configs, MCP Hub                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer                 | Technology                                              | Purpose                                 |
| --------------------- | ------------------------------------------------------- | --------------------------------------- |
| **Orchestration**     | MCP Hub (`mcp-hub/server.py`)                           | Central coordination, workflow patterns |
| **Fast Inference**    | Groq API (Llama 3.1 70B)                                | High-speed agent responses              |
| **Complex Reasoning** | Claude Sonnet 4.5                                       | Deep analysis, planning                 |
| **Multi-Agent**       | LlamaStack                                              | Agent orchestration                     |
| **Edge AI**           | NVIDIA Jetson                                           | On-premise SiteSense agents             |
| **Database**          | Supabase (PostgreSQL + pgvector)                        | Data, embeddings, signals               |
| **Notifications**     | Microsoft Teams (webhook), Slack (webhook), Email (SES) | Agent alerts                            |

### MCP Hub Coordination Patterns

The MCP Hub (`mcp-hub/server.py`) supports three workflow patterns:

1. **Fan-Out Pattern**: Parallel task distribution to multiple agents
2. **Reflection Pattern**: Self-review and iterative improvement
3. **Sequential Pattern**: Step-by-step task execution with dependencies

---

## 2. Lifetime Scope Signals Protocol

### What Are Lifetime Scope Signals?

Signals are the communication mechanism between agents. When an agent completes a milestone, it **emits** a signal. Other agents **listen** for signals before proceeding with dependent tasks.

### Signal Format

```
[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP
```

**Components:**

- `AGENT-XX`: Agent identifier (e.g., `AGENT-01`, `AGENT-07`)
- `SIGNAL_TYPE`: `READY`, `COMPLETE`, `ERROR`, `BLOCKED`
- `MILESTONE`: Specific deliverable (e.g., `supabase-auth`, `rls-policies`)
- `TIMESTAMP`: ISO 8601 format

**Examples:**

```
[AGENT-07]:READY:rls-policies:2026-01-05T14:30:00Z
[AGENT-01]:COMPLETE:v1-auth:2026-01-10T09:00:00Z
[AGENT-02]:BLOCKED:report-api:2026-01-06T10:15:00Z
```

### Signal Types

| Type       | Meaning                                          | Action                               |
| ---------- | ------------------------------------------------ | ------------------------------------ |
| `READY`    | Milestone achieved, dependent agents can proceed | Unblocks downstream agents           |
| `COMPLETE` | All agent work finished                          | Agent moves to complete status       |
| `ERROR`    | Agent encountered failure                        | Alerts coordinator, may block others |
| `BLOCKED`  | Agent waiting for external dependency            | No action until unblocked            |

### How Agents Learn Signals

#### Option A: File-Based (Current Implementation)

Agents read from `AGENT_SIGNAL_REGISTRY.json`:

```javascript
// coordinator.cjs
const registry = JSON.parse(fs.readFileSync("AGENT_SIGNAL_REGISTRY.json"));
const myDependencies = registry.agents["agent-02"].signals.listening;
const emittedSignals = collectEmittedSignals(registry);
const unmet = myDependencies.filter((sig) => !emittedSignals.has(sig));
// If unmet.length === 0, agent can proceed
```

**Commands:**

```bash
cd .workflows/agents
node coordinator.cjs status    # Show all agent statuses
node coordinator.cjs signals   # Show signal log
node coordinator.cjs ready     # Show which agents can launch
node coordinator.cjs emit agent-07 READY:schema-users  # Emit signal
```

#### Option B: MCP Hub Real-Time (Future)

```python
# mcp-hub/server.py addition
@app.post("/signals/emit")
async def emit_signal(agent_id: str, signal: str):
    await supabase.table("agent_signals").insert({...})
    await notify_listeners(agent_id, signal)
```

### Signal Dependency Map

```
PHASE 1 (Foundation - No Dependencies)
├── Agent-01 (Auth)      ──EMITS──► READY:supabase-auth
├── Agent-07 (Database)  ──EMITS──► READY:rls-policies, READY:schema-users
└── Agent-10 (Docs)      ──EMITS──► READY:api-docs
         │
         ▼
PHASE 2 (Core Backend - Needs Phase 1)
├── Agent-02 (Firehorse) ◄──LISTENS── Agent-01:supabase-auth, Agent-07:rls-policies
├── Agent-04 (AI Agents) ◄──LISTENS── Agent-07:rls-policies
└── Agent-09 (Email)     ◄──LISTENS── Agent-07:schema-users
         │
         ▼
PHASE 3 (Frontend - Needs Phase 2)
├── Agent-03 (Dashboard) ◄──LISTENS── Agent-02:report-api, Agent-04:customersat
└── Agent-05 (Mobile)    ◄──LISTENS── Agent-02:report-api, Agent-04:mcp-hub
         │
         ▼
PHASE 4 (Enhancements - Optional)
├── Agent-08 (Payments)  ◄──LISTENS── Agent-01:v1-auth, Agent-07:v1-database
└── Agent-06 (Enterprise) ⊘ DEFERRED TO V1.1
```

### Key Signal References

| File                                           | Purpose                        |
| ---------------------------------------------- | ------------------------------ |
| `.workflows/agents/AGENT_SIGNAL_REGISTRY.json` | Signal state database          |
| `.workflows/agents/ULTRA_AGENT_COORDINATOR.md` | Visual coordination guide      |
| `.workflows/agents/coordinator.cjs`            | CLI tool for signal management |

---

## 3. V1.0 Development Agents

**Purpose:** Build DWS IQ 6 for February 23, 2026 launch  
**Total:** 10 agents  
**Operating Mode:** Plan mode with Lifetime Scope Signals  
**Coordination:** `.workflows/agents/ULTRA_AGENT_COORDINATOR.md`

### Agent Fleet

| ID       | Name                    | Phase | Priority | Status   | Estimated Days |
| -------- | ----------------------- | ----- | -------- | -------- | -------------- |
| Agent-01 | DWS IQ Login System     | 1     | Critical | Running  | 3-4            |
| Agent-02 | Firehorse Apps          | 2     | Critical | Waiting  | 4-6            |
| Agent-03 | Customer Dashboard      | 3     | Critical | Waiting  | 5-7            |
| Agent-04 | AI Agents               | 2     | Critical | Waiting  | 5-7            |
| Agent-05 | Mobile Dashboard        | 3     | High     | Waiting  | 10-14          |
| Agent-06 | Enterprise Integrations | V1.1  | Low      | Deferred | 3-4            |
| Agent-07 | Supabase Database       | 1     | Critical | Running  | 2              |
| Agent-08 | Payment Integration     | 4     | Medium   | Waiting  | 3-4            |
| Agent-09 | Email System            | 2     | High     | Waiting  | 2              |
| Agent-10 | Documentation           | 1     | Low      | Running  | Ongoing        |

### Agent Details

#### Agent-01: DWS IQ Login System

**Signals Emitted:** `jwt-service`, `auth-middleware`, `supabase-auth`, `login-ui`, `oauth-google`, `oauth-microsoft`, `v1-auth`  
**Unlocks:** Agent-02, Agent-03, Agent-05, Agent-08  
**Reference:** `V1_FEATURE_LIST.md` Section 1

#### Agent-02: Firehorse Apps

**Listens For:** `Agent-01:supabase-auth`, `Agent-07:rls-policies`  
**Signals Emitted:** `report-api`, `automation-api`, `dms-upload`, `v1-firehorse`  
**Unlocks:** Agent-03, Agent-05  
**Reference:** `V1_FEATURE_LIST.md` Section 2, `Firehorse/` directory

#### Agent-03: Customer Dashboard

**Listens For:** `Agent-01:supabase-auth`, `Agent-02:report-api`, `Agent-04:customersat`  
**Signals Emitted:** `nextjs-setup`, `dashboard-layout`, `project-view`, `carbon-dashboard`, `agent-chat`, `v1-dashboard`  
**Reference:** `V1_FEATURE_LIST.md` Section 3

#### Agent-04: AI Agents

**Listens For:** `Agent-07:rls-policies`  
**Signals Emitted:** `mcp-hub`, `groq-integration`, `sitesense`, `schedulegenius`, `materialoracle`, `customersat`, `v1-agents`  
**Unlocks:** Agent-03, Agent-05  
**Reference:** `V1_FEATURE_LIST.md` Section 4, `mcp-hub/server.py`

#### Agent-05: Mobile Dashboard

**Listens For:** `Agent-01:supabase-auth`, `Agent-02:report-api`, `Agent-04:mcp-hub`  
**Signals Emitted:** `expo-setup`, `redux-store`, `navigation`, `dashboard-screen`, `projects-screen`, `offline-sync`, `v1-mobile`  
**Reference:** `V1_FEATURE_LIST.md` Section 5, `Firehorse/mobile-app/` (NCC scope folded in 2026-07-04; `mobile-dashboard_RETIRED/` for the original shell)

#### Agent-06: Enterprise Integrations

**Status:** DEFERRED TO V1.1  
**Reference:** `V1_FEATURE_LIST.md` Section 6

#### Agent-07: Supabase Database

**Signals Emitted:** `schema-users`, `schema-orgs`, `rls-policies`, `seed-data`, `v1-database`  
**Unlocks:** Agent-01, Agent-02, Agent-04, Agent-09  
**Reference:** `V1_FEATURE_LIST.md` Section 7, `supabase/` directory

#### Agent-08: Payment Integration

**Listens For:** `Agent-01:v1-auth`, `Agent-07:v1-database`  
**Signals Emitted:** `stripe-setup`, `subscription-plans`, `billing-ui`, `v1-payments`  
**Reference:** `V1_FEATURE_LIST.md` Section 8, `PAYMENT_INTEGRATION.md`

#### Agent-09: Email System

**Listens For:** `Agent-07:schema-users`  
**Signals Emitted:** `transactional`, `notifications`, `v1-email`  
**Reference:** `V1_FEATURE_LIST.md` Section 9

#### Agent-10: Documentation

**Signals Emitted:** `api-docs`, `integration-guides`, `v1-docs`  
**Reference:** `V1_FEATURE_LIST.md` Section 10

---

## 4. Internal DWS Team Agents

**Purpose:** Design, build, deploy, secure, and maintain DWS6
**Total:** 8 agents (6 development + 2 sales)
**Operating Mode:** Semi-automated → Autonomous
**Reference:** `CloudAgents/dws-team/README.md`

### Development Agents

| Agent                  | Role                                                       | Weekly Deliverable                        |
| ---------------------- | ---------------------------------------------------------- | ----------------------------------------- |
| **Architect Agent**    | System designer, technical decisions                       | ADRs, diagrams, tech debt log             |
| **Builder Agent**      | Code generator, implementation                             | Agent implementations, test coverage      |
| **DevOps Agent**       | Infrastructure automation                                  | Cost report, uptime report, CI/CD health  |
| **Security Agent**     | Security hardening, compliance                             | Vulnerability scans, compliance checklist |
| **Product Agent**      | Progress tracking, reporting                               | Weekly reports (EN/FI), roadmap updates   |
| **Design Audit Agent** | Premium UI/UX architecture, Steve Jobs/Jony Ive philosophy | Design audit plans, phased improvements   |

### Sales & Market Intelligence Agents

| Agent                      | Role                                  | Weekly Deliverable                          |
| -------------------------- | ------------------------------------- | ------------------------------------------- |
| **Market Signal Agent**    | Market intelligence, demand detection | Market signal report, product opportunities |
| **Product Page Generator** | Dynamic sales page creation           | Updated product pages, landing pages        |

### Weekly Coordination Cycle

**Fridays:**

1. Market Signal Agent → market insights
2. Product Page Generator → page updates
3. DevOps Agent → cost data + metrics
4. Security Agent → scan results
5. Builder Agent → code review summary
6. Architect Agent → architecture changelog
7. Product Agent → compiles final report

---

## 5. Customer-Facing Agents

**Purpose:** Help customers optimize their businesses  
**Deployment:** Per-vertical (Construction, Manufacturing, Energy)  
**Phases:** Silent Pilot → Advisor → Autonomous  
**Reference:** `AgentFoundry/` directory

### Core Agents

| Agent                    | Purpose                             | Template                                             |
| ------------------------ | ----------------------------------- | ---------------------------------------------------- |
| **CustomerSat Agent**    | Monitor satisfaction, prevent churn | `configs/templates/customer-satisfaction-agent.yaml` |
| **Viability Agent**      | Unit economics, financial health    | `configs/templates/viability-agent.yaml`             |
| **SiteSense Agent**      | Edge AI, site monitoring            | `SiteSense/` (NVIDIA Jetson)                         |
| **ScheduleGenius Agent** | Timeline optimization               | Planned                                              |
| **MaterialOracle Agent** | Carbon tracking, procurement        | Planned                                              |

### Deployment Phases

```yaml
# Phase 1: Silent Pilot (30 days)
mode: "silent_pilot"
actions: ["observe", "generate_reports", "calibrate"]
approval: none
output: "Daily reports to Slack and/or Microsoft Teams"

# Phase 2: Advisor (60 days)
mode: "advisor"
actions: ["recommend", "flag_risks", "suggest_actions"]
approval: required
output: "Recommendations with human approval"

# Phase 3: Autonomous
mode: "autonomous"
actions: ["execute", "send_emails", "create_tasks"]
approval: exception_only
guardrails: ["max_emails", "approval_for_discounts"]
```

### Proactive Agents — Observe → Act (Code Wiring)

The deployment phases above are now enforced in the TypeScript agent runtime via
`AgentConfig.autonomyPhase` (`silent_pilot` | `advisor` | `autonomous`, default
`silent_pilot`). The "observe → act" loop is implemented by:

| Concern                                                    | Module                                     |
| ---------------------------------------------------------- | ------------------------------------------ |
| What to watch + 2×2 "worth interrupting" gate              | `src/agents/signal-catalogue.ts`           |
| Phase ladder + comparison                                  | `src/agents/autonomy.ts`                   |
| Nudge chokepoint (dedup, rate limit, escalation, delivery) | `src/agents/nudge.service.ts`              |
| Background observation cron + escalation sweep             | `src/agents/signal-poller.ts`              |
| Confirm / Override / Dismiss / Investigate handling        | `src/agents/nudge-response-handler.ts`     |
| `send_notification` agent tool (KYA phase-gated, BLUE)     | `src/agents/tools.ts`                      |
| Persisted nudge state                                      | `supabase/migrations/069_agent_nudges.sql` |

**Currently promoted to Phase 2 (advisor):** `sitesense`, `compliance`,
`customer-sat`. All other agents remain `silent_pilot` and cannot send nudges.

**Guardrails:** an agent below `advisor` is refused `send_notification` at the
tool gate; nudges are deduplicated per `(orgId, signalKey, entityId)` while
pending, rate-limited per agent (default 5/hour, 20/day, counted from the
persisted table so limits hold across instances), and escalated after a 4h
no-response window via the poller's restart-safe `escalate_at` sweep.

### Agent Configuration Structure

```yaml
agent:
  id: "customersat-construction-001"
  model:
    provider: "anthropic"
    name: "claude-sonnet-4.5"
    temperature: 0.3

  system_prompt: |
    You are a Customer Satisfaction Specialist...

  knowledge_base:
    - type: "vector_db"
      provider: "supabase_pgvector"
    - type: "api"
      provider: "hubspot_crm"

  deployment:
    phase_1: { mode: "silent_pilot", duration_days: 30 }
    phase_2: { mode: "advisor", duration_days: 60 }
    phase_3: { mode: "autonomous" }

  tools:
    - name: "query_crm"
    - name: "calculate_health_score"
    - name: "send_notification"

  cost_tracking:
    budget_monthly_eur: 100
```

---

## 6. MCP Servers Integration

### Active MCP Servers

| Server          | Purpose                                  | Status |
| --------------- | ---------------------------------------- | ------ |
| **Docker MCP**  | Container management, GitHub integration | Active |
| **Snyk MCP**    | Security scanning                        | Active |
| **Browser MCP** | Web testing, UI verification             | Active |

### Available MCP Servers (Not Configured)

| Server                | Purpose              | Required Secrets    |
| --------------------- | -------------------- | ------------------- |
| **Stripe MCP**        | Payment integration  | `stripe.secret_key` |
| **Stripe Remote MCP** | Remote Stripe access | -                   |

### Adding New MCP Servers

```bash
# Find available servers
docker mcp find <query>

# Add server (requires secrets)
docker mcp secret set <server>.<secret>=<value>
docker mcp add <server>

# Example: Add Stripe
docker mcp secret set stripe.secret_key=sk_live_xxx
docker mcp add stripe --activate
```

### MCP Hub Endpoints

| Endpoint                | Method | Purpose                                            |
| ----------------------- | ------ | -------------------------------------------------- |
| `/`                     | GET    | Service info                                       |
| `/health`               | GET    | Health check with MCP server status                |
| `/workflows/execute`    | POST   | Execute workflow (fan-out, reflection, sequential) |
| `/pipelines/bim-carbon` | POST   | BIM Carbon analysis pipeline                       |

---

## 7. Agent Guidelines & Conventions

### Platform Agents (`src/agents/`)

Code-backed agents (one `*.agent.ts` per row). This table is verified against
the filesystem by `scripts/verify-agents-md.mjs` — keep it in sync when adding
or removing an agent.

| Agent                    | Role                                              |
| ------------------------ | ------------------------------------------------- |
| `agora`                  | Collective intelligence / multi-agent consensus   |
| `argus`                  | Geospatial SAR signal intelligence (orbital)      |
| `auditor`                | Audit trail + explainability (XAI)                |
| `cassandra`              | Predictive analytics + recommendations            |
| `chronos`                | Regulatory deadline & scheduling intelligence     |
| `compliance`             | EU regulatory compliance (Fit for 55, CBAM, CSRD) |
| `compliance-researcher`  | Regulatory research & deadline tracking           |
| `construction`           | Construction project compliance orchestrator      |
| `customer-sat`           | Customer satisfaction & churn analysis            |
| `daedalus`               | Tool composition + MCP bridge                     |
| `deepwiki-extractor`     | Code extraction from GitHub repositories          |
| `designer`               | Design-to-code bridge                             |
| `emissions-data-analyst` | Natural-language queries on emissions data        |
| `kb`                     | Knowledge base compile / query                    |
| `logistics`              | Fleet & supply-chain compliance orchestrator      |
| `material-oracle`        | Carbon footprint & procurement (LCA)              |
| `minerva`                | Knowledge transfer + explainability               |
| `mnemosyne`              | Long-term memory oracle                           |
| `panacea`                | Self-improving / adaptive optimization            |
| `quality-gate`           | Quality-gate / QA verification                    |
| `sales-outreach`         | B2B lead research & personalized outreach         |
| `schedule-genius`        | Timeline & critical-path optimization             |
| `sitesense`              | Site monitoring & safety analysis                 |
| `sovereignty-monitor`    | Database sovereignty assessment                   |
| `synthetic-data`         | CBAM synthetic-data pipeline                      |
| `themis`                 | Legal intelligence + case coordinator             |
| `viability`              | Unit economics & carbon-credit valuation          |
| `vision-oracle`          | Vision language model / image analysis            |

### Documentation Standards

All AI agents follow `AI_AGENT_GUIDELINES.md`:

- **Naming:** `[Document] - [Tool] - [SessionID] - Versio X.Y`
- **Metadata:** Tool, SessionID, Version required
- **Versioning:** 0.1 → 0.2 → ... → 1.0
- **Git Integration:** `claude/[task]-[SessionID]` branches

### Security Requirements

From `AI_AGENT_GUIDELINES.md` Part 8:

**NEVER include in documents:**

- API keys, secrets, passwords
- PII without anonymization
- Credentials or tokens

**ALWAYS include:**

- Anonymized examples
- Architecture diagrams
- Decision rationales

### Agent Cost Tracking

Each agent has a monthly budget:

```yaml
cost_tracking:
  budget_monthly_eur: 100-150
  alert_at_percentage: 80
  model_costs:
    claude_sonnet_4_5:
      input_per_1m_tokens: 3.00
      output_per_1m_tokens: 15.00
```

---

## 8. Quick Reference

### File Locations

| Resource                  | Path                                           |
| ------------------------- | ---------------------------------------------- |
| V1.0 Feature List         | `V1_FEATURE_LIST.md`                           |
| Signal Registry           | `.workflows/agents/AGENT_SIGNAL_REGISTRY.json` |
| Coordinator Script        | `.workflows/agents/coordinator.cjs`            |
| Coordinator Guide         | `.workflows/agents/ULTRA_AGENT_COORDINATOR.md` |
| Design Audit Agent        | `.workflows/agents/DESIGN_AUDIT_AGENT.md`      |
| Design Audit Admin Manual | `ADMIN_MANUAL_DESIGN_AUDIT_AGENT.md`           |
| Agent Guidelines          | `AI_AGENT_GUIDELINES.md`                       |
| DWS Team Agents           | `CloudAgents/dws-team/README.md`               |
| Customer Agent Configs    | `AgentFoundry/configs/templates/`              |
| MCP Hub                   | `mcp-hub/server.py`                            |

### Common Commands

```bash
# V1.0 Agent Coordination
cd .workflows/agents
node coordinator.cjs status           # All agent statuses
node coordinator.cjs ready            # Ready to launch
node coordinator.cjs emit agent-07 READY:schema-users  # Emit signal

# MCP Servers
docker mcp find stripe               # Find MCP server
docker mcp add stripe                # Add server

# Start MCP Hub
cd mcp-hub && python server.py
```

### V1.0 Completion Criteria

| Agent    | Completion Signal        | Required for V1.0 |
| -------- | ------------------------ | ----------------- |
| Agent-01 | `COMPLETE:v1-auth`       | YES               |
| Agent-02 | `COMPLETE:v1-firehorse`  | YES               |
| Agent-03 | `COMPLETE:v1-dashboard`  | YES               |
| Agent-04 | `COMPLETE:v1-agents`     | YES               |
| Agent-05 | `COMPLETE:v1-mobile`     | TestFlight OK     |
| Agent-06 | `COMPLETE:v1-enterprise` | V1.1              |
| Agent-07 | `COMPLETE:v1-database`   | YES               |
| Agent-08 | `COMPLETE:v1-payments`   | Optional          |
| Agent-09 | `COMPLETE:v1-email`      | YES               |
| Agent-10 | `COMPLETE:v1-docs`       | YES               |

### Timeline

- **Launch Date:** February 23, 2026
- **Days Remaining:** 51
- **Estimated Work:** 41-56 days
- **Buffer:** -5 to 10 days

---

## Related Documents

- [V1_FEATURE_LIST.md](V1_FEATURE_LIST.md) - Complete feature tracking
- [AI_AGENT_GUIDELINES.md](AI_AGENT_GUIDELINES.md) - Documentation standards
- [ARCHITECTURE_SUMMARY.md](ARCHITECTURE_SUMMARY.md) - System architecture
- [CloudAgents/dws-team/README.md](CloudAgents/dws-team/README.md) - Internal agents
- [AgentFoundry/README.md](AgentFoundry/README.md) - Customer-facing agents
- [ADMIN_MANUAL_DESIGN_AUDIT_AGENT.md](ADMIN_MANUAL_DESIGN_AUDIT_AGENT.md) - Design Audit Agent usage guide

---

## Cursor Cloud specific instructions

### Services overview

| Service         | Path                                      | Start command           | Port |
| --------------- | ----------------------------------------- | ----------------------- | ---- |
| Express Backend | `/workspace`                              | See startup notes below | 3001 |
| React Dashboard | `dws6.com/dashboard/firehorse/v10-react/` | `npm run dev`           | 5173 |

### Starting the Express backend

The backend's `auth.service.ts` validates `JWT_SECRET` at module-load time (before `dotenv.config()` runs in `app.ts`). You must export the env vars **before** running `npm run dev`:

```bash
JWT_SECRET="dev-jwt-secret-key-for-local-development-only-32chars" \
SUPABASE_URL="https://placeholder.supabase.co" \
SUPABASE_SERVICE_KEY="placeholder-service-key" \
STRIPE_SECRET_KEY="sk_test_placeholder_key_for_dev" \
npm run dev
```

Or source the `.env` file properly in your shell. The `.env.example` has these placeholders but `dotenv` loads too late due to ES module import ordering.

### Known pre-existing issues

- **TypeScript build (`npm run build`)**: Has pre-existing type errors in `booking.routes.ts`, `erp-tracking.routes.ts`, `browser.ts`, `gtm-client.ts`. The project uses `tsx watch` for dev, not `tsc`.
- **Dashboard ESLint (`npm run lint` in v10-react)**: Missing `parent-module` transitive dependency from `import-fresh` → ESLint 9.39 issue. Does not affect Vite dev server or build.
- **Redis warnings**: Backend logs Redis connection errors at startup (expected without Redis running). The app degrades gracefully.
- **Supabase "degraded"**: Without real Supabase credentials, `/health` reports degraded status. The server still starts and responds to requests.

### Tests

Run tests from workspace root: `npx vitest run`. Tests are self-contained and do not require external services. 53/56 test files pass; 4 failures are pre-existing in the compliance-agent-integration suite.

### Lint

Root backend has `"lint": "echo \"No linter configured\""` — no real linter. Dashboard linting has the upstream dependency issue noted above.

---

**Document Version:** 1.0  
**Last Updated:** July 5, 2026  
**Status:** Active  
**Next Review:** January 10, 2026

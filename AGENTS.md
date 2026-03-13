# AGENTS.md

> Following the [agents.md](https://github.com/agentsmd/agents.md) open specification.
> A README for AI coding agents: context, instructions, and operational guidance.

**Version:** 2.2
**Created:** January 3, 2026
**Updated:** March 7, 2026
**Owner:** Lifetime Oy
**Status:** Active

---

## 1. Project Context

**DWS IQ 6** is a platform to **train and run enterprise industrial agent swarms safely** following DWS standards. It governs autonomous AI agents across 20 EU-regulated industries with hardware-attested isolation (KYA Standard), court-defensible audit trails (Firehorse), and governed self-optimization (autoresearch).

**Architecture:** Brain-Memory-Body-Hands

- **Brain**: DWS IQ 6 Platform (Agent Swarm Training & Orchestration — KYA-governed)
- **Memory**: Lifetime World Model (Climate LLM + EU Regulations + Industry Models)
- **Body**: Firehorse Suite (Forensic Telemetry, Reports, Automation, Content DMS, Omnichannel)
- **Hands**: Lifetime Fleet (IoT/Robots for physical execution)

**Tech stack:** React 19, Vite 7, TypeScript 5.9, TailwindCSS 4, Express 4, Supabase (PostgreSQL + pgvector), Groq (Llama 3.3 70B), Claude, Google Cloud Run (europe-north1), Cloudflare Workers/Pages, NVIDIA Jetson Orin Nano.

---

## 2. Development Environment

### Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Fill in: SUPABASE_URL, SUPABASE_SERVICE_KEY, GROQ_API_KEY, JWT_SECRET
```

### Key Commands

```bash
# Backend
npm run dev          # Express backend with hot reload (tsx watch)
npm run build        # TypeScript compilation
npm run test         # Vitest test suite
npm run lint         # ESLint

# Dashboard (in dws6.com/dashboard/firehorse/v9-react/)
npm run dev          # Vite dev server
npm run build        # Production build

# Agent Coordination
cd .workflows/agents
node coordinator.cjs status    # All agent statuses
node coordinator.cjs ready     # Which agents can launch
node coordinator.cjs signals   # Signal log
node coordinator.cjs emit <agent> <signal>  # Emit signal

# MCP Hub
cd mcp-hub && python server.py

# Docker
docker-compose -f docker-compose.hybrid.yml up -d
```

### Important: Always use `npm run dev` while iterating. Avoid production builds during agent sessions.

---

## 3. Code Conventions

### TypeScript

- Strict TypeScript with `tsconfig.json` enforced
- Zod schemas for runtime validation at system boundaries
- Interface-first design for API contracts
- Kebab-case for file names, PascalCase for classes, camelCase for functions/variables

### Agent Code

- All agents extend `BaseAgent` from `src/agents/base.agent.ts`
- Agent names use kebab-case: `customer-sat`, `sitesense`, `compliance-monitor`
- Every agent returns `AgentResponse` with `confidence`, `reasoning`, `recommendations`
- Execution is logged to Supabase `agent_executions` table
- LLM calls go through `this.callLLM()` which handles Groq API fallback gracefully

### React (Dashboard)

- Functional components with hooks
- TailwindCSS for styling, component co-location
- Located in `dws6.com/dashboard/firehorse/v9-react/`

### Security (Non-negotiable)

- Never hardcode API keys, secrets, or tokens
- Use `process.env.*` with `.env` files only
- Email sender must be `risto@onelifetime.world` (verified Resend domain)
- JWT authentication on all agent API routes
- Input validation with express-validator
- EU data residency (Finland/Germany) for all customer data

---

## 4. Testing

```bash
# Run all tests
npm run test

# Run specific test
npx vitest run src/__tests__/specific-test.ts

# Run with UI
npm run test:ui
```

- Tests live in `src/__tests__/`
- Use Vitest (not Jest)
- All new agent code must include tests
- Test the deterministic scoring logic, not the LLM output

---

## 5. Repository Structure

```
dws6/
├── src/agents/              # Agent implementations (V2 core)
│   ├── base.agent.ts        # Abstract base class
│   ├── types.ts             # AgentContext, AgentResponse, AgentConfig
│   ├── index.ts             # AgentRegistry (singleton)
│   ├── routes.ts            # Express API routes (/api/agents/*)
│   ├── customer-sat.agent.ts
│   ├── sitesense.agent.ts
│   ├── schedule-genius.agent.ts
│   ├── material-oracle.agent.ts
│   ├── viability.agent.ts
│   ├── compliance.agent.ts       # V2: EU compliance monitoring
│   └── quality-gate.agent.ts     # V2: Code & deployment quality
├── src/app.ts               # Main Express app
├── src/middleware/           # Auth, rate limiting
├── src/integrations/        # ERP (SAP, IFS, Dynamics) & ESG
├── src/mcp/                 # MCP implementation
├── mcp-hub/                 # MCP orchestration hub (Python FastAPI)
├── mcp-servers/             # Individual MCP servers
├── AgentFoundry/            # Customer-facing agent configs (YAML)
├── .workflows/agents/       # Signal coordination system
├── dws6.com/                # Web applications
├── Firehorse/               # Product suite
├── landing-pages/           # Production landing pages
├── supabase/migrations/     # Database migrations
└── .github/workflows/       # CI/CD (15 workflows)
```

---

## 6. Agent API

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/api/agents` | JWT | List all registered agents |
| `GET` | `/api/agents/:name` | JWT | Get agent details |
| `POST` | `/api/agents/:name/execute` | JWT + Rate limit | Execute agent |

### Execute Request

```json
{
  "context": {
    "projectId": "proj-123",
    "sessionId": "sess-456"
  },
  "input": {
    // agent-specific payload
  }
}
```

`userId` and `orgId` are injected from the JWT token, not the request body.

### Rate Limits

- 30 executions per minute per IP
- Configurable via `express-rate-limit`

---

## 7. Agent Ecosystem (V2)

### Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         DWS IQ 6 AGENT ECOSYSTEM V2                         │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  PLATFORM AGENTS (7 agents) — Runtime production agents             │     │
│  │  customer-sat | sitesense | schedule-genius | material-oracle        │     │
│  │  viability | compliance | quality-gate                              │     │
│  │  Stack: TypeScript, BaseAgent, Groq Llama 3.3 70B                   │     │
│  │  API: /api/agents/:name/execute                                     │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  DEVELOPMENT AGENTS (10 agents) — Build-time coordination           │     │
│  │  Agent-01..Agent-10, Lifetime Scope Signals protocol                │     │
│  │  Stack: File-based signals, coordinator.cjs CLI                     │     │
│  │  Status: Phase 1-4 phased rollout                                   │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  TEAM AGENTS (7 agents) — Ongoing operations                        │     │
│  │  Architect | Builder | DevOps | Security | Product                  │     │
│  │  Market Signal | Product Page Generator                             │     │
│  │  Weekly Friday coordination cycle                                   │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  WORKFLOW AGENTS (2 agents) — CI/CD automation                      │     │
│  │  audit-agent.js | fix-agent.js                                      │     │
│  │  Stack: Node.js CLI, GitHub workflow analysis                       │     │
│  │  Location: .workflows/agents/                                       │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  MCP ORCHESTRATION — Multi-agent coordination                       │     │
│  │  Hub: mcp-hub/server.py (FastAPI)                                   │     │
│  │  Patterns: Fan-Out | Reflection | Sequential                       │     │
│  │  Servers: Docker MCP | ZenFree | Browser MCP                       │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────┐     │
│  │  BYO AGENTS (External) — Customer-deployed third-party agents      │     │
│  │  Microsoft CoWork | Tencent Workbuddy | Clawbot | Anthropic Cowork │     │
│  │  Gate: KYA 6-Stage Registration (IDV → KYB → Capability → Sandbox) │     │
│  │  Runtime: Firecracker MicroVM, zero shared kernel, KYA trust score │     │
│  │  See: §18 BYO Lifecycle, Legal/KYA_SECURITY_v1.2.md                │     │
│  └────────────────────────────────────────────────────────────────────┘     │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Platform Agents (Runtime)

These are production agents that customers interact with via the API.

| Agent | Name | Purpose | Model |
|-------|------|---------|-------|
| `customer-sat` | CustomerSat | Customer health scoring, churn prediction, retention | Llama 3.3 70B |
| `sitesense` | SiteSense | Site safety scoring, weather risk, worker capacity | Llama 3.3 70B |
| `schedule-genius` | ScheduleGenius | Timeline optimization, resource allocation | Llama 3.3 70B |
| `material-oracle` | MaterialOracle | Carbon tracking, sustainable procurement | Llama 3.3 70B |
| `viability` | Viability | Unit economics, financial health, LTV | Llama 3.3 70B |
| `compliance` | **Compliance** (V2) | EU regulatory compliance monitoring | Llama 3.3 70B |
| `quality-gate` | **QualityGate** (V2) | Deployment readiness, quality scoring | Llama 3.3 70B |
| `sovereignty-monitor` | **SovereigntyMonitor** (V2) | Database sovereignty assessment, CLOUD Act exposure | Llama 3.3 70B |
| `designer` | **Designer** (V2) | Design-to-code bridge: Figma→prototype, style changes, components, edge case audit | Claude Sonnet 4 |

---

## 8. V2 Agents: Design & Purpose

### Compliance Agent (`compliance`)

**Why:** The EU AI Act (August 2026 deadline), Fit for 55, ETS, CBAM, and CSRD create a compliance matrix that is too complex for manual tracking. This agent automates compliance gap analysis and Article 12 logging readiness.

**Capabilities:**
- `eu-regulation-compliance` — Check project against Fit for 55, ETS, CBAM, CSRD
- `article-12-readiness` — EU AI Act Article 12 automatic logging assessment
- `carbon-boundary-check` — CBAM carbon boundary verification
- `compliance-gap-analysis` — Identify gaps between current state and requirements

**Input:**
```typescript
{
  projectId: string;
  industry: string;         // e.g., "construction", "manufacturing", "energy"
  regulations: string[];    // e.g., ["fit-for-55", "ets", "cbam", "csrd"]
  currentMeasures: {
    carbonReporting: boolean;
    emissionsMonitoring: boolean;
    supplyChainDueDiligence: boolean;
    aiSystemLogging: boolean;
  };
  annualEmissions: number;  // tonnes CO2e
  importValue: number;      // EUR, for CBAM threshold
}
```

**Output:** Compliance score (0-100), gap list, deadline urgency, remediation recommendations.

### Quality Gate Agent (`quality-gate`)

**Why:** With 15 CI/CD workflows, multiple deployment targets (GCP, Cloudflare, Hetzner), and dual-folder landing page structure, deployment quality requires automated validation before release.

**Capabilities:**
- `deployment-readiness` — Pre-deployment quality checks
- `test-coverage-analysis` — Test coverage assessment against thresholds
- `security-scan-summary` — Aggregate security scan results
- `landing-page-sync-check` — Verify dual-folder sync (root vs landing-pages)

**Input:**
```typescript
{
  projectId: string;
  deployTarget: string;      // "gcp" | "cloudflare" | "hetzner"
  testResults: {
    passed: number;
    failed: number;
    skipped: number;
    coverage: number;        // percentage
  };
  securityScan: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  buildStatus: string;       // "success" | "failure" | "pending"
}
```

**Output:** Gate decision (pass/fail/warn), quality score (0-100), blocking issues, recommendations.

### Sovereignty Monitor Agent (`sovereignty-monitor`)

**Why:** The CLOUD Act (2018) allows US authorities to access data held by US-owned providers regardless of server location. 78% of EU companies plan to reduce US cloud dependency. This agent automates database sovereignty assessment across 8 dimensions and provides continuous monitoring with HIL escalation.

**Capabilities:**
- `database-sovereignty-assessment` — Score database sovereignty across 8 dimensions (0–100)
- `cloud-act-exposure-check` — Detect US-owned provider CLOUD Act risk
- `data-residency-verification` — Verify EU data residency compliance
- `gdpr-database-readiness` — GDPR DSAR, deletion, consent process readiness
- `nis2-database-compliance` — NIS2 critical infrastructure data handling

**Input:**
```typescript
{
  host?: string;              // Database hostname
  provider?: string;          // e.g., "supabase-eu", "aws", "hetzner"
  region?: string;            // e.g., "europe-north1", "eu-west-1"
  tables?: string[];          // Tables to assess
  industry?: string;          // Industry context
  encryptionAtRest?: boolean;
  encryptionInTransit?: boolean;
  rlsEnabled?: boolean;
  rlsCoverage?: number;       // 0-100%
  backupRegion?: string;
  accessControlMethod?: string; // e.g., "rbac", "jwt"
  gdprDsarProcess?: boolean;
  gdprDeletionProcess?: boolean;
  gdprConsentManagement?: boolean;
}
```

**Output:** Sovereignty score (0–100), tier (sovereign/compliant/partial/exposed), 8-dimension check results, gap list, remediation recommendations. HIL escalation triggered when confidence < 80%.

**CLI:**
```bash
dws sovereignty-assess --input '{"provider":"aws","region":"eu-west-1","encryptionAtRest":true}'
```

**Product:** Sovereign Database (SKU: DWS-SOVEREIGN-DB-001) — 4 tiers: Assess (free), Standard (€499/mo), Growth (€1,499/mo), Enterprise (€4,999/mo).

### Designer Agent (`designer`)

**Why:** At Anthropic, designers now ship production code with no engineer in the loop. They paste Figma screenshots into Claude Code and get functional prototypes. They implement front-end changes directly in the codebase. They make state management changes. They file GitHub issues and Claude proposes fixes that they review and ship. This agent brings that workflow to DWS IQ 6 — enabling non-technical designers to ship production code safely.

**The Anthropic Pattern:**
1. Designer takes Figma mockup → pastes into Claude Code → gets functional prototype
2. Designer implements typefaces, colors, spacing, layout directly in codebase
3. Designer makes state management changes (with engineer review)
4. Designer files GitHub issue → agent proposes code fix → designer reviews and ships
5. Designer maps edge cases during design phase, before engineering starts

**Capabilities:**
- `screenshot-to-code` — Convert Figma/design screenshots to working React + TailwindCSS
- `style-implementation` — Implement visual changes (colors, fonts, spacing, layout) directly
- `component-creation` — Generate new UI components with all states and edge cases
- `state-management` — Guided state management changes with safety checks
- `design-polish` — Fix visual bugs and polish issues from natural language descriptions
- `edge-case-audit` — Discover edge cases during design phase (8 categories, 30+ checks)
- `design-review` — Review components against design system, accessibility, responsive standards

**Input:**
```typescript
{
  action: "screenshot-to-code" | "style-change" | "component-create" |
          "state-change" | "polish-fix" | "edge-case-audit" | "design-review";
  description: string;        // Plain language — "make the sidebar wider and darker"
  screenshot?: string;        // Base64 or URL of design mockup
  targetFile?: string;        // Optional file path to modify
  framework?: string;         // "react" | "html" | "vue" (default: "react")
  designSystem?: {            // Custom tokens (defaults to DWS Brand)
    colors?: Record<string, string>;
    fonts?: { heading?: string; body?: string };
    spacing?: { unit: number; scale: number[] };
  };
}
```

**Output:** Code changes, plain-language explanations, complexity classification (safe/moderate/review-required), engineer review flag, ship recommendation.

**Safety model:** Visual-only changes (CSS, spacing, colors) are `safe` to ship without engineer review. State management changes always require engineer review. The agent classifies every change and flags when an engineer should review before shipping.

**CLI:**
```bash
dws run designer --input '{"action":"style-change","description":"make the primary button larger with rounded corners"}'
dws run designer --input '{"action":"edge-case-audit","description":"user profile settings form"}'
```

---

## 9. How to Add a New Agent

Follow this pattern exactly:

### Step 1: Create the agent file

```bash
# File: src/agents/your-agent.agent.ts
```

```typescript
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

interface YourAgentInput {
  // Define input schema
}

export class YourAgent extends BaseAgent {
  constructor() {
    super({
      name: 'your-agent',           // kebab-case, unique
      description: 'One sentence',
      capabilities: ['cap-1', 'cap-2'],
      model: 'llama-3.3-70b-versatile',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const typedInput = input as unknown as YourAgentInput;

    // Log start
    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input, output: null, status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    // 1. Deterministic scoring first (naive then optimize)
    // 2. LLM enhancement via this.callLLM()
    // 3. Build response

    const durationMs = Date.now() - startTime;

    const response: AgentResponse = {
      agentName: this.config.name,
      result: { /* your output */ },
      confidence: 0.85,
      reasoning: 'Explain the scoring logic',
      recommendations: ['Action 1', 'Action 2'],
      metadata: { durationMs },
    };

    // Log completion
    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input, output: response, status: 'completed',
      duration_ms: durationMs,
      created_at: new Date().toISOString(),
    });

    return response;
  }
}
```

### Step 2: Register in the registry

```typescript
// src/agents/index.ts — add import and registration
import { YourAgent } from './your-agent.agent.js';

// In registerDefaults():
this.register(new YourAgent());
```

### Step 3: Add tests

```typescript
// src/__tests__/your-agent.test.ts
```

### Step 4: Update this file

Add the agent to the Platform Agents table in Section 7.

---

## 10. Lifetime Scope Signals Protocol

### Signal Format

```
[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP
```

| Component | Description |
|-----------|-------------|
| `AGENT-XX` | Agent identifier (e.g., `AGENT-01`, `AGENT-07`) |
| `SIGNAL_TYPE` | `READY` / `COMPLETE` / `ERROR` / `BLOCKED` |
| `MILESTONE` | Specific deliverable (e.g., `supabase-auth`) |
| `TIMESTAMP` | ISO 8601 |

### Signal Commands

```bash
cd .workflows/agents
node coordinator.cjs status                         # All statuses
node coordinator.cjs ready                          # Ready to launch
node coordinator.cjs emit agent-07 READY:rls-policies  # Emit signal
```

### Dependency Map

```
PHASE 1 (Foundation)
├── Agent-01 (Auth)      → READY:supabase-auth
├── Agent-07 (Database)  → READY:rls-policies, READY:schema-users
└── Agent-10 (Docs)      → READY:api-docs
         │
PHASE 2 (Core Backend)
├── Agent-02 (Firehorse) ← Agent-01, Agent-07
├── Agent-04 (AI Agents) ← Agent-07
└── Agent-09 (Email)     ← Agent-07
         │
PHASE 3 (Frontend)
├── Agent-03 (Dashboard) ← Agent-02, Agent-04
└── Agent-05 (Mobile)    ← Agent-02, Agent-04
         │
PHASE 4 (Enhancements)
├── Agent-08 (Payments)  ← Agent-01, Agent-07
└── Agent-06 (Enterprise) → DEFERRED V1.1
```

---

## 11. MCP Orchestration

### Hub (`mcp-hub/server.py`)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Service info |
| `/health` | GET | Health check with MCP server status |
| `/workflows/execute` | POST | Execute workflow (fan-out, reflection, sequential) |
| `/pipelines/bim-carbon` | POST | BIM carbon analysis pipeline |

### Workflow Patterns

1. **Fan-Out**: Parallel task distribution to multiple agents
2. **Reflection**: Self-review and iterative improvement
3. **Sequential**: Step-by-step with dependencies

### Active MCP Servers

| Server | Purpose |
|--------|---------|
| Docker MCP | Container management, GitHub integration |
| ZenFree | Security scanning (replaced Snyk) |
| Browser MCP | Web testing, UI verification |

---

## 12. Team Agents (Operations)

Weekly Friday coordination cycle:

| Order | Agent | Deliverable |
|-------|-------|-------------|
| 1 | Market Signal Agent | Market insights, demand detection |
| 2 | Product Page Generator | Updated product/landing pages |
| 3 | DevOps Agent | Cost report, uptime, CI/CD health |
| 4 | Security Agent | Vulnerability scans, compliance checklist |
| 5 | Builder Agent | Code review summary, agent implementations |
| 6 | Architect Agent | ADRs, architecture changelog |
| 7 | Product Agent | Compiles final weekly report (EN/FI) |

---

## 13. Agent Cost Tracking

Every agent has a monthly budget:

```yaml
cost_tracking:
  budget_monthly_eur: 100-150
  alert_at_percentage: 80
  model_costs:
    llama_3_3_70b:
      provider: groq
      input_per_1m_tokens: 0.59
      output_per_1m_tokens: 0.79
    claude_sonnet_4_5:
      provider: anthropic
      input_per_1m_tokens: 3.00
      output_per_1m_tokens: 15.00
```

---

## 14. PR & Contribution Guidelines

- Branch naming: `claude/<feature>-<sessionId>` for AI-assisted work
- All agent routes require JWT authentication
- Input validation with express-validator on all new endpoints
- Test deterministic logic (scoring, thresholds) - not LLM output
- Follow the dual-folder rule for landing pages (root folder first, then landing-pages/)
- Never commit `.env`, credentials, or API keys
- Title format for agent PRs: `[agents] Description of change`

---

## 15. Quick Reference

### File Locations

| Resource | Path |
|----------|------|
| Agent implementations | `src/agents/` |
| Agent registry | `src/agents/index.ts` |
| Agent API routes | `src/agents/routes.ts` |
| Agent types | `src/agents/types.ts` |
| Signal registry | `.workflows/agents/AGENT_SIGNAL_REGISTRY.json` |
| Signal coordinator | `.workflows/agents/coordinator.cjs` |
| MCP Hub | `mcp-hub/server.py` |
| AgentFoundry configs | `AgentFoundry/configs/` |
| Workflow agents | `.workflows/agents/audit-agent.js`, `fix-agent.js` |
| Tests | `src/__tests__/` |

### External CLIs & Add-ons

See [Section 16](#16-rise-of-clis--external-add-ons): **our output** (DWS CLI, Firehorse via CLI/API) and **external add-on** (Google Workspace CLI `gws`).

### Environment Variables (Agent-relevant)

| Variable | Required | Purpose |
|----------|----------|---------|
| `GROQ_API_KEY` | Yes | Groq API for Llama inference |
| `SUPABASE_URL` | Yes | Database connection |
| `SUPABASE_SERVICE_KEY` | Yes | Database auth |
| `JWT_SECRET` | Yes | API authentication |
| `ANTHROPIC_API_KEY` | Optional | Claude for complex reasoning |
| `PORT` | Optional | Server port (default 3000) |

---

## 16. Rise of CLIs & External Add-ons

**Context:** In 2026, CLIs are first-class agent interfaces. Agents (and humans) benefit from tools that expose structured JSON output, tab-completion, `--help`/`--dry-run`, and MCP or skill surfaces. DWS follows this with the DWS CLI and Firehorse (agent-accessible via CLI/API); the same pattern applies to external tooling.

### Our output: DWS CLI & Firehorse CLI

| CLI | Invocation | Purpose |
|-----|------------|---------|
| **DWS CLI** | `dws` (or `npx tsx cli/src/cli.ts`) | Platform CLI: list/run agents, trigger workflows, discover by capability, health, MCP tools. Zero deps, JSON-only, pipeable. |
| **Firehorse** | Via DWS CLI + API + dashboard | Firehorse Suite (Report, Omnichannel, Automation, Content DMS) is agent-accessible via `dws run`, `dws workflow`, and `/api/`; same Build for Agents pattern. |

**DWS CLI commands (examples):**
```bash
dws agents                              # List all agents (JSON)
dws run compliance --input '{"reg":"CSRD"}'
dws run sitesense --input '{"siteId":"..."}'
dws workflow compliance-assessment
dws discover carbon
dws workflows
dws health
dws mcp tools
```

**Config:** `DWS_API_URL`, `DWS_API_TOKEN`, `DWS_PROJECT`, `DWS_SESSION`. See `cli/src/cli.ts` and [CLAUDE.md](CLAUDE.md) Build for Agents.

**API key for Cline:** To get a token for Cline (or for `DWS_API_TOKEN`), run `node scripts/generate-cline-api-key.cjs` from the repo root (requires `JWT_SECRET` in `.env`). The script prints a 90-day JWT; use it in Cline as the API key when connecting to a DWS endpoint, or set as `DWS_API_TOKEN` for the CLI.

### Important add-on: Google Workspace CLI (`gws`)

| Item | Detail |
|------|--------|
| **Repo** | https://github.com/googleworkspace/cli |
| **Install** | `npm install -g @googleworkspace/cli` |
| **What it is** | One CLI for Drive, Gmail, Calendar, Sheets, Docs, Chat, Admin — dynamically built from Google Discovery Service. Zero boilerplate, structured JSON output. |
| **Why it matters** | 40+ agent skills included; MCP server (`gws mcp -s drive,gmail,calendar`); Gemini CLI extension. Fits the same "Build for Agents" pattern: every response is structured JSON, so LLMs can manage Workspace without custom tooling. |
| **Auth** | `gws auth setup` (interactive), service account, or exported credentials for headless/CI. |
| **Use with DWS** | Optional add-on for agents that need to read/write Google Drive, send Gmail, or manage Calendar/Sheets/Docs; pair with MCP client config or OpenClaw skills. |

**Disclaimer:** Not an officially supported Google product (Apache-2.0). Use for automation and agent workflows where Google Workspace integration is required.

---

## 17. Compliance Scoring Engine Architecture

Added: March 7, 2026 | MVP Feature 2

The Compliance Scoring Engine is the core product logic — deterministic, testable, no LLM dependency for scoring. The existing `ComplianceAgent` (`src/agents/compliance.agent.ts`) now delegates real calculations to the scoring engine.

### Architecture

```
ComplianceAgent (orchestration layer)
  ├── scoring-engine.ts (deterministic scoring)
  │   ├── scoreCsrdReadiness()  — ESRS data point coverage
  │   ├── scoreEtsExposure()    — emissions threshold analysis
  │   └── scoreCbamRisk()       — import value risk assessment
  ├── esrs-registry.ts (82 ESRS disclosures, E1-E5/S1-S4/G1)
  ├── report-generator.ts (structured JSON for auditors)
  └── LLM (gap analysis enhancement — optional)
```

### Scoring Formula

```
CSRD Score = (mandatory data points provided / total mandatory) × 80
           + transition plan bonus (10)
           + emissions monitoring bonus (10)

ETS Score  = 100 - penalties for:
           - No emissions monitoring (-40 if above threshold)
           - No transition plan (-20)
           - No GHG data E1-6 (-25)

CBAM Score = 100 - penalties for:
           - No supply chain DD (-40 if above €150K imports)
           - No supplier data G1-2 (-20)
           - No pollution data E2-4 (-15)

Overall    = CSRD × 0.50 + ETS × 0.25 + CBAM × 0.25
```

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/compliance/assess` | Run compliance assessment, returns scored report |
| GET | `/api/v1/compliance/registry` | Get ESRS disclosure registry (filterable by standard/category/mandatory) |

### Database Schema

| Table | Purpose |
|-------|---------|
| `compliance_profiles` | Organization compliance profile (industry, emissions, imports) |
| `esrs_data_points` | Individual ESRS disclosure data (82 possible per profile) |
| `compliance_assessments` | Assessment results with scores and gaps |

All tables have RLS policies scoped to `organization_id`.

### Middleware Stack (Required Order)

All compliance routes use the following middleware chain:

1. `correlationId` → trace ID
2. `validate({ body: AssessmentSchema })` → Zod validation
3. Route handler → calls `scoreCompliance()` + `generateReport()`
4. `errorHandler` → catches and formats errors

---

## 18. Bring Your Own Agent (BYO) Lifecycle & KYA Trust Framework

*Added: March 9, 2026 — Session: claude/sandbox-industrial-models-GXxbN*

The DWS10 Control Room manages 16 industrial-grade models in isolated sandboxes. Customers can deploy third-party agents — Microsoft CoWork, Tencent Workbuddy, Clawbot, or any MCP-compatible agent — into the environment via the **BYO (Bring Your Own) Agent** process.

Every BYO agent is governed by the **KYA (Know Your Agent)** protocol, a DWS IQ feature that extends KYC/KYB to autonomous agents.

### 18.1 KYA Three Pillars

| Pillar | Name | Function |
|--------|------|----------|
| 1 | **Identity Attribution** (The Anchor) | Cryptographically binds agent session to KYC-verified human/entity |
| 2 | **Capability Gating** (The Leash) | Real-time risk telemetry dynamically adjusts agent permissions |
| 3 | **Forensic Observability** (The Firehorse Audit Trail) | Sub-second syscall + network telemetry, immutable audit chain |

### 18.2 BYO Agent Registration (6-Stage Gate)

```
Customer Request
    │
    ▼
┌──────────────────────────────────┐
│ Stage 1: Registration            │  Agent manifest submitted to DWS Agent Registry
│ (No identity gate)               │  Manifest: name, version, provider, requested MCP tools
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│ Stage 2: Identity Binding        │  ← IDV GATE (BLOCKING)
│ Human operator verified          │  Document + face match + AML screen
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│ Stage 3: Org Verification        │  ← KYB GATE (BLOCKING for BYO)
│ Organization behind agent        │  Business verification, UBO checks
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│ Stage 4: Capability Review       │  MCP tool approval against org policy
│ What tools does it need?         │  DWS IQ admin reviews requested capabilities
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│ Stage 5: Sandbox Entry           │  ← KYA SCORE CHECK (≥ 50 to enter)
│ Firecracker MicroVM spun up      │  Isolated runtime, tier-based limits
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│ Stage 6: Runtime Monitoring      │  Continuous telemetry (Firehorse)
│ + Dynamic Restriction            │  ← WEBHOOK on risk change
│                                  │  Sandbox permissions adjust in real-time
└──────────────────────────────────┘
```

### 18.3 KYA Trust Score

The KYA trust score determines sandbox permissions. Identity provider risk signals are the master key.

| Score | Sandbox Tier | Description |
|-------|-------------|-------------|
| ≥ 80 | **Full Agency** | Egress, filesystem, all MCP tools, write to models |
| 50–79 | **Restricted** | No egress, read-only FS, curated MCP tools |
| < 50 | **Suspended** | Human review required, agent paused |
| = 0 | **Quarantine** | Agent terminated, Firehorse forensic dump triggered |

**Dynamic adjustment:** If an identity provider webhook signals a risk change (AML hit, document expiry, anomalous behavior), the hypervisor adjusts sandbox permissions in < 5 seconds.

### 18.4 Hardware Isolation (Firecracker MicroVMs)

Every BYO agent runs in a dedicated Firecracker MicroVM with zero shared kernel access.

| Property | Value |
|----------|-------|
| Boot time | < 125 ms |
| Memory overhead | < 5 MB per MicroVM |
| Guest kernel | Isolated per sandbox |
| Host kernel access | None (paravirtualized) |
| Egress control | Hypervisor-level, per-session whitelist |

```
Operator (KYA Score: 87)
    │
    ├── MicroVM-1: CoWork      [egress: microsoft.com]
    ├── MicroVM-2: Workbuddy   [egress: api.tencent.com]
    ├── MicroVM-3: Clawbot     [egress: none (air-gapped)]
    └── MicroVM-4: Cowork      [egress: api.anthropic.com]

Cross-sandbox access → TRAP → SESSION FROZEN → KYA score −30
```

### 18.5 BYO Agent Manifest Schema

Every BYO agent must submit a manifest at registration (Stage 1):

```json
{
  "agent": {
    "name": "Clawbot",
    "version": "2.1.0",
    "provider": "OpenClaw Ltd",
    "provider_country": "DE"
  },
  "capabilities": {
    "mcp_tools_requested": ["material-oracle", "schedule-genius"],
    "egress_endpoints": ["api.openclaw.io"],
    "filesystem": "read-write",
    "max_tokens_per_request": 16000
  },
  "identity": {
    "operator_email": "ops@example.com",
    "org_registration_id": "HRB-12345-DE"
  }
}
```

### 18.6 Sandbox Stages (Integration with DWS Security Standard §14)

| Stage | Runtime | Isolation | KYA Gate |
|-------|---------|-----------|----------|
| 1 | SDK native | No network, read-only FS | L1 IDV only |
| 1.5 | Acer Veriton GN100 (Helsinki) | Ephemeral Docker, air-gapped EU | L1 + L2 |
| 2 | Cloud Run ephemeral | Sandboxed by default | L1 + L2 + L3 |
| 3 | Production (Firecracker MicroVM) | Full hardware isolation | All 5 layers |

### 18.7 Firehorse Forensic Logging

| Layer | Data Captured | Retention |
|-------|---------------|-----------|
| Syscall | File I/O, process spawns, IPC | 90 days |
| Network | Egress/ingress, DNS lookups | 90 days |
| MCP Tool | Invocations, parameters, responses | 1 year |
| Token Usage | Input/output tokens per agent per session | 1 year |
| Identity Events | KYA score changes, permission adjustments | 5 years (EU AI Act Art. 12) |

### 18.8 Related Standards

| Standard | Section | Scope |
|----------|---------|-------|
| `DWS_SECURITY_STANDARD.md` | §14 (Sandbox Isolation), §18 (KYA & BYO) | Security controls, trust model |
| `Legal/KYA_STANDARD_v1.md` | v1.0–v1.1 | Public foundational KYA document |
| `Legal/KYA_SECURITY_v1.2.md` | v1.2 | Know Your Agent — identity, isolation, forensics, guardrails |
| `Legal/KYA_OPTIMIZATION_v1.4.md` | v1.4 | Know Your Architecture — autoresearch, financial value, orchestrator |
| `src/cloudflare/tenant-sandbox.ts` | Implementation | Sandbox tiers, rate limiting, usage tracking |
| `docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md` | Field note | Partnership strategy, email drafts |
| `docs/field-notes/2026-03-09-shufti-kya-technical-requirements.md` | Tech spec | Integration points for identity providers |

---

## Related Documents

- [CLAUDE.md](CLAUDE.md) - AI coding agent behavior guidelines
- [AI_AGENT_GUIDELINES.md](AI_AGENT_GUIDELINES.md) - Documentation standards
- [DWS_SECURITY_STANDARD.md](DWS_SECURITY_STANDARD.md) - Security framework
- [ARCHITECTURE_SUMMARY.md](ARCHITECTURE_SUMMARY.md) - System architecture
- [V1_FEATURE_LIST.md](V1_FEATURE_LIST.md) - Feature tracking
- [CloudAgents/dws-team/README.md](CloudAgents/dws-team/README.md) - Team agents
- [AgentFoundry/README.md](AgentFoundry/README.md) - Customer-facing agent configs

---

**Document Version:** 2.3
**Last Updated:** March 9, 2026
**Standard:** [agents.md](https://github.com/agentsmd/agents.md) v1.0
**Next Review:** April 4, 2026

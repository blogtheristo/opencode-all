# AGENTS.md

> Following the [agents.md](https://github.com/agentsmd/agents.md) open specification.
> A README for AI coding agents: context, instructions, and operational guidance.

**Version:** 2.2
**Created:** January 3, 2026
**Updated:** April 6, 2026
**Owner:** Lifetime Oy
**Status:** Active

---

## 1. Project Context

**DWS IQ 6** is a platform to **run enterprise industrial AI agents safely** following DWS standards. It provides multi-agent delegation with EU compliance scoring, ERP integration, and sales automation.

**Architecture:** Brain-Memory-Body-Hands

- **Brain**: DWS IQ 6 Platform (Multi-Agent Orchestration via delegation & event bus — 16+ TypeScript agents with deterministic scoring)
- **Memory**: Lifetime World Model (EU Regulations + Industry Models — *external dependency, not built in this repo*)
- **Body**: Firehorse Suite (Omnichannel sales automation ✅ | Signed Reports ✅ | Report Engine 🔧 | Automation 🔧 | Content DMS 📋)
- **Hands**: Lifetime Fleet (IoT/Robots — *specification phase*)

**Maturity key:** ✅ Shipped | 🔧 Skeleton/In Progress | 📋 Planning Only

**Tech stack:** React 19, Vite 7, TypeScript 5.6, TailwindCSS 4, Express 4.19.19.19.19.19.19.19.19.19.19.19.19.19.19.19.19.19.19.19, Supabase (PostgreSQL + pgvector), Groq (Llama 3.3 70B), Claude, Google Cloud Run (europe-north1), Cloudflare Workers/Pages, NVIDIA Jetson Orin Nano.

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

# DWS CLI (v1.1.0)
dws status                     # Quick environment + connection check
dws agents --format table      # List agents in human-readable table
dws health                     # Backend + MCP health check
dws version                    # Show CLI version
dws run compliance --input '{"industry":"steel"}'
dws config                     # Show current configuration

# MCP (server-side only — no local MCP servers)
dws mcp tools                  # List tools from Cloud Run /mcp
dws mcp call <tool> --args '{}' # Call tool via Cloud Run

# Docker (CI/CD image builds only — NOT required on workstation)
# docker-compose -f docker-compose.hybrid.yml up -d  # DEPRECATED: services moving to Cloud Run
# See Section 20: Deployment Architecture for current model
```

### Important: Always use `npm run dev` while iterating. Avoid production builds during agent sessions.

### Important: Docker is NOT required on developer or customer workstations. All services run on Cloud Run. Docker is only used for building container images in CI/CD pipelines. See Section 20.

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
└── .github/workflows/       # CI/CD (42 workflows)
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

16+ platform agents (TypeScript classes with deterministic scoring), Claude Code skills (prompt-based orchestration), MCP orchestration hub.
→ Architecture diagrams, agent details, input/output schemas: [docs/AGENT_ECOSYSTEM.md](docs/AGENT_ECOSYSTEM.md)

### Platform Agents (Runtime)

| Agent | Name | Purpose | Model |
|-------|------|---------|-------|
| `customer-sat` | CustomerSat | Customer health scoring, churn prediction, retention | Llama 3.3 70B |
| `sitesense` | SiteSense | Site safety scoring, weather risk, worker capacity | Llama 3.3 70B |
| `schedule-genius` | ScheduleGenius | Timeline optimization, resource allocation | Llama 3.3 70B |
| `material-oracle` | MaterialOracle | Carbon tracking, sustainable procurement | Llama 3.3 70B |
| `viability` | Viability | Unit economics, financial health, LTV | Llama 3.3 70B |
| `synthetic-data` | SyntheticDataAgent | CBAM synthetic data pipeline — generates, validates, and stress-tests  | Llama 3.3 70B |
| `kb` | KBAgent | List all files in kb/raw/ with their paths, sizes, and modification timestamps. Use to discover raw sources that need compilation. | Llama 3.3 70B |
| `compliance` | **Compliance** (V2) | EU regulatory compliance monitoring | Llama 3.3 70B |
| `quality-gate` | **QualityGate** (V2) | Deployment readiness, quality scoring | Llama 3.3 70B |
| `sovereignty-monitor` | **SovereigntyMonitor** (V2) | Database sovereignty assessment, CLOUD Act exposure | Llama 3.3 70B |
| `designer` | **Designer** (V2) | Design-to-code bridge: Figma→prototype, style changes, components, edge case audit | Claude Sonnet 4 |
| `argus` | ArgusAgent | AI orbital target labeling — detects and classifies industrial targets across 20 DWS industries from ICEYE SAR satellite imagery. KYA Vision Pillar 5. | Llama 3.3 70B |
| `compliance-researcher` | ComplianceResearcherAgent | Researches EU climate regulations (CSRD, ETS, CBAM, Fit for 55, NIS2, EU AI Act, Taxonomy) and generates compliance reports with impact assessments | Llama 3.3 70B |
| `construction` | ConstructionAgent | Orchestrates construction project compliance by coordinating SiteSense, MaterialOracle, ScheduleGenius, and Viability agents with Finnish/EU construction regulations | Llama 3.3 70B |
| `deepwiki-extractor` | DeepWikiExtractorAgent | Analyzes GitHub repositories via DeepWiki to plan extraction of specific functionality into self-contained, dependency-free code | Llama 3.3 70B |
| `emissions-data-analyst` | EmissionsDataAnalystAgent | Analyzes emissions and sustainability data using natural language queries with EU regulatory context (ETS, CSRD, CBAM, EN 15978) | Llama 3.3 70B |
| `logistics` | LogisticsAgent | Orchestrates fleet compliance, route optimization, driver dispatch, and supply chain carbon tracking for EU-regulated logistics operations | Llama 3.3 70B |
| `sales-outreach` | SalesOutreachAgent | Researches target companies and drafts personalized B2B outreach emails for DWS climate compliance products | Llama 3.3 70B |
| `compliance` | Compliance (V2) | EU regulatory compliance monitoring | Llama 3.3 70B |
| `quality-gate` | QualityGate (V2) | Deployment readiness, quality scoring | Llama 3.3 70B |
| `sovereignty-monitor` | SovereigntyMonitor (V2) | Database sovereignty assessment | Llama 3.3 70B |

---

## 8. V2 Agent Details

V2 agents: Compliance, Quality Gate, Sovereignty Monitor — full input/output schemas, capabilities, and product details.
→ [docs/AGENT_ECOSYSTEM.md](docs/AGENT_ECOSYSTEM.md#v2-agent-details)

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

→ Full guide with code template, registration, tests, cost tracking: [docs/AGENT_DEVELOPMENT_GUIDE.md](docs/AGENT_DEVELOPMENT_GUIDE.md)

Quick steps: 1) Create `src/agents/your-agent.agent.ts` extending `BaseAgent`, 2) Register in `src/agents/index.ts`, 3) Add tests, 4) `agents-md-sync` auto-updates this table, 5) Add Claude Code skill.

---

## 10. Lifetime Scope Signals Protocol

Development agent coordination via file-based signals. Commands: `node coordinator.cjs status|ready|emit`.
→ Full protocol, signal format, dependency map: [docs/SIGNAL_PROTOCOL.md](docs/SIGNAL_PROTOCOL.md)

---

## 11. MCP Orchestration

> **2026-03-26 SECURITY UPDATE:** All local MCP servers permanently removed from developer/customer workstations following the clawdbot incident. MCP protocol is now **server-side only** — accessible via Cloud Run `/mcp` endpoint or CLI `dws mcp` commands. See Section 20 for full deployment architecture.

### MCP Access Model (Post-Clawdbot)

```
BEFORE (vulnerable):  Workstation → local .mcp.json → local MCP servers → tools
AFTER  (secure):      Workstation → dws CLI → Cloud Run /mcp → server-side MCP tools
```

**Banned:** `.mcp.json` on customer workstations, local MCP server processes, community MCP skill auto-install.
**Allowed:** `.mcp.json` in CI/CD pipelines, Cloud Run service-to-service MCP, developer workstations for DWS core team only (with explicit risk acceptance).

### Server-Side MCP Endpoints

| Endpoint | Location | Purpose |
|----------|----------|---------|
| `dws6run6/mcp` | Cloud Run | Agent MCP server (JSON-RPC 2.0, all 18+ agents as tools) |
| `mcp-gateway` | Cloud Run | MCP Gateway (Supabase, GitHub integration) |

### CLI MCP Commands

```bash
dws mcp tools                           # List all MCP tools (from Cloud Run)
dws mcp call <tool> --args '{...}'     # Call MCP tool via Cloud Run
```

### Workflow Patterns

1. **Fan-Out**: Parallel task distribution to multiple agents
2. **Reflection**: Self-review and iterative improvement
3. **Sequential**: Step-by-step with dependencies

---

## 12. Team Agents & Cost Tracking

7 team agents in weekly Friday coordination cycle. Budget: €100-150/agent/month.
→ Details: [docs/AGENT_ECOSYSTEM.md](docs/AGENT_ECOSYSTEM.md#team-agents-operations)
→ Cost tracking: [docs/AGENT_DEVELOPMENT_GUIDE.md](docs/AGENT_DEVELOPMENT_GUIDE.md#agent-cost-tracking)

---

## 14. PR & Contribution Guidelines

- Branch naming: `claude/<feature>-<sessionId>` for AI-assisted work
- All agent routes require JWT authentication
- Input validation with express-validator on all new endpoints
- Test deterministic logic (scoring, thresholds) - not LLM output
- Follow the dual-folder rule for landing pages (root folder first, then landing-pages/)
- Never commit `.env`, credentials, or API keys
- Title format for agent PRs: `[agents] Description of change`
- For new code files and major rewrites, include Code Versioning Note per `DWS_DOCUMENT_STANDARD.md` §19 (must reference `Introduced-In: PR-<number>`, e.g. `PR-699`)
- If env contract changes, update `.env.example` and bump `ENV_SCHEMA_VERSION` (schema version only, never secrets)

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

**DWS CLI commands (v1.1.0):**
```bash
dws agents                              # List all agents (JSON)
dws agents --format table               # Human-readable table output
dws run compliance --input '{"reg":"CSRD"}'
dws run sitesense --input '{"siteId":"..."}'
dws workflow compliance-assessment
dws discover carbon
dws workflows
dws health                              # Backend + MCP health check
dws status                              # Quick env + connection check
dws config                              # Show current config
dws version                             # CLI version info
dws mcp tools                           # List MCP tools
dws mcp call dws_compliance --args '{...}'  # Direct MCP tool call
```

**Output options:** `--format json|table|compact`, `--quiet` (suppress info messages).

**Typo correction:** Mistyped commands show "Did you mean?" suggestions.

**Error messages:** Connection failures now show actionable fix instructions.

**Config:** `DWS_API_URL`, `DWS_API_TOKEN`, `DWS_PROJECT`, `DWS_SESSION`. See `cli/src/cli.ts` and [CLAUDE.md](CLAUDE.md) Build for Agents.

**MCP Client Quickstart:** See `docs/MCP_CLIENT_QUICKSTART.md` for connecting Claude Code, Cursor, VS Code, or Python clients to the MCP Hub.

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

### Important add-on: gstack (Claude Code Skill System)

| Item | Detail |
|------|--------|
| **Repo** | https://github.com/blogtheristo/gstack |
| **Origin** | Designed by Garry Tan (Y Combinator President & CEO) |
| **What it is** | Six cognitive modes for Claude Code — separates planning, review, shipping, QA, and retrospective into distinct skills with role-based prompts. |
| **Why it matters** | "Planning is not review, review is not shipping, founder taste is not engineering rigor." Each mode enforces a different standard of rigor at the right phase. |
| **License** | MIT |

**Six Skills (adapted for DWS6):**

| Skill | Role | Claude Code Command | Purpose |
|-------|------|---------------------|---------|
| Plan (CEO) | Founder/CEO | `/plan-ceo-review` | 10-star product review, scope challenge, strategic fit |
| Plan (Eng) | Engineering Manager | `/plan-eng-review` | Architecture lock, data flow, edge cases, security |
| Review | Staff Engineer | `/review` | Production-breaking bug hunt, security, DWS compliance |
| Ship | Release Engineer | `/ship` | Automated sync, test, commit, push, PR creation |
| Browse | QA Engineer | `/browse` | Browser automation, screenshots, UI verification |
| Retro | Engineering Manager | `/retro` | Weekly velocity analysis, work patterns, recommendations |

**Recommended workflow:** `/plan-ceo-review` → `/plan-eng-review` → implement (test-first) → `/review` → `/ship` → `/retro` (weekly)

**DWS adaptations:** All six skills are customized for DWS6 standards — Build for Agents rule, Boardy security checks, dual-folder sync, RLS enforcement, and DWS Document Standard compliance are integrated into the review and shipping phases.

### Important add-on: Agent Browser (`agent-browser`)

| Item | Detail |
|------|--------|
| **Repo** | https://github.com/vercel-labs/agent-browser |
| **Install** | `npm install -g agent-browser && agent-browser install` (also: `cargo install agent-browser`, `brew install agent-browser`) |
| **What it is** | Native Rust headless browser automation CLI for AI agents. 140+ commands. Communicates directly with Chrome via CDP — no Node.js/Playwright runtime overhead. |
| **Why it matters** | 1.6x faster cold start, 18x less memory, 99x smaller install vs Playwright MCP. Snapshot+Refs system saves ~93% context window by returning compact element references (`@e1`, `@e2`) instead of full DOM trees. |
| **Key commands** | `open <url>`, `snapshot` (accessibility tree with refs), `click @e1`, `fill @e2 "text"`, `screenshot`, `get text`, `wait`, `find role/text/label`, `network route`, `cookies`, `storage` |
| **Use with DWS** | UI verification for dws10.com store, competitive intelligence (EU regulation monitoring), automated testing of landing pages, form-fill testing, screenshot-based QA. Pairs with agent workflows via CLI. |

**Architecture:** Rust CLI (cold start <50ms) → CDP WebSocket → Chrome. Supports headed/headless modes, multiple isolated sessions, AES-256-GCM encrypted session storage, and device emulation.

---

## 17. Compliance Scoring Engine

Deterministic scoring (CSRD × 0.50 + ETS × 0.25 + CBAM × 0.25), no LLM dependency. API: `POST /api/v1/compliance/assess`.
→ Full architecture, scoring formula, DB schema: [docs/COMPLIANCE_SCORING.md](docs/COMPLIANCE_SCORING.md)

---

## 18. BYO Agent Lifecycle & KYA Trust Framework

> **Status: SPECIFICATION** — The KYA lifecycle is documented but `kya-engine.ts` only implements `terminateChain()`. Hardware attestation and Firecracker isolation are not implemented in this repo.

KYA (Know Your Agent) 6-stage gate: Registration → IDV → KYB → Capability Review → Sandbox → Runtime Monitoring.
Trust score: ≥80 Full Agency, 50–79 Restricted, <50 Suspended, 0 Quarantine. Firecracker MicroVM isolation (planned).
→ Full protocol, manifest schema, sandbox stages, forensic logging: [docs/KYA_BYO_LIFECYCLE.md](docs/KYA_BYO_LIFECYCLE.md)

---

## 19. Product Maturity Matrix (Truth Table)

> Added 2026-03-22. Honest internal assessment of codebase maturity vs market positioning.
>
> **Market context:** DWS IQ 6 and Firehorse are actively sold on dws10.com (€4,999 platform + €6,500 Climate Reporting Starter Bundle). Three logistics operators in pilot (€7k–14k MRR, 12+ months retention). Product is real, deployed Dec 2025, V1.0 Feb 2026.

### Platform Core

| Component | Status | Evidence |
|-----------|--------|----------|
| Express backend (22+ routes) | ✅ Shipped | `src/app.ts` — production middleware, Cloud Run europe-north1 |
| Compliance engine (CSRD/ETS/CBAM/Fit for 55/EU AI Act Art.12) | ✅ Shipped | Deterministic scoring, 82 ESRS disclosures, EU-sourced emission factors |
| 16+ TypeScript agents | ✅ Shipped | `src/agents/*.agent.ts` — real business logic, observe-think-act loop |
| CLI (`dws` command) | ✅ Shipped | `cli/src/cli.ts` — zero-dep, JSON output, MCP passthrough |
| MCP Agent Protocol (JSON-RPC 2.0) | ✅ Shipped | `/mcp` endpoint, agents discoverable via `tools/list` |
| Auth (JWT + Supabase) | ✅ Shipped | Login/register, rate limiting, GDPR-compliant |
| React dashboard (V10) | ✅ Shipped | v10-react — 36+ components, Vite + React 19.2, Firehorse pipeline view |
| Agent delegation (multi-agent) | ✅ Shipped | BaseAgent delegation with depth cap (5), event bus |
| ERP connectors (SAP/IFS/D365/Monitor/Visma/Jeeves) | ✅ Shipped | Auth + sync + Supabase persistence (this PR) |

### Firehorse Suite

| Component | Status | Evidence |
|-----------|--------|----------|
| Firehorse Omnichannel (sales automation) | ✅ Shipped | `src/firehorse/` — state machine, scheduler, 15 routes, mounted in app.ts |
| Firehorse Signal-Based Sales | ✅ Shipped | Migration 012, ULTRA/HIGH correlation, approval workflow |
| Firehorse Signed Reports (DocuSign) | ✅ Shipped | `src/firehorse/signed-reports.ts` — eSignature integration |
| Firehorse Report Module | ✅ Shipped | `src/firehorse/report-module.ts` — Board Pack, Annual Report, Compliance, Carbon formats. Pulls from compliance engine + ERP data |
| Firehorse Automation (workflows) | ✅ Shipped | `src/firehorse/workflow-engine.ts` — 4 templates (compliance, lead-nurture, ERP sync, carbon). Supabase persistence |
| Firehorse ContentMS | 📋 Planned | Architecture documented, zero implementation code |

### Infrastructure & Security

| Component | Status | Evidence |
|-----------|--------|----------|
| GDPR/NIS2 data residency | ✅ Shipped | Cloud Run europe-north1, Supabase EU |
| EU AI Act Article 12 lineage | ✅ Shipped | Aiwen overlay, agent execution logging |
| KYA Trust Framework | 🔧 Partial | `kya-engine.ts` terminateChain() works; full 6-stage gate spec only |
| LWM (Lifetime World Model) | 📋 External | MCP URL configured, served as external dependency |
| Temporal.io orchestration | 📋 Planned | Docker compose config, no workflow code |
| No-Docker workstation architecture | ✅ Shipped | CLI-only workstation, Cloud Run services, Section 20 |
| Private Cloud (Helm) delivery | 📋 Planned | Helm charts for customer-managed K8s, Section 20 Tier 2b |
| GDX Spark edge deployment | 📋 Planned | Jetson Orin Nano + Firecracker, shipped device model |
| Local MCP servers | ❌ Removed | Permanently banned post-clawdbot (2026-03-26) |

**Key:** ✅ Shipped (working code, tests, API) | 🔧 In Progress (code exists, gaps remain) | 📋 Planned (docs/spec only)

---

## 20. Deployment Architecture — No Docker on Workstation

> **Added 2026-03-26.** Post-clawdbot security incident. Enterprise customers MUST NOT need Docker or local MCP servers on their workstations. All agent execution happens server-side (Cloud Run) or on shipped edge hardware (GDX Spark).

### EU Data Sovereignty — Platform Guarantee (ALL Tiers) (CRITICAL RULE)

**DWS services MUST be truly sovereign.** EU hosting on US-owned cloud is NOT sovereign — the US CLOUD Act (2018) allows US courts to compel US-owned companies (Google, AWS, Azure) to hand over data regardless of server location. EU AI Act, GDPR, and NIS2 require real sovereignty, not just EU datacenter addresses.

**The Sovereignty Rule:** DWS production services MUST run on **EU-owned infrastructure** — no US parent company, no CLOUD Act exposure. Google Cloud Run is acceptable for development and transition only. Production migration target is EU-sovereign cloud.

| Guarantee | How enforced | Tier |
|-----------|-------------|------|
| **EU-owned infrastructure** | Migrate from Google Cloud Run to EU-sovereign provider (Scaleway, etc.) | All |
| **No CLOUD Act exposure** | No US-owned cloud provider for production data | All |
| **EU data residency** | EU-only datacenters (Finland, France, Germany) | All |
| **EU AI Act Article 12 lineage** | Aiwen overlay, agent execution logging | All |
| **GDPR-compliant architecture** | No US data transit, EU-only processing | All |
| **NIS2 incident response** | Documented in DWS_SECURITY_STANDARD.md | All |
| **Agent audit trail** | Every agent execution logged with reasoning lineage | All |
| **KYA governance** | Know Your Agent trust scoring on all agents | All |

#### EU-Sovereign Cloud Provider Assessment (2026-03-26)

**Evaluated providers (all 100% EU-owned, zero CLOUD Act exposure):**

| Provider | Country | Owner | Cloud Run Equivalent | Scale-to-Zero | Managed PostgreSQL+pgvector | Managed Redis | Migration Effort |
|----------|---------|-------|---------------------|---------------|----------------------------|---------------|-----------------|
| **Scaleway** | France | Iliad Group | Serverless Containers | Yes | Yes | Yes | Low |
| **Clever Cloud** | France | Independent | PaaS (Docker) | No | Yes (addon) | Yes (addon) | Low |
| **OVHcloud** | France | Public (Euronext) | Managed K8s only | No | Yes | Yes | Medium-High |
| **Hetzner** | Germany | Family-owned | VMs only | No | Self-host | Self-host | High |
| **UpCloud** | Finland | Tesi-backed | Managed K8s (UKS) | No (K8s min 1 node) | Yes (managed) | Yes (Valkey/Redis) | Low-Medium |
| **STACKIT** | Germany | Schwarz Group (Lidl) | Managed K8s | No | Yes | Yes | Medium-High |

**Providers evaluated and rejected:**

| Provider | Country | Why Rejected |
|----------|---------|-------------|
| **Google Cloud Run** | US | CLOUD Act — US courts can compel data handover regardless of EU hosting |
| **AWS** | US | CLOUD Act |
| **Azure** | US | CLOUD Act |
| **Nebula (Finland)** | Finland → Sweden | Dissolved Oct 2023. Absorbed into Telia (Swedish state telco). Brand dead. |
| **Telia Cloud 9** | Sweden | Nebula remnant. Basic OpenStack VMs, no serverless, no managed DB. Not competitive. |
| **Aiven** | Finland | DB-only (not compute). US VC investors create CLOUD Act yellow flag. OK for DB layer on Hetzner infra. |

**Two products, two sovereign paths:**

| Product | Path | Stack | Target Customer |
|---------|------|-------|-----------------|
| **DWS IQ 6** | Path A: Scaleway | Serverless Containers + Managed PostgreSQL + Managed Redis | SaaS customers — scale-to-zero, lowest ops, pay-per-use |
| **Aegis** | Path B: UpCloud + Helm | UKS (Managed K8s) + Managed PostgreSQL + Managed Valkey + Helm charts | Enterprise customers — Finnish sovereign K8s, dedicated infra, full control |

**DWS IQ 6** is the cloud-native SaaS product. Serverless, scales to zero, Lifetime manages everything.
**Aegis** is the sovereign enterprise product. Dedicated K8s cluster per customer, Helm-deployed, Finnish infrastructure, customer can audit everything.

Both products share the same codebase, same agents, same CLI. The difference is where and how they run.

| Phase | Action | Timeline |
|-------|--------|----------|
| **Phase 0 (now)** | Google Cloud Run europe-north1 — transitional, development + early production | Current |
| **Phase 1** | Build Helm charts (`helm/dws-iq/`) — enables Aegis on UpCloud UKS | Next |
| **Phase 2a** | DWS IQ 6: Migrate backend to Scaleway Serverless Containers | When customer demands sovereignty |
| **Phase 2b** | Aegis: Deploy first customer cluster on UpCloud UKS Helsinki | When enterprise customer signs |
| **Phase 3** | Migrate databases to UpCloud Managed PostgreSQL (Aegis) or Scaleway (DWS IQ 6) | Same sprint |
| **Phase 4** | Migrate Firehorse services (same target as backend per product) | Following sprint |

#### DWS IQ 6 — Scaleway (Serverless SaaS)

- Only EU provider with true scale-to-zero serverless containers (direct Cloud Run replacement)
- Same deployment model: push Docker image → auto-scale → pay per request
- Managed PostgreSQL with pgvector + managed Redis included
- Paris, Amsterdam, Warsaw regions (all EU)
- 100% French-owned (Iliad Group), zero CLOUD Act exposure
- Lowest migration effort — Dockerfile stays identical, only deploy commands change
- Multi-tenant: all customers share infrastructure, isolated by JWT + RLS

#### Aegis — UpCloud + Helm (Finnish Sovereign Enterprise)

- Finnish-owned, Helsinki HQ, Tesi (Finnish Industry Investment) backed
- 2 Helsinki DCs (fi-hel1, fi-hel2) — HA within Finland
- Managed K8s (UKS): CNCF-conformant, full Helm support, no limitations vs GKE/EKS
- **Free control plane** (dev, up to 30 nodes) + **zero egress** + **free load balancer**
- Managed PostgreSQL (HA, automated backups, extensions) + Managed Valkey/Redis
- GPU nodes (NVIDIA L40S) for local LLM inference
- 99.999% SLA, ISO 27001, CISPE member
- HPA + VPA + Cluster Autoscaler
- Gap: no managed container registry (use GitHub CR or self-host Harbor)
- Single-tenant: dedicated K8s cluster per enterprise customer
- "Made in Finland" — same country as Lifetime Oy, same datacenter city as HQ

**Database sovereignty options (ranked):**

| Option | Sovereignty | Managed? | Cost | Best For |
|--------|------------|----------|------|----------|
| UpCloud Managed PostgreSQL | Finnish-owned, Helsinki DC | Yes (HA, backups) | Competitive | Finnish sovereignty + managed |
| Scaleway Managed PostgreSQL | French-owned | Yes | ~EUR 20+/mo | Simplicity (one vendor with Scaleway compute) |
| Aiven on Hetzner infra | Finnish company + German infra | Yes | ~EUR 89+/mo | Best managed DB experience |
| Self-hosted on Hetzner VM | German family-owned | No (DIY) | ~EUR 4+/mo | Cost optimization |

**Tier 2b (private cloud) exists for customers who require sovereignty under their own infrastructure control** — air-gapped, defense, critical infrastructure, banking regulators who mandate on-premises compute.

### Three-Tier Deployment Model

```
TIER 1: ENTERPRISE WORKSTATION (clean — nothing to install except CLI)
  └── dws CLI (zero-dep Node.js, npm -g install)
       └── All commands --> EU-sovereign API (JWT auth, TLS)
       └── No Docker, no local MCP, no local containers

TIER 2: EU-SOVEREIGN CLOUD (Cloud Run transitional)
  │
  ├── DWS IQ 6 — SCALEWAY (French, serverless, multi-tenant SaaS)
  │   ├── Serverless Containers  — Backend + agents + /mcp
  │   ├── Serverless Containers  — MCP Gateway + Firehorse services
  │   ├── Managed PostgreSQL     — pgvector, EU-only
  │   └── Managed Redis          — Job queue + caching
  │
  └── AEGIS — UPCLOUD + HELM (Finnish, K8s, single-tenant enterprise)
      ├── UKS namespace: aegis   — Dedicated cluster per customer
      │   ├── dws-backend        — Backend + agents + /mcp
      │   ├── mcp-gateway        — MCP Gateway
      │   ├── firehorse-*        — Report, Automation, DMS
      │   └── ingress            — TLS, JWT validation
      ├── Managed PostgreSQL     — HA, Helsinki DC, automated backups
      └── Managed Valkey/Redis   — Job queue + caching

TIER 3: GDX SPARK (edge device, shipped to customer site)
  └── Control Room / Situation Room
       ├── Local inference (Llama 3.3 on Jetson Orin Nano)
       ├── Fleet telemetry agent (offline-capable)
       ├── SiteSense (offline safety scoring)
       ├── KYA v1.4 governance (hardware kill-switch)
       └── Firecracker MicroVM isolation per agent
```

### Tier 1: Enterprise Workstation

The customer workstation runs **only the DWS CLI**. Zero local services, zero Docker, zero MCP servers.

```bash
# Install
npm install -g @lifetime/dws-cli

# Configure (one-time)
dws config set api-url https://dws6run6-xxxx.europe-north1.run.app
dws config set api-token <JWT>

# Use
dws agents                                    # List agents
dws run compliance --input '{"industry":"steel"}'  # Execute agent
dws workflow compliance-assessment             # Multi-agent workflow
dws mcp tools                                 # List MCP tools
dws health                                    # Check connectivity
```

**Security posture:** No attack surface on customer workstation. No local processes, no open ports, no Docker daemon, no MCP servers that could be hijacked (clawdbot vector eliminated).

### Tier 2a: EU-Sovereign Cloud (Lifetime-Managed SaaS)

Default deployment. All agent execution, MCP protocol, and Firehorse services run server-side. Lifetime manages infrastructure.

**Current:** Google Cloud Run (europe-north1) — transitional, acceptable for development and early production.
**Target:** Scaleway Serverless Containers (Paris/Amsterdam) — EU-sovereign, zero CLOUD Act exposure. Migration triggered by first enterprise customer requiring sovereignty proof.

| Service | Image | Port | Memory | CPU | Min/Max | Status |
|---------|-------|------|--------|-----|---------|--------|
| `dws6run6` | `backend:latest` | 8080 | 512Mi | 1 | 0/10 | ✅ Deployed |
| `mcp-gateway` | `mcp-gateway:latest` | 8080 | 512Mi | 1 | 0/3 | ✅ Deployed |
| `firehorse-reports` | `firehorse-reports:latest` | 8084 | 1Gi | 1 | 0/5 | 📋 Migration planned |
| `firehorse-automation` | `firehorse-automation:latest` | 8085 | 512Mi | 1 | 0/3 | 📋 Migration planned |
| `firehorse-dms` | `firehorse-dms:latest` | 8086 | 512Mi | 1 | 0/3 | 📋 Migration planned |
| Redis | Cloud Memorystore / Upstash | 6379 | — | — | managed | 📋 Migration planned |

**Migration path for Firehorse services:**
1. Each service already has a Dockerfile (`Firehorse/docker-compose.yml` services)
2. Add `cloudbuild.yaml` per service (same pattern as `mcp-servers/cloud-run-gateway/cloudbuild.yaml`)
3. Configure secrets via Google Secret Manager
4. Update CLI `DWS_API_URL` to route Firehorse calls to their Cloud Run services
5. Remove `docker-compose.yml` requirement from developer/customer setup

### Tier 2b: Private Cloud (Customer-Managed)

For enterprise customers who require sovereignty **under their own infrastructure control** — air-gapped environments, defense, critical infrastructure, or banking regulators who mandate on-premises compute. All tiers are EU AI Act compliant and EU-sovereign; Tier 2b adds customer-controlled infrastructure.

**Delivery options ranked by admin skill requirement:**

| Option | Customer needs | Admin skill | Build priority |
|--------|---------------|-------------|----------------|
| **Docker Compose bundle** | 1 Linux VM + Docker | Linux + Docker basics | ✅ First (covers 80%) |
| **VM appliance (OVA/QCOW2)** | VMware/Proxmox/Hyper-V | Import VM, set .env | 📋 Second |
| **Kamal deploy** | 1 Linux VM + SSH access | Minimal (Lifetime pushes updates) | 📋 Third |
| **Helm charts (K8s)** | Kubernetes cluster | K8s admin | 📋 Only on customer demand |

#### Option A: Docker Compose Bundle (DEFAULT for private cloud)

Lowest admin overhead. Customer needs one Linux VM with Docker installed.

```
dws-private-cloud/
├── docker-compose.yml          # All 6 services + Redis
├── .env.example                # Customer fills in: DB URL, JWT secret, LLM keys
├── install.sh                  # Pull images, validate .env, start, health check
├── update.sh                   # Pull new images, rolling restart, verify health
├── backup.sh                   # Database + config backup
├── monitor.sh                  # Service health (cron-friendly, JSON output)
└── README.md                   # Admin guide (Linux + Docker basics)
```

```bash
# Customer install (one-time)
git clone <private-registry>/dws-private-cloud
cp .env.example .env            # Fill in secrets
./install.sh                    # Pulls images, starts services, runs health check

# Customer update (when Lifetime releases new version)
./update.sh                     # Zero-downtime rolling restart

# Health check (add to cron)
./monitor.sh                    # Returns JSON: service statuses, latencies
./monitor.sh --alert            # Exits non-zero if any service unhealthy
```

**Services in docker-compose.yml:**
```yaml
services:
  dws-backend:        # Port 8080 — Backend + 18+ agents + /mcp
  mcp-gateway:        # Port 8081 — MCP Gateway
  firehorse-reports:  # Port 8084 — Report Engine
  firehorse-auto:     # Port 8085 — Automation
  firehorse-dms:      # Port 8086 — Content DMS
  redis:              # Port 6379 — Job queue + caching
  # Customer provides external PostgreSQL + pgvector
```

**Requirements:** Ubuntu 22.04+ or RHEL 9+, Docker 24+, 4 CPU / 8GB RAM minimum, PostgreSQL 15+ with pgvector (external).

#### Option B: VM Appliance

Pre-built VM image with everything installed. Customer imports into their hypervisor.

- Format: OVA (VMware), QCOW2 (Proxmox/KVM), VHD (Hyper-V)
- Contains: Ubuntu + Docker + all DWS services pre-configured
- Admin sets `.env` values on first boot via `dws setup` wizard
- Updates via `dws update` command from inside the VM
- Closest to GDX Spark model but as virtual infrastructure

#### Option C: Kamal Deploy (Lifetime-Managed Push)

Customer provides SSH access to a Linux VM. Lifetime pushes updates remotely using Kamal (from 37signals).

- No Docker knowledge needed on customer side
- Lifetime runs `kamal deploy` — handles image pull, health check, rollover
- Customer responsibility: keep VM running, provide SSH key
- Best for customers who want "managed" but on their own hardware

#### Option D: Helm Charts (K8s — only when demanded)

For customers with existing Kubernetes clusters who explicitly request Helm.

```
CUSTOMER KUBERNETES CLUSTER (GKE / EKS / AKS / on-prem K8s)
  ├── namespace: dws-iq
  │   ├── deployment/dws-backend      — Backend + agents + /mcp
  │   ├── deployment/mcp-gateway      — MCP Gateway
  │   ├── deployment/firehorse-reports — Report Engine
  │   ├── deployment/firehorse-auto   — Automation
  │   ├── deployment/firehorse-dms    — Content DMS
  │   ├── statefulset/redis           — Redis (or customer-managed)
  │   └── ingress/dws-api             — TLS termination, JWT validation
  ├── namespace: dws-db
  │   └── Customer-managed PostgreSQL + pgvector
  └── namespace: dws-monitoring
      └── Prometheus + Grafana (health, agent execution metrics)
```

**Private Cloud deliverables:**

| Artifact | Purpose | Status |
|----------|---------|--------|
| `private-cloud/docker-compose.yml` | Docker Compose bundle (default) | 📋 Build first |
| `private-cloud/install.sh` | One-command install + health check | 📋 Build first |
| Container images (OCI) | All services as container images | 🔧 Partial (backend + MCP gateway exist) |
| VM appliance (OVA/QCOW2) | Pre-built VM image | 📋 Second priority |
| `helm/dws-iq/` | Helm chart (only on demand) | 📋 Only when customer demands |
| Air-gap bundle | Tarball with all images for offline install | 📋 Planned |

**What Lifetime provides vs. customer manages:**

| Responsibility | Lifetime | Customer |
|----------------|----------|----------|
| Container images + install scripts | ✅ | |
| Agent code + updates | ✅ | |
| KYA governance engine | ✅ | |
| Linux VM / K8s cluster | | ✅ |
| PostgreSQL database | | ✅ |
| TLS / networking / DNS | | ✅ |
| Secrets management (.env) | Template provided | ✅ Fills in values |
| Monitoring + alerting | `monitor.sh` provided | ✅ Integrates to their stack |
| LLM API keys (Groq/Claude/Gemini) | | ✅ |

**CLI for private cloud:** Same `dws` CLI, different `DWS_API_URL`:

```bash
dws config set api-url https://dws-api.customer-internal.com
dws health   # Verifies connectivity to private deployment
```

### Admin Skill Matrix

| Tier | Role | Required Skills | Nice-to-Have |
|------|------|-----------------|--------------|
| **Tier 1** (workstation) | End user | Install Node.js, run CLI commands | JSON reading |
| **Tier 2a** (Cloud Run) | None (Lifetime manages) | — | — |
| **Tier 2b** (Docker Compose) | IT admin | Linux CLI, Docker basics, `.env` config, cron | Networking, TLS certs |
| **Tier 2b** (VM appliance) | IT admin | Import VM, set `.env` | Hypervisor basics |
| **Tier 2b** (Kamal) | Minimal | Provide SSH access, keep VM running | — |
| **Tier 2b** (Helm/K8s) | Platform engineer | Kubernetes, Helm, networking, secrets mgmt | Prometheus/Grafana |
| **Tier 3** (GDX Spark) | Site operator | Physical setup, network cable, `dws edge` CLI | Docker for troubleshooting |

### Health Monitoring by Tier

| Tier | How admin sees health | Auto-refresh |
|------|----------------------|--------------|
| **Tier 1** | `dws health` CLI output (JSON) | Manual |
| **Tier 2a** | Dashboard `/health` page (5 service checks, 30s poll) | ✅ 30s |
| **Tier 2a** | Control Room `/agents` (per-agent CPU/mem/status) | ✅ Real-time |
| **Tier 2a** | Situation Room `/agents` (executive alerts + metrics) | ✅ Real-time |
| **Tier 2b** | `./monitor.sh` (JSON, cron-friendly) | Via cron |
| **Tier 2b** | Dashboard `/health` (same as 2a, pointed at private URL) | ✅ 30s |
| **Tier 3** | `dws edge status` (planned) | Manual |
| **Tier 3** | Dashboard `/health` with edge service checks (planned) | 📋 Planned |

### Tier 3: GDX Spark (Edge Device)

For customers needing local compute (control rooms, situation rooms, offline sites), Lifetime ships a **GDX Spark** edge device pre-configured with containers.

| Component | Hardware | Purpose |
|-----------|----------|---------|
| NVIDIA Jetson Orin Nano | 7-15W, ARM64 | Local LLM inference, agent execution |
| Acer Veriton GN100 | Desktop AI Factory | Development sandbox, higher compute |

**What runs on GDX Spark:**
- Offline-capable agents (SiteSense, fleet telemetry, schedule optimization)
- Local Llama 3.3 inference (no cloud dependency for latency-critical operations)
- KYA v1.4 governance engine with hardware-enforced kill-switch
- Firecracker MicroVM per agent (isolation)
- Secure tunnel to Cloud Run for non-latency-critical work

**What does NOT run on GDX Spark:**
- Compliance scoring (requires full regulation database — Cloud Run only)
- ERP connectors (require VPN/API to customer ERP — Cloud Run only)
- MCP Gateway (protocol coordination — Cloud Run only)

### CLI Agent Management Commands

All agents are manageable via CLI. No GUI-only operations exist.

```bash
# Agent lifecycle
dws agents                              # List all agents with status
dws agents --format json                # Machine-readable output
dws run <agent> --input '{...}'         # Execute agent
dws run <agent> --stdin                 # Pipe input from another command
dws discover <capability>              # Find agents by tag

# Multi-agent workflows
dws workflow list                       # List available workflows
dws workflow <name> --input '{...}'     # Execute workflow
dws events --pattern 'compliance*'     # Monitor agent events

# MCP (server-side only, no local MCP)
dws mcp tools                           # List MCP tools (from Cloud Run)
dws mcp call <tool> --args '{...}'     # Call MCP tool

# Health & diagnostics
dws health                              # Backend + MCP health
dws status                              # Platform status + uptime
dws config                              # Show current config

# Edge device (GDX Spark)
dws edge status                         # GDX Spark device health (planned)
dws edge agents                         # List agents running on edge (planned)
dws edge sync                           # Sync edge ↔ cloud state (planned)
```

### Security Rules (Post-Clawdbot)

| Rule | Enforcement |
|------|-------------|
| **No local MCP servers** | `.mcp.json` removed from workstations; CLI connects to Cloud Run `/mcp` only |
| **No local Docker requirement** | All services run on Cloud Run; Docker only used for CI/CD image builds |
| **No community MCP skills** | Auto-install from registries permanently banned (DWS_SECURITY_STANDARD.md) |
| **JWT auth on all endpoints** | Every CLI → Cloud Run call requires valid JWT bearer token |
| **EU data residency** | Cloud Run in europe-north1; Supabase in EU; no US transit |
| **Edge device KYA governance** | GDX Spark agents run in Firecracker MicroVMs with kill-switch |

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

**Document Version:** 2.4
**Last Updated:** April 6, 2026
**Standard:** [agents.md](https://github.com/agentsmd/agents.md) v1.0
**Next Review:** April 4, 2026

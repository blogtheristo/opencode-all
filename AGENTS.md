# AGENTS.md

> Following the [agents.md](https://github.com/agentsmd/agents.md) open specification.
> A README for AI coding agents: context, instructions, and operational guidance.

**Version:** 2.2
**Created:** January 3, 2026
**Updated:** March 20, 2026
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

**Tech stack:** React 19, Vite 7, TypeScript 5.6, TailwindCSS 4, Express 4.19.19.19.19.19.19.19, Supabase (PostgreSQL + pgvector), Groq (Llama 3.3 70B), Claude, Google Cloud Run (europe-north1), Cloudflare Workers/Pages, NVIDIA Jetson Orin Nano.

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
└── .github/workflows/       # CI/CD (40 workflows)
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
| Agent Browser | Web testing, UI verification, competitive intelligence (native Rust, vercel-labs/agent-browser) |

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
| Firehorse Report Module | 🔧 In Progress | Python engine exists (`report_engine.py`), needs templates + API orchestration |
| Firehorse Automation (workflows) | 🔧 Alpha | FastAPI stub (`main.py`), needs persistence + real workflow logic |
| Firehorse ContentMS | 📋 Planned | Architecture documented, zero implementation code |

### Infrastructure & Security

| Component | Status | Evidence |
|-----------|--------|----------|
| GDPR/NIS2 data residency | ✅ Shipped | Cloud Run europe-north1, Supabase EU |
| EU AI Act Article 12 lineage | ✅ Shipped | Aiwen overlay, agent execution logging |
| KYA Trust Framework | 🔧 Partial | `kya-engine.ts` terminateChain() works; full 6-stage gate spec only |
| LWM (Lifetime World Model) | 📋 External | MCP URL configured, served as external dependency |
| Temporal.io orchestration | 📋 Planned | Docker compose config, no workflow code |

**Key:** ✅ Shipped (working code, tests, API) | 🔧 In Progress (code exists, gaps remain) | 📋 Planned (docs/spec only)

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
**Last Updated:** March 20, 2026
**Standard:** [agents.md](https://github.com/agentsmd/agents.md) v1.0
**Next Review:** April 4, 2026

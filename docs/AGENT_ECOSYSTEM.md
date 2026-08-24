***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/openai-harness-documentation-3QVGZ | Date: 14.03.2026 | Changes: Extracted from AGENTS.md §7-§8 as part of agents-md-slim refactoring

Document Status:
  - Created: 14.03.2026
  - Last Modified: 14.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

# Agent Ecosystem — Detail Reference

Extracted from AGENTS.md §7–§8 to keep AGENTS.md as a map (~150 lines).

---

## Architecture

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

## Platform Agents (Runtime)

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

## V2 Agent Details

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
  industry: string;
  regulations: string[];
  currentMeasures: {
    carbonReporting: boolean;
    emissionsMonitoring: boolean;
    supplyChainDueDiligence: boolean;
    aiSystemLogging: boolean;
  };
  annualEmissions: number;
  importValue: number;
}
```

**Output:** Compliance score (0-100), gap list, deadline urgency, remediation recommendations.

### Quality Gate Agent (`quality-gate`)

**Why:** With 35 CI/CD workflows, multiple deployment targets (GCP, Cloudflare, Hetzner), and dual-folder landing page structure, deployment quality requires automated validation before release.

**Capabilities:**
- `deployment-readiness` — Pre-deployment quality checks
- `test-coverage-analysis` — Test coverage assessment against thresholds
- `security-scan-summary` — Aggregate security scan results
- `landing-page-sync-check` — Verify dual-folder sync (root vs landing-pages)

### Sovereignty Monitor Agent (`sovereignty-monitor`)

**Why:** The CLOUD Act (2018) allows US authorities to access data held by US-owned providers regardless of server location. This agent automates database sovereignty assessment across 8 dimensions.

**Capabilities:**
- `database-sovereignty-assessment` — Score database sovereignty (0–100)
- `cloud-act-exposure-check` — Detect US-owned provider CLOUD Act risk
- `data-residency-verification` — Verify EU data residency compliance
- `gdpr-database-readiness` — GDPR DSAR, deletion, consent process readiness
- `nis2-database-compliance` — NIS2 critical infrastructure data handling

**Product:** Sovereign Database (SKU: DWS-SOVEREIGN-DB-001) — 4 tiers.

## Team Agents (Operations)

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

# Admin Manual: Self-Improving Agent System

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/self-improving-parallel-agents-p4X6m | Date: 11.02.2026 | Changes: Initial creation - Self-improving agent documentation

Session Links & References:
  - Claude Code (claude/self-improving-parallel-agents-p4X6m): https://github.com/blogtheristo/dws6/commits/claude/self-improving-parallel-agents-p4X6m
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_SELF_IMPROVING_AGENTS.md

Document Status:
  - Created: 11.02.2026
  - Last Modified: 11.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Indexed In: /docs/Document-index.md
  - Category: Admin Manuals
  - Search Tags: self-improving agents, agent system, reflection agent, self-diagnostic agent, CI/CD, DevOps, platform administration

***

**Version:** 1.0
**Purpose:** Administration guide for the DWS IQ 6 self-improving agent system
**Audience:** DevOps, AI Engineers, Platform Developers, System Administrators
**Updated:** 11.02.2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Self-Diagnostic Agent](#3-self-diagnostic-agent)
4. [Reflection Agent](#4-reflection-agent)
5. [Codebase Health Script](#5-codebase-health-script)
6. [CI/CD Test Workflow](#6-cicd-test-workflow)
7. [Agent Registry](#7-agent-registry)
8. [Operational Procedures](#8-operational-procedures)
9. [EU AI Act Compliance](#9-eu-ai-act-compliance)
10. [Maintenance](#10-maintenance)

---

## 1. Overview

### What Are Self-Improving Agents?

Self-improving agents are AI components that participate in their own development and refinement. The concept parallels how frontier models like GPT-5.3-Codex were instrumental in creating themselves -- the model's output feeds back into improving the model's environment, tooling, and quality standards.

In DWS IQ 6, this manifests as a closed feedback loop where AI agents:

1. **Diagnose** the codebase for quality gaps, missing tests, and security issues
2. **Fix** the identified problems during AI-assisted coding sessions (Claude Code, Cursor)
3. **Reflect** on the quality of agent outputs to detect degradation
4. **Repeat** the cycle, with each iteration raising the health score baseline

This is not autonomous self-modification. The human developer remains the architect -- agents surface problems, prioritize recommendations, and verify improvements. The developer decides what gets implemented.

### Key Principle

The self-improving loop turns every AI coding session into a quality improvement session. Instead of starting each session blind, the agent reads the latest health report and knows exactly what needs attention.

### Components

| Component | File | Purpose |
|-----------|------|---------|
| Self-Diagnostic Agent | `src/agents/self-diagnostic.agent.ts` | Scans codebase for quality gaps |
| Reflection Agent | `src/agents/reflection.agent.ts` | Evaluates other agents' output quality |
| Codebase Health Script | `scripts/codebase_health.py` | Prints codebase health report; optionally writes `health_report.json` (gitignored) via `--output-file` |
| CI/CD Test Workflow | `.github/workflows/test-on-pr.yml` | Runs tests and security checks on PRs |
| Agent Tests | `src/__tests__/agents.test.ts` | Verifies agent infrastructure works correctly |
| Agent Registry | `src/agents/index.ts` | Central registration for all 7 agents |

---

## 2. Architecture

### The Self-Improving Loop

```
                     ┌──────────────────────────┐
                     │   1. DIAGNOSE             │
                     │   Self-Diagnostic Agent   │
                     │   scans codebase health   │
                     └────────────┬─────────────┘
                                  │
                                  ▼
                     ┌──────────────────────────┐
                     │   2. FIX                  │
                     │   AI coding session reads │
                     │   health report, fixes    │
                     │   top priority issues     │
                     └────────────┬─────────────┘
                                  │
                                  ▼
                     ┌──────────────────────────┐
                     │   3. REFLECT              │
                     │   Reflection Agent scores │
                     │   output quality of all   │
                     │   agents after changes    │
                     └────────────┬─────────────┘
                                  │
                                  ▼
                     ┌──────────────────────────┐
                     │   4. REPEAT               │
                     │   Next diagnostic scan    │
                     │   shows improvement;      │
                     │   health score rises      │
                     └────────────┬─────────────┘
                                  │
                                  └───────► (back to step 1)
```

### Data Flow

```
codebase_health.py ──► health_report.json ──► AI session reads report
                                                      │
self-diagnostic.agent.ts ──► AgentResponse ──► reflection.agent.ts
                                                      │
                                               Quality score + feedback
                                                      │
                                               ▼ (if below threshold)
                                          Re-execute with improvements
```

### Agent Architecture

All agents extend `BaseAgent` (defined in `src/agents/base.agent.ts`) which provides:

- **`callLLM(prompt)`** -- Calls Groq API (llama-3.3-70b-versatile) with graceful degradation
- **`logExecution(log)`** -- Persists execution logs to Supabase `agent_executions` table
- **`getConfig()`** -- Returns the agent's `AgentConfig` metadata

Every agent returns a standardized `AgentResponse`:

```typescript
interface AgentResponse {
  agentName: string;                    // Which agent produced this
  result: Record<string, unknown>;      // Agent-specific payload
  confidence: number;                   // 0-1 reliability score
  reasoning: string;                    // Human-readable explanation
  recommendations: string[];            // Actionable next steps
  metadata: Record<string, unknown>;    // Timing, model info, tokens
}
```

---

## 3. Self-Diagnostic Agent

**File:** `src/agents/self-diagnostic.agent.ts`

### Purpose

The self-diagnostic agent scans the DWS6 codebase and produces a health report with a numeric score (0-100), categorized findings, and prioritized recommendations.

### Diagnostic Scopes

| Scope | What It Checks |
|-------|---------------|
| `full` | All checks below combined |
| `agents` | Agent error handling, logging, registry completeness, LLM usage |
| `tests` | Test file count, agent test coverage, integration test existence |
| `security` | `.env.example` presence, `.gitignore` patterns, CI/CD test workflow |
| `types` | TypeScript strict mode, `noImplicitAny`, exclude list size |

### How to Execute

Via the agent registry API:

```typescript
const result = await agentRegistry.executeAgent('self-diagnostic', context, {
  scope: 'full',       // 'full' | 'agents' | 'tests' | 'security' | 'types'
  basePath: '/path/to/dws6',
});
```

### Health Score Computation

The score starts at 100 and deducts points per finding:

| Severity | Deduction |
|----------|-----------|
| Critical | -15 points |
| High | -8 points |
| Medium | -4 points |
| Low | -1 point |
| Info | 0 (no deduction) |

The final score is clamped to 0-100.

### Example Findings

```json
{
  "severity": "high",
  "category": "agent-quality",
  "message": "Agent customer-sat.agent.ts missing try/catch error handling in execute()",
  "file": "src/agents/customer-sat.agent.ts",
  "suggestion": "Add try/catch with logExecution error reporting"
}
```

### LLM Enhancement

When critical or high-severity findings exist, the agent calls the LLM (llama-3.3-70b-versatile) to generate a prioritized action plan summary. This degrades gracefully -- if the LLM call fails, the agent still returns all deterministic findings.

---

## 4. Reflection Agent

**File:** `src/agents/reflection.agent.ts`

### Purpose

The reflection agent evaluates the quality of other agents' outputs. It scores each output across five quality dimensions and determines whether the output passes a configurable quality threshold (default: 0.7).

### Quality Dimensions

| Dimension | What It Measures | Scoring Logic |
|-----------|-----------------|---------------|
| **Confidence Calibration** | Is the agent's confidence score well-calibrated? | Penalizes extremes (0 or 1.0); rewards 0.6-0.95 range |
| **Reasoning Quality** | Does the reasoning include data and causal explanation? | Checks length, numeric evidence, causal language (`because`, `due to`, `computed from`) |
| **Recommendation Actionability** | Are recommendations specific and actionable? | Checks verb usage (`implement`, `add`, `review`), count (2-10 optimal) |
| **Result Completeness** | Does the result contain all expected fields? | Checks field count (3+ good, 5+ excellent), non-empty values |
| **Observability Metadata** | Is there sufficient metadata for tracing? | Checks for `durationMs`, `llmModel`, `llmTokens` |

### How to Execute

```typescript
const agentOutput: AgentResponse = { /* output from any agent */ };

const result = await agentRegistry.executeAgent('reflection', context, {
  agentOutput: agentOutput,
  qualityThreshold: 0.7,  // Optional, default 0.7
});
```

### Verdict

The reflection agent returns one of two verdicts:

- **PASS:** `Output meets quality threshold` -- score >= threshold
- **FAIL:** `Output below quality threshold - consider re-execution with feedback` -- score < threshold

### LLM-Enhanced Feedback

When the overall score falls below 0.5 (significantly poor quality), the agent calls the LLM for deeper analysis and specific fix suggestions. These are appended to the improvements list.

### Iterative Refinement Pattern

The reflection agent enables an iterative refinement workflow:

```
Agent X executes ──► Reflection evaluates ──► Score < 0.7?
                                                  │
                                      ┌───────────┴───────────┐
                                      │ YES                   │ NO
                                      ▼                       ▼
                              Re-execute Agent X        Accept output
                              with feedback
```

---

## 5. Codebase Health Script

**File:** `scripts/codebase_health.py`

### Purpose

A Python script that generates a machine-readable health report for AI coding sessions -- the AI reads the report to understand what needs fixing.

By default the script writes nothing to disk; it prints to stdout so repeated runs never leave untracked files in the working tree. Use `--output-file` to persist the JSON. The repo already gitignores `health_report.json` as a safety net.

### How to Run

```bash
# Default: markdown to stdout, no file written
python scripts/codebase_health.py

# JSON to stdout
python scripts/codebase_health.py --output json

# Persist the JSON report for agent consumption (gitignored path)
python scripts/codebase_health.py --output json --output-file health_report.json

# Explicitly disable any file write even when --output-file is set
python scripts/codebase_health.py --output-file /tmp/report.json --no-write
```

### What It Analyzes

| Area | Metrics |
|------|---------|
| **Tests** | Test file count, test case count (it/test blocks), per-file line counts |
| **Agents** | Agent count, error handling presence, logging, LLM usage per agent |
| **Workflows** | Total CI/CD workflows, test/security/lint workflow presence |
| **Source** | TypeScript file count in `src/`, Python file count in `scripts/` |

### Health Score Breakdown

| Category | Max Points | Criteria |
|----------|-----------|----------|
| Base score | 50 | Always awarded |
| Test files (>= 5) | +15 | Or +8 for >= 3 files |
| Test cases (>= 20) | +10 | Or +5 for >= 10 cases |
| Agent count (>= 5) | +5 | Sufficient agent coverage |
| All agents have logging | +5 | Every agent calls `logExecution` |
| All agents have error handling | +5 | Every agent has try/catch |
| Test CI/CD workflow exists | +5 | `test` keyword in workflow name |
| Security workflow exists | +3 | `security` keyword in workflow name |
| Lint workflow exists | +2 | `ruff` or `lint` keyword in workflow name |
| **Maximum** | **100** | |

### Output File

The script writes `health_report.json` to the project root:

```json
{
  "generated_at": "2026-02-11T10:30:00+00:00",
  "health_score": 78,
  "summary": {
    "typescript_source_files": 42,
    "python_script_files": 8
  },
  "tests": { "test_files": 3, "test_cases": 18, "files": [...] },
  "agents": { "total_agents": 7, "agents": [...] },
  "workflows": { "total_workflows": 16, "has_test_workflow": true, ... },
  "recommendations": [...]
}
```

### Exit Code

- **0** -- Health score >= 60 (healthy)
- **1** -- Health score < 60 (needs attention)

This allows use in CI/CD pipelines as a quality gate.

---

## 6. CI/CD Test Workflow

**File:** `.github/workflows/test-on-pr.yml`

### Purpose

Automated test and security workflow that runs on every pull request targeting `main` and on pushes to `main`. This is the CI/CD backbone of the self-improving loop -- it prevents regressions from being merged.

### Trigger Conditions

| Event | Branches | Paths |
|-------|----------|-------|
| `pull_request` | `main` | `src/**`, `package.json`, `tsconfig.json`, `vitest.config.ts` |
| `push` | `main` | `src/**` |

### Jobs

**Job 1: `test`** (timeout: 10 minutes)

| Step | Action |
|------|--------|
| Checkout code | `actions/checkout@v4` |
| Setup Node.js 20 | `actions/setup-node@v4` with npm cache |
| Install dependencies | `npm ci` |
| TypeScript type check | `npx tsc --noEmit --pretty` (continue on error) |
| Run tests | `npm test -- --run --reporter=verbose` |
| Upload results | Test results and coverage as artifacts (7-day retention) |

**Job 2: `lint-check`** (timeout: 5 minutes)

| Step | Action |
|------|--------|
| Checkout code | `actions/checkout@v4` |
| Setup Node.js 20 | `actions/setup-node@v4` with npm cache |
| Install dependencies | `npm ci` |
| Security pattern check | Scans `src/` for hardcoded API keys (`sk-ant-api`, `gsk_`, `eyJhbG`, `AIza`) |

### Concurrency

Uses concurrency group `test-${{ github.ref }}` with `cancel-in-progress: true` to avoid duplicate runs on rapid pushes.

---

## 7. Agent Registry

**File:** `src/agents/index.ts`

### Registered Agents

The `AgentRegistry` class auto-registers all 7 production agents on construction:

| # | Agent Name | File | Type | Purpose |
|---|-----------|------|------|---------|
| 1 | `sitesense` | `sitesense.agent.ts` | Domain | Construction site safety scoring |
| 2 | `schedule-genius` | `schedule-genius.agent.ts` | Domain | Project schedule optimization |
| 3 | `material-oracle` | `material-oracle.agent.ts` | Domain | Material procurement intelligence |
| 4 | `customer-sat` | `customer-sat.agent.ts` | Domain | Customer satisfaction analysis |
| 5 | `viability` | `viability.agent.ts` | Domain | Project viability assessment |
| 6 | `self-diagnostic` | `self-diagnostic.agent.ts` | Meta | Codebase health analysis |
| 7 | `reflection` | `reflection.agent.ts` | Meta | Agent output quality evaluation |

### Registry API

```typescript
import { agentRegistry } from './agents/index.js';

// List all agents
const agents = agentRegistry.listAgents();

// Get a specific agent
const agent = agentRegistry.getAgent('self-diagnostic');

// Execute by name
const result = await agentRegistry.executeAgent('reflection', context, input);
```

### REST API Endpoints

Agent endpoints are exposed via `src/agents/routes.ts`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agents` | List all registered agents |
| `POST` | `/api/agents/:name/execute` | Execute a specific agent |

### Test Coverage

The agent system is tested in `src/__tests__/agents.test.ts` with the following test suites:

| Suite | Tests | What It Covers |
|-------|-------|---------------|
| `AgentRegistry` | 8 tests | Registration, discovery, execution, uniqueness, config validation |
| `SiteSense Agent` | 4 tests | Optimal conditions, extreme conditions, wind recommendations, metadata |
| `Reflection Agent` | 3 tests | High-quality pass, low-quality fail, overconfidence penalty |
| `Agent Response Contract` | 1 test | Verifies all agents return valid `AgentResponse` shape |

---

## 8. Operational Procedures

### Daily Development Workflow

**Step 1: Run the health check before starting a coding session**

```bash
python scripts/codebase_health.py
```

Review the health score and top recommendations.

**Step 2: Address top-priority findings**

The health report and self-diagnostic agent prioritize findings by severity (critical > high > medium > low). Focus on critical and high items first.

**Step 3: Run tests after making changes**

```bash
npm test
```

**Step 4: Re-run health check to verify improvement**

```bash
python scripts/codebase_health.py --output json
```

Compare the new health score against the previous one.

### Using the Self-Diagnostic Agent in a Session

When starting a Claude Code or Cursor session:

1. Read `health_report.json` at the project root
2. The self-diagnostic agent's latest findings tell you exactly what to fix
3. After fixes, run the reflection agent against affected agents to verify quality
4. Commit changes and let the CI/CD workflow validate

### Quality Gate Thresholds

| Metric | Threshold | Action if Below |
|--------|-----------|-----------------|
| Health score | >= 60 | Block deployment, fix critical issues |
| Agent output quality | >= 0.7 (70%) | Re-execute agent with reflection feedback |
| Confidence calibration | 0.6 - 0.95 | Review agent logic for over/under-confidence |
| Test file count | >= 5 | Add missing test files for uncovered modules |

### Incident Response

If the health score drops significantly between sessions:

1. Run `self-diagnostic` with scope `full` to identify new issues
2. Check recent commits for regressions
3. Run the test suite to confirm failures
4. Prioritize fixes based on severity deductions
5. Document the root cause in the session history

---

## 9. EU AI Act Compliance

### Article 12: Automatic Logging

The self-improving agent system directly supports EU AI Act Article 12 (Automatic Logging) requirements:

| Requirement | How DWS6 Complies |
|-------------|-------------------|
| All AI system events must be automatically logged | Every agent call is logged to Supabase via `logExecution()` with status (started/completed/error) |
| Logs must enable traceability of system decisions | `AgentExecutionLog` records input, output, session ID, user ID, org ID, duration, and timestamps |
| Retention periods must meet regulatory requirements | Logs persisted in Supabase PostgreSQL with configurable retention policies |

### Reasoning Lineage

The `AgentResponse.reasoning` field provides a human-readable explanation of every agent decision. Combined with the reflection agent's quality evaluation, this creates a documented reasoning chain:

```
Input → Agent processes → Reasoning generated → Reflection evaluates → Quality scored
         (logged)           (logged)              (logged)               (logged)
```

Each step is persisted to the `agent_executions` table in Supabase with:

- `agent_name` -- Which agent acted
- `input` -- What data was provided
- `output` -- Full `AgentResponse` including reasoning
- `status` -- Execution outcome
- `duration_ms` -- Processing time
- `created_at` -- ISO 8601 timestamp

### Observability Metadata

The reflection agent's `observability-metadata` dimension specifically checks for:

- `durationMs` -- Execution timing
- `llmModel` -- Which LLM model was used
- `llmTokens` -- Token usage for cost tracking

This metadata is flagged as a quality requirement, ensuring that all agent outputs meet the traceability standard required by the EU AI Act.

---

## 10. Maintenance

### Adding New Diagnostic Checks

To extend the self-diagnostic agent with new checks:

**Step 1:** Add a new private method to `SelfDiagnosticAgent`:

```typescript
private async checkNewArea(basePath: string): Promise<DiagnosticFinding[]> {
  const findings: DiagnosticFinding[] = [];
  // Your diagnostic logic here
  findings.push({
    severity: 'medium',
    category: 'your-category',
    message: 'Description of the finding',
    file: 'path/to/file',
    suggestion: 'How to fix it',
  });
  return findings;
}
```

**Step 2:** Add the scope to the `DiagnosticScope` type:

```typescript
type DiagnosticScope = 'full' | 'agents' | 'tests' | 'security' | 'types' | 'your-scope';
```

**Step 3:** Wire it into the `execute()` method:

```typescript
if (scope === 'full' || scope === 'your-scope') {
  findings.push(...(await this.checkNewArea(basePath)));
}
```

**Step 4:** Add corresponding tests in `src/__tests__/agents.test.ts`.

### Extending Reflection Criteria

To add a new quality dimension to the reflection agent:

**Step 1:** Add a new evaluation method:

```typescript
private evaluateNewDimension(output: AgentResponse): QualityDimension {
  let score = 0.5;
  // Scoring logic
  return {
    name: 'your-dimension-name',
    score: Math.min(1.0, score),
    feedback: 'Explanation of the score',
  };
}
```

**Step 2:** Call it in the `execute()` method alongside existing dimensions:

```typescript
dimensions.push(this.evaluateNewDimension(agentOutput));
```

The overall score automatically recalculates as the average of all dimensions.

### Extending the Codebase Health Script

To add new metrics to `scripts/codebase_health.py`:

1. Add an `analyze_*` function following the existing pattern
2. Include its output in the `generate_report()` function
3. Update `compute_health_score()` with appropriate point allocations
4. Add markdown formatting in `format_markdown()`

### Registering New Agents

To add a new agent to the registry:

1. Create `src/agents/your-agent.agent.ts` extending `BaseAgent`
2. Import and register in `src/agents/index.ts`:
   ```typescript
   import { YourAgent } from './your-agent.agent.js';
   // In registerDefaults():
   this.register(new YourAgent());
   ```
3. Add tests in `src/__tests__/agents.test.ts`
4. Run the self-diagnostic agent to verify registration

### File Reference

| File | Purpose |
|------|---------|
| `src/agents/self-diagnostic.agent.ts` | Self-diagnostic agent implementation |
| `src/agents/reflection.agent.ts` | Reflection agent implementation |
| `src/agents/index.ts` | Agent registry with all 7 agents |
| `src/agents/base.agent.ts` | Base agent class (LLM, logging) |
| `src/agents/types.ts` | Shared TypeScript interfaces |
| `src/agents/routes.ts` | REST API endpoints for agents |
| `src/__tests__/agents.test.ts` | Agent test suite (16 tests) |
| `scripts/codebase_health.py` | Python health report generator |
| `.github/workflows/test-on-pr.yml` | CI/CD test and security workflow |
| `CLAUDE.md` | Project instructions including self-improvement protocol |

---

**Version:** 1.0
**Effective Date:** 11 February 2026
**Next Review:** Q2 2026

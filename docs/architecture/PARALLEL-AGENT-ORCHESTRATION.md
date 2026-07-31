# Parallel Agent Orchestration Framework

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/parallel-agent-orchestration-S6sgZ | Date: 10.02.2026 | Changes: Initial creation - 8-skill framework for parallel AI agent orchestration with production hardening, workflow definition, and Agent Foundry integration

Session Links & References:
  - Claude Code (claude/parallel-agent-orchestration-S6sgZ): https://github.com/blogtheristo/dws6/commits/claude/parallel-agent-orchestration-S6sgZ

Document Status:
  - Created: 10.02.2026
  - Last Modified: 10.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: DRAFT

Compliance:
  - Applicable Regulations: EU AI Act (Article 12), GDPR
  - Reference Documents: AGENTS.md, AgentFoundry/DEPLOYMENT_GUIDE.md, .workflows/agents/ULTRA_AGENT_COORDINATOR.md, docs/architecture/03-ORCHESTRATION-LAYER.md

Legal:
  - Intellectual Property: Lifetime Oy
  - Review Required: Architecture Review

***

**Version:** 1.0
**Effective Date:** 2026-02-10
**Status:** Draft
**Document Type:** Architecture Specification (Cross-Cutting)
**Scope:** Spans all delivery phases — planning, execution, integration, operations

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Gap Analysis: Original 4 Skills](#2-gap-analysis-original-4-skills)
3. [The 8-Skill Framework](#3-the-8-skill-framework)
4. [Skill 1: Task Decomposition (Improved)](#4-skill-1-task-decomposition)
5. [Skill 2: Sub-Agent Coordination (Improved)](#5-skill-2-sub-agent-coordination)
6. [Skill 3: Smart Forking (Improved)](#6-skill-3-smart-forking)
7. [Skill 4: Simulation Testing (Improved)](#7-skill-4-simulation-testing)
8. [Skill 5: State & Signal Management (NEW)](#8-skill-5-state--signal-management)
9. [Skill 6: Conflict Resolution & Merge Strategy (NEW)](#9-skill-6-conflict-resolution--merge-strategy)
10. [Skill 7: Observability & Cost Control (NEW)](#10-skill-7-observability--cost-control)
11. [Skill 8: Recovery & Rollback (NEW)](#11-skill-8-recovery--rollback)
12. [Production Workflow](#12-production-workflow)
13. [Agent Foundry Integration](#13-agent-foundry-integration)
14. [Infrastructure Mapping](#14-infrastructure-mapping)
15. [Security Hardening for Parallel Sessions](#15-security-hardening-for-parallel-sessions)
16. [EU AI Act Compliance](#16-eu-ai-act-compliance)

---

## 1. Executive Summary

This document defines the production-grade framework for running parallel AI agent sessions across the DWS IQ 6 platform. It evolves the original 4-skill conceptual model into an 8-skill operational framework that maps directly to existing infrastructure: git worktrees, MCP Hub, Lifetime Scope Signals, Agent Foundry, and Temporal.io.

### Problem Statement

The original 4 skills (Task Decomposition, Sub-Agent Coordination, Smart Forking, Simulation Testing) describe *what* to do but not *how* to do it within the DWS production environment. They also omit critical operational concerns:

- No state management across parallel sessions
- No conflict resolution strategy when merging parallel outputs
- No observability or cost tracking across concurrent agents
- No recovery plan when a parallel agent fails
- No mapping to existing infrastructure (worktrees, MCP Hub, Signals)

### Solution

Extend to 8 skills. Map each skill to concrete DWS tooling. Define the end-to-end workflow from decomposition through merge and deployment.

---

## 2. Gap Analysis: Original 4 Skills

| Original Skill | Strength | Gap |
|----------------|----------|-----|
| **Task Decomposition** | Correct principle: break into independent chunks | No dependency graph. No mapping to Lifetime Scope Signals phases. No criteria for "independent enough." |
| **Sub-Agent Coordination** | Correct: specialist roles reduce context waste | No role registry. No mapping to AgentFoundry configs. No handoff protocol between specialists. |
| **Smart Forking** | Correct: new problem = new instance | No criteria for "new" vs "continuation." No worktree lifecycle management. No session cost budgets. |
| **Simulation Testing** | Correct: validate before integration | No definition of validation gates. No merge conflict detection. No automated regression pipeline. |

### What Was Missing Entirely

| Missing Capability | Risk If Absent |
|-------------------|----------------|
| **State & Signal Management** | Agents duplicate work or block each other silently |
| **Conflict Resolution** | Merge failures destroy work from multiple parallel sessions |
| **Observability & Cost Control** | 8 parallel Claude sessions can burn through API budgets unnoticed |
| **Recovery & Rollback** | One failed agent corrupts the entire parallel batch |

---

## 3. The 8-Skill Framework

```
┌─────────────────────────────────────────────────────────────────┐
│              PARALLEL AGENT ORCHESTRATION SKILLS                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PLANNING PHASE                                                 │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ S1: Task          │  │ S2: Sub-Agent    │                    │
│  │ Decomposition     │→ │ Coordination     │                    │
│  └──────────────────┘  └──────────────────┘                    │
│           │                      │                              │
│  EXECUTION PHASE                 ▼                              │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ S3: Smart         │  │ S5: State &      │                    │
│  │ Forking           │← │ Signal Mgmt      │                    │
│  └──────────────────┘  └──────────────────┘                    │
│           │                      │                              │
│  INTEGRATION PHASE               ▼                              │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ S4: Simulation    │→ │ S6: Conflict     │                    │
│  │ Testing           │  │ Resolution       │                    │
│  └──────────────────┘  └──────────────────┘                    │
│           │                      │                              │
│  OPERATIONS PHASE                ▼                              │
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ S7: Observability │  │ S8: Recovery &   │                    │
│  │ & Cost Control    │← │ Rollback         │                    │
│  └──────────────────┘  └──────────────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Skill 1: Task Decomposition

**Purpose:** Break a feature into independent, parallelizable work units with explicit dependency graphs.

### Original Definition (Preserved)

> Break features into independent, parallelizable chunks.
> "Build login" → 8 separate sub-problems that don't block each other.

### Production Improvements

#### 1.1 Dependency Graph Required

Every decomposition must produce a dependency graph that maps to Lifetime Scope Signals phases:

```
DECOMPOSITION: "Build Firehorse Dashboard"

PHASE 1 (No dependencies - launch immediately):
  ├── T1: Database schema & RLS policies
  ├── T2: API route scaffolding
  └── T3: UI component library setup

PHASE 2 (Needs Phase 1 signals):
  ├── T4: Report engine API ← LISTENS [T1]:READY:schema
  ├── T5: Automation API    ← LISTENS [T1]:READY:schema
  └── T6: Auth middleware    ← LISTENS [T2]:READY:routes

PHASE 3 (Needs Phase 2 signals):
  ├── T7: Dashboard pages   ← LISTENS [T4]:READY, [T6]:READY
  └── T8: Integration tests ← LISTENS [T4]:READY, [T5]:READY
```

#### 1.2 Independence Criteria

A task is "independent enough" for parallel execution when:

| Criterion | Test |
|-----------|------|
| **No shared mutable state** | Tasks don't write to the same files or database tables |
| **Interface-only coupling** | Tasks depend on contracts (types, API shapes), not implementations |
| **Testable in isolation** | Task can be validated without other tasks completing |
| **Merge-safe** | Git changes touch different file paths (no overlapping edits) |

#### 1.3 Decomposition Template

```yaml
# .workflows/decompositions/YYYY-MM-DD-feature-name.yaml
feature: "Build Firehorse Dashboard"
decomposed_by: "claude/session-id"
date: "2026-02-10"

tasks:
  - id: T1
    title: "Database schema & RLS policies"
    phase: 1
    files_touched: ["supabase/migrations/"]
    signals_emitted: ["READY:schema-firehorse"]
    estimated_tokens: 50000
    agent_role: "Backend Specialist"

  - id: T4
    title: "Report engine API"
    phase: 2
    files_touched: ["src/routes/reports/", "src/services/reports/"]
    depends_on: ["T1"]
    listens_for: ["[T1]:READY:schema-firehorse"]
    signals_emitted: ["READY:report-api"]
    estimated_tokens: 80000
    agent_role: "Backend Specialist"
```

#### 1.4 Anti-Patterns

- Decomposing into tasks that share the same files (guaranteed merge conflicts)
- Creating more than 8 parallel tasks (diminishing returns, coordination overhead dominates)
- Skipping the dependency graph ("they're all independent" — they rarely are)
- Decomposing without checking existing `src/` file boundaries

---

## 5. Skill 2: Sub-Agent Coordination

**Purpose:** Assign specialist roles to each parallel instance with clear boundaries, handoff protocols, and context budgets.

### Original Definition (Preserved)

> Assign specialist roles to each instance.
> Frontend Claude, Backend Claude, Testing Claude — each with focused context.

### Production Improvements

#### 2.1 Role Registry

Map specialist roles to AgentFoundry configuration patterns:

| Role | Context Focus | Primary Files | MCP Tools | Token Budget |
|------|--------------|---------------|-----------|-------------|
| **DB Specialist** | Schema, migrations, RLS | `supabase/migrations/`, `src/services/` | `query_carbon_calculations`, `upsert_bim_metadata` | 100K |
| **Backend Specialist** | API routes, services, middleware | `src/routes/`, `src/services/`, `src/middleware/` | Supabase MCP, Redis MCP | 150K |
| **Frontend Specialist** | React components, pages, styles | `dws6.com/dashboard/firehorse/v9-react/` | None (no MCP needed) | 120K |
| **Testing Specialist** | Test suites, validation | `src/__tests__/`, test configs | All MCP tools (read-only) | 80K |
| **DevOps Specialist** | Docker, CI/CD, deployment | `.github/workflows/`, `docker-compose*.yml` | None | 60K |
| **Security Specialist** | Auth, RLS, secrets, compliance | `src/middleware/auth*`, `src/services/auth*` | Redis MCP | 80K |

#### 2.2 Agent Context Injection

Each specialist receives a focused system prompt via worktree-specific `.claude/` configuration:

```bash
# Create specialist worktree
./scripts/new-claude-worktree.sh feature-reports-backend

# Inject specialist context into .claude/settings.json
cat > ~/.claude-worktrees/dws6/feature-reports-backend/.claude/instructions.md << 'EOF'
You are the Backend Specialist for the Firehorse Reports feature.

SCOPE: src/routes/reports/, src/services/reports/
DO NOT MODIFY: Frontend code, database migrations, test files.

INTERFACES YOU CONSUME:
- Database: supabase/migrations/XXX_firehorse_reports.sql (read-only)
- Auth: src/middleware/auth.middleware.ts (import only)

INTERFACES YOU PRODUCE:
- API: src/routes/reports/*.ts (RESTful endpoints)
- Services: src/services/reports/*.ts (business logic)

SIGNAL WHEN DONE:
  node .workflows/agents/coordinator.cjs emit T4 READY:report-api
EOF
```

#### 2.3 Handoff Protocol

When one specialist produces output that another consumes:

```
1. Producer EMITS signal:  [T1]:READY:schema-firehorse
2. Coordinator receives:   node coordinator.cjs status → shows T4 unblocked
3. Consumer PULLS:         git fetch origin; git merge origin/feature-schema
4. Consumer validates:     Types/interfaces match expected contract
5. Consumer proceeds:      Implements against the merged interface
```

#### 2.4 Anti-Patterns

- Giving a specialist access to the entire codebase (context pollution)
- Not defining interface contracts before launching parallel agents
- Launching 8 specialists without a coordinator instance
- Allowing specialists to modify files outside their scope

---

## 6. Skill 3: Smart Forking

**Purpose:** Decide when to create new agent instances vs. continue existing context, with lifecycle management.

### Original Definition (Preserved)

> Know when to branch conversations vs continue existing context.
> New problem = new instance. Iteration = same instance.

### Production Improvements

#### 3.1 Decision Matrix

| Situation | Action | Reason |
|-----------|--------|--------|
| New feature with no shared state | **New worktree + new instance** | Clean context, no interference |
| Bug fix in code another agent wrote | **New instance, same worktree** | Needs the code but not the conversation history |
| Iteration on review feedback | **Continue existing instance** | Context about the review is valuable |
| Debugging a failed test | **Continue existing instance** | Agent has context about what it built |
| Switching from backend to frontend | **New worktree + new instance** | Different file scope, different role |
| Performance optimization of working code | **New instance, new worktree** | Fresh perspective, measure-first approach |

#### 3.2 Worktree Lifecycle

```
CREATE → DEVELOP → SIGNAL → MERGE → CLEANUP

1. CREATE:   ./scripts/new-claude-worktree.sh feature-X
2. DEVELOP:  Claude Code session in worktree
3. SIGNAL:   node coordinator.cjs emit TX READY:milestone
4. MERGE:    git checkout integration && git merge feature-X
5. CLEANUP:  git worktree remove ~/.claude-worktrees/dws6/feature-X
```

#### 3.3 Session Cost Budgets

Each forked session should have a token budget. Track against it:

```yaml
session_budget:
  max_input_tokens: 500000
  max_output_tokens: 200000
  estimated_cost_eur: 5.00
  alert_at_percentage: 80
  hard_stop_at_percentage: 100
```

When budget is exhausted: emit ERROR signal, checkpoint state, hand off to coordinator.

#### 3.4 Context Preservation on Fork

When forking a new instance from an existing one, preserve:

- Interface contracts (types, API shapes)
- Test expectations
- Known constraints and decisions

Do NOT preserve:
- Implementation details of other agents' code
- Full conversation history (summarize instead)
- Debugging context from unrelated issues

---

## 7. Skill 4: Simulation Testing

**Purpose:** Validate parallel agent outputs before integration with automated gates.

### Original Definition (Preserved)

> Run outputs through validation before integration.
> Catch conflicts early when merging 8 different codebases.

### Production Improvements

#### 4.1 Validation Gate Pipeline

```
AGENT OUTPUT
    │
    ▼
┌─────────────────┐
│ GATE 1: Lint     │ eslint, ruff, tsc --noEmit
│ (per-worktree)   │ FAIL → back to agent
└────────┬────────┘
         ▼
┌─────────────────┐
│ GATE 2: Unit     │ vitest run (isolated)
│ Tests            │ FAIL → back to agent
└────────┬────────┘
         ▼
┌─────────────────┐
│ GATE 3: Merge    │ git merge --no-commit --no-ff
│ Dry Run          │ CONFLICTS → Skill 6
└────────┬────────┘
         ▼
┌─────────────────┐
│ GATE 4: Integ.   │ vitest run (full suite on merged code)
│ Tests            │ FAIL → identify which agent broke it
└────────┬────────┘
         ▼
┌─────────────────┐
│ GATE 5: Build    │ npm run build && docker build
│ Verification     │ FAIL → identify breaking change
└────────┬────────┘
         ▼
    READY TO MERGE
```

#### 4.2 Merge Dry Run Script

```bash
#!/bin/bash
# scripts/parallel-merge-dryrun.sh
# Tests whether N branches can merge cleanly into integration branch

INTEGRATION_BRANCH="integration/feature-name"
BRANCHES=("feature-schema" "feature-reports-api" "feature-reports-ui")

git checkout -b "$INTEGRATION_BRANCH" main

for branch in "${BRANCHES[@]}"; do
  echo "Testing merge of $branch..."
  if ! git merge --no-commit --no-ff "origin/$branch" 2>/dev/null; then
    echo "CONFLICT: $branch has merge conflicts"
    git merge --abort
    # Emit ERROR signal
    node .workflows/agents/coordinator.cjs emit "$branch" "ERROR:merge-conflict"
  else
    git reset --hard HEAD
    echo "OK: $branch merges cleanly"
  fi
done
```

#### 4.3 Contract Testing

Before merging, verify that producer/consumer interfaces match:

```typescript
// src/__tests__/contracts/reports-api.contract.test.ts
import { ReportCreateRequest, ReportResponse } from '../routes/reports/types';

describe('Reports API Contract', () => {
  it('request shape matches what frontend expects', () => {
    const request: ReportCreateRequest = {
      title: 'Q1 Carbon Report',
      type: 'carbon_footprint',
      period: { start: '2026-01-01', end: '2026-03-31' },
    };
    // Schema validation ensures contract adherence
    expect(ReportCreateRequestSchema.safeParse(request).success).toBe(true);
  });
});
```

---

## 8. Skill 5: State & Signal Management (NEW)

**Purpose:** Coordinate shared state and progress across parallel agents using Lifetime Scope Signals and persistent storage.

### Why This Was Missing

The original 4 skills assume agents are fully independent. In practice, parallel agents need to:
- Know when dependencies are ready
- Share interface definitions without sharing implementations
- Avoid duplicating work on shared concerns (auth, logging, error handling)

### 5.1 Signal-Based Coordination

Map directly to the existing Lifetime Scope Signals protocol:

```
SIGNAL FORMAT: [AGENT-ID]:SIGNAL_TYPE:MILESTONE:TIMESTAMP

SIGNAL TYPES:
  READY    → Milestone achieved, dependents may proceed
  COMPLETE → All work finished, ready for merge
  ERROR    → Failure occurred, may block dependents
  BLOCKED  → Waiting for external dependency
```

**Tooling:** `.workflows/agents/coordinator.cjs`

```bash
# Agent emits when schema is ready
node coordinator.cjs emit T1 READY:schema-firehorse

# Dependent agent checks before starting
node coordinator.cjs status
# Output: T4 (Report API) - UNBLOCKED (T1:READY:schema-firehorse received)
```

### 5.2 Shared State Boundaries

| State Type | Storage | Access Pattern |
|-----------|---------|----------------|
| **Interface contracts** (types, API shapes) | Shared git branch (`contracts/feature-X`) | All agents read, contract owner writes |
| **Agent progress** | Supabase `agent_signals` table | Coordinator reads, agents write |
| **Configuration** | `.env` per worktree (copied, not shared) | Each agent reads own copy |
| **Test fixtures** | Shared git branch | Testing specialist writes, all read |
| **Build artifacts** | Not shared | Each worktree builds independently |

### 5.3 Checkpoint Protocol

Every agent should checkpoint state at natural boundaries:

```yaml
checkpoint:
  trigger: "every 30 minutes OR on milestone completion"
  storage: "git commit on feature branch"
  metadata:
    files_modified: ["src/routes/reports/index.ts"]
    tests_passing: true
    tokens_consumed: 45000
    next_step: "Implement pagination endpoint"
```

This enables Skill 8 (Recovery) to resume from last good state.

---

## 9. Skill 6: Conflict Resolution & Merge Strategy (NEW)

**Purpose:** Detect, prevent, and resolve conflicts when merging outputs from parallel agents.

### Why This Was Missing

"Simulation Testing" catches conflicts but doesn't resolve them. With 8 parallel agents, merge conflicts are the primary failure mode.

### 6.1 Prevention: File Ownership Matrix

Before launching parallel agents, assign file ownership:

```yaml
# .workflows/decompositions/file-ownership.yaml
ownership:
  T1_db_specialist:
    exclusive: ["supabase/migrations/"]
    shared_read: ["src/types/"]

  T4_backend_specialist:
    exclusive: ["src/routes/reports/", "src/services/reports/"]
    shared_read: ["supabase/migrations/", "src/types/"]

  T7_frontend_specialist:
    exclusive: ["dws6.com/dashboard/firehorse/v9-react/src/pages/reports/"]
    shared_read: ["src/types/"]

  # Shared files need a single owner
  shared_types_owner: T1_db_specialist
  shared_config_owner: T5_devops_specialist
```

**Rule:** No two agents may have `exclusive` write access to the same path. Shared files have exactly one owner.

### 6.2 Detection: Pre-Merge Analysis

```bash
# scripts/detect-parallel-conflicts.sh
# Run before attempting merge

for branch in "${BRANCHES[@]}"; do
  # List files modified by this branch
  git diff --name-only main..."$branch" >> /tmp/all_files.txt
done

# Find duplicates (same file modified by multiple branches)
sort /tmp/all_files.txt | uniq -d > /tmp/conflicts.txt

if [ -s /tmp/conflicts.txt ]; then
  echo "WARNING: These files were modified by multiple agents:"
  cat /tmp/conflicts.txt
  echo "Resolution required before merge."
fi
```

### 6.3 Resolution Strategies

| Conflict Type | Strategy | Automated? |
|--------------|----------|------------|
| **Different files** | Auto-merge (no conflict) | Yes |
| **Same file, different sections** | Git 3-way merge | Usually yes |
| **Same file, overlapping lines** | Manual: coordinator agent resolves | No |
| **Interface mismatch** | Contract test failure → producer fixes | Semi-auto |
| **Semantic conflict** (compiles but wrong) | Integration test failure → root cause analysis | No |

### 6.4 Merge Order

Merge in dependency order (Phase 1 → Phase 2 → Phase 3):

```
1. Merge Phase 1 branches (schema, scaffolding, docs)
2. Run Gate 4 (integration tests) on Phase 1
3. Merge Phase 2 branches (APIs, services)
4. Run Gate 4 on Phase 1 + 2
5. Merge Phase 3 branches (UI, integration tests)
6. Run Gate 5 (full build)
```

---

## 10. Skill 7: Observability & Cost Control (NEW)

**Purpose:** Monitor progress, cost, and health of all parallel agents in real time.

### Why This Was Missing

Running 8 Claude sessions simultaneously without observability is like deploying microservices without monitoring. You need to know: which agents are stuck, which are burning tokens, which have finished.

### 7.1 Agent Dashboard

Track via Supabase `agent_metrics` table (migration 013):

```sql
-- Real-time parallel session overview
SELECT
  agent_id,
  status,
  tokens_consumed,
  cost_eur,
  last_signal,
  last_signal_at,
  EXTRACT(EPOCH FROM (now() - last_signal_at)) / 60 AS minutes_since_signal
FROM agent_metrics
WHERE session_id = 'parallel-batch-2026-02-10'
ORDER BY phase, agent_id;
```

### 7.2 Cost Tracking

```yaml
# Per-session cost limits
parallel_batch:
  total_budget_eur: 50.00
  per_agent_budget_eur: 8.00
  alert_threshold_percentage: 70
  hard_stop_percentage: 90

  model_costs:
    claude_opus_4_6:
      input_per_1m_tokens: 15.00
      output_per_1m_tokens: 75.00
    claude_sonnet_4_5:
      input_per_1m_tokens: 3.00
      output_per_1m_tokens: 15.00
    groq_llama_3_1_70b:
      input_per_1m_tokens: 0.59
      output_per_1m_tokens: 0.79
```

### 7.3 Health Signals

An agent is "stuck" if:
- No signal emitted in 15 minutes
- Token consumption rate exceeds 2x the estimated budget
- Same file edited more than 3 times (potential loop)

**Automated response:** Coordinator emits `[COORDINATOR]:HEALTH_CHECK:agent-id` and waits for `READY` signal.

### 7.4 Session Summary Report

After parallel batch completes, generate:

```
PARALLEL SESSION REPORT: Build Firehorse Dashboard
Date: 2026-02-10
Duration: 2h 15m

AGENTS:
  T1 (DB):       COMPLETE  | 45K tokens | €0.85 | 3 signals
  T2 (Routes):   COMPLETE  | 62K tokens | €1.10 | 2 signals
  T3 (UI Lib):   COMPLETE  | 38K tokens | €0.70 | 2 signals
  T4 (Report):   COMPLETE  | 95K tokens | €1.80 | 4 signals
  T5 (Auto):     COMPLETE  | 78K tokens | €1.45 | 3 signals
  T7 (Dashboard): COMPLETE | 110K tokens | €2.10 | 5 signals
  T8 (Tests):    COMPLETE  | 55K tokens | €1.00 | 2 signals

TOTAL: 483K tokens | €9.00
MERGE: Clean (0 conflicts)
TESTS: 47/47 passing
BUILD: Success
```

---

## 11. Skill 8: Recovery & Rollback (NEW)

**Purpose:** Handle agent failures gracefully without losing work from other parallel agents.

### Why This Was Missing

The original model assumes all agents succeed. In production, agents fail: context limits hit, hallucination loops, external API outages, merge conflicts. Without recovery, one failure wastes the work of all parallel agents.

### 8.1 Failure Classification

| Failure Type | Detection | Recovery |
|-------------|-----------|----------|
| **Token budget exhausted** | Cost tracking alert | Checkpoint → new session with summary |
| **Hallucination loop** | Same file edited 3+ times, tests still fail | Kill session → fresh instance with constraints |
| **External API down** | HTTP errors from Supabase/Groq/Claude | Retry with backoff → switch model → manual |
| **Merge conflict** | Gate 3 failure | Skill 6 resolution protocol |
| **Wrong approach** | Human review or test failure pattern | Kill session → new decomposition for that task |

### 8.2 Checkpoint-Based Recovery

```bash
# Agent T4 failed at token limit
# Recovery: create new session from last checkpoint

# 1. Find last good commit on agent's branch
git log --oneline origin/feature-reports-api | head -5

# 2. Create new worktree from that point
./scripts/new-claude-worktree.sh feature-reports-api-v2

# 3. Inject recovery context
cat > recovery-context.md << 'EOF'
RECOVERY SESSION for T4 (Report API)
Previous session exhausted token budget.

COMPLETED:
- GET /api/reports endpoint (tested, working)
- POST /api/reports endpoint (tested, working)

REMAINING:
- PUT /api/reports/:id (update report)
- DELETE /api/reports/:id (soft delete)
- GET /api/reports/:id/export (PDF/CSV export)

SIGNAL WHEN DONE: READY:report-api
EOF
```

### 8.3 Isolation Guarantee

A failed agent must NOT corrupt other agents' work:

- Each agent works in its own worktree (file isolation)
- Each agent has its own `.env` (secret isolation)
- Database writes use agent-specific namespaces or are gated behind approval
- Git branches are independent until explicit merge

### 8.4 Rollback Protocol

If a merged agent's code breaks integration:

```bash
# 1. Identify breaking branch
git bisect start HEAD integration-before-merge

# 2. Revert the specific merge
git revert -m 1 <merge-commit-hash>

# 3. Emit signal to re-queue the task
node coordinator.cjs emit T4 ERROR:integration-failure

# 4. Agent fixes and re-submits through Gate pipeline
```

---

## 12. Production Workflow

### End-to-End Parallel Agent Workflow

```
STEP 1: DECOMPOSE (Skill 1)
│  Human + Architect Agent analyze the feature
│  Output: Dependency graph, task list, file ownership matrix
│
STEP 2: ASSIGN (Skill 2)
│  Map tasks to specialist roles
│  Create AgentFoundry configs for each role
│  Output: Role assignments, context injections, token budgets
│
STEP 3: FORK (Skill 3)
│  Create worktrees for each parallel agent
│  ./scripts/new-claude-worktree.sh feature-X-taskN
│  Inject specialist instructions into each worktree
│  Output: N running Claude Code sessions
│
STEP 4: EXECUTE + COORDINATE (Skills 5, 7)
│  Agents work in parallel
│  Emit signals on milestones
│  Coordinator monitors health and cost
│  Phase 2 agents wait for Phase 1 signals
│  Output: Feature branches with committed code
│
STEP 5: VALIDATE (Skill 4)
│  Run per-branch gates (lint, unit tests)
│  Run merge dry-run
│  Run contract tests
│  Output: All branches pass gates
│
STEP 6: INTEGRATE (Skill 6)
│  Merge in dependency order
│  Resolve any conflicts
│  Run integration tests after each phase merge
│  Output: Single integration branch
│
STEP 7: VERIFY (Skill 4)
│  Full build verification
│  Docker build
│  E2E tests if available
│  Output: Verified integration branch
│
STEP 8: REPORT (Skill 7)
│  Generate session summary
│  Log to Supabase agent_metrics
│  Cost analysis
│  Output: Session report
│
STEP 9: CLEANUP (Skill 3)
│  Remove worktrees
│  Prune git references
│  Archive session configs
│  Output: Clean workspace
│
ON FAILURE AT ANY STEP: Skill 8 Recovery Protocol
```

### Coordinator Role

The **coordinator** is not a parallel worker. It's the orchestration instance that:

1. Runs the decomposition (Step 1)
2. Creates worktrees and assigns roles (Steps 2-3)
3. Monitors signals and health (Step 4)
4. Runs the validation pipeline (Steps 5-7)
5. Handles recovery when agents fail

The coordinator maps to: `node .workflows/agents/coordinator.cjs`

---

## 13. Agent Foundry Integration

### Mapping Skills to AgentFoundry

The 8 skills extend the existing AgentFoundry product (`Store/PRODUCT_AGENT_FOUNDRY.md`) with parallel orchestration capabilities:

| Skill | AgentFoundry Feature | Extension Needed |
|-------|---------------------|-----------------|
| S1: Decomposition | Not covered | Add `decomposition` config type to AgentFoundry |
| S2: Coordination | YAML agent configs | Add `role` and `scope` fields to agent YAML |
| S3: Forking | Phased deployment | Add `worktree_lifecycle` config |
| S4: Testing | Guardrails | Add `validation_gates` config |
| S5: Signals | Lifetime Scope Signals | Already implemented — formalize in AgentFoundry |
| S6: Conflicts | Not covered | Add `file_ownership` config |
| S7: Observability | Cost tracking | Extend with parallel session dashboards |
| S8: Recovery | Not covered | Add `recovery_policy` config |

### Proposed AgentFoundry Config Extension

```yaml
# AgentFoundry/configs/parallel/firehorse-dashboard.yaml
parallel_session:
  id: "parallel-firehorse-dashboard-2026-02-10"
  feature: "Firehorse Dashboard V1"
  coordinator: "claude-opus-4.6"

  decomposition:
    phases: 3
    max_parallel_agents: 6
    dependency_graph: ".workflows/decompositions/firehorse-dashboard.yaml"

  agents:
    - id: T1
      role: db_specialist
      config: "configs/roles/db-specialist.yaml"
      worktree_branch: "feature-firehorse-schema"
      token_budget: 100000
      files_exclusive: ["supabase/migrations/"]

    - id: T4
      role: backend_specialist
      config: "configs/roles/backend-specialist.yaml"
      worktree_branch: "feature-reports-api"
      token_budget: 150000
      files_exclusive: ["src/routes/reports/", "src/services/reports/"]
      depends_on: ["T1"]
      listens_for: ["[T1]:READY:schema-firehorse"]

  validation_gates:
    - gate: lint
      command: "npm run lint"
    - gate: unit_tests
      command: "npm run test"
    - gate: merge_dryrun
      command: "scripts/parallel-merge-dryrun.sh"
    - gate: integration_tests
      command: "npm run test -- --run"
    - gate: build
      command: "npm run build"

  cost_control:
    total_budget_eur: 50.00
    per_agent_budget_eur: 10.00
    alert_at_percentage: 70

  recovery_policy:
    on_token_exhaustion: "checkpoint_and_resume"
    on_merge_conflict: "coordinator_resolves"
    on_test_failure: "agent_retries_once"
    max_retries: 2
```

---

## 14. Infrastructure Mapping

### How Skills Map to Existing DWS Infrastructure

| Component | Used By Skills | Location |
|-----------|---------------|----------|
| **Git Worktrees** | S3 (Forking), S6 (Conflicts) | `scripts/new-claude-worktree.sh` |
| **Lifetime Scope Signals** | S5 (Signals), S1 (Dependencies) | `.workflows/agents/coordinator.cjs` |
| **MCP Hub** | S2 (Coordination), S5 (Signals) | `mcp-hub/server.py` |
| **Supabase agent_metrics** | S7 (Observability) | Migration 013 |
| **Supabase agent_signals** | S5 (Signals) | Migration 013 |
| **Supabase agent_costs** | S7 (Cost Control) | Migration 013 |
| **Supabase agent_approvals** | S8 (Recovery, human escalation) | Migration 013 |
| **Temporal.io** | S5 (Checkpoints), S8 (Recovery) | `config/temporal/development.yaml` |
| **Docker Compose** | S4 (Testing), S7 (Monitoring) | `docker-compose.hybrid.yml` |
| **AgentFoundry configs** | S2 (Roles), S1 (Decomposition) | `AgentFoundry/configs/` |
| **GitHub Actions** | S4 (CI gates) | `.github/workflows/` |
| **Vitest** | S4 (Testing gates) | `npm run test` |

### New Infrastructure Required

| Component | Purpose | Priority |
|-----------|---------|----------|
| `scripts/parallel-merge-dryrun.sh` | Automated merge conflict detection | P1 |
| `scripts/parallel-session-report.sh` | Session summary generation | P2 |
| `AgentFoundry/configs/parallel/` | Parallel session configs | P1 |
| `AgentFoundry/configs/roles/` | Specialist role definitions | P1 |
| `.workflows/decompositions/` | Task decomposition archives | P2 |

---

## 15. Security Hardening for Parallel Sessions

### Threat Model

| Threat | Mitigation | Skill |
|--------|-----------|-------|
| **Secret leakage between worktrees** | `.env` copied (not shared), per-worktree isolation | S3 |
| **Agent writes outside scope** | File ownership matrix enforced by pre-commit hook | S6 |
| **Runaway cost** | Per-agent token budgets with hard stops | S7 |
| **Credential in LLM output** | Gitleaks scan on every commit (AgentFoundry/Security.md) | S4 |
| **Malicious prompt injection** | Guardrails AI on all agent inputs (AgentFoundry/Security.md) | S2 |
| **Stale worktree with active secrets** | Cleanup protocol with worktree pruning | S3 |

### Worktree Security Checklist (Automated by Scripts)

- [x] `.gitignore` inherits from main repo (verified by `new-claude-worktree.sh`)
- [x] `.env` files copied, not symlinked (worktree-specific values possible)
- [x] `.venv` symlinked (safe, already gitignored)
- [x] No worktrees on C:\Users\ (Windows only, enforced by script)
- [ ] **NEW:** File ownership enforcement via pre-commit hook
- [ ] **NEW:** Token budget tracking per worktree session
- [ ] **NEW:** Automatic worktree cleanup after session ends

---

## 16. EU AI Act Compliance

### Article 12: Automatic Logging

All 8 skills produce audit trails that satisfy EU AI Act Article 12:

| Skill | Audit Trail | Storage |
|-------|------------|---------|
| S1: Decomposition | Dependency graph YAML | Git (`.workflows/decompositions/`) |
| S2: Coordination | Role assignments, context injections | AgentFoundry configs |
| S3: Forking | Worktree creation/destruction timestamps | Git reflog |
| S4: Testing | Gate pass/fail results | CI/CD logs, GitHub Actions |
| S5: Signals | Full signal history | Supabase `agent_signals` table |
| S6: Conflicts | Resolution decisions | Git merge commits |
| S7: Observability | Token usage, cost, health metrics | Supabase `agent_metrics`, `agent_costs` |
| S8: Recovery | Failure classification, recovery actions | Supabase `agent_signals` (ERROR type) |

### Reasoning Lineage

The decomposition → signal → merge chain provides full reasoning lineage:

```
Feature Request
  → Decomposition YAML (why tasks were split this way)
    → Agent Configs (why this role/model/budget)
      → Signal Log (what happened, when, what triggered what)
        → Gate Results (what passed/failed validation)
          → Merge History (how code was integrated)
            → Session Report (total cost, decisions made)
```

This chain is queryable via Supabase for any regulatory audit.

---

## Appendix A: Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│     PARALLEL AGENT ORCHESTRATION CHEAT SHEET     │
├─────────────────────────────────────────────────┤
│                                                  │
│  PLAN:                                           │
│  S1 → Decompose into phased dependency graph     │
│  S2 → Assign specialist roles with scope limits  │
│                                                  │
│  EXECUTE:                                        │
│  S3 → Fork worktrees, inject context             │
│  S5 → Emit/listen signals, checkpoint state      │
│                                                  │
│  INTEGRATE:                                      │
│  S4 → Run 5-gate validation pipeline             │
│  S6 → Merge in phase order, resolve conflicts    │
│                                                  │
│  OPERATE:                                        │
│  S7 → Monitor cost, health, progress             │
│  S8 → Recover from failures, rollback if needed  │
│                                                  │
│  TOOLING:                                        │
│  Worktrees:  scripts/new-claude-worktree.sh      │
│  Signals:    .workflows/agents/coordinator.cjs   │
│  Configs:    AgentFoundry/configs/parallel/       │
│  Metrics:    Supabase agent_metrics table         │
│  Temporal:   config/temporal/development.yaml     │
│                                                  │
│  MAX PARALLEL: 8 agents (diminishing returns)    │
│  MERGE ORDER: Phase 1 → 2 → 3 (dependency)      │
│  BUDGET:      Set per-agent + total limits       │
│  RECOVERY:    Checkpoint every 30min + milestone  │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0
**Last Updated:** February 10, 2026
**Author:** Claude Code (Opus 4.6) — Session claude/parallel-agent-orchestration-S6sgZ
**Owner:** Lifetime Oy
**© 2026 Lifetime Oy. All rights reserved.**

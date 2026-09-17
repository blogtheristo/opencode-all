# Admin Manual: Development Quality Tools

***
# VERSION AND AGENT HISTORY

Version: 2.0

Sessions & Modifications:
  - Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/self-improving-parallel-agents-p4X6m | Date: 21.04.2026 | Changes: Removed self-diagnostic and reflection agents (redundant with existing tooling); manual now covers only the three real tools
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/self-improving-parallel-agents-p4X6m | Date: 11.02.2026 | Changes: Initial creation - Self-improving agent documentation

Session Links & References:
  - Claude Code (claude/self-improving-parallel-agents-p4X6m): https://github.com/blogtheristo/dws6/commits/claude/self-improving-parallel-agents-p4X6m
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_SELF_IMPROVING_AGENTS.md

Document Status:
  - Created: 11.02.2026
  - Last Modified: 21.04.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Indexed In: /docs/Document-index.md
  - Category: Admin Manuals
  - Search Tags: codebase health, CI/CD, DevOps, quality tools, MCP Hub reflection

***

**Version:** 2.0
**Purpose:** Administration guide for the DWS IQ 6 development quality tools
**Audience:** DevOps, AI Engineers, Platform Developers
**Updated:** 21.04.2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Codebase Health Script](#2-codebase-health-script)
3. [CI/CD Test Workflow](#3-cicd-test-workflow)
4. [MCP Hub Reflection Workflow](#4-mcp-hub-reflection-workflow)
5. [Daily Workflow](#5-daily-workflow)
6. [File Reference](#6-file-reference)

---

## 1. Overview

DWS6 uses three tools to maintain codebase quality across AI-assisted coding sessions:

| Tool | File | Purpose |
|------|------|---------|
| Codebase Health Script | `scripts/codebase_health.py` | Prints health report with metrics and recommendations |
| CI/CD Test Workflow | `.github/workflows/test-on-pr.yml` | Runs tests and security checks on every PR |
| MCP Hub Reflection | `mcp-hub/server.py` (`/workflow/reflection`) | Iterative refinement workflow for agent outputs |

The feedback loop is simple: the health script tells you what to fix, the CI workflow prevents regressions, and the MCP Hub reflection endpoint lets agents evaluate each other's output quality.

---

## 2. Codebase Health Script

**File:** `scripts/codebase_health.py`

### How to Run

```bash
# Default: markdown to stdout, no file written
python scripts/codebase_health.py

# JSON to stdout
python scripts/codebase_health.py --output json

# Persist the JSON report (gitignored path)
python scripts/codebase_health.py --output json --output-file health_report.json
```

### What It Analyzes

| Area | Metrics |
|------|---------|
| Tests | Test file count, test case count, per-file line counts |
| Agents | Agent count, error handling, logging, LLM usage, test linkage (`tested_in`) |
| Workflows | Total CI/CD workflows, test/security/lint workflow presence |
| Source | TypeScript file count in `src/`, Python file count in `scripts/` |

### Health Score (0-100)

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

Exit code: **0** if score >= 60, **1** otherwise.

---

## 3. CI/CD Test Workflow

**File:** `.github/workflows/test-on-pr.yml`

Runs on every PR targeting `main` and on pushes to `main` (for `src/**` paths).

### Jobs

**Job 1: `test`** (timeout: 10 min)

| Step | Action |
|------|--------|
| Checkout | `actions/checkout@v4` |
| Setup Node.js 20 | `actions/setup-node@v4` with npm cache |
| Install | `npm ci` |
| Type check | `npx tsc --noEmit --pretty` |
| Tests | `npm test -- --run --reporter=verbose` |
| Artifacts | Test results + coverage (7-day retention) |

**Job 2: `lint-check`** (timeout: 5 min)

Scans `src/` for hardcoded API key patterns (`sk-ant-api`, `gsk_`, `eyJhbG`, `AIza`).

---

## 4. MCP Hub Reflection Workflow

**File:** `mcp-hub/server.py`, endpoint `/workflow/reflection`

The MCP Hub already provides an iterative refinement workflow. When an agent's output needs quality evaluation, call the reflection workflow endpoint rather than a dedicated agent. This keeps quality evaluation at the orchestration layer where it belongs.

*Note: Following the KYA audit, proactive nudges are restricted to the named advisor-phase agents (`compliance`, `customer-sat`, `sitesense`). Latency metrics are kept as observability-only telemetry in ATS to maintain trust score stability.*

---

## 5. Daily Workflow

1. **Start of session:** Run `python scripts/codebase_health.py` and review recommendations
2. **Make changes:** Address top-priority items
3. **Run tests:** `npm test`
4. **Re-check health:** Compare score before and after
5. **Push:** CI workflow validates on PR

---

## 6. File Reference

| File | Purpose |
|------|---------|
| `scripts/codebase_health.py` | Python health report generator |
| `.github/workflows/test-on-pr.yml` | CI/CD test and security workflow |
| `mcp-hub/server.py` | MCP Hub with `/workflow/reflection` endpoint |
| `src/agents/index.ts` | Agent registry |
| `src/agents/base.agent.ts` | Base agent class (LLM, logging) |
| `src/__tests__/agents.test.ts` | Agent test suite |
| `CLAUDE.md` | Project instructions for AI sessions |

---

**Version:** 2.0
**Effective Date:** 21 April 2026
**Next Review:** Q3 2026

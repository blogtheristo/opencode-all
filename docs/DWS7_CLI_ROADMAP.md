---
VERSION AND AGENT HISTORY
Document: DWS7 CLI Roadmap
Version: 1.0
Created: 2026-03-09
Updated: 2026-03-09
Author: Claude Code (Opus 4.6)
Status: Draft

AGENT HISTORY
| Date | Agent | Model | Action |
|------|-------|-------|--------|
| 2026-03-09 | Claude Code | claude-opus-4-6 | Created CLI roadmap based on OpenDev research, existing CLI, and DWS7 roadmap |

Session Links & References:
  - Research: docs/field-notes/2026-03-09-opendev-cli-agent-research.md
  - DWS7 Roadmap: DWS7_ROADMAP.md
  - CLI Entry: cli/src/cli.ts
  - Agent Types: src/agents/types.ts

Document Status:
  - Created: 2026-03-09
  - Last Modified: 2026-03-09
  - Language: English
  - Publication Status: DRAFT
---

# DWS7 CLI Roadmap — Agent-Native Terminal Platform

> **Timeline:** Q1 2026 → Q4 2027
> **Principle:** If it can't be done via `dws <command>`, it's not shipped.
> **Design:** Zero dependencies. Pure Node.js. Pipeable. JSON-native.

---

## Current State (DWS6 CLI — March 2026)

| Capability | Status | Implementation |
|---|---|---|
| Agent listing & discovery | Done | `dws agents`, `dws discover <tag>` |
| Agent execution | Done | `dws run <agent> --input '{}'` |
| Stdin piping | Done | `echo '{}' \| dws run <agent> --stdin` |
| Workflow orchestration | Done | `dws workflow <name> --input '{}'` |
| Event bus query | Done | `dws events --pattern "compliance.*"` |
| MCP tool listing & calling | Done | `dws mcp tools`, `dws mcp call <tool>` |
| Health & status | Done | `dws health`, `dws status` |
| Scenarios/quickstart | Done | `dws scenario construction` |
| Zero-dep argument parser | Done | Manual parser, no Yargs/Commander |
| Auto-detect piped output → JSON | Done | `!process.stdout.isTTY` |

**31 agents registered.** 4 workflows. 4 MCP meta-tools + 1 tool per agent.

---

## Phase 1 — Safety & Observability (Q1 2026, PRs: ~8)

Highest-value, lowest-effort wins. Ship before hardening.

### 1.1 Dry-Run / Plan Mode

```
dws run compliance --input '{...}' --dry-run
dws workflow compliance-assessment --input '{...}' --plan
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-001 | `--dry-run` flag for `dws run` | P0 | 50 LOC |
| CLI-002 | `--plan` flag for `dws workflow` (show steps, no execute) | P0 | 40 LOC |
| CLI-003 | Backend: `dryRun` param in `/api/agents/:name/execute` | P0 | 30 LOC |
| CLI-004 | Backend: `plan` param in `/api/agents/workflow/:name` | P0 | 30 LOC |

**Why now:** OpenDev research (arXiv:2603.05344) shows plan-before-execute prevents accidental state changes. Currently `dws workflow` fires immediately — no preview.

### 1.2 Confirmation Prompt

```
dws workflow compliance-assessment --input '{...}'
# → Shows: 4 steps (emissions → compliance → viability → notify)
# → Asks: "Execute? [Y/n]"
# → Skip with: --yes
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-005 | Interactive Y/n confirmation before workflow execution | P1 | 30 LOC |
| CLI-006 | `--yes` flag to skip confirmation (scripted use) | P1 | 10 LOC |

### 1.3 Execution Tracing

```
dws run compliance --input '{...}' --trace
# → Shows each agentic loop iteration: OBSERVE → THINK → ACT
# → Shows tool calls and results in real-time

dws workflow compliance-assessment --input '{...}' --verbose
# → Shows per-step progress, timing, token usage
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-007 | `--trace` flag: stream agentic loop iterations to stderr | P1 | 80 LOC |
| CLI-008 | `--verbose` flag: workflow step-by-step progress output | P1 | 60 LOC |

---

## Phase 2 — Context & Memory (Q2 2026, PRs: ~10)

Informed by OpenDev's cross-session memory and context compaction patterns.

### 2.1 Session Memory

```
dws run compliance --input '{...}' --project steel-plant-turku
# → Auto-retrieves last 5 compliance results for this project
# → Agent sees: "Previous assessment (2026-02-15): score 72, gap: Scope 3"
# → No manual re-entry of known facts

dws history --project steel-plant-turku --agent compliance --limit 10
# → Shows execution history with scores over time
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-009 | `dws history` command: query agent_executions by project/agent | P0 | 80 LOC |
| CLI-010 | `--project` flag on `dws run`: inject last N results as context | P1 | 60 LOC |
| CLI-011 | Backend: session memory retrieval endpoint | P0 | 100 LOC |
| CLI-012 | Backend: auto-inject prior results into agent context | P1 | 80 LOC |

### 2.2 Context Compaction for Workflows

```
dws workflow compliance-assessment --input '{...}' --compact
# → Between steps, summarize intermediate outputs
# → Step 3 gets a 200-token summary of Step 1, not 2000 tokens raw
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-013 | `--compact` flag: enable inter-step summarization | P2 | 40 LOC |
| CLI-014 | Backend: compaction middleware in WorkflowExecutor | P2 | 200 LOC |

### 2.3 Config File

```bash
# ~/.dws/config.json or .dws.json in project root
{
  "apiUrl": "https://api.dws.example.com",
  "project": "steel-plant-turku",
  "defaultAgent": "compliance",
  "trace": true,
  "compact": true
}
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-015 | Config file loader: ~/.dws/config.json + .dws.json | P1 | 80 LOC |
| CLI-016 | `dws config set <key> <value>` / `dws config get <key>` | P2 | 60 LOC |
| CLI-017 | `dws config init` — interactive config creation | P2 | 40 LOC |
| CLI-018 | Config file merging: env vars > project config > user config | P1 | 30 LOC |

---

## Phase 3 — Model Routing & Performance (Q3 2026, PRs: ~8)

### 3.1 Workload-Specialized Model Routing

```
dws run compliance --input '{...}' --model-tier reasoning
# → Routes to claude-sonnet-4 for complex analysis

dws run sitesense --input '{...}' --model-tier fast
# → Routes to llama-3.3-70b for quick scoring
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-019 | `--model-tier` flag: fast / standard / reasoning | P1 | 30 LOC |
| CLI-020 | LLMClient: tier-to-model resolution table | P0 | 80 LOC |
| CLI-021 | Per-agent default tier in AgentConfig | P1 | 40 LOC |
| CLI-022 | Backend: model tier passed through API | P0 | 30 LOC |

### 3.2 Parallel Agent Execution

```
dws run compliance,emissions-data-analyst,viability --input '{...}'
# → Executes 3 agents in parallel
# → Returns merged JSON array

dws run compliance --input '{...}' --timeout 30s
# → Fails fast if agent doesn't respond in 30s
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-023 | Comma-separated agent execution (parallel) | P1 | 60 LOC |
| CLI-024 | `--timeout` flag per execution | P1 | 30 LOC |
| CLI-025 | Backend: parallel agent execution endpoint | P1 | 100 LOC |
| CLI-026 | Result merging and error aggregation | P2 | 60 LOC |

---

## Phase 4 — Ecosystem & Extensibility (Q4 2026, PRs: ~10)

### 4.1 Plugin System

```
dws plugin install @dws/steel-module
dws plugin list
dws plugin remove @dws/steel-module
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-027 | Plugin manifest format (dws-plugin.json) | P2 | 60 LOC |
| CLI-028 | `dws plugin install/list/remove` commands | P2 | 120 LOC |
| CLI-029 | Plugin agent registration into AgentRegistry | P2 | 80 LOC |

### 4.2 Output Formatting

```
dws run compliance --input '{...}' --format table
dws run compliance --input '{...}' --format csv
dws run compliance --input '{...}' --format yaml
dws run compliance --input '{...}' | jq .result  # JSON (default when piped)
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-030 | `--format` flag: json (default), table, csv, yaml | P1 | 80 LOC |
| CLI-031 | Table formatter with column width auto-detection | P2 | 60 LOC |
| CLI-032 | CSV export with header row | P2 | 30 LOC |

### 4.3 Batch Processing

```
dws batch run compliance --input-file plants.jsonl
# → Reads one JSON per line
# → Executes agent for each
# → Outputs results as JSONL
# → Shows progress bar

dws batch workflow compliance-assessment --input-file sites.jsonl --parallel 4
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-033 | `dws batch run` with JSONL input | P1 | 100 LOC |
| CLI-034 | `dws batch workflow` with JSONL input | P1 | 80 LOC |
| CLI-035 | `--parallel N` concurrency control for batch | P2 | 60 LOC |
| CLI-036 | Progress bar and summary stats for batch | P2 | 40 LOC |

---

## Phase 5 — Enterprise & Compliance (Q1-Q2 2027, PRs: ~8)

### 5.1 Audit & Article 12

```
dws audit --project steel-plant-turku --from 2026-01-01 --to 2026-12-31
# → Full execution log with reasoning lineage
# → EU AI Act Article 12 compliant export

dws audit export --format pdf --project steel-plant-turku
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-037 | `dws audit` command: execution log viewer | P0 | 100 LOC |
| CLI-038 | `dws audit export` with PDF/JSON/CSV output | P1 | 120 LOC |
| CLI-039 | Article 12 reasoning lineage fields in export | P0 | 80 LOC |

### 5.2 Multi-Tenant & Auth

```
dws login
# → Opens browser for OAuth
# → Stores JWT in ~/.dws/credentials.json

dws org switch acme-steel
# → Changes active organization context

dws whoami
# → Shows current user, org, plan tier
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-040 | `dws login` with device code OAuth flow | P0 | 150 LOC |
| CLI-041 | Credential storage (~/.dws/credentials.json) | P0 | 60 LOC |
| CLI-042 | `dws org switch` / `dws org list` | P1 | 50 LOC |
| CLI-043 | `dws whoami` — current auth status | P1 | 30 LOC |
| CLI-044 | Token refresh on 401 (auto-retry) | P1 | 40 LOC |

---

## Phase 6 — Edge & IoT Integration (Q3-Q4 2027, PRs: ~6)

### 6.1 Edge Device Management

```
dws fleet list
# → Shows connected Jetson Orin Nano devices

dws fleet deploy emissions-monitor --device jetson-turku-01
# → Deploys agent to edge device

dws fleet logs --device jetson-turku-01 --follow
# → Streams edge device logs
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-045 | `dws fleet list` — edge device discovery | P1 | 80 LOC |
| CLI-046 | `dws fleet deploy` — push agent to edge | P2 | 150 LOC |
| CLI-047 | `dws fleet logs` — stream edge logs | P2 | 60 LOC |
| CLI-048 | `dws fleet health` — device health dashboard | P1 | 40 LOC |

### 6.2 Real-Time Streams

```
dws stream emissions --project steel-plant-turku
# → WebSocket stream of live emissions data from IoT sensors
# → Outputs JSONL to stdout for downstream piping

dws stream emissions --project steel-plant-turku | dws run compliance --stdin
# → Live emissions → real-time compliance scoring
```

| PR | Title | Priority | Effort |
|----|-------|----------|--------|
| CLI-049 | `dws stream` command with WebSocket client | P2 | 120 LOC |
| CLI-050 | JSONL output for stream → pipe → agent chains | P2 | 40 LOC |

---

## PR Summary

| Phase | Timeline | PRs | Theme |
|-------|----------|-----|-------|
| 1 | Q1 2026 | CLI-001 → CLI-008 | Safety & observability |
| 2 | Q2 2026 | CLI-009 → CLI-018 | Context & memory |
| 3 | Q3 2026 | CLI-019 → CLI-026 | Model routing & performance |
| 4 | Q4 2026 | CLI-027 → CLI-036 | Ecosystem & extensibility |
| 5 | Q1-Q2 2027 | CLI-037 → CLI-044 | Enterprise & compliance |
| 6 | Q3-Q4 2027 | CLI-045 → CLI-050 | Edge & IoT |
| **Total** | **22 months** | **50 PRs** | |

---

## Design Constraints

1. **Zero dependencies** — No npm packages in CLI. Pure Node.js + TypeScript.
2. **JSON-native** — Every command outputs valid JSON when piped. Human-friendly when TTY.
3. **Pipeable** — `dws` commands compose: `dws discover compliance | dws run --first --stdin`.
4. **Backward compatible** — New flags are additive. Existing commands never break.
5. **Offline-capable** — `dws help`, `dws config`, `dws scenario` work without backend.
6. **EU data residency** — All data flows through EU endpoints. No US fallback by default.

## Architecture Principles (from OpenDev Research)

| Principle | CLI Implementation |
|---|---|
| Plan before execute | `--dry-run` / `--plan` flags (Phase 1) |
| Context budget management | `--compact` inter-step summarization (Phase 2) |
| Cross-session memory | `dws history` + auto-inject prior results (Phase 2) |
| Workload model routing | `--model-tier` fast/standard/reasoning (Phase 3) |
| Approval gates | Y/n confirmation for workflows (Phase 1) |
| System reminders | Iteration-boundary injections in runLoop (Phase 2) |

## References

- arXiv:2603.05344 — Building AI Coding Agents for the Terminal
- DWS7_ROADMAP.md — Master 247-PR roadmap
- docs/field-notes/2026-03-09-opendev-cli-agent-research.md — Research note
- cli/src/cli.ts — Current CLI implementation
- AGENTS.md §16 — Rise of CLIs & External Add-ons

---
VERSION AND AGENT HISTORY
Document: OpenDev CLI Agent Architecture — Research Note
Version: 1.0
Created: 2026-03-09
Updated: 2026-03-09
Author: Claude Code (Opus 4.6)
Status: Research
Classification: Internal

AGENT HISTORY
| Date | Agent | Model | Action |
|------|-------|-------|--------|
| 2026-03-09 | Claude Code | claude-opus-4-6 | Created research note analyzing OpenDev arXiv:2603.05344 impact on DWS CLI |
---

# OpenDev CLI Agent Architecture — Impact on DWS CLI

## Source

**Paper:** "Building AI Coding Agents for the Terminal: Scaffolding, Harness, Context Engineering, and Lessons Learned"
**ArXiv:** 2603.05344 (March 2026, work-in-progress)
**Subject:** cs.AI — Open-source CLI coding agent (OpenDev/OpenCode)

## Key Architectural Concepts from OpenDev

### 1. Compound AI System with Workload-Specialized Model Routing

OpenDev assigns 5 specialized model roles (planning, coding, summarization, etc.) to distinct LLMs, each lazily initialized. Models are selected based on workload type, not one-size-fits-all.

### 2. Dual-Agent Architecture (Plan Mode vs Normal Mode)

- **Plan Mode:** Read-only tools only. Safe reasoning without side effects.
- **Normal Mode:** Full read-write tool access for execution.

Explicit separation prevents accidental state changes during reasoning.

### 3. Lazy Tool Discovery

Tools are not loaded upfront. The ToolRegistry dispatches calls to typed handlers with on-demand MCP tool discovery. A Skills system lazily injects reusable prompt templates from a three-tier hierarchy (built-in, project, user).

### 4. Adaptive Context Compaction

Progressive summarization of older observations as the token budget nears exhaustion. Four subsystems: System Reminders, Prompt Composer, Memory, and Compaction.

### 5. Automated Cross-Session Memory

Project-specific knowledge accumulated across sessions, persisted and retrieved at session start.

### 6. Event-Driven System Reminders

Context-aware behavioral guidance injected at specific events (context nearing limits, tool calls) to counteract "instruction fade-out" in long conversations.

### 7. ApprovalManager Safety Gate

Dangerous operations require explicit user confirmation. Both TUI (blocking modal) and Web UI (async polling) implement the same approval contract.

## DWS CLI Current State vs OpenDev

### Already Aligned

| OpenDev Concept | DWS CLI Implementation |
|---|---|
| CLI-first, terminal-native | `cli/src/cli.ts` — zero-dep, JSON-native, pipeable |
| Structured JSON output | `--json` flag + auto-detect piped output |
| MCP tool integration | `dws mcp tools` / `dws mcp call` — JSON-RPC 2.0 |
| Skills system | `.claude/commands/*.md` — 7+ skills |
| Agent discovery | `dws discover <capability>` — A2A pattern |
| Multi-provider LLM | LLMClient: Anthropic, Groq, OpenAI-compatible |
| Agentic loop | BaseAgent.runLoop() — observe-think-act pattern |
| Tool execution runtime | Built-in tools: delegate_to_agent, query_database, emit_event, fetch_external |
| Event bus | EventBus with pattern matching, pub/sub |

### Gaps

| OpenDev Concept | DWS CLI Gap | Impact |
|---|---|---|
| **Dual-agent (plan/execute)** | No `--plan` or `--dry-run` flag. All commands execute immediately. | Users can't preview what a workflow will do before committing. |
| **Context compaction** | Stateless request-response. No token budget management for multi-agent chains. | Workflows with 5+ agents risk context degradation. |
| **Cross-session memory** | Ephemeral `SESSION_ID = cli-<timestamp>`. Execution logs in Supabase but never retrieved. | Repeated runs re-discover same gaps. No learning across sessions. |
| **Workload model routing** | Model hardcoded per agent. No dynamic routing by task complexity. | Simple scoring and complex reasoning use the same model. |
| **System reminders** | Static system prompt per agent execution. | Instruction fade-out in longer agent chains. |
| **Approval gate** | No `--dry-run` or confirmation prompt in CLI. | Destructive workflows fire immediately. |

## Recommendations

### High Priority (Low Effort)

1. **`--dry-run` / `--plan` flag** on `dws run` and `dws workflow`
   - Add flag to CLI argument parser
   - Pass `dryRun: true` to API
   - Backend returns execution plan without running agents
   - Estimated: 50 lines CLI + 30 lines backend

2. **Approval prompt for workflows**
   - Before `dws workflow <name>`, show step list and ask Y/n
   - Skip with `--yes` flag for scripted use
   - Estimated: 20 lines CLI

### Medium Priority

3. **Session memory retrieval**
   - On `dws run`, query last N results from `agent_executions` for same project+agent
   - Inject as context into agent execution
   - Estimated: 40 lines CLI + 60 lines backend

4. **Model tier routing**
   - Extend `AgentConfig.model` to support tiers: `fast`, `standard`, `reasoning`
   - LLMClient resolves tier to provider+model based on available API keys
   - Estimated: 80 lines llm-client.ts

### Low Priority (Higher Effort)

5. **Context compaction for workflows**
   - Between workflow steps, summarize intermediate agent outputs before passing to next agent
   - Requires per-workflow prompt engineering
   - Estimated: 200+ lines

6. **System reminders in agentic loop**
   - Inject behavioral reminders at iteration boundaries in `runLoop()`
   - Counter instruction fade-out for long-running agents
   - Estimated: 40 lines base.agent.ts

## Architectural Alignment

OpenDev's three design principles map directly to DWS values:

| OpenDev Principle | DWS Equivalent |
|---|---|
| Separation of concerns | Brain-Memory-Body-Hands architecture |
| Progressive degradation | Graceful LLM fallback (deterministic scoring when LLM unavailable) |
| Transparency over magic | JSON-native output, event bus logging, Article 12 audit trail |

## Conclusion

DWS CLI already implements the core "Build for Agents" pattern that OpenDev validates. The main takeaway is the **autonomy layer** — plan-before-execute, context budget management, and cross-session memory. These become critical as DWS workflows scale beyond simple single-agent calls.

The highest-value, lowest-effort win: **`--dry-run` flag on `dws run` and `dws workflow`**.

## References

- arXiv:2603.05344 — Building AI Coding Agents for the Terminal
- DWS AGENTS.md §16 — Rise of CLIs & External Add-ons
- DWS cli/src/cli.ts — Current CLI implementation
- DWS src/agents/base.agent.ts — Agentic loop implementation

# 2026-09-17 — Agent infrastructure audit (read-only)

N/A — session performed a read-only audit of agent infrastructure maturity (Tools, Planning, Safe file access, Human approval, Memory, Skills, Shell commands, Code execution, Background agents, Observability, Governance, Evaluations) via an Explore subagent. No files were modified, no code was written or committed (`git status`/`git diff --stat` clean at session end). AGENTS.md flagged by the stop hook was not touched by this session.

## Summary of findings (% = wiring/test-coverage confidence, not aspiration)

| Category          | Score | Evidence                                                                                            |
| ----------------- | ----- | --------------------------------------------------------------------------------------------------- |
| Tools             | 70%   | `src/agents/tools.ts` (1276L), 76 agents extend `BaseAgent`                                         |
| Planning          | 55%   | No shared planner; per-agent logic only (chronos, daedalus, world-model-loop)                       |
| Safe file access  | 40%   | `src/sandbox/*` pilot-stage per docs, not confirmed in main execution path                          |
| Human approval    | 75%   | `.claude/hooks/blog-draft-gate.sh` enforced PreToolUse gate                                         |
| Memory            | 80%   | `memory.service/scheduler/types.ts` + 4 test files + API route                                      |
| Skills            | 75%   | `skills/manifest.json` (~93 entries) matches live skill list                                        |
| Shell commands    | 20%   | Guardrail hooks only (`pretooluse-guard.sh`, `sql-safety-guard.sh`), no sandboxed-shell abstraction |
| Code execution    | 45%   | `mcp-hub/sandbox.py`, `src/sandbox/*`, but DEPRECATED sibling dirs, no tests found                  |
| Background agents | 15%   | No dedicated subsystem; implicit per-agent async only                                               |
| Observability     | 65%   | `tracing.ts` + otel test, but tracer may not be full OTel                                           |
| Governance/KYA    | 70%   | `kya-engine.ts` + 4 dedicated tests, flagship doc coverage                                          |
| Evaluations       | 60%   | `eval-runner.ts` + autoresearch + cron-scheduled evals                                              |

Weakest: Shell commands (20%), Background agents (15%) — both hook-level/implicit, no dedicated subsystem.

## HIC decision needed

1. Prioritize a dedicated Shell-command and Background-agent subsystem this quarter, or accept hook-level/implicit coverage?
2. Confirm whether `src/sandbox/*` is production-used or still pilot — docs and code state disagree.

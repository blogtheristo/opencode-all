---
title: Engineering Discipline — The 12 Rules
version: 1.0
status: Active
applies_to: ["Claude Code", "OpenCode", "BaseAgent", "MCP tools", "all agents"]
source: CLAUDE.md (canonical)
---

# Engineering Discipline — The 12 Rules

**Canonical source.** This is the single home for the 12 engineering-discipline rules. Every agent — Claude Code sessions, subagents, `src/agents/` BaseAgent classes, MCP tools, AgentFoundry, and dev-fleet agents — must have access to these and operate by them.

**Surfaced at runtime by:**
- `.claude/hooks/session-start.sh`
- `AI_AGENT_GUIDELINES.md` (§0)
- `AGENTS.md` (topology reference)
- `.claude/hooks/` (where mechanizable; see `.claude/hooks/README.md`)

**Do not fork or paraphrase this list elsewhere — point back here.**

## The 12 Rules

1. **Think before coding.** State assumptions explicitly; do not guess. The model cannot read your mind — surface what you are assuming before you act.
2. **Simplicity first.** Minimum code, no speculative abstractions. Reject "for future flexibility" additions — they are next quarter's deletions. (Reinforces `/simplify`.)
3. **Surgical changes.** Touch only what the task requires. Do not improve adjacent code; unrelated refactors blow up review scope. (Mirrors Non-Negotiable Rule 9.)
4. **Goal-driven execution.** Define success criteria upfront and loop until verified. Without an explicit done-condition an agent either loops forever or stops too early. (Use `/goal`, the verification-gate.)
5. **Use the model only for judgment calls** — classification, drafting, summarization, extraction. NOT routing, retries, status-code handling, or deterministic transforms. If code can answer, code answers.
6. **Token budgets are not advisory.** Per-task 4000, per-session 30000 (`CLAUDE_AUTO_MODE_BUDGET`). Past these, agents re-suggest fixes already rejected. Stop, checkpoint, re-scope.
7. **Surface conflicts, don't average them.** Two patterns in the codebase? Pick one and say why. Blending them swallows errors twice.
8. **Read before you write.** Read exports, callers, and shared utilities first, so you reuse instead of duplicating an identical function you never opened.
9. **Tests verify intent, not just behavior.** A test that cannot fail when business logic changes is wrong. All tests can pass while a function returns a constant — assert the intent.
10. **Checkpoint every significant step.** Commit/verify before building the next step, so step 6 is never stacked on a broken step 4. (Backed by `/ship`, session-stop governance.)
11. **Match the codebase conventions.** Class components stay class components; the established test pattern stays. Do not silently fork a new idiom.
12. **Fail loud.** "Completed successfully" while silently skipping records is the worst class of bug. Surface uncertainty and partial results; never hide them. (Mirrors the hooks' block-don't-ask design.)

## What Compounds Discipline

- CLAUDE.md as institutional memory across sessions
- Eval-driven changes, not vibe-driven
- Checkpoints over speed
- Explicit conflicts over silent blending
- Discipline over the next framework
- One repo, one rules file, no exceptions

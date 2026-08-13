# Claude Code Migration Plan — Handoff

## Strategy (2026-08-13)

**Not a disabling, but a pivot:**

- Make **OpenCode** the primary agent/deployment platform
- Keep **Claude Code** as a hot standby (active, ready to resume, not archived)
- Avoid full deprecation; maintain dual-stack readiness

## Status

- Branch reset to `origin/main` (2026-08-13 01:30)
- Migration strategy doc created: `docs/CLAUDE_CODE_MIGRATION_STRATEGY.md`
- Scope clarified by HIC (2026-08-13 01:40)
- Starting Phase 1: AGENTS.md + AI_AGENT_GUIDELINES.md

## Clarified Scope (HIC)

**Primary platform:** OpenCode + DGX (default runtime)
**Secondary platform:** Claude Code (<10% usage, hot standby)
**Architecture:** Dual-stack, platform-agnostic MCP, explicit runtime selection

### Key Constraints

- Do NOT globally replace "Claude Code" — keep it fully functional and documented
- Do NOT disable existing Claude setup — only remove assumptions it is primary
- MCP interface must be identical across both platforms
- Failover is manual (via `.claude/handoffs/` + documented procedure), not automatic

## Implementation Plan (Ordered)

### Phase 1A: Runtime Architecture (This Turn)

- [x] Create `docs/CLAUDE_CODE_MIGRATION_STRATEGY.md`
- [x] Update this handoff with clarified scope
- [x] Update `AGENTS.md` §1 — define OpenCode + DGX primary runtime
- [x] Update `AI_AGENT_GUIDELINES.md` — runtime-selection rules + escalation
- [x] Commit Phase 1A (4258bdc3)

### Phase 1B: Configuration Layer (Turn 2 — Complete)

- [x] Create `.opencode/` directory structure
- [x] Create `opencode.json` — models, permissions, agents, minimal MCP
- [x] Create `.opencode/settings.json` — OpenCode-specific defaults (mirrors `.claude/settings.json`)
- [x] Create `.opencode/settings.local.json` (template for users)
- [x] Fix hook paths in `.claude/settings.json` to use `${CLAUDE_PROJECT_DIR:-.}` fallback
- [x] Add `.opencode/` entries to `.gitignore`
- [x] Commit Phase 1B (c7ce9b4c)

### Phase 2: Deployment & Failover (Turn 3)

- [ ] Create `docs/DGX_DEPLOYMENT.md` — installation, tmux operation, health checks
- [ ] Create `.vscode/settings.json` — OpenCode Connector + remote DGX workflow
- [ ] Audit `.claude/settings.json` — remove Claude-is-primary assumptions

### Phase 3: Skills & Automation Classification (Turn 4)

- [ ] Classify skills as: runtime-neutral, claude-portable, claude-specific, or dgx-scheduled
- [ ] Audit CI/CD workflows — flag jobs with explicit Claude Code dependencies
- [ ] Document each classification in `docs/CLAUDE_CODE_STANDBY_PROTOCOL.md`

## Co-Authored

Session co-authored by GitHub Copilot

# Claude Code Migration Strategy — OpenCode Primary

**Date:** 2026-08-13  
**Status:** In Progress  
**Owner:** Lifetime Oy  
**Audience:** Engineering & Operations

---

## Executive Summary

Transition DWS IQ from Claude Code as primary to **OpenCode + VS Code as primary**, while maintaining Claude Code as a fully operational **hot standby**. This is a pivot toward choice and flexibility, not a deprecation.

### Why

1. **Vendor optionality** — avoid lock-in to any single tool provider
2. **Team workflow defaults** — route daily development to OpenCode/VS Code (industry standard, broad adoption)
3. **Sovereign continuity** — Claude Code available for rapid resumption if OpenCode experiences disruption
4. **Shared MCP layer** — switching between platforms does not break tool integration or workflows

---

## Strategy (4 Pillars)

### 1. Routing & Defaults

**Current state:** Claude Code is the default session path for all new work  
**Target state:** OpenCode + VS Code is the default; Claude Code is the fallback

**Implementation:**

- Update `.claude/settings.json` and `.claude/settings.local.json` to document OpenCode as primary
- Create an OpenCode profile (if applicable) as the default user-facing configuration
- Add comments in key deployment/CI files marking the switch
- Do NOT disable Claude Code; keep all MCP servers, hooks, and capabilities active

**Files to update:**

- `.claude/settings.json` (add OpenCode notes)
- `.claude/settings.local.json` (add OpenCode notes)
- `AGENTS.md` (document the dual-platform architecture)
- `AI_AGENT_GUIDELINES.md` (update to show OpenCode primary, Claude Code standby)
- `.github/workflows/*.yml` (if any jobs hardcoded to Claude, add OpenCode variants)
- `Admin/ADMIN_MANUAL.md` (update onboarding sequence)

### 2. MCP Interface Compatibility

**Current state:** MCP servers configured for Claude Code sessions  
**Target state:** Same MCP server configurations work identically for OpenCode and Claude Code

**Implementation:**

- Audit existing MCP configurations (`enabledMcpjsonServers`, custom MCP servers)
- Verify OpenCode can reach the same MCP endpoints as Claude Code
- Keep MCP server definitions in `.claude/settings.json` — no tool switching when platform changes
- Document fallback behavior: if OpenCode→MCP communication fails, resume in Claude Code (documented but NOT automatic)

**Files to update:**

- `.claude/settings.json` (MCP server block already present — add compatibility notes)
- `mcp-hub/` documentation (if any Claude Code–specific assumptions)
- `src/mcp/` (audit for Claude Code hardcoding)

### 3. Skills, Slash Commands & Routines

**Current state:** Skills and routines default to Claude Code execution context  
**Target state:** Skills and routines are platform-agnostic; OpenCode is default invocation path

**Implementation:**

- Audit all skill definitions in `skills/` for Claude Code hardcoding (there should be none)
- Review cron/scheduled routines (`scripts/daily`, `scripts/weekly`) — ensure they target OpenCode by default
- Update `/kya`, `/blog-draft`, `/ship`, `/loop` and other slash commands to document OpenCode as primary path
- Routines that absolutely require Claude Code features get documented as exceptions with fallback paths

**Files to update:**

- `skills/manifest.json` (add "primary_platform": "opencode" field if structure allows)
- `docs/DWS_SKILLS_GUIDE.md` (update invocation section)
- All `skills/*/SKILL.md` (add platform notes if they differ)
- `.claude/commands/*.md` (update context to OpenCode primary)

### 4. Documentation & Onboarding

**Current state:** New-user docs assume Claude Code  
**Target state:** Docs route users to OpenCode; Claude Code documented as alternative/failover

**Implementation:**

- Update `README.md` → quickstart points to OpenCode setup
- Update `CLAUDE.md` → note about dual-platform strategy (OpenCode primary, Claude Code standby)
- Create a `docs/CLAUDE_CODE_STANDBY_PROTOCOL.md` documenting when/how to switch back to Claude Code
- Update all onboarding materials (Admin Manual, coaching course materials)

**Files to update:**

- `README.md` (first section)
- `CLAUDE.md` (add "Platform Strategy" section)
- `Admin/ADMIN_MANUAL.md` (section 2: Onboarding)
- `docs/CLAUDE_CODE_STANDBY_PROTOCOL.md` (NEW)
- Any published coaching/training materials that reference Claude Code

---

## Implementation Checklist

### Phase 1: Documentation & Configuration (This Week)

- [ ] Create this strategy document ← **DONE**
- [ ] Write `CLAUDE_CODE_STANDBY_PROTOCOL.md`
- [ ] Update `CLAUDE.md` → add "Platform Strategy" section
- [ ] Update `AGENTS.md` → note OpenCode primary in §1 overview
- [ ] Update `AI_AGENT_GUIDELINES.md` → document both platforms
- [ ] Audit `.claude/settings.json` for hardcoded Claude Code references (expect none)
- [ ] Commit & push Phase 1 changes

### Phase 2: Skills & Routines (Next 2 Weeks)

- [ ] Audit `skills/manifest.json` for platform assumptions
- [ ] Review all `.claude/commands/*.md` files for Claude Code hardcoding
- [ ] Review `scripts/daily`, `scripts/weekly`, `scripts/on-deploy` for hardcoded platforms
- [ ] Add platform notes to top-level skill descriptions (if there are platform-specific behaviors)
- [ ] Test 3–5 critical skills in OpenCode environment (if available)
- [ ] Commit & push Phase 2 changes

### Phase 3: Deployment & Failover (Weeks 3–4)

- [ ] Update CI/CD pipelines (`.github/workflows/`) to route new jobs to OpenCode
- [ ] Document deployment switch-back procedure for the ops team
- [ ] Add failover runbook to `Admin/ADMIN_MANUAL.md` (§ Operations)
- [ ] Train team on the new default (OpenCode) and fallback (Claude Code)
- [ ] Soft-launch: run parallel OpenCode + Claude Code sessions on 1–2 real tasks to verify MCP compat
- [ ] Commit & push Phase 3 changes

### Phase 4: Validation & Finalization

- [ ] Verify MCP tools work identically across both platforms
- [ ] Run full test suite in OpenCode environment
- [ ] Document any platform-specific edge cases discovered
- [ ] Final commit: "feat: opencode-primary platform strategy, claude-code hot standby"
- [ ] Tag version (e.g., `v6.1-opencode-primary`)

---

## What Does NOT Change

✅ **Keep these identical:**

- MCP server configurations
- Skill code and logic
- Engineering Discipline Rules (CLAUDE.md § 12 Rules)
- All hook definitions (`.claude/hooks/`)
- Database schema & migrations
- API contracts & tool definitions
- Product offerings (coaching materials reference "Claude Code" as the tool; update to "Claude Code or OpenCode")

❌ **Do NOT disable these:**

- Claude Code hooks
- Claude Code MCP servers
- Claude Code credentials or authentication
- Existing Claude Code documentation (keep it, add "alternative path" labels)

---

## Failover Trigger & Procedure

### When to switch to Claude Code (standby)

1. OpenCode session crashes or becomes unresponsive → resume in Claude Code
2. OpenCode MCP connectivity fails → Claude Code fallback (same MCP config)
3. OpenCode tool update breaking work → Claude Code provides continuity
4. User explicitly requests Claude Code for a specific task

### Procedure

1. **Check status:** `opencode --status` or equivalent diagnostic
2. **If recovering mid-task:** Save current branch state, copy context to Claude Code session
3. **Resume in Claude Code:** Use `.claude/handoffs/` file to continue work (already git-persisted)
4. **Report:** Log the switch-back in `.claude/handoffs/<branch>.md` with timestamp and reason
5. **Investigate:** Root-cause the OpenCode issue; fix before re-defaulting to OpenCode

---

## MCP Interface Compatibility Audit

| Component                     | Claude Code  | OpenCode | Status |
| ----------------------------- | ------------ | -------- | ------ |
| `dws-gateway-local`           | ✅ Supported | ✅ TBD   | Verify |
| `dws-agents-local`            | ✅ Supported | ✅ TBD   | Verify |
| GitHub MCP (`mcp__github__*`) | ✅ Supported | ✅ TBD   | Verify |
| Google Drive MCP              | ✅ Supported | ✅ TBD   | Verify |
| Custom tools (MCP Server)     | ✅ Supported | ✅ TBD   | Verify |

**Next step:** Run MCP compatibility matrix tests in OpenCode environment.

---

## Risks & Mitigations

| Risk                                    | Severity | Mitigation                                               |
| --------------------------------------- | -------- | -------------------------------------------------------- |
| Undetected platform-specific hardcoding | Medium   | Phase 2 audit + dual-run validation                      |
| MCP server incompatibility              | High     | Phase 3 parallel testing before go-live                  |
| Team confusion about dual-platform      | Low      | Clear documentation + training in Phase 3                |
| OpenCode onboarding latency             | Low      | Maintain Claude Code as instant fallback                 |
| Unforeseen edge cases                   | Medium   | Run Phase 3 soft launch on real work before full cutover |

---

## Timeline

| Phase                    | Start      | End        | Deliverables                                    |
| ------------------------ | ---------- | ---------- | ----------------------------------------------- |
| 1: Docs & Config         | 2026-08-13 | 2026-08-15 | Strategy docs, config updates, commit           |
| 2: Skills & Routines     | 2026-08-16 | 2026-08-30 | Skill audit, command updates, commit            |
| 3: Deployment & Failover | 2026-08-31 | 2026-09-14 | CI/CD updates, runbook, training, parallel test |
| 4: Validation & Go-Live  | 2026-09-15 | 2026-09-21 | Full test, edge-case fixes, final commit + tag  |

---

## Success Criteria

✅ **We're done when:**

1. Documentation reflects OpenCode as primary, Claude Code as standby
2. All skills/routines are platform-agnostic and tested in both platforms
3. MCP servers reach identically through both platforms
4. Failover procedure is documented and verified (at least once)
5. Team can resume interrupted work by simply switching platforms (via `.claude/handoffs/`)
6. No loss of capability or reliability from the switch
7. Code is cleaner (no dead Claude Code paths remain if OpenCode is now primary)

---

## Questions for HIC

1. **Timeline:** Is Phase 4 (validation & go-live) realistic by 2026-09-21, or should we extend?
2. **Parallel testing:** Should we run Phase 3 soft-launch on a real customer project, or internal-only first?
3. **Product messaging:** Should we update the "Claude Code Coaching" product SKUs to say "Claude Code or OpenCode"?
4. **Team training:** Who needs onboarding, and should it be formal (workshop) or self-paced docs?

---

_Handoff: This document is a living working plan. Update as we discover edge cases or change strategy._

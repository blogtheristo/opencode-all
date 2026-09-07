---
title: System Files Index — Multi-Tool Configuration Ecosystem
version: 1.0
status: Active
applies_to: ["OpenCode", "Claude Code", "developers", "maintainers"]
last_updated: 2026-09-07
---

# System Files Index — Multi-Tool Configuration Ecosystem

This file documents the complete system-configuration ecosystem used by OpenCode and Claude Code. All files follow `DWS_DOCUMENT_STANDARD` versioning.

## Overview

DWS6 is controlled by a **multi-tool system** where OpenCode is primary and Claude Code is hot-standby. Both tools read the same canonical configuration and instructions:

```
┌─────────────────────────────────────┐
│   CLAUDE.md (Canonical Rules)       │
│   Version field required            │
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      │                 │
  ┌───▼─────┐      ┌────▼──────┐
  │ OpenCode│      │Claude Code │
  │ (Primary)      │ (Standby)  │
  └─────────┘      └────────────┘
      │                 │
      │   Shared MCP    │
      │   Shared Hooks  │
      │   Shared Deps   │
      └─────────────────┘
           │
       ┌───▼───┐
       │ Repo  │
       │State  │
       └───────┘
```

## Core Configuration Files

### 1. CLAUDE.md (Canonical Rules)

**Path:** `/home/admin100/dws6/CLAUDE.md`

**Purpose:** Canonical operational rules for all agents and runtimes.

**Consumed by:**

- `opencode.json` line 3: `"instructions": ["CLAUDE.md"]`
- `.claude/hooks/session-start.sh` (Claude Code runtime)
- `src/agents/BaseAgent.ts` (reference via docs)
- All agents via session context

**Fields (DWS_DOCUMENT_STANDARD):**

- `version` — Current version (1.1)
- `status` — Active / Deprecated
- `applies_to` — Array of runtimes
- `changes_in_this_version` — Changelog summary
- `source_control_url` — Git URL

**Update protocol:**

1. Edit CLAUDE.md directly (canonical source)
2. Update `version` field (SemVer)
3. Add entry to **Version History** table at end
4. Run `git add CLAUDE.md && git commit`
5. No separate deploy needed — both tools auto-load on session start

---

### 2. opencode.json (OpenCode Runtime Config)

**Path:** `/home/admin100/dws6/opencode.json`

**Purpose:** OpenCode runtime configuration, model selection, MCP setup, permissions.

**Key fields:**

- `instructions` — Array of instruction files to load (e.g., `["CLAUDE.md"]`)
- `model` — Primary LLM (currently `ollama-local/qwen3-coder:30b`)
- `small_model` — Fallback model
- `mcp` — MCP server configurations (dws-agents-local, dws-gateway-local)
- `permission` — Bash, read, edit, webfetch rules

**Sync points with .claude/settings.json:**

- MCP server names must match (dws-agents-local, dws-gateway-local)
- Shared permission deny-lists for secret files
- Both must reference same `dws-gateway-local` MCP server

**Update protocol:**

1. Make changes to `opencode.json`
2. Sync matching entries to `.claude/settings.json` MCP + permission sections
3. Test both runtimes locally before commit
4. Commit with message noting which tool required the change

---

### 3. .claude/settings.json (Claude Code Settings)

**Path:** `/home/admin100/dws6/.claude/settings.json`

**Purpose:** Claude Code runtime configuration, hooks, permissions, MCP enablement.

**Key fields:**

- `enabledMcpjsonServers` — Array of enabled MCP servers (reads from `.mcp.json`)
- `permissions.allow` / `.deny` — Tool usage rules (mirrors `opencode.json`)
- `hooks` — Session lifecycle hooks (SessionStart, PreToolUse, PostToolUse, Stop)
- `env` — Environment variables (DISABLE_BUG_COMMAND, DISABLE_AUTO_UPDATE)

**Hook lifecycle:**

1. **SessionStart** → `bash .claude/hooks/session-start.sh` (loads CLAUDE.md, displays trust boundary)
2. **PreToolUse** (Bash) → secret scan, safety guards
3. **PreToolUse** (Edit/Write) → file protection, blog-draft gate
4. **PostToolUse** → prettier format, ESLint, secret output scan
5. **Stop** → `bash .claude/hooks/session-stop.sh` (HIC learning outcome validation, token usage)

**Sync points with opencode.json:**

- MCP server names, enabled servers
- Permission deny-lists (especially `.env*`, `*secret*`, `*credentials*`)
- Shared reference to `.mcp.json`

**Update protocol:**

1. Make changes to `.claude/settings.json`
2. Sync matching entries to `opencode.json` permission and MCP sections
3. Test locally: `claude --help` should work without errors
4. Commit with message noting which tool required the change

---

### 4. .claude/settings.local.json (Local User Overrides)

**Path:** `/home/admin100/dws6/.claude/settings.local.json`

**Purpose:** Local development overrides (machine-specific, never committed upstream).

**Common overrides:**

- Model selection for testing
- Debugging flags
- Local-only MCP server URLs
- Developer-specific permissions (more permissive for testing)

**Versioning:** Not versioned; local-only. Can use `DWS_DOCUMENT_STANDARD` header for documentation.

**Update protocol:**

1. This file is user-local and `.gitignore`d
2. Changes are never committed
3. If a setting should apply to all developers, move it to `.claude/settings.json`

---

### 5. .mcp.json (MCP Server Configuration)

**Path:** `/home/admin100/dws6/.mcp.json`

**Purpose:** MCP (Model Context Protocol) server definitions used by Claude Code and OpenCode.

**Current servers:**

- `dws-agents-local` — Remote MCP server for agent orchestration (http://localhost:3001/mcp)
- `dws-gateway-local` — Local Python MCP server for Supabase, GitHub, Cloud Run integration

**Sync points:**

- MCP server names must match in `.claude/settings.json` and `opencode.json`
- Enabled servers listed in `.claude/settings.json` `enabledMcpjsonServers`
- Environment variables (SUPABASE_URL, SUPABASE_SERVICE_KEY, GITHUB_TOKEN) must be set for both tools

**Update protocol:**

1. Edit `.mcp.json` with new server definition
2. Update `.claude/settings.json` `enabledMcpjsonServers` array
3. Add corresponding MCP server definition to `opencode.json` if OpenCode should use it
4. Test tool connectivity: `claude` / OpenCode CLI
5. Commit with message describing MCP change

---

### 6. docs/system-config/DISCIPLINE.md (Extracted: Engineering Discipline Rules)

**Path:** `/home/admin100/dws6/docs/system-config/DISCIPLINE.md`

**Purpose:** The 12 engineering discipline rules (extracted from CLAUDE.md for easier reference and updates).

**Canonical source for:** Rules 1–12
**Referenced by:** CLAUDE.md, `AI_AGENT_GUIDELINES.md`, `.claude/hooks/session-start.sh`

**Versioning:** `DWS_DOCUMENT_STANDARD`

**Update protocol:**

1. Edit `.claude/DISCIPLINE.md` with rule changes
2. Update `version` field
3. Update reference in CLAUDE.md to note changes
4. Commit

---

### 7. docs/system-config/STANDARDS_ROUTING.md (Extracted: Standards Resolver)

**Path:** `/home/admin100/dws6/docs/system-config/STANDARDS_ROUTING.md`

**Purpose:** Task-to-standards routing table (extracted from CLAUDE.md for easier reference and multi-standard examples).

**Canonical source for:** Standards resolver routing triggers
**Referenced by:** CLAUDE.md, agents when applying standards

**Versioning:** `DWS_DOCUMENT_STANDARD`

**Update protocol:**

1. Edit `.claude/STANDARDS_ROUTING.md` when adding new standards or routing triggers
2. Update `version` field
3. Test: verify task → standards mapping is unambiguous
4. Update reference in CLAUDE.md to note changes
5. Commit

---

## Hook System

**Location:** `/home/admin100/dws6/.claude/hooks/`

**Purpose:** Git-based enforcement of CLAUDE.md rules at tool call time.

**Key hooks:**

- `session-start.sh` — Load CLAUDE.md, display trust boundary
- `pretooluse-guard.sh` — Command safety checks
- `secret-scan.sh` — Pre-exec secret detection
- `secret-output-scan.sh` — Post-exec secret leakage detection
- `blog-draft-gate.sh` — Enforce blog draft publication rules (Non-Negotiable Rule 13)
- `protect-files.sh` — Prevent editing system files (CLAUDE.md, settings, etc.)
- `session-stop.sh` — Validate HIC learning outcome (EU AI Act Art. 14)

**Update protocol:**

- Hook changes require testing in both Claude Code and OpenCode
- Critical hooks (secret, blog, learning outcome) are enforced and cannot be bypassed
- Hook documentation: `.claude/hooks/README.md`

---

## Versioning Strategy

**All system files use DWS_DOCUMENT_STANDARD frontmatter:**

```yaml
---
title: File Title
version: 1.0
status: Active | Deprecated | Archived
applies_to: ["tool1", "tool2", ...]
last_updated: YYYY-MM-DD
changes_in_this_version: "Summary of changes"
source_control_url: "GitHub URL"
---
```

**Version numbering (SemVer):**

- `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes (e.g., new required field, removed rule)
- MINOR: Additive changes (e.g., new rule, new routing trigger)
- PATCH: Clarifications, typos, non-breaking refinements

**When to version bump:**

- **MAJOR:** Changing a rule that affects agent behavior, adding a YELLOW zone permission
- **MINOR:** Extracting a rule to a separate file, adding a new standard trigger
- **PATCH:** Clarifying wording, fixing examples, adding field notes

---

## Cross-File Dependencies

```
CLAUDE.md (v1.1)
├── references → .claude/DISCIPLINE.md (v1.0)
├── references → .claude/STANDARDS_ROUTING.md (v1.0)
├── loaded by → opencode.json (instructions field)
├── loaded by → .claude/hooks/session-start.sh
└── affects → .claude/settings.json (permissions should align)

opencode.json
├── references → CLAUDE.md (instructions field)
├── syncs with → .claude/settings.json (MCP, permissions)
├── references → .mcp.json (MCP server list)
└── shares MCP with → .claude/settings.json (enabledMcpjsonServers)

.claude/settings.json
├── syncs with → opencode.json (MCP, permissions)
├── runs → .claude/hooks/session-start.sh
├── references → .mcp.json (enabledMcpjsonServers)
└── enforces → CLAUDE.md rules (via hooks)

.mcp.json
├── referenced by → .claude/settings.json
├── referenced by → opencode.json
└── defines → dws-agents-local, dws-gateway-local

.claude/DISCIPLINE.md
├── referenced by → CLAUDE.md
└── loaded by → agents via session context

.claude/STANDARDS_ROUTING.md
├── referenced by → CLAUDE.md
└── applied by → agents when matching task triggers
```

---

## Update Checklist

**When updating system configuration:**

- [ ] Identify which tool(s) are affected (OpenCode, Claude Code, or both)
- [ ] Update the primary file (CLAUDE.md, opencode.json, .claude/settings.json)
- [ ] **Sync MCP servers:** Ensure dws-agents-local, dws-gateway-local match in all JSON configs
- [ ] **Sync permissions:** Ensure deny-lists align in opencode.json and .claude/settings.json
- [ ] **Version bump:** Update version field in affected file(s)
- [ ] **Add changelog:** Update Version History table or commit message
- [ ] **Test both tools:** Verify both OpenCode and Claude Code work with changes
- [ ] **Commit:** Message should note which tools required the change
- [ ] **Document:** If adding a new rule or standard, update CLAUDE.md reference section

---

## Operational Asymmetries (Intentional Design)

### .env File Permissions (By Environment)

OpenCode and Claude Code have **different permission models for .env files**. This is intentional, not a gap:

| File               | OpenCode (DGX Primary) | Claude Code (Standby) | Reason                                                                              |
| ------------------ | ---------------------- | --------------------- | ----------------------------------------------------------------------------------- |
| `.env` (root)      | ✅ ALLOW               | ❌ DENY               | OpenCode needs root config to initialize MCP servers on DGX; Claude Code is standby |
| `.env.example`     | ✅ ALLOW               | ❌ DENY               | Reference only; safe to read; OpenCode uses for defaults                            |
| `.env.local`       | ❌ DENY                | ❌ DENY               | Local/environment-specific secrets; both deny                                       |
| `.env.mcp`         | ❌ DENY                | ❌ DENY               | MCP configuration secrets; both deny                                                |
| `**/.env` (nested) | ❌ DENY                | ❌ DENY               | Deep repo secrets; both deny                                                        |

**Rationale:** OpenCode runs on DGX and needs environment config; Claude Code runs in standby with minimal local config needs. Asymmetry is safe and by design.

**Governance:** See `opencode.json` commit `ff408fa13` (2026-09-07) for security audit trail.

---

## Known Sync Gaps (Requires Remediation)

**⚠️ CRITICAL:** Initial verification found OpenCode ↔ Claude Code permission rules have gaps. Issues:

### Gap 1: MCP Server Mismatch

- **opencode.json:** Defines `dws-agents-local` AND `dws-gateway-local`
- **.claude/settings.json:** Enables only `dws-gateway-local`
- **Impact:** dws-agents-local unavailable in Claude Code standby
- **Status:** Is this intentional or a drift?

### Gap 2: Permission Syntax Mismatch

- **opencode.json:** Dict format `"pattern": "allow|deny"` with catch-all `"*": "allow"`
- **.claude/settings.json:** Array format `"allow": [...], "deny": [...]` with tool prefixes `"Read(.env)"`
- **Impact:** Different permission models; harder to sync
- **Status:** Requires design decision: standardize syntax or document differences

### Gap 3: Missing Bash Protection

- **opencode.json:** Has `"*.env*": "deny"` to block any .env file access
- **.claude/settings.json:** Missing this pattern (only has specific `"Bash(cat .env)"`, `"Bash(cat .env.*)"`)
- **Impact:** Claude Code missing wildcard .env protection
- **Status:** High priority — should match OpenCode

**Next steps:**

1. Clarify whether gaps are intentional (documented in code comments) or drift
2. Add `.claude/settings.json` missing bash deny rules
3. Update CLAUDE.md or SYSTEM_FILES_INDEX.md to document known intentional differences
4. Consider standardizing permission syntax

---

## Maintenance

**Regular audits:**

- Monthly: Check that all system file versions are documented
- Quarterly: Verify MCP server URLs are still correct (especially `dws-agents-local` tunnel)
- On major version bumps: Ensure all references in docs are updated

**Deprecation path:**

1. Mark file `status: Deprecated` in frontmatter
2. Update CLAUDE.md to reference replacement file
3. Keep old file in repo for 2 seasons (6 months)
4. Archive to `docs/field-notes/` on final removal
5. Commit with message referencing the deprecation announcement

---

## Quick Reference

**To update a rule affecting all agents:**

1. Edit CLAUDE.md
2. Update version, changes_in_this_version, Version History
3. Commit with message "refactor(CLAUDE.md): <description>"

**To update runtime config affecting both tools:**

1. Edit opencode.json
2. Sync matching changes to .claude/settings.json
3. Update versions in both files
4. Commit with message "refactor: align OpenCode and Claude Code config — <description>"

**To add a new MCP server:**

1. Define in .mcp.json
2. Add to opencode.json `mcp` section
3. Add to .claude/settings.json `enabledMcpjsonServers` array
4. Update .claude/SYSTEM_FILES_INDEX.md (this file) to document the new server
5. Commit with message "feat: add <server-name> MCP server"

**To extract a long CLAUDE.md section:**

1. Copy section to new `.claude/<name>.md`
2. Add DWS_DOCUMENT_STANDARD frontmatter
3. Update CLAUDE.md with reference and link to extracted file
4. Bump CLAUDE.md version (MINOR)
5. Commit with message "refactor(CLAUDE.md): extract <section-name> to .claude/<name>.md"

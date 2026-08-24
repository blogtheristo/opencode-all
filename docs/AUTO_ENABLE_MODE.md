# Auto-Enable Mode: Permission Rules Matrix for Claude Code

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/auto-mode-permissions-matrix-e1tyZ | Date: 07.03.2026 | Changes: Initial creation - permission rules matrix, managed settings template, mode decision tree, environment guidance

Session Links & References:
  - Claude Code (claude/auto-mode-permissions-matrix-e1tyZ): https://claude.ai/code/session_01P4M8ExCYtjP7GPP4TeFs2n

Document Status:
  - Created: 07.03.2026
  - Last Modified: 07.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.0
**Effective Date:** 2026-03-07
**Last Updated:** 2026-03-07
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [Permission Modes](#2-permission-modes)
3. [DWS6 Permission Rules Matrix](#3-dws6-permission-rules-matrix)
4. [Managed Settings for Enterprise](#4-managed-settings-for-enterprise)
5. [Usage Examples](#5-usage-examples)
6. [Environment-Specific Guidance](#6-environment-specific-guidance)
7. [Decision Tree](#7-decision-tree)
8. [Security Considerations](#8-security-considerations)
9. [Validation](#9-validation)

---

## 1. Overview

Claude Code's auto-enable mode allows safe autonomous operation by pre-authorizing known-safe tool patterns and explicitly denying dangerous ones. This document defines the permission rules matrix for the DWS6 repository.

**Key principle:** Allow the tools Claude Code actually needs for DWS6 development. Deny patterns that could compromise security, leak secrets, or cause destructive changes.

**Configuration files:**

| File | Scope | Purpose |
|------|-------|---------|
| `.claude/settings.json` | Project (repo-level) | Allow/deny rules for this repository |
| `.claude/settings.local.json` | Local (per-machine) | Machine-specific overrides, not committed |
| `Admin/managed-settings.json` | Enterprise template | IT-managed deny rules for deployment |

---

## 2. Permission Modes

Claude Code supports five permission modes:

| Mode | Flag | Behavior | Use Case |
|------|------|----------|----------|
| **default** | (none) | Asks permission for each tool call | First-time setup, unfamiliar repos |
| **acceptEdits** | `--acceptEdits` | Auto-approves file edits, asks for Bash | Routine coding with review |
| **dontAsk** | `--dontAsk` | Uses allow/deny rules, asks only for uncovered patterns | **Recommended for DWS6** |
| **plan** | `--plan` | Plans actions without executing | Architecture review, dry runs |
| **bypassPermissions** | `--dangerouslySkipPermissions` | Skips all permission checks | CI/CD only, never interactive |

**DWS6 recommendation:** Use `--dontAsk` with the permission rules in `.claude/settings.json`. This gives Claude Code autonomy for safe operations while blocking dangerous patterns.

---

## 3. DWS6 Permission Rules Matrix

### 3.1 Allowed Patterns (`.claude/settings.json`)

| Category | Patterns | Rationale |
|----------|----------|-----------|
| **File operations** | `Read`, `Edit`, `Write`, `Glob`, `Grep` | Core IDE-like operations |
| **Node.js** | `Bash(npm run *)`, `Bash(npx *)`, `Bash(node *)` | Build, test, scripts |
| **Git (read)** | `Bash(git status*)`, `Bash(git diff*)`, `Bash(git log*)` | Repository inspection |
| **Git (write)** | `Bash(git add *)`, `Bash(git commit *)`, `Bash(git push *)` | Standard git workflow |
| **Git (branch)** | `Bash(git fetch *)`, `Bash(git pull *)`, `Bash(git branch*)`, `Bash(git checkout *)`, `Bash(git merge *)`, `Bash(git rebase *)` | Branch management |
| **Testing** | `Bash(vitest *)` | Test runner |
| **GitHub CLI** | `Bash(gh pr *)`, `Bash(gh issue *)`, `Bash(gh api *)` | PR and issue management |
| **Docker** | `Bash(docker *)`, `Bash(docker-compose *)` | Container operations |
| **Shell utilities** | `Bash(ls *)`, `Bash(pwd)`, `Bash(echo *)`, `Bash(cat *)`, `Bash(mkdir *)`, `Bash(cp *)`, `Bash(mv *)`, `Bash(chmod +x *)`, `Bash(wc *)`, `Bash(diff *)`, `Bash(head *)`, `Bash(tail *)` | File system operations |
| **Windows/Python** | `Bash(powershell -Command:*)`, `Bash(python:*)`, `Bash(pip install:*)` | Cross-platform support |
| **MCP** | `mcp__*` | All MCP server tools |

### 3.2 Denied Patterns

| Pattern | Risk |
|---------|------|
| `Bash(rm -rf /)` | System destruction |
| `Bash(rm -rf ~)` | Home directory destruction |
| `Bash(sudo *)` | Privilege escalation |
| `Bash(curl * \| sh)` | Remote code execution |
| `Bash(curl * \| bash)` | Remote code execution |
| `Bash(wget * \| sh)` | Remote code execution |

### 3.3 Enterprise Deny Rules (managed-settings.json)

These additional denials are enforced at the enterprise level via `Admin/managed-settings.json`:

| Pattern | Risk |
|---------|------|
| `Bash(rm -rf *)` | Any recursive force-delete |
| `Read(./.env)` | Secret file access |
| `Read(./.env.*)` | Secret file access |
| `Read(./secrets/**)` | Secret directory access |
| `Read(./**/*.key)` | Private key access |
| `Read(./**/*.pem)` | Certificate/key access |
| `Read(./**/*.secret)` | Secret file access |
| `Read(./credentials.json)` | Credential file access |
| `Read(./service-account-*.json)` | GCP service account access |

---

## 4. Managed Settings for Enterprise

The `Admin/managed-settings.json` file is an enterprise template. To deploy:

**Windows (per-machine):**
```
C:\Program Files\ClaudeCode\managed-settings.json
```

**macOS/Linux (per-user):**
```
~/.config/claude-code/managed-settings.json
```

**Key fields:**

| Field | Value | Effect |
|-------|-------|--------|
| `disableBypassPermissionsMode` | `"disable"` | Prevents `--dangerouslySkipPermissions` |
| `allowManagedPermissionRulesOnly` | `false` | Allows project-level rules alongside managed rules |
| `permissions.deny` | Array | Enterprise-wide deny rules (merged with project rules) |

---

## 5. Usage Examples

### Start Claude Code with DWS6 permissions (recommended)

```bash
claude --dontAsk
```

This loads `.claude/settings.json` automatically. No additional flags needed.

### Allow specific tools via CLI

```bash
# Allow only git and npm operations
claude --allowedTools "Bash(git *)" "Bash(npm run *)" "Read" "Edit" "Write"

# Allow everything except destructive patterns
claude --dontAsk --denyTools "Bash(rm -rf *)" "Bash(sudo *)"
```

### CI/CD pipeline (GitHub Actions)

```yaml
- name: Run Claude Code
  run: claude --dontAsk --print "Run tests and fix failures"
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

---

## 6. Environment-Specific Guidance

### Windows 11

- Full tooling: `gh`, PowerShell, VS Code/Cursor
- Managed settings: `C:\Program Files\ClaudeCode\managed-settings.json`
- PowerShell patterns are allowed via `Bash(powershell -Command:*)`

### Mobile / Web

- No `gh` CLI available -- do not use `gh pr create`
- Use compare-link PR workflow
- `--dontAsk` still applies to file operations

### Chromebook (Linux)

- Bash available, `gh` may be available
- No PowerShell -- Windows-specific patterns are no-ops
- Use `./scripts/new-claude-worktree.sh` for worktrees

### CI/CD (GitHub Actions)

- Use `--dontAsk` or `--dangerouslySkipPermissions` (if managed settings allow)
- Deploy managed-settings.json to the runner image
- Set `disableBypassPermissionsMode: "disable"` for production runners

---

## 7. Decision Tree

```
Start
  |
  v
Is this interactive development?
  |
  +-- YES --> Is the repo trusted (DWS6)?
  |             |
  |             +-- YES --> Use --dontAsk
  |             |           (loads .claude/settings.json)
  |             |
  |             +-- NO  --> Use default mode
  |                         (asks for each tool)
  |
  +-- NO  --> Is this CI/CD?
                |
                +-- YES --> Are managed settings deployed?
                |             |
                |             +-- YES --> Use --dontAsk
                |             |
                |             +-- NO  --> Use --allowedTools
                |                         (explicit list)
                |
                +-- NO  --> Is this plan/review only?
                              |
                              +-- YES --> Use --plan
                              |
                              +-- NO  --> Use default mode
```

---

## 8. Security Considerations

This configuration aligns with `DWS_SECURITY_STANDARD.md` and the 2026-02-21 vulnerability assessment.

**Principles applied:**

1. **Least privilege** -- Only tools needed for DWS6 development are allowed
2. **Secret protection** -- `.env`, `.key`, `.pem`, `.secret` files denied at enterprise level
3. **No RCE vectors** -- `curl|sh`, `wget|sh`, `sudo` patterns denied
4. **No destructive ops** -- `rm -rf /` and `rm -rf ~` denied; general `rm -rf *` denied at enterprise level
5. **MCP trust boundary** -- MCP tools allowed but treated as untrusted input per CLAUDE.md security rules

**What is NOT covered by permissions:**

- Application-level secrets (handled by `.env` + `.gitignore`)
- Network access controls (handled by firewall/VPN)
- Git hook validation (handled by `.githooks/`)
- Branch protection (handled by GitHub branch rules)

**Validation:** Run `scripts/validate-auto-mode-config.sh` to verify configuration integrity.

---

## 9. Validation

A validation script is provided at `scripts/validate-auto-mode-config.sh`. It checks:

1. `.claude/settings.json` exists and is valid JSON
2. `permissions.allow` and `permissions.deny` are arrays
3. No `.env` or secret patterns appear in `allow` list
4. Hooks are registered in `.claude/hooks/`
5. Reports pass/fail summary

```bash
./scripts/validate-auto-mode-config.sh
```

See the script source for details.

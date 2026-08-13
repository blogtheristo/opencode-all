# `.claude/env/` — per-environment Claude Code profiles

## Why this exists

`.claude/settings.local.json` is git-ignored: Claude Code writes to it during a
session, and it is genuinely machine-local. **That gitignore is itself the risk.**
On a fresh clone — a reset Chromebook, a rebuilt DGX Spark, or an ephemeral cloud
container started from an iPhone — the file does not exist and the configuration
is simply gone, with nothing in git to restore it from.

This directory is the recovery route.

## Two layers of recovery

| Layer | Where | Survives | Restore with |
|---|---|---|---|
| **Durable** | `.claude/env/<profile>.json` — committed to git | a fresh clone, a wiped machine | `apply` |
| **Local** | `.claude/env/.backups/` — git-ignored, timestamped | an accidental overwrite in-session | `restore` |

Every `apply` backs up the current file before overwriting it, so neither layer
can silently destroy the other.

## The four environments

| Profile | Machine | Notes |
|---|---|---|
| `win11` | Windows 11 workstation | Primary dev. Both local MCP servers reachable. |
| `chromebook` | Chromebook Plus (Crostini) | Thin client. No local MCP, no service key on disk. |
| `dgx-spark` | DGX Spark | 24/7 agent runtime, EU-sovereign. Extra deny rules. |
| `mobile` | iPhone → cloud agent | Ephemeral container. Push protection over convenience. |

## Usage

```powershell
# Windows
.\scripts\Sync-ClaudeEnv.ps1                      # detect + apply
.\scripts\Sync-ClaudeEnv.ps1 -Profile win11 -WhatIf
.\scripts\Sync-ClaudeEnv.ps1 -Action list
.\scripts\Sync-ClaudeEnv.ps1 -Action restore
```

```bash
# Chromebook / DGX Spark / cloud container
./scripts/sync-claude-env.sh                      # detect + apply
./scripts/sync-claude-env.sh apply dgx-spark
./scripts/sync-claude-env.sh list
./scripts/sync-claude-env.sh restore
```

Detection can always be overridden with `DWS_CLAUDE_PROFILE=<profile>`.

## On `bypassPermissions`

**HIC decision, 2026-08-13:** all four profiles ship
`permissions.defaultMode: "bypassPermissions"`.

This is safe *here* for one specific reason: `bypassPermissions` skips the
permission prompt and the `settings.json` deny list, but it does **not** disable
hooks. `PreToolUse` fires earlier in the agentic loop than `PermissionRequest`,
so `.claude/hooks/pretooluse-guard.sh` still blocks `rm -rf`, `sudo`,
`curl | sh`, force pushes, `env`/`printenv` dumps, and reads of `.env*` /
`*.pem` / `*.key` / `*secret*`. This matches what `CLAUDE.md` already says under
*Secret Egress Rules*: the deny list can be bypassed, and the hooks are the real
enforcement layer.

**Revisit this if a second contributor joins.** With one contributor the deny
list is a convenience; with several it becomes load-bearing, because a profile
committed here would then hand every contributor a permission bypass. That was
the original security finding, and the answer changes with the headcount, not
with the code.

Edit the profile, never the generated `settings.local.json` — the next `apply`
overwrites it (after backing it up).

# DWS6 Claude Code PreToolUse Hook Guardrails

This directory contains hook scripts for Claude Code's auto-enable-mode feature.
They act as guardrails that intercept tool calls before execution, enforcing the
security rules defined in `CLAUDE.md`.

## How It Works

Claude Code hooks are configured in `.claude/settings.local.json`. When Claude Code
invokes a tool (e.g., `Bash`), the hook receives JSON on stdin describing the call:

```json
{"tool_name": "Bash", "tool_input": {"command": "rm -rf /"}}
```

| Script | Trigger | Availability | Purpose |
|--------|---------|--------------|---------|
| `pre-bash-safety.sh` | PreToolUse (Bash) | Optional (enable via `.claude/settings.local.json`) | Warns about destructive shell patterns |
| `session-start.sh` | SessionStart | Enabled by default | Injects trust boundary context, checks branch/dirty state, MCP health |
| `session-stop.sh` | Stop | Enabled by default | Pre-exit governance checklist (uncommitted changes, dual folder sync, thesis rules) |

| Exit Code | Meaning | Effect |
|-----------|---------|--------|
| `0` | ALLOW | Command proceeds normally |
| `2` | BLOCK | Command is rejected; stderr message shown to agent |
| `0` + JSON stdout | ASK | User is prompted for approval |

| Event | When | Use Case |
|-------|------|----------|
| `SessionStart` | New session or after context compaction | Context injection, environment checks |
| `PreToolUse` | Before any tool call | Input validation, safety checks |
| `PostToolUse` | After tool completes | Output normalization, logging |
| `Notification` | Agent sends notification | Alert routing, audit logging |
| `Stop` | Agent stops | Governance checklist, cleanup, handover documentation |

## Configuration

Hooks are registered in `.claude/settings.local.json`.

The repository’s default configuration wires up the `SessionStart` and `Stop` hooks:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "./.claude/hooks/session-start.sh" }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          { "type": "command", "command": "./.claude/hooks/session-stop.sh" }
        ]
      }
    ]
  }
}
```

To enable the optional Bash `PreToolUse` safety guardrail, add a `PreToolUse` entry to your local `.claude/settings.local.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "bash .claude/hooks/pre-bash-safety.sh" }
        ]
      }
    ]
  }
}
```

Both hooks run on every `Bash` tool call. The general guard runs first; if it
allows, the SQL guard runs next (and only activates if SQL is detected).

## Audit Log

All decisions are logged to `.claude/hooks/audit.log` with format:

```
2026-03-07T12:00:00Z | BLOCK | rm with force/recursive on root | rm -rf /tmp/important
2026-03-07T12:00:01Z | ALLOW | npm/npx command | npm run test
2026-03-07T12:00:02Z | ASK | Command not in allow/deny list | some-unknown-cmd
2026-03-07T12:00:03Z | SQL-BLOCK | Migration SQL missing BEGIN/COMMIT | psql -c "CREATE TABLE..."
```

The audit log is gitignored (`.claude/hooks/audit.log` matches `*.log` in `.gitignore`).

## Dependencies

- `jq` (JSON parser) -- standard on most Linux/macOS systems
- POSIX-compatible shell (`/bin/sh`)

## Hook Events (Claude Code Reference)

| Event | When | Use Case |
|-------|------|----------|
| `PreToolUse` | Before any tool call | Input validation, safety checks |
| `PostToolUse` | After tool completes | Output normalization, logging |
| `Notification` | Agent sends notification | Alert routing, audit logging |
| `Stop` | Agent stops | Cleanup, handover documentation |

## Adding New Rules

1. Add BLOCK patterns to the deny list section in `pretooluse-guard.sh`
2. Add ALLOW patterns to the allow list section
3. Test with: `echo '{"tool_name":"Bash","tool_input":{"command":"your-test-cmd"}}' | bash .claude/hooks/pretooluse-guard.sh`
4. Check exit code: `echo $?` (0 = allow, 2 = block)

## References

- CLAUDE.md: "Never Delete Files — Always Move (CRITICAL)"
- CLAUDE.md: Security Coding Rules section
- Admin/ADMIN_MANUAL.md: Section 27 — Claude Code Project Engineering Structure
- docs/AUTO_MODE_TRUST_BOUNDARY.md: GREEN/YELLOW/RED zone definitions for auto-enable-mode

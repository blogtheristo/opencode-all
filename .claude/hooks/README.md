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

The hook script decides:

| Exit Code | Meaning | Effect |
|-----------|---------|--------|
| `0` | ALLOW | Command proceeds normally |
| `2` | BLOCK | Command is rejected; stderr message shown to agent |
| `0` + JSON stdout | ASK | User is prompted for approval |

## Scripts

### pretooluse-guard.sh

Primary guardrail for all Bash tool calls. Three-tier decision:

**BLOCK (exit 2) -- destructive patterns:**
- `rm -rf`, `rm -r /`, force-delete on broad paths
- `DROP TABLE`, `TRUNCATE`, `DELETE FROM` without `WHERE`
- `git push --force`, `git reset --hard`, `git clean -f`
- Reading `.env`, `.env.*`, `*.key`, `*.pem`, `*.secret`, `credentials.json`, `service-account-*.json`
- Pipe-to-shell attacks: `curl | sh`, `curl | bash`, `wget | sh`
- `sudo` commands
- `exec()` with string interpolation patterns

**ALLOW (exit 0) -- safe patterns:**
- `npm run *`, `npx *`, `node *`, `tsx *`, `vitest *`
- `git status`, `git diff`, `git log`, `git add`, `git commit`, `git push` (non-force)
- Read-only: `ls`, `pwd`, `echo`, `cat`, `head`, `tail`, `find`, `grep`
- Build tools: `make`, `cargo`, `python`, `docker`, `gh`, `chmod`, `mkdir`, `cp`, `mv`

**ASK (JSON stdout) -- everything else:**
Commands not in either list prompt the user for explicit approval.

### sql-safety-guard.sh

Boardy-enforced SQL safety checks. Only activates when a Bash command contains
SQL-like content (`CREATE TABLE`, `ALTER TABLE`, `psql`, etc.).

**Checks enforced:**
1. Migration SQL must have `BEGIN`/`COMMIT` transaction wrappers
2. `SECURITY DEFINER` is blocked (use `SECURITY INVOKER` instead)
3. `CREATE TABLE` must include `ENABLE ROW LEVEL SECURITY`
4. `DROP TABLE` requires an approval comment (`-- APPROVED` or `-- boardy-approved`)

See CLAUDE.md section "Safety Rules for SQL (Boardy Enforced)" for rationale.

## Configuration

Hooks are registered in `.claude/settings.local.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/pretooluse-guard.sh"
          },
          {
            "type": "command",
            "command": "bash .claude/hooks/sql-safety-guard.sh"
          }
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

- CLAUDE.md: "Security Coding Rules (CRITICAL)"
- CLAUDE.md: "Never Delete Files -- Always Move (CRITICAL)"
- CLAUDE.md: "Safety Rules for SQL (Boardy Enforced)"
- DWS_SECURITY_STANDARD.md: Enterprise security framework

# DWS6 Claude Code Hooks

This directory contains hook scripts for Claude Code automated workflow validation.

## Hook Architecture

Hooks in Claude Code are configured in `.claude/settings.json` (or `settings.local.json`)
and reference scripts in this directory. They execute at specific lifecycle events.

## Available Hooks

| Script | Trigger | Purpose |
|--------|---------|---------|
| `pre-bash-safety.sh` | PreToolUse (Bash) | Warns about destructive shell patterns |

## Hook Events

| Event | When | Use Case |
|-------|------|----------|
| `PreToolUse` | Before any tool call | Input validation, safety checks |
| `PostToolUse` | After tool completes | Output normalization, logging |
| `Notification` | Agent sends notification | Alert routing, audit logging |
| `Stop` | Agent stops | Cleanup, handover documentation |

## Enabling Hooks

Add to `.claude/settings.local.json` (project-level) or `~/.claude/settings.json` (user-level):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash .claude/hooks/pre-bash-safety.sh"
          }
        ]
      }
    ]
  }
}
```

## DWS6 Security Rules Enforced

From `CLAUDE.md` (source of truth):
- Never delete files — use `git mv` (hook warns on `rm -rf`, `git clean -fd`)
- Never force-push to main/master (hook warns on `git push --force origin main`)
- Never run destructive git resets without explicit confirmation

## Gap Analysis (02.03.2026)

Identified as critical gap during repo audit. Previously: only `.githooks/` existed
(git-level enforcement). Claude Code hooks add AI-workflow-level enforcement,
catching issues before they reach the shell layer.

## References

- CLAUDE.md: "Never Delete Files — Always Move (CRITICAL)"
- CLAUDE.md: Security Coding Rules section
- Admin/ADMIN_MANUAL.md: Section 27 — Claude Code Project Engineering Structure

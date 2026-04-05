# DWS6 Claude Code Safety Hooks

12 hooks across 4 event types. Configured in `.claude/settings.local.json`.

**Design:** Zero permission prompts. Block (exit 2) or allow (exit 0), never ask.

## Hook Inventory

| Hook                      | Event        | Matcher                          | Purpose                                                                               |
| ------------------------- | ------------ | -------------------------------- | ------------------------------------------------------------------------------------- |
| `session-start.sh`        | SessionStart | all                              | Trust boundary injection (GREEN/YELLOW/RED zones), branch + MCP checks                |
| `pretooluse-guard.sh`     | PreToolUse   | Bash                             | Master deny list: rm -rf, force push, hard reset, git rm, sudo, pipe-to-shell, ollama |
| `secret-scan.sh`          | PreToolUse   | Bash, Edit, Write                | 14 OWASP secret patterns (AWS, GitHub, Stripe, Anthropic, JWT, npm, Slack)            |
| `log-commands.sh`         | PreToolUse   | Bash                             | Audit every Bash command with timestamp + branch                                      |
| `sql-safety-guard.sh`     | PreToolUse   | Bash                             | 7 SQL rules: RLS, transactions, DROP approval, Aiwen immutability                     |
| `protect-files.sh`        | PreToolUse   | Edit, Write                      | Block .env, .key, .pem, credentials, migrations, .md in public folders                |
| `require-tests-for-pr.sh` | PreToolUse   | mcp**github**create_pull_request | Tests must pass before PR creation                                                    |
| prettier (inline)         | PostToolUse  | Write, Edit                      | Auto-format with prettier                                                             |
| eslint (inline)           | PostToolUse  | Write, Edit                      | Auto-fix with eslint                                                                  |
| `session-stop.sh`         | Stop         | all                              | Governance checklist (dual folder sync, thesis, uncommitted changes)                  |
| `auto-commit.sh`          | Stop         | all                              | Auto-commit on feature branches at session end                                        |
| `validate-branch-name.py` | PreToolUse   | Bash (git checkout -b)           | Git Flow branch naming validation                                                     |

## Exit Codes

| Code | Meaning | Effect                         |
| ---- | ------- | ------------------------------ |
| `0`  | ALLOW   | Command proceeds               |
| `2`  | BLOCK   | Command rejected, stderr shown |

## Architecture

**Allow-first:** Safe command prefixes (node, npx, npm, python, git commit, etc.) bypass deny checks immediately. This prevents false positives from keywords in string literals, commit messages, or inline scripts.

## Audit Logs

| File                                    | Content               |
| --------------------------------------- | --------------------- |
| `.claude/hooks/audit/bash-commands.log` | Every Bash command    |
| `.claude/hooks/audit.log`               | Block/allow decisions |
| `.claude/command-log.txt`               | Duplicate command log |

All logs are gitignored.

## Testing

```bash
# Should BLOCK (exit 2)
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf /"}}' | bash .claude/hooks/pretooluse-guard.sh

# Should ALLOW (exit 0)
echo '{"tool_name":"Bash","tool_input":{"command":"npm run test"}}' | bash .claude/hooks/pretooluse-guard.sh
```

## Dependencies

- `jq`, POSIX shell, `grep -P` (Perl regex), Python 3 (branch validator only)

## Full Reference

`Admin/ADMIN_MANUAL.md` Section 30 — Claude Code Safety Hooks Reference

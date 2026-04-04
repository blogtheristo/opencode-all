# DWS6 Claude Code Safety Hooks

**12 hooks** across 4 event types. Zero permission prompts — block or allow, never ask.

Full reference: `Admin/ADMIN_MANUAL.md` Section 30.

## Architecture

**Allow-first.** Safe command prefixes (node, npx, npm, python, etc.) bypass all deny checks.
Deny patterns only run on actual shell/git/SQL commands. This prevents false positives
from keywords inside string literals, commit messages, or inline scripts.

## Hook Inventory

| Script                    | Event        | Matcher           | Purpose                                                                               |
| ------------------------- | ------------ | ----------------- | ------------------------------------------------------------------------------------- |
| `session-start.sh`        | SessionStart | all               | Trust boundary (GREEN/YELLOW/RED), branch check, MCP health                           |
| `pretooluse-guard.sh`     | PreToolUse   | Bash              | Master deny list: rm -rf, force push, hard reset, git rm, sudo, pipe-to-shell, ollama |
| `secret-scan.sh`          | PreToolUse   | Bash, Edit, Write | 14 OWASP secret patterns (AWS, GitHub, Stripe, Anthropic, JWT, npm, Slack)            |
| `log-commands.sh`         | PreToolUse   | Bash              | Audit every command with timestamp + branch                                           |
| `sql-safety-guard.sh`     | PreToolUse   | Bash              | 7 SQL rules: RLS, transactions, DROP approval, Aiwen immutability                     |
| `protect-files.sh`        | PreToolUse   | Edit, Write       | Block .env, .key, .pem, credentials, migrations, .md in public folders                |
| `require-tests-for-pr.sh` | PreToolUse   | PR create         | Tests must pass before PR creation                                                    |
| `session-stop.sh`         | Stop         | all               | Governance checklist (dual folder sync, thesis, uncommitted changes)                  |
| `auto-commit.sh`          | Stop         | all               | Auto-commit on feature branches at session end                                        |
| `validate-branch-name.py` | PreToolUse   | Bash              | Git Flow branch naming validation                                                     |
| prettier (inline)         | PostToolUse  | Write, Edit       | Auto-format every file change                                                         |
| eslint (inline)           | PostToolUse  | Write, Edit       | Auto-fix lint errors                                                                  |

## Exit Codes

| Code | Meaning | Effect                                  |
| ---- | ------- | --------------------------------------- |
| `0`  | ALLOW   | Command proceeds                        |
| `2`  | BLOCK   | Command rejected, stderr shown to agent |

**No ASK mode.** Every hook decides definitively.

## Configuration

All hooks wired in `.claude/settings.local.json`. See `Admin/ADMIN_MANUAL.md` Section 30.8 for full JSON.

## Audit Logs

| File                      | Content                                     |
| ------------------------- | ------------------------------------------- |
| `audit/bash-commands.log` | Every Bash command with timestamp + branch  |
| `audit.log`               | Block/allow decisions from pretooluse-guard |

All logs gitignored (`*.log`).

## Testing

```bash
# Should BLOCK (exit 2)
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf /"}}' | bash .claude/hooks/pretooluse-guard.sh

# Should ALLOW (exit 0)
echo '{"tool_name":"Bash","tool_input":{"command":"npm run test"}}' | bash .claude/hooks/pretooluse-guard.sh
```

## Adding New Rules

1. Add BLOCK patterns to deny list in `pretooluse-guard.sh`
2. Add safe prefixes to allow list if needed
3. Test with JSON pipe (see above)
4. Check exit code: `echo $?`

## Dependencies

- `jq` — JSON parser
- `grep` with `-P` (Perl regex) — secret-scan
- POSIX shell (`/bin/sh`)
- Python 3 — validate-branch-name.py only
- `npm` — require-tests-for-pr.sh, PostToolUse formatters

## References

- `CLAUDE.md`: Claude Code Safety Hooks section
- `Admin/ADMIN_MANUAL.md`: Section 30 — full reference
- `docs/AUTO_MODE_TRUST_BOUNDARY.md`: GREEN/YELLOW/RED zone definitions
- `DWS_SECURITY_STANDARD.md`: AI safety framework

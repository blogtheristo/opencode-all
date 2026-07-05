# DWS6 Claude Code Safety Hooks

10 hooks across 4 event types. Configured in `.claude/settings.local.json`.

**Philosophy (revised 2026-04-14):** Firewall + Explicit. PreToolUse hooks block disasters in real-time (file destruction, secrets, SQL). Stop/PR hooks that acted autonomously have been removed — commits, tests, and PRs are Claude's explicit steps, not hidden side effects.

**Design:** Zero permission prompts. Block (exit 2) or allow (exit 0), never ask.

## Hook Inventory

| Hook                      | Event        | Matcher                | Purpose                                                                                                                                                                          |
| ------------------------- | ------------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `session-start.sh`        | SessionStart | all                    | Trust boundary injection (GREEN/YELLOW/RED zones), branch + MCP checks                                                                                                           |
| `pretooluse-guard.sh`     | PreToolUse   | Bash                   | Master deny list: rm -rf, force push, hard reset, git rm, sudo, pipe-to-shell, ollama + secret-file read-bypass guard (cat/grep/env/printenv of .env\*/\*.pem/\*.key/\*secret\*) |
| `secret-scan.sh`          | PreToolUse   | Bash, Edit, Write      | Scans tool **input** via shared `secret-patterns.sh` (provider keys, bare JWT, DSN creds, Bearer, DB passwords, OAuth secrets)                                                   |
| `secret-output-scan.sh`   | PostToolUse  | Bash                   | Scans command **output**; advisory warning not to persist any secret that surfaced at runtime                                                                                    |
| `secret-patterns.sh`      | (sourced)    | —                      | Shared secret-detection engine + placeholder allowlist (used by both secret-scan and secret-output-scan)                                                                         |
| `log-commands.sh`         | PreToolUse   | Bash                   | Audit every Bash command with timestamp + branch                                                                                                                                 |
| `sql-safety-guard.sh`     | PreToolUse   | Bash                   | 7 SQL rules: RLS, transactions, DROP approval, Aiven immutability                                                                                                                |
| `protect-files.sh`        | PreToolUse   | Edit, Write            | Block .env, .key, .pem, credentials, migrations, .md in public folders                                                                                                           |
| prettier (inline)         | PostToolUse  | Write, Edit            | Auto-format with prettier                                                                                                                                                        |
| eslint (inline)           | PostToolUse  | Write, Edit            | Auto-fix with eslint                                                                                                                                                             |
| `session-stop.sh`         | Stop         | all                    | Governance checklist (dual folder sync, thesis, uncommitted changes)                                                                                                             |
| `validate-branch-name.py` | PreToolUse   | Bash (git checkout -b) | Git Flow branch naming validation                                                                                                                                                |

**Removed (2026-04-14):** `auto-commit.sh` (silent commits caused hook regressions) · `require-tests-for-pr.sh` (duplicate of CI/CD gate)

## 12 Rules — Hook Enforcement Map

The 12 Engineering Discipline Rules (canonical: `CLAUDE.md`) are surfaced to every session by `session-start.sh` and mechanically enforced where possible:

| Rule                          | Hook / mechanism                                                               |
| ----------------------------- | ------------------------------------------------------------------------------ |
| 3 Surgical changes            | `protect-files.sh` blocks edits to .env/.key/.pem/migrations/public `.md`      |
| 6 Token budgets               | `session-start.sh` echoes `CLAUDE_AUTO_MODE_BUDGET`                            |
| 10 Checkpoint each step       | `session-stop.sh` governance checklist (dual-folder sync, thesis, uncommitted) |
| 11 Match conventions          | `validate-branch-name.py`; prettier + eslint PostToolUse auto-format           |
| 12 Fail loud                  | All PreToolUse guards block (exit 2) with stderr — never silent-pass           |
| (secrets / security baseline) | `secret-scan.sh`, `sql-safety-guard.sh`, `pretooluse-guard.sh`                 |

Rules 1, 2, 4, 5, 7, 8, 9 are judgment-level — enforced by the session-start injection and review (`/review`, `/simplify`), not by a blocking hook.

## Exit Codes

| Code | Meaning | Effect                         |
| ---- | ------- | ------------------------------ |
| `0`  | ALLOW   | Command proceeds               |
| `2`  | BLOCK   | Command rejected, stderr shown |

## Architecture

**Allow-first:** Safe command prefixes (node, npx, npm, python, git commit --trailer "Made-with: Cursor", etc.) bypass deny checks immediately. This prevents false positives from keywords in string literals, commit messages, or inline scripts.

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

## Windows (Git Bash)

On Windows, Claude Code runs hook `command` strings through **cmd.exe** unless Git Bash is used for shell hooks. Set a **User** environment variable and restart the terminal (or IDE):

- `CLAUDE_CODE_GIT_BASH_PATH` = full path to `bash.exe`, for example `C:\Program Files\Git\bin\bash.exe`

Hook entries in `settings.local.json` use `"$CLAUDE_PROJECT_DIR"/.claude/hooks/...` so scripts resolve from the repository root. Without Git Bash, `.sh` hooks often fail with "cannot find" or similar errors.

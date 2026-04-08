#!/usr/bin/env bash
# Log every Bash command Claude runs — timestamped audit trail
# PreToolUse hook — always exits 0 (logging only, never blocks)
set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""')
[ -z "$cmd" ] && exit 0

# Log to both audit dir and project-root command log
AUDIT_DIR="$(cd "$(dirname "$0")" && pwd)/audit"
mkdir -p "$AUDIT_DIR"

TIMESTAMP=$(date -Is 2>/dev/null || date -u '+%Y-%m-%dT%H:%M:%SZ')
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

printf '%s branch=%s %s\n' "$TIMESTAMP" "$BRANCH" "$cmd" >> "$AUDIT_DIR/bash-commands.log"
printf '%s %s\n' "$TIMESTAMP" "$cmd" >> .claude/command-log.txt

exit 0

#!/usr/bin/env bash
# secret-output-scan.sh — PostToolUse hook for Bash.
#
# The PreToolUse secret-scan.sh only sees what the agent TYPES. This hook sees
# what a command PRINTS. If a secret surfaces in command output (e.g. `printenv`,
# an API error body, a stack trace, a DSN echoed by a tool), it gets pulled into
# the model's context where it can be re-emitted into a committed file, a PR body,
# or a log — "the place nobody thought to check."
#
# This is ADVISORY, not blocking: the command has already run, so we cannot undo
# it. We exit 2 to surface a warning back to the agent (do NOT persist the secret)
# and write an audit record. Exit 2 in PostToolUse only feeds stderr to the agent;
# it cannot loop because the tool already completed.
#
# Code-Version: 1.0 | Branch: claude/ai-codebase-security-audit-BgY2H
set -euo pipefail

INPUT="$(cat)"

# shellcheck source=/dev/null
. "$(dirname "$0")/secret-patterns.sh"

# Extract the command output from the PostToolUse payload (jq, python fallback).
extract_output() {
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$INPUT" | jq -r '
      [ (.tool_response.stdout // empty),
        (.tool_response.stderr // empty),
        (.tool_response.output // empty),
        (if (.tool_response | type) == "string" then .tool_response else empty end)
      ] | join("\n")' 2>/dev/null
    return 0
  fi
  if command -v python3 >/dev/null 2>&1; then py=python3; elif command -v python >/dev/null 2>&1; then py=python; else printf ''; return 0; fi
  printf '%s' "$INPUT" | "$py" - <<'PY'
import json, sys
try:
    d = json.loads(sys.stdin.read() or "{}")
except Exception:
    print(""); raise SystemExit(0)
r = d.get("tool_response")
parts = []
if isinstance(r, str):
    parts.append(r)
elif isinstance(r, dict):
    for k in ("stdout", "stderr", "output"):
        v = r.get(k)
        if isinstance(v, str):
            parts.append(v)
print("\n".join(parts))
PY
}

OUTPUT="$(extract_output)"
[ -z "$OUTPUT" ] && exit 0

if REDACTED=$(scan_for_secrets "$OUTPUT"); then
  AUDIT_DIR="$(dirname "$0")/audit"
  mkdir -p "$AUDIT_DIR"
  echo "$(date -Iseconds) WARN secret-output-scan: secret in command output ($REDACTED)" >> "$AUDIT_DIR/secret-scan.log"

  cat >&2 <<MSG
SECURITY WARNING: a value matching a secret pattern ($REDACTED) appeared in the
output of the command you just ran. Do NOT write, commit, paste, or log this
value anywhere — not into files, PR/issue bodies, MCP tool calls, or docs.
Reference it via an environment variable instead.
MSG
  exit 2
fi

exit 0

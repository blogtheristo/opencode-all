#!/bin/bash
# Secret scanning hook — PreToolUse guard for Bash and Write tools
# Inspects tool input for hardcoded secrets before execution
# Exit 0 = ALLOW, Exit 2 = BLOCK
#
# Patterns from ECC (everything-claude-code) AgentShield, adapted for DWS6
# Code-Version: 1.0 | Branch: claude/review-claude-skills-vZQ0r | Date: 2026-03-31

INPUT=$(cat)

json_get() {
  key_paths="$1"
  default_value="${2:-}"

  if command -v jq >/dev/null 2>&1; then
    expr=""
    IFS='|' read -r -a keys <<< "$key_paths"
    for k in "${keys[@]}"; do
      [ -n "$expr" ] && expr="$expr // "
      expr="${expr}.${k}"
    done
    printf '%s' "$INPUT" | jq -r "$expr // \"$default_value\"" 2>/dev/null
    return 0
  fi

  if command -v python3 >/dev/null 2>&1; then
    py_bin="python3"
  elif command -v python >/dev/null 2>&1; then
    py_bin="python"
  else
    printf '%s' "$default_value"
    return 0
  fi

  printf '%s' "$INPUT" | "$py_bin" - "$key_paths" "$default_value" <<'PY'
import json
import sys

raw = sys.stdin.read()
key_paths = sys.argv[1].split("|")
default = sys.argv[2]

try:
    data = json.loads(raw) if raw else {}
except Exception:
    print(default)
    raise SystemExit(0)

def get_path(obj, path):
    cur = obj
    for part in path.split("."):
        if not part:
            continue
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            return None
    return cur

value = None
for p in key_paths:
    value = get_path(data, p)
    if value is not None:
        break

if value is None:
    print(default)
elif isinstance(value, (dict, list)):
    print(json.dumps(value, separators=(",", ":")))
else:
    print(str(value))
PY
}

# Extract the tool input content to scan
CONTENT=$(json_get "tool_input" "")
if [ -z "$CONTENT" ]; then
  # No parseable input, allow
  exit 0
fi

# Patterns + scanner are shared with secret-output-scan.sh (single source of truth).
# shellcheck source=/dev/null
. "$(dirname "$0")/secret-patterns.sh"

# Scan the tool input for any real (non-placeholder) secret
if REDACTED=$(scan_for_secrets "$CONTENT"); then
  AUDIT_DIR=".claude/hooks/audit"
  mkdir -p "$AUDIT_DIR"
  echo "$(date -Iseconds) BLOCKED secret-scan: pattern matched ($REDACTED)" >> "$AUDIT_DIR/secret-scan.log"

  echo "BLOCKED: Potential secret detected in tool input ($REDACTED). Use environment variables instead." >&2
  exit 2
fi

# No secrets found
exit 0

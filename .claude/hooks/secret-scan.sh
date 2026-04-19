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

# Secret patterns (14 patterns — adapted from ECC AgentShield)
PATTERNS=(
  # AWS
  'AKIA[0-9A-Z]{16}'
  # GitHub tokens
  'ghp_[a-zA-Z0-9]{36}'
  'github_pat_[a-zA-Z0-9_]{22,}'
  'gho_[a-zA-Z0-9]{36}'
  # Slack
  'xox[bpors]-[0-9a-zA-Z-]+'
  # Generic API keys (long hex strings assigned to variables)
  '(?i)(api[_-]?key|api[_-]?secret|access[_-]?token|secret[_-]?key)\s*[=:]\s*["\x27][a-zA-Z0-9/+=]{20,}["\x27]'
  # Private keys
  '-----BEGIN (RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----'
  # Supabase service role (eyJ prefix is JWT)
  'service_role.*eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+'
  # Stripe
  'sk_live_[a-zA-Z0-9]{24,}'
  'sk_test_[a-zA-Z0-9]{24,}'
  # SendGrid
  'SG\.[a-zA-Z0-9_-]{22}\.[a-zA-Z0-9_-]{43}'
  # Google
  'AIza[0-9A-Za-z_-]{35}'
  # npm tokens
  'npm_[a-zA-Z0-9]{36}'
  # Anthropic
  'sk-ant-[a-zA-Z0-9_-]{40,}'
)

# Scan content against each pattern
for PATTERN in "${PATTERNS[@]}"; do
  if echo "$CONTENT" | grep -qP "$PATTERN" 2>/dev/null; then
    MATCH=$(echo "$CONTENT" | grep -oP "$PATTERN" 2>/dev/null | head -1)
    # Redact most of the match
    REDACTED="${MATCH:0:8}...REDACTED"

    # Log to audit
    AUDIT_DIR=".claude/hooks/audit"
    mkdir -p "$AUDIT_DIR"
    echo "$(date -Iseconds) BLOCKED secret-scan: pattern matched ($REDACTED)" >> "$AUDIT_DIR/secret-scan.log"

    echo "BLOCKED: Potential secret detected in tool input ($REDACTED). Use environment variables instead." >&2
    exit 2
  fi
done

# No secrets found
exit 0

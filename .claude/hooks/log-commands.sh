se#!/usr/bin/env bash
# Log every Bash command Claude runs — timestamped audit trail
# Log every Bash command Claude runs — timestamped audit trail
# Log every Bash command Claude runs — timestamped audit trail
# PreToolUse hook — always exits 0 (logging only, never blocks)
set -euo pipefail

INPUT=$(cat)

json_get() {
  key_path="$1"
  default_value="${2:-}"

  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$INPUT" | jq -r ".$key_path // \"$default_value\"" 2>/dev/null
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

  printf '%s' "$INPUT" | "$py_bin" - "$key_path" "$default_value" <<'PY'
import json
import sys

raw = sys.stdin.read()
key_path = sys.argv[1]
default = sys.argv[2]

try:
    data = json.loads(raw) if raw else {}
except Exception:
    print(default)
    raise SystemExit(0)

cur = data
for part in key_path.split("."):
    if not part:
        continue
    if isinstance(cur, dict) and part in cur:
        cur = cur[part]
    else:
        print(default)
        raise SystemExit(0)

if cur is None:
    print(default)
elif isinstance(cur, (dict, list)):
    print(json.dumps(cur, separators=(",", ":")))
else:
    print(str(cur))
PY
}

cmd=$(json_get "tool_input.command" "")
[ -z "$cmd" ] && exit 0

# Log to both audit dir and project-root command log
AUDIT_DIR="$(cd "$(dirname "$0")" && pwd)/audit"
mkdir -p "$AUDIT_DIR"

TIMESTAMP=$(date -Is 2>/dev/null || date -u '+%Y-%m-%dT%H:%M:%SZ')
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

printf '%s branch=%s %s\n' "$TIMESTAMP" "$BRANCH" "$cmd" >> "$AUDIT_DIR/bash-commands.log"
printf '%s %s\n' "$TIMESTAMP" "$cmd" >> .claude/command-log.txt

exit 0

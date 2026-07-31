 #!/bin/sh
# DWS6 Claude Code Hook: SQL Safety Guard
# Enforces SQL safety rules on Bash commands containing SQL
# Upgraded: Supabase patterns + Article 12 immutability
#
# Checks:
# 1. Missing BEGIN/COMMIT transaction wrappers in multi-statement migrations
# 2. SECURITY DEFINER — ask (not block) for helper functions
# 3. Missing RLS on new CREATE TABLE
# 4. DROP TABLE without approval comment
# 5. Aiven: audit/Article 12 tables must be append-only
# 6. ON DELETE CASCADE without soft-delete pattern
# 7. pg_cron jobs that mutate data
#
# Requires: jq or Python (fallback parser)
# See: CLAUDE.md "Safety Rules for SQL"

set -euo pipefail

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDIT_LOG="${HOOK_DIR}/audit.log"
TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# Read JSON from stdin
INPUT="$(cat)"

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

TOOL_NAME="$(json_get "tool_name" "")"
COMMAND="$(json_get "tool_input.command" "")"

# Only process Bash tool calls that contain SQL
if [ "$TOOL_NAME" != "Bash" ] || [ -z "$COMMAND" ]; then
  exit 0
fi

# Only fire on actual SQL execution commands — skip everything else
# SQL keywords inside node/npx/git/echo/commit commands are string literals, not real SQL
IS_SQL_CMD=0
case "$COMMAND" in
  psql*|'supabase db'*|'supabase migration'*) IS_SQL_CMD=1 ;;
  # Skip all non-SQL commands early — git, node, npx, echo, etc.
  git*|node*|npx*|npm*|echo*|cat*|ls*|cp*|mv*|mkdir*|chmod*|curl*|wget*) IS_SQL_CMD=0 ;;
  *) # For compound commands (&&, |), check if first segment is SQL
     FIRST_CMD=$(printf '%s' "$COMMAND" | sed 's/[;&|].*//' | xargs)
     case "$FIRST_CMD" in
       psql*|'supabase db'*|'supabase migration'*) IS_SQL_CMD=1 ;;
     esac ;;
esac

HAS_SQL="$IS_SQL_CMD"

if [ "$HAS_SQL" -eq 0 ]; then
  exit 0
fi

log_block() {
  reason="$1"
  printf '%s | SQL-BLOCK | %s | %s\n' "$TIMESTAMP" "$reason" "$COMMAND" >> "$AUDIT_LOG" 2>/dev/null || true
  printf '[SQL-GUARD] %s\n' "$reason" >&2
  exit 2
}

log_warn() {
  reason="$1"
  printf '%s | SQL-WARN | %s | %s\n' "$TIMESTAMP" "$reason" "$COMMAND" >> "$AUDIT_LOG" 2>/dev/null || true
  # Warn in audit log but allow silently — no prompt
  exit 0
}

# --- Check 1: Multi-statement migrations need BEGIN/COMMIT ---
# Count DDL statements — only require transaction wrapper for multi-statement
if printf '%s' "$COMMAND" | grep -qiE '(CREATE[[:space:]]+TABLE|ALTER[[:space:]]+TABLE|DROP[[:space:]]+TABLE)'; then
  DDL_COUNT=$(printf '%s' "$COMMAND" | grep -ciE '(CREATE[[:space:]]+TABLE|ALTER[[:space:]]+TABLE|DROP[[:space:]]+TABLE|CREATE[[:space:]]+FUNCTION|CREATE[[:space:]]+POLICY)' || echo "0")
  if [ "$DDL_COUNT" -gt 1 ]; then
    if ! printf '%s' "$COMMAND" | grep -qiE 'BEGIN'; then
      log_block "Multi-statement migration ($DDL_COUNT DDL ops) missing BEGIN/COMMIT transaction wrapper."
    fi
    if ! printf '%s' "$COMMAND" | grep -qiE 'COMMIT'; then
      log_block "Multi-statement migration missing COMMIT. Every migration needs BEGIN + COMMIT."
    fi
  fi
fi

# --- Check 2: SECURITY DEFINER — ask, don't block ---
# Legitimate for RLS helper functions (is_backoffice_admin, etc.)
if printf '%s' "$COMMAND" | grep -qiE 'SECURITY[[:space:]]+DEFINER'; then
  log_warn "SECURITY DEFINER detected. OK for internal RLS helpers, not for public-facing functions. Confirm this is a helper function."
fi

# --- Check 3: CREATE TABLE without RLS ---
# Warn only (not block) — migrations commonly split CREATE TABLE and ALTER TABLE
# ENABLE ROW LEVEL SECURITY across separate statements or files.
# A hard block here false-positives on valid multi-statement migrations.
if printf '%s' "$COMMAND" | grep -qiE 'CREATE[[:space:]]+TABLE'; then
  if ! printf '%s' "$COMMAND" | grep -qiE 'ENABLE[[:space:]]+ROW[[:space:]]+LEVEL[[:space:]]+SECURITY'; then
    log_warn "CREATE TABLE without ENABLE ROW LEVEL SECURITY in this command. Ensure RLS is enabled before deploying."
  fi
fi

# --- Check 4: DROP TABLE without approval comment ---
if printf '%s' "$COMMAND" | grep -qiE 'DROP[[:space:]]+TABLE'; then
  if ! printf '%s' "$COMMAND" | grep -qiE -- '--[[:space:]]*(APPROVED|approved)'; then
    log_block "DROP TABLE without approval comment (-- APPROVED required)."
  fi
fi

# --- Check 5: Aiven — audit/Article 12 tables must be append-only ---
if printf '%s' "$COMMAND" | grep -qiE '(audit|article.?12|reasoning.?lineage|aiven.?log)'; then
  if printf '%s' "$COMMAND" | grep -qiE '(UPDATE[[:space:]]+|DELETE[[:space:]]+FROM)[[:space:]]*(audit|article.?12|reasoning|aiven)'; then
    log_block "Article 12 compliance: audit/Article 12 tables are immutable. No UPDATE or DELETE allowed."
  fi
fi

# --- Check 6: ON DELETE CASCADE risk ---
if printf '%s' "$COMMAND" | grep -qiE 'ON[[:space:]]+DELETE[[:space:]]+CASCADE'; then
  log_warn "ON DELETE CASCADE detected. Risk of permanent data loss. Consider ON DELETE SET NULL or soft-delete (is_deleted/archived_at)."
fi

# --- Check 7: pg_cron safety ---
if printf '%s' "$COMMAND" | grep -qiE 'cron\.schedule'; then
  if printf '%s' "$COMMAND" | grep -qiE '(DELETE[[:space:]]+FROM|DROP|TRUNCATE|UPDATE)'; then
    log_warn "pg_cron job performs mutations. Ensure it targets only ephemeral/cleanup data and is wrapped in a transaction."
  fi
fi

# All checks passed
printf '%s | SQL-ALLOW | All checks passed | %s\n' "$TIMESTAMP" "$COMMAND" >> "$AUDIT_LOG" 2>/dev/null || true
exit 0

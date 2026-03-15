#!/bin/sh
# DWS6 Claude Code Hook: Boardy SQL Safety Guard
# Enforces Boardy's SQL safety rules from CLAUDE.md on Bash commands containing SQL
#
# Checks:
# 1. Missing BEGIN/COMMIT transaction wrappers in migrations
# 2. SECURITY DEFINER on public-facing functions
# 3. Missing RLS on new CREATE TABLE
# 4. DROP TABLE without approval comment
#
# Requires: jq
# See: CLAUDE.md "Safety Rules for SQL (Boardy Enforced)"

set -e

HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
AUDIT_LOG="${HOOK_DIR}/audit.log"
TIMESTAMP="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

# Read JSON from stdin
INPUT="$(cat)"

TOOL_NAME="$(printf '%s' "$INPUT" | jq -r '.tool_name // empty')"
COMMAND="$(printf '%s' "$INPUT" | jq -r '.tool_input.command // empty')"

# Only process Bash tool calls that contain SQL
if [ "$TOOL_NAME" != "Bash" ] || [ -z "$COMMAND" ]; then
  exit 0
fi

# Quick check: does this command contain SQL-like content?
HAS_SQL=0
printf '%s' "$COMMAND" | grep -qiE '(CREATE[[:space:]]+TABLE|ALTER[[:space:]]+TABLE|DROP[[:space:]]+TABLE|INSERT[[:space:]]+INTO|CREATE[[:space:]]+FUNCTION|BEGIN;|psql|supabase[[:space:]]+db)' && HAS_SQL=1

if [ "$HAS_SQL" -eq 0 ]; then
  exit 0
fi

log_block() {
  reason="$1"
  printf '%s | SQL-BLOCK | %s | %s\n' "$TIMESTAMP" "$reason" "$COMMAND" >> "$AUDIT_LOG" 2>/dev/null || true
  printf '[BOARDY] %s\n' "$reason" >&2
  exit 2
}

# --- Check 1: Migration SQL must have BEGIN/COMMIT ---
# If command contains CREATE TABLE, ALTER TABLE, or DROP TABLE, it should be wrapped
if printf '%s' "$COMMAND" | grep -qiE '(CREATE[[:space:]]+TABLE|ALTER[[:space:]]+TABLE|DROP[[:space:]]+TABLE)'; then
  if ! printf '%s' "$COMMAND" | grep -qiE 'BEGIN'; then
    log_block "Migration SQL missing BEGIN/COMMIT transaction wrapper. Boardy says: wrap it or walk."
  fi
  if ! printf '%s' "$COMMAND" | grep -qiE 'COMMIT'; then
    log_block "Migration SQL missing COMMIT. Every migration needs BEGIN + COMMIT."
  fi
fi

# --- Check 2: SECURITY DEFINER on functions ---
if printf '%s' "$COMMAND" | grep -qiE 'SECURITY[[:space:]]+DEFINER'; then
  log_block "SECURITY DEFINER detected. Never use on public-facing functions. Use SECURITY INVOKER instead."
fi

# --- Check 3: CREATE TABLE without RLS ---
if printf '%s' "$COMMAND" | grep -qiE 'CREATE[[:space:]]+TABLE'; then
  if ! printf '%s' "$COMMAND" | grep -qiE 'ALTER[[:space:]]+TABLE.*ENABLE[[:space:]]+ROW[[:space:]]+LEVEL[[:space:]]+SECURITY'; then
    if ! printf '%s' "$COMMAND" | grep -qiE 'ENABLE[[:space:]]+ROW[[:space:]]+LEVEL[[:space:]]+SECURITY'; then
      log_block "CREATE TABLE without ENABLE ROW LEVEL SECURITY. Boardy requires RLS on every table."
    fi
  fi
fi

# --- Check 4: DROP TABLE without approval comment ---
if printf '%s' "$COMMAND" | grep -qiE 'DROP[[:space:]]+TABLE'; then
  if ! printf '%s' "$COMMAND" | grep -qiE '--[[:space:]]*APPROVED|--[[:space:]]*approved|--[[:space:]]*boardy-approved'; then
    log_block "DROP TABLE without approval comment (-- APPROVED or -- boardy-approved required)."
  fi
fi

# All checks passed
printf '%s | SQL-ALLOW | Passed Boardy checks | %s\n' "$TIMESTAMP" "$COMMAND" >> "$AUDIT_LOG" 2>/dev/null || true
exit 0

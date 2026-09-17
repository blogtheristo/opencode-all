#!/bin/sh
# DWS6 Claude Code Hook: Decision Log — Rule 5 Audit (Model for Judgment Only)
# PostToolUse hook: logs agent decision patterns for weekly audit against Rule 5.
# Detects: model inference calls, routing logic, retry patterns, deterministic transforms.
#
# Code-Version: 1.0
# Date: 2026-09-03
# Branch: claude/ai-software-engineering-krt01q
# Owner: Lifetime Oy
#
# Input: JSON from Claude Code PostToolUse payload
# Output: JSONL to .claude/hooks/audit/decision-log.json (gitignored)
# Fail-open: never traps a session. Telemetry failures are silent.
#
# Format of logged entries:
#   {"ts":"2026-09-03T10:15:00Z","tool":"Bash","cmd_sample":"git status","category":"routine","context_hash":"abc123"}
#
# Categories:
#   "judgment"   — classification, drafting, summary, extraction (model should decide)
#   "transform"  — parsing, formatting, deterministic text processing (code should handle)
#   "routing"    — conditional branching, decision logic (code should handle)
#   "routine"    — inspection, listing, simple read-only operations (neutral)
#   "unknown"    — unable to categorize

set -uo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || true)
[ -z "${REPO_ROOT:-}" ] && exit 0
cd "$REPO_ROOT" 2>/dev/null || exit 0

HOOK_DIR="${REPO_ROOT}/.claude/hooks"
AUDIT_DIR="${HOOK_DIR}/audit"
LOG_FILE="${AUDIT_DIR}/decision-log.json"
TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

mkdir -p "$AUDIT_DIR" 2>/dev/null || true

# Read input from stdin (Claude Code PostToolUse JSON payload)
HOOK_INPUT=""
if [ ! -t 0 ]; then
  HOOK_INPUT=$(cat 2>/dev/null || true)
fi
[ -z "$HOOK_INPUT" ] && exit 0

# Extract field from JSON using jq, fallback to grep/sed if jq unavailable
extract_json() {
  key="$1"
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$HOOK_INPUT" | jq -r ".${key} // empty" 2>/dev/null || printf ''
  else
    printf '%s' "$HOOK_INPUT" | sed -n "s/.*\"${key}\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -1 || printf ''
  fi
}

TOOL_NAME=$(extract_json "tool_name")
[ -z "$TOOL_NAME" ] && exit 0

# Only log Bash tool use (primary decision pattern surface)
[ "$TOOL_NAME" != "Bash" ] && exit 0

TOOL_INPUT=$(extract_json "tool_input.command")
TOOL_OUTPUT=$(extract_json "tool_output" | head -c 500)  # First 500 chars
[ -z "$TOOL_INPUT" ] && exit 0

# Categorize decision type based on command pattern analysis
categorize_decision() {
  cmd="$1"

  # Extract the command (first token, stripped of leading whitespace)
  first_cmd=$(printf '%s' "$cmd" | sed 's/^[[:space:]]*//; s/[[:space:]].*//')

  # Judgment patterns: classification, drafting, summarization, extraction
  # These should be delegated to the model; if found in Bash, it's likely a misuse
  printf '%s' "$cmd" | grep -qi 'classify\|extract\|summarize\|draft\|analyze\|categorize' && printf 'judgment' && return 0

  # Transform patterns: text processing, parsing, formatting, data conversion
  case "$first_cmd" in
    jq|sed|awk|cut|tr|python|node|npm|npx) printf 'transform' && return 0 ;;
  esac

  # Routing patterns: conditional execution, decision logic
  printf '%s' "$cmd" | grep -qi 'if.*then\|case.*in\|while\|test.*-[a-z]\|&&\|||' && printf 'routing' && return 0

  # Retry patterns: repeated execution, loop attempts
  printf '%s' "$cmd" | grep -qi 'retry\|retry=\|attempt\|repeat\|until\|loop' && printf 'routing' && return 0

  # Routine patterns: inspection, listing, simple read-only operations
  case "$first_cmd" in
    ls|pwd|find|grep|cat|head|tail|wc|du|df|file|which|type|git|git\ \ log) printf 'routine' && return 0 ;;
  esac

  printf 'unknown'
}

CATEGORY=$(categorize_decision "$TOOL_INPUT")

# Generate a simple hash of the command for deduplication (first 12 chars of sha256)
CONTEXT_HASH=""
if command -v sha256sum >/dev/null 2>&1; then
  CONTEXT_HASH=$(printf '%s' "$TOOL_INPUT" | sha256sum | cut -c1-12)
elif command -v shasum >/dev/null 2>&1; then
  CONTEXT_HASH=$(printf '%s' "$TOOL_INPUT" | shasum -a 256 | cut -c1-12)
elif command -v python3 >/dev/null 2>&1; then
  CONTEXT_HASH=$(printf '%s' "$TOOL_INPUT" | python3 -c 'import hashlib, sys; print(hashlib.sha256(sys.stdin.buffer.read()).hexdigest()[:12])')
else
  CONTEXT_HASH="unknown"
fi

# Truncate command sample to 100 chars for log readability
CMD_SAMPLE=$(printf '%s' "$TOOL_INPUT" | head -c 100 | sed 's/"/\\"/g')

# Build JSONL entry (compact, one line per entry)
LOG_ENTRY="{\"ts\":\"${TIMESTAMP}\",\"tool\":\"${TOOL_NAME}\",\"cmd_sample\":\"${CMD_SAMPLE}\",\"category\":\"${CATEGORY}\",\"context_hash\":\"${CONTEXT_HASH}\"}"

# Append to log (fail-open: if write fails, continue anyway)
printf '%s\n' "$LOG_ENTRY" >> "$LOG_FILE" 2>/dev/null || true

exit 0

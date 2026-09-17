#!/bin/bash
# Stop hook — record this session's Claude-side token usage.
#
# Closes Open Item 5 of docs/field-notes/2026-07-26-ollama-boss-cost-architecture.md
# ("add a real Claude-side token/call log"). Until this existed, DWS could not
# state its own cost per completed task: the command logs under
# .claude/hooks/audit/ are gitignored and die with the container, and
# token_usage_events instrumented product usage only.
#
# Fail-open by design, exactly like session-stop.sh: telemetry must never trap a
# session. Every failure path exits 0.

set -uo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || true)
[ -z "${REPO_ROOT:-}" ] && exit 0
cd "$REPO_ROOT" 2>/dev/null || exit 0

# Claude Code passes the Stop payload as JSON on stdin; we need transcript_path
# and session_id from it.
HOOK_INPUT=""
if [ ! -t 0 ]; then
  HOOK_INPUT=$(cat 2>/dev/null || true)
fi
[ -z "$HOOK_INPUT" ] && exit 0

extract() {
  # $1 = key. Prefer jq; fall back to sed so a missing jq does not disable the log.
  if command -v jq >/dev/null 2>&1; then
    printf '%s' "$HOOK_INPUT" | jq -r --arg k "$1" '.[$k] // empty' 2>/dev/null
  else
    printf '%s' "$HOOK_INPUT" | sed -n "s/.*\"$1\"[[:space:]]*:[[:space:]]*\"\([^\"]*\)\".*/\1/p" | head -1
  fi
}

TRANSCRIPT=$(extract transcript_path)
SESSION_ID=$(extract session_id)

if [ -z "${TRANSCRIPT:-}" ] || [ ! -f "$TRANSCRIPT" ]; then
  # Fail loud in the transcript, not silently: a missing path means the log is
  # incomplete for this session and somebody should know why.
  echo "token-usage-record: no readable transcript_path in Stop payload — session not recorded."
  exit 0
fi

command -v node >/dev/null 2>&1 || { echo "token-usage-record: node unavailable — session not recorded."; exit 0; }

node "$REPO_ROOT/scripts/record-session-tokens.mjs" \
  --transcript "$TRANSCRIPT" \
  ${SESSION_ID:+--session "$SESSION_ID"} 2>&1 || \
  echo "token-usage-record: recorder failed — session not recorded (see output above)."

exit 0

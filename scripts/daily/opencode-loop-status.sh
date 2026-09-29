#!/usr/bin/env bash
# Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=opencode-loop-status Date=2026-09-29
# Audit trail: git log -- scripts/daily/opencode-loop-status.sh
# ============================================================================
# opencode-loop status digest — so every Claude session knows what the DGX loop is doing.
#
#   opencode-loop-status.sh           write ~/.local/state/opencode-task-loop/daily/YYYY-MM-DD.md
#                                     and daily-status.md (latest), print it (cron, 07:00)
#   opencode-loop-status.sh --print   print a live digest only (session-start hook)
#
# Read-only: reads the loop's state and specs via `opencode-task-loop.mjs --status`.
# No-op off the DGX (no loop state dir).
# ============================================================================

set -uo pipefail

REPO_DIR="${DWS6_PRIMARY:-$HOME/dws6}"
STATE_DIR="$HOME/.local/state/opencode-task-loop"
[ -d "$STATE_DIR" ] || exit 0
export PATH="$HOME/node-n/bin:$HOME/.local/bin:$PATH"

status=$(node "$REPO_DIR/scripts/opencode-task-loop.mjs" --status 2>&1) || exit 0

digest() {
  echo "## OpenCode loop (DGX) — $(date '+%Y-%m-%d %H:%M %Z')"
  echo ""
  if tmux has-session -t oc-loop 2>/dev/null; then
    echo "Loop: running (tmux oc-loop)"
  else
    echo "Loop: NOT RUNNING — start with: opencode-loop start"
  fi
  echo "Tasks: $(echo "$status" | awk '/^[a-z]+ +r[0-9]/ {print $1}' | sort | uniq -c | awk '{printf "%s %s, ", $1, $2}' | sed 's/, $//')"
  echo ""
  echo "Running / blocked / Aegis (status, round, branch, last gate or PR):"
  echo '```'
  echo "$status" | awk '
    /^[a-z]+ +r[0-9]/ { show = ($1 == "running" || $1 == "blocked" || $3 ~ /aegis/) }
    show' | head -60
  echo '```'
  echo ""
  echo "Last alerts:"
  echo '```'
  tail -n 5 "$STATE_DIR/alerts.log" 2>/dev/null | cut -c1-220
  echo '```'
  echo "Full view: opencode-loop status · live: opencode-loop log"
}

if [ "${1:-}" = "--print" ]; then
  digest
  exit 0
fi

mkdir -p "$STATE_DIR/daily"
out="$STATE_DIR/daily/$(date +%F).md"
digest >"$out"
cp "$out" "$STATE_DIR/daily-status.md"
cat "$out"

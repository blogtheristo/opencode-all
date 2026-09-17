#!/usr/bin/env bash
# clawdbot-digest.sh — Daily session backlog digest
#
# Auto-discovered by day-runner.sh (daily folder convention).
# Runs the clawdbot scanner against ~/.claude/projects/-home-user-dws6/*.jsonl,
# writes a per-day summary to logs/clawdbot-digest-<date>.json, and appends a
# one-line summary to logs/clawdbot-digest.log.
#
# What it does:
#   1. Runs `node scripts/clawdbot-scan.mjs` (idempotent — already-handled
#      sessions are skipped).
#   2. Captures the JSON output and pipes status counts.
#   3. Writes today's digest to logs/clawdbot-digest-<YYYY-MM-DD>.json.
#   4. Appends a single line to logs/clawdbot-digest.log:
#        <ts> pending=<N> queuedToday=<N> dismissed=<N> done=<N>
#
# Trust zone: GREEN — read-only over transcripts, writes confined to
# logs/ and .claude/clawdbot/.
#
# Introduced-In: clawdbot v1.1
# Code-Version: 1.0
# Date: 2026-05-12

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
TODAY=$(date -u +"%Y-%m-%d")
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DIGEST_FILE="$LOG_DIR/clawdbot-digest-$TODAY.json"
LOG_FILE="$LOG_DIR/clawdbot-digest.log"

mkdir -p "$LOG_DIR"

# Bail out cleanly if there are no transcripts yet.
if [ ! -d "$HOME/.claude/projects/-home-user-dws6" ]; then
  echo "[clawdbot-digest] No transcript dir — skipping"
  exit 0
fi

# Scan (writes queue files + updates state.json).
SCAN_JSON=$(node "$REPO_ROOT/scripts/clawdbot-scan.mjs" 2>/dev/null || echo '{"ok":false}')
STATUS_JSON=$(node "$REPO_ROOT/scripts/clawdbot-scan.mjs" --status 2>/dev/null || echo '{"ok":false}')

# Write digest file (combined).
cat > "$DIGEST_FILE" <<EOF
{
  "timestamp": "$TIMESTAMP",
  "scan": $SCAN_JSON,
  "status": $STATUS_JSON
}
EOF

# Extract counts for the log line. jq is required.
if command -v jq >/dev/null 2>&1; then
  QUEUED_TODAY=$(echo "$SCAN_JSON" | jq -r '.queued // 0')
  PENDING=$(echo "$STATUS_JSON" | jq -r '.counts.pending // 0')
  DISMISSED=$(echo "$STATUS_JSON" | jq -r '.counts.dismissed // 0')
  DONE=$(echo "$STATUS_JSON" | jq -r '.counts.done // 0')
  echo "$TIMESTAMP pending=$PENDING queuedToday=$QUEUED_TODAY dismissed=$DISMISSED done=$DONE" >> "$LOG_FILE"
  echo "[clawdbot-digest] pending=$PENDING queuedToday=$QUEUED_TODAY (logged to $LOG_FILE)"
else
  echo "$TIMESTAMP no-jq digest=$DIGEST_FILE" >> "$LOG_FILE"
  echo "[clawdbot-digest] jq not available — digest at $DIGEST_FILE"
fi

exit 0

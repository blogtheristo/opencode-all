#!/usr/bin/env bash
# Daily drift detector — DWS IQ Agent Confidence Monitor
# Auto-discovered by DGX Spark day-runner.sh (scripts/daily/)
# Runs at 04:30 UTC (after run-evals.sh at 04:00).
#
# Reads logs/agent-*.jsonl, computes rolling confidence per agent,
# finds inflection dates, writes logs/drift-reports/YYYY-MM-DD.json.
# Exits 1 if any agent has drifted beyond DRIFT_WARN_THRESHOLD (default 10%).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

echo "[detect-drift] Starting at $(date -u +%Y-%m-%dT%H:%M:%SZ)"

if [ ! -d node_modules ]; then
  npm ci --silent
fi

export DRIFT_WINDOW_DAYS="${DRIFT_WINDOW_DAYS:-7}"
export DRIFT_BASELINE_DAYS="${DRIFT_BASELINE_DAYS:-14}"
export DRIFT_WARN_THRESHOLD="${DRIFT_WARN_THRESHOLD:-0.10}"
export DRIFT_ALERT_THRESHOLD="${DRIFT_ALERT_THRESHOLD:-0.20}"
export AGENT_LOG_DIR="${AGENT_LOG_DIR:-$REPO_ROOT/logs}"

npx tsx src/evals/drift-detector.ts
EXIT_CODE=$?

echo "[detect-drift] Finished at $(date -u +%Y-%m-%dT%H:%M:%SZ) — exit $EXIT_CODE"
exit $EXIT_CODE

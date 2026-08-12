#!/usr/bin/env bash
# Daily eval runner — DWS IQ Agent Regression Suite
# Auto-discovered by DGX Spark day-runner.sh (scripts/daily/)
# Runs at 04:00 UTC. Results written to logs/eval-results/
#
# On regression (fail rate > EVAL_FAIL_THRESHOLD=20%) exits non-zero,
# which causes day-runner to emit an alert.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

cd "$REPO_ROOT"

echo "[run-evals] Starting at $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "[run-evals] Repo: $REPO_ROOT"

# Require node_modules to be present
if [ ! -d node_modules ]; then
  echo "[run-evals] node_modules missing — running npm ci"
  npm ci --silent
fi

# Run the eval harness
# EVAL_DATASET can be overridden via env; default is all known datasets
export EVAL_DATASET="${EVAL_DATASET:-compliance}"
export EVAL_LOG_DIR="${EVAL_LOG_DIR:-$REPO_ROOT/logs/eval-results}"
export EVAL_FAIL_THRESHOLD="${EVAL_FAIL_THRESHOLD:-0.20}"

npx tsx src/evals/eval-runner.ts
EXIT_CODE=$?

echo "[run-evals] Finished at $(date -u +%Y-%m-%dT%H:%M:%SZ) — exit $EXIT_CODE"
exit $EXIT_CODE

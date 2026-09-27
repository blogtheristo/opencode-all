#!/usr/bin/env bash
# Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-d-dgx-persistence Date=2026-09-27
# Audit trail: git log -- scripts/weekly/flake-detector.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
LOG_FILE="$LOG_DIR/flake-detector.log"

mkdir -p "$LOG_DIR"
cd "$REPO_ROOT"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE"; }

log "Starting three shuffled Vitest runs"
failures=0

for run_number in 1 2 3; do
  log "Starting shuffled run ${run_number}/3"
  if NODE_ENV=test npx vitest run --sequence.shuffle --reporter=verbose 2>&1 | tee -a "$LOG_FILE"; then
    log "Completed shuffled run ${run_number}/3"
  else
    failures=$((failures + 1))
    log "Shuffled run ${run_number}/3 failed"
  fi
done

if [ "$failures" -gt 0 ]; then
  log "Flake detector found failures in ${failures}/3 shuffled runs"
  exit 1
fi

log "All shuffled Vitest runs passed"

#!/usr/bin/env bash
# Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-d-dgx-persistence Date=2026-09-27
# Audit trail: git log -- scripts/weekly/dora-dashboard.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
LOG_FILE="$LOG_DIR/dora-dashboard.log"

mkdir -p "$LOG_DIR"
cd "$REPO_ROOT"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE"; }

if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
  log "DORA metrics require a full git history; refusing to run in a shallow clone"
  exit 1
fi

export GITHUB_REPOSITORY="${GITHUB_REPOSITORY:-blogtheristo/dws6}"

log "Calculating weekly DORA metrics"
npx tsx scripts/dora-metrics.ts 2>&1 | tee -a "$LOG_FILE"

if git diff --quiet -- docs/dora-dashboard.md; then
  log "DORA dashboard is unchanged"
  exit 0
fi

if [ "${DWS_DRY_RUN:-false}" = "true" ]; then
  log "Dry run complete; dashboard changes were not committed"
  exit 0
fi

git add docs/dora-dashboard.md
git config user.name "DGX Spark"
git config user.email "risto@onelifetime.world"
git commit -m "metrics: update DORA dashboard for week $(date -u +%Y-%m-%d)"

if git push origin HEAD:main; then
  printf '' > "$LOG_DIR/dora-dashboard-pending.patch"
  log "DORA dashboard committed and pushed"
else
  git format-patch -1 --stdout > "$LOG_DIR/dora-dashboard-pending.patch"
  log "Push failed; recovery patch saved to $LOG_DIR/dora-dashboard-pending.patch"
  exit 1
fi

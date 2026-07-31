#!/usr/bin/env bash
# Weekly Market Research Collection — DGX Spark weekly cron
#
# Collects competitor market data and stores in Supabase.
# Results surfaced in Morning Brief V2 section 9 (Monday).
#
# Replaces: .github/workflows/market-research-weekly.yml (schedule removed 2026-04-08)
# Requires: Python 3.11+, scripts/requirements-signals.txt
#
# Code-Version: 1.0
# Introduced-In: PR-replace-actions-with-cron
# Date: 2026-04-08
# Owner: Lifetime Oy

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/market-research.log"

mkdir -p "$LOG_DIR"
cd "$PROJECT_DIR"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE"; }

# Load environment
if [ -f .env ]; then set -a; source .env; set +a; fi

log "Starting weekly market research collection..."

# Install Python deps if needed
if ! python3 -c "import requests" 2>/dev/null; then
  log "Installing Python dependencies..."
  pip install -r scripts/requirements-signals.txt >> "$LOG_FILE" 2>&1
fi

# Run the collector (same as the GitHub Actions workflow)
python3 scripts/collect_market_research.py >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  log "Market research collection completed successfully"

  # Commit market brief if there are changes
  git add docs/market-research/ 2>/dev/null || true
  if ! git diff --quiet --cached 2>/dev/null; then
    WEEK=$(date +%Y-W%V)
    git config user.name "DGX Spark" 2>/dev/null || true
    git config user.email "risto@onelifetime.world" 2>/dev/null || true
    git commit -m "chore(market-research): weekly brief ${WEEK}" 2>/dev/null || true
    git push origin main 2>/dev/null || log "Push failed — will retry next run"
  fi
else
  log "Market research collection FAILED (exit $EXIT_CODE)"
fi

exit $EXIT_CODE

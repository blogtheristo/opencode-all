#!/usr/bin/env bash
# Weekly EU Regulatory Signal Collection — DGX Spark weekly cron
#
# Stage 1 of the sales-manager newsletter automation plan
# (docs/field-notes/2026-07-12-sales-manager-newsletter-automation-plan.md).
# Runs scripts/collect_regulatory_signals.py, which populates Supabase
# market_signals (signal_type='regulation'). Feeds the Stage 2 synthesis
# agent (not yet built) that produces docs/market-research/sales-manager.md.
#
# Mirrors scripts/weekly/market-research.sh's structure exactly.
#
# Code-Version: 1.0
# Introduced-In: sales-manager-newsletter-automation-plan
# Date: 2026-07-12
# Owner: Lifetime Oy

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/regulatory-signals.log"

mkdir -p "$LOG_DIR"
cd "$PROJECT_DIR"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE"; }

# Load environment
if [ -f .env ]; then set -a; source .env; set +a; fi

log "Starting weekly EU regulatory signal collection..."

# Install Python deps if needed (shares requirements-signals.txt with
# collect_market_research.py — feedparser was already listed there)
if ! python3 -c "import feedparser" 2>/dev/null; then
  log "Installing Python dependencies..."
  pip install -r scripts/requirements-signals.txt >> "$LOG_FILE" 2>&1
fi

python3 scripts/collect_regulatory_signals.py >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  log "Regulatory signal collection completed successfully"
else
  log "Regulatory signal collection FAILED (exit $EXIT_CODE)"
fi

exit $EXIT_CODE

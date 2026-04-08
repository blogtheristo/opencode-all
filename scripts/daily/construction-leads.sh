#!/usr/bin/env bash
# Construction Lead Scraper — DGX Spark daily cron
#
# Fetches EU construction tenders from TED API, stores in Supabase,
# and makes data available for Morning Brief V2 section 9.
#
# Replaces: .github/workflows/construction-leads.yml (schedule removed 2026-04-08)
# Requires: Python 3.12+, scripts/requirements-tenders.txt
#
# Code-Version: 1.0
# Introduced-In: PR-replace-actions-with-cron
# Date: 2026-04-08
# Owner: Lifetime Oy

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/construction-leads.log"

mkdir -p "$LOG_DIR"
cd "$PROJECT_DIR"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE"; }

# Load environment
if [ -f .env ]; then set -a; source .env; set +a; fi

# Skip weekends (Mon-Sat only, matching original workflow)
DOW=$(date +%u)
if [ "$DOW" = "7" ]; then
  log "Sunday — skipping construction leads (Mon-Sat only)"
  exit 0
fi

log "Starting construction lead scrape..."

# Install Python deps if needed
if ! python3 -c "import requests" 2>/dev/null; then
  log "Installing Python dependencies..."
  pip install -r scripts/requirements-tenders.txt >> "$LOG_FILE" 2>&1
fi

# Run the scraper (same as the GitHub Actions workflow)
python3 scripts/fetch_tenders.py --days 1 >> "$LOG_FILE" 2>&1
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  log "Construction leads scrape completed successfully"
else
  log "Construction leads scrape FAILED (exit $EXIT_CODE)"
fi

# Commit leads snapshot if there are changes
if [ -f data/leads.csv ]; then
  cp data/leads.csv data/leads.txt
  cd "$PROJECT_DIR"
  git add data/leads.txt 2>/dev/null
  if ! git diff --quiet --cached 2>/dev/null; then
    git config user.name "DGX Spark" 2>/dev/null || true
    git config user.email "risto@onelifetime.world" 2>/dev/null || true
    git commit -m "leads: update construction leads $(TZ='Europe/Helsinki' date +'%Y-%m-%d %H:%M Helsinki')" 2>/dev/null || true
    git push origin main 2>/dev/null || log "Push failed — will retry next run"
  fi
fi

exit $EXIT_CODE

#!/usr/bin/env bash
# Construction Lead Scraper — DGX Spark daily cron
#
# Fetches EU construction tenders from TED API, stores in Supabase,
# and makes data available for Morning Brief V2 section 8.
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
  SNAPSHOT_BRANCH="${CONSTRUCTION_LEADS_SNAPSHOT_BRANCH:-construction-leads-snapshots}"
  ORIGINAL_BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo main)"

  cp data/leads.csv data/leads.txt
  cd "$PROJECT_DIR"

  if git show-ref --verify --quiet "refs/heads/$SNAPSHOT_BRANCH"; then
    git checkout "$SNAPSHOT_BRANCH" >> "$LOG_FILE" 2>&1 || log "Failed to switch to snapshot branch $SNAPSHOT_BRANCH"
  else
    git checkout -b "$SNAPSHOT_BRANCH" >> "$LOG_FILE" 2>&1 || log "Failed to create snapshot branch $SNAPSHOT_BRANCH"
  fi

  git add data/leads.txt 2>/dev/null
  if ! git diff --quiet --cached 2>/dev/null; then
    git config user.name "DGX Spark" 2>/dev/null || true
    git config user.email "risto@onelifetime.world" 2>/dev/null || true
    git commit -m "leads: update construction leads $(TZ='Europe/Helsinki' date +'%Y-%m-%d %H:%M Helsinki')" 2>/dev/null || true
    git push origin "$SNAPSHOT_BRANCH" 2>/dev/null || log "Push failed for $SNAPSHOT_BRANCH — will retry next run"
  fi

  if [ "$ORIGINAL_BRANCH" != "$SNAPSHOT_BRANCH" ]; then
    git checkout "$ORIGINAL_BRANCH" >> "$LOG_FILE" 2>&1 || log "Failed to switch back to $ORIGINAL_BRANCH"
  fi
fi

exit $EXIT_CODE

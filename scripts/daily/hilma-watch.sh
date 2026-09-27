#!/usr/bin/env bash
# Evidence: Tool=Claude Code Model=claude-opus-5 Agent=sales-outreach Date=2026-09-22
# Audit trail: git log -- scripts/weekly/hilma-watch.sh
#
# Daily Hilma tender scan -> Supabase -> Sales Mission Control.
#
# Auto-discovered by infrastructure/dgx-spark/day-runner.sh (scripts/daily/*.sh,
# ~03-06:00 UTC window), so the Sales Centre lane is current each morning.
# Registering it here is the whole schedule — there is no cron-runner.ts entry,
# and there must not be: the cron container is node:24-slim with no Chromium,
# and hilma-watch drives Playwright. This runs on the DGX HOST.
#
# Daily, not weekly (HIC 2026-09-22): Finnish national tenders can carry response
# windows as short as two weeks, so a 7-day scan gap could burn half of one. The
# run is idempotent — upsert on notice_url, HIC triage preserved — so re-scanning
# the same notices daily costs a Chromium run on free local compute and nothing else.
#
# Requires on the host: Chromium/Playwright, SUPABASE_URL, SUPABASE_SERVICE_KEY.
#
# Code-Version: 1.1
# Date: 2026-09-22
# Owner: Lifetime Oy

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SKILL_DIR="$PROJECT_DIR/skills/hilma-watch"
LOG_DIR="$PROJECT_DIR/logs"
LOG_FILE="$LOG_DIR/hilma-watch.log"

mkdir -p "$LOG_DIR"
cd "$PROJECT_DIR"

log() { echo "[$(date -Iseconds)] $*" | tee -a "$LOG_FILE"; }

# Hilma publishes on business days; a Sunday run would re-scan Saturday's set.
# Mon-Sat, matching scripts/daily/construction-leads.sh.
if [ "$(date -u +%u)" = "7" ]; then
  log "Sunday — skipping Hilma scan (Mon-Sat only)."
  exit 0
fi

# Load environment (never echoed — the keys stay in the process env only).
if [ -f .env ]; then set -a; source .env; set +a; fi

if [ -z "${SUPABASE_URL:-}" ] || [ -z "${SUPABASE_SERVICE_KEY:-}" ]; then
  log "ABORT: SUPABASE_URL / SUPABASE_SERVICE_KEY not set — cannot sync. Fix .env on the host."
  exit 2
fi

# Playwright resolves via the global module on the DGX host.
if [ ! -e "$SKILL_DIR/node_modules" ] && [ -d /opt/node22/lib/node_modules ]; then
  ln -sfn /opt/node22/lib/node_modules "$SKILL_DIR/node_modules"
  log "Linked global node_modules for Playwright resolution."
fi

cd "$SKILL_DIR"

log "Scanning Hilma (hankintailmoitukset.fi)..."
node hilma-watch.mjs --top 40 >> "$LOG_FILE" 2>&1
SCAN_EXIT=$?

# Exit 3 = hard failure (host blocked / zero notices). Do NOT sync: a blocked scan
# must not be reported as "no tenders", and must not overwrite a good prior sync.
if [ $SCAN_EXIT -ne 0 ]; then
  log "SCAN FAILED (exit $SCAN_EXIT) — skipping sync. See $LOG_FILE. Hilma may be unreachable from this host."
  exit $SCAN_EXIT
fi

log "Syncing results into hilma_tenders..."
node sync-to-supabase.mjs >> "$LOG_FILE" 2>&1
SYNC_EXIT=$?

if [ $SYNC_EXIT -eq 0 ]; then
  log "Hilma weekly scan + sync OK. Triage in Mission Control -> Sales Centre."
else
  # The sync refuses (exit 3) on a partial run or zero notices — by design.
  log "SYNC FAILED (exit $SYNC_EXIT) — lane keeps last week's rows. See $LOG_FILE."
fi

exit $SYNC_EXIT

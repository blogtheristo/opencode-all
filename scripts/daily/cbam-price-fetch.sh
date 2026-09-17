#!/usr/bin/env bash
# ============================================================================
# Daily CBAM Certificate Price Refresh
#
# Writes config/cbam-price.json with the latest EU ETS carbon price.
# Used by src/compliance/ember-carbon-price.ts as a file-cache tier so that
# the Node.js server has a recent price after restarts without making a live
# API call on every cold boot.
#
# Source cascade (first success wins):
#   1. EMBER Climate API (CC BY 4.0, no key)
#   2. ECB Statistical Data Warehouse (free, delayed ~1 day)
#   3. Exit non-zero — leaves existing file untouched
#
# Runs once per day via DGX Spark day-runner. Never auto-commits.
#
# Code-Version: 1.0
# Date: 2026-05-10
# Owner: Lifetime Oy
# ============================================================================

set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/admin100/dws6}"
OUT="${REPO_DIR}/config/cbam-price.json"
EMBER_URL="https://api.ember-climate.org/v1/carbon-price/eu-ets/latest"
ECB_URL="https://data-api.ecb.europa.eu/service/data/ETS/D.EU.1.0000.EUR?format=csvdata&lastNObservations=1"

log() { echo "[CBAM-PRICE] $*"; }

fetch_ember() {
  local raw
  raw="$(curl -sS --max-time 15 -H 'Accept: application/json' "$EMBER_URL" 2>/dev/null)" || return 1
  local price date
  price="$(echo "$raw" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['price'])" 2>/dev/null)" || return 1
  date="$(echo "$raw" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['date'])" 2>/dev/null)" || return 1
  [[ -z "${price:-}" || "${price:-}" == "null" ]] && return 1
  echo "${price}|${date}|ember-live"
}

fetch_ecb() {
  local csv price
  csv="$(curl -sS --max-time 15 -H 'Accept: text/csv' "$ECB_URL" 2>/dev/null)" || return 1
  # OBS_VALUE column — last numeric field in the last data line
  price="$(echo "$csv" | awk -F',' 'NR>1 && NF>0 { for(i=NF;i>=1;i--) { if($i~/^[0-9]+\.?[0-9]*$/) { print $i; exit } } }' | tail -1)" || return 1
  [[ -z "${price:-}" ]] && return 1
  local today
  today="$(date -u +%Y-%m-%d)"
  echo "${price}|${today}|ecb-sdw"
}

# ---- main ----

cd "$REPO_DIR"

log "Fetching EU ETS carbon price..."

RESULT=""
if RESULT="$(fetch_ember)"; then
  log "EMBER API: ${RESULT%%|*} EUR/tCO2e"
elif RESULT="$(fetch_ecb)"; then
  log "ECB SDW fallback: ${RESULT%%|*} EUR/tCO2e"
else
  log "All sources failed — keeping existing file" >&2
  exit 1
fi

PRICE="${RESULT%%|*}"
REST="${RESULT#*|}"
DATE="${REST%%|*}"
SOURCE="${REST##*|}"
FETCHED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
VALID_UNTIL="$(date -u -d '+26 hours' +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -v+26H +%Y-%m-%dT%H:%M:%SZ)"

cat > "$OUT" <<JSON
{
  "\$comment": "CBAM certificate price cache. Written daily by scripts/daily/cbam-price-fetch.sh. Read by src/compliance/ember-carbon-price.ts. Do not edit manually.",
  "priceEur": ${PRICE},
  "date": "${DATE}",
  "source": "${SOURCE}",
  "fetchedAt": "${FETCHED_AT}",
  "validUntil": "${VALID_UNTIL}"
}
JSON

log "Wrote ${PRICE} EUR/tCO2e (${DATE}, source: ${SOURCE}) → config/cbam-price.json"

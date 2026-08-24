#!/usr/bin/env bash
# ============================================================================
# Daily FX Rate Refresh — ECB Euro reference rates
#
# Writes dws10.com/shared-assets/fx-rates.json (+ landing-pages mirror) with
# the latest ECB daily reference rate for USD/GBP/SEK/NOK/DKK/CHF/JPY against
# the euro. Used by vat-locale.js on store pages to display USD etc.
#
# Runs once per day via day-runner. Never auto-commits — writes the file,
# leaves it for the normal commit flow. If the fetch fails, leaves the
# existing file untouched and exits non-zero.
#
# Code-Version: 1.0.0
# Date: 2026-04-16
# Owner: DWS Team
# ============================================================================

set -euo pipefail

REPO_DIR="${REPO_DIR:-/home/admin100/dws6}"
SRC_OUT="${REPO_DIR}/dws10.com/shared-assets/fx-rates.json"
MIRROR_OUT="${REPO_DIR}/landing-pages/dws10-com/shared-assets/fx-rates.json"
ECB_URL="https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/eurofxref-daily.xml"
TMP_XML="$(mktemp -t ecb-fx-XXXXXX.xml)"

trap 'rm -f "$TMP_XML"' EXIT

cd "$REPO_DIR"

echo "[FX-REFRESH] Fetching ECB daily reference rates..."
if ! curl -sS --max-time 20 -o "$TMP_XML" "$ECB_URL"; then
  echo "[FX-REFRESH] ECB fetch failed — keeping existing rates" >&2
  exit 1
fi

if [[ ! -s "$TMP_XML" ]]; then
  echo "[FX-REFRESH] ECB returned empty body — keeping existing rates" >&2
  exit 1
fi

rates_as_of="$(grep -oE 'time="[0-9]{4}-[0-9]{2}-[0-9]{2}"' "$TMP_XML" | head -1 | sed 's/time="//;s/"//')"
fetched_at="$(date -u +%Y-%m-%d)"

extract() {
  local code="$1"
  grep -oE "currency=\"${code}\"[[:space:]]+rate=\"[0-9.]+\"" "$TMP_XML" \
    | grep -oE 'rate="[0-9.]+"' | head -1 | sed 's/rate="//;s/"//'
}

usd="$(extract USD)"; gbp="$(extract GBP)"; sek="$(extract SEK)"
nok="$(extract NOK)"; dkk="$(extract DKK)"; chf="$(extract CHF)"
jpy="$(extract JPY)"

if [[ -z "${usd:-}" ]]; then
  echo "[FX-REFRESH] Could not parse USD from ECB XML — keeping existing rates" >&2
  exit 1
fi

cat > "$SRC_OUT" <<JSON
{
  "\$comment": "DWS Store FX rates. Base currency EUR. Refreshed daily by scripts/daily/update-fx-rates.sh from ECB Euro reference rates. If source is stale, store falls back to values below and displays a 'rates may be out of date' notice after 48h.",
  "base": "EUR",
  "source": "ECB Euro reference exchange rates",
  "sourceUrl": "${ECB_URL}",
  "fetchedAt": "${fetched_at}",
  "ratesAsOf": "${rates_as_of}",
  "rates": {
    "USD": ${usd},
    "GBP": ${gbp:-null},
    "SEK": ${sek:-null},
    "NOK": ${nok:-null},
    "DKK": ${dkk:-null},
    "CHF": ${chf:-null},
    "JPY": ${jpy:-null}
  }
}
JSON

cp "$SRC_OUT" "$MIRROR_OUT"
echo "[FX-REFRESH] wrote rates for ${rates_as_of} (EUR->USD=${usd})"

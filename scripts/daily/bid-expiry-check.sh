#!/usr/bin/env bash
# Evidence: Tool=Claude-Code Model=claude-sonnet-4-6 Agent=claude-code Date=2026-08-29
# Audit trail: git log -- scripts/daily/bid-expiry-check.sh
#
# Scans contracts/offers/ for offers expiring within 7 days.
# Outputs a JSON report to stdout and exits non-zero if any are critical.
# Run daily via DGX Spark cron.

set -euo pipefail

OFFERS_DIR="${REPO_ROOT:-$(git rev-parse --show-toplevel)}/contracts/offers"
THRESHOLD_DAYS="${EXPIRY_THRESHOLD_DAYS:-7}"
now_epoch=$(date +%s)
threshold_epoch=$(( now_epoch + THRESHOLD_DAYS * 86400 ))

critical=0
results='[]'

if [[ ! -d "$OFFERS_DIR" ]]; then
  echo '{"status":"NO_OFFERS_DIR","offers":[]}'
  exit 0
fi

for file in "$OFFERS_DIR"/*.json; do
  [[ -e "$file" ]] || continue

  status=$(node -e "const f=require('fs').readFileSync('$file','utf8'); const d=JSON.parse(f); process.stdout.write(d.status||'');" 2>/dev/null)
  # Skip already-terminal offers
  case "$status" in EXPIRED|ARCHIVED|CANCELLED|REJECTED) continue ;; esac

  valid_until=$(node -e "const f=require('fs').readFileSync('$file','utf8'); const d=JSON.parse(f); process.stdout.write(d.timeline?.valid_until||'');" 2>/dev/null)
  [[ -z "$valid_until" ]] && continue

  expiry_epoch=$(date -d "$valid_until" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%SZ" "$valid_until" +%s 2>/dev/null || echo 0)
  [[ "$expiry_epoch" -eq 0 ]] && continue

  days_left=$(( (expiry_epoch - now_epoch) / 86400 ))

  if [[ "$expiry_epoch" -le "$threshold_epoch" ]]; then
    offer_id=$(node -e "const f=require('fs').readFileSync('$file','utf8'); const d=JSON.parse(f); process.stdout.write(d.id||'');" 2>/dev/null)
    customer=$(node -e "const f=require('fs').readFileSync('$file','utf8'); const d=JSON.parse(f); process.stdout.write(d.customer_name||'');" 2>/dev/null)
    total=$(node -e "const f=require('fs').readFileSync('$file','utf8'); const d=JSON.parse(f); process.stdout.write(String(d.total_value||0));" 2>/dev/null)

    severity="WARNING"
    [[ "$days_left" -le 2 ]] && severity="CRITICAL" && critical=$(( critical + 1 ))
    [[ "$expiry_epoch" -lt "$now_epoch" ]] && severity="OVERDUE" && critical=$(( critical + 1 ))

    entry=$(printf '{"id":"%s","customer":"%s","total_value":%s,"days_left":%d,"valid_until":"%s","severity":"%s","file":"%s"}' \
      "$offer_id" "$customer" "$total" "$days_left" "$valid_until" "$severity" "$(basename "$file")")
    results=$(node -e "const r=JSON.parse('$results'); r.push($entry); process.stdout.write(JSON.stringify(r));")
    echo "[$severity] $offer_id — $customer — expires $valid_until (${days_left}d)" >&2
  fi
done

count=$(node -e "process.stdout.write(String(JSON.parse('$results').length))")
echo "{\"status\":\"OK\",\"scanned_at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"threshold_days\":$THRESHOLD_DAYS,\"expiring_count\":$count,\"critical_count\":$critical,\"offers\":$results}"

[[ "$critical" -gt 0 ]] && exit 1 || exit 0

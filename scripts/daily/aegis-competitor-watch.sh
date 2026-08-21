#!/usr/bin/env bash
# aegis-competitor-watch.sh — Daily Aegis Competitor Intelligence Scanner
#
# Code-Version: 1.0
# Introduced-In: PR-TBD
# Branch: claude/competitor-monitoring-cron-ilQd9
# Date: 2026-04-05
# Owner: Lifetime Oy
#
# Auto-discovered by day-runner.sh (scripts/daily/ convention).
# Scans Google News RSS for competitor moves into EU AI governance
# territory — Palantir, Helsing, Rheinmetall software division.
#
# Context: Aegis has a 12–18 month window before these competitors
# ship a compliant EU-sovereign product. Daily watch surfaces:
#   - Product launches (EU AI Act compliance, sovereign deployment)
#   - EU contracts / government pilots
#   - Acquisitions / partnerships in EU defense-tech
#   - Hiring signals (compliance, policy, EU public sector)
#
# Output:
#   - logs/competitor-watch/raw-<date>.jsonl        — all hits
#   - logs/competitor-watch/alerts-<date>.jsonl     — scored alerts
#   - logs/competitor-watch/summary-<date>.json     — daily summary
#   - kb/raw/_inbox.md                              — appended for KB agent
#
# Dependencies: curl, jq (optional)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs/competitor-watch"
KB_INBOX="$REPO_ROOT/kb/raw/_inbox.md"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE_STAMP=$(date -u +"%Y-%m-%d")

mkdir -p "$LOG_DIR"

# ============ CONFIGURATION ============

# Competitors tracked daily (Aegis EU AI governance watch)
COMPETITORS=("Palantir" "Helsing" "Rheinmetall")

# Query modifiers targeting EU AI governance / sovereignty moves
QUERY_MODIFIERS=(
  "EU+AI+Act"
  "EU+sovereign"
  "EU+compliance"
  "AI+governance+Europe"
  "defense+AI+EU"
  "European+Commission"
  "NATO+AI"
  "GDPR+sovereign"
  "EU+contract"
  "EU+partnership"
)

# High-signal keywords that boost cascade score
SIGNAL_KEYWORDS=(
  "sovereign" "EU AI Act" "compliance" "governance" "contract"
  "pilot" "launch" "partnership" "acquisition" "Brussels"
  "GDPR" "defense" "procurement" "Bundeswehr" "NATO"
  "European Commission" "DG CONNECT" "DG DEFIS"
)

ALERT_THRESHOLD=30

# ============ SCAN ============

echo "[aegis-competitor-watch] $TIMESTAMP — Starting competitor scan"

RAW_FILE="$LOG_DIR/raw-$DATE_STAMP.jsonl"
ALERTS_FILE="$LOG_DIR/alerts-$DATE_STAMP.jsonl"
: > "$RAW_FILE"
: > "$ALERTS_FILE"

fetch_competitor_hits() {
  local competitor="$1"
  local modifier="$2"
  local query="${competitor}+${modifier}"
  local url="https://news.google.com/rss/search?q=${query}+when:1d&hl=en&gl=EU&ceid=EU:en"

  local result
  result=$(curl -sf --max-time 15 "$url" 2>/dev/null || echo "")

  if [ -z "$result" ]; then
    echo "[aegis-competitor-watch] WARN: No results for $competitor / $modifier"
    return
  fi

  echo "$result" | grep -oP '<title>\K[^<]+' | while IFS= read -r title; do
    if [[ "$title" == "Google News" ]] || [[ "$title" == *"Google News"* ]]; then
      continue
    fi

    # Score: base 10 for competitor hit, +10 per signal keyword
    local score=10
    local matched_signals=""
    for kw in "${SIGNAL_KEYWORDS[@]}"; do
      if echo "$title" | grep -qi "$kw"; then
        score=$((score + 10))
        matched_signals="${matched_signals:+$matched_signals|}$kw"
      fi
    done

    local safe_title
    safe_title=$(echo "$title" | sed 's/"/\\"/g' | head -c 240)

    printf '{"timestamp":"%s","competitor":"%s","query":"%s","title":"%s","signals":"%s","score":%d}\n' \
      "$TIMESTAMP" "$competitor" "$modifier" "$safe_title" "$matched_signals" "$score" \
      >> "$RAW_FILE"

    if [ "$score" -ge "$ALERT_THRESHOLD" ]; then
      printf '{"timestamp":"%s","alert":"COMPETITOR_EU_MOVE","competitor":"%s","title":"%s","score":%d,"signals":"%s","action":"Review Aegis roadmap vs this move"}\n' \
        "$TIMESTAMP" "$competitor" "$safe_title" "$score" "$matched_signals" \
        >> "$ALERTS_FILE"
      echo "[aegis-competitor-watch] ALERT ($competitor, score=$score): $title"
    fi
  done
}

for competitor in "${COMPETITORS[@]}"; do
  for modifier in "${QUERY_MODIFIERS[@]}"; do
    fetch_competitor_hits "$competitor" "$modifier"
    sleep 2
  done
done

# ============ SUMMARY ============

RAW_COUNT=$(wc -l < "$RAW_FILE" | tr -d ' ')
ALERT_COUNT=$(wc -l < "$ALERTS_FILE" | tr -d ' ')

cat > "$LOG_DIR/summary-$DATE_STAMP.json" << EOF
{
  "date": "$DATE_STAMP",
  "timestamp": "$TIMESTAMP",
  "product": "Aegis",
  "window_months": "12-18",
  "competitors": ["Palantir", "Helsing", "Rheinmetall"],
  "hits_scanned": $RAW_COUNT,
  "alerts_generated": $ALERT_COUNT,
  "alert_threshold": $ALERT_THRESHOLD,
  "status": "completed"
}
EOF

# ============ FEED KB INBOX ============

if [ "$ALERT_COUNT" -gt 0 ] && [ -f "$KB_INBOX" ]; then
  {
    echo ""
    echo "## Aegis Competitor Watch — $DATE_STAMP"
    echo ""
    echo "**Source:** \`scripts/daily/aegis-competitor-watch.sh\`  "
    echo "**Alerts:** $ALERT_COUNT / $RAW_COUNT hits  "
    echo "**Tracking:** Palantir, Helsing, Rheinmetall software → EU AI governance  "
    echo "**Strategic context:** 12–18 month window before competitors ship EU-sovereign product."
    echo ""
    while IFS= read -r alert; do
      local_title=$(echo "$alert" | sed -n 's/.*"title":"\([^"]*\)".*/\1/p')
      local_comp=$(echo "$alert" | sed -n 's/.*"competitor":"\([^"]*\)".*/\1/p')
      local_score=$(echo "$alert" | sed -n 's/.*"score":\([0-9]*\).*/\1/p')
      local_signals=$(echo "$alert" | sed -n 's/.*"signals":"\([^"]*\)".*/\1/p')
      echo "- **[$local_comp, score=$local_score]** $local_title"
      if [ -n "$local_signals" ]; then
        echo "  - signals: \`$local_signals\`"
      fi
    done < "$ALERTS_FILE"
    echo ""
    echo "→ File under \`kb/wiki/competitive-intel/aegis-eu-ai-governance.md\` on next KB compile."
    echo ""
    echo "---"
  } >> "$KB_INBOX"
  echo "[aegis-competitor-watch] Appended $ALERT_COUNT alerts to $KB_INBOX"
fi

echo "[aegis-competitor-watch] $TIMESTAMP — Scan complete: $RAW_COUNT hits, $ALERT_COUNT alerts"
echo "[aegis-competitor-watch] Logs: $LOG_DIR/"

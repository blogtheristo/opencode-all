#!/usr/bin/env bash
# news-to-signal.sh — Nordic Industrial Incident Signal Scanner
#
# Code-Version: 1.0
# Introduced-In: PR-TBD
# Branch: claude/lime-industry-dual-use-TuuoA
# Date: 2026-03-30
# Owner: Lifetime Oy
#
# Auto-discovered by day-runner.sh (scripts/daily/ convention)
# Scans Nordic news feeds for industrial incidents and runs them
# through the cross-vertical signal chain.
#
# Output: JSON alerts to logs/news-signals/ when cascade score > threshold
# Dependencies: curl, node/npx (for signal scoring)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs/news-signals"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
DATE_STAMP=$(date -u +"%Y-%m-%d")

mkdir -p "$LOG_DIR"

# ============ CONFIGURATION ============

# Keywords that indicate dual-use/critical infrastructure incidents
KEYWORDS=(
  "fire+factory+finland"
  "fire+industrial+nordic"
  "sabotage+infrastructure+europe"
  "explosion+chemical+plant+EU"
  "cyberattack+industrial+control"
  "power+outage+grid+attack"
  "lime+limestone+nordkalk"
  "steel+plant+disruption"
  "cement+factory+incident"
  "critical+infrastructure+incident"
)

# Industries in the cross-vertical signal chain
SIGNAL_INDUSTRIES=("lime" "steel" "cement" "chemicals" "energy" "construction" "aluminium" "fertilizers")

# Minimum cascade score to generate alert (0-100)
ALERT_THRESHOLD=30

# ============ NEWS INGESTION ============

echo "[news-to-signal] $TIMESTAMP — Starting Nordic industrial incident scan"

INCIDENTS_FILE="$LOG_DIR/raw-incidents-$DATE_STAMP.jsonl"
ALERTS_FILE="$LOG_DIR/alerts-$DATE_STAMP.jsonl"

# Fetch from RSS/news sources (graceful failure per source)
fetch_incidents() {
  local query="$1"
  local source="$2"

  # Use Google News RSS as aggregator (no API key needed)
  local url="https://news.google.com/rss/search?q=${query}+when:7d&hl=en&gl=FI&ceid=FI:en"

  local result
  result=$(curl -sf --max-time 15 "$url" 2>/dev/null || echo "")

  if [ -z "$result" ]; then
    echo "[news-to-signal] WARN: No results from $source for query: $query"
    return
  fi

  # Extract titles and links from RSS XML (basic parsing — no jq needed for XML)
  echo "$result" | grep -oP '<title>\K[^<]+' | while IFS= read -r title; do
    # Skip the feed title itself
    if [[ "$title" == "Google News" ]] || [[ "$title" == *"Google"* ]]; then
      continue
    fi

    # Score the incident against signal industries
    local industry_match=""
    local match_count=0

    for industry in "${SIGNAL_INDUSTRIES[@]}"; do
      if echo "$title" | grep -qi "$industry"; then
        industry_match="${industry_match:+$industry_match,}$industry"
        match_count=$((match_count + 1))
      fi
    done

    # Check for dual-use keywords
    local dual_use=false
    for kw in "fire" "sabotage" "explosion" "attack" "disruption" "outage" "breach"; do
      if echo "$title" | grep -qi "$kw"; then
        dual_use=true
        break
      fi
    done

    # Calculate cascade score
    # Base: 10 per industry match, +20 if dual-use keyword, +15 if multiple industries
    local score=$((match_count * 10))
    if [ "$dual_use" = true ]; then
      score=$((score + 20))
    fi
    if [ "$match_count" -gt 1 ]; then
      score=$((score + 15))
    fi

    # Write to raw incidents log
    printf '{"timestamp":"%s","title":"%s","source":"%s","industries":"%s","dual_use":%s,"cascade_score":%d}\n' \
      "$TIMESTAMP" \
      "$(echo "$title" | sed 's/"/\\"/g' | head -c 200)" \
      "$source" \
      "$industry_match" \
      "$dual_use" \
      "$score" >> "$INCIDENTS_FILE"

    # Generate alert if above threshold
    if [ "$score" -ge "$ALERT_THRESHOLD" ]; then
      printf '{"timestamp":"%s","alert":"CROSS_VERTICAL_SIGNAL","title":"%s","cascade_score":%d,"industries":"%s","dual_use":%s,"action":"Run cross-vertical simulation for affected industries"}\n' \
        "$TIMESTAMP" \
        "$(echo "$title" | sed 's/"/\\"/g' | head -c 200)" \
        "$score" \
        "$industry_match" \
        "$dual_use" >> "$ALERTS_FILE"

      echo "[news-to-signal] ALERT (score=$score): $title"
    fi
  done
}

# ============ MAIN SCAN ============

for keyword in "${KEYWORDS[@]}"; do
  fetch_incidents "$keyword" "google-news-rss"
  # Rate limit: 2 seconds between requests
  sleep 2
done

# ============ SUMMARY ============

INCIDENT_COUNT=0
ALERT_COUNT=0

if [ -f "$INCIDENTS_FILE" ]; then
  INCIDENT_COUNT=$(wc -l < "$INCIDENTS_FILE")
fi

if [ -f "$ALERTS_FILE" ]; then
  ALERT_COUNT=$(wc -l < "$ALERTS_FILE")
fi

# Write daily summary
cat > "$LOG_DIR/summary-$DATE_STAMP.json" << EOF
{
  "date": "$DATE_STAMP",
  "timestamp": "$TIMESTAMP",
  "incidents_scanned": $INCIDENT_COUNT,
  "alerts_generated": $ALERT_COUNT,
  "alert_threshold": $ALERT_THRESHOLD,
  "signal_industries": $(printf '%s\n' "${SIGNAL_INDUSTRIES[@]}" | jq -R . | jq -s .),
  "status": "completed"
}
EOF

echo "[news-to-signal] $TIMESTAMP — Scan complete: $INCIDENT_COUNT incidents, $ALERT_COUNT alerts"
echo "[news-to-signal] Logs: $LOG_DIR/"

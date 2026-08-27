#!/bin/bash
# Bid Scout Daily Runner
# Runs every day at 08:00 UTC to check Cloudia for new bid opportunities

cd "$(dirname "$0")/../.."

echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] 🔍 Starting daily Bid Scout run..."

# Run bid scout
node scripts/bid-scout.mjs run

RESULT=$?

if [ $RESULT -eq 0 ]; then
  echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] ✅ Bid Scout completed successfully"

  # Check if we have opportunities
  if [ -f .workflows/opportunities.json ]; then
    OPPS=$(jq '.total_opportunities' .workflows/opportunities.json 2>/dev/null || echo "?")
    VALUE=$(jq '.total_potential_value' .workflows/opportunities.json 2>/dev/null | numfmt --to=iec-i --suffix=EUR 2>/dev/null || echo "?")
    echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] 📊 Found $OPPS opportunities worth ~$VALUE"
  fi

  # Send Slack notification if configured
  if [ -n "$SLACK_WEBHOOK" ]; then
    curl -X POST "$SLACK_WEBHOOK" \
      -H 'Content-Type: application/json' \
      -d "{
        \"text\": \"🔍 Daily Bid Scout\",
        \"attachments\": [{
          \"color\": \"good\",
          \"title\": \"Cloudia Bid Scan Complete\",
          \"text\": \"Found $OPPS opportunities\nTotal value: ~\$VALUE\"
        }]
      }" 2>/dev/null || true
  fi

else
  echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] ❌ Bid Scout failed"

  # Send Slack alert if configured
  if [ -n "$SLACK_WEBHOOK" ]; then
    curl -X POST "$SLACK_WEBHOOK" \
      -H 'Content-Type: application/json' \
      -d "{
        \"text\": \"🔍 Daily Bid Scout Failed\",
        \"attachments\": [{
          \"color\": \"danger\",
          \"title\": \"Cloudia Bid Scan Failed\",
          \"text\": \"Check logs for details\"
        }]
      }" 2>/dev/null || true
  fi

  exit 1
fi

exit 0

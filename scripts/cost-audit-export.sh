#!/bin/bash
# Cost Policy Audit Export to Google Drive
# Exports weekly cost-policy.log to DWS6 Operations / Cost Audits /
# Enables HIC + ops visibility into all agent compute decisions

set -euo pipefail

# Paths
AUDIT_LOG=".claude/hooks/audit/cost-policy.log"
EXPORT_DIR="/tmp/cost-audit-exports"
FILENAME="cost-policy-$(date +%Y-W%V).csv"
FILEPATH="$EXPORT_DIR/$FILENAME"

# Validate audit log exists
if [ ! -f "$AUDIT_LOG" ]; then
  echo "⚠️  No cost-policy.log found at $AUDIT_LOG"
  exit 0
fi

# Create export directory
mkdir -p "$EXPORT_DIR"

# Convert audit log to CSV format
echo "DATETIME,SESSION_ID,AGENT_TYPE,SANDBOX_STATUS,WORKLOAD_CATEGORY,DECISION,RATIONALE" > "$FILEPATH"

# Parse the pipe-delimited audit log into CSV
tail -1000 "$AUDIT_LOG" 2>/dev/null | while IFS='|' read -r datetime session_id agent_type sandbox workload decision rationale; do
  # Trim whitespace
  datetime=$(echo "$datetime" | xargs)
  session_id=$(echo "$session_id" | xargs)
  agent_type=$(echo "$agent_type" | xargs)
  sandbox=$(echo "$sandbox" | xargs)
  workload=$(echo "$workload" | xargs)
  decision=$(echo "$decision" | xargs)
  rationale=$(echo "$rationale" | xargs)

  # Escape CSV quotes
  session_id="${session_id//\"/\"\"}"
  agent_type="${agent_type//\"/\"\"}"
  rationale="${rationale//\"/\"\"}"

  # Append CSV row
  echo "\"$datetime\",\"$session_id\",\"$agent_type\",\"$sandbox\",\"$workload\",\"$decision\",\"$rationale\"" >> "$FILEPATH"
done

echo "📊 Cost audit export: $FILEPATH ($(wc -l < "$FILEPATH") rows)"

# If Google Drive CLI is available (gcloud or gdrive), upload
if command -v gdrive &> /dev/null; then
  GDRIVE_FOLDER_ID="${GDRIVE_COST_AUDITS_FOLDER_ID:-}"
  if [ -n "$GDRIVE_FOLDER_ID" ]; then
    echo "📤 Uploading to Google Drive folder: $GDRIVE_FOLDER_ID"
    gdrive files create --parents "$GDRIVE_FOLDER_ID" --name "$FILENAME" "$FILEPATH" || {
      echo "⚠️  Google Drive upload failed; CSV exported to: $FILEPATH"
      exit 0
    }
    echo "✅ Uploaded to Drive"
  fi
elif command -v gcloud &> /dev/null; then
  echo "⚠️  gcloud found but gdrive CLI not installed; manual Drive upload required"
  echo "   CSV ready at: $FILEPATH"
else
  echo "ℹ️  No gdrive/gcloud CLI; CSV exported locally to: $FILEPATH"
  echo "   Manual upload: https://drive.google.com/ → DWS6 Operations / Cost Audits"
fi

exit 0

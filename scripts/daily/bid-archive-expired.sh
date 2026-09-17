#!/usr/bin/env bash
# Evidence: Tool=Claude-Code Model=claude-sonnet-4-6 Agent=claude-code Date=2026-08-29
# Audit trail: git log -- scripts/daily/bid-archive-expired.sh
#
# Auto-archives offers whose valid_until has passed and status is still SENT/DRAFT.
# Updates status to EXPIRED in-place and appends an audit_trail entry.
# Dry-run by default; pass --apply to mutate files.

set -euo pipefail

OFFERS_DIR="${REPO_ROOT:-$(git rev-parse --show-toplevel)}/contracts/offers"
DRY_RUN=true
[[ "${1:-}" == "--apply" ]] && DRY_RUN=false

now_epoch=$(date +%s)
archived=0
skipped=0

if [[ ! -d "$OFFERS_DIR" ]]; then
  echo "No offers directory found at $OFFERS_DIR"
  exit 0
fi

for file in "$OFFERS_DIR"/*.json; do
  [[ -e "$file" ]] || continue

  result=$(node - "$file" <<'JSEOF'
const path = process.argv[1];
const fs = require('fs');
const doc = JSON.parse(fs.readFileSync(path, 'utf8'));
const terminalStatuses = ['EXPIRED','ARCHIVED','CANCELLED','REJECTED','ACCEPTED','ACTIVE'];
if (terminalStatuses.includes(doc.status)) {
  process.stdout.write(JSON.stringify({skip:true,reason:`already ${doc.status}`}));
  process.exit(0);
}
const validUntil = doc.timeline?.valid_until;
if (!validUntil) {
  process.stdout.write(JSON.stringify({skip:true,reason:'no valid_until'}));
  process.exit(0);
}
const expiredAt = new Date(validUntil).getTime();
const nowMs = Date.now();
if (expiredAt > nowMs) {
  process.stdout.write(JSON.stringify({skip:true,reason:`not yet expired (${doc.timeline.valid_until})`}));
  process.exit(0);
}
// Build updated doc
doc.status = 'EXPIRED';
if (!doc.metadata) doc.metadata = {};
if (!doc.metadata.audit_trail) doc.metadata.audit_trail = [];
doc.metadata.audit_trail.push({
  timestamp: new Date().toISOString(),
  action: 'AUTO_EXPIRED',
  by: 'bid-archive-expired.sh',
  reason: `valid_until ${validUntil} passed`
});
process.stdout.write(JSON.stringify({skip:false,updated:JSON.stringify(doc,null,2)}));
JSEOF
)

  skip=$(node -e "process.stdout.write(String(JSON.parse($(printf '%q' "$result")).skip))")
  if [[ "$skip" == "true" ]]; then
    reason=$(node -e "process.stdout.write(JSON.parse($(printf '%q' "$result")).reason)")
    echo "SKIP  $(basename "$file") — $reason"
    skipped=$(( skipped + 1 ))
    continue
  fi

  echo "EXPIRE $(basename "$file")"
  if [[ "$DRY_RUN" == "false" ]]; then
    node -e "process.stdout.write(JSON.parse($(printf '%q' "$result")).updated)" > "$file"
    archived=$(( archived + 1 ))
  else
    echo "  (dry-run — pass --apply to write)"
  fi
done

echo ""
echo "Done. archived=$archived skipped=$skipped dry_run=$DRY_RUN"

#!/usr/bin/env bash
# Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
# Audit trail: git log -- scripts/weekly/public-truth-drift-audit.sh

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

REPORT="$(mktemp)"
trap 'rm -f "$REPORT"' EXIT

set +e
node scripts/weekly/public-truth-drift-audit.mjs > "$REPORT" 2>&1
AUDIT_EXIT=$?
set -e

cat "$REPORT"
[ "$AUDIT_EXIT" -ne 0 ] || exit 0

if ! command -v gh >/dev/null 2>&1; then
  echo "public-truth-drift-audit: drift found but gh is unavailable" >&2
  exit "$AUDIT_EXIT"
fi

TITLE="Weekly public truth, technology & partner drift"
EXISTING="$(
  gh issue list \
    --repo blogtheristo/dws6 \
    --state open \
    --search "\"$TITLE\" in:title" \
    --json number \
    --jq '.[0].number // empty'
)"

if [ -n "$EXISTING" ]; then
  gh issue comment "$EXISTING" --repo blogtheristo/dws6 --body-file "$REPORT"
  echo "public-truth-drift-audit: updated issue #$EXISTING"
else
  gh issue create --repo blogtheristo/dws6 --title "$TITLE" --body-file "$REPORT"
  echo "public-truth-drift-audit: created drift issue"
fi

exit "$AUDIT_EXIT"

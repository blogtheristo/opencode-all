#!/usr/bin/env bash
# Evidence: Tool=Claude Code Model=anthropic/claude-opus-5-5 Agent=knowledge-drift-audit Date=2026-09-30
# Audit trail: git log -- scripts/weekly/knowledge-drift-audit.sh
# Weekly knowledge drift & scope audit (BLOG_STANDARD §17.5). Auto-discovered by the DGX
# day-runner (Sundays). Findings open or update one GitHub issue; nothing is changed.
set -uo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"
git fetch -q origin main 2>/dev/null || true
REPORT="$(mktemp)"
trap 'rm -f "$REPORT"' EXIT
node scripts/weekly/knowledge-drift-audit.mjs > "$REPORT" 2>&1
CODE=$?
cat "$REPORT"
[ "$CODE" -ne 0 ] || exit 0
command -v gh >/dev/null 2>&1 || { echo "knowledge-drift-audit: findings, but gh is unavailable" >&2; exit "$CODE"; }
TITLE="Weekly knowledge drift & scope audit"
N="$(gh issue list --repo blogtheristo/dws6 --state open --search "\"$TITLE\" in:title" --json number -q '.[0].number' 2>/dev/null)"
if [ -n "$N" ]; then
  gh issue comment "$N" --repo blogtheristo/dws6 --body-file "$REPORT" >/dev/null
else
  gh issue create --repo blogtheristo/dws6 --title "$TITLE" --body-file "$REPORT" >/dev/null
fi
exit 0

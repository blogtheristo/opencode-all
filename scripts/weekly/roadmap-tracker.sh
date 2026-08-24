#!/usr/bin/env bash
# roadmap-tracker.sh — Weekly DWS7 roadmap progress report (moved off GitHub Actions).
#
# Replaces: .github/workflows/roadmap-weekly-tracker.yml
# Auto-discovered by day-runner.sh (weekly folder, Monday 08:00 UTC target).
#
# Counts merged/open PRs by roadmap category, checks dependency updates
# and security alerts, then creates/updates a GitHub issue.
#
# Requires: gh CLI authenticated, node, npm, jq

set -uo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

REPO="blogtheristo/dws6"
WEEK=$(date -u '+%Y-W%V')
TITLE="DWS7 Roadmap Progress — $WEEK"

echo "[roadmap-tracker] Starting weekly roadmap report for $WEEK"

# Build report
REPORT=$(mktemp)

echo "# DWS7 Roadmap Weekly Report — $WEEK" > "$REPORT"
echo "" >> "$REPORT"
echo "**Generated:** $(date -u '+%Y-%m-%d %H:%M UTC') (DGX Spark)" >> "$REPORT"
echo "" >> "$REPORT"

TOTAL_MERGED=$(gh pr list --repo "$REPO" --state merged --limit 500 --json number | jq length)
TOTAL_OPEN=$(gh pr list --repo "$REPO" --state open --limit 500 --json number | jq length)
PROGRESS=$(( TOTAL_MERGED * 100 / 247 ))

echo "## Overall Progress" >> "$REPORT"
echo "" >> "$REPORT"
echo "| Metric | Count |" >> "$REPORT"
echo "|--------|-------|" >> "$REPORT"
echo "| Total PRs merged | $TOTAL_MERGED |" >> "$REPORT"
echo "| Open PRs | $TOTAL_OPEN |" >> "$REPORT"
echo "| Roadmap target | 247 |" >> "$REPORT"
echo "| Progress | ${PROGRESS}% |" >> "$REPORT"
echo "" >> "$REPORT"

# Security alerts
echo "## Security Alerts" >> "$REPORT"
echo "" >> "$REPORT"
ALERTS=$(gh api "repos/$REPO/dependabot/alerts" --jq '[.[] | select(.state == "open")] | length' 2>/dev/null || echo "0")
CRITICAL=$(gh api "repos/$REPO/dependabot/alerts" --jq '[.[] | select(.state == "open" and .security_advisory.severity == "critical")] | length' 2>/dev/null || echo "0")
echo "| Severity | Count |" >> "$REPORT"
echo "|----------|-------|" >> "$REPORT"
echo "| Critical | $CRITICAL |" >> "$REPORT"
echo "| Total Open | $ALERTS |" >> "$REPORT"
echo "" >> "$REPORT"

# Recent PRs
echo "## Recent PRs (Last 7 Days)" >> "$REPORT"
echo "" >> "$REPORT"
WEEK_AGO=$(date -u -d '7 days ago' '+%Y-%m-%dT%H:%M:%SZ' 2>/dev/null || echo "2026-01-01T00:00:00Z")
gh pr list --repo "$REPO" --state merged --limit 20 --json number,title,mergedAt \
  --jq ".[] | select(.mergedAt >= \"$WEEK_AGO\") | \"- #\(.number) \(.title)\"" >> "$REPORT" 2>/dev/null || echo "- No PRs merged this week" >> "$REPORT"
echo "" >> "$REPORT"

# Create or update issue
gh label create "roadmap-tracker" --repo "$REPO" --color "0E8A16" --description "Weekly DWS7 roadmap progress tracking" 2>/dev/null || true

EXISTING=$(gh issue list --repo "$REPO" --label "roadmap-tracker" --search "$TITLE" --json number --jq '.[0].number' 2>/dev/null || echo "")

if [ -n "$EXISTING" ] && [ "$EXISTING" != "null" ]; then
  gh issue comment "$EXISTING" --repo "$REPO" --body-file "$REPORT"
  echo "[roadmap-tracker] Updated issue #$EXISTING"
else
  gh issue create --repo "$REPO" --title "$TITLE" --body-file "$REPORT" --label "roadmap-tracker"
  echo "[roadmap-tracker] Created new issue"
fi

rm -f "$REPORT"
echo "[roadmap-tracker] Done"

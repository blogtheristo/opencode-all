#!/usr/bin/env bash
# dependabot-audit.sh — Daily npm audit across all package directories
#
# Auto-discovered by day-runner.sh (daily folder convention).
# Runs daily at 03:00–06:00 UTC on DGX Spark.
#
# What it does (default = REPORT-ONLY since the Mini Shai-Hulud campaign,
# May 2026 — auto-applying `npm audit fix` can pull poisoned advisories /
# malicious "fix" versions into the tree unattended):
#   1. Runs `npm audit --json` in every directory that has a package.json
#   2. Collects vulnerability counts by severity
#   3. Writes structured JSON report to logs/dependabot-audit.json
#   4. Reports counts only. No automatic remediation.
#
# Opt-in autofix:
#   DEPENDABOT_AUDIT_AUTOFIX=1   — restore the previous behaviour of running
#                                  `npm audit fix` on critical/high finds and
#                                  auto-committing the resulting lockfile
#                                  changes. Only enable on machines that
#                                  cannot be reached by an attacker via a
#                                  poisoned upstream advisory (e.g. an
#                                  air-gapped reviewer workflow).
#
# Requirements: node, npm, jq

set -uo pipefail
# Note: no -e (errexit) — npm audit returns exit 1 when vulns exist, which is expected

AUTOFIX="${DEPENDABOT_AUDIT_AUTOFIX:-0}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
LOG_DIR="$REPO_ROOT/logs"
REPORT_FILE="$LOG_DIR/dependabot-audit.json"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

mkdir -p "$LOG_DIR"

echo "[dependabot-audit] Starting daily audit at $TIMESTAMP"

# All directories with package.json (relative to repo root)
PACKAGE_DIRS=(
  "."
  "Firehorse/mobile-app"
  "dws6.com/dashboard/firehorse/v10-react"
  "dws6.com/tools/content-pipeline"
  "landing-pages/dws6-com/dashboard/firehorse/v10-react"
  "landing-pages/dws6-com/tools/content-pipeline"
  "mobile-dashboard_RETIRED"
  "src/cloudflare"
  "cli"
  "mcp-hub-ts"
  "mcp-servers/cloud-run-gateway-ts"
  "lambda/ses-inbound-parser"
  "infrastructure/dgx-spark/bumblebee"
)

results=()
total_critical=0
total_high=0
total_moderate=0
total_low=0
fix_applied=()

for dir in "${PACKAGE_DIRS[@]}"; do
  full_path="$REPO_ROOT/$dir"

  # Skip if no package.json
  if [[ ! -f "$full_path/package.json" ]]; then
    continue
  fi

  # Skip if no package-lock.json (npm audit requires it)
  if [[ ! -f "$full_path/package-lock.json" ]]; then
    results+=("{\"directory\": \"$dir\", \"status\": \"no_lockfile\", \"vulnerabilities\": {}}")
    continue
  fi

  echo "  Auditing $dir..."

  # npm audit exits 1 when vulns found — capture stdout regardless of exit code
  audit_json=$(cd "$full_path" && timeout 30 npm audit --json 2>/dev/null) || true
  if [[ -z "$audit_json" ]]; then
    audit_json='{"error": true}'
  fi

  # Extract vulnerability counts (jq -r for raw output, default 0)
  critical=$(echo "$audit_json" | jq -r '.metadata.vulnerabilities.critical // 0' 2>/dev/null) || critical=0
  high=$(echo "$audit_json" | jq -r '.metadata.vulnerabilities.high // 0' 2>/dev/null) || high=0
  moderate=$(echo "$audit_json" | jq -r '.metadata.vulnerabilities.moderate // 0' 2>/dev/null) || moderate=0
  low=$(echo "$audit_json" | jq -r '.metadata.vulnerabilities.low // 0' 2>/dev/null) || low=0
  total=$(echo "$audit_json" | jq -r '.metadata.vulnerabilities.total // 0' 2>/dev/null) || total=0

  # Sanitize: ensure integer (strip non-digits)
  critical="${critical//[!0-9]/}"; critical=${critical:-0}
  high="${high//[!0-9]/}"; high=${high:-0}
  moderate="${moderate//[!0-9]/}"; moderate=${moderate:-0}
  low="${low//[!0-9]/}"; low=${low:-0}
  total="${total//[!0-9]/}"; total=${total:-0}

  total_critical=$((total_critical + critical))
  total_high=$((total_high + high))
  total_moderate=$((total_moderate + moderate))
  total_low=$((total_low + low))

  # List vulnerable package names
  vuln_names=$(echo "$audit_json" | jq -r '.vulnerabilities | keys[]' 2>/dev/null | tr '\n' ',' | sed 's/,$//')

  results+=("{\"directory\": \"$dir\", \"status\": \"audited\", \"vulnerabilities\": {\"critical\": $critical, \"high\": $high, \"moderate\": $moderate, \"low\": $low, \"total\": $total}, \"packages\": \"$vuln_names\"}")

  # Optional auto-fix (DISABLED by default since Mini Shai-Hulud, May 2026).
  # Set DEPENDABOT_AUDIT_AUTOFIX=1 only on hosts where the npm advisory feed
  # is trusted and the resulting lockfile changes can be reviewed before they
  # propagate. Default behaviour now reports counts and stops.
  if [[ "$critical" -gt 0 || "$high" -gt 0 ]]; then
    if [[ "$AUTOFIX" == "1" ]]; then
      echo "    Found $critical critical, $high high — attempting npm audit fix (AUTOFIX=1)..."
      fix_output=$(cd "$full_path" && timeout 60 npm audit fix --dry-run 2>&1 || echo "fix_failed")

      # Only apply fix if dry-run shows changes and no breaking changes
      if echo "$fix_output" | grep -q "would change"; then
        cd "$full_path" && timeout 60 npm audit fix 2>&1 | tail -5 || true
        fix_applied+=("$dir")
        echo "    Fix applied to $dir"
      else
        echo "    No safe fixes available for $dir"
      fi
    else
      echo "    Found $critical critical, $high high — autofix disabled (set DEPENDABOT_AUDIT_AUTOFIX=1 to enable)"
    fi
  fi
done

# Build report
results_json=$(printf '%s\n' "${results[@]}" | jq -s '.' 2>/dev/null || echo '[]')
fixes_json=$(printf '%s\n' "${fix_applied[@]}" | jq -R -s 'split("\n") | map(select(length > 0))' 2>/dev/null || echo '[]')

report=$(cat <<REPORT_EOF
{
  "timestamp": "$TIMESTAMP",
  "autofix_enabled": $([[ "$AUTOFIX" == "1" ]] && echo true || echo false),
  "summary": {
    "directories_audited": ${#PACKAGE_DIRS[@]},
    "total_critical": $total_critical,
    "total_high": $total_high,
    "total_moderate": $total_moderate,
    "total_low": $total_low,
    "total_all": $((total_critical + total_high + total_moderate + total_low))
  },
  "directories": $results_json,
  "fixes_applied": $fixes_json
}
REPORT_EOF
)

echo "$report" | jq '.' > "$REPORT_FILE" 2>/dev/null || echo "$report" > "$REPORT_FILE"

echo ""
echo "=== DAILY DEPENDABOT AUDIT SUMMARY ==="
echo "  Directories audited:  ${#PACKAGE_DIRS[@]}"
echo "  Critical:             $total_critical"
echo "  High:                 $total_high"
echo "  Moderate:             $total_moderate"
echo "  Low:                  $total_low"
echo "  Autofix:              $([[ "$AUTOFIX" == "1" ]] && echo 'ENABLED' || echo 'disabled (default)')"
echo "  Fixes applied:        ${#fix_applied[@]}"

if [[ "$total_critical" -gt 0 ]]; then
  echo ""
  echo "  CRITICAL vulnerabilities detected — manual review required!"
fi

# Auto-commit only when explicit autofix was on AND we actually applied changes.
# Otherwise: no git mutation. Operator must opt in for both halves.
if [[ "$AUTOFIX" == "1" && ${#fix_applied[@]} -gt 0 ]]; then
  echo ""
  echo "  Auto-fixes applied to: ${fix_applied[*]}"
  echo "  Review changes: git diff -- '*/package.json' '*/package-lock.json'"
  echo ""
  echo "  Committing fixes..."
  cd "$REPO_ROOT"
  git add -A -- '*/package.json' '*/package-lock.json' 'package.json' 'package-lock.json' 2>/dev/null || true
  BRANCH=$(git branch --show-current)
  if [[ "$BRANCH" != "main" && "$BRANCH" != "master" ]]; then
    git commit -m "fix(deps): daily npm audit fix — $(date -u +%Y-%m-%d)

Auto-applied non-breaking dependency updates.
Report: logs/dependabot-audit.json" 2>/dev/null || echo "  Nothing to commit"
    git push origin "$BRANCH" 2>/dev/null || echo "  Push failed — manual push required"
  else
    echo "  On main branch — skipping auto-commit (create a feature branch first)"
  fi
fi

echo ""
echo "[dependabot-audit] Report: $REPORT_FILE"
echo "[dependabot-audit] Done."

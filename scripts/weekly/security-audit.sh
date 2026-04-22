#!/usr/bin/env bash
# security-audit.sh — Weekly comprehensive security audit (moved off GitHub Actions).
#
# Replaces:
#   .github/workflows/security-audit-enhanced.yml
#   .github/workflows/monthly-security-audit-enhanced.yml
#   .github/workflows/security-scan-weekly.yml
#   .github/workflows/security-scan-biweekly.yml
#
# Auto-discovered by scripts/day-runner.sh (weekly folder convention).
# Runs every Sunday 04:00 UTC on DGX Spark.
#
# Produces a CI audit record with runner_kind=dgx-spark, trigger_kind=weekly-security-audit.
# Reports go to logs/security-audit/<date>/ and Supabase ci_audit_log.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
REPORT_DIR="$REPO_ROOT/logs/security-audit/$(date -u +%Y-%m-%d)"
mkdir -p "$REPORT_DIR"

echo "[weekly-security-audit] Starting at $TIMESTAMP"

# Run the local-ci runner with a weekly identity. The runner writes the
# hash-chained audit record automatically.
export CI_RUNNER_KIND="dgx-spark"
export CI_RUNNER_NAME="dgx-spark-weekly"
export CI_TRIGGER_KIND="weekly-security-audit"

# Extra scanners that don't run on every push
npm audit --audit-level=moderate > "$REPORT_DIR/npm-audit.txt" 2>&1 || true

if command -v bandit >/dev/null 2>&1; then
  bandit -r . -x node_modules,.venv,dist -f txt > "$REPORT_DIR/bandit.txt" 2>&1 || true
fi

if command -v safety >/dev/null 2>&1; then
  safety check > "$REPORT_DIR/safety.txt" 2>&1 || true
fi

# Full gitleaks history scan (not just staged)
if command -v gitleaks >/dev/null 2>&1; then
  gitleaks detect --config .gitleaks.toml --redact --no-banner > "$REPORT_DIR/gitleaks.txt" 2>&1 || true
fi

bash "$REPO_ROOT/scripts/local-ci.sh" || true

echo "[weekly-security-audit] Done. Reports in $REPORT_DIR"

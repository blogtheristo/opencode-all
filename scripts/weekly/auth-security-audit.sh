#!/usr/bin/env bash
# auth-security-audit.sh — Bi-weekly auth security audit (moved off GitHub Actions).
#
# Replaces: .github/workflows/biweekly-auth-security-audit.yml
# Auto-discovered by day-runner.sh (weekly folder). Runs 1st and 15th of month.
#
# Reviews src/auth/ for OWASP Top 10 and EU AI Act compliance issues.
# Produces reports in logs/auth-audit/<date>/.

set -uo pipefail

REPO_ROOT="${REPO_ROOT:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$REPO_ROOT"

DAY=$(date -u +%d)
if [ "$DAY" != "01" ] && [ "$DAY" != "15" ]; then
  echo "[auth-security-audit] Not 1st or 15th — skipping (day=$DAY)"
  exit 0
fi

REPORT_DIR="$REPO_ROOT/logs/auth-audit/$(date -u +%Y-%m-%d)"
mkdir -p "$REPORT_DIR"

echo "[auth-security-audit] Starting bi-weekly auth audit"

export CI_RUNNER_KIND="dgx-spark"
export CI_TRIGGER_KIND="biweekly-auth-audit"

# Scan auth directory for common vulnerabilities
if [ -d "src/auth" ]; then
  echo "## Auth Directory Scan" > "$REPORT_DIR/auth-scan.md"
  echo "" >> "$REPORT_DIR/auth-scan.md"

  # Check for hardcoded secrets
  grep -rn "password\|secret\|token\|api.key" src/auth/ --include='*.ts' --include='*.js' \
    | grep -vi "process\.env\|import\|interface\|type\|//\|getenv\|config\." \
    > "$REPORT_DIR/hardcoded-secrets.txt" 2>/dev/null || true

  if [ -s "$REPORT_DIR/hardcoded-secrets.txt" ]; then
    echo "WARNING: Potential hardcoded secrets found" >> "$REPORT_DIR/auth-scan.md"
    cat "$REPORT_DIR/hardcoded-secrets.txt" >> "$REPORT_DIR/auth-scan.md"
  else
    echo "No hardcoded secrets detected in src/auth/" >> "$REPORT_DIR/auth-scan.md"
  fi

  # Check JWT configuration
  grep -rn "expiresIn\|algorithm\|verify\|sign" src/auth/ --include='*.ts' \
    > "$REPORT_DIR/jwt-config.txt" 2>/dev/null || true
fi

# Run npm audit focused on auth-related packages
npm audit --json 2>/dev/null | jq '.advisories | to_entries[] | select(.value.module_name | test("jwt|auth|session|passport|bcrypt|argon"))' \
  > "$REPORT_DIR/auth-deps-audit.json" 2>/dev/null || true

echo "[auth-security-audit] Done. Reports in $REPORT_DIR"

#!/usr/bin/env bash
# security-audit.sh — Weekly comprehensive security audit (moved off GitHub Actions).
#
# Replaces (generic scanners: npm audit / bandit / safety / gitleaks / local-ci):
#   .github/workflows/security-audit-enhanced.yml (partial — GHA version also checks
#     deployment file protections, not reproduced here)
#
# Also now runs scripts/scan_critical_bugs.py --full (2026-07-03 fix), which is the
# real scanner .github/workflows/security-scan-weekly.yml used to run and file GitHub
# issues from. That workflow's schedule was removed 2026-05-25 with a comment claiming
# migration to "scripts/weekly/security-scan.sh" — that script never existed, and the
# critical/high findings had no automated home for 5+ weeks. Fixed here by folding the
# real scanner into this script instead, since this one is what day-runner.sh actually
# discovers and runs.
#
# NOT covered, and should NOT be treated as covered:
#   .github/workflows/monthly-security-audit-enhanced.yml — its underlying script,
#     scripts/security_audit.py, is a hardcoded placeholder that always prints
#     "Overall Score: 85/100" regardless of repo state (see its own docstring). Do not
#     wire it back in without first replacing it with a real audit — doing so would
#     resurrect a fabricated compliance score, which is worse than no monthly audit.
#   .github/workflows/security-scan-biweekly.yml — its DGX job is defined in
#     infrastructure/dgx-spark/cron-runner.ts but `enabled: false` (container has no
#     python3). Superseded in practice: this script now runs the same scanner weekly,
#     which is a shorter interval than the biweekly job ever was.
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

# ZenFree static scanner (command injection, SQL injection, path traversal, SSRF,
# hardcoded secrets, insecure deserialization — CWE-tagged). This is the scanner
# .github/workflows/security-scan-weekly.yml used to run and file issues from.
CRITICAL_BUGS_JSON="$REPORT_DIR/critical-bugs-report.json"
CRITICAL_BUGS_MD="$REPORT_DIR/critical-bugs-report.md"
if command -v python3 >/dev/null 2>&1 && [ -f "$REPO_ROOT/scripts/scan_critical_bugs.py" ]; then
  python3 "$REPO_ROOT/scripts/scan_critical_bugs.py" --full \
    --json "$CRITICAL_BUGS_JSON" \
    --output "$CRITICAL_BUGS_MD" || true
else
  echo "[weekly-security-audit] python3 or scan_critical_bugs.py not available — skipping ZenFree scan"
fi

bash "$REPO_ROOT/scripts/local-ci.sh" || true

# Surface critical/high findings as a GitHub issue — but ONLY a redacted summary
# (severity, CWE, file:line — never the matched "code" snippet, and CWE-798 "Exposed
# Secrets in Code" findings are counted only, never located or quoted). The full
# report with code snippets stays local in $REPORT_DIR (gitignored, DGX-disk only,
# not posted anywhere) for a human to review directly. Posting raw snippets to a
# GitHub issue would risk putting real secret material into a permanent, queryable
# artifact — see CLAUDE.md "Secret Egress Rules".
SUMMARY_BODY="$REPORT_DIR/critical-bugs-issue-summary.md"
if [ -f "$CRITICAL_BUGS_JSON" ] && command -v gh >/dev/null 2>&1; then
  python3 - "$CRITICAL_BUGS_JSON" "$SUMMARY_BODY" <<'PYEOF' || true
import json, sys

json_path, out_path = sys.argv[1], sys.argv[2]
with open(json_path) as f:
    data = json.load(f)

stats = data.get("stats", {})
findings = data.get("findings", [])
secrets = [f for f in findings if f.get("cwe") == "CWE-798"]
other = [f for f in findings if f.get("cwe") != "CWE-798" and f.get("severity") in ("critical", "high")]

lines = []
lines.append(f"## Weekly Security Scan — {stats.get('files_scanned', 0)} files scanned\n")
lines.append(f"- Critical: {stats.get('critical', 0)}")
lines.append(f"- High: {stats.get('high', 0)}")
lines.append(f"- Medium: {stats.get('medium', 0)}")
lines.append(f"- Low: {stats.get('low', 0)}\n")

if secrets:
    lines.append(f"### Exposed secrets: {len(secrets)} finding(s)\n")
    lines.append(
        "Redacted from this issue by design — do not quote matched code for this "
        "category. Review the local report on DGX Spark directly: "
        f"`{out_path.replace('critical-bugs-issue-summary.md', 'critical-bugs-report.md')}` "
        "and rotate/remove the credential before it is committed anywhere else.\n"
    )

if other:
    lines.append(f"### Other critical/high findings ({len(other)})\n")
    for f in other[:20]:
        lines.append(f"- **{f.get('severity')}** {f.get('full_description', f.get('description'))} "
                      f"— `{f.get('file')}:{f.get('line')}` (CWE {f.get('cwe')})")
    lines.append("")

lines.append("_No source code snippets are included in this issue. Full report with "
              "matched lines stays local to the DGX Spark host._")

with open(out_path, "w") as f:
    f.write("\n".join(lines))
PYEOF

  CRITICAL=$(python3 -c "import json; d=json.load(open('$CRITICAL_BUGS_JSON')); print(d.get('stats',{}).get('critical',0))" 2>/dev/null || echo 0)
  HIGH=$(python3 -c "import json; d=json.load(open('$CRITICAL_BUGS_JSON')); print(d.get('stats',{}).get('high',0))" 2>/dev/null || echo 0)

  if [ "${CRITICAL:-0}" -gt 0 ] || [ "${HIGH:-0}" -gt 0 ]; then
    TITLE="Weekly Security Scan: ${CRITICAL} critical, ${HIGH} high — $(date -u +%Y-%m-%d)"
    EXISTING=$(gh issue list --label "weekly-scan" --state open --limit 1 --json number -q '.[0].number' 2>/dev/null || echo "")
    if [ -n "$EXISTING" ]; then
      gh issue comment "$EXISTING" --body-file "$SUMMARY_BODY" 2>/dev/null \
        && echo "[weekly-security-audit] Updated issue #${EXISTING}"
    else
      gh issue create --title "$TITLE" --body-file "$SUMMARY_BODY" \
        --label "security" --label "weekly-scan" 2>/dev/null \
        && echo "[weekly-security-audit] Created new weekly-scan issue" \
        || echo "[weekly-security-audit] Could not create issue (label may not exist)"
    fi
  else
    echo "[weekly-security-audit] No critical/high findings — no issue created"
  fi
fi

echo "[weekly-security-audit] Done. Reports in $REPORT_DIR"

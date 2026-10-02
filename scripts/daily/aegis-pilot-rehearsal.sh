#!/usr/bin/env bash
# Evidence: Tool=opencode Model=ollama-local/qwen3-coder-next:latest Agent=aegis-pilot Date=2026-09-30
# Audit trail: git log -- scripts/daily/aegis-pilot-rehearsal.sh
# ============================================================================
# Aegis Pilot — Nightly isolated rehearsal runner
#
# Runs once per day via infrastructure/dgx-spark/day-runner.sh.
# Executes scripts/aegis-pilot-isolated-rehearsal.sh against a fresh mktemp
# state directory, captures JSON verdict, and appends one line to
# logs/aegis-pilot-rehearsal.jsonl with: {date,outcome,conditions,commit}
# Exit non-zero with 'AEGIS REHEARSAL FAILED' unless outcome is PASS.
# Supports --dry-run: prints planned commands and exits 0 without running.
#
# State: logs/ (gitignored), logs/aegis-pilot-rehearsal.jsonl (per-line append)
# ============================================================================

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)" # scripts/daily/ → repo root
cd "$REPO_ROOT"

LOGS_DIR="logs"
LOG_FILE="${LOGS_DIR}/aegis-pilot-rehearsal.jsonl"
REHEARSAL_SCRIPT="scripts/aegis-pilot-isolated-rehearsal.sh"
SCOPE="config/aegis-pilot/reference-scope.json"

COMMIT_SHA="$(git rev-parse HEAD)"
DRY_RUN=false

# Parse arguments
for arg in "$@"; do
  case "$arg" in
    --dry-run)
      DRY_RUN=true
      ;;
    *)
      echo "Usage: $0 [--dry-run]" >&2
      exit 1
      ;;
  esac
done

mkdir -p "$LOGS_DIR"

# If dry-run, print planned commands and exit 0
if [ "$DRY_RUN" = true ]; then
  echo "# Aegis Pilot Nightly Rehearsal (dry-run)"
  echo "# Planned commands:"
  echo "  mkdir -p $LOGS_DIR"
  echo "  STATE_DIR=\$(mktemp -d -t aegis-pilot-rehearsal-XXXXXX)"
  echo "  echo \"=== Running isolated rehearsal in: \$STATE_DIR\" >&2"
  echo "  bash $REHEARSAL_SCRIPT \"\$STATE_DIR\""
  echo "  RC=\$?"
  echo "  # Captured verdict from \$STATE_DIR/acceptance/*.json"
  echo "  # Appending to $LOG_FILE:"
  echo "  # {\\"date\\":\\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\\",\\"outcome\\":\\"PASS\\",\\"conditions\\":{},\\"commit\\":\\"$COMMIT_SHA\\"}"
  echo "  rm -rf \"\$STATE_DIR\""
  echo "Done. To run: bash $0 (without --dry-run)"
  exit 0
fi

# Create fresh state directory
STATE_DIR="$(mktemp -d -t aegis-pilot-rehearsal-XXXXXX)"
echo "=== Running isolated rehearsal in: $STATE_DIR" >&2

# Run the rehearsal
RC=0
bash "$REHEARSAL_SCRIPT" "$STATE_DIR" || RC=$? # set -e must not skip the log line

# Determine outcome and conditions from the acceptance record
OUTCOME="FAIL"
CONDITIONS="{}"

if [ -d "${STATE_DIR}/acceptance" ] && [ "$(ls -A ${STATE_DIR}/acceptance/*.json 2>/dev/null)" ]; then
  LATEST_RECORD="$(ls -t "${STATE_DIR}/acceptance"/*.json 2>/dev/null | head -1)"
  if [ -f "$LATEST_RECORD" ]; then
    # The file is a signed envelope {record, signature, signerKeyId}; the verdict is record.outcome.
    # The path goes in as an argument, not spliced into the script.
    OUTCOME="$(node -e '
      const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
      process.stdout.write((r.record ?? r).outcome || "FAIL");
    ' "$LATEST_RECORD" 2>/dev/null || echo "FAIL")"
    CONDITIONS="$(node -e '
      const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
      const c = (r.record ?? r).conditions;
      process.stdout.write(c && typeof c === "object" ? JSON.stringify(c) : "{}");
    ' "$LATEST_RECORD" 2>/dev/null || echo "{}")"
  fi
fi

# A record that fails its own verify step (non-zero exit) is not a PASS.
if [ "$RC" -ne 0 ]; then OUTCOME="FAIL"; fi

# Clean up state directory
rm -rf "$STATE_DIR"

# Record the result
DATE_EPOCH="$(date -u +%s)"
DATE_ISO="$(date -u +%Y-%m-%dT%H:%M:%SZ)"

LOG_LINE="{\"date\":\"$DATE_ISO\",\"epoch\":$DATE_EPOCH,\"outcome\":\"$OUTCOME\",\"conditions\":$CONDITIONS,\"commit\":\"$COMMIT_SHA\"}"

echo "$LOG_LINE" >> "$LOG_FILE"

echo "=== Rehearsal complete: $OUTCOME ===" >&2

# Exit with failure unless PASS
if [ "$OUTCOME" != "PASS" ]; then
  echo "AEGIS REHEARSAL FAILED"
  exit 1
fi

exit 0

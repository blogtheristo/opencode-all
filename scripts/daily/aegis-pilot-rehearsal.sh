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

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
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
bash "$REHEARSAL_SCRIPT" "$STATE_DIR"
RC=$?

# Determine outcome and conditions from the acceptance record
OUTCOME="FAIL"
CONDITIONS="{}"

if [ -d "${STATE_DIR}/acceptance" ] && [ "$(ls -A ${STATE_DIR}/acceptance/*.json 2>/dev/null)" ]; then
  LATEST_RECORD="$(ls -t "${STATE_DIR}/acceptance"/*.json 2>/dev/null | head -1)"
  if [ -f "$LATEST_RECORD" ]; then
    # Extract outcome from the JSON record
    OUTCOME="$(node -e "
      const fs = require('fs');
      const record = JSON.parse(fs.readFileSync('$LATEST_RECORD', 'utf8'));
      process.stdout.write(record.outcome || 'FAIL');
    " 2>/dev/null || echo "FAIL")"
    
    # Extract conditions (the acceptance conditions result)
    CONDITIONS="$(node -e "
      const fs = require('fs');
      const record = JSON.parse(fs.readFileSync('$LATEST_RECORD', 'utf8'));
      if (record.conditions && typeof record.conditions === 'object') {
        process.stdout.write(JSON.stringify(record.conditions));
      } else {
        process.stdout.write('{}');
      }
    " 2>/dev/null || echo "{}")"
  fi
fi

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

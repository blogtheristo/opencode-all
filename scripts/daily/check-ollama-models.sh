#!/usr/bin/env bash
# ============================================================================
# Daily Ollama Model Check — emails HIL if models are missing
#
# Runs once per day via day-runner. Reports only, never auto-pulls.
# If missing models found: sends email to risto@onelifetime.world
# with approve link. HIL taps link → model pulls.
#
# Code-Version: 1.0.0
# Date: 2026-03-29
# ============================================================================

set -euo pipefail

REPO_DIR="/home/admin100/dws6"
STATE_FILE="${REPO_DIR}/logs/model-check-state.json"
APPROVE_STATE="${REPO_DIR}/logs/model-approve-state.json"

cd "$REPO_DIR"
mkdir -p logs

# Required models (strategic — change only with human approval)
REQUIRED_MODELS=("nemotron-3-super" "qwen3-coder:30b")

# ---------------------------------------------------------------------------
# 1. Check what's installed
# ---------------------------------------------------------------------------
if ! command -v ollama &>/dev/null; then
  echo "[MODEL-CHECK] Ollama not installed — skipping"
  exit 0
fi

INSTALLED=$(ollama list 2>/dev/null | tail -n +2 | awk '{print $1}')
MISSING=()

for model in "${REQUIRED_MODELS[@]}"; do
  if ! echo "$INSTALLED" | grep -q "^${model}$"; then
    MISSING+=("$model")
  fi
done

# ---------------------------------------------------------------------------
# 2. Nothing missing — all good
# ---------------------------------------------------------------------------
if [ ${#MISSING[@]} -eq 0 ]; then
  echo "[MODEL-CHECK] All required models present"
  # Clear any pending approval
  rm -f "$APPROVE_STATE"
  exit 0
fi

# ---------------------------------------------------------------------------
# 3. Check if HIL already approved today
# ---------------------------------------------------------------------------
TODAY=$(date -u +%Y-%m-%d)

if [ -f "$APPROVE_STATE" ]; then
  APPROVED_DATE=$(node -e "const s=require('$APPROVE_STATE'); console.log(s.date||'')" 2>/dev/null || echo "")
  APPROVED=$(node -e "const s=require('$APPROVE_STATE'); console.log(s.approved||false)" 2>/dev/null || echo "false")

  if [ "$APPROVED" = "true" ] && [ "$APPROVED_DATE" = "$TODAY" ]; then
    echo "[MODEL-CHECK] HIL approved today — pulling missing models"
    for model in "${MISSING[@]}"; do
      echo "[MODEL-CHECK] Pulling: $model"
      ollama pull "$model"
    done
    echo "[MODEL-CHECK] Done. Clearing approval state."
    rm -f "$APPROVE_STATE"
    exit 0
  fi
fi

# ---------------------------------------------------------------------------
# 4. Check if we already emailed today (don't spam)
# ---------------------------------------------------------------------------
if [ -f "$STATE_FILE" ]; then
  LAST_EMAIL=$(node -e "const s=require('$STATE_FILE'); console.log(s.lastEmail||'')" 2>/dev/null || echo "")
  if [ "$LAST_EMAIL" = "$TODAY" ]; then
    echo "[MODEL-CHECK] Already emailed today — waiting for approval"
    exit 0
  fi
fi

# ---------------------------------------------------------------------------
# 5. Send email to HIL
# ---------------------------------------------------------------------------
MISSING_LIST=$(printf '%s, ' "${MISSING[@]}")
MISSING_LIST="${MISSING_LIST%, }"

DGX_IP=$(hostname -I | awk '{print $1}')
APPROVE_URL="http://${DGX_IP}:9999/api/models/approve?token=dws-model-$(date +%Y%m%d)"

SUBJECT="DGX Spark: Model update needed — ${MISSING_LIST}"

BODY="DGX Spark model check ($(date -u +%Y-%m-%d %H:%M UTC))

Missing required models: ${MISSING_LIST}

Currently installed:
$(ollama list 2>/dev/null)

Memory: $(free -h | grep Mem | awk '{print $3 "/" $2 " used"}')

To approve the update, tap this link:
${APPROVE_URL}

Or SSH in and run manually:
$(for m in "${MISSING[@]}"; do echo "  ollama pull $m"; done)

If you do nothing, I will ask again tomorrow.

— DGX Spark (gn100-cb5d)"

echo "[MODEL-CHECK] Missing models: ${MISSING_LIST}"
echo "[MODEL-CHECK] Sending email to risto@onelifetime.world..."

# Send via the backend API (uses Amazon SES)
BACKEND_URL="http://localhost:8080"
curl -sf -X POST "${BACKEND_URL}/api/email/send" \
  -H "Content-Type: application/json" \
  -d "$(node -e "
    console.log(JSON.stringify({
      to: 'risto@onelifetime.world',
      subject: $(node -e "console.log(JSON.stringify('$SUBJECT'))"),
      text: $(node -e "process.stdout.write(JSON.stringify(\`${BODY}\`))")
    }))
  ")" 2>/dev/null || {
  # Fallback: use sendmail/msmtp if backend is down
  echo "[MODEL-CHECK] Backend email failed — logging to file"
  echo "$BODY" >> "${REPO_DIR}/logs/model-check-emails.log"
}

# Record that we emailed today
echo "{\"lastEmail\": \"${TODAY}\", \"missing\": [$(printf '\"%s\",' "${MISSING[@]}" | sed 's/,$//')]}" > "$STATE_FILE"

echo "[MODEL-CHECK] Email sent. Waiting for approval at ${APPROVE_URL}"

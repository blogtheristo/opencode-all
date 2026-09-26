#!/usr/bin/env bash
# Evidence: Tool=Claude Code 2.1.283 Model=anthropic/undisclosed-by-runtime-policy Agent=dgx-deploy-fix Date=2026-09-26
# Audit trail: git log -- infrastructure/dgx-spark/day-runner.sh
# ============================================================================
# DWS Day Runner — Self-Healing Automation Loop
#
# Runs every 5 minutes via systemd timer. Does THREE things:
#
#   1. GIT PULL    — always has latest code (new scripts auto-discovered)
#   2. DOCKER UP   — rebuilds if Dockerfiles changed, restarts unhealthy
#   3. SCRIPT SCAN — runs any script in scripts/daily/ or scripts/hourly/
#                    that hasn't run yet today/this hour
#
# Convention-based auto-discovery:
#   scripts/daily/*.{ts,sh}     — run once per day (06:00 UTC check)
#   scripts/weekly/*.{ts,sh}    — run once per week (Sunday 04:00 UTC)
#   scripts/hourly/*.{ts,sh}    — run once per hour
#   scripts/on-deploy/*.{ts,sh} — run after every git pull that has changes
#
# State tracked in: /home/admin100/dws6/logs/day-runner-state.json
#
# Code-Version: 1.0.0
# Date: 2026-03-29
# Owner: Lifetime Oy
# ============================================================================

set -euo pipefail

REPO_DIR="/home/admin100/dws6"
INFRA_DIR="${REPO_DIR}/infrastructure/dgx-spark"
STATE_FILE="${REPO_DIR}/logs/day-runner-state.json"
LOG_PREFIX="[DAY-RUNNER $(date -u +%H:%M)]"

cd "$REPO_DIR"
mkdir -p logs scripts/daily scripts/hourly scripts/weekly scripts/on-deploy

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
log()  { echo "${LOG_PREFIX} $*"; }
now_date() { date -u +%Y-%m-%d; }
now_hour() { date -u +%Y-%m-%d-%H; }

# Read last-run timestamp for a script from state file
last_run() {
  local key="$1"
  if [ -f "$STATE_FILE" ]; then
    node -e "
      const s = require('$STATE_FILE');
      console.log(s['$key'] || '');
    " 2>/dev/null || echo ""
  fi
}

# Write last-run timestamp for a script
mark_run() {
  local key="$1"
  local val="$2"
  if [ ! -f "$STATE_FILE" ]; then
    echo '{}' > "$STATE_FILE"
  fi
  node -e "
    const fs = require('fs');
    const s = JSON.parse(fs.readFileSync('$STATE_FILE', 'utf8'));
    s['$key'] = '$val';
    fs.writeFileSync('$STATE_FILE', JSON.stringify(s, null, 2));
  "
}

run_script() {
  local script="$1"
  local name
  name=$(basename "$script")
  log "Running: $script"

  if [[ "$script" == *.ts ]]; then
    npx tsx "$script" 2>&1 | tail -20 || log "FAILED: $name"
  elif [[ "$script" == *.sh ]]; then
    bash "$script" 2>&1 | tail -20 || log "FAILED: $name"
  fi
}

# ---------------------------------------------------------------------------
# 1. GIT PULL — always latest code
# ---------------------------------------------------------------------------
BEFORE=$(git rev-parse HEAD)
git fetch origin main --quiet 2>/dev/null || true
REMOTE=$(git rev-parse origin/main 2>/dev/null || echo "$BEFORE")

if [ "$BEFORE" = "$REMOTE" ]; then
  log "Repo UP TO DATE (${BEFORE:0:8})"
  CHANGES=false
else
  BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo "?")
  log "Repo BEHIND by $BEHIND commits (${BEFORE:0:8} -> ${REMOTE:0:8})"
  log "Pulling latest code..."
  git reset --hard origin/main --quiet 2>/dev/null || true
  AFTER=$(git rev-parse HEAD)
  log "Updated to ${AFTER:0:8}"

  # Show what changed
  git log --oneline "$BEFORE..$AFTER" 2>/dev/null | head -10 | while read -r line; do
    log "  $line"
  done

  # Reinstall deps if package.json changed
  if git diff --name-only "$BEFORE" "$AFTER" | grep -q 'package.json'; then
    log "package.json changed — running npm ci..."
    npm ci --omit=dev 2>&1 | tail -5
  fi

  CHANGES=true
fi

# ---------------------------------------------------------------------------
# 1b. ENV FILE — copy from repo root if dgx-spark/.env is missing or stale
# ---------------------------------------------------------------------------
if [ ! -f "${INFRA_DIR}/.env" ]; then
  if [ -f "${REPO_DIR}/.env" ]; then
    log ".env missing in dgx-spark/ — copying from repo root"
    cp "${REPO_DIR}/.env" "${INFRA_DIR}/.env"
  else
    log "WARNING: No .env found anywhere — services will fail"
  fi
elif [ -f "${REPO_DIR}/.env" ]; then
  # If repo root .env is newer, update dgx-spark copy
  if [ "${REPO_DIR}/.env" -nt "${INFRA_DIR}/.env" ]; then
    log ".env in repo root is newer — updating dgx-spark copy"
    cp "${REPO_DIR}/.env" "${INFRA_DIR}/.env"
  fi
fi

# ---------------------------------------------------------------------------
# 2. DOCKER UP — rebuild if needed, restart unhealthy
# ---------------------------------------------------------------------------
cd "$INFRA_DIR"

# Rebuild decision is made against the last SUCCESSFULLY deployed commit, not
# the previous HEAD: a failed build must not be forgotten on the next pull.
# App code (src/, public/, config/, deps) triggers a rebuild too — previously
# only Docker files did, so src/ changes kept running on a stale image.
# DGX is the production backend (HIC 26.09.2026: Scaleway retired on cost).
DEPLOYED_FILE="${REPO_DIR}/logs/last-deployed-sha"
FAILED_FILE="${REPO_DIR}/logs/last-failed-deploy-sha"
HEAD_SHA=$(git rev-parse HEAD)
# No record yet (first run after this change) → rebuild once to clear any stale image.
DEPLOYED_SHA=$(cat "$DEPLOYED_FILE" 2>/dev/null || echo "none")
FAILED_SHA=$(cat "$FAILED_FILE" 2>/dev/null || echo "")
REBUILD_PATHS='^(src/|public/|config/|package(-lock)?\.json|tsconfig\.json|infrastructure/dgx-spark/)|Dockerfile|docker-compose'

NEED_REBUILD=false
if [ "$HEAD_SHA" != "$DEPLOYED_SHA" ] && [ "$HEAD_SHA" != "$FAILED_SHA" ]; then
  if ! git cat-file -e "${DEPLOYED_SHA}^{commit}" 2>/dev/null \
    || grep -qE "$REBUILD_PATHS" <<< "$(git diff --name-only "$DEPLOYED_SHA" "$HEAD_SHA")"; then
    # (here-string, not a pipe: with pipefail, grep -q closing early can SIGPIPE git diff)
    NEED_REBUILD=true
  fi
fi

if [ "$NEED_REBUILD" = true ]; then
  log "App or Docker files changed since ${DEPLOYED_SHA:0:8} — rebuilding ${HEAD_SHA:0:8} (no cache)..."
  # Build first: a failed build leaves the running containers untouched.
  # pipefail (set above) makes a failed build fail this pipeline.
  if docker compose build --pull --no-cache 2>&1 | tail -10; then
    docker compose up -d --force-recreate 2>&1 | tail -5
    HEALTHY=false
    for _ in $(seq 1 24); do
      if curl -sf http://localhost:8080/health >/dev/null 2>&1; then HEALTHY=true; break; fi
      sleep 5
    done
    if [ "$HEALTHY" = true ]; then
      echo "$HEAD_SHA" > "$DEPLOYED_FILE"
      rm -f "$FAILED_FILE"
      log "DEPLOY OK — backend healthy on ${HEAD_SHA:0:8}"
    else
      echo "$HEAD_SHA" > "$FAILED_FILE"
      log "DEPLOY FAILED — backend not healthy after 120s on ${HEAD_SHA:0:8} (not retried until next commit)"
    fi
  else
    echo "$HEAD_SHA" > "$FAILED_FILE"
    log "DEPLOY FAILED — docker compose build failed on ${HEAD_SHA:0:8}; previous containers still running"
  fi
elif [ "$CHANGES" = true ]; then
  # Docs-only change — just ensure containers are running
  docker compose up -d 2>&1 | tail -3
  if [ "$HEAD_SHA" != "$FAILED_SHA" ]; then echo "$HEAD_SHA" > "$DEPLOYED_FILE"; fi
else
  # No code changes — just ensure containers are up and healthy
  UNHEALTHY=$(docker ps --filter "health=unhealthy" --format "{{.Names}}" 2>/dev/null || true)
  if [ -n "$UNHEALTHY" ]; then
    log "Unhealthy containers: $UNHEALTHY — restarting..."
    docker compose restart 2>&1 | tail -5
  fi
fi

cd "$REPO_DIR"

# ---------------------------------------------------------------------------
# 3. SCRIPT SCAN — auto-discover and run scripts by convention
# ---------------------------------------------------------------------------
TODAY=$(now_date)
THIS_HOUR=$(now_hour)
CURRENT_HOUR=$(date -u +%H)

# --- on-deploy scripts (run when code changed) ---
if [ "$CHANGES" = true ]; then
  for script in scripts/on-deploy/*.{ts,sh}; do
    [ -f "$script" ] || continue
    run_script "$script"
  done
fi

# --- daily scripts (run once per day, at 06:00 UTC window) ---
if [ "$CURRENT_HOUR" = "06" ] || [ "$CURRENT_HOUR" = "03" ] || [ "$CURRENT_HOUR" = "04" ]; then
  for script in scripts/daily/*.{ts,sh}; do
    [ -f "$script" ] || continue
    name=$(basename "$script")
    if [ "$(last_run "daily:$name")" != "$TODAY" ]; then
      run_script "$script"
      mark_run "daily:$name" "$TODAY"
    fi
  done
fi

# --- weekly scripts (run once per week, Sunday at 04:00 UTC window) ---
THIS_WEEK=$(date -u +%Y-W%V)
DAY_OF_WEEK=$(date -u +%u)  # 7 = Sunday
if [ "$DAY_OF_WEEK" = "7" ] && { [ "$CURRENT_HOUR" = "04" ] || [ "$CURRENT_HOUR" = "03" ]; }; then
  for script in scripts/weekly/*.{ts,sh}; do
    [ -f "$script" ] || continue
    name=$(basename "$script")
    if [ "$(last_run "weekly:$name")" != "$THIS_WEEK" ]; then
      run_script "$script"
      mark_run "weekly:$name" "$THIS_WEEK"
    fi
  done
fi

# --- hourly scripts (run once per hour) ---
for script in scripts/hourly/*.{ts,sh}; do
  [ -f "$script" ] || continue
  name=$(basename "$script")
  if [ "$(last_run "hourly:$name")" != "$THIS_HOUR" ]; then
    run_script "$script"
    mark_run "hourly:$name" "$THIS_HOUR"
  fi
done

# ---------------------------------------------------------------------------
# Health summary
# ---------------------------------------------------------------------------
CONTAINERS=$(docker ps --format "{{.Names}}:{{.Status}}" 2>/dev/null | tr '\n' ' ')
log "Containers: ${CONTAINERS:-none}"
log "Done."

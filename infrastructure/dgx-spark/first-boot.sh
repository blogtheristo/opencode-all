#!/usr/bin/env bash
# ============================================================================
# DGX Spark First Boot — Run ONCE on the DGX Spark machine
#
# This script:
#   1. Clones the repo (if not present)
#   2. Installs Node.js 22 (if not present)
#   3. Installs pandoc (if not present) — document rendering, DWS_DOCUMENT_STANDARD.md §22
#   4. Pulls Ollama models
#   5. Copies .env.example → .env (user fills in secrets)
#   6. Installs systemd services (auto-deploy + day-runner)
#   7. Starts everything
#
# Usage (SSH into DGX Spark, run once):
#   git clone git@github.com:blogtheristo/dws6.git /home/admin100/dws6
#   bash /home/admin100/dws6/infrastructure/dgx-spark/first-boot.sh
#
# Code-Version: 1.0.0
# Date: 2026-03-29
# Owner: Lifetime Oy
# ============================================================================

set -euo pipefail

REPO_DIR="/home/admin100/dws6"
REPO_URL_SSH="git@github.com:blogtheristo/dws6.git"
INFRA_DIR="${REPO_DIR}/infrastructure/dgx-spark"

G='\033[0;32m'
Y='\033[1;33m'
R='\033[0;31m'
N='\033[0m'
log()  { echo -e "${G}[BOOT]${N} $*"; }
warn() { echo -e "${Y}[BOOT]${N} $*"; }
err()  { echo -e "${R}[BOOT]${N} $*"; }

# ---------------------------------------------------------------------------
# 1. SSH key — generate BEFORE cloning (needed for private repo)
# ---------------------------------------------------------------------------
mkdir -p ~/.ssh
if [ ! -f ~/.ssh/id_ed25519 ]; then
  log "Generating SSH deploy key..."
  ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C "dgx-spark-deploy"
  echo ""
  warn "=== ACTION REQUIRED ==="
  warn "Add this PUBLIC key as a GitHub deploy key (read-only):"
  warn "  Repo → Settings → Deploy keys → Add deploy key"
  echo ""
  cat ~/.ssh/id_ed25519.pub
  echo ""
  warn "Add the PRIVATE key as GitHub secret DGX_SPARK_SSH_KEY"
  warn "Then re-run this script."
  warn "=== ACTION REQUIRED ==="
  echo ""
  # Can't clone without the deploy key — exit early
  if [ ! -d "$REPO_DIR/.git" ]; then
    err "Cannot clone private repo without deploy key. Add key to GitHub, then re-run."
    exit 1
  fi
else
  log "SSH key exists"
fi

# Ensure GitHub host key is known (prevents interactive prompt)
ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts 2>/dev/null || true

# ---------------------------------------------------------------------------
# 2. Clone repo if not present
# ---------------------------------------------------------------------------
if [ ! -d "$REPO_DIR/.git" ]; then
  log "Cloning dws6 repo (SSH)..."
  git clone "$REPO_URL_SSH" "$REPO_DIR"
else
  log "Repo exists at $REPO_DIR"
  cd "$REPO_DIR"
  CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
  log "Current branch: $CURRENT_BRANCH"
  git fetch origin "$CURRENT_BRANCH" --quiet 2>/dev/null || true
  git pull --ff-only 2>/dev/null || log "Pull skipped (divergent branches — run manually if needed)"
fi

cd "$REPO_DIR"

# ---------------------------------------------------------------------------
# 3. Node.js 22 (if not present)
# ---------------------------------------------------------------------------
if ! command -v node &>/dev/null || [[ "$(node -v)" != v22* ]]; then
  log "Installing Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  log "Node.js $(node -v) already installed"
fi

npm ci --omit=dev

# ---------------------------------------------------------------------------
# 3a. Pandoc — document rendering (CVs, whitepapers, customer docs)
#     Persistent here so it survives across every future session on this
#     box, unlike a cloud-session container where `apt-get install pandoc`
#     has to be repeated per session. See DWS_DOCUMENT_STANDARD.md §22 and
#     scripts/render-doc.sh.
# ---------------------------------------------------------------------------
if ! command -v pandoc &>/dev/null; then
  log "Installing pandoc..."
  sudo apt-get update -qq && sudo apt-get install -y pandoc
else
  log "pandoc $(pandoc --version | head -1 | awk '{print $2}') already installed"
fi

# ---------------------------------------------------------------------------
# 3. Ollama models
# ---------------------------------------------------------------------------
# ---------------------------------------------------------------------------
# Ollama: REPORT ONLY — never pull or remove models automatically.
# Model changes are strategic decisions requiring human approval.
# ---------------------------------------------------------------------------
if command -v ollama &>/dev/null; then
  log "Ollama status:"
  ollama list

  # Check required models
  INSTALLED=$(ollama list 2>/dev/null | tail -n +2 | awk '{print $1}')
  REQUIRED=("nemotron-3-super" "qwen3-coder:30b")
  MISSING=()

  for model in "${REQUIRED[@]}"; do
    if echo "$INSTALLED" | grep -q "^${model}$"; then
      log "  OK: $model"
    else
      MISSING+=("$model")
      warn "  MISSING: $model — needed by DWS agents"
    fi
  done

  if [ ${#MISSING[@]} -gt 0 ]; then
    warn ""
    warn "Required models missing. To install manually:"
    for model in "${MISSING[@]}"; do
      warn "  ollama pull $model"
    done
    warn ""
    warn "This script does NOT auto-pull models. Model changes require human approval."
  fi
else
  warn "Ollama not installed — install from https://ollama.com"
fi

# ---------------------------------------------------------------------------
# 4. Environment file
# ---------------------------------------------------------------------------
if [ ! -f "${INFRA_DIR}/.env" ]; then
  if [ -f "${REPO_DIR}/.env" ]; then
    log "Copying .env from repo root (real secrets)"
    cp "${REPO_DIR}/.env" "${INFRA_DIR}/.env"
  else
    log "Creating .env from example — EDIT THIS with real secrets"
    cp "${INFRA_DIR}/.env.example" "${INFRA_DIR}/.env"
    warn ">>> EDIT ${INFRA_DIR}/.env with real API keys before starting services <<<"
  fi
else
  log ".env already exists"
  # Update if repo root has a newer copy
  if [ -f "${REPO_DIR}/.env" ] && [ "${REPO_DIR}/.env" -nt "${INFRA_DIR}/.env" ]; then
    log "Repo root .env is newer — updating"
    cp "${REPO_DIR}/.env" "${INFRA_DIR}/.env"
  fi
fi

# ---------------------------------------------------------------------------
# 5. Install systemd services
# ---------------------------------------------------------------------------
log "Installing systemd services..."

# --- dws-day-runner.service + timer ---
sudo tee /etc/systemd/system/dws-day-runner.service > /dev/null << 'UNIT'
[Unit]
Description=DWS Day Runner — auto-pull, rebuild, run daily tasks
After=network-online.target docker.service ollama.service
Wants=network-online.target

[Service]
Type=oneshot
User=admin100
WorkingDirectory=/home/admin100/dws6
ExecStart=/home/admin100/dws6/infrastructure/dgx-spark/day-runner.sh
StandardOutput=append:/home/admin100/dws6/logs/day-runner.log
StandardError=append:/home/admin100/dws6/logs/day-runner.log
Environment=PATH=/usr/local/bin:/usr/bin:/bin
UNIT

sudo tee /etc/systemd/system/dws-day-runner.timer > /dev/null << 'TIMER'
[Unit]
Description=DWS Day Runner — every 5 minutes + on boot

[Timer]
OnBootSec=60
OnUnitActiveSec=300
Persistent=true

[Install]
WantedBy=timers.target
TIMER

# --- dws-docker.service (ensure containers are up) ---
sudo tee /etc/systemd/system/dws-docker.service > /dev/null << 'UNIT'
[Unit]
Description=DWS Docker Services (backend, cron, heartbeat, redis)
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
User=admin100
WorkingDirectory=/home/admin100/dws6/infrastructure/dgx-spark
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
StandardOutput=append:/home/admin100/dws6/logs/docker.log
StandardError=append:/home/admin100/dws6/logs/docker.log

[Install]
WantedBy=multi-user.target
UNIT

# Create log directory
mkdir -p "${REPO_DIR}/logs"

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable dws-day-runner.timer
sudo systemctl enable dws-docker.service
sudo systemctl start dws-day-runner.timer
sudo systemctl start dws-docker.service

# (SSH key generated in step 1, before clone)

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
log ""
log "=== First Boot Complete ==="
log ""
log "Systemd services installed:"
log "  dws-day-runner.timer  — pulls, rebuilds, picks up new scripts (every 5min)"
log "  dws-docker.service    — keeps Docker containers running (on boot)"
log ""
log "Check status:"
log "  systemctl status dws-day-runner.timer"
log "  systemctl status dws-docker.service"
log "  journalctl -u dws-day-runner -f"
log ""
if [ ! -s "${INFRA_DIR}/.env" ] || grep -q 'your-' "${INFRA_DIR}/.env" 2>/dev/null; then
  warn ">>> NEXT: Edit ${INFRA_DIR}/.env with real API keys <<<"
fi

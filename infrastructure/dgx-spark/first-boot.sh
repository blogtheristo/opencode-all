#!/usr/bin/env bash
# ============================================================================
# DGX Spark First Boot — Run ONCE on the DGX Spark machine
#
# This script:
#   1. Clones the repo (if not present)
#   2. Installs Node.js 22 (if not present)
#   3. Pulls Ollama models
#   4. Copies .env.example → .env (user fills in secrets)
#   5. Installs systemd services (auto-deploy + day-runner)
#   6. Starts everything
#
# Usage (SSH into DGX Spark, run once):
#   curl -sfL https://raw.githubusercontent.com/blogtheristo/dws6/main/infrastructure/dgx-spark/first-boot.sh | bash
#   # OR if repo is already cloned:
#   bash /home/admin100/dws6/infrastructure/dgx-spark/first-boot.sh
#
# Code-Version: 1.0.0
# Date: 2026-03-29
# Owner: Lifetime Oy
# ============================================================================

set -euo pipefail

REPO_DIR="/home/admin100/dws6"
REPO_URL="git@github.com:blogtheristo/dws6.git"
INFRA_DIR="${REPO_DIR}/infrastructure/dgx-spark"

G='\033[0;32m'
Y='\033[1;33m'
R='\033[0;31m'
N='\033[0m'
log()  { echo -e "${G}[BOOT]${N} $*"; }
warn() { echo -e "${Y}[BOOT]${N} $*"; }
err()  { echo -e "${R}[BOOT]${N} $*"; }

# ---------------------------------------------------------------------------
# 1. Clone repo if not present
# ---------------------------------------------------------------------------
if [ ! -d "$REPO_DIR/.git" ]; then
  log "Cloning dws6 repo..."
  git clone "$REPO_URL" "$REPO_DIR"
else
  log "Repo exists at $REPO_DIR"
  cd "$REPO_DIR" && git pull origin main
fi

cd "$REPO_DIR"

# ---------------------------------------------------------------------------
# 2. Node.js 22 (if not present)
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
# 3. Ollama models
# ---------------------------------------------------------------------------
if command -v ollama &>/dev/null; then
  log "Pulling Ollama models..."
  ollama pull llama3.3:70b || warn "llama3.3:70b pull failed — retry later"
  ollama pull qwen2.5-coder:32b || warn "qwen2.5-coder:32b pull failed — retry later"
  ollama list
else
  warn "Ollama not installed — install from https://ollama.com then re-run"
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

# ---------------------------------------------------------------------------
# 6. Generate SSH key for GitHub Actions (if not exists)
# ---------------------------------------------------------------------------
if [ ! -f ~/.ssh/id_ed25519 ]; then
  log "Generating SSH key for GitHub Actions deploy..."
  ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -N "" -C "dgx-spark-deploy"
  warn "Add this PUBLIC key to GitHub repo deploy keys:"
  cat ~/.ssh/id_ed25519.pub
  warn "Add the PRIVATE key as GitHub secret DGX_SPARK_SSH_KEY"
else
  log "SSH key already exists"
fi

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

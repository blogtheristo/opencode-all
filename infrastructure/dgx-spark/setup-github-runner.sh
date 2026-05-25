#!/usr/bin/env bash
# ============================================================================
# DGX Spark — GitHub Actions Self-Hosted Runner Setup
#
# Installs and registers the GitHub Actions runner on DGX Spark so PR
# checks (test, lint, audit, security, auto-fix) run locally on the
# 20-core ARM64 machine instead of GitHub-hosted ubuntu-latest.
#
# Prerequisites:
#   - first-boot.sh already run
#   - gh CLI authenticated, or a registration token passed as $1
#
# Usage:
#   # With gh CLI (auto-generates token):
#   bash infrastructure/dgx-spark/setup-github-runner.sh
#
#   # With explicit token:
#   bash infrastructure/dgx-spark/setup-github-runner.sh AARCXTE...
#
# Code-Version: 1.0.0
# Date: 2026-05-22
# Owner: Lifetime Oy
# ============================================================================

set -euo pipefail

RUNNER_DIR="/home/admin100/actions-runner"
RUNNER_VERSION="2.325.0"
REPO="blogtheristo/dws6"
RUNNER_NAME="dgx-spark"
LABELS="self-hosted,arm64,dgx-spark,ubuntu-24.04"

G='\033[0;32m'
Y='\033[1;33m'
N='\033[0m'
log()  { echo -e "${G}[RUNNER]${N} $*"; }
warn() { echo -e "${Y}[RUNNER]${N} $*"; }

# Get registration token
TOKEN="${1:-}"
if [ -z "$TOKEN" ]; then
  if command -v gh &>/dev/null; then
    log "Generating registration token via gh CLI..."
    TOKEN=$(gh api -X POST "repos/${REPO}/actions/runners/registration-token" --jq '.token')
  else
    echo "Usage: $0 <REGISTRATION_TOKEN>"
    echo "Get token: gh api -X POST repos/${REPO}/actions/runners/registration-token --jq '.token'"
    exit 1
  fi
fi

# Download and extract runner
mkdir -p "$RUNNER_DIR"
cd "$RUNNER_DIR"

if [ ! -f "run.sh" ]; then
  log "Downloading runner v${RUNNER_VERSION} (ARM64)..."
  curl -sL "https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-arm64-${RUNNER_VERSION}.tar.gz" -o runner.tar.gz
  tar xzf runner.tar.gz
  rm runner.tar.gz
else
  log "Runner already extracted"
fi

# Configure
log "Configuring runner..."
./config.sh --url "https://github.com/${REPO}" \
  --token "$TOKEN" \
  --name "$RUNNER_NAME" \
  --labels "$LABELS" \
  --work _work \
  --replace \
  --unattended

# Install as user-level systemd service (no sudo required)
log "Installing systemd service..."
mkdir -p ~/.config/systemd/user

cat > ~/.config/systemd/user/github-runner.service << 'UNIT'
[Unit]
Description=GitHub Actions Self-Hosted Runner (DGX Spark)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
WorkingDirectory=/home/admin100/actions-runner
ExecStart=/home/admin100/actions-runner/run.sh
Restart=always
RestartSec=5
KillSignal=SIGTERM
TimeoutStopSec=5min

[Install]
WantedBy=default.target
UNIT

loginctl enable-linger admin100 2>/dev/null || true

# Install runner-health companion service (HTTP health probe on :9800)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HEALTH_SCRIPT="${SCRIPT_DIR}/runner-health.sh"

if [ -f "$HEALTH_SCRIPT" ]; then
  log "Installing runner-health companion service..."

  if ! command -v nc &>/dev/null; then
    warn "netcat (nc) not found — installing ncat..."
    sudo apt-get install -y ncat 2>/dev/null || warn "Could not install ncat — runner-health may not work"
  fi

  cp "$HEALTH_SCRIPT" "$RUNNER_DIR/runner-health.sh"
  chmod +x "$RUNNER_DIR/runner-health.sh"

  cat > ~/.config/systemd/user/runner-health.service << 'UNIT'
[Unit]
Description=GitHub Actions Runner Health Probe (DGX Spark)
After=github-runner.service
BindsTo=github-runner.service

[Service]
Type=simple
WorkingDirectory=/home/admin100/actions-runner
ExecStart=/home/admin100/actions-runner/runner-health.sh
Restart=always
RestartSec=5

[Install]
WantedBy=default.target
UNIT
else
  warn "runner-health.sh not found at ${HEALTH_SCRIPT} — skipping health probe"
fi

systemctl --user daemon-reload
systemctl --user enable github-runner.service
systemctl --user start github-runner.service

# Start health probe if installed
if [ -f ~/.config/systemd/user/runner-health.service ]; then
  systemctl --user enable runner-health.service
  systemctl --user start runner-health.service
fi

sleep 2
systemctl --user status github-runner.service --no-pager || true
systemctl --user status runner-health.service --no-pager 2>/dev/null || true

log ""
log "=== Runner Setup Complete ==="
log "Name:   $RUNNER_NAME"
log "Labels: $LABELS"
log "Status: systemctl --user status github-runner.service"
log "Health: systemctl --user status runner-health.service"
log "Logs:   journalctl --user -u github-runner -f"

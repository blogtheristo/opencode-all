#!/usr/bin/env bash
# ============================================================================
# DGX Spark Deploy — SSH Push & Start
#
# Usage (from any environment — Cursor, CC Mobile, terminal):
#   ./infrastructure/dgx-spark/deploy.sh              # Full deploy
#   ./infrastructure/dgx-spark/deploy.sh --status     # Check status
#   ./infrastructure/dgx-spark/deploy.sh --restart    # Restart services
#   ./infrastructure/dgx-spark/deploy.sh --logs       # Tail logs
#   ./infrastructure/dgx-spark/deploy.sh --pull       # Git pull only
#
# SSH Config (add to ~/.ssh/config):
#   Host dgx-spark
#     HostName 192.168.101.113
#     User admin100
#     IdentityFile ~/.ssh/id_ed25519
#     ServerAliveInterval 60
#     ServerAliveCountMax 3
#
# Code-Version: 1.0.0
# Date: 2026-03-29
# Owner: Lifetime Oy
# ============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
DGX_HOST="${DGX_SPARK_HOST:-dgx-spark}"
DGX_USER="${DGX_SPARK_USER:-admin100}"
DGX_IP="${DGX_SPARK_IP:-192.168.101.113}"
DGX_PORT="${DGX_SPARK_SSH_PORT:-22}"
REPO_DIR="${DGX_SPARK_REPO:-/home/admin100/dws6}"
BRANCH="${DGX_SPARK_BRANCH:-main}"

# Resolve SSH target: use Host alias if available, else user@ip
SSH_TARGET="${DGX_USER}@${DGX_IP}"
SSH_OPTS="-o ConnectTimeout=10 -o ServerAliveInterval=60 -p ${DGX_PORT}"

# Colors (safe for terminals that don't support them)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[DGX]${NC} $*"; }
warn() { echo -e "${YELLOW}[DGX]${NC} $*"; }
err()  { echo -e "${RED}[DGX]${NC} $*" >&2; }

# ---------------------------------------------------------------------------
# SSH wrapper with retry
# ---------------------------------------------------------------------------
ssh_run() {
  local retries=3
  local delay=2
  for i in $(seq 1 $retries); do
    if ssh ${SSH_OPTS} "${SSH_TARGET}" "$@" 2>/dev/null; then
      return 0
    fi
    if [ "$i" -lt "$retries" ]; then
      warn "SSH attempt $i failed, retrying in ${delay}s..."
      sleep $delay
      delay=$((delay * 2))
    fi
  done
  err "SSH failed after $retries attempts"
  return 1
}

# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------
cmd_status() {
  log "Checking DGX Spark status..."
  ssh_run "
    echo '=== System ==='
    uname -a
    echo ''
    echo '=== Memory ==='
    free -h
    echo ''
    echo '=== Disk ==='
    df -h / | tail -1
    echo ''
    echo '=== Docker Containers ==='
    docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' 2>/dev/null || echo 'Docker not running'
    echo ''
    echo '=== Ollama Models ==='
    ollama list 2>/dev/null || echo 'Ollama not running'
    echo ''
    echo '=== Heartbeat ==='
    curl -s http://localhost:9999/health 2>/dev/null || echo 'Heartbeat not running'
  "
}

cmd_pull() {
  log "Pulling latest code on DGX Spark..."
  ssh_run "
    cd ${REPO_DIR} && \
    git fetch origin ${BRANCH} && \
    git checkout ${BRANCH} && \
    git pull origin ${BRANCH}
  "
}

cmd_deploy() {
  log "Deploying to DGX Spark (${SSH_TARGET})..."

  # 1. Test SSH connectivity
  log "Testing SSH connection..."
  if ! ssh_run "echo 'SSH OK'"; then
    err "Cannot reach DGX Spark at ${SSH_TARGET}"
    exit 1
  fi

  # 2. Pull latest code
  cmd_pull

  # 3. Install dependencies
  log "Installing dependencies..."
  ssh_run "cd ${REPO_DIR} && npm ci --omit=dev"

  # 4. Copy .env if not present
  ssh_run "
    cd ${REPO_DIR}/infrastructure/dgx-spark && \
    if [ ! -f .env ]; then
      echo 'WARNING: No .env file in infrastructure/dgx-spark/'
      echo 'Copy from main repo: cp ${REPO_DIR}/.env ${REPO_DIR}/infrastructure/dgx-spark/.env'
    fi
  "

  # 5. Build and start Docker services
  log "Building and starting services..."
  ssh_run "
    cd ${REPO_DIR}/infrastructure/dgx-spark && \
    docker compose build --pull && \
    docker compose up -d && \
    echo '' && \
    echo '=== Running Containers ===' && \
    docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
  "

  # 6. Wait for health checks
  log "Waiting for health checks (30s)..."
  sleep 5
  ssh_run "
    echo '=== Backend ===' && \
    curl -sf http://localhost:8080/health 2>/dev/null && echo '' || echo 'Backend: starting...'
    echo '=== Cron ===' && \
    curl -sf http://localhost:8081/health 2>/dev/null && echo '' || echo 'Cron: starting...'
    echo '=== NemoClaw ===' && \
    curl -sf http://localhost:8090/health 2>/dev/null && echo '' || echo 'NemoClaw: starting...'
    echo '=== Heartbeat ===' && \
    curl -sf http://localhost:9999/health 2>/dev/null && echo '' || echo 'Heartbeat: starting...'
  "

  log "Deploy complete! DGX Spark is primary runtime."
  log "Heartbeat: http://${DGX_IP}:9999/health"
  log "Backend:   http://${DGX_IP}:8080/health"
  log "Cron:      http://${DGX_IP}:8081/status"
}

cmd_restart() {
  log "Restarting DGX Spark services..."
  ssh_run "
    cd ${REPO_DIR}/infrastructure/dgx-spark && \
    docker compose restart && \
    docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
  "
}

cmd_logs() {
  log "Tailing DGX Spark logs..."
  ssh_run "
    cd ${REPO_DIR}/infrastructure/dgx-spark && \
    docker compose logs --tail=50 -f
  "
}

cmd_stop() {
  log "Stopping DGX Spark services..."
  ssh_run "
    cd ${REPO_DIR}/infrastructure/dgx-spark && \
    docker compose down
  "
  warn "Services stopped. GitHub Actions failover is now active."
}

cmd_ollama_models() {
  log "Pulling required Ollama models on DGX Spark..."
  ssh_run "
    echo 'Pulling nemotron-3-super (may take a while — ~87GB)...'
    ollama pull nemotron-3-super
    echo ''
    echo 'Pulling qwen3-coder:30b...'
    ollama pull qwen3-coder:30b
    echo ''
    echo 'Available models:'
    ollama list
  "
}

# ---------------------------------------------------------------------------
# Ollama cleanup — DESTRUCTIVE: removes deprecated models from the Spark
# Separate from --models on purpose. Run only after the new models
# (nemotron-3-super + qwen3-coder:30b) are verified working in production.
# Until then, the old models (llama3.3:70b + qwen2.5-coder:32b) stay on
# disk as warm rollback. The Spark's 3TB NVMe easily holds all four.
# ---------------------------------------------------------------------------
cmd_ollama_cleanup() {
  log "Ollama cleanup — DESTRUCTIVE"
  log "This will remove the deprecated Spark Brain models:"
  log "  - llama3.3:70b        (previous Primary tier, ~40GB)"
  log "  - qwen2.5-coder:32b   (previous Fast tier, ~20GB)"
  log ""
  log "Verify the new models work first (curl http://192.168.101.113:11434/api/generate)."
  log "Once removed, rolling back requires re-pulling ~60GB from ollama.com."
  log ""
  read -r -p "Type 'remove' to confirm: " confirm
  if [ "$confirm" != "remove" ]; then
    log "Aborted."
    exit 1
  fi
  ssh_run "
    echo 'Removing llama3.3:70b...'
    ollama rm llama3.3:70b 2>/dev/null && echo '  removed' || echo '  not present (already removed)'
    echo ''
    echo 'Removing qwen2.5-coder:32b...'
    ollama rm qwen2.5-coder:32b 2>/dev/null && echo '  removed' || echo '  not present (already removed)'
    echo ''
    echo 'Remaining models:'
    ollama list
    echo ''
    echo 'Ollama model dir disk usage:'
    du -sh /usr/share/ollama/.ollama/models/ 2>/dev/null || true
  "
}

cmd_setup_ssh() {
  log "SSH Config for DGX Spark"
  echo ""
  echo "Add to ~/.ssh/config:"
  echo ""
  echo "Host dgx-spark"
  echo "  HostName ${DGX_IP}"
  echo "  User ${DGX_USER}"
  echo "  IdentityFile ~/.ssh/id_ed25519"
  echo "  ServerAliveInterval 60"
  echo "  ServerAliveCountMax 3"
  echo "  # Port forwards for Cursor/Cline"
  echo "  LocalForward 11435 localhost:11434"
  echo "  LocalForward 9998 localhost:9999"
  echo "  LocalForward 8081 localhost:8081"
  echo ""
  echo "Then: ssh dgx-spark"
  echo ""
  echo "For CC Mobile (SSH tunnel via Termux/iSH):"
  echo "  ssh -L 11435:localhost:11434 -L 9998:localhost:9999 ${DGX_USER}@${DGX_IP}"
}

cmd_help() {
  echo "DGX Spark Deploy — DWS IQ Primary Runtime"
  echo ""
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  (default)      Full deploy (pull, build, start)"
  echo "  --status       Check system status"
  echo "  --restart      Restart Docker services"
  echo "  --stop         Stop services (enables GHA failover)"
  echo "  --logs         Tail container logs"
  echo "  --pull         Git pull only"
  echo "  --models       Pull Ollama models (nemotron-3-super, qwen3-coder:30b)"
  echo "  --models-cleanup  Remove deprecated models (llama3.3:70b, qwen2.5-coder:32b) — DESTRUCTIVE, prompts to confirm"
  echo "  --ssh-config   Show SSH config for Cursor/CC Mobile"
  echo "  --help         This help"
  echo ""
  echo "Environment variables:"
  echo "  DGX_SPARK_HOST   SSH host alias (default: dgx-spark)"
  echo "  DGX_SPARK_USER   SSH user (default: admin100)"
  echo "  DGX_SPARK_IP     IP address (default: 192.168.101.113)"
  echo "  DGX_SPARK_REPO   Repo path on DGX (default: /home/admin100/dws6)"
  echo "  DGX_SPARK_BRANCH Branch to deploy (default: main)"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
case "${1:-}" in
  --status)     cmd_status ;;
  --restart)    cmd_restart ;;
  --stop)       cmd_stop ;;
  --logs)       cmd_logs ;;
  --pull)       cmd_pull ;;
  --models)     cmd_ollama_models ;;
  --models-cleanup) cmd_ollama_cleanup ;;
  --ssh-config) cmd_setup_ssh ;;
  --help|-h)    cmd_help ;;
  "")           cmd_deploy ;;
  *)            err "Unknown command: $1"; cmd_help; exit 1 ;;
esac

#!/usr/bin/env bash
# DWS IQ 6 — Unified Development Launcher
# Starts all services needed for local development in one command.
#
# Usage: ./scripts/dev.sh [--backend-only] [--dashboard-only] [--all]
#
# Code-Version: 1.0.0
# Introduced-In: PR-912
# Date: 2026-03-27
# Owner: Claude Code

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
DASHBOARD_DIR="$ROOT_DIR/dws6.com/dashboard/firehorse/v10-react"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() { echo -e "${GREEN}[dev]${NC} $1"; }
warn() { echo -e "${YELLOW}[dev]${NC} $1"; }
error() { echo -e "${RED}[dev]${NC} $1"; }
header() { echo -e "\n${BLUE}━━━ $1 ━━━${NC}"; }

# Parse args
MODE="all"
case "${1:-}" in
  --backend-only)  MODE="backend" ;;
  --dashboard-only) MODE="dashboard" ;;
  --all)           MODE="all" ;;
  --help|-h)
    echo "Usage: ./scripts/dev.sh [--backend-only] [--dashboard-only] [--all]"
    echo ""
    echo "  --backend-only   Start Express backend only (port 8080)"
    echo "  --dashboard-only Start Vite dashboard only (port 5173)"
    echo "  --all            Start both (default)"
    exit 0
    ;;
esac

# Cleanup on exit
PIDS=()
cleanup() {
  log "Shutting down dev services..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
  log "All services stopped."
}
trap cleanup EXIT INT TERM

# Pre-flight checks
header "Pre-flight checks"

# Check .env
if [ ! -f "$ROOT_DIR/.env" ]; then
  warn ".env not found — copying from .env.example"
  if [ -f "$ROOT_DIR/.env.example" ]; then
    cp "$ROOT_DIR/.env.example" "$ROOT_DIR/.env"
    warn "Created .env from template — edit with real values before testing"
  else
    error "No .env or .env.example found. Create .env first."
    exit 1
  fi
fi

# Check node_modules
if [ ! -d "$ROOT_DIR/node_modules" ]; then
  warn "node_modules missing — running npm install..."
  (cd "$ROOT_DIR" && npm install)
fi

log "Environment: $(grep -c '^[^#]' "$ROOT_DIR/.env" 2>/dev/null || echo 0) vars loaded from .env"

# Start backend
start_backend() {
  header "Starting Express Backend (port ${PORT:-8080})"
  (cd "$ROOT_DIR" && npm run dev) &
  PIDS+=($!)
  log "Backend PID: ${PIDS[-1]}"
}

# Start dashboard
start_dashboard() {
  if [ ! -d "$DASHBOARD_DIR" ]; then
    error "Dashboard directory not found: $DASHBOARD_DIR"
    return 1
  fi

  # Install dashboard deps if needed
  if [ ! -d "$DASHBOARD_DIR/node_modules" ]; then
    warn "Dashboard node_modules missing — running npm install..."
    (cd "$DASHBOARD_DIR" && npm install)
  fi

  header "Starting Vite Dashboard (port 5173)"
  (cd "$DASHBOARD_DIR" && npm run dev) &
  PIDS+=($!)
  log "Dashboard PID: ${PIDS[-1]}"
}

# Launch based on mode
case "$MODE" in
  backend)
    start_backend
    ;;
  dashboard)
    start_dashboard
    ;;
  all)
    start_backend
    start_dashboard
    ;;
esac

header "DWS IQ 6 Dev Environment Running"
log "Backend:   http://localhost:${PORT:-8080}"
[ "$MODE" != "backend" ] && log "Dashboard: http://localhost:5173"
log "Health:    http://localhost:${PORT:-8080}/health"
log "Agents:    http://localhost:${PORT:-8080}/api/agents"
log "MCP:       http://localhost:${PORT:-8080}/mcp"
echo ""
log "Press Ctrl+C to stop all services"

# Wait for all background processes
wait

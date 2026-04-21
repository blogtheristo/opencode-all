#!/usr/bin/env bash
# =============================================================================
# deploy-acer-postgres.sh — Deploy DWS Edge PostgreSQL to Acer Veriton GN100
# =============================================================================
# Deploys PostgreSQL 16 + TimescaleDB + pg_duckdb + pgvector over SSH.
#
# Prerequisites:
#   - SSH access to gn100-cb5d (admin100 user)
#   - Docker + Docker Compose installed on GN100
#   - VPN or direct network access to the device
#
# Usage:
#   ./scripts/deploy-acer-postgres.sh                    # deploy
#   ./scripts/deploy-acer-postgres.sh --status           # check status
#   ./scripts/deploy-acer-postgres.sh --logs             # tail logs
#   ./scripts/deploy-acer-postgres.sh --connect          # psql shell
#   ./scripts/deploy-acer-postgres.sh --tunnel           # open SSH tunnel
#   ./scripts/deploy-acer-postgres.sh --destroy          # stop + remove
#
# Version: 1.0.0
# License: Proprietary — Lifetime Oy
# =============================================================================

set -euo pipefail

# =============================================================================
# Configuration
# =============================================================================
REMOTE_USER="${ACER_SSH_USER:-admin100}"
REMOTE_HOST="${ACER_SSH_HOST:-gn100-cb5d}"
REMOTE_DIR="/opt/dws/edge-postgres"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../Admin/Acer-Veriton-GN100/postgres" && pwd)"
SSH_OPTS="-o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# =============================================================================
# SSH helper with retry
# =============================================================================
ssh_cmd() {
    local retries=4
    local delay=2
    local attempt=1

    while [ $attempt -le $retries ]; do
        if ssh ${SSH_OPTS} "${REMOTE_USER}@${REMOTE_HOST}" "$@" 2>/dev/null; then
            return 0
        fi
        if [ $attempt -lt $retries ]; then
            log_warn "SSH attempt $attempt failed, retrying in ${delay}s..."
            sleep $delay
            delay=$((delay * 2))
        fi
        attempt=$((attempt + 1))
    done

    log_error "SSH failed after $retries attempts"
    return 1
}

scp_cmd() {
    local retries=4
    local delay=2
    local attempt=1

    while [ $attempt -le $retries ]; do
        if scp ${SSH_OPTS} "$@" 2>/dev/null; then
            return 0
        fi
        if [ $attempt -lt $retries ]; then
            log_warn "SCP attempt $attempt failed, retrying in ${delay}s..."
            sleep $delay
            delay=$((delay * 2))
        fi
        attempt=$((attempt + 1))
    done

    log_error "SCP failed after $retries attempts"
    return 1
}

# =============================================================================
# Commands
# =============================================================================

cmd_deploy() {
    log_info "Deploying DWS Edge PostgreSQL to ${REMOTE_USER}@${REMOTE_HOST}"

    # Verify local files exist
    for f in Dockerfile docker-compose.yml init.sql .env.example; do
        if [ ! -f "${LOCAL_DIR}/${f}" ]; then
            log_error "Missing ${LOCAL_DIR}/${f}"
            exit 1
        fi
    done

    # Check .env exists locally (needed for password)
    if [ ! -f "${LOCAL_DIR}/.env" ]; then
        log_error "Missing ${LOCAL_DIR}/.env — copy from .env.example and set EDGE_PG_PASSWORD"
        exit 1
    fi

    # Create remote directory
    log_info "Creating remote directory ${REMOTE_DIR}"
    ssh_cmd "sudo mkdir -p ${REMOTE_DIR} && sudo chown ${REMOTE_USER}:${REMOTE_USER} ${REMOTE_DIR}"

    # Copy files
    log_info "Copying deployment files..."
    scp_cmd \
        "${LOCAL_DIR}/Dockerfile" \
        "${LOCAL_DIR}/docker-compose.yml" \
        "${LOCAL_DIR}/init.sql" \
        "${LOCAL_DIR}/.env" \
        "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/"

    # Verify Docker is available
    log_info "Verifying Docker on remote host..."
    ssh_cmd "docker info --format '{{.OSType}}/{{.Architecture}}'" || {
        log_error "Docker not available on ${REMOTE_HOST}"
        exit 1
    }

    # Build and start
    log_info "Building Docker image (this may take a few minutes on first run)..."
    ssh_cmd "cd ${REMOTE_DIR} && docker compose build --no-cache postgres"

    log_info "Starting PostgreSQL..."
    ssh_cmd "cd ${REMOTE_DIR} && docker compose up -d postgres"

    # Wait for health check
    log_info "Waiting for PostgreSQL to become healthy..."
    local max_wait=60
    local waited=0
    while [ $waited -lt $max_wait ]; do
        if ssh_cmd "docker inspect --format='{{.State.Health.Status}}' dws-edge-postgres 2>/dev/null" | grep -q "healthy"; then
            log_info "PostgreSQL is healthy!"
            break
        fi
        sleep 5
        waited=$((waited + 5))
        echo -n "."
    done

    if [ $waited -ge $max_wait ]; then
        log_warn "PostgreSQL did not become healthy within ${max_wait}s — check logs"
        ssh_cmd "cd ${REMOTE_DIR} && docker compose logs --tail 50 postgres"
        exit 1
    fi

    # Verify extensions
    log_info "Verifying extensions..."
    ssh_cmd "docker exec dws-edge-postgres psql -U dws_edge -d dws_edge -c \"SELECT extname, extversion FROM pg_extension WHERE extname IN ('timescaledb','duckdb','vector') ORDER BY extname;\""

    echo ""
    log_info "=== Deployment complete ==="
    log_info "Host: ${REMOTE_HOST}:5432 (localhost only)"
    log_info "SSH tunnel: ssh -L 5432:127.0.0.1:5432 ${REMOTE_USER}@${REMOTE_HOST}"
    log_info "Connect:    psql postgresql://dws_edge@localhost:5432/dws_edge"
}

cmd_status() {
    log_info "Checking DWS Edge PostgreSQL status on ${REMOTE_HOST}..."
    ssh_cmd "docker inspect --format='Name: {{.Name}} | Status: {{.State.Status}} | Health: {{.State.Health.Status}} | Started: {{.State.StartedAt}}' dws-edge-postgres 2>/dev/null" || {
        log_warn "Container dws-edge-postgres not found"
        return 1
    }
    # Show extension versions
    ssh_cmd "docker exec dws-edge-postgres psql -U dws_edge -d dws_edge -c \"SELECT extname, extversion FROM pg_extension ORDER BY extname;\"" 2>/dev/null || true
    # Show disk usage
    ssh_cmd "docker exec dws-edge-postgres du -sh /var/lib/postgresql/data" 2>/dev/null || true
}

cmd_logs() {
    log_info "Tailing logs from dws-edge-postgres..."
    ssh_cmd "cd ${REMOTE_DIR} && docker compose logs -f --tail 100 postgres"
}

cmd_connect() {
    log_info "Opening psql shell via SSH..."
    ssh ${SSH_OPTS} -t "${REMOTE_USER}@${REMOTE_HOST}" \
        "docker exec -it dws-edge-postgres psql -U dws_edge -d dws_edge"
}

cmd_tunnel() {
    local local_port="${1:-15432}"
    log_info "Opening SSH tunnel: localhost:${local_port} -> ${REMOTE_HOST}:5432"
    log_info "Connect with: psql postgresql://dws_edge@localhost:${local_port}/dws_edge"
    log_info "Press Ctrl+C to close tunnel"
    ssh ${SSH_OPTS} -N -L "${local_port}:127.0.0.1:5432" "${REMOTE_USER}@${REMOTE_HOST}"
}

cmd_destroy() {
    log_warn "This will stop the container. Data volume is preserved."
    read -r -p "Continue? [y/N] " confirm
    if [[ "$confirm" =~ ^[Yy]$ ]]; then
        ssh_cmd "cd ${REMOTE_DIR} && docker compose down"
        log_info "Container stopped. Data volume preserved."
        log_info "To delete data: ssh ${REMOTE_USER}@${REMOTE_HOST} 'cd ${REMOTE_DIR} && docker compose down -v'"
    fi
}

# =============================================================================
# Main
# =============================================================================

case "${1:-deploy}" in
    deploy|--deploy)    cmd_deploy ;;
    status|--status)    cmd_status ;;
    logs|--logs)        cmd_logs ;;
    connect|--connect)  cmd_connect ;;
    tunnel|--tunnel)    cmd_tunnel "${2:-15432}" ;;
    destroy|--destroy)  cmd_destroy ;;
    -h|--help)
        echo "Usage: $0 [deploy|status|logs|connect|tunnel|destroy]"
        echo ""
        echo "Commands:"
        echo "  deploy   Build and deploy PostgreSQL to Acer GN100 (default)"
        echo "  status   Check container status and extensions"
        echo "  logs     Tail PostgreSQL logs"
        echo "  connect  Open psql shell via SSH"
        echo "  tunnel   Open SSH tunnel (default port: 15432)"
        echo "  destroy  Stop container (data preserved)"
        ;;
    *)
        log_error "Unknown command: $1"
        echo "Run '$0 --help' for usage"
        exit 1
        ;;
esac

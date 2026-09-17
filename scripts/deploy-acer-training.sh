#!/usr/bin/env bash
# =============================================================================
# deploy-acer-training.sh — Deploy & run the QLoRA training stack on Acer GN100
# =============================================================================
# Mirrors scripts/deploy-acer-postgres.sh. Syncs the training build context to
# the Acer Veriton GN100, builds the ARM64 training container, and runs a QLoRA
# fine-tune. Before a run it switches the box to training mode
# (scripts/training-mode.sh) to free GPU/host memory from the Ollama/agent stack.
#
# Prerequisites:
#   - SSH access to gn100-cb5d (admin100 user)
#   - Docker + NVIDIA Container Toolkit on the GN100 (validated — see
#     Admin/Acer-Veriton-GN100/README.md)
#   - Admin/Acer-Veriton-GN100/training/.env.training present locally (HF_TOKEN)
#
# Usage:
#   ./scripts/deploy-acer-training.sh deploy                         # sync + build image
#   ./scripts/deploy-acer-training.sh train --config configs/gn100-8b-qlora.yaml \
#          --dataset /datasets/kemira.jsonl --output-dir /checkpoints/8b-qlora
#   ./scripts/deploy-acer-training.sh status                         # container/GPU status
#   ./scripts/deploy-acer-training.sh logs                           # tail training logs
#   ./scripts/deploy-acer-training.sh destroy                        # stop + remove
#   ./scripts/deploy-acer-training.sh --dry-run deploy               # print plan, no SSH
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
REMOTE_DIR="/opt/dws/edge-training"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TRAIN_DIR="Admin/Acer-Veriton-GN100/training"
SSH_OPTS="-o ConnectTimeout=10 -o StrictHostKeyChecking=accept-new"
DRY_RUN=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# =============================================================================
# SSH / transfer helpers with retry (mirrors deploy-acer-postgres.sh)
# =============================================================================
ssh_cmd() {
    if [ "$DRY_RUN" -eq 1 ]; then
        log_info "(dry-run) ssh ${REMOTE_USER}@${REMOTE_HOST} $*"
        return 0
    fi
    local retries=4 delay=2 attempt=1
    while [ $attempt -le $retries ]; do
        if ssh ${SSH_OPTS} "${REMOTE_USER}@${REMOTE_HOST}" "$@"; then
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

# Sync the build context (preserving relative paths so compose's
# `context: ../../..` resolves on the remote) via a tar stream over SSH.
sync_context() {
    log_info "Syncing training context to ${REMOTE_HOST}:${REMOTE_DIR}"
    if [ "$DRY_RUN" -eq 1 ]; then
        log_info "(dry-run) would tar infrastructure/llm-training, evals, ${TRAIN_DIR}, scripts/training-mode.sh"
        return 0
    fi
    ssh_cmd "mkdir -p ${REMOTE_DIR}"
    local retries=4 delay=2 attempt=1
    while [ $attempt -le $retries ]; do
        if tar czf - -C "${REPO_ROOT}" \
                infrastructure/llm-training evals \
                "${TRAIN_DIR}" scripts/training-mode.sh \
            | ssh ${SSH_OPTS} "${REMOTE_USER}@${REMOTE_HOST}" \
                "tar xzf - -C ${REMOTE_DIR}"; then
            return 0
        fi
        if [ $attempt -lt $retries ]; then
            log_warn "sync attempt $attempt failed, retrying in ${delay}s..."
            sleep $delay
            delay=$((delay * 2))
        fi
        attempt=$((attempt + 1))
    done
    log_error "Context sync failed after $retries attempts"
    return 1
}

# =============================================================================
# Commands
# =============================================================================
cmd_deploy() {
    log_info "Deploying training stack to ${REMOTE_USER}@${REMOTE_HOST}"

    # Verify local build files exist.
    for f in \
        "${TRAIN_DIR}/Dockerfile" \
        "${TRAIN_DIR}/docker-compose.training.yml" \
        "infrastructure/llm-training/requirements.txt" \
        "infrastructure/llm-training/scripts/train-70b-lora.py"; do
        if [ ! -f "${REPO_ROOT}/${f}" ]; then
            log_error "Missing ${f}"
            exit 1
        fi
    done

    # Secret file must exist locally (never committed / never copied by tar list).
    if [ ! -f "${REPO_ROOT}/${TRAIN_DIR}/.env.training" ]; then
        log_error "Missing ${TRAIN_DIR}/.env.training — copy from .env.training.example and set HF_TOKEN"
        exit 1
    fi

    sync_context
    # Copy the secret separately (kept out of the tar list above on purpose).
    if [ "$DRY_RUN" -eq 0 ]; then
        scp ${SSH_OPTS} "${REPO_ROOT}/${TRAIN_DIR}/.env.training" \
            "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/${TRAIN_DIR}/.env.training"
    fi

    # Verify Docker is ARM64 on the host (fail loud on an amd64 mismatch).
    log_info "Verifying Docker architecture on remote host..."
    ssh_cmd "docker info --format '{{.OSType}}/{{.Architecture}}'"

    log_info "Building training image (first build pulls the NGC base — slow)..."
    ssh_cmd "cd ${REMOTE_DIR}/${TRAIN_DIR} && docker compose -f docker-compose.training.yml build"

    log_info "=== Deploy complete. Run a job with: $0 train --config <cfg> --dataset <path> ==="
}

cmd_train() {
    # Pass-through args after `train` go straight to the trainer CLI.
    local passthrough=("$@")
    if [ ${#passthrough[@]} -eq 0 ]; then
        log_error "train requires trainer args, e.g. --config configs/gn100-8b-qlora.yaml --dataset /datasets/x.jsonl"
        exit 1
    fi

    log_info "Switching GN100 to training mode (frees Ollama/agent memory)..."
    ssh_cmd "bash ${REMOTE_DIR}/scripts/training-mode.sh" || \
        log_warn "training-mode.sh returned non-zero (continuing — verify memory)"

    log_info "Launching training job: ${passthrough[*]}"
    ssh_cmd "cd ${REMOTE_DIR}/${TRAIN_DIR} && docker compose -f docker-compose.training.yml run --rm trainer ${passthrough[*]}"

    log_info "=== Training run finished. Checkpoints under ${REMOTE_DIR}/${TRAIN_DIR}/checkpoints ==="
}

cmd_status() {
    log_info "Training container status on ${REMOTE_HOST}:"
    ssh_cmd "docker inspect --format='Name: {{.Name}} | Status: {{.State.Status}} | Started: {{.State.StartedAt}}' dws-gn100-trainer 2>/dev/null" || \
        log_warn "Container dws-gn100-trainer not found (no active run)"
    log_info "GPU status:"
    ssh_cmd "nvidia-smi --query-gpu=name,memory.used,memory.total,utilization.gpu --format=csv 2>/dev/null" || \
        log_warn "nvidia-smi unavailable"
}

cmd_logs() {
    log_info "Tailing training logs from ${REMOTE_HOST}..."
    ssh_cmd "cd ${REMOTE_DIR}/${TRAIN_DIR} && docker compose -f docker-compose.training.yml logs -f --tail 100"
}

cmd_destroy() {
    log_warn "This stops and removes the training container. Checkpoints on disk are preserved."
    if [ "$DRY_RUN" -eq 0 ]; then
        read -r -p "Continue? [y/N] " confirm
        [[ "$confirm" =~ ^[Yy]$ ]] || { log_info "Aborted."; return 0; }
    fi
    ssh_cmd "cd ${REMOTE_DIR}/${TRAIN_DIR} && docker compose -f docker-compose.training.yml down"
    log_info "Training container removed. Checkpoints preserved."
}

usage() {
    cat <<EOF
Usage: $0 [--dry-run] <command> [args]

Commands:
  deploy                 Sync context to GN100 and build the ARM64 training image
  train <trainer args>   Free memory (training-mode.sh) then run a fine-tune, e.g.
                         $0 train --config configs/gn100-8b-qlora.yaml \\
                                  --dataset /datasets/x.jsonl --output-dir /checkpoints/8b-qlora
  status                 Show container + GPU status
  logs                   Tail training logs
  destroy                Stop/remove the container (checkpoints preserved)

Options:
  --dry-run              Print the plan without touching the remote host
  -h, --help             Show this help

Env: ACER_SSH_USER (default admin100), ACER_SSH_HOST (default gn100-cb5d)
See Admin/Acer-Veriton-GN100/TRAINING_RUNBOOK.md for the full workflow.
EOF
}

# =============================================================================
# Main
# =============================================================================
if [ "${1:-}" = "--dry-run" ]; then
    DRY_RUN=1
    shift
fi

case "${1:-help}" in
    deploy)             cmd_deploy ;;
    train)              shift; cmd_train "$@" ;;
    status)             cmd_status ;;
    logs)               cmd_logs ;;
    destroy)            cmd_destroy ;;
    -h|--help|help)     usage ;;
    *)
        log_error "Unknown command: ${1:-}"
        usage
        exit 1
        ;;
esac

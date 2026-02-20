#!/bin/bash
#
# dws6-tmux-session.sh
# Creates a TMUX development session for DWS6 with structured panes.
#
# Layouts:
#   dev       — Dashboard dev + Claude Code + git log
#   remote    — SSH remote server management (Jitsi/Hetzner)
#   full      — All panes: dashboard, Claude, server, logs
#
# Usage:
#   ./dws6-tmux-session.sh [layout] [--ssh user@host]
#
# Examples:
#   ./dws6-tmux-session.sh dev
#   ./dws6-tmux-session.sh remote --ssh root@jitsi.dws6.com
#   ./dws6-tmux-session.sh full --ssh root@hetzner-hel1
#

set -e

# ============================================================================
# CONFIGURATION
# ============================================================================

LAYOUT="${1:-dev}"
SSH_TARGET=""
SESSION_NAME="dws6"

# Paths
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DASHBOARD_DIR="$REPO_ROOT/dws6.com/dashboard/firehorse/v10-react"

# Parse flags
for arg in "$@"; do
    case $arg in
        --ssh)
            shift
            SSH_TARGET="${1:-}"
            ;;
    esac
    shift 2>/dev/null || true
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ============================================================================
# FUNCTIONS
# ============================================================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_header() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}========================================${NC}\n"
}

check_dependencies() {
    if ! command -v tmux &>/dev/null; then
        log_error "tmux is not installed. Install with: sudo apt install tmux"
        exit 1
    fi
}

kill_existing_session() {
    if tmux has-session -t "$SESSION_NAME" 2>/dev/null; then
        log_warn "Session '$SESSION_NAME' already exists."
        echo -n "Attach to existing session? [Y/n]: "
        read -r answer
        if [[ "$answer" =~ ^[Nn]$ ]]; then
            tmux kill-session -t "$SESSION_NAME"
            log_info "Killed existing session."
        else
            tmux attach -t "$SESSION_NAME"
            exit 0
        fi
    fi
}

# ============================================================================
# LAYOUT: dev
# ┌─────────────────────┬──────────────────┐
# │                     │                  │
# │   Dashboard Dev     │   Claude Code    │
# │   (vite dev)        │                  │
# │                     │                  │
# ├─────────────────────┴──────────────────┤
# │              git log / status          │
# └────────────────────────────────────────┘
# ============================================================================

layout_dev() {
    log_info "Creating 'dev' layout..."

    tmux new-session -d -s "$SESSION_NAME" -c "$DASHBOARD_DIR" -n "dev"

    # Left pane: Dashboard dev server
    tmux send-keys -t "$SESSION_NAME:dev" "cd $DASHBOARD_DIR && echo '-- Dashboard Dev Server --' && npm run dev" C-m

    # Right pane: Claude Code workspace
    tmux split-window -h -t "$SESSION_NAME:dev" -c "$REPO_ROOT"
    tmux send-keys -t "$SESSION_NAME:dev.1" "echo '-- Claude Code --' && echo 'Run: claude'" C-m

    # Bottom pane: Git status
    tmux split-window -v -t "$SESSION_NAME:dev.0" -c "$REPO_ROOT" -l 8
    tmux send-keys -t "$SESSION_NAME:dev.2" "git log --oneline -10 && echo '' && git status -sb" C-m

    # Focus on Claude Code pane
    tmux select-pane -t "$SESSION_NAME:dev.1"
}

# ============================================================================
# LAYOUT: remote
# ┌─────────────────────┬──────────────────┐
# │                     │                  │
# │   SSH Remote        │   Claude Code    │
# │   (server mgmt)     │   (SSH mode)     │
# │                     │                  │
# └─────────────────────┴──────────────────┘
# ============================================================================

layout_remote() {
    if [[ -z "$SSH_TARGET" ]]; then
        log_error "Remote layout requires --ssh flag. Example:"
        echo "  ./dws6-tmux-session.sh remote --ssh root@jitsi.dws6.com"
        exit 1
    fi

    log_info "Creating 'remote' layout for $SSH_TARGET..."

    tmux new-session -d -s "$SESSION_NAME" -c "$REPO_ROOT" -n "remote"

    # Left pane: SSH to remote server
    tmux send-keys -t "$SESSION_NAME:remote" "echo '-- SSH: $SSH_TARGET --' && ssh $SSH_TARGET" C-m

    # Right pane: Claude Code for local repo work
    tmux split-window -h -t "$SESSION_NAME:remote" -c "$REPO_ROOT"
    tmux send-keys -t "$SESSION_NAME:remote.1" "echo '-- Claude Code --' && echo 'Run: claude'" C-m

    # Focus on SSH pane
    tmux select-pane -t "$SESSION_NAME:remote.0"
}

# ============================================================================
# LAYOUT: full
# ┌─────────────────────┬──────────────────┐
# │                     │                  │
# │   Dashboard Dev     │   Claude Code    │
# │   (vite dev)        │                  │
# ├─────────────────────┼──────────────────┤
# │   SSH Remote        │   Logs / Monitor │
# │   (server mgmt)     │                  │
# └─────────────────────┴──────────────────┘
# ============================================================================

layout_full() {
    log_info "Creating 'full' layout..."

    tmux new-session -d -s "$SESSION_NAME" -c "$DASHBOARD_DIR" -n "full"

    # Top-left: Dashboard dev server
    tmux send-keys -t "$SESSION_NAME:full" "cd $DASHBOARD_DIR && echo '-- Dashboard Dev --' && npm run dev" C-m

    # Top-right: Claude Code
    tmux split-window -h -t "$SESSION_NAME:full" -c "$REPO_ROOT"
    tmux send-keys -t "$SESSION_NAME:full.1" "echo '-- Claude Code --' && echo 'Run: claude'" C-m

    # Bottom-left: SSH or shell
    tmux split-window -v -t "$SESSION_NAME:full.0" -c "$REPO_ROOT"
    if [[ -n "$SSH_TARGET" ]]; then
        tmux send-keys -t "$SESSION_NAME:full.2" "echo '-- SSH: $SSH_TARGET --' && ssh $SSH_TARGET" C-m
    else
        tmux send-keys -t "$SESSION_NAME:full.2" "echo '-- Server Shell (use --ssh to connect) --'" C-m
    fi

    # Bottom-right: Logs / monitoring
    tmux split-window -h -t "$SESSION_NAME:full.2" -c "$REPO_ROOT"
    tmux send-keys -t "$SESSION_NAME:full.3" "echo '-- Logs --' && git log --oneline -15 && echo '' && git status -sb" C-m

    # Focus on Claude Code pane
    tmux select-pane -t "$SESSION_NAME:full.1"
}

# ============================================================================
# MAIN
# ============================================================================

log_header "DWS6 TMUX Session"
check_dependencies
kill_existing_session

case "$LAYOUT" in
    dev)
        layout_dev
        ;;
    remote)
        layout_remote
        ;;
    full)
        layout_full
        ;;
    *)
        log_error "Unknown layout: $LAYOUT"
        echo ""
        echo "Available layouts:"
        echo "  dev      Dashboard dev + Claude Code + git"
        echo "  remote   SSH server + Claude Code"
        echo "  full     All four panes"
        echo ""
        echo "Usage: $0 [dev|remote|full] [--ssh user@host]"
        exit 1
        ;;
esac

log_info "Session '$SESSION_NAME' created with '$LAYOUT' layout."
echo ""
echo -e "  ${CYAN}Attach:${NC}   tmux attach -t $SESSION_NAME"
echo -e "  ${CYAN}Detach:${NC}   Ctrl+B, then D"
echo -e "  ${CYAN}Switch:${NC}   Ctrl+B, then arrow keys"
echo -e "  ${CYAN}Kill:${NC}     tmux kill-session -t $SESSION_NAME"
echo ""

# Auto-attach
tmux attach -t "$SESSION_NAME"

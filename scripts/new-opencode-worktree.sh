#!/bin/bash
#
# new-opencode-worktree.sh
# Creates an isolated git worktree for OpenCode agent sessions.
#
# WHY THIS EXISTS (2026-08-22 incident):
# Multiple concurrent agents sharing the primary checkout caused staged-index
# races — one agent's commit swept up another agent's staged files
# (dca623b3c). Policy (WORKTREE_POLICY.md): agents NEVER commit from the
# primary checkout; each session works in its own worktree.
#
# Mirrors scripts/new-claude-worktree.sh conventions.
#
# Usage:
#   ./new-opencode-worktree.sh <task-name> [base-branch] [--launch] [--no-install]
#   OPENCODE_TASK=fix-auth ./new-opencode-worktree.sh
#
# Examples:
#   ./new-opencode-worktree.sh design-system-phase2
#   ./new-opencode-worktree.sh fix-nav-mirror main --launch

set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log_info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

TASK_NAME="${OPENCODE_TASK:-}"
BASE_BRANCH="main"
LAUNCH=false
NO_INSTALL=false

POSITIONALS=()
while [[ $# -gt 0 ]]; do
    case "$1" in
        --launch)     LAUNCH=true; shift ;;
        --no-install) NO_INSTALL=true; shift ;;
        -*)           log_error "Unknown flag: $1"; exit 1 ;;
        *)            POSITIONALS+=("$1"); shift ;;
    esac
done

[[ ${#POSITIONALS[@]} -ge 1 && -n "${POSITIONALS[0]}" ]] && TASK_NAME="${POSITIONALS[0]}"
[[ ${#POSITIONALS[@]} -ge 2 ]] && BASE_BRANCH="${POSITIONALS[1]}"

if [[ -z "$TASK_NAME" ]]; then
    echo "Usage: $0 <task-name> [base-branch] [--launch] [--no-install]"
    echo "   or: OPENCODE_TASK=<name> $0"
    exit 1
fi

if [[ ! "$TASK_NAME" =~ ^[a-zA-Z0-9._/-]+$ ]]; then
    log_error "Invalid task name: $TASK_NAME"
    exit 1
fi

# ============================================================================
# Locate main repo (must NOT itself be a linked worktree)
# ============================================================================
MAIN_REPO="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null)")"
MAIN_REPO="${MAIN_REPO:-$(pwd)}"

if [[ ! -d "$MAIN_REPO/.git" ]]; then
    log_error "Cannot locate main DWS6 repository from $(pwd)"
    exit 1
fi

# Worktree root — outside the repo so no tool ever scans/commits it
WORKTREE_ROOT="$HOME/.opencode-worktrees/$(basename "$MAIN_REPO")"
mkdir -p "$WORKTREE_ROOT"

BRANCH_NAME="opencode/$TASK_NAME"
NEW_WORKTREE="$WORKTREE_ROOT/$TASK_NAME"

if [[ -d "$NEW_WORKTREE" ]]; then
    log_error "Worktree already exists: $NEW_WORKTREE"
    log_error "Reuse it (cd $NEW_WORKTREE) or remove: git worktree remove $NEW_WORKTREE"
    exit 1
fi

log_info "Main repository: $MAIN_REPO"
log_info "Worktree root:   $WORKTREE_ROOT"

# ============================================================================
# [1/4] Create worktree + branch
# ============================================================================
cd "$MAIN_REPO"
git fetch origin main --quiet 2>/dev/null || true

if git show-ref --verify --quiet "refs/heads/opencode/$TASK_NAME"; then
    log_info "Checking out existing branch: $BRANCH_NAME"
    git worktree add "$NEW_WORKTREE" "$BRANCH_NAME"
else
    log_info "Creating branch $BRANCH_NAME from origin/$BASE_BRANCH"
    git worktree add -b "$BRANCH_NAME" "$NEW_WORKTREE" "origin/$BASE_BRANCH" 2>/dev/null \
        || git worktree add -b "$BRANCH_NAME" "$NEW_WORKTREE" "$BASE_BRANCH"
fi

# ============================================================================
# [2/4] Environment: venv symlink + secrets/config
# ============================================================================
if [[ -d "$MAIN_REPO/venv" && ! -e "$NEW_WORKTREE/venv" ]]; then
    ln -s "$MAIN_REPO/venv" "$NEW_WORKTREE/venv"
    log_info "Symlinked venv -> $MAIN_REPO/venv"
fi

for f in .env .env.local .mcp.json; do
    if [[ -f "$MAIN_REPO/$f" ]]; then
        cp "$MAIN_REPO/$f" "$NEW_WORKTREE/$f"
        log_info "Copied: $f"
    fi
done

if [[ -d "$MAIN_REPO/.opencode" ]]; then
    mkdir -p "$NEW_WORKTREE/.opencode"
    # Copy settings, never session state / memory (per-agent)
    find "$MAIN_REPO/.opencode" -maxdepth 1 -name "*.json*" -exec cp {} "$NEW_WORKTREE/.opencode/" \;
    log_info "Copied: .opencode settings (not session state)"
fi

# ============================================================================
# [3/4] Install dependencies (Node workspaces used most by agents)
# ============================================================================
if [[ "$NO_INSTALL" == false ]]; then
    if [[ -f "$NEW_WORKTREE/package.json" ]] && command -v npm &>/dev/null; then
        log_info "npm install (root)..."
        (cd "$NEW_WORKTREE" && npm install --no-audit --no-fund --loglevel=error) || \
            log_warn "Root npm install failed — install manually"
        if [[ -f "$NEW_WORKTREE/dws6.com/dashboard/firehorse/v10-react/package.json" ]]; then
            log_info "npm install (dashboard)..."
            (cd "$NEW_WORKTREE/dws6.com/dashboard/firehorse/v10-react" && \
             npm install --no-audit --no-fund --loglevel=error) || \
                log_warn "Dashboard npm install failed — install manually"
        fi
    fi
fi

# ============================================================================
# [4/4] Summary
# ============================================================================
echo ""
echo -e "${CYAN}----------------------------------------${NC}"
echo -e "${CYAN}  OPENCODE WORKTREE READY${NC}"
echo -e "${CYAN}----------------------------------------${NC}"
echo -e "  Path:   $NEW_WORKTREE"
echo -e "  Branch: $BRANCH_NAME"
echo -e "  Base:   $BASE_BRANCH"
echo -e "${CYAN}----------------------------------------${NC}"
echo ""
echo "Rules (WORKTREE_POLICY.md):"
echo "  1. Commit ONLY from this worktree, never the primary checkout"
echo "  2. Push branch and open PR: git push -u origin $BRANCH_NAME"
echo "  3. After merge, clean up:"
echo "       git worktree remove $NEW_WORKTREE"
echo "       git branch -d $BRANCH_NAME"
echo ""

git -C "$MAIN_REPO" worktree list

if [[ "$LAUNCH" == true ]]; then
    log_info "Launching opencode..."
    cd "$NEW_WORKTREE"
    exec opencode
else
    echo "Start working:  cd '$NEW_WORKTREE' && opencode"
fi

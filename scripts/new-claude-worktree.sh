#!/bin/bash
#
# new-claude-worktree.sh
# Creates a new git worktree with proper environment setup for Claude Code workflows.
#
# Based on Daniel San's workflow (Ghostty + Worktrees + Lazygit)
# References:
#   - https://x.com/dani_avila7
#   - https://huonw.github.io/blog/2020/04/worktrees-and-pyenv/
#   - https://www.geeky-gadgets.com/how-to-use-git-worktrees-with-claude-code-for-seamless-multitasking/
#
# Usage:
#   ./new-claude-worktree.sh <branch-name> [base-branch] [--no-venv-symlink] [--launch-claude]
#
# Examples:
#   ./new-claude-worktree.sh feature-auth-improvements
#   ./new-claude-worktree.sh fix-api-bug develop --launch-claude
#

set -e

# ============================================================================
# CONFIGURATION
# ============================================================================

BRANCH_NAME="${1:-}"
BASE_BRANCH="${2:-main}"
NO_VENV_SYMLINK=false
LAUNCH_CLAUDE=false

# Parse optional flags
for arg in "$@"; do
    case $arg in
        --no-venv-symlink)
            NO_VENV_SYMLINK=true
            ;;
        --launch-claude)
            LAUNCH_CLAUDE=true
            ;;
    esac
done

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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

find_main_repo() {
    # Try common paths
    local possible_paths=(
        "$HOME/repos/dws6"
        "$HOME/Developer/dws6"
        "$HOME/Projects/dws6"
        "/mnt/chromeos/MyFiles/repos/dws6"
        "$(dirname "$(git rev-parse --git-common-dir 2>/dev/null)")"
    )

    for path in "${possible_paths[@]}"; do
        if [[ -d "$path/.git" ]]; then
            echo "$path"
            return 0
        fi
    done

    return 1
}

get_worktree_root() {
    local main_repo="$1"
    local parent_dir
    parent_dir="$(dirname "$main_repo")"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "$HOME/.claude-worktrees/dws6"
    elif [[ -d "/mnt/chromeos" ]]; then
        # Chromebook (Crostini)
        echo "$parent_dir/.claude-worktrees/dws6"
    else
        # Generic Linux / iOS (iSH, a]Shell)
        echo "$HOME/.claude-worktrees/dws6"
    fi
}

# ============================================================================
# MAIN SCRIPT
# ============================================================================

# Validate branch name
if [[ -z "$BRANCH_NAME" ]]; then
    echo "Usage: $0 <branch-name> [base-branch] [--no-venv-symlink] [--launch-claude]"
    echo ""
    echo "Examples:"
    echo "  $0 feature-auth-improvements"
    echo "  $0 fix-api-bug develop --launch-claude"
    exit 1
fi

if [[ ! "$BRANCH_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    log_error "Invalid branch name: $BRANCH_NAME"
    log_error "Use only letters, numbers, hyphens, and underscores."
    exit 1
fi

log_header "DWS6 Claude Worktree Creator"

# Find main repository
MAIN_REPO=$(find_main_repo)
if [[ -z "$MAIN_REPO" ]]; then
    log_error "Cannot locate main DWS6 repository."
    log_error "Set MAIN_REPO environment variable or run from within repo."
    exit 1
fi

log_info "Main repository: $MAIN_REPO"

# Get worktree root
WORKTREE_ROOT=$(get_worktree_root "$MAIN_REPO")
log_info "Worktree root: $WORKTREE_ROOT"

# Create worktree root if needed
mkdir -p "$WORKTREE_ROOT"

# Define new worktree path
NEW_WORKTREE="$WORKTREE_ROOT/$BRANCH_NAME"

if [[ -d "$NEW_WORKTREE" ]]; then
    log_error "Worktree path already exists: $NEW_WORKTREE"
    exit 1
fi

# ============================================================================
# STEP 1: Create Git Worktree
# ============================================================================

log_info "[1/5] Creating git worktree..."

cd "$MAIN_REPO"

# Check if branch exists
if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    log_info "  Checking out existing branch: $BRANCH_NAME"
    git worktree add "$NEW_WORKTREE" "$BRANCH_NAME"
elif git show-ref --verify --quiet "refs/remotes/origin/$BRANCH_NAME"; then
    log_info "  Checking out remote branch: origin/$BRANCH_NAME"
    git worktree add "$NEW_WORKTREE" "$BRANCH_NAME"
else
    log_info "  Creating new branch: $BRANCH_NAME (from $BASE_BRANCH)"
    git worktree add -b "$BRANCH_NAME" "$NEW_WORKTREE" "$BASE_BRANCH"
fi

if [[ ! -d "$NEW_WORKTREE" ]]; then
    log_error "Failed to create worktree at: $NEW_WORKTREE"
    exit 1
fi

log_info "  Worktree created at: $NEW_WORKTREE"

# ============================================================================
# STEP 2: Verify .gitignore
# ============================================================================

log_info "[2/5] Verifying .gitignore inheritance..."

MAIN_GITIGNORE="$MAIN_REPO/.gitignore"
if [[ -f "$MAIN_GITIGNORE" ]]; then
    # Check for critical patterns
    REQUIRED_PATTERNS=(".env" ".venv/" "Admin/" "*.secret" "*.key")
    MISSING_PATTERNS=()

    for pattern in "${REQUIRED_PATTERNS[@]}"; do
        if ! grep -q "$pattern" "$MAIN_GITIGNORE" 2>/dev/null; then
            MISSING_PATTERNS+=("$pattern")
        fi
    done

    if [[ ${#MISSING_PATTERNS[@]} -gt 0 ]]; then
        log_warn "  .gitignore missing critical patterns: ${MISSING_PATTERNS[*]}"
        log_warn "  Update $MAIN_GITIGNORE before committing sensitive files!"
    else
        log_info "  .gitignore verified (inherited from main repo)"
    fi
else
    log_error "  Main repo missing .gitignore! This is a security risk."
    exit 1
fi

# ============================================================================
# STEP 3: Symlink Python Virtual Environment
# ============================================================================

log_info "[3/5] Setting up Python virtual environment..."

MAIN_VENV="$MAIN_REPO/.venv"
WORKTREE_VENV="$NEW_WORKTREE/.venv"

if [[ "$NO_VENV_SYMLINK" == true ]]; then
    log_warn "  Skipping venv symlink (--no-venv-symlink specified)"
    echo "  Run 'python -m venv .venv' in worktree to create isolated environment"
elif [[ -d "$MAIN_VENV" ]]; then
    log_info "  Creating symlink to main .venv..."
    ln -s "$MAIN_VENV" "$WORKTREE_VENV"
    log_info "  Symlinked .venv -> $MAIN_VENV"
    echo "  Activate: source $WORKTREE_VENV/bin/activate"
else
    log_warn "  Main repo .venv not found at: $MAIN_VENV"
    echo "  Create with: python -m venv $MAIN_VENV"
fi

# ============================================================================
# STEP 4: Copy Configuration Files
# ============================================================================

log_info "[4/5] Copying configuration files..."

CONFIG_FILES=(".env" ".env.mcp" ".env.local")

for config in "${CONFIG_FILES[@]}"; do
    SOURCE_PATH="$MAIN_REPO/$config"
    DEST_PATH="$NEW_WORKTREE/$config"

    if [[ -f "$SOURCE_PATH" ]]; then
        cp "$SOURCE_PATH" "$DEST_PATH"
        log_info "  Copied: $config"
    else
        echo "  Skipped (not found): $config"
    fi
done

# Copy .claude folder if exists
MAIN_CLAUDE_DIR="$MAIN_REPO/.claude"
WORKTREE_CLAUDE_DIR="$NEW_WORKTREE/.claude"

if [[ -d "$MAIN_CLAUDE_DIR" ]]; then
    cp -r "$MAIN_CLAUDE_DIR" "$WORKTREE_CLAUDE_DIR"
    log_info "  Copied: .claude/ folder"
fi

# ============================================================================
# STEP 5: Summary and Launch
# ============================================================================

log_info "[5/5] Worktree setup complete!"

echo ""
echo -e "${CYAN}----------------------------------------${NC}"
echo -e "${CYAN}  WORKTREE CREATED SUCCESSFULLY${NC}"
echo -e "${CYAN}----------------------------------------${NC}"
echo -e "  Path:   $NEW_WORKTREE"
echo -e "  Branch: $BRANCH_NAME"
echo -e "${CYAN}----------------------------------------${NC}"
echo ""

# List all worktrees
echo "All worktrees:"
git worktree list

echo ""
echo -e "${YELLOW}Quick commands:${NC}"
echo "  cd '$NEW_WORKTREE'"
echo "  claude                        # Launch Claude Code"
echo "  source .venv/bin/activate     # Activate Python venv"
echo "  git worktree remove '$NEW_WORKTREE'  # Remove when done"

if [[ "$LAUNCH_CLAUDE" == true ]]; then
    log_info "Launching Claude Code..."
    cd "$NEW_WORKTREE"
    claude
else
    echo ""
    echo -e "${YELLOW}To start working:${NC}"
    echo "  cd '$NEW_WORKTREE' && claude"
fi

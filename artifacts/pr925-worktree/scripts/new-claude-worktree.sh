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
#   ./new-claude-worktree.sh <branch-name> [base-branch] [--pr <number>] [--worktree-name <name>] [--no-venv-symlink] [--launch-claude]
#   ./new-claude-worktree.sh --pr <number> [base-branch] [--no-venv-symlink] [--launch-claude]
#
# Examples:
#   ./new-claude-worktree.sh feature-auth-improvements
#   ./new-claude-worktree.sh --pr 769 --launch-claude
#   ./new-claude-worktree.sh fix-api-bug develop --launch-claude
#

set -e

# ============================================================================
# CONFIGURATION
# ============================================================================

BRANCH_NAME=""
BASE_BRANCH="main"
PR_NUMBER=""
WORKTREE_NAME=""
NO_VENV_SYMLINK=false
LAUNCH_CLAUDE=false

# Parse positional args + optional flags
POSITIONALS=()
while [[ $# -gt 0 ]]; do
    case "$1" in
        --no-venv-symlink)
            NO_VENV_SYMLINK=true
            shift
            ;;
        --launch-claude)
            LAUNCH_CLAUDE=true
            shift
            ;;
        --pr)
            if [[ -z "${2:-}" ]]; then
                echo "Error: --pr requires a value"
                exit 1
            fi
            PR_NUMBER="${2:-}"
            shift 2
            ;;
        --pr=*)
            PR_NUMBER="${1#*=}"
            shift
            ;;
        --worktree-name)
            WORKTREE_NAME="${2:-}"
            shift 2
            ;;
        --worktree-name=*)
            WORKTREE_NAME="${1#*=}"
            shift
            ;;
        -*)
            log_error "Unknown flag: $1"
            exit 1
            ;;
        *)
            POSITIONALS+=("$1")
            shift
            ;;
    esac
done

if [[ ${#POSITIONALS[@]} -ge 1 ]]; then
    BRANCH_NAME="${POSITIONALS[0]}"
fi
if [[ ${#POSITIONALS[@]} -ge 2 ]]; then
    BASE_BRANCH="${POSITIONALS[1]}"
fi

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

# Derive naming from PR number if requested
if [[ -z "$BRANCH_NAME" && -n "$PR_NUMBER" ]]; then
    BRANCH_NAME="claude/pr-$PR_NUMBER"
fi

if [[ -z "$WORKTREE_NAME" ]]; then
    if [[ -n "$PR_NUMBER" ]]; then
        WORKTREE_NAME="pr-$PR_NUMBER"
    elif [[ -n "$BRANCH_NAME" ]]; then
        WORKTREE_NAME="$(echo "$BRANCH_NAME" | tr '/.' '--' | sed 's/[^a-zA-Z0-9_-]/-/g' | sed 's/^-*//;s/-*$//')"
    fi
fi

# Validate branch / worktree naming
if [[ -z "$BRANCH_NAME" ]]; then
    echo "Usage: $0 <branch-name> [base-branch] [--pr <number>] [--worktree-name <name>] [--no-venv-symlink] [--launch-claude]"
    echo ""
    echo "Examples:"
    echo "  $0 feature-auth-improvements"
    echo "  $0 --pr 769 --launch-claude"
    echo "  $0 fix-api-bug develop --launch-claude"
    exit 1
fi

if [[ ! "$BRANCH_NAME" =~ ^[a-zA-Z0-9._/-]+$ ]]; then
    log_error "Invalid branch name: $BRANCH_NAME"
    log_error "Use only letters, numbers, slash, dot, hyphens, and underscores."
    exit 1
fi

if [[ -n "$PR_NUMBER" && ! "$PR_NUMBER" =~ ^[0-9]+$ ]]; then
    log_error "Invalid PR number: $PR_NUMBER"
    exit 1
fi

if [[ ! "$WORKTREE_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    log_error "Invalid worktree name: $WORKTREE_NAME"
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
NEW_WORKTREE="$WORKTREE_ROOT/$WORKTREE_NAME"

if [[ -d "$NEW_WORKTREE" ]]; then
    log_error "Worktree path already exists: $NEW_WORKTREE"
    exit 1
fi

# ============================================================================
# STEP 1: Create Git Worktree
# ============================================================================

log_info "[1/7] Creating git worktree..."

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

log_info "[2/7] Verifying .gitignore inheritance..."

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

log_info "[3/7] Setting up Python virtual environment..."

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

log_info "[4/7] Copying configuration files..."

# Files Claude Code needs to work properly:
# - .mcp.json        : MCP server connections (Supabase, Redis, etc.) — CRITICAL
# - .env             : Environment variables (API keys, DB URLs)
# - .env.mcp         : MCP Hub environment config
# - .env.local       : Local overrides
# - .env.mcp.minimal : Minimal MCP config for hosted endpoints
# - .env.mcp.txt     : MCP reference/notes
# - .cursorrules     : Cursor IDE rules

CONFIG_FILES=(".mcp.json" ".env" ".env.mcp" ".env.local" ".env.mcp.minimal" ".env.mcp.txt" ".cursorrules")
CRITICAL_FILES=(".mcp.json" ".env")
CRITICAL_MISSING=()

for config in "${CONFIG_FILES[@]}"; do
    SOURCE_PATH="$MAIN_REPO/$config"
    DEST_PATH="$NEW_WORKTREE/$config"

    if [[ -f "$SOURCE_PATH" ]]; then
        cp "$SOURCE_PATH" "$DEST_PATH"
        log_info "  Copied: $config"
    else
        # Check if it's a critical file
        is_critical=false
        for crit in "${CRITICAL_FILES[@]}"; do
            if [[ "$config" == "$crit" ]]; then
                is_critical=true
                break
            fi
        done

        if [[ "$is_critical" == true ]]; then
            log_warn "  MISSING (required): $config"
            CRITICAL_MISSING+=("$config")
        else
            echo "  Skipped (not found): $config"
        fi
    fi
done

# Copy .claude folder if exists (contains settings.local.json with permissions)
MAIN_CLAUDE_DIR="$MAIN_REPO/.claude"
WORKTREE_CLAUDE_DIR="$NEW_WORKTREE/.claude"

if [[ -d "$MAIN_CLAUDE_DIR" ]]; then
    cp -r "$MAIN_CLAUDE_DIR" "$WORKTREE_CLAUDE_DIR"
    log_info "  Copied: .claude/ folder"
else
    log_warn "  MISSING: .claude/ folder — Claude Code permissions won't be pre-configured"
fi

# ============================================================================
# STEP 5: Validate Environment (CRITICAL — do not skip)
# ============================================================================

log_info "[5/7] Validating worktree environment..."

VALIDATION_ERRORS=()

# Check 1: .mcp.json exists and has MCP servers defined
WORKTREE_MCP="$NEW_WORKTREE/.mcp.json"
if [[ -f "$WORKTREE_MCP" ]]; then
    if grep -q '"mcpServers"' "$WORKTREE_MCP" 2>/dev/null; then
        log_info "  .mcp.json: MCP servers configured"
    else
        VALIDATION_ERRORS+=(".mcp.json exists but has no mcpServers defined")
    fi
else
    VALIDATION_ERRORS+=(".mcp.json missing — Claude Code will have NO MCP tool access (no Supabase, no Redis)")
fi

# Check 2: .env exists and has key variables
WORKTREE_ENV="$NEW_WORKTREE/.env"
if [[ -f "$WORKTREE_ENV" ]]; then
    for var in SUPABASE_URL SUPABASE_SERVICE_KEY ANTHROPIC_API_KEY; do
        if grep -v '^\s*#' "$WORKTREE_ENV" | grep -qE "^${var}="; then
            log_info "  .env: $var present"
        else
            echo "  .env: $var not found"
        fi
    done
else
    VALIDATION_ERRORS+=(".env missing — backend services will not connect")
fi

# Check 3: .claude/settings.local.json exists
WORKTREE_CLAUDE_SETTINGS="$NEW_WORKTREE/.claude/settings.local.json"
if [[ -f "$WORKTREE_CLAUDE_SETTINGS" ]]; then
    log_info "  .claude/settings.local.json: permissions configured"
else
    echo "  .claude/settings.local.json: not found (Claude will ask for each permission)"
fi

# Report validation results
if [[ ${#VALIDATION_ERRORS[@]} -gt 0 ]]; then
    echo ""
    log_warn "VALIDATION WARNINGS:"
    for err in "${VALIDATION_ERRORS[@]}"; do
        log_warn "  ! $err"
    done
    echo ""
    log_warn "Claude Code sessions in this worktree may not work correctly!"
    log_warn "Fix: Copy missing files from main repo: $MAIN_REPO"
else
    log_info "  All checks passed — worktree is ready for Claude Code"
fi

# ============================================================================
# STEP 6: Ping Docker & MCP Services
# ============================================================================

log_info "[6/7] Checking Docker & MCP configuration..."

# Check if Docker is running
DOCKER_RUNNING=false
if command -v docker &>/dev/null; then
    if docker info &>/dev/null; then
        log_info "  Docker: running"
        DOCKER_RUNNING=true
    else
        log_warn "  Docker: NOT running — local container checks skipped"
    fi
else
    log_warn "  Docker: NOT installed or not in PATH (OK for remote MCP)"
fi

if [[ "$DOCKER_RUNNING" == true ]]; then
    # List all running containers
    CONTAINER_COUNT=$(docker ps --format "{{.Names}}" 2>/dev/null | wc -l)
    log_info "  Docker containers running: $CONTAINER_COUNT"

    docker ps --format "{{.Names}}|{{.Ports}}|{{.Status}}" 2>/dev/null | while IFS='|' read -r name ports status; do
        if [[ -n "$name" ]]; then
            if [[ "$status" == *"healthy"* ]]; then
                echo -e "    ${GREEN}[OK]${NC} $name ($ports)"
            elif [[ "$status" == *"unhealthy"* ]]; then
                echo -e "    ${RED}[!!]${NC} $name ($ports)"
            else
                echo -e "    ${YELLOW}[--]${NC} $name ($ports)"
            fi
        fi
    done

    if [[ $CONTAINER_COUNT -eq 0 ]]; then
        log_warn "  No Docker containers running"
        echo "  Win11 developer MCP should stay local and non-Docker; DGX hosts the orchestration hub"
    fi

    # Check configured MCP endpoints from .mcp.json
    WORKTREE_MCP="$NEW_WORKTREE/.mcp.json"
    if [[ -f "$WORKTREE_MCP" ]] && command -v curl &>/dev/null; then
        echo ""
        echo -e "  ${CYAN}MCP server connectivity:${NC}"

        python3 -c "
import json, sys
try:
    with open('$WORKTREE_MCP') as f:
        data = json.load(f)
    for name, conf in data.get('mcpServers', {}).items():
        url = conf.get('url')
        command = conf.get('command')
        if url:
            if '\${' in url:
                print(f'ENV|{name}|{url}')
            else:
                health = f'{url}/health' if url.endswith('/mcp') else url
                print(f'URL|{name}|{health}')
        elif command:
            print(f'CMD|{name}|{command}')
except: pass
" 2>/dev/null | while IFS='|' read -r kind name value; do
            if [[ "$kind" == "URL" ]]; then
                if curl -s --max-time 3 "$value" &>/dev/null; then
                    echo -e "    ${GREEN}$name${NC}: reachable ($value)"
                else
                    echo -e "    ${RED}$name${NC}: UNREACHABLE ($value)"
                fi
            elif [[ "$kind" == "ENV" ]]; then
                echo -e "    ${YELLOW}$name${NC}: needs environment variables ($value)"
            elif [[ "$kind" == "CMD" ]]; then
                echo -e "    ${GREEN}$name${NC}: configured (local command: $value)"
            fi
        done
    fi
fi

# ============================================================================
# STEP 7: Summary and Launch
# ============================================================================

log_info "[7/7] Worktree setup complete!"

echo ""
echo -e "${CYAN}----------------------------------------${NC}"
echo -e "${CYAN}  WORKTREE CREATED SUCCESSFULLY${NC}"
echo -e "${CYAN}----------------------------------------${NC}"
echo -e "  Path:   $NEW_WORKTREE"
echo -e "  Branch: $BRANCH_NAME"
if [[ -n "$PR_NUMBER" ]]; then
    echo -e "  PR:     #$PR_NUMBER"
fi
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

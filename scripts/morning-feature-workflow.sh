#!/usr/bin/env bash
#
# Morning workflow: create feature branch, run build and tests, then ready for implementation.
#
# Usage:
#   ./morning-feature-workflow.sh [feature-name] [--pr <number>] [--skip-build] [--skip-test] [--run-fix-agent] [--use-worktree]
#
# Examples:
#   ./morning-feature-workflow.sh compliance-dashboard
#   ./morning-feature-workflow.sh --pr 769 --use-worktree
#   ./morning-feature-workflow.sh v2-carbon-reporting --run-fix-agent
#
set -e

BASE_BRANCH="${BASE_BRANCH:-main}"
SKIP_BUILD=false
SKIP_TEST=false
RUN_FIX_AGENT=false
USE_WORKTREE=false
FEATURE_NAME=""
PR_NUMBER=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --skip-build)     SKIP_BUILD=true; shift ;;
        --skip-test)      SKIP_TEST=true; shift ;;
        --run-fix-agent)  RUN_FIX_AGENT=true; shift ;;
        --use-worktree)   USE_WORKTREE=true; shift ;;
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
        -*)
            # unknown flags are ignored to preserve compatibility
            shift
            ;;
        *)
            [ -z "$FEATURE_NAME" ] && FEATURE_NAME="$1"
            shift
            ;;
    esac
done

# Repo root (script lives in scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

DATE_STR="$(date +%Y%m%d)"
if [[ -n "$PR_NUMBER" ]]; then
    BRANCH_NAME="claude/pr-$PR_NUMBER"
    WORKTREE_NAME="pr-$PR_NUMBER"
else
    NAME="${FEATURE_NAME:-morning-$DATE_STR}"
    BRANCH_NAME="claude/$NAME"
    WORKTREE_NAME=""
fi

echo ""
echo "========================================"
echo "  DWS6 Morning Feature Workflow"
echo "========================================"
echo ""

if [ "$USE_WORKTREE" = true ]; then
    WT_SCRIPT="$REPO_ROOT/scripts/new-claude-worktree.sh"
    [ -f "$WT_SCRIPT" ] || { echo "Error: $WT_SCRIPT not found"; exit 1; }
    if [[ -n "$PR_NUMBER" ]]; then
        echo "[Worktree mode] Creating PR worktree: #$PR_NUMBER ($BRANCH_NAME)"
        "$WT_SCRIPT" "$BRANCH_NAME" "$BASE_BRANCH" --worktree-name "$WORKTREE_NAME"
    else
        echo "[Worktree mode] Creating worktree for branch: $BRANCH_NAME"
        "$WT_SCRIPT" "$BRANCH_NAME" "$BASE_BRANCH"
    fi
    echo "Worktree created. Cd into the worktree and run build/test there."
    exit 0
fi

# 1. Avoid uncommitted changes on main
CURRENT="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || true)"
STATUS="$(git status --porcelain 2>/dev/null || true)"
if [ -n "$STATUS" ] && { [ "$CURRENT" = "main" ] || [ "$CURRENT" = "master" ]; }; then
    echo "You have uncommitted changes on $CURRENT. Stash or commit them first."
    git status -s
    exit 1
fi

# 2. Fetch and update base
echo "[1/4] Fetching and updating $BASE_BRANCH..."
git fetch origin "$BASE_BRANCH" 2>/dev/null || true
git checkout "$BASE_BRANCH"
git pull --ff-only origin "$BASE_BRANCH" 2>/dev/null || true

# 3. Create or checkout feature branch
echo "[2/4] Branch: $BRANCH_NAME"
if git rev-parse --verify "$BRANCH_NAME" 2>/dev/null; then
    git checkout "$BRANCH_NAME"
    git merge --ff-only "$BASE_BRANCH" 2>/dev/null || true
else
    git checkout -b "$BRANCH_NAME"
fi

# 4. Build
if [ "$SKIP_BUILD" = false ]; then
    echo "[3/4] Running build..."
    npm run build || { echo "Build failed. Fix and re-run, or use --skip-build."; exit 1; }
else
    echo "[3/4] Skipping build (--skip-build)."
fi

# 5. Test
if [ "$SKIP_TEST" = false ]; then
    echo "[4/4] Running tests..."
    npm run test -- --run 2>/dev/null || npm run test -- --run
    [ $? -eq 0 ] || { echo "Tests failed. Fix and re-run, or use --skip-test."; exit 1; }
else
    echo "[4/4] Skipping tests (--skip-test)."
fi

# 6. Optional fix-agent
if [ "$RUN_FIX_AGENT" = true ]; then
    FIX_AGENT="$REPO_ROOT/.workflows/agents/fix-agent.js"
    if [ -f "$FIX_AGENT" ]; then
        echo ""
        echo "Running fix-agent (latest audit)..."
        node "$FIX_AGENT" --latest
    fi
fi

echo ""
echo "Done. Branch '$BRANCH_NAME' is ready. Implement your feature, then commit and push."
echo "  git add . && git commit -m \"feat: your message\" && git push -u origin $BRANCH_NAME"

#!/bin/bash
# =============================================================================
# Claude Session Handover Script
# Generates a continuation prompt for resuming work in a new Claude Code session
#
# Usage: ./scripts/claude-session-handover.sh [branch-name]
#
# Features:
#   - Auto-detects current branch and last commit
#   - Finds associated PR if one exists
#   - Warns about uncommitted changes and offers to commit them
#   - Outputs a ready-to-paste handover prompt
# =============================================================================

set -euo pipefail

CURRENT_BRANCH=$(git branch --show-current)
BRANCH=${1:-$CURRENT_BRANCH}

# Verify requested branch matches current branch
if [ "$BRANCH" != "$CURRENT_BRANCH" ]; then
  echo "ERROR: Requested branch '$BRANCH' does not match current branch '$CURRENT_BRANCH'"
  echo "Either switch to '$BRANCH' first, or omit the argument to use the current branch."
  exit 1
fi

LAST_COMMIT=$(git log -1 --format="%h — %s")

# Try to get PR URL (gh may not be available in all environments)
PR_URL=$(gh pr view --json url -q '.url' 2>/dev/null || echo "No PR")

# Check for uncommitted changes
STATUS=$(git status --porcelain)

if [ -n "$STATUS" ]; then
  echo "WARNING: Uncommitted changes detected!"
  echo "$STATUS"
  echo ""

  read -r -p "Commit and push before handover? [y/N] " REPLY
  if [[ "$REPLY" =~ ^[Yy]$ ]]; then
    git add -A
    git commit -m "wip: session handover checkpoint"
    git push -u origin "$BRANCH" 2>/dev/null || git push
    LAST_COMMIT=$(git log -1 --format="%h — %s")
    echo ""
    echo "Changes committed and pushed."
  else
    echo ""
    echo "Proceeding without committing. Changes may be lost."
  fi
  echo ""
fi

# Get list of recently modified files
RECENT_FILES=$(git diff --name-only HEAD~3..HEAD 2>/dev/null | head -10 | tr '\n' ', ' | sed 's/,$//')

cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

JATKA EDELLISTÄ SESSIOTA / CONTINUE PREVIOUS SESSION
Branch: $BRANCH | Commit: $LAST_COMMIT | PR: $PR_URL
Done: [fill in summary] | Remaining: [fill in tasks] | Files: $RECENT_FILES
Start: git pull origin $BRANCH

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

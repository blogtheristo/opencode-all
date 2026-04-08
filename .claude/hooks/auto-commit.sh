#!/usr/bin/env bash
# Auto-commit changes when Claude stops — atomic commits per task
# Stop hook — always exits 0
set -euo pipefail

BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Never auto-commit on main/master
case "$BRANCH" in
  main|master)
    echo "On $BRANCH — skipping auto-commit." >&2
    exit 0 ;;
esac

# Stage all and commit if there are changes
git add -A
if ! git diff --cached --quiet; then
  CHANGED_COUNT=$(git diff --cached --name-only | wc -l | tr -d ' ')
  git commit -m "chore(ai): auto-commit $CHANGED_COUNT file(s) on session stop [$BRANCH]"
  echo "Auto-committed $CHANGED_COUNT file(s) on branch $BRANCH"
fi

exit 0

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

# Stage all changes EXCEPT hook files.
# Root cause of 2026-04-13 incident: a session worktree had an older copy of
# protect-files.sh (pre-Partners-protection). git add -A staged it, then the
# auto-commit on session stop committed the regression, silently removing all
# safety rules. Hook files must always be committed intentionally by the human.
git add -A
git restore --staged .claude/hooks/ 2>/dev/null || true

if ! git diff --cached --quiet; then
  CHANGED_COUNT=$(git diff --cached --name-only | wc -l | tr -d ' ')
  git commit -m "chore(ai): auto-commit $CHANGED_COUNT file(s) on session stop [$BRANCH]"
  echo "Auto-committed $CHANGED_COUNT file(s) on branch $BRANCH"
fi

exit 0

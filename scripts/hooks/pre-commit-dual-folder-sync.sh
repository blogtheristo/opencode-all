#!/bin/bash
# Pre-commit hook: Enforce Dual-Folder Sync Rule
# Runs before commit to ensure dws10.com/ ↔ landing-pages/dws10-com/ are in sync
# Install: ln -sf ../../scripts/hooks/pre-commit-dual-folder-sync.sh .git/hooks/pre-commit-dual-folder-sync

REPO_ROOT="$(git rev-parse --show-toplevel)"
SCRIPT="$REPO_ROOT/scripts/validate-dual-folder-sync.sh"

# Skip if files don't exist
if [ ! -f "$SCRIPT" ]; then
  exit 0
fi

# Check if any dws10.com files are staged
STAGED_DWS10=$(git diff --cached --name-only | grep -c '^dws10.com/' || true)

if [ "$STAGED_DWS10" -gt 0 ]; then
  # dws10.com files are being committed, enforce sync
  if ! "$SCRIPT" --check > /dev/null 2>&1; then
    echo ""
    echo "❌ COMMIT BLOCKED: Dual-Folder Sync violation"
    echo "   dws10.com/ changes must be mirrored to landing-pages/dws10-com/"
    echo ""
    echo "   To fix:"
    echo "   1. ./scripts/validate-dual-folder-sync.sh --fix"
    echo "   2. git add landing-pages/dws10-com/"
    echo "   3. git commit"
    echo ""
    exit 1
  fi
fi

exit 0

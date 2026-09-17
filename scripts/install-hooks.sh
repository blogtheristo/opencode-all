#!/bin/bash
# Install project git hooks
# Usage: ./scripts/install-hooks.sh

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIR="$REPO_ROOT/scripts/hooks"
GIT_HOOKS_DIR="$REPO_ROOT/.git/hooks"

if [ ! -d "$HOOKS_DIR" ]; then
  echo "❌ Error: $HOOKS_DIR not found"
  exit 1
fi

if [ ! -d "$GIT_HOOKS_DIR" ]; then
  mkdir -p "$GIT_HOOKS_DIR"
fi

echo "🔧 Installing project hooks..."

# Install dual-folder-sync pre-commit hook
if [ -f "$HOOKS_DIR/pre-commit-dual-folder-sync.sh" ]; then
  HOOK_LINK="$GIT_HOOKS_DIR/pre-commit-dual-folder-sync"
  ln -sf ../../scripts/hooks/pre-commit-dual-folder-sync.sh "$HOOK_LINK"
  chmod +x "$HOOK_LINK"
  echo "  ✅ Dual-Folder Sync hook installed"
fi

# Update main pre-commit hook to call sub-hooks if it doesn't already
if [ ! -f "$GIT_HOOKS_DIR/pre-commit" ]; then
  cat > "$GIT_HOOKS_DIR/pre-commit" << 'EOFPREHOOK'
#!/bin/bash
# Main pre-commit hook - runs all sub-hooks

REPO_ROOT="$(git rev-parse --show-toplevel)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"

# Run dual-folder-sync hook if it exists
if [ -f "$HOOKS_DIR/pre-commit-dual-folder-sync" ]; then
  "$HOOKS_DIR/pre-commit-dual-folder-sync" || exit 1
fi

exit 0
EOFPREHOOK
  chmod +x "$GIT_HOOKS_DIR/pre-commit"
  echo "  ✅ Main pre-commit hook created"
else
  # Check if main hook already calls dual-folder-sync hook
  if ! grep -q "pre-commit-dual-folder-sync" "$GIT_HOOKS_DIR/pre-commit"; then
    echo ""
    echo "  ⚠️  WARNING: Main pre-commit hook exists but doesn't call dual-folder-sync"
    echo "     Update $GIT_HOOKS_DIR/pre-commit to include:"
    echo "     if [ -f \"\$HOOKS_DIR/pre-commit-dual-folder-sync\" ]; then"
    echo "       \"\$HOOKS_DIR/pre-commit-dual-folder-sync\" || exit 1"
    echo "     fi"
  else
    echo "  ✅ Main pre-commit hook already configured"
  fi
fi

echo ""
echo "✅ Hooks installed. Run 'git commit' to test."

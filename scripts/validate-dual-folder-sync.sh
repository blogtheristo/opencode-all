#!/bin/bash
# Validate Dual-Folder Sync Rule
# Ensures dws10.com/ ↔ landing-pages/dws10-com/ stay in sync
# Usage: ./scripts/validate-dual-folder-sync.sh [--fix]

set -e

REPO_ROOT="$(git rev-parse --show-toplevel)"
SOURCE_DIR="$REPO_ROOT/dws10.com"
MIRROR_DIR="$REPO_ROOT/landing-pages/dws10-com"
FIX_SYNC="${1:---check}"

if [ ! -d "$SOURCE_DIR" ] || [ ! -d "$MIRROR_DIR" ]; then
  echo "❌ Error: Required directories not found"
  echo "  SOURCE: $SOURCE_DIR"
  echo "  MIRROR: $MIRROR_DIR"
  exit 1
fi

# Get files that differ between source and mirror
DIFF_COUNT=$(diff -r "$SOURCE_DIR" "$MIRROR_DIR" --brief 2>/dev/null | wc -l)

if [ "$DIFF_COUNT" -eq 0 ]; then
  echo "✅ Dual-Folder Sync: PASS (dws10.com ↔ landing-pages/dws10-com in sync)"
  exit 0
fi

echo "❌ Dual-Folder Sync: FAIL ($DIFF_COUNT differences found)"
echo ""
echo "Differences:"
diff -r "$SOURCE_DIR" "$MIRROR_DIR" --brief 2>/dev/null || true

if [ "$FIX_SYNC" = "--fix" ]; then
  echo ""
  echo "🔧 Fixing sync..."
  rsync -av --delete "$SOURCE_DIR/" "$MIRROR_DIR/" --include-from=- <<< "$(find "$SOURCE_DIR" -type f | sed "s|$SOURCE_DIR/||")" > /dev/null 2>&1 || true

  # Verify fix
  DIFF_COUNT_AFTER=$(diff -r "$SOURCE_DIR" "$MIRROR_DIR" --brief 2>/dev/null | wc -l)
  if [ "$DIFF_COUNT_AFTER" -eq 0 ]; then
    echo "✅ Sync fixed. Run 'git add landing-pages/dws10-com/' to commit."
    exit 0
  else
    echo "❌ Sync fix incomplete. Manual review needed."
    exit 1
  fi
else
  echo ""
  echo "💡 To fix: ./scripts/validate-dual-folder-sync.sh --fix"
  echo "💡 Or manually: cp -r dws10.com/* landing-pages/dws10-com/"
  exit 1
fi

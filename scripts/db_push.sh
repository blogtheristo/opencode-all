#!/usr/bin/env bash
#
# Link Supabase project and push migrations.
# Project ref: kpucuwwfhuwurdxyjjtz
#
# Usage:
#   ./scripts/db_push.sh
#   ./scripts/db_push.sh --skip-link   # Skip link if already linked
#

set -e
PROJECT_REF="${SUPABASE_PROJECT_REF:-kpucuwwfhuwurdxyjjtz}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKIP_LINK=false

for arg in "$@"; do
  case $arg in
    --skip-link) SKIP_LINK=true ;;
  esac
done

cd "$PROJECT_ROOT"

echo "=== Supabase DB Push ==="
echo "  Project ref: $PROJECT_REF"
echo ""

if [ "$SKIP_LINK" = false ]; then
  echo "[1/2] Linking project..."
  npx supabase link --project-ref "$PROJECT_REF" || {
    echo "Link failed. If already linked, run: ./scripts/db_push.sh --skip-link"
    exit 1
  }
  echo "  Done."
else
  echo "[1/2] Skipping link (already linked)."
fi

echo ""
echo "[2/2] Pushing migrations..."
npx supabase db push

echo ""
echo "Done. Migrations applied."

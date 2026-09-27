#!/usr/bin/env bash
# Applies supabase/migrations/*.sql, in filename order, to the local Aspire dev Postgres container.
# Run manually AFTER `aspire run` has started the dws-postgres resource — this is not wired into
# the AppHost lifecycle because Aspire's container startup hooks were not verifiable in this
# sandbox (no local dotnet/Aspire runtime available). Verify locally before relying on it.
#
# Usage: DWS_DEV_PG_CONN="host=localhost port=<aspire-assigned-port> user=postgres password=... dbname=dws_dev" \
#          ./aspire/scripts/seed-dev-postgres.sh
#
# Find the port + password for dws-postgres in the Aspire dashboard (Resources > dws-postgres > Connection string).

set -euo pipefail

: "${DWS_DEV_PG_CONN:?Set DWS_DEV_PG_CONN to the dws_dev connection string (see Aspire dashboard)}"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MIGRATIONS_DIR="$REPO_ROOT/supabase/migrations"

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required (install via 'winget install PostgreSQL.PostgreSQL' on Windows, or use pgAdmin's Query Tool instead)." >&2
  exit 1
fi

count=0
for f in "$MIGRATIONS_DIR"/*.sql; do
  echo "Applying $(basename "$f")..."
  psql "$DWS_DEV_PG_CONN" -v ON_ERROR_STOP=1 -f "$f"
  count=$((count + 1))
done

echo "Applied $count migration files to the local dev Postgres."

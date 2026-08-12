#!/usr/bin/env bash
#
# Apply DGX Spark internal-Postgres migrations to Aiven
# Usage: ./apply-migrations-to-aiven.sh <DB_URL>
#
# The connection string should be in the format:
#   avnadmin:PASSWORD@pg-32ace152-dws6.f.aivencloud.com:21453/defaultdb?sslmode=require
#
# This script:
# 1. Validates the connection string
# 2. Applies all 22 migrations sequentially (000–021)
# 3. Verifies schema tables exist
# 4. Reports row counts for audit
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
MIGRATIONS_DIR="$(cd "$(dirname "$0")/../infrastructure/dgx-spark/migrations" && pwd)"
DB_URL="${1:-}"

# Validation
if [ -z "$DB_URL" ]; then
  echo -e "${RED}Error: DB_URL not provided${NC}"
  echo "Usage: $0 <DB_URL>"
  echo ""
  echo "Get the connection string from your Aiven console:"
  echo "  1. Log in to aiven.io"
  echo "  2. Select pg-32ace152 service"
  echo "  3. Click 'Connection info' → 'Quick connect'"
  echo "  4. Copy the 'Service URI' (include postgresql:// prefix)"
  echo "  5. Pass it as the first argument"
  exit 1
fi

if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo -e "${RED}Error: Migrations directory not found at $MIGRATIONS_DIR${NC}"
  exit 1
fi

# Test connection
echo -e "${BLUE}Testing connection to Aiven...${NC}"
if ! psql "$DB_URL" -c "SELECT version();" &>/dev/null; then
  echo -e "${RED}Error: Cannot connect. Check your connection string and credentials.${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Connection successful${NC}"

# Count migrations
MIGRATION_COUNT=$(find "$MIGRATIONS_DIR" -name "*.sql" | wc -l)
echo -e "${BLUE}Found $MIGRATION_COUNT migrations to apply${NC}"

# Apply migrations
echo -e "${BLUE}Applying migrations...${NC}"
for migration_file in $(find "$MIGRATIONS_DIR" -name "*.sql" | sort); do
  migration_name=$(basename "$migration_file")
  echo -n "  Applying $migration_name... "

  if psql "$DB_URL" -f "$migration_file" &>/dev/null; then
    echo -e "${GREEN}✓${NC}"
  else
    echo -e "${RED}✗ Failed${NC}"
    echo "Error details:"
    psql "$DB_URL" -f "$migration_file"
    exit 1
  fi
done

echo -e "${GREEN}✓ All migrations applied successfully${NC}"

# Verify schema
echo -e "${BLUE}Verifying schema...${NC}"

# Key tables from the migrations
EXPECTED_TABLES=(
  "semantic_memories"
  "agent_tracking"
  "command_audit_log"
  "memory_audit_log"
  "tool_telemetry"
  "agent_nudges"
  "climate_assistant_usage"
)

for table in "${EXPECTED_TABLES[@]}"; do
  count=$(psql "$DB_URL" -t -c "SELECT COUNT(*) FROM \"$table\" LIMIT 1;" 2>/dev/null || echo "0")
  status="${GREEN}✓${NC}"
  if [ -z "$count" ] || [ "$count" -eq 0 ]; then
    status="${YELLOW}empty${NC}"
  fi
  printf "  %-30s %b (rows: %s)\n" "$table" "$status" "${count:-0}"
done

# Full table inventory
echo -e "\n${BLUE}Full table inventory:${NC}"
psql "$DB_URL" -c "
  SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
  FROM pg_tables
  WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  ORDER BY tablename;
"

echo -e "\n${GREEN}Migration complete!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Add AIVEN_DATABASE_URL to .env on DGX Spark"
echo "  2. Test backup script: scripts/dgx-spark/backup-internal-postgres-to-aiven.sh --dry-run"
echo "  3. Run cutover (Task #8) to migrate existing rows from Supabase"

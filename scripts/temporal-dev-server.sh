#!/usr/bin/env bash
# ============================================================================
# Temporal Dev Server — local/CI testing only, NOT for DGX Spark production
# ============================================================================
# Wraps `temporal server start-dev` per the official Standalone Activities
# quickstart (docs.temporal.io/standalone-activity). Requires the Temporal
# CLI (v1.9.1+) installed locally — not available in this repo's cloud
# sandbox (temporal.download is blocked by this session's egress policy, so
# this script has NOT been run or verified here; verify on your own machine).
#
# By default `start-dev` persists to a SQLite file (not pure in-memory) so
# job history survives a restart on your machine — still not a substitute
# for the DGX Spark deployment (infrastructure/dgx-spark/docker-compose.yml),
# which is the durable target for anything DWS6 actually depends on.
#
# Usage:
#   ./scripts/temporal-dev-server.sh              # start (foreground)
#   TEMPORAL_ADDRESS=localhost:7233 npm run temporal:worker   # in another shell
#
# Code-Version: 1.0.0
# Date: 2026-09-23
# ============================================================================

set -euo pipefail

if ! command -v temporal >/dev/null 2>&1; then
  echo "Temporal CLI not found. Install it first:" >&2
  echo "  macOS/Linux (Homebrew): brew install temporal" >&2
  echo "  Other platforms: https://docs.temporal.io/cli#install" >&2
  echo "Then verify with: temporal --version (need 1.9.1+)" >&2
  exit 1
fi

DB_FILE="${TEMPORAL_DEV_DB_FILE:-.temporal-dev.db}"

echo "Starting Temporal dev server (SQLite: ${DB_FILE})..."
echo "  Server: localhost:7233"
echo "  Web UI: http://localhost:8233"
echo "  Not durable across machine loss — local/CI testing only."

exec temporal server start-dev --db-filename "${DB_FILE}"

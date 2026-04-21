#!/usr/bin/env bash
# check-breach-deadlines.sh — wrapper for TypeScript breach deadline checker
# Auto-discovered by: scripts/daily/ convention (DGX Spark day-runner.sh)
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../.."
npx tsx scripts/daily/check-breach-deadlines.ts

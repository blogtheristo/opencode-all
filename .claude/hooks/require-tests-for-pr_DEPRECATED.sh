#!/usr/bin/env bash
# Require passing tests before PR creation — hard gate
# PreToolUse hook for mcp__github__create_pull_request
set -euo pipefail

# Skip if node_modules not installed (CI/web environments)
if [ ! -d "node_modules" ]; then
  echo "[test-gate] node_modules missing — skipping test gate" >&2
  exit 0
fi

if npm run test --silent 2>&1 | tail -5; then
  exit 0
else
  echo "Tests are failing. Fix all test failures before creating a PR." >&2
  exit 2
fi

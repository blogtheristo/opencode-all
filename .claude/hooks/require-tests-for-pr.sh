#!/usr/bin/env bash
# Require passing tests before PR creation — hard gate
# PreToolUse hook for mcp__github__create_pull_request
set -euo pipefail

if npm run test --silent 2>&1 | tail -5; then
  exit 0
else
  echo "Tests are failing. Fix all test failures before creating a PR." >&2
  exit 2
fi

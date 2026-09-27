#!/usr/bin/env bash
# Evidence: Tool=Claude Code (cloud) Agent=runner-hardening Date=2026-09-23
# Audit trail: git log -- infrastructure/dgx-spark/gh-runner/gh-runner-start.sh
#
# gh-runner-start.sh — ExecStart (runs as gh-runner). Runs exactly one job with
# the JIT config minted by gh-runner-jitconfig.sh, then exits; systemd restarts
# the unit, which wipes state and mints a fresh config (ephemeral runner).
#
# Code-Version: 2.0.0
# Date: 2026-09-23
# Owner: Lifetime Oy

set -euo pipefail

JIT_FILE="/run/gh-runner/jitconfig"
[ -r "$JIT_FILE" ] || { echo "FATAL: $JIT_FILE missing" >&2; exit 1; }
jit=$(cat "$JIT_FILE")
rm -f "$JIT_FILE"

cd /srv/gh-runner/runner
exec ./run.sh --jitconfig "$jit"

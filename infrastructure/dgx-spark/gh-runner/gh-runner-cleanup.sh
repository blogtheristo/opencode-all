#!/usr/bin/env bash
# Evidence: Tool=Claude Code (cloud) Agent=runner-hardening Date=2026-09-23
# Audit trail: git log -- infrastructure/dgx-spark/gh-runner/gh-runner-cleanup.sh
#
# gh-runner-cleanup.sh — ExecStopPost (runs as ROOT via the "+" prefix).
# Wipes everything a job could have written, so nothing (poisoned tool cache,
# planted hooks, leftover credentials) carries over to the next job.
# Leftover processes are already killed by systemd (KillMode=control-group).
#
# Code-Version: 2.0.0
# Date: 2026-09-23
# Owner: Lifetime Oy

set -uo pipefail

BASE="/srv/gh-runner"

rm -f /run/gh-runner/jitconfig
rm -rf "${BASE:?}/runner/_work"
# JIT runners write no .runner/.credentials, but remove any stray state anyway.
rm -f "${BASE}/runner/.runner" "${BASE}/runner/.credentials" "${BASE}/runner/.credentials_rsaparams"
rm -rf "${BASE:?}/home"
install -d -o gh-runner -g gh-runner -m 0700 "${BASE}/home" "${BASE}/runner/_work"

# Keep only the newest 50 diagnostic logs (audit trail, bounded disk).
find "${BASE}/runner/_diag" -type f -name '*.log' -printf '%T@ %p\n' 2>/dev/null \
  | sort -rn | tail -n +51 | cut -d' ' -f2- | xargs -r rm -f

echo "gh-runner state wiped"

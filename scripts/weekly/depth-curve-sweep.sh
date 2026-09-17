#!/bin/bash
# Weekly depth-curve sweep — locates the fixed-hardware throughput knee.
#
# Wrapper for depth-curve-sweep.mjs. It exists because day-runner.sh discovers
# only scripts/weekly/*.{ts,sh} (see infrastructure/dgx-spark/day-runner.sh:188),
# so an .mjs alone would never run — and the Script Automation Rule forbids work
# that depends on somebody remembering to trigger it. Same pattern as
# coach-learn-curate.cjs / .sh in this directory.
#
# Runs on DGX Spark, where the inference host is reachable. Elsewhere it skips
# loudly rather than pretending to have measured anything.
#
# Config (env):
#   DEPTH_SWEEP_MODEL         model tag to sweep (default: nemotron-cascade-2-30b-a3b)
#   OLLAMA_BASE_URL           inference host; DGX_OLLAMA_URL also honoured
#   DEPTH_SWEEP_DEPTHS        comma-separated context depths
#   DEPTH_SWEEP_CONCURRENCY   comma-separated concurrency levels
#   DEPTH_SWEEP_EUR_PER_HOUR  amortised hardware cost, for € per audit-ready output

set -uo pipefail

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || true)
[ -z "${REPO_ROOT:-}" ] && { echo "depth-curve-sweep: not a git repo — skipping."; exit 0; }
cd "$REPO_ROOT" || exit 0

MODEL="${DEPTH_SWEEP_MODEL:-nemotron-cascade-2-30b-a3b}"
DEPTHS="${DEPTH_SWEEP_DEPTHS:-4000,16000,32000,64000,128000,250000}"
CONCURRENCY="${DEPTH_SWEEP_CONCURRENCY:-1,2,4,8}"
HOST="${OLLAMA_BASE_URL:-${DGX_OLLAMA_URL:-}}"

if [ -z "$HOST" ]; then
  echo "depth-curve-sweep: no OLLAMA_BASE_URL/DGX_OLLAMA_URL — skipping."
  echo "  This sweep must run on hardware. It has no simulation mode: a fabricated"
  echo "  curve would be worse than no curve (PHD_FIREHORSE §14.45 Finding 2)."
  exit 0
fi

command -v node >/dev/null 2>&1 || { echo "depth-curve-sweep: node unavailable — skipping."; exit 0; }

ARGS=(--model "$MODEL" --depths "$DEPTHS" --concurrency "$CONCURRENCY" --host "$HOST")
[ -n "${DEPTH_SWEEP_EUR_PER_HOUR:-}" ] && ARGS+=(--eur-per-hour "$DEPTH_SWEEP_EUR_PER_HOUR")

echo "depth-curve-sweep: model=$MODEL depths=$DEPTHS concurrency=$CONCURRENCY"
node "$REPO_ROOT/scripts/weekly/depth-curve-sweep.mjs" "${ARGS[@]}" || {
  echo "depth-curve-sweep: sweep failed — no artifact written."
  exit 0
}

#!/usr/bin/env bash
# build.sh — Build waza-claude binary (Waza + Anthropic Claude executor)
#
# Usage:
#   ./build.sh                     # builds ./waza-claude
#   WAZA_DIR=/path/to/waza ./build.sh
#   OUTPUT=~/bin/waza-claude ./build.sh
#
# Requirements: Go 1.26+, git, ANTHROPIC_API_KEY at runtime

set -euo pipefail

WAZA_DIR="${WAZA_DIR:-/tmp/waza}"
WAZA_REPO="https://github.com/microsoft/waza.git"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT="${OUTPUT:-${SCRIPT_DIR}/waza-claude}"

# 1. Clone Waza if not present
if [[ ! -d "$WAZA_DIR" ]]; then
  echo "Cloning Waza..."
  git clone --depth=1 "$WAZA_REPO" "$WAZA_DIR"
fi

# 2. Copy ClaudeEngine into the execution package
echo "Installing ClaudeEngine..."
cp "${SCRIPT_DIR}/claude_engine.go" "${WAZA_DIR}/internal/execution/claude.go"

# 3. Apply cmd_run.go patch (idempotent: skip if already applied)
if ! grep -q '"claude":' "${WAZA_DIR}/cmd/waza/cmd_run.go"; then
  echo "Patching cmd_run.go..."
  patch -p1 -d "$WAZA_DIR" < "${SCRIPT_DIR}/cmd_run.patch"
else
  echo "cmd_run.go already patched, skipping."
fi

# 4. Build
echo "Building waza-claude..."
cd "$WAZA_DIR"
go build -o "$OUTPUT" ./cmd/waza

echo ""
echo "Built: $OUTPUT"
echo ""
echo "Usage:"
echo "  export ANTHROPIC_API_KEY=sk-ant-..."
echo "  $OUTPUT run eval.yaml --executor claude -v"

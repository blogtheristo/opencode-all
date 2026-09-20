#!/usr/bin/env bash
# Evidence: Tool=Cursor Cloud Agent Model=cursor-grok-4.6 Date=2026-09-18
# Audit trail: git log -- scripts/litellm-spark.sh
#
# Spark-only LiteLLM starter. Fail-closed: LiteLLM treats an empty
# LITELLM_MASTER_KEY as "authentication disabled". Do not run on Cursor Cloud.
set -euo pipefail

if [[ -z "${LITELLM_MASTER_KEY:-}" ]]; then
  echo "litellm-spark: LITELLM_MASTER_KEY is required (empty key disables proxy auth)" >&2
  exit 1
fi
if [[ -z "${OLLAMA_API_BASE:-}" ]]; then
  echo "litellm-spark: OLLAMA_API_BASE is required" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="${1:-$ROOT/config/litellm-config.yaml}"

# Bind loopback so LAN clients cannot hit :4000 even if the key leaks later.
exec litellm --config "$CONFIG" --host 127.0.0.1 --port 4000

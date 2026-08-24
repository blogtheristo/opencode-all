#!/usr/bin/env bash
# ollama-spark.sh — Route LLM inference to DGX Spark Ollama.
#
# Used when:
#   - Anthropic / Claude / Groq cloud limits are hit (429, quota exhausted)
#   - Prompts are EU-data-sensitive and must not leave DGX Spark
#
# Usage:
#   scripts/ollama-spark.sh <model> "<prompt>"
#   scripts/ollama-spark.sh llama3.1:70b "Classify this CSRD disclosure: ..."
#   echo "prompt here" | scripts/ollama-spark.sh llama3.1:70b -   # read from stdin
#
# Models on DGX Spark (check live with --list):
#   scripts/ollama-spark.sh --list
#
# Env:
#   DGX_SSH_HOST   SSH alias for DGX Spark (default: dgx-spark)
#   DGX_OLLAMA_URL Ollama endpoint on the Spark (default: http://localhost:11434)
#
# Output: raw model response on stdout. Non-zero exit on transport failure.

set -uo pipefail

DGX_SSH_HOST="${DGX_SSH_HOST:-dgx-spark}"
DGX_OLLAMA_URL="${DGX_OLLAMA_URL:-http://localhost:11434}"

if [ "${1:-}" = "--list" ]; then
  ssh "$DGX_SSH_HOST" "curl -s $DGX_OLLAMA_URL/api/tags | jq -r '.models[].name'"
  exit $?
fi

if [ $# -lt 2 ]; then
  echo "usage: $0 <model> \"<prompt>\"        (or prompt=- to read stdin)" >&2
  echo "       $0 --list" >&2
  exit 2
fi

MODEL="$1"
PROMPT="$2"

if [ "$PROMPT" = "-" ]; then
  PROMPT="$(cat)"
fi

# Build JSON payload safely (jq handles escaping)
PAYLOAD=$(jq -cn --arg m "$MODEL" --arg p "$PROMPT" \
  '{model:$m, prompt:$p, stream:false}')

ssh "$DGX_SSH_HOST" "curl -sS $DGX_OLLAMA_URL/api/generate -d '$PAYLOAD' | jq -r .response"

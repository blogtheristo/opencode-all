#!/usr/bin/env bash
# ollama-spark-embed.sh — Generate vector embeddings on DGX Spark Ollama.
#
# Companion to scripts/ollama-spark.sh, but hits /api/embeddings instead of
# /api/generate. Used by the agent "second brain" so embeddings stay
# EU-sovereign (no OpenAI cloud round-trip).
#
# Usage:
#   scripts/ollama-spark-embed.sh <model> "<text>"
#   scripts/ollama-spark-embed.sh nomic-embed-text "Classify this CSRD disclosure"
#   echo "long text..." | scripts/ollama-spark-embed.sh nomic-embed-text -
#
# Env:
#   DGX_SSH_HOST   SSH alias for DGX Spark (default: dgx-spark)
#   DGX_OLLAMA_URL Ollama endpoint on the Spark (default: http://localhost:11434)
#
# Output: JSON object {"embedding": [...]} on stdout.
#         Non-zero exit on transport failure.

set -uo pipefail

DGX_SSH_HOST="${DGX_SSH_HOST:-dgx-spark}"
DGX_OLLAMA_URL="${DGX_OLLAMA_URL:-http://localhost:11434}"

if [ $# -lt 2 ]; then
  echo "usage: $0 <model> \"<text>\"   (or text=- to read stdin)" >&2
  exit 2
fi

MODEL="$1"
TEXT="$2"

if [ "$TEXT" = "-" ]; then
  TEXT="$(cat)"
fi

# Ollama embeddings input cap mirrors text-embedding-3-small (~8k chars)
TEXT="${TEXT:0:8000}"

PAYLOAD=$(jq -cn --arg m "$MODEL" --arg p "$TEXT" \
  '{model:$m, prompt:$p}')

ssh "$DGX_SSH_HOST" "curl -sS $DGX_OLLAMA_URL/api/embeddings -d '$PAYLOAD'"

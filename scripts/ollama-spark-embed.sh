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

if [ "${1:-}" = "--preflight" ]; then
  # Quick reachability + model-loaded probe. Exits 0 on success, 1 on failure
  # with a short actionable error on stderr.
  MODEL="${EMBEDDING_MODEL_DGX:-nomic-embed-text}"
  if ! ssh -o BatchMode=yes -o ConnectTimeout=5 "$DGX_SSH_HOST" true 2>/dev/null; then
    echo "[preflight] FAIL: cannot ssh to '$DGX_SSH_HOST' non-interactively." >&2
    echo "  Fix: configure ~/.ssh/config or set DGX_SSH_HOST. Try: ssh $DGX_SSH_HOST true" >&2
    exit 1
  fi
  if ! TAGS=$(ssh "$DGX_SSH_HOST" "curl -fsS --max-time 5 $DGX_OLLAMA_URL/api/tags" 2>/dev/null); then
    echo "[preflight] FAIL: Ollama not reachable at $DGX_OLLAMA_URL on $DGX_SSH_HOST." >&2
    echo "  Fix: ssh $DGX_SSH_HOST systemctl status ollama" >&2
    exit 1
  fi
  if ! grep -q "\"name\":\"$MODEL" <<< "$TAGS"; then
    echo "[preflight] FAIL: model '$MODEL' not loaded on $DGX_SSH_HOST." >&2
    echo "  Fix: ssh $DGX_SSH_HOST ollama pull $MODEL" >&2
    exit 1
  fi
  echo "[preflight] OK: $DGX_SSH_HOST + Ollama + $MODEL"
  exit 0
fi

if [ $# -lt 2 ]; then
  echo "usage: $0 <model> \"<text>\"   (or text=- to read stdin)" >&2
  echo "       $0 --preflight              (verify reachability + model)" >&2
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

REMOTE_URL=$(printf '%s' "$DGX_OLLAMA_URL/api/embeddings" | jq -sRr @sh)

printf '%s' "$PAYLOAD" | ssh "$DGX_SSH_HOST" "curl -sS $REMOTE_URL --data-binary @-"

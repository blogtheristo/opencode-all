#!/usr/bin/env bash
# =============================================================================
# Ollama TurboQuant KV Cache Compression Setup
# =============================================================================
#
# Code-Version: 1.0
# Branch: claude/turboquant-kv-compression-2YcZI
# Date: 2026-03-29
# Owner: Claude Code (Opus 4.6)
#
# Generates Ollama Modelfiles with KV cache quantization enabled,
# solving the "garbage quality after 4K tokens" problem by compressing
# the KV cache to fit longer contexts in memory.
#
# Usage:
#   ./ollama-turboquant-setup.sh [model] [context_length] [kv_bits]
#
# Examples:
#   ./ollama-turboquant-setup.sh qwen3:8b 65536 q4_0
#   ./ollama-turboquant-setup.sh qwen2.5-coder:32b 32768 q8_0
#   ./ollama-turboquant-setup.sh llama3:70b 16384 q4_0
#
# KV cache type options (llama.cpp backend):
#   f16   - Full precision (default, no compression)
#   q8_0  - 8-bit quantized (~2x compression)
#   q4_0  - 4-bit quantized (~4x compression, recommended)
#
# Memory math (qwen3:8b at 64K context, 32 KV heads, 128 dim):
#   f16 KV:  ~16 GB  — exceeds available memory alongside weights
#   q8_0 KV: ~8 GB   — fits, 2x compression
#   q4_0 KV: ~4 GB   — fits easily, 4x compression
#   3-bit:   ~3 GB   — TurboQuant target (requires custom llama.cpp build)
#
# Source: TurboQuant paper (arXiv 2504.19874, ICLR 2026)
# =============================================================================

set -euo pipefail

# --- Configuration ---
MODEL="${1:-qwen3:8b}"
NUM_CTX="${2:-65536}"
KV_TYPE="${3:-q4_0}"

# Derive a safe tag name from model + settings
MODEL_BASE=$(echo "$MODEL" | tr ':/' '-')
TAG="${MODEL_BASE}-tq-${KV_TYPE}-${NUM_CTX}"
MODELFILE_DIR="${MODELFILE_DIR:-/tmp/ollama-modelfiles}"

# --- Validation ---
if ! command -v ollama &>/dev/null; then
  echo "ERROR: ollama not found in PATH. Install from https://ollama.com" >&2
  exit 1
fi

if [[ "$KV_TYPE" != "f16" && "$KV_TYPE" != "q8_0" && "$KV_TYPE" != "q4_0" ]]; then
  echo "ERROR: Invalid KV cache type '$KV_TYPE'. Must be one of: f16, q8_0, q4_0" >&2
  exit 1
fi

# --- Generate Modelfile ---
mkdir -p "$MODELFILE_DIR"
MODELFILE="$MODELFILE_DIR/Modelfile.${TAG}"

cat > "$MODELFILE" <<EOF
# TurboQuant KV Cache Compression Modelfile
# Generated: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
# Source model: ${MODEL}
# KV cache type: ${KV_TYPE} (keys and values)
# Context length: ${NUM_CTX} tokens
#
# Memory savings vs f16 baseline:
#   q8_0: ~2x compression (half the KV cache memory)
#   q4_0: ~4x compression (quarter the KV cache memory)
#
# Reference: TurboQuant (arXiv 2504.19874) — 3-bit achieves 6x
# with zero accuracy loss. q4_0 is the closest available in
# stock llama.cpp; full TurboQuant requires custom build.

FROM ${MODEL}

# Extended context window — the whole point of KV cache compression
PARAMETER num_ctx ${NUM_CTX}

# KV cache quantization — compress keys and values separately
# Both use the same type for balanced compression
PARAMETER cache_type_k ${KV_TYPE}
PARAMETER cache_type_v ${KV_TYPE}

# Inference parameters (conservative defaults for long-context quality)
PARAMETER temperature 0.3
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.1
EOF

echo "=== TurboQuant KV Cache Setup ==="
echo "Model:          $MODEL"
echo "Tag:            $TAG"
echo "Context length: $NUM_CTX tokens"
echo "KV cache type:  $KV_TYPE (keys + values)"
echo "Modelfile:      $MODELFILE"
echo ""

# --- Compression ratio table ---
echo "--- Memory Estimate (approximate) ---"
case "$KV_TYPE" in
  f16)  echo "Compression: 1x (baseline, no savings)" ;;
  q8_0) echo "Compression: ~2x (KV cache memory halved)" ;;
  q4_0) echo "Compression: ~4x (KV cache memory quartered)" ;;
esac
echo ""

# --- Create the model ---
echo "Creating Ollama model '$TAG' from Modelfile..."
ollama create "$TAG" -f "$MODELFILE"

echo ""
echo "=== Done ==="
echo "Run with:  ollama run $TAG"
echo "API test:  curl http://localhost:11434/api/generate -d '{\"model\": \"$TAG\", \"prompt\": \"Hello\"}'"
echo ""
echo "To verify KV cache settings:"
echo "  ollama show $TAG --modelfile"

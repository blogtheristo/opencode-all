#!/usr/bin/env bash
# serve-diffusiongemma.sh — Serve DiffusionGemma locally via vLLM (OpenAI-compatible).
#
# DiffusionGemma (Google DeepMind) is a parallel diffusion LM on the Gemma 4
# 26B MoE backbone, with day-zero vLLM serving. This launcher starts an
# OpenAI-compatible endpoint that the DWS LLMClient `vllm-local` path consumes
# (see src/agents/diffusiongemma.ts). Run on a DGX Spark / RTX host.
#
# Usage:
#   scripts/serve-diffusiongemma.sh                 # serve with defaults
#   DIFFUSIONGEMMA_MODEL=google/diffusiongemma-26b scripts/serve-diffusiongemma.sh
#
# After it is up, point the app at it:
#   export DIFFUSIONGEMMA_BASE_URL=http://localhost:8000/v1   # or VLLM_BASE_URL
#
# Quant: for Blackwell (DGX Spark GB10 / RTX 50-series) use an NVFP4 build —
#   ~14GB weights leave room for 16–32 concurrent KV caches in 128GB unified
#   memory. The shared MoE backbone ships as nvidia/Gemma-4-26B-A4B-NVFP4.
#
# Env:
#   DIFFUSIONGEMMA_MODEL   HF / vLLM model tag (default: google/diffusiongemma-26b)
#   VLLM_HOST              bind host        (default: 0.0.0.0)
#   VLLM_PORT              bind port        (default: 8000)
#   VLLM_MAX_MODEL_LEN     context length   (default: 32768)
#   VLLM_GPU_MEM_UTIL      fraction of VRAM (default: 0.90)
#   VLLM_API_KEY           optional bearer token for the served endpoint
#
# The 256-token parallel denoising block is intrinsic to DiffusionGemma and is
# applied per request by the client (DIFFUSIONGEMMA_BLOCK_TOKENS), not here.
#
# Output: streams vLLM server logs. Non-zero exit if vllm is missing or fails.

set -euo pipefail

MODEL="${DIFFUSIONGEMMA_MODEL:-google/diffusiongemma-26b}"
HOST="${VLLM_HOST:-0.0.0.0}"
PORT="${VLLM_PORT:-8000}"
MAX_MODEL_LEN="${VLLM_MAX_MODEL_LEN:-32768}"
GPU_MEM_UTIL="${VLLM_GPU_MEM_UTIL:-0.90}"

if ! command -v vllm >/dev/null 2>&1; then
  echo "error: 'vllm' not found on PATH. Install with: pip install vllm" >&2
  exit 1
fi

args=(
  serve "$MODEL"
  --host "$HOST"
  --port "$PORT"
  --max-model-len "$MAX_MODEL_LEN"
  --gpu-memory-utilization "$GPU_MEM_UTIL"
)

if [ -n "${VLLM_API_KEY:-}" ]; then
  args+=(--api-key "$VLLM_API_KEY")
fi

echo "Serving DiffusionGemma '$MODEL' on http://$HOST:$PORT/v1 (vLLM)" >&2
exec vllm "${args[@]}"

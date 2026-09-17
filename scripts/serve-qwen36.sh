#!/usr/bin/env bash
# serve-qwen36.sh — Serve Qwen3.6-35B-A3B (NVFP4) locally via vLLM (OpenAI-compatible).
#
# Qwen3.6-35B-A3B is an autoregressive MoE (35B total, ~3B active per token).
# This launcher starts an OpenAI-compatible endpoint that the DWS LLMClient
# `vllm-local` path consumes, giving standard/heavy-tier agents a local,
# tool-calling option (the counterpart to tool-free DiffusionGemma). Run on a
# DGX Spark / RTX host.
#
# Quant: use the NVFP4 build on Blackwell (DGX Spark GB10 / RTX 50-series) —
#   ~18GB weights, ships as nvidia/Qwen3.6-35B-A3B-NVFP4. NVFP4 is a vLLM /
#   TensorRT-LLM format; it does NOT load on Ollama (GGUF/llama.cpp).
#
# Usage:
#   scripts/serve-qwen36.sh
#   QWEN_MODEL=nvidia/Qwen3.6-35B-A3B-NVFP4 scripts/serve-qwen36.sh
#
# After it is up, point the app at it:
#   export VLLM_BASE_URL=http://localhost:8000/v1
#
# Env:
#   QWEN_MODEL            HF / vLLM model tag (default: nvidia/Qwen3.6-35B-A3B-NVFP4)
#   VLLM_HOST             bind host        (default: 0.0.0.0)
#   VLLM_PORT             bind port        (default: 8000)
#   VLLM_MAX_MODEL_LEN    context length   (default: 32768)
#   VLLM_GPU_MEM_UTIL     fraction of VRAM (default: 0.90)
#   VLLM_API_KEY          optional bearer token for the served endpoint
#
# Output: streams vLLM server logs. Non-zero exit if vllm is missing or fails.

set -euo pipefail

MODEL="${QWEN_MODEL:-nvidia/Qwen3.6-35B-A3B-NVFP4}"
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

echo "Serving Qwen3.6-35B-A3B '$MODEL' on http://$HOST:$PORT/v1 (vLLM)" >&2
exec vllm "${args[@]}"

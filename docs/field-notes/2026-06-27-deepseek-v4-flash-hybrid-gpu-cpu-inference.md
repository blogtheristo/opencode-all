# Field Note — DeepSeek V4 Flash on Hybrid GPU/CPU Inference (27.06.2026)

_Community contribution by Yannick Nick (@keennay). Companion field note to LSJ #34. Sovereign-edge relevance per CLAUDE.md §Resolver — the owned-box thesis depends on hardware that runs the model._

## Signal

DeepSeek V4 Flash (MoE, ~671B parameters) running at **native mixed precision (FP4 + FP8)** on consumer/prosumer hardware: **2× RTX Pro 6000 GPUs + 256 GB DDR5 RAM**, using KTransformers (KVCache-AI fork of SGLang) for hybrid GPU/CPU memory inference. Context length: 1M tokens.

KTransformers gets less mention than vLLM, SGLang, and llama.cpp despite being listed for many popular models on HuggingFace. The KVCache-AI team's core contribution: a forked SGLang that offloads MoE experts between GPU VRAM and system RAM, making models that "shouldn't fit" runnable on consumer hardware.

## Hardware setup

| Component  | Spec                  |
| ---------- | --------------------- |
| GPUs       | 2× RTX Pro 6000       |
| System RAM | 256 GB DDR5           |
| Model      | DeepSeek V4 Flash     |
| Precision  | FP4 + FP8 (native)    |
| Context    | 1,048,576 tokens (1M) |
| Framework  | KTransformers SGLang  |

## Key inference parameters

- GPU Memory Utilization: 87%
- Number of Experts per MoE Layer on GPU: 134 / 256
- Chunked Prefill Size: 16,384
- Max Prefill Tokens: 16,384
- GPU Prefill Token Threshold: 1,024
- Max Running Requests: 256
- CUDA Graph Max Batch Size: 256
- CUDA Graph Batch Sizes: 1 2 4 8 16 32 64 128 256
- Available GPU Memory: 20.81 GB (anything less too tight for agentic coding)
- Utilized CPU Memory: ~200 GB

## Benchmark results (AlienKevin/SWE-ZERO-12M-trajectories)

100 prompts, 10 concurrent, ~8k input tokens, ~1k output tokens. Radix and Chunked Prefix Cache both **disabled** (worst-case scenario).

| Metric                     | Mean            | Median       |
| -------------------------- | --------------- | ------------ |
| Prefill Batch Tokens       | 35,756.93 tok/s | 652.90 tok/s |
| TTFT                       | 20.698 s        | 12.714 s     |
| Decode Batch Output Tokens | 27.39 tok/s     | 20.63 tok/s  |

## KTransformers SGLang launch command

```bash
env CUDA_VISIBLE_DEVICES=0,1 \
    FLASHINFER_CUDA_ARCH_LIST=12.0a \
    TORCH_CUDA_ARCH_LIST=12.0+PTX \
    SGLANG_DSV4_MODE=2604 \
    SGLANG_DSV4_2604_SUBMODE=2604B \
    SGLANG_FP8_PAGED_MQA_LOGITS_TORCH=1 \
    SGLANG_OPT_USE_TILELANG_INDEXER=1 \
    SGLANG_FLASHMLA_BACKEND_OVERRIDE=triton \
numactl --cpunodebind=0 --membind=0 \
python -m sglang.launch_server \
    --host 0.0.0.0 --port 8000 \
    --model-path <model-snapshot-path> \
    --kt-weight-path <model-snapshot-path> \
    --kt-cpuinfer 30 \
    --kt-threadpool-count 1 \
    --kt-num-gpu-experts 134 \
    --kt-method MXFP4 \
    --kt-max-deferred-experts-per-token 2 \
    --kt-expert-placement-strategy uniform \
    --kt-enable-dynamic-expert-update \
    --trust-remote-code \
    --context-length 1048576 \
    --max-total-tokens 1048576 \
    --mem-fraction-static 0.87 \
    --chunked-prefill-size 16384 \
    --served-model-name deepseek \
    --enable-mixed-chunk \
    --tensor-parallel-size 2 \
    --numa-node 0 0 \
    --enable-p2p-check \
    --disable-shared-experts-fusion \
    --enable-metrics \
    --collect-tokens-histogram \
    --kt-gpu-prefill-token-threshold 1024 \
    --tool-call-parser deepseekv4 \
    --reasoning-parser deepseek-v4 \
    --max-running-requests 256 \
    --cuda-graph-max-bs 256 \
    --cuda-graph-bs 1 2 4 8 16 32 64 128 256
```

## Installation steps (KVCache-AI stack)

1. Clone KTransformers and build KT-Kernel:

   ```bash
   git clone <ktransformers-repo>
   cd ktransformers && git submodule update --init --recursive
   cd kt-kernel && ./install.sh
   ```

2. Install KVCache-AI SGLang:

   ```bash
   cd ../ && ./install.sh
   ```

3. Required Python packages:

   ```bash
   python -m pip install "tilelang==0.1.8"
   python -m pip install "apache-tvm-ffi==0.1.9"
   python -m pip install --upgrade flashinfer-python flashinfer-cubin
   python -m pip install "transformers==4.57.1"
   ```

4. Build Flash-MLA (requires CUDA 12.9):

   ```bash
   python -m pip install --no-build-isolation 'flash-mla @ git+<flash-mla-repo>'
   ```

5. Update cuDNN for CUDA 12.9:
   ```bash
   python -m pip install nvidia-cudnn-cu12==9.16.0.29
   ```

## Benchmark runners

- **Decode bench:** `python llm_decode_bench.py --port 8000` (local-inference-lab/llm-inference-bench)
- **SWE-ZERO:** `python benchmark_swezero.py --model deepseek --num-prompts 100 --concurrency 10 --input 8k --output-cap 1000 --seed 79`

## Why it matters for sovereign edge

The owned-box thesis depends on hardware that runs the model. Hybrid GPU/CPU inference via KTransformers makes 700B+ MoE models practical on prosumer hardware (~$10–15K). This is the supply-side enabler for on-prem agentic AI without hyperscale CapEx. Expect hybrid setups to gain popularity as hardware prices climb and consumer-side runners continue finding creative offload strategies — GPU/CPU memory splits, distributed inference, weight quantization, KV cache quants, REAPs.

## Future test targets (per contributor)

- MiniMax M3
- GLM-5.2
- Kimi K2.7-Code

## Source references

- KVCache-AI KTransformers: github.com/kvcache-ai/ktransformers
- Yannick Nick GPU cluster setup: github.com/keennay/gpu-cluster
- DeepSeek V4 Flash model: huggingface.co/deepseek-ai/DeepSeek-V4-Flash
- AlienKevin/SWE-ZERO-12M-trajectories dataset: huggingface.co/datasets/AlienKevin/SWE-ZERO-12M-trajectories
- local-inference-lab/llm-inference-bench: github.com/local-inference-lab/llm-inference-bench

## Tags

`#inference` `#deepseek` `#ktransformers` `#hybrid-inference` `#gpu-cpu-offload` `#moe` `#sovereign-edge` `#community` `#benchmark`

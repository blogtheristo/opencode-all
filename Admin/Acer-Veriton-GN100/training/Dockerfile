# =============================================================================
# GN100 training container — ARM64 / NVIDIA GB10
# =============================================================================
# Base is the NGC PyTorch image validated on the GN100 (Admin/Acer-Veriton-GN100
# /README.md §"2026-03-11 Environment Validation"): it ships an ARM64 manifest
# and a torch built for CUDA 12.8. DO NOT swap for a generic `pytorch/pytorch`
# tag — those resolve to linux/amd64 and fail with `exec format error` on this
# aarch64 host. The base prints a "GB10 may not yet be supported" warning; nf4
# QLoRA + LoRA are fine, smoke-test any advanced/exotic kernels.
# =============================================================================
FROM nvcr.io/nvidia/pytorch:25.02-py3

# torch already comes from the base image — install only the training stack on
# top. --no-deps on torch is implicit because we do not list it in requirements.
COPY infrastructure/llm-training/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt

WORKDIR /workspace
COPY infrastructure/llm-training/scripts /workspace/scripts
COPY infrastructure/llm-training/configs /workspace/configs
COPY evals /workspace/evals

# Checkpoints and datasets are bind-mounted at runtime (see docker-compose).
VOLUME ["/checkpoints", "/datasets"]

# Default: show the trainer help. Real runs pass a --config (see TRAINING_RUNBOOK.md).
ENTRYPOINT ["python", "scripts/train-70b-lora.py"]
CMD ["--help"]

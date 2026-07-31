# GN100 Training Runbook — On-Premise QLoRA Fine-Tuning

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.8) | Session: claude/acer-node-claim-verification-u7jai1 | Date: 24.07.2026 | Changes: Initial on-premise training runbook — end-to-end QLoRA fine-tuning on the Acer Veriton GN100 via scripts/deploy-acer-training.sh, backing the EMT-001 / TM-001 products.

Session Links & References:
  - Device manual: `Admin/Acer-Veriton-GN100/README.md`
  - Pipeline: `infrastructure/llm-training/`
  - Methodology: `AgentFoundry/Calculus_for_Training.md`

Document Status:
  - Created: 24.07.2026
  - Last Modified: 24.07.2026
  - Language: English
  - Publication Status: ACTIVE

***

**Purpose:** Standard operating procedure for running an on-premise QLoRA
fine-tune on the Acer Veriton GN100 (ARM64 / NVIDIA GB10). This is the
human-executed hardware step that turns the committed, CI-tested pipeline into
a delivered on-premise capability for EMT-001 / TM-001.

**Audience:** Delivery, DevOps, SLM engineers.

---

## 0. Prerequisites

- SSH access to `gn100-cb5d` (`admin100`), VPN-connected (Helsinki lab).
- Docker + NVIDIA Container Toolkit healthy on the GN100 (validated — see
  `README.md §"2026-03-11 Environment Validation"`).
- A Hugging Face token with access to the base model (e.g. Llama 3.1 8B).
- The training dataset as JSONL with a `text` column (SFT format).

## 1. CI-verify the pipeline first (any host)

Before touching hardware, confirm the pipeline is green:

```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r infrastructure/llm-training/requirements-dev.txt
pytest infrastructure/llm-training/tests -v      # config intent + CPU smoke fine-tune
```

All tests must pass (or skip cleanly where the ML stack is absent).

## 2. Configure the secret

```bash
cd Admin/Acer-Veriton-GN100/training
cp .env.training.example .env.training
# Edit .env.training — set HF_TOKEN (never committed; git-ignored)
```

## 3. Deploy the training image to the GN100

```bash
# From repo root. Syncs the build context and builds the ARM64 image on the box.
bash scripts/deploy-acer-training.sh deploy
# Preview without touching the host:
bash scripts/deploy-acer-training.sh --dry-run deploy
```

This mirrors the Edge-PostgreSQL deploy pattern (`deploy-acer-postgres.sh`):
SSH retry helpers, ARM64 arch check, `docker compose build`.

## 4. Stage the dataset

Copy the JSONL to the GN100 training volume:

```bash
scp your-dataset.jsonl admin100@gn100-cb5d:/opt/dws/edge-training/Admin/Acer-Veriton-GN100/training/datasets/
```

## 5. Run the fine-tune

```bash
bash scripts/deploy-acer-training.sh train \
  --config configs/gn100-8b-qlora.yaml \
  --dataset /datasets/your-dataset.jsonl \
  --output-dir /checkpoints/your-model
```

`train` first runs `scripts/training-mode.sh` on the box (stops Ollama + the
agent stack to free ~70 GB), then launches the training container. Monitor:

```bash
bash scripts/deploy-acer-training.sh status   # container + GPU (nvidia-smi)
bash scripts/deploy-acer-training.sh logs     # tail training logs
```

## 6. Evaluate before promotion

```bash
# On the box (inside the container) or after pulling the checkpoint:
python infrastructure/llm-training/scripts/evaluate.py \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --adapter /checkpoints/your-model/final \
  --eval evals/industry_baseline.jsonl \
  --out report.json
```

Gate: the model must clear the eval-regression bar (`DWS_MODEL_STANDARD.md §10`)
before it is handed to the customer. Use a per-customer eval set for a real
engagement; the baseline is only a seed.

## 7. Return the box to production

```bash
# Restore inference/agent serving when the run is done:
ssh admin100@gn100-cb5d 'bash /opt/dws/scripts/production-mode.sh'
bash scripts/deploy-acer-training.sh destroy   # stop the training container (checkpoints preserved)
```

## 8. Recording go-live evidence

The first successful real run is the evidence that flips the EMT-001 on-prem
tier from "pipeline delivered / go-live pending" to "live":

- Save the `report.json` eval score and the MLflow run.
- Append a row to `Admin/Acer-Veriton-GN100/README.md` Maintenance Log.
- Update `Store/PRODUCT_ENTERPRISE_MODEL_TRAINING.md` on-prem status accordingly.

---

## Failure modes

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| `exec format error` on build | amd64 image on ARM64 host | Use the NGC ARM64 base only; never `--platform linux/amd64` |
| `GB10 may not yet be supported` warning | NGC container caveat | Expected; QLoRA works — smoke-test exotic kernels |
| OOM during load | box still in production mode | Ensure `training-mode.sh` ran and freed memory (`status`) |
| bitsandbytes error on CPU | no GPU visible | The trainer degrades to full precision off-GPU; on the GN100 this means the GPU isn't visible — check `nvidia-smi` |

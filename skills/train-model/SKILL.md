# /train-model — Custom Model Fine-Tuning (EMT-001 / TM-001)

Run a custom QLoRA fine-tune on the Acer Veriton GN100 edge node (on-premise,
sovereign) or GCP A3 Mega burst, using the pipeline in
`infrastructure/llm-training/`. This is the executable backing for the
Enterprise Model Training (EMT-001) and Train Model (TM-001) products.

## Trigger Phrases

`/train-model`, `/train-model deploy`, `/train-model train`, "fine-tune a model",
"train on the Acer node", "run a training job", "EMT-001 training".

## Parameters

- `ACTION` — `summary` (default) | `deploy` | `train` | `status` | `eval` | `smoke`
- `BASE_MODEL` — HF model id (default per config; GN100 reference = `meta-llama/Llama-3.1-8B-Instruct`)
- `DATASET` — path to a JSONL training set (a `text` column)
- `TARGET` — `gn100` (on-premise, default) | `gcp` (cloud burst)
- `EVAL` — optional path to a held-out JSONL eval set (enables periodic eval)

## Configs (`infrastructure/llm-training/configs/`)

| Config | Use |
|--------|-----|
| `gn100-8b-qlora.yaml` | On-prem GN100 reference — Llama 3.1 8B QLoRA (EMT-001 Starter) |
| `70b-lora.yaml` | 70B QLoRA — hybrid GN100 / GCP (Bridge Track / Professional) |
| `70b-full.yaml` | 70B full fine-tune — GCP A3 Mega only (Enterprise) |
| `smoke-cpu.yaml` | Tiny CPU smoke config for tests |

## Procedure

### `/train-model` or `/train-model summary`
1. List the configs above and the current on-prem status.
2. Point to `Admin/Acer-Veriton-GN100/TRAINING_RUNBOOK.md` for the full workflow.

### `/train-model smoke`
Run the CI-safe test suite (no GPU needed):
```
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install -r infrastructure/llm-training/requirements-dev.txt
pytest infrastructure/llm-training/tests -v
```
Verifies config intent + an end-to-end CPU fine-tune that writes a checkpoint.

### `/train-model deploy` (TARGET=gn100)
1. Ensure `Admin/Acer-Veriton-GN100/training/.env.training` exists (from `.example`, `HF_TOKEN` set).
2. `bash scripts/deploy-acer-training.sh deploy` — syncs context + builds the ARM64 image on the GN100.

### `/train-model train` (TARGET=gn100)
1. Copy the dataset JSONL to the GN100 (`.../training/datasets/`).
2. `bash scripts/deploy-acer-training.sh train --config configs/gn100-8b-qlora.yaml --dataset /datasets/<name>.jsonl --output-dir /checkpoints/<name>` — frees memory (`training-mode.sh`) then runs the job.
3. For GCP burst, follow `infrastructure/llm-training/README.md` (Terraform + `torchrun`).

### `/train-model eval`
```
python infrastructure/llm-training/scripts/evaluate.py \
  --model <BASE_MODEL> --adapter <checkpoint>/final \
  --eval evals/industry_baseline.jsonl --out report.json
```
Emits a JSON score report — the eval-regression gate before promoting a model.

### `/train-model status`
`bash scripts/deploy-acer-training.sh status` — container + GPU state on the GN100.

## Governance

- Model naming / quantization / origin policy: `DWS_MODEL_STANDARD.md`.
- Methodology + cost calculus: `AgentFoundry/Calculus_for_Training.md`.
- On-prem hardware + runbook: `Admin/Acer-Veriton-GN100/TRAINING_RUNBOOK.md`.
- Never commit `HF_TOKEN` or datasets; `.env.training` and checkpoints are git-ignored.

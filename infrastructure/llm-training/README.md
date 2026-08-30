# Lifetime World - LLM Training Infrastructure

Infrastructure as Code (IaC) for training the Lifetime World Model, supporting both local development on Acer Veriton GN-100 clusters and cloud burst training on Google Cloud.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 HYBRID TRAINING ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LOCAL CLUSTER (2x Acer Veriton GN-100)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • NVIDIA GB10 Superchip (Blackwell + Grace, 128GB unified memory)  │   │
│  │  • Fine-tuning: 7B-13B models (full), 70B models (LoRA/QLoRA)       │   │
│  │  • Dataset preprocessing & validation                                │   │
│  │  • Hyperparameter sweeps, model quantization                         │   │
│  │  • Cost: ~€0.50/hr (electricity only)                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼ sync-to-gcp.ps1                             │
│                    ┌─────────────────────────────────┐                     │
│                    │     Google Cloud Storage        │                     │
│                    │   lifetime-llm-checkpoints      │                     │
│                    └─────────────────────────────────┘                     │
│                              │                                              │
│                              ▼ terraform apply                             │
│  CLOUD BURST (GCP A3 Mega)                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • 8x NVIDIA H100 80GB per node                                      │   │
│  │  • Full 70B fine-tuning, distributed training at scale               │   │
│  │  • Cost: ~€35/hr on-demand, ~€14/hr spot                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
infrastructure/llm-training/
├── configs/                         # Reference training configs (YAML)
│   ├── gn100-8b-qlora.yaml         # On-prem GN100 reference (Llama 3.1 8B QLoRA)
│   ├── 70b-lora.yaml               # 70B QLoRA (hybrid GN100 / GCP)
│   ├── 70b-full.yaml               # 70B full fine-tune (GCP A3 Mega only)
│   └── smoke-cpu.yaml              # Tiny CPU smoke config (tests)
│
├── local/                           # Local training infrastructure
│   └── docker-compose.training.yml  # Container orchestration
│
├── gcp-burst/                       # Google Cloud infrastructure
│   ├── main.tf                      # Terraform configuration
│   └── training.tfvars.example      # Variables
│
├── scripts/                         # Training & utility scripts
│   ├── train-70b-lora.py           # LoRA/QLoRA fine-tuning (CLI + YAML, --dry-run)
│   ├── evaluate.py                  # Eval harness -> JSON score report
│   ├── quantize.py                  # Model quantization
│   └── sync-to-gcp.ps1             # Checkpoint sync
│
├── tests/                           # pytest — config intent + CPU smoke fine-tune
├── requirements.txt                 # Runtime deps (torch from NGC container)
├── requirements-dev.txt             # + pytest
└── README.md                        # This file
```

On-prem deploy to the Acer GN100 is driven by `scripts/deploy-acer-training.sh`
(repo root); see `Admin/Acer-Veriton-GN100/TRAINING_RUNBOOK.md`.

## Quick Start

### Local Training (GN-100 Cluster)

```powershell
# 1. Navigate to local infrastructure
cd infrastructure/llm-training/local

# 2. Create environment file
copy .env.training.example .env.training
# Edit .env.training with your paths and tokens

# 3. Start training infrastructure
docker-compose -f docker-compose.training.yml up -d

# 4. Access services
# - Jupyter: http://localhost:8888 (token: lifetime2026)
# - MLflow:  http://localhost:5000
# - MinIO:   http://localhost:9001

# 5. Start training
docker exec -it llm-training-orchestrator python /scripts/train-70b-lora.py \
  --model meta-llama/Llama-3.3-70B-Instruct \
  --dataset /datasets/your-dataset.jsonl \
  --output-dir /checkpoints/70b-lora
```

### Cloud Burst (GCP A3 Mega)

```bash
# 1. Navigate to GCP infrastructure
cd infrastructure/llm-training/gcp-burst

# 2. Configure variables
cp training.tfvars.example training.tfvars
# Edit training.tfvars with your project settings

# 3. Set credentials
export TF_VAR_hf_token="hf_xxxxx"
export TF_VAR_wandb_api_key="xxx"  # optional

# 4. Initialize and apply
terraform init
terraform plan -var-file="training.tfvars"
terraform apply -var-file="training.tfvars"

# 5. SSH to training node
gcloud compute ssh lifetime-llm-training-node-0 \
  --zone=europe-north1-a \
  --tunnel-through-iap

# 6. Start training on GCP
torchrun --nproc_per_node=8 train-70b-lora.py \
  --config /configs/70b-full.yaml

# 7. Destroy when done (IMPORTANT - save costs!)
terraform destroy -var-file="training.tfvars"
```

### Sync Local → Cloud

```powershell
# Sync local checkpoints to GCP for burst training
.\scripts\sync-to-gcp.ps1 -CheckpointPath C:\data\llm\checkpoints\latest

# Dry run first
.\scripts\sync-to-gcp.ps1 -CheckpointPath C:\data\llm\checkpoints\latest -DryRun
```

## Cost Comparison

| Scenario | Infrastructure | Duration | Cost |
|----------|---------------|----------|------|
| **Local Fine-tuning (7B)** | 2x GN-100 | 24 hrs | ~€12 (electricity) |
| **Local Fine-tuning (13B)** | 2x GN-100 | 48 hrs | ~€24 (electricity) |
| **Local LoRA (70B)** | 2x GN-100 | 72 hrs | ~€36 (electricity) |
| **Cloud Fine-tuning (70B)** | 1x A3 Mega (8xH100) | 72 hrs | ~€2,520 on-demand |
| **Cloud Fine-tuning (70B)** | 1x A3 Mega (spot) | 72 hrs | ~€1,008 spot |

### Total Project Cost Estimate (70B Fine-tuning)

| Phase | Local | Cloud |
|-------|-------|-------|
| Dataset prep | €24 | €500 |
| Hyperparameter search | €12 | €2,000 |
| Final training | - | €2,520-€5,040 |
| Quantization & eval | €12 | €200 |
| **Total** | **€48 + cloud burst** | **€5,220-€7,740** |

**Hybrid Strategy Savings: ~40-60%**

## Model Size Guidelines

| Model Size | Local (GN-100) | Cloud (A3 Mega) | Recommended |
|------------|----------------|-----------------|-------------|
| 7B | ✅ Full fine-tune | ✅ Full fine-tune | Local |
| 13B | ✅ Full fine-tune | ✅ Full fine-tune | Local |
| 30B | ⚠️ QLoRA only | ✅ Full fine-tune | Hybrid |
| 70B | ⚠️ QLoRA only | ✅ Full fine-tune | Hybrid |
| 405B+ | ❌ Not feasible | ⚠️ Multi-node | Cloud only |

## Groq Integration (Inference Only)

**Important:** Groq LPU is optimized for **inference only**, not training.

### Where Groq Fits

```
Training (GN-100/GCP)  →  Fine-tuned Model  →  Groq Cloud (Inference)
         │                      │                      │
    Your hardware          Your weights          Ultra-fast API
    Your data              Your IP               ~500 tok/s
```

### Groq Inference Pricing

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| Llama 3.3 70B | $0.59 | $0.79 |
| Llama 3.1 8B | $0.05 | $0.08 |
| Mixtral 8x7B | $0.24 | $0.24 |

**Savings vs OpenAI/Anthropic:** 50-90% cheaper for inference

### Recommended Workflow

1. **Train locally** (GN-100) or **burst to cloud** (GCP) for fine-tuning
2. **Deploy to Groq** for production inference (ultra-low latency)
3. **Fallback to vLLM** on local cluster for sensitive data

## Security & Compliance

- All credentials stored in **Google Secret Manager** (cloud) or `.env.training` (local)
- Training data never leaves **europe-north1** region (GDPR compliant)
- Model weights are **your IP** - full ownership retained
- Audit logging enabled for all training runs (MLflow)

## Status

**Delivered + CI-tested (this repo):**
- ✅ QLoRA/LoRA trainer with reference configs, eval step, `--dry-run`, and
  off-GPU degradation (`scripts/train-70b-lora.py`, `configs/`)
- ✅ Eval harness + seed eval set (`scripts/evaluate.py`, `evals/`)
- ✅ Test suite — config-intent + an end-to-end CPU smoke fine-tune that writes a
  checkpoint (`tests/`, run with `pytest infrastructure/llm-training/tests`)
- ✅ ARM64 training container + on-prem deploy script
  (`Admin/Acer-Veriton-GN100/training/`, `scripts/deploy-acer-training.sh`)

**Pending a hardware run (documented in `Admin/Acer-Veriton-GN100/TRAINING_RUNBOOK.md`):**
- ⏳ First real QLoRA run on the GN100 (go-live evidence: eval report + MLflow run)
- ⏳ GCP A3 Mega burst validation for full 70B fine-tune

## Next Steps

1. Run `pytest infrastructure/llm-training/tests` to verify the pipeline.
2. `scripts/deploy-acer-training.sh deploy` — build the ARM64 image on the GN100.
3. Run an 8B QLoRA fine-tune on a real dataset; capture the eval report.
4. Burst to GCP for a full 70B run when a customer needs it.
5. Quantize and deploy to Groq / vLLM for inference.

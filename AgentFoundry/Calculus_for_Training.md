# Calculus for Training — LLM Fine-Tuning Methodology

Methodology reference for the Enterprise Model Training (EMT-001) and Train Model
(TM-001) products. This is the document cited by
`Store/PRODUCT_ENTERPRISE_MODEL_TRAINING.md` and the thesis; it describes the
pipeline whose runnable implementation lives in `infrastructure/llm-training/`.

Governed by `DWS_MODEL_STANDARD.md` (model naming, quantization, origin policy,
Approval & Evaluation Gate).

---

## 1. Scope

How Lifetime Oy fine-tunes a customer's private, IP-retained model: the method,
the hardware calculus (on-prem GN100 vs GCP burst), the hyperparameter defaults,
the cost model, and the eval gate. It is the "why" behind the scripts and configs;
the scripts are the "how".

- **Runnable pipeline:** `infrastructure/llm-training/scripts/train-70b-lora.py`
- **Reference configs:** `infrastructure/llm-training/configs/*.yaml`
- **Eval harness:** `infrastructure/llm-training/scripts/evaluate.py`, `evals/`
- **On-prem deploy:** `scripts/deploy-acer-training.sh`, `Admin/Acer-Veriton-GN100/TRAINING_RUNBOOK.md`

## 2. Method — QLoRA SFT

The default is 4-bit **QLoRA** supervised fine-tuning (SFT):

1. **Quantize** the base model to 4-bit NF4 (double quantization) — shrinks an
   8B/70B base to fit unified memory (`get_bnb_config`).
2. **Attach LoRA adapters** to the attention + MLP projections
   (`q/k/v/o_proj`, `gate/up/down_proj`) — only the adapters train, ~0.1–1% of
   parameters (`get_lora_config`).
3. **SFT** over the customer's JSONL dataset with `trl`'s `SFTTrainer`
   (`build_sft_trainer`, TRL-version-adaptive).
4. **Evaluate** against a held-out set each N steps and after training
   (`evaluate.py`) — the eval-regression gate.
5. **Merge / quantize / deploy** — export adapters, optionally merge and
   re-quantize (GGUF/AWQ/NVFP4) for the target inference runtime.

Full-parameter fine-tune is reserved for the Enterprise tier on GCP A3 Mega
(`configs/70b-full.yaml`); it is not feasible on the GN100.

## 3. Hardware calculus — where a run belongs

| Model | GN100 (GB10, ~120 GiB unified) | GCP A3 Mega (8×H100) | Default |
|-------|-------------------------------|----------------------|---------|
| 7B–8B | ✅ full or QLoRA | ✅ full | On-prem |
| 13B | ✅ full or QLoRA | ✅ full | On-prem |
| 30B | ⚠️ QLoRA only | ✅ full | Hybrid |
| 70B | ⚠️ QLoRA only | ✅ full | Hybrid |
| 405B+ | ❌ | ⚠️ multi-node | Cloud |

The GN100's unified CPU/GPU memory is the lever: it removes the discrete-VRAM
ceiling that normally forces small fine-tunes to the cloud, so 8–13B QLoRA runs
on-prem at electricity cost. Above ~30B, QLoRA still fits on-prem but a full
fine-tune must burst to GCP. See `Admin/Acer-Veriton-GN100/README.md` for the
validated ARM64 container (`nvcr.io/nvidia/pytorch:25.02-py3`) and the GB10 caveat.

## 4. Hyperparameter defaults (and why)

| Knob | GN100 8B | 70B | Rationale |
|------|----------|-----|-----------|
| quant | nf4 4-bit + double | nf4 4-bit + double | Fit memory; nf4 preserves quality vs int4 |
| lora_r / alpha | 32 / 64 | 64 / 128 | Capacity scales with base size; alpha = 2·r |
| lr | 2e-4 | 2e-4 | Standard QLoRA LR; cosine schedule, 3% warmup |
| batch × grad-accum | 2 × 8 | 1 × 8 | Effective batch ~16 within memory budget |
| epochs | 3 | 3 | Enough for domain SFT without overfit on 1–50 GB |
| seq len | 2048 | 2048 | Covers construction/compliance docs; raise for long-context |
| optim | paged_adamw_8bit | paged_adamw_8bit | Paged optimizer avoids OOM spikes |

These are the committed defaults in `DEFAULT_CONFIG` and the shipped YAMLs; a
per-customer engagement tunes from here based on dataset size and eval curves.

## 5. Cost model

On-prem marginal cost is electricity only (~€0.50/hr); the cloud burst is the
expensive tier. Indicative (from `infrastructure/llm-training/README.md`):

| Scenario | Infra | ~Duration | ~Cost |
|----------|-------|-----------|-------|
| 8B QLoRA | GN100 | 24 h | ~€12 (electricity) |
| 70B QLoRA | GN100 | 72 h | ~€36 (electricity) |
| 70B full | GCP A3 Mega (spot) | 72 h | ~€1,000 |

The hybrid strategy — prototype and small fine-tunes on-prem, burst only the
large full-parameter runs — is what makes the EMT-001 margins work.

## 6. Evaluation gate

No model ships to a customer without a passing eval-regression check
(`DWS_MODEL_STANDARD.md §10`). The harness (`evaluate.py`) scores the fine-tuned
model against a registered JSONL eval set (`evals/`) using deterministic
keyword/substring scoring — the model is **not** in the scoring path. A
per-customer engagement ships a domain-specific eval set built from the
customer's data; `evals/industry_baseline.jsonl` is the cross-industry seed.

## 7. Sovereignty & IP

Training data never leaves the chosen jurisdiction: on-prem stays on the GN100
in the Helsinki lab; cloud burst is pinned to `europe-north1` (Finland). The
customer retains full IP of the resulting weights. Secrets (`HF_TOKEN`) and
datasets are env-injected and git-ignored — never committed.

---

**Owner:** Product Strategy & AI Research · Lifetime Oy
**Implementation:** `infrastructure/llm-training/`
**Governance:** `DWS_MODEL_STANDARD.md`

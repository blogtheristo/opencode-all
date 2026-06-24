---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Commit: pending | Date: 23.05.2026 | Changes: Initial product documentation for Train Model (self-serve entry SKU). Sits one tier below Enterprise Model Training (EMT-001), addressing customers who want to own a fine-tuned SLM without a project-tier engagement. Three sizes (Compact 3B, Standard 9B, Pro 32B) at €1,490 / €2,990 / €7,490. Built bottom-up from the 23.05.2026 LWM price-estimate study with €100/h SLM engineer line included.
- Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Commit: pending | Date: 23.05.2026 | Changes: CEO review pass. (1) Tightened Pro 32B to single-overnight delivery: wall clock 10–14h (was ~36h / 3 nights), training data cap 2M examples (was 10M), NVFP4 PTQ + NIM container moved from default deliverable to paid add-ons. Restores "overnight on every tier" identity. Pro price held at €7,490 (margin lifts to ~94%). (2) Killed the proposed Flagship 70B **self-checkout** tier — a Stripe-enabled 70B card would have turned the Store page into a soft project SKU. Instead, added a **visible-but-gated 70B teaser tile** ("Bridge Track 70B — Invite Only") with no published price and a "Contact Sales" CTA. Real Bridge Track scope and pricing (€19,990) live inside EMT-001 (see PRODUCT_ENTERPRISE_MODEL_TRAINING.md v1.2). This surfaces existence so qualifying scripts can route inbound, without diluting the self-serve identity. (3) Added Agent Surface section (`POST /train-model`) per Build for Agents rule. (4) Added Inbound Qualification Scripts section (audited Boardy drafts) for sales-led routing into Bridge Track.

Document Status:

- Created: 23.05.2026
- Last Modified: 23.05.2026
- Language: English
- Publication Status: Draft
- Document Type: Product Documentation

Compliance:

- Applicable Regulations: EU AI Act, GDPR
- Reference Documents: docs/field-notes/2026-05-23-lwm-price-estimate-colab-vs-nvidia-cloud.md, docs/field-notes/2026-05-23-train-model-product-three-tier-enterprise-pricing.md, product-catalog/LWM/training-manual.md

Legal:

- Intellectual Property: Customer retains full IP of trained models
- Contractual: Self-serve order form (fixed-scope deliverable)
- Review Required: Pending (Sales, Legal)

---

# Train Model

## Self-Serve SLM Fine-Tuning — Three Sizes, Fixed Price, Overnight Delivery

_Part of the DWS IQ Industrial Intelligence suite — the self-serve entry tier for owning the sovereign, fine-tuned models that power Industrial Intelligence deployments._

**Product Code:** TM-001
**Version:** 1.0
**Availability:** Q3 2026 (after 5-run unattended reliability proof)
**Pricing:** Fixed-Scope (€1,490 – €7,490)

---

## Product Overview

**Train Model** is the entry SKU for customers who want to own a fine-tuned Small Language Model (SLM) without committing to a project-tier engagement. Bring your dataset, pick a size, get a finished, eval'd, deployment-ready model by morning.

### Value Proposition

> "Your data in. Your model out. By breakfast."

Unlike Enterprise Model Training (EMT-001), Train Model is **self-serve** and **fixed-scope**:

- No discovery phase, no SOW, no 2–8 week project timeline.
- You bring a structured dataset (JSONL, instruction-response format).
- We run the pipeline overnight via our unattended Codex + computer-use loop.
- You get the model artifacts the next business day.

### Target Customers

| Segment                       | Typical Use Case                                                             | Tier          |
| ----------------------------- | ---------------------------------------------------------------------------- | ------------- |
| **SMB / department lead**     | Narrow-task assistant (e.g. classify support tickets, draft compliance copy) | Compact 3B    |
| **Mid-market vertical owner** | Industry-specific assistant, RAG backbone, internal compliance helper        | Standard 9B   |
| **Enterprise team**           | Flagship internal model, multi-turn reasoning, agentic workloads             | Pro 32B       |
| **Regulated enterprise**      | Custom architecture + dataset construction + 12-month support contract       | → **EMT-001** |

---

## Pricing Tiers

### Compact — 3B parameters — **€1,490**

| Aspect              | Details                                                             |
| ------------------- | ------------------------------------------------------------------- |
| **Base Model**      | Llama 3.2 3B / Qwen3 3B (customer choice)                           |
| **Training Method** | QLoRA (4-bit, parameter-efficient)                                  |
| **Training Data**   | Up to 500K examples (customer-supplied JSONL)                       |
| **Wall Clock**      | ~4 hours                                                            |
| **Hardware**        | A100 80GB cloud (Lambda / RunPod / Colab Pro+)                      |
| **Deployment Fit**  | Laptop CPU + 8 GB RAM (Q4 GGUF), iPhone (MLX), edge devices         |
| **Deliverables**    | safetensors + GGUF (Q4/Q8) + MLX (4/8-bit) + eval report + registry |

### Standard — 9B parameters — **€2,990**

| Aspect              | Details                                                                             |
| ------------------- | ----------------------------------------------------------------------------------- |
| **Base Model**      | Llama 3.1 8B / Mistral 9B / Qwen3 8B (customer choice)                              |
| **Training Method** | QLoRA + Split-LoRA (Unsloth Triton kernels)                                         |
| **Training Data**   | Up to 2M examples                                                                   |
| **Wall Clock**      | ~10 hours (one overnight cycle)                                                     |
| **Hardware**        | A100 80GB cloud, single GPU                                                         |
| **Deployment Fit**  | Single consumer GPU (24 GB VRAM, Q4 GGUF), Apple M-series (32 GB+, MLX)             |
| **Deliverables**    | safetensors + GGUF (Q4/Q8) + MLX (4/8-bit) + NIM container + eval report + registry |

### Pro — 32B parameters — **€7,490**

| Aspect              | Details                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------- |
| **Base Model**      | Qwen3 32B / Gemma 2 27B (customer choice — 2 supported architectures)                    |
| **Training Method** | QLoRA + Split-LoRA (Unsloth Triton kernels)                                              |
| **Training Data**   | Up to 2M examples                                                                        |
| **Wall Clock**      | ~10–14 hours (single overnight cycle)                                                    |
| **Hardware**        | H100 80GB cloud (Lambda / Brev), single GPU                                              |
| **Deployment Fit**  | Single H100 / Acer Veriton GN-100 (NVFP4) / Mac Studio M3 Ultra (MLX)                    |
| **Deliverables**    | safetensors + GGUF (Q4/Q8) + MLX (4/8-bit) + eval report + registry                      |
| **Add-ons** (paid)  | NVIDIA NIM container (+€490) · NVFP4 PTQ for Blackwell (+€990 — bundled in Aegis uplift) |

**Why Pro tightened from 36h to overnight (v1.1 change):** the original 36h / 3-night Pro broke the self-serve "wake up to a model" promise that Compact + Standard deliver. Datasets larger than 2M examples or workloads that genuinely need NVFP4 PTQ in the default deliverable now belong in the **Bridge Track** (see below). Pro stays a clean overnight SKU.

---

### Bridge Track 70B — **Invite Only** · price on request

> ⚡ **Not self-checkout.** This tier is gated by an inbound qualification call. We'll route you here from any inbound that asks for 70B and has a JSONL dataset ready.

| Aspect              | Details                                                                                      |
| ------------------- | -------------------------------------------------------------------------------------------- |
| **Base Model**      | Llama 3.1 70B / Qwen3 70B-class (customer choice, Apache-2.0 / Llama license)                |
| **Training Method** | QLoRA + Split-LoRA on H100 80GB cloud                                                        |
| **Training Data**   | Customer-supplied dataset (JSONL, no construction included)                                  |
| **Wall Clock**      | ~3 business days                                                                             |
| **Hardware**        | H100 80GB cloud (Lambda / NVIDIA Brev), or 2× A100 80GB                                      |
| **Deployment Fit**  | Acer Veriton GN-100 (NVFP4) · DGX Spark · Mac Studio M3 Ultra (MLX)                          |
| **Support**         | 30-day model SLA (eval-regression guarantee). Not a 12-month contract.                       |
| **Architecture**    | Standard Llama/Qwen 70B class only. Custom architectures route to EMT-001 full project tier. |
| **Pricing**         | **Price on request** — invite-only, indicative €19,990                                       |
| **How to access**   | [Contact Sales](#order-process) — qualification call required                                |

**Why this is invite-only:** the 70B fine-tune workload is operationally heavier than overnight Pro and benefits from a 15-minute scoping call to confirm dataset shape, base model choice, and target deployment surface. Publishing 70B as Stripe-checkout would either underspec the engagement or overspec the page — neither serves the customer.

Bridge Track scope, qualifying questions, and full pricing logic live in [PRODUCT_ENTERPRISE_MODEL_TRAINING.md → Training Packages → Bridge Track](PRODUCT_ENTERPRISE_MODEL_TRAINING.md#bridge-track-19990--invite-only).

---

## What's Included (All Tiers)

Every Train Model order ships the same artifact set so customers can self-serve from day one:

1. **Model checkpoints** — Hugging Face Transformers format (safetensors)
2. **Quantized inference artifacts** — GGUF (Q4_K_M + Q8_0), MLX (4-bit + 8-bit), NVIDIA NIM container
3. **Eval report** — pass/fail across customer-specified benchmark + DWS LWM-industry baseline (compliance, factuality, refusal rate)
4. **Validation report** — held-out test set performance, calibration curves, failure-mode taxonomy
5. **Reproducibility bundle** — training notebook, dataset spec, hyperparameter file, seed, registry URL
6. **30-day model SLA** — if our eval suite regresses on the delivered model within 30 days due to a pipeline issue, we re-train at no charge

---

## What's NOT Included (Sold Separately)

| Excluded                                     | Where to find it                            |
| -------------------------------------------- | ------------------------------------------- |
| Dataset construction from scratch            | → Enterprise Model Training (EMT-001)       |
| Hosting / inference infrastructure           | → DWS IQ Inference / Cloud Run              |
| Continuous re-training subscription          | → Train Model — Subscription (Q4 2026)      |
| Sovereign deployment (CLOUD-Act-free)        | → Aegis Sovereign Uplift (+€990, see below) |
| Custom architecture (non-Llama/Qwen/Mistral) | → Enterprise Model Training (EMT-001)       |
| 12-month support contract                    | → Enterprise Model Training (EMT-001)       |

---

## Aegis Sovereign Uplift — **+€990 on any tier**

Triggers when the customer needs:

- EU CLOUD-Act-free training (Lambda EU, Hetzner GPU, or on-prem Acer Veriton GN-100)
- Data-residency-guaranteed dataset handling
- Signed model attestation (KYA chain-of-custody)
- Air-gapped delivery

The €990 uplift covers operational overhead (sovereign-cloud account provisioning, attestation paperwork, KYA registration) and the Aegis tier brand premium — not the GPU $/h delta, which is under €20/run.

---

## Pricing Logic

Anchored on three reference points:

1. **OpenAI fine-tuning** — GPT-4o fine-tune ~$25 per 1M training tokens. A 100M-token fine-tune is ~$2,500. That's the upper anchor for Standard tier customer perception.
2. **Hugging Face AutoTrain / Together AI** — managed SLM fine-tunes priced $200–$2,000 per run. That's the lower anchor.
3. **Loaded BOM** — €150 / €210 / €680 (compute + Claude API data generation + €100/h engineer touch-time). Pricing at 7×–14× BOM yields 90–93% gross margin.

The **Standard tier at €2,990 is the conversion lane** — priced just under the OpenAI fine-tune anchor, ships an artifact the customer owns outright (not a hosted endpoint), and includes deployment-ready GGUF / MLX / NIM out of the box.

---

## Product Ladder (Where Train Model Sits)

```
                                    Customer Sophistication →

  ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────────────┐
  │  Train Model     │  ──→   │  Train Model     │  ──→   │  Enterprise Model        │
  │  Compact 3B      │        │  Standard 9B /   │        │  Training (EMT-001)      │
  │  €1,490          │        │  Pro 32B         │        │  €50K – €200K            │
  │                  │        │  €2,990–€7,490   │        │                          │
  │  Self-serve      │        │  Self-serve      │        │  Project-based           │
  │  Bring data      │        │  Bring data      │        │  We build dataset        │
  │  Overnight       │        │  Overnight       │        │  2–8 weeks               │
  │  GGUF/MLX/NIM    │        │  +NIM +NVFP4 PTQ │        │  Full ecosystem +        │
  │                  │        │                  │        │  12-month support        │
  └──────────────────┘        └──────────────────┘        └──────────────────────────┘
       SMB tier                   Mid-market tier                Enterprise / regulated
```

Customers who **outgrow** Train Model (need dataset construction, custom architecture, or 12-month support) graduate to Enterprise Model Training. Customers who **don't need** the project scope of Enterprise Model Training can land at Train Model instead of bouncing to OpenAI. The ladder prevents both leakage directions.

---

## Order Process

1. **Pick a tier** — Compact / Standard / Pro
2. **Upload dataset** — JSONL, instruction-response format, schema documented in `docs/train-model-dataset-spec.md`
3. **Pick base model** — from the supported list per tier
4. **Specify eval benchmark** — customer-supplied test set OR DWS industry baseline
5. **(Optional) Add Aegis uplift** — for sovereign / EU-residency deployment
6. **Pay** — invoice or Stripe
7. **Receive artifact bundle** — next business day, all tiers (overnight on every tier)

### Inbound qualification — Bridge Track 70B routing

When inbound asks about 70B, route via one of two scripts (drafted by Boardy, audited 23.05.2026):

**Script A — DWS-curious enterprise (knows DWS, wants the LWM-class size):**

> Thanks for the interest. I'm keeping TM-001 tight for self-serve buyers, but there's a stronger fit if you want the 70B path. If you already have a JSONL dataset and want the same 70B-class size DWS targets for Control Room, I'd move you into an invite-only bridge so we can line up the right scope and timeline.

**Script B — Frontier-experimenter startup (wants thesis validation, has data):**

> If you want to validate a thesis fast with a 70B fine-tune and you already have the dataset ready, I'd route you into an invite-only bridge rather than the public self-serve tier. That keeps the path clean and gets you to the right architecture faster.

**Qualifying questions on the routing call** (15 minutes):

1. Is your training dataset already in JSONL or convertible to JSONL? (If no → EMT-001 Starter)
2. Are you targeting a standard Llama/Qwen 70B architecture? (If no → EMT-001 Professional/Enterprise)
3. Do you need a 12-month support contract, or is a 30-day eval-regression SLA enough? (If 12-month → EMT-001 Professional/Enterprise)
4. Where will the model be deployed? (GN-100 / DGX Spark / Mac Studio / generic H100 — confirms feasibility, not gating)
5. Is your data EU residency-sensitive? (If yes → +Aegis uplift on the quote)

If all four green-light → Bridge Track at €19,990 quoted on the call.

---

## Sales Math (Y1 Targets)

| Annual volume                |     Compact |    Standard |         Pro |      Revenue | Loaded BOM | Gross profit |
| ---------------------------- | ----------: | ----------: | ----------: | -----------: | ---------: | -----------: |
| 20 customers (5 / 12 / 3)    |  5 × €1,490 | 12 × €2,990 |  3 × €7,490 |  **€65,800** |     €4,270 |  **€61,530** |
| 50 customers (10 / 30 / 10)  | 10 × €1,490 | 30 × €2,990 | 10 × €7,490 | **€179,300** |    €11,200 | **€168,100** |
| 100 customers (20 / 60 / 20) | 20 × €1,490 | 60 × €2,990 | 20 × €7,490 | **€358,600** |    €22,400 | **€336,200** |

50 customers/year (~1 Standard SKU per business week) is the credible Y1 target given the existing 25-industry LWM registry and the DWS IQ customer pipeline.

---

## Technical Specifications

### Supported Base Models (May 2026)

| Tier     | Supported                                                                       |
| -------- | ------------------------------------------------------------------------------- |
| Compact  | Llama 3.2 3B, Qwen3 3B, Phi-3.5 mini (3.8B), Gemma 2 2B                         |
| Standard | Llama 3.1 8B, Mistral 9B, Qwen3 8B, Gemma 2 9B                                  |
| Pro      | Qwen3 32B, Gemma 2 27B (32B class only — 70B routes to Bridge Track in EMT-001) |

### Training Stack

- **Framework:** Unsloth + Hugging Face TRL
- **Kernels:** Unsloth Triton (Split-LoRA, 12× MoE speedup, 35% VRAM reduction)
- **Hardware (default):** A100 80GB / H100 80GB on Lambda / RunPod / Colab Pro+
- **Hardware (Aegis):** Acer Veriton GN-100 (GB10) on-prem, or Lambda EU
- **Quantization:** Bitsandbytes (training), llama.cpp (GGUF), MLX (Apple), NVFP4 PTQ (Blackwell)
- **Inference container:** NVIDIA NIM (requires customer-side NVIDIA AI Enterprise license; bundled deployment guide)

### Dataset Specification

- **Format:** JSONL (one example per line)
- **Schema:** `{"instruction": "...", "input": "...", "output": "..."}` or `{"messages": [{"role": "...", "content": "..."}, ...]}`
- **Max size:** 500K examples (Compact) / 2M (Standard) / 10M (Pro)
- **Validation:** automated schema check on upload; rejected uploads return diff before charge

---

## Agent Surface (Build for Agents)

Train Model orders are agent-callable. An agent can place an order, monitor progress, and pull the artifact bundle without human-in-the-loop intervention.

### Endpoint

```
POST /api/v1/train-model
Authorization: Bearer <customer-jwt>
Content-Type: application/json
```

### Request shape (Zod-validated)

```json
{
  "tier": "compact" | "standard" | "pro",
  "base_model": "llama-3.2-3b" | "qwen3-3b" | "phi-3.5-mini" | "gemma-2-2b"
              | "llama-3.1-8b" | "mistral-9b" | "qwen3-8b" | "gemma-2-9b"
              | "qwen3-32b" | "gemma-2-27b",
  "dataset_url": "https://...",          // signed URL to JSONL
  "eval_set": "dws_industry_baseline" | "customer_supplied",
  "eval_set_url": "https://...",         // required if eval_set = customer_supplied
  "aegis": false,                        // true → sovereign uplift +€990
  "addons": ["nim", "nvfp4_ptq"],        // optional, Pro tier only
  "callback_url": "https://..."          // optional, completion webhook
}
```

### Response (202 Accepted)

```json
{
  "order_id": "tm-001-2026-05-23-abc123",
  "tier": "standard",
  "estimated_completion": "2026-05-24T08:00:00Z",
  "status_url": "https://api.dws6.com/orders/tm-001-2026-05-23-abc123",
  "amount_eur": 2990,
  "invoice_url": "https://..."
}
```

### MCP exposure

Same endpoint exposed as MCP tool `train_model` on the DWS IQ MCP server. Schema mirrors the HTTP request shape. Agents using Claude Code, Codex, or any MCP-compatible runtime can place orders directly without scripting the HTTP call.

### CLI

```bash
dws train-model --tier standard --base-model qwen3-8b \
  --dataset dataset.jsonl --eval dws_industry_baseline
```

Status polling: `dws train-model status <order_id>`.

---

## Compliance & Security

- **EU AI Act:** Train Model outputs are derivative works of customer data; transparency declarations included in eval report
- **GDPR:** Cheap-cloud path is not GDPR-default — use Aegis uplift for EU PII; standard tier ships with data-processing addendum
- **Customer IP:** Customer retains 100% IP of trained model weights and outputs
- **Model attestation:** Aegis tier includes signed KYA chain-of-custody from dataset upload to model delivery

---

## Roadmap

| Quarter | Capability                                                                                |
| ------- | ----------------------------------------------------------------------------------------- |
| Q2 2026 | 5-run unattended reliability proof (gate to Q3 launch)                                    |
| Q3 2026 | Public launch — Compact + Standard + Pro tiers (all overnight delivery)                   |
| Q3 2026 | NVFP4 PTQ paid add-on (+€990) for Blackwell deployments                                   |
| Q4 2026 | Train Model — Subscription (monthly re-train cadence, separate SKU)                       |
| Q4 2026 | Bridge Track (70B, invite-only) inside EMT-001 — see PRODUCT_ENTERPRISE_MODEL_TRAINING.md |
| Q1 2027 | LWM2 omnimodal tier (video + audio data) — pricing TBD, will sit at Bridge Track or above |

---

## Related Products

- [Enterprise Model Training (EMT-001)](PRODUCT_ENTERPRISE_MODEL_TRAINING.md) — project tier (€50K–€200K) for dataset construction + custom architecture + 12-month support
- [Lifetime Agent Foundry](PRODUCT_AGENT_FOUNDRY.md) — agent runtime that consumes Train Model outputs
- [Aegis](PRODUCT_AEGIS.md) — sovereign tier; required for CLOUD-Act-free deployments
- [DWS IQ 6 Platform](../INVESTOR_DOCUMENTATION.md) — Control Room runs LWM1 (per-industry models from this product)

---

## Hardware Availability Note

> **Cloud path:** Available on launch (Lambda, RunPod, Colab Pro+, NVIDIA Brev).
> **Aegis on-prem path:** Requires Acer Veriton GN-100 — available since January 2026.

---

**Document Version:** 1.0
**Last Updated:** May 23, 2026
**Product Owner:** Lifetime Oy
**© 2026 Lifetime Oy. All rights reserved.**

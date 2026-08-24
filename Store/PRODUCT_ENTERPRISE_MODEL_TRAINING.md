---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor.ai | Session: Ultra-Agents | Commit: pending | Date: 03.01.2026 | Changes: Initial product documentation for Enterprise Model Training
- Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Commit: pending | Date: 23.05.2026 | Changes: Added "Product Ladder" bridge section positioning EMT-001 (€50K–€200K project tier) as the top of a two-tier ladder, with new Train Model (TM-001) self-serve SKU (€1,490–€7,490) as the entry tier underneath. Added "when to pick which" matrix. Updated Related Products to link TM-001 and Aegis. EMT-001 scope, deliverables, and pricing unchanged — the ladder addresses customers who would otherwise leak to OpenAI fine-tuning, not customers already qualified for project-tier engagement.
- Version: 1.2 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Commit: pending | Date: 23.05.2026 | Changes: Added "Bridge Track" package (€19,990, invite-only) between TM-001 Pro (€7,490) and EMT-001 Starter (€50K). Scope: 70B fine-tune, customer-supplied dataset (no construction), no custom architecture, 30-day support (not 12-month). Serves the real 70B buyer without a public flagship Store tile that would dilute TM-001's self-serve identity. Routes are inbound→sales→bridge or EMT-001 downsell. Updated pricing range, Product Ladder diagram, and "when to pick which" matrix.
- Version: 1.3 | Tool: Claude Code (Opus 4.8) | Session: claude/acer-node-claim-verification-u7jai1 | Commit: pending | Date: 24.07.2026 | Changes: Tagged on-premise Acer Node training as "Pending Hardware — not yet verified live" so the page stops overstating capability. Verification found no training-pipeline code, no test coverage, and no go-live record for on-premise training; the passed "Expected January 8, 2026" setup date had no confirmation behind it. The only Acer device documented in the repo (Veriton GN100, ARM64/GB10 edge inference & development node) is a different machine from the x86 dual-RTX-4090 training box specified here. Updated availability line, §3 Hardware Options, Starter/Professional package hardware rows, Training Hardware Matrix, and the Hardware Availability Note. Cloud (GCP A3 Mega) remains the available training route. Pricing, scope, and deliverables unchanged.

- Version: 1.4 | Tool: Claude Code (Opus 4.8) | Session: claude/acer-node-claim-verification-u7jai1 | Commit: pending | Date: 24.07.2026 | Changes: Built the on-premise training pipeline that substantiates the claim, and moved the on-prem status from "Pending Hardware" to "pipeline delivered & CI-tested; go-live pending one hardware run." Delivered in `infrastructure/llm-training/` (QLoRA trainer with eval step + `--dry-run` + off-GPU degradation, reference configs incl. `gn100-8b-qlora.yaml`, eval harness `evaluate.py` + `evals/`, pytest suite with an end-to-end CPU smoke fine-tune), an ARM64 training container + `scripts/deploy-acer-training.sh`, the `TRAINING_RUNBOOK.md`, the `AgentFoundry/Calculus_for_Training.md` methodology doc (previously a broken citation), and a `train-model` skill/command. Retargeted the on-prem node from the never-provisioned x86 2×RTX-4090 box to the real Acer Veriton GN100 (ARM64/GB10) — the machine Lifetime owns and validated. Updated availability line, §3, package hardware rows, the training matrix, and the Hardware Availability Note. Cloud (GCP A3 Mega) remains the fully-available route. Pricing, scope, deliverables unchanged.

Document Status:

- Created: 03.01.2026
- Last Modified: 23.05.2026
- Language: English
- Publication Status: Draft
- Document Type: Product Documentation

Compliance:

- Applicable Regulations: EU AI Act, GDPR, SOC 2
- Reference Documents: AgentFoundry/Calculus_for_Training.md, Situation/DWS_IQ6_ADMINISTRATOR_MANUAL.md

Legal:

- Intellectual Property: Customer retains full IP of trained models
- Contractual: Project-based agreement required
- Review Required: Pending (Sales, Legal)

---

# Enterprise Model Training

## Custom LLM Fine-Tuning for Industry-Specific AI Agents

_Part of the DWS IQ Industrial Intelligence suite — the project tier for custom, sovereign industry models underpinning Industrial Intelligence deployments._

**Product Code:** EMT-001  
**Version:** 1.4  
**Availability:** Cloud training (GCP A3 Mega) available now · On-premise Acer GN100 training — **pipeline delivered & CI-tested, go-live pending one hardware run** · Bridge Track Q4 2026  
**Pricing:** Bridge Track €19,990 (invite-only) · Starter–Enterprise €50K–€200K (project-based)

---

## Product Overview

**Enterprise Model Training** enables large enterprises to create custom Large Language Models (LLMs) fine-tuned for their specific industry, processes, and data. Unlike SaaS AI services, customers retain **full intellectual property** of their trained models.

### Value Proposition

> "Your data. Your model. Your competitive advantage."

### Target Customers

| Segment                   | Use Cases                                    | Model Size |
| ------------------------- | -------------------------------------------- | ---------- |
| **Construction Giants**   | Proprietary BIM knowledge, safety procedures | 7B-30B     |
| **Manufacturing Leaders** | Process optimization, quality control        | 7B-70B     |
| **Energy Utilities**      | Grid management, demand forecasting          | 30B-70B    |
| **Financial Services**    | Risk modeling, compliance automation         | 70B-405B   |

---

## Product Ladder — Where Enterprise Model Training Sits

Enterprise Model Training (EMT-001) is the **top of a three-rung ladder**. Below it sits **Train Model (TM-001)** — a self-serve fixed-scope SKU at €1,490–€7,490. Between them is the **Bridge Track** — an invite-only 70B SKU at €19,990 that lives inside EMT-001 (not on the public Store page).

```
                                            Customer Sophistication →

  ┌──────────────────┐        ┌────────────────────────┐        ┌──────────────────────────────────┐
  │  Train Model     │  ──→   │  Bridge Track          │  ──→   │  Enterprise Model Training       │
  │  (TM-001)        │        │  (EMT-001 / invite)    │        │  Starter → Enterprise (EMT-001)  │
  │  €1,490–€7,490   │        │  €19,990               │        │  €50K – €200K                    │
  │                  │        │                        │        │                                  │
  │  Self-serve      │        │  Sales-led intake      │        │  Project-based                   │
  │  Bring dataset   │        │  Bring dataset         │        │  We construct dataset            │
  │  Overnight       │        │  ~3 business days      │        │  2–8 weeks                       │
  │  Fixed-scope     │        │  30-day support        │        │  12-month support                │
  │  3B / 9B / 32B   │        │  70B fine-tune         │        │  7B–405B (any architecture)      │
  │                  │        │  Standard architecture │        │  Custom architecture OK          │
  └──────────────────┘        └────────────────────────┘        └──────────────────────────────────┘
     SMB → Mid-market              70B-curious enterprise              Enterprise / regulated
     Stripe checkout               Inbound sales qualification         Full SOW + procurement
     Public Store page             NOT publicly listed                 Public Store page
```

The Bridge Track is **not a public Store tile**. It exists to catch the real 70B buyer who has a dataset ready, doesn't need custom architecture, doesn't need a 12-month support contract, but does want the LWM-class model size that DWS itself runs. Publishing a 70B card on TM-001 would dilute the self-serve identity; routing 70B customers exclusively to €50K Starter would lose them to OpenAI fine-tuning. The Bridge Track solves both.

### When to pick which

| Customer signal                                               | Right SKU                        |
| ------------------------------------------------------------- | -------------------------------- |
| "I have a dataset in JSONL — train me a model"                | → **Train Model (TM-001)**       |
| "I have raw documents — build me a dataset and train a model" | → **Enterprise Model Training**  |
| "Standard architecture is fine, 32B or smaller"               | → **Train Model (TM-001)**       |
| "Standard architecture, 70B specifically"                     | → **Bridge Track** (invite-only) |
| "I need a custom architecture / 405B / non-Llama base"        | → **Enterprise Model Training**  |
| "Buy once, no ongoing relationship"                           | → **Train Model (TM-001)**       |
| "30-day eval-regression SLA is enough"                        | → **Bridge Track** (invite-only) |
| "12-month support contract required"                          | → **Enterprise Model Training**  |
| "Budget €5K–€10K"                                             | → **Train Model (TM-001)**       |
| "Budget €15K–€25K, want LWM-class size"                       | → **Bridge Track** (invite-only) |
| "Budget €50K+, full project scope"                            | → **Enterprise Model Training**  |
| "Full ecosystem — model + APIs + agents + monitoring"         | → **Enterprise Model Training**  |

A customer who outgrows Train Model graduates to Bridge Track if size is the only delta; to EMT-001 Starter or higher if scope, support, or architecture is the delta. The ladder prevents leakage to OpenAI on the entry end and protects project-tier engagement value on the enterprise end.

See [PRODUCT_TRAIN_MODEL.md](PRODUCT_TRAIN_MODEL.md) for the entry SKU. Bridge Track is documented in §"Training Packages" below.

---

## Key Features

### 1. Full IP Retention

**Your weights. Your model. Your decision.**

| Aspect        | Standard SaaS AI         | Enterprise Model Training |
| ------------- | ------------------------ | ------------------------- |
| Model Weights | Provider-owned           | Customer-owned            |
| Training Data | May be used for training | Never used by provider    |
| Export Rights | None                     | Full export               |
| Deployment    | Provider cloud only      | Customer infrastructure   |

### 2. Industry-Specific Training

Custom knowledge injection for:

- **Construction:** EU embodied carbon regulations, BIM standards, safety protocols
- **Manufacturing:** ISO quality standards, process optimization, predictive maintenance
- **Energy:** Grid codes, renewable integration, demand response
- **Logistics:** Route optimization, sustainability reporting

### 3. Hardware Options

**On-Premise Option (Acer Veriton GN100) — pipeline delivered & CI-tested; go-live pending one hardware run:**

> ✅ **The training pipeline is built and CI-tested**, targeting the Acer Veriton
> GN100 — the on-premise node Lifetime Oy actually owns and has validated
> (`Admin/Acer-Veriton-GN100/README.md`). Delivered and tested in the repo:
> QLoRA trainer + reference configs (`infrastructure/llm-training/`), eval harness
> (`evals/`, `scripts/evaluate.py`), a test suite including an end-to-end CPU smoke
> fine-tune that writes a checkpoint (`infrastructure/llm-training/tests/`), an
> ARM64 training container and the on-prem deploy script
> (`scripts/deploy-acer-training.sh`), and the runbook
> (`Admin/Acer-Veriton-GN100/TRAINING_RUNBOOK.md`).
>
> ⏳ **Not yet claimed as live:** the first real QLoRA run on the GN100 is the
> remaining hardware step (its eval report + MLflow run are the go-live evidence).
> Until that run is recorded, quote on-premise as "pipeline ready" — **Cloud
> (GCP A3 Mega) is the fully-available route today.**
>
> _Note:_ an earlier version of this page specified an x86 dual-RTX-4090 "Acer
> Node" that was never provisioned. The delivered pipeline targets the real
> GN100 (ARM64 / NVIDIA GB10 / ~120 GiB unified memory); the specs below reflect
> that machine.

| Specification | Details (Acer Veriton GN100 — validated) |
| ------------- | ---------------------------------------- |
| **GPU**       | NVIDIA GB10 (Grace Blackwell superchip)  |
| **CPU**       | ARM Cortex-X925, 10 cores @ 3.9 GHz (ARM64) |
| **Memory**    | ~120 GiB unified (CPU+GPU)               |
| **OS**        | Ubuntu 24.04 LTS                          |
| **Best for**  | QLoRA fine-tune of 3B–13B (full or QLoRA), 30B–70B QLoRA-only |

**Cloud Burst Option (GCP A3 Mega):**

| Specification | Details                            |
| ------------- | ---------------------------------- |
| **GPU**       | 8x NVIDIA H100 (640GB VRAM)        |
| **Use Case**  | Large models (70B+)                |
| **Cost**      | ~$50/hr                            |
| **Location**  | `europe-north1` (Finland) for GDPR |

### 4. Training Methodology

```
┌─────────────────────────────────────────────────────────────┐
│                    TRAINING PIPELINE                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Customer    │    │ Data        │    │ Fine-Tuning │     │
│  │ Data Prep   │───►│ Validation  │───►│ (LoRA/Full) │     │
│  └─────────────┘    └─────────────┘    └──────┬──────┘     │
│                                               │             │
│                                               ▼             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ Deployment  │◄───│ Evaluation  │◄───│ Quantization│     │
│  │ (Groq/Edge) │    │ & Testing   │    │ (GGUF/AWQ)  │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 5. Deployment Options

| Option            | Latency | Cost        | Best For              |
| ----------------- | ------- | ----------- | --------------------- |
| **Groq LPU**      | <100ms  | Per-token   | High-volume inference |
| **NVIDIA Jetson** | <50ms   | Fixed       | Edge/on-site          |
| **Cloud Run**     | <200ms  | Per-request | Variable load         |

---

## Training Packages

### Bridge Track (€19,990) — Invite Only

> ⚡ **Not publicly listed for self-checkout.** Bridge Track is gated by a 15-minute inbound qualification call. Surfaced as a teaser tile on TM-001 ("Bridge Track 70B — Invite Only · price on request"). Customers reach this tier via [Contact Sales](PRODUCT_TRAIN_MODEL.md#inbound-qualification--bridge-track-70b-routing) or as a downsell from a Starter Package conversation.

| Aspect              | Details                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| **Base Model**      | Llama 3.1 70B / Qwen3 70B-class (standard architectures only)                                      |
| **Training Method** | QLoRA + Split-LoRA on H100 80GB cloud                                                              |
| **Training Data**   | Customer-supplied JSONL dataset (no construction — that's Starter+)                                |
| **Hardware**        | H100 80GB cloud (Lambda / NVIDIA Brev), or 2× A100 80GB                                            |
| **Duration**        | ~3 business days end-to-end (intake call → delivery)                                               |
| **Support**         | 30-day model SLA (eval-regression guarantee). NOT a 12-month contract.                             |
| **Architecture**    | Standard Llama/Qwen 70B only. Custom architectures → Starter+                                      |
| **Deliverables**    | safetensors + GGUF (Q4/Q8) + MLX (4/8-bit) + NVFP4 PTQ for Blackwell + eval report + registry push |

**Aegis uplift available** (+€990) for EU-residency / CLOUD-Act-free training.

**Loaded BOM** (€100/h SLM engineer):

| Line                                                                                                |           Cost |
| --------------------------------------------------------------------------------------------------- | -------------: |
| GPU compute (H100 80GB, ~55h)                                                                       |       €140–225 |
| Claude API data generation / curation                                                               |        €80–150 |
| SLM engineer (5h: scoping 1h + checkpoint monitoring 3×0.5h + final verify 1.5h + post-delivery 1h) |           €500 |
| Sales engagement overhead (15-min qualifying call + quote)                                          |           €100 |
| Conversion + NIM + NVFP4 PTQ                                                                        |            €25 |
| **Total loaded BOM**                                                                                | **€845–1,000** |
| **List price**                                                                                      |    **€19,990** |
| **Gross margin**                                                                                    |          ~95 % |

#### When Bridge Track is the right answer

| Customer signal                                          | Route                       |
| -------------------------------------------------------- | --------------------------- |
| "I have JSONL dataset, want 70B, standard architecture"  | → **Bridge Track**          |
| "I have JSONL, want 32B or smaller"                      | → TM-001 Pro (self-serve)   |
| "I have raw documents, need dataset construction"        | → Starter / Professional    |
| "I need custom architecture (non-Llama/Qwen base)"       | → Professional / Enterprise |
| "I need 12-month support contract"                       | → Starter / Professional    |
| "Budget is fixed at €15K–€25K, scope is everything else" | → **Bridge Track**          |
| "Budget is €50K+, full project scope welcome"            | → Starter / Professional    |

#### Qualifying questions on the routing call (15 minutes)

1. Is your training dataset already in JSONL or convertible to JSONL?
2. Are you targeting a standard Llama/Qwen 70B architecture?
3. Do you need a 12-month support contract, or is a 30-day eval-regression SLA enough?
4. Where will the model be deployed? (GN-100 / DGX Spark / Mac Studio / generic H100)
5. Is your data EU residency-sensitive? (drives Aegis uplift +€990)

If all four are green → Bridge Track quoted at €19,990 on the call. If any are red → routed to Starter / Professional / Enterprise as appropriate.

---

### Starter Package (€50K)

| Aspect              | Details                            |
| ------------------- | ---------------------------------- |
| **Base Model**      | Llama 3.1 7B                       |
| **Training Method** | LoRA (Parameter-Efficient)         |
| **Training Data**   | Up to 10GB                         |
| **Hardware**        | Cloud (GCP A3 Mega) today; Acer GN100 on-premise (pipeline ready, go-live pending) |
| **Duration**        | 2 weeks                            |
| **Deliverables**    | Fine-tuned model, deployment guide |

### Professional Package (€100K)

| Aspect              | Details                        |
| ------------------- | ------------------------------ |
| **Base Model**      | Llama 3.1 30B or 70B           |
| **Training Method** | QLoRA + Full fine-tune         |
| **Training Data**   | Up to 50GB                     |
| **Hardware**        | GCP burst today; Acer GN100 on-premise (pipeline ready, go-live pending) |
| **Duration**        | 4 weeks                        |
| **Deliverables**    | Model, API wrapper, monitoring |

### Enterprise Package (€200K)

| Aspect              | Details                                          |
| ------------------- | ------------------------------------------------ |
| **Base Model**      | Custom architecture (up to 405B)                 |
| **Training Method** | Full distributed training                        |
| **Training Data**   | Unlimited                                        |
| **Hardware**        | Multi-node GCP A3 Mega                           |
| **Duration**        | 8 weeks                                          |
| **Deliverables**    | Full ecosystem (model, APIs, agents, monitoring) |

---

## Project Timeline

### Week 1: Data Preparation

- Customer data audit
- Data cleaning and formatting
- Compliance review (GDPR, confidentiality)
- Training data validation

### Week 2: Environment Setup

- Hardware provisioning (Acer Node or GCP)
- Docker/Kubernetes configuration
- MLflow experiment tracking
- Security hardening

### Week 3-4: Training

- Base model selection and configuration
- LoRA/QLoRA training runs
- Hyperparameter optimization
- Checkpoint management

### Week 5: Evaluation

- Benchmark testing
- Domain-specific evaluation
- Human review (subject matter experts)
- Safety and bias testing

### Week 6: Quantization & Deployment

- GGUF/AWQ quantization for edge
- Groq optimization for cloud
- API wrapper development
- Performance testing

### Week 7-8: Integration

- Agent Foundry integration
- Customer system integration
- Documentation and training
- Handover and support

---

## Technical Specifications

### Supported Base Models

| Model          | Parameters | Training   | Inference         |
| -------------- | ---------- | ---------- | ----------------- |
| Llama 3.1 7B   | 7B         | Full       | Acer Node, Jetson |
| Llama 3.1 13B  | 13B        | Full       | Acer Node         |
| Llama 3.1 30B  | 30B        | QLoRA/Full | GCP + Acer        |
| Llama 3.1 70B  | 70B        | QLoRA/Full | GCP               |
| Llama 3.1 405B | 405B       | Multi-node | GCP A3 Mega       |

### Training Hardware Matrix

| Model Size | Acer GN100 (GB10, ~120 GiB unified) | GCP A3 Mega (8xH100) |
| ---------- | ----------------------------------- | -------------------- |
| 7B         | ✅ Full or QLoRA                    | ✅ Full fine-tune    |
| 13B        | ✅ Full or QLoRA                    | ✅ Full fine-tune    |
| 30B        | ⚠️ QLoRA only                       | ✅ Full fine-tune    |
| 70B        | ⚠️ QLoRA only                       | ✅ Full fine-tune    |
| 405B+      | ❌ Not feasible                     | ⚠️ Multi-node        |

> The Acer GN100 column is what the delivered pipeline
> (`infrastructure/llm-training/`, `configs/gn100-8b-qlora.yaml`) targets. The
> pipeline is committed and CI-tested; the first real GN100 run is the go-live
> step (see §3 and `Admin/Acer-Veriton-GN100/TRAINING_RUNBOOK.md`). GCP A3 Mega
> is fully available today.

### Data Requirements

| Data Type         | Format             | Example                    |
| ----------------- | ------------------ | -------------------------- |
| **Documents**     | PDF, DOCX, TXT     | Specifications, manuals    |
| **Structured**    | JSON, CSV, Parquet | Databases, logs            |
| **Code**          | .py, .js, .sql     | Custom scripts             |
| **Conversations** | JSONL              | Support tickets, chat logs |

**Minimum Data:** 1GB  
**Recommended:** 10-50GB  
**Maximum:** Unlimited (cloud training)

---

## Compliance & Security

### Data Handling

| Aspect            | Guarantee                                   |
| ----------------- | ------------------------------------------- |
| **Data Location** | EU only (Finland `europe-north1`)           |
| **Encryption**    | AES-256 at rest, TLS 1.3 in transit         |
| **Access**        | Customer-controlled, audit logged           |
| **Retention**     | Deleted after handover (or customer choice) |
| **Training Data** | Never used by Lifetime Oy                   |

### Model Ownership

```
┌─────────────────────────────────────────────────────────────┐
│                    OWNERSHIP TRANSFER                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Customer Data ─────► Training ─────► Customer Model        │
│       ↑                                      ↓              │
│       │                                      │              │
│       └──────── Full IP Rights ──────────────┘              │
│                                                              │
│  Lifetime Oy: Training services only                        │
│  Customer: Full ownership of weights, architecture          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### EU AI Act Compliance

| Requirement         | Implementation               |
| ------------------- | ---------------------------- |
| **Risk Assessment** | Included in delivery         |
| **Documentation**   | Training logs, model cards   |
| **Transparency**    | Model behavior documentation |
| **Human Oversight** | Agent Foundry integration    |

---

## Deliverables

### Standard Deliverables

| Item                 | Format                 | Description                           |
| -------------------- | ---------------------- | ------------------------------------- |
| **Fine-tuned Model** | GGUF, AWQ, safetensors | Optimized for deployment              |
| **Model Card**       | Markdown               | Capabilities, limitations, biases     |
| **Training Report**  | PDF                    | Methodology, metrics, recommendations |
| **API Wrapper**      | Python                 | FastAPI/Flask for inference           |
| **Deployment Guide** | Markdown               | Step-by-step deployment               |
| **Agent Config**     | YAML                   | Agent Foundry integration             |

### Enterprise Deliverables (Additional)

| Item                      | Format  | Description                 |
| ------------------------- | ------- | --------------------------- |
| **Monitoring Dashboard**  | Grafana | Real-time inference metrics |
| **A/B Testing Framework** | Python  | Model comparison tools      |
| **Retraining Pipeline**   | Docker  | Automated fine-tuning       |
| **24/7 Support**          | SLA     | First year included         |

---

## Getting Started

### 1. Initial Consultation

**Contact:** sales@lifetime.fi

Discuss:

- Use case and objectives
- Data availability and quality
- Hardware preferences
- Timeline and budget

### 2. Data Audit

Lifetime team reviews:

- Data volume and format
- Compliance requirements
- Quality and relevance
- Gap analysis

### 3. Proposal

Receive:

- Detailed project plan
- Hardware recommendations
- Timeline and milestones
- Fixed-price quote

### 4. Contract

Sign:

- Project agreement
- Data Processing Agreement (DPA)
- IP transfer clause
- SLA (if applicable)

### 5. Kick-off

Begin project with:

- Data transfer (secure)
- Environment setup
- Weekly status calls
- WhatsApp, Teams, or secure webhook channel

---

## Support

| Phase             | Support Level             |
| ----------------- | ------------------------- |
| **Project**       | Dedicated project manager |
| **Post-Handover** | 90 days included          |
| **Extended**      | Optional SLA (€10K/year)  |

---

## Related Products

- [Train Model (TM-001)](PRODUCT_TRAIN_MODEL.md) — self-serve entry tier (€1,490–€7,490) for customers who bring their own dataset
- [Lifetime Agent Foundry](PRODUCT_AGENT_FOUNDRY.md)
- [Agent Administration Platform](PRODUCT_AGENT_ADMINISTRATION.md)
- [Aegis](PRODUCT_AEGIS.md) — sovereign tier; required for CLOUD-Act-free deployments
- [DWS IQ 6 Platform](../INVESTOR_DOCUMENTATION.md)

---

## Hardware Availability Note

> ✅ **On-premise training pipeline: delivered & CI-tested.** ⏳ **Go-live: pending
> one hardware run on the Acer GN100.**
>
> The QLoRA training pipeline is built and tested in this repo — trainer +
> reference configs (`infrastructure/llm-training/`), eval harness (`evals/`,
> `scripts/evaluate.py`), a test suite including an end-to-end CPU smoke fine-tune
> that writes a checkpoint, an ARM64 training container, and the on-prem deploy
> script (`scripts/deploy-acer-training.sh`). It targets the real Acer Veriton
> GN100 (ARM64 / NVIDIA GB10 / ~120 GiB unified memory) — the node Lifetime Oy
> owns and has validated (`Admin/Acer-Veriton-GN100/README.md`).
>
> **The one remaining step is a real QLoRA run on the GN100** (its eval report +
> MLflow run are the go-live evidence). Follow
> `Admin/Acer-Veriton-GN100/TRAINING_RUNBOOK.md`. Until that run is recorded, quote
> on-premise as "pipeline ready, go-live pending" — not "live."
>
> **Cloud training (GCP A3 Mega, `europe-north1` Finland) is available immediately**
> and is the supported route for all packages today.
>
> _History:_ an earlier version listed an "Expected January 8, 2026" Acer Node
> setup with no backing code, and specified an x86 dual-RTX-4090 box that was
> never provisioned. The delivered pipeline instead targets the GN100 that
> actually exists; the GB10 "may not yet be supported" container caveat applies to
> exotic kernels only — nf4 QLoRA + LoRA are fine.

---

**Document Version:** 1.4  
**Last Updated:** July 24, 2026  
**Product Owner:** Lifetime Oy  
**© 2026 Lifetime Oy. All rights reserved.**

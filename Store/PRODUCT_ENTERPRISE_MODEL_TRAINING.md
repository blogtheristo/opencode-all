---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor.ai | Session: Ultra-Agents | Commit: pending | Date: 03.01.2026 | Changes: Initial product documentation for Enterprise Model Training
- Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/lwm-price-estimate-study-IXS4l | Commit: pending | Date: 23.05.2026 | Changes: Added "Product Ladder" bridge section positioning EMT-001 (€50K–€200K project tier) as the top of a two-tier ladder, with new Train Model (TM-001) self-serve SKU (€1,490–€7,490) as the entry tier underneath. Added "when to pick which" matrix. Updated Related Products to link TM-001 and Aegis. EMT-001 scope, deliverables, and pricing unchanged — the ladder addresses customers who would otherwise leak to OpenAI fine-tuning, not customers already qualified for project-tier engagement.

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

**Product Code:** EMT-001  
**Version:** 1.0  
**Availability:** January 8, 2026 (Acer Node Setup)  
**Pricing:** Project-Based (€50K-200K)

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

Enterprise Model Training (EMT-001, €50K–€200K) is the **top of a two-tier ladder**. Below it sits **Train Model (TM-001)** — a self-serve fixed-scope SKU at €1,490–€7,490 for customers who don't need a project-tier engagement.

```
                                  Customer Sophistication →

  ┌──────────────────────┐                ┌──────────────────────────────────────┐
  │  Train Model         │     ──→        │  Enterprise Model Training (this)    │
  │  (TM-001)            │                │  (EMT-001)                           │
  │  €1,490 – €7,490     │                │  €50K – €200K                        │
  │                      │                │                                      │
  │  Self-serve          │                │  Project-based                       │
  │  Customer brings     │                │  We construct dataset                │
  │  structured dataset  │                │  Custom architecture (up to 405B)    │
  │  Fixed-scope         │                │  Multi-week SOW                      │
  │  Overnight delivery  │                │  12-month support contract           │
  │  3B / 9B / 32B       │                │  7B–405B (any architecture)          │
  └──────────────────────┘                └──────────────────────────────────────┘
       SMB → Mid-market                          Enterprise / regulated
```

### When to pick which

| Customer signal                                               | Right SKU                          |
| ------------------------------------------------------------- | ---------------------------------- |
| "I have a dataset in JSONL — train me a model"                | → **Train Model (TM-001)**         |
| "I have raw documents — build me a dataset and train a model" | → **Enterprise Model Training**    |
| "Standard architecture is fine"                               | → **Train Model (TM-001)**         |
| "I need a custom architecture / 405B / non-Llama base"        | → **Enterprise Model Training**    |
| "Buy once, no ongoing relationship"                           | → **Train Model (TM-001)**         |
| "12-month support contract required"                          | → **Enterprise Model Training**    |
| "Single model, single use case"                               | → **Train Model (TM-001)**         |
| "Full ecosystem — model + APIs + agents + monitoring"         | → **Enterprise Model Training**    |

A customer who outgrows Train Model graduates to Enterprise Model Training. The two SKUs are complementary, not competitive — the ladder prevents leakage to OpenAI on the entry end and protects project-tier engagement value on the enterprise end.

See [PRODUCT_TRAIN_MODEL.md](PRODUCT_TRAIN_MODEL.md) for the entry SKU.

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

**On-Premise Option (Acer Node - Available Jan 8, 2026):**

| Specification | Details                              |
| ------------- | ------------------------------------ |
| **GPU**       | 2x NVIDIA RTX 4090 (48GB VRAM total) |
| **CPU**       | AMD Ryzen 9 / Intel Core i9          |
| **RAM**       | 128GB DDR5                           |
| **Storage**   | 4TB NVMe SSD                         |
| **Network**   | 10Gbps                               |

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

### Starter Package (€50K)

| Aspect              | Details                            |
| ------------------- | ---------------------------------- |
| **Base Model**      | Llama 3.1 7B                       |
| **Training Method** | LoRA (Parameter-Efficient)         |
| **Training Data**   | Up to 10GB                         |
| **Hardware**        | Acer Node (on-premise)             |
| **Duration**        | 2 weeks                            |
| **Deliverables**    | Fine-tuned model, deployment guide |

### Professional Package (€100K)

| Aspect              | Details                        |
| ------------------- | ------------------------------ |
| **Base Model**      | Llama 3.1 30B or 70B           |
| **Training Method** | QLoRA + Full fine-tune         |
| **Training Data**   | Up to 50GB                     |
| **Hardware**        | Acer Node + GCP burst          |
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

| Model Size | Acer Node (2x4090) | GCP A3 Mega (8xH100) |
| ---------- | ------------------ | -------------------- |
| 7B         | ✅ Full fine-tune  | ✅ Full fine-tune    |
| 13B        | ✅ Full fine-tune  | ✅ Full fine-tune    |
| 30B        | ⚠️ QLoRA only      | ✅ Full fine-tune    |
| 70B        | ⚠️ QLoRA only      | ✅ Full fine-tune    |
| 405B+      | ❌ Not feasible    | ⚠️ Multi-node        |

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

> ⚠️ **Acer Node Setup: Expected January 8, 2026**
>
> On-premise training capability will be available after hardware setup. Cloud training (GCP A3 Mega) is available immediately.

---

**Document Version:** 1.0  
**Last Updated:** January 3, 2026  
**Product Owner:** Lifetime Oy  
**© 2026 Lifetime Oy. All rights reserved.**

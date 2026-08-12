# Enterprise Deployment Architecture — Sovereign Industrial Intelligence

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/lwm-ontology-v1-500-enterprises | Date: 22.06.2026 | Changes: Initial creation — topology tiers (CR-1/2/3/M, SR-1/2/3), sovereign training cascade, mode-switch architecture, fleet management, NVIDIA AI Workbench integration

Document Status:

- Created: 22.06.2026
- Last Modified: 22.06.2026
- Language: English
- Publication Status: DRAFT
- Document Type: Architecture Reference

---

---

## 1. Overview

This document defines the enterprise deployment topology for DWS IQ Sovereign Industrial Intelligence. Three product tiers map to six hardware configurations, each running the same sovereign training cascade but differing in compute, isolation, and air-gap capability.

```
┌─────────────────────────────────────────────────────────────────┐
│              SOVEREIGNTY TIERS (3 tiers × 6 configs)            │
│                                                                  │
│  Tier 1: DWS IQ 6              Multi-tenant, EU cloud           │
│          (Scaleway / Hetzner)   No customer hardware             │
│                                                                  │
│  Tier 2: DWS IQ Aegis          Single-tenant, UpCloud K8s       │
│          (Helsinki DC)          Dedicated namespace per customer  │
│                                                                  │
│  Tier 3: LWM On-Premise        Air-gapped, customer NVIDIA      │
│          (Customer site)        Full model weight ownership       │
│                                                                  │
│  Hardware configs:                                               │
│  ├── CR-1  Control Room Basic    (1× GN100/DGX Spark)           │
│  ├── CR-2  Control Room Pro      (2× GN100/DGX Spark bridged)   │
│  ├── CR-3  Control Room Max      (4× DGX Spark bridged)         │
│  ├── CR-M  Control Room Medical  (1× IGX Orin + dGPU)           │
│  ├── SR-1  Sensor Ring Nano      (n× Jetson Orin Nano Super)    │
│  ├── SR-2  Sensor Ring Mid       (n× Jetson Orin NX 16GB)       │
│  └── SR-3  Sensor Ring Heavy     (n× Jetson AGX Orin 64GB)      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Control Room Configurations (CR-1 through CR-M)

### CR-1: Control Room Basic

**Hardware:** 1× Acer Veriton GN100 or NVIDIA DGX Spark
**SKU:** `edge-node-gn100` (€5,294) or `LF-DGX-SPARK` (€5,994)
**Compute:** GB10 Grace Blackwell, 1 PFLOPS FP4, 128 GB LPDDR5x, 20-core Arm

**Capabilities:**

- Run up to 70B models (NVFP4 quantized, ~40-50 GB VRAM)
- 18+ DWS IQ Skilled Agents (Docker Compose)
- Local Ollama instance for inference
- Industry ontology inference (pre-trained, shipped with device)
- QLoRA fine-tuning for 8B models (FP16, ~20 GB)
- QLoRA fine-tuning for 70B models (NVFP4, requires training mode — see §5)

**Memory budget (128 GB unified):**

| Mode       | Allocation                                                                            |
| ---------- | ------------------------------------------------------------------------------------- |
| Production | Ollama 70B (~50 GB) + Docker agents (~20 GB) + OS/system (~10 GB) + headroom (~48 GB) |
| Training   | AI Workbench QLoRA (~80 GB) + OS/system (~10 GB) + staging (~38 GB)                   |

**Use case:** Single-factory or single-site deployment. The workhorse configuration for 80%+ of deployments.

### CR-2: Control Room Pro

**Hardware:** 2× GN100 or DGX Spark, bridged via NVIDIA ConnectX-7 (200 Gbps)
**SKU:** `LF-SITROOM-001` (€10,093)
**Compute:** 2 PFLOPS FP4, 256 GB unified memory, 40-core Arm

**Capabilities:**

- Everything in CR-1, plus:
- Tensor-parallel inference for 405B models (Llama 3.3 405B, Nemotron)
- Dual-node Article 12 compliance logging with failover
- Multi-model parallel inference (e.g., vision + language simultaneously)
- QLoRA fine-tuning for 70B models without production teardown (one node trains, one serves)

**Use case:** Multi-site coordination, crisis/situation rooms, dual-use scenarios (defence + compliance).

### CR-3: Control Room Max

**Hardware:** 4× DGX Spark, bridged via ConnectX-7 mesh
**SKU:** Quote required (4× `LF-DGX-SPARK` + custom bridging)
**Compute:** 4 PFLOPS FP4, 512 GB unified memory, 80-core Arm

**Capabilities:**

- Everything in CR-2, plus:
- Full-precision 405B model inference
- Simultaneous training + inference on separate node pairs
- Multi-industry ontology training pipeline (process 4 industries in parallel)
- Fleet management hub (manage up to 500 edge nodes)

**Use case:** Enterprise headquarters, national infrastructure operators, research institutions.

### CR-M: Control Room Medical

**Hardware:** 1× NVIDIA IGX Orin + optional dGPU (RTX PRO 6000 Blackwell)
**SKU:** `LF-IGX-ORIN` (€11,990) + dGPU quoted separately
**Compute:** 12-core Arm Cortex-A78AE, Ampere GPU, 64 GB LPDDR5 ECC, NVDLA 2.0

**Capabilities:**

- ECC memory for safety-critical inference
- 10-year NVIDIA enterprise support lifecycle (through 2033)
- Holoscan-ready for medical imaging pipelines
- Functional safety roadmap (IEC 62304 / IEC 61508)
- EU AI Act high-risk AI system logging (Article 12 + Annex IV)

**Use case:** Pharmaceutical manufacturing, medical device production, nuclear safety monitoring.

---

## 3. Sensor Ring Configurations (SR-1 through SR-3)

Sensor Ring nodes deploy at the edge of the operation — cameras, acoustic sensors, IoT points — and feed events back to the central Control Room.

### SR-1: Sensor Ring Nano

**Hardware:** NVIDIA Jetson Orin Nano Super Developer Kit
**SKU:** `LF-JETSON-NANO` (€764 per node)
**Compute:** 67 TOPS, 8 GB, 1024-CUDA-core Ampere GPU

**Edge workloads:** Single-camera YOLOv8, acoustic anomaly detection, temperature/vibration monitoring
**Upstream:** Events → Control Room via MQTT/gRPC

### SR-2: Sensor Ring Mid

**Hardware:** NVIDIA Jetson Orin NX 16 GB
**SKU:** `LF-JETSON-NX` (€1,990 per node)
**Compute:** 100 TOPS, 16 GB, configurable 10-40W

**Edge workloads:** 2-4 camera streams, multi-sensor fusion, local Whisper transcription
**Upstream:** Events + transcripts → Control Room

### SR-3: Sensor Ring Heavy

**Hardware:** NVIDIA Jetson AGX Orin 64 GB Developer Kit
**SKU:** `LF-JETSON-AGX` (€2,694 per node)
**Compute:** 275 TOPS, 64 GB, 2048-CUDA-core Ampere GPU

**Edge workloads:** 4-8 sensor lanes, YOLOv8 + Cosmos Reason + Whisper locally, LiDAR processing
**Upstream:** Only events (not raw data) → Control Room

---

## 4. Sovereign Training Cascade

The training cascade transforms a base open-weights model into a customer-specific sovereign model in four stages. Each stage narrows the model's knowledge toward the customer's specific operation.

```
┌──────────────────────────────────────────────────────────────────────┐
│                    SOVEREIGN TRAINING CASCADE                         │
│                                                                       │
│  Stage 0: BASE MODEL (open-weights, downloaded once)                  │
│  ┌─────────────────────────────────────────────────────────────┐     │
│  │ Llama 3.3 8B/70B or Mistral Large or Qwen3                 │     │
│  │ Source: HuggingFace / NVIDIA NGC                            │     │
│  │ Residency: pre-loaded on Control Room hardware              │     │
│  └─────────────────────────┬───────────────────────────────────┘     │
│                            │                                          │
│  Stage 1: INDUSTRY FINE-TUNE (reusable across all customers)         │
│  ┌─────────────────────────▼───────────────────────────────────┐     │
│  │ QLoRA adapter trained on industry ontology                  │     │
│  │ Source: ontology/industries/{id}-{name}.json (25 ontologies)│     │
│  │ Training: ~2000 synthetic Q&A pairs per industry            │     │
│  │ Duration: 2-4 hours on GB10 / 1 hour on CR-2               │     │
│  │ Result: model "speaks" the industry's operational language   │     │
│  │ Delivery: pre-built, shipped with hardware                  │     │
│  └─────────────────────────┬───────────────────────────────────┘     │
│                            │                                          │
│  Stage 2: LOCATION FINE-TUNE (reusable per-site)                     │
│  ┌─────────────────────────▼───────────────────────────────────┐     │
│  │ QLoRA adapter trained on site-specific data                 │     │
│  │ Source: customer facility list, local regulations,          │     │
│  │         regional vocabulary, site environmental permits     │     │
│  │ Training: ~500 examples, 1-2 hours on GB10                 │     │
│  │ Result: model knows this specific factory's context         │     │
│  └─────────────────────────┬───────────────────────────────────┘     │
│                            │                                          │
│  Stage 3: FACTORY FINE-TUNE (unique per customer)                    │
│  ┌─────────────────────────▼───────────────────────────────────┐     │
│  │ QLoRA adapter trained on customer's operational data        │     │
│  │ Source: production data, maintenance logs, quality records, │     │
│  │         equipment manuals, internal process docs            │     │
│  │ Training: ~1000 examples, 2-4 hours on GB10                │     │
│  │ Result: model is the customer's sovereign operational brain │     │
│  │ Ownership: customer owns the trained model weights          │     │
│  └─────────────────────────┬───────────────────────────────────┘     │
│                            │                                          │
│  Stage 4: CONTINUOUS IMPROVEMENT (ongoing)                           │
│  ┌─────────────────────────▼───────────────────────────────────┐     │
│  │ Incremental QLoRA updates from operational feedback         │     │
│  │ Source: agent interactions, user corrections, new documents │     │
│  │ Cadence: weekly automatic, monthly validated                │     │
│  │ Delivery: via Sovereign Model Updates Subscription (€299/mo)│     │
│  └─────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  SOVEREIGNTY GUARANTEE:                                               │
│  • No customer data leaves the Control Room at any stage              │
│  • Model weights are customer property (not SaaS license)            │
│  • Air-gap mode: USB delivery for Stage 1, all others on-prem        │
│  • Training logs + model provenance stored locally (Article 12)      │
└──────────────────────────────────────────────────────────────────────┘
```

### Adapter Stacking

The four stages produce stackable QLoRA adapters. At inference time:

```
Base Model + Industry Adapter + Location Adapter + Factory Adapter = Customer Model
```

Adapters are small (16-64 MB each) and can be hot-swapped without restarting the base model. A single CR-1 can hold adapters for multiple industries/locations if the customer operates across sectors.

---

## 5. Mode-Switch Architecture (Training vs Production)

The DGX Spark / GN100 has 128 GB unified memory. Training and production compete for this memory. The mode-switch architecture manages this contention.

### The Problem

| Workload                        | Memory Required |
| ------------------------------- | --------------- |
| Ollama 70B inference            | ~50 GB          |
| Docker agent stack (18+ agents) | ~20 GB          |
| NVIDIA AI Workbench + QLoRA 70B | ~80 GB          |
| OS + system                     | ~10 GB          |

**128 GB cannot run all three simultaneously.** Production inference and QLoRA training cannot coexist on CR-1.

### The Solution: Mode-Switch Scripts

Two scripts manage the transition:

```
┌─────────────────────┐     training-mode.sh     ┌─────────────────────┐
│   PRODUCTION MODE   │ ──────────────────────►  │   TRAINING MODE     │
│                     │                           │                     │
│  Ollama running     │                           │  Ollama stopped     │
│  Docker agents up   │                           │  Docker agents down │
│  Heartbeat active   │                           │  AI Workbench up    │
│  Inference: <100ms  │                           │  QLoRA running      │
│                     │  production-mode.sh       │  Heartbeat: paused  │
│                     │ ◄──────────────────────   │                     │
└─────────────────────┘                           └─────────────────────┘
```

**Scripts location:** `scripts/training-mode.sh` and `scripts/production-mode.sh`

**Safety guarantees:**

1. Training mode refuses to start if active inference requests are in-flight
2. Production mode validates model health before accepting traffic
3. Both scripts log mode transitions to the Article 12 compliance log
4. Heartbeat service notifies fleet manager of mode change (customers see "Training in progress" status)

### CR-2 Advantage

On CR-2 (2× DGX Spark), mode-switching is unnecessary:

- Node A: production inference (always running)
- Node B: training workload (as needed)
- No downtime, no mode contention

This is the primary upsell argument from CR-1 → CR-2.

---

## 6. NVIDIA AI Workbench Integration

NVIDIA AI Workbench runs on the DGX Spark and provides the training environment for the sovereign training cascade.

### Installation

AI Workbench is pre-installed on every Control Room device as part of the `LF-NVIDIA-INSTALL` service (€995):

```
DGX Spark / GN100
├── Ubuntu 24.04 LTS (Arm64)
├── CUDA 12.x + cuDNN + TensorRT-LLM
├── NVIDIA AI Workbench
│   ├── Local runtime (no cloud dependency)
│   ├── Pre-configured projects:
│   │   ├── industry-ontology-trainer/     (Stage 1)
│   │   ├── location-fine-tuner/           (Stage 2)
│   │   ├── factory-fine-tuner/            (Stage 3)
│   │   └── continuous-improvement/        (Stage 4)
│   └── Model registry (local):
│       ├── base-models/                   (Llama, Mistral, Qwen)
│       └── adapters/                      (QLoRA outputs per stage)
├── Ollama (production inference)
├── Docker (agent stack)
└── DWS stack (heartbeat, update-agent, Article 12 logger)
```

### Training Workflow

```
1. Engineer triggers training-mode.sh (or CR-2: no mode switch needed)
2. AI Workbench launches with pre-configured project
3. Ontology data loaded from ontology/industries/ or customer data
4. QLoRA training executes:
   - Rank: 16
   - Epochs: 3-4
   - Learning rate: 2e-4
   - Quantization: NVFP4 (70B) or FP16 (8B)
5. Validation: ontology term recall test (target: >95%)
6. Adapter packaged and registered in local model registry
7. production-mode.sh restores inference stack with new adapter
```

### Air-Gap Training

For customers requiring full air-gap (no network at any point):

1. Industry ontology delivered via USB media
2. Customer data never leaves premises (it's already there)
3. Training runs entirely on local AI Workbench
4. Adapter stays on local disk
5. No telemetry, no phone-home, no update checks

---

## 7. Fleet Topology

A typical enterprise deployment combines Control Room and Sensor Ring nodes:

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENTERPRISE DEPLOYMENT                         │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    CONTROL ROOM (CR-1/2/3)               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │   │
│  │  │ Ollama   │  │ Docker   │  │ AI Workbench         │   │   │
│  │  │ (LWM)   │  │ (Agents) │  │ (Training, as needed)│   │   │
│  │  └────┬─────┘  └────┬─────┘  └──────────────────────┘   │   │
│  │       │              │                                    │   │
│  │  ┌────▼──────────────▼────┐                              │   │
│  │  │ Event Bus (MQTT/gRPC)  │                              │   │
│  │  └────────────┬───────────┘                              │   │
│  └───────────────┼──────────────────────────────────────────┘   │
│                  │                                               │
│    ┌─────────────┼──────────────────────────────┐               │
│    │             │   SENSOR RING                 │               │
│    │  ┌──────────▼──┐  ┌──────────┐  ┌────────┐│               │
│    │  │ SR-1 (Nano) │  │ SR-2 (NX)│  │SR-3(AGX││               │
│    │  │ Camera #1   │  │ Acoustic │  │ LiDAR  ││               │
│    │  └─────────────┘  └──────────┘  └────────┘│               │
│    └────────────────────────────────────────────┘               │
│                                                                  │
│    ┌────────────────────────────────────────────┐               │
│    │          FLEET MANAGEMENT                   │               │
│    │  Cloudflare Tunnel (outbound-only)          │               │
│    │  → fleet.dws6.com (health dashboard)        │               │
│    │  → registry.dws6.com (update manifests)     │               │
│    └────────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Deployment Tiers by Customer Size

| Customer Type                  | CR Config | SR Nodes         | Annual Value   | Deployment Time |
| ------------------------------ | --------- | ---------------- | -------------- | --------------- |
| Single factory, <500 employees | CR-1      | 2-4× SR-1        | €8K-15K        | 1 day           |
| Multi-site, 500-5000 employees | CR-2      | 8-16× SR-1/SR-2  | €25K-60K       | 3-5 days        |
| Enterprise HQ + global sites   | CR-3      | 20-50× SR-2/SR-3 | €100K-250K     | 2-4 weeks       |
| Medical / Pharma / Nuclear     | CR-M      | 4-8× SR-3        | €80K-200K      | 2-4 weeks       |
| Defence / Air-gapped           | CR-2/CR-3 | Custom           | Quote required | Custom          |

---

## 9. Product SKU Mapping

### Hardware + Install SKUs (one-time)

| Config                | SKU                 | Price     | Notes                         |
| --------------------- | ------------------- | --------- | ----------------------------- |
| CR-1 (GN100)          | `edge-node-gn100`   | €5,294    | €4,299 HW + €995 install      |
| CR-1 (DGX Spark)      | `LF-DGX-SPARK`      | €5,994    | €4,999 HW + €995 install      |
| CR-2 (Situation Room) | `LF-SITROOM-001`    | €10,093   | 2× €4,299 HW + €1,495 install |
| CR-3 (Max)            | Quote               | ~€24K-26K | 4× DGX Spark + mesh bridging  |
| CR-M (Medical)        | `LF-IGX-ORIN`       | €11,990   | €10,995 HW + €995 install     |
| SR-1 (Nano)           | `LF-JETSON-NANO`    | €764      | €269 HW + €495 install        |
| SR-2 (Mid)            | `LF-JETSON-NX`      | €1,990    | €1,495 HW + €495 install      |
| SR-3 (Heavy)          | `LF-JETSON-AGX`     | €2,694    | €2,199 HW + €495 install      |
| Install only          | `LF-NVIDIA-INSTALL` | €995      | BYOD (customer hardware)      |

### Software + Service SKUs (recurring)

| SKU                     | Price              | Cadence            | What it covers                                 |
| ----------------------- | ------------------ | ------------------ | ---------------------------------------------- |
| Sovereign Model Updates | €299/mo            | Monthly            | OTA model updates, remote config, 24/7 support |
| DWS IQ 6 (multi-tenant) | €4,999             | One-time           | Cloud platform access                          |
| DWS IQ Aegis            | From €59,990       | One-time + monthly | Single-tenant sovereign                        |
| LF-ONTOLOGY-25          | Enterprise license | Per-site           | 25-industry ontology package                   |
| LF-TRAIN-IND            | Quote              | Per-factory        | Sovereign training service                     |

### Training Service SKUs (planned, P2)

| SKU                                 | Description                                  | Price          |
| ----------------------------------- | -------------------------------------------- | -------------- |
| `PRODUCT_ENTERPRISE_MODEL_TRAINING` | Full 4-stage training cascade for enterprise | Quote required |
| `PRODUCT_TRAIN_MODEL`               | Single-stage QLoRA training (any stage)      | From €2,500    |

---

## 10. Verification Checklist

- [ ] CR-1 mode-switch tested: production → training → production with model validation
- [ ] CR-2 parallel training + inference validated (no contention)
- [ ] Sovereign training cascade Stage 1-4 end-to-end on DGX Spark
- [ ] Air-gap deployment tested (USB-only, no network)
- [ ] Sensor Ring → Control Room event pipeline verified (MQTT/gRPC)
- [ ] Fleet management dashboard showing 5+ nodes
- [ ] Article 12 training log completeness validated
- [ ] Adapter hot-swap tested (industry switch without restart)

---

## References

- `docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md` — Ontology pipeline and 25-industry taxonomy
- `ontology/README.md` — Ontology structure and enterprise registry
- `dws10.com/config/products.json` — Product pricing source of truth
- `Admin/ADMIN_MANUAL.md` §AI Workbench — Operational procedures
- `scripts/training-mode.sh` — Training mode switch script
- `scripts/production-mode.sh` — Production mode switch script

# KubeCon + CloudNativeCon Europe 2026 — Kubernetes as the AI Inference OS

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/k8s-ai-inference-research-0M0sM | Date: 30.03.2026 | Changes: Initial creation — KubeCon EU 2026 research note, K8s AI inference shift analysis, DWS implications

Session Links & References:
  - Claude Code (claude/k8s-ai-inference-research-0M0sM): https://github.com/blogtheristo/dws6/commits/claude/k8s-ai-inference-research-0M0sM

Document Status:
  - Created: 30.03.2026
  - Last Modified: 30.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

**Date:** 2026-03-30
**Author:** Risto Paarni
**Type:** Conference Intelligence / Infrastructure Research
**Context:** KubeCon + CloudNativeCon Europe 2026, Amsterdam
**Event:** March 2026
**Attendees:** 13,350

---

## Summary

KubeCon + CloudNativeCon Europe 2026 in Amsterdam marked the inflection point where Kubernetes shifted from container orchestration platform to the operating system for AI inference. CNCF Executive Director Jonathan Bryce framed the moment as both a challenge and a gold rush for cloud native inference.

**Key thesis:** The gap between K8s AI adoption (82%) and daily production AI use (7%) is the defining enterprise infrastructure problem of 2026-2028. Whoever closes this gap wins the $255B inference market.

---

## Key Numbers

| Metric | Value | Source |
|--------|-------|--------|
| KubeCon EU 2026 attendees | 13,350 | CNCF keynote |
| Global cloud native developers | 19.9 million | CNCF report (keynote release) |
| Developers building AI on cloud native | 7.3 million | CNCF report |
| K8s adoption for AI workloads | 82% | CNCF survey |
| Organizations deploying AI daily | 7% | CNCF survey |
| Inference market projection (2030) | $255 billion | CNCF keynote data |
| AI compute going to inference (vs training) | 67% | CNCF keynote data |

---

## The Adoption-Production Gap

The most significant data point from the event: **82% of organizations have adopted Kubernetes for AI workloads, but only 7% deploy AI on a daily basis.** This 75-point gap reveals that:

1. **Infrastructure is not the blocker** — organizations already have K8s clusters capable of running AI
2. **Operationalization is the blocker** — model serving, GPU scheduling, inference optimization, and production reliability remain unsolved at scale
3. **The market opportunity is in the middleware** — tools that bridge the gap between "K8s cluster exists" and "AI runs in production daily" will capture enormous value

---

## Inference vs Training: The Compute Shift

The 67/33 split between inference and training compute confirms a structural shift:

- **Training** is episodic, expensive, and increasingly concentrated among hyperscalers and frontier labs
- **Inference** is continuous, distributed, and the actual revenue-generating workload for enterprises
- **GPU strategy must change** — enterprises need inference-optimized hardware (smaller GPUs, higher throughput) rather than training-optimized hardware (largest possible GPU clusters)

This aligns with NVIDIA's own product strategy (GTC 2026: Groq 3 LPU, inference-focused NIM containers) and the broader industry move toward smaller, specialized models deployed at the edge.

---

## What "K8s as AI OS" Means in Practice

Kubernetes becoming the AI inference operating system implies several architectural shifts:

### 1. GPU-Aware Scheduling Becomes Core
- K8s scheduler must natively understand GPU topology, VRAM capacity, multi-GPU inference, and model placement
- Projects like NVIDIA GPU Operator, KubeAI, and vLLM on K8s are becoming standard infrastructure

### 2. Model Serving as a Primitive
- Model serving (vLLM, TGI, Triton) becomes as fundamental to K8s as pod scheduling
- Expect CRDs for model deployments, autoscaling policies for inference load, and standard health checks for model endpoints

### 3. Multi-Tenancy for AI Workloads
- Sharing GPU clusters across teams/models requires new isolation primitives
- MIG (Multi-Instance GPU), time-slicing, and virtual GPU technologies become K8s-native features

### 4. Inference Cost Optimization
- Spot/preemptible GPU instances for batch inference
- Model caching and warm-start strategies
- Quantization-aware deployment (INT4/INT8 models on consumer GPUs vs FP16 on datacenter GPUs)

---

## DWS Architecture Implications

### Relevance to DWS Brain-Memory-Body-Hands

| Layer | Impact | Priority |
|-------|--------|----------|
| **Brain** (DWS IQ 6) | Multi-agent orchestration must support K8s-native model serving; agents should be deployable as K8s workloads | HIGH |
| **Memory** (LWM) | Vector DB and regulation models benefit from K8s inference scheduling for embedding generation | MEDIUM |
| **Body** (Firehorse) | Report generation and compliance scoring can offload to K8s-managed inference endpoints | MEDIUM |
| **Hands** (Fleet) | Edge inference on Jetson/Acer devices complements cloud K8s inference — hybrid deployment model | LOW (future) |

### DWS 7 Roadmap Items

1. **K8s-native agent deployment** — DWS agents as K8s pods with GPU resource requests, enabling horizontal scaling of inference-heavy agents (compliance scoring, carbon analysis)
2. **vLLM/Ollama on K8s** — Standardize local model serving behind K8s service mesh, replacing direct Ollama API calls with K8s-managed inference endpoints
3. **Inference cost tracking** — Per-agent GPU utilization metrics for enterprise billing and sovereignty compliance (EU data residency on EU K8s clusters)

### DWS Competitive Position

The 82/7 gap is exactly where DWS operates: **making AI agents work in production for enterprise industrial use cases.** DWS is not building foundation models (training side). DWS is building the orchestration, compliance, and operationalization layer that closes the adoption-production gap for EU industrial enterprises.

---

## Key Takeaways for Enterprise Technology Leaders

1. **Rethink GPU strategy** — 67% of AI compute is inference. Stop buying training-optimized infrastructure for inference workloads.
2. **Kubernetes is the deployment target** — 82% adoption means K8s is the de facto standard. Any AI infrastructure investment that doesn't run on K8s will be orphaned.
3. **The $255B inference market is a middleware market** — The value is not in GPUs or models, but in the orchestration layer that makes inference reliable, cost-effective, and compliant at scale.
4. **Daily production use is the real metric** — Having K8s and having AI models means nothing if they don't run in production daily. The 7% figure is the number to move.

---

## Impact on DWS IQ Aegis

The KubeCon 2026 findings directly validate and strengthen the Aegis product positioning.

### Why This Matters for Aegis

Aegis is a single-tenant K8s-deployed AI platform (UpCloud Managed Kubernetes, Helsinki). The 82/7 gap is Aegis's entire value proposition: **defence and sovereign enterprises have K8s clusters but cannot operationalize AI agents in production daily.** Aegis closes that gap for the 21 EU-regulated dual-use industries.

### Specific Impacts

| KubeCon Finding | Aegis Impact | Action |
|-----------------|-------------|--------|
| K8s is the AI inference OS | Aegis is already K8s-native (Helm chart, single-tenant) — this validates the architecture choice over VM-based or SaaS-only approaches | No change needed — Aegis is ahead of the curve |
| 82% adoption, 7% daily use | Aegis's 21+ autonomous agents are designed for daily production use (compliance scoring, sovereignty monitoring, orbital intelligence). This gap IS the market. | Marketing: lead with "from K8s adoption to daily AI production" messaging |
| $255B inference market by 2030 | Aegis's €59,990 + €999/mo pricing captures enterprise inference value. At 62% gross margin, even a small share of the defence/sovereign slice is significant. | Pricing validated — Aegis is 13-77x cheaper than Palantir while being K8s-native |
| 67% of AI compute is inference | Aegis agents (ComplianceAgent, ArgusAgent, SovereigntyMonitor) are inference-only workloads. No training on customer infrastructure. This aligns with the compute shift. | Emphasize inference-only positioning in sales — no GPU training costs for customers |
| GPU-aware scheduling becoming core | Aegis on UpCloud L40S nodes benefits from K8s GPU scheduling improvements. As K8s GPU scheduling matures, Aegis deployment becomes simpler and cheaper. | Track K8s GPU Operator improvements for Aegis Helm chart |
| 19.9M cloud native developers | Large talent pool for Aegis deployment and customization. K8s skills are no longer scarce — customers can operate Aegis without specialized ML infrastructure teams. | Reduces customer objection "we don't have the team to run this" |

### Competitive Advantage Reinforcement

The KubeCon data strengthens Aegis's position against every competitor:

- **Palantir AIP** — Proprietary infrastructure, not K8s-native. As K8s becomes the standard, Palantir's lock-in becomes a liability. Aegis runs on any K8s cluster.
- **Anduril Lattice** — Hardware-first approach. The 67% inference compute shift means software-defined inference (Aegis) wins over hardware-defined platforms.
- **C3.ai Defence** — Dashboard/SaaS model. The 82/7 gap shows that dashboards don't equal production AI. Aegis's autonomous agents actually run daily.

### Aegis Roadmap Items from KubeCon

1. **Inference autoscaling** — Implement K8s HPA (Horizontal Pod Autoscaler) policies for Aegis agents based on inference queue depth. The 67% inference compute figure means customers will demand elastic scaling.
2. **Multi-model GPU sharing** — Use MIG (Multi-Instance GPU) on L40S nodes to run multiple Aegis agents on a single GPU. Reduces per-customer infrastructure cost below the current €376/mo.
3. **K8s-native model versioning** — CRDs for model deployments, enabling blue/green model updates for compliance agents without downtime. Critical for Article 12 audit continuity.
4. **Edge-cloud inference split** — Combine Jetson Orin Nano edge inference (already in roadmap) with K8s cloud inference for hybrid deployments. Defence customers need this for field operations.

### Bottom Line

KubeCon 2026 confirms that Aegis is architecturally positioned in exactly the right place: K8s-native, inference-focused, enterprise-grade. The 82/7 gap is a $255B market opportunity, and Aegis is one of very few EU-sovereign platforms that can close it for defence and dual-use industries. **No pivot needed — accelerate.**

---

## Related DWS Field Notes

- `2026-03-16-nvidia-gtc-2026-keynote-dws-impact.md` — NVIDIA GTC 2026 hardware/platform announcements
- `2026-02-16-nvidia-blackwell-ultra-agentic-ai-inference.md` — Blackwell Ultra inference architecture
- `2026-03-10-acer-dgx-sandbox-strategy.md` — Edge inference sandbox strategy
- `2026-03-29-dgx-spark-primary-runtime-setup.md` — DGX Spark as primary inference runtime
- `2026-03-26-aegis-pricing-study.md` — Aegis pricing analysis and competitor benchmarking

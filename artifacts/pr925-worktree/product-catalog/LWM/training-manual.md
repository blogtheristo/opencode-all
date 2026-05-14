# DWS IQ 6 Lifetime World Model (LWM) Training Manual

**Document ID:** DWS-LWM-TRAIN-001
**Version:** 1.0
**Classification:** Internal Lab Notebook + Publishable Appendix
**Author:** Lifetime Oy
**Date:** 2026-01-24

-----

## Table of Contents
 




1. [Executive Summary](#1-executive-summary)
1. [Infrastructure Setup](#2-infrastructure-setup)
1. [NVIDIA Inception Program Integration](#3-nvidia-inception-program-integration)
1. [Training Pipeline Architecture](#4-training-pipeline-architecture)
1. [Industry-Specific Training Protocols](#5-industry-specific-training-protocols)
1. [Step-by-Step Training Procedures](#6-step-by-step-training-procedures)
1. [Quality Assurance & Validation](#7-quality-assurance--validation)
1. [Cost Analysis & ROI Projections](#8-cost-analysis--roi-projections)
1. [Troubleshooting Guide](#9-troubleshooting-guide)
1. [Appendix A: Publishable Technical Specifications](#appendix-a-publishable-technical-specifications)
1. [Appendix B: NVIDIA Inception Benefits Summary](#appendix-b-nvidia-inception-benefits-summary)
1. [References](#references)

-----

## 1. Executive Summary

### 1.1 Purpose

This manual provides step-by-step instructions for training industry-specific Lifetime World Models (LWMs) using the DWS IQ 6 platform. The system leverages Claude API for curriculum design and synthetic data generation, combined with local QLoRA fine-tuning of open-source models (Llama 3.1, Mistral, Qwen) on the Acer Veriton GN-100 server.

### 1.2 Strategic Context

DWS IQ 6 targets EU-regulated industries requiring domain-specific AI capabilities:

|Industry Vertical|Regulatory Framework         |Target Model Output                     |
|-----------------|-----------------------------|----------------------------------------|
|Logistics        |GDPR, Working Time Directive |Route optimization, scheduling          |
|Construction     |CE Marking, Eurocodes        |BIM coordination, safety protocols      |
|Manufacturing    |ISO 9001, Machinery Directive|Process control, quality management     |
|Energy/Climate   |EU ETS, CSRD, Taxonomy       |Emissions tracking, compliance reporting|
|Healthcare       |GDPR-Health, MDR, NIS2       |Clinical workflows, documentation       |

### 1.3 Training Philosophy

```
┌─────────────────────────────────────────────────────────────────┐
│                   DWS IQ 6 LWM Training Pipeline                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Claude API (Orchestrator)         Local Training (GN-100)    │
│   ┌─────────────────────┐          ┌─────────────────────┐     │
│   │ Curriculum Design   │          │ Base Model Loading  │     │
│   │ Synthetic Data Gen  │───────▶  │ QLoRA Fine-tuning   │     │
│   │ Quality Validation  │          │ DPO Alignment       │     │
│   │ Evaluation Rubrics  │◀───────  │ Model Export        │     │
│   └─────────────────────┘          └─────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.4 Planning Phase & External Advice

While the core LWM training workflow is defined in the three parts below, **planning-phase** guidance is captured in the field note **[Grok advice: LWM planning & multi-tool workflow](../../docs/field-notes/2026-03-04-grok-advice-lwm-planning-multi-tool.md)**. Key takeaways:

- **Lightweight PoCs first:** This manual already uses QLoRA + synthetic data (Part 2); avoid large full fine-tunes until eval benchmarks are met.
- **OpenSandbox:** Use OpenSandbox (Stage 1.5 on Acer Veriton GN100) for isolated, reproducible training/eval loops; see `DWS_SECURITY_STANDARD.md` §14.6.
- **Success metrics:** Define 3–5 LWM eval benchmarks (e.g. Fit-for-55 Q&A, compliance gap coverage, Article 12 readiness) before scaling; see Part 3 and the field note for next steps.
- **Synthetic data first:** Prioritise synthetic data generation (Claude API) to reduce raw data dependency; align with 2026 best practice for domain-specific models.

-----

## 2. Complete Training Manual Parts

This comprehensive training manual is split into 3 executable "lab notebook" parts for the Acer Veriton GN-100.

### Part 1: Infrastructure & Environment Setup (4-6 hours)
**File:** `training-manual-part1-infrastructure.md` (1,182 lines)

**Contents:**
- Hardware verification and diagnostics
- System preparation and package installation
- NVIDIA driver & CUDA 12.4 installation
- Python 3.11 virtual environment setup
- PyTorch with CUDA support installation
- Anthropic Claude API configuration
- Hugging Face setup and Llama 3.1 8B download
- Complete system health checks
- Backup and recovery procedures

**Deliverables:**
- ✅ `nvidia-smi` showing GPU stats
- ✅ PyTorch CUDA available
- ✅ Claude API responding
- ✅ Llama 3.1 8B base model downloaded (~16GB)
- ✅ All dependencies installed and verified

---

### Part 2: Data Generation & Training (16-24 hours)
**File:** `training-manual-part2-data-training.md` (1,108 lines)

**Contents:**
- Industry configuration files (Logistics, Construction, Manufacturing, Energy, Healthcare)
- Claude API curriculum generation
- Synthetic training data generation (2000+ examples per industry)
- QLoRA fine-tuning configuration and setup
- Training execution and monitoring
- Checkpoint management
- GPU monitoring and optimization

**Deliverables:**
- ✅ Industry curriculum JSON
- ✅ 2000+ synthetic training examples
- ✅ Fine-tuned LoRA adapter (~400MB)
- ✅ Training logs and checkpoints
- ✅ Final training loss < 1.0

**Cost per industry:** €50-70 (€40-60 Claude API + €5-8 electricity)

---

### Part 3: Evaluation, Merging & Deployment (4-6 hours)
**File:** `training-manual-part3-evaluation-deployment.md` (1,025 lines)

**Contents:**
- Claude-as-judge evaluation framework
- Model performance benchmarking
- LoRA weight merging into full model
- Production deployment package creation
- Inference server setup (Flask API)
- Performance testing and optimization
- Documentation and handoff procedures

**Deliverables:**
- ✅ Evaluation report (avg score >7.0, pass rate >80%)
- ✅ Merged production model (~16.5GB)
- ✅ Deployment package with scripts and documentation
- ✅ Inference API server
- ✅ Performance benchmarks

**Quality Gates:**
- Average score > 7.0/10
- Pass rate > 80%
- Inference latency < 2 seconds
- Zero safety concerns

---

## 3. Complete Training Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                  PART 1: Infrastructure (4-6h)                  │
├─────────────────────────────────────────────────────────────────┤
│  Hardware Check → NVIDIA Setup → Python Env → API Config       │
│  → Model Download → Health Check                               │
│                                                                 │
│  Output: Ready training environment                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              PART 2: Data & Training (16-24h)                   │
├─────────────────────────────────────────────────────────────────┤
│  Industry Config → Claude Curriculum → Data Generation          │
│  → QLoRA Training → Monitoring → Checkpoints                   │
│                                                                 │
│  Output: Fine-tuned LoRA adapter                               │
│  Cost: €50-70 per industry                                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│            PART 3: Evaluation & Deployment (4-6h)               │
├─────────────────────────────────────────────────────────────────┤
│  Claude Evaluation → Quality Gates → Model Merging             │
│  → Production Package → Deployment → Benchmarking              │
│                                                                 │
│  Output: Production-ready model package                        │
└─────────────────────────────────────────────────────────────────┘
```

## 4. Total Training Metrics

| Metric | Value |
|--------|-------|
| **Total execution time** | 24-36 hours |
| **Total cost per industry** | €80-125 |
| **Training data generated** | 2000+ examples |
| **Model size (merged)** | ~16.5 GB |
| **Target evaluation score** | >7.0/10 |
| **Target pass rate** | >80% |
| **Inference latency** | <2 seconds |

## 5. Industry Models Roadmap

| Industry | Status | Priority | Customer Context |
|----------|--------|----------|------------------|
| **Logistics** | Example in manual | High | Uber Helsinki, Bolt, Kela |
| **Construction** | Ready to train | High | NCC, T2H |
| **Manufacturing** | Ready to train | Medium | General SMEs |
| **Energy** | Ready to train | Medium | Utilities, climate tech |
| **Healthcare** | Ready to train | Low | Clinics, hospitals |

**Total investment for 5 industries:** €400-625

**Projected Year 1 revenue:** €840,000 (240 customers × average license fee)

**ROI:** 20,388% (204x return)

-----

## Document Control

|Version|Date      |Author             |Changes        |
|-------|----------|-------------------|---------------|
|1.0    |2026-01-24|Lifetime Consulting|Initial release|

-----

*This document is proprietary to Lifetime Oy. Appendix A and B may be distributed to partners and investors.*

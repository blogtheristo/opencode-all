# Scaleway Startups Program Application

**Company:** Lifetime Oy / DWS IQ
**Project:** Lifetime World Model (LWM) & Climate Intelligence Platform
**Date:** January 28, 2026
**Contact:** admin@dws6.com

---

## 1. Executive Summary

**DWS IQ** is an EU climate intelligence platform helping industries comply with Fit for 55, ETS, CBAM, and CSRD regulations. We're building the **Lifetime World Model (LWM)** - a specialized Climate LLM trained on EU regulations and industrial data.

### What We Need from Scaleway

| Resource | Purpose | Monthly Cost Est. |
|----------|---------|-------------------|
| Serverless Containers | API hosting (current) | €15-50 |
| L4 GPU Instances | LWM inference & fine-tuning | €400-800 |
| H100 GPU Instances | LWM training (occasional) | €500-2,000 |
| Object Storage | Training data & model weights | €50-100 |
| **Total Monthly** | | **€965 - €2,950** |

**Requested Credits:** €36,000 (Growth Stage Program)
**Coverage Duration:** 12-24 months of infrastructure

---

## 2. Project Description

### The Problem
EU industries face complex climate compliance requirements:
- **CSRD** - Corporate Sustainability Reporting Directive
- **ETS** - Emissions Trading System
- **CBAM** - Carbon Border Adjustment Mechanism
- **EPBD** - Energy Performance of Buildings Directive
- **EN 15978** - Building carbon calculation standard

Manual compliance is expensive (€50K-500K/year for consultants) and error-prone.

### Our Solution
1. **Climate Assistant** - AI chatbot for instant compliance guidance
2. **Lifetime World Model (LWM)** - Specialized Climate LLM
3. **Audio Chat Interface** - Voice-enabled compliance assistant
4. **Automated Reporting** - CSRD/CBAM report generation

### Technology Stack
- **Backend:** Node.js/Express on Scaleway Serverless Containers
- **AI/LLM:** Groq API (Llama 3.3 70B) → migrating to self-hosted LWM
- **Frontend:** React with Web Speech API for voice
- **Database:** Supabase (PostgreSQL + pgvector)
- **Region:** EU (Paris) - GDPR compliant

---

## 3. Infrastructure Requirements

### 3.1 Current Setup (Live)

| Component | Specification | Cost |
|-----------|--------------|------|
| Serverless Container | 1000 mVCPU, 2GB RAM | ~€15/month |
| Container Registry | dws-iq-backend image | Included |
| **Total Current** | | **€15/month** |

**Live Endpoint:** `https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud`

### 3.2 Audio Chat Requirements

Voice-enabled climate assistant using Web Speech API (browser-based, no server cost) plus backend processing.

| Component | Specification | Cost |
|-----------|--------------|------|
| API Container | 2000 mVCPU, 4GB RAM | ~€30/month |
| Requests | ~500K/month estimated | ~€0.075 |
| Memory Usage | ~200K GB-s/month | Free tier |
| **Audio Chat Total** | | **~€30/month** |

### 3.3 LWM Inference (Production)

For serving the Lifetime World Model to customers:

| Option | Specification | Hourly | Monthly (24/7) |
|--------|--------------|--------|----------------|
| **L4 GPU** | 24GB VRAM, good for 7B-13B models | ~€0.65 | ~€468 |
| **L40S GPU** | 48GB VRAM, good for 70B models | €1.40 | ~€1,008 |
| **H100 PCIe** | 80GB VRAM, best performance | €2.73 | ~€1,965 |

**Recommended:** L4 GPU for initial deployment (7B quantized model)
**Estimated Cost:** €400-500/month

### 3.4 LWM Training (Occasional)

For fine-tuning and training the Climate LLM:

| Training Task | GPU Required | Duration | Cost |
|---------------|--------------|----------|------|
| Fine-tune 7B model | L4 x1 | 24-48 hours | €15-30 |
| Fine-tune 13B model | L40S x1 | 48-72 hours | €70-100 |
| Train 7B from scratch | L40S x4 | 7-14 days | €940-1,880 |
| Train 70B model | H100 x8 | 30+ days | €15,000+ |

**Recommended:** Fine-tuning Llama 3.1 8B on EU climate data
**Estimated Cost:** €100-500/month (occasional training runs)

### 3.5 Storage Requirements

| Storage Type | Size | Cost |
|--------------|------|------|
| Training datasets | 100GB | €2/month |
| Model weights | 50GB | €1/month |
| Embeddings/vectors | 20GB | €0.40/month |
| Backups | 50GB | €1/month |
| **Storage Total** | 220GB | **~€5/month** |

---

## 4. Total Monthly Cost Estimate

### Scenario A: Minimum Viable (Current + Audio)
| Component | Cost |
|-----------|------|
| API Container (current) | €15 |
| Audio Chat Container | €30 |
| Storage | €5 |
| **Total** | **€50/month** |

### Scenario B: With LWM Inference (L4)
| Component | Cost |
|-----------|------|
| API Containers | €45 |
| L4 GPU Instance | €468 |
| Storage | €50 |
| **Total** | **€563/month** |

### Scenario C: Full Production (L40S + Training)
| Component | Cost |
|-----------|------|
| API Containers | €60 |
| L40S GPU Inference | €1,008 |
| Training (amortized) | €200 |
| Storage | €100 |
| **Total** | **€1,368/month** |

### Scenario D: Enterprise Scale (H100)
| Component | Cost |
|-----------|------|
| API Containers (HA) | €120 |
| H100 GPU Inference | €1,965 |
| Training (amortized) | €500 |
| Storage | €200 |
| **Total** | **€2,785/month** |

---

## 5. Why Scaleway?

### EU Data Sovereignty
- Paris datacenter ensures GDPR compliance
- Critical for EU climate compliance platform
- No data transfer to US

### GPU Availability
- H100 at €2.73/hour (competitive pricing)
- L4 for cost-effective inference
- L40S for balanced performance/cost

### Startup-Friendly
- Pay-as-you-go model
- Generous free tiers
- Serverless scales to zero

---

## 6. Growth Projections

| Timeline | Users | Requests/month | Infrastructure |
|----------|-------|----------------|----------------|
| Now | 10 | 10K | Serverless only |
| 6 months | 100 | 100K | + L4 GPU |
| 12 months | 1,000 | 1M | + L40S GPU |
| 24 months | 10,000 | 10M | + H100 cluster |

---

## 7. Startup Program Request

### Recommended Tier: Growth Stage Program
- **Credits:** €36,000 over 12 months
- **Rationale:** Series A ready, proven product, clear growth path

### Credit Allocation Plan

| Month | Infrastructure | Spend | Cumulative |
|-------|---------------|-------|------------|
| 1-3 | Serverless + Storage | €150 | €150 |
| 4-6 | + L4 GPU Inference | €1,700 | €1,850 |
| 7-9 | + LWM Training | €4,000 | €5,850 |
| 10-12 | + L40S Production | €4,500 | €10,350 |
| **Year 1 Total** | | | **€10,350** |

**Buffer for scaling:** €25,650 remaining for unexpected growth

---

## 8. Questions for Scaleway

1. **GPU Availability:** What is L4/L40S availability in fr-par region?
2. **Reserved Instances:** Are there discounts for 12-month GPU commitments?
3. **Training Support:** Do you offer ML engineering support for LLM training?
4. **NVIDIA Inception:** Can we combine with NVIDIA Inception program benefits?
5. **Managed Inference:** Do you offer managed LLM inference (like SageMaker)?

---

## 9. Contact & Links

- **Website:** https://dws6.com
- **Live API:** https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud/health
- **GitHub:** https://github.com/blogtheristo/dws6
- **Contact:** admin@dws6.com

---

## Appendix: Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DWS IQ Platform                          │
├─────────────────────────────────────────────────────────────┤
│  Frontend (Cloudflare Pages)                                │
│  ├── Climate Assistant Chat (React)                         │
│  ├── Voice Input (Web Speech API)                           │
│  └── Dashboard (React + TailwindCSS)                        │
├─────────────────────────────────────────────────────────────┤
│  Backend (Scaleway Serverless Containers)                   │
│  ├── Express API (Node.js)                                  │
│  ├── Gated Access System                                    │
│  └── Lead Capture                                           │
├─────────────────────────────────────────────────────────────┤
│  AI/LLM Layer (Scaleway GPU Instances)                      │
│  ├── Current: Groq API (Llama 3.3 70B)                      │
│  └── Future: Self-hosted LWM on L4/L40S                     │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── Supabase (PostgreSQL + Auth)                           │
│  ├── pgvector (Embeddings)                                  │
│  └── Scaleway Object Storage (Models)                       │
└─────────────────────────────────────────────────────────────┘
```

---

**Document Version:** 1.0
**Prepared by:** Claude AI Assistant
**Session:** krDzD

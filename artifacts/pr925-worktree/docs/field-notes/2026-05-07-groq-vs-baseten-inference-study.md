---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-sonnet-4-6) | Session: claude/groq-vs-baseten-study-x7WyH | Date: 07.05.2026 | Changes: Initial field note — head-to-head study of Groq LPU cloud vs Baseten GPU cloud for DWS IQ 6 inference; covers latency, pricing, model coverage, EU residency, and DWS routing recommendation

Session Links & References:

- Groq pricing: https://groq.com/pricing
- Groq docs (rate limits, models): https://console.groq.com/docs/openai
- Baseten docs: https://docs.baseten.co
- Baseten GPU pricing: https://www.baseten.co/pricing
- DWS prior art: docs/field-notes/2026-04-05-nvidia-groq-deal-inference-stack.md
- DWS provider comparison: plan.md §DWS6 Current AI Stack

Document Status:

- Created: 07.05.2026
- Language: English
- Publication Status: ACTIVE — internal inference strategy | DWS IQ 6 stack decision

---

# Field Note: Groq vs Baseten — Inference Provider Study

**Date:** 2026-05-07
**Author:** Risto Päärni / Claude Code (claude-sonnet-4-6)
**Type:** Competitive Intelligence / Infrastructure Decision
**Scope:** DWS IQ 6 inference routing, LLM provider selection, EU compliance posture

---

## 1. Why This Study

DWS IQ 6 currently runs Groq as its primary cloud LLM provider (`llm-client.ts`,
`GROQ_API_KEY`), with Anthropic and local Ollama/vLLM as fallbacks. Baseten has
emerged as a viable alternative for teams that need:

- Custom or fine-tuned model deployment
- Serverless GPU inference without dedicated hardware
- EU data-residency options not available on GroqCloud

This study frames the tradeoff so the DWS routing decision tree is grounded in
first-principles analysis, not vendor marketing.

**Pre-reading:** The NVIDIA × Groq deal (Dec 2025) field note
(`2026-04-05-nvidia-groq-deal-inference-stack.md`) covers Groq's strategic
context. This note focuses on operational inference characteristics.

---

## 2. Platform Anatomy

### 2.1 Groq — LPU Cloud

Groq runs on **Language Processing Units (LPUs)**, a custom chip with
on-die SRAM rather than external HBM memory. The architectural bet:
eliminate memory-bandwidth bottleneck (the dominant constraint for LLM
decode) by keeping activations and weights in on-chip SRAM.

| Dimension       | Detail                                                                           |
| --------------- | -------------------------------------------------------------------------------- |
| Chip            | Groq LPU (GroqChip 2); NVIDIA Groq 3 LPX (Samsung 4nm, Vera Rubin integration)   |
| Memory model    | On-die SRAM (no HBM)                                                             |
| Scheduling      | Deterministic (compiled, no dynamic dispatch)                                    |
| Inference stage | Decode-optimised; prefill stage is GPU (hybrid in NVIDIA Vera Rubin)             |
| API surface     | OpenAI-compatible (`api.groq.com/openai/v1`)                                     |
| Data residency  | US only (GroqCloud)                                                              |
| DPA             | EU SCC embedded in GroqCloud Services Agreement; no separate signable instrument |
| Models served   | Llama 3.x, Gemma 3, Mistral, Qwen, Compound-Beta                                 |

The deterministic scheduling means **very flat latency tail** — p99 ≈ p50 for
decode throughput. This is the property GPUs cannot replicate without major
batching complexity.

### 2.2 Baseten — GPU Cloud for Deployed Models

Baseten is a **model deployment platform** built on GPU infrastructure (H100,
A100, L4). The fundamental difference from Groq: Baseten does not serve
pre-defined models — you deploy your own, using their Truss packaging framework
or pre-built TrussChains.

| Dimension      | Detail                                                               |
| -------------- | -------------------------------------------------------------------- |
| Chip           | NVIDIA H100 80GB (primary), A100 40/80GB, L4 24GB                    |
| Memory model   | HBM2e / HBM3 (external bandwidth-constrained)                        |
| Scheduling     | vLLM or TGI engine under the hood (dynamic batching)                 |
| API surface    | Custom endpoint per deployment; OpenAI-compatible mode available     |
| Data residency | Multi-cloud: AWS us-east-1, eu-west-1; GCP us-central1, europe-west4 |
| DPA            | Baseten DPA signable; EU SCC addendum available                      |
| Models served  | Any: HuggingFace, custom, fine-tuned, proprietary                    |

The key unlock is **bring your own model** — something GroqCloud cannot offer.
Fine-tuned compliance classifiers, domain-adapted instruction models, or
quantised local replicas can be served at scale without self-managing CUDA.

---

## 3. Performance Benchmarks

Numbers below are from published vendor data and independent benchmarks
(ArtificialAnalysis.ai, the-decoder.com, Groq developer console).

### 3.1 Decode Speed (Tokens / Second, Single Request)

| Provider          | Model                                   | Tok/s (output)  | Source                           |
| ----------------- | --------------------------------------- | --------------- | -------------------------------- |
| Groq              | Llama 3.3 70B (llama-3.3-70b-versatile) | **500–800**     | Groq console, ArtificialAnalysis |
| Groq              | Llama 3.1 8B                            | **1,000–1,500** | Groq console                     |
| Baseten (H100)    | Llama 3.3 70B (vLLM)                    | 80–160          | Baseten docs, independent tests  |
| Baseten (H100)    | Llama 3.1 8B (vLLM)                     | 400–700         | Baseten docs                     |
| Scaleway H100     | Llama 3.3 70B                           | 50–120          | Scaleway benchmark dashboard     |
| DGX GN100 (local) | Llama 3.3 70B (Ollama)                  | 40–90           | DWS local testing                |

**Groq LPU is 4–8× faster than H100 GPU for the decode stage on 70B models.**
This gap is structural, not driver-level — it is the SRAM vs HBM difference.

### 3.2 Time to First Token (TTFT)

| Provider       | TTFT (128-token prompt) | TTFT (4096-token prompt) |
| -------------- | ----------------------- | ------------------------ |
| Groq           | ~200 ms                 | ~800 ms                  |
| Baseten (H100) | ~300 ms                 | ~1,200 ms                |
| Scaleway H100  | ~400 ms                 | ~1,800 ms                |

TTFT gap is smaller because prefill is GPU on both sides. Groq's edge here
comes from less API overhead, not chip difference.

### 3.3 Latency Tail (p99 vs p50)

This is Groq's strongest differentiator for agentic workloads where many
sequential calls must chain without accumulating latency.

| Provider       | p50     | p99     | Tail factor |
| -------------- | ------- | ------- | ----------- |
| Groq           | ~250 ms | ~350 ms | ~1.4×       |
| Baseten (H100) | ~400 ms | ~900 ms | ~2.3×       |

Flat tail matters for **DWS IQ 6 agent chains** — a 16-agent compliance
workflow calling 70B at each step would accumulate 16 × p99. Groq's flat
tail keeps end-to-end latency predictable; GPU infrastructure can spike.

---

## 4. Pricing Analysis

### 4.1 Groq — Per-Token Cloud Pricing

Source: Groq pricing page (May 2026); confirmed against DWS plan.md §AI Stack.

| Model                   | Input (per 1M tokens) | Output (per 1M tokens) |
| ----------------------- | --------------------- | ---------------------- |
| llama-3.3-70b-versatile | $0.59                 | $0.79                  |
| llama-3.1-8b-instant    | $0.05                 | $0.08                  |
| gemma2-9b-it            | $0.20                 | $0.20                  |
| compound-beta (routing) | $0.75                 | $0.99                  |

DWS current benchmark: ~$1/day on Climate Assistant alone (plan.md).
At 1M input + 500k output tokens/day on 70B: $0.59 + $0.40 ≈ **$0.99/day**.

### 4.2 Baseten — GPU-Hour Pricing

Baseten charges for GPU time, not tokens. Pricing varies by GPU type and
commitment (on-demand vs reserved).

| GPU           | On-Demand / hr | Reserved (6-mo) / hr | Best for       |
| ------------- | -------------- | -------------------- | -------------- |
| H100 80GB SXM | ~$3.50–4.00    | ~$2.50–3.00          | 70B models     |
| A100 80GB     | ~$2.50–3.00    | ~$1.80–2.20          | 13–34B models  |
| L4 24GB       | ~$0.75–1.00    | ~$0.55–0.70          | 7–8B quantised |

_Source: Baseten pricing page, approximate; dedicated GPU reserved._

**Break-even analysis (H100 vs Groq):**

Assuming one H100 at $3.50/hr continuously:

- Daily cost: $84
- Daily token capacity: ~400 tok/s × 86,400 s × ~40% utilisation ≈ **13.8B tokens/day**
- Effective price per 1M output tokens: **~$6.09** (much worse than Groq at $0.79)

H100 only beats Groq on per-token cost at **>80% sustained utilisation** —
i.e., enterprise production scale with near-zero idle time. Below that
threshold, Groq's serverless per-token model is cheaper.

**When Baseten wins on cost:**

- Custom/fine-tuned model (can't use Groq at all)
- Sustained high-volume workload (>$200/day Groq spend)
- Long-running batch inference (low TTFT tolerance, high throughput priority)

---

## 5. Model Coverage

### 5.1 Groq: Curated, Precompiled

GroqCloud serves a fixed menu of models. Models must be compiled for the LPU
architecture — you cannot add arbitrary checkpoints.

| Family              | Available on Groq                    |
| ------------------- | ------------------------------------ |
| Llama 3.x (Meta)    | ✅ 8B, 70B, 3B scout                 |
| Gemma 3 (Google)    | ✅ 27B                               |
| Mistral / Mixtral   | ✅ 7B                                |
| Qwen 3              | ✅ 32B                               |
| Compound-Beta       | ✅ (Groq routing model)              |
| Custom / fine-tuned | ❌ — not possible                    |
| Llama 3.3 405B      | ❌ — too large for current LPU fleet |
| Claude / Gemini     | ❌ — proprietary, not open weights   |

### 5.2 Baseten: Any Model

Baseten supports any model packaged as a Truss:

- Any HuggingFace checkpoint (quantised or full-precision)
- Private fine-tuned models (PEFT/LoRA adapters)
- GGUF quantised models (via llama.cpp backend)
- Custom serving logic (pre/post-processing in Python)

**This is Baseten's decisive advantage for DWS use cases requiring:**

- Compliance-domain fine-tuned instruction models (e.g., CSRD classifier)
- Finnish-language adapted models (not served by any Groq model)
- Private enterprise-specific models that must never touch Groq's fleet

---

## 6. EU Residency & Compliance

This is the **critical dimension** for DWS IQ 6's EU enterprise positioning.

| Dimension                 | Groq                                                       | Baseten                                                     |
| ------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------- |
| Data residency options    | US only (`api.groq.com`)                                   | EU: AWS eu-west-1 (Ireland), GCP europe-west4 (Netherlands) |
| GDPR DPA                  | EU SCC embedded in service agreement; no separate signable | Separate DPA signable; EU SCC addendum available            |
| AI Act Art. 53 logging    | Not independently verifiable (US system)                   | Possible via custom deployment with audit logs              |
| Data Processing Agreement | Not standalone — flagged gap for EU enterprise             | Standalone, signable per-customer                           |
| SCCs for EU transfer      | Standard Contractual Clauses embedded                      | Explicit; Baseten acts as processor                         |
| Finnish/Nordic preferred  | No                                                         | Can deploy in EU-north (AWS/GCP) if requested               |

**DWS conclusion:** For EU customer workloads, Baseten's EU region option + signable DPA is
meaningfully stronger than Groq's current posture. Groq's DPA gap was documented in the
NVIDIA deal field note and remains unresolved post-deal.

---

## 7. Operational Characteristics

### 7.1 Rate Limits

| Provider | Free tier                               | Paid tier                                  |
| -------- | --------------------------------------- | ------------------------------------------ |
| Groq     | 30 RPM, 6,000 RPD, 6,000 TPM            | Varies by plan; ~14,400+ RPM on enterprise |
| Baseten  | No shared rate limits — you own the GPU | Throughput limited by GPU capacity only    |

For **burst workloads** (e.g., DWS batch compliance assessment of 200 contracts),
Groq rate limits are a practical bottleneck. Baseten on a dedicated H100 has no
token-rate ceiling — throughput is purely hardware-constrained.

### 7.2 Uptime / SLAs

| Provider | Published SLA                                         |
| -------- | ----------------------------------------------------- |
| Groq     | 99.9% (GroqCloud status page)                         |
| Baseten  | 99.9% on dedicated deployments; serverless has no SLA |

### 7.3 Developer Experience

| Dimension                | Groq                                     | Baseten                                              |
| ------------------------ | ---------------------------------------- | ---------------------------------------------------- |
| API integration          | Drop-in OpenAI client (1 env var change) | Custom endpoint per deployment; OpenAI mode optional |
| Cold start               | None (always warm)                       | Serverless: 20–60 s cold start; dedicated: none      |
| Monitoring               | Basic (console + logs)                   | Detailed (Prometheus metrics, request traces)        |
| Streaming                | ✅ SSE                                   | ✅ SSE                                               |
| Function calling / tools | ✅ OpenAI-compatible                     | ✅ (depends on model)                                |

**Groq wins on DX for standard models.** DWS llm-client.ts already integrates
Groq with zero library dependency (raw axios to OpenAI-compatible endpoint).
Baseten would require a new provider adapter and deployment pipeline.

---

## 8. DWS IQ 6 Fit Analysis

### Current DWS stack (from llm-client.ts)

```
Priority order:
1. Anthropic (claude-sonnet-4-x)  — primary for complex reasoning
2. Groq (llama-3.3-70b-versatile) — fast + cheap for agent sub-tasks
3. Ollama (local, DGX GN100)      — EU sovereign fallback
4. vLLM (local, DGX GN100)        — batch inference fallback
5. OpenAI-compatible               — last resort
```

Baseten does not appear in the current stack. The question is whether it
should replace or augment one of the existing slots.

### 8.1 Where Baseten Wins Over Groq for DWS

| Use Case                           | Why Baseten Wins                                                        |
| ---------------------------------- | ----------------------------------------------------------------------- |
| Fine-tuned compliance classifier   | Must deploy custom checkpoint — Groq can't do this                      |
| Finnish-language instruction model | Groq's Llama 3.3 is English-dominant; fine-tuned Fi model on Baseten    |
| EU customer production workloads   | Baseten EU region + signable DPA satisfies enterprise procurement       |
| Batch contract processing          | Baseten dedicated H100 has no rate ceiling; Groq has daily token limits |
| Audit-log requirements (AI Act)    | Custom Baseten deployment can log inputs/outputs to compliant storage   |

### 8.2 Where Groq Wins Over Baseten for DWS

| Use Case                                | Why Groq Wins                                                         |
| --------------------------------------- | --------------------------------------------------------------------- |
| Agent sub-task calls (16+ per workflow) | 5–8× faster decode, flat p99 tail, agent chains complete faster       |
| Dev / prototyping                       | Zero setup, 1 env var, instant response                               |
| Cost below $200/day                     | Serverless per-token cheaper than dedicated GPU at <80% utilisation   |
| Non-EU admin + demo paths               | Speed impression matters in demos; Groq's 750 tok/s is visibly faster |
| Standard open models (Llama, Gemma)     | Already compiled and optimised; no deployment work                    |

---

## 9. Recommendation

### Routing Decision (proposed update to llm-client.ts priority)

```
1. Anthropic Claude           — complex reasoning, tool use, primary brain
2. Groq (llama-3.3-70b)      — fast agent sub-tasks, dev, non-EU admin (KEEP)
3. Baseten EU (custom model)  — EU enterprise workloads, fine-tuned classifiers (ADD)
4. Scaleway EU                — EU sovereign standard model (existing)
5. Ollama / vLLM (GN100)      — on-prem fallback (existing)
```

Baseten is not a Groq replacement — it is an **orthogonal capability**:
Groq for speed on standard models, Baseten for custom model deployment and
EU-compliant production routes.

### Decision tree

```
Workload needs custom / fine-tuned model?
├── yes → Baseten (only option)
└── no
    EU customer data? (GDPR / enterprise DPA required)
    ├── yes → Scaleway EU → Baseten EU → [fail: error]
    └── no
        Latency-critical agent chain?
        ├── yes → Groq → Anthropic
        └── no  → Anthropic → Groq → Scaleway EU
```

### Implementation cost

| Action                                        | Effort       | Priority                             |
| --------------------------------------------- | ------------ | ------------------------------------ |
| Add Baseten provider to llm-client.ts         | 1–2 hrs      | When first fine-tuned model is ready |
| Deploy trial model on Baseten EU (eu-west-1)  | 2–4 hrs      | Q3 2026                              |
| Sign Baseten DPA (EU enterprise prerequisite) | Legal review | Before first EU customer pilot       |
| Benchmark Baseten vs Groq on DWS agent chain  | 2 hrs        | After deployment                     |

**Nothing to change today.** Groq remains the right primary fast-inference
provider for the current DWS stack. Baseten becomes relevant when:
(a) a custom model is ready for deployment, or
(b) an EU enterprise customer requires a signable DPA for inference.

---

## 10. One-Sentence Summary

_Groq is the fastest, cheapest API for standard open models — keep it for agent speed; add Baseten when DWS ships a fine-tuned compliance model or when an EU enterprise customer demands a signable inference DPA._

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.

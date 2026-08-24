# Evaluation: NVIDIA Nemotron-3-Super-120B-A12B-FP8 for DWS6

## Model Summary

| Spec | Value |
|------|-------|
| Total params | 120B |
| Active params | 12B (MoE — only 10% active per inference) |
| Architecture | Mamba2-Transformer Hybrid LatentMoE + Multi-Token Prediction |
| Context window | Up to 1M tokens |
| Training data | 25T tokens, cutoff June 2025 |
| Precision | FP8 (also NVFP4 variant for Blackwell) |
| Languages | EN, FR, DE, IT, JA, ES, ZH + 43 programming languages |
| License | Open weights |

## DWS6 Current AI Stack (for comparison)

| Provider | Model | Active Params | Cost | Use |
|----------|-------|---------------|------|-----|
| Groq (primary) | Llama 3.3 70B | 70B (dense) | $0.59/$0.79 per 1M tokens | Climate Assistant |
| Anthropic | Claude Sonnet 4 | Unknown (API) | API pricing | Agent LLM client |
| xAI | Grok 4.1 Fast | Unknown (API) | API pricing | Last30days skill |
| OpenAI | GPT-5.x family | Unknown (API) | API pricing | Fallback |
| Local/Ollama | Various | Varies | Free (hardware) | Veriton GN100 self-hosted |
| Local/vLLM | Configurable | Varies | Free (hardware) | Training infra |

## DWS Benefits Analysis

### 1. MASSIVE EFFICIENCY WIN — 12B Active from 120B Total
- Only 12B parameters active per token (vs. Llama 3.3's full 70B dense)
- **~6x fewer active params** than current Groq/Llama setup
- Lower VRAM, faster inference, cheaper to self-host
- MoE routing gives expert-level quality with small-model compute cost

### 2. PERFECT FIT FOR VERITON GN100 (Blackwell Hardware)
- DWS owns an Acer Veriton GN100 with **NVIDIA GB10 Grace Blackwell SoC + 128GB unified RAM**
- Nemotron-3-Super is **purpose-built for Blackwell** with native NVFP4 pretraining
- NVFP4 variant achieves **4x inference speedup on B200 vs FP8 on H100**
- The FP8 variant (~120GB) fits within the GN100's 128GB unified memory
- **This is the first model optimally matched to DWS's actual hardware**

### 3. SOVEREIGN / ON-PREMISE AI (EU Compliance)
- Open weights = full data sovereignty, no API calls leaving EU
- Aligns with DWS7 roadmap: "Sovereign on-premise AI" and "Groq risk mitigation"
- Eliminates cloud LLM dependency for compliance-sensitive workloads (CSRD, CBAM, AI Act)
- No data residency concerns — inference stays on Finnish hardware

### 4. AGENTIC REASONING — BUILT FOR DWS USE CASE
- Scored **85.6% on PinchBench** (best open model for agent workflows)
- DWS runs 15+ agents (compliance, safety, carbon, SEO, etc.) — all benefit
- 1M token context window enables full-document regulatory analysis
- Multi-Token Prediction = faster generation for long agent outputs

### 5. COST ELIMINATION
- Current Groq spend: $1/day budget (climate assistant alone)
- All API costs for Groq/Anthropic/xAI/OpenAI eliminated for workloads moved to local
- One-time hardware cost (GN100 already owned) vs. ongoing API spend
- **ROI: immediate** — hardware already deployed

### 6. MULTILINGUAL (EU Market Coverage)
- Native support for EN, DE, FR, IT, ES + ZH, JA
- DWS operates across 20 EU industries — multilingual compliance docs benefit
- Finnish not listed but English/German cover DWS's primary markets

### 7. DEVELOPMENT VELOCITY
- 43 programming languages supported
- SWE-Bench Verified leader in its class — strong for code generation
- Could power local Copilot-style assistance on GN100

## Risks & Concerns

| Risk | Severity | Mitigation |
|------|----------|------------|
| 128GB VRAM may be tight for FP8 (120B params) | Medium | Use NVFP4 variant (~60GB), or quantize to GGUF |
| Finnish language not natively supported | Low | Fine-tune on Finnish corpus; English sufficient for most DWS work |
| Mamba2 architecture may need vLLM updates | Medium | vLLM already in DWS infra; check Mamba2 support status |
| No Anthropic-level tool use polish | Medium | DWS llm-client already abstracts providers; add Nemotron as provider |
| Model freshness (June 2025 cutoff) | Low | Acceptable; regulations change slowly; RAG supplements |

## Implementation Plan (if approved)

### Phase 1: Evaluate (1-2 days)
1. Download NVFP4 variant to Veriton GN100
2. Serve via vLLM (already configured in `docker-compose.training.yml`)
3. Run DWS agent benchmark suite against it
4. Compare quality vs. Groq Llama 3.3 70B on compliance/safety/carbon tasks

### Phase 2: Integrate (1-2 days)
1. Add Nemotron as provider in `src/agents/llm-client.ts`
2. Configure Ollama model profile or vLLM endpoint
3. Add `NEMOTRON_API_URL` to `.env.example`
4. Update provider priority: Nemotron (local) → Anthropic → Groq → OpenAI

### Phase 3: Sovereign Deployment
1. Route all compliance-sensitive agents through local Nemotron
2. Keep Claude API for complex orchestration / tool-use-heavy workflows
3. Document in `AGENTS.md` and update `DWS_SECURITY_STANDARD.md`

## Verdict

**Strong YES — evaluate immediately.**

Nemotron-3-Super is arguably the best-matched open model for DWS6:
- Built for the exact GPU hardware DWS already owns (Blackwell)
- 12B active params = fast inference with expert-quality output
- Open weights = EU data sovereignty
- Best-in-class agentic reasoning scores
- Eliminates recurring API costs
- 1M context for regulatory document analysis

The only model that better matches DWS's Veriton GN100 would be one NVIDIA trained specifically for it — and that's essentially what this is.

## Sources
- NVIDIA Technical Blog: https://developer.nvidia.com/blog/introducing-nemotron-3-super-an-open-hybrid-mamba-transformer-moe-for-agentic-reasoning/
- NVIDIA NIM Model Card: https://build.nvidia.com/nvidia/nemotron-3-super-120b-a12b/modelcard
- NVIDIA Research: https://research.nvidia.com/labs/nemotron/Nemotron-3-Super/
- Technical Report: https://research.nvidia.com/labs/nemotron/files/NVIDIA-Nemotron-3-Super-Technical-Report.pdf
- HuggingFace: https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-FP8

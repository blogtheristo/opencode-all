# Jev-KYA Synthetic Learning — DeepSeek V4 Flash Distillation + NVIDIA Integration

**Date:** 2026-09-20  
**Type:** Breakthrough / Architecture Plan  
**Status:** Research Complete, Ready for HIC Decision

## Breakthrough: DeepSeek V4 Flash Distillation

- **Source model:** DeepSeek-V4 Flash (157 GB weights)
- **Target:** 4B parameter classifier
- **Method:** Knowledge distillation (26 hours on DGX Spark)
- **Results:**
  - 20× smaller (157 GB → ~8 GB)
  - 22 ms inference per decision (acceptable for real-time KYA gates)
  - Outperforms teacher on quick-response classification (unexpected — teacher was overparameterized)

## Why This Matters

Current jev-kya makes typed decisions (Choice/Score/Boolean) via full-size LLM + KYA gating. This distilled model enables:

- Local inference (edge devices, offline)
- Sub-25ms latency (improves agent responsiveness)
- 20× lower cost per inference
- Sovereign deployment (no cloud API calls for decisions)

## NVIDIA Integration Plan (9 weeks, 4.5 FTE)

### Phase 1: Assess NVIDIA Options (1 week)

- NeMo Synthetic Data (generate labeled training pairs)
- TensorRT-LLM (optimize inference to 5–15 ms)
- Llama-Index Synthetic Generator (match jev-kya schema)

### Phase 2: Synthetic Data Pipeline (2 weeks)

- Generate 10K labeled jev-kya examples using teacher model + NVIDIA NeMo
- Validate consistency; filter by confidence

### Phase 3: Distillation Optimization (2 weeks)

- Hyperparameter tuning (temperature, knowledge factor)
- Optional: INT8 quantization (8 GB → 2 GB, < 25 ms latency)
- Optional: smaller teacher experiment (Mistral 7B, faster training)

### Phase 4: Jev-KYA Integration (2 weeks)

- Add `model` choice to AgentRuntimeContext
- Implement `DistilledKyaDecider` class (local inference)
- Calibration study (measure ECE; update to "distilled-calibrated" if < 0.10)

### Phase 5: Deployment (2 weeks)

- Staging: 10% traffic to distilled model
- Canary: 50% traffic (if metrics green)
- Production: 100% rollout (claude-opus fallback)

## Success Metrics

| Metric                | Target           |
| --------------------- | ---------------- |
| Latency (p99)         | < 25 ms          |
| Accuracy              | ≥ 98% of teacher |
| Calibration (ECE)     | < 0.10           |
| Cost per 1K decisions | ≤ $0.01          |
| Uptime                | ≥ 99.9%          |

## Go/No-Go Decisions Pending

1. Proceed with full NVIDIA integration plan, or defer to after calibration study (2026-10)?
2. Phase 1 architect assignment (1 week proof-of-concept)
3. DGX Spark allocation (40–50 GPU-hours for distillation tuning)
4. Synthetic label source (OpenAI gpt-4 vs. Claude Opus vs. internal)

## References

- Full technical plan: `docs/field-notes/2026-09-20-jev-kya-synthetic-learning-nvidia-integration.md`
- Current jev-kya: `src/agents/kya-jev.ts`
- Calibration note: `docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`
- Xerial LEO: https://xerial.org/leo/

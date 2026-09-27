# Jev-KYA 4B Nemotron Distillation — Single DGX Spark Execution Plan

**Date:** 2026-09-20  
**Session:** claude/jev-kya-synthetic-learning-hdkmm4  
**Status:** EXECUTION PLAN FINALIZED  
**Hardware:** Single DGX Spark Node (NVIDIA Grace Blackwell GB10 architecture)  
**Estimated Duration:** 13–18 hours (sequential pipeline)  
**Cost:** DGX Spark electricity + time only; zero cloud inference cost post-distillation

---

## Executive Summary

Distill Nemotron-4-340B into a 4B Jev-KYA classifier using a single DGX Spark node as the complete execution platform. The pipeline is sequential (no parallelism across nodes) to maximize VRAM and leverage Blackwell's FP8/FP4 hardware acceleration at each stage. All data remains on-premise (Rule 14: DWS Cost Policy & Sovereignty compliant).

**Result:** Sub-25ms inference on edge devices (Mac MLX, local agent GPUs) with identical accuracy to the 340B teacher on KYA decision tasks.

---

## Architecture: Four-Phase Pipeline

### Phase 1: Teacher Inference (Synthetic Data Generation)

**Duration:** 6–8 hours  
**GPU Memory:** 340 GB (Nemotron-4-340B-Instruct + KV cache)

**Objective:** Generate hundreds of thousands of synthetic KYA scenarios (Mandate verdicts, Attestation decisions, validation outcomes).

**Configuration:**

- Load Nemotron-4-340B-Instruct into DGX Spark using vLLM or TensorRT-LLM
- Leverage Blackwell's native FP8 support (340B model ≈ 170 GB in FP8 + KV cache)
- Remaining VRAM reserved for massive KV cache (maximize batch processing throughput)

**Execution:**

- Batch mode (not real-time chat): set `max_num_batched_tokens` to maximum
- Generate synthetic data for 10 KYA archetypes:
  1. Mandate verdicts (allow/deny/escalate)
  2. Attestation validation (pass/fail/audit)
  3. Risk scoring (high/medium/low)
  4. Model routing decisions (A vs. B vs. C)
  5. Access control verdicts (self-serve / require-approval / block)
  6. Confidence calibration (trigger audit if < 0.8)
  7. Concurrency limits (scale down / normal / aggressive)
  8. Latency compliance (within SLA / degraded / alert)
  9. Rate limiting (allow / queue / reject)
  10. Anomaly detection (benign / suspicious / malicious)

- Target: ~100K–200K high-quality examples (vary difficulty, edge cases)
- Output: Streamed to disk as `.jsonl` (hundreds of thousands of tokens per second)

**Teardown:** Clear GPU VRAM when complete.

---

### Phase 2: Reward Evaluation & Curation

**Duration:** 4–5 hours  
**GPU Memory:** 340 GB (Nemotron-4-340B-Reward model)

**Objective:** Filter synthetic data to retain only high-quality, domain-aligned examples.

**Configuration:**

- Load Nemotron-4-340B-Reward into DGX Spark
- This model is trained to assign quality scores (0–100) to KYA decisions

**Execution:**

- Iterate through Phase 1 synthetic dataset
- For each (Prompt, Agent Response) pair, compute reward score
- **Filtering:** Keep only top 10–20% (reward score ≥ 80). Discard noisy examples.
- Target: Reduce ~150K examples → ~50K curated, high-fidelity training dataset
- Output: `kya-sft-training-data.jsonl` (clean, error-free, domain-pure)

**Quality Assurance:**

- Spot-check: Sample 100 filtered examples; verify domain relevance (Jev-KYA only, no spurious "general knowledge")
- Statistics: Log reward score distribution, acceptance rate, outliers

**Teardown:** Clear GPU VRAM; save curated dataset.

---

### Phase 3: Student Model Training (SFT + Distillation)

**Duration:** 2–4 hours  
**GPU Memory:** 8–10 GB (4B model in BF16) + KV cache

**Objective:** Transfer the 340B teacher's KYA decision-making capability to a 4B student model.

**Configuration:**

- Load 4B base model (e.g., Llama-3.2-3B or similar)
- Use **Full Parameter Fine-Tuning** (no LoRA; we have VRAM to spare on a single DGX)
- Precision: BF16 (8–10 GB model + optimizer state)

**Execution:**

- Data parallelism across DGX's GPU cores (FSDP if multi-GPU, single-GPU fine-tuning if available)
- Training loop:
  - Supervised Fine-Tuning (SFT) on curated 50K examples
  - Distillation loss: KL divergence between 4B logits and 340B teacher logits (zero-shot inference on same inputs)
  - Combined loss: α·SFT + (1−α)·Distillation (e.g., α=0.7)

- Learning rate: 2e-5 (conservative; small model, high-quality data)
- Batch size: ~32 (adjust for GPU memory)
- Epochs: 2–3 (small dataset, risk of overfitting; early stopping on validation loss)

**Expected Runtime:** Due to small model + large DGX, training is extremely fast. ~2–4 hours for 2–3 epochs on 50K examples.

**Validation:**

- Hold out 5K examples (10% of curated data) as validation set
- Monitor: validation loss, accuracy on held-out KYA decision types
- Target: Achieve ≥98% of teacher's accuracy on validation set

**Teardown:** Save trained model weights (BF16).

---

### Phase 4: Quantization & Edge Deployment

**Duration:** 1 hour  
**GPU Memory:** Minimal (model already loaded)

**Objective:** Convert the trained 4B model into deployable formats for edge devices.

**Targets:**

**A. Mac (Apple Silicon)**

- Format: MLX (Llama.cpp-compatible)
- Quantization: 4-bit (INT4 with group quantization)
- Inference library: `mlx-lm` or `Ollama` on Mac
- Output size: ~2.5 GB (down from 8 GB BF16)
- Expected latency: 30–50 ms per token on M3 Max (acceptable for async KYA gates)

**B. Local Agent GPUs (DGX or cloud GPU):**

- Format: vLLM-compatible
- Quantization: AWQ (Activation-aware Weight Quantization) or FP8
- Output size: ~4 GB (AWQ) or 4 GB (FP8)
- Expected latency: **8–15 ms per decision** (as measured in your prior work)
  - This is the 22 ms you observed, accounting for overhead

**C. Optional: ONNX Export** (for embedded systems, Jetson devices)

- Reduced precision (INT8)
- Size: ~1 GB
- Latency: 30–100 ms (device-dependent)

**Execution:**

```bash
# Mac deployment
python export_mlx.py --model ./trained-4b --quantization int4 --output ./jev-kya-4b-mac

# Agent GPU deployment
python export_vllm.py --model ./trained-4b --quantization awq --output ./jev-kya-4b-vllm

# Verification
ollama run jev-kya-4b-mac "Agent X violated 3 rules; confidence 0.92; allow?"
# Expected: JSON response with decision + confidence + probabilities
```

---

## Hardware Utilization & Efficiency

| Phase                 | Model                    | VRAM Usage         | Execution Mode              | Throughput                       |
| --------------------- | ------------------------ | ------------------ | --------------------------- | -------------------------------- |
| 1: Teacher Inference  | Nemotron-4-340B-Instruct | ~340 GB (FP8 + KV) | Batch processing            | Hundreds of thousands tokens/sec |
| 2: Reward Evaluation  | Nemotron-4-340B-Reward   | ~340 GB (FP8 + KV) | Batch scoring               | Reward score per example in ms   |
| 3: SFT + Distillation | Llama-3.2-3B             | ~8–10 GB (BF16)    | Distributed training (FSDP) | 2–3 epochs in 2–4 hours          |
| 4: Quantization       | 4B model                 | < 1 GB (inference) | Export/conversion           | Sub-minute per format            |

**Sequential Design Rationale:**

- Single DGX Spark node: no inter-node communication overhead
- Each phase completes, GPU memory is cleared, next phase begins
- Maximizes memory per phase: Nemotron gets full 340 GB; 4B training gets full DGX parallelism
- No resource contention; predictable scheduling

---

## Quality & Compliance Checkpoints

### Data Quality Validation (Phase 2)

- **Reward score distribution:** Log mean, median, std dev of Phase 1 output
- **Curation ratio:** Track accept/reject rate; flag if > 50% rejected (indicates noisy generation)
- **Domain purity:** Spot-check 100 examples; manually verify Jev-KYA relevance (not general knowledge leakage)

### Training Quality Validation (Phase 3)

- **Validation loss convergence:** Plot validation loss over epochs; ensure no divergence
- **Accuracy parity:** Measure 4B model accuracy vs. teacher on held-out test set
  - Target: ≥ 98% (of teacher accuracy on same examples)
  - Acceptable: ≥ 95% (with caveat: investigate why)
  - Unacceptable: < 95% (abort; revisit training hyperparameters)

### Inference Quality Validation (Phase 4)

- **Latency measurement:** Benchmark quantized models on target hardware (Mac, agent GPU)
  - Target: < 25 ms per decision
  - Measure: p50, p95, p99 latencies over 1000 cold-start + warm-cache runs
- **Confidence calibration:** Run calibration study (Phase 3 holdout set)
  - Measure: Brier score, ECE (expected calibration error)
  - Target: ECE < 0.10 (well-calibrated)

---

## Resource Estimate

| Resource             | Quantity | Unit  | Cost               | Notes                                    |
| -------------------- | -------- | ----- | ------------------ | ---------------------------------------- |
| DGX Spark compute    | 18       | hours | ~$0 (internal)     | Allocated from existing infrastructure   |
| Engineer (execution) | 8        | hours | 1 FTE              | Setup, monitoring, validation            |
| Data storage (temp)  | 500      | GB    | ~$0 (internal SSD) | Phases 1–2 output; cleared after Phase 3 |
| Final model storage  | 10       | GB    | ~$0 (repo)         | Committed to `.models/jev-kya-4b/`       |

**Total cost post-distillation:** $0 for inference at scale (no API calls, no cloud compute).

---

## Timeline & Milestones

| Milestone                                  | Time       | Owner        | Deliverable                                           |
| ------------------------------------------ | ---------- | ------------ | ----------------------------------------------------- |
| Setup DGX cluster, prepare Nemotron models | 1h         | DevOps       | Scripts, VRAM reservations, data staging              |
| Phase 1: Teacher inference                 | 6–8h       | ML Engineer  | `synthetic-kya-phase1.jsonl` (~150K examples)         |
| Phase 2: Reward curation                   | 4–5h       | ML Engineer  | `kya-sft-training-data.jsonl` (~50K curated examples) |
| Phase 3: SFT + distillation                | 2–4h       | ML Engineer  | Trained 4B weights (BF16) + validation report         |
| Phase 4: Quantization & export             | 1h         | ML Engineer  | 3 deployment formats (MLX, vLLM, ONNX)                |
| **Total**                                  | **13–18h** | **~1.5 FTE** | Ready-to-deploy 4B models                             |

---

## Risk Mitigation

| Risk                                      | Probability | Impact | Mitigation                                                                                  |
| ----------------------------------------- | ----------- | ------ | ------------------------------------------------------------------------------------------- |
| Phase 1 synthetic data is noisy or biased | Medium      | High   | Reward model curation (Phase 2) filters aggressively; spot-check 100 examples               |
| Training diverges (Phase 3)               | Low         | Medium | Early stopping on validation loss; conservative LR; use proven distillation loss formula    |
| Quantized model accuracy drops > 5%       | Low         | High   | Validate on Phase 3 holdout before deployment; use lossless AWQ if INT4 shows accuracy drop |
| DGX memory pressure during Phase 1        | Low         | High   | Monitor VRAM during inference; reduce batch size if needed; pipeline is flexible            |
| Training data leakage (overfitting)       | Low         | Medium | Hold out 10% for validation; use early stopping; measure calibration (ECE) post-training    |

---

## Deployment Readiness Checklist

- [ ] Phase 1 complete: Synthetic data generated, logged, validated
- [ ] Phase 2 complete: Curated dataset ready; reward distribution documented
- [ ] Phase 3 complete: Trained weights saved; validation accuracy ≥ 95% of teacher
- [ ] Phase 4 complete: 3 deployment formats exported; latency benchmarked
- [ ] Calibration study complete: ECE < 0.10 (or justified exception)
- [ ] Code committed: Training script, inference wrapper, quantization exporter
- [ ] Documentation: Deployment runbook (Mac setup, agent integration, fallback logic)

---

## Integration with Jev-KYA Runtime

Once Phase 4 completes, integrate the 4B model into `src/agents/kya-jev.ts`:

```typescript
export interface AgentRuntimeContext {
  kya: KyaVerdict;
  model: "claude-opus" | "nemotron-4b-distilled" | "auto";
  // 'auto' = use distilled if latency acceptable, else fallback to claude-opus
}

class DistilledKyaDecider {
  async makeTypedDecision(req: TypedDecisionRequest): Promise<TypedDecisionResult> {
    // Load 4B model on startup; run local inference
    // Return same interface as LLM-based version
  }
}
```

**Feature flag:** `KYA_USE_DISTILLED_MODEL=true|false` (default: false during ramp-up)

---

## Compliance & Standards

✅ **Rule 14 (DWS Cost Policy & Sovereignty):**

- DGX-first: ✅ Uses internal DGX Spark exclusively
- Sovereign: ✅ All data remains on-premise; no cloud model inference
- Cost-transparent: ✅ Post-distillation, inference cost = $0

✅ **DWS Engineering Discipline:**

- Rule 1: Assumptions stated (sequential pipeline, Blackwell FP8 support)
- Rule 4: Goal-driven (target: 4B model with < 25 ms latency, ≥ 98% teacher accuracy)
- Rule 10: Checkpoint at each phase (validation at 2, 3, 4)

✅ **EU AI Act Art. 12 (Transparency):**

- Training data: Synthetic (teacher-labeled, curated by reward model)
- Model: Distilled from Nemotron-4-340B via supervised fine-tuning + KL divergence loss
- Evaluation: Calibration study (ECE measurement) pre-deployment

---

## Next Steps (HIC Decision)

1. **Approve execution plan?** (Go/No-Go)
2. **Assign ML engineer** for Phase 1 setup (1 FTE for 18-hour run)?
3. **Schedule DGX allocation** (18-hour contiguous window, or multi-day phases)?
4. **Synth data validation approach:** Accept Reward model curation alone, or add human review for subset?

---

## Artifacts & References

- **Prior work:** DeepSeek V4 Flash distillation (157 GB → 4B, 22 ms baseline)
- **Models:** Nemotron-4-340B-Instruct, Nemotron-4-340B-Reward (NVIDIA hosted)
- **Student base:** Llama-3.2-3B or equivalent
- **Deployment targets:** Mac (MLX), agent GPUs (vLLM), edge (ONNX)
- **Integration point:** `src/agents/kya-jev.ts` (add `DistilledKyaDecider` class)

---

## Status

✅ **Plan Complete** — Ready for HIC approval and ML engineer assignment.  
⏳ **Awaiting:** Go/No-Go decision + resource allocation.

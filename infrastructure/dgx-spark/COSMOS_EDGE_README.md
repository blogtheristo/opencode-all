# Cosmos 3 Edge — DWS LWM Learning Loop on DGX Spark

**Status:** Implementation Phase 1 (Governance + RL Loop)  
**Date:** 2026-08-28  
**Target Hardware:** Acer Veriton GN-100 (NVIDIA Grace Blackwell, 128GB unified memory)

---

## Overview

Cosmos 3 Edge (4B Mixture-of-Transformers) runs as the foundational physical world model on DGX Spark, enabling:

1. **Edge Inference** — Real-time trajectory generation from proprietary fleet observations
2. **KYA Governance** — Safety audit of all generated trajectories before execution
3. **Private Evals** — Continuous drift detection on proprietary fleet data (never leaves DGX Spark)
4. **RL Adaptation Loop** — GRPO/PPO optimization on operational data for continuous improvement

**This is the strategic asset:** Not a 55B pretrain (cloud workload), but the **learning loop** that owns and adapts to proprietary fleet dynamics.

---

## Architecture

```
DGX Spark (Edge Node, 128GB unified)
├── Cosmos 3 Edge Service (vLLM-Omni, port 8000)
│   ├── Observation → Action trajectory generation
│   └── API: /predict, /batch_predict
├── KYA Governance Layer
│   ├── Trajectory audit (velocity, acceleration, spatial bounds)
│   └── Safety constraints enforcement
├── Private Eval Framework (Qdrant vector store)
│   ├── Trajectory MSE (vs ground truth)
│   ├── Action divergence (vs expert)
│   └── Policy alignment (KYA compliance)
└── RL Training Loop
    ├── Rollout collection (from Cosmos 3 Edge API)
    ├── Composite reward: task + safety + eval feedback
    ├── Policy optimization (GRPO pattern)
    └── Checkpoint persistence
```

---

## Quick Start

### 1. Prerequisites

```bash
# On DGX Spark
docker --version     # Docker 20+
docker-compose --version  # Compose 2+
nvidia-smi            # NVIDIA driver + CUDA toolkit
```

### 2. Start the Stack

```bash
cd /home/admin100/dws6/infrastructure/dgx-spark

# Launch all services
docker-compose -f docker-compose.cosmos-edge.yml up -d

# Verify services
docker-compose -f docker-compose.cosmos-edge.yml ps

# Check Cosmos 3 Edge is healthy
curl http://localhost:8000/health
```

### 3. Test Inference

```bash
# Generate a trajectory
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "observation": [[0.1, 0.2, 0.3], [0.4, 0.5, 0.6]],
    "context": {"task": "reach", "target": [0.5, 0.5, 0.5]},
    "num_steps": 10
  }'
```

### 4. Run Training Loop

```bash
# RL training on proprietary fleet data
docker-compose -f docker-compose.cosmos-edge.yml exec rl_trainer \
  python3 src/rl_loop.py --num-steps 100

# Monitor logs
docker-compose -f docker-compose.cosmos-edge.yml logs -f rl_trainer
```

---

## Component Details

### Cosmos 3 Edge Service (`src/serve_cosmos_edge.py`)

**Exposes:**

- `GET /health` — Model status, GPU memory, call count
- `POST /predict` — Generate single trajectory from observation
- `POST /batch_predict` — Batch trajectory generation
- `GET /status` — Detailed service status

**Environment:**

```bash
COSMOS_MODEL_PATH=/workspace/models/cosmos-3-edge-4b
CUDA_VISIBLE_DEVICES=0
VLLM_TENSOR_PARALLEL_SIZE=1
```

**Input/Output:**

- Input: Observation (visual or state tensor), context dict
- Output: Trajectory array (timesteps × action_dim), ID, timestamp

---

### KYA Governance (`governance/kya_enforcer.py`)

**Enforces:**

1. **Velocity limits** — `max_velocity: 2.5 m/s`
2. **Acceleration limits** — `max_acceleration: 5.0 m/s²`
3. **Spatial bounds** — Workspace min/max (configurable)
4. **Forbidden zones** — No-go regions for safety

**Usage:**

```python
from governance.kya_enforcer import KYAGovernanceEngine

kya = KYAGovernanceEngine()
audit = kya.audit_rollout(trajectory, goal_context)

if audit.approved:
    # Safe to execute
    execute_trajectory(trajectory)
else:
    # Log violations
    print(f"Violations: {audit.violations}")
```

**Config:**

```json
{
  "max_velocity": 2.5,
  "max_acceleration": 5.0,
  "workspace_min": [-1.0, -1.0, 0.0],
  "workspace_max": [1.0, 1.0, 2.0],
  "forbidden_zones": [{ "center": [0, 0, 1.5], "radius": 0.3 }]
}
```

---

### Private Evals (`evals/private_eval_runner.py`)

**Three Eval Types:**

1. **Trajectory MSE** — Prediction error vs ground-truth state transitions
   - Threshold: MSE < 0.05
   - Data source: Proprietary fleet (never exported)

2. **Action Divergence** — Predicted actions vs expert demonstrations
   - Threshold: L2 distance < 0.10
   - Detects distribution shift in Cosmos 3 Edge outputs

3. **Policy Alignment** — RL policy compliance with KYA boundaries
   - Threshold: 95%+ approval rate
   - Flags unsafe RL updates before deployment

**Usage:**

```python
from evals.private_eval_runner import Cosmos3EdgeEvaluator

evaluator = Cosmos3EdgeEvaluator()
result = evaluator.evaluate_world_dynamics(test_episodes)
print(f"Status: {result.status} (MSE: {result.metric_value:.4f})")

summary = evaluator.get_eval_summary()
evaluator.dump_results_to_file("/workspace/checkpoints/evals_latest.json")
```

---

### RL Training Loop (`src/rl_loop.py`)

**Algorithm:**

1. **Collect** 32 trajectories from Cosmos 3 Edge
2. **Audit** each trajectory via KYA
3. **Evaluate** using private evals
4. **Reward** = task_reward + safety_bonus + eval_bonus
5. **Optimize** policy using GRPO pattern
6. **Checkpoint** training state

**Reward Composition:**

```
composite_reward = task_reward (0-1)
                 + safety_bonus (KYA approval → +1.0, else -10.0)
                 + eval_bonus (0-5 from eval pass rate)
```

**Usage:**

```bash
python3 src/rl_loop.py \
  --cosmos-url http://cosmos_edge_engine:8000 \
  --eval-store-url http://eval_store:6333 \
  --learning-rate 1e-5 \
  --episodes-per-step 32 \
  --num-steps 100 \
  --checkpoint /workspace/checkpoints/rl_latest.json
```

**Output:**

```json
{
  "total_steps": 100,
  "final_loss": 0.042,
  "mean_reward": 0.65,
  "kya_approval_rate": 0.94,
  "last_10_steps": [...]
}
```

---

## Monitoring & Observability

### Logs

```bash
# Service logs
docker-compose -f docker-compose.cosmos-edge.yml logs cosmos_edge_engine

# RL training progress
docker-compose -f docker-compose.cosmos-edge.yml logs rl_trainer

# All services
docker-compose -f docker-compose.cosmos-edge.yml logs -f
```

### Prometheus Metrics (port 9090)

```
http://localhost:9090/graph?query=cosmos_inference_latency_ms
```

Available metrics (placeholder):

- `cosmos_inference_latency_ms` — Time to generate trajectory
- `kya_violations_total` — Total KYA audit failures
- `rl_training_loss` — Policy loss per step
- `eval_pass_rate` — % of evals passing

### Qdrant Vector Store (port 6333)

Private eval results stored as vectors for drift detection:

```bash
curl http://localhost:6333/health
curl http://localhost:6333/collections
```

---

## Data Isolation & Security

**Proprietary Fleet Data:**

- Lives at `/mnt/data` (persistent DGX Spark mount)
- Never exported from DGX Spark
- Private evals run locally; results stay local
- RL loop adapts to this data only

**Credentials:**

- Model weights: `COSMOS_MODEL_PATH` (local)
- Eval data: `/mnt/data` (mounted, not in container registry)
- No external API keys required (self-hosted stack)

---

## Troubleshooting

### Service won't start

```bash
# Check GPU availability
nvidia-smi

# Check ports are free
netstat -tuln | grep 8000

# Full service logs
docker-compose -f docker-compose.cosmos-edge.yml logs cosmos_edge_engine
```

### RL training stuck

```bash
# Check RL trainer health
docker-compose -f docker-compose.cosmos-edge.yml logs rl_trainer --tail 50

# Verify Cosmos 3 Edge API is responding
curl http://localhost:8000/status

# Verify eval store is up
curl http://localhost:6333/health
```

### High policy loss / low rewards

1. Check KYA config is not too restrictive
2. Verify eval data is representative (not garbage-in)
3. Try increasing learning rate: `--learning-rate 5e-5`
4. Check composite reward formula (may need tuning)

---

## Next Steps

### Phase 2 (Future)

- [ ] Load actual Cosmos 3 Edge 4B model weights (vLLM)
- [ ] Integrate with real fleet data pipeline
- [ ] Add multi-GPU scaling (if moving to larger models)
- [ ] Publish checkpoint format (for model versioning)
- [ ] Add rollback mechanism (revert to previous RL checkpoint)

### Phase 3 (Future)

- [ ] Distributed RL (multiple DGX Spark nodes)
- [ ] Online adaptation (live fleet data ingestion)
- [ ] A/B testing framework (compare policy versions)
- [ ] Formal verification (prove KYA compliance)

---

## References

- **LWM Lab Note:** `docs/lab-notes/2026-07-26-lwm-training-hardware-reality.md`
- **DGX Spark Setup:** `infrastructure/dgx-spark/README.md`
- **KYA Governance:** `DWS_SECURITY_STANDARD.md` (article 12-14)
- **Fleet Data:** Contact Risto (risto.paarni@lifetime.fi) for proprietary dataset access

---

## Support

For issues or questions:

1. Check logs: `docker-compose logs -f`
2. Verify components: `docker-compose ps`
3. Test manually: `curl http://localhost:8000/health`
4. Contact: DWS infrastructure team

---

**Last Updated:** 2026-08-28  
**Maintainer:** Claude Code (Anthropic, v4.5)  
**License:** Proprietary (Lifetime Oy)

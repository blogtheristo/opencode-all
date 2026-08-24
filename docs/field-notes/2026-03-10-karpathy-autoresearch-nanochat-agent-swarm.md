# Karpathy Autoresearch: Agent Swarms Tuning Neural Networks Autonomously

**Date:** 2026-03-10
**Author:** Risto Anton
**Type:** Competitive Intelligence / AI Research / Product Implication
**Context:** Andrej Karpathy, nanochat, autoresearch, agent swarm optimization, DWS IQ KYA Standard

---

## Summary

Andrej Karpathy reported (March 7, 2026) that he left an "autoresearch" agent running for ~2 days on his nanochat project (depth=12 model). The agent autonomously found ~20 changes that improved validation loss. All improvements were additive and transferred to larger (depth=24) models. Stacking all changes, the "Time to GPT-2" leaderboard metric dropped from 2.02 hours to 1.80 hours — an **11% improvement**.

This is the first public demonstration of a single agent autonomously replicating the iterative optimization workflow that ML researchers do manually: hypothesize → implement → evaluate → iterate.

## The Story

Karpathy described his autoresearch setup:

- **Task:** Tune nanochat training (a small GPT-2 reproduction project)
- **Method:** Agent runs autonomously at `depth=12` (small model), iterating through ~700 changes
- **Duration:** ~2 days unattended
- **Result:** ~20 changes that improved validation loss, all additive
- **Transfer:** Improvements transferred to larger `depth=24` models
- **Metric:** "Time to GPT-2" dropped 2.02h → 1.80h (11% improvement)

### Specific Findings by the Agent

1. **QKnorm scaler missing** — Karpathy's parameterless QKnorm didn't have a scaler multiplier, making attention too diffuse. The agent found multipliers to sharpen it.
2. **Value Embeddings regularization gap** — Value Embeddings needed regularization that wasn't being applied.
3. **Banded attention too conservative** — Parameters hadn't been tuned after initial implementation.
4. **AdamW betas misconfigured** — Optimizer hyperparameters were suboptimal.
5. **Weight decay schedule** — Agent found better weight decay scheduling.
6. **Network initialization** — Agent tuned initialization parameters.

### The Bigger Picture (Karpathy's Words)

> "All LLM frontier labs will do this. It's the final boss battle. It's a lot more complex at scale of course - you don't just have a single train.py file to tune. But doing it is 'just engineering' and it's going to work."

The scaling path:
1. Spin up a swarm of agents
2. Have them collaborate to tune smaller models
3. Promote the most promising ideas to increasingly larger scales
4. Humans (optionally) contribute on the edges

> "Any metric you care about that is reasonably efficient to evaluate (or that has more efficient proxy metrics such as training a smaller network) can be autoresearched by an agent swarm."

## The Insight

### For DWS IQ / KYA Standard

This is directly applicable to KYA parameter optimization. The KYA Standard v1.2 now includes an **Autoresearch Optimization Protocol** (Section 10) based on this methodology.

**KYA parameters that can be autoresearched:**
- Agent Trust Score (ATS) weights (violation, latency, denied access)
- Trust recovery rates
- Session TTL schedules
- Sandbox boot optimization
- Egress whitelist tuning
- False-positive rate vs breach detection trade-off

**The proxy metric pattern applies:** tune on synthetic KYA sessions (cheap, fast) → validate on staging with real traffic → promote to production. Same as Karpathy's depth=12 → depth=24 transfer.

### For the AI Industry

This marks the transition from "AI assists humans" to "AI optimizes AI." Key implications:

1. **Manual hyperparameter tuning is a dying skill** — Agents will handle iterative optimization faster and more thoroughly than humans
2. **Frontier labs are already doing this** — Karpathy confirms all major labs will adopt agent-driven research
3. **Multi-agent collaboration is the next step** — Karpathy is already working on parallelism across multiple agents
4. **The "final boss battle"** — This is the endgame for AI capability scaling: AI systems that improve themselves

### For Product Strategy

Any DWS IQ metric that can be efficiently evaluated is a candidate for agent swarm optimization:
- Carbon calculation accuracy (vs manual auditor results)
- Compliance report generation time
- ERP integration latency
- Customer satisfaction prediction accuracy
- Agent trust score calibration

## Source

Andrej Karpathy, X/Twitter post, ~March 7, 2026.
Commit: github.com/karpathy/nanochat (autoresearch round 1)

## Next Steps

- [x] Incorporate autoresearch methodology into KYA Standard v1.2 (Section 10)
- [ ] Design synthetic KYA session generator for parameter optimization
- [ ] Evaluate Claude agent swarm for KYA ATS weight tuning
- [ ] Benchmark: manual ATS tuning vs autoresearch agent on false-positive rate
- [ ] Explore multi-agent collaboration for parallel KYA parameter search

## Ontology Tags

- **Geography:** Global (AI Research), Europe > Finland (DWS IQ application)
- **Sector:** Technology > AI Research > Autonomous Optimization > Agent Swarms
- **Entities:** Andrej Karpathy, nanochat, GPT-2, Lifetime Oy, DWS IQ 6, KYA Standard
- **Temporal Context:** 2026-Q1
- **Confidence:** High (public post by primary researcher, code committed)

---

**Source:** Karpathy X post, March 2026 | github.com/karpathy/nanochat

<!-- Evidence: Tool=OpenCode 1.18.22 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-26 -->

# Field Note — GLM-5.3-Flash Release Analysis

**Date:** 2026-08-26  
**Source:** Z.ai announcement via @Z_ai  
**Status:** Released, available via Z.ai first-party API  
**Model:** GLM-5.3-Flash (320B total params, 18B active)  
**License:** MIT  

---

## Key Metrics

| Metric | GLM-5.3-Flash | GLM-5.3 (max) | GPT-5.6 Terra | Muse Spark 1.2 |
|--------|---------------|---------------|---------------|----------------|
| **Artificial Analysis Intelligence Index** | 57 | 60 | 60 | 57 |
| **Cost per Task (Intelligence Index)** | $0.09 | $0.68 | $0.51 | $0.40 |
| **Output Tokens (Intelligence Index)** | 149M | 168M | - | 133M/136M |
| **Reasoning Tokens** | 134M (90%) | - | - | - |
| **AA-Omniscience Score** | 28% | 34% | 47% | - |
| **Hallucination Rate** | 28% | 30% | - | - |
| **GDPval-AA v2 Elo** | 1770 | 1770 | - | - |
| **Terminal-Bench v2.1** | 84.3% | 83.9% | - | - |
| **τ³-Banking** | 47.2% | 50.3% | - | - |

## Pricing (Z.ai First-Party API)

| Tier | Price |
|------|-------|
| Input tokens | $0.15 / 1M |
| Output tokens | $0.50 / 1M |
| Cached input tokens | $0.026 / 1M (80% discount) |
| Cost per Task (Intelligence Index) | $0.09 |

## Technical Specifications

- **Total Parameters:** 320B
- **Active Parameters:** 18B (MoE architecture)
- **Context Window:** 400k tokens
- **Reasoning Modes:** Low / High / Max
- **License:** MIT
- **Access:** Z.ai first-party API (available at launch)

## Key Findings

1. **Pareto Optimal:** Sits on the Intelligence vs. Cost per Task Pareto frontier — ~7.5x lower cost per task than GLM-5.3 max (57 vs 60 intelligence, 7.5x cheaper per task).

2. **Competitive Positioning:** Ties GPT-5.6 Terra and Muse Spark 1.2 on intelligence (57) while costing ~5.7x and ~4.4x less per task respectively.

3. **Reasoning Heavy:** 90% of output tokens are reasoning tokens (134M of 149M total on Intelligence Index).

4. **Token Efficiency:** Less token-efficient than peers (149M vs 133M/136M for Kimi K3/Qwen3.8), but low per-token cost keeps cost-per-task low.

5. **Agentic Performance:** Matches GLM-5.3 on GDPval-AA v2 (Elo 1770) and Terminal-Bench v2.1 (84.3% vs 83.9%). Trails by 3.1pp on τ³-Banking (47.2% vs 50.3%).

6. **Knowledge/Hallucination:** AA-Omniscience 28% (vs 34% GLM-5.3, 47% GPT-5.6 Terra). Hallucination rate 28% (improved from GLM-5.3's 30%).

## Strategic Implications for DWS

1. **Cost Arbitrage:** At $0.09/task vs $0.68 for GLM-5.3, GLM-5.3-Flash enables ~7.5x more agent work per dollar.

2. **Agent Workloads:** Strong on agentic benchmarks (GDPval, Terminal-Bench) — suitable for opencode-all batch worker tasks.

3. **MoE Efficiency:** 18B active / 320B total = 5.6% activation ratio enables cost-effective inference.

4. **MIT License:** Permissive for commercial use and modification.

5. **Context Window:** 400k tokens supports long-context agent workflows.

## Action Items

- [ ] Evaluate GLM-5.3-Flash for opencode-all batch worker (cost reduction)
- [ ] Test on poisoned-tree-gate / poisoned-tree-matrix test suites
- [ ] Evaluate for Themis agent (legal/compliance workloads)
- [ ] Add to model selector as "cost-optimized" option
- [ ] Benchmark on DWS-specific evals (poisoned-tree-matrix, agent-leverage)

## References

- Z.ai announcement: @Z_ai
- Artificial Analysis Intelligence Index
- Artificial Analysis Cost per Task Pareto frontier
- Z.ai API pricing page

---

**Field Note Status:** Complete  
**Next Review:** 2026-09-02 (one week)

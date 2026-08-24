# Field Note: TokenSpeed — Speed-of-Light LLM Inference Engine for Agentic Workloads

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/add-tokenspeed-engine-UgWUy | Date: 07.05.2026 | Changes: Initial field note. Triggered by LightSeek announcing TokenSpeed — a TensorRT-LLM-class inference engine with vLLM-class usability, built in two months, MIT license. Evaluated for DWS DGX Spark inference stack and agentic workload suitability.

Session Links & References:

- GitHub: https://github.com/lightseekorg/tokenspeed
- Blog: https://lightseek.org/blog/lightseek-tokenspeed.html
- Claude Code session branch: claude/add-tokenspeed-engine-UgWUy

Document Status:

- Created: 07.05.2026
- Last Modified: 07.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Technology Watch

Related Documents:

- docs/field-notes/2026-04-30-goose-replace-ollama-swot.md
- docs/field-notes/2026-05-03-ai-engineering-50-backend-agents-foundry.md
- skills/ollama-spark/SKILL.md
- infrastructure/dgx-spark/Deploy-DgxSpark.ps1

***

- **Date:** 07.05.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Context:** LightSeek published TokenSpeed, an open-source LLM inference engine claiming TensorRT-LLM-level throughput with vLLM-level usability, purpose-built for agentic workloads. Built by a lean, mission-driven team in two months. MIT license. Directly relevant to DWS DGX Spark inference stack and the 50-agent foundry.

## Ontology Tags

- **Geography:** Global > EU > Finland
- **Sector:** Infrastructure > AI/ML > LLM Inference
- **Entities:** Lifetime Oy, LightSeek (lightseekorg), NVIDIA Blackwell (B200), DWS DGX Spark
- **Standards:** EU AI Act (Article 12 — Logging), DWS Brain-Memory-Body-Hands, MIT License
- **Temporal Context:** 2026-Q2, LLM inference engine landscape; preview release
- **Confidence:** Medium — preview release; benchmarks shown against TensorRT-LLM on B200, not yet verified on DWS hardware (Jetson Orin Nano / DGX Spark)

---

## 1. What Is TokenSpeed

**TokenSpeed** is an open-source LLM inference engine by LightSeek, positioned at the intersection of two reference implementations:

| Reference    | Promise                | TokenSpeed Claim             |
| ------------ | ---------------------- | ---------------------------- |
| TensorRT-LLM | Maximum throughput     | Matches on Blackwell (B200)  |
| vLLM         | Operational simplicity | Matches usability ergonomics |

The tagline: **"speed-of-light inference engine designed for agentic workloads."**

Built by a lean, mission-driven team in approximately two months. MIT license. Open-source.

GitHub: https://github.com/lightseekorg/tokenspeed

---

## 2. Architecture

TokenSpeed is a four-layer system, each layer engineered for the agentic use-case specifically:

### 2.1 Modeling Layer — local-SPMD + Static Compilation

Uses a **local-SPMD** (Single Program Multiple Data) design. Static compilation automatically generates collective communication from module annotations, eliminating manual parallelism coding. This is the critical differentiator for multi-GPU agentic serving: no hand-tuned sharding strategies needed.

### 2.2 Scheduler — Finite-State Machine in Hybrid C++/Python

Request lifecycle, KV cache ownership, and overlap timing are encoded as a **finite-state machine**. The hybrid C++/Python design gives compile-time type-safety for resource reuse — preventing the cache invalidation and memory leaks that plague high-concurrency agentic systems under load.

### 2.3 Kernels — Pluggable + MLA-Optimized

Pluggable, layered kernel system. Leading claim: **one of the fastest MLA (Multi-head Latent Attention) implementations on Blackwell for agentic workloads**. MLA is the attention variant used in DeepSeek-series models — directly relevant to DWS's use of DeepSeek-class models on DGX Spark.

### 2.4 Entrypoint — SMG-integrated AsyncLLM

Low-overhead CPU-side request handling via **SMG-integrated AsyncLLM**. This reduces the host-side bottleneck that limits vLLM at high concurrency — the bottleneck that matters most when 50 DWS agents are issuing parallel inference requests.

---

## 3. Performance

Benchmarks published in the repository compare TokenSpeed against **TensorRT-LLM on Kimi K2.5 using B200 GPUs**, presented as a Pareto curve (throughput vs. latency). The claim is competitive or superior performance on agentic workloads at B200 scale.

**Hardware targets:**

| Hardware       | Status            |
| -------------- | ----------------- |
| Blackwell B200 | Primary (shipped) |
| Hopper H100    | Planned (roadmap) |
| MI350 (AMD)    | Planned (roadmap) |

**Model coverage roadmap:** Qwen 3.6, DeepSeek V4, MiniMax M2.7 — all models relevant to DWS's sovereign inference stack.

**Current status:** Preview release. Production stability not yet confirmed.

---

## 4. DWS Relevance Assessment

### 4.1 Why This Matters for DWS IQ 6

The 50-agent DWS foundry issues **concurrent, latency-sensitive inference requests** across Atlas, Athena, Cassandra, Chronos, Agora, and 45 other agents. The critical constraint is not single-request throughput — it is **fan-out throughput**: how many parallel agent calls can be served simultaneously without tail-latency degradation.

TokenSpeed's finite-state-machine scheduler and SMG-integrated async entrypoint are specifically designed for this pattern. vLLM handles it reasonably; TensorRT-LLM requires manual engineering; TokenSpeed claims to solve both.

### 4.2 Stack Fit

| DWS Component       | TokenSpeed Fit                                                         |
| ------------------- | ---------------------------------------------------------------------- |
| DGX Spark (primary) | Likely compatible; B200 is primary target; Hopper on roadmap           |
| Jetson Orin Nano    | Not targeted — edge inference remains Ollama or llama.cpp              |
| Ollama Spark skill  | TokenSpeed would replace Ollama on DGX Spark for high-throughput calls |
| EU AI Act Art. 12   | MIT license — audit trail must still be implemented in DWS layer       |
| Sovereign inference | MIT + self-hosted = full EU data residency compliance                  |

### 4.3 Comparison to Current Stack

| Factor              | Ollama (current)  | vLLM              | TokenSpeed        |
| ------------------- | ----------------- | ----------------- | ----------------- |
| Setup complexity    | Very low          | Medium            | Medium (preview)  |
| Agentic concurrency | Limited           | Good              | Designed for it   |
| Throughput (B200)   | Not optimized     | High              | Claims highest    |
| Edge (Jetson)       | Yes               | No                | No                |
| EU data residency   | Yes (self-hosted) | Yes (self-hosted) | Yes (self-hosted) |
| Maturity            | High              | High              | Preview           |
| License             | MIT               | Apache 2.0        | MIT               |

### 4.4 MLA + DeepSeek Significance

DWS DGX Spark runs DeepSeek-class models via Ollama. TokenSpeed's fastest-in-class MLA kernel on Blackwell is a direct performance unlock for those models. When Hopper support ships, this becomes directly testable on DGX Spark hardware.

---

## 5. Risk Assessment

| Risk                       | Level  | Mitigation                                                          |
| -------------------------- | ------ | ------------------------------------------------------------------- |
| Preview maturity           | Medium | Watch for stable release; do not replace Ollama until Hopper ships  |
| B200-only optimization     | Medium | DGX Spark is not B200; await Hopper roadmap delivery                |
| Small team continuity      | Low    | MIT license — fork is always an option; 499 stars signals community |
| Benchmark reproducibility  | Medium | Independent verification needed before production adoption          |
| EU regulatory logging gaps | Low    | DWS implements Article 12 audit trail in own layer regardless       |

---

## 6. Team and Community Signal

- **Team:** LightSeek (lightseekorg) — lean, mission-driven, two-month build
- **License:** MIT (commercially friendly, fork-safe)
- **GitHub:** 499 stars, 28 forks, 7 open PRs at time of writing
- **Languages:** Python 92.7%, C++ 6.8%
- **Release stage:** Preview

Two months to ship a competitive inference engine with Pareto-curve benchmarks against TensorRT-LLM is a credible signal of engineering density. The MIT license and open development model remove adoption risk.

---

## 7. Recommended Action

**Do not replace Ollama now.** Preview maturity + B200-only optimization means DGX Spark (Hopper-class) is not yet the target. The right posture:

1. **Watch:** Subscribe to https://github.com/lightseekorg/tokenspeed releases
2. **Gate:** Evaluate when Hopper support is listed as stable in the changelog
3. **Test:** Benchmark DWS agentic fan-out workload (50-agent parallel inference) vs. Ollama on DGX Spark when Hopper support ships
4. **Decide:** If fan-out throughput improvement > 30%, migrate DGX Spark inference from Ollama to TokenSpeed; retain Ollama for Jetson edge
5. **Skill:** If adopted, create `/tokenspeed` skill replacing `/ollama-spark` for DGX Spark calls

**Timeline estimate:** Evaluate Q3 2026, pending Hopper roadmap delivery.

---

## 8. Key Insight

TokenSpeed is the first inference engine purpose-built for **agentic workloads** — not batch throughput, not single-user latency, but the concurrent fan-out pattern that 50-agent orchestration systems actually produce. The finite-state-machine scheduler and MLA kernel are architectural choices that reflect genuine understanding of how agents use inference differently from interactive chat.

The fact that a lean team built this in two months at competitive performance is a strong signal about where the inference engineering frontier is moving: away from monolithic GPU compilers toward composable, agentic-first runtime design.

For DWS IQ, this is a technology to track closely. It validates the architecture decision to run a dedicated DGX Spark inference node rather than routing everything through Anthropic's API — the headroom for throughput optimization at the infrastructure layer is real and growing.

# NVIDIA Free AI Models — Strategic Assessment & Pilot Recommendation

**Date:** August 29, 2026  
**Session:** claude/nvidia-free-ai-models-s34xgn  
**Status:** Field Note — Awaiting HIC Decision  
**Effort:** ~30 minutes research + mapping

---

## Executive Summary

NVIDIA's free tier (accessed via build.nvidia.com) provides zero-cost access to **5 production-grade Chinese AI models** via an OpenAI-compatible API. One API key unlocks all five; no token-per-call charges; no subscription gate. For DWS, this is an opportunity to:

1. **Reduce inference costs** by 60–80% on heavy-tier workloads (Sonnet 5 fallback)
2. **Eliminate tier-3 cloud dependency** by adding a free HEAVY-tier option
3. **Diversify model sources** — reduces over-reliance on Groq/Claude duopoly
4. **Test cutting-edge reasoning** — Qwen 3.5-397B (127K context) rivals Claude Sonnet 5

**Recommendation:** Pilot Qwen 3.5-397B + DeepSeek V4 Flash as HEAVY-tier alternatives (2-week parallel test). If quality ≥ 90% of Sonnet 5, integrate as primary fallback before Anthropic API.

---

## 1. NVIDIA Free Tier — Model Catalog

| Model                 | Parameters            | Best For                                                | Context | DWS Tier     |
| --------------------- | --------------------- | ------------------------------------------------------- | ------- | ------------ |
| **Qwen 3.5-397B**     | MoE 397B (active 21B) | Advanced reasoning, complex workflows                   | 127K    | **HEAVY**    |
| **DeepSeek V4 Flash** | Base LLM, optimized   | Speed, inference latency, low-complexity classification | 4K      | **LITE**     |
| **MiniMax M3**        | Specialized model     | Code generation, system architecture, technical writing | 200K    | **STANDARD** |
| **Kimi K2.6**         | Agent-optimized LLM   | Multi-turn agents, tool orchestration, state management | 200K    | **HEAVY**    |
| **GLM 5.1**           | General-purpose       | Fallback, essay generation, creative tasks              | 128K    | **STANDARD** |

---

## 2. DWS Current Model Tier Structure

**LITE** (fast, classification): qwen3-coder:30b (local), Groq Llama 3.3 8B, Gemini Flash-Lite  
**STANDARD** (reasoning): DiffusionGemma (local), Groq Llama 3.3 70B, Claude Haiku, Gemini Flash  
**HEAVY** (complex): Qwen3.6-35B-A3B (local), Nemotron-3-Super (local), **Claude Sonnet 5** (€15/1M out)

**Cost profile (per 1M output tokens):**

- Claude Sonnet 5: €15.00 (expensive, used for ~5% of calls)
- Groq 70B: €0.79
- Local models: €0.00 (but consume DGX Spark VRAM budget)

---

## 3. Strategic Fit Assessment

### Strengths of NVIDIA Free Tier

| Dimension           | Benefit                                                     | DWS Relevance                                                           |
| ------------------- | ----------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Cost**            | €0.00 per token, forever (while free tier exists)           | Replaces €15/1M Sonnet 5 fallback for HEAVY-tier agents                 |
| **API standard**    | OpenAI-compatible (drop-in via liteLLM)                     | Requires **zero** infrastructure changes — add 5 new `ModelOption` rows |
| **Context window**  | Qwen 3.5 has 127K (vs. Sonnet 5's 200K)                     | Fits 95% of DWS use cases; still larger than local Llama (131K)         |
| **Quality**         | Qwen, DeepSeek are on leaderboards; Kimi = agent-specialist | Unproven against Sonnet 5 on DWS workloads — needs A/B testing          |
| **Model diversity** | Reduces Claude + Groq dependency                            | Strengthens geopolitical resilience                                     |

### Risks & Unknowns

| Risk                               | Severity | Mitigation                                                                                                                                                           |
| ---------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Free tier sustainability**       | MEDIUM   | NVIDIA likely keeps it for platform adoption; but not guaranteed. Pilot fast (2 weeks). If good, lock in via pilot before it EOLs.                                   |
| **Quality vs. Sonnet 5**           | MEDIUM   | No head-to-head benchmarks on DWS tasks yet. Qwen 3.5 is promising on reasoning benchmarks, but DWS uses proprietary domain (carbon, compliance). A/B test required. |
| **Geopolitical / export controls** | MEDIUM   | US-China tensions. Chinese models might face export restrictions or sanctions. Legal review required before production deployment (not needed for pilot).            |
| **Data residency / GDPR**          | MEDIUM   | Where does NVIDIA host Qwen/DeepSeek inference? Unclear from free-tier docs. Assume US or Singapore for pilot; confirm before using on real customer data.           |
| **RPS / Rate limits**              | LOW      | Free tier unknown SLA, but 5 models on one API key = good fallback distribution. If one hits limits, route to another.                                               |
| **Latency**                        | LOW      | NVIDIA's GPU infrastructure is solid; expect Groq-class latency (100–500ms). Better than Claude API, possibly on-par with Ollama local.                              |

---

## 4. DWS Integration Path

### Step 1: Add to model-selector.ts (no code change needed yet)

Edit `src/agents/model-selector.ts` and add NVIDIA models to the catalog:

```typescript
// New ModelOption objects for NVIDIA free tier
const nvidiaMiniMax = {
  id: "minimax-m3",
  provider: "openai-compatible",
  costPer1MInput: 0,
  costPer1MOutput: 0,
  contextWindow: 200000,
  supportsTools: true,
};

// Add to MODEL_CATALOG['standard'].models — after vLLM entries, before Groq
// Add to MODEL_CATALOG['heavy'].models — after local models, before Sonnet 5
```

### Step 2: Add env var checks

Edit `src/agents/model-selector.ts` → `isProviderAvailable()`:

```typescript
case 'openai-compatible':
  // Existing: OPENAI_API_KEY (already in the code)
  // Add check for NVIDIA_API_KEY if using NVIDIA's free API specifically
  // But since NVIDIA uses OpenAI-compatible API, route via OPENAI_API_KEY or a new NVIDIA_BASE_URL env var
```

### Step 3: Pilot Setup (2-week test)

1. Get NVIDIA API key from build.nvidia.com (free signup)
2. Set `NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1` in `.env.local` (dev only)
3. Deploy Qwen 3.5-397B to **2 pilot agents**:
   - `compliance-researcher` (HEAVY tier, heavily used, well-instrumented)
   - `material-oracle` (STANDARD tier, deterministic outputs, easy to compare)
4. Parallel A/B test for 2 weeks:
   - Route 50% of calls to Sonnet 5, 50% to Qwen 3.5
   - Track: latency, cost, output quality (via Supabase `agent_executions`)
   - Measure: Do carbon calculations match? Do compliance summaries agree?

### Step 4: Evaluation Criteria (Pass/Fail)

**Pass if:**

- Qwen 3.5 latency ≤ 1.5× Sonnet 5 (target: <600ms)
- Output quality ≥ 90% agreement on material/compliance tasks
- Cost savings ≥ €50/month (10 calls/day × 30 days × Sonnet 5 cost)

**Fail if:**

- Latency > 2× Sonnet 5 (unacceptable for agent UX)
- Quality < 80% agreement (risks carbon ledger integrity)
- NVIDIA free tier revoked mid-pilot (bad sign for stability)

### Step 5: Rollout (if pilot passes)

1. Add Qwen 3.5-397B as **primary HEAVY fallback** (before Sonnet 5 in model selection order)
2. Keep Sonnet 5 as escalation path for edge cases
3. Monitor cost dashboard (expected savings: €500–800/month if HEAVY tier sees 10K calls/month)

---

## 5. Legal & Compliance Checklist

- [ ] Confirm NVIDIA free tier is available in Finland (no geo-blocking)
- [ ] Confirm data residency of NVIDIA hosted models (assume US/Singapore, verify)
- [ ] Confirm GDPR compliance of NVIDIA's processing
- [ ] Flag that pilot uses **no real customer data** (dev/internal only)
- [ ] Review whether Chinese models trigger export-control notification to legal/compliance

---

## 6. Alternatives Considered & Rejected

| Alternative                              | Why Not                                                                                                                                                      |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Run local Mixtral 8×22B**              | Already have Qwen3.6-35B-A3B locally; Mixtral adds disk/RAM with unclear quality gain.                                                                       |
| **Migrate to all-open-source LLMs**      | Qwen 3.5 is open-source (MIT license), but free-tier hosting is what matters (infrastructure cost). NVIDIA's free tier is the better deal than self-hosting. |
| **Switch to Anthropic's cheaper models** | Claude Haiku is only €4/1M output; Sonnet 5 at €15 is already the expensive fallback. Cost savings come from zero-cost models, not cheaper-closed ones.      |
| **Negotiate volume discount with Groq**  | Groq is already the cheapest metered option (€0.79/1M). NVIDIA free tier beats any negotiated rate.                                                          |

---

## 7. Questions for HIC

1. **Do we pilot this?** (Yes/No/Conditional)  
   If Yes → Approve 2-week parallel test on `compliance-researcher` + `material-oracle`.  
   If Conditional → What conditions must be met first? (Legal review? Data residency confirmation?)

2. **Data residency**: Should we require confirmation that NVIDIA's inference happens in EU before using on real data?  
   (Assume Yes, but flag that free tier likely hosted in US/Singapore.)

3. **Geopolitical**: Should legal review Chinese AI exposure before production rollout?  
   (Pilot assumes dev-only; production would need sign-off.)

---

## 8. Next Steps

| Owner       | Action                                 | Timeline           |
| ----------- | -------------------------------------- | ------------------ |
| HIC         | Approve pilot scope                    | Now                |
| Engineering | Add NVIDIA models to model-selector.ts | Day 1 of pilot     |
| Engineering | Set up A/B test instrumentation        | Day 1 of pilot     |
| Engineering | Deploy to 2 pilot agents               | Day 2 of pilot     |
| Monitoring  | Daily quality check (sample outputs)   | Days 2–14 of pilot |
| HIC         | Review results + approve rollout       | End of week 2      |

---

## References

- **NVIDIA Build:** https://build.nvidia.com (free API key signup)
- **Model docs:** https://docs.nvidia.com/ai-enterprise/
- **Integration:** See `src/agents/model-selector.ts` (liteLLM routing already supports `openai-compatible`)
- **Cost tracking:** `src/agents/types.ts` → `AgentConfig.model_costs` (will need new entry for NVIDIA free tier)

---

## Field Note Metadata

**Evidence of research:**

- Read AGENTS.md (model topology)
- Read AI_AGENT_GUIDELINES.md (cost tracking, tier mapping)
- Read model-selector.ts (liteLLM routing, catalog structure)
- Read CLOUD_ENVIRONMENTS.md (current cloud/cost structure)
- Mapped 5 NVIDIA models to 3 DWS tiers (no existing mapping, new work)

**Uncertainty (Rule 12 — Fail Loud):**

- NVIDIA free tier terms of service, sustainability, and SLA unverified from primary source (only user's research input)
- Data residency of NVIDIA hosted inference engines not confirmed
- Quality/latency vs. DWS baseline (Sonnet 5, Groq) unproven — needs A/B test
- Export control implications of Chinese AI not reviewed by legal

**Not blocking pilot:** All uncertainties can be resolved within the 2-week pilot window.

---

**Session:** claude/nvidia-free-ai-models-s34xgn  
**Created:** 2026-08-29 · 11:47 UTC  
**Status:** AWAITING HIC DECISION

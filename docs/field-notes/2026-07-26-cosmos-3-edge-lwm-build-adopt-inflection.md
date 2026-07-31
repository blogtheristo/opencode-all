<!--
VERSION AND AGENT HISTORY
Document: NVIDIA Cosmos 3 Edge — the Build→Adopt inflection for the Lifetime World Model
Version: 1.0
Date: 2026-07-26
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/ollama-orchestration-merge-047pj7
Purpose: Capture NVIDIA's on-device world model (Cosmos 3 Edge) as the market
         signal that reframes the Lifetime World Model from "train a 55B" to
         "adopt an open edge world model and own the loop". Companion to
         PHD_FIREHORSE §14.44 / Key Contribution #49.
-->

# Field Note — NVIDIA Cosmos 3 Edge and the LWM Build→Adopt Inflection

## 0. Provenance caveat (fail loud)

The specifications below are **external and UNVERIFIED** — user-reported NVIDIA developer announcements, July 2026, beyond the assistant's knowledge cutoff. Cosmos and Nemotron are known real NVIDIA lines; "Cosmos 3 Edge" and "DeepSeek-V4-Pro 1.6T" are taken as reported. **Verify against NVIDIA's primary announcement (build.nvidia.com / NVIDIA blog) before propagating any figure as a DWS fact** (`/truth-check`).

## 1. The signal

- **Cosmos 3 Edge** — open frontier *world model* built to run on-device: reportedly ~**4B parameters + a ~2B Nemotron-based reasoner**; for robots (learn + act), AVs (scene understanding + intent prediction), and vision agents reasoning over live video. Runs on **DGX Spark**, Jetson, and more.
- **Nemotron** — NVIDIA's open LLM family (the reasoner's base; already in the DWS orbit via NemoClaw and nemotron-diffusion work).
- **DeepSeek-V4-Pro** — reported ~1.6T params, served free on Blackwell via the **NVIDIA NIM API** (build.nvidia.com).
- **Google Cloud G4 VMs** with RTX PRO 6000 Blackwell GPUs — a rentable Blackwell training surface (alongside GCP A3 Mega).

## 2. Why it matters — the inflection

The master's-thesis Appendix-E verification established that the ~55B LWM **cannot be pretrained on the GN-100** and that on-prem full training is *Pending Hardware*. Cosmos 3 Edge inverts the build-vs-adopt calculus: a ~6B open world model **purpose-built for the exact box DWS runs** removes the need to pretrain a sovereign world model from scratch.

**Reframe:** LWM = *train a 55B* → **adopt an open edge world model + own the loop.** The moat is the DWS-specific layer — adaptation on a sovereign first-person operational corpus, private evals, an RL environment, KYA governance (ASB/EAB/CSB/SIB) and Article-12 evidence — not the base weights (token-capital / three-capital thesis, PHD §14.25–§14.26).

## 3. The sovereignty-of-supply tension (name it)

- ✅ **Data sovereignty:** preserved — open weights, on-prem, EU-resident.
- ⚠️ **Supply sovereignty:** concentrates on a single US vendor (NVIDIA) at **both** the compute and the **model** layer — extending the exposure PHD §14.31 named at the compute end.
- ⚠️ **Model origin:** DeepSeek-V4-Pro via NIM is non-EU-origin weights → gate it to non-sensitive R&D / benchmarking; exclude from the sovereign customer-data core. The model-provenance predicate (PHD §14.24) must attest this boundary.
- 🛡️ **Mitigation (managed dependency, not lock-in):** keep ≥1 open model + ≥1 workload runnable on a **non-NVIDIA accelerator at testbed scale** (AMD MI300 via ROCm/vLLM, or Intel Gaudi 3 via SynapseAI). Open weights make the exit cost *demonstrable*: the generic worker tier (qwen2.5) is already portable; Cosmos's NVFP4 path is a re-quantise-and-port exercise. IJS sovereignty scale: DGX on-prem = 100, NIM EU = 55; a maintained non-NVIDIA testbed is the exit-cost proof that makes the dependency **governed** and auditable by investors/customers.

## 4. Decision posture

Adopt Cosmos 3 Edge as the LWM base candidate; do the DWS-specific adaptation + eval/RL loop + governance on top; retire the from-scratch 55B plan. Heavy fine-tune on cloud Blackwell (GCP A3 Mega / G4). Keep DeepSeek/large open models as a non-sovereign benchmark tier via NIM.

## 5. Recorded

- PhD (market signal / scientific framing): **PHD_FIREHORSE §14.44 + Key Contribution #49** (EN + FI).
- Master's: lockstep-only version entry (implementation evidence to follow in Appendix E *when* Cosmos is actually wired in).
- DGX evaluation prompt: `docs/pr-cleanup/next-prompts/DGX-cosmos3-edge-lwm-eval-v2.md`.
- All 4 thesis files → 3.89 lockstep (bumped to 3.90 after verification, §6). Learn/ HTML regen PENDING.

## 6. Verification (2026-07-26) — specs CONFIRMED against primary sources

- **Cosmos 3 Edge — CONFIRMED.** 4B params + 2B Nemotron reasoner; on-device world model; runs on DGX Spark, Jetson Thor/T2000/T3000, RTX. Launched 15.07.2026 (Tokyo) as the **edge tier of the Cosmos 3 family** (16B Nano + 64B Super shipped 31.05.2026). It is a **physical-AI** model (robot perception→action, 32 actions/inference, 15 Hz, 256p/480p generation) — fits the DWS physical/fleet/Control-Room side (§14.35), not a general compliance-LLM swap. Sources: MarkTechPost (2026-07-21), NVIDIA AI (X), AI Weekly, buildfastwithai.
- **DeepSeek-V4-Pro — CONFIRMED.** 1.6T total / 49B active MoE; on NVIDIA NIM (build.nvidia.com), free on Blackwell; 1M-token context. Sources: NVIDIA developer blog, build.nvidia.com modelcard, AI Market Watch.
- **Net effect:** the §14.44 caveat is upgraded from *unverified* to *verified*; the build→adopt thesis holds and is strengthened (an open, edge-native, physically-grounded world model on the exact hardware). The refinement: Cosmos 3 Edge is the **physical/embodied** LWM base; a separate reasoning/compliance model (Nemotron / cloud) remains the non-physical tier.

---

_Follows DWS Document Standard and DWS Market Research Standard §8.3._

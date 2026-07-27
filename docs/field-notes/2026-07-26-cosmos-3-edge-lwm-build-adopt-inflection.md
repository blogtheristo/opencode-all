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

## 4. Decision posture

Adopt Cosmos 3 Edge as the LWM base candidate; do the DWS-specific adaptation + eval/RL loop + governance on top; retire the from-scratch 55B plan. Heavy fine-tune on cloud Blackwell (GCP A3 Mega / G4). Keep DeepSeek/large open models as a non-sovereign benchmark tier via NIM.

## 5. Recorded

- PhD (market signal / scientific framing): **PHD_FIREHORSE §14.44 + Key Contribution #49** (EN + FI).
- Master's: lockstep-only version entry (implementation evidence to follow in Appendix E *when* Cosmos is actually wired in).
- DGX evaluation prompt: `docs/pr-cleanup/next-prompts/DGX-cosmos3-edge-lwm-eval-v2.md`.
- All 4 thesis files → 3.89 lockstep. Learn/ HTML regen PENDING.

---

_Follows DWS Document Standard and DWS Market Research Standard §8.3._

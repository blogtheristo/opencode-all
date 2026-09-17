# Models Worth Building On — 3090, 5090, and DGX Spark

***
# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:
  - Version: 1.2 | Tool: Claude Code (Opus 4.7) | Session: claude/model-performance-notes-4x3or | Date: 18.05.2026 | Changes: Added "Expanded Model Slate" + four matrices (Firehorse use case, Room, Industry cluster, Jurisdiction) + synthesis loadout. Widened the model set beyond sudo su's three to cover gaps the three do not fill: frontier APIs (Claude Sonnet / Opus) for board-grade Situation Room and defence-segment work where Chinese-origin weights are blocked; an EU-origin sovereign-reasoning fallback (Mistral-4-Small) for Aegis / public-sector / defence segments; the in-house Lifetime World Model V1 (55 B, FP8 → NVFP4 path); Gemma 4 26B-A4B as a Google-origin partner-laptop alternative; Qwen3-VL 235B-A22B as a heavy-multimodal Spark alternative; Qwen3 Coder 30B-A3B as a coding-specialist fallback. Sources: `product-catalog/Firehorse/README.md`, `Firehorse/Control/README.md`, `Firehorse/Situation/README.md`, `INDUSTRIES.md`, `docs/field-notes/2026-04-16-jurisdiction-expansion-dws7.md`, `docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md`.
  - Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/model-performance-notes-4x3or | Date: 18.05.2026 | Changes: Added "DWS Opinion — Top 3 Re-Ranked for Our Product Surface" section. Sudo su ranked by raw worth-it-ness; DWS re-prioritises by fit against Aegis sovereignty posture, SiteSense / Control Room vision needs, and the Lifetime Certified Partners laptop tier. Net: Nemotron 3 Nano Omni jumps to #1 for our product surface, Step-3.5 Flash stays as the sovereign reasoning pick (with a defence-segment caveat), Qwen 3.6 27B is the partner-laptop default.
  - Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/model-performance-notes-4x3or | Date: 18.05.2026 | Changes: Initial capture of hands-on field notes from sudo su across a single RTX 3090, an RTX 5090, and a 128 GB DGX Spark. Records the three models judged worth building on, the runners that hold up but did not make the cut, and the per-tier verdict for DWS IQ local-inference work.

Session Links & References:
  - Branch: https://github.com/blogtheristo/dws6/commits/claude/model-performance-notes-4x3or
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-05-18-models-worth-building-on-3090-5090-dgx-spark.md
  - Prior tiered list: docs/field-notes/2026-03-26-best-local-models-by-ram-tier.md
  - DGX Spark setup: docs/field-notes/2026-03-29-dgx-spark-primary-runtime-setup.md
  - Ollama integration: docs/Ollama.md

Document Status:
  - Created: 18.05.2026
  - Last Modified: 18.05.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Local Model Evaluation

Related Documents:
  - docs/field-notes/2026-03-26-best-local-models-by-ram-tier.md
  - docs/field-notes/2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md
  - docs/field-notes/2026-03-29-dgx-spark-primary-runtime-setup.md
  - docs/field-notes/2026-04-05-gemma-4-architecture-variants.md
  - docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md
  - docs/Ollama.md

***

## Ontology Tags

- **Geography:** Global > Open Source AI Ecosystem
- **Sector:** Technology > AI/ML > Large Language Models > Local Inference
- **Entities:** StepFun, Alibaba (Qwen), NVIDIA (Nemotron), DeepSeek, Zhipu AI (GLM), Google (Gemma), Carnice, RTX 3090, RTX 5090, DGX Spark
- **Temporal Context:** 2026-Q2, Local LLM Hardware Evaluation
- **Confidence:** High (first-hand testing)
- **Author:** sudo su

---

## TL;DR

Ran a stack of models across one RTX 3090, one RTX 5090, and a 128 GB DGX Spark. **Exactly three are worth building on.** The rest hold up fine, but are not where we should be putting product weight.

| Rank | Model | Hardware | Quant | Why |
|------|-------|----------|-------|-----|
| 1 | **StepFun Step-3.5 Flash (REAP-pruned 121B MoE)** | DGX Spark | Q6 | Most worth-it model of everything tested. 121B MoE on a single desktop box. |
| 2 | **Qwen 3.6 27B Dense** | Single RTX 3090 | Q4 | Undisputed king of the 24 GB tier. One-shot a playable game, ~41 tok/s, context headroom to spare. |
| 3 | **NVIDIA Nemotron 3 Nano Omni (30B-A3B)** | DGX Spark | — | Best multimodal tested for video classification. Vision-in, runs clean. |

---

## The three worth it

### 1. StepFun Step-3.5 Flash — REAP-pruned 121B MoE (Q6, DGX Spark)

A 121-billion-parameter mixture-of-experts running on a single desktop box. **The most worth-it model in everything I've tested.** REAP pruning + Q6 lands it inside the Spark's 128 GB envelope without losing the MoE's reasoning headroom. This is the one to point DWS IQ agents at when we need frontier-adjacent local reasoning.

### 2. Qwen 3.6 27B Dense (Q4, single RTX 3090)

The **undisputed king of the 24 GB tier.** One-shot a playable game. Around **41 tok/s.** Fits with context headroom to spare. If you have one 24 GB card and you want a single recommendation, this is the answer. Use it as the default local backend for Claude Code-style agent work on developer machines.

### 3. NVIDIA Nemotron 3 Nano Omni — 30B-A3B (DGX Spark)

**Best multimodal tested for video classification work.** Vision in, runs clean on the Spark. This is the one for site-camera, drone-feed, and Control Room video pipelines where we need vision-in classification at the edge without paying frontier API rates.

---

## The rest — ran them, they hold up fine

These are not bad models. They just didn't earn build-on status against the three above. Keep them in the pull list for evaluation work and fallback paths.

**On the Spark:**
- DeepSeek V4 Flash 158B
- GLM 4.7 Flash
- GLM 4.5 Air REAP 82B-A12B
- Gemma 4 26B-A4B
- Qwen3-VL 235B-A22B
- Qwen3 Coder 30B-A3B
- Qwen3 30B-A3B
- Carnice 35B-A3B

---

## Per-hardware verdict

| Hardware | Build-on default | Notes |
|----------|------------------|-------|
| **Single RTX 3090 (24 GB)** | Qwen 3.6 27B Dense Q4 | ~41 tok/s, context headroom. Use as developer-laptop / single-GPU agent backend. |
| **RTX 5090** | (no exclusive winner) | Headroom over 3090; same 24 GB-tier picks apply with more context and speed. Nothing here justifies a separate tier of model selection — pick by VRAM, not by SKU. |
| **DGX Spark (128 GB)** | StepFun Step-3.5 Flash 121B REAP @ Q6 (reasoning) + Nemotron 3 Nano Omni 30B-A3B (vision) | Two-model loadout covers reasoning and multimodal without leaving the Spark. |

---

## Why this matters for DWS IQ

- **Local default for agent work** — Qwen 3.6 27B Dense becomes the recommended 24 GB-tier model in `docs/Ollama.md` and supersedes prior 24 GB-tier suggestions in the March 2026 tiered list.
- **Edge multimodal** — Nemotron 3 Nano Omni is the model to wire into the Control Room / Lifetime Fleet video classification path before reaching for frontier vision APIs.
- **Spark as a reasoning node** — Step-3.5 Flash 121B REAP @ Q6 puts a near-frontier reasoning model on the same Spark we already use for the Lifetime World Model spike work; check headroom before co-locating with a 55 B LWM checkpoint.
- **Stop spreading evaluations thin** — the eight runner models in the "hold up fine" list are not where to spend the next round of integration effort.

---

## DWS Opinion — Top 3 Re-Ranked for Our Product Surface

Sudo su's ranking is by raw worth-it-ness from a model-runner's seat. Our seat is different: we ship DWS IQ 6 agents into EU regulated industries, with an Aegis sovereignty posture, a Control Room / Lifetime World Model trajectory, and Lifetime Certified Partners deploying on consumer hardware. Re-ranked for **our product surface**, the order changes.

### #1 for DWS — NVIDIA Nemotron 3 Nano Omni 30B-A3B (vision)

**Why it jumps to #1 for us:** the binding constraint on the DWS IQ 6 roadmap is *vision-in*. SiteSense (site safety, crane signals, EN 13001), Material Oracle (photo-to-material LCA), and Lifetime Fleet drone / Acer edge feeds all need a local multimodal model we can put behind the Control Room. Nemotron is the only one of the three that unlocks a pipeline we can't build today.

- **Sovereignty:** NVIDIA-origin → clean for defence / government / Aegis-sensitive customers where Chinese-origin weights are politically loaded. This is the right answer for the segments where Step-3.5 and Qwen are non-starters.
- **Hardware fit:** 30B-A3B (3 B active) runs clean on Spark and leaves headroom for a co-located reasoning model. Maps directly onto the existing Veriton GN-100 / DGX Spark edge deployment.
- **Build pattern:** chain it behind a reasoning model — Nemotron classifies, Step-3.5 (or a frontier API for defence work) decides. Don't use it as the final-answer brain; 3 B active params is vision-strong but reasoning-thin.
- **Action:** wire into the SiteSense and Lifetime Fleet video pipelines before we spend more on frontier vision API calls.

### #2 for DWS — StepFun Step-3.5 Flash 121B REAP @ Q6 (sovereign reasoning, non-defence)

**Why it stays high but with an asterisk:** this is the strongest local reasoning we've tested and it runs entirely on our own Spark — that *is* the Aegis story for non-defence segments. No CLOUD Act surface, no API egress, no rate-limit anxiety on customer pilots.

- **Sovereignty caveat:** StepFun is a Chinese lab. For EU defence / government / dual-use customers (the Aegis bullseye) this is a hard "no" until we have signed-off provenance and an evals-based comparison vs a Nemotron-class fallback. For Lifetime Oy commercial customers in non-defence industries (construction, materials, real estate) it is fine.
- **Hardware caveat:** Q6 at 121 B is heavy. Co-locating with an LWM V1 (55 B FP8) on the same Spark may exceed the memory budget — must be benched against the NVFP4 quantisation work in `docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md` before we commit it as the standing reasoning endpoint.
- **License homework:** before we ship it to any customer pilot, confirm REAP-pruned redistribution rights and the underlying StepFun license terms. Document in `docs/Ollama.md`.
- **Action:** stand it up as the **internal** Spark reasoning endpoint immediately; benchmark against Sonnet on the DWS agent eval set; gate customer-facing use on the license check.

### #3 for DWS — Qwen 3.6 27B Dense Q4 (partner-laptop default)

**Why it ranks third for us (not because it's worse — because its surface is narrower):** this is the right model for the Lifetime Certified Partners and consultants running DWS IQ on a single 24 GB card. It is **not** the right model for Control Room or final-answer compliance reasoning.

- **Surface match:** developer-laptop / partner-laptop / single-RTX deployments. ~41 tok/s and one-shot coding is exactly the profile for the consultant tier.
- **Sovereignty:** Alibaba-origin → same defence caveat as Step-3.5. Acceptable for commercial partner deployments, off the table for Aegis-sensitive segments.
- **Don't oversell:** 27 B dense beats most things at its tier but it is still tier-2 vs frontier. Use it for code generation and tool-call orchestration inside agent loops, not for final compliance / contract / safety verdicts.
- **Action:** update `docs/Ollama.md` to name it as the **24 GB-tier default** (supersedes the March 2026 tiered list's Qwen-Coder-Next entry for general agent work). Recommend to partners in the Lifetime Certified Partners consortium offering.

### Net re-ranking

| Sudo su rank | DWS rank | Model | DWS rationale |
|--------------|----------|-------|---------------|
| 1 | **2** | StepFun Step-3.5 Flash 121B REAP @ Q6 | Strongest sovereign reasoning, but defence-segment caveat + license homework keep it from #1 for us. |
| 2 | **3** | Qwen 3.6 27B Dense Q4 | Right answer for partner laptops; narrower product surface. |
| 3 | **1** | NVIDIA Nemotron 3 Nano Omni 30B-A3B | Unlocks the vision pipeline that gates SiteSense and Lifetime Fleet; clean provenance for Aegis. |

### One-line summary

For DWS IQ 6, build the vision pipeline on **Nemotron**, the sovereign-reasoning endpoint on **Step-3.5** (commercial customers first, defence after license sign-off), and ship **Qwen 3.6 27B** as the partner-laptop default.

---

## Matrix — Models × Firehorse / Rooms / Industries / Jurisdictions

Sudo su's three picks cover the local-inference middle. They do not cover the **frontier-grade ceiling** (board-grade Situation Room synthesis, defence-segment final-answer reasoning where Chinese-origin weights are blocked), the **EU-origin sovereign-reasoning slot** (where the Aegis / public-sector segments need a non-Chinese alternative), or the **in-house brain we are actually building** (LWM V1). The matrix below uses an expanded slate.

### Expanded model slate (the columns we recommend, not just sudo su's three)

| Tier | Model | Origin | Where it runs | Role |
|------|-------|--------|---------------|------|
| Frontier API | **Claude Sonnet 4.6 / Opus 4.7** | Anthropic (US) | Anthropic API | Board-grade outputs, defence-segment final answers, anywhere CN local weights blocked. |
| Sovereign reasoning (commercial) | **StepFun Step-3.5 Flash 121B REAP @ Q6** [sudo su #1] | StepFun (CN) | DGX Spark | Default EU-commercial sovereign reasoning. |
| Sovereign reasoning (defence) | **Mistral-4-Small** | Mistral (FR) | DGX Spark / Veriton GN-100 | EU-origin fallback when CN weights blocked (Aegis, public sector, defence dual-use). Lower ceiling than Step-3.5 but clean provenance. |
| In-house brain | **Lifetime World Model V1 (55 B, FP8 → NVFP4)** | DWS (FI) | DGX Spark, NVFP4 path on Blackwell | Control-room-native reasoning. Owned weights = the ultimate sovereignty story. See `2026-05-15-nvfp4-pretraining-for-control-room-lwm.md`. |
| Edge multimodal (primary) | **NVIDIA Nemotron 3 Nano Omni 30B-A3B** [sudo su #3] | NVIDIA (US) | DGX Spark / Veriton | Vision-in for Control Room, SiteSense, Material Oracle, Lifetime Fleet feeds. |
| Edge multimodal (heavy) | **Qwen3-VL 235B-A22B** | Alibaba (CN) | DGX Spark (Q4/Q5) | Heavy-multimodal alternative for forensic frame-by-frame work. CN-origin caveat. |
| Partner laptop (default) | **Qwen 3.6 27B Dense Q4** [sudo su #2] | Alibaba (CN) | Single 24 GB GPU | Lifetime Certified Partners default. |
| Partner laptop (CN-blocked) | **Gemma 4 26B-A4B Q4** | Google (US) | Single 24 GB GPU | Partner-laptop alternative for jurisdictions / customers blocking CN weights. |
| Partner laptop (coding) | **Qwen3 Coder 30B-A3B** | Alibaba (CN) | Single 24 GB GPU | Coding-specialist fallback inside agent loops. |

---

### Matrix A — Firehorse product use cases × recommended model

Source: `product-catalog/Firehorse/README.md` + `Firehorse/Control/README.md` + `Firehorse/Situation/README.md`.

| Firehorse use case | Primary | Secondary | Defence-segment fallback (CN blocked) |
|--------------------|---------|-----------|----------------------------------------|
| Forensic Compliance Auditing (Fit-for-55 / CBAM / CSRD, 1000+ pp.) | **Step-3.5 Flash 121B REAP** | Sonnet 4.6 for final pass | **Sonnet 4.6** or **Mistral-4-Small** |
| Real-Time Carbon Tracking (sensor + digital twin) | **Nemotron 3 Nano Omni** (vision tag) + **LWM V1** (roll-up) | Step-3.5 for batch synthesis | **Nemotron** + Mistral-4-Small |
| Investor Relations Outreach (20 emails/day, lead scoring) | **Qwen 3.6 27B Dense** | Step-3.5 for pitch synthesis | **Gemma 4 26B-A4B** |
| Safety Incident Reconstruction (Aerial Omniverse, crane EN 13001) | **Nemotron 3 Nano Omni** (frame analysis) + **Step-3.5** (root-cause narrative) | Qwen3-VL 235B for heavy forensic frames | **Nemotron** + Sonnet for narrative |
| Digital Twin Verification (BIM vs aerial sensor) | **Nemotron 3 Nano Omni** | Qwen3-VL 235B for dense clash detection | **Nemotron** alone |
| Multi-Site Operations Coordination | **Control Room: Nemotron + LWM V1**; **Situation Room: Step-3.5** | Sonnet 4.6 for cross-portfolio synthesis | **Sonnet 4.6** for Situation; **Nemotron + Mistral-4-Small** for Control |
| Automated Campaign Management (A/B, copy variation) | **Qwen 3.6 27B Dense** | Qwen3 Coder for template logic | **Gemma 4 26B-A4B** |

---

### Matrix B — Control Room vs Situation Room × recommended model

Source: `Firehorse/Control/README.md` + `Firehorse/Situation/README.md`. Control = NOW (ms–min, vision-heavy, low-latency). Situation = TREND (day–quarter, text/tabular, deliberative).

| | Control Room (Site Chief / Foreman / Engineer) | Situation Room (Board / CxO / Portfolio Mgr) |
|---|--------------------------------------------------|------------------------------------------------|
| Latency budget | ms–min (real-time WebSocket, 15-min sensor polling) | hours–days (batch reconciliation, board reports) |
| Primary modality | Vision + IoT telemetry | Text + tabular synthesis |
| **Primary model** | **Nemotron 3 Nano Omni 30B-A3B** (vision in) + **LWM V1** (site-state reasoning) | **Step-3.5 Flash 121B REAP @ Q6** (sovereign portfolio synthesis) |
| **Secondary** | **Qwen 3.6 27B** for RFI text / code | **Sonnet 4.6** for board-grade output |
| **Defence-segment fallback** (CN blocked) | **Nemotron alone** + Sonnet API for any text reasoning | **Sonnet 4.6 / Opus 4.7** (frontier API) or **Mistral-4-Small** local |
| **Why this split** | 3 B active params → sub-second vision classification at the edge. LWM V1 owns the site-state model. | 121 B MoE reasoning is worth the seconds; co-located on Spark in batch windows. |

---

### Matrix C — 25 industries (clustered) × recommended model

Source: `INDUSTRIES.md` (canonical 25-industry registry). Clustered by carbon-pricing exposure and CN-weight sensitivity.

| Cluster | Industries (count) | CN weights OK? | Primary loadout | EU-origin / frontier fallback |
|---------|--------------------|----------------|------------------|--------------------------------|
| **Heavy Emitters** (direct ETS + CBAM) | Power & Heat, Steel, Cement, Chemicals, Aviation, Maritime, Road Tx, Refining, Aluminium (9) | **Yes** — commercial EU-regulated | Step-3.5 (compliance reasoning) + Nemotron (site vision) + LWM V1 | Sonnet 4.6 for board-grade |
| **Supply-Chain** | Construction, Manufacturing, F&B, Logistics, Shipbuilding (5) | **Yes** | Nemotron (vision-led) + Step-3.5 (compliance) + LWM V1 | Mistral-4-Small for SOEs |
| **Financial / Scope-3** | Financial Services, Real Estate, Public Sector, Healthcare (4) | **Conditional** — Public Sector + Healthcare often block | Step-3.5 (commercial banks / RE) ; **Mistral-4-Small + Nemotron** (Public Sector + Healthcare) | Sonnet 4.6 for regulated final answers |
| **Emerging Tech / Dual-Use** | Data Centres, RFNBO/Green H2, Mining (3) | **Conditional** — defence dual-use risk | Nemotron primary + LWM V1; Step-3.5 only for clearly commercial customers | Mistral-4-Small + Sonnet 4.6 for dual-use cases |
| **Ag & Circular** | Agriculture, Waste, Pulp/Paper, Glass & Ceramics (4) | **Yes** | Step-3.5 + Nemotron | Qwen 3.6 27B at partner tier |

**Total: 25.** ✓

---

### Matrix D — Jurisdiction × recommended model

Source: `docs/field-notes/2026-04-16-jurisdiction-expansion-dws7.md`. EU is the home base; the other three are DWS IQ 7 roadmap.

| Jurisdiction | Reasoning tier | Vision tier | Frontier API allowed? | Constraint |
|--------------|-----------------|--------------|------------------------|------------|
| **EU-Sovereign** (DE / FR / FI, GDPR + NIS2 + EU AI Act) | **Step-3.5 Flash 121B REAP** (commercial) ; **Mistral-4-Small** (defence / public sector / Aegis) ; **LWM V1** (in-house) | **Nemotron 3 Nano Omni** | **Yes** for commercial; **case-by-case** for regulated critical-infra | Inference on EU-resident HW only (Hetzner DE / Scaleway FR / Aiven FI / on-prem Spark). CLOUD-Act-free. |
| **US Cloud** (Supabase / Cloudflare path) | **Step-3.5** with customer CN-weight ack ; **Sonnet 4.6** for defence procurement | **Nemotron** | **Yes** | CLOUD Act exposure. Not for EU-only-data customers. |
| **UAE / G42** (DIFC + ADGM, DWS IQ 7) | **Step-3.5** pending license + provenance sign-off ; **Mistral-4-Small** safe choice | **Nemotron** | **Yes** | UAE PDPL + DIFC DP Law 2020. MSFT/G42 partnership context. Watch UAE–CN political shifts. |
| **ASEA** (SG / MY / ID / TH / VN, DWS IQ 7) | **Customer-HQ-dependent** — SG MAS / ID PDP /etc. **Step-3.5** for SG commercial; **Mistral-4-Small** elsewhere | **Nemotron** | **Yes** | No single regime. Customer HQ jurisdiction governs. |

---

### Synthesis — Standing loadout per (Jurisdiction × Room)

The decision table the agent picks from at runtime.

| | **Control Room** (NOW, vision, ms–min) | **Situation Room** (TREND, text, day–quarter) |
|---|------------------------------------------|------------------------------------------------|
| **EU — commercial** (Heavy Emitters, Supply-Chain, Ag & Circular) | **Nemotron 3 Nano Omni** + **LWM V1** | **Step-3.5 Flash 121B REAP** ; **Sonnet 4.6** for board-grade |
| **EU — defence / public sector / Aegis** (Public Sector, Healthcare, Dual-Use) | **Nemotron 3 Nano Omni** + **LWM V1** ; CN weights blocked | **Mistral-4-Small** local ; **Sonnet 4.6 / Opus 4.7** for final answers |
| **US Cloud** (CLOUD Act-aware customer) | **Nemotron** + **Qwen 3.6 27B** at partner tier | **Step-3.5** with customer ack ; **Sonnet 4.6** for defence procurement |
| **UAE / G42** (DWS IQ 7, planned 2027) | **Nemotron** primary | **Mistral-4-Small** until Step-3.5 license sign-off ; **Sonnet 4.6** allowed |
| **ASEA** (DWS IQ 7, planned 2027) | **Nemotron** primary | **Step-3.5** (SG commercial) or **Mistral-4-Small** ; **Sonnet 4.6** allowed |

**Three rules the table encodes:**
1. **Nemotron is the universal vision pick.** Same model in every Control Room cell regardless of jurisdiction — it has the only clean provenance story across all four jurisdictions and is the binding-constraint unlock for SiteSense / Lifetime Fleet.
2. **Reasoning model varies by sensitivity, not by jurisdiction alone.** A defence customer in the EU and a defence customer in UAE get the same answer (Mistral-4-Small + Sonnet API), not the EU "default" of Step-3.5.
3. **LWM V1 is the long-term replacement for Step-3.5.** Once V1 is qualified on the Spark (NVFP4 path, see `2026-05-15-nvfp4-pretraining-for-control-room-lwm.md`), it absorbs the Control Room reasoning slot and the sovereignty story becomes airtight — DWS-owned weights, not Chinese.

---

## Next steps

1. Update `docs/Ollama.md` 24 GB-tier recommendation to **Qwen 3.6 27B Dense Q4** (replaces older Qwen-Coder-Next entry for default agent work).
2. Stand up Step-3.5 Flash 121B REAP @ Q6 as the Spark's default reasoning endpoint and benchmark against Sonnet on the standing agent-task eval set.
3. Wire Nemotron 3 Nano Omni into the video-classification pipeline as the first non-Anthropic vision path.
4. Re-test the eight "hold up fine" models quarterly; promote only on a regression-beating result against the three above.

---

*Field note by sudo su. Hardware: 1× RTX 3090, 1× RTX 5090, 1× DGX Spark (128 GB).*

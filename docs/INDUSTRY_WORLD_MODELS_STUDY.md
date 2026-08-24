# Industry World Models Study: From Karpathy's GPT-2 to 16-Industry Fit for 55 World Models

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/industry-world-models-study-Mk2mu | Date: 21.05.2026 | Changes: Initial creation — comprehensive study of Karpathy GPT-2 experiments, world model characteristics 2026, five competing architectures, technical evolution roadmap, and 16-industry Fit for 55 world model specification matrix

Session Links & References:
  - Claude Code (claude/industry-world-models-study-Mk2mu): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/INDUSTRY_WORLD_MODELS_STUDY.md

Document Status:
  - Created: 21.05.2026
  - Last Modified: 21.05.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

**Version:** 1.0
**Effective Date:** 2026-05-21
**Last Updated:** 2026-05-21
**Status:** Active
**Classification:** PhD Research / Market Signal Analysis
**Scope:** Per CLAUDE.md §1.3 — scientific perspective, 3-7 year horizon, market signals

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Karpathy's GPT-2 Experiments — Technical Foundation](#2-karpathys-gpt-2-experiments--technical-foundation)
3. [From GPT-2 to World Models — The Paradigm Bridge](#3-from-gpt-2-to-world-models--the-paradigm-bridge)
4. [World Model Characteristics 2026 — State of the Art](#4-world-model-characteristics-2026--state-of-the-art)
5. [Five Competing World Model Architectures](#5-five-competing-world-model-architectures)
6. [Technical Evolution Roadmap 2026-2032](#6-technical-evolution-roadmap-2026-2032)
7. [Fit for 55 Requirements vs World Model Capabilities](#7-fit-for-55-requirements-vs-world-model-capabilities)
8. [16 Industry-Specific World Model Specifications](#8-16-industry-specific-world-model-specifications)
9. [Can GPT-2-Scale Models Serve Industry World Models?](#9-can-gpt-2-scale-models-serve-industry-world-models)
10. [Implications for DWS IQ 6 and the Lifetime World Model](#10-implications-for-dws-iq-6-and-the-lifetime-world-model)
11. [Conclusions](#11-conclusions)
12. [References](#12-references)

---

## 1. Executive Summary

This study examines whether the principles demonstrated in Andrej Karpathy's GPT-2 reproduction experiments — efficient training, accessible architectures, and the democratization of model building — can be extended to create industry-specific world models for EU's 16 Fit for 55-regulated industries. We analyse the five competing world model architectures (autoregressive, diffusion, JEPA, hybrid, active inference), map their characteristics against Fit for 55 compliance requirements, and propose specific world model configurations for each of the 16 industries.

**Core finding:** No single world model architecture serves all 16 industries. Each industry requires a tailored combination of spatial understanding, temporal prediction, causal reasoning, and regulatory constraint encoding. The Karpathy approach — accessible, reproducible, and efficient — provides the philosophical foundation, but industry world models require domain-specific physics priors, regulatory ontologies, and multi-modal sensor fusion that go far beyond text prediction.

**Strategic implication for DWS IQ 6:** The Lifetime World Model (LWM) architecture is validated as the correct approach — a sovereign, persistent, physics-aware model with regulatory constraint encoding. The 16-industry expansion requires a modular world model factory, not 16 monolithic models.

---

## 2. Karpathy's GPT-2 Experiments — Technical Foundation

### 2.1 The Experiments

Andrej Karpathy, co-founder of OpenAI and former head of AI at Tesla, demonstrated three progressive approaches to reproducing GPT-2 (124M parameters):

| Project | Language | Hardware | Time | Cost | Key Insight |
|---------|----------|----------|------|------|-------------|
| **nanoGPT** | Python/PyTorch | 8×A100 40GB | ~4 days | ~$1,000 | ~300 lines for model + ~300 lines for training |
| **build-nanogpt** | Python | Various GPUs | 4 hours (walkthrough) | ~$100 | Full video walkthrough, educational |
| **llm.c** | C/CUDA | 4×RTX 4090 or 8×A100 | 90 minutes | ~$20 | 4,000 lines of C/CUDA, no framework dependency |

**Note:** nanoGPT was deprecated in November 2025 in favour of **nanochat**, signalling Karpathy's shift toward conversational/agentic architectures.

### 2.2 Architecture Deep-Dive

GPT-2 is a decoder-only Transformer with key modifications from the original architecture:

- **Pre-norm layer normalization** — LayerNorm before (not after) attention and feed-forward blocks
- **GELU activation** — Allows non-zero gradient below zero, unlike ReLU
- **No encoder** — Pure autoregressive generation
- **Learned positional embeddings** — Instead of sinusoidal

```
Input Tokens → Token Embedding + Position Embedding
    → N × [LayerNorm → Multi-Head Attention → LayerNorm → Feed-Forward (GELU)]
    → LayerNorm → Linear → Softmax → Next Token Prediction
```

### 2.3 Training Insights Relevant to Industry Models

| Insight | Karpathy's Finding | Industry Model Implication |
|---------|-------------------|---------------------------|
| **Dataset quality > quantity** | FineWeb-Edu (filtered for educational value) outperforms raw FineWeb | Industry models need curated domain data, not general web scrape |
| **Batch size follows GPT-3 table** | 500K tokens optimal for 124M params | Industry models with specialized vocabularies need different batch tuning |
| **Gradient accumulation** | Simulates large batches on limited hardware | Enables edge deployment training (DWS GN-100 scenario) |
| **Learning rate warmup + cosine decay** | Prevents early training instability | Critical for fine-tuning pre-trained models on industry data |
| **Mixed precision (FP16/BF16)** | 2-3× speedup with minimal quality loss | NVFP4 extends this further for edge inference (§14.18 of PhD thesis) |

### 2.4 Karpathy's 2025 Year-in-Review — Key Signals

In his December 2025 review, Karpathy identified six paradigm shifts:

1. **RLVR (Reinforcement Learning from Verifiable Rewards)** — LLMs trained against automatically verifiable rewards spontaneously develop reasoning-like strategies. This is directly applicable to compliance verification.
2. **"Summoned ghosts, not evolved animals"** — LLMs are optimized under entirely different constraints than biological intelligence, showing "jagged performance characteristics."
3. **Claude Code as the first convincing local AI agent** — Validates localhost-first agent deployment over cloud.
4. **"Vibe coding"** — Programming threshold crossed; anyone can build with AI.
5. **Small efficient models (Gemini Nano)** — Local deployment is viable.
6. **"Not even 10% of potential realized"** — The field remains wide open.

---

## 3. From GPT-2 to World Models — The Paradigm Bridge

### 3.1 Why GPT-2 Is Not a World Model (But Points the Way)

GPT-2 predicts the next token in a text sequence. A world model predicts the next state of a physical or logical system. The gap:

| Dimension | GPT-2 (Token Prediction) | World Model (State Prediction) |
|-----------|-------------------------|-------------------------------|
| **Input space** | Text tokens (50,257 vocabulary) | Multi-modal: video, sensor, text, regulatory signals |
| **Output space** | Next token probability | Future state distribution (latent or explicit) |
| **Physics** | None — statistical co-occurrence | Physical laws encoded (gravity, thermodynamics, chemistry) |
| **Causality** | Correlation in training data | Causal reasoning about interventions |
| **Persistence** | Stateless (context window) | Persistent memory across time horizons |
| **Spatial understanding** | None | 3D scene understanding, object permanence |
| **Temporal horizon** | Context window (~2K tokens for GPT-2) | Minutes to decades depending on application |

### 3.2 The Bridge: What Carries Over

Despite these differences, Karpathy's experiments established principles that carry directly to world model development:

1. **Reproducibility at scale** — If you can reproduce GPT-2 in 90 minutes for $20, you can reproduce domain-specific world models affordably
2. **Architecture simplicity** — Transformers work; complexity should come from data and training, not architecture
3. **Training recipe matters more than architecture** — Learning rate schedules, data quality, batch sizes
4. **Edge-viable models** — llm.c proves that pure C/CUDA models run on consumer hardware
5. **Open weights, open code** — The entire ecosystem benefits from transparency

### 3.3 Karpathy's Implicit World Model Thesis

Through his work at Tesla Autopilot (2017-2022), Karpathy developed an implicit world model understanding:

- **Tesla's vision system** was effectively a world model — predicting lane positions, vehicle trajectories, and obstacle behavior from camera inputs
- **The "software 2.0" thesis** (Karpathy, 2017) — neural networks as a new programming paradigm where you specify the objective, not the algorithm
- **Video prediction as world simulation** — Karpathy's early Recurrent Neural Network (RNN) work on sequence prediction foreshadowed today's video world models

---

## 4. World Model Characteristics 2026 — State of the Art

### 4.1 Definition

A **world model** is an internal representation of how an environment behaves. It allows an AI system to:
- **Predict** outcomes of actions before taking them
- **Simulate** multiple futures in latent space
- **Plan** optimal action sequences
- **Reason** about cause and effect
- **Remember** persistent state across time

Yann LeCun's formulation (2022): a world model is a system that maintains a "computational snow globe" — an internal simulation of the environment that enables planning and reasoning without trial-and-error in the real world.

### 4.2 Defining Characteristics of 2026-Era World Models

| Characteristic | 2024 State | 2026 State | Trend |
|---------------|-----------|-----------|-------|
| **Physics awareness** | Basic object permanence | Multi-physics simulation (thermal, structural, fluid) | Rapid improvement via NVIDIA Cosmos/Omniverse |
| **Temporal horizon** | Seconds (video prediction) | Hours to months (planning) | Extending through hierarchical temporal abstraction |
| **Spatial fidelity** | 2D with pseudo-3D | True 3D via Gaussian splatting and NeRF | DeepMind Genie 3: real-time 3D at 24fps |
| **Multi-modal fusion** | Vision + text | Vision + text + sensor + regulatory + financial | Industrial digital twins driving convergence |
| **Persistence** | Session-bound context | Persistent memory across deployments | LWM architecture (Lifetime World Model) |
| **Causal reasoning** | Correlation-based | Interventional causal inference | JEPA latent space predictions enable causal queries |
| **Real-time performance** | Batch processing | Real-time interactive (<100ms) | NVIDIA Cosmos Nano for edge, Genie 3 for cloud |
| **Physical grounding** | Simulated environments | Real-world sensor grounding | Siemens Digital Twin Composer (CES 2026) |
| **Regulatory encoding** | None | Domain-specific constraint layers | DWS IQ 6 pioneering with Fit for 55 ontology |
| **Sovereignty** | Cloud-dependent | On-premise sovereign deployment | EU data residency requirements driving sovereign AI |

### 4.3 The LeCun Thesis — Why LLMs Cannot Be World Models

Yann LeCun (Turing Award, departed Meta December 2025 to found AMI Labs at €3B valuation) argues:

1. **Efficiency gap:** LLMs require 400,000 years of human text equivalent to achieve basic competency; a 4-year-old child develops sophisticated understanding through 16,000 hours of visual experience
2. **Structural limitation:** Exponential error propagation in autoregressive generation is not a scaling problem — it's a structural inevitability
3. **Dimensionality mismatch:** The gap between linguistic tokens and physical state spaces explains why LLMs struggle with embodied reasoning
4. **Missing physics:** Language does not encode the laws of physics; you cannot learn gravity from text about gravity

**Counter-argument:** Scaling proponents argue that sufficiently diverse multimodal training can overcome these limitations. The practical answer in 2026 is **hybrid architectures** — combining LLM linguistic knowledge with dedicated world model modules.

### 4.4 Key Players and Their Approaches (2026)

| Player | System | Architecture | Focus | Status |
|--------|--------|-------------|-------|--------|
| **AMI Labs (LeCun)** | LeJEPA → V-JEPA 2 | Joint Embedding Predictive Architecture | Physics understanding, planning | €3B valuation, Paris HQ |
| **Google DeepMind** | Genie 3 | Autoregressive + diffusion | Interactive 3D worlds at 24fps | Released August 2025 |
| **World Labs (Fei-Fei Li)** | Marble | Spatial intelligence | Text/image → navigable 3D worlds | Released November 2025 |
| **NVIDIA** | Cosmos 2.5 | Diffusion + autoregressive + RL | Physical AI for robotics/industry | Open weights, 2M+ downloads |
| **Siemens + NVIDIA** | Digital Twin Composer | Physics simulation + AI | Industrial digital twins at scale | Available mid-2026 |
| **DWS IQ 6 / Lifetime Oy** | LWM V1 | Cosmos + Llama + OpenUSD | Construction → 16 industries | NVIDIA Inception pipeline |

---

## 5. Five Competing World Model Architectures

### 5.1 Architecture Comparison Matrix

| Architecture | Mechanism | Strengths | Weaknesses | Best For |
|-------------|-----------|-----------|------------|----------|
| **Autoregressive** | Token-by-token prediction in sequence space | Causal by design; proven at scale; rich text integration | Slow generation; error accumulation; lossy quantization | Text-heavy industry compliance, document flows |
| **Diffusion** | Iterative denoising from noise to signal | High visual fidelity; parallelizable generation; strong physics | Non-causal; requires many inference steps; high compute | Visual simulation, construction site monitoring |
| **JEPA** | Predicts abstract representations in latent space | Energy-efficient; avoids pixel-level prediction; enables planning | Scarce evidence beyond research settings; limited commercial deployment | Robotics, material logistics, long-horizon planning |
| **Hybrid (AR + Diffusion)** | Autoregressive structure with diffusion generation | Combines causality with quality; real-time capable | Complex training; emerging field; few production systems | Autonomous vehicles, fleet management, multi-modal |
| **Active Inference** | Variational inference with active model updates | Theoretically grounded (free energy principle); adapts in real-time | Computationally expensive; scaling challenges; limited tooling | Real-time control systems, energy grid management |

### 5.2 The Convergence Thesis

By 2026, the strict separation between these architectures is dissolving:

- **NVIDIA Cosmos 2.5** combines diffusion (Predict) + autoregressive (Transfer) + reinforcement learning (RL) + reasoning (Reason)
- **V-JEPA 2** (Meta, June 2025) bridges JEPA with zero-shot robotic planning
- **CausVid** adapts video diffusion transformers into autoregressive diffusion transformers (AR-DiT) with causal attention

**Implication for industry models:** The right question is not "which architecture?" but "which combination of architectures for which industry-specific requirements?"

---

## 6. Technical Evolution Roadmap 2026-2032

### 6.1 Near-Term (2026-2027)

| Capability | Current State | Expected 2027 State |
|-----------|--------------|-------------------|
| **Industrial digital twins** | Project-specific, expensive | Siemens Digital Twin Composer enables at-scale creation |
| **Sensor fusion** | Specialized pipelines | Standardized multi-modal ingestion (NVIDIA Cosmos) |
| **Regulatory encoding** | Manual rule entry | Auto-ingestion from EUR-Lex, regulatory APIs |
| **Edge deployment** | Cloud-heavy | NVIDIA GB10 Blackwell, DWS GN-100 sovereign nodes |
| **Real-time carbon tracking** | Batch processing | Continuous stream processing at sensor level |

### 6.2 Medium-Term (2028-2030)

| Capability | Expected Development |
|-----------|---------------------|
| **Cross-industry world models** | Shared physics engines with industry-specific ontology overlays |
| **Autonomous compliance** | World models self-generate regulatory filings from continuous state |
| **Predictive maintenance + carbon** | Unified models predicting equipment failure AND carbon impact |
| **Supply chain world models** | End-to-end visibility from raw material extraction to product disposal |
| **Carbon credit markets** | Real-time carbon pricing integrated into world model decision-making |

### 6.3 Long-Term (2030-2032)

| Capability | Expected Development |
|-----------|---------------------|
| **Planetary-scale world models** | NVIDIA Earth-2 class models for climate + industry interaction |
| **Autonomous carbon optimization** | AI systems autonomously adjusting industrial processes for Fit for 55 compliance |
| **Cross-border regulatory harmonization** | World models encoding multi-jurisdiction regulatory requirements simultaneously |
| **Circular economy world models** | Full lifecycle tracking from material extraction through recycling |
| **Agentic world model ecosystems** | World models that spawn and coordinate industry-specific agents (per KYA governance) |

---

## 7. Fit for 55 Requirements vs World Model Capabilities

### 7.1 Regulatory-to-Model Capability Mapping

Each Fit for 55 regulation imposes specific demands on world model capabilities:

| Regulation | World Model Requirement | Capability Category |
|-----------|------------------------|-------------------|
| **EU ETS** | Continuous emissions monitoring and forecasting | Temporal prediction + sensor fusion |
| **CBAM** | Embedded carbon calculation for imports | Supply chain modeling + causal inference |
| **CSRD** | Full Scope 1/2/3 sustainability reporting | Multi-modal data integration + persistence |
| **EPBD** | Lifecycle carbon assessment (EN 15978) | Physics simulation + temporal lifecycle |
| **ESR** | National emissions target tracking | Spatial ontology + regulatory encoding |
| **ETS2** | Buildings + road transport carbon pricing | Multi-domain sensor fusion + prediction |
| **ReFuelEU** | Sustainable aviation fuel compliance | Chemical process modeling + supply chain |
| **FuelEU Maritime** | Voyage emissions monitoring | Spatial-temporal trajectory modeling |
| **LULUCF** | Land use carbon accounting | Satellite/remote sensing + ecological modeling |
| **EU AI Act** | AI system compliance (Articles 9, 12, 14) | Self-monitoring + logging + human oversight |

### 7.2 Common World Model Requirements Across All 16 Industries

Every industry world model under Fit for 55 must include:

1. **Regulatory constraint layer** — Encodes current and upcoming EU regulations as hard constraints
2. **Carbon accounting engine** — Scope 1/2/3 emissions tracking per GHG Protocol
3. **Audit trail persistence** — Immutable logging for regulatory verification (EU AI Act Article 12)
4. **Temporal prediction** — Forecast emissions trajectories for compliance planning
5. **Supply chain visibility** — Track embedded carbon across value chains
6. **Report generation** — Automated CSRD, ETS, CBAM reporting
7. **Scenario simulation** — Model 10,000+ regulatory scenarios (per LWM V1 spec)
8. **Human-in-the-loop** — KYA governance for agentic decisions

---

## 8. 16 Industry-Specific World Model Specifications

### Tier 1: Critical Emissions Industries (ETS + CBAM Direct)

---

### 8.1 Power & Heat Generation World Model

**Industry share:** 25-30% of EU emissions | **Primary regulation:** ETS (cap tightening), Renewables Directive

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Hybrid (autoregressive + active inference) |
| **Physics engine** | Thermodynamic modeling (Carnot cycles, heat transfer, combustion chemistry) |
| **Temporal horizon** | Minutes (dispatch) → decades (plant lifecycle + decommissioning) |
| **Spatial scope** | Plant-level → grid-level → national energy mix |
| **Sensor fusion** | SCADA systems, smart meters, weather stations, grid frequency monitors |
| **Key prediction tasks** | Load forecasting, renewable intermittency, emissions per MWh, ETS allowance pricing |
| **Regulatory encoding** | ETS cap trajectory, renewable energy targets, grid carbon intensity factors |
| **Causal reasoning** | Fuel switching impact on emissions, renewable penetration → grid stability |
| **Digital twin** | Power plant operational twin (Siemens Energy model) |
| **Edge requirements** | Real-time grid balancing requires <10ms inference latency |
| **Data volume** | Very high — continuous SCADA + market data + weather |
| **DWS IQ 6 module** | Real-time emissions monitoring, renewable certificate tracking, ETS allowance forecasting |

**Unique characteristic:** Must model the **merit order effect** — how renewable energy displaces fossil generation — and predict its carbon impact in real time.

---

### 8.2 Iron & Steel Production World Model

**Industry share:** High | **Primary regulation:** ETS, CBAM (2026), ESR

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Diffusion (process simulation) + JEPA (production planning) |
| **Physics engine** | Metallurgical modeling (blast furnace chemistry, electric arc furnace dynamics, alloy phase diagrams) |
| **Temporal horizon** | Seconds (melt chemistry) → years (capex decisions: BF→EAF transition) |
| **Spatial scope** | Furnace zone → plant → supply chain (ore origin to customer delivery) |
| **Sensor fusion** | Pyrometers, spectrometers, load cells, energy meters, ore quality sensors |
| **Key prediction tasks** | Carbon intensity per tonne, scrap-to-steel ratios, hydrogen-DRI viability, CBAM border cost |
| **Regulatory encoding** | ETS free allowance phase-out schedule (2026-2034), CBAM certificate requirements |
| **Causal reasoning** | Hydrogen substitution → emissions reduction pathway; scrap rate → circular economy credit |
| **Digital twin** | Full furnace digital twin with real-time chemistry simulation |
| **Edge requirements** | Medium — batch processes allow minutes-scale inference |
| **Data volume** | High — process chemistry data + supply chain provenance |
| **DWS IQ 6 module** | CBAM import reporting, supply chain carbon tracking, ETS allowance management |

**Unique characteristic:** Must model the **green steel transition** — the switch from blast furnace (BF-BOF) to electric arc furnace (EAF) and hydrogen-based direct reduced iron (H-DRI) — as a multi-decade investment decision with annual compliance checkpoints.

---

### 8.3 Cement & Lime Production World Model

**Industry share:** Very high (process emissions) | **Primary regulation:** ETS, CBAM, EPBD

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Diffusion (kiln simulation) + autoregressive (supply chain) |
| **Physics engine** | Calcination chemistry (CaCO₃ → CaO + CO₂), thermal profiles, clinker grinding |
| **Temporal horizon** | Hours (kiln optimization) → decades (alternative binder R&D) |
| **Spatial scope** | Kiln → plant → regional construction supply chain |
| **Sensor fusion** | Kiln thermocouples, raw material analyzers, stack gas analyzers, energy meters |
| **Key prediction tasks** | Clinker-to-cement ratio optimization, SCM substitution rates, process vs energy emissions split |
| **Regulatory encoding** | CBAM (cement is priority sector), EPBD embodied carbon limits (EN 15978 A1-A3) |
| **Causal reasoning** | Supplementary cementitious material (SCM) % → CO₂ reduction; CCUS viability |
| **Digital twin** | Rotary kiln digital twin with flame dynamics and raw meal chemistry |
| **Edge requirements** | Medium — kiln control loops can tolerate seconds-scale latency |
| **Data volume** | Medium — process data + EPD calculations |
| **DWS IQ 6 module** | EN 15978 calculations, material carbon passports, CBAM declarations |

**Unique characteristic:** Cement has **irreducible process emissions** (calcination releases CO₂ regardless of energy source), making this the hardest industry to decarbonize and requiring the world model to evaluate CCUS (Carbon Capture, Utilization and Storage) scenarios.

---

### 8.4 Chemicals & Petrochemicals World Model

**Industry share:** High | **Primary regulation:** ETS, CBAM (fertilizers), H₂ mandates

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Hybrid (autoregressive for process control + diffusion for molecular modeling) |
| **Physics engine** | Chemical reaction kinetics, mass/energy balances, distillation column dynamics |
| **Temporal horizon** | Milliseconds (reaction control) → years (feedstock transition planning) |
| **Spatial scope** | Reactor → plant → global chemical supply chain |
| **Sensor fusion** | Process chromatography, flow meters, pressure/temperature arrays, emissions CEMS |
| **Key prediction tasks** | Reaction yield optimization, energy integration, green hydrogen substitution impact, CBAM fertilizer cost |
| **Regulatory encoding** | ETS (process emissions), CBAM (fertilizers, hydrogen), REACH chemical safety |
| **Causal reasoning** | Feedstock switch (naphtha→bio-naphtha→electrochemical) → lifecycle emissions pathway |
| **Digital twin** | Full process plant simulation (Aspen/HYSYS class) enhanced with ML |
| **Edge requirements** | High for safety-critical processes — <1ms for reactor trip protection |
| **Data volume** | Very high — continuous process + safety instrumented systems |
| **DWS IQ 6 module** | Process emissions tracking, hydrogen transition roadmaps, CBAM calculations |

**Unique characteristic:** Must handle **dual-use carbon** — chemicals use carbon both as an energy source AND as a feedstock embedded in products, requiring the world model to distinguish between emissions and embodied carbon.

---

### 8.5 Aviation World Model

**Industry share:** 2-3% (growing) | **Primary regulation:** ETS, ReFuelEU (SAF mandates)

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Autoregressive (route planning + compliance forecasting) |
| **Physics engine** | Aerodynamic modeling (drag, lift, fuel burn rates), contrail formation physics |
| **Temporal horizon** | Hours (individual flights) → decades (fleet renewal) |
| **Spatial scope** | Airport → route → airline network → global aviation system |
| **Sensor fusion** | Flight data recorders, fuel flow meters, atmospheric sensors, ADS-B tracking |
| **Key prediction tasks** | Fuel burn per route, SAF blend impact, contrail-adjusted climate forcing, ETS allowance need |
| **Regulatory encoding** | ETS (free allowance phase-out: 25%/50%/75% 2024-2026, 100% by 2027), ReFuelEU SAF mandates |
| **Causal reasoning** | SAF blend ratio → net CO₂ reduction; flight path optimization → fuel savings + contrail avoidance |
| **Digital twin** | Fleet-level operational twin with real-time weather integration |
| **Edge requirements** | Low — batch flight analysis acceptable |
| **Data volume** | High — flight operations + fuel quality + market data |
| **DWS IQ 6 module** | SAF compliance tracking, offset verification, ETS allowance management |

**Unique characteristic:** Must model **non-CO₂ climate effects** (contrails, NOx at altitude) which may double aviation's climate impact beyond CO₂ alone, and SAF lifecycle assessment (well-to-wake).

---

### 8.6 Maritime Shipping World Model

**Industry share:** Significant | **Primary regulation:** ETS (2024), FuelEU Maritime

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | JEPA (voyage planning) + autoregressive (compliance forecasting) |
| **Physics engine** | Hydrodynamic modeling (hull resistance, propulsion efficiency, weather routing) |
| **Temporal horizon** | Days (voyage) → decades (fleet renewal cycles) |
| **Spatial scope** | Port → route → global shipping network |
| **Sensor fusion** | AIS tracking, engine performance monitors, fuel flow meters, weather/ocean models |
| **Key prediction tasks** | Voyage emissions, CII rating trajectory, optimal speed profiles, fuel mix strategy |
| **Regulatory encoding** | ETS (40%→70%→100% allowance surrender 2024-2026), FuelEU Maritime intensity reductions |
| **Causal reasoning** | Speed reduction → emissions vs delivery time trade-off; alternative fuel adoption → fleet capex |
| **Digital twin** | Vessel performance twin with hull degradation modeling |
| **Edge requirements** | Ship-board edge inference for real-time voyage optimization |
| **Data volume** | Medium — voyage data + port operations + weather |
| **DWS IQ 6 module** | Voyage emissions monitoring, intensity calculations, compliance forecasting |

**Unique characteristic:** Must handle the **100% allowance surrender deadline (2026)** as an immediate compliance cliff, and model the complex split between intra-EU (100% coverage) and extra-EU voyages (50% coverage).

---

### 8.7 Road Transport & Logistics World Model

**Industry share:** High | **Primary regulation:** ETS2 (2027), CO₂ standards

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Hybrid (JEPA for route optimization + autoregressive for fleet planning) |
| **Physics engine** | Vehicle dynamics, tire rolling resistance, aerodynamic drag, battery degradation |
| **Temporal horizon** | Hours (delivery routes) → decades (fleet electrification) |
| **Spatial scope** | Vehicle → depot → regional network → pan-European logistics |
| **Sensor fusion** | Vehicle telematics, GPS, fuel cards, charging infrastructure, traffic data |
| **Key prediction tasks** | Per-delivery emissions, fleet TCO with ETS2, optimal charging schedules, zero-emission zone compliance |
| **Regulatory encoding** | ETS2 (2027), CO₂ performance standards (2025/2030/2035), clean vehicle directive |
| **Causal reasoning** | Fleet mix (diesel→BEV→FCEV) → emissions trajectory; route optimization → fuel savings |
| **Digital twin** | Fleet-level operational twin with real-time vehicle tracking |
| **Edge requirements** | Medium — in-vehicle for driver assistance, fleet-level for planning |
| **Data volume** | Very high — continuous telematics from thousands of vehicles |
| **DWS IQ 6 module** | Fleet emissions management, zero-emission transition planning, ETS2 readiness |

**Unique characteristic:** Must model the **multi-modal logistics chain** — a single shipment may involve truck + rail + last-mile delivery, each with different emissions profiles and regulatory requirements.

---

### 8.8 Construction & Buildings World Model

**Industry share:** 36-40% lifecycle | **Primary regulation:** ETS2, EPBD, CSRD

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Diffusion (site simulation) + JEPA (material logistics) + NVIDIA Cosmos (occlusion reasoning) |
| **Physics engine** | Structural mechanics, thermal dynamics, material science (concrete curing, steel fatigue), construction site physics |
| **Temporal horizon** | Hours (daily operations) → 50+ years (building lifecycle per EN 15978) |
| **Spatial scope** | Work zone → site → project → portfolio → city-scale |
| **Sensor fusion** | LiDAR, cameras, IoT sensors, BIM models, material trackers, weather stations |
| **Key prediction tasks** | Embodied carbon per m², operational energy performance, material delivery optimization, site safety |
| **Regulatory encoding** | EPBD (embodied carbon reporting >1,000m² by 2028), EN 15978 (A1-D lifecycle stages), EN 15804 (material EPDs), ETS2 (heating) |
| **Causal reasoning** | Material substitution → embodied carbon change; BIM design change → lifecycle emissions impact |
| **Digital twin** | Full BIM-integrated digital twin with OpenUSD (per LWM V1 spec) |
| **Edge requirements** | On-site GN-100 class compute for sovereign data and real-time monitoring |
| **Data volume** | Very high — continuous sensor streams + BIM + supply chain |
| **DWS IQ 6 module** | **Full lifecycle carbon automation**, BIM integration, EN 15978/EN 15804, material carbon passports |

**Unique characteristic:** This is the **LWM V1 priority industry** — construction has the longest lifecycle horizon (50+ years for buildings), the most complex supply chain (hundreds of materials from global sources), and the most urgent regulatory deadline (EPBD 2028). The world model must maintain "lifetime memory" — persistent awareness of every material, its carbon footprint, and its degradation trajectory across the entire building lifecycle.

---

### Tier 2: Important Emissions Industries (ESR + Indirect ETS)

---

### 8.9 Agriculture & Livestock World Model

**Industry share:** 10-12% | **Primary regulation:** ESR, Methane Strategy, CAP

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | JEPA (crop/livestock prediction) + active inference (soil carbon) |
| **Physics engine** | Biogeochemical modeling (soil carbon cycles, nitrogen fixation, methane from enteric fermentation) |
| **Temporal horizon** | Seasons (crop cycles) → decades (soil carbon sequestration) |
| **Spatial scope** | Field → farm → regional → national (ESR) |
| **Sensor fusion** | Satellite imagery, soil moisture sensors, livestock monitoring, weather data, yield monitors |
| **Key prediction tasks** | Farm-level GHG emissions, soil carbon stock changes, fertilizer optimization, methane reduction pathways |
| **Regulatory encoding** | ESR national targets (~30% by 2030), Common Agricultural Policy eco-schemes, Methane Strategy |
| **Causal reasoning** | Feed composition → methane emissions; cover crops → soil carbon sequestration rate |
| **Digital twin** | Farm-level twin with soil, crop, and livestock sub-models |
| **Edge requirements** | Low — seasonal planning cycles tolerate batch processing |
| **Data volume** | Medium — satellite + IoT sensors + weather + yield data |
| **DWS IQ 6 module** | Farm carbon calculator, supply chain transparency, CAP compliance |

**Unique characteristic:** Must model **biological carbon cycles** — agriculture is unique in being both an emission source (methane, N₂O) and a potential carbon sink (soil carbon sequestration), requiring the world model to track bidirectional carbon flows.

---

### 8.10 Waste Management & Recycling World Model

**Industry share:** 3-4% | **Primary regulation:** Waste Framework Directive, Landfill Directive

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Autoregressive (waste flow prediction) + diffusion (sorting optimization) |
| **Physics engine** | Decomposition chemistry (anaerobic digestion, methane generation), material science (recyclability) |
| **Temporal horizon** | Days (collection) → decades (landfill methane) |
| **Spatial scope** | Collection route → facility → regional → circular economy network |
| **Sensor fusion** | Fill-level sensors, sorting cameras, gas analyzers, weighbridges, composition analyzers |
| **Key prediction tasks** | Methane generation rates, recycling yields, circular material flows, energy-from-waste efficiency |
| **Regulatory encoding** | Waste Framework Directive (recycling targets), Landfill Directive (methane capture), Extended Producer Responsibility |
| **Causal reasoning** | Source separation → recycling quality; methane capture → avoided emissions credits |
| **Digital twin** | Facility-level twin with material flow modeling |
| **Edge requirements** | Medium — real-time sorting requires vision AI at conveyor speed |
| **Data volume** | Medium — waste composition + facility operations |
| **DWS IQ 6 module** | Methane capture tracking, circular economy metrics, recycling rate reporting |

**Unique characteristic:** Must track **negative emissions** — waste-to-energy and methane capture create avoided emissions that can generate carbon credits, requiring the world model to calculate counterfactual baselines.

---

### 8.11 Aluminium Production World Model

**Industry share:** High (energy) | **Primary regulation:** ETS, CBAM (2026)

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | JEPA (production planning) + active inference (potline optimization) |
| **Physics engine** | Electrolysis chemistry (Hall-Héroult process), thermal balance, anode effects |
| **Temporal horizon** | Hours (potline optimization) → years (smelter decarbonization) |
| **Spatial scope** | Pot → potroom → smelter → global supply chain |
| **Sensor fusion** | Potline voltage/current monitors, thermal imaging, energy meters, anode quality |
| **Key prediction tasks** | Energy intensity per tonne, PFC emissions, anode effect frequency, CBAM border cost for imports |
| **Regulatory encoding** | ETS (free allowance phase-out), CBAM (aluminium is core sector from 2026) |
| **Causal reasoning** | Renewable electricity share → indirect emissions reduction; inert anode technology → direct emission elimination |
| **Digital twin** | Potline digital twin with real-time electrochemical modeling |
| **Edge requirements** | Medium — potline control at seconds-scale |
| **Data volume** | High — continuous process monitoring |
| **DWS IQ 6 module** | Energy source tracking, renewable electricity certificates, CBAM declarations |

**Unique characteristic:** Aluminium's emissions are **80% from electricity** (indirect, Scope 2), making the grid carbon intensity the dominant variable. The world model must track real-time grid mix, not annual averages.

---

### 8.12 Pulp, Paper & Printing World Model

**Industry share:** Medium | **Primary regulation:** ETS, LULUCF

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | JEPA (forestry modeling) + autoregressive (production scheduling) |
| **Physics engine** | Forestry growth modeling, pulping chemistry, paper machine thermodynamics |
| **Temporal horizon** | Days (production) → 50+ years (forest rotation cycles) |
| **Spatial scope** | Machine → mill → forest estate → national LULUCF |
| **Sensor fusion** | Satellite imagery (forest health), process sensors, energy meters, wood quality analyzers |
| **Key prediction tasks** | Forest carbon stock, biogenic carbon accounting, energy efficiency, recycled content optimization |
| **Regulatory encoding** | ETS, LULUCF (net GHG reduction targets from 2026), EU Deforestation Regulation |
| **Causal reasoning** | Harvest rate → forest carbon sink capacity; recycled fibre content → virgin wood demand |
| **Digital twin** | Mill digital twin + forest inventory twin |
| **Edge requirements** | Low — batch planning acceptable |
| **Data volume** | Medium — satellite + process data |
| **DWS IQ 6 module** | Forestry carbon accounting, supply chain transparency, LULUCF compliance |

**Unique characteristic:** Must model the **biogenic carbon cycle** — forests absorb CO₂ during growth and release it when harvested, creating a complex temporal accounting challenge where the world model must track carbon across 50+ year forest rotation cycles.

---

### 8.13 Petroleum Refining World Model

**Industry share:** High | **Primary regulation:** ETS, ReFuelEU

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Hybrid (diffusion for process simulation + autoregressive for market/compliance forecasting) |
| **Physics engine** | Crude oil distillation, catalytic cracking, hydrogen production, blending optimization |
| **Temporal horizon** | Hours (blending) → decades (refinery transformation) |
| **Spatial scope** | Unit → refinery → supply chain → market |
| **Sensor fusion** | Process analyzers, flow meters, stack gas monitors, crude quality analyzers |
| **Key prediction tasks** | Refinery emissions intensity, SAF co-processing yield, hydrogen consumption, decline pathway trajectory |
| **Regulatory encoding** | ETS (refinery emissions), ReFuelEU (SAF production mandates), Fuel Quality Directive |
| **Causal reasoning** | Crude slate change → emission intensity; co-processing bio-feedstocks → SAF yield vs emissions trade-off |
| **Digital twin** | Refinery-wide process twin (LP/NLP model enhanced with ML) |
| **Edge requirements** | Medium — process optimization at minutes-scale |
| **Data volume** | Very high — continuous process + crude quality + market |
| **DWS IQ 6 module** | Decline pathway planning, SAF production tracking, ETS management |

**Unique characteristic:** Must model the **managed decline** of petroleum refining — the world model needs to optimize current operations for compliance while simultaneously planning the transformation to bio-refineries, SAF production, and green hydrogen, balancing short-term profitability against long-term viability.

---

### 8.14 Food & Beverage Processing World Model

**Industry share:** Medium | **Primary regulation:** ESR, Energy Efficiency Directive

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Autoregressive (supply chain + compliance) + JEPA (process optimization) |
| **Physics engine** | Food process engineering (pasteurization, drying, fermentation, cold chain thermodynamics) |
| **Temporal horizon** | Hours (production batches) → years (supply chain transformation) |
| **Spatial scope** | Production line → factory → supply chain → consumer |
| **Sensor fusion** | Process temperatures, energy meters, cold chain monitors, packaging sensors |
| **Key prediction tasks** | Product carbon footprint, supply chain emissions hotspots, energy efficiency improvements, food waste reduction |
| **Regulatory encoding** | ESR, Energy Efficiency Directive, Farm to Fork strategy, EU Packaging Regulation |
| **Causal reasoning** | Ingredient sourcing change → supply chain carbon impact; packaging redesign → lifecycle emissions |
| **Digital twin** | Factory twin with production line and cold chain modeling |
| **Edge requirements** | Medium — food safety requires real-time temperature monitoring |
| **Data volume** | High — production + supply chain + consumer data |
| **DWS IQ 6 module** | Agricultural supply chain carbon, energy optimization, product carbon labelling |

**Unique characteristic:** Must handle **scope 3 dominance** — for most food products, 70-90% of emissions come from agricultural supply chain (Scope 3), not manufacturing, requiring the world model to extend deep into farm-level operations.

---

### 8.15 Glass & Ceramics Production World Model

**Industry share:** Medium | **Primary regulation:** ETS, CBAM (indirect)

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | Diffusion (furnace simulation) + autoregressive (production planning) |
| **Physics engine** | Glass melting thermodynamics, ceramic sintering, combustion chemistry, thermal cycling |
| **Temporal horizon** | Hours (furnace campaigns) → years (technology transitions: oxy-fuel, electric) |
| **Spatial scope** | Furnace → plant → supply chain |
| **Sensor fusion** | Furnace thermocouples, energy meters, batch composition analyzers, stack gas monitors |
| **Key prediction tasks** | Energy intensity per tonne, cullet (recycled glass) optimization, electric melting viability |
| **Regulatory encoding** | ETS (furnace emissions), indirect CBAM (soda ash imports), Energy Efficiency Directive |
| **Causal reasoning** | Cullet ratio increase → energy savings + CO₂ reduction; electric furnace → zero direct combustion emissions |
| **Digital twin** | Furnace twin with glass melt dynamics |
| **Edge requirements** | Low-medium — furnace campaigns measured in days |
| **Data volume** | Medium — process data + energy |
| **DWS IQ 6 module** | Process emissions tracking, material carbon tracking, ETS management |

**Unique characteristic:** Glass and ceramics have **high thermal inertia** — furnaces run continuously for years before rebuilds. The world model must optimize within an existing furnace campaign while planning the technology transition at the rebuild cycle.

---

### 8.16 Mining & Quarrying World Model

**Industry share:** Medium | **Primary regulation:** ETS (indirect), Critical Raw Materials Act

| Characteristic | Specification |
|---------------|--------------|
| **Primary architecture** | JEPA (extraction planning) + diffusion (geological modeling) |
| **Physics engine** | Rock mechanics, blasting dynamics, material transport, crushing/grinding energy |
| **Temporal horizon** | Days (extraction) → decades (mine lifecycle, site rehabilitation) |
| **Spatial scope** | Working face → mine site → regional geology → global CRM supply chain |
| **Sensor fusion** | Geological surveys, drill monitoring, fleet GPS, energy meters, dust/emissions monitors |
| **Key prediction tasks** | Extraction efficiency, energy per tonne, site rehabilitation carbon cost, CRM supply chain compliance |
| **Regulatory encoding** | ETS (indirect energy costs), Critical Raw Materials Act, Mine Waste Directive, Environmental Impact Assessment |
| **Causal reasoning** | Electrification of haulage → direct emission reduction; mine planning → total energy consumption |
| **Digital twin** | Mine-site twin with geological model and fleet tracking |
| **Edge requirements** | Medium — remote sites require autonomous edge operation |
| **Data volume** | High — geological + fleet + environmental monitoring |
| **DWS IQ 6 module** | Extraction emissions tracking, CRM supply chain compliance, site rehabilitation planning |

**Unique characteristic:** Must model **resource depletion dynamics** — the world model must integrate geological uncertainty (ore body prediction) with environmental compliance (rehabilitation cost) and supply chain criticality (EU Critical Raw Materials Act), making it uniquely multi-dimensional.

---

## 9. Can GPT-2-Scale Models Serve Industry World Models?

### 9.1 The Karpathy Scale Analysis

Karpathy demonstrated that GPT-2 (124M parameters) can be reproduced in 90 minutes for $20. Can similar-scale models serve as industry world models?

| Factor | GPT-2 (124M) | Industry World Model Requirement | Verdict |
|--------|-------------|--------------------------------|---------|
| **Parameter count** | 124M | 100M-10B depending on industry complexity | Sufficient for narrow domains (e.g., single plant) |
| **Training data** | ~10B tokens of web text | Domain-specific: sensor data, regulations, process data | Different modality, but similar volume feasible |
| **Training cost** | $20-$1,000 | $100-$50,000 per industry domain | Affordable per industry |
| **Inference hardware** | Consumer GPU | Edge device (GN-100 class) to cloud (A100) | Hardware available |
| **Context window** | 1,024 tokens | 10K-1M tokens (longer horizons) | Needs architectural extension |
| **Modality** | Text only | Multi-modal (required) | Needs multi-modal extension |

### 9.2 The "World Model Factory" Approach

Rather than building 16 monolithic world models, the Karpathy-inspired approach suggests:

```
Foundation World Model (Cosmos/JEPA class, 1-10B params)
    ├── Physics engine (shared thermodynamics, chemistry, mechanics)
    ├── Regulatory ontology layer (shared EU regulation encoding)
    └── Industry adapter (100M-500M params per industry)
         ├── Domain-specific tokenizer
         ├── Sensor fusion module (industry-specific instruments)
         ├── Compliance rules (industry-specific regulations)
         └── Causal graph (industry-specific cause-effect relationships)
```

**Cost estimate per industry adapter:** €10K-€50K training cost, 1-4 weeks training time, deployable on GN-100 class edge hardware.

### 9.3 Verdict

**Yes, with caveats.** Karpathy's GPT-2 experiments prove that capable models can be built efficiently and deployed on modest hardware. The same principles apply to industry world models:

1. **Use a foundation world model** (Cosmos, JEPA) as the base — not train from scratch
2. **Fine-tune with domain data** — industry-specific sensor data, process parameters, regulations
3. **Keep adapters small** — GPT-2-scale (100M-500M) adapters per industry are sufficient
4. **Deploy at edge** — llm.c-style C/CUDA implementations enable sovereign edge deployment
5. **Train openly** — publish model architectures and training recipes (per Karpathy's philosophy)

---

## 10. Implications for DWS IQ 6 and the Lifetime World Model

### 10.1 Validation of the LWM Architecture

The LWM V1 specification (NVIDIA Inception submission) aligns with the 2026 world model landscape:

| LWM V1 Feature | 2026 Ecosystem Validation |
|----------------|--------------------------|
| **Cosmos foundation model** | Cosmos 2.5 released with Predict + Transfer + Reason + RL |
| **Persistent Temporal Latent Space** | JEPA research validates persistent latent representations |
| **Sovereign edge deployment (GN-100)** | NVIDIA GB10, Siemens Digital Twin Composer both support edge |
| **OpenUSD digital twin** | Industry standard (Siemens, NVIDIA, Pixar) |
| **10,000+ Fit for 55 scenario simulation** | Confirmed as minimum viable for compliance planning |
| **Sensor fusion (FQ2BAM)** | NVIDIA NIM provides standardized fusion pipeline |

### 10.2 The 16-Industry Expansion Strategy

```
Phase 1 (2026): Construction (LWM V1) — proven domain
Phase 2 (2027): Steel, Cement, Chemicals — CBAM urgency
Phase 3 (2028): Maritime, Aviation, Road Transport — ETS/ETS2 compliance
Phase 4 (2029): Agriculture, Energy, Aluminium — ESR + energy transition
Phase 5 (2030): Remaining 6 industries — full Fit for 55 coverage
```

### 10.3 Architecture Decision

The study recommends a **modular world model factory** for DWS IQ 6:

```
┌─────────────────────────────────────────────────────┐
│                 DWS IQ 6 BRAIN                       │
│         Multi-Agent Orchestration Layer               │
├─────────────────────────────────────────────────────┤
│           LIFETIME WORLD MODEL (LWM)                 │
│  ┌───────────────────────────────────────────────┐   │
│  │     Foundation Layer (Cosmos + JEPA)           │   │
│  │     Physics | Regulatory | Carbon Accounting   │   │
│  ├───────────────────────────────────────────────┤   │
│  │     Industry Adapters (16 × 100M-500M)        │   │
│  │     ┌─────┬─────┬─────┬─────┬─────┬─────┐    │   │
│  │     │Power│Steel│Cement│Chem │Aviat│Marit│    │   │
│  │     ├─────┼─────┼─────┼─────┼─────┼─────┤    │   │
│  │     │Road │Const│Agri │Waste│Alum │Paper│    │   │
│  │     ├─────┼─────┼─────┼─────┼─────┼─────┤    │   │
│  │     │Petro│Food │Glass│Mine │ ... │ ... │    │   │
│  │     └─────┴─────┴─────┴─────┴─────┴─────┘    │   │
│  └───────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│                 BODY (Firehorse Suite)                │
│     Reports | Automation | ContentMS | Omnichannel    │
├─────────────────────────────────────────────────────┤
│                 HANDS (Lifetime Fleet)                │
│            IoT | Robots | Edge Devices                │
└─────────────────────────────────────────────────────┘
```

---

## 11. Conclusions

### 11.1 Key Findings

1. **Karpathy's GPT-2 experiments establish the accessibility thesis** — capable models can be built efficiently, reproduced cheaply, and deployed on modest hardware. This principle extends to industry world models.

2. **No single world model architecture serves all 16 industries.** Each industry requires a specific combination of physics engines, temporal horizons, sensor fusion, and regulatory encoding. The five competing architectures (autoregressive, diffusion, JEPA, hybrid, active inference) each have optimal niches.

3. **2026 is the inflection year for world models** — AMI Labs (€3B), Cosmos 2.5, Genie 3, Marble, and Siemens Digital Twin Composer all converge on industrial world models in 2026.

4. **The modular world model factory is the right architecture** — a shared foundation layer (physics + regulatory + carbon) with lightweight industry-specific adapters, rather than 16 monolithic models.

5. **Fit for 55 creates a mandatory market** — world models are not optional for EU-regulated industries; they are the only scalable approach to continuous compliance across 10+ intersecting regulations.

6. **The LWM V1 architecture is validated** — persistent memory, sovereign edge deployment, and Cosmos foundation model alignment are all confirmed as correct design choices by the 2026 ecosystem.

### 11.2 Open Questions

1. How will world model evaluation standards emerge? (No equivalent of BLEU/ROUGE for physics prediction)
2. Will LeCun's AMI Labs deliver commercial JEPA products, or remain academic?
3. How will cross-industry world model interactions be governed? (e.g., steel + construction supply chain)
4. What is the minimum data volume needed to fine-tune a foundation world model for a new industry?
5. How will EU AI Act Article 12 logging requirements apply to world model predictions?

---

## 12. References

### Karpathy's Work
- [Reproducing GPT-2 (124M) in llm.c in 90 minutes for $20](https://github.com/karpathy/llm.c/discussions/481) — Karpathy, 2024
- [nanoGPT Repository](https://github.com/karpathy/nanoGPT) — Karpathy, 2023 (deprecated Nov 2025 in favour of nanochat)
- [2025 LLM Year in Review](https://karpathy.bearblog.dev/year-in-review-2025/) — Karpathy, December 2025
- [Neural Networks: Zero to Hero](https://karpathy.ai/zero-to-hero.html) — Karpathy, educational series
- [Reproducing GPT-2 124M: Key Insights from Andrej Karpathy's 4-Hour Deep Dive](https://aliissa99.medium.com/reproducing-gpt-2-124m-key-insights-from-andrej-karpathys-4-hour-deep-dive-3952046c5d31) — Ali Issa, 2024

### World Models
- [World Models Race 2026: How LeCun, DeepMind, and World Labs Are Redefining the Path to AGI](https://introl.com/blog/world-models-race-agi-2026) — Introl Blog, 2026
- [The Architectural Divergence: Why LeCun's $3.5B Bet on World Models Signals a Paradigm Inflection Point](https://medium.com/@shashwatabhattacharjee9/the-architectural-divergence-why-lecuns-3-5b-0926f03cbf26) — Bhattacharjee, 2026
- [The next AI revolution could start with world models](https://www.scientificamerican.com/article/world-models-could-unlock-the-next-revolution-in-artificial-intelligence/) — Scientific American
- [World Models: Five Competing Approaches](https://themesis.com/2026/01/07/world-models-five-competing-approaches/) — Themesis, Inc., January 2026
- [World Models: JEPA and VL-JEPA](https://themesis.com/2026/01/21/world-models-jepa-and-vl-jepa/) — Themesis, Inc., January 2026
- [Yann LeCun's new venture AMI Labs](https://www.technologyreview.com/2026/01/22/1131661/yann-lecuns-new-venture-ami-labs/) — MIT Technology Review, January 2026
- [V-JEPA 2: Self-Supervised Video Models Enable Understanding, Prediction and Planning](https://arxiv.org/html/2506.09985v1) — Meta AI, 2025
- [Cosmos World Foundation Model Platform for Physical AI](https://arxiv.org/abs/2501.03575) — NVIDIA Research, January 2025

### Industrial Digital Twins
- [Siemens Digital Twin Composer](https://news.siemens.com/en-us/digital-twin-composer-ces-2026/) — Siemens, CES 2026
- [Siemens and NVIDIA Expand Partnership for Industrial AI](https://nvidianews.nvidia.com/news/siemens-and-nvidia-expand-partnership-industrial-ai-operating-system) — NVIDIA, 2026
- [World Models: Strategic and Technical Imperatives for 2025](https://ai2.work/technology/ai-tech-world-models-rise-in-2025/) — AI2Work, 2025

### EU Fit for 55
- [Fit for 55 — European Council](https://www.consilium.europa.eu/en/policies/fit-for-55/) — Consilium
- [Fit for 55 Package: EU Revises ETS and Establishes CBAM](https://www.klgates.com/Fit-For-55-Package-EU-Revises-The-EU-Emissions-Trading-System-And-Establishes-a-New-Carbon-Border-Adjustment-Mechanism-5-25-2023) — K&L Gates, 2023
- [Fit for 55: EU Climate Package Explained](https://www.homaio.com/post/what-is-the-fit-for-55-legislative-package) — Homaio

### DWS IQ 6 Internal References
- `V1_LWM.md` — LWM V1 NVIDIA Inception Submission
- `16-INDUSTRIES.md` — 16 Industry Fit for 55 Impact Matrix
- `ONTOLOGY.md` — DWS Ontology & Lifetime World Model Framework
- `docs/PHD_FIREHORSE_EN.md` — PhD Thesis (market signals, scientific framing)

---

_Document generated using Firehorse Operations Model with Claude Code_
_Session: claude/industry-world-models-study-Mk2mu_
_Date: 21.05.2026_

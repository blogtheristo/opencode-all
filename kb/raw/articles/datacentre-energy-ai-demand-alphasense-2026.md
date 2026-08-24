# Datacentre Energy & AI Demand — AlphaSense Expert Calls (2026)

Source: Two AlphaSense expert-call summaries circulated publicly via @AlphaSenseInc.
Supplied by Risto Paarni to Claude Code session `claude/datacentre-energy-ai-demand-bnWxc` on 2026-05-20.

Primary attributions:

- **Interview A — Siemens employee** (energy equipment OEM; ~40 years in sector).
  Topic: backlog, order sizing, margin expansion, sustainability deprioritization, double-booking, cooling.
- **Interview B — Former Microsoft employee** (hyperscaler capacity).
  Topic: hyperscaler capacity ranking, behind-the-meter microgrids, gas + BESS + SMR mix, $/MW build cost.

Both calls are dated reads (knowledge cutoff at time of ingest). Treat individual numbers as point-in-time market signal, not standing fact.

## Themed synthesis

### 1. Demand shock (Interview A, points 1–3)

- Individual orders are now **2× the annual output of a single Siemens factory**. "Shocking" even to 40-year veterans.
- Last **5–8 months**: clients no longer require CO₂/sustainability analysis or competitive pitches — OEMs just need to "catch the order."
- Decisions are being made in days, not quarters. Equipment backlog at major OEMs is **5–6 years**; **transformers are tighter still**.

### 2. Order sizing & integration shift (Interview A, points 5–6)

- Typical order has jumped from **20–30 MW → 200–500 MW**.
- Customers used to multi-source across OEMs; now they want **integrated, standardized solutions** from a single vendor (reduces integration risk and accelerates commissioning).
- **N+1 (and N+2) gas turbines** are being ordered even when nameplate site demand is e.g. 100 MW — extra units bought as both backup and pre-positioned headroom for the next datacentre expansion phase.

### 3. Supply chain: double-booking risk (Interview A, point 7)

- Lead times so long (transformers, switchgear) that some buyers are **placing the same order with multiple OEMs** to hedge.
- Implication: nominal backlog overstates real demand. A future "phantom cancellation" wave is a known risk among OEMs.

### 4. Sustainability deprioritization (Interview A, points 4, 8, 9)

- "Power at any expense, reliable power. They say they will think about sustainability later."
- PUE and WUE improvements are being **reinvested into more compute**, not into lowering absolute footprint — classic **Jevons rebound**.
- **Liquid cooling** is expensive and **water availability is region-limiting** (matches the broader EU water-stress concerns DWS IQ tracks under ESRS E3).

### 5. Margin expansion (Interview A, point 10)

- Equipment margins: **4–6% (2–3 years ago) → 20–23% today, 40% in some cases**.
- Buyers know the margin — and pay it anyway, because the binding constraint is **delivery date**, not price.

### 6. Hyperscaler capacity race (Interview B)

- Ranking on **current available capacity**: **MSFT > GOOGL > META > AMZN**.
  - GOOGL: fast deployment + external TPU commercialization.
  - META: uncertain available capacity.
  - AMZN: held back by overindexing on Inferentia (short-term drag; not viewed as permanent).
- Capacity crunch expected to persist; **first major supply wave ~2028**, partial relief possibly **2030**. Not called a full resolution.

### 7. Behind-the-meter power economics (Interview B)

- Behind-the-meter microgrids in **gas-rich regions**: **$0.03–$0.07/kWh** vs **grid $0.17–$0.21/kWh**.
- Cost delta large enough to justify dedicated build-out, not just hedging.
- Near-term mix: **gas turbines + BESS + solar**. Stated **ultimate destination: SMRs** — permitting activity is accelerating.

### 8. AI-vs-standard build cost (Interview B)

- **Non-GPU datacentre**: ~**$10–12M / MW** all-in.
- **AI-focused build**: ~**$20–22M / MW** all-in.
- Delta driven by **power density, cooling strategy, specialized equipment**. Regional land costs add a further layer on top.

## DWS IQ implications

| Signal | DWS IQ exposure / opportunity |
| --- | --- |
| 5–6 year transformer/switchgear backlog | **Schedule-Genius** + **Logistics agent** can quantify project delay risk for any client procuring grid equipment after 2026. EU buyers should treat transformer lead-time as a top-3 project critical-path item. |
| Sustainability deprioritized by buyers | **Compliance agent** posture: this short-term posture **collides with CSRD / ESRS E1 (climate), E3 (water), E4 (biodiversity)** disclosure obligations for EU-operating datacentres from FY2025/2026 reports onward. There is a closing window where "we'll do sustainability later" stops being defensible to auditors. DWS IQ should flag this gap proactively to enterprise customers. |
| Jevons rebound (better PUE → more compute) | Reinforces the **PhD Firehorse thesis**: efficiency alone does not reduce datacentre energy absolute footprint. Supports the case for **DWS IQ Lifetime-Scope absolute-footprint accounting** rather than intensity-only metrics. |
| Liquid cooling + water stress | **Site-safety + Material Oracle** can score datacentre sites for water-availability risk (links to EU water-stress maps, EFRAG ESRS E3 indicators). Direct relevance to **SiteSense** and to **carbon-analysis** lifecycle stages. |
| Order sizing 20→500 MW, single-vendor preference | OEMs that can ship integrated standardized solutions win. **Material Oracle** can support OEM RFP responses by surfacing embodied-carbon data per EN 15978 without slowing the order cycle. |
| Behind-the-meter microgrids + SMR trajectory | Long-horizon **PhD thesis** market signal: EU regulatory posture on behind-the-meter generation and SMR permitting will diverge from US trajectory. Sovereignty-assess agent should track this — EU sovereign-cloud datacentres may need different power strategies than US hyperscalers. |
| MSFT > GOOGL > META > AMZN capacity ranking | Competitor-surveillance agent input. Affects DWS IQ enterprise-sales messaging on **EU-sovereign alternatives** to US hyperscaler capacity. |
| AI build cost ~$20–22M/MW | Pricing anchor for **Viability agent** when modelling DWS IQ deployments at AI-class datacentres. |
| Double-booking on transformers | **KYA / Quality-Gate** signal: when scoring supplier-side reliability of large infra projects, assume nominal backlog is inflated; haircut to ~70–80% of stated. |

## Wiki backlinks (create on next compile)

- `wiki/datacentre-energy-demand.md` — main concept.
- `wiki/transformer-shortage-2026.md` — supply chain primer.
- `wiki/hyperscaler-capacity-race.md` — MSFT/GOOGL/META/AMZN comparison.
- `wiki/behind-the-meter-microgrid.md` — gas + BESS + solar economics.
- `wiki/smr-small-modular-reactor.md` — long-horizon power.
- `wiki/jevons-paradox-compute.md` — efficiency rebound in AI workloads.
- `wiki/pue-wue-datacentre-metrics.md` — efficiency metric primer.
- `wiki/esrs-e1-climate.md`, `wiki/esrs-e3-water.md` — CSRD touch-points.
- `wiki/eu-ai-act-datacentre.md` — regulatory exposure for AI-focused builds.

## DWS repo cross-references (pre-existing, not new)

- `docs/PHD_FIREHORSE_EN.md` / `docs/PHD_FIREHORSE_FI.md` — market-signal home for long-horizon datacentre + energy + AI demand thesis.
- `Store/` — DWS IQ SKUs (carbon-analysis, sovereignty-assess, site-safety) whose value proposition is reinforced by these signals.
- `docs/DWS_SKILLS_GUIDE.md` — agents named in the implications table.
- `DWS7_ROADMAP.md` — datacentre / sovereign-power thread.

## Ingest metadata

- Ingested: 2026-05-20
- Ingested by: Claude Code, session `claude/datacentre-energy-ai-demand-bnWxc`
- Source recency: dated AlphaSense expert calls (no formal publication date); treat numbers as **point-in-time signal, not standing fact**.
- Confidence: HIGH on directional claims (backlog, demand shock, margin expansion, hyperscaler ranking). MEDIUM on point estimates ($/kWh, $/MW, MSFT capacity lead) — re-verify before quoting externally.
- Reproduction: bullet-point summaries are paraphrases supplied to the session, not full verbatim transcripts.

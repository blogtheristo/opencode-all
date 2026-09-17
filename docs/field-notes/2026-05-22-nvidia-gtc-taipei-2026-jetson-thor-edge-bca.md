# Field Note: NVIDIA GTC Taipei 2026 — Jetson Thor Wins BCA Golden Award, Edge AI Moves to Blackwell

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (claude-opus-4-7) | Session: claude/field-note-edge-NvTqV | Date: 22.05.2026 | Changes: Initial creation — Field note on NVIDIA GTC Taipei at Computex 2026, Jetson Thor BCA Golden Award, edge-AI implications for DWS Control Room and LWM edge runtime

Session Links & References:
  - Claude Code (claude/field-note-edge-NvTqV): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-05-22-nvidia-gtc-taipei-2026-jetson-thor-edge-bca.md

Document Status:
  - Created: 22.05.2026
  - Last Modified: 22.05.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Ontology Tags

- **Geography:** Global > Asia > Taiwan (Taipei) > Computex / GTC Taipei
- **Sector:** Technology > AI/ML > Edge AI > Physical AI > Robotics > Industrial Edge
- **Entities:** NVIDIA, Jetson Thor, Jetson Orin, Blackwell, Vera Rubin NVL72, Alpamayo, TAITRA, Computex Best Choice Awards (BCA), Acer Veriton GN100, DGX Spark, DWS Control Room, LWM, Lifetime Fleet
- **Temporal Context:** 2026-Q2, Computex / GTC Taipei (1–4 June 2026), Pre-keynote BCA cycle, Post Blackwell Ultra ramp
- **Confidence:** High (NVIDIA official + BCA jury announcements)

---

## Source

NVIDIA Blog — *NVIDIA GTC Taipei at COMPUTEX: Live Updates on What's Next in AI*
https://blogs.nvidia.com/blog/nvidia-gtc-taipei-computex-2026-news/#bca-awards
(Shared by Risto via X/Twitter, 22.05.2026.)

---

## Executive Summary

Ahead of NVIDIA's GTC Taipei keynote at Computex 2026 (1–4 June), the **Computex Best Choice Awards (BCA)** jury handed NVIDIA three of the headline prizes — and the one that matters most for DWS is the **Jetson Thor Golden Award** in the edge-AI category. Jetson Thor is now positioned as the production-grade edge brain for physical AI and autonomous robots: **2,070 FP4 TFLOPS**, **7.5× the compute and 3.5× the energy efficiency of Jetson Orin**, in a **40–130 W** envelope.

For DWS this closes the loop we have been tracking since the Acer Veriton GN100 work and the DGX Spark sandbox notes: the **edge tier of LWM** finally has a Blackwell-class target with shippable economics. Our current Veriton + Orin-class assumptions need a refresh.

---

## Key BCA 2026 Winners (NVIDIA)

| Product | Award | DWS-relevant tier |
|---|---|---|
| **Jetson Thor** | Golden Award (Edge AI / Physical AI) | **Edge / Field device** |
| **Vera Rubin NVL72** | Golden Award + Sustainable Tech Special Award | Core (data-centre, post-Blackwell-Ultra) |
| **Alpamayo** (open AV platform) | Vehicle Technology & Smart Cockpit Category Award | Adjacent (mobility / AV) |

The BCA is run by TAITRA's Computex jury and is the most-watched pre-keynote signal of where NVIDIA expects Taiwanese ODM/OEM volume to land in the next 12 months. Awarding the edge module the same "Golden" tier as the rack-scale Vera Rubin is intentional — NVIDIA is signalling that **edge silicon is a first-class product line**, not a downstream derivative.

---

## Jetson Thor — What Changed vs. Orin

| Spec | Jetson Orin (current DWS edge baseline) | **Jetson Thor (new)** | Delta |
|---|---|---|---|
| AI compute | ~275 INT8 TOPS (Orin AGX 64GB) | **2,070 FP4 TFLOPS** | **~7.5×** |
| Architecture | Ampere | **Blackwell** | New gen |
| Power envelope | 15–60 W | **40–130 W** | Higher ceiling, same floor band |
| Energy efficiency | baseline | **3.5×** | Per NVIDIA |
| Target workload | Vision, small models | **Generative + agentic edge, physical AI** | Workload class jump |
| Production status | Mature | **In production across "hundreds of applications"** | Past pilot stage |

The numbers come from NVIDIA's BCA citation and the Jetson Thor product page. The headline: Thor's lower-bound power (40 W) is **above** Orin Nano's typical 7–15 W band, so it is not a 1-to-1 replacement for the smallest Orin SKUs — it is a new tier between Orin AGX and a workstation.

---

## Why This Matters for DWS

### 1. LWM Edge tier finally has a target

We have been pretending the edge story is "Acer Veriton GN100 + Ollama + an Orin-class fallback." Thor changes the substrate:

- **Control Room edge devices** (LWM remote-control skill, robot feed) can now host a small reasoning model on-device instead of round-tripping to DGX Spark or cloud.
- **Site sense at the edge** — crane warnings, EN 13001 checks, weather risk fusion — becomes a Thor workload instead of an Orin + cloud workload.
- **Sovereignty story improves**: edge inference on EU-deployed Thor modules keeps data physically out of CLOUD Act jurisdiction even when the upstream model lineage is US.

### 2. The Veriton GN100 narrative needs an update

Our existing field notes (`2026-02-27-acer-veriton-gn100-nvidia-gpg-key-fix.md`, `2026-03-01-veriton-gn100-ollama-dev-environment.md`, `2026-03-10-acer-dgx-sandbox-strategy.md`) treat the Veriton as the "edge sandbox" and DGX Spark as the "EU-resident inference fallback." Thor inserts a third rung:

```
Edge tier today                 Edge tier with Thor (post-Computex)
┌──────────────────┐            ┌──────────────────┐
│ Acer Veriton     │            │ Acer Veriton     │
│ GN100 (Ollama)   │            │ GN100 (Ollama)   │
│ ~workstation     │            │ ~workstation     │
└────────┬─────────┘            └────────┬─────────┘
         │                               │
         │                      ┌────────▼─────────┐
         │                      │ Jetson Thor      │  ← NEW
         │                      │ 2,070 FP4 TFLOPS │
         │                      │ 40–130 W field   │
         │                      └────────┬─────────┘
         │                               │
┌────────▼─────────┐            ┌────────▼─────────┐
│ DGX Spark (EU)   │            │ DGX Spark (EU)   │
└──────────────────┘            └──────────────────┘
```

This is the missing tier for **deployed-at-customer-site** inference — the brackets where Veriton is too big/expensive and the cloud is too far away.

### 3. Pricing signal for Q2/Q3 procurement

ODM partners (Aaeon, Advantech) have already shown Thor-based products in BCA submissions. Expect commercial SKUs in volume from **Q3 2026**, which aligns with our DWS IQ V1 customer-site rollout window. Procurement should be told to **hold off on Orin AGX bulk purchases**; a fortnight of patience changes the spec sheet meaningfully.

### 4. NVIDIA ISV / Connect angle

We are already in the NVIDIA Connect ISV programme (see `2026-03-08-nvidia-connect-isv-approved.md`). Thor BCA recognition is the moment to push for **early Thor dev-kit allocation** through the ISV channel — the public dev-kit queue will be long.

### 5. Thor T5000 is the in-vehicle backend for Lifetime Robots on Lifetime Fleet (Q1 2027)

Decision recorded 22.05.2026 (Risto): the **Thor T5000 module** is the designated in-vehicle compute for the **Lifetime Robots** payload on the **Lifetime Fleet** platform, targeting **Q1 2027 production**. This aligns with the multi-site / production-deployment window already documented in `docs/DWS6_TO_DWS7_UPDATE.md` ("Production | Q1 2027 | Multi-site deployment").

Why Thor T5000 specifically (not Veriton, not Spark, not Orin) for the vehicle:
- **Vehicle power budget.** 40–130 W fits a 12 V / 24 V auxiliary bus; Veriton (~240 W desktop) and DGX Spark (rack-class) don't.
- **Vibration / form factor.** T5000 is a module designed for OEM carrier integration — the only one of our four tiers built for that.
- **On-device LWM is non-negotiable in a vehicle.** Connectivity will drop. Thor's 128 GB unified memory + 2,070 FP4 TFLOPS hosts the full NVFP4-quantised LWM 55B with the headroom for the V2 omnimodal (video/audio) extension that ships November 2026 — exactly the modality the robot needs.
- **Alpamayo lineage.** NVIDIA's Alpamayo open AV stack (BCA Vehicle Tech winner) gives us a reference reasoning-based vehicle runtime to lean on; reuses our Themis case-coordinator pattern.

Implication: the **Field Edition** Control Room SKU and the **Lifetime Robots in-vehicle backend** share silicon. Same dev kit, same NVFP4 LWM image, same CI pipeline — two products from one engineering investment. That doubles the ROI on the Thor bet.

```
              Thor T5000 (single silicon target)
              ┌────────────────────────────────┐
              │   NVFP4 LWM 55B image (shared) │
              └──────────┬─────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        ▼                                 ▼
┌─────────────────┐               ┌──────────────────────┐
│ Control Room    │               │ Lifetime Robots      │
│ Field Edition   │               │ in-vehicle backend   │
│ (Q3–Q4 2026)    │               │ on Lifetime Fleet    │
│ stationary,     │               │ (Q1 2027)            │
│ on-site         │               │ moving, autonomous   │
└─────────────────┘               └──────────────────────┘
```

#### External audit (received 22.05.2026) — risk flags to engineer around

An external technical audit pushed back on the word "perfect" for the in-vehicle role. The audit is right that the verdict depends on workload; capturing the red flags here so they get engineered out of the November bench plan, not discovered at integration.

| Risk | Why it bites | Engineering response |
|---|---|---|
| **Pin-incompatibility with Orin** (new 699-pin B2B connector, new footprint) | Any existing Orin-based vehicle prototypes need new carrier boards; cannot drop-in | Start with a partner carrier (Connect Tech Rogue-T5 / Gauntlet, or Aaeon / Advantech Thor carrier) **before** designing our own. Decide by 2 Nov. |
| **130 W peak in a sealed enclosure** | Vehicle has no rack airflow; thermals + 12 V / 24 V power delivery are non-trivial | Vehicle-bench (Dec) must measure sustained inference at the actual duty cycle, not peak. Set a 90 W operating ceiling for headroom. |
| **JetPack 7.0 / CUDA 13 / Ubuntu 24.04 toolchain jump** | Our current Veriton + DGX Spark stack is Ubuntu 22.04 + CUDA 12.x; any ROS 1 nodes are blockers | Audit the LWM container for CUDA 13 compat during the Nov port. ROS 2 only — no ROS 1 nodes survive the migration. |
| **T5000 may be overspec** for telematics-only roles | 2,070 FP4 TFLOPS is wasted if the vehicle is just a data aggregator | **OPEN — answer needed:** what workloads run in-vehicle? VLA / VLM + multi-robot orchestration justifies T5000; pure telematics points to **T4000** or a mature Orin and saves BOM. See "Open question" below. |

##### Workload definition (answered by Risto 22.05.2026)

In-vehicle backend runs all three of (a) + (b) + (c) simultaneously:

- ✅ **(a) Local VLA / VLM inference** for the robot payload (Isaac GR00T-class workload) — justifies the full T5000 GPU.
- ✅ **(b) Multi-stream sensor fusion** (cameras + LiDAR + tether to nearby robots) — T5000's **4×25 GbE (100 Gbps)** is the real differentiator vs Orin; this is the workload that rules out a downgrade.
- ✅ **(c) Localized fleet routing / multi-robot orchestration** for a squadron in the vehicle's vicinity — uses **MIG slicing** to isolate routing from inference and sensor I/O.
- ❌ (d) Telemetry-only — not the role. T4000 / Orin downgrade is off the table.

Locked consequences for the Nov 2 bench plan:
1. **Carrier-board partner must support 4×25 GbE pass-through and MIG.** Eliminates the lowest-end Thor carriers; Connect Tech Rogue-T5, Aaeon, and Advantech remain in scope.
2. **Bench must include simultaneous-workload test**, not single-pipeline benchmarks. Run VLA inference + 4-stream sensor fusion + a routing planner on three MIG slices concurrently.
3. **CUDA 13 UVM coherence is load-bearing** for the sensor-fusion pipeline (cuts `cudaMemcpy()` bottlenecks). Port plan must validate this, not assume it.
4. **Latency SLO**: vehicle decisions cannot wait for cloud — set a 50 ms p99 end-to-end target for the (sensor → fusion → VLA → action) loop and design backwards from that.

#### Scenario 1 vs Scenario 2 — kept on paper so we can pivot

Two paths are documented so the team isn't paralysed if a stop condition trips on 2 Nov. Scenario 1 is the planned baseline; Scenario 2 is the de-risked fallback.

| Dimension | **Scenario 1 — Thor T5000 (baseline)** | **Scenario 2 — Thor T4000 (fallback)** |
|---|---|---|
| Hardware | Jetson Thor **T5000** module | Jetson Thor **T4000** module *(announced at CES, 5 Jan 2026; available now)* |
| AI compute (FP4) | **2,070 TFLOPS** (sparse) / 1,035 (dense FP8) | **1,200 TFLOPS** (FP4) — over 4× AGX Orin |
| Unified memory | **128 GB LPDDR5X** (273 GB/s) | **64 GB LPDDR5X** |
| Networking | **4×25 GbE** (100 Gbps) | **5 GbE + 4× PoE camera ports + CAN bus + DIO** *(per CNX Software T4000 embedded reference design)* |
| Video codecs | 4× NVENC / 4× NVDEC class | **1× NVENC + 1× NVDEC** (real-time 4K) |
| Power envelope | 40–130 W | **40–70 W** |
| Module unit price (1K vol) | not yet public | **$1,999** |
| Software stack | JetPack 7.0+ / CUDA 13 / Ubuntu 24.04 / Jetson Linux | JetPack 7.1 / CUDA 13 — already shipping |
| Same Blackwell arch | ✅ | ✅ |
| LWM 55B NVFP4 image | Runs with headroom for V2 omnimodal extension | Runs (fits in 64 GB), **no headroom** for V2 video / audio extension |
| Multi-stream sensor fusion (b) | ✅ 4×25 GbE designed for it | ⚠️ degraded — 5 GbE caps aggregate bandwidth; 4× PoE camera ports help if streams are cameras, not LiDAR |
| MIG slicing for (a) + (b) + (c) parallelism | ✅ three concurrent slices, comfortably | ⚠️ tighter; may need to serialise (c) |
| Workload (d) telemetry-only | overkill | acceptable |
| Carrier-board options | Connect Tech Rogue-T5, Aaeon, Advantech (4×25 GbE + MIG gate) | **Connect Tech Gauntlet** already production-ready for T4000; wider set generally |
| BOM impact | baseline | ~**30–50 % cheaper per vehicle** (T4000 module alone is $1,999) |
| Q1 2027 production-readiness risk | Higher (new silicon, tight thermals, new connector) | **Lower** — already shipping; carrier (Gauntlet) already in production |
| V2 omnimodal LWM (Nov 2026) on-vehicle | ✅ supported | ❌ likely cloud-offload required |

##### Scenario 3 — Nebius EU GPU cloud (off-vehicle complement, not a substitute)

Nebius is a **purpose-built AI platform on NVIDIA GPUs with a full stack** (compute, storage, orchestration, MLOps), Dutch-headquartered, EU-resident. It is not an on-vehicle silicon choice — it is the **off-vehicle complement** to whichever of Scenarios 1 or 2 we ship.

Two roles:

1. **V2 omnimodal cloud-offload (essential under Scenario 2).** When the on-vehicle Thor T4000 can't carry the November 2026 V2 video / audio extension, Nebius is the EU-resident inference target the vehicle calls into. This keeps the sovereignty narrative intact (no CLOUD Act exposure) and avoids a US-hyperscaler dependency for the omnimodal path.
2. **Fleet-wide training / fine-tuning + post-deployment re-training.** On-vehicle Thor handles inference; per-fleet training and continual learning runs on Nebius. Field telemetry from Lifetime Fleet vehicles feeds Nebius training jobs; new checkpoints flow back to vehicles via OTA.

| Dimension | Nebius role |
|---|---|
| Hardware | NVIDIA H100 / H200 / Blackwell (GB200 NVL72, Blackwell Ultra announced — see `2026-02-16-nvidia-blackwell-ultra-agentic-ai-inference.md`) |
| Region | EU (Finland data centre — same jurisdiction as Lifetime Oy) |
| Sovereignty | EU-resident, no US CLOUD Act exposure |
| Use under Scenario 1 | Optional — training / fine-tuning; vehicle is self-sufficient for inference |
| Use under Scenario 2 | **Required** for V2 omnimodal on-vehicle workloads that don't fit T4000 |
| Replaces DGX Spark? | No — DGX Spark is the **on-prem** EU-resident tier; Nebius is the **public-cloud** EU-resident tier. Both stay in the SKU map. |

Implication for the Control Room SKU table: the **EU Cloud** tier should explicitly name Nebius as a deployment target option alongside DGX Spark, with a customer choice of "on-prem (DGX Spark) vs hosted (Nebius EU)" — same sovereign posture, different procurement model.

##### Decision rule — when to pivot from Scenario 1 to Scenario 2 on 2 Nov

Pivot if **any** of the following is true:

- T5000 modules still unavailable / not shipping in volume.
- No carrier-board partner meets the 4×25 GbE + MIG eligibility gate by 2 Nov.
- Vehicle thermal envelope under simultaneous-workload bench cannot stay below the 130 W absolute ceiling (i.e., sustained operating sits ≥110 W in a sealed enclosure).
- BOM analysis shows the T5000 per-vehicle cost lifts the Lifetime Fleet unit price above the agreed Q1 2027 list price.

Pivot consequences to plan for in advance:

- **V2 omnimodal LWM goes cloud-offload on T4000 vehicles** — accept this trade-off in the V2 product spec rather than discovering it in Q4 2026.
- **Drop sensor stream count from 4 → 2** for the on-vehicle fusion path; aggregate the other two via a co-located edge concentrator if needed.
- **Re-quote the joint-marketing 1-pager with NVIDIA** — Scenario 2 is still a Thor / BCA story, just a different SKU; do not promise T5000-only capabilities to NVIDIA marketing.
- **Carrier-board partner pool widens** — re-RFQ with the broader Thor-carrier vendor list to keep prices honest.

---

## What I Want to Verify at the Keynote (1–4 June)

- [ ] Confirm Thor module **SKU pricing** (the 2,070 TFLOPS number is the top SKU; lower SKUs are not yet public).
- [ ] Confirm **Isaac / Cosmos / Holoscan** runtime compatibility — does our LWM stack need a port, or does the existing Jetson container line carry forward?
- [ ] Watch for **EU-specific Thor SKUs** or sovereignty packaging (Schengen-resident firmware signing, etc.) — relevant to the sovereignty-assess skill posture.
- [ ] Check for **Alpamayo** crossover — it's an AV platform, but the reasoning-based stack overlaps with our Themis case-coordinator pattern and may be reusable for site-vehicle telemetry.

---

## Action Items

### Immediate (this week, before keynote)

- [ ] Place Thor dev-kit allocation request via NVIDIA Connect ISV channel
- [ ] Freeze any planned Orin AGX bulk purchase until post-keynote pricing is public
- [ ] Add Thor-tier row to the LWM edge-cost model (currently only Veriton + DGX Spark + cloud)

### Short-term (June–July 2026)

- [ ] Update `docs/Deputy-Agents-Architecture.md` edge diagram to show Thor as the field-device tier
- [ ] Benchmark current LWM edge models (small ones — NV-FP4 pretrain output from `2026-05-15-nvfp4-pretraining-for-control-room-lwm.md`) against Thor's FP4 path; FP4 native is the whole point
- [ ] Refresh the sovereignty narrative for EU customer pitches with the on-device-inference angle

### Medium-term (Q3 2026)

- [ ] Production Thor module(s) in at least one customer Control Room install
- [ ] Cost-model refresh: edge inference $/Mtoken should drop materially vs. the cloud-only baseline used in V1 pricing
- [ ] Publish three-tier Control Room SKU table on `dws6.com/dashboard/control-room/` (decision: 22.05.2026; revisit: 01.09.2026, calendar event `5n930km7p9qmj3ffnqfik65rko`)

### Lifetime Fleet / Lifetime Robots — In-Vehicle Backend (Q4 2026 → Q1 2027)

- [ ] **Nov 2026** — secure two Thor T5000 modules for vehicle-integration testing on a Lifetime Fleet rig
- [ ] **Nov 2026** — port the NVFP4 LWM 55B image to the Jetson Linux + Holoscan runtime; verify Isaac-ROS compatibility for the robot stack
- [ ] **Dec 2026** — vehicle-bench: vibration, thermal (sealed enclosure), 12 V / 24 V auxiliary-bus power draw under sustained inference
- [ ] **Q1 2027** — Lifetime Robots on Lifetime Fleet production launch with Thor T5000 as the in-vehicle backend
- [ ] **Q1 2027** — joint marketing with NVIDIA leveraging the BCA Golden + Alpamayo lineage story

---

## Related Field Notes

- `2026-02-16-nvidia-blackwell-ultra-agentic-ai-inference.md` — Data-centre Blackwell economics; Thor is the same architecture at the edge.
- `2026-02-27-acer-veriton-gn100-nvidia-gpg-key-fix.md` — Current edge sandbox baseline.
- `2026-03-01-veriton-gn100-ollama-dev-environment.md` — Edge runtime stack today.
- `2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md` — EU-resident inference fallback (one tier up from Thor).
- `2026-03-08-nvidia-connect-isv-approved.md` — Channel for dev-kit allocation.
- `2026-03-10-acer-dgx-sandbox-strategy.md` — Edge-vs-sandbox split that Thor reshapes.
- `2026-05-15-nvfp4-pretraining-for-control-room-lwm.md` — FP4-native models we will want running on Thor.

## Related Core Artifacts

- **Pending:** `ART-2026-XXX-edge-tier-selection-framework.md` (Veriton / Thor / Spark / cloud)
- **Pending:** `ART-2026-XXX-lwm-edge-cost-model-v2.md`

---

## References

1. NVIDIA Blog. "NVIDIA GTC Taipei at COMPUTEX: Live Updates on What's Next in AI." https://blogs.nvidia.com/blog/nvidia-gtc-taipei-computex-2026-news/
2. NVIDIA Blog (BCA section). https://blogs.nvidia.com/blog/nvidia-gtc-taipei-computex-2026-news/#bca-awards
3. CES Innovation Awards 2026 listing — NVIDIA Jetson Thor. https://www.ces.tech/ces-innovation-awards/2026/nvidia-jetson-thor/
4. NVIDIA GTC Taipei 2026 event page. https://www.nvidia.com/en-tw/gtc/taipei/
5. The Robot Report. "Advantech shows robotics, medical AI, and industrial edge products using NVIDIA Jetson Thor." https://www.therobotreport.com/advantech-shows-robotics-medical-ai-industrial-edge-using-nvidia-jetson-thor/
6. EE Times Asia. "COMPUTEX 2026 Keynotes Focus on Scaling AI Infrastructure, Edge Intelligence, and Physical AI Deployment." https://www.eetasia.com/computex-2026-keynotes-focus-on-scaling-ai-infrastructure-edge-intelligence-and-physical-ai-deployment/
7. NVIDIA Developer Forums — Community Guide to NVIDIA GTC Taipei at COMPUTEX 2026. https://forums.developer.nvidia.com/t/a-community-guide-to-nvidia-gtc-taipei-at-computex-2026/370571
8. NVIDIA Newsroom. "NVIDIA Releases New Physical AI Models as Global Partners Unveil Next-Generation Robots" (Jetson T4000 launch, CES, 5 Jan 2026). https://nvidianews.nvidia.com/news/nvidia-releases-new-physical-ai-models-as-global-partners-unveil-next-generation-robots
9. NVIDIA Developer Blog. "Accelerate AI Inference for Edge and Robotics with NVIDIA Jetson T4000 and NVIDIA JetPack 7.1." https://developer.nvidia.com/blog/accelerate-ai-inference-for-edge-and-robotics-with-nvidia-jetson-t4000-and-nvidia-jetpack-7-1/
10. CNX Software. "NVIDIA Jetson T4000 Edge AI embedded system offers 5GbE networking, four PoE camera ports, DIO, CAN Bus, and more." https://www.cnx-software.com/2026/01/06/nvidia-jetson-t4000-edge-ai-embedded-system-offers-5gbe-networking-four-poe-camera-ports-dio-can-bus-and-more/
11. Connect Tech. "NVIDIA Jetson T4000 Just Boosted Gauntlet" (carrier-board readiness). https://connecttech.com/nvidia-jetson-t4000-just-boosted-gauntlet/
12. NVIDIA AI Ecosystem Showcase (gated event registration, shared 22.05.2026). https://nvevents.nvidia.com/nvidia-ai-ecosystem-showcase — Connect partners and ISVs across the Jetson 1,000+ partner network; relevant for joint-marketing 1-pager covered in the 2 Nov directions.
13. Nebius. Purpose-built AI platform on NVIDIA GPUs, full-stack, EU-resident (Finland DC). https://nebius.com/

---

## Confidence Assessment

| Claim | Confidence | Source |
|---|---|---|
| Jetson Thor won BCA Golden Award (Edge AI) | HIGH | NVIDIA blog + TAITRA BCA jury |
| 2,070 FP4 TFLOPS top-SKU figure | HIGH | NVIDIA Jetson Thor product page |
| 7.5× compute / 3.5× energy efficiency vs Orin | HIGH | NVIDIA official comparison |
| 40–130 W power envelope | HIGH | NVIDIA module spec |
| Vera Rubin NVL72 + Alpamayo BCA wins | HIGH | NVIDIA blog |
| GTC Taipei dates 1–4 June 2026 | HIGH | NVIDIA event page |
| Q3 2026 commercial-SKU volume | MEDIUM | Aaeon/Advantech ODM submissions, NVIDIA wording "in production across hundreds of applications" |
| DWS LWM edge tier impact / Veriton displacement scope | MEDIUM | Internal architecture inference |
| EU-specific Thor sovereignty packaging | LOW | Speculation, to be confirmed at keynote |

---

**Author:** Risto Paarni (risto.paarni@lifetime.fi)
**Review Status:** Pending team validation
**Next Review:** 2026-06-05 (post-GTC-Taipei keynote)

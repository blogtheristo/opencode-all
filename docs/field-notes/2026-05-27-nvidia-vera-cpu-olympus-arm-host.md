# Field Note: NVIDIA Vera CPU — 88 Olympus Arm Cores, the Rubin Host, and the New EU Sovereign Compute Floor

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (claude-opus-4-7) | Session: claude/nvidia-vera-field-note-yXZVS | Date: 27.05.2026 | Changes: Initial creation — Field note on NVIDIA Vera CPU benchmarks (Phoronix), Olympus Armv9.2 cores, Rubin pairing, and DWS implications for Core-tier sovereignty and LWM training.

Session Links & References:
  - Claude Code (claude/nvidia-vera-field-note-yXZVS): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-05-27-nvidia-vera-cpu-olympus-arm-host.md

Document Status:
  - Created: 27.05.2026
  - Last Modified: 27.05.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

***

## Ontology Tags

- **Geography:** Global > North America (NVIDIA HQ) / EU deployment via Nebius, Nscale
- **Sector:** Technology > AI/ML > Data-Centre CPU > Arm Server Silicon > Agentic-AI Infrastructure
- **Entities:** NVIDIA, Vera CPU, Olympus core, Rubin GPU, Vera Rubin NVL72, Grace, NVLink-C2C, Scalable Coherency Fabric, SOCAMM2, LPDDR5X, AMD EPYC 9575F, Intel Xeon 6980P, Phoronix, Nebius, Nscale, CoreWeave, Lambda, DWS Core Tier, LWM
- **Temporal Context:** 2026-Q2, post GTC 2026 announcement, partner systems H2 2026
- **Confidence:** High (NVIDIA newsroom + developer blog + first-party Phoronix benchmarks). Caveat: benchmarks so far are NVIDIA-sanctioned configurations only.

---

## Source

NVIDIA Blog — *NVIDIA Vera CPU Benchmarked by Phoronix*
https://blogs.nvidia.com/blog/vera-cpu-phoronix/
(Shared by Risto, 27.05.2026.)

Cross-references:
- Phoronix review — *NVIDIA Vera CPU Benchmarks: Olympus Cores Delivering The Best Performance Ever Seen On ARM*: https://www.phoronix.com/review/nvidia-vera-benchmarks
- NVIDIA Newsroom — *NVIDIA Launches Vera CPU, Purpose-Built for Agentic AI*: https://nvidianews.nvidia.com/news/nvidia-launches-vera-cpu-purpose-built-for-agentic-ai
- NVIDIA Developer Blog — *Vera CPU Delivers High Performance, Bandwidth, and Efficiency for AI Factories*: https://developer.nvidia.com/blog/nvidia-vera-cpu-delivers-high-performance-bandwidth-and-efficiency-for-ai-factories/
- PC Gamer — *Nvidia's first in-house CPU benchmarked, beats x86 and ARM chips alike but only in Nvidia-sanctioned tests*: https://www.pcgamer.com/hardware/processors/nvidias-first-in-house-cpu-benchmarked-beats-x86-and-arm-chips-alike-but-only-in-nvidia-sanctioned-tests/

---

## Executive Summary

NVIDIA published the first independent (NVIDIA-sponsored) Phoronix benchmarks of **Vera**, the in-house Arm server CPU that replaces Grace as the host part in the **Vera Rubin** platform. Vera ships **88 custom Armv9.2 "Olympus" cores** (NVIDIA's first non-Neoverse core), **1.5 TB of LPDDR5X via SOCAMM2** at **1.2 TB/s**, and **native FP8** SVE2 vector units. In the geomean of Phoronix's suite it is **~63 % faster than Grace, ~10 % faster than AMD EPYC 9575F (64-core Zen 5 at 5 GHz), and ~55 % faster than Intel Xeon 6980P (128-core Granite Rapids)** — beating x86 flagships at significantly lower socket power (450 W TDP for the test SKU, plus ~50 W for the LPDDR5X stack).

For DWS this is the **Core-tier substrate** behind the Vera Rubin NVL72 that won a Computex BCA Golden Award five days ago (`2026-05-22-nvidia-gtc-taipei-2026-jetson-thor-edge-bca.md`). It tightens the EU sovereign-inference path (Nebius / Nscale partners) and gives the LWM training pipeline an FP8 host CPU that pairs unified-memory with Rubin GPUs — relevant to our NVFP4 pretraining work (`2026-05-15-nvfp4-pretraining-for-control-room-lwm.md`).

The caveat earns its own paragraph: Phoronix ran configurations NVIDIA picked. Independent Linux-distro builds and bare-metal third-party reviews are not out yet. Treat the headline as **direction** (Olympus is real, NVLink-C2C unified memory works, FP8-on-CPU is in production silicon), not as a procurement-grade benchmark.

---

## What Vera Actually Is

| Spec | **Vera (new)** | Grace (current Core tier) | Notes |
|---|---|---|---|
| Cores | **88** custom **Olympus** | 72 Neoverse-V2 | NVIDIA's first in-house Arm core |
| ISA | **Armv9.2** + SVE2 (6×128-bit) | Armv9.0 + SVE2 | Native FP8 path on the CPU itself |
| Threads | **176** (physical resource partitioning) | 72 | New for NVIDIA server CPUs |
| Memory | **1.5 TB LPDDR5X** via **SOCAMM2** | 480 GB LPDDR5X | SOCAMM2 = serviceable / fault-isolatable module |
| Bandwidth | **1.2 TB/s** | ~512 GB/s | ~2.3× |
| Interconnect | **NVLink-C2C** + 2nd-gen Scalable Coherency Fabric (**3.4 TB/s bisection**) | NVLink-C2C + SCF v1 | Monolithic die, no chiplet latency hop |
| Socket TDP (test SKU) | **450 W** (+ ~50 W LPDDR5X) | ~500 W (Grace Hopper combined) | Vera is CPU-only at 450 W |
| Confidential compute | Hardware-enforced isolation | Partial | Matters for our sovereignty story |
| Pairing | **Rubin GPU** via NVLink-C2C, unified memory | Hopper / Blackwell | Same C2C concept, wider pipe |
| Availability | **H2 2026** with partner OEMs | Shipping | Already at AWS, GCP, Azure, OCI, CoreWeave, Lambda, **Nebius**, **Nscale** for early access |

Olympus' design choices that matter for our workloads:
- **FP8 in the CPU's SVE2 path.** Pre/post-processing, tokenizer work, and KV-cache management can stay in the same numeric format as the Rubin GPU pipeline — fewer cast ops at the C2C boundary.
- **SOCAMM2 modules.** This is the first serviceable LPDDR form factor in a server CPU — failed memory becomes a hot-swap, not a chassis swap. Relevant when we model EU sovereign rack TCO.
- **Monolithic die, no chiplets.** NVIDIA's bet against AMD's chiplet topology. 3.4 TB/s SCF bisection bandwidth is the answer to NUMA-tax arguments.

---

## Phoronix Benchmark Headlines

From the [Phoronix review](https://www.phoronix.com/review/nvidia-vera-benchmarks), geomean across the suite:

| Comparison | Vera result | Caveat |
|---|---|---|
| vs **Grace** (72-core Neoverse-V2) | **+63 %** | Same vendor; cleanest A/B |
| vs **AMD EPYC 9575F** (64-core Zen 5, 5 GHz) | **+10 %** | EPYC is x86 flagship in HPC-clock SKU |
| vs **Intel Xeon 6980P** (128-core Granite Rapids) | **+55 %** | Intel had core-count advantage; Vera still wins on geomean |

NVIDIA-selected suite. Wccftech, TechPowerUp, and PC Gamer all flagged the same caveat — **PC Gamer's headline calls it out explicitly**. Until we see Phoronix Test Suite results on a third-party-installed Vera box (Nebius EU racks would be the cleanest path), treat the EPYC and Xeon deltas as marketing-grade, not procurement-grade. The Grace delta is the only one we can take at face value because both sides are NVIDIA-controlled.

---

## Why This Matters for DWS

### 1. The Core tier of LWM finally has an EU-resident substrate at parity with US hyperscaler offerings

Our Core-tier story today (per `2026-05-25-tier1-sovereignty-pilot-outokumpu-dgx-t5000.md` and the Nebius scenario in the Thor note) routes Tier-1 sovereign inference through **Nebius EU GPU cloud**. NVIDIA's launch list puts Nebius and Nscale on the **Vera Rubin early-access partner list alongside AWS, GCP, Azure, and OCI**. That parity is new — previous generations (Grace Hopper, GH200, GB200) reached EU CSPs months after the US hyperscalers. For Outokumpu-class pilots this means:

- The "EU-resident inference is a generation behind" objection in customer reviews **stops being true** as soon as Nebius racks light up in H2 2026.
- Our pricing benchmark in `2026-05-23-lwm-price-estimate-colab-vs-nvidia-cloud.md` needs a Vera Rubin column. Expect lower $/token vs Hopper-class given Rubin's claimed compute density.

### 2. NVFP4 pretraining gets a matched host

`2026-05-15-nvfp4-pretraining-for-control-room-lwm.md` records the LWM pretraining path on NVFP4. Vera's **native FP8 SVE2** in the host CPU means tokenizer + dataloader + KV-cache offload paths can stay in low-precision formats without expensive recasts at the NVLink-C2C boundary. Concretely:

- Our pretrain dataloader on Grace currently widens to BF16 before C2C transfer. Vera lets it stay FP8.
- KV-cache offload from Rubin to Vera LPDDR5X stays unified-memory; no explicit `cudaMemcpy` (the same UVM win we counted on for Thor T5000 in-vehicle, per the 22.05.2026 audit).

### 3. Confidential compute closes a real customer gap

Vera's hardware-enforced confidential-compute path on a CPU that also hosts Rubin GPUs (with their own CC) means a **rack-level confidential boundary**, not just a GPU-level one. For ETS / CBAM / CSRD workloads where customer raw data must not leave a trust boundary even at rest in CPU memory, this is a checkbox we currently work around with RLS + KMS. With Vera Rubin we can say "the data never leaves the confidential VM" — same answer that AMD SEV-SNP gave us on EPYC, but now inside the Rubin training stack.

### 4. Procurement signal — hold off on any Grace Hopper / GH200 commitments

Anyone in DWS modelling a 2026 H2 / 2027 H1 NVIDIA capex should price **Vera Rubin** as the default and **Grace Hopper** as the legacy fallback. Per NVIDIA, partner systems ship in **H2 2026**, which lands in the Outokumpu pilot window and well before the Q1 2027 Lifetime Fleet production date. There is no reason to commit Grace-generation racks now.

### 5. Independent benchmark gap — investor / customer-facing claims need a caveat

For the next ~60 days, any DWS deck or LSJ post citing Vera's "+55 % vs Xeon" or "+10 % vs EPYC" must footnote **"NVIDIA-sanctioned configurations; independent third-party benchmarks pending."** Skipping this footnote is a [DWS_MARKET_RESEARCH_STANDARD.md] credibility trap. The Grace delta is safe to cite without the footnote.

---

## Open Questions

1. **Bare-metal pricing in EU.** Nebius and Nscale list Vera Rubin in early-access. Per-hour pricing vs current GH200 instances drives the LWM training $/token model.
2. **Single-socket vs NVL72 thermals in our pilot racks.** The 450 W socket + ~50 W memory is fine in liquid-cooled NVL72, but the Nscale single-socket Vera SKU may be air-cooled — affects whether we can colocate at customer sites for "edge-of-core" deployments.
3. **Olympus toolchain.** Does our existing aarch64 build pipeline (DGX Spark / Veriton Arm container path) need anything for Olympus-specific tuning, or is Armv9.2 + SVE2 enough? Likely fine, but the Linaro / NVIDIA HPC SDK release notes for Olympus need a read before any LWM container ships to a Vera box.
4. **Confidential-compute interop with Supabase / our backend RLS story.** If we put Tier-1 customer data inside a Vera CC enclave on Nebius, how does that round-trip to our Supabase EU primary? Probably out of scope until H1 2027, but worth a paragraph in `DWS_SECURITY_STANDARD.md` before any customer-facing claim.

---

## Next Actions

- [ ] Add a Vera Rubin column to `2026-05-23-lwm-price-estimate-colab-vs-nvidia-cloud.md` once Nebius publishes early-access pricing.
- [ ] Update the Core-tier diagram in `2026-05-25-tier1-sovereignty-pilot-outokumpu-dgx-t5000.md` to show Vera Rubin as the H2 2026 substrate (Grace Hopper → Vera Rubin upgrade path).
- [ ] Brief NVIDIA Connect ISV channel (per `2026-03-08-nvidia-connect-isv-approved.md`) on DWS interest in early Vera Rubin / Nebius slot allocation.
- [ ] Footnote benchmark caveat into any LSJ / investor deck before citing Vera numbers.
- [ ] Watch for the first non-NVIDIA-sanctioned Phoronix Test Suite run (likely from a Nebius or independent reviewer in 6–10 weeks). Update this note when it lands.

---

## Cross-References

- `docs/field-notes/2026-05-22-nvidia-gtc-taipei-2026-jetson-thor-edge-bca.md` — Vera Rubin NVL72 BCA Golden Award (Core tier sibling)
- `docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md` — LWM NVFP4 pretraining (consumes Vera's FP8 host)
- `docs/field-notes/2026-05-25-tier1-sovereignty-pilot-outokumpu-dgx-t5000.md` — EU sovereign Core pilot (substrate upgrade target)
- `docs/field-notes/2026-05-23-lwm-price-estimate-colab-vs-nvidia-cloud.md` — Pricing model (needs Vera column)
- `docs/field-notes/2026-03-08-nvidia-connect-isv-approved.md` — ISV channel for early allocation
- `docs/field-notes/2026-02-16-nvidia-blackwell-ultra-agentic-ai-inference.md` — Predecessor generation positioning

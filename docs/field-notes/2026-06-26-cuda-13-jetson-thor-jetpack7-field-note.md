# Field Note: CUDA 13.0 for Jetson Thor — Unified Arm Toolkit, Full Coherence UVM, and GPU Sharing Land at the Edge

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-opus-4-8) | Session: claude/cuda-13-field-note-u7y1y5 | Date: 26.06.2026 | Changes: Initial creation — Field note on CUDA 13.0 for Jetson Thor (JetPack 7.0): unified Arm toolkit, UVM full coherence, MPS, green contexts, NUMA, dmabuf, nvidia-smi/NVML, and edge-AI implications for the DWS LWM edge tier and Control Room

Session Links & References:

- Claude Code (claude/cuda-13-field-note-u7y1y5): https://github.com/blogtheristo/dws6
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-06-26-cuda-13-jetson-thor-jetpack7-field-note.md

Document Status:

- Created: 26.06.2026
- Last Modified: 26.06.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

***

## Ontology Tags

- **Geography:** Global > USA (NVIDIA, Santa Clara) > EU edge deployment (DWS customer sites)
- **Sector:** Technology > AI/ML > Edge AI > Physical AI > Robotics > Embedded GPU Compute
- **Entities:** NVIDIA, CUDA 13.0, JetPack 7.0, Jetson Thor, Jetson Orin (sm_87), Blackwell, GB200, DGX Spark, SBSA, Tegra, UVM, MPS, MIG, Green Contexts, NUMA, dmabuf, OpenRM, nvidia-smi, NVML, DWS LWM, DWS Control Room, SiteSense, Lifetime Fleet
- **Temporal Context:** 2026-Q2, Post Jetson Thor BCA Golden Award, JetPack 7.0 availability, Pre customer-site V1 rollout
- **Confidence:** High (NVIDIA Developer Blog, official CUDA/JetPack documentation)

---

## Source

NVIDIA Developer Blog — _Field note on CUDA 13.0 for Jetson Thor SoC (Blackwell GPU architecture), shipping in JetPack 7.0._
Authors: Rekha Mukund (CUDA Tegra PM) et al. Contributors: Saumya Nair, Ashish Srivastava, Debalina Bhattacharjee, Alok Parikh, Quinn Zambeck, Ashutosh Jain, Raveesh Nagaraja Kote.
(Shared by Risto, 26.06.2026.)

---

## Executive Summary

CUDA 13.0 — shipping in **JetPack 7.0** — is the software half of the Jetson Thor story we opened in `2026-05-22-nvidia-gtc-taipei-2026-jetson-thor-edge-bca.md`. The hardware (2,070 FP4 TFLOPS, Blackwell, 40–130 W) was the headline; CUDA 13.0 is what makes that silicon **developer-economical** for a small team like ours.

The single most important change for DWS: **one unified CUDA toolkit for all Arm platforms.** You build a CUDA application once, simulate it on a server-class Arm box (GB200, **DGX Spark**), and deploy the _exact same binary_ — no code changes — onto a Jetson Thor field device. The only platform left on the old split path is Orin (`sm_87`). For our **brain (DGX Spark, EU-resident) → body (Thor, customer site)** topology, this collapses two toolchains into one and removes a whole class of CI duplication we were about to inherit.

Three further capabilities matter for the LWM edge tier: **Unified Virtual Memory with full hardware coherence** (use `mmap()`/`malloc()` pointers directly in kernels — no `cudaMemcpy`), **MPS + green contexts** for packing multiple small agentic processes onto one Thor GPU with deterministic SM isolation, and **nvidia-smi / NVML** finally arriving on Jetson so our Control Room can monitor edge GPUs with the same tooling we use on dGPU.

### Key Highlights

| Capability               | What changed in CUDA 13.0                                                                 | DWS-relevant impact                                         |
| ------------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Unified Arm toolkit**  | One toolkit for SBSA servers + Thor; same binary builds & deploys                         | Brain→Body: build on DGX Spark, ship to Thor unchanged      |
| **UVM + full coherence** | `pageableMemoryAccessUsesHostPageTables=1`; `mmap`/`malloc` usable in kernels, GPU-cached | Zero-copy data path for SiteSense / vision at the edge      |
| **MPS on Tegra**         | Multiple processes share one GPU context, no code changes                                 | Pack many small agentic processes onto one Thor             |
| **Green contexts**       | Pre-assign SMs per context for deterministic latency                                      | Real-time isolation for SLAM vs. planning-class workloads   |
| **NUMA for Tegra**       | `CU_MEM_LOCATION_TYPE_HOST_NUMA` now supported                                            | dGPU NUMA apps port to Thor with no code changes            |
| **dmabuf interop**       | CUDA buffers ↔ dmabuf FDs on OpenRM platforms                                             | Zero-copy sharing with camera/sensor/3rd-party stacks       |
| **nvidia-smi / NVML**    | Now supported on Jetson Thor                                                              | Control Room edge-GPU monitoring with standard tooling      |
| **MIG**                  | Announced, _future release_                                                               | Hard partitioning for mixed-criticality — not yet shippable |

---

## The Observation

### 1. Unified Arm toolkit — "build once, deploy anywhere"

Before CUDA 13.0, Arm CUDA development was split: an **SBSA toolkit** for server-class Arm and a separate **Jetson toolkit** for embedded. Code moved between them by hand, with all the CI duplication and SDK-drift that implies. CUDA 13.0 unifies these into a single toolkit. The compiler and runtime still emit optimized code for the target GPU architecture — but the developer manages one toolchain, and a binary built for the architecture deploys directly to Thor without code changes.

> **Exception:** Orin (`sm_87`) stays on its current path for now. Our existing Orin-class assumptions (see the Veriton/Orin notes) are _not_ swept into this unification yet.

The unification also consolidates the **container** lineage so simulation, test, and deployment share a common image ancestry — fewer rebuilds, lower CI overhead, a single source of truth for builds across simulation and edge. NVIDIA also flags this as the groundwork for **concurrent iGPU + dGPU** usage on Jetson and IGX.

### 2. Unified Virtual Memory (UVM) with full coherence

For the first time on Jetson, the GPU can access **pageable host memory** through the host's page tables. On Thor, `cudaDeviceProp::pageableMemoryAccessUsesHostPageTables == 1`, and GPU access to CPU-cached memory is itself GPU-cached, with coherence managed by the hardware interconnect. In practice, memory from `mmap()` or `malloc()` can be used **directly in a kernel** — no CUDA allocation, no `cudaMemcpy`.

`cudaMallocManaged()` allocations now report `concurrentManagedAccess == 1` (concurrent CPU/GPU access, `cudaMemPrefetchAsync()` works as expected) — though in 13.0 those managed allocations are _not_ GPU-cached. Net effect: Jetson UVM now behaves like dGPU UVM.

NVIDIA's worked example maps an input file with `mmap()`, maps an anonymous output buffer with `mmap()`, and runs a histogram kernel directly over both pointers — input and output cached in the GPU's L2, coherence automatic, **zero** explicit CUDA allocations or copies, while keeping good performance. That is the exact shape of an edge vision/telemetry preprocessing path.

### 3. GPU sharing — MPS and green contexts

As Tegra GPUs grow, a single small/bursty process (e.g. several small generative-AI agents) underfills the GPU.

- **MPS (Multi-Process Service)** consolidates lightweight workloads into one GPU context so multiple processes execute in true parallel, raising occupancy and throughput — **no application code changes**. Started via `nvidia-cuda-mps-control -d` (binaries under `/usr/bin`), with clients sharing the same `CUDA_MPS_PIPE_DIRECTORY` / `CUDA_MPS_LOG_DIRECTORY`.
- **Green contexts** are lightweight CUDA contexts that **pre-assign SMs** for deterministic, isolated execution. Via the Driver API (`cuDevSmResourceSplitByCount`, `cuDevResourceGenerateDesc`, `cuGreenCtxCreate`, `cuGreenCtxStreamCreate`) each process carves a non-overlapping SM set. Combined with MPS — with `CUDA_MPS_ACTIVE_THREAD_PERCENTAGE` set to 100 or unset — you get concurrent cross-process execution _with_ SM isolation. NVIDIA frames this with a robotics example: SLAM + object detection + motion planning, each with different real-time constraints, sharing one GPU without stepping on each other.

### 4. NUMA, dmabuf, and developer tooling

- **NUMA for Tegra:** `cuMemCreate()` with `CU_MEM_LOCATION_TYPE_HOST_NUMA` is now supported. Thor has a single NUMA node, but the point is **portability** — NUMA-aware dGPU apps run on Thor with no code changes.
- **dmabuf interop:** On OpenRM platforms, CUDA allocations convert to/from `dmabuf` file descriptors (export via `cuMemGetHandleForAddressRange()`; check `CU_DEVICE_ATTRIBUTE_HOST_ALLOC_DMA_BUF_SUPPORTED`). This is the open, standard path to **zero-copy buffer sharing** with cameras, sensors, and third-party kernel drivers — alongside the existing EGL/NvSci options.
- **nvidia-smi / NVML on Jetson Thor:** the standard dGPU tools arrive on Jetson — device/driver/CUDA-version queries and real-time utilization, plus NVML's C/Python APIs for scripting into CI and monitoring. **Caveat:** clock/power/thermal queries, per-process utilization, and SoC-memory monitoring are **not yet** available; broader parity is promised in future JetPack releases.

### 5. What's coming next (track, don't build on yet)

- **MIG (Multi-Instance GPU):** hard-partitions the Thor GPU into isolated slices for mixed-criticality workloads (e.g. SLAM on a dedicated slice, path-planning on another). **Future release** — design for it, do not depend on it.
- Remaining nvidia-smi/NVML telemetry (clock/power/thermal, per-process, SoC memory) expected in later JetPack updates.

---

## Why This Matters for DWS

### 1. The brain→body toolchain collapses to one

Our edge story is **DGX Spark (EU-resident inference, the "brain") → Jetson Thor (customer-site "body")**. Until now that implied two CUDA toolchains and two CI lanes. The unified Arm toolkit means we **develop and simulate on DGX Spark and deploy the same binary to Thor** — the canonical "build once, deploy anywhere" win, and it lands exactly where our topology already sits. Action: when we stand up the Thor dev lane, build it as a _single_ unified-toolkit pipeline, not the SBSA+Jetson split we would have copied from older docs.

### 2. Zero-copy UVM is the right shape for SiteSense at the edge

SiteSense-class edge work (crane/wind risk fusion, EN 13001 checks, vision preprocessing) is dominated by moving frames and telemetry between CPU and GPU. Full-coherence UVM lets us `mmap()` a sensor/file buffer and hand the pointer straight to a kernel — no staging copies, automatic coherence. That simplifies the edge data path and removes a class of copy-management bugs from on-device code.

### 3. MPS + green contexts = many small LWM agents on one Thor

Our edge workloads are _exactly_ the "multiple small generative-AI agents" case NVIDIA calls out: several lightweight LWM/Control-Room processes, each bursty, none filling a 2,070-TFLOPS GPU alone. MPS packs them onto one GPU context for real throughput; green contexts give the latency-sensitive ones (remote-control loop, safety checks) **reserved SMs** so a background job can't starve them. This is achievable **today** on Thor — MIG (the harder isolation) is the future-release upgrade path.

### 4. Control Room gets standard edge-GPU observability

`nvidia-smi` + NVML on Thor means our **Control Room / Situation Room** can monitor edge GPU utilization with the same tooling and NVML Python bindings we already use for dGPU — one monitoring path across brain and body. Plan around the gap: **clock/power/thermal and per-process/SoC-memory are not there yet**, so any edge thermal/power dashboard must wait for a later JetPack or fall back to platform sensors. Fail loud on this in the design doc rather than assuming parity.

### 5. Sovereignty posture is unchanged-and-good

Nothing here weakens the EU-sovereignty story from the Jetson Thor BCA note: on-device inference on EU-deployed Thor modules keeps customer data physically out of CLOUD Act jurisdiction even when the upstream model lineage is US. CUDA 13.0 makes that edge tier _cheaper to build and operate_, not legally different. (No new data-flow review triggered; flagged for the record.)

### 6. Procurement / programme actions

- **Dev-kit allocation:** push our **NVIDIA Connect ISV** channel (`2026-03-08-nvidia-connect-isv-approved.md`) for early Thor dev-kit + JetPack 7.0 access — the public queue will be long.
- **CI design:** spec the Thor lane as a _unified-toolkit_ pipeline sharing a container lineage with the DGX Spark simulation lane.
- **Hold the Orin assumption:** Orin stays on the old `sm_87` path — do not assume these CUDA 13.0 wins apply to Orin-class fallback hardware.

---

## Open Questions / Follow-ups

1. **JetPack 7.0 on our hardware** — does our current Veriton/DGX Spark sandbox give us a clean unified-toolkit build target, or do we need a dedicated Thor dev-kit before the CI lane is real?
2. **MIG timeline** — which JetPack release lands MIG? Mixed-criticality partitioning (safety vs. background) is the feature that would let one Thor host a hard-isolated safety workload. Track the release notes.
3. **Telemetry gap** — confirm which platform sensors fill the nvidia-smi clock/power/thermal hole for an edge dashboard in the interim.
4. **dmabuf path** — validate the OpenRM/dmabuf zero-copy path against whatever camera/sensor stack the first Control Room field device uses.

---

## Related Field Notes

- `2026-05-22-nvidia-gtc-taipei-2026-jetson-thor-edge-bca.md` — Jetson Thor BCA Golden Award; the hardware half of this note.
- `2026-05-27-nvidia-vera-cpu-olympus-arm-host.md` — NVIDIA Vera Arm host; the server-class side of the unified-Arm story.
- `2026-06-25-eu-ai-factories-nvidia-agent-runtime.md` — NVIDIA agent runtime in the EU AI-factory context.
- `2026-03-08-nvidia-connect-isv-approved.md` — NVIDIA Connect ISV channel for dev-kit allocation.
- `2026-02-27-acer-veriton-gn100-nvidia-gpg-key-fix.md`, `2026-03-01-veriton-gn100-ollama-dev-environment.md`, `2026-03-10-acer-dgx-sandbox-strategy.md` — current Veriton/Orin-class edge sandbox baseline.

---

**Bottom line:** The Jetson Thor BCA award gave the DWS edge tier a Blackwell-class _target_. CUDA 13.0 / JetPack 7.0 gives it a _single, sane developer workflow_ — build on DGX Spark, deploy to Thor unchanged — plus the zero-copy memory and GPU-sharing primitives that make running many small LWM agents on one field device practical today, with MIG-grade isolation on the roadmap.

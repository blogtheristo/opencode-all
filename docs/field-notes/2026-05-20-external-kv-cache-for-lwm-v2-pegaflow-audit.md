# External KV Cache for LWM V2 — Pegaflow Usability Audit

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/external-cache-lwm-czyno | Date: 20.05.2026 | Changes: Initial lab note. Audits vLLM "pegaflow" external KV cache (blog dated 18.05.2026, https://vllm.ai/blog/2026-05-18-pegaflow) against LWM V2 deployment requirements on Acer Veriton GN-100 / DGX Spark. Establishes the V2 memory worksheet (100B NVFP4 weights + long-context KV) and a five-axis usability scorecard. Pegaflow-specific facts are stubbed as `TODO[verify from blog]` placeholders pending author sweep — blog URL returned HTTP 403 from the sandbox at audit time.

Session Links & References:
  - vLLM pegaflow blog (primary source, to be verified): https://vllm.ai/blog/2026-05-18-pegaflow
  - NVFP4 pretraining note (V2 weights premise): docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md
  - TokenSpeed inference engine (KV cache ownership / FSM scheduler precedent): docs/field-notes/2026-05-07-tokenspeed-inference-engine.md
  - DGX Spark primary runtime setup (operational baseline): docs/field-notes/2026-03-29-dgx-spark-primary-runtime-setup.md
  - Hardware: Acer Veriton GN-100 (NVIDIA GB10 / DGX Spark class, 128 GB unified memory)
  - LWM V2 ship target: November 2026 (DWS IQ 7)

Document Status:
  - Created: 20.05.2026
  - Last Modified: 20.05.2026
  - Language: English
  - Publication Status: ACTIVE (internal research)
  - Type: Field note / usability audit

***

## TL;DR (90 seconds)

LWM V2 (100B+, omnimodal, Nov 2026) blows the GN-100 KV budget at long-context video workloads: 100B NVFP4 weights take ~50 GB, leaving ~78 GB of unified memory for activations + KV + system. A 1M-token KV cache at FP8 with GQA-8 lands near **150–170 GB** — does not fit. The architectural options are (a) cap context at ~256K and accept the product limit, (b) externalize KV to a host-attached store, (c) wait for an NVFP4 KV cache recipe to drop. vLLM's pegaflow (18.05.2026) targets (b).

**Verdict scaffold (specs unverified):** likely **pilot on the Spark dev box in Q3 2026**, contingent on (1) RDMA/ConnectX-7 path, (2) added TTFT under the control-room 200 ms budget, (3) KV-payload sovereignty story (KV blocks contain decoded prompt material — must stay on-prem and encrypted). Single biggest unknown: pegaflow's miss-path latency. `TODO[verify from blog]`.

Action: do not commit to pegaflow for V2 GA. Stand up a dev-box pilot once the blog's specs are confirmed (this week) and re-audit by 30.06.2026.

---

## The problem — V2 memory budget on GN-100

LWM V2 introduces two pressures that V1 does not have:

1. **Bigger weights.** 100B+ parameters vs V1's 55B.
2. **Long-context video tokens.** Each second of low-res video tokenizes to thousands of tokens; even a 60-second clip blows past 256K context.

The NVFP4 path (see related note) frees weights to ~50 GB and keeps attention in BF16. That is the headline win. But it does **not** touch the KV cache, which scales with context length, not parameter count.

| Slice | Bytes | Notes |
|-------|-------|-------|
| Weights (100B params, NVFP4) | ~50 GB | E2M1 + FP8 block scales + FP32 tensor scale |
| Activation working set (BF16) | ~6–10 GB | Bursty; depends on batch and prefill chunk |
| Paged-attention overhead | ~2–4 GB | vLLM block table, scheduler state |
| **KV cache @ 256K ctx, FP8, GQA-8** | **~40 GB** | Fits — see appendix worksheet |
| **KV cache @ 1M ctx, FP8, GQA-8** | **~160 GB** | **Does not fit** in 128 GB unified |
| System / OS / cuBLAS workspaces | ~6 GB | DGX OS baseline |

Net: at 256K context, V2 lives within ~98–110 GB used with ~18–30 GB headroom — usable. At 1M context the model overflows by roughly the size of V1 itself. External KV is the only way to keep a 1M-token surface on a single GN-100 without dropping to lower-precision KV (which is not yet a solved recipe — `TODO[verify from blog]` whether pegaflow assumes BF16/FP8 KV or supports FP4 KV).

## What pegaflow is (per vLLM blog)

All of the following bullets need to be checked against the 18.05.2026 vLLM post before this note exits draft.

- **Storage backend(s)**: `TODO[verify from blog]` — what's supported (Redis? Plain RDMA target? CXL pool? Local NVMe?). Single backend or pluggable?
- **Transport**: `TODO[verify from blog]` — RDMA/RoCE/TCP/UCX. Does it require ConnectX-7 (GN-100 has it) or is RDMA optional?
- **Granularity**: `TODO[verify from blog]` — token-level, vLLM-block-level (16/32 tokens), or page-level (>1 block)?
- **Eviction / prefetch**: `TODO[verify from blog]` — LRU, prefix-aware, scheduler-driven prefetch on attention plan?
- **vLLM config surface**: `TODO[verify from blog]` — flag names (e.g. `--kv-cache-external-backend`, `--kv-cache-remote-uri`), env vars, served-model-name compatibility.
- **OpenAI-compat surface**: `TODO[verify from blog]` — does pegaflow change the `/v1/chat/completions` contract, or is it transparent?
- **Reported benchmarks**: `TODO[verify from blog]` — TTFT delta vs in-HBM, cache hit rate at long context, throughput @ 1M ctx, GPU HBM savings.
- **Failure semantics**: `TODO[verify from blog]` — what happens on cache-box loss mid-decode? Drop to in-HBM, hard-fail, or fall back to recompute?
- **Stated limitations**: `TODO[verify from blog]` — model parallelism boundaries, MoE compatibility, multi-tenant isolation.

## Usability audit for LWM V2 — five-axis scorecard

Each axis is rated for V2's GN-100 deployment context. Verdicts are placeholders until the blog stubs above are filled in.

### 1. Hardware fit — GN-100 + external store
GN-100 ships with ConnectX-7 NICs; an RDMA path to a co-located storage box is the natural fit. Open questions: which storage class (DRAM box vs. CXL pool vs. NVMe-oF), PCIe lane contention with GPU traffic, whether the audit-room rack has the 1U/2U slot for a sidecar cache box. **Verdict:** `TODO[verify from blog → blog specs determine backend choice]`. Provisional: **likely yes** if RDMA over ConnectX-7 is supported.

### 2. Software fit — vLLM + Ollama fallback + MCP
V2 runtime is vLLM-primary with Ollama as a tier-2 fallback (per the DGX Spark setup note). Pegaflow lands inside vLLM; Ollama will not benefit. Two implications: (a) the fallback path drops back to in-HBM KV and therefore to the 256K context ceiling — acceptable for an emergency mode, not for normal ops. (b) MCP exposure of LWM V2 stays unchanged — the cache is a runtime concern, not a tool-surface concern. **Verdict:** **yes**, with a documented "fallback context cap" runbook entry.

### 3. Latency budget — TTFT and inter-token
Control-room interactive use targets ≤200 ms TTFT for short prompts and ≤500 ms for long-context prefill. External KV adds a network round-trip per missing block. At RDMA latencies (single-digit µs/op) this is negligible *per block* but compounds across the prefill of a long video clip. **Verdict:** `TODO[verify from blog → need the blog's TTFT @ 1M ctx number]`. Provisional: **tolerable for control-room, audit needed for situation-room interactive**.

### 4. Operational complexity — extra service, extra failure mode
The external store becomes a load-bearing dependency. Failure modes that did not exist before: stale KV (wrong model version pinned to a cache block), partial write on eviction, network partition mid-decode. The remote-control skill (acer fleet) gains a fourth health probe. **Verdict:** **manageable but non-trivial**. Add a `pegaflow_health` line to the GN-100 status output before V2 GA.

### 5. Compliance / sovereignty — KV payloads are sensitive
**This is the underrated axis.** KV cache blocks contain the projected K/V tensors of decoded prompt + generated tokens — i.e. plaintext-equivalent traces of user queries. Any external store that holds them is in scope for:
- On-prem residency (no CLOUD Act exposure — re-run `/sovereignty-assess` on the candidate storage box)
- Encryption at rest and in transit (RDMA-over-RoCE without IPsec is **not** encrypted on the wire)
- Retention policy (KV blocks should not outlive the session)
- RLS / multi-tenant isolation if V2 ever serves more than one customer per box

**Verdict:** **conditional yes** — pegaflow is usable only if the storage box is on-prem, encrypted, and ephemeral. `TODO[verify from blog → confirm encryption story]`.

## Decision matrix

| Option | Headroom freed @ 1M ctx | Added TTFT | V2 ship-date risk | Ops cost | Sovereignty risk |
|---|---|---|---|---|---|
| (a) In-HBM only, cap at 256K | 0 | none | none | none | none |
| (b) **Pegaflow external KV** | ~100+ GB | `TODO[verify]` | medium (new dep) | medium (extra service) | medium (KV payload) |
| (c) NVFP4 KV cache (when available) | ~120 GB | none | high (recipe not published) | low | none |
| (d) Hybrid local-LRU + external overflow | ~80 GB | low-amortized | medium | medium-high | medium |

Row (c) is the right long-term answer if a recipe lands before V2 GA. Row (b) is the right *pragmatic* answer for Nov 2026 if pegaflow's specs check out. Row (d) is what we should actually build, with pegaflow as the overflow tier.

## Recommendation

**Pilot pegaflow on the Spark dev box in Q3 2026, after the 18.05.2026 blog's config + benchmark claims are verified line-by-line in this note.** Do not commit to V2 GA on pegaflow until the pilot returns a TTFT-at-1M-ctx number and a sovereignty sign-off. Re-audit deadline: **30.06.2026**.

Next concrete action: paste the pegaflow blog into this conversation (or the field note) and sweep the `TODO[verify from blog]` markers. Owner: Risto / V2 runtime lead.

## Open questions (sweep before promoting to v1.1)

- `TODO[verify from blog]` What storage backends does pegaflow support out of the box?
- `TODO[verify from blog]` Is RDMA required, or is TCP acceptable for the dev-box pilot?
- `TODO[verify from blog]` Block-level or page-level eviction? Prefix-aware?
- `TODO[verify from blog]` Reported TTFT at ≥512K context on a single-node deployment?
- `TODO[verify from blog]` Encryption-in-transit / encryption-at-rest defaults?
- `TODO[verify from blog]` What happens on cache-box loss mid-decode?
- `TODO[verify from blog]` Compatibility with NVFP4 weights and BF16 attention (V2 quantization recipe)?
- `TODO[verify from blog]` MoE / model-parallel coverage — does it apply to dense 100B only?

## Appendix A — V2 memory worksheet

Assumed V2 architecture for the worksheet (closest publicly available proxy; tighten when V2 config is locked):

- Layers (L): 80
- Attention heads (h): 64
- KV heads (h_kv): 8 (GQA-8)
- Head dim (d): 128
- KV dtype: FP8 (1 byte) for the audit; BF16 (2 bytes) row shown for contrast

Per-token KV size:

  `bytes_per_token = 2 × L × h_kv × d × dtype_bytes`

  `= 2 × 80 × 8 × 128 × 1 = 163,840 B ≈ 160 KB/token` (FP8)
  `= 2 × 80 × 8 × 128 × 2 = 327,680 B ≈ 320 KB/token` (BF16)

| Context length | KV @ FP8 | KV @ BF16 |
|---|---|---|
| 32K | ~5 GB | ~10 GB |
| 128K | ~20 GB | ~40 GB |
| 256K | ~40 GB | ~80 GB |
| 512K | ~80 GB | ~160 GB |
| 1M | ~160 GB | ~320 GB |

Against 128 GB GN-100 unified memory with ~50 GB pinned to NVFP4 weights, the practical context ceiling without external KV is **≈256K @ FP8**. Pegaflow's claim space is everything above that line.

## Appendix B — Related notes

- `docs/field-notes/2026-05-15-nvfp4-pretraining-for-control-room-lwm.md` — V2 weights premise (~50 GB NVFP4 at 100B)
- `docs/field-notes/2026-05-07-tokenspeed-inference-engine.md` — KV cache ownership and FSM scheduling precedent
- `docs/field-notes/2026-03-29-dgx-spark-primary-runtime-setup.md` — GN-100 operational baseline, `OLLAMA_KEEP_ALIVE` and context defaults

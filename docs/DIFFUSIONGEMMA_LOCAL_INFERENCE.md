# DiffusionGemma Local Inference — Business Fit Guide

---

# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:

- Version: 1.3 | Tool: Claude Code | Session: claude/diffusiongemma-parallel-generation-r0w0y1 | Date: 25.06.2026 | Changes: Added the local tool-calling companion qwen3.6-35b-a3b (Qwen3.6-35B-A3B NVFP4, vllm-local), registered local-first in standard + heavy tiers. Corrected the §3 "tool-heavy → cloud" anti-fit: tool-requiring agents now route to local Qwen at €0, not cloud. Added the §5 routing table and the NVFP4-vs-Ollama (GGUF) serving-stack distinction; new scripts/serve-qwen36.sh launcher
- Version: 1.2 | Tool: Claude Code | Session: claude/diffusiongemma-parallel-generation-r0w0y1 | Date: 25.06.2026 | Changes: Documented the NVFP4 deployment quant (nvidia/Gemma-4-26B-A4B-NVFP4) as the mechanism behind the §2.5/§7 concurrency — ~14GB weights fit all experts + 16–32 KV caches in the Spark's 128GB. Flagged that the HF card was not reachable (env network policy blocks huggingface.co) so NVFP4 footprint figures are inferred, not card-verified
- Version: 1.1 | Tool: Claude Code | Session: claude/diffusiongemma-parallel-generation-r0w0y1 | Date: 25.06.2026 | Changes: Added §2.5 departmental sovereign multi-user serving (single DGX Spark serves 16–32 concurrent streams via MoE sparsity, ~18 tok/s each / ~300 tok/s aggregate); refined the high-concurrency anti-fit bullet to "hyperscale public multi-tenant only"; added a concurrent-serving throughput table. Corrects the v1.0 framing that treated DiffusionGemma as strictly single-user
- Version: 1.0 | Tool: Claude Code | Session: claude/diffusiongemma-parallel-generation-r0w0y1 | Date: 25.06.2026 | Changes: Initial creation — fit/anti-fit guidance for the DiffusionGemma parallel-diffusion local-inference integration (src/agents/diffusiongemma.ts), the `standard`-tier model-catalog registration, and the `scripts/serve-diffusiongemma.sh` vLLM launcher

Document Status:

- Created: 25.06.2026
- Last Modified: 25.06.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

## 1. Summary

DiffusionGemma (Google DeepMind) generates text by **denoising a whole block of
tokens in parallel** (up to 256 per step) on the Gemma 4 26B mixture-of-experts
backbone (3.8B parameters active per step). It is open-weights under Apache-2.0
with day-zero OpenAI-compatible serving in vLLM.

**Deployment quant — NVFP4.** The practical local build uses NVIDIA's NVFP4
4-bit floating-point format (Blackwell: DGX Spark GB10 / RTX 50-series). NVFP4
puts the 26B MoE weights at ~14GB (vs ~52GB at BF16), which is what lets all
experts plus 16–32 concurrent KV caches fit in the Spark's 128GB unified memory
— the enabler behind the concurrency figures in §2.5 and §7. The shared backbone
ships as `nvidia/Gemma-4-26B-A4B-NVFP4` (autoregressive base); DiffusionGemma's
NVFP4 build rides the same format and serves over the same `vllm-local` path.

Its engineering profile decides its business fit:

| Property                                                         | Consequence for DWS                                                                                                                                                  |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Low-latency **single-user** generation                           | Wins where one human waits on each response (~150 tok/s single-stream on DGX Spark).                                                                                 |
| **MoE sparsity** — 26B total, ~4B active/step (A4B)              | One Spark holds all experts in 128GB and serves **16–32 concurrent streams** (~18 tok/s each, ~300 tok/s aggregate). Scales to a team, not a hyperscale tenant base. |
| **Local** on DGX Spark / RTX, €0 marginal cost, no per-token fee | EU data residency, no egress, predictable cost — the DWS sovereignty lane.                                                                                           |
| **Generation, not tool-calling** (not claimed at launch)         | Best for synthesis/extraction/drafting; not for tool-driven orchestration.                                                                                           |

## 2. Best-fit business cases

**2.1 EU-sovereign / on-prem generation (strongest fit).**
Inference runs entirely on the customer's box — no cloud, no data egress. For
CSRD disclosure drafting, ETS/CBAM narrative synthesis, and any output built
from sensitive operational data, this is a GDPR/NIS2-friendly path at €0/call.
Sits alongside Baseten EU as the "fully local, cheaper" option.

**2.2 Interactive, latency-sensitive single-user surfaces.**
The diffusion win is _time-to-response for one user_:

- **Control Room** field ops — real-time alert summaries, dispatch rationale, on-site Q&A on a deskside DGX Spark.
- **Captain / morning briefings** — fast block generation.
- **Situation Room copilots** — dashboard Q&A where a human waits on each turn.

**2.3 High-volume standard-tier synthesis/extraction.**
Carbon write-ups (material-oracle), compliance gap summaries, emissions
narratives, SEO briefs, sales-outreach drafting. High call volume × €0/call is
exactly where the local-first routing pays off.

**2.4 Edge / field deployment.**
DGX Spark deskside or RTX workstation at a site or customer premises — local
agent loops with no connectivity dependency.

**2.5 Departmental sovereign multi-user serving.**
MoE sparsity (~4B active of 26B) lets a **single DGX Spark serve 16–32
concurrent streams** at ~18 tok/s each (~300 tok/s aggregate). That is enough
for a whole compliance or ops team to share one on-prem box — a sovereign
alternative to per-seat cloud SaaS, at €0/call with no data egress. The trade
is per-stream latency: concurrency suits **many light interactive users**, not
a few heavy agentic loops (for which the single-stream ~150 tok/s mode fits
better). Maps cleanly to a per-customer "one Spark per department" product tier.

## 3. Anti-fit — do **not** use here

- **Tool-heavy orchestration** (atlas, athena, mercury — heavy tier). These
  require function calling. DiffusionGemma's catalog entry sets
  `supportsTools: false`, so these agents correctly skip it. They no longer fall
  through to _cloud_, though: the **local tool-calling counterpart
  `qwen3.6-35b-a3b`** (Qwen3.6-35B-A3B, NVFP4, `vllm-local`) now picks them up at
  €0 (§5). Do not force DiffusionGemma into the orchestration path — let Qwen
  take it.
- **Hyperscale public multi-tenant serving.** One Spark caps at ~16–32
  concurrent streams — enough for a department (§2.5), not for thousands of
  public tenants. Keep cloud autoregressive (Groq / Anthropic) for the
  public-scale multi-tenant API.
- **Routing / deterministic transforms.** CLAUDE.md Rule 5 — code answers, not
  a model.

## 4. Decision rule

> Use DiffusionGemma when **one user is waiting, the data must stay local/EU,
> and the task is generation rather than tool-driven orchestration.** Otherwise
> route to cloud autoregressive (tool use, multi-tenant concurrency) or to code
> (deterministic work).

## 5. How it routes today

DiffusionGemma is registered as a **local-first** option in the `standard` tier
of `MODEL_CATALOG` (`src/agents/model-selector.ts`). When a vLLM endpoint is
available, standard-tier agents that do **not** require tools select it
automatically (€0/hr); tool-requiring calls skip it and fall through to a
function-calling provider. No per-agent override is needed for the standard
tier — see `src/__tests__/diffusiongemma.test.ts` for the verified behavior.

To prefer it from a `lite`/`heavy` agent, pass `tierOverride: 'standard'`
(without `requiresTools`) to `selectModel` / `createLLMClientForAgent`.

**Companion model — `qwen3.6-35b-a3b` (local tool calling).** DiffusionGemma is
generation-only; Qwen3.6-35B-A3B (NVFP4) is its tool-calling sibling and is
registered local-first in both `standard` and `heavy` tiers. Net routing on a
vLLM host:

| Tier     | Plain generation (no tools)                   | Tool-requiring call          |
| -------- | --------------------------------------------- | ---------------------------- |
| standard | `diffusiongemma-26b` (diffusion, low latency) | `qwen3.6-35b-a3b` (€0 local) |
| heavy    | `qwen3.6-35b-a3b`                             | `qwen3.6-35b-a3b`            |

Both are NVFP4 / `vllm-local`; on an Ollama-only host (no `VLLM_BASE_URL`) the
heavy tier falls back to `qwen2.5:32b`. Serve Qwen with
`scripts/serve-qwen36.sh`. NVFP4 is a vLLM / TensorRT-LLM format and does **not**
run on Ollama — see the Ollama-vs-vLLM split in this section's commit history.

## 6. Configuration

| Env var                        | Purpose                                        | Default                       |
| ------------------------------ | ---------------------------------------------- | ----------------------------- |
| `DIFFUSIONGEMMA_BASE_URL`      | Dedicated vLLM endpoint (DGX Spark / RTX)      | falls back to `VLLM_BASE_URL` |
| `DIFFUSIONGEMMA_MODEL`         | Served model tag                               | `google/diffusiongemma-26b`   |
| `DIFFUSIONGEMMA_BLOCK_TOKENS`  | Parallel denoising block size (clamped 1–256)  | `256`                         |
| `DIFFUSIONGEMMA_DENOISE_STEPS` | Denoising steps per block (0 = server default) | `0`                           |
| `VLLM_API_KEY`                 | Optional bearer token for the served endpoint  | —                             |

Serve locally with `scripts/serve-diffusiongemma.sh`, then point the app at the
endpoint via `DIFFUSIONGEMMA_BASE_URL` (or the shared `VLLM_BASE_URL`).

## 7. Reference throughput

Single-stream (one user waiting):

| Hardware           | tokens/sec | Note                                                 |
| ------------------ | ---------- | ---------------------------------------------------- |
| NVIDIA DGX Spark   | 150        | GB10 Grace Blackwell, 128GB unified — deskside local |
| NVIDIA H100        | 1,000      | single GPU, single-user (~4× autoregressive)         |
| NVIDIA DGX Station | 2,000      | 748GB coherent memory — best-in-class local          |

Concurrent serving on a single DGX Spark (Gemma 4 26B A4B MoE backbone):

| Parallel streams | tok/s per stream | Aggregate tok/s | Note                                              |
| ---------------- | ---------------- | --------------- | ------------------------------------------------- |
| 16               | ~18              | ~300            | departmental sharing; ~2× single-stream aggregate |
| up to 32         | lower per stream | —               | headroom from MoE sparsity (~4B active)           |

## 8. Related

- `src/agents/diffusiongemma.ts` — spec, decode params, endpoint resolution, client factory
- `src/agents/model-selector.ts` — catalog registration (`diffusiongemma-26b`)
- `scripts/serve-diffusiongemma.sh` — vLLM serving launcher
- `docs/CLOUD_ENVIRONMENTS.md` — EU sovereignty tiers and deployment context
- `nvidia/Gemma-4-26B-A4B-NVFP4` (Hugging Face) — NVFP4 build of the shared MoE
  backbone; the ~14GB footprint that enables the §2.5 concurrency. Note: the HF
  card was not reachable from the build environment (network policy blocks
  `huggingface.co`), so NVFP4 footprint figures here are inferred from the
  format + parameter count, not read from the card — confirm against the card
  before quoting exact file sizes externally.

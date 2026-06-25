# DiffusionGemma Local Inference — Business Fit Guide

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

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

Its engineering profile decides its business fit:

| Property                                                         | Consequence for DWS                                                                                 |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Low-latency **single-user** generation                           | Wins where one human waits on each response; loses on high-concurrency batch serving.               |
| **Compute-bound** (full block through the transformer per step)  | Burns a GPU pass per request; does not amortize across a batch the way autoregressive serving does. |
| **Local** on DGX Spark / RTX, €0 marginal cost, no per-token fee | EU data residency, no egress, predictable cost — the DWS sovereignty lane.                          |
| **Generation, not tool-calling** (not claimed at launch)         | Best for synthesis/extraction/drafting; not for tool-driven orchestration.                          |

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

## 3. Anti-fit — do **not** use here

- **Tool-heavy orchestration** (atlas, athena, mercury — heavy tier). These
  require function calling. The catalog entry sets `supportsTools: false`, so
  these agents correctly fall through to a function-calling provider. Do not
  force DiffusionGemma into the orchestration path.
- **High-concurrency multi-tenant cloud serving.** Compute-bound diffusion
  inverts the economics above single-user; keep cloud autoregressive (Groq /
  Anthropic) for the public multi-tenant API.
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

## 7. Reference throughput (single-user)

| Hardware           | tokens/sec | Note                                                 |
| ------------------ | ---------- | ---------------------------------------------------- |
| NVIDIA DGX Spark   | 150        | GB10 Grace Blackwell, 128GB unified — deskside local |
| NVIDIA H100        | 1,000      | single GPU, single-user (~4× autoregressive)         |
| NVIDIA DGX Station | 2,000      | 748GB coherent memory — best-in-class local          |

## 8. Related

- `src/agents/diffusiongemma.ts` — spec, decode params, endpoint resolution, client factory
- `src/agents/model-selector.ts` — catalog registration (`diffusiongemma-26b`)
- `scripts/serve-diffusiongemma.sh` — vLLM serving launcher
- `docs/CLOUD_ENVIRONMENTS.md` — EU sovereignty tiers and deployment context

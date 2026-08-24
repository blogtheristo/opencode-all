# Field Note: SWOT — Replace Ollama with Goose Built-In Local Inference

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/replace-ollama-goose-QxUYh | Date: 30.04.2026 | Changes: Initial SWOT field note. Triggered by goose-docs.ai blog post (2026-04-24, HTTP 403 on fetch); analysis built from web research on Goose built-in inference, AAIF, and DWS DGX Spark stack.
- Version: 1.1 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/replace-ollama-goose-QxUYh | Date: 01.05.2026 | Changes: Applied DWS Document Standard §12.5–12.6 — added author/date/context metadata, Ontology Tags, fixed *** VERSION block delimiters, bumped Last Modified.

Session Links & References:

- Source URL: https://goose-docs.ai/blog/2026/04/24/use-goose-with-built-in-local-inference/
- Goose providers doc: https://goose-docs.ai/docs/getting-started/providers/
- Ollama–Goose integration: https://docs.ollama.com/integrations/goose
- AAIF announcement: https://lfaidata.foundation/blog/2025/12/ (Linux Foundation)
- Claude Code session branch: claude/replace-ollama-goose-QxUYh

Document Status:

- Created: 30.04.2026
- Last Modified: 01.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / SWOT Analysis

Related Documents:

- docs/field-notes/2026-04-22-agent-ecosystem-landscape-q2-2026.md
- skills/ollama-spark/SKILL.md
- infrastructure/dgx-spark/Deploy-DgxSpark.ps1

***

- **Date:** 30.04.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Context:** DWS DGX Spark infrastructure — evaluating Goose built-in local inference (blog post 2026-04-24) as a potential replacement for Ollama on NVIDIA Jetson Orin Nano.

## Ontology Tags

- **Geography:** Global > EU > Finland
- **Sector:** Infrastructure > AI/ML > Local Inference
- **Entities:** Block Inc, Goose (AAIF), Ollama, NVIDIA Jetson Orin Nano, DGX Spark, Lifetime Oy
- **Standards:** EU AI Act (Tier 2 High-Risk), DWS Sovereignty Tier 1, Apache 2.0, AAIF (Linux Foundation)
- **Temporal Context:** 2026-Q2, Goose built-in inference announced April 2026
- **Confidence:** Medium — primary source URL returned HTTP 403; analysis based on provider docs and web research

---

## Context

Block's Goose (open-source AI agent, Apache 2.0, ~29K GitHub stars) published a blog post on 2026-04-24 describing **built-in local inference** — the ability to run model inference directly inside Goose without a separate Ollama process. This SWOT evaluates whether DWS should replace Ollama (currently running on DGX Spark / NVIDIA Jetson Orin Nano) with Goose's inference layer.

**The key architectural question:** Ollama is a dedicated model server. Goose is an AI agent that now ships inference built-in. These are different layers. The SWOT addresses whether consolidating them makes sense for the DWS stack.

**Current DWS stack (relevant parts):**

| Component             | Role                                          | Location                           |
| --------------------- | --------------------------------------------- | ---------------------------------- |
| Ollama                | Model server (`/api/generate`, OpenAI-compat) | DGX Spark                          |
| `ollama-spark` skill  | Routes prompts to DGX Spark Ollama            | `.claude/commands/ollama-spark.md` |
| `Deploy-DgxSpark.ps1` | Pulls/manages Ollama models                   | `infrastructure/dgx-spark/`        |
| `day-runner.sh`       | Calls Ollama API daily                        | DGX Spark                          |
| Claude Code           | Primary AI agent (Anthropic-hosted)           | All environments                   |

---

## SWOT

### Strengths

1. **Single binary, two roles.** Goose built-in inference removes the two-process coordination between agent and model server. One Goose process on DGX Spark handles orchestration + inference — fewer moving parts.
2. **Apache 2.0, AAIF-governed.** Linux Foundation's Agentic AI Foundation (Anthropic, OpenAI, Block) gives Goose a neutral, long-term governance structure. Less vendor-lock risk than Ollama (single maintainer).
3. **MCP-native.** Goose extensions map directly to DWS MCP tool patterns. Built-in MCP support means DWS `mcp-hub/` integrations can be surfaced to Goose without adaptor layers.
4. **OpenAI-compatible API preserved.** Goose (and MLX/llama.cpp underneath) exposes OpenAI-compatible endpoints — existing DWS integrations (`/api/chat`, `/v1/completions`) survive the swap.
5. **MLX on Apple Silicon.** If DWS developers run M-series Macs, Goose + MLX outperforms Ollama's Metal backend for 7B–13B models.
6. **Structured tool-calling first-class.** Goose was built around tool use; its inference layer is tuned for models that support structured tool-calling (Qwen, Llama, Mistral), which DWS agents require.
7. **EU sovereignty alignment.** Fully local, no cloud calls, no telemetry — compliant with DWS sovereignty tiers (Tier 1 — on-premises).

### Weaknesses

1. **Built-in inference is brand new (April 2026).** Zero production track record. Ollama has been battle-tested since 2023 with thousands of deployments.
2. **Model library gap.** Ollama's model registry (`ollama pull llama3`) covers 200+ models with one command. Goose built-in inference requires manual model file management or LM Studio / MLX Server as a backend — more friction.
3. **Goose is an agent, not a model server.** Running Goose purely for its inference layer ignores 80% of what it does and adds agent overhead (extensions, session state, UI) to a process that should be a lean API server.
4. **NVIDIA Jetson Orin Nano compatibility unconfirmed.** Goose built-in inference references MLX (Apple Silicon) and llama.cpp (CPU/CUDA). Jetson's ARM + CUDA (JetPack) is a third path — Ollama has explicit Jetson support; Goose does not document it.
5. **`ollama list` / `ollama pull` ergonomics absent.** DWS `Deploy-DgxSpark.ps1 -Models` relies on Ollama's pull/list CLI. No equivalent in Goose inference layer — model management becomes a manual step or requires a separate script.
6. **Dual-agent complexity.** DWS already runs Claude Code as the primary agent. Adding Goose creates a second agent in the stack with overlapping capabilities — cognitive overhead for operators and potential conflicts in tool routing.

### Opportunities

1. **DGX Spark consolidation.** If Goose inference runs cleanly on Jetson Orin Nano, eliminate Ollama as a standalone service. One `goose serve` process replaces `ollama serve` + agent wrapper.
2. **`ollama-spark` skill rewrite.** Replace with a `goose-spark` skill that routes to Goose's inference endpoint — same interface, cleaner internals, MCP-native.
3. **Benchmark-driven model selection.** Goose's Vibe Check benchmark (March 2025) scores local models on agent tasks specifically — more relevant to DWS than generic MMLU scores. Could replace ad-hoc model evaluation.
4. **AAIF contribution opportunity.** DWS's EU industrial agent patterns (CSRD, ETS, CBAM scoring) could become AAIF extension contributions — positioning DWS as a founding industrial contributor.
5. **Reduce Anthropic dependency on DGX Spark.** Today the DGX Spark's Ollama models are fallback when Anthropic rate-limits hit. Goose built-in inference deepens that fallback — same function, lighter architecture.
6. **Sovereign model management.** Goose's extension model could allow DWS to build a proprietary model registry (EU-hosted models only, listed in DWS Data Standard) without depending on Ollama's public registry.

### Threats

1. **DGX Spark regression risk.** `day-runner.sh`, `Deploy-DgxSpark.ps1`, and `ollama-spark` skill all assume Ollama's API contract. A swap is a coordinated, multi-file breaking change — not a drop-in.
2. **Goose agent conflicts with Claude Code.** Both are coding agents. Running both creates ambiguity about which agent owns which tasks, which context, and which tool results. No DWS standard exists for multi-agent handoff in this configuration.
3. **Community ecosystem momentum.** Ollama has deeper integration with the open-source inference ecosystem (Open WebUI, Continue.dev, AnythingLLM, Cursor). Goose built-in inference is too new to match this breadth.
4. **Block corporate risk.** Goose is Apache 2.0 but Block is the primary maintainer. AAIF governance is brand new — if Block deprioritises Goose, the foundation governance is untested.
5. **EU AI Act accountability gap.** DWS's EU AI Act compliance layer (Tier 2 High-Risk) requires documented, auditable model lineage. Ollama model cards + SHA hashes provide this. Goose built-in inference layer has no equivalent audit trail yet.
6. **Performance regression unknown.** Ollama's inference is optimised per-platform (Metal, CUDA, CPU). Goose built-in inference (via llama.cpp or MLX) may underperform on Jetson without platform-specific tuning — no benchmarks published yet.

---

## Verdict

**Do not replace Ollama with Goose built-in inference in the near term.**

The April 2026 blog post is proof of concept, not production capability. The DGX Spark / Jetson Orin Nano path is unconfirmed, model management ergonomics are missing, and the EU AI Act audit trail is absent.

**Recommended parallel track:**

| Track                       | Action                                                                                     | Timeline |
| --------------------------- | ------------------------------------------------------------------------------------------ | -------- |
| **Keep Ollama**             | Maintain as primary model server on DGX Spark                                              | Now      |
| **Evaluate Goose as agent** | Test Goose (not for inference) alongside Claude Code for specific autonomous task patterns | Q3 2026  |
| **Watch Goose inference**   | Re-evaluate when Jetson CUDA support is documented and a production deployment exists      | Q4 2026  |
| **AAIF monitoring**         | Track AAIF governance maturity; flag if EU industrial agent workgroup forms                | Ongoing  |

**The framing mismatch to flag:** "Replace Ollama with Goose" conflates two architectural layers. Ollama is infrastructure (model server). Goose is an agent (orchestrator). Goose having built-in inference does not make it an Ollama replacement any more than Claude Code having tool use makes it a database replacement. Keep the layers separate until Goose's inference layer has standalone production evidence.

---

_Note: The goose-docs.ai blog post (source URL above) returned HTTP 403 on fetch. This analysis is based on Goose provider documentation, Ollama integration docs, AAIF announcements, and web research. Refresh this note if the blog post becomes accessible — the specific model list and hardware requirements in the post may alter the SWOT._

# Updating LLMs — Subscription Product Task

**Version:** 1.0.0 · **Updated:** 2026-07-01 · **Owner:** platform / HIC (risto.paarni@lifetime.fi)

## Why this exists

Our subscription products are LLM-backed — the model behind them changes far
faster than the product does. In the last three weeks alone: **Sonnet 5** went
GA (2026-06-30), **Fable 5** was pulled offline (2026-06-12, US export-control
directive, no return date), and NVIDIA dropped **Qwen3.6-27B-NVFP4** for
Blackwell / DGX Spark. Each of those is a reason to change what a paying product
runs on. This task makes "keep the LLMs current" a standing, discoverable
capability instead of something we remember to do after a model breaks.

It is not a per-product setting. **LLM choice is centralized** (see below), so the
task lives at the model layer and maps back to the products it affects.

## Where LLM choice actually lives

| Layer                 | File                           | Role                                                                                                             |
| --------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Tier catalog          | `src/agents/model-selector.ts` | LITE / STANDARD / HEAVY model options, ordered by preference; Acer GN100 / DGX Spark resource budget             |
| Provider routing      | `src/agents/llm-client.ts`     | Env-var precedence: Anthropic → Groq → Baseten → Ollama → vLLM → OpenAI-compatible                               |
| Per-agent pin         | `src/agents/*.agent.ts`        | Individual agents naming a specific model                                                                        |
| **Currency registry** | `config/llm-registry.json`     | **Canonical "what we should be on"** — status per model (current / candidate / deprecated / suspended / retired) |

## The task

`scripts/weekly/llm-currency-check.sh` — auto-discovered by `day-runner.sh`
(Sunday 04:00 UTC on DGX Spark; no registration, per the Script Automation Rule).

Each run lints every `.ts` under `src/agents/` against `config/llm-registry.json`
and writes `logs/llm-currency/summary-<STAMP>.json` + a log. It flags:

- **Stale/suspended in use** — a `deprecated`, `retired`, or `suspended` model still
  referenced in code → migrate (or add a fallback).
- **Candidates not adopted** — a `candidate` model we haven't wired in yet → evaluate.

**Report-only, HIC-gated.** The task never edits model routing. Swapping a
production model is a behavior + cost change and stays human-in-command — same
posture as `scripts/daily/check-ollama-models.sh` (reports, never auto-pulls) and
the RED zone of the auto-mode trust boundary. Model _judgment_ ("is this candidate
worth it") is surfaced, not decided by the script (CLAUDE.md Rule 5).

## Which subscription products this covers

Every LLM-backed subscription SKU in `dws10.com/config/products.json` — the agent
tiers (Compliance `CMP-*`, SiteSense `SS-*`, Material Oracle `MO-*`, Emissions
`ED-*`, Schedule Genius `SG-*`, Logistics `LOG-*`, Quality Gate `QG-*`, Customer
Sat `CSAT-*`, Lead Feedback `LF-*`, Competitor Surveillance `CS-*`, SEO `SEO-*`,
Deepwiki `DW-*`, Viability `VIA-*`, Sovereignty `SOV-*`, Themis `TH-*`), the
function/industry/channel bundles built on them, and the customer-choice products
(`aws-consultancy`, `conversational-agent`) whose copy names specific models.

They inherit their model from the tier catalog, so fixing the catalog fixes the
products. Where a product's _customer-facing copy_ names a model (e.g.
"Claude / Mistral / Llama on DGX Spark"), a status change that contradicts the
copy is also a `products.json` edit — and per the Dual Folder Sync rule that edit
must land in `landing-pages/dws10-com/config/products.json` in the same commit.

## Procedure when a model changes

1. **Update the registry** (`config/llm-registry.json`) — the single data edit:
   - New release → add it `current` (or `candidate` to stage evaluation).
   - Deprecation → set `deprecated`, set `replacement`.
   - Availability loss (provider outage / export-control) → set `suspended`, note it
     must not be a hard dependency.
2. **Re-run the task** to see what the change flags:
   `bash scripts/weekly/llm-currency-check.sh` (or wait for Sunday).
3. **Apply flagged migrations** (HIC-approved) in `src/agents/*` — swap the stale
   id for its `replacement`, or add a fallback for a suspended model.
4. **Sync customer copy** if any `products.json` model claim changed (+ mirror).
5. Commit; the log + summary JSON are the audit trail.

## Current baseline (first run, 2026-07-01)

The task flags this today — proposed follow-ups, pending HIC approval:

- **`claude-sonnet-4-20250514` [deprecated]** in `model-selector.ts`, `llm-client.ts`,
  `argus.agent.ts`, `designer.agent.ts` → migrate to **`claude-sonnet-5`**.
- **`claude-sonnet-4-6` [deprecated]** in `agora.agent.ts`, `kb.agent.ts`,
  `themis.agent.ts`, `vision-oracle.agent.ts` → migrate to **`claude-sonnet-5`**.
- **`claude-fable-5` [suspended]** — ensure no subscription product hard-depends on
  it while it is offline; route to a `claude-opus-4-8` fallback.
- **`qwen3.6-27b-nvfp4` [candidate]** — evaluate as a local coding/standard-tier
  option on DGX Spark (Blackwell NVFP4, ~4x memory reduction, strong vLLM + MTP
  throughput).

# Field Note — DGX Spark + Ollama local-first, LiteLLM only for glue

> **Canonical registry — single source of truth for the deployed Spark Ollama pair.** Registered in `DWS_TRUTH_STANDARD.md` §2 row 40. Structured mirror: `config/truth/dgx-ollama-deployed-pair.json`. If this note and `OLLAMA_DEPLOYED_MODELS` disagree, the TypeScript constant wins.

## VERSION AND AGENT HISTORY

***

Version: 1.3
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [Latest] Copilot remaining #2039: Docker Ollama `OLLAMA_API_BASE` + `extra_hosts`; six-id lint `--check`; `FRONTIER-CLAUDE-OPUS` = Opus 4.8 / `claude-opus-4-8`; floating LiteLLM image stripped from Deputy compose.

Version: 1.2
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] HIC accepted Q1 option A (keep deployed pair; LiteLLM glue only). Recorded Spark digest + OLLAMA_API_BASE operator explanation.

Version: 1.1
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] Applied matched DWS standards: Truth row 40, Model Standard §9 `local-sovereign`, Learning §10 Q1 form, Document `***` delimiters, Admin Manual v3.17, Standards Routing v1.1.

Version: 1.0
Tool: Cursor (Grok 4.6)
Agent: Cursor Agent
Date: 2026-09-18
Changes: [not latest] Mapped HIC 2026-09-18 local-first LiteLLM paste onto the deployed T0/T1/T2 path. Checked in secret-free `config/litellm-config.yaml`.

***

## Author

Cursor Agent (Grok 4.6) — cloud agent `bc-01a09dae-c4ec-7cd5-a66e-f6ae9071a455`

## Date

2026-09-18

## Location

Espoo, Finland (HIC). Agent: Cursor Cloud (not the DGX).

## Context

HIC pasted a 2026 local-first pattern: DGX Spark 128 GB unified memory + Ollama for high-volume work; paid frontier (Claude / GPT / Grok) only for hard tasks; LiteLLM as one OpenAI-compatible endpoint with fallbacks. DWS already runs this split. This note maps the paste onto the live files so the next session does not rebuild it or pull the wrong models.

## Ontology Tags

- **Geography:** Europe > Finland > Espoo
- **Sector:** Sovereign inference / DGX Spark operations
- **Entities:** Lifetime Oy, DGX Spark GN-100, Ollama, LiteLLM, Anthropic, Groq

## The Story

1. HIC pasted the “highest-ROI 2026” architecture: apps → LiteLLM → local Ollama (boring + private) vs paid APIs (only the smart stuff), with a complexity router (SIMPLE / MEDIUM / COMPLEX / REASONING).
2. That is already DWS policy: T0/T1 local, T2 paid (`docs/field-notes/2026-07-26-ollama-boss-cost-architecture.md`), `selectModel()` in `src/agents/model-selector.ts`, cheap→strong ladder in `src/factory/`, `LLM_PRIMARY=ollama` + `LLM_FALLBACK=groq` in `infrastructure/dgx-spark/docker-compose.yml`.
3. The paste names `llama3.3:70b`, `qwen2.5:32b`, `gpt-oss:120b`, `phi4`. Those are **not** on the box. Drift incident 31.07.2026: cataloguing undeployed ids made the sovereign path selectable in name only. Live pair is `nemotron-3-super` (deep) + `qwen3-coder:30b` (fast), enforced by `OLLAMA_DEPLOYED_MODELS`, `scripts/daily/check-ollama-models.sh` REQUIRED_MODELS, and `deploy.sh`.
4. `docs/Deputy-Agents-Architecture.md` §5.6 still sketches LiteLLM with `ollama/qwen2.5:72b` and listed `config/litellm-config.yaml` as TODO. The yaml is now checked in. The sketch is historical.
5. Cursor Cloud is not the Spark. This session did not run `ollama pull`, did not install Ollama, did not start LiteLLM, did not put keys in yaml.

## The Insight

The paste is a **mapping**, not a greenfield. Use LiteLLM as glue (one endpoint, fallbacks, spend callbacks). Keep routing in code (`selectModel` + factory ladder). Rule 5: do not add a second LLM as a complexity classifier. There is no 3B–8B always-on router model on the Spark; SIMPLE and MEDIUM both hit `qwen3-coder:30b` until HIC approves a REQUIRED_MODELS change.

Tokens on local Ollama are **not metered API spend**. They are still electricity, amortisation, and finite GB10 capacity (`kb/wiki/concepts/bounded-not-zero-sovereign-compute-economics.md`). Do not quote 60–80% savings as a customer figure without a measured week of LiteLLM/Prometheus traffic.

## What goes where (paste → DWS)

| Paste task                              | Paste route          | DWS route                                                                      |
| --------------------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| Classification, tagging, sentiment, PII | Local 7B–32B         | `local-fast` → `qwen3-coder:30b` (lite)                                        |
| Short summaries, JSON extraction        | Local                | same                                                                           |
| Email triage, metadata                  | Local 20B–70B        | `local-fast` / `local-strong` as needed                                        |
| Embeddings / RAG                        | Local                | `src/utils/embeddings.ts` (`DGX_OLLAMA_URL`)                                   |
| Multi-step / long-context               | Paid Sonnet/GPT/Grok | `heavy` local first (`nemotron-3-super`), then `claude-sonnet` / `claude-opus` |
| High-stakes code, strategy              | Paid                 | `escalateToClaude()` (requires `ANTHROPIC_API_KEY`)                            |
| Sensitive data                          | Local first          | already policy; do not send raw HIC threads to Grok from Cursor Cloud          |

LiteLLM aliases: SIMPLE/`local-fast`/`lite` → fast Ollama; MEDIUM/`standard` → fast Ollama (no mid-size pull); COMPLEX/REASONING/`smart`/`heavy`/`local-strong` → `nemotron-3-super`; paid names stay Anthropic via `os.environ/ANTHROPIC_API_KEY`. Groq is the burst fallback already set in compose.

Do **not** copy the paste’s `anthropic/claude-sonnet-4-20250514` — `config/llm-registry.json` marks that id deprecated; current HEAVY default is `claude-sonnet-5`. GPT-4o is not a DWS paid path.

## What shipped

- `config/litellm-config.yaml` — deployed Ollama ids only; `os.environ/ANTHROPIC_API_KEY`, `GROQ_API_KEY`, `LITELLM_MASTER_KEY`; Prometheus callbacks; no auto_router LLM.
- `LITELLM_TIER_ALIASES` + `LITELLM_LOCAL_MODEL` in `src/agents/model-selector.ts`, drift-guarded in `src/__tests__/model-selector.test.ts`.
- Deputy-Agents v1.4: TODO → SHIPPED; §5.6 points at the yaml.

## What did not ship (on purpose)

- No `ollama pull` of llama3.3 / qwen2.5 / gpt-oss / phi4.
- No LiteLLM container in `infrastructure/dgx-spark/docker-compose.yml` (image pin is a HIC/deploy decision; do not use a floating `:main-latest` tag — March 2026 supply chain, `docs/field-notes/2026-04-11-arxiv-2604-08407-relevance.md`).
- No NVIDIA PAIR wiring (already answered 2026-09-06; still optional).
- No Mission Control auth change. No secrets in git.

## Next Steps

1. HIC merges #2038 (TED, CI green) and #2039 (Q1 A accepted) on GitHub — this cloud agent cannot merge protected branches.
2. On the Spark only: pin a LiteLLM image digest and set `OLLAMA_API_BASE` before `:4000` (Admin Manual LiteLLM section).
3. Do not `ollama pull` undeployed paste models.

## HIC decision — Q1 (branch `cursor/dgx-ollama-litellm-router-a455`)

```
Q1. Keep the deployed two-model Ollama pair and treat LiteLLM as glue only?
    Options:      <A> Keep `nemotron-3-super` + `qwen3-coder:30b`; LiteLLM aliases only
                  vs <B> Approve a REQUIRED_MODELS pull (tiny classifier and/or larger local model) via Model Standard §10
    (RECOMMEND:   <A> — Rule 2 + 31.07.2026 drift. No §10 evidence pack exists for phi4 / gpt-oss / llama3.3.)
    Reversibility: two-way door (yaml + docs; no production Brain swap)
    Unblocks:     Spark operators can point commercial agents at `smart` and NemoClaw at `local-sovereign` or :11434
    Cost of delay: paste models keep leaking into runbooks; silent cloud fallback remains a §9 risk if someone copies Deputy-Agents §5.6
    Rests on:     Verified this session — OLLAMA_DEPLOYED_MODELS, check-ollama-models.sh, litellm-config.yaml fallbacks.
                  Propagated — 60–80% savings claim from the paste (not measured here).
```

Status: `ACCEPTED` — HIC 18.09.2026 chose **A** (recommended). No REQUIRED_MODELS pull. No §10 gate.

## N/A items (Rule 12)

- Step 1 KB compile: N/A this turn — Truth Standard row 40 + structured mirror is the registry; `/kb` needs DGX.
- Step 3 Learn HTML / Step 4 Drive: N/A — Cursor Cloud has no DGX pandoc / Google Drive MCP; repo markdown is the master (`DWS_TRUTH_STANDARD.md` §2E).
- Step 6 Calendar: N/A — no new dated commitment.
- Dual-folder: N/A (no public-site HTML).
- Thesis: N/A (no thesis-track claim).

***

**Document version:** v1.3 · **Date:** 18.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.

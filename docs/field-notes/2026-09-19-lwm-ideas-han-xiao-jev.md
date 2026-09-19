<!-- Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19 -->

# Field Note — LWM ideas from Han Xiao on Typesafe/Jev

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/dws10-i18n-25-dictionary-c0ce | Date: 19.09.2026 | Changes: Initial note. HIC asked for “LVM ideas” from Han Xiao (@hxiao) on Typesafe/Jev. LVM here means Lifetime World Model (LWM). Quote is HIC-supplied; this session did not fetch x.com.

Session Links & References:

- Related: `docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`, `docs/KYA_JEV_SPECIFICATION.md` (v0.6), `docs/FIELD_NOTE_WORLD_MODEL_V1_LOOP_2026.md`, `docs/field-notes/2026-07-04-palantir-wahlquist-us-open-weight-models-lwm-implications.md`
- View on GitHub: `docs/field-notes/2026-09-19-lwm-ideas-han-xiao-jev.md`

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Publication Status: INTERNAL — field note, not for public-site publication

---

**Date:** 2026-09-19
**Session:** Cursor, branch `cursor/dws10-i18n-25-dictionary-c0ce`
**Status:** PENDING_REVIEW — ideas only. No architecture change, no model train, no vendor API.

**Source:** HIC-pasted X post attributed to Han Xiao (@hxiao), ~6h before the ask. **MEDIUM confidence on attribution** — not independently fetched this session (Rule 12). Do not republish the quote on a DWS public surface without a primary URL or screenshot.

## Ontology tags

- Geography: Global (Typesafe/Jev US SaaS already logged) > Finland (LWM / DGX)
- Sector: Discriminative “System 1” models; agent routing / tool-calling; open-weight base models
- Entities: Han Xiao (@hxiao), Typesafe AI / Jev, Lifetime World Model, kya-jev
- Confidence: HIGH that the _ideas_ map to existing DWS files; MEDIUM that the tweet text is exact

## The supplied text

> thoughts on Typesafe/Jev: I'm surprised that a general-purpose classifier (or discriminative model) can be just as interesting to the public as a general-purpose generative model. I've worked on search and discriminative models for years, so maybe I should have called this upfront, tbf I never thought about making them general-purpose beyond search. Typesafe also positions Jev really well as "System 1", a complement to the generative models we already have. Humble, unassuming, and sidestepping the frontier-lab warzone.
>
> Jev's success could be disruptive to today's agentic systems in many ways, such as tool-calling and routing patterns. Over the last three years the consensus was to use a small generative model for routing, tool calling, MCP etc. Time to pause and rethink such architecture, because we'll probably see tool calling and routing move back to discriminative models. Whoever ships the next Jev-like open-weight base model will likely win the community.

## What this is _not_

- Not a reason to call vendor Jev. US host / CLOUD Act remains a hard blocker for Ledger-Native work (`docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`).
- Not a calibration result. kya-jev confidence stays `self-reported-uncalibrated` (`docs/KYA_JEV_SPECIFICATION.md` §7).
- Not a claim that DWS already has a discriminative router. `makeTypedDecision()` (`src/agents/kya-jev.ts`) still sits on `LLMClient` (generative structured output + KYA gate).

## LWM ideas (bind only)

HIC asked for LVM ideas. LWM in this repo is ontology + memory + the V1 control-room loop (perception → simulation → HIL-gated action). Xiao’s point is a **missing System-1 slice**, not a new industry list.

| Idea                                                                                                    | Bind to what we already have                                                                                                                                                                                                                                                                                             | Do not do from this note                                                                                                            |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1. General-purpose discriminative layer is publicly interesting _as a complement_, not a frontier rival | Same stack sentence as the 18.09 note: code constrains, typed judge, LLM deliberates, human governs. LWM keeps the world/state; System 1 should only answer typed questions over that state.                                                                                                                             | Do not rebrand LWM as “our Jev”.                                                                                                    |
| 2. Humble System 1 (sidestep the lab war)                                                               | Matches kya-jev Early Access + uncalibrated type. Matches LWM V1 “architecture, not shipped” (`docs/FIELD_NOTE_WORLD_MODEL_V1_LOOP_2026.md`).                                                                                                                                                                            | Do not write launch copy from this tweet.                                                                                           |
| 3. Tool-calling / routing / MCP may move off small generative models                                    | Today’s DWS default is still a small/fast generative path (Groq/Llama, DGX Qwen) plus KYA on the tool gate (`authorizeToolCall()`). kya-jev is the typed _question_ API, not yet a tool-router.                                                                                                                          | Do not rip MCP or `tools.ts` to a classifier this session.                                                                          |
| 4. Open-weight Jev-like base “wins the community”                                                       | Aligns with the existing LWM/open-weight thread (DGX, Qwen, Nemotron-as-archetype in the Wahlquist note) **and** the 18.09 HIC pivot: build sovereign typed decisions, do not rent US Jev. A future LWM artifact could be a **domain-tuned discriminative head** over LWM state (choice/score/boolean), weights on-prem. | Do not invent a dataset size, GPU hours, or ship date. No labeled DWS set exists yet (same gap as `scripts/calibrate-kya-jev.mjs`). |

## Decision recorded

Log as LWM R&D signal. Keep kya-jev as the KYA-gated typed API. Treat “open-weight System 1 on LWM state” as a **candidate Stage**, not a committed backlog item, until HIC answers the question below.

## Learning outcome (Art. 14)

1. KB: N/A — no KB API this session.
2. Field note: this file.
3. Learn/ HTML: N/A — internal.
4. Drive: N/A — repo is source of truth.
5. **HIC question:** Should LWM grow an on-prem discriminative System-1 head (open-weight, typed questions only), or should kya-jev stay generative-`LLMClient` forever and LWM stay ontology/memory only?
6. Calendar: N/A — no dated commitment.

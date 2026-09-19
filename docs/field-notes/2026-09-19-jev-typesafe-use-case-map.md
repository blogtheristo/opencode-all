<!-- Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19 -->

# Field Note — Study: TypeSafe Jev use-case map

<!-- prettier-ignore -->
***

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/dws10-i18n-25-dictionary-c0ce | Date: 19.09.2026 | Changes: Studied official TypeSafe use-case map (fetched). Bind only. Vendor latency/cost claims on that page not independently measured.

Session Links & References:

- Primary (fetched this session): https://docs.typesafe.ai/concepts/use-case-map and https://docs.typesafe.ai/concepts/use-case-map.md
- Index: https://docs.typesafe.ai/llms.txt
- Related: `docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`, `docs/field-notes/2026-09-19-jev-field-note-2-unlocks.md`, `docs/KYA_JEV_SPECIFICATION.md`

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Publication Status: INTERNAL — field note, not for public-site publication

<!-- prettier-ignore -->
***

**Date:** 2026-09-19
**Status:** PENDING_REVIEW — study. No vendor API. No new SKU.

**Source confidence:** **HIGH** on the list of categories and the task-shape table (page body retrieved). **LOW** on “150ms”, “100x cheaper”, “million times in the background” — vendor copy on the same page, not measured here.

The page is titled **Example use cases**. It says: brainstorm where TypeSafe could fit; open the closest industry; adapt example decisions to _your_ documents and actions. It is a menu, not a DWS product list.

## Vendor framing (five buckets)

From the page, not from us:

1. **AI Automation Software** — code owns control flow; TypeSafe does semantic decisions / language understanding; meant to run without a human co-pilot.
2. **Real-time applications** — claimed ~150ms; games / UI embed.
3. **AI Map Reduce over Big Data** — claimed 100x cheaper; classify traces, search corpora, extract features.
4. **Universal Verification** — check prompts, extractions, traces, tool calls of _other_ AIs (jailbreak, citation, hallucination).
5. **Harness Engineering** — Jev queries for model routing, semantic retrieval, LLM error detection, guardrails, trace classification.

DWS already agrees with (1) on _control flow_: `authorizeToolCall()` + `requireKyaVerdict()` + deterministic `deployGate` on seo-audit. DWS does **not** agree with “no human co-pilot” for Ledger-Native or consequential queues (`docs/KYA_JEV_SPECIFICATION.md` §7).

## Task shapes vs kya-jev primitives

Official table → what `makeTypedDecision()` can express today (`choice` / `score` / `boolean` only):

| TypeSafe shape               | kya-jev today              | Note                                                                    |
| ---------------------------- | -------------------------- | ----------------------------------------------------------------------- |
| Classification               | `choice`                   | Already used (dictionary `wave3_live`, seo-audit priority)              |
| Detection                    | `boolean`                  | Dictionary `sv_display_safe`, `aegis_scope`                             |
| Scoring                      | `score`                    | Lead-score advisory (`adviseLeadScore`) uses this                       |
| Routing                      | `choice`                   | Category → next path; still must be executed by **code**, not the model |
| Search / Retrieval / Ranking | **not first-class**        | Would be many scored/boolean calls or stay embeddings/RAG               |
| Verification                 | `boolean` or `choice`      | Closest to Universal Verification / guardrails                          |
| ML feature extraction        | `score`/`boolean` features | Needs a labeled downstream model we do not have                         |
| Structured data extraction   | **not first-class**        | Field recovery is generative; out of kya-jev scope                      |

## Automation use cases — bind / do-not-claim

| TypeSafe heading          | Closest DWS object                                        | Verdict                                                                         |
| ------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Search and retrieval      | pgvector / KB / `skills/query`                            | Signal. Do not replace embeddings this session.                                 |
| Scientific discovery      | Thesis / field-note labelling                             | Signal. Nice for _our_ notes, not a SKU.                                        |
| Model routing             | Groq vs Claude vs DGX (`AGENTS.md`)                       | Strong harness fit. kya-jev could _advise_ escalate; code must pick the client. |
| LLM guardrails            | KYA + tools.ts (no raw `execute_code`)                    | Strong fit as **advisory** checks. Not a replacement for KYA HMAC.              |
| Semantic code linting     | truth-lint / dictionary bans / CI                         | Advisory lint only.                                                             |
| Feature extraction        | `calibrate-kya-jev.mjs` needs labels first                | Blocked on dataset.                                                             |
| Recruiting                | None                                                      | No SKU. Do not invent.                                                          |
| Lead generation           | `outreach-lead-finder`, `keyword-intent`, `lead-feedback` | Same as field note 2 #2. Exempt-list candidates.                                |
| Customer support          | `helpdesk`                                                | Same as field note 2 #3. HIL stay.                                              |
| Insurance claims          | No claims product                                         | Signal only.                                                                    |
| Financial crime           | No KYC/AML product                                        | Signal only. Do not claim.                                                      |
| Legal and compliance      | `compliance`, Athena, industry pantheon                   | **Ledger-Native.** Vendor Jev forbidden. kya-jev advisory only.                 |
| E-commerce marketplaces   | Store catalog / `products.json`                           | Weak fit (we are not a marketplace).                                            |
| Moderation / T&S          | None public                                               | Signal only.                                                                    |
| Advertising               | Apollo / content-brief                                    | Advisory copy/policy checks possible.                                           |
| Gaming                    | None                                                      | Out of ICP.                                                                     |
| Risk assessment           | Viability / sitesense / nudge 2×2                         | Advisory risk _type_ only.                                                      |
| Demand forecasting        | None                                                      | Signal only.                                                                    |
| Graphs / knowledge graphs | LWM ontology / KB compile                                 | Typed edge/contradiction checks — LWM idea, not shipped.                        |

## What this study changes

- Field note 2’s “expensive queue” list is a **subset**. The official map is wider: harness (routing, guardrails, lint, RAG rerank) plus regulated verticals (insurance, financial crime, legal).
- Best _in-repo_ next consumers remain **helpdesk** and **lead generation** (exempt / HIL), then **model-routing advice** inside the existing client picker — not insurance/AML.
- “Code owns control flow” on the vendor page is already DWS doctrine. Their “million unattended runs” is **not** ours until calibration + HIC.

## Decision recorded

Treat https://docs.typesafe.ai/concepts/use-case-map as the vendor canon for _shapes_. Do not copy their industry list onto dws10. Do not cite 150ms / 100x as DWS performance.

## Learning outcome (Art. 14)

1. KB: N/A.
2. Field note: this file.
3. Learn/ HTML: N/A.
4. Drive: N/A.
5. **HIC question:** After helpdesk vs lead-scoring (field note 2), is the _third_ advisory consumer **model routing** (harness) or **compliance filing classify** (Ledger-Native, kya-jev only)? **Answered 19.09.2026: model routing.** `adviseModelRoute()`; `selectModel()` unchanged. Compliance classify not wired.
6. Calendar: N/A.

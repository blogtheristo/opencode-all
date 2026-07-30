<!--
VERSION AND AGENT HISTORY
Document: Raw signal — Nadella, "keep your harness separate from the model"
Version: 1.0
Date: 2026-07-30
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active (raw source — not compiled)
Agent: Claude Code, session claude/enterprise-ai-harness-0anl7s
Purpose: Raw capture of the 29.07.2026 Microsoft FY26 Q4 earnings-call harness framing
         and the third-party commentary that carried it, for later /kb compile.
         Compiled reading lives in docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md
-->

# Raw Signal — Nadella on the Harness (29.07.2026)

**Kind:** Market / competitive signal
**Captured:** 2026-07-30
**Compiled into:** `docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md`; `kb/wiki/concepts/adopt-the-base-own-the-loop.md` v1.1

## Source events

| # | Event | Date | Verification |
| - | ----- | ---- | ------------ |
| 1 | Microsoft FY26 Q4 earnings call. UBS analyst Karl Keirstead asks about open vs. closed models given Microsoft's frontier-lab exposure. | 2026-07-29 | CONFIRMED (TechCrunch 29.07.2026; Investing.com transcript) |
| 2 | Jensen Huang × Harrison Chase, LangChain fireside — "most companies will be built on harnesses" | 2026-07-08 | CORROBORATED (36Kr coverage; VentureBeat on Chase's harness framing). Wording as reported by commentary, not from a primary transcript. |
| 3 | BEP Research Substack post carrying both, teasing an enterprise cost-per-task pricing tool | 2026-07 (undated in excerpt) | Third-party author (HIC-confirmed). Page returned **HTTP 403** on fetch — body unverified beyond the excerpt below. |

## Verbatim quotes (event 1)

> "You've got to keep your harness separate from the model. The harness will ensure that your memory, your context, all of that is external. That means any given model at any given time is swappable."

> "The goal is to have the firm be in control of their own destiny."

Reported continuation — **PARTIAL / not verified verbatim against a primary transcript**:

> "…and in fact, train your own model when you don't want to use any external model itself because after all, you have all the outputs, you have all the traces, you have all the context."

## Third-party commentary excerpt (event 3) — quoted as the author's claims, not as fact

The author states, in first person, that they published a full harness framework on 12 July 2026 following "five launches in three days", and that BEP Research is building "a cost per task tool for enterprises". Their framing: *"The firm keeps the harness. The models compete for slots inside it."* and *"The moat question in enterprise AI just moved from who has the best weights to who owns the loop around them."*

**None of the author's claims about their own publications are verified.** Do not propagate as DWS-asserted fact (`kb/wiki/concepts/external-attribution-claims-grant-applications.md`).

## Why captured

Microsoft publicly stating the harness/model-separation architecture on an earnings call is simultaneous **external validation** of the DWS "Adopt the Base, Own the Loop" thesis and **positioning compression** — harness-ownership becomes incumbent-marketed language. Full reading, including the DWS response options, in the companion field note.

## Source URLs

- https://www.investing.com/news/transcripts/earnings-call-transcript-microsoft-q4-2026-beats-forecasts-stock-jumps-8-93CH-4822020
- https://techcrunch.com/2026/07/29/microsoft-is-openly-competing-with-openai-anthropic/
- https://bitcoinworld.co.in/microsoft-nadella-enterprise-ai-model-lock-in-warning/
- https://eu.36kr.com/en/p/3898288412411264
- https://venturebeat.com/orchestration/langchains-ceo-argues-that-better-models-alone-wont-get-your-ai-agent-to
- https://bepresearch.substack.com/p/jensen-huang-most-companies-will _(403 on fetch)_

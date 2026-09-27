<!-- Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19 -->

# Field Note 4 — Jev + LLMs (CJ Zafir)

<!-- prettier-ignore -->
***

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/dws10-i18n-25-dictionary-c0ce | Date: 19.09.2026 | Changes: Fourth Jev field note. HIC-supplied X post attributed to CJ Zafir (@cjzafir), ~7h before ask. Signal only. Did not fetch x.com. Vendor/user economics not independently verified.

Session Links & References:

- Field note 1: `docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`
- Field note 2: `docs/field-notes/2026-09-19-jev-field-note-2-unlocks.md`
- Field note 3: `docs/field-notes/2026-09-19-jev-field-note-3-smash.md`
- Use-case map: `docs/field-notes/2026-09-19-jev-typesafe-use-case-map.md`
- Spec: `docs/KYA_JEV_SPECIFICATION.md` (v0.8 — not bumped this note)

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Publication Status: INTERNAL — field note, not for public-site publication

<!-- prettier-ignore -->
***

**Date:** 2026-09-19
**Session:** Cursor, branch `cursor/dws10-i18n-25-dictionary-c0ce`
**Status:** PENDING_REVIEW — market signal. No vendor API. No spec bump. No 087 apply.

**Source:** HIC-pasted X post attributed to CJ Zafir (@cjzafir). Quote is user-supplied; this session did **not** fetch x.com. **MEDIUM** on attribution. **LOW/MEDIUM** on spend, latency, and multiplier figures (Rule 12). Do not put those figures on a public DWS surface (`dws10.com` or landing-pages mirrors).

## What the post says

Not Jev vs current LLMs — **Jev + LLMs**. Ten goods/bads: routing and small decisions steal LLM tokens; “learn from 1 prompt”; instant, no English thinking; $0 output; RAG / 32k too low, future 1M context; three decision types (choice / score / “Noul”); parallel questions on the same state vs sequential tokens; RLCD instead of RLHF; claimed 70–500 ms, 193.6× faster, 444.6× cheaper, and “at least 50% faster” for a Jev-like system. Author: burned **$3.40** on Jev in 24 hours.

## Bind (evidence only — no new product)

| #   | Claim in post                                        | DWS bind (repo evidence)                                                                                                                                                             | Do not                                                             |
| --- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| —   | Jev + LLMs, not Jev vs LLMs                          | Same humble line as notes 2–3 / Han Xiao. `kya-jev` is complement, not replacement. Model routing is already advisory via `adviseModelRoute()`; `selectModel()` stays deterministic. | Do not say kya-jev replaces Claude/GPT/Groq                        |
| 1   | Auto routing, if/else, retrieval, tool pick, scoring | Harness / TypeSafe map already bound. `adviseModelRoute()` is stay/escalate/demote only (`actionable: false`).                                                                       | Do not auto-swap clients from the hint                             |
| 2   | Fine-tune from 1 prompt                              | **Unsupported** for DWS. No 1-shot fine-tune path in `makeTypedDecision()`.                                                                                                          | Do not claim this shipped or will                                  |
| 3–4 | Instant; scores, no English planning                 | Vendor latency story. kya-jev still sits on `LLMClient` (generative structured JSON).                                                                                                | Do not claim kya-jev is sub-second                                 |
| 5   | $0 output                                            | Matches TypeSafe/OpenRouter **vendor** line in field note 1. Not a DWS price.                                                                                                        | Do not publish as DWS economics                                    |
| 6   | 32k too low; 1M context will fix RAG                 | Field note 1 independently recorded Jev 1.13 at **32,000** tokens. 1M / “fixes RAG” is forward-looking vendor/user talk.                                                             | Do not replace pgvector/KB this session                            |
| 7   | Choice / Score / **Noul** (yes/no)                   | kya-jev already has `choice` / `score` / `boolean`. “Noul” is **almost certainly** Boolean. **Fail loud:** we did not verify “Noul” is TypeSafe’s official name.                     | Do not rename `boolean` to Noul in code or spec                    |
| 8   | Parallel questions vs sequential tokens              | TypeSafe docs (field note 1): one call can take **multiple** typed questions. **Today** `makeTypedDecision()` is **one question per call**.                                          | Do not invent a batch API                                          |
| 9   | RLCD — calibrated confidence                         | DWS still types calibration as `self-reported-uncalibrated` (`src/agents/kya-jev.ts`). No labeled ECE study.                                                                         | Do not claim RLCD shipped or that kya-jev confidence is calibrated |
| 10  | 70–500 ms; 193.6×; 444.6×; 50% faster                | Same family as field note 1 OpenRouter “190x / 440x” — user-supplied, **LOW/MEDIUM**.                                                                                                | Do not put on dws10                                                |
| $   | $3.40 in 24 hours                                    | User spend anecdote.                                                                                                                                                                 | Do not invent or republish as a DWS claim                          |

**Sovereignty:** US vendor Jev remains **CLOUD Act–blocked** for Ledger-Native / customer-regulatory workloads (`docs/KYA_JEV_SPECIFICATION.md` §1; field note 1 privacy/terms). Keep `makeTypedDecision()` on DGX/Groq/Anthropic behind `issueKyaVerdict()`.

## Decision recorded

Log as a **complement** signal (Jev-like typed head in front of LLMs). Do not bump `docs/KYA_JEV_SPECIFICATION.md`. Do not apply `087_kya_jev_calls.sql`. Do not publish vendor economics as DWS claims.

## Learning outcome (Art. 14)

1. KB: N/A.
2. Field note: this file.
3. Learn/ HTML: N/A.
4. Drive: N/A.
5. **HIC question:** none this note — Wave 3 trio and apply 087 stay open from earlier notes.
6. Calendar: N/A.

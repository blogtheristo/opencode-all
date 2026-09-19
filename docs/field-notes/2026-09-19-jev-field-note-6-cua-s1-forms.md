<!-- Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19 -->

# Field Note 6 — CUA-S1-FORMS (tiny specialist + router)

<!-- prettier-ignore -->
***

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/dws10-i18n-25-dictionary-c0ce | Date: 19.09.2026 | Changes: Sixth Jev field note. HIC labeled the ask “jev field note 5”; Elvis newsjack already occupied `docs/field-notes/2026-09-19-jev-field-note-5-elvis-newsjack.md`. This file is **6**. HIC-supplied Layton Gott / Cua X posts. GitHub `trycua/cua` verified as source-only for Cua-S1 (no param/score/RAM claims in that README). Hugging Face model card carries size/score figures. 1 GB RAM remains tweet-only. Signal only. No CUA-S1 vendor-in. No spec bump. No 087.

Session Links & References:

- Field note 1: `docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`
- Field note 2: `docs/field-notes/2026-09-19-jev-field-note-2-unlocks.md` (browser / forms queue)
- Field note 3: `docs/field-notes/2026-09-19-jev-field-note-3-smash.md`
- Field note 4: `docs/field-notes/2026-09-19-jev-field-note-4-cj-zafir.md` (`adviseModelRoute` / `selectModel`)
- Field note 5 (Elvis / newsjack — occupied “5”): `docs/field-notes/2026-09-19-jev-field-note-5-elvis-newsjack.md`
- Han Xiao / discriminative System 1: `docs/field-notes/2026-09-19-lwm-ideas-han-xiao-jev.md`
- Spec: `docs/KYA_JEV_SPECIFICATION.md` (v0.8 — not bumped this note)
- GitHub (this session): `https://github.com/trycua/cua` — root README + `libs/cua-s1/README.md` + `libs/cua-s1/MODEL_CARD.md`
- Hugging Face (this session): `https://huggingface.co/cua-ai/cua-s1-forms`
- Handles in source: `@Layton_Gott`, `@trycua`

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Publication Status: INTERNAL — field note, not for public-site publication

<!-- prettier-ignore -->
***

**Date:** 2026-09-19
**Session:** Cursor, branch `cursor/dws10-i18n-25-dictionary-c0ce`
**Status:** PENDING_REVIEW — market signal. No CUA-S1 runtime. No vendor Jev. No spec bump. No 087 apply. No `cua` npm/Python dependency.

**Source:** HIC-pasted X posts attributed to Layton Gott (@Layton_Gott, ~4h) quoting Cua (@trycua, ~5h). Quote is user-supplied; this session did **not** fetch x.com. **MEDIUM** on attribution. Numbers: see fail-loud table (Rule 12). Do not put tweet figures on a public DWS surface (`dws10.com` or landing-pages mirrors).

**Numbering:** HIC said “jev field note 5”. Field note 5 is already the Elvis newsjack note. This is field note **6**.

## What the posts say

Cua open-sourced **CUA-S1**, a family of “System One” models for computer use. First member: **CUA-S1-FORMS** (`https://github.com/trycua/cua`). Layton: a 2.8 MB / 706K-parameter specialist scored **99.7%** on Cua’s form-filling eval vs **83.6%** for hosted Jev; claimed free, local, under 1 GB RAM, one-pass decisions so a giant LLM is not needed for every tiny action. Unlock story: tiny specialists (forms, CRM, data entry, browser, document routing, UI decisions) plus one powerful agent that **routes** between them.

## Fail loud — numbers vs sources

GitHub `trycua/cua` (root README, this session): Computer-Use 2.0 drivers / fleets / bench. **Does not** state 2.8 MB, 706K parameters, 99.7%, 83.6%, or 1 GB RAM.

`libs/cua-s1/README.md` (this session): family + first checkpoint `cua-s1-form-v0`. **Source-only.** Quote: “No checkpoint performance claim is established by this source-only release.” Weights **not** distributed. `MODEL_CARD.md`: “No model result is claimed by this source-only component.” `docs/RESULTS.md` on that tree: **404**.

| Claim in tweet          | GitHub `trycua/cua`                                                                                      | Hugging Face `cua-ai/cua-s1-forms` (this session)                                                                             | DWS use                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| 2.8 MB model            | **Not in repo READMEs**                                                                                  | **706,048** params, **2.8 MB** checkpoint (`state_dict` + config + history + val metrics)                                     | Vendor/HF claim. Not a DWS artifact.                                     |
| 706K parameters         | **Not in repo READMEs**                                                                                  | Same as 706,048                                                                                                               | Round-number tweet.                                                      |
| 99.7% form eval         | **Not claimed** (source-only)                                                                            | Head-to-head vs hosted Jev API (`jev-latest`): **99.7%** this model vs **83.6%** hosted Jev **overall** — Cua’s task, not DWS | Their eval. Do not claim kya-jev scores.                                 |
| Hosted Jev 83.6%        | **Not claimed**                                                                                          | Same HF paragraph                                                                                                             | TypeSafe hosted API on Cua’s forms. Not `makeTypedDecision()`.           |
| &lt; 1 GB RAM           | **Tweet only** — not in GitHub READMEs or the HF card fetched this session                               | Absent                                                                                                                        | Do not reprint as measured.                                              |
| FREE / local / one pass | GitHub: MIT **source**; weights not in that component; future weights may have separate commercial terms | One forward pass, option softmax; “not a reproduction of Jev”; not RLCD-calibrated                                            | Idea-aligns with DGX/Ollama sovereignty. **Do not claim we run CUA-S1.** |

## Bind (evidence only — no new product, no auto-swap)

| Claim in post                      | DWS bind (repo evidence)                                                                                                                                                                                                                                                           | Do not                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Tiny specialist + one router agent | Same humble System-1 line as TypeSafe + Han Xiao (discriminative complement). Router we already have: `adviseModelRoute()` is stay/escalate/demote (`actionable: false`); `selectModel()` stays deterministic (`src/agents/model-selector.ts`). kya-jev still sits on `LLMClient`. | Do **not** auto-swap the client to CUA-S1. Do not add a Cua dependency.        |
| Forms                              | Field note 2 unlock #7 already binds bulk forms to Browser MCP — not a new SKU                                                                                                                                                                                                     | No form-filler product line                                                    |
| CRM updates                        | `helpdesk` (draft + recommend; humans approve; never sends) + outreach CRM-adjacent agents                                                                                                                                                                                         | No CRM SKU                                                                     |
| Data entry                         | Firehorse DMS / report-api already exist (`AGENTS.md` Agent-02)                                                                                                                                                                                                                    | No data-entry SKU                                                              |
| Browser actions                    | Browser MCP (`AGENTS.md`); KYA on tools                                                                                                                                                                                                                                            | No auto-execute on specialist confidence                                       |
| Document routing                   | Firehorse DMS upload / documents — existing objects                                                                                                                                                                                                                                | No routing SKU                                                                 |
| UI decisions                       | Dashboard / hamburger / store surfaces already exist; typed `choice` is the bind, not a new UI agent                                                                                                                                                                               | No CUA-S1 in the Store                                                         |
| Local / free / small               | **Idea** only: DGX Spark + Ollama sovereign path (`AGENTS.md` §8). Hosted Jev remains **CLOUD Act–blocked** for Ledger-Native. A _hypothetical_ local CUA-S1 would still need KYA + **our** eval before Ledger-Native.                                                             | Do not claim DWS hosts or ships CUA-S1. Do not treat HF scores as calibration. |

**Sovereignty:** US hosted Jev stays blocked (`docs/KYA_JEV_SPECIFICATION.md` §1; field note 1). Open-source Cua **source** is MIT; that does not authorize production weights or a DWS integration. Keep `makeTypedDecision()` on DGX/Groq/Anthropic behind `issueKyaVerdict()`.

## Decision recorded

Log as a **specialist-head market signal** (narrow computer-use System 1 + deterministic router). Do not vendor-lock Cua. Do not bump `docs/KYA_JEV_SPECIFICATION.md`. Do not apply `087_kya_jev_calls.sql`. Do not publish 2.8 MB / 706K / 99.7% / 83.6% / 1 GB as DWS claims. Treat GitHub as **source-only**; treat HF scores as **Cua’s eval**.

## Learning outcome (Art. 14)

1. KB: N/A.
2. Field note: this file.
3. Learn/ HTML: N/A.
4. Drive: N/A.
5. **HIC question:** Keep CUA-S1 as watch-only (no eval), or schedule a **read-only** comparison of Cua’s published eval protocol against `scripts/calibrate-kya-jev.mjs` _without_ adding a dependency?
6. Calendar: N/A.

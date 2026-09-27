<!-- Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19 -->

# Field Note — NVIDIA SoL-Pi (self-evolving / auto-research harness)

<!-- prettier-ignore -->
***

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/dws10-i18n-25-dictionary-c0ce | Date: 19.09.2026 | Changes: HIC-pasted NVIDIA SoL-Pi brief verified against arXiv:2609.20519. Bookmark only. No DWS implementation of the four mechanisms. No DWS dollar-savings claim. 087 not applied.

Session Links & References:

- Paper abs: https://arxiv.org/abs/2609.20519
- Paper PDF: https://arxiv.org/pdf/2609.20519
- arXiv comments (Code / project page): https://github.com/NVlabs/SoL-Pi ; https://nvlabs.github.io/SoL-Pi/
- AGENTS.md bookmark (this session)
- Spec: `docs/KYA_JEV_SPECIFICATION.md` §2 (`adviseModelRoute` does not auto-evolve a harness)
- `docs/Deputy-Agents-Architecture.md`
- `DWS_ENGINEERING_STANDARD.md` (DDM-v1: engine vs policy; no silent policy-in-code)

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Publication Status: INTERNAL — field note, not for public-site publication

<!-- prettier-ignore -->
***

**Date:** 2026-09-19
**Session:** Cursor, branch `cursor/dws10-i18n-25-dictionary-c0ce`
**Status:** PENDING_REVIEW — research bind. Do not ship SoL-Pi. Do not apply 087. Do not invent DWS cost savings.

**Source:** HIC paste + arXiv:2609.20519 v1 (submitted 17 Sep 2026). Title: _SoL-Pi: Recursively Scaling Auto-Research Loops for Efficient Agent Harness_. Authors include NVIDIA / NTU / MIT affiliations on the PDF title block (Haozhe Liu, Tian Ye, Song Han, et al.).

## HIC vs paper (Rule 12)

| Claim          | HIC                                                                                 | Paper                                                                                                                                                                                             | Verdict                                                                                               |
| -------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Token cut      | “nearly half”                                                                       | Abstract: recorded token traffic **44.7–49.0%**                                                                                                                                                   | **HIGH** — same band; use the interval, not “half” on public DWS copy                                 |
| Match baseline | “matches its baseline harness on GPT-5.6 Sol and Opus 5”                            | Abstract: “performance **comparable to Pi** across GPT-5.6 Sol and Opus 5”                                                                                                                        | **HIGH** on models; naming: baseline **is Pi** (Earendil Works toolkit, ref. [35]), not a DWS harness |
| Mechanisms     | Action Fusion, Online Context Compact, ObservationPack, Evidence-Preserving Reducer | Same four, spanning action execution, compaction, observation, delegated reading                                                                                                                  | **HIGH**                                                                                              |
| Eval           | 51-task EdgeBench; ~⅓ API cost                                                      | Same; “API cost by about one third”                                                                                                                                                               | **HIGH**                                                                                              |
| $/hr           | $8.75–$13.50 vs native Codex and Claude Code; $4.36–$5.71 vs baseline               | Abstract: same dollars vs “native Codex and Claude Code harnesses” and “relative to Pi”                                                                                                           | **HIGH as paper/HIC claim** — **not** a DWS measurement                                               |
| Code           | “GitHub under NVlabs”                                                               | Not in PDF body/refs extracted this session. **arXiv comments** on the abs page: Code `https://github.com/NVlabs/SoL-Pi` (HTTP 200 this session); project page `https://nvlabs.github.io/SoL-Pi/` | **HIGH** for URL via abs comments, not via PDF bibliography                                           |

**Fail loud (paper-internal, not HIC):** §5 Conclusion also says “the best-performing candidates improve model performance by 5.3–12.8% and token efficiency by 9.8–18.2%, while the complete stack reduces token traffic by 44.7–49.0% … at comparable performance.” Do not collapse “best candidates” and “complete stack” into one number.

HTML fulltext (`arxiv.org/html/2609.20519`) timed out this session; PDF + abs used.

## What the paper is (not DWS)

RSI-inspired **harness-layer search**: auto-research loops across many repository-derived / verifier-driven environments; keep mechanisms that survive selection. Transfer claim: search across many environments rather than one (abstract). Related work cites OpenCode (`anomalyco/opencode`, ref. [33]) as prior art, not as SoL-Pi.

**DWS does not run SoL-Pi.** OpenCode + DGX vs Claude Code standby (`AGENTS.md` §1) is a **runtime choice**, not an auto-research loop over harness code. `adviseModelRoute()` is an advisory typed hint; `selectModel()` stays deterministic (`docs/KYA_JEV_SPECIFICATION.md` §2). That is not NVIDIA’s selection pipeline.

`DWS_ENGINEERING_STANDARD.md` §2: engine executes, policy decides; neither layer silently absorbs the other. Importing four NVIDIA mechanisms into AGENTS.md as architecture would violate that. `docs/Deputy-Agents-Architecture.md`: DGX substrate, typed tools, KYA — still the bind for production agents.

## What we did this session

Bookmark in `AGENTS.md` Related Documents → this note + arXiv abs. One sentence in kya-jev spec §2: SoL-Pi is harness-search, not a reason to auto-mutate kya-jev. **Spec version not bumped** (no kya-jev code change). Four NVIDIA mechanisms **not** implemented.

## Learning outcome (Art. 14)

1. KB: N/A.
2. Field note: this file.
3. Learn/ HTML: N/A.
4. Drive: N/A.
5. **HIC question:** Treat SoL-Pi as a **literature bookmark** only, or later evaluate a **read-only** comparison of OpenCode compaction vs ObservationPack — still no auto-mutate of kya-jev or DDM policy?
6. Calendar: N/A.

Status: PENDING_REVIEW

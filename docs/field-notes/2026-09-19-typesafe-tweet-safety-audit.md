<!-- Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19 -->

# Field Note — Safety audit of HIC’s posted X reply to @typesafeai

<!-- prettier-ignore -->
***

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/dws10-i18n-25-dictionary-c0ce | Date: 19.09.2026 | Changes: Post-post audit of HIC Draft B + closer. Agent did not tweet and did not change the live tweet.

Session Links & References:

- Posted text recorded in: `docs/field-notes/2026-09-19-typesafe-how-jev-is-bad-reply.md`
- Sovereignty/calibration source: `docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`
- Product state: `docs/KYA_JEV_SPECIFICATION.md` v0.8
- Truth: `DWS_TRUTH_STANDARD.md` row 39 (jurisdiction / CLOUD Act as a first cut); no new locked claim minted here
- Tweet URL: **unknown** (not supplied; not invented)

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Publication Status: INTERNAL — not for public-site publication

<!-- prettier-ignore -->
***

**Date:** 2026-09-19  
**Status:** Audit only. No X action by this session. No migration 087. No spec bump.  
**Posted text (verbatim, typo kept):**

```
@typesafeai For us (EU regulatory workloads) hosted Jev fails on two checked points: US host + SCCs, not EU-local processing (CLOUD Act), and confidence we cannot treat as calibrated (no DWS ECE; public ECE 0.144 / 16k “not ready” are not our tests). The System-1 *idea* we agree with — typed judge + LLMs, not vs them. Sequential generative wrappers aren’t that. We built a KYA-gated analog in-house instead of calling the US API. JEV Rocks (with juridisction problem not that of yours) !
```

## Verdict: **MOSTLY SAFE**

**Leave it up.** No takedown. No required edit.

Optional (not required): if HIC wants tighter legal wording later, replace “fails” with “is blocked for our Ledger-Native / EU-regulatory path” and add “advisory analog” — Draft A already has that precision; the posted short form does not create a defamation or secrets problem.

## Decision (leave-up)

| Question             | Answer                                                     |
| -------------------- | ---------------------------------------------------------- |
| Safe to leave up?    | **Yes**                                                    |
| Takedown needed?     | **No**                                                     |
| Required edit?       | **No**                                                     |
| Optional later edit? | Yes — “fails” vs “blocked for us”; analog vs true System-1 |

## Particular checks

1. **CLOUD Act / SCCs / “fails”** — Field note 18.09.2026: TypeSafe Inc. US host; EEA/UK/Swiss via SCCs + UK Addendum, not EU-local; **hard blocker for Ledger-Native / customer-regulatory**, same bucket as other US SaaS. Tweet scopes “For us (EU regulatory workloads)” so “fails” is **fit-for-us**, not “Jev is illegal” or “SCCs are void.” Slightly stronger than “blocked for Ledger-Native” but not a legal overclaim of TypeSafe’s product for all buyers. ZDR/DPA floor is omitted (space); that omission is not a lie.
2. **“DWS” named** — Acronym only (ECE context). No company registration, customer, or secret. Public brand already used. **OK.**
3. **“We built a KYA-gated analog”** — `src/agents/kya-jev.ts` exists; HMAC `requireKyaVerdict`; consumers are **advisory**; 087 **unapplied**; SKU Early Access / uncalibrated. Tweet does **not** say production, calibrated, or SKU. “Built … analog” is true as **code in repo**, not as a live audited product. Mild overclaim of maturity, not of existence. **Acceptable.**
4. **ECE 0.144 / 16k without @handles** — Same numbers as the 18.09 note (`@latent_node`, `@chrismdp`). Tweet says they **are not our tests**. Residual risk: someone attributes the numbers to DWS or to TypeSafe official docs. **Low**; handles would be cleaner; not a takedown.
5. **Secrets / customers / prices / SKU** — None. No `KYA-JEV-001`, €99, keys, customers. **Pass.**
6. **Closer “JEV Rocks / juridisction not that of yours”** — Softens: praise + blame on **jurisdiction**, not the team. **Muddies** grammar (typo; “not that of yours” can be read as “not your fault” or “not your problem to solve”). Does **not** retract CLOUD Act. Net: reputational, not legal.
7. **“Sequential generative wrappers aren’t that”** — True as a **standard** (Han Xiao / Draft A: discriminative System-1 next to LLMs). **kya-jev is still `LLMClient` structured JSON** with a KYA gate (`kya-jev.ts` comments: differentiator is the gate, not a non-generative head). Tweet criticizes wrappers as not System-1; it does **not** say our analog _is_ System-1. Implication risk if a reader maps “we built analog” + “wrappers aren’t that” → we already have true System-1. Spec still open: “LWM System-1 head vs `LLMClient`.” **Over-implication, not a false sentence.**

## Table: claim vs evidence vs risk

| Claim in tweet                                                 | Evidence                                                        | Risk                                                    |
| -------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------- |
| Hosted Jev “fails” on US host + SCCs, not EU-local (CLOUD Act) | Privacy/terms check 18.09.2026; blocker for Ledger-Native       | Medium wording (“fails” vs “blocked for us”); low legal |
| Confidence not treatable as calibrated; no DWS ECE             | Spec B1; harness exists; no labeled dataset; 087 unapplied      | Low                                                     |
| Public ECE 0.144 / 16k “not ready” are not our tests           | Field note 18.09; X posts originally unverified by that session | Low–medium misattribution without @handles              |
| System-1 _idea_ agreed; typed judge + LLMs, not vs them        | TypeSafe positioning; Han Xiao note                             | Low                                                     |
| Sequential generative wrappers aren’t that                     | Architectural standard; kya-jev still LLM structured output     | Medium over-implication of our stack                    |
| Built a KYA-gated analog in-house; no US API                   | Code + tests; no vendor key; advisory; Early Access             | Low–medium production overclaim                         |
| JEV Rocks; jurisdiction problem not TypeSafe’s team            | HIC closer                                                      | Low; muddies, does not contradict                       |
| (implied) DWS as speaker                                       | Acronym only                                                    | Low                                                     |
| SKU / price / secrets / customers                              | Absent                                                          | None                                                    |

## What this session did not do

- Tweet, delete, or edit the live post.
- Apply 087.
- Invent a tweet URL.
- Call ManagePullRequest (tool not present in this session’s catalog after `gh pr view 2044`).

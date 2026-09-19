<!-- Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19 -->

# Field Note — Draft public reply to TypeSafe AI (“Let us know how Jev is bad!”)

<!-- prettier-ignore -->
***

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/dws10-i18n-25-dictionary-c0ce | Date: 19.09.2026 | Changes: Drafts only. Not posted to X. Sources: field note 1, KYA spec, Jev notes 2–6, Han Xiao, TypeSafe use-case map, CUA-S1 note. No UNVERIFIED user economics (22M tokens, $3.40, 390×, 193.6×) as facts against TypeSafe.

Session Links & References:

- Field note 1: `docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`
- Spec: `docs/KYA_JEV_SPECIFICATION.md` (v0.8 — not bumped)
- Notes 2–6, Han Xiao, TypeSafe use-case map, CUA-S1 as listed in those files
- Tweet (HIC-supplied): TypeSafe AI @typesafeai — “Let us know how Jev is bad!” — this session did **not** fetch x.com

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Publication Status: INTERNAL — field note, not for public-site publication. Drafts may be posted only by HIC.

<!-- prettier-ignore -->
***

**Date:** 2026-09-19
**Session:** Cursor, branch `cursor/dws10-i18n-25-dictionary-c0ce`
**Status:** PENDING_REVIEW — copy drafts. **Do not post from this agent.** No vendor API. No spec bump. No 087 apply.

**HIC note (one line):** Keep email-length **internal**; post the short X variant only if you want a public, non-dunking sovereignty+calibration reply — otherwise keep all three drafts internal.

## Constraints (Rule 12)

Cite only what we verified or logged as blockers. Do **not** use other users’ UNVERIFIED spend/speed multipliers as evidence Jev is “bad.” Cua **83.6% vs 99.7%** is Cua’s form-filling eval of **hosted** Jev, not a DWS benchmark.

## Draft A — public reply (copy-paste)

```
@typesafeai Honest answer from an EU buyer, not a dunk.

For Lifetime Oy, hosted Jev is a poor fit in two places we actually checked:

1) Sovereignty. TypeSafe AI, Inc. (San Francisco) hosts the Service in the US. EEA/UK/Swiss use is a cross-border transfer under SCCs + UK Addendum, not EU-local processing. That is CLOUD Act exposure. We cannot put Ledger-Native / customer-regulatory state on that path. ZDR + a DPA would still be a floor, not a substitute for EU-local compute.

2) Calibration. We have no DWS-labeled ECE. An independent test reported ECE 0.144 (@latent_node) — not our study. A 16k-decision production test called it fast/cheap but not ready (@chrismdp). We will not treat returned “confidence” as a probability until we measure it on our own queues.

The product idea is the right shape: typed Choice/Score/Boolean as a complement to LLMs (code constrains, a judge sorts, LLMs deliberate, humans govern). What we will not do is treat a sequential generative wrapper as System-1. Han Xiao’s line matches ours: discriminative System-1 next to generative models, not instead of them.

We documented this and built a KYA-gated analog on our own stack rather than calling the US API. Happy to compare notes on calibration datasets — not on unverified token/cost screenshots.
```

## Draft B — short X (~500 chars)

```
@typesafeai For us (EU regulatory workloads) hosted Jev fails on two checked points: US host + SCCs, not EU-local processing (CLOUD Act), and confidence we cannot treat as calibrated (no DWS ECE; public ECE 0.144 / 16k “not ready” are not our tests). The System-1 *idea* we agree with — typed judge + LLMs, not vs them. Sequential generative wrappers aren’t that. We built a KYA-gated analog in-house instead of calling the US API.
```

Character count (Draft B body, excluding fences): agent should treat as under ~500; HIC paste into X composer to confirm.

## Draft C — email-length

```
Subject: Re: “Let us know how Jev is bad!” — how it is a poor fit for us

Hello TypeSafe,

You asked how Jev is bad. From Lifetime Oy’s side it is not “Jev is a joke.” It is “hosted Jev is the wrong substrate for the work we do.”

Sovereignty. We read typesafe.ai legal (privacy + terms, 18 Sep 2026): TypeSafe AI, Inc., 255 California St, Suite 1300, San Francisco, hosts the Service in the United States. EEA/UK/Swiss customers are on SCCs and a UK Addendum — a transfer, not EU-local processing. For carbon-ledger and customer-regulatory data that is a hard blocker, same bucket as other US SaaS. Zero-data-retention and a signed DPA would be the minimum even for an exempt, read-only pilot.

Calibration. Your API returns probabilities and confidence. We have not run a labeled DWS study, so we do not claim an ECE of our own. We logged an independent ECE of 0.144 (@latent_node) as unverified-as-ours, and a 16,000-decision production test (@chrismdp) that found the system fast and cheap but not ready for that environment. Until we have our own labels, we type confidence as self-reported-uncalibrated and refuse to auto-execute on it.

Architecture. We agree Jev + LLMs, not Jev vs LLMs. Typed Choice / Score / Boolean in front of an expensive queue is the right product shape (your use-case map: classification, routing, verification, harness engineering). What we will not do is call a sequential generative structured-output wrapper “System-1.” A true System-1 for us would be discriminative, on-prem or EU-sovereign, and calibrated. Cua’s published form-filling numbers (hosted Jev 83.6% on their eval) are theirs, not ours; we do not use them as a DWS benchmark.

What we did instead. We did not integrate the vendor API. We built a KYA-gated typed-decision primitive on compute we already run (no new US SaaS key), advisory only, with an HMAC verdict gate. Migration of the audit table is still unapplied; the calibration harness exists without a labeled dataset. That is the honest state.

If you ship EU-local processing and a published calibration protocol we can reproduce, we will re-open the vendor path. Until then the critique is fit-for-us, not a scoreboard.

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

## Learning outcome (Art. 14)

1. KB: N/A.
2. Field note: this file.
3. Learn/ HTML: N/A — internal.
4. Drive: N/A.
5. **HIC question:** Post Draft B on X, keep all drafts internal, or send Draft C privately?
6. Calendar: N/A.

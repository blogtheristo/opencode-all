<!-- VERSION AND AGENT HISTORY
Document: Competitor Watch — Pramaana Labs (AI Formal Verification)
Version: 1.0
Date: 2026-08-19
Author: Claude Code (Sonnet 5)
Branch: claude/math-academia-verification-96jpbf
Status: ACTIVE — standing competitor watch, monthly cadence
Document Type: Regulatory Radar (competitor-watch mode)
Classification: Claude-only automation (Claude Code Remote Routine; not an OpenCode/day-runner script — see CLAUDE.md Classification Rule)

AGENT HISTORY:
- v1.0 (2026-08-19): Initial watch file. Baseline facts established 2026-08-18/19 via WebSearch (pramaanalabs.ai itself blocked by session egress policy both times). HIC decision 2026-08-19: track monthly as a named competitor. Registered as `DWS_TRUTH_STANDARD.md` §2 row 38's companion tracking file. Companion: `docs/field-notes/2026-08-18-gajjala-math-academia-verification-signal.md`, `docs/field-notes/2026-08-19-truth-standard-row37-recommendations-not-gates.md`, `docs/PHD_FIREHORSE_EN.md` §14.51/§14.51.4.
-->

# Competitor Watch — Pramaana Labs

**Mode:** competitor-watch (monthly cadence), not a per-customer pipeline scan. Companion to `DWS_TRUTH_STANDARD.md` §2 row 38.

**Why DWS watches this company:** Pramaana Labs argues, from a different domain (law / drug discovery / tax) and with outside funding, the same claim the KYA program argues from the inside: once AI generation is cheap, verification — not intelligence — is the scarce, defensible layer. That makes them the closest thing DWS has seen to an adjacent-thesis company outside the DWS ecosystem. They are **not** a customer, partner, or vendor of DWS as of this registration — this file exists to notice if that changes, or if their trajectory starts to overlap with DWS's own trust/verification claims (KYA, `Legal/KYA_S1.md`).

## Baseline (established 2026-08-18/19)

Direct fetch of `pramaanalabs.ai` was blocked by the Claude Code session's network egress policy on both attempts (2026-08-18 and 2026-08-19) — every update below must be sourced via `WebSearch` or another reachable channel, not assumed reachable.

- **Funding:** $27M seed round, announced 2026-06-17, led by Khosla Ventures; Accel, BoldCap, Nexus Venture Partners, Premji Invest, and Unbound participating.
- **Leadership:** CEO/co-founder Ranjan Rajagopalan.
- **Technical approach:** hybrid architecture — LLMs paired with a deterministic verification layer built on Lean; press coverage describes it as compiler-like (checks every claim/calculation against governing rules rather than accepting fluent output).
- **Target verticals:** law, drug discovery, and tax preparation.
- **Domain partners:** former IRS Commissioner Danny Werfel (tax); professors from IIT Delhi, IIT Madras, and UC Berkeley (cybersecurity and drug-discovery systems).
- **Public positioning (from the site, HIC-supplied text; not independently re-fetched):** tagline "AI Learned To Sound Right Before It Learned To Be Right"; four pillars — "Plausible Is Not Provable," "Rules Are Not Flat Text," "Confidence Is Not Accountability," "Human Review Does Not Scale"; cites the **RuleArena** benchmark (ACL 2025, `aclanthology.org/2025.acl-long.27`, arXiv:2412.08972) as evidence LLMs struggle with rule-guided reasoning.
- **Adjacent personnel signal (self-reported, unconfirmed by a third party):** Rishikesh Gajjala, a credentialed researcher (PhD, Indian Institute of Science, 2025; postdoc, NYU Abu Dhabi CQTS — quantum computing/combinatorics), publicly stated 2026-08-18 he is leaving math academia to join Pramaana Labs to work on Lean-formalized proof verification of LLM-discovered mathematical proofs.

## What to check each month

1. **Funding / cap table changes** — new rounds, new investors, valuation signals.
2. **Product launches or GA announcements** — does the Lean-verification product ship, and in which vertical first (law / drug discovery / tax)?
3. **Named customers or design partners** — any enterprise names attached publicly.
4. **Team growth** — new hires, especially anyone with EU/regulatory-compliance domain expertise (would signal expansion toward DWS's own compliance-outcome space) or anyone whose hire independently corroborates the 2026-08-18 Gajjala signal.
5. **Publications or benchmarks** — new academic citations beyond RuleArena; whether they publish their own verification benchmark results.
6. **Direct overlap check** — does anything Pramaana ships start to compete with or resemble KYA (`Legal/KYA_S1.md`, `Legal/KYA_STANDARD_v1.md`) rather than just arguing a parallel thesis? This is the one finding that would change their classification from "adjacent-thesis company" to "competitor" in the row-38 sense.

## Log

| Date       | Finding                                                      | Source                                                                                                                                             | Action                                                                      |
| ---------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 2026-08-19 | Baseline established (see above). No prior tracking existed. | WebSearch (TechCrunch, SiliconANGLE, TheNextWeb, TechTimes, AI Weekly, ACL Anthology, arXiv, NYU Abu Dhabi CQTS, dblp, Google Scholar, OpenReview) | Registered this file + `DWS_TRUTH_STANDARD.md` §2 row 38 + monthly Routine. |

_Append one row per monthly check, even when there is no material change ("No material change since YYYY-MM-DD" is a valid, expected log entry — do not skip logging just because nothing happened). If a check finds something that changes DWS's own truth-standard guidance (row 38), open a PR updating both this file and that row in the same change, per §3 Conflict Resolution Rule._

# Field note — KYA assurance levels (AL1/AL2/AL3) and KYA-S1 blog series part 1/11 in five languages

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/kya-s1-blog-post-1-swb4k4 | Date: 09.08.2026 | Changes: Initial field note — tier rename to KYA-AL1/AL2/AL3 (KYA-S1 v1.3 → v1.4), KYA-S1 series part 1/11 drafted in FI/EN/SV/DE/FR, and the discovery of an unmerged second v1.3 line in `Legal/KYA_S1_v1.3.md`.

Document Status:

- Created: 09.08.2026
- Last Modified: 09.08.2026
- Language: English
- Publication Status: ACTIVE

---

## What happened

The HIC supplied an approved Finnish text for part 1 of an eleven-post KYA-S1 blog series and asked
for the English version to be checked against it. Checking surfaced three things, and all three were
decided by the HIC in the same session.

**1. The attestation tiers were renamed.** The approved Finnish text used `KYA-AL1 (Standard) /
KYA-AL2 (Enhanced) / KYA-AL3 (Critical)`, while `Legal/KYA_S1.md` v1.3 §8 and the English blog post
used `Bronze / Silver / Gold`. The thresholds behind the names were identical in both — annual /
quarterly / continuous cadence, and 15 min / 5 min / 60 s on IDV revocation and TC4 propagation — so
this was a naming conflict, not a substantive one. Surfaced rather than averaged (Rule 7). HIC
decision: **AL names stay.** `Legal/KYA_S1.md` bumped v1.3 → v1.4, §8 retitled "Assurance Levels
(KYA-AL)" with a Rule 12 supersession note mapping AL1=Bronze, AL2=Silver, AL3=Gold. Propagated to
`DWS_TRUTH_STANDARD.md` row 35 (metal names now marked deprecated/FAIL) and
`DWS_STANDARDS_LIBRARY.md` §3.3.

The rename also removes a real collision: `dws10.com/partners/` runs a Lifetime Certified Partners
programme whose tiers are literally named Bronze / Silver / Gold. Two unrelated ladders sharing three
names in the same buyer-facing estate is a support ticket waiting to happen. The metal names now
belong solely to the partner programme; assurance levels are `KYA-AL*`.

**2. The English post was a different post, not a translation.** `docs/blog-drafts/kya-s1-one-signed-page.md`
(6 Aug) was never part of an eleven-post series and carried three chapters the approved Finnish text
does not have: the public-comment window to 4 November 2026, the "why we say specification and not
standard" chapter, and the engineers' chapter positioning KYA-S1 next to SOC 2 / ISO 42001 / FedRAMP
and Palantir's MA-S2. HIC decision: **the English version is the Finnish one at 100 % correspondence.**
The three chapters were handed to the HIC as a copy-paste block and remain intact in the superseded
draft, which was not touched (Rule 12).

**3. Five languages.** Part 1 now exists as `docs/blog-drafts/know-your-agent-kya-s1{,.fi,.sv,.de,.fr}.md`.
FI and EN carry `Status: APPROVED` on explicit HIC approval. SV, DE and FR are `Status: DRAFT` and
carry `ai_disclosure: required` — the HIC approved FI and EN by name, and a general go-ahead is not
approval of a specific post (Rule 13). They also need the machine-translation label at publication
(`docs/BLOG_STANDARD.md` §3.2.1, EU AI Act Art. 50(4)).

## The insight

**A naming conflict between a specification and its own marketing copy is a signal that the
specification is not the source anyone actually reads.** The FI text was written by the HIC against
what KYA-S1 _means_, and it independently arrived at "assurance level" — the term the audience
already knows from eIDAS LoA and NIST IAL/AAL. The spec had metal tiers because the v1.0 session
reached for a familiar ladder without checking that the same ladder was already spoken for elsewhere
in the estate. The copy was right and the canonical document was wrong, which is the inverse of the
usual drift direction and worth noticing: `DWS_TRUTH_STANDARD.md` §2E ("repository-first") protects
against copy drifting away from the repo, but it does not by itself catch the repo being the stale one.

## What was found but not fixed

`Legal/KYA_S1_v1.3.md` is a **second, divergent v1.3** (07.08.2026, session
`claude/agent-use-cases-comparison-h7vl25`). It carries controls that `Legal/KYA_S1.md` does not —
TRS-4 (atomic authorization binding), TRS-5 (fail-closed authorization), PRV-4 (human decision
provenance), TC4-5 (capture precedes release), FLT-4 (bounded attribution clock) — and it is still
titled "Standard", the wording the 06.08 HIC correction removed from the other file. The two v1.3
lines never merged.

This matters beyond bookkeeping: the approved blog text cites **PRV-4** under EU AI Act Article 14,
and PRV-4 exists only in the unmerged file. As of this session the published series would cite a
control that the canonical specification does not define.

Not resolved here. Merging two divergent canonical lines is a structural decision, and picking a
winner silently is exactly the averaging Rule 7 forbids.

## Next steps

1. HIC decides the merge: fold `Legal/KYA_S1_v1.3.md`'s five new controls into `Legal/KYA_S1.md`
   (→ v1.5, keeping the Specification title and the AL naming), or declare the other file superseded.
   Blocking for the blog series, because part 1 cites PRV-4 and parts 6 and 7 are built on TRS-4/5 and FLT-4.
2. SV / DE / FR await HIC approval before publication, with the AI-translation label.
3. Hero infographics for the eleven posts go to `onelifetime.world/static/images/blog/` and the
   `landing-pages/onelifetime-world/` mirror in the same commit, named `kya-s1-series-NN-hero[-<lang>].png`,
   4K minimum per the PNG Export Rule.
4. Publication of the HTML posts (registry, `latestPosts`, `inject-blog-nav.cjs`, dual-folder sync)
   is not done in this session.

## Learning-outcome steps

- KB update (`/kb`): **N/A — deferred.** The substantive KB-worthy fact is the AL naming, and it is
  already canonical in `DWS_TRUTH_STANDARD.md` row 35 and `DWS_STANDARDS_LIBRARY.md` §3.3, which the
  KB compiles from. No second source of truth created.
- Drive export: **N/A — no Drive credentials available in this remote session.** The repo copy is the
  master (`DWS_TRUTH_STANDARD.md` §2E); export it from an authenticated session.
- Calendared commitments: **N/A — no new dated commitment.** The one date in scope, the KYA-S1
  public-comment window closing 4 November 2026, predates this session and was not created by it.
- HIC question: see "Next steps" item 1 — it is the decision-shaped one.

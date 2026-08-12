# Field note — KYA-S1 blog series: Ground Truth lock, spec merge, five-language publication

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/kya-s1-blog-post-1-swb4k4 | Date: 09.08.2026 | Changes: Initial field note — records the KYA-AL rename, the v1.3-line merge into the canonical specification, the Ground Truth lock for the 11-part blog series, and the five-language publication of part 1.

Document Status:

- Created: 09.08.2026
- Last Modified: 09.08.2026
- Language: English

---

## What happened

Three things that had been quietly blocking each other got unblocked in one session.

**1. The specification had forked without anyone noticing.** `Legal/KYA_S1.md` said v1.3 (06.08.2026, "Specification", Bronze/Silver/Gold). `Legal/KYA_S1_v1.3.md` also said v1.3 (07.08.2026, "Standard", Bronze/Silver/Gold) and carried five controls the other file did not have: TRS-4, TRS-5, PRV-4, TC4-5, FLT-4. Two files, same version number, different content, neither aware of the other. The blog series cites PRV-4 by name, so the series could not be published against the canonical file — the control it referenced did not exist there.

**2. The assurance-level names were decided.** HIC ruled Bronze/Silver/Gold → **KYA-AL1 (Standard) / KYA-AL2 (Enhanced) / KYA-AL3 (Critical)**. Thresholds unchanged. The rename also removes a genuine collision: `dws10.com/partners/` runs a Certified Partners programme with Bronze/Silver/Gold tiers of its own, and the two ladders were using identical words for unrelated things.

**3. The series had no Ground Truth for six of its eleven parts.** The index promised eleven posts; drafts existed for five. Parts 2, 4, 8, 10 had nothing, and parts 3 and 9 had adjacent drafts on different subjects. HIC supplied all six texts.

## The insight

**A version number is not a merge.** Both files were labelled v1.3 in good faith, by two sessions that each believed they were editing the canonical document. Nothing in the repo made the collision visible — no lockfile, no registry check, no test. It surfaced only because a blog post cited a control identifier and the citation could not be resolved.

The general shape: _a document is only canonical if something breaks when a copy of it diverges._ `DWS_TRUTH_STANDARD.md` names the canonical file, but naming it does not detect a second file claiming the same version. That is a mechanisable check that does not exist yet.

**Ground Truth has to be authored, not inferred.** Four series parts had no Finnish text. The agent could have written plausible ones — the topics were listed, the house voice is documented, the adjacent posts exist. Writing them would have inverted the entire model: Ground Truth is the HIC's canonical text, and Rule 13 approval is per post. Reporting the gap and stopping was the correct outcome even though it looked like non-delivery for one turn.

## What shipped

- `Legal/KYA_S1.md` **v1.3 → v1.5**. v1.4 = the KYA-AL rename. v1.5 = the merge of the parallel line: five controls added, TRS-1 amended with a per-consequence-class validity period, §4's Article 14 row now names PRV-4, §8 gains the extension-domain SLA table, §9 gains the honest TRS conformance note (three of TRS-1's four inputs are still absent in the reference implementation, and the specification now says so).
- `Legal/KYA_S1_v1.3.md` banner-marked SUPERSEDED, retained per Rule 12.
- Propagated to `DWS_TRUTH_STANDARD.md` row 35 and `DWS_STANDARDS_LIBRARY.md` §3.3; metal names marked deprecated.
- Eleven Finnish Ground Truth drafts locked, all `Status: APPROVED`.
- Part 1 published in five languages on `onelifetime.world/posts/` with hreflang across all five, dual-folder mirrored, registered in the blog registry, `latestPosts` and the nav injector. SV/DE/FR carry the mandatory AI-translation banner naming the Finnish master (BLOG_STANDARD §3.2.1, EU AI Act Art. 50(4)).

## What is still open

- **Parts 2–11 in five languages: 50 pages not yet generated.** Only part 1 is published.
- **Typos in the Ground Truth** are recorded per file in a `typos_flagged` frontmatter field, not corrected. Rule 12 forbids silently rewriting HIC formulations; publishing known typos in five languages multiplies them by five. Needs a one-word ruling.
- **The hero image is wrong and low-resolution.** `Blogisarja.jpg` shows twelve cards for eleven parts — "Osa 8" appears twice — at 1024×559 against a 3840 px minimum.
- **The wallet/IDV-4 contradiction is unresolved.** The superseded part-11 draft argued that wallet-anchored IDV may not be able to meet IDV-4's 60-second revocation at KYA-AL3, because the revocation latency of the EUDI status-list mechanism is not something the vendor controls. The approved part 11 does not mention it. That is a real specification-level question, not an editorial one.

## Next steps

1. Rule on the typos, then generate parts 2–11 × 5 languages.
2. Regenerate the series map at ≥3840 px with eleven cards.
3. Decide whether §5 of the superseded draft becomes its own post or a specification amendment.

## Learning-outcome steps

1. KB update — N/A: no new KB-shaped concept; the canon lives in `Legal/KYA_S1.md` and the standards registry, both updated in-session.
2. Field note — this file.
3. `Learn/` HTML — rendered alongside this note.
4. Drive export — N/A: no Drive tool call was made in this session; the repo remains source of truth and the export is outstanding.
5. HIC question — asked in session: whether to correct the Ground Truth typos before generating 50 translated pages.
6. Calendar — N/A: this session produced no dated external commitment. The KYA-S1 public-comment window closes 04.11.2026 and predates this session.

# Field Note: KYA-S1 Is a Specification — and Two Silent Defects a Merge Surfaced

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/arvonluonnin-ajurit-research-hpiipo | Date: 07.08.2026 | Changes: Initial field note. Records the KYA-S1 standard→specification reclassification, the new Approval Request Rule, and two defects the branch/main merge surfaced: a deleted VERSION AND AGENT HISTORY entry present on neither side, and a formatter hook that silently reverts the `***` delimiter rule on every edit.

Session Links & References:

- Claude Code (claude/arvonluonnin-ajurit-research-hpiipo): https://claude.ai/code

Document Status:

- Created: 07.08.2026
- Last Modified: 07.08.2026
- Language: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Field Note / HIC Learning Outcome

Related Documents:

- `Legal/KYA_S1.md` v1.3 (the reclassified specification)
- `DWS_TRUTH_STANDARD.md` v4.7 (row 35 corrected, row 36 added)
- `CLAUDE.md` — Approval Request Rule
- `docs/KONSULTOINNIN_KASIKIRJA_2026.md` v1.12 (§2.1 driver 1)
- `docs/blog-drafts/kya-s1-one-signed-page.fi.md` (DRAFT)

***

## What happened

Four threads, one session.

**1. KYA-S1 is a specification, not a standard.** The HIC corrected a claim that had propagated into the canonical spec's own title, both registries, the compliance hub, and a published post. A standard comes out of a standards body with a consensus process; KYA-S1 came out of one company and was published for comment. Reclassified throughout (`Legal/KYA_S1.md` v1.2 → v1.3), with a third drift guard added to Truth Standard row 35. The HIC's follow-up — _"we cannot publish standards"_ — is the sharper form: the word was not a label error, it was an implicit claim to be a standards body.

**2. The approval gate had a device bug.** A fenced markdown block does not render on a phone. The HIC could not read the draft I asked them to approve. Added the **Approval Request Rule** to `CLAUDE.md`, then amended it within the same session: default to a published Artifact for anything meant to be read and judged; fenced blocks remain only for an explicit "give me a copy-paste".

**3. Positioning sharpened.** §2.1 driver 1 now leads with quantified capacity, then value creation, then who decides. "Zero rekrytointiviive" moved from headline claim to explained footnote, per Boardy's direction. New capacity figures registered as Truth Standard row 36.

**4. The blog was rewritten for a reader who knows nothing.** The KYA-S1 post was accurate and unreadable. Rewritten in Finnish with the KYC→KYA analogy carrying the concept and every term explained. FI is now the translation base.

## The insight: a merge is a detection mechanism, not just an integration step

Merging `origin/main` produced one conflict. Resolving it surfaced two defects neither side was reporting.

**Defect 1 — a changelog entry deleted on both sides.** The v1.81 entry existed at merge-base `7eea44e` and was missing from the branch _and_ from main. The v1.9 session dropped it; this session propagated the loss to main by copying the branch's file across. Neither `git status` nor any lint flagged it, because both sides agreed. Only the three-way comparison against merge-base made it visible. Deleting `VERSION AND AGENT HISTORY` entries violates CLAUDE.md Rule 12; restored verbatim.

> **The general form:** a defect that exists identically on both branches is invisible to a two-way diff. It becomes visible the moment you diff both against their common ancestor. `git diff <merge-base> <side>` is a history-loss detector, and it costs one command.

**Defect 2 — the formatter fights the document standard.** The prettier `PostToolUse` hook rewrites `***` to `---` on every `Edit`/`Write`. CLAUDE.md's Markdown Delimiter Rule requires `***` around the `VERSION AND AGENT HISTORY` block for Pandoc compatibility. A parallel session had _just_ landed a commit fixing those delimiters (`ff9df71`); my first edit to the same file silently undid it.

This is not a one-off. Every future edit to any handbook-class document re-breaks the rule, and the fix commit looks like it worked because the reverting write happens afterwards. The workaround used here — apply delimiter fixes via `sed` in Bash, which the Edit-hook formatter does not intercept — is a workaround, not a fix.

**Reproduced live while writing this note.** The `Write` that created this file had `***` delimiters; the hook rewrote both to `---` before the file was read back. The defect demonstrated itself inside the document reporting it, which is about as clean a reproduction as one gets.

**Third observation, smaller:** a parallel session had already landed an equivalent merge resolution while this one was working. Discarding the duplicate local merge and re-applying only the unique contribution (the v1.81 restoration) on top of their work was cheaper and cleaner than merging two merges. Tagged `backup/local-merge-74ca6f4` before resetting.

## Next steps

- **The formatter defect needs a real fix.** Either exclude the `VERSION AND AGENT HISTORY` block from prettier, or add a `PostToolUse` step that re-asserts `***` after formatting. Until then every handbook-class edit silently breaks the rule.
- **KYA-S1's named models are unpinned.** Truth Standard row 36 carries a WARN: the _counts_ (3 open / 3 frontier) are registered on HIC authority, but the model names are not in any canonical file. The counts must not be quoted as an implied roster in customer-facing material until listed.
- **Two blog drafts await the HIC**, both `Status: DRAFT`, neither published: `kya-s1-one-signed-page.md` (EN, reopened by the specification correction) and `kya-s1-one-signed-page.fi.md` (FI rewrite). The FI text goes to Gemini for translation once approved.
- **DWS IQ 10 has no roadmap.** It was requested for the release timeline infographic; `DWS10_ROADMAP.md` does not exist and `dws10.com` is the store domain, not a version. Marked "horizon — no published date" in the infographic prompt pending a decision.

## HIC Learning Outcome — six-step record

1. **Knowledge base:** N/A — no `kb/` directory in this clone; content carried by this note and Truth Standard rows 35–36.
2. **Field note:** this document.
3. **`Learn/` HTML:** `Learn/2026-08-07-kya-s1-specification-and-two-silent-defects.html`.
4. **Drive export:** pending — this note follows the diff-export convention agreed 06.08.2026 (increments, not whole documents).
5. **HIC decision-shaped question:** see §Decision below.
6. **Calendar:** no new dated commitment. The KYA-S1 comment window closes 04.11.2026 and is already calendared.

## Decision

**Should the prettier hook be changed, or should the delimiter rule be?**

Two defensible answers, and they lead to different work.

**(A) Fix the hook.** Keep `***`. Exclude the `VERSION AND AGENT HISTORY` block from prettier, or re-assert the delimiters after formatting. Preserves Pandoc compatibility and every existing document. Cost: hook work, and the exclusion has to hold across every document class that uses the block.

**(B) Drop the rule.** Let prettier win and standardise on `---`. Cheaper — no hook work — but it requires confirming that Pandoc rendering actually still holds for the thesis and handbook pipelines, and it rewrites a rule that exists because someone hit that Pandoc problem before.

**(RECOMMEND: A.)** The rule was written from a real failure; the formatter is the newer arrival and the easier thing to bend. But A is only correct if Pandoc genuinely still needs `***` — if that constraint has lapsed, B is the honest simplification and I would rather find out than keep patching around a rule nobody needs.

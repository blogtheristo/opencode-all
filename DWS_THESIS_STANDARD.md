# DWS Thesis Standard

**Version:** 1.0  
**Date:** 2026-09-04  
**Canonical Location:** `/home/user/dws6/DWS_THESIS_STANDARD.md`  
**Scope:** All four thesis files (V3Thesis_EN.md, V3Thesis_FI.md, PHD_FIREHORSE_EN.md, PHD_FIREHORSE_FI.md)

---

## Overview

This standard governs thesis authorship, versioning, lockstep coordination, and HIC approval workflow. Thesis files are canonical sources for DWS research output; changes flow through structured gates to preserve provenance, accuracy, and institutional continuity.

**Thesis files are NOT free-form documents.** Every change is:

1. **Categorized** by type (additive / lockstep-only / structural)
2. **Drafted** with full text shown to HIC for dialogue and improvement
3. **Approved** via explicit HIC sign-off before commit/merge
4. **Versioned** in lockstep across all four files per the Thesis Rule

---

## §1: Thesis File Governance

### §1.1 The Four Files (Sacred Quartet)

| File                | Scope                                   | Language | Audience                                   |
| ------------------- | --------------------------------------- | -------- | ------------------------------------------ |
| V3Thesis_EN.md      | Master's thesis implementation evidence | English  | Metropolia + product team                  |
| V3Thesis_FI.md      | Master's thesis implementation evidence | Finnish  | Metropolia + Finnish stakeholders          |
| PHD_FIREHORSE_EN.md | PhD programme study plan (research)     | English  | LUT Doctoral School + scientific community |
| PHD_FIREHORSE_FI.md | PhD programme study plan (research)     | Finnish  | LUT Doctoral School + Finnish community    |

**Invariant:** All four files carry the same `Version: X.XX` number at the top of their VERSION AND AGENT HISTORY block. Version numbers never diverge.

### §1.2 Content Scope Rule (§1.4 of CLAUDE.md)

**Master's thesis (V3Thesis_EN / V3Thesis_FI):**

- **Focus:** Product and implementation
- **Included:** Engineering decisions, architecture, PRs merged, operational results, lessons learned, tooling, deployed capabilities
- **Excluded:** Market intelligence, competitive signals, long-horizon roadmap speculation, scientific framing

**PhD thesis (PHD_FIREHORSE_EN / PHD_FIREHORSE_FI):**

- **Focus:** Scientific research, institutional context, market signals
- **Included:** Research questions, theoretical framing, competitor movements, regulatory pipeline, standardization body activity, partnership signals, societal impact, 3–7 year horizon
- **Excluded:** Sprint-level implementation detail, internal product roadmap, non-public customer work

**Application:** When deciding which file(s) to edit, use this split. Implementation evidence belongs in the master's thesis; market signals and scientific framing belong in the PhD thesis.

---

## §2: Change Types & Workflows

### §2.1 Three Categories of Change

#### Category A: Additive Content (GREEN — HIC Dialogue + Approval)

**Definition:** A wholly new section, subsection, or localized addition. No structural changes, no deletion, no rewrite of existing passages. Existing eloquent formulations preserved per Rule 12.

**Examples:**

- Adding a new §10.32 with implementation evidence
- Adding a new Key Contribution (#57) to the PhD thesis
- Extending an existing section with new subsection

**Workflow:**

1. **Draft:** Write the complete new section text
2. **Show to HIC:** Print the new text in a fenced code block (full text, one block per section)
3. **HIC Dialogue:** HIC reads, asks questions, suggests improvements
4. **Revise:** Incorporate HIC feedback
5. **Approval:** HIC explicitly approves with "Status: APPROVED" for the specific section
6. **Commit & Lockstep:** Add to all four files; bump version across all four in lockstep

**HIC Approval Template:**

```
Status: APPROVED for §10.32 "Engineering Discipline Enforcement—Five Mechanically-Observable Gates"
Feedback applied: [list any changes HIC requested]
Ready to commit across all 4 files in lockstep v4.05→v4.06
```

#### Category B: Lockstep-Only Version Bump (GREEN — Automatic on Companion Changes)

**Definition:** All four files bump version number together when one or more files receive Category A (additive) or Category C (corrected) changes. No new content in files receiving only the version bump.

**Examples:**

- V3Thesis_EN.md gets §10.32 (new implementation evidence)
- V3Thesis_FI.md, PHD_FIREHORSE_EN.md, PHD_FIREHORSE_FI.md get version-bump-only entry per §1.2 content-scope rule

**Workflow:**

1. **Determine companion changes:** Identify which files get substantive changes and which get version-only
2. **Update all four:** Bump VERSION line and add VERSION AND AGENT HISTORY entry to each file
3. **Entry format for version-only files:** State explicitly that it is a lockstep-only entry; reference the companion files for substantive changes
4. **Example entry (master's thesis receiving version-only bump):**
   ```
   Version: 4.06 [Latest] | Tool: Claude Code | Model: … | Session: … | Date: 03.09.2026 | Changes: **Lockstep version-only entry per §1.4 scope rule.** Companion content: PHD_FIREHORSE_EN.md §14.51 (market-signal/scientific framing). This file receives no new content; recorded here to maintain four-file version synchronization.
   ```
5. **Commit together:** Commit all four files in a single commit with message naming all four

#### Category C: Corrective Changes (YELLOW — HIC Review, No Dialogue Loop)

**Definition:** Factual corrections, supersession markers, updated source citations. Not rewriting eloquent passages; not changing core claims. Examples: correcting a URL, adding a source, updating a date, adding "(superseded by §14.45)" marker to a prior claim.

**Workflow:**

1. **Make the correction**
2. **Show to HIC:** Brief explanation (one line) of what was corrected and why
3. **HIC Review:** HIC spot-checks; no dialogue loop needed unless the correction is ambiguous
4. **Commit:** Include the reason in the commit message
5. **Lockstep:** If any file is edited, all four must be bumped in version + lockstep entry

### §2.2 Forbidden Changes (RED — Blocked by Policy)

**These require explicit HIC approval before any session can proceed:**

- **Structural edits on any of the four files:**
  - TOC restructure or chapter renumbering
  - Renumbering existing §sections
  - Rewriting or deleting existing VERSION AND AGENT HISTORY entries
  - Removing existing content

- **Rewriting eloquent passages** (Rule 12: preserve formulation)
  - If a claim needs updating, supersede it (add a new section or marker "superseded by §X.Y") rather than rewriting in place

**Policy:** If a structural change is needed, the HIC must:

1. Review the proposed structure change
2. Approve it explicitly before the session begins
3. The session then documents the change with full provenance in the new VERSION AND AGENT HISTORY entry

---

## §3: VERSION AND AGENT HISTORY Format

### §3.1 Header & Latest Marker

Every thesis file starts with:

```
# VERSION AND AGENT HISTORY

Version: X.XX
Sessions & Modifications:
```

The top entry (most recent) carries `[Latest]`; the prior entry carries `[not latest]`. Example:

```
- Version: 4.06 [Latest] | Tool: Claude Code | Model: claude-haiku-4-5-20251001 | Session: claude/ai-software-engineering-krt01q | Date: 03.09.2026 | Changes: Added §10.32…
- Version: 4.05 [not latest] | Tool: OpenCode | Session: feat/operationalize-infra7-plans | Date: 30.08.2026 | Changes:…
```

### §3.2 Entry Format (Template)

```
- Version: X.XX [Latest|not latest] | Tool: <Tool Name> | Model: <model-id> | Session: <branch-name> | Date: DD.MM.YYYY | Changes: <description of changes, 1–3 sentences per bullet>
```

**Fields:**

- **Version:** Semantic version (e.g., 4.06)
- **[Latest|not latest]:** Exactly one entry per file carries `[Latest]`; previous carries `[not latest]`
- **Tool:** Where the change originated (Claude Code, OpenCode, GitHub Copilot CLI, etc.)
- **Model:** AI model if applicable (e.g., claude-haiku-4-5-20251001); omit if not model-generated
- **Session:** Git branch or session ID (e.g., `claude/ai-software-engineering-krt01q`)
- **Date:** ISO 8601 (DD.MM.YYYY)
- **Changes:** Prose description of what changed (what, why, impact)

### §3.3 Changes Field Best Practices

**Do:**

- State the **what**: "Added §10.32 (Engineering Discipline Enforcement—Five Mechanically-Observable Gates)"
- State the **why**: "Implementation evidence that Discipline Rules 1, 2, 4, 5, 9 can be mechanically enforced"
- Note **scope boundaries**: "Lockstep version-only entry per §1.4 scope rule; companion market signals at PHD_FIREHORSE §14.51"
- Include **file references**: "Companion: docs/field-notes/2026-09-03-gap-closure.md; KB: kb/wiki/ai-swe-gap-closure-2026-09.md"

**Don't:**

- Assume reader knows what a section title means; explain the contribution
- Leave scope ambiguous ("lockstep version bump" — explain whether it is content-only or version-only)
- Omit field notes or supporting documentation

---

## §4: The HIC Dialogue Workflow (Additive Content Only)

**Applies to:** Category A changes (new sections, subsections, major additions)

**Goal:** Improve input quality before text becomes institutional record. Dialogue happens before approval, not after.

### §4.1 Initiation Phase

**Agent** (Claude Code session) or **User** (HIC directly) proposes a new section:

- Draft complete text
- Identify which file(s) it belongs in (use §1.2 scope rule)
- Prepare for dialogue

### §4.2 Submission Phase

**Agent shows to HIC:**

```markdown
# Proposed Section for HIC Dialogue

File: V3Thesis_EN.md §10.32
Scope: Implementation evidence (master's thesis)

## Dialogue Text:
```

<full text of the new section in fenced code block>
```

**Questions for HIC:**

1. Is the framing clear? Does it establish the contribution?
2. Is the evidence sufficient?
3. Any refinements to the language?
4. Ready for lockstep commit to all 4 files after approval?

```

**Agent stops and waits.** Does NOT proceed to commit or other files.

### §4.3 Dialogue Phase

**HIC reads** the full text (in the fenced block, no scrolling required).

**HIC provides feedback:**
- Structural suggestions
- Language improvements
- Factual questions
- Scope boundary checks

**Example HIC feedback:**
```

Feedback on §10.32:

1. Strengthen the opening: "Five gates enforce mechanical..." → "Five hard CI gates demonstrate that Discipline Rules 1, 2, 4, 5, 9 can be mechanically enforced..."
2. Add a line naming what each gate blocks (DoD: low coverage, Skill: untested surfaces, etc.)
3. Note: is the "advisory" vs "hard" distinction clear enough for readers unfamiliar with DWS gates?
4. Looks good overall. Ready to revise with #1–3 and resubmit for approval.

```

### §4.4 Revision Phase

**Agent revises** based on feedback. Loops back to Submission if major changes; otherwise proceeds to Approval.

### §4.5 Approval Phase

**HIC explicitly approves** the final text:

```

✅ APPROVED for §10.32 "Engineering Discipline Enforcement—Five Mechanically-Observable Gates"

Revisions applied:

- Strengthened opening per feedback #1
- Added gate-by-gate summary per feedback #2
- Clarified advisory vs hard distinction per feedback #3

Ready for lockstep commit to all 4 thesis files (v4.05→v4.06).

```

### §4.6 Implementation Phase

**Agent commits:**
1. Add the approved text to all four files (with version bump per §2.2)
2. Commit message names the sections and references the approval
3. Push to branch and (optionally) create PR

---

## §5: Lockstep Version Bumping (The Four-File Rule)

### §5.1 Invariant

All four thesis files always carry the same `Version: X.XX` at the top of their VERSION AND AGENT HISTORY block.

### §5.2 Trigger Events

Lockstep bump is triggered when:
- Any one of the four files receives a Category A (additive) change
- Any one of the four files receives a Category C (corrective) change

### §5.3 Execution

1. **Identify scope:**
   - File A: gets §X.Y (new section) — Category A
   - Files B, C, D: get version-bump + lockstep-only entry — Category B

2. **Update all four:**
   - Increment `Version: X.XX` to `X.(XX+1)` in all four files
   - Add VERSION AND AGENT HISTORY entry to each file
   - For files with substantive changes: describe the changes
   - For files with version-only: state "Lockstep version-only entry per §1.2 scope rule; companion content at [other file names]"

3. **Commit in one go:**
```

git commit -m "docs: thesis lockstep v4.05→v4.06 (all 4 files)

- V3Thesis_EN.md: added §10.32 (Engineering Discipline Enforcement—Five Mechanically-Observable Gates)
- V3Thesis_FI.md: lockstep version-only entry per §1.4 scope rule
- PHD_FIREHORSE_EN.md: lockstep version-only entry per §1.4 scope rule
- PHD_FIREHORSE_FI.md: lockstep version-only entry per §1.4 scope rule

Companion: kb/wiki/ai-swe-gap-closure-2026-09.md

````

4. **Regenerate Learn/ HTML** (all four files):
```bash
node scripts/gen-thesis-html.cjs
````

5. **Commit HTML files:**
   ```bash
   git add Learn/V3Thesis_EN_v4.06.html Learn/V3Thesis_FI_v4.06.html \
           Learn/PHD_FIREHORSE_EN_v4.06.html Learn/PHD_FIREHORSE_FI_v4.06.html
   git commit -m "docs: thesis Learn/ HTML regenerated for v4.06"
   ```

---

## §6: Approval Gates (Who Decides What)

| Change Type                                     | Who Decides | Decision Required                                               | Blocking?                |
| ----------------------------------------------- | ----------- | --------------------------------------------------------------- | ------------------------ |
| Category A (additive)                           | HIC         | Explicit approval via fenced-text dialogue                      | YES                      |
| Category B (lockstep version-only)              | HIC         | Review of companion files; auto-approved if Category A approved | NO (if content approved) |
| Category C (corrective)                         | HIC         | Spot-check review; brief rationale                              | NO (logged for audit)    |
| Structural edits (rewrite, delete, restructure) | HIC         | Explicit pre-session approval                                   | YES                      |

---

## §7: Citation & Sourcing Rules

Every material claim in a thesis file must have a source:

- **Primary sources:** Direct link (URL, DOI), publication date, access date
- **Secondary sources:** Attribution (author name, publication, date)
- **Field observations:** "HIC observed X on DATE" or "DWS production data as of DATE"
- **Unverified claims:** Marked `[UNVERIFIED]` with rationale for inclusion

**In VERSION AND AGENT HISTORY:** When citing external sources or partner work, name them explicitly:

```
References: `docs/field-notes/2026-09-03-gap-closure.md`; KB: `kb/wiki/ai-swe-gap-closure-2026-09.md`; companion sections: V3Thesis §10.32, PHD_FIREHORSE §14.51
```

---

## §8: Handling Obsolete Passages

**Rule 12 (Fail Loud) applies to thesis files:** Never silently rewrite or delete eloquent passages.

**Approved approach:**

1. Keep the original passage verbatim
2. Add a new section or subsection with the update
3. Mark the original: "(superseded by §X.Y per session SESSION on DATE)"
4. Explain why in the VERSION AND AGENT HISTORY entry

**Example:**

```markdown
### §10.26 (Superseded by §10.32 per session claude/ai-software-engineering-krt01q on 03.09.2026)

Original passage…

---

### §10.32 Engineering Discipline Enforcement—Five Mechanically-Observable Gates

New evidence that updates the prior section…
```

This preserves institutional memory and explains the evolution of thinking.

---

## §9: Learn/ HTML Versioning

Every version of the thesis generates a timestamped HTML file in `Learn/`:

- `Learn/V3Thesis_EN_v4.06.html`
- `Learn/V3Thesis_FI_v4.06.html`
- `Learn/PHD_FIREHORSE_EN_v4.06.html`
- `Learn/PHD_FIREHORSE_FI_v4.06.html`

**Workflow:**

1. After lockstep version bump, run `node scripts/gen-thesis-html.cjs`
2. Four versioned HTML files are generated automatically
3. Commit the HTML files in a separate commit with message "docs: thesis Learn/ HTML regenerated for vX.XX"
4. Old versions are retained for archival (no deletion)

**Access:** Public-facing HTML versions live at `dws6.com/learn/V3Thesis_EN_v4.06.html` etc. (static CDN distribution).

---

## §10: Integration with DWS Standards

All thesis governance integrates with DWS_STANDARDS_LIBRARY.md:

- **DWS_DOCUMENT_STANDARD.md:** Covers header format, VERSION AND AGENT HISTORY block syntax, delimiter rules (\*\*\*), markdown conventions
- **DWS_THESIS_STANDARD.md** (this file): Covers thesis-specific workflows, lockstep rules, HIC dialogue gates, content scope split (this file)
- **CLAUDE.md:** References the Thesis Rule and scope rule (§1.2 above), required co-author attribution
- **DWS_TRUTH_STANDARD.md:** Registers canonical thesis file locations, version numbers, schema

**Canonical reference for thesis work:** This file + §1.4 of CLAUDE.md.

---

## §11: Changelog & Versioning Schedule

This document is versioned independently from the four thesis files. Updates to this standard do NOT trigger thesis version bumps (they are separate documents).

| Date       | Version | Change                                                                                                             |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| 2026-09-04 | 1.0     | Initial release: formalize HIC dialogue workflow, lockstep rules, Category A/B/C framework, Learn/ HTML versioning |

---

## Appendix A: HIC Dialogue Template (Copy-Paste Ready)

When proposing a new thesis section for dialogue:

```markdown
# Proposed Section for HIC Dialogue

**File:** [V3Thesis_EN.md / PHD_FIREHORSE_FI.md / etc.]  
**Section:** §X.Y [Title]  
**Scope:** [Master's implementation evidence / PhD market signal / etc.]  
**Rationale:** [One line on why this section is needed now]

## Text for Approval:
```

[Full text of the new section in one fenced code block — no line limit]

```

## Questions for HIC:

1. Does the opening clearly state the contribution?
2. Is the evidence sufficient for the audience?
3. Any language refinements?
4. Ready to proceed to lockstep commit across all 4 files after approval?

**Status:** Awaiting HIC dialogue.
```

---

## Appendix B: Corrective Change Template

For Category C changes (corrections, updated citations):

```markdown
# Corrective Change: [Brief Name]

**File(s):** [which files affected]  
**Section:** §X.Y  
**Change Type:** [Factual correction / Updated source / Supersession marker / etc.]

**Original:** [quote the original text]  
**Correction:** [describe what changed and why]  
**Source:** [why this change is needed — new data, publication, clarification]

**Status:** Ready for HIC review.
```

---

**Document Owner:** Risto Anton Päärni (Founder, Lifetime Oy)  
**Last Updated:** 2026-09-04  
**Next Review:** 2026-12-04 (quarterly)

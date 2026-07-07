---
name: citation-fixer
description: >
  Use when a blog post, standard, INTRO_*.md, or wiki article has broken,
  missing, or inconsistent citations — fixes the links, normalises the style
  (footnote vs inline), and verifies every claim has a source.
argument-hint: "path to the markdown file or directory; optional --style=footnote|inline"
allowed-tools: [Read, Edit, Grep, WebFetch]
track: gbrain
triggers:
  - "fix citations"
  - "broken links in this doc"
  - "missing source"
  - "footnote cleanup"
  - "verify the references"
reads-pages:
  - "**/*.md"
writes-pages:
  - "**/*.md (target file only)"
---

# Citation Fixer

**Repair, normalise, and verify citations** in any markdown doc — blogs,
standards, INTRO drafts, wiki entries.

Based on `citation-fixer` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/citation-fixer).

## In scope

- `docs/**/*.md` (standards, blog drafts, market research)
- `kb/wiki/concepts/**`, `kb/wiki/entities/**` (with care — `kb/wiki/` is
  LLM-owned per `/kb` rules; prefer triggering `/kb compile` after)
- `INTRO_*.md` (investor docs)

## Out of scope (RED zone — never edit)

- `docs/metropolia/master-thesis/**` (thesis files)
- `docs/PHD_FIREHORSE_*.md` (thesis files)
- `Learn/` versioned thesis HTML

For thesis files, surface the broken citations as a report only.

## Steps

1. Parse the target file's citations (footnotes, inline `[text](url)`, named refs).
2. For each URL, verify reachability (skip on offline mode).
3. Replace dead links with `[dead-link archived: <archive.org URL>]` if findable, else flag.
4. Normalise to the requested style (default: footnote at end of file).
5. Ensure every paragraph with a factual claim has at least one citation;
   flag uncited claims as `[citation-needed]`.

## Output

```json
{ "fixed": 6, "deadFlagged": 2, "needsCitation": 4, "style": "footnote" }
```

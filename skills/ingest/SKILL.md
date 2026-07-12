---
name: ingest
description: >
  Use when the user wants to add a file, URL, note, meeting transcript, voice
  memo, or any raw source into the DWS Knowledge Base. Routes content into
  `kb/raw/{articles,repos,images,signals}/` and then offers to run `/kb compile`.
  This is the gbrain "front door" for the brain.
argument-hint: "path or URL or pasted text; optional --as=article|repo|image|signal"
allowed-tools: [Bash, Read, Write, WebFetch]
track: gbrain
triggers:
  - "add to brain"
  - "ingest this"
  - "save this for later"
  - "add to kb"
  - "remember this"
  - "drop this into raw"
reads-pages:
  - kb/raw/**
writes-pages:
  - kb/raw/articles/**
  - kb/raw/repos/**
  - kb/raw/images/**
  - kb/raw/signals/**
  - kb/raw/_inbox.md
---

# Ingest — Brain Front Door

**Reuses `/kb ingest`. Does not ship a parallel pipeline.** This skill is a
trigger surface that classifies the source and delegates.

Based on `ingest` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/ingest).

## Routing

| Source shape                       | Lands in                     |
| ---------------------------------- | ---------------------------- |
| `.pdf`, `.md`, `.html`, web URL    | `kb/raw/articles/`           |
| Code dump, repo snapshot, git URL  | `kb/raw/repos/`              |
| `.png`, `.jpg`, `.svg`, screenshot | `kb/raw/images/`             |
| Regulatory / market signal note    | `kb/raw/signals/`            |
| Free-text snippet < 200 words      | append to `kb/raw/_inbox.md` |

## Steps

1. Detect source type (extension, URL pattern, content shape).
2. Resolve a slug — `YYYY-MM-DD-<kebab-title>`.
3. Run `/kb ingest <path> [--as <subfolder>]` (delegates to the existing kb CLI).
4. Offer to run `/kb compile` if `kb/raw/` has > 5 unprocessed entries.
5. Never call out to the wiki layer (`kb/wiki/`) directly — that's `enrich`/`maintain`.

## When NOT to use

- Confidential / PII data — KB is not cleared for PII; see `docs/DWS_DATA_STANDARD.md`.
- Thesis source files (RED zone) — keep them in their canonical thesis paths,
  do not duplicate into `kb/`.
- Public-site copy — do not ingest `dws10.com/`, `onelifetime.world/`, etc.
  source HTML; those are owned by the dual-folder-sync gate.

## Output

```json
{ "added": ["kb/raw/articles/2026-05-12-csrd-sme-thresholds.md"], "nextSuggested": "/kb compile" }
```

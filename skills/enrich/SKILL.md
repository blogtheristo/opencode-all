---
name: enrich
description: >
  Use after `ingest` or `/kb compile` to auto-link new wiki articles into the
  existing concept/entity graph — add backlinks, surface duplicates, propose
  merges, and tag stale neighbors for re-compile.
argument-hint: "optional slug or path; default scans recently changed wiki articles"
allowed-tools: [Bash, Read, Edit, Grep]
track: gbrain
triggers:
  - "enrich the brain"
  - "auto-link"
  - "wire up new article"
  - "after ingest"
  - "fix backlinks"
reads-pages:
  - kb/wiki/_index.md
  - kb/wiki/concepts/**
  - kb/wiki/entities/**
  - kb/wiki/summaries/**
writes-pages:
  - kb/wiki/concepts/**
  - kb/wiki/entities/**
  - kb/wiki/_index.md
  - kb/wiki/_index-by-topic.md
---

# Enrich — Auto-link Facts

**Run after every ingest.** Adds the missing edges between new and existing
wiki nodes so `/kb ask` can find them.

Based on `enrich` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/enrich).

## Steps

1. Find articles touched in the last `/kb compile` (look at `kb.json.lastCompile`).
2. For each, extract candidate links (entities, concepts named in body).
3. Open each target wiki page, add a `Referenced by:` backlink if missing.
4. Regenerate `kb/wiki/_index.md` and `kb/wiki/_index-by-topic.md`.
5. Flag any article that gained 0 backlinks as a possible orphan — write
   `kb/wiki/_stale.md` entry with reason `no-incoming-links`.

## Constraints (per `/kb` skill rules)

- Never hand-edit `kb/wiki/` outside this skill or `/kb compile`.
- All wiki writes go through the kb agent's `kb_write_article` tool — that
  enforces path-traversal protection.

## Output

```json
{ "linksAdded": 17, "orphansFound": 2, "indexesRegenerated": true }
```

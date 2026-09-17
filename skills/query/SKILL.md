---
name: query
description: >
  Use when the user asks a question that the compiled DWS wiki could answer
  directly — concept lookups, entity lookups, "what did we decide about X",
  "where in the wiki does Y show up". Delegates to `/kb ask`; gbrain's
  contribution is the trigger surface and the citation contract.
argument-hint: "the question in natural language; optional --save to persist the answer"
allowed-tools: [Bash, Read, Grep, Glob]
track: gbrain
triggers:
  - "what do we know about"
  - "wiki says"
  - "ask the brain"
  - "concept lookup"
  - "where does X show up"
  - "is X in the kb"
reads-pages:
  - kb/wiki/_index.md
  - kb/wiki/_index-by-topic.md
  - kb/wiki/concepts/**
  - kb/wiki/entities/**
  - kb/wiki/summaries/**
writes-pages:
  - kb/wiki/reports/<slug>.md
---

# Query — Hybrid Brain Lookup

**Reuses `/kb ask`. Adds a citation contract.** Every answer this skill returns
must cite at least one `kb/wiki/**` path; if it cannot, it must say so
explicitly and recommend `/kb research` (deeper, slower).

Based on `query` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/query).
**Source pin:** garrytan/gbrain @ VERSION 0.46.23.0, observed 2026-08-20 (see docs/field-notes/2026-08-20-external-skill-provenance-audit.md).

## Steps

1. Resolve `$ARGUMENTS` into `{question, flags}`.
2. Run `/kb ask "<question>" [--save]`.
3. Validate citations — answer must reference ≥ 1 wiki article path.
4. If no citation exists, return `{ "status": "no-evidence", "suggest": "/kb research" }`.
5. If `--save`, the answer is persisted to `kb/wiki/reports/<slug>.md`.

## Output

```json
{
  "status": "ok",
  "answer": "...",
  "citations": ["kb/wiki/concepts/csrd-sme-thresholds.md", "kb/wiki/entities/efrag.md"],
  "savedTo": "kb/wiki/reports/2026-05-12-csrd-sme-thresholds.md"
}
```

## When NOT to use

- Brand-new question with no kb evidence — use `/kb research`.
- Code search — use `Grep` / `Glob` / Explore subagent.
- External / live web search — fetch the page first via `WebFetch`, then
  `/ingest`, then re-query.

---
name: maintain
description: >
  Use weekly (or when `/kb lint` surfaces issues) to clean up the wiki — drop
  broken refs, archive stale entries, deduplicate summaries, prune
  `kb/ephemeral/` entries older than 7 days. Idempotent.
argument-hint: "optional --dry-run; default applies changes"
allowed-tools: [Bash, Read, Edit, Glob]
track: gbrain
triggers:
  - "clean up the brain"
  - "wiki maintenance"
  - "weekly kb cleanup"
  - "prune ephemeral"
  - "broken backlinks"
reads-pages:
  - kb/wiki/**
  - kb/ephemeral/**
writes-pages:
  - kb/wiki/_stale.md
  - kb/ephemeral/**
---

# Maintain — Weekly Brain Cleanup

**Idempotent. Safe to run any time.** Mirrors what `scripts/daily/kb-cleanup.sh`
already does for ephemeral, plus weekly wiki-level cleanup.

Based on `maintain` in gbrain by Garry Tan
(https://github.com/garrytan/gbrain/tree/master/skills/maintain).

## Steps

1. Run `/kb lint` — capture orphans, broken backlinks, stale summaries.
2. For each broken backlink, either fix the path or remove the dangling
   reference (never silently 404).
3. Move ephemeral entries older than 7 days to the OS trash (or delete if
   the user said "yes" once). Defer to `scripts/daily/kb-cleanup.sh` if it
   already ran today.
4. Update `kb/wiki/_stale.md` with current orphan and stale-summary lists.
5. Report a one-line summary.

## Schedule

This skill is the weekly companion to the daily `kb-cleanup.sh`. Register it
in `scripts/weekly/` via `cron-scheduler` if not already present.

## Output

```json
{ "brokenBacklinksFixed": 4, "orphansMarked": 3, "ephemeralPruned": 11 }
```

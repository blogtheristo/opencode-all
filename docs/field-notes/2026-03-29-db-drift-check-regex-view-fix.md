# Field Note: db-drift-check.py Regex & View Tracking Fix

**Date:** 2026-03-29
**Author:** Claude Opus 4.6
**Script:** `scripts/db-drift-check.py` v2.0 -> v2.1

## Problem

Two reliability issues in `scripts/db-drift-check.py` produced incorrect drift reports:

### 1. False positive table name from SQL comments

`get_migration_tables()` regex matched `CREATE TABLE` inside single-line SQL comments.
`026_security_fixes.sql` line 296 contains:

```sql
-- Fix: CREATE TABLE IF NOT EXISTS + indexes + RLS (fully idempotent)
```

The regex `CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)` matched the
commented-out `CREATE TABLE IF` and captured `"if"` as a table name (the optional
`IF NOT EXISTS` group didn't match because `IF` wasn't followed by `NOT`). This produced
75 tables instead of 74, with `"if"` appearing in no-RLS and drift reports.

### 2. Views not tracked, causing false drift alerts

`get_live_tables()` returns paths from the Supabase PostgREST OpenAPI spec, which
includes both tables AND views as top-level paths. However, `get_migration_tables()`
only parsed `CREATE TABLE` statements. Result: ~20+ views in the live DB appeared as
"unmigrated tables" in drift reports. There are ~64 `CREATE VIEW` / `CREATE OR REPLACE VIEW`
statements across 16 migration files.

## Fix (v2.1)

1. **Comment stripping:** Added `re.sub(r"--.*$", "", content, flags=re.MULTILINE)` before
   regex matching in `get_migration_tables()` and the RLS pre-scan. Removes single-line
   SQL comments so regex only matches actual DDL statements.

2. **View parser:** Added `get_migration_views()` function that parses
   `CREATE [OR REPLACE] VIEW` statements from migration files (with the same comment
   stripping).

3. **Drift comparison:** Changed `run_plan()` to compute `repo_objects = tables | views`
   when comparing against live DB paths, so views no longer appear as "unmigrated tables".

4. **RLS scan hardened:** Applied the same comment stripping to the `ALTER TABLE ... ENABLE
   ROW LEVEL SECURITY` pre-scan to prevent potential false positives there too.

## Files Changed

| File | Change |
|------|--------|
| `scripts/db-drift-check.py` | v2.0 -> v2.1: comment stripping, view parser, drift fix |

## Verification

```bash
python scripts/db-drift-check.py --dry-run
# Expect: 74 tables (not 75), N views, no "if" in output
```

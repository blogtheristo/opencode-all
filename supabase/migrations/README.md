# Supabase Migrations — DWS6

> VERSION: 1.1 | Date: 2026-07-02 | Owner: Marcus (Systems Architect)
>
> v1.1 changes (supabase/aiven audit): fixed stale `*_OLD.sql` naming (now
> `*_DEPRECATED.sql`, see `#superseded-migrations-_deprecated`); corrected
> the unused-sequence-numbers list (050 is in fact used); added
> `073_erp_integration_tables.sql` for the ERP connector module's
> previously-unmigrated tables (`erp_integrations`, `erp_webhook_events`,
> `erp_sync_operations`).

## Migration Strategy

Migrations live in `supabase/migrations/` as numbered SQL files. Each file
is applied once to the live Supabase database (europe-north1) via the
Supabase Dashboard SQL Editor or `supabase db push`.

### File Types

| Pattern                    | Purpose                                              |
| -------------------------- | ---------------------------------------------------- |
| `NNN_name.sql`             | Individual migration (applied in order)              |
| `NNN_name_DEPRECATED.sql`  | Superseded/dead migration — NOT applied              |
| `consolidated_035_053.sql` | Meta-migration for fresh installs (combines 035–053) |
| `run-pending-030-037.sql`  | Batch runner for migrations 030–037                  |
| `test_NNN_*.sql`           | Test harness for a specific migration                |
| `README_NNN_*.md`          | Documentation for a specific migration               |

### Fresh Install vs. Incremental

- **Fresh install:** Run migrations 002–034 individually, then
  `consolidated_035_053.sql`, then 054+.
- **Incremental:** Run only the new migration files not yet applied.

## Numbering Rules (HARD RULE — 056+)

**Migration numbers 056 and above MUST be strictly sequential with NO
collisions.** One number = one file. No exceptions.

### Historical Duplicate Numbers (Known Tech Debt)

Migrations 002–055 contain 13 duplicate number prefixes. These are a
historical artifact and MUST NOT be renumbered (they are already applied
on the live database). The duplicates are:

    013: agent_tracking / investor_outreach_contacts
    015: email_templates / file_index
    025: add_prospect_status / cleanup_placeholders
    026: security_fixes / trade_import_products
    032: add_person_phone / cap_table
    033: mcp_session_sync / oneclicklca_contacts
    034: captain_inquiries / social_posts
    035: anna_gueorguieva_greeniumdc / grok_consent (OLD)
    036: construction_leads / grok_audit_immutability (OLD)
    038: article12_audit_log / hil_todos
    042: csrd_compliance_data / mcp_session_sync / projects_dashboard
    043: mvp_api_keys_usage_schedules / report_templates
    053: notifications_activity / system_heartbeat

Within each duplicate group, files were applied alphabetically. The
`consolidated_035_053.sql` meta-migration handles correct ordering for
fresh installs.

### Unused Sequence Numbers

These numbers were never used: 001, 009, 010, 016–022. They are
available for future use but prefer continuing from 073+.
(Corrected 2026-07-02 — 050 was previously listed here but
`050_memory_consolidation.sql` exists and is applied; it was a
documentation error, not a real gap.)

## Transaction Safety (HARD RULE — 056+)

**Every migration 056+ MUST be wrapped in `BEGIN; ... COMMIT;`.**

21 of the original 002–055 migrations lack transaction wrappers. This is
documented tech debt — a partial run on those files has no rollback path.
Do NOT retroactively modify applied migrations.

Template for new migrations:

```sql
-- Migration NNN: Short description
-- Date: YYYY-MM-DD
-- Author: Name
-- Purpose: What this migration does and why.

BEGIN;

-- ... DDL / DML here ...

COMMIT;
```

## Row Level Security (HARD RULE)

Every `CREATE TABLE` MUST be followed by `ALTER TABLE ... ENABLE ROW LEVEL
SECURITY;` and at least one `CREATE POLICY`. A table with RLS enabled but
zero policies is locked to ALL users.

Migration `011_fix_security_issues.sql` retroactively added RLS to the 14
tables from 002, 005, and 006 that were originally created without it.

## SECURITY DEFINER (AVOID)

Prefer `SECURITY INVOKER` for views and functions. `SECURITY DEFINER`
bypasses RLS and should only be used for auth helper functions that
genuinely need elevated privileges (e.g., `handle_new_user` in 007).

Migration `039_fix_security_definer_views.sql` converted construction_leads
views to `SECURITY INVOKER`. Remaining DEFINER functions are tracked in
the schema health check (migration 056).

## Superseded Migrations (\_DEPRECATED)

Files renamed to `*_DEPRECATED.sql` (formerly `*_OLD.sql`, renamed
2026-06-27 per the Document Standard lifecycle-suffix convention) are dead
code — they were superseded by later migrations or reference banned
services. They are kept for git history reference and MUST NOT be applied:

| File                                          | Reason                                        |
| --------------------------------------------- | --------------------------------------------- |
| `035_grok_consent_DEPRECATED.sql`             | Superseded by 041_fix_partial_runs.sql        |
| `036_grok_audit_immutability_DEPRECATED.sql`  | Depends on superseded 035                     |
| `037_resend_delivery_tracking_DEPRECATED.sql` | Resend banned (Clawdbot incident, 2026-03-26) |
| `040_grok_consent_DEPRECATED.sql`             | Superseded by 041_fix_partial_runs.sql        |

## Drift Detection

Run `scripts/db-drift-check.py` to compare migration files against the
live database:

```bash
python3 scripts/db-drift-check.py --dry-run          # File analysis only
python3 scripts/db-drift-check.py --offline           # No live DB connection
python3 scripts/db-drift-check.py --all               # Full drift + advisor
```

The drift check flags: missing RLS, duplicate numbers, missing
BEGIN/COMMIT, and tables that exist in live DB but not in migrations
(or vice versa).

## Cleanup Scripts

One-off data cleanup scripts live in `supabase/cleanup/` and are NOT
part of the migration sequence. They are run manually and documented
with date prefixes.

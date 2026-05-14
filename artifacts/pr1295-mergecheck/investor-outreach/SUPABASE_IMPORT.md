# Push 80_construction_CEO to Supabase

The `80_construction_CEO.md` contact database is **not** in Supabase by default. Use the migration and import script to push it.

## 1. Apply the migration

Create the `investor_outreach_contacts` table:

```bash
# Option A: Supabase CLI (if linked to project)
npx supabase db push

# Option B: Run SQL manually in Supabase Dashboard
# Copy contents of supabase/migrations/013_investor_outreach_contacts.sql
# and run in SQL Editor
```

## 2. Run the import

```bash
# Ensure .env has SUPABASE_URL and SUPABASE_SERVICE_KEY
npx tsx scripts/import-80-construction-CEO.ts
```

Or with inline env:

```bash
SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_KEY=your-service-key npx tsx scripts/import-80-construction-CEO.ts
```

## 3. Verify

```sql
SELECT COUNT(*) FROM investor_outreach_contacts WHERE source_document = '80_construction_CEO';
-- Expected: ~88 contacts
```

## Schema

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| source_document | VARCHAR | '80_construction_CEO' |
| company | VARCHAR | e.g. NCC AB, Skanska |
| name | VARCHAR | Contact name |
| title | VARCHAR | Job title |
| role_type | VARCHAR | CEO, ESG, Compliance, etc. |
| division | VARCHAR | Division/unit |
| country | VARCHAR | Sweden, Austria, etc. |
| linkedin_url | TEXT | LinkedIn profile URL |
| contact_email | TEXT | Email if found |
| contact_other | TEXT | Website, Search hint |
| notes | TEXT | Full notes from document |
| priority_rank | INT | 1–16 for priority contacts |
| tags | TEXT[] | priority, multi_agent, esg, etc. |

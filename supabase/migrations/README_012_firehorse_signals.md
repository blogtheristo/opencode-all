# Migration 012: Firehorse Signals - Deployment Guide

**Created:** 2026-01-10
**Purpose:** Signal-based sales automation database schema
**Related Docs:** `/sales-outreach/signaalimyynti.md`, `/sales-outreach/WORKFLOW_ADDITIONS.md`

---

## What This Migration Does

This migration creates the database infrastructure for **signal-based sales automation**:

1. **Tables:**
   - `firehorse_signals` - Main signal tracking table

2. **Enums:**
   - `signal_source` - Source of the signal (linkedin, x, web, rss, manual)
   - `signal_type` - Type of signal (job_change, press_release, etc.)
   - `signal_status` - Workflow state (detected → analyzed → sent → responded)

3. **Views:**
   - `firehorse_signals_ultra` - ULTRA correlation signals (score 5)
   - `firehorse_signals_high` - HIGH correlation signals (score 4)
   - `firehorse_signals_pending_approval` - Signals awaiting human review
   - `firehorse_signals_metrics` - Weekly performance metrics
   - `firehorse_signals_daily_summary` - Daily signal collection summary

4. **Functions:**
   - `get_signals_by_company(company_name)` - Get all signals for a specific company
   - `get_top_companies_by_signals(limit)` - Get companies with most signals

5. **Indexes:**
   - Fast queries on correlation_score, status, signal_date, company_name

---

## Deployment Options

### Option 1: Supabase Dashboard (Manual)

1. Go to Supabase Dashboard: https://app.supabase.com/project/YOUR_PROJECT_ID/sql
2. Copy contents of `012_firehorse_signals.sql`
3. Paste into SQL Editor
4. Click "Run"

### Option 2: Supabase CLI (Recommended)

```bash
# If not installed, install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Run migration
supabase db push

# Or run specific migration
supabase migration up
```

### Option 3: Direct psql Connection

```bash
# Connect to Supabase database
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migration
\i supabase/migrations/012_firehorse_signals.sql

# Verify tables
\dt firehorse_signals
\dv firehorse_signals*
```

---

## Verification Queries

After deployment, run these queries to verify everything works:

### 1. Check Table Exists

```sql
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_name = 'firehorse_signals';
```

Expected: 1 row with `table_type = 'BASE TABLE'`

### 2. Check Views Exist

```sql
SELECT table_name
FROM information_schema.views
WHERE table_name LIKE 'firehorse_signals%'
ORDER BY table_name;
```

Expected: 4 views:
- firehorse_signals_daily_summary
- firehorse_signals_high
- firehorse_signals_metrics
- firehorse_signals_pending_approval
- firehorse_signals_ultra

### 3. Check Indexes

```sql
SELECT indexname
FROM pg_indexes
WHERE tablename = 'firehorse_signals';
```

Expected: 5+ indexes (including primary key)

### 4. Check Enums

```sql
SELECT typname
FROM pg_type
WHERE typname IN ('signal_source', 'signal_type', 'signal_status');
```

Expected: 3 rows

### 5. Test Insert (Optional)

```sql
INSERT INTO firehorse_signals (
  signal_source,
  signal_type,
  signal_date,
  company_name,
  signal_content,
  correlation_score,
  correlation_reason
) VALUES (
  'web',
  'press_release',
  NOW(),
  'Test Company AB',
  'Test signal content',
  5,
  'Test correlation'
);

-- Verify
SELECT * FROM firehorse_signals ORDER BY created_at DESC LIMIT 1;

-- Clean up
DELETE FROM firehorse_signals WHERE company_name = 'Test Company AB';
```

---

## Post-Deployment Checklist

- [ ] Table `firehorse_signals` created
- [ ] 5 views created (ultra, high, pending_approval, metrics, daily_summary)
- [ ] 2 functions created (get_signals_by_company, get_top_companies_by_signals)
- [ ] Indexes created (5 indexes)
- [ ] Trigger `trigger_update_firehorse_signals_updated_at` active
- [ ] Test insert/select works
- [ ] Views return data (may be empty initially)

---

## Sample Data (for Testing)

To test the migration with sample data, uncomment the `INSERT` statements at the end of `012_firehorse_signals.sql` before running.

Or run this manually:

```sql
INSERT INTO firehorse_signals (
  signal_source,
  signal_type,
  signal_date,
  company_name,
  contact_name,
  contact_title,
  signal_content,
  signal_url,
  correlation_score,
  correlation_reason,
  dws6_feature_match,
  keywords_matched,
  status
) VALUES
(
  'web',
  'press_release',
  NOW() - INTERVAL '2 days',
  'NCC AB',
  'Anders Johansson',
  'COO',
  'NCC Q4 report mentions CSRD compliance requirements.',
  'https://www.ncc.se/news/q4-2025-report',
  5,
  'Contains ULTRA keyword: CSRD',
  ARRAY['CSRD', 'Fit_for_55'],
  ARRAY['CSRD', 'Fit for 55'],
  'analyzed'
);

-- Verify sample data
SELECT * FROM firehorse_signals_ultra;
SELECT * FROM firehorse_signals_pending_approval;
```

---

## Rollback (If Needed)

```sql
-- Drop views
DROP VIEW IF EXISTS firehorse_signals_daily_summary;
DROP VIEW IF EXISTS firehorse_signals_metrics;
DROP VIEW IF EXISTS firehorse_signals_pending_approval;
DROP VIEW IF EXISTS firehorse_signals_high;
DROP VIEW IF EXISTS firehorse_signals_ultra;

-- Drop functions
DROP FUNCTION IF EXISTS get_signals_by_company(TEXT);
DROP FUNCTION IF EXISTS get_top_companies_by_signals(INTEGER);
DROP FUNCTION IF EXISTS update_firehorse_signals_updated_at();

-- Drop table
DROP TABLE IF EXISTS firehorse_signals;

-- Drop enums
DROP TYPE IF EXISTS signal_status;
DROP TYPE IF EXISTS signal_type;
DROP TYPE IF EXISTS signal_source;
```

---

## Next Steps After Deployment

1. **Test Python Script:** Run `scripts/collect_signals.py` (Priority 2)
2. **Test TypeScript Services:** Run message generator (Priority 4)
3. **Deploy Dashboard UI:** Launch `/signals` page (Priority 5)

---

## Troubleshooting

### Error: "type signal_source already exists"

The enum types might already exist. Drop them first:

```sql
DROP TYPE IF EXISTS signal_source CASCADE;
DROP TYPE IF EXISTS signal_type CASCADE;
DROP TYPE IF EXISTS signal_status CASCADE;
```

Then re-run the migration.

### Error: "relation firehorse_signals already exists"

Table already exists. Either:
- Use `DROP TABLE firehorse_signals CASCADE;` to remove it
- Or skip this migration

### Views Not Returning Data

This is normal if no signals have been collected yet. Run the sample data INSERT to verify views work.

---

**Migration Status:** ✅ Ready to Deploy
**Estimated Time:** 2-3 minutes
**Breaking Changes:** None (new tables only)

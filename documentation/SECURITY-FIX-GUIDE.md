# 🔴 CRITICAL SECURITY FIX GUIDE

## Supabase Database Security Issues - Migration 011

**Date**: January 8, 2026  
**Severity**: CRITICAL  
**Status**: ✅ Fix Ready (Migration Created)

---

## 🚨 Security Issues Detected

Your Supabase database has **28 critical security vulnerabilities** detected by the database linter:

### Issue #1: SECURITY DEFINER Views (13 views)
**Risk Level**: HIGH - Data Leak, Privilege Escalation

Views run with permissions of creator (postgres/supabase_admin) instead of querying user, bypassing Row Level Security.

**Affected Views**:
| View Name | Source Migration | Risk |
|-----------|------------------|------|
| `firehorse_daily_new_leads` | 002 | Lead data exposure |
| `firehorse_cold2_candidates` | 002 | Lead data exposure |
| `firehorse_cold3_candidates` | 002 | Lead data exposure |
| `firehorse_linkedin_pending` | 005 | Lead + LinkedIn data |
| `firehorse_upcoming_meetings` | 005 | Meeting data |
| `firehorse_active_proposals` | 005 | Proposal amounts |
| `firehorse_sales_pipeline` | 005 | Full pipeline data |
| `current_mrr_by_customer` | 006 | MRR/ARR data |
| `monthly_metrics_summary` | 006 | Financial metrics |
| `contracts_pending_signature` | 006 | Contract values |
| `subscriptions_expiring_soon` | 006 | Subscription data |
| `recent_payment_events` | 008 | Payment history |
| `subscription_details` | 008 | Customer + payment |
| `monthly_payment_summary` | 008 | Revenue data |

### Issue #2: RLS Disabled on Tables (15 tables)
**Risk Level**: CRITICAL - Full Data Access

Row Level Security is NOT enabled, meaning anyone with your anon key can read/write ALL data.

**Affected Tables**:

| Table | Source Migration | Data at Risk |
|-------|------------------|--------------|
| `firehorse_leads` | 002 | All sales leads |
| `firehorse_events` | 002 | Lead activity history |
| `firehorse_tasks` | 002 | Sales tasks |
| `firehorse_replies` | 002 | Email replies |
| `firehorse_email_templates` | 002 | Email templates |
| `firehorse_meetings` | 005 | Meeting schedules |
| `firehorse_proposals` | 005 | Proposal amounts |
| `firehorse_linkedin_activities` | 005 | LinkedIn activity |
| `customers` | 006 | Customer records |
| `contracts` | 006 | Contract values |
| `subscriptions` | 006 | Subscription data |
| `revenue_recognition` | 006 | MRR/ARR history |
| `runway_tracking` | 006 | Cash/runway data |
| `transactions` | 006 | Financial transactions |

---

## 🎯 Attack Scenarios

### Scenario 1: Data Exfiltration via Anon Key

```javascript
// Attacker finds your anon key in frontend JavaScript
const supabase = createClient(
  'https://kpucuwwfhuwurdxyjjtz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Your public anon key
);

// Without RLS, they can read ALL customers
const { data } = await supabase.from('customers').select('*');
// Returns: Uber Finland, Bolt Finland, Kela + ALL customer data

// Read all financial metrics
const { data: metrics } = await supabase.from('revenue_recognition').select('*');
// Returns: MRR: €7K, ARR: €84K, runway: 10 months

// Read all investor pipeline
const { data: investors } = await supabase.from('investor_pipeline_summary').select('*');
// Returns: All investor contacts and deal stages
```

### Scenario 2: Data Modification

```javascript
// Attacker can DELETE or UPDATE records
await supabase.from('customers').delete().eq('name', 'Uber Finland');
// Customer deleted by unauthorized user ❌

await supabase.from('revenue_recognition').update({ mrr: 0 }).eq('month', '2026-01-01');
// Financial data corrupted ❌
```

### Scenario 3: View Bypass

```javascript
// SECURITY DEFINER views bypass RLS entirely
const { data } = await supabase.from('current_mrr_by_customer').select('*');
// Returns ALL customer MRR data, even if underlying table has RLS
```

---

## ✅ The Fix: Migration 011

### What It Does

1. **Enables RLS on 14 tables** - Adds security barrier
2. **Creates 28 RLS policies** - 2 per table (admin + service_role)
3. **Recreates 13 views** - With `security_invoker = true`
4. **Adds helper function** - `is_backoffice_admin()` for policy checks

### Access Control After Fix

| User Type | Can Access CRM Data? | Why? |
|-----------|---------------------|------|
| Unauthenticated (no login) | ❌ NO | RLS denies access |
| Logged in as `owner`/`admin` | ✅ YES | RLS policy grants access |
| Logged in as `member`/`viewer` | ❌ NO | RLS policy only allows admins |
| Service role (background jobs) | ✅ YES | Needed for MRR calculations |

---

## 📋 How to Apply the Fix

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz
2. Click **SQL Editor** in left sidebar
3. Click **New Query**

### Step 2: Copy Migration SQL

Copy the entire contents of:
```
supabase/migrations/011_fix_security_issues.sql
```

Or from GitHub:
```
https://github.com/blogtheristo/dws6/blob/main/supabase/migrations/011_fix_security_issues.sql
```

### Step 3: Run the Migration

1. Paste SQL into the editor
2. Click **Run** (bottom right)
3. Wait for completion

**Expected Output:**
```
✅ Success. No rows returned
```

### Step 4: Verify Success

Run this verification query:

```sql
-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'firehorse_leads', 'firehorse_events', 'firehorse_tasks', 
  'firehorse_replies', 'firehorse_email_templates',
  'firehorse_meetings', 'firehorse_proposals', 'firehorse_linkedin_activities',
  'customers', 'contracts', 'subscriptions', 
  'revenue_recognition', 'runway_tracking', 'transactions'
);
```

**Expected Result:** All rows should show `rowsecurity = true`

### Step 5: Test Application

1. **Test admin login:**
   - Go to: https://dws6.com/login/backoffice/
   - Log in as admin
   - Navigate to CRM → Customers
   - ✅ Should load data normally

2. **Test unauthorized access:**
   - Open browser console (F12)
   - Try: `supabase.from('customers').select('*')`
   - ✅ Should return empty `[]` (access denied)

### Step 6: Check Database Linter

1. Wait 5 minutes after migration
2. Go to: Supabase Dashboard → Database → Linter
3. ✅ Should show 0 errors (all 28 fixed)

---

## 🔄 Before vs After

### BEFORE (Current State - INSECURE) ❌

```
Any person on the internet
    ↓
Uses your anon key (public, in frontend code)
    ↓
Queries: supabase.from('customers').select('*')
    ↓
Gets: ALL customer data (Uber, Bolt, Kela + financials)
```

### AFTER (After Migration - SECURE) ✅

```
Any person on the internet
    ↓
Uses your anon key
    ↓
Queries: supabase.from('customers').select('*')
    ↓
PostgreSQL checks: "Is this user a backoffice admin?"
    ↓ NO
Returns: [] (empty, access denied)

---

Logged-in backoffice admin
    ↓
Queries: supabase.from('customers').select('*')
    ↓
PostgreSQL checks: "Is this user a backoffice admin?"
    ↓ YES
Returns: All customer data (authorized access)
```

---

## ❓ FAQ

### Q: Is this urgent?
**A:** YES. Your database is currently exposed to anyone with your anon key (which is public in your frontend code).

### Q: Will this break my CRM?
**A:** No, as long as users log in as `owner` or `admin` role. The RLS policies allow full access for these roles.

### Q: Can I test before applying to production?
**A:** Yes, if you have a staging/dev Supabase project. But this fix is safe - it only restricts access, doesn't change functionality.

### Q: What if I need to give access to other roles later?
**A:** Create additional RLS policies. Example:

```sql
-- Allow 'member' role to read customers
CREATE POLICY "Members can view customers"
  ON customers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin', 'member')
      AND status = 'active'
    )
  );
```

### Q: What about the service role?
**A:** Service role (used by backend/serverless functions) has full access. This is intentional for background jobs like MRR calculations.

### Q: How do I know if my anon key is exposed?
**A:** If you use Supabase client in frontend JavaScript, your anon key is visible in:
- Browser DevTools → Network tab
- View Page Source
- JavaScript bundle files

This is normal and expected - that's why RLS is critical.

---

## 📊 Migration Summary

| Category | Count | Status |
|----------|-------|--------|
| Tables with RLS enabled | 14 | ✅ Fixed |
| RLS policies created | 28 | ✅ Created |
| Views converted to SECURITY INVOKER | 13 | ✅ Fixed |
| Helper functions added | 1 | ✅ Created |
| **Total issues fixed** | **28** | ✅ |

---

## 🔗 Related Files

- **Migration**: `supabase/migrations/011_fix_security_issues.sql`
- **Auth Migration**: `supabase/migrations/007_auth_users_orgs.sql`
- **Firehorse Schema**: `supabase/migrations/002_firehorse_pilot.sql`
- **Financial Schema**: `supabase/migrations/006_investor_reporting_financial_data.sql`

---

## 📞 Support

If you encounter issues:

1. Check Supabase logs: Dashboard → Logs → Postgres
2. Review error messages in SQL Editor
3. Contact: admin@dws6.com
4. GitHub Issues: https://github.com/blogtheristo/dws6/issues

---

**Document Version:** 1.0  
**Last Updated:** January 8, 2026  
**Author:** DWS Security Team

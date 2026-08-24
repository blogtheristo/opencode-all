# 🚀 Supabase Deployment Guide - People Database

**Step-by-step guide to deploy the People Database to Supabase**

---

## 📋 Prerequisites

1. **Supabase Account**
   - Sign up at https://supabase.com
   - Create a new project

2. **Database Access**
   - Project URL
   - API Keys (anon, service_role)
   - Database password

3. **Files Required**
   - `People/supabase-people-schema.sql`

---

## 🚀 Deployment Steps

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

### Step 2: Deploy Schema

1. Open `People/supabase-people-schema.sql`
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Click **Run** (or press `Ctrl+Enter`)

**Expected Output**:
```
✅ CREATE EXTENSION
✅ CREATE TABLE people
✅ CREATE TABLE interactions
✅ CREATE TABLE notes
✅ CREATE TABLE companies
✅ CREATE INDEX (multiple)
✅ CREATE TRIGGER (multiple)
✅ CREATE VIEW (multiple)
✅ CREATE FUNCTION (multiple)
✅ ALTER TABLE (RLS policies)
✅ INSERT (sample data)
```

### Step 3: Verify Deployment

#### Check Tables

```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Expected: people, interactions, notes, companies
```

#### Check Data

```sql
-- Check sample data
SELECT full_name, title, company, type 
FROM people;

-- Expected: Risto, Founder & CEO, Lifetime Group, internal
```

#### Check Views

```sql
-- Test views
SELECT * FROM active_contacts;
SELECT * FROM customer_contacts;
SELECT * FROM investor_contacts;
SELECT * FROM follow_up_required;
```

#### Check Functions

```sql
-- Test search
SELECT * FROM search_people('Risto');

-- Test summary
SELECT * FROM get_contact_summary();

-- Test follow-ups
SELECT * FROM get_upcoming_follow_ups(7);
```

### Step 4: Configure Row-Level Security (RLS)

#### Enable RLS (already done in schema)

```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Expected: all tables should have rowsecurity = true
```

#### Test RLS Policies

```sql
-- As authenticated user (should work)
SELECT * FROM people;

-- As anonymous user (should be restricted)
-- Test in Supabase Auth settings
```

### Step 5: Set Up API Access

#### Get API Credentials

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon public key**: For client-side access
   - **service_role key**: For server-side access (keep secret!)

#### Test API Access

```bash
# Test with curl
curl 'https://your-project.supabase.co/rest/v1/people' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Expected: JSON array of people
```

### Step 6: Configure Authentication

#### Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Enable **Email**
3. Configure email templates (optional)

#### Create First User

```sql
-- Option 1: Via Supabase Dashboard
-- Go to Authentication → Users → Add User

-- Option 2: Via SQL
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  'risto@lifetime.group',
  crypt('your-password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres:your-password@db.your-project.supabase.co:5432/postgres
```

### Client Configuration

#### JavaScript/TypeScript

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### Python

```python
from supabase import create_client, Client

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_ANON_KEY")

supabase: Client = create_client(supabase_url, supabase_key)
```

---

## 📊 Usage Examples

### Insert New Person

```typescript
const { data, error } = await supabase
  .from('people')
  .insert({
    type: 'customer',
    status: 'active',
    full_name: 'John Doe',
    email: 'john@example.com',
    company: 'Example Corp',
    title: 'CEO',
    country: 'Finland',
    region: 'Nordic',
    tags: ['customer', 'vip'],
    products: ['firehorse', 'dws-iq'],
    engagement_level: 'high'
  })
```

### Search People

```typescript
const { data, error } = await supabase
  .rpc('search_people', { search_query: 'construction' })
```

### Get Active Contacts

```typescript
const { data, error } = await supabase
  .from('active_contacts')
  .select('*')
  .order('last_contact_date', { ascending: false })
```

### Log Interaction

```typescript
const { data, error } = await supabase
  .from('interactions')
  .insert({
    person_id: 'uuid-here',
    type: 'meeting',
    subject: 'Product Demo',
    description: 'Demonstrated Firehorse Mobile',
    outcome: 'Positive, follow-up scheduled',
    follow_up_required: true,
    follow_up_date: '2026-01-15'
  })
```

### Add Note

```typescript
const { data, error } = await supabase
  .from('notes')
  .insert({
    person_id: 'uuid-here',
    title: 'Investment Interest',
    content: 'Expressed interest in Series A round',
    category: 'business',
    is_private: false
  })
```

---

## 🔐 Security Best Practices

### 1. API Keys

- ✅ **DO**: Use anon key for client-side
- ✅ **DO**: Use service_role key for server-side only
- ❌ **DON'T**: Expose service_role key in client code
- ❌ **DON'T**: Commit keys to Git

### 2. Row-Level Security

- ✅ **DO**: Test RLS policies thoroughly
- ✅ **DO**: Use auth.uid() for user-specific data
- ❌ **DON'T**: Disable RLS in production
- ❌ **DON'T**: Use overly permissive policies

### 3. Data Privacy

- ✅ **DO**: Encrypt sensitive data
- ✅ **DO**: Use soft delete (deleted_at)
- ✅ **DO**: Implement audit logging
- ❌ **DON'T**: Store passwords in plain text
- ❌ **DON'T**: Share personal data without consent

### 4. GDPR Compliance

- ✅ **DO**: Obtain consent for data collection
- ✅ **DO**: Provide data export functionality
- ✅ **DO**: Honor deletion requests
- ✅ **DO**: Document data retention policies

---

## 🧪 Testing

### Test Checklist

- [ ] Tables created successfully
- [ ] Indexes created
- [ ] Triggers working
- [ ] Views returning data
- [ ] Functions executing
- [ ] RLS policies enforced
- [ ] Sample data inserted
- [ ] API access working
- [ ] Authentication configured
- [ ] Search functionality working

### Test Queries

```sql
-- 1. Count records
SELECT 
  'people' as table_name, COUNT(*) as count FROM people
UNION ALL
SELECT 
  'interactions', COUNT(*) FROM interactions
UNION ALL
SELECT 
  'notes', COUNT(*) FROM notes
UNION ALL
SELECT 
  'companies', COUNT(*) FROM companies;

-- 2. Test full-text search
SELECT * FROM search_people('Risto');
SELECT * FROM search_people('construction');
SELECT * FROM search_people('carbon');

-- 3. Test views
SELECT COUNT(*) FROM active_contacts;
SELECT COUNT(*) FROM customer_contacts;
SELECT COUNT(*) FROM investor_contacts;

-- 4. Test functions
SELECT * FROM get_contact_summary();
SELECT * FROM get_upcoming_follow_ups(30);

-- 5. Test RLS
-- Should work (as authenticated user)
SELECT * FROM people WHERE type = 'internal';

-- Should be restricted (as anonymous)
-- Test via API without auth token
```

---

## 🐛 Troubleshooting

### Issue: Tables not created

**Solution**:
```sql
-- Check for errors
SELECT * FROM pg_stat_activity 
WHERE state = 'active';

-- Re-run schema
\i People/supabase-people-schema.sql
```

### Issue: RLS blocking all access

**Solution**:
```sql
-- Temporarily disable RLS for testing
ALTER TABLE people DISABLE ROW LEVEL SECURITY;

-- Re-enable after fixing policies
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
```

### Issue: Functions not working

**Solution**:
```sql
-- Check function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname LIKE 'search_people%';

-- Re-create function
DROP FUNCTION IF EXISTS search_people(TEXT);
-- Then re-run function definition
```

### Issue: API returns 401 Unauthorized

**Solution**:
- Check API key is correct
- Verify RLS policies allow access
- Ensure user is authenticated
- Check JWT token is valid

---

## 📈 Monitoring

### Performance Metrics

```sql
-- Query performance
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
WHERE query LIKE '%people%'
ORDER BY total_time DESC
LIMIT 10;

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

### Supabase Dashboard

1. Go to **Database** → **Query Performance**
2. Monitor slow queries
3. Check index usage
4. Review connection pool

---

## 🔄 Backup & Recovery

### Automated Backups

Supabase provides automated backups:
- **Free tier**: Daily backups (7 days retention)
- **Pro tier**: Daily backups (30 days retention)
- **Enterprise**: Custom retention

### Manual Backup

```bash
# Export schema
pg_dump -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  --schema-only \
  > people_schema_backup.sql

# Export data
pg_dump -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  --data-only \
  --table=people \
  --table=interactions \
  --table=notes \
  --table=companies \
  > people_data_backup.sql
```

### Restore

```bash
# Restore schema
psql -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  < people_schema_backup.sql

# Restore data
psql -h db.your-project.supabase.co \
  -U postgres \
  -d postgres \
  < people_data_backup.sql
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Supabase project created
- [ ] Database credentials obtained
- [ ] Schema file reviewed
- [ ] Backup plan in place

### Deployment
- [ ] Schema deployed successfully
- [ ] Tables created
- [ ] Indexes created
- [ ] Triggers created
- [ ] Views created
- [ ] Functions created
- [ ] RLS policies applied
- [ ] Sample data inserted

### Post-Deployment
- [ ] All tests passed
- [ ] API access verified
- [ ] Authentication configured
- [ ] Environment variables set
- [ ] Documentation updated
- [ ] Team notified

### Production
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Security audit completed
- [ ] GDPR compliance verified
- [ ] Performance optimized

---

## 📞 Support

**Issues?** Contact:
- Email: risto@lifetime.group
- Supabase Docs: https://supabase.com/docs
- GitHub Issues: https://github.com/blogtheristo/dws6/issues

---

**Last Updated**: December 31, 2025  
**Version**: 1.0.0  
**Status**: Production Ready

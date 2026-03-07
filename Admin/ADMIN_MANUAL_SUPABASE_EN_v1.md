# Admin Manual: Supabase Database Management for DWS6

---
# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:
  - Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/silly-zhukovsky | Date: 07.03.2026 | Changes: Expanded Section 9 with automated backup pipeline (§9.2), Aiven sandbox mirror (§9.3), disaster recovery procedures (§9.4), verification checklist (§9.5)
  - Version: 1.2 | Tool: Claude Code | Session: 2026-03-04 | Date: 04.03.2026 | Changes: Add migration audit documentation (§7.3) - comprehensive audit of 29 migration scripts, fixes for 10 missing tables, EU compliance verification
  - Version: 1.1 | Tool: Claude Code | Session: 2026-02-09 | Date: 09.02.2026 | Changes: Add drift detection (§12), alert router (§13), glossary (§14), Plan→Apply→Verify pipeline
  - Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial creation - Supabase admin manual for DWS6 project

Session Links & References:
  - Cursor AI (2025-12-30): https://github.com/blogtheristo/dws6/pull/77
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 04.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ✅ ACTIVE

---

**Version:** 1.3
**Purpose:** Supabase database administration guide for DWS6 project
**Audience:** Database Administrators, DevOps Engineers
**Updated:** 07.03.2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Project Setup](#2-project-setup)
3. [Database Schema](#3-database-schema)
4. [Security Configuration](#4-security-configuration)
5. [API Management](#5-api-management)
6. [Authentication](#6-authentication)
7. [Database Operations](#7-database-operations)
   - [7.1 Common Queries](#71-common-queries)
   - [7.2 Data Maintenance](#72-data-maintenance)
   - [7.3 Migration Management and Audit](#73-migration-management-and-audit)
8. [Monitoring and Logs](#8-monitoring-and-logs)
9. [Backup and Recovery](#9-backup-and-recovery)
10. [Performance Tuning](#10-performance-tuning)
11. [Troubleshooting](#11-troubleshooting)
12. [Database Drift Detection](#12-database-drift-detection)
13. [Alert Router & Redis Pub/Sub](#13-alert-router--redis-pubsub)
14. [Glossary](#14-glossary)

---

## 1. Overview

### 1.1 Supabase Introduction

**Supabase** is an open-source Firebase alternative that provides:
- PostgreSQL database with real-time capabilities
- Auto-generated REST API
- Row Level Security (RLS)
- Authentication and authorization
- Storage for files
- Real-time subscriptions

### 1.2 DWS6 Supabase Project

**Project Details**:
- **Project ID**: `kpucuwwfhuwurdxyjjtz`
- **Project Name**: DWS6 Multi-Login Platform
- **Region**: US East (N. Virginia)
- **URL**: `https://kpucuwwfhuwurdxyjjtz.supabase.co`
- **Plan**: Free Tier
- **Database**: PostgreSQL 15

**Free Tier Limits**:
- 50,000 Monthly Active Users (MAU)
- 500 MB Database Space
- 1 GB File Storage
- 2 GB Bandwidth
- Unlimited API Requests
- 7-day Log Retention

### 1.3 Architecture

```
┌─────────────────────────────────────────┐
│         Client Applications              │
│  (V8 Dashboard, Mobile Apps, etc.)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Supabase Client Library          │
│  (@supabase/supabase-js)                │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Supabase API Layer               │
│  (REST API, GraphQL, Realtime)          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         PostgreSQL Database              │
│  (Data Storage, RLS, Functions)         │
└─────────────────────────────────────────┘
```

---

## 2. Project Setup

### 2.1 Access Supabase Dashboard

**URL**: https://app.supabase.com/project/kpucuwwfhuwurdxyjjtz

**Login Credentials**:
- Email: [Your Supabase account email]
- Password: [Your Supabase password]
- 2FA: Recommended

### 2.2 Project Settings

#### API Settings

**Location**: Project Settings → API

**Credentials**:
```
Project URL: https://kpucuwwfhuwurdxyjjtz.supabase.co
API URL: https://kpucuwwfhuwurdxyjjtz.supabase.co/rest/v1/
GraphQL URL: https://kpucuwwfhuwurdxyjjtz.supabase.co/graphql/v1

anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: [KEEP SECRET - Full database access]
```

**⚠️ Security Warning**:
- `anon key`: Safe to use in client code (limited by RLS)
- `service_role key`: NEVER expose in client code (full access)

#### Database Settings

**Location**: Project Settings → Database

**Connection Details**:
```
Host: db.kpucuwwfhuwurdxyjjtz.supabase.co
Database name: postgres
Port: 5432
User: postgres
Password: [Your database password]
```

**Connection String**:
```
postgresql://postgres:[YOUR-PASSWORD]@db.kpucuwwfhuwurdxyjjtz.supabase.co:5432/postgres
```

### 2.3 Initial Configuration

#### Enable Required Extensions

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS (if needed for location data)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Enable pg_stat_statements (for query analysis)
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
```

#### Set Timezone

```sql
-- Set default timezone to UTC
ALTER DATABASE postgres SET timezone TO 'UTC';
```

---

## 3. Database Schema

### 3.1 Projects Table

#### Create Table

```sql
-- Projects table for construction project management
CREATE TABLE projects (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Project information
  name TEXT NOT NULL,
  description TEXT,
  region TEXT,
  phase TEXT,
  
  -- Performance metrics
  spi NUMERIC(4,2) CHECK (spi >= 0),  -- Schedule Performance Index
  cpi NUMERIC(4,2) CHECK (cpi >= 0),  -- Cost Performance Index
  percent_complete INTEGER CHECK (percent_complete >= 0 AND percent_complete <= 100),
  
  -- Safety status
  safety_rag TEXT CHECK (safety_rag IN ('green', 'amber', 'red')),
  
  -- Budget information
  budget_total NUMERIC(15,2),
  budget_spent NUMERIC(15,2),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Soft delete
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Add comments for documentation
COMMENT ON TABLE projects IS 'Construction projects managed in DWS IQ platform';
COMMENT ON COLUMN projects.spi IS 'Schedule Performance Index: >1.0 ahead, <1.0 behind';
COMMENT ON COLUMN projects.cpi IS 'Cost Performance Index: >1.0 under budget, <1.0 over budget';
COMMENT ON COLUMN projects.safety_rag IS 'Safety status: green=good, amber=warning, red=critical';
```

#### Create Indexes

```sql
-- Performance indexes
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_updated_at ON projects(updated_at DESC);
CREATE INDEX idx_projects_region ON projects(region);
CREATE INDEX idx_projects_phase ON projects(phase);
CREATE INDEX idx_projects_safety_rag ON projects(safety_rag);

-- Partial index for active projects only
CREATE INDEX idx_projects_active ON projects(id) WHERE deleted_at IS NULL;
```

#### Create Triggers

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3.2 Alerts Table

#### Create Table

```sql
-- Alerts table for project alerts and notifications
CREATE TABLE alerts (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Alert information
  project_name TEXT NOT NULL,
  message TEXT NOT NULL,
  description TEXT,
  
  -- Alert classification
  type TEXT NOT NULL CHECK (type IN ('schedule', 'cost', 'safety', 'quality', 'info')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  
  -- Alert timing
  age_hours INTEGER DEFAULT 0,
  
  -- Resolution tracking
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by TEXT,
  resolution_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments
COMMENT ON TABLE alerts IS 'Project alerts and notifications';
COMMENT ON COLUMN alerts.type IS 'Alert category: schedule, cost, safety, quality, info';
COMMENT ON COLUMN alerts.severity IS 'Alert priority: low, medium, high, critical';
```

#### Create Indexes

```sql
-- Performance indexes
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_project_name ON alerts(project_name);

-- Partial index for unresolved alerts
CREATE INDEX idx_alerts_unresolved ON alerts(id) WHERE resolved_at IS NULL;
```

#### Create Triggers

```sql
-- Auto-update updated_at timestamp
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate age_hours
CREATE OR REPLACE FUNCTION calculate_alert_age()
RETURNS TRIGGER AS $$
BEGIN
    NEW.age_hours = EXTRACT(EPOCH FROM (NOW() - NEW.created_at)) / 3600;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_alert_age BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION calculate_alert_age();
```

### 3.3 Users Table (Future)

```sql
-- Users table for authentication (future implementation)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'dws_iq_mobile',
    'store_viewer',
    'dws_iq_standard',
    'community_user',
    'lifetime_model',
    'enterprise_client',
    'enterprise_model',
    'backoffice_admin',
    'api_developer',
    'mcp_admin',
    'watsonx_user'
  )),
  permissions TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

---

## 4. Security Configuration

### 4.1 Row Level Security (RLS)

#### Enable RLS

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
```

#### Public Read Access (Current)

```sql
-- Allow public read access to projects
CREATE POLICY "Allow public read access to projects"
ON projects FOR SELECT
USING (true);

-- Allow public read access to alerts
CREATE POLICY "Allow public read access to alerts"
ON alerts FOR SELECT
USING (true);
```

#### Authenticated Write Access (Future)

```sql
-- Allow authenticated users to insert projects
CREATE POLICY "Allow authenticated users to insert projects"
ON projects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own projects
CREATE POLICY "Allow users to update their projects"
ON projects FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Allow only admins to delete projects
CREATE POLICY "Allow admins to delete projects"
ON projects FOR DELETE
USING (
  auth.jwt() ->> 'role' = 'backoffice_admin'
);
```

### 4.2 API Security

#### Rate Limiting

**Supabase Default Limits**:
- 100 requests per second per IP
- Configurable in Project Settings → API

**Custom Rate Limiting** (PostgreSQL function):

```sql
CREATE OR REPLACE FUNCTION check_rate_limit(
  user_id UUID,
  max_requests INTEGER DEFAULT 100,
  time_window INTERVAL DEFAULT '1 minute'::INTERVAL
)
RETURNS BOOLEAN AS $$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO request_count
  FROM api_requests
  WHERE user_id = check_rate_limit.user_id
    AND created_at > NOW() - time_window;
  
  RETURN request_count < max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### API Key Rotation

**Rotate anon key**:
1. Go to Project Settings → API
2. Click "Generate new anon key"
3. Update all client applications
4. Revoke old key after migration

**⚠️ Never rotate service_role key** unless compromised

### 4.3 Database Security

#### User Permissions

```sql
-- Create read-only user for reporting
CREATE ROLE dws_readonly;
GRANT CONNECT ON DATABASE postgres TO dws_readonly;
GRANT USAGE ON SCHEMA public TO dws_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO dws_readonly;

-- Create application user with limited permissions
CREATE ROLE dws_app;
GRANT CONNECT ON DATABASE postgres TO dws_app;
GRANT USAGE ON SCHEMA public TO dws_app;
GRANT SELECT, INSERT, UPDATE ON projects, alerts TO dws_app;
```

#### SSL/TLS Configuration

Supabase enforces SSL/TLS by default:
- TLS 1.2+ required
- Certificate verification enabled
- Connection string includes `sslmode=require`

---

## 5. API Management

### 5.1 REST API

#### Auto-Generated Endpoints

**Projects**:
```
GET    /rest/v1/projects              # List all projects
GET    /rest/v1/projects?id=eq.{id}   # Get specific project
POST   /rest/v1/projects              # Create project
PATCH  /rest/v1/projects?id=eq.{id}   # Update project
DELETE /rest/v1/projects?id=eq.{id}   # Delete project
```

**Alerts**:
```
GET    /rest/v1/alerts                # List all alerts
GET    /rest/v1/alerts?id=eq.{id}     # Get specific alert
POST   /rest/v1/alerts                # Create alert
PATCH  /rest/v1/alerts?id=eq.{id}     # Update alert
DELETE /rest/v1/alerts?id=eq.{id}     # Delete alert
```

#### Query Parameters

**Filtering**:
```
GET /rest/v1/projects?region=eq.Nordics
GET /rest/v1/alerts?severity=eq.critical
GET /rest/v1/projects?spi=lt.0.9
```

**Ordering**:
```
GET /rest/v1/projects?order=created_at.desc
GET /rest/v1/alerts?order=severity.desc,created_at.desc
```

**Limiting**:
```
GET /rest/v1/projects?limit=10
GET /rest/v1/projects?limit=10&offset=20
```

**Selecting Columns**:
```
GET /rest/v1/projects?select=id,name,spi,cpi
GET /rest/v1/alerts?select=project_name,message,severity
```

### 5.2 GraphQL API (Optional)

**Endpoint**: `https://kpucuwwfhuwurdxyjjtz.supabase.co/graphql/v1`

**Example Query**:
```graphql
query GetProjects {
  projectsCollection {
    edges {
      node {
        id
        name
        region
        spi
        cpi
        percentComplete
      }
    }
  }
}
```

### 5.3 Real-time Subscriptions

#### Enable Real-time

```sql
-- Enable real-time for projects table
ALTER PUBLICATION supabase_realtime ADD TABLE projects;

-- Enable real-time for alerts table
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
```

#### Client Subscription Example

```javascript
// Subscribe to project changes
const subscription = supabase
  .channel('projects-changes')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'projects' },
    (payload) => {
      console.log('Project changed:', payload);
    }
  )
  .subscribe();
```

---

## 6. Authentication

### 6.1 Supabase Auth Setup

#### Enable Auth Providers

**Location**: Authentication → Providers

**Available Providers**:
- ✅ Email/Password
- ✅ Magic Link
- ✅ Google OAuth
- ✅ GitHub OAuth
- ✅ Microsoft OAuth

#### Configure Email Templates

**Location**: Authentication → Email Templates

**Templates to Configure**:
- Confirmation email
- Password reset
- Magic link
- Email change confirmation

### 6.2 User Management

#### Create User (Admin)

```sql
-- Via Supabase Auth API
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data
) VALUES (
  'user@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  '{"role": "dws_iq_mobile"}'::jsonb
);
```

#### Update User Role

```sql
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{role}',
  '"backoffice_admin"'
)
WHERE email = 'admin@dws-iq.com';
```

#### Delete User

```sql
-- Soft delete (recommended)
UPDATE auth.users
SET deleted_at = NOW()
WHERE email = 'user@example.com';

-- Hard delete (permanent)
DELETE FROM auth.users
WHERE email = 'user@example.com';
```

---

## 7. Database Operations

### 7.0 Migration Tools

**db_push** – Push migrations to Supabase:
```powershell
pwsh -File scripts/db_push.ps1
# Or: npm run db:push
```

**Supabase MCP** – AI tools at `mcp-servers/supabase/` (port 8766). See Admin Manual Tools section.

### 7.1 Common Queries

#### Get Project Statistics

```sql
SELECT 
  COUNT(*) as total_projects,
  AVG(spi) as avg_spi,
  AVG(cpi) as avg_cpi,
  AVG(percent_complete) as avg_completion,
  COUNT(CASE WHEN safety_rag = 'red' THEN 1 END) as red_projects,
  COUNT(CASE WHEN safety_rag = 'amber' THEN 1 END) as amber_projects,
  COUNT(CASE WHEN safety_rag = 'green' THEN 1 END) as green_projects
FROM projects
WHERE deleted_at IS NULL;
```

#### Get Critical Alerts

```sql
SELECT 
  project_name,
  message,
  severity,
  type,
  age_hours,
  created_at
FROM alerts
WHERE resolved_at IS NULL
  AND severity IN ('high', 'critical')
ORDER BY severity DESC, created_at DESC
LIMIT 10;
```

#### Get Projects At Risk

```sql
SELECT 
  id,
  name,
  region,
  spi,
  cpi,
  percent_complete,
  safety_rag
FROM projects
WHERE deleted_at IS NULL
  AND (spi < 0.9 OR cpi < 0.9 OR safety_rag = 'red')
ORDER BY 
  CASE safety_rag
    WHEN 'red' THEN 1
    WHEN 'amber' THEN 2
    ELSE 3
  END,
  spi ASC;
```

### 7.2 Data Maintenance

#### Clean Old Resolved Alerts

```sql
-- Delete alerts resolved more than 30 days ago
DELETE FROM alerts
WHERE resolved_at < NOW() - INTERVAL '30 days';
```

#### Archive Old Projects

```sql
-- Soft delete projects completed more than 1 year ago
UPDATE projects
SET deleted_at = NOW()
WHERE percent_complete = 100
  AND updated_at < NOW() - INTERVAL '1 year'
  AND deleted_at IS NULL;
```

#### Update Project Statistics

```sql
-- Recalculate project metrics
UPDATE projects
SET 
  budget_spent = (
    SELECT SUM(amount) 
    FROM project_expenses 
    WHERE project_id = projects.id
  ),
  updated_at = NOW()
WHERE deleted_at IS NULL;
```

### 7.3 Migration Management and Audit

#### Migration Audit Summary (March 4, 2026)

**Audit Date**: March 4, 2026  
**Audit Tool**: Claude Code + Supabase MCP  
**Total Migrations Reviewed**: 29 SQL files  
**Status**: ✅ **COMPLETE** - All partial/never-run migrations fixed  

**Migration Files Audited**:
- **002-008**: Firehorse core, investors, auth, payments
- **011**: Security fixes
- **012**: Firehorse signals
- **013**: Agent tracking (NEVER RAN → FIXED)
- **014**: Climate assistant usage (NEVER RAN → FIXED)
- **015**: Email templates (RAN OK)
- **023-025**: Outreach, threads, prospect status (RAN OK)
- **025_cleanup**: Placeholders cleanup (RAN OK)
- **026**: Security fixes + trade import products (RAN OK)
- **027**: Email queue (NEVER RAN → FIXED)
- **028-029**: BIM pipeline + seed (DO NOT TOUCH - edited in another session)
- **030-037**: Auto-deployed via `run-pending-030-037.sql` (RAN OK)
- **038**: Article12 audit log (NEVER RAN → FIXED)
- **038_hil_todos**: HIL todos (RAN OK - duplicate prefix resolved)
- **039**: Security definer views fix (RAN OK)
- **040**: Grok consent (NEVER RAN → FIXED)

**Critical Issues Identified & Fixed**:
1. **Invalid MySQL Syntax**: Early migrations (002/005/006/013) used MySQL-style `INDEX` syntax instead of PostgreSQL
2. **Missing IF NOT EXISTS Guards**: Several migrations lacked idempotency protection
3. **Duplicate Migration Prefixes**: 038 prefix used twice (resolved correctly)
4. **Missing Tables**: 10 tables were never created due to partial/failed runs
5. **Missing Constraints**: `emission_factors` lacked UNIQUE constraint needed by 029 seed
6. **Incomplete RLS**: `firehorse_signals` missing authenticated-read policy

**Tables Created/Fixed**:
- ✅ `agent_metrics` (013) - Daily performance metrics for AI agents
- ✅ `agent_signals` (013) - Lifetime Scope Signals for agent coordination
- ✅ `agent_costs` (013) - Detailed cost tracking for AI operations
- ✅ `agent_approvals` (013) - Approval workflow for Advisor mode (HIL oversight)
- ✅ `climate_assistant_usage` (014) - Persistent usage tracking with budget enforcement
- ✅ `email_queue` (027) - Audit trail for emails via Redis Streams
- ✅ `article12_audit_log` (038) - EU AI Act Article 12 compliance (append-only)
- ✅ `grok_consent` (040) - GDPR consent state management
- ✅ `grok_consent_audit` (040) - Immutable audit trail for consent changes
- ✅ `grok_inference_log` (040) - Immutable log of all Grok API calls

**Consolidated Fix Migration**: `041_fix_partial_runs.sql`
- **Location**: `supabase/migrations/041_fix_partial_runs.sql`
- **Size**: 26,491 bytes
- **Sections**: 8 consolidated sections applied via MCP
- **Status**: Committed to git and pushed to `origin/main`

**Verification Results**:
- **Total Tables**: 93 (increased from 83)
- **RLS Policies**: All tables have Row Level Security enabled
- **Security Invoker**: All views use `security_invoker = true`
- **Constraints**: All required UNIQUE and CHECK constraints in place
- **Indexes**: All performance indexes created
- **Functions**: All database functions operational

**EU Compliance Status**:
- ✅ **Article 12 Audit Log**: Append-only audit trail for AI Act compliance
- ✅ **GDPR Consent Management**: Immutable audit trails for user consent
- ✅ **Data Residency**: Hosted in EU (Finland) for regulatory compliance
- ✅ **PII Scrubbing**: Verified scrubbing location (Veriton Helsinki)

**Maintenance Recommendations**:
1. **Run Migration Audit**: Quarterly review of migration files vs live schema
2. **Monitor Drift**: Use `scripts/db-drift-check.py` for schema consistency
3. **Backup Before Changes**: Always backup before applying migrations
4. **Test in Development**: Apply migrations to dev branch first
5. **Document Changes**: Update this manual when adding new migrations

**Emergency Contacts**:
- **Database Issues**: Check Supabase dashboard logs first
- **Migration Failures**: Review `041_fix_partial_runs.sql` for reference
- **Security Incidents**: Follow DWS Security Standard procedures

---

## 8. Monitoring and Logs

### 8.1 Query Performance

#### View Slow Queries

```sql
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### Analyze Query Plan

```sql
EXPLAIN ANALYZE
SELECT * FROM projects
WHERE region = 'Nordics'
ORDER BY created_at DESC
LIMIT 10;
```

### 8.2 Database Statistics

#### Table Sizes

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Index Usage

```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### 8.3 Supabase Dashboard Logs

**Location**: Project Dashboard → Logs

**Available Logs**:
- API Logs: REST API requests
- Database Logs: SQL queries
- Auth Logs: Authentication events
- Realtime Logs: WebSocket connections

**Log Retention**: 7 days (Free Tier)

---

## 9. Backup and Recovery

### 9.1 Supabase Automatic Backups

**Supabase Free Tier** (current plan):
- Daily automatic backups by Supabase
- Retained for 7 days
- **No point-in-time recovery (PITR)**
- **No external copy** — if Supabase deletes backups, they're gone

**WARNING:** Free tier backups are NOT sufficient for production. They cannot survive a Supabase account lockout, accidental project deletion, or provider outage. The automated pipeline below provides independent, encrypted backups.

**Access Supabase Backups**:
1. Go to Project Dashboard → Database → Backups
2. View available backups
3. Download or restore as needed

### 9.2 Automated Daily Backup Pipeline

**Architecture:**
```
Supabase (production) → pg_dump → GPG encrypt → 4 destinations:
  1. Local F:\2026\Backups\dws6-db (30-day retention)
  2. Proton Drive (encrypted, 90-day retention)
  3. Acer Veriton GN100 Helsinki (SCP, 90-day retention)
  4. GitHub Actions artifacts (30-day retention)
```

**Daily automation (Startup-DailySync.bat v1.5):**

The backup runs automatically on Windows login as part of the daily sync pipeline:

```
Step 1: git pull origin main
Step 2: Sync-ToProton.ps1 (files + encrypted DB backups)
Step 3: Sync-ToSupabase.ps1 (EU cloud backup)
Step 4: Backup-Database.ps1 (pg_dump + GPG encrypt)
Step 5: Mirror-ToAiven.ps1 (restore to Aiven sandbox)
```

**Manual backup:**

```powershell
# Standard backup (encrypt + local storage)
.\scripts\Backup-Database.ps1

# Dry run (see what would happen)
.\scripts\Backup-Database.ps1 -DryRun

# Include remote backup to Acer Veriton Helsinki
.\scripts\Backup-Database.ps1 -RemoteBackup

# Schema only (no data)
.\scripts\Backup-Database.ps1 -SchemaOnly
```

**CI/CD backup (GitHub Actions):**

The `.github/workflows/daily-db-backup.yml` workflow runs at 02:30 UTC daily as a safety net in case the local machine misses a backup. It creates encrypted artifacts with 30-day retention.

**Manual backup commands** (if scripts unavailable):

```bash
# Full database (custom format for fast restore)
pg_dump -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
        -U postgres -d postgres -F c \
        -f dws6_backup_$(date +%Y%m%d_%H%M%S).dump

# Table-specific
pg_dump -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
        -U postgres -d postgres -t projects -F c \
        -f projects_backup_$(date +%Y%m%d).dump

# Schema-only (SQL readable)
pg_dump -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
        -U postgres -d postgres --schema-only \
        -f schema_backup_$(date +%Y%m%d).sql
```

**Required environment variables** (in `.env`):

```
SUPABASE_DB_HOST=db.kpucuwwfhuwurdxyjjtz.supabase.co
SUPABASE_DB_PORT=5432
SUPABASE_DB_NAME=postgres
SUPABASE_DB_USER=postgres
SUPABASE_DB_PASSWORD=<your-password>
BACKUP_GPG_PASSPHRASE=<your-passphrase>
```

### 9.3 Aiven Sandbox Mirror

**Purpose:** Daily mirror of production data to Aiven PostgreSQL for:
- AI agent workspace (safe read/write without production risk)
- Lifetime World Model (LWM) training data
- Schema testing and migration validation
- Warm standby for disaster recovery (RTO: 1 hour)

**Aiven setup (one-time):**

1. Create Aiven PostgreSQL service at aiven.io
   - Cloud: Google Cloud, Region: google-europe-north1 (Finland)
   - Plan: Hobbyist (free, 5GB) or Startup ($19/mo, 80GB)
2. Run initialization script:
   ```bash
   psql "$AIVEN_DATABASE_URL" -f scripts/aiven-init.sql
   ```
3. Add to `.env`:
   ```
   AIVEN_ENABLED=true
   AIVEN_DB_HOST=pg-xxxxx.aivencloud.com
   AIVEN_DB_PORT=12345
   AIVEN_DB_NAME=defaultdb
   AIVEN_DB_USER=avnadmin
   AIVEN_DB_PASSWORD=<from-aiven-console>
   AIVEN_DB_SSLMODE=require
   ```

**Daily mirror (automated via Startup-DailySync.bat):**

```powershell
# Auto-detects latest backup, decrypts if needed, restores to Aiven
.\scripts\Mirror-ToAiven.ps1

# Dry run
.\scripts\Mirror-ToAiven.ps1 -DryRun

# Specific dump file
.\scripts\Mirror-ToAiven.ps1 -DumpFile "F:\2026\Backups\dws6-db\2026-03-07\dws6_2026-03-07.dump"
```

**Auth compatibility:** Supabase RLS policies reference `auth.uid()` and `auth.jwt()`. The `aiven-init.sql` script creates stub functions that return dummy values. RLS policies parse correctly but are effectively open on the sandbox (acceptable for non-production use).

### 9.4 Disaster Recovery Procedures

**Scenario 1: Supabase drops the database**

1. Retrieve latest encrypted backup from local (`F:\2026\Backups\dws6-db\`) or Proton Drive
2. Decrypt: `gpg --decrypt dws6_YYYY-MM-DD.dump.gpg > dws6_restore.dump`
3. Create new Supabase project (or restore to existing)
4. Restore: `pg_restore -h <new-host> -U postgres -d postgres -c -v dws6_restore.dump`
5. Verify row counts against `row_counts.json`
6. Update `.env` with new connection strings
7. Estimated RTO: 4 hours

**Scenario 2: Need immediate failover**

1. Switch application connection strings from Supabase to Aiven
2. Aiven already has yesterday's mirror — RTO: 1 hour
3. Note: Auth functions return dummy values on Aiven, so RLS is open
4. Use as temporary production only while Supabase is restored

**Scenario 3: Supabase account locked/deleted**

1. Latest backup available at: local disk, Proton Drive, Acer Helsinki, GitHub Actions
2. Restore to Aiven as production replacement
3. Or create new Supabase project and restore from backup
4. Run all 39 migrations to verify schema: `supabase db push`

### 9.5 Backup Verification Checklist

| Frequency | Action | How |
|-----------|--------|-----|
| **Daily** | Verify backup ran | Check `F:\2026\Backups\dws6-db\<today>\manifest.json` exists |
| **Daily** | Verify Aiven mirror | Check `_backup_metadata` table on Aiven |
| **Weekly** | Decrypt test | `gpg --decrypt <latest>.dump.gpg > /dev/null` |
| **Monthly** | Full restore drill | Restore to Aiven, compare row counts with source |
| **Quarterly** | DR drill | Simulate Supabase loss, restore from cold backup, measure RTO |

### 9.6 Restore Procedures (Manual)

#### Restore Full Database

```bash
pg_restore -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
           -U postgres -d postgres -c -v \
           dws6_backup_20260307_120000.dump
```

#### Restore Specific Table

```bash
pg_restore -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
           -U postgres -d postgres -t projects -c \
           projects_backup_20260307.dump
```

#### Restore from SQL File

```bash
psql -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
     -U postgres -d postgres \
     -f schema_backup_20260307.sql
```

---

## 10. Performance Tuning

### 10.1 Index Optimization

#### Identify Missing Indexes

```sql
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1;
```

#### Create Composite Indexes

```sql
-- For queries filtering by region and phase
CREATE INDEX idx_projects_region_phase ON projects(region, phase);

-- For queries filtering by severity and type
CREATE INDEX idx_alerts_severity_type ON alerts(severity, type);
```

### 10.2 Query Optimization

#### Use EXPLAIN ANALYZE

```sql
EXPLAIN (ANALYZE, BUFFERS, VERBOSE)
SELECT * FROM projects
WHERE region = 'Nordics'
  AND spi < 0.9
ORDER BY created_at DESC
LIMIT 10;
```

#### Optimize with CTEs

```sql
-- Use Common Table Expressions for complex queries
WITH at_risk_projects AS (
  SELECT id, name, spi, cpi
  FROM projects
  WHERE spi < 0.9 OR cpi < 0.9
)
SELECT 
  p.*,
  COUNT(a.id) as alert_count
FROM at_risk_projects p
LEFT JOIN alerts a ON a.project_name = p.name
GROUP BY p.id, p.name, p.spi, p.cpi;
```

### 10.3 Connection Pooling

**Supabase Connection Pooler**:
- Transaction mode: Best for serverless
- Session mode: Best for long-lived connections

**Configuration**:
```
Transaction mode: db.kpucuwwfhuwurdxyjjtz.supabase.co:6543
Session mode: db.kpucuwwfhuwurdxyjjtz.supabase.co:5432
```

---

## 11. Troubleshooting

### 11.1 Common Issues

#### Issue: Connection Timeout

**Symptoms**:
- "Connection timeout" error
- Slow query responses

**Solutions**:
1. Check Supabase status: https://status.supabase.com/
2. Verify network connectivity
3. Use connection pooler
4. Optimize slow queries

#### Issue: RLS Policy Blocking Access

**Symptoms**:
- Empty results despite data existing
- "Permission denied" errors

**Solutions**:
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'projects';

-- Temporarily disable RLS for testing (NOT in production)
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Re-enable after testing
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
```

#### Issue: High Database Load

**Symptoms**:
- Slow query performance
- High CPU usage
- Connection pool exhausted

**Solutions**:
1. Identify slow queries:
```sql
SELECT * FROM pg_stat_activity
WHERE state = 'active'
ORDER BY query_start;
```

2. Kill long-running queries:
```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'active'
  AND query_start < NOW() - INTERVAL '5 minutes';
```

3. Add missing indexes
4. Optimize queries
5. Consider upgrading plan

---

## 12. Database Drift Detection

### 12.1 Overview

Database drift occurs when the live Supabase schema diverges from migration files in the repository (`supabase/migrations/`). This creates the most dangerous category of bugs: the DB looks "kind of" migrated but isn't fully consistent with what the code expects.

**Source of truth:** The repository. The live DB must reflect these files.

### 12.2 Plan → Apply → Verify Pipeline

Three-phase approach to safe database operations, designed to eliminate partial runs and detect drift.

| Phase | Mode | Purpose | Tool |
|-------|------|---------|------|
| **Plan** | Read-only | Diff repo migrations vs live schema, output change plan | `scripts/db-drift-check.py` |
| **Apply** | Write | Execute migrations as single transactions with fail-fast guards | Supabase MCP `apply_migration` |
| **Verify** | Read-only | Post-apply checks: RLS enabled, constraints exist, row counts sane | `scripts/db-drift-check.py --verify` |

#### Phase 1: Plan (Read-Only Drift Detection)

```bash
# Run drift check — compares repo migrations against live DB
python scripts/db-drift-check.py

# Dry run (report only, no Redis alerts published)
python scripts/db-drift-check.py --dry-run
```

The script:
1. Lists all migration files in `supabase/migrations/`
2. Parses CREATE TABLE statements and checks for BEGIN/COMMIT wrappers
3. Queries live DB for existing tables (via Supabase REST API or MCP)
4. Reports drift (DB has tables not in repo, or repo has migrations not in DB)
5. Flags tables missing RLS
6. Publishes findings to `supabase:alerts` Redis channel

#### Phase 2: Apply (Transactional Execution)

**Guard rule:** Only accept migrations wrapped in `BEGIN`/`COMMIT`. Refuse to run bare SQL.

```sql
-- Valid migration format (accepted):
BEGIN;
  -- Guard: fail if prerequisite missing
  DO $$ BEGIN
    ASSERT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'advisors');
  END $$;

  CREATE TABLE IF NOT EXISTS advisor_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('INFO', 'WARNING', 'HIGH', 'CRITICAL')),
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    resolved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  ALTER TABLE advisor_alerts ENABLE ROW LEVEL SECURITY;
COMMIT;
```

#### Phase 3: Verify (Post-Apply Checks)

```bash
# Run verification after apply
python scripts/db-drift-check.py --verify
```

Checks: all repo tables exist in live DB, RLS enabled, constraints present.

### 12.3 Supabase Performance Advisor Alerts

The Supabase Performance Advisor (available via Management API) flags critical issues like missing indexes, unoptimized queries, and security gaps.

```bash
# Fetch advisor alerts and publish to Redis
python scripts/alert-publisher.py

# Dry run (report only)
python scripts/alert-publisher.py --dry-run
```

Requires `SUPABASE_ACCESS_TOKEN` (personal access token from supabase.com/dashboard/account/tokens).

### 12.4 Safety Rules for Migrations

| Rule | Why |
|------|-----|
| Every migration wrapped in `BEGIN`/`COMMIT` | Prevents partial runs |
| RLS enabled on all new tables | Prevents data leakage |
| No `DROP TABLE` without explicit approval | Prevents accidental data loss |
| No `SECURITY DEFINER` on public functions | Prevents privilege escalation |
| `service_role` key never in client code | Prevents total compromise |
| Use `IF NOT EXISTS` / `IF EXISTS` guards | Makes migrations idempotent |
| Include sanity SELECT before COMMIT | Confirms expected state |

### 12.5 Scripts Reference

| Script | Purpose |
|--------|---------|
| `scripts/db-drift-check.py` | Plan + Verify phases — detects schema drift, publishes alerts |
| `scripts/alert-publisher.py` | Fetches Supabase Performance Advisor results, publishes to Redis |

---

## 13. Alert Router & Redis Pub/Sub

### 13.1 Architecture

```
┌─────────────────────┐     ┌──────────────────────┐     ┌───────────────────┐
│  Alert Sources       │     │  Redis Pub/Sub        │     │  Alert Consumers   │
│                      │     │  (dws-mcp-redis:6380) │     │                    │
│  Supabase Advisor ──▶│     │                       │     │  Claude Code  ◀───│
│  DB Drift Check   ──▶│────▶│  supabase:alerts      │────▶│  admin@dws6.com◀──│
│  MCP Health       ──▶│     │  mcp:alerts           │     │  Grafana      ◀───│
│  Docker Events    ──▶│     │  system:alerts        │     │                    │
└─────────────────────┘     └──────────────────────┘     └───────────────────┘
```

### 13.2 Channels

| Channel | Source | Alert Types |
|---------|--------|-------------|
| `supabase:alerts` | DB drift check, Supabase advisor, migration events | Schema drift, performance warnings, security advisories |
| `mcp:alerts` | MCP Hub health, individual MCP server status | Container unhealthy, endpoint unreachable, auth failures |
| `system:alerts` | Docker events, disk space, training jobs | Container crash, low disk, training complete/failed |

### 13.3 Routing Rules by Severity

| Severity | Claude Code | Email (admin@dws6.com) | Grafana |
|----------|-------------|------------------------|---------|
| INFO | Yes | No | Yes |
| WARNING | Yes | No | Yes |
| HIGH | Yes | **Yes** | Yes |
| CRITICAL | Yes | **Yes** | Yes |

### 13.4 Alert Payload Format

```json
{
  "source": "db-drift-check",
  "severity": "HIGH",
  "title": "Schema drift detected",
  "message": "Table 'advisor_alerts' exists in DB but has no migration file",
  "details": {
    "table": "advisor_alerts",
    "drift_type": "unmigrated_table"
  },
  "timestamp": "2026-02-09T16:30:00Z"
}
```

### 13.5 Publishing Alerts from Services

```python
import redis
import json
from datetime import datetime, timezone

r = redis.Redis(host='dws-mcp-redis', port=6379)

alert = {
    "source": "supabase-advisor",
    "severity": "CRITICAL",
    "title": "2 critical performance advisories open",
    "message": "Supabase Performance Advisor flagged 2 critical issues",
    "details": {"advisory_count": 2},
    "timestamp": datetime.now(timezone.utc).isoformat()
}

r.publish("supabase:alerts", json.dumps(alert))
```

### 13.6 Configuration

| Variable | Purpose | Where to set |
|----------|---------|--------------|
| `REDIS_HOST` | Redis hostname | `.env` / alert router env |
| `REDIS_PORT` | Redis port (default: 6380) | `.env` / alert router env |
| `ADMIN_EMAIL` | Email recipient for HIGH/CRITICAL | Alert router env |
| `SUPABASE_URL` | Supabase project URL | `.env` |
| `SUPABASE_SERVICE_KEY` | Supabase admin access | `.env` |
| `SUPABASE_ACCESS_TOKEN` | Personal access token for Management API | `.env` |

---

## 14. Glossary

**RLS (Row Level Security):** Postgres feature that filters rows per user. If RLS is enabled but you forgot policies, queries return 0 rows (or fail) even though data exists.

**POLICY:** An allow rule for a table under RLS. Has two parts: `USING` (which rows you can access) and `WITH CHECK` (what you're allowed to insert/update). Missing `WITH CHECK` is a common privilege escalation.

**service_role:** Supabase "god" role used server-side. Bypasses RLS when using the service key, and can read/write anything. Treat exposure of this key as total compromise.

**authenticated / anon:** JWT roles for end users. `authenticated` means logged in, `anon` means not logged in.

**SECURITY DEFINER function:** Runs with the privileges of the function owner, not the caller. Useful for safe helper functions (like membership checks), dangerous if it accepts arbitrary `user_id` inputs or has no caller guard.

**Caller guard:** An explicit check inside a `SECURITY DEFINER` function that fails closed unless called from the intended context (commonly `service_role`). Prefer checking `current_setting('request.jwt.claim.role', true)` when you need it to behave outside RPC contexts.

**Idempotent migration/script:** Safe to run multiple times. Uses `IF NOT EXISTS`, `DROP ... IF EXISTS`, or guarded `DO` blocks so reruns don't fail or double-insert.

**Fail-fast guard:** A deliberate abort if reality doesn't match expectation (e.g., "expected exactly 3 targets"). Prevents partial deletes or silent no-ops.

**Sanity SELECT:** Human-readable queries before `COMMIT` to confirm the script is touching exactly what you think.

**Partial run:** A script was executed halfway (or only some statements). Creates the worst drift because the DB looks "kind of" migrated.

**Drift:** Repo migrations and live DB schema don't match. Diff schema effects (tables/columns/constraints/policies/functions), not raw SQL text.

**FK (Foreign Key):** A reference constraint between tables. Determines delete behavior: `CASCADE` deletes children automatically; `SET NULL` keeps child but clears link; `RESTRICT` blocks delete.

**CASCADE blast radius:** Unintended data loss caused by `ON DELETE CASCADE` chains when deleting a parent row.

**TOCTOU race:** "Time of check, time of use" race where `SELECT` then `INSERT` can collide under concurrency. Usually fixed with `INSERT ... ON CONFLICT`.

**Modular bias:** Slight non-uniformity when mapping random bytes into an alphabet using `% N`. Fine for short email tokens, not fine for cryptography.

**Staging vs prod:** Staging should mirror prod for validation. If you only have one DB, assume every change is prod-critical.

---

## Contact and Support

**Supabase Support**: https://supabase.com/support  
**Documentation**: https://supabase.com/docs  
**Community**: https://github.com/supabase/supabase/discussions

**DWS6 Technical Support**: support@dws-iq.com

---

**Document Version**: 1.1
**Last Updated**: 9 February 2026
**Next Review**: Q2 2026

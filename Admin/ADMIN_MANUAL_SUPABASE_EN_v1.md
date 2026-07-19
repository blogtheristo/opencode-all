# Admin Manual: Supabase Database Management for DWS6

---

# VERSION AND AGENT HISTORY

Version: 1.6

Sessions & Modifications:

- Version: 1.6 | Tool: Claude Code | Session: claude/add-supabase-table-grants-y0Ps6 | Date: 19.07.2026 | Changes: Added §7.5 New Table GRANT Checklist for the Supabase 2026-05-30 / 2026-10-30 Data API grant change — every new `CREATE TABLE public.*` must be paired with explicit `GRANT` to `service_role` + `authenticated` (anon opt-in only where RLS targets `anon`). Backfill migration `supabase/migrations/075_public_schema_grants.sql` reopens the table-level door for all 88 existing public tables and installs `alter default privileges` as a safety net.
- Version: 1.5 | Tool: GitHub Copilot CLI | Session: claude/jsonld-dws10-pages-20260426 | Date: 26.04.2026 | Changes: Added §7.4 migration parity repair runbook (Supabase CLI compatibility, duplicate-prefix archive, db push include-all handling) and migration 063 note
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 12.03.2026 | Changes: Added §15 PostgreSQL Columnar Extensions Roadmap — HTAP architecture plan, extension availability matrix (Supabase vs Aiven), TimescaleDB + pg_duckdb phased rollout, reference to DWS_DATA_STANDARD.md
- Version: 1.3 | Tool: Claude Code | Session: 2026-03-11 | Date: 11.03.2026 | Changes: Add direct Postgres vs MCP troubleshooting (§11.2), VPN/DoH behavior, migration 043 notes, and `db:test` script reference
- Version: 1.2 | Tool: Claude Code | Session: 2026-03-04 | Date: 04.03.2026 | Changes: Add migration audit documentation (§7.3) - comprehensive audit of 29 migration scripts, fixes for 10 missing tables, EU compliance verification
- Version: 1.1 | Tool: Claude Code | Session: 2026-02-09 | Date: 09.02.2026 | Changes: Add drift detection (§12), alert router (§13), glossary (§14), Plan→Apply→Verify pipeline
- Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial creation - Supabase admin manual for DWS6 project

Session Links & References:

- Cursor AI (2025-12-30): https://github.com/blogtheristo/dws6/pull/77
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md

Document Status:

- Created: 30.12.2025
- Last Modified: 26.04.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

**Version:** 1.6
**Purpose:** Supabase database administration guide for DWS6 project
**Audience:** Database Administrators, DevOps Engineers
**Updated:** 19.07.2026

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
   - [7.4 Migration Parity Repair (April 2026)](#74-migration-parity-repair-april-2026)
   - [7.5 New Table GRANT Checklist (Supabase 2026-05-30 / 2026-10-30)](#75-new-table-grant-checklist-supabase-2026-05-30--2026-10-30)
8. [Monitoring and Logs](#8-monitoring-and-logs)
9. [Backup and Recovery](#9-backup-and-recovery)
10. [Performance Tuning](#10-performance-tuning)
11. [Troubleshooting](#11-troubleshooting)

- [11.2 Direct Postgres vs MCP Under VPN](#112-direct-postgres-vs-mcp-under-vpn)

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
  .channel("projects-changes")
  .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, (payload) => {
    console.log("Project changed:", payload);
  })
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

### 7.4 Migration Parity Repair (April 2026)

**Context**: `supabase db push` listed many pending files due to duplicate version prefixes already represented in remote history.

**Root causes fixed**:

1. Local CLI compatibility drift (`db.health_timeout` unsupported in older CLI)
2. Duplicate-prefix migration files in `supabase/migrations/` causing out-of-order push prompts
3. Mixed history where remote had only one migration entry per prefix

**Operator procedure (Windows/PowerShell)**:

```powershell
# Use latest CLI for config compatibility
npx -y supabase@latest migration list

# If a single urgent migration must run immediately:
npx -y supabase@latest db query --linked -f supabase/migrations/063_token_usage_optimization.sql

# If db push still reports duplicate out-of-order files, archive duplicates:
New-Item -ItemType Directory -Force -Path supabase/migrations_archived_duplicates | Out-Null
# Move duplicate-prefix files out of supabase/migrations/ into the archive folder

# Verify parity
npx -y supabase@latest migration list
npx -y supabase@latest db push --yes
```

**Current state**:

- Migration `063_token_usage_optimization.sql` applied
- Duplicate-prefix files archived to `supabase/migrations_archived_duplicates/`
- `supabase db push --yes` reports: `Remote database is up to date.`

**Policy**:

- Keep only one active migration file per numeric prefix in `supabase/migrations/`
- Archive historical duplicate-prefix variants instead of leaving them in active push path
- Prefer `npx -y supabase@latest` in CI/operator workflows unless pinned version is verified

---

### 7.5 New Table GRANT Checklist (Supabase 2026-05-30 / 2026-10-30)

**Context**: Supabase dropped the implicit Data API grants on `public.*` for the `anon`, `authenticated`, and `service_role` roles on 2026-05-30 for new projects. All existing projects — including `dws6-production` — are enforced on 2026-10-30. A `public` table without an explicit `GRANT` is invisible to `supabase-js` / PostgREST / GraphQL; PostgREST returns `42501` even when RLS would have allowed the row. RLS is the row gate; `GRANT` is the table gate.

**Backfill of record**: `supabase/migrations/075_public_schema_grants.sql`.

That migration:

1. Grants schema `USAGE` on `public` to `anon`, `authenticated`, `service_role`.
2. Grants `SELECT, INSERT, UPDATE, DELETE` on every existing public table to `authenticated` + `service_role`.
3. Grants sequence `USAGE, SELECT` and function `EXECUTE` to the same two roles.
4. Sets `ALTER DEFAULT PRIVILEGES IN SCHEMA public` so any future table created without an inline grant block still lands granted — belt-and-suspenders against silent 42501s.
5. Grants per-table `SELECT` / `INSERT` to `anon` only where RLS explicitly targets `anon` (booking public reads, subscription_plans, file_index, captain_inquiries, web_leads, playbook_leads, booking_reservations).

**Checklist for every new `CREATE TABLE public.<name>`**:

- [ ] `enable row level security` on the table.
- [ ] `grant select, insert, update, delete on public.<name> to authenticated, service_role;`
- [ ] Every RLS policy declared with the roles it targets (`to authenticated`, `to service_role`, `to anon`).
- [ ] `grant select on public.<name> to anon;` — only if a policy allows anon read.
- [ ] `grant insert on public.<name> to anon;` — only if a policy allows anon submission.
- [ ] Sequence grants only if the table uses `SERIAL` / `BIGSERIAL` (UUID PKs need none).
- [ ] Copy the reference block from the top of `Firehorse/supabase-schema-templates.sql`.

**Verification**:

```sql
-- Roles and privileges on every public table
select grantee, privilege_type, count(*) as tables
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon', 'authenticated', 'service_role')
group by 1, 2
order by 1, 2;

-- Which tables anon can currently reach
select table_name, string_agg(privilege_type, ', ' order by privilege_type) as privs
from information_schema.role_table_grants
where table_schema = 'public' and grantee = 'anon'
group by 1
order by 1;
```

Expected: `authenticated` + `service_role` show SELECT/INSERT/UPDATE/DELETE across every public table; `anon` appears only on the opt-in surfaces listed above.

**Data API smoke test**:

```bash
# anon-visible surface (expect 200)
curl -s "${SUPABASE_URL}/rest/v1/booking_services?select=id&limit=1" \
  -H "apikey: ${SUPABASE_ANON_KEY}"

# non-anon table (expect empty array or 403 by RLS, NOT a 42501 "permission denied for table" error)
curl -s "${SUPABASE_URL}/rest/v1/firehorse_memory?select=id&limit=1" \
  -H "apikey: ${SUPABASE_ANON_KEY}"
```

A `42501` on any table indicates a missing table-level `GRANT` — patch it in a follow-up migration.

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

### 9.1 Automatic Backups

**Supabase Free Tier**:

- Daily automatic backups
- Retained for 7 days
- No point-in-time recovery

**Access Backups**:

1. Go to Project Dashboard → Database → Backups
2. View available backups
3. Download or restore as needed

### 9.2 Manual Backup

#### Full Database Backup

```bash
pg_dump -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
        -U postgres \
        -d postgres \
        -F c \
        -f dws6_backup_$(date +%Y%m%d_%H%M%S).dump
```

#### Table-Specific Backup

```bash
# Backup projects table
pg_dump -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
        -U postgres \
        -d postgres \
        -t projects \
        -F c \
        -f projects_backup_$(date +%Y%m%d).dump

# Backup alerts table
pg_dump -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
        -U postgres \
        -d postgres \
        -t alerts \
        -F c \
        -f alerts_backup_$(date +%Y%m%d).dump
```

#### Schema-Only Backup

```bash
pg_dump -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
        -U postgres \
        -d postgres \
        --schema-only \
        -f schema_backup_$(date +%Y%m%d).sql
```

### 9.3 Restore Procedures

#### Restore Full Database

```bash
pg_restore -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
           -U postgres \
           -d postgres \
           -c \
           -v \
           dws6_backup_20251230_120000.dump
```

#### Restore Specific Table

```bash
pg_restore -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
           -U postgres \
           -d postgres \
           -t projects \
           -c \
           projects_backup_20251230.dump
```

#### Restore from SQL File

```bash
psql -h db.kpucuwwfhuwurdxyjjtz.supabase.co \
     -U postgres \
     -d postgres \
     -f schema_backup_20251230.sql
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

### 11.2 Direct Postgres vs MCP Under VPN

**Observed behavior (March 2026):**

- Supabase SQL execution through MCP works while VPN is enabled
- Direct `DATABASE_URL` connections from local tools may fail under VPN
- Common direct-DB errors seen in practice:
  - `connect EACCES ...:5432` — direct PostgreSQL socket blocked, often on IPv6
  - `SELF_SIGNED_CERT_IN_CHAIN` — TLS query params in `DATABASE_URL` conflicting with local client SSL config
  - `28P01 password authentication failed` — wrong or placeholder DB password in `DATABASE_URL`

**Why MCP works while `pg` fails:**

- MCP traffic usually goes over HTTPS (`443`) through an API layer
- Direct Postgres uses raw TCP to `db.<project-ref>.supabase.co:5432`
- VPN/browser bypass rules may allow HTTPS while still blocking raw `5432`

**Important conclusion:**

- If MCP works but `npm run db:test` fails, the problem is usually network/VPN routing, not the SQL migration itself
- If direct DB works only with VPN off, use MCP or Supabase SQL Editor when VPN must remain on

**Known DWS6 host:**

- Direct DB target: `db.kpucuwwfhuwurdxyjjtz.supabase.co:5432`
- Supabase web UI: `https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/sql/new`

**VPN notes:**

- Hostname-only bypass may be insufficient for direct Postgres
- Some VPN clients bypass browser HTTPS correctly but still intercept local TCP clients (`node`, Cursor terminal, DGX Spark)
- If the VPN warns that bypass does not work with DNS over HTTPS (DoH), disable DoH before testing hostname-based bypass rules

**Recommended test order:**

1. Test MCP path first. If MCP SQL works, schema/app logic is probably fine.
2. Test direct Postgres path with `npm run db:test`
3. Compare VPN on vs VPN off
4. If VPN on fails and VPN off works, report the issue as direct Postgres/TCP `5432` interception, not a SQL bug

**Reusable direct DB test:**

```bash
npm run db:test
```

This script:

- loads `.env`, `100326.env`, `.env.local`
- sanitizes SSL query params from `DATABASE_URL`
- tests direct Postgres connectivity
- runs a harmless query and prints connection details

**Migration helpers for partial-history environments:**

```bash
npm run db:migrate:042
npm run db:migrate:043
```

Both migration runners:

- strip SSL query params from `DATABASE_URL`
- force a local non-verifying SSL config for compatibility
- print the target DB host/port for debugging

**Password source rule:**

- `DATABASE_URL` must use the actual PostgreSQL password from `Supabase Dashboard -> Project Settings -> Database`
- Do not use `anon`, `service_role`, or `sb_secret_*` keys as the Postgres password

**Safe fallback when direct DB is blocked:**

1. Use Supabase SQL Editor
2. Or use MCP-based SQL execution / migration apply path
3. Defer direct `pg` tooling until VPN bypass for `db.<project-ref>.supabase.co:5432` is proven to work

---

## 12. Database Drift Detection

### 12.1 Overview

Database drift occurs when the live Supabase schema diverges from migration files in the repository (`supabase/migrations/`). This creates the most dangerous category of bugs: the DB looks "kind of" migrated but isn't fully consistent with what the code expects.

**Source of truth:** The repository. The live DB must reflect these files.

### 12.2 Plan → Apply → Verify Pipeline

Three-phase approach to safe database operations, designed to eliminate partial runs and detect drift.

| Phase      | Mode      | Purpose                                                            | Tool                                 |
| ---------- | --------- | ------------------------------------------------------------------ | ------------------------------------ |
| **Plan**   | Read-only | Diff repo migrations vs live schema, output change plan            | `scripts/db-drift-check.py`          |
| **Apply**  | Write     | Execute migrations as single transactions with fail-fast guards    | Supabase MCP `apply_migration`       |
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

| Rule                                        | Why                           |
| ------------------------------------------- | ----------------------------- |
| Every migration wrapped in `BEGIN`/`COMMIT` | Prevents partial runs         |
| RLS enabled on all new tables               | Prevents data leakage         |
| No `DROP TABLE` without explicit approval   | Prevents accidental data loss |
| No `SECURITY DEFINER` on public functions   | Prevents privilege escalation |
| `service_role` key never in client code     | Prevents total compromise     |
| Use `IF NOT EXISTS` / `IF EXISTS` guards    | Makes migrations idempotent   |
| Include sanity SELECT before COMMIT         | Confirms expected state       |

### 12.5 Scripts Reference

| Script                           | Purpose                                                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------- |
| `scripts/db-drift-check.py`      | Plan + Verify phases — detects schema drift, publishes alerts                                   |
| `scripts/alert-publisher.py`     | Fetches Supabase Performance Advisor results, publishes to Redis                                |
| `scripts/test-db-connection.ts`  | Tests direct PostgreSQL connectivity using `DATABASE_URL`; use to compare VPN on vs off         |
| `scripts/apply-migration-042.ts` | Applies migration 042 directly via `pg` when migration history prevents full `supabase db push` |
| `scripts/apply-migration-043.ts` | Applies migration 043 directly via `pg` when migration history prevents full `supabase db push` |

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

| Channel           | Source                                             | Alert Types                                              |
| ----------------- | -------------------------------------------------- | -------------------------------------------------------- |
| `supabase:alerts` | DB drift check, Supabase advisor, migration events | Schema drift, performance warnings, security advisories  |
| `mcp:alerts`      | MCP Hub health, individual MCP server status       | Container unhealthy, endpoint unreachable, auth failures |
| `system:alerts`   | Docker events, disk space, training jobs           | Container crash, low disk, training complete/failed      |

### 13.3 Routing Rules by Severity

| Severity | Claude Code | Email (admin@dws6.com) | Grafana |
| -------- | ----------- | ---------------------- | ------- |
| INFO     | Yes         | No                     | Yes     |
| WARNING  | Yes         | No                     | Yes     |
| HIGH     | Yes         | **Yes**                | Yes     |
| CRITICAL | Yes         | **Yes**                | Yes     |

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

| Variable                | Purpose                                  | Where to set              |
| ----------------------- | ---------------------------------------- | ------------------------- |
| `REDIS_HOST`            | Redis hostname                           | `.env` / alert router env |
| `REDIS_PORT`            | Redis port (default: 6380)               | `.env` / alert router env |
| `ADMIN_EMAIL`           | Email recipient for HIGH/CRITICAL        | Alert router env          |
| `SUPABASE_URL`          | Supabase project URL                     | `.env`                    |
| `SUPABASE_SERVICE_KEY`  | Supabase admin access                    | `.env`                    |
| `SUPABASE_ACCESS_TOKEN` | Personal access token for Management API | `.env`                    |

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

---

## 15. PostgreSQL Columnar Extensions Roadmap

### 15.1 Current State

DWS6 runs on Supabase PostgreSQL (EU) with only `uuid-ossp` and `pgcrypto` extensions active. All analytics queries run against transactional heap tables with no columnar or HTAP capabilities.

### 15.2 Extension Availability

| Extension          | Supabase   | Aiven (V1)    | Self-hosted | Purpose                           |
| ------------------ | ---------- | ------------- | ----------- | --------------------------------- |
| uuid-ossp          | **Active** | Available     | Available   | UUID generation                   |
| pgcrypto           | **Active** | Available     | Available   | Cryptographic functions           |
| pgvector           | Available  | Available     | Available   | Vector embeddings (planned)       |
| pg_stat_statements | Available  | Available     | Available   | Query profiling (Phase 0)         |
| TimescaleDB        | No         | **Available** | Available   | Time-series hypertables (Phase 1) |
| pg_duckdb          | No         | Verify        | Available   | Analytical acceleration (Phase 2) |
| pg_mooncake        | No         | No            | Available   | Lakehouse export (Phase 3)        |

### 15.3 Phased Rollout

**Phase 0 (Q1 2026 — Supabase):** Table partitioning on `article12_audit_log` and `firehorse_events`, materialized views for campaign funnels, enable `pg_stat_statements`.

**Phase 1 (Q2 2026 — Aiven V1):** Enable TimescaleDB. Convert `agent_metrics` and `agent_costs` to hypertables with compression policies (90d hot → compressed). Continuous aggregates for dashboards.

**Phase 2 (Q3-Q4 2026 — Aiven DWS7):** Install pg_duckdb for analytical query acceleration. IoT sensor data → hypertables. Article 12 audit log → columnar compressed (7-year retention).

**Phase 3 (2027):** pg_mooncake for Iceberg/Parquet export. EU Data Act IoT portability compliance.

### 15.4 Governing Standard

All extension and storage engine decisions are governed by `DWS_DATA_STANDARD.md` (root-level DWS standard). Refer to that document for:

- Storage engine decision matrix (row vs columnar vs hybrid)
- Extension governance and approval process
- Data retention policies mapped to EU regulations
- Partitioning and compression standards
- EU regulatory compliance matrix

### 15.5 Admin Actions

**Before installing any new extension:**

1. Verify it is in the Approved Extensions Registry (`DWS_DATA_STANDARD.md` §12)
2. Test on Aiven Developer plan ($5/mo) first
3. Create a migration file following `DWS_DATA_STANDARD.md` §10.4 template
4. Run `scripts/db-drift-check.py` before and after
5. Document in this manual

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

# Admin Manual: Supabase Database Management for DWS6

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial creation - Supabase admin manual for DWS6 project

Session Links & References:
  - Cursor AI (2025-12-30): https://github.com/blogtheristo/dws6/pull/77
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 30.12.2025
  - Language: English
  - Languages Available: English
  - Publication Status: ✅ ACTIVE

---

**Version:** 1.0  
**Purpose:** Supabase database administration guide for DWS6 project  
**Audience:** Database Administrators, DevOps Engineers  
**Updated:** 30.12.2025

---

## Table of Contents

1. [Overview](#1-overview)
2. [Project Setup](#2-project-setup)
3. [Database Schema](#3-database-schema)
4. [Security Configuration](#4-security-configuration)
5. [API Management](#5-api-management)
6. [Authentication](#6-authentication)
7. [Database Operations](#7-database-operations)
8. [Monitoring and Logs](#8-monitoring-and-logs)
9. [Backup and Recovery](#9-backup-and-recovery)
10. [Performance Tuning](#10-performance-tuning)
11. [Troubleshooting](#11-troubleshooting)

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

---

## Contact and Support

**Supabase Support**: https://supabase.com/support  
**Documentation**: https://supabase.com/docs  
**Community**: https://github.com/supabase/supabase/discussions

**DWS6 Technical Support**: support@dws-iq.com

---

**Document Version**: 1.0  
**Last Updated**: 30. December 2025  
**Next Review**: Q2 2026

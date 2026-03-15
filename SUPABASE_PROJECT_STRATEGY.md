# Supabase Project Strategy - DWS6 Ecosystem

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial analysis of Supabase project structure strategy

Session Links & References:
  - GitHub: https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/SUPABASE_PROJECT_STRATEGY.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 30.12.2025
  - Language: English
  - Languages Available: English
  - Publication Status: ✅ ACTIVE

---

## Executive Summary

**Question:** Do we need separate Supabase projects for People management and V8/V9 dashboard data?

**Answer:** **NO** - Use ONE Supabase project with schema separation.

**Current Project:**
- **Project Name:** dws6
- **Project ID:** kpucuwwfhuwurdxyjjtz
- **Status:** ✅ Active

---

## 📊 Decision Matrix

### Single Project vs. Multiple Projects

| Factor | Single Project | Multiple Projects |
|--------|---------------|-------------------|
| **Cost** | ✅ €25/month (Pro) | ❌ €75/month (3× Pro) |
| **User Management** | ✅ Unified auth | ❌ Separate auth per project |
| **Data Relationships** | ✅ Easy cross-table queries | ❌ Complex API calls needed |
| **Backup Strategy** | ✅ One backup system | ❌ Three backup systems |
| **Monitoring** | ✅ One dashboard | ❌ Three dashboards |
| **Deployment** | ✅ Simpler CI/CD | ❌ Complex multi-project deploy |
| **Security** | ✅ One security config | ❌ Three security configs |
| **Scalability** | ✅ Scales together | ⚠️ Independent scaling |
| **Team Access** | ✅ One access control | ❌ Multiple access controls |
| **Compliance** | ✅ Single audit trail | ❌ Multiple audit trails |

**Score:** Single Project wins **9-1**

---

## 🎯 Recommended Architecture

### Single Supabase Project with Schema Separation

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE PROJECT: dws6                        │
│                  (kpucuwwfhuwurdxyjjtz)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    PUBLIC SCHEMA                            │ │
│  │  (Default tables, shared across all modules)                │ │
│  │  - users (auth.users reference)                             │ │
│  │  - organizations                                            │ │
│  │  - audit_logs                                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    PROJECTS SCHEMA                          │ │
│  │  (V9 Dashboard data)                                        │ │
│  │  - projects.projects                                        │ │
│  │  - projects.kpis                                            │ │
│  │  - projects.milestones                                      │ │
│  │  - projects.budgets                                         │ │
│  │  - projects.risks                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    PEOPLE SCHEMA                            │ │
│  │  (People management data)                                   │ │
│  │  - people.employees                                         │ │
│  │  - people.roles                                             │ │
│  │  - people.assignments                                       │ │
│  │  - people.timesheets                                        │ │
│  │  - people.certifications                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    ANALYTICS SCHEMA                         │ │
│  │  (V8 Enhanced historical data)                              │ │
│  │  - analytics.historical_kpis                                │ │
│  │  - analytics.trends                                         │ │
│  │  - analytics.reports                                        │ │
│  │  - analytics.dashboards                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    FIREHORSE SCHEMA                         │ │
│  │  (Existing Firehorse data)                                  │ │
│  │  - firehorse.pilot_data                                     │ │
│  │  - firehorse.linkedin_templates                             │ │
│  │  - firehorse.porr_templates                                 │ │
│  │  - firehorse.workflows                                      │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    MCP SCHEMA                               │ │
│  │  (MCP Hub integration)                                      │ │
│  │  - mcp.agent_context                                        │ │
│  │  - mcp.sessions                                             │ │
│  │  - mcp.state                                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    INVESTOR SCHEMA                          │ │
│  │  (Investor relations data)                                  │ │
│  │  - investor.financial_data                                  │ │
│  │  - investor.metrics                                         │ │
│  │  - investor.reports                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

## 💡 Why Single Project Works Best

### 1. Shared User Authentication

**Scenario:** A project manager needs to:
- View project KPIs (V9 Dashboard)
- Assign team members (People Management)
- Review historical trends (V8 Enhanced)

**Single Project:**
```javascript
// One login, access all data
const { data: user } = await supabase.auth.getUser()

// Access projects
const { data: projects } = await supabase
  .from('projects.projects')
  .select('*')

// Access people
const { data: team } = await supabase
  .from('people.employees')
  .select('*')
```

**Multiple Projects:**
```javascript
// Three separate logins!
const supabaseProjects = createClient(url1, key1)
const supabasePeople = createClient(url2, key2)
const supabaseAnalytics = createClient(url3, key3)

// Three separate auth sessions
await supabaseProjects.auth.signIn(...)
await supabasePeople.auth.signIn(...)
await supabaseAnalytics.auth.signIn(...)
```

### 2. Data Relationships

**Example:** Show project team members with their KPIs

**Single Project:**
```sql
-- Simple JOIN across schemas
SELECT 
  p.name AS project_name,
  e.name AS employee_name,
  k.value AS kpi_value
FROM projects.projects p
JOIN people.assignments a ON p.id = a.project_id
JOIN people.employees e ON a.employee_id = e.id
JOIN projects.kpis k ON p.id = k.project_id
WHERE p.status = 'active';
```

**Multiple Projects:**
```javascript
// Complex API orchestration
const projects = await projectsDB.from('projects').select('*')
const assignments = await peopleDB.from('assignments').select('*')
const employees = await peopleDB.from('employees').select('*')
const kpis = await projectsDB.from('kpis').select('*')

// Manual joining in application code
const result = projects.map(p => {
  const projectAssignments = assignments.filter(a => a.project_id === p.id)
  const projectEmployees = projectAssignments.map(a => 
    employees.find(e => e.id === a.employee_id)
  )
  const projectKpis = kpis.filter(k => k.project_id === p.id)
  return { ...p, employees: projectEmployees, kpis: projectKpis }
})
```

### 3. Cost Analysis

| Plan | Single Project | 3 Projects | Savings |
|------|---------------|------------|---------|
| **Free** | €0/month | €0/month | €0 |
| **Pro** | €25/month | €75/month | **€50/month** |
| **Team** | €599/month | €1,797/month | **€1,198/month** |
| **Enterprise** | Custom | 3× Custom | **Significant** |

**Annual Savings (Pro plan):** €600/year

### 4. Operational Simplicity

| Task | Single Project | Multiple Projects |
|------|---------------|-------------------|
| **Backup** | 1 backup job | 3 backup jobs |
| **Monitoring** | 1 dashboard | 3 dashboards |
| **Security Audit** | 1 audit | 3 audits |
| **Migrations** | 1 migration path | 3 migration paths |
| **Team Onboarding** | 1 access grant | 3 access grants |
| **Compliance Check** | 1 review | 3 reviews |

---

## 🔧 Implementation Guide

### Step 1: Create Schemas

```sql
-- Create schemas for different modules
CREATE SCHEMA IF NOT EXISTS projects;
CREATE SCHEMA IF NOT EXISTS people;
CREATE SCHEMA IF NOT EXISTS analytics;
CREATE SCHEMA IF NOT EXISTS firehorse;
CREATE SCHEMA IF NOT EXISTS mcp;
CREATE SCHEMA IF NOT EXISTS investor;

-- Grant usage to authenticated users
GRANT USAGE ON SCHEMA projects TO authenticated;
GRANT USAGE ON SCHEMA people TO authenticated;
GRANT USAGE ON SCHEMA analytics TO authenticated;
GRANT USAGE ON SCHEMA firehorse TO authenticated;
GRANT USAGE ON SCHEMA mcp TO authenticated;
GRANT USAGE ON SCHEMA investor TO authenticated;
```

### Step 2: Create Tables in Schemas

```sql
-- Example: Projects schema
CREATE TABLE projects.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example: People schema
CREATE TABLE people.employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Example: Link table (cross-schema relationship)
CREATE TABLE people.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects.projects(id),
  employee_id UUID REFERENCES people.employees(id),
  role TEXT,
  start_date DATE,
  end_date DATE,
  UNIQUE(project_id, employee_id)
);
```

### Step 3: Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE projects.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE people.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE people.assignments ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can view their own projects
CREATE POLICY "Users can view their projects"
ON projects.projects
FOR SELECT
USING (
  created_by = auth.uid() OR
  id IN (
    SELECT project_id 
    FROM people.assignments 
    WHERE employee_id IN (
      SELECT id FROM people.employees WHERE email = auth.email()
    )
  )
);

-- Example policy: Users can view their own employee record
CREATE POLICY "Users can view their employee record"
ON people.employees
FOR SELECT
USING (email = auth.email());
```

### Step 4: Create Views for Common Queries

```sql
-- View: Project team members
CREATE VIEW public.project_teams AS
SELECT 
  p.id AS project_id,
  p.name AS project_name,
  e.id AS employee_id,
  e.name AS employee_name,
  a.role AS assignment_role,
  a.start_date,
  a.end_date
FROM projects.projects p
JOIN people.assignments a ON p.id = a.project_id
JOIN people.employees e ON a.employee_id = e.id;

-- Grant access
GRANT SELECT ON public.project_teams TO authenticated;
```

### Step 5: Create API Functions

```sql
-- Function: Get project with team and KPIs
CREATE OR REPLACE FUNCTION public.get_project_details(project_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'project', (SELECT row_to_json(p) FROM projects.projects p WHERE p.id = project_id),
    'team', (
      SELECT json_agg(row_to_json(e))
      FROM people.employees e
      JOIN people.assignments a ON e.id = a.employee_id
      WHERE a.project_id = project_id
    ),
    'kpis', (
      SELECT json_agg(row_to_json(k))
      FROM projects.kpis k
      WHERE k.project_id = project_id
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute
GRANT EXECUTE ON FUNCTION public.get_project_details TO authenticated;
```

---

## 🚨 When to Use Separate Projects

Consider separate Supabase projects ONLY in these scenarios:

### 1. Different Data Residency Requirements

**Example:** EU customers require data in EU region, US customers in US region.

```
Project 1: dws6-eu (Region: eu-central-1)
Project 2: dws6-us (Region: us-east-1)
```

**DWS6 Status:** ❌ Not needed - All customers are EU-based

### 2. Strict Customer Isolation (Multi-Tenant SaaS)

**Example:** Each enterprise customer gets their own isolated database.

```
Project 1: dws6-customer-a
Project 2: dws6-customer-b
Project 3: dws6-customer-c
```

**DWS6 Status:** ❌ Not needed - Internal use, not multi-tenant SaaS

### 3. Completely Independent Teams

**Example:** Separate development teams with no overlap.

```
Project 1: dws6-team-alpha
Project 2: dws6-team-beta
```

**DWS6 Status:** ❌ Not needed - Same team works on all modules

### 4. Different Environments

**Example:** Production vs. Staging/Development

```
Project 1: dws6-production
Project 2: dws6-staging
Project 3: dws6-development
```

**DWS6 Status:** ✅ **RECOMMENDED** - Create staging project for testing

---

## 📋 Recommended Project Structure

### Production Setup

```
┌─────────────────────────────────────────────────────────────┐
│  PRODUCTION                                                  │
│  Project: dws6                                               │
│  ID: kpucuwwfhuwurdxyjjtz                                    │
│  Region: [Current region]                                    │
│  Plan: Pro (€25/month)                                       │
│                                                               │
│  Schemas:                                                    │
│  - public (shared data)                                      │
│  - projects (V9 dashboard)                                   │
│  - people (people management)                                │
│  - analytics (V8 enhanced)                                   │
│  - firehorse (existing)                                      │
│  - mcp (existing)                                            │
│  - investor (existing)                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STAGING (Recommended to create)                             │
│  Project: dws6-staging                                       │
│  ID: [To be created]                                         │
│  Region: Same as production                                  │
│  Plan: Free or Pro                                           │
│                                                               │
│  Purpose:                                                    │
│  - Test migrations before production                         │
│  - QA environment                                            │
│  - Demo environment                                          │
│  - Training environment                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Migration Plan

### Phase 1: Schema Setup (Week 1)

- [ ] Create schemas in existing project
- [ ] Move existing tables to appropriate schemas
- [ ] Update RLS policies for new schema structure
- [ ] Test cross-schema queries

### Phase 2: V9 Dashboard Integration (Week 2-3)

- [ ] Create `projects` schema tables
- [ ] Set up RLS policies
- [ ] Create API functions
- [ ] Integrate with V9 frontend

### Phase 3: People Management (Week 4-5)

- [ ] Create `people` schema tables
- [ ] Set up RLS policies
- [ ] Create assignment relationships
- [ ] Build People management UI

### Phase 4: V8 Enhanced Analytics (Week 6-7)

- [ ] Create `analytics` schema tables
- [ ] Set up historical data migration
- [ ] Create trend analysis functions
- [ ] Integrate with V8 dashboard

### Phase 5: Testing & Optimization (Week 8)

- [ ] Performance testing
- [ ] Security audit
- [ ] Backup verification
- [ ] Documentation update

---

## 📊 Success Metrics

### Technical Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Query Response Time | < 100ms | TBD | 🚧 |
| Database Size | < 8GB (Pro limit) | TBD | 🚧 |
| API Requests | < 500k/month | TBD | 🚧 |
| Uptime | > 99.9% | TBD | 🚧 |
| Error Rate | < 0.1% | TBD | 🚧 |

### Business Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Cost per Month | €25 | €0 (Free) | ✅ |
| Team Onboarding Time | < 1 hour | TBD | 🚧 |
| Deployment Time | < 5 minutes | TBD | 🚧 |
| Backup Recovery Time | < 1 hour | TBD | 🚧 |

---

## 🔒 Security Considerations

### Schema-Level Security

```sql
-- Revoke public access to schemas
REVOKE ALL ON SCHEMA projects FROM public;
REVOKE ALL ON SCHEMA people FROM public;
REVOKE ALL ON SCHEMA analytics FROM public;

-- Grant only to authenticated users
GRANT USAGE ON SCHEMA projects TO authenticated;
GRANT USAGE ON SCHEMA people TO authenticated;
GRANT USAGE ON SCHEMA analytics TO authenticated;
```

### Table-Level Security

```sql
-- Enable RLS on all tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT schemaname, tablename 
    FROM pg_tables 
    WHERE schemaname IN ('projects', 'people', 'analytics')
  LOOP
    EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', 
      r.schemaname, r.tablename);
  END LOOP;
END $$;
```

### Audit Logging

```sql
-- Create audit log table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own audit logs
CREATE POLICY "Users can view their audit logs"
ON public.audit_logs
FOR SELECT
USING (user_id = auth.uid());
```

---

## 📚 Documentation & Resources

### Internal Documentation

- **Supabase Project Info:** `supabase/PROJECT_INFO.md` (⚠️ Confidential)
- **Admin Manual:** `ADMIN_MANUAL_DWS6_COM.md` (Section 7)
- **Migration Files:** `supabase/migrations/`

### External Resources

- **Supabase Schemas:** https://supabase.com/docs/guides/database/schemas
- **RLS Policies:** https://supabase.com/docs/guides/auth/row-level-security
- **PostgreSQL Schemas:** https://www.postgresql.org/docs/current/ddl-schemas.html

---

## ✅ Final Recommendation

### For DWS6: Use ONE Supabase Project

**Reasons:**
1. ✅ **Cost Efficient:** €25/month vs. €75/month
2. ✅ **Unified Authentication:** Single login for all users
3. ✅ **Data Relationships:** Easy cross-module queries
4. ✅ **Operational Simplicity:** One backup, one monitor, one deploy
5. ✅ **Team Efficiency:** One access control system
6. ✅ **Compliance:** Single audit trail
7. ✅ **Scalability:** Scales together as business grows
8. ✅ **Maintenance:** Less complexity, fewer points of failure

**Implementation:**
- Use **schemas** to separate concerns (projects, people, analytics)
- Use **RLS policies** for access control
- Use **views** for common cross-schema queries
- Use **functions** for complex operations

**Exception:**
- Create a **separate staging project** for testing (recommended)

---

**Version:** 1.0  
**Date:** 30. December 2025  
**Decision:** ✅ Single Supabase Project with Schema Separation  
**Status:** 🎯 RECOMMENDED APPROACH

---

**Document Information:**

**Title:** Supabase Project Strategy - DWS6 Ecosystem  
**Author:** Risto Anton Päärni  
**Project:** dws6  
**Classification:** Internal Strategy Document  
**Version:** 1.0  
**Last Updated:** 30.12.2025

**License:** Proprietary - Lifetime Oy  
**Contact:** risto@lifetime.fi


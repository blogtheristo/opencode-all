# DWS IQ 6 Platform - Administrator Manual

**Version:** 6.0  
**Document Date:** December 31, 2025  
**Classification:** Confidential - For System Administrators Only  
**Platform:** DWS IQ 6 - Industrial Intelligence Platform  
**Compliance:** Fit for 55, GDPR, ISO 27001

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 6.0 | 2025-12-31 | DWS IQ Platform Team | Initial V6 Administrator Manual |

**Distribution List:**
- System Administrators
- IT Operations Team
- Security Team
- DevOps Engineers

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Installation & Deployment](#installation--deployment)
4. [Configuration Management](#configuration-management)
5. [User Management](#user-management)
6. [Security Administration](#security-administration)
7. [Database Administration](#database-administration)
8. [Backup & Recovery](#backup--recovery)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)
11. [API Administration](#api-administration)
12. [Integration Management](#integration-management)
13. [Performance Optimization](#performance-optimization)
14. [Compliance & Audit](#compliance--audit)
15. [Appendices](#appendices)

---

## Executive Summary

### About DWS IQ 6 Platform

**DWS IQ 6** is an AI-native industrial intelligence platform designed to automate climate compliance for 8 industries. It serves as the "Brain-Memory-Body-Hands" ecosystem for enterprise construction and industrial operations.

**Key Components:**
- 🧠 **BRAIN:** Multi-agent AI orchestration (Groq LPUs, Claude Sonnet 4.5, GPT-4)
- 💾 **MEMORY:** Lifetime World Model (Climate-intelligent LLM)
- 🏢 **BODY:** 8 Industry Applications (Construction, Manufacturing, Logistics, etc.)
- 🤖 **HANDS:** Physical execution layer (IoT, Robots, Fleet)

### Administrator Role

As a DWS IQ 6 Administrator, you are responsible for:
- ✅ Platform deployment and configuration
- ✅ User access and role management
- ✅ Security and compliance oversight
- ✅ System monitoring and performance
- ✅ Backup and disaster recovery
- ✅ Integration with enterprise systems (SAP, ERP)
- ✅ Fit for 55 compliance data management

### Critical Success Factors

1. **Data Sovereignty:** Platform runs in customer's cloud environment
2. **Audit-Grade Data:** All carbon tracking must be verifiable
3. **GDPR Compliance:** EU data protection requirements
4. **High Availability:** 99.9% uptime SLA
5. **Security:** ISO 27001 certified operations

---

## System Architecture

### Platform Overview

```
┌─────────────────────────────────────────────────────────┐
│ DWS IQ 6 PLATFORM ARCHITECTURE                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ ┌────────────────────────────────────────────────────┐ │
│ │ PRESENTATION LAYER                                  │ │
│ │ ├─ Web Dashboard (React + TypeScript)              │ │
│ │ ├─ Mobile App (React Native)                       │ │
│ │ ├─ Situation Room (Executive Views)                │ │
│ │ └─ Control Room (Operational Views)                │ │
│ └────────────────────────────────────────────────────┘ │
│                           ↕                             │
│ ┌────────────────────────────────────────────────────┐ │
│ │ APPLICATION LAYER                                   │ │
│ │ ├─ Firehorse Reports Engine                        │ │
│ │ ├─ Firehorse ContentMS                             │ │
│ │ ├─ Firehorse Automation                            │ │
│ │ ├─ Firehorse Omnichannel                           │ │
│ │ └─ 8 Industry Applications                         │ │
│ └────────────────────────────────────────────────────┘ │
│                           ↕                             │
│ ┌────────────────────────────────────────────────────┐ │
│ │ AI/ML LAYER (BRAIN)                                │ │
│ │ ├─ Multi-Agent Orchestration                       │ │
│ │ ├─ Groq LPU (Ultra-fast inference)                 │ │
│ │ ├─ Claude Sonnet 4.5 (Reasoning)                   │ │
│ │ ├─ GPT-4 (General intelligence)                    │ │
│ │ └─ Lifetime World Model (Climate LLM)              │ │
│ └────────────────────────────────────────────────────┘ │
│                           ↕                             │
│ ┌────────────────────────────────────────────────────┐ │
│ │ DATA LAYER (MEMORY)                                │ │
│ │ ├─ Supabase (PostgreSQL + Auth)                    │ │
│ │ ├─ Carbon Factors Database                         │ │
│ │ ├─ Project Data Store                              │ │
│ │ ├─ User & Permissions                              │ │
│ │ └─ Audit Logs                                      │ │
│ └────────────────────────────────────────────────────┘ │
│                           ↕                             │
│ ┌────────────────────────────────────────────────────┐ │
│ │ INTEGRATION LAYER                                   │ │
│ │ ├─ SAP/ERP Connectors                              │ │
│ │ ├─ BIM Integration (IFC/BCF)                       │ │
│ │ ├─ IoT Edge Nodes (NVIDIA Jetson)                  │ │
│ │ ├─ Fleet Management Systems                        │ │
│ │ └─ Environmental Monitoring                        │ │
│ └────────────────────────────────────────────────────┘ │
│                           ↕                             │
│ ┌────────────────────────────────────────────────────┐ │
│ │ INFRASTRUCTURE LAYER                                │ │
│ │ ├─ Google Cloud Run (europe-north1)                │ │
│ │ ├─ Cloud Storage (Documents, Reports)              │ │
│ │ ├─ Cloud Functions (Serverless)                    │ │
│ │ ├─ Secret Manager (Credentials)                    │ │
│ │ └─ Cloud Monitoring & Logging                      │ │
│ └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- React Native (Mobile)
- Tailwind CSS
- Chart.js / D3.js (Visualizations)

**Backend:**
- Node.js 20+ (Runtime)
- Express.js (API Server)
- Python 3.11+ (ML/AI Services)
- Supabase (BaaS)

**AI/ML:**
- Groq API (LPU inference)
- OpenAI API (GPT-4)
- Anthropic API (Claude)
- Custom Lifetime World Model

**Database:**
- PostgreSQL 15+ (Supabase)
- Redis (Caching)
- Vector DB (Embeddings)

**Infrastructure:**
- Google Cloud Platform
- Docker containers
- Kubernetes (optional)
- CI/CD: GitHub Actions

---

## Installation & Deployment

### Prerequisites

#### System Requirements
```yaml
Minimum Requirements:
  - CPU: 4 cores (8 recommended)
  - RAM: 16 GB (32 GB recommended)
  - Storage: 100 GB SSD (500 GB recommended)
  - Network: 100 Mbps (1 Gbps recommended)

Software Requirements:
  - Node.js: 20.x or higher
  - Python: 3.11 or higher
  - PostgreSQL: 15.x or higher
  - Docker: 24.x or higher
  - Git: 2.40 or higher
```

#### Cloud Account Setup
1. **Google Cloud Platform:**
   - Project ID: `dws-iq6-production`
   - Region: `europe-north1` (Finland - GDPR compliant)
   - Billing account enabled
   - Required APIs enabled:
     - Cloud Run API
     - Cloud Storage API
     - Secret Manager API
     - Cloud Functions API
     - Cloud Monitoring API

2. **Supabase:**
   - Project created
   - Database initialized
   - API keys generated
   - Row Level Security (RLS) enabled

3. **AI Provider APIs:**
   - Groq API key
   - OpenAI API key
   - Anthropic API key

### Deployment Methods

#### Method 1: Google Cloud Run (Recommended)

**Step 1: Clone Repository**
```bash
git clone https://github.com/lifetime-oy/dws-iq6-platform.git
cd dws-iq6-platform
```

**Step 2: Configure Environment**
```bash
cp .env.example .env.production
nano .env.production
```

Required environment variables:
```bash
# Platform Configuration
NODE_ENV=production
PLATFORM_VERSION=6.0
DEPLOYMENT_REGION=europe-north1

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# AI Provider APIs
GROQ_API_KEY=your-groq-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# Google Cloud
GCP_PROJECT_ID=dws-iq6-production
GCP_REGION=europe-north1
GCP_STORAGE_BUCKET=dws-iq6-storage

# Security
JWT_SECRET=your-jwt-secret-min-32-chars
ENCRYPTION_KEY=your-encryption-key-32-chars

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

**Step 3: Setup Secrets in Google Secret Manager**
```bash
# Run the setup script
./deploy/setup-secrets-gcp.sh

# Or manually:
echo -n "your-supabase-service-key" | \
  gcloud secrets create supabase-service-key \
  --data-file=- \
  --replication-policy="automatic"
```

**Step 4: Deploy to Cloud Run**
```bash
# Build and deploy
./deploy/deploy-gcp.sh

# Or manually:
gcloud run deploy dws-iq6-platform \
  --source . \
  --region europe-north1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 10 \
  --timeout 300 \
  --set-secrets="SUPABASE_SERVICE_KEY=supabase-service-key:latest"
```

**Step 5: Verify Deployment**
```bash
# Get service URL
gcloud run services describe dws-iq6-platform \
  --region europe-north1 \
  --format='value(status.url)'

# Test health endpoint
curl https://your-service-url.run.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "6.0",
  "timestamp": "2025-12-31T10:00:00Z",
  "services": {
    "database": "connected",
    "ai_providers": "operational",
    "storage": "accessible"
  }
}
```

#### Method 2: Docker Compose (Development/Testing)

**Step 1: Start Services**
```bash
docker-compose up -d
```

**Step 2: Initialize Database**
```bash
docker-compose exec app npm run db:migrate
docker-compose exec app npm run db:seed
```

**Step 3: Access Platform**
- Web Dashboard: http://localhost:3000
- API: http://localhost:3001
- Supabase Studio: http://localhost:54323

#### Method 3: Kubernetes (Enterprise)

**Step 1: Create Namespace**
```bash
kubectl create namespace dws-iq6
```

**Step 2: Apply Configurations**
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
```

**Step 3: Verify Deployment**
```bash
kubectl get pods -n dws-iq6
kubectl get services -n dws-iq6
kubectl logs -f deployment/dws-iq6-platform -n dws-iq6
```

### Post-Deployment Configuration

#### 1. Database Initialization
```bash
# Run migrations
npm run db:migrate:production

# Seed initial data
npm run db:seed:production

# Create admin user
npm run create-admin -- --email admin@company.com --name "Admin User"
```

#### 2. Configure Fit for 55 Carbon Factors
```bash
# Import carbon factors database
npm run import-carbon-factors -- --source eu-epd-database

# Verify import
npm run verify-carbon-data
```

#### 3. Setup Monitoring
```bash
# Configure Cloud Monitoring
gcloud monitoring dashboards create --config-from-file=monitoring/dashboard.json

# Setup alerts
gcloud alpha monitoring policies create --notification-channels=EMAIL \
  --policy-from-file=monitoring/alerts.yaml
```

#### 4. Configure Backup
```bash
# Enable automated backups
gcloud sql instances patch dws-iq6-db \
  --backup-start-time=03:00 \
  --retained-backups-count=30
```

---

## Configuration Management

### Platform Configuration

#### Global Settings (`config/platform.yaml`)
```yaml
platform:
  name: "DWS IQ 6"
  version: "6.0"
  environment: "production"
  region: "europe-north1"
  
features:
  situation_room: true
  control_room: true
  firehorse_reports: true
  firehorse_cms: true
  firehorse_automation: true
  firehorse_omnichannel: true
  mobile_app: true
  
compliance:
  fit_for_55: true
  gdpr: true
  iso_27001: true
  
performance:
  cache_ttl: 300  # seconds
  api_timeout: 30  # seconds
  max_concurrent_requests: 1000
  rate_limit: 100  # requests per minute per user
  
carbon_tracking:
  enabled: true
  real_time: true
  life_cycle_stages: ["A1-A3", "A4", "A5", "B1-B7", "C1-C4", "D"]
  reporting_standard: "EN 15978"
```

#### Industry Configuration (`config/industries.yaml`)
```yaml
industries:
  - id: "construction"
    name: "Construction"
    enabled: true
    features:
      - "bim_integration"
      - "site_management"
      - "carbon_tracking"
    compliance:
      - "EN 15978"
      - "ISO 19650"
      
  - id: "logistics"
    name: "Logistics & Fleet"
    enabled: true
    features:
      - "fleet_tracking"
      - "route_optimization"
      - "fuel_monitoring"
    compliance:
      - "EN 15978"
      - "ISO 14001"
      
  # ... other industries
```

### User Roles & Permissions

#### Role Definitions (`config/roles.yaml`)
```yaml
roles:
  - name: "system_admin"
    description: "Full system access"
    permissions:
      - "admin:*"
      - "user:*"
      - "project:*"
      - "report:*"
      - "config:*"
      
  - name: "board_member"
    description: "Board of Directors"
    permissions:
      - "situation_room:board_view"
      - "report:executive"
      - "project:view_all"
      - "financial:view_all"
      
  - name: "cxo"
    description: "C-Level Executives"
    permissions:
      - "situation_room:cxo_view"
      - "report:executive"
      - "project:view_all"
      - "financial:view_all"
      - "user:manage_team"
      
  - name: "manager"
    description: "Project/Portfolio Manager"
    permissions:
      - "situation_room:manager_view"
      - "project:manage"
      - "report:create"
      - "team:manage"
      
  - name: "site_chief"
    description: "Site Manager"
    permissions:
      - "control_room:site_chief_view"
      - "site:manage"
      - "crew:manage"
      - "safety:manage"
      
  - name: "engineer"
    description: "Site/Project Engineer"
    permissions:
      - "control_room:engineer_view"
      - "technical:manage"
      - "quality:manage"
      - "bim:access"
      
  - name: "constructor"
    description: "Foreman/Lead Constructor"
    permissions:
      - "control_room:constructor_view"
      - "crew:view"
      - "work_order:execute"
      - "progress:update"
      
  - name: "contractor"
    description: "Subcontractor"
    permissions:
      - "control_room:contractor_view"
      - "contract:view_own"
      - "invoice:submit"
      - "rfi:submit"
```

### Integration Configuration

#### SAP/ERP Integration (`config/integrations/sap.yaml`)
```yaml
sap_integration:
  enabled: true
  connection:
    host: "sap.company.com"
    port: 443
    protocol: "https"
    auth_type: "oauth2"
    
  sync:
    enabled: true
    interval: "15m"  # 15 minutes
    modules:
      - "FI"  # Financial Accounting
      - "CO"  # Controlling
      - "MM"  # Materials Management
      - "PP"  # Production Planning
      - "PS"  # Project System
      
  mapping:
    project_id: "PS-PSPID"
    cost_center: "CO-KOSTL"
    wbs_element: "PS-POSID"
    material_number: "MM-MATNR"
```

---

## User Management

### Creating Users

#### Via Admin Dashboard
1. Navigate to **Admin → User Management**
2. Click **Create New User**
3. Fill in user details:
   - Email (required)
   - Full Name (required)
   - Role (select from dropdown)
   - Department
   - Phone number
4. Set initial password or send invitation email
5. Assign projects/sites (if applicable)
6. Click **Create User**

#### Via CLI
```bash
# Create admin user
npm run create-user -- \
  --email admin@company.com \
  --name "Admin User" \
  --role system_admin

# Create manager
npm run create-user -- \
  --email manager@company.com \
  --name "Project Manager" \
  --role manager \
  --projects "PRJ-001,PRJ-002"

# Bulk import from CSV
npm run import-users -- --file users.csv
```

CSV format:
```csv
email,name,role,department,phone
john.doe@company.com,John Doe,engineer,Engineering,+358401234567
jane.smith@company.com,Jane Smith,site_chief,Operations,+358401234568
```

### Managing User Roles

#### Assigning Roles
```sql
-- Via SQL (Supabase)
UPDATE auth.users
SET role = 'manager'
WHERE email = 'user@company.com';

-- Update user metadata
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data,
  '{role}',
  '"manager"'
)
WHERE email = 'user@company.com';
```

#### Role-Based Access Control (RBAC)
```javascript
// Check user permissions
async function checkPermission(userId, permission) {
  const { data: user } = await supabase
    .from('users')
    .select('role, permissions')
    .eq('id', userId)
    .single();
    
  return user.permissions.includes(permission);
}

// Usage
if (await checkPermission(userId, 'project:manage')) {
  // Allow access
}
```

### User Authentication

#### SSO Configuration (OAuth2/SAML)
```yaml
# config/auth/sso.yaml
sso:
  enabled: true
  provider: "azure_ad"  # or "okta", "google", "saml"
  
  azure_ad:
    tenant_id: "your-tenant-id"
    client_id: "your-client-id"
    client_secret: "your-client-secret"
    redirect_uri: "https://your-domain.com/auth/callback"
    
  settings:
    auto_provision: true  # Auto-create users on first login
    default_role: "user"
    sync_groups: true  # Sync AD groups to roles
```

#### Multi-Factor Authentication (MFA)
```bash
# Enable MFA for all users
npm run enable-mfa -- --all

# Enable MFA for specific role
npm run enable-mfa -- --role system_admin

# Disable MFA for user (emergency)
npm run disable-mfa -- --email user@company.com
```

### Session Management

#### Session Configuration
```yaml
# config/auth/sessions.yaml
sessions:
  timeout: 3600  # 1 hour
  refresh_token_lifetime: 2592000  # 30 days
  max_concurrent_sessions: 3
  remember_me: true
  remember_me_duration: 604800  # 7 days
```

#### Active Session Monitoring
```sql
-- View active sessions
SELECT 
  u.email,
  s.created_at,
  s.last_activity,
  s.ip_address,
  s.user_agent
FROM auth.sessions s
JOIN auth.users u ON s.user_id = u.id
WHERE s.expires_at > NOW()
ORDER BY s.last_activity DESC;

-- Terminate user sessions
DELETE FROM auth.sessions
WHERE user_id = 'user-uuid';
```

---

## Security Administration

### Security Best Practices

#### 1. Network Security
```yaml
# Firewall rules (GCP)
firewall_rules:
  - name: "allow-https"
    direction: "INGRESS"
    priority: 1000
    source_ranges: ["0.0.0.0/0"]
    allowed:
      - protocol: "tcp"
        ports: ["443"]
        
  - name: "allow-internal"
    direction: "INGRESS"
    priority: 1000
    source_ranges: ["10.0.0.0/8"]
    allowed:
      - protocol: "tcp"
        ports: ["5432", "6379"]
```

#### 2. Data Encryption
```yaml
encryption:
  at_rest:
    enabled: true
    algorithm: "AES-256-GCM"
    key_rotation: 90  # days
    
  in_transit:
    tls_version: "1.3"
    cipher_suites:
      - "TLS_AES_256_GCM_SHA384"
      - "TLS_CHACHA20_POLY1305_SHA256"
      
  database:
    column_encryption: true
    encrypted_columns:
      - "users.email"
      - "users.phone"
      - "projects.budget"
      - "carbon_data.emissions"
```

#### 3. API Security
```yaml
api_security:
  authentication:
    type: "JWT"
    algorithm: "RS256"
    expiry: 3600  # seconds
    
  rate_limiting:
    enabled: true
    window: 60  # seconds
    max_requests: 100
    
  cors:
    enabled: true
    allowed_origins:
      - "https://dws6.com"
      - "https://app.dws6.com"
    allowed_methods: ["GET", "POST", "PUT", "DELETE"]
    allowed_headers: ["Authorization", "Content-Type"]
    
  ip_whitelist:
    enabled: false  # Enable for production
    allowed_ips: []
```

### Audit Logging

#### Enable Audit Logs
```sql
-- Create audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create audit trigger
CREATE OR REPLACE FUNCTION audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    changes
  ) VALUES (
    current_setting('app.user_id')::UUID,
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

#### Query Audit Logs
```sql
-- View recent admin actions
SELECT 
  u.email,
  a.action,
  a.resource_type,
  a.created_at
FROM audit_logs a
JOIN auth.users u ON a.user_id = u.id
WHERE u.role = 'system_admin'
ORDER BY a.created_at DESC
LIMIT 100;

-- Export audit logs for compliance
COPY (
  SELECT * FROM audit_logs
  WHERE created_at >= '2025-01-01'
) TO '/tmp/audit_logs_2025.csv' CSV HEADER;
```

### Security Monitoring

#### Setup Security Alerts
```yaml
# config/security/alerts.yaml
security_alerts:
  - name: "failed_login_attempts"
    condition: "failed_logins > 5 in 10 minutes"
    action: "lock_account"
    notify: ["security@company.com"]
    
  - name: "suspicious_api_activity"
    condition: "api_requests > 1000 in 1 minute"
    action: "rate_limit"
    notify: ["security@company.com"]
    
  - name: "unauthorized_access_attempt"
    condition: "permission_denied"
    action: "log_and_alert"
    notify: ["security@company.com"]
```

---

## Database Administration

### Database Schema

#### Core Tables
```sql
-- Users and Authentication
auth.users
auth.sessions
auth.refresh_tokens

-- Projects
projects
project_members
project_phases
project_milestones

-- Carbon Tracking (EN 15978)
carbon_factors
project_carbon
carbon_budget
carbon_reports

-- Reports
reports
report_templates
report_schedules

-- Audit and Logs
audit_logs
system_logs
error_logs
```

### Database Maintenance

#### Daily Maintenance Tasks
```bash
#!/bin/bash
# daily-maintenance.sh

# Vacuum analyze
psql -c "VACUUM ANALYZE;"

# Update statistics
psql -c "ANALYZE;"

# Reindex if needed
psql -c "REINDEX DATABASE dws_iq6;"

# Check for bloat
psql -f scripts/check-bloat.sql

# Backup
pg_dump dws_iq6 | gzip > /backups/daily/dws_iq6_$(date +%Y%m%d).sql.gz
```

#### Weekly Maintenance Tasks
```bash
#!/bin/bash
# weekly-maintenance.sh

# Full vacuum
psql -c "VACUUM FULL;"

# Check for missing indexes
psql -f scripts/check-missing-indexes.sql

# Optimize queries
psql -f scripts/optimize-queries.sql

# Archive old logs
psql -c "DELETE FROM system_logs WHERE created_at < NOW() - INTERVAL '90 days';"
```

### Database Backup

#### Automated Backup Configuration
```yaml
# config/backup.yaml
backup:
  schedule:
    daily:
      enabled: true
      time: "03:00"
      retention: 30  # days
      
    weekly:
      enabled: true
      day: "Sunday"
      time: "02:00"
      retention: 12  # weeks
      
    monthly:
      enabled: true
      day: 1
      time: "01:00"
      retention: 12  # months
      
  storage:
    type: "gcs"  # Google Cloud Storage
    bucket: "dws-iq6-backups"
    encryption: true
    
  verification:
    enabled: true
    test_restore: true
    notify_on_failure: true
```

#### Manual Backup
```bash
# Full database backup
pg_dump -h localhost -U postgres -d dws_iq6 \
  -F c -b -v -f /backups/dws_iq6_$(date +%Y%m%d_%H%M%S).backup

# Schema only
pg_dump -h localhost -U postgres -d dws_iq6 \
  --schema-only -f /backups/schema_$(date +%Y%m%d).sql

# Data only
pg_dump -h localhost -U postgres -d dws_iq6 \
  --data-only -f /backups/data_$(date +%Y%m%d).sql

# Specific table
pg_dump -h localhost -U postgres -d dws_iq6 \
  -t projects -f /backups/projects_$(date +%Y%m%d).sql
```

### Database Recovery

#### Point-in-Time Recovery
```bash
# Restore to specific timestamp
pg_restore -h localhost -U postgres -d dws_iq6 \
  --clean --if-exists \
  /backups/dws_iq6_20251231.backup

# Restore specific table
pg_restore -h localhost -U postgres -d dws_iq6 \
  -t projects \
  /backups/dws_iq6_20251231.backup
```

---

## Monitoring & Maintenance

### System Monitoring

#### Key Metrics to Monitor
```yaml
metrics:
  system:
    - cpu_usage
    - memory_usage
    - disk_usage
    - network_throughput
    
  application:
    - request_rate
    - response_time
    - error_rate
    - active_users
    
  database:
    - connection_count
    - query_performance
    - cache_hit_ratio
    - replication_lag
    
  ai_services:
    - groq_api_latency
    - openai_api_latency
    - inference_time
    - token_usage
```

#### Monitoring Dashboard
```bash
# Access Cloud Monitoring
gcloud monitoring dashboards list

# View metrics
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_count"'
```

### Performance Monitoring

#### Application Performance Monitoring (APM)
```javascript
// Configure Sentry APM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new Sentry.Integrations.Postgres(),
  ],
});
```

### Health Checks

#### Endpoint Configuration
```javascript
// Health check endpoint
app.get('/health', async (req, res) => {
  const health = {
    status: 'healthy',
    version: process.env.PLATFORM_VERSION,
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabase(),
      ai_providers: await checkAIProviders(),
      storage: await checkStorage(),
      cache: await checkCache(),
    },
  };
  
  const allHealthy = Object.values(health.services)
    .every(status => status === 'connected');
    
  res.status(allHealthy ? 200 : 503).json(health);
});
```

---

## Troubleshooting

### Common Issues

#### Issue 1: High Memory Usage
**Symptoms:**
- Application slow or unresponsive
- Out of memory errors

**Diagnosis:**
```bash
# Check memory usage
docker stats

# Check Node.js heap
node --max-old-space-size=4096 app.js

# Analyze memory leaks
npm install -g clinic
clinic doctor -- node app.js
```

**Resolution:**
1. Increase memory allocation
2. Optimize queries
3. Implement caching
4. Review code for memory leaks

#### Issue 2: Database Connection Pool Exhausted
**Symptoms:**
- "Too many connections" error
- Slow query performance

**Diagnosis:**
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- View connection details
SELECT * FROM pg_stat_activity 
WHERE state = 'active';
```

**Resolution:**
```javascript
// Increase pool size
const pool = new Pool({
  max: 50,  // Increase from default 10
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

#### Issue 3: AI API Rate Limiting
**Symptoms:**
- 429 errors from AI providers
- Slow AI responses

**Diagnosis:**
```bash
# Check API usage
npm run check-api-usage

# View rate limit status
curl -H "Authorization: Bearer $GROQ_API_KEY" \
  https://api.groq.com/v1/rate_limits
```

**Resolution:**
1. Implement request queuing
2. Add caching for common queries
3. Upgrade API tier
4. Distribute load across providers

### Log Analysis

#### View Logs
```bash
# Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision" \
  --limit 100 \
  --format json

# Application logs
tail -f /var/log/dws-iq6/app.log

# Error logs only
grep "ERROR" /var/log/dws-iq6/app.log | tail -n 50
```

#### Log Aggregation
```bash
# Export logs to BigQuery
gcloud logging sinks create dws-iq6-logs \
  bigquery.googleapis.com/projects/PROJECT_ID/datasets/logs \
  --log-filter='resource.type="cloud_run_revision"'
```

---

## API Administration

### API Documentation

API documentation is available at:
- Production: `https://api.dws6.com/docs`
- Staging: `https://api-staging.dws6.com/docs`

### API Key Management

#### Create API Key
```bash
# Generate API key
npm run create-api-key -- \
  --name "Integration API Key" \
  --permissions "read:projects,write:carbon_data" \
  --expires "2026-12-31"
```

#### Rotate API Keys
```bash
# Rotate all keys
npm run rotate-api-keys

# Rotate specific key
npm run rotate-api-key -- --key-id abc123
```

### API Rate Limiting

```yaml
# config/api/rate-limits.yaml
rate_limits:
  default:
    window: 60  # seconds
    max_requests: 100
    
  by_role:
    system_admin: 1000
    cxo: 500
    manager: 200
    user: 100
    
  by_endpoint:
    "/api/carbon/calculate":
      window: 60
      max_requests: 50
    "/api/reports/generate":
      window: 60
      max_requests: 10
```

---

## Integration Management

### SAP/ERP Integration

#### Configuration
```yaml
# config/integrations/sap.yaml
sap:
  enabled: true
  host: "sap.company.com"
  port: 443
  client: "100"
  system_number: "00"
  
  auth:
    type: "oauth2"
    client_id: "your-client-id"
    client_secret: "your-client-secret"
    
  sync:
    interval: "15m"
    batch_size: 1000
    
  modules:
    FI:  # Financial Accounting
      enabled: true
      tables: ["BKPF", "BSEG"]
    CO:  # Controlling
      enabled: true
      tables: ["COEP", "COSS"]
    PS:  # Project System
      enabled: true
      tables: ["PROJ", "PRPS"]
```

#### Monitoring Integration
```bash
# Check integration status
npm run check-integration -- --name sap

# View sync logs
npm run view-sync-logs -- --integration sap --hours 24

# Force sync
npm run force-sync -- --integration sap
```

### BIM Integration

#### IFC/BCF Configuration
```yaml
# config/integrations/bim.yaml
bim:
  enabled: true
  formats:
    - "IFC 4.3"
    - "BCF 2.1"
    
  storage:
    type: "gcs"
    bucket: "dws-iq6-bim-models"
    
  processing:
    auto_extract_quantities: true
    auto_calculate_carbon: true
    clash_detection: true
```

---

## Performance Optimization

### Caching Strategy

```yaml
# config/cache.yaml
cache:
  enabled: true
  provider: "redis"
  
  redis:
    host: "redis.company.com"
    port: 6379
    db: 0
    password: "your-password"
    
  ttl:
    default: 300  # 5 minutes
    projects: 600  # 10 minutes
    carbon_factors: 3600  # 1 hour
    reports: 1800  # 30 minutes
    
  strategies:
    - type: "read-through"
      enabled: true
    - type: "write-through"
      enabled: true
    - type: "cache-aside"
      enabled: false
```

### Database Optimization

```sql
-- Create indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_carbon_project_id ON project_carbon(project_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Optimize queries
EXPLAIN ANALYZE
SELECT * FROM projects WHERE status = 'active';
```

---

## Compliance & Audit

### Fit for 55 Compliance

#### Carbon Data Validation
```bash
# Validate carbon data
npm run validate-carbon-data

# Generate compliance report
npm run generate-compliance-report -- --standard "EN 15978"

# Export for audit
npm run export-audit-data -- --year 2025 --format pdf
```

### GDPR Compliance

#### Data Subject Rights
```bash
# Export user data (Right to Access)
npm run export-user-data -- --email user@company.com

# Delete user data (Right to Erasure)
npm run delete-user-data -- --email user@company.com --confirm

# Anonymize user data
npm run anonymize-user-data -- --email user@company.com
```

---

## Appendices

### Appendix A: Environment Variables Reference

Complete list of environment variables in `ENVIRONMENT_VARIABLES.md`

### Appendix B: Database Schema

Complete database schema in `DATABASE_SCHEMA.md`

### Appendix C: API Reference

Complete API documentation in `API_REFERENCE.md`

### Appendix D: Troubleshooting Guide

Detailed troubleshooting guide in `TROUBLESHOOTING.md`

### Appendix E: Security Checklist

Security audit checklist in `SECURITY_CHECKLIST.md`

---

## Support & Contact

**Technical Support:**
- Email: support@dws6.com
- Phone: +358 XX XXX XXXX
- Portal: https://support.dws6.com

**Emergency Contact:**
- 24/7 Hotline: +358 XX XXX XXXX
- Email: emergency@dws6.com

**Documentation:**
- Online Docs: https://docs.dws6.com
- GitHub: https://github.com/lifetime-oy/dws-iq6

---

**Document Version:** 6.0  
**Last Updated:** December 31, 2025  
**Next Review:** March 31, 2026  
**Classification:** Confidential  
**Owner:** DWS IQ 6 Platform Team

# DWS IQ 6 Platform - Administrator Manual

**Version:** 6.2
**Document Date:** January 22, 2026
**Classification:** Confidential - For System Administrators Only
**Platform:** DWS IQ 6 - Industrial Intelligence Platform
**Compliance:** Fit for 55, GDPR, ISO 27001

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 6.0 | 2025-12-31 | DWS IQ Platform Team | Initial V6 Administrator Manual |
| 6.1 | 2026-01-04 | DWS IQ Platform Team | Added Appendix K: LLM Training Infrastructure |
| 6.2 | 2026-01-22 | DWS IQ Platform Team | Added Dashboard V9 (React + TypeScript + AI SDK) documentation |

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

### Dashboard V9 - Climate Intelligence Interface

**Status:** ✅ Production-Ready (January 2026)
**Location:** `/dashboard/firehorse/v9-react/`
**Documentation:** Field Note #2026-01-22

**Overview:**
Dashboard V9 is the modern React + TypeScript implementation of the DWS IQ climate intelligence dashboard, featuring integrated AI assistance and voice interaction capabilities.

**Tech Stack:**
- React 18.3.1 + TypeScript 5.6.2
- Vite 6.0.5 (Build tool)
- Vercel AI SDK 4.1.10 (AI streaming)
- Anthropic Claude Sonnet 4 (AI provider)
- Supabase (Real-time database)
- Tailwind CSS 3.4.17 (Styling)
- Web Speech API (Voice input)
- Speech Synthesis API (Text-to-speech)

**Key Features:**
1. **Real-time Portfolio Metrics**
   - SPI (Schedule Performance Index)
   - CPI (Cost Performance Index)
   - Carbon tracking (EN 15978 methodology)
   - Compliance monitoring (CSRD, EPBD, ETS, CBAM)

2. **AI Climate Assistant**
   - Streaming chat with Claude Sonnet 4
   - Tool calling for:
     - Carbon calculations
     - Compliance checks
     - Report generation
   - Natural language queries

3. **Voice Interaction**
   - Speech-to-text input (Web Speech API)
   - Text-to-speech output (hands-free operation)
   - Multi-language support
   - Browser compatibility: Chrome, Edge, Safari

4. **Project Management**
   - RAG status indicators (Red/Amber/Green)
   - Real-time Supabase updates
   - Export capabilities
   - Mobile-responsive design

**Performance:**
- Bundle size: ~70KB gzipped
- Initial load: ~1.2s
- Time to Interactive: ~1.5s
- First AI token: 200-400ms
- Voice input latency: ~200ms

**Deployment:**
```bash
# Build for production
cd /home/user/dws6/dws6.com/dashboard/firehorse/v9-react
npm install
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=dws-iq-dashboard-v9

# Or deploy to Google Cloud Storage (gcloud storage replaces the deprecated gsutil)
gcloud storage rsync -r dist/ gs://dws-iq-dashboard-v9/
```

**Environment Configuration:**
```bash
# Required environment variables
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

**Administrator Tasks:**
1. **Setup:** Configure Supabase connection and Anthropic API key
2. **User Access:** Manage dashboard access via Supabase RLS policies
3. **Monitoring:** Track AI API usage and costs
4. **Updates:** Deploy new versions via CI/CD pipeline
5. **Backups:** Ensure Supabase automated backups are enabled

**Browser Compatibility Matrix:**
| Feature | Chrome 120+ | Edge 120+ | Safari 17+ | Firefox 120+ |
|---------|-------------|-----------|------------|--------------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| AI Chat | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ✅ | ✅ | ❌ |
| Text-to-Speech | ✅ | ✅ | ✅ | ✅ |

**Migration from V8:**
- V8 (vanilla JavaScript) is deprecated
- V9 provides feature parity plus AI capabilities
- Database schema remains compatible
- Users can access both during transition period
- Full migration timeline: Q1 2026

**Support & Documentation:**
- README: `/dashboard/firehorse/v9-react/README.md`
- Field Note: `/docs/field-notes/2026-01-22-dashboard-v9-technical-stack.md`
- Evaluation: `/docs/evaluation/typescript-react-ai-sdk-evaluation.md`

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

### Tools

#### db_push (Supabase migrations)

Push migrations to the linked Supabase project (ref: `kpucuwwfhuwurdxyjjtz`):

```powershell
pwsh -File scripts/db_push.ps1
# Or: npm run db:push
# Skip link if already linked: pwsh -File scripts/db_push.ps1 -SkipLink
```

#### Supabase MCP

MCP server at `mcp-servers/supabase/server.py` (port 8766). Provides AI tools: `query_carbon_calculations`, `log_agent_activity`, `query_compliance`. Configure in `.env.mcp`.

#### Supabase Skills (Cursor)

For AI-assisted database operations: MCP tool descriptors in `mcps/<server>/tools/`. See `ADMIN_MANUAL_SUPABASE_EN_v1.md`.

---

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

### Appendix F: AI Provider API Configuration

#### Groq API Setup

**API Endpoint:** `https://api.groq.com/openai/v1/chat/completions`

**Required Network Configuration:**

If using a VPN with split tunneling (e.g., ProtonVPN), you must add the following Groq API server IPs to the split tunnel exclusion list:

| IP Address | Purpose |
|------------|---------|
| `172.64.149.20` | Groq API server |
| `104.18.38.236` | Groq API server |

**Note:** These IPs may change. To get current IPs, run:
```powershell
Resolve-DnsName api.groq.com
```

**Available Models:**
- `llama-3.3-70b-versatile` (recommended)
- `llama-3.1-8b-instant`
- `mixtral-8x7b-32768`
- `gemma2-9b-it`

**Test Command:**
```powershell
$body = @{
    model = "llama-3.3-70b-versatile"
    messages = @(@{ role = "user"; content = "Hello" })
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "https://api.groq.com/openai/v1/chat/completions" -Method Post -Headers @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $env:GROQ_API_KEY"
} -Body $body
```

#### Anthropic API Setup

**API Endpoint:** `https://api.anthropic.com/v1/messages`

**No special network configuration required.**

**Available Models:**
- `claude-sonnet-4-20250514` (recommended)
- `claude-3-5-haiku-20241022`
- `claude-3-opus-20240229`

**Test Command:**
```powershell
$body = @{
    model = "claude-sonnet-4-20250514"
    max_tokens = 1024
    messages = @(@{ role = "user"; content = "Hello" })
} | ConvertTo-Json -Depth 3

Invoke-RestMethod -Uri "https://api.anthropic.com/v1/messages" -Method Post -Headers @{
    "x-api-key" = $env:ANTHROPIC_API_KEY
    "anthropic-version" = "2023-06-01"
    "content-type" = "application/json"
} -Body $body
```

### Appendix G: Firehorse API & Integration Administration

#### Overview

**Firehorse Apps** are add-on applications that extend the DWS IQ 6 Platform. All Firehorse API keys are issued and managed through **dws6.com**.

**Status:** 🚧 *Under Development* - API key management portal coming soon.

#### Firehorse Apps Suite

| App | Description | Integration Type |
|-----|-------------|------------------|
| **Firehorse Reports** | Automated report generation | REST API |
| **Firehorse ContentMS** | Content management system | REST API + Webhooks |
| **Firehorse Automation** | Workflow automation engine | REST API + Events |
| **Firehorse Omnichannel** | Multi-channel communication | REST API + Webhooks |
| **Firehorse Mobile** | Field data collection | REST API + Sync |

#### Proposed: Firehorse Admin Portal

**URL:** `https://dws6.com/admin/firehorse` *(planned)*

##### 1. API Key Management

```
┌─────────────────────────────────────────────────────────────┐
│ FIREHORSE API KEY MANAGEMENT                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ API Keys                                    [+ New]  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Name          │ Scope       │ Created    │ Actions  │   │
│  │───────────────┼─────────────┼────────────┼──────────│   │
│  │ Production    │ All Apps    │ 2026-01-01 │ ⚙️ 🗑️    │   │
│  │ Reports Only  │ Reports     │ 2026-01-02 │ ⚙️ 🗑️    │   │
│  │ Mobile Sync   │ Mobile      │ 2026-01-03 │ ⚙️ 🗑️    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**API Key Features:**
- **Scoped access** - Limit keys to specific Firehorse apps
- **Rate limiting** - Configurable requests per minute/hour
- **IP allowlisting** - Restrict key usage to specific IPs
- **Expiration dates** - Auto-expire keys for security
- **Usage analytics** - Track API calls per key
- **Audit logging** - Full history of key creation/rotation

##### 2. Integration Hub

```
┌─────────────────────────────────────────────────────────────┐
│ INTEGRATION HUB                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Available Integrations:                                    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     SAP      │  │   Procore    │  │   Autodesk   │      │
│  │   ERP/S4H    │  │  Construction│  │     BIM      │      │
│  │  [Connect]   │  │  [Connect]   │  │  [Connect]   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Salesforce │  │   HubSpot    │  │   Custom     │      │
│  │     CRM      │  │   Marketing  │  │   Webhook    │      │
│  │  [Connect]   │  │  [Connect]   │  │  [Configure] │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Integration Features:**
- **Pre-built connectors** - SAP, Procore, Autodesk, Salesforce, HubSpot
- **Custom webhooks** - Send/receive events to any endpoint
- **OAuth 2.0 flows** - Secure third-party authentication
- **Data mapping** - Visual field mapping interface
- **Sync scheduling** - Real-time, hourly, daily sync options
- **Error handling** - Retry policies and failure notifications

##### 3. API Endpoints (Planned)

**Base URL:** `https://api.dws6.com/v1`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/token` | POST | Generate access token |
| `/firehorse/reports` | GET/POST | Reports API |
| `/firehorse/content` | GET/POST | ContentMS API |
| `/firehorse/automation` | GET/POST | Automation API |
| `/firehorse/omnichannel` | GET/POST | Omnichannel API |
| `/integrations` | GET | List active integrations |
| `/webhooks` | GET/POST | Manage webhooks |

##### 4. Environment Configuration

```bash
# ============================================================================
# FIREHORSE INTEGRATION CONFIGURATION
# ============================================================================
# API keys issued at: https://dws6.com/admin/firehorse
# ============================================================================

FIREHORSE_API_URL=https://api.dws6.com/v1
FIREHORSE_API_KEY=fh_live_xxxxxxxxxxxxxxxxxxxx

# Optional: Restrict to specific apps
FIREHORSE_ENABLED_APPS=reports,contentms,automation,omnichannel,mobile

# Optional: Webhook configuration
FIREHORSE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx
FIREHORSE_WEBHOOK_ENDPOINT=https://your-app.com/webhooks/firehorse
```

##### 5. Implementation Roadmap

| Phase | Feature | Target |
|-------|---------|--------|
| **Phase 1** | API key generation & management | Q1 2026 |
| **Phase 2** | Scoped access & rate limiting | Q1 2026 |
| **Phase 3** | Integration Hub (SAP, Procore) | Q2 2026 |
| **Phase 4** | Custom webhooks & OAuth | Q2 2026 |
| **Phase 5** | Usage analytics & billing | Q3 2026 |

##### 6. Security Requirements

- All API keys prefixed with `fh_live_` (production) or `fh_test_` (sandbox)
- Keys stored hashed (bcrypt) - only shown once at creation
- Mandatory HTTPS for all API calls
- JWT tokens with 1-hour expiration for session-based access
- Webhook payloads signed with HMAC-SHA256

### Appendix H: Groq MCP Connectors for Google Workspace

#### Overview

Groq provides **beta MCP Connectors** for Google Workspace, enabling AI agents to interact with Gmail, Google Calendar, and Google Drive via the Responses API - no self-hosted MCP server required.

**Status:** 🧪 *Beta* - Available on GroqCloud

**Documentation:** [console.groq.com/docs/tool-use/remote-mcp/connectors](https://console.groq.com/docs/tool-use/remote-mcp/connectors)

#### Available Connectors

| Connector | Capabilities | OAuth Scope |
|-----------|--------------|-------------|
| **Gmail** | Read, search, send emails | `gmail.readonly`, `gmail.send` |
| **Google Calendar** | View/create events, check availability | `calendar.readonly`, `calendar.events` |
| **Google Drive** | Search, access, organize files | `drive.readonly`, `drive.file` |

#### Authentication Setup

1. **Create OAuth 2.0 Credentials** in Google Cloud Console
2. **Configure consent screen** with required scopes
3. **Store tokens securely** in Secret Manager or `.env`

```bash
# ============================================================================
# GROQ MCP CONNECTORS - GOOGLE WORKSPACE
# ============================================================================
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx

# Google OAuth (for MCP Connectors)
GOOGLE_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
GOOGLE_REFRESH_TOKEN=1//xxxxxxxxxxxx
```

#### Firehorse Integration Plan

##### Phase 1: Firehorse Omnichannel (Marketing)

| Use Case | Connector | Implementation |
|----------|-----------|----------------|
| **Lead Inbox Monitoring** | Gmail | AI scans inbox for prospect emails, extracts intent, scores leads |
| **Auto-Response Drafts** | Gmail | Generate personalized reply drafts using LLM |
| **Campaign Tracking** | Gmail | Analyze email thread sentiment and engagement |
| **Asset Delivery** | Drive | Auto-attach relevant collateral from Drive |

**Workflow Example:**
```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ New Email   │────▶│ Groq + Gmail │────▶│ Lead Scored &   │
│ (Prospect)  │     │ Connector    │     │ Categorized     │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                  │
                    ┌──────────────┐              ▼
                    │ Groq LLM     │◀──── Generate Response
                    │ (llama-3.3)  │      Draft
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ CRM Update   │
                    │ (Salesforce) │
                    └──────────────┘
```

##### Phase 2: Firehorse Automation (Sales)

| Use Case | Connector | Implementation |
|----------|-----------|----------------|
| **Meeting Scheduler** | Calendar | AI checks availability, proposes times, sends invites |
| **Follow-up Engine** | Gmail + Calendar | Auto-schedule follow-ups after meetings |
| **Proposal Builder** | Drive | Pull templates, personalize with AI, save drafts |
| **Deal Room Setup** | Drive | Create shared folders for prospects |

**Workflow Example:**
```
┌─────────────┐     ┌────────────────┐     ┌─────────────────┐
│ Sales Rep   │────▶│ "Schedule demo │────▶│ Groq + Calendar │
│ Request     │     │  with Acme Co" │     │ Connector       │
└─────────────┘     └────────────────┘     └────────┬────────┘
                                                    │
                           ┌────────────────────────┘
                           ▼
                    ┌──────────────┐
                    │ Check Avail. │
                    │ Both Parties │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Send Invite  │
                    │ + Agenda     │
                    └──────────────┘
```

##### Phase 3: Firehorse ContentMS

| Use Case | Connector | Implementation |
|----------|-----------|----------------|
| **Asset Sync** | Drive | Bi-directional sync with marketing Drive folders |
| **Version Control** | Drive | Track document revisions, notify on updates |
| **Content Search** | Drive | AI-powered semantic search across all assets |
| **Template Library** | Drive | Centralized template management |

#### Implementation Timeline

| Phase | Feature | Firehorse App | Target |
|-------|---------|---------------|--------|
| **1.1** | Gmail lead monitoring | Omnichannel | Q1 2026 |
| **1.2** | Auto-response drafts | Omnichannel | Q1 2026 |
| **2.1** | Calendar meeting scheduler | Automation | Q2 2026 |
| **2.2** | Proposal builder (Drive) | Automation | Q2 2026 |
| **3.1** | Drive asset sync | ContentMS | Q2 2026 |
| **3.2** | Semantic content search | ContentMS | Q3 2026 |

#### Network Requirements

If using VPN with split tunneling, ensure Groq API IPs are accessible (see Appendix F).

### Appendix I: Google Merchant Center Integration

#### Overview

**Google Merchant Center Next** enables product data management for Google Shopping, Performance Max campaigns, and Buy on Google.

**API:** Merchant API (successor to Content API for Shopping)

**Documentation:** [developers.google.com/merchant/api](https://developers.google.com/merchant/api/overview)

#### Use Cases for Firehorse

| App | Use Case | Benefit |
|-----|----------|---------|
| **Firehorse Omnichannel** | Product feed sync | Automated product listings on Google Shopping |
| **Firehorse Automation** | Inventory updates | Real-time stock level sync |
| **Firehorse ContentMS** | Product content | Manage descriptions, images, pricing |
| **Firehorse Reports** | Performance analytics | Shopping campaign ROI reporting |

#### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ FIREHORSE + GOOGLE MERCHANT CENTER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────┐         ┌──────────────────────────────┐ │
│  │ Firehorse        │         │ Google Merchant Center       │ │
│  │ ContentMS        │────────▶│ ├─ Products                  │ │
│  │ (Product Data)   │   API   │ ├─ Inventory                 │ │
│  └──────────────────┘         │ ├─ Promotions                │ │
│                               │ └─ Local Inventory           │ │
│  ┌──────────────────┐         └──────────────┬───────────────┘ │
│  │ Firehorse        │                        │                  │
│  │ Automation       │◀───────────────────────┘                  │
│  │ (Sync Engine)    │    Webhooks / Polling                    │
│  └──────────────────┘                                           │
│                               ┌──────────────────────────────┐ │
│  ┌──────────────────┐         │ Google Ads                   │ │
│  │ Firehorse        │◀────────│ ├─ Shopping Campaigns        │ │
│  │ Reports          │  Stats  │ ├─ Performance Max           │ │
│  │ (Analytics)      │         │ └─ Free Listings             │ │
│  └──────────────────┘         └──────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

#### Merchant API Endpoints

| Resource | Method | Description |
|----------|--------|-------------|
| `accounts/{account}/products` | GET/POST | Manage product listings |
| `accounts/{account}/productInputs` | POST | Submit product data |
| `accounts/{account}/inventories` | GET/PATCH | Update stock levels |
| `accounts/{account}/promotions` | GET/POST | Manage promotions |
| `accounts/{account}/reports` | POST | Generate performance reports |

#### Environment Configuration

```bash
# ============================================================================
# GOOGLE MERCHANT CENTER INTEGRATION
# ============================================================================
GOOGLE_MERCHANT_ID=123456789
GOOGLE_MERCHANT_API_VERSION=v1beta

# Service Account (recommended for server-to-server)
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=/secrets/merchant-service-account.json

# Or OAuth (for user-context operations)
GOOGLE_MERCHANT_CLIENT_ID=xxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_MERCHANT_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
GOOGLE_MERCHANT_REFRESH_TOKEN=1//xxxxxxxxxxxx
```

#### Implementation Plan

| Phase | Feature | Description | Target |
|-------|---------|-------------|--------|
| **1** | Account Setup | Create Merchant Center account, configure API access | Q1 2026 |
| **2** | Product Sync | ContentMS → Merchant Center product feed | Q1 2026 |
| **3** | Inventory Sync | Real-time stock updates via Automation | Q2 2026 |
| **4** | Promotion Engine | Automated promotion creation | Q2 2026 |
| **5** | Performance Reports | Shopping analytics in Firehorse Reports | Q3 2026 |

#### Data Mapping

| Firehorse Field | Merchant Center Field | Required |
|-----------------|----------------------|----------|
| `product.sku` | `offerId` | ✅ Yes |
| `product.title` | `title` | ✅ Yes |
| `product.description` | `description` | ✅ Yes |
| `product.price` | `price.value` | ✅ Yes |
| `product.currency` | `price.currency` | ✅ Yes |
| `product.url` | `link` | ✅ Yes |
| `product.imageUrl` | `imageLink` | ✅ Yes |
| `product.availability` | `availability` | ✅ Yes |
| `product.brand` | `brand` | Recommended |
| `product.gtin` | `gtin` | Recommended |
| `product.category` | `googleProductCategory` | Recommended |

#### Security & Compliance

- **Service Account** recommended for automated sync (no user interaction)
- **OAuth 2.0** for admin portal access
- All credentials stored in **Secret Manager**
- Audit logging for all product/inventory changes
- GDPR: No personal data in product feeds

### Appendix J: Combined Integration Roadmap (Marketing & Sales)

#### Q1 2026 - Foundation

| Week | Deliverable | Apps |
|------|-------------|------|
| 1-2 | Groq MCP Connector setup (Gmail) | Omnichannel |
| 3-4 | Lead inbox monitoring MVP | Omnichannel |
| 5-6 | Google Merchant Center account + API | ContentMS |
| 7-8 | Product feed sync MVP | ContentMS, Automation |

#### Q2 2026 - Expansion

| Week | Deliverable | Apps |
|------|-------------|------|
| 1-2 | Calendar connector (meeting scheduler) | Automation |
| 3-4 | Drive connector (proposals, assets) | ContentMS |
| 5-6 | Inventory sync with Merchant Center | Automation |
| 7-8 | Promotion automation | Omnichannel |

#### Q3 2026 - Analytics & Optimization

| Week | Deliverable | Apps |
|------|-------------|------|
| 1-2 | Shopping campaign analytics | Reports |
| 3-4 | Semantic content search (Drive) | ContentMS |
| 5-6 | Cross-channel attribution | Reports |
| 7-8 | AI-powered optimization recommendations | All |

#### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Lead response time | < 1 hour | Gmail → CRM timestamp |
| Meeting scheduling time | < 5 min | Request → invite sent |
| Product feed accuracy | > 99% | Merchant Center diagnostics |
| Inventory sync latency | < 15 min | Stock change → MC update |

### Appendix K: LLM Training Infrastructure (Lifetime World Model)

#### Overview

The **Lifetime World Model** is a climate-intelligent LLM custom-trained for industrial carbon compliance. This appendix documents the hybrid training infrastructure combining local GPU clusters with cloud burst capacity.

**IaC Location:** `infrastructure/llm-training/`

#### Architecture: Hybrid Training Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 HYBRID TRAINING ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LOCAL CLUSTER (2x Acer Veriton GN-100)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • NVIDIA GB10 Superchip (Blackwell + Grace, 128GB unified memory)  │   │
│  │  • Fine-tuning: 7B-13B models (full), 70B models (LoRA/QLoRA)       │   │
│  │  • Dataset preprocessing & validation                                │   │
│  │  • Hyperparameter sweeps, model quantization                         │   │
│  │  • Cost: ~€0.50/hr (electricity only)                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                              │
│                              ▼ sync-to-gcp.ps1                             │
│                    ┌─────────────────────────────────┐                     │
│                    │     Google Cloud Storage        │                     │
│                    │   lifetime-llm-checkpoints      │                     │
│                    └─────────────────────────────────┘                     │
│                              │                                              │
│                              ▼ terraform apply                             │
│  CLOUD BURST (GCP A3 Mega)                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • 8x NVIDIA H100 80GB per node                                      │   │
│  │  • Full 70B fine-tuning, distributed training at scale               │   │
│  │  • Cost: ~€35/hr on-demand, ~€14/hr spot                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Strategy Comparison: Hybrid vs Fully Cloud

| Factor | Hybrid | Fully Cloud | Recommendation |
|--------|--------|-------------|----------------|
| **70B Total Cost** | €26-43K | €31-53K | ✅ Hybrid |
| **Dev Iteration Speed** | Fast (local) | Medium | ✅ Hybrid |
| **Ops Complexity** | Higher | Lower | ⚠️ Cloud |
| **Data Privacy** | Better | Cloud-only | ✅ Hybrid |
| **GPU Availability** | Guaranteed | Quota risk | ✅ Hybrid |

**Recommendation:** Hybrid strategy for Lifetime World (40-60% cost savings)

#### Local Training Infrastructure

**File:** `infrastructure/llm-training/local/docker-compose.training.yml`

**Services:**
| Service | Port | Purpose |
|---------|------|---------|
| `training-orchestrator` | 8890 | PyTorch training container |
| `dataset-processor` | - | Dataset preprocessing |
| `mlflow` | 5000 | Experiment tracking |
| `jupyter` | 8888 | Interactive development |
| `vllm` | 8000 | Inference testing |
| `quantizer` | - | Model compression |

**Quick Start:**
```powershell
# Navigate to local infrastructure
cd infrastructure/llm-training/local

# Start services
docker-compose -f docker-compose.training.yml up -d

# Access Jupyter
# http://localhost:8888 (token: lifetime2026)

# Access MLflow
# http://localhost:5000
```

#### Google Cloud Burst Infrastructure

**File:** `infrastructure/llm-training/gcp-burst/main.tf`

**Resources Created:**
- VPC network with training subnet
- Firewall rules (SSH via IAP, NCCL)
- GCS buckets (checkpoints, datasets)
- Secret Manager secrets
- Service account with roles
- A3 Mega compute instances

**Quick Start:**
```bash
cd infrastructure/llm-training/gcp-burst

# Configure
cp training.tfvars.example training.tfvars

# Set credentials
export TF_VAR_hf_token="hf_xxxxx"

# Deploy
terraform init
terraform apply -var-file="training.tfvars"

# SSH to node
gcloud compute ssh lifetime-llm-training-node-0 \
  --zone=europe-north1-a --tunnel-through-iap

# IMPORTANT: Destroy when done
terraform destroy -var-file="training.tfvars"
```

#### Cost Estimates

##### Training Infrastructure

| Scenario | Infrastructure | Duration | Cost |
|----------|---------------|----------|------|
| Local LoRA (7B) | 2x GN-100 | 24 hrs | ~€12 |
| Local LoRA (70B) | 2x GN-100 | 72 hrs | ~€36 |
| Cloud Full (70B) | 1x A3 Mega on-demand | 72 hrs | ~€2,520 |
| Cloud Full (70B) | 1x A3 Mega spot | 72 hrs | ~€1,008 |

##### Complete 70B Project

| Phase | Hybrid | Fully Cloud |
|-------|--------|-------------|
| Dataset prep | €24 (local) | €500 |
| Hyperparameter search | €12 (local) | €2,000 |
| Final training | €2,520 (cloud) | €2,520 |
| Quantization & eval | €12 (local) | €200 |
| **Total** | **~€2,570** | **~€5,220** |

#### Groq Integration: Inference Only

**Important:** Groq LPU is optimized for **inference**, not training.

##### Groq Role in Lifetime World

```
Training (GN-100/GCP)  →  Fine-tuned Model  →  Groq Cloud (Inference)
         │                      │                      │
    Your hardware          Your weights          Ultra-fast API
    Your data              Your IP               ~500 tok/s
```

##### Groq Inference Pricing (vs Training Alternatives)

| Provider | Use Case | 70B Cost (per 1M tokens) |
|----------|----------|--------------------------|
| **Groq** | Inference | $0.59 input / $0.79 output |
| OpenAI | Inference | $2.50 input / $10.00 output |
| Anthropic | Inference | $3.00 input / $15.00 output |
| **GCP A3** | Training | ~€35/hr (not per-token) |
| **Local GN-100** | Training | ~€0.50/hr (electricity) |

##### When to Use Groq

| ✅ Use Groq | ❌ Don't Use Groq |
|------------|-------------------|
| Production inference API | Model training |
| Low-latency applications | Fine-tuning |
| Cost-sensitive inference | Dataset processing |
| Scaling inference load | Hyperparameter search |

##### Recommended Workflow with Groq

1. **Train locally** (GN-100) for fine-tuning experiments
2. **Burst to cloud** (GCP A3) for final 70B training
3. **Quantize model** (AWQ/GPTQ) for efficient inference
4. **Deploy to Groq** for production inference (50-90% cheaper than OpenAI)
5. **Fallback to vLLM** on local cluster for sensitive data

#### Training Scripts

**Location:** `infrastructure/llm-training/scripts/`

| Script | Purpose |
|--------|---------|
| `train-70b-lora.py` | LoRA/QLoRA fine-tuning for 70B models |
| `quantize.py` | Convert models to GGUF/AWQ/GPTQ |
| `sync-to-gcp.ps1` | Sync checkpoints to GCS |

**Example: 70B LoRA Training**
```bash
python train-70b-lora.py \
  --model meta-llama/Llama-3.3-70B-Instruct \
  --dataset /datasets/climate-compliance.jsonl \
  --output-dir /checkpoints/lifetime-70b-lora \
  --epochs 3 \
  --lora-r 64
```

**Example: Model Quantization**
```bash
python quantize.py \
  --model /checkpoints/lifetime-70b-lora/final \
  --format gguf \
  --bits 4
```

#### Model Size Feasibility

| Model Size | Local (GN-100) | Cloud (A3 Mega) | Recommended |
|------------|----------------|-----------------|-------------|
| 7B | ✅ Full fine-tune | ✅ Full fine-tune | Local |
| 13B | ✅ Full fine-tune | ✅ Full fine-tune | Local |
| 30B | ⚠️ QLoRA only | ✅ Full fine-tune | Hybrid |
| 70B | ⚠️ QLoRA only | ✅ Full fine-tune | Hybrid |
| 405B+ | ❌ Not feasible | ⚠️ Multi-node | Cloud only |
| 800B+ | ❌ Not feasible | ❌ Requires 64+ H100 | Partnership |

#### Security & Compliance

- **Credentials:** Google Secret Manager (cloud), `.env.training` (local)
- **Data Region:** `europe-north1` (Finland) - GDPR compliant
- **Model Ownership:** Full IP retained - your weights, your model
- **Audit Logging:** MLflow for all training experiments
- **Network:** IAP-only SSH access, internal NCCL traffic

#### Implementation Timeline

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 1 | Local setup | Docker Compose + Jupyter running |
| 2 | 7B experiments | Initial fine-tuning validated |
| 3 | 70B LoRA (local) | QLoRA training on GN-100 |
| 4 | GCP burst | Full 70B training on A3 Mega |
| 5 | Quantization | GGUF + AWQ models ready |
| 6 | Groq deployment | Inference API operational |

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

## Appendix H: E-Commerce Plugin Integration Guide

This appendix provides guidance on integrating Revolut payment processing with e-commerce platforms used by DWS IQ 6 customers across the 16 regulated industries.

### H.1 Platform Selection Matrix

DWS IQ 6 customers span enterprise manufacturers, construction firms, logistics operators, and agricultural cooperatives. Their e-commerce needs vary significantly:

| Platform | Market Share | Best For | Priority |
|----------|-------------|----------|----------|
| **WooCommerce** | 43% globally | SMEs, Construction subcontractors, Agriculture, Food processing | ⭐⭐⭐⭐⭐ Primary |
| **Adobe Commerce (Magento)** | Enterprise leader | Large manufacturers, B2B catalogs, SAP integration | ⭐⭐⭐⭐⭐ Primary |
| **Shopify** | 28% globally | DTC brands, Food & Beverage retail | ⭐⭐⭐⭐ Secondary |
| **PrestaShop** | EU stronghold | French/Spanish/Polish markets, EU VAT compliance | ⭐⭐⭐⭐ Secondary |
| **BigCommerce** | B2B focused | Complex B2B pricing, wholesale | ⭐⭐⭐ Optional |
| **OpenCart** | Lightweight | Simple SME catalogs | ⭐⭐ Optional |

### H.2 Industry-to-Platform Mapping

| Industry Tier | Typical Platforms | Revolut Plugin Priority |
|---------------|-------------------|------------------------|
| **Tier 1: Critical Industries** | | |
| Power & Heat Generation | Adobe Commerce, Custom | Adobe Commerce |
| Iron & Steel Production | Adobe Commerce, SAP Commerce | Adobe Commerce |
| Cement & Lime Production | WooCommerce, Adobe Commerce | Both |
| Chemicals & Petrochemicals | Adobe Commerce | Adobe Commerce |
| Aviation | Custom, Shopify Plus | Shopify |
| Maritime Shipping | Custom | — |
| Road Transport & Logistics | WooCommerce, Shopify | WooCommerce |
| Construction & Buildings | WooCommerce, Adobe Commerce | WooCommerce |
| **Tier 2: Important Industries** | | |
| Agriculture & Livestock | WooCommerce, PrestaShop | WooCommerce + PrestaShop |
| Waste Management | WooCommerce | WooCommerce |
| Aluminium Production | Adobe Commerce | Adobe Commerce |
| Pulp, Paper & Printing | WooCommerce, Adobe Commerce | Both |
| Petroleum Refining | Custom | — |
| Food & Beverage Processing | Shopify, WooCommerce | Shopify + WooCommerce |
| Glass & Ceramics | WooCommerce | WooCommerce |
| Mining & Quarrying | WooCommerce, OpenCart | WooCommerce |

### H.3 WooCommerce + Revolut Integration

WooCommerce is WordPress-based and serves the largest share of SME customers in construction, agriculture, and manufacturing supply chains.

#### Installation

1. **Download Plugin:**
   - Navigate to WordPress Admin → Plugins → Add New
   - Search for "Revolut Gateway for WooCommerce"
   - Install and Activate

2. **Configure API Keys:**
   ```
   WooCommerce → Settings → Payments → Revolut
   
   Production API Key: sk_live_xxxxxxxx
   Sandbox API Key:    sk_sandbox_xxxxxxxx
   Webhook Secret:     whsec_xxxxxxxx
   ```

3. **Webhook Configuration:**
   - Revolut Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourstore.com/wc-api/revolut_webhook`
   - Events: `ORDER_COMPLETED`, `ORDER_FAILED`, `ORDER_CANCELLED`

4. **Test Transaction:**
   - Enable Sandbox mode
   - Process test order with card: `4929 0000 0005 5555`
   - Verify webhook receipt in WooCommerce logs

#### Firehorse Integration Points

```yaml
# firehorse-woocommerce-config.yaml
integration:
  platform: woocommerce
  webhook_endpoint: /api/firehorse/woocommerce
  
events:
  - order.completed:
      action: create_compliance_record
      extract:
        - customer_email
        - order_total
        - product_skus
        - carbon_data  # Custom WooCommerce field
  
  - subscription.renewed:
      action: extend_license
      
carbon_tracking:
  enabled: true
  product_meta_field: _carbon_footprint_kg
  report_to: firehorse-reports
```

### H.4 Adobe Commerce (Magento) + Revolut Integration

Adobe Commerce serves enterprise customers with complex B2B requirements, ERP integration, and high transaction volumes.

#### Installation

1. **Composer Installation:**
   ```bash
   composer require revolut/magento2-payment-gateway
   bin/magento module:enable Revolut_Payment
   bin/magento setup:upgrade
   bin/magento cache:clean
   ```

2. **Admin Configuration:**
   ```
   Stores → Configuration → Sales → Payment Methods → Revolut
   
   Enabled: Yes
   Mode: Production
   Merchant Public Key: pk_live_xxxxxxxx
   API Secret Key: sk_live_xxxxxxxx
   Webhook Signing Secret: whsec_xxxxxxxx
   ```

3. **B2B Features:**
   - Enable "Pay on Account" for approved business customers
   - Configure credit limits per company account
   - Set up payment terms (Net 30, Net 60)

#### SAP Integration for Enterprise

```python
# firehorse-magento-sap-bridge.py
"""
Bridge Magento orders to SAP for enterprise customers.
Triggered by Revolut payment confirmation webhook.
"""

from firehorse.integrations import MagentoClient, SAPClient

async def process_order_paid(order_id: str):
    # Fetch order from Magento
    magento = MagentoClient()
    order = await magento.get_order(order_id)
    
    # Create SAP sales order
    sap = SAPClient()
    sap_order = await sap.create_sales_order({
        "customer_id": order.customer.sap_id,
        "items": [
            {
                "material": item.sku,
                "quantity": item.qty,
                "price": item.price,
                "carbon_kg": item.carbon_footprint  # DWS IQ field
            }
            for item in order.items
        ],
        "payment_reference": order.payment.revolut_id
    })
    
    # Log to DWS IQ for carbon tracking
    await firehorse.log_transaction(
        order_id=order_id,
        sap_reference=sap_order.id,
        carbon_total_kg=sum(i.carbon_footprint for i in order.items)
    )
```

### H.5 Shopify + Revolut Integration

Shopify is popular with Food & Beverage brands and DTC sustainability-focused companies.

#### Installation

1. **Shopify App Store:**
   - Go to Shopify Admin → Apps → Visit Shopify App Store
   - Search "Revolut Pay"
   - Install and authorize

2. **Configuration:**
   ```
   Settings → Payments → Revolut Pay
   
   - Connect Revolut Business account
   - Enable Revolut Pay button
   - Configure express checkout
   ```

3. **Checkout Customization:**
   - Add carbon footprint display in checkout
   - Enable subscription products for recurring compliance services

#### Carbon Tracking Metafields

```liquid
<!-- In product template -->
{% if product.metafields.sustainability.carbon_kg %}
  <div class="carbon-badge">
    <span class="carbon-value">{{ product.metafields.sustainability.carbon_kg }}kg CO₂</span>
    <span class="carbon-label">Carbon Footprint</span>
  </div>
{% endif %}
```

### H.6 PrestaShop + Revolut Integration

PrestaShop has strong EU adoption, particularly in France, Spain, and Poland - key markets for construction materials and manufacturing.

#### Installation

1. **Module Installation:**
   - Download from PrestaShop Addons or Revolut Developer Portal
   - Back Office → Modules → Upload Module
   - Install and Configure

2. **Configuration:**
   ```
   Modules → Payment → Revolut Gateway
   
   API Key: sk_live_xxxxxxxx
   Merchant ID: merchant_xxxxxxxx
   Environment: Production
   Enable Express Checkout: Yes
   ```

3. **Multi-Currency Setup (EU Compliance):**
   - Enable EUR, SEK, NOK, DKK, PLN
   - Configure automatic currency detection
   - Set up VAT handling per country

### H.7 Webhook Security Best Practices

All e-commerce integrations must verify webhook signatures:

```python
# firehorse/webhooks/revolut_verify.py
import hmac
import hashlib

def verify_revolut_signature(
    payload: bytes,
    signature: str,
    webhook_secret: str
) -> bool:
    """
    Verify Revolut webhook signature.
    
    Args:
        payload: Raw request body
        signature: X-Revolut-Signature header
        webhook_secret: From Revolut dashboard
    
    Returns:
        True if signature is valid
    """
    expected = hmac.new(
        webhook_secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected, signature)
```

### H.8 Implementation Checklist

For each customer e-commerce integration:

- [ ] **Platform Identification:** Confirm which e-commerce platform customer uses
- [ ] **Revolut Plugin Installation:** Install official Revolut plugin
- [ ] **API Key Configuration:** Set up production API keys from Revolut Business
- [ ] **Webhook Setup:** Configure webhooks to Firehorse endpoint
- [ ] **Signature Verification:** Implement HMAC signature validation
- [ ] **Carbon Tracking:** Add product carbon footprint fields if applicable
- [ ] **SAP/ERP Bridge:** Configure integration for enterprise customers
- [ ] **Testing:** Process sandbox transactions before go-live
- [ ] **Monitoring:** Set up payment failure alerts in Firehorse

### H.9 Support Resources

| Resource | URL |
|----------|-----|
| Revolut Business Developer Docs | https://developer.revolut.com/docs/business |
| WooCommerce Plugin Documentation | https://developer.revolut.com/docs/woocommerce |
| Adobe Commerce Integration Guide | https://developer.revolut.com/docs/magento |
| Shopify App Configuration | https://developer.revolut.com/docs/shopify |
| PrestaShop Module Guide | https://developer.revolut.com/docs/prestashop |
| Firehorse Integration Support | support@lifetime.fi |

---

## Appendix I: Google Merchant Center Integration

This appendix documents the Google Merchant Center integration for DWS IQ product listings in Google Shopping.

### I.1 Overview

Google Merchant Center enables:
- **Google Shopping Ads** — Products appear in Google search results
- **Price Comparison** — Customers compare your prices with competitors  
- **Buy on Google** — Direct checkout from Google (select markets)
- **Product Feeds** — Automated price and inventory updates

### I.2 Product Feed Architecture

```
dws10.com/
├── config/
│   └── products.json         ← Single source of truth (prices, descriptions)
├── feeds/
│   ├── google-products.xml   ← Google Merchant feed (auto-generated)
│   └── generate-feed.js      ← Feed generator script
└── buy/
    └── index.html            ← Store page (loads from products.json)
```

### I.2.1 Industry Landing Pages (Fit for 55 + CSRD & ESG)

The Gamma navigation routes to industry landing pages under the DWS10 site. Fit for 55 and CSRD & ESG are selected with the `?solution=` query parameter.

```
dws10.com/
├── construction/
├── logistics/
├── manufacturing/
├── energy/
├── healthcare/
├── real-estate/
├── lifetime-fleet/
├── public-sector/
├── financial-services/
├── mining/
├── shipbuilding/
└── waste/
```

**Examples:**
- `https://dws10.com/healthcare/?solution=fit55`
- `https://dws10.com/public-sector/?solution=csrd`

### I.2.2 Local Storage Policy (Non-Git Files)

For local operations, keep non-repository files outside Git and link them into the workspace as needed.

- **Non-Git working files** → `F:\Proton\My files\2026\dws6`
- **Customer/Investor/Media files** → `F:\Proton\My files\2026\DWSIQ6`
- The repository at `F:\2026\Repos2026\dws6` remains the backup workspace

On Windows, use junctions to make these available inside the repo without committing them. On macOS, use symlinks with the equivalent local paths.

**Key Principle:** All pricing flows from `products.json`. Update prices once, and:
1. Store page updates automatically
2. Checkout page uses latest prices
3. Google feed regenerates with new prices

### I.3 Product Configuration

Each product in `config/products.json` includes Google Merchant fields:

```json
{
  "id": "dwsiq-v6",
  "name": "DWS IQ Platform v6",
  "price": 4999,
  "currency": "EUR",
  "mpn": "DWSIQ-V6-2026",
  "google": {
    "productCategory": "Software > Business & Productivity Software",
    "condition": "new",
    "availability": "in_stock",
    "brand": "Lifetime",
    "targetCountry": "FI",
    "contentLanguage": "en"
  }
}
```

**Required Google Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| `id` | Unique product identifier | `dwsiq-v6` |
| `mpn` | Manufacturer Part Number | `DWSIQ-V6-2026` |
| `productCategory` | Google taxonomy category | `Software > Business...` |
| `condition` | Product condition | `new` |
| `availability` | Stock status | `in_stock` |
| `brand` | Brand name | `Lifetime` |

### I.4 Feed Generation

**Manual Generation:**

```bash
cd dws10.com/feeds
node generate-feed.cjs
```

**Automated (GitHub Actions):**

```yaml
# .github/workflows/update-merchant-feed.yml
name: Update Google Merchant Feed
on:
  push:
    paths:
      - 'dws10.com/config/products.json'
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM

jobs:
  generate-feed:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Generate feed
        run: |
          cd dws10.com/feeds
          node generate-feed.js
      - name: Commit and push
        run: |
          git config user.name "GitHub Action"
          git config user.email "action@github.com"
          git add dws10.com/feeds/google-products.xml
          git commit -m "Update Google Merchant feed" || exit 0
          git push
```

### I.5 Google Merchant Center Setup

1. **Create Merchant Account:**
   - Go to https://merchants.google.com
   - Sign in with Google account
   - Add business information (Lifetime Oy)

2. **Verify Website:**
   - Add meta tag or upload HTML file
   - Verify domain: `dws10.com`

3. **Add Product Feed:**
   - Products → Feeds → Add feed
   - Country: Finland (or target countries)
   - Language: English
   - Feed type: Scheduled fetch
   - URL: `https://dws10.com/feeds/google-products.xml`
   - Fetch schedule: Daily

4. **Link Google Ads:**
   - Settings → Linked accounts
   - Link your Google Ads account for Shopping campaigns

### I.6 Target Markets

Configure feeds for Nordic and European markets:

| Country | Language | Feed URL |
|---------|----------|----------|
| Finland | English | `/feeds/google-products.xml` |
| Sweden | English | `/feeds/google-products-se.xml` |
| Norway | English | `/feeds/google-products-no.xml` |
| Germany | German | `/feeds/google-products-de.xml` |

For multi-language feeds, extend `generate-feed.js` to create localized versions.

### I.7 Price Synchronization

When you update a price in `products.json`:

1. **Store & Checkout:** Automatically use new price (loaded at runtime)
2. **Google Feed:** Run `node generate-feed.js` or wait for scheduled update
3. **Revolut Links:** Create new payment link if price changed significantly

**Important:** Google requires prices to match between feed and landing page. Since both load from `products.json`, they stay synchronized.

### I.8 Monitoring & Diagnostics

In Google Merchant Center:

- **Diagnostics:** Check for feed errors, disapproved products
- **Products:** View active product listings
- **Performance:** Track clicks, impressions, conversions

Common issues:
- **Price mismatch:** Ensure feed matches landing page
- **Missing images:** Verify image URLs are accessible
- **Category errors:** Use valid Google product categories

### I.9 Support Resources

| Resource | URL |
|----------|-----|
| Google Merchant Center Help | https://support.google.com/merchants |
| Product Data Specification | https://support.google.com/merchants/answer/7052112 |
| Feed Diagnostics | https://merchants.google.com/mc/diagnostics |
| Google Shopping Policies | https://support.google.com/merchants/answer/6149970 |

---

**Document Version:** 6.3  
**Last Updated:** January 6, 2026  
**Next Review:** March 31, 2026  
**Classification:** Confidential  
**Owner:** DWS IQ 6 Platform Team

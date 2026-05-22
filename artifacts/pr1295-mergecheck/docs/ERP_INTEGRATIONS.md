# DWS IQ 6 - ERP Integration Guide

## Overview

DWS IQ 6 provides seamless integrations with leading Nordic and international ERP systems, enabling real-time synchronization between Physical AI/AIoT shop floor data and enterprise resource planning systems.

### Why ERP Integration?

**Bridging the Shop Floor and Back Office**: DWS acts as the "brain" for intelligent machines and robotics. Integration allows AI-driven insights from the shop floor (e.g., predicted maintenance, OEE improvements) to automatically update:
- Production schedules
- Material requirements planning (MRP)
- Actual cost vs. planned cost analysis
- Inventory transactions
- Work orders

**Nordic Market Focus**: Most innovative, mid-sized manufacturing firms in Sweden, Finland, and Norway use these ERP systems. For DWS to scale in "intelligent industries," plug-and-play connectors provide significant competitive advantage.

---

## Supported ERP Systems

### Tier 1: Must-Have Integrations

#### 1. Monitor ERP
**Market**: Nordic SME manufacturing market leader (especially Sweden)

**Key Features**:
- Production order synchronization
- Material requirements planning (MRP) integration
- Real-time shop floor data → ERP costing
- OEE metrics → production schedule updates
- Predictive maintenance → work order creation

**Configuration**:
```bash
MONITOR_ERP_ENABLED=true
MONITOR_ERP_API_URL=https://api.monitor.se
MONITOR_ERP_CLIENT_ID=your-client-id
MONITOR_ERP_CLIENT_SECRET=your-client-secret
MONITOR_ERP_COMPANY_ID=your-company-id
```

**Use Cases**:
- SME manufacturers with 50-500 employees
- Discrete manufacturing
- Metal fabrication, machinery, electronics

---

#### 2. IFS Cloud
**Market**: Asset-intensive and project-based manufacturing

**Key Features**:
- Asset lifecycle management
- Maintenance planning & execution
- Project costing & tracking
- Fleet management integration
- Equipment effectiveness tracking

**Configuration**:
```bash
IFS_ENABLED=true
IFS_INSTANCE_URL=https://your-instance.ifs.cloud
IFS_OAUTH_TOKEN_URL=https://your-instance.ifs.cloud/auth/realms/your-realm/protocol/openid-connect/token
IFS_CLIENT_ID=your-client-id
IFS_CLIENT_SECRET=your-client-secret
```

**Use Cases**:
- Energy sector (wind, solar, hydrogen)
- Heavy manufacturing
- Defense contractors
- Asset-intensive industries

---

#### 3. Microsoft Dynamics 365
**Market**: Most common cloud-first ERP in the Nordics

**Versions Supported**:
- Business Central (SME)
- Finance & Operations (Enterprise)

**Key Features**:
- Cloud-native integration
- Power Platform connectivity
- Production order management
- Manufacturing execution

**Configuration**:
```bash
DYNAMICS_365_ENABLED=true
DYNAMICS_365_ENVIRONMENT=org123.crm4.dynamics.com
DYNAMICS_365_TENANT_ID=your-tenant-id
DYNAMICS_365_CLIENT_ID=your-client-id
DYNAMICS_365_CLIENT_SECRET=your-client-secret
DYNAMICS_365_VERSION=business_central
```

**Use Cases**:
- Companies already in Microsoft ecosystem
- Cloud-first organizations
- Office 365 users

---

#### 4. SAP S/4HANA
**Market**: Enterprise manufacturing conglomerates

**Key Features**:
- OData v2/v4 support
- Production planning (PP) integration
- Plant maintenance (PM) integration
- Cost center accounting

**Configuration**:
```bash
SAP_ENABLED=true
SAP_API_URL=https://your-sap-system.com
SAP_USERNAME=your-username
SAP_PASSWORD=your-password
SAP_CLIENT=100
SAP_SYSTEM_ID=PRD
SAP_ODATA_VERSION=v2
```

**Use Cases**:
- Large industrial conglomerates
- Global manufacturing operations
- Forestry, pulp & paper
- Automotive suppliers

---

### Tier 2: Nordic Specialists

#### 5. Visma (Net/Enterprise)
**Market**: Norwegian and Finnish mid-market

**Configuration**:
```bash
VISMA_ENABLED=true
VISMA_API_URL=https://api.visma.net
VISMA_CLIENT_ID=your-client-id
VISMA_CLIENT_SECRET=your-client-secret
VISMA_COMPANY_ID=your-company-id
VISMA_PRODUCT=net
```

---

#### 6. Jeeves ERP
**Market**: Swedish manufacturing SMEs

**Configuration**:
```bash
JEEVES_ENABLED=true
JEEVES_API_URL=https://api.jeeves.se
JEEVES_API_KEY=your-api-key
JEEVES_DATABASE_NAME=your-database
```

---

## Integration Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DWS IQ 6 Platform                        │
│  ┌────────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │ Physical AI    │  │ Machine Data │  │ OEE Calculation   │   │
│  │ & Robotics     │→ │ Collection   │→ │ & Analytics       │   │
│  └────────────────┘  └──────────────┘  └───────────────────┘   │
│           │                  │                    │              │
│           ↓                  ↓                    ↓              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            ERP Integration Service                        │  │
│  │  - Approval Gate (human-in-loop validation)               │  │
│  │  - Data transformation & field mapping                    │  │
│  │  - Batch processing & retry logic                         │  │
│  │  - Scheduler (automated sync)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ↓                  ↓                  ↓
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │ Monitor  │      │   IFS    │      │   SAP    │
    │   ERP    │      │  Cloud   │      │ S/4HANA  │
    └──────────┘      └──────────┘      └──────────┘
```

### Synchronization Types

#### 1. **FROM ERP → DWS** (Pull)
- Production orders
- Material requirements
- Scheduled maintenance
- Work center availability

#### 2. **DWS → ERP** (Push)
- Machine data (runtime, status, counters)
- OEE metrics (availability, performance, quality)
- Predictive maintenance alerts
- Actual costs (energy, material consumption)
- Quality inspection results

#### 3. **Bidirectional**
- Work orders
- Inventory transactions
- Asset registry updates

---

## Approval Gate System

Inspired by **azure-agentic-infraops** sequential agent choreography with approval gates.

### Operation Risk Levels

| Risk Level | Auto-Approve | Examples | Approval Required |
|------------|--------------|----------|-------------------|
| **LOW** | ✅ Yes | Read operations, OEE metrics sync | No |
| **MEDIUM** | ⚠️ Optional | Single inventory transaction, maintenance event | Optional |
| **HIGH** | ❌ No | Production order modification, cost posting | Yes |
| **CRITICAL** | ❌ No | Mass data sync (>100 records), production schedule changes | Yes (dual approval) |

### Approval Workflow

```
┌────────────────────────────────────────────────────────────────┐
│ 1. OPERATION REQUESTED                                         │
│    - User or agent requests ERP sync                           │
│    - System assesses risk level                                │
└────────────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────────────┐
│ 2. VALIDATION                                                  │
│    - Preview data transformation                               │
│    - Estimate impact                                           │
│    - Check rollback capability                                 │
└────────────────────────────────────────────────────────────────┘
                          ↓
         ┌────────────────┴────────────────┐
         ↓                                  ↓
┌─────────────────┐              ┌──────────────────┐
│ LOW RISK        │              │ HIGH/CRITICAL    │
│ Auto-Approved   │              │ Manual Approval  │
└─────────────────┘              └──────────────────┘
         │                                  │
         │                        ┌─────────┴─────────┐
         │                        ↓                   ↓
         │                  ┌──────────┐       ┌──────────┐
         │                  │ APPROVED │       │ REJECTED │
         │                  └──────────┘       └──────────┘
         │                        │                   │
         └────────────────────────┘                   │
                          ↓                           ↓
         ┌────────────────────────────┐    ┌──────────────────┐
         │ 3. EXECUTION                │    │ OPERATION CANCELLED│
         │    - Sync to ERP            │    └──────────────────┘
         │    - Record results         │
         └────────────────────────────┘
                          ↓
         ┌────────────────────────────┐
         │ 4. VERIFICATION             │
         │    - Validate sync success  │
         │    - Log audit trail        │
         └────────────────────────────┘
```

### API Usage

**Request Approval**:
```typescript
POST /api/v1/erp/sync/production-orders
{
  "organizationId": "org-123",
  "provider": "monitor",
  "requestApproval": true
}

Response:
{
  "success": true,
  "data": {
    "approvalRequired": true,
    "approvalRequestId": "apr_1234567890_abc123",
    "status": "pending"
  }
}
```

**Approve Request**:
```typescript
POST /api/v1/erp/approvals/apr_1234567890_abc123/approve
{
  "userId": "user-456"
}
```

**Reject Request**:
```typescript
POST /api/v1/erp/approvals/apr_1234567890_abc123/reject
{
  "userId": "user-456",
  "reason": "Production schedule conflict - defer until Monday"
}
```

---

## Scheduled Synchronization

### Default Schedule

| Job | Frequency | Purpose |
|-----|-----------|---------|
| Production Orders Sync | Every 6 hours | Pull updated production schedules |
| Machine Data Sync | Every hour | Push real-time machine metrics |
| OEE Metrics Sync | Every 4 hours | Push calculated OEE data |
| Maintenance Sync | Daily at 02:00 | Bidirectional maintenance events |

### Configuration

```bash
# Enable scheduler
ERP_SCHEDULER_ENABLED=true

# Customize via cron expressions (if needed)
# Production orders: 0 */6 * * * (every 6 hours)
# Machine data: 0 * * * * (every hour)
# OEE metrics: 0 */4 * * * (every 4 hours)
# Maintenance: 0 2 * * * (daily at 02:00)
```

### Manual Trigger

```typescript
POST /api/v1/erp/sync/production-orders
{
  "organizationId": "org-123",
  "provider": "monitor",
  "since": "2026-01-17T00:00:00Z"
}
```

---

## API Endpoints

### Connection Management

- `POST /api/v1/erp/integrations/configure` - Configure integration
- `POST /api/v1/erp/integrations/:provider/test` - Test connection
- `GET /api/v1/erp/integrations/:organizationId` - Get all integrations

### Synchronization

- `POST /api/v1/erp/sync/production-orders` - Sync production orders
- `POST /api/v1/erp/sync/machine-data` - Push machine data
- `POST /api/v1/erp/sync/oee-metrics` - Push OEE metrics
- `POST /api/v1/erp/sync/maintenance` - Sync maintenance events

### Approval Management

- `GET /api/v1/erp/approvals/pending/:organizationId` - Get pending approvals
- `POST /api/v1/erp/approvals/:requestId/approve` - Approve request
- `POST /api/v1/erp/approvals/:requestId/reject` - Reject request
- `GET /api/v1/erp/approvals/:requestId` - Get approval details

### History & Monitoring

- `GET /api/v1/erp/sync/history/:organizationId` - Get sync history
- `POST /api/v1/erp/webhooks/:provider` - Webhook receiver

---

## ESG / Sustainability Integrations

### Worldfavor Integration

Submit carbon emissions and generate sustainability reports.

**Configuration**:
```bash
WORLDFAVOR_ENABLED=true
WORLDFAVOR_API_URL=https://api.worldfavor.com
WORLDFAVOR_API_KEY=your-api-key
WORLDFAVOR_ORGANIZATION_ID=your-org-id
```

**Use Case**:
- Convert Physical AI energy savings into verified carbon reports
- EU Green Deal compliance
- CSRD (Corporate Sustainability Reporting Directive) reporting

---

## Best Practices

### 1. **Start with Monitor ERP** (for Nordic SMEs)
- Easiest integration for most manufacturers
- Proven ROI in production efficiency
- Direct impact on MRP accuracy

### 2. **Use Approval Gates for Critical Operations**
- Always require approval for production schedule changes
- Auto-approve OEE metrics and machine data
- Dual approval for mass operations (>100 records)

### 3. **Field Mapping**
- Define clear mappings between DWS and ERP fields
- Document transformation logic
- Test with sample data before production

### 4. **Error Handling**
- All syncs include retry logic with exponential backoff
- Failed records are logged for manual review
- Partial sync completion is supported

### 5. **Security**
- Use OAuth where available (IFS, Dynamics 365, Monitor)
- Rotate API keys quarterly
- Never commit credentials to git
- Use environment variables for all secrets

---

## Troubleshooting

### Connection Failures

**Symptom**: `Failed to connect to {provider}`

**Solutions**:
1. Verify API credentials in `.env`
2. Check network connectivity to ERP system
3. Ensure firewall allows outbound HTTPS
4. Test connection: `POST /api/v1/erp/integrations/{provider}/test`

### Sync Failures

**Symptom**: `Sync operation failed`

**Solutions**:
1. Check sync history: `GET /api/v1/erp/sync/history/{organizationId}`
2. Review error messages in logs
3. Verify field mappings are correct
4. Check ERP system availability
5. Retry manually if transient error

### Approval Timeouts

**Symptom**: `Request {requestId} has expired`

**Solutions**:
1. Increase timeout: `ERP_APPROVAL_TIMEOUT_MINUTES=120`
2. Enable email/Slack notifications
3. Check pending approvals regularly

---

## Support

For integration issues, contact:
- **Technical Support**: support@lifetime.fi
- **Documentation**: https://docs.dws10.com
- **GitHub Issues**: https://github.com/blogtheristo/dws6/issues

---

## Roadmap

### Q1 2026
- ✅ Monitor ERP integration (COMPLETED)
- ✅ IFS Cloud integration (COMPLETED)
- ✅ Approval gate system (COMPLETED)

### Q2 2026
- 🔄 SAP S/4HANA production validation
- 🔄 Dynamics 365 Business Central testing
- 📋 Automated cost variance reporting

### Q3 2026
- 📋 PLM integration (SolidWorks, PTC Windchill)
- 📋 MES integration (Siemens Opcenter)
- 📋 Logistics/WMS (LogTrade, Unifaun)

### Q4 2026
- 📋 AI-powered field mapping suggestions
- 📋 Predictive sync scheduling
- 📋 Advanced ESG analytics

# V8 Dashboard - Exact Field Mapping & Implementation

## 📋 Complete Field Structure

### From V8 Code Analysis
Extracted from the V8 implementation files and integrated into the new dashboard.

---

## 🎯 Portfolio Cards (Top Header)

### Card 1: Portfolio SPI
```
Field: spi
Source: AVG(projects.spi)
Display: 0.94
Format: Numeric with 2 decimals
Type: Schedule Performance Index
```

### Card 2: Portfolio CPI
```
Field: cpi
Source: AVG(projects.cpi)
Display: 0.96
Format: Numeric with 2 decimals
Type: Cost Performance Index
```

### Card 3: Active Projects
```
Field: activeProjects
Source: COUNT(projects WHERE phase = 'Execution')
Display: 23
Format: Integer count
Type: Number of active projects
```

### Card 4: Budget at Risk
```
Field: budgetAtRisk
Source: SUM(projects.budget - projects.spent)
Display: $2.4M
Format: Currency formatted
Type: Total budget variance
```

---

## 📊 Project Card Fields

Each project displays:

| Field | Source | Format | Example |
|-------|--------|--------|---------|
| name | projects.name | TEXT | "HQ Expansion" |
| region | projects.region | TEXT | "Nordics" |
| phase | projects.phase | TEXT | "Execution" |
| safetyRag | projects.safety_rag | ENUM | "amber" |
| spi | projects.spi | NUMERIC(5,2) | 0.94 |
| cpi | projects.cpi | NUMERIC(5,2) | 0.96 |
| percentComplete | projects.percent_complete | INTEGER 0-100 | 58 |
| budget | projects.budget | BIGINT (in cents) | 500000000 |
| spent | projects.spent | BIGINT (in cents) | 350000000 |

### Visual Representation
```
┌─────────────────────────────────────────┐
│ HQ Expansion                        ◯    │ ← RAG Status
│ Nordics • Execution                      │ ← Region • Phase
├─────────────────────────────────────────┤
│ SPI: 0.94  │  CPI: 0.96  │  58% Complete│ ← Metrics
└─────────────────────────────────────────┘
```

---

## 🚨 Alert Card Fields

Each alert displays:

| Field | Source | Format | Example |
|-------|--------|--------|---------|
| id | alerts.id | UUID | 550e8400-e29b... |
| project | alerts.project | TEXT | "HQ Expansion" |
| message | alerts.message | TEXT | "Critical path slip..." |
| type | alerts.type | ENUM | "schedule" |
| severity | alerts.severity | ENUM | "red" |
| created_at | alerts.created_at | TIMESTAMPTZ | 2025-12-28 08:00:00 |
| ageHours | CALCULATED | INTEGER | 2 (hours ago) |

### Visual Representation
```
┌─────────────────────────────────────────┐
│ HQ Expansion                       2h ago │ ← Project Name, Age
├─────────────────────────────────────────┤
│ Critical path slip: Steel erection      │ ← Message
│ delayed by 5 days                       │
├─────────────────────────────────────────┤
│ [schedule]  [red]                       │ ← Type, Severity
└─────────────────────────────────────────┘
```

---

## 📐 Data Types & Validation

### Numeric Ranges
- **SPI/CPI**: 0.01 to 9.99 (NUMERIC(5,2))
- **Completion**: 0 to 100 (INTEGER with CHECK)
- **Budget/Spent**: 0 to 9,223,372,036,854,775,807 (BIGINT)

### Enum Values
- **Region**: "Nordics", "Continental", "Global", "EMEA", etc.
- **Phase**: "Planning", "Procurement", "Execution", "Close-out"
- **RAG Status**: "green" (on track), "amber" (at risk), "red" (critical)
- **Alert Type**: "schedule", "cost", "safety", "quality"
- **Alert Severity**: "green" (info), "yellow" (warning), "red" (critical)

### Text Fields
- **project.name**: 1-255 characters
- **alert.message**: 1-1000 characters
- **alert.project**: 1-255 characters (foreign key to projects.name)

---

## 🔄 Data Flow

```
┌──────────────┐
│  Supabase    │
│  PostgreSQL  │
└──────────────┘
       ↓
┌──────────────────────────────┐
│ SELECT AVG(spi), AVG(cpi),   │
│ COUNT(*), SUM(budget-spent)  │
│ FROM projects                │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ Calculate Portfolio Metrics  │
│ • Portfolio SPI = 0.96       │
│ • Portfolio CPI = 0.96       │
│ • Active = 5 projects        │
│ • Budget Risk = $29.5M       │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ Render Portfolio Cards       │
│ (Top of dashboard)           │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ Render Project Cards         │
│ (Main content area)          │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ Render Alert Cards           │
│ (Bottom section)             │
└──────────────────────────────┘
```

---

## 💾 Database Schema

### projects table
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  phase TEXT NOT NULL,
  spi NUMERIC(5,2),
  cpi NUMERIC(5,2),
  percent_complete INTEGER,
  safety_rag TEXT CHECK (value IN ('green','amber','red')),
  budget BIGINT,
  spent BIGINT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### alerts table
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  project TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (value IN ('schedule','cost','safety','quality')),
  severity TEXT CHECK (value IN ('green','yellow','red')),
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 📱 Frontend Calculation Logic

### Portfolio SPI Calculation
```javascript
const avgSpi = projects.reduce((sum, p) => sum + p.spi, 0) / projects.length;
// Example: (0.94 + 1.02 + 0.89 + 1.00 + 0.97) / 5 = 0.96
```

### Portfolio CPI Calculation
```javascript
const avgCpi = projects.reduce((sum, p) => sum + p.cpi, 0) / projects.length;
// Example: (0.96 + 0.98 + 0.91 + 1.00 + 0.95) / 5 = 0.96
```

### Active Projects Count
```javascript
const active = projects.filter(p => p.phase === 'Execution').length;
// Example: 3 projects in Execution phase
```

### Budget at Risk Calculation
```javascript
const budgetAtRisk = projects.reduce((sum, p) => sum + (p.budget - p.spent), 0);
// Example: (1.5M + 2.2M + 7M + 14.25M + 3.2M) = $29.5M total
```

### Alert Age Calculation
```javascript
const ageHours = Math.floor((Date.now() - new Date(alert.created_at)) / 3600000);
// Example: If created 2 hours ago = 2
```

---

## 🎨 V8 UI Elements Using Fields

### Color Coding (RAG Status)
- **safety_rag = 'green'** → Green circle ◯ (on track)
- **safety_rag = 'amber'** → Orange circle ◯ (at risk)
- **safety_rag = 'red'** → Red circle ◯ (critical)

### Value Coloring (Metrics)
- **spi >= 1.0 || cpi >= 1.0** → Green text (positive)
- **spi < 1.0 || cpi < 1.0** → Red text (negative)

### Format Examples
- **SPI 0.94** → Formatted as "0.94" (2 decimals)
- **CPI 0.96** → Formatted as "0.96" (2 decimals)
- **percent_complete 58** → Displayed as "58%"
- **budget 500000000 (cents)** → Displayed as "$5,000,000"
- **ageHours 2** → Displayed as "2h ago"

---

## 🔌 API Integration Points

### Fetch Projects
```javascript
const { data } = await supabase
  .from('projects')
  .select('*')
  .limit(10);
```

### Fetch Alerts
```javascript
const { data } = await supabase
  .from('alerts')
  .select('*')
  .limit(5)
  .order('created_at', { ascending: false });
```

### Subscribe to Changes (Real-time)
```javascript
supabase
  .from('projects')
  .on('*', payload => loadDashboard())
  .subscribe();
```

---

## ✅ Validation Rules

### Before Inserting Projects
- [ ] name is not empty
- [ ] region is valid
- [ ] phase is valid
- [ ] spi is between 0.01 and 9.99
- [ ] cpi is between 0.01 and 9.99
- [ ] percent_complete is 0-100
- [ ] safety_rag is 'green', 'amber', or 'red'
- [ ] budget >= 0
- [ ] spent >= 0
- [ ] spent <= budget

### Before Inserting Alerts
- [ ] project is not empty
- [ ] message is not empty
- [ ] type is valid
- [ ] severity is valid
- [ ] project_id matches existing project (if provided)

---

## 📊 Sample Data with All Fields

```json
{
  "projects": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "HQ Expansion",
      "region": "Nordics",
      "phase": "Execution",
      "spi": 0.94,
      "cpi": 0.96,
      "percent_complete": 58,
      "safety_rag": "amber",
      "budget": 500000000,
      "spent": 350000000,
      "created_at": "2025-11-01T08:00:00Z",
      "updated_at": "2025-12-28T08:00:00Z"
    }
  ],
  "alerts": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "project": "HQ Expansion",
      "message": "Critical path slip: Steel erection delayed by 5 days",
      "type": "schedule",
      "severity": "red",
      "project_id": "550e8400-e29b-41d4-a716-446655440000",
      "created_at": "2025-12-28T06:00:00Z",
      "updated_at": "2025-12-28T06:00:00Z"
    }
  ],
  "portfolio": {
    "spi": 0.96,
    "spiChange": "↓ 2.1% vs target",
    "cpi": 0.96,
    "cpiChange": "↓ 1.8% vs budget",
    "activeProjects": 5,
    "activeChange": "+2 this month",
    "budgetAtRisk": "$29.5M",
    "budgetChange": "2.8% of total"
  }
}
```

---

## 🚀 Implementation Checklist

- [x] Dashboard created with V8 field structure
- [x] Supabase integration implemented
- [x] All field mappings documented
- [x] Calculation logic implemented
- [x] Mock data fallback included
- [x] SQL schema provided
- [ ] Tables created in Supabase
- [ ] Sample data inserted
- [ ] Dashboard tested with real data
- [ ] Alerts configured
- [ ] Real-time subscriptions enabled

**Status**: Ready for Supabase table setup  
**Dashboard URL**: `http://localhost:8080/dashboard/dws-iq-v8-enhanced/`

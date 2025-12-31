# DWS IQ 6 Integration Guide
## Firehorse Reports - European Document Templates

**Version**: 1.0  
**Date**: December 30, 2025  
**Product**: Firehorse Reports (DWS IQ 6 Platform)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Flow](#data-flow)
4. [Integration Points](#integration-points)
5. [EN 15978 Carbon Tracking](#en-15978-carbon-tracking)
6. [Template Engine](#template-engine)
7. [Report Generation](#report-generation)
8. [API Reference](#api-reference)
9. [Implementation Steps](#implementation-steps)
10. [Testing & Validation](#testing--validation)

---

## Overview

### Purpose
This guide provides comprehensive instructions for integrating the European Construction Document Template Standards with the DWS IQ 6 platform, enabling automated generation of compliant reports with real-time carbon tracking.

### Key Features
- ✅ **Real-Time Data**: Live project data from DWS IQ 6 dashboard
- ✅ **Carbon Tracking**: EN 15978 life cycle assessment integration
- ✅ **Multi-Standard**: Support for Nordic and Central European standards
- ✅ **Automated Reports**: Scheduled and on-demand report generation
- ✅ **Compliance**: Fit for 55, EU Taxonomy, CSRD compliance

### System Components
1. **DWS IQ 6 Dashboard**: Real-time project monitoring
2. **Supabase**: Data storage and carbon tracking
3. **Firehorse CMS**: Content management and templates
4. **Firehorse Automation**: Report generation engine
5. **Site Edge Nodes**: Real-time site data collection

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DWS IQ 6 Platform                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │   V9 Dashboard│─────▶│  Supabase DB │                    │
│  │   (Frontend)  │      │   (Backend)  │                    │
│  └──────────────┘      └──────────────┘                    │
│         │                      │                             │
│         │                      │                             │
│         ▼                      ▼                             │
│  ┌──────────────────────────────────────┐                  │
│  │     Firehorse Reports Engine         │                  │
│  ├──────────────────────────────────────┤                  │
│  │  • Template Selection                │                  │
│  │  • Data Mapping                      │                  │
│  │  • Carbon Calculation (EN 15978)     │                  │
│  │  • Report Generation                 │                  │
│  │  • Compliance Validation             │                  │
│  └──────────────────────────────────────┘                  │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────────────────────┐                  │
│  │     Generated Reports                │                  │
│  ├──────────────────────────────────────┤                  │
│  │  • EN 15978 Carbon Reports           │                  │
│  │  • RT Cards (Finland)                │                  │
│  │  • VOB Contracts (Germany)           │                  │
│  │  • Client-Specific Reports           │                  │
│  └──────────────────────────────────────┘                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘

External Data Sources:
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  SAP PM      │    │  Portfolio   │    │ Edge Nodes   │
│  (Maint.)    │    │  (Projects)  │    │ (Site Data)  │
└──────────────┘    └──────────────┘    └──────────────┘
```

### Component Interactions

```javascript
// Data flow sequence
1. Dashboard → Fetch project data
2. Dashboard → Fetch carbon data (Supabase)
3. Template Engine → Select appropriate template
4. Data Mapper → Map dashboard data to template fields
5. Carbon Calculator → Calculate EN 15978 metrics
6. Report Generator → Render report
7. Storage → Save to Supabase
8. Distribution → Send to recipients
```

---

## Data Flow

### 1. Project Data Collection

**Source**: DWS IQ 6 Dashboard  
**Frequency**: Real-time  
**Data Points**:

```javascript
const projectData = {
  // Project identification
  id: "PROJECT-001",
  name: "Nordic Office Complex",
  location: "Helsinki, Finland",
  region: "Nordic",
  phase: "Construction",
  
  // Schedule metrics
  startDate: "2024-01-15",
  completionDate: "2026-06-30",
  percentComplete: 45.5,
  spi: 0.96, // Schedule Performance Index
  
  // Cost metrics
  budget: 25000000, // EUR
  actualCost: 11500000, // EUR
  cpi: 0.96, // Cost Performance Index
  budgetAtRisk: 2950000, // EUR
  
  // Quality metrics
  qualityRag: "Amber", // Red/Amber/Green
  qualityIssues: 3,
  
  // Safety metrics
  safetyRag: "Green",
  safetyIncidents: 0,
  
  // Alerts
  alerts: [
    {
      type: "quality",
      severity: "medium",
      message: "Concrete strength test below specification",
      ageHours: 24
    }
  ]
};
```

### 2. Carbon Data Collection

**Source**: Supabase (carbon_factors, project_carbon tables)  
**Frequency**: Real-time with daily aggregation  
**Data Points**:

```javascript
const carbonData = {
  // Project carbon budget
  projectId: "PROJECT-001",
  targetCarbon: 4500000, // kg CO2-eq
  targetIntensity: 450, // kg CO2-eq/m²
  currentCarbon: 2025000, // kg CO2-eq
  currentIntensity: 202.5, // kg CO2-eq/m²
  budgetUtilization: 45.0, // %
  budgetStatus: "On Track",
  
  // Life cycle breakdown (EN 15978)
  lifeCycleStages: {
    A1_A3: { // Product stage
      carbon: 1250000,
      percentage: 61.7
    },
    A4: { // Transport to site
      carbon: 85000,
      percentage: 4.2
    },
    A5: { // Construction process
      carbon: 120000,
      percentage: 5.9
    },
    B6: { // Operational energy (projected)
      carbon: 450000,
      percentage: 22.2
    },
    C1_C4: { // End of life
      carbon: 120000,
      percentage: 5.9
    },
    D: { // Benefits
      carbon: -50000,
      percentage: -2.5
    }
  },
  
  // Material breakdown
  materials: [
    {
      name: "Concrete C30/37",
      quantity: 4500,
      unit: "m³",
      carbonFactor: 310.5,
      totalCarbon: 1397250
    },
    {
      name: "Reinforcing Steel",
      quantity: 450,
      unit: "tonnes",
      carbonFactor: 2100.0,
      totalCarbon: 945000
    }
    // ... more materials
  ],
  
  // Compliance
  fitFor55Compliant: true,
  euTaxonomyAligned: true,
  lastUpdated: "2025-12-30T10:30:00Z"
};
```

### 3. Site Edge Node Data

**Source**: 27 Site Edge Nodes  
**Frequency**: Real-time (15-minute intervals)  
**Data Points**:

```javascript
const edgeNodeData = {
  // Energy monitoring (for B6 operational carbon)
  energyConsumption: {
    electricity: 12500, // kWh (current month)
    heating: 8500, // kWh
    cooling: 3200 // kWh
  },
  
  // Equipment usage (for A5 construction carbon)
  equipmentUsage: [
    {
      equipment: "Tower Crane",
      hoursUsed: 180,
      fuelConsumption: 450, // liters diesel
      carbonEmission: 1215 // kg CO2-eq
    }
    // ... more equipment
  ],
  
  // Material deliveries (for A4 transport carbon)
  deliveries: [
    {
      material: "Concrete",
      quantity: 50,
      unit: "m³",
      distance: 25, // km
      transportMode: "Truck",
      carbonEmission: 125 // kg CO2-eq
    }
    // ... more deliveries
  ]
};
```

---

## Integration Points

### 1. DWS IQ 6 Dashboard Integration

**Endpoint**: `https://dws6.com/dashboard/v9/`  
**Authentication**: Supabase Auth  
**Data Access**: REST API + Real-time subscriptions

#### JavaScript Integration

```javascript
// Initialize DWS IQ 6 client
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);

// Fetch project data
async function fetchProjectData(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      alerts(*),
      kpis(*)
    `)
    .eq('id', projectId)
    .single();
  
  if (error) throw error;
  return data;
}

// Subscribe to real-time updates
const subscription = supabase
  .channel('project-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'projects',
    filter: `id=eq.${projectId}`
  }, (payload) => {
    console.log('Project updated:', payload);
    // Trigger report regeneration if needed
  })
  .subscribe();
```

### 2. Carbon Tracking Integration

**Tables**: `carbon_factors`, `project_carbon`, `carbon_budget`  
**Calculation Engine**: EN 15978 compliant

#### Carbon Calculation Example

```javascript
// Calculate carbon emissions for a material
async function calculateMaterialCarbon(projectId, material) {
  // 1. Get carbon factor from database
  const { data: carbonFactor } = await supabase
    .from('carbon_factors')
    .select('gwp_a1a3, unit')
    .eq('material_name', material.name)
    .eq('region', 'Nordic')
    .single();
  
  // 2. Calculate emission
  const emission = material.quantity * carbonFactor.gwp_a1a3;
  
  // 3. Store in project_carbon
  const { data, error } = await supabase
    .from('project_carbon')
    .insert({
      project_id: projectId,
      life_cycle_stage: 'A1-A3',
      material_id: carbonFactor.id,
      material_name: material.name,
      quantity: material.quantity,
      unit: material.unit,
      carbon_factor: carbonFactor.gwp_a1a3,
      carbon_emission: emission,
      calculation_date: new Date().toISOString(),
      data_quality: 'High'
    });
  
  // 4. Trigger budget update (via database trigger)
  // Budget automatically recalculated
  
  return emission;
}

// Get carbon budget status
async function getCarbonBudgetStatus(projectId) {
  const { data } = await supabase
    .from('v_carbon_budget_status')
    .select('*')
    .eq('project_id', projectId)
    .single();
  
  return data;
}
```

### 3. Template Engine Integration

**Location**: `Firehorse/templates/`  
**Format**: JSON template definitions

#### Load and Configure Template

```javascript
// Load template
async function loadTemplate(templateCode) {
  const { data: template } = await supabase
    .from('document_templates')
    .select('*')
    .eq('template_code', templateCode)
    .eq('status', 'Active')
    .single();
  
  return template;
}

// Configure template for project
function configureTemplate(template, projectData, carbonData) {
  const config = {
    templateId: template.id,
    projectId: projectData.id,
    language: 'en', // or 'fi', 'de', etc.
    
    // Data mappings
    dataMappings: {
      // Map project data to template fields
      'projectName': projectData.name,
      'projectLocation': projectData.location,
      'percentComplete': projectData.percentComplete,
      'spi': projectData.spi,
      'cpi': projectData.cpi,
      
      // Map carbon data
      'totalCarbon': carbonData.currentCarbon,
      'carbonIntensity': carbonData.currentIntensity,
      'carbonBudgetStatus': carbonData.budgetStatus,
      'lifeCycleBreakdown': carbonData.lifeCycleStages
    },
    
    // Output settings
    outputFormat: 'PDF',
    includeCharts: true,
    includeCarbonSection: true
  };
  
  return config;
}
```

---

## EN 15978 Carbon Tracking

### Implementation Strategy

#### Phase 1: Data Collection (Current)

```javascript
// Collect material quantities from project schedule
async function collectMaterialData(projectId) {
  // Integration with project management system
  const materials = await fetchProjectMaterials(projectId);
  
  // For each material, calculate carbon
  for (const material of materials) {
    await calculateMaterialCarbon(projectId, material);
  }
}

// Collect energy data from edge nodes
async function collectEnergyData(projectId) {
  const edgeNodes = await fetchEdgeNodeData(projectId);
  
  // Calculate operational carbon (B6)
  const energyCarbon = edgeNodes.energyConsumption.electricity * 0.27; // kg CO2-eq/kWh (Finland)
  
  await supabase
    .from('project_carbon')
    .insert({
      project_id: projectId,
      life_cycle_stage: 'B6',
      activity_description: 'Operational Energy',
      quantity: edgeNodes.energyConsumption.electricity,
      unit: 'kWh',
      carbon_factor: 0.27,
      carbon_emission: energyCarbon,
      calculation_date: new Date().toISOString()
    });
}
```

#### Phase 2: Real-Time Tracking

```javascript
// Set up real-time carbon tracking
function setupCarbonTracking(projectId) {
  // Subscribe to material deliveries
  supabase
    .channel('material-deliveries')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'material_deliveries',
      filter: `project_id=eq.${projectId}`
    }, async (payload) => {
      // Automatically calculate carbon for new material
      await calculateMaterialCarbon(projectId, payload.new);
      
      // Check if budget alert needed
      const budget = await getCarbonBudgetStatus(projectId);
      if (budget.budget_utilization_percentage > 90) {
        await sendCarbonBudgetAlert(projectId, budget);
      }
    })
    .subscribe();
  
  // Subscribe to energy data from edge nodes
  // (via WebSocket or MQTT)
  const edgeNodeClient = connectToEdgeNodes(projectId);
  edgeNodeClient.on('energy-update', async (data) => {
    await collectEnergyData(projectId);
  });
}
```

#### Phase 3: Automated Reporting

```javascript
// Schedule automated EN 15978 reports
async function scheduleEN15978Reports(projectId) {
  await supabase
    .from('report_automation')
    .insert({
      project_id: projectId,
      template_id: 'EN15978-FULL-REPORT-V1',
      template_name: 'EN 15978 Full Report',
      frequency: 'Monthly',
      schedule_day: 1, // First day of month
      schedule_time: '08:00:00',
      recipients: ['project-manager@client.com', 'sustainability@client.com'],
      alert_enabled: true,
      alert_conditions: {
        carbonBudgetThreshold: 90,
        complianceRisk: true
      },
      active: true
    });
}
```

### Carbon Calculation Functions

```javascript
// A1-A3: Product stage carbon
function calculateA1A3Carbon(material, carbonFactor) {
  return material.quantity * carbonFactor.gwp_a1a3;
}

// A4: Transport carbon
function calculateA4Carbon(delivery) {
  // Transport factor: kg CO2-eq per tonne-km
  const transportFactor = 0.062; // Truck transport
  const weight = delivery.quantity * delivery.density; // tonnes
  return weight * delivery.distance * transportFactor;
}

// A5: Construction process carbon
function calculateA5Carbon(equipment) {
  // Diesel consumption to carbon
  const dieselFactor = 2.7; // kg CO2-eq per liter
  return equipment.fuelConsumption * dieselFactor;
}

// B6: Operational energy carbon
function calculateB6Carbon(energyUse, studyPeriod) {
  // Energy factor for Finland
  const electricityFactor = 0.27; // kg CO2-eq per kWh
  const annualCarbon = energyUse.annual * electricityFactor;
  return annualCarbon * studyPeriod;
}

// C1-C4: End of life carbon
function calculateC1C4Carbon(material, endOfLifeScenario) {
  // Scenario-based factors
  const scenarios = {
    'landfill': 0.05,
    'recycling': 0.02,
    'incineration': 0.08
  };
  
  const factor = scenarios[endOfLifeScenario] || 0.05;
  return material.quantity * material.density * factor;
}

// D: Benefits from recycling
function calculateModuleDCarbon(material, recyclingRate) {
  // Avoided emissions from recycling
  const avoidedFactor = material.carbonFactor * 0.8; // 80% credit
  return -1 * material.quantity * avoidedFactor * recyclingRate;
}
```

---

## Template Engine

### Template Structure

Templates are defined in JSON format with the following structure:

```json
{
  "templateId": "UNIQUE-TEMPLATE-ID",
  "templateName": "Human Readable Name",
  "standard": {
    "type": "RT Card | VOB | EN 15978 | etc.",
    "number": "Standard number",
    "country": "Country code"
  },
  "sections": [
    {
      "sectionId": "1",
      "sectionName": "Section Name",
      "required": true,
      "fields": [
        {
          "fieldId": "1.1",
          "fieldName": "fieldName",
          "label": "Field Label",
          "type": "text | number | date | table | etc.",
          "required": true,
          "dataSource": "dws_iq.project.name | supabase.table.field"
        }
      ]
    }
  ]
}
```

### Template Rendering

```javascript
// Render template with data
async function renderTemplate(templateConfig, projectData, carbonData) {
  // 1. Load template
  const template = await loadTemplate(templateConfig.templateId);
  
  // 2. Map data to fields
  const mappedData = {};
  for (const section of template.sections) {
    for (const field of section.fields) {
      if (field.dataSource) {
        // Extract data from source
        mappedData[field.fieldName] = extractDataFromSource(
          field.dataSource,
          projectData,
          carbonData
        );
      }
    }
  }
  
  // 3. Validate required fields
  validateRequiredFields(template, mappedData);
  
  // 4. Generate report content
  const reportContent = await generateReportContent(template, mappedData);
  
  // 5. Render to output format
  const output = await renderToFormat(
    reportContent,
    templateConfig.outputFormat
  );
  
  return output;
}

// Extract data from source path
function extractDataFromSource(sourcePath, projectData, carbonData) {
  const [source, ...path] = sourcePath.split('.');
  
  if (source === 'dws_iq') {
    // Extract from project data
    return getNestedValue(projectData, path);
  } else if (source === 'supabase') {
    // Extract from carbon data
    return getNestedValue(carbonData, path);
  }
  
  return null;
}

// Get nested value from object
function getNestedValue(obj, path) {
  return path.reduce((current, key) => current?.[key], obj);
}
```

---

## Report Generation

### On-Demand Report Generation

```javascript
// Generate report on demand
async function generateReport(projectId, templateCode, options = {}) {
  try {
    // 1. Fetch project data
    const projectData = await fetchProjectData(projectId);
    
    // 2. Fetch carbon data
    const carbonData = await getCarbonBudgetStatus(projectId);
    const carbonDetails = await getProjectCarbonDetails(projectId);
    
    // 3. Load template
    const template = await loadTemplate(templateCode);
    
    // 4. Configure template
    const config = configureTemplate(template, projectData, {
      ...carbonData,
      ...carbonDetails
    });
    
    // 5. Render report
    const report = await renderTemplate(config, projectData, {
      ...carbonData,
      ...carbonDetails
    });
    
    // 6. Save to Supabase Storage
    const { data: uploadData } = await supabase.storage
      .from('reports')
      .upload(`${projectId}/${template.templateCode}_${Date.now()}.pdf`, report.pdf);
    
    // 7. Save metadata to database
    const { data: reportRecord } = await supabase
      .from('generated_reports')
      .insert({
        project_id: projectId,
        template_id: template.id,
        template_name: template.templateName,
        report_title: `${projectData.name} - ${template.templateName}`,
        report_type: template.standard.type,
        report_date: new Date().toISOString(),
        report_data: config.dataMappings,
        pdf_url: uploadData.path,
        language: options.language || 'en',
        status: 'Published'
      })
      .select()
      .single();
    
    // 8. Send notifications
    if (options.recipients) {
      await sendReportNotifications(reportRecord, options.recipients);
    }
    
    return reportRecord;
    
  } catch (error) {
    console.error('Report generation failed:', error);
    throw error;
  }
}
```

### Automated Report Generation

```javascript
// Scheduled report generation (runs via cron job or cloud function)
async function runScheduledReports() {
  // Get all active automation rules where next_run is due
  const { data: automations } = await supabase
    .from('report_automation')
    .select('*')
    .eq('active', true)
    .lte('next_run', new Date().toISOString());
  
  for (const automation of automations) {
    try {
      // Generate report
      const report = await generateReport(
        automation.project_id,
        automation.template_id,
        {
          recipients: automation.recipients,
          language: 'en'
        }
      );
      
      // Update automation record
      await supabase
        .from('report_automation')
        .update({
          last_run: new Date().toISOString(),
          next_run: calculateNextRun(automation.frequency, automation.schedule_day)
        })
        .eq('id', automation.id);
      
      console.log(`Report generated: ${report.id}`);
      
    } catch (error) {
      console.error(`Failed to generate report for automation ${automation.id}:`, error);
    }
  }
}

// Calculate next run time
function calculateNextRun(frequency, scheduleDay) {
  const now = new Date();
  let nextRun;
  
  switch (frequency) {
    case 'Daily':
      nextRun = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      break;
    case 'Weekly':
      nextRun = new Date(now);
      nextRun.setDate(now.getDate() + (scheduleDay - now.getDay() + 7) % 7);
      break;
    case 'Monthly':
      nextRun = new Date(now.getFullYear(), now.getMonth() + 1, scheduleDay);
      break;
    default:
      nextRun = now;
  }
  
  return nextRun.toISOString();
}
```

---

## API Reference

### REST API Endpoints

#### Generate Report

```http
POST /api/firehorse/reports/generate
Content-Type: application/json
Authorization: Bearer {token}

{
  "projectId": "PROJECT-001",
  "templateCode": "EN15978-FULL-REPORT-V1",
  "language": "en",
  "outputFormat": "PDF",
  "recipients": ["user@example.com"]
}

Response:
{
  "success": true,
  "reportId": "uuid",
  "reportUrl": "https://storage.supabase.co/...",
  "generatedAt": "2025-12-30T10:30:00Z"
}
```

#### Get Carbon Budget Status

```http
GET /api/firehorse/carbon/budget/{projectId}
Authorization: Bearer {token}

Response:
{
  "projectId": "PROJECT-001",
  "targetCarbon": 4500000,
  "currentCarbon": 2025000,
  "budgetUtilization": 45.0,
  "budgetStatus": "On Track",
  "lifeCycleStages": { ... }
}
```

#### List Available Templates

```http
GET /api/firehorse/templates?region=Nordic&country=FI
Authorization: Bearer {token}

Response:
{
  "templates": [
    {
      "templateId": "FI-RT-10-11224-V1",
      "templateName": "RT 10-11224 Project Management",
      "standard": "RT Card",
      "country": "Finland"
    },
    ...
  ]
}
```

---

## Implementation Steps

### Step 1: Database Setup (30 minutes)

```bash
# 1. Run Supabase schema
psql -h your-project.supabase.co -U postgres -d postgres -f Firehorse/supabase-schema-templates.sql

# 2. Verify tables created
psql -c "\dt" # List tables

# 3. Insert sample carbon factors
# (Already included in schema)
```

### Step 2: Template Configuration (1 hour)

```javascript
// 1. Load templates into database
async function loadTemplatesIntoDatabase() {
  const templates = [
    require('./templates/pan-european/environmental/en15978-template.json'),
    require('./templates/nordic/finland/rt-card-template.json'),
    require('./templates/central-europe/germany/vob-template.json')
  ];
  
  for (const template of templates) {
    await supabase
      .from('document_templates')
      .insert({
        template_name: template.templateName,
        template_code: template.templateId,
        template_category: template.standard.region,
        standard_type: template.standard.type,
        standard_number: template.standard.number,
        region: template.standard.region,
        country_code: template.standard.country,
        template_structure: template,
        languages: template.metadata.languages,
        carbon_reporting_enabled: template.metadata.carbonReportingEnabled,
        status: 'Active'
      });
  }
}

// 2. Run loader
await loadTemplatesIntoDatabase();
```

### Step 3: Carbon Tracking Setup (2 hours)

```javascript
// 1. Initialize carbon budget for project
async function initializeCarbonBudget(projectId, targetIntensity, grossFloorArea) {
  const targetCarbon = targetIntensity * grossFloorArea;
  
  await supabase
    .from('carbon_budget')
    .insert({
      project_id: projectId,
      target_carbon: targetCarbon,
      target_intensity: targetIntensity,
      gross_floor_area: grossFloorArea,
      budget_status: 'On Track',
      alert_threshold_percentage: 90.0,
      fit_for_55_compliant: true,
      eu_taxonomy_aligned: true
    });
}

// 2. Set up real-time tracking
await setupCarbonTracking(projectId);

// 3. Schedule automated reports
await scheduleEN15978Reports(projectId);
```

### Step 4: Integration Testing (1 hour)

```javascript
// 1. Test report generation
const testReport = await generateReport(
  'PROJECT-001',
  'EN15978-FULL-REPORT-V1',
  {
    language: 'en',
    recipients: ['test@example.com']
  }
);

console.log('Test report generated:', testReport.reportUrl);

// 2. Verify carbon calculations
const carbonStatus = await getCarbonBudgetStatus('PROJECT-001');
console.log('Carbon budget status:', carbonStatus);

// 3. Test automated scheduling
await runScheduledReports();
```

### Step 5: Production Deployment (30 minutes)

```bash
# 1. Deploy to production
# (Already deployed with DWS IQ 6 platform)

# 2. Configure environment variables
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# 3. Set up cron job for scheduled reports
# (Cloud Function or cron job)
0 8 1 * * /usr/bin/node /path/to/scheduled-reports.js
```

---

## Testing & Validation

### Unit Tests

```javascript
// Test carbon calculation
describe('Carbon Calculations', () => {
  test('A1-A3 product stage carbon', () => {
    const material = { quantity: 100, unit: 'kg' };
    const carbonFactor = { gwp_a1a3: 2.5 };
    const result = calculateA1A3Carbon(material, carbonFactor);
    expect(result).toBe(250);
  });
  
  test('A4 transport carbon', () => {
    const delivery = {
      quantity: 10,
      density: 2.4,
      distance: 50
    };
    const result = calculateA4Carbon(delivery);
    expect(result).toBeCloseTo(74.4, 1);
  });
});

// Test template rendering
describe('Template Rendering', () => {
  test('EN 15978 template renders correctly', async () => {
    const report = await generateReport(
      'TEST-PROJECT',
      'EN15978-FULL-REPORT-V1'
    );
    expect(report).toBeDefined();
    expect(report.pdf_url).toContain('.pdf');
  });
});
```

### Integration Tests

```javascript
// Test full workflow
describe('Report Generation Workflow', () => {
  test('Generate EN 15978 report with real data', async () => {
    // 1. Create test project
    const project = await createTestProject();
    
    // 2. Add carbon data
    await addTestCarbonData(project.id);
    
    // 3. Generate report
    const report = await generateReport(
      project.id,
      'EN15978-FULL-REPORT-V1'
    );
    
    // 4. Verify report
    expect(report.status).toBe('Published');
    expect(report.pdf_url).toBeDefined();
    
    // 5. Cleanup
    await deleteTestProject(project.id);
  });
});
```

### Validation Checklist

- [ ] Database schema created successfully
- [ ] Templates loaded into database
- [ ] Carbon factors populated
- [ ] Project data fetching works
- [ ] Carbon calculations accurate
- [ ] Template rendering produces valid output
- [ ] PDF generation works
- [ ] Reports saved to Supabase Storage
- [ ] Email notifications sent
- [ ] Automated scheduling works
- [ ] Real-time updates trigger correctly
- [ ] Compliance validation passes
- [ ] Multi-language support works
- [ ] Performance acceptable (<5s for report generation)

---

## Support & Resources

### Documentation
- **Template Standards**: `Firehorse/DOCUMENT_TEMPLATE_STANDARDS.md`
- **Template Library**: `Firehorse/templates/`
- **Database Schema**: `Firehorse/supabase-schema-templates.sql`

### Contact
- **Technical Support**: support@dws6.com
- **Carbon Reporting**: carbon@dws6.com
- **Template Customization**: templates@dws6.com

### External Resources
- **EN 15978**: [ISO 15978:2011](https://www.iso.org/)
- **Fit for 55**: [EU Climate Action](https://ec.europa.eu/clima/eu-action/fit-for-55_en)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

---

**Document Version**: 1.0  
**Last Updated**: December 30, 2025  
**Next Review**: March 31, 2026  
**Owner**: Firehorse Product Team

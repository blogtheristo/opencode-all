# Environmental Standards Templates
## EN 15978, LEED, BREEAM, DGNB

This directory contains templates for environmental and sustainability standards.

## ⭐ EN 15978 - Carbon Assessment (CRITICAL)

**Description**: Assessment of environmental performance of buildings - Life cycle calculation method  
**Importance**: **CRITICAL for DWS IQ 6 platform and Fit for 55 compliance**

### Life Cycle Stages
- **A1-A3**: Product stage (raw materials, transport, manufacturing)
- **A4-A5**: Construction process (transport to site, construction)
- **B1-B7**: Use stage (operations, maintenance, repair, replacement, refurbishment, energy, water)
- **C1-C4**: End of life (deconstruction, transport, waste processing, disposal)
- **D**: Benefits beyond system boundary (reuse, recycling, energy recovery)

### Templates Available

#### 1. EN 15978 Full Report
**File**: `en15978-full-report.docx`

Complete life cycle assessment report including:
- Project information and scope
- Life cycle inventory (LCI)
- Environmental indicators (GWP, ODP, AP, EP, POCP, ADP, PE)
- Results by life cycle stage
- Carbon footprint summary
- Fit for 55 compliance statement
- Data quality assessment
- Verification documentation

#### 2. EN 15978 Executive Summary
**File**: `en15978-executive-summary.docx`

Condensed report for management:
- Key findings
- Carbon intensity (kg CO2-eq/m²)
- Comparison to benchmarks
- Compliance status
- Recommendations

#### 3. EN 15978 Monthly Progress Report
**File**: `en15978-monthly-progress.docx`

Real-time tracking report:
- Current carbon emissions
- Carbon budget vs. actual
- Phase-wise breakdown
- Alerts and warnings
- Optimization opportunities

#### 4. Fit for 55 Compliance Statement
**File**: `fit-for-55-compliance.docx`

EU compliance documentation:
- EU Taxonomy alignment
- DNSH (Do No Significant Harm) assessment
- Minimum safeguards
- Technical screening criteria

### DWS IQ 6 Integration

EN 15978 templates automatically integrate with:

```javascript
// Real-time carbon tracking
const carbonData = await fetchCarbonData(projectId);

// Data includes:
{
  lifeCycleStages: {
    A1_A3: { gwp: 1250.5, unit: 'kg CO2-eq' },
    A4: { gwp: 85.2, unit: 'kg CO2-eq' },
    A5: { gwp: 120.8, unit: 'kg CO2-eq' },
    B6: { gwp: 2450.0, unit: 'kg CO2-eq' },
    // ... other stages
  },
  totalCarbon: 4200.5,
  carbonIntensity: 450.2, // kg CO2-eq/m²
  budgetStatus: 'On Track',
  alerts: []
}
```

### Carbon Data Sources

1. **EPD Database**: Environmental Product Declarations
2. **Material Quantities**: From project schedules
3. **Energy Monitoring**: From site edge nodes
4. **Transportation**: From logistics data
5. **Equipment Usage**: From site operations

### Calculation Engine

```javascript
// A1-A3: Product stage
const materialCarbon = quantity * carbonFactor_A1A3;

// A4: Transportation
const transportCarbon = distance * weight * transportFactor;

// A5: Construction
const constructionCarbon = energyUse * energyFactor;

// B6: Operational energy
const operationalCarbon = annualEnergy * energyFactor * years;

// Total life cycle carbon
const totalCarbon = A1A3 + A4 + A5 + B1toB7 + C1toC4 + D;
```

---

## LEED (Leadership in Energy and Environmental Design)

**Templates**:
- `leed-project-registration.docx` - Project registration
- `leed-credit-documentation.docx` - Credit documentation
- `leed-performance-data.docx` - Performance tracking
- `leed-certification-submission.docx` - Certification submission

**Rating Systems**:
- LEED BD+C (Building Design and Construction)
- LEED O+M (Operations and Maintenance)
- LEED ID+C (Interior Design and Construction)

---

## BREEAM (Building Research Establishment Environmental Assessment Method)

**Templates**:
- `breeam-assessment-report.docx` - Assessment report
- `breeam-credit-evidence.docx` - Credit evidence
- `breeam-performance-calculations.docx` - Performance calculations
- `breeam-certification-documentation.docx` - Certification docs

**Schemes**:
- BREEAM New Construction
- BREEAM Refurbishment
- BREEAM In-Use

---

## DGNB (Deutsche Gesellschaft für Nachhaltiges Bauen)

**Templates**:
- `dgnb-quality-profiles.docx` - Quality profiles assessment
- `dgnb-criteria-assessment.docx` - Criteria documentation
- `dgnb-performance-indicators.docx` - Performance indicators
- `dgnb-certification-report.docx` - Certification report

**Certificate Levels**:
- Bronze (≥35%)
- Silver (≥50%)
- Gold (≥65%)
- Platinum (≥80%)

---

## Usage Priority

1. **EN 15978** (CRITICAL) - Required for all projects
2. **LEED/BREEAM/DGNB** - As required by client or certification target

## Automation

All environmental templates support automated generation:

```javascript
// Monthly EN 15978 report
scheduleReport({
  template: 'en15978-monthly-progress',
  frequency: 'monthly',
  recipients: ['project-manager@client.com'],
  alerts: {
    carbonBudget: 90, // Alert at 90% of budget
    highCarbonMaterials: true
  }
});
```

## Compliance Tracking

Dashboard KPIs for environmental compliance:
- Carbon intensity vs. target
- Carbon budget utilization
- Certification progress
- Compliance status

---

**Last Updated**: December 30, 2025  
**Priority**: CRITICAL (EN 15978)

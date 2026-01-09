# European Construction Document Templates
## Firehorse Reports - DWS IQ 6 Platform

This directory contains standardized document templates for European construction projects, organized by region and standard type.

## Directory Structure

```
templates/
├── nordic/                    # Nordic Countries
│   ├── finland/              # Finnish standards (RT, InfraRYL, RYL)
│   ├── sweden/               # Swedish standards (AMA, MBR)
│   ├── norway/               # Norwegian standards (NS, FDV)
│   ├── denmark/              # Danish standards (BR, BEK, CAB)
│   └── pan-nordic/           # Pan-Nordic (BSAB, NCS, IFC/BCF)
│
├── central-europe/           # Central European Countries
│   ├── germany/              # German standards (VOB, DIN)
│   ├── austria/              # Austrian standards (ÖNORM, LM.VM)
│   ├── switzerland/          # Swiss standards (SIA, eBKP-H)
│   ├── netherlands/          # Dutch standards (NEN, RAW, STABU)
│   └── belgium/              # Belgian standards (NBN, Bestek)
│
└── pan-european/             # Pan-European Standards
    ├── iso/                  # ISO standards (19650, 9001, 14001, 45001)
    ├── eu/                   # EU directives (CPR, Eurocodes, CSRD)
    ├── bim/                  # BIM standards (IFC, BCF, COBie)
    └── environmental/        # Environmental (EN 15978, LEED, BREEAM, DGNB)
```

## Template Types

### 1. Project Documentation
- Project initiation documents
- Requirements specifications
- Contract documents
- Quality plans

### 2. Technical Specifications
- Material specifications
- Work descriptions
- Execution requirements
- Testing procedures

### 3. Compliance Reports
- EN 15978 carbon reports ⭐
- Quality assurance reports
- Safety documentation
- Environmental reports

### 4. Operations & Maintenance
- FDV documentation (Norway)
- COBie handover data
- Maintenance schedules
- Asset information

### 5. Cost Documentation
- Cost estimates (DIN 276, ÖNORM A 2063, eBKP-H)
- Bills of quantities
- Payment schedules
- Change orders

## Usage

### 1. Select Template
Identify the appropriate template based on:
- Project location (country)
- Project type (building/infrastructure)
- Client requirements
- Regulatory requirements

### 2. Configure Template
```javascript
const template = await loadTemplate('nordic/finland/rt-card');
template.configure({
  projectId: 'PROJECT-001',
  language: 'fi',
  standards: ['RT 10-11224', 'RYL 2010'],
  carbonReporting: true
});
```

### 3. Populate with Data
```javascript
const reportData = await fetchProjectData(projectId);
const carbonData = await fetchCarbonData(projectId);
const report = await template.render(reportData, carbonData);
```

### 4. Generate Report
```javascript
const pdf = await generatePDF(report);
await saveToSupabase(pdf);
```

## EN 15978 Carbon Reporting ⭐

**CRITICAL**: All templates support EN 15978 carbon reporting for Fit for 55 compliance.

Carbon data is automatically included in reports when enabled:
- Life cycle stages (A1-A3, A4, A5, B1-B7, C1-C4, D)
- Environmental indicators (GWP, ODP, AP, EP, etc.)
- Carbon intensity (kg CO2-eq/m²)
- Compliance statements

## Template Format

All templates are provided in multiple formats:
- **JSON**: Machine-readable template definitions
- **DOCX**: Microsoft Word templates
- **PDF**: PDF form templates
- **HTML**: Web-based templates

## Customization

Templates can be customized for specific clients:
1. Clone base template
2. Modify sections and fields
3. Add client branding
4. Configure data mappings
5. Save as client-specific template

## Integration with DWS IQ 6

Templates automatically pull data from:
- **Dashboard**: Real-time project metrics
- **Supabase**: Project and carbon data
- **Edge Nodes**: Site monitoring data
- **SAP PM**: Maintenance data

## Support

For template support:
- **Documentation**: See `DOCUMENT_TEMPLATE_STANDARDS.md`
- **Technical**: support@dws6.com
- **Templates**: templates@dws6.com
- **Carbon**: carbon@dws6.com

## Version Control

Templates are versioned in Supabase:
- Version history tracked
- Change logs maintained
- Rollback capability
- Approval workflows

---

**Last Updated**: December 30, 2025  
**Template Library Version**: 1.0

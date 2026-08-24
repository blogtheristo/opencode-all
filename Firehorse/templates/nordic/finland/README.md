# Finnish Construction Templates
## RT Cards, InfraRYL, RYL Specifications

This directory contains templates for Finnish construction standards.

## Standards Covered

### 1. RT Cards (Rakennustieto)
Finnish building information card system for technical specifications and construction methods.

**Key Standards**:
- RT 10-11224: Project management documentation
- RT 13-11223: Quality management in construction
- RT 16-11224: Environmental management

**Templates**:
- `rt-card-template.json` - Base RT card template
- `rt-project-management.docx` - Project management (RT 10-11224)
- `rt-quality-management.docx` - Quality management (RT 13-11223)
- `rt-environmental.docx` - Environmental management (RT 16-11224)

### 2. InfraRYL
Infrastructure construction quality requirements for road, rail, water, and energy projects.

**Templates**:
- `infraryl-earthworks.docx` - Earthworks (21000)
- `infraryl-pavement.docx` - Pavement structures (22000)
- `infraryl-drainage.docx` - Drainage systems (23000)
- `infraryl-quality-plan.docx` - Quality control plan

### 3. RYL Specifications
General quality requirements for building construction.

**Templates**:
- `ryl-concrete-works.docx` - Concrete works (31)
- `ryl-steel-structures.docx` - Steel structures (32)
- `ryl-masonry.docx` - Masonry works (33)
- `ryl-quality-inspection.docx` - Quality inspection report

## Language Support
- Finnish (fi)
- Swedish (sv)
- English (en)

## EN 15978 Integration
All templates include carbon reporting sections for Fit for 55 compliance.

## Usage Example

```javascript
// Load RT card template
const template = await loadTemplate('nordic/finland/rt-card-template');

// Configure for project
template.configure({
  rtNumber: 'RT 10-11224',
  language: 'fi',
  projectId: 'FI-PROJECT-001',
  carbonReporting: true
});

// Generate report
const report = await template.render(projectData);
```

## Related Standards
- Talo 2000 classification
- EN 15978 carbon reporting
- ISO 19650 BIM requirements

---

**Last Updated**: December 30, 2025

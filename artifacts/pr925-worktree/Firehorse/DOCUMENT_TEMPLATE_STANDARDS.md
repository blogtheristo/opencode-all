# European Construction Document Template Standards
## Firehorse Reports Product - DWS IQ 6 Platform

**Version**: 1.0  
**Date**: December 30, 2025  
**Target Markets**: Nordic Countries & Central Europe  
**Compliance**: EN 15978 Carbon Reporting (Fit for 55)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Nordic Standards](#nordic-standards)
3. [Central Europe Standards](#central-europe-standards)
4. [Pan-European Standards](#pan-european-standards)
5. [EN 15978 Carbon Reporting](#en-15978-carbon-reporting)
6. [Implementation Guide](#implementation-guide)
7. [Template Selection Matrix](#template-selection-matrix)
8. [Compliance Checklist](#compliance-checklist)

---

## Overview

### Purpose
This document defines the European construction document template standards for the **Firehorse Reports** product, part of the **DWS IQ 6** platform. These standards ensure that enterprise construction companies in the Nordics and Central Europe can generate sharp, compliant reports that meet their internal policies and regulatory requirements.

### Key Requirements
- ✅ **Enterprise Compliance**: Follow customer template policies
- ✅ **Regional Standards**: Support Nordic and Central European standards
- ✅ **Carbon Reporting**: EN 15978 compliance for Fit for 55
- ✅ **BIM Integration**: IFC/BCF support for digital workflows
- ✅ **Multi-Language**: Support for local languages
- ✅ **Real-Time Data**: Integration with DWS IQ 6 dashboard data

### Integration Points
- **DWS IQ 6 Dashboard**: Real-time project data, KPIs, alerts
- **Supabase**: Template storage and versioning
- **Firehorse CMS**: Content management for reports
- **Firehorse Automation**: Automated report generation

---

## Nordic Standards

### 🇫🇮 Finland - RT (Rakennustieto)

#### RT Card System
**Description**: Finnish building information card system  
**Use Cases**: Technical specifications, product data, construction methods  
**Key Standards**:
- **RT 10-11224**: Project management documentation
- **RT 13-11223**: Quality management in construction
- **RT 16-11224**: Environmental management

**Template Requirements**:
```yaml
Document Structure:
  - RT Card Number (e.g., RT 10-11224)
  - Title (Finnish/Swedish/English)
  - Version and date
  - Classification code (Talo 2000)
  - Content sections with standardized numbering
  - References to related RT cards
  - Approval signatures
```

#### InfraRYL
**Description**: Infrastructure construction quality requirements  
**Use Cases**: Road, rail, water, energy infrastructure projects  
**Key Components**:
- Quality requirements
- Measurement methods
- Acceptance criteria
- Testing procedures

**Template Requirements**:
```yaml
Document Structure:
  - Project identification
  - InfraRYL section reference (e.g., 21000 Earthworks)
  - Quality class specification
  - Measurement points and methods
  - Acceptance criteria tables
  - Test result documentation
  - Non-conformance reporting
```

#### RYL Specifications
**Description**: General quality requirements for building construction  
**Use Cases**: Building projects, quality control, inspections  
**Key Standards**:
- **RYL 2000**: General requirements
- **RYL 2010**: Updated quality standards

**Template Requirements**:
```yaml
Document Structure:
  - Work section code (e.g., 31 Concrete works)
  - Quality level (1-3)
  - Material specifications
  - Workmanship requirements
  - Inspection points
  - Tolerance tables
  - Quality documentation
```

---

### 🇸🇪 Sweden - AMA

#### AMA Anläggning (Infrastructure)
**Description**: Swedish infrastructure construction specifications  
**Use Cases**: Civil engineering, infrastructure projects  
**Key Components**:
- **AMA AF**: Contracts and general conditions
- **AMA AL**: Technical specifications
- **AMA AK**: Quantity calculations

**Template Requirements**:
```yaml
Document Structure:
  - AMA code (e.g., AMA AL.1 Earthworks)
  - Activity description
  - Material specifications (SS-EN standards)
  - Execution requirements
  - Quality control points
  - Measurement rules (MBR)
  - Payment terms
```

#### AMA Hus (Buildings)
**Description**: Swedish building construction specifications  
**Use Cases**: Building projects, residential, commercial  
**Key Components**:
- **AMA HF**: Contracts
- **AMA HL**: Technical specifications
- **AMA HK**: Quantity calculations

**Template Requirements**:
```yaml
Document Structure:
  - AMA code (e.g., AMA HL.3 Concrete)
  - Work description
  - Material standards (SS-EN)
  - Installation requirements
  - Quality assurance
  - MBR measurement rules
  - Warranty conditions
```

#### MBR (Measurement Rules)
**Description**: Standardized measurement and quantity calculation rules  
**Use Cases**: Cost estimation, quantity surveying, payment  
**Key Standards**:
- **MBR-A**: Infrastructure measurements
- **MBR-H**: Building measurements

**Template Requirements**:
```yaml
Document Structure:
  - Item code (AMA reference)
  - Unit of measurement
  - Measurement method
  - Inclusions/exclusions
  - Calculation formulas
  - Rounding rules
  - Documentation requirements
```

---

### 🇳🇴 Norway - NS Standards

#### NS 3420
**Description**: Condition assessment of construction works  
**Use Cases**: Building inspections, maintenance planning, condition reports  
**Key Components**:
- Condition grades (TG 0-3)
- Consequence classes (K 0-3)
- Maintenance priority

**Template Requirements**:
```yaml
Document Structure:
  - Building identification
  - Inspection date and inspector
  - Building element code (NS 3451)
  - Condition grade (TG 0-3)
  - Consequence class (K 0-3)
  - Defect description
  - Recommended actions
  - Cost estimates
  - Priority matrix
```

#### NS 8405/8406/8407
**Description**: Standard construction contracts  
**Use Cases**: Contract documentation, project agreements  
**Key Standards**:
- **NS 8405**: Design-bid-build
- **NS 8406**: Design-build
- **NS 8407**: Turnkey contracts

**Template Requirements**:
```yaml
Document Structure:
  - Contract type (NS 8405/8406/8407)
  - Parties and roles
  - Scope of work
  - Time schedule
  - Payment terms
  - Change order procedures
  - Quality requirements
  - Dispute resolution
  - Insurance and liability
```

#### FDV Documentation (Forvaltning, Drift, Vedlikehold)
**Description**: Operations and maintenance documentation  
**Use Cases**: Building handover, facility management, maintenance planning  
**Key Components**:
- Management documentation
- Operations manuals
- Maintenance schedules

**Template Requirements**:
```yaml
Document Structure:
  - Building/system identification
  - Technical specifications
  - Operating instructions
  - Maintenance schedules
  - Spare parts lists
  - Warranty information
  - Emergency procedures
  - Contact information
  - As-built drawings
  - Test certificates
```

---

### 🇩🇰 Denmark - BR (Byggeriets Regler)

#### Byggeriets Regler (Building Regulations)
**Description**: Danish building regulations and technical requirements  
**Use Cases**: Building permit applications, compliance documentation  
**Key Components**:
- Safety requirements
- Energy performance
- Accessibility
- Fire safety

**Template Requirements**:
```yaml
Document Structure:
  - BR section reference (e.g., BR18 §250 Energy)
  - Compliance statement
  - Calculation documentation
  - Material specifications
  - Testing results
  - Certification
  - Deviation requests
  - Authority approvals
```

#### BEK Templates
**Description**: Executive orders (Bekendtgørelser) templates  
**Use Cases**: Legal compliance, regulatory submissions  
**Key Standards**:
- BEK on energy performance
- BEK on fire safety
- BEK on accessibility

**Template Requirements**:
```yaml
Document Structure:
  - BEK number and title
  - Legal basis
  - Compliance requirements
  - Documentation evidence
  - Calculation methods
  - Test results
  - Professional certifications
  - Authority declarations
```

#### CAB (Cuneco Arbejdsbeskrivelser)
**Description**: Standardized work descriptions  
**Use Cases**: Tender documents, work specifications  
**Key Components**:
- Activity codes
- Material specifications
- Quality requirements

**Template Requirements**:
```yaml
Document Structure:
  - CAB code (e.g., CAB 21 Earthworks)
  - Activity description
  - Material standards (DS/EN)
  - Execution requirements
  - Quality control
  - Measurement units
  - Payment conditions
```

---

### 🌍 Pan-Nordic Standards

#### BSAB (Byggnadsdels-, Samverkans- och Arbetsresultatbaserad)
**Description**: Nordic classification system for building parts and activities  
**Use Cases**: Project planning, cost estimation, BIM classification  
**Key Components**:
- Building parts classification
- Work results classification
- Construction products classification

**Template Requirements**:
```yaml
Document Structure:
  - BSAB code (e.g., 31 Concrete structures)
  - Element description
  - Material specifications
  - Work method
  - Quality requirements
  - Cost allocation
  - BIM object classification
```

#### NCS (Nordic Classification System)
**Description**: Unified Nordic construction classification  
**Use Cases**: Cross-border projects, standardized reporting  
**Key Components**:
- Unified coding system
- Multi-language support
- BIM integration

**Template Requirements**:
```yaml
Document Structure:
  - NCS code
  - Description (Nordic languages)
  - Technical specifications
  - Quality standards
  - Measurement rules
  - Cost data
  - BIM properties
```

#### IFC/BCF for BIM
**Description**: Industry Foundation Classes and BIM Collaboration Format  
**Use Cases**: Digital construction, model-based workflows  
**Key Standards**:
- **IFC 4.3**: Latest schema
- **BCF 2.1**: Issue management

**Template Requirements**:
```yaml
Document Structure:
  - IFC schema version
  - Model view definition (MVD)
  - Object classification (IFC entities)
  - Properties and property sets
  - BCF topics for issues
  - Coordination views
  - Clash detection reports
  - Model validation results
```

---

## Central Europe Standards

### 🇩🇪 Germany - VOB (Vergabe- und Vertragsordnung für Bauleistungen)

#### VOB/A (Tender Procedures)
**Description**: Regulations for awarding public construction contracts  
**Use Cases**: Public procurement, tender documentation  
**Key Components**:
- Tender requirements
- Qualification criteria
- Award procedures

**Template Requirements**:
```yaml
Document Structure:
  - Tender identification
  - Legal basis (VOB/A §§)
  - Project description
  - Qualification requirements
  - Technical specifications (VOB/C)
  - Contract conditions (VOB/B)
  - Tender submission requirements
  - Award criteria
  - Time schedule
  - Payment terms
```

#### VOB/B (Contract Conditions)
**Description**: General contract conditions for construction works  
**Use Cases**: Construction contracts, legal agreements  
**Key Components**:
- Rights and obligations
- Payment terms
- Time extensions
- Warranty

**Template Requirements**:
```yaml
Document Structure:
  - Contract parties
  - Scope of work (Leistungsverzeichnis)
  - VOB/B clauses
  - Special contract conditions
  - Time schedule (Bauzeit)
  - Payment schedule (Zahlungsplan)
  - Acceptance procedures (Abnahme)
  - Warranty period (Gewährleistung)
  - Insurance requirements
```

#### VOB/C (Technical Specifications)
**Description**: General technical specifications for construction works  
**Use Cases**: Technical documentation, work specifications  
**Key Standards**:
- DIN standards integration
- Material specifications
- Execution requirements

**Template Requirements**:
```yaml
Document Structure:
  - VOB/C section (e.g., ATV DIN 18331 Concrete)
  - Work description
  - Material standards (DIN/EN)
  - Execution requirements
  - Quality control
  - Testing procedures
  - Measurement and payment
  - Acceptance criteria
```

#### DIN Standards

##### DIN 18205 (Needs Planning)
**Description**: Requirements planning for construction projects  
**Use Cases**: Project initiation, requirements definition  

**Template Requirements**:
```yaml
Document Structure:
  - Project objectives
  - Functional requirements
  - Technical requirements
  - Quality requirements
  - Cost framework
  - Time schedule
  - Sustainability goals
  - Stakeholder requirements
```

##### DIN 276 (Cost Planning)
**Description**: Cost estimation and cost control  
**Use Cases**: Budget planning, cost management  

**Template Requirements**:
```yaml
Document Structure:
  - DIN 276 cost groups (100-700)
  - Cost estimate level (1-4)
  - Quantity calculations
  - Unit prices
  - Total costs by group
  - Contingencies
  - Cost development tracking
  - Variance analysis
```

##### DIN 277 (Areas and Volumes)
**Description**: Calculation of areas and volumes of buildings  
**Use Cases**: Space planning, cost estimation  

**Template Requirements**:
```yaml
Document Structure:
  - Building identification
  - Gross floor area (BGF)
  - Net floor area (NF)
  - Usable area (NUF)
  - Technical area (TF)
  - Circulation area (VF)
  - Volume calculations
  - Area schedules
  - Calculation methods
```

---

### 🇦🇹 Austria - ÖNORM

#### ÖNORM A 2063
**Description**: Preparation of cost estimates for buildings  
**Use Cases**: Cost planning, budget estimation  
**Key Components**:
- Cost group structure
- Estimation methods
- Documentation requirements

**Template Requirements**:
```yaml
Document Structure:
  - Project identification
  - Cost estimate level (1-5)
  - ÖNORM A 2063 cost groups
  - Quantity calculations
  - Unit prices
  - Total costs
  - Contingencies
  - Escalation factors
  - Assumptions and exclusions
```

#### ÖNORM B Series
**Description**: Construction standards and specifications  
**Use Cases**: Technical specifications, quality requirements  
**Key Standards**:
- **ÖNORM B 2110**: General contract conditions
- **ÖNORM B 2111**: Payment terms
- **ÖNORM B 2203**: Earthworks
- **ÖNORM B 2211**: Concrete works

**Template Requirements**:
```yaml
Document Structure:
  - ÖNORM standard reference
  - Work description
  - Material specifications
  - Execution requirements
  - Quality control
  - Testing procedures
  - Measurement rules
  - Acceptance criteria
  - Payment conditions
```

#### LM.VM (Leistungsmodell Verkehrsinfrastruktur)
**Description**: Performance model for transport infrastructure  
**Use Cases**: Infrastructure projects, performance specifications  
**Key Components**:
- Activity structure
- Performance descriptions
- Measurement rules

**Template Requirements**:
```yaml
Document Structure:
  - LM.VM code
  - Performance description
  - Technical requirements
  - Material specifications
  - Quality standards
  - Measurement methods
  - Unit prices
  - Payment terms
```

---

### 🇨🇭 Switzerland - SIA (Schweizerischer Ingenieur- und Architektenverein)

#### SIA 102 (Services and Fees)
**Description**: Services and fees for architects  
**Use Cases**: Service agreements, fee calculation  

**Template Requirements**:
```yaml
Document Structure:
  - Service phases (1-9)
  - Scope of services
  - Fee calculation method
  - Hourly rates
  - Expense reimbursement
  - Payment schedule
  - Additional services
  - Contract terms
```

#### SIA 112 (Model Contract)
**Description**: Model contract for architects and engineers  
**Use Cases**: Professional service contracts  

**Template Requirements**:
```yaml
Document Structure:
  - Parties and roles
  - Scope of services (SIA 102 phases)
  - Fee agreement
  - Time schedule
  - Responsibilities
  - Liability and insurance
  - Change procedures
  - Termination conditions
  - Dispute resolution
```

#### SIA 118 (General Conditions)
**Description**: General conditions for construction contracts  
**Use Cases**: Construction contracts, contractor agreements  

**Template Requirements**:
```yaml
Document Structure:
  - Contract parties
  - Scope of work
  - SIA 118 clauses
  - Special conditions
  - Time schedule
  - Payment terms
  - Quality requirements
  - Acceptance procedures
  - Warranty (2-5 years)
  - Insurance
```

#### eBKP-H (Electronic Building Cost Plan)
**Description**: Standardized cost planning system  
**Use Cases**: Cost estimation, budget control  
**Key Components**:
- Cost group structure (A-F)
- Electronic data exchange
- BIM integration

**Template Requirements**:
```yaml
Document Structure:
  - eBKP-H code (e.g., C Building construction)
  - Cost group hierarchy
  - Quantity calculations
  - Unit prices
  - Total costs by group
  - Cost development
  - BIM quantity takeoff
  - Cost allocation
```

---

### 🇳🇱 Netherlands - NEN

#### NEN 2574
**Description**: Quantities and specifications for construction works  
**Use Cases**: Bill of quantities, tender documents  

**Template Requirements**:
```yaml
Document Structure:
  - NEN 2574 item code
  - Item description
  - Unit of measurement
  - Quantity
  - Unit price
  - Total price
  - Specifications
  - Execution requirements
  - Payment conditions
```

#### RAW Bestek
**Description**: Standard specifications for civil engineering  
**Use Cases**: Infrastructure projects, technical specifications  

**Template Requirements**:
```yaml
Document Structure:
  - RAW section code
  - Work description
  - Material standards (NEN-EN)
  - Execution requirements
  - Quality control
  - Testing procedures
  - Measurement methods
  - Acceptance criteria
```

#### STABU (Standaard Bestekken)
**Description**: Standard specifications database  
**Use Cases**: Building projects, standardized specifications  

**Template Requirements**:
```yaml
Document Structure:
  - STABU code
  - Standard text
  - Material specifications
  - Execution requirements
  - Quality standards
  - Measurement units
  - Custom additions
  - Project-specific requirements
```

---

### 🇧🇪 Belgium - NBN

#### NBN B Series
**Description**: Belgian construction standards  
**Use Cases**: Technical specifications, quality requirements  
**Key Standards**:
- **NBN B 06-001**: Loads on structures
- **NBN B 15-001**: Concrete
- **NBN B 24-301**: Masonry

**Template Requirements**:
```yaml
Document Structure:
  - NBN standard reference
  - Work description
  - Material specifications
  - Execution requirements
  - Quality control
  - Testing procedures
  - Acceptance criteria
  - Certification requirements
```

#### Bestek Templates
**Description**: Standard tender and contract documents  
**Use Cases**: Public procurement, construction contracts  

**Template Requirements**:
```yaml
Document Structure:
  - Project identification
  - Administrative conditions
  - Technical specifications (NBN)
  - Bill of quantities
  - Tender requirements
  - Contract conditions
  - Payment terms
  - Quality assurance
  - Warranty conditions
```

---

## Pan-European Standards

### ISO Standards

#### ISO 19650 (BIM Information Management)
**Description**: Organization and digitization of information about buildings and civil engineering works  
**Use Cases**: BIM projects, digital information management  
**Key Parts**:
- **ISO 19650-1**: Concepts and principles
- **ISO 19650-2**: Delivery phase
- **ISO 19650-3**: Operational phase
- **ISO 19650-5**: Security-minded approach

**Template Requirements**:
```yaml
Document Structure:
  - Information requirements
  - BIM execution plan (BEP)
  - Information delivery schedule
  - Level of information need
  - Common data environment (CDE)
  - Information exchanges
  - Model validation
  - Information delivery milestones
  - Security protocols
```

#### ISO 9001 (Quality Management)
**Description**: Quality management systems  
**Use Cases**: Quality assurance, process documentation  

**Template Requirements**:
```yaml
Document Structure:
  - Quality policy
  - Quality objectives
  - Process documentation
  - Procedures and work instructions
  - Quality control plans
  - Inspection and testing
  - Non-conformance handling
  - Corrective actions
  - Management review
  - Continuous improvement
```

#### ISO 14001 (Environmental Management)
**Description**: Environmental management systems  
**Use Cases**: Environmental compliance, sustainability reporting  

**Template Requirements**:
```yaml
Document Structure:
  - Environmental policy
  - Environmental aspects
  - Legal requirements
  - Objectives and targets
  - Environmental programs
  - Monitoring and measurement
  - Environmental performance
  - Incident reporting
  - Compliance audits
  - Management review
```

#### ISO 45001 (Occupational Health & Safety)
**Description**: Occupational health and safety management systems  
**Use Cases**: Safety management, risk assessment  

**Template Requirements**:
```yaml
Document Structure:
  - OH&S policy
  - Hazard identification
  - Risk assessment
  - Legal requirements
  - OH&S objectives
  - Safety programs
  - Emergency procedures
  - Incident investigation
  - Performance monitoring
  - Management review
```

---

### EU Directives

#### CPR (Construction Products Regulation 305/2011)
**Description**: Harmonized conditions for marketing construction products  
**Use Cases**: Product compliance, CE marking  

**Template Requirements**:
```yaml
Document Structure:
  - Product identification
  - Essential characteristics
  - Harmonized standard (hEN)
  - Declaration of performance (DoP)
  - CE marking information
  - Performance classes
  - Test results
  - Certification body
  - Manufacturer declaration
```

#### EN Eurocodes (1990-1999)
**Description**: Structural design standards  
**Use Cases**: Structural calculations, design documentation  
**Key Codes**:
- **EN 1990**: Basis of structural design
- **EN 1991**: Actions on structures
- **EN 1992**: Concrete structures
- **EN 1993**: Steel structures
- **EN 1994**: Composite structures
- **EN 1995**: Timber structures
- **EN 1996**: Masonry structures
- **EN 1997**: Geotechnical design
- **EN 1998**: Seismic design
- **EN 1999**: Aluminum structures

**Template Requirements**:
```yaml
Document Structure:
  - Design basis (EN 1990)
  - Load assumptions (EN 1991)
  - Material properties
  - Design calculations
  - Safety factors
  - Load combinations
  - Structural analysis
  - Design verification
  - Detailing requirements
  - Construction specifications
```

#### CSRD (Corporate Sustainability Reporting Directive)
**Description**: ESG reporting requirements  
**Use Cases**: Sustainability reporting, ESG compliance  

**Template Requirements**:
```yaml
Document Structure:
  - Company information
  - Governance structure
  - Environmental impacts
  - Social impacts
  - Business model
  - Sustainability policies
  - Targets and KPIs
  - Risk assessment
  - Due diligence
  - Performance metrics
  - Third-party assurance
```

---

### BIM Standards

#### IFC (Industry Foundation Classes - ISO 16739)
**Description**: Open BIM data model  
**Use Cases**: Model exchange, interoperability  
**Current Version**: IFC 4.3

**Template Requirements**:
```yaml
Document Structure:
  - IFC schema version
  - Model view definition (MVD)
  - Exchange requirements
  - IFC entities used
  - Property sets (Psets)
  - Quantity sets (Qsets)
  - Classification systems
  - Coordinate system
  - Units
  - Model validation report
```

#### BCF (BIM Collaboration Format)
**Description**: Issue management for BIM projects  
**Use Cases**: Coordination, issue tracking  
**Current Version**: BCF 2.1

**Template Requirements**:
```yaml
Document Structure:
  - Topic identification
  - Issue type
  - Status (Open/Resolved/Closed)
  - Priority
  - Assigned to
  - Due date
  - Description
  - Viewpoint (camera position)
  - Snapshot image
  - Comments and responses
  - Related documents
```

#### COBie (Construction Operations Building Information Exchange)
**Description**: Facility management data handover  
**Use Cases**: Operations and maintenance, asset management  

**Template Requirements**:
```yaml
Document Structure:
  - Facility information
  - Floor/space data
  - Equipment/asset data
  - Component details
  - System information
  - Spare parts
  - Warranty information
  - Maintenance schedules
  - Contact information
  - Document references
```

---

### Environmental Standards

#### EN 15978 (Carbon Assessment) ⭐ CRITICAL
**Description**: Assessment of environmental performance of buildings - Calculation method  
**Use Cases**: Life cycle assessment, carbon footprint, Fit for 55 compliance  
**Importance**: **CRITICAL for DWS IQ 6 platform**

**Life Cycle Stages**:
- **A1-A3**: Product stage (materials)
- **A4-A5**: Construction process
- **B1-B7**: Use stage (operations, maintenance)
- **C1-C4**: End of life
- **D**: Benefits beyond system boundary

**Template Requirements**:
```yaml
Document Structure:
  # Project Information
  - Project identification
  - Building type and use
  - Reference study period
  - System boundaries
  - Functional equivalent
  
  # Life Cycle Inventory (LCI)
  - Material quantities (A1-A3)
  - Transport data (A4)
  - Construction processes (A5)
  - Energy consumption (B6)
  - Water consumption (B7)
  - Maintenance activities (B2-B5)
  - End of life scenarios (C1-C4)
  - Recycling benefits (D)
  
  # Environmental Indicators
  - Global Warming Potential (GWP) [kg CO2-eq]
  - Ozone Depletion Potential (ODP)
  - Acidification Potential (AP)
  - Eutrophication Potential (EP)
  - Photochemical Ozone Creation (POCP)
  - Abiotic Depletion (ADP)
  - Primary Energy (PE)
  
  # Results by Life Cycle Stage
  - A1-A3: Product stage impacts
  - A4-A5: Construction stage impacts
  - B1-B7: Use stage impacts
  - C1-C4: End of life impacts
  - D: Benefits and loads
  
  # Carbon Footprint Summary
  - Total embodied carbon
  - Operational carbon
  - Life cycle carbon
  - Carbon intensity (kg CO2-eq/m²)
  
  # Fit for 55 Compliance
  - EU taxonomy alignment
  - DNSH (Do No Significant Harm) assessment
  - Minimum safeguards
  - Technical screening criteria
  
  # Data Quality
  - Data sources (EPDs, databases)
  - Data quality assessment
  - Uncertainty analysis
  - Assumptions and limitations
  
  # Reporting
  - Executive summary
  - Detailed results tables
  - Graphical presentations
  - Comparison scenarios
  - Recommendations
  - Third-party verification
```

**DWS IQ 6 Integration**:
```yaml
Real-Time Carbon Tracking:
  - Material carbon tracking by project phase
  - Construction activity carbon monitoring
  - Energy consumption tracking (B6)
  - Transportation impact tracking (A4)
  - Maintenance carbon allocation (B2-B5)
  
Dashboard KPIs:
  - Carbon intensity (kg CO2-eq/m²)
  - Carbon budget vs. actual
  - Carbon reduction targets
  - Phase-wise carbon breakdown
  - Benchmark comparisons
  
Alerts and Notifications:
  - Carbon budget threshold alerts
  - High-carbon material warnings
  - Optimization opportunities
  - Compliance status updates
```

#### LEED (Leadership in Energy and Environmental Design)
**Description**: Green building certification system  
**Use Cases**: Sustainability certification, green building  

**Template Requirements**:
```yaml
Document Structure:
  - Project registration
  - LEED rating system (BD+C, O+M, etc.)
  - Credit categories
  - Prerequisites compliance
  - Credit documentation
  - Performance data
  - Verification evidence
  - Certification level target
  - Submission templates
```

#### BREEAM (Building Research Establishment Environmental Assessment Method)
**Description**: Sustainability assessment method  
**Use Cases**: Building certification, sustainability rating  

**Template Requirements**:
```yaml
Document Structure:
  - Project details
  - BREEAM scheme
  - Category assessments
  - Credit evidence
  - Performance calculations
  - Innovation credits
  - Target rating
  - Assessment report
  - Certification documentation
```

#### DGNB (Deutsche Gesellschaft für Nachhaltiges Bauen)
**Description**: German sustainable building certification  
**Use Cases**: Sustainability certification (German-speaking markets)  

**Template Requirements**:
```yaml
Document Structure:
  - Building type
  - DGNB version
  - Quality profiles (6 categories)
  - Criteria assessment
  - Performance indicators
  - Weighting factors
  - Total degree of fulfillment
  - Certificate level (Bronze/Silver/Gold/Platinum)
  - Documentation evidence
```

---

## EN 15978 Carbon Reporting

### Critical Importance for DWS IQ 6

EN 15978 carbon reporting is **CRITICAL** for the DWS IQ 6 platform because:

1. **Fit for 55 Compliance**: EU's package to reduce greenhouse gas emissions by 55% by 2030
2. **EU Taxonomy**: Alignment with sustainable finance regulations
3. **CSRD Requirements**: Corporate sustainability reporting directive
4. **Client Demand**: Enterprise construction companies require carbon tracking
5. **Competitive Advantage**: Real-time carbon monitoring differentiates DWS IQ 6

### Implementation Strategy

#### Phase 1: Data Collection (Immediate)
```yaml
Data Sources:
  - Material quantities from project schedules
  - EPD (Environmental Product Declaration) database
  - Energy consumption from site monitoring
  - Transportation data from logistics
  - Equipment usage from site operations
  
Integration Points:
  - DWS IQ 6 Dashboard: Real-time project data
  - Supabase: Carbon factor database
  - Firehorse CMS: EPD library
  - Site Edge Nodes: Energy monitoring
```

#### Phase 2: Calculation Engine (Q1 2026)
```yaml
Calculation Modules:
  - A1-A3: Material carbon calculator
  - A4: Transportation carbon calculator
  - A5: Construction process calculator
  - B6: Operational energy calculator
  - C1-C4: End of life calculator
  
Output:
  - Real-time carbon tracking
  - Phase-wise breakdown
  - Carbon intensity metrics
  - Benchmark comparisons
```

#### Phase 3: Reporting & Compliance (Q2 2026)
```yaml
Report Templates:
  - EN 15978 compliant reports
  - Fit for 55 compliance statements
  - EU Taxonomy alignment reports
  - CSRD sustainability reports
  - Client-specific formats
  
Automation:
  - Automated report generation
  - Scheduled reporting
  - Alert notifications
  - Compliance tracking
```

### Carbon Data Model (Supabase Schema)

```sql
-- Carbon Factors Database
CREATE TABLE carbon_factors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_name TEXT NOT NULL,
  material_category TEXT NOT NULL,
  gwp_a1a3 DECIMAL(10,4), -- kg CO2-eq per unit
  unit TEXT NOT NULL, -- kg, m3, m2, etc.
  data_source TEXT, -- EPD, database name
  region TEXT, -- Nordic, Central Europe, etc.
  valid_from DATE,
  valid_to DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Project Carbon Tracking
CREATE TABLE project_carbon (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  life_cycle_stage TEXT, -- A1-A3, A4, A5, B1-B7, C1-C4, D
  material_id UUID REFERENCES carbon_factors(id),
  quantity DECIMAL(12,2),
  unit TEXT,
  carbon_emission DECIMAL(12,4), -- kg CO2-eq
  calculation_date DATE,
  data_quality TEXT, -- High, Medium, Low
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Carbon Budget
CREATE TABLE carbon_budget (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  target_carbon DECIMAL(12,2), -- kg CO2-eq
  target_intensity DECIMAL(8,2), -- kg CO2-eq/m2
  current_carbon DECIMAL(12,2),
  current_intensity DECIMAL(8,2),
  budget_status TEXT, -- On Track, At Risk, Over Budget
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Carbon Reports
CREATE TABLE carbon_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  report_type TEXT, -- EN 15978, Fit for 55, CSRD
  report_date DATE,
  reporting_period TEXT,
  total_carbon DECIMAL(12,2),
  carbon_intensity DECIMAL(8,2),
  report_data JSONB, -- Full report structure
  pdf_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verifier TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Implementation Guide

### Step 1: Template Selection

Use the [Template Selection Matrix](#template-selection-matrix) to identify required standards based on:
- Project location (country/region)
- Project type (building/infrastructure)
- Client requirements
- Regulatory requirements
- Certification targets

### Step 2: Template Configuration

```yaml
Template Configuration File:
  project:
    id: "PROJECT-001"
    name: "Nordic Office Complex"
    location: "Helsinki, Finland"
    type: "Building"
    
  standards:
    primary:
      - RT Cards (Finland)
      - RYL 2010
      - ISO 19650 (BIM)
      - EN 15978 (Carbon)
    
    secondary:
      - ISO 9001 (Quality)
      - ISO 14001 (Environment)
      - ISO 45001 (Safety)
    
  languages:
    - Finnish
    - Swedish
    - English
    
  carbon_reporting:
    enabled: true
    target_intensity: 450 # kg CO2-eq/m2
    reporting_frequency: "Monthly"
    
  integration:
    dws_iq_dashboard: true
    supabase_storage: true
    firehorse_cms: true
```

### Step 3: Data Mapping

Map DWS IQ 6 dashboard data to template fields:

```yaml
Data Mapping:
  # Project Information
  project.id → Template.ProjectID
  project.name → Template.ProjectName
  project.region → Template.Location
  
  # Schedule Data
  project.percentComplete → Template.Progress
  project.phase → Template.CurrentPhase
  
  # Cost Data
  project.budget → Template.TotalBudget
  project.actualCost → Template.ActualCost
  project.cpi → Template.CostPerformanceIndex
  
  # Quality Data
  project.qualityRag → Template.QualityStatus
  alerts.quality → Template.QualityIssues
  
  # Safety Data
  project.safetyRag → Template.SafetyStatus
  alerts.safety → Template.SafetyIncidents
  
  # Carbon Data (EN 15978)
  carbon.totalEmissions → Template.CarbonFootprint
  carbon.intensity → Template.CarbonIntensity
  carbon.byPhase → Template.LifeCycleBreakdown
```

### Step 4: Report Generation

```javascript
// Firehorse Report Generation
async function generateReport(projectId, templateType) {
  // 1. Fetch project data from DWS IQ 6
  const projectData = await fetchProjectData(projectId);
  
  // 2. Fetch carbon data (EN 15978)
  const carbonData = await fetchCarbonData(projectId);
  
  // 3. Load template
  const template = await loadTemplate(templateType);
  
  // 4. Map data to template
  const reportData = mapDataToTemplate(projectData, carbonData, template);
  
  // 5. Generate report
  const report = await renderReport(reportData, template);
  
  // 6. Save to Supabase
  await saveReport(report);
  
  // 7. Return report URL
  return report.url;
}
```

### Step 5: Automation

Configure automated report generation:

```yaml
Automation Rules:
  - trigger: "Monthly"
    reports:
      - EN 15978 Carbon Report
      - Project Status Report (RT format)
      - Quality Report (ISO 9001)
    
  - trigger: "Phase Completion"
    reports:
      - Phase Completion Report
      - Carbon Phase Report
      - Quality Acceptance Report
    
  - trigger: "Alert Threshold"
    condition: "carbon_budget > 90%"
    reports:
      - Carbon Budget Alert
      - Optimization Recommendations
```

---

## Template Selection Matrix

| Country | Building Projects | Infrastructure Projects | BIM Required | Carbon Reporting |
|---------|------------------|------------------------|--------------|------------------|
| 🇫🇮 Finland | RT Cards, RYL | InfraRYL | IFC/BCF | EN 15978 |
| 🇸🇪 Sweden | AMA Hus, MBR | AMA Anläggning | IFC/BCF | EN 15978 |
| 🇳🇴 Norway | NS 8405/8406 | NS 3420, FDV | IFC/BCF | EN 15978 |
| 🇩🇰 Denmark | BR, BEK | CAB | IFC/BCF | EN 15978 |
| 🇩🇪 Germany | VOB/B, VOB/C, DIN 276 | VOB/C, DIN 18205 | IFC/BCF | EN 15978 |
| 🇦🇹 Austria | ÖNORM B, A 2063 | LM.VM | IFC/BCF | EN 15978 |
| 🇨🇭 Switzerland | SIA 118, eBKP-H | SIA 118 | IFC/BCF | EN 15978 |
| 🇳🇱 Netherlands | STABU, NEN 2574 | RAW Bestek | IFC/BCF | EN 15978 |
| 🇧🇪 Belgium | NBN B, Bestek | NBN B, Bestek | IFC/BCF | EN 15978 |

**Additional Requirements (All Countries)**:
- ISO 9001 (Quality Management)
- ISO 14001 (Environmental Management)
- ISO 45001 (Occupational Health & Safety)
- ISO 19650 (BIM Information Management)

---

## Compliance Checklist

### Pre-Project Setup
- [ ] Identify project location and applicable standards
- [ ] Determine client-specific template requirements
- [ ] Configure template standards in Firehorse
- [ ] Set up carbon tracking (EN 15978)
- [ ] Configure data mapping from DWS IQ 6
- [ ] Set up automated reporting schedules

### During Project Execution
- [ ] Collect real-time data from DWS IQ 6 dashboard
- [ ] Track carbon emissions by life cycle stage
- [ ] Generate periodic compliance reports
- [ ] Monitor carbon budget vs. actual
- [ ] Update templates with project-specific data
- [ ] Maintain document version control

### Project Completion
- [ ] Generate final EN 15978 carbon report
- [ ] Complete FDV/O&M documentation (if required)
- [ ] Prepare handover documentation
- [ ] Archive all reports in Supabase
- [ ] Conduct compliance verification
- [ ] Obtain third-party verification (if required)

### Post-Project
- [ ] Monitor operational carbon (B6-B7)
- [ ] Update carbon reports annually
- [ ] Track maintenance activities (B2-B5)
- [ ] Support CSRD sustainability reporting
- [ ] Maintain certification compliance

---

## Support and Resources

### Documentation
- **Firehorse Quick Start**: `Firehorse/QUICK_START.md`
- **Integration Guide**: `Firehorse/INTEGRATION_GUIDE.md`
- **Template Library**: `Firehorse/templates/`

### Contact
- **Technical Support**: support@dws6.com
- **Carbon Reporting**: carbon@dws6.com
- **Template Requests**: templates@dws6.com

### External Resources
- **EN 15978**: [ISO 15978:2011](https://www.iso.org/)
- **Fit for 55**: [EU Climate Action](https://ec.europa.eu/clima/eu-action/fit-for-55_en)
- **buildingSMART**: [IFC/BCF Standards](https://www.buildingsmart.org/)

---

**Document Version**: 1.0  
**Last Updated**: December 30, 2025  
**Next Review**: March 31, 2026  
**Owner**: Firehorse Product Team

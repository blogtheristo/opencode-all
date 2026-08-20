# DWS IQ Private Sales Pack v1.0

## Executive Deck

### Slide 1: Executive Summary & Core Challenge
**Title:** Accelerating Compliance Response in Nordic Construction & Industrial Tenders  
**Subtitle:** Streamlining EN 15978, EPBD, and CSRD Reporting from ERP and BIM Inputs

• The Operational Challenge: High-value tenders increasingly mandate verified EN 15978 lifecycle carbon calculations (A1–D stages). Manual spreadsheet processes often take weeks per bid, consuming valuable engineering hours and introducing version-control risk.
• The Solution: A structured ingestion pipeline that connects to your existing ERP (Visma, IFS, SAP) and BIM data, mapping operational inputs into standardized reporting formats.
• Target Outcome: Once data schemas are mapped and validated, report generation takes under 90 seconds—turning compliance overhead into a responsive bid asset.

### Slide 2: Transparent Commercial Structure
**Title:** Commercial Structure: €8,499 Total First-Year Investment  
**Subtitle:** Fixed-Scope Onboarding with Predictable Renewal Terms

• First-Year Financial Summary: €8,499 Total First-Year Commitment
• €6,500 One-Time Setup & Onboarding: Co-designed Kickoff Workshop, data schema mapping, ERP connector configuration, and guided pilot execution. (Non-refundable once services are delivered).
• €1,999 / Year Platform License: Grants access to the DWS IQ Base Engine and Firehorse Report Generator module for Year 1.
• Renewal Terms: The €1,999/year software license renews annually after Year 1. Future connector expansions or additional site implementations are scoped separately.
• Standalone Benchmark Value: DWS IQ Base Engine (€4,999/yr list) + Firehorse Report Module (€1999/yr list) + Implementation Workshop (€3,000 list) = €9,998 total standalone list price (€1,499 bundled entry discount).

### Slide 3: 4-Week Technical Verification Pilot & Acceptance Gate
**Title:** Scoped 4-Week Technical Verification Pilot  
**Subtitle:** Operational Milestones Anchored by a 30-Day Technical Acceptance Gate

**Timeline**
**Milestone Focus**
**Technical Deliverables**

Week 1
Scope & Data Boundary
Define 1 active project/site; map source data schemas to EN 15978 / ESRS E1.

Week 2
Connector Integration
Configure flat CSV exports or direct ERP/BIM connectors (Visma, IFS, SAP).

Week 3
Factor Mapping
Execute automated factor mapping across A1–D stages using verified EPD sources.

Week 4
Verification & Sign-Off
Export a deterministic, hash-verified report matching your required board format.

• 30-Day Acceptance Gate Clock: The 30-day acceptance clock starts only after the Customer has delivered all agreed prerequisite site data and assigned the designated technical contact.
• Clock Pause Safeguard: The acceptance clock automatically pauses if submitted data is corrupted, incomplete, or modified during testing, resuming upon receipt of corrected data.
• Clear Refund Terms: If the system fails the technical calculation validation check within the 30-day window, the €1,999 software license fee is 100% refunded. (Setup fees cover completed technical labor and are non-refundable).

### Slide 4: Data Governance & Technical Isolation
**Title:** European Data Residency & Traceable Governance  
**Subtitle:** Architecture Designed for Operational Privacy and Audit Readiness

• EU-Hosted Primary Infrastructure: Primary application data and customer databases reside within designated EU regions (Hetzner Helsinki / GCP europe-north1). Limited subprocessor exceptions (e.g., global CDN, encrypted diagnostic telemetry) are governed under formal DPA transfer mechanisms.
• Model Privacy & Subprocessor Alignment: Customer data is kept strictly isolated. Under standard enterprise subprocessor terms for our active architecture, customer inputs and outputs are never retained or used to train foundational third-party models.
• Traceable Audit Evidence: Built-in immutable transaction logging supports customer audit workflows and evidence generation for internal governance and regulatory reviews.
• Optional Air-Gapped Deployment: On-premise hardware options (NVIDIA DGX Spark / Acer GN100) allow execution entirely within your local facility VLAN where required.

### Slide 5: Value Validation & Next Steps
**Title:** Value Verification & Pilot Scoping  
**Subtitle:** Measuring Operational Savings in Your Environment

• Labor Reduction Hypothesis: Assuming a typical manual baseline of ~200 hours per major reporting cycle at an internal rate of €75/hr, successful automation targets an estimated €15,000 in operational labor savings—to be formally measured and validated during the pilot.
• Commercial Velocity: Reducing report output times helps teams submit verified tender requirements faster and handle higher bid volumes.
• Traceable Workspace: Replaces fragile spreadsheets with a traceable reporting workspace and calculation engine.

**Recommended Next Steps:**
1. Select 1 target construction project or industrial site for pilot scoping.
2. Conduct a 30-minute Data Architecture Review with IT and Compliance leads.
3. Execute the Order Form & Pilot Agreement Packet.

## Technical Architecture

### Firehorse Starter Architecture
- DWS IQ Base Platform with EU data residency
- Firehorse Report Module for automated reporting
- Integration with ERP/BIM systems
- Cloud infrastructure: Hetzner Helsinki, GCP europe-north1
- Security: AES-256 encryption, TLS 1.3, RBAC controls

### DWS IQ EU Sovereign Starter
- Sovereign infrastructure with EU-hosted data
- Enhanced DPA compliance
- Full data residency controls
- Subprocessor management with SCC compliance

### Aegis Pilot
- Vulnerability scanning platform
- Patch management automation
- Compliance reporting dashboard
- Integration with existing security tools

### DWS IQ Climate Intelligence
- AI-powered climate intelligence engine
- Regulatory compliance modules
- Strategic planning tools
- Real-time data processing

### Control Room
- On-premise hardware appliance
- Complete air-gapped deployment
- NVIDIA DGX Spark integration
- Local processing with complete control

## ROI Assumptions

### Firehorse Starter
- Labor savings: 200 hours per reporting cycle at €75/hr = €15,000 savings
- Reduced error rate: 95% reduction in manual errors
- Faster compliance turnaround: 80% faster reporting

### DWS IQ EU Sovereign Starter
- Data sovereignty compliance: 100% EU data residency
- Reduced compliance risk: 70% reduction in compliance issues
- Enhanced security: 90% improvement in security posture

### Aegis Pilot
- Reduced vulnerability exposure: 85% reduction in known vulnerabilities
- Faster patch deployment: 95% faster patch management
- Compliance reporting: 100% automated compliance reporting

### DWS IQ Climate Intelligence
- Strategic decision making: 60% better insights
- Regulatory compliance: 95% improved compliance
- Risk mitigation: 75% reduction in climate-related risks

### Control Room
- Complete air-gapped deployment: 100% data control
- Reduced external dependencies: 90% fewer security incidents
- Maximum compliance: 100% compliance with strict requirements

## Security & DPA Material

### Data Processing Addendum (DPA)
This Data Processing Addendum ("DPA") supplements the MSA and governs the processing of Personal Data under EU Regulation 2016/679 (GDPR).

#### 1. Roles & Processing Details
• Roles: Customer acts as Data Controller; Provider acts as Data Processor.
• Categories of Data Subjects: Customer employees, system users, technical contacts, and facility operators.
• Categories of Personal Data: User identification data (name, work email, IP address, job title, login logs, user role assignments).
• Nature & Purpose of Processing: Providing user authentication, role-based access control, system telemetry, automated report generation, and customer support for the DWS IQ platform.

#### 2. Processor Obligations
• Instructions: Provider shall process Personal Data solely on documented, written instructions from Controller, including with respect to transfers of Personal Data outside the EEA.
• Confidentiality: Provider ensures that personnel authorized to process Personal Data have committed themselves to confidentiality.
• Security Measures: Provider implements appropriate technical and organizational measures (Encryption at rest via AES-256, TLS 1.3 in transit, role-based access control, quarterly vulnerability scanning).
• Data Subject Requests (DSRs): Taking into account the nature of processing, Provider shall assist Controller by appropriate technical measures in fulfilling Controller's obligations to respond to DSRs under Chapter III GDPR. Provider shall notify Controller within three (3) business days if it receives a DSR directly.
• Personal Data Breach Notification: Provider shall notify Controller without undue delay, and no later than forty-eight (48) hours, after becoming aware of a confirmed Personal Data Breach affecting Controller's data.

#### 3. Subprocessors & Audit Rights
• Authorized Subprocessors: Controller grants general authorization to Provider to engage subprocessors. Current approved subprocessors include:
• Hetzner Online GmbH (Hosting Infrastructure - Germany/Finland)
• Google Cloud EMEA Ltd (Cloud Platform Infrastructure - Finland/Ireland)
• Subprocessor Changes: Provider shall notify Controller at least fourteen (14) days prior to onboarding any new subprocessor. Controller may object on reasonable data protection grounds within ten (10) days.
• Retention & Deletion: Upon termination of the Agreement, Provider shall, at Customer's election, delete or return all Customer Personal Data within thirty (30) calendar days, certifying deletion in writing, unless EU/Finnish law requires continued storage.
• Audit Rights: Provider shall make available to Controller information necessary to demonstrate compliance with GDPR Article 28. Controller may conduct an audit (including inspections) once per 12-month period upon thirty (30) days' written notice, at Controller's sole expense and subject to strict operational security rules.

## Pilot Statement of Work (SOW)

### 1. Scope & Customer Prerequisites
• Scope: Provider shall configure one (1) data ingestion pipeline for one (1) Customer-designated facility or project portfolio to map operational inputs into EN 15978 / ESRS E1 calculation schemas.
• Prerequisite Delivery: Customer must deliver (a) complete, uncorrupted source data exports (CSV, BIM/IFC, or ERP staging access) and (b) written assignment of one (1) technical point of contact.
• Clock Trigger & Pause Mechanics: The 30-day pilot clock starts the business day after Provider confirms prerequisite receipt in writing. If data delivered is corrupted, structurally incomplete, or modified mid-pilot, Provider will notify Customer in writing, and the 30-day clock will be paused until valid replacement data is received.

### 2. Technical Validation & Refund Trigger
• Definition of "Mathematical Verification": "Mathematical Verification" and "Validation" mean strictly that the software executes automated arithmetic calculations, unit conversions, and factor lookups across supplied inputs without software execution errors or broken schema references. Validation does not constitute certification of legal, regulatory, or accounting correctness, which remains the sole responsibility of Customer.
• Refund Logic: If the platform fails to achieve Technical Validation within thirty (30) active elapsed days of the pilot clock, Provider is granted a ten (10) business day cure period. If software defects prevent Validation upon expiration of the cure period, Customer may terminate the pilot and receive a 100% refund of the €1,999 Platform License Fee.
• Refund Payment Timing: Approved refunds shall be processed to Customer's designated bank account within fourteen (14) calendar days of written termination approval. Setup and onboarding fees (€6,500) cover completed technical labor and are non-refundable once delivered.

## Order Form

Provider: Lifetime Oy (Business ID: FI31298451)  
Customer Legal Entity: [Customer Company Name]  
Effective Date: Date of Last Signature

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ORDER SUMMARY & FEES                                      │
├──────────────────────────────────────────┬───────────────────────┬──────────────────────────┤
│ Line Item Description                    │ Billing Frequency     │ Net Fee (EUR)            │
├──────────────────────────────────────────┼───────────────────────┼──────────────────────────┤
│ DWS IQ Platform & Firehorse Report SaaS  │ Annual (Upfront)      │ €1,999.00 *              │
│ Setup, Onboarding & Data Mapping SOW     │ One-Time              │ €6,500.00                │
├──────────────────────────────────────────┴───────────────────────┼──────────────────────────┤
│ TOTAL INITIAL ORDER VALUE (excl. VAT)                            │ €8,499.00                │
└──────────────────────────────────────────────────────────────────┴──────────────────────────┘

* Subject to 30-day technical acceptance gate refund terms per Appendix C1.

### Key Commercial Terms

• Payment Terms: Net 14 days from invoice date. All fees are exclusive of Value Added Tax (VAT) or local statutory taxes.
• Term & Auto-Renewal: The initial Subscription Term is twelve (12) months from the Effective Date. The subscription automatically renews for successive 12-month periods at the standard annual rate (€1,999/yr) unless either Party provides written notice of non-renewal at least thirty (30) calendar days prior to the expiration of the active term.
• 30-Day Clock Execution & Data-Pause Rule: The 30-day pilot execution clock commences on the business day following Provider's written confirmation of prerequisite receipt (data exports + designated contact). If Customer submits incomplete, corrupted, or altered data schema exports, the 30-day clock pauses automatically upon written notice from Provider and resumes only upon receipt of corrected data.
• Service Availability Target: Target platform uptime is 99.5% per calendar month during Core Hours (Mon–Fri, 08:00–18:00 EET), calculated per Schedule C3.
• Suspension Rights: Provider reserves the right to suspend cloud access in the event of undisputed invoices exceeding thirty (30) days past due, following a 7-day written cure notice.
• Governing Documents: This Order Form is governed by the attached Master Services Agreement (MSA), Data Processing Addendum (DPA), and Pilot Statement of Work (SOW).

Customer Signature: ___________________________ Date: _______________  
Provider Signature: ___________________________ Date: _______________
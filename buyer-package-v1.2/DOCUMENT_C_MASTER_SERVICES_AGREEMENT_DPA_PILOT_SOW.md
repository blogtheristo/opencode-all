# DOCUMENT C: MASTER SERVICES AGREEMENT, DPA & PILOT SOW

## APPENDIX C1: PILOT STATEMENT OF WORK (SOW)

### 1. Scope & Customer Prerequisites
• Scope: Provider shall configure one (1) data ingestion pipeline for one (1) Customer-designated facility or project portfolio to map operational inputs into EN 15978 / ESRS E1 calculation schemas.
• Prerequisite Delivery: Customer must deliver (a) complete, uncorrupted source data exports (CSV, BIM/IFC, or ERP staging access) and (b) written assignment of one (1) technical point of contact.
• Clock Trigger & Pause Mechanics: The 30-day pilot clock starts the business day after Provider confirms prerequisite receipt in writing. If data delivered is corrupted, structurally incomplete, or modified mid-pilot, Provider will notify Customer in writing, and the 30-day clock will be paused until valid replacement data is received.

### 2. Technical Validation & Refund Trigger
• Definition of "Mathematical Verification": "Mathematical Verification" and "Validation" mean strictly that the software executes automated arithmetic calculations, unit conversions, and factor lookups across supplied inputs without software execution errors or broken schema references. Validation does not constitute certification of legal, regulatory, or accounting correctness, which remains the sole responsibility of Customer.
• Refund Logic: If the platform fails to achieve Technical Validation within thirty (30) active elapsed days of the pilot clock, Provider is granted a ten (10) business day cure period. If software defects prevent Validation upon expiration of the cure period, Customer may terminate the pilot and receive a 100% refund of the €1,999 Platform License Fee.
• Refund Payment Timing: Approved refunds shall be processed to Customer's designated bank account within fourteen (14) calendar days of written termination approval. Setup and onboarding fees (€6,500) cover completed technical labor and are non-refundable once delivered.

## APPENDIX C2: MASTER SERVICES AGREEMENT (MSA) CORE TERMS

### 1. Hosting Scope & Infrastructure Boundaries
• Primary Hosting Regions: Primary production databases and core computational workloads reside in European Union facilities (specifically Hetzner Helsinki, Finland, and Google Cloud Region europe-north1, Hamina, Finland).
• Disclosed Operational Exceptions: Customer acknowledges that global edge routing, content delivery networks (e.g., Cloudflare), static telemetry logging, or localized support access may process encrypted metadata outside primary regions. Where cross-border transfers occur, Provider relies on Standard Contractual Clauses (SCCs) or adequacy decisions.

### 2. Limitation of Liability (Finnish Law Alignment)
• Liability Cap: Subject to Section 2.2, each Party's aggregate financial liability under this Agreement shall be limited to the total fees paid or payable by Customer under the Order Form in the twelve (12) months preceding the claim (€8,499).
• Carve-Outs: The liability cap in Section 2.1 shall not apply to:
1. Breach of confidentiality obligations under Section 4.
2. Breach of Section 3 (Intellectual Property Rights).
3. Damages caused by gross negligence (törkeä tuottamus) or willful misconduct (Tahallisuus) under Finnish law.
4. Direct statutory liability under Applicable Data Protection Law (GDPR Article 82 allocations).

### 3. Service Level Agreement (SLA) & Uptime Measurement
• Availability Target: Provider targets 99.5% Service Availability during Core Hours (Mon–Fri, 08:00–18:00 EET), calculated monthly as follows: 
$$\text{Uptime \%} = \left( \frac{\text{Total Core Minutes} - \text{Unscheduled Downtime Minutes}}{\text{Total Core Minutes}} \right) \times 100$$
• Excluded Downtime: The calculation excludes downtime resulting from:
1. Emergency or pre-notified scheduled maintenance (notified 48 hours in advance).
2. Force Majeure events or internet backhaul failures outside Provider's control.
3. Customer-caused configurations, bad data payloads, or third-party API outage (e.g., Customer's ERP instance offline).
• Service Credit Remedy: If Monthly Uptime falls below 95.0% in a calendar month, Customer's sole and exclusive remedy shall be a credit equal to 10% of the prorated monthly license fee (€16.65), applicable against the subsequent renewal invoice.

## APPENDIX C3: DATA PROCESSING ADDENDUM (DPA)
This Data Processing Addendum ("DPA") supplements the MSA and governs the processing of Personal Data under EU Regulation 2016/679 (GDPR).

### 1. Roles & Processing Details
• Roles: Customer acts as Data Controller; Provider acts as Data Processor.
• Categories of Data Subjects: Customer employees, system users, technical contacts, and facility operators.
• Categories of Personal Data: User identification data (name, work email, IP address, job title, login logs, user role assignments).
• Nature & Purpose of Processing: Providing user authentication, role-based access control, system telemetry, automated report generation, and customer support for the DWS IQ platform.

### 2. Processor Obligations
• Instructions: Provider shall process Personal Data solely on documented, written instructions from Controller, including with respect to transfers of Personal Data outside the EEA.
• Confidentiality: Provider ensures that personnel authorized to process Personal Data have committed themselves to confidentiality.
• Security Measures: Provider implements appropriate technical and organizational measures (Encryption at rest via AES-256, TLS 1.3 in transit, role-based access control, quarterly vulnerability scanning).
• Data Subject Requests (DSRs): Taking into account the nature of processing, Provider shall assist Controller by appropriate technical measures in fulfilling Controller's obligations to respond to DSRs under Chapter III GDPR. Provider shall notify Controller within three (3) business days if it receives a DSR directly.
• Personal Data Breach Notification: Provider shall notify Controller without undue delay, and no later than forty-eight (48) hours, after becoming aware of a confirmed Personal Data Breach affecting Controller's data.

### 3. Subprocessors & Audit Rights
• Authorized Subprocessors: Controller grants general authorization to Provider to engage subprocessors. Current approved subprocessors include:
• Hetzner Online GmbH (Hosting Infrastructure - Germany/Finland)
• Google Cloud EMEA Ltd (Cloud Platform Infrastructure - Finland/Ireland)
• Subprocessor Changes: Provider shall notify Controller at least fourteen (14) days prior to onboarding any new subprocessor. Controller may object on reasonable data protection grounds within ten (10) days.
• Retention & Deletion: Upon termination of the Agreement, Provider shall, at Customer's election, delete or return all Customer Personal Data within thirty (30) calendar days, certifying deletion in writing, unless EU/Finnish law requires continued storage.
• Audit Rights: Provider shall make available to Controller information necessary to demonstrate compliance with GDPR Article 28. Controller may conduct an audit (including inspections) once per 12-month period upon thirty (30) days' written notice, at Controller's sole expense and subject to strict operational security rules.

## APPENDIX C4: MODULAR ADD-ONS & OPTIONAL UPGRADES

### 1. Software & Capacity Modules
• Additional Site / Portfolio License: €1,499 / year per additional site (expands data ingestion and reporting pipeline to additional operating units).
• Firehorse Signed Reports Module: €990 / year (enables cryptographically signed PDF/A exports with embedded cryptographic hash validation for internal compliance logging and external auditor reference).
• Multi-Tenant / Agency License Upgrade: €3,499 / year (enables general contractors to manage separate reporting environments for distinct sub-contractors).

### 2. On-Premise & Hardware Appliances (Air-Gap Deployment)
• Control Room Appliance (Acer Veriton GN100 + NVIDIA Model Install): €4,994 one-time (local hardware node for processing factory telemetry fully on-premise).
• Situation Room Bridged Setup (2× Acer Veriton GN100): €8,893 one-time (high-availability dual-node setup for multi-line facilities).
• NVIDIA DGX Spark Sovereign Edge AI: Custom quote upon request (enterprise edge compute for heavy multi-agent inference and complete offline operation).

### 3. Specialist Advisory & Implementation Sprints
• EU AI Act & NIS2 Evidence Sprint: €4,500 one-time (2-week technical review mapping local data governance and logging to support customer audit readiness).
• CSRD Data Pipeline Expansion Sprint: €3,500 one-time (custom connector setup for legacy or proprietary ERP instances outside standard Visma/IFS/SAP templates).
• Senior Compliance Retainer: €1,500 / month (ongoing access to technical compliance specialists for quarterly report validation).

## Notice on Legal Review
Counsel Review Notice: This Version 1.2 buyer package structures the commercial offer, operational guardrails, and data processing obligations into standard procurement formats. Before executing customer agreements, formal review by Finnish legal counsel should be completed to ensure local enforceability of liability carve-outs, audit rules, and statutory GDPR alignment.
# DWS IQ Private Technical & Security Pack

## Technical Architecture

### DWS IQ Platform
- **Core Infrastructure:** EU-hosted with sovereign infrastructure (Hetzner Helsinki, GCP europe-north1)
- **Data Processing:** PostgreSQL with pgvector, managed by Aiven
- **Agent Orchestration:** Governed skilled-agent fleet with KYA/Article-12 traceability
- **Deployment Models:** EU-Sovereign Cloud (Scaleway SaaS), Dedicated Sovereign Cloud (Aegis), On-Premise (NVIDIA DGX)
- **Security:** AES-256 encryption, TLS 1.3 in transit, role-based access control, quarterly vulnerability scanning

### EU Sovereign Infrastructure
- **Hosting Regions:** Hetzner Helsinki, Finland, and Google Cloud Region europe-north1, Hamina, Finland
- **Data Residency:** Primary application data and customer databases reside in EU regions
- **Subprocessors:** Hetzner Online GmbH (Hosting Infrastructure - Germany/Finland), Google Cloud EMEA Ltd (Cloud Platform Infrastructure - Finland/Ireland)
- **Cross-Border Transfers:** Rely on Standard Contractual Clauses (SCCs) or adequacy decisions

### Aegis Platform
- **Infrastructure:** UpCloud (Helsinki) / Hetzner infrastructure
- **Data Path:** No US-incorporated vendor in the data path
- **Control Plane:** Themis control plane with Article 12 pipeline
- **Dedicated Instance:** Not shared tenancy
- **Model Ownership:** Customer owns 100% of model weights

### Climate Intelligence Module
- **Data Sources:** Validated EU data sources for deterministic scoring
- **Processing:** EU-sovereign data processing
- **Compliance:** Fit for 55, CSRD, CBAM, ETS compliance automation
- **Reporting:** Audit-ready compliance outcomes

## Security & Compliance

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

## Known Limitations & Dependencies

### Limitations
1. **Data Integration Requirements:** All products require customer data integration capabilities
2. **Infrastructure Dependencies:** Aegis requires dedicated infrastructure
3. **Training Requirements:** Full adoption requires operator training
4. **Compliance Scope:** Products cover specific EU regulatory domains

### Dependencies
1. **Customer Data Sources:** Validated data sources required for deterministic outcomes
2. **Infrastructure Access:** Physical access required for on-premise deployments
3. **Network Connectivity:** Required for cloud deployments
4. **Legal Compliance:** All products must align with specific EU regulations

## Deployment Modes

### EU-Sovereign Cloud (SaaS)
- Scaleway serverless (Paris / Amsterdam)
- French-owned (Iliad Group)
- Zero US CLOUD Act exposure
- Scale-to-zero, pay-per-request

### Dedicated Sovereign Cloud (Aegis)
- UpCloud (Helsinki) / Hetzner
- Finnish jurisdiction, zero CLOUD Act
- Aiven managed PostgreSQL
- Themis control plane

### On-Premise (NVIDIA DGX)
- Control Room (Acer Veriton GN100) €5,294
- Situation Room (2× GN100) €10,093
- DGX Spark (NVIDIA GB10) €6,694
- IGX Orin (NVIDIA) €11,990
- Hardware capex required
- Fully air-gap capable
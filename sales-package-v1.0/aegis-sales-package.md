# DWS IQ Aegis Sales Package v1.0

## Executive Deck

### Slide 1: Executive Summary & Core Challenge
**Title:** Sovereign AI for Dual-Use Manufacturing and Critical Infrastructure  
**Subtitle:** Securing Europe's Defence Supply Chain with EU-Hosted, Single-Tenant AI

• The Operational Challenge: European defence and dual-use manufacturing sectors face increasing regulatory compliance requirements (CSRD, CBAM, NIS2, EU AI Act Article 12) while maintaining operational sovereignty and data control. Critical facilities require AI solutions that operate independently of US cloud dependencies and provide complete audit trails.

• The Solution: DWS IQ Aegis is a single-tenant sovereign AI platform designed specifically for dual-use factories, heavy manufacturing, and critical raw-material infrastructure. Deployed on dedicated Finnish infrastructure, it continuously optimizes and secures facilities that supply Europe's defence sector.

• Target Outcome: Zero US cloud dependencies, zero CLOUD Act exposure, and complete compliance with EU regulations while enabling continuous operation in air-gapped environments.

### Slide 2: Commercial Structure
**Title:** Commercial Structure: €59,990 Onboarding + €999/mo  
**Subtitle:** Tiered Pricing for Different Deployment Requirements

• First-Year Financial Summary: €59,990 Onboarding + €999/month (Standard Tier)
• €59,990 One-Time Onboarding & Integration: Includes dedicated Kubernetes cluster, Article 12 logging, KYA governance, and standard support.
• €999 / Month Platform License: Grants access to the full DWS IQ Aegis platform with 21 EU-regulated industries covered.
• Tiered Options: Defence tier (€1,999/mo) and Sovereign tier (€4,999/mo) for enhanced capabilities.
• Standalone Benchmark Value: DWS IQ Aegis Standard Tier (€59,990 onboarding + €999/mo) = €72,000 total first-year investment (compared to €920K for comparable Palantir engagement).

### Slide 3: 3-Month Aegis Pilot & Acceptance Gate
**Title:** Scoped 3-Month Aegis Pilot Validation  
**Subtitle:** Proving Local-First Operation Before Hardware Investment

**Timeline**
**Milestone Focus**
**Technical Deliverables**

Week 0–2
Scope & Data Boundary
Define site, workflow, deployment mode, isolation method, and three acceptance conditions.

Week 3–5
Local Substrate
Deploy execution runtime, local model serving, KYA identity, Article 12 logging, and kill authority on-site.

Week 6–9
Workflow Integration
Configure agent set, integrate with source systems, map decision points to Article 12 schema, and implement degraded-mode behaviour.

Week 10–11
Severed-Uplink Acceptance Test
Rehearsal run and acceptance run under agreed window with witness present.

Week 12–13
Sizing, Report & Decision
Production hardware sizing, before/after report, and written recommendation.

• 3-Month Pilot Clock: The 3-month pilot clock starts only after the Customer has delivered all agreed prerequisite data and assigned the designated technical contact.
• Clock Pause Safeguard: The pilot clock automatically pauses if submitted data is corrupted, incomplete, or modified during testing, resuming upon receipt of corrected data.
• Credit Terms: The €19,990 pilot is credited in full against Aegis onboarding if you proceed within 6 months.

### Slide 4: Data Governance & Technical Isolation
**Title:** EU Sovereign Infrastructure & Traceable Governance  
**Subtitle:** Architecture Designed for Maximum Compliance and Operational Privacy

• Finnish-Owned Infrastructure: All infrastructure is Finnish-owned (Tesi-backed), ISO 27001 certified, and operated by EU-only staff.
• Single-Tenant Deployment: Each customer has their own dedicated Kubernetes cluster, database, and agents with no shared infrastructure.
• CLOUD Act Exposure: Zero CLOUD Act exposure through Finnish ownership and EU-hosted infrastructure.
• Article 12 Logging: Full EU AI Act Article 12 compliance with reasoning lineage and audit-ready documentation.
• Firecracker MicroVM Isolation: Each agent runs in a separate Firecracker MicroVM with complete isolation.
• Agent Governance: KYA (Know Your Agent) framework with identity verification, kill authority, and forensic observability.

### Slide 5: Value Validation & Next Steps
**Title:** Value Verification & Pilot Scoping  
**Subtitle:** Measuring Operational Savings in Your Environment

• Reduced Compliance Risk: 100% EU compliance with no US jurisdiction exposure.
• Enhanced Security: Complete air-gapped operation with no shared infrastructure.
• Operational Independence: Control room workflows continue when network is down.
• Regulatory Efficiency: Automated compliance reporting with traceable evidence.
• Risk Mitigation: Eliminates CLOUD Act exposure and US jurisdiction risks.

**Recommended Next Steps:**
1. Select 1 target dual-use facility or manufacturing site for pilot scoping.
2. Conduct a 60-minute Architecture Review with IT and Compliance leads.
3. Execute the Order Form & Pilot Agreement Packet.

## Technical Architecture

### DWS IQ Aegis Platform
- Single-tenant sovereign AI platform for dual-use manufacturing
- Deployed on dedicated Finnish infrastructure (UpCloud Helsinki)
- 21 EU-regulated industries covered (excluding consumer-facing sectors)
- Article 12 logging and EU AI Act compliance
- Firecracker MicroVM isolation for each agent
- Dedicated Kubernetes cluster per customer
- Integration with existing industrial systems (ERP, BIM, SCADA)

### Aegis Pilot
- 3-month fixed-price engagement
- Proves complete local-first operational path
- Demonstrates five control-room requirements:
  1. Local execution and local evidence
  2. Local identity, logs and kill authority
  3. No network dependency for core outcome
  4. Cloud only for optional sync, backup or non-critical reporting
  5. Graceful degradation specified in advance
- Credit terms: €19,990 credited in full against Aegis onboarding if you proceed within 6 months

### DWS IQ Aegis Implementation Programme
- Additive engagement for complex deployments
- €45,000 fixed price
- Covers LWM integration, hardware procurement, multi-site rollout, and custom integrations
- Not credited against Aegis onboarding

## ROI Assumptions

### DWS IQ Aegis Platform
- Reduced compliance risk: 100% EU compliance with no US jurisdiction exposure
- Enhanced security: 90% improvement in security posture
- Operational independence: 100% network independent operation
- Compliance automation: 80% faster compliance reporting
- Risk mitigation: Zero CLOUD Act exposure and US jurisdiction risks

### Aegis Pilot
- Reduced vulnerability exposure: 85% reduction in known vulnerabilities
- Faster patch deployment: 95% faster patch management
- Compliance reporting: 100% automated compliance reporting
- Risk mitigation: Complete control over data and operations before major hardware investment
- Operational confidence: 100% validation of local-first operation before procurement

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
• UpCloud (Hosting Infrastructure - Finland)
• ISO 27001 certified
• Subprocessor Changes: Provider shall notify Controller at least fourteen (14) days prior to onboarding any new subprocessor. Controller may object on reasonable data protection grounds within ten (10) days.
• Retention & Deletion: Upon termination of the Agreement, Provider shall, at Customer's election, delete or return all Customer Personal Data within thirty (30) calendar days, certifying deletion in writing, unless EU/Finnish law requires continued storage.
• Audit Rights: Provider shall make available to Controller information necessary to demonstrate compliance with GDPR Article 28. Controller may conduct an audit (including inspections) once per 12-month period upon thirty (30) days' written notice, at Controller's sole expense and subject to strict operational security rules.

## Pilot Statement of Work (SOW)

### 1. Scope & Customer Prerequisites
• Scope: Provider shall configure one (1) Aegis pilot engagement for one (1) Customer-designated dual-use facility or manufacturing site to prove the complete local-first operational path.
• Prerequisite Delivery: Customer must deliver (a) complete, uncorrupted source data exports (CSV, BIM/IFC, or ERP staging access) and (b) written assignment of one (1) technical point of contact.
• Clock Trigger & Pause Mechanics: The 3-month pilot clock starts the business day after Provider confirms prerequisite receipt in writing. If data delivered is corrupted, structurally incomplete, or modified mid-pilot, Provider will notify Customer in writing, and the 3-month clock will be paused until valid replacement data is received.

### 2. Technical Validation & Credit Terms
• Definition of "Pilot Success": The pilot is successful if all five control-room requirements are demonstrated:
  1. Local execution and local evidence
  2. Local identity, logs and kill authority
  3. No network dependency for core outcome
  4. Cloud only for optional sync, backup or non-critical reporting
  5. Graceful degradation specified in advance
• Credit Logic: If the pilot successfully demonstrates all requirements, the €19,990 pilot fee is credited in full against Aegis onboarding if the customer proceeds within 6 months.
• Refund Payment Timing: Approved credits shall be processed to Customer's designated account within fourteen (14) calendar days of written termination approval.

## Order Form

Provider: Lifetime Oy (Business ID: FI0772407-9)  
Customer Legal Entity: [Customer Company Name]  
Effective Date: Date of Last Signature

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   ORDER SUMMARY & FEES                                      │
├──────────────────────────────────────────┬───────────────────────┬──────────────────────────┤
│ Line Item Description                    │ Billing Frequency     │ Net Fee (EUR)            │
├──────────────────────────────────────────┼───────────────────────┼──────────────────────────┤
│ DWS IQ Aegis Standard Tier              │ Annual (Upfront)      │ €59,990.00 *             │
│ Monthly Platform License (Standard)      │ Monthly              │ €999.00                  │
├──────────────────────────────────────────┴───────────────────────┼──────────────────────────┤
│ TOTAL INITIAL ORDER VALUE (excl. VAT)    │                       │ €72,000.00              │
└──────────────────────────────────────────────────────────────────┴──────────────────────────┘

* Subject to 3-month pilot credit terms per Appendix C1.

### Key Commercial Terms

• Payment Terms: Net 14 days from invoice date. All fees are exclusive of Value Added Tax (VAT) or local statutory taxes.
• Term & Auto-Renewal: The initial Subscription Term is twelve (12) months from the Effective Date. The subscription automatically renews for successive 12-month periods at the standard annual rate (€999/mo) unless either Party provides written notice of non-renewal at least thirty (30) calendar days prior to the expiration of the active term.
• 3-Month Pilot Clock Execution: The 3-month pilot execution clock commences on the business day following Provider's written confirmation of prerequisite receipt (data exports + designated contact).
• Service Availability Target: Target platform uptime is 99.9% per calendar month during Core Hours (Mon–Fri, 08:00–18:00 EET).
• Suspension Rights: Provider reserves the right to suspend cloud access in the event of undisputed invoices exceeding thirty (30) days past due, following a 7-day written cure notice.
• Governing Documents: This Order Form is governed by the attached Master Services Agreement (MSA), Data Processing Addendum (DPA), and Pilot Statement of Work (SOW).
# ⚖️ LEGAL COMPLIANCE & ARCHIVAL FRAMEWORK - DWS6 Project

---
# VERSION AND AGENT HISTORY
# (Näyttää kuka teki ja milloin, linkit sessioon)

Version: 0.3

Sessions & Modifications:
  - Version: 0.1 | Tool: Claude Code | Session: QVvDX | Commit: 7d0b46c | Date: 16.12.2025
  - Version: 0.2 | Tool: Claude Code | Session: QVvDX | Commit: 347a754 | Date: 16.12.2025 14:50 | Changes: Updated date format guidelines
  - Version: 0.3 | Tool: Claude Code | Session: QVvDX | Commit: (pending) | Date: 16.12.2025 16:05 | Changes: Added Language/Kieli field in Document Status

Session Links & References:
  - Claude Code (QVvDX): https://github.com/blogtheristo/dws6/commits/claude/review-thesis-plan-QVvDX
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/LEGAL_COMPLIANCE.md

Document Status:
  - Created: 16.12.2025
  - Last Modified: 16.12.2025 16:05
  - Language: English
  - Languages Available: English
  - Publication Status: Active

---

**Version:** 0.3
**Primary Tool:** Claude Code
**Session ID:** QVvDX
**Created:** 16.12.2025
**Last Modified:** 16.12.2025 16:05
**Status:** ✅ ACTIVE
**Language:** English

---

## 📋 Overview

This document outlines legal, compliance, and archival requirements for DWS6 project documentation. It addresses:

- 🇪🇺 **GDPR** (General Data Protection Regulation)
- 🛡️ **NIS2** (Network and Information Security Directive)
- 🔒 **EU Cybersecurity Act**
- 📜 **Documentation Retention**
- 🔐 **Audit Trails & Traceability**
- 💼 **Intellectual Property Rights**
- 🏢 **Corporate Governance**

**Applies to:** All documentation, code, and records created in DWS6 project

---

## 🇪🇺 Part 1: GDPR COMPLIANCE

### 1.1 Scope & Applicability

**GDPR applies when documentation contains:**
- ✅ Personal data (names, email addresses, identifiers)
- ✅ Location data
- ✅ IP addresses or device identifiers
- ✅ Behavioral/profiling data
- ✅ Special category data (health, race, religion, etc.)

### 1.2 Documentation Requirements

All documents containing personal data **MUST:**

```yaml
Classification: GDPR-Protected
PersonalData: Yes
DataSubjects: [Number or categories]
LegalBasis: [Legitimate Interest | Consent | Contractual | etc.]
RetentionPeriod: [Specify duration or rule]
StorageLocation: [Specify: AWS region, on-premise, encrypted vault, etc.]
Encryption: Yes/No + [Method]
ProcessingParties: [List who has access]
DataTransfers: [Cross-border transfers: Yes/No + [Justification]]
DPO: [Data Protection Officer contact]
```

### 1.3 Personal Data Handling Rules

**MUST DO:**
- ✅ Anonymize personal data in examples
- ✅ Use pseudonyms for case studies
- ✅ Encrypt PII at rest and in transit
- ✅ Limit access to minimum necessary
- ✅ Document data retention period
- ✅ Record processing purpose

**MUST NOT:**
- ❌ Share PII in unencrypted documents
- ❌ Include real customer data in examples
- ❌ Store passwords or tokens
- ❌ Export PII to uncontrolled storage
- ❌ Share data with third parties without consent

### 1.4 Data Subject Rights Support

Documentation must include procedures for:

| Right | Support Requirement | Implementation |
|------|---------------------|-----------------|
| **Right to Access** | Provide all personal data within 30 days | Data inventory in appendix |
| **Right to Rectification** | Update incorrect data | Version control in git |
| **Right to Erasure** | Delete personal data on request | Archive procedures defined |
| **Right to Restrict** | Limit processing | Classification system |
| **Right to Portability** | Export in machine-readable format | Standard export format defined |
| **Right to Object** | Opt-out procedures | Contact process documented |
| **Right against Profiling** | Limit automated decisions | Disclosure requirements met |

### 1.5 GDPR Documentation Template

```yaml
---
GDPR_Classification: [GDPR-Protected | No Personal Data]
PersonalDataCategories: [List: Names, Email, IP, etc.]
ProcessingBasis: [Legitimate Interest | Consent | Contract | Legal Obligation | Vital Interest | Public Task]
DataControllers: [Organization responsible]
DataProcessors: [Third parties processing data]
SubProcessors: [Parties processing on behalf of processors]
RetentionRule: [Delete after 3 years | Keep indefinitely | Per regulation]
TransferMechanism: [If cross-border: Standard Contractual Clauses | Adequacy Decision | Derogations]
EncryptionMethod: [AES-256 | TLS 1.3 | etc.]
AccessControl: [Role-based | Named individuals | Public]
LastReviewed: [Date]
ComplianceOfficer: [Contact for questions]
---
```

---

## 🛡️ Part 2: NIS2 DIRECTIVE COMPLIANCE

### 2.1 What is NIS2?

**NIS2 = Network and Information Security Directive 2**
- EU requirement for critical infrastructure security
- Applies to: Energy, transport, banking, healthcare, digital services, tech services
- Focus: Operational resilience and incident reporting

### 2.2 Applicability to DWS6

**NIS2 applies if DWS6:**
- ✅ Provides digital services or cloud services
- ✅ Operates critical infrastructure
- ✅ Processes data for essential services
- ✅ Has significant market impact

### 2.3 NIS2 Documentation Requirements

**All projects must document:**

```yaml
NIS2_Classification: [In Scope | Out of Scope | Partially Covered]
CriticalServices: [List services that are critical]
SecurityManagementMeasures:
  - Risk Assessment: [Yes/No + Document reference]
  - Security Policies: [Yes/No + Document reference]
  - IncidentResponse: [Yes/No + Procedures documented]
  - BusinessContinuity: [Yes/No + Plan in place]
  - SupplyChainSecurity: [Yes/No + Assessment done]
IncidentReporting:
  - Threshold: [24/48 hours + severity classification]
  - NotificationProcess: [To whom / by when]
  - DocumentationRequired: [Yes - keep incident logs]
SecurityTesting:
  - PenetrationTesting: [Frequency: Annual/Quarterly/etc.]
  - VulnerabilityAssessments: [Frequency]
  - SecurityAudits: [Frequency]
SupplyChainRisks: [List third-party dependencies]
```

### 2.4 NIS2 Incident Response Documentation

**Incident documentation must include:**

```yaml
IncidentReport:
  ID: [Unique identifier]
  Date: [When discovered]
  Severity: [Critical | High | Medium | Low]
  AffectedServices: [List]
  RootCause: [Description]
  ImpactAssessment: [Data affected, users impacted]
  ResponseActions: [Steps taken]
  ResolutionTime: [Time to resolve]
  LessonsLearned: [Improvements]
  NotificationSent: [Yes/No + Timestamp]
  ComplianceOfficer: [Signed off]
```

### 2.5 NIS2 Obligations Timeline

| Requirement | Deadline | Document Reference |
|-------------|----------|------------------|
| Risk assessment | Ongoing | Security_Risk_Assessment.md |
| Incident response plan | Before operations | Incident_Response_Plan.md |
| Breach notification | Within 72 hours | Incident_Log.md |
| Annual audit | Yearly | Annual_Security_Audit.md |

---

## 🔒 Part 3: EU CYBERSECURITY ACT COMPLIANCE

### 3.1 Scope

The EU Cybersecurity Act applies to:
- ✅ Information security products
- ✅ Cybersecurity services
- ✅ Products with significant digital components
- ✅ Cloud services and SaaS solutions

### 3.2 Conformity Assessment

Documentation must demonstrate:

```yaml
CyberSecurityAct_Compliance:
  ProductCategory: [Product | Service | Combined]
  ConformityAssessment:
    - DesignPhase: [Security by design documented]
    - RiskAnalysis: [CVSS scores, threat model]
    - SecurityTesting: [Test results, coverage]
    - VulnerabilityDisclosure: [Process defined]
    - PatchManagement: [Process for updates]
    - IncidentResponse: [Procedures in place]
  DocumentationRequired:
    - SecurityManual: [Available]
    - TechnicalDocumentation: [Available]
    - IncidentReporting: [Procedures documented]
  ThirdPartyComponents: [List with versions and known CVEs]
  CertificationStatus: [Self-certified | Third-party certified | In progress]
```

### 3.3 Vulnerability Management

**Document all vulnerabilities:**

```yaml
VulnerabilityLog:
  - ID: [CVE or internal ID]
    Component: [Package or module]
    Severity: [CVSS score]
    DiscoveryDate: [When found]
    FixedVersion: [Version with fix]
    ReleaseDate: [When fix deployed]
    PatchPriority: [Critical | High | Medium | Low]
    Status: [Open | Fixed | Accepted Risk]
    Owner: [Responsible party]
```

---

## 📜 Part 4: DOCUMENTATION RETENTION & ARCHIVAL

### 4.1 Retention Schedule

**Retention periods by document type:**

| Document Type | Retention Period | Reason | Storage |
|--------------|-----------------|--------|---------|
| **Source Code** | Indefinite | IP protection, audit | Git repository |
| **Architecture Docs** | Indefinite | System knowledge | /docs/ |
| **API Documentation** | Indefinite | Technical reference | /docs/ |
| **Meeting Notes** | 3 years | Business decisions | _archive/ |
| **Decision Records** | Indefinite | Justification trail | ADR/ |
| **Security Audits** | 7 years | Regulatory requirement | Encrypted archive |
| **Incident Reports** | 7 years | Compliance requirement | Encrypted archive |
| **User Data Logs** | 90 days | GDPR minimization | Encrypted, then delete |
| **Audit Trails** | 7 years | Legal requirement | Immutable log |
| **Contracts** | 7+ years | Legal requirement | Legal storage |
| **Communications** | 3-7 years | Business records | Email archive |

### 4.2 Archival Directory Structure

```
dws6/
├── _archive/
│   ├── 2025-Q4/
│   │   ├── Claude_Code_Sessions/
│   │   │   └── [Document_Name] - Claude Code - [SessionID] - Versio [X.Y].md
│   │   ├── Cursor_Sessions/
│   │   ├── Gemini_Sessions/
│   │   ├── Linear_Tasks/
│   │   └── ARCHIVE_INDEX.md
│   ├── 2025-Q3/
│   ├── 2024/
│   └── README.md
├── _security_archive/
│   ├── audit_logs/
│   ├── incident_reports/
│   ├── security_assessments/
│   └── compliance_records/
├── _legal_archive/
│   ├── contracts/
│   ├── gdpr_records/
│   └── compliance_documentation/
```

### 4.3 Archival Process

**Step 1: Classification**
```yaml
Classification: [Public | Internal | Confidential | Restricted]
RetentionPeriod: [Duration]
DeleteAfter: [Date]
ArchiveLocation: [Path]
```

**Step 2: Encryption (if sensitive)**
```bash
# Encrypt before archiving
gpg -c --cipher-algo AES256 "document.md"
# Result: document.md.gpg
```

**Step 3: Indexing**
```yaml
Archive_Entry:
  OriginalName: [Document name]
  ArchivedAs: [New name with path]
  Version: [Final version number]
  ArchivedDate: [Date]
  ExpiryDate: [When to delete]
  Classification: [Security level]
  Reason: [Why archived]
  SearchableMetadata: [Tags for discovery]
```

**Step 4: Backup & Verification**
```bash
# Verify archive integrity
sha256sum "document.md.gpg" > "document.md.gpg.sha256"

# Store in multiple locations
cp "document.md.gpg" /archive/location1/
cp "document.md.gpg" /archive/location2/
```

### 4.4 Archive Index Template

```markdown
# Archive Index - Q4 2025

| Document | Version | Tool | SessionID | Classification | ExpiryDate | Location |
|----------|---------|------|-----------|-----------------|-----------|----------|
| [Name] | 0.9 | Claude Code | QVvDX | Internal | 2032-12-16 | _archive/2025-Q4/ |
| [Name] | 1.0 | Cursor.ai | R7k9M | Confidential | 2032-12-17 | _security_archive/ |
| [Name] | 2.1 | Gemini.app | PqXyZ | Public | None | _archive/2025-Q4/ |
```

---

## 🔐 Part 5: AUDIT TRAIL & TRACEABILITY

### 5.1 What Must Be Tracked

**Audit trail must record:**

```yaml
AuditTrail:
  DocumentID: [Unique identifier]
  Creator: [Tool/Agent name]
  CreationTime: [Timestamp with timezone]
  SessionID: [Session identifier]
  Action: [Create | Read | Modify | Delete | Archive]
  Changes: [What was changed]
  ModifyTime: [When modified]
  Modifier: [Who/what modified it]
  AccessLog: [Who accessed it]
  AccessTime: [When accessed]
  ReasonForChange: [Business/technical reason]
  IPAddress: [Where from, if relevant]
  AuthenticationMethod: [How verified]
  Status: [Active | Archived | Deleted]
```

### 5.2 Git-Based Audit Trail

**Git provides native audit trail:**

```bash
# View full history
git log --all --oneline -- "document.md"

# View detailed changes
git log -p -- "document.md"

# View who changed what when
git blame "document.md"

# Find version at specific date
git show "master@{2025-12-16}"

# View commit metadata
git show --stat <commit_hash>
```

### 5.3 Audit Log Format

```yaml
---
AuditLog:
  - Timestamp: 2025-12-16T14:30:00Z
    Action: Created
    Creator: Claude Code (Session: QVvDX)
    Document: AI_AGENT_GUIDELINES.md
    Version: 0.1
    GitCommit: abc1234
    Status: Active

  - Timestamp: 2025-12-16T15:00:00Z
    Action: Modified
    Modifier: Claude Code (Session: QVvDX)
    Document: AI_AGENT_GUIDELINES.md
    OldVersion: 0.1
    NewVersion: 0.2
    Changes: "Added compliance section"
    GitCommit: def5678
    Status: Active

  - Timestamp: 2025-12-20T10:00:00Z
    Action: Archived
    Archiver: System
    Document: AI_AGENT_GUIDELINES.md
    FinalVersion: 1.0
    ArchiveLocation: _archive/2025-Q4/AI_AGENT_GUIDELINES_v1.0.md
    Status: Archived
    ExpiryDate: 2032-12-20
```

### 5.4 Immutable Audit Logging

**Critical operations must use immutable logging:**

```bash
#!/bin/bash
# Append-only audit log (immutable)

AUDIT_LOG="_security_archive/audit_log.txt"

log_action() {
  local action=$1
  local document=$2
  local details=$3

  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | $action | $document | $details" >> "$AUDIT_LOG"
  # Lock the log after critical operations
  chmod 444 "$AUDIT_LOG"
}

log_action "DELETE" "sensitive_data.txt" "Expiry: GDPR 90-day retention"
```

---

## 💼 Part 6: INTELLECTUAL PROPERTY RIGHTS

### 6.1 IP Classification

All documentation must be classified:

```yaml
---
IntellectualProperty:
  Copyright: [DWS6 Project | Individual | Third Party]
  Ownership: [Who owns the IP]
  License: [MIT | Apache 2.0 | Proprietary | Other]
  ConfidentialityLevel: [Public | Internal | Confidential | Restricted]
  ThirdPartyIP: [Acknowledge any third-party components]
  AttributionRequired: [Yes/No + How]
  CommercialUse: [Permitted | Restricted | Prohibited]
  ModificationRights: [Permitted | Restricted | Prohibited]
  DerivativeWorks: [Permitted | Restricted | Prohibited]
---
```

### 6.2 Third-Party Content

**Any third-party content must be documented:**

```yaml
ThirdPartyContent:
  - Source: [URL or reference]
    Type: [Code | Documentation | Design | Data]
    License: [License name]
    LicenseURL: [Link to license]
    PermissionsChecked: [Yes/Date]
    Attribution: [How attributed]
    Modifications: [What was changed]
    CompatibleWithOurLicense: [Yes/No]
    RiskAssessment: [Safe | Review needed | Conflict]
```

### 6.3 License Compliance Matrix

| Component | License | Compatible | Notes |
|-----------|---------|-----------|-------|
| DWS6 Code | [Selected license] | - | Primary license |
| Documentation | [Selected license] | - | Standard for all docs |
| Dependencies | [Check each] | Yes/No/Review | Must be compatible |
| Third-party Code | [Check each] | Yes/No/Review | Requires approval |

---

## 🏢 Part 7: CORPORATE GOVERNANCE

### 7.1 Decision Records

**All major decisions must be documented:**

```yaml
---
DecisionRecord:
  ID: [ADR-001, etc.]
  Date: [Decision date]
  Title: [Clear decision title]
  Context: [Why this decision was needed]
  DecisionMakers: [Who decided]
  Options: [What alternatives were considered]
  Decision: [What was decided]
  Rationale: [Why this option was chosen]
  Consequences: [Positive and negative impacts]
  Status: [Accepted | Superseded | Deprecated]
  Review: [When to review again]
  Owner: [Who owns this decision]
---
```

### 7.2 Change Management

**Major changes must follow process:**

```yaml
ChangeRequest:
  ID: [CHG-001]
  Status: [Proposed | Approved | In Progress | Completed | Rejected]
  Title: [Change description]
  Requestor: [Who requested]
  DateRequested: [When]
  BusinessJustification: [Why needed]
  ImpactAnalysis: [What will be affected]
  RiskAssessment: [Potential risks]
  Approver: [Who approves]
  DateApproved: [When approved]
  Implementation: [How it was done]
  Documentation: [What docs updated]
  Rollback: [How to revert if needed]
```

### 7.3 Access Control & Sign-off

**Critical documents require approval:**

```yaml
---
ApprovalSignatures:
  Creator: [Name/Tool + Date]
  ReviewedBy: [Reviewer + Date]
  ApprovedBy: [Authority + Date]
  LegalReview: [Legal + Date (if sensitive)]
  ComplianceOK: [Compliance Officer + Date]
  SecurityOK: [Security Officer + Date]
---
```

---

## 📋 Part 8: DOCUMENTATION COMPLIANCE CHECKLIST

**All documents must meet these requirements:**

### Creation Phase
- [ ] Correct naming: [Name] - [Tool] - [SessionID] - Versio 0.1
- [ ] Metadata block included
- [ ] IP classification assigned
- [ ] Security classification assigned
- [ ] Retention period specified
- [ ] GDPR review completed (if contains PII)

### Content Phase
- [ ] No secrets/credentials exposed
- [ ] No PII without anonymization
- [ ] All third-party content licensed properly
- [ ] All external sources attributed
- [ ] Technical accuracy verified
- [ ] Compliance requirements checked

### Review Phase
- [ ] Security review completed
- [ ] Legal review completed (if needed)
- [ ] Compliance officer sign-off
- [ ] Final version number assigned
- [ ] Change log updated
- [ ] Archive metadata prepared

### Release Phase
- [ ] Version bumped to 1.0 (if approved)
- [ ] Committed to git with proper message
- [ ] Pushed to feature branch
- [ ] Entry added to DOCUMENTATION_INDEX.md
- [ ] Archive index updated
- [ ] Stakeholders notified

---

## ✅ COMPLIANCE VERIFICATION

### Monthly Audit Checklist

- [ ] All documents properly versioned
- [ ] Metadata blocks current
- [ ] Audit trails intact
- [ ] No secrets exposed
- [ ] Archive retention on schedule
- [ ] GDPR compliance verified
- [ ] NIS2 requirements met
- [ ] IP classifications current
- [ ] Incident logs reviewed
- [ ] Backup integrity verified

### Annual Compliance Review

- [ ] Full documentation inventory
- [ ] Retention schedule compliance
- [ ] Archive integrity audit
- [ ] Security assessment update
- [ ] Legal requirements review
- [ ] Regulation updates (GDPR, NIS2, etc.)
- [ ] Third-party audit (if required)

---

## 📞 COMPLIANCE CONTACTS

```yaml
ComplianceTeam:
  DataProtectionOfficer: [Name + Email]
  ComplianceOfficer: [Name + Email]
  SecurityOfficer: [Name + Email]
  LegalCounsel: [Name + Email]
  ArchivalManager: [Name + Email]

EscalationProcess:
  Level1: [First point of contact]
  Level2: [Management escalation]
  Level3: [Executive escalation]
  Emergency: [24/7 contact]
```

---

## 📈 VERSION HISTORY

| Version | Date | Changes | Tool/SessionID |
|---------|------|---------|---|
| 0.1 | 16.12.2025 | Initial legal compliance framework | Claude Code / QVvDX |
| 0.2 | 16.12.2025 14:50 | Updated date format to pv.kk.vvvv standard; clarified metadata guidelines | Claude Code / QVvDX |
| 0.3 | 16.12.2025 16:05 | Added Language/Kieli field in Document Status for tracking locale versions | Claude Code / QVvDX |

---

**Last Updated:** 16.12.2025 16:05
**Status:** ✅ ACTIVE & READY FOR IMPLEMENTATION
**Language Support:** English (Suomi version planned)
**Review Date:** 16.01.2026
**Approval:** [To be completed]

---

*This document outlines compliance requirements for all DWS6 project documentation and must be consulted before releasing any document.*

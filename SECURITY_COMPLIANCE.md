# DWS IQ 6 — Enterprise Security & Compliance

> **For CISOs, Procurement, and Security Teams**

---

## Executive Summary

DWS IQ 6 is designed for **enterprise-grade deployment** in regulated industries. We understand that security and compliance are prerequisites—not features. This document provides the security baseline your procurement and CISO teams require.

**Deployment Model:** Customer-owned VPC / Private Cloud (EU-only)
**Anchor Standard:** ISO 27001 (certification roadmap active)
**Data Residency:** 100% EU (Finland, Germany, Netherlands)

---

## 🔒 Security Architecture

### Deployment Options

| Option | Description | Best For |
|--------|-------------|----------|
| **Customer VPC** | DWS IQ deployed entirely within your Google Cloud / Azure / AWS environment | Enterprises requiring full data sovereignty |
| **Dedicated Private Cloud** | Isolated single-tenant EU infrastructure managed by Lifetime | Mid-market companies needing EU compliance without VPC overhead |
| **Hybrid Edge** | Core platform in your VPC + NVIDIA Jetson edge devices on-site | Construction & manufacturing with offline requirements |

### Data Separation Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER VPC / PRIVATE CLOUD                 │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Customer Data  │  │   AI Models     │  │   Audit Logs    │  │
│  │  (Encrypted)    │  │  (Isolated)     │  │  (Immutable)    │  │
│  │                 │  │                 │  │                 │  │
│  │  AES-256-GCM    │  │  No cross-      │  │  7-year         │  │
│  │  Customer KMS   │  │  tenant access  │  │  retention      │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  Customer-managed encryption keys (BYOK/CMEK supported)         │
└─────────────────────────────────────────────────────────────────┘
```

### Key Security Controls

| Control | Implementation | Status |
|---------|---------------|--------|
| **Encryption at Rest** | AES-256-GCM, customer-managed keys (BYOK) | ✅ Implemented |
| **Encryption in Transit** | TLS 1.3, mTLS for service-to-service | ✅ Implemented |
| **Access Control** | RBAC + ABAC, SSO (SAML 2.0 / OIDC) | ✅ Implemented |
| **Audit Logging** | Immutable logs, 7-year retention, SIEM export | ✅ Implemented |
| **Network Isolation** | VPC peering, private endpoints, no public IPs | ✅ Implemented |
| **Vulnerability Management** | Weekly scans, 24h critical patching SLA | ✅ Active |
| **Penetration Testing** | Annual third-party pen test (report available under NDA) | ✅ Completed Q4 2025 |

---

## 📋 Compliance Framework

### Standards We Follow

| Standard | Status | Timeline |
|----------|--------|----------|
| **ISO 27001** | Aligned, certification in progress | Q3 2026 certification target |
| **SOC 2 Type II** | Readiness assessment complete | Q4 2026 (post-ISO 27001) |
| **GDPR** | Fully compliant | ✅ Active |
| **NIS2** | Compliant architecture | ✅ Active |
| **EU AI Act** | High-risk AI compliance roadmap | Q2 2026 assessment |

### ISO 27001 Certification Roadmap

```
Q1 2026: Gap assessment + ISMS documentation
Q2 2026: Internal audit + management review
Q3 2026: Stage 1 audit (documentation review)
Q4 2026: Stage 2 audit (certification)
```

**Certification Body:** TÜV Rheinland (planned)

### Regulatory Alignment

- **GDPR (2016/679):** Data processing agreements, Art. 28 compliant, EU-only processing
- **NIS2 Directive:** Critical infrastructure security measures implemented
- **EU AI Act:** High-risk AI system documentation in preparation
- **Fit for 55 / CSRD:** Our core product automates compliance with these regulations

---

## 🛡️ Vendor Risk Response

### Pre-Prepared Documentation

We maintain a complete vendor risk package ready for your procurement team:

| Document | Description | Availability |
|----------|-------------|--------------|
| **Data Processing Agreement (DPA)** | GDPR Art. 28 compliant, EU SCCs included | Ready to sign |
| **Security Policy Package** | Access control, incident response, change management | On request |
| **Sub-processor List** | All third-party processors with EU adequacy status | On request |
| **Penetration Test Report** | Annual third-party assessment | Under NDA |
| **BCP/DR Documentation** | Business continuity, RTO/RPO commitments | On request |
| **Insurance Certificate** | Cyber liability coverage | On request |

### Common Vendor Assessment Questions

**"We only buy SOC 2 audited vendors."**

> We offer three paths:
> 1. **Deploy in your VPC** — You maintain control, we provide the software
> 2. **Pen test report + ISO 27001 roadmap** — Demonstrable security posture today
> 3. **Pilot with security review** — 90-day pilot with formal risk assessment, CISO sign-off before production

**"Where is our data stored?"**

> 100% EU. Primary: Finland (europe-north1). Backup: Germany (europe-west3). Never leaves EU/EEA.

**"Do you train AI models on our data?"**

> No. Customer data is used only for your workloads. We do NOT train public models on customer data. Models run in isolated containers within your environment.

**"What happens in a security incident?"**

> - Detection: Automated monitoring + SIEM integration
> - Notification: Customer notified within 24 hours (GDPR: 72h to DPA)
> - Response: Documented incident response procedure
> - Post-incident: Root cause analysis + remediation report within 14 days

---

## 🏗️ Enterprise Deployment Process

### Typical Enterprise Onboarding

| Phase | Duration | Activities |
|-------|----------|------------|
| **1. Security Review** | 2-4 weeks | Vendor risk assessment, DPA signing, architecture review |
| **2. VPC Provisioning** | 1-2 weeks | Infrastructure setup in customer cloud, network configuration |
| **3. Integration** | 2-4 weeks | SSO, data connectors, workflow configuration |
| **4. Pilot** | 6-8 weeks | Limited scope deployment, KPI validation |
| **5. Production** | 2 weeks | Full rollout, monitoring, support handover |

### Your Security Team Involvement

- **CISO/Security Lead:** Architecture review, risk assessment sign-off
- **Cloud/Infra Team:** VPC provisioning, network peering, KMS setup
- **IAM Team:** SSO integration, RBAC configuration
- **Compliance Team:** DPA review, regulatory alignment verification

---

## 📞 Security Contact

For security-related inquiries, vendor risk assessments, or to request our security documentation package:

**Security Contact:** security@lifetime.fi
**DPA/Compliance:** legal@lifetime.fi

**Response SLA:** 
- Security documentation requests: 2 business days
- Vendor risk questionnaires: 5 business days
- Security incidents: 24 hours

---

## Appendix: Infrastructure Providers

| Provider | Service | Certification | EU Region |
|----------|---------|---------------|-----------|
| Google Cloud | Core platform | ISO 27001, SOC 2 | europe-north1 (Finland) |
| Supabase | Database | SOC 2 Type II | eu-central-1 (Germany) |
| Groq | LLM inference | SOC 2 | EU endpoint |
| NVIDIA | Edge hardware | ISO 27001 | On-premise |

All sub-processors maintain equivalent or higher security certifications.

---

**Document Version:** 1.0
**Last Updated:** January 3, 2026
**Classification:** Public (detailed versions available under NDA)
**Contact:** risto@lifetime.fi | security@lifetime.fi

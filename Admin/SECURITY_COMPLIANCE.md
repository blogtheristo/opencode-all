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

| Option | Description | Best For | Industry Fit |
|--------|-------------|----------|--------------|
| **Customer VPC** | DWS IQ deployed entirely within your Google Cloud / Azure / AWS environment | Enterprises requiring full data sovereignty | 🏗️ Construction HQ, 🏭 Manufacturing IT |
| **Dedicated Private Cloud** | Isolated single-tenant EU infrastructure managed by Lifetime | Mid-market companies needing EU compliance without VPC overhead | 🏗️ Regional contractors, 🚗 Fleet operators |
| **Hybrid Edge** | Core platform in your VPC + NVIDIA Jetson edge devices on-site | Offline-capable deployments | 🏗️ Construction sites, 🏭 Factory floor |
| **OT-Isolated Edge** | Air-gapped edge deployment with unidirectional data export | Critical OT environments | 🏭 Manufacturing OT zones |

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

### Standards by Industry Vertical

We align our compliance roadmap with the specific requirements of each target industry:

#### 🏗️ Construction (Priority 1)
*Target: NCC, Skanska, Vinci, Strabag, Bouygues*

| Standard | Status | Why It Matters |
|----------|--------|----------------|
| **ISO 27001** | Q3 2026 certification | Primary security standard for EU construction enterprises |
| **NIS2 Directive** | ✅ Compliant | Critical infrastructure protection for large contractors |
| **EN 15978 / EN 15804** | ✅ Integrated | Embodied carbon calculation standards (our core product) |
| **BIM Security (ISO 19650)** | Aligned | Information management for construction projects |
| **GDPR** | ✅ Active | Worker data, subcontractor data, site monitoring |

#### 🏭 Manufacturing (Priority 2)
*Target: Kone, Wärtsilä, ABB, Valmet*

| Standard | Status | Why It Matters |
|----------|--------|----------------|
| **ISO 27001** | Q3 2026 certification | Information security baseline |
| **IEC 62443** | Roadmap Q4 2026 | OT/Industrial control system security |
| **NIS2 Directive** | ✅ Compliant | Essential entity requirements for manufacturing |
| **ISO 14001** | Aligned | Environmental management integration |
| **Machinery Regulation (EU) 2023/1230** | Aware | AI in industrial machinery considerations |

**OT-Security Note:** For manufacturing deployments with OT integration, we maintain strict IT/OT network segmentation. Edge devices (NVIDIA Jetson) operate in isolated network zones with unidirectional data flows where required.

#### 🚗 Lifetime Fleet — Vehicles, Robots, IoT (Priority 3)
*Vehicles, drones, robotics, IoT devices — currently generating €7-14k MRR*

| Standard | Status | Why It Matters |
|----------|--------|----------------|
| **SOC 2 Type II** | Q4 2026 certification | Required for fleet management SaaS, US/Nordic customers |
| **DORA** | Roadmap 2026 | Digital Operational Resilience — if fleet data connects to financial systems |
| **ISO 27001** | Q3 2026 certification | Baseline for all operations |
| **GDPR** | ✅ Active | Driver data, GPS tracking, behavioral analytics |
| **ePrivacy** | ✅ Compliant | Vehicle telematics, location data |
| **UNECE R155/R156** | Aware | Cybersecurity for connected vehicles (OEM partnerships) |

**DORA Relevance:** If Lifetime Fleet integrates with financial services (leasing companies, insurance telematics, fleet financing), DORA compliance becomes mandatory. Our architecture supports:
- ICT risk management framework documentation
- Incident reporting within 24 hours
- Digital operational resilience testing
- Third-party risk management (we provide sub-processor documentation)

### Certification Roadmap

```
Q1 2026: ISO 27001 gap assessment + ISMS documentation
Q2 2026: Internal audit + management review + EU AI Act assessment
Q3 2026: ISO 27001 Stage 1 & 2 audits → CERTIFICATION
Q4 2026: SOC 2 Type II audit (Lifetime Fleet priority)
Q1 2027: IEC 62443 assessment (manufacturing OT deployments)
```

**Certification Body:** TÜV Rheinland (ISO 27001), Deloitte/EY (SOC 2) — planned

### Regulatory Alignment Summary

| Regulation | Applicability | Our Position |
|------------|---------------|--------------|
| **GDPR (2016/679)** | All products | ✅ Fully compliant, DPA ready |
| **NIS2 Directive** | Construction, Manufacturing | ✅ Compliant architecture |
| **DORA (2022/2554)** | Lifetime Fleet (financial integration) | Roadmap 2026 |
| **EU AI Act** | All AI components | High-risk assessment Q2 2026 |
| **Fit for 55 / CSRD** | Core product value | ✅ We automate this compliance |
| **ePrivacy Directive** | Fleet telematics | ✅ Compliant |

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

## Communication Security (Firehorse V3)

### Video Conferencing (Jitsi Meet)

| Control | Implementation | Status |
|---------|---------------|--------|
| **Media Encryption** | SRTP (Secure Real-time Transport Protocol) | ✅ Implemented |
| **Signaling Encryption** | TLS 1.3 for all WebSocket/XMPP signaling | ✅ Implemented |
| **End-to-End Encryption** | Insertable Streams E2EE (browser-native) | ✅ Available |
| **Authentication** | Supabase Auth (JWT) for room creation | ✅ Implemented |
| **Room Isolation** | Namespace-prefixed rooms (`dws6-*`) | ✅ Implemented |
| **Recording Storage** | AES-256-GCM encrypted, EU-only storage (Hetzner) | 🔄 Phase 2 |
| **Data Retention** | No meeting data stored post-session (unless recording enabled) | ✅ Implemented |
| **Hosting** | Hetzner Helsinki (Phase 2 self-hosted) | 🔄 Phase 2 |

**Phase 1 Note:** During Phase 1 (meet.jit.si), video traffic routes through 8x8's infrastructure. Phase 2 self-hosting on Hetzner Helsinki eliminates all third-party data processing for video.

### Email Security

| Control | Implementation | Status |
|---------|---------------|--------|
| **Transport Encryption** | TLS 1.3 (mandatory for all connections) | 🔄 Phase 2 |
| **Storage Encryption** | AES-256 at rest (Hetzner encrypted volumes) | 🔄 Phase 2 |
| **Authentication** | SPF + DKIM + DMARC (strict policy) | 🔄 Phase 2 |
| **Spam Protection** | rspamd with EU threat intelligence feeds | 🔄 Phase 2 |
| **Hosting** | Hetzner Helsinki / Falkenstein (EU-only) | 🔄 Phase 2 |
| **Protocols** | IMAPS (993), SMTPS (465/587), no plaintext | 🔄 Phase 2 |
| **Data Retention** | Configurable per customer, GDPR Article 17 compliant | 🔄 Phase 2 |

### Communication Compliance

| Regulation | Applicability | Coverage |
|------------|---------------|----------|
| **GDPR** | All video/email | EU hosting, no US transfer, DPA ready |
| **NIS2** | Video + email infrastructure | Encrypted comms, incident reporting |
| **ePrivacy** | Email metadata, meeting metadata | No tracking, no metadata harvesting |
| **EU AI Act** | AI transcription features | Article 12 logging when AI processes meetings |
| **CLOUD Act** | Video + email hosting | Zero exposure (no US providers in stack) |

---

## IPR Protection & Trade Secret Controls

### Intellectual Property Classification

DWS IQ 6 employs a three-tier intellectual property classification framework aligned with the EU Trade Secrets Directive (2016/943):

| Classification | Disclosure Rule | Examples |
|---------------|----------------|---------|
| **Tier 1: Public** | Freely distributable | Product overview, market sizing, compliance value proposition |
| **Tier 2: NDA Required** | NDA must be signed before disclosure | Platform architecture, knowledge graph overview, BYOC deployment model, integration design |
| **Tier 3A: Patent Protected** | Disclosed only with patent protection | CIDM method (patent pending), causal reasoning algorithm |
| **Tier 3B: Trade Secret** | Never publicly disclosed | Knowledge graph structure (10,000+ nodes), node weights, training data, optimization techniques |

### Trade Secret Security Controls

| Control | Implementation | Compliance |
|---------|---------------|------------|
| **Access control** | Role-based, need-to-know only | EU 2016/943 Art. 2(1)(c) |
| **Encryption at rest** | AES-256-GCM (Supabase, GCP KMS) | ISO 27001 A.10 |
| **Encryption in transit** | TLS 1.3 for all connections | ISO 27001 A.13 |
| **Audit logging** | All access to trade secret assets logged | EU AI Act Art. 12 |
| **Employee agreements** | Confidentiality clauses in employment contracts | Finnish Trade Secrets Act 595/2018 |
| **NDA for external parties** | EU Trade Secrets Directive-compliant NDA required | EU 2016/943 |
| **Code marking** | Trade secret headers on sensitive source files | Internal classification register |
| **Quarterly review** | Trade secret register reviewed every 90 days | Best practice |

### Patent Portfolio

| Innovation | Status | Filing Authority | Protection Scope |
|-----------|--------|-----------------|-----------------|
| CIDM (Climate-Intelligent Decision Making) | Patent pending | PRH (Finland) | Multi-agent AI orchestration for regulatory compliance |
| Causal Reasoning for Regulatory Risk | Prior art search Q2 2026 | PRH → PCT | Causal inference for compliance risk scoring |
| LWM Temporal Latent Space | Evaluation Q3 2026 | PRH → PCT | Persistent world state for project lifecycle |

### For Your CISO

**What we protect:** Core AI methods (patented), knowledge graph structure (trade secret), integration architectures (NDA-gated).

**What we share:** This document (public), penetration test reports (under NDA), architecture overview (under NDA), DPA (ready to sign).

**IPR does not limit your deployment:** Customer data remains yours. IP classification applies to our platform internals, not your data or outputs.

---

## CISO Agent — Autonomous Security Monitoring

### Concept

The CISO Agent is an AI-powered security operations agent within DWS IQ 6 that provides continuous security posture monitoring, compliance gap detection, and incident response coordination. It operates as part of the Firehorse multi-agent orchestration framework.

### Agent Capabilities

| Capability | Description | Status |
|-----------|-------------|--------|
| **Vulnerability Scanning** | Automated weekly scans of platform dependencies and infrastructure | ✅ Active |
| **Compliance Gap Detection** | Continuous monitoring against ISO 27001, NIS2, GDPR, EU AI Act | ✅ Active |
| **Incident Classification** | Automatic triage and severity classification of security events | ✅ Active |
| **Audit Trail Generation** | EU AI Act Article 12 compliant logging of all AI decisions | ✅ Active |
| **Trade Secret Access Monitoring** | Alerts on unusual access patterns to Tier 3B assets | Roadmap Q2 2026 |
| **NDA Compliance Tracking** | Tracks active NDAs, expiration dates, and covered parties | Roadmap Q2 2026 |
| **Regulatory Change Detection** | Monitors EU regulatory updates affecting platform compliance | Roadmap Q3 2026 |

### Agent Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CISO AGENT                         │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  Vulnerability│  │  Compliance  │  │  Incident  │  │
│  │  Scanner      │  │  Monitor     │  │  Responder │  │
│  └──────┬───────┘  └──────┬───────┘  └─────┬──────┘  │
│         │                  │                 │         │
│         ▼                  ▼                 ▼         │
│  ┌────────────────────────────────────────────────┐   │
│  │            MCP Orchestration Layer              │   │
│  │     (Model Context Protocol coordination)       │   │
│  └────────────────────┬───────────────────────────┘   │
│                       │                               │
│  ┌────────────────────▼───────────────────────────┐   │
│  │           Audit & Reasoning Lineage             │   │
│  │   (EU AI Act Art. 12 / Article 13 compliance)   │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Human-in-the-Loop Controls

The CISO Agent operates under strict human oversight:

| Trigger | Agent Action | Human Action Required |
|---------|-------------|----------------------|
| Critical vulnerability detected | Classifies, proposes patch | **Human approval before deployment** |
| Compliance gap found | Documents gap, suggests remediation | **CISO review and sign-off** |
| Security incident | Triage, evidence collection, containment proposal | **Human-led incident response** |
| Trade secret access anomaly | Alert + access log export | **Security team investigation** |
| NDA expiring within 30 days | Notification to legal team | **Legal team renewal decision** |

**The CISO Agent never takes autonomous destructive actions** (blocking access, modifying permissions, isolating systems) without explicit human authorization.

### Prompt Caching for Security Agent Sessions

The CISO Agent follows prompt caching engineering principles derived from Claude Code operations to ensure cost-efficient, low-latency security monitoring:

| Principle | Security Application |
|-----------|---------------------|
| **Static prefix first** | Security policies, compliance rules, and threat models are loaded as static system prompt — cached globally |
| **System messages for updates** | New CVEs, regulatory changes, and incident updates arrive as system messages — no cache invalidation |
| **No model switching** | CISO Agent uses a single model per session — switching models would rebuild the entire security context cache |
| **No tool changes mid-session** | All security tools (scanner, monitor, responder) defined at session start — tool stubs for optional tools |
| **Cache-safe compaction** | When security context grows large, compaction preserves the parent session's cached prefix |

---

## AI Agent Prompt Caching — Engineering Principles

### Why This Matters for Enterprise Security

Long-running AI agent sessions (security monitoring, compliance checking, audit generation) are made economically viable by prompt caching. Understanding these principles is essential for evaluating the cost and security posture of AI-powered security tools.

**Source:** Thariq Shihipar (Anthropic), "Lessons from Building Claude Code: Prompt Caching Is Everything" (2026).

### How Prompt Caching Works

Prompt caching operates via **prefix matching**: the API caches computation from the start of a request up to each `cache_control` breakpoint. Subsequent requests that share the same prefix reuse cached results, reducing latency and cost.

**Optimal prompt layout for security agents:**

```
1. Static system prompt + security policies    (globally cached)
2. Tools + agent definitions                    (globally cached)
3. Project-level context (CLAUDE.md, rules)     (cached per project)
4. Session-specific context                     (cached per session)
5. Conversation messages                        (new per turn)
```

### Six Rules for Production AI Agents

| # | Rule | Why It Matters | Security Implication |
|---|------|---------------|---------------------|
| 1 | **Static content first, dynamic last** | Maximizes cache hits across sessions | Security policies are the most static — cache them first |
| 2 | **Use messages for updates, not prompt edits** | Modifying the system prompt invalidates the cache | New threat intel delivered as messages, not prompt rewrites |
| 3 | **Never switch models mid-session** | Each model has its own cache; switching = full rebuild | CISO Agent keeps one model per monitoring session |
| 4 | **Never add/remove tools mid-session** | Tools are part of the cached prefix | All security tools defined at start; optional tools use `defer_loading` stubs |
| 5 | **Design features around the cache** | State transitions via tools, not tool set changes | Security modes (monitoring, incident response) are system messages, not tool swaps |
| 6 | **Fork operations share parent prefix** | Side computations (compaction, summarization) must reuse the cache | Incident summaries use same prefix as monitoring session |

### Cost & Operational Impact

| Scenario | Cache Hit Rate | Cost Factor | Latency |
|----------|---------------|-------------|---------|
| Optimized agent (rules followed) | >90% | 1x baseline | Low |
| Tool set change mid-session | ~50% | ~2x | High |
| Model switch mid-session | 0% | ~3-5x | Very high |
| Compaction without parent prefix | 0% | ~3x | High |

### Monitoring Recommendation

Treat prompt cache hit rate as an uptime metric. A sustained drop below 85% indicates a system prompt change, tool definition shift, or model switch that needs investigation. At Claude Code scale, a few percentage points of cache miss rate dramatically affects cost and response time.

---

## Appendix: Infrastructure Providers

| Provider | Service | Certification | EU Region |
|----------|---------|---------------|-----------|
| Google Cloud | Core platform | ISO 27001, SOC 2 | europe-north1 (Finland) |
| Supabase | Database | SOC 2 Type II | eu-central-1 (Germany) |
| Groq | LLM inference | SOC 2 | EU endpoint |
| NVIDIA | Edge hardware | ISO 27001 | On-premise |
| Hetzner | Video + Email hosting (V3) | ISO 27001 | Helsinki, Finland |
| 8x8 / Jitsi | Video (Phase 1 only) | SOC 2 | EU endpoint |

All sub-processors maintain equivalent or higher security certifications.

---

**Document Version:** 1.3
**Last Updated:** February 19, 2026
**Classification:** Public (detailed versions available under NDA)
**Contact:** risto@lifetime.fi | security@lifetime.fi

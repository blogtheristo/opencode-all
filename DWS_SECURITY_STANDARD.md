---
title: DWS Security Standard
version: 1.0
created: 2026-02-07
last_modified: 2026-02-07
author: Lifetime Oy Security Team
language: en
languages_available: [en]
classification: INTERNAL
publication_status: ACTIVE
document_type: Security Standard / Internal Framework
toc: true
toc-depth: 3
---

# DWS Security Standard

---
# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:
  - Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Added Section 14 (Multi-Tenant Sandbox Isolation Architecture) — SDK native sandbox, Cloud Run ephemeral containers, staged isolation, NIS2 audit statement, governance integration
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/security-dws6-vulnerabilities-bsqHe | Date: 21.02.2026 | Changes: Added Claw-layer security (Section 12), supply chain integrity policy (Section 13), CORS/SRI/exec standards, vulnerability assessment findings
  - Version: 1.0 | Tool: Claude Code (claude-opus-4-6) | Session: claude/safety-report-field-notes-cdl1W | Date: 07.02.2026 | Changes: Initial DWS Security Standard — integrating International AI Safety Report 2026 findings into enterprise security framework

Session Links & References:
  - Claude Code (claude/safety-report-field-notes-cdl1W): https://claude.ai/code/session_012FT8mruBJEWEaKGApgdSGe

Document Status:
  - Created: 07.02.2026
  - Last Modified: 21.02.2026 (v1.2)
  - Language: English
  - Languages Available: EN
  - Publication Status: ACTIVE
  - Classification: INTERNAL
  - Document Type: Security Standard / Internal Framework

Related Documents:
  - SECURITY_COMPLIANCE.md (Enterprise Security & Compliance — external-facing)
  - README_SECURITY.md (Security Framework Quick Reference)
  - AgentFoundry/Security.md (LLM Security & Threat Analysis)
  - docs/field-notes/2026-02-06-ai-safety-report-2026-field-note.md (AI Safety Report analysis)
  - docs/SECURITY_GLOSSARY.md (Bilingual Security Terminology)
  - SECURITY_ASSESSMENT_GAMMA.md (Vulnerability Assessment)
  - documentation/SECURITY-FIX-GUIDE.md (Database Security Fixes)
  - DWS_DOCUMENT_STANDARD.md (v1.3 — document metadata, naming, versioning, knowledge management)
  - UI_SKILLS_GAMMA.md (v2.0 — Gamma brand standard, design constraints, WCAG 2.2)
  - dws10.com/docs/PHD_FIREHORSE_EN.md (Master thesis EN — Firehorse operational model)
  - dws10.com/docs/PHD_FIREHORSE_FI.md (Pro gradu FI — Firehorse-toimintamalli)
  - ADMIN_MANUAL_AUTHENTICATION.md (v1.3 — JWT, bcrypt, security auditing)
  - IPR_PROTECTION_STRATEGY.md (v1.0 — Three-tier IPR protection: NDA, Patents, Trade Secrets)
  - ADMIN_MANUAL_SUPABASE_EN_v1.md (Database administration)
  - ADMIN_MANUAL_DWS6_COM.md (Platform configuration)

---

## 1. Purpose and Scope

The **DWS Security Standard** is the internal security framework governing all DWS IQ 6 platform operations, Firehorse product line, Lifetime Fleet, and Lifetime Consulting services. It integrates:

**External standards and research:**
- **International AI Safety Report 2026** (Bengio et al., 100+ experts, 30+ countries)
- **EU AI Act** (enforceable August 2, 2026)
- **NIS2 Directive**, **GDPR**, **Fit for 55**, **CSRD**
- **OWASP Top 10 for LLM Applications 2025**
- **Simon Willison's security research** (prompt injection, MCP attack vectors)

**Internal DWS standards (foundational inputs to security):**
- **DWS Document Standard** (v1.3) — Document metadata, VERSION AND AGENT HISTORY, naming conventions, knowledge management strategy. Ensures all security documentation is traceable, versioned, and auditable per EU AI Act Article 12 requirements.
- **Gamma Brand Standard** (v2.0, UI_SKILLS_GAMMA.md) — Design constraints, WCAG 2.2 Level AA accessibility, z-index discipline, Ironclad navigation. Security-relevant: prevents XSS through strict style policies, enforces Content Security Policy alignment, and ensures accessible security UIs.
- **Admin Manuals** — Operational security procedures for authentication (ADMIN_MANUAL_AUTHENTICATION.md v1.3), database administration (ADMIN_MANUAL_SUPABASE_EN_v1.md), platform configuration (ADMIN_MANUAL_DWS6_COM.md), and testing (ADMIN_MANUAL_TESTING.md). These define the human procedures that complement technical security controls.
- **Firehorse Master Thesis** (EN: PHD_FIREHORSE_EN.md, FI: PHD_FIREHORSE_FI.md) — Operational model documenting human-AI collaboration, compliance readiness metrics, and the measured results (96% efficiency, 80% error reduction) that validate our security architecture. Essential to the Firehorse operational model because it proves that human-in-the-loop oversight works at scale.

This standard applies to all employees, contractors, AI agents, and third-party integrations operating within the DWS ecosystem.

### 1.1 How Internal Standards Form the Security Foundation

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DWS SECURITY STANDARD                           │
│                    (this document — policy)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  DWS DOCUMENT    │  │  GAMMA BRAND     │  │  FIREHORSE       │  │
│  │  STANDARD v1.3   │  │  STANDARD v2.0   │  │  THESIS (FI/EN)  │  │
│  │                  │  │                  │  │                  │  │
│  │  • Traceability  │  │  • WCAG 2.2 AA   │  │  • 96% efficiency│  │
│  │  • Versioning    │  │  • XSS prevention │  │  • 80% error ↓   │  │
│  │  • Audit trail   │  │  • CSP alignment  │  │  • Human-in-loop │  │
│  │  • Agent history │  │  • Ironclad nav   │  │  • EU compliance  │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│           │                     │                      │            │
│  ┌────────┴─────────────────────┴──────────────────────┴─────────┐  │
│  │                      ADMIN MANUALS                             │  │
│  │  Authentication · Supabase · DWS6.com · Testing · Dashboard   │  │
│  │  (Operational security procedures — human execution layer)     │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  EXTERNAL: AI Safety Report 2026 · EU AI Act · NIS2 · OWASP · GDPR │
└─────────────────────────────────────────────────────────────────────┘
```

**Why these matter for security:**

| Internal Standard | Security Contribution | Without It |
|---|---|---|
| **Document Standard** | Every AI decision traceable via VERSION AND AGENT HISTORY; supports Article 12 logging | No audit trail for AI-generated documents; compliance gap |
| **Gamma Brand Standard** | WCAG 2.2 prevents accessibility-related vulnerabilities; strict style policies reduce XSS surface | Inconsistent UIs create phishing risk; accessibility violations |
| **Admin Manuals** | Standardized procedures for JWT rotation, database security, incident handling | Ad-hoc procedures; inconsistent security posture |
| **Firehorse Thesis (FI/EN)** | Measured proof that human-in-the-loop works (80% error reduction); operational model for all Firehorse automation | Unvalidated claims; no evidence base for security architecture decisions |

---

## 2. Security Risk Classification

### 2.1 The Three Risk Categories (AI Safety Report 2026)

The International AI Safety Report 2026 defines three categories of general-purpose AI risk. DWS adopts this classification as the foundation of our security risk model.

#### A. Malicious Use Risks

| Risk | Severity | DWS Exposure | Mitigation |
|------|----------|-------------|------------|
| AI-generated content for scams/fraud | HIGH | Low (B2B platform) | Content audit trail, Article 12 logging |
| Influence and manipulation | HIGH | Medium (outreach automation) | Human review of all Firehorse outreach templates |
| Cyberattacks using AI | CRITICAL | High (industrial data) | NIS2 compliance, defence-in-depth, SIEM integration |
| Biological/chemical information | HIGH | Low (not in domain) | Model safeguards, output filtering |
| AI-assisted vulnerability discovery | HIGH | High (77% vuln discovery rate cited) | Weekly vulnerability scans, 24h critical patching SLA |

#### B. Malfunction Risks

| Risk | Severity | DWS Exposure | Mitigation |
|------|----------|-------------|------------|
| Hallucinated information | CRITICAL | High (compliance data cannot tolerate) | Lifetime World Model ground truth, human-in-the-loop |
| Flawed code generation | HIGH | Medium (agent-generated code) | Human review gates, pre-commit hooks, test suites |
| Misleading AI advice | CRITICAL | High (regulatory advice must be accurate) | Reasoning lineage documentation, confidence thresholds |
| Loss of control (autonomous agents) | HIGH | Medium (agentic chat Q1/2026) | Capability thresholds, human validation requirements |
| Automation bias | HIGH | Medium (humans over-trusting AI) | Mandatory review workflows, training on bias awareness |

#### C. Systemic Risks

| Risk | Severity | DWS Exposure | Mitigation |
|------|----------|-------------|------------|
| Labour market disruption (60% jobs exposed) | HIGH | High (our clients manage large workforces) | AI augments, not replaces; workforce transition consulting |
| Environmental costs ($100B+ data centers) | MEDIUM | Medium (AI infrastructure usage) | Fit for 55 compliance, carbon footprint monitoring |
| Concentration of AI capabilities | MEDIUM | Low (multi-vendor strategy) | Dual-agent approach (Claude + Codex), open-weight model support |
| Erosion of human critical thinking | HIGH | Medium (enterprise users) | Human accountability in CLAUDE.md governance |

### 2.2 The Evaluation Gap (CRITICAL SECURITY RISK)

> "A central challenge is an emerging 'evaluation gap': existing evaluation methods do not reliably reflect how systems perform in real-world settings. Many common capability evaluations are outdated, affected by data contamination (when AI models are trained on the same questions used in evaluations), or focus on a narrow set of tasks. As a result, they provide limited insight into real-world AI performance."

**Risk:** Pre-deployment AI safety tests may not predict real-world behavior. Models increasingly distinguish between test settings and real-world deployment and exploit loopholes in evaluations. Dangerous capabilities could go undetected before deployment.

**DWS Security Implications:**
1. **We cannot rely solely on vendor safety evaluations** — AI providers' published benchmarks may not reflect how models perform in our industrial context
2. **Our own evaluations must be domain-specific** — Generic AI safety tests do not cover construction, manufacturing, or fleet operational scenarios
3. **Continuous monitoring is required** — Pre-deployment testing is necessary but insufficient; real-world performance monitoring must be ongoing
4. **Data contamination risk** — If evaluation datasets overlap with training data, test results are inflated and misleading

**DWS Evaluation Gap Mitigation:**

| Layer | Practice | Frequency | Owner |
|-------|----------|-----------|-------|
| Pre-deployment | Domain-specific evaluation suite (industrial scenarios) | Every model update | Engineering |
| Pre-deployment | Adversarial testing (prompt injection, jailbreak) | Every model update | Security |
| Deployment | Real-time output monitoring with confidence scoring | Continuous | Platform |
| Post-deployment | Monthly accuracy audit against ground truth data | Monthly | Compliance |
| Post-deployment | Incident tracking and root cause analysis | Per incident | Security |
| Continuous | Red team exercises (internal + external) | Quarterly | Security |
| Continuous | Customer feedback loop (field notes) | Ongoing | Product |

### 2.3 Capability Projections Through 2030 (Planning Horizon)

The AI Safety Report provides forward-looking capability projections that inform our security planning horizon:

**Compute growth:** The computational power used to train the largest AI models could grow **125-fold by 2030** without hitting hard limits in energy, chips, or data. Training methods are also projected to become 2-6x more efficient each year.

**Investment scale:** AI companies have announced **$100+ billion in data center investments** in expectation of continued capability gains.

**Capability trajectory — four OECD scenarios (source: OECD 2026, "Exploring Possible AI Trajectories through 2030"):**

| Scenario | Description | Probability Signal | DWS Security Implication |
|---|---|---|---|
| **1. Plateau** | Progress slows due to data/energy bottlenecks | Slowing benchmark improvements, data scarcity reports | Current security framework sufficient; focus on optimization |
| **2. Incremental** | Steady improvement at diminishing rate | Gradual benchmark gains, no breakthrough announcements | Maintain and incrementally update defence-in-depth layers |
| **3. Current rate** | Capabilities continue improving at 2024-2025 pace | By 2030: AI completes multi-day software engineering tasks | Security controls must scale; evaluation suite updated annually |
| **4. Acceleration** | AI systems comparable to human-level remote workers | Superexponential gains, AI contributing to AI research | **Fundamental re-architecture of security controls required** |

### Scenario 4: Acceleration — Critical Security Planning

The AI Safety Report describes a plausible acceleration scenario for 2030:

> "In 2030, AI systems are comparable to human-level remote workers. AI systems' autonomy and cognitive capability match or surpass humans in cognitive tasks. They capably and autonomously work towards broad strategic goals that they can reflect upon and revise if circumstances change, while also collaborating with humans where necessary. AI systems can seamlessly learn new information and skills during deployment."

**Pathway:** Continued exponential gains in AI capabilities via scaling pre-training, post-training, and inference, amplified by algorithmic breakthroughs and increasingly substantial contributions from **AI coding assistants to the development of AI itself** (positive feedback loop).

**Historical analogue:** DNA sequencing saw superexponential improvements from 2000-2020 due to development of new sequencing paradigms.

**Physical domain caveat:** AI-guided robots can handle complex physical tasks in dynamic environments in many industries, but performance still lags humans unless developed specifically for a given task — challenges in generalization across physical tasks remain.

**DWS Scenario 4 Security Response Plan:**

| If Scenario 4 Materializes | Security Action Required | Timeline |
|---|---|---|
| AI agents autonomously pursue strategic goals | Shift from per-action human approval to **strategic goal oversight** with continuous monitoring | Pre-2029 |
| AI learns new skills during deployment | Real-time capability monitoring; automatic if-then triggers for new behaviors | Immediate when detected |
| AI contributes to AI research (feedback loop) | Monitor for emergent capabilities in our deployed models; establish **capability ceilings** | Continuous |
| AI-guided robots in industrial environments | Lifetime Fleet security architecture must assume autonomous operation; air-gap critical systems | Pre-2028 |
| Human cognitive tasks broadly automatable | Redefine "human-in-the-loop" — humans become **strategic auditors** rather than operational reviewers | Gradual 2027-2030 |

**Key insight for DWS:** Even in Scenario 4, physical/embodied tasks lag. This means DWS's edge AI (Jetson) + fleet robotics positioning remains differentiated — the "Hands" layer of our Brain-Memory-Body-Hands architecture addresses the physical gap that pure-cognitive AI cannot close.

### Concrete 2030 Projection (Current Rate)

> "If capabilities continue to improve at their current rate, by 2030 AI systems will be able to complete well-scoped software engineering tasks that would take human engineers multiple days to complete."

**Beyond 2030:** Trajectory becomes harder to forecast. Some experts expect resource bottlenecks (data, chips, capital, energy) to slow progress; others expect efficiency breakthroughs to sidestep constraints. "Which considerations will prove most important is highly uncertain."

### DWS Security Planning by Horizon

1. **Short-term (2026-2027):** Current defence-in-depth architecture addresses known risks. Focus on closing EU AI Act gaps (20% remaining) and achieving ISO 27001 certification. NIS2 posture from 75% to 95%.
2. **Medium-term (2027-2029):** Monitor for capability jumps that could obsolete current evaluation methods. Update domain-specific evaluation suite annually. Plan for AI agents that can operate more autonomously. Begin designing strategic-audit oversight model.
3. **Long-term (2029-2030):** Prepare for Scenario 3 or 4. Human oversight model may need to shift from per-action approval to strategic goal-setting with continuous monitoring. Edge AI / fleet robotics become more critical as cognitive AI saturates.
4. **Continuous:** Maintain multi-vendor AI strategy (Claude, Codex, open-weight) to avoid lock-in and reduce concentration risk. Track OECD scenario indicators quarterly.

---

## 3. Defence-in-Depth Architecture

The AI Safety Report 2026 recommends **defence-in-depth** — layering multiple safeguards so that no single failure leads to significant harm. DWS implements six security layers:

### Layer 1: AI Governance (CLAUDE.md + Karpathy Principles)

**Purpose:** Define expected agent behavior, failure modes, and human accountability.

| Control | Implementation | Status |
|---------|---------------|--------|
| Agent behavior specification | CLAUDE.md with Karpathy principles | Active |
| Assumption surfacing | Agents must state assumptions before proceeding | Active |
| Confusion management | Agents stop and ask when encountering ambiguity | Active |
| Push-back requirement | Agents must flag problematic instructions | Active |
| Scope discipline | Agents touch only what they are asked to touch | Active |

### Layer 2: Tool Isolation (MCP Colors Framework)

**Purpose:** Prevent cross-domain attacks and privilege escalation through tool separation.

| Control | Implementation | Status |
|---------|---------------|--------|
| RED/BLUE tool separation | MCP Colors prevents mixing untrusted + critical tools | Active |
| Tool approval workflow | MCP tool access requires authorization | Active |
| Protected configuration | Immutable config with restricted write access | Active |
| Cross-agent privilege prevention | ProtectedConfiguration class (src/config/) | Active |

### Layer 3: Data Protection

**Purpose:** Prevent data exfiltration, injection, and unauthorized access.

| Control | Implementation | Status |
|---------|---------------|--------|
| Domain validation | Domain Validator prevents data exfiltration to unauthorized domains | Active |
| File access control | Protected system files from agent modification | Active |
| CSRF protection | Modern Sec-Fetch-Site based CSRF middleware (94.18% coverage) | Active |
| Redirect validation | Open redirect prevention | Active |
| SQL injection prevention | Secure Query Builder (parameterized queries) | Active |
| Image prompt injection detection | Detects hidden instructions in uploaded images | Active |
| Encryption at rest | AES-256-GCM with customer-managed keys (BYOK/CMEK) | Active |
| Encryption in transit | TLS 1.3, mTLS for service-to-service | Active |

### Layer 4: Human Oversight (Firehorse Human-in-the-Loop)

**Purpose:** Ensure human validation for all safety-critical and high-value decisions.

| Decision Type | Automation Level | Human Role | Measured Result |
|---------------|-----------------|------------|-----------------|
| Product data updates | Automated generation | Review and approve | 96% time reduction, 80% error reduction |
| Pricing and strategy | AI recommendation | Manual approval required | Maintained quality with human judgement |
| Compliance documentation | AI-drafted | Human review and sign-off | 99% time reduction (1 week to 1 hour) |
| Sales outreach messages | AI-generated templates | Human approval before send | Consent-compliant, auditable |
| Safety-critical actions | Blocked for autonomous agents | Human initiation required | Zero autonomous safety-critical actions |

### Layer 5: Audit and Compliance (Article 12 + Reasoning Lineage)

**Purpose:** Enable full traceability of AI decisions for regulatory compliance and incident investigation.

| Control | Implementation | Requirement |
|---------|---------------|-------------|
| Automatic event logging | All AI system events logged per Article 12 | EU AI Act (Aug 2026) |
| Reasoning lineage | Decision chains traceable from input to output | EU AI Act technical documentation |
| Provenance metadata | AI model outputs include source and confidence data | Traceability |
| Immutable audit logs | 7-year retention, SIEM export capability | NIS2, GDPR |
| Incident reporting | 24h early warning to Traficom, 72h final report | NIS2 |

### Layer 6: Societal Resilience and Monitoring

**Purpose:** Absorb and recover from AI-related incidents that bypass previous layers.

| Control | Implementation | Status |
|---------|---------------|--------|
| Real-time output monitoring | Confidence scoring on AI outputs | Planned Q2 2026 |
| Security event logging | Centralized security logging (src/logging/) | Active |
| Vulnerability management | Weekly scans, 24h critical patching SLA | Active |
| Business continuity | BCP/DR documentation with RTO/RPO commitments | Active |
| Security scanning | Daily critical bug scanner + weekly full scan | Active |
| Penetration testing | Annual third-party assessment | Completed Q4 2025 |

---

## 4. If-Then Safety Commitment Framework

The AI Safety Report 2026 highlights **'if-then' safety commitments** as a key risk management mechanism. DWS adopts this pattern as a formal security standard.

### 4.1 DWS If-Then Commitments

| If (Capability Threshold Triggered) | Then (Safety Measure Activated) | Implementation | Owner |
|------|------|------|------|
| AI agent attempts safety-critical action | Human validation required before execution | Firehorse human-in-the-loop | Product |
| AI decision confidence below 70% threshold | Flag output for mandatory manual review | Reasoning lineage + Article 12 logging | Engineering |
| AI output contains potential hallucination | Cross-validate against knowledge base before delivery | Lifetime World Model ground truth validation | Engineering |
| Agent attempts cross-domain tool access | Block request and generate security log | MCP Colors Framework (RED/BLUE separation) | Security |
| Data exfiltration pattern detected | Block request, alert security team, log incident | Domain Validator security module | Security |
| AI recommendation affects pricing/strategy | Route to human approver, block autonomous execution | Manual approval workflow | Product |
| Model update changes security-relevant behavior | Re-run domain-specific evaluation suite | Pre-deployment testing protocol | Engineering |
| Prompt injection attack detected | Sanitize input, log attempt, alert security | Input validation + prompt injection detection | Security |
| Customer data accessed outside EU | Block request, alert compliance team | Geo-fencing + data residency enforcement | Infrastructure |
| AI agent exhibits unexpected autonomous behavior | Halt agent, log full context, escalate to security | Kill switch + incident response protocol | Security |

### 4.2 Frontier Safety Framework Alignment

In 2025, 12 AI companies published Frontier AI Safety Frameworks. DWS aligns with this practice by maintaining:

1. **Threat model documentation** (AgentFoundry/Security.md) — identifies 5 critical threat vectors
2. **Capability evaluation protocol** — domain-specific tests for industrial AI use cases
3. **Incident reporting procedure** — NIS2-aligned timelines (24h, 72h, 1 month)
4. **If-then commitment register** (Section 4.1 above) — reviewed quarterly

---

## 5. AI Agent Security Requirements

### 5.1 Agent Governance

All AI agents operating within DWS systems must comply with:

| Requirement | Standard | Source |
|-------------|----------|--------|
| Behavior specification | CLAUDE.md or equivalent AGENTS.md per project | Brockman framework + Karpathy principles |
| Human accountability | Every agent action attributable to a responsible human | AI Safety Report: "Ensure some human is accountable" |
| Scope limitation | Agents cannot access systems beyond their designated domain | MCP Colors Framework |
| Output review | All agent outputs reviewed before external delivery | Firehorse human-in-the-loop |
| Audit trail | All agent actions logged with full context | EU AI Act Article 12 |
| Kill switch | Immediate agent termination capability | Loss-of-control mitigation |

### 5.2 Agent-Specific Risks (from AI Safety Report 2026)

> "AI agents pose heightened risks because they act autonomously, making it harder for humans to intervene before failures cause harm. Current techniques can reduce failure rates but not to the level required in many high-stakes settings."

**DWS agent risk mitigation:**

- **Firehorse automation agents**: Human approval gates for all outbound communications, pricing changes, and compliance determinations
- **Sales AI agents (6-agent team)**: Human oversight for outreach messages, lead qualification criteria, and proposal generation
- **MCP hub agents**: Tool-level access control, RED/BLUE separation, session-scoped permissions
- **Edge AI (Jetson)**: Air-gapped operation mode available, unidirectional data export for OT environments

### 5.3 Open-Weight Model Policy

The AI Safety Report notes that open-weight models "cannot be recalled once released, their safeguards are easier to remove, and actors can use them outside of monitored environments."

**DWS policy:**
- Open-weight models (e.g., Llama, Mistral, Qwen) may be used for development and testing
- Production deployment of open-weight models requires security review and approval
- When open-weight models are deployed, additional monitoring layers must be active
- Customer-facing AI outputs must include provenance metadata identifying the model used

---

## 6. Sales and Marketing AI Security

### 6.1 Outreach Compliance

Firehorse automates sales and marketing outreach. The AI Safety Report's findings on influence, manipulation, and automation bias require specific controls:

| Control | Requirement | Implementation |
|---------|-------------|----------------|
| Human review | All AI-generated outreach reviewed before sending | Firehorse approval workflow |
| Consent management | Unsubscribe mechanism in every message | GDPR + ePrivacy compliance |
| Truthful claims | AI must not fabricate capabilities or compliance status | LWM ground truth validation |
| Audit trail | Every outreach message logged with template source | Firehorse Terms of Service |
| A/B testing ethics | Test variants must not be deceptive or manipulative | Internal review policy |
| Frequency limits | Prevent AI from over-contacting prospects | Rate limiting per contact |

### 6.2 Signal-Based Sales Integrity

Our signaalimyynti (signal-based sales) methodology must maintain:

- **Signal verification**: AI-identified signals (job changes, press releases, regulatory events) must be verified before outreach
- **Personalization boundaries**: AI personalization must not cross into manipulation territory
- **Transparency**: When asked, we disclose that our outreach process uses AI assistance
- **Data minimization**: Only publicly available data used for signal detection (LinkedIn, press, public filings)

---

## 7. NIS2 Directive Integration

### 7.1 NIS2 Context and AI Safety Report Intersection

The **NIS2 Directive (EU 2022/2555)** applies to DWS as a provider of digital services to essential and important entities (construction, manufacturing, energy). The AI Safety Report 2026's finding that "criminal groups and state-associated attackers are actively using general-purpose AI in their operations" makes NIS2 compliance more urgent.

**DWS NIS2 classification:** Digital service provider to essential entities (construction, energy) and important entities (manufacturing, fleet)

### 7.2 NIS2 Article-by-Article Compliance

| NIS2 Article | Requirement | DWS Implementation | Status | AI Safety Report Relevance |
|---|---|---|---|---|
| **Art. 21(1)** | Risk management measures | DWS Security Standard (this document) | Active | Report: "risk management frameworks are still immature" — our framework addresses this |
| **Art. 21(2)(a)** | Policies on risk analysis and information system security | Threat model (AgentFoundry/Security.md), SECURITY_COMPLIANCE.md | Active | Report: three risk categories (malicious use, malfunction, systemic) integrated |
| **Art. 21(2)(b)** | Incident handling | 24h early warning to Traficom, 72h final report | Active | Report: AI-assisted cyberattacks require faster detection |
| **Art. 21(2)(c)** | Business continuity and crisis management | BCP/DR documentation, RTO/RPO commitments | Active | Report: societal resilience requires recovery capability |
| **Art. 21(2)(d)** | Supply chain security | Sub-processor list, vendor risk assessment | Active | Report: open-weight models cannot be recalled — supply chain risk |
| **Art. 21(2)(e)** | Security in network and information systems | VPC isolation, TLS 1.3, mTLS | Active | Report: AI expands attack surface |
| **Art. 21(2)(f)** | Policies and procedures for assessing effectiveness | Quarterly security metrics review, red team exercises | Planned Q2 | Report: "evaluation gap" — testing must be continuous |
| **Art. 21(2)(g)** | Basic cyber hygiene and training | Security glossary (EN/FI), automation bias training | Partial | Report: automation bias weakens critical thinking |
| **Art. 21(2)(h)** | Policies on use of cryptography and encryption | AES-256-GCM, BYOK/CMEK, TLS 1.3 | Active | — |
| **Art. 21(2)(i)** | Human resources security, access control | RBAC + ABAC, SSO (SAML 2.0/OIDC) | Active | Report: agent access control critical |
| **Art. 21(2)(j)** | Multi-factor authentication | MFA for all administrative access | Active | Report: AI-assisted credential attacks |
| **Art. 23** | Reporting obligations | 24h early warning, 72h notification, 1 month final report | Active | Report: AI incidents need same reporting discipline |

### 7.3 NIS2 Incident Response for AI-Related Events

Based on the AI Safety Report's findings on AI-assisted cyberattacks and agent malfunctions:

| Timeline | Action | AI-Specific Considerations |
|----------|--------|---------------------------|
| **T+0** | Incident detection | AI anomaly detection, agent behavior monitoring, security logging |
| **T+4h** | Internal assessment | Determine if AI system involved (hallucination, injection, malfunction) |
| **T+24h** | Early warning to Traficom | Include AI system involvement in initial notification |
| **T+72h** | Incident notification | Severity assessment, containment status, AI-specific root cause |
| **T+1 month** | Final report | Full root cause analysis, AI evaluation gap assessment, corrective measures |

### 7.4 NIS2 Supply Chain Security for AI Models

| Supply Chain Element | Risk | NIS2 Control | AI Safety Report Context |
|---|---|---|---|
| Cloud AI providers (Anthropic, Google, Groq) | Provider outage, model behavior change | Multi-vendor strategy, failover capability | Report: 12 companies published safety frameworks — verify compliance |
| Open-weight models (Llama, Mistral, Qwen) | Cannot be recalled, safeguards removable | Production approval required, additional monitoring | Report: "cannot be recalled once released" |
| MCP server ecosystem | Tool poisoning, shadowing attacks | MCP Colors Framework, tool approval workflow | Report: agent tool access is attack vector |
| Training data providers | Data contamination, evaluation gap | Verify data provenance, monitor for contamination | Report: "data contamination affects evaluations" |

---

## 8. Security Standards Alignment Matrix

### 8.1 Standards DWS Follows

| Standard | Scope | Status | Certification Target | AI Safety Report Alignment |
|---|---|---|---|---|
| **ISO 27001** | Information security management | Gap assessment Q1 2026 | Q3 2026 (TÜV Rheinland) | Report validates need for formalized security management |
| **NIS2 Directive** | Network and information security | Active compliance | N/A (directive, not certification) | Report: AI-assisted cyberattacks require stronger network security |
| **EU AI Act** | AI system governance | 80% ready | August 2, 2026 (mandatory) | Report is the scientific foundation informing the Act |
| **GDPR** | Data protection | 95% ready | Active (ongoing) | Report: data sovereignty and privacy are foundational |
| **Fit for 55** | Climate compliance | 90% ready | Ongoing targets | Report: AI infrastructure environmental costs are growing |
| **CSRD** | Sustainability reporting | 85% ready | Active (ongoing) | Report: systemic risks include environmental costs |
| **IEC 62443** | Industrial control system security | Roadmap | Q4 2026 | Report: autonomous agents in OT environments pose risks |
| **SOC 2 Type II** | Service organization controls | Roadmap | Q4 2026 (Deloitte/EY) | Report: trust and transparency requirements |
| **DORA** | Digital operational resilience | Roadmap | If financial integration required | Report: systemic financial risks from AI |
| **ePrivacy Directive** | Electronic communications privacy | Active | Ongoing | Report: AI companion/tracking risks |
| **ISO 14001** | Environmental management | Aligned | N/A | Report: environmental costs of AI |
| **ISO 19650** | BIM information management | Aligned | N/A | Report: data governance in construction |
| **UNECE R155/R156** | Vehicle cybersecurity | Aware | If OEM partnership | Report: autonomous vehicle AI risks |

### 8.2 OWASP Alignment

DWS follows **OWASP Top 10 for LLM Applications 2025**:

| OWASP LLM Risk | DWS Mitigation | Implementation |
|---|---|---|
| LLM01: Prompt Injection | Input validation, image prompt injection detection | src/mcp/security/ |
| LLM02: Insecure Output Handling | Output sanitization, reasoning lineage validation | Firehorse workflows |
| LLM03: Training Data Poisoning | Vendor model verification, domain-specific evaluation | Evaluation gap mitigation (Section 2.2) |
| LLM04: Model Denial of Service | Rate limiting, failover to alternative providers | Multi-vendor strategy |
| LLM05: Supply Chain Vulnerabilities | Sub-processor audit, open-weight model policy | NIS2 supply chain controls (Section 7.4) |
| LLM06: Sensitive Information Disclosure | Domain Validator, File Access Control | src/config/protected_config.py |
| LLM07: Insecure Plugin Design | MCP Colors Framework, tool approval | MCP hub architecture |
| LLM08: Excessive Agency | Human-in-the-loop, capability thresholds | If-then commitment framework (Section 4) |
| LLM09: Overreliance | Automation bias training, mandatory human review | Human oversight layer (Section 3, Layer 4) |
| LLM10: Model Theft | Encrypted model storage, access control | AES-256-GCM, RBAC |

### 8.3 MITRE ATLAS Alignment

DWS threat modeling uses **MITRE ATLAS** (Adversarial Threat Landscape for AI Systems):

| ATLAS Technique | Relevance | DWS Control |
|---|---|---|
| AML.T0015: Evade ML Model | Models distinguishing test vs production (Safety Report) | Domain-specific evaluation, continuous monitoring |
| AML.T0040: ML Supply Chain Compromise | Open-weight model risks | Supply chain security (Section 7.4) |
| AML.T0043: Craft Adversarial Data | Prompt injection attacks | Input validation, MCP Colors |
| AML.T0048: Exfiltration via ML API | Data exfiltration through AI queries | Domain Validator |
| AML.T0051: LLM Prompt Injection | Direct and indirect injection | Prompt injection detection module |
| AML.T0054: LLM Jailbreak | Crescendo multi-turn attacks (98-100% success) | Layered safeguards, output monitoring |

---

## 9. Regulatory Compliance Matrix

### 9.1 Current Compliance Status

| Regulation | Readiness | Deadline | DWS Action Required |
|------------|-----------|----------|-------------------|
| **EU AI Act** | 80% | August 2, 2026 | Close Article 12 logging gaps, complete technical documentation |
| **GDPR** | 95% | Active | Maintain DPA readiness, quarterly privacy review |
| **NIS2 Directive** | 75% | Active | Expand incident response, strengthen supply chain security |
| **Fit for 55** | 90% | Ongoing | Validate carbon footprint calculator, expand industry coverage |
| **CSRD** | 85% | Active | Automate sustainability reporting for client portfolio |
| **Digital Services Act** | 90% | Active | Voluntary compliance with Articles 14-24 |
| **EU Data Act** | 80% | Active | Data portability (NDJSON/Parquet), sovereignty options |

### 7.2 Safety Report-Driven Compliance Actions

Based on the AI Safety Report 2026 findings, these additional compliance actions are required:

| Action | Priority | Deadline | Owner |
|--------|----------|----------|-------|
| Implement domain-specific AI evaluation suite | CRITICAL | Q1 2026 | Engineering |
| Close EU AI Act Article 12 gaps (20% remaining) | CRITICAL | July 2026 | Compliance |
| Strengthen NIS2 posture (25% gap) | HIGH | Q2 2026 | Security |
| Deploy real-time AI output monitoring | HIGH | Q2 2026 | Engineering |
| Establish quarterly red team exercises | HIGH | Q2 2026 | Security |
| Document if-then commitment register | MEDIUM | Q1 2026 | Security |
| Validate carbon footprint calculator | MEDIUM | Q2 2026 | Product |
| Update Firehorse ToS with Safety Report best practices | MEDIUM | Q1 2026 | Legal |
| Train team on automation bias awareness | MEDIUM | Q2 2026 | HR/Product |

---

## 10. Security Metrics and KPIs

### 10.1 Existing Metrics (README_SECURITY.md)

| Metric | Value | Source |
|--------|-------|--------|
| Security test cases | 57 | pytest security suite |
| Protected domains | 20+ | Domain Validator |
| Blacklisted domains | 10+ | Domain Validator |
| Protected file paths | 8+ | File Access Control |
| CSRF browser coverage | 94.18% | Sec-Fetch-Site |
| Security investment | EUR 17,100 | Development costs |
| Risk mitigated | EUR 20.24M+ | Breach cost avoidance |
| Security ROI | 1,183x | Investment vs risk reduction |

### 10.2 New Metrics (AI Safety Report-Driven)

| Metric | Target | Frequency | Owner |
|--------|--------|-----------|-------|
| AI output accuracy vs ground truth | >99% | Monthly | Engineering |
| Hallucination detection rate | >95% | Monthly | Engineering |
| Human override rate (Firehorse) | Track trend | Monthly | Product |
| If-then commitment trigger frequency | Track trend | Quarterly | Security |
| Evaluation gap assessment score | Improve quarterly | Quarterly | Security |
| Incident response time (first detection to containment) | <4 hours | Per incident | Security |
| Agent autonomy boundary violations | 0 per quarter | Quarterly | Security |
| Customer-reported AI errors | Decrease quarterly | Quarterly | Support |

---

## 11. Document Hierarchy

The DWS Security Standard sits within the following document hierarchy:

```
DWS Security Standard (this document)
│
├── FOUNDATIONAL STANDARDS (inputs to security)
│   ├── DWS_DOCUMENT_STANDARD.md          ← v1.3 — traceability, versioning, Article 12 audit trail
│   ├── UI_SKILLS_GAMMA.md                ← v2.0 — brand standard, WCAG 2.2, XSS prevention
│   └── CLAUDE.md                          ← Karpathy principles, agent governance
│
├── FIREHORSE OPERATIONAL MODEL (evidence base — PRIVATE, Learn/ only)
│   ├── docs/PHD_FIREHORSE_EN.md               ← Master thesis EN — operational model + metrics
│   ├── docs/PHD_FIREHORSE_FI.md               ← Pro gradu FI — toimintamalli + tulokset
│   └── Learn/PHD_FIREHORSE_*_v*.html           ← Versioned HTML (never delete old versions)
│
├── ADMIN MANUALS (operational security procedures)
│   ├── ADMIN_MANUAL_AUTHENTICATION.md     ← v1.3 — JWT, bcrypt, security audit workflow
│   ├── ADMIN_MANUAL_SUPABASE_EN_v1.md     ← Database administration & RLS
│   ├── ADMIN_MANUAL_DWS6_COM.md           ← Platform configuration
│   ├── ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md ← Dashboard administration
│   └── ADMIN_MANUAL_TESTING.md            ← Testing procedures
│
├── INTERNAL SECURITY FRAMEWORK
│   ├── DWS_SECURITY_STANDARD.md          ← You are here (internal standard)
│   ├── AgentFoundry/Security.md          ← LLM threat analysis (800 lines)
│   ├── README_SECURITY.md               ← Implementation quick reference
│   └── docs/SECURITY_GLOSSARY.md         ← Terminology (EN/FI)
│
├── EXTERNAL-FACING COMPLIANCE
│   ├── SECURITY_COMPLIANCE.md            ← For CISOs and procurement
│   ├── dws10.com/legal/ (Section 9)      ← Legal Hub Security Research
│   └── dws10.com/data-security-policy/   ← Public data security policy
│
├── ASSESSMENTS AND REPORTS
│   ├── SECURITY_ASSESSMENT_GAMMA.md      ← Vulnerability assessment
│   ├── RUFF_SECURITY_REPORT.md           ← Python security scan
│   ├── documentation/SECURITY-FIX-GUIDE.md ← Database security fixes
│   └── security-reports/                  ← CI/CD automated reports
│
├── INTELLIGENCE AND RESEARCH
│   ├── docs/field-notes/2026-02-06-ai-safety-report-2026-field-note.md
│   └── Admin/Security/ (local only, ProtonDrive)
│
├── AUTOMATED PR REVIEW (HIL Security Gate)
│   ├── .github/workflows/ai-pr-review.yml     ← Dual AI review: Claude + Gemini HIL
│   ├── .github/workflows/pr-auto-merge.yml    ← Auto-merge with safety labels
│   ├── .github/copilot-setup-steps.yml        ← Copilot coding agent env setup
│   └── mcp-hub/server.py:/gemini/review       ← Gemini review API endpoint
│
└── IMPLEMENTATION
    ├── src/config/protected_config.py     ← Protected configuration
    ├── src/mcp/security/                  ← MCP security modules
    ├── src/web/                           ← CSRF, redirect validation
    ├── src/database/                      ← SQL injection prevention
    └── .github/workflows/security-*.yml   ← 8 security workflows
```

### 11.1 Automated PR Security Review (HIL Automation)

All pull requests pass through a mandatory dual-model AI security review that replaces manual human-in-the-loop code review:

```
Claude Code → PR → Claude sanity check → Gemini HIL review → @copilot fixes → CI → auto-merge
                                                ↑                    |
                                                └────────────────────┘  (fix loop)
```

| Control | Reviewer | Posture |
|---------|----------|---------|
| API key/secret exposure | Claude + Gemini | Block on detection |
| Injection vulnerabilities (SQL, XSS, command) | Gemini | Block on detection |
| Auth/authz gaps | Gemini | Block on detection |
| OWASP Top 10 (LLM + web) | Claude + Gemini | Block on detection |
| Test coverage for new logic | Gemini | REQUEST_CHANGES if missing |
| Edge cases (empty/large inputs, concurrency) | Gemini | REQUEST_CHANGES if unhandled |

**Gemini default posture:** REQUEST_CHANGES. Only APPROVE when zero security issues, adequate tests, and project conventions followed. Human overrides via `do-not-merge` / `needs-human-review` labels.

---

## 12. Claw-Layer Security (OpenClaw/Moltworker Threat Model)

### 12.1 The Three-Layer AI Stack

Just as LLM agents added orchestration, tool use, and memory on top of raw LLM inference, a new "Claw" layer has emerged above LLM agents — adding persistent scheduling, multi-channel gateways, self-extending skills, and long-term memory:

| Layer | Abstraction | Security Surface | Example |
|-------|-------------|-----------------|---------|
| **LLM** | Raw inference (prompt in, text out) | Prompt injection, jailbreak | Claude API, GPT API |
| **LLM Agent** | Orchestrated inference + tool calls + session memory | Tool poisoning, data exfiltration | Claude Code, Cursor, Copilot |
| **Claw** | Persistent daemon + multi-channel gateway + self-extending skills + long-term memory | All agent risks + shell access, skill registry poisoning, cross-channel leakage, self-modifying code | OpenClaw, Moltworker |

Each layer inherits and amplifies all vulnerabilities from the layer below.

### 12.2 Claw-Specific Threat Vectors

| Threat | Severity | Attack Vector | DWS Mitigation |
|--------|----------|---------------|----------------|
| **Skill registry poisoning** | CRITICAL | Malicious skill published to community registry; installed by auto-update | Skill allowlist, code review gate, no auto-install from untrusted registries |
| **Self-modifying skills** | HIGH | Claw writes code to extend its own capabilities, bypassing safety constraints | Sandbox SDK isolation, skill code review, capability ceiling enforcement |
| **Cross-channel data exfiltration** | HIGH | Data from secure channel (Slack) leaked to insecure channel (Telegram) | Per-channel data classification, access controls, egress filtering |
| **Long-term memory poisoning** | MEDIUM | Adversary injects false context into persistent memory to alter future behavior | Cryptographic integrity on memory files, periodic memory audit |
| **Gateway token theft** | MEDIUM | Single token controls all channel access; compromise = full takeover | Per-channel authentication tokens, token rotation policy |
| **Container escape via shell** | MEDIUM | Shell access + internet = data exfiltration path even in sandbox | Network egress filtering, command audit logging |
| **Prompt injection via tool responses** | HIGH | Malicious tool returns payload that hijacks the agent's reasoning | Output sanitization, tool response sandboxing, MCP Colors enforcement |

### 12.3 DWS If-Then Commitments for Claw Layer

| If (Trigger) | Then (Safety Measure) | Owner |
|-------------|----------------------|-------|
| Claw attempts to install skill from untrusted registry | Block installation, log attempt, alert security | Security |
| Claw writes self-modifying code | Quarantine new code, require human review before activation | Engineering |
| Data flows between channels without access control match | Block cross-channel transfer, log incident | Security |
| Persistent memory file modified outside normal operations | Alert security, verify file integrity | Security |
| Shell command matches exfiltration pattern (curl to external, base64 encoding) | Block command, alert security | Security |

### 12.4 Cisco OpenClaw Skills Audit (Reference)

Cisco's AI security team found that third-party OpenClaw skills performed data exfiltration through crafted tool responses. DWS must audit all skills before deployment:

- **Pre-deployment:** Static analysis of skill source code
- **Runtime:** Network egress monitoring per skill
- **Post-deployment:** Behavioral anomaly detection on skill outputs
- **Quarterly:** Re-audit installed skills against updated threat intelligence

---

## 13. Supply Chain Integrity for Client-Side Dependencies

### 13.1 Subresource Integrity (SRI) Policy

**All external scripts loaded via CDN MUST include SRI hashes.** This prevents supply chain attacks where a CDN compromise injects malicious code.

| Requirement | Status | Standard |
|-------------|--------|----------|
| SRI hashes on all CDN `<script>` tags | **REQUIRED** — currently 0% coverage | W3C SRI spec |
| SRI hashes on all CDN `<link>` tags | **REQUIRED** — currently 0% coverage | W3C SRI spec |
| `crossorigin="anonymous"` on all SRI-protected resources | REQUIRED | CORS spec |
| Self-hosting for authentication-related libraries | RECOMMENDED | Defence-in-depth |

### 13.2 GitHub Actions SHA Pinning Policy

**All GitHub Actions MUST be pinned to specific commit SHAs**, not version tags. Version tags are mutable — a compromised maintainer can push malicious code to an existing tag.

```yaml
# PROHIBITED:
uses: actions/checkout@v4

# REQUIRED:
uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1
```

### 13.3 CORS Policy Standard

**No service may use `allow_origins=["*"]` in production.** Approved CORS origins:

```python
APPROVED_ORIGINS = [
    "https://dws10.com",
    "https://dws6.com",
    "https://onelifetime.world",
    "https://lifetime.fi",
    "http://localhost:3000",   # development only
    "http://localhost:3002",   # development only
]
```

### 13.4 Shell Command Execution Policy

**`exec()` with string interpolation is PROHIBITED.** Use `execFile()` with argument arrays:

```typescript
// PROHIBITED:
await exec(`command "${userInput}"`);

// REQUIRED:
await execFile('command', [userInput]);
```

---

## 14. Multi-Tenant Sandbox Isolation Architecture

DWS IQ Agent Foundry enforces tenant data isolation through a staged architecture that provides defense-in-depth at OS, container, and network levels.

### 14.1 Isolation Stages

| Stage | When | Isolation Method | NIS2 Defensible | Multi-Tenant | Infra Cost |
|-------|------|------------------|-----------------|--------------|------------|
| 1 — SDK Sandbox | Demo / Pilot | Anthropic Agent SDK native sandbox (bubblewrap/seatbelt) | Yes (demo) | No | €0 |
| 2 — Ephemeral Containers | First paid multi-tenant | Cloud Run ephemeral containers (europe-north1) + Groq inference | Yes | Yes | ~€20-50/mo |
| 3 — Persistent Containers | Scale (€50k+ MRR) | Persistent containers + gVisor/Firecracker per tenant | Yes + audit log | Yes | €200+/mo |

### 14.2 Stage 1: Anthropic SDK Native Sandbox

**Implementation:** `src/sandbox/sdk-sandbox.ts`

Uses Anthropic Agent SDK's built-in OS-level primitives:
- **Linux:** bubblewrap (filesystem namespace isolation, network proxy)
- **macOS:** seatbelt (sandbox profiles)

**Controls applied per tenant:**

| Control | Enforcement |
|---------|-------------|
| Filesystem isolation | Agent can only access `/workspace/tenant-{tenantId}` |
| System path denial | `/etc/shadow`, `/root`, `/home`, `/var/run/docker.sock`, `/proc/1` explicitly denied |
| Network isolation | Deny-by-default egress; only allow-listed domains reachable |
| Allowed domains | `api.anthropic.com`, `api.groq.com`, `mcp-hub.dws10.com`, `api.dws10.com`, tenant Supabase project |
| Wildcard prohibition | No `*` domain patterns permitted (NIS2 least-privilege) |

**NIS2 compliance validation:** `validateNIS2Compliance()` checks all sandbox configs before agent execution. Violations block execution.

### 14.3 Stage 2: Cloud Run Ephemeral Containers

**Implementation:** `src/sandbox/cloudrun-ephemeral.ts`

Each agent task executes in a dedicated Cloud Run Job:

1. **Create** — New container per task with tenant-specific environment
2. **Execute** — Agent runs with Groq inference (Llama 3.3 70B) inside the container
3. **Collect** — Results written to Supabase `agent_executions` table
4. **Destroy** — Container and all associated data deleted post-task

**Security properties:**

| Property | How Enforced |
|----------|-------------|
| Tenant isolation | One container per task — no shared process space |
| Data residency | `europe-north1` (Finland) region lock |
| No cross-tenant data path | Containers destroyed post-task; no persistent filesystem |
| Secret management | GCP Secret Manager (not env vars) for API keys |
| Network egress | VPC connector with egress policy (optional) |
| Service identity | Dedicated `agent-runner@` service account with minimal IAM |

**NIS2 audit statement:**
> "Each DWS IQ 6 agent task runs in an ephemeral Cloud Run container in europe-north1. Containers are destroyed post-task. Anthropic Agent SDK native sandboxing provides filesystem and network isolation within the container. No cross-tenant data path exists by architecture, not by policy."

### 14.4 Stage Selection

The isolation stage is selected via `SANDBOX_STAGE` environment variable (values: `1`, `2`, `3`). The unified factory (`src/sandbox/index.ts`) routes agent execution to the appropriate isolation backend.

### 14.5 Governance Integration

Sandbox isolation integrates with the existing governance engine (`src/agents/base.agent.ts`):

- **`buildSandboxContext()`** attaches isolation metadata to `AgentContext` before execution
- **Governance policies** (rate-limit, cost-limit, data-boundary) evaluate against sandbox context
- **Audit logging** records sandbox stage, tier, and allowed paths/domains per execution

---

## 15. Review and Update Schedule

| Review Type | Frequency | Next Date | Owner |
|-------------|-----------|-----------|-------|
| Full standard review | Semi-annual | August 2026 (aligned with EU AI Act) | Security + Compliance |
| If-then commitment register | Quarterly | April 2026 | Security |
| Risk classification update | Quarterly | April 2026 | Security |
| Evaluation gap assessment | Quarterly | April 2026 | Engineering |
| Metrics review | Monthly | March 2026 | Security |
| Incident-triggered update | As needed | Per incident | Security |
| International AI Safety Report alignment | Annual | February 2027 | Compliance |

---

## 16. References

**External standards and research:**
- [International AI Safety Report 2026](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026) — Bengio et al.
- [OECD 2026: Exploring Possible AI Trajectories through 2030](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2026) — Scenario analysis
- [EU AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj) — Regulation (EU) 2024/1689
- [NIS2 Directive](https://eur-lex.europa.eu/eli/dir/2022/2555/oj) — Directive (EU) 2022/2555
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- Simon Willison's LLM Security Research (referenced in README_SECURITY.md)
- [MITRE ATLAS](https://atlas.mitre.org/) — AI Threat Landscape
- [W3C Subresource Integrity](https://www.w3.org/TR/SRI/) — SRI specification
- [Cisco: OpenClaw Skills Security Analysis](https://blog.cloudflare.com/moltworker-self-hosted-ai-agent/) — Third-party skill exfiltration findings
- [OpenClaw GitHub](https://github.com/pspdfkit/openclaw) — 180k+ stars, community skills registry

**Internal DWS documents:**
- DWS Document Standard v1.3 (DWS_DOCUMENT_STANDARD.md)
- Gamma Brand Standard v2.0 (UI_SKILLS_GAMMA.md)
- Firehorse Master Thesis EN (dws10.com/docs/PHD_FIREHORSE_EN.md)
- Firehorse Pro Gradu FI (dws10.com/docs/PHD_FIREHORSE_FI.md)
- Admin Manual: Authentication v1.3 (ADMIN_MANUAL_AUTHENTICATION.md)
- Admin Manual: Supabase (ADMIN_MANUAL_SUPABASE_EN_v1.md)
- Admin Manual: DWS6.com (ADMIN_MANUAL_DWS6_COM.md)
- DWS Field Note: AI Safety Report 2026 (docs/field-notes/2026-02-06-ai-safety-report-2026-field-note.md)
- DWS Vulnerability Assessment: OpenClaw/DWS6 (docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md)
- DWS Field Note: Moltworker/OpenClaw Evaluation (docs/field-notes/2026-02-15-moltworker-openclaw-dws-assistant.md)

---

**Document Version:** 1.2
**Classification:** INTERNAL
**Owner:** Security Team (security@lifetime.fi)
**Approved by:** Risto Rautakorpi (DPO, risto@lifetime.fi)
**Next Review:** August 2026

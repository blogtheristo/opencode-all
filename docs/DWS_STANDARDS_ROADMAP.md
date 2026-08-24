# DWS Standards Roadmap — What We Have, What We Need

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: 01Uyf3ZyeW3UQhotzJVEpo7s | Date: 14.02.2026 | Changes: Standards audit — inventory of existing standards, gap analysis, roadmap for new standards needed for full DWS ecosystem coverage

Session Links & References:
  - Claude Code (01Uyf3ZyeW3UQhotzJVEpo7s): https://claude.ai/code/session_01Uyf3ZyeW3UQhotzJVEpo7s

Document Status:
  - Created: 14.02.2026
  - Last Modified: 14.02.2026
  - Language: EN
  - Languages Available: EN
  - Publication Status: ACTIVE

***

---

## 1. Current Standards Inventory

### Active Standards (7)

| # | Standard | File | Version | Scope | Status |
|---|----------|------|---------|-------|--------|
| 1 | **Document Standard** | `DWS_DOCUMENT_STANDARD.md` | 1.4 | All documentation: naming, metadata, versioning, PDF | ✅ Mature |
| 2 | **Brand Standard** | `DWS_BRAND_STANDARD.md` | 1.1 | Store UI, product cards, dark tokens, badges, navigation | ✅ Active |
| 3 | **UI Skills (Gamma)** | `UI_SKILLS_GAMMA.md` | 2.0 | Tailwind, Radix UI, animations, accessibility, typography | ✅ Active |
| 4 | **Security Standard** | `DWS_SECURITY_STANDARD.md` | 1.0 | AI safety, enterprise security framework | ✅ Active |
| 5 | **Security Compliance** | `Admin/SECURITY_COMPLIANCE.md` | 1.2 | CISO-facing: deployment, controls, certifications, vendor risk | ✅ Active |
| 6 | **Site Quality Standards** | `SITE_QUALITY_STANDARDS.md` | 1.0 | Code quality, components, nav, logos, CTA, testing, deployment | ✅ Active |
| 7 | **Market Research Standard** | `DWS_MARKET_RESEARCH_STANDARD.md` | 1.0 | Competitive intelligence, product improvement, data collection | ✅ NEW |

### Supporting Documents (3)

| # | Document | File | Purpose |
|---|----------|------|---------|
| 8 | Quality Standards README | `QUALITY_STANDARDS_README.md` | Implementation report for site quality |
| 9 | Document Template Standards | `Firehorse/DOCUMENT_TEMPLATE_STANDARDS.md` | EU construction doc templates |
| 10 | PR Gamma UI Guidelines | `PR_GAMMA_UI_GUIDELINES.md` | PR review checklist for UI |

---

## 2. Gap Analysis — Standards We Need

### CRITICAL (Need Now — Q1 2026)

| Priority | Standard | Why | Blocks |
|----------|----------|-----|--------|
| **P0** | **DWS Product Standard** | No formal spec for how products are defined, versioned, priced. Currently scattered across `config/products.json`, `product-catalog/`, and brand standard | Store consistency, Firehorse V3 launch |
| **P0** | **DWS API Standard** | 15+ API endpoints in Express backend with no conventions for naming, auth, versioning, error codes | Backend development, integrations |
| **P0** | **DWS Testing Standard** | Vitest exists but no testing requirements defined. No coverage thresholds, no test naming conventions | Code quality, CI/CD |

### HIGH (Need Soon — Q2 2026)

| Priority | Standard | Why | Blocks |
|----------|----------|-----|--------|
| **P1** | **DWS Data Standard** | Supabase tables created ad-hoc. No naming conventions, no schema documentation standard, no migration rules | Database quality, market research tables |
| **P1** | **DWS Privacy Standard (GDPR)** | GDPR compliance is claimed but no internal standard for implementation. Need cookie policy, consent flows, data subject rights procedures | NIS2 certification, customer trust |
| **P1** | **DWS AI Governance Standard** | EU AI Act Article 12 requires reasoning lineage. No standard for how AI decisions are logged, audited, or disclosed | EU AI Act August 2026 deadline |
| **P1** | **DWS Pricing Standard** | 25 products across 5 categories with inconsistent pricing models (hourly, monthly, one-time, per-project). No rules for discounts, bundles, VAT handling | Store coherence, Stripe integration |

### MEDIUM (Need Later — Q3-Q4 2026)

| Priority | Standard | Why | Blocks |
|----------|----------|-----|--------|
| **P2** | **DWS Accessibility Standard** | UI_SKILLS_GAMMA covers some WCAG. Need full WCAG 2.2 AA compliance standard for all products | EU Accessibility Act 2025 |
| **P2** | **DWS Localization Standard** | Document standard mentions 27 EU languages. No actual i18n framework, translation workflow, or locale management standard | Nordic + DACH expansion |
| **P2** | **DWS Integration Standard** | ERP integrations (SAP, IFS, Dynamics) exist but no standard for connector design, data mapping, error handling | Enterprise deployments |
| **P2** | **DWS Incident Response Standard** | Security compliance mentions 24h notification. No formal incident response playbook | ISO 27001 certification |

### LOW (Future — 2027)

| Priority | Standard | Why |
|----------|----------|-----|
| **P3** | **DWS Partner Standard** | Rules for resellers, IT consultants, white-label partners |
| **P3** | **DWS Onboarding Standard** | Customer onboarding flow documentation |
| **P3** | **DWS SLA Standard** | Uptime commitments, response times, escalation paths |

---

## 3. Standards Needed Per Product

### Firehorse V3 (€9.99/mo SME) — Launch Blockers

| Standard | Status | Needed For |
|----------|--------|-----------|
| Brand Standard | ✅ Done | Product card, store category |
| Security Compliance | ✅ Done | Jitsi + email security controls |
| Market Research | ✅ Done | Competitive tracking |
| **Product Standard** | ❌ Missing | How product is defined in store |
| **Pricing Standard** | ❌ Missing | Stripe billing, VAT, annual discounts |
| **Privacy Standard** | ❌ Missing | GDPR for video/email |
| **Data Standard** | ❌ Missing | User data, meeting metadata |

### Firehorse V2 (Enterprise) — Enterprise Blockers

| Standard | Status | Needed For |
|----------|--------|-----------|
| Product Spec | ✅ Done | NVIDIA Inception |
| Security Standard | ✅ Done | CISO package |
| **AI Governance** | ❌ Missing | EU AI Act compliance for forensic AI |
| **Incident Response** | ❌ Missing | ISO 27001 cert requirement |
| **Integration Standard** | ❌ Missing | SAP/IFS connector quality |

### LWM V1 (€250k Physical AI) — Research Blockers

| Standard | Status | Needed For |
|----------|--------|-----------|
| Product Spec | ✅ Done | NVIDIA Inception |
| **AI Governance** | ❌ Missing | 55B parameter model governance |
| **Data Standard** | ❌ Missing | Training data provenance |

### Store / dws10.com — Operations Blockers

| Standard | Status | Needed For |
|----------|--------|-----------|
| Brand Standard | ✅ Done | Store UI |
| Site Quality | ✅ Done | Component consistency |
| **Product Standard** | ❌ Missing | 25 products need consistent structure |
| **Pricing Standard** | ❌ Missing | Revolut/Stripe/PayPal consistency |
| **Localization** | ❌ Missing | FI/EN product descriptions |

---

## 4. Recommended Implementation Order

```
Q1 2026 (NOW — February)
├── ✅ DWS_DOCUMENT_STANDARD.md (v1.4)
├── ✅ DWS_BRAND_STANDARD.md (v1.1)
├── ✅ DWS_SECURITY_STANDARD.md (v1.0)
├── ✅ DWS_MARKET_RESEARCH_STANDARD.md (v1.0) ← NEW
├── 🎯 DWS_PRODUCT_STANDARD.md ← NEXT
├── 🎯 DWS_API_STANDARD.md
└── 🎯 DWS_TESTING_STANDARD.md

Q2 2026 (Firehorse V3 Launch)
├── 🎯 DWS_DATA_STANDARD.md
├── 🎯 DWS_PRIVACY_STANDARD.md (GDPR)
├── 🎯 DWS_AI_GOVERNANCE_STANDARD.md
└── 🎯 DWS_PRICING_STANDARD.md

Q3 2026 (EU AI Act Deadline)
├── 🎯 DWS_ACCESSIBILITY_STANDARD.md
├── 🎯 DWS_LOCALIZATION_STANDARD.md
└── 🎯 DWS_INTEGRATION_STANDARD.md

Q4 2026 (ISO 27001 Certification)
├── 🎯 DWS_INCIDENT_RESPONSE_STANDARD.md
├── 🎯 DWS_PARTNER_STANDARD.md
└── 🎯 DWS_SLA_STANDARD.md
```

---

## 5. Standard Template

All new standards MUST follow this structure:

```markdown
# DWS [Name] Standard v1.0

***
# VERSION AND AGENT HISTORY
[Per DWS_DOCUMENT_STANDARD.md]
***

**Effective Date:** [Month Year]
**Scope:** [What this covers]
**Maintained by:** [Team]
**Depends on:** [List of prerequisite standards]

---

## 1. Purpose
[Why this standard exists — 2-3 sentences]

## 2-N. [Sections]
[Standard content]

## N+1. Relationship to Other Standards
[Table showing how this connects to other DWS standards]

## N+2. Enforcement
[How compliance is verified — CI/CD, code review, audit]

---
© 2026 Lifetime Oy
```

---

## 6. Standards Dependency Graph

```
DWS_DOCUMENT_STANDARD (root — all docs depend on this)
    ├── DWS_BRAND_STANDARD
    │   ├── DWS_PRODUCT_STANDARD ← needs creation
    │   │   └── DWS_PRICING_STANDARD ← needs creation
    │   └── UI_SKILLS_GAMMA
    │       └── DWS_ACCESSIBILITY_STANDARD ← needs creation
    ├── DWS_SECURITY_STANDARD
    │   ├── SECURITY_COMPLIANCE
    │   │   └── DWS_INCIDENT_RESPONSE_STANDARD ← needs creation
    │   └── DWS_PRIVACY_STANDARD ← needs creation
    ├── DWS_MARKET_RESEARCH_STANDARD ← NEW
    ├── DWS_DATA_STANDARD ← needs creation
    │   └── DWS_AI_GOVERNANCE_STANDARD ← needs creation
    ├── DWS_API_STANDARD ← needs creation
    ├── DWS_TESTING_STANDARD ← needs creation
    ├── DWS_LOCALIZATION_STANDARD ← needs creation
    └── DWS_INTEGRATION_STANDARD ← needs creation
```

---

**Document Owner:** Product Strategy & Engineering
**Last Updated:** 2026-02-14
**Session:** 01Uyf3ZyeW3UQhotzJVEpo7s

© 2026 Lifetime Oy · DWS Standards Roadmap

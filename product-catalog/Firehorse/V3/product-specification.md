# Firehorse V3 — SME Communication & Compliance Suite

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: 01Uyf3ZyeW3UQhotzJVEpo7s | Date: 14.02.2026 | Changes: Initial V3 product specification — Jitsi Meet + Email as core Firehorse features for SME market

Session Links & References:
  - Claude Code (01Uyf3ZyeW3UQhotzJVEpo7s): https://claude.ai/code/session_01Uyf3ZyeW3UQhotzJVEpo7s

Document Status:
  - Created: 14.02.2026
  - Last Modified: 14.02.2026
  - Language: EN
  - Languages Available: EN
  - Publication Status: ACTIVE

***

## EU-Sovereign Badge

[![EU-Sovereign](../../assets/badges/EU_Sovereign.png)](/sovereignty/sovereignty.html)

**Sovereignty Status:** EU-Sovereign by Default

| Deployment Option | Sovereignty Level | CLOUD Act | Best For |
|-------------------|-------------------|-----------|----------|
| **EU Cloud (Default)** | High | None | SMEs, startups, remote teams |
| **Self-Hosted** | Maximum | None | Regulated industries |
| **Hybrid** | High | None | Enterprises with edge requirements |

**Preferred Deployment:** EU Cloud (Hetzner Helsinki) with optional self-hosted Jitsi

> **"Sovereign Communication. Zero Compromise."** — Video meetings and email that never leave EU soil.

---

## Basic Information

**Product/Service Name:** Firehorse V3

**Product Title:** Firehorse V3: Sovereign Communication & Compliance for European SMEs

**Product/Service Webpage:** https://dws6.com/products/firehorse-v3

**Product/Service Type:** SaaS Platform — Video Conferencing + Email + Compliance

**Development Stage:** Developing

**Brand Color:** #2563eb (DWS Blue)

**Price:** €9.99/month per user

---

## Value Proposition

Firehorse V3 extends the Firehorse product family from enterprise forensic AI into an accessible, €9.99/month communication suite for European SMEs. It combines sovereign video conferencing (Jitsi Meet), professional email, and Fit for 55 compliance tools into a single platform — all hosted in the EU with zero CLOUD Act exposure.

**Why this product exists:** European SMEs currently rely on US-owned tools (Zoom, Teams, Google Meet, Gmail) for daily communication. Under NIS2, GDPR, and the EU AI Act, this creates compliance risk. Firehorse V3 gives SMEs an EU-sovereign alternative at a price point they can afford.

### Key Benefits

**Sovereign Video Meetings:**
- End-to-end encrypted video conferencing powered by Jitsi Meet
- No downloads required — works in any browser
- Hosted on Hetzner Helsinki (EU data residency)
- No US CLOUD Act jurisdiction

**Professional EU Email:**
- Custom domain email (@yourcompany.eu)
- Hosted in EU data centers (Finland/Germany)
- Spam filtering, calendar integration
- GDPR-compliant data handling

**Compliance Built In:**
- Fit for 55 carbon tracking for SME operations
- CSRD-ready sustainability reporting
- NIS2 compliance baseline included
- EU AI Act Article 12 logging for AI features

---

## Main Description

Firehorse V3 is the SME tier of the Firehorse product family. While V2 serves large construction enterprises with forensic AI audits, V3 democratizes sovereign communication and basic compliance tools for small and medium businesses across all 16 EU industry verticals. At €9.99/month per user, it provides video conferencing, email, and climate compliance in one platform — all EU-hosted with no US tech dependencies.

---

## Core Features

### 1. Video Conferencing (Jitsi Meet)

**Technology:** Jitsi Meet (open-source, Apache 2.0 license)

**Capabilities:**
- HD video and audio calls (1:1 and group)
- Screen sharing and presentation mode
- Chat during meetings
- Meeting recording (stored in EU)
- Virtual backgrounds
- Raise hand, reactions, tile view
- Calendar integration
- No participant limit (fair use policy)
- No time limit on meetings
- No app installation required

**Architecture:**
- Phase 1 (Current): meet.jit.si integration via IFrame API
- Phase 2 (Q2 2026): Self-hosted on Hetzner Helsinki (€6.49/mo VPS)
- Phase 3 (Q3 2026): Clustered deployment for 100+ concurrent rooms

**Dashboard Integration:**
- Embedded in DWS IQ Firehorse Dashboard
- Create/join meetings from side panel
- User identity from Supabase auth
- Room names prefixed with `dws6-` for namespace isolation

**Security:**
- End-to-end encryption (OWASP E2EE ready)
- OWASP compliance for web interface
- SRTP for media streams
- OWASP TLS 1.3 for signaling
- No meeting data stored after session ends (unless recording enabled)
- Recordings encrypted at rest (AES-256)

### 2. Email Service

**Technology:** Self-hosted mail stack (Postfix + Dovecot) or Migadu (EU provider)

**Capabilities:**
- Custom domain email (@company.fi, @company.eu)
- IMAP/SMTP access (any email client)
- Webmail interface
- 10 GB mailbox per user
- Spam & phishing protection (rspamd)
- SPF, DKIM, DMARC configured
- Calendar (CalDAV) and contacts (CardDAV)
- Shared mailboxes for teams

**EU Hosting:**
- Mail servers in Finland (Hetzner Helsinki) or Germany (Hetzner Falkenstein)
- Zero data transfer outside EU/EEA
- GDPR Article 28 compliant processing

### 3. Climate Compliance (Inherited from Firehorse V2)

**SME-appropriate subset of V2 compliance engine:**
- Carbon footprint calculator (Scope 1, 2, 3)
- EN 15978 simplified tracking
- CSRD disclosure templates
- Fit for 55 progress dashboard
- Automated quarterly sustainability reports

---

## Technical Architecture

### System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    DWS IQ Dashboard                      │
│                  (React 19 + Vite 7)                     │
├──────────┬──────────────┬──────────────┬────────────────┤
│ Projects │ AI Assistant │   Meeting    │    Email       │
│  Panel   │  (Claude)    │   (Jitsi)    │   (Webmail)   │
└──────────┴──────────────┴──────┬───────┴────────┬───────┘
                                 │                │
                          ┌──────▼───────┐  ┌─────▼──────┐
                          │  Jitsi Meet  │  │   Postfix  │
                          │  Server      │  │   Dovecot  │
                          │  (Hetzner)   │  │  (Hetzner) │
                          └──────────────┘  └────────────┘
                                 │                │
                          ┌──────▼────────────────▼──────┐
                          │     Hetzner Helsinki DC      │
                          │     (EU Data Residency)      │
                          └──────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19, Vite 7, TailwindCSS 4 | Dashboard UI |
| Video | Jitsi Meet (IFrame API) | Video conferencing |
| Email | Postfix + Dovecot / Migadu | Mail service |
| Auth | Supabase Auth (SAML/OIDC) | Single sign-on |
| Database | Supabase PostgreSQL | User data, projects |
| Hosting | Hetzner Helsinki (CX22) | EU infrastructure |
| CDN | Cloudflare (EU-only) | Edge delivery |
| AI | Claude API (Anthropic) | Climate assistant |

### Infrastructure Cost (Self-Hosted Phase 2)

| Component | Specification | Monthly Cost |
|-----------|--------------|-------------|
| Jitsi Server | Hetzner CX22 (2 vCPU, 4GB RAM) | €6.49 |
| Mail Server | Hetzner CX22 (2 vCPU, 4GB RAM) | €6.49 |
| Object Storage | Hetzner Storage Box 1TB | €3.81 |
| Domain + SSL | Let's Encrypt (free) | €0.00 |
| **Total** | | **€16.79/mo** |

**Break-even:** 2 paying users cover infrastructure costs.

---

## Pricing

### SME Plan — €9.99/month per user

**Includes:**
- Unlimited video meetings (no time limit)
- Custom domain email (10 GB/user)
- Climate compliance dashboard
- AI climate assistant
- EU data residency guarantee
- Standard support (email, 48h SLA)

### Professional Plan — €19.99/month per user

**Everything in SME, plus:**
- Meeting recording & transcription
- 50 GB email per user
- Advanced compliance reporting (CSRD templates)
- Priority support (24h SLA)
- Custom branding on meeting rooms

### Enterprise — Custom pricing

**Everything in Professional, plus:**
- Self-hosted deployment option
- Firehorse V2 forensic AI access
- SSO (SAML 2.0 / OIDC)
- SLA guarantee (99.9% uptime)
- Dedicated account manager

### Annual Discount

All plans: **2 months free** with annual billing.
- SME Annual: €99.90/year (€8.33/mo effective)
- Professional Annual: €199.90/year (€16.66/mo effective)

---

## Target Market

**Primary:** European SMEs (1-250 employees) across all industries

**Market Segments:**

1. **Micro-enterprises (1-9 employees):** Freelancers, consultants, small agencies
   - Pain: Paying for Zoom + Gmail + compliance tools separately
   - Value: One EU platform, one price

2. **Small businesses (10-49 employees):** Regional firms, contractors, manufacturers
   - Pain: NIS2/GDPR compliance pressure, US tool dependency
   - Value: Compliance-ready communication, sovereignty badges

3. **Medium enterprises (50-250 employees):** National firms, supply chain participants
   - Pain: Enterprise tool costs, data sovereignty requirements
   - Value: Affordable EU alternative to Microsoft 365 / Google Workspace

**Geographic Focus:**
- Finland (initial market)
- Nordic countries (Q2 2026)
- DACH region — Germany, Austria, Switzerland (Q3 2026)
- EU-wide (Q4 2026)

**Industry Verticals (DWS IQ 25+ industries):**
- Construction, Manufacturing, Energy, Transport, Real Estate
- Agriculture, Maritime, Mining, Chemicals, Aviation
- Waste Management, Water Utilities, Steel, Cement, Paper, Glass

---

## Competitive Positioning

### vs. Microsoft Teams / Google Workspace

| Factor | MS Teams / Google | Firehorse V3 | Winner |
|--------|-------------------|--------------|--------|
| **Price** | €5-22/user/mo | €9.99/user/mo | Comparable |
| **EU Data Residency** | Optional (extra cost) | Default (included) | Firehorse |
| **CLOUD Act** | Subject to US law | Zero exposure | Firehorse |
| **Video Quality** | Excellent | Good (Jitsi) | Tie |
| **Compliance Tools** | None built-in | Fit for 55, CSRD | Firehorse |
| **Open Source** | Proprietary | Jitsi (Apache 2.0) | Firehorse |
| **Vendor Lock-in** | High | Low (standard protocols) | Firehorse |

### vs. Zoom

| Factor | Zoom | Firehorse V3 | Winner |
|--------|------|--------------|--------|
| **Price** | €13.33/user/mo | €9.99/user/mo | Firehorse |
| **Data residency** | US-default | EU-default | Firehorse |
| **Email** | Not included | Included | Firehorse |
| **Compliance** | None | Built-in | Firehorse |
| **Meeting quality** | Industry leader | Good (Jitsi) | Zoom |

### Creating New Category

**"Sovereign Communication & Compliance"** — No existing product combines:
- EU-sovereign video meetings
- EU-sovereign email
- Climate compliance tools
- At SME-accessible pricing (€9.99/mo)

---

## Roadmap

### Phase 1 — Q1 2026 (Current)
- ✅ Jitsi IFrame API integration in DWS IQ Dashboard
- ✅ MeetingPanel component (create/join rooms)
- ✅ meet.jit.si as initial video provider
- 🔄 Email provider evaluation (Migadu vs. self-hosted)

### Phase 2 — Q2 2026
- 🎯 Self-hosted Jitsi on Hetzner Helsinki
- 🎯 Email service launch (custom domains)
- 🎯 Stripe payment integration (€9.99/mo billing)
- 🎯 10 pilot SME customers (Finland)
- 🎯 Landing page on dws6.com/products/firehorse-v3

### Phase 3 — Q3 2026
- 🎯 Meeting recording + transcription (EU storage)
- 🎯 Mobile app (React Native)
- 🎯 Calendar integration (CalDAV)
- 🎯 50 paying customers
- 🎯 €500 MRR milestone

### Phase 4 — Q4 2026
- 🎯 Multi-language UI (EN, FI, DE, SV)
- 🎯 Advanced compliance reporting
- 🎯 Partner channel (IT consultants reselling)
- 🎯 200 paying customers
- 🎯 €2,000 MRR milestone

---

## Integration with DWS Ecosystem

**Firehorse V3 as SME Gateway to DWS Platform:**

```
Firehorse V3 (€9.99/mo)  →  Firehorse V2 (€25k/yr)  →  LWM V1 (€250k)
       ↓                           ↓                          ↓
  SME Communication         Enterprise Forensic AI      Physical AI Model
  + Basic Compliance        + Advanced Audits            + Persistent Memory
```

**Upsell Path:**
1. SME starts with V3 (video + email + basic compliance)
2. Grows into V2 (forensic AI audits when sites scale)
3. Enterprise adopts LWM V1 (full Physical AI platform)

**Shared Components:**
- DWS IQ Dashboard (same React app, feature-flagged)
- Supabase Auth (same user system)
- AI Climate Assistant (same Claude integration)
- Sovereignty badges (same compliance framework)

---

## Business Model

**Unit Economics (per user):**

| Metric | Value |
|--------|-------|
| **Price** | €9.99/mo |
| **Infrastructure cost** | ~€1.50/mo (at 10 users/server) |
| **Gross margin** | ~85% |
| **CAC target** | €30 (3-month payback) |
| **LTV target** | €240 (24-month avg retention) |
| **LTV:CAC ratio** | 8:1 |

**Revenue Projections:**

| Quarter | Users | MRR | ARR |
|---------|-------|-----|-----|
| Q2 2026 | 10 | €100 | €1,200 |
| Q3 2026 | 50 | €500 | €6,000 |
| Q4 2026 | 200 | €2,000 | €24,000 |
| Q1 2027 | 500 | €5,000 | €60,000 |

---

## Compliance Coverage

| Regulation | V3 Coverage | How |
|------------|-------------|-----|
| **GDPR** | ✅ Full | EU hosting, DPA ready, no US transfer |
| **NIS2** | ✅ Baseline | Encrypted comms, access control, logging |
| **Fit for 55** | ✅ Basic | Carbon calculator, Scope 1-2-3 tracking |
| **CSRD** | ✅ Templates | Pre-built disclosure templates |
| **EU AI Act** | ✅ Article 12 | AI reasoning logs for climate assistant |
| **ePrivacy** | ✅ Compliant | No tracking, consent management |
| **CLOUD Act** | ✅ Free | Zero US jurisdiction (EU-only hosting) |

---

## References

- **Jitsi Meet:** https://jitsi.org — Open-source video conferencing (Apache 2.0)
- **Hetzner:** https://www.hetzner.com — EU cloud infrastructure (GDPR compliant)
- **NIS2 Directive (EU 2022/2555):** Network and Information Security
- **CSRD (EU 2022/2464):** Corporate Sustainability Reporting Directive
- **Fit for 55 Package:** EU climate policy framework (55% reduction by 2030)

---

**Document Owner:** Product Strategy
**Last Updated:** 2026-02-14
**Session:** 01Uyf3ZyeW3UQhotzJVEpo7s

---

© 2026 Lifetime Oy · Firehorse V3 SME Communication & Compliance Suite

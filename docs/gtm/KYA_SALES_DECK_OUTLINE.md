# KYA Sales Deck — 10-Slide Outline

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Initial 10-slide sales deck outline. Narrative: Shield → Sword → Proof → Deal. Sourced from all KYA standards + financial projections

Document Status:
  - Created: 10.03.2026
  - Last Modified: 10.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: INTERNAL
  - Classification: CONFIDENTIAL — Sales Material
  - Document Type: GTM Asset / Sales Deck Outline

Related Documents:
  - docs/gtm/KYA_CISO_ONE_PAGER.md (The Shield — CISO angle)
  - docs/gtm/KYA_CTO_CFO_ONE_PAGER.md (The Sword — CTO/CFO angle)
  - docs/gtm/KYA_CONNECTOR_BRIEF_PALANTIR.md (Partner connector brief)
  - Legal/KYA_SECURITY_v1.2.md (Security foundation)
  - Legal/KYA_OPTIMIZATION_v1.4.md (Financial layer)

***

**Lifetime Oy | Helsinki, Finland**
**Audience:** Enterprise sales meetings (CISO + CTO + CFO present)
**Duration:** 20 minutes (10 slides + 10 minutes Q&A)
**Narrative Arc:** Problem → Shield → Sword → Proof → Deal

---

## Slide 1 — Title

**DWS IQ Platform — Know Your Agent**
*Train and run enterprise agent swarms safely*

Lifetime Oy | Helsinki, Finland
March 2026

**Tagline:** Verify the Human. Sandbox the Agent. Secure the Intent.

---

## Slide 2 — The Problem

**Your agents are autonomous. Your governance isn't.**

- Enterprise AI agents are making decisions, modifying data, spawning sub-agents
- KYC verifies identity. KYB verifies business. Nothing verifies the agent
- EU AI Act Article 12 (2026): High-risk AI requires automatic event logging
- CBAM (2026): 50-tonne steel threshold requires real-time emissions tracking
- Your board is asking: "Who is accountable when the agent acts wrong at 3 AM?"

**Visual:** Timeline showing KYC (1990s) → KYB (2010s) → KYA (2026) — the missing layer

---

## Slide 3 — Know Your Agent: The Shield (for the CISO)

**Hardware-attested agent governance**

| What | How | Spec |
|------|-----|------|
| Identity Attribution | Cryptographic session binding | Shufti IDV / KYC-verified |
| Capability Gating | VMM-layer manifest enforcement | Sub-5ms guardrails |
| Forensic Observability | TPM 2.0 sealed audit trail | Court-defensible (EU AI Act Art. 12) |
| Agent Kill | Firehorse Snap | < 125ms (Firecracker MicroVM, AWS benchmark) |
| Isolation | Firecracker MicroVM | < 5MB, < 125ms boot |

**Key message:** This is hardware, not software. The governance layer sits *below* the agent's operating system.

---

## Slide 4 — Agent Trust Score (ATS)

**Real-time, per-agent, continuous**

```
ATS = 1.0 - V×0.25 - L - D×0.05 + A×0.18
```

| Score | Tier | Action |
|-------|------|--------|
| 0.85–1.00 | Green | Full access |
| 0.70–0.84 | Amber | Restricted |
| 0.50–0.69 | Red | Read-only |
| < 0.50 | Quarantine | Terminated (< 125ms (Firecracker MicroVM, AWS benchmark)) |

**Visual:** Live ATS dashboard mockup showing 16 industry agents with real-time scores

**Key message:** You can see what every agent is doing, how trustworthy it is, right now.

---

## Slide 5 — Know Your Architecture: The Sword (for the CTO/CFO)

**Governance is a profit center, not a cost center**

- Same hardware isolation that satisfies the CISO generates financial value
- Leash-aware autoresearch: agents optimize *within* governance bounds
- 35% uplift vs ungoverned optimization (measured on proxy metrics)
- Agentic Efficiency Law: every governed agent continuously improves its process
- Stacking Effect: 3–7% bonus from cross-agent knowledge sharing

**Key message:** The CISO got the Shield. You get the Sword. Same platform, two returns.

---

## Slide 6 — Financial Impact

**Per-industry annual value (selected)**

| Industry | Autoresearch Gain | EUR/Enterprise/Year |
|----------|-------------------|---------------------|
| Iron & Steel | 11–15% | €1M–€5.1M |
| Construction | 11–22% | €1.1M–€5.4M |
| Chemicals | 9–13% | €848k–€4.2M |
| Petroleum Refining | 9–13% | €1.2M–€6.1M |
| Pharma & Biotech | 15–22% | €5M–€45M |

**Pricing:** €499–€1,999/mo SaaS subscription + API transaction fees

**ROI at scale:** 14–51x

---

## Slide 7 — Green Steel CBAM Use Case

**Court-defensible carbon compliance in real-time**

1. IoT sensors + ERP data flow into KYA-governed emissions agent
2. Continuous Scope 1/2/3 calculation per batch
3. 50-tonne threshold triggers automatic CBAM certificate calculation
4. Rebate Pulse deducts origin-country carbon prices (CBAM Art. 9)
5. Every calculation TPM-sealed, watermarked, audit-ready

**Visual:** End-to-end flow diagram (steel production → emissions agent → CBAM monitor → Firehorse audit)

**Savings example:** Turkey steel import — €40–60/tCO2e saved via automatic rebate

---

## Slide 8 — Helsinki Sandbox: Physical Proof

**Not a simulation. Hardware running in Helsinki.**

| Property | Value |
|----------|-------|
| Hardware | Acer Veriton GN100 (EU-manufactured) |
| Location | Helsinki, Finland (air-gapped) |
| Running | Green Steel CBAM + leash-aware autoresearch |
| Results | 35% uplift (Iron & Steel, Cement, Power) |
| Available | Partner technical evaluation upon request |

**Visual:** Photo of Helsinki Sandbox hardware + live dashboard screenshot

**Key message:** We don't just have a standard. We have a running system.

---

## Slide 9 — Compliance & Certifications

| Framework | Status |
|-----------|--------|
| EU AI Act Art. 12/14 | Compliant (automatic event logging + human oversight) |
| CBAM (Regulation 2023/956) | Real-time enforcement + Rebate Pulse |
| NIS2 | Supply chain security + incident response |
| DORA | Digital operational resilience |
| GDPR | Data minimization in agent manifests |
| SOC 2 Type II | In progress |
| ISO 42001 | AI management systems alignment |
| NIST SP 800-207 | Zero Trust extension (KYA-NIST-SP-001 submitted) |

**20 EU-regulated industries supported.** Not a horizontal "AI governance" product — deep vertical industry models.

---

## Slide 10 — Next Steps

**Three paths forward:**

| Path | Timeline | Outcome |
|------|----------|---------|
| **Technical Evaluation** | 2 weeks | Helsinki Sandbox access, ATS demo, architecture review |
| **Pilot (1 industry)** | 90 days | Production KYA deployment, measured efficiency gains |
| **Enterprise License** | 6 months | Full 20-industry deployment, custom SaaS pricing |

**Contact:** Risto Anton, Lead Architect
risto@onelifetime.world | Lifetime Oy, Helsinki

---

## Appendix Notes (not slides — presenter prep)

- **CISO in the room?** Lead with slides 2–4 (The Shield). Then pivot to 5–6 (The Sword)
- **CTO/CFO only?** Start at slide 2, skip to slide 5, deep dive on 6–7
- **Technical audience?** Spend time on slide 4 (ATS formula) and slide 7 (Green Steel flow)
- **Partner/BD meeting?** Use connector brief instead, reference slides 8–9 for proof points
- **Objection "we have guardrails":** Slide 3 — hardware vs software comparison. < 125ms (Firecracker MicroVM, AWS benchmark) kill vs graceful shutdown
- **Objection "too early":** Slide 8 — Helsinki Sandbox is running. NIST submissions filed. This isn't a whitepaper

---

**Lifetime Oy** | Helsinki, Finland
**Classification:** CONFIDENTIAL — Sales Material

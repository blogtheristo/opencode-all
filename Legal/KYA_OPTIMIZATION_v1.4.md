# KYA Standard v1.4 — Know Your Architecture: Financial Value & Agent Self-Optimization Governance

---

# VERSION AND AGENT HISTORY

Version: 1.9

Sessions & Modifications:

- Version: 1.9 | Tool: Claude Code (Sonnet 5) | Session: claude/kya-mandate-evidence-migration-mq7hnp | Date: 07.07.2026 | Changes: Added §13 Agentic Commerce Mandate Gating — Human Not Present as Revenue Gate (v1.9), syncing KYA_STANDARD_v1.md §14 into the financial layer per Boardy's framing — HNP unattended-transaction authority as a monetizable capability unlocked by ATS tier, extending §3.2's Financial Multiplier table with a spend-authority dimension. Renumbered §13 Conclusion → §14
- Version: 1.8 | Tool: Claude Code (Opus 4.6) | Session: claude/aegis-swot-analysis-gYCYG | Date: 05.04.2026 | Changes: Article 99 citation sweep — corrected penalty tier from Art. 99 (blanket €35M/7%) to Art. 99(4) (€15M/3% for high-risk deployer non-compliance), with Art. 99(3) €35M/7% retained only for Art. 5 prohibited-practice context; softened "safe harbor" framing to "Art. 12 + Art. 26 deployer evidence for D&O AI-governance coverage" per PR #976 sweep pattern
- Version: 1.7 | Tool: Claude Code (Opus 4.6) | Session: claude/agent-memory-fact-extraction-gLEss | Date: 23.03.2026 | Changes: Added Section 12.1 Memory-Driven Financial Intelligence — fact extraction (PR-254) as data feed for per-customer financial optimization; client memory enables personalized ROI calculations, retention risk scoring, upsell opportunity detection; dual LWM+client memory architecture positions KYA-O as the only governance layer covering both domain knowledge and relationship knowledge; cross-referenced KYA-S §10 Memory Audit Trail; updated Related Documents
- Version: 1.6 | Tool: Claude Code (Opus 4.6) | Session: claude/kya-standard-review-W3Qcg | Date: 15.03.2026 | Changes: External review integration — ATS formula changed to multiplicative with V>0 Hard Stop (§3.1). Carbon Credit Arbitrage value driver for Fit for 55 sectors (§5.1.1). D&O Insurance positioning (§5.6.1). Parametric Insurance Integration (§5.6.2). Spectral Convergence Test + Ablation Attribution for Proxy-to-Scale (§9.4). Revenue model changed to Decline-to-Scale with Performance Guarantee (§5.4, split: internal revenue deferral + customer-facing service credit). Verification Credit Rebate (§5.4). W&B Prompts + Arthur.ai/Arize competitive positioning (§5.9). Karpathy attribution footnote (§11.2). Industry-tiered fault fees cross-ref (§4.2). KYA-O internal naming convention. D&O investor note section drafted (docs/field-notes/)
- Version: 1.5 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Boardy review integration — Healthcare/MedTech added as 20th industry (Tier 3). Third-party validation gate for A factor (anti-gaming). KS-test/Jensen-Shannon divergence added to Proxy-to-Scale transfer validation. Spearman rank correlation specified. Palantir AIP competitive positioning (§5.9). SOC 2 Type II + ISO 42001 compliance. Revenue share narrowed to 7.5% flat Alpha-Share. Dual acronym KYA retained as tiered entry strategy (Shield/Sword)
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Standalone split from combined KYA Standard. Research-as-a-Service positioning, Agentic Efficiency Law (§6.1), Stacking Effect (§6.2), Orchestrator Layer (§8.1), 19-industry financial value layer, Proxy-to-Scale Mapping (§9), Autonomous Hyperparameter Tuning (§10), Ownership & Attribution Clarification (§11). ATS autoresearch factor corrected to A×0.25. Clean Karpathy attribution (no ownership claims). Gemini-informed wedge industries + Grok financial layer merged
- Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Singularity-Ready upgrade — Pillar 4 (Autoresearch & Singularity Safety), ATS autoresearch delta, financial multiplier per trust tier, per-industry efficiency gains (9–22%), Capability Manifest v1.2, Karpathy field note, projected EU-wide impact
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Financial Value Model — per-industry KYA revenue sizing, verification volume economics, insurance & liability reduction, carbon penalty avoidance ROI

Document Status:

- Created: 10.03.2026
- Last Modified: 05.04.2026
- Language: English
- Languages Available: EN
- Publication Status: ACTIVE
- Classification: PARTNER
- Document Type: Technical Standard / Financial & Optimization Architecture

Related Documents:

- Legal/KYA_STANDARD_v1.md (Parent: Combined KYA Standard v1.0–v1.1 — public document)
- Legal/KYA_SECURITY_v1.2.md (Companion: Know Your Agent v1.3 — REQUIRED FOUNDATION)
- Legal/KYA_NIST_STANDARD_v1.md (NIST derivative: KYA-NIST-SP-001)
- Legal/KYA_NIST_OPTIMIZATION_v1.md (NIST derivative: KYA-NIST-SP-003 — Green Steel CBAM)
- DWS_SECURITY_STANDARD.md (Section 18 — KYA & BYO Agent Security)
- docs/field-notes/2026-03-10-karpathy-autoresearch-nanochat-agent-swarm.md (Autoresearch methodology)
- 16-INDUSTRIES.md (16 EU-regulated industries)
- src/identity/ats-engine.ts (ATS engine implementation)

---

**DWS IQ Platform | Lifetime Oy**
**Version:** KYA Architecture Standard v1.7 (KYA-O)
**Status:** Production-Ready (Q2 2026 Launch — Agent Self-Optimization Governance & Financial ROI Layer)
**Lead Architect:** Risto Anton, Lifetime Oy
**Date:** March 2026
**Foundation Standard:** `Legal/KYA_SECURITY_v1.2.md` (Know Your Agent — identity, isolation, forensics)

---

> **Govern the Self-Optimization. Monetize the Swarm.**

---

### Why Dual KYA?

**KYA** expands as **Know Your Agent** (security & identity — The No) or **Know Your Architecture** (financial optimization & agent self-optimization governance — The More) depending on audience. The same three letters cover both with zero overlap in content. CISOs get the security standard they need. CFOs get the financial model they need. One brand, two entry points.

**Internal Naming (v1.6):** To avoid acronym collision during audits, internal documentation uses **KYA-S** (Security) and **KYA-O** (Optimization). External messaging: _"We give you the Identity to trust the agent and the Architecture to profit from it."_

---

**Dependency:** Requires Know Your Agent v1.1 (`Legal/KYA_SECURITY_v1.2.md`) as foundation. This standard extends KYA governance with autoresearch capabilities, financial attribution, and agent self-optimization governance. Know Your Agent provides Identity Attribution, Capability Gating, and Forensic Observability. Know Your Architecture builds the financial, optimization, and orchestration layers on top.

---

## Table of Contents

1. [Core Upgrade Summary (v1.1 → v1.4)](#1-core-upgrade-summary-v11--v14)
2. [Pillar 4: Autoresearch & Agent Self-Optimization Governance Layer](#2-pillar-4-autoresearch--agent-self-optimization-governance-layer)
3. [Agent Trust Score Extensions (v1.4)](#3-agent-trust-score-extensions-v14)
4. [Capability Manifest v1.2](#4-capability-manifest-v12)
5. [Financial Value Layer — 19 Industries](#5-financial-value-layer--19-industries)
6. [The Agentic Efficiency Law & Stacking Effect](#6-the-agentic-efficiency-law--stacking-effect)
7. [Field Note: Karpathy Autoresearch (March 2026)](#7-field-note-karpathy-autoresearch-march-2026)
8. [Autoresearch Optimization Protocol & Orchestrator Layer](#8-autoresearch-optimization-protocol--orchestrator-layer)
9. [Proxy-to-Scale Mapping](#9-proxy-to-scale-mapping)
10. [Autonomous Hyperparameter Tuning](#10-autonomous-hyperparameter-tuning)
11. [Ownership & Attribution Clarification](#11-ownership--attribution-clarification)
12. [Conclusion](#12-conclusion)

---

## 1. Core Upgrade Summary (v1.1 → v1.4)

KYA v1.4 moves beyond "Model-as-a-Service" to **Research-as-a-Service**. The core assumption: any system deployed is merely a "base state" that an agent swarm should immediately begin optimizing against real-world telemetry. This directly enables **agent self-optimization governance** — where autonomous agents iteratively improve their own models, policies, and performance under hardware-attested safety bounds, delivering audit-ready self-optimization, liability containment, continuous efficiency gains, and faster deployment speed.

The upgrade delivers **11–30%+ efficiency gains** (benchmarked from real autoresearch runs) that translate into measurable financial value across all 20 industries: reduced energy OPEX, faster compliance cycles, lower stranded-asset risk, and new revenue from AI-optimized industrial processes.

**New financial multipliers** (embedded in Agent Trust Score & Capability Manifest):

- **Autoresearch delta** — automatic KYA score uplift + revenue attribution tracking
- **Projected ROI:** 8–22x within 18 months in heavy-industry deployments (energy savings + tender wins + carbon-credit monetization)

**Applied to Industry:**

- **Proxy Metrics** — Identify small-scale simulations (depth=12) that correlate to full-scale success (depth=24)
- **Autonomous Iteration** — Agents propose, code, and test hundreds of micro-adjustments
- **Additive Scaling** — Validated "wins" are promoted to the production-grade system

### What Changed: v1.1 vs v1.4

| What Changed      | v1.1                                    | v1.4                                                                    |
| ----------------- | --------------------------------------- | ----------------------------------------------------------------------- |
| Pillars           | 3 (Identity, Capability, Forensics)     | **4** (+ Autoresearch & Agent Self-Optimization Governance)             |
| ATS Formula       | `1.0 - V×0.25 - L - D×0.05`             | `ATS_Base × (1 + A)` where A=0 if V>0                                   |
| Trust Score Table | 4 tiers, no financial column            | **4 tiers + Financial Multiplier per tier**                             |
| Financial Layer   | None                                    | **Per-industry ROI, €14–38B EU-wide by 2030**                           |
| Manifest Schema   | v1.1 (paths only)                       | **v1.2 (+ autoresearch, target metrics, financial attribution)**        |
| Positioning       | Model-as-a-Service                      | **Research-as-a-Service**                                               |
| Named Laws        | None                                    | **Agentic Efficiency Law, Stacking Effect**                             |
| Swarm Management  | Manual                                  | **Orchestrator Layer (kill early, promote winners)**                    |
| Industry Coverage | 16 (Fit for 55)                         | **20** (+ Fintech, Pharma, Cybersecurity, Healthcare/MedTech)           |
| Compliance        | EU AI Act, NIS2, GDPR, Fit for 55, DORA | **+ SOC 2 Type II, ISO 42001, Autoresearch audit trail for Art. 12/14** |

---

## 2. Pillar 4: Autoresearch & Agent Self-Optimization Governance Layer

Every governed agent can now run internal **autoresearch loops** (depth=12 → depth=24 scaling) under strict KYA bounds. Changes are proposed, validated on proxy models, stacked, and promoted only if they improve the target metric (validation loss, energy efficiency, emissions, latency, etc.). All experiments are immutably logged in Firehorse and attributed to the verified identity.

### The Autoresearch Loop (inside MicroVM)

```
┌─────────────────────────────────────────────────────────┐
│  MicroVM (KYA-Governed Autoresearch)                     │
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │ Propose  │───>│ Validate │───>│ Stack    │          │
│  │ Change   │    │ on Proxy │    │ if +Δ   │          │
│  └──────────┘    └──────────┘    └──────────┘          │
│       │                │               │                │
│       │         validation_loss    improvement          │
│       │         energy_kwh/ton     confirmed?           │
│       │         co2_per_unit            │               │
│       │                                 ▼               │
│       │                          ┌──────────┐          │
│       │                          │ Promote  │          │
│       │                          │ depth=12 │          │
│       │                          │ → dep=24 │          │
│       │                          └──────────┘          │
│       │                                                 │
│  ┌────────────────────────────────────────────┐        │
│  │ Firehorse: log every proposal, delta, rank │        │
│  │ Budget Cap: max N experiments, max $cost   │        │
│  │ Safety: unauthorized scope → ATS -40, KILL │        │
│  └────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

### Guardrails

| Guardrail                     | Enforcement                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| **Scope lock**                | Autoresearch can only tune parameters declared in Capability Manifest `target_metrics` |
| **Budget cap**                | Max experiments, max tokens, max compute-hours per session — enforced at VMM           |
| **No isolation weakening**    | MicroVM boundaries, kernel isolation, egress rules are NEVER tunable                   |
| **Human gate for production** | All parameter changes require human sign-off before production deployment              |
| **Rollback window**           | 24h automatic rollback if any security metric degrades                                 |
| **Breach simulation**         | Every parameter set must pass adversarial breach simulation before promotion           |
| **Out-of-scope penalty**      | Unauthorized autoresearch attempts → ATS drops 40 points, session frozen               |

This turns autonomous self-optimization into enterprise-grade, auditable, financially quantifiable intelligence.

---

## 3. Agent Trust Score Extensions (v1.4)

### 3.1 Updated Formula (v1.6 — Multiplicative with V>0 Hard Stop)

```
ATS_Base  = max(0, 1.0 - V×0.25 - L - D×0.05)
ATS_Final = ATS_Base × (1 + A)

V = KYA_VIOLATION count       (4 violations = zero trust)
L = 0.10 if avg_latency > 500ms (+ Cold-Start Latency Penalty, see KYA-S §4.1)
D = DENIED path access attempts
A = autoresearch improvement factor (capped at 0.25, validated on industry proxy metrics)
    e.g., +0.11 for 11% energy efficiency gain; +0.09 for 9% process optimization

CRITICAL: If V > 0, then A = 0. No exceptions.
```

**Why Multiplicative (v1.6):** The previous additive formula `ATS = ... + A×0.18` was mathematically risky. An agent could be highly "optimal" (high A) but fundamentally "leaky" (moderate V) and still maintain a high score. The multiplicative formula ensures A _amplifies_ a clean security baseline rather than _compensating_ for security failures.

**The V > 0 Hard Stop:** If an agent has **any** KYA violations, the A factor is zeroed. You cannot optimize your way out of a security violation. This aligns with the procurement pincer: the CISO's "No" (V=0 required) gates the CFO's "More" (A factor active).

**The A Factor:** The autoresearch improvement factor rewards agents that demonstrably improve system performance through governed self-optimization. It is computed from the agent's validated autoresearch results, capped at 0.25 to prevent score inflation. Only improvements validated through the full Propose → Validate → Stack → Promote cycle count toward the A factor. A must be validated against the Industry Proxy Metric (§9) to prevent agents "marking their own homework."

**Third-Party Validation Gate (CRITICAL):** An agent that self-reports autoresearch gains can inflate A. To prevent gaming, A factor contributions require **independent validation** before contributing to ATS:

| Validation Step                      | Requirement                                                                                                                                                        | Enforcement                                             |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| Proxy-to-scale correlation           | Spearman rank correlation > 0.90 between proxy and production improvements                                                                                         | Orchestrator validates automatically                    |
| Distribution shift tests             | Kolmogorov-Smirnov test + Jensen-Shannon divergence < 0.15                                                                                                         | Orchestrator blocks if distributions diverge            |
| **Spectral Convergence Test** (v1.6) | Verify gradient flow remains stable across scales during hyperparameter transfer (depth=12 → depth=24)                                                             | Orchestrator runs eigenvalue analysis on loss landscape |
| **Ablation Attribution** (v1.6)      | Agent must provide a "Sensitivity Map" showing which specific change contributed what % of the A factor. If attribution is non-linear or hallucinated, A is voided | Orchestrator validates linearity of attribution claims  |
| Human domain expert sign-off         | For A > 0.15, a qualified domain specialist must confirm the improvement is genuine                                                                                | 72h human gate                                          |
| Cross-validation on unseen data      | Improvement must reproduce on data the agent never accessed during autoresearch                                                                                    | Orchestrator runs holdout evaluation                    |
| Temporal stability check             | Improvement must persist for ≥48h in staging without degradation                                                                                                   | Automated monitoring                                    |

**Security baseline (without A factor):** See `Legal/KYA_SECURITY_v1.2.md` §3. The security standard uses `ATS_Base = max(0, 1.0 - V×0.25 - L - D×0.05)` — security scoring is never inflatable by optimization performance.

**Implementation:** `src/identity/ats-engine.ts` — evaluated before external IDV calls.

### 3.2 Trust Score Ranges with Financial Multiplier (19 Industries)

| ATS Range | KYA Score | Permission Level                  | Financial Multiplier (20 industries) | Decision          |
| --------- | --------- | --------------------------------- | ------------------------------------ | ----------------- |
| >= 0.80   | >= 80     | Full sandbox + Autoresearch swarm | 1.8–3.2x OPEX savings/yr             | **GO + Monetize** |
| 0.50–0.79 | 50–79     | Restricted + limited autoresearch | 1.3–2.0x                             | **GO** (limited)  |
| < 0.50    | < 50      | Suspended — human review required | —                                    | **NO_GO**         |
| = 0.00    | = 0       | Frozen — agent terminated         | —                                    | **NO_GO**         |

**Financial Multiplier logic:** Agents with higher trust scores produce more reliable autoresearch results, which translates to higher confidence in financial attribution. A GO+Monetize agent's efficiency gains can be directly billed to the enterprise. A limited-GO agent's gains require additional human validation before financial attribution.

---

## 4. Capability Manifest v1.2

### 4.1 Autoresearch Extensions

The Capability Manifest v1.2 extends the v1.1 path-scoped schema (see `Legal/KYA_SECURITY_v1.2.md` §9.1) with autoresearch governance fields:

| Field                   | Type     | Description                                                                                 |
| ----------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `autoresearch_enabled`  | boolean  | Whether this agent is permitted to run self-optimization loops                              |
| `max_depth`             | integer  | Maximum experiment depth (e.g., 24 for full-scale validation)                               |
| `max_experiments`       | integer  | Maximum number of change proposals per session                                              |
| `max_compute_hours`     | float    | Compute budget ceiling — enforced at VMM level                                              |
| `target_metrics`        | string[] | Metrics the agent is authorized to optimize (e.g., `validation_loss`, `energy_kwh_per_ton`) |
| `improvement_threshold` | float    | Minimum delta required for a change to be considered an improvement                         |
| `financial_attribution` | boolean  | Whether efficiency gains are tracked for revenue-share billing                              |

**Example Manifest v1.2:**

```json
{
  "manifest_version": "1.2",
  "subagent_id": "<uuid>",
  "session_id": "<kya-session-token>",
  "signed_at": "<ISO-8601>",
  "permitted_paths": ["/mock-api/", "/temp-db/"],
  "denied_paths": ["/prod-secrets/"],
  "ttl_seconds": 3600,
  "kya_score_at_sign": 85,
  "autoresearch_enabled": true,
  "max_depth": 24,
  "max_experiments": 700,
  "max_compute_hours": 48,
  "target_metrics": ["validation_loss", "energy_kwh_per_ton", "co2_per_unit"],
  "improvement_threshold": 0.05,
  "financial_attribution": true
}
```

### 4.2 AUTORESEARCH_FAULT Class

v1.4 adds a new fault classification to the existing fault attribution system (see `Legal/KYA_SECURITY_v1.2.md` §9.4):

| Fault Class          | Responsible Component | Example                                                                                    |
| -------------------- | --------------------- | ------------------------------------------------------------------------------------------ |
| `AUTORESEARCH_FAULT` | Autoresearch Loop     | Self-optimization produced regression, exceeded budget, or modified out-of-scope parameter |

This class is stored in the `kya_fault_attribution` Supabase table alongside existing fault classes (`LOGIC_FAULT`, `INTEGRATION_FAULT`, `MANIFEST_FAULT`, `OPERATOR_FAULT`). RLS policies apply identically.

**Tiered Fault Fees (v1.6):** Fault investigation fees are tiered by industry risk — see `Legal/KYA_SECURITY_v1.2.md` §9.5. Tier 1 (Critical Emissions) pays EUR 15/fault with 4h SLA; Tier 3 (Wedge) pays EUR 5/fault with 12h SLA. `AUTORESEARCH_FAULT` follows the same tier pricing. For Enterprise World (Tier 4) customers on Alpha-Share, a mandatory 30-day deferral window applies to associated Alpha-Share revenue.

---

## 5. Financial Value Layer — 19 Industries

KYA is not a cost center — it is a **revenue-generating compliance layer**. Every BYO agent session generates verification events, and every autoresearch improvement generates financially attributable value.

KYA governance applies to **any industry where autonomous agents operate** — not only the 16 EU Fit for 55 regulated sectors. v1.4 expands coverage with 4 additional high-value wedge industries where autoresearch creates immediate financial impact.

### 5.1 Tier 1: Critical Emissions — High KYA Value (Fit for 55 Core)

| #   | Industry                   | Autoresearch Efficiency Gain          | Primary Value Driver                           | Financial Value per Enterprise (EUR/yr) |
| --- | -------------------------- | ------------------------------------- | ---------------------------------------------- | --------------------------------------- |
| 1   | Power & Heat Generation    | 9–15% energy efficiency               | Self-tuned process agents reduce ETS/CBAM cost | **560k–2.2M**                           |
| 2   | Iron & Steel Production    | 11–15% energy efficiency              | Supply chain carbon optimization               | **1M–5.1M**                             |
| 3   | Cement & Lime Production   | 10–14% process optimization           | Kiln efficiency + CBAM material passports      | **524k–3.1M**                           |
| 4   | Chemicals & Petrochemicals | 9–13% energy efficiency               | Process emissions + hydrogen transition        | **848k–4.2M**                           |
| 5   | Aviation                   | 7–12% fuel optimization               | SAF compliance + route optimization            | **230k–1.1M**                           |
| 6   | Maritime Shipping          | 8–12% fuel & maintenance              | Voyage emissions + FuelEU compliance           | **336k–1.6M**                           |
| 7   | Road Transport & Logistics | 9–12% fleet optimization              | ETS2 readiness + zero-emission transition      | **272k–1.1M**                           |
| 8   | Construction & Buildings   | 11–22% predictive maintenance & yield | EPBD + lifecycle carbon + BIM integration      | **1.1M–5.4M**                           |

### 5.1.1 Carbon Credit Arbitrage (v1.6 — Missing Value Driver)

For the 16 Fit for 55 sectors, KYA-optimized systems don't just reduce costs — they generate **verifiable Scope 1/2 reductions** that can be monetized as carbon credits or used to reduce CBAM border adjustment obligations.

| Mechanism                         | How KYA Enables It                                                                                                                                      | Financial Impact                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| **ETS Allowance Surplus**         | KYA-governed autoresearch reduces energy consumption → fewer allowances needed → surplus sold on EU ETS market                                          | EUR 60–100/tCO2 × surplus tonnage          |
| **CBAM Avoidance**                | Auditable carbon calculations from KYA agents reduce CBAM liability on imports                                                                          | 5–15% reduction in border adjustment costs |
| **Voluntary Carbon Credits**      | Firehorse audit trail provides MRV (Measurement, Reporting, Verification) evidence for voluntary carbon market credits (Gold Standard, Verra)           | EUR 15–80/tCO2 depending on methodology    |
| **Article 6.4 (Paris Agreement)** | KYA's identity attribution + forensic observability satisfies the "corresponding adjustment" transparency requirements for international carbon trading | Access to sovereign carbon markets         |

**Example (Steel):** A KYA-governed autoresearch agent reduces blast furnace energy consumption by 11%. For a 2M tonne/yr steel plant, this translates to ~220k tCO2 Scope 1 reduction. At EUR 70/tCO2 ETS price: **EUR 15.4M/yr** in allowance surplus value — on top of the energy OPEX savings.

### 5.2 Tier 2: Important Emissions — Moderate KYA Value (Fit for 55 Extended)

| #   | Industry                     | Autoresearch Efficiency Gain  | Primary Value Driver                  | Financial Value per Enterprise (EUR/yr) |
| --- | ---------------------------- | ----------------------------- | ------------------------------------- | --------------------------------------- |
| 9   | Agriculture & Livestock      | 8–18% yield + waste reduction | Farm carbon + methane tracking        | **118k–572k**                           |
| 10  | Waste Management & Recycling | 11–18% resource yield uplift  | Methane capture + circular economy    | **92k–348k**                            |
| 11  | Aluminium Production         | 10–15% energy optimization    | Renewable electricity + CBAM          | **524k–2.1M**                           |
| 12  | Pulp, Paper & Printing       | 8–14% process optimization    | Forestry carbon + supply chain        | **114k–460k**                           |
| 13  | Petroleum Refining           | 9–15% energy efficiency       | Decline pathway + SAF production      | **530k–2.1M**                           |
| 14  | Food & Beverage Processing   | 8–16% yield + waste reduction | Agricultural supply chain carbon      | **104k–396k**                           |
| 15  | Glass & Ceramics Production  | 9–14% process optimization    | Process emissions + material tracking | **112k–448k**                           |
| 16  | Mining & Quarrying           | 11–18% predictive maintenance | Extraction emissions + CRM compliance | **168k–672k**                           |

### 5.3 Tier 3: Wedge Industries — High Agent Density, High Autoresearch Value (NEW in v1.4)

These industries are not Fit for 55 core but have extremely high autonomous agent density and autoresearch ROI. KYA governance is critical wherever agents self-optimize at scale. Healthcare/MedTech added in v1.5 per Marcus review — EU MDR compliance for autonomous diagnostic agents is a massive liability surface comparable to Pharma.

| #   | Industry             | Autoresearch Application                                                                            | Proxy Metric (depth=12 equivalent)         | Financial Value per Enterprise (EUR/yr)               |
| --- | -------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| 17  | Fintech & Trading    | Agents tune alpha-discovery models on 1-hour "proxy" markets before scaling to live trading         | Sharpe ratio on synthetic market data      | **2M–15M**                                            |
| 18  | Pharma & Biotech     | Swarms optimize protein folding simulations, tuning energy loss functions autonomously              | Binding affinity prediction accuracy       | **5M–50M** (Time to Molecule -15–20%)                 |
| 19  | Cybersecurity        | Autoresearch on anomaly detection thresholds — reduce false positives while maintaining sensitivity | SOC alert-to-breach detection ratio        | **500k–3M** (alert fatigue reduction)                 |
| 20  | Healthcare & MedTech | Autonomous diagnostic agents tuning clinical decision support models, EU MDR compliance automation  | Diagnostic accuracy on validated test sets | **1M–12M** (EU MDR liability + diagnostic throughput) |

### 5.4 Revenue Model

How KYA generates revenue for Lifetime Oy:

| Revenue Stream                  | Unit Economics                                              | Scale Driver                                 |
| ------------------------------- | ----------------------------------------------------------- | -------------------------------------------- |
| **Verification Events**         | EUR 1.20 per KYA verification event                         | Agent sessions x industries x frequency      |
| **Continuous Monitoring**       | EUR 0.30 per L5 webhook processed                           | Risk signal volume from Shufti/IDV           |
| **Fault Attribution**           | EUR 5.00 per fault investigation record                     | Incident frequency x severity                |
| **Compliance Certificates**     | EUR 500 per quarterly KYA compliance cert                   | Enterprise count x quarterly cycles          |
| **Insurance Premium Reduction** | 8–15% cyber insurance discount                              | KYA-certified enterprises get lower premiums |
| **SaaS Platform** (v1.7)        | Monthly subscription: EUR 499–1,999/mo (Enterprise: custom) | Customer count x tier                        |
| **API Transactions** (v1.7)     | Per agent operation — usage-based                           | Agent sessions x operations x frequency      |

### Alpha-Share — Enterprise World Tier 4 Only (v1.7)

> **SCOPE CHANGE (v1.7):** Alpha-Share is no longer offered to standard DWS6 SaaS customers (Tiers 1–3). It is reserved exclusively for **Enterprise World** customers at pricing **Tier 4** — large-scale industrial deployments where value-based pricing is understood and preferred. Standard customers use SaaS subscription + API transaction fees.

**Alpha-Share Decline-to-Scale Model (Enterprise World Tier 4):**

| Gain Bracket          | Revenue Share | Rationale                                            |
| --------------------- | ------------- | ---------------------------------------------------- |
| First EUR 1M in gains | **12%**       | High-touch onboarding, proof-of-value phase          |
| EUR 1M–10M            | **8%**        | Established value, scaling phase                     |
| Above EUR 10M         | **5%**        | Enterprise-scale; lower share retains large accounts |

**Why Tier 4 only:** Alpha-Share requires sophisticated buyers who understand value-based pricing. SaaS-era customers see revenue sharing as risk, not alignment. Enterprise World customers — large industrials, sovereign deployments — see it as proof that DWS has skin in the game.

**Performance Guarantee (all tiers):**

| Layer                     | Term Used             | Mechanism                                                           | Procurement Impact                |
| ------------------------- | --------------------- | ------------------------------------------------------------------- | --------------------------------- |
| SaaS (Tiers 1–3)          | SLA Credit            | Service credit issued on verified production fault within 30 days   | **Standard** — industry norm      |
| Enterprise World (Tier 4) | Performance Guarantee | Service credit equal to that period's Alpha-Share on verified fault | **Positive** — signals confidence |

**Verification Credit Rebate (Enterprise World Tier 4 only):** 10% of all Alpha-Share revenue is returned to the client as **"Verification Credits"** — redeemable against KYA-S verification events (EUR 1.20/event). This creates a flywheel: the more an agent optimizes (KYA-O), the more security verification the client can afford (KYA-S)

### 5.5 Platform Revenue Projections (19 Industries, 2026–2030)

| Year                           | Enterprises on KYA | Avg. KYA Events/yr | Revenue (EUR M) |
| ------------------------------ | ------------------ | ------------------ | --------------- |
| 2026 (launch)                  | 10–25              | 50,000             | 0.6–1.5M        |
| 2027 (CBAM + ETS2 + Wedge)     | 60–150             | 80,000             | 5.8–14.4M       |
| 2028 (EPBD + Fintech/Pharma)   | 150–400            | 120,000            | 21.6–57.6M      |
| 2030 (Fit for 55 + full wedge) | 400–1,000          | 200,000            | 96M–240M        |

**Cumulative projected impact: EUR 18–48 billion annual protected/created value across 19 sectors by 2030** through KYA-governed agent swarms. Tracked automatically via Firehorse → Supabase revenue-attribution tables.

### 5.6 Insurance & Liability Reduction

**Cyber Insurance:**

- KYA-certified agent deployments qualify for **8–15% premium reduction** on cyber liability policies
- Forensic observability (KYA Security v1.1 Pillar 3) provides the evidence trail insurers require for claims defense
- Fault attribution separates agent liability from operator liability — reducing blanket coverage requirements

**Regulatory Penalty Avoidance:**

- EU AI Act Art. 99(4): fines up to **EUR 15M or 3% of annual global turnover** for high-risk deployer non-compliance (Art. 99(3): EUR 35M/7% for Art. 5 prohibited practices)
- NIS2 Directive: fines up to **EUR 10M or 2% of annual global turnover**
- GDPR: fines up to **EUR 20M or 4% of annual global turnover**
- KYA's audit trail + identity attribution provides the "reasonable measures" defense

**D&O Insurance (Directors & Officers) (v1.6):**

- KYA positions as a "safe harbor" against **personal liability** for AI hallucinations or autonomous financial loss
- Board members deploying AI agents without documented Art. 12 + Art. 26 evidence face personal liability under EU AI Act Art. 99(4) and national corporate governance codes
- KYA-S certification demonstrates "reasonable measures" — targeting **8–12% D&O premium reduction**
- See `Legal/KYA_SECURITY_v1.2.md` §8.1 for full D&O safe harbor framework

**Parametric Insurance Integration (v1.6):**

- Automated verification of KYA Compliance Certificates (KYA-S) triggers **real-time adjustment** of operational risk premiums
- Target: **12% reduction** in "AI Malpractice" coverage costs for KYA-certified deployments
- Integration pattern: KYA-S issues certificate → Firehorse publishes compliance event → Insurer API receives structured proof → Premium adjusted programmatically
- This creates a third revenue flywheel: KYA-O gains → KYA-S certificates issued → insurance premiums drop → client ROI increases → more agents deployed

**Carbon Penalty Avoidance:**

- ETS non-compliance: **EUR 100/tCO2 penalty** (on top of market price, currently ~EUR 60/tCO2)
- CBAM miscalculation: retroactive border adjustment + administrative fines
- KYA-governed agents produce auditable carbon calculations — reducing misreporting risk

### 5.7 Financial Value per KYA Layer

| KYA Layer                     | Financial Value                                          | Who Pays                          |
| ----------------------------- | -------------------------------------------------------- | --------------------------------- |
| **L1** — Identity Attribution | Legal liability assignment → insurance discount          | Enterprise (platform fee)         |
| **L2** — Agent Provenance     | Supply chain risk reduction → vendor trust               | Enterprise (per-agent fee)        |
| **L3** — Capability Gating    | Prevents unauthorized access → avoided breach costs      | Enterprise (platform fee)         |
| **L4** — Runtime Behavior     | Real-time anomaly detection → prevented incidents        | Enterprise (monitoring fee)       |
| **L5** — Continuous Risk      | Regulatory compliance evidence → penalty avoidance       | Enterprise + Insurer (shared)     |
| **Autoresearch** (v1.4)       | Self-optimization ROI → efficiency gains → revenue share | Enterprise + Lifetime Oy (shared) |

### 5.8 Competitive Moat: Why KYA Cannot Be Replicated Cheaply

| Barrier                                       | Detail                                                                                                                                       |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hardware isolation**                        | Firecracker MicroVM expertise is rare; most competitors use container-level isolation (breakable)                                            |
| **Identity provider integration**             | Shufti/IDV webhook pipeline is live; competitors would need 6–12 months to integrate                                                         |
| **20-industry regulatory + domain knowledge** | Lifetime World Model encodes 15k+ EU regulations + fintech/pharma/cyber/medtech domain models — competitors would need to build from scratch |
| **Forensic audit trail**                      | Firehorse is a purpose-built telemetry system, not a bolted-on logging library                                                               |
| **Fault attribution**                         | No competitor has automated liability mapping between agent layers                                                                           |
| **Autoresearch governance** (v1.4)            | No competitor has governed self-optimization with financial attribution at scale                                                             |

### 5.9 Competitive Positioning

#### 5.9.1 Emerging Competitors (v1.6)

| Competitor                         | Strength                                             | KYA Advantage                                                                                                 |
| ---------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Weights & Biases (W&B) Prompts** | Moving toward governance; strong experiment tracking | Lacks the "Hard No" of Firecracker isolation — W&B is observability, not containment. No hardware kill switch |
| **Arthur.ai**                      | AI observability and model monitoring                | Lacks Autonomous Hyperparameter Tuning protocol — observes but doesn't govern self-optimization               |
| **Arize AI**                       | ML observability, drift detection                    | Same gap as Arthur — no governed autoresearch, no financial attribution, no identity binding                  |
| **Guardrails AI**                  | LLM output validation                                | Software-level guardrails only; no hardware isolation, no identity attribution, no industrial domain models   |

**Key insight:** W&B/Arthur/Arize are **observability platforms** — they watch agents. KYA is a **governance platform** — it controls agents. In regulated industries, watching is not enough; you need the ability to kill at the hypervisor level in < 5ms.

#### 5.9.2 KYA vs Palantir AIP

**Palantir AIP** is the closest competitor on governed agentic pipelines for regulated industries. Direct comparison:

| Dimension                | Palantir AIP                                | KYA (DWS IQ)                                                                            | Advantage                      |
| ------------------------ | ------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------ |
| **Agent isolation**      | Software-layer guardrails (container-based) | Hardware-level kill (Firecracker MicroVM, < 125ms (Firecracker MicroVM, AWS benchmark)) | **KYA** — hardware > software  |
| **Identity attribution** | Enterprise SSO / Foundry permissions        | KYC/KYB-verified identity → agent session binding                                       | **KYA** — legally attributable |
| **Autoresearch**         | Not offered (manual model tuning)           | Governed self-optimization with financial attribution                                   | **KYA** — unique capability    |
| **EU compliance**        | Generic (GDPR, some SOC 2)                  | Native EU AI Act Art. 12/14, NIS2, DORA, Fit for 55                                     | **KYA** — EU-first             |
| **Revenue model**        | Platform license (annual contract)          | SaaS + API (Tiers 1–3); Alpha-Share for Enterprise World Tier 4                         | **KYA** — flexible pricing     |
| **Industry depth**       | Defense, healthcare, energy (3–5 deep)      | 20 industries with per-industry proxy metrics                                           | **KYA** — wider + deeper       |
| **Data residency**       | US-primary (FedRAMP)                        | EU-primary (Finland/Germany, GDPR-native)                                               | Context-dependent              |

**Key differentiator:** Palantir's guardrails are software-level permission checks. KYA kills at the hypervisor — sub-5ms behavioral enforcement, < 125ms (Firecracker MicroVM, AWS benchmark) hardware termination. In regulated industries, hardware kill > software kill.

---

## 6. The Agentic Efficiency Law & Stacking Effect

### 6.1 The Agentic Efficiency Law

Empirical evidence from autonomous agent research (see §7, Karpathy nanochat experiment, March 2026) demonstrates: an agent swarm found ~20 additive changes that an expert with decades of experience missed. This establishes a new law for KYA v1.4:

> **The Agentic Efficiency Law:** Human-tuned systems are, by definition, sub-optimal. An agent swarm can achieve ~11%+ efficiency gains on "well-tuned" systems simply by exploring the high-dimensional parameter space humans find too tedious to map.

**Implication for 20 industries:** Every industrial model deployed in the DWS10 Control Room is a "well-tuned" base state. KYA-governed autoresearch will find the ~11% the human engineers missed — in energy efficiency, emissions calculations, process optimization, trading alpha, drug discovery, and threat detection accuracy.

### 6.2 The Stacking Effect

Individual 0.5% gains are noise. Twenty stacked 0.5% gains are a **competitive moat**.

This is the core financial insight of KYA v1.4: autoresearch doesn't produce one big breakthrough — it produces dozens of small, additive improvements that compound into transformative performance:

| Gain per Change | Changes Stacked | Compound Effect | Industry Example                                           |
| --------------- | --------------- | --------------- | ---------------------------------------------------------- |
| 0.5%            | 5               | 2.5%            | Marginal ETS reporting accuracy                            |
| 0.5%            | 10              | 5.1%            | Noticeable CBAM cost reduction                             |
| 0.5%            | 20              | 10.5%           | **Competitive moat** — tender-winning efficiency           |
| 0.5%            | 30              | 16.1%           | **Market disruption** — fundamentally lower cost structure |

The stacking effect explains why autoresearch ROI compounds: early experiments yield modest gains, but the 700th experiment builds on all 699 previous improvements.

### 6.3 Technical Takeaways for Implementers

From empirical autoresearch results, three patterns apply directly to industrial optimization:

**1. Fix the Oversights**
Identify where your model is "parameterless" or "unscaled" and let the agent find the multipliers. In industrial models: un-tuned default thresholds, hardcoded constants from initial deployment, forgotten configuration parameters.

**2. Regularize the Value**
If your model has specialized embeddings (Value, Position, Industry-specific), they likely need more regularization than you think. In industrial models: compliance scoring weights, risk factor coefficients, carbon intensity multipliers.

**3. The Stacking Discipline**
Every improvement must be validated as additive before stacking. A change that improves one metric but degrades another is not a "win" — it's a trade-off that requires human review. KYA enforces this through the Firehorse audit trail: every delta is recorded, every stack is ranked.

---

## 7. Field Note: Karpathy Autoresearch (March 2026)

> _This field note is the empirical foundation for KYA v1.4 Pillar 4. Full analysis in `docs/field-notes/2026-03-10-karpathy-autoresearch-nanochat-agent-swarm.md`._

Andrej Karpathy reported (March 7, 2026) that he left an "autoresearch" agent running for ~2 days on his nanochat project (depth=12 model). The agent autonomously found ~20 changes that improved validation loss. All improvements were additive and transferred to larger (depth=24) models. Stacking all changes, the "Time to GPT-2" leaderboard metric dropped from 2.02 hours to 1.80 hours — an **11% improvement**.

### Key Findings

1. **QKnorm scaler missing** — Parameterless QKnorm didn't have a scaler multiplier, making attention too diffuse. The agent found multipliers to sharpen it.
2. **Value Embeddings regularization gap** — Value Embeddings needed regularization that wasn't being applied.
3. **Banded attention too conservative** — Parameters hadn't been tuned after initial implementation.
4. **AdamW betas misconfigured** — Optimizer hyperparameters were suboptimal.
5. **Weight decay schedule** — Agent found better weight decay scheduling.
6. **Network initialization** — Agent tuned initialization parameters.

### The Scaling Path (Karpathy's Words)

> "All LLM frontier labs will do this. It's the final boss battle... You spin up a swarm of agents, you have them collaborate to tune smaller models, you promote the most promising ideas to increasingly larger scales, and humans (optionally) contribute on the edges."

> "Any metric you care about that is reasonably efficient to evaluate (or that has more efficient proxy metrics such as training a smaller network) can be autoresearched by an agent swarm."

### KYA v1.4 Application

The above workflow is now natively supported inside every MicroVM. All 700+ change proposals, validation deltas, and stack rankings are captured in the Firehorse trail. Unauthorized or out-of-scope autoresearch attempts instantly drop ATS by 40 points and freeze the session.

**Source:** Andrej Karpathy, X/Twitter, March 2026 | github.com/karpathy/nanochat (autoresearch round 1 commit)

---

## 8. Autoresearch Optimization Protocol & Orchestrator Layer

### 8.1 The Orchestrator Layer

To move autoresearch from single-agent experiments to production-scale swarms, KYA v1.4 introduces the **Orchestrator Layer** — the system that manages the swarm, kills failing experiments early, and promotes the winners.

```
┌─────────────────────────────────────────────────────────────┐
│                    KYA ORCHESTRATOR                           │
│                                                             │
│  ┌─────────────┐                                            │
│  │ Experiment   │  Queue: 700+ proposed changes             │
│  │ Queue        │  Priority: expected delta x cost ratio    │
│  └──────┬──────┘                                            │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Worker a    │  │ Worker b    │  │ Worker g    │  ...    │
│  │ MicroVM     │  │ MicroVM     │  │ MicroVM     │        │
│  │ depth=12    │  │ depth=12    │  │ depth=12    │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                  │
│         └────────────────┼────────────────┘                  │
│                          ▼                                   │
│  ┌───────────────────────────────────────┐                  │
│  │ Validation Gate                        │                  │
│  │ * Delta > improvement_threshold?       │                  │
│  │ * Additive with previous winners?      │                  │
│  │ * Within budget cap?                   │                  │
│  │ * No security regression?              │                  │
│  └──────┬─────────────────┬──────────────┘                  │
│    PASS │            FAIL │                                  │
│         ▼                 ▼                                  │
│  ┌─────────────┐  ┌─────────────┐                          │
│  │ Promote to  │  │ Kill early  │  <- Save compute          │
│  │ depth=24    │  │ Log reason  │  <- Firehorse records     │
│  │ (staging)   │  │ Next in Q   │                          │
│  └──────┬──────┘  └─────────────┘                          │
│         │                                                    │
│         ▼                                                    │
│  ┌─────────────┐                                            │
│  │ Human Gate  │  72h staging -> production                  │
│  │ (required)  │  Financial attribution recorded            │
│  └─────────────┘                                            │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Orchestrator Rules

| Rule                  | Purpose                                                                            |
| --------------------- | ---------------------------------------------------------------------------------- |
| **Early termination** | Kill experiments that show no improvement after N iterations — save compute budget |
| **Priority queue**    | Rank experiments by expected delta x cost ratio — run cheapest high-impact first   |
| **Parallel workers**  | Multiple MicroVMs run experiments simultaneously — limited by budget cap           |
| **Winner promotion**  | Validated improvements are stacked and promoted to larger-scale validation         |
| **Failure learning**  | Failed experiments are logged; the swarm uses failures to plan next experiments    |

### 8.3 Tunable Parameters

KYA has multiple tunable parameters that directly affect security posture and financial performance:

| Parameter                     | Current Value           | Tunable Range      | Impact                                    |
| ----------------------------- | ----------------------- | ------------------ | ----------------------------------------- |
| ATS violation weight (Vx)     | 0.25                    | 0.10–0.40          | False positive rate vs security           |
| Latency penalty (L threshold) | 500ms                   | 200ms–1000ms       | Performance vs security                   |
| Denied access weight (Dx)     | 0.05                    | 0.02–0.15          | Agent usability vs lockdown               |
| Autoresearch bonus (Ax)       | 0.25 (capped; 0 if V>0) | 0.10–0.30          | Reward vs score inflation; Hard Stop gate |
| Trust recovery rate           | Manual                  | 0.01–0.10 per hour | Session uptime vs caution                 |
| Session TTL extension         | +5 on approval          | +1 to +10          | Session efficiency                        |
| Sandbox boot timeout          | 125ms                   | 50ms–500ms         | Cost vs cold-start                        |

### 8.4 Agent Swarm Optimization

Following the autoresearch methodology, DWS IQ deploys optimization agents to tune KYA parameters:

```
┌─────────────────────────────────────────────────────────┐
│              KYA Autoresearch Swarm                      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Agent a  │  │ Agent b  │  │ Agent g  │  ...        │
│  │ Tune ATS │  │ Tune TTL │  │ Tune     │             │
│  │ weights  │  │ schedule │  │ egress   │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │              │              │                    │
│       └──────────────┼──────────────┘                    │
│                      ▼                                   │
│            ┌──────────────────┐                          │
│            │ Validation       │                          │
│            │ Metric: ATS      │                          │
│            │ false-positive   │                          │
│            │ rate + breach    │                          │
│            │ detection rate   │                          │
│            └──────────────────┘                          │
│                      │                                   │
│                      ▼                                   │
│            ┌──────────────────┐                          │
│            │ Promote to       │                          │
│            │ larger-scale     │                          │
│            │ validation       │                          │
│            └──────────────────┘                          │
└─────────────────────────────────────────────────────────┘
```

### 8.5 Optimization Loop

1. **Small-scale experiment** — Agent tests parameter change on synthetic KYA sessions (1,000 events)
2. **Validation metric** — Measure false-positive rate, breach detection rate, session uptime, cost per event
3. **Additive check** — Verify improvements are additive (stack with other changes)
4. **Promote** — Apply validated changes to staging environment with real agent traffic
5. **Production** — After 72h staging with no regressions, promote to production

### 8.6 Target Metrics for Autoresearch

| Metric                         | Current Baseline | Optimization Target | Financial Impact                                    |
| ------------------------------ | ---------------- | ------------------- | --------------------------------------------------- |
| False-positive suspension rate | ~5%              | < 2%                | +EUR 30k/yr per enterprise (reduced agent downtime) |
| Breach detection latency       | < 1s             | < 200ms             | Insurance premium reduction                         |
| Session uptime                 | 94%              | > 98%               | +EUR 15k/yr per enterprise (productivity)           |
| Verification cost per event    | EUR 1.20         | < EUR 0.80          | +33% margin improvement                             |
| Sandbox boot time              | 125ms            | < 80ms              | Better UX, higher adoption                          |

---

## 9. Proxy-to-Scale Mapping

A core principle of autoresearch is that **cheap proxy experiments predict expensive real-world outcomes**. This section standardizes the proxy-to-scale mapping for each industry.

### 9.1 The Pattern

```
depth=12 (cheap, fast, proxy)  →  depth=24 (expensive, slow, real)
```

In Karpathy's work, depth=12 models served as proxies for depth=24 models. Changes that improved depth=12 transferred to depth=24. KYA v1.4 formalizes this for industrial applications.

### 9.2 Industry Proxy Mappings

| Industry      | Proxy (depth=12 equivalent)        | Scale (depth=24 equivalent)     | Transfer Confidence             |
| ------------- | ---------------------------------- | ------------------------------- | ------------------------------- |
| Power & Heat  | 100-node grid simulation (1h)      | Full national grid model (72h)  | High (linear scaling)           |
| Iron & Steel  | Single-furnace energy model        | Multi-plant supply chain model  | High                            |
| Cement        | Kiln simulation (single batch)     | Multi-kiln quarterly production | Medium-High                     |
| Construction  | Single-building EN 15978 LCA       | Portfolio-wide lifecycle carbon | High                            |
| Maritime      | Single-voyage emissions model      | Fleet-wide annual emissions     | High                            |
| Fintech       | 1-hour synthetic market replay     | Live market trading (24h)       | Medium (regime sensitivity)     |
| Pharma        | 1,000-molecule binding screen      | 100,000-molecule full screen    | High (pharmacokinetic transfer) |
| Cybersecurity | 10,000-event synthetic SOC dataset | Live SOC feed (30-day window)   | Medium-High                     |

### 9.3 Proxy-to-Scale Integrity Tests (v1.6)

To ensure the 11% gains found at depth=12 actually hold at depth=24, v1.6 adds two mandatory integrity tests:

**Spectral Convergence Test:** Verification that the gradient flow remains stable across scales during hyperparameter transfer. The Orchestrator runs eigenvalue analysis on the loss landscape at both depth=12 and depth=24. If the top-k eigenvalue ratio diverges by >20%, the transfer is flagged as **scale-unstable** and requires manual review before promotion.

```
spectral_ratio = eigenvalues_depth24[:k] / eigenvalues_depth12[:k]
If max(|spectral_ratio - 1.0|) > 0.20 → BLOCK transfer, require domain expert review
```

**Ablation Attribution:** The agent must provide a "Sensitivity Map" showing which specific change (e.g., QKnorm scaler, AdamW beta tuning) contributed what percentage of the A factor. This prevents opaque "black box" improvements.

| Validation                | Pass Condition                                                   | Fail Action                                                               |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Attribution linearity     | Sum of per-change contributions = total A factor (±5% tolerance) | A factor voided; improvements not promoted                                |
| Contribution monotonicity | Removing any single change reduces A (no hidden regressions)     | Offending change flagged for manual review                                |
| Hallucination check       | Claimed contributions must be reproducible in isolation          | If isolated reproduction fails, A is voided and AUTORESEARCH_FAULT logged |

### 9.4 Transfer Validation Protocol (Updated)

Before promoting proxy results to full-scale:

1. **Spearman Correlation check** — Proxy improvements must show Spearman rank correlation >0.90 with scale improvements on historical data (rank-based to resist outlier gaming)
2. **Distribution shift test (MANDATORY)** — Correlation >0.90 is necessary but not sufficient. Before promotion, run a Kolmogorov-Smirnov test + Jensen-Shannon divergence check between proxy and production data distributions. If JS divergence > 0.15 or KS p-value < 0.05, the transfer is BLOCKED regardless of correlation score. This catches silent failures where proxy and production have different variance structures
3. **Confidence interval** — Estimated improvement range must be statistically significant (p < 0.05)
4. **Domain expert review** — Human specialist confirms the proxy-to-scale mapping is physically/logically valid
5. **Rollback plan** — Automatic 24h rollback if scale results diverge from proxy predictions by >2x

---

## 10. Autonomous Hyperparameter Tuning

This section standardizes how KYA-governed agents perform hyperparameter tuning across industrial models.

### 10.1 Tunable vs Non-Tunable Boundary

| Category                                                | Tunable by Autoresearch      | Requires Human Approval    |
| ------------------------------------------------------- | ---------------------------- | -------------------------- |
| Model hyperparameters (learning rate, batch size, etc.) | YES — within manifest bounds | NO (within declared range) |
| Business logic thresholds (compliance scoring weights)  | YES — proxy validated first  | YES (before production)    |
| Security parameters (ATS weights, egress rules)         | NO — never tunable by agents | YES (always human-gated)   |
| Infrastructure parameters (MicroVM boot, memory)        | NO — set by platform         | N/A                        |
| Data pipeline parameters (ETL schedules, batch sizes)   | YES — within manifest bounds | NO (within declared range) |

### 10.2 Tuning Protocol

```
┌─────────────────────────────────────────────────────────┐
│  Autonomous Hyperparameter Tuning Protocol               │
│                                                         │
│  1. Agent reads current hyperparameter state             │
│  2. Proposes change within manifest-declared range       │
│  3. Runs proxy experiment (depth=12 equivalent)          │
│  4. Measures target metric delta                         │
│  5. If delta > improvement_threshold:                    │
│     a. Log to Firehorse with full provenance             │
│     b. Stack with previous validated improvements        │
│     c. Run additivity check against all stacked changes  │
│     d. If additive → promote to staging queue            │
│  6. If delta <= 0 or regression:                         │
│     a. Log failure reason to Firehorse                   │
│     b. Revert to previous state                          │
│     c. Feed failure data to next experiment planning     │
│  7. Repeat until budget exhausted or convergence         │
└─────────────────────────────────────────────────────────┘
```

### 10.3 Budget Enforcement

| Budget Type      | Enforcement Point             | Default Limit          |
| ---------------- | ----------------------------- | ---------------------- |
| Experiment count | Orchestrator queue            | 700 per session        |
| Compute hours    | VMM-level timer               | 48h per session        |
| Token usage      | LLM API gateway               | 10M tokens per session |
| Cost ceiling     | Financial attribution tracker | EUR 5,000 per session  |
| Wall clock time  | Session TTL                   | 72h maximum            |

---

## 11. Ownership & Attribution Clarification

### 11.1 What We Own

**Lifetime Oy owns the KYA governance layer:**

- The KYA Standard (this document and `Legal/KYA_SECURITY_v1.2.md`)
- The Agent Trust Score formula and engine (`src/identity/ats-engine.ts`)
- The Orchestrator Layer architecture
- The Firehorse forensic audit trail
- The Capability Manifest schema (v1.1, v1.2)
- The fault attribution framework
- The financial value model and revenue projections
- The Agentic Efficiency Law and Stacking Effect as applied to KYA governance
- The Proxy-to-Scale Mapping methodology for industrial applications
- The integration of autoresearch within enterprise governance frameworks

### 11.2 What We Do Not Own

**The autoresearch methodology itself is an emerging field with multiple contributors:**

- Andrej Karpathy's nanochat autoresearch experiment (March 2026) is **cited as empirical evidence**, not claimed as Lifetime Oy intellectual property
- The concept of agent swarms optimizing neural networks is a general research direction pursued by multiple labs
- Karpathy's specific findings (QKnorm scaler, Value Embeddings regularization, etc.) are his work on his project

**Attribution Footnote (v1.6):** _"Optimization principles derived from open-source Karpathy nanochat research (March 2026); KYA provides the governance wrapper for autonomous implementation in regulated enterprise environments. The Agentic Efficiency Law and Stacking Effect are Lifetime Oy's formalization of observed empirical patterns, not claims on the underlying methodology."_

### 11.3 Our Contribution

Lifetime Oy's contribution is the **governance layer** that makes autoresearch enterprise-safe:

- Identity attribution for every experiment
- Budget caps and scope locks
- Financial attribution for efficiency gains
- Forensic audit trails for regulatory compliance
- Fault classification when autoresearch produces regressions
- The Orchestrator Layer that manages swarms at scale

**In short:** The research community develops the capability. We develop the governance that makes it deployable in regulated industries.

---

## 12. Memory-Driven Financial Intelligence (v1.7)

_Added: 23.03.2026 | PR-254 (agent-memory-fact-extraction)_

The Agent Memory System (PR-254) creates a new data feed for the KYA-O financial layer. Previously, financial optimization relied on aggregated industry metrics and ERP data. With fact extraction, agents now build **per-customer financial profiles** from every interaction — enabling personalized ROI calculations, retention risk scoring, and upsell opportunity detection.

### 12.1 Dual Memory Architecture for Financial Value

| Memory Layer      | Financial Intelligence                                                | KYA-O Impact                                      |
| ----------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| **LWM (Domain)**  | Industry benchmarks, regulatory thresholds, emission factors          | Powers the 20-industry financial value layer (§5) |
| **Client Memory** | Customer-specific facts: revenue, preferences, deadlines, pain points | Enables per-customer Proxy-to-Scale mapping (§9)  |

**Key insight:** LWM tells you "CBAM threshold is €150K" (domain knowledge). Client memory tells you "ACME Corp's CBAM exposure is €2.3M and their CFO wants quarterly reports" (relationship knowledge). The combination enables financial optimization that neither could achieve alone.

### 12.2 Fact-to-Value Pipeline

```
Conversation: "We need to reduce CBAM exposure by Q3, budget is €500K"
  ↓ Fact extraction (PR-254)
  ↓
Facts stored:
  {subject: "customer", predicate: "cbam_deadline", value: "Q3 2026", confidence: 1.0}
  {subject: "customer", predicate: "compliance_budget", value: "500000", confidence: 1.0}
  ↓
Financial agent retrieves facts + LWM benchmarks:
  - CBAM sector average: €1.2M exposure
  - Customer stated budget: €500K
  - Deadline: Q3 2026 (6 months)
  ↓
Personalized recommendation:
  "Phase 1 CBAM optimization: €180K, 45% exposure reduction in 3 months"
```

### 12.3 Memory-Enhanced Financial Metrics

| Metric             | Without Client Memory      | With Client Memory                                                    |
| ------------------ | -------------------------- | --------------------------------------------------------------------- |
| ROI calculation    | Industry average (generic) | Customer-specific (personalized)                                      |
| Retention risk     | Binary (active/churned)    | Scored by engagement pattern + stated concerns                        |
| Upsell timing      | Quarterly batch            | Triggered by extracted facts ("budget approved", "expansion planned") |
| Compliance urgency | Regulatory calendar        | Customer-specific deadlines + stated priorities                       |

### 12.4 Governance (KYA-S §10 Cross-Reference)

All memory-derived financial intelligence is governed by the Memory Audit Trail (`Legal/KYA_SECURITY_v1.2.md` §10):

- Every fact extraction is logged with agent_id and source_text_hash
- Financial recommendations citing client memory facts carry provenance chain
- Customer-facing reports include fact attribution: "Based on your stated budget of €500K (conversation, 23.03.2026)"
- GDPR Article 22: automated decisions based on profiling require transparency — memory provenance provides it

---

## 13. Agentic Commerce Mandate Gating — Human Not Present as Revenue Gate (v1.9)

_Added: 07.07.2026 | PR: claude/kya-mandate-evidence-migration-mq7hnp | Source of truth: `Legal/KYA_STANDARD_v1.md` §14. Companion: `Legal/KYA_SECURITY_v1.2.md` §12 (enforcement/violation side)._

§3.2's Financial Multiplier table already prices trust: a higher ATS band unlocks a higher OPEX-savings multiplier because the enterprise trusts that agent's autoresearch output enough to bill against it. Agentic commerce mandates (§14) add a second, more direct financial dimension to the same trust tier — **Human Not Present (HNP) execution is not a compliance checkbox, it's a revenue gate.** An agent that can transact unattended is worth more to the enterprise than one that requires a human in the loop for every payment, because unattended execution is what makes 24/7 procurement, restocking, and subscription-management agents commercially viable at all. KYA prices that capability the same way it prices autoresearch: by trust tier, never unconditionally.

### 13.1 Spend Authority as a Financial Multiplier Dimension

Extending §3.2's table with the mandate dimension from KYA_STANDARD_v1.md §14.2:

| ATS Range | Financial Multiplier (§3.2) | Mandate Privileges (§14.2)               | HNP (unattended revenue)      | Commercial Interpretation                                                                                             |
| --------- | --------------------------- | ---------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| >= 0.90   | 1.8–3.2x OPEX savings/yr    | Intent + Cart + Payment                  | **Allowed** (within ceilings) | Unattended commerce agent — bills for 24/7 execution, not just advisory output                                        |
| 0.80–0.89 | 1.8–3.2x OPEX savings/yr    | Intent + Cart + Payment                  | Denied — human confirms       | Attended commerce agent — still transacts, but the human-confirmation step caps throughput (and thus billable volume) |
| 0.50–0.79 | 1.3–2.0x                    | Intent + Cart only (human signs Payment) | Denied                        | Assembly-only agent — the human signature step is the revenue ceiling, not the agent's judgment                       |
| < 0.50    | —                           | **No mandates**                          | Denied                        | No commerce revenue — NO_GO applies to spend the same as it applies to autoresearch                                   |

**Reading the table (Boardy's framing):** the CISO's "No" still gates the CFO's "More" (§3.1's V>0 Hard Stop applies identically to mandate privileges — a security violation zeroes both the autoresearch multiplier and all spend authority). But above the security floor, HNP is the mechanism that turns a trust score into a _volume_ lever, not just a _confidence_ lever: an attended agent (0.80–0.89) and an unattended agent (>=0.90) can have near-identical per-transaction accuracy, yet the unattended agent generates materially more billable transaction volume because it doesn't wait on a human per transaction. Selling KYA-gated HNP is selling throughput, priced by trust.

### 13.2 Tenant Gating Profiles Are a Commercial Lever, Not Just a Compliance One

§14.2.1's tenant policy profiles (tighten-only, two immovable floors) let a customer's procurement or risk team set their own HNP ceiling and per-band confirmation thresholds — but every tightening is a **conscious trade of throughput for control**. This is a sales conversation, not just a security one: the Aegis tier's default (HNP disabled, human-signed Payment Mandates regardless of ATS, KYA_STANDARD_v1.md §14.2.1) is a defence/dual-use customer explicitly choosing lower commerce throughput in exchange for zero unattended-spend exposure. Account teams should read a tenant's gating profile the way they'd read a usage tier: it tells you the ceiling on that customer's realistic commerce-agent revenue before any product conversation happens.

### 13.3 Related Artefacts

- `Legal/KYA_STANDARD_v1.md` §14 — the mandate gating policy (protocol-neutral, public document)
- `Legal/KYA_SECURITY_v1.2.md` §12 — enforcement/violation side (mandate revocation, evidence chain)
- `src/identity/ats-engine.ts` — `evaluateMandateGate()`, spend-authority evaluation
- `supabase/migrations/074_kya_mandate_evidence_chain.sql` — evidence-chain schema backing both sides (authored, not applied)

---

## 14. Conclusion

The KYA Architecture Standard v1.7 (KYA-O) delivers **agent self-optimization governance** — the financial, optimization, and orchestration layers that transform agent self-improvement from a research curiosity into an enterprise-grade competitive moat with audit trails CISOs trust and efficiency gains CTOs measure.

Three principles govern this architecture:

- **The Agentic Efficiency Law** guarantees that every deployed model has room for improvement — ~11%+ that human engineers systematically miss
- **The Stacking Effect** guarantees that those improvements compound — twenty 0.5% gains become a 10.5% competitive moat
- **The Orchestrator Layer** manages the swarm at scale — killing failures early, promoting winners, and enforcing budget discipline

Combined with **KYA governance** (identity attribution, capability gating, forensic observability from `Legal/KYA_SECURITY_v1.2.md`), every optimization is attributed, auditable, and owned. Financial value flows through 20 industries — from EU climate compliance to fintech, pharma, and cybersecurity.

**Implement today. The swarm is already tuning. KYA makes sure it stays yours.**

---

### Related Documents

- `Legal/KYA_SECURITY_v1.2.md` — Companion: Know Your Agent v1.5 (REQUIRED FOUNDATION, §10 Memory Audit Trail)
- `DWS_SECURITY_STANDARD.md` — Section 18: KYA & BYO Agent Security
- `Admin/ADMIN_MANUAL_AGENT_MEMORY_EN_v1.md` — Agent Memory System operations manual
- `src/agents/fact-extraction.service.ts` — Fact extraction pipeline (PR-254)
- `src/agents/memory.service.ts` — Memory store/recall/forget/profile service
- `docs/field-notes/2026-03-10-karpathy-autoresearch-nanochat-agent-swarm.md` — Autoresearch methodology field note
- `16-INDUSTRIES.md` — 16 EU-regulated industries
- `src/identity/ats-engine.ts` — ATS engine implementation

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Platform:** dws10.com
**Legal Hub:** Legal/

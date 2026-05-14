# Field Note: KYA Financial Projections — 20-Industry Value Model

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/kya-standard-review-W3Qcg | Date: 15.03.2026 | Changes: Alpha-Share updated to Decline-to-Scale (12%/8%/5%). Performance Guarantee replaces Clawback language. D&O Insurance investor section added (§6). Carbon Credit Arbitrage cross-referenced. Synced with KYA-O v1.6
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/improve-kya-standard-M25rz | Date: 10.03.2026 | Changes: Extracted from KYA-NIST-SP-003 to keep standards documents credibility-focused. Contains revenue model, per-industry financial impact, EU-wide projections, Alpha-Share pricing

Document Status:
  - Created: 10.03.2026
  - Last Modified: 15.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: INTERNAL
  - Classification: CONFIDENTIAL — Business Projections
  - Document Type: Field Note / Financial Model

Related Documents:
  - Legal/KYA_NIST_OPTIMIZATION_v1.md (Source: stripped from §5 to separate business from standards)
  - Legal/KYA_OPTIMIZATION_v1.4.md (Full financial layer retained in source)
  - INVESTOR_DOCUMENTATION.md (Investor-facing version)

***

## Why Separate?

Financial projections in a NIST standards document weaken credibility. Standards reviewers evaluate technical merit, not revenue potential. Keeping financial models separate:
1. NIST reviewers see clean technical architecture
2. Investors/partners see dedicated financial analysis
3. Numbers can be updated independently without re-submitting standards

---

## 1. Revenue Model

| Revenue Stream | Unit Economics | Enforcement |
|---------------|---------------|-------------|
| **Verification Events** | €1.20 per agent session verification | Per BYO agent, per session |
| **Fault Attribution** | €5.00 per fault classification | Automated liability assignment |
| **Compliance Certificates** | €500 per quarter per industry | CBAM, ETS, CSRD audit-ready reports |
| **Insurance Discounts** | 8–15% premium reduction | Actuarial data from ATS + Firehorse |
| **SaaS Platform** (v1.7) | €499–€1,999/mo subscription (Enterprise: custom) | Customer count x tier |
| **API Transactions** (v1.7) | Per agent operation — usage-based | Agent sessions x operations x frequency |
| **Alpha-Share** (Enterprise World Tier 4 only) | **Decline-to-Scale**: 12% (first €1M), 8% (€1M–€10M), 5% (above €10M) | Reserved for large-scale industrial deployments |
| **Performance Guarantee** | Service credit on verified production fault within 30 days | All tiers: SLA credit; Tier 4: Alpha-Share credit |
| **Verification Credit Rebate** | 10% of Alpha-Share returned as KYA-S verification credits | Enterprise World Tier 4 only |

---

## 2. Per-Industry Financial Impact (EUR/year per enterprise)

### Tier 1 — Critical Emissions (Fit for 55 Core)

| Industry | Autoresearch Gain | Value/Enterprise/Year |
|----------|-------------------|----------------------|
| Power & Heat | 9–15% efficiency | €560k–€2.2M |
| Iron & Steel | 11–15% efficiency | €1M–€5.1M |
| Cement & Lime | 10–14% process | €524k–€3.1M |
| Chemicals | 9–13% efficiency | €848k–€4.2M |
| Aviation | 7–12% fuel | €230k–€1.1M |
| Maritime | 8–12% fuel | €336k–€1.6M |
| Road Transport | 9–12% fleet | €272k–€1.1M |
| Construction | 11–22% predictive | €1.1M–€5.4M |

### Tier 2 — Important Emissions

| Industry | Autoresearch Gain | Value/Enterprise/Year |
|----------|-------------------|----------------------|
| Agriculture | 8–11% yield | €230k–€950k |
| Waste Management | 9–13% throughput | €280k–€1.2M |
| Aluminium | 10–14% energy | €780k–€3.8M |
| Pulp & Paper | 8–12% process | €350k–€1.5M |
| Petroleum Refining | 9–13% energy | €1.2M–€6.1M |
| Food & Beverage | 7–11% cold chain | €180k–€780k |
| Glass & Ceramics | 8–12% kiln | €290k–€1.3M |
| Mining | 9–14% fleet + blast | €520k–€2.8M |

### Tier 3 — Wedge Industries

| Industry | Autoresearch Gain | Value/Enterprise/Year |
|----------|-------------------|----------------------|
| Fintech & Trading | 12–18% latency | €2M–€50M |
| Pharma & Biotech | 15–22% trial design | €5M–€45M |
| Cybersecurity | 10–16% alert tuning | €500k–€3M |
| Healthcare & MedTech | 12–20% diagnostic | €1M–€12M |

---

## 3. Projected EU-Wide Impact

| Year | KYA-Governed Agents | Annual Value Protected/Created |
|------|--------------------|---------------------------------|
| 2026 | 500–1,000 | €0.6M–€2M |
| 2027 | 5,000–15,000 | €12M–€45M |
| 2028 | 50,000–150,000 | €240M–€900M |
| 2029 | 500,000–1M | €2.4B–€9B |
| 2030 | 2M–5M | €18B–€48B |

---

## 4. Governance Overhead Economics

From the Agentic Efficiency Law:

```
Governance cost: ~€0.02/agent/hour for KYA
```

At scale (1M agents):
- Annual governance cost: €175M
- Annual value created: €2.4B–€9B
- **ROI: 14–51x**

The governance overhead is linear; the value created scales logarithmically with agent count but is amplified by the Stacking Effect (3–7% additional from cross-agent learning via shared Firehorse audit trails).

---

## 5. Key Assumptions & Risks

| Assumption | Risk Level | Mitigation |
|-----------|-----------|-----------|
| 2M–5M agents by 2030 | HIGH | Conservative: 500k agents still yields €2.4B |
| Alpha-Share acceptance (Tier 4 only) | LOW | Scoped to Enterprise World Tier 4; standard customers use SaaS + API pricing |
| Autoresearch gains hold at scale | MEDIUM | Helsinki Sandbox proves proxy; production validation Q3 2026 |
| EU regulatory enforcement timeline | LOW | CBAM already in transitional phase; full enforcement 2026 |

---

## 6. D&O Insurance — Risk Mitigation for Investor Note

*This section is designed to drop into the risk mitigation section of the investor deck. It addresses a direct, quantifiable cost saving that board members and risk officers understand immediately.*

### The Liability Problem

Under EU AI Act Article 99, **directors and officers are personally liable** for AI systems deployed without adequate governance. Fines up to EUR 35M or 7% of annual global turnover. National corporate governance codes add personal exposure for board members who approved autonomous agent deployments without documented controls.

This is not theoretical. The first AI Act enforcement actions are expected Q3–Q4 2026. Every board member approving AI agent deployments is exposed.

### How KYA-S Creates a Safe Harbor

KYA-S (Know Your Agent — Security Standard) provides the three evidence layers D&O insurers require:

| Evidence Layer | What It Proves | D&O Relevance |
|---------------|---------------|---------------|
| **Identity Attribution** | *Which agent* produced the output — not "our AI" | Isolates director decision from agent failure |
| **Fault Attribution** | Separates LOGIC_FAULT (agent) from OPERATOR_FAULT (human) from MANIFEST_FAULT (configuration) | Proves the board's governance framework was adequate even when an agent fails |
| **Behavioral Guardrails** | Pre-execution controls were active (< 5ms enforcement) | Demonstrates "reasonable measures" — the legal standard for safe harbor |

### Quantified Impact

| Metric | Value | Basis |
|--------|-------|-------|
| **D&O Premium Reduction** | 8–12% | Based on comparable governance framework discounts in cyber liability (comparable: SOC 2 certification yields 5–15% cyber premium reduction) |
| **Target Enterprises** | Every KYA-certified enterprise with board-approved AI deployments | EU AI Act applies to all "deployers" — not just "providers" |
| **Revenue Model** | Included in KYA-S platform fee — no separate D&O product | D&O savings are a **selling accelerator**, not a revenue stream |

### Investor Messaging

> **One-liner:** "Every board member deploying AI agents without KYA is personally liable under EU AI Act Article 99. KYA-S provides the documented governance that D&O insurers require for safe harbor — targeting 8–12% premium reduction."

> **Expansion:** KYA doesn't sell D&O insurance. It provides the evidence package that makes D&O insurance cheaper. Identity attribution proves which agent failed. Fault attribution proves the board's governance was adequate. Behavioral guardrails prove controls were active before the agent acted. This is the "reasonable measures" defense — the legal standard for personal liability safe harbor across EU member states.

### Why This Matters Now

- EU AI Act full enforcement: August 2026
- First D&O claims on AI governance expected: Q4 2026–Q1 2027
- Insurers are already pricing "AI governance deficit" into D&O premiums
- KYA-S certification is positioned to be the SOC 2 equivalent for AI agent governance

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Classification:** CONFIDENTIAL — Business Projections
